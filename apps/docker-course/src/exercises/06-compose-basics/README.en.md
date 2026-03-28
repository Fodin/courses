# Level 6: Docker Compose — Basics

## 🎯 The Problem: Manually Managing Multiple Containers

In previous levels we launched containers one by one using `docker run`. For a real application, this quickly becomes a nightmare:

```bash
# Create a network
docker network create myapp

# Start the database
docker run -d --name db \
  --network myapp \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  postgres:16

# Start Redis
docker run -d --name redis \
  --network myapp \
  redis:7-alpine

# Start the backend
docker run -d --name api \
  --network myapp \
  -e DATABASE_URL=postgresql://postgres:secret@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  -p 3000:3000 \
  my-api

# Start the frontend
docker run -d --name web \
  --network myapp \
  -p 80:80 \
  my-frontend
```

Four containers — and already 20 lines of commands. Now imagine needing to:
- Update one of the services
- Restart everything after a configuration change
- Hand this configuration off to a colleague
- Run the same thing on CI/CD

**Docker Compose** solves this problem: the entire configuration is described in a single `docker-compose.yml` file, and all containers are managed with a single command.

---

## 🔥 What Is Docker Compose

Docker Compose is a tool for **declaratively describing and managing multi-container applications**. Instead of imperative `docker run` commands, you describe the desired state in a YAML file.

```yaml
# docker-compose.yml — one file instead of dozens of commands
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp

  redis:
    image: redis:7-alpine

  api:
    build: ./api
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  web:
    build: ./frontend
    ports:
      - '80:80'

volumes:
  pgdata:
```

```bash
# One command starts EVERYTHING
docker compose up -d
```

### Key Advantages

- **Declarative** — describe "what", not "how"
- **Reproducible** — the file can be shared with a colleague or run on CI
- **Single command** — `docker compose up` creates networks, volumes, and containers
- **Automatic networking** — all services can reach each other by name
- **Version-controlled** — `docker-compose.yml` lives in Git alongside the code

---

## 🔥 Structure of docker-compose.yml

### Main Sections

```yaml
# Top-level keys of a docker-compose.yml file

services:      # Required — service (container) definitions
  web:
    image: nginx
  api:
    build: ./api

networks:      # Optional — custom networks
  frontend:
  backend:

volumes:       # Optional — named volumes
  pgdata:
  redis-data:

configs:       # Optional — configuration files
secrets:       # Optional — secrets
```

### About the version Key

```yaml
# ❌ version is no longer needed (deprecated since Compose V2)
version: '3.8'  # Old format — ignored

# ✅ Just start with services
services:
  web:
    image: nginx
```

📌 **The `version` key is obsolete.** Docker Compose V2 automatically determines the file format. If you see `version` in older projects — it can safely be removed.

---

## 🔥 Defining Services: image and build

### Using a Pre-built Image (image)

```yaml
services:
  # Image from Docker Hub
  db:
    image: postgres:16

  # Image with a specific tag
  redis:
    image: redis:7-alpine

  # Image from a private registry
  api:
    image: registry.company.com/my-api:v2.1.0

  # Image with a digest (maximum reproducibility)
  nginx:
    image: nginx@sha256:abc123...
```

### Building from a Dockerfile (build)

```yaml
services:
  # Simple build — Dockerfile in the specified directory
  api:
    build: ./api
    # Equivalent to: docker build ./api

  # Extended build configuration
  web:
    build:
      context: ./frontend        # Build context (folder with files)
      dockerfile: Dockerfile.prod # Dockerfile name (if non-standard)
      args:                       # Build arguments
        NODE_ENV: production
        API_URL: http://api:3000
      target: production          # Multi-stage: specific stage
      cache_from:
        - my-app:latest

  # image + build: builds and tags
  backend:
    build: ./backend
    image: my-backend:latest
    # Builds the image and assigns the tag my-backend:latest
```

### container_name

```yaml
services:
  db:
    image: postgres:16
    container_name: myapp-database
    # Default name: <project>-<service>-<replica>
    # With container_name: myapp-database (fixed)
```

