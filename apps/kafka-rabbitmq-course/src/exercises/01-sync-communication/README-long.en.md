# Level 1: Synchronous Communication — Detailed Theory

## 1. HTTP Evolution: From 1.0 to 3.0

### HTTP/1.0 — One Connection Per Request

The very first version: each request opened a new TCP connection, got a response, and closed it. The costs of TCP handshake (3-way: SYN → SYN-ACK → ACK) accounted for 1-2 RTT before the first byte of data.

```
Client                     Server
  |──── TCP SYN ──────────→|
  |←─── TCP SYN-ACK ───────|
  |──── TCP ACK ──────────→|
  |──── GET /index.html ──→|   ← Only now the request
  |←─── 200 OK + body ─────|
  |──── TCP FIN ──────────→|   ← Close connection
```

A page with 30 resources = 30 TCP handshakes = enormous delays.

### HTTP/1.1 — Keep-Alive and Pipelining

Added `Connection: keep-alive` — the connection stays open. But **head-of-line blocking**: responses must arrive strictly in order. If the first request is slow — all others wait.

```
HTTP/1.1 Keep-Alive:
┌──────────────────────────────────────────────┐
│ REQ1 → RSP1 → REQ2 → RSP2 → REQ3 → RSP3     │
│ (sequential, head-of-line blocking)           │
└──────────────────────────────────────────────┘

Pipelining (rarely works in practice):
┌──────────────────────────────────────────────┐
│ REQ1 REQ2 REQ3 → RSP1 RSP2 RSP3              │
│ (responses still in queue order!)             │
└──────────────────────────────────────────────┘
```

### HTTP/2 — Multiplexing and Binary Protocol

HTTP/2 switches to a binary format (frames) and adds **streams** — virtual channels within a single TCP connection. Each request gets a stream ID.

```
HTTP/2 Multiplexing (one TCP, many streams):
┌─────────────────────────────────────────────────────┐
│ Stream 1: [DATA][DATA][DATA]──────────────── RSP1   │
│ Stream 3: [DATA]────────────────── RSP3             │
│ Stream 5: [DATA][DATA]─────── RSP5                  │
└─────────────────────────────────────────────────────┘
```

**Other HTTP/2 improvements:**
- **Header compression (HPACK)** — headers are compressed, identical headers aren't repeated
- **Server Push** — server can send resources before the client requests them
- **Stream prioritization** — you can specify stream priority

💡 gRPC is built on HTTP/2, so it gets all these capabilities for free.

### HTTP/3 — Based on QUIC

HTTP/3 replaces TCP with **QUIC** (UDP + reliability). The problem with HTTP/2 — TCP head-of-line blocking at the transport level: if one packet is lost, all streams wait.

```
HTTP/2 over TCP:         HTTP/3 over QUIC (UDP):
┌──────────────┐         ┌──────────────────────┐
│ TCP stream   │         │ Independent streams   │
│ S1 S2 S3 S4  │         │ S1 S2 S3 S4           │
│  ↑ packet    │         │  ↑ only S2 retransmit │
│    loss →    │         │    S1,S3,S4 continue  │
│  ALL wait    │         └──────────────────────┘
└──────────────┘
```

QUIC also embeds TLS 1.3 directly in the handshake: 0-RTT connection for repeat connections.

---

## 2. REST: Fielding's Constraints

REST was described by Roy Fielding in his 2000 dissertation as a set of 6 constraints:

### 1. Client-Server

Separation of concerns: client handles UI, server handles data. They can evolve independently.

### 2. Stateless

Each request contains all the information needed to process it. The server doesn't store state between requests.

```typescript
// ❌ Stateful: server remembers context
// Request 1: POST /login → server creates session
// Request 2: GET /profile → server uses session
// If server restarts — state is lost

// ✅ Stateless: each request is self-sufficient
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MiJ9...
// JWT token contains userId, server stores nothing
```

### 3. Cacheable

Responses must be marked as cacheable or not. GET requests are cacheable, POST/PUT/DELETE are not.

```http
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ETag: "a1b2c3d4"
```

### 4. Uniform Interface

Uniform interface: URI identifies the resource, representation is separated from the resource, HATEOAS (hypermedia).

```json
// HATEOAS example:
{
  "id": "order-123",
  "status": "pending",
  "_links": {
    "confirm": { "href": "/orders/123/confirm", "method": "POST" },
    "cancel": { "href": "/orders/123/cancel", "method": "POST" },
    "self": { "href": "/orders/123", "method": "GET" }
  }
}
```

