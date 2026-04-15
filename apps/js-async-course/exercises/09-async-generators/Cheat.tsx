// ============================================
// Cheat Sheet — Level 9: Async-генераторы и итерация
// ============================================
// Справочник по синтаксису и паттернам. Не является заданием.
// Syntax and patterns reference. Not a task.

// ---- Объявление async-генератора / Declaring an async generator ----

// async function* — ключевые слова
// AsyncGenerator<YieldType, ReturnType, NextType> — полная типизация в TS

async function* asyncCounter(): AsyncGenerator<number, string, unknown> {
  let n = 0
  while (true) {
    await new Promise((r) => setTimeout(r, 100))  // можно await внутри
    yield n++
  }
  return 'done'
}

// ---- .next() возвращает Promise / .next() returns Promise ----

async function exampleNext() {
  const gen = asyncCounter()

  const r1 = await gen.next()  // Promise<{ value: 0, done: false }>
  const r2 = await gen.next()  // Promise<{ value: 1, done: false }>
  await gen.return('стоп')     // Promise<{ value: 'стоп', done: true }>
}

// ---- for-await-of — основной способ потребления ----

async function exampleForAwait() {
  async function* range(from: number, to: number) {
    for (let i = from; i <= to; i++) {
      await new Promise((r) => setTimeout(r, 50))
      yield i
    }
  }

  // for-of НЕ работает с async-генераторами — нужен for-await-of
  for await (const n of range(1, 5)) {
    console.log(n)  // 1, 2, 3, 4, 5 — с паузами
  }
}

// ---- Пагинация API / API pagination ----

interface Page<T> {
  items: T[]
  hasMore: boolean
  cursor?: string
}

async function* paginate<T>(url: string): AsyncGenerator<T[]> {
  let cursor: string | undefined = undefined

  while (true) {
    const endpoint = cursor ? `${url}?cursor=${cursor}` : url
    const res = await fetch(endpoint)
    const page: Page<T> = await res.json()

    yield page.items

    if (!page.hasMore || !page.cursor) break
    cursor = page.cursor
  }
}

// Использование / Usage:
// for await (const items of paginate<User>('/api/users')) {
//   await processItems(items)
// }

// ---- Symbol.asyncIterator — кастомный AsyncIterable ----

interface AsyncRange {
  [Symbol.asyncIterator](): AsyncIterator<number>
}

function createAsyncRange(from: number, to: number, delayMs = 100): AsyncRange {
  return {
    [Symbol.asyncIterator]() {
      let current = from
      return {
        async next(): Promise<IteratorResult<number>> {
          await new Promise((r) => setTimeout(r, delayMs))
          if (current > to) return { value: undefined, done: true }
          return { value: current++, done: false }
        },
        async return(): Promise<IteratorResult<number>> {
          return { value: undefined, done: true }
        },
      }
    },
  }
}

// for await (const n of createAsyncRange(1, 5)) { ... }

// ---- Pipeline из async-генераторов / Pipeline of async generators ----

async function* map<T, U>(
  upstream: AsyncIterable<T>,
  fn: (v: T) => U | Promise<U>
): AsyncGenerator<U> {
  for await (const item of upstream) {
    yield await fn(item)
  }
}

async function* filterAsync<T>(
  upstream: AsyncIterable<T>,
  pred: (v: T) => boolean
): AsyncGenerator<T> {
  for await (const item of upstream) {
    if (pred(item)) yield item
  }
}

async function* takeAsync<T>(
  upstream: AsyncIterable<T>,
  n: number
): AsyncGenerator<T> {
  let count = 0
  for await (const item of upstream) {
    yield item
    if (++count >= n) break  // вызывает .return() на upstream
  }
}

async function* flatMap<T, U>(
  upstream: AsyncIterable<T>,
  fn: (v: T) => AsyncIterable<U>
): AsyncGenerator<U> {
  for await (const item of upstream) {
    for await (const sub of fn(item)) {
      yield sub
    }
  }
}

