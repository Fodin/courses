import { useState } from 'react'

// ============================================
// Задание 9.2: Error Boundaries
// ============================================

// TODO: Определите Result<T, E> = { ok: true, value: T } | { ok: false, error: E }
// TODO: Создайте конструкторы ok<T>(value) и err<E>(error)
// TODO: Реализуйте createBoundary<E>(config) с методами:
//   run<T>(fn) -> Result<T, E> — оборачивает синхронную функцию
//   runAsync<T>(fn) -> Promise<Result<T, E>> — оборачивает async
//   config: { name, catch: (unknown) => E, onError?: (E) => void }
// TODO: Создайте domainBoundary (-> DomainError) и infraBoundary (-> InfraError)

export function Task9_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Boundaries ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Error Boundaries')
    log.push('  ... покажите success и error для каждого boundary')
    log.push('  ... DomainError { code, message } vs InfraError { service, operation, cause }')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.2: Error Boundaries</h2>
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
