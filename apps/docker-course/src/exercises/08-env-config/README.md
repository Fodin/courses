# Уровень 8: Переменные окружения и конфигурация

## 🎯 Проблема: захардкоженные пароли в docker-compose.yml

Представьте, что вы описали стек в `docker-compose.yml` и закоммитили в репозиторий:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: super_secret_123    # 🔥 Пароль в Git!
      POSTGRES_USER: admin

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://admin:super_secret_123@db:5432/myapp
      JWT_SECRET: my-jwt-secret-key          # 🔥 Ещё один секрет!
      STRIPE_API_KEY: sk_live_abc123         # 🔥 Платёжный ключ!
```

Этот файл попадёт в историю Git, и любой участник команды (или злоумышленник при утечке) получит доступ к вашим секретам. Даже если вы удалите пароли позже -- они останутся в истории коммитов.

Docker предоставляет несколько механизмов для безопасной работы с конфигурацией: **переменные окружения**, **.env-файлы**, **secrets** и **configs**.

---

## 🔥 ENV в Dockerfile: переменные для образа

### Инструкция ENV

`ENV` задаёт переменные окружения, которые доступны **и при сборке, и при запуске** контейнера:

```dockerfile
FROM node:20-alpine

# Одна переменная
ENV NODE_ENV=production

# Несколько переменных (каждая -- отдельная инструкция)
ENV APP_PORT=3000
ENV LOG_LEVEL=info

# Использование в последующих инструкциях
WORKDIR /app
EXPOSE $APP_PORT
CMD ["node", "server.js"]
```

Переменные, заданные через `ENV`, становятся частью образа и доступны во всех контейнерах, созданных из этого образа.

### ARG vs ENV: сборка vs запуск

```dockerfile
# ARG -- только при сборке (docker build)
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# ARG после FROM нужно переобъявить
ARG BUILD_DATE

# ENV -- при сборке И при запуске (docker run)
ENV NODE_ENV=production

# Паттерн: передать ARG в ENV
ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}

# LABEL использует ARG
LABEL build-date=${BUILD_DATE}
```

| | ARG | ENV |
|---|-----|-----|
| Доступен при `docker build` | ✅ | ✅ |
| Доступен при `docker run` | ❌ | ✅ |
| Переопределяется через `--build-arg` | ✅ | ❌ |
| Переопределяется через `-e` / `--env` | ❌ | ✅ |
| Сохраняется в образе | ❌ | ✅ |

```bash
# Передать ARG при сборке
docker build --build-arg NODE_VERSION=18 --build-arg BUILD_DATE=$(date -u +%Y-%m-%d) .

# Передать ENV при запуске
docker run -e NODE_ENV=development -e LOG_LEVEL=debug myapp
```

⚠️ **Важно:** `ARG` не должен содержать секретов! Значения ARG видны в `docker history`:

```bash
docker history myapp
# STEP  CREATED BY
# ...   ARG DB_PASSWORD=secret123   # ❌ Виден всем!
```

---

## 🔥 Переменные окружения при запуске контейнера

### Флаг -e (--env)

```bash
# Одна переменная
docker run -e NODE_ENV=production myapp

# Несколько переменных
docker run \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  myapp

# Передать переменную из хостовой системы (без значения)
export API_KEY=abc123
docker run -e API_KEY myapp
# Контейнер получит API_KEY=abc123 из хоста
```

### Файл с переменными (--env-file)

```bash
# Загрузить переменные из файла
docker run --env-file .env myapp

# Несколько файлов
docker run --env-file .env --env-file .env.local myapp
```

### Приоритет переменных (от высшего к низшему)

```
1. docker run -e VAR=value          (флаг -e)
2. docker run --env-file .env       (файл)
3. ENV VAR=value в Dockerfile       (образ)
```

Флаг `-e` всегда побеждает. Это позволяет переопределять дефолтные значения из Dockerfile.

---

## 🔥 .env файлы: синтаксис и использование

### Синтаксис .env файла

```bash
# .env -- переменные окружения
# Комментарии начинаются с #

# Простое присваивание
NODE_ENV=production
APP_PORT=3000

# Значения в кавычках (для пробелов и спецсимволов)
APP_NAME="My Docker App"
GREETING='Hello, World!'

# Без кавычек (пробелы обрезаются)
DB_HOST=localhost

# Пустое значение
EMPTY_VAR=

# Многострочные значения (в двойных кавычках)
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"

