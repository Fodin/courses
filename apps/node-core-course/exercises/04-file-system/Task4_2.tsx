import { useState } from 'react'

// ============================================
// Задание 4.2: Path Module
// ============================================

// TODO: Изучите модуль path для кроссплатформенной работы с путями:
//   - path.join(...segments) — соединение сегментов пути
//   - path.resolve(...segments) — абсолютный путь
//   - path.basename(p, ext?) — имя файла
//   - path.dirname(p) — директория
//   - path.extname(p) — расширение
//   - path.parse(p) — разбор пути в объект { root, dir, base, ext, name }
//   - path.format(obj) — сборка пути из объекта
//   - path.relative(from, to) — относительный путь
//   - path.sep, path.delimiter — разделители для текущей ОС
//
// TODO: Study the path module for cross-platform path handling

export function Task4_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Path Module ===')
    log.push('')

    // TODO: Реализуйте упрощённые версии функций path:
    //   1. myJoin(...segments) — соединяет части пути через '/'
    //   2. myBasename(p) — извлекает имя файла
    //   3. myExtname(p) — извлекает расширение
    //   4. myParse(p) — разбирает путь в { dir, base, ext, name }
    // TODO: Implement simplified path functions:
    //   1. myJoin, 2. myBasename, 3. myExtname, 4. myParse

    const testPaths = [
      '/home/user/documents/report.pdf',
      '../src/index.ts',
      '/var/log/app.log.gz',
      'file.txt',
    ]

    log.push('Path parsing:')
    testPaths.forEach(p => {
      // TODO: Для каждого пути покажите результат parse
      // TODO: For each path show the parse result
      log.push(`  ${p}:`)
      log.push(`    ... покажите результат разбора`)
    })
    log.push('')

    // TODO: Продемонстрируйте разницу между join и resolve:
    //   join('src', '..', 'dist', 'index.js') → 'dist/index.js'
    //   resolve('src', '..', 'dist', 'index.js') → '/absolute/path/dist/index.js'
    // TODO: Show the difference between join and resolve
    log.push('join vs resolve:')
    log.push('  ... покажите разницу')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Path Module</h2>
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
