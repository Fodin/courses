# Task 6.2: Assertion Functions

## Goal

Learn to use `asserts` for runtime validation with automatic type narrowing — assertion throws an error or guarantees the type.

## Requirements

1. Create a function `assertDefined<T>(value: T | null | undefined): asserts value is T` that throws for null/undefined
2. Create a function `assertIsUser(value: unknown): asserts value is User` with complete field validation
3. Create assertion functions for numeric constraints: `assertPositive`, `assertInRange`
4. Create `assertNonEmptyArray<T>(arr: T[]): asserts arr is [T, ...T[]]` for non-empty arrays
5. Demonstrate assertion chains: sequential calls narrow the type step by step
6. Show error handling via try/catch for each assertion

## Checklist

- [ ] `assertDefined` throws for null/undefined, narrows type to `T`
- [ ] `assertIsUser` checks all fields and throws with a description of the invalid field
- [ ] `assertPositive` and `assertInRange` correctly validate numbers
- [ ] `assertNonEmptyArray` narrows to tuple type `[T, ...T[]]`
- [ ] try/catch examples with correct error handling are shown
- [ ] Results are displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `assertDefined("Alice")` doesn't throw, while `assertDefined(null)` does
3. Verify that `assertIsUser` gives a clear message for invalid data
4. Check that `assertNonEmptyArray` enables `[first, ...rest]` destructuring
