# Async-генераторы и итерация

## Зачем они нужны

Представьте конвейер на заводе: детали движутся с одной станции на другую, и каждая станция может работать в своём темпе. Но что если между станциями нужно ждать — например, деталь проходит покраску, и следующая партия поступает только когда предыдущая высохла? Обычный генератор тут не справится: `yield` синхронный. Async-генератор — это конвейер, где каждый шаг может ждать асинхронной операции.

## async function* — объявление

```js
async function* fetchAllPages(url) {
  let page = 1
  while (true) {
    const data = await fetch(`${url}?page=${page}`).then(r => r.json())
    yield data.items
    if (!data.hasMore) break
    page++
  }
}
```

Ключевые отличия от обычного генератора:
- `async function*` вместо `function*`
- Внутри можно использовать `await`
- Каждый вызов `.next()` возвращает `Promise<{ value, done }>`, а не `{ value, done }`

## for-await-of — потребление

```js
// Обычный for-of не работает с async-генераторами
// for (const page of fetchAllPages(url)) // TypeError!

// Правильно — for-await-of
for await (const items of fetchAllPages(url)) {
  render(items)  // вызов .next() происходит автоматически
}
```

`for-await-of` ждёт каждый Promise перед тем как запросить следующее значение. Это и есть backpressure: потребитель контролирует темп.

## AsyncIterator protocol

Под капотом async-генератор реализует протокол AsyncIterator:

```js
const gen = fetchAllPages('/api/items')

// Ручное потребление:
const result1 = await gen.next()
// { value: [...items], done: false }

const result2 = await gen.next()
// { value: [...items], done: false }

const result3 = await gen.next()
// { value: undefined, done: true }
```

Объект реализует `Symbol.asyncIterator` — благодаря этому `for-await-of` знает как с ним работать.

## Symbol.asyncIterator — кастомные итерируемые

Любой объект может стать асинхронно итерируемым:

```js
const eventStream = {
  [Symbol.asyncIterator]() {
    let id = 0
    return {
      async next() {
        await delay(100)
        if (id >= 10) return { value: undefined, done: true }
        return { value: { id: id++, ts: Date.now() }, done: false }
      }
    }
  }
}

for await (const event of eventStream) {
  console.log(event)
}
```

## Реальные применения

**Пагинация API** — самый распространённый кейс:

```js
async function* paginate(url) {
  let cursor = null
  do {
    const res = await fetch(cursor ? `${url}?cursor=${cursor}` : url)
    const json = await res.json()
    yield json.items
    cursor = json.nextCursor
  } while (cursor)
}
```

**Чтение файла по строкам** (Node.js):

```js
import { createReadStream } from 'fs'
import { createInterface } from 'readline'

async function* readLines(path) {
  const rl = createInterface({ input: createReadStream(path) })
  for await (const line of rl) {
    yield line
  }
}
```

**Server-Sent Events** — потоковые данные от сервера:

```js
async function* sseStream(url) {
  const res = await fetch(url)
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    yield decoder.decode(value)
  }
}
```

## Async-генератор vs ReadableStream

| Критерий | Async Generator | ReadableStream |
|----------|----------------|----------------|
| Синтаксис | Простой, нативный JS | API потоков, более verbose |
| Backpressure | Встроенный (через await) | Встроенный (через pull) |
| Отмена | `break` + `.return()` | `reader.cancel()` |
| Композиция | Функции высшего порядка | `.pipeThrough()` |
| Браузер | Везде | Везде |
| Node.js | Везде | Есть, но немного другой API |

## Backpressure: потребитель задаёт темп

```js
async function* fastProducer() {
  for (let i = 0; ; i++) {
    await delay(10)  // генерирует каждые 10мс
    yield i
  }
}

// Медленный потребитель — производитель ждёт:
for await (const value of fastProducer()) {
  await processSlowly(value)  // 500мс на элемент
  // следующий yield происходит только ПОСЛЕ processSlowly
}
```

Это фундаментальное отличие от событий (EventEmitter) или Observable: при перегрузке никакого "потопа" данных — источник просто ждёт.

## Отмена через break

```js
for await (const event of eventStream()) {
  if (event.type === 'stop') break  // вызывает gen.return()
}
// Генератор получает сигнал завершения через .return()
// Блоки finally выполняются — ресурсы освобождаются
```

## Ошибки

```js
async function* unreliable() {
  yield 1
  throw new Error('Сеть недоступна')
  yield 2  // никогда не выполнится
}

try {
  for await (const val of unreliable()) {
    console.log(val)
  }
} catch (err) {
  console.error(err.message)  // 'Сеть недоступна'
}
```

## Распространённые ошибки

❌ **Забыть await при вызове .next()**

```js
// Плохо — result будет Promise, не { value, done }
const result = gen.next()
console.log(result.value)  // undefined
```

```js
// Хорошо
const result = await gen.next()
console.log(result.value)  // реальное значение
```

❌ **Использовать for-of вместо for-await-of**

```js
// Плохо — TypeError: gen is not iterable
for (const page of fetchAllPages()) { ... }

// Хорошо
for await (const page of fetchAllPages()) { ... }
```

❌ **Не освобождать ресурсы при отмене**

```js
// Плохо — соединение остаётся открытым
async function* stream() {
  const ws = new WebSocket(url)
  while (true) yield await nextMessage(ws)
}

// Хорошо — finally закрывает соединение
async function* stream() {
  const ws = new WebSocket(url)
  try {
    while (true) yield await nextMessage(ws)
  } finally {
    ws.close()  // вызывается при break или return()
  }
}
```
