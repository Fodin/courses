import { useState } from 'react'

// ============================================
// Задание 2.2: Error Events
// ============================================

// TODO: Изучите особое поведение события 'error' в EventEmitter:
//   - Если нет обработчика 'error', emit('error') выбросит исключение
//   - Это основной паттерн обработки ошибок в Node.js streams, сокетах и т.д.
//   - captureRejections: true — автоматически ловит rejected promises
//
// TODO: Study the special 'error' event behavior in EventEmitter:
//   - If no 'error' handler exists, emit('error') throws an exception
//   - This is the primary error handling pattern in Node.js streams, sockets, etc.
//   - captureRejections: true — automatically catches rejected promises

export function Task2_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Error Events ===')
    log.push('')

    // TODO: Расширьте MyEventEmitter из предыдущего задания:
    //   1. При emit('error', err) без обработчика — бросить исключение
    //   2. Добавьте static defaultMaxListeners = 10
    //   3. Если подписчиков > maxListeners — вывести предупреждение
    //      (memory leak detection)
    // TODO: Extend MyEventEmitter from previous task:
    //   1. On emit('error', err) without handler — throw the error
    //   2. Add static defaultMaxListeners = 10
    //   3. If listeners > maxListeners — log a warning (memory leak detection)

    log.push('Error without handler:')
    log.push('  ... покажите, что emit("error") без обработчика бросает исключение')
    log.push('')

    // TODO: Продемонстрируйте безопасный паттерн с обработкой ошибок
    // TODO: Demonstrate a safe error handling pattern
    log.push('Error with handler:')
    log.push('  ... покажите корректную обработку ошибок')
    log.push('')

    // TODO: Продемонстрируйте предупреждение о memory leak
    //   Подпишите 11+ обработчиков на одно событие
    // TODO: Demonstrate memory leak warning
    //   Subscribe 11+ handlers to a single event
    log.push('Max listeners warning:')
    log.push('  ... подпишите 11 обработчиков и покажите предупреждение')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Error Events</h2>
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
