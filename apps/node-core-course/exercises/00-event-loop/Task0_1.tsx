import { useState } from 'react'

// ============================================
// Задание 0.1: Phases Order
// ============================================

// TODO: Изучите порядок фаз Event Loop в Node.js:
//   1. timers (setTimeout, setInterval)
//   2. pending callbacks (I/O callbacks, отложенные системой)
//   3. idle/prepare (внутренние)
//   4. poll (новые I/O события)
//   5. check (setImmediate)
//   6. close callbacks (socket.on('close'))
//
// TODO: Study the Event Loop phases in Node.js:
//   1. timers (setTimeout, setInterval)
//   2. pending callbacks (deferred I/O callbacks)
//   3. idle/prepare (internal)
//   4. poll (new I/O events)
//   5. check (setImmediate)
//   6. close callbacks (socket.on('close'))

// TODO: Расположите вызовы setTimeout, setImmediate, process.nextTick,
//   Promise.resolve().then() в правильном порядке выполнения
// TODO: Arrange setTimeout, setImmediate, process.nextTick,
//   Promise.resolve().then() in the correct execution order

export function Task0_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Event Loop Phases Order ===')
    log.push('')

    // TODO: Предскажите порядок выполнения следующих вызовов:
    // TODO: Predict the execution order of these calls:
    //
    // setTimeout(() => log.push('1: setTimeout'), 0)
    // setImmediate(() => log.push('2: setImmediate'))
    // process.nextTick(() => log.push('3: nextTick'))
    // Promise.resolve().then(() => log.push('4: Promise.then'))
    // queueMicrotask(() => log.push('5: queueMicrotask'))
    //
    // Запишите ожидаемый порядок в массив predictedOrder
    // Write the expected order into predictedOrder array

    const predictedOrder: string[] = [
      // TODO: Заполните массив в правильном порядке выполнения
      // TODO: Fill the array in correct execution order
      // Пример / Example: '3: nextTick', '4: Promise.then', ...
    ]

    log.push('Predicted execution order:')
    predictedOrder.forEach((item, i) => {
      log.push(`  ${i + 1}. ${item}`)
    })

    log.push('')
    log.push('Hint: nextTick > microtasks > timers/check')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.1: Phases Order</h2>
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
