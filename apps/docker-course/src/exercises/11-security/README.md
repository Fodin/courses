# Уровень 11: Безопасность Docker

## 🎯 Проблема: контейнеры не изолируют вас автоматически

Многие разработчики считают Docker волшебной стеной безопасности: "раз приложение в контейнере, оно изолировано". Это опасное заблуждение.

```bash
# Типичная ситуация: всё работает, но...
$ docker run -d --name myapp \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /etc:/host-etc \
  --privileged \
  myapp:latest

# Поздравляю, вы дали контейнеру полный доступ к хосту
```

Контейнер -- это **не виртуальная машина**. Он использует то же ядро Linux, что и хост. Без правильной настройки:
- Процесс в контейнере может **сбежать на хост** (container escape)
- Злоумышленник может **прочитать секреты** других контейнеров
- Уязвимость в зависимости может стать **точкой входа** в вашу инфраструктуру
- **Supply chain атака** через скомпрометированный базовый образ заражает все ваши сервисы

```
┌─────────────────────────────────────────────┐
│                   ХОСТ                       │
│                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Container │  │Container │  │Container │  │
│  │(root,    │  │(no caps  │  │(read-only│  │
│  │ privil.) │  │ dropped) │  │ FS, user)│  │
│  │          │  │          │  │          │  │
│  │ ОПАСНО!  │  │ Лучше    │  │ Хорошо   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│                                              │
│  Общее ядро Linux (shared kernel)           │
└─────────────────────────────────────────────┘
```

В этом уровне мы разберём все аспекты безопасности Docker:
- Запуск от непривилегированного пользователя
- Linux Capabilities и их ограничение
- Seccomp и AppArmor профили
- Read-only filesystem
- Сканирование уязвимостей
- Подпись и верификация образов
- Управление секретами
- Сетевая изоляция и ограничение ресурсов

---

## 🔥 Модель угроз контейнеров

Прежде чем защищаться, нужно понять, **от чего** мы защищаемся. Основные векторы атак:

### 1. Container Escape (побег из контейнера)

Злоумышленник, получивший доступ к контейнеру, пытается выбраться на хост.

```bash
# Вектор 1: --privileged даёт ВСЕ capabilities и доступ к устройствам хоста
$ docker run --privileged -it alpine sh
# Внутри контейнера:
$ mount /dev/sda1 /mnt  # Монтируем диск хоста!
$ cat /mnt/etc/shadow    # Читаем пароли хоста!

# Вектор 2: Docker socket -- полный контроль над Docker daemon
$ docker run -v /var/run/docker.sock:/var/run/docker.sock alpine sh
# Внутри:
$ apk add docker-cli
$ docker run -v /:/host --privileged alpine chroot /host
# Теперь у нас root на хосте
```

### 2. Supply Chain Attack (атака на цепочку поставок)

```bash
# Скомпрометированный образ в Docker Hub
FROM cool-developer/node-utils:latest  # Кто этот cool-developer?

# Образ может содержать:
# - Криптомайнер
# - Бэкдор
# - Утечку переменных окружения на внешний сервер
```

### 3. Эксплуатация уязвимостей в зависимостях

```bash
# Ваш образ содержит сотни пакетов
$ docker run --rm aquasec/trivy image myapp:latest
myapp:latest (debian 12.4)
Total: 47 (CRITICAL: 3, HIGH: 12, MEDIUM: 22, LOW: 10)

# 3 критические уязвимости -- потенциальный RCE!
```

### 4. Утечка секретов

```dockerfile
# ❌ Секреты в переменных окружения
ENV DATABASE_URL=postgres://admin:p@ssw0rd@db:5432/mydb

# ❌ Секреты в слоях образа (видны через docker history)
COPY .env /app/.env
RUN echo "API_KEY=sk-secret123" > /app/config
```

### 5. Сетевые атаки между контейнерами

```bash
# По умолчанию все контейнеры в bridge-сети видят друг друга
$ docker network inspect bridge
# Контейнер с уязвимостью может атаковать соседние контейнеры
```

---

## 📌 Запуск от непривилегированного пользователя

По умолчанию процесс в контейнере запускается от **root**. Это первая и самая критичная проблема.

