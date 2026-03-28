# Level 12: CI/CD with Docker

## 🎯 The Problem: Manual Build and Deploy — A Path to Chaos

Many teams still build Docker images manually on a developer's machine and deploy via `docker-compose up -d` over SSH. This works for pet projects, but in production it leads to disasters.

```bash
# Typical "deploy" in a small team
$ ssh production-server
$ cd /app
$ git pull
$ docker-compose build
$ docker-compose up -d
# "Seems to be working..."

# Then an hour later:
# - Production is down because migrations were forgotten
# - Image was built with dev dependencies
# - Nobody knows what version of code is currently in prod
# - Rollback? What rollback? git log and a prayer
```

Problems with a manual process:

```
┌─────────────────────────────────────────────────────────┐
│                    Manual Deploy                         │
│                                                         │
│  Developer ──► git push ──► SSH to server ──► build     │
│       │                            │                    │
│       │         Human              │                    │
│       │          factor:           │                    │
│       │                            │                    │
│       │  • Forgot to run tests     │                    │
│       │  • Built wrong branch      │                    │
│       │  • Didn't update .env      │                    │
│       │  • Forgot migrations       │                    │
│       │  • No rollback plan        │                    │
│       ▼                            ▼                    │
│     PROBLEM                   DOWNTIME                  │
└─────────────────────────────────────────────────────────┘
```

CI/CD (Continuous Integration / Continuous Delivery) automates the entire path from commit to production, removing the human factor:

```
┌──────────────────────────────────────────────────────────┐
│                    CI/CD Pipeline                         │
│                                                          │
│  git push ──► CI Build ──► Tests ──► Push Image ──► CD  │
│                  │           │           │            │   │
│              Dockerfile   unit,       Registry     Deploy│
│              lint, scan   e2e,        (GHCR,      (k8s, │
│                           integration  ECR)       swarm) │
│                  │           │           │            │   │
│                  ▼           ▼           ▼            ▼   │
│           Automatically  Quality    Versioned   Safe     │
│           reproducible   guarantee  image       rollback │
│                                     control              │
└──────────────────────────────────────────────────────────┘
```

In this level we will cover:
- CI/CD fundamentals and pipeline stages
- Docker in CI: build, caching, testing
- GitHub Actions and GitLab CI for Docker
- Container Registry: Docker Hub, GHCR, ECR, ACR
- Image tagging strategies
- Deploy strategies: rolling update, blue-green, canary
- Monitoring and health checks in production

---

## CI/CD Fundamentals

### What is CI/CD?

**CI (Continuous Integration)** — automatic build and testing of code on every commit. The goal is early error detection.

**CD (Continuous Delivery)** — automatic delivery of tested code to production (or staging). Code is always ready for release.

**CD (Continuous Deployment)** — full automation: every commit that passes tests is automatically deployed to production.

```
CI                          CD (Delivery)           CD (Deployment)
┌────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│ Push ──► Build │    │ Staging Deploy   │    │ Auto Production  │
│     ──► Test   │──►│ Manual Approval  │──►│ Deploy           │
│     ──► Lint   │    │ Production Deploy│    │ (no approval)    │
└────────────────┘    └──────────────────┘    └──────────────────┘
```

### CI/CD pipeline stages for Docker

A typical pipeline for a Docker application:

```yaml
# Pipeline stages
stages:
  - lint        # Code and Dockerfile check
  - build       # Docker image build
  - test        # Run tests inside a container
  - scan        # Scan image for vulnerabilities
  - push        # Push image to Registry
  - deploy      # Deploy to staging/production
  - verify      # Smoke tests after deploy
```

Each stage can halt the pipeline on error, preventing broken code from being released.

---

## Docker in CI: Building Images

### Building an image in a CI environment

In a CI environment, Docker images are built automatically. Key considerations:

```dockerfile
# Dockerfile for CI build
FROM node:20-alpine AS builder
WORKDIR /app

# Copy only package files for dependency caching
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Metadata for tracing (added by CI)
ARG BUILD_DATE
ARG GIT_SHA
ARG VERSION
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.revision=$GIT_SHA
LABEL org.opencontainers.image.version=$VERSION

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Layer caching in CI

One of the main problems with Docker in CI is **losing cache between builds**. Every CI runner starts with a clean environment.

```bash
# Without caching: every build downloads all dependencies fresh
# Build time: 5-10 minutes

# With registry-based caching
docker buildx build \
  --cache-from=type=registry,ref=myregistry.io/myapp:cache \
  --cache-to=type=registry,ref=myregistry.io/myapp:cache,mode=max \
  -t myapp:latest .
