import { useState } from 'react'

// ============================================
// Задание 4.4: File Watching
// ============================================

// TODO: Изучите механизмы наблюдения за файлами:
//   - fs.watch(path, options) — эффективный, использует inotify/kqueue/FSEvents
//   - fs.watchFile(path, options) — polling, менее эффективный
//   - Проблемы: дублирование событий, кроссплатформенные различия
//   - fs/promises.watch() — async iterable версия (Node 18.11+)
//
// TODO: Study file watching mechanisms:
//   - fs.watch — efficient, uses OS-level APIs
//   - fs.watchFile — polling-based, less efficient
//   - Issues: duplicate events, cross-platform differences
//   - fs/promises.watch() — async iterable version

export function Task4_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== File Watching ===')
    log.push('')

    // TODO: Реализуйте класс FileWatcher, моделирующий fs.watch:
    //   - watch(path, callback) — начать наблюдение
    //   - unwatch(path) — прекратить наблюдение
    //   - simulateChange(path, eventType) — симуляция изменения файла
    //   eventType: 'change' | 'rename'
    //   callback: (eventType, filename) => void
    // TODO: Implement FileWatcher class simulating fs.watch

    log.push('File watcher simulation:')
    log.push('  ... реализуйте и протестируйте FileWatcher')
    log.push('')

    // TODO: Реализуйте debounced watcher — обёртку, которая игнорирует
    //   повторные события в течение заданного интервала (решение проблемы
    //   дублирования событий)
    // TODO: Implement debounced watcher — wrapper that ignores
    //   duplicate events within a given interval

    log.push('Debounced watcher:')
    log.push('  ... покажите, как дедупликация решает проблему двойных событий')
    log.push('')

    // TODO: Сравните fs.watch и fs.watchFile — создайте таблицу
    //   с характеристиками: механизм, производительность, надёжность, кроссплатформенность
    // TODO: Compare fs.watch vs fs.watchFile in a comparison table
    log.push('watch vs watchFile comparison:')
    log.push('  ... создайте таблицу сравнения')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.4: File Watching</h2>
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
