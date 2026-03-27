import { useState } from 'react'

// ============================================
// Задание 3.2: Observer (TypedEventEmitter)
// ============================================

// TODO: Define type Listener<T> = (data: T) => void

// TODO: Create class TypedEventEmitter<TEventMap extends Record<string, unknown>> with:
//   private listeners: Map<keyof TEventMap, Set<Listener<never>>>
//
//   on<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void
//     — add listener to the set for this event (create set if needed)
//
//   off<K extends keyof TEventMap>(event: K, listener: Listener<TEventMap[K]>): void
//     — remove listener from the set
//
//   emit<K extends keyof TEventMap>(event: K, data: TEventMap[K]): void
//     — call all listeners for this event with data
//
//   listenerCount<K extends keyof TEventMap>(event: K): number
//     — return number of listeners for this event

// TODO: Define interface AppEvents:
//   userLogin: { userId: string; timestamp: number }
//   userLogout: { userId: string }
//   error: { message: string; code: number }

export function Task3_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create TypedEventEmitter<AppEvents>
    // TODO: Subscribe to userLogin, userLogout, error events
    // TODO: Emit events and show results in log
    // TODO: Show listenerCount before and after off()
    // TODO: Demonstrate that off() removes the listener

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Observer (TypedEventEmitter)</h2>
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
