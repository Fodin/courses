# Level 4: Volumes and Data — Persistence in Docker

## 🎯 The Problem: Containers Are Ephemeral

Containers are inherently **temporary**. When a container is removed, all data inside it disappears permanently. This is a fundamental property of Docker.

```bash
# Create a container and write some data
docker run --name mydb -d postgres:16
docker exec mydb psql -U postgres -c "CREATE TABLE users (id INT, name TEXT)"
docker exec mydb psql -U postgres -c "INSERT INTO users VALUES (1, 'Alice')"

# Remove the container
docker rm -f mydb

# Create a new container — data is gone!
docker run --name mydb -d postgres:16
docker exec mydb psql -U postgres -c "SELECT * FROM users"
# ERROR: relation "users" does not exist
```

This means that without special mechanisms:
- Databases lose data on restart
- Logs disappear along with the container
- User-uploaded files are lost
- Configurations must be recreated every time

Docker solves this problem with **three types of mounts**: volumes, bind mounts, and tmpfs.

---

## 🔥 Three Data Storage Types in Docker

Docker provides three mechanisms for working with data outside a container's filesystem:

| Type | Where data is stored | Management | Use case |
|---|---|---|---|
| **Volumes** | Docker-managed area on the host | Docker Engine | Production data |
| **Bind mounts** | Any path on the host | User | Development, configs |
| **tmpfs** | RAM | OS kernel | Secrets, temporary files |

### Visual Model

```
┌─────────────────────────────────────────────────────┐
│                    Host machine                      │
│                                                     │
│  ┌─────────────┐  ┌──────────┐  ┌───────────────┐  │
│  │   Volume     │  │ Bind     │  │   tmpfs       │  │
│  │ /var/lib/    │  │ mount    │  │   (RAM)       │  │
│  │ docker/      │  │ ~/proj/  │  │               │  │
│  │ volumes/     │  │          │  │               │  │
│  └──────┬───────┘  └────┬─────┘  └───────┬───────┘  │
│         │               │                │          │
│  ┌──────┴───────────────┴────────────────┴───────┐  │
│  │              Container                        │  │
│  │   /data       /app/src       /run/secrets     │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

---

## 🔥 Named Volumes

Named volumes are the **recommended way** to store persistent data in Docker. Docker fully manages their lifecycle.

### Creating and Using

```bash
# Create a volume
docker volume create mydata

# Start a container with the volume
docker run -d --name app -v mydata:/app/data nginx

# Same syntax with --mount (more explicit)
docker run -d --name app --mount source=mydata,target=/app/data nginx
```

### Volume Lifecycle

```bash
# Create
docker volume create pgdata

# View information
docker volume inspect pgdata
# [{ "Name": "pgdata",
#    "Driver": "local",
#    "Mountpoint": "/var/lib/docker/volumes/pgdata/_data",
#    "Scope": "local" }]

# List all volumes
docker volume ls

# Remove a volume
docker volume rm pgdata

# Remove unused volumes
docker volume prune
```

### Data Survives the Container

```bash
# Container 1: write data
docker run --name writer -v mydata:/data alpine sh -c "echo 'Hello' > /data/test.txt"
docker rm writer

# Container 2: data is still there!
docker run --name reader -v mydata:/data alpine cat /data/test.txt
# Hello
docker rm reader
```

### Automatic Volume Creation

If the volume does not exist, Docker creates it automatically:

```bash
# The "newvolume" volume will be created automatically
docker run -v newvolume:/data alpine ls /data
```

---

## 🔥 Anonymous Volumes vs Named Volumes

### Anonymous Volumes

Created when using `-v` without a name or via `VOLUME` in a Dockerfile:

```bash
# Anonymous volume (no name)
docker run -v /data alpine ls

# In a Dockerfile
# VOLUME /data
```

Anonymous volumes receive a random name (hash) and are **not reused** between containers:

```bash
docker volume ls
# DRIVER  VOLUME NAME
# local   a1b2c3d4e5f6g7h8...  (anonymous)
# local   mydata                 (named)
```

### Comparison

| Characteristic | Named volume | Anonymous volume |
|---|---|---|
| **Name** | Set by the user | Random hash |
| **Reuse** | Easy to attach to another container | Hard to find and attach |
| **Removal** | Manually with `docker volume rm` | `docker volume prune` or `docker rm -v` |
| **Identification** | Purpose is clear | Contents are unclear |
| **Recommendation** | For production | Avoid |

📌 **Always use named volumes.** Anonymous volumes create clutter and complicate data management.

---

## 🔥 Bind Mounts — Mounting Host Directories

Bind mounts directly connect a **directory or file from the host** into a container. Changes are visible instantly in both directions.

### Syntax

```bash
# Short syntax (-v)
docker run -v /host/path:/container/path image

