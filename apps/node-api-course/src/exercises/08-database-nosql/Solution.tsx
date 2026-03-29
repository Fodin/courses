import { useState } from 'react'

// ============================================
// Task 8.1: MongoDB Native Driver — Solution
// ============================================

interface MongoDocument {
  _id: string
  name: string
  email: string
  age: number
  tags: string[]
}

const sampleUsers: MongoDocument[] = [
  { _id: '64a1b2c3d4e5f6a7b8c9d0e1', name: 'Alice', email: 'alice@example.com', age: 28, tags: ['developer', 'nodejs'] },
  { _id: '64a1b2c3d4e5f6a7b8c9d0e2', name: 'Bob', email: 'bob@example.com', age: 34, tags: ['designer', 'ui'] },
  { _id: '64a1b2c3d4e5f6a7b8c9d0e3', name: 'Charlie', email: 'charlie@example.com', age: 22, tags: ['developer', 'react'] },
  { _id: '64a1b2c3d4e5f6a7b8c9d0e4', name: 'Diana', email: 'diana@example.com', age: 31, tags: ['developer', 'python'] },
  { _id: '64a1b2c3d4e5f6a7b8c9d0e5', name: 'Eve', email: 'eve@example.com', age: 26, tags: ['devops', 'nodejs'] },
]

