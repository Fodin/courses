# Уровень 12: CI/CD с Docker

## 🎯 Проблема: ручная сборка и деплой — путь к хаосу

Многие команды до сих пор собирают Docker-образы вручную на машине разработчика и деплоят через `docker-compose up -d` по SSH. Это работает для pet-проектов, но в продакшене приводит к катастрофам.

```bash
# Типичный "деплой" в маленькой команде
$ ssh production-server
$ cd /app
$ git pull
$ docker-compose build
$ docker-compose up -d
# "Ну вроде работает..."

# А через час:
# - Продакшен упал, потому что забыли запустить миграции
# - Образ собран с dev-зависимостями
# - Никто не знает, какая версия кода сейчас в проде
# - Откат? Какой откат? git log и молитва
```

Проблемы ручного процесса:

```mermaid
flowchart TD
    subgraph manual["Ручной деплой"]
        D["Разработчик"] --> GP["git push"]
        GP --> SSH["SSH на сервер"]
        SSH --> BUILD["build"]

        D --> HF["Человеческий фактор"]
        HF --> E1["Забыл запустить тесты"]
        HF --> E2["Собрал не ту ветку"]
        HF --> E3["Не обновил .env"]
        HF --> E4["Забыл про миграции"]
        HF --> E5["Нет rollback-плана"]

        E1 & E2 & E3 & E4 & E5 --> PROBLEM["ПРОБЛЕМА"]
        BUILD --> DOWNTIME["DOWNTIME"]
    end

    style PROBLEM fill:#f8d7da,stroke:#dc3545
    style DOWNTIME fill:#f8d7da,stroke:#dc3545
    style HF fill:#fff3cd,stroke:#ffc107
    style manual fill:#fff5f5,stroke:#dc3545
```

CI/CD (Continuous Integration / Continuous Delivery) автоматизирует весь путь от коммита до продакшена, убирая человеческий фактор:

```mermaid
flowchart LR
    GP["git push"] --> CI["CI Build<br>(Dockerfile,<br>lint, scan)"]
    CI --> T["Tests<br>(unit, e2e,<br>integration)"]
    T --> PI["Push Image<br>(Registry:<br>GHCR, ECR)"]
    PI --> CD["CD Deploy<br>(k8s, swarm)"]

    CI --> R1["Автоматически<br>воспроизводимо"]
    T --> R2["Гарантия<br>качества"]
    PI --> R3["Версионный<br>контроль образов"]
    CD --> R4["Безопасный<br>rollback"]

    style GP fill:#e3f2fd,stroke:#1976d2
    style CI fill:#e8f5e9,stroke:#388e3c
    style T fill:#e8f5e9,stroke:#388e3c
    style PI fill:#e8f5e9,stroke:#388e3c
    style CD fill:#e8f5e9,stroke:#388e3c
    style R1 fill:#f3e5f5,stroke:#7b1fa2
    style R2 fill:#f3e5f5,stroke:#7b1fa2
    style R3 fill:#f3e5f5,stroke:#7b1fa2
    style R4 fill:#f3e5f5,stroke:#7b1fa2
```

В этом уровне мы разберём:
- Основы CI/CD и стадии пайплайна
- Docker в CI: сборка, кэширование, тестирование
- GitHub Actions и GitLab CI для Docker
- Container Registry: Docker Hub, GHCR, ECR, ACR
- Стратегии тегирования образов
- Деплой-стратегии: rolling update, blue-green, canary
- Мониторинг и health checks в production

---

## Основы CI/CD

### Что такое CI/CD?

**CI (Continuous Integration)** — автоматическая сборка и тестирование кода при каждом коммите. Цель — раннее обнаружение ошибок.

**CD (Continuous Delivery)** — автоматическая доставка протестированного кода в production (или staging). Код всегда готов к выпуску.

**CD (Continuous Deployment)** — полная автоматизация: каждый коммит, прошедший тесты, автоматически деплоится в production.

```mermaid
flowchart LR
    subgraph CI["CI"]
        P["Push"] --> B["Build"]
        B --> T["Test"]
        T --> L["Lint"]
    end
    subgraph CDel["CD (Delivery)"]
        SD["Staging Deploy"]
        SD --> MA["Manual Approval"]
        MA --> PD["Production Deploy"]
    end
    subgraph CDep["CD (Deployment)"]
        AP["Auto Production<br>Deploy<br>(no approval)"]
    end
    CI --> CDel --> CDep
```

