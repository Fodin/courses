# 🔥 Level 6: API Design

## 🎯 Why Design APIs?

Imagine you're building a house. APIs are the **doors and windows**. It doesn't matter how beautiful the inside is — if the doors open the wrong way, the windows don't fit, and the locks change every month, the house is unlivable.

An API is a **contract** between your service and the rest of the world. A bad API = pain for clients, endless breaking changes, and late-night on-call shifts. A good API = an intuitive, stable, and scalable interface that lasts for years.

📌 **API Design is not about code. It's about communication.** Every endpoint is a promise that cannot be broken.

## 🔥 REST — Richardson Maturity Model

REST is the most popular API style. But "REST" is a broad concept. Leonard Richardson defined 4 levels of maturity:

```mermaid
flowchart LR
  L0["Level 0\nSingle URL, POST\n/api"] --> L1["Level 1\nResources\n/users, /orders"]
  L1 --> L2["Level 2\nHTTP Verbs\nGET, POST, PUT, DELETE"]
  L2 --> L3["Level 3\nHATEOAS\nHyperlinks in responses"]

  style L0 fill:#ffcdd2
  style L1 fill:#fff9c4
  style L2 fill:#c8e6c9
  style L3 fill:#bbdefb
```

### Level 0: The Swamp of POX

Single URL, everything via POST. This is SOAP/XML-RPC. No REST at all.

```typescript
// Level 0 — everything through one endpoint
POST /api
{ "action": "getUser", "userId": 42 }

POST /api
{ "action": "createOrder", "items": [...] }
```

### Level 1: Resources

Separate URLs for each resource, but HTTP methods are used incorrectly.

```typescript
// Level 1 — resources exist, but still using POST
POST /users/42         // get user
POST /users/42/orders  // create order
```

### Level 2: HTTP Verbs (most "REST APIs" live here)

Resources + correct HTTP methods + status codes.

```typescript
// Level 2 — full REST
GET    /users/42           // 200 OK
POST   /users              // 201 Created
PUT    /users/42           // 200 OK (full replacement)
PATCH  /users/42           // 200 OK (partial update)
DELETE /users/42           // 204 No Content
GET    /users/42/orders    // 200 OK (nested resources)
```

| Method | Purpose | Idempotent? | Safe? |
|---|---|---|---|
| GET | Read | Yes | Yes |
| POST | Create | No | No |
| PUT | Full replacement | Yes | No |
| PATCH | Partial update | No* | No |
| DELETE | Delete | Yes | No |

*PATCH can be idempotent when using JSON Merge Patch.

### Level 3: HATEOAS

Response contains links to related actions. The client doesn't hardcode URLs — it follows links.

```json
{
  "id": 42,
  "name": "Иван",
  "email": "ivan@example.com",
  "_links": {
    "self": { "href": "/users/42" },
    "orders": { "href": "/users/42/orders" },
    "update": { "href": "/users/42", "method": "PUT" },
    "delete": { "href": "/users/42", "method": "DELETE" }
  }
}
```

💡 **In practice:** most APIs live at Level 2. HATEOAS (Level 3) is rarely used — clients still hardcode URLs. But the idea of "discoverable APIs" is useful for documentation.

## 🔥 GraphQL — When REST Is Not Enough

REST works great for simple CRUD. But what if:
- A mobile client needs 3 fields from User and 2 from Order in a single request?
- One screen requires data from 5 endpoints?
- Different clients (web, mobile, admin) need different sets of fields?

GraphQL solves the problem of **overfetching** (excess data) and **underfetching** (insufficient data, N+1 API requests).

```graphql
# Schema — defines the data structure
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!     # relationship — resolved on demand
  followers: Int!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  comments: [Comment!]!
}

type Query {
  user(id: ID!): User
  posts(limit: Int, offset: Int): [Post!]!
}

type Mutation {
  createPost(title: String!, content: String!): Post!
  deletePost(id: ID!): Boolean!
}
```

