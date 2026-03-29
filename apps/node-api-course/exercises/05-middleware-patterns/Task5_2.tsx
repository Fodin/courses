import { useState } from 'react'

// ============================================
// Задание 5.2: CORS
// ============================================

// TODO: Реализуйте CORS middleware вручную (без библиотек)
// TODO: Обработайте preflight OPTIONS-запросы
// TODO: Настройте Access-Control-Allow-Origin, Methods, Headers
// TODO: Покажите разницу между simple и preflight запросами

export function Task5_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CORS Middleware ===')
    log.push('')

    // TODO: Реализуйте corsMiddleware с настраиваемым whitelist origins
    // TODO: Обработайте OPTIONS запрос -> 204 с CORS-заголовками
    // TODO: Покажите credentials: true и его влияние на wildcard origin
    // TODO: Настройте Access-Control-Max-Age для кэширования preflight
    log.push('CORS Middleware')
    log.push('  ... Access-Control-Allow-Origin: https://example.com')
    log.push('  ... Access-Control-Allow-Methods: GET, POST, PUT, DELETE')
    log.push('  ... OPTIONS preflight -> 204 No Content')
    log.push('  ... credentials: true запрещает wildcard "*" origin')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: CORS</h2>
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
