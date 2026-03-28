# Уровень 10: Оптимизация Docker-образов

## 🎯 Проблема: ваш образ весит 1.5 ГБ и собирается 15 минут

Представьте: вы написали простой Node.js API, упаковали его в Docker-образ, запушили в registry. CI/CD пайплайн работает, контейнер запускается. Всё хорошо? Не совсем.

```bash
$ docker images myapp
REPOSITORY  TAG     IMAGE ID       SIZE
myapp       latest  a1b2c3d4e5f6   1.47 GB
```

1.47 ГБ для API, который занимает 50 КБ исходного кода? Каждый деплой скачивает полтора гигабайта. CI/CD собирает образ 15 минут. Контейнер стартует медленно. Registry забит огромными образами.

```bash
# Типичная картина: 5 сервисов по 1+ ГБ
$ docker images
REPOSITORY  TAG     SIZE
api         latest  1.47 GB
worker      latest  1.23 GB
frontend    latest  892 MB
scheduler   latest  1.1 GB
gateway     latest  987 MB
# Итого: ~5.7 ГБ на одном сервере, ещё столько же в registry
```

Оптимизация Docker-образов -- это не cosmetic improvement. Это прямое влияние на:
- **Скорость деплоя** -- меньше данных для скачивания и распаковки
- **Стоимость** -- registry и bandwidth стоят денег
- **Безопасность** -- меньше пакетов = меньше поверхность атаки
- **Время CI/CD** -- быстрая сборка = быстрый feedback loop

---

## 🔥 Анализ размера образов: где прячутся гигабайты

Прежде чем оптимизировать, нужно понять, **что именно** занимает место. Docker предоставляет несколько инструментов для анализа.

### docker image inspect

```bash
# Полная информация об образе
docker image inspect myapp:latest

# Только размер
docker image inspect --format='{{.Size}}' myapp:latest
# 1578432512 (байты)

# Размер в человекочитаемом формате
docker images myapp:latest --format '{{.Repository}}:{{.Tag}} → {{.Size}}'
# myapp:latest → 1.47GB
```

### docker history: послойный анализ

```bash
$ docker history myapp:latest
IMAGE          CREATED       CREATED BY                                      SIZE
a1b2c3d4e5f6   2 mins ago   CMD ["node" "server.js"]                        0B
<missing>      2 mins ago   COPY . /app                                     1.2MB
<missing>      2 mins ago   RUN npm install                                 450MB
<missing>      2 mins ago   COPY package*.json ./                           2KB
<missing>      2 mins ago   WORKDIR /app                                    0B
<missing>      3 weeks ago  /bin/sh -c apt-get update && apt-get install…   350MB
<missing>      3 weeks ago  /bin/sh -c #(nop) CMD ["node"]                  0B
<missing>      3 weeks ago  /bin/sh -c #(nop) ENV NODE_VERSION=20.10.0      0B
<missing>      3 weeks ago  /bin/sh -c groupadd --gid 1000 node...         450MB
```

Сразу видно проблемы:
- Базовый образ: ~800 МБ (полный `node:20`)
- `npm install`: 450 МБ (включая devDependencies)
- `apt-get install`: 350 МБ (зачем в финальном образе?)

```bash
# Более компактный вывод с размерами
docker history --no-trunc --format "table {{.CreatedBy}}\t{{.Size}}" myapp:latest

# Только слои с ненулевым размером
docker history myapp:latest --format '{{.Size}}\t{{.CreatedBy}}' | grep -v "0B"
```

### dive: интерактивный анализ слоёв