```graphql
# Client requests exactly what it needs
query {
  user(id: "42") {
    name
    email
    posts {
      title
      comments {
        text
      }
    }
  }
}
```

### The N+1 Problem in GraphQL

```typescript
// ❌ Naive resolver — 1 query for users + N queries for posts
const resolvers = {
  Query: {
    users: () => db.query('SELECT * FROM users')  // 1 query
  },
  User: {
    posts: (user) => db.query('SELECT * FROM posts WHERE author_id = ?', [user.id])
    // Called for EVERY user → N queries!
  }
}
// If 100 users → 1 + 100 = 101 database queries

// ✅ DataLoader — batching and caching
import DataLoader from 'dataloader'
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.query(
    'SELECT * FROM posts WHERE author_id IN (?)', [userIds]
  )  // 1 query instead of N!
  return userIds.map(id => posts.filter(p => p.authorId === id))
})

const resolvers = {
  User: {
    posts: (user) => postLoader.load(user.id) // Automatic batching
  }
}
// Now: 1 + 1 = 2 database queries
```

## 🔥 gRPC — For Inter-Service Communication

gRPC uses Protocol Buffers (binary format) and HTTP/2. It's 2–10x faster than REST for internal communications.

```protobuf
// user.proto — contract definition
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
  rpc ListUsers(ListUsersRequest) returns (stream User);     // Server streaming
  rpc UploadAvatar(stream Chunk) returns (UploadResponse);   // Client streaming
  rpc Chat(stream Message) returns (stream Message);          // Bidirectional
}

message GetUserRequest {
  string user_id = 1;
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
}
```

| Type | Description | Example |
|---|---|---|
| Unary | Request-response (like REST) | GetUser |
| Server streaming | Server sends a stream | ListUsers (1000+ results) |
| Client streaming | Client sends a stream | File upload in chunks |
| Bidirectional | Two-way stream | Chat, real-time updates |

## 🔥 REST vs GraphQL vs gRPC — Comparison

| | REST | GraphQL | gRPC |
|---|---|---|---|
| **Format** | JSON (text) | JSON (text) | Protobuf (binary) |
| **Protocol** | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| **Contract** | OpenAPI/Swagger | Schema (SDL) | .proto file |
| **Typing** | Weak | Strict (schema) | Strict (protobuf) |
| **Overfetching** | Common issue | No (client selects fields) | No (fixed message) |
| **Streaming** | No (SSE/WebSocket separately) | Subscriptions | Built-in |
| **Browser** | Native support | Native support | Requires gRPC-Web proxy |
| **When** | Public API, CRUD | Complex clients, aggregation | Microservices, low-latency |

💡 **Rule of thumb:** REST — for public APIs. GraphQL — when clients need flexibility. gRPC — for internal service-to-service communication.

## 🔥 Pagination: Offset vs Cursor

When there are thousands of resources, you need pagination. Two approaches:

### Offset-based (simple but problematic)

```typescript
// Request
GET /posts?limit=20&offset=40  // Page 3

// SQL
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 40

// Response
{
  "data": [...],
  "pagination": {
    "total": 1500,
    "limit": 20,
    "offset": 40,
    "pages": 75
  }
}
```

**Problem:** if a new post is added between page requests, the offset shifts and the user sees duplicates or skips entries.

### Cursor-based (reliable)

```typescript
// Request
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==

// SQL (cursor is the encoded id of the last element)
SELECT * FROM posts WHERE id < 100 ORDER BY id DESC LIMIT 20

// Response
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6ODB9",
    "has_more": true
  }
}
```

| | Offset | Cursor |
|---|---|---|
| **Simplicity** | Simple (page=3) | More complex (opaque cursor) |
| **Skips/duplicates** | Yes (on data changes) | No |
| **Performance** | O(offset) — slow on large offsets | O(1) — always fast (WHERE id < X) |
| **Jump to page** | Possible (?page=50) | Not possible (next/prev only) |
| **When** | Admin panels, static data | Feeds, timelines, mobile apps |

