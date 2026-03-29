# Task 5.1: Logging Middleware

## 🎯 Goal

Implement request logging middleware: timing, correlation IDs, and structured JSON logs.

## Requirements

1. Implement middleware that measures processing time via `process.hrtime.bigint()`
2. Generate/extract correlation ID: `req.headers['x-request-id'] || uuid()`
3. Log after response is sent via `res.on('finish', ...)`
4. Show different log levels: INFO (2xx), WARN (4xx), ERROR (5xx)
5. Demonstrate structured JSON logging (for ELK/Grafana)

## Checklist

- [ ] Timing measured via `process.hrtime.bigint()` for nanosecond precision
- [ ] Correlation ID saved in `req.requestId` and added to `X-Request-Id` header
- [ ] Logging happens after `res.on('finish')`, when status code is known
- [ ] Log level depends on status code: 2xx=INFO, 4xx=WARN, 5xx=ERROR
- [ ] JSON log contains: level, time, requestId, method, url, statusCode, responseTime, userId

## How to Verify

Click "Run" and verify that: each request is logged with requestId and timing, log level matches the status code, and JSON format contains all necessary fields.
