# Уровень 8: Переменные окружения и конфигурация -- полный разбор

## Введение

Представьте ресторан с несколькими филиалами. Рецепты блюд одинаковые -- один и тот же повар написал их в кулинарной книге. Но в каждом филиале используются свои поставщики, свои цены, свой адрес доставки, свои логины от кассовой системы. Кулинарная книга не меняется -- меняется только "настроечная карточка" конкретного филиала.

В мире Docker ваш образ -- это кулинарная книга, а переменные окружения и конфигурационные файлы -- это настроечные карточки для каждого филиала (dev, staging, production). Один и тот же образ должен работать в любом окружении, не требуя пересборки. Меняется только конфигурация.

Это один из ключевых принципов контейнеризации: **код и конфигурация живут отдельно**. Нарушение этого принципа приводит к утечкам паролей, невоспроизводимым багам и бессонным ночам дежурного инженера.

На этом уровне мы подробно разберём:

1. **Проблему захардкоженных секретов** -- почему пароли в коде и YAML-файлах опасны
2. **ENV и ARG в Dockerfile** -- чем отличаются и когда использовать каждый
3. **Переменные окружения при запуске** -- флаги `-e`, `--env-file` и приоритеты
4. **.env файлы** -- синтаксис, интеграция с Compose, подстановка переменных
5. **Docker Secrets** -- безопасная передача паролей и ключей
6. **Docker Configs** -- несекретные конфигурационные файлы
7. **Шаблоны для нескольких окружений** -- как организовать dev/staging/prod
8. **YAML-якоря** -- DRY-подход к конфигурации Compose
9. **Типичные ошибки** -- что обычно идёт не так и как этого избежать

---

## 1. Проблема: захардкоженные пароли

### Как выглядит катастрофа

Разработчик торопится запустить проект и описывает стек прямо в `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: super_secret_123    # Пароль прямо в файле
      POSTGRES_USER: admin

  api:
    build: ./api
    environment:
      DATABASE_URL: postgresql://admin:super_secret_123@db:5432/myapp
      JWT_SECRET: my-jwt-secret-key          # Ещё один секрет
      STRIPE_API_KEY: sk_live_abc123         # Платёжный ключ
```

Файл коммитится в Git. Даже если разработчик позже удалит пароли -- они **навсегда** останутся в истории коммитов. Любой участник команды (или злоумышленник при утечке репозитория) получит полный доступ к базе данных, платёжной системе и механизму авторизации.

### Реальные масштабы проблемы

По данным исследований GitGuardian, в 2023 году в публичных репозиториях GitHub было обнаружено более 12 миллионов утёкших секретов. Самые частые случаи -- именно пароли к базам данных и API-ключи, захардкоженные в конфигурационных файлах.

### Что предоставляет Docker

Docker предлагает несколько механизмов для решения этой проблемы, от простых до продвинутых:

```mermaid
flowchart TD
    config["Конфигурация приложения"]
    config --> nonsecret["Несекретные данные<br/>порты, режимы, уровни логирования"]
    config --> secret["Секретные данные<br/>пароли, ключи, токены"]

    nonsecret --> env["ENV в Dockerfile"]
    nonsecret --> envflag["-e / env_file"]
    nonsecret --> configs["Docker Configs"]

    secret --> envfile[".env файлы вне Git"]
    secret --> secrets["Docker Secrets"]
    secret --> external["Внешние хранилища<br/>Vault, AWS Secrets Manager"]

    style secret fill:#e74c3c,color:#fff
    style nonsecret fill:#2ecc71,color:#fff
    style secrets fill:#3498db,color:#fff
    style external fill:#3498db,color:#fff
```

Каждый механизм занимает свою нишу. Простые переменные -- для порта и уровня логирования. Секреты -- для паролей и ключей. Чем чувствительнее данные, тем более защищённый механизм нужно использовать.

---

## 2. ENV и ARG в Dockerfile

### Инструкция ENV

`ENV` задаёт переменные окружения, которые доступны **и при сборке, и при запуске** контейнера. Это важно понимать -- переменная, установленная через `ENV`, становится частью образа и будет присутствовать во всех контейнерах, созданных из этого образа.

```dockerfile
FROM node:20-alpine

# Каждая переменная -- отдельная инструкция
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV LOG_LEVEL=info

WORKDIR /app
EXPOSE $APP_PORT
CMD ["node", "server.js"]
```

Когда вы запускаете контейнер из этого образа, приложение внутри увидит `process.env.NODE_ENV === 'production'`, `process.env.APP_PORT === '3000'` и `process.env.LOG_LEVEL === 'info'` -- даже если вы не передали никаких флагов при `docker run`.

