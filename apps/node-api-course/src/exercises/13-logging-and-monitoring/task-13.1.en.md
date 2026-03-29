# Task 13.1: Pino

## 🎯 Goal

Master Pino: structured JSON logging, log levels, child loggers with context, custom serializers, and sensitive data redaction.

## Requirements

1. Configure Pino: level, timestamp (isoTime), formatters, redact for passwords and tokens
2. Show all log levels: trace, debug, info, warn, error, fatal
3. Create child loggers with requestId and userId for request tracking
4. Implement Express middleware for automatic requestId assignment
5. Configure custom serializers for req and res objects

## Checklist

- [ ] Pino configured with JSON format and redaction
- [ ] Log levels demonstrated with correct usage
- [ ] Child loggers inherit parent context
- [ ] Middleware assigns requestId to each request
- [ ] Serializers format req/res into compact view

## How to Verify

Click "Run" and verify that: logs are in JSON format, redaction hides passwords, child loggers add context, serializers format objects.
