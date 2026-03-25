# 🔥 Level 2: Asynchronous Errors

## 🎯 Introduction

Asynchronous code is the heart of JavaScript. Requests to servers, timers, file operations — all of this is asynchronous. And errors in asynchronous code behave differently than in synchronous code.

## 🔥 Promises and Errors

### .then/.catch

```javascript
fetch('/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error))
```

### Error in a promise chain

If an error occurs in any `.then`, it "falls through" to the nearest `.catch`:

```javascript
Promise.resolve('data')
  .then(data => {
    throw new Error('Processing error')
  })
  .then(() => console.log('Will not execute'))
  .catch(err => console.log('Caught:', err.message))
  .then(() => console.log('Will execute after catch'))
```

### Promise.reject

```javascript
const failed = Promise.reject(new Error('Error'))
// Equivalent to:
const also = new Promise((_, reject) => reject(new Error('Error')))
```

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

## 📌 Promise Combinators

### Promise.all — "all or nothing"

Rejects on first error:

```typescript
try {
  const [users, posts] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
  ])
} catch (error) {
  // ⚠️ One operation failed — don't know which one
}
```

### Promise.allSettled — "get all results"

Always completes successfully, returns status of each promise:

```typescript
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
])

for (const result of results) {
  if (result.status === 'fulfilled') {
    console.log('Data:', result.value)
  } else {
    console.log('Error:', result.reason.message)
  }
}
```

💡 Use `Promise.allSettled` when you need to execute several independent operations and get the result of each one, even if some of them fail.

### Promise.race — "first responder"

```typescript
const result = await Promise.race([
  fetchData(),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), 5000)
  ),
])
```

### Promise.any — "first successful"

```typescript
try {
  const data = await Promise.any([
    fetchFromServer1(),
    fetchFromServer2(),
    fetchFromServer3(),
  ])
} catch (error) {
  // AggregateError — all promises rejected
  if (error instanceof AggregateError) {
    console.log('All servers unavailable:', error.errors)
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

### 🐛 2. Unhandled promise rejection

```javascript
// ❌ Bad — unhandled rejection
async function bad() {
  throw new Error('Oops')
}
bad() // UnhandledPromiseRejection!
```

> **Why this is an error:** if a promise is rejected and there's no `.catch()` handler, the runtime generates `unhandledrejection`. In Node.js this leads to process termination (starting with Node 15+). In the browser — to a console error and potentially unpredictable application behavior.

```javascript
// ✅ Good
bad().catch(console.error)
```

### 🐛 3. Silent error swallowing with return null

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

### 🐛 4. Using Promise.all without considering partial results

```typescript
// ❌ Bad — one failure loses all results
try {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ])
} catch (error) {
  // Don't know what succeeded and what failed
  showError('Failed to load data')
}
```

> **Why this is an error:** `Promise.all` rejects on first error, and you lose the results of the other promises that might have completed successfully. If the requests are independent of each other — the user won't see the data that actually loaded.

```typescript
// ✅ Good — use allSettled for independent requests
const results = await Promise.allSettled([
  fetchUsers(),
  fetchPosts(),
  fetchComments(),
])
const [users, posts, comments] = results.map(r =>
  r.status === 'fulfilled' ? r.value : null
)
```

## 📌 Summary

- ✅ `.catch()` catches errors in promise chains
- ✅ `try/catch` + `await` — the main pattern for async/await
- 💡 `Promise.allSettled` — when you need results from all operations
- 💡 `Promise.any` + `AggregateError` — first successful from several
- 🔥 `retry` — automatic retries on failures
- ⚠️ Always put `await` in `try/catch` — without it, catch doesn't work