### Инструкция ARG

`ARG` -- это переменная **только для этапа сборки**. Она существует, пока выполняется `docker build`, и после этого исчезает. В работающем контейнере её уже нет.

```dockerfile
# ARG можно использовать ДО FROM
ARG NODE_VERSION=20

FROM node:${NODE_VERSION}-alpine

# ARG после FROM нужно переобъявить -- предыдущий "забывается"
ARG BUILD_DATE
ARG APP_VERSION=1.0.0

# Метаданные образа
LABEL build-date=${BUILD_DATE}
LABEL version=${APP_VERSION}

ENV NODE_ENV=production
```

Обратите внимание на важный нюанс: `ARG`, объявленный до `FROM`, доступен только в строке `FROM`. После `FROM` начинается новый "скоуп", и все предыдущие `ARG` нужно переобъявлять.

### Когда что использовать

Аналогия: `ARG` -- это строительные леса. Они нужны, пока строится здание, а потом убираются. `ENV` -- это таблички на дверях квартир. Они остаются и после строительства, потому что жильцам нужно знать номер квартиры.

```mermaid
sequenceDiagram
    participant Dev as Разработчик
    participant Build as docker build
    participant Image as Образ
    participant Run as docker run
    participant Container as Контейнер

    Dev->>Build: --build-arg VERSION=2.1
    Note over Build: ARG доступен здесь
    Note over Build: ENV доступен здесь
    Build->>Image: Готовый образ
    Note over Image: ARG потерян
    Note over Image: ENV сохранён
    Dev->>Run: -e LOG_LEVEL=debug
    Run->>Container: Запуск
    Note over Container: ENV из образа + переопределения
    Note over Container: ARG недоступен
```

### Сравнительная таблица

| Характеристика | ARG | ENV |
|----------------|-----|-----|
| Доступен при `docker build` | да | да |
| Доступен при `docker run` | нет | да |
| Переопределяется через `--build-arg` | да | нет |
| Переопределяется через `-e` / `--env` | нет | да |
| Сохраняется в образе | нет | да |
| Подходит для секретов | нет | нет |

Обратите внимание на последнюю строку. Ни `ARG`, ни `ENV` не подходят для секретов. `ARG` видны через `docker history`, а `ENV` -- через `docker inspect`.

### Паттерн: передача ARG в ENV

Часто нужно, чтобы значение, переданное при сборке, было доступно и при запуске. Для этого используется "мост" между `ARG` и `ENV`:

```dockerfile
ARG APP_VERSION=1.0.0
# "Мост": значение ARG копируется в ENV
ENV APP_VERSION=${APP_VERSION}
```

Это полезно, например, для версии приложения -- вы хотите задать её при сборке в CI/CD, но приложение внутри контейнера тоже должно знать свою версию (для метрик, логов, healthcheck-эндпоинтов).

```bash
# При сборке в CI/CD
docker build --build-arg APP_VERSION=$(git describe --tags) -t myapp .
```

### Ловушка ARG и секреты

Значения `ARG` сохраняются в метаданных образа. Это означает, что любой, кто скачает ваш образ, может выполнить одну команду и увидеть все секреты:

```bash
# Так делать нельзя!
docker build --build-arg DB_PASSWORD=secret123 .

# Любой пользователь образа увидит:
docker history myapp
# STEP  CREATED BY
# ...   ARG DB_PASSWORD=secret123   # Виден всем!
```

Для передачи секретов при сборке используйте `--secret` (BuildKit):

```bash
# Правильный способ -- секрет не попадает в метаданные образа
echo "secret123" > /tmp/db_password
docker build --secret id=db_password,src=/tmp/db_password .
```

```dockerfile
# В Dockerfile
RUN --mount=type=secret,id=db_password \
    cat /run/secrets/db_password | some-command
```

---

## 3. Переменные окружения при запуске контейнера

### Флаг -e

Флаг `-e` (или `--env`) -- самый прямой способ передать переменную в контейнер:

```bash
# Одна переменная
docker run -e NODE_ENV=production myapp

# Несколько переменных
docker run \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://user:pass@db:5432/myapp \
  -e REDIS_URL=redis://redis:6379 \
  myapp
```

Есть удобный приём -- передать переменную из хостовой системы без указания значения. Docker возьмёт значение из окружения хоста:

```bash
export API_KEY=abc123
docker run -e API_KEY myapp
# Контейнер получит API_KEY=abc123 -- значение взято с хоста
```

Это полезно в CI/CD, где секреты часто задаются как переменные окружения runner-а.

### Флаг --env-file

