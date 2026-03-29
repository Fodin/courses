# Task 3.3: Scoped Dependencies

## 🎯 Goal

Implement a DI container with three lifetime strategies: singleton, transient, and scoped, with child scope support.

## Requirements

1. Create a `ScopedContainer` class with registration methods for each lifetime
2. `registerSingleton()` — one instance for the entire application
3. `registerTransient()` — new instance on every resolve
4. `registerScoped()` — one instance within a scope
5. `createScope()` — create child scope
6. Singletons should be shared across scopes (stored in root)
7. Demonstrate all three strategies with numeric IDs for tracking

## Checklist

- [ ] Singleton: same instance on repeated resolves
- [ ] Transient: different instances on every resolve
- [ ] Scoped: same instance within scope, different across scopes
- [ ] Singleton shared between root and child scopes
- [ ] createScope() inherits parent registrations

## How to Verify

Create 2 scopes and check: scoped service is the same within one scope but different across scopes. Singleton is the same everywhere. Transient is always new.
