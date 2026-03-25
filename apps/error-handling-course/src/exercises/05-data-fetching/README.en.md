# 🔥 Level 5: Error Handling in Data Fetching

## 🎯 Introduction

Data fetching is one of the main sources of errors in web applications. Networks are unreliable, servers crash, APIs change. Proper error handling during data fetching is critical for UX.

## ⚠️ Peculiarities of fetch API

### 🐛 fetch Does NOT Throw on HTTP 4xx/5xx!

This is the most common gotcha:

```javascript
// ❌ fetch throws only on network problems
// HTTP 404, 500, etc. are NOT errors for fetch!

const response = await fetch('/api/users/999')
console.log(response.ok)     // false
console.log(response.status) // 404
// But there was no error! The promise resolved successfully
```

> Why this is a gotcha: developers from other languages/libraries (axios, jQuery) are used to HTTP errors throwing an exception. With `fetch`, code continues as if everything is fine — and later crashes when trying to process non-existent data.

### ✅ Correct Pattern

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}
```

### 📌 Types of fetch Errors

| Situation | Error Type | `response.ok` |
|----------|-----------|---------------|
| No network | `TypeError` | N/A (promise rejected) |
| DNS not found | `TypeError` | N/A |
| Timeout (AbortController) | `AbortError` | N/A |
| HTTP 404 | ⚠️ No error | `false` |
| HTTP 500 | ⚠️ No error | `false` |
| Malformed JSON | `SyntaxError` | `true` |

## 🔥 ApiError Class

```typescript
class ApiError extends Error {
  status: number
  code: string
  details?: Record<string, unknown>

  constructor(status: number, code: string, message: string, details?: Record<string, unknown>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

async function apiCall<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new ApiError(
      response.status,
      body.code ?? 'UNKNOWN',
      body.message ?? response.statusText,
      body.details
    )
  }

  return response.json()
}
```

## 🔥 Loading/Error/Success Pattern

### State Typing

```typescript
type FetchState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### 💡 useFetch Hook

```typescript
function useFetch<T>(fetchFn: () => Promise<T>) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  const execute = useCallback(async () => {
    setState({ status: 'loading' })
    try {
      const data = await fetchFn()
      setState({ status: 'success', data })
    } catch (error) {
      setState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }, [fetchFn])

  return { state, execute }
}
```

### Usage in Component

```tsx
function UserList() {
  const { state, execute } = useFetch(fetchUsers)

  useEffect(() => { execute() }, [execute])

  switch (state.status) {
    case 'idle':
    case 'loading':
      return <Spinner />
    case 'error':
      return (
        <ErrorMessage
          message={state.error}
          onRetry={execute}
        />
      )
    case 'success':
      return <UserTable users={state.data} />
  }
}
```

## 💡 Retry on Fetch

```typescript
async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn()
    } catch (error) {
      if (attempt === maxRetries) throw error

      // ⚠️ Don't retry client errors (4xx)
      if (error instanceof ApiError && error.status < 500) throw error

      await new Promise(r => setTimeout(r, delay * attempt))
    }
  }
  throw new Error('Unreachable')
}
```

## 🔥 AbortController for Cancellation

```typescript
function useAbortableFetch<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({ status: 'idle' })

  useEffect(() => {
    const controller = new AbortController()

    async function load() {
      setState({ status: 'loading' })
      try {
        const res = await fetch(url, { signal: controller.signal })
        const data = await res.json()
        setState({ status: 'success', data })
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return // Request cancelled — do nothing
        }
        setState({
          status: 'error',
          error: error instanceof Error ? error.message : 'Error',
        })
      }
    }

    load()
    return () => controller.abort()
  }, [url])

  return state
}
```

## ⚠️ Common Beginner Mistakes

### ❌ Not Checking `response.ok`

```typescript
// ❌ Bad: fetch resolves even on 404/500
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  const data = await response.json() // 💥 May parse HTML error page!
  return data
}
```

> Why this is an error: on HTTP 404 or 500, `fetch` does **not** throw an exception. The promise resolves successfully, and `response.json()` tries to parse the server's HTML error page as JSON — you get `SyntaxError`. If the server returns error JSON, the code processes error data as valid data.

```typescript
// ✅ Good: check response status
async function getUser(id: string) {
  const response = await fetch(`/api/users/${id}`)
  if (!response.ok) {
    throw new ApiError(response.status, 'FETCH_ERROR', response.statusText)
  }
  return response.json()
}
```

### ❌ Retry for Client Errors (4xx)

```typescript
// ❌ Bad: endlessly retry requests that will never work
async function fetchWithBadRetry<T>(url: string): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await apiCall<T>(url)
    } catch {
      await new Promise(r => setTimeout(r, 1000))
      // Retry ALL errors, including 400, 401, 404...
    }
  }
  throw new Error('Failed')
}
```

> Why this is an error: 4xx errors are client errors (bad request, no auth, resource not found). Retrying **changes nothing** — the server will respond the same. You waste the user's time and burden the server with pointless requests.

```typescript
// ✅ Good: retry only server errors (5xx) and network
async function fetchWithSmartRetry<T>(url: string): Promise<T> {
  for (let i = 0; i < 3; i++) {
    try {
      return await apiCall<T>(url)
    } catch (error) {
      if (error instanceof ApiError && error.status < 500) throw error // 4xx — don't retry
      if (i === 2) throw error
      await new Promise(r => setTimeout(r, 1000 * (i + 1)))
    }
  }
  throw new Error('Failed')
}
```

### ❌ Forget to Handle `AbortError` on Cancellation

```typescript
// ❌ Bad: AbortError sets error state
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setState({ status: 'success', data }))
    .catch(error => {
      // 💥 setState called on unmounted component on unmount
      setState({ status: 'error', error: error.message })
    })
  return () => controller.abort()
}, [url])
```

> Why this is an error: on unmount, `controller.abort()` throws `AbortError`. Without filtering this error, you get: 1) false error state 2) React warning about setState on unmounted component 3) error flashing in UI on quick navigation.

```typescript
// ✅ Good: filter AbortError
useEffect(() => {
  const controller = new AbortController()
  fetch(url, { signal: controller.signal })
    .then(res => res.json())
    .then(data => setState({ status: 'success', data }))
    .catch(error => {
      if (error.name === 'AbortError') return // Cancellation — not an error
      setState({ status: 'error', error: error.message })
    })
  return () => controller.abort()
}, [url])
```

## 📌 Summary

- ⚠️ `fetch` doesn't throw on HTTP 4xx/5xx — check `response.ok`
- ✅ Create `ApiError` with code and details for typed handling
- ✅ Use discriminated union `FetchState<T>` to model states
- ✅ Retry only server errors (5xx), not client errors (4xx)
- ✅ Use `AbortController` to cancel requests on unmount
- 💡 Always filter `AbortError` when using `AbortController`
