# Уровень 6: Docker Compose -- основы

## 🎯 Проблема: ручное управление несколькими контейнерами

В предыдущих уровнях мы запускали контейнеры по одному с помощью `docker run`. Для реального приложения это быстро превращается в кошмар:

```bash
# Создаём сеть
docker network create myapp

# Запускаем базу данных
docker run -d --name db \
  --network myapp \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=myapp \
  postgres:16

# Запускаем Redis
docker run -d --name redis \
  --network myapp \
  redis:7-alpine

# Запускаем backend
docker run -d --name api \
  --network myapp \
  -e DATABASE_URL=postgresql://postgres:secret@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  -p 3000:3000 \
  my-api

# Запускаем frontend
docker run -d --name web \
  --network myapp \
  -p 80:80 \
  my-frontend
```

Четыре контейнера -- и уже 20 строк команд. А теперь представьте, что нужно:
- Обновить один из сервисов
- Перезапустить всё после изменения конфигурации
- Передать эту конфигурацию коллеге
- Запустить то же самое на CI/CD

**Docker Compose** решает эту проблему: вся конфигурация описывается в одном файле `docker-compose.yml`, а управление всеми контейнерами происходит через одну команду.

---

## 🔥 Что такое Docker Compose

Docker Compose -- это инструмент для **декларативного описания и управления многоконтейнерными приложениями**. Вместо императивных команд `docker run` вы описываете желаемое состояние в YAML-файле.

```yaml
# docker-compose.yml -- один файл вместо десятков команд
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: myapp

  redis:
    image: redis:7-alpine

  api:
    build: ./api
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      REDIS_URL: redis://redis:6379
    depends_on:
      - db
      - redis

  web:
    build: ./frontend
    ports:
      - '80:80'

volumes:
  pgdata:
```

```bash
# Одна команда запускает ВСЁ
docker compose up -d
```

### Ключевые преимущества

- **Декларативность** -- описываете "что", а не "как"
- **Воспроизводимость** -- файл можно передать коллеге или запустить на CI
- **Одна команда** -- `docker compose up` создаёт сети, тома и контейнеры
- **Автоматическая сеть** -- все сервисы видят друг друга по имени
- **Версионирование** -- `docker-compose.yml` хранится в Git вместе с кодом

---

## 🔥 Структура docker-compose.yml

### Основные секции

```yaml
# Корневые ключи файла docker-compose.yml

services:      # Обязательно -- определение сервисов (контейнеров)
  web:
    image: nginx
  api:
    build: ./api

networks:      # Опционально -- пользовательские сети
  frontend:
  backend:

volumes:       # Опционально -- именованные тома
  pgdata:
  redis-data:

configs:       # Опционально -- конфигурационные файлы
secrets:       # Опционально -- секреты
```

### О ключе version

```yaml
# ❌ version больше не нужен (deprecated с Compose V2)
version: '3.8'  # Старый формат -- игнорируется

# ✅ Просто начинайте с services
services:
  web:
    image: nginx
```

📌 **Ключ `version` устарел.** Docker Compose V2 автоматически определяет формат файла. Если вы видите `version` в старых проектах -- его можно безопасно удалить.

---

## 🔥 Определение сервисов: image и build

### Использование готового образа (image)

```yaml
services:
  # Образ из Docker Hub
  db:
    image: postgres:16

  # Образ с конкретным тегом
  redis:
    image: redis:7-alpine

  # Образ из приватного реестра
  api:
    image: registry.company.com/my-api:v2.1.0

  # Образ с digest (максимальная воспроизводимость)
  nginx:
    image: nginx@sha256:abc123...
```

### Сборка из Dockerfile (build)

```yaml
services:
  # Простая сборка -- Dockerfile в указанной директории
  api:
    build: ./api
    # Эквивалент: docker build ./api

  # Расширенная конфигурация сборки
  web:
    build:
      context: ./frontend        # Контекст сборки (папка с файлами)
      dockerfile: Dockerfile.prod # Имя Dockerfile (если не стандартное)
      args:                       # Build arguments
        NODE_ENV: production
        API_URL: http://api:3000
      target: production          # Multi-stage: конкретный этап
      cache_from:
        - my-app:latest

  # image + build: собирает и тегирует
  backend:
    build: ./backend
    image: my-backend:latest
    # Собирает образ и присваивает ему тег my-backend:latest
```

### container_name

```yaml
services:
  db:
    image: postgres:16
    container_name: myapp-database
    # По умолчанию имя: <project>-<service>-<replica>
    # С container_name: myapp-database (фиксированное)
```

