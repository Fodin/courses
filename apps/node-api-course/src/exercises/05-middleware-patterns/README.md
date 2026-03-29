# 🔥 Уровень 5: Паттерны Middleware

## 🎯 Middleware как строительные блоки API

Middleware -- это переиспользуемые модули, каждый из которых отвечает за одну задачу. Правильные middleware делают API надёжным, безопасным и наблюдаемым.

## 🔥 Logging Middleware

### Что логировать

Каждый запрос должен содержать:
- HTTP-метод и URL
- Статус ответа
- Время обработки
- Correlation ID (для трассировки)
- User ID (если аутентифицирован)

```typescript
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint()
  const requestId = req.headers['x-request-id'] || uuid()
  req.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e6
    logger.info({
      requestId, method: req.method, url: req.url,
      status: res.statusCode, duration,
      userId: req.user?.id
    })
  })
  next()
}
```

### Структурированное логирование

Используйте **pino** или **winston** для JSON-логов. JSON легко парсить в ELK/Grafana/Datadog.

```typescript
import pino from 'pino'
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })
```

## 🔥 CORS (Cross-Origin Resource Sharing)

Браузер блокирует запросы к другому origin. CORS -- механизм разрешения таких запросов.

### Preflight запросы

Для "небезопасных" методов (POST, PUT, DELETE) браузер автоматически отправляет OPTIONS перед реальным запросом.

```typescript
app.use(cors({
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,    // Для cookies
  maxAge: 86400         // Кэш preflight на 24 часа
}))
```

📌 **Важно:** с `credentials: true` нельзя использовать `origin: '*'`. Нужно указать конкретные домены.

## 🔥 Rate Limiting

Защита API от перегрузки и DDoS.

### Алгоритмы

**Fixed Window:** N запросов в минуту. Просто, но позволяет burst на границе окон.

**Sliding Window:** хранит timestamp каждого запроса. Точнее, но дороже по памяти.

**Token Bucket:** токены добавляются с постоянной скоростью. Позволяет burst, но ограничивает среднюю скорость.

### HTTP-заголовки

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
X-RateLimit-Reset: 1710000060
Retry-After: 30  (при 429)
```

```typescript
import rateLimit from 'express-rate-limit'

app.use(rateLimit({
  windowMs: 60 * 1000,  // 1 минута
  max: 100,              // 100 запросов
  standardHeaders: true, // RateLimit-* заголовки
  legacyHeaders: false,
  keyGenerator: (req) => req.ip || req.headers['x-forwarded-for'],
}))
```

## 🔥 Compression и Caching

### Сжатие ответов

```typescript
import compression from 'compression'
app.use(compression({ threshold: 1024 }))  // Сжимать ответы > 1 KB
```

JSON API ответ 45 KB -> gzip 8.5 KB (-81%).

### ETag и Conditional Requests

```
// Первый запрос:
GET /api/users/42
<< ETag: "abc123"

// Повторный запрос:
GET /api/users/42
>> If-None-Match: "abc123"
<< 304 Not Modified (тело НЕ отправляется!)
```

### Cache-Control

```
Cache-Control: private, no-cache        // Приватные данные: всегда валидировать
Cache-Control: public, max-age=3600     // Публичные: кэш 1 час
Cache-Control: public, immutable        // Статика с хешем: кэш навсегда
Cache-Control: no-store                 // Не кэшировать вообще
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: console.log вместо структурированных логов

```typescript
// ❌ Невозможно парсить в ELK
console.log(`${req.method} ${req.url} - ${Date.now()}`)

// ✅ JSON-логи
logger.info({ method: req.method, url: req.url, duration: 45 })
```

### Ошибка 2: CORS origin: '*' с credentials

```typescript
// ❌ Не работает!
cors({ origin: '*', credentials: true })

// ✅ Укажите конкретные домены
cors({ origin: ['https://app.example.com'], credentials: true })
```

### Ошибка 3: Rate limiter без Redis в кластере

```typescript
// ❌ В памяти -- каждый воркер имеет свой счётчик
rateLimit({ store: new MemoryStore() })

// ✅ Используйте Redis store
rateLimit({ store: new RedisStore({ client: redis }) })
```

### Ошибка 4: Сжатие уже сжатых форматов

```typescript
// ❌ PNG/JPEG/MP4 уже сжаты -- overhead без выгоды
compression()

// ✅ Фильтруйте по Content-Type
compression({
  filter: (req, res) => {
    const type = res.getHeader('Content-Type')
    return /json|text|javascript|css/.test(type)
  }
})
```

## 💡 Best Practices

1. **Логируйте в JSON** через pino/winston для observability
2. **Correlation ID** в каждом запросе для трассировки
3. **CORS**: минимум разрешённых origins, конкретные домены
4. **Rate limiting**: Redis store в production, разные лимиты для разных endpoint
5. **ETag**: используйте для GET-запросов с редко меняющимися данными
6. **Compression**: только для text/json/css/js, порог 1 KB
7. **Cache-Control**: правильные директивы для каждого типа ресурса
