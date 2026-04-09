# HTTP Methods and Idempotency

## Why Different Methods?

HTTP is not just a way to transfer data. It is a protocol with semantics: each method carries meaning understood by servers, browsers, proxies, and caches. Using the correct method is a way of "speaking" to infrastructure in the same language.

## Seven Methods and Their Roles

| Method | Role | Typical URL |
|---|---|---|
| **GET** | Get a resource | `GET /users/42` |
| **POST** | Create a resource | `POST /users` |
| **PUT** | Replace entirely | `PUT /users/42` |
| **PATCH** | Partially update | `PATCH /users/42` |
| **DELETE** | Delete | `DELETE /users/42` |
| **HEAD** | Metadata without body | `HEAD /files/report.pdf` |
| **OPTIONS** | Allowed methods | `OPTIONS /api/users` |

## Safe Methods

A **safe method** does not change server state. You can call it as many times as you want — data will not change.

Safe: **GET, HEAD, OPTIONS**

```
✅ GET /users          — just reads, changes nothing
✅ HEAD /files/photo   — headers only, no body
❌ GET /users/delete/5 — GET with mutation — a violation!
```

## Idempotency

An **idempotent method** — a repeated call with the same data yields the same result.

```
PUT /tasks/1 { "title": "Buy milk" }
PUT /tasks/1 { "title": "Buy milk" }  ← same result ✅

DELETE /tasks/1
DELETE /tasks/1  ← resource already deleted, but no error ✅

POST /tasks { "title": "New task" }
POST /tasks { "title": "New task" }  ← will create a SECOND task ❌
```

Idempotent: **GET, PUT, DELETE, HEAD, OPTIONS**
Not idempotent: **POST, PATCH** (in the general case)

## PUT vs PATCH

This is the most common point of confusion:

- **PUT** — replace the entire label. You send the whole object, the server replaces everything.
- **PATCH** — edit the label. You send only the changed fields.

```
# PUT — replacing the entire object:
PUT /users/42
{ "name": "Ivan", "email": "ivan@new.com", "role": "admin" }

# PATCH — changing only email:
PATCH /users/42
{ "email": "ivan@new.com" }
```

## HEAD and OPTIONS: Why Are They Needed?

**HEAD** — check a file without downloading it. The browser can learn the file size and type before loading.

**OPTIONS** — CORS preflight. Before a "dangerous" cross-origin request, the browser automatically sends OPTIONS to find out: "does the server allow this request?"
