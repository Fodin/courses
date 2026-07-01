import { useState } from 'react'

// ============================================
// Задание 11.3: Environment Types
// ============================================

// TODO: Определите EnvVarDef<T> { key, transform?, fallback?, required? }
// TODO: Создайте фабрики: envString, envNumber, envBoolean, envEnum
// TODO: Реализуйте loadEnv<S>(spec, env) -> { ok, value } | { ok: false, errors }
// TODO: Создайте appEnvSpec: nodeEnv (enum), port (number), dbUrl (required string),
//   debug (boolean), logLevel (enum), redisHost/redisPort

export function Task11_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Environment Types ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Environment Types')
    log.push('  ... полная загрузка, fallbacks, validation errors')
    log.push('  ... result.value.port is number, result.value.nodeEnv is enum')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Environment Types</h2>
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
