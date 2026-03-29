# Level 10: Module Boundaries

## 🎯 Level Goal

Learn to design boundaries between modules: define public APIs with type visibility control, create cross-module contracts through shared interfaces, and apply the Dependency Inversion Principle with type-safe ports and adapters.

---

## The Problem: Blurred Module Boundaries

In a typical project, modules directly depend on each other's internal details:

```typescript
// ❌ Orders module knows about Users module internals
import { UserRecord, _hashPassword, internalUserStore } from '../users/internal'

function createOrder(userId: string) {
  const user = internalUserStore.get(userId) // Direct store access
  if (!user) throw new Error('User not found')
  // Uses internal UserRecord with passwordHash, _rev, etc.
  sendEmail(user.email, user._internalField) // Details leak
}
```

Problems:
- Orders module depends on Users' internal implementation
- Changing Users breaks Orders (tight coupling)
- Internal types (`passwordHash`, `_rev`) leak outside
- Impossible to substitute implementation for tests

---

## Pattern 1: Public API Surface

Each module exports only public types and functions:

### Separating Internal and Public Types

```typescript
// === Internal (NOT exported) ===
interface InternalUserRecord {
  _id: string
  _rev: number
  firstName: string
  lastName: string
  email: string
  passwordHash: string  // Secret data
  deletedAt: Date | null
}

// === Public (exported) ===
interface PublicUser {
  id: string
  name: string
  email: string
  createdAt: Date
}

interface CreateUserInput {
  firstName: string
  lastName: string
  email: string
  password: string
}
```

### Barrel Export (index.ts)

```typescript
// Module exports ONLY public types and functions
// index.ts
export type { PublicUser, CreateUserInput, UpdateUserInput, UserQueryOptions }
export { createUserModule } from './module'
export type { UserModule } from './module'

// ❌ NOT exported:
// InternalUserRecord, passwordHash, _rev, toPublicUser, internalStore
```

### Internal -> Public Mapping

```typescript
function toPublicUser(record: InternalUserRecord): PublicUser {
  return {
    id: record._id,
    name: `${record.firstName} ${record.lastName}`,
    email: record.email,
    createdAt: record.createdAt,
  }
}
```

📌 **Important**: the internal -> public mapping is the module **boundary**. External code never sees `passwordHash`, `_rev`, or other internal details. If the internal structure changes, the public API remains stable.

---

## Pattern 2: Cross-Module Contracts

Modules interact through shared interfaces, not direct access:

### Shared Contracts

```typescript
// === Shared contracts (separate package/folder) ===
interface Entity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Generic CRUD contract
interface Repository<T extends Entity> {
  findById(id: string): T | null
  findAll(filter?: Partial<T>): T[]
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T
  update(id: string, data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>): T
  delete(id: string): boolean
}

// Typed event bus
interface EventBus<TEvents extends Record<string, unknown>> {
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void
  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void): () => void
}
```

### Modules Depend on Contracts, Not Implementations

```typescript
// Module Products — defines its events
interface ProductEvents {
  'product:created': { product: Product }
  'product:out-of-stock': { productId: string }
}

function createProductModule(
  repo: Repository<Product>,      // Depends on contract
  events: EventBus<ProductEvents>  // Depends on contract
) { ... }

// Module Orders — depends on MINIMAL Products interface
function createOrderModule(
  repo: Repository<Order>,
  productModule: { getProduct: (id: string) => Product | null },  // Only needed methods!
  events: EventBus<ProductEvents>
) { ... }
```

🔥 **Key point**: the Orders module doesn't depend on the entire ProductModule — only on `{ getProduct }`. This is the **Interface Segregation Principle**: depend on the minimal interface.

---

## Pattern 3: Dependency Inversion (Ports and Adapters)

Business logic depends on abstractions (ports), not concrete implementations:

### Ports (Abstractions)

```typescript
// Port: what business logic NEEDS
interface Logger {
  info(message: string, context?: Record<string, unknown>): void
  error(message: string, error?: Error): void
}

interface Cache<T> {
  get(key: string): T | null
  set(key: string, value: T, ttlMs?: number): void
  delete(key: string): boolean
}

interface NotificationService {
  sendEmail(to: string, subject: string, body: string): boolean
}
```

