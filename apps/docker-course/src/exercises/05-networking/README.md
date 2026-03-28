# Уровень 5: Сеть -- как контейнеры общаются друг с другом

## 🎯 Проблема: контейнеры изолированы

По умолчанию каждый контейнер Docker работает в **собственном сетевом пространстве имён** (network namespace). Это означает, что контейнер имеет свой IP-адрес, свою таблицу маршрутизации и свой сетевой стек. Контейнеры не могут просто так обращаться друг к другу или к внешнему миру.

```bash
# Два контейнера не знают друг о друге
docker run -d --name web nginx
docker run -d --name api node:20

# web не может обратиться к api по имени
docker exec web curl http://api:3000
# curl: (6) Could not resolve host: api
```

Возникают вопросы:
- Как frontend-контейнер обращается к backend-контейнеру?
- Как пользователь из браузера достучится до приложения в контейнере?
- Как изолировать базу данных от публичного доступа?
- Как несколько микросервисов общаются в рамках одного приложения?

Docker решает эти задачи через **сетевую подсистему** с несколькими драйверами и механизмами.

---

## 🔥 Сетевые драйверы Docker

Docker поддерживает несколько сетевых драйверов, каждый для своего сценария:

| Драйвер | Описание | Когда использовать |
|---|---|---|
| **bridge** | Виртуальный мост на хосте | По умолчанию, для одиночных контейнеров |
| **host** | Контейнер использует сеть хоста напрямую | Максимальная производительность, без изоляции |
| **none** | Полное отключение сети | Batch-задачи без сети, безопасность |
| **overlay** | Сеть между несколькими Docker-хостами | Docker Swarm, распределённые системы |
| **macvlan** | Контейнер получает MAC-адрес в физической сети | Интеграция с legacy-системами |

### Визуальная модель

```
┌──────────────────────────────────────────────────────────────┐
│                      Хост-машина                             │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  bridge      │  │   host      │  │      none           │  │
│  │  (docker0)   │  │ (сеть хоста)│  │  (нет сети)         │  │
│  │             │  │             │  │                     │  │
│  │ ┌───┐ ┌───┐│  │   ┌───┐    │  │      ┌───┐         │  │
│  │ │web│ │api││  │   │app│    │  │      │job│         │  │
│  │ └───┘ └───┘│  │   └───┘    │  │      └───┘         │  │
│  └──────┬──────┘  └─────┬──────┘  └─────────────────────┘  │
│         │               │                                    │
│    NAT/iptables    напрямую                                  │
│         │               │                                    │
└─────────┴───────────────┴────────────────────────────────────┘
          │               │
     Внешний мир     Внешний мир
```

---

## 🔥 Bridge network -- сеть по умолчанию

При установке Docker автоматически создаёт три сети:

```bash
docker network ls
# NETWORK ID     NAME      DRIVER    SCOPE
# a1b2c3d4e5f6   bridge    bridge    local
# d7e8f9a0b1c2   host      host      local
# e3f4a5b6c7d8   none      null      local
```

### Default bridge (docker0)

Когда вы запускаете контейнер без указания сети, он попадает в **default bridge** (`docker0`):

```bash
# Оба контейнера в default bridge
docker run -d --name web nginx
docker run -d --name api node:20

# Посмотреть IP-адрес контейнера
docker inspect web --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
# 172.17.0.2

docker inspect api --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}'
# 172.17.0.3
```

### Ограничения default bridge

Default bridge имеет важные ограничения:

```bash
# ❌ DNS-резолвинг по имени НЕ работает в default bridge
docker exec web curl http://api:3000
# curl: (6) Could not resolve host: api

# ✅ Можно обратиться только по IP-адресу
docker exec web curl http://172.17.0.3:3000
```

Другие ограничения default bridge:
- **Нет автоматического DNS** -- контейнеры не находят друг друга по имени
- **Все контейнеры в одной сети** -- нет изоляции между приложениями
- **IP-адреса меняются** -- при пересоздании контейнера IP может измениться
- **Используется устаревший `--link`** -- для связи контейнеров (deprecated)

📌 **Default bridge подходит только для быстрых тестов. Для реальных проектов используйте пользовательские сети.**

---

## 🔥 Пользовательские bridge-сети

Пользовательские bridge-сети решают все проблемы default bridge:

### Создание и использование

