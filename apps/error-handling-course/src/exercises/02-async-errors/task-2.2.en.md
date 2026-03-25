# Task 2.2: async/await error handling

## Goal
Learn how to handle errors in async/await code using try/catch.

## Requirements
1. Create a function `simulateApi(shouldFail)` that returns a Promise
2. Wrap `await` in `try/catch/finally`
3. Show both successful and failed requests
4. Demonstrate that in a chain of sequential `await` calls, an error interrupts execution
5. Add a loading indicator

## Checklist
- [ ] `simulateApi` implemented
- [ ] `try/catch/finally` wraps `await`
- [ ] Both success and error shown
- [ ] Chain of `await` interrupts on error
- [ ] Loading indicator works
