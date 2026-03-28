# 🔥 Level 8: Global Error Handling

## Introduction

Not all errors can be caught in `try/catch`. Errors in `setTimeout`, unhandled promises, errors in third-party libraries — all of this requires global handling.

🎯 **Level Goal:** learn to catch "missed" errors at the global level, centralize logging, and set up monitoring.

## 🔥 window.onerror and error event

### Global Error Handler

```javascript
window.addEventListener('error', (event) => {
  console.log('Error:', event.message)
  console.log('File:', event.filename)
  console.log('Line:', event.lineno, 'Column:', event.colno)
  console.log('Error:', event.error)
})
```

### Unhandled Promise Rejection

```javascript
window.addEventListener('unhandledrejection', (event) => {
  console.log('Unhandled promise:', event.reason)
  event.preventDefault() // Prevent console output
})
```

### What Global Handlers Catch

| Source | `error` event | `unhandledrejection` |
|--------|:---:|:---:|
| `throw` in setTimeout | ✅ | ❌ |
| Promise.reject without catch | ❌ | ✅ |
| Resource loading error | ✅ | ❌ |
| Syntax error | ✅ | ❌ |

## 🔥 Logging Service

```typescript
interface LogEntry {
  level: 'error' | 'warn' | 'info'
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  stack?: string
}

class ErrorLogger {
  private logs: LogEntry[] = []

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog({
      level: 'error',
      message,
      timestamp: new Date(),
      context,
      stack: error?.stack,
    })
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog({ level: 'warn', message, timestamp: new Date(), context })
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    // In production: send to server
    this.sendToServer(entry)
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(entry),
      })
    } catch {
      // Don't throw error in logger!
    }
  }
}
```

📌 **Important:** the logger should never throw errors itself — otherwise you can end up in an infinite logging loop.

## 🔥 React Error Context

Centralized error handling through Context API:

```typescript
interface ErrorContextValue {
  errors: Array<{ id: number; message: string; severity: 'error' | 'warning' }>
  addError: (message: string, severity?: 'error' | 'warning') => void
  removeError: (id: number) => void
  clearErrors: () => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)
```

### Provider

```typescript
function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorContextValue['errors']>([])

  const addError = useCallback((message: string, severity = 'error') => {
    const id = Date.now()
    setErrors(prev => [...prev, { id, message, severity }])

    // Auto-dismiss warnings
    if (severity === 'warning') {
      setTimeout(() => removeError(id), 5000)
    }
  }, [])

  // ...

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  )
}
```

### Using in Components

```typescript
function SaveButton() {
  const { addError } = useErrorContext()

  const handleSave = async () => {
    try {
      await saveData()
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Save error')
    }
  }

  return <button onClick={handleSave}>Save</button>
}
```

## 🔥 Error Monitoring

### Report Structure

```typescript
interface ErrorReport {
  message: string
  stack?: string
  url: string
  timestamp: Date
  userAgent: string
  extra?: Record<string, unknown>
}
```

### Monitoring Services

In production, services like Sentry, Bugsnag, LogRocket are used:

```typescript
// Example Sentry integration
import * as Sentry from '@sentry/react'

Sentry.init({ dsn: 'https://...' })

// Manual report
Sentry.captureException(error, {
  extra: { userId: '123', action: 'checkout' }
})
```

## ⚠️ Common Beginner Mistakes

### 1. ❌ Global Handler as a Replacement for Local try/catch

```javascript
// ❌ Bad — relying only on global handler
window.addEventListener('error', (event) => {
  showToast(event.message)
})

// And in the component code — no handling:
function loadUser() {
  const data = JSON.parse(localStorage.getItem('user'))
  return data
}
```

**Why this is an error:** The global handler doesn't know the error context — it can't show an error next to the right field, offer a retry, or roll back the operation. The user will see a generic toast instead of a clear action. The global handler is a **safety net**, not a primary strategy.

```javascript
// ✅ Good — local handling + global handler as fallback
function loadUser() {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw)
  } catch (error) {
    console.error('Corrupted user data in localStorage:', error)
    return null
  }
}
```

### 2. ❌ Throwing Errors Inside the Logger

```typescript
// ❌ Bad — logger throws error on send failure
private async sendToServer(entry: LogEntry) {
  const response = await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(entry),
  })
  if (!response.ok) {
    throw new Error('Failed to send log') // 🐛 This will trigger logging again!
  }
}
```

**Why this is an error:** If the logger throws an error, the global handler will catch it and call the logger again. Result — infinite loop, stack overflow, or DDoS on your own logs server.

```typescript
// ✅ Good — logger silently swallows its own errors
private async sendToServer(entry: LogEntry) {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      body: JSON.stringify(entry),
    })
  } catch {
    // Silently ignore — logger should not create new errors
  }
}
```

### 3. ❌ Using `Date.now()` as Unique Error ID

```typescript
// ❌ Bad — two calls in one millisecond get the same id
const addError = (message: string) => {
  const id = Date.now()
  setErrors(prev => [...prev, { id, message }])
}
```

**Why this is an error:** When multiple errors are added quickly (e.g., on form submit with many invalid fields), ids will be identical. Removing one error by id will remove the wrong one or not all of them.

```typescript
// ✅ Good — incremental counter guarantees uniqueness
let nextId = 0
const addError = (message: string) => {
  const id = ++nextId
  setErrors(prev => [...prev, { id, message }])
}
```

### 4. ❌ Forgetting to Subscribe to `unhandledrejection`

```javascript
// ❌ Bad — only catching synchronous errors
window.addEventListener('error', (event) => {
  logger.error(event.message, event.error)
})
// Unhandled promises — completely invisible!
```

**Why this is an error:** Without `unhandledrejection` handler, a forgotten `.catch()` on a promise will remain completely unnoticed. The error will occur, but neither the logger nor monitoring will know about it.

```javascript
// ✅ Good — catch both synchronous errors and promises
window.addEventListener('error', (event) => {
  logger.error(event.message, event.error)
})
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled rejection', event.reason)
})
```

## 📌 Summary

- ✅ `window.addEventListener('error')` catches global synchronous errors
- ✅ `unhandledrejection` catches unhandled promises — **don't forget it!**
- ✅ Logging service centralizes error collection
- ✅ React Error Context — convenient way to show errors to users
- ✅ In production use Sentry or similar for monitoring
- ⚠️ Global handlers are a safety net, not a replacement for local handling
- ⚠️ Logger should never throw errors
