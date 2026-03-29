# Level 9: Error Architecture

## 🎯 Level Goal

Learn to design type-safe error handling systems: error hierarchies with discriminated unions, error domain isolation through boundaries, typed error propagation through Result chains, and recovery patterns (retry, fallback, circuit breaker).

---

## The Problem: Chaotic Error Handling

In a typical project, errors are handled haphazardly:

```typescript
// ❌ Untyped errors
try {
  const user = await fetchUser(id)
  const orders = await fetchOrders(user.id)
  return processOrders(orders)
} catch (error) {
  // error: unknown — what is it? Network? Validation? 404?
  console.error(error) // Hope for the best
  throw error          // Rethrow and forget
}
```

Problems:
- `catch` receives `unknown` — impossible to handle a specific error type
- No distinction between network error, validation error, and 404
- Recovery strategy isn't tied to error type
- Errors from different layers mix together

---

## Pattern 1: Error Hierarchy via Discriminated Unions

Instead of class inheritance, we use tagged unions:

```typescript
interface BaseAppError {
  readonly _tag: string
  readonly message: string
  readonly timestamp: number
}

interface ValidationError extends BaseAppError {
  readonly _tag: 'ValidationError'
  readonly field: string
  readonly rule: string
}

interface NetworkError extends BaseAppError {
  readonly _tag: 'NetworkError'
  readonly url: string
  readonly statusCode: number
}

interface NotFoundError extends BaseAppError {
  readonly _tag: 'NotFoundError'
  readonly resource: string
  readonly id: string
}

// Union type — all possible errors
type AppError = ValidationError | NetworkError | NotFoundError
```

### Exhaustive Handling

```typescript
function handleError(error: AppError): string {
  switch (error._tag) {
    case 'ValidationError':
      return `Field "${error.field}" failed: ${error.rule}`
      //                ^^^^^^^^^ accessible only for ValidationError
    case 'NetworkError':
      return `HTTP ${error.statusCode} for ${error.url}`
    case 'NotFoundError':
      return `${error.resource} #${error.id} not found`
    // If a new error type is added, TypeScript will require handling here
  }
}
```

💡 **Key idea**: `_tag` is the discriminant. TypeScript narrows the type in each switch branch, giving access to specific fields. When a new error type is added, the compiler points to all places where it needs to be handled.

---

## Pattern 2: Error Boundaries

A boundary isolates the error domain — each layer has its own error type:

```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E }

interface BoundaryConfig<E> {
  name: string
  catch: (error: unknown) => E  // unknown -> typed error
  onError?: (error: E) => void  // Optional logging
}

function createBoundary<E>(config: BoundaryConfig<E>) {
  return {
    run<T>(fn: () => T): Result<T, E> {
      try {
        return { ok: true, value: fn() }
      } catch (error) {
        const mapped = config.catch(error)
        config.onError?.(mapped)
        return { ok: false, error: mapped }
      }
    },
  }
}
```

### Different Boundaries for Different Layers

```typescript
// Domain boundary: unknown -> DomainError
const domainBoundary = createBoundary<DomainError>({
  name: 'domain',
  catch: (error) => ({
    code: 'DOMAIN_ERROR',
    message: error instanceof Error ? error.message : String(error),
  }),
})

// Infrastructure boundary: unknown -> InfraError
const infraBoundary = createBoundary<InfraError>({
  name: 'infra',
  catch: (error) => ({
    service: 'database',
    operation: 'query',
    cause: String(error),
  }),
})

// Each boundary returns its own error type
const domainResult = domainBoundary.run(() => riskyOperation())
// Result<T, DomainError>

const infraResult = infraBoundary.run(() => dbQuery())
// Result<T, InfraError>
```

📌 **Important**: a boundary is the point where `unknown` becomes a concrete type. Inside the boundary errors are typed, outside it's always `Result<T, E>`.

---

## Pattern 3: Error Propagation via Result Chains

Result with `map`, `flatMap`, `mapError` methods for type-safe propagation:

```typescript
function okChain<T>(value: T): ResultChain<T, never> {
  return {
    ok: true, value,
    map(fn) { return okChain(fn(value)) },
    flatMap(fn) { return fn(value) },
    mapError() { return this },
    unwrapOr() { return value },
    match(h) { return h.ok(value) },
  }
}

function errChain<E>(error: E): ResultChain<never, E> {
  return {
    ok: false, error,
    map() { return this },           // Skip — error
    flatMap() { return this },       // Skip — error
    mapError(fn) { return errChain(fn(error)) },
    unwrapOr(fallback) { return fallback },
    match(h) { return h.err(error) },
  }
}
```

### Chain with Accumulating Error Types

```typescript
const result = parseEmail(input)          // ResultChain<string, ParseError>
  .flatMap(validateEmail)                  // ResultChain<string, ParseError | ValidationError>
  .flatMap(saveUser)                       // ResultChain<User, ParseError | ValidationError | SaveError>
  .map(user => `Created: ${user.email}`)   // ResultChain<string, ParseError | ValidationError | SaveError>

