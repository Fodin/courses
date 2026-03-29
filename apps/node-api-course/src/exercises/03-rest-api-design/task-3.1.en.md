# Task 3.1: CRUD Endpoints

## 🎯 Goal

Design RESTful CRUD endpoints with correct HTTP methods, status codes, and response format (Envelope Pattern).

## Requirements

1. Define HTTP methods to CRUD operations mapping: POST=Create, GET=Read, PUT/PATCH=Update, DELETE=Delete
2. Show correct status codes for each operation (201 Created, 200 OK, 204 No Content)
3. Implement Envelope Pattern for responses: `{ data, meta }` for collections, `{ data }` for single resources
4. Implement error format: `{ error: { code, message, details } }`
5. List main client errors (400, 401, 403, 404, 409, 422) with descriptions

## Checklist

- [ ] All CRUD operations mapped to HTTP methods and paths
- [ ] POST returns 201 + Location header, DELETE returns 204
- [ ] Collections wrapped in `{ data: [...], meta: { total, page, ... } }`
- [ ] Validation errors contain `details` with field information
- [ ] All major status codes (2xx, 4xx) listed with use-cases

## How to Verify

Click "Run" and verify that: CRUD -> HTTP table is shown correctly, response examples have correct structure, and errors have machine-readable codes.
