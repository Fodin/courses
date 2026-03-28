# Level 7: Docker Compose — Advanced Usage

## 🎯 Problem: services start in the wrong order

In the previous level we learned how to describe services in `docker-compose.yml`. But what happens when we run `docker compose up`?

```bash
docker compose up -d
# [+] Running 3/3
#  ✔ Container myapp-db-1    Started  0.3s
#  ✔ Container myapp-api-1   Started  0.4s  # API starts before the DB is ready!
#  ✔ Container myapp-redis-1 Started  0.3s
```

The API server started, but PostgreSQL is not yet ready to accept connections. The result is an error on the first database request:

```
api-1  | Error: connect ECONNREFUSED 172.18.0.3:5432
api-1  | PostgreSQL is not ready yet...
```

The simple form of `depends_on` only guarantees the **container start order**, but does not wait until a service is actually ready. Reliable orchestration requires **healthchecks** and **dependency conditions**.

---

## 🔥 depends_on: controlling startup order

### Simple form (list)

```yaml
services:
  api:
    build: ./api
    depends_on:
      - db
      - redis
    # Compose will start db and redis BEFORE api
    # But will NOT wait for them to be ready!

  db:
    image: postgres:16

  redis:
    image: redis:7-alpine
```

The simple form of `depends_on` guarantees:
- `db` and `redis` will start **before** `api`
- On `docker compose down` the order is reversed: `api` stops first

But it does **not guarantee** that PostgreSQL is already accepting connections.

### Extended form (with conditions)

```yaml
services:
  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy    # Wait until healthcheck passes
      redis:
        condition: service_started    # Enough that the container is running
      migrations:
        condition: service_completed_successfully  # Wait for successful completion

  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

  redis:
    image: redis:7-alpine

  migrations:
    build: ./api
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
```

### Three depends_on conditions

| Condition | Meaning | When to use |
|-----------|---------|-------------|
| `service_started` | Container is running | For services without healthcheck |
| `service_healthy` | Healthcheck is passing | For DBs, queues, any services with healthcheck |
| `service_completed_successfully` | Container exited with code 0 | For migrations, init scripts, seed data |

📌 **`service_healthy` requires** that the target service has a `healthcheck` defined. Without it Compose will return an error.

---

## 🔥 healthcheck: verifying service readiness

### healthcheck syntax

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s       # Interval between checks
      timeout: 5s         # Timeout for a single check
      retries: 5          # Number of consecutive failures before unhealthy
      start_period: 30s   # Grace period for startup (failures don't count)
      start_interval: 2s  # Check interval during start_period (Compose 2.20+)
```

### test command formats

```yaml
# CMD-SHELL — runs the command through a shell
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  # Equivalent to: /bin/sh -c "pg_isready -U postgres"

# CMD — runs the command directly (no shell)
healthcheck:
  test: ['CMD', 'pg_isready', '-U', 'postgres']

# String format (automatically via shell)
healthcheck:
  test: pg_isready -U postgres
```

### healthcheck examples for popular services

```yaml
# PostgreSQL
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 5s
  timeout: 3s
  retries: 5

# MySQL
healthcheck:
  test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
  interval: 10s
  timeout: 5s
  retries: 3

# Redis
healthcheck:
  test: ['CMD', 'redis-cli', 'ping']
  interval: 5s
  timeout: 3s
  retries: 5

# HTTP service (curl)
healthcheck:
  test: ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3

# HTTP service (wget, for Alpine images without curl)
healthcheck:
  test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3

# MongoDB
healthcheck:
  test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
  interval: 10s
  timeout: 5s
  retries: 3

# RabbitMQ
healthcheck:
  test: ['CMD-SHELL', 'rabbitmq-diagnostics -q ping']
  interval: 15s
  timeout: 10s
  retries: 3
```

### Checking healthcheck status

```bash
# View container health status
docker compose ps
# NAME          SERVICE  STATUS                  PORTS
# myapp-db-1    db       running (healthy)       5432/tcp
# myapp-api-1   api      running (starting)      0.0.0.0:3000->3000/tcp
# myapp-redis-1 redis    running                 6379/tcp

