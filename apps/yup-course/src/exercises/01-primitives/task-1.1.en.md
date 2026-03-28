# Task 1.1: string and number

## Objective

Create two separate schemas — one for a string and one for a number — and visually demonstrate their validation and type casting.

## Requirements

1. Create `stringSchema` — `yup.string().required().min(2)` with custom error messages

2. Create `numberSchema` — `yup.number().required().min(0).max(150)` with custom messages

3. Implement a separate "Validate" button for each schema

4. On successful validation, display the result and its type (`typeof`)

5. On error, display the error message

## Checklist

- [ ] `stringSchema` is created with `required()` and `min(2)`
- [ ] `numberSchema` is created with `required()`, `min(0)`, `max(150)`
- [ ] Each schema is validated by its own button
- [ ] The result shows the value and its type
- [ ] Errors are displayed correctly

## How to verify

1. Enter "A" in the string field — error "Minimum 2 characters"
2. Enter "John" — success, type `string`
3. Enter "abc" in the number field — error (NaN)
4. Enter "42" in the number field — success, value `42`, type `number` (note the cast!)
5. Enter "200" — error "Must be <= 150"
