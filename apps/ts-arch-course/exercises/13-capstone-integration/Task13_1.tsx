import { useState } from 'react'

// ============================================
// Задание 13.1: Domain Layer
// ============================================

// TODO: Реализуйте доменный слой интернет-магазина:
//   Value Objects: Email (с валидацией), Money (с арифметикой и проверкой валюты)
//   Domain Events: OrderCreated, ItemAdded, OrderConfirmed, OrderCancelled
//   Entity: Order aggregate с items, status, invariants
//   Используйте Result<T, E> для обработки ошибок вместо throw

export function Task13_1() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Domain Layer ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Domain Layer')
    log.push('  ... Value Objects с валидацией')
    log.push('  ... Domain Events как discriminated union')
    log.push('  ... Order aggregate с бизнес-правилами')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.1: Domain Layer</h2>
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
