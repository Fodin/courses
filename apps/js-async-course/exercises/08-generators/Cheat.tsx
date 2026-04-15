// ============================================
// Cheat Sheet — Level 8: Генераторы
// ============================================
// Справочник по синтаксису и паттернам. Не является заданием.
// Syntax and patterns reference. Not a task.

// ---- Объявление генератора / Declaring a generator ----

// function* name() — генераторная функция (фабрика)
// Generator<YieldType, ReturnType, NextType> — полная типизация в TS

function* counter(): Generator<number, string, unknown> {
  let n = 0
  while (true) {
    yield n++
  }
  return 'done' // ReturnType
}

// ---- next(), return(), throw() ----

const gen = counter()
gen.next()               // { value: 0, done: false }
gen.next()               // { value: 1, done: false }
gen.return('стоп')       // { value: 'стоп', done: true }
gen.next()               // { value: undefined, done: true } — всегда после завершения

// ---- Двусторонняя связь / Two-way communication ----

function* echo(): Generator<string, void, string> {
  let msg = yield 'ready'    // первый next() запускает до сюда
  while (msg !== 'quit') {
    msg = yield `echo: ${msg}`
  }
}

const e = echo()
e.next()          // { value: 'ready', done: false }  ← первый вызов без аргумента
e.next('hello')   // { value: 'echo: hello', done: false }
e.next('world')   // { value: 'echo: world', done: false }
e.next('quit')    // { value: undefined, done: true }

// ---- yield* делегирование / yield* delegation ----

function* a() { yield 1; yield 2; return 'fromA' }
function* b() {
  const result = yield* a()   // result = 'fromA' (return-значение)
  yield result                  // yield 'fromA'
}
// [...b()] === [1, 2, 'fromA']

// ---- Бесконечные последовательности / Infinite sequences ----

function* naturals(start = 0): Generator<number> {
  while (true) yield start++
}

function* take<T>(n: number, iterable: Iterable<T>): Generator<T> {
  let count = 0
  for (const value of iterable) {
    if (count++ >= n) return
    yield value
  }
}

function* filter<T>(pred: (v: T) => boolean, iterable: Iterable<T>): Generator<T> {
  for (const value of iterable) {
    if (pred(value)) yield value
  }
}

// Pipeline
const evens = take(5, filter((n) => n % 2 === 0, naturals()))
// [...evens] === [0, 2, 4, 6, 8]

// ---- Генератор как итерируемый объект / Generator as iterable ----

function* range(from: number, to: number): Generator<number> {
  for (let i = from; i <= to; i++) yield i
}

for (const n of range(1, 5)) { /* 1, 2, 3, 4, 5 */ }
const arr = [...range(1, 3)]    // [1, 2, 3]
const [first, second] = range(10, 20) // first=10, second=11

// ---- Генератор как state machine / Generator as state machine ----

type Light = 'red' | 'green' | 'yellow'

function* trafficLight(): Generator<Light, void, string> {
  while (true) {
    yield 'red'
    yield 'green'
    yield 'yellow'
  }
}

const light = trafficLight()
light.next().value  // 'red'
light.next().value  // 'green'
light.next().value  // 'yellow'
light.next().value  // 'red'  — цикл

// ---- try/finally в генераторе / try/finally in generator ----
// finally выполняется при: исчерпании, return(), throw(), break в for...of

function* withCleanup(): Generator<number> {
  try {
    yield 1
    yield 2
    yield 3
  } finally {
    console.log('cleanup!')  // выполнится даже при break
  }
}

for (const v of withCleanup()) {
  if (v === 1) break  // → 'cleanup!'
}

// ---- Symbol.iterator: кастомный iterable / Custom iterable ----

class InfiniteRange {
  constructor(private start: number) {}

  [Symbol.iterator]() {
    return this._gen()
  }

  private *_gen(): Generator<number> {
    let n = this.start
    while (true) yield n++
  }
}

const inf = new InfiniteRange(5)
const first5 = [...take(5, inf)]  // [5, 6, 7, 8, 9]

// ---- Паттерн co: генератор + промисы / co pattern: generator + promises ----

function co<T>(genFn: () => Generator<Promise<unknown>, T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const gen = genFn()

    function step(fn: (arg: unknown) => IteratorResult<unknown, T>, arg: unknown) {
      let result: IteratorResult<unknown, T>
      try { result = fn(arg) }
      catch (e) { return reject(e) }

      if (result.done) return resolve(result.value as T)

      Promise.resolve(result.value).then(
        (v) => step(gen.next.bind(gen), v),
        (e) => step(gen.throw.bind(gen), e)
      )
    }

    step(gen.next.bind(gen), undefined)
  })
}

// Использование / Usage:
// co(function* () {
//   const user = yield fetch('/api/user').then(r => r.json())
//   const posts = yield fetch(`/api/posts/${user.id}`).then(r => r.json())
//   return posts
// })
