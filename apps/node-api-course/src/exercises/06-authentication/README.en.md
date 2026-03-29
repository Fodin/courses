# 🔥 Level 6: Authentication

## 🎯 Authentication vs Authorization

- **Authentication** -- "Who are you?" (identity verification)
- **Authorization** -- "What are you allowed to do?" (permission checking)

## 🔥 Cookie Sessions

Server creates session in Redis, sends session ID in httpOnly cookie. Browser sends cookie automatically.

```typescript
app.use(session({
  store: new RedisStore({ client: redis }),
  cookie: { secure: true, httpOnly: true, sameSite: 'lax' }
}))
```

## 🔥 JWT

JWT = Header.Payload.Signature. Short-lived (15min), contains user ID and role.

```typescript
const token = jwt.sign({ sub: userId, role }, secret, { expiresIn: '15m' })
const decoded = jwt.verify(token, secret)
```

## 🔥 Refresh Tokens

Access Token: short-lived (15min), in memory. Refresh Token: long-lived (7 days), in httpOnly cookie. Token rotation with theft detection.

## 🔥 OAuth 2.0

Authorization Code Flow: redirect -> user consents -> callback with code -> exchange for token -> get user info.

## 🔥 RBAC

```typescript
const ROLES = { admin: ['users.delete'], editor: ['posts.write'], user: ['posts.read'] }
function requirePermission(...perms) {
  return (req, res, next) => {
    if (!perms.every(p => ROLES[req.user.role].includes(p))) return res.status(403).end()
    next()
  }
}
```

## ⚠️ Common Beginner Mistakes

- JWT in localStorage (XSS risk) -- use httpOnly cookies
- Sensitive data in JWT payload (it's base64, not encrypted!)
- Missing state parameter in OAuth (CSRF vulnerability)

## 💡 Best Practices

1. Refresh token rotation with theft detection
2. httpOnly cookies for tokens
3. Short TTL for access tokens (15min)
4. RBAC with granular permissions
5. bcrypt/argon2 for password hashing
