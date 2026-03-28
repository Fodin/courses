# Level 3: Dockerfile — Instructions and Best Practices

## 🎯 What is a Dockerfile

A Dockerfile is a text file with instructions for automatically building a Docker image. Each instruction creates a **new layer** in the image. Docker executes instructions sequentially from top to bottom.

```dockerfile
# Basic Dockerfile example
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

In previous levels we worked with ready-made images. Now we will learn to create our own — from simple to production-ready ones with multi-stage builds.

---

## 🔥 WORKDIR — working directory

`WORKDIR` sets the working directory for all subsequent instructions: `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`.

```dockerfile
# Set the working directory
WORKDIR /app

# All relative paths are now from /app
COPY package.json ./        # Copied to /app/package.json
RUN npm install              # Runs in /app
```

### Key features of WORKDIR

**1. Automatic directory creation**

If the directory does not exist, `WORKDIR` will create it automatically:

```dockerfile
WORKDIR /app/src/components
# Creates the full chain /app/src/components
```

**2. Can be used multiple times**

```dockerfile
WORKDIR /app
COPY package.json ./
RUN npm install

WORKDIR /app/src
COPY . .
# We are now in /app/src
```

**3. Supports environment variables**

```dockerfile
ENV APP_HOME=/application
WORKDIR $APP_HOME
# Working directory = /application
```

### ⚠️ Why you should not use `RUN cd`

```dockerfile
# ❌ Bad: cd does not persist between instructions
RUN cd /app
RUN npm install   # Runs in /, not in /app!

# ✅ Good: WORKDIR persists
WORKDIR /app
RUN npm install   # Runs in /app
```

Each `RUN` instruction starts in a new shell. Therefore `cd` in one instruction has no effect on the next.

---

## 🔥 ENV — environment variables (runtime)

`ENV` sets environment variables that are available **both during the build and in the running container**.

```dockerfile
# Syntax
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV DATABASE_URL=postgres://localhost:5432/mydb

# Old syntax (without =), also valid
ENV NODE_ENV production
```

### Scope of ENV

Variables set via `ENV` are available:
- In all subsequent Dockerfile instructions (`RUN`, `CMD`, `ENTRYPOINT`)
- Inside the running container
- They can be overridden at startup: `docker run -e NODE_ENV=development`

```dockerfile
ENV APP_VERSION=2.0.0
ENV LOG_LEVEL=info

# Available in RUN
RUN echo "Building version $APP_VERSION"

# Available in CMD
CMD ["sh", "-c", "echo $LOG_LEVEL"]
```

### Setting multiple ENV variables

```dockerfile
# Multiple variables in one instruction
ENV NODE_ENV=production \
    APP_PORT=3000 \
    LOG_LEVEL=warn
```

---

## 🔥 ARG — build arguments (build-time)

`ARG` defines variables that are available **only during the image build**.

```dockerfile
# Define an argument with a default value
ARG NODE_VERSION=20
ARG APP_ENV=production

# Use in instructions
FROM node:${NODE_VERSION}-alpine
```

### Passing arguments during the build

```bash
# Override the argument value
docker build --build-arg NODE_VERSION=18 --build-arg APP_ENV=staging .
```

### 📌 Key difference between ENV and ARG

| Characteristic | ENV | ARG |
|---|---|---|
| **Available during build** | Yes | Yes |
| **Available in container** | Yes | No |
| **Override at runtime** | `docker run -e` | Not possible |
| **Override at build time** | Not possible | `--build-arg` |
| **Persisted in image** | Yes | No |

### Combining ARG and ENV

A common pattern — pass a value via `ARG` at build time and save it in `ENV`:

```dockerfile
ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}

# APP_VERSION is now available in the container as well
```

### ⚠️ ARG scope relative to FROM

```dockerfile
# This ARG is available BEFORE the first FROM
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# This ARG must be defined AFTER FROM
ARG BUILD_DATE
RUN echo "Built on: ${BUILD_DATE}"
```

📌 An ARG defined before `FROM` is available **only in the FROM instruction**. After `FROM` it must be redeclared if it is needed in other instructions.

---

## 🔥 CMD — default command

`CMD` defines the command that runs when the **container starts**. It is the default command — it can be overridden with `docker run`.

### Three forms of CMD

**1. Exec form (recommended)**

```dockerfile
CMD ["node", "server.js"]
```

Runs the process directly, without a shell. The process receives PID 1 and correctly handles signals (SIGTERM, SIGINT).

**2. Shell form**

```dockerfile
CMD node server.js
```

Wrapped in `/bin/sh -c "node server.js"`. The shell gets PID 1 and node becomes a child process. Signals may not reach the application.

**3. Argument form for ENTRYPOINT**

```dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
# Equivalent: python app.py
```

### Overriding CMD

```bash
# CMD from Dockerfile
docker run my-image              # Will run CMD ["node", "server.js"]

