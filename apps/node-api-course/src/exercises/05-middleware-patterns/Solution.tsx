import { useState } from 'react'

// ============================================
// Задание 5.1: Logging Middleware — Решение
// ============================================

export function Task5_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Logging Middleware ===')
    log.push('')

    // Request logging
    log.push('--- Что логировать ---')
    log.push('')
    log.push('// Каждый запрос:')
    log.push('//   - method, url, status code, response time')
    log.push('//   - correlation ID (для трассировки)')
    log.push('//   - user ID (если аутентифицирован)')
    log.push('')

    // Simulate correlation ID
    const correlationId = 'req-' + Math.random().toString(36).substring(2, 10)

    log.push('--- Middleware реализация ---')
    log.push('')
    log.push('function requestLogger(req, res, next) {')
    log.push('  const start = process.hrtime.bigint()')
    log.push('  const requestId = req.headers["x-request-id"] || uuid()')
    log.push('  ')
    log.push('  // Добавляем ID ко всем последующим логам')
    log.push('  req.requestId = requestId')
    log.push('  res.setHeader("X-Request-Id", requestId)')
    log.push('  ')
    log.push('  // Логируем после отправки ответа')
    log.push('  res.on("finish", () => {')
    log.push('    const duration = Number(process.hrtime.bigint() - start) / 1e6')
    log.push('    logger.info({ requestId, method, url, status, duration })')
    log.push('  })')
    log.push('  next()')
    log.push('}')
    log.push('')

    // Simulate requests
    log.push('=== Симуляция логов ===')
    log.push('')

    const requests = [
      { method: 'GET', url: '/api/users', status: 200, duration: 45.2, userId: 5 },
      { method: 'POST', url: '/api/users', status: 201, duration: 120.8, userId: 5 },
      { method: 'GET', url: '/api/users/999', status: 404, duration: 12.1, userId: 5 },
      { method: 'POST', url: '/api/auth/login', status: 401, duration: 350.5, userId: null },
      { method: 'GET', url: '/api/admin/stats', status: 500, duration: 2100.0, userId: 1 },
    ]

    for (const req of requests) {
      const level = req.status >= 500 ? 'ERROR' : req.status >= 400 ? 'WARN' : 'INFO'
      const emoji = req.status >= 500 ? '[!]' : req.status >= 400 ? '[~]' : '[+]'

      log.push(`${emoji} ${level} ${req.method.padEnd(6)} ${req.url.padEnd(25)} ${req.status} ${req.duration.toFixed(1).padStart(8)}ms  requestId=${correlationId} ${req.userId ? `userId=${req.userId}` : ''}`)
    }
    log.push('')

    // Structured logging
    log.push('--- Структурированное логирование (JSON) ---')
    log.push('')
    log.push('// Используйте pino/winston для JSON-логов:')
    log.push(JSON.stringify({
      level: 'info',
      time: Date.now(),
      requestId: correlationId,
      method: 'GET',
      url: '/api/users',
      statusCode: 200,
      responseTime: 45.2,
      userId: 5,
      userAgent: 'Mozilla/5.0',
      ip: '192.168.1.1',
    }, null, 2))
    log.push('')
    log.push('// JSON-логи легко парсить в ELK/Grafana/Datadog')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Logging Middleware</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 5.2: CORS — Решение
// ============================================