⚠️ **container_name не рекомендуется** для production -- он запрещает масштабирование (`docker compose up --scale db=2` не сработает). Используйте только для разработки, когда нужно предсказуемое имя.

---

## 🔥 Проброс портов (ports)

### Синтаксис ports

```yaml
services:
  web:
    image: nginx
    ports:
      # Короткий синтаксис: "hostPort:containerPort"
      - '8080:80'

      # Только localhost
      - '127.0.0.1:8080:80'

      # Диапазон портов
      - '8000-8010:8000-8010'

      # Только контейнерный порт (хост-порт случайный)
      - '80'

      # UDP-протокол
      - '5353:53/udp'

  api:
    build: ./api
    ports:
      # Длинный синтаксис (более явный)
      - target: 3000        # Порт контейнера
        published: 3000     # Порт хоста
        protocol: tcp       # Протокол
        host_ip: 127.0.0.1  # Привязка к интерфейсу
```

### expose -- внутренние порты

```yaml
services:
  api:
    build: ./api
    expose:
      - '3000'
    # expose НЕ публикует порт на хосте
    # Используется для документации и связи между сервисами
    # Другие сервисы в той же сети видят api:3000
```

📌 **ports** публикует порт на хосте (доступен из браузера). **expose** только документирует порт для внутренней связи.

---

## 🔥 Тома (volumes)

### Bind mount -- монтирование папки хоста

```yaml
services:
  web:
    image: nginx
    volumes:
      # Монтирование текущей папки в контейнер
      - ./nginx.conf:/etc/nginx/nginx.conf:ro

      # Монтирование исходного кода (для разработки)
      - ./src:/app/src

      # Длинный синтаксис
      - type: bind
        source: ./data
        target: /app/data
        read_only: true
```

### Named volumes -- именованные тома

```yaml
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

# Объявление именованных томов
volumes:
  pgdata:           # Docker создаст том автоматически
  redis-data:
    driver: local   # Драйвер (по умолчанию local)
```

### Анонимные тома

```yaml
services:
  api:
    build: ./api
    volumes:
      # Анонимный том -- Docker создаст с случайным именем
      - /app/node_modules
      # Полезно для исключения node_modules из bind mount
```

### Типичный паттерн для разработки

```yaml
services:
  api:
    build: ./api
    volumes:
      - ./api:/app           # Исходный код с хоста
      - /app/node_modules    # НЕ перезаписывать node_modules из образа
```

---

## 🔥 Переменные окружения (environment, env_file)

### Inline-переменные

```yaml
services:
  api:
    build: ./api
    environment:
      # Формат ключ: значение
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
      REDIS_URL: redis://redis:6379

      # Или формат списка
      # - NODE_ENV=production
      # - DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
```

### Файл переменных (env_file)

```yaml
services:
  api:
    build: ./api
    env_file:
      - .env           # Общие переменные
      - .env.local     # Локальные переопределения

  db:
    image: postgres:16
    env_file:
      - ./db/.env      # Переменные для БД
```

Файл `.env`:
```bash
# .env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:secret@db:5432/myapp
SECRET_KEY=my-super-secret-key
```

### Подстановка переменных из окружения хоста

```yaml
services:
  api:
    image: my-api:${API_VERSION:-latest}
    # Используется переменная API_VERSION из окружения хоста
    # Если не задана -- подставится "latest"

    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@db:5432/myapp
      # DB_PASSWORD берётся из окружения хоста или .env файла
```

Файл `.env` в корне проекта (рядом с docker-compose.yml) автоматически загружается Compose:

```bash
# .env (автоматически загружается!)
API_VERSION=2.1.0
DB_PASSWORD=super-secret
COMPOSE_PROJECT_NAME=myapp
```

📌 **Не коммитьте `.env` с секретами в Git!** Добавьте `.env` в `.gitignore` и создайте `.env.example` с шаблоном.

---

## 🔥 Основные команды Docker Compose

### docker compose up

```bash
# Запустить все сервисы
docker compose up

# Запустить в фоне (detached)
docker compose up -d

# Запустить конкретные сервисы
docker compose up -d api db

# Пересобрать образы перед запуском
docker compose up -d --build

# Пересоздать контейнеры (даже если конфигурация не менялась)
docker compose up -d --force-recreate

# Запустить с другим compose-файлом
docker compose -f docker-compose.prod.yml up -d
```

### docker compose down

