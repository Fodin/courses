# Level 8: Environment Variables and Configuration

## 🎯 Problem: hardcoded passwords in docker-compose.yml

Imagine you described a stack in `docker-compose.yml` and committed it to the repository:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: super_secret_123    # 🔥 Password in Git!
      POSTGRES_USER: admin

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://admin:super_secret_123@db:5432/myapp
      JWT_SECRET: my-jwt-secret-key          # 🔥 Another secret!
      STRIPE_API_KEY: sk_live_abc123         # 🔥 Payment key!
```

This file will end up in the Git history, and any team member (or an attacker in case of a leak) will gain access to your secrets. Even if you remove the passwords later — they will remain in the commit history.

Docker provides several mechanisms for working safely with configuration: **environment variables**, **.env files**, **secrets**, and **configs**.

---

## 🔥 ENV in Dockerfile: variables for the image

### The ENV instruction

`ENV` sets environment variables that are available **both at build time and at container runtime**:

```dockerfile
FROM node:20-alpine

# Single variable
ENV NODE_ENV=production

# Multiple variables (each on a separate instruction)
ENV APP_PORT=3000
ENV LOG_LEVEL=info

# Use in subsequent instructions
WORKDIR /app
EXPOSE $APP_PORT
CMD ["node", "server.js"]
```

Variables set via `ENV` become part of the image and are available in all containers created from that image.

### ARG vs ENV: build time vs runtime

```dockerfile
# ARG — build time only (docker build)
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# ARG after FROM must be re-declared
ARG BUILD_DATE

# ENV — at build time AND at runtime (docker run)
ENV NODE_ENV=production

# Pattern: pass ARG into ENV
ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}

# LABEL uses ARG
LABEL build-date=${BUILD_DATE}
```

| | ARG | ENV |
|---|-----|-----|
| Available at `docker build` | ✅ | ✅ |
| Available at `docker run` | ❌ | ✅ |
| Overridden via `--build-arg` | ✅ | ❌ |
| Overridden via `-e` / `--env` | ❌ | ✅ |
| Persisted in the image | ❌ | ✅ |

```bash
# Pass ARG at build time
docker build --build-arg NODE_VERSION=18 --build-arg BUILD_DATE=$(date -u +%Y-%m-%d) .

# Pass ENV at runtime
docker run -e NODE_ENV=development -e LOG_LEVEL=debug myapp
```

⚠️ **Important:** `ARG` must not contain secrets! ARG values are visible in `docker history`:

```bash
docker history myapp
# STEP  CREATED BY
# ...   ARG DB_PASSWORD=secret123   # ❌ Visible to everyone!
```

---

## 🔥 Environment variables at container runtime

### The -e (--env) flag

```bash
# Single variable
docker run -e NODE_ENV=production myapp

# Multiple variables
docker run \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  myapp

# Pass a variable from the host system (without a value)
export API_KEY=abc123
docker run -e API_KEY myapp
# The container receives API_KEY=abc123 from the host
```

### Variables from a file (--env-file)

```bash
# Load variables from a file
docker run --env-file .env myapp

# Multiple files
docker run --env-file .env --env-file .env.local myapp
```

### Variable priority (highest to lowest)

```
1. docker run -e VAR=value          (-e flag)
2. docker run --env-file .env       (file)
3. ENV VAR=value in Dockerfile      (image)
```

The `-e` flag always wins. This allows you to override default values from the Dockerfile.

---

## 🔥 .env files: syntax and usage

### .env file syntax

```bash
# .env — environment variables
# Comments start with #

# Simple assignment
NODE_ENV=production
APP_PORT=3000

# Quoted values (for spaces and special characters)
APP_NAME="My Docker App"
GREETING='Hello, World!'

# Unquoted (whitespace is trimmed)
DB_HOST=localhost

# Empty value
EMPTY_VAR=

# Multi-line values (in double quotes)
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"

