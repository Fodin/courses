# 🔥 Уровень 1: Docker-образы

## 🎯 Что такое Docker-образ

Docker-образ (image) -- это **шаблон только для чтения**, содержащий всё необходимое для запуска приложения: код, среду выполнения, библиотеки, переменные окружения и конфигурационные файлы.

Образ можно сравнить с **классом** в объектно-ориентированном программировании: сам по себе он ничего не делает, но из него можно создать один или несколько **контейнеров** (экземпляров).

```
Образ (Image)           Контейнер (Container)
┌─────────────────┐     ┌─────────────────┐
│  Шаблон (R/O)   │────▶│  Запущенный      │
│  Код + Deps     │     │  экземпляр       │
│  Конфиги        │     │  + записываемый   │
│  Базовая ОС     │     │    слой (R/W)     │
└─────────────────┘     └─────────────────┘
        │
        ├──────────────▶ Контейнер 2
        │
        └──────────────▶ Контейнер 3
```

📌 **Ключевое свойство:** образы **неизменяемы** (immutable). Нельзя изменить существующий образ -- можно только создать новый на его основе.

## 🔥 Слоистая файловая система

Docker-образы построены на основе **слоёв** (layers). Каждая инструкция в `Dockerfile` создаёт новый слой, который представляет набор изменений файловой системы.

### Как работают слои

```dockerfile
FROM ubuntu:22.04          # Слой 1: базовый образ (~77 МБ)
RUN apt-get update         # Слой 2: обновление пакетов (~40 МБ)
RUN apt-get install -y curl # Слой 3: установка curl (~5 МБ)
COPY app.js /app/          # Слой 4: копирование кода (~1 КБ)
CMD ["node", "app.js"]     # Метаданные (не создаёт слой)
```

```
┌────────────────────────────────────┐
│ Слой 4: COPY app.js (R/O)         │  ← самый верхний
├────────────────────────────────────┤
│ Слой 3: apt install curl (R/O)    │
├────────────────────────────────────┤
│ Слой 2: apt-get update (R/O)      │
├────────────────────────────────────┤
│ Слой 1: ubuntu:22.04 (R/O)        │  ← базовый
└────────────────────────────────────┘
```

### UnionFS и Copy-on-Write

Docker использует **Union File System (UnionFS)** для объединения всех слоёв в единую файловую систему. Когда контейнер запускается, поверх слоёв образа добавляется **записываемый слой** (writable layer):

```
┌────────────────────────────────────┐
│ Записываемый слой контейнера (R/W) │  ← только здесь можно менять файлы
├────────────────────────────────────┤
│ Слой 4: COPY app.js (R/O)         │
├────────────────────────────────────┤
│ Слой 3: apt install curl (R/O)    │
├────────────────────────────────────┤
│ Слой 2: apt-get update (R/O)      │
├────────────────────────────────────┤
│ Слой 1: ubuntu:22.04 (R/O)        │
└────────────────────────────────────┘
```

**Copy-on-Write (CoW):** когда контейнер изменяет файл из слоя образа, файл сначала **копируется** в записываемый слой, и уже там изменяется. Оригинал в слое образа остаётся нетронутым.

💡 **Зачем нужны слои:**
- **Кэширование.** При пересборке Docker переиспользует неизменённые слои
- **Переиспользование.** Несколько образов могут разделять общие слои (например, `ubuntu:22.04`)
- **Экономия места.** Общие слои хранятся в одном экземпляре на диске

```bash
# Посмотреть слои образа
docker image history nginx:1.25

# Посмотреть подробную информацию
docker image inspect nginx:1.25
```

## 📌 Docker Registry и именование образов

### Что такое реестр

**Docker Registry** -- это хранилище Docker-образов. Реестр хранит образы, позволяет скачивать их (`pull`) и загружать (`push`).

Основные реестры:

