import { useState } from 'react'

// ============================================
// Задание 3.4: API Versioning
// ============================================

// TODO: Реализуйте версионирование API тремя способами
// TODO: URL versioning: /api/v1/users, /api/v2/users
// TODO: Header versioning: Accept: application/vnd.myapi.v2+json
// TODO: Покажите стратегию миграции между версиями

export function Task3_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== API Versioning ===')
    log.push('')

    // TODO: Реализуйте URL-based versioning через роутеры
    // TODO: Реализуйте header-based versioning через middleware
    // TODO: Покажите deprecation headers: Sunset, Deprecation
    // TODO: Продемонстрируйте обратную совместимость при изменении схемы
    log.push('API Versioning')
    log.push('  ... app.use("/api/v1", v1Router)')
    log.push('  ... app.use("/api/v2", v2Router)')
    log.push('  ... Header: Accept-Version: 2')
    log.push('  ... Response: Deprecation: true, Sunset: Sat, 01 Jan 2027')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: API Versioning</h2>
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
