# REST — ресурсы и URL-дизайн

## Что такое ресурс в REST?

Ресурс — это любая именованная сущность, к которой можно обратиться через сеть. Думайте о нём как о существительном: пользователь, заказ, статья, тег. Не «получить пользователей», а просто «пользователи».

Ключевая идея REST: **URL — это адрес ресурса**, а HTTP-метод — это что с ним сделать.

```
# Ресурс: пользователи
GET  /users       → получить список
POST /users       → создать нового
GET  /users/42    → получить конкретного
```

## Правила именования

| Правило | Плохо ❌ | Хорошо ✅ |
|---|---|---|
| Существительные | `/getUsers` | `/users` |
| Множественное число | `/user` | `/users` |
| Lowercase | `/UserProfile` | `/user-profile` |
| Дефисы (не underscore) | `/blog_posts` | `/blog-posts` |
| Без глаголов | `/deleteUser/5` | `DELETE /users/5` |

## Вложенные ресурсы

Если один ресурс принадлежит другому — покажите иерархию в URL:

```
GET /users/7/orders          → заказы пользователя 7
GET /posts/3/comments        → комментарии поста 3
DELETE /posts/3/comments/15  → удалить конкретный комментарий
```

**Правило:** вкладывайте не глубже 2–3 уровней.

## Query params vs путь

- **Путь** — для идентификации ресурса: `/products/42`
- **Query params** — для фильтрации и сортировки: `?category=books&sort=price`

```
✅ /products?category=electronics&maxPrice=5000
❌ /products/electronics/maxPrice/5000
```

## Примеры хороших и плохих URL

```
❌ POST /api/do_stuff?action=getUsers
✅ GET  /api/users

❌ GET  /api/users/deleteUser/5
✅ DELETE /api/users/5

❌ GET  /api/blogPosts
✅ GET  /api/blog-posts

❌ GET  /api/orders/search?q=phone
✅ GET  /api/orders?q=phone
```