### Стадии CI/CD пайплайна для Docker

Типичный пайплайн для Docker-приложения:

```yaml
# Стадии пайплайна
stages:
  - lint        # Проверка кода и Dockerfile
  - build       # Сборка Docker-образа
  - test        # Запуск тестов внутри контейнера
  - scan        # Сканирование образа на уязвимости
  - push        # Отправка образа в Registry
  - deploy      # Деплой в staging/production
  - verify      # Smoke-тесты после деплоя
```

Каждая стадия может прерывать пайплайн при ошибке, предотвращая выкатку сломанного кода.

---

## Docker в CI: сборка образов

### Сборка образа в CI-среде

В CI-среде Docker-образ собирается автоматически. Ключевые особенности:

```dockerfile
# Dockerfile для CI-сборки
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем только package-файлы для кэширования зависимостей
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Метаданные для трейсинга (CI добавит)
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

### Кэширование слоёв в CI

Одна из главных проблем Docker в CI — **потеря кэша между сборками**. Каждый CI-раннер стартует с чистого окружения.

```bash
# Без кэширования: каждая сборка скачивает все зависимости заново
# Сборка: 5-10 минут

# С кэшированием через registry
docker buildx build \
  --cache-from=type=registry,ref=myregistry.io/myapp:cache \
  --cache-to=type=registry,ref=myregistry.io/myapp:cache,mode=max \
  -t myapp:latest .
# Сборка: 30 секунд (если зависимости не изменились)
```

**Виды кэша:**

| Тип кэша | Описание | Плюсы | Минусы |
|-----------|----------|-------|--------|
| `type=local` | Кэш в локальной директории | Быстрый доступ | Не shared между раннерами |
| `type=registry` | Кэш в Container Registry | Shared для всех раннеров | Сетевые задержки |
| `type=gha` | GitHub Actions Cache | Нативная интеграция | Только для GitHub |
| `type=s3` | Кэш в S3/MinIO | Гибкий, shared | Нужна настройка |

```bash
# GitHub Actions Cache
docker buildx build \
  --cache-from=type=gha \
  --cache-to=type=gha,mode=max \
  -t myapp:latest .

# Локальный кэш (для self-hosted раннеров)
docker buildx build \
  --cache-from=type=local,src=/tmp/.buildx-cache \
  --cache-to=type=local,dest=/tmp/.buildx-cache-new,mode=max \
  -t myapp:latest .
```

📌 **mode=max** кэширует все слои (включая промежуточные), а не только финальный. Это значительно ускоряет пересборку.

---

## GitHub Actions: CI/CD для Docker

### Базовый workflow

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

Для мультиплатформенных образов или нескольких версий:

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

### Тестирование с Docker Compose в CI

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

## GitLab CI: Docker в пайплайнах

### Базовый .gitlab-ci.yml

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

### Kaniko — сборка без Docker daemon

Docker-in-Docker требует привилегированного режима, что небезопасно. **Kaniko** собирает образы без Docker daemon:

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

💡 **Когда использовать Kaniko:** в кластерах Kubernetes, где нельзя запускать Docker daemon, или когда требуется повышенная безопасность CI.

---

## Container Registries

### Обзор популярных реестров

| Registry | Провайдер | Бесплатный план | Особенности |
|----------|----------|-----------------|-------------|
| Docker Hub | Docker | 1 приватный репо | Самый популярный, rate limits |
| GHCR | GitHub | Безлимитно для public | Интеграция с GitHub |
| ECR | AWS | 500 MB free tier | Интеграция с ECS/EKS |
| ACR | Azure | Basic tier | Интеграция с AKS |
| GCR / Artifact Registry | Google | 500 MB free | Интеграция с GKE |
| Harbor | Self-hosted | Бесплатно | Полный контроль, RBAC |

### Работа с GHCR (GitHub Container Registry)

```bash
# Авторизация
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Тегирование и push
docker tag myapp:latest ghcr.io/username/myapp:v1.0.0
docker push ghcr.io/username/myapp:v1.0.0

