# Task 4.1: Pipe and Compose

## Objective

Implement type-safe `pipe` and `compose` functions for building data transformation chains.

## Requirements

1. Create a `pipe` function with overloads for 2, 3, and 4 functions
   - `pipe(fn1, fn2)` — the result of fn1 is passed to fn2
   - Each overload must verify type compatibility between functions
2. Create a `compose` function with overloads — same as pipe but right to left
3. Create helper functions for the demonstration:
   - `trim(s: string): string`
   - `toUpperCase(s: string): string`
   - `addExclamation(s: string): string`
   - `getLength(s: string): number`
   - `double(n: number): number`
   - `toFixed(n: number): string`
4. Demonstrate chains with different types: `string → string → number → string`
5. Show that incompatible types cause a compile error

## Checklist

- [ ] `pipe` has overloads for 2–4 functions
- [ ] `compose` has overloads for 2–4 functions
- [ ] Types are checked between steps (a number cannot be passed to a string function)
- [ ] Helper functions are created and work correctly
- [ ] Demonstration outputs results on screen

## How to verify

- `pipe(trim, toUpperCase)("  hello  ")` should return `"HELLO"`
- `pipe(trim, getLength, double)("  hi  ")` should return `4`
- `compose(toUpperCase, trim)("  hello  ")` should return `"HELLO"`
