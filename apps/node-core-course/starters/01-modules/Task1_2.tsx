import { useState } from 'react'

// ============================================
// Задание 1.2: ES Modules (ESM)
// ============================================

// TODO: Разберитесь в ES Modules в Node.js:
//   - import/export — статические объявления
//   - Асинхронная загрузка (в отличие от CJS)
//   - import() — динамический импорт (возвращает Promise)
//   - Top-level await поддерживается в ESM
//   - Нет __dirname/__filename — используйте import.meta.url
//
// TODO: Understand ES Modules in Node.js:
//   - import/export — static declarations
//   - Asynchronous loading (unlike CJS)
//   - import() — dynamic import (returns Promise)
//   - Top-level await supported in ESM
//   - No __dirname/__filename — use import.meta.url

export function Task1_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== ES Modules ===')
    log.push('')

    // TODO: Реализуйте таблицу сравнения CJS и ESM:
    //   Создайте массив объектов { feature, cjs, esm } и выведите таблицу
    //   Включите: синтаксис, загрузка, top-level await, __dirname, this на верхнем уровне,
    //   расширение файла, package.json "type"
    // TODO: Create a CJS vs ESM comparison table:
    //   Create an array of { feature, cjs, esm } objects
    //   Include: syntax, loading, top-level await, __dirname, top-level this,
    //   file extension, package.json "type"

    log.push('CJS vs ESM Comparison:')
    log.push('  ... создайте таблицу сравнения')
    log.push('')

    // TODO: Покажите, как получить __dirname и __filename в ESM:
    //   import { fileURLToPath } from 'node:url'
    //   import { dirname } from 'node:path'
    //   const __filename = fileURLToPath(import.meta.url)
    //   const __dirname = dirname(__filename)
    // TODO: Show how to get __dirname and __filename in ESM

    log.push('ESM path equivalents:')
    log.push('  ... покажите замену __dirname и __filename')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: ES Modules (ESM)</h2>
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
