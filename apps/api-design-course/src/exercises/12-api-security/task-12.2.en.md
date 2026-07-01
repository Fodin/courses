# Task 12.2: Access Matrix (RBAC / scopes)

## Goal

Build an interactive authorization matrix. The student picks an "identity" (role + token scopes) and sees which endpoints return `200`, which `403`, and — with no token — `401`. The goal is to feel the difference between authentication and authorization, and between the 401/403 codes.

## Requirements

1. A list of 5–6 endpoints with required rights, for example:
   - `GET /orders` — requires scope `orders:read`
   - `POST /orders` — requires scope `orders:write`
   - `DELETE /orders/{id}` — requires role `admin`
   - `GET /profile` — requires scope `profile:read`
   - `GET /admin/stats` — requires role `admin`
2. An "identity" switch: `Anonymous (no token)`, `viewer`, `editor`, `admin` — each with its own role and scopes
3. For the chosen identity, compute and show for each endpoint the outcome: `200 OK` (green), `403 Forbidden` (orange), or `401 Unauthorized` (red, only for anonymous)
4. Next to each result — a short "why" (which scope/role was missing)
5. A token panel: show the decoded "token" of the current identity (role + scope list), or a "no token" note for anonymous
6. A legend: 401 = "I don't know who you are"; 403 = "I know, but you may not"; 200 = "allowed"

## Checklist

- [ ] Endpoint table showing the required right
- [ ] Switching between anonymous/viewer/editor/admin
- [ ] For anonymous, all protected endpoints → 401
- [ ] For authenticated ones — 200 or 403 depending on scope/role
- [ ] A "why" explanation for each 403
- [ ] Current token panel (role + scopes)
- [ ] 401/403/200 legend

## Permission logic (reference)

| Identity | role | scopes |
|---|---|---|
| Anonymous | — | — (no token → 401 everywhere) |
| viewer | viewer | `orders:read`, `profile:read` |
| editor | editor | `orders:read`, `orders:write`, `profile:read` |
| admin | admin | `orders:read`, `orders:write`, `profile:read` (+ the admin role grants admin endpoints) |

Check rule per endpoint: first "is there a token?" (no → 401), then "is the required scope/role present?" (no → 403, yes → 200).

## How to check yourself

1. Pick "Anonymous" — all protected endpoints are red (401).
2. Pick `viewer` — `GET /orders` is green, `POST /orders` is orange (403, no `orders:write`).
3. Pick `editor` — `POST /orders` is now green, but `DELETE /orders/{id}` and `/admin/stats` are 403 (admin role needed).
4. Pick `admin` — everything is green.

## Hints

- Describe endpoints as an array of objects `{ method, path, requiredScope?, requiredRole? }`.
- Decision function: `if (!token) return 401; if (requiredRole && token.role !== requiredRole) return 403; if (requiredScope && !token.scopes.includes(requiredScope)) return 403; return 200`.
- Colors: 200 `#22c55e`, 403 `#f59e0b`, 401 `#ef4444`.
