# 🔥 Level 5: Domain Modeling

## 🎯 Why TypeScript for Domain Modeling

Domain modeling is the process of expressing business rules and constraints in code. TypeScript allows encoding these rules directly in the type system, so **invalid states become impossible at compile time**.

Imagine: an accounting system where balance can go negative, an email campaign to unverified addresses, an order with zero items. All of these are business invariant violations caught only at runtime. With proper domain modeling, TypeScript **won't allow** writing such code.

## 📌 Value Objects: Immutable Value Types

A Value Object is an object defined by its **value**, not its identity. Two objects with the same value are considered equal.

### Branded Types: Type-Safe Primitives

The main problem with primitives is that they're all the same type:

```typescript
// ❌ userId and email are both string, easy to mix up
function sendNotification(userId: string, email: string): void { ... }
sendNotification(email, userId) // Compiles! But arguments are swapped
```

Branded types solve this by adding an "invisible tag" to the type:

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>

function sendNotification(userId: UserId, email: Email): void { ... }
sendNotification(email, userId) // ❌ Compilation error!
```

### Constructors with Validation

A branded type is useless without controlled creation. You need a factory function that validates input:

```typescript
type Email = Brand<string, 'Email'>

function createEmail(raw: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(raw)) {
    throw new Error(`Invalid email: ${raw}`)
  }
  return raw.toLowerCase() as Email  // as — only in the constructor
}
```

📌 **Important:** `as Email` is used **only** in the factory function. Everywhere else, TypeScript guarantees that `Email` was created through `createEmail`.

### Composite Value Objects

```typescript
type Money = Brand<number, 'Money'>
type Currency = 'USD' | 'EUR' | 'RUB'

interface Price {
  readonly amount: Money
  readonly currency: Currency
}

function addPrices(a: Price, b: Price): Price {
  if (a.currency !== b.currency) {
    throw new Error(`Cannot add ${a.currency} and ${b.currency}`)
  }
  return createPrice(
    (a.amount as number) + (b.amount as number),
    a.currency
  )
}
```

## 🔥 Entities & Aggregates: Identity and Boundaries

### Entity vs Value Object

| | Value Object | Entity |
|---|---|---|
| Identity | By value | By ID |
| Mutability | Immutable | Can change |
| Comparison | `price1.amount === price2.amount` | `user1.id === user2.id` |
| Example | Email, Money, Address | User, Order, Product |

```typescript
type EntityId<T extends string> = Brand<string, T>
type OrderId = EntityId<'OrderId'>

interface Entity<Id> {
  readonly id: Id
  readonly createdAt: Date
  readonly updatedAt: Date
}
```

### Aggregate Root

An Aggregate is a cluster of related entities accessible only through the root entity (Aggregate Root). This protects invariants:

```typescript
interface Order extends Entity<OrderId> {
  readonly status: OrderStatus
  readonly items: readonly OrderItem[]
  readonly customerEmail: Email
}

// All operations through functions that enforce invariants
function addItemToOrder(order: Order, item: OrderItem): Order {
  if (order.status !== 'draft') {
    throw new Error(`Cannot modify order in status: ${order.status}`)
  }
  return { ...order, items: [...order.items, item], updatedAt: new Date() }
}
```

📌 **Key principle:** changes to an aggregate are only possible through specific operations that check invariants. Direct access to internal entities is forbidden.

## 📌 Domain Events: Type-Safe Domain Events

A Domain Event is a record of something that happened in the domain. It's a fact that already occurred:

```typescript
interface DomainEvent<T extends string, P = undefined> {
  readonly type: T
  readonly payload: P
  readonly timestamp: number
  readonly eventId: string
}

type OrderCreated = DomainEvent<'OrderCreated', {
  orderId: string
  customerEmail: string
}>
```

### Type-Safe Event Bus

```typescript
class EventBus<E extends DomainEvent<string, unknown>> {
  on<K extends E['type']>(
    type: K,
    handler: (event: Extract<E, { type: K }>) => void
  ): () => void { ... }

  emit(event: E): void { ... }
}
```

The key type is `Extract<E, { type: K }>`. It guarantees the handler receives an event with the correct payload:

```typescript
const bus = new EventBus<OrderEvent>()

