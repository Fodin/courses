# Task 2.2: min, max, length

## Objective

Create schemas with string length constraints.

## Requirements

1. Create `usernameSchema` — `yup.string().required().min(3).max(20)` for a username

2. Create `pinSchema` — `yup.string().required().length(4)` for a PIN code

3. For each schema, show the current length of the entered string

4. On success, display the value and its length

5. On error, display the message

## Checklist

- [ ] `usernameSchema` is created with `min(3)` and `max(20)`
- [ ] `pinSchema` is created with `length(4)`
- [ ] The current string length is shown below the input field
- [ ] Validation results are shown in colored blocks

## How to verify

1. Username: "ab" — error "At least 3 characters"
2. Username: "john" — success, length: 4
3. Username: a string of 25 characters — error "At most 20 characters"
4. PIN: "123" — error "exactly 4 characters"
5. PIN: "1234" — success
6. PIN: "12345" — error
