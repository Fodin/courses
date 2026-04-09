import { useState } from 'react'

// ============================================
// Задание 5.3: Rate Limiting
// Task 5.3: Rate Limiting
// ============================================

// TODO: Реализуйте rate limiting middleware
// TODO: Implement rate limiting middleware
// TODO: Используйте алгоритм Token Bucket или Fixed Window
// TODO: Use Token Bucket or Fixed Window algorithm
// TODO: Храните счетчики в Map (в памяти) с TTL
// TODO: Store counters in Map (in-memory) with TTL
// TODO: Верните заголовки: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After
// TODO: Return headers: X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After

export function Task5_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Rate Limiting ===')
    log.push('')

    // TODO: Реализуйте rateLimit({ windowMs: 60000, max: 100 })
    // TODO: Implement rateLimit({ windowMs: 60000, max: 100 })
    // TODO: Определяйте клиента по IP (req.ip) или API key
    // TODO: Identify client by IP (req.ip) or API key
    // TODO: Верните 429 Too Many Requests при превышении лимита
    // TODO: Return 429 Too Many Requests when limit exceeded
    // TODO: Покажите sliding window vs fixed window алгоритмы
    // TODO: Show sliding window vs fixed window algorithms
    log.push('Rate Limiting')
    log.push('  ... rateLimit({ windowMs: 60_000, max: 100 })')
    log.push('  ... key: req.ip или req.headers["x-api-key"]')
    log.push('  ... 429: { error: "Too many requests", retryAfter: 30 }')
    log.push('  ... X-RateLimit-Limit: 100, X-RateLimit-Remaining: 0')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Rate Limiting</h2>
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
