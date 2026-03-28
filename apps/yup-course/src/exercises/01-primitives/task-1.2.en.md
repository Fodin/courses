# Task 1.2: boolean and date

## Objective

Create schemas for boolean and date types, and demonstrate checkbox and date validation.

## Requirements

1. Create `boolSchema` — `yup.boolean().required().isTrue()` with a custom message for `isTrue`

2. Create `dateSchema` — `yup.date().required().min(new Date('2000-01-01'))` with a custom message

3. For boolean, use a checkbox — show how `isTrue()` requires the value to be `true`

4. For date, use `input type="date"` — show how Yup parses a date string into a Date object

5. On successful validation, display the value and its type

## Checklist

- [ ] `boolSchema` is created with `isTrue()`
- [ ] `dateSchema` is created with `min()`
- [ ] An unchecked checkbox triggers the `isTrue` error
- [ ] A date before year 2000 triggers the `min` error
- [ ] The result shows the value and its type

## How to verify

1. Leave the checkbox unchecked and click "Validate" — error "Must be checked"
2. Check the checkbox — success, value `true`
3. Enter date `1999-12-31` — error "Date must be after 2000"
4. Enter date `2024-01-15` — success, the value will be the Date ISO string