### Почему root в контейнере -- это плохо

```bash
$ docker run --rm alpine id
uid=0(root) gid=0(root) groups=0(root)

# root в контейнере == root на хосте (UID 0)
# Если контейнер escape произойдёт, атакующий получит root на хосте
```

### Директива USER в Dockerfile

```dockerfile
# ❌ ПЛОХО: всё от root
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "server.js"]
# Процесс node работает от root!

# ✅ ХОРОШО: создаём и используем непривилегированного пользователя
FROM node:20-alpine
WORKDIR /app

# Создаём пользователя и группу
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Устанавливаем зависимости от root (нужны права на запись)
COPY package*.json ./
RUN npm ci --only=production

# Копируем код и меняем владельца
COPY --chown=appuser:appgroup . .

# Переключаемся на непривилегированного пользователя
USER appuser

# Теперь node работает от appuser
CMD ["node", "server.js"]
```

### Флаг --user при запуске

```bash
# Переопределение пользователя при запуске
$ docker run --user 1000:1000 nginx

# Использование имени пользователя
$ docker run --user nobody nginx

# Проверка
$ docker run --user 1000:1000 alpine id
uid=1000 gid=1000
```

### 💡 Пользователи в популярных образах

Многие официальные образы уже имеют непривилегированных пользователей:

| Образ | Пользователь | UID |
|-------|-------------|-----|
| node | node | 1000 |
| postgres | postgres | 999 |
| nginx | nginx | 101 |
| redis | redis | 999 |

```dockerfile
# Для Node.js можно использовать встроенного пользователя
FROM node:20-alpine
WORKDIR /app
COPY --chown=node:node . .
RUN npm ci --only=production
USER node
CMD ["node", "server.js"]
```

---

## 🔥 Linux Capabilities: тонкая настройка привилегий

В Linux привилегии root разделены на ~40 отдельных **capabilities** (возможностей). Docker по умолчанию выдаёт контейнеру ограниченный набор, но и он часто избыточен.

### Что такое Capabilities

```bash
# Основные capabilities:
# CAP_NET_BIND_SERVICE -- привязка к портам < 1024
# CAP_NET_RAW          -- использование raw сокетов (ping, tcpdump)
# CAP_CHOWN            -- смена владельца файлов
# CAP_SETUID           -- смена UID процесса
# CAP_SYS_ADMIN        -- монтирование FS, управление namespaces (ОПАСНО!)
# CAP_SYS_PTRACE       -- отладка процессов (ОПАСНО!)
# CAP_DAC_OVERRIDE     -- игнорирование прав доступа к файлам

# Посмотреть capabilities контейнера:
$ docker run --rm alpine sh -c 'apk add -q libcap && capsh --print'
Current: cap_chown,cap_dac_override,cap_fowner,cap_fsetid,...
```

### Drop и Add

```bash
# ❌ --privileged: ВСЕ capabilities (никогда не используйте в production!)
$ docker run --privileged alpine

# ✅ Убрать все, добавить только нужные
$ docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE nginx

# ✅ Убрать конкретные опасные capabilities
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

### Минимальные наборы для типичных сервисов

```yaml
# Web-сервер (nginx, caddy)
cap_drop: [ALL]
cap_add: [NET_BIND_SERVICE, CHOWN, SETUID, SETGID]

# Node.js / Python / Go приложение (порт > 1024)
cap_drop: [ALL]
# Не нужны дополнительные capabilities!

# База данных (PostgreSQL)
cap_drop: [ALL]
cap_add: [CHOWN, SETUID, SETGID, FOWNER, DAC_OVERRIDE]
```

### 📌 Правило минимальных привилегий

```
Принцип: начинайте с --cap-drop=ALL и добавляйте
только то, без чего контейнер не запускается.

НЕ наоборот: "уберём лишнее". Вы не знаете, что лишнее.
Лучше получить ошибку "operation not permitted" и добавить
конкретную capability, чем оставить лишние.
```

---

## 🔒 Seccomp и AppArmor профили

### Seccomp (Secure Computing Mode)

Seccomp фильтрует **системные вызовы**, которые контейнер может делать к ядру. Docker по умолчанию блокирует ~44 из ~300+ syscalls.

```bash
# Docker использует seccomp по умолчанию (профиль default)
# Заблокированы: mount, reboot, swapon, ptrace и другие опасные syscalls

