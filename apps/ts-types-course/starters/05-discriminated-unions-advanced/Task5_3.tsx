import { useState } from 'react'

// ============================================
// Задание 5.3: Algebraic Data Types
// ============================================

// TODO: Реализуйте тип Option<T> — представление nullable значений:
//   type Option<T> = { tag: 'Some'; value: T } | { tag: 'None' }
// TODO: Реализуйте конструкторы: some<T>(value: T): Option<T>, none: Option<never>

// TODO: Реализуйте функции для работы с Option:
//   map<T, U>(option: Option<T>, fn: (value: T) => U): Option<U>
//   getOrElse<T>(option: Option<T>, defaultValue: T): T
//   flatMap<T, U>(option: Option<T>, fn: (value: T) => Option<U>): Option<U>

// TODO: Реализуйте тип Result<T, E> — представление результата с ошибкой:
//   type Result<T, E> = { tag: 'Ok'; value: T } | { tag: 'Err'; error: E }
// TODO: Реализуйте конструкторы: ok<T>(value: T): Result<T, never>, err<E>(error: E): Result<never, E>

// TODO: Реализуйте функции для Result:
//   mapResult<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E>
//   matchResult<T, E, R>(result: Result<T, E>, onOk: (v: T) => R, onErr: (e: E) => R): R

export function Task5_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Протестируйте Option:
    // const userName: Option<string> = some('Alice')
    // const noUser: Option<string> = none
    //
    // const upperName = map(userName, s => s.toUpperCase())
    // log.push(`map(some('Alice'), toUpper) → ${JSON.stringify(upperName)}`)
    // log.push(`map(none, toUpper) → ${JSON.stringify(map(noUser, s => s.toUpperCase()))}`)
    //
    // log.push(`getOrElse(some('Alice'), 'default') → ${getOrElse(userName, 'default')}`)
    // log.push(`getOrElse(none, 'default') → ${getOrElse(noUser, 'default')}`)

    // TODO: Протестируйте Result:
    // function safeDivide(a: number, b: number): Result<number, string> {
    //   return b === 0 ? err('Division by zero') : ok(a / b)
    // }
    //
    // const good = safeDivide(10, 2)
    // const bad = safeDivide(10, 0)
    // log.push(`safeDivide(10, 2) → ${JSON.stringify(good)}`)
    // log.push(`safeDivide(10, 0) → ${JSON.stringify(bad)}`)
    //
    // log.push(`matchResult(ok) → ${matchResult(good, v => `Value: ${v}`, e => `Error: ${e}`)}`)
    // log.push(`matchResult(err) → ${matchResult(bad, v => `Value: ${v}`, e => `Error: ${e}`)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Algebraic Data Types</h2>
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
