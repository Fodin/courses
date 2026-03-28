# 🔥 Level 4: TypeScript Error Handling Patterns

## 🎯 Introduction

TypeScript provides powerful tools for type-safe error handling. Instead of relying on `try/catch` and `unknown`, you can make errors part of the type system.

## 🔥 Result Type (Either Pattern)

💡 **Idea**: a function returns either a successful result or an error — and this is expressed in the type.

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

### Helper Functions

```typescript
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
```

### Usage

```typescript
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Division by zero')
  return ok(a / b)
}

const result = safeDivide(10, 0)
if (result.ok) {
  console.log(result.value) // TypeScript knows this is number
} else {
  console.log(result.error) // TypeScript knows this is string
}
```

### ✅ Advantages Over throw

| `throw` | `Result` |
|---------|----------|
| ❌ Error is not visible in the function type | ✅ Error is part of the signature |
| ❌ `catch` receives `unknown` | ✅ Error type is known |
| ❌ Easy to forget to handle | ✅ Compiler will remind you |
| ❌ Interrupts execution flow | ✅ Explicit branching |

## 🔥 Discriminated Unions for States

Especially useful for loading states in React:

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### Usage in Component

```typescript
function UserProfile() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'idle' })

  // TypeScript guarantees: data is only available on success
  if (state.status === 'success') {
    return <div>{state.data.name}</div>
  }
  if (state.status === 'error') {
    return <div>Error: {state.error}</div>
  }
  // ...
}
```

## 🔥 Type-safe Error Codes

```typescript
type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK'

interface TypedError<C extends ErrorCode> {
  code: C
  message: string
}

// Specialized types with additional fields
type ValidationErr = TypedError<'VALIDATION'> & {
  details: { field: string; constraint: string }
}

type NotFoundErr = TypedError<'NOT_FOUND'> & {
  details: { resource: string; id: string }
}

type AppError = ValidationErr | NotFoundErr | TypedError<'UNAUTHORIZED'> | TypedError<'NETWORK'>
```

### Handling with Type Narrowing

```typescript
function handleError(error: AppError): string {
  switch (error.code) {
    case 'VALIDATION':
      // TypeScript knows error.details.field exists
      return `Field "${error.details.field}": ${error.details.constraint}`
    case 'NOT_FOUND':
      return `${error.details.resource} not found`
    case 'UNAUTHORIZED':
      return 'Sign in to your account'
    case 'NETWORK':
      return 'Network issues'
  }
}
```

## 🔥 Exhaustive Handling with never

📌 The `assertNever` pattern guarantees that you have handled all variants of a union type:

```typescript
function assertNever(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`)
}

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      return assertNever(shape) // Compilation error if variant is missing
  }
}
```

💡 If you add a new `kind: 'triangle'` to `Shape`, TypeScript will immediately show an error in `assertNever` — forgetting to handle it is impossible.

## Combining Patterns

```typescript
type FetchResult<T> = Result<T, AppError>

async function fetchUser(id: string): Promise<FetchResult<User>> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (response.status === 404) {
      return err({ code: 'NOT_FOUND', message: 'User not found', details: { resource: 'User', id } })
    }
    if (response.status === 401) {
      return err({ code: 'UNAUTHORIZED', message: 'Not authorized' })
    }
    const data = await response.json()
    return ok(data)
  } catch {
    return err({ code: 'NETWORK', message: 'Network error' })
  }
}

// Usage
const result = await fetchUser('123')
if (result.ok) {
  renderUser(result.value)
} else {
  showError(handleError(result.error))
}
```

## ⚠️ Common Beginner Mistakes

### ❌ Using `any` Instead of `Result` for Error Handling

```typescript
// ❌ Bad: error type is lost
function parseConfig(raw: string): any {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const config = parseConfig('bad json')
config.host // 💥 Runtime crash! null.host — TypeError
```

> Why this is an error: the calling code doesn't know the function can return `null`. There is no compiler enforcement to check the result — the error only surfaces at runtime.

```typescript
// ✅ Good: Result makes the error explicit
function parseConfig(raw: string): Result<Config, string> {
  try {
    return ok(JSON.parse(raw))
  } catch {
    return err('Invalid JSON')
  }
}

const result = parseConfig('bad json')
if (!result.ok) {
  // Compiler forces you to handle the error
  console.error(result.error)
}
```

### ❌ Forgotten `default` Case Without `assertNever`

```typescript
// ❌ Bad: no exhaustive check
type Status = 'active' | 'inactive' | 'banned'

function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    // 'banned' is forgotten — function returns undefined!
  }
}
```

> Why this is an error: if you add a new variant to the union (e.g., `'banned'`), TypeScript will **not** warn that the `switch` doesn't cover all cases. The function silently returns `undefined`, leading to unpredictable behavior in the UI.

```typescript
// ✅ Good: assertNever guarantees complete handling
function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Active'
    case 'inactive': return 'Inactive'
    case 'banned': return 'Banned'
    default: return assertNever(status)
  }
}
```

### ❌ Direct Access to `data` Without Checking `status`

```typescript
// ❌ Bad: accessing data without checking status
const state: AsyncState<User> = await getUser()
console.log(state.data.name) // 💥 Property 'data' does not exist on type '{ status: "loading" }'
```

> Why this is an error: TypeScript won't allow you to access `data` without narrowing the type via a `status` check. But if you use `as any` or incorrect type assertions, the error will manifest at runtime — `undefined.name` throws a TypeError.

```typescript
// ✅ Good: type narrowing via status check
if (state.status === 'success') {
  console.log(state.data.name) // TypeScript knows data exists
}
```

## 📌 Summary

- ✅ `Result<T, E>` makes errors an explicit part of the function type
- ✅ Discriminated unions model loading states with type guarantees
- ✅ Typed error codes allow different handling for each type
- ✅ `assertNever` guarantees exhaustive handling of all variants
- ✅ These patterns reduce runtime errors through compile-time checks
