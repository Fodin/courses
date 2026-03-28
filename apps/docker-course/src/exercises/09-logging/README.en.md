# Level 9: Logging and Debugging

## 🎯 Problem: a container crashed and you don't know why

Imagine: you deployed a stack of five services in Docker Compose. An hour later the API stops responding. You log into the server and see that the `api` container has `Exited (137)` status. What happened? Who killed the process? When did it happen?

```bash
$ docker ps -a
CONTAINER ID  IMAGE    STATUS                    NAMES
a1b2c3d4e5f6  myapp    Exited (137) 3 mins ago   api
f6e5d4c3b2a1  postgres Up 2 hours                db
```

Without logging and diagnostic tools you are literally blind. Docker provides a powerful set of commands for viewing logs, inspecting container state, monitoring resources, and debugging common problems.

---

## 🔥 docker logs: reading container logs

### How Docker collects logs

Docker intercepts everything a container writes to **STDOUT** and **STDERR** and stores it via a logging driver (by default — `json-file`). The `docker logs` command reads these stored records.

```bash
# Show all container logs
docker logs mycontainer

# Same by ID
docker logs a1b2c3d4e5f6
```

📌 **Important:** `docker logs` only shows STDOUT and STDERR. If the application writes logs to a file inside the container (e.g., `/var/log/app.log`), `docker logs` will **not see them**.

### STDOUT vs STDERR

```bash
# Inside the container
echo "info message"   # → STDOUT → docker logs
echo "error!" >&2     # → STDERR → docker logs

# Node.js
console.log("info")    # → STDOUT
console.error("error") # → STDERR

# Python
print("info")                          # → STDOUT
import sys; print("error", file=sys.stderr)  # → STDERR
```

Both streams go into `docker logs`, but the logging driver can distinguish them.

### docker logs flags

```bash
# Follow logs in real time (like tail -f)
docker logs -f mycontainer

# Show the last N lines
docker logs --tail 50 mycontainer

# Logs from a specific point in time
docker logs --since 2024-01-15T10:00:00 mycontainer
docker logs --since 30m mycontainer     # Last 30 minutes
docker logs --since 2h mycontainer      # Last 2 hours

# Logs until a specific point in time
docker logs --until 2024-01-15T12:00:00 mycontainer

# Combination: logs for a time period
docker logs --since 10m --until 5m mycontainer

# Show timestamps
docker logs -t mycontainer
# 2024-01-15T10:30:15.123456789Z Starting server...
# 2024-01-15T10:30:15.234567890Z Listening on port 3000

# Combination: last 20 lines with timestamps in real time
docker logs -f --tail 20 -t mycontainer
```

| Flag | Description | Example |
|------|-------------|---------|
| `-f`, `--follow` | Follow in real time | `docker logs -f app` |
| `--tail N` | Last N lines | `docker logs --tail 100 app` |
| `--since` | Logs from (time or duration) | `docker logs --since 30m app` |
| `--until` | Logs until | `docker logs --until 1h app` |
| `-t`, `--timestamps` | Show timestamps | `docker logs -t app` |
| `--details` | Additional attributes | `docker logs --details app` |

### Logs in Docker Compose

```bash
# Logs from all services
docker compose logs

# Logs from a specific service
docker compose logs api

# Follow logs from multiple services
docker compose logs -f api worker

# Last 50 lines from each service
docker compose logs --tail 50

# With timestamps
docker compose logs -t api
```

---

## 🔥 Logging drivers: where to send logs

### What is a logging driver

A logging driver determines **where** Docker sends container logs. By default, `json-file` is used — logs are stored as JSON files on the host.

### Available drivers

| Driver | Description | `docker logs` |
|--------|-------------|---------------|
| `json-file` | JSON files on the host (default) | ✅ |
| `local` | Optimized format with automatic rotation | ✅ |
| `journald` | Linux system journal (systemd) | ✅ |
| `syslog` | Syslog server | ❌ |
| `fluentd` | Fluentd collector | ❌ |
| `awslogs` | Amazon CloudWatch Logs | ❌ |
| `gcplogs` | Google Cloud Logging | ❌ |
| `splunk` | Splunk HTTP Event Collector | ❌ |
| `gelf` | Graylog Extended Log Format | ❌ |
| `none` | Logging disabled | ❌ |

