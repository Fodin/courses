# API Security: A Complete Guide

## Analogy: the airport

Picture a passenger moving through an airport. It's the best model for a protected API, because security here is not one wall but a **sequence of independent checkpoints**, each closing its own class of threats.

1. **Check-in desk.** You show your passport — the system confirms you are who you claim and issues a boarding pass. This is **authentication**: exchanging credentials for a token.
2. **The gate.** The boarding pass lets you onto your flight, but not into the cockpit or the cargo hold. This is **authorization**: the token grants strictly defined rights.
3. **The lock on your suitcase.** Even if the bag is intercepted on the belt, the contents can't be read without the key. This is **encryption (TLS)**: traffic is sealed in transit.
4. **Security cameras.** They record everything so an incident can be reconstructed later. This is **logging**: the audit trail.

Remove any checkpoint and a hole appears: without check-in anyone boards, without gates an economy passenger reaches the cockpit, without the lock the bag is opened, without cameras the incident goes unnoticed.

## The fifth REST constraint: layering

The four classic REST constraints (client-server, stateless, cacheable, uniform interface) boost scalability but **deliberately** say nothing about security. Roy Fielding adds a fifth — **layering**: the system is assembled from intermediary layers. Proxies, gateways, and auth middleware sit between client and business logic and take on identity checks, permissions, encryption, and audit. Business code should not re-invent security in every handler — it relies on the layer.

```mermaid
graph LR
  C[Client] --> G[API Gateway<br/>TLS + auth] --> M[Middleware<br/>scope check] --> H[Handler<br/>business logic] --> DB[(DB)]
```

---

## 1. Authentication

Authentication answers **"who sent the request?"**. Without it a request is anonymous, and anonymity means no accountability: an attacker floods endpoints and brute-forces passwords leaving no trace. The minimum for any protected endpoint is some authentication scheme.

### Basic Authentication

A standard since 1999 (RFC 2617). The client joins username and password with a colon and Base64-encodes them:

```
alice:password123  →  YWxpY2U6cGFzc3dvcmQxMjM=

GET /books HTTP/1.1
Host: example.com
Authorization: Basic YWxpY2U6cGFzc3dvcmQxMjM=
```

Why Base64? **Not for security** — Base64 is trivially decoded. It only converts the login/password (which may contain a colon or unusual characters) into an HTTP-header-safe ASCII set so proxies and load balancers don't corrupt the value.

The server: checks the header → decodes → splits on `:` → validates → accepts or returns `401`. Basic is acceptable only **over TLS** and for internal/legacy systems where simplicity beats flexibility. Main drawback: credentials travel on every request and can't be revoked without changing the password.

### Bearer tokens

The idea: log in once, then present a **token**.

```
POST /login {user, pass}  →  200 { "token": "abc..." }

GET /orders
Authorization: Bearer abc...
```

"Bearer" means: whoever carries the token gets access — so the token is as valuable as a key and must live only over TLS. The server stays stateless: everything needed is either in the token (JWT) or checked against a store (opaque token).

### JSON Web Token (JWT)

A JWT is a self-contained Bearer token. Three dot-separated parts, each Base64URL:

```
header . payload . signature
```

- **header** — signing algorithm: `{"alg":"HS256","typ":"JWT"}`
- **payload** — claims (statements about the user):

```json
{
  "sub": "42",                 // subject — who this is
  "iss": "https://auth.shop",  // issuer — who issued it
  "iat": 1700000000,           // issued at
  "exp": 1700003600,           // expiration
  "scope": "orders:read orders:write",
  "role": "editor"
}
```

- **signature** — `header.payload` signed with the server's secret (HMAC) or a private key (RSA/ECDSA).

Key properties that are often misunderstood:

| Claim | True? |
|---|---|
| A JWT is encrypted | ❌ No. The payload is plain Base64, readable by anyone |
| A JWT is tamper-proof | ✅ Yes. Without the secret you can't recreate a valid signature |
| You can put passwords/secrets in a JWT | ❌ No. Visible to anyone holding the token |
| A JWT can be revoked instantly | ⚠️ Hard. It's valid until `exp`; revocation needs a blacklist/short TTL |

Hence the practice: short `exp` (minutes) on the access token + a long-lived refresh token used to mint new access tokens.

---

## 2. Authorization

Authentication said "this is Alice." Authorization decides **what Alice may do**. Conflating them is a classic hole: "logged in, so anything goes."

### RBAC — Role-Based Access Control

