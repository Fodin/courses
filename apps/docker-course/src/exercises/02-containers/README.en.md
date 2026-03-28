# Level 2: Containers

## What is a container?

A container is a **running instance of an image**. If an image is a recipe, a container is the dish prepared from it. A single image can spawn any number of containers, and each will run in isolation.

When you run `docker run`, Docker:

1. Looks for the image locally (or downloads it from a registry)
2. Creates a **writable layer** on top of the image layers
3. Sets up **namespaces** (PID, network, and filesystem isolation)
4. Configures **cgroups** (resource limits: CPU, RAM)
5. Starts the process specified in `CMD` or `ENTRYPOINT`

```
┌─────────────────────────────┐
│     Writable Layer (R/W)    │  ← Container changes
├─────────────────────────────┤
│     Image Layer 3 (R/O)     │
├─────────────────────────────┤
│     Image Layer 2 (R/O)     │
├─────────────────────────────┤
│     Image Layer 1 (R/O)     │  ← Base image
└─────────────────────────────┘
```

A container is **ephemeral** by default: when deleted, all changes in the writable layer are lost. To persist data, use volumes — covered in Level 4.

---

## docker run

### Basic syntax

```bash
docker run [OPTIONS] IMAGE [COMMAND] [ARGS]
```

### Examples

```bash
# Run and print to the terminal (foreground)
docker run ubuntu echo "Hello from container!"

# Run with an interactive shell
docker run -it ubuntu bash

# Run in the background (detached mode)
docker run -d nginx

# Run with a name and auto-remove
docker run --rm --name my-nginx nginx
```

### What happens during `docker run`?

```
docker run nginx
       │
       ▼
┌──────────────────┐
│ 1. Look up image │ → Present locally? If not → docker pull
│    locally        │
├──────────────────┤
│ 2. Create         │ → New writable layer
│    container      │
├──────────────────┤
│ 3. Allocate       │ → Namespace (PID, NET, MNT, UTS, IPC)
│    namespaces     │   + cgroups (CPU, Memory)
├──────────────────┤
│ 4. Configure net  │ → IP address in bridge network
│                   │
├──────────────────┤
│ 5. Start process  │ → CMD or ENTRYPOINT from the image
│                   │
└──────────────────┘
```

---

## Run flags

### Operating modes

| Flag | Description | Example |
|------|----------|--------|
| `-d` | Detached — run in the background | `docker run -d nginx` |
| `-it` | Interactive + TTY — interactive shell | `docker run -it ubuntu bash` |
| `--rm` | Auto-remove after stop | `docker run --rm alpine echo hi` |

### Identification

| Flag | Description | Example |
|------|----------|--------|
| `--name` | Set a container name | `docker run --name web nginx` |
| `--hostname` | Set the hostname inside the container | `docker run --hostname myhost alpine` |

### Network and ports

| Flag | Description | Example |
|------|----------|--------|
| `-p` | Port mapping host:container | `docker run -p 8080:80 nginx` |
| `--network` | Connect to a network | `docker run --network mynet nginx` |
| `-P` | Map all EXPOSE ports to random host ports | `docker run -P nginx` |

### Environment variables

| Flag | Description | Example |
|------|----------|--------|
| `-e` | Set a variable | `docker run -e DB_HOST=db myapp` |
| `--env-file` | Load from a file | `docker run --env-file .env myapp` |

### Volumes and data

| Flag | Description | Example |
|------|----------|--------|
| `-v` | Mount a volume | `docker run -v data:/app/data nginx` |
| `--mount` | Extended mount syntax | `docker run --mount type=bind,src=./,dst=/app myapp` |

### Resource limits

| Flag | Description | Example |
|------|----------|--------|
| `--memory` | RAM limit | `docker run --memory=512m nginx` |
| `--cpus` | CPU limit | `docker run --cpus=1.5 nginx` |
| `--restart` | Restart policy | `docker run --restart=unless-stopped nginx` |

### Combining flags

A typical command for a production-like run:

```bash
docker run -d \
  --name web-server \
  --restart unless-stopped \
  -p 80:80 \
  -v nginx-conf:/etc/nginx/conf.d \
  -e NGINX_HOST=example.com \
  --memory=256m \
  --cpus=0.5 \
  nginx:1.25-alpine
```

---

## Container lifecycle

A container goes through several states:

