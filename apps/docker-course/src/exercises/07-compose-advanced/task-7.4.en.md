# Task 7.4: Compose Watch

## Objective

Master Compose Watch — the automatic file synchronization mechanism for development. Understand the three actions (`sync`, `rebuild`, `sync+restart`), configure watch for a real project, and compare it with bind mount.

## Requirements

1. Create a component with three tabs: "Watch Actions", "Full Example", "Watch vs Bind Mount"
2. "Watch Actions" tab — three toggle buttons: `sync`, `rebuild`, `sync+restart`. For each:
   - Action description
   - When to use
   - YAML configuration example
   - Behavior explanation
3. Below the example show the launch command: `docker compose watch`
4. "Full Example" tab — docker-compose.yml with two services (api + frontend), each with multiple watch rules:
   - api: sync for src, rebuild for package.json, sync+restart for .env
   - frontend: sync for src, rebuild for package.json, sync+restart for vite.config.ts
5. Below the YAML — cards showing the number of rules for each service
6. "Watch vs Bind Mount" tab — comparison table across 5 aspects: node_modules, macOS performance, file filtering, automatic rebuild, configuration complexity
7. Below the table — two code blocks side by side: bind mount example and Compose Watch example

## Hints

- Array for actions: `{ action, desc, when, yaml, details }`
- For ignore patterns: `'**/*.test.ts'`, `'**/__tests__/**'`
- `sync` requires `target`, `rebuild` does not

## Checklist

- [ ] Three watch actions (sync, rebuild, sync+restart) with toggling
- [ ] Each action: description, when to use, YAML, explanation
- [ ] Full example with 2 services and 7 watch rules
- [ ] Watch vs Bind Mount comparison table (5 rows)
- [ ] Side-by-side code examples for bind mount and watch
- [ ] docker compose watch launch command

## How to verify

1. Switching actions — YAML and description update
2. Full example contains both services with different rules
3. The comparison objectively shows pros of both watch and bind mount
4. sync uses target, rebuild does not (this is an important distinction)
