# Level 6: API Design -- REST, GraphQL, Versioning, and Contracts

## Introduction

Imagine building a shopping mall. Inside -- hundreds of stores, warehouses, utilities, security systems. But for shoppers, all of this is invisible. They see only **entrance doors, signs, and rules of conduct**: you can enter here, here you can ask an assistant, here's the returns desk.

An API is exactly such an interface. From the outside -- clear rules: what you can request, in what format, what you get back. Inside -- arbitrary complexity that the client doesn't need to know about. API design is the art of creating **clear, stable, and secure doors** into your system.

A bad API is like a mall with no signs, where rules change every week, and security lets some through and holds others for no apparent reason. A good API is a place you want to return to, because everything is predictable and works as expected.

**API Design is not about code. It's about communication.** Each endpoint is a promise that shouldn't be broken.

At this level we will cover in detail:

1. **REST and Richardson Maturity Model** -- levels of REST maturity and why most APIs live at Level 2
2. **GraphQL** -- when REST isn't enough, the N+1 problem, and DataLoader
3. **gRPC** -- binary protocol for inter-service communication
4. **REST vs GraphQL vs gRPC** -- detailed comparison with selection criteria
5. **Pagination** -- offset vs cursor and why cursor is more reliable
6. **Rate Limiting** -- API overload protection algorithms
7. **Authentication** -- JWT, OAuth2, API Keys
8. **Idempotency Keys** -- protection against duplicating non-idempotent operations
9. **Versioning** -- strategies for API evolution without breaking changes
10. **API Gateway and BFF Pattern** -- architectural patterns for organizing the entry point

---

## 1. REST -- Richardson Maturity Model

### Why "REST" Isn't the Same for Everyone

The word "REST" is used today for almost any HTTP API. One developer says "we have a REST API," meaning JSON over HTTP. Another -- full resources, HTTP semantics, and stateless communication. A third -- HATEOAS and self-describing responses.

Leonard Richardson proposed a model in 2008 that put everything in place: **Richardson Maturity Model (RMM)**. The model describes 4 levels of REST API maturity -- from complete absence of REST principles to their full embodiment.

Understanding RMM is important for two reasons. First, it helps evaluate how "correct" an API you're reading or designing is. Second, most teams consciously stop at Level 2 -- and that's fine. HATEOAS sounds beautiful in theory but rarely delivers real value in practice.

```mermaid
flowchart LR
  L0["Level 0\nOne URL, POST\n/api"] --> L1["Level 1\nResources\n/users, /orders"]
  L1 --> L2["Level 2\nHTTP verbs\nGET, POST, PUT, DELETE"]
  L2 --> L3["Level 3\nHATEOAS\nHyperlinks in responses"]

  style L0 fill:#ffcdd2
  style L1 fill:#fff9c4
  style L2 fill:#c8e6c9
  style L3 fill:#bbdefb
```

### Level 0: The Swamp of POX

Level 0 is when a developer decided to use HTTP simply as transport for procedure calls. One URL, everything through POST. This is how SOAP/XML-RPC systems work.

This isn't REST. It's **RPC over HTTP**. HTTP here is just a pipe for data transfer, without using its semantics.

```typescript
// Level 0 -- everything through one endpoint
POST /api
{ "action": "getUser", "userId": 42 }

POST /api
{ "action": "createOrder", "items": [...] }

POST /api
{ "action": "deleteUser", "userId": 42 }
```