# Detailed healthcheck information
docker inspect --format='{{json .State.Health}}' myapp-db-1
```

---

## 🔥 Real multi-service stack: Web + DB + Cache

### Full production-ready configuration example

```yaml
services:
  # ---- Infrastructure ----
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-myapp}']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s
    ports:
      - '127.0.0.1:5432:5432'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # ---- Migrations (one-shot service) ----
  migrations:
    build:
      context: ./api
      target: migrations
    environment:
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@db:5432/${DB_NAME:-myapp}
    depends_on:
      db:
        condition: service_healthy
    restart: 'no'

  # ---- Backend ----
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@db:5432/${DB_NAME:-myapp}
      REDIS_URL: redis://redis:6379
      SESSION_SECRET: ${SESSION_SECRET:?SESSION_SECRET is required}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
    healthcheck:
      test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    restart: unless-stopped

  # ---- Frontend ----
  web:
    build: ./frontend
    ports:
      - '80:80'
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pgdata:
  redis-data:
```

### Startup order for this stack

```
1. db and redis start in parallel
2. Compose waits for both healthchecks to pass
3. migrations starts and runs database migrations
4. Compose waits for migrations to exit with code 0
5. api starts
6. Compose waits for api healthcheck to pass
7. web starts
```

### restart policy

```yaml
services:
  api:
    restart: unless-stopped   # Restart unless manually stopped

  migrations:
    restart: 'no'             # Do not restart (one-shot service)
```

| Policy | Description |
|--------|-------------|
| `no` | Do not restart (default) |
| `always` | Always restart |
| `on-failure` | Restart only on error (exit code != 0) |
| `unless-stopped` | Like always, but do not restart after a manual stop |

---

## 🔥 profiles: conditional services

### Problem

Some services are only needed in specific scenarios:
- **Adminer** — only for development (DB browser)
- **Tests** — only for CI
- **Debug tools** — only when debugging
- **Monitoring** — only in production

Without profiles they always start, even when not needed.

### Defining profiles

```yaml
services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    # No profiles — always starts

  db:
    image: postgres:16
    # No profiles — always starts

  adminer:
    image: adminer
    ports:
      - '8080:8080'
    profiles:
      - debug         # Only starts with the debug profile

  test-runner:
    build: ./tests
    profiles:
      - test          # Only starts with the test profile

  prometheus:
    image: prom/prometheus
    profiles:
      - monitoring    # Only starts with the monitoring profile

  grafana:
    image: grafana/grafana
    profiles:
      - monitoring    # Same profile — will start together
```

### Activating profiles

```bash
# Start with a profile
docker compose --profile debug up -d
# Starts: api, db, adminer

# Multiple profiles
docker compose --profile debug --profile monitoring up -d
# Starts: api, db, adminer, prometheus, grafana

# Via environment variable
COMPOSE_PROFILES=debug,monitoring docker compose up -d

# Start a specific service from a profile
docker compose up -d adminer
# Compose automatically activates the required profile

# Without a profile — only "core" services
docker compose up -d
# Starts: api, db (no profiles)
```

📌 Services **without** `profiles` start **always**. Services **with** `profiles` start only when explicitly activated.

---

## 🔥 docker-compose.override.yml: overriding configuration

### How override works

Docker Compose automatically merges two files:
1. `docker-compose.yml` — base configuration
2. `docker-compose.override.yml` — overrides (if the file exists)

```
docker-compose.yml + docker-compose.override.yml = final configuration
```

### Base file (docker-compose.yml)

```yaml
# docker-compose.yml — main file (committed to Git)
services:
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}

volumes:
  pgdata:
```

### Override for development (docker-compose.override.yml)

```yaml
# docker-compose.override.yml — for dev (NOT committed to Git)
services:
  api:
    build:
      target: development     # Different stage in multi-stage build
    volumes:
      - ./api/src:/app/src    # Mount source code
    environment:
      NODE_ENV: development
      DEBUG: 'true'

  db:
    ports:
      - '5432:5432'           # Expose DB to host for debugging
    environment:
      POSTGRES_PASSWORD: dev-password
```

### Merge result

```yaml
# Final configuration (what Compose sees)
services:
  api:
    build:
      context: ./api
      target: development       # Overridden
    ports:
      - '3000:3000'             # From base file
    volumes:
      - ./api/src:/app/src      # Added from override
    environment:
      NODE_ENV: development     # Overridden
      DEBUG: 'true'             # Added

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'             # Added from override
    environment:
      POSTGRES_PASSWORD: dev-password  # Overridden

