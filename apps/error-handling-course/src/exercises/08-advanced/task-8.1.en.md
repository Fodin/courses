# Task 8.1: Functional Error Handling

## Goal
Implement functional utilities for working with the Result type.

## Requirements
1. Implement `map(result, fn)` — transform value
2. Implement `flatMap(result, fn)` — chain Result operations
3. Implement `mapError(result, fn)` — transform error
4. Implement `unwrapOr(result, default)` — default value
5. Create a pipeline: parse → validate → sqrt → double
6. Visually show result and errors

## Checklist
- [ ] `map`, `flatMap`, `mapError`, `unwrapOr` implemented
- [ ] Pipeline from 4 operations
- [ ] Correct result on valid input
- [ ] Informative error on invalid input
