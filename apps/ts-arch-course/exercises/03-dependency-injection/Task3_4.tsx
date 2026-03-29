import { useState } from 'react'

// ============================================
// Задание 3.4: Auto-Wiring
// ============================================

// TODO: Реализуйте AutoWireContainer с автоматическим разрешением зависимостей:
//   - register(name, dependencies: string[], factory: (...deps) => T) -> this
//   - resolve<T>(name) -> T — автоматически разрешает зависимости рекурсивно
//   - getResolutionOrder(name) -> string[] — топологическая сортировка (порядок создания)
//   - getDependencyGraph() -> Map<string, string[]> — граф зависимостей
//   Важно: обнаруживать циклические зависимости (Set resolving) и бросать ошибку
// TODO: Implement AutoWireContainer with automatic dependency resolution:
//   - register(name, dependencies, factory) -> this
//   - resolve<T>(name) -> T — auto-resolves dependencies recursively
//   - getResolutionOrder(name) -> string[] — topological sort
//   - getDependencyGraph() -> Map<string, string[]>
//   Important: detect circular dependencies (via resolving Set) and throw

export function Task3_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Auto-Wiring ===')
    log.push('')

    // TODO: Зарегистрируйте граф сервисов:
    //   config: [] -> logger: [config] -> database: [config, logger]
    //   cache: [config, logger] -> userRepository: [database, cache, logger]
    //   userService: [userRepository, logger]
    // TODO: Register service graph

    // TODO: Покажите граф зависимостей и порядок разрешения
    // TODO: Show dependency graph and resolution order
    log.push('Dependency graph:')
    log.push('  ... getDependencyGraph()')
    log.push('')

    log.push('Resolution order for "userService":')
    log.push('  ... getResolutionOrder("userService")')
    log.push('')

    // TODO: Разрешите userService (все зависимости создаются автоматически)
    // TODO: Resolve userService (all dependencies auto-created)
    log.push('Resolving userService:')
    log.push('  ... resolve("userService") автоматически создаёт всю цепочку')
    log.push('')

    // TODO: Продемонстрируйте обнаружение циклической зависимости: a->b->c->a
    // TODO: Demonstrate circular dependency detection: a->b->c->a
    log.push('Circular dependency detection:')
    log.push('  ... зарегистрируйте a->b->c->a и покажите ошибку')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Auto-Wiring</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
