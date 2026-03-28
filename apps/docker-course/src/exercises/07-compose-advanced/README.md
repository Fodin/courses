# Уровень 7: Docker Compose -- продвинутое использование

## 🎯 Проблема: сервисы стартуют в неправильном порядке

В предыдущем уровне мы научились описывать сервисы в `docker-compose.yml`. Но что происходит, когда мы запускаем `docker compose up`?

```bash
docker compose up -d
# [+] Running 3/3
#  ✔ Container myapp-db-1    Started  0.3s
#  ✔ Container myapp-api-1   Started  0.4s  # API стартует раньше, чем БД готова!
#  ✔ Container myapp-redis-1 Started  0.3s
```

API-сервер стартовал, но PostgreSQL ещё не готов принимать подключения. Результат -- ошибка при первом запросе к базе:

```
api-1  | Error: connect ECONNREFUSED 172.18.0.3:5432
api-1  | PostgreSQL is not ready yet...
```

Простая форма `depends_on` гарантирует только **порядок запуска контейнеров**, но не ждёт, пока сервис реально станет готовым. Для надёжной оркестрации нужны **healthcheck** и **условия зависимости**.

---

## 🔥 depends_on: управление порядком запуска

### Простая форма (список)

```yaml
services:
  api:
    build: ./api
    depends_on:
      - db
      - redis
    # Compose запустит db и redis ПЕРЕД api
    # Но НЕ дождётся их готовности!

  db:
    image: postgres:16

  redis:
    image: redis:7-alpine
```

Простая форма `depends_on` гарантирует:
- `db` и `redis` запустятся **раньше** `api`
- При `docker compose down` порядок будет обратным: `api` остановится первым

Но она **не гарантирует**, что PostgreSQL уже принимает подключения.

### Расширенная форма (с условиями)

```yaml
services:
  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy    # Ждать, пока healthcheck пройдёт
      redis:
        condition: service_started    # Достаточно, что контейнер запущен
      migrations:
        condition: service_completed_successfully  # Ждать успешного завершения

  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

  redis:
    image: redis:7-alpine

  migrations:
    build: ./api
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy
```

### Три условия depends_on

| Условие | Что означает | Когда использовать |
|---------|-------------|-------------------|
| `service_started` | Контейнер запущен | Для сервисов без healthcheck |
| `service_healthy` | Healthcheck проходит | Для БД, очередей, любых сервисов с healthcheck |
| `service_completed_successfully` | Контейнер завершился с кодом 0 | Для миграций, init-скриптов, seed-данных |

📌 **`service_healthy` требует**, чтобы у сервиса был определён `healthcheck`. Без него Compose выдаст ошибку.

---

## 🔥 healthcheck: проверка готовности сервиса

### Синтаксис healthcheck

```yaml
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s       # Интервал между проверками
      timeout: 5s         # Таймаут одной проверки
      retries: 5          # Количество неудачных попыток до unhealthy
      start_period: 30s   # Время на запуск (проверки не считаются неудачными)
      start_interval: 2s  # Интервал проверок в start_period (Compose 2.20+)
```

### Форматы команды test

```yaml
# CMD-SHELL -- выполняет команду через shell
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  # Эквивалент: /bin/sh -c "pg_isready -U postgres"

# CMD -- выполняет команду напрямую (без shell)
healthcheck:
  test: ['CMD', 'pg_isready', '-U', 'postgres']

# Строковый формат (автоматически через shell)
healthcheck:
  test: pg_isready -U postgres
```

### Примеры healthcheck для популярных сервисов

```yaml
# PostgreSQL
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 5s
  timeout: 3s
  retries: 5

# MySQL
healthcheck:
  test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
  interval: 10s
  timeout: 5s
  retries: 3

# Redis
healthcheck:
  test: ['CMD', 'redis-cli', 'ping']
  interval: 5s
  timeout: 3s
  retries: 5

# HTTP-сервис (curl)
healthcheck:
  test: ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3

# HTTP-сервис (wget, для Alpine-образов без curl)
healthcheck:
  test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3

# MongoDB
healthcheck:
  test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
  interval: 10s
  timeout: 5s
  retries: 3

# RabbitMQ
healthcheck:
  test: ['CMD-SHELL', 'rabbitmq-diagnostics -q ping']
  interval: 15s
  timeout: 10s
  retries: 3
```

