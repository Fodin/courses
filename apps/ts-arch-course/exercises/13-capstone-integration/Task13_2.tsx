import { useState } from 'react'

// ============================================
// Задание 13.2: Application Layer
// ============================================

// TODO: Реализуйте application layer (use cases):
//   CreateOrderUseCase: принимает deps через DI, создаёт Order, эмитит событие
//   ConfirmOrderUseCase: проверяет exist, transitions, эмитит событие
//   Каждый use case зависит от абстракций (Repository, EventBus)
//   Возвращает Result<T, E> для всех операций

export function Task13_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Application Layer ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Application Layer')
    log.push('  ... use cases с DI и Result для ошибок')
    log.push('  ... CreateOrderUseCase, ConfirmOrderUseCase')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.2: Application Layer</h2>
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