# Override
docker run my-image node test.js # Will run node test.js
docker run my-image sh           # Will run sh (shell)
```

📌 A Dockerfile can have only one `CMD`. If multiple are specified, only the **last one** is executed.

---

## 🔥 ENTRYPOINT — entry point

`ENTRYPOINT` defines the executable that **always** runs when the container starts. Unlike `CMD`, ENTRYPOINT cannot simply be overridden with `docker run` arguments.

### Exec form vs Shell form

```dockerfile
# ✅ Exec form (recommended)
ENTRYPOINT ["python", "app.py"]

# ❌ Shell form (signals are not handled correctly)
ENTRYPOINT python app.py
```

### Overriding ENTRYPOINT

```bash
# The only way to override it is the --entrypoint flag
docker run --entrypoint sh my-image
docker run --entrypoint /bin/bash my-image
```

---

## 🔥 CMD + ENTRYPOINT — combination

The most powerful pattern — use ENTRYPOINT for a fixed command and CMD for default parameters:

```dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
```

```bash
docker run my-image              # python app.py
docker run my-image test.py      # python test.py
docker run my-image -c "print(1)"  # python -c "print(1)"
```

### Comparison table

| Scenario | CMD only | ENTRYPOINT only | ENTRYPOINT + CMD |
|---|---|---|---|
| `docker run img` | Runs CMD | Runs ENTRYPOINT | ENTRYPOINT + CMD |
| `docker run img args` | args replaces CMD | ENTRYPOINT + args | ENTRYPOINT + args (CMD replaced) |
| `docker run --entrypoint x img` | x replaces CMD | x replaces ENTRYPOINT | x replaces ENTRYPOINT |

### Real-world usage examples

**Wrapper script (entrypoint.sh)**

```dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["start"]
```

```bash
#!/bin/sh
# entrypoint.sh
echo "Running migrations..."
npm run migrate

exec "$@"   # Executes CMD (or arguments from docker run)
```

```bash
docker run my-app           # Migrations + start
docker run my-app test      # Migrations + test
docker run my-app seed      # Migrations + seed
```

---

## 🔥 COPY — copying files

`COPY` copies files and directories from the **build context** into the image filesystem.

```dockerfile
# Copy a single file
COPY package.json /app/

# Copy multiple files
COPY package.json package-lock.json /app/

# Copy a directory
COPY src/ /app/src/

# Copy everything from the context
COPY . /app/
```

### Important features of COPY

**1. Works only with the build context**

```bash
# Build context is the directory specified in docker build
docker build -t my-app .     # . — build context
docker build -t my-app ./app # ./app — build context
```

Files outside the context cannot be copied:

```dockerfile
# ❌ Does not work: file outside the context
COPY ../config.json /app/
```

**2. Ownership and permissions**

```dockerfile
# Set the owner when copying
COPY --chown=node:node package.json /app/
COPY --chown=1000:1000 . /app/
```

**3. Correct order for caching**

```dockerfile
# ✅ Correct: dependencies first, then code
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# ❌ Bad: dependencies reinstalled on any code change
COPY . .
RUN npm ci
```

---

## 🔥 ADD — extended copying

`ADD` does everything `COPY` does, but with additional capabilities:

### 1. Automatic archive extraction

```dockerfile
# ADD automatically extracts a tar archive
ADD app.tar.gz /app/
# Result: archive contents in /app/

# COPY simply copies the archive as a file
COPY app.tar.gz /app/
# Result: file app.tar.gz in /app/
```

Supported formats: `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.tar.xz`.

### 2. Downloading files from a URL

```dockerfile
# ADD can download a file from the internet
ADD https://example.com/config.json /app/config.json
```

### 📌 When to use ADD vs COPY

| Situation | Use |
|---|---|
| Copying local files | `COPY` |
| Copying with ownership change | `COPY --chown` |
| Extracting a local tar archive | `ADD` |
| Downloading from a URL | Prefer `RUN curl` + `RUN tar` |

💡 **Docker's recommendation:** use `COPY` by default. `ADD` is only needed for automatic tar archive extraction.

```dockerfile
# ❌ Non-obvious behavior with ADD
ADD https://example.com/app.tar.gz /app/
# Downloads but does NOT extract (extraction only works for local files)

# ✅ Explicit and predictable approach
RUN curl -fsSL https://example.com/app.tar.gz | tar -xz -C /app/
```

---

## 🔥 .dockerignore — excluding files from the context

The `.dockerignore` file works similarly to `.gitignore`: it specifies which files and directories **not to include** in the build context.

### Why .dockerignore is needed

**1. Reducing build context size**

```bash
# Without .dockerignore, node_modules ends up in the context
Sending build context to Docker daemon  500MB  # Slow!

