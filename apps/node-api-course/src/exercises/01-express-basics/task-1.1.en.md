# Task 1.1: Routes & Router

## 🎯 Goal

Master Express routing: `app.get/post/put/delete` methods, modular `express.Router()`, route parameters, and query parameters.

## Requirements

1. Define routes for CRUD operations using `app.get()`, `app.post()`, `app.put()`, `app.patch()`, `app.delete()`
2. Demonstrate route parameters via `req.params` (e.g., `/api/users/:userId/posts/:postId`)
3. Demonstrate query parameters via `req.query` (e.g., `?page=2&limit=10`)
4. Create a modular router via `express.Router()` and mount it with `app.use('/api/users', router)`
5. Show how Router combines routes into a final route table

## Checklist

- [ ] Routes defined for all CRUD methods (GET, POST, PUT, PATCH, DELETE)
- [ ] `req.params` correctly extracts dynamic URL segments
- [ ] `req.query` correctly extracts query parameters
- [ ] Router extracted into a separate module and mounted via `app.use`
- [ ] Shown how Router adds a prefix to routes

## How to Verify

Click "Run" and verify that all test requests match the correct routes, parameters are extracted correctly, and Router shows the final paths.