### 5. Layered System

The client doesn't know whether it's talking directly to the server or through a proxy, load balancer, or CDN.

### 6. Code on Demand (optional)

The server can send executable code (JavaScript). Rarely used.

**📌 Important:** Most "REST APIs" are not REST in Fielding's sense — they're HTTP APIs. True REST assumes HATEOAS, which is rarely implemented.

---

## 3. gRPC: Streaming Types

gRPC supports 4 types of RPC calls:

### 3.1 Unary RPC — Request-Response

Classic: one request, one response. Like HTTP.

```protobuf
service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}
```

```
Client ──── GetUserRequest ──── Server
Client ──── User ←───────────── Server
```

### 3.2 Server Streaming

The client sends one request, the server sends a stream of responses.

```protobuf
service OrderService {
  rpc WatchOrderUpdates(WatchRequest) returns (stream OrderUpdate);
}
```

```
Client ──── WatchRequest ──────────────→ Server
Client ←─── OrderUpdate (status=pending) Server
Client ←─── OrderUpdate (status=paid)    Server
Client ←─── OrderUpdate (status=shipped) Server
Client ←─── EOF ─────────────────────── Server
```

Use cases: real-time updates, file upload progress, live logs.

### 3.3 Client Streaming

The client sends a stream of data, the server responds with one message.

```protobuf
service AnalyticsService {
  rpc RecordEvents(stream Event) returns (RecordSummary);
}
```

```
Client ──── Event(click) ────────────→ Server
Client ──── Event(page_view) ────────→ Server
Client ──── Event(purchase) ─────────→ Server
Client ──── EOF ─────────────────────→ Server
Client ←─── RecordSummary(count=3) ─── Server
```

Use cases: batch data upload, sensor data recording.

### 3.4 Bidirectional Streaming

Both streams are open simultaneously. Order is independent.

```protobuf
service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}
```

```
Client ──── "Hello" ──────────────→ Server
Client ←─── "Hi there!" ──────────── Server
Client ──── "How are you?" ───────→ Server
Client ←─── "Fine, thanks!" ──────── Server
```

---

## 4. Protobuf Encoding

Each field in protobuf is encoded as `[field_tag][value]`.

```protobuf
message User {
  string id    = 1;  // field number 1
  string name  = 2;  // field number 2
  int32  age   = 3;  // field number 3
}
```

**Field tag** = `(field_number << 3) | wire_type`

Wire types:
| Wire Type | Meaning |
|-----------|---------|
| 0 | Varint (int32, bool, enum) |
| 1 | 64-bit (double, fixed64) |
| 2 | Length-delimited (string, bytes, embedded message) |
| 5 | 32-bit (float, fixed32) |

```
User { id: "usr_42", name: "Alice", age: 30 }

0x0A 06 75 73 72 5F 34 32  // field 1 (string), len=6, "usr_42"
0x12 05 41 6C 69 63 65      // field 2 (string), len=5, "Alice"
0x18 1E                      // field 3 (varint), value=30

Total: 15 bytes

JSON: {"id":"usr_42","name":"Alice","age":30} = 42 bytes
```

**Backward compatibility:** fields are identified by numbers, not names. Renaming a field doesn't break compatibility. Adding new fields is safe (old clients ignore them).

📌 **Never change a field number** — it breaks all existing data.

---

## 5. Service Mesh

Service Mesh is an infrastructure layer for managing inter-service communication. Instead of implementing retry, timeout, and circuit breaker in each service — all of this is offloaded to a sidecar proxy.

```mermaid
graph LR
  SA[Service A] --> PA[Proxy Sidecar A]
  PA -->|mTLS, retry, timeout| PB[Proxy Sidecar B]
  PB --> SB[Service B]
  PA --> CP[Control Plane]
  PB --> CP
```

**Istio** — the most popular service mesh:
- Uses **Envoy** as the data plane (sidecar)
- **Pilot** manages configuration
- mTLS between all services
- Distributed tracing via Jaeger/Zipkin

**Linkerd** — a lighter alternative:
- Written in Rust (Linkerd2-proxy)
- Fewer resources, simpler setup
- Well-integrated with Kubernetes

```yaml
# Istio: VirtualService with retry and timeout
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: user-service
spec:
  http:
  - timeout: 5s
    retries:
      attempts: 3
      perTryTimeout: 2s
    route:
    - destination:
        host: user-service
```