⚠️ **Important:** when using `syslog`, `fluentd`, `awslogs`, and other remote drivers — the `docker logs` command **does not work**! Logs are sent directly to the target system.

### Configuring the driver for a container

```bash
# Run a container with a specific driver
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 myapp

# Disable logging for a container
docker run --log-driver none myapp
```

```yaml
# docker-compose.yml
services:
  api:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"    # Maximum log file size
        max-file: "5"      # Maximum number of files
        tag: "{{.Name}}"   # Tag for identification

  worker:
    image: myworker
    logging:
      driver: local        # Optimized driver
      options:
        max-size: "50m"
        max-file: "3"
```

### Configuring the global driver in daemon.json

```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status",
    "env": "os,customer"
  }
}
```

After changing `daemon.json`, restart Docker:

```bash
sudo systemctl restart docker
```

📌 Settings in `daemon.json` are global defaults. A container can override them via `--log-driver` and `--log-opt`.

### Log rotation: max-size and max-file

Without rotation logs grow indefinitely and can fill up the entire disk!

```bash
# ❌ Without rotation: log file grows without limits
docker run myapp
# After a week: /var/lib/docker/containers/<id>/<id>-json.log → 50 GB

# ✅ With rotation: file no larger than 10 MB, maximum 3 files
docker run --log-opt max-size=10m --log-opt max-file=3 myapp
# Maximum 30 MB of logs (3 files × 10 MB)
```

```yaml
# Required in production!
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

### The local driver

The `local` driver is an improved version of `json-file`:
- Uses compression (logs take less space)
- Automatic rotation by default (100 MB, 5 files)
- Faster writes

```yaml
services:
  api:
    logging:
      driver: local
      options:
        max-size: "50m"
        max-file: "3"
```

### Dual logging (Docker 20.10+)

Starting from Docker 20.10, you can enable `dual logging` — logs are sent to the remote driver **and** remain accessible via `docker logs`:

```json
// /etc/docker/daemon.json
{
  "log-driver": "fluentd",
  "log-opts": {
    "fluentd-address": "localhost:24224"
  },
  "features": {
    "buildkit": true
  }
}
```

---

## 🔥 docker inspect: complete container information

### Basic usage

```bash
# Full information (JSON)
docker inspect mycontainer

# Output — a large JSON with all details:
# - Container state (State)
# - Configuration (Config)
# - Network settings (NetworkSettings)
# - Mount points (Mounts)
# - And much more
```

### Output format: Go templates

`--format` allows you to extract specific fields:

```bash
# Container IP address
docker inspect --format='{{.NetworkSettings.IPAddress}}' mycontainer
# 172.17.0.2

# Container status
docker inspect --format='{{.State.Status}}' mycontainer
# running

# Exit code
docker inspect --format='{{.State.ExitCode}}' mycontainer
# 0

# Environment variables
docker inspect --format='{{json .Config.Env}}' mycontainer
# ["NODE_ENV=production","PORT=3000"]

# Mounted volumes
docker inspect --format='{{json .Mounts}}' mycontainer | jq .

# Logging driver
docker inspect --format='{{.HostConfig.LogConfig.Type}}' mycontainer
# json-file

# Start time
docker inspect --format='{{.State.StartedAt}}' mycontainer
# 2024-01-15T10:30:15.123456789Z

# Ports
docker inspect --format='{{json .NetworkSettings.Ports}}' mycontainer

# Healthcheck status
docker inspect --format='{{json .State.Health}}' mycontainer | jq .

# PID of the main process
docker inspect --format='{{.State.Pid}}' mycontainer
# 12345

# OOM killed?
docker inspect --format='{{.State.OOMKilled}}' mycontainer
# false
```

### Useful templates

```bash
# All containers: name, status, IP
docker inspect --format='{{.Name}} → {{.State.Status}} ({{.NetworkSettings.IPAddress}})' $(docker ps -aq)

# All environment variables, one per line
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' mycontainer

# Mount points: source → destination
docker inspect --format='{{range .Mounts}}{{.Source}} → {{.Destination}}{{println}}{{end}}' mycontainer

# Container networks
docker inspect --format='{{range $net, $config := .NetworkSettings.Networks}}{{$net}}: {{$config.IPAddress}}{{println}}{{end}}' mycontainer
```

### Inspecting other objects

```bash
# Image
docker inspect myimage:latest

