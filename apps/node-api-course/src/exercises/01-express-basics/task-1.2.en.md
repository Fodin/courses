# Task 1.2: Middleware Chain

## 🎯 Goal

Understand the Express middleware mechanism: the `next()` function, execution order, scoping, and practical patterns.

## Requirements

1. Explain the middleware signature: `(req, res, next) => { ... next() ... }`
2. Demonstrate a middleware chain with timing measurements at each step
3. Show the correct order: parsing -> CORS -> logging -> authentication -> routes -> errors
4. Show different scopes: global, route group, specific route

## Checklist

- [ ] Middleware has the `(req, res, next)` signature and calls `next()` to pass control
- [ ] Middleware chain executes sequentially with timing measurements
- [ ] Correct order shown: parsers first, error handler last
- [ ] Three scope levels demonstrated: `app.use()`, `app.use('/api', ...)`, `app.get('/path', mw, handler)`

## How to Verify

Click "Run" and trace the middleware execution order for a GET /api/users request. Each step should show the name, action, and execution time.
