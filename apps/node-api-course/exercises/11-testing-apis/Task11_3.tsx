import { useState } from 'react'

// ============================================
// Задание 11.3: Test Database
// Task 11.3: Test Database
// ============================================

// TODO: Настройте тестовую БД для интеграционных тестов / Set up a test database for integration tests
// TODO: Используйте отдельную DATABASE_URL для тестов (или testcontainers) / Use a separate DATABASE_URL for tests (or testcontainers)
// TODO: Реализуйте setup/teardown: миграции перед тестами, очистка после / Implement setup/teardown: migrations before tests, cleanup after
// TODO: Покажите изоляцию тестов через транзакции с ROLLBACK / Show test isolation via transactions with ROLLBACK

export function Task11_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Test Database ===')
    log.push('')

    // TODO: Настройте beforeAll: миграция тестовой БД / Set up beforeAll: migrate test database
    // TODO: Реализуйте beforeEach: BEGIN transaction / Implement beforeEach: BEGIN transaction
    // TODO: Реализуйте afterEach: ROLLBACK (изоляция тестов) / Implement afterEach: ROLLBACK (test isolation)
    // TODO: Покажите testcontainers для запуска PostgreSQL в Docker / Show testcontainers for running PostgreSQL in Docker
    log.push('Test Database')
    log.push('  ... beforeAll: await runMigrations(testDbUrl)')
    log.push('  ... beforeEach: await db.query("BEGIN")')
    log.push('  ... afterEach: await db.query("ROLLBACK")')
    log.push('  ... testcontainers: new PostgreSqlContainer().start()')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 11.3: Test Database</h2>
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
