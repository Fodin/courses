# Task 4.2: Nested Objects

## Objective

Create a schema with nested objects and display errors with paths to the specific fields.

## Requirements

1. Create `profileSchema` with nested objects `user` (firstName, lastName) and `address` (city, zipCode, country)

2. `zipCode` must match the pattern `/^\d{5,6}$/`

3. Use `err.inner` to display errors with their paths (e.g. `user.firstName: First name is required`)

4. Implement a form with two field groups: User and Address

## Checklist

- [ ] The schema contains nested objects `user` and `address`
- [ ] `zipCode` is validated with a regex pattern
- [ ] Errors show the field path via `err.inner`
- [ ] Format: `path: message` for each error
- [ ] `abortEarly: false` is used to collect all errors

## How to verify

1. All fields filled — shows the profile JSON
2. All fields empty — errors for each nested field with paths
3. Zip "abc" — error `address.zipCode: Invalid zip code`
4. Zip "12345" — success
