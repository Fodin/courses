# Level 7: Hooks as Architectural Tool — Detailed Guide

## Why extract logic into hooks?

Imagine a user search page. There's an input field, a results list, a loading indicator, an error message. We write the first version:

```tsx
function UserSearch() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    setError(null)
    fetch(`/api/users?q=${query}`)
      .then(r => r.json())
      .then(data => { setUsers(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [query])

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {loading && <span>Loading...</span>}
      {error && <span>Error: {error}</span>}
      <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  )
}
```

Looks fine for one component. But tomorrow there will be `ProductSearch` and `OrderSearch`. Each will copy these four `useState` and `useEffect`. And if we need to cancel the previous request (AbortController) — we need to update everywhere.

**Solution:** extract the logic into a hook once.

---

## useAsync: universal hook for async operations

### Why three states are inseparable?

`loading`, `data`, and `error` are not three independent states. They always describe one process. If `loading: true`, then `data` and `error` are irrelevant. If `error !== null`, then `loading: false`. They are **coupled**, and breaking this coupling creates bugs:

```tsx
// ❌ Three independent useState — desynchronization possible
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
const [error, setError] = useState(null)

// On quick double click: loading=true, then loading=true again,
// first request responds: loading=false, data=firstResult
// second request responds: loading=false, data=secondResult
// But what if the first responds AFTER the second? data=firstResult (stale data!)
```

The correct approach — store state as a single object describing the current "phase" of loading:

```tsx
type AsyncState<T> =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: T; error: null }
  | { status: 'error'; data: null; error: string }

// Or simplified version for most tasks:
interface AsyncState<T> {
  loading: boolean
  data: T | null
  error: string | null
}
```

### useAsync implementation

```tsx
function useAsync<T>(fn: () => Promise<T>, deps: React.DependencyList = []) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    data: null,
    error: null,
  })

  useEffect(() => {
    let cancelled = false  // flag to protect against race conditions

    setState({ loading: true, data: null, error: null })

    fn()
      .then(data => {
        if (!cancelled) setState({ loading: false, data, error: null })
      })
      .catch(err => {
        if (!cancelled) setState({ loading: false, data: null, error: err.message })
      })

    return () => { cancelled = true }  // cleanup: ignore response if component unmounted
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
```

The `cancelled` flag is a simple race condition solution. When the component unmounts (or `deps` change), the cleanup function sets `cancelled = true`. Old promises will still execute, but won't update state.

### useApi with AbortController

AbortController allows cancelling an HTTP request at the browser level — more effective than a flag because it stops actual data transfer:

```tsx
function useApi<T>(url: string) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    data: null,
    error: null,
  })

  const abortRef = useRef<AbortController | null>(null)

  const execute = useCallback(() => {
    // Cancel previous request before new one
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setState({ loading: true, data: null, error: null })

    fetch(url, { signal: abortRef.current.signal })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json() as Promise<T>
      })
      .then(data => setState({ loading: false, data, error: null }))
      .catch(err => {
        // AbortError is OK, don't show as error
        if (err.name !== 'AbortError') {
          setState({ loading: false, data: null, error: err.message })
        }
      })
  }, [url])

  // Cleanup on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  return { ...state, execute }
}
```

### UserSearch component — thin UI layer

After extracting logic into a hook, the component reduces to pure rendering:

```tsx
function UserSearch() {
  const [query, setQuery] = useState('')
  const { loading, data: users, error } = useApi<User[]>(
    query ? `/api/users?q=${query}` : ''
  )

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search..." />
      {loading && <Spinner />}
      {error && <ErrorMessage text={error} />}
      {users && <UserList users={users} />}
    </div>
  )
}
```

The component knows nothing about fetch, AbortController, loading flags. It only knows: there's a query string → there's a result (or loading, or error).

---

## useForm: form as state, not DOM

### The problem with uncontrolled forms

Many start with `ref` or read `event.target.value` directly. This works for simple forms, but as soon as validation appears, dependent fields, or programmatic reset — everything falls apart.

A controlled form stores values in state. This gives full control:

```
User types → onChange → setState → React re-renders input with new value
```

### Form state structure

A form is not a single value, but three groups of data:

```tsx
interface FormState<T> {
  values: T           // current field values
  errors: Partial<Record<keyof T, string>>   // validation errors
  touched: Partial<Record<keyof T, boolean>> // fields the user has visited
}
```

Why `touched`? To not show an error immediately when the form opens. We show a field error only if the user has already visited it (touched) or tried to submit the form.

### useForm implementation

```tsx
type Validator<T> = (values: T) => Partial<Record<keyof T, string>>

function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validate?: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Field change handler
  const handleChange = useCallback((field: keyof T, value: unknown) => {
    setValues(prev => ({ ...prev, [field]: value }))
    // Validate field on the fly if it was already touched
    if (touched[field] && validate) {
      const newValues = { ...values, [field]: value } as T
      const newErrors = validate(newValues)
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [values, touched, validate])

  // Blur handler — mark field as touched
  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    if (validate) {
      const newErrors = validate(values)
      setErrors(prev => ({ ...prev, [field]: newErrors[field] }))
    }
  }, [values, validate])

  // Form submit handler
  const handleSubmit = useCallback((
    onSubmit: (values: T) => void | Promise<void>
  ) => (e: React.FormEvent) => {
    e.preventDefault()
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Record<keyof T, boolean>
    )
    setTouched(allTouched)

    const validationErrors = validate ? validate(values) : {}
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true)
      Promise.resolve(onSubmit(values)).finally(() => setIsSubmitting(false))
    }
  }, [values, validate])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset }
}
```

