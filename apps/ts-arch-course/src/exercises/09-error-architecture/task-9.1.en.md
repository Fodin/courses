# Task 9.1: Error Hierarchy

## 🎯 Goal

Create a type-safe error hierarchy based on discriminated unions with exhaustive handling via switch.

## Requirements

1. Create a `BaseAppError` base interface with `_tag` (discriminant), `message`, `timestamp` fields
2. Create at least 5 specific error types extending `BaseAppError`, each with its own specific fields:
   - `ValidationError` — `field`, `rule`
   - `NetworkError` — `url`, `statusCode`
   - `NotFoundError` — `resource`, `id`
   - `AuthorizationError` — `requiredRole`, `currentRole`
   - `RateLimitError` — `retryAfterMs`
3. Create a union type `AppError` from all specific types
4. Implement a `formatError(error: AppError)` function with exhaustive switch
5. Implement an `isRetryable(error: AppError)` function for determining retryable errors

## Checklist

- [ ] Each error type has a unique `_tag` string literal
- [ ] `formatError` uses exhaustive switch (all branches covered)
- [ ] In each switch branch, TypeScript narrows the type to the specific error
- [ ] `isRetryable` determines retryability based on `_tag`
- [ ] Factory function `createError` adds timestamp automatically
- [ ] Adding a new error type causes compile errors in switch statements

## How to Verify

Create instances of each error type and pass to `formatError`. Verify that TypeScript narrows types in switch. Try adding a new error type to the union — the compiler should point to incomplete switch statements.
