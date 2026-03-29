# 🔥 Уровень 11: Продвинутые утилитарные типы

## 🎯 Зачем нужны кастомные утилитарные типы

Встроенные утилитарные типы TypeScript (`Pick`, `Omit`, `Partial`, `Required`) решают базовые задачи. Но в реальных проектах возникают паттерны, для которых встроенных типов недостаточно: точное соответствие формы объекта, взаимоисключающие свойства, глубокие операции над вложенными структурами и номинальная типизация.

### Проблема

```typescript
// ❌ TypeScript структурно типизирован — это иногда мешает
type UserId = number
type PostId = number

function getUser(id: UserId): void { /* ... */ }
function getPost(id: PostId): void { /* ... */ }

const postId: PostId = 42
getUser(postId) // Нет ошибки! UserId и PostId — оба number
```

Этот уровень научит создавать типы, которые решают такие проблемы.

---

## 📌 Exact Types — запрет лишних свойств

### Проблема excess properties

TypeScript проверяет excess properties только при **прямом присваивании** объектного литерала. При непрямом присваивании лишние свойства тихо проходят:

```typescript
interface Config {
  host: string
  port: number
}

// ✅ Прямое присваивание — ошибка обнаруживается
const config: Config = { host: 'localhost', port: 3000, debug: true }
// Error: Object literal may only specify known properties

// ❌ Непрямое присваивание — лишнее свойство игнорируется
const fullConfig = { host: 'localhost', port: 3000, debug: true }
const config: Config = fullConfig // Нет ошибки! debug тихо пропал
```

### Решение: Exact<T, Shape>

```typescript
type Exact<T, Shape = T> =
  T extends Shape
    ? Exclude<keyof T, keyof Shape> extends never
      ? T
      : never
    : never

function applyConfig<T extends Config>(
  config: T & Exact<T, Config>
): void { /* ... */ }

applyConfig({ host: 'localhost', port: 3000 })              // ✅
applyConfig({ host: 'localhost', port: 3000, debug: true })  // ❌ Error!
```

📌 **Как работает**: `Exclude<keyof T, keyof Shape>` находит ключи, которые есть в T, но нет в Shape. Если таких ключей нет (`extends never`), тип совпадает точно.

### DeepExact для вложенных объектов

```typescript
type DeepExact<T, Shape> = {
  [K in keyof Shape]: K extends keyof T
    ? T[K] extends object
      ? Shape[K] extends object
        ? DeepExact<T[K], Shape[K]>
        : Shape[K]
      : Shape[K]
    : Shape[K]
}
```

---

## 📌 XOR Type — взаимоисключающие типы

### Проблема с обычными union

```typescript
interface CardPayment {
  cardNumber: string
  cvv: string
}

interface BankTransfer {
  bankAccount: string
  routingNumber: string
}

// Обычный union разрешает оба набора свойств одновременно!
type Payment = CardPayment | BankTransfer

const payment: Payment = {
  cardNumber: '4111...',
  cvv: '123',
  bankAccount: 'ACC123',     // ❌ Должно быть запрещено!
  routingNumber: 'RTN456',
}
```

### Решение: XOR<A, B>

```typescript
type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)

type Payment = XOR<CardPayment, BankTransfer>

// ✅ Только карта
const card: Payment = { cardNumber: '4111...', cvv: '123' }

// ✅ Только банк
const bank: Payment = { bankAccount: 'ACC123', routingNumber: 'RTN456' }

// ❌ Оба — ошибка!
const both: Payment = {
  cardNumber: '4111...', cvv: '123',
  bankAccount: 'ACC123', routingNumber: 'RTN456',
}
```

📌 **Как работает**: `Without<T, U>` создаёт тип, где ключи из T (которых нет в U) имеют тип `never`. Это запрещает их присутствие в объекте.

### Многосторонний XOR

```typescript
type XOR3<A, B, C> = XOR<XOR<A, B>, C>

// Пример: три способа оплаты, но только один за раз
type PaymentMethod = XOR3<CardPayment, BankTransfer, CryptoPayment>
```

---

## 📌 DeepPick & DeepOmit — глубокие операции

### DeepPick по dot-path

```typescript
type DeepPick<T, Paths extends string> =
  Paths extends `${infer Key}.${infer Rest}`
    ? Key extends keyof T
      ? { [K in Key]: DeepPick<T[K], Rest> }
      : never
    : Paths extends keyof T
      ? { [K in Paths]: T[K] }
      : never

interface User {
  id: number
  profile: {
    avatar: string
    settings: { theme: string; language: string }
  }
}

type UserTheme = DeepPick<User, 'profile.settings.theme'>
// { profile: { settings: { theme: string } } }
```

### DeepPick с несколькими путями

