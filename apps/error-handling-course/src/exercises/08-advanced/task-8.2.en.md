# Task 8.2: Error Testing

## Goal
Learn to write tests that verify correct error handling.

## Requirements
1. Create a mini-framework: functions `test(name, fn)` and `expect(value)`
2. Implement methods: `toBe(expected)`, `toThrow(fn, message?)`, `toThrowType(fn, ErrorType)`
3. Write tests for:
   - `divideOrThrow` — normal division and division by zero
   - `validateAge` — valid age, string (TypeError), negative (RangeError)
4. Display results: green/red for each test

## Checklist
- [ ] `test` and `expect` implemented
- [ ] `toBe`, `toThrow`, `toThrowType` work
- [ ] Minimum 6 tests
- [ ] Visual report: passed/failed
