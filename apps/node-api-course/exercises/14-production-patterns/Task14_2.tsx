import { useState } from 'react'

// ============================================
// Задание 14.2: Cron Jobs
// ============================================

// TODO: Реализуйте периодические задачи через node-cron или BullMQ repeatable
// TODO: Настройте cron-выражения: каждую минуту, час, день
// TODO: Реализуйте задачу очистки: удаление устаревших сессий/токенов
// TODO: Покажите защиту от дублирования при нескольких инстансах

export function Task14_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cron Jobs ===')
    log.push('')

    // TODO: Используйте node-cron: cron.schedule("0 * * * *", task)
    // TODO: Или BullMQ: queue.add("cleanup", {}, { repeat: { cron: "0 * * * *" } })
    // TODO: Реализуйте cleanupExpiredSessions() с порогом 24h
    // TODO: Покажите distributed lock через Redis для предотвращения дублирования
    log.push('Cron Jobs')
    log.push('  ... cron.schedule("0 */6 * * *", cleanupExpiredSessions)')
    log.push('  ... queue.add("report", {}, { repeat: { cron: "0 9 * * 1" } })')
    log.push('  ... distributed lock: SET lock:cleanup NX EX 60')
    log.push('  ... cron: minute hour day month weekday')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.2: Cron Jobs</h2>
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
