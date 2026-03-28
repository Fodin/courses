# Level 9: Form State

## Introduction

React Hook Form provides a rich set of form states via `formState`. Understanding dirty, touched,
reset, and related methods allows you to create forms that respond appropriately to user actions --
showing changes, resetting when needed, and tracking submission success.

---

## Dirty and Touched States

### What are Dirty and Touched?

| State     | Description       | When it Changes        |
| --------- | ----------------- | ---------------------- |
| `dirty`   | Field was changed | When value changes     |
| `touched` | Field was touched | On blur                |
| `isDirty` | Form was changed  | When any field changes |

### Getting State

```tsx
function MyForm() {
  const {
    register,
    formState: {
      dirtyFields, // Which fields are dirty
      touchedFields, // Which fields are touched
      isDirty, // Form is dirty
      isSubmitted, // Form was submitted
    },
  } = useForm()

  return (
    <form>
      <input {...register('name')} />

      <div>Dirty: {dirtyFields.name ? '✅' : '❌'}</div>
      <div>Touched: {touchedFields.name ? '✅' : '❌'}</div>
      <div>Form changed: {isDirty ? 'Yes' : 'No'}</div>
    </form>
  )
}
```

### Practical Usage

```tsx
// Show error only after field was touched
<input {...register('email', { required: 'Required' })} />
{touchedFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}

// Or show only if field is dirty and invalid
{dirtyFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}
```

---

## getFieldState()

The `getFieldState` method returns the state of a specific field: `isDirty`, `isTouched`, and
`error`. This is useful when you need to check field state imperatively (e.g., in event handlers).

```tsx
const { getFieldState, formState } = useForm({
  defaultValues: { email: '', name: '' },
})

// Get field state
const { isDirty, isTouched, invalid, error } = getFieldState('email', formState)

console.log(isDirty) // true if field was changed
console.log(isTouched) // true if field lost focus
console.log(invalid) // true if field is invalid
console.log(error) // error object or undefined
```

> ⚠️ **Important:** The second argument `formState` is required. Without it, RHF cannot track the
> subscription, and the component won't re-render on changes.

```tsx
// ❌ Wrong -- without formState the component won't update
const { isDirty } = getFieldState('email')

// ✅ Correct -- pass formState
const { isDirty } = getFieldState('email', formState)
```

---

## Visual Change Indicators

```tsx
<input
  {...register('name')}
  style={{
    borderColor: dirtyFields.name
      ? (errors.name ? '#dc3545' : '#28a745')
      : '#ddd',
  }}
/>
```

Example with a reset button for a single field:

```tsx
<div style={{ display: 'flex', gap: '0.5rem' }}>
  <input {...register('email')} />
  {getFieldState('email', formState).isDirty && (
    <button type="button" onClick={() => resetField('email')}>
      Reset
    </button>
  )}
</div>
```

---

## Reset and defaultValues

### Setting default values

```tsx
// On initialization
const { register } = useForm({
  defaultValues: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
  },
})
```

### The reset() Method

```tsx
const { reset } = useForm()

// Reset to default values
reset()

// Reset with new values
reset({
  firstName: 'Jane',
  lastName: 'Smith',
})

// With options
reset(values, {
  keepErrors: false, // Keep errors
  keepDirty: false, // Keep dirty state
  keepValues: false, // Keep values
  keepDefaultValues: false,
  keepIsSubmitted: false,
  keepTouched: false,
  keepIsValid: false,
  keepSubmitCount: false,
})
```

### resetField() -- Resetting a Specific Field

`resetField` resets a single field without affecting the rest of the form:

```tsx
const { resetField } = useForm({
  defaultValues: { email: 'user@example.com', name: 'John' },
})

// Reset to defaultValue
resetField('email') // email returns to 'user@example.com'

// Reset to a new value
resetField('email', { defaultValue: 'new@example.com' })

// With options -- keep dirty/touched/error state
resetField('email', {
  keepDirty: true,
  keepTouched: true,
  keepError: true,
  defaultValue: '',
})
```

> 📌 **Difference between `reset` and `resetField`:** `reset` resets the entire form and all its
> states. `resetField` works surgically -- it resets only the specified field.

---

## isSubmitSuccessful

`isSubmitSuccessful` is a `formState` property that becomes `true` after `onSubmit` completes
without errors. A convenient way to show a success message or reset the form:

```tsx
const {
  handleSubmit,
  reset,
  formState: { isSubmitSuccessful },
} = useForm()

// Show success message
{isSubmitSuccessful && (
  <div role="status">Form submitted successfully!</div>
)}

// Reset form after successful submission
useEffect(() => {
  if (isSubmitSuccessful) {
    reset()
  }
}, [isSubmitSuccessful, reset])
```

> ⚠️ **Gotcha:** If `onSubmit` throws an exception, `isSubmitSuccessful` will remain `false`. If
> you make API calls in `onSubmit`, ensure errors are handled correctly.

### Tracking Changes

```tsx
const { watch, reset, formState: { isDirty } } = useForm()

// Reset button is active only if the form has changes
<button type="button" onClick={() => reset()} disabled={!isDirty}>
  Reset
</button>
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Destructuring Not from formState

```tsx
// ❌ Wrong -- destructuring directly from useForm
const { errors, isDirty, isValid } = useForm()

// ✅ Correct -- from formState
const {
  formState: { errors, isDirty, isValid },
} = useForm()
```

**Why this is a mistake:** `formState` is a Proxy object that tracks subscriptions. Direct
destructuring breaks this system -- the component won't re-render when state changes.

---

### ❌ Mistake 2: reset Without defaultValues

```tsx
// ❌ Wrong -- reset without initial values
const { reset } = useForm()
reset()

// ✅ Correct -- with defaultValues
const { reset } = useForm({
  defaultValues: { name: '', email: '' },
})
reset()
```

**Why this is a mistake:** Without `defaultValues`, the form doesn't know what values to reset to.
Additionally, `isDirty` won't work correctly without baseline values for comparison.

---

### ❌ Mistake 3: Ignoring touchedFields

```tsx
// ❌ Wrong -- show error immediately
{errors.email && <span className="error">{errors.email.message}</span>}

// ✅ Correct -- after touch
{touchedFields.email && errors.email && (
  <span className="error">{errors.email.message}</span>
)}
```

**Why this is a mistake:** The user sees an error before finishing input, which degrades UX.
Especially noticeable with `mode: 'onChange'`.

---

### ❌ Mistake 4: getFieldState Without formState

```tsx
// ❌ Wrong -- without formState the component won't update
const { isDirty } = getFieldState('email')

// ✅ Correct -- pass formState
const { isDirty } = getFieldState('email', formState)
```

**Why this is a mistake:** Without the second argument, RHF cannot create a subscription to changes,
and `isDirty`/`isTouched` will always have their initial values.

---

## Additional Resources

- [formState Documentation](https://react-hook-form.com/docs/useform/formstate)
- [reset Documentation](https://react-hook-form.com/docs/useform/reset)
- [resetField Documentation](https://react-hook-form.com/docs/useform/resetfield)
- [getFieldState Documentation](https://react-hook-form.com/docs/useform/getfieldstate)
