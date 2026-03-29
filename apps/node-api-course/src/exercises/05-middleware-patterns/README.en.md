# 🔥 Level 5: Middleware Patterns

## 🎯 Middleware as API Building Blocks

Middleware are reusable modules, each responsible for one task. Proper middleware makes APIs reliable, secure, and observable.

## 🔥 Logging Middleware

Log every request: method, URL, status, response time, correlation ID, user ID.

```typescript
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint()
  const requestId = req.headers['x-request-id'] || uuid()
  res.on('finish', () => {
    logger.info({ requestId, method: req.method, url: req.url, status: res.statusCode })
  })
  next()
}
```

## 🔥 CORS

```typescript
cors({ origin: ['https://app.example.com'], credentials: true, maxAge: 86400 })
```

## 🔥 Rate Limiting

Algorithms: Fixed Window, Sliding Window, Token Bucket.

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 42
Retry-After: 30  (on 429)
```

## 🔥 Compression & Caching

- Gzip: 45KB JSON -> 8.5KB (-81%)
- ETag + If-None-Match -> 304 Not Modified
- Cache-Control: private/public/no-store/immutable

## ⚠️ Common Beginner Mistakes

- console.log instead of structured logging
- CORS origin: '*' with credentials
- In-memory rate limiter in cluster mode
- Compressing already compressed formats (PNG, JPEG)

## 💡 Best Practices

1. JSON logging with pino/winston
2. Correlation ID in every request
3. Redis store for rate limiting in production
4. ETag for GET requests with stable data
5. Proper Cache-Control directives per resource type
