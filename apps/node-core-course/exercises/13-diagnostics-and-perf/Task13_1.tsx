import { useState } from 'react'

// ============================================
// Задание 13.1: perf_hooks
// ============================================

// TODO: Изучите модуль perf_hooks для измерения производительности:
//   - performance.now() — высокоточное время (микросекунды)
//   - performance.mark(name) — создание метки
//   - performance.measure(name, startMark, endMark) — измерение интервала
//   - PerformanceObserver — наблюдение за метриками
//   - performance.timerify(fn) — автоматическое измерение функции
//   - monitorEventLoopDelay() — гистограмма задержек Event Loop
//
// TODO: Study perf_hooks for performance measurement:
//   - performance.now, mark, measure, PerformanceObserver
//   - timerify, monitorEventLoopDelay

export function Task13_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== perf_hooks ===')
    log.push('')

    // TODO: Реализуйте класс PerformanceTracker:
    //   class PerformanceTracker {
    //     mark(name: string) — сохраняет timestamp
    //     measure(name: string, startMark: string, endMark: string): number
    //     timerify<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => T
    //       — оборачивает функцию и измеряет время выполнения
    //     getEntries(): Array<{ name, duration, startTime }>
    //     clear()
    //   }
    // TODO: Implement PerformanceTracker class

    log.push('Performance marks & measures:')
    log.push('  ... создайте метки и измерьте интервалы')
    log.push('')

    // TODO: Измерьте производительность разных алгоритмов:
    //   Сортировка массива из 10000 элементов:
    //     - Array.sort()
    //     - Bubble sort (ваша реализация)
    //   Поиск в массиве:
    //     - Array.find()
    //     - Binary search (на отсортированном)
    //   Выведите время каждого варианта
    // TODO: Benchmark different algorithms

    log.push('Algorithm benchmarks:')
    log.push('  ... сравните производительность алгоритмов')
    log.push('')

    // TODO: Реализуйте мониторинг Event Loop delay:
    //   Измеряйте разницу между ожидаемым и реальным временем setTimeout
    //   Показатель загруженности Event Loop
    // TODO: Implement Event Loop delay monitoring
    log.push('Event Loop delay:')
    log.push('  ... измерьте задержку Event Loop')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.1: perf_hooks</h2>
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
