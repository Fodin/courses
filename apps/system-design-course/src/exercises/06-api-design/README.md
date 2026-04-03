# 🔥 Уровень 6: Проектирование API

## 🎯 Зачем проектировать API?

Представьте: вы строите дом. API — это **двери и окна**. Неважно, насколько красиво внутри — если двери открываются не в ту сторону, окна не подходят по размеру, а замки меняются каждый месяц, жить в таком доме невозможно.

API — это **контракт** между вашим сервисом и всем остальным миром. Плохой API = боль для клиентов, бесконечные breaking changes и ночные дежурства. Хороший API = интуитивный, стабильный и масштабируемый интерфейс, который живёт годами.

📌 **API Design — это не про код. Это про коммуникацию.** Каждый endpoint — обещание, которое нельзя нарушить.

## 🔥 REST — Richardson Maturity Model

REST — самый распространённый стиль API. Но «REST» — широкое понятие. Леонард Ричардсон выделил 4 уровня зрелости:

```mermaid
flowchart LR
  L0["Level 0\nОдин URL, POST\n/api"] --> L1["Level 1\nРесурсы\n/users, /orders"]
  L1 --> L2["Level 2\nHTTP-глаголы\nGET, POST, PUT, DELETE"]
  L2 --> L3["Level 3\nHATEOAS\nГиперссылки в ответах"]

  style L0 fill:#ffcdd2
  style L1 fill:#fff9c4
  style L2 fill:#c8e6c9
  style L3 fill:#bbdefb
```

### Level 0: The Swamp of POX

Один URL, всё через POST. Это SOAP/XML-RPC. Никакого REST.

```typescript
// Level 0 — всё через один endpoint
POST /api
{ "action": "getUser", "userId": 42 }

POST /api
{ "action": "createOrder", "items": [...] }
```

### Level 1: Resources

Отдельные URL для каждого ресурса, но HTTP-методы используются неправильно.

```typescript
// Level 1 — есть ресурсы, но всё ещё POST
POST /users/42         // получить пользователя
POST /users/42/orders  // создать заказ
```

### Level 2: HTTP Verbs (большинство «REST API» живут тут)

Ресурсы + правильные HTTP-методы + статус-коды.

```typescript
// Level 2 — полноценный REST
GET    /users/42           // 200 OK
POST   /users              // 201 Created
PUT    /users/42           // 200 OK (полная замена)
PATCH  /users/42           // 200 OK (частичное обновление)
DELETE /users/42           // 204 No Content
GET    /users/42/orders    // 200 OK (вложенные ресурсы)
```

| Метод | Назначение | Идемпотентен? | Безопасен? |
|---|---|---|---|
| GET | Чтение | Да | Да |
| POST | Создание | Нет | Нет |
| PUT | Полная замена | Да | Нет |
| PATCH | Частичное обновление | Нет* | Нет |
| DELETE | Удаление | Да | Нет |

*PATCH может быть идемпотентным, если использовать JSON Merge Patch.

### Level 3: HATEOAS

Ответ содержит ссылки на связанные действия. Клиент не хардкодит URL — следует за ссылками.

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

💡 **На практике:** большинство API живёт на Level 2. HATEOAS (Level 3) используется редко — клиенты всё равно хардкодят URL. Но идея «discoverable API» полезна для документации.

## 🔥 GraphQL — когда REST недостаточно

REST отлично работает для простых CRUD. Но что если:
- Мобильному клиенту нужно 3 поля из User и 2 из Order за один запрос?
- Один экран требует данных из 5 endpoint'ов?
- Разные клиенты (web, mobile, admin) нужны разные наборы полей?

GraphQL решает проблему **overfetching** (лишние данные) и **underfetching** (нехватка данных, N+1 запросов к API).

