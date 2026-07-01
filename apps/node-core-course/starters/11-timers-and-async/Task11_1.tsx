import { useState } from 'react'

// ============================================
// Задание 11.1: Timer Internals
// ============================================

// TODO: Изучите внутреннее устройство таймеров в Node.js:
//   - setTimeout/setInterval хранятся в min-heap (по времени срабатывания)
//   - Timer phase Event Loop проверяет heap на каждой итерации
//   - setTimeout(fn, 0) !== немедленное выполнение (минимум ~1ms)
//   - setImmediate(fn) — выполняется в check phase (после poll)
//   - Ref/Unref: timer.unref() не блокирует завершение process
//   - timers/promises: setTimeout, setInterval, setImmediate возвращают Promise
//
// TODO: Study timer internals in Node.js:
//   - Min-heap storage, timer phase, 0ms delay behavior
//   - setImmediate in check phase, ref/unref, timers/promises

export function Task11_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Timer Internals ===')
    log.push('')

    // TODO: Реализуйте упрощённый Timer Manager на min-heap:
    //   class TimerManager {
    //     setTimeout(cb, delay): timerId
    //     setInterval(cb, delay): timerId
    //     clearTimeout(id)
    //     clearInterval(id)
    //     tick(ms) — продвигает время на ms миллисекунд, вызывая созревшие таймеры
    //   }
    //   Используйте массив с сортировкой по времени срабатывания
    // TODO: Implement simplified Timer Manager with min-heap

    log.push('Timer manager simulation:')
    log.push('  ... создайте таймеры и продвиньте время')
    log.push('')

    // TODO: Покажите разницу setTimeout(fn, 0) vs setImmediate(fn):
    //   В I/O callback: setImmediate всегда первый
    //   Вне I/O: порядок не гарантирован
    // TODO: Show setTimeout(0) vs setImmediate difference

    log.push('setTimeout(0) vs setImmediate:')
    log.push('  ... объясните разницу в разных контекстах')
    log.push('')

    // TODO: Продемонстрируйте timer.ref() / timer.unref():
    //   unref() позволяет процессу завершиться, даже если таймер активен
    //   Используется в keep-alive таймерах, heartbeat и т.д.
    // TODO: Demonstrate ref/unref behavior
    log.push('ref() / unref():')
    log.push('  ... покажите влияние на завершение процесса')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Timer Internals</h2>
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
