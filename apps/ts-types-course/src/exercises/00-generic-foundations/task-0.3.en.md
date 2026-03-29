# Task 0.3: Inference in Functions

## Goal

Learn to build generic functions where TypeScript automatically infers types from arguments, ensuring maximum type safety without unnecessary annotations.

## Requirements

1. Implement `identity<T>(value: T): T` and show that TypeScript infers the concrete type
2. Implement `firstElement<T>(arr: T[]): T | undefined` to extract the first array element
3. Implement `makePair<A, B>(a: A, b: B): [A, B]` with both types inferred from arguments
4. Implement `mapArray<T, U>(arr: T[], fn: (item: T) => U): U[]` where `U` is inferred from the callback
5. Implement `createConfig<T extends Record<string, unknown>>(config: T): Readonly<T>` to create an immutable configuration
6. Implement `pluck<T, K extends keyof T>(items: T[], key: K): T[K][]` to extract an array of values by key

## Checklist

- [ ] `identity('hello')` has type `string` and `identity(42)` has type `number`
- [ ] `firstElement([1, 2, 3])` returns `number | undefined`
- [ ] `makePair('key', 42)` returns `[string, number]`
- [ ] `mapArray(['a', 'b'], s => s.length)` returns `number[]`
- [ ] `createConfig({...})` returns `Readonly<...>` preserving the structure
- [ ] `pluck(users, 'name')` returns `string[]` and `pluck(users, 'age')` returns `number[]`

## How to Verify

1. Hover over variables in your IDE — check the inferred types
2. Try mutating the result of `createConfig` — should produce an error
3. Verify that `pluck` distinguishes types for different keys