# Full syntax (--mount)
docker run --mount type=bind,source=/host/path,target=/container/path image
```

### Primary Use Case: Development

```bash
# Mount source code for live-reload
docker run -d \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/package.json:/app/package.json \
  -p 3000:3000 \
  my-node-app

# Changes in ./src on the host are now instantly visible inside the container
```

### Mounting Configuration Files

```bash
# Nginx config from the host
docker run -d \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 80:80 \
  nginx

# PostgreSQL config
docker run -d \
  -v $(pwd)/postgresql.conf:/etc/postgresql/postgresql.conf:ro \
  -v pgdata:/var/lib/postgresql/data \
  postgres:16 -c 'config_file=/etc/postgresql/postgresql.conf'
```

### Absolute Paths Are Required

```bash
# ❌ A relative path is interpreted as a volume name!
docker run -v ./src:/app/src image
# Docker may create a VOLUME named "./src" instead of a bind mount

# ✅ Absolute path
docker run -v $(pwd)/src:/app/src image
docker run -v /home/user/project/src:/app/src image
```

### Differences Between Bind Mounts and Volumes

| Characteristic | Volume | Bind Mount |
|---|---|---|
| **Location on host** | Managed by Docker | Any path |
| **Creation** | Docker creates it | Must already exist |
| **Backup** | `docker volume` commands | Standard OS tools |
| **Portability** | Between hosts (with drivers) | Tied to a specific host |
| **Performance** | Optimal | OS-dependent (slower on macOS) |
| **Security** | Isolated from host | Access to host files |

---

## 🔥 `-v` vs `--mount` — Two Syntaxes

Docker supports two syntaxes for mounting. `--mount` is more explicit and is recommended for new projects.

### `-v` (volume) Syntax

```bash
# Volume
docker run -v mydata:/app/data image

# Bind mount
docker run -v /host/path:/container/path image

# With flags
docker run -v mydata:/app/data:ro image
```

### `--mount` Syntax

```bash
# Volume
docker run --mount source=mydata,target=/app/data image

# Bind mount
docker run --mount type=bind,source=/host/path,target=/container/path image

# With flags
docker run --mount source=mydata,target=/app/data,readonly image

# tmpfs
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m image
```

### Key Differences

| Behavior | `-v` | `--mount` |
|---|---|---|
| **Non-existent host path** | Creates the directory | Returns an error |
| **Non-existent volume** | Creates automatically | Returns an error |
| **Readability** | Compact | Self-documenting |
| **tmpfs** | Requires `--tmpfs` | `type=tmpfs` |

```bash
# ❌ -v silently creates a directory if the path does not exist
docker run -v /nonexistent/path:/data alpine ls /data
# Creates /nonexistent/path on the host (empty directory)

# ✅ --mount returns a clear error
docker run --mount type=bind,source=/nonexistent/path,target=/data alpine ls /data
# Error: /nonexistent/path does not exist
```

💡 **Recommendation:** use `--mount` in scripts and CI/CD, `-v` for quick commands in the terminal.

---

## 🔥 tmpfs — Mounting to RAM

tmpfs mounts store data **in memory only**. Data is never written to disk and disappears when the container stops.

### When to Use tmpfs

- **Secrets:** passwords, tokens, keys — will never hit disk
- **Temporary files:** cache, sessions, intermediate data
- **High-performance I/O:** when maximum read/write speed is required

### Syntax

```bash
# --tmpfs flag
docker run --tmpfs /tmp nginx

# --mount syntax (allows configuring size)
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=100m nginx

# Size and permission limits
docker run --mount type=tmpfs,target=/tmp,tmpfs-size=64m,tmpfs-mode=1777 nginx
```

### Example: Secure Handling of Secrets

```bash
# Secrets are stored only in RAM
docker run -d \
  --mount type=tmpfs,target=/run/secrets,tmpfs-size=1m \
  -e DB_PASSWORD=secret123 \
  my-app

# Even if an attacker gains access to the host disk,
# the secrets won't be there
```

### tmpfs Parameters

| Parameter | Description | Example |
|---|---|---|
| `tmpfs-size` | Maximum size in bytes | `tmpfs-size=100m` |
| `tmpfs-mode` | Access permissions (octal) | `tmpfs-mode=1777` |

---

## 🔥 Read-only Containers and Mounts

### Read-only Container

The `--read-only` flag makes the **entire filesystem** of the container read-only:

```bash
# The container cannot write to its own filesystem
docker run --read-only nginx
# nginx: [emerg] mkdir() "/var/cache/nginx" failed: Read-only file system

