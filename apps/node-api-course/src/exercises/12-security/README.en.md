# 🔥 Level 12: API Security

## 🎯 Three Directions

1. **Helmet & Headers** -- protection via HTTP headers (CSP, HSTS, X-Frame-Options)
2. **Input Sanitization** -- injection prevention (SQL, NoSQL, XSS)
3. **CSRF & Advanced** -- CSRF protection, parameter pollution, ReDoS

## 🔥 Helmet

```typescript
app.use(helmet({
  contentSecurityPolicy: { directives: { defaultSrc: ["'self'"] } },
  hsts: { maxAge: 31536000, includeSubDomains: true }
}))
```

## 🔥 Injection Prevention

Parameterized queries for SQL, express-mongo-sanitize for NoSQL, xss/DOMPurify for XSS.

## 🔥 CSRF & Advanced

CSRF tokens, SameSite cookies, hpp for parameter pollution, RE2 for ReDoS.

## ⚠️ Common Beginner Mistakes

- Disabling Helmet/CSP for convenience
- Client-only validation
- Secrets in source code
- Verbose errors in production

## 💡 Best Practices

1. Helmet always enabled with proper CSP
2. Parameterized queries always
3. Server-side validation with Zod/Joi
4. Rate limiting on all endpoints
5. Secrets only in environment variables
