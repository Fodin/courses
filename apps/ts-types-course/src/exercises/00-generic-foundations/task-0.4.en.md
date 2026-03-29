# Task 0.4: Conditional Inference

## Goal

Learn to combine generics with conditional types and the `infer` keyword to create utility types that extract information from complex types.

## Requirements

1. Implement type `IsString<T>` returning `'yes'` if `T` is `string`, otherwise `'no'`. Create a runtime function `isString` with analogous behavior
2. Implement type `UnwrapPromise<T>` extracting the type from `Promise<T>`. If `T` is not a Promise, return `T` as-is
3. Implement type `ElementType<T>` extracting the element type of an array. If `T` is not an array, return `T`
4. Implement type `MyReturnType<T>` extracting the return type of a function
5. Create a type-safe event handling system with `EventMap` and conditional types for classifying events by their payload

## Checklist

- [ ] `IsString<'hello'>` resolves to `'yes'`, `IsString<42>` resolves to `'no'`
- [ ] `UnwrapPromise<Promise<number>>` resolves to `number`
- [ ] `UnwrapPromise<string>` resolves to `string` (not a Promise)
- [ ] `ElementType<string[]>` resolves to `string`
- [ ] `MyReturnType<() => boolean>` resolves to `boolean`
- [ ] The event system correctly classifies mouse/keyboard/other events
- [ ] Compile-time type examples are shown alongside runtime demonstrations

## How to Verify

1. Check types via IDE hover or `type _Test = IsString<...>`
2. Ensure `infer` correctly extracts nested types
3. Try passing an incompatible payload to the event handler