| Реестр | Адрес | Описание |
|--------|-------|----------|
| **Docker Hub** | `docker.io` | Крупнейший публичный реестр (по умолчанию) |
| **GitHub Container Registry** | `ghcr.io` | Реестр GitHub, интеграция с GitHub Actions |
| **Amazon ECR** | `<id>.dkr.ecr.<region>.amazonaws.com` | Приватный реестр AWS |
| **Google Artifact Registry** | `<region>-docker.pkg.dev` | Реестр Google Cloud |
| **Harbor** | self-hosted | Open-source приватный реестр |

### Полное имя образа

Полное имя Docker-образа имеет формат:

```
[registry/][namespace/]repository[:tag|@digest]
```

Примеры:

```bash
# Только имя (Docker Hub, official image, latest)
nginx

# Имя с тегом
nginx:1.25

# С namespace (пользователь/организация на Docker Hub)
myuser/my-app:2.0

# Полный адрес с реестром
ghcr.io/myorg/my-service:v1.3.0

# С digest (точная идентификация)
nginx@sha256:abc123def456...
```

📌 **Если реестр не указан**, Docker по умолчанию использует `docker.io` (Docker Hub). Если тег не указан, используется `latest`.

### Типы образов на Docker Hub

- **Official Images** -- образы, поддерживаемые Docker и проверенными командами (nginx, postgres, node). Не имеют namespace.
- **Verified Publisher** -- образы от проверенных компаний (bitnami, datadog)
- **Community Images** -- образы от любых пользователей (`username/image`)

## 🔥 docker pull -- скачивание образов

Команда `docker pull` скачивает образ из реестра на локальную машину.

### Базовое использование

```bash
# Скачать последнюю версию (latest)
docker pull nginx

# Скачать конкретную версию
docker pull nginx:1.25

# Скачать из другого реестра
docker pull ghcr.io/myorg/my-app:v1.0

# Скачать с указанием digest
docker pull nginx@sha256:4c0fdaa8b6341...
```

### Что происходит при docker pull

```
$ docker pull node:20-alpine

20-alpine: Pulling from library/node
c926b61bad3b: Pull complete        ← Слой 1
5765c9a6d4d8: Pull complete        ← Слой 2
a4dad7bfc247: Pull complete        ← Слой 3
bfa6f8a61e0b: Pull complete        ← Слой 4
Digest: sha256:7a91aa397f25...     ← Уникальный хеш образа
Status: Downloaded newer image for node:20-alpine
docker.io/library/node:20-alpine   ← Полное имя
```

Обратите внимание: каждый слой скачивается отдельно. Если слой уже есть на машине (например, от другого образа), он **не скачивается повторно**:

```
$ docker pull node:20-slim

20-slim: Pulling from library/node
c926b61bad3b: Already exists       ← Слой уже есть!
8a7c47254b8a: Pull complete
...
```

### Полезные флаги

```bash
# Скачать все теги образа
docker pull --all-tags nginx

# Скачать для другой платформы
docker pull --platform linux/arm64 nginx:1.25

# Тихий режим (без вывода прогресса)
docker pull --quiet nginx:1.25
```

## 🔥 Основы Dockerfile

`Dockerfile` -- это текстовый файл с инструкциями для сборки Docker-образа. Каждая инструкция создаёт слой или добавляет метаданные к образу.

### Ключевые инструкции

#### FROM -- базовый образ

```dockerfile
# Любой Dockerfile начинается с FROM
FROM node:20-alpine

# Можно указать платформу
FROM --platform=linux/amd64 python:3.12-slim

# scratch -- пустой образ (для минимальных бинарников)
FROM scratch
```

📌 **FROM** -- единственная обязательная инструкция в Dockerfile.

#### RUN -- выполнение команд

```dockerfile
# Каждый RUN создаёт новый слой
RUN apt-get update
RUN apt-get install -y curl

# Лучше объединять команды для меньшего числа слоёв
RUN apt-get update && \
    apt-get install -y curl wget && \
    rm -rf /var/lib/apt/lists/*
```

#### COPY и ADD -- копирование файлов

```dockerfile
# COPY: копирует файлы из контекста сборки
COPY package.json /app/
COPY . /app/

# ADD: как COPY, но ещё умеет распаковывать архивы и скачивать URL
ADD archive.tar.gz /app/
```

