# Task 0.5: Contract Testing

## 🎯 Goal

Implement a runtime API response validation system using composable type guards that simultaneously validate data and narrow types.

## Requirements

1. Create basic type guards: `isString`, `isNumber`, `isBoolean`
2. Implement an `isObject()` composer — creates a guard for an object from a schema of guards for each field
3. Implement an `isArray()` composer — creates an array guard from an element guard
4. Implement `isOneOf()` — a guard for union types from literals
5. Create a `validateContract()` function — a validator with error accumulation
6. Demonstrate validation on valid, invalid, and edge case data

## Checklist

- [ ] Basic guards correctly check primitive types
- [ ] `isObject` composes guards for all object fields
- [ ] `isArray(isUser)` validates a user array
- [ ] `isOneOf('admin', 'user')` checks membership in a value set
- [ ] `validateContract` returns a structured result with errors
- [ ] Edge cases are handled: null, undefined, empty object, wrong types

## How to Verify

Check that after an `isUser(data)` check, TypeScript narrows the type to `User`. Make sure the guard rejects data with wrongly-typed extra fields and missing required fields.
