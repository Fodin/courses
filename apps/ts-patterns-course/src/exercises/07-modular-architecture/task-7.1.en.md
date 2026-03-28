# Task 7.1: Dependency Injection

## Objective

Implement a type-safe DI container with `Token<T>` and support for Singleton and Transient lifecycles.

## Requirements

1. Create a `Token<T>` class with a `name: string` field for identifying a dependency
2. Create a `Container` class with methods:
   - `register<T>(token: Token<T>, factory: () => T)` — Transient (new instance every time)
   - `registerSingleton<T>(token: Token<T>, factory: () => T)` — Singleton (one instance)
   - `resolve<T>(token: Token<T>): T` — retrieve a dependency by token
3. Resolving an unknown token should throw an Error
4. Create `Logger` and `Database` interfaces with methods
5. Register implementations and demonstrate:
   - Transient: each resolve returns a new instance
   - Singleton: each resolve returns the same instance
   - An error when resolving an unregistered token

## Checklist

- [ ] `Token<T>` class with type parameter
- [ ] `register` stores the factory
- [ ] `registerSingleton` caches the first call
- [ ] `resolve` returns a typed result
- [ ] Error thrown when no binding exists
- [ ] Transient vs Singleton demo

## How to Verify

- Click the button — a demo should be displayed
- Transient: two resolves produce different instance ids
- Singleton: two resolves produce the same id
- Unregistered token triggers an error
