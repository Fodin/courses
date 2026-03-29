# 🔥 Уровень 5: Доменное моделирование (Domain Modeling)

## 🎯 Зачем TypeScript для доменного моделирования

Доменное моделирование -- это процесс выражения бизнес-правил и ограничений в коде. TypeScript позволяет кодировать эти правила прямо в системе типов, так что **невалидные состояния становятся невозможными на уровне компиляции**.

Представьте: бухгалтерская система, где баланс может стать отрицательным, email-рассылка на неподтверждённые адреса, заказ с нулём товаров. Всё это -- нарушения бизнес-инвариантов, которые ловятся только в runtime. С правильным доменным моделированием TypeScript **не позволит** написать такой код.

## 📌 Value Objects: иммутабельные объекты-значения

Value Object -- это объект, определяемый своим **значением**, а не идентификатором. Два объекта с одинаковым значением считаются равными.

### Branded Types: типобезопасные примитивы

Основная проблема примитивов -- они все одного типа:

```typescript
// ❌ userId и email — оба string, легко перепутать
function sendNotification(userId: string, email: string): void { ... }
sendNotification(email, userId) // Компилируется! Но аргументы перепутаны
```

Branded types решают эту проблему, добавляя "невидимую метку" к типу:

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId = Brand<string, 'UserId'>
type Email = Brand<string, 'Email'>

function sendNotification(userId: UserId, email: Email): void { ... }
sendNotification(email, userId) // ❌ Ошибка компиляции!
```

### Конструкторы с валидацией

Branded type бесполезен без контроля за созданием. Нужна фабричная функция, которая валидирует входные данные:

```typescript
type Email = Brand<string, 'Email'>

function createEmail(raw: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(raw)) {
    throw new Error(`Invalid email: ${raw}`)
  }
  return raw.toLowerCase() as Email  // as -- только в конструкторе
}
```

📌 **Важно:** `as Email` используется **только** в фабричной функции. Во всём остальном коде TypeScript гарантирует, что `Email` создан через `createEmail`.

### Составные Value Objects

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

## 🔥 Entities & Aggregates: идентичность и границы

### Entity vs Value Object

| | Value Object | Entity |
|---|---|---|
| Идентичность | По значению | По ID |
| Мутабельность | Иммутабельный | Может изменяться |
| Сравнение | `price1.amount === price2.amount` | `user1.id === user2.id` |
| Пример | Email, Money, Address | User, Order, Product |

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

Aggregate -- это кластер связанных сущностей, доступных только через корневую сущность (Aggregate Root). Это защищает инварианты:

```typescript
interface Order extends Entity<OrderId> {
  readonly status: OrderStatus
  readonly items: readonly OrderItem[]
  readonly customerEmail: Email
}

// Все операции — через функции, контролирующие инварианты
function addItemToOrder(order: Order, item: OrderItem): Order {
  if (order.status !== 'draft') {
    throw new Error(`Cannot modify order in status: ${order.status}`)
  }
  return { ...order, items: [...order.items, item], updatedAt: new Date() }
}
```

📌 **Ключевой принцип:** изменения в агрегате возможны только через определённые операции, которые проверяют инварианты. Прямой доступ к внутренним сущностям запрещён.

## 📌 Domain Events: типобезопасные доменные события

Domain Event -- это запись о том, что произошло в домене. Это факт, который уже случился:

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

### Типобезопасная шина событий

```typescript
class EventBus<E extends DomainEvent<string, unknown>> {
  on<K extends E['type']>(
    type: K,
    handler: (event: Extract<E, { type: K }>) => void
  ): () => void { ... }

  emit(event: E): void { ... }
}
```

Ключевой тип -- `Extract<E, { type: K }>`. Он гарантирует, что обработчик получит событие с правильным payload:

```typescript
const bus = new EventBus<OrderEvent>()

bus.on('OrderCreated', (event) => {
  // event.payload — типизирован как { orderId: string; customerEmail: string }
  console.log(event.payload.orderId)
})

bus.on('OrderConfirmed', (event) => {
  // event.payload — типизирован как { orderId: string; total: number }
  console.log(event.payload.total)
})
```

## 🔥 Specifications: паттерн спецификаций

Specification -- это объект, инкапсулирующий бизнес-правило, которое можно комбинировать с другими правилами через логические операторы:

```typescript
interface Specification<T> {
  isSatisfiedBy(candidate: T): boolean
  and(other: Specification<T>): Specification<T>
  or(other: Specification<T>): Specification<T>
  not(): Specification<T>
}
```

### Почему это лучше обычных функций

```typescript
// ❌ Условия размазаны по коду, дублируются
const results = products.filter(
  p => p.inStock && p.price <= 50 && p.rating >= 4.0
)

