# Task 6.2: Validation

## Objective

Implement the Validation pattern, which collects ALL validation errors instead of stopping at the first one.

## Requirements

1. Create `Valid<A>` and `Invalid<E>` classes with a `_tag` field ('valid' | 'invalid')
2. `Invalid` stores an array of errors `E[]`
3. Implement a `combine` function — merges multiple Validations into one, accumulating errors
4. Create validators for a registration form:
   - `validateName(name: string)` — non-empty, at least 2 characters
   - `validateEmail(email: string)` — contains @
   - `validatePassword(password: string)` — at least 8 characters, contains a digit
5. Implement a `map` method on Valid/Invalid
6. Demonstrate: a valid form and a form with multiple errors

## Checklist

- [ ] `Valid` and `Invalid` classes with correct `_tag` values
- [ ] `Invalid` stores an array of errors
- [ ] `combine` collects all errors from multiple Validations
- [ ] Three validators implemented with meaningful error messages
- [ ] `map` works for Valid, passes through Invalid
- [ ] Demo: a valid form returns Valid, an invalid form returns all errors at once

## How to Verify

- Click the button — two scenarios should be displayed
- Valid form: Valid with user data
- Invalid form: Invalid with ALL errors (not just one)