---

## 6. Circuit Breaker: In Detail

Circuit Breaker was first described by Michael Nygard in "Release It!" (2007).

### State Machine

```mermaid
graph LR
  C[CLOSED] -->|failures >= threshold| O[OPEN]
  O -->|timeout expired| H[HALF-OPEN]
  H -->|probe success| C
  H -->|probe failure| O
```

### Implementation with Metrics

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number    // % errors to open (e.g., 50%)
  successThreshold: number    // successes to close from half-open
  timeout: number             // ms before transitioning from open to half-open
  volumeThreshold: number     // minimum requests to calculate percentage
}

class CircuitBreaker {
  private state: 'closed' | 'open' | 'half-open' = 'closed'
  private failures = 0
  private successes = 0
  private total = 0
  private lastFailureTime = 0

  async execute<T>(command: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.config.timeout) {
        this.state = 'half-open'
      } else {
        throw new CircuitOpenError('Circuit breaker is OPEN')
      }
    }

    try {
      const result = await command()
      this.recordSuccess()
      return result
    } catch (error) {
      this.recordFailure()
      throw error
    }
  }

  private recordSuccess() {
    this.successes++
    this.total++
    if (this.state === 'half-open' && this.successes >= this.config.successThreshold) {
      this.state = 'closed'
      this.reset()
    }
  }

  private recordFailure() {
    this.failures++
    this.total++
    this.lastFailureTime = Date.now()
    if (
      this.total >= this.config.volumeThreshold &&
      (this.failures / this.total) * 100 >= this.config.failureThreshold
    ) {
      this.state = 'open'
    }
  }
}
```

### Hystrix and Resilience4j

**Hystrix** (Netflix, deprecated) — the first popular JVM implementation. Uses separate thread pools for isolation.

**Resilience4j** — modern replacement for Hystrix in Java:
```java
CircuitBreakerConfig config = CircuitBreakerConfig.custom()
  .failureRateThreshold(50)
  .waitDurationInOpenState(Duration.ofSeconds(30))
  .build();

CircuitBreaker cb = CircuitBreakerRegistry.of(config)
  .circuitBreaker("user-service");

Supplier<User> decorated = CircuitBreaker.decorateSupplier(cb,
  () -> userServiceClient.getUser(userId));
```

---

## 7. Bulkhead Pattern

Bulkhead — resource isolation so that failure in one part doesn't sink the entire ship. A pattern borrowed from shipbuilding.

```typescript
// ❌ Without Bulkhead: one slow service consumes all threads
class ServiceClient {
  private pool = new ThreadPool(100) // Shared pool

  callUserService() { this.pool.submit(userRequest) }
  callOrderService() { this.pool.submit(orderRequest) }
  // If UserService is slow — all 100 threads are busy with it
  // OrderService can't get a thread → entire system fails
}

// ✅ With Bulkhead: separate pools
class ServiceClient {
  private userPool  = new ThreadPool(30)  // Isolated pool
  private orderPool = new ThreadPool(30)
  private paymentPool = new ThreadPool(20)

  // UserService slowness doesn't affect OrderService
}
```

In Kubernetes, Bulkhead is implemented through **Resource Quotas** and **Limit Ranges** — separate namespaces with CPU/RAM limits.

---

## 8. Timeout Strategies

### Timeout Types

```
Connection Timeout — time to wait for TCP connection
│
├─── Read Timeout — time to wait for the first byte of data
│
└─── Total Timeout — maximum time for the entire request
```

### Timeout Budget (Deadline Propagation)

Classic problem: if the outer timeout is 30 seconds, each inner service sets its own 30 seconds — the cascade of timeouts exceeds the expected time.

Solution — **deadline propagation**: pass the remaining time in a header.

```typescript
// gRPC automatically propagates deadline
const deadline = new Date(Date.now() + 5000) // 5 seconds for everything
const client = new UserServiceClient(address, credentials)
client.getUser({ userId: '42' }, { deadline }, callback)
// If there's a nested gRPC call inside — deadline is already shorter

