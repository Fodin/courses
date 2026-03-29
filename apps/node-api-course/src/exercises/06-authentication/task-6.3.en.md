# Task 6.3: Refresh Tokens

## 🎯 Goal

Implement a refresh token system: access/refresh pair, token rotation, reuse detection, and revocation.

## Requirements

1. Explain the token pair: access (15 min, in memory) and refresh (7 days, httpOnly cookie)
2. Implement token rotation: on refresh, a new refresh token is issued, the old one is revoked
3. Show reuse detection: reuse of a revoked token -> revoke the entire family
4. Show DB storage: hash(token), userId, family, revoked, expiresAt
5. Explain why access tokens shouldn't be stored in localStorage

## Checklist

- [ ] Access token: short TTL, contains claims, stored in memory
- [ ] Refresh token: long TTL, opaque, httpOnly cookie, stored in DB (hash)
- [ ] Rotation: old refresh revoked, new one issued on each refresh
- [ ] Reuse detection: reuse of revoked token -> revoke entire family
- [ ] DB: token hash, userId, family, revoked flag

## How to Verify

Click "Run" and verify that: the login -> refresh -> reuse detection cycle is shown completely, and rotation and theft detection are explained.
