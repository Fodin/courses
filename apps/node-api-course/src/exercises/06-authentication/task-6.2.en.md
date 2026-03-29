# Task 6.2: JWT

## 🎯 Goal

Implement JWT authentication: token structure, creation, verification, and guard middleware.

## Requirements

1. Show JWT structure: Header (alg, typ) + Payload (sub, role, iat, exp) + Signature
2. Demonstrate the full cycle: login -> get token -> request with Bearer token -> verification
3. Show handling of expired/invalid tokens (TokenExpiredError, JsonWebTokenError)
4. Implement `authGuard` middleware: extract token from Authorization header, jwt.verify, req.user
5. Show a decoded payload example

## Checklist

- [ ] JWT structure: base64(header).base64(payload).signature
- [ ] Login returns accessToken + expiresIn
- [ ] Bearer token extracted from `Authorization: Bearer <token>`
- [ ] jwt.verify decodes payload into req.user
- [ ] TokenExpiredError -> 401 "Token expired", invalid -> 401 "Invalid token"

## How to Verify

Click "Run" and verify that: JWT structure is broken down, the login -> request -> expired cycle is shown completely, and authGuard middleware is implemented.