💡 **Рекомендация:** используйте `COPY` вместо `ADD`, если вам не нужна распаковка архивов. `COPY` предсказуемее и понятнее.

#### WORKDIR -- рабочая директория

```dockerfile
WORKDIR /app
# Все последующие команды выполняются в /app
COPY . .
RUN npm install
```

#### EXPOSE -- объявление портов

```dockerfile
# Документирует, какие порты использует приложение
EXPOSE 3000
EXPOSE 8080/tcp
EXPOSE 5432/udp
```

⚠️ **EXPOSE не открывает порты!** Он лишь документирует намерение. Для проброса портов используйте `-p` при `docker run`.

#### CMD и ENTRYPOINT -- команда запуска

```dockerfile
# CMD: команда по умолчанию (может быть переопределена)
CMD ["node", "server.js"]

# ENTRYPOINT: основная команда (сложнее переопределить)
ENTRYPOINT ["node"]
CMD ["server.js"]  # аргументы по умолчанию для ENTRYPOINT
```

#### ENV -- переменные окружения

```dockerfile
ENV NODE_ENV=production
ENV PORT=3000
```

#### ARG -- аргументы сборки

```dockerfile
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine

ARG APP_VERSION
ENV APP_VERSION=${APP_VERSION}
```

### Пример полного Dockerfile

```dockerfile
# Базовый образ
FROM node:20-alpine

# Метаданные
LABEL maintainer="dev@example.com"
LABEL version="1.0"

# Рабочая директория
WORKDIR /app

# Сначала копируем только файлы зависимостей (для кэширования)
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем остальной код
COPY . .

# Документируем порт
EXPOSE 3000

# Создаём непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Команда запуска
CMD ["node", "server.js"]
```

## 🔥 docker build -- сборка образов

Команда `docker build` читает `Dockerfile` и создаёт образ.

### Базовое использование

```bash
# Собрать образ из текущей директории
docker build .

# Собрать с тегом
docker build -t my-app:1.0 .

# Указать другой Dockerfile
docker build -f Dockerfile.dev -t my-app:dev .

# Несколько тегов
docker build -t my-app:1.0 -t my-app:latest .
```

### Build context (контекст сборки)

**Build context** -- это набор файлов, доступных во время сборки. Точка (`.`) в конце `docker build .` указывает на текущую директорию как контекст.

```bash
# Контекст — текущая директория
docker build -t my-app .

# Контекст — другая директория
docker build -t my-app ./services/api
```

⚠️ **Docker отправляет весь контекст сборки демону!** Если в директории много файлов (node_modules, .git), сборка будет медленной. Используйте `.dockerignore`:

```
# .dockerignore
node_modules
.git
.env
*.log
dist
coverage
```

### Вывод сборки

```
$ docker build -t my-app:1.0 .

[+] Building 12.3s (10/10) FINISHED
 => [internal] load build definition from Dockerfile       0.0s
 => [internal] load .dockerignore                          0.0s
 => [internal] load metadata for docker.io/library/node    1.2s
 => [1/5] FROM node:20-alpine@sha256:abc123...             3.1s
 => [2/5] WORKDIR /app                                     0.0s
 => [3/5] COPY package*.json ./                            0.1s
 => [4/5] RUN npm ci --only=production                     6.8s
 => [5/5] COPY . .                                         0.2s
 => exporting to image                                     0.8s
 => => naming to docker.io/library/my-app:1.0              0.0s
```

### Полезные флаги

```bash
# Без использования кэша
docker build --no-cache -t my-app .

# Передать build-аргументы
docker build --build-arg NODE_VERSION=18 -t my-app .

# Указать целевую платформу
docker build --platform linux/amd64 -t my-app .

# Показать полный вывод (не сжимать)
docker build --progress=plain -t my-app .
```

## 🔥 Теги и версионирование

### Что такое тег

