# Task 7.2: Services — Databases in CI

## Goal

Create an interactive service configuration builder for GitLab CI. The user selects needed services (PostgreSQL, Redis, MongoDB) and sees ready-made YAML with all required environment variables and correct connection hosts.

## Requirements

1. Show a list of available services: PostgreSQL, Redis, MongoDB, MySQL — each with an icon and brief description
2. When a service is selected, add it to the configuration and show a block with required environment variables (POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, etc.)
3. For each service, show the correct connection URL (DATABASE_URL, REDIS_URL, MONGODB_URI) with the correct host (image name without tag)
4. Implement an alias input field — the user enters an alternative host name and the connection URL updates
5. Show a network visualization: job container and service containers with connection arrows
6. Generate the final YAML config, updating in real time

## Checklist

- [ ] Service selection cards (PostgreSQL, Redis, MongoDB, MySQL)
- [ ] When a service is selected — block with environment variables for initialization
- [ ] Correct host in the connection URL (postgres, redis, mongo, mysql)
- [ ] Alias input field with live URL update
- [ ] Docker network visualization with job container and services
- [ ] YAML with services and variables sections
- [ ] Hint: "Add readiness wait (pg_isready)" when PostgreSQL is selected

## How to Verify

1. Select PostgreSQL — YAML should show services: [postgres:15-alpine] and POSTGRES_* variables
2. Set alias "database" for PostgreSQL — DATABASE_URL should change to postgresql://...@database:5432/...
3. Add Redis alongside PostgreSQL — YAML should have both services
4. Check the visualization — it should show two service containers next to the main one
5. Remove all services — YAML should not contain the services section

## Hints

- Service data: object with fields `image`, `alias`, `host`, `port`, `envVars`, `connectionUrl`
- Default host = image name without tag and version: `postgres:15-alpine` → `postgres`
- Use `useState` for `selectedServices` (Map or object where key = service id)
- Network visualization can be done with flex container, blocks, and `→` arrows
- URL changes on alias input: if alias is empty — use default host
