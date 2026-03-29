# Task 14.3: Graceful Shutdown

## 🎯 Goal

Master graceful shutdown: SIGTERM/SIGINT handling, rejecting new requests, draining in-flight requests, closing connections, force timeout.

## Requirements

1. Switch health endpoint to 503 when isShuttingDown
2. Add middleware to reject new requests with Connection: close
3. Call server.close() to stop accepting new connections
4. Close all connections via Promise.allSettled: pool, redis, mongoose, worker
5. Set force timeout (30s) for forced exit if hanging

## Checklist

- [ ] SIGTERM and SIGINT handled via gracefulShutdown
- [ ] Health endpoint returns 503 during shutdown
- [ ] New requests rejected with Connection: close
- [ ] In-flight requests complete before closing
- [ ] All connections closed, force timeout prevents hanging

## How to Verify

Click "Run" and verify that: SIGTERM triggers shutdown, health returns 503, connections close in correct order, process exits with code 0.
