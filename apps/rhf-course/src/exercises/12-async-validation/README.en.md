# Level 12: Async Validation and Data Loading

## Introduction

Real forms often require server interaction: checking if a username is taken, loading data for
editing, handling loading errors. In this level, you'll learn to implement async field validation
and load data into forms using different approaches.

---

## Async Field Validation

### Basic Async Validation via validate

```tsx
import { useForm } from 'react-hook-form'

const validateUsername = async (value: string) => {
  // Simulate server request
  await new Promise(resolve => setTimeout(resolve, 500))

  const takenUsernames = ['admin', 'user', 'test']
  if (takenUsernames.includes(value.toLowerCase())) {
    return 'Username is taken'
  }

  return true
}

function RegistrationForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', {
          required: 'Required',
          validate: validateUsername,
        })}
      />
      <button type="submit">Register</button>
    </form>
  )
}
```

### Async Validation with onBlur and Indicator

```tsx
function AsyncValidationForm() {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)

  const validateUsername = async (value: string) => {
    if (!value || value.length < 3) return

    setChecking(true)

    try {
      const response = await fetch(`/api/check-username?username=${value}`)
      const { available } = await response.json()

      setAvailable(available)

      if (!available) {
        setError('username', {
          type: 'manual',
          message: 'Username is taken',
        })
      } else {
        clearErrors('username')
      }
    } catch (error) {
      setError('username', { type: 'manual', message: 'Check failed' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <form>
      <input {...register('username')} onBlur={e => validateUsername(e.target.value)} />

      {checking && <span>Checking...</span>}
      {available === true && <span>Available</span>}
      {available === false && <span>Taken</span>}

      {errors.username && <span className="error">{errors.username.message}</span>}
    </form>
  )
}
```

---

## Async Validation with Zod

```tsx
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3, 'Minimum 3 characters'),
})

// Async validation via refine
const schemaWithAsync = schema.refine(
  async data => {
    const response = await fetch(`/api/check-username?username=${data.username}`)
    const { available } = await response.json()
    return available
  },
  {
    message: 'Username is taken',
    path: ['username'],
  }
)

// Usage
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schemaWithAsync),
  mode: 'onChange',
})
```

---

## Loading Data (Edit Mode)

### async defaultValues and isLoading

React Hook Form allows passing an **async function** to `defaultValues`. This eliminates the need
to manually manage loading state and call `reset`:

```tsx
function EditForm() {
  const {
    register,
    handleSubmit,
    formState: { isLoading, isDirty },
  } = useForm({
    defaultValues: async () => {
      const response = await fetch('/api/user/1')
      return response.json()
    },
  })

  // isLoading === true while async defaultValues is resolving
  if (isLoading) return <div>Loading data...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />

      <button type="submit" disabled={!isDirty}>
        Save {isDirty && '*'}
      </button>
    </form>
  )
}
```

> 📌 **`isLoading`** is a `formState` property that is `true` only when `defaultValues` is an async
> function and data is still loading. This is **not** `isSubmitting` -- `isLoading` relates only to
> the initial loading of form values.

---

### values for Syncing with External State

If form data comes from an external source (SWR, React Query, Redux), use the `values` option. The
form will automatically update when `values` changes:

```tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function EditForm() {
  const { data, isLoading: isDataLoading } = useSWR('/api/user/1', fetcher)

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    values: data, // Form updates when data changes
  })

  if (isDataLoading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />

      <button type="submit" disabled={!isDirty}>
        Save {isDirty && '*'}
      </button>
    </form>
  )
}
```

> **Difference between `values` and async `defaultValues`:**
> - `defaultValues` (async) -- loads data **once** on form initialization
> - `values` -- **syncs** the form with external state. Each time `values` changes, the form
>   updates (similar to calling `reset(values)`)

---

### Loading Data via reset (Classic Approach)

```tsx
function EditForm() {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/1')
      .then(res => res.json())
      .then(data => {
        reset(data)
        setLoading(false)
      })
  }, [reset])

  if (loading) return <div>Loading...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit" disabled={!isDirty}>Save</button>
    </form>
  )
}
```

---

## Error Handling on Load

```tsx
function EditFormWithErrorHandling() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/user/1')
        if (!response.ok) throw new Error('Failed to load data')

        const data = await response.json()
        reset(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [reset])

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>

  return <form onSubmit={handleSubmit(onSubmit)}>{/* form fields */}</form>
}
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: Async Validation Without Indicator

```tsx
// ❌ Wrong -- user waits without feedback
validate: async (value) => {
  const response = await fetch(`/api/check?username=${value}`)
  return response.json()
}

// ✅ Correct -- show status
const [checking, setChecking] = useState(false)
// + indicator in JSX
{checking && <span>Checking...</span>}
```

**Why this is a mistake:** The user doesn't understand what's happening during validation. A visual
indicator (spinner, text) is needed.

---

### ❌ Mistake 2: reset After Loading Without Error Handling

```tsx
// ❌ Wrong -- loading error is ignored
useEffect(() => {
  fetch('/api/user/1')
    .then(res => res.json())
    .then(reset)
}, [reset])

// ✅ Correct -- error handling
useEffect(() => {
  fetch('/api/user/1')
    .then(res => {
      if (!res.ok) throw new Error('Failed to load')
      return res.json()
    })
    .then(reset)
    .catch(err => setLoadError(err.message))
}, [reset])
```

**Why this is a mistake:** If loading fails, the form will remain empty without explanation. The
user won't understand what happened.

---

### ❌ Mistake 3: isLoading with Regular defaultValues

```tsx
// ❌ Wrong -- isLoading won't be true
const { formState: { isLoading } } = useForm({
  defaultValues: { name: '', email: '' }, // Regular object, not async
})
// isLoading is always false!

// ✅ Correct -- isLoading only works with async defaultValues
const { formState: { isLoading } } = useForm({
  defaultValues: async () => {
    const res = await fetch('/api/user/1')
    return res.json()
  },
})
```

**Why this is a mistake:** `isLoading` is designed only for async `defaultValues`. With a regular
object, it will always be `false`.

---

## Additional Resources

- [Async defaultValues](https://react-hook-form.com/docs/useform#defaultValues)
- [values Option](https://react-hook-form.com/docs/useform#values)
- [formState: isLoading](https://react-hook-form.com/docs/useform/formstate#isLoading)
- [setError Documentation](https://react-hook-form.com/docs/useform/seterror)
