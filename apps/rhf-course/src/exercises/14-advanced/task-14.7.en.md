# Exercise 14.7: Modal/Dialog Forms

## Goal

Learn to create forms inside modal dialogs with isolated state.

## Requirements

1. Create a contact list with an "Add" button
2. Clicking "Add" opens a modal with a form (name, email, phone)
3. The form validates inside the modal — all fields required, email must be valid, phone at least 5 characters
4. On successful submit, the contact is added to the list and the modal closes
5. Use `useForm` inside the modal component — the form resets automatically on close/open
6. Implement the modal using a div overlay (no external libraries)
7. Clicking the overlay (backdrop) should close the modal and reset the form

## Data interface

```typescript
interface Contact {
  name: string
  email: string
  phone: string
}
```

## Checklist

- [ ] Contact list is displayed in a table
- [ ] "Add" button opens the modal
- [ ] Form in the modal validates (name, email, phone)
- [ ] On successful submit, the contact appears in the list
- [ ] Modal closes on successful submit and on backdrop click
- [ ] Form state resets on each modal open
- [ ] `useForm` is located inside the modal component

## How to verify

1. Open the modal and enter invalid data — errors should appear
2. Close the modal and reopen — the form should be empty (state reset)
3. Fill the form with valid data and submit — the contact should appear in the list
4. Add several contacts — all should be displayed in the table
