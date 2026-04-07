# Уровень 6: Проектирование API -- REST, GraphQL, версионирование и контракты

## Введение

Представьте, что вы строите торговый центр. Внутри -- сотни магазинов, склады, коммуникации, системы безопасности. Но для покупателей всё это невидимо. Они видят только **входные двери, указатели и правила поведения**: сюда можно войти, здесь можно спросить помощника, вот стойка возврата товаров.

API -- это именно такой интерфейс. Снаружи -- чёткие правила: что можно запросить, в каком формате, что получишь в ответ. Внутри -- произвольная сложность, которую клиенту знать не нужно. Дизайн API -- это искусство создания **понятных, стабильных и безопасных дверей** в вашу систему.

Плохой API похож на торговый центр без указателей, где правила меняются каждую неделю, а охранники пропускают одних и задерживают других без видимой причины. Хороший API -- это место, куда хочется возвращаться, потому что всё предсказуемо и работает как ожидается.

📌 **API Design -- это не про код. Это про коммуникацию.** Каждый endpoint -- обещание, которое нельзя нарушить.

На этом уровне мы подробно разберём:

1. **REST и Richardson Maturity Model** -- уровни зрелости REST и почему большинство API живёт на Level 2
2. **GraphQL** -- когда REST недостаточно, N+1 проблема и DataLoader
3. **gRPC** -- бинарный протокол для межсервисного общения
4. **REST vs GraphQL vs gRPC** -- развёрнутое сравнение с критериями выбора
5. **Пагинация** -- offset vs cursor и почему cursor надёжнее
6. **Rate Limiting** -- алгоритмы защиты API от перегрузки
7. **Аутентификация** -- JWT, OAuth2, API Keys
8. **Idempotency Keys** -- защита от дублирования неидемпотентных операций
9. **Версионирование** -- стратегии эволюции API без breaking changes
10. **API Gateway и BFF Pattern** -- архитектурные паттерны для организации входной точки

---

## 1. REST -- Richardson Maturity Model

### Почему «REST» -- это не одно и то же у всех

Слово «REST» сегодня используют почти для любого HTTP API. Один разработчик говорит «у нас REST API», имея в виду JSON через HTTP. Другой -- полноценные ресурсы, HTTP-семантику и stateless-коммуникацию. Третий -- HATEOAS и самоописывающиеся ответы.

Леонард Ричардсон в 2008 году предложил модель, которая расставила всё по местам: **Richardson Maturity Model (RMM)**. Модель описывает 4 уровня зрелости REST API -- от полного отсутствия REST-принципов до их полного воплощения.

Понимание RMM важно по двум причинам. Во-первых, оно помогает оценить, насколько «правильным» является API, который вы читаете или проектируете. Во-вторых, большинство команд сознательно останавливаются на Level 2 -- и это нормально. HATEOAS звучит красиво в теории, но на практике редко даёт реальную ценность.

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

Level 0 -- это когда разработчик решил использовать HTTP просто как транспорт для вызова процедур. Один URL, всё через POST. Именно так работают SOAP/XML-RPC системы.

Это не REST. Это **RPC поверх HTTP**. HTTP здесь -- просто труба для передачи данных, без использования его семантики.

```typescript
// Level 0 -- всё через один endpoint
POST /api
{ "action": "getUser", "userId": 42 }

POST /api
{ "action": "createOrder", "items": [...] }

POST /api
{ "action": "deleteUser", "userId": 42 }
```

Проблема очевидна: у таких API нет структуры. Клиент должен знать список "магических строк" -- имён действий. Нет кэширования (POST не кэшируется). Нет стандартного поведения для ошибок. Всё определяется внутренними соглашениями команды.

### Level 1: Resources

На Level 1 появляются отдельные URL для каждого ресурса. Это важный шаг -- теперь структура данных отражается в структуре URL. Но HTTP-методы по-прежнему используются неправильно: всё ещё POST.

```typescript
// Level 1 -- есть ресурсы, но HTTP-методы игнорируются
POST /users/42          // получить пользователя
POST /users/42/orders   // создать заказ
POST /users/42/delete   // удалить пользователя
```

Аналогия: представьте библиотеку, где у каждой книги есть своя полка (ресурс), но взять книгу, вернуть её или узнать её наличие -- это всегда один и тот же запрос к библиотекарю. Прогресс есть, но потенциал HTTP не используется.

### Level 2: HTTP Verbs (де-факто стандарт)

Level 2 -- это то, что большинство команд называет «REST API». Ресурсы + правильные HTTP-методы + осмысленные статус-коды.

На этом уровне API начинает использовать HTTP как **протокол со смыслом**, а не просто транспорт:

- GET говорит: «я только читаю, ничего не меняю»
- POST говорит: «я создаю новую сущность»
- PUT говорит: «я заменяю сущность целиком»
- DELETE говорит: «я удаляю»

```typescript
// Level 2 -- полноценный REST
GET    /users/42           // 200 OK
POST   /users              // 201 Created
PUT    /users/42           // 200 OK (полная замена)
PATCH  /users/42           // 200 OK (частичное обновление)
DELETE /users/42           // 204 No Content
GET    /users/42/orders    // 200 OK (вложенные ресурсы)
```

Ключевые свойства HTTP-методов, которые делают API предсказуемым:

| Метод | Назначение | Идемпотентен? | Безопасен? | Кэшируется? |
|---|---|---|---|---|
| GET | Чтение | Да | Да | Да |
| POST | Создание | Нет | Нет | Нет |
| PUT | Полная замена | Да | Нет | Нет |
| PATCH | Частичное обновление | Нет* | Нет | Нет |
| DELETE | Удаление | Да | Нет | Нет |
| HEAD | Метаданные без тела | Да | Да | Да |
| OPTIONS | Допустимые методы | Да | Да | Нет |