# ❌ НЕ поддерживается: export, подстановка переменных
# export VAR=value      -- не работает
# VAR=${OTHER_VAR}      -- не работает в .env
```

### .env в Docker Compose

Docker Compose **автоматически** загружает файл `.env` из директории проекта:

```bash
project/
  docker-compose.yml
  .env                  # Загружается автоматически!
```

```bash
# .env
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret123
APP_PORT=3000
```

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: ${DB_NAME}           # myapp
      POSTGRES_USER: ${DB_USER}         # postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD} # secret123

  api:
    build: ./api
    ports:
      - '${APP_PORT}:3000'             # 3000:3000
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@db:5432/${DB_NAME}
```

### Подстановка переменных в docker-compose.yml

```yaml
services:
  api:
    image: myapp:${TAG}                    # Обязательная переменная

    environment:
      # Значение по умолчанию (если VAR не задан или пуст)
      NODE_ENV: ${NODE_ENV:-production}

      # Значение по умолчанию (если VAR не задан, но пустая строка -- ОК)
      LOG_LEVEL: ${LOG_LEVEL-info}

      # Ошибка, если переменная не задана
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Альтернативное значение (если VAR задан, использовать alternative)
      DEBUG: ${DEBUG:+true}
```

| Синтаксис | Описание | VAR не задан | VAR="" | VAR="hello" |
|-----------|----------|-------------|--------|-------------|
| `${VAR}` | Значение | пусто | пусто | hello |
| `${VAR:-default}` | Default если не задан или пуст | default | default | hello |
| `${VAR-default}` | Default если не задан | default | пусто | hello |
| `${VAR:?error}` | Ошибка если не задан или пуст | ERROR | ERROR | hello |
| `${VAR?error}` | Ошибка если не задан | ERROR | пусто | hello |
| `${VAR:+alt}` | Alt если задан и не пуст | пусто | пусто | alt |

### Несколько .env файлов

```yaml
# docker-compose.yml (Compose v2.17+)
services:
  api:
    env_file:
      - .env              # Базовые переменные
      - .env.local         # Локальные переопределения (не в Git)
      - .env.${ENV:-dev}   # Переменные для конкретного окружения
```

```bash
# Или через CLI
docker compose --env-file .env.staging up -d
```

### Приоритет переменных в Docker Compose

```
1. environment: в docker-compose.yml    (явное значение)
2. Shell-переменные хоста               (export VAR=value)
3. env_file: в docker-compose.yml       (файл для сервиса)
4. .env файл в директории проекта       (автоматическая загрузка)
5. ENV в Dockerfile                     (образ)
```

📌 **Важно:** `.env` файл подставляет значения в `docker-compose.yml` (переменные `${VAR}`), а `env_file` передаёт переменные **внутрь контейнера**. Это разные механизмы!

---

## 🔥 Docker Secrets: безопасное хранение секретов

### Проблема переменных окружения

Переменные окружения -- не лучшее место для секретов:

```bash
# ❌ Секреты видны через docker inspect
docker inspect mycontainer --format='{{json .Config.Env}}'
# ["DB_PASSWORD=super_secret_123", "JWT_SECRET=my-secret"]

# ❌ Секреты видны через /proc в контейнере
docker exec mycontainer cat /proc/1/environ
# DB_PASSWORD=super_secret_123

# ❌ Секреты могут попасть в логи
console.log('Config:', process.env)  # Выведет все переменные, включая пароли
```

### Что такое Docker Secrets

Docker Secrets -- механизм безопасной передачи конфиденциальных данных в контейнеры:
- Секреты хранятся **в файлах**, а не в переменных окружения
- Доступны внутри контейнера по пути `/run/secrets/<name>`
- Не видны через `docker inspect`
- Не попадают в логи приложения

### Создание секретов в Compose

```yaml
# docker-compose.yml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password   # Читает пароль из файла
    secrets:
      - db_password           # Какие секреты доступны этому сервису

  api:
    build: ./api
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
      - jwt_secret

# Определение секретов
secrets:
  db_password:
    file: ./secrets/db_password.txt     # Из локального файла
  database_url:
    file: ./secrets/database_url.txt
  jwt_secret:
    environment: JWT_SECRET             # Из переменной окружения хоста (Compose v2.23+)
```

```bash
# secrets/db_password.txt (без переноса строки!)
echo -n "super_secret_123" > secrets/db_password.txt

# secrets/database_url.txt
echo -n "postgresql://postgres:super_secret_123@db:5432/myapp" > secrets/database_url.txt
```

