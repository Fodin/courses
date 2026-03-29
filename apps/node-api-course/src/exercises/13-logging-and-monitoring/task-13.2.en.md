# Task 13.2: Winston

## 🎯 Goal

Master Winston: multiple transports, log rotation, custom formats, and correlation IDs via AsyncLocalStorage.

## Requirements

1. Configure Winston with transports: Console (colorize for dev), File (combined + error), DailyRotateFile
2. Configure DailyRotateFile: datePattern, maxSize, maxFiles (14 days), zippedArchive
3. Implement custom format for adding correlation ID from AsyncLocalStorage
4. Create middleware with AsyncLocalStorage for requestId
5. Show different formats for dev (colorize + simple) and prod (JSON)

## Checklist

- [ ] Winston configured with 3+ transports (Console, File, DailyRotateFile)
- [ ] DailyRotateFile archives and deletes old logs
- [ ] Correlation ID present in all logs of one request
- [ ] AsyncLocalStorage propagates requestId without explicit passing
- [ ] Dev and prod have different output formats

## How to Verify

Click "Run" and verify that: Winston writes to multiple transports, rotation works, correlation ID links request logs.
