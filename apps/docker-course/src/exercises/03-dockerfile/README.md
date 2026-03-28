# Уровень 3: Dockerfile -- инструкции и лучшие практики

## 🎯 Что такое Dockerfile

Dockerfile -- это текстовый файл с инструкциями для автоматической сборки Docker-образа. Каждая инструкция создаёт **новый слой** в образе. Docker выполняет инструкции последовательно сверху вниз.

```dockerfile
# Базовый пример Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

В предыдущих уровнях мы работали с готовыми образами. Теперь научимся создавать свои -- от простых до production-ready с multi-stage builds.

---

## 🔥 WORKDIR -- рабочая директория

`WORKDIR` устанавливает рабочую директорию для всех последующих инструкций: `RUN`, `CMD`, `ENTRYPOINT`, `COPY`, `ADD`.

```dockerfile
# Устанавливаем рабочую директорию
WORKDIR /app

# Все относительные пути теперь от /app
COPY package.json ./        # Копируется в /app/package.json
RUN npm install              # Выполняется в /app
```

### Ключевые особенности WORKDIR

**1. Автоматическое создание директории**

Если директория не существует, `WORKDIR` создаст её автоматически:

```dockerfile
WORKDIR /app/src/components
# Создаст всю цепочку /app/src/components
```

**2. Можно использовать несколько раз**

```dockerfile
WORKDIR /app
COPY package.json ./
RUN npm install

WORKDIR /app/src
COPY . .
# Теперь мы в /app/src
```

**3. Поддержка переменных окружения**

```dockerfile
ENV APP_HOME=/application
WORKDIR $APP_HOME
# Рабочая директория = /application
```

### ⚠️ Почему не стоит использовать `RUN cd`

```dockerfile
# ❌ Плохо: cd не сохраняется между инструкциями
RUN cd /app
RUN npm install   # Выполнится в / , а не в /app!

# ✅ Хорошо: WORKDIR сохраняется
WORKDIR /app
RUN npm install   # Выполнится в /app
```

Каждая инструкция `RUN` запускается в новом shell. Поэтому `cd` в одной инструкции не влияет на следующую.

---

## 🔥 ENV -- переменные окружения (runtime)

`ENV` устанавливает переменные окружения, которые доступны **и при сборке, и в запущенном контейнере**.

```dockerfile
# Синтаксис
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV DATABASE_URL=postgres://localhost:5432/mydb

# Старый синтаксис (без =), тоже работает
ENV NODE_ENV production
```

### Область видимости ENV

Переменные, заданные через `ENV`, доступны:
- Во всех последующих инструкциях Dockerfile (`RUN`, `CMD`, `ENTRYPOINT`)
- Внутри запущенного контейнера
- Их можно переопределить при запуске: `docker run -e NODE_ENV=development`

```dockerfile
ENV APP_VERSION=2.0.0
ENV LOG_LEVEL=info

# Доступны в RUN
RUN echo "Building version $APP_VERSION"

# Доступны в CMD
CMD ["sh", "-c", "echo $LOG_LEVEL"]
```

### Множественное определение ENV

```dockerfile
# Несколько переменных в одной инструкции
ENV NODE_ENV=production \
    APP_PORT=3000 \
    LOG_LEVEL=warn
```

---

## 🔥 ARG -- аргументы сборки (build-time)

`ARG` определяет переменные, которые доступны **только во время сборки** образа.

```dockerfile
# Определяем аргумент с значением по умолчанию
ARG NODE_VERSION=20
ARG APP_ENV=production

# Используем в инструкциях
FROM node:${NODE_VERSION}-alpine
```

### Передача аргументов при сборке

```bash
# Переопределяем значение аргумента
docker build --build-arg NODE_VERSION=18 --build-arg APP_ENV=staging .
```

### 📌 Ключевое отличие ENV от ARG

| Характеристика | ENV | ARG |
|---|---|---|
| **Доступность при сборке** | Да | Да |
| **Доступность в контейнере** | Да | Нет |
| **Переопределение при запуске** | `docker run -e` | Нельзя |
| **Переопределение при сборке** | Нельзя | `--build-arg` |
| **Сохраняется в образе** | Да | Нет |

### Комбинация ARG и ENV

Частый паттерн -- передать значение через `ARG` при сборке и сохранить в `ENV`:

```dockerfile
ARG APP_VERSION=1.0.0
ENV APP_VERSION=${APP_VERSION}

