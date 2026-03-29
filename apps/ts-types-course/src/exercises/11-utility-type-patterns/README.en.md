# 🔥 Level 11: Advanced Utility Type Patterns

## 🎯 Why Custom Utility Types

TypeScript's built-in utility types (`Pick`, `Omit`, `Partial`, `Required`) handle basic cases. But real projects require patterns that go beyond built-in types: exact object shape matching, mutually exclusive properties, deep operations on nested structures, and nominal typing.

### The problem

```typescript
// ❌ TypeScript is structurally typed — this can be problematic
type UserId = number
type PostId = number

function getUser(id: UserId): void { /* ... */ }
function getPost(id: PostId): void { /* ... */ }

const postId: PostId = 42
getUser(postId) // No error! UserId and PostId are both number
```

This level teaches you to build types that solve these problems.

---

## 📌 Exact Types — Preventing Excess Properties

### The excess property problem

TypeScript checks excess properties only on **direct assignment** of object literals. Indirect assignment silently accepts extra properties:

```typescript
interface Config {
  host: string
  port: number
}

// ✅ Direct assignment — error caught
const config: Config = { host: 'localhost', port: 3000, debug: true }
// Error: Object literal may only specify known properties

// ❌ Indirect assignment — extra property silently ignored
const fullConfig = { host: 'localhost', port: 3000, debug: true }
const config: Config = fullConfig // No error! debug silently dropped
```

### Solution: Exact<T, Shape>

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

📌 **How it works**: `Exclude<keyof T, keyof Shape>` finds keys present in T but not in Shape. If there are no such keys (`extends never`), the types match exactly.

### DeepExact for nested objects

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

## 📌 XOR Type — Mutually Exclusive Types

### The problem with regular unions

```typescript
interface CardPayment {
  cardNumber: string
  cvv: string
}

interface BankTransfer {
  bankAccount: string
  routingNumber: string
}

// Regular union allows both sets of properties simultaneously!
type Payment = CardPayment | BankTransfer

const payment: Payment = {
  cardNumber: '4111...',
  cvv: '123',
  bankAccount: 'ACC123',     // ❌ Should be forbidden!
  routingNumber: 'RTN456',
}
```

### Solution: XOR<A, B>

```typescript
type Without<T, U> = {
  [P in Exclude<keyof T, keyof U>]?: never
}

type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)

type Payment = XOR<CardPayment, BankTransfer>

// ✅ Card only
const card: Payment = { cardNumber: '4111...', cvv: '123' }

// ✅ Bank only
const bank: Payment = { bankAccount: 'ACC123', routingNumber: 'RTN456' }

// ❌ Both — error!
const both: Payment = {
  cardNumber: '4111...', cvv: '123',
  bankAccount: 'ACC123', routingNumber: 'RTN456',
}
```

📌 **How it works**: `Without<T, U>` creates a type where keys from T (not in U) have type `never`. This forbids their presence in the object.

### Multi-way XOR

```typescript
type XOR3<A, B, C> = XOR<XOR<A, B>, C>

type PaymentMethod = XOR3<CardPayment, BankTransfer, CryptoPayment>
```

---

## 📌 DeepPick & DeepOmit — Deep Operations

### DeepPick by dot-path

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

### DeepPick with multiple paths

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
```

### Path autocomplete

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

## 📌 Opaque (Branded) Types — Nominal Typing

### The structural typing problem

```typescript
// All of these are just number — easy to confuse
type UserId = number
type PostId = number
type Money = number

function getUser(id: UserId) { /* ... */ }
getUser(42 as PostId) // No error! Dangerous bug
```

### Solution: Brand<T, B>

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

### Type-safe usage

```typescript
function getUserById(id: UserId): void { /* ... */ }

const userId = createUserId(42)
const postId = createPostId(42)

getUserById(userId)  // ✅
getUserById(postId)  // ❌ Error! PostId !== UserId
getUserById(42)      // ❌ Error! number !== UserId
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Exact via intersection instead of conditional

```typescript
// ❌ Wrong: intersection doesn't prevent excess properties
type BadExact<T> = T & Record<string, never>

// ✅ Correct: conditional check
type Exact<T, Shape> =
  Exclude<keyof T, keyof Shape> extends never ? T : never
```

### Mistake 2: XOR without Without

```typescript
// ❌ Plain union doesn't work as XOR
type BadXOR<A, B> = A | B

// ✅ Need Without to forbid "foreign" keys
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T & Without<U, T>) | (U & Without<T, U>)
```

### Mistake 3: Branded type without smart constructor

```typescript
// ❌ Brand without validation is useless
type Email = Brand<string, 'Email'>
const email = 'not-an-email' as Email // Passes but invalid!

// ✅ Always use smart constructors
function createEmail(value: string): Email {
  if (!isValidEmail(value)) throw new Error('Invalid')
  return value as Email
}
```

### Mistake 4: DeepPick without UnionToIntersection

```typescript
// ❌ Without UnionToIntersection, result is union, not intersection
type Bad = DeepPick<User, 'id'> | DeepPick<User, 'profile.avatar'>
// { id: number } | { profile: { avatar: string } } — can't access both!

// ✅ With UnionToIntersection
type Good = DeepPickMulti<User, 'id' | 'profile.avatar'>
// { id: number } & { profile: { avatar: string } }
```

---

## 💡 Best Practices

1. **Exact types** — use for API contracts where extra fields are dangerous
2. **XOR** — use for states, payment forms, configs with mutually exclusive options
3. **DeepPick/DeepOmit** — use for GraphQL-like selections and data transformations
4. **Opaque types** — use for domain primitives (ID, Email, Money) where mixing is dangerous
5. **Smart constructors** — always validate data when creating branded types
6. **PathsOf** — path autocomplete improves DX when working with deep structures
