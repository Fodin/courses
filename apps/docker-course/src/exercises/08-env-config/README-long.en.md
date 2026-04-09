# Level 8: Environment Variables and Configuration -- Complete Guide

## Introduction

Imagine a restaurant chain with multiple branches. The recipes are the same -- the same chef wrote them in a cookbook. But each branch uses its own suppliers, its own prices, its own delivery address, its own cash system logins. The cookbook doesn't change -- only the "settings card" of each specific branch changes.

In the Docker world, your image is the cookbook, and environment variables and configuration files are the settings cards for each branch (dev, staging, production). The same image must work in any environment without rebuilding. Only the configuration changes.

This is one of the key principles of containerization: **code and configuration live separately**. Violating this principle leads to password leaks, irreproducible bugs, and sleepless nights for on-call engineers.

In this level, we will explore in detail:

1. **The hardcoded secrets problem** -- why passwords in code and YAML files are dangerous
2. **ENV and ARG in Dockerfile** -- how they differ and when to use each
3. **Environment variables at launch** -- `-e` flags, `--env-file`, and priorities
4. **.env files** -- syntax, Compose integration, variable substitution
5. **Docker Secrets** -- secure password and key passing
6. **Docker Configs** -- non-secret configuration files
7. **Templates for multiple environments** -- how to organize dev/staging/prod
8. **YAML anchors** -- DRY approach to Compose configuration
9. **Common mistakes** -- what usually goes wrong and how to avoid it

---

## 1. The Problem: Hardcoded Passwords

### What a Disaster Looks Like

A developer rushes to launch a project and describes the stack directly in `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: super_secret_123    # Password directly in file
      POSTGRES_USER: admin

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://admin:super_secret_123@db:5432/myapp
      JWT_SECRET: my-jwt-secret-key          # Another secret
      STRIPE_API_KEY: sk_live_abc123         # Payment key
```

The file gets committed to Git. Even if the developer later removes the passwords -- they will **forever** remain in the commit history. Any team member (or attacker if the repository leaks) gets full access to the database, payment system, and authorization mechanism.

### Real Scale of the Problem

According to GitGuardian research, in 2023 over 12 million leaked secrets were discovered in public GitHub repositories. The most common cases -- database passwords and API keys hardcoded in configuration files.

### What Docker Provides

Docker offers several mechanisms to solve this problem, from simple to advanced:

```mermaid
flowchart TD
    config["Application Configuration"]
    config --> nonsecret["Non-secret data<br/>ports, modes, log levels"]
    config --> secret["Secret data<br/>passwords, keys, tokens"]

    nonsecret --> env["ENV in Dockerfile"]
    nonsecret --> envflag["-e / env_file"]
    nonsecret --> configs["Docker Configs"]

    secret --> envfile[".env files outside Git"]
    secret --> secrets["Docker Secrets"]
    secret --> external["External stores<br/>Vault, AWS Secrets Manager"]

    style secret fill:#e74c3c,color:#fff
    style nonsecret fill:#2ecc71,color:#fff
    style secrets fill:#3498db,color:#fff
    style external fill:#3498db,color:#fff
```

Each mechanism occupies its niche. Simple variables -- for port and log level. Secrets -- for passwords and keys. The more sensitive the data, the more protected mechanism should be used.

---

## 2. ENV and ARG in Dockerfile

### ENV Instruction

`ENV` sets environment variables available **both during build and at container runtime**. This is important to understand -- a variable set via `ENV` becomes part of the image and will be present in all containers created from it.

```dockerfile
FROM node:20-alpine

# Each variable -- separate instruction
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV LOG_LEVEL=info

WORKDIR /app
EXPOSE $APP_PORT
CMD ["node", "server.js"]
```

When you run a container from this image, the application inside will see `process.env.NODE_ENV === 'production'`, `process.env.APP_PORT === '3000'`, and `process.env.LOG_LEVEL === 'info'` -- even if you didn't pass any flags at `docker run`.

### ARG Instruction

`ARG` -- this is a **build-time only** variable. It exists while `docker build` is running and disappears afterward. It's not available in the running container.

```dockerfile
# ARG can be used BEFORE FROM
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# ARG after FROM needs to be redeclared -- previous one is "forgotten"
ARG BUILD_DATE
ARG APP_VERSION=1.0.0

# Image metadata
LABEL build-date=${BUILD_DATE}
LABEL version=${APP_VERSION}

ENV NODE_ENV=production
```

