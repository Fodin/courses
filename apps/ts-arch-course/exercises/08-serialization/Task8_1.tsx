import { useState } from 'react'

// ============================================
// Задание 8.1: Schema Inference
// ============================================

// TODO: Определите SchemaField<T> { type: T, required?: boolean } и ObjectSchema
// TODO: Создайте условный тип InferSchema<T> — выводит TypeScript тип из schema:
//   'string' -> string, 'number' -> number, 'boolean' -> boolean
//   required: false -> T | undefined
// TODO: Реализуйте createSchema<T>(schema) с методами:
//   validate(data): data is InferSchema<T> — runtime проверка
//   parse(data) -> InferSchema<T> | null

export function Task8_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Schema Inference ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Schema Inference')
    log.push('  ... определите userSchema { id: number, name: string, ... }')
    log.push('  ... покажите validate для валидных и невалидных данных')
    log.push('  ... после parse() TypeScript знает тип: user.id -> number')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: Schema Inference</h2>
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