# Solution: allow writes to specific directories via tmpfs
docker run --read-only \
  --tmpfs /var/cache/nginx \
  --tmpfs /var/run \
  --tmpfs /tmp \
  nginx
```

### Read-only Mount `:ro`

The `:ro` suffix makes a specific mount read-only:

```bash
# Config is read-only, data is writable
docker run -d \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf:ro \
  -v web-data:/usr/share/nginx/html:ro \
  -v logs:/var/log/nginx \
  nginx
```

### Why Use Read-only

- **Security:** an attacker cannot modify binaries or configs
- **Stability:** the container cannot accidentally break itself by writing
- **Reproducibility:** guarantees the container runs exactly as the image

```bash
# Production pattern: read-only + targeted exceptions
docker run --read-only \
  --tmpfs /tmp:size=50m \
  --tmpfs /var/run \
  -v app-logs:/var/log/app \
  -v $(pwd)/config.yaml:/app/config.yaml:ro \
  my-production-app
```

---

## 🔥 Sharing Data Between Containers

Volumes allow multiple containers to work with the same data:

```bash
# Create a shared volume
docker volume create shared-data

# Writer container
docker run -d --name writer \
  -v shared-data:/data \
  alpine sh -c "while true; do date >> /data/log.txt; sleep 5; done"

# Reader container
docker run -d --name reader \
  -v shared-data:/data:ro \
  alpine sh -c "while true; do cat /data/log.txt; sleep 10; done"
```

### Pattern: Sidecar for Logging

```bash
# Application writes logs
docker run -d --name app \
  -v app-logs:/var/log/app \
  my-app

# Sidecar reads and ships logs
docker run -d --name log-shipper \
  -v app-logs:/logs:ro \
  fluentd
```

---

## 🔥 Backup and Restore Volumes

### Backing Up a Volume to a tar Archive

```bash
# Create a temporary container that mounts the volume and the backup directory
docker run --rm \
  -v mydata:/source:ro \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/mydata-backup.tar.gz -C /source .
```

### Restoring from a Backup

```bash
# Create a new volume and restore data
docker volume create mydata-restored

docker run --rm \
  -v mydata-restored:/target \
  -v $(pwd)/backups:/backup:ro \
  alpine tar xzf /backup/mydata-backup.tar.gz -C /target
```

### Copying a Volume

```bash
# Copy data from one volume to another
docker volume create mydata-copy

docker run --rm \
  -v mydata:/source:ro \
  -v mydata-copy:/target \
  alpine sh -c "cp -a /source/. /target/"
```

---

## 📌 Volume Drivers

By default, Docker uses the `local` driver, which stores data on the local disk. However, drivers for remote storage also exist:

```bash
# Create a volume with a driver (example: NFS)
docker volume create --driver local \
  --opt type=nfs \
  --opt o=addr=192.168.1.100,rw \
  --opt device=:/path/to/share \
  nfs-data

# Usage
docker run -v nfs-data:/data my-app
```

Popular drivers:
- **local** — local storage (default)
- **nfs** — Network File System
- **Azure File Storage**, **AWS EFS** — cloud storage
- **GlusterFS**, **Ceph** — distributed filesystems

---

## 🔥 VOLUME in a Dockerfile

The `VOLUME` instruction in a Dockerfile declares a mount point:

```dockerfile
FROM postgres:16
# Declare a volume for data
VOLUME /var/lib/postgresql/data
```

### What VOLUME Does in a Dockerfile

1. On `docker run` without `-v`, an **anonymous volume** is created
2. Data in the specified directory is **not included** in image layers
3. Serves as **documentation** — which directories need to be persisted

```bash
# Without -v: an anonymous volume is created for /var/lib/postgresql/data
docker run -d postgres:16

# With -v: a named volume is used
docker run -d -v pgdata:/var/lib/postgresql/data postgres:16
```

### ⚠️ VOLUME Pitfall in a Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app

# ❌ VOLUME before COPY/RUN: changes to /app/data will not be saved in the image!
VOLUME /app/data
RUN echo "test" > /app/data/file.txt  # This file will NOT make it into the image

# ✅ Correct: VOLUME at the end
COPY . .
RUN npm ci
VOLUME /app/data
```

📌 `RUN`, `COPY` instructions after `VOLUME` for the same directory **are not saved** in image layers.

---

## 🔥 Best Practices

### 1. Use Named Volumes for Data

```bash
# ✅ Named volume: purpose is clear
docker run -v postgres-data:/var/lib/postgresql/data postgres:16

# ❌ Anonymous volume: impossible to identify
docker run -v /var/lib/postgresql/data postgres:16
```

### 2. Bind Mounts — Development Only

```bash
# ✅ Development: bind mount for hot-reload
docker run -v $(pwd)/src:/app/src -p 3000:3000 dev-image

# ✅ Production: named volume
docker run -v app-data:/app/data -p 3000:3000 prod-image
```