**Идемпотентность** -- это гарантия, что повторный вызов с теми же параметрами даст тот же результат. Если DELETE /users/42 был вызван дважды -- второй вызов просто ничего не делает (пользователь уже удалён). Это критически важно для обработки сетевых сбоев и retry-логики.

**Безопасность** -- GET-запросы не меняют состояние сервера. Браузер, поисковый робот, proxy-кэш могут смело вызывать GET, не боясь побочных эффектов.

*PATCH может быть идемпотентным, если использовать JSON Merge Patch (RFC 7396) или JSON Patch (RFC 6902), но это зависит от реализации.

### Level 3: HATEOAS

HATEOAS (Hypermedia As The Engine Of Application State) -- самый зрелый уровень. Ответ содержит не только данные, но и **ссылки на доступные действия**. Клиент не хардкодит URL -- он следует за ссылками, как в браузере.

```json
{
  "id": 42,
  "name": "Иван",
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

Идея красивая: клиент "открывает" возможности через ссылки в ответе, как пользователь браузера кликает по ссылкам, не зная всей структуры сайта заранее. Изменить URL -- и клиент не сломается, потому что он следует ссылкам, а не хардкоду.

💡 **На практике:** большинство API живёт на Level 2. HATEOAS (Level 3) используется редко по нескольким причинам: реальные клиенты всё равно хардкодят поведение на основе бизнес-логики, а не следуют ссылкам механически; добавление `_links` к каждому ответу утяжеляет его; код клиента не становится проще, потому что он должен уметь интерпретировать ссылки. Но идея «discoverable API» полезна для документации и onboarding.

---

## 2. GraphQL -- когда REST недостаточно

### Проблемы REST при работе со сложными клиентами

REST хорошо работает, когда клиент и сервер спроектированы вместе, а данные запрашиваются «один endpoint -- один экран». Но в реальных сложных приложениях это ограничение проявляется через два симптома:

**Overfetching** -- сервер отдаёт больше данных, чем нужно клиенту. Mobile-клиенту для карточки пользователя нужно только имя и аватар, но GET /users/42 возвращает 50 полей, включая адрес, настройки безопасности, историю входов.

**Underfetching (N+1 к API)** -- один экран требует данных из нескольких ресурсов, и клиент вынужден делать несколько последовательных запросов. Чтобы показать ленту новостей: GET /users/me → GET /posts?userId=42 → GET /comments?postId=1 → GET /comments?postId=2 → ...

```mermaid
flowchart LR
  REST_Client["REST Client\nМобильное приложение"] -->|"1: GET /users/42"| REST_Server["REST Server"]
  REST_Server -->|"Ответ: 50 полей"| REST_Client
  REST_Client -->|"2: GET /users/42/posts"| REST_Server
  REST_Server -->|"Ответ: все посты"| REST_Client
  REST_Client -->|"3-N: GET /posts/id/comments"| REST_Server

  GQL_Client["GraphQL Client\nМобильное приложение"] -->|"1 запрос\nТочно нужные поля"| GQL_Server["GraphQL Server"]
  GQL_Server -->|"Ответ: только name, avatar, последние 3 поста"| GQL_Client
```

GraphQL решает обе проблемы одним механизмом: **клиент описывает, что именно ему нужно**, и сервер возвращает ровно это.

### Схема GraphQL -- контракт на языке SDL

GraphQL Schema Definition Language (SDL) -- это строго типизированный контракт между клиентом и сервером. В отличие от REST, где контракт описывается отдельно в OpenAPI/Swagger, в GraphQL **схема -- это сам API**.

```graphql
# Schema -- определяет структуру данных и доступные операции
type User {
  id: ID!                 # ! означает non-null (обязательное поле)
  name: String!
  email: String!
  posts: [Post!]!         # массив Post, ни элементы, ни сам массив не могут быть null
  followers: Int!
  createdAt: String!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!           # связь -- resolve по требованию (не загружается, пока не спросили)
  comments: [Comment!]!
  likesCount: Int!
}

type Comment {
  id: ID!
  text: String!
  author: User!
}

# Query -- операции чтения
type Query {
  user(id: ID!): User          # возвращает User или null
  users: [User!]!              # всегда возвращает массив (возможно пустой)
  posts(limit: Int, offset: Int): [Post!]!
}

# Mutation -- операции записи
type Mutation {
  createPost(title: String!, content: String!): Post!
  updatePost(id: ID!, title: String): Post!
  deletePost(id: ID!): Boolean!
}

