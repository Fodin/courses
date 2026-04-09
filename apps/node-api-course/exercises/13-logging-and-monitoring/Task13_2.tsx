import { useState } from 'react'

// ============================================
// Задание 13.2: Winston
// Task 13.2: Winston
// ============================================

// TODO: Настройте Winston логгер с multiple transports / Set up Winston logger with multiple transports
// TODO: Создайте transports: Console, File, HTTP (для сервисов вроде Datadog) / Create transports: Console, File, HTTP (for services like Datadog)
// TODO: Реализуйте кастомный format с timestamp и JSON / Implement custom format with timestamp and JSON
// TODO: Покажите log rotation через winston-daily-rotate-file / Show log rotation via winston-daily-rotate-file

export function Task13_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Winston Logger ===')
    log.push('')

    // TODO: Создайте winston.createLogger({ transports: [...] }) / Create winston.createLogger({ transports: [...] })
    // TODO: Настройте Console transport с colorize для dev / Configure Console transport with colorize for dev
    // TODO: Настройте File transport с maxsize и maxFiles / Configure File transport with maxsize and maxFiles
    // TODO: Реализуйте кастомный format: combine(timestamp, json) / Implement custom format: combine(timestamp, json)
    log.push('Winston')
    log.push('  ... winston.createLogger({ level: "info", transports: [...] })')
    log.push('  ... new winston.transports.File({ filename: "error.log", level: "error" })')
    log.push('  ... format: combine(timestamp(), json())')
    log.push('  ... DailyRotateFile: maxSize "20m", maxFiles "14d"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.2: Winston</h2>
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
