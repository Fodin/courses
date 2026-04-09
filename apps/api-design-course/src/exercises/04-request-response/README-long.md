# Тело запроса и ответа: полное руководство

## Content-Type и Accept: говорим на одном языке

Представьте, что вы заказываете еду в ресторане. `Content-Type` — это язык, на котором написан ваш заказ (вы пишете по-русски). `Accept` — это список языков, на которых вы принимаете меню обратно (хочу на русском или английском).

```http
POST /api/products
Content-Type: application/json   ← «Моё тело — JSON»
Accept: application/json         ← «Хочу получить ответ в JSON»
```

Если сервер не может ответить в нужном формате — он возвращает `406 Not Acceptable`. Если не может прочитать тело — `415 Unsupported Media Type`.

Для ошибок существует отдельный Content-Type:
```http
Content-Type: application/problem+json  ← RFC 7807 ошибки
Content-Type: application/merge-patch+json  ← PATCH-запросы
```

---

## JSON-конвенции: camelCase vs snake_case

### Выбери одно и не изменяй

```
camelCase: userId, createdAt, isActive, totalPages
snake_case: user_id, created_at, is_active, total_pages
```

Оба варианта корректны — важна консистентность. Для JS/TS клиентов предпочтителен **camelCase**: он нативен для JavaScript-объектов и не требует трансформации.

### ⚠️ Антипаттерн: смешивание стилей

```json
// ❌ Хаос
{
  "UserId": 42,
  "user_name": "ivan",
  "UserEmail": "ivan@example.com",
  "is_active": true,
  "createdAt": "2024-01-15"
}

// ✅ Единый camelCase
{
  "id": 42,
  "name": "ivan",
  "email": "ivan@example.com",
  "isActive": true,
  "createdAt": "2024-01-15T00:00:00Z"
}
```

💡 Если бэкенд использует snake_case (Python/Go), настройте сериализатор на автоматическую трансформацию при выдаче API-ответов.

---

## Структура ответа: коллекция vs одиночный ресурс

### Одиночный ресурс — flat

```json
// GET /api/users/42
{
  "id": 42,
  "name": "Иван Петров",
  "email": "ivan@example.com",
  "role": "admin",
  "createdAt": "2024-01-10T08:00:00Z"
}
```

Прямой доступ: `user.id`, `user.email`. Не нужна обёртка `user.data.id`.

### Коллекция — с envelope и meta

```json
// GET /api/users?page=1&perPage=20
{
  "data": [
    { "id": 42, "name": "Иван" },
    { "id": 43, "name": "Мария" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 20,
    "totalPages": 8
  }
}
```

Envelope оправдан, потому что нужно вернуть и данные, и метаданные пагинации одновременно.

---

## Envelope Pattern: `{ data, meta, errors }`

### Когда использовать Envelope

```
┌─────────────────────────────────────────────────────┐
│                  API Response                       │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐   │
│  │  data    │   │  meta    │   │  errors      │   │
│  │          │   │          │   │              │   │
│  │ Основные │   │ total    │   │ type         │   │
│  │ данные   │   │ page     │   │ title        │   │
│  │          │   │ perPage  │   │ detail       │   │
│  └──────────┘   └──────────┘   └──────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Оправдан для:**
- Коллекций с пагинацией (нужна meta)
- Ответов с предупреждениями (`warnings: [...]`)
- HATEOAS-ссылок (`links: { next, prev, self }`)
- Когда нужна единая структура для всех ответов

**Избыточен для:**
- Одиночных ресурсов без дополнительных метаданных
- Простых операций создания/обновления

---

## Flat Response: минимализм без обёрток

```
Запрос                    Ответ
GET /products/42   →   { id: 42, name: "...", price: ... }
DELETE /products/42 →  (204 No Content, пустое тело)
POST /products      →  { id: 43, name: "...", createdAt: ... }
```

### Схема потока данных

```
Клиент ──→ HTTP Request ──→ Сервер
           Content-Type     ↓
           Authorization    Обработка
                            ↓
Клиент ←── HTTP Response ←── Сервер
           Status: 200/201  Тело: JSON
           Content-Type
```

---

## Partial Updates: PATCH vs PUT

### PUT — полная замена

```json
// PUT /api/products/42
// НУЖНО передать ВСЕ поля, иначе они обнулятся
{
  "name": "Ноутбук",
  "price": 89990,
  "description": "...",
  "categoryId": 3,
  "inStock": true,
  "stockCount": 5
}
```

### PATCH — частичное обновление (JSON Merge Patch, RFC 7396)

```json
// PATCH /api/products/42
// Content-Type: application/merge-patch+json
// Только изменённые поля:
{
  "price": 79990,
  "inStock": false
}
```

### Семантика null в Merge Patch

```json
// null = "удалить поле" (установить в отсутствие значения)
{
  "description": null   // ← поле description будет очищено
}