### 3. Read-only by Default

```bash
# ✅ Explicitly mark what only needs to be read
docker run -v config:/etc/app/config:ro my-app
```

### 4. Regularly Clean Up Unused Volumes

```bash
# View "dangling" volumes
docker volume ls -f dangling=true

# Remove unused volumes
docker volume prune
```

### 5. Don't Store Data Inside the Container

```bash
# ❌ Logs inside the container — will be lost
docker run my-app  # logs written to /var/log/app/

# ✅ Logs in a volume
docker run -v app-logs:/var/log/app my-app
```

### 6. Use --mount in Scripts

```bash
# ✅ Explicit syntax, errors on non-existent paths
docker run --mount source=mydata,target=/data my-app

# ❌ -v silently creates a directory/volume
docker run -v mydata:/data my-app
```

---

## ⚠️ Common Beginner Mistakes

### 🐛 1. Forgot to Attach a Volume — Data Lost

```bash
# ❌ No volume: database data will disappear when the container is removed
docker run -d --name db postgres:16
docker rm -f db
# All data is lost!
```

> **Why this is a mistake:** the container stores data in its own filesystem (writable layer). When the container is removed, this layer is deleted along with all data.

```bash
# ✅ A volume persists data between containers
docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:16
docker rm -f db
docker run -d --name db2 -v pgdata:/var/lib/postgresql/data postgres:16
# Data is still there!
```

### 🐛 2. Relative Path Instead of Absolute Path in a Bind Mount

```bash
# ❌ Docker interprets this as a volume name, not a path!
docker run -v src:/app/src my-app
# Creates a VOLUME named "src", not a bind mount for ./src

# ❌ Dot-slash may behave differently across Docker versions
docker run -v ./src:/app/src my-app
```

> **Why this is a mistake:** Docker distinguishes volumes from bind mounts by the presence of `/` at the start of the path. A string without `/` is interpreted as a volume name.

```bash
# ✅ Absolute path for bind mount
docker run -v $(pwd)/src:/app/src my-app
docker run -v /home/user/project/src:/app/src my-app
```

### 🐛 3. Bind Mount Overwrites Container Contents

```bash
# ❌ An empty host directory will replace the container's node_modules!
docker run -v $(pwd):/app my-node-app
# /app/node_modules in the container is now EMPTY
# (because node_modules doesn't exist on the host)
```

> **Why this is a mistake:** a bind mount completely replaces the contents of the target directory in the container. If the required files don't exist on the host, the container won't see them either.

```bash
# ✅ Use an anonymous volume for node_modules
docker run \
  -v $(pwd):/app \
  -v /app/node_modules \
  my-node-app
# node_modules from the image is preserved in the anonymous volume
```

### 🐛 4. Permission Issues

```bash
# ❌ Container runs as root, files on the host are owned by root
docker run -v $(pwd)/data:/data alpine sh -c "echo test > /data/file.txt"
ls -la data/file.txt
# -rw-r--r-- root root file.txt  — the host user cannot edit it!
```

> **Why this is a mistake:** by default, processes inside the container run as root (UID 0). Files created through a bind mount get the UID/GID of the container's process.

```bash
# ✅ Run the container as the current user
docker run -v $(pwd)/data:/data --user $(id -u):$(id -g) alpine \
  sh -c "echo test > /data/file.txt"
```

### 🐛 5. Using tmpfs for Data That Needs to Be Persisted

```bash
# ❌ Data in tmpfs will disappear when the container stops!
docker run --tmpfs /var/lib/postgresql/data postgres:16
# After docker stop, all database data is gone
```

> **Why this is a mistake:** tmpfs stores data only in RAM. When the container stops or restarts, all data is deleted.

```bash
# ✅ tmpfs only for temporary data and secrets
docker run \
  -v pgdata:/var/lib/postgresql/data \
  --tmpfs /tmp \
  postgres:16
```

---

## 📌 Summary

- ✅ **Volumes** — the primary way to store data, managed by Docker
- ✅ **Bind mounts** — mounting host directories, ideal for development
- ✅ **tmpfs** — data in RAM, for secrets and temporary files
- ✅ Always use **named volumes**, avoid anonymous ones
- ✅ `--mount` — explicit syntax, recommended for scripts
- ✅ `-v` — compact syntax for quick terminal commands
- ✅ `:ro` — read-only for configs and data that should not change
- ✅ `--read-only` — protects the entire container filesystem
- ✅ Back up volumes via a temporary container with `tar`
- ✅ `docker volume prune` — remove unused volumes
- ✅ Bind mounts require **absolute paths**
- ✅ One container can use **multiple mount types** simultaneously
