# 🔥 Level 8: Worker Threads

## 🎯 Introduction

Node.js runs in a single thread, but the `worker_threads` module allows creating additional threads for CPU-intensive tasks. Unlike `child_process.fork()`, Worker Threads operate **within a single process** and can **share memory** via `SharedArrayBuffer`.

When to use Worker Threads:
- Hashing and encrypting large volumes of data
- Parsing and transforming large files (JSON, CSV, XML)
- Image/video processing
- Heavy mathematical computations
- Any CPU-bound work blocking the event loop

When **NOT** to use:
- I/O tasks (DB queries, HTTP) — Node.js handles these asynchronously already
- Simple operations — thread creation overhead won't pay off

## 🔥 Creating a Worker

```javascript
// main.js
const { Worker, isMainThread } = require('worker_threads')

if (isMainThread) {
  const worker = new Worker('./worker.js', {
    workerData: { input: 'hello' },
  })

  worker.on('message', (result) => console.log('Result:', result))
  worker.on('error', (err) => console.error('Worker error:', err))
  worker.on('exit', (code) => {
    if (code !== 0) console.error(`Worker stopped with code ${code}`)
  })
}
```

```javascript
// worker.js
const { workerData, parentPort } = require('worker_threads')
const result = workerData.input.toUpperCase()
parentPort.postMessage(result)
```

### Constructor Options

```javascript
new Worker(filename, {
  workerData: { key: 'value' },      // cloned via structured clone
  env: Worker.SHARE_ENV,              // share env with main thread
  execArgv: ['--max-old-space-size=512'],
  resourceLimits: {
    maxOldGenerationSizeMb: 512,
    maxYoungGenerationSizeMb: 64,
    codeRangeSizeMb: 64,
    stackSizeMb: 4,
  },
  transferList: [arrayBuffer],        // transfer without copying
})
```

## 🔥 Message Passing

### postMessage — structured clone

Data is **cloned**, not passed by reference. Supports: objects, arrays, Date, RegExp, Map, Set, Buffer. Cannot send: functions, Symbols, WeakRef.

### Transfer — zero-copy

```javascript
const buffer = new ArrayBuffer(1024 * 1024)
worker.postMessage({ data: buffer }, [buffer])
// buffer.byteLength === 0 after transfer!
```

### MessageChannel — direct worker-to-worker

```javascript
const { port1, port2 } = new MessageChannel()
worker1.postMessage({ port: port1 }, [port1])
worker2.postMessage({ port: port2 }, [port2])
```

## 🔥 SharedArrayBuffer and Atomics

### SharedArrayBuffer — shared memory

```javascript
const sharedBuffer = new SharedArrayBuffer(1024)
worker.postMessage({ buffer: sharedBuffer })
// Both threads see the SAME memory
```

### Race Conditions

Without synchronization, concurrent reads/writes produce unpredictable results. Use Atomics for thread-safe operations.

### Atomics

```javascript
Atomics.store(view, 0, 42)      // atomic write
Atomics.load(view, 0)           // atomic read
Atomics.add(view, 0, 1)         // atomic increment
Atomics.compareExchange(view, 0, expected, desired) // CAS
Atomics.wait(view, 0, 0)        // block until value changes (worker only!)
Atomics.notify(view, 0, 1)      // wake one waiting thread
```

## 🔥 Worker Pool

Creating Workers is expensive (~5-30ms). A Worker Pool reuses a fixed number of Workers:

```javascript
class WorkerPool {
  constructor(workerFile, size = os.cpus().length) {
    // Create workers, maintain free list and task queue
  }
  runTask(data) { /* assign to free worker or enqueue */ }
  async destroy() { /* terminate all workers */ }
}
```

## 🔥 Worker Threads vs child_process.fork

| Feature | Worker Threads | fork |
|---------|---------------|------|
| Isolation | Same process | Separate processes |
| Memory | ~5-10 MB/worker | ~30 MB/process |
| Shared memory | SharedArrayBuffer | No |
| Communication | postMessage | IPC (JSON) |
| Startup | ~5-30ms | ~50-100ms |
| Crash impact | Can affect entire process | Isolated |

## ⚠️ Common Beginner Mistakes

### Mistake 1: Workers for I/O tasks
I/O is already async in Node.js. Workers add overhead without benefit for network/disk operations.

### Mistake 2: Creating a Worker per request
Use a Worker Pool instead of creating new Workers for each incoming request.

### Mistake 3: SharedArrayBuffer mutations without Atomics
Always use `Atomics.add()` instead of `view[0]++` for thread safety.

### Mistake 4: Trying to send functions
Functions cannot be serialized. Send operation names and data instead.

## 💡 Best Practices

1. **Pool size = CPU cores** — more threads don't help
2. **Use Transfer for large buffers** — avoid copying megabytes
3. **SharedArrayBuffer only when performance is critical** — Atomics add complexity
4. **Handle errors and restart workers** — replace crashed workers
5. **Measure before optimizing** — Workers have overhead
6. **Never use Atomics.wait in main thread** — use waitAsync