// ✅ Именованные, переиспользуемые спецификации
const goodDeal = isInStock
  .and(isAffordable(50))
  .and(hasMinRating(4.0))

const results = filterBySpec(products, goodDeal)
```

Преимущества:
- Бизнес-правила выделены и именованы
- Можно комбинировать через `and`, `or`, `not`
- Можно передавать как параметры и хранить
- Легко тестировать изолированно

## 📌 Invariant Types: кодирование инвариантов в типах

Инвариант -- это условие, которое **всегда** должно быть истинным. TypeScript позволяет кодировать инварианты прямо в системе типов:

### NonEmptyArray

```typescript
type NonEmptyArray<T> = readonly [T, ...T[]]

function headOf<T>(arr: NonEmptyArray<T>): T {
  return arr[0]  // Всегда безопасно — тип гарантирует наличие элемента
}
```

### Типы-стражи workflow

```typescript
type UnverifiedEmail = Brand<string, 'UnverifiedEmail'>
type VerifiedEmail = Brand<string, 'VerifiedEmail'>

// Только верифицированным можно отправлять рассылку
function sendNewsletter(email: VerifiedEmail, subject: string): void { ... }

const unverified = registerEmail('user@test.com')
sendNewsletter(unverified, 'Hello') // ❌ Ошибка компиляции!

const verified = verifyEmail(unverified, 'CODE-123')
sendNewsletter(verified, 'Hello') // ✅ OK
```

### Ограниченные числовые типы

```typescript
type Percentage = Brand<number, 'Percentage'>
type NonNegativeBalance = Brand<number, 'NonNegativeBalance'>

function withdraw(balance: NonNegativeBalance, amount: number): NonNegativeBalance {
  const newBalance = (balance as number) - amount
  if (newBalance < 0) throw new Error('Insufficient funds')
  return newBalance as NonNegativeBalance
}
```

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Прямое приведение вместо фабрики

```typescript
// ❌ Обход фабрики через as
const email = 'not-valid' as Email  // Компилируется, но невалидный email

// ✅ Всегда через фабричную функцию
const email = createEmail('user@example.com')  // Валидация гарантирована
```

### Ошибка 2: Мутабельные Entity

```typescript
// ❌ Прямая мутация нарушает инварианты
order.status = 'confirmed'
order.items.push(newItem)  // Пропущена проверка лимита

// ✅ Все изменения через контролируемые функции
const confirmedOrder = confirmOrder(order)  // Проверяет инварианты
const updatedOrder = addItemToOrder(order, newItem)  // Проверяет лимиты
```

### Ошибка 3: Анемичная доменная модель

```typescript
// ❌ Вся логика вне модели — модель это просто данные
interface Order { status: string; items: Item[] }
function processOrder(order: Order) { /* вся логика здесь */ }

// ✅ Логика рядом с данными, типы кодируют правила
interface Order extends Entity<OrderId> {
  readonly status: OrderStatus  // Union type ограничивает значения
  readonly items: NonEmptyArray<OrderItem>  // Не может быть пустым
}
// Функции-операции проверяют инварианты
function confirmOrder(order: Order): Order { ... }
```

### Ошибка 4: Event без типизации payload

```typescript
// ❌ Нетипизированные события
bus.emit({ type: 'OrderCreated', payload: { whatever: true } })

// ✅ Payload строго типизирован
type OrderCreated = DomainEvent<'OrderCreated', {
  orderId: string
  customerEmail: string
}>
```

## 💡 Best Practices

1. **"Make illegal states unrepresentable"** -- если состояние невалидно, тип должен запрещать его создание
2. **Branded types для всех доменных примитивов** -- Email, Money, UserId не должны быть голыми string/number
3. **Фабричные функции -- единственный способ создания** Value Objects. Запретите `as` вне фабрик
4. **Aggregate Root контролирует инварианты** -- прямой доступ к вложенным сущностям запрещён
5. **Domain Events -- факты, а не команды** -- `OrderCreated`, не `CreateOrder`
6. **Specifications для сложных бизнес-правил** -- вместо размазывания условий по коду
7. **readonly везде** -- иммутабельность предотвращает неконтролируемые изменения
