import { useState } from 'react'

// ============================================
// Задание 3.2: Pagination
// ============================================

// TODO: Реализуйте пагинацию для списочных эндпоинтов
// TODO: Поддержите offset-based: ?page=2&limit=10
// TODO: Реализуйте cursor-based пагинацию: ?cursor=abc&limit=10
// TODO: Верните метаданные: total, page, limit, hasNext, nextCursor

export function Task3_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Pagination ===')
    log.push('')

    // TODO: Реализуйте offset pagination с вычислением skip/take
    // TODO: Реализуйте cursor pagination с encode/decode курсора
    // TODO: Верните Link header с rel="next", rel="prev"
    // TODO: Сравните производительность offset vs cursor на больших данных
    log.push('Pagination')
    log.push('  ... GET /articles?page=2&limit=10')
    log.push('  ... response: { data: [...], meta: { total: 100, page: 2, hasNext: true } }')
    log.push('  ... cursor: GET /articles?cursor=eyJpZCI6MTB9&limit=10')
    log.push('  ... Link: </articles?page=3>; rel="next"')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: Pagination</h2>
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