### Проверка статуса healthcheck

```bash
# Посмотреть статус здоровья контейнеров
docker compose ps
# NAME          SERVICE  STATUS                  PORTS
# myapp-db-1    db       running (healthy)       5432/tcp
# myapp-api-1   api      running (starting)      0.0.0.0:3000->3000/tcp
# myapp-redis-1 redis    running                 6379/tcp

# Подробная информация о healthcheck
docker inspect --format='{{json .State.Health}}' myapp-db-1
```

---

## 🔥 Реальный многосервисный стек: Web + DB + Cache

### Полный пример production-ready конфигурации

```yaml
services:
  # ---- Инфраструктура ----
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USER:-postgres}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres} -d ${DB_NAME:-myapp}']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s
    ports:
      - '127.0.0.1:5432:5432'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    command: redis-server --appendonly yes --maxmemory 256mb --maxmemory-policy allkeys-lru
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # ---- Миграции (одноразовый сервис) ----
  migrations:
    build:
      context: ./api
      target: migrations
    environment:
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@db:5432/${DB_NAME:-myapp}
    depends_on:
      db:
        condition: service_healthy
    restart: 'no'

  # ---- Backend ----
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER:-postgres}:${DB_PASSWORD}@db:5432/${DB_NAME:-myapp}
      REDIS_URL: redis://redis:6379
      SESSION_SECRET: ${SESSION_SECRET:?SESSION_SECRET is required}
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
    healthcheck:
      test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    restart: unless-stopped

  # ---- Frontend ----
  web:
    build: ./frontend
    ports:
      - '80:80'
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pgdata:
  redis-data:
```

### Порядок запуска этого стека

```
1. db и redis стартуют параллельно
2. Compose ждёт healthcheck обоих
3. migrations запускается и выполняет миграции БД
4. Compose ждёт завершения migrations с кодом 0
5. api стартует
6. Compose ждёт healthcheck api
7. web стартует
```

### restart policy

```yaml
services:
  api:
    restart: unless-stopped   # Перезапускать, кроме ручной остановки

  migrations:
    restart: 'no'             # Не перезапускать (одноразовый сервис)
```

| Политика | Описание |
|----------|----------|
| `no` | Не перезапускать (по умолчанию) |
| `always` | Перезапускать всегда |
| `on-failure` | Перезапускать только при ошибке (exit code != 0) |
| `unless-stopped` | Как always, но не перезапускать после ручного stop |

---

## 🔥 profiles: условные сервисы

### Проблема

Некоторые сервисы нужны только в определённых сценариях:
- **Adminer** -- только для разработки (просмотр БД)
- **Тесты** -- только для CI
- **Debug-инструменты** -- только при отладке
- **Мониторинг** -- только в production

Без profiles они запускаются всегда, даже когда не нужны.

### Определение profiles

```yaml
services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    # Нет profiles -- запускается всегда

  db:
    image: postgres:16
    # Нет profiles -- запускается всегда

  adminer:
    image: adminer
    ports:
      - '8080:8080'
    profiles:
      - debug         # Запускается только с профилем debug

  test-runner:
    build: ./tests
    profiles:
      - test          # Запускается только с профилем test

  prometheus:
    image: prom/prometheus
    profiles:
      - monitoring    # Запускается только с профилем monitoring

  grafana:
    image: grafana/grafana
    profiles:
      - monitoring    # Тот же профиль -- запустятся вместе
```

### Активация profiles

