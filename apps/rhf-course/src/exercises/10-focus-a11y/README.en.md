# Level 10: Focus and Accessibility

## Introduction

Focus management and accessibility (a11y) are critically important aspects of form UX. Proper focus
handling helps users quickly find and fix errors, while ARIA attributes make forms accessible to
people using screen readers and keyboard navigation.

---

## Focus Management: setFocus

### Why Focus Management?

On a validation error, the user should immediately understand where the problem is. Automatic focus
on the first error field significantly improves UX.

### setFocus -- Programmatic Focus Setting

RHF provides the `setFocus` method for programmatically setting focus on a field by name. This is
more convenient than working with the DOM directly because RHF already knows about all registered
fields.

```tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

function MyForm() {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm()

  // Focus on first field on mount
  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  // Focus on first error field after failed submit
  const onInvalid = (errors) => {
    const firstError = Object.keys(errors)[0]
    if (firstError) setFocus(firstError)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <input {...register('email', { required: 'Required' })} />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input {...register('password', { required: 'Required' })} />
      {errors.password && <span className="error">{errors.password.message}</span>}

      <button type="submit">Submit</button>
    </form>
  )
}
```

---

## shouldFocusError

RHF has a built-in option for auto-focusing on the first error field:

```tsx
// Enabled by default
const { register } = useForm({
  shouldFocusError: true,
})

// Disable (if you want to manage focus manually)
const { register } = useForm({
  shouldFocusError: false,
})
```

---

## setFocus Options

`setFocus` accepts a second argument -- an object with a `shouldSelect` option:

```tsx
// Just focus
setFocus('email')

// Focus + select text in the field
setFocus('email', { shouldSelect: true })
```

> **Important:** `setFocus` only works with fields registered via `register`. For fields via
> `Controller`, focus depends on the component implementation.

### Custom Hook for Focus on Error

```tsx
import { UseFormSetFocus, FieldErrors, FieldValues } from 'react-hook-form'

function useFocusOnError<T extends FieldValues>(
  errors: FieldErrors<T>,
  setFocus: UseFormSetFocus<T>
) {
  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof T
    if (firstError) {
      setFocus(firstError as any)
    }
  }, [errors, setFocus])
}

// Usage
function MyForm() {
  const {
    setFocus,
    formState: { errors },
  } = useForm()
  useFocusOnError(errors, setFocus)
}
```

---

## Accessibility (a11y): ARIA Attributes

### Main ARIA Attributes for Forms

| Attribute          | Description                   | Example                          |
| ------------------ | ----------------------------- | -------------------------------- |
| `aria-label`       | Text label for the form       | `aria-label="Login form"`        |
| `aria-invalid`     | Field is invalid              | `aria-invalid={!!errors.email}`  |
| `aria-describedby` | Link to error description     | `aria-describedby="email-error"` |
| `aria-live`        | Real-time updates             | `aria-live="polite"`             |
| `role="alert"`     | Important message             | `role="alert"`                   |
| `noValidate`       | Disable native validation     | `<form noValidate>`              |

### aria-invalid and aria-describedby

These two attributes work together -- `aria-invalid` tells the screen reader the field is invalid,
and `aria-describedby` points to where to find the error text:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  {...register('email', { required: 'Required' })}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>

{errors.email && (
  <span id="email-error" className="error" role="alert" aria-live="polite">
    {errors.email.message}
  </span>
)}
```

### role="alert" and aria-live

```tsx
function AccessibleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Registration form" noValidate>
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive" style={{ color: '#dc3545' }}>
          Please fix the errors in the form
        </div>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email', { required: 'Required' })}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <span id="email-error" className="error" role="alert" aria-live="polite">
          {errors.email.message}
        </span>
      )}

      <button type="submit">Submit</button>
    </form>
  )
}
```

> Use `aria-live="assertive"` for critical errors (general messages) and `aria-live="polite"` for
> individual field errors.

---

## Keyboard Navigation

### Field Navigation via Enter

```tsx
<input
  {...register('name')}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.getElementById('email')?.focus()
    }
  }}
/>
<input id="email" {...register('email')} />
```

### Complete Accessible Form Example

```tsx
function AccessibleRegistrationForm() {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm({
    shouldFocusError: true,
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Registration form" noValidate>
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive">
          Please fix {Object.keys(errors).length} errors
        </div>
      )}

      {isSubmitSuccessful && (
        <div role="status" aria-live="polite">
          Registration successful!
        </div>
      )}

      <div>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">{errors.email.message}</span>
        )}
      </div>

      <button type="submit">Register</button>
    </form>
  )
}
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Focus via DOM Instead of setFocus

```tsx
// ❌ Wrong -- direct DOM access
useEffect(() => {
  const firstError = Object.keys(errors)[0]
  if (firstError) {
    document.getElementById(firstError)?.focus()
  }
}, [errors])

// ✅ Correct -- use setFocus from RHF
const { setFocus } = useForm()
const onInvalid = (errors) => {
  const firstError = Object.keys(errors)[0]
  if (firstError) setFocus(firstError)
}
```

**Why this is a mistake:** `setFocus` already knows about all registered fields and doesn't require
binding to `id`. Also, `shouldFocusError: true` (enabled by default) automatically focuses the
first error field on submit.

---

### ❌ Mistake 2: Missing aria-invalid

```tsx
// ❌ Wrong -- screen reader doesn't know about the error
<input {...register('email')} />
{errors.email && <span>{errors.email.message}</span>}

// ✅ Correct -- with aria-invalid and aria-describedby
<input
  {...register('email')}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">{errors.email.message}</span>
)}
```

**Why this is a mistake:** Without `aria-invalid`, the screen reader won't inform the user the field
has an error. Without `aria-describedby`, it won't read the error text.

---

### ❌ Mistake 3: Forgot noValidate

```tsx
// ❌ Wrong -- native and RHF validation conflict
<form onSubmit={handleSubmit(onSubmit)}>
  <input type="email" {...register('email')} />
</form>

// ✅ Correct -- disable native validation
<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <input type="email" {...register('email')} />
</form>
```

**Why this is a mistake:** Without `noValidate`, the browser will show its built-in error messages
that conflict with RHF's custom errors and may be in the wrong language.

---

## Additional Resources

- [setFocus Documentation](https://react-hook-form.com/docs/useform/setfocus)
- [ARIA for Forms](https://www.w3.org/WAI/tutorials/forms/)
- [MDN: ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [shouldFocusError](https://react-hook-form.com/docs/useform#shouldFocusError)