// REST — manually
const remainingTime = deadline - Date.now()
await fetch('/internal/users/42', {
  headers: { 'X-Deadline-Ms': String(remainingTime) },
  signal: AbortSignal.timeout(remainingTime),
})
```

---

## 9. Retry with Jitter

Simple retry without jitter creates a **thundering herd**: all clients retry simultaneously at the same interval, creating peak load.

```
Without jitter:
t=0s:   REQ REQ REQ REQ REQ  → all fail
t=1s:   REQ REQ REQ REQ REQ  → peak again
t=2s:   REQ REQ REQ REQ REQ  → again...

With jitter:
t=0s:   REQ REQ REQ REQ REQ  → fail
t=0.8s: REQ
t=1.1s:     REQ REQ
t=1.4s:             REQ
t=1.9s:                 REQ  → even load
```

```typescript
type RetryStrategy = 'fixed' | 'exponential' | 'exponential-jitter'

async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number
    strategy: RetryStrategy
    baseDelay: number
    maxDelay?: number
  }
): Promise<T> {
  for (let attempt = 0; attempt < options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      if (attempt === options.maxAttempts - 1) throw error

      let delay: number
      switch (options.strategy) {
        case 'fixed':
          delay = options.baseDelay
          break
        case 'exponential':
          delay = options.baseDelay * 2 ** attempt
          break
        case 'exponential-jitter':
          // Full jitter: random point in [0, exponentialMax]
          delay = Math.random() * Math.min(
            options.baseDelay * 2 ** attempt,
            options.maxDelay ?? 30000
          )
          break
      }

      await new Promise(r => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}
```

AWS recommends **Full Jitter** as the most effective approach for even load distribution.

---

## 10. Service Discovery

### Client-Side vs Server-Side

**Client-Side Discovery:**

```mermaid
graph LR
  A[Service A] -->|1. lookup| R[Registry: Consul/Eureka]
  R -->|2. instances list| A
  A -->|3. round-robin| B1[Service B :8001]
  A -->|3. round-robin| B2[Service B :8002]
```

The client chooses the instance itself. Advantage: fewer network hops, client controls load balancing. Disadvantage: discovery logic in every service.

**Server-Side Discovery:**

```mermaid
graph LR
  A[Service A] -->|request| LB[Load Balancer / Nginx]
  LB -->|lookup| R[Registry]
  LB --> B1[Service B :8001]
  LB --> B2[Service B :8002]
```

The client talks to a load balancer, which decides where to route. Advantage: client is simple. Disadvantage: extra hop.

### Consul

Consul by HashiCorp — a popular service registry with health checks.

```json
// Registering a service in Consul
{
  "service": {
    "name": "user-service",
    "id": "user-service-001",
    "address": "10.0.0.1",
    "port": 8080,
    "tags": ["v1", "primary"],
    "check": {
      "http": "http://10.0.0.1:8080/health",
      "interval": "10s",
      "timeout": "3s",
      "deregisterCriticalServiceAfter": "30s"
    }
  }
}
```

### Kubernetes DNS (built-in)

In Kubernetes, every Service gets a DNS name automatically:

```
<service-name>.<namespace>.svc.cluster.local

user-service.production.svc.cluster.local → ClusterIP
```

kube-dns / CoreDNS resolves the name to the service IP. Kubernetes Endpoints update automatically when Pods change.

```yaml
# Service automatically registers in DNS
apiVersion: v1
kind: Service
metadata:
  name: user-service
spec:
  selector:
    app: user-service
  ports:
    - port: 80
      targetPort: 8080
# Available as: http://user-service or user-service.default.svc.cluster.local
```

---

## 11. GraphQL in Microservices

GraphQL is a query language for APIs. The client requests exactly the data it needs.

```graphql
# REST: need multiple requests
GET /users/42          → all user info (excessive)
GET /orders?userId=42  → all orders

# GraphQL: one request, only needed fields
query {
  user(id: "42") {
    name
    email
    orders(last: 5) {
      id
      status
      total
    }
  }
}
```

**GraphQL Federation** — for microservices. Each service publishes its part of the schema, the **Gateway** combines them into a unified graph.

```
User Service:    type User { id, name, email }
Order Service:   type Order { id, userId, total }
                 extend type User { orders: [Order] }  ← Federation extension

Gateway:         combines schemas, executes query plan
```

⚠️ **GraphQL is not a panacea:** N+1 problem (DataLoader), complex caching, overhead for simple CRUD APIs. Fits well when there are many clients with different needs (mobile, web, partners).

---

## 12. Comparison: REST vs gRPC vs GraphQL

| Criterion | REST | gRPC | GraphQL |
|----------|------|------|---------|
| Transport | HTTP/1.1 + HTTP/2 | HTTP/2 | HTTP/1.1 + HTTP/2 |
| Format | JSON (text) | Protobuf (binary) | JSON (text) |
| Contract | OpenAPI (optional) | .proto (required) | Schema (required) |
| Streaming | Limited | Native | Subscriptions |
| Browser | ✅ Native | ⚠️ grpc-web | ✅ Native |
| Performance | Medium | High | Medium |
| Debugging | ✅ curl/browser | ⚠️ grpcurl | ⚠️ GraphiQL |
| Versioning | /v1/, /v2/ | Backward compat | @deprecated |
| Best for | Public API | Internal services | BFF, many clients |

### Practical Rule

```
Public API for external developers → REST
Internal service-to-service        → gRPC
BFF for different client types     → GraphQL
Real-time, IoT, streaming          → gRPC or WebSocket
```

---

## ⚠️ Common Beginner Mistakes

### ❌ Mistake 1: Synchronicity Everywhere

```
// ❌ Anti-pattern: synchronous chain on every button click
User clicks "Place Order"
→ Order Service (sync)
  → Inventory Service (sync)
    → Payment Service (sync) [can take 3-5 sec]
      → Notification Service (sync)
        → Analytics Service (sync)

// If Notification is down → order isn't created!
// If Analytics is slow → user waits

// ✅ Separate what MUST be sync (payment)
// from what can be async (notification, analytics)
```

### ❌ Mistake 2: No Circuit Breaker in Production

```typescript
// ❌ Direct call without protection
async function getUserOrders(userId: string) {
  const user = await userService.getUser(userId)       // can hang
  const orders = await orderService.getOrders(userId)  // also
  return { user, orders }
}

// ✅ With Circuit Breaker
const userCB = new CircuitBreaker(userService.getUser, { timeout: 2000 })
const orderCB = new CircuitBreaker(orderService.getOrders, { timeout: 2000 })

async function getUserOrders(userId: string) {
  const [user, orders] = await Promise.allSettled([
    userCB.execute(() => userService.getUser(userId)),
    orderCB.execute(() => orderService.getOrders(userId)),
  ])
  // Partial response is better than total failure
  return {
    user: user.status === 'fulfilled' ? user.value : null,
    orders: orders.status === 'fulfilled' ? orders.value : [],
  }
}
```

### ❌ Mistake 3: Ignoring Idempotency on Retry

```typescript
// ❌ Retry POST creates duplicates
async function createOrder(order: Order) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch('/orders', { method: 'POST', body: JSON.stringify(order) })
    } catch { /* retry */ }
  }
}
// If the first request arrived but the response was lost → order created twice!

