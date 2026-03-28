# 🔥 Level 2: Promise Errors

## 🎯 Introduction

Asynchronous code is the heart of JavaScript. Requests to servers, timers, file operations — all of this is asynchronous. And errors in asynchronous code behave differently than in synchronous code.

At this level, we'll explore how errors work with the Promise API: `.then/.catch`, promise chains, and Promise combinators.

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

## ⚠️ Common Beginner Mistakes

### 🐛 1. Unhandled promise rejection

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

### 🐛 2. Using Promise.all without considering partial results

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
- 💡 `Promise.allSettled` — when you need results from all operations
- 💡 `Promise.any` + `AggregateError` — first successful from several
- 🔥 `Promise.race` — useful for implementing timeouts
- ⚠️ Always handle rejected promises via `.catch()` or `try/catch`
