import { useState } from 'react'

// ============================================
// Задание 6.2: State Data Association
// ============================================

// TODO: Определите FetchState<T, E> как discriminated union:
//   idle: пустое состояние
//   loading: { startedAt: number }
//   success: { data: T, fetchedAt: number }
//   error: { error: E, failedAt: number, retryCount: number }
// TODO: Создайте конструкторы: idle(), loading(startedAt), success(data), error(err, retryCount)
// TODO: Реализуйте mapFetchState — трансформация data в success состоянии
// TODO: Реализуйте foldFetchState — exhaustive обработка всех состояний

export function Task6_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== State Data Association ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('FetchState: data associated with states')
    log.push('  ... проведите через idle -> loading -> success -> error')
    log.push('  ... покажите type narrowing: в success доступен data, в error — error')
    log.push('  ... mapFetchState: User[] -> string[]')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: State Data Association</h2>
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