The problem is obvious: such APIs have no structure. The client must know a list of "magic strings" -- action names. No caching (POST isn't cached). No standard error behavior. Everything is defined by internal team conventions.

### Level 1: Resources

At Level 1, separate URLs appear for each resource. This is an important step -- now the data structure is reflected in the URL structure. But HTTP methods are still used incorrectly: still POST.

```typescript
// Level 1 -- resources exist, but HTTP methods are ignored
POST /users/42          // get user
POST /users/42/orders   // create order
POST /users/42/delete   // delete user
```

Analogy: imagine a library where each book has its own shelf (resource), but taking a book, returning it, or checking availability -- it's always the same request to the librarian. Progress exists, but HTTP potential isn't used.

### Level 2: HTTP Verbs (de-facto standard)

Level 2 is what most teams call "REST API." Resources + correct HTTP methods + meaningful status codes.

At this level, the API starts using HTTP as a **protocol with meaning**, not just transport:

- GET says: "I'm only reading, changing nothing"
- POST says: "I'm creating a new entity"
- PUT says: "I'm replacing the entity entirely"
- DELETE says: "I'm deleting"

```typescript
// Level 2 -- full REST
GET    /users/42           // 200 OK
POST   /users              // 201 Created
PUT    /users/42           // 200 OK (full replacement)
PATCH  /users/42           // 200 OK (partial update)
DELETE /users/42           // 204 No Content
GET    /users/42/orders    // 200 OK (nested resources)
```

Key properties of HTTP methods that make the API predictable:

| Method | Purpose | Idempotent? | Safe? | Cached? |
|---|---|---|---|---|
| GET | Read | Yes | Yes | Yes |
| POST | Create | No | No | No |
| PUT | Full replacement | Yes | No | No |
| PATCH | Partial update | No* | No | No |
| DELETE | Delete | Yes | No | No |
| HEAD | Metadata without body | Yes | Yes | Yes |
| OPTIONS | Allowed methods | Yes | Yes | No |

**Idempotency** is a guarantee that a repeated call with the same parameters produces the same result. If DELETE /users/42 is called twice -- the second call simply does nothing (user already deleted). This is critically important for handling network failures and retry logic.

**Safety** -- GET requests don't change server state. A browser, search bot, or proxy cache can safely call GET without fear of side effects.

*PATCH can be idempotent if using JSON Merge Patch (RFC 7396) or JSON Patch (RFC 6902), but this depends on the implementation.

### Level 3: HATEOAS

HATEOAS (Hypermedia As The Engine Of Application State) -- the most mature level. The response contains not only data, but also **links to available actions**. The client doesn't hardcode URLs -- it follows links, like in a browser.

```json
{
  "id": 42,
  "name": "Ivan",
  "email": "ivan@example.com",
  "_links": {
    "self": { "href": "/users/42" },
    "orders": { "href": "/users/42/orders" },
    "update": { "href": "/users/42", "method": "PUT" },
    "delete": { "href": "/users/42", "method": "DELETE" },
    "deactivate": { "href": "/users/42/deactivate", "method": "POST" }
  }
}
```

The idea is beautiful: the client "discovers" capabilities through links in the response, like a browser user clicks on links, without knowing the entire site structure in advance. Change the URL -- and the client won't break because it follows links, not hardcoded paths.

**In practice:** most APIs live at Level 2. HATEOAS (Level 3) is rarely used for several reasons: real clients still hardcode behavior based on business logic rather than mechanically following links; adding `_links` to every response makes it heavier; client code doesn't become simpler because it must be able to interpret links. But the idea of "discoverable API" is useful for documentation and onboarding.

---

## 2. GraphQL -- When REST Isn't Enough

### REST Problems with Complex Clients

REST works well when client and server are designed together, and data is requested "one endpoint -- one screen." But in real complex applications, this limitation manifests through two symptoms:

**Overfetching** -- the server returns more data than the client needs. A mobile client needs only name and avatar for a user card, but GET /users/42 returns 50 fields, including address, security settings, login history.

**Underfetching (N+1 to API)** -- one screen requires data from multiple resources, and the client is forced to make multiple sequential requests. To show a news feed: GET /users/me → GET /posts?userId=42 → GET /comments?postId=1 → GET /comments?postId=2 → ...

```mermaid
flowchart LR
  REST_Client["REST Client\nMobile app"] -->|"1: GET /users/42"| REST_Server["REST Server"]
  REST_Server -->|"Response: 50 fields"| REST_Client
  REST_Client -->|"2: GET /users/42/posts"| REST_Server
  REST_Server -->|"Response: all posts"| REST_Client
  REST_Client -->|"3-N: GET /posts/id/comments"| REST_Server

  GQL_Client["GraphQL Client\nMobile app"] -->|"1 request\nExactly needed fields"| GQL_Server["GraphQL Server"]
  GQL_Server -->|"Response: only name, avatar, last 3 posts"| GQL_Client
```

GraphQL solves both problems with one mechanism: **the client describes exactly what it needs**, and the server returns exactly that.

### GraphQL Schema -- Contract in SDL Language

GraphQL Schema Definition Language (SDL) is a strictly typed contract between client and server. Unlike REST, where the contract is described separately in OpenAPI/Swagger, in GraphQL **the schema is the API itself**.

```graphql
# Schema -- defines data structure and available operations
type User {
  id: ID!                 # ! means non-null (required field)
  name: String!
  email: String!
  posts: [Post!]!         # array of Post, neither elements nor array can be null
  followers: Int!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!           # relationship -- resolve on demand (not loaded unless asked)
  comments: [Comment!]!
  likesCount: Int!
}

type Comment {
  id: ID!
  text: String!
  author: User!
}

# Query -- read operations
type Query {
  user(id: ID!): User          # returns User or null
  users: [User!]!              # always returns array (possibly empty)
  posts(limit: Int, offset: Int): [Post!]!
}

# Mutation -- write operations
type Mutation {
  createPost(title: String!, content: String!): Post!
  updatePost(id: ID!, title: String): Post!
  deletePost(id: ID!): Boolean!
}

# Subscription -- real-time updates via WebSocket
type Subscription {
  newComment(postId: ID!): Comment!
}
```

Note the `!` notation -- one of GraphQL's strongest features. At the schema level, you explicitly indicate whether a field can be null. The client knows this in advance and doesn't write defensive code for every field.

### GraphQL Query -- Client Controls Response Shape

```graphql
# Client requests exactly what's needed for the profile screen
query GetUserProfile {
  user(id: "42") {
    name          # only name, not email, not createdAt
    posts {
      title
      likesCount  # only counter, not content
      comments {
        text
        author {
          name    # only comment author's name
        }
      }
    }
  }
}
```

One query, and the server returns exactly these fields -- no more. This is especially valuable for mobile applications, where every extra byte in the response wastes user traffic.

### The N+1 Problem in GraphQL -- and How DataLoader Solves It

A GraphQL schema allows nested queries of arbitrary depth. This creates a trap that almost all beginners fall into: **N+1 database queries**.

Consider naive resolver implementation:

```typescript
// ❌ Naive resolver -- 1 query for users + N queries for each user's posts
const resolvers = {
  Query: {
    // Step 1: get 100 users -- 1 SQL query
    users: () => db.query('SELECT * FROM users LIMIT 100')
  },
  User: {
    // Step 2: for EACH user GraphQL calls this resolver
    // If 100 users -- 100 separate SQL queries!
    posts: (user) => db.query(
      'SELECT * FROM posts WHERE author_id = ?',
      [user.id]
    )
  }
}
// Total for query { users { name posts { title } } }:
// 1 (users) + 100 (posts for each user) = 101 queries to DB
```

Why does this happen? The GraphQL server executes the resolver for each object independently. When you have an array of 100 Users, the `User.posts` resolver is called 100 times -- once per user.

DataLoader is a library that solves this problem through two mechanisms:

1. **Batching** -- defers all `load(id)` calls until the end of the current event loop tick, then calls the batch function with an array of all IDs at once
2. **Caching** -- if the same ID is requested twice within one query, DataLoader returns the cached result

```mermaid
flowchart LR
  U1["User #1\nresolver"] -->|"load(1)"| DL["DataLoader\n(batch accumulator)"]
  U2["User #2\nresolver"] -->|"load(2)"| DL
  U3["User #3\nresolver"] -->|"load(3)"| DL
  DL -->|"One query:\nSELECT WHERE id IN (1,2,3)"| DB["Database"]
  DB -->|"Array of results"| DL
  DL -->|"posts[1]"| U1
  DL -->|"posts[2]"| U2
  DL -->|"posts[3]"| U3
```

```typescript
// ✅ DataLoader -- batching and caching
import DataLoader from 'dataloader'

// batch function called ONCE with array of all IDs
const postLoader = new DataLoader(async (userIds: readonly string[]) => {
  const posts = await db.query(
    'SELECT * FROM posts WHERE author_id IN (?)',
    [userIds]
  )
  // DataLoader requires returning array in same order as userIds
  return userIds.map(id => posts.filter(p => p.authorId === id))
})

const resolvers = {
  User: {
    // Each call -- just "queue entry"
    // DataLoader batches them into one SQL query
    posts: (user) => postLoader.load(user.id)
  }
}
// Now with 100 users request:
// 1 (users) + 1 (posts WHERE author_id IN (1..100)) = 2 queries
```

**Rule:** in GraphQL, DataLoader is not an optimization, it's a **mandatory architectural element**. Without it, any nested query creates the N+1 problem.

---

## 3. gRPC -- For Inter-Service Communication

### Why gRPC When REST Exists?

REST with JSON is a great choice for public APIs, where compatibility and readability matter. But inside a system of dozens of microservices making thousands of calls per second to each other, JSON becomes a problem:

- JSON is a text format, it needs parsing. Parsing is expensive
- JSON has no schema -- a typo in a field name won't give a compile error
- HTTP/1.1 -- one request/response pair per connection, data streams are inconvenient

gRPC solves all three problems: **Protocol Buffers** (binary format with strict schema) + **HTTP/2** (multiplexing, header compression, bidirectional streams).

### Protobuf -- Contract as Code

```protobuf
// user.proto -- contract definition
// Generator creates typed code in any language
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest) returns (User);                      // Unary
  rpc ListUsers(ListUsersRequest) returns (stream User);           // Server streaming
  rpc UploadAvatar(stream Chunk) returns (UploadResponse);         // Client streaming
  rpc Chat(stream Message) returns (stream Message);               // Bidirectional
}

message GetUserRequest {
  string user_id = 1;   // number = field number in binary format (order matters!)
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  repeated string roles = 5;  // repeated = array
}
```

From this `.proto` file, generators create typed client and server in Go, TypeScript, Python, Java -- any supported language. **One contract, many implementations.** If you rename a field in `.proto` -- the compiler points out all places that need updating.

### Types of gRPC Calls

| Type | Description | Example Use |
|---|---|---|
| Unary | Request-response (like REST) | GetUser, CreateOrder |
| Server streaming | Server sends a stream of data | ListUsers (1000+ results gradually) |
| Client streaming | Client sends a stream of data | File upload in chunks |
| Bidirectional | Two-way stream | Real-time chat, games |

### REST vs gRPC Performance Comparison

Protobuf encoding gives a significant advantage over JSON. For small messages, the win is 2-5x in size and 5-10x in parsing speed. HTTP/2 multiplexing allows keeping one connection for many parallel requests, eliminating HTTP/1.1 head-of-line blocking.

**Limitation:** gRPC doesn't work directly in the browser -- a gRPC-Web proxy is needed (e.g., Envoy). This makes it unsuitable for public browser-facing APIs, but ideal for inter-service calls.

---

## 4. REST vs GraphQL vs gRPC -- Comparison and Selection

### Detailed Comparison

| Criterion | REST | GraphQL | gRPC |
|---|---|---|---|
| **Data format** | JSON (text) | JSON (text) | Protobuf (binary) |
| **Protocol** | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| **Contract** | OpenAPI/Swagger (separate) | Schema SDL (built-in) | .proto file |
| **Typing** | Weak (runtime) | Strong (schema-level) | Strong (protobuf + codegen) |
| **Overfetching** | Common problem | No (client chooses) | No (fixed message) |
| **Underfetching** | Requires multiple requests | No (one request, any nesting) | No (one call) |
| **Streaming** | No native (SSE/WebSocket separately) | Subscriptions (WebSocket) | Built-in (4 modes) |
| **Browser** | Native support | Native support | Needs gRPC-Web proxy |
| **Caching** | HTTP cache out of the box | Complex (one POST endpoint) | No |
| **Documentation** | Swagger UI (separate tool) | GraphiQL/Playground (built-in) | protoc + comments |
| **Learning curve** | Low | Medium | Medium |
| **Ecosystem** | Huge | Large | Growing |

### When to Choose What

```mermaid
flowchart LR
  Start["API Type"] --> PublicAPI{"Public API?"}
  PublicAPI -->|"Yes"| REST["REST\n/v1/users, /v1/orders"]
  PublicAPI -->|"No"| Internal{"Internal"}
  Internal --> ManyClients{"Different clients\nweb/mobile/admin?"}
  ManyClients -->|"Yes"| GraphQL["GraphQL\n+ DataLoader"]
  ManyClients -->|"No"| Perf{"Performance\ncritical?"}
  Perf -->|"Yes"| GRPC["gRPC\nProtobuf + HTTP/2"]
  Perf -->|"No"| REST2["REST\nsimpler to maintain"]
```

**Rule:** REST -- for public API and simple CRUD operations. GraphQL -- when you have multiple client types with different data needs. gRPC -- for high-performance inter-service communication.

---

## 5. Pagination: Offset vs Cursor

### Why Pagination Is Needed at All

When a database has a million records, a query without a limit returns them all. This means: send gigabytes over the network, load them into server memory, serialize to JSON, transfer to the client. In practice -- timeout or OOM crash.

Pagination is a way to split a large data set into manageable parts. There are two fundamentally different approaches.

### Offset-Based Pagination -- Simple, but with Traps

Offset-based pagination works like page numbers in a book: "give me page 3, 20 records per page" = OFFSET 40.

```typescript
// Request
GET /posts?limit=20&offset=40  // Page 3 (0-indexed)

// SQL
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 40

// Response
{
  "data": [...],
  "pagination": {
    "total": 1500,
    "limit": 20,
    "offset": 40,
    "pages": 75,
    "current_page": 3
  }
}
```

User convenience is obvious: you can jump directly to page 50. But this approach has two fundamental drawbacks.

**Problem 1: data shift.** While the user flips pages, data changes. Imagine: user reads page 2. Meanwhile someone publishes a new post that becomes first in the list. The rest of the list shifts by one. The user goes to page 3 -- and sees the last record from page 2 again, as the first on page 3. Or, conversely, a post is deleted -- and the user skips one record.

**Problem 2: performance.** OFFSET in SQL isn't "start from position N," it's "read N records and discard them." With large OFFSET, the database processes a huge number of unnecessary rows:

```sql
-- With offset=10000 the database READS and DISCARDS 10000 rows
-- to return 20 needed ones
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000
```

### Cursor-Based Pagination -- Reliable and Fast

Cursor-based pagination doesn't know the concept of "page." Instead, it remembers the **position of the last element**, from which to continue the selection.

```typescript
// Request first page
GET /posts?limit=20

// Request next page (cursor from previous response)
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==
// cursor -- base64-encoded JSON: { "id": 100 }

// SQL -- WHERE, not OFFSET
SELECT * FROM posts
WHERE id < 100        // cursor decodes to a specific ID
ORDER BY id DESC
LIMIT 20

// Response
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6ODB9",   // { "id": 80 } -- ID of last element
    "prev_cursor": "eyJpZCI6MTAxfQ==",
    "has_more": true
  }
}
```

Why this is better:
- **WHERE id < 100** -- an indexable condition, executes in O(log N), doesn't depend on position
- New posts appearing while the user flips pages don't affect the cursor -- position is fixed in ID
- Cursor is opaque to the client (base64) -- the server can change its internal representation without changing the API

```mermaid
flowchart LR
  Page1["Page 1\nPosts 100-81"] -->|"cursor=80"| Page2["Page 2\nPosts 80-61"]
  Page2 -->|"cursor=60"| Page3["Page 3\nPosts 60-41"]

  NewPost["New post #105\nappeared while\nuser was reading"] -.->|"doesn't affect\ncursor"| Page2
```

### When to Choose What

| Criterion | Offset | Cursor |
|---|---|---|
| **Implementation simplicity** | Simple (page=3) | More complex (opaque cursor) |
| **Skips/duplicates** | Yes (with data changes) | No (bound to specific record) |
| **Performance** | O(offset) -- slow at large offset | O(log N) -- always fast (index) |
| **Arbitrary jump** | Possible (?page=50) | Not possible (only next/prev) |
| **"Total N records" implementation** | Simple (count(*)) | Difficult |
| **When** | Internal admin tools, static data | Feeds, timeline, infinite scroll |

**For public APIs, use cursor-based pagination.** Offset is suitable only for internal tools with relatively static data.

---

## 6. Rate Limiting -- API Protection

### Why Rate Limiting Is Needed

Without Rate Limiting, one client, intentionally or accidentally (bug in retry logic), can send thousands of requests per second and bring down the entire service for everyone else. Rate Limiting is the "bouncer at the club entrance": it lets everyone through, but makes sure nobody occupies the entire floor alone.

```mermaid
flowchart LR
  C1["Client A\n10 req/s"] --> RL["Rate Limiter"]
  C2["Client B (buggy)\n10000 req/s"] --> RL
  C3["Client C\n5 req/s"] --> RL
  RL -->|"C1: OK"| S["API Server"]
  RL -->|"C2: 429\nToo Many Requests"| C2
  RL -->|"C3: OK"| S

  style RL fill:#fff3e0
  style S fill:#c8e6c9
```

Rate Limiting is usually implemented at the API Gateway level or as a separate middleware, not in the business logic of services. This allows applying it centrally.

### Token Bucket -- Most Popular Algorithm

**Analogy:** imagine a bucket with tokens. Tokens drip into the bucket at a constant rate (e.g., 10 per second). Each request takes one token. If the bucket is empty -- the request is rejected with code 429. The bucket has a maximum size (burst) -- this allows the client to "accumulate" tokens and make a short-term burst of requests.

```typescript
class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(
    private rate: number,     // tokens per second (average rate)
    private burst: number     // maximum bucket size (peak rate)
  ) {
    this.tokens = burst       // start with full bucket
    this.lastRefill = Date.now()
  }

  allow(): boolean {
    this.refill()             // first add accumulated tokens
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true             // ✅ Request allowed
    }
    return false              // ❌ Rate limited (429)
  }

  private refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000  // seconds since last refill
    // Add tokens proportional to elapsed time, but not more than burst
    this.tokens = Math.min(this.burst, this.tokens + elapsed * this.rate)
    this.lastRefill = now
  }
}

// Usage: 10 req/s, burst up to 50
const limiter = new TokenBucket(10, 50)
```

Important property of Token Bucket: it allows **burst**. If the client was silent for 5 seconds and then sent 50 requests -- they all pass (burst = 50). After that, the client must wait until the bucket refills.

### Sliding Window -- More Accurate, but Requires Memory

Sliding Window counts all requests within a sliding time window. Unlike Token Bucket, it strictly enforces the limit without burst accumulation.

```typescript
class SlidingWindowLog {
  private requests: number[] = []  // timestamp of each request

  constructor(
    private windowMs: number,       // window size (e.g., 60000 for 1 min)
    private maxRequests: number     // max requests in window
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

**Memory problem:** each client stores a log of all timestamps. With 1000 req/min for 10,000 clients -- that's 10 million records just for one storage level. In practice, **Sliding Window Counter** is used (compromise between accuracy and memory).

### Fixed Window -- Simple, but with a Vulnerability

Fixed Window divides time into fixed windows (every minute) and counts requests in each. Easiest to implement (just a counter), but has a critical vulnerability:

```
                                 window ends here
                                       ↓
Window 1 (00:00-01:00): ............[98 99 100]  -- used entire limit
Window 2 (01:00-02:00): [100 99 98]............  -- new window, limit reset
                       ↑
                In 2 seconds at window boundary: 200 requests!
```

An attacker can deliberately send requests at window boundaries, effectively doubling the limit.

### Algorithm Comparison

| Algorithm | Accuracy | Memory | Burst Protection | Complexity | When to Use |
|---|---|---|---|---|---|
| Token Bucket | High | O(1) | Controlled (burst param) | Simple | Most cases |
| Sliding Window Log | Maximum | O(N requests) | Full | Medium | Critical accuracy |
| Sliding Window Counter | High | O(1) | Good | Medium | Accuracy/memory balance |
| Fixed Window | Low | O(1) | Weak (window boundary) | Minimal | Simple internal APIs |

### HTTP Rate Limiting Headers

A good API communicates limits to clients in response headers:

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000          -- max requests in window
X-RateLimit-Remaining: 847       -- remaining in current window
X-RateLimit-Reset: 1710500000    -- when limit resets (Unix timestamp)

HTTP/1.1 429 Too Many Requests
Retry-After: 30                  -- seconds until retry possible
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710500030
```

---

## 7. API Authentication

### JWT (JSON Web Token) -- Stateless Identification

JWT allows the server to verify a client's identity without querying the database. The secret is in the **cryptographic signature**: the server signed the token with its secret key when issuing it, and can verify the signature on every request.

JWT structure:

```
JWT = Header.Payload.Signature

Header:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
           { "alg": "HS256", "typ": "JWT" }

Payload:   eyJzdWIiOiI0MiIsIm5hbWUiOiJJdmFuIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzEwNTAwMDAwfQ
           { "sub": "42", "name": "Ivan", "role": "admin", "exp": 1710500000 }

Signature: HMAC-SHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

Payload is open (base64, not encryption!) -- the client can read it. But it can't **modify** it -- the signature would break. The server verifies the signature without querying the DB:

```typescript
// Client sends token in Authorization header
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.signature

// Server: verify signature in ~1ms, no DB query
const payload = jwt.verify(token, SECRET_KEY)
// { sub: '42', name: 'Ivan', role: 'admin', exp: 1710500000 }
// If signature is invalid or token expired -- jwt.verify throws an error
```

**Important JWT limitation:** a token can't be "revoked" before expiration. If an administrator blocks a user -- their JWT will work until exp. Solutions: short lifetime (15 minutes) + refresh tokens, or a token blacklist in Redis.

### OAuth2 Authorization Code Flow -- Delegated Access

OAuth2 isn't just authentication, it's **authorization**: the user allows an application limited access to their resources on another service. The familiar "Sign in with Google" button is OAuth2.

```mermaid
sequenceDiagram
  participant U as User
  participant A as App (Client)
  participant AS as Auth Server (Google)
  participant R as Resource Server (API)

  U->>A: Clicks "Sign in with Google"
  A->>AS: Redirect: /authorize?client_id=X&scope=email,profile&redirect_uri=Y
  AS->>U: Shows: "App wants access to email and profile. Allow?"
  U->>AS: Clicks "Allow"
  AS->>A: Redirect to callback?code=AUTH_CODE (one-time, lives 10 minutes)
  A->>AS: POST /token (code + client_secret) -- server-to-server, code not in URL
  AS->>A: { access_token, refresh_token, expires_in }
  A->>R: GET /api/userinfo + Authorization: Bearer access_token
  R->>A: { email: "ivan@gmail.com", name: "Ivan" }
```

Why such a complex flow? Because `code` is passed via redirect in the URL (can end up in browser logs), while `client_secret` never leaves the server. The code-to-token exchange happens server-to-server, where HTTPS guarantees confidentiality.

### API Keys -- For Service-to-Service

API Keys are the simplest authentication method: generate a long random key and pass it with every request.

```typescript
// Client sends key in header
GET /api/weather?city=Moscow
X-API-Key: sk_live_abc123def456

// Server checks key in DB (ONE DB query per API request)
const client = await db.query(
  'SELECT * FROM api_keys WHERE key_hash = ?',
  [hash(apiKey)]  // store hash, not the key itself!
)
if (!client) return res.status(401).json({ error: 'Invalid API key' })
if (client.rateLimit.exceeded) return res.status(429).json({ error: 'Rate limit exceeded' })
```

**Security:** never store API keys in plain text. Store their SHA-256 hash. The key is displayed to the user only once at creation.

### Authentication Method Comparison

| Method | Stateless? | Token Revocation | Granular Permissions | When |
|---|---|---|---|---|
| JWT | Yes | Only via Redis blacklist | Roles in payload | SPAs, mobile apps, internal APIs |
| OAuth2 | Depends on impl | Via revocation endpoint | Scopes (read, write, admin) | Third-party service integration |
| API Key | No (DB lookup) | Delete from DB | By key / roles in DB | B2B API, S2S communication |
| Session cookies | No | Immediate | By session in DB | Traditional web apps |

---

## 8. Idempotency Keys

### The Problem: Unreliable Networks and Retry

Networks are unreliable. Client sent POST /payments, waiting for response -- and gets a timeout. What happened?

**Option A:** request didn't arrive. Payment wasn't created. Need to retry.

**Option B:** request arrived, payment created, but response was lost. Retry -- creates a second payment.

Without additional mechanisms, the client can't distinguish these scenarios. Method idempotency helps for GET/PUT/DELETE. But POST is inherently non-idempotent.

```mermaid
flowchart LR
  Client["Client"] -->|"POST /payments\nIdempotency-Key: pay_123"| Server["Server"]
  Server -->|"Timeout!"| Client
  Client -->|"RETRY:\nPOST /payments\nIdempotency-Key: pay_123"| Server
  Server -->|"Same key!\nReturn cached,\ndon't create payment again"| Client

  style Server fill:#c8e6c9
```

### Idempotency Keys Implementation

```typescript
// Client generates UUID for each unique operation
POST /api/payments
Idempotency-Key: pay_550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "amount": 5000,
  "currency": "RUB",
  "recipient": "merchant_42"
}
```

```typescript
async function handlePayment(req: Request, res: Response) {
  const idempotencyKey = req.headers['idempotency-key']

  if (!idempotencyKey) {
    return res.status(400).json({ error: 'Idempotency-Key header required' })
  }

  // Step 1: check if this operation was already processed
  const cached = await redis.get(`idempotency:${idempotencyKey}`)
  if (cached) {
    // Return saved response -- no business logic
    return res.status(200).json(JSON.parse(cached))
  }

  // Step 2: mark operation as "in progress" (protection from parallel retries)
  const lock = await redis.set(
    `idempotency:${idempotencyKey}`,
    'PROCESSING',
    'NX',   // only if doesn't exist
    'EX',   // with TTL
    30      // 30 seconds -- max processing time
  )
  if (!lock) {
    return res.status(409).json({ error: 'Operation in progress' })
  }

  // Step 3: execute the operation
  const result = await processPayment(req.body)

  // Step 4: save result (TTL 24 hours for retry)
  await redis.set(
    `idempotency:${idempotencyKey}`,
    JSON.stringify(result),
    'EX',
    86400
  )

  return res.status(201).json(result)
}
```

**Rule:** all non-idempotent operations with real consequences (creating payment, sending email, creating order) **must** support idempotency keys.

---

## 9. API Versioning

### Why APIs Change and How Not to Break Clients

APIs evolve. Business requirements change, better data structure understanding arrives, new fields need adding. All of these are **breaking changes** if not managed.

Breaking change -- any change that requires existing clients to change their code:
- Renaming a field (`name` → `firstName`)
- Changing a field type (number → string)
- Removing a field or endpoint
- Changing semantics (field now means something different)

Non-breaking changes can be made to the existing version:
- Adding a new optional field to the response
- Adding a new endpoint
- Adding a new optional request parameter

### Versioning Strategies

| Strategy | Example | Pros | Cons |
|---|---|---|---|
| **URL path** | `/v1/users`, `/v2/users` | Obvious, easy to route and test | Code duplication, URL pollution |
| **Accept header** | `Accept: application/vnd.api.v2+json` | Clean URLs | Inconvenient to test in browser |
| **Query param** | `/users?version=2` | Simple to add | Caching harder, URL pollution |
| **Custom header** | `API-Version: 2` | Clean URLs | Non-standard, harder to document |

```typescript
// URL path (most popular and recommended)
GET /v1/users/42
// Response v1: { "id": 42, "name": "Ivan Petrov" }