export function Task5_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== CORS (Cross-Origin Resource Sharing) ===')
    log.push('')

    // What is CORS
    log.push('--- Как работает CORS ---')
    log.push('')
    log.push('Браузер блокирует запросы к другому origin (домен:порт:протокол)')
    log.push('frontend: https://app.example.com')
    log.push('api:      https://api.example.com  <- другой origin!')
    log.push('')

    // Simple request
    log.push('--- Простой запрос (Simple Request) ---')
    log.push('')
    log.push('>> GET /api/users HTTP/1.1')
    log.push('>> Origin: https://app.example.com')
    log.push('')
    log.push('<< HTTP/1.1 200 OK')
    log.push('<< Access-Control-Allow-Origin: https://app.example.com')
    log.push('<< Vary: Origin')
    log.push('')

    // Preflight request
    log.push('--- Preflight запрос (для небезопасных методов) ---')
    log.push('')
    log.push('// Браузер автоматически отправляет OPTIONS перед POST/PUT/DELETE')
    log.push('')
    log.push('>> OPTIONS /api/users HTTP/1.1')
    log.push('>> Origin: https://app.example.com')
    log.push('>> Access-Control-Request-Method: POST')
    log.push('>> Access-Control-Request-Headers: Content-Type, Authorization')
    log.push('')
    log.push('<< HTTP/1.1 204 No Content')
    log.push('<< Access-Control-Allow-Origin: https://app.example.com')
    log.push('<< Access-Control-Allow-Methods: GET, POST, PUT, DELETE')
    log.push('<< Access-Control-Allow-Headers: Content-Type, Authorization')
    log.push('<< Access-Control-Max-Age: 86400')
    log.push('')
    log.push('// Затем браузер отправляет реальный запрос:')
    log.push('>> POST /api/users HTTP/1.1')
    log.push('>> Origin: https://app.example.com')
    log.push('>> Content-Type: application/json')
    log.push('')

    // Credentials
    log.push('--- Credentials (cookies, auth headers) ---')
    log.push('')
    log.push('// Для отправки cookies нужны ОБА:')
    log.push('// Frontend: fetch(url, { credentials: "include" })')
    log.push('// Backend:  Access-Control-Allow-Credentials: true')
    log.push('// ВАЖНО: с credentials нельзя использовать Allow-Origin: *')
    log.push('')

    // Configuration
    log.push('--- Настройка cors middleware ---')
    log.push('')
    log.push('app.use(cors({')
    log.push('  origin: ["https://app.example.com", "https://admin.example.com"],')
    log.push('  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],')
    log.push('  allowedHeaders: ["Content-Type", "Authorization"],')
    log.push('  exposedHeaders: ["X-Total-Count", "X-Request-Id"],')
    log.push('  credentials: true,')
    log.push('  maxAge: 86400  // Кэш preflight на 24 часа')
    log.push('}))')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.2: CORS</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 5.3: Rate Limiting — Решение
// ============================================

export function Task5_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Rate Limiting ===')
    log.push('')

    // Fixed window
    log.push('--- 1. Fixed Window ---')
    log.push('')
    log.push('// 100 запросов в минуту на IP')
    log.push('// Окно: 12:00:00 — 12:01:00')
    log.push('')

    const fixedWindow = { limit: 100, window: '1 min', current: 0 }
    const requests = [1, 2, 50, 99, 100, 101]

    for (const num of requests) {
      fixedWindow.current = num
      const allowed = num <= fixedWindow.limit
      const remaining = Math.max(0, fixedWindow.limit - num)
      log.push(`  Request #${String(num).padStart(3)}: ${allowed ? 'ALLOWED' : 'BLOCKED (429)'}  remaining: ${remaining}`)
    }
    log.push('')

    // Sliding window
    log.push('--- 2. Sliding Window Log ---')
    log.push('')
    log.push('// Хранит timestamp каждого запроса')
    log.push('// Удаляет записи старше окна')
    log.push('// Точнее, но дороже по памяти')
    log.push('')
    log.push('  Timestamps: [12:00:01, 12:00:15, 12:00:30, 12:00:45]')
    log.push('  Сейчас:      12:01:10')
    log.push('  Окно:        12:00:10 — 12:01:10')
    log.push('  В окне:      3 запроса (12:00:01 удалён)')
    log.push('')

    // Token bucket
    log.push('--- 3. Token Bucket ---')
    log.push('')
    log.push('// bucket = { tokens: 10, maxTokens: 10, refillRate: 1/sec }')
    log.push('')

    let tokens = 10
    const events = [
      { time: '0s', action: 'burst 5 requests', cost: 5 },
      { time: '1s', action: 'refill +1', cost: -1 },
      { time: '1s', action: '3 requests', cost: 3 },
      { time: '2s', action: 'refill +1', cost: -1 },
      { time: '2s', action: '2 requests', cost: 2 },
      { time: '3s', action: 'refill +1', cost: -1 },
      { time: '3s', action: '3 requests — 1 blocked!', cost: 2 },
    ]

    for (const ev of events) {
      tokens = Math.min(10, Math.max(0, tokens - ev.cost))
      log.push(`  [${ev.time}] ${ev.action.padEnd(30)} tokens: ${tokens}`)
    }
    log.push('')

    // Response headers
    log.push('--- HTTP-заголовки rate limiting ---')
    log.push('')
    log.push('<< HTTP/1.1 200 OK')
    log.push('<< X-RateLimit-Limit: 100')
    log.push('<< X-RateLimit-Remaining: 42')
    log.push('<< X-RateLimit-Reset: 1710000060  (Unix timestamp)')
    log.push('')
    log.push('<< HTTP/1.1 429 Too Many Requests')
    log.push('<< Retry-After: 30')
    log.push(`<< ${JSON.stringify({ error: 'Rate limit exceeded', retryAfter: 30 })}`)

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Rate Limiting</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 5.4: Compression & Caching — Решение
// ============================================