# Network
docker network inspect mynetwork

# Volume
docker volume inspect myvolume
```

---

## 🔥 docker stats: real-time resource monitoring

```bash
# All running containers (updates in real time)
docker stats

# CONTAINER ID  NAME   CPU %  MEM USAGE / LIMIT    MEM %  NET I/O        BLOCK I/O     PIDS
# a1b2c3d4e5f6  api    2.50%  128MiB / 512MiB      25.00% 5.2kB / 3.1kB  0B / 4.1MB    15
# f6e5d4c3b2a1  db     1.20%  256MiB / 1GiB        25.00% 1.1kB / 800B   12MB / 50MB   8

# Specific containers
docker stats api db redis

# One-time snapshot (no auto-update)
docker stats --no-stream

# Custom format string
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
# NAME   CPU %   MEM USAGE / LIMIT
# api    2.50%   128MiB / 512MiB
# db     1.20%   256MiB / 1GiB
```

| Column | Description |
|--------|-------------|
| CPU % | Percentage of CPU limit used |
| MEM USAGE / LIMIT | Current / maximum RAM consumption |
| MEM % | Percentage of RAM used |
| NET I/O | Incoming / outgoing network traffic |
| BLOCK I/O | Disk reads / writes |
| PIDS | Number of processes |

---

## 🔥 docker top: processes inside the container

```bash
# Processes inside the container (no exec needed!)
docker top mycontainer

# UID   PID    PPID   C  STIME  TTY  TIME      CMD
# root  12345  12300  0  10:30  ?    00:00:05  node server.js
# root  12346  12345  0  10:30  ?    00:00:01  /usr/bin/node worker.js

# With additional fields (ps format)
docker top mycontainer -o pid,user,%cpu,%mem,command

# For Docker Compose
docker compose top
```

`docker top` is useful for a quick check without entering the container (`docker exec`).

---

## 🔥 docker events: Docker daemon events

```bash
# Follow events in real time
docker events

# 2024-01-15T10:30:15.000000000Z container start a1b2c3d4e5f6
# 2024-01-15T10:35:20.000000000Z container die a1b2c3d4e5f6 (exitCode=137)
# 2024-01-15T10:35:21.000000000Z container stop a1b2c3d4e5f6

# Filter by event type
docker events --filter event=die
docker events --filter event=oom

# Filter by container
docker events --filter container=mycontainer

# Filter by object type
docker events --filter type=container
docker events --filter type=network
docker events --filter type=volume

# For a specific time period
docker events --since 1h --until 30m

# JSON format
docker events --format '{{json .}}' --filter event=die
```

Typical container events:
- `create` → `start` → `die` → `stop` → `destroy`
- `kill` — container killed by a signal
- `oom` — Out of Memory
- `health_status` — healthcheck status change

---

## 🔥 docker system df: disk usage

```bash
# Summary overview
docker system df

# TYPE            TOTAL   ACTIVE  SIZE     RECLAIMABLE
# Images          15      5       4.2GB    2.8GB (66%)
# Containers      8       3       150MB    120MB (80%)
# Local Volumes   10      4       1.5GB    800MB (53%)
# Build Cache     20      0       500MB    500MB (100%)

# Detailed breakdown per object
docker system df -v
```

---

## 🔥 Debugging common errors

### 1. Container exits immediately (Exit Code 0)

```bash
$ docker run -d myapp
$ docker ps -a
CONTAINER ID  STATUS                  NAMES
a1b2c3d4e5f6  Exited (0) 1 sec ago    myapp
```

**Cause:** the container's main process exits. A container lives as long as PID 1 is running.

```bash
# Diagnostics
docker logs myapp
docker inspect --format='{{.Config.Cmd}}' myapp

# ❌ Common mistakes
# CMD runs a script that exits
CMD ["bash", "setup.sh"]

# ❌ Process goes to the background
CMD ["nginx"]              # nginx daemonizes by default

# ✅ Fix: run the process in the foreground
CMD ["nginx", "-g", "daemon off;"]
CMD ["node", "server.js"]  # Node.js runs in the foreground
```

### 2. Container exits with code 1 (application error)

```bash
$ docker ps -a
CONTAINER ID  STATUS                  NAMES
a1b2c3d4e5f6  Exited (1) 5 secs ago   api
```

```bash
# Diagnostics
docker logs api
# Error: Cannot find module '/app/server.js'
# or
# Error: ECONNREFUSED 127.0.0.1:5432