# Теперь APP_VERSION доступна и в контейнере
```

### ⚠️ Область видимости ARG относительно FROM

```dockerfile
# Этот ARG доступен ДО первого FROM
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# Этот ARG нужно определить ПОСЛЕ FROM
ARG BUILD_DATE
RUN echo "Built on: ${BUILD_DATE}"
```

📌 ARG, определённый до `FROM`, доступен **только в инструкции FROM**. После `FROM` его нужно переопределить, если он нужен в других инструкциях.

---

## 🔥 CMD -- команда по умолчанию

`CMD` определяет команду, которая выполняется при **запуске контейнера**. Это команда по умолчанию -- её можно переопределить при `docker run`.

### Три формы CMD

**1. Exec-форма (рекомендуется)**

```dockerfile
CMD ["node", "server.js"]
```

Запускает процесс напрямую, без shell. Процесс получает PID 1 и корректно обрабатывает сигналы (SIGTERM, SIGINT).

**2. Shell-форма**

```dockerfile
CMD node server.js
```

Оборачивается в `/bin/sh -c "node server.js"`. Shell получает PID 1, а node -- дочерний процесс. Сигналы могут не дойти до приложения.

**3. Форма параметров для ENTRYPOINT**

```dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
# Эквивалент: python app.py
```

### Переопределение CMD

```bash
# CMD из Dockerfile
docker run my-image              # Запустит CMD ["node", "server.js"]

# Переопределение
docker run my-image node test.js # Запустит node test.js
docker run my-image sh           # Запустит sh (shell)
```

📌 В Dockerfile может быть только один `CMD`. Если указано несколько, выполнится **последний**.

---

## 🔥 ENTRYPOINT -- точка входа

`ENTRYPOINT` определяет исполняемый файл, который **всегда** запускается при старте контейнера. В отличие от `CMD`, ENTRYPOINT нельзя просто переопределить аргументами `docker run`.

### Exec-форма vs Shell-форма

```dockerfile
# ✅ Exec-форма (рекомендуется)
ENTRYPOINT ["python", "app.py"]

# ❌ Shell-форма (сигналы не обрабатываются корректно)
ENTRYPOINT python app.py
```

### Переопределение ENTRYPOINT

```bash
# Единственный способ переопределить -- флаг --entrypoint
docker run --entrypoint sh my-image
docker run --entrypoint /bin/bash my-image
```

---

## 🔥 CMD + ENTRYPOINT -- комбинация

Самый мощный паттерн -- использовать ENTRYPOINT для фиксированной команды и CMD для параметров по умолчанию:

```dockerfile
ENTRYPOINT ["python"]
CMD ["app.py"]
```

```bash
docker run my-image              # python app.py
docker run my-image test.py      # python test.py
docker run my-image -c "print(1)"  # python -c "print(1)"
```

### Сравнительная таблица

| Сценарий | Только CMD | Только ENTRYPOINT | ENTRYPOINT + CMD |
|---|---|---|---|
| `docker run img` | Выполнит CMD | Выполнит ENTRYPOINT | ENTRYPOINT + CMD |
| `docker run img args` | args заменяет CMD | ENTRYPOINT + args | ENTRYPOINT + args (CMD заменён) |
| `docker run --entrypoint x img` | x заменяет CMD | x заменяет ENTRYPOINT | x заменяет ENTRYPOINT |

### Реальные примеры использования

**Обёртка-скрипт (entrypoint.sh)**

```dockerfile
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
CMD ["start"]
```

```bash
#!/bin/sh
# entrypoint.sh
echo "Running migrations..."
npm run migrate

exec "$@"   # Выполняет CMD (или аргументы из docker run)
```

```bash
docker run my-app           # Миграции + start
docker run my-app test      # Миграции + test
docker run my-app seed      # Миграции + seed
```

---

## 🔥 COPY -- копирование файлов

`COPY` копирует файлы и директории из **контекста сборки** в файловую систему образа.

```dockerfile
# Копировать один файл
COPY package.json /app/

# Копировать несколько файлов
COPY package.json package-lock.json /app/

# Копировать директорию
COPY src/ /app/src/

