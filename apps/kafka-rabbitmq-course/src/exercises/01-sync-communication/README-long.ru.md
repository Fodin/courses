# Уровень 1: Синхронная коммуникация — Подробная теория

## 1. Эволюция HTTP: от 1.0 до 3.0

### HTTP/1.0 — одно соединение на запрос

Самая первая версия: каждый запрос открывал новое TCP-соединение, получал ответ и закрывал его. Затраты на TCP handshake (3-way: SYN → SYN-ACK → ACK) составляли 1-2 RTT до первого байта данных.

```
Client                     Server
  |──── TCP SYN ──────────→|
  |←─── TCP SYN-ACK ───────|
  |──── TCP ACK ──────────→|
  |──── GET /index.html ──→|   ← Только теперь запрос
  |←─── 200 OK + body ─────|
  |──── TCP FIN ──────────→|   ← Закрываем соединение
```

На странице 30 ресурсов = 30 TCP handshake = огромные задержки.

### HTTP/1.1 — Keep-Alive и pipelining

Добавили `Connection: keep-alive` — соединение остаётся открытым. Но **head-of-line blocking**: ответы должны приходить строго по порядку. Если первый запрос медленный — все остальные ждут.

```
HTTP/1.1 Keep-Alive:
┌──────────────────────────────────────────────┐
│ REQ1 → RSP1 → REQ2 → RSP2 → REQ3 → RSP3     │
│ (sequential, head-of-line blocking)           │
└──────────────────────────────────────────────┘

Pipelining (редко работает на практике):
┌──────────────────────────────────────────────┐
│ REQ1 REQ2 REQ3 → RSP1 RSP2 RSP3              │
│ (ответы всё равно в порядке очереди!)         │
└──────────────────────────────────────────────┘
```

### HTTP/2 — мультиплексирование и бинарный протокол

HTTP/2 переходит на бинарный формат (фреймы) и добавляет **streams** — виртуальные каналы внутри одного TCP-соединения. Каждый запрос получает stream ID.

```
HTTP/2 Multiplexing (один TCP, много streams):
┌─────────────────────────────────────────────────────┐
│ Stream 1: [DATA][DATA][DATA]──────────────── RSP1   │
│ Stream 3: [DATA]────────────────── RSP3             │
│ Stream 5: [DATA][DATA]─────── RSP5                  │
└─────────────────────────────────────────────────────┘
```

**Другие улучшения HTTP/2:**
- **Header compression (HPACK)** — заголовки сжимаются, одинаковые заголовки не повторяются
- **Server Push** — сервер может отправить ресурсы до запроса клиента
- **Stream prioritization** — можно указать приоритет потока

💡 gRPC построен на HTTP/2, поэтому получает все эти возможности бесплатно.

### HTTP/3 — на основе QUIC

HTTP/3 заменяет TCP на **QUIC** (UDP + надёжность). Проблема HTTP/2 — TCP head-of-line blocking на уровне транспорта: если один пакет потерян, все streams ждут.

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

Также QUIC встраивает TLS 1.3 прямо в handshake: 0-RTT соединение для повторных подключений.

---

## 2. REST: ограничения Филдинга

REST описан Роем Филдингом в его диссертации 2000 года как набор из 6 ограничений:

### 1. Client-Server

Разделение ответственности: клиент заботится о UI, сервер — о данных. Они могут развиваться независимо.

### 2. Stateless

Каждый запрос содержит всю информацию для его обработки. Сервер не хранит состояние между запросами.

```typescript
// ❌ Stateful: сервер помнит контекст
// Запрос 1: POST /login → сервер создаёт сессию
// Запрос 2: GET /profile → сервер использует сессию
// Если сервер рестартует — состояние потеряно

// ✅ Stateless: каждый запрос самодостаточен
GET /profile
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiI0MiJ9...
// JWT токен содержит userId, сервер не хранит ничего
```

### 3. Cacheable

Ответы должны помечаться как кешируемые или нет. GET-запросы кешируются, POST/PUT/DELETE — нет.

```http
HTTP/1.1 200 OK
Cache-Control: max-age=3600
ETag: "a1b2c3d4"
```

### 4. Uniform Interface

