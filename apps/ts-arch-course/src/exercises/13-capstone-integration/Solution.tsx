import { useState } from 'react'

// ============================================
// Shared types for the Capstone project
// ============================================

type Result<T, E = string> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E }

function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}

// ============================================
// Задание 13.1: Domain Layer — Решение
// ============================================

// --- Value Objects ---

interface ValueObject<T> {
  readonly value: T
  equals(other: ValueObject<T>): boolean
}

class Email implements ValueObject<string> {
  private constructor(readonly value: string) {}

  static create(raw: string): Result<Email> {
    const trimmed = raw.trim().toLowerCase()
    if (!trimmed.includes('@') || !trimmed.includes('.')) {
      return err(`Invalid email: "${raw}"`)
    }
    return ok(new Email(trimmed))
  }

  equals(other: ValueObject<string>): boolean {
    return this.value === other.value
  }

  toString(): string {
    return this.value
  }
}

class Money implements ValueObject<{ amount: number; currency: string }> {
  private constructor(
    readonly amount: number,
    readonly currency: string
  ) {}

  get value() {
    return { amount: this.amount, currency: this.currency }
  }

  static create(amount: number, currency: string): Result<Money> {
    if (amount < 0) return err('Amount cannot be negative')
    if (!currency || currency.length !== 3) return err('Currency must be 3-letter code')
    return ok(new Money(Math.round(amount * 100) / 100, currency.toUpperCase()))
  }

  add(other: Money): Result<Money> {
    if (this.currency !== other.currency) {
      return err(`Cannot add ${this.currency} and ${other.currency}`)
    }
    return Money.create(this.amount + other.amount, this.currency)
  }

  equals(other: ValueObject<{ amount: number; currency: string }>): boolean {
    return this.amount === other.value.amount && this.currency === other.value.currency
  }

  toString(): string {
    return `${this.amount.toFixed(2)} ${this.currency}`
  }
}

// --- Domain Events ---

type DomainEvent =
  | { readonly type: 'OrderCreated'; readonly orderId: string; readonly customerId: string; readonly total: Money; readonly timestamp: number }
  | { readonly type: 'ItemAdded'; readonly orderId: string; readonly productId: string; readonly quantity: number; readonly price: Money; readonly timestamp: number }
  | { readonly type: 'OrderConfirmed'; readonly orderId: string; readonly timestamp: number }
  | { readonly type: 'OrderCancelled'; readonly orderId: string; readonly reason: string; readonly timestamp: number }

// --- Entity ---

type OrderStatus = 'draft' | 'confirmed' | 'cancelled'

interface OrderItem {
  readonly productId: string
  readonly name: string
  readonly quantity: number
  readonly price: Money
}

interface Order {
  readonly id: string
  readonly customerId: string
  readonly status: OrderStatus
  readonly items: readonly OrderItem[]
  readonly total: Money
  readonly events: readonly DomainEvent[]
  readonly createdAt: number
}

function createOrder(id: string, customerId: string, currency: string): Result<Order> {
  const total = Money.create(0, currency)
  if (!total.ok) return err(total.error)
  const order: Order = {
    id,
    customerId,
    status: 'draft',
    items: [],
    total: total.value,
    events: [{ type: 'OrderCreated', orderId: id, customerId, total: total.value, timestamp: Date.now() }],
    createdAt: Date.now(),
  }
  return ok(order)
}

function addItem(order: Order, item: { productId: string; name: string; quantity: number; price: Money }): Result<Order> {
  if (order.status !== 'draft') return err(`Cannot add items to ${order.status} order`)
  if (item.quantity <= 0) return err('Quantity must be positive')
  if (item.price.currency !== order.total.currency) return err('Currency mismatch')

  const itemTotal = Money.create(item.price.amount * item.quantity, item.price.currency)
  if (!itemTotal.ok) return err(itemTotal.error)

  const newTotal = order.total.add(itemTotal.value)
  if (!newTotal.ok) return err(newTotal.error)

  const newItem: OrderItem = { ...item }
  const event: DomainEvent = {
    type: 'ItemAdded',
    orderId: order.id,
    productId: item.productId,
    quantity: item.quantity,
    price: item.price,
    timestamp: Date.now(),
  }

  return ok({
    ...order,
    items: [...order.items, newItem],
    total: newTotal.value,
    events: [...order.events, event],
  })
}

function confirmOrder(order: Order): Result<Order> {
  if (order.status !== 'draft') return err(`Cannot confirm ${order.status} order`)
  if (order.items.length === 0) return err('Cannot confirm empty order')
  return ok({
    ...order,
    status: 'confirmed' as const,
    events: [...order.events, { type: 'OrderConfirmed', orderId: order.id, timestamp: Date.now() }],
  })
}

function cancelOrder(order: Order, reason: string): Result<Order> {
  if (order.status === 'cancelled') return err('Order already cancelled')
  return ok({
    ...order,
    status: 'cancelled' as const,
    events: [...order.events, { type: 'OrderCancelled', orderId: order.id, reason, timestamp: Date.now() }],
  })
}

