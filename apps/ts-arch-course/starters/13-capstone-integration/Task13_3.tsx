import { useState } from 'react'

// ============================================
// Задание 13.3: Infrastructure Layer
// ============================================

// TODO: Реализуйте infrastructure adapters:
//   InMemoryOrderRepository implements OrderRepository
//   ConsoleLogger implements Logger
//   InMemoryEventBus implements EventBus
//   Все реализуют port-интерфейсы из domain/application layer

export function Task13_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Infrastructure Layer ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Infrastructure Layer')
    log.push('  ... InMemoryOrderRepository, ConsoleLogger, InMemoryEventBus')
    log.push('  ... реализуют абстракции из domain layer')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.3: Infrastructure Layer</h2>
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