```bash
# Запуск с профилем
docker compose --profile debug up -d
# Запустит: api, db, adminer

# Несколько профилей
docker compose --profile debug --profile monitoring up -d
# Запустит: api, db, adminer, prometheus, grafana

# Через переменную окружения
COMPOSE_PROFILES=debug,monitoring docker compose up -d

# Запуск конкретного сервиса из профиля
docker compose up -d adminer
# Compose автоматически активирует нужный профиль

# Без профиля -- только "основные" сервисы
docker compose up -d
# Запустит: api, db (без profiles)
```

📌 Сервисы **без** `profiles` запускаются **всегда**. Сервисы **с** `profiles` -- только при явной активации.

---

## 🔥 docker-compose.override.yml: переопределение конфигурации

### Как работает override

Docker Compose автоматически мержит два файла:
1. `docker-compose.yml` -- основная конфигурация
2. `docker-compose.override.yml` -- переопределения (если файл существует)

```
docker-compose.yml + docker-compose.override.yml = итоговая конфигурация
```

### Базовый файл (docker-compose.yml)

```yaml
# docker-compose.yml -- основной (коммитится в Git)
services:
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}

volumes:
  pgdata:
```

### Override для разработки (docker-compose.override.yml)

```yaml
# docker-compose.override.yml -- для dev (НЕ коммитится в Git)
services:
  api:
    build:
      target: development     # Другой stage в multi-stage
    volumes:
      - ./api/src:/app/src    # Монтирование исходников
    environment:
      NODE_ENV: development
      DEBUG: 'true'

  db:
    ports:
      - '5432:5432'           # Доступ к БД с хоста для отладки
    environment:
      POSTGRES_PASSWORD: dev-password
```

### Результат слияния

```yaml
# Итоговая конфигурация (что видит Compose)
services:
  api:
    build:
      context: ./api
      target: development       # Переопределено
    ports:
      - '3000:3000'             # Из основного файла
    volumes:
      - ./api/src:/app/src      # Добавлено из override
    environment:
      NODE_ENV: development     # Переопределено
      DEBUG: 'true'             # Добавлено

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - '5432:5432'             # Добавлено из override
    environment:
      POSTGRES_PASSWORD: dev-password  # Переопределено

volumes:
  pgdata:
```

### Отдельный файл для production

```bash
# Для production -- явно указываем другой файл
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# docker-compose.override.yml НЕ используется при -f
```

```yaml
# docker-compose.prod.yml
services:
  api:
    build:
      target: production
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

### Правила слияния Compose-файлов

| Тип поля | Поведение |
|----------|-----------|
| Скалярные значения (`image`, `build.target`) | Переопределяются |
| Маппинги (`environment`, `labels`) | Мержатся (override перезаписывает совпадающие ключи) |
| Списки (`ports`, `volumes`, `expose`) | Конкатенируются (добавляются) |
| `command`, `entrypoint` | Переопределяются полностью |

⚠️ **Важно:** списки (`ports`, `volumes`) **не заменяются, а дополняются**. Если в основном файле есть `- '3000:3000'`, а в override `- '9229:9229'`, то итоговый список будет содержать оба порта.

---

## 🔥 Compose Watch: автоматическая синхронизация при разработке

### Проблема

При разработке вы постоянно меняете код. Без автоматической синхронизации приходится вручную перезапускать:

```bash
# Изменили код...
docker compose up -d --build    # Каждый раз заново
```

Compose Watch автоматически отслеживает изменения файлов и применяет их.

### Три действия watch

```yaml
services:
  api:
    build: ./api
    develop:
      watch:
        # sync -- копирует изменённые файлы в контейнер
        - action: sync
          path: ./api/src
          target: /app/src
          ignore:
            - '**/*.test.ts'

        # rebuild -- пересобирает образ и перезапускает контейнер
        - action: rebuild
          path: ./api/package.json

        # sync+restart -- копирует файл И перезапускает контейнер
        - action: sync+restart
          path: ./api/.env
          target: /app/.env