export function Task5_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== Compression & HTTP Caching ===')
    log.push('')

    // Gzip compression
    log.push('--- Gzip/Brotli сжатие ---')
    log.push('')
    log.push('>> GET /api/users HTTP/1.1')
    log.push('>> Accept-Encoding: gzip, deflate, br')
    log.push('')
    log.push('<< HTTP/1.1 200 OK')
    log.push('<< Content-Encoding: gzip')
    log.push('<< Vary: Accept-Encoding')
    log.push('')

    const sizes = [
      { type: 'JSON (100 users)', original: 45000, gzip: 8500, brotli: 7200 },
      { type: 'HTML page', original: 120000, gzip: 25000, brotli: 21000 },
      { type: 'CSS bundle', original: 85000, gzip: 18000, brotli: 15000 },
    ]

    for (const s of sizes) {
      const gzipRatio = ((1 - s.gzip / s.original) * 100).toFixed(0)
      const brRatio = ((1 - s.brotli / s.original) * 100).toFixed(0)
      log.push(`  ${s.type}:`)
      log.push(`    Original: ${(s.original / 1024).toFixed(1)} KB`)
      log.push(`    Gzip:     ${(s.gzip / 1024).toFixed(1)} KB (-${gzipRatio}%)`)
      log.push(`    Brotli:   ${(s.brotli / 1024).toFixed(1)} KB (-${brRatio}%)`)
      log.push('')
    }

    // ETag
    log.push('--- ETag и Conditional Requests ---')
    log.push('')
    log.push('// Первый запрос:')
    log.push('>> GET /api/users/42')
    log.push('<< 200 OK')
    log.push('<< ETag: "abc123"')
    log.push('<< Body: { id: 42, name: "John" }')
    log.push('')
    log.push('// Повторный запрос с ETag:')
    log.push('>> GET /api/users/42')
    log.push('>> If-None-Match: "abc123"')
    log.push('<< 304 Not Modified  (тело НЕ отправляется!)')
    log.push('')

    // Cache-Control
    log.push('--- Cache-Control заголовки ---')
    log.push('')
    const cacheExamples = [
      { resource: '/api/users (приватные данные)', header: 'Cache-Control: private, no-cache', desc: 'Всегда валидировать с сервером' },
      { resource: '/api/config (публичные)', header: 'Cache-Control: public, max-age=3600', desc: 'Кэш на 1 час' },
      { resource: '/static/app.abc.js (с хешем)', header: 'Cache-Control: public, max-age=31536000, immutable', desc: 'Кэш навсегда' },
      { resource: '/api/auth/me', header: 'Cache-Control: no-store', desc: 'Не кэшировать вообще' },
    ]

    for (const ex of cacheExamples) {
      log.push(`  ${ex.resource}`)
      log.push(`    ${ex.header}`)
      log.push(`    // ${ex.desc}`)
      log.push('')
    }

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Compression & Caching</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
