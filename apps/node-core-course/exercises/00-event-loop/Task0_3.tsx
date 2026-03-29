import { useState } from 'react'

// ============================================
// Задание 0.3: nextTick Starvation
// ============================================

// TODO: Разберитесь в проблеме "голодания" (starvation) при злоупотреблении
//   process.nextTick. Если рекурсивно вызывать nextTick, Event Loop
//   никогда не перейдёт к следующей фазе — I/O, таймеры и setImmediate зависнут.
//
// TODO: Understand the "starvation" problem when abusing process.nextTick.
//   Recursive nextTick calls prevent the Event Loop from advancing —
//   I/O, timers, and setImmediate will starve.

export function Task0_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== nextTick Starvation ===')
    log.push('')

    // TODO: Смоделируйте проблему starvation (без реального зависания!):
    //   Покажите, что N рекурсивных nextTick вызовов выполняются ДО
    //   единственного setTimeout(fn, 0)
    // TODO: Simulate the starvation problem (without actually blocking!):
    //   Show that N recursive nextTick calls execute BEFORE
    //   a single setTimeout(fn, 0)

    const simulateStarvation = (depth: number): string[] => {
      const order: string[] = []
      // TODO: Реализуйте симуляцию:
      //   1. Запланируйте setTimeout, который добавляет 'setTimeout executed' в order
      //   2. Создайте рекурсивную функцию recursiveNextTick(count),
      //      которая добавляет 'nextTick #N' и вызывает себя через nextTick
      //   3. Верните ожидаемый порядок (не запускайте реально, а предскажите!)
      // TODO: Implement simulation:
      //   1. Schedule setTimeout that pushes 'setTimeout executed' to order
      //   2. Create recursive recursiveNextTick(count) function
      //      that pushes 'nextTick #N' and calls itself via nextTick
      //   3. Return the expected order (predict, don't actually run!)
      return order
    }

    const starvationOrder = simulateStarvation(5)
    log.push('Starvation simulation (predicted order):')
    starvationOrder.forEach((item, i) => {
      log.push(`  ${i + 1}. ${item}`)
    })

    log.push('')

    // TODO: Предложите решение проблемы starvation — замените nextTick на setImmediate
    //   и покажите, что теперь setTimeout выполнится между итерациями
    // TODO: Propose a fix — replace nextTick with setImmediate
    //   and show that setTimeout now executes between iterations
    log.push('Fix with setImmediate (predicted order):')
    log.push('  ... реализуйте исправление')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.3: nextTick Starvation</h2>
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
