# Designing a Real API

## API Design Checklist Before Release

A good API is not just one successful endpoint. It's a system where every detail is consistent with the rest. Here are 10 questions to ask yourself before declaring the API ready.

### URLs and Resources

- [ ] All URLs use plural nouns (`/orders`, not `/getOrder`)
- [ ] URL hierarchy reflects resource relationships (`/users/{id}/orders`)
- [ ] Consistent style: lowercase + hyphens (`/reading-lists`)
- [ ] No duplicate URLs for the same resource

### HTTP Methods

- [ ] GET does not change state (safe)
- [ ] POST is used for creation and actions (not for updates)
- [ ] PUT/PATCH are used correctly (full / partial replacement)
- [ ] DELETE — deletion, second call also returns 2xx (idempotent)

### Status Codes

- [ ] No 200 OK for errors
- [ ] 201 Created with Location header after POST
- [ ] 204 No Content for DELETE and PATCH without body
- [ ] 4xx — client errors, 5xx — server errors

### Data

- [ ] Unified error format with `code`, `message`, `details`
- [ ] camelCase for all JSON fields
- [ ] Dates in ISO 8601 with UTC: `"2024-01-15T10:30:00Z"`
- [ ] Money: `{ "amount": 850.00, "currency": "RUB" }`, not strings

### Pagination and Filtering

- [ ] All list endpoints have pagination
- [ ] Reasonable default limit (20) and maximum (100)
- [ ] Filtering via query parameters
- [ ] `meta` in response: total, page, hasNext

## API Design Review Process

API review is not "checking for typos." It's a systematic check across several dimensions:

**1. Consistency** — all endpoints follow the same style. If you write `createdAt` in one place, you can't write `created_at` in another.

**2. Predictability** — a developer can guess the URL of a new endpoint knowing the pattern. `/users/{id}/orders` → `/users/{id}/reviews` — logical.

**3. Completeness** — all status codes are covered, all edge cases are documented.

**4. Security** — no internal data leaks in responses, auth is correctly placed.

## Course Summary

Over 13 levels you've completed the full path of an API designer:

| Level | Topic | Key Skill |
|-------|-------|-----------|
| 0 | What is an API | REST principles, HTTP as protocol |
| 1 | URL Design | Resources, hierarchy, naming |
| 2 | HTTP Methods | Semantics of GET/POST/PUT/PATCH/DELETE |
| 3 | Status Codes | 2xx/3xx/4xx/5xx — when to use what |
| 4 | Request/Response | Data formats, envelope, error format |
| 5 | Pagination | Offset vs cursor, meta, links |
| 6 | Versioning | URL/header/query strategies, deprecation |
| 7 | OpenAPI Basics | Specification, paths, parameters, schemas |
| 8 | OpenAPI Schemas | $ref, allOf/oneOf/anyOf, reuse |
| 9 | Code Generation | openapi-typescript, orval, automation |
| 10 | Documentation | DX, Swagger UI/Redoc, examples |
| 11 | Rate Limiting | Token Bucket, 429, Retry-After, backoff |
| 12 | Security | Authentication, authorization, encryption, logging |
| 13 | HATEOAS | Hypermedia links, resource state, Richardson L3 |
| 14 | Full Design | API Review, wizard, e-commerce reference |
