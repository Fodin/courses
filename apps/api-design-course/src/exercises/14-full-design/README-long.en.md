# Designing a Real API: From Idea to Release

This is the final level of the course. Here we don't learn anything new — we put it all together. API design is a craft that can't be mastered one principle at a time. You need to see the whole picture.

Imagine you're an architect. You might know how to do bricklaying, how to run electrical, how to lay pipes. But a house isn't built from these skills separately — it's built from combining them correctly from the start. An API is the same kind of house.

---

## API Design Process

```mermaid
graph LR
    A[Business Requirements] --> B[Identify Resources]
    B --> C[URL Structure]
    C --> D[Methods & Status Codes]
    D --> E[Data Models]
    E --> F[Cross-cutting Concerns]
    F --> G[Error Handling]
    G --> H[OpenAPI Specification]
    H --> I[Documentation & SDK]
    I --> J[Review & Release]
```

Each stage affects the next. If you get the resource level wrong — the URL will be wrong. If the URL is wrong — the client code will be confusing. Early-stage mistakes get more expensive with each subsequent step.

---

## Step 1: Defining Business Requirements

Before drawing any URL, you need to answer the questions:

**Who are the API consumers?**
- iOS/Android mobile app
- React frontend application
- Third-party partners
- Internal services

Different consumers have different needs. A public API for partners requires strict versioning and stability. An internal API for microservices — speed of iteration.

**What operations are needed?**

Write down all business operations in plain words:
- "User adds a product to the cart"
- "Manager changes the product price"
- "System sends a delivery notification"

These are your future POST/PATCH/webhook endpoints.

**What constraints exist?**
- Request frequency (rate limits)
- Authentication and authorization
- Payload sizes (large files — separate upload API)
- Latency requirements

---

## Step 2: Resource Identification

A resource is any entity that can be given a URL. Rule: **noun, not verb**.

💡 A good approach — take the business requirements and write down all the nouns:
"The user adds a **product** to the **cart**, places an **order**, leaves a **review**"

Resources: `products`, `cart`, `orders`, `reviews`.

### Independent vs Nested Resources

```
# Independent resource — exists on its own
/products
/users
/orders

# Nested resource — lifecycle depends on parent
/products/{id}/images        # an image without a product makes no sense
/orders/{id}/items           # an item without an order is meaningless
/users/{id}/addresses        # an address always belongs to a user
```

⚠️ Beginner mistake: making everything nested. If a resource is often requested independently — promote it to the top level.

```
# Bad: only nested access
GET /orders/{id}/items/{itemId}  # can't get an item without an orderId

# Good: both nested and direct
GET /orders/{id}/items           # all order items
GET /order-items/{id}            # direct access to an item
```

---

## Step 3: Designing the URL Structure

A URL is a public interface. It's changed rarely and with pain. So decisions must be right from the start.

### Naming Rules

```
✅ /products             # plural
✅ /reading-lists        # lowercase, hyphens
✅ /products/{id}        # identifier in path
✅ /products?q=coffee    # filtering in query

❌ /getProducts          # verb
❌ /Product              # singular, uppercase
❌ /productList          # camelCase in URL
❌ /product_list         # snake_case in URL
```

### Actions — When You Need a "Verb"

Sometimes an operation doesn't fit into CRUD. For such cases — an action endpoint:

```
POST /orders/{id}/cancel         # cancel an order
POST /orders/{id}/ship           # ship an order
POST /accounts/{id}/activate     # activate an account
POST /payments/{id}/refund       # refund a payment
```

📌 Rule: action endpoints — always POST. They change state, are often not idempotent.

---

## Step 4: Choosing Methods and Status Codes

### Method Matrix

| Method | Semantics | Idempotent | Safe |
|--------|-----------|------------|------|
| GET | Reading | Yes | Yes |
| POST | Creation/action | No | No |
| PUT | Full replacement | Yes | No |
| PATCH | Partial update | Conditional | No |
| DELETE | Deletion | Yes | No |

### Standard Status Code Map

```
Resource creation:
  POST /resources     → 201 Created + Location: /resources/{id}

Successful read/update:
  GET/PUT/PATCH       → 200 OK (with body)

Successful deletion:
  DELETE              → 204 No Content (no body)

Client errors:
  Invalid data        → 400 Bad Request
  No token            → 401 Unauthorized
  No permissions      → 403 Forbidden
  Not found           → 404 Not Found
  State conflict      → 409 Conflict
  Rate limit          → 429 Too Many Requests

Server errors:
  Internal error      → 500 Internal Server Error
  Service unavailable → 503 Service Unavailable
```