Rights are tied to **roles**, roles to users.

```
admin   → can do everything
editor  → create/edit articles
viewer  → read only
```

Check: "does the user have a role permitted for this operation?". Simple and clear, but coarse: if you need exceptions ("an editor may edit only their own articles"), the number of roles explodes.

### ABAC — Attribute-Based Access Control

The decision uses **attributes**: of the user (department, region), the resource (owner, classification), the environment (time, IP). A rule like: "an order may be edited by its owner, during business hours, from the corporate network." Flexible and precise, but harder to implement and debug.

### OAuth 2.0 scopes

When a **third-party app** acts on a user's behalf, granting it full access is dangerous. A scope is an explicit, narrow list of permissions in the token:

```
scope: "orders:read profile:read"
```

The endpoint `POST /orders` requires the scope `orders:write`. It's not in the token → `403 Forbidden`, even if the user themselves is allowed to create orders. A scope limits not the user but the **specific token/app** (principle of least privilege).

### 401 vs 403 — don't confuse them

```mermaid
graph LR
  R[Request] --> Q1{Token present<br/>and valid?}
  Q1 -- No --> E401[401 Unauthorized]
  Q1 -- Yes --> Q2{Has rights<br/>scope/role?}
  Q2 -- No --> E403[403 Forbidden]
  Q2 -- Yes --> OK[200 OK]
```

- **401 Unauthorized** — "I don't know who you are": no token, expired, forged. The client should log in / refresh the token.
- **403 Forbidden** — "I know who you are, but you may not": token valid, rights insufficient. Re-logging in is pointless.

Privacy nuance: sometimes `404` is better than `403`, so as not to confirm the resource's existence to outsiders.

---

## 3. Encryption: TLS/SSL

TLS (its old name is SSL) encrypts the channel between client and server and gives three guarantees:

- **Confidentiality** — intercepted traffic is unreadable.
- **Integrity** — tampering in transit is detected.
- **Server authentication** — the certificate proves you're talking to the right host, not an impostor.

Without TLS all prior work is voided: a Bearer token and a Basic login are visible in the clear to anyone on the packet's path (Wi-Fi, ISP, proxy). Intercept the token and you have access.

Rules:
- In production the API is reachable **only over `https://`**. Requests to `http://` are redirected to `https` or rejected.
- The `Strict-Transport-Security` header (HSTS) forbids the browser from falling back to http.
- Secrets (JWT signing keys, DB passwords) live in a secrets store, not in code/repository.

**Integrity separately.** For critical operations (payments, webhooks) a body signature is added on top of TLS (e.g. an HMAC in an `X-Signature` header): the receiver recomputes the signature and confirms the body wasn't altered and the sender is who they claim.

---

## 4. Logging

Logs are the API's security cameras. They have two jobs: **investigate** incidents after the fact and **spot** anomalies in real time (a spike of `401` — password brute-forcing; a spike of `403` — privilege-escalation attempts; a spike of `429` — an attack).

### What to log

```json
{
  "ts": "2024-01-15T10:30:00Z",
  "request_id": "req_a1b2c3",
  "method": "POST",
  "path": "/orders",
  "status": 201,
  "user_id": "42",
  "ip": "203.0.113.10",
  "latency_ms": 47
}
```

Structured (JSON) logs, not strings — they can be filtered and aggregated. An end-to-end `request_id` links the client, gateway, and service records into one chain.

### What to NEVER log

- Passwords, secrets, keys.
- Full tokens (mask `Authorization`: `Bearer ***`).
- Card numbers, CVV, personal data (PII).

A leaked log with tokens = leaked access. Masking sensitive fields is not optional but required (PCI DSS, GDPR). Logs themselves are retained for a limited time and under access control.

---

## Honest about the limits

API security reduces risk, it doesn't zero it out. The same REST traits that grant scalability (stateless, uniformity, caching) also help the attacker: predictability eases enumeration, statelessness complicates instant revocation. So layers are combined and complemented: rate limiting (level 11) curbs brute force, input validation stops injection, monitoring catches the rest.

## The designer's four questions — checklist

1. **Identity.** Does every protected endpoint require authentication? No anonymous holes?
2. **Permissions.** Is not just "who" but "what's allowed" checked? Are 401 and 403 distinguished correctly?
3. **Trust.** HTTPS only? Secrets out of code? Is the token signature verified server-side?
4. **Observability.** Are logs structured, with a request id, free of secrets? Are anomalies visible?