```
               docker create
                    │
                    ▼
              ┌──────────┐
              │ Created   │
              └─────┬─────┘
                    │ docker start
                    ▼
              ┌──────────┐     docker pause     ┌──────────┐
              │ Running   │ ──────────────────→  │ Paused   │
              └─────┬─────┘  ←──────────────────  └──────────┘
                    │              docker unpause
                    │
                    │ docker stop / docker kill
                    │ or process exited
                    ▼
              ┌──────────┐
              │ Exited    │
              └─────┬─────┘
                    │
           ┌───────┴───────┐
           │               │
    docker start    docker rm
           │               │
           ▼               ▼
      ┌──────────┐   ┌──────────┐
      │ Running   │   │ Removed   │
      └──────────┘   └──────────┘
```

### Management commands

```bash
# View running containers
docker ps

# All containers (including stopped)
docker ps -a

# Start a stopped container
docker start <name|id>

# Stop (SIGTERM → wait → SIGKILL)
docker stop <name|id>

# Immediate stop (SIGKILL)
docker kill <name|id>

# Restart
docker restart <name|id>

# Pause (freeze processes via cgroups)
docker pause <name|id>
docker unpause <name|id>

# Remove a stopped container
docker rm <name|id>

# Force-remove (even a running container)
docker rm -f <name|id>

# Remove all stopped containers
docker container prune
```

### SIGTERM vs SIGKILL

With `docker stop`:
1. Docker sends **SIGTERM** to the main process (PID 1)
2. The process has a chance to shut down gracefully (close connections, flush data)
3. If the process has not exited within **10 seconds** (configurable via `--time`), **SIGKILL** is sent

```bash
# Stop with a 30-second timeout
docker stop --time=30 my-container

# Immediate SIGKILL (no SIGTERM)
docker kill my-container
```

> **Important:** If your application inside the container is launched via a shell script, SIGTERM may not reach the application. Use `exec` in the entrypoint script:
> ```bash
> #!/bin/bash
> # Bad: SIGTERM will be received by bash, not the application
> node server.js
>
> # Good: SIGTERM will be received by node
> exec node server.js
> ```

---

## docker exec

`docker exec` lets you run a command **inside an already running container**. It is the primary tool for debugging.

```bash
# Run a single command
docker exec my-container ls /app

# Open an interactive shell
docker exec -it my-container bash
# or, if bash is not available (Alpine):
docker exec -it my-container sh

# Run a command as a different user
docker exec -u root my-container apt-get update

# Set an environment variable
docker exec -e DEBUG=1 my-container node script.js

# Run in a specific working directory
docker exec -w /app/src my-container ls
```

### Typical debugging scenarios

```bash
# View application files
docker exec my-app ls -la /app

# Check environment variables
docker exec my-app env

# Check network configuration
docker exec my-app cat /etc/hosts

# Verify service availability
docker exec my-app curl -s localhost:3000/health

# Connect to a database inside the container
docker exec -it my-postgres psql -U postgres
```

---

## Viewing logs

```bash
# All container logs
docker logs my-container

# Last 100 lines
docker logs --tail 100 my-container

# Follow logs in real time
docker logs -f my-container

# Logs with timestamps
docker logs -t my-container

# Logs from the last hour
docker logs --since 1h my-container
```

---

## Useful commands

```bash
# Detailed container information (JSON)
docker inspect my-container

# IP address only
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' my-container

# Real-time resource usage
docker stats

# Processes inside the container
docker top my-container

# Copy files to/from the container
docker cp my-container:/app/logs ./logs
docker cp ./config.json my-container:/app/config.json

# Wait for the container to finish
docker wait my-container
```

---

## Common beginner mistakes

### 1. Container stops immediately

```bash
# ❌ The container will start and exit right away
docker run -d ubuntu

# ✅ A long-running process is required
docker run -d ubuntu sleep infinity
docker run -d ubuntu tail -f /dev/null
```

Reason: a container lives as long as its main process (PID 1) is running. If `CMD` is `bash` without `-it`, it exits immediately.

### 2. Data loss after removal

```bash
# ❌ All data is lost on docker rm
docker run -d --name db postgres

# ✅ Use volumes for persistence
docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres
```

### 3. Forgotten containers taking up disk space

```bash
# Check stopped containers
docker ps -a --filter status=exited

# Clean up
docker container prune

# Or use --rm when running temporary containers
docker run --rm alpine echo "I clean up after myself"
```