```

### Подробное описание действий

| Действие | Что делает | Когда использовать |
|----------|-----------|-------------------|
| `sync` | Копирует файлы в контейнер (без перезапуска) | Исходный код (hot reload) |
| `rebuild` | `docker compose build` + recreate контейнера | Зависимости (package.json, go.mod) |
| `sync+restart` | Копирует файлы + перезапускает контейнер | Конфигурация (.env, config.json) |

### Полный пример с Compose Watch

```yaml
services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    develop:
      watch:
        # Изменения в исходном коде -- синхронизировать
        - action: sync
          path: ./api/src
          target: /app/src
          ignore:
            - '**/*.test.ts'
            - '**/__tests__/**'

        # Изменения в package.json -- пересобрать
        - action: rebuild
          path: ./api/package.json

        # Изменения в package-lock.json -- пересобрать
        - action: rebuild
          path: ./api/package-lock.json

        # Изменения в .env -- синхронизировать и перезапустить
        - action: sync+restart
          path: ./api/.env
          target: /app/.env

  frontend:
    build: ./frontend
    ports:
      - '5173:5173'
    develop:
      watch:
        - action: sync
          path: ./frontend/src
          target: /app/src

        - action: rebuild
          path: ./frontend/package.json
```

### Запуск Compose Watch

```bash
# Запуск в режиме watch
docker compose watch

# Или в фоне
docker compose up -d
docker compose watch &

# Watch с конкретным сервисом
docker compose watch api
```

### Compose Watch vs bind mount

```yaml
# ❌ Bind mount -- проблемы с node_modules и производительностью на macOS
services:
  api:
    volumes:
      - ./api:/app
      - /app/node_modules

# ✅ Compose Watch -- файлы копируются при изменении
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
```

Преимущества Watch над bind mount:
- Нет проблем с `node_modules` (не нужен анонимный том)
- Лучшая производительность на macOS (без FUSE)
- Можно фильтровать файлы через `ignore`
- `rebuild` автоматически пересобирает при изменении зависимостей

---

## 🔥 extends: наследование конфигурации сервисов

```yaml
# common.yml
services:
  base-node:
    build:
      context: .
      target: base
    environment:
      NODE_ENV: production
    restart: unless-stopped
    healthcheck:
      test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 3
```

```yaml
# docker-compose.yml
services:
  api:
    extends:
      file: common.yml
      service: base-node
    build:
      context: ./api
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp

  worker:
    extends:
      file: common.yml
      service: base-node
    build:
      context: ./worker
    command: npm run worker
    environment:
      REDIS_URL: redis://redis:6379
```

📌 `extends` полезен, когда несколько сервисов имеют общую конфигурацию (одинаковые переменные окружения, healthcheck, restart policy).

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Простой depends_on вместо condition: service_healthy

```yaml
# ❌ API стартует, когда контейнер с БД запущен, но PostgreSQL ещё не готов
services:
  api:
    depends_on:
      - db     # Не ждёт healthcheck!
  db:
    image: postgres:16
```

> **Почему это ошибка:** контейнер PostgreSQL запускается за 0.5 секунды, но сам сервер базы данных инициализируется 5-15 секунд. API получит ECONNREFUSED.

```yaml
# ✅ API стартует только когда БД реально готова
services:
  api:
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 🐛 2. service_healthy без healthcheck

```yaml
# ❌ Compose выдаст ошибку
services:
  api:
    depends_on:
      redis:
        condition: service_healthy   # Но у redis нет healthcheck!
  redis:
    image: redis:7-alpine
    # healthcheck не определён!
```

> **Почему это ошибка:** условие `service_healthy` требует, чтобы целевой сервис имел определённый healthcheck. Иначе Compose не знает, как проверить готовность.

```yaml
# ✅ Добавляем healthcheck
services:
  redis:
    image: redis:7-alpine
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 🐛 3. Слишком маленький start_period

```yaml
# ❌ PostgreSQL может инициализироваться дольше 5 секунд
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 2s
      start_period: 5s    # При первом запуске (init) нужно больше!
      retries: 3