Единый интерфейс: URI идентифицирует ресурс, представление отделено от ресурса, HATEOAS (hypermedia).

```json
// HATEOAS пример:
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

Клиент не знает, напрямую ли он говорит с сервером или через proxy, load balancer, CDN.

### 6. Code on Demand (необязательное)

Сервер может присылать исполняемый код (JavaScript). Используется редко.

**📌 Важно:** Большинство "REST API" не являются REST в понимании Филдинга — это HTTP API. Настоящий REST предполагает HATEOAS, что редко реализуется.

---

## 3. gRPC: Типы streaming

gRPC поддерживает 4 вида RPC-вызовов:

### 3.1 Unary RPC — запрос-ответ

Классика: один запрос, один ответ. Как HTTP.

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

Клиент отправляет один запрос, сервер присылает поток ответов.

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

Применение: real-time обновления, прогресс загрузки файла, live логи.

### 3.3 Client Streaming

Клиент присылает поток данных, сервер отвечает одним сообщением.

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

Применение: batch upload данных, запись sensor data.

### 3.4 Bidirectional Streaming

Оба потока открыты одновременно. Порядок независим.

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

## 4. Protobuf кодирование

Каждое поле в protobuf кодируется как `[field_tag][value]`.

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

Итого: 15 байт

JSON: {"id":"usr_42","name":"Alice","age":30} = 42 байта
```

**Обратная совместимость:** поля идентифицируются номерами, а не именами. Переименование поля не ломает совместимость. Добавление новых полей — безопасно (старые клиенты их игнорируют).

📌 **Никогда не меняй номер поля** — это ломает все существующие данные.

---

## 5. Service Mesh

Service Mesh — инфраструктурный слой для управления межсервисной коммуникацией. Вместо того чтобы реализовывать retry, timeout, circuit breaker в каждом сервисе — всё это выносится в sidecar proxy.

```mermaid
graph LR
  SA[Service A] --> PA[Proxy Sidecar A]
  PA -->|mTLS, retry, timeout| PB[Proxy Sidecar B]
  PB --> SB[Service B]
  PA --> CP[Control Plane]
  PB --> CP
```

**Istio** — самый популярный service mesh:
- Использует **Envoy** как data plane (sidecar)
- **Pilot** управляет конфигурацией
- mTLS между всеми сервисами
- Distributed tracing через Jaeger/Zipkin

**Linkerd** — более лёгкая альтернатива:
- Написан на Rust (Linkerd2-proxy)
- Меньше ресурсов, проще настройка
- Хорошо интегрируется с Kubernetes

```yaml
# Istio: VirtualService с retry и timeout
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

## 6. Circuit Breaker: детально

Circuit Breaker впервые описан Майклом Найгардом в книге "Release It!" (2007).

### Конечный автомат

```mermaid
graph LR
  C[CLOSED] -->|failures >= threshold| O[OPEN]
  O -->|timeout expired| H[HALF-OPEN]
  H -->|probe success| C
  H -->|probe failure| O