Когда переменных много, перечислять каждую через `-e` неудобно. Флаг `--env-file` загружает переменные из файла:

```bash
docker run --env-file .env myapp

# Можно указать несколько файлов
docker run --env-file .env --env-file .env.local myapp
```

### Приоритет переменных

Если одна и та же переменная задана в нескольких местах, Docker применяет чёткую иерархию приоритетов -- от высшего к низшему:

```
1. docker run -e VAR=value          -- флаг -e, высший приоритет
2. docker run --env-file .env       -- файл с переменными
3. ENV VAR=value в Dockerfile       -- значение из образа, низший приоритет
```

Эта иерархия логична: более конкретное переопределяет более общее. Образ задаёт дефолты, файл окружения -- настройки среды, а флаг `-e` -- точечные переопределения.

Пример в действии:

```dockerfile
# Dockerfile
ENV LOG_LEVEL=info
```

```bash
# .env файл
LOG_LEVEL=warn
```

```bash
# Запуск -- что победит?
docker run --env-file .env -e LOG_LEVEL=debug myapp
# Результат: LOG_LEVEL=debug (флаг -e побеждает)
```

### Проверка переменных контейнера

Если нужно узнать, какие переменные получил контейнер, используйте `docker exec` или `docker inspect`:

```bash
# Увидеть все переменные внутри работающего контейнера
docker exec mycontainer env

# Или через inspect -- видны даже для остановленных контейнеров
docker inspect mycontainer --format='{{json .Config.Env}}'
```

---

## 4. Файлы .env: синтаксис и работа с Docker Compose

### Синтаксис .env файла

Файл `.env` -- это простой текстовый файл с парами `КЛЮЧ=значение`. Синтаксис несложный, но имеет свои нюансы:

```bash
# .env -- переменные окружения

# Комментарии начинаются с #

# Простое присваивание -- самый частый случай
NODE_ENV=production
APP_PORT=3000

# Значения в кавычках -- нужны для пробелов и спецсимволов
APP_NAME="My Docker App"
GREETING='Hello, World!'

# Без кавычек пробелы обрезаются
DB_HOST=localhost

# Пустое значение -- переменная существует, но пуста
EMPTY_VAR=

# Многострочные значения -- в двойных кавычках
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA...
-----END RSA PRIVATE KEY-----"
```

Что **не поддерживается** в `.env` файлах Docker:

```bash
# Не работает: export
export VAR=value

# Не работает: подстановка переменных
VAR=${OTHER_VAR}

# Не работает: выполнение команд
VAR=$(date)
```

Это частый источник путаницы для тех, кто привык к bash-скриптам, где все эти конструкции работают.

### Автоматическая загрузка .env в Docker Compose

Docker Compose автоматически ищет файл `.env` в директории проекта (рядом с `docker-compose.yml`) и загружает его. Никакой дополнительной конфигурации не нужно:

```
project/
  docker-compose.yml
  .env                  # Загружается автоматически
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

### Подстановка переменных -- мощный механизм

Docker Compose поддерживает не просто подстановку `${VAR}`, а целый набор модификаторов, заимствованных из bash. Они позволяют задавать дефолты, делать переменные обязательными и даже выводить ошибки:

```yaml
services:
  api:
    image: myapp:${TAG}

    environment:
      # Значение по умолчанию, если VAR не задан ИЛИ пуст
      NODE_ENV: ${NODE_ENV:-production}

      # Значение по умолчанию, если VAR не задан, но пустая строка -- OK
      LOG_LEVEL: ${LOG_LEVEL-info}

      # Ошибка при запуске, если переменная не задана
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Альтернативное значение -- подставляется, только если VAR задан и не пуст
      DEBUG: ${DEBUG:+true}
```

Разберём подробно каждый модификатор:

| Синтаксис | Что делает | VAR не задан | VAR="" | VAR="hello" |
|-----------|-----------|-------------|--------|-------------|
| `${VAR}` | Просто подставляет | пусто | пусто | hello |
| `${VAR:-default}` | Дефолт, если не задан или пуст | default | default | hello |
| `${VAR-default}` | Дефолт, только если не задан | default | пусто | hello |
| `${VAR:?error}` | Ошибка, если не задан или пуст | ERROR | ERROR | hello |
| `${VAR?error}` | Ошибка, только если не задан | ERROR | пусто | hello |
| `${VAR:+alt}` | Alt, если задан и не пуст | пусто | пусто | alt |

Разница между `:-` и `-` (с двоеточием и без) -- в обработке пустой строки. Версия с двоеточием считает пустую строку "незаданной", версия без двоеточия -- "заданной".

На практике чаще всего используются `:-` (дефолт) и `:?` (обязательная переменная):

```yaml
environment:
  # Некритичные -- с дефолтами
  NODE_ENV: ${NODE_ENV:-development}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  TZ: ${TZ:-UTC}

  # Критичные -- с ошибкой при отсутствии
  DB_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}
  JWT_SECRET: ${JWT_SECRET:?Set JWT_SECRET in .env}
