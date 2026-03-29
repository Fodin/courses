import { useState } from 'react'

// ============================================
// Задание 9.4: Redis Pub/Sub
// ============================================

// TODO: Реализуйте Pub/Sub через Redis для масштабирования WebSocket
// TODO: Создайте publisher и subscriber Redis клиенты
// TODO: Покажите паттерн: HTTP endpoint публикует -> WebSocket рассылает
// TODO: Продемонстрируйте работу с несколькими инстансами сервера

export function Task9_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Redis Pub/Sub ===')
    log.push('')

    // TODO: Создайте pub = new Redis(), sub = new Redis() (отдельные клиенты!)
    // TODO: sub.subscribe("notifications") и sub.on("message", handler)
    // TODO: pub.publish("notifications", JSON.stringify(event))
    // TODO: Покажите масштабирование: 3 сервера подписаны на один канал
    log.push('Redis Pub/Sub')
    log.push('  ... const pub = new Redis(), sub = new Redis()')
    log.push('  ... sub.subscribe("notifications")')
    log.push('  ... sub.on("message", (channel, message) => broadcast(message))')
    log.push('  ... pub.publish("notifications", JSON.stringify({ type: "new_order" }))')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 9.4: Redis Pub/Sub</h2>
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