# Build time: 30 seconds (if dependencies haven't changed)
```

**Cache types:**

| Cache type | Description | Pros | Cons |
|-----------|-------------|------|------|
| `type=local` | Cache in a local directory | Fast access | Not shared between runners |
| `type=registry` | Cache in Container Registry | Shared for all runners | Network latency |
| `type=gha` | GitHub Actions Cache | Native integration | GitHub only |
| `type=s3` | Cache in S3/MinIO | Flexible, shared | Requires configuration |

```bash
# GitHub Actions Cache
docker buildx build \
  --cache-from=type=gha \
  --cache-to=type=gha,mode=max \
  -t myapp:latest .

# Local cache (for self-hosted runners)
docker buildx build \
  --cache-from=type=local,src=/tmp/.buildx-cache \
  --cache-to=type=local,dest=/tmp/.buildx-cache-new,mode=max \
  -t myapp:latest .
```

📌 **mode=max** caches all layers (including intermediate ones), not just the final one. This significantly speeds up rebuilds.

---

## GitHub Actions: CI/CD for Docker

### Basic workflow

```yaml
# .github/workflows/docker.yml
name: Docker CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint Dockerfile
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile

  build-and-test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build test image
        uses: docker/build-push-action@v5
        with:
          context: .
          target: builder
          load: true
          tags: myapp:test
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run tests
        run: |
          docker run --rm myapp:test npm test
          docker run --rm myapp:test npm run test:e2e

  push:
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Matrix Builds

For multi-platform images or multiple versions:

```yaml
jobs:
  build:
    strategy:
      matrix:
        platform: [linux/amd64, linux/arm64]
        node-version: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: ${{ matrix.platform }}
          build-args: NODE_VERSION=${{ matrix.node-version }}
          tags: myapp:node${{ matrix.node-version }}-${{ matrix.platform }}
```

### Testing with Docker Compose in CI

```yaml
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d

      - name: Wait for services
        run: |
          timeout 60 bash -c 'until docker compose -f docker-compose.test.yml exec -T db pg_isready; do sleep 2; done'
          timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'

      - name: Run integration tests
        run: docker compose -f docker-compose.test.yml exec -T app npm run test:integration

      - name: Collect logs on failure
        if: failure()
        run: docker compose -f docker-compose.test.yml logs > docker-logs.txt

      - name: Upload logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: docker-logs
          path: docker-logs.txt

      - name: Cleanup
        if: always()
        run: docker compose -f docker-compose.test.yml down -v
```

---

## GitLab CI: Docker in Pipelines

### Basic .gitlab-ci.yml

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - build
  - test
  - push
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  DOCKER_TAG: $CI_COMMIT_SHORT_SHA

# Docker-in-Docker (DinD)
services:
  - docker:24-dind

lint:
  stage: lint
  image: hadolint/hadolint:latest-alpine
  script:
    - hadolint Dockerfile

build:
  stage: build
  image: docker:24
  script:
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    - docker save $DOCKER_IMAGE:$DOCKER_TAG > image.tar
  artifacts:
    paths:
      - image.tar
    expire_in: 1 hour

test:
  stage: test
  image: docker:24
  script:
    - docker load < image.tar
    - docker run --rm $DOCKER_IMAGE:$DOCKER_TAG npm test

push:
  stage: push
  image: docker:24
  only:
    - main
    - tags
  script:
    - docker load < image.tar
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
    - |
      if [ -n "$CI_COMMIT_TAG" ]; then
        docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:$CI_COMMIT_TAG
        docker push $DOCKER_IMAGE:$CI_COMMIT_TAG
      fi
```

### Kaniko — building without a Docker daemon

Docker-in-Docker requires privileged mode, which is insecure. **Kaniko** builds images without a Docker daemon:

```yaml
build-kaniko:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.19.2-debug
    entrypoint: [""]
  script:
    - /kaniko/executor
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHORT_SHA}"
      --cache=true
      --cache-repo="${CI_REGISTRY_IMAGE}/cache"
```

💡 **When to use Kaniko:** in Kubernetes clusters where you can't run a Docker daemon, or when higher CI security is required.

---

## Container Registries

### Overview of popular registries

| Registry | Provider | Free tier | Features |
|----------|---------|-----------|----------|
| Docker Hub | Docker | 1 private repo | Most popular, rate limits |
| GHCR | GitHub | Unlimited for public | GitHub integration |
| ECR | AWS | 500 MB free tier | ECS/EKS integration |
| ACR | Azure | Basic tier | AKS integration |
| GCR / Artifact Registry | Google | 500 MB free | GKE integration |
| Harbor | Self-hosted | Free | Full control, RBAC |

### Working with GHCR (GitHub Container Registry)

```bash
# Authentication
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Tag and push
docker tag myapp:latest ghcr.io/username/myapp:v1.0.0
docker push ghcr.io/username/myapp:v1.0.0

