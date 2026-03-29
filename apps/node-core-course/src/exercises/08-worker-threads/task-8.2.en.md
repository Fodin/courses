# Task 8.2: SharedArrayBuffer & Atomics

## Goal

Understand shared memory via SharedArrayBuffer, race condition problems, and atomic operations via Atomics.

## Requirements

1. Create a SharedArrayBuffer and demonstrate Int32Array view operations
2. Show the race condition problem with unsynchronized concurrent access
3. Demonstrate all major Atomics operations: store, load, add, sub, exchange, compareExchange
4. Explain the wait/notify mechanism for thread synchronization
5. Show the limitation: Atomics.wait cannot be used in the main thread

## Checklist

- [ ] SharedArrayBuffer created and data written
- [ ] Race condition problem clearly explained
- [ ] All major Atomics operations demonstrated with results
- [ ] wait/notify mechanism described
- [ ] Main thread limitations noted

## How to Verify

1. Click the run button
2. Verify SharedArrayBuffer is shown visually with data
3. Check each Atomics operation shows input and output values
4. Ensure race condition is explained with a concrete example
