import { useState } from 'react'

// ============================================
// Задание 5.1: Logging
// ============================================

// TODO: Реализуйте logging middleware для HTTP-запросов
// TODO: Логируйте: method, url, status, response time, content-length
// TODO: Используйте формат Combined Log Format (как в Apache/Nginx)
// TODO: Добавьте request ID (X-Request-Id) для трассировки

export function Task5_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Logging Middleware ===')
    log.push('')

    // TODO: Реализуйте requestLogger middleware с замером времени
    // TODO: Используйте morgan-подобный формат логирования
    // TODO: Генерируйте уникальный requestId через crypto.randomUUID()
    // TODO: Покажите structured logging (JSON) vs text format
    log.push('Logging Middleware')
    log.push('  ... requestId: crypto.randomUUID()')
    log.push('  ... [2024-01-15T10:30:00Z] GET /api/users 200 45ms')
    log.push('  ... JSON: { method, url, status, duration, requestId }')
    log.push('  ... res.on("finish") для логирования после ответа')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Logging</h2>
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