Тег -- это **человекочитаемая метка** для идентификации конкретной версии образа. Один образ может иметь несколько тегов.

```bash
# Создать тег
docker tag my-app:1.0 my-app:latest
docker tag my-app:1.0 registry.example.com/my-app:1.0

# Список образов
docker images my-app
REPOSITORY   TAG       IMAGE ID       SIZE
my-app       1.0       abc123def456   180MB
my-app       latest    abc123def456   180MB  ← тот же IMAGE ID!
```

### Стратегии тегирования

#### 1. Семантическое версионирование (Semantic Versioning)

```
my-app:1.0.0    ← точная версия (patch)
my-app:1.0      ← минорная версия
my-app:1        ← мажорная версия
my-app:latest   ← последняя версия
```

Пользователь сам выбирает уровень специфичности:
- `my-app:1.0.0` -- полная воспроизводимость, конкретный билд
- `my-app:1.0` -- получить последний патч для 1.0.x
- `my-app:1` -- получить последнюю минорную версию 1.x.x

#### 2. Git-based теги

```bash
# Хеш коммита
my-app:abc123f

# Ветка
my-app:main
my-app:develop

# Ветка + короткий хеш
my-app:main-abc123f
```

#### 3. Date-based теги

```bash
my-app:2024-01-15
my-app:20240115-abc123f
```

#### 4. Environment-based теги

```bash
my-app:staging
my-app:production
```

### Ловушка тега latest

⚠️ `latest` -- это **НЕ** автоматический тег последней версии. Это просто тег по умолчанию, который:
- Присваивается, если при сборке не указан тег: `docker build -t my-app .` создаёт `my-app:latest`
- Используется при pull без тега: `docker pull nginx` = `docker pull nginx:latest`

```bash
# ❌ Частая ошибка: думать, что latest всегда актуален
docker pull my-app:latest  # Может указывать на старую версию!

# ✅ Всегда указывайте конкретную версию
docker pull my-app:1.2.3
```

📌 **В production всегда используйте конкретные теги**, а не `latest`. Это обеспечивает воспроизводимость деплоя.

### Digest-based pinning

Для максимальной воспроизводимости можно использовать **digest** -- SHA256-хеш содержимого образа:

```bash
# Узнать digest
docker inspect --format='{{index .RepoDigests 0}}' nginx:1.25

# Использовать digest
docker pull nginx@sha256:4c0fdaa8b6341...

# В Dockerfile
FROM nginx@sha256:4c0fdaa8b6341...
```

Digest гарантирует, что вы получите **побитово идентичный** образ, даже если тег был переопределён.

## 📌 Управление образами

### Просмотр образов

```bash
# Список всех локальных образов
docker images
docker image ls

# Фильтрация
docker images --filter "dangling=true"    # "висячие" образы без тега
docker images --filter "reference=nginx"  # по имени
docker images --format "{{.Repository}}:{{.Tag}} {{.Size}}"  # формат вывода

# Подробная информация
docker image inspect nginx:1.25

# История слоёв
docker image history nginx:1.25
```

### Удаление образов

```bash
# Удалить конкретный образ
docker image rm nginx:1.25
docker rmi nginx:1.25  # сокращённая форма

# Удалить неиспользуемые образы
docker image prune          # только "висячие" (без тега)
docker image prune -a       # все неиспользуемые
docker image prune -a --filter "until=24h"  # старше 24 часов
```

### Экспорт и импорт

```bash
# Сохранить образ в файл
docker image save -o my-app.tar my-app:1.0

# Загрузить образ из файла
docker image load -i my-app.tar
```

## ⚠️ Частые ошибки новичков

### 🐛 1. Использовать latest в production

```bash
# ❌ Неопределённость: что именно задеплоено?
docker pull my-app:latest
docker run my-app:latest
```

> **Почему это проблема:** тег `latest` может быть переопределён в любой момент. Два `docker pull` с интервалом в час могут скачать разные образы. Это делает деплой невоспроизводимым и усложняет откат.

```bash
# ✅ Конкретная версия = предсказуемый деплой
docker pull my-app:1.2.3
docker run my-app:1.2.3
```

