import { useState } from 'react'

// ============================================
// Задание 7.3: Clean Architecture
// ============================================

type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'cancelled'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

// TODO: Create class Order (Domain Entity) with:
//   private _status: OrderStatus
//   constructor(readonly id: string, readonly items: OrderItem[], status: OrderStatus = 'pending')
//
//   get status(): OrderStatus — return _status
//
//   get total(): number
//     — calculate sum of (price * quantity) for all items
//     — hint: use reduce
//
//   confirm(): void
//     — only allowed from 'pending', otherwise throw Error(`Cannot confirm order in status: ${this._status}`)
//     — set _status to 'confirmed'
//
//   cancel(): void
//     — only allowed from 'pending' or 'confirmed'
//     — otherwise throw Error(`Cannot cancel order in status: ${this._status}`)
//     — set _status to 'cancelled'

// TODO: Define interface OrderRepository (Domain Port):
//   save(order: Order): void
//   findById(id: string): Order | null

// TODO: Create class InMemoryOrderRepository implementing OrderRepository:
//   private orders: Map<string, Order>
//   save — store order by id
//   findById — return order or null

let orderIdCounter = 0

// TODO: Create class CreateOrderUseCase (Application Layer):
//   constructor(private readonly orderRepo: OrderRepository)
//
//   execute(items: OrderItem[]): Order
//     — create new Order with id = `order-${++orderIdCounter}`
//     — if order.total <= 0, throw Error('Order total must be positive')
//     — save to repository
//     — return the order

export function Task7_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    orderIdCounter = 0

    // TODO: Create InMemoryOrderRepository
    // TODO: Create CreateOrderUseCase with the repository

    // TODO: Create an order with items:
    //   { name: 'Widget', price: 25, quantity: 2 }
    //   { name: 'Gadget', price: 50, quantity: 1 }
    // Log: created order id, total, status

    // TODO: Confirm the order, log status after confirm
    // TODO: Cancel the order, log status after cancel

    // TODO: Try to confirm a cancelled order, catch error, log message

    // TODO: Create another order with { name: 'Book', price: 15, quantity: 3 }
    // Confirm it, log status

    // TODO: Try to create an order with { name: 'Free', price: 0, quantity: 1 }
    // Catch error, log message about positive total

    // TODO: Verify persistence: find first order in repo by id, log found id and status

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Clean Architecture</h2>
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
