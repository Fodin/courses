# Task 14.2: Cron Jobs

## 🎯 Goal

Master node-cron: scheduling periodic tasks, cron expression format, overlap prevention, stop/start, graceful shutdown.

## Requirements

1. Show cron expression format with examples: every minute, daily, weekdays, every 5 minutes
2. Configure cron.schedule with timezone
3. Implement overlap prevention via isRunning flag with try/finally
4. Show stop/start for task management
5. Stop cron jobs on SIGTERM

## Checklist

- [ ] Cron expressions validated via cron.validate()
- [ ] Tasks scheduled with timezone
- [ ] Overlap prevention stops parallel execution
- [ ] Stop/start allow task management
- [ ] SIGTERM gracefully stops all cron jobs

## How to Verify

Click "Run" and verify that: cron jobs are scheduled and execute, overlap prevention works, graceful shutdown stops jobs.
