# Task 7.2: Web + DB + Cache (multi-service stack)

## Objective

Build a complete production-ready stack of 5 services: PostgreSQL, Redis, migrations, Node.js API, Nginx frontend — with healthchecks, depends_on conditions, restart policy, and named volumes.

## Requirements

1. Create a component with three tabs: "docker-compose.yml", "Services", "Startup Order"
2. "docker-compose.yml" tab — full YAML of the 5-service stack:
   - `db` (postgres:16-alpine) with healthcheck, volume, environment variables
   - `redis` (redis:7-alpine) with healthcheck, volume, maxmemory settings
   - `migrations` (one-shot, `restart: 'no'`) with depends_on db (service_healthy)
   - `api` (Node.js) with depends_on on all three (healthy/completed), own healthcheck
   - `web` (Nginx frontend) with depends_on api (service_healthy)
3. Below the YAML show statistics: number of services, volumes, healthchecks
4. "Services" tab — table with columns: Service, Image, Role, Port, Healthcheck
5. Below the table — description of the "infrastructure -> migrations -> backend -> frontend" pattern
6. "Startup Order" tab — step-by-step visualization (7 steps) with color grouping by layer. At the bottom, an explanation of the role of `service_completed_successfully` for migrations

## Hints

- Use `${DB_PASSWORD:?required}` for required variables
- For Redis: `command: redis-server --appendonly yes --maxmemory 256mb`
- For api healthcheck: `wget --spider -q` (Alpine image without curl)

## Checklist

- [ ] Full YAML with 5 services, 2 volumes, 4 healthchecks
- [ ] PostgreSQL with pg_isready healthcheck and start_period
- [ ] Redis with redis-cli ping healthcheck and memory settings
- [ ] Migrations with restart: 'no' and depends_on service_healthy
- [ ] API with depends_on on all 3 services (different conditions)
- [ ] Services table with roles and healthchecks
- [ ] Step-by-step startup order (7 steps)
- [ ] Statistics (services, volumes, healthchecks)

## How to verify

1. The YAML must be syntactically valid (try copying it into a real project)
2. Dependency chain: db/redis -> migrations -> api -> web
3. Startup order is logical and matches the YAML configuration
4. All 5 services are described in the table with correct data
