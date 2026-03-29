import { useState } from 'react'

// ============================================
// Задание 7.2: Knex
// ============================================

// TODO: Используйте Knex.js как query builder
// TODO: Создайте миграции для создания таблиц
// TODO: Реализуйте CRUD через Knex fluent API
// TODO: Покажите seeds для заполнения тестовых данных

export function Task7_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Knex Query Builder ===')
    log.push('')

    // TODO: Создайте knex({ client: "pg", connection: DATABASE_URL })
    // TODO: Реализуйте knex("users").where({ id }).first()
    // TODO: Покажите knex.schema.createTable() в миграции
    // TODO: Продемонстрируйте join, groupBy, having
    log.push('Knex.js')
    log.push('  ... knex("users").where("age", ">", 18).orderBy("name")')
    log.push('  ... knex("users").insert({ name, email }).returning("*")')
    log.push('  ... migration: knex.schema.createTable("users", t => { ... })')
    log.push('  ... knex("orders").join("users", "orders.userId", "users.id")')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Knex</h2>
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
