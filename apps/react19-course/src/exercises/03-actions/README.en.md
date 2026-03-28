# Level 3: Actions — Forms in React 19

## Introduction

React 19 fundamentally changes how forms are handled. Instead of manually managing state with `useState` + `onSubmit`, you can now use **Actions** — functions passed directly to `<form action={fn}>`. This simplifies code, improves UX, and supports progressive enhancement.

---

## 1. The Actions Concept

### What Is an Action?

An Action is an async function that processes form data. In React 19, the `<form>` element accepts an `action` prop to which such a function can be passed:

```tsx
async function handleSubmit(formData: FormData) {
  const name = formData.get('name') as string
  await saveToServer({ name })
}

function MyForm() {
  return (
    <form action={handleSubmit}>
      <input name="name" type="text" />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Advantages Over the Classic Approach

| React 18 (classic)                    | React 19 (Actions)                    |
| ------------------------------------- | ------------------------------------- |
| `onSubmit` + `e.preventDefault()`     | `action={fn}` — no preventDefault    |
| Manual `useState` for loading         | `isPending` from `useActionState`     |
| `e.target.elements` or ref for data   | `FormData` is provided automatically  |
| Does not work without JS              | Progressive enhancement out of the box |

---

## 2. `<form action={fn}>` — Passing a Function

### Syntax

```tsx
<form action={asyncFunction}>
```

The function receives `FormData` as an argument:

```tsx
async function myAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const result = await loginUser(email, password)
  // handle result...
}
```

### Important Details

- The form is automatically reset after the action completes successfully
- `FormData` contains all fields with a `name` attribute
- Use `formData.getAll('field')` for multi-select fields
- No need for `e.preventDefault()` — React handles this automatically

---

## 3. `useActionState` — Managing Form State

### API

```tsx
import { useActionState } from 'react'

const [state, formAction, isPending] = useActionState(actionFn, initialState)
```

- **`state`** — the current state (result of the last action call)
- **`formAction`** — the function to pass to `<form action={...}>`
- **`isPending`** — `true` while the action is running

### Action Function

```tsx
async function submitAction(
  previousState: FormState,
  formData: FormData
): Promise<FormState> {
  const name = formData.get('name') as string

  if (!name) {
    return { error: 'Name is required', success: false }
  }

  await saveToServer({ name })
  return { error: null, success: true }
}
```

### Full Example

```tsx
interface FormState {
  error: string | null
  success: boolean
}

const initialState: FormState = { error: null, success: false }

async function registerAction(prev: FormState, formData: FormData): Promise<FormState> {
  const email = formData.get('email') as string

  if (!email.includes('@')) {
    return { error: 'Invalid email', success: false }
  }

  await fetch('/api/register', {
    method: 'POST',
    body: formData,
  })

  return { error: null, success: true }
}

function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <form action={formAction}>
      <input name="email" type="email" required />
      <button disabled={isPending}>
        {isPending ? 'Registering...' : 'Register'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">Success!</p>}
    </form>
  )
}
```

> **Important:** `useActionState` replaces `useFormState` from `react-dom` (canary). In stable React 19, use `useActionState` from `react`.

---

## 4. `useFormStatus` — Form Status in Child Components

### API

```tsx
import { useFormStatus } from 'react-dom'

const { pending, data, method, action } = useFormStatus()
```

- **`pending`** — `true` while the form is submitting
- **`data`** — `FormData` of the form being submitted (or `null`)
- **`method`** — HTTP method (`'get'` or `'post'`)
- **`action`** — reference to the action function

### Constraint

`useFormStatus` **must** be called inside a component that is a child of `<form>`:

```tsx
// Correct — a separate component inside the form
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  )
}

function MyForm() {
  return (
    <form action={myAction}>
      <input name="email" />
      <SubmitButton />   {/* SubmitButton is a child of form */}
    </form>
  )
}
```

```tsx
// Incorrect — called in the same component as the form
function MyForm() {
  const { pending } = useFormStatus() // Won't work!
  return <form action={myAction}>...</form>
}
```

---

## 5. Progressive Enhancement

React 19 Actions are designed for progressive enhancement — forms work even without JavaScript:

```tsx
function ContactForm() {
  const [state, formAction] = useActionState(submitContact, initialState)

  return (
    <form action={formAction} method="post">
      <input type="hidden" name="source" value="contact-page" />
      <input name="name" type="text" required autoComplete="name" />
      <input name="email" type="email" required autoComplete="email" />
      <textarea name="message" required />
      <button type="submit">Submit</button>
    </form>
  )
}
```

### Key Principles

1. Use native form elements with the `name` attribute
2. Add `hidden` inputs for extra data
3. Specify `method="post"` for compatibility
4. Use `autoComplete` to improve UX
5. Validate through native attributes (`required`, `type="email"`, `min`, `max`)

---

## Summary

| Tool             | Purpose                                    |
| ---------------- | ------------------------------------------ |
| `form action`    | Pass an async function to a form           |
| `useActionState` | Form state + isPending + validation        |
| `useFormStatus`  | Submission status in child components      |
| Progressive enh. | Forms that work without JavaScript         |
