# 🔥 Level 14: Production Patterns

## 🎯 Four Patterns

1. **BullMQ** -- job queues (email, file processing, reports)
2. **Cron Jobs** -- scheduled tasks (cleanup, reports, backups)
3. **Graceful Shutdown** -- proper termination (SIGTERM, draining, cleanup)
4. **GraphQL** -- Apollo Server (schema, resolvers, queries, mutations)

## 🔥 BullMQ

```typescript
const emailQueue = new Queue('email', { connection })
await emailQueue.add('welcome', data, { attempts: 3, backoff: { type: 'exponential', delay: 2000 } })

const worker = new Worker('email', async (job) => {
  await sendEmail(job.data)
}, { connection, concurrency: 5 })
```

## 🔥 Cron Jobs

```typescript
cron.schedule('0 3 * * *', handler, { timezone: 'Europe/Moscow' })
```

Overlap prevention with isRunning flag.

## 🔥 Graceful Shutdown

SIGTERM → isShuttingDown = true → server.close() → close all connections → process.exit(0).

## 🔥 GraphQL

Apollo Server with typeDefs, resolvers, context, and DataLoader for N+1 prevention.

## ⚠️ Common Beginner Mistakes

- Heavy tasks in request handlers (use queues)
- process.exit() without cleanup
- Cron without overlap prevention
- GraphQL N+1 queries (use DataLoader)

## 💡 Best Practices

1. Queues for heavy/async tasks
2. Exponential backoff for retries
3. Graceful shutdown with force timeout
4. DataLoader for GraphQL
5. Bull Board for queue monitoring
