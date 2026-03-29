# 🔥 Level 5: Streams

## 🎯 Why Streams Matter

Streams are a fundamental Node.js concept for processing data in chunks without loading entire contents into memory. This is critical when working with large files, network requests, and real-time data.

```js
// ❌ Loads ENTIRE file into memory (1GB file = 1GB RAM)
const data = await fs.readFile('huge-file.csv', 'utf8')
processData(data)

// ✅ Processes in chunks (1GB file = ~64KB RAM)
const stream = fs.createReadStream('huge-file.csv')
for await (const chunk of stream) {
  processChunk(chunk)
}
```

## 📌 Four Types of Streams

| Type | Description | Examples |
|------|-------------|----------|
| Readable | Data source | fs.createReadStream, http.IncomingMessage, process.stdin |
| Writable | Data sink | fs.createWriteStream, http.ServerResponse, process.stdout |
| Duplex | Both readable and writable | net.Socket |
| Transform | Duplex with transformation | zlib.Gzip, crypto.Cipher |

All streams inherit from `EventEmitter` and work through events.

## 🔥 Readable Streams

**Flowing mode** — data arrives automatically via the `data` event. **Paused mode** — data is read manually via `read()`. **Async Iterator** (recommended) — `for await (const chunk of readable)`.

## 🔥 Writable Streams

`write()` returns a boolean: `true` means the buffer is not full, `false` means wait for `drain`. Always call `end()` when done. Use `cork()`/`uncork()` to batch multiple writes.

## 🔥 Transform Streams

Simultaneously Readable and Writable. Use `objectMode: true` to pass JS objects instead of Buffer/string. Always call `callback()` in the `transform` method.

## 🔥 Pipeline

Use `pipeline()` from `stream/promises` instead of `.pipe()` — it automatically destroys all streams on error and supports `AbortSignal` for cancellation.

## 🔥 Backpressure

The mechanism that slows the producer when the consumer can't keep up. `pipe()` and `pipeline()` handle it automatically. For manual handling, check `write()` return value and use `pause()`/`resume()`.

## 💡 Best Practices

1. Use `pipeline()` instead of `.pipe()`
2. Use `for await...of` for reading
3. Always handle backpressure
4. Use `highWaterMark` to tune buffer size
5. Use `objectMode` for working with objects
6. Use `AbortController` for cancellation
7. Use `cork()`/`uncork()` for batching writes
8. Use `readline` for line-by-line text file reading
