import { useState } from 'react'

// ============================================
// Задание 2.3: Conditional Builder Methods
// ============================================

// TODO: Определите типы конфигурации для трёх БД:
//   PostgresConfig: type 'postgres', host, port, ssl, poolSize
//   MysqlConfig: type 'mysql', host, port, charset
//   SqliteConfig: type 'sqlite', filename, mode: 'memory'|'file'
//   Все extends BaseDbConfig { database, logging }
// TODO: Define config types for three databases:
//   PostgresConfig, MysqlConfig, SqliteConfig
//   All extend BaseDbConfig { database, logging }

// TODO: Реализуйте DbConfigBuilder<T extends DatabaseType | null = null>
//   Выбор БД: postgres(), mysql(), sqlite() — меняют generic T
//   Общие: database(name), logging(enabled) — доступны всегда
//   Условные (через this параметр):
//     host(), port() — только для postgres|mysql
//     ssl(), poolSize() — только для postgres
//     charset() — только для mysql
//     filename(), mode() — только для sqlite
//   build(this: DbConfigBuilder<Exclude<T, null>>) — нельзя вызвать без выбора БД
// TODO: Implement DbConfigBuilder<T extends DatabaseType | null = null>
//   DB selection: postgres(), mysql(), sqlite() — change generic T
//   Common: database(name), logging(enabled) — always available
//   Conditional (via this parameter):
//     host(), port() — only for postgres|mysql
//     ssl(), poolSize() — only for postgres
//     charset() — only for mysql
//     filename(), mode() — only for sqlite
//   build() — cannot be called without choosing a database

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Conditional Builder Methods ===')
    log.push('')

    // TODO: Создайте PostgreSQL конфигурацию (ssl, poolSize доступны)
    // TODO: Create PostgreSQL config (ssl, poolSize available)
    log.push('PostgreSQL config:')
    log.push('  ... builder.postgres().host("localhost").ssl(true).poolSize(20).build()')
    log.push('')

    // TODO: Создайте MySQL конфигурацию (charset доступен, ssl/poolSize — нет)
    // TODO: Create MySQL config (charset available, no ssl/poolSize)
    log.push('MySQL config:')
    log.push('  ... builder.mysql().host("db.example.com").charset("utf8mb4").build()')
    log.push('')

    // TODO: Создайте SQLite конфигурацию (filename, mode доступны, host/port — нет)
    // TODO: Create SQLite config (filename, mode available, no host/port)
    log.push('SQLite config:')
    log.push('  ... builder.sqlite().filename("./data.db").mode("file").build()')
    log.push('')

    log.push('Conditional methods (compile-time):')
    log.push('  builder.sqlite().host("x")      // Error: no host for sqlite')
    log.push('  builder.mysql().poolSize(10)     // Error: poolSize is postgres-only')
    log.push('  new DbConfigBuilder().build()    // Error: must choose database first')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Conditional Builder Methods</h2>
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
