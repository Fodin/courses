import { useState } from 'react'

// ============================================
// Задание 9.1: Error Hierarchy
// ============================================

// TODO: Определите BaseAppError { _tag, message, timestamp }
// TODO: Создайте 5 типов ошибок (extends BaseAppError):
//   ValidationError { field, rule }, NetworkError { url, statusCode },
//   NotFoundError { resource, id }, AuthorizationError { requiredRole, currentRole },
//   RateLimitError { retryAfterMs }
// TODO: Объедините в AppError union
// TODO: Реализуйте formatError (exhaustive switch), isRetryable, createError<T>

export function Task9_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Hierarchy ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Error Hierarchy')
    log.push('  ... создайте все типы ошибок, отформатируйте, проверьте retryable')
    log.push('  ... покажите type narrowing через _tag')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.1: Error Hierarchy</h2>
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