⚠️ **container_name is not recommended** for production — it prevents scaling (`docker compose up --scale db=2` won't work). Use only in development when a predictable name is needed.

---

## 🔥 Port Mapping (ports)

### ports Syntax

```yaml
services:
  web:
    image: nginx
    ports:
      # Short syntax: "hostPort:containerPort"
      - '8080:80'

      # Localhost only
      - '127.0.0.1:8080:80'

      # Port range
      - '8000-8010:8000-8010'

      # Container port only (host port is random)
      - '80'

      # UDP protocol
      - '5353:53/udp'

  api:
    build: ./api
    ports:
      # Long syntax (more explicit)
      - target: 3000        # Container port
        published: 3000     # Host port
        protocol: tcp       # Protocol
        host_ip: 127.0.0.1  # Bind to interface
```

### expose — Internal Ports

```yaml
services:
  api:
    build: ./api
    expose:
      - '3000'
    # expose does NOT publish the port on the host
    # Used for documentation and inter-service communication
    # Other services in the same network can see api:3000
```

📌 **ports** publishes a port on the host (accessible from a browser). **expose** only documents the port for internal communication.

---

## 🔥 Volumes

### Bind Mount — Mounting a Host Folder

```yaml
services:
  web:
    image: nginx
    volumes:
      # Mount the current folder into the container
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

      # Mount source code (for development)
      - ./src:/app/src

      # Long syntax
      - type: bind
        source: ./data
        target: /app/data
        read_only: true
```

### Named Volumes

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

# Declaring named volumes
volumes:
  pgdata:           # Docker will create the volume automatically
  redis-data:
    driver: local   # Driver (default: local)
```

### Anonymous Volumes

```yaml
services:
  api:
    build: ./api
    volumes:
      # Anonymous volume — Docker creates it with a random name
      - /app/node_modules
      # Useful for excluding node_modules from a bind mount
```

### Typical Development Pattern

```yaml
services:
  api:
    build: ./api
    volumes:
      - ./api:/app           # Source code from the host
      - /app/node_modules    # Do NOT overwrite node_modules from the image
```

---

## 🔥 Environment Variables (environment, env_file)

### Inline Variables

```yaml
services:
  api:
    build: ./api
    environment:
      # key: value format
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      REDIS_URL: redis://redis:6379

      # Or list format
      # - NODE_ENV=production
      # - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
```

### Variable File (env_file)

```yaml
services:
  api:
    build: ./api
    env_file:
      - .env           # Shared variables
      - .env.local     # Local overrides

  db:
    image: postgres:16
    env_file:
      - ./db/.env      # Database variables
```

`.env` file:
```bash
# .env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
SECRET_KEY=my-super-secret-key
```

### Host Environment Variable Substitution

```yaml
services:
  api:
    image: my-api:${API_VERSION:-latest}
    # Uses the API_VERSION variable from the host environment
    # If not set — "latest" is substituted

    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/myapp
      # DB_PASSWORD is taken from the host environment or the .env file
```

The `.env` file in the project root (next to docker-compose.yml) is loaded by Compose automatically:

```bash
# .env (loaded automatically!)
API_VERSION=2.1.0
DB_PASSWORD=super-secret
COMPOSE_PROJECT_NAME=myapp
```

📌 **Do not commit `.env` with secrets to Git!** Add `.env` to `.gitignore` and create a `.env.example` template file.

---

## 🔥 Core Docker Compose Commands

### docker compose up

```bash
# Start all services
docker compose up

# Start in the background (detached)
docker compose up -d

# Start specific services
docker compose up -d api db

# Rebuild images before starting
docker compose up -d --build

# Recreate containers (even if the configuration hasn't changed)
docker compose up -d --force-recreate

# Start with a different compose file
docker compose -f docker-compose.prod.yml up -d
```

### docker compose down

```bash
# Stop and remove containers + networks
docker compose down

# Also remove volumes (CAUTION — data will be lost!)
docker compose down -v

# Also remove images
docker compose down --rmi all

# Remove only locally built images
docker compose down --rmi local
```

### docker compose logs

```bash
# Logs from all services
docker compose logs

# Logs from a specific service
docker compose logs api

# Follow logs in real time
docker compose logs -f

# Last N lines
docker compose logs --tail 50

# Logs with timestamps
docker compose logs -t

# Combination: last 20 lines + follow
docker compose logs -f --tail 20 api
```

### docker compose ps

```bash
# Status of all services
docker compose ps

# Output:
# NAME          SERVICE   STATUS    PORTS
# myapp-api-1   api       running   0.0.0.0:3000->3000/tcp
# myapp-db-1    db        running   5432/tcp
# myapp-web-1   web       running   0.0.0.0:80->80/tcp
```

### docker compose exec

```bash
# Execute a command in a running container
docker compose exec api sh
docker compose exec db psql -U postgres
docker compose exec api npm run migrate
```

### docker compose build

```bash
# Build (or rebuild) all images
docker compose build

# Build a specific service
docker compose build api

# Build without cache
docker compose build --no-cache

# Build with build arguments
docker compose build --build-arg NODE_ENV=production
```

### docker compose restart / stop / start

```bash
# Restart a service (without recreating)
docker compose restart api

# Stop (without removing)
docker compose stop

# Start previously stopped services
docker compose start
```

---

## 🔥 Project Name

Docker Compose uses the **project name** as a prefix for all resources:

```bash
# Default — folder name
# Folder: /home/user/myapp
# Containers: myapp-api-1, myapp-db-1
# Network: myapp_default
# Volumes: myapp_pgdata

# Change the project name
docker compose -p custom-name up -d
# Containers: custom-name-api-1, custom-name-db-1

# Or via an environment variable
COMPOSE_PROJECT_NAME=custom-name docker compose up -d

# Or in the .env file
# COMPOSE_PROJECT_NAME=custom-name
```

📌 **The project name defines the namespace.** Two projects with different names can run in parallel, even if they use the same `docker-compose.yml`.

---

## 🔥 Automatic Network in Compose

Docker Compose **automatically creates a network** for the project and connects all services to it:

```yaml
services:
  api:
    build: ./api
    # api can reach db by the name "db"
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp

  db:
    image: postgres:16
```

```bash
docker compose up -d

# Compose created the network automatically
docker network ls
# myapp_default   bridge   local

# All services are in the same network — DNS works
docker compose exec api ping db
# PING db (172.18.0.3): 56 data bytes
# 64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.089 ms
```

You do **not need** to create networks manually or specify `--network` — Compose does it automatically.

---

## 🔥 Variable Substitution

### Syntax

```yaml
services:
  api:
    image: my-api:${TAG}           # Required variable
    image: my-api:${TAG:-latest}   # Default value if not set
    image: my-api:${TAG-latest}    # Default value if not present
    image: my-api:${TAG:?error}    # Error if not set
    image: my-api:${TAG?error}     # Error if not present
```

### Variable Priority Order

1. Host environment variables (highest priority)
2. `.env` file in the directory with `docker-compose.yml`
3. Default values in `${VAR:-default}`

```bash
# .env
TAG=2.0

# Override from the environment
TAG=3.0 docker compose up -d
# TAG=3.0 will be used
```

---

## ⚠️ Common Beginner Mistakes

### 🐛 1. Using the Deprecated docker-compose (with a hyphen)

```bash
# ❌ Old format (V1, deprecated)
docker-compose up -d

# ✅ New format (V2, built into Docker)
docker compose up -d
```

> **Why this is a mistake:** `docker-compose` (V1) is a separate Python binary, it is deprecated and no longer maintained. `docker compose` (V2) is a Docker CLI plugin written in Go — it is faster and supports new features.

### 🐛 2. Unquoted ports Strings

```yaml
# ❌ YAML interprets 80:80 as a base-60 number
services:
  web:
    ports:
      - 80:80    # YAML may parse this incorrectly!
```

> **Why this is a mistake:** the YAML parser may interpret `80:80` as a base-60 number (4880). This leads to unpredictable behavior.

```yaml
# ✅ Always wrap ports in quotes
services:
  web:
    ports:
      - '80:80'
      - '443:443'
      - '127.0.0.1:3000:3000'
```

### 🐛 3. Forgot to Declare Named Volumes

```yaml
# ❌ Volume not declared in the volumes section
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
# Error: service "db" refers to undefined volume pgdata
```

> **Why this is a mistake:** named volumes (not bind mounts) must be declared in the top-level `volumes` section.

```yaml
# ✅ Volume declared
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:    # Volume declaration
```

### 🐛 4. Confusing docker compose down with docker compose stop

```bash
# ⚠️ down removes containers and networks
docker compose down

# ⚠️ down -v ALSO removes volumes (database data will be gone!)
docker compose down -v

# ✅ stop only stops, removes nothing
docker compose stop
```

> **Why this is a mistake:** `docker compose down -v` destroys all data in named volumes. If a volume held a database, it will be permanently lost.

### 🐛 5. Relative Paths for Bind Mounts Not Starting with a Dot

```yaml
# ❌ Compose interprets this as a named volume, not a path
services:
  web:
    volumes:
      - data:/app/data
      # "data" is a named volume, NOT the folder ./data!

# ✅ For bind mounts use ./ or an absolute path
services:
  web:
    volumes:
      - ./data:/app/data     # Bind mount to the local folder
```

> **Why this is a mistake:** Compose distinguishes bind mounts from named volumes by the presence of `./` or `/` at the start of the path. Without a dot, Compose looks for a named volume.

### 🐛 6. Secrets in docker-compose.yml Committed to Git

```yaml
# ❌ Password in a file that will end up in Git
services:
  db:
    environment:
      POSTGRES_PASSWORD: super-secret-password-123
```

> **Why this is a mistake:** `docker-compose.yml` is often committed to Git. Secrets in it become visible to everyone with access to the repository.

```yaml
# ✅ Use variables from .env (which is in .gitignore)
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

```bash
# .env (added to .gitignore!)
DB_PASSWORD=super-secret-password-123
```

---

## 💡 Best Practices

### 1. Always Specify Image Tags

```yaml
# ❌ latest can change at any time
services:
  db:
    image: postgres

# ✅ Specific version
services:
  db:
    image: postgres:16-alpine
```

### 2. Use env_file for Secrets

```yaml
# ✅ Secrets in a separate file
services:
  api:
    env_file:
      - .env
```

### 3. Wrap ports in Quotes

```yaml
# ✅ Safe syntax
ports:
  - '8080:80'
```

### 4. Declare All Named Volumes

```yaml
services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 5. Use .dockerignore

Create a `.dockerignore` in each directory with a Dockerfile:
```
node_modules
.git
.env
*.log
```

### 6. Group Related Services

```yaml
# ✅ Logical order: infrastructure → backend → frontend
services:
  db:
    image: postgres:16
  redis:
    image: redis:7-alpine
  api:
    build: ./api
  web:
    build: ./frontend
```

---

## 📌 Summary

- ✅ **Docker Compose** — declarative management of multi-container applications
- ✅ **docker-compose.yml** — a single file describing all services, networks, and volumes
- ✅ **services** — container definitions via `image` or `build`
- ✅ **ports** — publishing ports on the host (always in quotes!)
- ✅ **volumes** — bind mounts (./path) and named volumes (declare at the top level)
- ✅ **environment / env_file** — environment variables
- ✅ **docker compose up -d** — start all services in the background
- ✅ **docker compose down** — stop and remove (be careful with `-v`!)
- ✅ **docker compose logs -f** — follow logs in real time
- ✅ **Automatic network** — services find each other by name
- ✅ **Variable substitution** — `${VAR:-default}` from the environment or `.env`
- ✅ **version** is obsolete — do not include it in new projects
- ✅ Use `docker compose` (V2), not `docker-compose` (V1)
