# 🔥 Level 0: Basics of Error Handling in JavaScript

## 🎯 Introduction

Errors are an inevitable part of programming. File not found, server not responding, user entered incorrect data. Proper error handling is what distinguishes a reliable application from a fragile one.

JavaScript has a built-in error handling mechanism: the `try/catch/finally` statement and the `Error` object.

## 🔥 The try/catch Statement

```javascript
try {
  // Code that might throw an error
  const data = JSON.parse(jsonString)
  console.log(data)
} catch (error) {
  // Error handling code
  console.error('Parse error:', error)
}
```

### How it works

1. The code in the `try` block is executed
2. If there's no error, the `catch` block is skipped
3. If an error occurs, execution of `try` is interrupted, control passes to `catch`
4. The `error` parameter in `catch` contains the error object

### The finally block

The `finally` block executes **always** — both after successful `try` and after `catch`:

```javascript
try {
  const file = openFile('data.txt')
  processFile(file)
} catch (error) {
  console.error('File processing error:', error)
} finally {
  // Will execute in any case
  closeFile(file)
}
```

💡 Typical scenarios for `finally`:
- Releasing resources (closing connections)
- Hiding loading indicators
- Cleaning up temporary data

## 🔥 The throw Operator

You can create your own errors using `throw`:

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero is not allowed')
  }
  return a / b
}

try {
  const result = divide(10, 0)
} catch (error) {
  console.error(error.message) // "Division by zero is not possible"
}
```

📌 **Important:** `throw` can be used with any value, but it's recommended to always throw `Error` instances:

```javascript
// ❌ Bad — throw with primitives
throw 'something went wrong'
throw 404
throw { message: 'error' }
```

> **Why this is an error:** when `throw` uses a primitive (string, number) or plain object, the call stack (`stack`) is lost. Without the stack, it's impossible to determine where exactly the error occurred, and `instanceof Error` will return `false`, breaking any type checking.

```javascript
// ✅ Good — always throw Error instances
throw new Error('something went wrong')
throw new TypeError('expected a string')
```

## 📌 The Error Object

The `Error` object has three main properties:

```javascript
const error = new Error('Something broke')

console.log(error.name)    // "Error"
console.log(error.message) // "Something broke"
console.log(error.stack)   // Call stack (multi-line string)
```

### The name property

The error type name. For base `Error` — `"Error"`, for `TypeError` — `"TypeError"`, etc.

### The message property

The error message text passed to the constructor.

### The stack property

The call stack — shows the chain of function calls that led to the error. Invaluable for debugging:

```
Error: Something broke
    at processData (app.js:15:11)
    at loadUser (app.js:8:3)
    at main (app.js:2:1)
```

## 📌 Built-in Error Types

JavaScript provides several built-in error types:

| Type | When it occurs |
|------|---|
| `Error` | Base error type |
| `TypeError` | Operation with unsuitable type |
| `RangeError` | Number outside acceptable range |
| `SyntaxError` | Syntax error during parsing |
| `ReferenceError` | Access to non-existent variable |
| `URIError` | Incorrect use of URI functions |
| `EvalError` | Error related to `eval()` (deprecated) |

## 🎯 Checking Error Type

Use `instanceof` to determine error type:

```javascript
try {
  JSON.parse('invalid')
} catch (error) {
  if (error instanceof SyntaxError) {
    console.log('Invalid JSON')
  } else if (error instanceof TypeError) {
    console.log('Type error')
  } else {
    console.log('Unknown error:', error)
  }
}
```

## ⚠️ Common Beginner Mistakes

### 🐛 1. Empty catch

```javascript
// ❌ Bad — error is swallowed
try {
  doSomething()
} catch (error) {
  // empty
}
```

> **Why this is an error:** an empty `catch` completely hides the error. The program continues to work with invalid state, bugs become "invisible" — you get no logs, no notifications. Debugging becomes a nightmare because the error is silently swallowed somewhere up the stack.

```javascript
// ✅ Good — log and/or re-throw
try {
  doSomething()
} catch (error) {
  console.error('Error in doSomething:', error)
  // or re-throw
  throw error
}
```

### 🐛 2. Catch scope too broad

```javascript
// ❌ Bad — catches all errors the same way
try {
  // 100 lines of code
} catch (error) {
  alert('An error occurred')
}
```

> **Why this is an error:** too broad of a `try` catches ALL errors — including unexpected ones (typos, `TypeError`, business logic errors). You cannot adequately handle each one with a single message. As a result, real bugs are masked behind a generic "An error occurred".

```javascript
// ✅ Good — specific handling
try {
  const data = JSON.parse(input)
} catch (error) {
  if (error instanceof SyntaxError) {
    showValidationError('Invalid data format')
  } else {
    throw error // Re-throw unexpected errors
  }
}
```

### 🐛 3. Not checking error type

In TypeScript, the `catch` parameter has type `unknown`:

```typescript
// ❌ Bad — accessing property of unknown
try {
  something()
} catch (error) {
  // error has type unknown!
  console.log(error.message) // TS error
}
```

> **Why this is an error:** `catch` can receive anything — not just `Error`, but also strings, numbers, `undefined`. Accessing `.message` without type checking will result in a compilation error in TypeScript, and at runtime — potential `TypeError` if someone did `throw 'string'`.

```typescript
// ✅ Good — check type before using
try {
  something()
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message) // safe
  }
}
```

## 📌 Summary

- ✅ `try/catch/finally` — the main error handling mechanism in JS
- ✅ `throw new Error('...')` — creating and throwing an error
- ✅ The `Error` object contains `name`, `message`, and `stack`
- ✅ Always check error type via `instanceof`
- ❌ Don't swallow errors in empty `catch`
- 📌 In TypeScript, `error` in `catch` has type `unknown`
