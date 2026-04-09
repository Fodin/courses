# Request and Response Body: Complete Guide

## Content-Type and Accept: Speaking the Same Language

Imagine you are ordering food at a restaurant. `Content-Type` is the language your order is written in (you write in Russian). `Accept` is the list of languages you are willing to receive the menu back in (I want Russian or English).

```http
POST /api/products
Content-Type: application/json   ← "My body is JSON"
Accept: application/json         ← "I want the response in JSON"
```

If the server cannot respond in the requested format — it returns `406 Not Acceptable`. If it cannot read the body — `415 Unsupported Media Type`.

For errors there is a separate Content-Type:
```http
Content-Type: application/problem+json  ← RFC 7807 errors
Content-Type: application/merge-patch+json  ← PATCH requests
```

---

## JSON Conventions: camelCase vs snake_case

### Pick One and Don't Change

```
camelCase: userId, createdAt, isActive, totalPages
snake_case: user_id, created_at, is_active, total_pages
```

Both options are correct — consistency is what matters. For JS/TS clients, **camelCase** is preferred: it is native to JavaScript objects and does not require transformation.

### ⚠️ Anti-pattern: Mixing Styles

```json
// ❌ Chaos
{
  "UserId": 42,
  "user_name": "ivan",
  "UserEmail": "ivan@example.com",
  "is_active": true,
  "createdAt": "2024-01-15"
}

// ✅ Unified camelCase
{
  "id": 42,
  "name": "ivan",
  "email": "ivan@example.com",
  "isActive": true,
  "createdAt": "2024-01-15T00:00:00Z"
}
```

💡 If the backend uses snake_case (Python/Go), configure the serializer to automatically transform API response output.

---

## Response Structure: Collection vs Single Resource

### Single Resource — Flat

```json
// GET /api/users/42
{
  "id": 42,
  "name": "Ivan Petrov",
  "email": "ivan@example.com",
  "role": "admin",
  "createdAt": "2024-01-10T08:00:00Z"
}
```

Direct access: `user.id`, `user.email`. No `user.data.id` wrapper needed.

### Collection — With Envelope and Meta

```json
// GET /api/users?page=1&perPage=20
{
  "data": [
    { "id": 42, "name": "Ivan" },
    { "id": 43, "name": "Maria" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20,
    "totalPages": 8
  }
}
```

Envelope is justified because both data and pagination metadata need to be returned simultaneously.

---

## Envelope Pattern: `{ data, meta, errors }`

### When to Use Envelope

```
┌─────────────────────────────────────────────────────┐
│                  API Response                       │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐   │
│  │  data    │   │  meta    │   │  errors      │   │
│  │          │   │          │   │              │   │
│  │ Main     │   │ total    │   │ type         │   │
│  │ data     │   │ page     │   │ title        │   │
│  │          │   │ perPage  │   │ detail       │   │
│  └──────────┘   └──────────┘   └──────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Justified for:**
- Collections with pagination (need meta)
- Responses with warnings (`warnings: [...]`)
- HATEOAS links (`links: { next, prev, self }`)
- When a unified structure is needed for all responses

**Excessive for:**
- Single resources without additional metadata
- Simple create/update operations

---

## Flat Response: Minimalism Without Wrappers

```
Request                   Response
GET /products/42   →   { id: 42, name: "...", price: ... }
DELETE /products/42 →  (204 No Content, empty body)
POST /products      →  { id: 43, name: "...", createdAt: ... }
```

### Data Flow Diagram

```
Client ──→ HTTP Request ──→ Server
           Content-Type     ↓
           Authorization    Processing
                            ↓
Client ←── HTTP Response ←── Server
           Status: 200/201  Body: JSON
           Content-Type
```

---

## Partial Updates: PATCH vs PUT

### PUT — Complete Replacement

```json
// PUT /api/products/42
// Must send ALL fields, otherwise they will be zeroed out
{
  "name": "Laptop",
  "price": 89990,
  "description": "...",
  "categoryId": 3,
  "inStock": true,
  "stockCount": 5
}
```

### PATCH — Partial Update (JSON Merge Patch, RFC 7396)

```json
// PATCH /api/products/42
// Content-Type: application/merge-patch+json
// Only changed fields:
{
  "price": 79990,
  "inStock": false
}
```

### Null Semantics in Merge Patch

```json
// null = "remove field" (set to absence of value)
{
  "description": null   // ← the description field will be cleared
}