📌 **For public APIs, use cursor-based pagination.** Offset is only suitable for internal admin panels.

## 🔥 Rate Limiting — Protecting the API

Rate limiting is the "bouncer at the club entrance." Without it, a single client can bring down the entire service.

```mermaid
flowchart LR
  C[Client] -->|"Request"| RL["Rate Limiter\n(Token Bucket)"]
  RL -->|"✅ Allowed"| S[API Server]
  RL -->|"❌ 429 Too Many"| C
  S -->|"Response"| C

  style RL fill:#fff3e0
  style S fill:#c8e6c9
```

### Token Bucket (most popular)

Analogy: a bucket with tokens. Tokens are added at a constant rate. Each request takes one token. If the bucket is empty, the request is rejected. The bucket has a maximum size (burst).

```typescript
class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(
    private rate: number,     // tokens per second
    private burst: number     // maximum bucket size
  ) {
    this.tokens = burst
    this.lastRefill = Date.now()
  }

  allow(): boolean {
    this.refill()
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true   // ✅ Request allowed
    }
    return false    // ❌ Rate limited (429)
  }

  private refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    this.tokens = Math.min(this.burst, this.tokens + elapsed * this.rate)
    this.lastRefill = now
  }
}
```

### Sliding Window (more accurate, but more complex)

Counts requests in a sliding window. More accurate than fixed window, but requires more memory.

```typescript
class SlidingWindowLog {
  private requests: number[] = []

  constructor(
    private windowMs: number,  // window size (e.g., 60000 = 1 min)
    private maxRequests: number // max requests in window
  ) {}

  allow(): boolean {
    const now = Date.now()
    // Remove requests outside the window
    this.requests = this.requests.filter(t => now - t < this.windowMs)

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true   // ✅ Allowed
    }
    return false    // ❌ Rate limited
  }
}
```

### Fixed Window (simple, but has burst problem)

Fixed intervals (e.g., every minute). Problem: at the boundary of two windows, a client can send 2x the limit.

```
Window 1 (00:00-01:00): [............98 99 100] ← limit
Window 2 (01:00-02:00): [100 99 98............] ← limit
                                    ↑
                        200 requests in 2 seconds!
```

| Algorithm | Accuracy | Memory | Burst Protection | Complexity |
|---|---|---|---|---|
| Token Bucket | High | O(1) | Controllable (burst param) | Simple |
| Sliding Window | High | O(N) | Full | Medium |
| Fixed Window | Low | O(1) | Weak (window boundary) | Simple |

## 🔥 API Authentication

### JWT (JSON Web Token)

The token contains information about the user, signed with a secret key. The server does not store sessions — stateless.

```
JWT = Header.Payload.Signature

Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "42", "name": "Ivan", "role": "admin", "exp": 1710500000 }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

```typescript
// Client sends token in the header
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.signature

// Server verifies the signature without database access
const payload = jwt.verify(token, SECRET_KEY)
// { sub: '42', name: 'Ivan', role: 'admin' }
```

### OAuth2 Authorization Code Flow

For third-party applications — the user authorizes through a provider (Google, GitHub), the application receives a token.

```mermaid
sequenceDiagram
  participant U as User
  participant A as App (Client)
  participant AS as Auth Server
  participant R as Resource Server

  U->>A: Clicks "Sign in with Google"
  A->>AS: Redirect → /authorize?client_id=X&redirect_uri=Y
  AS->>U: Shows consent form
  U->>AS: Grants access
  AS->>A: Redirect → callback?code=AUTH_CODE
  A->>AS: POST /token (code + client_secret)
  AS->>A: access_token + refresh_token
  A->>R: GET /api/data + Bearer token
  R->>A: User data
```

### API Keys

For service-to-service communication. Simple, but without granular permissions.

```typescript
// Client sends key in the header
GET /api/weather?city=Moscow
X-API-Key: sk_live_abc123def456

