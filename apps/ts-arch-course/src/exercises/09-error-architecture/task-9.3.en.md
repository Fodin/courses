# Task 9.3: Error Propagation

## 🎯 Goal

Implement a Result chain with `map`, `flatMap`, `mapError`, `unwrapOr`, `match` methods for type-safe error propagation through application layers.

## Requirements

1. Create a `ResultChain<T, E>` type with methods: `map`, `flatMap`, `mapError`, `unwrapOr`, `match`
2. Implement constructors `okChain(value)` and `errChain(error)`
3. `map` transforms the value, skips errors
4. `flatMap` chains operations, **accumulating** error types through union
5. `mapError` transforms the error type
6. `unwrapOr` returns the value or a fallback
7. `match` executes one of two functions: ok or err
8. Create a chain of 3 operations with different error types

## Checklist

- [ ] `okChain(42).map(x => x * 2)` returns `ResultChain<number, never>`
- [ ] `errChain(e).map(fn)` skips fn, returning the error
- [ ] `flatMap` unions error types: `ResultChain<T, E1 | E2>`
- [ ] `mapError` changes error type without affecting the value
- [ ] `unwrapOr` returns fallback on error
- [ ] `match` handles both variants with type inference

## How to Verify

Create a chain `parseEmail -> validateEmail -> saveUser` where each function can return its own error type. Verify that TypeScript knows all possible error types in the final `match`.
