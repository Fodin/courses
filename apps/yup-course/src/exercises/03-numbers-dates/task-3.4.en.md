# Task 3.4: Date Ranges

## Objective

Implement cross-field date validation: the end date must be later than the start date, using `yup.ref()`.

## Requirements

1. Create `dateRangeSchema` — an object with `startDate` and `endDate` fields

2. Both fields are required (`required`)

3. `endDate` must be later than `startDate` (use `min(yup.ref('startDate'))`)

4. Use `abortEarly: false` to display all errors

5. On success, show the date range and the number of days

## Checklist

- [ ] The schema is an object (`yup.object()`) with two date fields
- [ ] `endDate` references `startDate` via `yup.ref()`
- [ ] `abortEarly: false` shows all errors at once
- [ ] On success, the range and number of days are displayed
- [ ] Both empty fields produce two required errors

## How to verify

1. Start: 2024-01-01, End: 2024-12-31 — success (365 days)
2. Start: 2024-12-31, End: 2024-01-01 — error "End must be after start"
3. Start: empty, End: empty — two required errors
4. Start: 2024-06-01, End: 2024-06-01 — success (0 days, min allows equality)