```graphql
# Schema — определяет структуру данных
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!     # связь — resolve по требованию
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
# Клиент запрашивает ровно то, что нужно
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

### N+1 проблема в GraphQL

```typescript
// ❌ Наивный resolver — 1 запрос на user + N запросов на posts
const resolvers = {
  Query: {
    users: () => db.query('SELECT * FROM users')  // 1 запрос
  },
  User: {
    posts: (user) => db.query('SELECT * FROM posts WHERE author_id = ?', [user.id])
    // Вызывается для КАЖДОГО user → N запросов!
  }
}
// Если 100 users → 1 + 100 = 101 запрос к БД

// ✅ DataLoader — батчинг и кэширование
import DataLoader from 'dataloader'
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.query(
    'SELECT * FROM posts WHERE author_id IN (?)', [userIds]
  )  // 1 запрос вместо N!
  return userIds.map(id => posts.filter(p => p.authorId === id))
})

const resolvers = {
  User: {
    posts: (user) => postLoader.load(user.id) // Батчинг автоматически
  }
}
// Теперь: 1 + 1 = 2 запроса к БД
```

## 🔥 gRPC — для межсервисной коммуникации

gRPC использует Protocol Buffers (бинарный формат) и HTTP/2. Быстрее REST в 2-10 раз для внутренних коммуникаций.

```protobuf
// user.proto — определение контракта
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

| Тип | Описание | Пример |
|---|---|---|
| Unary | Запрос-ответ (как REST) | GetUser |
| Server streaming | Сервер отправляет поток | ListUsers (1000+ результатов) |
| Client streaming | Клиент отправляет поток | Upload файла чанками |
| Bidirectional | Двусторонний поток | Чат, real-time updates |

## 🔥 REST vs GraphQL vs gRPC — сравнение

| | REST | GraphQL | gRPC |
|---|---|---|---|
| **Формат** | JSON (текст) | JSON (текст) | Protobuf (бинарный) |
| **Протокол** | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| **Контракт** | OpenAPI/Swagger | Schema (SDL) | .proto файл |
| **Типизация** | Слабая | Строгая (schema) | Строгая (protobuf) |
| **Overfetching** | Частая проблема | Нет (клиент выбирает поля) | Нет (фиксированный message) |
| **Streaming** | Нет (SSE/WebSocket отдельно) | Subscriptions | Встроенный |
| **Browser** | Нативная поддержка | Нативная поддержка | Нужен gRPC-Web прокси |
| **Когда** | Public API, CRUD | Сложные клиенты, агрегация | Микросервисы, low-latency |

💡 **Правило:** REST — для публичного API. GraphQL — когда клиентам нужна гибкость. gRPC — для внутренней связи между сервисами.

## 🔥 Пагинация: Offset vs Cursor

Когда ресурсов тысячи — нужна пагинация. Два подхода:

### Offset-based (простой, но проблемный)

```typescript
// Запрос
GET /posts?limit=20&offset=40  // Страница 3

// SQL
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 40

// Ответ
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

**Проблема:** если между запросами страниц добавился новый пост — offset сдвигается, и пользователь видит дубли или пропускает записи.

### Cursor-based (надёжный)

```typescript
// Запрос
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==

// SQL (cursor — это закодированный id последнего элемента)
SELECT * FROM posts WHERE id < 100 ORDER BY id DESC LIMIT 20

// Ответ
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
| **Простота** | Просто (page=3) | Сложнее (непрозрачный cursor) |
| **Пропуски/дубли** | Да (при изменениях данных) | Нет |
| **Производительность** | O(offset) — медленно на больших offset | O(1) — всегда быстро (WHERE id < X) |
| **Переход на страницу** | Можно (?page=50) | Нельзя (только next/prev) |
| **Когда** | Админки, фиксированные данные | Ленты, timeline, мобильные приложения |

📌 **Для публичного API используйте cursor-based пагинацию.** Offset подходит только для внутренних админок.

## 🔥 Rate Limiting — защита API

Rate limiting — «вышибала у входа в клуб». Без него один клиент может положить весь сервис.