Note the important nuance: `ARG` declared before `FROM` is available only in the `FROM` line. After `FROM`, a new "scope" begins, and all previous `ARG`s need to be redeclared.

### When to Use Which

Analogy: `ARG` is construction scaffolding. It's needed while the building is being constructed, then removed. `ENV` is apartment number signs on doors. They remain after construction because residents need to know their apartment number.

```mermaid
sequenceDiagram
    participant Dev as Developer
    participant Build as docker build
    participant Image as Image
    participant Run as docker run
    participant Container as Container

    Dev->>Build: --build-arg VERSION=2.1
    Note over Build: ARG available here
    Note over Build: ENV available here
    Build->>Image: Finished image
    Note over Image: ARG lost
    Note over Image: ENV saved
    Dev->>Run: -e LOG_LEVEL=debug
    Run->>Container: Launch
    Note over Container: ENV from image + overrides
    Note over Container: ARG not available
```

### Comparison Table

| Characteristic | ARG | ENV |
|----------------|-----|-----|
| Available during `docker build` | yes | yes |
| Available during `docker run` | no | yes |
| Override via `--build-arg` | yes | no |
| Override via `-e` / `--env` | no | yes |
| Saved in the image | no | yes |
| Suitable for secrets | no | no |

Note the last line. Neither `ARG` nor `ENV` is suitable for secrets. `ARG` is visible via `docker history`, and `ENV` via `docker inspect`.

### Pattern: Passing ARG to ENV

Often you need a value passed at build time to also be available at runtime. For this, a "bridge" between `ARG` and `ENV` is used:

```dockerfile
ARG APP_VERSION=1.0.0
# "Bridge": ARG value copied to ENV
ENV APP_VERSION=${APP_VERSION}
```

This is useful, for example, for application version -- you want to set it during CI/CD build, but the application inside the container also needs to know its version (for metrics, logs, healthcheck endpoints).

```bash
# During CI/CD build
docker build --build-arg APP_VERSION=$(git describe --tags) -t myapp .
```

### ARG and Secrets Trap

`ARG` values are saved in image metadata. This means anyone who downloads your image can run one command and see all secrets:

```bash
# Don't do this!
docker build --build-arg DB_PASSWORD=secret123 .

# Any user of the image will see:
docker history myapp
# STEP  CREATED BY
# ...   ARG DB_PASSWORD=secret123   # Visible to everyone!
```

For passing secrets during build, use `--secret` (BuildKit):

```bash
# Correct way -- secret doesn't end up in image metadata
echo "secret123" > /tmp/db_password
docker build --secret id=db_password,src=/tmp/db_password .
```

```dockerfile
# In Dockerfile
RUN --mount=type=secret,id=db_password \
    cat /run/secrets/db_password | some-command
```

---

## 3. Environment Variables at Container Launch

### -e Flag

The `-e` (or `--env`) flag is the most direct way to pass a variable to a container:

```bash
# Single variable
docker run -e NODE_ENV=production myapp

# Multiple variables
docker run \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  myapp
```

There's a convenient trick -- pass a variable from the host system without specifying its value. Docker takes the value from the host's environment:

```bash
export API_KEY=abc123
docker run -e API_KEY myapp
# Container gets API_KEY=abc123 -- value taken from host
```

This is useful in CI/CD, where secrets are often set as runner environment variables.

### --env-file Flag

When there are many variables, listing each via `-e` is inconvenient. The `--env-file` flag loads variables from a file:

```bash
docker run --env-file .env myapp

# Can specify multiple files
docker run --env-file .env --env-file .env.local myapp
```

### Variable Priority

If the same variable is set in multiple places, Docker applies a clear priority hierarchy -- from highest to lowest:

```
1. docker run -e VAR=value          -- -e flag, highest priority
2. docker run --env-file .env       -- file with variables
3. ENV VAR=value in Dockerfile      -- value from image, lowest priority
```

This hierarchy is logical: more specific overrides more general. Image sets defaults, environment file -- environment settings, and `-e` flag -- targeted overrides.

Example in action:

```dockerfile
# Dockerfile
ENV LOG_LEVEL=info
```

```bash
# .env file
LOG_LEVEL=warn
```

```bash
# Launch -- what wins?
docker run --env-file .env -e LOG_LEVEL=debug myapp
# Result: LOG_LEVEL=debug (the -e flag wins)
```

### Checking Container Variables

If you need to find out what variables a container received, use `docker exec` or `docker inspect`:

```bash
# See all variables inside a running container
docker exec mycontainer env

# Or via inspect -- works even for stopped containers
docker inspect mycontainer --format='{{json .Config.Env}}'
```

