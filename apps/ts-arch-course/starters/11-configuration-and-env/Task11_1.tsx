import { useState } from 'react'

// ============================================
// Задание 11.1: Config Loader
// ============================================

// TODO: Определите ConfigSchema, InferConfig<S> — выведение типов из схемы
// TODO: Реализуйте createConfigLoader<S>(schema):
//   load(env, overrides?) -> ConfigResult<InferConfig<S>>
//   Парсинг строк в нужные типы, defaults, required/optional, validate
//   merge(base, override) -> InferConfig<S>
// TODO: Создайте appConfigSchema: DATABASE_URL (required string), PORT (number, default 3000),
//   DEBUG (boolean, default false), API_KEY (required), MAX_CONNECTIONS (number, validate 1-100)

export function Task11_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Config Loader ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Config Loader')
    log.push('  ... покажите успешную загрузку, defaults, validation errors, overrides')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.1: Config Loader</h2>
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
