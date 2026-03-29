# 🔥 Level 0: Generics and Type Constraints

## 🎯 Why Generics Matter

Generics are one of the most powerful features of TypeScript. They allow you to create **reusable components** that work with different types while maintaining complete type safety.

### The Problem Without Generics

Without generics, we are forced to choose between type safety and reusability:

```typescript
// ❌ Option 1: concrete type — not reusable
function identityNumber(value: number): number {
  return value
}

// ❌ Option 2: any — loses type information
function identityAny(value: any): any {
  return value
}

const result = identityAny('hello')
result.toFixed(2) // No compile error, but crashes at runtime!
```

### The Solution With Generics

```typescript
// ✅ Generic function — both type-safe and reusable
function identity<T>(value: T): T {
  return value
}

const str = identity('hello')   // type: string
const num = identity(42)        // type: number
str.toFixed(2) // ❌ Compile error! Property 'toFixed' does not exist on type 'string'
num.toUpperCase() // ❌ Compile error!
```

TypeScript **infers** the type `T` from the passed argument. This is called **type inference**.

---

## 📌 Generic Constraints

By default, a generic parameter `T` can be **any type**. But often we need to restrict the allowed types to safely access certain properties.

### The extends Keyword

Constraints are specified with `extends`:

```typescript
// T must have a length property
interface HasLength {
  length: number
}

function logWithLength<T extends HasLength>(value: T): T {
  console.log(`Length: ${value.length}`)
  return value
}

logWithLength('hello')       // ✅ string has length
logWithLength([1, 2, 3])    // ✅ array has length
logWithLength({ length: 5 }) // ✅ object with length
logWithLength(42)            // ❌ number doesn't have length
```

### The keyof Constraint

`keyof T` creates a union type from all keys of type `T`:

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key]
}

const user = { name: 'Alice', age: 30 }

getProperty(user, 'name')  // ✅ type: string
getProperty(user, 'age')   // ✅ type: number
getProperty(user, 'email') // ❌ Argument of type '"email"' is not assignable
```

💡 **Important:** `T[K]` is an **indexed access type**. TypeScript knows exactly that `user['name']` returns `string` and `user['age']` returns `number`.

### Multiple Constraints

You can combine constraints with `&`:

```typescript
interface Identifiable {
  id: string | number
}

interface Timestamped {
  createdAt: Date
}

function logEntity<T extends Identifiable & Timestamped>(entity: T): void {
  console.log(`[${entity.id}] created at ${entity.createdAt.toISOString()}`)
}

// ✅ Type satisfies both interfaces
logEntity({ id: 1, createdAt: new Date(), name: 'test' })

// ❌ Missing createdAt
logEntity({ id: 1, name: 'test' })
```

### Constructor Constraints

For factory functions, you need to constrain the type as constructable:

```typescript
function createInstance<T>(ctor: new () => T): T {
  return new ctor()
}

class UserService {
  greeting = 'Hello from UserService'
}

const service = createInstance(UserService)
console.log(service.greeting) // ✅ "Hello from UserService"
```

For constructors with arguments:

```typescript
function createWithArgs<T, TArgs extends unknown[]>(
  ctor: new (...args: TArgs) => T,
  ...args: TArgs
): T {
  return new ctor(...args)
}

class ApiClient {
  constructor(public baseUrl: string, public timeout: number) {}
}

// TS infers TArgs as [string, number]
const client = createWithArgs(ApiClient, 'https://api.example.com', 5000)
```

---

## 📌 Default Type Parameters

Just as functions can have default parameter values, generics can have **default types**:

```typescript
interface ApiResponse<TData = unknown, TError = Error> {
  data: TData | null
  error: TError | null
  status: number
}

// Using default types
const resp1: ApiResponse = { data: null, error: null, status: 200 }

// Overriding the first parameter
const resp2: ApiResponse<User> = { data: { name: 'Alice' }, error: null, status: 200 }

// Overriding both
const resp3: ApiResponse<User, ApiError> = { data: null, error: { code: 404 }, status: 404 }
```

### Rules for Default Parameters

```typescript
// ✅ Correct: parameters with defaults come after those without
interface Good<T, U = string> {}

// ❌ Error: non-default parameter after default parameter
interface Bad<T = string, U> {} // Required type parameters may not follow optional type parameters
```

### Defaults Depending on Other Parameters

```typescript
interface Collection<TItem, TKey extends keyof TItem = keyof TItem> {
  items: TItem[]
  indexBy: TKey
}

interface Product {
  id: number
  sku: string
  name: string
}

// Key explicitly specified
const byId: Collection<Product, 'id'> = {
  items: [],
  indexBy: 'id' // only 'id' is allowed
}

// Default = keyof Product, i.e., 'id' | 'sku' | 'name'
const byAny: Collection<Product> = {
  items: [],
  indexBy: 'sku' // any Product key is allowed
}
```

---

## 📌 Type Inference in Functions

TypeScript can **infer** generic parameters from function arguments, saving you from specifying types explicitly.

### Inference from a Single Argument

```typescript
function wrap<T>(value: T): { value: T } {
  return { value }
}

const wrapped = wrap('hello')
// TypeScript inferred: wrap<string>('hello') → { value: string }
```

### Inference from Multiple Arguments

```typescript
function makePair<A, B>(first: A, second: B): [A, B] {
  return [first, second]
}

