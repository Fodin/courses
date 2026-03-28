# Task 0.2: Error Handling

## Objective

Learn how to extract errors from `ValidationError` and display them next to the corresponding fields.

## Requirements

1. Create a `registrationSchema` with the following fields:
   - `username` — required string, minimum 3 characters
   - `email` — required string in email format
   - `password` — required string, minimum 6 characters

2. Use `{ abortEarly: false }` during validation to collect all errors

3. Extract per-field errors from `ValidationError.inner` (using `error.path` and `error.message`)

4. Display the validation error beneath each field it belongs to

5. Additionally, show a summary list of all errors in a block at the bottom

6. On successful validation, display the validated data

## Checklist

- [ ] `registrationSchema` is created
- [ ] `abortEarly: false` is used
- [ ] Errors are extracted from `err.inner`
- [ ] Each field displays its own error
- [ ] The summary error list is displayed at the bottom
- [ ] `instanceof yup.ValidationError` is checked

## How to verify

1. Leave all fields empty — each field should show a "required" error
2. Enter username "ab" — should show an error "at least 3 characters"
3. Enter password "123" — should show an error "at least 6 characters"
4. Fill in all fields correctly — errors should disappear and the data should be displayed
