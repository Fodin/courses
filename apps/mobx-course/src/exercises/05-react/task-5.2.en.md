# Task 5.2: useLocalObservable

## Goal

Learn to use the `useLocalObservable` hook to create local MobX state inside a component instead of multiple `useState` calls.

## Requirements

1. Create a feedback form component wrapped in `observer`
2. Use `useLocalObservable` to create a local store with fields:
   - `name: string` — sender name
   - `email: string` — email address
   - `message: string` — message text
3. Add action methods to update each field: `setName`, `setEmail`, `setMessage`
4. Add computed getters:
   - `isValid` — returns `true` if:
     - `name` is not empty
     - `email` contains the `@` symbol
     - `message` has at least 10 characters
   - `summary` — returns a string like `"Name (email): first 30 characters of message..."`
5. Display a form with three input fields (input for name and email, textarea for message)
6. Show the validation status (Valid: Yes/No)
7. If the form is valid, show a preview (summary)

```typescript
useLocalObservable(() => ({
  name: '',
  email: '',
  message: '',
  setName(v: string) { this.name = v },
  setEmail(v: string) { this.email = v },
  setMessage(v: string) { this.message = v },
  get isValid(): boolean,
  get summary(): string,
}))
```

## Checklist

- [ ] Uses `useLocalObservable` (not `useState` or manual `makeAutoObservable`)
- [ ] All three form fields work and update the store
- [ ] Computed `isValid` correctly checks all three conditions
- [ ] Computed `summary` produces a preview string
- [ ] Preview is displayed only when the form is valid
- [ ] Component is wrapped in `observer`

## How to verify

1. With an empty form, validation status is `No`
2. Fill in name, email with `@`, message 10+ characters long — status becomes `Yes`
3. A preview with your data appears below the form
4. Remove `@` from email — preview disappears, status returns to `No`
