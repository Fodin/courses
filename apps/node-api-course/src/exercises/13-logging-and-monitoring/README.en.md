# 🔥 Level 13: Logging and Monitoring

## 🎯 Three Components

1. **Pino** -- fast structured logging (JSON), child loggers, serializers
2. **Winston** -- flexible logging with transports, file rotation, correlation IDs
3. **Health & Docs** -- health checks (liveness/readiness), OpenAPI/Swagger

## 🔥 Pino

```typescript
const logger = pino({ level: 'info', redact: ['req.body.password'] })
const reqLogger = logger.child({ requestId: 'req-abc' })
```

## 🔥 Winston

Transports (Console, File, DailyRotateFile), correlation IDs via AsyncLocalStorage.

## 🔥 Health Checks

Liveness (process alive?) + Readiness (dependencies OK?). OpenAPI/Swagger for documentation.

## ⚠️ Common Beginner Mistakes

- console.log in production
- Logging sensitive data (passwords, tokens)
- Health check without dependency verification
- No correlation ID between logs

## 💡 Best Practices

1. JSON logs in production, pretty-print in dev
2. Redact sensitive data
3. Correlation IDs for all request logs
4. Liveness + readiness health checks
5. OpenAPI documentation for all endpoints
