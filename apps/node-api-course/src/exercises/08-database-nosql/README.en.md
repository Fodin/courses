# 🔥 Level 8: NoSQL Databases

## 🎯 Three Technologies

1. **MongoDB** -- document DB, flexible schema, powerful aggregation
2. **Mongoose** -- ODM for MongoDB with validation, middleware, typing
3. **Redis** -- in-memory store for caching, sessions, pub/sub

## 🔥 Document vs Relational DBs

| Feature | SQL (PostgreSQL) | NoSQL (MongoDB) |
|---|---|---|
| Data model | Tables, rows, columns | Collections, documents (JSON) |
| Schema | Strict (ALTER TABLE) | Flexible (schema-less) |
| Relations | JOIN | Embedding / $lookup |
| Transactions | ACID by default | ACID since v4.0 (multi-doc) |
| Scaling | Vertical | Horizontal (sharding) |
| Best for | Complex relations, finance | Flexible data, prototypes |

## 🔥 MongoDB Native Driver

```typescript
const client = new MongoClient(uri, { maxPoolSize: 10, retryWrites: true })
const db = client.db('myapp')
const users = db.collection('users')

// CRUD
await users.insertOne({ name: 'Alice', email: 'alice@test.com' })
const user = await users.findOne({ email: 'alice@test.com' })
await users.updateOne({ _id: id }, { $set: { name: 'Updated' } })
await users.deleteOne({ _id: id })
```

Indexes, aggregation pipeline, and `$lookup` for joins.

## 🔥 Mongoose ODM

```typescript
const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, lowercase: true }
}, { timestamps: true })

// Virtuals, middleware (pre/post save/find), population
const post = await Post.findById(id).populate('author', 'name email')
```

## 🔥 Redis

```typescript
await client.setEx('user:1', 300, JSON.stringify(user)) // TTL 300s
const cached = await client.get('user:1')

// Pub/Sub (separate connection for subscriber)
await subscriber.subscribe('channel', (msg) => console.log(msg))
await publisher.publish('channel', JSON.stringify(data))
```

Cache-aside pattern: check cache -> query DB -> store in cache.

## ⚠️ Common Beginner Mistakes

- Embedding unbounded arrays (16MB document limit)
- Missing indexes (COLLSCAN on millions of docs)
- N+1 queries in Mongoose (use `.populate()`)
- Redis keys without TTL (memory leak)

## 💡 Best Practices

1. Embed data read together, reference growing data
2. Index all filtered/sorted fields
3. Always set TTL on Redis keys
4. Separate Redis connection for Pub/Sub
5. Use aggregation pipeline instead of in-code processing