# Subscription -- real-time обновления через WebSocket
type Subscription {
  newComment(postId: ID!): Comment!
}
```

Обратите внимание на нотацию `!` -- это одна из сильнейших сторон GraphQL. На уровне схемы вы явно указываете, может ли поле быть null. Клиент знает это заранее и не пишет защитный код на каждое поле.

### Запрос GraphQL -- клиент управляет формой ответа

```graphql
# Клиент запрашивает ровно то, что нужно для экрана профиля
query GetUserProfile {
  user(id: "42") {
    name          # только имя, не email, не createdAt
    posts {
      title
      likesCount  # только счётчик, не content
      comments {
        text
        author {
          name    # только имя автора комментария
        }
      }
    }
  }
}
```

Один запрос, и сервер вернёт ровно эти поля -- не больше. Это особенно ценно для мобильных приложений, где каждый лишний байт в ответе тратит трафик пользователя.

### N+1 проблема в GraphQL -- и как DataLoader её решает

GraphQL-схема позволяет делать вложенные запросы произвольной глубины. Это создаёт ловушку, в которую попадают почти все новички: **N+1 запросов к базе данных**.

Рассмотрим наивную реализацию resolver'ов:

```typescript
// ❌ Наивный resolver -- 1 запрос на users + N запросов на posts каждого
const resolvers = {
  Query: {
    // Шаг 1: получаем 100 пользователей -- 1 SQL-запрос
    users: () => db.query('SELECT * FROM users LIMIT 100')
  },
  User: {
    // Шаг 2: для КАЖДОГО пользователя GraphQL вызывает этот resolver
    // Если 100 пользователей -- 100 отдельных SQL-запросов!
    posts: (user) => db.query(
      'SELECT * FROM posts WHERE author_id = ?',
      [user.id]
    )
  }
}
// Итого при запросе { users { name posts { title } } }:
// 1 (users) + 100 (posts для каждого user) = 101 запрос к БД
```

Почему так происходит? GraphQL-сервер выполняет resolver для каждого объекта независимо. Когда у вас массив из 100 User, resolver `User.posts` вызывается 100 раз -- по одному на каждого пользователя.

DataLoader -- это библиотека, которая решает эту проблему через два механизма:

1. **Батчинг** -- откладывает все вызовы `load(id)` до конца текущего event loop tick, затем вызывает batch-функцию с массивом всех ID одновременно
2. **Кэширование** -- если один и тот же ID запрашивается дважды в рамках одного запроса, DataLoader возвращает кэшированный результат

```mermaid
flowchart LR
  U1["User #1\nрезолвер"] -->|"load(1)"| DL["DataLoader\n(батч-аккумулятор)"]
  U2["User #2\nрезолвер"] -->|"load(2)"| DL
  U3["User #3\nрезолвер"] -->|"load(3)"| DL
  DL -->|"Один запрос:\nSELECT WHERE id IN (1,2,3)"| DB["База данных"]
  DB -->|"Массив результатов"| DL
  DL -->|"posts[1]"| U1
  DL -->|"posts[2]"| U2
  DL -->|"posts[3]"| U3
```

```typescript
// ✅ DataLoader -- батчинг и кэширование
import DataLoader from 'dataloader'

// batch-функция вызывается ОДИН раз с массивом всех ID
const postLoader = new DataLoader(async (userIds: readonly string[]) => {
  const posts = await db.query(
    'SELECT * FROM posts WHERE author_id IN (?)',
    [userIds]
  )
  // DataLoader требует вернуть массив в том же порядке, что и userIds
  return userIds.map(id => posts.filter(p => p.authorId === id))
})

const resolvers = {
  User: {
    // Каждый вызов -- это просто "запись в очередь"
    // DataLoader сам батчит их в один SQL-запрос
    posts: (user) => postLoader.load(user.id)
  }
}
// Теперь при запросе 100 users:
// 1 (users) + 1 (posts WHERE author_id IN (1..100)) = 2 запроса
```

💡 **Правило:** в GraphQL DataLoader -- это не оптимизация, это **обязательный элемент архитектуры**. Без него любой вложенный запрос создаёт N+1 проблему.

---

## 3. gRPC -- для межсервисной коммуникации

### Зачем gRPC, если есть REST?

REST с JSON -- отличный выбор для публичных API, где важна совместимость и читаемость. Но внутри системы из десятков микросервисов, которые делают тысячи вызовов в секунду друг к другу, JSON становится проблемой:

- JSON -- текстовый формат, его надо парсить. Парсинг дорогой
- JSON нет схемы -- опечатка в имени поля не даст ошибку компиляции
- HTTP/1.1 -- одна пара запрос/ответ на соединение, потоки данных неудобны

gRPC решает все три проблемы: **Protocol Buffers** (бинарный формат с жёсткой схемой) + **HTTP/2** (мультиплексирование, сжатие заголовков, двусторонние потоки).

### Protobuf -- контракт как код

```protobuf
// user.proto -- определение контракта
// Генератор создаёт типизированный код на любом языке
syntax = "proto3";

service UserService {
  rpc GetUser(GetUserRequest) returns (User);                      // Unary
  rpc ListUsers(ListUsersRequest) returns (stream User);           // Server streaming
  rpc UploadAvatar(stream Chunk) returns (UploadResponse);         // Client streaming
  rpc Chat(stream Message) returns (stream Message);               // Bidirectional
}

message GetUserRequest {
  string user_id = 1;   // число = номер поля в бинарном формате (порядок важен!)
}

message User {
  string id = 1;
  string name = 2;
  string email = 3;
  int32 age = 4;
  repeated string roles = 5;  // repeated = массив
}
```

Из этого `.proto`-файла генераторы создают типизированный клиент и сервер на Go, TypeScript, Python, Java -- на любом поддерживаемом языке. **Контракт один, реализаций много.** Если вы переименуете поле в `.proto` -- компилятор укажет на все места, которые нужно обновить.

### Типы gRPC-вызовов

| Тип | Описание | Пример использования |
|---|---|---|
| Unary | Запрос-ответ (как REST) | GetUser, CreateOrder |
| Server streaming | Сервер отправляет поток данных | ListUsers (1000+ результатов постепенно) |
| Client streaming | Клиент отправляет поток данных | Загрузка файла чанками |
| Bidirectional | Двусторонний поток | Чат в реальном времени, игры |

### Сравнение производительности REST vs gRPC

Protobuf-кодирование даёт значительное преимущество перед JSON. Для небольших сообщений выигрыш 2-5x по размеру и 5-10x по скорости парсинга. HTTP/2 мультиплексирование позволяет держать одно соединение для многих параллельных запросов, устраняя head-of-line blocking HTTP/1.1.

💡 **Ограничение:** gRPC не работает в браузере напрямую -- нужен gRPC-Web прокси (например, Envoy). Это делает его непригодным для публичных browser-facing API, но идеальным для межсервисных вызовов.

---

## 4. REST vs GraphQL vs gRPC -- сравнение и выбор

### Развёрнутое сравнение

| Критерий | REST | GraphQL | gRPC |
|---|---|---|---|
| **Формат данных** | JSON (текст) | JSON (текст) | Protobuf (бинарный) |
| **Протокол** | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| **Контракт** | OpenAPI/Swagger (отдельно) | Schema SDL (встроенная) | .proto файл |
| **Типизация** | Слабая (runtime) | Строгая (schema-level) | Строгая (protobuf + codegen) |
| **Overfetching** | Частая проблема | Нет (клиент выбирает) | Нет (фиксированный message) |
| **Underfetching** | Требует несколько запросов | Нет (один запрос, любая вложенность) | Нет (один вызов) |
| **Streaming** | Нет нативно (SSE/WebSocket отдельно) | Subscriptions (WebSocket) | Встроенный (4 режима) |
| **Browser** | Нативная поддержка | Нативная поддержка | Нужен gRPC-Web прокси |
| **Кэширование** | HTTP-кэш из коробки | Сложно (один endpoint POST) | Нет |
| **Документация** | Swagger UI (отдельный инструмент) | GraphiQL/Playground (встроен) | protoc + комментарии |
| **Кривая обучения** | Низкая | Средняя | Средняя |
| **Экосистема** | Огромная | Большая | Растущая |

### Когда что выбирать

```mermaid
flowchart LR
  Start["Тип API"] --> PublicAPI{"Публичный API?"}
  PublicAPI -->|"Да"| REST["REST\n/v1/users, /v1/orders"]
  PublicAPI -->|"Нет"| Internal{"Внутренний"}
  Internal --> ManyClients{"Разные клиенты\nweb/mobile/admin?"}
  ManyClients -->|"Да"| GraphQL["GraphQL\n+ DataLoader"]
  ManyClients -->|"Нет"| Perf{"Критична\nпроизводительность?"}
  Perf -->|"Да"| GRPC["gRPC\nProtobuf + HTTP/2"]
  Perf -->|"Нет"| REST2["REST\nпроще поддерживать"]
