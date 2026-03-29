# Task 11.3: Async Iterators

## Goal

Master async iterators in Node.js: `for-await-of`, creating custom async generators, using streams and EventEmitter as async iterators via `events.on()`.

## Requirements

1. Show creating an object with `Symbol.asyncIterator` and iterating with `for-await-of`
2. Implement an async generator (`async function*`) for paginated data loading
3. Demonstrate reading a file as an async iterable (ReadableStream)
4. Show `events.on()` to turn EventEmitter into an async iterator
5. Demonstrate pipeline with async generator for streaming transformation

## Checklist

- [ ] Object with Symbol.asyncIterator and for-await-of
- [ ] Async generator for pagination
- [ ] Readable stream as async iterable
- [ ] events.on() with AbortSignal for stopping
- [ ] Pipeline with async generator transformation

## How to verify

1. Click "Run" — all async iterator patterns should be displayed
2. Verify async generator with yield is shown
3. Check that streams are used as async iterable
4. Verify events.on() is shown with stop capability
