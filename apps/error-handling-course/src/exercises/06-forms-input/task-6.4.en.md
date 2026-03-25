# Task 6.4: Error Accessibility

## Goal
Make form errors accessible to screen readers.

## Requirements
1. Use `aria-required="true"` for required fields
2. Use `aria-invalid` when field has an error
3. Link error to field with `aria-describedby`
4. Use `role="alert"` and `aria-live` for dynamic errors
5. On submit, focus the first field with an error
6. In error summary, make links that focus on fields

## Checklist
- [ ] `aria-required` on required fields
- [ ] `aria-invalid` on error
- [ ] `aria-describedby` links field to error
- [ ] `role="alert"` on error container
- [ ] Focus on first field with error
- [ ] Links in summary navigate to fields