```

### Реализация с метриками

```typescript
interface CircuitBreakerConfig {
  failureThreshold: number    // % ошибок для открытия (e.g., 50%)
  successThreshold: number    // успехов для закрытия из half-open
  timeout: number             // ms перед переходом из open в half-open
  volumeThreshold: number     // минимум запросов для подсчёта процента
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

### Hystrix и Resilience4j

**Hystrix** (Netflix, deprecated) — первая популярная реализация для JVM. Использует отдельные thread pool для изоляции.

**Resilience4j** — современная замена Hystrix для Java:
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

Bulkhead (переборка) — изоляция ресурсов, чтобы отказ одной части не топил всё судно. Паттерн из кораблестроения.

```typescript
// ❌ Без Bulkhead: один тормозящий сервис занимает все потоки
class ServiceClient {
  private pool = new ThreadPool(100) // Общий пул

  callUserService() { this.pool.submit(userRequest) }
  callOrderService() { this.pool.submit(orderRequest) }
  // Если UserService тормозит — все 100 потоков заняты запросами к нему
  // OrderService не может получить поток → отказ всей системы
}

// ✅ С Bulkhead: отдельные пулы
class ServiceClient {
  private userPool  = new ThreadPool(30)  // Изолированный пул
  private orderPool = new ThreadPool(30)
  private paymentPool = new ThreadPool(20)

  // Тормоза UserService не влияют на OrderService
}
```

В Kubernetes Bulkhead реализуется через **Resource Quotas** и **Limit Ranges** — отдельные namespace с лимитами CPU/RAM.

---

## 8. Timeout Strategies

### Timeout типы

```
Connection Timeout — время ожидания TCP соединения
│
├─── Read Timeout — время ожидания первого байта данных
│
└─── Total Timeout — максимальное время всего запроса
```

### Timeout бюджет (Deadline Propagation)

Классическая проблема: если внешний таймаут 30 секунд, каждый внутренний сервис устанавливает свои 30 секунд — каскад таймаутов превышает ожидаемое время.

Решение — **deadline propagation**: передавай оставшееся время в заголовке.

```typescript
// gRPC автоматически propagates deadline
const deadline = new Date(Date.now() + 5000) // 5 секунд на всё
const client = new UserServiceClient(address, credentials)
client.getUser({ userId: '42' }, { deadline }, callback)
// Если вызов внутри этого есть вложенный gRPC — deadline уже меньше

// REST — вручную
const remainingTime = deadline - Date.now()
await fetch('/internal/users/42', {
  headers: { 'X-Deadline-Ms': String(remainingTime) },
  signal: AbortSignal.timeout(remainingTime),
})
```

---

## 9. Retry с Jitter

Простой retry без jitter создаёт **thundering herd**: все клиенты ретраят одновременно через одинаковый интервал, создавая пиковую нагрузку.

```
Без jitter:
t=0s:   REQ REQ REQ REQ REQ  → все падают
t=1s:   REQ REQ REQ REQ REQ  → снова пик
t=2s:   REQ REQ REQ REQ REQ  → снова...

С jitter:
t=0s:   REQ REQ REQ REQ REQ  → падают
t=0.8s: REQ
t=1.1s:     REQ REQ
t=1.4s:             REQ
t=1.9s:                 REQ  → равномерная нагрузка
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
          // Full jitter: случайная точка в [0, exponentialMax]
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

AWS рекомендует **Full Jitter** как наиболее эффективный для равномерного распределения нагрузки.

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

Клиент сам выбирает экземпляр. Плюс: меньше сетевых хопов, клиент контролирует балансировку. Минус: логика discovery в каждом сервисе.

**Server-Side Discovery:**

```mermaid
graph LR
  A[Service A] -->|запрос| LB[Load Balancer / Nginx]
  LB -->|lookup| R[Registry]
  LB --> B1[Service B :8001]
  LB --> B2[Service B :8002]
```

Клиент говорит с load balancer, тот решает куда. Плюс: клиент прост. Минус: дополнительный хоп.

### Consul

Consul от HashiCorp — популярный сервис-реестр с health checks.

```json
// Регистрация сервиса в Consul
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

### Kubernetes DNS (встроено)

В Kubernetes каждый Service получает DNS-имя автоматически:

```
<service-name>.<namespace>.svc.cluster.local

user-service.production.svc.cluster.local → ClusterIP
```

kube-dns / CoreDNS резолвит имя в IP сервиса. Kubernetes Endpoints автоматически обновляются при изменении Pod'ов.

```yaml
# Service автоматически регистрируется в DNS
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
# Доступен как: http://user-service или user-service.default.svc.cluster.local
```

---

## 11. GraphQL в микросервисах

GraphQL — язык запросов для API. Клиент запрашивает точно те данные, которые нужны.

```graphql
# REST: нужно несколько запросов
GET /users/42          → вся информация о пользователе (избыток)
GET /orders?userId=42  → все заказы

# GraphQL: один запрос, только нужные поля
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

**GraphQL Federation** — для микросервисов. Каждый сервис публикует свою часть схемы, **Gateway** объединяет их в единый граф.

```
User Service:    type User { id, name, email }
Order Service:   type Order { id, userId, total }
                 extend type User { orders: [Order] }  ← Federation extension

Gateway:         объединяет схемы, выполняет query плановое
```

⚠️ **GraphQL не панацея:** N+1 проблема (DataLoader), сложный caching, overhead для простых CRUD API. Подходит когда много клиентов с разными потребностями (мобильный, веб, партнёры).

---

## 12. Сравнение: REST vs gRPC vs GraphQL

| Критерий | REST | gRPC | GraphQL |
|----------|------|------|---------|
| Транспорт | HTTP/1.1 + HTTP/2 | HTTP/2 | HTTP/1.1 + HTTP/2 |
| Формат | JSON (text) | Protobuf (binary) | JSON (text) |
| Контракт | OpenAPI (опц.) | .proto (обязательно) | Schema (обязательно) |
| Streaming | Ограничен | Нативный | Subscriptions |
| Браузер | ✅ Нативно | ⚠️ grpc-web | ✅ Нативно |
| Производительность | Средняя | Высокая | Средняя |
| Дебаггинг | ✅ curl/browser | ⚠️ grpcurl | ⚠️ GraphiQL |
| Версионирование | /v1/, /v2/ | Backward compat | @deprecated |
| Лучше для | Публичный API | Внутренние сервисы | BFF, много клиентов |

### Практическое правило

```
Публичный API для внешних разработчиков → REST
Внутренняя коммуникация сервисов       → gRPC
BFF для разных клиентов                → GraphQL
Real-time, IoT, стриминг               → gRPC или WebSocket
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Синхронность везде

```
// ❌ Антипаттерн: синхронная цепочка на каждый клик кнопки
User clicks "Place Order"
→ Order Service (sync)
  → Inventory Service (sync)
    → Payment Service (sync) [может занять 3-5 сек]
      → Notification Service (sync)
        → Analytics Service (sync)

// Если Notification упал → заказ не создаётся!
// Если Analytics медленный → пользователь ждёт

// ✅ Выдели что ДОЛЖНО быть синхронно (payment)
// и что может быть асинхронно (notification, analytics)
```

### ❌ Ошибка 2: Нет Circuit Breaker в production

```typescript
// ❌ Прямой вызов без защиты
async function getUserOrders(userId: string) {
  const user = await userService.getUser(userId)       // может зависнуть
  const orders = await orderService.getOrders(userId)  // тоже
  return { user, orders }
}

// ✅ С Circuit Breaker
const userCB = new CircuitBreaker(userService.getUser, { timeout: 2000 })
const orderCB = new CircuitBreaker(orderService.getOrders, { timeout: 2000 })

async function getUserOrders(userId: string) {
  const [user, orders] = await Promise.allSettled([
    userCB.execute(() => userService.getUser(userId)),
    orderCB.execute(() => orderService.getOrders(userId)),
  ])
  // Частичный ответ лучше полного отказа
  return {
    user: user.status === 'fulfilled' ? user.value : null,
    orders: orders.status === 'fulfilled' ? orders.value : [],
  }
}
```

### ❌ Ошибка 3: Игнорировать идемпотентность при retry

```typescript
// ❌ Retry POST создаёт дубликаты
async function createOrder(order: Order) {
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch('/orders', { method: 'POST', body: JSON.stringify(order) })
    } catch { /* retry */ }
  }
}
// Если первый запрос дошёл, но ответ потерялся → создали заказ дважды!

// ✅ Idempotency Key
async function createOrder(order: Order) {
  const idempotencyKey = generateUUID() // один раз перед retry loop
  for (let i = 0; i < 3; i++) {
    try {
      return await fetch('/orders', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: { 'Idempotency-Key': idempotencyKey }, // сервер дедуплицирует
      })
    } catch { /* retry с тем же ключом */ }
  }
}
```

### ❌ Ошибка 4: Отсутствие health check endpoint

```typescript
// ❌ Нет health check → load balancer не знает о проблемах

// ✅ Реализуй /health endpoint
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

## Итоговая схема синхронной коммуникации

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

Ключевые компоненты надёжной синхронной коммуникации:
1. **Timeout** на каждом вызове
2. **Circuit Breaker** для защиты от каскадов
3. **Retry с jitter** для восстановления после сбоев
4. **Health Check** чтобы load balancer знал о проблемах
5. **Service Registry** для динамического discovery
6. **Idempotency Keys** для безопасного retry POST/PUT
