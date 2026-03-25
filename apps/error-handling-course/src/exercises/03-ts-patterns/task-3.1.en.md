# Task 3.1: Result Type

## Goal
Implement the Result pattern for type-safe error handling without throw.

## Requirements
1. Define the `Result<T, E>` type as a union `{ ok: true; value: T } | { ok: false; error: E }`
2. Create helper functions `ok(value)` and `err(error)`
3. Implement functions:
   - `safeDivide(a, b)` — division with protection against division by zero
   - `safeParseInt(str)` — parsing a number
   - `safeJsonParse<T>(json)` — parsing JSON
4. Show a chain of Result operations

## Checklist
- [ ] `Result` type defined
- [ ] `ok` and `err` helper functions created
- [ ] 3 functions implemented with Result
- [ ] Chain of operations works
- [ ] TypeScript correctly narrows types through `if (result.ok)`
