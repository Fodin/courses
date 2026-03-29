# 🔥 Уровень 12: Безопасность API

## 🎯 Три направления

1. **Helmet & Headers** -- защита через HTTP-заголовки (CSP, HSTS, X-Frame-Options)
2. **Input Sanitization** -- защита от инъекций (SQL, NoSQL, XSS)
3. **CSRF & Advanced** -- защита от CSRF, parameter pollution, ReDoS

## 🔥 OWASP Top 10 для API

| # | Уязвимость | Защита |
|---|---|---|
| 1 | Broken Authentication | JWT + refresh tokens, rate limiting |
| 2 | Broken Authorization | RBAC, проверка ownership |
| 3 | Injection | Параметризованные запросы, валидация |
| 4 | Security Misconfiguration | Helmet, отключить debug в prod |
| 5 | SSRF | Whitelist URL, валидация input |
| 6 | Mass Assignment | DTO, whitelist полей |
| 7 | Security Headers | CSP, HSTS, X-Frame-Options |
| 8 | XSS | Экранирование, CSP, DOMPurify |
| 9 | CSRF | CSRF-токены, SameSite cookies |
| 10 | Insufficient Logging | Structured logging, audit trail |

## 🔥 Helmet: Security Headers

### Базовая настройка

```typescript
import helmet from 'helmet'

// Устанавливает 11 security headers
app.use(helmet())
```

### Кастомная конфигурация

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", 'cdn.example.com'],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', '*.cloudinary.com'],
      connectSrc: ["'self'", 'api.example.com'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,      // 1 год
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}))
```

### Что делает каждый заголовок

| Заголовок | Защита |
|---|---|
| Content-Security-Policy | Контролирует источники скриптов, стилей, изображений |
| Strict-Transport-Security | Принудительный HTTPS |
| X-Content-Type-Options: nosniff | Запрет MIME-sniffing |
| X-Frame-Options: SAMEORIGIN | Защита от clickjacking |
| X-DNS-Prefetch-Control: off | Запрет DNS-prefetch |
| Referrer-Policy | Контроль заголовка Referer |

### CSP Report-Only (тестирование)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    reportOnly: true,  // Логирует нарушения, не блокирует
    directives: {
      defaultSrc: ["'self'"],
      reportUri: '/csp-report'
    }
  }
}))

app.post('/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  console.log('[CSP VIOLATION]', req.body)
  res.sendStatus(204)
})
```

## 🔥 Injection Prevention

### SQL Injection

```typescript
// ❌ Конкатенация строк
const bad = `SELECT * FROM users WHERE email = '${req.body.email}'`
// Input: ' OR '1'='1  →  SELECT * FROM users WHERE email = '' OR '1'='1'

// ✅ Параметризованные запросы
const [rows] = await pool.query(
  'SELECT * FROM users WHERE email = $1', [req.body.email]
)
```

### NoSQL Injection

```typescript
// ❌ Прямая передача body в MongoDB
const user = await db.collection('users').findOne({ email: req.body.email })
// Input: { "email": { "$gt": "" } }  →  findOne({ email: { $gt: "" } })

// ✅ Валидация + express-mongo-sanitize
import mongoSanitize from 'express-mongo-sanitize'
app.use(mongoSanitize())  // Удаляет $ и . из req.body/query/params

// Или валидация через Zod
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})
```

### XSS Prevention

```typescript
import xss from 'xss'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Экранирование HTML-тегов
const clean = xss(req.body.name)
// '<script>alert(1)</script>'  →  '&lt;script&gt;alert(1)&lt;/script&gt;'

// Очистка HTML-контента (для rich text)
const window = new JSDOM('').window
const purify = DOMPurify(window)
const cleanHtml = purify.sanitize(req.body.content)
// '<p>Hello <script>evil()</script></p>'  →  '<p>Hello </p>'

// Валидация + санитизация в схеме
const commentSchema = z.object({
  text: z.string().min(1).max(1000).transform(val => xss(val))
})
```

## 🔥 CSRF Protection

### Как работает CSRF

1. Пользователь залогинен на bank.com (cookie с сессией)
2. Пользователь посещает evil.com
3. evil.com отправляет POST на bank.com/transfer (cookie отправляется автоматически!)
4. bank.com выполняет перевод, т.к. cookie валидна

### Защита

```typescript
import csrf from 'csurf'
import cookieParser from 'cookie-parser'

app.use(cookieParser())
const csrfProtection = csrf({ cookie: true })

// Получить токен
app.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

// Защищённый маршрут
app.post('/api/transfer', csrfProtection, (req, res) => {
  // Только с валидным CSRF-токеном
  processTransfer(req.body)
})
```

### SameSite Cookies (современный подход)

```typescript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',  // Не отправляется с cross-origin запросов
  maxAge: 3600000
})
```

## 🔥 HTTP Parameter Pollution

```typescript
import hpp from 'hpp'

app.use(hpp({
  whitelist: ['sort', 'fields', 'filter']
}))

// Атака: /api/users?role=user&role=admin
// Без hpp: req.query.role → ['user', 'admin']
// С hpp: req.query.role → 'admin' (последнее значение)
```

## 🔥 ReDoS Prevention

```typescript
import { RE2 } from 're2'

// ❌ Катастрофический backtracking
const bad = /^(a+)+$/  // ReDoS!
// 'aaaaaaaaaaaaaaaaab' → зависает на секунды

// ✅ RE2 -- линейное время
const safe = new RE2('^[a-z]+$')
safe.test('aaaaaaaaaaaaaaaaab')  // мгновенно, false
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Отключают Helmet для удобства

```typescript
// ❌ "CSP мешает загрузке скриптов"
app.use(helmet({ contentSecurityPolicy: false }))

// ✅ Настройте CSP правильно
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      scriptSrc: ["'self'", 'trusted-cdn.com']
    }
  }
}))
```

### Ошибка 2: Валидация только на клиенте

```typescript
// ❌ Клиентская валидация легко обходится
// Postman/curl отправят что угодно

// ✅ Всегда валидируйте на сервере
const schema = z.object({
  email: z.string().email(),
  amount: z.number().positive().max(10000)
})
```

### Ошибка 3: Хранение секретов в коде

```typescript
// ❌ Секрет в исходном коде
const JWT_SECRET = 'my-super-secret-key'

// ✅ Environment variables
const JWT_SECRET = process.env.JWT_SECRET!
// + .env в .gitignore
```

### Ошибка 4: Verbose error messages в production

```typescript
// ❌ Stack trace утекает клиенту
res.status(500).json({ error: err.message, stack: err.stack })

// ✅ Разные ответы для dev и prod
if (process.env.NODE_ENV === 'production') {
  res.status(500).json({ error: 'Internal server error' })
} else {
  res.status(500).json({ error: err.message, stack: err.stack })
}
```

## 💡 Best Practices

1. **Helmet** -- всегда включен, CSP настроен под проект
2. **Параметризованные запросы** -- никогда не конкатенируйте SQL/NoSQL
3. **Zod/Joi** -- валидация всех входных данных на сервере
4. **CSRF** -- токены для form-based API, SameSite для cookie-based
5. **Rate limiting** -- express-rate-limit на все endpoints
6. **Secrets** -- только в environment variables, не в коде
7. **Error messages** -- generic в production, verbose только в dev
8. **npm audit** -- регулярная проверка зависимостей
