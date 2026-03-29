# 🔥 Level 0: Event Loop in Node.js

## 🎯 Why Understanding the Event Loop Matters

The Event Loop is the heart of Node.js. It enables Node.js to be single-threaded while efficiently handling thousands of concurrent connections. Without understanding the Event Loop, you cannot:

- Predict the execution order of asynchronous code
- Diagnose performance issues
- Avoid blocking the main thread
- Properly use `setTimeout`, `setImmediate`, `process.nextTick`

## 📌 Event Loop Architecture

Node.js is built on two key components:

1. **V8** — JavaScript engine (compilation and execution of JS)
2. **libuv** — C library implementing the Event Loop and async I/O

```
┌─────────────────────────────────────────┐
│              Node.js Process             │
│                                          │
│  ┌──────────┐     ┌──────────────────┐  │
│  │    V8     │     │     libuv        │  │
│  │  Engine   │◄───►│   Event Loop     │  │
│  │           │     │   Thread Pool    │  │
│  │  JS code  │     │   Async I/O     │  │
│  └──────────┘     └──────────────────┘  │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │    Node.js Bindings (C++)        │   │
│  │    fs, net, crypto, dns, ...     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## 🔥 Event Loop Phases

The Event Loop in libuv consists of 6 phases. Each phase has a FIFO callback queue:

```
   ┌───────────────────────────┐
┌─▶│         Timers             │ ← setTimeout, setInterval
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │      Pending I/O          │ ← deferred I/O callbacks
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │      Idle / Prepare       │ ← internal use only
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │          Poll              │ ← retrieve new I/O events
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │         Check              │ ← setImmediate
│  └──────────┬────────────────┘
│  ┌──────────▼────────────────┐
│  │     Close Callbacks       │ ← socket.on('close')
│  └──────────┬────────────────┘
└─────────────┘
```

### 1. Timers

Executes `setTimeout()` and `setInterval()` callbacks **whose threshold has elapsed**.

```js
// setTimeout with 0ms does NOT mean "execute immediately"
// It means "execute as soon as possible when the Timers phase arrives"
setTimeout(() => console.log('timer'), 0)
```

⚠️ The actual delay is always >= the specified delay. If you set `setTimeout(fn, 100)`, the callback fires after 100ms **or later**, depending on when the Event Loop reaches the Timers phase.

### 2. Pending I/O Callbacks

Executes callbacks for system operations deferred from the previous iteration (e.g., TCP connection errors).

### 3. Idle / Prepare

Used internally by libuv only. Not relevant to user code.

### 4. Poll

The most important phase. It:

1. Calculates how long to block waiting for new I/O events
2. Processes events in the poll queue

```js
// fs.readFile callbacks land in the Poll phase
const fs = require('fs')
fs.readFile('file.txt', (err, data) => {
  // This callback executes in the Poll phase
  console.log('file read')
})
```

If the poll queue is empty:
- If there are `setImmediate` callbacks — moves to Check phase
- If there are expired timers — wraps back to Timers phase
- Otherwise — blocks, waiting for new I/O events

### 5. Check

Executes `setImmediate()` callbacks. This phase always runs **immediately after Poll**.

### 6. Close Callbacks

Executes `close` event callbacks, e.g., `socket.on('close', ...)`.

## 🔥 Microtask Queues

Between **each phase** of the Event Loop, two microtask queues are drained:

1. **`process.nextTick` queue** — highest priority
2. **Promise microtask queue** — second priority

```js
// Order: sync → nextTick → Promise → macrotask
console.log('1')                                    // sync
process.nextTick(() => console.log('2'))            // nextTick
Promise.resolve().then(() => console.log('3'))      // Promise
setTimeout(() => console.log('4'), 0)               // macrotask

