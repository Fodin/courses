# Task 14.1: BullMQ

## 🎯 Goal

Master BullMQ: creating queues, producers for adding jobs, workers for processing with concurrency, retry, events, and monitoring.

## Requirements

1. Create a Queue with Redis connection (IORedis with maxRetriesPerRequest: null)
2. Implement Producer: add with data, attempts (3), exponential backoff, removeOnComplete/Fail
3. Add delayed job (24-hour delay) and bulk add
4. Implement Worker: job processing with updateProgress, concurrency (5), rate limiter
5. Connect QueueEvents for tracking completed/failed/progress and show getJobCounts()

## Checklist

- [ ] Queue created with Redis connection
- [ ] Producer adds jobs with retry and backoff
- [ ] Delayed and bulk jobs work
- [ ] Worker processes with concurrency and tracks progress
- [ ] Events and queue metrics available

## How to Verify

Click "Run" and verify that: queue is created, jobs are added and processed, retry with backoff works, events are logged.