volumes:
  pgdata:
```

### Separate file for production

```bash
# For production — explicitly specify a different file
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# docker-compose.override.yml is NOT used with -f
```

```yaml
# docker-compose.prod.yml
services:
  api:
    build:
      target: production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### Compose file merge rules

| Field type | Behavior |
|------------|----------|
| Scalar values (`image`, `build.target`) | Overridden |
| Mappings (`environment`, `labels`) | Merged (override overwrites matching keys) |
| Lists (`ports`, `volumes`, `expose`) | Concatenated (appended) |
| `command`, `entrypoint` | Fully overridden |

⚠️ **Important:** lists (`ports`, `volumes`) are **appended, not replaced**. If the base file has `- '3000:3000'` and the override has `- '9229:9229'`, the final list will contain both entries.

---

## 🔥 Compose Watch: automatic file synchronization during development

### Problem

During development you constantly change code. Without automatic synchronization you have to restart manually:

```bash
# Changed code...
docker compose up -d --build    # Every single time
```

Compose Watch automatically watches for file changes and applies them.

### Three watch actions

```yaml
services:
  api:
    build: ./api
    develop:
      watch:
        # sync — copies changed files into the container
        - action: sync
          path: ./api/src
          target: /app/src
          ignore:
            - '**/*.test.ts'

        # rebuild — rebuilds the image and recreates the container
        - action: rebuild
          path: ./api/package.json

        # sync+restart — copies the file AND restarts the container
        - action: sync+restart
          path: ./api/.env
          target: /app/.env
```

### Action descriptions

| Action | What it does | When to use |
|--------|-------------|-------------|
| `sync` | Copies files into the container (no restart) | Source code (hot reload) |
| `rebuild` | `docker compose build` + container recreate | Dependencies (package.json, go.mod) |
| `sync+restart` | Copies files + restarts the container | Configuration (.env, config.json) |

### Full example with Compose Watch

```yaml
services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    develop:
      watch:
        # Source code changes — sync
        - action: sync
          path: ./api/src
          target: /app/src
          ignore:
            - '**/*.test.ts'
            - '**/__tests__/**'

        # package.json changes — rebuild
        - action: rebuild
          path: ./api/package.json

        # package-lock.json changes — rebuild
        - action: rebuild
          path: ./api/package-lock.json

        # .env changes — sync and restart
        - action: sync+restart
          path: ./api/.env
          target: /app/.env

  frontend:
    build: ./frontend
    ports:
      - '5173:5173'
    develop:
      watch:
        - action: sync
          path: ./frontend/src
          target: /app/src

        - action: rebuild
          path: ./frontend/package.json
```

### Starting Compose Watch

```bash
# Start in watch mode
docker compose watch

# Or in the background
docker compose up -d
docker compose watch &

# Watch a specific service
docker compose watch api
```

### Compose Watch vs bind mount

```yaml
# ❌ Bind mount — problems with node_modules and performance on macOS
services:
  api:
    volumes:
      - ./api:/app
      - /app/node_modules

# ✅ Compose Watch — files are copied on change
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
```

Advantages of Watch over bind mount:
- No `node_modules` issues (no anonymous volume needed)
- Better performance on macOS (no FUSE)
- Files can be filtered via `ignore`
- `rebuild` automatically rebuilds when dependencies change

---

## 🔥 extends: service configuration inheritance

```yaml
# common.yml
services:
  base-node:
    build:
      context: .
      target: base
    environment:
      NODE_ENV: production
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 3
```

```yaml
# docker-compose.yml
services:
  api:
    extends:
      file: common.yml
      service: base-node
    build:
      context: ./api
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp

  worker:
    extends:
      file: common.yml
      service: base-node
    build:
      context: ./worker
    command: npm run worker
    environment:
      REDIS_URL: redis://redis:6379
```

📌 `extends` is useful when multiple services share common configuration (same environment variables, healthcheck, restart policy).

---

## ⚠️ Common beginner mistakes

### 🐛 1. Simple depends_on instead of condition: service_healthy

```yaml
# ❌ API starts when the DB container is running but PostgreSQL is not yet ready
services:
  api:
    depends_on:
      - db     # Does not wait for healthcheck!
  db:
    image: postgres:16
```