GET /v2/users/42
// Response v2: { "id": 42, "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
// name left for backward compatibility of v1 clients that may migrate
```

### Version Lifecycle Management

```mermaid
flowchart LR
  Active["Active\n(supported)"] -->|"Deprecation announced\n6+ months ahead"| Deprecated["Deprecated\n(works but with warning)"]
  Deprecated -->|"Sunset date\narrived"| Sunset["Sunset\n(endpoint returns 410 Gone)"]
  Sunset -->|"After 30 days"| Removed["Removed\n(endpoint doesn't exist)"]
```

```typescript
// Deprecated endpoint -- warn clients via headers
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Link: </v2/users>; rel="successor-version"
Warning: 299 - "This endpoint is deprecated and will be removed on 2026-01-01"
```

**Best practices for versioning:**
- Use URL versioning (`/v1/`, `/v2/`)
- Support at least 2 versions simultaneously
- Give Deprecation notice 6+ months in advance
- Monitor traffic to old versions -- while there are requests, there are clients
- Use Sunset header from RFC 8594

---

## 10. API Gateway and BFF Pattern

### API Gateway -- Single Entry Point

In a microservice architecture, each service has its own API. Without a centralized entry point, each client must know all service addresses, implement authentication with each one, handle different response formats.

API Gateway centralizes **cross-cutting concerns** -- functionality needed by all services but not related to business logic:

- Authentication and authorization (verify JWT before request reaches the service)
- Rate limiting (one protection layer for all services)
- SSL termination (HTTPS outside, HTTP inside)
- Logging and tracing (correlation ID for all requests)
- Load balancing between service instances
- Routing (which path to which service)
- Request/response transformation

### BFF (Backend for Frontend) -- Specialized APIs for Each Client

BFF is a pattern where a separate backend is created for each client type, optimized for its needs. The mobile app needs compact data and minimal traffic. The web app needs full data and rich UI. Admin panels need all data plus metrics.

Without BFF, there are two bad options:
1. **One "fat" API** -- returns all fields for all clients, mobile client gets excess
2. **N endpoints in each service** -- each service knows about different client types, business logic is diluted

```mermaid
flowchart LR
  M["Mobile App"] --> BFF_M["BFF Mobile\ncompact responses"]
  W["Web App"] --> BFF_W["BFF Web\nfull data"]
  A["Admin Panel"] --> BFF_A["BFF Admin\ndata + metrics"]

  BFF_M --> GW["API Gateway\n(auth, rate limit, routing, logging)"]
  BFF_W --> GW
  BFF_A --> GW

  GW --> US["User Service"]
  GW --> OS["Order Service"]
  GW --> PS["Product Service"]
  GW --> AS["Analytics Service"]
  GW --> NS["Notification Service"]

  style GW fill:#fff3e0
  style BFF_M fill:#e3f2fd
  style BFF_W fill:#e3f2fd
  style BFF_A fill:#e3f2fd
