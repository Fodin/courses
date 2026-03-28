# Level 11: Docker Security

## 🎯 The Problem: Containers Don't Isolate You Automatically

Many developers think of Docker as a magic security wall: "since the application is in a container, it's isolated." This is a dangerous misconception.

```bash
# A typical situation: everything works, but...
$ docker run -d --name myapp \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/host-etc \
  --privileged \
  myapp:latest

# Congratulations, you've given the container full access to the host
```

A container is **not a virtual machine**. It uses the same Linux kernel as the host. Without proper configuration:
- A process in the container can **escape to the host** (container escape)
- An attacker can **read secrets** from other containers
- A vulnerability in a dependency can become an **entry point** into your infrastructure
- A **supply chain attack** via a compromised base image can infect all your services

```
┌─────────────────────────────────────────────┐
│                    HOST                      │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Container │  │Container │  │Container │  │
│  │(root,    │  │(no caps  │  │(read-only│  │
│  │ privil.) │  │ dropped) │  │ FS, user)│  │
│  │          │  │          │  │          │  │
│  │ DANGEROUS│  │ Better   │  │ Good     │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│  Shared Linux kernel                         │
└─────────────────────────────────────────────┘
```

In this level we will cover all aspects of Docker security:
- Running as an unprivileged user
- Linux Capabilities and how to restrict them
- Seccomp and AppArmor profiles
- Read-only filesystem
- Vulnerability scanning
- Image signing and verification
- Secrets management
- Network isolation and resource limits

---

## 🔥 Container Threat Model

Before defending, you need to understand **what** you're defending against. The main attack vectors:

### 1. Container Escape

An attacker who has gained access to a container tries to break out to the host.

```bash
# Vector 1: --privileged grants ALL capabilities and access to host devices
$ docker run --privileged -it alpine sh
# Inside the container:
$ mount /dev/sda1 /mnt  # Mount the host disk!
$ cat /mnt/etc/shadow    # Read host passwords!

# Vector 2: Docker socket -- full control over the Docker daemon
$ docker run -v /var/run/docker.sock:/var/run/docker.sock alpine sh
# Inside:
$ apk add docker-cli
$ docker run -v /:/host --privileged alpine chroot /host
# Now we have root on the host
```

### 2. Supply Chain Attack

```bash
# A compromised image on Docker Hub
FROM cool-developer/node-utils:latest  # Who is cool-developer?

# The image may contain:
# - A cryptominer
# - A backdoor
# - Environment variable exfiltration to an external server
```

### 3. Exploiting Dependency Vulnerabilities

```bash
# Your image contains hundreds of packages
$ docker run --rm aquasec/trivy image myapp:latest
myapp:latest (debian 12.4)
Total: 47 (CRITICAL: 3, HIGH: 12, MEDIUM: 22, LOW: 10)

# 3 critical vulnerabilities -- potential RCE!
```

### 4. Secrets Leakage

```dockerfile
# ❌ Secrets in environment variables
ENV DATABASE_URL=postgres://admin:p@ssw0rd@db:5432/mydb

# ❌ Secrets in image layers (visible via docker history)
COPY .env /app/.env
RUN echo "API_KEY=sk-secret123" > /app/config
```

### 5. Network Attacks Between Containers

```bash
# By default, all containers in the bridge network can see each other
$ docker network inspect bridge
# A container with a vulnerability can attack neighboring containers
```

---

## 📌 Running as an Unprivileged User

By default, the process in a container runs as **root**. This is the first and most critical problem.

### Why root in a container is bad

```bash
$ docker run --rm alpine id
uid=0(root) gid=0(root) groups=0(root)

# root in a container == root on the host (UID 0)
# If a container escape occurs, the attacker gets root on the host
```

### The USER directive in a Dockerfile

```dockerfile
# ❌ BAD: everything as root
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
# The node process runs as root!

# ✅ GOOD: create and use an unprivileged user
FROM node:20-alpine
WORKDIR /app

# Create user and group
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install dependencies as root (write permissions needed)
COPY package*.json ./
RUN npm ci --only=production

# Copy code and change owner
COPY --chown=appuser:appgroup . .

# Switch to the unprivileged user
USER appuser

# Now node runs as appuser
CMD ["node", "server.js"]
```

