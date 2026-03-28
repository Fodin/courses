# Task 7.1: test() — custom validation

## Objective

Learn to create custom validators using `test()` — both synchronous and asynchronous.

## Requirements

1. Create `passwordSchema` — a string schema with custom tests:
   - required, min(8)
   - test 'has-uppercase': contains at least one uppercase letter
   - test 'has-lowercase': contains at least one lowercase letter
   - test 'has-digit': contains at least one digit

2. Create `usernameSchema` — a string schema with an **async** test:
   - required, min(3)
   - async test 'unique-username': simulates a check via API
   - Forbidden names: 'admin', 'root', 'test', 'user'
   - Add `setTimeout` to simulate API delay (500ms)

3. Use `abortEarly: false` for password to show all errors

## Checklist

- [ ] `passwordSchema` has three `.test()` calls for uppercase, lowercase, digit
- [ ] Each test returns `true` for null/undefined (let required handle those)
- [ ] `usernameSchema` has an async `.test()` with `async/await`
- [ ] Forbidden names are checked case-insensitively
- [ ] A loading state is shown during the async check

## How to verify

1. Password "MyPass123" — success
2. Password "mypass123" — error "uppercase"
3. Password "MYPASS123" — error "lowercase"
4. Password "MyPassABC" — error "digit"
5. Password "Ab1" — error "min 8"
6. Username "johndoe" — success (after delay)
7. Username "admin" — error "already taken"
8. Username "ab" — error "min 3"
