# Exercise 6.4: Input Masking and Formatting

## Goal

Learn to use Controller to create input masks and format values.

## Requirements

Create a payment form with three masked input fields:

1. **Phone** — mask `+7 (XXX) XXX-XX-XX`, brackets, spaces, and dashes are automatically inserted
2. **Card number** — formatted in groups of 4 digits: `0000 0000 0000 0000`
3. **Amount** — formatted as currency with thousand separators: `1 234.56`
4. Use `Controller` to intercept `onChange` and format values
5. Validation via `zod`: phone and card by regex, amount > 0

## Checklist

- [ ] Phone is automatically formatted as digits are entered
- [ ] Card number is split into groups of 4
- [ ] Amount is formatted with space separators
- [ ] Letters cannot be entered in phone and card fields
- [ ] Validation works with formatted values
- [ ] Form does not submit with invalid data

## How to verify

1. Start entering digits in the phone field — the mask is applied automatically
2. Enter 16 digits in the card field — you see `1234 5678 9012 3456`
3. Enter `1234567` in amount — you see `1 234 567`
4. Click "Pay" with empty fields — validation errors appear
