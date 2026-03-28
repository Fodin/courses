# 🔥 Level 7: Forms and User Input

## Introduction

Forms are the primary way users interact with an application. Input errors are inevitable, and their proper display determines the quality of UX.

🎯 **Level Goal:** learn to validate forms, map server errors to fields, and make forms accessible.

## 🔥 Client-side Validation

### Validation Function

```typescript
interface ValidationErrors {
  [field: string]: string[]
}

function validate(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.name.trim()) {
    errors.name = ['Name is required']
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ['Invalid email']
  }

  return errors
}
```

### When to Validate

| Moment | Pattern | When to Use |
|--------|---------|-------------------|
| On submit | Check all fields at once | Simple forms |
| On blur | Check field on focus loss | Complex forms |
| On change (after submit) | Remove errors when correcting | 🎯 Best UX |

## 🔥 Server Errors

The server can return validation errors that the client cannot check:

```typescript
interface ServerError {
  field: string
  message: string
}

async function submitForm(data: FormData) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.status === 422) {
      const { errors } = await response.json() as { errors: ServerError[] }
      // Map server errors to form fields
      const mapped: Record<string, string> = {}
      for (const err of errors) {
        mapped[err.field] = err.message
      }
      setServerErrors(mapped)
      return
    }

    if (!response.ok) {
      throw new Error('Server error')
    }
  } catch (error) {
    // Network error
    setGlobalError('No connection to server')
  }
}
```

## Error Display Patterns

### 1. Inline — under the field

```jsx
<input aria-invalid={!!error} />
{error && <span className="error">{error}</span>}
```

### 2. Summary — above the form

```jsx
{errors.length > 0 && (
  <div role="alert">
    <h4>Fix errors:</h4>
    <ul>
      {errors.map(e => <li key={e.field}>{e.message}</li>)}
    </ul>
  </div>
)}
```

### 3. Toast/notification

For server errors not related to a specific field.

💡 **Tip:** combine inline errors and summary — inline errors show what's wrong, and summary helps see the full picture quickly.

## ♿ Accessibility (a11y)

### Required Attributes

```jsx
<label htmlFor="email">
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(required)</span>
</label>
<input
  id="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert">
    {error}
  </p>
)}
```

### 🎯 Focus on Error

On submit, focus the first field with an error:

```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  const errors = validate(formData)

  if (Object.keys(errors).length > 0) {
    // Focus on first error field
    const firstErrorField = Object.keys(errors)[0]
    document.getElementById(firstErrorField)?.focus()
  }
}
```

### aria-live for Dynamic Errors

```jsx
<div aria-live="polite" aria-atomic="true">
  {error && <p role="alert">{error}</p>}
</div>
```

## ⚠️ Common Beginner Mistakes

### 1. ❌ Validation Only on Submit, Without Feedback When Correcting

```typescript
// ❌ Bad — errors only show on submit
const handleSubmit = () => {
  const errors = validate(data)
  setErrors(errors)
}
```

**Why this is an error:** The user corrects the field, but the error doesn't disappear until the next submit. This is confusing — it's unclear whether the problem has been fixed.

```typescript
// ✅ Good — remove error when field changes
const handleChange = (field: string, value: string) => {
  setData(prev => ({ ...prev, [field]: value }))
  // Remove error for changed field
  if (errors[field]) {
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }
}
```

### 2. ❌ Showing Server Errors Without Binding to Fields

```typescript
// ❌ Bad — all server errors in one alert
catch (error) {
  setError('An error occurred')
}
```

**Why this is an error:** The user doesn't understand which field is filled incorrectly. They have to guess or re-check the entire form.

```typescript
// ✅ Good — map server errors to specific fields
if (response.status === 422) {
  const { errors } = await response.json()
  const mapped: Record<string, string> = {}
  for (const err of errors) {
    mapped[err.field] = err.message
  }
  setFieldErrors(mapped)
}
```

### 3. ❌ Missing `aria-invalid` and `aria-describedby`

```jsx
// ❌ Bad — screen reader doesn't know about error
<input />
{error && <span className="error">{error}</span>}
```

**Why this is an error:** Screen reader users don't learn that the field contains an error. Visually the error is visible, but programmatically it's not. This violates WCAG.

```jsx
// ✅ Good — screen reader will announce error
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert">{error}</p>
)}
```

### 4. ❌ Not Clearing Server Errors on Resubmit

```typescript
// ❌ Bad — server errors not cleared before new request
const handleSubmit = async () => {
  const clientErrors = validate(data)
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors)
    return
  }
  await submitToServer(data)
}
```

**Why this is an error:** If the user corrects the data and submits the form again, old server errors remain on the screen along with the new response. This is confusing.

```typescript
// ✅ Good — clear server errors before resubmitting
const handleSubmit = async () => {
  setServerErrors({}) // Clear before sending
  const clientErrors = validate(data)
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors)
    return
  }
  await submitToServer(data)
}
```

## 📌 Summary

- ✅ Validate on submit, remove errors on change
- ✅ Map server errors to form fields
- ✅ Use `aria-invalid`, `aria-describedby`, `role="alert"`
- ✅ Focus the first error field on submit
- ✅ Combine inline and summary errors for better UX
- ✅ Clear server errors before resubmitting
