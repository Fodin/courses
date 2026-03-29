# Task 3.2: Injection Tokens

## 🎯 Goal

Implement a type-safe token system for service registration and retrieval, replacing string keys.

## Requirements

1. Create an `InjectionToken<T>` class with phantom type and description
2. Implement `TokenContainer` with `provide(token, factory)` and `inject(token)` methods
3. The token should determine the return type of `inject()`
4. Support tokens for primitive types (string, number) and interfaces
5. Create a `TOKENS` object with at least 6 tokens of different types
6. Demonstrate inter-service dependencies via inject inside factory

## Checklist

- [ ] `container.inject(TOKENS.Logger)` returns `Logger` (not unknown)
- [ ] `container.inject(TOKENS.ApiBaseUrl)` returns `string`
- [ ] Different tokens with same description are different objects (no collisions)
- [ ] `hasProvider()` correctly checks provider existence
- [ ] Factory can use `container.inject()` for dependencies

## How to Verify

Check that `inject(TOKENS.Logger).apiUrl` causes an error (no apiUrl on Logger). Verify that primitive tokens return correct types.
