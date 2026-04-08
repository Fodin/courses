# Exercise 2.5: Validation Modes

## Goal

Learn about validation modes (`mode`) in `useForm` and understand how they affect when errors are triggered.

## Requirements

Create a form with validation mode switching:

1. Buttons to switch between modes: `onSubmit`, `onBlur`, `onChange`, `onTouched`, `all`
2. A form with two fields: `username` (required, minimum 3 characters) and `email` (required, email pattern)
3. When switching modes, the form should be recreated with the new `mode`
4. Display the description of the current mode above the form
5. A "Reset" button to clear the form

## Checklist

- [ ] All 5 modes are available for selection
- [ ] `onSubmit` — errors only appear after clicking "Submit"
- [ ] `onBlur` — errors appear when a field loses focus
- [ ] `onChange` — errors appear on every keystroke
- [ ] `onTouched` — errors appear on first blur, then on every change
- [ ] `all` — errors appear on both blur and onChange
- [ ] The form is recreated when switching modes

## How to verify

1. Select `onSubmit` — start typing invalid data, no errors until you click "Submit"
2. Select `onChange` — errors appear immediately as you type
3. Select `onBlur` — enter an invalid value, click another field — the error appears
4. Select `onTouched` — first error on blur, then updates on every keystroke
5. Select `all` — errors trigger on both blur and onChange
