# Task 5.4: Specifications

## Goal

Implement the Specification pattern for encapsulating and composing business rules with support for logical operators `and`, `or`, `not`.

## Requirements

1. Create a `Specification<T>` interface with methods `isSatisfiedBy`, `and`, `or`, `not`
2. Implement a base `BaseSpec<T>` class that accepts a predicate in the constructor
3. Create a `spec<T>(predicate)` factory function for convenient specification creation
4. Implement a set of specifications for the `Product` type: `isInStock`, `isAffordable(maxPrice)`, `hasMinRating(min)`, `inCategory(cat)`
5. Demonstrate simple specifications, composition via `and`, `or`, `not`, and complex combinations

## Checklist

- [ ] `Specification<T>` is generic over the checked object type
- [ ] `and` returns a specification satisfied only if both originals are satisfied
- [ ] `or` returns a specification satisfied if at least one original is satisfied
- [ ] `not` inverts the specification result
- [ ] Specifications can be arbitrarily combined in chains
- [ ] `filterBySpec` filters an array by specification

## How to Verify

1. `isInStock.and(isAffordable(50))` should pass only in-stock items under $50
2. `isInStock.not()` should select only out-of-stock items
3. Complex composition `(A and B).or(C and D)` should work correctly
