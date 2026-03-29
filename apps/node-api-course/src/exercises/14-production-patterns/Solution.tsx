import { useState } from 'react'

// ============================================
// Task 14.1: BullMQ — Solution
// ============================================

export function Task14_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateProducerWorker = () => {
    const log: string[] = []
    log.push('// === BullMQ: Queues, Producers, Workers ===')
    log.push("import { Queue, Worker, QueueEvents } from 'bullmq'")
    log.push("import IORedis from 'ioredis'")
    log.push('')
    log.push('const connection = new IORedis({ host: "localhost", port: 6379, maxRetriesPerRequest: null })')
    log.push('')
    log.push('// Create queue')
    log.push('const emailQueue = new Queue("email", { connection })')
    log.push('')
    log.push('// Producer: add jobs')
    log.push('await emailQueue.add("welcome", {')
    log.push('  to: "alice@example.com",')
    log.push('  subject: "Welcome!",')
    log.push('  template: "welcome"')
    log.push('}, {')
    log.push('  attempts: 3,')
    log.push('  backoff: { type: "exponential", delay: 2000 },')
    log.push('  removeOnComplete: { count: 1000 },')
    log.push('  removeOnFail: { age: 7 * 24 * 3600 }  // keep 7 days')
    log.push('})')
    log.push('[PRODUCER] Job added: welcome (id: 1)')
    log.push('')
    log.push('// Delayed job')
    log.push('await emailQueue.add("reminder", { to: "bob@example.com" }, {')
    log.push('  delay: 24 * 60 * 60 * 1000  // 24 hours')
    log.push('})')
    log.push('[PRODUCER] Delayed job added: reminder (runs in 24h)')
    log.push('')
    log.push('// Worker: process jobs')
    log.push('const worker = new Worker("email", async (job) => {')
    log.push('  console.log(`[WORKER] Processing: ${job.name} (id: ${job.id})`)')
    log.push('  const { to, subject, template } = job.data')
    log.push('')
    log.push('  // Update progress')
    log.push('  await job.updateProgress(50)')
    log.push('  await sendEmail(to, subject, template)')
    log.push('  await job.updateProgress(100)')
    log.push('')
    log.push('  return { sent: true, timestamp: Date.now() }')
    log.push('}, {')
    log.push('  connection,')
    log.push('  concurrency: 5,  // process 5 jobs in parallel')
    log.push('  limiter: { max: 100, duration: 60000 }  // 100 jobs/min')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[QUEUE] email: 3 jobs waiting')
    log.push('[WORKER] Processing: welcome (id: 1)')
    log.push('[WORKER] Progress: 50%')
    log.push('[WORKER] Progress: 100%')
    log.push('[WORKER] Completed: welcome (id: 1) in 320ms')
    log.push('[WORKER] Processing: newsletter (id: 2)')
    log.push('[WORKER] FAILED: newsletter (id: 2) - SMTP timeout')
    log.push('[WORKER] Retrying in 2000ms (attempt 1/3)')
    log.push('[WORKER] Retrying in 4000ms (attempt 2/3)')
    log.push('[WORKER] Completed: newsletter (id: 2) on retry 2')
    setResults(log)
    setActiveDemo('producer')
  }

  const simulateEvents = () => {
    const log: string[] = []
    log.push('// === Job Events & Monitoring ===')
    log.push('')
    log.push('const queueEvents = new QueueEvents("email", { connection })')
    log.push('')
    log.push("queueEvents.on('completed', ({ jobId, returnvalue }) => {")
    log.push('  console.log(`[EVENT] Job ${jobId} completed:`, returnvalue)')
    log.push('})')
    log.push('')
    log.push("queueEvents.on('failed', ({ jobId, failedReason }) => {")
    log.push('  console.log(`[EVENT] Job ${jobId} failed:`, failedReason)')
    log.push('})')
    log.push('')
    log.push("queueEvents.on('progress', ({ jobId, data }) => {")
    log.push('  console.log(`[EVENT] Job ${jobId} progress:`, data)')
    log.push('})')
    log.push('')
    log.push('// Queue metrics')
    log.push('const counts = await emailQueue.getJobCounts()')
    log.push('console.log(counts)')
    log.push('// { waiting: 5, active: 2, completed: 150, failed: 3, delayed: 1 }')
    log.push('')
    log.push('// Priority queues')
    log.push('await emailQueue.add("urgent", data, { priority: 1 })  // processed first')
    log.push('await emailQueue.add("normal", data, { priority: 10 })')
    log.push('')
    log.push('// Bulk add')
    log.push('await emailQueue.addBulk([')
    log.push('  { name: "newsletter", data: { to: "user1@test.com" } },')
    log.push('  { name: "newsletter", data: { to: "user2@test.com" } },')
    log.push('  { name: "newsletter", data: { to: "user3@test.com" } }')
    log.push('])')
    log.push('[BULK] 3 jobs added to queue')
    log.push('')
    log.push('// Repeatable jobs (cron-like)')
    log.push('await emailQueue.add("daily-digest", {}, {')
    log.push('  repeat: { pattern: "0 9 * * *" }  // every day at 9 AM')
    log.push('})')
    log.push('[REPEAT] daily-digest scheduled: 0 9 * * *')
    log.push('')
    log.push('// Dashboard: bull-board')
    log.push("import { createBullBoard } from '@bull-board/api'")
    log.push("import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'")
    log.push("import { ExpressAdapter } from '@bull-board/express'")
    log.push('')
    log.push('const serverAdapter = new ExpressAdapter()')
    log.push('createBullBoard({ queues: [new BullMQAdapter(emailQueue)], serverAdapter })')
    log.push("app.use('/admin/queues', serverAdapter.getRouter())")
    log.push('[DASHBOARD] Bull Board at http://localhost:3000/admin/queues')
    setResults(log)
    setActiveDemo('events')
  }

  const buttons = [
    { id: 'producer', label: 'Producer & Worker', handler: simulateProducerWorker },
    { id: 'events', label: 'Events & Monitoring', handler: simulateEvents },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 14.1: BullMQ Job Queues</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#c62828' : '#ffebee',
              color: activeDemo === b.id ? 'white' : '#c62828',
              border: '1px solid #c62828',
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
// Task 14.2: Cron Jobs — Solution
// ============================================

export function Task14_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Cron Jobs with node-cron ===')
    log.push("import cron from 'node-cron'")
    log.push('')
    log.push('// Cron expression: second(opt) minute hour day month weekday')
    log.push('//                  *           *      *    *   *     *')
    log.push('//')
    log.push('// Examples:')
    log.push('// "* * * * *"        every minute')
    log.push('// "0 * * * *"        every hour')
    log.push('// "0 9 * * *"        daily at 9:00 AM')
    log.push('// "0 9 * * 1-5"      weekdays at 9:00 AM')
    log.push('// "0 0 1 * *"        first day of month')
    log.push('// "*/5 * * * *"      every 5 minutes')
    log.push('')
    log.push('// Validate expression')
    log.push("cron.validate('0 9 * * *')  // true")
    log.push("cron.validate('invalid')    // false")
    log.push('')
    log.push('// Schedule tasks')
    log.push("const cleanupJob = cron.schedule('0 3 * * *', async () => {")
    log.push("  console.log('[CRON] Running cleanup...')")
    log.push('  await db.sessions.deleteMany({ expiresAt: { $lt: new Date() } })')
    log.push("  console.log('[CRON] Expired sessions cleaned')")
    log.push('}, {')
    log.push('  scheduled: true,')
    log.push("  timezone: 'Europe/Moscow'")
    log.push('})')
    log.push('')
    log.push('// Overlap prevention')
    log.push('let isRunning = false')
    log.push('')
    log.push("cron.schedule('*/5 * * * *', async () => {")
    log.push('  if (isRunning) {')
    log.push("    console.log('[CRON] Previous run still active, skipping')")
    log.push('    return')
    log.push('  }')
    log.push('  isRunning = true')
    log.push('  try {')
    log.push('    await generateReports()')
    log.push('  } finally {')
    log.push('    isRunning = false')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// Stop/start')
    log.push('cleanupJob.stop()    // pause')
    log.push('cleanupJob.start()   // resume')
    log.push('')
    log.push('// Graceful shutdown')
    log.push("process.on('SIGTERM', () => {")
    log.push('  cleanupJob.stop()')
    log.push("  console.log('[CRON] All jobs stopped')")
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[CRON] Scheduled: cleanup (daily at 03:00 MSK)')
    log.push('[CRON] Scheduled: reports (every 5 minutes)')
    log.push('[CRON] 03:00 - Running cleanup...')
    log.push('[CRON] 03:00 - Deleted 142 expired sessions')
    log.push('[CRON] 03:05 - Running reports...')
    log.push('[CRON] 03:10 - Previous run still active, skipping')
    log.push('[CRON] 03:12 - Reports completed (7 min)')
    log.push('[CRON] 03:15 - Running reports...')
    log.push('[CRON] 03:15 - Reports completed (45s)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.2: Cron Jobs</h2>
      <button onClick={runExample}>Запустить</button>
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
// Task 14.3: Graceful Shutdown — Solution
// ============================================

export function Task14_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Graceful Shutdown ===')
    log.push('')
    log.push('let isShuttingDown = false')
    log.push('')
    log.push('// Health endpoint reflects shutdown state')
    log.push("app.get('/health', (req, res) => {")
    log.push('  if (isShuttingDown) {')
    log.push('    return res.status(503).json({ status: "shutting_down" })')
    log.push('  }')
    log.push('  res.json({ status: "ok" })')
    log.push('})')
    log.push('')
    log.push('// Reject new requests during shutdown')
    log.push('app.use((req, res, next) => {')
    log.push('  if (isShuttingDown) {')
    log.push("    res.setHeader('Connection', 'close')")
    log.push('    return res.status(503).json({ error: "Server is shutting down" })')
    log.push('  }')
    log.push('  next()')
    log.push('})')
    log.push('')
    log.push('const server = app.listen(3000)')
    log.push('')
    log.push('async function gracefulShutdown(signal: string) {')
    log.push('  console.log(`[SHUTDOWN] Received ${signal}`)')
    log.push('  isShuttingDown = true')
    log.push('')
    log.push('  // 1. Stop accepting new connections')
    log.push('  server.close(() => {')
    log.push("    console.log('[SHUTDOWN] HTTP server closed')")
    log.push('  })')
    log.push('')
    log.push('  // 2. Wait for in-flight requests (with timeout)')
    log.push('  const forceTimeout = setTimeout(() => {')
    log.push("    console.error('[SHUTDOWN] Forced exit after timeout')")
    log.push('    process.exit(1)')
    log.push('  }, 30000) // 30s max')
    log.push('')
    log.push('  try {')
    log.push('    // 3. Close all connections')
    log.push('    await Promise.allSettled([')
    log.push('      pool.end(),           // PostgreSQL')
    log.push('      redis.quit(),         // Redis')
    log.push('      mongoose.disconnect(),// MongoDB')
    log.push('      worker.close(),       // BullMQ worker')
    log.push('    ])')
    log.push("    console.log('[SHUTDOWN] All connections closed')")
    log.push('')
    log.push('    clearTimeout(forceTimeout)')
    log.push('    process.exit(0)')
    log.push('  } catch (err) {')
    log.push("    console.error('[SHUTDOWN] Error during cleanup:', err)")
    log.push('    process.exit(1)')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push("process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))")
    log.push("process.on('SIGINT', () => gracefulShutdown('SIGINT'))")
    log.push('')
    log.push('// Handle uncaught errors')
    log.push("process.on('unhandledRejection', (reason) => {")
    log.push("  console.error('[FATAL] Unhandled rejection:', reason)")
    log.push("  gracefulShutdown('unhandledRejection')")
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[SERVER] Listening on port 3000')
    log.push('[REQUEST] GET /api/users (in progress)')
    log.push('[SIGNAL] SIGTERM received')
    log.push('[SHUTDOWN] Received SIGTERM')
    log.push('[SHUTDOWN] isShuttingDown = true')
    log.push('[HEALTH] GET /health => 503 { status: "shutting_down" }')
    log.push('[REQUEST] GET /api/users => 200 (completed in-flight request)')
    log.push('[REQUEST] NEW GET /api/data => 503 "Server is shutting down"')
    log.push('[SHUTDOWN] HTTP server closed (no more connections)')
    log.push('[SHUTDOWN] PostgreSQL pool closed')
    log.push('[SHUTDOWN] Redis connection closed')
    log.push('[SHUTDOWN] MongoDB disconnected')
    log.push('[SHUTDOWN] BullMQ worker stopped')
    log.push('[SHUTDOWN] All connections closed')
    log.push('[EXIT] Process exited with code 0')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 14.3: Graceful Shutdown</h2>
      <button onClick={runExample}>Запустить</button>
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
// Task 14.4: GraphQL Basics — Solution
// ============================================

export function Task14_4_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateSchemaResolvers = () => {
    const log: string[] = []
    log.push('// === Apollo Server: Schema & Resolvers ===')
    log.push("import { ApolloServer } from '@apollo/server'")
    log.push("import { expressMiddleware } from '@apollo/server/express4'")
    log.push('')
    log.push('// Type definitions (schema)')
    log.push('const typeDefs = `#graphql')
    log.push('  type User {')
    log.push('    id: ID!')
    log.push('    name: String!')
    log.push('    email: String!')
    log.push('    posts: [Post!]!')
    log.push('  }')
    log.push('')
    log.push('  type Post {')
    log.push('    id: ID!')
    log.push('    title: String!')
    log.push('    body: String!')
    log.push('    author: User!')
    log.push('    createdAt: String!')
    log.push('  }')
    log.push('')
    log.push('  type Query {')
    log.push('    users: [User!]!')
    log.push('    user(id: ID!): User')
    log.push('    posts(limit: Int, offset: Int): [Post!]!')
    log.push('  }')
    log.push('')
    log.push('  type Mutation {')
    log.push('    createUser(name: String!, email: String!): User!')
    log.push('    createPost(title: String!, body: String!, authorId: ID!): Post!')
    log.push('    deletePost(id: ID!): Boolean!')
    log.push('  }')
    log.push('`')
    log.push('')
    log.push('// Resolvers')
    log.push('const resolvers = {')
    log.push('  Query: {')
    log.push('    users: async (_, __, { db }) => {')
    log.push('      return db.users.findMany()')
    log.push('    },')
    log.push('    user: async (_, { id }, { db }) => {')
    log.push('      return db.users.findUnique({ where: { id } })')
    log.push('    },')
    log.push('    posts: async (_, { limit = 10, offset = 0 }, { db }) => {')
    log.push('      return db.posts.findMany({ take: limit, skip: offset })')
    log.push('    }')
    log.push('  },')
    log.push('  Mutation: {')
    log.push('    createUser: async (_, { name, email }, { db }) => {')
    log.push('      return db.users.create({ data: { name, email } })')
    log.push('    }')
    log.push('  },')
    log.push('  // Field resolver (N+1 prevention)')
    log.push('  User: {')
    log.push('    posts: async (parent, _, { loaders }) => {')
    log.push('      return loaders.postsByUser.load(parent.id)')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Server setup')
    log.push('const server = new ApolloServer({ typeDefs, resolvers })')
    log.push('await server.start()')
    log.push("app.use('/graphql', expressMiddleware(server, {")
    log.push('  context: async ({ req }) => ({')
    log.push('    db: prisma,')
    log.push('    user: await getUser(req.headers.authorization),')
    log.push('    loaders: createLoaders()')
    log.push('  })')
    log.push('}))')
    log.push('')
    log.push('[APOLLO] Server started at http://localhost:3000/graphql')
    setResults(log)
    setActiveDemo('schema')
  }

  const simulateQueries = () => {
    const log: string[] = []
    log.push('// === GraphQL Queries & Mutations ===')
    log.push('')
    log.push('// Query: get user with posts')
    log.push('query {')
    log.push('  user(id: "1") {')
    log.push('    name')
    log.push('    email')
    log.push('    posts {')
    log.push('      title')
    log.push('      createdAt')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Response:')
    log.push('{')
    log.push('  "data": {')
    log.push('    "user": {')
    log.push('      "name": "Alice",')
    log.push('      "email": "alice@example.com",')
    log.push('      "posts": [')
    log.push('        { "title": "GraphQL Guide", "createdAt": "2026-03-28" },')
    log.push('        { "title": "Node.js Tips", "createdAt": "2026-03-25" }')
    log.push('      ]')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Mutation: create post')
    log.push('mutation {')
    log.push('  createPost(')
    log.push('    title: "New Post"')
    log.push('    body: "Post content"')
    log.push('    authorId: "1"')
    log.push('  ) {')
    log.push('    id')
    log.push('    title')
    log.push('    author { name }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Response:')
    log.push('{')
    log.push('  "data": {')
    log.push('    "createPost": {')
    log.push('      "id": "10",')
    log.push('      "title": "New Post",')
    log.push('      "author": { "name": "Alice" }')
    log.push('    }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Subscription (PubSub)')
    log.push("import { PubSub } from 'graphql-subscriptions'")
    log.push('const pubsub = new PubSub()')
    log.push('')
    log.push('// In schema:')
    log.push('// type Subscription {')
    log.push('//   postCreated: Post!')
    log.push('// }')
    log.push('')
    log.push('// Resolver:')
    log.push('// Subscription: {')
    log.push('//   postCreated: {')
    log.push("//     subscribe: () => pubsub.asyncIterator(['POST_CREATED'])")
    log.push('//   }')
    log.push('// }')
    log.push('')
    log.push('// In mutation:')
    log.push("// pubsub.publish('POST_CREATED', { postCreated: newPost })")
    log.push('')
    log.push('[SUBSCRIPTION] Client subscribed to postCreated')
    log.push('[MUTATION] New post created')
    log.push('[SUBSCRIPTION] => { postCreated: { id: "10", title: "New Post" } }')
    setResults(log)
    setActiveDemo('queries')
  }

  const buttons = [
    { id: 'schema', label: 'Schema & Resolvers', handler: simulateSchemaResolvers },
    { id: 'queries', label: 'Queries & Mutations', handler: simulateQueries },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 14.4: GraphQL (Apollo Server)</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#6a1b9a' : '#f3e5f5',
              color: activeDemo === b.id ? 'white' : '#6a1b9a',
              border: '1px solid #6a1b9a',
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