// Server checks key in the database
const client = await db.query('SELECT * FROM api_keys WHERE key = ?', [apiKey])
if (!client) return res.status(401).json({ error: 'Invalid API key' })
if (client.rateLimit.exceeded) return res.status(429).json({ error: 'Rate limit exceeded' })
```

| Method | Stateless | Granular | When |
|---|---|---|---|
| JWT | Yes | Roles in payload | Internal APIs, SPAs |
| OAuth2 | Depends | Scopes | Third-party applications |
| API Key | No (database lookup) | Per key | S2S, public APIs |

## 🔥 Idempotency Keys

Networks are unreliable. A client sent a POST request and got a timeout. Did the request arrive or not? Retrying is risky (double charge). Not retrying — potential loss.

Solution: **idempotency key** — a unique operation identifier.

```typescript
// Client generates a unique key
POST /api/payments
Idempotency-Key: pay_uuid_abc123
{
  "amount": 5000,
  "currency": "RUB",
  "recipient": "merchant_42"
}

// Server:
// 1. Checks — does pay_uuid_abc123 exist in cache/DB?
// 2. If yes — returns saved result (without re-executing)
// 3. If no — executes the operation and saves the result with this key
```

```typescript
async function handlePayment(req: Request, res: Response) {
  const idempotencyKey = req.headers['idempotency-key']

  // Check: already processed?
  const cached = await redis.get(`idempotency:${idempotencyKey}`)
  if (cached) {
    return res.json(JSON.parse(cached))  // Return cache
  }

  // Execute the operation
  const result = await processPayment(req.body)

  // Save the result (TTL 24 hours)
  await redis.set(`idempotency:${idempotencyKey}`, JSON.stringify(result), 'EX', 86400)

  return res.json(result)
}
```

📌 **Rule:** all non-idempotent operations (POST for creation, payments) must support idempotency keys.

## 🔥 API Versioning

APIs evolve. How to update without breaking clients?

| Strategy | Example | Pros | Cons |
|---|---|---|---|
| **URL path** | `/v1/users`, `/v2/users` | Obvious, easy to route | URL duplication |
| **Header** | `Accept: application/vnd.api.v2+json` | Clean URLs | Harder to test |
| **Query param** | `/users?version=2` | Simple | Caching is harder |
| **No versioning** | Backward-compatible changes only | Single API | Limits evolution |

```typescript
// URL path (most popular)
GET /v1/users/42  → { id: 42, name: "Ivan" }
GET /v2/users/42  → { id: 42, firstName: "Ivan", lastName: "Petrov" }

// Deprecation — warn clients
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Link: </v2/users>; rel="successor-version"
```

💡 **Best practice:** URL versioning (`/v1/`, `/v2/`). Support at least 2 versions. Deprecation notice 6+ months in advance. Monitor traffic to old versions.

## 🔥 API Gateway and BFF Pattern

### API Gateway

Single entry point for all clients. Centralizes cross-cutting concerns: authentication, rate limiting, logging, routing.

### BFF (Backend for Frontend)

Separate backend for each client type. Mobile needs compact responses, web — full, admin — detailed.

```mermaid
flowchart LR
  M[Mobile App] --> BFF_M["BFF Mobile\n(compact data)"]
  W[Web App] --> BFF_W["BFF Web\n(full data)"]
  A[Admin Panel] --> BFF_A["BFF Admin\n(all data + metrics)"]

  BFF_M --> GW["API Gateway\n(auth, rate limit, routing)"]
  BFF_W --> GW
  BFF_A --> GW

  GW --> US[User Service]
  GW --> OS[Order Service]
  GW --> PS[Product Service]
  GW --> AS[Analytics Service]
  GW --> NS[Notification Service]
