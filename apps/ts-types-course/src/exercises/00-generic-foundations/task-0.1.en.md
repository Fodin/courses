# Task 0.1: Generic Constraints

## Goal

Learn to use generic type constraints (`extends`, `keyof`, multiple constraints) to create type-safe reusable functions.

## Requirements

1. Implement `getProperty<T, K extends keyof T>(obj: T, key: K): T[K]` that safely extracts an object property by key
2. Implement `logLength<T extends HasLength>(item: T): number` where `HasLength` is an interface with `length: number`. The function should return the length of the passed value
3. Implement `getEntityInfo<T extends Identifiable & Timestamped>(entity: T): string` that takes an object with `id` and `createdAt` and returns an info string
4. Implement `createInstance<T>(ctor: new () => T): T` that creates an instance of the passed class
5. Implement `mergeObjects<T extends Record<string, unknown>>(a: T, b: Partial<T>): T` that merges two objects

## Checklist

- [ ] `getProperty` correctly extracts properties and TypeScript knows the exact return type
- [ ] `logLength` only accepts values with `.length` (string, array, object with length)
- [ ] `getEntityInfo` requires both `id` and `createdAt` simultaneously
- [ ] `createInstance` creates class instances without constructor arguments
- [ ] `mergeObjects` accepts only `Partial<T>` as the second argument
- [ ] All functions are demonstrated with examples and results displayed in the UI

## How to Verify

1. Try calling `getProperty(user, 'nonexistent')` — it should produce a compile error
2. Try passing `42` to `logLength` — it should produce a compile error
3. Ensure `getProperty(user, 'name')` returns type `string`, not `string | number`