### Business Logic Depends on Ports

```typescript
interface UserServiceDeps {
  logger: Logger
  cache: Cache<User>
  notifications: NotificationService
  store: UserStore
}

function createUserService(deps: UserServiceDeps) {
  const { logger, cache, notifications, store } = deps

  return {
    getUser(id: string) {
      const cached = cache.get(`user:${id}`)
      if (cached) {
        logger.info('Cache hit', { userId: id })
        return cached
      }
      const user = store.findById(id)
      if (user) cache.set(`user:${id}`, user, 60000)
      return user
    },
    updateUser(id: string, name: string) {
      // ... business logic ...
      notifications.sendEmail(user.email, 'Updated', `Name changed to ${name}`)
    },
  }
}
```

### Adapters (Implementations)

```typescript
// Production adapter
const prodLogger: Logger = {
  info: (msg, ctx) => console.log(msg, ctx),
  error: (msg, err) => Sentry.captureException(err),
}

// Test adapter
const testLogger: Logger = {
  info: () => {},
  error: () => {},
}

// Redis adapter
const redisCache: Cache<User> = {
  get: (key) => redis.get(key),
  set: (key, value, ttl) => redis.setex(key, ttl, value),
  delete: (key) => redis.del(key),
}
```

💡 **Key idea**: business logic doesn't know about Redis, Sentry, or a specific database. It only knows about abstractions (ports). Specific implementations (adapters) are injected externally.

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Leaking Internal Types

```typescript
// ❌ Internal type in public API
export function getUser(id: string): InternalUserRecord {
  return store.get(id) // passwordHash leaked!
}

// ✅ Map to public type
export function getUser(id: string): PublicUser | null {
  const record = store.get(id)
  return record ? toPublicUser(record) : null
}
```

### Mistake 2: Depending on the Entire Module

```typescript
// ❌ Dependency on entire module
function createOrderModule(productModule: ProductModule) {
  // Has access to all 20 methods, though only one is needed
}

// ✅ Dependency on minimal interface
function createOrderModule(
  productModule: { getProduct: (id: string) => Product | null }
) {
  // Only what's actually needed
}
```

### Mistake 3: Direct Import of Implementation

```typescript
// ❌ Direct dependency on implementation
import { RedisCache } from '@infra/redis'
import { PostgresRepo } from '@infra/postgres'

class UserService {
  private cache = new RedisCache()     // Tied to Redis
  private repo = new PostgresRepo()    // Tied to Postgres
}

// ✅ Depend on abstractions via DI
function createUserService(deps: {
  cache: Cache<User>      // Any Cache implementation
  repo: Repository<User>  // Any Repository implementation
}) { ... }
```

### Mistake 4: "God Interface" Instead of Focused Ports

```typescript
// ❌ One huge interface for all dependencies
interface Infrastructure {
  db: Database
  cache: Cache
  queue: MessageQueue
  logger: Logger
  mailer: Mailer
  storage: FileStorage
  // ... 10 more services
}

// ✅ Each service depends only on what it needs
interface OrderServiceDeps {
  repo: Repository<Order>
  logger: Logger
}

interface NotificationServiceDeps {
  mailer: Mailer
  logger: Logger
}
```

---

## 💡 Best Practices

1. **Barrel exports** (index.ts) — single entry point to the module
2. **Internal/Public separation** — mapping at the module boundary
3. **Interface Segregation** — depend on the minimal interface
4. **Dependency Inversion** — business logic depends on abstractions
5. **Consumer defines ports** — UserService defines the Logger interface, not the other way around
6. **Adapters are swappable** — for tests, staging, production

---

## 📌 Summary

| Pattern | When to Use | Key Features |
|---------|------------|--------------|
| Public API Surface | Type visibility control | barrel exports, internal/public mapping |
| Cross-Module Contracts | Module interaction | shared interfaces, event bus |
| Dependency Inversion | Abstracting dependencies | ports (interfaces), adapters (implementations) |
