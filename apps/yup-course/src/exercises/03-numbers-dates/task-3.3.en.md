# Task 3.3: Date Validation

## Objective

Learn to validate dates using `yup.date()` and `min()` / `max()` constraints.

## Requirements

1. Create `birthdaySchema` — required date, not in the future (`max(new Date())`), not before 1900

2. Create `eventSchema` — required date, future dates only (`min(new Date())`)

3. Use `<input type="date">` for date input

4. On success, display the validated date in a human-readable format

## Checklist

- [ ] `birthdaySchema` is constrained to the range 1900-01-01 through today
- [ ] `eventSchema` accepts only future dates
- [ ] An empty field is handled as `undefined` (triggers `required`)
- [ ] The result is displayed in a colored block

## How to verify

1. Birthday: 2000-05-15 — success (shows the date)
2. Birthday: 2099-01-01 — error (in the future)
3. Birthday: empty — error "required"
4. Event: a date one month from now — success
5. Event: yesterday's date — error (in the past)
