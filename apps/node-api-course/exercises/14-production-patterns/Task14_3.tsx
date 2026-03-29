import { useState } from 'react'

// ============================================
// Задание 14.3: Graceful Shutdown
// ============================================

// TODO: Реализуйте graceful shutdown для Node.js сервера
// TODO: Обработайте SIGTERM и SIGINT сигналы
// TODO: Остановите прием новых запросов, дождитесь завершения текущих
// TODO: Закройте все соединения: DB pool, Redis, WebSocket

export function Task14_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Graceful Shutdown ===')
    log.push('')

    // TODO: Обработайте process.on("SIGTERM", gracefulShutdown)
    // TODO: Вызовите server.close() для остановки приема новых соединений
    // TODO: Дождитесь завершения in-flight запросов с таймаутом
    // TODO: Закройте pool.end(), redis.quit(), wss.close()
    log.push('Graceful Shutdown')
    log.push('  ... process.on("SIGTERM", async () => { ... })')
    log.push('  ... server.close() -> stop accepting new connections')
    log.push('  ... await Promise.all([pool.end(), redis.quit()])')
    log.push('  ... setTimeout(() => process.exit(1), 10_000) // force kill')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.3: Graceful Shutdown</h2>
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