# Копировать всё из контекста
COPY . /app/
```

### Важные особенности COPY

**1. Работает только с контекстом сборки**

```bash
# Контекст сборки -- это директория, указанная в docker build
docker build -t my-app .     # . -- контекст сборки
docker build -t my-app ./app # ./app -- контекст сборки
```

Нельзя копировать файлы за пределами контекста:

```dockerfile
# ❌ Не работает: файл за пределами контекста
COPY ../config.json /app/
```

**2. Владелец и права**

```dockerfile
# Установить владельца при копировании
COPY --chown=node:node package.json /app/
COPY --chown=1000:1000 . /app/
```

**3. Правильный порядок для кэширования**

```dockerfile
# ✅ Правильно: сначала зависимости, потом код
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# ❌ Плохо: при любом изменении кода зависимости устанавливаются заново
COPY . .
RUN npm ci
```

---

## 🔥 ADD -- расширенное копирование

`ADD` делает то же, что `COPY`, но с дополнительными возможностями:

### 1. Автоматическая распаковка архивов

```dockerfile
# ADD автоматически распакует tar-архив
ADD app.tar.gz /app/
# Результат: содержимое архива в /app/

# COPY просто скопирует архив как файл
COPY app.tar.gz /app/
# Результат: файл app.tar.gz в /app/
```

Поддерживаемые форматы: `.tar`, `.tar.gz`, `.tgz`, `.tar.bz2`, `.tar.xz`.

### 2. Скачивание файлов по URL

```dockerfile
# ADD может скачать файл из интернета
ADD https://example.com/config.json /app/config.json
```

### 📌 Когда использовать ADD, а когда COPY

| Ситуация | Используйте |
|---|---|
| Копирование локальных файлов | `COPY` |
| Копирование с изменением владельца | `COPY --chown` |
| Распаковка локального tar-архива | `ADD` |
| Скачивание из URL | Лучше `RUN curl` + `RUN tar` |

💡 **Рекомендация Docker:** используйте `COPY` по умолчанию. `ADD` нужен только для автоматической распаковки tar-архивов.

```dockerfile
# ❌ Неочевидное поведение с ADD
ADD https://example.com/app.tar.gz /app/
# Скачает, но НЕ распакует (распаковка работает только для локальных файлов)

# ✅ Явный и предсказуемый способ
RUN curl -fsSL https://example.com/app.tar.gz | tar -xz -C /app/
```

---

## 🔥 .dockerignore -- исключение файлов из контекста

Файл `.dockerignore` работает аналогично `.gitignore`: он указывает, какие файлы и директории **не включать** в контекст сборки.

### Зачем нужен .dockerignore

**1. Уменьшение размера контекста сборки**

```bash
# Без .dockerignore node_modules попадёт в контекст
Sending build context to Docker daemon  500MB  # Медленно!

# С .dockerignore
Sending build context to Docker daemon  2MB    # Быстро!
```

**2. Безопасность -- исключение секретов**

```
# .dockerignore
.env
.env.local
*.pem
credentials/
```

**3. Предотвращение лишних инвалидаций кэша**

Если в контекст попадёт `.git/`, любой коммит инвалидирует кэш `COPY . .`.

### Синтаксис .dockerignore

```
# Комментарии начинаются с #

# Исключить файлы/директории
node_modules
.git
.env
.env.*
*.log

# Исключить по паттерну
**/*.test.js
**/*.spec.ts
**/temp

# Исключение из исключения (! -- включить обратно)
*.md
!README.md

# Исключить конкретные пути
docs/
coverage/
.vscode/
.idea/
```

### Типичный .dockerignore для Node.js-проекта

```
node_modules
npm-debug.log*
.git
.gitignore
.dockerignore
Dockerfile
docker-compose*.yml
.env
.env.*
*.md
!README.md
coverage
.nyc_output
.vscode
.idea
*.swp
*.swo
dist
build
```

---

## 🔥 Multi-stage builds -- многоэтапная сборка

Multi-stage builds позволяют использовать **несколько инструкций FROM** в одном Dockerfile. Это ключевой инструмент для создания компактных production-образов.

### Проблема: раздутые образы

```dockerfile
# ❌ Однэтапная сборка: всё в одном образе
FROM node:20
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build
# Образ содержит: исходники + devDependencies + build tools + готовый билд
# Размер: ~1.2 ГБ
```

### Решение: multi-stage build

```dockerfile
# Этап 1: Сборка (builder)
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
# Размер: ~150 МБ
```

### Как это работает

1. Каждый `FROM` начинает **новый этап** сборки
2. Этапам можно давать имена: `FROM image AS name`
3. `COPY --from=name` копирует файлы **из другого этапа**
4. В финальный образ попадает **только последний этап**
5. Промежуточные этапы используются для сборки, но не увеличивают размер итогового образа

### Реальный пример: React + Nginx

```dockerfile
# Этап 1: Сборка React-приложения
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап 2: Отдача статики через Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# Итоговый образ: ~25 МБ (только Nginx + статика)
```

### Реальный пример: Go-приложение

```dockerfile
# Этап 1: Компиляция
FROM golang:1.22 AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /server ./cmd/server