// --- Specification ---

type Specification<T> = {
  readonly name: string
  isSatisfiedBy(entity: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

function createSpec<T>(name: string, predicate: (entity: T) => boolean): Specification<T> {
  return {
    name,
    isSatisfiedBy: predicate,
    and(other) {
      return createSpec(`(${name} AND ${other.name})`, (e) => predicate(e) && other.isSatisfiedBy(e))
    },
    or(other) {
      return createSpec(`(${name} OR ${other.name})`, (e) => predicate(e) || other.isSatisfiedBy(e))
    },
    not() {
      return createSpec(`NOT(${name})`, (e) => !predicate(e))
    },
  }
}

const isDraft = createSpec<Order>('isDraft', (o) => o.status === 'draft')
const isConfirmed = createSpec<Order>('isConfirmed', (o) => o.status === 'confirmed')
const hasItems = createSpec<Order>('hasItems', (o) => o.items.length > 0)
const totalOver = (amount: number) => createSpec<Order>(`totalOver(${amount})`, (o) => o.total.amount > amount)

export function Task13_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Domain Layer: Value Objects ===')
    const email1 = Email.create('Alice@Example.COM')
    const email2 = Email.create('invalid')
    if (email1.ok) log.push(`  Email: ${email1.value} (normalized)`)
    if (!email2.ok) log.push(`  Invalid email: ${email2.error}`)

    const price1 = Money.create(29.99, 'USD')
    const price2 = Money.create(15.50, 'USD')
    if (price1.ok && price2.ok) {
      const sum = price1.value.add(price2.value)
      if (sum.ok) log.push(`  ${price1.value} + ${price2.value} = ${sum.value}`)
    }

    const negMoney = Money.create(-5, 'USD')
    if (!negMoney.ok) log.push(`  Negative money: ${negMoney.error}`)

    log.push('')
    log.push('=== Domain Layer: Entity + Events ===')
    const orderResult = createOrder('order-1', 'customer-1', 'USD')
    if (!orderResult.ok) { setResults([orderResult.error]); return }
    let order = orderResult.value
    log.push(`  Created: ${order.id}, status=${order.status}, total=${order.total}`)

    const p1 = Money.create(29.99, 'USD')
    const p2 = Money.create(9.99, 'USD')
    if (p1.ok) {
      const r = addItem(order, { productId: 'prod-1', name: 'TypeScript Book', quantity: 2, price: p1.value })
      if (r.ok) { order = r.value; log.push(`  Added item: 2x TypeScript Book @ ${p1.value}`) }
    }
    if (p2.ok) {
      const r = addItem(order, { productId: 'prod-2', name: 'Stickers', quantity: 5, price: p2.value })
      if (r.ok) { order = r.value; log.push(`  Added item: 5x Stickers @ ${p2.value}`) }
    }
    log.push(`  Total: ${order.total}`)

    const confirmed = confirmOrder(order)
    if (confirmed.ok) {
      order = confirmed.value
      log.push(`  Confirmed: status=${order.status}`)
    }

    const addAfterConfirm = addItem(order, { productId: 'x', name: 'x', quantity: 1, price: p1.ok ? p1.value : order.total })
    if (!addAfterConfirm.ok) log.push(`  Add after confirm: ${addAfterConfirm.error}`)

    log.push('')
    log.push('=== Domain Layer: Events ===')
    for (const event of order.events) {
      log.push(`  [${event.type}] orderId=${event.orderId}`)
    }

    log.push('')
    log.push('=== Domain Layer: Specifications ===')
    const draftOrder = createOrder('o2', 'c1', 'USD')
    if (draftOrder.ok) {
      const draft = draftOrder.value
      log.push(`  isDraft(draft): ${isDraft.isSatisfiedBy(draft)}`)
      log.push(`  isConfirmed(draft): ${isConfirmed.isSatisfiedBy(draft)}`)
      log.push(`  hasItems(draft): ${hasItems.isSatisfiedBy(draft)}`)

      const confirmable = isDraft.and(hasItems)
      log.push(`  Spec: ${confirmable.name}`)
      log.push(`  confirmable(draft): ${confirmable.isSatisfiedBy(draft)}`)
      log.push(`  confirmable(confirmedOrder): ${confirmable.isSatisfiedBy(order)}`)

      const highValue = isDraft.and(totalOver(50))
      log.push(`  ${highValue.name} on confirmed order total=${order.total}: ${highValue.isSatisfiedBy(order)}`)
    }

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

// ============================================
// Задание 13.2: Application Layer — Решение
// ============================================

// --- Commands ---

type Command =
  | { readonly type: 'CreateOrder'; readonly customerId: string; readonly currency: string }
  | { readonly type: 'AddItem'; readonly orderId: string; readonly productId: string; readonly name: string; readonly quantity: number; readonly price: number; readonly currency: string }
  | { readonly type: 'ConfirmOrder'; readonly orderId: string }
  | { readonly type: 'CancelOrder'; readonly orderId: string; readonly reason: string }

// --- Queries ---

type Query =
  | { readonly type: 'GetOrder'; readonly orderId: string }
  | { readonly type: 'ListOrders'; readonly customerId: string; readonly status?: OrderStatus }
  | { readonly type: 'GetOrderTotal'; readonly orderId: string }

// --- Handler types ---

type CommandHandler<C extends Command, R = void> = {
  readonly commandType: C['type']
  execute(command: C): Result<R>
}

type QueryHandler<Q extends Query, R = unknown> = {
  readonly queryType: Q['type']
  execute(query: Q): Result<R>
}

// --- In-memory store for demonstration ---

class OrderStore {
  private orders = new Map<string, Order>()
  private counter = 0

  nextId(): string {
    this.counter++
    return `order-${this.counter}`
  }

  save(order: Order): void {
    this.orders.set(order.id, order)
  }

  findById(id: string): Order | undefined {
    return this.orders.get(id)
  }

  findByCustomer(customerId: string, status?: OrderStatus): Order[] {
    return Array.from(this.orders.values()).filter((o) =>
      o.customerId === customerId && (!status || o.status === status)
    )
  }
}

function createCreateOrderHandler(store: OrderStore): CommandHandler<Extract<Command, { type: 'CreateOrder' }>, string> {
  return {
    commandType: 'CreateOrder',
    execute(cmd) {
      const id = store.nextId()
      const orderResult = createOrder(id, cmd.customerId, cmd.currency)
      if (!orderResult.ok) return err(orderResult.error)
      store.save(orderResult.value)
      return ok(id)
    },
  }
}

function createAddItemHandler(store: OrderStore): CommandHandler<Extract<Command, { type: 'AddItem' }>> {
  return {
    commandType: 'AddItem',
    execute(cmd) {
      const order = store.findById(cmd.orderId)
      if (!order) return err(`Order ${cmd.orderId} not found`)
      const price = Money.create(cmd.price, cmd.currency)
      if (!price.ok) return err(price.error)
      const updated = addItem(order, { productId: cmd.productId, name: cmd.name, quantity: cmd.quantity, price: price.value })
      if (!updated.ok) return err(updated.error)
      store.save(updated.value)
      return ok(undefined)
    },
  }
}

function createConfirmOrderHandler(store: OrderStore): CommandHandler<Extract<Command, { type: 'ConfirmOrder' }>> {
  return {
    commandType: 'ConfirmOrder',
    execute(cmd) {
      const order = store.findById(cmd.orderId)
      if (!order) return err(`Order ${cmd.orderId} not found`)
      const confirmed = confirmOrder(order)
      if (!confirmed.ok) return err(confirmed.error)
      store.save(confirmed.value)
      return ok(undefined)
    },
  }
}

function createCancelOrderHandler(store: OrderStore): CommandHandler<Extract<Command, { type: 'CancelOrder' }>> {
  return {
    commandType: 'CancelOrder',
    execute(cmd) {
      const order = store.findById(cmd.orderId)
      if (!order) return err(`Order ${cmd.orderId} not found`)
      const cancelled = cancelOrder(order, cmd.reason)
      if (!cancelled.ok) return err(cancelled.error)
      store.save(cancelled.value)
      return ok(undefined)
    },
  }
}

function createGetOrderHandler(store: OrderStore): QueryHandler<Extract<Query, { type: 'GetOrder' }>, Order | undefined> {
  return {
    queryType: 'GetOrder',
    execute(query) {
      return ok(store.findById(query.orderId))
    },
  }
}

function createListOrdersHandler(store: OrderStore): QueryHandler<Extract<Query, { type: 'ListOrders' }>, Order[]> {
  return {
    queryType: 'ListOrders',
    execute(query) {
      return ok(store.findByCustomer(query.customerId, query.status))
    },
  }
}

export function Task13_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const store = new OrderStore()

    log.push('=== Application Layer: Command Handlers ===')

    const createHandler = createCreateOrderHandler(store)
    const addItemHandler = createAddItemHandler(store)
    const confirmHandler = createConfirmOrderHandler(store)
    const cancelHandler = createCancelOrderHandler(store)

    const id1 = createHandler.execute({ type: 'CreateOrder', customerId: 'cust-1', currency: 'USD' })
    if (id1.ok) log.push(`  Created order: ${id1.value}`)

    const id2 = createHandler.execute({ type: 'CreateOrder', customerId: 'cust-1', currency: 'EUR' })
    if (id2.ok) log.push(`  Created order: ${id2.value}`)

    if (id1.ok) {
      const r1 = addItemHandler.execute({
        type: 'AddItem', orderId: id1.value,
        productId: 'p1', name: 'TypeScript Guide', quantity: 1, price: 49.99, currency: 'USD',
      })
      log.push(`  Add item to ${id1.value}: ${r1.ok ? 'OK' : r1.error}`)

      const r2 = addItemHandler.execute({
        type: 'AddItem', orderId: id1.value,
        productId: 'p2', name: 'Notebook', quantity: 3, price: 12.99, currency: 'USD',
      })
      log.push(`  Add item to ${id1.value}: ${r2.ok ? 'OK' : r2.error}`)

      const c = confirmHandler.execute({ type: 'ConfirmOrder', orderId: id1.value })
      log.push(`  Confirm ${id1.value}: ${c.ok ? 'OK' : c.error}`)
    }

    if (id2.ok) {
      const c = confirmHandler.execute({ type: 'ConfirmOrder', orderId: id2.value })
      log.push(`  Confirm empty ${id2.value}: ${c.ok ? 'OK' : c.error}`)

      const cancel = cancelHandler.execute({ type: 'CancelOrder', orderId: id2.value, reason: 'Changed mind' })
      log.push(`  Cancel ${id2.value}: ${cancel.ok ? 'OK' : cancel.error}`)
    }

    log.push('')
    log.push('=== Application Layer: Query Handlers ===')
    const getHandler = createGetOrderHandler(store)
    const listHandler = createListOrdersHandler(store)

    if (id1.ok) {
      const orderResult = getHandler.execute({ type: 'GetOrder', orderId: id1.value })
      if (orderResult.ok && orderResult.value) {
        const o = orderResult.value
        log.push(`  GetOrder(${o.id}): status=${o.status}, items=${o.items.length}, total=${o.total}`)
      }
    }

    const allOrders = listHandler.execute({ type: 'ListOrders', customerId: 'cust-1' })
    if (allOrders.ok) {
      log.push(`  ListOrders(cust-1): ${allOrders.value.length} orders`)
      for (const o of allOrders.value) {
        log.push(`    ${o.id}: status=${o.status}, total=${o.total}`)
      }
    }

    const confirmed = listHandler.execute({ type: 'ListOrders', customerId: 'cust-1', status: 'confirmed' })
    if (confirmed.ok) {
      log.push(`  ListOrders(cust-1, confirmed): ${confirmed.value.length} orders`)
    }

    log.push('')
    log.push('=== Application Layer: Error handling ===')
    const notFound = addItemHandler.execute({
      type: 'AddItem', orderId: 'nonexistent',
      productId: 'p1', name: 'x', quantity: 1, price: 10, currency: 'USD',
    })
    if (!notFound.ok) log.push(`  Add to nonexistent: ${notFound.error}`)

    if (id1.ok) {
      const addToConfirmed = addItemHandler.execute({
        type: 'AddItem', orderId: id1.value,
        productId: 'p3', name: 'x', quantity: 1, price: 5, currency: 'USD',
      })
      if (!addToConfirmed.ok) log.push(`  Add to confirmed: ${addToConfirmed.error}`)
    }

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

// ============================================
// Задание 13.3: Infrastructure Layer — Решение
// ============================================

// --- Repository interface ---

interface Repository<T, ID = string> {
  findById(id: ID): Result<T | null>
  findAll(): Result<T[]>
  save(entity: T): Result<void>
  delete(id: ID): Result<boolean>
}

// --- Event Store ---

interface EventStore<E> {
  append(streamId: string, events: E[]): void
  getStream(streamId: string): E[]
  getAllEvents(): E[]
}

class InMemoryEventStore<E> implements EventStore<E> {
  private streams = new Map<string, E[]>()

  append(streamId: string, events: E[]): void {
    const existing = this.streams.get(streamId) || []
    this.streams.set(streamId, [...existing, ...events])
  }

  getStream(streamId: string): E[] {
    return [...(this.streams.get(streamId) || [])]
  }

  getAllEvents(): E[] {
    const all: E[] = []
    for (const events of this.streams.values()) {
      all.push(...events)
    }
    return all
  }
}

// --- In-Memory Repository ---

class InMemoryOrderRepository implements Repository<Order> {
  private store = new Map<string, Order>()

  findById(id: string): Result<Order | null> {
    return ok(this.store.get(id) || null)
  }

  findAll(): Result<Order[]> {
    return ok(Array.from(this.store.values()))
  }

  save(entity: Order): Result<void> {
    this.store.set(entity.id, entity)
    return ok(undefined)
  }

  delete(id: string): Result<boolean> {
    return ok(this.store.delete(id))
  }
}

// --- External Service Adapter ---

interface NotificationService {
  notify(userId: string, message: string): Result<{ notificationId: string }>
}

interface PaymentGateway {
  charge(amount: Money, customerId: string): Result<{ transactionId: string }>
  refund(transactionId: string): Result<void>
}

class InMemoryNotificationService implements NotificationService {
  readonly sent: Array<{ userId: string; message: string }> = []
  private counter = 0

  notify(userId: string, message: string): Result<{ notificationId: string }> {
    this.counter++
    this.sent.push({ userId, message })
    return ok({ notificationId: `notif-${this.counter}` })
  }
}

class InMemoryPaymentGateway implements PaymentGateway {
  readonly charges: Array<{ amount: Money; customerId: string; transactionId: string }> = []
  readonly refunds: string[] = []
  private counter = 0

  charge(amount: Money, customerId: string): Result<{ transactionId: string }> {
    this.counter++
    const transactionId = `txn-${this.counter}`
    this.charges.push({ amount, customerId, transactionId })
    return ok({ transactionId })
  }

  refund(transactionId: string): Result<void> {
    const charge = this.charges.find((c) => c.transactionId === transactionId)
    if (!charge) return err(`Transaction ${transactionId} not found`)
    this.refunds.push(transactionId)
    return ok(undefined)
  }
}

export function Task13_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Infrastructure: Repository ===')
    const repo = new InMemoryOrderRepository()

    const order1 = createOrder('ord-1', 'cust-1', 'USD')
    const order2 = createOrder('ord-2', 'cust-2', 'EUR')
    if (order1.ok) repo.save(order1.value)
    if (order2.ok) repo.save(order2.value)

    const found = repo.findById('ord-1')
    if (found.ok && found.value) {
      log.push(`  Found: ${found.value.id}, customer=${found.value.customerId}`)
    }
    const notFound = repo.findById('ord-99')
    if (notFound.ok) log.push(`  Not found: ${notFound.value}`)

    const all = repo.findAll()
    if (all.ok) log.push(`  All orders: ${all.value.length}`)

    const deleted = repo.delete('ord-2')
    if (deleted.ok) log.push(`  Deleted ord-2: ${deleted.value}`)
    const afterDelete = repo.findAll()
    if (afterDelete.ok) log.push(`  After delete: ${afterDelete.value.length} orders`)

    log.push('')
    log.push('=== Infrastructure: Event Store ===')
    const eventStore = new InMemoryEventStore<DomainEvent>()

    if (order1.ok) {
      eventStore.append('ord-1', order1.value.events as DomainEvent[])
    }
    const p = Money.create(25, 'USD')
    if (order1.ok && p.ok) {
      const updated = addItem(order1.value, { productId: 'p1', name: 'Book', quantity: 1, price: p.value })
      if (updated.ok) {
        const newEvents = updated.value.events.slice(order1.value.events.length)
        eventStore.append('ord-1', newEvents as DomainEvent[])
      }
    }

    const stream = eventStore.getStream('ord-1')
    log.push(`  Events for ord-1: ${stream.length}`)
    for (const e of stream) {
      log.push(`    [${e.type}]`)
    }

    const allEvents = eventStore.getAllEvents()
    log.push(`  Total events: ${allEvents.length}`)

    log.push('')
    log.push('=== Infrastructure: External Adapters ===')
    const notifications = new InMemoryNotificationService()
    const payments = new InMemoryPaymentGateway()

    const notifResult = notifications.notify('cust-1', 'Your order has been created')
    if (notifResult.ok) log.push(`  Notification sent: ${notifResult.value.notificationId}`)
    log.push(`  Total notifications: ${notifications.sent.length}`)

    const chargeAmount = Money.create(49.99, 'USD')
    if (chargeAmount.ok) {
      const chargeResult = payments.charge(chargeAmount.value, 'cust-1')
      if (chargeResult.ok) {
        log.push(`  Payment charged: ${chargeResult.value.transactionId}`)
        const refundResult = payments.refund(chargeResult.value.transactionId)
        log.push(`  Refund: ${refundResult.ok ? 'OK' : refundResult.error}`)
      }
    }

    const badRefund = payments.refund('txn-999')
    if (!badRefund.ok) log.push(`  Bad refund: ${badRefund.error}`)

    log.push(`  Total charges: ${payments.charges.length}`)
    log.push(`  Total refunds: ${payments.refunds.length}`)

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

// ============================================
// Задание 13.4: API Layer — Решение
// ============================================

// --- Request validation ---

type ValidationRule<T> = {
  readonly field: string
  validate(value: T): Result<T>
}

function required<T>(field: string): ValidationRule<T | undefined | null> {
  return {
    field,
    validate(value) {
      if (value === undefined || value === null || value === '') {
        return err(`${field} is required`)
      }
      return ok(value as T)
    },
  }
}

function minLength(field: string, min: number): ValidationRule<string> {
  return {
    field,
    validate(value) {
      if (value.length < min) return err(`${field} must be at least ${min} characters`)
      return ok(value)
    },
  }
}

function positive(field: string): ValidationRule<number> {
  return {
    field,
    validate(value) {
      if (value <= 0) return err(`${field} must be positive`)
      return ok(value)
    },
  }
}

type RequestValidator<T> = {
  validate(data: unknown): Result<T, string[]>
}

// --- API DTOs ---

interface CreateOrderRequest {
  readonly customerId: string
  readonly currency: string
}

interface AddItemRequest {
  readonly orderId: string
  readonly productId: string
  readonly name: string
  readonly quantity: number
  readonly price: number
  readonly currency: string
}

interface OrderResponse {
  readonly id: string
  readonly customerId: string
  readonly status: string
  readonly items: Array<{
    readonly productId: string
    readonly name: string
    readonly quantity: number
    readonly price: string
  }>
  readonly total: string
  readonly createdAt: string
}

// --- Validators ---

function createCreateOrderValidator(): RequestValidator<CreateOrderRequest> {
  return {
    validate(data: unknown): Result<CreateOrderRequest, string[]> {
      const errors: string[] = []
      const d = data as Record<string, unknown>
      const customerIdCheck = required<string>('customerId').validate(d.customerId as string)
      if (!customerIdCheck.ok) errors.push(customerIdCheck.error)
      const currencyCheck = required<string>('currency').validate(d.currency as string)
      if (!currencyCheck.ok) errors.push(currencyCheck.error)
      if (typeof d.currency === 'string' && d.currency.length !== 3) {
        errors.push('currency must be 3-letter code')
      }
      if (errors.length > 0) return { ok: false, error: errors }
      return { ok: true, value: { customerId: d.customerId as string, currency: d.currency as string } }
    },
  }
}

function createAddItemValidator(): RequestValidator<AddItemRequest> {
  return {
    validate(data: unknown): Result<AddItemRequest, string[]> {
      const errors: string[] = []
      const d = data as Record<string, unknown>
      const orderIdCheck = required<string>('orderId').validate(d.orderId as string)
      if (!orderIdCheck.ok) errors.push(orderIdCheck.error)
      const productIdCheck = required<string>('productId').validate(d.productId as string)
      if (!productIdCheck.ok) errors.push(productIdCheck.error)
      const nameCheck = required<string>('name').validate(d.name as string)
      if (nameCheck.ok) {
        const lenCheck = minLength('name', 2).validate(d.name as string)
        if (!lenCheck.ok) errors.push(lenCheck.error)
      } else { errors.push(nameCheck.error) }
      if (typeof d.quantity !== 'number') { errors.push('quantity must be a number') }
      else {
        const qCheck = positive('quantity').validate(d.quantity)
        if (!qCheck.ok) errors.push(qCheck.error)
      }
      if (typeof d.price !== 'number') { errors.push('price must be a number') }
      else {
        const pCheck = positive('price').validate(d.price)
        if (!pCheck.ok) errors.push(pCheck.error)
      }
      if (errors.length > 0) return { ok: false, error: errors }
      return {
        ok: true,
        value: {
          orderId: d.orderId as string,
          productId: d.productId as string,
          name: d.name as string,
          quantity: d.quantity as number,
          price: d.price as number,
          currency: (d.currency as string) || 'USD',
        },
      }
    },
  }
}

// --- Response mapping ---

function toOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    customerId: order.customerId,
    status: order.status,
    items: order.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price.toString(),
    })),
    total: order.total.toString(),
    createdAt: new Date(order.createdAt).toISOString(),
  }
}