```

### Два механизма: .env для Compose vs env_file для контейнера

Это одно из самых частых заблуждений у новичков. В Docker Compose существуют **два разных механизма** передачи переменных, и они работают на разных этапах:

```mermaid
flowchart TD
    dotenv[".env файл"]
    envfile["env_file в YAML"]
    compose["docker-compose.yml"]
    container["Контейнер"]

    dotenv -->|"Подстановка ${VAR}<br/>в YAML-файл"| compose
    compose -->|"environment: KEY=VALUE"| container
    envfile -->|"Передача переменных<br/>напрямую в контейнер"| container

    style dotenv fill:#f39c12,color:#fff
    style envfile fill:#3498db,color:#fff
    style compose fill:#95a5a6,color:#fff
    style container fill:#2ecc71,color:#fff
```

**Файл `.env`** -- это инструмент самого Compose. Он подставляет значения в YAML-файл до запуска контейнеров. Это **интерполяция** -- замена `${VAR}` на конкретные значения.

**Директива `env_file`** -- это инструмент контейнера. Она берёт все пары `KEY=VALUE` из указанного файла и передаёт их внутрь контейнера как переменные окружения.

```yaml
services:
  api:
    ports:
      - '${APP_PORT}:3000'       # APP_PORT берётся из .env (интерполяция)
    env_file:
      - .env.app                  # Эти переменные попадут ВНУТРЬ контейнера
    environment:
      APP_PORT: ${APP_PORT}       # Явная передача APP_PORT внутрь контейнера
```

### Несколько .env файлов

Начиная с Compose v2.17 можно указывать несколько файлов в `env_file`:

```yaml
services:
  api:
    env_file:
      - .env              # Базовые переменные
      - .env.local         # Локальные переопределения
      - .env.${ENV:-dev}   # Переменные для конкретного окружения
```

Или переопределить файл `.env` через CLI:

```bash
docker compose --env-file .env.staging up -d
```

### Приоритет переменных в Docker Compose

Docker Compose собирает переменные из нескольких источников. Вот их приоритет от высшего к низшему:

```
1. environment: в docker-compose.yml    -- явное значение, высший приоритет
2. Shell-переменные хоста               -- export VAR=value
3. env_file: в docker-compose.yml       -- файл для сервиса
4. .env файл в директории проекта       -- автоматическая загрузка
5. ENV в Dockerfile                     -- образ, низший приоритет
```

Понимание этой иерархии критически важно для отладки. Если переменная имеет неожиданное значение -- проверьте все пять уровней.

---

## 5. Docker Secrets: безопасное хранение секретов

### Почему переменные окружения не подходят для паролей

Переменные окружения удобны, но у них есть фундаментальная проблема -- они **видны** множеством способов:

```bash
# Через docker inspect -- без доступа внутрь контейнера
docker inspect mycontainer --format='{{json .Config.Env}}'
# ["DB_PASSWORD=super_secret_123", "JWT_SECRET=my-secret"]

# Через /proc внутри контейнера
docker exec mycontainer cat /proc/1/environ
# DB_PASSWORD=super_secret_123

# Через логи приложения -- случайный console.log
console.log('Config:', process.env)  # Выведет ВСЕ переменные, включая пароли
```

Для dev-окружения это допустимо -- удобство важнее безопасности на локальной машине. Но для production нужен другой подход.

### Как работают Docker Secrets

Docker Secrets -- это механизм передачи конфиденциальных данных через файлы, а не через переменные окружения:

```mermaid
flowchart LR
    secret_file["secrets/db_password.txt"]
    compose["docker-compose.yml<br/>secrets: db_password"]
    tmpfs["tmpfs в контейнере<br/>/run/secrets/db_password"]
    app["Приложение<br/>читает файл"]

    secret_file --> compose
    compose --> tmpfs
    tmpfs --> app

    style secret_file fill:#e74c3c,color:#fff
    style tmpfs fill:#3498db,color:#fff
    style app fill:#2ecc71,color:#fff