---

## 4. .env Files: Syntax and Working with Docker Compose

### .env File Syntax

A `.env` file is a simple text file with `KEY=value` pairs. The syntax is straightforward but has its nuances:

```bash
# .env -- environment variables

# Comments start with #

# Simple assignment -- most common case
NODE_ENV=production
APP_PORT=3000

# Values in quotes -- needed for spaces and special characters
APP_NAME="My Docker App"
GREETING='Hello, World!'

# Without quotes, spaces are trimmed
DB_HOST=localhost

# Empty value -- variable exists but is empty
EMPTY_VAR=

# Multi-line values -- in double quotes
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
```

What is **not supported** in Docker `.env` files:

```bash
# Doesn't work: export
export VAR=value

# Doesn't work: variable substitution
VAR=${OTHER_VAR}

# Doesn't work: command execution
VAR=$(date)
```

This is a common source of confusion for those accustomed to bash scripts, where all these constructs work.

### Automatic .env Loading in Docker Compose

Docker Compose automatically searches for a `.env` file in the project directory (next to `docker-compose.yml`) and loads it. No additional configuration needed:

```
project/
  docker-compose.yml
  .env                  # Loaded automatically
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

### Variable Substitution -- A Powerful Mechanism

Docker Compose supports not just simple substitution `${VAR}`, but a whole set of modifiers borrowed from bash. They allow setting defaults, making variables required, and even outputting errors:

```yaml
services:
  api:
    image: myapp:${TAG}

    environment:
      # Default if VAR not set OR empty
      NODE_ENV: ${NODE_ENV:-production}

      # Default only if VAR not set, empty string is OK
      LOG_LEVEL: ${LOG_LEVEL-info}

      # Error on launch if variable not set
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Alternative value -- substituted only if VAR is set and not empty
      DEBUG: ${DEBUG:+true}
```

Let's examine each modifier in detail:

| Syntax | What it does | VAR not set | VAR="" | VAR="hello" |
|-----------|-----------|-------------|--------|-------------|
| `${VAR}` | Just substitutes | empty | empty | hello |
| `${VAR:-default}` | Default if not set or empty | default | default | hello |
| `${VAR-default}` | Default only if not set | default | empty | hello |
| `${VAR:?error}` | Error if not set or empty | ERROR | ERROR | hello |
| `${VAR?error}` | Error only if not set | ERROR | empty | hello |
| `${VAR:+alt}` | Alt if set and not empty | empty | empty | alt |

The difference between `:-` and `-` (with and without colon) -- in handling empty strings. The colon version considers an empty string "unset", the non-colon version -- "set."

In practice, `:-` (default) and `:?` (required variable) are most commonly used:

```yaml
environment:
  # Non-critical -- with defaults
  NODE_ENV: ${NODE_ENV:-development}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  TZ: ${TZ:-UTC}

  # Critical -- with error on absence
  DB_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}
  JWT_SECRET: ${JWT_SECRET:?Set JWT_SECRET in .env}
```

### Two Mechanisms: .env for Compose vs env_file for Container

This is one of the most common misconceptions among beginners. In Docker Compose, there are **two different mechanisms** for passing variables, and they work at different stages:

```mermaid
flowchart TD
    dotenv[".env file"]
    envfile["env_file in YAML"]
    compose["docker-compose.yml"]
    container["Container"]

    dotenv -->|"Substitution ${VAR}<br/>in YAML file"| compose
    compose -->|"environment: KEY=VALUE"| container
    envfile -->|"Pass variables<br/>directly to container"| container

    style dotenv fill:#f39c12,color:#fff
    style envfile fill:#3498db,color:#fff
    style compose fill:#95a5a6,color:#fff
    style container fill:#2ecc71,color:#fff
```

**`.env` file** -- this is Compose's own tool. It substitutes values into the YAML file before launching containers. This is **interpolation** -- replacing `${VAR}` with concrete values.

**`env_file` directive** -- this is a container tool. It takes all `KEY=VALUE` pairs from the specified file and passes them inside the container as environment variables.

```yaml
services:
  api:
    ports:
      - '${APP_PORT}:3000'       # APP_PORT taken from .env (interpolation)
    env_file:
      - .env.app                  # These variables go INSIDE the container
    environment:
      APP_PORT: ${APP_PORT}       # Explicit passing of APP_PORT inside container
```

### Multiple .env Files

Starting from Compose v2.17, you can specify multiple files in `env_file`:

```yaml
services:
  api:
    env_file:
      - .env              # Base variables
      - .env.local         # Local overrides
      - .env.${ENV:-dev}   # Variables for specific environment
