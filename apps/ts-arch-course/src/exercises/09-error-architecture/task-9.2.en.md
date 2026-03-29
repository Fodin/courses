# Task 9.2: Error Boundaries

## 🎯 Goal

Implement the Error Boundary pattern for isolating error domains — each application layer has its own typed boundary that converts `unknown` into a specific error type.

## Requirements

1. Create a `Result<T, E>` type as a discriminated union (`ok: true | false`)
2. Implement helper functions `ok(value)` and `err(error)`
3. Create a `BoundaryConfig<E>` interface with `name`, `catch: (error: unknown) => E`, `onError?` fields
4. Implement `createBoundary(config)` with a `run<T>(fn): Result<T, E>` method:
   - Calls fn in try/catch
   - Maps unknown error through config.catch
   - Returns Result
5. Create at least 2 different boundaries: domain (DomainError) and infra (InfraError)

## Checklist

- [ ] `Result<T, E>` is a discriminated union with `ok` as the discriminant
- [ ] `ok()` returns `Result<T, never>`, `err()` returns `Result<never, E>`
- [ ] `createBoundary` converts `unknown` into a typed error `E`
- [ ] `domainBoundary.run()` returns `Result<T, DomainError>`
- [ ] `infraBoundary.run()` returns `Result<T, InfraError>`
- [ ] `onError` is called on error for logging

## How to Verify

Wrap functions that throw different exceptions in boundaries. Verify that the boundary always returns Result with the correct error type. Check that errors from different boundaries have different types.