result.match({
  ok: (msg) => showSuccess(msg),
  err: (error) => {
    // error: ParseError | ValidationError | SaveError
    switch (error._tag) { /* exhaustive */ }
  },
})
```

🔥 **Key point**: `flatMap` **accumulates** error types through union. TypeScript knows exactly which errors can occur in the chain.

---

## Pattern 4: Recovery Strategies

### Retry

```typescript
function retry<T, E>(
  operation: () => Result<T, E>,
  config: { maxAttempts: number; delayMs: number }
): Result<T, E & { attempts: number }> {
  let lastError: E | undefined
  for (let i = 1; i <= config.maxAttempts; i++) {
    const result = operation()
    if (result.ok) return result
    lastError = result.error
  }
  return err({ ...lastError!, attempts: config.maxAttempts })
}
```

### Fallback

```typescript
function withFallback<T, E1, E2>(
  primary: () => Result<T, E1>,
  fallback: () => Result<T, E2>
): Result<T, { primary: E1; fallback: E2 }> {
  const result = primary()
  if (result.ok) return result
  const fallbackResult = fallback()
  if (fallbackResult.ok) return fallbackResult
  return err({ primary: result.error, fallback: fallbackResult.error })
}
```

### Circuit Breaker

```typescript
function createCircuitBreaker<T, E>(config: {
  failureThreshold: number
  resetTimeMs: number
}) {
  const state = { failures: 0, state: 'closed', lastFailureTime: 0 }

  return {
    execute(op: () => Result<T, E>): Result<T, E | { circuitOpen: true }> {
      if (state.state === 'open') {
        const elapsed = Date.now() - state.lastFailureTime
        if (elapsed < config.resetTimeMs) {
          return err({ circuitOpen: true })
        }
        state.state = 'half-open'
      }
      const result = op()
      if (result.ok) { state.failures = 0; state.state = 'closed' }
      else {
        state.failures++
        state.lastFailureTime = Date.now()
        if (state.failures >= config.failureThreshold) state.state = 'open'
      }
      return result
    },
  }
}
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: catch (error: Error) Instead of unknown

```typescript
// ❌ error might not be an Error
try { ... } catch (error: Error) { // TypeScript won't allow this!
  // In JS you can throw anything: throw "string", throw 42
}

// ✅ Always unknown, then type guard
try { ... } catch (error: unknown) {
  if (error instanceof Error) { /* Error */ }
  else { /* other type */ }
}
```

### Mistake 2: Mixing Errors from Different Layers

```typescript
// ❌ One catch for all layers
try {
  validate(data)      // ValidationError
  await db.save(data) // DatabaseError
  await notify(data)  // NotificationError
} catch (error) {
  // What type is this? Impossible to determine
}

// ✅ Each layer isolated through boundary
const validated = domainBoundary.run(() => validate(data))
const saved = infraBoundary.run(() => db.save(data))
```

### Mistake 3: throw Inside Result Chains

```typescript
// ❌ throw breaks the Result chain
function processData(input: string): ResultChain<Data, ProcessError> {
  if (!input) throw new Error('Empty input') // Exits Result!
  return okChain(parse(input))
}

// ✅ Use errChain instead of throw
function processData(input: string): ResultChain<Data, ProcessError> {
  if (!input) return errChain({ _tag: 'ProcessError', reason: 'Empty input' })
  return okChain(parse(input))
}
```

### Mistake 4: Retry Without Condition

```typescript
// ❌ Retry for all errors — pointless for ValidationError
retry(() => validateAndSave(data), { maxAttempts: 5 })

// ✅ Retry only for retryable errors
const result = validateAndSave(data)
if (!result.ok && isRetryable(result.error)) {
  return retry(() => save(data), { maxAttempts: 3 })
}
```

---

## 💡 Best Practices

1. **Discriminated unions** instead of error classes — `_tag` enables exhaustive checking
2. **Error boundaries** at each layer — domain, infra, presentation
3. **Result chains** instead of try/catch — error types accumulate and are checked
4. **Retry only for retryable** — network errors yes, validation no
5. **Circuit breaker for external services** — prevents cascading failures
6. **mapError for normalization** — bring errors to a unified format at layer boundaries

---

## 📌 Summary

| Pattern | When to Use | Key Features |
|---------|------------|--------------|
| Error Hierarchy | Error classification | Exhaustive switch, specific fields |
| Error Boundaries | Layer isolation | unknown -> typed error |
| Result Chains | Error propagation | map/flatMap, type accumulation |
| Recovery Strategies | Failure recovery | retry, fallback, circuit breaker |