```mermaid
flowchart LR
  C[Client] -->|"Request"| RL["Rate Limiter\n(Token Bucket)"]
  RL -->|"✅ Allowed"| S[API Server]
  RL -->|"❌ 429 Too Many"| C
  S -->|"Response"| C

  style RL fill:#fff3e0
  style S fill:#c8e6c9
```

### Token Bucket (самый популярный)

Аналогия: ведро с жетонами. Жетоны добавляются с постоянной скоростью (rate). Каждый запрос забирает один жетон. Если ведро пустое — запрос отклоняется. Ведро имеет максимальный размер (burst).

```typescript
class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(
    private rate: number,     // жетонов в секунду
    private burst: number     // максимальный размер ведра
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

### Sliding Window (точнее, но сложнее)

Считает запросы в скользящем окне. Точнее, чем fixed window, но требует больше памяти.

```typescript
class SlidingWindowLog {
  private requests: number[] = []

  constructor(
    private windowMs: number,  // размер окна (например, 60000 = 1 мин)
    private maxRequests: number // максимум запросов в окне
  ) {}

  allow(): boolean {
    const now = Date.now()
    // Удаляем запросы за пределами окна
    this.requests = this.requests.filter(t => now - t < this.windowMs)

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true   // ✅ Allowed
    }
    return false    // ❌ Rate limited
  }
}
```

### Fixed Window (простой, но с burst-проблемой)

Фиксированные интервалы (например, каждую минуту). Проблема: на границе двух окон клиент может отправить 2x лимита.

```
Окно 1 (00:00-01:00): [............98 99 100] ← лимит
Окно 2 (01:00-02:00): [100 99 98............] ← лимит
                                    ↑
                        За 2 секунды = 200 запросов!
```

| Алгоритм | Точность | Память | Burst-защита | Сложность |
|---|---|---|---|---|
| Token Bucket | Высокая | O(1) | Контролируемая (burst param) | Простая |
| Sliding Window | Высокая | O(N) | Полная | Средняя |
| Fixed Window | Низкая | O(1) | Слабая (граница окон) | Простая |

## 🔥 Аутентификация API

### JWT (JSON Web Token)

Токен содержит информацию о пользователе, подписанную секретным ключом. Сервер не хранит сессии — stateless.

```
JWT = Header.Payload.Signature

Header:  { "alg": "HS256", "typ": "JWT" }
Payload: { "sub": "42", "name": "Ivan", "role": "admin", "exp": 1710500000 }
Signature: HMAC-SHA256(base64(header) + "." + base64(payload), secret)
```

```typescript
// Клиент отправляет токен в заголовке
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.signature

// Сервер проверяет подпись без обращения к БД
const payload = jwt.verify(token, SECRET_KEY)
// { sub: '42', name: 'Ivan', role: 'admin' }
```

### OAuth2 Authorization Code Flow

Для сторонних приложений — пользователь авторизуется через провайдер (Google, GitHub), приложение получает токен.

```mermaid
sequenceDiagram
  participant U as User
  participant A as App (Client)
  participant AS as Auth Server
  participant R as Resource Server

  U->>A: Нажимает "Войти через Google"
  A->>AS: Redirect → /authorize?client_id=X&redirect_uri=Y
  AS->>U: Показывает форму согласия
  U->>AS: Разрешает доступ
  AS->>A: Redirect → callback?code=AUTH_CODE
  A->>AS: POST /token (code + client_secret)
  AS->>A: access_token + refresh_token
  A->>R: GET /api/data + Bearer token
  R->>A: Данные пользователя
```

### API Keys

Для сервис-к-сервису коммуникации. Простой, но без granular permissions.

```typescript
// Клиент отправляет ключ в заголовке
GET /api/weather?city=Moscow
X-API-Key: sk_live_abc123def456