```

```typescript
// BFF Mobile — minimal data, optimized for mobile networks
app.get('/mobile/feed', async (req, res) => {
  const posts = await productService.getTopPosts({ limit: 10 })
  const user = await userService.getBasicProfile(req.userId)

  // Aggregate and return a compact response
  res.json({
    user: { name: user.name, avatar: user.avatarSmall },
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      thumbnail: p.imageSm  // small image for mobile networks
    }))
  })
})

// BFF Web — full data
app.get('/web/feed', async (req, res) => {
  const [posts, user, notifications, analytics] = await Promise.all([
    productService.getPosts({ limit: 20, includeComments: true }),
    userService.getFullProfile(req.userId),
    notificationService.getUnread(req.userId),
    analyticsService.getUserStats(req.userId)
  ])

  res.json({ user, posts, notifications, analytics })
})
```

## ⚠️ Common Beginner Mistakes

### ❌ Mistake 1: Verbs in URLs instead of nouns

```typescript
// ❌ RPC-style — verbs
POST /getUser?id=42
POST /createOrder
POST /deleteUser?id=42
POST /updateUserEmail
```

```typescript
// ✅ RESTful — nouns + HTTP methods
GET    /users/42
POST   /orders
DELETE /users/42
PATCH  /users/42   { "email": "new@example.com" }
```

### ❌ Mistake 2: No pagination on lists

```typescript
// ❌ Returning ALL records — kills the server with 1M+ records
GET /posts  → [... 1 000 000 posts ...]
```

```typescript
// ✅ Always paginate + reasonable default limit
GET /posts?limit=20&cursor=abc123
// Maximum limit = 100, default = 20
```

### ❌ Mistake 3: No idempotency key on POST requests

```typescript
// ❌ Client retries after timeout → double charge
POST /payments  { "amount": 5000 }
// Timeout → retry →
POST /payments  { "amount": 5000 }
// = 10 000 charged!
```

```typescript
// ✅ Idempotency key prevents duplicates
POST /payments
Idempotency-Key: pay_uuid_abc123
{ "amount": 5000 }
// Retry with the same key → server returns cache, does not create new payment
```

### ❌ Mistake 4: Breaking changes without versioning

```typescript
// ❌ v1: name is a string. Clients depend on it
{ "name": "Ivan Petrov" }

// 3 months later: name split into two fields WITHOUT versioning
{ "firstName": "Ivan", "lastName": "Petrov" }
// All clients broken!
```

```typescript
// ✅ New version + backward compatibility
// /v1/users/42 — still returns name
{ "name": "Ivan Petrov" }

// /v2/users/42 — new format
{ "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
// name remains for compatibility
```

### ❌ Mistake 5: GraphQL without solving N+1

```typescript
// ❌ 100 users → 101 database queries
query { users { name posts { title } } }
// Each User.posts → separate SELECT
```

```typescript
// ✅ DataLoader batches requests
// 100 users → 2 database queries (users + posts WHERE author_id IN (...))
```

## 📌 Summary

| Concept | Key Takeaway |
|---|---|
| **REST (Level 2)** | Resources + HTTP verbs + status codes — standard for public APIs |
| **GraphQL** | Client selects fields. Solves over/underfetching. DataLoader is mandatory |
| **gRPC** | Protobuf + HTTP/2. For inter-service calls — multiples faster than REST |
| **Cursor pagination** | Stable, fast. For feeds and lists — always use cursor |
| **Rate limiting** | Token bucket — balance of accuracy and simplicity. Required for public APIs |
| **Idempotency key** | Unique operation key. Protection against duplicates on retry |
| **API versioning** | URL path (`/v1/`). Sunset notice. At least 2 versions simultaneously |
| **API Gateway + BFF** | Gateway — single entry (auth, rate limit). BFF — client-specific optimization |
| **OAuth2** | Authorization code flow for third-party apps. JWT for internal use |

🎯 **Main principle:** An API is a contract. Design it as if 1,000 teams you'll never meet will use it. Make it obvious, stable, and hard to break.