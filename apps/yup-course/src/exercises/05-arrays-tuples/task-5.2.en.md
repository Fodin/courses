# Task 5.2: min, max, length for arrays

## Objective

Master array length constraints: `min()`, `max()`, `length()`.

## Requirements

1. Create `rolesSchema` — an array of strings, required, 1 to 3 elements

2. Create `teamSchema` — an array of strings, required, exactly 5 elements

3. On success, display the element count and the array itself

4. Parse input by comma

## Checklist

- [ ] `rolesSchema` uses `min(1)` and `max(3)` with custom messages
- [ ] `teamSchema` uses `length(5)` with a custom message
- [ ] Both arrays are `required()`
- [ ] On success, the count and JSON of the array are shown

## How to verify

1. Roles: "admin, editor" — success (2 roles)
2. Roles: "" — required error
3. Roles: "a, b, c, d" — error "Maximum 3 roles"
4. Team: "Alice, Bob, Charlie, Dave, Eve" — success (5 members)
5. Team: "Alice, Bob" — error "must have exactly 5"
