# REST — Resources and URL Design

## What is a Resource in REST?

A resource is any named entity that can be addressed over a network. Think of it as a noun: user, order, article, tag. Not "get users", but just "users".

The key idea of REST: **a URL is a resource's address**, and the HTTP method is what to do with it.

```
# Resource: users
GET  /users       → get list
POST /users       → create new
GET  /users/42    → get specific one
```

## Naming Rules

| Rule | Bad ❌ | Good ✅ |
|---|---|---|
| Nouns | `/getUsers` | `/users` |
| Plural | `/user` | `/users` |
| Lowercase | `/UserProfile` | `/user-profile` |
| Hyphens (not underscore) | `/blog_posts` | `/blog-posts` |
| No verbs | `/deleteUser/5` | `DELETE /users/5` |

## Nested Resources

If one resource belongs to another — show the hierarchy in the URL:

```
GET /users/7/orders          → orders of user 7
GET /posts/3/comments        → comments on post 3
DELETE /posts/3/comments/15  → delete a specific comment
```

**Rule:** nest no deeper than 2–3 levels.

## Query Params vs Path

- **Path** — for resource identification: `/products/42`
- **Query params** — for filtering and sorting: `?category=books&sort=price`

```
✅ /products?category=electronics&maxPrice=5000
❌ /products/electronics/maxPrice/5000
```

## Examples of Good and Bad URLs

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
