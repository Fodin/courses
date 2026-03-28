# Task 3.3: useFormStatus

## Objective

Use `useFormStatus` to display the form submission state in child components.

## Requirements

1. Import `useFormStatus` from `'react-dom'`
2. Create a `SubmitButton` component that uses `useFormStatus`
3. While submitting, the button should be disabled and display "Submitting..."
4. `SubmitButton` must be a **child** element of `<form>`

## Checklist

- [ ] `useFormStatus` is imported from `'react-dom'`
- [ ] `SubmitButton` is a separate component inside the form
- [ ] `pending` from `useFormStatus` controls the disabled state and button text
- [ ] The form uses `action` for submission
- [ ] The button changes state during submission

## How to Verify

1. Click the submit button
2. The button becomes disabled and shows "Submitting..."
3. After completion, the button returns to its initial state
