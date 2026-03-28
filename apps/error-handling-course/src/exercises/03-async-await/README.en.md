# 🔥 Level 3: async/await and Error Handling

## 🎯 Introduction

`async/await` allows you to write asynchronous code as if it were synchronous. And error handling through `try/catch` becomes natural and clear. At this level, we'll also explore the retry pattern for automatic retry attempts.

## 🔥 async/await and try/catch

`async/await` allows you to handle asynchronous errors the same way as synchronous ones:

```typescript
async function loadUser(id: number) {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    if (error instanceof Error) {
      console.error('Failed to load:', error.message)
    }
    throw error // Re-throw
  } finally {
    console.log('Request completed')
  }
}
```

### Sequential requests

If one of the sequential `await` fails, the rest won't execute:

```typescript
async function loadDashboard() {
  try {
    const user = await fetchUser()     // ✅
    const posts = await fetchPosts()   // ❌ Error!
    const stats = await fetchStats()   // ⛔ Won't execute
    return { user, posts, stats }
  } catch (error) {
    // Handling
  }
}
```

## 🎯 Retry Pattern

Retrying on error:

```typescript
async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  delay: number
): Promise<T> {
  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      if (attempt < maxAttempts) {
        await new Promise(r => setTimeout(r, delay))
      }
    }
  }

  throw lastError
}

// Usage
const data = await retry(() => fetch('/api/data'), 3, 1000)
```

### Exponential backoff

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts: number
): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === maxAttempts - 1) throw error
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000)
      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}
```

## ⚠️ Common Beginner Mistakes

### 🐛 1. Forgotten await

```typescript
// ❌ Bad
try {
  fetchData() // Promise not awaited — catch won't catch it!
} catch (error) {
  // This catch won't fire for the promise
}
```

> **Why this is an error:** without `await`, the function `fetchData()` returns a promise, but `try/catch` only works with synchronous exceptions. The promise will reject "in the background", `catch` won't catch anything, and you'll get `UnhandledPromiseRejection`. The error will happen, but the handler won't know about it.

```typescript
// ✅ Good
try {
  await fetchData()
} catch (error) {
  // Now it will catch
}
```

### 🐛 2. Silent error swallowing with return null

```typescript
// ❌ Bad — calling code won't know about the error
async function loadData() {
  try {
    return await fetch('/api')
  } catch (error) {
    console.log('error')
    return null // Silently return null
  }
}
```

> **Why this is an error:** the calling code gets `null` and can't distinguish between "no data" and "a network error occurred". This leads to a cascade of problems: `Cannot read properties of null` in components, wrong UI state, inability to show the user an appropriate message. The decision on how to handle an error should be made by the calling code.

```typescript
// ✅ Good — let the calling code decide
async function loadData() {
  try {
    return await fetch('/api')
  } catch (error) {
    console.error('loadData failed:', error)
    throw error
  }
}
```

## 📌 Summary

- ✅ `try/catch` + `await` — the main pattern for async/await
- ✅ `finally` always executes — convenient for cleanup
- 🔥 `retry` — automatic retries on failures
- 💡 Exponential backoff reduces server load
- ⚠️ Always put `await` in `try/catch` — without it, catch doesn't work
- ⚠️ Don't swallow errors silently — re-throw or handle explicitly
