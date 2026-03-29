# Task 9.4: Cluster Module

## Goal

Learn to scale Node.js HTTP servers via cluster: fork workers, load balancing, auto-restart, and zero-downtime restart.

## Requirements

1. Show a basic cluster server: isPrimary → fork → listen
2. Demonstrate automatic restart of crashed workers
3. Show load balancing strategies: Round-Robin vs OS-based
4. Implement zero-downtime restart (rolling restart)
5. Show IPC between Primary and Workers

## Checklist

- [ ] Basic cluster with worker visualization
- [ ] Auto-restart on worker crash
- [ ] Load balancing strategies described
- [ ] Rolling restart code step by step
- [ ] IPC message exchange

## How to Verify

1. Click the run button
2. Verify workers are displayed visually with PID and status
3. Check zero-downtime restart is described step by step
