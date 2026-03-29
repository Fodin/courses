# Уровень 10: Границы модулей

## 🎯 Цель уровня

Научиться проектировать границы между модулями: определять публичный API с контролем видимости типов, создавать кросс-модульные контракты через shared-интерфейсы и применять принцип инверсии зависимостей (Dependency Inversion) с типобезопасными портами и адаптерами.

---

## Проблема: размытые границы модулей

В типичном проекте модули напрямую зависят от внутренних деталей друг друга:

```typescript
// ❌ Модуль Orders знает о внутренней структуре модуля Users
import { UserRecord, _hashPassword, internalUserStore } from '../users/internal'

function createOrder(userId: string) {
  const user = internalUserStore.get(userId) // Прямой доступ к хранилищу
  if (!user) throw new Error('User not found')
  // Используем internal UserRecord с passwordHash, _rev и т.д.
  sendEmail(user.email, user._internalField) // Утечка деталей
}
```

Проблемы:
- Модуль Orders зависит от внутренней реализации Users
- Изменение Users ломает Orders (tight coupling)
- Внутренние типы (`passwordHash`, `_rev`) утекают наружу
- Невозможно подменить реализацию для тестов

---

## Паттерн 1: Public API Surface

Каждый модуль экспортирует только публичные типы и функции:

### Разделение внутренних и публичных типов

```typescript
// === Internal (НЕ экспортируется) ===
interface InternalUserRecord {
  _id: string
  _rev: number
  firstName: string
  lastName: string
  email: string
  passwordHash: string  // Секретные данные
  deletedAt: Date | null
}

// === Public (экспортируется) ===
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

### Barrel export (index.ts)

```typescript
// Модуль экспортирует ТОЛЬКО публичные типы и функции
// index.ts
export type { PublicUser, CreateUserInput, UpdateUserInput, UserQueryOptions }
export { createUserModule } from './module'
export type { UserModule } from './module'

// ❌ НЕ экспортируем:
// InternalUserRecord, passwordHash, _rev, toPublicUser, internalStore
```

### Маппинг internal -> public

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

📌 **Важно**: маппинг internal -> public — это **граница** модуля. Внешний код никогда не видит `passwordHash`, `_rev` и другие внутренние детали. Если внутренняя структура изменится, публичный API останется стабильным.

---

## Паттерн 2: Cross-Module Contracts

Модули взаимодействуют через shared-интерфейсы, а не через прямой доступ:

### Общие контракты

```typescript
// === Shared contracts (отдельный пакет/папка) ===
interface Entity {
  id: string
  createdAt: Date
  updatedAt: Date
}

// Generic CRUD-контракт
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

### Модули зависят от контрактов, не от реализаций

```typescript
// Module Products — определяет свои события
interface ProductEvents {
  'product:created': { product: Product }
  'product:out-of-stock': { productId: string }
}

function createProductModule(
  repo: Repository<Product>,      // Зависит от контракта
  events: EventBus<ProductEvents>  // Зависит от контракта
) { ... }

// Module Orders — зависит от МИНИМАЛЬНОГО интерфейса Products
function createOrderModule(
  repo: Repository<Order>,
  productModule: { getProduct: (id: string) => Product | null },  // Только нужные методы!
  events: EventBus<ProductEvents>
) { ... }
```

🔥 **Ключевой момент**: модуль Orders не зависит от всего ProductModule — только от `{ getProduct }`. Это **Interface Segregation Principle**: зависимость от минимального интерфейса.

---

## Паттерн 3: Dependency Inversion (Порты и адаптеры)

Бизнес-логика зависит от абстракций (портов), а не от конкретных реализаций:

### Порты (абстракции)

```typescript
// Порт: что НУЖНО бизнес-логике
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

### Бизнес-логика зависит от портов

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
      // ... бизнес-логика ...
      notifications.sendEmail(user.email, 'Updated', `Name changed to ${name}`)
    },
  }
}
```

### Адаптеры (реализации)

```typescript
// Адаптер для production
const prodLogger: Logger = {
  info: (msg, ctx) => console.log(msg, ctx),
  error: (msg, err) => Sentry.captureException(err),
}

// Адаптер для тестов
const testLogger: Logger = {
  info: () => {},
  error: () => {},
}

// Адаптер для Redis
const redisCache: Cache<User> = {
  get: (key) => redis.get(key),
  set: (key, value, ttl) => redis.setex(key, ttl, value),
  delete: (key) => redis.del(key),
}

// Адаптер для тестов
const memoryCache: Cache<User> = {
  // ... in-memory implementation ...
}
```

💡 **Ключевая идея**: бизнес-логика не знает о Redis, Sentry или конкретной БД. Она знает только об абстракциях (портах). Конкретные реализации (адаптеры) подставляются извне.

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: Утечка внутренних типов

```typescript
// ❌ Внутренний тип в публичном API
export function getUser(id: string): InternalUserRecord {
  return store.get(id) // passwordHash утёк наружу!
}

// ✅ Маппинг на публичный тип
export function getUser(id: string): PublicUser | null {
  const record = store.get(id)
  return record ? toPublicUser(record) : null
}
```

### Ошибка 2: Зависимость от всего модуля

```typescript
// ❌ Зависимость от всего модуля
function createOrderModule(productModule: ProductModule) {
  // Имеет доступ ко всем 20 методам, хотя нужен только один
}

// ✅ Зависимость от минимального интерфейса
function createOrderModule(
  productModule: { getProduct: (id: string) => Product | null }
) {
  // Только то, что реально нужно
}
```

### Ошибка 3: Прямой import реализации

```typescript
// ❌ Прямая зависимость от реализации
import { RedisCache } from '@infra/redis'
import { PostgresRepo } from '@infra/postgres'

class UserService {
  private cache = new RedisCache()     // Привязан к Redis
  private repo = new PostgresRepo()    // Привязан к Postgres
}

// ✅ Зависимость от абстракций через DI
function createUserService(deps: {
  cache: Cache<User>      // Любая реализация Cache
  repo: Repository<User>  // Любая реализация Repository
}) { ... }
```

### Ошибка 4: «God interface» вместо focused ports

```typescript
// ❌ Один огромный интерфейс для всех зависимостей
interface Infrastructure {
  db: Database
  cache: Cache
  queue: MessageQueue
  logger: Logger
  mailer: Mailer
  storage: FileStorage
  // ... ещё 10 сервисов
}

// ✅ Каждый сервис зависит только от того, что ему нужно
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

1. **Barrel exports** (index.ts) — единственная точка входа в модуль
2. **Internal/Public разделение** — маппинг на границе модуля
3. **Interface Segregation** — зависимость от минимального интерфейса
4. **Dependency Inversion** — бизнес-логика зависит от абстракций
5. **Порты определяет потребитель** — UserService определяет интерфейс Logger, а не наоборот
6. **Адаптеры подменяемы** — для тестов, staging, production

---

## 📌 Итоги

| Паттерн | Когда использовать | Особенности |
|---------|-------------------|-------------|
| Public API Surface | Контроль видимости типов | barrel exports, internal/public маппинг |
| Cross-Module Contracts | Взаимодействие модулей | shared interfaces, event bus |
| Dependency Inversion | Абстрагирование зависимостей | порты (интерфейсы), адаптеры (реализации) |
