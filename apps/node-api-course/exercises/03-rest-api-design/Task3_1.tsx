import { useState } from 'react'

// ============================================
// Задание 3.1: CRUD Endpoints
// ============================================

// TODO: Спроектируйте полный CRUD API для ресурса (например, /articles)
// TODO: Используйте правильные HTTP-методы: GET, POST, PUT, PATCH, DELETE
// TODO: Верните корректные статус-коды: 200, 201, 204, 404, 409
// TODO: Реализуйте идемпотентность PUT и частичное обновление через PATCH

export function Task3_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CRUD Endpoints ===')
    log.push('')

    // TODO: Реализуйте GET /articles (список), GET /articles/:id (один)
    // TODO: POST /articles -> 201 Created + Location header
    // TODO: PUT /articles/:id -> 200 (полная замена), PATCH -> частичное обновление
    // TODO: DELETE /articles/:id -> 204 No Content
    log.push('CRUD API Design')
    log.push('  ... GET /articles -> 200 [{ id, title, body }]')
    log.push('  ... POST /articles -> 201 + Location: /articles/42')
    log.push('  ... PUT /articles/:id -> 200 (полная замена)')
    log.push('  ... PATCH /articles/:id -> 200 (частичное обновление)')
    log.push('  ... DELETE /articles/:id -> 204 No Content')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: CRUD Endpoints</h2>
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
