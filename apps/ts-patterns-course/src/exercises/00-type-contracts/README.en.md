# 🎯 Level 0: Types as Contracts

## 📖 Introduction

TypeScript is not just "JavaScript with types." Types in TS can serve as **contracts** that make entire classes of errors impossible at compile time.

In this level we will explore three fundamental patterns that transform the type system from a documentation tool into active protection.

## 🏷️ Branded Types

A plain `string` does not distinguish an email from a userId:

```typescript
function sendEmail(email: string) { /* ... */ }
function findUser(id: string) { /* ... */ }

const email = "alice@example.com"
const userId = "usr-42"

// Compiles without errors, but this is a bug!
sendEmail(userId)
findUser(email)
```

**Branded Types** add a "brand" to a type, making it unique:

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type Email = Brand<string, 'Email'>
type UserId = Brand<string, 'UserId'>

// Now mixing them up is impossible:
function sendEmail(email: Email) { /* ... */ }
function findUser(id: UserId) { /* ... */ }

// TS Error: string is not assignable to Email
sendEmail(userId)
```

### How to create branded values

Via constructor functions with validation:

```typescript
function createEmail(value: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Invalid email: ${value}`)
  }
  return value as Email
}
```

> 💡 **Tip:** `as` is only used inside the constructor function. In all other code, work with `Email`, not `string`.

## 🔍 Type Guards

A type guard is a function that narrows the type of a variable:

```typescript
interface ErrorResponse {
  status: 'error'
  error: { code: number; message: string }
}

interface SuccessResponse {
  status: 'success'
  data: { id: number; name: string }
}

type ApiResponse = SuccessResponse | ErrorResponse

// Type Guard
function isErrorResponse(resp: ApiResponse): resp is ErrorResponse {
  return resp.status === 'error'
}

function handle(resp: ApiResponse) {
  if (isErrorResponse(resp)) {
    // TypeScript knows: resp is ErrorResponse
    console.log(resp.error.message)
  } else {
    // TypeScript knows: resp is SuccessResponse
    console.log(resp.data.name)
  }
}
```

### Built-in type guards

- ✅ `typeof x === 'string'`
- ✅ `x instanceof Error`
- ✅ `'key' in obj`
- ✅ User-defined: `(x): x is Type => boolean`

## 🌿 Discriminated Unions

When all variants of a union share a common discriminant field, TypeScript can automatically narrow the type:

```typescript
interface ClickEvent {
  type: 'click'
  x: number; y: number
}

interface SubmitEvent {
  type: 'submit'
  formId: string
}

type AppEvent = ClickEvent | SubmitEvent

function handle(event: AppEvent) {
  switch (event.type) {
    case 'click':
      // TS knows: event is ClickEvent
      console.log(event.x, event.y)
      break
    case 'submit':
      // TS knows: event is SubmitEvent
      console.log(event.formId)
      break
    default:
      // Exhaustive check — TS error if we forgot a variant
      const _never: never = event
      return _never
  }
}
```

### 🔥 Exhaustive Check via never

The pattern `const _: never = value` in `default` guarantees that when a new variant is added to the union, the compiler will show an error if you forgot to handle it.

> ⚠️ **Important:** Exhaustive check is one of the most powerful TypeScript tools. Use it in every `switch` over a discriminated union.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Forgetting `as Type` when creating branded types

❌ **Bad** — without an explicit cast, TypeScript will not allow assigning a `string` to `Email`:
```typescript
function createEmail(value: string): Email {
  return value // TS Error!
}
```

✅ **Good** — use `as` only inside the constructor:
```typescript
function createEmail(value: string): Email {
  if (!isValidEmail(value)) throw new Error('Invalid email')
  return value as Email
}
```

### 🐛 2. Type guard without `is`

❌ **Bad** — the function returns `boolean` but does not narrow the type:
```typescript
function isError(resp: ApiResponse) {
  return resp.status === 'error'
}
```

✅ **Good** — the predicate `resp is ErrorResponse` enables type narrowing:
```typescript
function isError(resp: ApiResponse): resp is ErrorResponse {
  return resp.status === 'error'
}
```

### 🐛 3. Forgetting the exhaustive check

❌ **Bad** — adding a new variant to the union will not cause a compile error:
```typescript
switch (event.type) {
  case 'click': /* ... */ break
  case 'submit': /* ... */ break
  // No default — a new variant will go unnoticed
}
```

✅ **Good** — `never` in default catches the missed variant:
```typescript
switch (event.type) {
  case 'click': /* ... */ break
  case 'submit': /* ... */ break
  default:
    const _never: never = event
    return _never
}
```

### 🐛 4. Mutating branded values

❌ **Bad** — a branded type does not protect against changing the value after creation.

✅ **Good** — use `readonly` wherever possible.

## 📌 Summary

- ✅ **Branded Types** — make primitive types unique, preventing mix-ups
- ✅ **Type Guards** — narrow types in conditional blocks, granting access to the right fields
- ✅ **Discriminated Unions** — automatic type narrowing via a discriminant field
- 🔥 **Exhaustive Check** — compile-time guarantee that all variants are handled
- 💡 These patterns are the foundation for all subsequent levels of the course
