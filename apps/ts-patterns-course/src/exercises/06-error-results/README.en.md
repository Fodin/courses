# 🛡️ Level 6: Result Handling

## 📖 Introduction

In most JS/TS projects, errors are handled through `try/catch` and `throw`. But this approach has a serious drawback: **the compiler doesn't know whether a function can throw**, and if it can — what type it throws.

```typescript
// What errors can fetchUser throw? TS doesn't know
function fetchUser(id: string): User {
  // throw new NetworkError(...)
  // throw new NotFoundError(...)
  // throw new ValidationError(...)
}
```

The **Result**, **Validation**, and **Option** patterns solve this problem by encoding the possibility of an error or absent value **directly in the type**.

## ✅ Result / Either

Result (also known as Either) is a type that represents **either success or failure**:

```typescript
type Result<T, E> = Ok<T> | Err<E>

class Ok<T> {
  readonly _tag = 'ok'
  constructor(readonly value: T) {}
}

class Err<E> {
  readonly _tag = 'err'
  constructor(readonly error: E) {}
}
```

### 🎯 Why Result

```typescript
// ❌ Bad: implicit error
function parseAge(input: string): number {
  const n = parseInt(input, 10)
  if (isNaN(n)) throw new Error('Not a number')
  if (n < 0 || n > 150) throw new Error('Out of range')
  return n
}

// ✅ Good: error in the type
function parseAge(input: string): Result<number, string> {
  const n = parseInt(input, 10)
  if (isNaN(n)) return err('Not a number')
  if (n < 0 || n > 150) return err('Out of range')
  return ok(n)
}
```

> 🔥 **Key point:** With Result the compiler **forces** you to handle the error. Forgetting `try/catch` is easy; forgetting to handle `Err` is impossible.

### Operations on Result

```typescript
// map — transforms the value inside Ok
ok(5).map(x => x * 2)         // Ok(10)
err('fail').map(x => x * 2)   // Err('fail')

// flatMap — chains operations, each of which can return an error
ok('42')
  .flatMap(parseAge)
  .flatMap(validateRange)      // Result<number, string>

// match — handles both cases
result.match({
  ok: value => `Success: ${value}`,
  err: error => `Error: ${error}`,
})

// fromThrowable — wraps a function that can throw
const safeParse = fromThrowable(JSON.parse)
safeParse('{"a":1}')  // Ok({a: 1})
safeParse('invalid')   // Err(SyntaxError)
```

## 📋 Validation

Validation is similar to Result, but with a key difference: when combining, it **collects ALL errors** instead of stopping at the first one.

```typescript
// ❌ Result: stops at the first error
validateName('')
  .flatMap(() => validateEmail('bad'))
  .flatMap(() => validateAge(-1))
// Err('Name is required') — the remaining errors are lost

// ✅ Validation: collects all
const result = combine({
  name: validateName(''),
  email: validateEmail('bad'),
  age: validateAge(-1),
})
// Err(['Name is required', 'Invalid email', 'Age must be positive'])
```

### Accumulate

```typescript
type Validation<E, A> = Valid<A> | Invalid<E[]>

function combine<T extends Record<string, Validation<E, unknown>>>(
  validations: T
): Validation<E, { [K in keyof T]: /* extracted value */ }>
```

> 💡 **Tip:** Use Validation for forms and any situation where the user should see **all** errors at once, not one by one.

## 🎭 Option / Maybe

Option represents the **presence or absence** of a value, replacing `null | undefined`:

```typescript
type Option<T> = Some<T> | None

class Some<T> {
  readonly _tag = 'some'
  constructor(readonly value: T) {}
}

class None {
  readonly _tag = 'none'
}
```

### 🎯 Why Option

```typescript
// ❌ Bad: nested null checks
const street = user?.address?.street
if (street !== undefined && street !== null) {
  console.log(street.toUpperCase())
}

// ✅ Good: Option chain
fromNullable(user)
  .flatMap(u => fromNullable(u.address))
  .flatMap(a => fromNullable(a.street))
  .map(s => s.toUpperCase())
  .getOrElse('Unknown')
```

### Operations

```typescript
some(5).map(x => x * 2)           // Some(10)
none.map(x => x * 2)              // None

some(5).getOrElse(0)               // 5
none.getOrElse(0)                  // 0

some(5).flatMap(x => x > 3 ? some(x) : none)  // Some(5)
some(1).flatMap(x => x > 3 ? some(x) : none)  // None
```

## ⚠️ Common Beginner Mistakes

### 🐛 1. Using Result but checking via `if (result.value)`

```typescript
// ❌ Bad: loses type safety
const result = parseAge('abc')
if (result.value) { /* value could be 0 — falsy! */ }
```

✅ **Good** — check `_tag`:
```typescript
if (result._tag === 'ok') {
  console.log(result.value)
}
// Or use match
result.match({
  ok: v => console.log(v),
  err: e => console.error(e),
})
```

### 🐛 2. Using flatMap instead of map (or vice versa)

```typescript
// ❌ Bad: map returns Result<Result<...>>
ok(5).map(x => ok(x * 2))  // Ok(Ok(10)) — nested Result!
```

✅ **Good** — flatMap unwraps the nesting:
```typescript
ok(5).flatMap(x => ok(x * 2))  // Ok(10)
```

> 💡 **Tip:** `map` for pure functions (`T → U`), `flatMap` for Result-returning functions (`T → Result<U, E>`).

### 🐛 3. Using Result instead of Validation for forms

```typescript
// ❌ Bad: user sees errors one at a time
const result = validateName(name)
  .flatMap(() => validateEmail(email))  // won't run if name is invalid
```

✅ **Good** — show all errors at once:
```typescript
const result = combine({
  name: validateName(name),
  email: validateEmail(email),
})
```

### 🐛 4. Using Option instead of Result for expected errors

```typescript
// ❌ Bad: lost information about the error
function findUser(id: string): Option<User> { /* ... */ }
// Not found? But why — doesn't exist, no permissions, network error?
```

✅ **Good** — Result preserves the reason:
```typescript
function findUser(id: string): Result<User, 'not_found' | 'forbidden' | 'network_error'>
```

## 💡 Best Practices

- 📌 **Result** — for operations that can **meaningfully fail**
- 📌 **Validation** — for **form validation** and any situation where all errors need to be collected
- 📌 **Option** — for **absent values** when the reason doesn't matter
- 💡 Use `fromThrowable` to wrap legacy code that uses throw
- 🔥 `map`/`flatMap` chains replace nested `if/else` and `try/catch`
