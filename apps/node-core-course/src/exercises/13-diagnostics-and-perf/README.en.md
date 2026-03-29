# 🔥 Level 13: Diagnostics and Performance

## 🎯 Introduction

Node.js provides powerful built-in tools for performance diagnostics, memory profiling, data compression, and various utilities. These tools are critical for:

- Measuring and optimizing performance
- Detecting and fixing memory leaks
- Compressing HTTP responses and files
- Working with I/O and data formatting

## 🔥 perf_hooks — Performance API

### performance.now()

```javascript
const { performance } = require('perf_hooks')

const start = performance.now()
doExpensiveOperation()
const duration = performance.now() - start
```

📌 Unlike `Date.now()`, `performance.now()` is monotonic and has microsecond precision.

### Marks & Measures

```javascript
performance.mark('start-db')
await db.query(sql)
performance.mark('end-db')
performance.measure('db-query', 'start-db', 'end-db')
```

### PerformanceObserver

```javascript
const obs = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration.toFixed(2)}ms`)
  })
})
obs.observe({ entryTypes: ['measure'] })
```

### performance.timerify()

```javascript
const timerified = performance.timerify(heavyComputation)
obs.observe({ entryTypes: ['function'] })
timerified(1000000) // Observer receives duration
```

## 🔥 Memory Profiling

### process.memoryUsage()

```javascript
const mem = process.memoryUsage()
// rss, heapTotal, heapUsed, external, arrayBuffers
```

### Detecting Memory Leaks

Signs: `heapUsed` constantly growing, `rss` only increasing, GC not reducing usage.

### Heap Snapshots

```javascript
const v8 = require('v8')
v8.writeHeapSnapshot() // Open in Chrome DevTools → Memory
```

## 🔥 Zlib — Data Compression

```javascript
// Gzip
const gzipped = zlib.gzipSync(data)
const original = zlib.gunzipSync(gzipped)

// Streaming compression
await pipeline(
  fs.createReadStream('input.log'),
  zlib.createGzip(),
  fs.createWriteStream('input.log.gz')
)
```

| Algorithm | Ratio | Speed | Use Case |
|-----------|-------|-------|----------|
| gzip | Medium | Fast | HTTP, files |
| deflate | Medium | Fast | Inside gzip/zip |
| brotli | Best | Slower | Static web assets |

## 🔥 util — Utilities

### util.promisify

```javascript
const readFile = util.promisify(fs.readFile)
const data = await readFile('file.txt', 'utf8')
```

### util.inspect

```javascript
util.inspect(obj, { depth: Infinity, colors: true, compact: false })
```

### util.types

```javascript
util.types.isDate(new Date())           // true
util.types.isPromise(Promise.resolve()) // true
util.types.isProxy(new Proxy({}, {}))   // true
```

## 🔥 readline — Interactive Input

```javascript
const { createInterface } = require('readline/promises')
const rl = createInterface({ input: process.stdin, output: process.stdout })
const name = await rl.question('Name: ')
rl.close()
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Date.now() for Benchmarks

```javascript
// ❌ Bad — low precision, depends on system time
const start = Date.now()

// ✅ Good — performance.now()
const start = performance.now()
```

### Mistake 2: Sync Compression in Hot Path

```javascript
// ❌ Bad — blocks Event Loop
const compressed = zlib.gzipSync(hugeData)

// ✅ Good — streaming
readStream.pipe(zlib.createGzip()).pipe(res)
```

### Mistake 3: Ignoring Memory Leaks

```javascript
// ❌ Bad — cache grows forever
const cache = new Map()

// ✅ Good — LRU cache with limit
const cache = new LRU({ max: 1000 })
```

## 💡 Best Practices

1. **performance.now()** over Date.now() for measurements
2. **PerformanceObserver** for reactive monitoring
3. **Streaming compression** via pipeline
4. **Brotli** for static, **gzip** for dynamic content
5. **Heap snapshots** for leak diagnostics
6. **util.inspect.custom** for safe logging
7. **readline/promises** over callback version
8. **Periodic monitoring** of memoryUsage for leak detection
