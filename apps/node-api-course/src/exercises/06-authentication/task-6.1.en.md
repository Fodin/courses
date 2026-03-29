# Task 6.1: Cookie Sessions

## 🎯 Goal

Implement session-based authentication via cookies: express-session setup, cookie options, session store, and full login/request/logout cycle.

## Requirements

1. Configure `express-session` with: secret, resave, saveUninitialized, cookie options
2. Configure cookie: `secure: true`, `httpOnly: true`, `sameSite: 'lax'`, `maxAge`
3. Show the full cycle: login (create session in Redis) -> authenticated request -> logout (destroy)
4. Explain the Set-Cookie header with HttpOnly, Secure, SameSite flags
5. Compare session stores: MemoryStore (dev only), RedisStore, PostgresStore

## Checklist

- [ ] express-session configured with secure cookie options
- [ ] Login: password check -> session creation -> Set-Cookie with connect.sid
- [ ] Authenticated request: Cookie -> Redis GET -> req.session.userId
- [ ] Logout: req.session.destroy() -> Redis DEL -> Set-Cookie: Max-Age=0
- [ ] MemoryStore marked as dangerous for production

## How to Verify

Click "Run" and verify that: the full login/request/logout cycle is shown with Redis operations and Set-Cookie headers.
