import { useState } from 'react'

// ============================================
// Задание 2.3: Facade
// ============================================

// --- Interfaces (do not modify) ---

interface OrderRequest {
  orderId: string
  productId: string
  userId: string
  amount: number
  address: string
}

interface OrderResult {
  success: boolean
  orderId?: string
  error?: string
  logs: string[]
}

// --- Subsystem services (do not modify) ---

class InventoryService {
  private stock = new Map<string, number>([
    ['PROD-1', 10],
    ['PROD-2', 0],
    ['PROD-3', 5],
  ])

  check(productId: string): { available: boolean; quantity: number } {
    const qty = this.stock.get(productId) ?? 0
    return { available: qty > 0, quantity: qty }
  }

  reserve(productId: string): boolean {
    const qty = this.stock.get(productId) ?? 0
    if (qty <= 0) return false
    this.stock.set(productId, qty - 1)
    return true
  }
}

class PaymentService {
  private balances = new Map<string, number>([
    ['user-1', 1000],
    ['user-2', 50],
  ])

  charge(userId: string, amount: number): { success: boolean; transactionId?: string; error?: string } {
    const balance = this.balances.get(userId) ?? 0
    if (balance < amount) {
      return { success: false, error: `Insufficient funds: ${balance} < ${amount}` }
    }
    this.balances.set(userId, balance - amount)
    return { success: true, transactionId: `TXN-${Date.now()}` }
  }
}

class ShippingService {
  createShipment(orderId: string, address: string): { trackingId: string } {
    return { trackingId: `SHIP-${orderId}-${Date.now()}` }
  }
}

// TODO: Create class OrderFacade
//   - Constructor accepts: InventoryService, PaymentService, ShippingService
//   - Method placeOrder(order: OrderRequest): OrderResult
//   - Step 1: Check inventory via this.inventory.check(order.productId)
//     - If not available: add log "[Inventory] Product X out of stock", return failure
//     - If available: add log "[Inventory] Product X available (qty: N)"
//   - Step 2: Process payment via this.payment.charge(order.userId, order.amount)
//     - If failed: add log "[Payment] Failed: <error>", return failure
//     - If success: add log "[Payment] Charged $N (txn: <transactionId>)"
//   - Step 3: Reserve inventory via this.inventory.reserve(order.productId)
//     - Add log "[Inventory] Reserved product X"
//   - Step 4: Create shipment via this.shipping.createShipment(order.orderId, order.address)
//     - Add log "[Shipping] Created shipment <trackingId>"
//   - Return { success: true, orderId: order.orderId, logs }

export function Task2_3() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // TODO: Create OrderFacade with new instances of all three services

    // TODO: Scenario 1 — Successful order
    //   placeOrder({ orderId: 'ORD-001', productId: 'PROD-1', userId: 'user-1', amount: 99, address: '123 Main St' })
    //   Push logs and success/failure message

    // TODO: Scenario 2 — Out of stock
    //   placeOrder({ orderId: 'ORD-002', productId: 'PROD-2', userId: 'user-1', amount: 50, address: '456 Elm St' })
    //   Push logs and failure message

    // TODO: Scenario 3 — Insufficient funds
    //   placeOrder({ orderId: 'ORD-003', productId: 'PROD-3', userId: 'user-2', amount: 200, address: '789 Oak Ave' })
    //   Push logs and failure message

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Facade</h2>
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
