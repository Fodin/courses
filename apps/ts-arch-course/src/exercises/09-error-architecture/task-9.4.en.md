# Task 9.4: Recovery Strategies

## 🎯 Goal

Implement type-safe error recovery strategies: retry with configuration, fallback with dual error type, and circuit breaker with state.

## Requirements

1. Implement `retry<T, E>(operation, config)`:
   - Returns `Result<T, E & { attempts: number }>`
   - Configuration: `maxAttempts`, `delayMs`
   - On success returns the result, on exhausted attempts returns error with attempt count
2. Implement `withFallback<T, E1, E2>(primary, fallback)`:
   - Returns `Result<T, { primary: E1; fallback: E2 }>`
   - Tries primary first, on error tries fallback
   - If both fail — returns both errors
3. Implement `createCircuitBreaker<T, E>(config)`:
   - States: closed -> open -> half-open
   - When failure threshold exceeded — circuit opens
   - Returns `Result<T, E | { circuitOpen: true; resetIn: number }>`

## Checklist

- [ ] `retry` returns `Result<T, E & { attempts: number }>`
- [ ] `withFallback` returns `Result<T, { primary: E1; fallback: E2 }>`
- [ ] Circuit breaker transitions to open after `failureThreshold` failures
- [ ] In open state, circuit breaker returns `{ circuitOpen: true }`
- [ ] After `resetTimeMs`, circuit breaker transitions to half-open
- [ ] All strategies are type-safe — errors are extended, not lost

## How to Verify

Test each strategy: retry with an operation that succeeds on the 3rd attempt; fallback where primary fails; circuit breaker with a series of failures. Verify that error types are correctly extended.
