import { useState } from 'react'

// ============================================
// Задание 10.2: Cross-Module Contracts
// ============================================

// TODO: Определите контракты: Entity, Repository<T>, EventBus<TEvents>
// TODO: Создайте модуль Products: addProduct, updateStock, getProduct
//   Зависит от Repository<Product> и EventBus<ProductEvents>
// TODO: Создайте модуль Orders: createOrder, getOrder
//   Зависит от { getProduct } (минимальный интерфейс!) и EventBus
// TODO: Реализуйте createInMemoryRepo<T>() и createEventBus<TEvents>()

export function Task10_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Cross-Module Contracts ===')
    log.push('')

    // TODO: Реализуйте демонстрацию и выведите результаты в log
    // TODO: Implement the demonstration and push results to log
    log.push('Cross-Module Contracts')
    log.push('  ... создайте продукты, заказ через контракты между модулями')
    log.push('  ... покажите события и минимальные зависимости')


    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 10.2: Cross-Module Contracts</h2>
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