### The --user flag at runtime

```bash
# Override the user at runtime
$ docker run --user 1000:1000 nginx

# Using a username
$ docker run --user nobody nginx

# Verification
$ docker run --user 1000:1000 alpine id
uid=1000 gid=1000
```

### 💡 Users in popular images

Many official images already have unprivileged users:

| Image | User | UID |
|-------|------|-----|
| node | node | 1000 |
| postgres | postgres | 999 |
| nginx | nginx | 101 |
| redis | redis | 999 |

```dockerfile
# For Node.js you can use the built-in user
FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN npm ci --only=production
USER node
CMD ["node", "server.js"]
```

---

## 🔥 Linux Capabilities: Fine-Grained Privilege Control

In Linux, root privileges are divided into ~40 separate **capabilities**. Docker grants containers a limited set by default, but it is still often excessive.

### What Capabilities are

```bash
# Key capabilities:
# CAP_NET_BIND_SERVICE -- bind to ports < 1024
# CAP_NET_RAW          -- use raw sockets (ping, tcpdump)
# CAP_CHOWN            -- change file ownership
# CAP_SETUID           -- change process UID
# CAP_SYS_ADMIN        -- mount filesystems, manage namespaces (DANGEROUS!)
# CAP_SYS_PTRACE       -- debug processes (DANGEROUS!)
# CAP_DAC_OVERRIDE     -- bypass file permission checks

# View container capabilities:
$ docker run --rm alpine sh -c 'apk add -q libcap && capsh --print'
Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,...
```

### Drop and Add

```bash
# ❌ --privileged: ALL capabilities (never use in production!)
$ docker run --privileged alpine

# ✅ Drop all, add only what's needed
$ docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# ✅ Drop specific dangerous capabilities
$ docker run --cap-drop=SYS_ADMIN --cap-drop=NET_RAW alpine

# ✅ Docker Compose
services:
  web:
    image: nginx
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
      - CHOWN
      - SETUID
      - SETGID
```

### Minimum sets for typical services

```yaml
# Web server (nginx, caddy)
cap_drop: [ALL]
cap_add: [NET_BIND_SERVICE, CHOWN, SETUID, SETGID]

# Node.js / Python / Go application (port > 1024)
cap_drop: [ALL]
# No additional capabilities needed!

# Database (PostgreSQL)
cap_drop: [ALL]
cap_add: [CHOWN, SETUID, SETGID, FOWNER, DAC_OVERRIDE]
```

### 📌 Principle of Least Privilege

```
Principle: start with --cap-drop=ALL and add only
what the container cannot run without.

NOT the other way around: "let's remove the extras". You don't know what's extra.
It's better to get an "operation not permitted" error and add the specific
capability than to leave unnecessary ones.
```

---

## 🔒 Seccomp and AppArmor Profiles

### Seccomp (Secure Computing Mode)

Seccomp filters the **system calls** a container can make to the kernel. Docker blocks ~44 out of ~300+ syscalls by default.

```bash
# Docker uses seccomp by default (the default profile)
# Blocked: mount, reboot, swapon, ptrace, and other dangerous syscalls

# Check that seccomp is active:
$ docker info | grep -i seccomp
Security Options: seccomp

# Run with a custom profile
$ docker run --security-opt seccomp=custom-profile.json nginx

# ❌ Disabling seccomp (NEVER in production!)
$ docker run --security-opt seccomp=unconfined alpine
```

