import { useState } from 'react'

// ============================================
// Задание 14.1: BullMQ
// ============================================

// TODO: Настройте очереди задач через BullMQ (Redis-based)
// TODO: Создайте Queue, Worker и QueueEvents
// TODO: Реализуйте отложенные задачи: email отправка, обработка изображений
// TODO: Покажите повторные попытки (retry), backoff и dead letter queue

export function Task14_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== BullMQ Job Queue ===')
    log.push('')

    // TODO: Создайте const queue = new Queue("emails", { connection: redis })
    // TODO: Добавьте задачу: queue.add("send-welcome", { userId, email })
    // TODO: Создайте Worker для обработки задач
    // TODO: Настройте attempts: 3, backoff: { type: "exponential", delay: 1000 }
    log.push('BullMQ')
    log.push('  ... const queue = new Queue("emails", { connection })')
    log.push('  ... queue.add("send-welcome", { to, subject, body }, { attempts: 3 })')
    log.push('  ... const worker = new Worker("emails", async (job) => { ... })')
    log.push('  ... backoff: exponential 1s -> 2s -> 4s, then dead letter')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.1: BullMQ</h2>
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
