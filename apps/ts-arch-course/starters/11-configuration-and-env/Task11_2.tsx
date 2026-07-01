import { useState } from 'react'

// ============================================
// Задание 11.2: Feature Flags
// ============================================

// TODO: Определите FlagDefinition<T>, FlagRegistry, FlagValues<R>
// TODO: Реализуйте createFeatureFlags<R>(registry, overrides?):
//   isEnabled(flag) -> boolean, getValue<K>(flag) -> typed value
//   getAll() -> FlagValues<R>, override(flag, value), reset(flag), resetAll()
// TODO: Создайте featureRegistry: DARK_MODE (bool), MAX_UPLOAD_SIZE (number),
//   API_VERSION (string), NEW_DASHBOARD (bool), CACHE_TTL (number)

export function Task11_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Feature Flags ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Feature Flags')
    log.push('  ... defaults, getValue (typed!), overrides, reset')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: Feature Flags</h2>
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