Example custom seccomp profile:

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "architectures": ["SCMP_ARCH_X86_64"],
  "syscalls": [
    {
      "names": [
        "read", "write", "open", "close", "stat",
        "fstat", "mmap", "mprotect", "munmap",
        "brk", "ioctl", "access", "pipe",
        "select", "sched_yield", "clone", "execve",
        "exit", "exit_group", "futex", "epoll_wait",
        "socket", "connect", "accept", "bind", "listen",
        "sendto", "recvfrom"
      ],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

### AppArmor

AppArmor is a mandatory access control (MAC) system that restricts container access to files, the network, and capabilities.

```bash
# Check AppArmor status
$ sudo aa-status

# Docker uses the docker-default profile by default
$ docker run --security-opt apparmor=docker-default nginx

# Custom profile
$ docker run --security-opt apparmor=my-custom-profile nginx

# ❌ Disabling AppArmor
$ docker run --security-opt apparmor=unconfined nginx
```

Example AppArmor profile:

```
#include <tunables/global>

profile docker-custom flags=(attach_disconnected) {
  #include <abstractions/base>

  # Allow read from /app
  /app/** r,

  # Allow executing node
  /usr/local/bin/node ix,

  # Deny writes outside /tmp and /app/logs
  deny /etc/** w,
  deny /usr/** w,

  # Allow network
  network tcp,
  network udp,
}
```

---

## 📌 Read-Only Filesystem

Running a container with a read-only filesystem prevents the process from creating or modifying files. This is a critical defense against many types of attacks.

### Basic usage

```bash
# Run with a read-only root filesystem
$ docker run --read-only nginx

# Problem: many applications write to temporary files
# Solution: tmpfs for the required directories
$ docker run --read-only \
  --tmpfs /tmp:rw,noexec,nosuid \
  --tmpfs /var/cache/nginx:rw \
  --tmpfs /var/run:rw \
  nginx
```

### Docker Compose

```yaml
services:
  web:
    image: nginx
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
      - /var/cache/nginx:rw,size=32m
      - /var/run:rw,size=1m

  api:
    image: myapp
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=128m
    volumes:
      - app-logs:/app/logs  # Use a named volume for logs
```

### What read-only FS provides

```
✅ Protection against writing malicious files (backdoors, web shells)
✅ Protection against modification of application configuration
✅ Protection against replacing executable files
✅ Simplified auditing -- if a file changed, something is wrong
✅ Prevention of disk writes (cryptominer data storage)

⚠️  tmpfs required for:
  - /tmp (temporary files)
  - PID files (/var/run)
  - Cache (nginx, varnish)
  - Sessions (PHP, Python)
```

### tmpfs options

```bash
# Key tmpfs options:
# rw       -- read and write
# noexec   -- prevent binary execution (IMPORTANT!)
# nosuid   -- prevent setuid bit
# size=NNm -- size limit

# Optimal combination:
--tmpfs /tmp:rw,noexec,nosuid,size=64m
```

---

## 🔥 Vulnerability Scanning

Every Docker image contains an OS and packages in which vulnerabilities (CVEs) are regularly discovered. Image scanning is an essential practice.

### CVE Severity Levels

```
CRITICAL -- Remote code execution without authentication (RCE).
            Requires immediate remediation.
            Example: Log4Shell (CVE-2021-44228)

HIGH     -- A serious vulnerability requiring certain conditions.
            Fix within 1-2 days.
            Example: privilege escalation in the kernel

MEDIUM   -- A vulnerability with limited impact.
            Fix within a week.

LOW      -- Minimal risk, informational vulnerability.
            Fix at the next update.
```

### Docker Scout

```bash
# Built into Docker Desktop (with Docker Engine 25+)
$ docker scout cves myapp:latest

# Quick summary
$ docker scout quickview myapp:latest

# Only critical and high severity vulnerabilities
$ docker scout cves --only-severity critical,high myapp:latest

# Compare with a previous version
$ docker scout compare myapp:latest --to myapp:previous

# Recommendations for updating the base image
$ docker scout recommendations myapp:latest
```

### Trivy (Aqua Security)

```bash
# Installation
$ brew install trivy  # macOS
$ apt install trivy    # Debian/Ubuntu

# Scan an image
$ trivy image myapp:latest

# Critical only
$ trivy image --severity CRITICAL myapp:latest

# Exit with error on HIGH/CRITICAL (for CI)
$ trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Scan a Dockerfile
$ trivy config Dockerfile

# Scan filesystem (dependencies)
$ trivy fs --scanners vuln,secret .

# JSON format (for integration)
$ trivy image -f json -o results.json myapp:latest

# Ignore unfixed vulnerabilities
$ trivy image --ignore-unfixed myapp:latest
```

### Grype (Anchore)

```bash
# Installation
$ brew install grype

# Scan
$ grype myapp:latest

# Critical only
$ grype myapp:latest --only-fixed --fail-on critical

# Output format table/json/cyclonedx
$ grype myapp:latest -o json > results.json
```

### Snyk

```bash
# Scan
$ snyk container test myapp:latest

# Monitor (notifications about new CVEs)
$ snyk container monitor myapp:latest

# Scan a Dockerfile
$ snyk iac test Dockerfile
```

### CI/CD Integration

```yaml
# GitHub Actions: scan on every push
name: Security Scan
on: [push]

jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Build image
        run: docker build -t myapp:${{ github.sha }} .

      - name: Run Trivy scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: myapp:${{ github.sha }}
          format: table
          exit-code: 1
          severity: CRITICAL,HIGH
          ignore-unfixed: true

      # Alternative: Docker Scout
      - name: Docker Scout
        uses: docker/scout-action@v1
        with:
          command: cves
          image: myapp:${{ github.sha }}
          only-severities: critical,high
          exit-code: true
```

### Automation: scheduled scanning

```yaml
# Cron job: scan all production images once a day
name: Nightly Security Scan
on:
  schedule:
    - cron: '0 2 * * *'  # Every day at 2:00

jobs:
  scan:
    strategy:
      matrix:
        image: [api, worker, frontend, gateway]
    runs-on: ubuntu-latest
    steps:
      - name: Scan ${{ matrix.image }}
        run: |
          trivy image --exit-code 1 \
            --severity CRITICAL \
            registry.example.com/${{ matrix.image }}:production
```

---

## 🔐 Image Signing and Verification

How do you ensure that the downloaded image is exactly the one that was built, and hasn't been tampered with?

### Docker Content Trust (DCT)

```bash
# Enable DCT
$ export DOCKER_CONTENT_TRUST=1

# Now docker pull and docker push will verify/create signatures
$ docker pull nginx:latest
# Pull (1 of 1): nginx:latest@sha256:abc123...
# Tagging nginx@sha256:abc123... as nginx:latest
# sha256:abc123... -- signature verified

# Sign on push
$ docker push myregistry/myapp:latest
# Signing and pushing trust metadata...

# Disable for a specific command
$ DOCKER_CONTENT_TRUST=0 docker pull untrusted/image
```

### Cosign (Sigstore)

A modern tool for signing OCI artifacts.

```bash
# Installation
$ brew install cosign

# Generate keys
$ cosign generate-key-pair
# Creates cosign.key (private) and cosign.pub (public)

# Sign an image
$ cosign sign --key cosign.key myregistry/myapp:v1.0

# Verify
$ cosign verify --key cosign.pub myregistry/myapp:v1.0

# Keyless signing (via OIDC -- GitHub, Google, Microsoft)
$ cosign sign myregistry/myapp:v1.0
# Opens browser for authentication

# Verify keyless signature
$ cosign verify \
  --certificate-identity=user@example.com \
  --certificate-oidc-issuer=https://accounts.google.com \
  myregistry/myapp:v1.0
```

### Integrating signing into CI/CD

```yaml
# GitHub Actions: sign after build
- name: Sign image with cosign
  env:
    COSIGN_KEY: ${{ secrets.COSIGN_KEY }}
  run: |
    cosign sign --key env://COSIGN_KEY \
      myregistry/myapp:${{ github.sha }}
```

---

## 🔑 Secrets Management

Secrets (passwords, API keys, certificates) are one of the most common causes of leaks in Docker.

### ❌ How NOT to store secrets

```dockerfile
# ❌ BAD: secret in a Dockerfile environment variable
ENV API_KEY=sk-secret-key-12345

# ❌ BAD: secret in ARG (visible in docker history)
ARG DB_PASSWORD=mysecretpassword
RUN echo "password=$DB_PASSWORD" > /app/config

# ❌ BAD: copying .env into the image
COPY .env /app/.env

# ❌ BAD: secret in docker-compose.yml in git
environment:
  - DATABASE_URL=postgres://admin:password@db/mydb
```

```bash
# Check: secrets are visible via docker history!
$ docker history myapp:latest
... ENV API_KEY=sk-secret-key-12345  ...
# Anyone who downloads the image will see your key!
```

### ✅ BuildKit secrets (for build)

```dockerfile
# Dockerfile: secret is available only in one RUN command,
# NOT stored in image layers
# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

# Secret is mounted as a file, available only during RUN
RUN --mount=type=secret,id=npm_token \
  NPM_TOKEN=$(cat /run/secrets/npm_token) \
  npm ci

COPY . .
CMD ["node", "server.js"]
```

```bash
# Pass secret during build
$ docker build --secret id=npm_token,src=.npm_token .

# From environment variable
$ docker build --secret id=npm_token,env=NPM_TOKEN .
```

### ✅ Docker Secrets (Docker Swarm)

```bash
# Create a secret
$ echo "my-secret-password" | docker secret create db_password -

# Use in a service
$ docker service create \
  --name myapp \
  --secret db_password \
  myapp:latest

# In the container the secret is available as a file
# /run/secrets/db_password
```

```yaml
# docker-compose.yml (Swarm mode)
services:
  db:
    image: postgres:16
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password

secrets:
  db_password:
    external: true  # Created via docker secret create
    # or
    file: ./secrets/db_password.txt  # From a file (for dev)
```

### ✅ Runtime secrets via volumes

```bash
# Mount a file with a secret (not in the image!)
$ docker run -v /secure/secrets/api_key:/run/secrets/api_key:ro myapp

# In the application:
# const apiKey = fs.readFileSync('/run/secrets/api_key', 'utf8').trim()
```

### ✅ External secrets managers

```bash
# HashiCorp Vault
$ vault kv get -field=password secret/myapp/db

# AWS Secrets Manager
$ aws secretsmanager get-secret-value --secret-id myapp/db

# In Kubernetes: External Secrets Operator
# In Docker Compose: env_file with .gitignore
```

---

## 🌐 Network Isolation

### Principle of least privilege for networks

```yaml
# ❌ BAD: all services in one network
services:
  frontend:
    networks: [default]
  api:
    networks: [default]
  db:
    networks: [default]
  redis:
    networks: [default]
# frontend can directly access db!

# ✅ GOOD: network segmentation
services:
  frontend:
    networks:
      - frontend-net

  api:
    networks:
      - frontend-net  # Accepts requests from frontend
      - backend-net   # Connects to db and redis

  db:
    networks:
      - backend-net   # Accessible only to api

  redis:
    networks:
      - backend-net   # Accessible only to api

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true  # No internet access!
```

### Restricting ICC (Inter-Container Communication)

```bash
# Disable direct communication between containers in the network
$ docker network create --opt com.docker.network.bridge.enable_icc=false isolated-net

# Containers in this network cannot communicate with each other,
# only through published ports
```

### Blocking unnecessary port exposure

```yaml
# ❌ BAD: expose the DB port externally
services:
  db:
    ports:
      - "5432:5432"  # Accessible from any host!

# ✅ GOOD: DB is accessible only via the internal network
services:
  db:
    expose:
      - "5432"  # Accessible only within the Docker network
    # No ports section!
```

---

## ⚙️ Resource Limits

Without limits, a single container can consume **all** host resources, creating a DoS for others.

### Memory

```bash
# Hard memory limit
$ docker run --memory=256m myapp

# Limit with swap
$ docker run --memory=256m --memory-swap=512m myapp

# Disable swap (recommended)
$ docker run --memory=256m --memory-swap=256m myapp
```

### CPU

```bash
# Limit CPU count
$ docker run --cpus=0.5 myapp  # Half a core

# CPU shares (relative priority)
$ docker run --cpu-shares=512 myapp  # Default is 1024

# Pin to specific cores
$ docker run --cpuset-cpus="0,1" myapp
```

### Processes (PID limit)

```bash
# Limit process count (protection against fork bomb)
$ docker run --pids-limit=100 myapp

# ❌ Without a limit: a fork bomb will kill the host
# :(){ :|:& };:
```

### Docker Compose

```yaml
services:
  api:
    image: myapp
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
          pids: 100
        reservations:
          cpus: '0.25'
          memory: 128M
```

### Disk I/O limits

```bash
# Read/write speed limit
$ docker run --device-read-bps /dev/sda:10mb \
             --device-write-bps /dev/sda:10mb \
             myapp

# IOPS limit
$ docker run --device-read-iops /dev/sda:1000 \
             --device-write-iops /dev/sda:1000 \
             myapp
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Running with --privileged

```bash
# ❌ BAD: "it doesn't work, I'll add --privileged"
$ docker run --privileged myapp

# --privileged disables ALL protections:
# - All capabilities
# - Seccomp disabled
# - AppArmor disabled
# - Access to all host devices
# - Ability to mount filesystems

# ✅ GOOD: find the specific capability needed
$ docker run --cap-add=NET_ADMIN myapp
# If --privileged is needed, the architecture is probably wrong
```

### Mistake 2: Docker socket in a container

```bash
# ❌ BAD: mounting docker.sock
$ docker run -v /var/run/docker.sock:/var/run/docker.sock myapp

# This gives the container FULL control over the Docker daemon.
# Equivalent to root access on the host.

# ✅ If you need to manage Docker from a container:
# Use the Docker API with authentication and restricted access
# Or rootless Docker / Podman
```

### Mistake 3: Secrets in ENV and image layers

```dockerfile
# ❌ BAD
ENV DATABASE_PASSWORD=secret123

# Visible via:
$ docker inspect container_id | jq '.[0].Config.Env'
$ docker history myapp:latest

# ✅ GOOD: BuildKit secrets for builds, volumes/secrets for runtime
RUN --mount=type=secret,id=db_pass cat /run/secrets/db_pass
```

### Mistake 4: Using the latest tag

```dockerfile
# ❌ BAD: unpredictable what will be in latest tomorrow
FROM node:latest
FROM ubuntu:latest

# ✅ GOOD: fixed version + digest
FROM node:20.11.0-alpine3.19
# Even better: with sha256 digest
FROM node:20.11.0-alpine3.19@sha256:1a2b3c4d5e6f...
```

### Mistake 5: No resource limits

```yaml
# ❌ BAD: no limits
services:
  api:
    image: myapp

# A stuck container can consume all host memory
# and trigger the OOM killer for other services

# ✅ GOOD: always set limits
services:
  api:
    image: myapp
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
          pids: 100
```

### Mistake 6: All services in one network without segmentation

```yaml
# ❌ BAD: frontend has access to the database
services:
  frontend: { networks: [default] }
  api: { networks: [default] }
  db: { networks: [default] }

# If frontend is compromised, the attacker gets access to the DB

# ✅ GOOD: segmentation
services:
  frontend: { networks: [public] }
  api: { networks: [public, internal] }
  db: { networks: [internal] }
networks:
  internal: { internal: true }
```

---

## 💡 Best Practices and Security Checklist

### Docker Security Checklist

```
Images:
  □ Use minimal base images (alpine, distroless, scratch)
  □ Pin base image versions (not latest)
  □ Use digest (@sha256:...) for critical images
  □ Scan images for vulnerabilities (trivy, scout, grype)
  □ Sign images (cosign, DCT)
  □ Use multi-stage builds
  □ Do not include source code, tests, dev dependencies in the image

Dockerfile:
  □ USER directive -- unprivileged user
  □ COPY instead of ADD (ADD unpacks archives, downloads URLs)
  □ .dockerignore -- exclude .git, .env, node_modules, secrets
  □ HEALTHCHECK for state monitoring
  □ No secrets in ENV, ARG, or COPY

Runtime:
  □ --cap-drop=ALL + only required --cap-add
  □ --read-only + tmpfs for writes
  □ --security-opt=no-new-privileges
  □ Resource limits (--memory, --cpus, --pids-limit)
  □ Do not mount docker.sock
  □ Do not use --privileged

Secrets:
  □ BuildKit secrets for builds (--mount=type=secret)
  □ Docker secrets or volume mounts for runtime
  □ External secrets manager (Vault, AWS SM) for production
  □ Scheduled secret rotation

Network:
  □ Network segmentation (frontend/backend/internal)
  □ internal: true for networks without internet access
  □ expose instead of ports for internal services
  □ Do not expose DB ports externally

CI/CD:
  □ Scan on every push (trivy-action, scout-action)
  □ Block merge on CRITICAL/HIGH CVE
  □ Periodic scanning of production images
  □ Automatic base image updates (Renovate, Dependabot)
```

### The --security-opt=no-new-privileges flag

```bash
# Prevents acquiring additional privileges via setuid/setgid
$ docker run --security-opt=no-new-privileges myapp

# Even if there is a setuid binary in the container, it won't get root privileges
# Recommended to ALWAYS use in production
```

### Rootless Docker

```bash
# Docker daemon runs without root privileges
# Even a container escape doesn't give root on the host

# Install rootless Docker
$ dockerd-rootless-setuptool.sh install

# Verify
$ docker info | grep -i rootless
# rootless: true

# Limitations:
# - No --privileged
# - No cgroup v1
# - Ports < 1024 are inaccessible without configuration
```

### Complete example of a secure Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20.11.0-alpine3.19 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build

# ---- Production stage ----
FROM gcr.io/distroless/nodejs20-debian12

# Metadata
LABEL maintainer="team@example.com"
LABEL org.opencontainers.image.source="https://github.com/example/myapp"

WORKDIR /app

# Copy only what is needed
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Distroless already runs as an unprivileged user (nonroot)
USER nonroot

# Healthcheck
# (distroless has no curl, use the application)
# HEALTHCHECK absent -- use orchestrator health checks

EXPOSE 3000
CMD ["dist/server.js"]
```

```yaml
# docker-compose.yml for production
services:
  api:
    build: .
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid,size=64m
    cap_drop:
      - ALL
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '1.0'
          pids: 100
    networks:
      - frontend-net
      - backend-net
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 5s
      retries: 3

  db:
    image: postgres:16-alpine
    read_only: true
    tmpfs:
      - /tmp:rw,noexec,nosuid
      - /var/run/postgresql:rw
    cap_drop:
      - ALL
    cap_add:
      - CHOWN
      - SETUID
      - SETGID
      - FOWNER
      - DAC_OVERRIDE
    security_opt:
      - no-new-privileges:true
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '2.0'
          pids: 200
    networks:
      - backend-net
    secrets:
      - db_password
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    volumes:
      - pgdata:/var/lib/postgresql/data

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true

secrets:
  db_password:
    file: ./secrets/db_password.txt

volumes:
  pgdata:
```

---

## 📋 Summary

Docker security is **not a single setting**, but a comprehensive approach:

| Level | What we protect | Tools |
|-------|----------------|-------|
| Image | Supply chain, vulnerabilities | Scanners (trivy, scout), signing (cosign), minimal images |
| Dockerfile | Secrets, privileges | USER, BuildKit secrets, multi-stage, .dockerignore |
| Runtime | Container escape | cap_drop, read-only, seccomp, no-new-privileges |
| Resources | DoS, fork bomb | --memory, --cpus, --pids-limit |
| Network | Lateral movement | Network segmentation, internal, expose vs ports |
| Secrets | Credential leakage | Docker secrets, Vault, volume mounts |

The core principle: **Defense in Depth**. No single security measure is perfect, but their combination makes an attack significantly harder.

```
Without protection:  ─────────────> HOST (1 step)

With protection: CAP_DROP → READ-ONLY → NO-NEW-PRIV → SECCOMP → USER
                 Each layer stops certain attacks.
                 Breaking through all 5 layers is orders of magnitude harder.
```