```

> **Почему это ошибка:** при первом запуске PostgreSQL создаёт базу данных, что занимает больше времени. С маленьким `start_period` и `retries` контейнер может получить статус unhealthy и не запуститься.

```yaml
# ✅ Разумный start_period для первого запуска
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      start_period: 30s    # Достаточно для инициализации
      retries: 5
```

### 🐛 4. Override-файл с дублированием портов

```yaml
# docker-compose.yml
services:
  api:
    ports:
      - '3000:3000'

# docker-compose.override.yml
# ❌ Списки конкатенируются -- будет ДВА маппинга!
services:
  api:
    ports:
      - '3000:3000'     # Дубликат -- ошибка "port is already allocated"
      - '9229:9229'
```

> **Почему это ошибка:** в override-файле списки дополняются, а не заменяются. Указывать тот же порт повторно не нужно.

```yaml
# docker-compose.override.yml
# ✅ Добавляем только НОВЫЕ порты
services:
  api:
    ports:
      - '9229:9229'     # Только debug-порт
```

### 🐛 5. watch sync без target

```yaml
# ❌ Не указан target -- Compose не знает, куда копировать
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          # target: ???  -- обязательное поле для sync!
```

```yaml
# ✅ target указан
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
```

---

## 💡 Best practices

### 1. Всегда используйте healthcheck для БД и кэша

```yaml
# ✅ Healthcheck для каждого инфраструктурного сервиса
services:
  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s

  redis:
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
```

### 2. Используйте profiles для dev-инструментов

```yaml
# ✅ Dev-инструменты не мешают основным сервисам
services:
  adminer:
    image: adminer
    profiles: [debug]

  mailhog:
    image: mailhog/mailhog
    profiles: [debug]
```

### 3. Разделяйте base/override для dev и prod

```
project/
  docker-compose.yml          # Базовая конфигурация (Git)
  docker-compose.override.yml # Dev-переопределения (.gitignore)
  docker-compose.prod.yml     # Production-переопределения (Git)
```

### 4. Compose Watch вместо bind mount

```yaml
# ✅ Watch для разработки -- лучшая производительность
services:
  api:
    develop:
      watch:
        - action: sync
          path: ./api/src
          target: /app/src
        - action: rebuild
          path: ./api/package.json
```

### 5. Группируйте переменные для healthcheck

```yaml
# ✅ Общие переменные для healthcheck и подключения
x-db-env: &db-env
  POSTGRES_DB: ${DB_NAME:-myapp}
  POSTGRES_USER: ${DB_USER:-postgres}
  POSTGRES_PASSWORD: ${DB_PASSWORD}

services:
  db:
    environment:
      <<: *db-env
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres}']
```

### 6. service_completed_successfully для миграций

```yaml
# ✅ Миграции выполняются один раз перед стартом API
services:
  migrations:
    command: npm run migrate
    restart: 'no'
    depends_on:
      db:
        condition: service_healthy

  api:
    depends_on:
      migrations:
        condition: service_completed_successfully
```

---

## 📌 Итоги

- ✅ **depends_on** с `condition: service_healthy` -- надёжный порядок запуска
- ✅ **healthcheck** -- проверка реальной готовности сервиса (pg_isready, redis-cli ping, curl)
- ✅ **start_period** -- время на инициализацию без пенализации
- ✅ **service_completed_successfully** -- для одноразовых задач (миграции, seed)
- ✅ **profiles** -- условные сервисы для dev/test/monitoring
- ✅ **docker-compose.override.yml** -- автоматическое переопределение для разработки
- ✅ Правила слияния: скаляры заменяются, списки конкатенируются, маппинги мержатся
- ✅ **Compose Watch** -- автосинхронизация файлов (sync, rebuild, sync+restart)
- ✅ Watch лучше bind mount: нет проблем с node_modules, лучше производительность
- ✅ **extends** -- наследование общей конфигурации между сервисами
- ✅ **restart policy** -- `unless-stopped` для production, `no` для одноразовых задач
