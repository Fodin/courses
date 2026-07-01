import { useState } from 'react'

// ============================================
// Задание 6.1: Result / Either
// ============================================

// TODO: Create class Ok<T> with:
// - readonly _tag = 'ok'
// - constructor(readonly value: T)
// - map<U>(fn: (value: T) => U): Result<U, never>
// - flatMap<U, E2>(fn: (value: T) => Result<U, E2>): Result<U, E2>
// - match<R>(handlers: { ok: (value: T) => R; err: (error: never) => R }): R

// TODO: Create class Err<E> with:
// - readonly _tag = 'err'
// - constructor(readonly error: E)
// - map<U>(_fn: (value: never) => U): Result<U, E>
// - flatMap<U, E2>(_fn: (value: never) => Result<U, E2>): Result<never, E | E2>
// - match<R>(handlers: { ok: (value: never) => R; err: (error: E) => R }): R

// TODO: Define type Result<T, E> = Ok<T> | Err<E>

// TODO: Create helper function ok<T>(value: T): Result<T, never>

// TODO: Create helper function err<E>(error: E): Result<never, E>

// TODO: Create function fromThrowable<T>(fn: () => T): Result<T, Error>
// - Wrap fn() in try/catch
// - Return ok(fn()) on success
// - Return err(e instanceof Error ? e : new Error(String(e))) on failure

export function Task6_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create basic Ok and Err values, log their _tag and value/error

    // TODO: Demonstrate map — ok(5).map(x => x * 2) and err("fail").map(...)

    // TODO: Create parseNumber and validatePositive functions returning Result
    // TODO: Chain them with flatMap: ok("42").flatMap(parseNumber).flatMap(validatePositive)
    // TODO: Show successful chain and two failure cases ("abc", "-5")

    // TODO: Demonstrate match on ok and err values

    // TODO: Use fromThrowable to safely wrap JSON.parse
    // TODO: Show success case '{"name":"Alice"}' and failure case 'invalid json'

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Result / Either</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