### Чтение секретов в приложении

```javascript
// Node.js -- чтение секрета из файла
const fs = require('fs')

function getSecret(name) {
  const secretPath = `/run/secrets/${name}`
  try {
    return fs.readFileSync(secretPath, 'utf8').trim()
  } catch {
    // Fallback на переменную окружения (для dev)
    return process.env[name.toUpperCase()]
  }
}

const dbPassword = getSecret('db_password')
const jwtSecret = getSecret('jwt_secret')
```

```python
# Python -- чтение секрета
import os

def get_secret(name):
    secret_path = f'/run/secrets/{name}'
    try:
        with open(secret_path, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return os.environ.get(name.upper())
```

### Поддержка _FILE в официальных образах

Многие официальные образы поддерживают суффикс `_FILE` для переменных:

```yaml
services:
  db:
    image: postgres:16
    environment:
      # Вместо POSTGRES_PASSWORD=secret
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

  mysql:
    image: mysql:8
    environment:
      MYSQL_ROOT_PASSWORD_FILE: /run/secrets/mysql_root_password
    secrets:
      - mysql_root_password
```

📌 Образы `postgres`, `mysql`, `mariadb`, `mongo` и другие поддерживают `_FILE` "из коробки".

---

## 🔥 Docker Configs: несекретные конфигурационные файлы

### Configs vs Secrets

| | Secrets | Configs |
|---|---------|---------|
| Назначение | Пароли, ключи, токены | Конфиги nginx, prometheus и т.п. |
| Путь в контейнере | `/run/secrets/<name>` | `/<target>` (настраивается) |
| Шифрование | Да (в Swarm) | Нет |
| Изменяемость | Неизменяемые (immutable) | Неизменяемые |

### Использование Configs в Compose

```yaml
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf    # Куда положить в контейнере

  prometheus:
    image: prom/prometheus
    configs:
      - source: prom_config
        target: /etc/prometheus/prometheus.yml

configs:
  nginx_conf:
    file: ./config/nginx.conf           # Из локального файла
  prom_config:
    file: ./config/prometheus.yml
```

### Configs vs bind mount

```yaml
# Bind mount -- файл изменяется на хосте → сразу в контейнере
services:
  nginx:
    volumes:
      - ./config/nginx.conf:/etc/nginx/nginx.conf:ro

# Configs -- файл копируется при создании контейнера (иммутабелен)
services:
  nginx:
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf
```

Когда использовать configs вместо volumes:
- В Docker Swarm (configs реплицируются между нодами)
- Когда нужна иммутабельность (конфигурация не должна измениться)
- Для production-окружений

Для разработки обычно удобнее bind mount (изменения применяются сразу).

---

## 🔥 Шаблоны конфигурации для нескольких окружений

### Принципы 12-factor app

