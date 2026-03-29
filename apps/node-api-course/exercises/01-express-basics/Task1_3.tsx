import { useState } from 'react'

// ============================================
// Задание 1.3: Error Handling
// ============================================

// TODO: Реализуйте централизованную обработку ошибок в Express
// TODO: Создайте кастомные классы ошибок: AppError, NotFoundError, ValidationError
// TODO: Реализуйте error middleware (err, req, res, next) с 4 параметрами
// TODO: Покажите async error handling с express-async-errors или try/catch

export function Task1_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Handling ===')
    log.push('')

    // TODO: Создайте class AppError extends Error { statusCode, isOperational }
    // TODO: Реализуйте errorHandler middleware
    // TODO: Покажите проброс ошибок из async-хэндлеров
    // TODO: Различите operational vs programming errors
    log.push('Error Handling')
    log.push('  ... class AppError extends Error { statusCode: number }')
    log.push('  ... app.use((err, req, res, next) => { ... })')
    log.push('  ... throw new NotFoundError("User not found")')
    log.push('  ... operational error -> клиенту, programming -> логируем')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Error Handling</h2>
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