```bash
# Создать сеть
docker network create my-app-net

# Запустить контейнеры в этой сети
docker run -d --name web --network my-app-net nginx
docker run -d --name api --network my-app-net node:20

# ✅ DNS по имени контейнера работает!
docker exec web curl http://api:3000
# Ответ от api-сервера
```

### Автоматический DNS

В пользовательской сети Docker запускает **встроенный DNS-сервер** (127.0.0.11), который разрешает имена контейнеров:

```bash
docker network create backend
docker run -d --name postgres --network backend postgres:16
docker run -d --name api --network backend my-api

# api может обратиться к postgres по имени
docker exec api psql -h postgres -U user -d mydb
# Подключение установлено!
```

### Сетевые алиасы

Можно задать дополнительные DNS-имена через `--network-alias`:

```bash
docker run -d --name postgres-primary \
  --network backend \
  --network-alias db \
  --network-alias postgres \
  postgres:16

# Контейнер доступен по любому из имён:
# postgres-primary, db, postgres
docker exec api ping db
# PING db (172.18.0.2): 56 data bytes
```

### Преимущества пользовательских сетей

| Возможность | Default bridge | User-defined bridge |
|---|---|---|
| **DNS по имени** | Нет | Да |
| **Изоляция** | Все вместе | Только участники сети |
| **Горячее подключение** | Нет | `docker network connect` |
| **Настройка подсети** | Ограничена | Полная (`--subnet`) |
| **Конфигурация** | Фиксированная | Гибкая |

---

## 🔥 Управление сетями

### Основные команды

```bash
# Создать сеть
docker network create my-net

# Создать сеть с параметрами
docker network create \
  --driver bridge \
  --subnet 172.20.0.0/16 \
  --gateway 172.20.0.1 \
  --ip-range 172.20.240.0/20 \
  custom-net

# Список сетей
docker network ls

# Подробная информация
docker network inspect my-net

# Подключить контейнер к сети
docker network connect my-net existing-container

# Отключить контейнер от сети
docker network disconnect my-net existing-container

# Удалить сеть
docker network rm my-net

# Удалить все неиспользуемые сети
docker network prune
```

### Горячее подключение и отключение

Контейнер можно подключить к дополнительной сети **без перезапуска**:

```bash
# Контейнер в сети frontend
docker run -d --name app --network frontend my-app

# Подключить также к backend
docker network connect backend app

# Теперь app доступен из обеих сетей
docker inspect app --format '{{json .NetworkSettings.Networks}}' | jq
# { "frontend": { "IPAddress": "172.18.0.2" },
#   "backend":  { "IPAddress": "172.19.0.3" } }
```

---

## 🔥 Проброс портов (Port Mapping)

Контейнеры в bridge-сети изолированы от внешнего мира. Чтобы сделать сервис доступным снаружи, нужно **опубликовать порт** через `-p` или `--publish`:

### Синтаксис

```bash
# Базовый: hostPort:containerPort
docker run -p 8080:80 nginx
# localhost:8080 → контейнер:80

# Только определённый интерфейс
docker run -p 127.0.0.1:8080:80 nginx
# Доступ только с localhost, не из внешней сети

# Случайный порт на хосте
docker run -p 80 nginx
# или
docker run -P nginx
# Docker выберет свободный порт (обычно 32768+)

# UDP-порт
docker run -p 5353:53/udp dns-server

# Несколько портов
docker run -p 80:80 -p 443:443 nginx

# TCP и UDP на одном порту
docker run -p 53:53/tcp -p 53:53/udp dns-server
```

### Просмотр опубликованных портов

```bash
docker port my-container
# 80/tcp -> 0.0.0.0:8080
# 443/tcp -> 0.0.0.0:8443

# Конкретный порт
docker port my-container 80
# 0.0.0.0:8080
```

### EXPOSE vs -p

```dockerfile
# EXPOSE в Dockerfile -- только документация!
FROM nginx
EXPOSE 80 443
# Это НЕ публикует порт, а лишь сообщает, какие порты слушает приложение
```

```bash
# -P публикует ВСЕ порты из EXPOSE на случайные порты хоста
docker run -P nginx

# -p публикует конкретные порты
docker run -p 8080:80 nginx
```

📌 **`EXPOSE` -- документация. `-p` -- реальная публикация.**

### Как работает проброс портов

