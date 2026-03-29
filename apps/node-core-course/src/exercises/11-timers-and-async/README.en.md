# 🔥 Level 11: Timers and Async Patterns

## 🎯 Introduction

Node.js provides a rich set of tools for working with timers and async operations. Beyond familiar `setTimeout`/`setInterval`, developers have `setImmediate`, `AbortController` for cancellation, and async iterators for streaming data processing.

Understanding these mechanisms is critical for:
- Managing code execution order
- Graceful cancellation of long operations
- Efficient streaming data processing
- Preventing memory and resource leaks

## 🔥 setTimeout / setInterval / setImmediate

### setTimeout — delayed execution

```javascript
const timer = setTimeout(() => {
  console.log('Executed after ~100ms')
}, 100)

clearTimeout(timer)
```

📌 `setTimeout(fn, 0)` doesn't mean instant execution. Minimum delay is **1ms** in Node.js. The callback runs in the **Timers** phase of the Event Loop.

### setInterval — periodic execution

```javascript
const interval = setInterval(() => {
  console.log('Tick every second')
}, 1000)

clearInterval(interval)
```

### setImmediate — Check phase execution

```javascript
setImmediate(() => {
  console.log('Check phase')
})
```

`setImmediate` runs in the **Check** phase, right after **Poll**. Inside I/O callbacks, `setImmediate` **always** runs before `setTimeout(fn, 0)`.

## 🔥 ref() / unref() — Process Lifecycle

Timers keep the Node.js process alive by default. `unref()` allows the process to exit even if the timer is active:

```javascript
const heartbeat = setInterval(sendPing, 30000)
heartbeat.unref() // won't prevent process exit

heartbeat.ref()     // restore default behavior
heartbeat.hasRef()  // check state
```

## 🔥 refresh() — Timer Reset

```javascript
const inactivityTimer = setTimeout(disconnectUser, 60000)

socket.on('data', () => {
  inactivityTimer.refresh() // reset without recreating
})
```

## 🔥 timers/promises — Promisified Timers

```javascript
const { setTimeout: sleep, setInterval } = require('timers/promises')

await sleep(1000)

for await (const _ of setInterval(1000)) {
  console.log('tick')
  if (shouldStop) break
}
```

## 🔥 AbortController — Operation Cancellation

### Basic Usage

```javascript
const controller = new AbortController()
const { signal } = controller

fetch(url, { signal }).catch(err => {
  if (err.name === 'AbortError') console.log('Cancelled')
})

controller.abort()
controller.abort('User cancelled') // with reason
```

### AbortSignal.timeout()

```javascript
const signal = AbortSignal.timeout(5000)
await fetch(url, { signal })
```

### AbortSignal.any() — Signal Composition (Node.js 20+)

```javascript
const combined = AbortSignal.any([
  userCancel.signal,
  AbortSignal.timeout(30000)
])
```

### throwIfAborted()

```javascript
for (const item of items) {
  signal.throwIfAborted()
  await processItem(item)
}
```

## 🔥 Async Iterators

### Async Generators

```javascript
async function* fetchAllPages(url) {
  let page = 1
  while (true) {
    const res = await fetch(`${url}?page=${page}`)
    const data = await res.json()
    if (data.items.length === 0) return
    yield data.items
    page++
  }
}

for await (const items of fetchAllPages('/api/users')) {
  console.log(`Page: ${items.length} users`)
}
```

### Streams as Async Iterators

```javascript
for await (const chunk of fs.createReadStream('file.txt')) {
  process.stdout.write(chunk)
}
```

### events.on() — EventEmitter as Async Iterator

```javascript
const { on } = require('events')

for await (const [req, res] of on(server, 'request')) {
  res.end('Hello')
}
```

### Pipeline with Async Generators

```javascript
async function* toUpperCase(source) {
  for await (const chunk of source) {
    yield chunk.toString().toUpperCase()
  }
}

await pipeline(readStream, toUpperCase, writeStream)
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Timer Leaks

```javascript
// ❌ Bad — timer never cleared
setInterval(checkStatus, 5000)

// ✅ Good — save reference and clear
const interval = setInterval(checkStatus, 5000)
// Later: clearInterval(interval)
```

### Mistake 2: setInterval with Async Callbacks

```javascript
// ❌ Bad — overlapping executions
setInterval(async () => await longOp(), 1000)

// ✅ Good — sequential with sleep
while (true) {
  await longOp()
  await sleep(1000)
}
```

### Mistake 3: Missing AbortController Cleanup

```javascript
// ❌ Bad
signal.addEventListener('abort', handler)

// ✅ Good
signal.addEventListener('abort', handler, { once: true })
```

## 💡 Best Practices

1. **unref()** for auxiliary timers (heartbeat, cleanup)
2. **refresh()** instead of clearTimeout + setTimeout
3. **AbortController** as the standard cancellation mechanism
4. **AbortSignal.timeout()** instead of manual setTimeout + abort
5. **for-await-of** for stream processing
6. **events.on()** to convert EventEmitter to async iterator
7. **timers/promises** for await-able timers
8. Always **clean up timers** on shutdown
