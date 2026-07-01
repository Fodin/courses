import { useState } from 'react'

// ============================================
// Задание 0.4: Ordering Puzzle
// ============================================

// TODO: Решите головоломку — определите точный порядок вывода
//   для сложной комбинации async-примитивов Node.js
//
// TODO: Solve the puzzle — determine the exact output order
//   for a complex combination of Node.js async primitives

export function Task0_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Event Loop Ordering Puzzle ===')
    log.push('')

    // TODO: Определите порядок выполнения следующего кода:
    // TODO: Determine the execution order of this code:
    //
    // console.log('A: sync start')
    //
    // setTimeout(() => {
    //   console.log('B: setTimeout 1')
    //   Promise.resolve().then(() => console.log('C: promise inside timeout'))
    // }, 0)
    //
    // setTimeout(() => console.log('D: setTimeout 2'), 0)
    //
    // Promise.resolve()
    //   .then(() => {
    //     console.log('E: promise 1')
    //     process.nextTick(() => console.log('F: nextTick inside promise'))
    //   })
    //   .then(() => console.log('G: promise 2'))
    //
    // process.nextTick(() => {
    //   console.log('H: nextTick 1')
    //   queueMicrotask(() => console.log('I: microtask inside nextTick'))
    // })
    //
    // queueMicrotask(() => console.log('J: queueMicrotask'))
    //
    // setImmediate(() => console.log('K: setImmediate'))
    //
    // console.log('L: sync end')

    const yourAnswer: string[] = [
      // TODO: Запишите буквы в правильном порядке выполнения
      // TODO: Write the letters in correct execution order
      // Пример / Example: 'A: sync start', 'L: sync end', ...
    ]

    log.push('Your predicted order:')
    yourAnswer.forEach((item, i) => {
      log.push(`  ${i + 1}. ${item}`)
    })

    log.push('')

    // TODO: Объясните ПОЧЕМУ каждый вызов оказался на своём месте
    // TODO: Explain WHY each call ended up in its position
    log.push('Explanation:')
    log.push('  ... напишите объяснение для каждого шага')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Ordering Puzzle</h2>
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
