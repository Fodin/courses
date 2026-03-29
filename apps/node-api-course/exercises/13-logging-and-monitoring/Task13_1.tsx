import { useState } from 'react'

// ============================================
// Задание 13.1: Pino
// ============================================

// TODO: Настройте Pino как основной логгер для Node.js API
// TODO: Создайте child loggers с контекстом: requestId, userId
// TODO: Настройте уровни логирования: trace, debug, info, warn, error, fatal
// TODO: Покажите pino-pretty для dev и JSON для production

export function Task13_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Pino Logger ===')
    log.push('')

    // TODO: Создайте const logger = pino({ level: "info" })
    // TODO: Реализуйте request logger через logger.child({ requestId })
    // TODO: Покажите serializers для безопасного логирования (исключение паролей)
    // TODO: Настройте pino-http для автоматического логирования запросов
    log.push('Pino')
    log.push('  ... const logger = pino({ level: "info", transport: { target: "pino-pretty" } })')
    log.push('  ... const reqLogger = logger.child({ requestId, userId })')
    log.push('  ... reqLogger.info({ userId: 42 }, "User logged in")')
    log.push('  ... serializers: { req: (req) => ({ method, url }) }')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.1: Pino</h2>
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