```

Ключевые свойства:
- Секреты монтируются как файлы в `/run/secrets/<name>`
- В Docker Swarm они хранятся зашифрованными и передаются только нужным нодам
- Они не видны через `docker inspect`
- Они не попадают в переменные окружения и не "утекут" через `console.log(process.env)`

### Настройка секретов в Compose

Создайте файлы с секретами:

```bash
# Важно: без переноса строки в конце!
echo -n "super_secret_123" > secrets/db_password.txt
echo -n "postgresql://postgres:super_secret_123@db:5432/myapp" > secrets/database_url.txt
```

Опишите секреты в `docker-compose.yml`:

```yaml
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      # Обратите внимание: _FILE, а не просто POSTGRES_PASSWORD
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password           # Какие секреты доступны этому сервису

  api:
    build: ./api
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
    secrets:
      - database_url
      - jwt_secret

# Определение секретов -- откуда брать данные
secrets:
  db_password:
    file: ./secrets/db_password.txt     # Из локального файла
  database_url:
    file: ./secrets/database_url.txt
  jwt_secret:
    environment: JWT_SECRET             # Из переменной окружения хоста
```

Последний вариант (`environment: JWT_SECRET`) доступен начиная с Compose v2.23.

### Чтение секретов в приложении

Ваше приложение должно уметь читать секреты из файлов. Вот универсальный паттерн с fallback на переменные окружения:

```javascript
// Node.js
const fs = require('fs')

function getSecret(name) {
  const secretPath = `/run/secrets/${name}`
  try {
    return fs.readFileSync(secretPath, 'utf8').trim()
  } catch {
    // Fallback на переменную окружения -- для dev-окружения
    return process.env[name.toUpperCase()]
  }
}

const dbPassword = getSecret('db_password')
const jwtSecret = getSecret('jwt_secret')
```

```python
# Python
import os

def get_secret(name):
    secret_path = f'/run/secrets/{name}'
    try:
        with open(secret_path, 'r') as f:
            return f.read().strip()
    except FileNotFoundError:
        return os.environ.get(name.upper())
```

Fallback на `process.env` делает код универсальным -- в development переменные передаются обычным способом, в production -- через секреты. Один код для обоих окружений.

### Суффикс _FILE в официальных образах

Многие официальные образы (PostgreSQL, MySQL, MariaDB, MongoDB) поддерживают конвенцию `_FILE`. Если вместо `POSTGRES_PASSWORD` вы задаёте `POSTGRES_PASSWORD_FILE`, образ сам прочитает пароль из указанного файла:

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

Это означает, что вам не нужно менять код образа -- достаточно переключить переменную с `PASSWORD` на `PASSWORD_FILE`.

---

## 6. Docker Configs: несекретные конфигурационные файлы

### Когда нужны Configs

Не вся конфигурация -- это секреты. Файл `nginx.conf`, настройки Prometheus, правила Grafana -- это обычные конфигурационные файлы, которые не содержат паролей, но которые нужно доставить внутрь контейнера.

### Configs vs Secrets vs Volumes

| Характеристика | Secrets | Configs | Bind mount |
|----------------|---------|---------|------------|
| Назначение | Пароли, ключи, токены | nginx.conf, prometheus.yml | Любые файлы |
| Путь в контейнере | `/run/secrets/<name>` | Настраиваемый | Настраиваемый |
| Шифрование в Swarm | Да | Нет | Нет |
| Изменяемость | Неизменяемые | Неизменяемые | Изменяемые |
| Живое обновление | Нет | Нет | Да |
| Репликация в Swarm | Да | Да | Нет |

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

### Когда что использовать

Аналогия: представьте офис. **Secrets** -- это сейф с паролями и ключами от серверной комнаты. **Configs** -- это должностные инструкции и регламенты, распечатанные и положенные на стол каждому сотруднику. **Bind mount** -- это общая папка на сетевом диске, в которую все могут писать и читать в реальном времени.

- **Для разработки** -- bind mount (изменения применяются мгновенно, без перезапуска)
- **Для production** -- configs (иммутабельность, репликация в кластере)
- **Для секретов** -- всегда secrets

---

## 7. Шаблоны конфигурации для нескольких окружений

### Принципы 12-factor app

Методология 12-factor app формулирует три ключевых правила для конфигурации:

1. **Конфигурация хранится в переменных окружения** -- не в коде, не в конфиг-файлах внутри репозитория
2. **Код не различает окружения** -- один и тот же образ для dev, staging и prod
3. **Секреты никогда не хардкодятся** -- даже "временно", даже для dev-окружения

Это не абстрактная теория -- это практический подход, который позволяет избежать целого класса ошибок: "работает на моей машине, но падает в production".

### Структура проекта

Вот как выглядит хорошо организованный проект с несколькими окружениями:

```
project/
  docker-compose.yml            # Базовая конфигурация -- в Git
  docker-compose.override.yml   # Dev-настройки -- в .gitignore
  docker-compose.prod.yml       # Production-переопределения -- в Git
  docker-compose.staging.yml    # Staging-переопределения -- в Git

  .env                          # Dev-переменные по умолчанию -- в .gitignore
  .env.example                  # Шаблон .env для новых разработчиков -- в Git
  .env.staging                  # Staging-переменные -- в .gitignore или CI
  .env.prod                     # Production-переменные -- в .gitignore или CI

  secrets/                      # Секреты -- в .gitignore!
    db_password.txt
    jwt_secret.txt

  .gitignore