```
┌─────────────────────────────────────────────────────────┐
│                    Хост-машина                          │
│                                                         │
│  Пользователь → localhost:8080                          │
│                      │                                  │
│              iptables / NAT                             │
│                      │                                  │
│         ┌────────────▼────────────┐                     │
│         │   Bridge network        │                     │
│         │   172.17.0.0/16         │                     │
│         │                         │                     │
│         │   ┌─────────────────┐   │                     │
│         │   │  nginx          │   │                     │
│         │   │  172.17.0.2:80  │   │                     │
│         │   └─────────────────┘   │                     │
│         └─────────────────────────┘                     │
└─────────────────────────────────────────────────────────┘
```

Docker использует **iptables** (Linux) для перенаправления трафика с порта хоста на порт контейнера.

---

## 🔥 Связь между контейнерами

### Внутри одной сети

Контейнеры в одной пользовательской сети общаются напрямую по именам:

```bash
docker network create app-net

# Backend
docker run -d --name api --network app-net \
  -e DB_HOST=postgres \
  my-api

# Database
docker run -d --name postgres --network app-net \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# api обращается к postgres по имени "postgres"
# Порт 5432 не нужно публиковать -- он доступен внутри сети
```

### Между разными сетями -- изоляция

Контейнеры в **разных сетях не видят друг друга**:

```bash
docker network create frontend
docker network create backend

docker run -d --name web --network frontend nginx
docker run -d --name api --network backend node:20

# web не может достучаться до api
docker exec web curl http://api:3000
# curl: (6) Could not resolve host: api
```

### Мост между сетями

Контейнер может быть подключён к нескольким сетям, выступая "мостом":

```bash
docker network create frontend
docker network create backend

# api подключён к обеим сетям
docker run -d --name api --network frontend my-api
docker network connect backend api

# web видит api (оба в frontend)
# api видит db (оба в backend)
# web НЕ видит db (изоляция!)
docker run -d --name db --network backend postgres:16
docker run -d --name web --network frontend nginx
```

### Типичная архитектура микросервисов

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  frontend network                backend network        │
│  ┌──────────────────┐           ┌──────────────────┐    │
│  │                  │           │                  │    │
│  │  ┌─────┐        │           │        ┌─────┐  │    │
│  │  │ web │  ┌─────┤───────────├─────┐  │ db  │  │    │
│  │  └─────┘  │ api │           │     │  └─────┘  │    │
│  │           └─────┤───────────├─────┘           │    │
│  │                  │           │        ┌─────┐  │    │
│  │                  │           │        │redis│  │    │
│  │                  │           │        └─────┘  │    │
│  └──────────────────┘           └──────────────────┘    │
│                                                         │
│  Пользователь → :80 (web)                               │
│  web → api:3000 (внутри frontend)                       │
│  api → db:5432 (внутри backend)                         │
│  api → redis:6379 (внутри backend)                      │
│  web ✗ db (изоляция!)                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🔥 Host network mode

В режиме `host` контейнер **напрямую использует сетевой стек хоста** -- без виртуального моста, без NAT, без iptables:

```bash
# Контейнер слушает порт 80 прямо на хосте
docker run --network host nginx
# nginx доступен на http://localhost:80 без -p
```

### Когда использовать host network

- **Максимальная производительность** -- нет overhead от NAT/bridge
- **Приложения, работающие с сетевым стеком** -- мониторинг, сниффинг
- **Множество портов** -- не нужно перечислять каждый через `-p`

### Ограничения

```bash
# ❌ Конфликт портов: два nginx не могут слушать порт 80
docker run --network host --name web1 nginx
docker run --network host --name web2 nginx
# Error: bind: address already in use

# ❌ Нет сетевой изоляции -- контейнер видит все интерфейсы хоста
# ❌ Не работает на macOS и Windows (Docker Desktop использует VM)
```

📌 **Host network -- для специфических задач. В большинстве случаев bridge + port mapping достаточно.**

---

## 🔥 None network -- полное отключение

Режим `none` полностью отключает сеть у контейнера:

```bash
docker run --network none alpine ping google.com
# ping: bad address 'google.com'

docker run --network none alpine ip addr
# 1: lo: <LOOPBACK,UP> ... inet 127.0.0.1/8
# Только loopback-интерфейс
```

### Когда использовать

