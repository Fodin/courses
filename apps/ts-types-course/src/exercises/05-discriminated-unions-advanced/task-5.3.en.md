# Task 5.3: Algebraic Data Types

## Goal

Learn to model complex domains using algebraic data types (ADTs): Option, Result, and recursive trees.

## Requirements

1. Implement an `Option<T>` type (`some` and `none` variants) with constructor functions `some()` and `none()`
2. Create `mapOption` and `unwrapOr` functions for working with `Option`
3. Implement a `Result<T, E>` type (`ok` and `err` variants) with constructor functions
4. Create a `parseAge(input: string): Result<number, string>` function that validates input
5. Implement a recursive ADT `Expr` for an arithmetic expression tree with `num`, `add`, `mul`, `neg` operations
6. Create `evaluate(expr)` and `printExpr(expr)` functions for computing and displaying expressions

## Checklist

- [ ] `Option<T>` is implemented with `some` and `none` variants
- [ ] `mapOption` transforms the value inside `some`, skips `none`
- [ ] `unwrapOr` returns the value or a default
- [ ] `Result<T, E>` is implemented with `ok` and `err` variants
- [ ] `parseAge` correctly validates and returns `Result`
- [ ] `Expr` supports recursive expressions
- [ ] `evaluate` computes the expression tree
- [ ] `printExpr` builds a string representation

## How to verify

1. Click the "Run" button
2. Verify that `mapOption(some(user), u => u.name)` returns `some` with the name
3. Verify that `parseAge("abc")` returns `err` with a message
4. Verify that the expression `(2 + 3) * (-4)` evaluates to `-20`
