import { useState } from 'react'

// ============================================
// Задание 8.3: Data Migrations
// ============================================

// TODO: Определите Migration<TFrom, TTo> { fromVersion, toVersion, migrate }
// TODO: Определите VersionedData<T> { version: number, data: T }
// TODO: Создайте 4 версии UserV1..V4 и миграции между ними:
//   V1->V2: name split to firstName/lastName
//   V2->V3: email -> emails.primary, добавить role
//   V3->V4: добавить preferences
// TODO: Реализуйте MigrationPipeline: register(migration), migrate(data, targetVersion)

export function Task8_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Data Migrations ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Data Migrations')
    log.push('  ... мигрируйте UserV1 до V4 через цепочку миграций')
    log.push('  ... покажите пошаговую миграцию и полную цепочку')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Data Migrations</h2>
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