### 🐛 2. Не использовать .dockerignore

```bash
# ❌ Без .dockerignore отправляется ВСЁ
$ docker build -t my-app .
Sending build context to Docker daemon  450MB  ← включая node_modules и .git!
```

> **Почему это проблема:** огромный контекст замедляет сборку. Кроме того, секреты (.env файлы) могут попасть в образ через `COPY . .`.

```
# ✅ Файл .dockerignore
node_modules
.git
.env
*.log
.DS_Store
coverage
dist
```

### 🐛 3. Каждый RUN в отдельном слое

```dockerfile
# ❌ Три слоя, увеличивающих размер образа
RUN apt-get update
RUN apt-get install -y curl wget
RUN rm -rf /var/lib/apt/lists/*
```

> **Почему это проблема:** каждый `RUN` создаёт слой. Даже если вы удаляете файлы в следующем слое, они всё ещё занимают место в предыдущем слое. Кэш `apt-get update` может устареть при пересборке.

```dockerfile
# ✅ Одна команда = один слой, чистка в том же слое
RUN apt-get update && \
    apt-get install -y curl wget && \
    rm -rf /var/lib/apt/lists/*
```

### 🐛 4. Путать COPY и контекст сборки

```dockerfile
# ❌ Пытаться скопировать файл вне контекста
COPY /etc/config.json /app/     # Ошибка! Абсолютные пути не работают
COPY ../shared/utils.js /app/   # Ошибка! Нельзя выйти за контекст
```

> **Почему это проблема:** `COPY` работает **только** с файлами внутри контекста сборки (директории, указанной в `docker build`). Нельзя копировать файлы из произвольных мест файловой системы.

```dockerfile
# ✅ Пути относительно контекста сборки
COPY ./config/config.json /app/
COPY . /app/
```

### 🐛 5. Не понимать кэширование слоёв

```dockerfile
# ❌ Кэш инвалидируется при любом изменении кода
COPY . /app/
RUN npm install  # Переустановка зависимостей при каждом изменении!
```

> **Почему это проблема:** Docker кэширует слои сверху вниз. Если слой изменился, все последующие слои пересобираются. Копирование всего кода ДО установки зависимостей означает, что `npm install` будет выполняться при каждом изменении любого файла.

```dockerfile
# ✅ Сначала зависимости, потом код
COPY package.json package-lock.json ./
RUN npm ci
COPY . .  # Изменение кода не инвалидирует кэш npm install
```

## 📌 Best practices

1. ✅ **Используйте конкретные теги** базовых образов: `node:20-alpine`, а не `node:latest`
2. ✅ **Минимальные базовые образы:** предпочитайте `-alpine` или `-slim` варианты
3. ✅ **Оптимизируйте порядок слоёв:** редко меняющиеся инструкции -- вверху, часто меняющиеся -- внизу
4. ✅ **Объединяйте RUN-команды** через `&&` для уменьшения числа слоёв
5. ✅ **Используйте .dockerignore** для исключения ненужных файлов из контекста
6. ✅ **Один процесс на контейнер** -- не запускайте несколько сервисов в одном образе
7. ✅ **Очищайте кэши пакетных менеджеров** в том же `RUN`, где установлены пакеты
8. ✅ **Используйте digest pinning** в CI/CD для максимальной воспроизводимости

## 📌 Итоги

- 🔥 Docker-образ -- это неизменяемый шаблон, состоящий из слоёв (layers)
- 🔥 Слои кэшируются и переиспользуются, что ускоряет сборку и экономит место
- 📌 Образы хранятся в реестрах (Docker Hub, ghcr.io, ECR и др.)
- 📌 Полное имя образа: `[registry/][namespace/]repository[:tag|@digest]`
- ✅ `docker pull` скачивает образ, `docker build` собирает из Dockerfile
- ✅ В production используйте конкретные теги или digest, а не `latest`
- ⚠️ Не забывайте про `.dockerignore` и оптимизацию порядка слоёв
