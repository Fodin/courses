# 🔥 Уровень 13: Capstone — Интеграция всех паттернов

## 🎯 Итоговый проект: Order Management System

Этот уровень объединяет все паттерны и подходы курса в единое приложение. Мы построим систему управления заказами с чётким разделением на слои, где каждый слой использует TypeScript для обеспечения типобезопасности на всех уровнях.

### Архитектура приложения

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

Каждый слой зависит только от абстракций нижних слоёв. DI-контейнер связывает всё вместе.

## 📌 Domain Layer: сердце системы

### Value Objects

Value Object -- неизменяемый объект без идентичности, определяемый своими свойствами. Два Value Object с одинаковыми значениями равны.

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

Ключевые принципы:
- **Приватный конструктор** -- создание только через фабричный метод `create`
- **Валидация при создании** -- невалидный Value Object невозможно создать
- **Result type** -- вместо исключений возвращаем ошибку
- **Нормализация** -- email приводится к lowercase при создании

### Money: составной Value Object

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

Discriminated union для типобезопасных событий:

```typescript
type DomainEvent =
  | { type: 'OrderCreated'; orderId: string; customerId: string; timestamp: number }
  | { type: 'ItemAdded'; orderId: string; productId: string; quantity: number; timestamp: number }
  | { type: 'OrderConfirmed'; orderId: string; timestamp: number }
  | { type: 'OrderCancelled'; orderId: string; reason: string; timestamp: number }
```

### Entities: функциональный подход

Вместо мутабельных классов используем иммутабельные объекты и чистые функции:

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

Спецификации -- переиспользуемые бизнес-правила:

```typescript
type Specification<T> = {
  isSatisfiedBy(entity: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}

const isDraft = createSpec<Order>('isDraft', (o) => o.status === 'draft')
const hasItems = createSpec<Order>('hasItems', (o) => o.items.length > 0)
const confirmable = isDraft.and(hasItems) // Комбинация
```

## 📌 Application Layer: use cases

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

Обратите внимание: `C extends Command` и `Extract<Command, { type: 'CreateOrder' }>` обеспечивают типобезопасность.

## 📌 Infrastructure Layer: реализации

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

### Адаптеры внешних сервисов

```typescript
interface NotificationService {
  notify(userId: string, message: string): Result<{ notificationId: string }>
}

interface PaymentGateway {
  charge(amount: Money, customerId: string): Result<{ transactionId: string }>
  refund(transactionId: string): Result<void>
}
```

Для тестирования используем in-memory реализации. В продакшене -- реальные HTTP-клиенты.

## 📌 API Layer: граница системы

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

Domain объекты не должны утекать наружу. Маппинг в DTO:

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

### Порядок регистрации

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

## ⚠️ Частые ошибки новичков

### Ошибка 1: Доменные объекты в API-ответах

```typescript
// ❌ Money утекает в JSON
res.json({ total: order.total }) // { total: { amount: 29.99, currency: "USD" } }

// ✅ Маппинг в DTO
res.json({ total: order.total.toString() }) // { total: "29.99 USD" }
```

### Ошибка 2: Бизнес-логика в контроллерах

```typescript
// ❌ Логика подтверждения в API
api.confirmOrder = (orderId) => {
  const order = store.get(orderId)
  if (order.items.length === 0) throw new Error(...)
  order.status = 'confirmed' // Мутация!
}

// ✅ Логика в domain, API делегирует
api.confirmOrder = (orderId) => {
  const result = confirmHandler.execute({ type: 'ConfirmOrder', orderId })
  // confirmOrder (domain) проверяет items и status
}
```

### Ошибка 3: Прямые зависимости между слоями

```typescript
// ❌ Application зависит от конкретной реализации
import { PostgresOrderRepo } from '../infrastructure/postgres'

// ✅ Application зависит от интерфейса
interface OrderRepository extends Repository<Order> {}
// Конкретная реализация подставляется через DI
```

### Ошибка 4: Мутабельные сущности

```typescript
// ❌ Мутация нарушает целостность событий
order.status = 'confirmed'
order.items.push(newItem)

// ✅ Иммутабельное обновление с новыми событиями
const updated = confirmOrder(order)
// updated — новый объект, order не изменился
```

## 💡 Best Practices

### 1. Result type везде

Никаких throw в бизнес-логике. Result type делает ошибки частью контракта функции.

### 2. Value Objects для примитивов

Email, Money, OrderId -- не string и number. Value Objects инкапсулируют валидацию и поведение.

### 3. Иммутабельность всех domain объектов

Используйте `readonly` и spread-оператор. Никаких мутаций.

### 4. CQS: разделяйте команды и запросы

Команды изменяют состояние, запросы читают. Не смешивайте.

### 5. Dependency Inversion

Верхние слои зависят от абстракций, не от реализаций. DI-контейнер связывает всё вместе.

### 6. Тестируемость через абстракции

In-memory реализации для тестов, реальные -- для продакшена. Один и тот же код, разные реализации.
