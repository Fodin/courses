import { useState } from 'react'

// ============================================
// Задание 4.3: Directory Operations
// ============================================

// TODO: Изучите операции с директориями:
//   - fs.mkdir(path, { recursive }) — создание директории
//   - fs.readdir(path, { withFileTypes }) — чтение содержимого
//   - fs.rm(path, { recursive, force }) — удаление
//   - fs.stat(path) — информация о файле (size, mtime, isDirectory())
//   - fs.access(path, mode) — проверка доступа
//   - fs.opendir(path) — Dir итератор для больших директорий
//
// TODO: Study directory operations:
//   - fs.mkdir, fs.readdir, fs.rm, fs.stat, fs.access, fs.opendir

export function Task4_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Directory Operations ===')
    log.push('')

    // TODO: Смоделируйте файловое дерево в памяти и реализуйте операции:
    //   Дерево:
    //   /project
    //   ├── src/
    //   │   ├── index.ts (150 bytes)
    //   │   ├── utils/
    //   │   │   └── helpers.ts (80 bytes)
    //   │   └── types.ts (45 bytes)
    //   ├── tests/
    //   │   └── index.test.ts (200 bytes)
    //   └── package.json (300 bytes)
    //
    //   Реализуйте:
    //   - readdir(path, { withFileTypes }) — возвращает массив Dirent-like объектов
    //   - stat(path) — возвращает { size, isDirectory, isFile }
    //   - mkdir(path, { recursive }) — создание с промежуточными директориями
    // TODO: Model a file tree in memory and implement operations

    log.push('readdir /project/src:')
    log.push('  ... покажите содержимое директории')
    log.push('')

    log.push('stat for files:')
    log.push('  ... покажите информацию о файлах')
    log.push('')

    // TODO: Реализуйте рекурсивный обход дерева — функцию walk(dir)
    //   которая возвращает все файлы с полными путями
    // TODO: Implement recursive tree walk — walk(dir) function
    //   returning all files with full paths
    log.push('Recursive walk:')
    log.push('  ... выведите все файлы рекурсивно')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Directory Operations</h2>
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
