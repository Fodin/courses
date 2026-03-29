# Task 4.2: Infer in Parameters

## Goal

Learn to extract parameter types from functions and constructors using `infer`.

## Requirements

1. Create a `FirstParam<T>` type that extracts the type of a function's first parameter
2. Create a `MyParameters<T>` type, analogous to the built-in `Parameters` — returns a tuple of parameters
3. Create a `LastParam<T>` type that extracts the last parameter type (use variadic tuples: `[...infer _, infer L]`)
4. Create a `ConstructorParams<T>` type that extracts constructor parameters of a class (note the `new` in the signature)
5. Demonstrate extracting the `this` type from a method with explicit `this` annotation

## Checklist

- [ ] `FirstParam` correctly extracts the first parameter
- [ ] `MyParameters` returns a tuple of all parameters
- [ ] `LastParam` extracts the last parameter via `[...infer _, infer L]`
- [ ] `ConstructorParams` works with classes via `new (...args: infer P)`
- [ ] All examples display correct results on the page

## How to verify

1. Click the "Run" button
2. For function `greet(name: string, age: number)`, verify that `FirstParam` yields `string` and `LastParam` yields `number`
3. Verify that `ConstructorParams` correctly extracts types from a class constructor
