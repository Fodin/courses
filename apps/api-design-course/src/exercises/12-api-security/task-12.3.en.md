# Task 12.3: API Protection Design

## Goal

Build an interactive self-check on security design for three real scenarios. The student studies a scenario, writes their own solution across four layers (authentication, authorization, encryption, logging), then compares with a reference.

## Requirements

1. Three clickable scenario cards: a public API with tiers, an internal microservice-to-microservice API, a banking/fintech API
2. On selecting a scenario — show a textarea for the student's answer with a placeholder hint: describe the 4 layers (authentication / authorization / encryption / logging)
3. A "Show reference solution" button opens a panel with four blocks:
   - **Authentication** (scheme: Basic/Bearer/JWT/mTLS, token lifetime)
   - **Authorization** (RBAC / ABAC / scopes, what limits what)
   - **Encryption** (TLS, mTLS, body signing when needed)
   - **Logging** (what to record, what to mask)
4. The active card is highlighted with a border (#6366f1), inactive ones #e2e8f0
5. Student answers are preserved when switching between scenarios
6. The "reference shown" state is kept separately per scenario

## Checklist

- [ ] Three scenario cards with icon, title, description
- [ ] Clicking a card reveals a textarea for the answer
- [ ] Textarea preserves text when switching scenarios
- [ ] "Show reference solution" button reveals a 4-block panel
- [ ] Reference panel: authentication, authorization, encryption, logging
- [ ] The revealed state is kept per scenario

## Scenario data (reference)

### Scenario 1: Public API for developers
Thousands of external clients, third-party apps acting on users' behalf.
- **Authentication:** OAuth 2.0, access token (JWT, exp ~15 min) + refresh token.
- **Authorization:** scopes (`orders:read`, `orders:write`) — the minimum necessary set per app.
- **Encryption:** HTTPS only + HSTS; signing secrets in a KMS.
- **Logging:** request-id, client-id, status; mask tokens.

### Scenario 2: Internal microservice-to-microservice API
8 services on a private network, no end user.
- **Authentication:** mTLS (mutual certificates) or short-lived service tokens.
- **Authorization:** RBAC by service identity (which service may hit which endpoint).
- **Encryption:** mTLS secures both identity and channel; service mesh.
- **Logging:** an end-to-end trace-id for distributed tracing; no PII.

### Scenario 3: Banking / fintech API
Money, regulation (PCI DSS), a high cost of error.
- **Authentication:** OAuth 2.0 + strict MFA on sensitive operations; short exp.
- **Authorization:** ABAC (account owner, limits, business windows) on top of RBAC.
- **Encryption:** TLS + request body signing (HMAC/`X-Signature`) for payments; idempotency.
- **Logging:** a full immutable transaction audit; masking PAN/CVV/PII; restricted access and retention.

## How to check yourself

1. For each scenario, write your own solution across all 4 layers (at least one point per layer).
2. Click "Show reference" and compare.
3. Notice: the higher the cost of error, the stricter all four layers — and the more ABAC, mTLS, signing, and audit appear.

## Hints

- State: `selected` (scenario index), `answers` (scenario→text object), `revealed` (scenario→bool object).
- The reference is conveniently stored as an array of objects with fields `auth`, `authz`, `encryption`, `logging`.
- Saving an answer: `setAnswers(prev => ({ ...prev, [selected]: text }))`.