# Check files in the container
docker run -it myapp sh
ls -la /app/

# Check environment variables
docker inspect --format='{{json .Config.Env}}' api | jq .
```

### 3. Container exits with code 137 (OOM Killed / SIGKILL)

```bash
$ docker ps -a
CONTAINER ID  STATUS                    NAMES
a1b2c3d4e5f6  Exited (137) 2 mins ago   api
```

Exit code 137 = 128 + 9 (SIGKILL). Two main causes:

```bash
# Check for OOM
docker inspect --format='{{.State.OOMKilled}}' api
# true → container was killed due to out of memory

# Check memory limits
docker inspect --format='{{.HostConfig.Memory}}' api
# 536870912 (512 MB)

# Check peak consumption before crash
docker stats --no-stream api   # If container is still alive

# Solution: increase memory limit
docker run -m 1g myapp
```

```yaml
# docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
```

### 4. Port conflict

```bash
$ docker run -p 3000:3000 myapp
# Error: Bind for 0.0.0.0:3000 failed: port is already allocated

# Diagnostics: who is using the port
docker ps --format '{{.Names}}\t{{.Ports}}' | grep 3000
# or on the host
lsof -i :3000    # macOS/Linux
netstat -tlnp | grep 3000

# Solution: use a different port or stop the occupying container
docker run -p 3001:3000 myapp
```

### 5. Permission denied (files and volumes)

```bash
$ docker logs api
# Error: EACCES: permission denied, open '/data/config.json'

# Diagnostics
docker exec api ls -la /data/
docker exec api id
# uid=1000(node) gid=1000(node)

# Check owner on the host
ls -la ./data/

# Solution: correct permissions
# In Dockerfile
RUN chown -R node:node /data
USER node

# Or at runtime
docker run -u $(id -u):$(id -g) -v ./data:/data myapp
```

### 6. Network issues between containers

```bash
$ docker logs api
# Error: getaddrinfo ENOTFOUND db

# Diagnostics: are the containers on the same network?
docker network inspect mynetwork

# Check DNS from the container
docker exec api ping db
docker exec api nslookup db

# ❌ Common mistake: containers on different networks
docker network ls
docker inspect --format='{{json .NetworkSettings.Networks}}' api
docker inspect --format='{{json .NetworkSettings.Networks}}' db

# ✅ Solution: connect to a shared network
docker network create mynet
docker network connect mynet api
docker network connect mynet db
```

### 7. Image not found or build error

```bash
# Image not found
$ docker run myapp:v2
# Unable to find image 'myapp:v2' locally
# Error: pull access denied

# Build error
$ docker build -t myapp .
# Step 5/10: COPY package.json .
# COPY failed: file not found in build context

# Diagnostics
docker images | grep myapp
ls -la package.json
cat .dockerignore    # May be excluding required files!
```

---

## 🔥 Debugging strategy: step-by-step algorithm

When a container is not working, follow this algorithm:

```
1. docker ps -a               → Status and exit code
2. docker logs <container>     → What the application wrote
3. docker inspect <container>  → Configuration, networks, env, OOM
4. docker exec -it <c> sh     → Enter and inspect
5. docker events --since 1h    → What happened at the Docker level
6. docker stats               → Resources (CPU, RAM, I/O)
7. docker system df            → Disk space
```

### Example debugging: API not responding

```bash
# Step 1: Status
$ docker ps -a | grep api
a1b2c3d4e5f6  myapp  Exited (137) 5m ago  api

# Step 2: Logs
$ docker logs --tail 50 api
[2024-01-15T10:30:00Z] Server started on port 3000
[2024-01-15T10:35:00Z] Processing large request...
# Logs cut off → possibly OOM

# Step 3: Inspect
$ docker inspect --format='{{.State.OOMKilled}}' api
true
$ docker inspect --format='{{.HostConfig.Memory}}' api
268435456    # 256 MB — too low

# Step 4: Solution — increase memory and restart
# Update docker-compose.yml:
#   deploy.resources.limits.memory: 1G
$ docker compose up -d api
```

---

## ⚠️ Common beginner mistakes

### 🐛 1. Log rotation not configured

```yaml
# ❌ Logs grow without limits
services:
  api:
    image: myapp
    # No logging section!
