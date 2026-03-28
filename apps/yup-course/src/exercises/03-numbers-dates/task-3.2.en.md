# Task 3.2: integer and truncate

## Objective

Master integer validation and the `truncate()` / `round()` transformations.

## Requirements

1. Create `quantitySchema` — required, positive, integer number (`integer()`)

2. Create `truncateSchema` — number with the `truncate()` transformation

3. Create `roundSchema` — number with the `round('ceil')` transformation

4. Implement integer validation with result display

5. Implement a transformation demo: show the original value and the result of each transformation

## Checklist

- [ ] `quantitySchema` checks that the number is an integer via `integer()`
- [ ] `truncateSchema` drops the fractional part via `truncate()`
- [ ] `roundSchema` rounds up via `round('ceil')`
- [ ] A fractional number (3.7) fails `integer()` validation
- [ ] Transformations correctly display their results

## How to verify

1. Quantity: 5 — success
2. Quantity: 3.7 — error "Must be a whole number"
3. Quantity: -2 — error (not positive)
4. Transform 3.7: truncate() = 3, round("ceil") = 4
5. Transform -2.3: truncate() = -2, round("ceil") = -2