```bash
# Остановить и удалить контейнеры + сети
docker compose down

# Также удалить тома (ОСТОРОЖНО -- данные будут потеряны!)
docker compose down -v

# Также удалить образы
docker compose down --rmi all

# Удалить только локально собранные образы
docker compose down --rmi local
```

### docker compose logs

```bash
# Логи всех сервисов
docker compose logs

# Логи конкретного сервиса
docker compose logs api

# Следить за логами в реальном времени
docker compose logs -f

# Последние N строк
docker compose logs --tail 50

# Логи с временными метками
docker compose logs -t

# Комбинирование: последние 20 строк + follow
docker compose logs -f --tail 20 api
```

### docker compose ps

```bash
# Статус всех сервисов
docker compose ps

# Вывод:
# NAME          SERVICE   STATUS    PORTS
# myapp-api-1   api       running   0.0.0.0:3000->3000/tcp
# myapp-db-1    db        running   5432/tcp
# myapp-web-1   web       running   0.0.0.0:80->80/tcp
```

### docker compose exec

```bash
# Выполнить команду в работающем контейнере
docker compose exec api sh
docker compose exec db psql -U postgres
docker compose exec api npm run migrate
```

### docker compose build

```bash
# Собрать (или пересобрать) все образы
docker compose build

# Собрать конкретный сервис
docker compose build api

# Собрать без кэша
docker compose build --no-cache

# Собрать с build arguments
docker compose build --build-arg NODE_ENV=production
```

### docker compose restart / stop / start

```bash
# Перезапустить сервис (без пересоздания)
docker compose restart api

# Остановить (без удаления)
docker compose stop

# Запустить ранее остановленные
docker compose start
```

---

## 🔥 Имя проекта (Project Name)

Docker Compose использует **имя проекта** как префикс для всех ресурсов:

```bash
# По умолчанию -- имя папки
# Папка: /home/user/myapp
# Контейнеры: myapp-api-1, myapp-db-1
# Сеть: myapp_default
# Тома: myapp_pgdata

# Изменить имя проекта
docker compose -p custom-name up -d
# Контейнеры: custom-name-api-1, custom-name-db-1

# Или через переменную окружения
COMPOSE_PROJECT_NAME=custom-name docker compose up -d

# Или в файле .env
# COMPOSE_PROJECT_NAME=custom-name
```

📌 **Имя проекта определяет пространство имён.** Два проекта с разными именами могут работать параллельно, даже если используют одинаковый `docker-compose.yml`.

---

## 🔥 Автоматическая сеть в Compose

Docker Compose **автоматически создаёт сеть** для проекта и подключает к ней все сервисы:

```yaml
services:
  api:
    build: ./api
    # api может обращаться к db по имени "db"
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp

  db:
    image: postgres:16
```

```bash
docker compose up -d

# Compose создал сеть автоматически
docker network ls
# myapp_default   bridge   local

# Все сервисы в одной сети -- DNS работает
docker compose exec api ping db
# PING db (172.18.0.3): 56 data bytes
# 64 bytes from 172.18.0.3: seq=0 ttl=64 time=0.089 ms
```

Вам **не нужно** создавать сети вручную или указывать `--network` -- Compose делает это автоматически.

---

## 🔥 Подстановка переменных (Variable Substitution)

### Синтаксис

```yaml
services:
  api:
    image: my-api:${TAG}           # Обязательная переменная
    image: my-api:${TAG:-latest}   # Значение по умолчанию, если не задана
    image: my-api:${TAG-latest}    # Значение по умолчанию, если не существует
    image: my-api:${TAG:?error}    # Ошибка, если не задана
    image: my-api:${TAG?error}     # Ошибка, если не существует
```

### Порядок приоритета переменных

1. Переменные окружения хоста (наивысший приоритет)
2. Файл `.env` в директории с `docker-compose.yml`
3. Значения по умолчанию в `${VAR:-default}`

```bash
# .env
TAG=2.0

# Переопределение из окружения
TAG=3.0 docker compose up -d
# Будет использован TAG=3.0
```

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Использование устаревшего docker-compose (через дефис)

```bash
# ❌ Старый формат (V1, deprecated)
docker-compose up -d

# ✅ Новый формат (V2, встроен в Docker)
docker compose up -d
```

> **Почему это ошибка:** `docker-compose` (V1) -- отдельный бинарник на Python, он устарел и больше не поддерживается. `docker compose` (V2) -- плагин к Docker CLI, написанный на Go, он быстрее и поддерживает новые возможности.

### 🐛 2. Строки ports без кавычек

```yaml
# ❌ YAML интерпретирует 80:80 как число в формате base-60
services:
  web:
    ports:
      - 80:80    # YAML может неправильно распарсить!
```