// Output: 1, 2, 3, 4
```

📌 **Important**: `process.nextTick` fires **BEFORE** Promise.then, even though both are microtasks. nextTick has its own separate, higher-priority queue.

## 📌 setTimeout vs setImmediate

The order of `setTimeout(fn, 0)` and `setImmediate(fn)` is **non-deterministic** when called from the main module:

```js
// From main module — order NOT GUARANTEED
setTimeout(() => console.log('timeout'), 0)
setImmediate(() => console.log('immediate'))
// Could be: timeout, immediate
// Could be: immediate, timeout
```

Reason: `setTimeout(fn, 0)` is actually `setTimeout(fn, 1)` (minimum delay 1ms). If the Event Loop starts faster than 1ms, the timer hasn't elapsed yet and setImmediate fires first. If slower, the timer has elapsed.

But **inside an I/O callback**, the order is guaranteed:

```js
const fs = require('fs')
fs.readFile('file.txt', () => {
  setTimeout(() => console.log('timeout'), 0)
  setImmediate(() => console.log('immediate'))
})
// Always: immediate, timeout
// Because: after Poll phase comes Check (setImmediate), then Timers
```

## 🔥 process.nextTick: Powerful but Dangerous

`process.nextTick()` executes the callback **before** transitioning to the next Event Loop phase:

```js
// Useful for: fixing API ordering
function MyEmitter() {
  // ❌ Bad: emit before user can subscribe
  this.emit('event')
}

function MyEmitter() {
  // ✅ Good: emit after current operation
  process.nextTick(() => this.emit('event'))
}
```

### ⚠️ Danger: Starvation

Recursive `process.nextTick` blocks the Event Loop:

```js
// ❌ DANGEROUS: Event Loop never advances
function recurse() {
  process.nextTick(recurse)
}
recurse()
// setTimeout, setImmediate, I/O — nothing executes!
```

✅ Use `setImmediate` for recursive operations:

```js
// ✅ Safe: each call is a new Event Loop iteration
function recurse() {
  setImmediate(recurse)
}
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Blocking the Event Loop with synchronous code

```js
// ❌ Bad: blocks entire server during computation
app.get('/heavy', (req, res) => {
  const result = fibonacci(45) // 5 seconds!
  res.json({ result })
})
```

```js
// ✅ Good: offload to Worker Thread
const { Worker } = require('worker_threads')
app.get('/heavy', (req, res) => {
  const worker = new Worker('./fibonacci-worker.js', {
    workerData: { n: 45 }
  })
  worker.on('message', (result) => res.json({ result }))
})
```

### Mistake 2: Assuming exact order of setTimeout(0) and setImmediate

```js
// ❌ Bad: relying on order in main module
setTimeout(() => doFirst(), 0)
setImmediate(() => doSecond())
```

```js
// ✅ Good: use explicit dependencies
setTimeout(() => {
  doFirst()
  setImmediate(() => doSecond())
}, 0)
```

### Mistake 3: Recursive process.nextTick

```js
// ❌ Bad: infinite recursion in nextTick
function processQueue(queue) {
  if (queue.length > 0) {
    const item = queue.shift()
    processItem(item)
    process.nextTick(() => processQueue(queue))
  }
}
```

```js
// ✅ Good: use setImmediate
function processQueue(queue) {
  if (queue.length > 0) {
    const item = queue.shift()
    processItem(item)
    setImmediate(() => processQueue(queue))
  }
}
```

## 💡 Best Practices

1. **Never block the Event Loop** — use Worker Threads for CPU-intensive tasks
2. **Prefer `setImmediate` over `process.nextTick`** for recursive operations
3. **Use `process.nextTick` only for small synchronous tasks** (e.g., emit after return)
4. **Don't rely on exact ordering** of `setTimeout(0)` vs `setImmediate` outside I/O
5. **Monitor Event Loop lag** using `monitorEventLoopDelay()` (Node.js 11.10+)
6. **Profile** with `--prof` and `--inspect` to detect blockages

```js
// Monitoring Event Loop lag
const { monitorEventLoopDelay } = require('perf_hooks')
const h = monitorEventLoopDelay({ resolution: 20 })
h.enable()

setInterval(() => {
  console.log(`Event Loop p99: ${h.percentile(99) / 1e6}ms`)
  h.reset()
}, 5000)
```
