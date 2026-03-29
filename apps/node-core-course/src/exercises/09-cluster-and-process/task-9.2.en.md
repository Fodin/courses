# Task 9.2: Signals & Graceful Shutdown

## Goal

Learn to handle Unix signals and implement the graceful shutdown pattern for production applications.

## Requirements

1. Show main Unix signals: SIGINT, SIGTERM, SIGKILL, SIGHUP
2. Demonstrate signal handling via `process.on`
3. Implement full graceful shutdown: stop server → drain connections → cleanup → exit
4. Show force shutdown timeout
5. Explain Docker specifics (SIGTERM, PID 1)

## Checklist

- [ ] Signal table with descriptions and catchability
- [ ] SIGINT and SIGTERM handling
- [ ] Step-by-step graceful shutdown with phase visualization
- [ ] Force shutdown timeout with unref()
- [ ] Docker specifics described

## How to Verify

1. Click the run button
2. Verify shutdown phases are displayed visually
3. Check shutdown code includes error handling and timeout
