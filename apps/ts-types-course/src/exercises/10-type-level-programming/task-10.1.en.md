# Task 10.1: Type-Level Arithmetic

## Goal

Implement arithmetic operations at the TypeScript type level using Peano encoding via tuple lengths.

## Requirements

1. Implement a helper type `BuildTuple<N>` that creates a tuple of length N filled with `unknown`
2. Implement `Add<A, B>` that adds two natural numbers via tuple concatenation
3. Implement `Subtract<A, B>` that subtracts B from A via tuple destructuring (A >= B)
4. Implement `Multiply<A, B>` that multiplies two numbers via recursive addition
5. Demonstrate each operation with a runtime analog using real arrays
6. Add compile-time checks by assigning literal values to the resulting types

## Checklist

- [ ] `BuildTuple<3>` creates `[unknown, unknown, unknown]`
- [ ] `Add<3, 4>` evaluates to `7`
- [ ] `Subtract<10, 3>` evaluates to `7`
- [ ] `Multiply<4, 5>` evaluates to `20`
- [ ] Nested operations work: `Add<Multiply<3, 3>, 1>` = `10`
- [ ] Runtime demonstrations display when clicking "Run"
- [ ] Compile-time assertions pass without errors

## How to Verify

1. Try `const x: Add<3, 4> = 8` — should produce a compile error (expected 7)
2. Check `Subtract<3, 5>` — should return `never` (negative numbers not supported)
3. Verify that `Multiply<0, 100>` correctly returns `0`
