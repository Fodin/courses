import { useState } from 'react'

// ============================================
// Задание 13.2: Memory Profiling
// ============================================

// TODO: Изучите профилирование памяти в Node.js:
//   - process.memoryUsage() — rss, heapTotal, heapUsed, external, arrayBuffers
//   - v8.getHeapStatistics() — детальная статистика кучи V8
//   - v8.getHeapSpaceStatistics() — по пространствам (new_space, old_space, etc.)
//   - --inspect + Chrome DevTools — Heap Snapshot, Allocation Timeline
//   - --max-old-space-size=N — лимит памяти V8
//   - WeakRef / FinalizationRegistry — слежение за GC
//
// TODO: Study memory profiling in Node.js:
//   - memoryUsage, v8 heap statistics, DevTools, WeakRef

export function Task13_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Memory Profiling ===')
    log.push('')

    // TODO: Реализуйте MemoryMonitor — отслеживание памяти:
    //   class MemoryMonitor {
    //     snapshot(): MemorySnapshot — текущее состояние
    //     diff(before: MemorySnapshot, after: MemorySnapshot): MemoryDiff
    //     detectLeak(snapshots: MemorySnapshot[]): boolean
    //       — проверяет, растёт ли heapUsed монотонно
    //     formatBytes(bytes: number): string — форматирование
    //   }
    // TODO: Implement MemoryMonitor class

    log.push('Memory snapshots:')
    log.push('  ... сделайте снимки памяти до и после операций')
    log.push('')

    // TODO: Создайте и обнаружьте 3 типа утечек памяти:
    //   1. Растущий массив/Map, который никогда не очищается
    //   2. Замыкание, удерживающее ссылку на большой объект
    //   3. Event listener, который не отписывается
    //   Для каждого: покажите рост памяти и способ исправления
    // TODO: Create and detect 3 types of memory leaks

    log.push('Memory leak detection:')
    log.push('  ... обнаружьте и исправьте утечки')
    log.push('')

    // TODO: Покажите использование WeakRef и FinalizationRegistry:
    //   WeakRef — ссылка, не препятствующая GC
    //   FinalizationRegistry — callback при сборке мусора
    //   Пример: кеш с автоматическим удалением при нехватке памяти
    // TODO: Show WeakRef and FinalizationRegistry usage
    log.push('WeakRef cache:')
    log.push('  ... реализуйте кеш на WeakRef')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.2: Memory Profiling</h2>
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
