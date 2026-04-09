# Тело запроса и ответа

## JSON как стандарт для REST API

JSON — де-факто стандарт для современных REST API. Заголовок `Content-Type: application/json` обязателен при отправке тела запроса. В ответе — тоже. Без него клиент не знает, как парсить данные.

```http
POST /api/products
Content-Type: application/json
Accept: application/json

{ "name": "Товар", "price": 999 }
```

## Конвенции именования полей

**Выберите один стиль и придерживайтесь его везде.**

| Стиль | Пример | Где популярен |
|-------|--------|---------------|
| **camelCase** | `userId`, `createdAt` | JavaScript, TypeScript |
| **snake_case** | `user_id`, `created_at` | Python, Ruby, Go |

Для JS/TS клиентов — **camelCase**. Главное — никогда не смешивать в одном API.

## Envelope vs Flat

**Envelope** — данные завёрнуты в объект:
```json
{ "data": [...], "meta": { "total": 100 } }
```

**Flat** — данные напрямую:
```json
[...]  // или { "id": 1, "name": "..." } для одиночного ресурса
```

Envelope оправдан для коллекций с пагинацией. Flat — для одиночных ресурсов и простых ответов.

## Partial Updates (PATCH)

PATCH передаёт только изменённые поля. PUT заменяет весь ресурс.

```json
// PATCH /api/products/42
// Меняем только цену, остальные поля не трогаем:
{ "price": 5990 }
```

Стандарт для PATCH — **JSON Merge Patch** (RFC 7396): `Content-Type: application/merge-patch+json`.
