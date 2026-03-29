# Task 12.1: Higher-Kinded Types

## Goal

Implement a simulation of higher-kinded types (HKTs) in TypeScript using the defunctionalization pattern via a URI registry, and write generic functions that work with any functor.

## Requirements

1. Create a `URItoKind<A>` interface — a registry mapping URI strings to type constructors (Array, Option, Promise, Identity)
2. Implement `URIS` and `Kind<F, A>` types for registry lookups
3. Implement the `Functor<F extends URIS>` interface with a `map` method
4. Implement concrete functors: `arrayFunctor`, `optionFunctor`, `identityFunctor`
5. Write generic functions `doubleAll` and `stringify` that work with any functor
6. Show that the same generic function works with Array, Option, and Identity

## Checklist

- [ ] `Kind<"Array", number>` = `number[]`
- [ ] `Kind<"Option", string>` = `string | null`
- [ ] `arrayFunctor.map([1, 2, 3], n => n * 2)` = `[2, 4, 6]`
- [ ] `optionFunctor.map(null, n => n * 2)` = `null`
- [ ] `optionFunctor.map(5, n => n * 2)` = `10`
- [ ] `doubleAll` works with any functor
- [ ] `stringify` works with any functor

## How to Verify

1. Try calling `doubleAll` with a non-existent URI — should error
2. Verify that `map` preserves the container type (Array -> Array, not Array -> Option)
3. Check that the registry is extensible via declaration merging
