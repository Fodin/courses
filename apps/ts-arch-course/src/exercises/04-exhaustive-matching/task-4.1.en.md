# Task 4.1: Match Expression

## Goal

Build a type-safe `match()` utility that guarantees handling of all string union type variants at compile time.

## Requirements

1. Implement a function `match<T extends string>(value: T)` returning an object with a `with(handlers)` method
2. The `handlers` type must be a mapped type `{ [K in T]: (value: K) => R }`, guaranteeing a handler for every variant
3. Implement `matchTagged<T extends { kind: string }>(value: T)` for working with tagged unions
4. In `matchTagged`, use `Extract<T, { kind: K }>` for type-safe narrowing in each handler
5. Demonstrate with HTTP methods (`GET | POST | PUT | DELETE | PATCH`) and geometric shapes

## Checklist

- [ ] `match()` accepts a string literal type and returns a builder with `with` method
- [ ] `with()` requires a handler for every variant — missing one causes a compilation error
- [ ] `matchTagged()` works with objects that have a `kind` discriminator field
- [ ] In `matchTagged` handlers, variant-specific fields are accessible (radius for circle, etc.)
- [ ] Both match expressions return a value (expression, not statement)
- [ ] Component displays results of both match versions

## How to Verify

1. Try removing one handler from `with()` — a compilation error should appear
2. In the `matchTagged` handler for `circle`, verify TypeScript knows about `radius`
3. Ensure `match` returns a typed result, not `any`
