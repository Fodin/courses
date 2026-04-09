# Request and Response Body

## JSON as the Standard for REST APIs

JSON is the de facto standard for modern REST APIs. The `Content-Type: application/json` header is required when sending a request body. In responses — too. Without it, the client does not know how to parse data.

```http
POST /api/products
Content-Type: application/json
Accept: application/json

{ "name": "Product", "price": 999 }
```

## Field Naming Conventions

**Choose one style and stick to it everywhere.**

| Style | Example | Where popular |
|-------|--------|---------------|
| **camelCase** | `userId`, `createdAt` | JavaScript, TypeScript |
| **snake_case** | `user_id`, `created_at` | Python, Ruby, Go |

For JS/TS clients — **camelCase**. The main thing — never mix within one API.

## Envelope vs Flat

**Envelope** — data wrapped in an object:
```json
{ "data": [...], "meta": { "total": 100 } }
```

**Flat** — data directly:
```json
[...]  // or { "id": 1, "name": "..." } for a single resource
```

Envelope is justified for collections with pagination. Flat — for single resources and simple responses.

## Partial Updates (PATCH)

PATCH sends only the changed fields. PUT replaces the entire resource.

```json
// PATCH /api/products/42
// Changing only the price, not touching other fields:
{ "price": 5990 }
```

The standard for PATCH — **JSON Merge Patch** (RFC 7396): `Content-Type: application/merge-patch+json`.
