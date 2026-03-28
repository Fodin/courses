# 💾 Level 5: Data Management

## 📖 Introduction

Data management patterns solve one of the most difficult challenges in applications: **how to organize data access, transactionality, and consistency**. These patterns originate from the world of enterprise architecture (Domain-Driven Design, CQRS, Event Sourcing) and map beautifully onto TypeScript thanks to its strict type system.

In this level we implement four key patterns:
- 📦 **Repository** — an abstraction over data store access
- 🔄 **Unit of Work** — grouping operations into transactions with commit/rollback
- ⚡ **CQRS** — separating reads and writes via CommandBus and QueryBus
- 📜 **Event Sourcing** — storing a history of events instead of current state

## 📦 Repository

### Problem

Business logic talks directly to the data store, creating tight coupling:

```typescript
// ❌ Bad: business logic knows about storage details
class UserService {
  getUser(id: string) {
    const data = localStorage.getItem(`user:${id}`)
    return data ? JSON.parse(data) : null
  }

  saveUser(user: User) {
    localStorage.setItem(`user:${user.id}`, JSON.stringify(user))
  }
}
```

If tomorrow you need to switch from localStorage to an API — you'll have to rewrite the entire service.

### Solution

Extract a data access interface (Repository), and inject the concrete implementation from outside:

```typescript
interface Repository<T extends { id: string }> {
  findById(id: string): T | undefined
  findAll(): T[]
  create(entity: T): T
  update(id: string, updates: Partial<T>): T | undefined
  delete(id: string): boolean
}

class InMemoryRepository<T extends { id: string }> implements Repository<T> {
  private store = new Map<string, T>()

  findById(id: string): T | undefined {
    return this.store.get(id)
  }

  findAll(): T[] {
    return Array.from(this.store.values())
  }

  create(entity: T): T {
    this.store.set(entity.id, { ...entity })
    return entity
  }

  update(id: string, updates: Partial<T>): T | undefined {
    const existing = this.store.get(id)
    if (!existing) return undefined
    const updated = { ...existing, ...updates }
    this.store.set(id, updated)
    return updated
  }

  delete(id: string): boolean {
    return this.store.delete(id)
  }
}
```

> 🔥 **Key point:** Business logic depends on the `Repository<T>` interface, not on any specific store. Tomorrow you can swap `InMemoryRepository` for `ApiRepository` without touching the service layer.

## 🔄 Unit of Work

### Problem

When executing several related operations you need to guarantee atomicity — either all operations are applied, or none:

```typescript
// ❌ Bad: if updateBalance fails — money was debited but never credited
userRepo.update(sender.id, { balance: sender.balance - amount })
userRepo.update(receiver.id, { balance: receiver.balance + amount })
transactionRepo.create({ from: sender.id, to: receiver.id, amount })
```

### Solution

Unit of Work accumulates changes and applies them atomically:

```typescript
interface UnitOfWork {
  registerNew<T extends { id: string }>(entity: T, repoName: string): void
  registerDirty<T extends { id: string }>(entity: T, repoName: string): void
  registerDeleted(id: string, repoName: string): void
  commit(): void
  rollback(): void
}
```

> 📌 **Important:** Until `commit()` is called, no change reaches the store. On failure, `rollback()` cancels all accumulated operations.

## ⚡ CQRS (Command Query Responsibility Segregation)

### Problem

In complex applications, reads and writes have fundamentally different requirements:
- ✏️ Writes: validation, business rules, transactions, events
- 📖 Reads: performance, aggregations, caching

When everything lives in one service, the code becomes a mess:

```typescript
// ❌ Bad: one service reads, writes, and validates
class OrderService {
  createOrder(data: OrderData) { /* validation + write + event */ }
  getOrderDetails(id: string) { /* table join + formatting */ }
  getOrderStats() { /* aggregation + cache */ }
}
```

### Solution

Separate operations into commands (writes) and queries (reads):

```typescript
// Command — intent to change data
interface Command {
  type: string
}

// Query — intent to read data
interface Query {
  type: string
}

// Command handler
interface CommandHandler<C extends Command> {
  execute(command: C): void
}

// Query handler
interface QueryHandler<Q extends Query, R> {
  execute(query: Q): R
}
```

> 🔥 **Key point:** CommandBus routes commands to handlers, QueryBus routes queries. This allows reads and writes to be scaled, cached, and optimized independently.

