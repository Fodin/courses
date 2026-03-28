# Task 0.1: First Schema

## Objective

Create a Yup schema for validating a user object and check data using `validate()`.

## Requirements

1. Create a `userSchema` using `yup.object()` with the following fields:
   - `name` — required string (`string().required()`)
   - `age` — required positive number (`number().required().positive()`)
   - `email` — required string in email format (`string().email().required()`)

2. Derive the `UserData` type from the schema using `yup.InferType`

3. On clicking the "Validate" button, call `userSchema.validate(data)` with the entered data

4. On successful validation, display the validated data in a green block

5. On validation error, display all errors in a red block

## Checklist

- [ ] `userSchema` is created with three fields
- [ ] `UserData` type is derived via `InferType`
- [ ] The "Validate" button triggers validation
- [ ] Valid data is displayed in a green block
- [ ] Errors are displayed in a red block
- [ ] `{ abortEarly: false }` is used to collect all errors

## How to verify

1. Leave all fields empty and click "Validate" — 3 errors should appear
2. Enter name "John", age 25, email "john@example.com" — a green block with the data should appear
3. Enter age -5 — an error "Age must be positive" should appear
4. Enter email "bad" — an error about an invalid email should appear
