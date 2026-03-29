# Task 5.2: Writable Streams

## Goal

Master Writable Streams: writing data, handling buffer overflow (`drain`), finishing writes (`end`/`finish`), and batching (`cork`/`uncork`).

## Requirements

1. Demonstrate `write()` and its return value (true/false)
2. Show `drain` event handling when the buffer overflows
3. Demonstrate `end()` for finishing writes and the `finish` event
4. Show `cork()`/`uncork()` for batching writes
5. Simulate writing with buffer fill tracking
6. Show all key events: `drain`, `finish`, `error`, `close`, `pipe`

## Checklist

- [ ] write() with return value checking shown
- [ ] drain event handled correctly
- [ ] end() and finish demonstrated
- [ ] cork()/uncork() shown with explanation
- [ ] Buffer simulation works with visualization
- [ ] All key events listed

## How to verify

1. Click "Run" and study the buffer filling
2. Verify write() returns false when buffer overflows
3. Check that drain resets the buffer
4. Verify cork/uncork are explained via batch optimization
