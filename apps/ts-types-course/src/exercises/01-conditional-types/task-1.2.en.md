# Task 1.2: Distributive Conditionals

## Goal

Understand the distributivity mechanism of conditional types over union types and learn to control this behavior.

## Requirements

1. Implement distributive type `ToArray<T>` creating `T[]` for each union member separately. Show that `ToArray<string | number>` yields `string[] | number[]`
2. Implement non-distributive type `ToArrayNonDist<T>` that for `string | number` creates `(string | number)[]`
3. Implement your own `MyExtract<T, U>` and `MyExclude<T, U>` using distributivity
4. Implement `IsNever<T>` with correct handling of the `never` type (via tuple wrapping)
5. Implement `FilterByProperty<T, K>` filtering a union by the presence of a specific property

## Checklist

- [ ] `ToArray<string | number>` resolves to `string[] | number[]`
- [ ] `ToArrayNonDist<string | number>` resolves to `(string | number)[]`
- [ ] `MyExtract<string | number | boolean, string | number>` resolves to `string | number`
- [ ] `MyExclude<string | number | boolean, boolean>` resolves to `string | number`
- [ ] `IsNever<never>` resolves to `true`, not `never`
- [ ] `FilterByProperty` correctly filters the union type by property presence

## How to Verify

1. Compare results of `ToArray` and `ToArrayNonDist` for the same union type
2. Check `IsNever<never>` and `IsNever<string>` — should be `true` and `false`
3. Implement runtime equivalents of Extract and Exclude via filter