# ❌ NOT supported: export, variable substitution
# export VAR=value      — does not work
# VAR=${OTHER_VAR}      — does not work in .env
```

### .env in Docker Compose

Docker Compose **automatically** loads the `.env` file from the project directory:

```bash
project/
  docker-compose.yml
  .env                  # Loaded automatically!
```

```bash
# .env
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret123
APP_PORT=3000
```

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${DB_NAME}           # myapp
      POSTGRES_USER: ${DB_USER}         # postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD} # secret123

  api:
    build: ./api
    ports:
      - '${APP_PORT}:3000'             # 3000:3000
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
```

### Variable substitution in docker-compose.yml

```yaml
services:
  api:
    image: myapp:${TAG}                    # Required variable

    environment:
      # Default value (if VAR is unset or empty)
      NODE_ENV: ${NODE_ENV:-production}

      # Default value (if VAR is unset, but empty string is OK)
      LOG_LEVEL: ${LOG_LEVEL-info}

      # Error if variable is unset
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Alternative value (if VAR is set, use alternative)
      DEBUG: ${DEBUG:+true}
```

| Syntax | Description | VAR unset | VAR="" | VAR="hello" |
|--------|-------------|-----------|--------|-------------|
| `${VAR}` | Value | empty | empty | hello |
| `${VAR:-default}` | Default if unset or empty | default | default | hello |
| `${VAR-default}` | Default if unset | default | empty | hello |
| `${VAR:?error}` | Error if unset or empty | ERROR | ERROR | hello |
| `${VAR?error}` | Error if unset | ERROR | empty | hello |
| `${VAR:+alt}` | Alt if set and non-empty | empty | empty | alt |

### Multiple .env files

```yaml
# docker-compose.yml (Compose v2.17+)
services:
  api:
    env_file:
      - .env              # Base variables
      - .env.local         # Local overrides (not in Git)
      - .env.${ENV:-dev}   # Variables for the specific environment
```

```bash
# Or via CLI
docker compose --env-file .env.staging up -d
```

### Variable priority in Docker Compose

```
1. environment: in docker-compose.yml    (explicit value)
2. Host shell variables                  (export VAR=value)
3. env_file: in docker-compose.yml       (file for the service)
4. .env file in the project directory    (automatic loading)
5. ENV in Dockerfile                     (image)
```

📌 **Important:** the `.env` file substitutes values into `docker-compose.yml` (variables `${VAR}`), while `env_file` passes variables **inside the container**. These are different mechanisms!

---

## 🔥 Docker Secrets: secure secret storage

### The problem with environment variables

Environment variables are not the best place for secrets:

```bash
# ❌ Secrets are visible via docker inspect
docker inspect mycontainer --format='{{json .Config.Env}}'
# ["DB_PASSWORD=super_secret_123", "JWT_SECRET=my-secret"]

# ❌ Secrets are visible via /proc in the container
docker exec mycontainer cat /proc/1/environ
# DB_PASSWORD=super_secret_123

# ❌ Secrets can appear in logs
console.log('Config:', process.env)  # Prints all variables, including passwords
```

### What are Docker Secrets

Docker Secrets is a mechanism for securely passing confidential data to containers:
- Secrets are stored **in files**, not in environment variables
- Available inside the container at `/run/secrets/<name>`
- Not visible via `docker inspect`
- Do not appear in application logs

### Creating secrets in Compose

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password   # Reads password from file
    secrets:
      - db_password           # Which secrets this service has access to

  api:
    build: ./api
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
      - jwt_secret

# Secret definitions
secrets:
  db_password:
    file: ./secrets/db_password.txt     # From a local file
  database_url:
    file: ./secrets/database_url.txt
  jwt_secret:
    environment: JWT_SECRET             # From a host environment variable (Compose v2.23+)
```

```bash
# secrets/db_password.txt (no trailing newline!)
echo -n "super_secret_123" > secrets/db_password.txt