// Missing field = "don't touch"
{
  "price": 5990         // ← only the price will change, description unchanged
}
```

### JSON Patch (RFC 6902) — For Complex Operations

```json
// Content-Type: application/json-patch+json
[
  { "op": "replace", "path": "/price", "value": 79990 },
  { "op": "add", "path": "/tags/-", "value": "sale" },
  { "op": "remove", "path": "/discount" }
]
```

JSON Patch is more powerful (supports array operations), but more complex to understand and implement. For most APIs, Merge Patch is sufficient.

---

## Null vs Missing Field

These are fundamentally different things:

```json
// Option 1: field exists, value explicitly empty
{ "id": 1, "deletedAt": null }

// Option 2: field is absent
{ "id": 1 }
```

| | `"deletedAt": null` | field absent |
|--|--|--|
| Meaning | "deleted at an unknown time" | "deletion is not applicable" |
| TypeScript | `deletedAt: string \| null` | `deletedAt?: string` |
| Merge Patch | "clear the field" | "don't touch" |

📌 Use `null` when the field is applicable but the value is empty. Omit the field when it does not apply to this resource type.

---

## Timestamps: ISO 8601 Required

```
❌ Unix timestamp: 1712345678
   Problems: seconds or milliseconds? Which timezone?

❌ Local date: "15.01.2024 10:30"
   Problems: locale? timezone? parsing format?

✅ ISO 8601 UTC: "2024-01-15T10:30:00Z"
   Pros: unambiguous, human-readable, all libraries parse natively
```

```json
{
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:22Z",
  "expiresAt": "2024-04-15T00:00:00Z"
}
```

Always UTC (suffix `Z`). Conversion to local time is done by the client.

---

## Nested Resources: Expand/Include Pattern

Sometimes the client needs related data. Two strategies:

### By Default — Only IDs

```json
// GET /api/orders/1
{
  "id": 1,
  "userId": 42,
  "productId": 7,
  "quantity": 2,
  "total": 17980
}
```

### On Request — Expand Related Objects

```json
// GET /api/orders/1?expand=user,product
{
  "id": 1,
  "user": {
    "id": 42,
    "name": "Ivan",
    "email": "ivan@example.com"
  },
  "product": {
    "id": 7,
    "name": "Mouse",
    "price": 2990
  },
  "quantity": 2,
  "total": 17980
}
```

This pattern avoids the N+1 problem without complicating standard responses.

---

## ⚠️ Typical Beginner Mistakes

### 1. Matryoshka — Excessive Nesting

```json
// ❌ Client writes response.payload.user.data.id
{
  "response": {
    "payload": {
      "user": {
        "data": {
          "id": 42
        }
      }
    }
  }
}

// ✅ Client writes user.id
{
  "id": 42,
  "name": "Ivan"
}
```

**Why it's a problem:** every extra level of nesting without meaning is complexity with no benefit.

### 2. Boolean as String or Number

```json
// ❌ "true" — this is a string! if (isActive) → always true, even for "false"
{ "isActive": "true", "isVerified": 1, "isPremium": "yes" }

// ✅ Real booleans
{ "isActive": true, "isVerified": true, "isPremium": false }
```

**Why it's a problem:** `"false"` is truthy in JavaScript. `if (data.isActive)` will return `true` for the string `"false"`.

### 3. Different Error Formats on Different Endpoints

```json
// ❌ Endpoint A
{ "error": "Not found" }

// ❌ Endpoint B
{ "success": false, "message": "Forbidden" }

// ✅ Unified RFC 7807 for all
{
  "type": "https://api.example.com/errors/not-found",
  "title": "Resource Not Found",
  "status": 404
}
```

**Why it's a problem:** the client is forced to write different error-handling logic for each endpoint.

### 4. Collection Without Pagination Metadata

```json
// ❌ Client doesn't know how many pages
{ "users": [...] }

// ✅ Data + meta
{ "data": [...], "meta": { "total": 150, "page": 1, "totalPages": 8 } }
```

**Why it's a problem:** the UI cannot build a paginator. The next page is guesswork.

---

## 💡 Practical Tips

- **Version the API in the URL**: `/api/v1/...` — this way you can change the response format without breaking old clients
- **Return the created object from POST**: the client should not have to make an additional GET to find out the id
- **DELETE returns 204**: no need for a body `{ "success": true }` — 204 already means success
- **Always include `updatedAt` in PATCH responses**: the client knows when the update occurred
- **Document what null means**: in every field that can be null, describe the semantics