# Этап 2: Минимальный образ
FROM scratch
COPY --from=builder /server /server
EXPOSE 8080
ENTRYPOINT ["/server"]
# Итоговый образ: ~10 МБ (только бинарник)
```

### Сборка конкретного этапа

```bash
# Собрать только этап builder (для отладки)
docker build --target builder -t my-app:builder .

# Собрать финальный образ (по умолчанию)
docker build -t my-app:latest .
```

### COPY --from из внешнего образа

```dockerfile
# Копирование из стороннего образа (не из этапа сборки)
COPY --from=nginx:alpine /etc/nginx/nginx.conf /etc/nginx/
```

---

## 📌 Дополнительные инструкции Dockerfile

### HEALTHCHECK -- проверка здоровья контейнера

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 --start-period=5s \
  CMD curl -f http://localhost:3000/health || exit 1
```

Параметры:
- `--interval` -- интервал между проверками (по умолчанию 30 сек)
- `--timeout` -- таймаут одной проверки (по умолчанию 30 сек)
- `--retries` -- количество неудач до статуса unhealthy (по умолчанию 3)
- `--start-period` -- время на инициализацию перед началом проверок

```bash
# Статус здоровья виден в docker ps
docker ps
# CONTAINER ID  IMAGE     STATUS
# abc123        my-app    Up 5 min (healthy)
```

### LABEL -- метаданные образа

```dockerfile
LABEL maintainer="dev@example.com"
LABEL version="1.0.0"
LABEL description="Production API server"
LABEL org.opencontainers.image.source="https://github.com/user/repo"
```

```bash
# Просмотр меток
docker inspect --format='{{json .Config.Labels}}' my-image
```

### EXPOSE -- документация портов

```dockerfile
# Документирует, какие порты использует приложение
EXPOSE 3000
EXPOSE 3000/tcp
EXPOSE 5432/udp
```

📌 `EXPOSE` **не публикует** порт! Это только документация. Для публикации нужен `-p` при запуске:

```bash
docker run -p 8080:3000 my-app
```

### USER -- пользователь для запуска

```dockerfile
# Создать непривилегированного пользователя
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Переключиться на него
USER appuser

# Все последующие RUN, CMD, ENTRYPOINT выполняются от appuser
CMD ["node", "server.js"]
```

💡 Всегда запускайте приложение от **непривилегированного пользователя** в production.

---

## 🔥 Best practices для Dockerfile

### 1. Используйте конкретные теги базовых образов

```dockerfile
# ❌ Плохо: latest может измениться в любой момент
FROM node:latest

# ✅ Хорошо: конкретная версия
FROM node:20.11-alpine
```

### 2. Минимизируйте количество слоёв

```dockerfile
# ❌ Много слоёв
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN apt-get clean

# ✅ Один слой
RUN apt-get update && \
    apt-get install -y curl wget && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
```

### 3. Располагайте инструкции от редко меняющихся к часто меняющимся

```dockerfile
# ✅ Правильный порядок для оптимизации кэша
FROM node:20-alpine
WORKDIR /app

# Редко меняется: зависимости
COPY package.json package-lock.json ./
RUN npm ci --production

# Часто меняется: исходный код
COPY . .

CMD ["node", "server.js"]
```

### 4. Используйте .dockerignore

Всегда создавайте `.dockerignore` для исключения ненужных файлов из контекста сборки.

### 5. Не храните секреты в образе

```dockerfile
# ❌ Секрет остаётся в слое образа даже после удаления
COPY .env /app/
RUN source /app/.env && rm /app/.env

# ✅ Используйте ARG для build-time секретов (осторожно!)
ARG NPM_TOKEN
RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && \
    npm ci && \
    rm .npmrc

# ✅ Лучше: Docker BuildKit secrets
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci
```

### 6. Один процесс -- один контейнер

```dockerfile
# ❌ Несколько процессов в одном контейнере
CMD service nginx start && node server.js

# ✅ Отдельные контейнеры для каждого процесса
# Dockerfile.nginx -- для nginx
# Dockerfile.app -- для приложения
# Связываем через docker-compose
```

### 7. Используйте multi-stage builds для production

```dockerfile
# Всегда отделяйте этап сборки от production
FROM node:20 AS builder
# ... сборка ...

FROM node:20-alpine
# ... только нужные файлы ...
```

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Shell-форма CMD/ENTRYPOINT в production