## 📜 Event Sourcing

### Problem

The classic approach stores only the current state. When you need to understand **how we arrived at this state** — the information is gone:

```typescript
// We see a balance of 500, but don't know why
const account = { id: '1', balance: 500 }
// Was it: 1000 - 300 - 200? Or 0 + 500? Or 600 - 100?
```

### Solution

Instead of storing state, store a **sequence of events**:

```typescript
interface DomainEvent {
  type: string
  timestamp: number
  aggregateId: string
}

interface AccountOpened extends DomainEvent {
  type: 'AccountOpened'
  ownerName: string
}

interface MoneyDeposited extends DomainEvent {
  type: 'MoneyDeposited'
  amount: number
}

interface MoneyWithdrawn extends DomainEvent {
  type: 'MoneyWithdrawn'
  amount: number
}
```

Current state is computed by applying events sequentially (replay):

```typescript
function replay(events: AccountEvent[]): AccountState {
  return events.reduce((state, event) => {
    switch (event.type) {
      case 'AccountOpened':
        return { ...state, ownerName: event.ownerName, balance: 0 }
      case 'MoneyDeposited':
        return { ...state, balance: state.balance + event.amount }
      case 'MoneyWithdrawn':
        return { ...state, balance: state.balance - event.amount }
    }
  }, initialState)
}
```

> 📌 **Important:** Event Sourcing provides a full audit history, the ability to "rewind" state to any point in time, and the ability to debug any bug.

## ⚠️ Common Beginner Mistakes

### 🐛 1. A Repository that does too much

❌ **Bad** — business logic inside the repository:
```typescript
class UserRepository {
  createUser(name: string, email: string) {
    // Email validation — NOT the repository's responsibility
    if (!email.includes('@')) throw new Error('Invalid email')
    // Password hashing — NOT the repository's responsibility
    const hashedPassword = hash(password)
    this.store.set(id, { name, email, hashedPassword })
  }
}
```

✅ **Good** — the repository only stores and retrieves data:
```typescript
class UserRepository {
  create(user: User): User {
    this.store.set(user.id, { ...user })
    return user
  }
}
// Validation and business logic belong in the service layer
```

### 🐛 2. Unit of Work without rollback

❌ **Bad** — commit without error handling:
```typescript
commit() {
  this.newEntities.forEach(e => repo.create(e))
  this.dirtyEntities.forEach(e => repo.update(e.id, e))
  // If update fails on the 3rd of 5 entities — data is in an inconsistent state
}
```

✅ **Good** — save a snapshot for rollback:
```typescript
commit() {
  const snapshot = this.createSnapshot()
  try {
    this.applyChanges()
  } catch (error) {
    this.restoreSnapshot(snapshot)
    throw error
  }
}
```

### 🐛 3. CQRS: commands returning data

❌ **Bad** — command returns the created entity:
```typescript
class CreateOrderHandler {
  execute(cmd: CreateOrder): Order {  // Commands should not return data
    return this.repo.create(order)
  }
}
```

✅ **Good** — command only performs the action; data is retrieved via a query:
```typescript
class CreateOrderHandler {
  execute(cmd: CreateOrder): void {
    this.repo.create(order)
    this.eventBus.emit('OrderCreated', { orderId: order.id })
  }
}
// Client reads via QueryBus
```

### 🐛 4. Event Sourcing: mutating events

❌ **Bad** — modifying an already-recorded event:
```typescript
// Events are IMMUTABLE! You cannot change history
eventStore.events[0].amount = 999
```

✅ **Good** — create a compensating event to make a correction:
```typescript
eventStore.append({
  type: 'MoneyAdjusted',
  amount: -100,
  reason: 'Correction for double charge'
})
```

## 💡 Best Practices

- 📦 **Repository**: one repository per entity. Do not create a "god repository" for everything
- 🔄 **Unit of Work**: use for operations that touch multiple entities at the same time
- ⚡ **CQRS**: don't apply it everywhere — for simple CRUD operations it is over-engineering
- 📜 **Event Sourcing**: events are facts that happened in the past. Name them in past tense: `OrderCreated`, `MoneyDeposited`
- 🛡️ **Typing**: use discriminated unions for event and command types — TypeScript will automatically narrow types in switch/case