# Pull
docker pull ghcr.io/username/myapp:v1.0.0
```

### Working with AWS ECR

```bash
# Authentication (token valid for 12 hours)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Create repository
aws ecr create-repository --repository-name myapp --region us-east-1

# Push
docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0

# Lifecycle policy (automatic cleanup of old images)
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    }]
  }'
```

### Registry Security

```bash
# Scan image before push
docker scout cves myapp:latest

# Sign image (cosign)
cosign sign --key cosign.key ghcr.io/username/myapp:v1.0.0

# Verify signature on pull
cosign verify --key cosign.pub ghcr.io/username/myapp:v1.0.0
```

---

## Image Tagging Strategies

Proper tagging is the foundation of reproducibility and rollback.

### Tagging strategies

```bash
# 1. Semantic Versioning (for releases)
myapp:1.0.0          # Full version
myapp:1.0             # Major.minor (latest patch)
myapp:1               # Major (latest minor.patch)

# 2. Git SHA (for exact identification)
myapp:sha-a1b2c3d    # First 7 characters of commit
myapp:main-a1b2c3d   # Branch + SHA

# 3. Branch name (for dev/staging)
myapp:main            # Latest main build
myapp:develop         # Latest develop build
myapp:feature-auth    # Feature branch

# 4. Timestamp (for sorting)
myapp:20240315-143022 # Build date and time
myapp:main-20240315   # Branch + date

# 5. Build number (for CI)
myapp:build-1234      # CI build number
```

### ❌ Why `latest` is a bad practice

```bash
# Never use latest in production!
docker pull myapp:latest
# Problems:
# 1. Which version of the code? Unknown
# 2. Rollback? Impossible
# 3. Reproducibility? No
# 4. Caching? Unpredictable

# latest can only be used for:
# - Local development
# - Quick start in README
```

### Automatic tagging in GitHub Actions

```yaml
# docker/metadata-action automatically generates tags
- name: Docker meta
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/username/myapp
    tags: |
      # On push to main: main, sha-abc1234
      type=ref,event=branch
      type=sha

      # On creating tag v1.2.3: 1.2.3, 1.2, 1, latest
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=semver,pattern={{major}}

      # On PR: pr-42
      type=ref,event=pr

      # Always: build date
      type=raw,value={{date 'YYYYMMDD-HHmmss'}}
```

---

## Testing with Docker in CI

### docker-compose.test.yml

```yaml
# docker-compose.test.yml
version: '3.8'

services:
  app:
    build:
      context: .
      target: builder
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@db:5432/testdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
```

### The Testcontainers pattern

For complex integration tests, you can spin up services directly from tests:

```typescript
// Example: test with a real database
import { PostgreSqlContainer } from '@testcontainers/postgresql'

describe('User Repository', () => {
  let container: StartedPostgreSqlContainer

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .start()
    // Connect to a real database
    await connectDB(container.getConnectionUri())
    await runMigrations()
  })

  afterAll(async () => {
    await container.stop()
  })

  it('should create user', async () => {
    const user = await createUser({ name: 'Alice' })
    expect(user.id).toBeDefined()
  })
})
```

---

## Deployment Strategies

### Rolling Update

Gradually replace old containers with new ones:

```
Time ──────────────────────────────►

Replica 1:  [v1] [v1] [v2] [v2] [v2]
Replica 2:  [v1] [v1] [v1] [v2] [v2]
Replica 3:  [v1] [v1] [v1] [v1] [v2]

Traffic:    100%v1     mixed     100%v2
```

```yaml
# Docker Swarm rolling update
deploy:
  replicas: 3
  update_config:
    parallelism: 1        # One container at a time
    delay: 30s            # Pause between updates
    failure_action: rollback
    monitor: 60s          # Monitor 60s after each update
    order: start-first    # Start new first, then stop old
  rollback_config:
    parallelism: 0        # Roll back all at once
    order: start-first
```

### Blue-Green Deployment

Two identical environments: "blue" (current) and "green" (new):

```
┌──────────────┐     ┌──────────────┐
│  Load Balancer│────►│  Blue (v1)   │  ◄── current production
│              │     │  Port 8080   │
│              │     └──────────────┘
│              │
│              │     ┌──────────────┐
│              │     │  Green (v2)  │  ◄── new version (being tested)
│              │     │  Port 8081   │
│              │     └──────────────┘
└──────────────┘

