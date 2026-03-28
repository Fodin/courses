# Task 8.3: Configuration Patterns

## Objective

Learn how to organize Docker project configuration for multiple environments (development, staging, production) using a base Compose file, override files, per-environment .env files, and YAML anchors for DRY configuration.

## Requirements

1. Create a component with four sections: "Project Structure", "Base Compose", "Environments", "YAML Anchors"
2. "Project Structure" section — a project file tree (compose files, .env files, secrets/) with a block on 12-factor app principles
3. "Base Compose" section — YAML of the base configuration using `${VAR:-default}` for safe defaults
4. "Environments" section — three switchable environments (Dev / Staging / Prod), for each in a two-column layout: compose override on the left, .env file on the right. Below them — the startup command
5. For Production show the use of Docker Secrets instead of environment variables
6. "YAML Anchors" section — an example with `x-` extensions, `&name` / `*name` / `<<: *name` and an explanation of the syntax
7. At the bottom of the component a tip about `docker compose config`

## Hints

- `useState<'structure' | 'base' | 'env' | 'anchors'>` for sections
- `useState<'dev' | 'staging' | 'prod'>` for environments
- Object `Record<EnvType, { label, color, compose, envFile, runCmd }>` for environment data
- `gridTemplateColumns: '1fr 1fr'` for two-column layout
- Colors: dev=#4caf50, staging=#ff9800, prod=#f44336

## Checklist

- [ ] Four sections switch
- [ ] Project structure: file tree + 12-factor principles
- [ ] Base compose: YAML with ${VAR:-default}
- [ ] Three environments (dev/staging/prod) with switching
- [ ] For each environment: compose override + .env file + startup command
- [ ] Production uses Docker Secrets
- [ ] YAML anchors: example + explanation of &, *, << syntax
- [ ] Tip about docker compose config at the bottom

## How to verify

1. Switch sections — content changes
2. In "Project Structure" the file tree is readable, 12-factor principles are listed
3. In "Environments" switch dev/staging/prod — compose and .env differ
4. Production shows secrets instead of plain variables
5. Startup commands differ for each environment
6. In "YAML Anchors" &, *, <<: * are explained
