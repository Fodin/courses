import { useState } from 'react'

// ============================================
// Задание 8.2: SharedArrayBuffer
// ============================================

// TODO: Изучите SharedArrayBuffer для разделяемой памяти между потоками:
//   - SharedArrayBuffer — память, доступная из нескольких потоков
//   - Atomics — атомарные операции для безопасного доступа
//   - Atomics.add, Atomics.load, Atomics.store, Atomics.compareExchange
//   - Atomics.wait / Atomics.notify — синхронизация потоков
//   - Нужен для высокопроизводительных вычислений
//
// TODO: Study SharedArrayBuffer for shared memory between threads:
//   - SharedArrayBuffer — memory accessible from multiple threads
//   - Atomics — atomic operations for safe access
//   - Atomics.wait / Atomics.notify — thread synchronization

export function Task8_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== SharedArrayBuffer ===')
    log.push('')

    // TODO: Продемонстрируйте проблему гонки (race condition):
    //   Два "потока" одновременно инкрементируют счётчик в обычном массиве
    //   Покажите, что без атомарных операций результат непредсказуем
    // TODO: Demonstrate race condition:
    //   Two "threads" increment a counter in a regular array simultaneously

    log.push('Race condition (non-atomic):')
    log.push('  ... покажите потерю обновлений без атомарных операций')
    log.push('')

    // TODO: Исправьте с помощью Atomics:
    //   const sab = new SharedArrayBuffer(4)
    //   const counter = new Int32Array(sab)
    //   Atomics.add(counter, 0, 1) — атомарный инкремент
    //   Покажите, что результат всегда корректный
    // TODO: Fix with Atomics: show correct result with atomic increment

    log.push('Atomic operations (safe):')
    log.push('  ... покажите корректный результат с Atomics')
    log.push('')

    // TODO: Реализуйте простой mutex на основе Atomics:
    //   class AtomicMutex {
    //     lock() — Atomics.wait до освобождения
    //     unlock() — Atomics.notify для пробуждения
    //   }
    // TODO: Implement a simple mutex using Atomics
    log.push('Atomic mutex:')
    log.push('  ... реализуйте мьютекс на Atomics')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: SharedArrayBuffer</h2>
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