### Component = pure rendering

```tsx
function RegistrationForm() {
  const form = useForm(
    { name: '', email: '', password: '' },
    values => {
      const errors: Record<string, string> = {}
      if (!values.name) errors.name = 'Name is required'
      if (!values.email.includes('@')) errors.email = 'Invalid email'
      if (values.password.length < 8) errors.password = 'Minimum 8 characters'
      return errors
    }
  )

  return (
    <form onSubmit={form.handleSubmit(values => console.log('Submit:', values))}>
      <input
        value={form.values.name}
        onChange={e => form.handleChange('name', e.target.value)}
        onBlur={() => form.handleBlur('name')}
      />
      {form.touched.name && form.errors.name && <span>{form.errors.name}</span>}
      {/* other fields similarly */}
      <button type="submit" disabled={form.isSubmitting}>Register</button>
    </form>
  )
}
```

The component contains no validation logic — it simply connects fields to the hook and renders errors.

---

## Hook composition: useDataTable

### Single responsibility principle

One hook — one task. `usePagination` counts pages. `useFilters` stores active filters. `useSorting` manages sorting. Each can be reused separately:

```tsx
// On users page — only pagination
const pagination = usePagination({ totalItems: users.length, pageSize: 10 })

// On products page — filters + pagination
const filters = useFilters({ category: '', minPrice: 0 })
const pagination = usePagination({ totalItems: filtered.length, pageSize: 20 })
```

### Composition via useDataTable

When everything is needed at once — create a composition hook:

```tsx
function useDataTable<T>(
  data: T[],
  options: { pageSize?: number; filterFn?: (item: T, filters: Filters) => boolean }
) {
  const sorting = useSorting<T>()
  const filters = useFilters({})

  // Apply filtering
  const filtered = useMemo(
    () => options.filterFn ? data.filter(item => options.filterFn!(item, filters.values)) : data,
    [data, filters.values, options.filterFn]
  )

  // Apply sorting
  const sorted = useMemo(
    () => sorting.sort(filtered),
    [filtered, sorting.sort]
  )

  // Apply pagination
  const pagination = usePagination({ totalItems: sorted.length, pageSize: options.pageSize ?? 10 })

  // Return current page data
  const pageData = useMemo(
    () => sorted.slice(pagination.offset, pagination.offset + pagination.pageSize),
    [sorted, pagination.offset, pagination.pageSize]
  )

  return { data: pageData, pagination, sorting, filters, totalCount: filtered.length }
}
```

The table component receives ready data and control functions — and only renders:

```tsx
function DataTable() {
  const table = useDataTable(EMPLOYEES, { pageSize: 5, filterFn: employeeFilter })

  return (
    <div>
      <FilterBar filters={table.filters} />
      <Table data={table.data} sorting={table.sorting} />
      <Pagination pagination={table.pagination} total={table.totalCount} />
    </div>
  )
}
```

---

## Testing hooks

Hooks with extracted logic are significantly easier to test than components. No DOM needed, no rendering — just call the hook and check the result.

With `@testing-library/react-hooks` library (or `renderHook` from `@testing-library/react` in React 18):

```tsx
import { renderHook, act } from '@testing-library/react'

test('useForm validates email', () => {
  const { result } = renderHook(() =>
    useForm(
      { email: '' },
      values => (values.email.includes('@') ? {} : { email: 'Invalid email' })
    )
  )

  // Change value and mark field as touched
  act(() => {
    result.current.handleChange('email', 'not-an-email')
    result.current.handleBlur('email')
  })

  expect(result.current.errors.email).toBe('Invalid email')

  // Fix the value
  act(() => {
    result.current.handleChange('email', 'user@example.com')
  })

  expect(result.current.errors.email).toBeUndefined()
})
```

Logic tested without a single `render(<Component />)`.

---

## Best practices

📌 **A hook must have a clear contract.** Clearly type input parameters and return value. If it's hard to describe what a hook returns — it probably does too much.

💡 **Return an object, not a tuple, if there are more than two values.** `const { data, loading, error } = useAsync(...)` reads better than `const [data, loading, error, execute] = useAsync(...)`.

🔥 **Memoize derived values inside the hook.** If a hook computes `filtered`, wrap in `useMemo` — otherwise the component will re-render on every call.

⚠️ **Don't create a hook just for the sake of it.** If logic isn't reused anywhere and fits in 5 lines — you can leave it in the component.

🎯 **Watch useEffect and useCallback dependencies.** The `react-hooks/exhaustive-deps` ESLint tool will help not miss dependencies and avoid stale closures.