🔥 Golden rule: **never return 200 OK with `{ "error": true }` in the body**. HTTP status is the first indicator for the client.

---

## Step 5: Designing Data Models

### Unified Envelope

```json
// Resource list
{
  "data": [...],
  "meta": { "total": 100, "page": 1 }
}

// Single resource
{
  "data": { "id": "...", ... }
}

// Error — unified format everywhere
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with the specified ID not found",
    "details": { "productId": "prod_01HX" }
  }
}
```

### Data Type Conventions

```json
// Identifiers — strings (ULID, UUID), not numbers
"id": "01HX4K2M9P"          // ✅ ULID
"id": "550e8400-e29b"        // ✅ UUID
"id": 42                     // ❌ number

// Money — object with amount and currency
"price": { "amount": 850.00, "currency": "RUB" }   // ✅
"price": 850                                         // ❌ no currency
"price": "850 rub"                                   // ❌ string

// Dates — ISO 8601, UTC
"createdAt": "2024-01-15T10:30:00Z"    // ✅
"createdAt": "01.01.2024"              // ❌ ambiguous
"createdAt": 1705311600                // ❌ timestamp (readability)

// Boolean values
"isAvailable": true    // ✅ explicit bool
"available": "yes"     // ❌ string
"available": 1         // ❌ number
```

---

## Step 6: Cross-Cutting Concerns

These are aspects that apply to the entire API, not to individual endpoints.

### Pagination

Rule: **all list endpoints must have pagination**. No exceptions.

```
GET /products?page=1&limit=20&sort=name&order=asc

Parameters:
  page    — page number (starting from 1)
  limit   — page size (default: 20, max: 100)
  sort    — sort field
  order   — asc | desc

Response:
  meta.total      — total records
  meta.page       — current page
  meta.perPage    — page size
  meta.totalPages — total pages
  meta.hasNext    — is there a next page
  meta.hasPrev    — is there a previous page
```

Cursor-based pagination for feeds and real-time data:

```
GET /feed?cursor=eyJpZCI6IjAxSFgifQ&limit=20

Response:
  meta.nextCursor — cursor for the next page (null if end)
  meta.hasMore    — whether there's more
```

### Filtering and Search

```
# Exact filters
GET /products?category=coffee&available=true

# Ranges
GET /products?price_min=100&price_max=1000

# Full-text search
GET /products?q=arabica

# Multiple values
GET /products?status=active&status=featured
```

### Sorting

```
# Single field
GET /products?sort=price&order=asc

# Multiple fields (syntax depends on implementation)
GET /products?sort=category,price&order=asc,desc
```

---

## Step 7: Error Handling Strategy

Errors are half of your API. Poorly designed errors are the most common reason developers hate APIs.

### Error Structure

```json
{
  "error": {
    "code": "VALIDATION_ERROR",        // machine-readable code
    "message": "Data failed validation",  // human-readable description
    "details": {                        // optional, details
      "fields": [
        { "field": "email", "message": "Invalid format" },
        { "field": "age", "message": "Must be greater than 0" }
      ]
    },
    "requestId": "req_01HX4K2"         // for tracing
  }
}
```

### Error Codes

Codes — strings, not numbers. Numbers tell the developer nothing:

```
❌ "code": 1042
✅ "code": "PRODUCT_NOT_FOUND"
✅ "code": "INSUFFICIENT_STOCK"
✅ "code": "ORDER_ALREADY_CANCELLED"
```

Code structure: `NOUN_VERB` or `NOUN_STATE`. SCREAMING_SNAKE_CASE.

### Error Categories

```
Input validation:
  400 + VALIDATION_ERROR
  400 + INVALID_FORMAT

Authentication/authorization:
  401 + AUTHENTICATION_REQUIRED
  401 + TOKEN_EXPIRED
  403 + INSUFFICIENT_PERMISSIONS

Business logic:
  409 + PRODUCT_OUT_OF_STOCK
  409 + ORDER_ALREADY_SHIPPED
  409 + EMAIL_ALREADY_TAKEN

Not found:
  404 + PRODUCT_NOT_FOUND
  404 + USER_NOT_FOUND
```

