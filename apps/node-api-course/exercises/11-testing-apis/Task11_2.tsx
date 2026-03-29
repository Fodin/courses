import { useState } from 'react'

// ============================================
// Задание 11.2: Integration Tests
// ============================================

// TODO: Напишите интеграционные тесты через supertest
// TODO: Тестируйте полный цикл запроса: route -> middleware -> handler -> response
// TODO: Проверяйте статус-коды, заголовки, тело ответа
// TODO: Тестируйте edge cases: невалидный input, 404, аутентификация

export function Task11_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Integration Tests ===')
    log.push('')

    // TODO: Создайте app instance для тестов (без listen)
    // TODO: Используйте supertest: request(app).get("/api/users").expect(200)
    // TODO: Протестируйте POST с body, проверьте 201 и Location header
    // TODO: Покажите тестирование auth: .set("Authorization", "Bearer token")
    log.push('Integration Tests')
    log.push('  ... const res = await request(app).get("/api/users")')
    log.push('  ... expect(res.status).toBe(200)')
    log.push('  ... expect(res.body).toHaveLength(3)')
    log.push('  ... request(app).post("/api/users").send({ name }).expect(201)')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.2: Integration Tests</h2>
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