Методология [12-factor app](https://12factor.net/) рекомендует:

1. **Конфигурация хранится в переменных окружения** -- не в коде, не в конфиг-файлах
2. **Код не различает окружения** -- один и тот же образ для dev, staging и prod
3. **Секреты никогда не хардкодятся** -- даже для dev-окружения

### Структура проекта для нескольких окружений

```
project/
  docker-compose.yml            # Базовая конфигурация (в Git)
  docker-compose.override.yml   # Dev-настройки (в .gitignore)
  docker-compose.prod.yml       # Production-переопределения (в Git)
  docker-compose.staging.yml    # Staging-переопределения (в Git)

  .env                          # Dev-переменные по умолчанию (в .gitignore)
  .env.example                  # Шаблон .env для новых разработчиков (в Git)
  .env.staging                  # Staging-переменные (в .gitignore или CI)
  .env.prod                     # Production-переменные (в .gitignore или CI)

  secrets/                      # Секреты (в .gitignore!)
    db_password.txt
    jwt_secret.txt

  .gitignore
```

### Базовый docker-compose.yml

```yaml
# docker-compose.yml -- общая конфигурация для всех окружений
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}
      POSTGRES_USER: ${DB_USER:-postgres}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${DB_USER:-postgres}']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s

  api:
    build:
      context: ./api
    depends_on:
      db:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: ${DB_NAME:-myapp}
      DB_USER: ${DB_USER:-postgres}

volumes:
  pgdata:
```

### Dev override (docker-compose.override.yml)

```yaml
# docker-compose.override.yml -- автоматически мержится
services:
  db:
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: dev-password       # Простой пароль для dev

  api:
    build:
      target: development
    ports:
      - '3000:3000'
      - '9229:9229'                         # Debug-порт
    volumes:
      - ./api/src:/app/src
    environment:
      DB_PASSWORD: dev-password
      LOG_LEVEL: debug
      DEBUG: 'true'
```

### Production compose (docker-compose.prod.yml)

```yaml
# docker-compose.prod.yml -- для production
services:
  db:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    deploy:
      resources:
        limits:
          memory: 1G

  api:
    build:
      target: production
    ports:
      - '3000:3000'
    secrets:
      - db_password
      - jwt_secret
    environment:
      DB_PASSWORD_FILE: /run/secrets/db_password
      JWT_SECRET_FILE: /run/secrets/jwt_secret
      LOG_LEVEL: warn
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

secrets:
  db_password:
    file: ./secrets/db_password.txt
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

### Запуск разных окружений

```bash
# Development (по умолчанию, используется .env + override)
docker compose up -d

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml --env-file .env.staging up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml --env-file .env.prod up -d
```

### .env.example -- шаблон для команды

```bash
# .env.example -- коммитится в Git как шаблон
# Скопируйте в .env и заполните значениями:
# cp .env.example .env

# Database
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=          # <-- Заполните!

# Application
APP_PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# External services
# STRIPE_API_KEY=     # <-- Получите на dashboard.stripe.com
# SENDGRID_KEY=       # <-- Получите на sendgrid.com
```

### Общие паттерны конфигурации

#### Database URL

```bash
# .env
DB_HOST=db
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret

# Или как единый URL
DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
```

```yaml
# docker-compose.yml
services:
  api:
    environment:
      # Вариант 1: отдельные переменные
      DB_HOST: ${DB_HOST:-db}
      DB_PORT: ${DB_PORT:-5432}
      DB_NAME: ${DB_NAME:-myapp}
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Вариант 2: единый URL
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

#### Feature flags

```bash
# .env
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
FEATURE_DARK_MODE=true
```

#### API keys и внешние сервисы

```bash
# .env (dev -- фейковые/тестовые ключи)
STRIPE_API_KEY=sk_test_xxx
SENDGRID_KEY=SG.test_xxx
SENTRY_DSN=

# .env.prod (production -- настоящие ключи)
STRIPE_API_KEY=sk_live_xxx
SENDGRID_KEY=SG.live_xxx
SENTRY_DSN=https://xxx@sentry.io/123
```

---

## 🔥 YAML-якоря и расширения для DRY-конфигурации

```yaml
# x- префикс -- расширения (extension fields), игнорируются Compose
x-common-env: &common-env
  NODE_ENV: ${NODE_ENV:-production}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  TZ: ${TZ:-UTC}

x-db-env: &db-env
  DB_HOST: db
  DB_PORT: 5432
  DB_NAME: ${DB_NAME:-myapp}
  DB_USER: ${DB_USER:-postgres}
  DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

services:
  api:
    build: ./api
    environment:
      <<: *common-env
      <<: *db-env
      PORT: 3000

  worker:
    build: ./worker
    environment:
      <<: *common-env
      <<: *db-env
      QUEUE_NAME: default

  scheduler:
    build: ./scheduler
    environment:
      <<: *common-env
      <<: *db-env
      CRON_SCHEDULE: '*/5 * * * *'
```

📌 YAML-якоря (`&name` / `*name`) позволяют не дублировать одинаковые блоки переменных.

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Секреты в docker-compose.yml

```yaml
# ❌ Пароль захардкожен и попадёт в Git
services:
  db:
    environment:
      POSTGRES_PASSWORD: super_secret_123
```

> **Почему это ошибка:** файл `docker-compose.yml` коммитится в репозиторий. Даже если вы удалите пароль позже, он навсегда останется в истории Git. Злоумышленник с доступом к репозиторию получит все ваши секреты.

```yaml
# ✅ Пароль из переменной или секрета
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
```

### 🐛 2. .env файл в Git

```bash
# ❌ .env с реальными паролями в репозитории
git add .env
git commit -m "add config"
```

> **Почему это ошибка:** `.env` часто содержит реальные пароли, API-ключи и другие секреты. Даже в приватном репозитории это риск -- любой участник видит продакшн-пароли.

```bash
# ✅ .env в .gitignore, .env.example в Git
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore
```

### 🐛 3. Путаница между .env для Compose и env_file для контейнера

```yaml
# ❌ Думают, что .env передаётся внутрь контейнера
# .env подставляет ${VAR} в docker-compose.yml, но НЕ передаёт переменные в контейнер!
services:
  api:
    image: myapp
    # Переменная APP_PORT из .env подставится в ports, но НЕ будет внутри контейнера
    ports:
      - '${APP_PORT}:3000'
```

> **Почему это ошибка:** `.env` и `env_file` -- разные механизмы. `.env` подставляет значения в `docker-compose.yml` (интерполяция). `env_file` передаёт переменные внутрь контейнера.

```yaml
# ✅ Явно передаём переменные внутрь контейнера
services:
  api:
    image: myapp
    ports:
      - '${APP_PORT}:3000'       # Из .env (интерполяция)
    env_file:
      - .env.app                  # Переменные ВНУТРЬ контейнера
    environment:
      APP_PORT: ${APP_PORT}       # Или явно через environment
```

### 🐛 4. Секреты в ARG при сборке

```dockerfile
# ❌ ARG со секретом виден в docker history
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
```

> **Почему это ошибка:** значения ARG сохраняются в метаданных образа. Любой, кто скачает образ, может выполнить `docker history` и увидеть секреты.

```dockerfile
# ✅ Секреты передавать только через secrets или runtime env
ENV DB_PASSWORD_FILE=/run/secrets/db_password
```

### 🐛 5. Отсутствие дефолтных значений

```yaml
# ❌ Если DB_NAME не задан, Compose подставит пустую строку
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME}    # Может быть пустым!
```

> **Почему это ошибка:** если переменная не определена, Compose подставит пустую строку. PostgreSQL создаст базу с пустым именем или выдаст ошибку.

```yaml
# ✅ Дефолтное значение или обязательность
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}                     # Дефолт
      POSTGRES_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD}  # Обязательная
```

---

## 💡 Best practices

### 1. Используйте .env.example как шаблон

```bash
# ✅ .env.example в Git, .env в .gitignore
cp .env.example .env
# Заполняем реальными значениями
```

### 2. Разделяйте конфигурацию по окружениям

```bash
# ✅ Разные файлы для разных окружений
.env              # dev (не в Git)
.env.staging      # staging (CI/CD)
.env.prod         # production (CI/CD)
.env.example      # шаблон (в Git)
```

### 3. Secrets для production, env для dev

```yaml
# ✅ Dev: простые переменные
# Production: файловые секреты
services:
  api:
    environment:
      DB_PASSWORD: ${DB_PASSWORD:-dev-password}
      DB_PASSWORD_FILE: ${DB_PASSWORD_FILE:-}
```

### 4. Всегда задавайте дефолтные значения

```yaml
# ✅ ${VAR:-default} для некритичных переменных
# ✅ ${VAR:?error} для обязательных
environment:
  NODE_ENV: ${NODE_ENV:-development}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be set}
```

### 5. Используйте YAML-якоря для общих переменных

```yaml
# ✅ DRY -- не дублируем одинаковые блоки
x-common: &common
  NODE_ENV: ${NODE_ENV:-production}
  TZ: UTC

services:
  api:
    environment:
      <<: *common
      PORT: 3000
  worker:
    environment:
      <<: *common
      QUEUE: jobs
```

### 6. Проверяйте конфигурацию перед запуском

```bash
# Показать итоговую конфигурацию (с подставленными переменными)
docker compose config

# Проверить конкретные переменные
docker compose config | grep -A5 environment
```

---

## 📌 Итоги

- ✅ **ENV** в Dockerfile -- переменные для сборки и запуска, **ARG** -- только для сборки
- ✅ **Флаг -e** переопределяет ENV из Dockerfile при запуске контейнера
- ✅ **.env файл** автоматически загружается Compose для подстановки `${VAR}` в YAML
- ✅ **env_file** передаёт переменные внутрь контейнера (другой механизм)
- ✅ **Подстановка**: `${VAR:-default}` для дефолтов, `${VAR:?error}` для обязательных
- ✅ **Secrets** -- безопасная передача паролей через файлы `/run/secrets/`
- ✅ **Configs** -- несекретные конфигурационные файлы (nginx.conf, prometheus.yml)
- ✅ **12-factor**: конфигурация в окружении, один образ для всех сред
- ✅ **Multi-env**: base + override/prod/staging + .env файлы для каждого окружения
- ✅ **.env.example** -- шаблон в Git, `.env` -- в `.gitignore`
- ✅ **YAML-якоря** (`&name` / `*name`) -- DRY для общих блоков переменных
- ✅ **docker compose config** -- проверка итоговой конфигурации
