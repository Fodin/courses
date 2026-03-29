# Task 0.2: Microtasks vs Macrotasks

## Goal

Understand the difference between microtasks and macrotasks, and learn to predict their execution order.

## Requirements

1. List which APIs create microtasks and which create macrotasks
2. Demonstrate the key rule: all microtasks drain after each macrotask
3. Show an example with nested Promises and setTimeout
4. Implement a live browser demonstration with real `Promise.then`, `queueMicrotask`, and `setTimeout`

## Checklist

- [ ] Microtasks listed: Promise.then, process.nextTick, queueMicrotask
- [ ] Macrotasks listed: setTimeout, setInterval, setImmediate, I/O
- [ ] Microtask priority rule demonstrated
- [ ] Nested Promise chain example shown
- [ ] Live browser demonstration present

## How to verify

1. Open the task and click "Run"
2. Make sure the live demo shows the correct order
3. Verify that sync runs first, then microtasks, then macrotasks