```

```typescript
// BFF Mobile -- minimal data, optimized for mobile network
app.get('/mobile/feed', async (req, res) => {
  const [posts, user] = await Promise.all([
    productService.getTopPosts({ limit: 10 }),
    userService.getBasicProfile(req.userId)
  ])

  // Aggregate, transform, minimize response size
  res.json({
    user: { name: user.name, avatar: user.avatarSmall },  // small avatar
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      thumbnail: p.imageSm   // small image for mobile network
      // no content, no comments -- not needed for card view
    }))
  })
})

// BFF Web -- full data for rich UI
app.get('/web/feed', async (req, res) => {
  // Parallel requests -- Promise.all, not sequential
  const [posts, user, notifications, analytics] = await Promise.all([
    productService.getPosts({ limit: 20, includeComments: true }),
    userService.getFullProfile(req.userId),
    notificationService.getUnread(req.userId),
    analyticsService.getUserStats(req.userId)
  ])

  res.json({ user, posts, notifications, analytics })
})
```

**When to apply BFF:** when you have more than one client type with substantially different data requirements. For simple cases (one web client), BFF adds complexity without clear benefits.

---

## Common Mistakes

### Mistake 1: Verbs in URLs Instead of Nouns

The most common mistake for developers transitioning from RPC thinking to REST. The URL should name the **resource** (noun), and the action on it -- the **HTTP method**.

```typescript
// ❌ RPC style -- URL describes action
POST /getUser?id=42
POST /createOrder
POST /deleteUser?id=42
POST /updateUserEmail
GET  /getUserOrders?userId=42
```

```typescript
// ✅ RESTful -- URL describes resource, HTTP method describes action
GET    /users/42                      // get user
POST   /orders                        // create order
DELETE /users/42                      // delete user
PATCH  /users/42   { "email": "..." } // update email
GET    /users/42/orders               // user's orders
```

### Mistake 2: No Pagination on Lists

```typescript
// ❌ Return ALL records -- kills server with a million records
GET /posts
// Response: array of 1,000,000 posts, 500MB JSON
```

```typescript
// ✅ Always paginate + reasonable default limit
GET /posts?limit=20&cursor=abc123