> **Why this is a mistake:** the PostgreSQL container starts in 0.5 seconds, but the database server itself takes 5–15 seconds to initialize. The API will get ECONNREFUSED.

```yaml
# ✅ API starts only when the DB is actually ready
services:
  api:
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 🐛 2. service_healthy without a healthcheck

```yaml
# ❌ Compose will return an error
services:
  api:
    depends_on:
      redis:
        condition: service_healthy   # But redis has no healthcheck!
  redis:
    image: redis:7-alpine
    # healthcheck is not defined!
```

> **Why this is a mistake:** the `service_healthy` condition requires that the target service has a defined healthcheck. Otherwise Compose does not know how to verify readiness.

```yaml
# ✅ Add a healthcheck
services:
  redis:
    image: redis:7-alpine
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 🐛 3. start_period that is too short

```yaml
# ❌ PostgreSQL may take longer than 5 seconds to initialize
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 2s
      start_period: 5s    # First-time startup (init) needs more time!
      retries: 3
```

> **Why this is a mistake:** on first startup PostgreSQL creates the database, which takes more time. With a short `start_period` and `retries` the container may become unhealthy and fail to start.

```yaml
# ✅ A sensible start_period for first startup
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      start_period: 30s    # Enough time for initialization
      retries: 5
```

### 🐛 4. Duplicate ports in the override file

```yaml
# docker-compose.yml
services:
  api:
    ports:
      - '3000:3000'

# docker-compose.override.yml
# ❌ Lists are concatenated — there will be TWO mappings!
services:
  api:
    ports:
      - '3000:3000'     # Duplicate — "port is already allocated" error
      - '9229:9229'
```

> **Why this is a mistake:** in the override file lists are appended, not replaced. There is no need to specify the same port again.

```yaml
# docker-compose.override.yml
# ✅ Add only NEW ports
services:
  api:
    ports:
      - '9229:9229'     # Debug port only
```

### 🐛 5. watch sync without target

```yaml
# ❌ No target specified — Compose does not know where to copy files
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          # target: ???  — required field for sync!
```

```yaml
# ✅ target is specified
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
```

---

## 💡 Best practices

### 1. Always use healthcheck for DBs and caches

```yaml
# ✅ Healthcheck for every infrastructure service
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s

  redis:
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 2. Use profiles for dev tools

```yaml
# ✅ Dev tools don't interfere with core services
services:
  adminer:
    image: adminer
    profiles: [debug]

  mailhog:
    image: mailhog/mailhog
    profiles: [debug]
```

### 3. Separate base/override for dev and prod

```
project/
  docker-compose.yml          # Base configuration (Git)
  docker-compose.override.yml # Dev overrides (.gitignore)
  docker-compose.prod.yml     # Production overrides (Git)
```

### 4. Compose Watch instead of bind mount

```yaml
# ✅ Watch for development — better performance
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
        - action: rebuild
          path: ./api/package.json
```

### 5. Group variables for healthcheck

```yaml
# ✅ Shared variables for healthcheck and connection
x-db-env: &db-env
  POSTGRES_DB: ${DB_NAME:-myapp}
  POSTGRES_USER: ${DB_USER:-postgres}
  POSTGRES_PASSWORD: ${DB_PASSWORD}

services:
  db:
    environment:
      <<: *db-env
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres}']
```

### 6. service_completed_successfully for migrations

```yaml
# ✅ Migrations run once before the API starts
services:
  migrations:
    command: npm run migrate
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy

  api:
    depends_on:
      migrations:
        condition: service_completed_successfully
```

---

## 📌 Summary

- ✅ **depends_on** with `condition: service_healthy` — reliable startup order
- ✅ **healthcheck** — verifies actual service readiness (pg_isready, redis-cli ping, curl)
- ✅ **start_period** — grace time for initialization without penalty
- ✅ **service_completed_successfully** — for one-shot tasks (migrations, seed)
- ✅ **profiles** — conditional services for dev/test/monitoring
- ✅ **docker-compose.override.yml** — automatic override for development
- ✅ Merge rules: scalars are replaced, lists are concatenated, mappings are merged
- ✅ **Compose Watch** — automatic file sync (sync, rebuild, sync+restart)
- ✅ Watch is better than bind mount: no node_modules issues, better performance
- ✅ **extends** — inherit shared configuration between services
- ✅ **restart policy** — `unless-stopped` for production, `no` for one-shot tasks