// Отсутствие поля = "не трогать"
{
  "price": 5990         // ← только цена изменится, description без изменений
}
```

### JSON Patch (RFC 6902) — для сложных операций

```json
// Content-Type: application/json-patch+json
[
  { "op": "replace", "path": "/price", "value": 79990 },
  { "op": "add", "path": "/tags/-", "value": "sale" },
  { "op": "remove", "path": "/discount" }
]
```

JSON Patch мощнее (поддерживает операции на массивах), но сложнее для понимания и реализации. Для большинства API достаточно Merge Patch.

---

## Null vs отсутствие поля

Это принципиально разные вещи:

```json
// Вариант 1: поле есть, значение явно пустое
{ "id": 1, "deletedAt": null }

// Вариант 2: поле отсутствует
{ "id": 1 }
```

| | `"deletedAt": null` | поле отсутствует |
|--|--|--|
| Смысл | «удалён в неизвестный момент» | «удаление не применимо» |
| TypeScript | `deletedAt: string \| null` | `deletedAt?: string` |
| Merge Patch | «очистить поле» | «не трогать» |

📌 Используйте `null` когда поле применимо, но значение пусто. Опускайте поле, когда оно не применимо для данного типа ресурса.

---

## Timestamps: ISO 8601 обязателен

```
❌ Unix timestamp: 1712345678
   Проблемы: секунды или миллисекунды? Какой timezone?

❌ Локальная дата: "15.01.2024 10:30"
   Проблемы: локаль? timezone? формат парсинга?

✅ ISO 8601 UTC: "2024-01-15T10:30:00Z"
   Плюсы: однозначно, человекочитаемо, все библиотеки парсят нативно
```

```json
{
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-20T14:45:22Z",
  "expiresAt": "2024-04-15T00:00:00Z"
}
```

Всегда UTC (суффикс `Z`). Конвертацию в локальное время делает клиент.

---

## Вложенные ресурсы: expand/include паттерн

Иногда клиенту нужны связанные данные. Две стратегии:

### По умолчанию — только ID

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

### По запросу — expand связанных объектов

```json
// GET /api/orders/1?expand=user,product
{
  "id": 1,
  "user": {
    "id": 42,
    "name": "Иван",
    "email": "ivan@example.com"
  },
  "product": {
    "id": 7,
    "name": "Мышь",
    "price": 2990
  },
  "quantity": 2,
  "total": 17980
}
```

Этот паттерн избегает N+1 проблемы без усложнения стандартных ответов.

---

## ⚠️ Типичные ошибки начинающих

### 1. Матрёшка — избыточная вложенность

```json
// ❌ Клиент пишет response.payload.user.data.id
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

// ✅ Клиент пишет user.id
{
  "id": 42,
  "name": "Иван"
}
```

**Почему проблема:** каждый лишний уровень вложенности без смысла — это сложность без пользы.

### 2. Boolean как строка или число

```json
// ❌ "true" — это строка! if (isActive) → всегда true, даже для "false"
{ "isActive": "true", "isVerified": 1, "isPremium": "yes" }

// ✅ Настоящие boolean
{ "isActive": true, "isVerified": true, "isPremium": false }
```

**Почему проблема:** `"false"` — truthy в JavaScript. `if (data.isActive)` вернёт `true` для строки `"false"`.

### 3. Разные форматы ошибок на разных endpoints

```json
// ❌ Endpoint A
{ "error": "Not found" }

// ❌ Endpoint B  
{ "success": false, "message": "Forbidden" }

// ✅ Единый RFC 7807 для всех
{
  "type": "https://api.example.com/errors/not-found",
  "title": "Resource Not Found",
  "status": 404
}
```

**Почему проблема:** клиент вынужден писать разную логику обработки ошибок для каждого endpoint.

### 4. Коллекция без метаданных пагинации

```json
// ❌ Клиент не знает, сколько страниц
{ "users": [...] }

// ✅ Данные + мета
{ "data": [...], "meta": { "total": 150, "page": 1, "totalPages": 8 } }
```

**Почему проблема:** UI не может построить пагинатор. Следующая страница — угадывание.

---

## 💡 Практические советы

- **Версионируйте API в URL**: `/api/v1/...` — так можно менять формат ответа без поломки старых клиентов
- **Возвращайте созданный объект из POST**: клиент не должен делать дополнительный GET чтобы узнать id
- **DELETE возвращает 204**: не нужно тело `{ "success": true }` — 204 уже означает успех
- **Всегда добавляйте `updatedAt` в ответ PATCH**: клиент знает, когда произошло обновление
- **Документируйте, что означает null**: в каждом поле, которое может быть null, опишите семантику