// Сервер проверяет ключ в БД
const client = await db.query('SELECT * FROM api_keys WHERE key = ?', [apiKey])
if (!client) return res.status(401).json({ error: 'Invalid API key' })
if (client.rateLimit.exceeded) return res.status(429).json({ error: 'Rate limit exceeded' })
```

| Метод | Stateless | Granular | Когда |
|---|---|---|---|
| JWT | Да | Роли в payload | Внутренние API, SPA |
| OAuth2 | Зависит | Scopes | Сторонние приложения |
| API Key | Нет (lookup в БД) | По ключу | S2S, публичные API |

## 🔥 Idempotency Keys

Сеть ненадёжна. Клиент отправил POST-запрос, получил timeout. Запрос дошёл или нет? Повторить — рискованно (двойной платёж). Не повторять — возможна потеря.

Решение: **idempotency key** — уникальный идентификатор операции.

```typescript
// Клиент генерирует уникальный ключ
POST /api/payments
Idempotency-Key: pay_uuid_abc123
{
  "amount": 5000,
  "currency": "RUB",
  "recipient": "merchant_42"
}

// Сервер:
// 1. Проверяет — есть ли pay_uuid_abc123 в кэше/БД
// 2. Если есть — возвращает сохранённый результат (без повторного выполнения)
// 3. Если нет — выполняет операцию и сохраняет результат с этим ключом
```

```typescript
async function handlePayment(req: Request, res: Response) {
  const idempotencyKey = req.headers['idempotency-key']

  // Проверяем: уже обрабатывали?
  const cached = await redis.get(`idempotency:${idempotencyKey}`)
  if (cached) {
    return res.json(JSON.parse(cached))  // Возвращаем кэш
  }

  // Выполняем операцию
  const result = await processPayment(req.body)

  // Сохраняем результат (TTL 24 часа)
  await redis.set(`idempotency:${idempotencyKey}`, JSON.stringify(result), 'EX', 86400)

  return res.json(result)
}
```

📌 **Правило:** все неидемпотентные операции (POST для создания, платежи) должны поддерживать idempotency key.

## 🔥 API Versioning

API эволюционирует. Как обновлять, не ломая клиентов?

| Стратегия | Пример | Плюсы | Минусы |
|---|---|---|---|
| **URL path** | `/v1/users`, `/v2/users` | Очевидно, легко роутить | Дублирование URL |
| **Header** | `Accept: application/vnd.api.v2+json` | Чистые URL | Сложнее тестировать |
| **Query param** | `/users?version=2` | Просто | Кэширование сложнее |
| **No versioning** | Backward-compatible changes only | Один API | Ограничивает эволюцию |

```typescript
// URL path (самый популярный)
GET /v1/users/42  → { id: 42, name: "Ivan" }
GET /v2/users/42  → { id: 42, firstName: "Ivan", lastName: "Petrov" }

// Deprecation — предупреждаем клиентов
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Link: </v2/users>; rel="successor-version"
```

💡 **Best practice:** URL-версионирование (`/v1/`, `/v2/`). Поддерживайте минимум 2 версии. Deprecation notice за 6+ месяцев. Мониторьте трафик на старые версии.

## 🔥 API Gateway и BFF Pattern

### API Gateway

Единая точка входа для всех клиентов. Централизует cross-cutting concerns: аутентификацию, rate limiting, логирование, маршрутизацию.

### BFF (Backend for Frontend)

Отдельный backend для каждого типа клиента. Мобильному нужны компактные ответы, web — полные, admin — детальные.

```mermaid
flowchart LR
  M[Mobile App] --> BFF_M["BFF Mobile\n(компактные данные)"]
  W[Web App] --> BFF_W["BFF Web\n(полные данные)"]
  A[Admin Panel] --> BFF_A["BFF Admin\n(все данные + метрики)"]

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
// BFF Mobile — минимум данных, оптимизирован для мобильной сети
app.get('/mobile/feed', async (req, res) => {
  const posts = await productService.getTopPosts({ limit: 10 })
  const user = await userService.getBasicProfile(req.userId)

  // Агрегируем и отдаём компактный ответ
  res.json({
    user: { name: user.name, avatar: user.avatarSmall },
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      thumbnail: p.imageSm  // маленькая картинка для мобильной сети
    }))
  })
})