[dive](https://github.com/wagoodman/dive) -- TUI-инструмент для детального анализа образов. Показывает каждый слой и изменения файловой системы.

```bash
# Установка
# macOS
brew install dive

# Linux
wget https://github.com/wagoodman/dive/releases/download/v0.12.0/dive_0.12.0_linux_amd64.deb
sudo apt install ./dive_0.12.0_linux_amd64.deb

# Запуск
dive myapp:latest
```

Что показывает dive:
- **Layers** -- каждый слой с размером и командой
- **Current Layer Contents** -- файлы, добавленные/изменённые/удалённые в слое
- **Image efficiency** -- процент "потерянного" пространства
- **Potential wasted space** -- файлы, которые добавлены в одном слое и удалены в другом

```bash
# Автоматический анализ (CI mode)
dive myapp:latest --ci
# Вернёт exit code 1, если образ не проходит проверки эффективности

# Настройка порогов для CI
CI=true dive myapp:latest \
  --highestWastedBytes=50mb \
  --highestUserWastedPercent=0.3 \
  --lowestEfficiency=0.95
```

📌 **Важно:** dive показывает реальную картину -- какие файлы попали в образ и почему. Часто обнаруживаются неожиданности: `.git/` директория, `node_modules` с devDependencies, кэш пакетного менеджера.

### Сравнение размеров базовых образов

```bash
$ docker images --format "table {{.Repository}}:{{.Tag}}\t{{.Size}}" | sort -k2 -h
REPOSITORY:TAG                  SIZE
alpine:3.19                     7.38MB
node:20-alpine                  135MB
node:20-slim                    220MB
python:3.12-alpine              52MB
python:3.12-slim                155MB
node:20                         1.1GB
python:3.12                     1.02GB
ubuntu:22.04                    77.8MB
golang:1.22                     814MB
golang:1.22-alpine              258MB
```

Разница между `node:20` (1.1 ГБ) и `node:20-alpine` (135 МБ) -- **почти 10 раз**!

---

## 🔥 Multi-stage builds: фундамент оптимизации

### Проблема: сборочные зависимости в production-образе

```dockerfile
# ❌ Всё в одном образе
FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install          # devDependencies тоже!
COPY . .
RUN npm run build        # TypeScript компиляция
CMD ["node", "dist/server.js"]

# Результат: 1.4 ГБ
# В образе: TypeScript compiler, webpack, eslint, тесты...
```

### Решение: multi-stage build

Multi-stage build позволяет использовать несколько `FROM` в одном Dockerfile. Каждый `FROM` начинает новый **stage** (этап). Финальный образ содержит только последний stage.

```dockerfile
# ✅ Multi-stage build
# Stage 1: сборка (builder)
FROM node:20 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: production (runner)
FROM node:20-alpine AS runner

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

CMD ["node", "dist/server.js"]

# Результат: ~180 МБ (вместо 1.4 ГБ)
```

### Как это работает

```
Stage 1 (builder):                 Stage 2 (runner):
┌─────────────────────┐           ┌─────────────────────┐
│ node:20 (1.1 GB)    │           │ node:20-alpine      │
│ + npm ci (450 MB)   │  COPY     │ (135 MB)            │
│ + source code       │ ────────> │ + dist/ (500 KB)    │
│ + npm run build     │ --from=   │ + node_modules      │
│ + dist/             │ builder   │   (prod only, 80MB) │
│ TOTAL: ~1.6 GB      │           │ TOTAL: ~180 MB      │
└─────────────────────┘           └─────────────────────┘
        ↓                                  ↓
  НЕ попадает в                    Финальный образ
  финальный образ                  (только это)
```

Docker **отбрасывает** все промежуточные stages после сборки. В финальный образ попадает только последний stage.

### Паттерн builder-runner

Самый распространённый паттерн: два stage -- builder (сборка) и runner (запуск).

**Node.js / TypeScript:**

```dockerfile
# Builder
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production  # Удалить devDependencies

# Runner
FROM node:20-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
USER appuser
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Go:**

```dockerfile
# Builder
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-w -s" -o /app/server ./cmd/server

# Runner -- scratch (пустой образ!)
FROM scratch
COPY --from=builder /app/server /server
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
EXPOSE 8080
ENTRYPOINT ["/server"]
# Результат: 10-15 МБ!
```

**Python:**

```dockerfile
# Builder
FROM python:3.12-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Runner
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY --from=builder /app .
CMD ["python", "main.py"]
```

**Java (Maven):**

```dockerfile
# Builder
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

# Runner
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
# Maven, JDK, исходники -- не попадают в образ
```

### Несколько stages: тесты, линтинг, сборка

```dockerfile
# Stage 1: зависимости
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 2: тесты (опционально)
FROM deps AS test
COPY . .
RUN npm run test

# Stage 3: линтинг (опционально)
FROM deps AS lint
COPY . .
RUN npm run lint

# Stage 4: сборка
FROM deps AS builder
COPY . .
RUN npm run build
RUN npm prune --production

# Stage 5: финальный образ
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

Можно собрать только нужный stage:

```bash
# Собрать только до stage test
docker build --target test -t myapp-test .

# Собрать только до stage lint
docker build --target lint -t myapp-lint .

# Полная сборка (по умолчанию -- последний stage)
docker build -t myapp .
```

### COPY --from с внешними образами

`COPY --from` может копировать не только из предыдущих stages, но и из любых образов:

```dockerfile
# Скопировать nginx конфиг из официального образа
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/nginx.conf

# Скопировать бинарник из другого образа
COPY --from=golang:1.22-alpine /usr/local/go/bin/go /usr/local/bin/go

# Скопировать утилиту из отдельного образа
COPY --from=aquasec/trivy:latest /usr/local/bin/trivy /usr/local/bin/trivy
```

---

## 🔥 Оптимизация слоёв: порядок инструкций и кэширование

### Как работает кэш слоёв

Каждая инструкция в Dockerfile создаёт новый **слой** (layer). Docker кэширует каждый слой и при повторной сборке использует кэш, если:

1. Родительский слой не изменился
2. Инструкция не изменилась
3. Для `COPY`/`ADD` -- файлы не изменились (сравнение по checksum)

```
Dockerfile:          Cache:
┌──────────────┐     ┌──────────────┐
│ FROM node:20 │ ──> │ cached ✅    │
├──────────────┤     ├──────────────┤
│ WORKDIR /app │ ──> │ cached ✅    │
├──────────────┤     ├──────────────┤
│ COPY pkg.json│ ──> │ cached ✅    │ (файл не изменился)
├──────────────┤     ├──────────────┤
│ RUN npm ci   │ ──> │ cached ✅    │ (родитель cached + инструкция та же)
├──────────────┤     ├──────────────┤
│ COPY . .     │ ──> │ MISS ❌      │ (файлы изменились!)
├──────────────┤     ├──────────────┤
│ RUN npm build│ ──> │ rebuild 🔄   │ (родитель не из кэша)
├──────────────┤     ├──────────────┤
│ CMD [...]    │ ──> │ rebuild 🔄   │
└──────────────┘     └──────────────┘
```

**Как только один слой не из кэша -- все последующие слои тоже пересобираются!**

### Правило: редко меняющееся -- сверху, часто -- снизу

```dockerfile
# ❌ Плохой порядок: любое изменение кода → пересборка npm install
FROM node:20-alpine
WORKDIR /app
COPY . .                   # Код меняется часто!
RUN npm install            # Пересобирается каждый раз
RUN npm run build
CMD ["node", "dist/server.js"]
```

```dockerfile
# ✅ Хороший порядок: зависимости кэшируются отдельно от кода
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./   # Меняется редко
RUN npm ci                               # Кэшируется!
COPY . .                                 # Код меняется часто
RUN npm run build                        # Только сборка
CMD ["node", "dist/server.js"]
```

Теперь при изменении кода `npm ci` берётся из кэша (если package.json не менялся).

### Объединение RUN-инструкций

Каждый `RUN` создаёт новый слой. Файлы, удалённые в следующем слое, **всё равно занимают место** в предыдущем!

```dockerfile
# ❌ Три слоя: кэш apt остаётся в первом слое
RUN apt-get update
RUN apt-get install -y curl wget
RUN rm -rf /var/lib/apt/lists/*
# Размер: 150 МБ (кэш APT в первом слое не удалён!)
```

```dockerfile
# ✅ Один слой: кэш удаляется в том же слое
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl wget \
    && rm -rf /var/lib/apt/lists/*
# Размер: 50 МБ
```

📌 **Важно:** Если файл создан в слое N и удалён в слое N+1, он всё равно хранится в слое N. Union filesystem хранит все слои. Удаление "прячет" файл, но не освобождает место.

```dockerfile
# ❌ 100 МБ кэш pip хранится в слое RUN pip install
RUN pip install -r requirements.txt
RUN rm -rf /root/.cache/pip   # Не помогает! Кэш в предыдущем слое

# ✅ Удаление в том же слое
RUN pip install --no-cache-dir -r requirements.txt
```

### Примеры оптимизации порядка слоёв

**Python:**

```dockerfile
# ✅ Зависимости кэшируются отдельно от кода
FROM python:3.12-slim
WORKDIR /app

# Слой 1: системные зависимости (меняется редко)
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Слой 2: Python зависимости (меняется редко)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Слой 3: код (меняется часто)
COPY . .
CMD ["python", "main.py"]
```

**Go:**

```dockerfile
# ✅ go mod download кэшируется отдельно
FROM golang:1.22-alpine
WORKDIR /app

# Слой 1: зависимости (кэшируется пока go.mod/go.sum не меняются)
COPY go.mod go.sum ./
RUN go mod download

# Слой 2: код (меняется часто)
COPY . .
RUN go build -o /app/server ./cmd/server
```

### BuildKit cache mounts

BuildKit предоставляет `--mount=type=cache` для кэширования директорий пакетных менеджеров **между сборками**:

```dockerfile
# syntax=docker/dockerfile:1

# ✅ Кэш npm сохраняется между сборками
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

# ✅ Кэш pip
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install -r requirements.txt
COPY . .

# ✅ Кэш Go модулей
FROM golang:1.22-alpine
WORKDIR /app
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod \
    go mod download
COPY . .
RUN --mount=type=cache,target=/root/.cache/go-build \
    go build -o server .

# ✅ Кэш apt
FROM ubuntu:22.04
RUN --mount=type=cache,target=/var/cache/apt \
    --mount=type=cache,target=/var/lib/apt/lists \
    apt-get update && apt-get install -y curl
```

Cache mount не попадает в слой образа -- кэш хранится отдельно и переиспользуется между сборками.

---

## 🔥 .dockerignore: контроль контекста сборки

### Что такое build context

При команде `docker build .` Docker отправляет **всю директорию** (build context) в Docker daemon. Если в директории лежит `.git/` (200 МБ), `node_modules/` (500 МБ), тестовые данные (1 ГБ) -- всё это будет отправлено.

```bash
$ docker build .
Sending build context to Docker daemon  1.2GB   # <-- Проблема!
```

`.dockerignore` работает аналогично `.gitignore` -- исключает файлы из build context.

### Синтаксис .dockerignore

```dockerignore
# Комментарий

# Файлы и директории
node_modules
.git
.env
dist

# Паттерны с wildcards
*.md
*.log
*.tmp
**/*.test.js
**/*.spec.ts

# Исключения (!) -- включить обратно
*.md
!README.md

# Конкретные файлы
docker-compose.yml
docker-compose.*.yml
Dockerfile
.dockerignore

# Скрытые файлы и директории
.vscode
.idea
.DS_Store
.cache
.npm
.yarn
```

### Рекомендуемый .dockerignore для Node.js

```dockerignore
# Dependencies
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build output (если копируется в multi-stage)
dist
build

# Tests
coverage
**/*.test.ts
**/*.spec.ts
__tests__
jest.config.*

# Version control
.git
.gitignore

# IDE
.vscode
.idea
*.swp
*.swo

# Environment
.env
.env.*
!.env.example

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Documentation
*.md
!README.md

# OS
.DS_Store
Thumbs.db

# CI/CD
.github
.gitlab-ci.yml
.circleci
```

### Рекомендуемый .dockerignore для Python

```dockerignore
# Python
__pycache__
*.pyc
*.pyo
*.egg-info
.eggs
dist
build

# Virtual environment
venv
.venv
env

# Tests
.pytest_cache
htmlcov
.coverage
tests

# IDE
.vscode
.idea

# Git
.git
.gitignore

# Docker
Dockerfile*
docker-compose*.yml
.dockerignore

# Environment
.env
.env.*

# Documentation
*.md
docs
```

### Влияние .dockerignore на размер контекста

```bash
# Без .dockerignore
$ docker build .
Sending build context to Docker daemon  1.2GB
Step 1/8 : FROM node:20-alpine
...
Successfully built a1b2c3d4e5f6
Total build time: 2m 30s

# С правильным .dockerignore
$ docker build .
Sending build context to Docker daemon  45KB
Step 1/8 : FROM node:20-alpine
...
Successfully built f6e5d4c3b2a1
Total build time: 45s
```

📌 **Важно:** `.dockerignore` влияет на **build context**, а не на инструкцию `COPY`. Даже если `COPY` копирует конкретный файл, без `.dockerignore` весь контекст всё равно отправляется в daemon.

---

## 🔥 Выбор базовых образов

### Варианты базовых образов

| Тип | Пример | Размер | Что внутри |
|-----|--------|--------|------------|
| **Full** | `node:20`, `python:3.12` | 800 МБ - 1.1 ГБ | Debian + системные пакеты + runtime |
| **Slim** | `node:20-slim`, `python:3.12-slim` | 150-250 МБ | Debian minimal + runtime |
| **Alpine** | `node:20-alpine`, `python:3.12-alpine` | 50-140 МБ | Alpine Linux + runtime |
| **Distroless** | `gcr.io/distroless/nodejs20` | 120-170 МБ | Только runtime, без shell |
| **Scratch** | `scratch` | 0 МБ | Абсолютно пустой образ |

### Alpine: компактность с оговорками

Alpine Linux использует **musl libc** вместо **glibc**, что может вызвать проблемы:

```dockerfile
# ✅ Alpine отлично подходит для
FROM node:20-alpine     # Node.js
FROM golang:1.22-alpine # Go (статическая компиляция)
FROM nginx:alpine       # Nginx
FROM redis:alpine       # Redis
```

```dockerfile
# ⚠️ Осторожно с Alpine для
FROM python:3.12-alpine
# Многие Python-пакеты с C-расширениями (numpy, pandas, psycopg2)
# требуют компиляции и дополнительных зависимостей в Alpine

RUN apk add --no-cache gcc musl-dev linux-headers
# Может быть проще использовать python:3.12-slim
```

Когда Alpine работает хорошо:
- Node.js приложения
- Go приложения
- Простые Python-приложения без нативных расширений
- Утилиты и CLI-инструменты

Когда лучше slim:
- Python с научными библиотеками (numpy, scipy, pandas)
- Приложения, зависящие от glibc-специфичного поведения
- Когда нужны пакеты, доступные только в apt

### Distroless: минимум для production

[Distroless](https://github.com/GoogleContainerTools/distroless) образы от Google содержат **только runtime** -- нет shell, нет пакетного менеджера, нет утилит.

```dockerfile
# Multi-stage: сборка + distroless
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["dist/server.js"]
# Нельзя docker exec sh -- нет shell!
```

Преимущества distroless:
- Минимальная поверхность атаки (нет shell для эксплуатации)
- Меньше CVE (меньше пакетов)
- Compliance (CIS Docker Benchmark рекомендует)

Недостатки:
- Сложнее отлаживать (нет shell)
- Нет пакетного менеджера
- Иногда нужна `-debug` версия для диагностики

### Scratch: абсолютный минимум

`scratch` -- пустой образ. Идеален для статически скомпилированных бинарников (Go, Rust).

```dockerfile
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -ldflags="-w -s" -o server .

FROM scratch
COPY --from=builder /app/server /server
# SSL сертификаты для HTTPS-запросов
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
# Timezone data
COPY --from=builder /usr/share/zoneinfo /usr/share/zoneinfo
EXPOSE 8080
ENTRYPOINT ["/server"]
# Результат: 10-15 МБ
```

```dockerfile
# Rust
FROM rust:1.75-alpine AS builder
WORKDIR /app
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl

FROM scratch
COPY --from=builder /app/target/x86_64-unknown-linux-musl/release/myapp /myapp
ENTRYPOINT ["/myapp"]
# Результат: 5-20 МБ
```

### Сравнение: один и тот же Go-сервис

```
Базовый образ              Размер финального образа
──────────────────────     ────────────────────────
golang:1.22                820 MB
golang:1.22-alpine         265 MB
ubuntu:22.04 + binary      85 MB
alpine:3.19 + binary       14 MB
gcr.io/distroless/static   9 MB
scratch                    8 MB
```

---

## 🔥 BuildKit: современный движок сборки

### Что такое BuildKit

BuildKit -- это новый backend для `docker build`, который стал дефолтным в Docker 23.0+. Он предоставляет:

- **Параллельную сборку** -- независимые stages собираются одновременно
- **Улучшенное кэширование** -- cache mounts, remote cache
- **Секреты** -- безопасная передача секретов при сборке
- **SSH-агент** -- проброс SSH для приватных репозиториев
- **Heredoc синтаксис** -- многострочные RUN

### Включение BuildKit

```bash
# Переменная окружения (Docker < 23.0)
DOCKER_BUILDKIT=1 docker build -t myapp .

# В Docker 23.0+ BuildKit включён по умолчанию

# Проверить
docker buildx version
```

### Параллельная сборка stages

```dockerfile
# syntax=docker/dockerfile:1

# Эти stages собираются параллельно!
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM golang:1.22-alpine AS backend-builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o server .

# Финальный stage: собирает результаты обоих
FROM alpine:3.19
COPY --from=backend-builder /app/server /server
COPY --from=frontend-builder /app/frontend/dist /static
CMD ["/server"]
```

Без BuildKit stages собираются последовательно. С BuildKit -- `frontend-builder` и `backend-builder` собираются **одновременно**.

### Секреты при сборке

```dockerfile
# syntax=docker/dockerfile:1

# ✅ Секрет доступен только во время RUN, не попадает в слой
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm ci
COPY . .
RUN npm run build
CMD ["node", "dist/server.js"]
```

```bash
# Передача секрета при сборке
docker build --secret id=npmrc,src=$HOME/.npmrc -t myapp .
```

### SSH при сборке

```dockerfile
# syntax=docker/dockerfile:1

FROM alpine AS builder
RUN apk add --no-cache git openssh-client
RUN --mount=type=ssh \
    git clone git@github.com:myorg/private-repo.git /app
```

```bash
docker build --ssh default -t myapp .
```

### Heredoc синтаксис

```dockerfile
# syntax=docker/dockerfile:1

# ✅ Многострочные скрипты без backslash
RUN <<EOF
apt-get update
apt-get install -y curl wget
rm -rf /var/lib/apt/lists/*
EOF

# ✅ Создание файлов inline
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    location / {
        proxy_pass http://app:3000;
    }
}
EOF
```

### Inline cache для CI/CD

```bash
# Экспорт кэша в registry
docker build \
  --cache-to type=registry,ref=myregistry/myapp:cache \
  --cache-from type=registry,ref=myregistry/myapp:cache \
  -t myapp .

# Или в локальную директорию
docker build \
  --cache-to type=local,dest=./cache \
  --cache-from type=local,src=./cache \
  -t myapp .
```

---

## 🔥 Практические приёмы уменьшения размера

### 1. npm ci вместо npm install

```dockerfile
# ❌ npm install может обновить lock-файл
RUN npm install

# ✅ npm ci строго следует package-lock.json
RUN npm ci

# ✅ Только production зависимости
RUN npm ci --only=production
# или
RUN npm ci --omit=dev
```

### 2. Флаги компиляции для Go

```dockerfile
# ❌ Без оптимизации: 25 МБ бинарник
RUN go build -o server .

# ✅ С оптимизацией: 10 МБ бинарник
RUN CGO_ENABLED=0 GOOS=linux \
    go build -ldflags="-w -s" -o server .
# -w : убрать DWARF debug info
# -s : убрать symbol table
# CGO_ENABLED=0 : статическая линковка (не нужен libc)
```

### 3. --no-install-recommends для apt

```dockerfile
# ❌ Ставит рекомендуемые пакеты (не нужны)
RUN apt-get update && apt-get install -y python3

# ✅ Только основные зависимости
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 \
    && rm -rf /var/lib/apt/lists/*
```

### 4. --no-cache для apk (Alpine)

```dockerfile
# ❌ Кэш индекса остаётся
RUN apk update && apk add curl

# ✅ Без кэша
RUN apk add --no-cache curl
```

### 5. Удаление кэшей пакетных менеджеров

```dockerfile
# Python
RUN pip install --no-cache-dir -r requirements.txt

# Node.js (npm ci автоматически чистит кэш)
RUN npm ci && npm cache clean --force

# Ruby
RUN bundle install --without development test \
    && rm -rf /usr/local/bundle/cache/*.gem

# Java (Maven)
RUN mvn package -DskipTests \
    && rm -rf ~/.m2/repository
```

### 6. Минимизация количества слоёв

```dockerfile
# ❌ 6 слоёв
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN curl -fsSL https://example.com/install.sh | bash
RUN rm -rf /var/lib/apt/lists/*
RUN rm -rf /tmp/*

# ✅ 1 слой
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl wget \
    && curl -fsSL https://example.com/install.sh | bash \
    && rm -rf /var/lib/apt/lists/* /tmp/*
```

### 7. Использование .dockerignore (напоминание)

```bash
# Без .dockerignore: context = 800 МБ
$ du -sh node_modules .git
500M    node_modules
280M    .git

# С .dockerignore: context = 50 КБ
# node_modules и .git исключены
```

---

## 🔥 Squash и экспериментальные возможности

### --squash (устарело)

Флаг `--squash` объединял все слои в один. В Docker 25+ он удалён. Вместо этого используйте multi-stage builds для достижения того же эффекта.

```bash
# ❌ Устарело / удалено
docker build --squash -t myapp .

# ✅ Используйте multi-stage build
# Финальный stage содержит только нужные файлы
```

### docker buildx

`docker buildx` -- расширенная версия `docker build` с поддержкой BuildKit:

```bash
# Создание builder
docker buildx create --name mybuilder --use

# Мультиплатформенная сборка
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t myapp:latest \
  --push .

# Сборка с выводом типа
docker buildx build --output type=local,dest=./output .
docker buildx build --output type=tar,dest=./image.tar .
```

---

## ⚠️ Частые ошибки новичков

### 🐛 1. COPY . . перед npm install

```dockerfile
# ❌ Любое изменение кода инвалидирует кэш npm install
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
```

> **Почему это ошибка:** `COPY . .` копирует весь код. При любом изменении файла кэш этого слоя инвалидируется, и `npm install` пересобирается заново (минуты).

```dockerfile
# ✅ Сначала зависимости, потом код
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
CMD ["node", "server.js"]
```

### 🐛 2. Использование полного базового образа в production

```dockerfile
# ❌ node:20 = 1.1 ГБ базовый образ
FROM node:20
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "server.js"]
# Итого: ~1.6 ГБ
```

> **Почему это ошибка:** Полный образ содержит build tools, Python, gcc и другие инструменты, которые не нужны для запуска Node.js приложения.

```dockerfile
# ✅ node:20-alpine = 135 МБ
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "server.js"]
# Итого: ~180 МБ
```

### 🐛 3. Файлы удалены в отдельном слое

```dockerfile
# ❌ tar.gz остаётся в слое RUN wget
RUN wget https://example.com/big-file.tar.gz
RUN tar xzf big-file.tar.gz
RUN rm big-file.tar.gz
# 3 слоя, big-file.tar.gz хранится в первом!
```

> **Почему это ошибка:** Union filesystem хранит каждый слой. Удаление файла в следующем слое только "прячет" его, но не освобождает место.

```dockerfile
# ✅ Скачивание, распаковка и удаление в одном слое
RUN wget https://example.com/big-file.tar.gz \
    && tar xzf big-file.tar.gz \
    && rm big-file.tar.gz
```

### 🐛 4. Нет .dockerignore

```bash
# ❌ Без .dockerignore: весь контекст отправляется в daemon
$ docker build .
Sending build context to Docker daemon  1.5GB   # node_modules + .git + ...
```

> **Почему это ошибка:** Docker отправляет весь build context в daemon перед сборкой. Без `.dockerignore` это включает `node_modules/`, `.git/`, тестовые данные и прочее.

```dockerignore
# ✅ .dockerignore
node_modules
.git
*.md
.env
dist
coverage
```

### 🐛 5. DevDependencies в production-образе

```dockerfile
# ❌ npm install ставит ВСЕ зависимости
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
# node_modules содержит typescript, eslint, jest...
```

> **Почему это ошибка:** DevDependencies увеличивают размер образа и поверхность атаки. TypeScript compiler, ESLint, Jest -- не нужны в production.

```dockerfile
# ✅ Только production зависимости
RUN npm ci --omit=dev

# ✅ Или multi-stage: prune после сборки
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
```

---

## 💡 Best practices

### 1. Используйте multi-stage builds

```dockerfile
# ✅ Разделяйте сборку и запуск
FROM node:20 AS builder
# ... сборка ...

FROM node:20-alpine
# ... только runtime
```

### 2. Выбирайте минимальный базовый образ

```
Для Node.js: node:20-alpine (или distroless)
Для Python: python:3.12-slim (alpine для простых приложений)
Для Go: scratch или distroless/static
Для Java: eclipse-temurin:21-jre-alpine
```

### 3. Оптимизируйте порядок слоёв для кэширования

```dockerfile
# ✅ Редко меняющееся → сверху, часто → снизу
COPY package.json package-lock.json ./   # Меняется редко
RUN npm ci                               # Кэшируется
COPY . .                                 # Меняется часто
```

### 4. Объединяйте RUN и чистите кэши

```dockerfile
# ✅ Один слой, очистка в конце
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
```

### 5. Всегда используйте .dockerignore

```dockerignore
# ✅ Исключайте всё, что не нужно для сборки
node_modules
.git
*.md
.env
coverage
```

### 6. Анализируйте образы перед деплоем

```bash
# ✅ Проверяйте размер и слои
docker images myapp
docker history myapp
dive myapp  # Если установлен
```

### 7. Используйте BuildKit cache mounts

```dockerfile
# ✅ Кэш пакетных менеджеров между сборками
RUN --mount=type=cache,target=/root/.npm npm ci
```

### 8. Тегируйте конкретные версии базовых образов

```dockerfile
# ❌ Непредсказуемо
FROM node:latest

# ✅ Фиксированная версия
FROM node:20.11.1-alpine3.19
```

---

## 📌 Итоги

- ✅ **docker history** и **dive** -- основные инструменты анализа размера образов
- ✅ **Multi-stage builds** -- разделение сборки и runtime, сокращение размера в 5-10 раз
- ✅ **Паттерн builder-runner** -- builder собирает, runner запускает
- ✅ **Порядок слоёв** -- редко меняющееся сверху, часто снизу
- ✅ **Объединение RUN** -- удаление файлов в том же слое, где они создаются
- ✅ **Cache mounts** -- `--mount=type=cache` для кэша пакетных менеджеров
- ✅ **.dockerignore** -- исключение node_modules, .git, тестов из build context
- ✅ **Базовые образы**: alpine (компактный), slim (совместимый), distroless (безопасный), scratch (минимальный)
- ✅ **BuildKit** -- параллельная сборка, секреты, SSH, heredoc, remote cache
- ✅ **Практические приёмы**: npm ci, --no-install-recommends, --no-cache-dir, -ldflags="-w -s"
- ✅ **Конкретные версии** базовых образов вместо `latest`
- ✅ Анализируйте образы (history, dive) перед деплоем
