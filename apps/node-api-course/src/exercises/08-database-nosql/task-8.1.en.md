# Task 8.1: MongoDB Native Driver

## 🎯 Goal

Master MongoDB via the native driver: MongoClient connection, CRUD operations, index creation, and aggregation pipeline.

## Requirements

1. Configure `MongoClient` with: maxPoolSize, minPoolSize, maxIdleTimeMS, retryWrites, write concern
2. Implement CRUD: `insertOne`/`insertMany`, `findOne`/`find` with filters (`$gte`, `$in`), `updateOne` with operators (`$set`, `$push`, `$inc`), `deleteOne`
3. Create indexes: unique, compound, text, TTL
4. Show `explain()` for query plan analysis (IXSCAN vs COLLSCAN)
5. Build aggregation pipeline: `$match`, `$group`, `$sort`, `$lookup`

## Checklist

- [ ] MongoClient configured with connection pool and retry
- [ ] CRUD operations use MongoDB operators ($set, $push, $gte, etc.)
- [ ] 4 index types created (unique, compound, text, TTL)
- [ ] explain() shows index usage
- [ ] Aggregation pipeline has at least 3 stages

## How to Verify

Click "Run" and verify that: MongoClient is connected with pool settings, all CRUD operations are demonstrated with results, indexes are created and used, aggregation pipeline returns aggregated data.