// BFF Web — полные данные
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

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Глаголы в URL вместо существительных

```typescript
// ❌ RPC-стиль — глаголы
POST /getUser?id=42
POST /createOrder
POST /deleteUser?id=42
POST /updateUserEmail
```

```typescript
// ✅ RESTful — существительные + HTTP-методы
GET    /users/42
POST   /orders
DELETE /users/42
PATCH  /users/42   { "email": "new@example.com" }
```

### ❌ Ошибка 2: Отсутствие пагинации на списках

```typescript
// ❌ Возвращаем ВСЕ записи — убьёт сервер при 1M+ записей
GET /posts  → [... 1 000 000 posts ...]
```

```typescript
// ✅ Всегда пагинация + разумный лимит по умолчанию
GET /posts?limit=20&cursor=abc123
// Максимальный limit = 100, default = 20
```

### ❌ Ошибка 3: Нет idempotency key на POST-запросах

```typescript
// ❌ Клиент retry после timeout → двойной платёж
POST /payments  { "amount": 5000 }
// Timeout → retry →
POST /payments  { "amount": 5000 }
// = 10 000 списано!
```

```typescript
// ✅ Idempotency key предотвращает дубли
POST /payments
Idempotency-Key: pay_uuid_abc123
{ "amount": 5000 }
// Retry с тем же ключом → сервер возвращает кэш, не создаёт новый платёж
```

### ❌ Ошибка 4: Breaking changes без версионирования

```typescript
// ❌ v1: name — строка. Клиенты зависят от этого
{ "name": "Ivan Petrov" }

// Через 3 месяца: name разбили на два поля БЕЗ версионирования
{ "firstName": "Ivan", "lastName": "Petrov" }
// Все клиенты сломались!
```

```typescript
// ✅ Новая версия + backward compatibility
// /v1/users/42 — по-прежнему возвращает name
{ "name": "Ivan Petrov" }

// /v2/users/42 — новый формат
{ "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
// name остаётся для совместимости
```

### ❌ Ошибка 5: GraphQL без решения N+1

```typescript
// ❌ 100 users → 101 запрос к БД
query { users { name posts { title } } }
// Каждый User.posts → отдельный SELECT
```

```typescript
// ✅ DataLoader батчит запросы
// 100 users → 2 запроса к БД (users + posts WHERE author_id IN (...))
```

## 📌 Итоги

| Концепция | Ключевая мысль |
|---|---|
| **REST (Level 2)** | Ресурсы + HTTP-глаголы + статус-коды — стандарт для публичных API |
| **GraphQL** | Клиент выбирает поля. Решает over/underfetching. Обязателен DataLoader |
| **gRPC** | Protobuf + HTTP/2. Для межсервисных вызовов — быстрее REST в разы |
| **Cursor pagination** | Стабильная, быстрая. Для лент и списков — всегда cursor |
| **Rate limiting** | Token bucket — баланс точности и простоты. Обязателен для публичных API |
| **Idempotency key** | Уникальный ключ операции. Защита от дублей при retry |
| **API versioning** | URL path (`/v1/`). Sunset notice. Минимум 2 версии одновременно |
| **API Gateway + BFF** | Gateway — единый вход (auth, rate limit). BFF — оптимизация под клиента |
| **OAuth2** | Authorization code flow для сторонних приложений. JWT для внутренних |

🎯 **Главный принцип:** API — это контракт. Проектируйте так, будто ваш API будут использовать 1000 команд, которые вы никогда не встретите. Делайте очевидным, стабильным и трудно-ломаемым.