```

💡 **Правило:** REST -- для публичного API и простых CRUD-операций. GraphQL -- когда у вас несколько типов клиентов с разными потребностями в данных. gRPC -- для высоконагруженной межсервисной коммуникации.

---

## 5. Пагинация: Offset vs Cursor

### Зачем вообще нужна пагинация

Когда в базе данных миллион записей, запрос без ограничения вернёт их все. Это значит: отправить гигабайты по сети, загрузить их в память сервера, сериализовать в JSON, передать клиенту. На практике -- timeout или OOM-краш.

Пагинация -- это способ разбить большой набор данных на управляемые части. Есть два принципиально разных подхода.

### Offset-based пагинация -- простая, но с ловушками

Offset-based пагинация работает как нумерация страниц в книге: «дай мне страницу 3, по 20 записей на странице» = OFFSET 40.

```typescript
// Запрос
GET /posts?limit=20&offset=40  // Страница 3 (0-indexed)

// SQL
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 40

// Ответ
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

Удобство для пользователя очевидно: можно перейти сразу на страницу 50. Но у этого подхода есть два фундаментальных недостатка.

**Проблема 1: сдвиг данных.** Пока пользователь листает страницы, данные меняются. Представьте: пользователь читает страницу 2. Тем временем кто-то публикует новый пост, который встаёт первым в списке. Весь остальной список сдвигается на один. Пользователь переходит на страницу 3 -- и видит последнюю запись со страницы 2 снова, как первую на странице 3. Или, наоборот, пост удаляется -- и пользователь пропускает одну запись.

**Проблема 2: производительность.** OFFSET в SQL -- это не «начни с позиции N», а «прочитай N записей и выброси». При большом OFFSET база данных обрабатывает огромное количество ненужных строк:

```sql
-- При offset=10000 база ЧИТАЕТ и ВЫБРАСЫВАЕТ 10000 строк,
-- чтобы вернуть 20 нужных
SELECT * FROM posts ORDER BY created_at DESC LIMIT 20 OFFSET 10000
```

### Cursor-based пагинация -- надёжная и быстрая

Cursor-based пагинация не знает понятия «страница». Вместо этого она запоминает **позицию последнего элемента**, начиная с которой нужно продолжить выборку.

```typescript
// Запрос первой страницы
GET /posts?limit=20

// Запрос следующей страницы (cursor из предыдущего ответа)
GET /posts?limit=20&cursor=eyJpZCI6MTAwfQ==
// cursor -- это base64-encoded JSON: { "id": 100 }

// SQL -- WHERE, не OFFSET
SELECT * FROM posts
WHERE id < 100        // cursor декодируется в конкретный ID
ORDER BY id DESC
LIMIT 20

// Ответ
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6ODB9",   // { "id": 80 } -- ID последнего элемента
    "prev_cursor": "eyJpZCI6MTAxfQ==",
    "has_more": true
  }
}
```

Почему это лучше:
- **WHERE id < 100** -- индексируемое условие, выполняется за O(log N), не зависит от позиции
- Новые посты, появившиеся пока пользователь листает, не влияют на курсор -- позиция зафиксирована в ID
- Cursor непрозрачен для клиента (base64) -- сервер может изменить его внутреннее представление без изменения API

```mermaid
flowchart LR
  Page1["Страница 1\nПосты 100-81"] -->|"cursor=80"| Page2["Страница 2\nПосты 80-61"]
  Page2 -->|"cursor=60"| Page3["Страница 3\nПосты 60-41"]

  NewPost["Новый пост #105\nпоявился пока\nпользователь читал"] -.->|"не влияет\nна cursor"| Page2
```

### Когда что выбирать

| Критерий | Offset | Cursor |
|---|---|---|
| **Простота реализации** | Просто (page=3) | Сложнее (непрозрачный cursor) |
| **Пропуски/дубли** | Да (при изменениях данных) | Нет (привязан к конкретной записи) |
| **Производительность** | O(offset) -- медленно на больших offset | O(log N) -- всегда быстро (индекс) |
| **Произвольный переход** | Можно (?page=50) | Нельзя (только next/prev) |
| **Реализация "всего N записей"** | Просто (count(*)) | Затруднена |
| **Когда** | Внутренние админки, фиксированные данные | Ленты, timeline, бесконечная прокрутка |

