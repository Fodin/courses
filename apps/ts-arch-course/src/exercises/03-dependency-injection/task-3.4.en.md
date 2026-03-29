# Task 3.4: Auto-Wiring

## 🎯 Goal

Implement automatic dependency resolution: when resolving a service, the container recursively resolves all its dependencies, detecting cycles.

## Requirements

1. Create `AutoWireContainer` with `register(name, dependencies, factory)` method
2. dependencies is an array of dependency names that will be passed to the factory
3. `resolve()` recursively resolves all dependencies before creating the service
4. Implement circular dependency detection with informative error messages
5. Add `getResolutionOrder()` — the order in which dependencies will be resolved
6. Add `getDependencyGraph()` — graph of all dependencies
7. Register at least 6 services with dependency depth >= 3

## Checklist

- [ ] Dependencies are automatically resolved recursively
- [ ] Circular dependencies are detected with cycle path in error
- [ ] `getResolutionOrder()` returns correct topological order
- [ ] Each service is created only once (caching)
- [ ] Dependency graph shows all connections

## How to Verify

Create a circular dependency (A -> B -> C -> A) and verify the error contains the full path. Check resolution order — dependencies should precede services depending on them.
