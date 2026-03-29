import { useState } from 'react'

// ============================================
// Задание 2.3: once & Async Iterator
// ============================================

// TODO: Изучите метод once() и async-итераторы для EventEmitter:
//   - once(event) — слушатель срабатывает один раз и автоматически отписывается
//   - events.once(emitter, event) — возвращает Promise (из node:events)
//   - events.on(emitter, event) — возвращает AsyncIterator (for await...of)
//
// TODO: Study once() method and async iterators for EventEmitter:
//   - once(event) — listener fires once and auto-unsubscribes
//   - events.once(emitter, event) — returns Promise (from node:events)
//   - events.on(emitter, event) — returns AsyncIterator (for await...of)

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== once & Async Iterator ===')
    log.push('')

    // TODO: Добавьте метод once() в MyEventEmitter:
    //   once(event, listener) — оборачивает listener так, что после первого вызова
    //   он автоматически отписывается через off()
    // TODO: Add once() method to MyEventEmitter:
    //   once(event, listener) — wraps listener so it auto-unsubscribes after first call

    log.push('once() demonstration:')
    log.push('  ... покажите, что once-обработчик срабатывает только один раз')
    log.push('')

    // TODO: Реализуйте статический метод waitFor(emitter, event) → Promise:
    //   Возвращает Promise, который resolve-ится при первом emit данного события
    // TODO: Implement static waitFor(emitter, event) → Promise:
    //   Returns a Promise that resolves on first emit of the event

    log.push('waitFor (Promise-based once):')
    log.push('  ... реализуйте промис-версию once')
    log.push('')

    // TODO: Реализуйте метод asyncIterator(event) — генератор, который
    //   yield-ит значения при каждом emit события
    //   Подсказка: используйте очередь промисов
    // TODO: Implement asyncIterator(event) — generator that yields
    //   values on each event emit
    //   Hint: use a promise queue

    log.push('Async iterator:')
    log.push('  ... реализуйте async-итератор для событий')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: once & Async Iterator</h2>
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