# After verifying green -- switch traffic:
# Load Balancer ──► Green (v2) [new production]
# Blue (v1) -- keep for quick rollback
```

```yaml
# docker-compose.blue-green.yml
services:
  blue:
    image: myapp:${BLUE_VERSION:-v1.0.0}
    ports:
      - "8080:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  green:
    image: myapp:${GREEN_VERSION:-v1.1.0}
    ports:
      - "8081:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - blue
      - green
```

### Canary Deployment

Route a small fraction of traffic to the new version:

```
┌──────────────┐     ┌──────────────┐
│  Load Balancer│─90%─►│  Stable (v1) │
│              │     └──────────────┘
│              │
│              │─10%─►┌──────────────┐
│              │     │  Canary (v2) │
│              │     └──────────────┘
└──────────────┘

# Monitor canary metrics
# If all OK: 10% ► 30% ► 50% ► 100%
# If errors: 10% ► 0% (rollback)
```

```nginx
# nginx.conf for canary (weighted upstream)
upstream backend {
    server app-stable:3000 weight=9;  # 90% of traffic
    server app-canary:3000 weight=1;  # 10% of traffic
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

---

## Docker in Production

### Production docker-compose.yml

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    image: ghcr.io/myorg/myapp:${APP_VERSION}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      - NODE_ENV=production
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - frontend
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      app:
        condition: service_healthy
    networks:
      - frontend

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

volumes:
  pgdata:
    driver: local

secrets:
  db_password:
    file: ./secrets/db_password.txt

networks:
  frontend:
  backend:
    internal: true  # No internet access
```

### Health Checks

Health checks are a critically important part of production deployment:

```dockerfile
# In Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```typescript
// /health endpoint in the application
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: 'unknown',
    redis: 'unknown',
  }

  try {
    // Check database
    await db.query('SELECT 1')
    checks.database = 'healthy'
  } catch (e) {
    checks.database = 'unhealthy'
  }

  try {
    // Check Redis
    await redis.ping()
    checks.redis = 'healthy'
  } catch (e) {
    checks.redis = 'unhealthy'
  }

  const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy'
  res.status(isHealthy ? 200 : 503).json(checks)
})
```

**Health check types:**

| Type | Description | When to use |
|------|-------------|-------------|
| Liveness | Is the process alive? | Restart a stuck container |
| Readiness | Is it ready to accept traffic? | Don't route traffic before it's ready |
| Startup | Has startup completed? | Long initialization (migrations, cache warm-up) |

### Docker Swarm — basic orchestrator

Docker Swarm is Docker's built-in orchestrator, simpler than Kubernetes:

```bash
# Initialize Swarm
docker swarm init

# Deploy a stack
docker stack deploy -c docker-compose.prod.yml myapp

# Scale
docker service scale myapp_app=5

# Update image
docker service update --image ghcr.io/myorg/myapp:v2.0.0 myapp_app

# Rollback
docker service update --rollback myapp_app

# Monitoring
docker service ls
docker service ps myapp_app
docker service logs myapp_app
```

---

## Monitoring Containers in Production

### Docker Stats

```bash
# Real-time monitoring
docker stats

# CONTAINER   CPU %   MEM USAGE / LIMIT   NET I/O       BLOCK I/O
# app-1       2.5%    150MiB / 512MiB     1.2MB / 500kB  0B / 4kB
# app-2       1.8%    145MiB / 512MiB     1.1MB / 480kB  0B / 3kB
# db          5.2%    256MiB / 1GiB       800kB / 2.1MB  4MB / 12MB
```

### Prometheus + Grafana

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'

volumes:
  prometheus_data:
  grafana_data:
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

---

## Automatic Rollback

### Deploy script with rollback

```bash
#!/bin/bash
# deploy.sh

set -e

NEW_VERSION=$1
OLD_VERSION=$(docker inspect --format='{{.Config.Image}}' myapp_app 2>/dev/null || echo "none")

echo "Deploying $NEW_VERSION (current: $OLD_VERSION)"

# Pull new image
docker pull $NEW_VERSION

# Update service
docker service update --image $NEW_VERSION myapp_app

# Wait for service to stabilize
echo "Waiting for service to stabilize..."
sleep 30

