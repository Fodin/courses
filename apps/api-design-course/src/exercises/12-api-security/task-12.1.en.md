# Task 12.1: JWT Decoder

## Goal

Build an interactive JWT decoder that visualizes the anatomy of a Bearer token: three parts, the claims in the payload, its lifetime, and the fact that the payload is **not encrypted** — only Base64URL-encoded.

## Requirements

1. A text field to paste a JWT (defaulting to a valid example token)
2. Split the token by dots into three parts and highlight them in different colors: header, payload, signature
3. Decode header and payload from Base64URL and show them as formatted JSON
4. Parse the key claims and show them in a table: `sub`, `iss`, `exp`, `iat`, `scope`/`role` with a human-readable explanation of each
5. Compute the expiry status from `exp`: "valid" (green) or "expired" (red), showing time remaining
6. A warning block: the payload is readable by anyone — don't put secrets in it; the signature only prevents forgery
7. Show how the token travels in a request: the `Authorization: Bearer <token>` line
8. On an invalid token (not 3 parts / broken Base64) — a graceful error message, no crash

## Checklist

- [ ] Input field with a default example token
- [ ] Token split into 3 color-highlighted parts
- [ ] header and payload decoded into readable JSON
- [ ] Claims table with explanations (sub, iss, exp, iat, scope/role)
- [ ] exp status: valid/expired + time remaining
- [ ] "payload is not encrypted" warning
- [ ] `Authorization: Bearer ...` header shown
- [ ] Invalid token handled without crashing

## How to check yourself

1. Paste the example token — you'll see header `{"alg":"HS256"}` and a payload with claims.
2. Change one character in the payload — the JSON changes but the "signature" stays the same (demo: the server-side signature won't match → token rejected).
3. Use a token with `exp` in the past — the status becomes "expired."
4. Clear the field or enter garbage — you'll see an error message, not a blank screen.

## Hints

- Base64URL differs from regular Base64: `-` instead of `+`, `_` instead of `/`, no trailing `=`. Replace the characters and add padding before `atob`.
- `exp` and `iat` are Unix timestamps in **seconds**; to compare with `Date.now()` (milliseconds) multiply by 1000.
- Parsing: `const [h, p, s] = token.split('.')`. If there aren't three parts, it isn't a JWT.
- Decode: `JSON.parse(atob(base64urlToBase64(part)))` inside `try/catch`.