# Pull
docker pull ghcr.io/username/myapp:v1.0.0
```

### Работа с AWS ECR

```bash
# Авторизация (токен действует 12 часов)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Создание репозитория
aws ecr create-repository --repository-name myapp --region us-east-1

# Push
docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0

# Lifecycle policy (автоочистка старых образов)
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

### Безопасность Registry

```bash
# Сканирование образа перед push
docker scout cves myapp:latest

# Подпись образа (cosign)
cosign sign --key cosign.key ghcr.io/username/myapp:v1.0.0

# Верификация подписи при pull
cosign verify --key cosign.pub ghcr.io/username/myapp:v1.0.0
```

---

## Стратегии тегирования образов

Правильное тегирование -- основа воспроизводимости и отката.

### Стратегии тегов

```bash
# 1. Semantic Versioning (для релизов)
myapp:1.0.0          # Полная версия
myapp:1.0             # Major.minor (latest patch)
myapp:1               # Major (latest minor.patch)

# 2. Git SHA (для точной идентификации)
myapp:sha-a1b2c3d    # Первые 7 символов коммита
myapp:main-a1b2c3d   # Ветка + SHA

# 3. Branch name (для dev/staging)
myapp:main            # Последняя сборка main
myapp:develop         # Последняя сборка develop
myapp:feature-auth    # Feature branch

# 4. Timestamp (для сортировки)
myapp:20240315-143022 # Дата и время сборки
myapp:main-20240315   # Ветка + дата

# 5. Build number (для CI)
myapp:build-1234      # Номер сборки CI
```

### ❌ Почему `latest` — плохая практика

```bash
# Никогда не используйте latest в production!
docker pull myapp:latest
# Проблемы:
# 1. Какая версия кода? Неизвестно
# 2. Откат? Невозможно
# 3. Воспроизводимость? Нет
# 4. Кэширование? Непредсказуемое

# latest можно использовать только для:
# - Локальной разработки
# - Quick start в README
```

### Автоматическое тегирование в GitHub Actions

```yaml
# docker/metadata-action автоматически генерирует теги
- name: Docker meta
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/username/myapp
    tags: |
      # На push в main: main, sha-abc1234
      type=ref,event=branch
      type=sha

      # На создание тега v1.2.3: 1.2.3, 1.2, 1, latest
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=semver,pattern={{major}}

      # На PR: pr-42
      type=ref,event=pr

      # Всегда: дата сборки
      type=raw,value={{date 'YYYYMMDD-HHmmss'}}
```

---

## Тестирование с Docker в CI

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

### Паттерн "Testcontainers"

Для сложных интеграционных тестов можно поднимать сервисы прямо из тестов:

```typescript
// Пример: тест с реальной БД
import { PostgreSqlContainer } from '@testcontainers/postgresql'

describe('User Repository', () => {
  let container: StartedPostgreSqlContainer

  beforeAll(async () => {
    container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .start()
    // Подключение к реальной БД
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

## Деплой-стратегии

### Rolling Update

Постепенная замена старых контейнеров новыми:

```mermaid
gantt
    title Rolling Update
    dateFormat X
    axisFormat %s

    section Реплика 1
    v1 :done, r1v1, 0, 2
    v2 :active, r1v2, 2, 5

    section Реплика 2
    v1 :done, r2v1, 0, 3
    v2 :active, r2v2, 3, 5

    section Реплика 3
    v1 :done, r3v1, 0, 4
    v2 :active, r3v2, 4, 5
```

```yaml
# Docker Swarm rolling update
deploy:
  replicas: 3
  update_config:
    parallelism: 1        # По одному контейнеру
    delay: 30s            # Пауза между обновлениями
    failure_action: rollback
    monitor: 60s          # Мониторить 60с после каждого обновления
    order: start-first    # Сначала запустить новый, потом остановить старый
  rollback_config:
    parallelism: 0        # Откатить все сразу
    order: start-first
```

### Blue-Green Deployment

Два идентичных окружения: "синее" (текущее) и "зелёное" (новое):

```mermaid
flowchart LR
    LB["Load Balancer"]
    LB -->|"трафик"| Blue["Blue (v1)<br>Port 8080<br>текущий production"]
    LB -.->|"тестируется"| Green["Green (v2)<br>Port 8081<br>новая версия"]

    Green -->|"После проверки:<br>переключаем трафик"| LB2["Load Balancer"]
    LB2 -->|"трафик"| Green2["Green (v2)<br>новый production"]
    Blue2["Blue (v1)<br>быстрый rollback"] -.-> LB2

    style Blue fill:#bbdefb,stroke:#1976d2
    style Green fill:#c8e6c9,stroke:#388e3c
    style Green2 fill:#c8e6c9,stroke:#388e3c
    style Blue2 fill:#bbdefb,stroke:#1976d2
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

