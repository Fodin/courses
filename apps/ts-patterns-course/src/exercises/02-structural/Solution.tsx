import { useState } from 'react'

// ============================================
// Задание 2.1: Adapter — Решение
// ============================================

interface ILogger {
  info(message: string): string
  error(message: string): string
  warn(message: string): string
}

class ConsoleLogger {
  log(message: string): string {
    return `[Console] ${message}`
  }
}

class FileLogger {
  writeLog(level: string, message: string): string {
    return `[File:${level}] ${message}`
  }
}

class ExternalLogger {
  sendLog(payload: { severity: number; text: string }): string {
    return `[External:severity=${payload.severity}] ${payload.text}`
  }
}

class ConsoleLoggerAdapter implements ILogger {
  constructor(private logger: ConsoleLogger) {}

  info(message: string): string {
    return this.logger.log(`[INFO] ${message}`)
  }
  error(message: string): string {
    return this.logger.log(`[ERROR] ${message}`)
  }
  warn(message: string): string {
    return this.logger.log(`[WARN] ${message}`)
  }
}

class FileLoggerAdapter implements ILogger {
  constructor(private logger: FileLogger) {}

  info(message: string): string {
    return this.logger.writeLog('INFO', message)
  }
  error(message: string): string {
    return this.logger.writeLog('ERROR', message)
  }
  warn(message: string): string {
    return this.logger.writeLog('WARN', message)
  }
}

class ExternalLoggerAdapter implements ILogger {
  constructor(private logger: ExternalLogger) {}

  info(message: string): string {
    return this.logger.sendLog({ severity: 0, text: message })
  }
  error(message: string): string {
    return this.logger.sendLog({ severity: 2, text: message })
  }
  warn(message: string): string {
    return this.logger.sendLog({ severity: 1, text: message })
  }
}

function createLogger(type: 'console' | 'file' | 'external'): ILogger {
  switch (type) {
    case 'console':
      return new ConsoleLoggerAdapter(new ConsoleLogger())
    case 'file':
      return new FileLoggerAdapter(new FileLogger())
    case 'external':
      return new ExternalLoggerAdapter(new ExternalLogger())
  }
}

export function Task2_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const loggerTypes: Array<'console' | 'file' | 'external'> = ['console', 'file', 'external']

    for (const type of loggerTypes) {
      const logger = createLogger(type)
      log.push(`--- ${type.toUpperCase()} Logger ---`)
      log.push(`  ${logger.info('Application started')}`)
      log.push(`  ${logger.warn('Low memory warning')}`)
      log.push(`  ${logger.error('Connection failed')}`)
      log.push('')
    }

    log.push('--- Unified interface ---')
    log.push('All loggers use the same ILogger interface')
    log.push('Client code does not depend on specific logger implementations')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Adapter</h2>
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

// ============================================
// Задание 2.2: Decorator — Решение
// ============================================

type AnyFunction = (...args: never[]) => unknown

function withLogging<T extends AnyFunction>(fn: T, name: string): T {
  return ((...args: Parameters<T>) => {
    const result = fn(...args)
    return `[LOG:${name}] ${result}`
  }) as unknown as T
}

function withCache<T extends AnyFunction>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>()
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return `[CACHE HIT] ${cache.get(key)!}`
    }
    const result = fn(...args) as ReturnType<T>
    cache.set(key, result)
    return result
  }) as unknown as T
}

function withRetry<T extends AnyFunction>(fn: T, maxRetries: number): T {
  let attempt = 0
  return ((...args: Parameters<T>) => {
    for (let i = 0; i <= maxRetries; i++) {
      try {
        attempt++
        return fn(...args)
      } catch (e) {
        if (i === maxRetries) {
          return `[RETRY FAILED] after ${attempt} attempts: ${e instanceof Error ? e.message : e}`
        }
      }
    }
  }) as unknown as T
}

function computeExpensive(n: number): string {
  let sum = 0
  for (let i = 0; i < n; i++) sum += i
  return `sum(0..${n}) = ${sum}`
}

let failCount = 0
function unreliableOperation(input: string): string {
  failCount++
  if (failCount % 3 !== 0) {
    throw new Error(`Operation failed (attempt ${failCount})`)
  }
  return `Success with "${input}" on attempt ${failCount}`
}

