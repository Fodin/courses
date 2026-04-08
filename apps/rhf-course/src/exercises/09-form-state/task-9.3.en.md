# Exercise 9.3: Programmatic Control — setValue, setError, trigger

## Goal

Learn to programmatically control a form: fill fields, set errors, and trigger validation.

## Requirements

Create a form with fields: name, email, phone, city.

1. **setValue** — a "Fill from profile" button that programmatically fills all fields from a mock object
2. **setError** — after form submission, simulate a server error (e.g., "email already registered") and display it in the form via setError
3. **trigger** — a "Validate email" button that manually triggers validation only for the email field; a "Validate all" button for validating all fields
4. All three methods must correctly update the form state

## Checklist

- [ ] "Fill from profile" button fills all fields via setValue
- [ ] Fields update visually after setValue
- [ ] "Validate email" button calls trigger('email')
- [ ] "Validate all" button calls trigger() without arguments
- [ ] Submitting with email "taken@example.com" — server error via setError
- [ ] setError error is displayed as a regular validation error

## How to verify

1. Open the empty form
2. Click "Validate all" — validation errors appear on all fields
3. Click "Fill from profile" — all fields are filled
4. Click "Validate email" — no errors (email is valid)
5. Change email to "taken@example.com" and submit — server error appears
