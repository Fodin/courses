import { useState } from 'react'

// ============================================
// Задание 3.3: Sorting & Filtering
// Task 3.3: Sorting & Filtering
// ============================================

// TODO: Реализуйте сортировку: ?sort=createdAt&order=desc
// TODO: Implement sorting: ?sort=createdAt&order=desc
// TODO: Реализуйте фильтрацию: ?status=published&author=john
// TODO: Implement filtering: ?status=published&author=john
// TODO: Поддержите множественную сортировку: ?sort=rating,-createdAt
// TODO: Support multi-field sorting: ?sort=rating,-createdAt
// TODO: Реализуйте поиск: ?search=keyword (по нескольким полям)
// TODO: Implement search: ?search=keyword (across multiple fields)

export function Task3_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Sorting & Filtering ===')
    log.push('')

    // TODO: Парсите query-параметры сортировки в SQL ORDER BY
    // TODO: Parse sort query parameters into SQL ORDER BY
    // TODO: Реализуйте whitelist допустимых полей для сортировки/фильтрации
    // TODO: Implement a whitelist of allowed fields for sorting/filtering
    // TODO: Покажите SQL injection защиту при построении запросов
    // TODO: Show SQL injection protection when building queries
    // TODO: Комбинируйте фильтрацию + сортировку + пагинацию
    // TODO: Combine filtering + sorting + pagination
    log.push('Sorting & Filtering')
    log.push('  ... GET /articles?sort=-createdAt,title&status=published')
    log.push('  ... parseSortParam("-createdAt") -> { field: "createdAt", order: "DESC" }')
    log.push('  ... whitelist: ["title", "createdAt", "rating"]')
    log.push('  ... фильтрация + сортировка + пагинация в одном запросе')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: Sorting & Filtering</h2>
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
