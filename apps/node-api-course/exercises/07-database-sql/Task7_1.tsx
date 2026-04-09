import { useState } from 'react'

// ============================================
// Задание 7.1: Raw pg
// Task 7.1: Raw pg
// ============================================

// TODO: Подключитесь к PostgreSQL через pg (node-postgres)
// TODO: Connect to PostgreSQL via pg (node-postgres)
// TODO: Создайте Pool с настройками подключения
// TODO: Create Pool with connection settings
// TODO: Выполните параметризованные запросы (SELECT, INSERT, UPDATE, DELETE)
// TODO: Execute parameterized queries (SELECT, INSERT, UPDATE, DELETE)
// TODO: Используйте $1, $2 плейсхолдеры для защиты от SQL injection
// TODO: Use $1, $2 placeholders for SQL injection protection

export function Task7_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Raw pg (node-postgres) ===')
    log.push('')

    // TODO: Создайте Pool({ connectionString: DATABASE_URL })
    // TODO: Create Pool({ connectionString: DATABASE_URL })
    // TODO: Выполните pool.query('SELECT * FROM users WHERE id = $1', [id])
    // TODO: Execute pool.query('SELECT * FROM users WHERE id = $1', [id])
    // TODO: Покажите pool.connect() для транзакций
    // TODO: Show pool.connect() for transactions
    // TODO: Обработайте ошибки подключения и таймауты
    // TODO: Handle connection errors and timeouts
    log.push('Raw pg')
    log.push('  ... const pool = new Pool({ connectionString })')
    log.push('  ... const { rows } = await pool.query("SELECT...", [param])')
    log.push('  ... параметризованные запросы: $1, $2 (не конкатенация!)')
    log.push('  ... pool.on("error") для обработки потерянных соединений')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Raw pg</h2>
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
