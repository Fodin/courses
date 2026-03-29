# Task 3.1: DI Container

## 🎯 Goal

Implement a type-safe DI container where `resolve()` automatically infers the service type from the accumulated generic parameter.

## Requirements

1. Create a `Container<TRegistry>` class with `register()` and `resolve()` methods
2. `register()` takes a service name, factory function, and returns an extended container
3. The factory function receives the container as argument for accessing other services
4. `resolve()` returns a typed service instance (singleton)
5. Register at least 4 services with dependencies on each other
6. Add a `has()` method for checking service existence

## Checklist

- [ ] `container.resolve('config')` returns typed Config
- [ ] `container.resolve('unknown')` — compile error
- [ ] Factory can use `c.resolve()` to access dependencies
- [ ] Repeated `resolve()` returns the same instance (singleton)
- [ ] Generic parameter accumulates with each `register()`

## How to Verify

Check autocomplete after `container.resolve('config').` — only Config fields should be available. Try resolving a non-existent service.
