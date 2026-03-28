# Task 6.3: ports, volumes, environment

## Objective

Understand the configuration of ports, volumes, and environment variables in docker-compose.yml: syntax variants, record formats, and typical patterns.

## Requirements

1. Create a component with three sections switchable via buttons: `ports`, `volumes`, `environment`
2. **ports** section: short and long syntax, expose vs ports, binding to 127.0.0.1. Notes on quoting
3. **volumes** section: bind mount (./path), named volumes, anonymous volumes, read-only mount, declaring volumes at the top level. Notes on the difference between ./path and name
4. **environment** section: inline (environment:), from a file (env_file:), variable substitution (${VAR:-default}). Notes on .env and security
5. Below each section — a list of brief notes (at least 3)
6. Combined example — a complete docker-compose.yml that brings all three concepts together

## Hints

- An array of objects `{ key, label, yaml, notes }` for sections
- notes — an array of strings with key facts
- Show a realistic example: API + database with ports, volumes, and env

## Checklist

- [ ] Three sections switchable via buttons
- [ ] ports: short/long syntax, expose, 127.0.0.1
- [ ] volumes: bind mount, named volume, anonymous, :ro
- [ ] environment: inline, env_file, ${VAR:-default}
- [ ] At least 3 notes below each section
- [ ] Complete example combining all three concepts

## How to Verify

1. Switch sections — the YAML and notes change
2. Notes are concise and cover the most important points
3. The complete example is syntactically correct and realistic