```

> **Why this is a mistake:** by default the `json-file` driver does not limit size. After a week or two the log file can take up tens of gigabytes and fill the disk. The server will stop working.

```yaml
# ✅ Always configure rotation
services:
  api:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

### 🐛 2. Using docker logs with a remote logging driver

```bash
# ❌ docker logs does not work with syslog/fluentd/awslogs
docker run --log-driver syslog myapp
docker logs myapp
# Error: "logs" command is supported only for "json-file" and "journald" logging drivers
```

> **Why this is a mistake:** remote drivers send logs directly to the target system. Docker does not keep a local copy (unless dual logging is enabled).

```bash
# ✅ Use json-file/local/journald for access via docker logs
# Or enable dual logging in daemon.json
```

### 🐛 3. Application writes logs to a file instead of STDOUT

```dockerfile
# ❌ Logs to a file — docker logs is empty
CMD ["myapp", "--logfile=/var/log/app.log"]
```

> **Why this is a mistake:** Docker intercepts only STDOUT and STDERR. Logs written to a file inside the container are not visible via `docker logs` and are not processed by the logging driver.

```dockerfile
# ✅ Redirect logs to STDOUT
# For nginx:
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# For the application: configure logging to STDOUT
CMD ["myapp", "--log-to-stdout"]
```

### 🐛 4. Not checking the container exit code

```bash
# ❌ "Container crashed" without analyzing the cause
docker restart api   # Restart without diagnostics
```

> **Why this is a mistake:** the exit code contains important information: 0 — normal exit, 1 — application error, 137 — SIGKILL/OOM, 143 — SIGTERM, 126 — not executable, 127 — command not found.

```bash
# ✅ Diagnose first, then fix
docker inspect --format='{{.State.ExitCode}}' api
docker inspect --format='{{.State.OOMKilled}}' api
docker logs --tail 100 api
# Only after analysis — take action
```

### 🐛 5. Ignoring docker system df

```bash
# ❌ "No idea where the disk space went"
df -h /
# /dev/sda1  100G  95G  5G  95%
```

> **Why this is a mistake:** Docker accumulates unused images, stopped containers, orphaned volumes, and build cache. Without periodic cleanup they fill the disk.

```bash
# ✅ Check and clean up regularly
docker system df
docker system prune           # Remove unused resources
docker system prune -a        # Including all images without containers
docker volume prune           # Orphaned volumes
```

---

## 💡 Best practices

### 1. Always configure log rotation

```yaml
# ✅ Globally in daemon.json or per service
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "5"
```

### 2. Log to STDOUT/STDERR

```dockerfile
# ✅ Redirect file-based logs to streams
RUN ln -sf /dev/stdout /var/log/nginx/access.log
```

### 3. Use Go templates for inspect

```bash
# ✅ Extract the data you need, don't parse JSON manually
docker inspect --format='{{.State.Status}}' mycontainer
```

### 4. Follow the debugging algorithm

```bash
# ✅ logs → inspect → exec → events → stats
# Don't restart the container without diagnostics
```

### 5. Monitor resources in production

```bash
# ✅ Periodically check consumption
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}"
docker system df
```

### 6. Know exit codes

```
0   — Normal exit
1   — Application error
126 — File is not executable
127 — Command not found
137 — SIGKILL (kill -9 or OOM)
143 — SIGTERM (graceful shutdown)
```

---

## 📌 Summary

- ✅ **docker logs** — the primary log reading tool (-f, --tail, --since, -t)
- ✅ Docker intercepts only **STDOUT and STDERR**, logs written to files are invisible
- ✅ **Logging drivers**: json-file (default), local (optimized), syslog, fluentd, awslogs
- ✅ **Log rotation** (max-size, max-file) — required in production
- ✅ **docker inspect** — complete container information, Go templates for extracting data
- ✅ **docker stats** — real-time CPU, RAM, I/O monitoring
- ✅ **docker top** — processes inside the container without exec
- ✅ **docker events** — Docker daemon events (create, start, errors, OOM)
- ✅ **docker system df** — disk usage by Docker objects
- ✅ **Exit codes**: 0 (OK), 1 (error), 137 (SIGKILL/OOM), 143 (SIGTERM)
- ✅ **Debugging algorithm**: ps → logs → inspect → exec → events → stats → system df
- ✅ Always **diagnose** before restarting a container
