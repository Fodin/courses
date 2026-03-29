# Task 12.3: Async Error Patterns

## Goal

Master error handling in different Node.js async contexts: callbacks, promises, EventEmitters, streams, and the error propagation pattern across application layers.

## Requirements

1. Show error-first callback pattern and why throw inside callback is dangerous
2. Demonstrate error handling in Promise chains and async/await
3. Show EventEmitter error handling: mandatory error handler, captureRejections
4. Explain why pipe() doesn't propagate errors and why pipeline() is better
5. Demonstrate error propagation pattern with error.cause across application layers

## Checklist

- [ ] Error-first callback pattern with error handling
- [ ] Promise .catch() and async/await try/catch
- [ ] EventEmitter error event and captureRejections
- [ ] pipeline() vs pipe() for streams
- [ ] Error propagation with context added at each layer

## How to verify

1. Click "Run" — all error handling patterns should be displayed
2. Verify it shows why throw in callback leads to uncaughtException
3. Check that pipeline() is recommended over pipe()
4. Verify error.cause is used for error chaining between layers