// --- API Controller ---

type ApiResponse<T> =
  | { readonly status: 200; readonly body: T }
  | { readonly status: 201; readonly body: T }
  | { readonly status: 400; readonly body: { errors: string[] } }
  | { readonly status: 404; readonly body: { message: string } }

type ApiController = {
  createOrder(body: unknown): ApiResponse<OrderResponse>
  addItem(body: unknown): ApiResponse<{ message: string }>
  getOrder(orderId: string): ApiResponse<OrderResponse>
}

function createApiController(store: OrderStore): ApiController {
  const createValidator = createCreateOrderValidator()
  const addItemValidator = createAddItemValidator()
  const createHandler = createCreateOrderHandler(store)
  const addHandler = createAddItemHandler(store)
  const getHandler = createGetOrderHandler(store)

  return {
    createOrder(body: unknown) {
      const validated = createValidator.validate(body)
      if (!validated.ok) return { status: 400, body: { errors: validated.error } }
      const result = createHandler.execute({ type: 'CreateOrder', ...validated.value })
      if (!result.ok) return { status: 400, body: { errors: [result.error] } }
      const order = store.findById(result.value)
      if (!order) return { status: 404, body: { message: 'Order creation failed' } }
      return { status: 201, body: toOrderResponse(order) }
    },

    addItem(body: unknown) {
      const validated = addItemValidator.validate(body)
      if (!validated.ok) return { status: 400, body: { errors: validated.error } }
      const result = addHandler.execute({ type: 'AddItem', ...validated.value })
      if (!result.ok) return { status: 400, body: { errors: [result.error] } }
      return { status: 200, body: { message: 'Item added' } }
    },

    getOrder(orderId: string) {
      const result = getHandler.execute({ type: 'GetOrder', orderId })
      if (!result.ok) return { status: 400, body: { errors: [result.error] } }
      if (!result.value) return { status: 404, body: { message: `Order ${orderId} not found` } }
      return { status: 200, body: toOrderResponse(result.value) }
    },
  }
}

