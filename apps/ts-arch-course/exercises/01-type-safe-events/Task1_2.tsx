import { useState } from 'react'

// ============================================
// Задание 1.2: Event Bus
// ============================================

// TODO: Реализуйте класс EventBus<TEvents> с поддержкой middleware:
//   - use(middleware) — добавить middleware в цепочку
//   - subscribe<K>(event, handler) -> () => void
//   - publish<K>(event, payload) — проходит через middleware перед доставкой
//   - getHistory() — возвращает лог всех событий { event, payload, timestamp }
//   - clearHistory()
//   Middleware сигнатура: (event, payload, next) => void
//   Если middleware не вызывает next(), событие блокируется
// TODO: Implement class EventBus<TEvents> with middleware support:
//   - use(middleware) — add middleware to the chain
//   - subscribe<K>(event, handler) -> () => void
//   - publish<K>(event, payload) — passes through middleware before delivery
//   - getHistory() — returns event log { event, payload, timestamp }
//   - clearHistory()
//   Middleware signature: (event, payload, next) => void
//   If middleware doesn't call next(), event is blocked

// TODO: Определите интерфейс OrderEvents:
//   'order:created': { orderId: string, items: string[], total: number }
//   'order:paid': { orderId: string, paymentMethod: string }
//   'order:shipped': { orderId: string, trackingNumber: string }
//   'order:delivered': { orderId: string, deliveredAt: number }
// TODO: Define OrderEvents interface with the events above

export function Task1_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Event Bus ===')
    log.push('')

    // TODO: Создайте EventBus<OrderEvents>, добавьте logging и timing middleware
    // TODO: Create EventBus<OrderEvents>, add logging and timing middleware
    log.push('Publishing order lifecycle events:')
    log.push('  ... опубликуйте order:created, order:paid, order:shipped')
    log.push('')

    // TODO: Покажите историю событий
    // TODO: Show event history
    log.push('Event history:')
    log.push('  ... выведите getHistory()')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Event Bus</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
