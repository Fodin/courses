# 🔥 Level 6: Advanced Type Guards

## 🎯 Introduction

Type guards are a TypeScript mechanism that allows you to **narrow** a variable's type based on runtime checks. You already know the basics: `typeof`, `instanceof`, `in`. At this level we study **advanced** techniques: custom type predicates (`is`), assertion functions (`asserts`), and generic narrowing.

These patterns are critical for working with data from external sources (APIs, user input, `unknown`), where TypeScript cannot infer the type automatically.

## 🔥 Built-in Type Guards — Recap

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === 'string') {
    value.toUpperCase() // TypeScript knows: string
  } else {
    value.toFixed(2) // TypeScript knows: number
  }
}

// instanceof guard
function handleError(error: Error | string) {
  if (error instanceof TypeError) {
    error.message // TypeScript knows: TypeError
  }
}

// in guard
function hasName(obj: { name: string } | { id: number }) {
  if ('name' in obj) {
    obj.name // TypeScript knows: { name: string }
  }
}
```

The problem: these guards are limited — they cannot check complex conditions or user-defined types.

## 🔥 Custom Type Predicates (is)

### Syntax

```typescript
function isType(value: SourceType): value is TargetType {
  // runtime check
  return /* boolean */
}
```

The key part is the **return type** `value is TargetType`. This is a **type predicate** — a promise to the compiler that if the function returns `true`, then `value` has type `TargetType`.

### Basic Examples

```typescript
interface User {
  id: number
  name: string
  email: string
}

interface Admin extends User {
  role: 'admin'
  permissions: string[]
}

// Type predicate for Admin
function isAdmin(user: User): user is Admin {
  return 'role' in user && (user as Admin).role === 'admin'
}

function greet(user: User) {
  if (isAdmin(user)) {
    // TypeScript knows: user is Admin
    console.log(`Admin ${user.name}, permissions: ${user.permissions.join(', ')}`)
  } else {
    // TypeScript knows: user is User (but not Admin)
    console.log(`User ${user.name}`)
  }
}
```

### Filtering Arrays

Type predicates are especially useful with `Array.filter`:

```typescript
function isNotNull<T>(value: T | null | undefined): value is T {
  return value != null
}

const values: (string | null)[] = ['hello', null, 'world', null]

// Without type predicate: (string | null)[]
const bad = values.filter(v => v != null)

// With type predicate: string[]
const good = values.filter(isNotNull)
```

📌 Without a type predicate, `filter` returns the same array type. With a predicate, TypeScript narrows the element type.

### Composable Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

function isNonEmpty(value: string): value is string {
  return value.length > 0
}

// Combining guards
function isNonEmptyString(value: unknown): value is string {
  return isString(value) && isNonEmpty(value)
}

const items: unknown[] = [42, '', 'hello', null, 'world']
const valid = items.filter(isNonEmptyString)
// string[]: ['hello', 'world']
```

### Guard for API Response Validation

```typescript
interface ApiResponse<T> {
  status: number
  data: T
}

interface SuccessResponse<T> extends ApiResponse<T> {
  status: 200
  data: T
}

function isSuccess<T>(
  response: ApiResponse<T | null>
): response is SuccessResponse<T> {
  return response.status === 200 && response.data !== null
}

async function fetchUser(id: string) {
  const response: ApiResponse<User | null> = await fetch(`/api/users/${id}`).then(r => r.json())

  if (isSuccess(response)) {
    // TypeScript knows: response.data is User
    console.log(response.data.name)
  }
}
```

## 🔥 Assertion Functions (asserts)

### Difference from Type Predicates

| | Type predicate (`is`) | Assertion (`asserts`) |
|---|---|---|
| Return type | `value is Type` | `asserts value is Type` |
| What it returns | `boolean` | `void` (or throws an error) |
| Control flow | `if (isX(value))` | `assertX(value); // value: Type below` |
| Analogy | Check: "is it?" | Guarantee: "I assert that it is" |

### asserts condition

```typescript
function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new Error(message ?? 'Assertion failed')
  }
}

function processUser(user: User | null) {
  assert(user !== null, 'User must not be null')
  // After assert, TypeScript knows: user is User
  console.log(user.name)
}
```

### asserts value is Type

```typescript
function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value == null) {
    throw new Error(message ?? 'Value is null or undefined')
  }
}

function assertIsUser(value: unknown): asserts value is User {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Expected an object')
  }
  const obj = value as Record<string, unknown>
  if (typeof obj.id !== 'number') throw new Error('id must be a number')
  if (typeof obj.name !== 'string') throw new Error('name must be a string')
  if (typeof obj.email !== 'string') throw new Error('email must be a string')
}
```