export function Task2_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('--- withLogging decorator ---')
    const loggedCompute = withLogging(computeExpensive, 'computeExpensive')
    log.push(`  ${loggedCompute(100)}`)
    log.push(`  ${loggedCompute(1000)}`)

    log.push('')
    log.push('--- withCache decorator ---')
    const cachedCompute = withCache(computeExpensive)
    log.push(`  1st call: ${cachedCompute(100)}`)
    log.push(`  2nd call: ${cachedCompute(100)}`)
    log.push(`  3rd call (new args): ${cachedCompute(200)}`)

    log.push('')
    log.push('--- withRetry decorator ---')
    failCount = 0
    const retriedOp = withRetry(unreliableOperation, 3)
    log.push(`  ${retriedOp('test-data')}`)

    log.push('')
    log.push('--- Composing decorators ---')
    const enhanced = withLogging(withCache(computeExpensive), 'cached+logged')
    log.push(`  ${enhanced(500)}`)
    log.push(`  ${enhanced(500)}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Decorator</h2>
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

// ============================================
// Задание 2.3: Facade — Решение
// ============================================

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

class OrderFacade {
  constructor(
    private inventory: InventoryService,
    private payment: PaymentService,
    private shipping: ShippingService
  ) {}

  placeOrder(order: OrderRequest): OrderResult {
    const logs: string[] = []

    // Step 1: Check inventory
    const stock = this.inventory.check(order.productId)
    if (!stock.available) {
      logs.push(`[Inventory] Product ${order.productId} out of stock`)
      return { success: false, error: 'Out of stock', logs }
    }
    logs.push(`[Inventory] Product ${order.productId} available (qty: ${stock.quantity})`)

    // Step 2: Process payment
    const payment = this.payment.charge(order.userId, order.amount)
    if (!payment.success) {
      logs.push(`[Payment] Failed: ${payment.error}`)
      return { success: false, error: payment.error, logs }
    }
    logs.push(`[Payment] Charged $${order.amount} (txn: ${payment.transactionId})`)

    // Step 3: Reserve inventory
    this.inventory.reserve(order.productId)
    logs.push(`[Inventory] Reserved product ${order.productId}`)

    // Step 4: Create shipment
    const shipment = this.shipping.createShipment(order.orderId, order.address)
    logs.push(`[Shipping] Created shipment ${shipment.trackingId}`)

    return { success: true, orderId: order.orderId, logs }
  }
}

export function Task2_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const facade = new OrderFacade(
      new InventoryService(),
      new PaymentService(),
      new ShippingService()
    )

    // Order 1: Successful
    log.push('--- Order 1: Successful ---')
    const result1 = facade.placeOrder({
      orderId: 'ORD-001',
      productId: 'PROD-1',
      userId: 'user-1',
      amount: 99,
      address: '123 Main St',
    })
    log.push(...result1.logs)
    log.push(result1.success ? `Order ${result1.orderId} placed!` : `Failed: ${result1.error}`)

    // Order 2: Out of stock
    log.push('')
    log.push('--- Order 2: Out of stock ---')
    const result2 = facade.placeOrder({
      orderId: 'ORD-002',
      productId: 'PROD-2',
      userId: 'user-1',
      amount: 50,
      address: '456 Elm St',
    })
    log.push(...result2.logs)
    log.push(result2.success ? `Order ${result2.orderId} placed!` : `Failed: ${result2.error}`)

    // Order 3: Insufficient funds
    log.push('')
    log.push('--- Order 3: Insufficient funds ---')
    const result3 = facade.placeOrder({
      orderId: 'ORD-003',
      productId: 'PROD-3',
      userId: 'user-2',
      amount: 200,
      address: '789 Oak Ave',
    })
    log.push(...result3.logs)
    log.push(result3.success ? `Order ${result3.orderId} placed!` : `Failed: ${result3.error}`)

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

// ============================================
// Задание 2.4: Proxy — Решение
// ============================================

interface ApiService {
  fetchUser(id: string): string
  fetchProduct(id: string): string
  updateUser(id: string, data: Record<string, string>): string
}

class RealApiService implements ApiService {
  fetchUser(id: string): string {
    return `User data for ${id}: { name: "User-${id}", role: "admin" }`
  }

  fetchProduct(id: string): string {
    return `Product data for ${id}: { title: "Product-${id}", price: 99 }`
  }

  updateUser(id: string, data: Record<string, string>): string {
    return `Updated user ${id}: ${JSON.stringify(data)}`
  }
}

function createLoggingProxy<T extends object>(target: T, logs: string[]): T {
  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver)
      if (typeof value !== 'function') return value

      return (...args: unknown[]) => {
        logs.push(`[Proxy:LOG] ${String(prop)}(${args.map(a => JSON.stringify(a)).join(', ')})`)
        const result = (value as (...a: unknown[]) => unknown).apply(obj, args)
        logs.push(`[Proxy:LOG] → ${result}`)
        return result
      }
    }
  })
}

function createCachingProxy<T extends object>(target: T, logs: string[]): T {
  const cache = new Map<string, unknown>()

  return new Proxy(target, {
    get(obj, prop, receiver) {
      const value = Reflect.get(obj, prop, receiver)
      if (typeof value !== 'function') return value

      return (...args: unknown[]) => {
        const key = `${String(prop)}:${JSON.stringify(args)}`

        if (cache.has(key)) {
          logs.push(`[Proxy:CACHE HIT] ${String(prop)}(${args.map(a => JSON.stringify(a)).join(', ')})`)
          return cache.get(key)
        }

        logs.push(`[Proxy:CACHE MISS] ${String(prop)}(${args.map(a => JSON.stringify(a)).join(', ')})`)
        const result = (value as (...a: unknown[]) => unknown).apply(obj, args)
        cache.set(key, result)
        return result
      }
    }
  })
}

export function Task2_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    // Logging proxy
    log.push('--- Logging Proxy ---')
    const loggingLogs: string[] = []
    const loggingApi = createLoggingProxy(new RealApiService(), loggingLogs)
    loggingApi.fetchUser('42')
    loggingApi.fetchProduct('99')
    log.push(...loggingLogs)

    // Caching proxy
    log.push('')
    log.push('--- Caching Proxy ---')
    const cachingLogs: string[] = []
    const cachingApi = createCachingProxy(new RealApiService(), cachingLogs)

    cachingApi.fetchUser('42')
    cachingApi.fetchUser('42')
    cachingApi.fetchUser('100')
    cachingApi.fetchProduct('99')
    cachingApi.fetchProduct('99')
    log.push(...cachingLogs)

    log.push('')
    log.push('--- Proxy transparency ---')
    log.push('The proxy has the same interface as the original object')
    log.push('Client code does not know it is using a proxy')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 2.4: Proxy</h2>
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
