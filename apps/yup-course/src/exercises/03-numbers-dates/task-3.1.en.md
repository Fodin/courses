# Task 3.1: min, max, positive, negative

## Objective

Learn to use Yup's numeric constraints: `min()`, `max()`, `positive()`, `negative()`.

## Requirements

1. Create `ageSchema` — required number, positive, between 18 and 120

2. Create `temperatureSchema` — required number, between -50 and 50

3. Create `balanceSchema` — required number, negative (for modeling debt)

4. Implement validation for each schema triggered by a button click

5. On success, show the result in a green block; on error, show it in a red block

## Checklist

- [ ] `ageSchema` uses `positive()`, `min(18)`, `max(120)`
- [ ] `temperatureSchema` uses `min(-50)`, `max(50)` (negative numbers are allowed)
- [ ] `balanceSchema` uses `negative()`
- [ ] All schemas have custom error messages
- [ ] An empty field is handled as `undefined`

## How to verify

1. Age: 25 — success
2. Age: 0 — error (not positive)
3. Age: 15 — error (less than 18)
4. Age: 150 — error (greater than 120)
5. Temperature: -30 — success
6. Temperature: -60 — error
7. Balance: -100 — success
8. Balance: 50 — error (not negative)
9. Balance: 0 — error (zero is not negative)
