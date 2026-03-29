# 🔥 Level 13: Capstone — Integrating All Patterns

## 🎯 Final Project: Order Management System

This level brings together all patterns and approaches from the course into a unified application. We'll build an order management system with clear layer separation, where each layer uses TypeScript to ensure type safety at every level.

### Application Architecture

```
┌──────────────────────────────────────────┐
│              API Layer                    │
│   Validation → Controllers → Responses   │
├──────────────────────────────────────────┤
│          Application Layer               │
│   Command Handlers  │  Query Handlers    │
├──────────────────────────────────────────┤
│            Domain Layer                  │
│  Value Objects │ Entities │ Events │ Specs│
├──────────────────────────────────────────┤
│         Infrastructure Layer             │
│  Repositories │ Event Store │ Adapters   │
└──────────────────────────────────────────┘
```

Each layer depends only on abstractions from lower layers. A DI container wires everything together.

## 📌 Domain Layer: The Heart of the System

### Value Objects

A Value Object is an immutable object without identity, defined by its properties. Two Value Objects with the same values are equal.

```typescript
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
}
```

Key principles:
- **Private constructor** -- creation only through factory method `create`
- **Validation at creation** -- invalid Value Objects cannot exist
- **Result type** -- errors returned instead of exceptions
- **Normalization** -- email is lowercased at creation

### Money: Composite Value Object

```typescript
class Money implements ValueObject<{ amount: number; currency: string }> {
  private constructor(
    readonly amount: number,
    readonly currency: string
  ) {}

  static create(amount: number, currency: string): Result<Money> {
    if (amount < 0) return err('Amount cannot be negative')
    if (currency.length !== 3) return err('Currency must be 3-letter code')
    return ok(new Money(Math.round(amount * 100) / 100, currency.toUpperCase()))
  }

  add(other: Money): Result<Money> {
    if (this.currency !== other.currency) {
      return err(`Cannot add ${this.currency} and ${other.currency}`)
    }
    return Money.create(this.amount + other.amount, this.currency)
  }
}
```

### Domain Events

Discriminated union for type-safe events:

```typescript
type DomainEvent =
  | { type: 'OrderCreated'; orderId: string; customerId: string; timestamp: number }
  | { type: 'ItemAdded'; orderId: string; productId: string; quantity: number; timestamp: number }
  | { type: 'OrderConfirmed'; orderId: string; timestamp: number }
  | { type: 'OrderCancelled'; orderId: string; reason: string; timestamp: number }
```

### Entities: Functional Approach

Instead of mutable classes, we use immutable objects and pure functions:

```typescript
interface Order {
  readonly id: string
  readonly customerId: string
  readonly status: OrderStatus
  readonly items: readonly OrderItem[]
  readonly total: Money
  readonly events: readonly DomainEvent[]
}

function addItem(order: Order, item: OrderItem): Result<Order> {
  if (order.status !== 'draft') return err(`Cannot modify ${order.status} order`)
  // ... validation and immutable update
  return ok({ ...order, items: [...order.items, item], events: [...order.events, newEvent] })
}
```

### Specification Pattern

Specifications are reusable business rules:

```typescript
type Specification<T> = {
  isSatisfiedBy(entity: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

const isDraft = createSpec<Order>('isDraft', (o) => o.status === 'draft')
const hasItems = createSpec<Order>('hasItems', (o) => o.items.length > 0)
const confirmable = isDraft.and(hasItems) // Combination
```

## 📌 Application Layer: Use Cases

### Command / Query Separation (CQS)

```typescript
type Command =
  | { type: 'CreateOrder'; customerId: string; currency: string }
  | { type: 'AddItem'; orderId: string; productId: string; ... }
  | { type: 'ConfirmOrder'; orderId: string }

type Query =
  | { type: 'GetOrder'; orderId: string }
  | { type: 'ListOrders'; customerId: string; status?: OrderStatus }

type CommandHandler<C extends Command, R = void> = {
  readonly commandType: C['type']
  execute(command: C): Result<R>
}

type QueryHandler<Q extends Query, R = unknown> = {
  readonly queryType: Q['type']
  execute(query: Q): Result<R>
}
```

Note how `C extends Command` and `Extract<Command, { type: 'CreateOrder' }>` ensure type safety.

## 📌 Infrastructure Layer: Implementations

### Repository Pattern

```typescript
interface Repository<T, ID = string> {
  findById(id: ID): Result<T | null>
  findAll(): Result<T[]>
  save(entity: T): Result<void>
  delete(id: ID): Result<boolean>
}
```