📌 **Для публичного API используйте cursor-based пагинацию.** Offset подходит только для внутренних инструментов с относительно статичными данными.

---

## 6. Rate Limiting -- защита API

### Зачем нужен Rate Limiting

Без Rate Limiting один клиент, намеренно или случайно (баг в retry-логике), может отправить тысячи запросов в секунду и положить весь сервис для остальных. Rate Limiting -- это «вышибала у входа в клуб»: он пропускает всех, но следит, чтобы никто не занимал всю площадку в одиночку.

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

Rate Limiting обычно реализуется на уровне API Gateway или отдельного middleware, а не в бизнес-логике сервисов. Это позволяет применять его централизованно.

### Token Bucket -- самый популярный алгоритм

**Аналогия:** представьте ведро с жетонами. В ведро капают жетоны с постоянной скоростью (например, 10 в секунду). Каждый запрос забирает один жетон. Если ведро пустое -- запрос отклоняется с кодом 429. Ведро имеет максимальный размер (burst) -- это позволяет клиенту «накопить» жетоны и сделать краткосрочный всплеск запросов.

```typescript
class TokenBucket {
  private tokens: number
  private lastRefill: number

  constructor(
    private rate: number,     // жетонов в секунду (средняя скорость)
    private burst: number     // максимальный размер ведра (пиковая скорость)
  ) {
    this.tokens = burst       // начинаем с полным ведром
    this.lastRefill = Date.now()
  }

  allow(): boolean {
    this.refill()             // сначала добавляем накопившиеся жетоны
    if (this.tokens >= 1) {
      this.tokens -= 1
      return true             // ✅ Request allowed
    }
    return false              // ❌ Rate limited (429)
  }

  private refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000  // секунды с последней заправки
    // Добавляем жетоны пропорционально прошедшему времени, но не больше burst
    this.tokens = Math.min(this.burst, this.tokens + elapsed * this.rate)
    this.lastRefill = now
  }
}

// Использование: 10 req/s, burst до 50
const limiter = new TokenBucket(10, 50)
```

Важное свойство Token Bucket: он допускает **burst**. Если клиент молчал 5 секунд, а потом отправил 50 запросов -- они все пройдут (burst = 50). После этого клиент должен ждать, пока ведро не наполнится снова.

### Sliding Window -- точнее, но требует памяти

Sliding Window считает все запросы в скользящем временном окне. В отличие от Token Bucket, он точно соблюдает лимит без накопления burst.

```typescript
class SlidingWindowLog {
  private requests: number[] = []  // timestamp каждого запроса

  constructor(
    private windowMs: number,       // размер окна (например, 60000 = 1 минута)
    private maxRequests: number     // максимум запросов в окне
  ) {}

  allow(): boolean {
    const now = Date.now()
    // Удаляем запросы, которые вышли за пределы окна
    this.requests = this.requests.filter(t => now - t < this.windowMs)

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now)
      return true   // ✅ Allowed
    }
    return false    // ❌ Rate limited
  }
}
```

⚠️ **Проблема памяти:** для каждого клиента хранится лог всех timestamp'ов. При 1000 req/min на 10000 клиентов -- это 10 миллионов записей только для одного уровня хранения. На практике используют **Sliding Window Counter** (компромисс между точностью и памятью).

### Fixed Window -- простой, но с уязвимостью

Fixed Window делит время на фиксированные окна (каждую минуту) и считает запросы в каждом. Проще всего реализовать (просто счётчик), но есть критическая уязвимость:

```
                                  окно заканчивается здесь
                                         ↓
Окно 1 (00:00-01:00): ............[98 99 100]  -- использован весь лимит
Окно 2 (01:00-02:00): [100 99 98]............  -- новое окно, лимит сброшен
                       ↑
                За 2 секунды на границе окон: 200 запросов!
```

Атакующий может специально отправлять запросы на границе окон, удваивая эффективный лимит.

### Сравнение алгоритмов

| Алгоритм | Точность | Память | Burst-защита | Сложность | Когда использовать |
|---|---|---|---|---|---|
| Token Bucket | Высокая | O(1) | Контролируемая (burst param) | Простая | Большинство случаев |
| Sliding Window Log | Максимальная | O(N requests) | Полная | Средняя | Критичная точность |
| Sliding Window Counter | Высокая | O(1) | Хорошая | Средняя | Баланс точность/память |
| Fixed Window | Низкая | O(1) | Слабая (граница окон) | Минимальная | Простые внутренние API |

### HTTP-заголовки Rate Limiting

Хороший API сообщает клиентам о лимитах в заголовках ответа:

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 1000          -- максимум запросов в окне
X-RateLimit-Remaining: 847       -- осталось в текущем окне
X-RateLimit-Reset: 1710500000    -- когда сбросится лимит (Unix timestamp)

HTTP/1.1 429 Too Many Requests
Retry-After: 30                  -- через сколько секунд можно повторить
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710500030
```

---

## 7. Аутентификация API

### JWT (JSON Web Token) -- stateless идентификация

JWT позволяет серверу проверить личность клиента без обращения к базе данных. Секрет -- в **криптографической подписи**: сервер подписал токен своим секретным ключом при выдаче, и может проверить подпись при каждом запросе.

Структура JWT:

```
JWT = Header.Payload.Signature

Header:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
           { "alg": "HS256", "typ": "JWT" }

Payload:   eyJzdWIiOiI0MiIsIm5hbWUiOiJJdmFuIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzEwNTAwMDAwfQ
           { "sub": "42", "name": "Ivan", "role": "admin", "exp": 1710500000 }

Signature: HMAC-SHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

Payload открыт (base64, не шифрование!) -- клиент может его прочитать. Но **изменить** не может -- сломается подпись. Сервер проверяет подпись, не обращаясь к БД:

