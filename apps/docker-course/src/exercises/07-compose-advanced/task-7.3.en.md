# Task 7.3: profiles and override

## Objective

Master conditional services via `profiles` and the automatic configuration override mechanism via `docker-compose.override.yml`. Understand the Compose file merge rules.

## Requirements

1. Create a component with three tabs: "profiles", "override", "Merge Rules"
2. "profiles" tab — full YAML with 7 services:
   - `api` and `db` without profiles (core, always start)
   - `adminer` and `mailhog` with the `debug` profile
   - `test-runner` with the `test` profile
   - `prometheus` and `grafana` with the `monitoring` profile
3. Below the YAML show 5 startup commands indicating which services will start in each case
4. "override" tab — three switchable views:
   - Base `docker-compose.yml` (production, committed to Git)
   - `docker-compose.override.yml` (dev, in .gitignore)
   - Merge result with comments (what came from where)
5. Below each view — an explanation of the file's role
6. "Merge Rules" tab — table: scalars (overridden), mappings (merged), lists (concatenated), command/entrypoint (overridden)
7. Warning about duplicate ports in override and example of production startup with `-f`

## Hints

- Array of commands: `{ cmd, result, desc }` to demonstrate profiles
- Three rows for override: base, dev, result
- `useState<'base' | 'dev' | 'result'>` for switching in override

## Checklist

- [ ] Profiles: 7 services with 3 profiles (debug, test, monitoring)
- [ ] 5 startup commands with results
- [ ] Override: base, dev, result — switchable
- [ ] Comments in merge result (what came from where)
- [ ] Merge rules table (4 types)
- [ ] Warning about duplicate ports
- [ ] Example production startup with -f

## How to verify

1. In profiles — each command shows the correct set of services
2. In override — the merge result correctly combines base and dev
3. Merge rules cover all 4 field types
4. It is clear why override is NOT used with -f
