# Task 4.1: Infer in Return Types

## Goal

Learn to use `infer` to extract return types from functions, promises, and nested structures.

## Requirements

1. Create a `MyReturnType<T>` type, analogous to the built-in `ReturnType` — it should extract a function's return type
2. Create an `UnwrapPromise<T>` type that extracts the type from `Promise<T>`, and returns the original type for non-promises
3. Create a `DeepUnwrapPromise<T>` type that recursively unwraps nested promises (`Promise<Promise<Promise<number>>>` -> `number`)
4. Create an `ArrayElement<T>` type that extracts the element type of an array
5. Demonstrate a combination of types: extract the data type from an async function that returns `Promise<array>`

## Checklist

- [ ] `MyReturnType` correctly extracts the return type
- [ ] `UnwrapPromise` works with both promises and regular types
- [ ] `DeepUnwrapPromise` recursively unwraps nested promises
- [ ] `ArrayElement` extracts the element type from an array
- [ ] Type combination works correctly with async functions
- [ ] Results are displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that `MyReturnType` returns an object type for a function returning an object
3. Verify that `DeepUnwrapPromise` correctly unwraps 3+ nesting levels
4. Check that `ArrayElement<string[]>` yields `string`
