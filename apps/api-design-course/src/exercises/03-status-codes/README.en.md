# Status Codes and Error Handling

## Why Correct Status Codes Matter

An HTTP status is not just a number. It is a signal to the entire chain: browser, CDN, monitoring, client code. When an API returns 200 on an error — monitoring breaks, retry logic breaks, the developer experience breaks.

## Status Code Groups

| Group | Meaning | Examples |
|--------|-------|---------|
| **1xx** | Informational | 100 Continue, 101 Switching Protocols |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirects | 301 Moved Permanently, 304 Not Modified |
| **4xx** | Client Errors | 400, 401, 403, 404, 409, 422, 429 |
| **5xx** | Server Errors | 500, 502, 503, 504 |

## Most Important Codes for REST API

| Code | Name | When |
|-----|-----|-------|
| **200** | OK | GET succeeded, PUT/PATCH returned the updated object |
| **201** | Created | POST created a new resource |
| **204** | No Content | DELETE, PUT/PATCH without a response body |
| **400** | Bad Request | Broken JSON, wrong parameter type |
| **401** | Unauthorized | No token, token invalid |
| **403** | Forbidden | Token exists, but no permission |
| **404** | Not Found | Resource does not exist |
| **409** | Conflict | Duplicate, version conflict |
| **422** | Unprocessable Entity | Field validation errors |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Internal Server Error | Bug in server code |

## 200 vs 201 vs 204

- **200** — request completed, response contains data
- **201** — a new resource was created (POST), the `Location` header contains its URL
- **204** — success, but no response body (DELETE, some PUT/PATCH)

## 400 vs 422

- **400** — request is "broken": invalid JSON, wrong type, missing required header
- **422** — JSON is correct, but values fail business validation (email has wrong format, password is too short)

## 401 vs 403

- **401** — "who are you?" — client is not authenticated, no token
- **403** — "we know who you are, but you can't come in" — no permission for this action

## Structured Errors (RFC 7807)

The Problem Details standard defines a unified error format:

```json
{
  "type": "https://api.example.com/errors/validation-failed",
  "title": "Validation Failed",
  "status": 422,
  "detail": "One or more fields did not pass validation.",
  "instance": "/api/users",
  "errors": [
    { "field": "email", "message": "Must be a valid email address" }
  ]
}
```

Content-Type: `application/problem+json`
