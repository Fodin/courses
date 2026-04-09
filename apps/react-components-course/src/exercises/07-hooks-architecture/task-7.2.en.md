# Task 7.2: useForm — form as state

## Goal

Implement a universal `useForm<T>` hook for managing form state with validation. The form component should be a pure rendering layer — all logic in the hook.

## Requirements

1. Implement form state interface:
   - `values: T` — current field values
   - `errors: Partial<Record<keyof T, string>>` — validation errors
   - `touched: Partial<Record<keyof T, boolean>>` — fields the user has touched
   - `isSubmitting: boolean` — whether submission is in progress
2. Implement `useForm<T>(initialValues: T, validate?: (values: T) => Partial<Record<keyof T, string>>)` hook:
   - `handleChange(field, value)` — updates field value; if field is already `touched` — runs validation for that field
   - `handleBlur(field)` — marks field as `touched` and validates it
   - `handleSubmit(onSubmit)` — returns a form event handler; before calling `onSubmit`, marks all fields as `touched`, runs full validation; if no errors — calls `onSubmit(values)` and manages `isSubmitting` flag
   - `reset()` — returns form to initial state
3. Implement a `RegistrationForm` component that uses `useForm`:
   - Fields: name, email, password
   - Validation: name required; email must contain `@`; password minimum 6 characters
   - Errors shown only for `touched` fields
   - Submit button disabled during `isSubmitting`
   - On successful submission, form resets and success message is shown

## Hints

- Use `touched[field]` for conditional error display: `{form.touched.name && form.errors.name && <span>...`
- To mark all fields as `touched`, use `Object.keys(values).reduce(...)`
- Update `isSubmitting` via `finally`, so it resets even on error
- Don't forget `e.preventDefault()` in `handleSubmit`
- Type `Partial<Record<keyof T, string>>` is a convenient TypeScript construct for optional errors by key

## Checklist

- [ ] `useForm` accepts `initialValues` and optional `validate` function
- [ ] `handleChange` updates `values` and runs validation if field is `touched`
- [ ] `handleBlur` marks field as `touched` and shows error
- [ ] `handleSubmit` validates all fields before submission
- [ ] Errors shown only for touched fields
- [ ] `isSubmitting` controls submit button state
- [ ] `reset()` returns form to initial state
- [ ] `RegistrationForm` component contains no validation logic

## How to check yourself

Open the form and immediately click "Submit" — all fields should show errors (they all get marked as touched). Fill in only email incorrectly — error should appear after losing focus. Fix the email — error disappears on the fly. Fill all fields correctly and submit — a success message should appear and the form should reset.
