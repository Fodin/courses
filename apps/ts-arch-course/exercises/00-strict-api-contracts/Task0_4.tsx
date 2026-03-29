import { useState } from 'react'

// ============================================
// Задание 0.4: Query Parameters
// ============================================

// TODO: Определите тип QuerySchema — объект, где ключи — имена параметров,
//   значения — 'string' | 'number' | 'boolean' | 'string[]'
// TODO: Define QuerySchema type — an object where keys are param names,
//   values are 'string' | 'number' | 'boolean' | 'string[]'

// TODO: Создайте условный тип QueryValues<T>, который маппит:
//   'string'   -> string
//   'number'   -> number
//   'boolean'  -> boolean
//   'string[]' -> string[]
//   Все поля опциональные (?)
// TODO: Create a conditional mapped type QueryValues<T> that maps:
//   'string'   -> string
//   'number'   -> number
//   'boolean'  -> boolean
//   'string[]' -> string[]
//   All fields optional (?)

// TODO: Реализуйте функцию buildQueryString<T>(schema, params) -> string
//   - Кодируйте ключи и значения через encodeURIComponent
//   - Массивы разворачивайте: roles=admin&roles=editor
//   - Пустой результат -> пустая строка, иначе "?key=value&..."
// TODO: Implement buildQueryString<T>(schema, params) -> string
//   - Encode keys and values with encodeURIComponent
//   - Expand arrays: roles=admin&roles=editor
//   - Empty result -> empty string, otherwise "?key=value&..."

// TODO: Реализуйте функцию parseQueryString<T>(schema, queryString) -> QueryValues<T>
//   - Используйте URLSearchParams для парсинга
//   - Конвертируйте типы согласно schema: Number(), 'true'/'false' -> boolean
//   - string[] — используйте getAll()
// TODO: Implement parseQueryString<T>(schema, queryString) -> QueryValues<T>
//   - Use URLSearchParams for parsing
//   - Convert types according to schema: Number(), 'true'/'false' -> boolean
//   - string[] — use getAll()

// TODO: Определите конкретную схему usersQuerySchema:
//   search: 'string', page: 'number', limit: 'number', active: 'boolean', roles: 'string[]'
//   Используйте "as const satisfies QuerySchema"
// TODO: Define a concrete usersQuerySchema:
//   search: 'string', page: 'number', limit: 'number', active: 'boolean', roles: 'string[]'
//   Use "as const satisfies QuerySchema"

export function Task0_4() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Query Parameters ===')
    log.push('')

    // TODO: Продемонстрируйте buildQueryString с разными параметрами
    // TODO: Demonstrate buildQueryString with different parameters
    log.push('Build query string:')
    log.push('  ... вызовите buildQueryString и выведите результат')
    log.push('')

    // TODO: Продемонстрируйте parseQueryString
    // TODO: Demonstrate parseQueryString
    log.push('Parse query string:')
    log.push('  ... вызовите parseQueryString и выведите типы значений')
    log.push('')

    // TODO: Покажите roundtrip: build -> parse -> сравнение
    // TODO: Show roundtrip: build -> parse -> comparison
    log.push('Roundtrip test:')
    log.push('  ... сериализуйте и десериализуйте обратно')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 0.4: Query Parameters</h2>
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