Направляем малую часть трафика на новую версию:

```mermaid
flowchart LR
    LB["Load Balancer"]
    LB -->|"90% трафика"| Stable["Stable (v1)"]
    LB -->|"10% трафика"| Canary["Canary (v2)"]

    Canary --> Monitor{"Мониторинг метрик"}
    Monitor -->|"OK"| Scale["10% -> 30% -> 50% -> 100%"]
    Monitor -->|"Ошибки"| Rollback["10% -> 0% (rollback)"]

    style Stable fill:#d4edda,stroke:#28a745
    style Canary fill:#fff3cd,stroke:#ffc107
    style Scale fill:#d4edda,stroke:#28a745
    style Rollback fill:#f8d7da,stroke:#dc3545
```

```nginx
# nginx.conf для canary (weighted upstream)
upstream backend {
    server app-stable:3000 weight=9;  # 90% трафика
    server app-canary:3000 weight=1;  # 10% трафика
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

---

## Docker в Production

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
    internal: true  # Нет доступа к интернету
```

### Health Checks

Health checks -- критически важная часть production-деплоя:

```dockerfile
# В Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

```typescript
// Эндпоинт /health в приложении
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: 'unknown',
    redis: 'unknown',
  }

  try {
    // Проверяем БД
    await db.query('SELECT 1')
    checks.database = 'healthy'
  } catch (e) {
    checks.database = 'unhealthy'
  }

  try {
    // Проверяем Redis
    await redis.ping()
    checks.redis = 'healthy'
  } catch (e) {
    checks.redis = 'unhealthy'
  }

  const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy'
  res.status(isHealthy ? 200 : 503).json(checks)
})
```

**Типы health checks:**

| Тип | Описание | Когда использовать |
|-----|----------|-------------------|
| Liveness | Жив ли процесс? | Перезапуск зависшего контейнера |
| Readiness | Готов ли принимать трафик? | Не направлять трафик до готовности |
| Startup | Завершился ли запуск? | Длительная инициализация (миграции, прогрев кэша) |

### Docker Swarm — базовый оркестратор

Docker Swarm — встроенный в Docker оркестратор, проще Kubernetes:

```bash
# Инициализация Swarm
docker swarm init

# Деплой стека
docker stack deploy -c docker-compose.prod.yml myapp

# Масштабирование
docker service scale myapp_app=5

# Обновление образа
docker service update --image ghcr.io/myorg/myapp:v2.0.0 myapp_app

# Откат
docker service update --rollback myapp_app

# Мониторинг
docker service ls
docker service ps myapp_app
docker service logs myapp_app
```

---

## Мониторинг контейнеров в Production

### Docker Stats

```bash
# Мониторинг в реальном времени
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

## Автоматический Rollback

### Скрипт деплоя с rollback

```bash
#!/bin/bash
# deploy.sh

set -e

NEW_VERSION=$1
OLD_VERSION=$(docker inspect --format='{{.Config.Image}}' myapp_app 2>/dev/null || echo "none")

echo "Deploying $NEW_VERSION (current: $OLD_VERSION)"

# Pull новый образ
docker pull $NEW_VERSION

# Обновляем сервис
docker service update --image $NEW_VERSION myapp_app

# Ждём, пока сервис станет стабильным
echo "Waiting for service to stabilize..."
sleep 30

# Проверяем health
HEALTHY=$(curl -sf http://localhost/health | jq -r '.database' 2>/dev/null)

if [ "$HEALTHY" != "healthy" ]; then
  echo "Health check failed! Rolling back to $OLD_VERSION"
  docker service update --rollback myapp_app
  exit 1
fi

echo "Deploy successful!"
```

### GitHub Actions деплой с rollback

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

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Использование latest в CI/CD

❌ **Неправильно:**

```yaml
# Какая версия задеплоена? Никто не знает
docker pull myapp:latest
docker service update --image myapp:latest myapp_app
```