```

Or override the `.env` file via CLI:

```bash
docker compose --env-file .env.staging up -d
```

### Variable Priority in Docker Compose

Docker Compose gathers variables from several sources. Here's their priority from highest to lowest:

```
1. environment: in docker-compose.yml    -- explicit value, highest priority
2. Host shell variables               -- export VAR=value
3. env_file: in docker-compose.yml       -- file for service
4. .env file in project directory       -- automatic loading
5. ENV in Dockerfile                     -- image, lowest priority
```

Understanding this hierarchy is critical for debugging. If a variable has an unexpected value -- check all five levels.

---

## 5. Docker Secrets: Secure Secret Storage

### Why Environment Variables Aren't Suitable for Passwords

Environment variables are convenient, but they have a fundamental problem -- they're **visible** in many ways:

```bash
# Through docker inspect -- without access inside the container
docker inspect mycontainer --format='{{json .Config.Env}}'
# ["DB_PASSWORD=super_secret_123", "JWT_SECRET=my-secret"]

# Through /proc inside the container
docker exec mycontainer cat /proc/1/environ
# DB_PASSWORD=super_secret_123

# Through application logs -- accidental console.log
console.log('Config:', process.env)  # Outputs ALL variables, including passwords
```

For dev environment this is acceptable -- convenience is more important than security on a local machine. But for production, a different approach is needed.

### How Docker Secrets Work

Docker Secrets is a mechanism for passing confidential data through files, not through environment variables:

```mermaid
flowchart LR
    secret_file["secrets/db_password.txt"]
    compose["docker-compose.yml<br/>secrets: db_password"]
    tmpfs["tmpfs in container<br/>/run/secrets/db_password"]
    app["Application<br/>reads file"]

    secret_file --> compose
    compose --> tmpfs
    tmpfs --> app

    style secret_file fill:#e74c3c,color:#fff
    style tmpfs fill:#3498db,color:#fff
    style app fill:#2ecc71,color:#fff
```

Key properties:
- Secrets are mounted as files in `/run/secrets/<name>`
- In Docker Swarm they are stored encrypted and transmitted only to the right nodes
- They're not visible through `docker inspect`
- They don't end up in environment variables and won't "leak" through `console.log(process.env)`

### Configuring Secrets in Compose

Create files with secrets:

```bash
# Important: no trailing newline!
echo -n "super_secret_123" > secrets/db_password.txt
echo -n "postgresql://postgres:super_secret_123@db:5432/myapp" > secrets/database_url.txt
```

Describe secrets in `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      # Note: _FILE, not just POSTGRES_PASSWORD
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password           # Which secrets are available to this service

  api:
    build: ./api
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
      - jwt_secret

# Secret definitions -- where to get the data
secrets:
  db_password:
    file: ./secrets/db_password.txt     # From local file
  database_url:
    file: ./secrets/database_url.txt
  jwt_secret:
    environment: JWT_SECRET             # From host environment variable
```

### Reading Secrets in Application

Your application needs to be able to read secrets from files. Here's a universal pattern with fallback to environment variables:

```javascript
// Node.js
const fs = require('fs')

function getSecret(name) {
  const secretPath = `/run/secrets/${name}`
  try {
    return fs.readFileSync(secretPath, 'utf8').trim()
  } catch {
    // Fallback to environment variable -- for dev environment
    return process.env[name.toUpperCase()]
  }
}

const dbPassword = getSecret('db_password')
const jwtSecret = getSecret('jwt_secret')
```

The fallback to `process.env` makes the code universal -- in development variables are passed the usual way, in production -- through secrets. One code for both environments.

### _FILE Suffix in Official Images

Many official images (PostgreSQL, MySQL, MariaDB, MongoDB) support the `_FILE` convention. Instead of `POSTGRES_PASSWORD`, you set `POSTGRES_PASSWORD_FILE`, and the image reads the password from the specified file itself:

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

This means you don't need to change the image code -- just switch the variable from `PASSWORD` to `PASSWORD_FILE`.

---

## 6. Docker Configs: Non-Secret Configuration Files

### When Configs Are Needed

Not all configuration is secrets. The `nginx.conf` file, Prometheus settings, Grafana rules -- these are regular configuration files that don't contain passwords but need to be delivered inside a container.

### Configs vs Secrets vs Volumes

| Characteristic | Secrets | Configs | Bind mount |
|----------------|---------|---------|------------|
| Purpose | Passwords, keys, tokens | nginx.conf, prometheus.yml | Any files |
| Path in container | `/run/secrets/<name>` | Configurable | Configurable |
| Encryption in Swarm | Yes | No | No |
| Mutability | Immutable | Immutable | Mutable |
| Live update | No | No | Yes |
| Swarm replication | Yes | Yes | No |

### Using Configs in Compose

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf    # Where to place in container

  prometheus:
    image: prom/prometheus
    configs:
      - source: prom_config
        target: /etc/prometheus/prometheus.yml

configs:
  nginx_conf:
    file: ./config/nginx.conf           # From local file
  prom_config:
    file: ./config/prometheus.yml
```

