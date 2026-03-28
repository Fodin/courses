# Level 13: Submission and Auto-save

## Introduction

Form submission with loading/error state handling and draft auto-saving are key patterns for
production forms. In this level, you'll learn to properly handle submit, show success/error
notifications, and implement debounce auto-save.

---

## Submit with Loading/Error States

### Using isSubmitting from formState

React Hook Form provides `isSubmitting` via `formState`. If `onSubmit` returns a Promise, RHF
automatically manages this state:

```tsx
function SubmitForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    // isSubmitting is automatically true while the Promise is pending
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} disabled={isSubmitting} />
      <input {...register('email')} disabled={isSubmitting} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### Error Handling via setError

```tsx
function SubmitWithErrorHandling() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()

        if (errorData.field) {
          setError(errorData.field, { message: errorData.message })
        } else {
          setError('root', { message: errorData.message || 'Submit error' })
        }
      }
    } catch (err) {
      setError('root', { message: 'Network error. Please try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          {errors.root.message}
        </div>
      )}

      <input {...register('name')} />
      <input {...register('email')} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## Success Notifications

```tsx
function SubmitWithNotification() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      setSuccess(true)
      reset()

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Submit error',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {success && (
        <div role="status" aria-live="polite" style={{ background: '#d1e7dd', padding: '1rem' }}>
          Successfully submitted!
        </div>
      )}

      {errors.root && (
        <div role="alert" style={{ background: '#f8d7da', padding: '1rem' }}>
          {errors.root.message}
        </div>
      )}

      <input {...register('name')} disabled={isSubmitting} />
      <input {...register('email')} disabled={isSubmitting} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

---

## Debounce for Auto-save

### Basic Debounce

```tsx
function AutoSaveForm() {
  const { register, watch } = useForm()
  const values = watch()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-saved:', values)
      localStorage.setItem('draft', JSON.stringify(values))
      setSaved(true)

      setTimeout(() => setSaved(false), 2000)
    }, 1000) // 1 second debounce

    return () => clearTimeout(timer) // Cleanup is required!
  }, [values])

  return (
    <form>
      <textarea {...register('content')} />
      {saved && <div style={{ color: 'green' }}>Saved</div>}
    </form>
  )
}
```

---

## useDebounce Hook

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Usage for search
function SearchForm() {
  const { register, watch } = useForm()
  const searchQuery = watch('query')
  const debouncedQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <form>
      <input {...register('query')} placeholder="Search..." />
    </form>
  )
}
```

---

## Auto-save Status Indicator

```tsx
function DraftForm() {
  const { register, watch } = useForm()
  const values = watch()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setStatus('saving')

      try {
        await fetch('/api/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        setStatus('saved')

        setTimeout(() => setStatus('idle'), 2000)
      } catch (error) {
        setStatus('error')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [values])

  return (
    <form>
      <textarea {...register('content')} />

      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {status === 'saving' && 'Saving...'}
        {status === 'saved' && 'Saved'}
        {status === 'error' && 'Save error'}
      </div>
    </form>
  )
}
```

---

## Common Beginner Mistakes

### ❌ Mistake 1: No Loading Handling

```tsx
// ❌ Wrong -- button active during submit
<button type="submit">Submit</button>

// ✅ Correct -- show state
const { formState: { isSubmitting } } = useForm()
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Submitting...' : 'Submit'}
</button>
```

**Why this is a mistake:** The user may submit the form multiple times if the loading state isn't
visible and the button isn't disabled.

---

### ❌ Mistake 2: Debounce Without Cleanup

```tsx
// ❌ Wrong -- memory leak
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Search:', values)
  }, 500)
  // no cleanup!
})

// ✅ Correct -- cleanup timer
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Search:', values)
  }, 500)
  return () => clearTimeout(timer)
}, [values])
```

**Why this is a mistake:** Without cleanup, a new timer is created on every change while old ones
are never canceled -- leading to memory leaks and multiple requests.

---

### ❌ Mistake 3: No API Error Handling

```tsx
// ❌ Wrong -- error ignored
const onSubmit = async (data) => {
  await fetch('/api/submit', { body: JSON.stringify(data) })
}

// ✅ Correct -- try/catch with setError
const onSubmit = async (data) => {
  try {
    const res = await fetch('/api/submit', { body: JSON.stringify(data) })
    if (!res.ok) throw new Error('Server error')
  } catch (err) {
    setError('root', { message: 'Network error. Please try again.' })
  }
}
```

**Why this is a mistake:** The network can fail, the server may return an error. The user should see
a clear message, not a stuck button.

---

### ❌ Mistake 4: Multiple Submits Without Blocking

```tsx
// ❌ Wrong -- form submits again on rapid clicking
const onSubmit = async (data) => {
  await saveData(data) // May execute multiple times!
}

// ✅ Correct -- use isSubmitting to block
<button type="submit" disabled={isSubmitting}>
  Submit
</button>
// handleSubmit won't call onSubmit again while the previous Promise is pending
```

**Why this is a mistake:** `handleSubmit` in RHF automatically blocks re-invocation if `onSubmit`
returns a Promise. But visually the button should be disabled via `disabled`, otherwise the user
doesn't know submission is in progress.

---

## Additional Resources

- [handleSubmit Documentation](https://react-hook-form.com/docs/useform/handlesubmit)
- [setError Documentation](https://react-hook-form.com/docs/useform/seterror)
- [formState: isSubmitting](https://react-hook-form.com/docs/useform/formstate)
- [errors.root](https://react-hook-form.com/docs/useform/formstate#root)
