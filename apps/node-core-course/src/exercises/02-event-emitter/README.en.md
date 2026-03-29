# 🔥 Level 2: EventEmitter

## 🎯 Why Understanding EventEmitter Matters

EventEmitter is the foundation of Node.js event-driven architecture. Virtually all key modules are built on it: `http.Server`, `fs.ReadStream`, `net.Socket`, `process`.

## 📌 EventEmitter Basics

```js
const EventEmitter = require('events')
const emitter = new EventEmitter()

emitter.on('data', (chunk) => console.log('Received:', chunk))
emitter.emit('data', 'Hello World')
```

### Key Methods

- `on(event, listener)` — add listener
- `once(event, listener)` — one-time listener
- `off(event, listener)` — remove listener
- `emit(event, ...args)` — fire event
- `removeAllListeners([event])` — remove all
- `listenerCount(event)` — count listeners
- `prependListener(event, listener)` — add to front

Listeners are called **synchronously** in registration order.

## 🔥 The "error" Event

The `error` event has **special behavior**: if emitted without a listener, **the process crashes**.

```js
// ✅ Always add error handlers
emitter.on('error', (err) => console.error('Handled:', err.message))
```

## 📌 maxListeners and Memory Leaks

Default warning at >10 listeners per event. Change with `setMaxListeners()`.

## 🔥 once() and Async Iterator

```js
const { once, on } = require('events')

// Promise-based once
await once(server, 'listening')

// Async iterator
for await (const [data] of on(emitter, 'data', { signal: ac.signal })) {
  process(data)
}
```

## ⚠️ Common Beginner Mistakes

1. Forgetting error handlers → process crash
2. Leaking listeners in loops/request handlers
3. Subscribing after emit (event already fired)
4. Arrow functions lose `this` binding to emitter

## 💡 Best Practices

1. Always add `error` handlers
2. Use `once()` for one-time events
3. Prefer `events.once()` (Promise) for async/await
4. Monitor maxListeners warnings
5. Use `events.on()` with AbortSignal for streaming
6. Don't forget `off()` for cleanup