```

Принцип прост: файлы с реальными значениями -- вне Git, файлы со структурой и шаблонами -- в Git.

### Как работает мержинг в Compose

Docker Compose умеет объединять несколько YAML-файлов. По умолчанию он ищет два файла: `docker-compose.yml` и `docker-compose.override.yml`. Второй файл автоматически мержится с первым:

```mermaid
flowchart LR
    base["docker-compose.yml<br/>Базовая конфигурация"]
    override["docker-compose.override.yml<br/>Dev-настройки"]
    prod["docker-compose.prod.yml<br/>Prod-настройки"]

    base -->|"docker compose up<br/>автоматический мерж"| dev_result["Dev-окружение"]
    override -->|"автоматически"| dev_result

    base -->|"docker compose -f ... -f ..."| prod_result["Prod-окружение"]
    prod -->|"явный мерж"| prod_result

    style dev_result fill:#2ecc71,color:#fff
    style prod_result fill:#e74c3c,color:#fff
```

### Базовый docker-compose.yml

Этот файл содержит общую конфигурацию, одинаковую для всех окружений. Никаких секретов, никаких специфичных для окружения настроек:

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

### Dev override

Файл `docker-compose.override.yml` загружается автоматически при `docker compose up`. Здесь мы добавляем всё, что нужно для комфортной разработки:

```yaml
# docker-compose.override.yml -- автоматически мержится при docker compose up
services:
  db:
    ports:
      - '5432:5432'                         # Доступ к БД с хоста
    environment:
      POSTGRES_PASSWORD: dev-password       # Простой пароль для разработки

  api:
    build:
      target: development
    ports:
      - '3000:3000'
      - '9229:9229'                         # Debug-порт для Node.js
    volumes:
      - ./api/src:/app/src                  # Hot reload -- изменения без пересборки
    environment:
      DB_PASSWORD: dev-password
      LOG_LEVEL: debug
      DEBUG: 'true'
```

### Production compose

Для production используется отдельный файл, который **явно** указывается при запуске. Здесь -- секреты, лимиты ресурсов, политики перезапуска:

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
# Development -- используется .env + docker-compose.override.yml автоматически
docker compose up -d

# Staging
docker compose -f docker-compose.yml -f docker-compose.staging.yml \
  --env-file .env.staging up -d

# Production
docker compose -f docker-compose.yml -f docker-compose.prod.yml \
  --env-file .env.prod up -d
```

### Файл .env.example -- шаблон для команды

Этот файл коммитится в Git и служит документацией. Новый разработчик в команде копирует его в `.env` и заполняет значениями:

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

### Распространённые паттерны конфигурации

#### Подключение к базе данных

Два подхода -- через отдельные переменные или через единый URL:

```yaml
services:
  api:
    environment:
      # Вариант 1: отдельные переменные -- гибко, легко переопределять
      DB_HOST: ${DB_HOST:-db}
      DB_PORT: ${DB_PORT:-5432}
      DB_NAME: ${DB_NAME:-myapp}
      DB_USER: ${DB_USER:-postgres}
      DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}

      # Вариант 2: единый URL -- компактно, стандарт для многих фреймворков
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}
```

Многие фреймворки (Rails, Django, Prisma, Sequelize) предпочитают единый `DATABASE_URL`.

#### Feature flags

```bash
# .env
FEATURE_NEW_UI=true
FEATURE_BETA_API=false
FEATURE_DARK_MODE=true
```

#### Разные ключи для разных окружений

```bash
# .env (dev -- тестовые ключи)
STRIPE_API_KEY=sk_test_xxx
SENDGRID_KEY=SG.test_xxx
SENTRY_DSN=

# .env.prod (production -- настоящие ключи)
STRIPE_API_KEY=sk_live_xxx
SENDGRID_KEY=SG.live_xxx
SENTRY_DSN=https://xxx@sentry.io/123
```

---

## 8. YAML-якоря и расширения для DRY-конфигурации