// ✅ Idempotency Key
async function createOrder(order: Order) {
  const idempotencyKey = generateUUID() // once before retry loop
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'Idempotency-Key': idempotencyKey }, // server deduplicates
      })
    } catch { /* retry with the same key */ }
  }
}
```

### ❌ Mistake 4: No Health Check Endpoint

```typescript
// ❌ No health check → load balancer doesn't know about problems

// ✅ Implement a /health endpoint
app.get('/health', async (req, res) => {
  const checks = await Promise.allSettled([
    db.ping(),
    redis.ping(),
    externalApi.healthCheck(),
  ])

  const allHealthy = checks.every(c => c.status === 'fulfilled')
  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks: {
      database: checks[0].status,
      cache: checks[1].status,
      externalApi: checks[2].status,
    },
    timestamp: new Date().toISOString(),
  })
})
```

---

## Summary of Synchronous Communication

```mermaid
graph LR
  Client -->|HTTP/gRPC| GW[API Gateway]
  GW -->|Auth, Rate Limit| CB1[Circuit Breaker]
  CB1 -->|load balance| US1[User Svc :8001]
  CB1 -->|load balance| US2[User Svc :8002]
  GW -->|Auth, Rate Limit| CB2[Circuit Breaker]
  CB2 -->|load balance| OS[Order Svc]
  US1 -->|lookup| R[Service Registry]
  OS -->|lookup| R
```

Key components of reliable synchronous communication:
1. **Timeout** on every call
2. **Circuit Breaker** for cascade protection
3. **Retry with jitter** for recovery after failures
4. **Health Check** so the load balancer knows about problems
5. **Service Registry** for dynamic discovery
6. **Idempotency Keys** for safe retry of POST/PUT