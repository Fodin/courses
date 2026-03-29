# Task 6.3: Generic Narrowing

## Goal

Learn to create generic type guards that work with arbitrary types: property checking, array validation, guard factories.

## Requirements

1. Create a generic guard `hasProperty<K>(obj: unknown, key: K): obj is Record<K, unknown>` for checking property existence
2. Create `hasTypedProperty<K, V>(obj, key, guard): obj is Record<K, V>` for checking a property with a specific type
3. Create `isArrayOf<T>(value, guard): value is T[]` — a guard for arrays that checks each element
4. Implement a guard factory: `createGuard<T>(check): (value: unknown) => value is T`
5. Create a generic guard for discriminated unions: `isSuccess<T>(result: ApiResult<T>)` with `Extract`
6. Demonstrate combining generic guards to validate nested structures

## Checklist

- [ ] `hasProperty` correctly checks property existence and narrows the type
- [ ] `hasTypedProperty` accepts a guard function to check the value type
- [ ] `isArrayOf` checks each array element via the provided guard
- [ ] `createGuard` creates a typed guard from a regular check function
- [ ] Generic guard for union works with `Extract`
- [ ] Results are displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `hasProperty(data, 'name')` allows accessing `data.name`
3. Verify that `isArrayOf([1,2,3], isNumber)` returns `true`, while `isArrayOf([1,"two",3], isNumber)` returns `false`
4. Check that `createGuard<Product>(...)` creates a guard with full typing
