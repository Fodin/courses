# Task 4.1: object and shape

## Objective

Create an object schema for validating user data with multiple fields of different types.

## Requirements

1. Create `userSchema` with fields: `name` (string, required, min 2), `age` (number, required, positive, integer), `email` (string, required, email)

2. Implement a form with three input fields

3. Validate data with `abortEarly: false` to show all errors

4. On success, display the JSON of the validated object in a green block

5. On error, display all errors in a red block

## Checklist

- [ ] `userSchema` is created via `yup.object()` with three fields
- [ ] Each field has the correct type and custom messages
- [ ] `abortEarly: false` is passed to `validate()`
- [ ] Empty fields are handled correctly (empty string → undefined for required)
- [ ] The result is displayed in a `<pre>` block

## How to verify

1. All fields filled correctly — shows the JSON object
2. All fields empty — shows 3 errors (name, age, email)
3. Name "A" — error "Name too short"
4. Age: 0 — error (not positive)
5. Email: "bad" — error "Invalid email"