export function Task8_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateConnection = () => {
    const log: string[] = []
    log.push('// === MongoClient Connection ===')
    log.push("import { MongoClient } from 'mongodb'")
    log.push('')
    log.push("const uri = 'mongodb://localhost:27017'")
    log.push("const client = new MongoClient(uri, {")
    log.push('  maxPoolSize: 10,')
    log.push('  minPoolSize: 2,')
    log.push('  maxIdleTimeMS: 30000,')
    log.push('  retryWrites: true,')
    log.push('  w: "majority"')
    log.push('})')
    log.push('')
    log.push('[CONNECT] Connecting to MongoDB...')
    log.push('[OK] Connected to MongoDB cluster')
    log.push("[DB] Using database: 'myapp'")
    log.push("[COLLECTION] Collection: 'users'")
    log.push('')
    log.push('// Connection pooling is automatic:')
    log.push('[POOL] Pool size: 2/10 (min/max)')
    log.push('[POOL] Active connections: 1')
    log.push('[POOL] Available connections: 1')
    setResults(log)
    setActiveDemo('connection')
  }

  const simulateCRUD = () => {
    const log: string[] = []
    log.push('// === CRUD Operations ===')
    log.push('')
    log.push('// --- insertOne ---')
    log.push('const result = await collection.insertOne({')
    log.push("  name: 'Frank',")
    log.push("  email: 'frank@example.com',")
    log.push('  age: 29,')
    log.push("  tags: ['developer', 'go']")
    log.push('})')
    log.push('[INSERT] insertedId: 64a1b2c3d4e5f6a7b8c9d0f1')
    log.push('[INSERT] acknowledged: true')
    log.push('')
    log.push('// --- insertMany ---')
    log.push('const bulkResult = await collection.insertMany([')
    log.push("  { name: 'Grace', email: 'grace@example.com', age: 27 },")
    log.push("  { name: 'Hank', email: 'hank@example.com', age: 35 }")
    log.push('])')
    log.push('[INSERT] insertedCount: 2')
    log.push('')
    log.push('// --- findOne ---')
    log.push("const user = await collection.findOne({ name: 'Alice' })")
    log.push(`[FIND] ${JSON.stringify(sampleUsers[0], null, 2)}`)
    log.push('')
    log.push('// --- find with filter ---')
    log.push('const devs = await collection.find({')
    log.push("  tags: 'developer',")
    log.push('  age: { $gte: 25 }')
    log.push('}).toArray()')
    const devs = sampleUsers.filter(u => u.tags.includes('developer') && u.age >= 25)
    log.push(`[FIND] Found ${devs.length} documents:`)
    devs.forEach(u => log.push(`  - ${u.name} (age: ${u.age})`))
    log.push('')
    log.push('// --- updateOne ---')
    log.push("await collection.updateOne({ name: 'Bob' }, { $set: { age: 35 }, $push: { tags: 'lead' } })")
    log.push('[UPDATE] matchedCount: 1, modifiedCount: 1')
    log.push('')
    log.push('// --- deleteOne ---')
    log.push("await collection.deleteOne({ name: 'Eve' })")
    log.push('[DELETE] deletedCount: 1')
    setResults(log)
    setActiveDemo('crud')
  }

  const simulateIndexes = () => {
    const log: string[] = []
    log.push('// === Indexes ===')
    log.push('')
    log.push('// Single field index')
    log.push("await collection.createIndex({ email: 1 }, { unique: true })")
    log.push('[INDEX] Created index: email_1 (unique)')
    log.push('')
    log.push('// Compound index')
    log.push('await collection.createIndex({ age: 1, name: 1 })')
    log.push('[INDEX] Created index: age_1_name_1')
    log.push('')
    log.push('// Text index for full-text search')
    log.push("await collection.createIndex({ name: 'text', email: 'text' })")
    log.push('[INDEX] Created text index on: name, email')
    log.push('')
    log.push('// TTL index (auto-delete after 24h)')
    log.push('await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 })')
    log.push('[INDEX] Created TTL index: createdAt_1 (expires: 86400s)')
    log.push('')
    log.push('// List all indexes')
    log.push('const indexes = await collection.indexes()')
    log.push('[INDEXES] Current indexes:')
    log.push('  1. _id_          (default)')
    log.push('  2. email_1       (unique)')
    log.push('  3. age_1_name_1  (compound)')
    log.push('  4. name_text_email_text (text)')
    log.push('  5. createdAt_1   (TTL: 86400s)')
    log.push('')
    log.push('// Explain query plan')
    log.push("const plan = await collection.find({ email: 'alice@example.com' }).explain()")
    log.push('[EXPLAIN] Winning plan: IXSCAN (email_1)')
    log.push('[EXPLAIN] Documents examined: 1')
    log.push('[EXPLAIN] Keys examined: 1')
    setResults(log)
    setActiveDemo('indexes')
  }

  const simulateAggregation = () => {
    const log: string[] = []
    log.push('// === Aggregation Pipeline ===')
    log.push('')
    log.push('const pipeline = [')
    log.push('  // Stage 1: Filter developers')
    log.push('  { $match: { tags: "developer" } },')
    log.push('')
    log.push('  // Stage 2: Group by age range')
    log.push('  { $bucket: {')
    log.push('    groupBy: "$age",')
    log.push('    boundaries: [20, 25, 30, 35, 40],')
    log.push('    default: "40+",')
    log.push('    output: {')
    log.push('      count: { $sum: 1 },')
    log.push('      names: { $push: "$name" },')
    log.push('      avgAge: { $avg: "$age" }')
    log.push('    }')
    log.push('  }},')
    log.push('')
    log.push('  // Stage 3: Sort by count descending')
    log.push('  { $sort: { count: -1 } }')
    log.push(']')
    log.push('')
    log.push('const results = await collection.aggregate(pipeline).toArray()')
    log.push('')
    log.push('[AGG] Pipeline results:')
    log.push('  Age 20-25: { count: 1, names: ["Charlie"], avgAge: 22 }')
    log.push('  Age 25-30: { count: 2, names: ["Alice", "Eve"], avgAge: 27 }')
    log.push('  Age 30-35: { count: 1, names: ["Diana"], avgAge: 31 }')
    log.push('')
    log.push('// Another example: $lookup (JOIN)')
    log.push('const joinPipeline = [')
    log.push('  { $lookup: {')
    log.push('    from: "orders",')
    log.push('    localField: "_id",')
    log.push('    foreignField: "userId",')
    log.push('    as: "orders"')
    log.push('  }},')
    log.push('  { $addFields: { orderCount: { $size: "$orders" } } },')
    log.push('  { $project: { name: 1, orderCount: 1 } }')
    log.push(']')
    log.push('')
    log.push('[AGG] Join results:')
    log.push('  { name: "Alice", orderCount: 5 }')
    log.push('  { name: "Bob", orderCount: 3 }')
    log.push('  { name: "Charlie", orderCount: 0 }')
    setResults(log)
    setActiveDemo('aggregation')
  }

  const buttons = [
    { id: 'connection', label: 'MongoClient', handler: simulateConnection },
    { id: 'crud', label: 'CRUD Operations', handler: simulateCRUD },
    { id: 'indexes', label: 'Indexes', handler: simulateIndexes },
    { id: 'aggregation', label: 'Aggregation', handler: simulateAggregation },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 8.1: MongoDB Native Driver</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#1976d2' : '#e3f2fd',
              color: activeDemo === b.id ? 'white' : '#1976d2',
              border: '1px solid #1976d2',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.2: Mongoose — Solution
// ============================================

interface MongooseUser {
  _id: string
  name: string
  email: string
  age: number
  profile?: { bio: string; avatar: string }
  posts: Array<{ title: string; body: string }>
}

export function Task8_2_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateSchema = () => {
    const log: string[] = []
    log.push('// === Mongoose Schema Definition ===')
    log.push("import mongoose, { Schema, model, Document } from 'mongoose'")
    log.push('')
    log.push('// Interface for TypeScript')
    log.push('interface IUser extends Document {')
    log.push('  name: string')
    log.push('  email: string')
    log.push('  age: number')
    log.push('  role: "user" | "admin" | "moderator"')
    log.push('  profile: { bio: string; avatar: string }')
    log.push('  createdAt: Date')
    log.push('  fullInfo: string  // virtual')
    log.push('}')
    log.push('')
    log.push('const userSchema = new Schema<IUser>({')
    log.push('  name: {')
    log.push('    type: String,')
    log.push('    required: [true, "Name is required"],')
    log.push('    trim: true,')
    log.push('    minlength: [2, "Name must be at least 2 chars"],')
    log.push('    maxlength: [50, "Name must be at most 50 chars"]')
    log.push('  },')
    log.push('  email: {')
    log.push('    type: String,')
    log.push('    required: true,')
    log.push('    unique: true,')
    log.push('    lowercase: true,')
    log.push('    match: [/^\\S+@\\S+\\.\\S+$/, "Invalid email"]')
    log.push('  },')
    log.push('  age: {')
    log.push('    type: Number,')
    log.push('    min: [0, "Age cannot be negative"],')
    log.push('    max: [150, "Age seems too high"],')
    log.push('    index: true')
    log.push('  },')
    log.push('  role: {')
    log.push('    type: String,')
    log.push('    enum: ["user", "admin", "moderator"],')
    log.push('    default: "user"')
    log.push('  },')
    log.push('  profile: {')
    log.push('    bio: { type: String, default: "" },')
    log.push('    avatar: { type: String, default: "default.png" }')
    log.push('  }')
    log.push('}, { timestamps: true, versionKey: false })')
    log.push('')
    log.push('[SCHEMA] Schema created with validation, defaults, timestamps')
    log.push('[SCHEMA] Fields: name(String), email(String), age(Number), role(String), profile(Object)')
    setResults(log)
    setActiveDemo('schema')
  }

  const simulateVirtualsMiddleware = () => {
    const log: string[] = []
    log.push('// === Virtuals ===')
    log.push("userSchema.virtual('fullInfo').get(function() {")
    log.push("  return `${this.name} (${this.email}) - age: ${this.age}`")
    log.push('})')
    log.push('')
    log.push("userSchema.virtual('posts', {")
    log.push("  ref: 'Post',")
    log.push("  localField: '_id',")
    log.push("  foreignField: 'author'")
    log.push('})')
    log.push('')
    log.push('[VIRTUAL] user.fullInfo => "Alice (alice@example.com) - age: 28"')
    log.push('')
    log.push('// === Middleware (Hooks) ===')
    log.push('')
    log.push("// Pre-save: hash password")
    log.push("userSchema.pre('save', async function(next) {")
    log.push('  if (this.isModified("password")) {')
    log.push('    this.password = await bcrypt.hash(this.password, 12)')
    log.push('    console.log("[PRE-SAVE] Password hashed")')
    log.push('  }')
    log.push('  next()')
    log.push('})')
    log.push('[MIDDLEWARE] pre("save") registered: password hashing')
    log.push('')
    log.push("// Post-save: send welcome email")
    log.push("userSchema.post('save', function(doc) {")
    log.push('  console.log(`[POST-SAVE] Welcome email sent to ${doc.email}`)')
    log.push('})')
    log.push('[MIDDLEWARE] post("save") registered: welcome email')
    log.push('')
    log.push("// Pre-find: exclude deleted")
    log.push("userSchema.pre(/^find/, function(next) {")
    log.push('  this.where({ isDeleted: { $ne: true } })')
    log.push('  next()')
    log.push('})')
    log.push('[MIDDLEWARE] pre("find") registered: soft-delete filter')
    log.push('')
    log.push("// Pre-remove: cleanup related data")
    log.push("userSchema.pre('deleteOne', { document: true }, async function(next) {")
    log.push("  await Post.deleteMany({ author: this._id })")
    log.push('  next()')
    log.push('})')
    log.push('[MIDDLEWARE] pre("deleteOne") registered: cascade delete posts')
    setResults(log)
    setActiveDemo('virtuals')
  }

  const simulatePopulation = () => {
    const log: string[] = []
    log.push('// === Population (Reference-based Relations) ===')
    log.push('')
    log.push('// Post schema with reference to User')
    log.push('const postSchema = new Schema({')
    log.push('  title: String,')
    log.push('  body: String,')
    log.push("  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },")
    log.push("  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]")
    log.push('})')
    log.push('')
    log.push('// Simple populate')
    log.push("const post = await Post.findById(postId).populate('author')")
    log.push('[POPULATE] Before: { author: "64a1b2c3..." }')
    log.push('[POPULATE] After:  { author: { _id: "64a1b2c3...", name: "Alice", email: "alice@example.com" } }')
    log.push('')
    log.push('// Selective populate (only specific fields)')
    log.push("const post2 = await Post.findById(postId).populate('author', 'name email')")
    log.push('[POPULATE] { author: { name: "Alice", email: "alice@example.com" } }')
    log.push('')
    log.push('// Deep populate (nested)')
    log.push('const post3 = await Post.findById(postId)')
    log.push("  .populate('author')")
    log.push("  .populate({")
    log.push("    path: 'comments',")
    log.push("    populate: { path: 'author', select: 'name' }")
    log.push('  })')
    log.push('[POPULATE] Nested: post.comments[0].author => { name: "Bob" }')
    log.push('')
    log.push('// Populate with match filter')
    log.push("const user = await User.findById(userId).populate({")
    log.push("  path: 'posts',")
    log.push("  match: { published: true },")
    log.push("  options: { sort: { createdAt: -1 }, limit: 5 }")
    log.push('})')
    log.push('[POPULATE] Filtered: 5 published posts, sorted by date desc')
    log.push('')
    log.push('// Instance methods')
    log.push("userSchema.methods.comparePassword = async function(candidate: string) {")
    log.push('  return bcrypt.compare(candidate, this.password)')
    log.push('}')
    log.push('')
    log.push("userSchema.statics.findByEmail = function(email: string) {")
    log.push('  return this.findOne({ email: email.toLowerCase() })')
    log.push('}')
    log.push('')
    log.push('[METHOD] user.comparePassword("secret") => true')
    log.push('[STATIC] User.findByEmail("alice@example.com") => { name: "Alice", ... }')
    setResults(log)
    setActiveDemo('population')
  }

  const buttons = [
    { id: 'schema', label: 'Schema & Validation', handler: simulateSchema },
    { id: 'virtuals', label: 'Virtuals & Middleware', handler: simulateVirtualsMiddleware },
    { id: 'population', label: 'Population & Methods', handler: simulatePopulation },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 8.2: Mongoose</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#388e3c' : '#e8f5e9',
              color: activeDemo === b.id ? 'white' : '#388e3c',
              border: '1px solid #388e3c',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.3: Redis — Solution
// ============================================

export function Task8_3_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateBasics = () => {
    const log: string[] = []
    log.push('// === Redis Basic Operations ===')
    log.push("import { createClient } from 'redis'")
    log.push('')
    log.push('const client = createClient({ url: "redis://localhost:6379" })')
    log.push('await client.connect()')
    log.push('[REDIS] Connected to Redis 7.2')
    log.push('')
    log.push('// --- Strings ---')
    log.push('await client.set("user:1:name", "Alice")')
    log.push('[SET] user:1:name = "Alice"')
    log.push('')
    log.push('const name = await client.get("user:1:name")')
    log.push('[GET] user:1:name => "Alice"')
    log.push('')
    log.push('// SET with TTL (expires in 60 seconds)')
    log.push('await client.setEx("session:abc123", 60, JSON.stringify({ userId: 1 }))')
    log.push('[SETEX] session:abc123 (TTL: 60s)')
    log.push('')
    log.push('const ttl = await client.ttl("session:abc123")')
    log.push('[TTL] session:abc123 => 58 seconds remaining')
    log.push('')
    log.push('// --- Hashes ---')
    log.push('await client.hSet("user:1", { name: "Alice", email: "alice@example.com", age: "28" })')
    log.push('[HSET] user:1 = { name, email, age }')
    log.push('')
    log.push('const user = await client.hGetAll("user:1")')
    log.push('[HGETALL] user:1 => { name: "Alice", email: "alice@example.com", age: "28" }')
    log.push('')
    log.push('// --- Lists ---')
    log.push('await client.lPush("queue:emails", "email1", "email2", "email3")')
    log.push('[LPUSH] queue:emails << [email3, email2, email1]')
    log.push('')
    log.push('const next = await client.rPop("queue:emails")')
    log.push('[RPOP] queue:emails => "email1"')
    log.push('')
    log.push('// --- Sets ---')
    log.push('await client.sAdd("tags:post:1", "nodejs", "api", "mongodb")')
    log.push('[SADD] tags:post:1 = { nodejs, api, mongodb }')
    log.push('')
    log.push('// --- Delete ---')
    log.push('await client.del("user:1:name")')
    log.push('[DEL] user:1:name deleted')
    setResults(log)
    setActiveDemo('basics')
  }

  const simulateCacheAside = () => {
    const log: string[] = []
    log.push('// === Cache-Aside Pattern ===')
    log.push('')
    log.push('async function getUserById(id: string) {')
    log.push('  const cacheKey = `user:${id}`')
    log.push('')
    log.push('  // 1. Try cache first')
    log.push('  const cached = await redis.get(cacheKey)')
    log.push('  if (cached) {')
    log.push('    console.log("[CACHE HIT]")')
    log.push('    return JSON.parse(cached)')
    log.push('  }')
    log.push('')
    log.push('  // 2. Cache miss — query database')
    log.push('  console.log("[CACHE MISS]")')
    log.push('  const user = await db.collection("users").findOne({ _id: id })')
    log.push('')
    log.push('  // 3. Store in cache with TTL')
    log.push('  if (user) {')
    log.push('    await redis.setEx(cacheKey, 300, JSON.stringify(user))')
    log.push('    console.log("[CACHE SET] TTL: 300s")')
    log.push('  }')
    log.push('')
    log.push('  return user')
    log.push('}')
    log.push('')
    log.push('// Simulation:')
    log.push('[REQUEST] GET /users/1')
    log.push('[CACHE MISS] Key "user:1" not found in Redis')
    log.push('[DB QUERY] SELECT * FROM users WHERE id = 1 (45ms)')
    log.push('[CACHE SET] user:1 stored (TTL: 300s)')
    log.push('[RESPONSE] 200 OK (52ms)')
    log.push('')
    log.push('[REQUEST] GET /users/1  (second request)')
    log.push('[CACHE HIT] Key "user:1" found in Redis')
    log.push('[RESPONSE] 200 OK (2ms)  <-- 25x faster!')
    log.push('')
    log.push('// Cache invalidation on update:')
    log.push('async function updateUser(id: string, data: Partial<User>) {')
    log.push('  await db.collection("users").updateOne({ _id: id }, { $set: data })')
    log.push('  await redis.del(`user:${id}`)  // Invalidate cache')
    log.push('  console.log("[CACHE INVALIDATED]")')
    log.push('}')
    log.push('')
    log.push('[UPDATE] PUT /users/1 { name: "Alice Updated" }')
    log.push('[DB UPDATE] Modified 1 document')
    log.push('[CACHE INVALIDATED] user:1 deleted from Redis')
    setResults(log)
    setActiveDemo('cache')
  }

  const simulatePubSub = () => {
    const log: string[] = []
    log.push('// === Redis Pub/Sub ===')
    log.push('')
    log.push("import { createClient } from 'redis'")
    log.push('')
    log.push('// Subscriber needs a dedicated connection')
    log.push('const subscriber = createClient()')
    log.push('const publisher = createClient()')
    log.push('await subscriber.connect()')
    log.push('await publisher.connect()')
    log.push('')
    log.push('// Subscribe to channels')
    log.push("await subscriber.subscribe('notifications', (message, channel) => {")
    log.push('  console.log(`[SUB] ${channel}: ${message}`)')
    log.push('})')
    log.push('[SUBSCRIBE] Listening on channel: "notifications"')
    log.push('')
    log.push("await subscriber.pSubscribe('order:*', (message, channel) => {")
    log.push('  console.log(`[PSUB] ${channel}: ${message}`)')
    log.push('})')
    log.push('[PSUBSCRIBE] Pattern: "order:*"')
    log.push('')
    log.push('// Publish messages')
    log.push("await publisher.publish('notifications', JSON.stringify({")
    log.push("  type: 'new_order',")
    log.push("  orderId: 'ORD-001',")
    log.push('  total: 99.99')
    log.push('}))')
    log.push('[PUBLISH] notifications => { type: "new_order", orderId: "ORD-001" }')
    log.push('[SUB] notifications: {"type":"new_order","orderId":"ORD-001","total":99.99}')
    log.push('')
    log.push("await publisher.publish('order:created', 'ORD-002')")
    log.push('[PUBLISH] order:created => "ORD-002"')
    log.push('[PSUB] order:created: ORD-002  (matched pattern "order:*")')
    log.push('')
    log.push("await publisher.publish('order:shipped', 'ORD-001')")
    log.push('[PUBLISH] order:shipped => "ORD-001"')
    log.push('[PSUB] order:shipped: ORD-001  (matched pattern "order:*")')
    log.push('')
    log.push('// Unsubscribe')
    log.push("await subscriber.unsubscribe('notifications')")
    log.push('[UNSUBSCRIBE] Stopped listening on: "notifications"')
    setResults(log)
    setActiveDemo('pubsub')
  }

  const buttons = [
    { id: 'basics', label: 'Get/Set/Del & TTL', handler: simulateBasics },
    { id: 'cache', label: 'Cache-Aside Pattern', handler: simulateCacheAside },
    { id: 'pubsub', label: 'Pub/Sub', handler: simulatePubSub },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 8.3: Redis</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#d32f2f' : '#ffebee',
              color: activeDemo === b.id ? 'white' : '#d32f2f',
              border: '1px solid #d32f2f',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {b.label}
          </button>
        ))}
      </div>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre', fontSize: '0.85rem' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
