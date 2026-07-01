import { useState } from 'react'

// ============================================
// Задание 13.4: API Layer
// ============================================

// TODO: Реализуйте API layer:
//   Typed request/response DTOs (отдельно от domain entities!)
//   Маппинг DTO -> Domain и Domain -> DTO
//   Error mapping: domain errors -> HTTP status codes
//   Middleware для логирования и обработки ошибок

export function Task13_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== API Layer ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('API Layer')
    log.push('  ... DTO, маппинг domain <-> DTO, error -> HTTP status')
    log.push('  ... middleware pipeline')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.4: API Layer</h2>
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
