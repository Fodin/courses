import { useState } from 'react'

// ============================================
// Задание 3.3: Scoped Dependencies
// ============================================

// TODO: Определите тип Lifetime = 'singleton' | 'transient' | 'scoped'
// TODO: Define type Lifetime = 'singleton' | 'transient' | 'scoped'

// TODO: Реализуйте ScopedContainer с тремя режимами жизненного цикла:
//   - registerSingleton(name, factory) — один экземпляр на всё приложение
//   - registerTransient(name, factory) — новый экземпляр при каждом resolve()
//   - registerScoped(name, factory) — один экземпляр на scope
//   - resolve<T>(name) -> T
//   - createScope() -> ScopedContainer (дочерний scope с доступом к родителю)
//   Singleton живёт в root-контейнере, scoped — в текущем scope
// TODO: Implement ScopedContainer with three lifetime modes:
//   - registerSingleton: one instance for the entire app
//   - registerTransient: new instance on every resolve()
//   - registerScoped: one instance per scope
//   - createScope() -> child ScopedContainer

export function Task3_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Scoped Dependencies ===')
    log.push('')

    // TODO: Зарегистрируйте сервисы с разными lifetime:
    //   config: singleton, requestId: transient, dbConnection: scoped
    // TODO: Register services with different lifetimes

    // TODO: Покажите singleton: одинаковый инстанс при двух resolve
    // TODO: Show singleton: same instance on two resolves
    log.push('Singleton (config): same instance on every resolve')
    log.push('')

    // TODO: Покажите transient: новый инстанс каждый раз
    // TODO: Show transient: new instance each time
    log.push('Transient (requestId): new instance each time')
    log.push('')

    // TODO: Покажите scoped: одинаковый в рамках scope, разный между scopes
    // TODO: Show scoped: same within scope, different across scopes
    log.push('Scoped (dbConnection): same in scope, different across scopes')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Scoped Dependencies</h2>
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
