# Task 0.2: Manual Routing

## 🎯 Goal

Implement HTTP request routing manually using URL parsing, method-based routing, and query parameter handling.

## Requirements

1. Parse URLs using `new URL()` -- extract `pathname` and `searchParams`
2. Split the path into segments and extract route parameters (e.g., `/api/users/42` -> resource: `users`, id: `42`)
3. Create a route table mapping method + pattern -> handler
4. Implement routing: match incoming requests against the route table
5. Handle query parameters (`page`, `limit`, `sort`) from the URL

## Checklist

- [ ] URL parsed via `new URL(url, base)`
- [ ] Path segments extracted via `pathname.split('/').filter(Boolean)`
- [ ] Route table contains GET, POST, PUT, DELETE for `/api/users`
- [ ] Request correctly matched to route by method and path
- [ ] Returns 404 for unknown routes and 405 for unsupported methods
- [ ] Query parameters extracted via `searchParams.get()`

## How to Verify

Click "Run" and verify that different requests (GET /api/users, GET /api/users/42, POST /api/users, GET /api/posts) are handled with correct status codes and handler calls.
