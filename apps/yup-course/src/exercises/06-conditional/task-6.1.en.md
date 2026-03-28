# Task 6.1: when() — basic usage

## Objective

Learn to use `when()` for conditional validation — when the rules for one field depend on the value of another.

## Requirements

1. Create `accountSchema` — an object schema with the following fields:
   - `isBusiness` — boolean, required
   - `companyName` — string, **required only if** `isBusiness === true`
   - `personalName` — string, **required only if** `isBusiness === false`

2. Use `when('isBusiness', { is, then, otherwise })` for each conditional field

3. Validate with `abortEarly: false` to show all errors

4. On success — display the data in a green block

5. On error — display a list of errors in a red block

## Checklist

- [ ] `companyName` uses `.when('isBusiness', { is: true, then: ..., otherwise: ... })`
- [ ] `personalName` uses `.when('isBusiness', { is: false, then: ..., otherwise: ... })`
- [ ] Empty strings are passed as `undefined` for `required()` to work correctly
- [ ] Validation uses `abortEarly: false`
- [ ] Result is displayed in a colored block

## How to verify

1. Business ON + companyName = "Acme" — success
2. Business ON + companyName empty — error "Company name is required"
3. Business OFF + personalName = "John" — success
4. Business OFF + personalName empty — error "Personal name is required"
5. Business ON — personalName is not validated (optional)