> **Почему это ошибка:** YAML-парсер может интерпретировать `80:80` как число в формате base-60 (4880). Это приведёт к непредсказуемому поведению.

```yaml
# ✅ Всегда оборачивайте ports в кавычки
services:
  web:
    ports:
      - '80:80'
      - '443:443'
      - '127.0.0.1:3000:3000'
```

### 🐛 3. Забыли объявить именованные тома

```yaml
# ❌ Том не объявлен в секции volumes
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
# Ошибка: service "db" refers to undefined volume pgdata
```

> **Почему это ошибка:** именованные тома (не bind mount) должны быть объявлены в корневой секции `volumes`.

```yaml
# ✅ Том объявлен
services:
  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:    # Объявление тома
```

### 🐛 4. Путают docker compose down с docker compose stop

```bash
# ⚠️ down удаляет контейнеры и сети
docker compose down

# ⚠️ down -v удаляет ЕЩЁ И ТОМА (данные БД пропадут!)
docker compose down -v

# ✅ stop только останавливает, ничего не удаляет
docker compose stop
```

> **Почему это ошибка:** `docker compose down -v` уничтожит все данные в именованных томах. Если в томе была база данных -- она будет потеряна безвозвратно.

### 🐛 5. Относительные пути для bind mount начинаются не с точки

```yaml
# ❌ Compose интерпретирует как именованный том, а не как путь
services:
  web:
    volumes:
      - data:/app/data
      # "data" -- это именованный том, а не папка ./data !

# ✅ Для bind mount используйте ./ или абсолютный путь
services:
  web:
    volumes:
      - ./data:/app/data     # Bind mount к локальной папке
```

> **Почему это ошибка:** Compose различает bind mount и именованные тома по наличию `./ ` или `/` в начале пути. Без точки Compose ищет именованный том.

### 🐛 6. Секреты в docker-compose.yml, закоммиченном в Git

```yaml
# ❌ Пароль в файле, который попадёт в Git
services:
  db:
    environment:
      POSTGRES_PASSWORD: super-secret-password-123
```

> **Почему это ошибка:** файл `docker-compose.yml` часто коммитится в Git. Секреты в нём станут доступны всем, кто имеет доступ к репозиторию.

```yaml
# ✅ Используйте переменные из .env (который в .gitignore)
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
```

```bash
# .env (добавлен в .gitignore!)
DB_PASSWORD=super-secret-password-123
```

---

## 💡 Best practices

### 1. Всегда указывайте теги образов

```yaml
# ❌ latest может измениться в любой момент
services:
  db:
    image: postgres

# ✅ Конкретная версия
services:
  db:
    image: postgres:16-alpine
```

### 2. Используйте env_file для секретов

```yaml
# ✅ Секреты в отдельном файле
services:
  api:
    env_file:
      - .env
```

### 3. Оборачивайте ports в кавычки

```yaml
# ✅ Безопасный синтаксис
ports:
  - '8080:80'
```

### 4. Объявляйте все именованные тома

```yaml
services:
  db:
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

### 5. Используйте .dockerignore

Создайте `.dockerignore` в каждой директории с Dockerfile:
```
node_modules
.git
.env
*.log
```

### 6. Группируйте связанные сервисы

```yaml
# ✅ Логичный порядок: инфраструктура → backend → frontend
services:
  db:
    image: postgres:16
  redis:
    image: redis:7-alpine
  api:
    build: ./api
  web:
    build: ./frontend
```

---

## 📌 Итоги

- ✅ **Docker Compose** -- декларативное управление многоконтейнерными приложениями
- ✅ **docker-compose.yml** -- один файл с описанием всех сервисов, сетей и томов
- ✅ **services** -- определение контейнеров через `image` или `build`
- ✅ **ports** -- проброс портов на хост (всегда в кавычках!)
- ✅ **volumes** -- bind mount (./path) и именованные тома (объявлять в корне)
- ✅ **environment / env_file** -- переменные окружения
- ✅ **docker compose up -d** -- запуск всех сервисов в фоне
- ✅ **docker compose down** -- остановка и удаление (осторожно с `-v`!)
- ✅ **docker compose logs -f** -- просмотр логов в реальном времени
- ✅ **Автоматическая сеть** -- сервисы находят друг друга по имени
- ✅ **Подстановка переменных** -- `${VAR:-default}` из окружения или `.env`
- ✅ **version** устарел -- не указывайте его в новых проектах
- ✅ Используйте `docker compose` (V2), а не `docker-compose` (V1)