```typescript
// Клиент отправляет токен в заголовке Authorization
GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.signature

// Сервер: проверка подписи за ~1мс, без запроса к БД
const payload = jwt.verify(token, SECRET_KEY)
// { sub: '42', name: 'Ivan', role: 'admin', exp: 1710500000 }
// Если подпись неверна или токен истёк -- jwt.verify бросит ошибку
```

⚠️ **Важное ограничение JWT:** токен нельзя «отозвать» до истечения срока действия. Если администратор заблокировал пользователя -- его JWT будет работать до exp. Решения: короткое время жизни (15 минут) + refresh tokens, или blacklist токенов в Redis.

### OAuth2 Authorization Code Flow -- делегированный доступ

OAuth2 -- это не просто аутентификация, это **авторизация**: пользователь разрешает приложению ограниченный доступ к своим ресурсам на другом сервисе. Знакомая кнопка «Войти через Google» -- это OAuth2.

```mermaid
sequenceDiagram
  participant U as User
  participant A as App (Client)
  participant AS as Auth Server (Google)
  participant R as Resource Server (API)

  U->>A: Нажимает "Войти через Google"
  A->>AS: Redirect: /authorize?client_id=X&scope=email,profile&redirect_uri=Y
  AS->>U: Показывает: "App хочет доступ к email и профилю. Разрешить?"
  U->>AS: Нажимает "Разрешить"
  AS->>A: Redirect на callback?code=AUTH_CODE (одноразовый, живёт 10 минут)
  A->>AS: POST /token (code + client_secret) -- server-to-server, код не в URL
  AS->>A: { access_token, refresh_token, expires_in }
  A->>R: GET /api/userinfo + Authorization: Bearer access_token
  R->>A: { email: "ivan@gmail.com", name: "Ivan" }
```

Почему такой сложный флоу? Потому что `code` передаётся через редирект в URL (может попасть в логи браузера), а `client_secret` никогда не покидает сервер. Обмен code на token происходит server-to-server, где HTTPS гарантирует конфиденциальность.

### API Keys -- для сервис-к-сервису

API Keys -- наиболее простой метод аутентификации: сгенерировать длинный случайный ключ и передавать его в каждом запросе.

```typescript
// Клиент отправляет ключ в заголовке
GET /api/weather?city=Moscow
X-API-Key: sk_live_abc123def456

// Сервер проверяет ключ в БД (ОДИН запрос к БД на каждый запрос к API)
const client = await db.query(
  'SELECT * FROM api_keys WHERE key_hash = ?',
  [hash(apiKey)]  // храним хэш, не сам ключ!
)
if (!client) return res.status(401).json({ error: 'Invalid API key' })
if (client.rateLimit.exceeded) return res.status(429).json({ error: 'Rate limit exceeded' })
```

📌 **Безопасность:** никогда не храните API keys в открытом виде. Храните их SHA-256 хэш. Ключ отображается пользователю только один раз при создании.

### Сравнение методов аутентификации

| Метод | Stateless? | Отзыв токена | Granular permissions | Когда |
|---|---|---|---|---|
| JWT | Да | Только blacklist в Redis | Роли в payload | SPA, мобильные приложения, внутренние API |
| OAuth2 | Зависит от impl | Через revocation endpoint | Scopes (read, write, admin) | Интеграция сторонних сервисов |
| API Key | Нет (lookup в БД) | Удалить из БД | По ключу / ролям в БД | B2B API, S2S коммуникация |
| Session cookies | Нет | Немедленно | По сессии в БД | Традиционные веб-приложения |

---

## 8. Idempotency Keys

### Проблема: ненадёжные сети и retry

Сеть ненадёжна. Клиент отправил POST /payments, ждёт ответа -- и получает timeout. Что произошло?

**Вариант A:** запрос не дошёл. Платёж не был создан. Нужно повторить.

**Вариант B:** запрос дошёл, платёж создан, но ответ потерялся. Повторить -- создать второй платёж.

Без дополнительных механизмов клиент не может отличить эти сценарии. Идемпотентность метода помогает для GET/PUT/DELETE. Но POST по определению не идемпотентен.

```mermaid
flowchart LR
  Client["Client"] -->|"POST /payments\nIdempotency-Key: pay_123"| Server["Server"]
  Server -->|"Timeout!"| Client
  Client -->|"RETRY:\nPOST /payments\nIdempotency-Key: pay_123"| Server
  Server -->|"Тот же ключ!\nВозвращаем кэш,\nне создаём платёж снова"| Client

  style Server fill:#c8e6c9
```

### Реализация Idempotency Keys

```typescript
// Клиент генерирует UUID для каждой уникальной операции
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

  // Шаг 1: проверяем, была ли уже обработана эта операция
  const cached = await redis.get(`idempotency:${idempotencyKey}`)
  if (cached) {
    // Возвращаем сохранённый ответ -- никакой бизнес-логики
    return res.status(200).json(JSON.parse(cached))
  }

  // Шаг 2: помечаем операцию как "в процессе" (защита от параллельных retry)
  const lock = await redis.set(
    `idempotency:${idempotencyKey}`,
    'PROCESSING',
    'NX',   // только если не существует
    'EX',   // с TTL
    30      // 30 секунд -- максимальное время обработки
  )
  if (!lock) {
    return res.status(409).json({ error: 'Operation in progress' })
  }

  // Шаг 3: выполняем операцию
  const result = await processPayment(req.body)

  // Шаг 4: сохраняем результат (TTL 24 часа для retry)
  await redis.set(
    `idempotency:${idempotencyKey}`,
    JSON.stringify(result),
    'EX',
    86400
  )

  return res.status(201).json(result)
}
```

📌 **Правило:** все неидемпотентные операции с реальными последствиями (создание платежа, отправка email, создание заказа) **обязаны** поддерживать idempotency key.

---

## 9. API Versioning

### Почему API меняется и как это не сломать клиентов

