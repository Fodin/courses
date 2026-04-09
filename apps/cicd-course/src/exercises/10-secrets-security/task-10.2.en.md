# Task 10.2: Vault / External Secret Managers — Integration and Dynamic Secrets

## Goal

Create an interactive visualization of the JWT/OIDC authentication process with HashiCorp Vault and secret retrieval. Show the difference between static and dynamic secrets, and compare integration approaches with AWS Secrets Manager.

## Requirements

1. Implement a **step-by-step animation** of the JWT/OIDC flow: (1) GitLab generates JWT → (2) job sends JWT to Vault → (3) Vault verifies signature via GitLab OIDC → (4) Vault checks policy → (5) Vault issues temp token → (6) job reads secret. Each step activates via "Next Step" button.
2. Implement a **toggle** "Static Secret / Dynamic Secret". For static: show YAML with `VAULT_TOKEN` in GitLab variables and explain the problem of long-lived tokens. For dynamic: show YAML with `id_tokens` and TTL.
3. Show a **Secret Lifetime Timeline**: for static — an infinite bar (red), for dynamic — a TTL-limited bar (green) with a "auto-revoked" marker.
4. Implement a **secrets engine selector**: `KV` (key-value), `AWS` (temp IAM credentials), `Database` (temp DB users). For each, show a sample vault command and what's returned.
5. Show a **YAML config** for GitLab CI with an `id_tokens` block that updates when parameters change.

## Checklist

- [ ] Step-by-step animation of 6 JWT flow steps with "Next Step" button
- [ ] Visual blocks for each participant: GitLab, Runner, Vault, GitLab OIDC
- [ ] Static / Dynamic secret toggle
- [ ] Timeline with visual secret lifetime display (finite vs infinite)
- [ ] Three secrets engine selection buttons with descriptions
- [ ] Example vault command for getting a secret from the selected engine
- [ ] YAML block with id_tokens configuration
- [ ] Current step indicator (1/6, 2/6, ...)

## How to Verify

1. Go through all 6 animation steps — each step should highlight the active participant
2. Switch to "Static" — YAML with VAULT_TOKEN should appear with a danger warning
3. Switch to "Dynamic" — YAML should contain `id_tokens:` block, timeline should be finite
4. Select secrets engine `AWS` — example should show `vault write aws/creds/...` and returned `access_key`/`secret_key`
5. Select `Database` — example should show temporary PostgreSQL user creation

## Hints

- Use `useState` for: `step` (0-6), `secretType` ('static'|'dynamic'), `engine` ('kv'|'aws'|'database')
- Animation steps: array of objects `{ actor, description, highlight }`. On step N — highlight the `highlight` block
- Timeline: `div` with fixed width 100%, inside — colored bar. For dynamic — bar at 60% width with "✓ revoked" icon
- Flow participants: GitLab UI (blue), Runner (gray), Vault (green), GitLab OIDC endpoint (purple)