# With .dockerignore
Sending build context to Docker daemon  2MB    # Fast!
```

**2. Security — excluding secrets**

```
# .dockerignore
.env
.env.local
*.pem
credentials/
```

**3. Preventing unnecessary cache invalidations**

If `.git/` gets into the context, every commit will invalidate the `COPY . .` cache.

### .dockerignore syntax

```
# Comments start with #

# Exclude files/directories
node_modules
.git
.env
.env.*
*.log

# Exclude by pattern
**/*.test.js
**/*.spec.ts
**/temp

# Negate an exclusion (! — include back)
*.md
!README.md

# Exclude specific paths
docs/
coverage/
.vscode/
.idea/
```

### Typical .dockerignore for a Node.js project

```
node_modules
npm-debug.log*
.git
.gitignore
.dockerignore
Dockerfile
docker-compose*.yml
.env
.env.*
*.md
!README.md
coverage
.nyc_output
.vscode
.idea
*.swp
*.swo
dist
build
```

---

## 🔥 Multi-stage builds

Multi-stage builds allow you to use **multiple FROM instructions** in a single Dockerfile. This is the key tool for creating compact production images.

### The problem: bloated images

```dockerfile
# ❌ Single-stage build: everything in one image
FROM node:20
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
# Image contains: source code + devDependencies + build tools + final build
# Size: ~1.2 GB
```

### Solution: multi-stage build

```dockerfile
# Stage 1: Build (builder)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
# Size: ~150 MB
```

### How it works

1. Each `FROM` starts a **new build stage**
2. Stages can be named: `FROM image AS name`
3. `COPY --from=name` copies files **from another stage**
4. Only the **last stage** ends up in the final image
5. Intermediate stages are used for building but do not increase the final image size

### Real example: React + Nginx

```dockerfile
# Stage 1: Build React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve static files with Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Final image: ~25 MB (Nginx + static files only)
```

### Real example: Go application

```dockerfile
# Stage 1: Compile
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Stage 2: Minimal image
FROM scratch
COPY --from=builder /server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
# Final image: ~10 MB (binary only)
```

### Building a specific stage

```bash
# Build only the builder stage (for debugging)
docker build --target builder -t my-app:builder .

# Build the final image (default)
docker build -t my-app:latest .
```

### COPY --from an external image

```dockerfile
# Copy from a third-party image (not from a build stage)
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/
```

---

## 📌 Additional Dockerfile instructions

### HEALTHCHECK — container health check

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=5s \
  CMD curl -f http://localhost:3000/health || exit 1
```

Parameters:
- `--interval` — interval between checks (default 30s)
- `--timeout` — timeout for a single check (default 30s)
- `--retries` — number of failures before the status becomes unhealthy (default 3)
- `--start-period` — initialization time before checks begin

```bash
# Health status is visible in docker ps
docker ps
# CONTAINER ID  IMAGE     STATUS
# abc123        my-app    Up 5 min (healthy)
```

### LABEL — image metadata

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0.0"
LABEL description="Production API server"
LABEL org.opencontainers.image.source="https://github.com/user/repo"
```

```bash
# View labels
docker inspect --format='{{json .Config.Labels}}' my-image
```

### EXPOSE — port documentation

```dockerfile
# Documents which ports the application uses
EXPOSE 3000
EXPOSE 3000/tcp
EXPOSE 5432/udp
```

📌 `EXPOSE` does **not publish** the port! It is documentation only. Use `-p` at startup to publish:

```bash
docker run -p 8080:3000 my-app
```

### USER — user for running the process

```dockerfile
# Create an unprivileged user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Switch to it
USER appuser

# All subsequent RUN, CMD, ENTRYPOINT run as appuser
CMD ["node", "server.js"]
```

💡 Always run your application as an **unprivileged user** in production.

---

## 🔥 Dockerfile best practices

### 1. Use specific tags for base images

```dockerfile
# ❌ Bad: latest can change at any time
FROM node:latest

# ✅ Good: a specific version
FROM node:20.11-alpine
```

### 2. Minimize the number of layers

```dockerfile
# ❌ Many layers
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN apt-get clean

# ✅ One layer
RUN apt-get update && \
    apt-get install -y curl wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Order instructions from least to most frequently changed

```dockerfile
# ✅ Correct order for cache optimization
FROM node:20-alpine
WORKDIR /app

# Rarely changes: dependencies
COPY package.json package-lock.json ./
RUN npm ci --production

# Changes often: source code
COPY . .

CMD ["node", "server.js"]
```

### 4. Use .dockerignore

Always create a `.dockerignore` to exclude unnecessary files from the build context.

### 5. Do not store secrets in the image