```dockerfile
# ❌ Shell-форма: процесс не получает сигналы корректно
CMD npm start
# PID 1 = /bin/sh, node -- дочерний процесс
# SIGTERM не доходит до node, контейнер убивается через 10 сек (SIGKILL)
```

> **Почему это ошибка:** при `docker stop` Docker отправляет SIGTERM процессу с PID 1. В shell-форме PID 1 -- это `/bin/sh`, который не передаёт сигнал дочерним процессам. После таймаута Docker отправляет SIGKILL -- принудительное завершение без graceful shutdown.

```dockerfile
# ✅ Exec-форма: node получает PID 1 и корректно обрабатывает сигналы
CMD ["node", "server.js"]
```

### 🐛 2. COPY . . без .dockerignore

```dockerfile
# ❌ Копирует ВСЁ: node_modules, .git, .env, секреты
COPY . .
```

> **Почему это ошибка:** в образ попадают гигабайты ненужных файлов (node_modules будут переустановлены), секреты (.env), история Git. Образ раздувается и становится небезопасным.

```dockerfile
# ✅ Создайте .dockerignore и копируйте осознанно
# .dockerignore: node_modules, .git, .env, ...
COPY . .
```

### 🐛 3. Установка зависимостей после COPY . .

```dockerfile
# ❌ Любое изменение в коде инвалидирует кэш npm install
COPY . .
RUN npm install

# При изменении одного файла: npm install запускается заново (~2 мин)
```

> **Почему это ошибка:** Docker кэширует слои. Если файлы в `COPY` изменились, этот слой и все последующие пересобираются. Изменение одной строки кода вызывает переустановку всех зависимостей.

```dockerfile
# ✅ Сначала зависимости, потом код
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# При изменении кода: npm ci берётся из кэша (~0 сек)
```

### 🐛 4. Использование ADD вместо COPY без причины

```dockerfile
# ❌ ADD без необходимости: неочевидное поведение
ADD package.json /app/
ADD https://example.com/file.txt /app/
```

> **Почему это ошибка:** `ADD` имеет неочевидные побочные эффекты (распаковка tar, скачивание URL). Когда используется просто для копирования файлов, это запутывает читателя.

```dockerfile
# ✅ COPY для копирования, явные команды для остального
COPY package.json /app/
RUN curl -fsSL https://example.com/file.txt -o /app/file.txt
```

### 🐛 5. Запуск от root в production

```dockerfile
# ❌ Приложение работает от root
FROM node:20-alpine
WORKDIR /app
COPY . .
CMD ["node", "server.js"]
# Если приложение скомпрометировано -- атакующий получает root
```

> **Почему это ошибка:** принцип наименьших привилегий. Если в приложении есть уязвимость, атакующий получит права root внутри контейнера, что существенно расширяет вектор атаки.

```dockerfile
# ✅ Создайте непривилегированного пользователя
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser
CMD ["node", "server.js"]
```

### 🐛 6. Путаница с областью видимости ARG

```dockerfile
# ❌ ARG до FROM недоступен после FROM
ARG APP_VERSION=1.0.0
FROM node:20-alpine
RUN echo $APP_VERSION   # Пустая строка!
```

> **Почему это ошибка:** ARG, определённый до `FROM`, имеет область видимости только до первого `FROM`. После `FROM` начинается новый этап сборки.

```dockerfile
# ✅ Переопределите ARG после FROM
ARG APP_VERSION=1.0.0
FROM node:20-alpine
ARG APP_VERSION
RUN echo $APP_VERSION   # 1.0.0
```

---

## 📌 Итоги

- ✅ `WORKDIR` -- устанавливает рабочую директорию, создаёт её автоматически
- ✅ `ENV` -- переменные окружения, доступны при сборке и в контейнере
- ✅ `ARG` -- аргументы сборки, доступны только при `docker build`
- ✅ `CMD` -- команда по умолчанию, можно переопределить при `docker run`
- ✅ `ENTRYPOINT` -- фиксированная точка входа, переопределяется через `--entrypoint`
- ✅ `COPY` -- копирование файлов (используйте по умолчанию)
- ✅ `ADD` -- расширенное копирование (только для распаковки tar-архивов)
- ✅ `.dockerignore` -- исключает файлы из контекста сборки
- ✅ Multi-stage builds -- многоэтапная сборка для компактных production-образов
- ✅ Всегда используйте exec-форму для CMD и ENTRYPOINT
- ✅ Оптимизируйте порядок инструкций для кэширования
- ✅ Не запускайте приложения от root в production