### Проблема дублирования

Когда в проекте несколько сервисов с одинаковыми переменными, `docker-compose.yml` начинает обрастать дублированием:

```yaml
# Без якорей -- три копии одних и тех же переменных
services:
  api:
    environment:
      NODE_ENV: production
      LOG_LEVEL: info
      TZ: UTC
      DB_HOST: db
      DB_PORT: 5432
      DB_NAME: myapp

  worker:
    environment:
      NODE_ENV: production    # Дубль
      LOG_LEVEL: info         # Дубль
      TZ: UTC                 # Дубль
      DB_HOST: db             # Дубль
      DB_PORT: 5432           # Дубль
      DB_NAME: myapp          # Дубль
      QUEUE_NAME: default

  scheduler:
    environment:
      NODE_ENV: production    # Дубль
      LOG_LEVEL: info         # Дубль
      TZ: UTC                 # Дубль
      DB_HOST: db             # Дубль
      DB_PORT: 5432           # Дубль
      DB_NAME: myapp          # Дубль
      CRON_SCHEDULE: '*/5 * * * *'
```

При 10 сервисах это превращается в кошмар сопровождения -- забыли обновить переменную в одном месте, и у вас баг.

### Решение: YAML-якоря и расширения Compose

YAML-якоря (`&name`) создают именованную ссылку на блок, а `*name` -- вставляют его. Оператор `<<:` выполняет "мерж" -- объединяет содержимое якоря с текущим блоком:

```yaml
# x- префикс -- расширения Compose, игнорируются при обработке сервисов
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

Теперь общие переменные определены один раз. Изменение `LOG_LEVEL` в `x-common-env` автоматически применится ко всем сервисам.

Префикс `x-` -- это конвенция Docker Compose. Блоки с этим префиксом не обрабатываются как сервисы, но доступны для якорей.

### Проверка результата

Всегда проверяйте итоговую конфигурацию после использования якорей:

```bash
# Показать итоговую конфигурацию со всеми подставленными переменными
docker compose config

# Проверить конкретные секции
docker compose config | grep -A10 environment
```

Команда `docker compose config` -- ваш лучший друг при отладке сложных конфигураций. Она показывает финальный YAML после всех подстановок, мержей и интерполяций.

---

## 9. Частые ошибки новичков

### Ошибка 1: секреты в docker-compose.yml

```yaml
# Так делать нельзя
services:
  db:
    environment:
      POSTGRES_PASSWORD: super_secret_123
```

**Почему это ошибка:** файл `docker-compose.yml` коммитится в репозиторий. Даже если вы удалите пароль позже, он навсегда останется в истории Git. Злоумышленник с доступом к репозиторию получит все ваши секреты. Даже ротация пароля не поможет -- старый всё ещё валиден до момента смены.

```yaml
# Правильный подход
services:
  db:
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD is required}
```

### Ошибка 2: .env файл в Git

```bash
# Так делать нельзя
git add .env
git commit -m "add config"
```

**Почему это ошибка:** `.env` часто содержит реальные пароли, API-ключи и другие секреты. Даже в приватном репозитории это риск -- любой участник команды видит production-пароли. При смене поставщика git-хостинга или при утечке репозитория ущерб может быть катастрофическим.

```bash
# Правильный подход -- .env в .gitignore, .env.example в Git
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
echo "!.env.example" >> .gitignore

# Проверить, что .env не отслеживается
git status
```

### Ошибка 3: путаница между .env и env_file

```yaml
# Разработчик думает, что .env передаётся внутрь контейнера
services:
  api:
    image: myapp
    ports:
      - '${APP_PORT}:3000'
    # APP_PORT из .env подставится в ports, но НЕ будет видна внутри контейнера!
```

**Почему это ошибка:** `.env` и `env_file` -- разные механизмы. `.env` подставляет значения в `docker-compose.yml` (интерполяция YAML-файла). `env_file` передаёт переменные внутрь контейнера. Переменная может быть в YAML, но отсутствовать в контейнере.

```yaml
# Правильный подход -- явно передаём переменные внутрь контейнера
services:
  api:
    image: myapp
    ports:
      - '${APP_PORT}:3000'       # Из .env -- интерполяция YAML
    env_file:
      - .env.app                  # Переменные ВНУТРЬ контейнера
    environment:
      APP_PORT: ${APP_PORT}       # Или явно через environment