### Event Store

```typescript
interface EventStore<E> {
  append(streamId: string, events: E[]): void
  getStream(streamId: string): E[]
  getAllEvents(): E[]
}
```

### External Service Adapters

```typescript
interface NotificationService {
  notify(userId: string, message: string): Result<{ notificationId: string }>
}

interface PaymentGateway {
  charge(amount: Money, customerId: string): Result<{ transactionId: string }>
  refund(transactionId: string): Result<void>
}
```

For testing we use in-memory implementations. In production -- real HTTP clients.

## 📌 API Layer: System Boundary

### Request Validation

```typescript
type ValidationRule<T> = {
  readonly field: string
  validate(value: T): Result<T>
}

type RequestValidator<T> = {
  validate(data: unknown): Result<T, string[]>
}
```

### Response Mapping

Domain objects must not leak to the outside. Mapping to DTOs:

```typescript
function toOrderResponse(order: Order): OrderResponse {
  return {
    id: order.id,
    status: order.status,
    total: order.total.toString(), // Money → string
    items: order.items.map(toItemResponse),
    createdAt: new Date(order.createdAt).toISOString(), // timestamp → ISO string
  }
}
```

### Typed API Responses

```typescript
type ApiResponse<T> =
  | { status: 200; body: T }
  | { status: 201; body: T }
  | { status: 400; body: { errors: string[] } }
  | { status: 404; body: { message: string } }
```

## 📌 Full Wiring: DI Container

### Typed Container

```typescript
type TokenMap = {
  orderStore: OrderStore
  orderRepository: InMemoryOrderRepository
  eventStore: InMemoryEventStore<DomainEvent>
  notificationService: InMemoryNotificationService
  createOrderHandler: CommandHandler<...>
  apiController: ApiController
}

interface TypedContainer {
  resolve<K extends keyof TokenMap>(token: K): TokenMap[K]
}
```

### Registration Order

```typescript
function wireApplication(): TypedContainer {
  const container = createContainer()
  // 1. Infrastructure (no dependencies)
  container.register('orderStore', () => new OrderStore())
  // 2. Application (depends on infrastructure)
  container.register('createOrderHandler', () =>
    createCreateOrderHandler(container.resolve('orderStore'))
  )
  // 3. API (depends on application)
  container.register('apiController', () =>
    createApiController(container.resolve('orderStore'))
  )
  return typedWrapper(container)
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Domain Objects in API Responses

```typescript
// ❌ Money leaks into JSON
res.json({ total: order.total }) // { total: { amount: 29.99, currency: "USD" } }

// ✅ Mapping to DTO
res.json({ total: order.total.toString() }) // { total: "29.99 USD" }
```

### Mistake 2: Business Logic in Controllers

```typescript
// ❌ Confirmation logic in API
api.confirmOrder = (orderId) => {
  const order = store.get(orderId)
  if (order.items.length === 0) throw new Error(...)
  order.status = 'confirmed' // Mutation!
}

// ✅ Logic in domain, API delegates
api.confirmOrder = (orderId) => {
  const result = confirmHandler.execute({ type: 'ConfirmOrder', orderId })
  // confirmOrder (domain) checks items and status
}
```

### Mistake 3: Direct Dependencies Between Layers

```typescript
// ❌ Application depends on concrete implementation
import { PostgresOrderRepo } from '../infrastructure/postgres'

// ✅ Application depends on interface
interface OrderRepository extends Repository<Order> {}
// Concrete implementation injected via DI
```

### Mistake 4: Mutable Entities

```typescript
// ❌ Mutation breaks event integrity
order.status = 'confirmed'
order.items.push(newItem)

// ✅ Immutable update with new events
const updated = confirmOrder(order)
// updated is a new object, order is unchanged
```

## 💡 Best Practices

### 1. Result Type Everywhere

No throwing in business logic. Result type makes errors part of the function contract.

### 2. Value Objects for Primitives

Email, Money, OrderId -- not string and number. Value Objects encapsulate validation and behavior.

### 3. Immutability for All Domain Objects

Use `readonly` and spread operator. No mutations.

### 4. CQS: Separate Commands and Queries

Commands change state, queries read it. Don't mix them.

### 5. Dependency Inversion

Upper layers depend on abstractions, not implementations. DI container wires everything together.

### 6. Testability Through Abstractions

In-memory implementations for tests, real ones for production. Same code, different implementations.
