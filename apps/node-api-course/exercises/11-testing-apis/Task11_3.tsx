import { useState } from 'react'

// ============================================
// Задание 11.3: Test Database
// ============================================

// TODO: Настройте тестовую БД для интеграционных тестов
// TODO: Используйте отдельную DATABASE_URL для тестов (или testcontainers)
// TODO: Реализуйте setup/teardown: миграции перед тестами, очистка после
// TODO: Покажите изоляцию тестов через транзакции с ROLLBACK

export function Task11_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Test Database ===')
    log.push('')

    // TODO: Настройте beforeAll: миграция тестовой БД
    // TODO: Реализуйте beforeEach: BEGIN transaction
    // TODO: Реализуйте afterEach: ROLLBACK (изоляция тестов)
    // TODO: Покажите testcontainers для запуска PostgreSQL в Docker
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