- Batch-задачи, не требующие сети (обработка файлов, вычисления)
- Повышенная безопасность -- контейнер не может отправлять данные наружу
- Тестирование поведения приложения без сети

---

## 🔥 DNS в Docker-сетях

### Встроенный DNS-сервер

В пользовательских сетях Docker запускает DNS-сервер на `127.0.0.11`:

```bash
docker network create my-net
docker run -d --name web --network my-net nginx

docker exec web cat /etc/resolv.conf
# nameserver 127.0.0.11
# options ndots:0
```

### Что резолвится

- **Имя контейнера** (`--name`) -- `web`, `api`, `postgres`
- **Сетевые алиасы** (`--network-alias`) -- произвольные DNS-имена
- **Имена сервисов** в Docker Compose -- автоматически

### Кастомный DNS

```bash
# Указать внешний DNS-сервер
docker run --dns 8.8.8.8 --dns 8.8.4.4 alpine nslookup google.com

# Добавить DNS-запись
docker run --add-host myhost:10.0.0.5 alpine ping myhost

# Добавить запись для host.docker.internal (доступ к хосту)
docker run --add-host host.docker.internal:host-gateway alpine \
  curl http://host.docker.internal:3000
```

📌 **`host.docker.internal`** -- специальное имя для обращения к хост-машине из контейнера. На Linux требует `--add-host`, на macOS/Windows работает из коробки.

---

## 🔥 Практические паттерны

### Паттерн 1: Веб-приложение с базой данных

```bash
# Создаём изолированную сеть
docker network create webapp

# База данных -- порт НЕ публикуется наружу
docker run -d --name db \
  --network webapp \
  -v pgdata:/var/lib/postgresql/data \
  -e POSTGRES_PASSWORD=secret \
  postgres:16

# Приложение -- подключается к БД по имени, публикует HTTP
docker run -d --name app \
  --network webapp \
  -e DATABASE_URL=postgresql://postgres:secret@db:5432/postgres \
  -p 3000:3000 \
  my-app
```

### Паттерн 2: Reverse proxy

```bash
docker network create proxy-net

# Backend-сервисы
docker run -d --name api1 --network proxy-net my-api-1
docker run -d --name api2 --network proxy-net my-api-2

# Nginx как reverse proxy -- единственный контейнер с публичным портом
docker run -d --name proxy \
  --network proxy-net \
  -v ./nginx.conf:/etc/nginx/nginx.conf:ro \
  -p 80:80 -p 443:443 \
  nginx
```

### Паттерн 3: Отладка сети

```bash
# Подключиться к сети контейнера для отладки
docker run -it --rm \
  --network container:my-app \
  nicolaka/netshoot \
  tcpdump -i eth0 port 80

# Проверить связность
docker run --rm --network my-net alpine ping -c 3 api
docker run --rm --network my-net curlimages/curl curl -s http://api:3000/health
```

---

## 🔥 Best practices

### 1. Всегда создавайте пользовательские сети

```bash
# ✅ Пользовательская сеть с DNS
docker network create my-app
docker run --network my-app --name api my-api

# ❌ Default bridge -- нет DNS, нет изоляции
docker run --name api my-api
```

### 2. Не публикуйте порты баз данных

```bash
# ❌ База данных доступна всем
docker run -p 5432:5432 postgres:16

# ✅ База доступна только внутри сети
docker run --network backend postgres:16
```

### 3. Привязывайте порты к 127.0.0.1

```bash
# ❌ Порт доступен из внешней сети
docker run -p 8080:80 nginx

# ✅ Порт доступен только с localhost
docker run -p 127.0.0.1:8080:80 nginx
```

### 4. Используйте сетевые алиасы для гибкости

```bash
# ✅ Алиас позволяет заменить реализацию без изменения клиентов
docker run --network app --network-alias db postgres:16
# Позже можно заменить на MySQL, сохранив алиас "db"
```

### 5. Разделяйте сети по назначению

```bash
# ✅ Изоляция: frontend не видит database
docker network create frontend
docker network create backend
```

### 6. Используйте EXPOSE как документацию

```dockerfile
# ✅ Документируйте порты в Dockerfile
FROM node:20-alpine
EXPOSE 3000
# Разработчик сразу видит, какой порт нужен
```

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Использование default bridge для связи контейнеров

