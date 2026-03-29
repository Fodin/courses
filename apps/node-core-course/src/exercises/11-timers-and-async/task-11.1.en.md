# Task 11.1: Timer Internals

## Goal

Understand the internals of Node.js timers: `setTimeout`, `setInterval`, `setImmediate`, as well as `ref()`/`unref()` methods and timer coalescing optimization.

## Requirements

1. Demonstrate setTimeout, setInterval, and setImmediate with Event Loop phase explanations
2. Show execution order: sync → nextTick → Promise → setTimeout/setImmediate
3. Explain behavior differences in main module vs inside I/O callbacks
4. Demonstrate ref()/unref() and hasRef() for process lifecycle management
5. Show refresh() for efficient timer reset
6. Explain timer coalescing concept in libuv

## Checklist

- [ ] Three timer types shown with examples
- [ ] Event Loop execution order demonstrated
- [ ] Main module vs I/O callback difference explained
- [ ] ref()/unref() with typical scenarios
- [ ] refresh() for reset without timer recreation
- [ ] Timer coalescing described

## How to verify

1. Click "Run" — a complete timer overview should be displayed
2. Verify execution order is explained
3. Check for unref() examples with heartbeat and graceful shutdown
4. Verify refresh() is shown as an alternative to clearTimeout + setTimeout
