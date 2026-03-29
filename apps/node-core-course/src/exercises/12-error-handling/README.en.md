# 🔥 Level 12: Error Handling in Node.js

## 🎯 Introduction

Error handling is one of the most important topics in Node.js. Unlike synchronous languages where errors can always be caught with try/catch, Node.js errors arise in different contexts: callbacks, promises, streams, EventEmitters, process events. Each context requires its own approach.

Poor error handling leads to:
- Process crashes in production
- Memory and resource leaks
- Data loss
- Security vulnerabilities

## 🔥 Operational vs Programmer Errors

### Operational errors

Expected errors during normal operation:

```javascript
// File not found
fs.readFile('/nonexistent', (err) => { err.code }) // "ENOENT"

// Network unavailable
fetch('http://down-service').catch(err => err.code) // "ECONNREFUSED"
```

**Strategy:** handle, log, continue.

### Programmer errors

Bugs in code:

```javascript
const user = null
user.name // Cannot read property 'name' of null
```

**Strategy:** fix the code. In production — restart the process.

## 🔥 System Error Codes

```javascript
try {
  fs.readFileSync('/nonexistent')
} catch (err) {
  err.code    // "ENOENT"
  err.syscall // "open"
  err.path    // "/nonexistent"
}
```

| Code | Description |
|------|------------|
| ENOENT | File/directory not found |
| EACCES | Permission denied |
| EADDRINUSE | Port already in use |
| ECONNREFUSED | Connection refused |
| ETIMEDOUT | Operation timed out |

## 🔥 Custom Error Hierarchy

```javascript
class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message)
    this.name = this.constructor.name
    this.code = code
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}

class ValidationError extends AppError {
  constructor(message, fields = []) {
    super(message, 'VALIDATION_ERROR', 400)
    this.fields = fields
  }
}
```

### error.cause (ES2022)

```javascript
throw new AppError('Failed to fetch user', 'DB_ERROR', 500, {
  cause: originalError
})
```

## 🔥 Process Error Events

### uncaughtException

```javascript
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'Uncaught exception')
  process.exit(1) // Process is in undefined state!
})
```

### unhandledRejection

```javascript
process.on('unhandledRejection', (reason, promise) => {
  logger.error({ reason }, 'Unhandled rejection')
})
```

### Graceful Shutdown

```javascript
async function gracefulShutdown(signal) {
  server.close()
  await drainConnections()
  await db.close()
  process.exit(0)
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
process.on('SIGINT', () => gracefulShutdown('SIGINT'))
```

## 🔥 Errors in Async Contexts

### Streams — pipeline over pipe

```javascript
// ❌ pipe() does NOT propagate errors
readStream.pipe(writeStream)

// ✅ pipeline() propagates errors and cleans up
const { pipeline } = require('stream/promises')
try {
  await pipeline(readStream, transformStream, writeStream)
} catch (err) {
  // All streams automatically destroyed
}
```

### EventEmitter

```javascript
// ⚠️ emit('error') without handler crashes process!
emitter.on('error', (err) => handleError(err))
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: throw inside callback

```javascript
// ❌ Bad — throw won't be caught by outer try/catch
fs.readFile('file.txt', (err) => {
  if (err) throw err // → uncaughtException!
})

// ✅ Good
fs.readFile('file.txt', (err) => {
  if (err) return handleError(err)
})
```

### Mistake 2: Missing .catch() on Promise

```javascript
// ❌ Bad
riskyOperation() // no await, no .catch()

// ✅ Good
riskyOperation().catch(handleError)
```

### Mistake 3: Continuing after uncaughtException

```javascript
// ❌ Bad — app state may be corrupted
process.on('uncaughtException', (err) => console.error(err))

// ✅ Good
process.on('uncaughtException', (err) => {
  logger.fatal(err)
  process.exit(1)
})
```

## 💡 Best Practices

1. **Separate** operational and programmer errors
2. **Create** custom error hierarchies with codes
3. **error.cause** for error chain preservation
4. **pipeline()** instead of pipe() for streams
5. **Graceful shutdown** with SIGTERM/SIGINT
6. **Never continue** after uncaughtException
7. **Always** add error handler on EventEmitter
8. **Log** errors with context (request id, user id)