// Функция pipe для композиции / pipe function for composition:
function pipe<T>(
  source: AsyncIterable<T>,
  ...transforms: Array<(s: AsyncIterable<unknown>) => AsyncGenerator<unknown>>
): AsyncGenerator<unknown> {
  return transforms.reduce(
    (stream, transform) => transform(stream),
    source as AsyncIterable<unknown>
  ) as AsyncGenerator<unknown>
}

// ---- Обработка ошибок / Error handling ----

async function* resilient<T>(
  upstream: AsyncIterable<T>
): AsyncGenerator<{ value: T; error: null } | { value: null; error: string }> {
  for await (const item of upstream) {
    try {
      // какая-то обработка / some processing
      yield { value: item, error: null }
    } catch (e) {
      yield { value: null, error: String(e) }
    }
  }
}

// ---- Cleanup через finally / Cleanup via finally ----

async function* withResource(): AsyncGenerator<string> {
  const connection = { close: () => console.log('Соединение закрыто') }
  try {
    yield 'data1'
    yield 'data2'
    yield 'data3'
  } finally {
    // Вызывается при: завершении, break, gen.return(), исключении
    // Called on: completion, break, gen.return(), exception
    connection.close()
  }
}

// break в for-await-of → gen.return() → выполняется finally
// break in for-await-of → gen.return() → finally executes
async function exampleCleanup() {
  for await (const data of withResource()) {
    if (data === 'data1') break  // 'Соединение закрыто' будет выведено
  }
}

// ---- Node.js Readable как AsyncIterable / Node.js Readable as AsyncIterable ----

// import { createReadStream } from 'fs'
// import { createInterface } from 'readline'
//
// async function* readLines(path: string): AsyncGenerator<string> {
//   const rl = createInterface({ input: createReadStream(path) })
//   for await (const line of rl) {
//     yield line
//   }
// }

// ---- Fetch + ReadableStream + async iteration ----

async function* streamResponse(url: string): AsyncGenerator<string> {
  const response = await fetch(url)
  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      yield decoder.decode(value, { stream: true })
    }
  } finally {
    reader.cancel()
  }
}

// ---- Backpressure — потребитель контролирует темп ----

async function exampleBackpressure() {
  async function* fastProducer(): AsyncGenerator<number> {
    for (let i = 0; ; i++) {
      await new Promise((r) => setTimeout(r, 10))  // 10мс между тиками
      yield i
    }
  }

  // Медленный потребитель автоматически замедляет производителя
  // Slow consumer automatically slows down the producer
  for await (const value of fastProducer()) {
    await new Promise((r) => setTimeout(r, 500))  // 500мс обработка
    console.log(value)
    if (value >= 5) break
  }
}

// ---- gen.throw() — бросаем ошибку в генератор ----

async function exampleThrow() {
  async function* gen() {
    try {
      yield 'before'
    } catch (e) {
      yield `caught: ${e}`
    }
    yield 'after'
  }

  const g = gen()
  await g.next()                          // { value: 'before', done: false }
  await g.throw(new Error('boom'))        // { value: 'caught: Error: boom', done: false }
  await g.next()                          // { value: 'after', done: false }
  await g.next()                          // { value: undefined, done: true }
}

// ---- Типизация TS / TypeScript typing ----

// AsyncGenerator<YieldType, ReturnType, NextType>
// AsyncIterable<T> — для объектов с [Symbol.asyncIterator]
// AsyncIterator<T> — для объектов с .next()

type AsyncIterableValue<T> = T extends AsyncIterable<infer V> ? V : never
// Пример: AsyncIterableValue<AsyncGenerator<User>> → User

// Хелпер для конвертации в массив / Helper to collect to array:
async function toArray<T>(iterable: AsyncIterable<T>): Promise<T[]> {
  const result: T[] = []
  for await (const item of iterable) {
    result.push(item)
  }
  return result
}