### Pattern: Input Validation at Function Entry

```typescript
function createOrder(userId: unknown, items: unknown) {
  assertDefined(userId, 'userId is required')
  assertIsString(userId) // asserts userId is string
  assertIsNonEmptyArray(items) // asserts items is [unknown, ...unknown[]]

  // TypeScript knows exact types from here on
  return { userId, items, createdAt: new Date() }
}
```

### Assertion for Arrays

```typescript
function assertNonEmpty<T>(
  arr: T[],
  message?: string
): asserts arr is [T, ...T[]] {
  if (arr.length === 0) {
    throw new Error(message ?? 'Expected non-empty array')
  }
}

function processItems(items: string[]) {
  assertNonEmpty(items, 'At least one item required')
  // TypeScript knows: items is [string, ...string[]]
  const [first, ...rest] = items
  console.log(`First: ${first}, rest: ${rest.length}`)
}
```

### Assertion Chains

```typescript
function processApiData(raw: unknown) {
  // Each assert narrows the type for subsequent code
  assertDefined(raw)                    // raw: {} (non-null)
  assertHasProperty(raw, 'data')        // raw: { data: unknown }
  assertIsArray(raw.data)               // raw: { data: unknown[] }
  assertNonEmpty(raw.data)              // raw: { data: [unknown, ...unknown[]] }

  return raw.data.map(item => processItem(item))
}
```

## 🔥 Generic Narrowing

### Generic Type Guard for Properties

```typescript
function hasProperty<K extends string>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return typeof obj === 'object' && obj !== null && key in obj
}

const data: unknown = { name: 'Alice', age: 30 }

if (hasProperty(data, 'name')) {
  // data: Record<'name', unknown>
  console.log(data.name)
}
```

### Type Guard with Value Type Check

```typescript
function hasTypedProperty<K extends string, V>(
  obj: unknown,
  key: K,
  guard: (value: unknown) => value is V
): obj is Record<K, V> {
  return hasProperty(obj, key) && guard(obj[key])
}

function isString(value: unknown): value is string {
  return typeof value === 'string'
}

if (hasTypedProperty(data, 'name', isString)) {
  // data: Record<'name', string>
  data.name.toUpperCase() // ✅ TypeScript knows name is string
}
```

### Guard for Arrays with Generics

```typescript
function isArrayOf<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[] {
  return Array.isArray(value) && value.every(guard)
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number'
}

const arr: unknown = [1, 2, 3]
if (isArrayOf(arr, isNumber)) {
  // arr: number[]
  const sum = arr.reduce((a, b) => a + b, 0)
}
```

### Guard Factory Pattern

```typescript
function createGuard<T>(
  check: (value: unknown) => boolean
): (value: unknown) => value is T {
  return (value: unknown): value is T => check(value)
}

interface Product {
  id: number
  name: string
  price: number
}

const isProduct = createGuard<Product>((value) => {
  if (typeof value !== 'object' || value === null) return false
  const obj = value as Record<string, unknown>
  return (
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    typeof obj.price === 'number'
  )
})

const data: unknown = { id: 1, name: 'Laptop', price: 999 }
if (isProduct(data)) {
  console.log(data.name, data.price) // ✅ fully typed
}
```

### Guard for Discriminated Unions

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string }

function isSuccess<T>(result: Result<T>): result is Extract<Result<T>, { success: true }> {
  return result.success === true
}

function isFailure<T>(result: Result<T>): result is Extract<Result<T>, { success: false }> {
  return result.success === false
}

function processResult<T>(result: Result<T>) {
  if (isSuccess(result)) {
    // result: { success: true; data: T }
    return result.data
  }
  // result: { success: false; error: string }
  throw new Error(result.error)
}
```

## 🔥 Advanced Patterns

### Schema Validation with Type Guards

```typescript
type Schema<T> = {
  [K in keyof T]: (value: unknown) => value is T[K]
}

function validateSchema<T>(
  data: unknown,
  schema: Schema<T>
): data is T {
  if (typeof data !== 'object' || data === null) return false
  const obj = data as Record<string, unknown>

  for (const key in schema) {
    if (!schema[key](obj[key])) return false
  }
  return true
}

interface User {
  name: string
  age: number
  active: boolean
}

