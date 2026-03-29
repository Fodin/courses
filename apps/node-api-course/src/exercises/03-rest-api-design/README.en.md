# 🔥 Level 3: REST API Design

## 🎯 What is REST

REST (Representational State Transfer) is an architectural style for API design. Key principles: resources with unique URLs, HTTP methods for CRUD, stateless requests, uniform interface.

## 🔥 CRUD and HTTP Methods

```
POST   /api/users          201 Created
GET    /api/users          200 OK
GET    /api/users/:id      200 OK
PUT    /api/users/:id      200 OK
PATCH  /api/users/:id      200 OK
DELETE /api/users/:id      204 No Content
```

## 🔥 Pagination

Offset-based: `?page=3&per_page=20` -- simple but slow on large offsets.
Cursor-based: `?after=cursor&limit=20` -- stable and fast.

## 🔥 Sorting and Filtering

```
GET /api/users?sort=-createdAt,name&filter[status]=active&fields=id,name
```

## 🔥 API Versioning

1. URL: `/api/v1/users` (most popular)
2. Header: `X-API-Version: 2`
3. Content Negotiation: `Accept: application/vnd.myapi.v2+json`

## ⚠️ Common Beginner Mistakes

- Verbs in URLs: `/api/getUsers` -> `/api/users`
- Always returning 200: use proper status codes (201, 204, 404)
- Too deep nesting: max 2 levels
- Missing pagination metadata

## 💡 Best Practices

1. Use plural nouns for resources
2. Use cursor-based pagination for large datasets
3. Version API from day one
4. Document with OpenAPI/Swagger
