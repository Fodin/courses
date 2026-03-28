# Task 3.2: Retry pattern

## Goal
Implement a function for automatic retry attempts on error.

## Requirements
1. Create an "unstable" API function that succeeds only from the 3rd attempt
2. Implement a function `retry<T>(fn, options)` with parameters:
   - `maxAttempts` — maximum number of attempts
   - `delay` — delay between attempts (ms)
   - `onRetry` — callback on retry (for logging)
3. Display the retry process in real time on the page
4. Show the final result (success or all attempts exhausted)

## Checklist
- [ ] Unstable API function created
- [ ] `retry` implemented with typing
- [ ] Progress displayed in real time
- [ ] Successful result after several attempts
- [ ] Case of exhausted attempts handled
