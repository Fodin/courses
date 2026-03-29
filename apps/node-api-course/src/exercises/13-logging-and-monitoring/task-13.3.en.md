# Task 13.3: Health Checks & OpenAPI

## 🎯 Goal

Master health checks for Kubernetes (liveness/readiness) and API documentation with OpenAPI/Swagger.

## Requirements

1. Create liveness endpoint (`/health/live`) -- simple "process alive" response
2. Create readiness endpoint (`/health/ready`) -- check all dependencies (DB, Redis, disk)
3. Implement dependency check functions with responseTime and status (up/down)
4. Configure swagger-jsdoc + swagger-ui-express for auto-documentation
5. Show @openapi JSDoc annotations for endpoint descriptions

## Checklist

- [ ] Liveness always returns 200 (while process is alive)
- [ ] Readiness returns 503 if any dependency is unavailable
- [ ] Each dependency checked with responseTime
- [ ] Swagger UI available at /docs
- [ ] Endpoints described via @openapi JSDoc annotations

## How to Verify

Click "Run" and verify that: liveness responds 200, readiness checks dependencies and returns 503 on issues, Swagger generates documentation.
