import { useState } from 'react'

// ============================================
// Task 13.1: Pino — Solution
// ============================================

export function Task13_1_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateBasic = () => {
    const log: string[] = []
    log.push('// === Pino Structured Logging ===')
    log.push("import pino from 'pino'")
    log.push('')
    log.push('const logger = pino({')
    log.push("  level: process.env.LOG_LEVEL || 'info',")
    log.push('  timestamp: pino.stdTimeFunctions.isoTime,')
    log.push('  formatters: {')
    log.push('    level(label) { return { level: label } }')
    log.push('  },')
    log.push("  redact: ['req.headers.authorization', 'req.body.password']")
    log.push('})')
    log.push('')
    log.push('// Log levels: trace(10) < debug(20) < info(30) < warn(40) < error(50) < fatal(60)')
    log.push('')
    log.push('logger.info("Server started")')
    log.push('// => {"level":"info","time":"2026-03-28T12:00:00.000Z","msg":"Server started"}')
    log.push('')
    log.push('logger.info({ port: 3000, env: "production" }, "Server listening")')
    log.push('// => {"level":"info","time":"...","port":3000,"env":"production","msg":"Server listening"}')
    log.push('')
    log.push('logger.error({ err: new Error("DB connection failed") }, "Fatal startup error")')
    log.push('// => {"level":"error","time":"...","err":{"type":"Error","message":"DB connection failed","stack":"..."},"msg":"Fatal startup error"}')
    log.push('')
    log.push('// Redaction:')
    log.push('logger.info({ req: { headers: { authorization: "Bearer secret123" } } }, "Request")')
    log.push('// => {"req":{"headers":{"authorization":"[Redacted]"}},"msg":"Request"}')
    log.push('')
    log.push('// Pretty printing (dev only):')
    log.push("// node app.js | pino-pretty")
    log.push('[2026-03-28 12:00:00.000] INFO: Server started')
    log.push('[2026-03-28 12:00:00.001] INFO: Server listening')
    log.push('    port: 3000')
    log.push('    env: "production"')
    setResults(log)
    setActiveDemo('basic')
  }

  const simulateChildLoggers = () => {
    const log: string[] = []
    log.push('// === Child Loggers & Serializers ===')
    log.push('')
    log.push('// Child logger inherits parent config + adds context')
    log.push('const reqLogger = logger.child({')
    log.push('  requestId: "req-abc123",')
    log.push('  userId: 42')
    log.push('})')
    log.push('')
    log.push('reqLogger.info("Processing payment")')
    log.push('// => {"level":"info","requestId":"req-abc123","userId":42,"msg":"Processing payment"}')
    log.push('')
    log.push('reqLogger.info({ amount: 99.99 }, "Payment completed")')
    log.push('// => {"level":"info","requestId":"req-abc123","userId":42,"amount":99.99,"msg":"Payment completed"}')
    log.push('')
    log.push('// Express middleware with request ID')
    log.push("import { randomUUID } from 'crypto'")
    log.push('')
    log.push('app.use((req, res, next) => {')
    log.push("  req.id = req.headers['x-request-id'] as string || randomUUID()")
    log.push('  req.log = logger.child({ requestId: req.id })')
    log.push('  next()')
    log.push('})')
    log.push('')
    log.push('// Custom serializers')
    log.push('const logger = pino({')
    log.push('  serializers: {')
    log.push('    req(req) {')
    log.push('      return {')
    log.push('        method: req.method,')
    log.push('        url: req.url,')
    log.push("        remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress")
    log.push('      }')
    log.push('    },')
    log.push('    res(res) {')
    log.push('      return { statusCode: res.statusCode }')
    log.push('    },')
    log.push('    err: pino.stdSerializers.err')
    log.push('  }')
    log.push('})')
    log.push('')
    log.push('// pino-http middleware (automatic request logging)')
    log.push("import pinoHttp from 'pino-http'")
    log.push('app.use(pinoHttp({ logger }))')
    log.push('')
    log.push('// Simulation:')
    log.push('[REQ] {"level":"info","requestId":"req-001","req":{"method":"GET","url":"/api/users"},"msg":"request started"}')
    log.push('[RES] {"level":"info","requestId":"req-001","res":{"statusCode":200},"responseTime":45,"msg":"request completed"}')
    setResults(log)
    setActiveDemo('child')
  }

  const buttons = [
    { id: 'basic', label: 'Basic & Redaction', handler: simulateBasic },
    { id: 'child', label: 'Child Loggers', handler: simulateChildLoggers },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 13.1: Pino Structured Logging</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#1565c0' : '#e3f2fd',
              color: activeDemo === b.id ? 'white' : '#1565c0',
              border: '1px solid #1565c0',
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
// Task 13.2: Winston — Solution
// ============================================

export function Task13_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    log.push('// === Winston Logger ===')
    log.push("import winston from 'winston'")
    log.push("import 'winston-daily-rotate-file'")
    log.push('')
    log.push('const logger = winston.createLogger({')
    log.push("  level: 'info',")
    log.push('  format: winston.format.combine(')
    log.push('    winston.format.timestamp(),')
    log.push('    winston.format.errors({ stack: true }),')
    log.push('    winston.format.json()')
    log.push('  ),')
    log.push("  defaultMeta: { service: 'user-service' },")
    log.push('  transports: [')
    log.push('    // Console (development)')
    log.push('    new winston.transports.Console({')
    log.push('      format: winston.format.combine(')
    log.push('        winston.format.colorize(),')
    log.push('        winston.format.simple()')
    log.push('      )')
    log.push('    }),')
    log.push('')
    log.push('    // File: all logs')
    log.push('    new winston.transports.File({')
    log.push("      filename: 'logs/combined.log',")
    log.push('      maxsize: 10 * 1024 * 1024,  // 10MB')
    log.push('      maxFiles: 5')
    log.push('    }),')
    log.push('')
    log.push('    // File: errors only')
    log.push('    new winston.transports.File({')
    log.push("      filename: 'logs/error.log',")
    log.push("      level: 'error'")
    log.push('    }),')
    log.push('')
    log.push('    // Daily rotate')
    log.push('    new winston.transports.DailyRotateFile({')
    log.push("      filename: 'logs/app-%DATE%.log',")
    log.push("      datePattern: 'YYYY-MM-DD',")
    log.push("      maxSize: '20m',")
    log.push("      maxFiles: '14d',  // keep 14 days")
    log.push('      zippedArchive: true')
    log.push('    })')
    log.push('  ]')
    log.push('})')
    log.push('')
    log.push('// Custom format for request correlation')
    log.push('const correlationFormat = winston.format((info) => {')
    log.push('  const store = asyncLocalStorage.getStore()')
    log.push('  if (store?.requestId) {')
    log.push('    info.requestId = store.requestId')
    log.push('  }')
    log.push('  return info')
    log.push('})')
    log.push('')
    log.push('// Request correlation with AsyncLocalStorage')
    log.push("import { AsyncLocalStorage } from 'async_hooks'")
    log.push('const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>()')
    log.push('')
    log.push('app.use((req, res, next) => {')
    log.push("  const requestId = req.headers['x-request-id'] as string || randomUUID()")
    log.push('  asyncLocalStorage.run({ requestId }, () => next())')
    log.push('})')
    log.push('')
    log.push('// Simulation:')
    log.push('[INFO] {"service":"user-service","timestamp":"2026-03-28T12:00:00.000Z","requestId":"req-001","msg":"User login attempt"}')
    log.push('[INFO] {"service":"user-service","timestamp":"2026-03-28T12:00:00.050Z","requestId":"req-001","msg":"Login successful","userId":42}')
    log.push('[ERROR] {"service":"user-service","timestamp":"2026-03-28T12:00:01.000Z","requestId":"req-002","msg":"Database timeout","stack":"Error: ..."}')
    log.push('')
    log.push('// File rotation:')
    log.push('[ROTATE] logs/app-2026-03-27.log.gz (archived)')
    log.push('[ROTATE] logs/app-2026-03-28.log (current)')
    log.push('[ROTATE] logs/app-2026-03-14.log.gz (deleted, >14 days)')
    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 13.2: Winston</h2>
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
// Task 13.3: Health Checks & OpenAPI — Solution
// ============================================

export function Task13_3_Solution() {
  const [results, setResults] = useState<string[]>([])
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  const simulateHealth = () => {
    const log: string[] = []
    log.push('// === Health Check Endpoints ===')
    log.push('')
    log.push('// Liveness probe: "Is the process alive?"')
    log.push("app.get('/health/live', (req, res) => {")
    log.push('  res.json({ status: "ok" })')
    log.push('})')
    log.push('')
    log.push('// Readiness probe: "Can it serve traffic?"')
    log.push("app.get('/health/ready', async (req, res) => {")
    log.push('  const checks = {')
    log.push('    database: await checkDatabase(),')
    log.push('    redis: await checkRedis(),')
    log.push('    diskSpace: checkDiskSpace()')
    log.push('  }')
    log.push('')
    log.push('  const allHealthy = Object.values(checks).every(c => c.status === "up")')
    log.push('  res.status(allHealthy ? 200 : 503).json({')
    log.push('    status: allHealthy ? "ready" : "degraded",')
    log.push('    uptime: process.uptime(),')
    log.push('    timestamp: new Date().toISOString(),')
    log.push('    checks')
    log.push('  })')
    log.push('})')
    log.push('')
    log.push('async function checkDatabase(): Promise<HealthCheck> {')
    log.push('  try {')
    log.push('    const start = Date.now()')
    log.push("    await pool.query('SELECT 1')")
    log.push('    return { status: "up", responseTime: Date.now() - start }')
    log.push('  } catch (err) {')
    log.push('    return { status: "down", error: err.message }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// Kubernetes YAML:')
    log.push('// livenessProbe:')
    log.push('//   httpGet:')
    log.push('//     path: /health/live')
    log.push('//     port: 3000')
    log.push('//   periodSeconds: 10')
    log.push('// readinessProbe:')
    log.push('//   httpGet:')
    log.push('//     path: /health/ready')
    log.push('//     port: 3000')
    log.push('//   initialDelaySeconds: 5')
    log.push('')
    log.push('// Simulation:')
    log.push('[GET] /health/live => 200 { status: "ok" }')
    log.push('[GET] /health/ready => 200')
    log.push('{')
    log.push('  "status": "ready",')
    log.push('  "uptime": 86400,')
    log.push('  "checks": {')
    log.push('    "database": { "status": "up", "responseTime": 3 },')
    log.push('    "redis": { "status": "up", "responseTime": 1 },')
    log.push('    "diskSpace": { "status": "up", "free": "45GB" }')
    log.push('  }')
    log.push('}')
    log.push('')
    log.push('// When DB is down:')
    log.push('[GET] /health/ready => 503')
    log.push('{')
    log.push('  "status": "degraded",')
    log.push('  "checks": {')
    log.push('    "database": { "status": "down", "error": "Connection refused" },')
    log.push('    "redis": { "status": "up", "responseTime": 1 }')
    log.push('  }')
    log.push('}')
    setResults(log)
    setActiveDemo('health')
  }

  const simulateSwagger = () => {
    const log: string[] = []
    log.push('// === OpenAPI / Swagger ===')
    log.push("import swaggerJsdoc from 'swagger-jsdoc'")
    log.push("import swaggerUi from 'swagger-ui-express'")
    log.push('')
    log.push('const swaggerSpec = swaggerJsdoc({')
    log.push('  definition: {')
    log.push('    openapi: "3.0.0",')
    log.push('    info: {')
    log.push('      title: "My API",')
    log.push('      version: "1.0.0",')
    log.push('      description: "REST API documentation"')
    log.push('    },')
    log.push('    servers: [{ url: "/api/v1" }],')
    log.push('    components: {')
    log.push('      securitySchemes: {')
    log.push('        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }')
    log.push('      }')
    log.push('    }')
    log.push('  },')
    log.push('  apis: ["./src/routes/*.ts"]  // JSDoc comments in route files')
    log.push('})')
    log.push('')
    log.push("app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))")
    log.push('')
    log.push('// Route with JSDoc annotations:')
    log.push('/**')
    log.push(' * @openapi')
    log.push(' * /users:')
    log.push(' *   get:')
    log.push(' *     summary: Get all users')
    log.push(' *     tags: [Users]')
    log.push(' *     security:')
    log.push(' *       - bearerAuth: []')
    log.push(' *     parameters:')
    log.push(' *       - in: query')
    log.push(' *         name: page')
    log.push(' *         schema: { type: integer, default: 1 }')
    log.push(' *     responses:')
    log.push(' *       200:')
    log.push(' *         description: List of users')
    log.push(' *         content:')
    log.push(' *           application/json:')
    log.push(' *             schema:')
    log.push(' *               type: object')
    log.push(' *               properties:')
    log.push(' *                 data: { type: array, items: { $ref: "#/components/schemas/User" } }')
    log.push(' */')
    log.push('')
    log.push('// Simulation:')
    log.push('[SWAGGER] Documentation available at http://localhost:3000/docs')
    log.push('[SWAGGER] Endpoints documented: 12')
    log.push('[SWAGGER] Schemas defined: 5 (User, Post, Comment, Error, Pagination)')
    log.push('[SWAGGER] Security: Bearer JWT configured')
    setResults(log)
    setActiveDemo('swagger')
  }

  const buttons = [
    { id: 'health', label: 'Health Checks', handler: simulateHealth },
    { id: 'swagger', label: 'OpenAPI/Swagger', handler: simulateSwagger },
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 13.3: Health Checks & OpenAPI</h2>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={b.handler}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === b.id ? '#2e7d32' : '#e8f5e9',
              color: activeDemo === b.id ? 'white' : '#2e7d32',
              border: '1px solid #2e7d32',
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