# secrets/database_url.txt
echo -n "postgresql://postgres:super_secret_123@db:5432/myapp" > secrets/database_url.txt
```

### Reading secrets in the application

```javascript
// Node.js — reading a secret from a file
const fs = require('fs')

function getSecret(name) {
  const secretPath = `/run/secrets/${name}`
  try {
    return fs.readFileSync(secretPath, 'utf8').trim()
  } catch {
    // Fallback to environment variable (for dev)
    return process.env[name.toUpperCase()]
  }
}

const dbPassword = getSecret('db_password')
const jwtSecret = getSecret('jwt_secret')
```

```python
# Python — reading a secret
import os

def get_secret(name):
    secret_path = f'/run/secrets/{name}'
    try:
        with open(secret_path, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return os.environ.get(name.upper())
```

### _FILE support in official images

Many official images support the `_FILE` suffix for variables:

```yaml
services:
  db:
    image: postgres:16
    environment:
      # Instead of POSTGRES_PASSWORD=secret
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
    secrets:
      - mysql_root_password
```

📌 The `postgres`, `mysql`, `mariadb`, `mongo` and other official images support `_FILE` out of the box.

---

## 🔥 Docker Configs: non-secret configuration files

### Configs vs Secrets

| | Secrets | Configs |
|---|---------|---------|
| Purpose | Passwords, keys, tokens | nginx, prometheus configs, etc. |
| Path in container | `/run/secrets/<name>` | `/<target>` (configurable) |
| Encryption | Yes (in Swarm) | No |
| Mutability | Immutable | Immutable |

### Using Configs in Compose

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf    # Where to place it in the container

  prometheus:
    image: prom/prometheus
    configs:
      - source: prom_config
        target: /etc/prometheus/prometheus.yml

configs:
  nginx_conf:
    file: ./config/nginx.conf           # From a local file
  prom_config:
    file: ./config/prometheus.yml
```

### Configs vs bind mount

```yaml
# Bind mount — file changes on host → immediately in container
services:
  nginx:
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf:ro

# Configs — file is copied when container is created (immutable)
services:
  nginx:
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf
```

When to use configs instead of volumes:
- In Docker Swarm (configs are replicated across nodes)
- When immutability is required (configuration must not change)
- For production environments

For development, bind mount is usually more convenient (changes are applied immediately).

---

## 🔥 Configuration patterns for multiple environments

### 12-factor app principles

The [12-factor app](https://12factor.net/) methodology recommends:

1. **Configuration is stored in environment variables** — not in code, not in config files
2. **Code does not distinguish environments** — the same image for dev, staging, and prod
3. **Secrets are never hardcoded** — even for the dev environment

### Project structure for multiple environments

```
project/
  docker-compose.yml            # Base configuration (in Git)
  docker-compose.override.yml   # Dev settings (in .gitignore)
  docker-compose.prod.yml       # Production overrides (in Git)
  docker-compose.staging.yml    # Staging overrides (in Git)

  .env                          # Default dev variables (in .gitignore)
  .env.example                  # Template .env for new developers (in Git)
  .env.staging                  # Staging variables (in .gitignore or CI)
  .env.prod                     # Production variables (in .gitignore or CI)

  secrets/                      # Secrets (in .gitignore!)
    db_password.txt
    jwt_secret.txt

  .gitignore
```

### Base docker-compose.yml

```yaml
# docker-compose.yml — shared configuration for all environments
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USER:-postgres}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres}']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s

  api:
    build:
      context: ./api
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-myapp}
      DB_USER: ${DB_USER:-postgres}

volumes:
  pgdata:
```

### Dev override (docker-compose.override.yml)

```yaml
# docker-compose.override.yml — merged automatically
services:
  db:
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: dev-password       # Simple password for dev

  api:
    build:
      target: development
    ports:
      - '3000:3000'
      - '9229:9229'                         # Debug port
    volumes:
      - ./api/src:/app/src
    environment:
      DB_PASSWORD: dev-password
      LOG_LEVEL: debug
      DEBUG: 'true'
```

### Production compose (docker-compose.prod.yml)

```yaml
# docker-compose.prod.yml — for production
services:
  db:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    deploy:
      resources:
        limits:
          memory: 1G

  api:
    build:
      target: production
    ports:
      - '3000:3000'
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
      LOG_LEVEL: warn
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### Running different environments

```bash
# Development (default, uses .env + override)
docker compose up -d

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml --env-file .env.staging up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d
```

### .env.example — template for the team

```bash
# .env.example — committed to Git as a template
# Copy to .env and fill in the values:
# cp .env.example .env

# Database
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=          # <-- Fill in!

# Application
APP_PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# External services
# STRIPE_API_KEY=     # <-- Get at dashboard.stripe.com
# SENDGRID_KEY=       # <-- Get at sendgrid.com
```

### Common configuration patterns

#### Database URL

```bash
# .env
DB_HOST=db
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret

# Or as a single URL
DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
```

```yaml
# docker-compose.yml
services:
  api:
    environment:
      # Option 1: separate variables
      DB_HOST: ${DB_HOST:-db}
      DB_PORT: ${DB_PORT:-5432}
      DB_NAME: ${DB_NAME:-myapp}
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Option 2: single URL
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

#### Feature flags

```bash
# .env
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
FEATURE_DARK_MODE=true
```

#### API keys and external services

```bash
# .env (dev — fake/test keys)
STRIPE_API_KEY=sk_test_xxx
SENDGRID_KEY=SG.test_xxx
SENTRY_DSN=

# .env.prod (production — real keys)
STRIPE_API_KEY=sk_live_xxx
SENDGRID_KEY=SG.live_xxx
SENTRY_DSN=https://xxx@sentry.io/123
```

---

## 🔥 YAML anchors and extensions for DRY configuration

```yaml
# x- prefix — extension fields, ignored by Compose
x-common-env: &common-env
  NODE_ENV: ${NODE_ENV:-production}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  TZ: ${TZ:-UTC}

x-db-env: &db-env
  DB_HOST: db
  DB_PORT: 5432
  DB_NAME: ${DB_NAME:-myapp}
  DB_USER: ${DB_USER:-postgres}
  DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

services:
  api:
    build: ./api
    environment:
      <<: *common-env
      <<: *db-env
      PORT: 3000

  worker:
    build: ./worker
    environment:
      <<: *common-env
      <<: *db-env
      QUEUE_NAME: default

  scheduler:
    build: ./scheduler
    environment:
      <<: *common-env
      <<: *db-env
      CRON_SCHEDULE: '*/5 * * * *'
```

📌 YAML anchors (`&name` / `*name`) allow you to avoid duplicating identical variable blocks.

---

## ⚠️ Common beginner mistakes

### 🐛 1. Secrets in docker-compose.yml

```yaml
# ❌ Password is hardcoded and will end up in Git
services:
  db:
    environment:
      POSTGRES_PASSWORD: super_secret_123
```

> **Why this is a mistake:** the `docker-compose.yml` file is committed to the repository. Even if you remove the password later, it will remain in the Git history forever. An attacker with access to the repository gets all your secrets.

```yaml
# ✅ Password from a variable or secret
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
```

### 🐛 2. .env file in Git

```bash
# ❌ .env with real passwords in the repository
git add .env
git commit -m "add config"
```

> **Why this is a mistake:** `.env` often contains real passwords, API keys, and other secrets. Even in a private repository this is a risk — any team member can see the production passwords.

```bash
# ✅ .env in .gitignore, .env.example in Git
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
```

### 🐛 3. Confusing .env for Compose with env_file for the container

```yaml
# ❌ Thinking that .env is passed inside the container
# .env substitutes ${VAR} in docker-compose.yml, but does NOT pass variables into the container!
services:
  api:
    image: myapp
    # The APP_PORT variable from .env will substitute into ports, but will NOT be inside the container
    ports:
      - '${APP_PORT}:3000'
```

> **Why this is a mistake:** `.env` and `env_file` are different mechanisms. `.env` substitutes values into `docker-compose.yml` (interpolation). `env_file` passes variables inside the container.

```yaml
# ✅ Explicitly pass variables inside the container
services:
  api:
    image: myapp
    ports:
      - '${APP_PORT}:3000'       # From .env (interpolation)
    env_file:
      - .env.app                  # Variables INSIDE the container
    environment:
      APP_PORT: ${APP_PORT}       # Or explicitly via environment
```

### 🐛 4. Secrets in ARG at build time

```dockerfile
# ❌ ARG with a secret is visible in docker history
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
```

> **Why this is a mistake:** ARG values are stored in image metadata. Anyone who downloads the image can run `docker history` and see the secrets.

```dockerfile
# ✅ Pass secrets only via secrets or runtime env
ENV DB_PASSWORD_FILE=/run/secrets/db_password
```

### 🐛 5. Missing default values

```yaml
# ❌ If DB_NAME is not set, Compose will substitute an empty string
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME}    # Can be empty!
```

> **Why this is a mistake:** if the variable is not defined, Compose will substitute an empty string. PostgreSQL will create a database with an empty name or return an error.

```yaml
# ✅ Default value or required
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}                     # Default
      POSTGRES_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD}  # Required
```

---

## 💡 Best practices

### 1. Use .env.example as a template

```bash
# ✅ .env.example in Git, .env in .gitignore
cp .env.example .env
# Fill in the real values
```

### 2. Separate configuration by environment

```bash
# ✅ Different files for different environments
.env              # dev (not in Git)
.env.staging      # staging (CI/CD)
.env.prod         # production (CI/CD)
.env.example      # template (in Git)
```

### 3. Secrets for production, env for dev

```yaml
# ✅ Dev: plain variables
# Production: file-based secrets
services:
  api:
    environment:
      DB_PASSWORD: ${DB_PASSWORD:-dev-password}
      DB_PASSWORD_FILE: ${DB_PASSWORD_FILE:-}
```

### 4. Always set default values

```yaml
# ✅ ${VAR:-default} for non-critical variables
# ✅ ${VAR:?error} for required variables
environment:
  NODE_ENV: ${NODE_ENV:-development}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be set}
```

### 5. Use YAML anchors for shared variables

```yaml
# ✅ DRY — don't duplicate identical blocks
x-common: &common
  NODE_ENV: ${NODE_ENV:-production}
  TZ: UTC

services:
  api:
    environment:
      <<: *common
      PORT: 3000
  worker:
    environment:
      <<: *common
      QUEUE: jobs
```

### 6. Verify configuration before starting

```bash
# Show the final configuration (with substituted variables)
docker compose config

# Check specific variables
docker compose config | grep -A5 environment
```

---

## 📌 Summary

- ✅ **ENV** in Dockerfile — variables for build and runtime, **ARG** — build time only
- ✅ **The -e flag** overrides ENV from Dockerfile at container runtime
- ✅ **.env file** is automatically loaded by Compose for `${VAR}` substitution in YAML
- ✅ **env_file** passes variables inside the container (a different mechanism)
- ✅ **Substitution**: `${VAR:-default}` for defaults, `${VAR:?error}` for required variables
- ✅ **Secrets** — secure password passing via `/run/secrets/` files
- ✅ **Configs** — non-secret configuration files (nginx.conf, prometheus.yml)
- ✅ **12-factor**: configuration in the environment, one image for all environments
- ✅ **Multi-env**: base + override/prod/staging + .env files for each environment
- ✅ **.env.example** — template in Git, `.env` — in `.gitignore`
- ✅ **YAML anchors** (`&name` / `*name`) — DRY for shared variable blocks
- ✅ **docker compose config** — verify the final configuration