bus.on('OrderCreated', (event) => {
  // event.payload — typed as { orderId: string; customerEmail: string }
  console.log(event.payload.orderId)
})
```

## 🔥 Specifications: The Specification Pattern

A Specification is an object encapsulating a business rule that can be combined with other rules through logical operators:

```typescript
interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}
```

### Why This Is Better Than Plain Functions

```typescript
// ❌ Conditions scattered across code, duplicated
const results = products.filter(
  p => p.inStock && p.price <= 50 && p.rating >= 4.0
)

// ✅ Named, reusable specifications
const goodDeal = isInStock
  .and(isAffordable(50))
  .and(hasMinRating(4.0))

const results = filterBySpec(products, goodDeal)
```

## 📌 Invariant Types: Encoding Invariants in Types

An invariant is a condition that must **always** be true. TypeScript allows encoding invariants directly in the type system:

### NonEmptyArray

```typescript
type NonEmptyArray<T> = readonly [T, ...T[]]

function headOf<T>(arr: NonEmptyArray<T>): T {
  return arr[0]  // Always safe — type guarantees element exists
}
```

### Workflow Guard Types

```typescript
type UnverifiedEmail = Brand<string, 'UnverifiedEmail'>
type VerifiedEmail = Brand<string, 'VerifiedEmail'>

function sendNewsletter(email: VerifiedEmail, subject: string): void { ... }

const unverified = registerEmail('user@test.com')
sendNewsletter(unverified, 'Hello') // ❌ Compilation error!

const verified = verifyEmail(unverified, 'CODE-123')
sendNewsletter(verified, 'Hello') // ✅ OK
```

### Bounded Numeric Types

```typescript
type Percentage = Brand<number, 'Percentage'>
type NonNegativeBalance = Brand<number, 'NonNegativeBalance'>

function withdraw(balance: NonNegativeBalance, amount: number): NonNegativeBalance {
  const newBalance = (balance as number) - amount
  if (newBalance < 0) throw new Error('Insufficient funds')
  return newBalance as NonNegativeBalance
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Direct Casting Instead of Factory

```typescript
// ❌ Bypassing factory through as
const email = 'not-valid' as Email  // Compiles, but invalid email

// ✅ Always through factory function
const email = createEmail('user@example.com')  // Validation guaranteed
```

### Mistake 2: Mutable Entities

```typescript
// ❌ Direct mutation breaks invariants
order.status = 'confirmed'
order.items.push(newItem)  // Limit check skipped

// ✅ All changes through controlled functions
const confirmedOrder = confirmOrder(order)  // Checks invariants
const updatedOrder = addItemToOrder(order, newItem)  // Checks limits
```

### Mistake 3: Anemic Domain Model

```typescript
// ❌ All logic outside model — model is just data
interface Order { status: string; items: Item[] }
function processOrder(order: Order) { /* all logic here */ }

// ✅ Logic near data, types encode rules
interface Order extends Entity<OrderId> {
  readonly status: OrderStatus  // Union type constrains values
  readonly items: NonEmptyArray<OrderItem>  // Cannot be empty
}
function confirmOrder(order: Order): Order { ... }
```

### Mistake 4: Untyped Event Payload

```typescript
// ❌ Untyped events
bus.emit({ type: 'OrderCreated', payload: { whatever: true } })

// ✅ Payload is strictly typed
type OrderCreated = DomainEvent<'OrderCreated', {
  orderId: string
  customerEmail: string
}>
```

## 💡 Best Practices

1. **"Make illegal states unrepresentable"** -- if a state is invalid, the type should prevent its creation
2. **Branded types for all domain primitives** -- Email, Money, UserId shouldn't be bare string/number
3. **Factory functions are the only way to create** Value Objects. Ban `as` outside factories
4. **Aggregate Root controls invariants** -- direct access to nested entities is forbidden
5. **Domain Events are facts, not commands** -- `OrderCreated`, not `CreateOrder`
6. **Specifications for complex business rules** -- instead of scattering conditions across code
7. **readonly everywhere** -- immutability prevents uncontrolled changes
