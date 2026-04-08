# Exercise 14.8: Remote Form Submit

## Goal

Learn to control form submission and reset from buttons located outside the `<form>` tag.

## Requirements

1. Create a task creation form with fields: title, description, priority (low/medium/high)
2. All fields are required, description must be at least 10 characters
3. Place "Save" and "Reset" buttons in a toolbar ABOVE the form, outside the `<form>` tag
4. Implement two ways of external submit:
   - A button with `form="form-id"` attribute and `type="submit"`
   - A button with `onClick` that calls `handleSubmit()` directly
5. Implement external form reset by calling `reset()`
6. The reset button should be disabled when the form is not dirty

## Data interface

```typescript
interface TaskForm {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}
```

## Checklist

- [ ] Submit buttons are outside the `<form>` tag
- [ ] Method 1: button with `form="id"` attribute submits the form
- [ ] Method 2: button calls `handleSubmit()` via onClick
- [ ] Reset button calls `reset()` from outside the form
- [ ] Reset button is disabled when the form is not dirty
- [ ] Validation works with both submit methods

## How to verify

1. Click "Save (form=id)" without filling in — validation errors should appear
2. Click "Submit (onClick)" without filling in — also errors
3. Fill the form and use either button — data should be submitted
4. Modify the form, then click "Reset" — the form should clear
5. Verify that the "Reset" button is disabled when the form is empty
