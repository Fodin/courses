import { useState } from 'react'

// ============================================
// Задание 5.1: Value Objects — Решение
// ============================================

declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type Email = Brand<string, 'Email'>
type Money = Brand<number, 'Money'>
type Currency = 'USD' | 'EUR' | 'RUB'
type PositiveInt = Brand<number, 'PositiveInt'>
type UserId = Brand<string, 'UserId'>

function createEmail(raw: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(raw)) {
    throw new Error(`Invalid email: ${raw}`)
  }
  return raw.toLowerCase() as Email
}

function createMoney(amount: number): Money {
  if (!Number.isFinite(amount)) {
    throw new Error(`Invalid money amount: ${amount}`)
  }
  return Math.round(amount * 100) / 100 as Money
}

function createPositiveInt(n: number): PositiveInt {
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`Expected positive integer, got: ${n}`)
  }
  return n as PositiveInt
}

function createUserId(raw: string): UserId {
  if (raw.length === 0) {
    throw new Error('UserId cannot be empty')
  }
  return raw as UserId
}

interface Price {
  readonly amount: Money
  readonly currency: Currency
}

function createPrice(amount: number, currency: Currency): Price {
  return { amount: createMoney(amount), currency }
}

function addPrices(a: Price, b: Price): Price {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add prices with different currencies: ${a.currency} and ${b.currency}`)
  }
  return createPrice((a.amount as number) + (b.amount as number), a.currency)
}

function formatPrice(price: Price): string {
  const symbols: Record<Currency, string> = { USD: '$', EUR: '€', RUB: '₽' }
  return `${symbols[price.currency]}${(price.amount as number).toFixed(2)}`
}

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Branded Types: Email ===')
    try {
      const email = createEmail('User@Example.COM')
      log.push(`  Created email: ${email}`)
      // const bad: Email = 'not-an-email' // TS error: string is not assignable to Email
    } catch (e) {
      log.push(`  Error: ${(e as Error).message}`)
    }
    try {
      createEmail('invalid')
      log.push('  Should not reach here')
    } catch (e) {
      log.push(`  Rejected invalid email: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Branded Types: Money ===')
    const price1 = createPrice(19.99, 'USD')
    const price2 = createPrice(5.50, 'USD')
    const total = addPrices(price1, price2)
    log.push(`  Price 1: ${formatPrice(price1)}`)
    log.push(`  Price 2: ${formatPrice(price2)}`)
    log.push(`  Total:   ${formatPrice(total)}`)

    log.push('')
    log.push('=== Branded Types: PositiveInt ===')
    const quantity = createPositiveInt(5)
    log.push(`  Quantity: ${quantity}`)
    try {
      createPositiveInt(-3)
    } catch (e) {
      log.push(`  Rejected negative: ${(e as Error).message}`)
    }
    try {
      createPositiveInt(2.5)
    } catch (e) {
      log.push(`  Rejected float: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Type Safety: preventing misuse ===')
    log.push('  Money cannot be assigned to regular number variable expecting Money')
    log.push('  UserId cannot be mixed with Email — different brands')
    log.push('  addPrices rejects different currencies at runtime')

    try {
      const usd = createPrice(10, 'USD')
      const eur = createPrice(20, 'EUR')
      addPrices(usd, eur)
    } catch (e) {
      log.push(`  Mixed currencies: ${(e as Error).message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Value Objects</h2>
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

// ============================================
// Задание 5.2: Entities & Aggregates — Решение
// ============================================

type EntityId<T extends string> = Brand<string, T>
type OrderId = EntityId<'OrderId'>
type OrderItemId = EntityId<'OrderItemId'>

function generateId<T extends string>(prefix: string): EntityId<T> {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}` as EntityId<T>
}

interface Entity<Id> {
  readonly id: Id
  readonly createdAt: Date
  readonly updatedAt: Date
}

interface OrderItem extends Entity<OrderItemId> {
  readonly productName: string
  readonly quantity: PositiveInt
  readonly price: Price
}

type OrderStatus = 'draft' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'

interface Order extends Entity<OrderId> {
  readonly status: OrderStatus
  readonly items: readonly OrderItem[]
  readonly customerEmail: Email
}

function createOrderItem(
  productName: string,
  quantity: number,
  price: number,
  currency: Currency
): OrderItem {
  const now = new Date()
  return {
    id: generateId<'OrderItemId'>('item'),
    createdAt: now,
    updatedAt: now,
    productName,
    quantity: createPositiveInt(quantity),
    price: createPrice(price, currency),
  }
}

function createOrder(customerEmail: string, items: OrderItem[]): Order {
  if (items.length === 0) {
    throw new Error('Order must have at least one item')
  }
  const now = new Date()
  return {
    id: generateId<'OrderId'>('order'),
    createdAt: now,
    updatedAt: now,
    status: 'draft',
    items,
    customerEmail: createEmail(customerEmail),
  }
}

function addItemToOrder(order: Order, item: OrderItem): Order {
  if (order.status !== 'draft') {
    throw new Error(`Cannot add items to order in status: ${order.status}`)
  }
  return { ...order, items: [...order.items, item], updatedAt: new Date() }
}

function confirmOrder(order: Order): Order {
  if (order.status !== 'draft') {
    throw new Error(`Cannot confirm order in status: ${order.status}`)
  }
  return { ...order, status: 'confirmed', updatedAt: new Date() }
}

function calculateOrderTotal(order: Order): Price {
  return order.items.reduce<Price>(
    (total, item) => {
      const itemTotal = createPrice(
        (item.price.amount as number) * (item.quantity as number),
        item.price.currency
      )
      return addPrices(total, itemTotal)
    },
    createPrice(0, order.items[0].price.currency)
  )
}

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Creating Order Aggregate ===')
    const item1 = createOrderItem('TypeScript Book', 2, 29.99, 'USD')
    const item2 = createOrderItem('Keyboard', 1, 149.99, 'USD')

    let order = createOrder('customer@example.com', [item1])
    log.push(`  Order created: ${order.id}`)
    log.push(`  Status: ${order.status}`)
    log.push(`  Items: ${order.items.length}`)

    log.push('')
    log.push('=== Adding Item to Order ===')
    order = addItemToOrder(order, item2)
    log.push(`  Items after add: ${order.items.length}`)
    const total = calculateOrderTotal(order)
    log.push(`  Total: ${formatPrice(total)}`)

    log.push('')
    log.push('=== Confirming Order ===')
    order = confirmOrder(order)
    log.push(`  Status after confirm: ${order.status}`)

    log.push('')
    log.push('=== Aggregate Invariants ===')
    try {
      addItemToOrder(order, item1)
    } catch (e) {
      log.push(`  Cannot add to confirmed: ${(e as Error).message}`)
    }
    try {
      createOrder('customer@example.com', [])
    } catch (e) {
      log.push(`  Cannot create empty: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Entity Identity ===')
    const itemA = createOrderItem('Same Product', 1, 10, 'USD')
    const itemB = createOrderItem('Same Product', 1, 10, 'USD')
    log.push(`  Item A id: ${itemA.id}`)
    log.push(`  Item B id: ${itemB.id}`)
    log.push(`  Same entity? ${itemA.id === itemB.id} (entities compared by id, not value)`)

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

// ============================================
// Задание 5.3: Domain Events — Решение
// ============================================

interface DomainEvent<T extends string, P = undefined> {
  readonly type: T
  readonly payload: P
  readonly timestamp: number
  readonly eventId: string
}

function createEvent<T extends string>(type: T): DomainEvent<T>
function createEvent<T extends string, P>(type: T, payload: P): DomainEvent<T, P>
function createEvent(type: string, payload?: unknown) {
  return {
    type,
    payload,
    timestamp: Date.now(),
    eventId: `evt_${Math.random().toString(36).slice(2, 10)}`,
  }
}

type OrderCreated = DomainEvent<'OrderCreated', { orderId: string; customerEmail: string }>
type OrderItemAdded = DomainEvent<'OrderItemAdded', { orderId: string; productName: string; quantity: number }>
type OrderConfirmed = DomainEvent<'OrderConfirmed', { orderId: string; total: number }>
type OrderCancelled = DomainEvent<'OrderCancelled', { orderId: string; reason: string }>

type OrderEvent = OrderCreated | OrderItemAdded | OrderConfirmed | OrderCancelled

type EventHandler<E extends DomainEvent<string, unknown>> = (event: E) => void

type EventHandlerMap<E extends DomainEvent<string, unknown>> = {
  [K in E['type']]?: EventHandler<Extract<E, { type: K }>>
}

class EventBus<E extends DomainEvent<string, unknown>> {
  private handlers: Map<string, Array<EventHandler<E>>> = new Map()
  private eventLog: E[] = []

  on<K extends E['type']>(
    type: K,
    handler: EventHandler<Extract<E, { type: K }>>
  ): () => void {
    const list = this.handlers.get(type) ?? []
    list.push(handler as EventHandler<E>)
    this.handlers.set(type, list)
    return () => {
      const idx = list.indexOf(handler as EventHandler<E>)
      if (idx >= 0) list.splice(idx, 1)
    }
  }

  emit(event: E): void {
    this.eventLog.push(event)
    const list = this.handlers.get(event.type) ?? []
    for (const handler of list) {
      handler(event)
    }
  }

  getLog(): readonly E[] {
    return this.eventLog
  }
}

export function Task5_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const bus = new EventBus<OrderEvent>()

    log.push('=== Registering Event Handlers ===')

    bus.on('OrderCreated', (event) => {
      log.push(`  [Handler] Order created: ${event.payload.orderId} for ${event.payload.customerEmail}`)
    })

    bus.on('OrderItemAdded', (event) => {
      log.push(`  [Handler] Item added: ${event.payload.quantity}x ${event.payload.productName}`)
    })

    bus.on('OrderConfirmed', (event) => {
      log.push(`  [Handler] Order confirmed: ${event.payload.orderId}, total=$${event.payload.total}`)
    })

    const unsubCancel = bus.on('OrderCancelled', (event) => {
      log.push(`  [Handler] Order cancelled: ${event.payload.reason}`)
    })

    log.push('  Registered 4 handlers')

    log.push('')
    log.push('=== Emitting Events ===')

    bus.emit(createEvent('OrderCreated', {
      orderId: 'order-001',
      customerEmail: 'alice@example.com',
    }))

    bus.emit(createEvent('OrderItemAdded', {
      orderId: 'order-001',
      productName: 'TypeScript Handbook',
      quantity: 2,
    }))

    bus.emit(createEvent('OrderConfirmed', {
      orderId: 'order-001',
      total: 59.98,
    }))

    log.push('')
    log.push('=== Unsubscribe and Re-emit ===')
    unsubCancel()
    log.push('  Unsubscribed from OrderCancelled')

    bus.emit(createEvent('OrderCancelled', {
      orderId: 'order-001',
      reason: 'Customer request',
    }))
    log.push('  Emitted OrderCancelled — no handler fired (unsubscribed)')

    log.push('')
    log.push('=== Event Log ===')
    const eventLog = bus.getLog()
    log.push(`  Total events: ${eventLog.length}`)
    for (const evt of eventLog) {
      log.push(`  [${evt.type}] id=${evt.eventId}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Domain Events</h2>
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

// ============================================
// Задание 5.4: Specifications — Решение
// ============================================

interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

class BaseSpec<T> implements Specification<T> {
  constructor(private readonly predicate: (candidate: T) => boolean) {}

  isSatisfiedBy(candidate: T): boolean {
    return this.predicate(candidate)
  }

  and(other: Specification<T>): Specification<T> {
    return new BaseSpec((c) => this.isSatisfiedBy(c) && other.isSatisfiedBy(c))
  }

  or(other: Specification<T>): Specification<T> {
    return new BaseSpec((c) => this.isSatisfiedBy(c) || other.isSatisfiedBy(c))
  }

  not(): Specification<T> {
    return new BaseSpec((c) => !this.isSatisfiedBy(c))
  }
}

function spec<T>(predicate: (candidate: T) => boolean): Specification<T> {
  return new BaseSpec(predicate)
}

interface Product {
  name: string
  price: number
  category: string
  inStock: boolean
  rating: number
}

const isInStock = spec<Product>((p) => p.inStock)
const isAffordable = (maxPrice: number) => spec<Product>((p) => p.price <= maxPrice)
const hasMinRating = (min: number) => spec<Product>((p) => p.rating >= min)
const inCategory = (cat: string) => spec<Product>((p) => p.category === cat)

function filterBySpec<T>(items: T[], specification: Specification<T>): T[] {
  return items.filter((item) => specification.isSatisfiedBy(item))
}

export function Task5_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    const products: Product[] = [
      { name: 'TypeScript Handbook', price: 29.99, category: 'books', inStock: true, rating: 4.8 },
      { name: 'React Guide', price: 39.99, category: 'books', inStock: true, rating: 4.2 },
      { name: 'Mechanical Keyboard', price: 149.99, category: 'electronics', inStock: true, rating: 4.9 },
      { name: 'USB Hub', price: 19.99, category: 'electronics', inStock: false, rating: 3.8 },
      { name: 'Desk Lamp', price: 45.00, category: 'office', inStock: true, rating: 4.5 },
      { name: 'Monitor Stand', price: 89.99, category: 'office', inStock: false, rating: 4.1 },
      { name: 'Vim Sticker Pack', price: 5.99, category: 'merch', inStock: true, rating: 4.7 },
    ]

    log.push('=== Simple Specifications ===')
    const inStockProducts = filterBySpec(products, isInStock)
    log.push(`  In stock (${inStockProducts.length}): ${inStockProducts.map((p) => p.name).join(', ')}`)

    const affordable = filterBySpec(products, isAffordable(40))
    log.push(`  Under $40 (${affordable.length}): ${affordable.map((p) => p.name).join(', ')}`)

    log.push('')
    log.push('=== Composed Specifications: AND ===')
    const goodAffordableBooks = isInStock
      .and(isAffordable(40))
      .and(hasMinRating(4.5))
      .and(inCategory('books'))
    const result1 = filterBySpec(products, goodAffordableBooks)
    log.push(`  In stock + under $40 + rating>=4.5 + books:`)
    log.push(`    ${result1.map((p) => `${p.name} ($${p.price}, ${p.rating}★)`).join(', ') || 'none'}`)

    log.push('')
    log.push('=== Composed Specifications: OR ===')
    const booksOrElectronics = inCategory('books').or(inCategory('electronics'))
    const result2 = filterBySpec(products, booksOrElectronics)
    log.push(`  Books or electronics (${result2.length}): ${result2.map((p) => p.name).join(', ')}`)

    log.push('')
    log.push('=== Composed Specifications: NOT ===')
    const notInStock = isInStock.not()
    const outOfStock = filterBySpec(products, notInStock)
    log.push(`  Out of stock (${outOfStock.length}): ${outOfStock.map((p) => p.name).join(', ')}`)

    log.push('')
    log.push('=== Complex Composition ===')
    const premiumOrCheap = hasMinRating(4.7).and(isInStock)
      .or(isAffordable(10).and(isInStock))
    const result3 = filterBySpec(products, premiumOrCheap)
    log.push(`  (rating>=4.7 AND in stock) OR (under $10 AND in stock):`)
    for (const p of result3) {
      log.push(`    ${p.name} — $${p.price}, ${p.rating}★, stock=${p.inStock}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Specifications</h2>
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

// ============================================
// Задание 5.5: Invariant Types — Решение
// ============================================

type NonEmptyArray<T> = readonly [T, ...T[]]

function createNonEmpty<T>(items: T[]): NonEmptyArray<T> {
  if (items.length === 0) {
    throw new Error('Array must not be empty')
  }
  return items as unknown as NonEmptyArray<T>
}

function headOf<T>(arr: NonEmptyArray<T>): T {
  return arr[0]
}

type VerifiedEmail = Brand<string, 'VerifiedEmail'>
type UnverifiedEmail = Brand<string, 'UnverifiedEmail'>

function registerEmail(raw: string): UnverifiedEmail {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(raw)) throw new Error(`Invalid email format: ${raw}`)
  return raw.toLowerCase() as UnverifiedEmail
}

function verifyEmail(email: UnverifiedEmail, _code: string): VerifiedEmail {
  // In real app: check verification code
  return email as unknown as VerifiedEmail
}

function sendNewsletter(_email: VerifiedEmail, subject: string): string {
  return `Newsletter "${subject}" sent to ${_email}`
}

type NonNegativeBalance = Brand<number, 'NonNegativeBalance'>

function createBalance(amount: number): NonNegativeBalance {
  if (amount < 0) throw new Error(`Balance cannot be negative: ${amount}`)
  return amount as NonNegativeBalance
}

function deposit(balance: NonNegativeBalance, amount: number): NonNegativeBalance {
  if (amount <= 0) throw new Error('Deposit must be positive')
  return ((balance as number) + amount) as NonNegativeBalance
}

function withdraw(balance: NonNegativeBalance, amount: number): NonNegativeBalance {
  if (amount <= 0) throw new Error('Withdrawal must be positive')
  const newBalance = (balance as number) - amount
  if (newBalance < 0) throw new Error(`Insufficient funds: have ${balance}, need ${amount}`)
  return newBalance as NonNegativeBalance
}

type Percentage = Brand<number, 'Percentage'>

function createPercentage(value: number): Percentage {
  if (value < 0 || value > 100) throw new Error(`Percentage must be 0-100, got: ${value}`)
  return value as Percentage
}

function applyDiscount(price: number, discount: Percentage): number {
  return price * (1 - (discount as number) / 100)
}

export function Task5_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== NonEmptyArray: compile-time non-empty guarantee ===')
    const items = createNonEmpty(['apple', 'banana', 'cherry'])
    const first = headOf(items)
    log.push(`  First item: ${first} (always safe, no undefined check needed)`)
    log.push(`  Items: [${items.join(', ')}]`)
    try {
      createNonEmpty([])
    } catch (e) {
      log.push(`  Empty array rejected: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Email Verification: type-level workflow ===')
    const unverified = registerEmail('user@example.com')
    log.push(`  Registered: ${unverified} (UnverifiedEmail)`)
    // sendNewsletter(unverified, 'Hello') // TS Error: UnverifiedEmail != VerifiedEmail
    log.push('  sendNewsletter(unverified, ...) would cause TS error')

    const verified = verifyEmail(unverified, 'ABC123')
    const result = sendNewsletter(verified, 'Weekly Update')
    log.push(`  After verification: ${result}`)

    log.push('')
    log.push('=== NonNegativeBalance: financial invariant ===')
    let balance = createBalance(100)
    log.push(`  Initial balance: $${balance}`)

    balance = deposit(balance, 50)
    log.push(`  After deposit $50: $${balance}`)

    balance = withdraw(balance, 30)
    log.push(`  After withdraw $30: $${balance}`)

    try {
      withdraw(balance, 200)
    } catch (e) {
      log.push(`  Over-withdrawal rejected: ${(e as Error).message}`)
    }

    try {
      createBalance(-10)
    } catch (e) {
      log.push(`  Negative balance rejected: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Percentage: bounded numeric type ===')
    const discount = createPercentage(20)
    const originalPrice = 100
    const finalPrice = applyDiscount(originalPrice, discount)
    log.push(`  Original: $${originalPrice}`)
    log.push(`  Discount: ${discount}%`)
    log.push(`  Final: $${finalPrice}`)

    try {
      createPercentage(150)
    } catch (e) {
      log.push(`  Invalid percentage rejected: ${(e as Error).message}`)
    }

    log.push('')
    log.push('=== Type-level invariant summary ===')
    log.push('  NonEmptyArray<T> → headOf() never returns undefined')
    log.push('  VerifiedEmail → sendNewsletter() only accepts verified')
    log.push('  NonNegativeBalance → withdraw() cannot overdraft')
    log.push('  Percentage → always 0-100, safe for calculations')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.5: Invariant Types</h2>
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