// In code: enforce maximum limit server-side
const limit = Math.min(parseInt(req.query.limit) || 20, 100)  // no more than 100
```

### Mistake 3: No Idempotency Key on POST Requests with Side Effects

```typescript
// ❌ Client retries after timeout → double payment
POST /payments  { "amount": 5000 }
// Timeout → retry →
POST /payments  { "amount": 5000 }
// = 10,000 rubles charged instead of 5,000!
```

```typescript
// ✅ Idempotency key prevents duplicates
POST /payments
Idempotency-Key: pay_uuid_abc123
{ "amount": 5000 }
// Retry with same key → server returns cache, doesn't create new payment
```

### Mistake 4: Breaking Changes Without Versioning

```typescript
// ❌ v1: name field -- string. 100 clients depend on this
{ "name": "Ivan Petrov" }

// 3 months later: field split into two WITHOUT versioning
{ "firstName": "Ivan", "lastName": "Petrov" }
// All clients reading user.name get undefined
```

```typescript
// ✅ New version + backward compatibility during transition
// GET /v1/users/42 -- still returns name (don't break old clients)
{ "name": "Ivan Petrov" }

// GET /v2/users/42 -- new format
{ "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
//                                            ↑
//                             name left for clients still migrating
```

### Mistake 5: GraphQL Without N+1 Solution

```typescript
// ❌ Query looks innocent...
query { users { name posts { title } } }

// ...but for 100 users causes 101 DB queries
// User.posts resolver fires 100 times independently
```

```typescript
// ✅ DataLoader batches all requests in one event loop tick
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.query('SELECT * FROM posts WHERE author_id IN (?)', [userIds])
  return userIds.map(id => posts.filter(p => p.authorId === id))
})
// 100 users → 2 queries to DB (users + posts WHERE author_id IN (...))
```

### Mistake 6: Useless Error Messages

```typescript
// ❌ Client doesn't understand what to fix
HTTP/1.1 400 Bad Request
{ "error": "Bad request" }

