# Task 2.3: Modifier Manipulation

## Goal

Learn to manage `readonly` and `optional` (`?`) modifiers in mapped types: add, remove, and combine them, including applying them to key subsets.

## Requirements

1. Implement `Mutable<T>` — removes `readonly` from all properties via `-readonly`
2. Implement `Concrete<T>` — removes `?` from all properties via `-?`
3. Implement `ReadonlyRequired<T>` — simultaneously adds `readonly` and removes `?`
4. Implement `ReadonlyPick<T, K>` — makes only specified keys readonly, leaves others mutable
5. Implement `OptionalExcept<T, K>` — makes all properties optional EXCEPT the specified keys

## Checklist

- [ ] `Mutable<{readonly a: string}>` allows mutating `a`
- [ ] `Concrete<{a?: string}>` requires specifying `a`
- [ ] `ReadonlyRequired` combines both modifiers
- [ ] `ReadonlyPick<Doc, 'id'>` — `id` is readonly, rest are mutable
- [ ] `OptionalExcept<Form, 'username'>` — `username` is required, rest are optional

## How to Verify

1. Try mutating a property of `Mutable<FrozenType>` — should work
2. Create a `Concrete<PartialType>` object without a property — should error
3. Check `OptionalExcept` — create an object with only the required keys
