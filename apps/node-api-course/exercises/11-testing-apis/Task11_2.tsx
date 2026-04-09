import { useState } from 'react'

// ============================================
// Задание 11.2: Integration Tests
// Task 11.2: Integration Tests
// ============================================

// TODO: Напишите интеграционные тесты через supertest / Write integration tests via supertest
// TODO: Тестируйте полный цикл запроса: route -> middleware -> handler -> response / Test the full request cycle: route -> middleware -> handler -> response
// TODO: Проверяйте статус-коды, заголовки, тело ответа / Verify status codes, headers, response body
// TODO: Тестируйте edge cases: невалидный input, 404, аутентификация / Test edge cases: invalid input, 404, authentication

export function Task11_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Integration Tests ===')
    log.push('')

    // TODO: Создайте app instance для тестов (без listen) / Create app instance for tests (without listen)
    // TODO: Используйте supertest: request(app).get("/api/users").expect(200) / Use supertest: request(app).get("/api/users").expect(200)
    // TODO: Протестируйте POST с body, проверьте 201 и Location header / Test POST with body, verify 201 and Location header
    // TODO: Покажите тестирование auth: .set("Authorization", "Bearer token") / Show auth testing: .set("Authorization", "Bearer token")
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