// ❌ Too many technical details in public API
HTTP/1.1 500 Internal Server Error
{ "error": "NullPointerException at com.example.UserService:42" }
```

```typescript
// ✅ Structured errors with code, message, and details
HTTP/1.1 422 Unprocessable Entity
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "must be a valid email address" },
      { "field": "age", "message": "must be a positive integer" }
    ]
  }
}
```

### Mistake 7: Inconsistent HTTP Response Codes

```typescript
// ❌ Unpredictable status codes
POST /users → 200 (created)
DELETE /users/42 → 200 (deleted, body: "OK")
GET /users/999 → 200 (not found, body: { "error": "not found" })
```

```typescript
// ✅ Semantically correct codes
POST /users          → 201 Created     (new resource created)
DELETE /users/42     → 204 No Content  (successfully deleted, no body)
GET /users/999       → 404 Not Found   (resource doesn't exist)
GET /users/42        → 200 OK          (resource found)
PUT /users/42        → 200 OK          (resource updated)
POST /payments (dup) → 409 Conflict    (idempotency key conflict)
```

---

## Summary

| Concept | Key Takeaway |
|---|---|
| **REST (Level 2)** | Resources + HTTP verbs + status codes -- de-facto standard for public APIs |
| **HATEOAS (Level 3)** | Beautiful in theory, rarely useful in practice. Stop at Level 2 |
| **GraphQL** | Client chooses fields. Solves over/underfetching. DataLoader -- mandatory |
| **gRPC** | Protobuf + HTTP/2. For inter-service calls -- 2-10x faster than REST |
| **Cursor pagination** | Stable (no duplicates) and fast O(log N). For feeds -- always cursor |
| **Token Bucket** | Balance of accuracy, memory, and burst support. Best choice for most cases |
| **JWT** | Stateless, doesn't need DB. Short lifetime + refresh tokens |
| **OAuth2** | Authorization code flow for delegated access through a third party |
| **Idempotency key** | Operation UUID from client. Duplicate protection on retry. Required for payments |
| **URL versioning** | `/v1/`, `/v2/`. Sunset notice 6+ months. Monitor traffic |
| **API Gateway** | Single entry: auth, rate limit, logging, routing. Frees services from cross-cutting concerns |
| **BFF Pattern** | Separate backend per client type. Optimizes data for specific needs |

**Main principle:** API is a contract. Contracts are broken only with good reason, in advance, with warning, and a coexistence period. Design as if your API will be used by thousands of teams you'll never meet -- make it obvious, stable, and hard to break.