```

### Ошибка 4: секреты в ARG при сборке

```dockerfile
# Так делать нельзя
ARG DB_PASSWORD
ENV DB_PASSWORD=${DB_PASSWORD}
```

**Почему это ошибка:** значения `ARG` сохраняются в метаданных образа. Команда `docker history` покажет их любому, кто скачает образ. Это эквивалент того, чтобы написать пароль на стене -- каждый проходящий его увидит.

```dockerfile
# Правильный подход -- секреты только через secrets или runtime env
ENV DB_PASSWORD_FILE=/run/secrets/db_password
```

### Ошибка 5: отсутствие дефолтных значений

```yaml
# Так делать опасно
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME}    # Может быть пустым!
```

**Почему это ошибка:** если переменная `DB_NAME` не определена ни в `.env`, ни в shell-окружении, Compose подставит пустую строку. PostgreSQL попытается создать базу с пустым именем и выдаст непонятную ошибку. Отладка может занять часы.

```yaml
# Правильный подход -- дефолт или обязательность
services:
  db:
    environment:
      POSTGRES_DB: ${DB_NAME:-myapp}                     # Дефолтное значение
      POSTGRES_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD}  # Ошибка при отсутствии
```

### Ошибка 6: одинаковый .env для всех окружений

```bash
# Один файл .env с production-паролями используется и в dev, и в prod
# Разработчик случайно подключается к production-базе с локальной машины
```

**Почему это ошибка:** если один `.env` используется повсюду, легко случайно запустить dev-тесты против production-базы. Это может привести к удалению или повреждению данных.

```bash
# Правильный подход -- отдельные файлы для каждого окружения
.env              # dev -- локальные значения
.env.staging      # staging
.env.prod         # production
.env.example      # шаблон в Git
```

---

## 10. Best practices

### 1. Разделяйте секретное и несекретное

Не все переменные одинаково чувствительны. Порт приложения и уровень логирования можно смело коммитить. Пароль к базе данных -- нельзя.

```yaml
services:
  api:
    environment:
      # Несекретные -- можно в YAML
      NODE_ENV: production
      APP_PORT: 3000
      LOG_LEVEL: info
    # Секретные -- через secrets
    secrets:
      - db_password
      - jwt_secret
```

### 2. Всегда задавайте дефолтные значения для некритичных переменных

```yaml
environment:
  NODE_ENV: ${NODE_ENV:-development}
  LOG_LEVEL: ${LOG_LEVEL:-info}
  TZ: ${TZ:-UTC}
  # Для критичных -- обязательность
  DB_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD must be set}
```

### 3. Используйте .env.example как документацию

`.env.example` -- это не просто шаблон, это документация для команды. Добавляйте комментарии, группируйте переменные по назначению, указывайте, где получить значения.

### 4. Проверяйте конфигурацию перед запуском

```bash
# Показать итоговую конфигурацию
docker compose config

# Проверить, что все обязательные переменные заданы
docker compose config --quiet
# Если есть ошибки -- они появятся здесь
```

### 5. Не храните секреты в истории shell

```bash
# Плохо -- пароль останется в ~/.bash_history
docker run -e DB_PASSWORD=secret123 myapp

# Лучше -- через переменную окружения
export DB_PASSWORD=secret123
docker run -e DB_PASSWORD myapp

# Ещё лучше -- через файл
docker run --env-file .env myapp
```

### 6. Используйте YAML-якоря для общих переменных

При наличии нескольких сервисов с одинаковыми переменными -- выносите общие блоки в расширения (`x-` prefix) и используйте якоря. Это уменьшает дублирование и снижает риск рассинхронизации.

---

## Итоги

Конфигурация Docker-приложений -- это баланс между удобством и безопасностью. Для каждого типа данных существует свой инструмент:

- **ENV** в Dockerfile -- переменные для сборки и запуска, дефолтные значения образа
- **ARG** в Dockerfile -- переменные только для сборки, не сохраняются в контейнере
- **Флаг -e** -- переопределение переменных при запуске контейнера, высший приоритет
- **.env файл** -- автоматическая загрузка Compose для подстановки `${VAR}` в YAML
- **env_file** -- передача переменных внутрь контейнера, другой механизм
- **Подстановка** -- `${VAR:-default}` для дефолтов, `${VAR:?error}` для обязательных
- **Docker Secrets** -- безопасная передача паролей через файлы `/run/secrets/`
- **Docker Configs** -- несекретные конфигурационные файлы для nginx, prometheus и т.п.
- **Multi-env** -- base + override/prod/staging + .env файлы для каждого окружения
- **.env.example** -- шаблон в Git, `.env` -- в `.gitignore`
- **YAML-якоря** (`&name` / `*name`) -- DRY для общих блоков переменных
- **docker compose config** -- проверка итоговой конфигурации перед запуском
