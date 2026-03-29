import { useState } from 'react'

// ============================================
// Задание 1.1: Typed Event Emitter
// ============================================

// TODO: Определите тип EventHandler<T> = (payload: T) => void
// TODO: Define type EventHandler<T> = (payload: T) => void

// TODO: Реализуйте класс TypedEventEmitter<TEvents>, где TEvents — интерфейс
//   с ключами-событиями и типами payload. Методы:
//   - on<K>(event, handler) -> () => void (возвращает функцию отписки)
//   - emit<K>(event, payload) -> void
//   - off<K>(event, handler) -> void
//   - once<K>(event, handler) -> void (срабатывает один раз)
//   - listenerCount<K>(event) -> number
//   - removeAllListeners(event?) -> void
//   Используйте Map<keyof TEvents, Set<EventHandler<unknown>>> для хранения
// TODO: Implement class TypedEventEmitter<TEvents> where TEvents is an interface
//   with event keys and payload types. Methods:
//   - on<K>(event, handler) -> () => void (returns unsubscribe function)
//   - emit<K>(event, payload) -> void
//   - off<K>(event, handler) -> void
//   - once<K>(event, handler) -> void (fires once then auto-removes)
//   - listenerCount<K>(event) -> number
//   - removeAllListeners(event?) -> void
//   Use Map<keyof TEvents, Set<EventHandler<unknown>>> for storage

// TODO: Определите интерфейс AppEvents:
//   'user:login': { userId: string, timestamp: number }
//   'user:logout': { userId: string }
//   'notification': { message: string, level: 'info' | 'warn' | 'error' }
//   'data:sync': { source: string, recordCount: number }
// TODO: Define AppEvents interface with the events above

export function Task1_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Typed Event Emitter ===')
    log.push('')

    // TODO: Создайте TypedEventEmitter<AppEvents> и подпишитесь на события
    // TODO: Create TypedEventEmitter<AppEvents> and subscribe to events
    log.push('Listeners registered:')
    log.push('  ... подпишитесь на каждое событие')
    log.push('')

    // TODO: Эмитируйте события и покажите вызов обработчиков
    // TODO: Emit events and show handler invocations
    log.push('Emitting events:')
    log.push('  ... эмитируйте user:login, notification, data:sync')
    log.push('')

    // TODO: Продемонстрируйте отписку и once()
    // TODO: Demonstrate unsubscribe and once()
    log.push('Unsubscribe & once():')
    log.push('  ... отпишитесь и проверьте once()')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Typed Event Emitter</h2>
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