export function Task13_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const store = new OrderStore()
    const api = createApiController(store)

    log.push('=== API Layer: Create Order ===')
    const createResult = api.createOrder({ customerId: 'cust-1', currency: 'USD' })
    log.push(`  Status: ${createResult.status}`)
    if (createResult.status === 201) {
      log.push(`  Order ID: ${createResult.body.id}`)
      log.push(`  Status: ${createResult.body.status}`)
    }

    log.push('')
    log.push('=== API Layer: Validation errors ===')
    const badCreate = api.createOrder({ currency: 'TOOLONG' })
    log.push(`  Status: ${badCreate.status}`)
    if (badCreate.status === 400) {
      for (const e of badCreate.body.errors) {
        log.push(`    ${e}`)
      }
    }

    const badItem = api.addItem({ orderId: 'ord-1', quantity: -1, price: 0 })
    log.push(`  Bad addItem status: ${badItem.status}`)
    if (badItem.status === 400) {
      for (const e of badItem.body.errors) {
        log.push(`    ${e}`)
      }
    }

    log.push('')
    log.push('=== API Layer: Add Items ===')
    if (createResult.status === 201) {
      const orderId = createResult.body.id
      const add1 = api.addItem({
        orderId, productId: 'p1', name: 'TypeScript Course', quantity: 1, price: 79.99, currency: 'USD',
      })
      log.push(`  Add item 1: status=${add1.status}`)

      const add2 = api.addItem({
        orderId, productId: 'p2', name: 'Sticker Pack', quantity: 3, price: 5.99, currency: 'USD',
      })
      log.push(`  Add item 2: status=${add2.status}`)

      const getResult = api.getOrder(orderId)
      log.push('')
      log.push('=== API Layer: Get Order (response mapping) ===')
      log.push(`  Status: ${getResult.status}`)
      if (getResult.status === 200) {
        log.push(`  Response: ${JSON.stringify(getResult.body, null, 2).split('\n').map((l, i) => i === 0 ? l : `  ${l}`).join('\n')}`)
      }
    }

    log.push('')
    log.push('=== API Layer: 404 ===')
    const notFound = api.getOrder('nonexistent')
    log.push(`  Status: ${notFound.status}`)
    if (notFound.status === 404) {
      log.push(`  Message: ${notFound.body.message}`)
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.4: API Layer</h2>
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
// Задание 13.5: Full Wiring — Решение
// ============================================

// --- DI Container ---

type ServiceFactory<T> = () => T

interface Container {
  register<T>(token: string, factory: ServiceFactory<T>): void
  resolve<T>(token: string): T
  has(token: string): boolean
}

function createContainer(): Container {
  const factories = new Map<string, ServiceFactory<unknown>>()
  const singletons = new Map<string, unknown>()

  return {
    register<T>(token: string, factory: ServiceFactory<T>): void {
      factories.set(token, factory)
    },

    resolve<T>(token: string): T {
      if (singletons.has(token)) {
        return singletons.get(token) as T
      }
      const factory = factories.get(token)
      if (!factory) {
        throw new Error(`Service "${token}" not registered`)
      }
      const instance = factory() as T
      singletons.set(token, instance)
      return instance
    },

    has(token: string): boolean {
      return factories.has(token)
    },
  }
}

// --- Typed container with token map ---

type TokenMap = {
  orderStore: OrderStore
  orderRepository: InMemoryOrderRepository
  eventStore: InMemoryEventStore<DomainEvent>
  notificationService: InMemoryNotificationService
  paymentGateway: InMemoryPaymentGateway
  createOrderHandler: ReturnType<typeof createCreateOrderHandler>
  addItemHandler: ReturnType<typeof createAddItemHandler>
  confirmOrderHandler: ReturnType<typeof createConfirmOrderHandler>
  cancelOrderHandler: ReturnType<typeof createCancelOrderHandler>
  getOrderHandler: ReturnType<typeof createGetOrderHandler>
  listOrdersHandler: ReturnType<typeof createListOrdersHandler>
  apiController: ApiController
}

interface TypedContainer {
  resolve<K extends keyof TokenMap>(token: K): TokenMap[K]
}

function wireApplication(): TypedContainer {
  const container = createContainer()

  // Infrastructure
  container.register('orderStore', () => new OrderStore())
  container.register('orderRepository', () => new InMemoryOrderRepository())
  container.register('eventStore', () => new InMemoryEventStore<DomainEvent>())
  container.register('notificationService', () => new InMemoryNotificationService())
  container.register('paymentGateway', () => new InMemoryPaymentGateway())

  // Application - command handlers
  container.register('createOrderHandler', () =>
    createCreateOrderHandler(container.resolve<OrderStore>('orderStore'))
  )
  container.register('addItemHandler', () =>
    createAddItemHandler(container.resolve<OrderStore>('orderStore'))
  )
  container.register('confirmOrderHandler', () =>
    createConfirmOrderHandler(container.resolve<OrderStore>('orderStore'))
  )
  container.register('cancelOrderHandler', () =>
    createCancelOrderHandler(container.resolve<OrderStore>('orderStore'))
  )

  // Application - query handlers
  container.register('getOrderHandler', () =>
    createGetOrderHandler(container.resolve<OrderStore>('orderStore'))
  )
  container.register('listOrdersHandler', () =>
    createListOrdersHandler(container.resolve<OrderStore>('orderStore'))
  )

  // API
  container.register('apiController', () =>
    createApiController(container.resolve<OrderStore>('orderStore'))
  )

  return {
    resolve<K extends keyof TokenMap>(token: K): TokenMap[K] {
      return container.resolve<TokenMap[K]>(token)
    },
  }
}

export function Task13_5_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Full Wiring: DI Container ===')
    const app = wireApplication()

    log.push('  Registered services:')
    log.push('    orderStore, orderRepository, eventStore')
    log.push('    notificationService, paymentGateway')
    log.push('    createOrderHandler, addItemHandler, confirmOrderHandler, cancelOrderHandler')
    log.push('    getOrderHandler, listOrdersHandler')
    log.push('    apiController')

    log.push('')
    log.push('=== Full Flow: API → Application → Domain → Infrastructure ===')

    const api = app.resolve('apiController')
    const notifications = app.resolve('notificationService')
    const payments = app.resolve('paymentGateway')
    const eventStore = app.resolve('eventStore')

    // 1. Create order via API
    const createResp = api.createOrder({ customerId: 'cust-1', currency: 'USD' })
    if (createResp.status !== 201) {
      log.push(`  Error creating order: ${JSON.stringify(createResp)}`)
      setResults(log)
      return
    }
    const orderId = createResp.body.id
    log.push(`  1. Created order: ${orderId}`)

    // 2. Add items via API
    api.addItem({ orderId, productId: 'p1', name: 'TS Patterns Course', quantity: 1, price: 99.99, currency: 'USD' })
    api.addItem({ orderId, productId: 'p2', name: 'Architecture Guide', quantity: 2, price: 49.99, currency: 'USD' })
    log.push('  2. Added 2 items')

    // 3. Get order and check total
    const getResp = api.getOrder(orderId)
    if (getResp.status === 200) {
      log.push(`  3. Order total: ${getResp.body.total}`)
      log.push(`     Items: ${getResp.body.items.length}`)
      for (const item of getResp.body.items) {
        log.push(`       ${item.name} x${item.quantity} @ ${item.price}`)
      }
    }

    // 4. Confirm order via handler
    const confirmHandler = app.resolve('confirmOrderHandler')
    const store = app.resolve('orderStore')
    const order = store.findById(orderId)
    if (order) {
      const confirmed = confirmHandler.execute({ type: 'ConfirmOrder', orderId })
      log.push(`  4. Confirm: ${confirmed.ok ? 'OK' : confirmed.error}`)
    }

    // 5. Process payment
    const price = Money.create(199.97, 'USD')
    if (price.ok) {
      const charge = payments.charge(price.value, 'cust-1')
      if (charge.ok) log.push(`  5. Payment: ${charge.value.transactionId}`)
    }

    // 6. Send notification
    const notif = notifications.notify('cust-1', `Order ${orderId} confirmed and paid`)
    if (notif.ok) log.push(`  6. Notification: ${notif.value.notificationId}`)

    // 7. Store events
    const updatedOrder = store.findById(orderId)
    if (updatedOrder) {
      eventStore.append(orderId, updatedOrder.events as DomainEvent[])
      log.push(`  7. Events stored: ${eventStore.getStream(orderId).length}`)
    }

    log.push('')
    log.push('=== Full Wiring: Event Stream ===')
    const events = eventStore.getStream(orderId)
    for (const e of events) {
      log.push(`  [${e.type}] orderId=${e.orderId}`)
    }

    log.push('')
    log.push('=== Full Wiring: Infrastructure State ===')
    log.push(`  Notifications sent: ${notifications.sent.length}`)
    log.push(`  Payments charged: ${payments.charges.length}`)
    log.push(`  Event streams: ${eventStore.getAllEvents().length} events total`)

    log.push('')
    log.push('=== Type Safety Across Layers ===')
    log.push('  Domain: Value Objects (Email, Money) enforce invariants')
    log.push('  Domain: Events are discriminated unions')
    log.push('  Application: Command/Query handlers typed with Extract')
    log.push('  Infrastructure: Repository<T, ID> generic interface')
    log.push('  API: Request validation → typed DTOs → Response mapping')
    log.push('  DI: TypedContainer with TokenMap for compile-time safety')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.5: Full Wiring</h2>
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
