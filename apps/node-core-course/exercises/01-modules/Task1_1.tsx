import { useState } from 'react'

// ============================================
// Задание 1.1: CommonJS (CJS)
// ============================================

// TODO: Разберитесь в системе модулей CommonJS:
//   - require() — синхронная загрузка
//   - module.exports / exports — экспорт значений
//   - Кеширование: require() возвращает один и тот же объект при повторном вызове
//   - Обёртка модуля: (function(exports, require, module, __filename, __dirname) { ... })
//
// TODO: Understand the CommonJS module system:
//   - require() — synchronous loading
//   - module.exports / exports — exporting values
//   - Caching: require() returns the same object on subsequent calls
//   - Module wrapper: (function(exports, require, module, __filename, __dirname) { ... })

export function Task1_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CommonJS Modules ===')
    log.push('')

    // TODO: Смоделируйте работу require() — создайте простой кеш модулей
    //   и функцию myRequire, которая:
    //   1. Проверяет кеш
    //   2. Создаёт объект module = { exports: {} }
    //   3. Вызывает функцию модуля с (exports, myRequire, module)
    //   4. Сохраняет module.exports в кеш
    // TODO: Simulate require() — create a simple module cache
    //   and myRequire function that:
    //   1. Checks cache
    //   2. Creates module = { exports: {} }
    //   3. Calls module function with (exports, myRequire, module)
    //   4. Stores module.exports in cache

    log.push('Module cache simulation:')
    log.push('  ... реализуйте myRequire с кешированием')
    log.push('')

    // TODO: Продемонстрируйте разницу между module.exports и exports:
    //   exports.foo = 'bar'  — работает (добавляет свойство)
    //   exports = { foo: 'bar' } — НЕ работает (переназначение ссылки)
    //   module.exports = { foo: 'bar' } — работает (замена объекта целиком)
    // TODO: Demonstrate the difference between module.exports and exports

    log.push('exports vs module.exports:')
    log.push('  ... покажите разницу между exports и module.exports')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: CommonJS (CJS)</h2>
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
