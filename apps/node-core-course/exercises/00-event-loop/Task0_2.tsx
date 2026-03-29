import { useState } from 'react'

// ============================================
// Задание 0.2: Microtasks vs Macrotasks
// ============================================

// TODO: Разберитесь в разнице между микрозадачами и макрозадачами:
//   Микрозадачи (microtasks): Promise.then, queueMicrotask, process.nextTick
//   Макрозадачи (macrotasks): setTimeout, setInterval, setImmediate, I/O
//   Микрозадачи выполняются ДО следующей макрозадачи
//
// TODO: Understand the difference between microtasks and macrotasks:
//   Microtasks: Promise.then, queueMicrotask, process.nextTick
//   Macrotasks: setTimeout, setInterval, setImmediate, I/O
//   Microtasks execute BEFORE the next macrotask

export function Task0_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Microtasks vs Macrotasks ===')
    log.push('')

    // TODO: Реализуйте функцию classifyTask, которая принимает название API
    //   и возвращает 'microtask' | 'macrotask'
    // TODO: Implement classifyTask that takes an API name
    //   and returns 'microtask' | 'macrotask'

    // const classifyTask = (apiName: string): 'microtask' | 'macrotask' => {
    //   // TODO: Реализуйте классификацию
    // }

    const apis = [
      'setTimeout',
      'Promise.then',
      'setImmediate',
      'queueMicrotask',
      'process.nextTick',
      'setInterval',
      'fs.readFile callback',
    ]

    log.push('Task classification:')
    apis.forEach(api => {
      // TODO: Вызовите classifyTask и выведите результат
      // TODO: Call classifyTask and log the result
      log.push(`  ${api}: ???`)
    })

    log.push('')

    // TODO: Реализуйте демонстрацию: создайте цепочку из 3 вложенных Promise.then
    //   внутри setTimeout и покажите, что все микрозадачи выполнятся до следующего setTimeout
    // TODO: Demonstrate: create a chain of 3 nested Promise.then
    //   inside setTimeout, showing all microtasks complete before the next setTimeout
    log.push('Nested microtasks demo:')
    log.push('  ... реализуйте демонстрацию вложенных микрозадач')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.2: Microtasks vs Macrotasks</h2>
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