### When to Use What

Analogy: imagine an office. **Secrets** -- a safe with passwords and server room keys. **Configs** -- job descriptions and regulations, printed and placed on each employee's desk. **Bind mount** -- a shared folder on a network drive that everyone can read and write to in real time.

- **For development** -- bind mount (changes apply instantly, no restart)
- **For production** -- configs (immutability, cluster replication)
- **For secrets** -- always secrets

---

## 7. Configuration Templates for Multiple Environments

### 12-Factor App Principles

The 12-Factor App methodology formulates three key rules for configuration:

1. **Configuration stored in environment variables** -- not in code, not in config files inside the repository
2. **Code doesn't distinguish environments** -- same image for dev, staging, and prod
3. **Secrets are never hardcoded** -- even "temporarily," even for dev environment

This isn't abstract theory -- it's a practical approach that avoids a whole class of errors: "works on my machine but crashes in production."

### Project Structure

Here's what a well-organized project with multiple environments looks like:

```
project/
  docker-compose.yml            # Base configuration -- in Git
  docker-compose.override.yml   # Dev settings -- in .gitignore
  docker-compose.prod.yml       # Production overrides -- in Git
  docker-compose.staging.yml    # Staging overrides -- in Git

  .env                          # Dev variables by default -- in .gitignore
  .env.example                  # .env template for new developers -- in Git
  .env.staging                  # Staging variables -- in .gitignore or CI
  .env.prod                     # Production variables -- in .gitignore or CI

  secrets/                      # Secrets -- in .gitignore!
    db_password.txt
    jwt_secret.txt

  .gitignore
```

The principle is simple: files with real values -- outside Git, files with structure and templates -- in Git.

---

## 8. YAML Anchors -- DRY Configuration

YAML anchors allow reusing configuration blocks to avoid duplication:

```yaml
x-defaults: &default-service
  restart: unless-stopped
  logging:
    driver: json-file
    options:
      max-size: "10m"
      max-file: "3"

services:
  api:
    <<: *default-service
    build: ./api
    ports:
      - '3000:3000'

  worker:
    <<: *default-service
    build: ./worker
```

---

## Common Beginner Mistakes

### 1. Storing Secrets in docker-compose.yml

```yaml
# ❌ Password directly in file
services:
  db:
    environment:
      POSTGRES_PASSWORD: super-secret-password-123
```

Solution: use variable substitution from `.env`:

```yaml
# ✅ Password via variable
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

### 2. Confusing .env for Compose with env_file

The `.env` file in the project root substitutes values into the YAML itself. `env_file` passes variables into the container. They serve different purposes.

### 3. Using ARG for Secrets

```dockerfile
# ❌ ARG values are visible in docker history
ARG DB_PASSWORD=secret
```

Use `--secret` with BuildKit instead.

### 4. Not Using _FILE Suffix for Official Images

Many official images support the `_FILE` convention for reading secrets from files. Use it instead of passing passwords as plain environment variables.

---

## Summary

Configuration management in Docker follows the principle of separating code from configuration:

- **ENV** -- for variables available both at build and runtime (not for secrets)
- **ARG** -- for build-time only variables (not for secrets)
- **`-e` / `--env-file`** -- for passing variables at container launch
- **`.env` files** -- for Compose variable substitution (keep out of Git!)
- **Docker Secrets** -- for secure secret passing via files (production)
- **Docker Configs** -- for non-secret configuration files

Key rules:
- ✅ Never hardcode secrets in code or YAML files
- ✅ Use `.env` files for local development (add to `.gitignore`)
- ✅ Use Docker Secrets or `_FILE` convention for production
- ✅ Use YAML anchors to avoid configuration duplication
- ✅ Maintain separate override files for each environment
- ❌ Don't commit `.env` files with real values to Git
- ❌ Don't use ARG for secrets (visible in `docker history`)
