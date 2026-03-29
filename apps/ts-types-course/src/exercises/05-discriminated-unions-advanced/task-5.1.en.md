# Task 5.1: Exhaustive Switches

## Goal

Master the exhaustive checking pattern via `never` to guarantee all variants of a discriminated union are handled.

## Requirements

1. Create an `assertNever(value: never): never` function that throws an error describing the unhandled value
2. Create a discriminated union `Shape` with three variants: `circle`, `rectangle`, `triangle`
3. Implement a `getArea(shape: Shape): number` function with `switch` and `assertNever` in `default`
4. Create a discriminated union `Result` with statuses `success`, `error`, `loading` and a `formatResult` function with exhaustive checking
5. Demonstrate an alternative approach via `Record<Shape['kind'], string>` for exhaustive mapping

## Checklist

- [ ] `assertNever` accepts `never` and returns `never`
- [ ] `getArea` handles all Shape variants with `assertNever` in default
- [ ] `formatResult` handles all Result statuses
- [ ] `Record<Shape['kind'], string>` contains all variants
- [ ] Computation results are displayed on the page

## How to verify

1. Click the "Run" button
2. Verify that area is computed for all shapes
3. Verify that `formatResult` returns different strings for different statuses
4. Try commenting out one `case` — a TypeScript error should appear
