import { useState } from 'react'

// ============================================
// Задание 5.2: Entities & Aggregates
// ============================================

// TODO: Определите EntityId<T> = Brand<string, T> и Entity<Id> { id, createdAt, updatedAt }
// TODO: Define EntityId<T> = Brand<string, T> and Entity<Id> { id, createdAt, updatedAt }

// TODO: Создайте OrderItem extends Entity<OrderItemId> с Value Objects:
//   productName: string, quantity: PositiveInt, price: Price
// TODO: Create OrderItem extends Entity<OrderItemId> with Value Objects

// TODO: Создайте Order aggregate extends Entity<OrderId>:
//   status: OrderStatus ('draft'|'confirmed'|'shipped'|'delivered'|'cancelled')
//   items: readonly OrderItem[], customerEmail: Email
// TODO: Create Order aggregate extends Entity<OrderId>

// TODO: Реализуйте функции с инвариантами:
//   createOrder(email, items) — items.length > 0, иначе ошибка
//   addItemToOrder(order, item) — только в статусе 'draft'
//   confirmOrder(order) — только из 'draft'
//   calculateOrderTotal(order) -> Price
// TODO: Implement functions enforcing aggregate invariants

export function Task5_2() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('=== Entities & Aggregates ===')
    log.push('')
    log.push('Creating Order Aggregate:')
    log.push('  ... createOrder, addItemToOrder, calculateOrderTotal, confirmOrder')
    log.push('')
    log.push('Aggregate Invariants:')
    log.push('  ... addItemToOrder на confirmed -> Error')
    log.push('  ... createOrder с пустыми items -> Error')
    log.push('')
    log.push('Entity Identity:')
    log.push('  ... itemA.id !== itemB.id (entities compared by id)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Entities & Aggregates</h2>
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