```bash
# ❌ DNS не работает в default bridge
docker run -d --name db postgres:16
docker run -d --name app -e DB_HOST=db my-app
# app не может найти "db" по имени
```

> **Почему это ошибка:** default bridge не предоставляет DNS-резолвинг. Контейнеры могут общаться только по IP-адресам, которые меняются при пересоздании.

```bash
# ✅ Пользовательская сеть с DNS
docker network create app-net
docker run -d --name db --network app-net postgres:16
docker run -d --name app --network app-net -e DB_HOST=db my-app
```

### 🐛 2. Публикация портов для внутренних сервисов

```bash
# ❌ Зачем публиковать порт Redis наружу?
docker run -d -p 6379:6379 redis
# Любой в сети может подключиться к вашему Redis!
```

> **Почему это ошибка:** публикация порта открывает сервис для внешнего мира. Внутренние сервисы (БД, кэш, очереди) должны быть доступны только через внутреннюю сеть Docker.

```bash
# ✅ Redis доступен только внутри сети
docker network create backend
docker run -d --name redis --network backend redis
docker run -d --name app --network backend -e REDIS_HOST=redis my-app
```

### 🐛 3. Жёстко прописанные IP-адреса

```bash
# ❌ IP-адрес может измениться при пересоздании
docker run -d --name db postgres:16
# IP: 172.17.0.2
docker run -d -e DB_HOST=172.17.0.2 my-app

docker rm -f db
docker run -d --name db postgres:16
# IP: 172.17.0.5 -- приложение сломано!
```

> **Почему это ошибка:** Docker не гарантирует одинаковый IP при пересоздании контейнера. DNS-имена стабильны, IP -- нет.

```bash
# ✅ Используйте DNS-имена
docker network create app-net
docker run -d --name db --network app-net postgres:16
docker run -d --name app --network app-net -e DB_HOST=db my-app
# "db" всегда резолвится в актуальный IP
```

### 🐛 4. Забыли, что -p 8080:80 открывает порт на ВСЕХ интерфейсах

```bash
# ❌ Порт доступен из интернета (если хост имеет публичный IP)
docker run -p 3000:3000 my-app
# Эквивалентно -p 0.0.0.0:3000:3000
```

> **Почему это ошибка:** по умолчанию `-p` привязывает порт ко всем интерфейсам (`0.0.0.0`). На сервере с публичным IP это означает доступ из интернета.

```bash
# ✅ Привязка к localhost
docker run -p 127.0.0.1:3000:3000 my-app
# Доступ только с самого хоста
```

### 🐛 5. Попытка связать контейнеры в разных сетях

```bash
# ❌ Контейнеры в разных сетях не видят друг друга
docker network create net-a
docker network create net-b
docker run -d --name svc-a --network net-a alpine sleep 3600
docker run -d --name svc-b --network net-b alpine sleep 3600

docker exec svc-a ping svc-b
# ping: bad address 'svc-b'
```

> **Почему это ошибка:** сетевая изоляция -- это фича Docker. Контейнеры в разных сетях намеренно не видят друг друга.

```bash
# ✅ Подключите контейнер к нужной сети
docker network connect net-a svc-b
# Теперь svc-b доступен из net-a

# Или поместите оба в одну сеть
docker run -d --name svc-a --network shared alpine sleep 3600
docker run -d --name svc-b --network shared alpine sleep 3600
```

---

## 📌 Итоги

- ✅ **Bridge** -- стандартный драйвер, создаёт виртуальную сеть на хосте
- ✅ **Default bridge** -- автоматическая сеть без DNS, только для тестов
- ✅ **User-defined bridge** -- DNS по имени контейнера, изоляция, гибкость
- ✅ **Port mapping** (`-p`) -- публикация портов контейнера на хосте
- ✅ **EXPOSE** -- документация в Dockerfile, не публикует порт
- ✅ Контейнеры в одной сети общаются по **DNS-именам**
- ✅ Контейнеры в **разных сетях изолированы** друг от друга
- ✅ `docker network connect` -- подключение к сети **без перезапуска**
- ✅ **Host network** -- без изоляции, максимальная производительность
- ✅ **None network** -- полное отключение сети для безопасности
- ✅ Не публикуйте порты внутренних сервисов (БД, кэш, очереди)
- ✅ Привязывайте порты к `127.0.0.1` для безопасности
- ✅ Используйте **сетевые алиасы** для гибкой замены сервисов
