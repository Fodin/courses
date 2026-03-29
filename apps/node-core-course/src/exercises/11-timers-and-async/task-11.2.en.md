# Task 11.2: AbortController

## Goal

Master the async operation cancellation mechanism via `AbortController` and `AbortSignal`: cancelling requests, timers, signal composition, and handling abort reasons.

## Requirements

1. Demonstrate basic AbortController usage for fetch cancellation
2. Show cancellable setTimeout via timers/promises with signal
3. Demonstrate abort() with reason and signal.reason access
4. Show AbortSignal.timeout() for automatic timeout
5. Demonstrate AbortSignal.any() for composing multiple signals
6. Show throwIfAborted() and addEventListener('abort') for cancellation handling

## Checklist

- [ ] Basic fetch cancellation via AbortController
- [ ] Cancellable timer via timers/promises
- [ ] abort() with reason and signal.reason reading
- [ ] AbortSignal.timeout() for automatic cancellation
- [ ] AbortSignal.any() for signal composition
- [ ] throwIfAborted() in processing loop

## How to verify

1. Click "Run" — all cancellation scenarios should be displayed
2. Verify the difference between AbortError and other errors is shown
3. Check that AbortSignal.timeout() is shown as replacement for manual setTimeout
4. Verify AbortSignal.any() is explained for combining signals
