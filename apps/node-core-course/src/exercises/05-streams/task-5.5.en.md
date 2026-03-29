# Task 5.5: Backpressure

## Goal

Understand the backpressure mechanism: how Node.js manages producer/consumer speed, the role of `highWaterMark`, and how to diagnose issues.

## Requirements

1. Explain the problem: fast producer, slow consumer
2. Show the role of `highWaterMark` as a buffer threshold
3. Demonstrate manual backpressure handling with `pause()`/`resume()`
4. Show that `pipe()` and `pipeline()` handle backpressure automatically
5. Simulate producer/consumer with buffer visualization
6. Show diagnostic properties: `writableLength`, `writableHighWaterMark`, `readableFlowing`

## Checklist

- [ ] Fast producer / slow consumer problem explained
- [ ] highWaterMark shown with configuration
- [ ] Manual handling via pause/resume demonstrated
- [ ] Automatic handling via pipe/pipeline mentioned
- [ ] Buffer simulation with visual gauge works
- [ ] Diagnostic properties listed

## How to verify

1. Click "Run" and observe the buffer filling
2. Verify the producer pauses when buffer overflows
3. Check that the producer resumes after drain
4. Verify the danger of ignoring backpressure is shown