const pair = makePair('key', 42)
// Inferred: makePair<string, number> → [string, number]
```

### Inference from Callbacks

```typescript
function mapArray<T, U>(arr: T[], fn: (item: T) => U): U[] {
  return arr.map(fn)
}

// T is inferred from arr, U — from fn's return type
const lengths = mapArray(['hello', 'world'], (s) => s.length)
// T = string, U = number → number[]
```

### Inference with keyof

```typescript
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(item => item[key])
}

const users = [{ name: 'Alice', age: 30 }, { name: 'Bob', age: 25 }]

const names = pluck(users, 'name')  // string[]
const ages = pluck(users, 'age')    // number[]
```

💡 **Important:** TypeScript infers the exact return type `T[K]`, not the generalized `T[keyof T]`.

---

## 📌 Conditional Types with Generics

Conditional types become truly powerful in combination with generics:

```typescript
type IsArray<T> = T extends unknown[] ? true : false

type A = IsArray<string[]>  // true
type B = IsArray<number>    // false
```

### infer — Type Extraction

The `infer` keyword allows you to "extract" part of a type within a conditional expression:

```typescript
// Extract array element type
type ElementType<T> = T extends (infer E)[] ? E : T

type A = ElementType<string[]>   // string
type B = ElementType<number[]>   // number
type C = ElementType<boolean>    // boolean (not an array — return as-is)

// Extract function return type
type MyReturnType<T> = T extends (...args: any[]) => infer R ? R : never

type D = MyReturnType<() => string>           // string
type E = MyReturnType<(x: number) => boolean> // boolean

// Extract type from Promise
type Awaited<T> = T extends Promise<infer U> ? U : T

type F = Awaited<Promise<string>>  // string
type G = Awaited<number>           // number
```

---

## 📌 Generic Factories

Factory functions are one of the most practical patterns for generics.

### Builder Pattern

```typescript
function createBuilder<T extends Record<string, unknown>>(initial: T) {
  const state = { ...initial }

  return {
    set<K extends keyof T>(key: K, value: T[K]) {
      state[key] = value
      return this
    },
    build(): Readonly<T> {
      return Object.freeze({ ...state })
    }
  }
}

const config = createBuilder({ host: '', port: 0, debug: false })
  .set('host', 'localhost')
  .set('port', 8080)
  .set('debug', true)
  .build()
// config: Readonly<{ host: string; port: number; debug: boolean }>
```

### Validator Factory

```typescript
type Validator<T> = {
  validate: (value: unknown) => value is T
  parse: (value: unknown) => T
}

function createValidator<T>(
  check: (value: unknown) => value is T,
  typeName: string
): Validator<T> {
  return {
    validate: check,
    parse(value) {
      if (check(value)) return value
      throw new Error(`Expected ${typeName}, got ${typeof value}`)
    }
  }
}

const isString = createValidator(
  (v: unknown): v is string => typeof v === 'string',
  'string'
)

isString.parse('hello')  // ✅ 'hello'
isString.parse(42)       // ❌ throws Error
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Unnecessary Generic Parameters

```typescript
// ❌ Bad: T adds no value
function logValue<T>(value: T): void {
  console.log(value)
}

// ✅ Good: generic is not needed if the type isn't used in return or other params
function logValue(value: unknown): void {
  console.log(value)
}
```

📌 **Rule:** if a generic parameter is used in only one position, it probably isn't needed.

### Mistake 2: Constraint Instead of Preserving the Type

```typescript
// ❌ Bad: extends string but returns string (not T)
function processName<T extends string>(name: T): string {
  return name.toUpperCase()
}

const result = processName('hello' as const)
// result: string — lost the literal type!

// ✅ Good: return T (or Uppercase<T>)
function processName<T extends string>(name: T): Uppercase<T> {
  return name.toUpperCase() as Uppercase<T>
}

const result = processName('hello' as const)
// result: "HELLO"
```

### Mistake 3: Forgetting the Constraint

```typescript
// ❌ Error: Property 'length' does not exist on type 'T'
function getLength<T>(value: T): number {
  return value.length // Error!
}

// ✅ Fixed: added constraint
function getLength<T extends { length: number }>(value: T): number {
  return value.length
}
```

### Mistake 4: Wrong Order of Default Parameters

```typescript
// ❌ Compile error
interface BadOrder<T = string, U> {
  first: T
  second: U
}

// ✅ Parameters with defaults go last
interface GoodOrder<U, T = string> {
  first: T
  second: U
}
```

### Mistake 5: Explicit Type Instead of Inference

```typescript
function makePair<A, B>(a: A, b: B): [A, B] {
  return [a, b]
}

// ❌ Redundant: TypeScript infers types perfectly fine
const pair = makePair<string, number>('hello', 42)

// ✅ Better: let inference do its job
const pair = makePair('hello', 42) // [string, number]
```

---

## 💡 Best Practices

1. **Use the minimum necessary constraints.** Don't restrict more than the function actually needs.

2. **Use meaningful parameter names.** Instead of `T, U, V`, use `TItem, TKey, TResult` for complex generics.

3. **Rely on inference.** Don't specify generic parameters explicitly if TypeScript can infer them.

4. **Use default types** for public APIs to simplify usage in common cases.

5. **Test edge cases.** Check how your generic behaves with `never`, `unknown`, `any`, and union types.

6. **One generic parameter = one job.** Don't create functions with 5+ generic parameters — split them into multiple functions.
