# Task 12.2: Process Error Events

## Goal

Master global process error events: `uncaughtException`, `unhandledRejection`, `warning`, and the graceful shutdown pattern.

## Requirements

1. Demonstrate uncaughtException handler explaining why you cannot continue
2. Show unhandledRejection and Node.js 15+ behavior
3. Demonstrate rejectionHandled for "late" .catch()
4. Show warning handling and custom warnings via process.emitWarning
5. Implement graceful shutdown pattern with SIGTERM/SIGINT

## Checklist

- [ ] uncaughtException with logging and process.exit(1)
- [ ] unhandledRejection with behavior explanation
- [ ] rejectionHandled for late handling
- [ ] warning with typical warnings
- [ ] Graceful shutdown: stop server → drain → close resources → exit

## How to verify

1. Click "Run" — all process events should be displayed
2. Verify it explains why process.exit(1) is needed after uncaughtException
3. Check for graceful shutdown with SIGTERM and SIGINT handling
4. Verify safety net via setTimeout + unref() is shown