API эволюционирует. Бизнес-требования меняются, приходит понимание лучшей структуры данных, нужно добавить новые поля. Всё это -- **breaking changes**, если не управлять ими.

Breaking change -- это любое изменение, которое требует от существующих клиентов изменить свой код:
- Переименование поля (`name` → `firstName`)
- Изменение типа поля (число → строка)
- Удаление поля или endpoint
- Изменение семантики (поле теперь означает другое)

Non-breaking changes можно вносить в существующую версию:
- Добавление нового необязательного поля в ответ
- Добавление нового endpoint
- Добавление нового необязательного параметра запроса

### Стратегии версионирования

| Стратегия | Пример | Плюсы | Минусы |
|---|---|---|---|
| **URL path** | `/v1/users`, `/v2/users` | Очевидно, легко роутить и тестировать | Дублирование кода, URL загрязняются |
| **Accept header** | `Accept: application/vnd.api.v2+json` | Чистые URL | Неудобно тестировать в браузере |
| **Query param** | `/users?version=2` | Просто добавить | Кэширование сложнее, загрязняет URL |
| **Custom header** | `API-Version: 2` | Чистые URL | Нестандартно, документировать сложнее |

```typescript
// URL path (самый популярный и рекомендуемый)
GET /v1/users/42
// Ответ v1: { "id": 42, "name": "Ivan Petrov" }

GET /v2/users/42
// Ответ v2: { "id": 42, "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
// name оставлено для обратной совместимости v1-клиентов, которые могут мигрировать
```

### Lifecycle управления версиями

```mermaid
flowchart LR
  Active["Active\n(поддерживается)"] -->|"Анонс Deprecation\nза 6+ месяцев"| Deprecated["Deprecated\n(работает, но предупреждение)"]
  Deprecated -->|"Sunset date\nнаступил"| Sunset["Sunset\n(endpoint возвращает 410 Gone)"]
  Sunset -->|"Через 30 дней"| Removed["Removed\n(endpoint не существует)"]
```

```typescript
// Deprecated endpoint -- предупреждаем клиентов через заголовки
HTTP/1.1 200 OK
Deprecation: true
Sunset: Sat, 01 Jan 2026 00:00:00 GMT
Link: </v2/users>; rel="successor-version"
Warning: 299 - "This endpoint is deprecated and will be removed on 2026-01-01"
```

💡 **Best practices для версионирования:**
- Используйте URL-версионирование (`/v1/`, `/v2/`)
- Поддерживайте минимум 2 версии одновременно
- Давайте Deprecation notice за 6+ месяцев
- Мониторьте трафик на старые версии -- пока есть запросы, есть клиенты
- Используйте Sunset: заголовок из RFC 8594

---

## 10. API Gateway и BFF Pattern

### API Gateway -- единая точка входа

В микросервисной архитектуре каждый сервис имеет свой API. Без centralized точки входа каждый клиент должен знать адреса всех сервисов, реализовывать аутентификацию с каждым, обрабатывать разные форматы ответов.

API Gateway централизует **cross-cutting concerns** -- функциональность, которая нужна всем сервисам, но не относится к бизнес-логике:

- Аутентификация и авторизация (проверить JWT до того, как запрос дойдёт до сервиса)
- Rate limiting (один слой защиты для всех сервисов)
- SSL termination (HTTPS снаружи, HTTP внутри)
- Логирование и трейсинг (correlation ID для всех запросов)
- Load balancing между инстансами сервисов
- Маршрутизация (какой путь к какому сервису)
- Трансформация запросов/ответов

### BFF (Backend for Frontend) -- специализированные API для каждого клиента

BFF -- это паттерн, при котором для каждого типа клиента создаётся отдельный backend, оптимизированный под его нужды. Мобильному приложению нужны компактные данные и минимальный трафик. Web-приложению -- полные данные и rich UI. Admin-панели -- все данные плюс метрики.

Без BFF есть два плохих варианта:
1. **Один «жирный» API** -- возвращает все поля для всех клиентов, мобильный клиент получает лишнее
2. **N endpoint'ов в каждом сервисе** -- каждый сервис знает о разных типах клиентов, бизнес-логика размывается

```mermaid
flowchart LR
  M["Mobile App"] --> BFF_M["BFF Mobile\nкомпактные ответы"]
  W["Web App"] --> BFF_W["BFF Web\nполные данные"]
  A["Admin Panel"] --> BFF_A["BFF Admin\nданные + метрики"]

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
// BFF Mobile -- минимум данных, оптимизирован для мобильной сети
app.get('/mobile/feed', async (req, res) => {
  const [posts, user] = await Promise.all([
    productService.getTopPosts({ limit: 10 }),
    userService.getBasicProfile(req.userId)
  ])

  // Агрегируем, трансформируем, минимизируем размер ответа
  res.json({
    user: { name: user.name, avatar: user.avatarSmall },  // маленький аватар
    posts: posts.map(p => ({
      id: p.id,
      title: p.title,
      thumbnail: p.imageSm   // маленькая картинка для мобильной сети
      // нет content, нет comments -- не нужны для карточки
    }))
  })
})

// BFF Web -- полные данные для богатого UI
app.get('/web/feed', async (req, res) => {
  // Параллельные запросы -- Promise.all, не sequential
  const [posts, user, notifications, analytics] = await Promise.all([
    productService.getPosts({ limit: 20, includeComments: true }),
    userService.getFullProfile(req.userId),
    notificationService.getUnread(req.userId),
    analyticsService.getUserStats(req.userId)
  ])

  res.json({ user, posts, notifications, analytics })
})
```

💡 **Когда применять BFF:** когда у вас более одного типа клиента с существенно разными требованиями к данным. Для простых случаев (один web-клиент) BFF добавляет сложность без явных преимуществ.

---

## Частые ошибки

### ❌ Ошибка 1: Глаголы в URL вместо существительных

Самая распространённая ошибка у разработчиков, переходящих с RPC-мышления на REST. URL должен называть **ресурс** (существительное), а действие над ним -- **HTTP-метод**.

