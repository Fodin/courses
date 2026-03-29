import { useState } from 'react'

// ============================================
// Задание 5.3: Domain Events
// ============================================

// TODO: Определите DomainEvent<T, P> { type: T, payload: P, timestamp, eventId }
// TODO: Создайте перегруженный createEvent: без payload и с payload
// TODO: Определите OrderEvent = OrderCreated | OrderItemAdded | OrderConfirmed | OrderCancelled
// TODO: Реализуйте EventBus<E> с on<K>(type, handler) -> unsubscribe и emit(event)
// TODO: Добавьте getLog() -> readonly E[]

export function Task5_3() {
  const [results, setResults] = useState<string[]>([])
  const runExample = () => {
    const log: string[] = []
    log.push('=== Domain Events ===')
    log.push('')
    log.push('Registering Event Handlers:')
    log.push('  ... bus.on("OrderCreated", ...), bus.on("OrderConfirmed", ...)')
    log.push('')
    log.push('Emitting Events:')
    log.push('  ... bus.emit(createEvent("OrderCreated", { ... }))')
    log.push('')
    log.push('Unsubscribe & Event Log:')
    log.push('  ... отписка, повторная эмиссия, bus.getLog()')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Domain Events</h2>
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
