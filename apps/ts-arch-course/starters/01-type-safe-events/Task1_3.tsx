import { useState } from 'react'

// ============================================
// Задание 1.3: DOM Events Typing
// ============================================

// TODO: Определите CustomEventMap — маппинг кастомных DOM-событий:
//   'app:theme-change': { theme: 'light' | 'dark' }
//   'app:language-change': { locale: string, direction: 'ltr' | 'rtl' }
//   'app:notification': { id: string, message: string, type: 'success' | 'error' | 'info' }
//   'app:modal-open': { modalId: string, data?: Record<string, unknown> }
//   'app:modal-close': { modalId: string, result?: unknown }
// TODO: Define CustomEventMap — mapping of custom DOM events

// TODO: Реализуйте dispatchTypedEvent<K>(eventName, detail) — создаёт и диспатчит
//   new CustomEvent(eventName, { detail, bubbles: true }) через document.dispatchEvent
// TODO: Implement dispatchTypedEvent<K>(eventName, detail) — creates and dispatches
//   new CustomEvent(eventName, { detail, bubbles: true }) via document.dispatchEvent

// TODO: Реализуйте onTypedEvent<K>(eventName, handler) -> () => void
//   handler получает типизированный detail, возвращает функцию отписки
// TODO: Implement onTypedEvent<K>(eventName, handler) -> () => void
//   handler receives typed detail, returns cleanup function

// TODO: (Бонус) Определите TypedElementEvents<E> с условным типом для input:
//   click: { element: E, x: number, y: number }
//   input: E extends HTMLInputElement ? { element: E, value: string } : never
// TODO: (Bonus) Define TypedElementEvents<E> with conditional type for input

export function Task1_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== DOM Events Typing ===')
    log.push('')

    // TODO: Зарегистрируйте обработчики и диспатчите кастомные события
    // TODO: Register handlers and dispatch custom events
    log.push('Dispatching custom DOM events:')
    log.push('  ... диспатчите theme-change, language-change, notification')
    log.push('')

    // TODO: Не забудьте вызвать cleanup для всех подписок
    // TODO: Don't forget to call cleanup for all subscriptions

    log.push('Type safety:')
    log.push('  dispatchTypedEvent("app:theme-change", { theme: "blue" }) // Error')
    log.push('  onTypedEvent("app:notification", (d) => d.theme)          // Error')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: DOM Events Typing</h2>
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