---

## Step 8: OpenAPI Specification

OpenAPI is the single source of truth about the API. It's written before implementation (design-first) or after (code-first), but it's mandatory.

```yaml
openapi: 3.1.0
info:
  title: Shop API
  version: 1.0.0

paths:
  /v1/products:
    get:
      summary: Product list
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Product list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductListResponse'
        '400':
          $ref: '#/components/responses/ValidationError'
```

📌 Rule: all components (schemas, responses, parameters) are placed in `components` and reused via `$ref`.

---

## Step 9: Documentation and SDK

### Good Documentation Contains

1. **Quick Start** — first request in 5 minutes
2. **Authentication** — how to obtain and use a token
3. **Examples** with real data (not `foo`/`bar`)
4. **Changelog** — what changed, how to migrate
5. **Sandbox** — environment for experimentation

### SDK

If the API is public — generate an SDK from the OpenAPI specification:

```bash
# TypeScript client via orval
npx orval --input ./api.yaml --output ./src/api

# Or openapi-typescript for types only
npx openapi-typescript ./api.yaml -o ./src/api.d.ts
```

---

## API Design Review: Final Checklist

Before declaring the API ready for release, go through this list:

### URLs and Resources
- [ ] Resources are plural nouns
- [ ] URLs are lowercase with hyphens
- [ ] Hierarchy reflects resource relationships
- [ ] No duplicate URLs

### HTTP Methods
- [ ] GET only reads (safe)
- [ ] POST creates / action (not idempotent)
- [ ] PUT/PATCH for updates
- [ ] DELETE returns 204

### Status Codes
- [ ] 201 + Location after POST (creation)
- [ ] 204 after DELETE and PATCH without body
- [ ] No 200 for errors
- [ ] Proper 4xx/5xx separation

### Data
- [ ] Unified envelope (data, meta, error)
- [ ] camelCase for JSON fields
- [ ] ISO 8601 UTC dates
- [ ] Money with currency
- [ ] IDs are strings, not numbers

### Pagination
- [ ] All lists are paginated
- [ ] meta with total, page, hasNext
- [ ] Reasonable default and maximum limit

### Errors
- [ ] Unified format { error: { code, message, details } }
- [ ] Error codes are strings (SCREAMING_SNAKE_CASE)
- [ ] Validation errors with per-field details

### Security
- [ ] All private endpoints require auth
- [ ] Sensitive data doesn't leak in responses
- [ ] Rate limiting is configured and documented
- [ ] X-RateLimit-* headers

### Documentation
- [ ] OpenAPI specification is up to date
- [ ] Request/response examples
- [ ] Changelog for changes

---

## Governance: Style Guide and Automated Checks

In large teams, rules without automation don't work. Use **Spectral** — a linter for OpenAPI.

```yaml
# .spectral.yaml
rules:
  # URL keys should be lowercase
  path-keys-no-trailing-slash: true

  # All operations must have an operationId
  operation-operationId: true

  # All 2xx responses must have content
  operation-success-response: true

  # Custom rules
  paths-plural-nouns:
    message: 'Path segments should be plural nouns'
    given: '$.paths'
    then:
      function: pattern
      functionOptions:
        match: '^\/[a-z][a-z-]*[s]'
```

```bash
npx @stoplight/spectral-cli lint ./api.yaml
```

Integrate into CI/CD — a specification that doesn't pass linting doesn't deploy.

---

## Course Summary: What You Can Do Now

Completing this course is not just knowledge. It's a new way of thinking about systems.

**You can now:**
- Design resources and URL structure from scratch
- Correctly apply HTTP methods and status codes
- Create consistent data models
- Write and read OpenAPI specifications
- Generate TypeScript types from a specification
- Conduct API Reviews and find common mistakes
- Design pagination, rate limiting, error handling

**Where to go next:**
- **GraphQL** — an alternative approach, especially for complex queries
- **gRPC** — for high-performance internal services
- **AsyncAPI** — specification for event-driven/WebSocket APIs
- **API Security** — OAuth 2.0, PKCE, token refresh, scope management
- **Hypermedia (HATEOAS)** — APIs that describe their own capabilities in responses
- **API Gateway patterns** — BFF, aggregation, circuit breaker

A good API is respect for the developer who uses it. Every decision you make during design either helps them or makes them suffer. Now you know how to do the former.
