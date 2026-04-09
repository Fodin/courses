# Task 8.1: Docker-in-Docker — Comparing Build Methods

## Goal

Create an interactive visualization of three Docker image build methods in CI: Docker-in-Docker (dind), Kaniko, and Docker socket mount. The user selects a method and sees characteristics, YAML config, and warnings.

## Requirements

1. Display three method cards: **dind**, **Kaniko**, **socket mount** — with brief descriptions
2. When a method is selected, show a comparison table of characteristics: privileged mode, speed, security, setup complexity
3. Show ready-made YAML config for the selected method (GitLab CI)
4. For dind — add a TLS on/off toggle, YAML should update
5. For methods with security risks (dind with TLS disabled, socket mount) show a warning
6. Add a security level indicator: red / yellow / green depending on the selected method and settings

## Checklist

- [ ] Three method cards with icons or color coding
- [ ] On card click — it highlights as active
- [ ] Comparison table updates on method change
- [ ] YAML block (monospace font, dark background) changes with the selected method
- [ ] For dind — TLS on/off toggle affects YAML and security indicator
- [ ] Warning (yellow or red block) for insecure configurations
- [ ] Security indicator with color and text level

## How to Verify

1. Select dind with TLS enabled — YAML contains `DOCKER_TLS_CERTDIR: '/certs'`, indicator is yellow
2. Disable TLS on dind — YAML changes to port 2375, a red warning appears
3. Select Kaniko — no warnings, indicator is green, no `privileged` in YAML
4. Select socket mount — a warning about host socket access danger appears
5. Switch back to dind with TLS — the warning disappears

## Hints

- Use `useState` for: `selectedMethod` (string), `tlsEnabled` (boolean)
- Build YAML via a `buildYaml(method, tlsEnabled)` function
- For the comparison table, store data as an object: `{ dind: { privileged: true, ... }, kaniko: { ... } }`
- Security levels: socket mount = danger, dind without TLS = danger, dind with TLS = warning, kaniko = safe