✅ **Правильно:**

```yaml
# Точная версия, воспроизводимый деплой
docker pull myapp:v1.2.3
docker service update --image myapp:v1.2.3 myapp_app
```

### Ошибка 2: Секреты в CI-конфигурации

❌ **Неправильно:**

```yaml
# НИКОГДА не храните секреты в коде!
env:
  DOCKER_PASSWORD: my-secret-password
  AWS_SECRET_KEY: AKIAIOSFODNN7EXAMPLE
```

✅ **Правильно:**

```yaml
# Используйте CI secrets
env:
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_KEY }}
```

### Ошибка 3: Нет health checks

❌ **Неправильно:**

```yaml
# Деплоим и надеемся на лучшее
services:
  app:
    image: myapp:v1.0.0
    # Нет healthcheck -- CI не знает, жив ли сервис
```

✅ **Правильно:**

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

### Ошибка 4: Нет стратегии отката

❌ **Неправильно:**

```bash
# "Деплой" без плана B
docker-compose up -d
# Упало? Ну... git revert и пересобираем (20 минут downtime)
```

✅ **Правильно:**

```bash
# Всегда храним предыдущую версию
OLD_IMAGE=$(docker inspect --format='{{.Config.Image}}' app)
docker service update --image myapp:v2.0.0 myapp_app

# Автоматический rollback при ошибке
if ! curl -sf http://localhost/health; then
  docker service update --image $OLD_IMAGE myapp_app
fi
```

### Ошибка 5: Сборка в production без кэширования

❌ **Неправильно:**

```yaml
# Каждая сборка 10+ минут
steps:
  - run: docker build -t myapp .
```

✅ **Правильно:**

```yaml
# 30 секунд с кэшированием
steps:
  - uses: docker/build-push-action@v5
    with:
      cache-from: type=gha
      cache-to: type=gha,mode=max
```

### Ошибка 6: Нет лимитов ресурсов в production

❌ **Неправильно:**

```yaml
# Один контейнер может съесть всю память хоста
services:
  app:
    image: myapp:v1.0.0
    # Без лимитов -- OOM killer убьёт случайный процесс
```

✅ **Правильно:**

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

## 💡 Лучшие практики

### CI/CD

1. **Immutable images** — никогда не модифицируйте образ после сборки
2. **One image, many environments** — один образ для dev/staging/prod, отличия только в конфигурации
3. **Fast feedback** — lint и unit-тесты первыми, долгие тесты -- позже
4. **Branch protection** — main/master всегда защищены, деплой только из main
5. **Automated rollback** — всегда имейте план отката

### Тегирование

1. **Semver для релизов** — `v1.2.3` для production
2. **SHA для трейсинга** — `sha-abc1234` для идентификации коммита
3. **Никогда latest в production** — только конкретные версии
4. **Immutable tags** — не перезаписывайте существующие теги

### Production

1. **Health checks обязательны** — без них невозможен автоматический rollback
2. **Лимиты ресурсов** — CPU и memory limits для каждого контейнера
3. **Логирование** — централизованные логи, не полагайтесь на stdout
4. **Секреты** — Docker secrets или внешние хранилища (Vault, AWS Secrets Manager)
5. **Мониторинг** — Prometheus + Grafana или аналоги
6. **Backup** — автоматические бэкапы данных (volumes)

---

## 📌 Шпаргалка

```bash
# === CI/CD ===
# GitHub Actions: сборка и push
docker buildx build --push -t ghcr.io/user/app:v1.0.0 .

# Кэширование слоёв
docker buildx build --cache-from=type=gha --cache-to=type=gha,mode=max .

# Мультиплатформенная сборка
docker buildx build --platform linux/amd64,linux/arm64 .

# === Registry ===
# GHCR авторизация
echo $TOKEN | docker login ghcr.io -u USER --password-stdin

# ECR авторизация
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URL

# === Деплой ===
# Docker Swarm
docker stack deploy -c docker-compose.prod.yml myapp
docker service update --image app:v2.0.0 myapp_app
docker service update --rollback myapp_app

# Rolling update
docker service update --update-parallelism 1 --update-delay 30s myapp_app

# === Мониторинг ===
docker stats
docker service ls
docker service ps myapp_app
docker service logs -f myapp_app
```