# Проверить, что seccomp активен:
$ docker info | grep -i seccomp
Security Options: seccomp

# Запуск с кастомным профилем
$ docker run --security-opt seccomp=custom-profile.json nginx

# ❌ Отключение seccomp (НИКОГДА в production!)
$ docker run --security-opt seccomp=unconfined alpine
```

Пример кастомного seccomp-профиля:

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

AppArmor -- это система мандатного контроля доступа (MAC), которая ограничивает доступ контейнера к файлам, сети и capabilities.

```bash
# Проверить статус AppArmor
$ sudo aa-status

# Docker использует профиль docker-default по умолчанию
$ docker run --security-opt apparmor=docker-default nginx

# Кастомный профиль
$ docker run --security-opt apparmor=my-custom-profile nginx

# ❌ Отключение AppArmor
$ docker run --security-opt apparmor=unconfined nginx
```

Пример AppArmor-профиля:

```
#include <tunables/global>

profile docker-custom flags=(attach_disconnected) {
  #include <abstractions/base>

  # Разрешить чтение из /app
  /app/** r,

  # Разрешить выполнение node
  /usr/local/bin/node ix,

  # Запретить запись вне /tmp и /app/logs
  deny /etc/** w,
  deny /usr/** w,

  # Разрешить сеть
  network tcp,
  network udp,
}
```

---

## 📌 Read-only filesystem

Запуск контейнера с read-only filesystem не позволяет процессу создавать или модифицировать файлы. Это критическая защита от многих типов атак.

### Базовое использование

```bash
# Запуск с read-only root filesystem
$ docker run --read-only nginx

# Проблема: многие приложения пишут во временные файлы
# Решение: tmpfs для нужных директорий
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
      - app-logs:/app/logs  # Для логов используем named volume
```

### Что даёт read-only FS

```
✅ Защита от записи вредоносных файлов (бэкдоры, web shells)
✅ Защита от модификации конфигурации приложения
✅ Защита от подмены исполняемых файлов
✅ Упрощение аудита -- если файл изменился, что-то не так
✅ Предотвращение записи на диск (cryptominer хранение данных)

⚠️  Нужен tmpfs для:
  - /tmp (временные файлы)
  - PID-файлы (/var/run)
  - Кэш (nginx, varnish)
  - Сессии (PHP, Python)
```

### Опции tmpfs

```bash
# Ключевые опции tmpfs:
# rw       -- чтение и запись
# noexec   -- запрет выполнения бинарников (ВАЖНО!)
# nosuid   -- запрет setuid-бит
# size=NNm -- ограничение размера

# Оптимальная комбинация:
--tmpfs /tmp:rw,noexec,nosuid,size=64m
```

---

## 🔥 Сканирование уязвимостей

Каждый Docker-образ содержит ОС и пакеты, в которых регулярно находят уязвимости (CVE). Сканирование образов -- обязательная практика.

### Уровни серьёзности CVE

```
CRITICAL -- Удалённое выполнение кода без аутентификации (RCE).
            Требует немедленного исправления.
            Пример: Log4Shell (CVE-2021-44228)

HIGH     -- Серьёзная уязвимость, требующая определённых условий.
            Исправить в течение 1-2 дней.
            Пример: privilege escalation в ядре

MEDIUM   -- Уязвимость с ограниченным воздействием.
            Исправить в течение недели.

LOW      -- Минимальный риск, информационная уязвимость.
            Исправить при следующем обновлении.
```

### Docker Scout

```bash
# Встроенный в Docker Desktop сканер (с Docker Engine 25+)
$ docker scout cves myapp:latest

# Краткая сводка
$ docker scout quickview myapp:latest

# Только критические и высокие уязвимости
$ docker scout cves --only-severity critical,high myapp:latest

# Сравнение с предыдущей версией
$ docker scout compare myapp:latest --to myapp:previous

# Рекомендации по обновлению базового образа
$ docker scout recommendations myapp:latest
```

### Trivy (Aqua Security)

```bash
# Установка
$ brew install trivy  # macOS
$ apt install trivy    # Debian/Ubuntu

# Сканирование образа
$ trivy image myapp:latest

# Только критические
$ trivy image --severity CRITICAL myapp:latest

# Выход с ошибкой при наличии HIGH/CRITICAL (для CI)
$ trivy image --exit-code 1 --severity HIGH,CRITICAL myapp:latest

# Сканирование Dockerfile
$ trivy config Dockerfile

# Сканирование файловой системы (зависимости)
$ trivy fs --scanners vuln,secret .

# Формат JSON (для интеграции)
$ trivy image -f json -o results.json myapp:latest

# Игнорирование конкретных CVE
$ trivy image --ignore-unfixed myapp:latest
```

### Grype (Anchore)

```bash
# Установка
$ brew install grype

# Сканирование
$ grype myapp:latest

# Только критические
$ grype myapp:latest --only-fixed --fail-on critical

# Формат table/json/cyclonedx
$ grype myapp:latest -o json > results.json
```

### Snyk

```bash
# Сканирование
$ snyk container test myapp:latest

# Мониторинг (уведомления о новых CVE)
$ snyk container monitor myapp:latest

# Сканирование Dockerfile
$ snyk iac test Dockerfile
```

### Интеграция в CI/CD

```yaml
# GitHub Actions: сканирование при каждом push
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

      # Альтернатива: Docker Scout
      - name: Docker Scout
        uses: docker/scout-action@v1
        with:
          command: cves
          image: myapp:${{ github.sha }}
          only-severities: critical,high
          exit-code: true
```

### Автоматизация: периодическое сканирование

```yaml
# Cron job: сканирование всех production-образов раз в сутки
name: Nightly Security Scan
on:
  schedule:
    - cron: '0 2 * * *'  # Каждый день в 2:00

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

## 🔐 Подпись и верификация образов

Как убедиться, что скачанный образ -- именно тот, который был собран, и не был модифицирован?

### Docker Content Trust (DCT)

```bash
# Включение DCT
$ export DOCKER_CONTENT_TRUST=1

# Теперь docker pull и docker push будут проверять/создавать подписи
$ docker pull nginx:latest
# Pull (1 of 1): nginx:latest@sha256:abc123...
# Tagging nginx@sha256:abc123... as nginx:latest
# sha256:abc123... -- подпись проверена

# Подпись при push
$ docker push myregistry/myapp:latest
# Signing and pushing trust metadata...

# Отключение для конкретной команды
$ DOCKER_CONTENT_TRUST=0 docker pull untrusted/image
```

### Cosign (Sigstore)

Современный инструмент подписи OCI-артефактов.

```bash
# Установка
$ brew install cosign

# Генерация ключей
$ cosign generate-key-pair
# Создаёт cosign.key (приватный) и cosign.pub (публичный)

# Подпись образа
$ cosign sign --key cosign.key myregistry/myapp:v1.0

# Верификация
$ cosign verify --key cosign.pub myregistry/myapp:v1.0

# Keyless signing (через OIDC -- GitHub, Google, Microsoft)
$ cosign sign myregistry/myapp:v1.0
# Откроет браузер для аутентификации

# Верификация keyless-подписи
$ cosign verify \
  --certificate-identity=user@example.com \
  --certificate-oidc-issuer=https://accounts.google.com \
  myregistry/myapp:v1.0
```

### Интеграция подписи в CI/CD

```yaml
# GitHub Actions: подпись после сборки
- name: Sign image with cosign
  env:
    COSIGN_KEY: ${{ secrets.COSIGN_KEY }}
  run: |
    cosign sign --key env://COSIGN_KEY \
      myregistry/myapp:${{ github.sha }}
```

---

## 🔑 Управление секретами

Секреты (пароли, API-ключи, сертификаты) -- одна из самых частых причин утечек в Docker.

### ❌ Как НЕ надо хранить секреты

```dockerfile
# ❌ ПЛОХО: секрет в переменной окружения Dockerfile
ENV API_KEY=sk-secret-key-12345

# ❌ ПЛОХО: секрет в ARG (виден в docker history)
ARG DB_PASSWORD=mysecretpassword
RUN echo "password=$DB_PASSWORD" > /app/config

# ❌ ПЛОХО: копирование .env файла в образ
COPY .env /app/.env

# ❌ ПЛОХО: секрет в docker-compose.yml в git
environment:
  - DATABASE_URL=postgres://admin:password@db/mydb
```

```bash
# Проверка: секреты видны через docker history!
$ docker history myapp:latest
... ENV API_KEY=sk-secret-key-12345  ...
# Любой, кто скачает образ, увидит ваш ключ!
```

### ✅ BuildKit secrets (для сборки)

```dockerfile
# Dockerfile: секрет доступен только в одной RUN-команде,
# НЕ сохраняется в слоях образа
# syntax=docker/dockerfile:1
FROM node:20-alpine

WORKDIR /app
COPY package*.json ./

# Секрет монтируется как файл, доступен только во время RUN
RUN --mount=type=secret,id=npm_token \
  NPM_TOKEN=$(cat /run/secrets/npm_token) \
  npm ci

COPY . .
CMD ["node", "server.js"]
```

```bash
# Передача секрета при сборке
$ docker build --secret id=npm_token,src=.npm_token .

# Из переменной окружения
$ docker build --secret id=npm_token,env=NPM_TOKEN .
```

### ✅ Docker Secrets (Docker Swarm)

```bash
# Создание секрета
$ echo "my-secret-password" | docker secret create db_password -

# Использование в service
$ docker service create \
  --name myapp \
  --secret db_password \
  myapp:latest

# В контейнере секрет доступен как файл
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
    external: true  # Создан через docker secret create
    # или
    file: ./secrets/db_password.txt  # Из файла (для dev)
```

### ✅ Runtime secrets через volumes

```bash
# Монтирование файла с секретом (не в образе!)
$ docker run -v /secure/secrets/api_key:/run/secrets/api_key:ro myapp

# В приложении:
# const apiKey = fs.readFileSync('/run/secrets/api_key', 'utf8').trim()
```

### ✅ Внешние менеджеры секретов

```bash
# HashiCorp Vault
$ vault kv get -field=password secret/myapp/db

# AWS Secrets Manager
$ aws secretsmanager get-secret-value --secret-id myapp/db

# В Kubernetes: External Secrets Operator
# В Docker Compose: env_file с .gitignore
```

---

## 🌐 Сетевая изоляция

### Принцип наименьших привилегий для сети

```yaml
# ❌ ПЛОХО: все сервисы в одной сети
services:
  frontend:
    networks: [default]
  api:
    networks: [default]
  db:
    networks: [default]
  redis:
    networks: [default]
# frontend может напрямую обращаться к db!

# ✅ ХОРОШО: сегментация сетей
services:
  frontend:
    networks:
      - frontend-net

  api:
    networks:
      - frontend-net  # Принимает запросы от frontend
      - backend-net   # Обращается к db и redis

  db:
    networks:
      - backend-net   # Доступен только для api

  redis:
    networks:
      - backend-net   # Доступен только для api

networks:
  frontend-net:
    driver: bridge
  backend-net:
    driver: bridge
    internal: true  # Нет доступа в интернет!
```

### Ограничение ICC (Inter-Container Communication)

```bash
# Отключение прямого общения между контейнерами в сети
$ docker network create --opt com.docker.network.bridge.enable_icc=false isolated-net

# Контейнеры в этой сети не могут общаться друг с другом,
# только через опубликованные порты
```

### Запрет открытия лишних портов

```yaml
# ❌ ПЛОХО: открываем порт БД наружу
services:
  db:
    ports:
      - "5432:5432"  # Доступна с любого хоста!

# ✅ ХОРОШО: БД доступна только через внутреннюю сеть
services:
  db:
    expose:
      - "5432"  # Доступна только внутри Docker-сети
    # Нет секции ports!
```

---

## ⚙️ Ограничение ресурсов

Без ограничений один контейнер может потребить **все** ресурсы хоста, создавая DoS для остальных.

### Память

```bash
# Жёсткий лимит памяти
$ docker run --memory=256m myapp

# Лимит с swap
$ docker run --memory=256m --memory-swap=512m myapp

# Отключение swap (рекомендуется)
$ docker run --memory=256m --memory-swap=256m myapp
```

### CPU

```bash
# Ограничение количества CPU
$ docker run --cpus=0.5 myapp  # Полядра

# CPU shares (относительный приоритет)
$ docker run --cpu-shares=512 myapp  # По умолчанию 1024

# Привязка к конкретным ядрам
$ docker run --cpuset-cpus="0,1" myapp
```

### Процессы (PID limit)

```bash
# Ограничение количества процессов (защита от fork bomb)
$ docker run --pids-limit=100 myapp

# ❌ Без лимита: fork bomb убьёт хост
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

### Ограничение дискового I/O

```bash
# Лимит скорости чтения/записи
$ docker run --device-read-bps /dev/sda:10mb \
             --device-write-bps /dev/sda:10mb \
             myapp

# Лимит IOPS
$ docker run --device-read-iops /dev/sda:1000 \
             --device-write-iops /dev/sda:1000 \
             myapp
```

---

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Запуск с --privileged

```bash
# ❌ ПЛОХО: "не работает, добавлю --privileged"
$ docker run --privileged myapp

# --privileged отключает ВСЕ защиты:
# - Все capabilities
# - Seccomp отключён
# - AppArmor отключён
# - Доступ ко всем устройствам хоста
# - Возможность монтирования файловых систем

# ✅ ХОРОШО: найти конкретную capability
$ docker run --cap-add=NET_ADMIN myapp
# Если нужен --privileged, скорее всего архитектура неправильная
```

### Ошибка 2: Docker socket в контейнере

```bash
# ❌ ПЛОХО: монтирование docker.sock
$ docker run -v /var/run/docker.sock:/var/run/docker.sock myapp

# Это даёт контейнеру ПОЛНЫЙ контроль над Docker daemon.
# Эквивалент root-доступа к хосту.

# ✅ Если нужно управлять Docker из контейнера:
# Используйте Docker API с аутентификацией и ограниченным доступом
# Или rootless Docker / Podman
```

### Ошибка 3: Секреты в ENV и слоях образа

```dockerfile
# ❌ ПЛОХО
ENV DATABASE_PASSWORD=secret123

# Видно через:
$ docker inspect container_id | jq '.[0].Config.Env'
$ docker history myapp:latest

# ✅ ХОРОШО: BuildKit secrets для сборки, volumes/secrets для runtime
RUN --mount=type=secret,id=db_pass cat /run/secrets/db_pass
```

### Ошибка 4: Использование тега latest

```dockerfile
# ❌ ПЛОХО: непредсказуемо, что будет в latest завтра
FROM node:latest
FROM ubuntu:latest

# ✅ ХОРОШО: фиксированная версия + digest
FROM node:20.11.0-alpine3.19
# Ещё лучше: с sha256 digest
FROM node:20.11.0-alpine3.19@sha256:1a2b3c4d5e6f...
```

### Ошибка 5: Отсутствие ограничений ресурсов

```yaml
# ❌ ПЛОХО: нет лимитов
services:
  api:
    image: myapp

# Один зависший контейнер может потребить всю память хоста
# и привести к OOM killer для других сервисов

# ✅ ХОРОШО: всегда ставьте лимиты
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

### Ошибка 6: Все сервисы в одной сети без сегментации

```yaml
# ❌ ПЛОХО: frontend имеет доступ к базе данных
services:
  frontend: { networks: [default] }
  api: { networks: [default] }
  db: { networks: [default] }

# Если frontend скомпрометирован, атакующий получает доступ к БД

# ✅ ХОРОШО: сегментация
services:
  frontend: { networks: [public] }
  api: { networks: [public, internal] }
  db: { networks: [internal] }
networks:
  internal: { internal: true }
```

---

## 💡 Best Practices и чеклист безопасности

### Чеклист безопасности Docker

```
Образы:
  □ Используйте минимальные базовые образы (alpine, distroless, scratch)
  □ Фиксируйте версии базовых образов (не latest)
  □ Используйте digest (@sha256:...) для критичных образов
  □ Сканируйте образы на уязвимости (trivy, scout, grype)
  □ Подписывайте образы (cosign, DCT)
  □ Используйте multi-stage builds
  □ Не включайте в образ исходный код, тесты, dev-зависимости

Dockerfile:
  □ Директива USER -- непривилегированный пользователь
  □ COPY вместо ADD (ADD распаковывает архивы, скачивает URL)
  □ .dockerignore -- исключите .git, .env, node_modules, secrets
  □ HEALTHCHECK для мониторинга состояния
  □ Нет секретов в ENV, ARG или COPY

Runtime:
  □ --cap-drop=ALL + только нужные --cap-add
  □ --read-only + tmpfs для записи
  □ --security-opt=no-new-privileges
  □ Ограничение ресурсов (--memory, --cpus, --pids-limit)
  □ Не монтируйте docker.sock
  □ Не используйте --privileged

Секреты:
  □ BuildKit secrets для сборки (--mount=type=secret)
  □ Docker secrets или volume mounts для runtime
  □ Внешний менеджер секретов (Vault, AWS SM) для production
  □ Ротация секретов по расписанию

Сеть:
  □ Сегментация сетей (frontend/backend/internal)
  □ internal: true для сетей без доступа в интернет
  □ expose вместо ports для внутренних сервисов
  □ Не открывайте порты БД наружу

CI/CD:
  □ Сканирование на каждый push (trivy-action, scout-action)
  □ Блокировка merge при CRITICAL/HIGH CVE
  □ Периодическое сканирование production-образов
  □ Автоматическое обновление базовых образов (Renovate, Dependabot)
```

### Флаг --security-opt=no-new-privileges

```bash
# Предотвращает получение дополнительных привилегий через setuid/setgid
$ docker run --security-opt=no-new-privileges myapp

# Даже если в контейнере есть setuid-бинарник, он не получит root-привилегии
# Рекомендуется ВСЕГДА использовать в production
```

### Rootless Docker

```bash
# Docker daemon работает без root-привилегий
# Даже container escape не даёт root на хосте

# Установка rootless Docker
$ dockerd-rootless-setuptool.sh install

# Проверка
$ docker info | grep -i rootless
# rootless: true

# Ограничения:
# - Нет --privileged
# - Нет cgroup v1
# - Порты < 1024 недоступны без настройки
```

### Полный пример безопасного Dockerfile

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

# Метаданные
LABEL maintainer="team@example.com"
LABEL org.opencontainers.image.source="https://github.com/example/myapp"

WORKDIR /app

# Копируем только то, что нужно
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Distroless уже работает от непривилегированного пользователя (nonroot)
USER nonroot

# Healthcheck
# (в distroless нет curl, используем приложение)
# HEALTHCHECK отсутствует -- используйте orchestrator health checks

EXPOSE 3000
CMD ["dist/server.js"]
```

```yaml
# docker-compose.yml для production
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

## 📋 Итоги

Безопасность Docker -- это **не одна настройка**, а комплексный подход:

| Уровень | Что защищаем | Инструменты |
|---------|-------------|-------------|
| Образ | Supply chain, уязвимости | Сканеры (trivy, scout), подпись (cosign), минимальные образы |
| Dockerfile | Секреты, привилегии | USER, BuildKit secrets, multi-stage, .dockerignore |
| Runtime | Побег из контейнера | cap_drop, read-only, seccomp, no-new-privileges |
| Ресурсы | DoS, fork bomb | --memory, --cpus, --pids-limit |
| Сеть | Lateral movement | Сегментация сетей, internal, expose vs ports |
| Секреты | Утечка credentials | Docker secrets, Vault, volume mounts |

Главный принцип: **Defense in Depth** (эшелонированная оборона). Ни одна мера безопасности не идеальна, но их комбинация делает атаку значительно сложнее.

```
Без защиты:       ─────────────> ХОСТ (1 шаг)

С защитой:  CAP_DROP → READ-ONLY → NO-NEW-PRIV → SECCOMP → USER
            Каждый слой останавливает определённые атаки.
            Пробить все 5 слоёв -- на порядки сложнее.
```
