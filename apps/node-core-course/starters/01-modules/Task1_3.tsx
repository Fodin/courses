import { useState } from 'react'

// ============================================
// Задание 1.3: Circular Dependencies
// ============================================

// TODO: Разберитесь, как Node.js обрабатывает циклические зависимости:
//   CJS: возвращает частично инициализированный объект (exports на момент цикла)
//   ESM: использует "live bindings" — ссылки обновляются после полной инициализации,
//        но доступ до инициализации выбросит ReferenceError
//
// TODO: Understand how Node.js handles circular dependencies:
//   CJS: returns partially initialized object (exports at the time of the cycle)
//   ESM: uses "live bindings" — references update after full initialization,
//        but access before initialization throws ReferenceError

export function Task1_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Circular Dependencies ===')
    log.push('')

    // TODO: Смоделируйте циклическую зависимость CJS:
    //   moduleA требует moduleB, moduleB требует moduleA
    //   Покажите, что moduleB получает частично заполненный exports из moduleA
    // TODO: Simulate CJS circular dependency:
    //   moduleA requires moduleB, moduleB requires moduleA
    //   Show that moduleB gets partially filled exports from moduleA

    type ModuleExports = Record<string, unknown>
    type ModuleFactory = (exports: ModuleExports, require: (name: string) => ModuleExports) => void

    const _modules: Record<string, ModuleFactory> = {
      // TODO: Определите moduleA и moduleB с циклической зависимостью
      // TODO: Define moduleA and moduleB with circular dependency
    }

    log.push('CJS circular dependency simulation:')
    log.push('  ... смоделируйте циклическую загрузку')
    log.push('')

    // TODO: Предложите 3 паттерна для избежания проблем с циклическими зависимостями:
    //   1. Lazy require (require внутри функции, а не на верхнем уровне)
    //   2. Dependency injection
    //   3. Рефакторинг: выделение общего модуля
    // TODO: Suggest 3 patterns to avoid circular dependency issues

    log.push('Solutions for circular deps:')
    log.push('  ... опишите 3 подхода к решению')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: Circular Dependencies</h2>
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
