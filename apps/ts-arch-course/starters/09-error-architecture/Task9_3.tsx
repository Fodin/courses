import { useState } from 'react'

// ============================================
// Задание 9.3: Error Propagation
// ============================================

// TODO: Реализуйте ResultChain<T, E> — Result с методами цепочки:
//   map<U>(fn) -> ResultChain<U, E> — трансформация value
//   flatMap<U, E2>(fn) -> ResultChain<U, E | E2> — цепочка операций (ошибки накапливаются!)
//   mapError<E2>(fn) -> ResultChain<T, E2> — трансформация ошибки
//   unwrapOr(fallback) -> T — значение или fallback
//   match({ ok, err }) -> U — pattern matching
// TODO: Создайте операции: parseEmail, validateEmail, saveUser
//   Каждая возвращает свой тип ошибки — flatMap накапливает union ошибок

export function Task9_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Propagation ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Error Propagation')
    log.push('  ... покажите цепочку parseEmail.flatMap(validate).flatMap(save)')
    log.push('  ... success, fail at parse, fail at validation')
    log.push('  ... mapError для нормализации, unwrapOr для fallback')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.3: Error Propagation</h2>
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