const userSchema: Schema<User> = {
  name: (v): v is string => typeof v === 'string',
  age: (v): v is number => typeof v === 'number',
  active: (v): v is boolean => typeof v === 'boolean',
}

const raw: unknown = { name: 'Alice', age: 30, active: true }
if (validateSchema<User>(raw, userSchema)) {
  // raw: User
  console.log(raw.name)
}
```

### Branded Types with Guards

```typescript
type Email = string & { readonly __brand: 'Email' }
type PositiveNumber = number & { readonly __brand: 'Positive' }

function isEmail(value: string): value is Email {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPositive(value: number): value is PositiveNumber {
  return value > 0
}

function sendEmail(to: Email, amount: PositiveNumber) {
  console.log(`Sending $${amount} to ${to}`)
}

const email = 'user@example.com'
const amount = 100

if (isEmail(email) && isPositive(amount)) {
  sendEmail(email, amount) // ✅ TypeScript is happy
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Type Predicate Doesn't Match Actual Check

```typescript
// ❌ Dangerous! Predicate promises User, but the check is incomplete
function isUser(value: unknown): value is User {
  return typeof value === 'object' // Only checks for object!
}

const data: unknown = { foo: 'bar' }
if (isUser(data)) {
  // TypeScript believes data: User, but data.name is undefined!
  console.log(data.name.toUpperCase()) // Runtime error!
}

// ✅ Complete check of all fields
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === 'number' &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).email === 'string'
  )
}
```

📌 TypeScript **trusts** your type predicate. If the check is incomplete, you'll get a runtime error with full compiler confidence.

### Mistake 2: Assertion Function Doesn't Throw

```typescript
// ❌ Assertion must throw an error when the condition fails
function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    console.log('Not a string') // ⚠️ Doesn't throw!
    // TypeScript will still narrow the type — but the value isn't a string!
  }
}

// ✅ Always throw in assertion functions
function assertString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new TypeError(`Expected string, got ${typeof value}`)
  }
}
```

### Mistake 3: Not Accounting for null

```typescript
// ❌ typeof null === 'object' — a classic trap
function hasName(obj: unknown): obj is { name: string } {
  return typeof obj === 'object' && typeof (obj as Record<string, unknown>).name === 'string'
  // null passes the typeof obj === 'object' check!
}

// ✅ Explicit null check
function hasName(obj: unknown): obj is { name: string } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Record<string, unknown>).name === 'string'
  )
}
```

### Mistake 4: Guard in Arrow Function Without Annotation

```typescript
// ❌ Arrow function without return type — not a guard
const isString = (value: unknown) => typeof value === 'string'
// Type: (value: unknown) => boolean — NOT a type predicate!

// ✅ Explicit return type annotation
const isString = (value: unknown): value is string =>
  typeof value === 'string'
```

### Mistake 5: Assertion in async Function

```typescript
// ❌ asserts doesn't work with async functions
async function assertUser(id: string): asserts id is string {
  // Error: assertion function cannot be async
}

// ✅ Assertion inside regular function, async logic separate
async function loadAndValidateUser(id: string): Promise<User> {
  const data = await fetchUser(id)
  assertIsUser(data) // Regular assertion function
  return data
}
```

## 💡 Best Practices

1. **Type predicate must accurately match the check**: don't promise `User` if you only verify `typeof obj === 'object'`

2. **Assertion functions must always throw**: if the condition fails — `throw`, never `return`

3. **Use generic guards for reusability**: `isArrayOf<T>`, `hasProperty<K>` — universal building blocks

4. **Combine guards**: small, specialized guards are easier to test and compose

5. **Remember null**: `typeof null === 'object'` — always check `obj !== null`

6. **Prefer assertion functions for input data**: at the beginning of a function, check all preconditions and narrow types

7. **Don't use assertion functions in async context**: `asserts` is not compatible with `async`

## 📌 Summary

| Technique | Syntax | When to Use |
|-----------|--------|-------------|
| Type predicate | `value is Type` | Type checking in if/filter |
| Assertion function | `asserts value is Type` | Input validation at function entry |
| `asserts condition` | `asserts condition` | Checking arbitrary conditions |
| Generic guard | `<T>(value, guard) => value is T` | Reusable checks |
| Guard factory | `createGuard<T>(check)` | Creating guards from descriptions |
| Schema validation | `Schema<T> + validateSchema` | Validating objects against schema |
| Branded type guard | `value is BrandedType` | Nominal typing |