# Check health
HEALTHY=$(curl -sf http://localhost/health | jq -r '.database' 2>/dev/null)

if [ "$HEALTHY" != "healthy" ]; then
  echo "Health check failed! Rolling back to $OLD_VERSION"
  docker service update --rollback myapp_app
  exit 1
fi

echo "Deploy successful!"
```

### GitHub Actions deploy with rollback

```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: push
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            export APP_VERSION=${{ github.sha }}
            cd /app
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            sleep 30
            if ! curl -sf http://localhost/health; then
              echo "Health check failed, rolling back"
              export APP_VERSION=${{ github.event.before }}
              docker compose -f docker-compose.prod.yml up -d
              exit 1
            fi
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: Using latest in CI/CD

❌ **Wrong:**

```yaml
# Which version is deployed? Nobody knows
docker pull myapp:latest
docker service update --image myapp:latest myapp_app
```

✅ **Correct:**

```yaml
# Exact version, reproducible deploy
docker pull myapp:v1.2.3
docker service update --image myapp:v1.2.3 myapp_app
```

### Mistake 2: Secrets in CI configuration

❌ **Wrong:**

```yaml
# NEVER store secrets in code!
env:
  DOCKER_PASSWORD: my-secret-password
  AWS_SECRET_KEY: AKIAIOSFODNN7EXAMPLE
```

✅ **Correct:**

```yaml
# Use CI secrets
env:
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_KEY }}
```

### Mistake 3: No health checks

❌ **Wrong:**

```yaml
# Deploy and hope for the best
services:
  app:
    image: myapp:v1.0.0
    # No healthcheck -- CI doesn't know if the service is alive
```

✅ **Correct:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Mistake 4: No rollback strategy

❌ **Wrong:**

```bash
# "Deploy" with no plan B
docker-compose up -d
# It crashed? Well... git revert and rebuild (20 minutes of downtime)
```

✅ **Correct:**

```bash
# Always keep the previous version
OLD_IMAGE=$(docker inspect --format='{{.Config.Image}}' app)
docker service update --image myapp:v2.0.0 myapp_app

# Automatic rollback on error
if ! curl -sf http://localhost/health; then
  docker service update --image $OLD_IMAGE myapp_app
fi
```

### Mistake 5: Building in production without caching

❌ **Wrong:**

```yaml
# Every build 10+ minutes
steps:
  - run: docker build -t myapp .
```

✅ **Correct:**

```yaml
# 30 seconds with caching
steps:
  - uses: docker/build-push-action@v5
    with:
      cache-from: type=gha
      cache-to: type=gha,mode=max
```

### Mistake 6: No resource limits in production

❌ **Wrong:**

```yaml
# One container can eat all host memory
services:
  app:
    image: myapp:v1.0.0
    # No limits -- OOM killer will kill a random process
```

✅ **Correct:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
```

---

## 💡 Best Practices

### CI/CD

1. **Immutable images** — never modify an image after it's built
2. **One image, many environments** — one image for dev/staging/prod, differences only in configuration
3. **Fast feedback** — lint and unit tests first, long tests later
4. **Branch protection** — main/master always protected, deploy only from main
5. **Automated rollback** — always have a rollback plan

### Tagging

1. **Semver for releases** — `v1.2.3` for production
2. **SHA for tracing** — `sha-abc1234` for commit identification
3. **Never latest in production** — only specific versions
4. **Immutable tags** — don't overwrite existing tags

### Production

1. **Health checks are mandatory** — automatic rollback is impossible without them
2. **Resource limits** — CPU and memory limits for every container
3. **Logging** — centralized logs, don't rely on stdout alone
4. **Secrets** — Docker secrets or external stores (Vault, AWS Secrets Manager)
5. **Monitoring** — Prometheus + Grafana or equivalents
6. **Backup** — automated data backups (volumes)

---

## 📌 Cheat Sheet

```bash
# === CI/CD ===
# GitHub Actions: build and push
docker buildx build --push -t ghcr.io/user/app:v1.0.0 .

# Layer caching
docker buildx build --cache-from=type=gha --cache-to=type=gha,mode=max .

# Multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 .

# === Registry ===
# GHCR authentication
echo $TOKEN | docker login ghcr.io -u USER --password-stdin

# ECR authentication
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URL

# === Deploy ===
# Docker Swarm
docker stack deploy -c docker-compose.prod.yml myapp
docker service update --image app:v2.0.0 myapp_app
docker service update --rollback myapp_app

# Rolling update
docker service update --update-parallelism 1 --update-delay 30s myapp_app

# === Monitoring ===
docker stats
docker service ls
docker service ps myapp_app
docker service logs -f myapp_app
```
