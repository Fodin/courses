# 🔥 Уровень 3: Проектирование REST API

## 🎯 Что такое REST

REST (Representational State Transfer) -- архитектурный стиль для проектирования API. REST не является стандартом или протоколом -- это набор принципов:

1. **Ресурсы** -- всё является ресурсом с уникальным URL
2. **HTTP-методы** -- CRUD операции через GET/POST/PUT/PATCH/DELETE
3. **Stateless** -- каждый запрос содержит всю информацию для обработки
4. **Единый интерфейс** -- предсказуемые URL и формат ответов

## 🔥 CRUD и HTTP-методы

```
POST   /api/users          201 Created    — Создать ресурс
GET    /api/users          200 OK         — Список ресурсов
GET    /api/users/:id      200 OK         — Один ресурс
PUT    /api/users/:id      200 OK         — Полная замена
PATCH  /api/users/:id      200 OK         — Частичное обновление
DELETE /api/users/:id      204 No Content — Удаление
```

### Формат ответа (Envelope Pattern)

```json
{
  "data": { ... },
  "meta": { "total": 150, "page": 1, "perPage": 20 }
}
```

### Формат ошибки

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

## 🔥 Пагинация

### Offset-based

```
GET /api/users?page=3&per_page=20
SQL: SELECT * FROM users LIMIT 20 OFFSET 40
```

Плюсы: можно перейти на любую страницу. Минусы: медленно на больших offset.

### Cursor-based

```
GET /api/users?after=eyJpZCI6NDB9&limit=20
SQL: SELECT * FROM users WHERE id > 40 ORDER BY id LIMIT 21
```

Плюсы: стабильно при вставках, быстро. Минусы: нельзя перейти на произвольную страницу.

### Link Headers (RFC 5988)

```
Link: </api/users?page=2>; rel="next",
      </api/users?page=8>; rel="last"
X-Total-Count: 150
```

## 🔥 Сортировка и фильтрация

### Сортировка

```
GET /api/users?sort=-createdAt,name
// Минус = DESC, без минуса = ASC
// SQL: ORDER BY created_at DESC, name ASC
```

### Фильтрация

```
GET /api/users?filter[status]=active&filter[age][gte]=18
// SQL: WHERE status = 'active' AND age >= 18
```

### Sparse Fieldsets

```
GET /api/users?fields=id,name,email
// SQL: SELECT id, name, email FROM users
```

## 🔥 Версионирование API

### 1. URL Versioning (самый популярный)
```
/api/v1/users
/api/v2/users
```

### 2. Header Versioning
```
X-API-Version: 2
```

### 3. Content Negotiation
```
Accept: application/vnd.myapi.v2+json
```

### Deprecation

```
Deprecation: true
Sunset: Sat, 01 Jun 2025 00:00:00 GMT
Link: </api/v2/users>; rel="successor-version"
```

## ⚠️ Частые ошибки новичков

### Ошибка 1: Глаголы в URL

```
// ❌ Плохо:
GET /api/getUsers
POST /api/createUser
DELETE /api/deleteUser/42

// ✅ Хорошо: существительные + HTTP-методы
GET /api/users
POST /api/users
DELETE /api/users/42
```

### Ошибка 2: Неправильные статус-коды

```
// ❌ Всегда возвращают 200
POST /api/users -> 200 { id: 1 }

// ✅ Правильный код: 201 Created + Location
POST /api/users -> 201 Created
Location: /api/users/1
```

### Ошибка 3: Offset-based пагинация без total count

```
// ❌ Клиент не знает, сколько страниц
{ "data": [...], "page": 1 }

// ✅ Включайте meta
{ "data": [...], "meta": { "total": 150, "page": 1, "totalPages": 8 } }
```

### Ошибка 4: Вложенные ресурсы слишком глубоко

```
// ❌ Слишком глубокая вложенность
/api/users/42/posts/7/comments/3/likes

// ✅ Максимум 2 уровня
/api/posts/7/comments
/api/comments/3/likes
```

## 💡 Best Practices

1. **Используйте множественное число** для ресурсов: `/api/users`, не `/api/user`
2. **Вкладывайте** только прямые отношения: `/api/users/42/posts`
3. **Используйте cursor-based пагинацию** для больших наборов данных
4. **Всегда возвращайте консистентный формат** (data + meta + error)
5. **Версионируйте API** с первого дня
6. **Документируйте** через OpenAPI/Swagger
7. **Ограничивайте per_page** максимальным значением (100)