```typescript
// ❌ RPC-стиль -- URL описывает действие
POST /getUser?id=42
POST /createOrder
POST /deleteUser?id=42
POST /updateUserEmail
GET  /getUserOrders?userId=42
```

```typescript
// ✅ RESTful -- URL описывает ресурс, HTTP-метод описывает действие
GET    /users/42                      // получить пользователя
POST   /orders                        // создать заказ
DELETE /users/42                      // удалить пользователя
PATCH  /users/42   { "email": "..." } // обновить email
GET    /users/42/orders               // заказы пользователя
```

### ❌ Ошибка 2: Отсутствие пагинации на списках

```typescript
// ❌ Возвращаем ВСЕ записи -- убьёт сервер при миллионе записей
GET /posts
// Ответ: массив из 1 000 000 постов, 500MB JSON
```

```typescript
// ✅ Всегда пагинация + разумный лимит по умолчанию
GET /posts?limit=20&cursor=abc123

// В коде: enforce максимальный лимит на стороне сервера
const limit = Math.min(parseInt(req.query.limit) || 20, 100)  // не больше 100
```

### ❌ Ошибка 3: Нет Idempotency Key на POST-запросах с побочными эффектами

```typescript
// ❌ Клиент retry после timeout → двойной платёж
POST /payments  { "amount": 5000 }
// Timeout → retry →
POST /payments  { "amount": 5000 }
// = 10 000 рублей списано вместо 5 000!
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
// ❌ v1: поле name -- строка. 100 клиентов зависят от этого
{ "name": "Ivan Petrov" }

// Через 3 месяца: поле разбили на два БЕЗ версионирования
{ "firstName": "Ivan", "lastName": "Petrov" }
// Все клиенты, читающие user.name, получают undefined
```

```typescript
// ✅ Новая версия + backward compatibility в переходный период
// GET /v1/users/42 -- по-прежнему возвращает name (не ломаем старых клиентов)
{ "name": "Ivan Petrov" }

// GET /v2/users/42 -- новый формат
{ "firstName": "Ivan", "lastName": "Petrov", "name": "Ivan Petrov" }
//                                            ↑
//                             name оставлен для клиентов, которые ещё мигрируют
```

### ❌ Ошибка 5: GraphQL без решения N+1

```typescript
// ❌ Запрос выглядит безобидно...
query { users { name posts { title } } }

// ...но у 100 пользователей вызывает 101 запрос к БД
// User.posts resolver срабатывает 100 раз независимо
```

```typescript
// ✅ DataLoader батчит все запросы за один event loop tick
const postLoader = new DataLoader(async (userIds) => {
  const posts = await db.query('SELECT * FROM posts WHERE author_id IN (?)', [userIds])
  return userIds.map(id => posts.filter(p => p.authorId === id))
})
// 100 пользователей → 2 запроса к БД (users + posts WHERE author_id IN (...))
```

### ❌ Ошибка 6: Бесполезные сообщения об ошибках

```typescript
// ❌ Клиент не понимает, что исправить
HTTP/1.1 400 Bad Request
{ "error": "Bad request" }

// ❌ Слишком много технических деталей в публичном API
HTTP/1.1 500 Internal Server Error
{ "error": "NullPointerException at com.example.UserService:42" }
```

```typescript
// ✅ Структурированные ошибки с кодом, сообщением и деталями
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

### ❌ Ошибка 7: Непоследовательные HTTP-коды ответа

```typescript
// ❌ Непредсказуемые статус-коды
POST /users → 200 (создан)
DELETE /users/42 → 200 (удалён, body: "OK")
GET /users/999 → 200 (не найден, body: { "error": "not found" })
```

```typescript
// ✅ Семантически правильные коды
POST /users          → 201 Created     (новый ресурс создан)
DELETE /users/42     → 204 No Content  (успешно удалён, тела нет)
GET /users/999       → 404 Not Found   (ресурс не существует)
GET /users/42        → 200 OK          (ресурс найден)
PUT /users/42        → 200 OK          (ресурс обновлён)
POST /payments (dup) → 409 Conflict    (idempotency key конфликт)
```

---

## Итоги

| Концепция | Ключевая мысль |
|---|---|
| **REST (Level 2)** | Ресурсы + HTTP-глаголы + статус-коды -- де-факто стандарт для публичных API |
| **HATEOAS (Level 3)** | Красиво в теории, редко полезно на практике. Остановитесь на Level 2 |
| **GraphQL** | Клиент выбирает поля. Решает over/underfetching. DataLoader -- обязателен |
| **gRPC** | Protobuf + HTTP/2. Для межсервисных вызовов -- быстрее REST в 2-10 раз |
| **Cursor pagination** | Стабильная (нет дублей) и быстрая O(log N). Для лент -- всегда cursor |
| **Token Bucket** | Баланс точности, памяти и burst-поддержки. Лучший выбор для большинства случаев |
| **JWT** | Stateless, не требует БД. Короткое время жизни + refresh tokens |
| **OAuth2** | Authorization code flow для делегированного доступа через третью сторону |
| **Idempotency key** | UUID операции от клиента. Защита от дублей при retry. Обязателен для платежей |
| **URL versioning** | `/v1/`, `/v2/`. Sunset notice за 6+ месяцев. Мониторинг трафика |
| **API Gateway** | Единый вход: auth, rate limit, logging, routing. Освобождает сервисы от cross-cutting concerns |
| **BFF Pattern** | Отдельный backend под каждый тип клиента. Оптимизирует данные под конкретные нужды |

🎯 **Главный принцип:** API -- это контракт. Контракты нарушают только с уважительными причинами, заранее, с предупреждением и периодом совместного существования. Проектируйте так, будто ваш API будут использовать тысячи команд, которых вы никогда не встретите -- делайте его очевидным, стабильным и трудно-ломаемым.