```dockerfile
# ❌ The secret remains in an image layer even after deletion
COPY .env /app/
RUN source /app/.env && rm /app/.env

# ✅ Use ARG for build-time secrets (with caution!)
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && \
    npm ci && \
    rm .npmrc

# ✅ Better: Docker BuildKit secrets
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

### 6. One process per container

```dockerfile
# ❌ Multiple processes in one container
CMD service nginx start && node server.js

# ✅ Separate containers for each process
# Dockerfile.nginx — for nginx
# Dockerfile.app — for the application
# Connect via docker-compose
```

### 7. Use multi-stage builds for production

```dockerfile
# Always separate the build stage from production
FROM node:20 AS builder
# ... build ...

FROM node:20-alpine
# ... only the necessary files ...
```

---

## ⚠️ Common beginner mistakes

### 🐛 1. Shell form of CMD/ENTRYPOINT in production

```dockerfile
# ❌ Shell form: process does not receive signals correctly
CMD npm start
# PID 1 = /bin/sh, node is a child process
# SIGTERM does not reach node, container is killed after 10s (SIGKILL)
```

> **Why this is a mistake:** when `docker stop` is called, Docker sends SIGTERM to the process with PID 1. In shell form, PID 1 is `/bin/sh`, which does not forward the signal to child processes. After the timeout, Docker sends SIGKILL — a forceful termination without a graceful shutdown.

```dockerfile
# ✅ Exec form: node gets PID 1 and handles signals correctly
CMD ["node", "server.js"]
```

### 🐛 2. COPY . . without .dockerignore

```dockerfile
# ❌ Copies EVERYTHING: node_modules, .git, .env, secrets
COPY . .
```

> **Why this is a mistake:** gigabytes of unnecessary files end up in the image (node_modules will be reinstalled), along with secrets (.env) and Git history. The image bloats and becomes insecure.

```dockerfile
# ✅ Create a .dockerignore and copy deliberately
# .dockerignore: node_modules, .git, .env, ...
COPY . .
```

### 🐛 3. Installing dependencies after COPY . .

```dockerfile
# ❌ Any code change invalidates the npm install cache
COPY . .
RUN npm install

# If one file changes: npm install runs again (~2 min)
```

> **Why this is a mistake:** Docker caches layers. If the files in `COPY` have changed, that layer and all subsequent ones are rebuilt. Changing a single line of code triggers a full dependency reinstall.

```dockerfile
# ✅ Dependencies first, then code
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# If code changes: npm ci is taken from cache (~0s)
```

### 🐛 4. Using ADD instead of COPY without a reason

```dockerfile
# ❌ ADD without necessity: non-obvious behavior
ADD package.json /app/
ADD https://example.com/file.txt /app/
```

> **Why this is a mistake:** `ADD` has non-obvious side effects (tar extraction, URL downloading). When used simply to copy files, it confuses the reader.

```dockerfile
# ✅ COPY for copying, explicit commands for everything else
COPY package.json /app/
RUN curl -fsSL https://example.com/file.txt -o /app/file.txt
```

### 🐛 5. Running as root in production

```dockerfile
# ❌ Application runs as root
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
# If the application is compromised — the attacker gets root
```

> **Why this is a mistake:** principle of least privilege. If there is a vulnerability in the application, an attacker gains root privileges inside the container, which significantly expands the attack surface.

```dockerfile
# ✅ Create an unprivileged user
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser
CMD ["node", "server.js"]
```

### 🐛 6. Confusion about ARG scope

```dockerfile
# ❌ ARG before FROM is not accessible after FROM
ARG APP_VERSION=1.0.0
FROM node:20-alpine
RUN echo $APP_VERSION   # Empty string!
```

> **Why this is a mistake:** an ARG defined before `FROM` has scope only up to the first `FROM`. After `FROM`, a new build stage begins.

```dockerfile
# ✅ Redeclare ARG after FROM
ARG APP_VERSION=1.0.0
FROM node:20-alpine
ARG APP_VERSION
RUN echo $APP_VERSION   # 1.0.0
```

---

## 📌 Summary

- ✅ `WORKDIR` — sets the working directory, creates it automatically
- ✅ `ENV` — environment variables, available during build and in the container
- ✅ `ARG` — build arguments, available only during `docker build`
- ✅ `CMD` — default command, can be overridden with `docker run`
- ✅ `ENTRYPOINT` — fixed entry point, overridden via `--entrypoint`
- ✅ `COPY` — file copying (use by default)
- ✅ `ADD` — extended copying (only for extracting tar archives)
- ✅ `.dockerignore` — excludes files from the build context
- ✅ Multi-stage builds — multi-stage build for compact production images
- ✅ Always use exec form for CMD and ENTRYPOINT
- ✅ Optimize instruction order for caching
- ✅ Do not run applications as root in production
