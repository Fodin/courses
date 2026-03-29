import { useState } from 'react'

// ============================================
// Задание 1.4: package.json exports
// ============================================

// TODO: Изучите поле "exports" в package.json (Node.js 12+):
//   - Позволяет определить точки входа пакета
//   - Поддерживает условный экспорт: import, require, default, node, browser
//   - Блокирует доступ к внутренним файлам пакета (encapsulation)
//   - Поддерживает subpath patterns: "./utils/*"
//
// TODO: Study the "exports" field in package.json (Node.js 12+):
//   - Defines package entry points
//   - Supports conditional exports: import, require, default, node, browser
//   - Blocks access to internal package files (encapsulation)
//   - Supports subpath patterns: "./utils/*"

export function Task1_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== package.json exports ===')
    log.push('')

    // TODO: Создайте объект packageJson, описывающий пакет с полем exports:
    //   - "." — главная точка входа (import → ESM файл, require → CJS файл)
    //   - "./utils" — утилиты
    //   - "./types" — только типы (import → .d.ts)
    //   - "./internal/*" — заблокированный доступ (null)
    // TODO: Create a packageJson object describing a package with exports field:
    //   - "." — main entry point (import → ESM file, require → CJS file)
    //   - "./utils" — utilities
    //   - "./types" — types only (import → .d.ts)
    //   - "./internal/*" — blocked access (null)

    const packageJson = {
      name: '@my/library',
      version: '1.0.0',
      // TODO: Добавьте поле "exports" с условным экспортом
      // TODO: Add "exports" field with conditional exports
    }

    log.push('Package exports config:')
    log.push(JSON.stringify(packageJson, null, 2))
    log.push('')

    // TODO: Реализуйте функцию resolveExport(packageExports, specifier, conditions),
    //   которая определяет, какой файл будет загружен
    //   Пример: resolveExport(exports, '.', ['import']) → './dist/esm/index.mjs'
    // TODO: Implement resolveExport(packageExports, specifier, conditions)
    //   that determines which file will be loaded

    log.push('Export resolution:')
    log.push('  ... реализуйте разрешение экспортов')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: package.json exports</h2>
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
