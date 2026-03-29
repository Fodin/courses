# Task 11.1: Exact Types

## Goal

Implement `Exact<T, Shape>` that prevents excess properties in objects, and demonstrate the excess properties problem in TypeScript.

## Requirements

1. Demonstrate the problem: show how indirect assignment allows excess properties
2. Implement `Exact<T, Shape>` via `Exclude<keyof T, keyof Shape> extends never`
3. Implement `applyConfig<T>` that only accepts an exact shape match
4. Implement `DeepExact<T, Shape>` for nested objects
5. Show practical examples: API contracts, configurations

## Checklist

- [ ] Excess property problem with indirect assignment is demonstrated
- [ ] `Exact<T, Shape>` correctly rejects objects with excess properties
- [ ] `applyConfig` accepts exact matches
- [ ] `applyConfig` rejects objects with extra fields (compile-time)
- [ ] Practical use-cases are listed

## How to Verify

1. Create an object with an extra field and pass to `applyConfig` — should error
2. Create an object with exact shape — should pass
3. Try DeepExact with a nested extra field
