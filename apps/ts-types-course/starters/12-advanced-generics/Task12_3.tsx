import { useState } from 'react'

// ============================================
// Задание 12.3: Curried Generics
// ============================================

// TODO: Создайте каррированную generic функцию:
//   function curry<A, B, C>(fn: (a: A, b: B) => C): (a: A) => (b: B) => C
//   curry((a: number, b: string) => `${a}-${b}`)(42)('hello') → '42-hello'

// TODO: Создайте generic pipe/compose:
//   function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
//   function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
//   function pipe<A, B, C, D>(fn1, fn2, fn3): (a: A) => D
//   Используйте overloads для type-safe pipe

// TODO: Создайте частичное применение generics:
//   function partial<T extends unknown[], R, A extends unknown[]>(
//     fn: (...args: [...A, ...T]) => R, ...applied: A
//   ): (...rest: T) => R

// TODO: Создайте type-safe EventEmitter с generic методами:
//   class TypedEmitter<Events extends Record<string, unknown[]>> {
//     on<K extends keyof Events>(event: K, handler: (...args: Events[K]) => void): void
//     emit<K extends keyof Events>(event: K, ...args: Events[K]): void
//   }

// TODO: Создайте Builder с fluent generics (тип растёт с каждым вызовом):
//   createBuilder().field('name', String).field('age', Number).build()
//   Результат типизирован как { name: string; age: number }

export function Task12_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте curry:
    // const add = curry((a: number, b: number) => a + b)
    // const add5 = add(5)
    // log.push(`curry(add)(5)(3) → ${add5(3)}`)
    // log.push(`curry(add)(5)(10) → ${add5(10)}`)

    // TODO: Протестируйте pipe:
    // const transform = pipe(
    //   (s: string) => s.length,
    //   (n: number) => n * 2,
    //   (n: number) => `Result: ${n}`
    // )
    // log.push(`pipe(length, *2, format)('hello') → "${transform('hello')}"`)

    // TODO: Протестируйте TypedEmitter:
    // interface Events {
    //   login: [userId: string]
    //   message: [from: string, text: string]
    //   error: [code: number, message: string]
    // }
    // const emitter = new TypedEmitter<Events>()
    // emitter.on('login', (userId) => log.push(`Login: ${userId}`))
    // emitter.on('message', (from, text) => log.push(`${from}: ${text}`))
    // emitter.emit('login', 'user-42')
    // emitter.emit('message', 'Alice', 'Hello!')

    // TODO: Протестируйте fluent Builder:
    // const schema = createBuilder()
    //   .field('name', String)
    //   .field('age', Number)
    //   .build()
    // log.push(`Builder schema: ${JSON.stringify(schema)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 12.3: Curried Generics</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
