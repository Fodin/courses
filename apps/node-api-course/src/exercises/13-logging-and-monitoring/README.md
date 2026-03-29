# 🔥 Уровень 13: Логирование и мониторинг

## 🎯 Три компонента

1. **Pino** -- быстрое структурированное логирование (JSON), child loggers, serializers
2. **Winston** -- гибкое логирование с transports, ротацией файлов, correlation IDs
3. **Health & Docs** -- health checks (liveness/readiness), OpenAPI/Swagger

## 🔥 Зачем структурированное логирование

```typescript
// ❌ Неструктурированный лог
console.log('User 42 logged in from 192.168.1.1')
// Невозможно парсить, фильтровать, агрегировать

// ✅ Структурированный лог (JSON)
logger.info({ userId: 42, ip: '192.168.1.1' }, 'User logged in')
// {"level":"info","userId":42,"ip":"192.168.1.1","msg":"User logged in","time":"..."}
// Легко парсить, фильтровать в ELK/Loki, строить дашборды
```

## 🔥 Уровни логирования

```
trace(10) < debug(20) < info(30) < warn(40) < error(50) < fatal(60)
```

| Уровень | Когда использовать |
|---|---|
| trace | Детальная отладка (SQL-запросы) |
| debug | Отладочная информация (dev only) |
| info | Обычные события (запуск, запросы) |
| warn | Потенциальные проблемы (deprecated API) |
| error | Ошибки, которые нужно исправить |
| fatal | Критические ошибки, процесс завершается |

📌 **Production:** уровень `info` и выше. **Development:** уровень `debug` и выше.

## 🔥 Pino

### Базовая настройка

```typescript
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level(label) { return { level: label } }
  },
  redact: ['req.headers.authorization', 'req.body.password']
})

logger.info('Server started')
// {"level":"info","time":"2026-03-28T12:00:00.000Z","msg":"Server started"}

logger.info({ port: 3000 }, 'Server listening')
// {"level":"info","port":3000,"msg":"Server listening"}

logger.error({ err: new Error('DB failed') }, 'Fatal error')
// {"level":"error","err":{"type":"Error","message":"DB failed","stack":"..."},"msg":"Fatal error"}
```

### Redaction (скрытие чувствительных данных)

```typescript
const logger = pino({
  redact: ['req.headers.authorization', 'req.body.password', 'req.body.creditCard']
})

logger.info({ req: { headers: { authorization: 'Bearer secret' } } }, 'Request')
// authorization: "[Redacted]"
```

### Child Loggers

```typescript
// Child logger наследует контекст родителя
const reqLogger = logger.child({
  requestId: 'req-abc123',
  userId: 42
})

reqLogger.info('Processing payment')
// {"level":"info","requestId":"req-abc123","userId":42,"msg":"Processing payment"}

// Express middleware для request ID
app.use((req, res, next) => {
  req.id = req.headers['x-request-id'] as string || randomUUID()
  req.log = logger.child({ requestId: req.id })
  next()
})
```

### Custom Serializers

```typescript
const logger = pino({
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress
      }
    },
    res(res) {
      return { statusCode: res.statusCode }
    },
    err: pino.stdSerializers.err
  }
})
```

### pino-http (автоматический request logging)

```typescript
import pinoHttp from 'pino-http'

app.use(pinoHttp({ logger }))
// Автоматически логирует каждый запрос с responseTime
```

## 🔥 Winston

### Transports и ротация

```typescript
import winston from 'winston'
import 'winston-daily-rotate-file'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Console (development)
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // File: all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    }),
    // File: errors only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    // Daily rotate
    new winston.transports.DailyRotateFile({
      filename: 'logs/app-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      zippedArchive: true
    })
  ]
})
```

### Correlation IDs через AsyncLocalStorage

```typescript
import { AsyncLocalStorage } from 'async_hooks'

const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>()

// Middleware: создать контекст
app.use((req, res, next) => {
  const requestId = req.headers['x-request-id'] as string || randomUUID()
  asyncLocalStorage.run({ requestId }, () => next())
})

// Custom format: добавить requestId
const correlationFormat = winston.format((info) => {
  const store = asyncLocalStorage.getStore()
  if (store?.requestId) {
    info.requestId = store.requestId
  }
  return info
})
```

## 🔥 Health Checks

### Liveness vs Readiness

| Тип | Вопрос | Когда 503 | Действие K8s |
|---|---|---|---|
| Liveness | "Процесс жив?" | crash/deadlock | Restart pod |
| Readiness | "Может принимать трафик?" | DB down, cold start | Убрать из LB |

### Реализация

```typescript
// Liveness: простая проверка
app.get('/health/live', (req, res) => {
  res.json({ status: 'ok' })
})

// Readiness: проверка зависимостей
app.get('/health/ready', async (req, res) => {
  const checks = {
    database: await checkDatabase(),
    redis: await checkRedis(),
    diskSpace: checkDiskSpace()
  }

  const allHealthy = Object.values(checks).every(c => c.status === 'up')
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'ready' : 'degraded',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks
  })
})

async function checkDatabase(): Promise<HealthCheck> {
  try {
    const start = Date.now()
    await pool.query('SELECT 1')
    return { status: 'up', responseTime: Date.now() - start }
  } catch (err) {
    return { status: 'down', error: err.message }
  }
}
```

## 🔥 OpenAPI / Swagger

```typescript
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
      }
    }
  },
  apis: ['./src/routes/*.ts']
})

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

/**
 * @openapi
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: console.log в production

```typescript
// ❌ Неструктурированный, без уровней, без контекста
console.log('Error:', err.message)

// ✅ Структурированный логгер
logger.error({ err, requestId: req.id }, 'Database query failed')
```

### Ошибка 2: Логирование чувствительных данных

```typescript
// ❌ Пароль и токен в логах
logger.info({ body: req.body }, 'Request received')
// {"body":{"email":"alice@test.com","password":"secret123"}}

// ✅ Redaction
const logger = pino({ redact: ['req.body.password', 'req.headers.authorization'] })
```

### Ошибка 3: Health check без проверки зависимостей

```typescript
// ❌ Процесс жив, но БД недоступна -- трафик идёт в мёртвый сервис
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// ✅ Readiness проверяет все зависимости
app.get('/health/ready', async (req, res) => {
  const dbOk = await checkDatabase()
  res.status(dbOk ? 200 : 503).json({ database: dbOk })
})
```

### Ошибка 4: Нет correlation ID

```typescript
// ❌ Невозможно связать логи одного запроса
logger.info('User found')
logger.info('Order created')
// Какой запрос? Какой пользователь?

// ✅ Request ID в каждом логе
reqLogger.info({ userId: 42 }, 'User found')
reqLogger.info({ orderId: 'ORD-001' }, 'Order created')
// Все логи одного запроса связаны через requestId
```

## 💡 Best Practices

1. **JSON-логи** в production (Pino/Winston), pretty-print только в dev
2. **Redaction** -- никогда не логируйте пароли, токены, номера карт
3. **Correlation ID** -- связывайте все логи одного запроса
4. **Уровни** -- info+ в production, debug+ в development
5. **Health checks** -- liveness (процесс жив) + readiness (зависимости ОК)
6. **Ротация** -- DailyRotateFile с архивированием и удалением старых
7. **OpenAPI** -- документируйте все endpoints через JSDoc аннотации
