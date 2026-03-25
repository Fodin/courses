# Task 7.2: Logging Service

## Goal
Create an ErrorLogger class for centralized error logging.

## Requirements
1. Create an `ErrorLogger` class with methods `error()`, `warn()`, `info()`
2. Each log contains: level, message, timestamp, context?, stack?
3. Implement subscription through `subscribe(fn)` for React integration
4. Add a `clear()` method for clearing logs
5. Display logs as a table with color indicator by level

## Checklist
- [ ] `ErrorLogger` class with 3 methods
- [ ] Subscription through subscribe/unsubscribe
- [ ] Logs displayed in table
- [ ] Color indicator by level
- [ ] Log clearing