```typescript
type UnionToIntersection<U> =
  (U extends unknown ? (x: U) => void : never) extends (x: infer I) => void
    ? I : never

type DeepPickMulti<T, Paths extends string> =
  UnionToIntersection<DeepPick<T, Paths>>

type Result = DeepPickMulti<User, 'id' | 'profile.settings.theme'>
// { id: number } & { profile: { settings: { theme: string } } }
```

### DeepOmit

```typescript
type DeepOmit<T, Paths extends string> =
  Paths extends `${infer Key}.${infer Rest}`
    ? {
        [K in keyof T]: K extends Key
          ? DeepOmit<T[K], Rest>
          : T[K]
      }
    : Omit<T, Paths>

type WithoutTheme = DeepOmit<User, 'profile.settings.theme'>
// User, но без profile.settings.theme
```

### Автодополнение путей

```typescript
type PathsOf<T, Prefix extends string = ''> =
  T extends object
    ? {
        [K in keyof T & string]:
          | `${Prefix}${K}`
          | PathsOf<T[K], `${Prefix}${K}.`>
      }[keyof T & string]
    : never

type UserPaths = PathsOf<User>
// 'id' | 'profile' | 'profile.avatar' | 'profile.settings' | ...
```

---

## 📌 Opaque (Branded) Types — номинальная типизация

### Проблема структурной типизации

```typescript
// Всё это просто number — легко перепутать
type UserId = number
type PostId = number
type Money = number

function getUser(id: UserId) { /* ... */ }
getUser(42 as PostId) // Нет ошибки! Опасный баг
```

### Решение: Brand<T, B>

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type UserId = Brand<number, 'UserId'>
type PostId = Brand<number, 'PostId'>
type Email = Brand<string, 'Email'>
type Money = Brand<number, 'Money'>
```

### Smart Constructors

```typescript
function createUserId(id: number): UserId {
  if (id <= 0 || !Number.isInteger(id)) {
    throw new Error(`Invalid UserId: ${id}`)
  }
  return id as UserId
}

function createEmail(value: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Invalid email: ${value}`)
  }
  return value as Email
}
```

### Типобезопасное использование

```typescript
function getUserById(id: UserId): void { /* ... */ }

const userId = createUserId(42)
const postId = createPostId(42)

getUserById(userId)  // ✅
getUserById(postId)  // ❌ Error! PostId !== UserId
getUserById(42)      // ❌ Error! number !== UserId
```

### Операции с branded types

```typescript
type Percentage = Brand<number, 'Percentage'>

function createPercentage(value: number): Percentage {
  if (value < 0 || value > 100) throw new Error('Invalid percentage')
  return value as Percentage
}

function applyDiscount(price: Money, discount: Percentage): Money {
  return createMoney((price as number) * (1 - (discount as number) / 100))
}

// applyDiscount(price, price) // ❌ Money !== Percentage
```

---

## ⚠️ Частые ошибки новичков

### Ошибка 1: Exact через intersection вместо conditional

```typescript
// ❌ Неправильно: intersection не запрещает excess properties
type BadExact<T> = T & Record<string, never>

// ✅ Правильно: conditional check
type Exact<T, Shape> =
  Exclude<keyof T, keyof Shape> extends never ? T : never
```

### Ошибка 2: XOR без Without

```typescript
// ❌ Просто union — не работает как XOR
type BadXOR<A, B> = A | B

// ✅ Нужен Without для запрета "чужих" ключей
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)
```

### Ошибка 3: Branded type без smart constructor

```typescript
// ❌ Бренд без валидации бесполезен
type Email = Brand<string, 'Email'>
const email = 'not-an-email' as Email // Проходит, но невалидно!

// ✅ Всегда используйте smart constructor
function createEmail(value: string): Email {
  if (!isValidEmail(value)) throw new Error('Invalid')
  return value as Email
}
```

### Ошибка 4: DeepPick без UnionToIntersection

```typescript
// ❌ Без UnionToIntersection результат — union, а не intersection
type Bad = DeepPick<User, 'id'> | DeepPick<User, 'profile.avatar'>
// { id: number } | { profile: { avatar: string } } — нельзя обратиться к обоим!

// ✅ С UnionToIntersection
type Good = DeepPickMulti<User, 'id' | 'profile.avatar'>
// { id: number } & { profile: { avatar: string } }
```

---

## 💡 Best Practices

1. **Exact types** — используйте для API-контрактов, где лишние поля опасны
2. **XOR** — используйте для состояний, форм оплаты, конфигураций с взаимоисключающими опциями
3. **DeepPick/DeepOmit** — используйте для GraphQL-подобных выборок и трансформаций данных
4. **Opaque types** — используйте для доменных примитивов (ID, Email, Money), где перемешивание опасно
5. **Smart constructors** — всегда валидируйте данные при создании branded типа
6. **PathsOf** — автодополнение путей улучшает DX при работе с глубокими структурами
