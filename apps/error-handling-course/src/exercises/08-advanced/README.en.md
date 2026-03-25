# 🔥 Level 8: Advanced Patterns

## Introduction

At this level, we combine all learned techniques: functional approach to errors, testing errors, and creating a complete application with comprehensive error handling.

🎯 **Level Goal:** master the Result pattern for functional error handling, learn to test errors, and gather all course knowledge in a final project.

## 🔥 Functional Error Handling

### Operations on Result

```typescript
type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }

// Transform value
function map<T, U, E>(result: Result<T, E>, fn: (v: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result
}

// Chain Result operations
function flatMap<T, U, E>(result: Result<T, E>, fn: (v: T) => Result<U, E>): Result<U, E> {
  return result.ok ? fn(result.value) : result
}

// Transform error
function mapError<T, E, F>(result: Result<T, E>, fn: (e: E) => F): Result<T, F> {
  return result.ok ? result : err(fn(result.error))
}

// Default value
function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}
```

💡 **Tip:** `map` is similar to `Array.map` — it transforms the value inside the container without changing the structure. `flatMap` does the same, but the function itself returns a `Result`, which allows you to build chains without nesting.

### Pipeline

```typescript
const result = flatMap(
  flatMap(
    safeParseNumber(input),
    validatePositive
  ),
  safeSqrt
)

const output = map(result, v => `Answer: ${v.toFixed(2)}`)
const text = unwrapOr(output, 'Calculation error')
```

## 🔥 Testing Errors

### 🎯 What to Test

1. **Function throws error** on invalid data
2. **Error type** matches expectation
3. **Error message** contains needed information
4. **Function does NOT throw** on valid data

### Pattern for Testing throw

```typescript
function expectToThrow(fn: () => void, ErrorType?: new (...args: any[]) => Error) {
  try {
    fn()
    throw new Error('Expected function to throw')
  } catch (e) {
    if (e.message === 'Expected function to throw') throw e
    if (ErrorType && !(e instanceof ErrorType)) {
      throw new Error(`Expected ${ErrorType.name}, got ${e.constructor.name}`)
    }
  }
}

// Usage
expectToThrow(() => divideByZero(10, 0))
expectToThrow(() => validateAge(-1), RangeError)
```

### Testing Async Errors

```typescript
async function expectAsyncToThrow(fn: () => Promise<unknown>) {
  try {
    await fn()
    throw new Error('Expected promise to reject')
  } catch (e) {
    if (e.message === 'Expected promise to reject') throw e
    return e // Return for further checks
  }
}
```

## 🎯 Final Project: Todo with Error Handling

Combining all techniques:

- ✅ **Custom errors** (AppError with code)
- ✅ **API handling** (simulateTodoApi)
- ✅ **Loading states** (loading/error)
- ✅ **UI errors** (role="alert", inline)
- ✅ **Retry** (retry on server error)
- ✅ **Validation** (empty text)
- ✅ **Graceful degradation** (app continues working on error)

## ⚠️ Common Beginner Mistakes

### 1. ❌ Using try/catch Instead of Result for Expected Errors

```typescript
// ❌ Bad — throw for business logic
function parseAge(input: string): number {
  const n = Number(input)
  if (isNaN(n)) throw new Error('Not a number')
  if (n < 0) throw new Error('Negative age')
  return n
}

// Calling code must remember try/catch, otherwise app crashes
const age = parseAge(userInput) // 🐛 May throw, but nothing suggests it
```

**Why this is an error:** Using `throw` for expected situations (invalid input) makes errors invisible at the type level. Calling code doesn't know the function can throw — TypeScript compiler won't warn about missing catch. `Result` makes error possibility explicit.

```typescript
// ✅ Good — Result makes error explicit in types
function parseAge(input: string): Result<number, string> {
  const n = Number(input)
  if (isNaN(n)) return err('Not a number')
  if (n < 0) return err('Negative age')
  return ok(n)
}

// Calling code MUST handle both cases
const result = parseAge(userInput)
if (!result.ok) {
  showError(result.error)
}
```

### 2. ❌ Forgetting to Check Marker in expectToThrow

```typescript
// ❌ Bad — if function doesn't throw, test passes silently
function expectToThrow(fn: () => void) {
  try {
    fn()
  } catch (e) {
    return // Error caught — test passed
  }
}

expectToThrow(() => safeFunction()) // 🐛 Test "passed", but function didn't throw!
```

**Why this is an error:** Without a marker error, `expectToThrow` can't distinguish between "function threw expected error" and "function ran without error". The test will be green in both cases — a useless test.

```typescript
// ✅ Good — marker guarantees test fails if function doesn't throw
function expectToThrow(fn: () => void) {
  try {
    fn()
    throw new Error('Expected function to throw') // Marker
  } catch (e) {
    if (e.message === 'Expected function to throw') throw e // Re-throw marker
    // Otherwise — caught expected error, test passed
  }
}
```

### 3. ❌ Nested flatMap Without Intermediate Variables

```typescript
// ❌ Bad — unreadable nesting
const result = flatMap(
  flatMap(
    flatMap(
      flatMap(
        safeParseNumber(input),
        validatePositive
      ),
      safeSqrt
    ),
    formatNumber
  ),
  saveToDatabase
)
```

**Why this is an error:** Deep `flatMap` nesting makes code hard to read and debug. It's unclear at which stage the error occurred, and it's difficult to insert intermediate logging.

```typescript
// ✅ Good — intermediate variables with clear names
const parsed = safeParseNumber(input)
const validated = flatMap(parsed, validatePositive)
const calculated = flatMap(validated, safeSqrt)
const formatted = flatMap(calculated, formatNumber)
const saved = flatMap(formatted, saveToDatabase)
```

### 4. ❌ Not Testing "Happy Path" Along with Errors

```typescript
// ❌ Bad — only testing error cases
expectToThrow(() => divide(10, 0))
expectToThrow(() => divide(0, 0))
// But what if divide(10, 2) also throws? We won't know!
```

**Why this is an error:** If you only test error cases, you can miss the situation where a function throws error on valid data too. The bug will go unnoticed.

```typescript
// ✅ Good — test both errors and normal operation
// Error cases
expectToThrow(() => divide(10, 0))

// Happy path — should NOT throw
const result = divide(10, 2)
assert(result === 5)
```

## 📌 Course Summary

You have learned:

1. 🔥 **Basics** — try/catch/finally, throw, Error object
2. 🔥 **Error Types** — built-in, custom, hierarchy, type guards
3. 🔥 **Asynchronicity** — Promises, async/await, retry
4. 🔥 **TypeScript** — Result type, discriminated unions, exhaustive handling
5. 🔥 **React** — Error Boundaries, fallback UI, recovery
6. 🔥 **Data Fetching** — fetch errors, API errors, loading states
7. 🔥 **Forms** — validation, server errors, a11y
8. 🔥 **Global Handling** — window.onerror, logging, monitoring
9. 🔥 **Advanced Patterns** — functional approach, testing
