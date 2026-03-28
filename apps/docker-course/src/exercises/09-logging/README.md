# Уровень 9: Логирование и отладка

## 🎯 Проблема: контейнер упал, а вы не знаете почему

Представьте: вы развернули стек из пяти сервисов в Docker Compose. Через час API перестаёт отвечать. Вы заходите на сервер и видите, что контейнер `api` в статусе `Exited (137)`. Что произошло? Кто убил процесс? Когда это случилось?

```bash
$ docker ps -a
CONTAINER ID  IMAGE    STATUS                    NAMES
a1b2c3d4e5f6  myapp    Exited (137) 3 mins ago   api
f6e5d4c3b2a1  postgres Up 2 hours                db
```

Без инструментов логирования и диагностики вы буквально слепы. Docker предоставляет мощный набор команд для просмотра логов, инспекции состояния контейнеров, мониторинга ресурсов и отладки типичных проблем.

---

## 🔥 docker logs: чтение логов контейнера

### Как Docker собирает логи

Docker перехватывает всё, что контейнер пишет в **STDOUT** и **STDERR**, и сохраняет через logging driver (по умолчанию -- `json-file`). Команда `docker logs` читает эти сохранённые записи.

```bash
# Показать все логи контейнера
docker logs mycontainer

# То же самое по ID
docker logs a1b2c3d4e5f6
```

📌 **Важно:** `docker logs` показывает только STDOUT и STDERR. Если приложение пишет логи в файл внутри контейнера (например, `/var/log/app.log`), `docker logs` их **не увидит**.

### STDOUT vs STDERR

```bash
# В контейнере
echo "info message"   # → STDOUT → docker logs
echo "error!" >&2     # → STDERR → docker logs

# Node.js
console.log("info")    # → STDOUT
console.error("error") # → STDERR

# Python
print("info")                          # → STDOUT
import sys; print("error", file=sys.stderr)  # → STDERR
```

Оба потока попадают в `docker logs`, но logging driver может их различать.

### Флаги docker logs

```bash
# Следить за логами в реальном времени (аналог tail -f)
docker logs -f mycontainer

# Показать последние N строк
docker logs --tail 50 mycontainer

# Логи с определённого момента
docker logs --since 2024-01-15T10:00:00 mycontainer
docker logs --since 30m mycontainer     # За последние 30 минут
docker logs --since 2h mycontainer      # За последние 2 часа

# Логи до определённого момента
docker logs --until 2024-01-15T12:00:00 mycontainer

# Комбинация: логи за период
docker logs --since 10m --until 5m mycontainer

# Показать временные метки
docker logs -t mycontainer
# 2024-01-15T10:30:15.123456789Z Starting server...
# 2024-01-15T10:30:15.234567890Z Listening on port 3000

# Комбинация: последние 20 строк с временными метками в реальном времени
docker logs -f --tail 20 -t mycontainer
```

| Флаг | Описание | Пример |
|------|----------|--------|
| `-f`, `--follow` | Следить в реальном времени | `docker logs -f app` |
| `--tail N` | Последние N строк | `docker logs --tail 100 app` |
| `--since` | Логи с момента (время или duration) | `docker logs --since 30m app` |
| `--until` | Логи до момента | `docker logs --until 1h app` |
| `-t`, `--timestamps` | Показать временные метки | `docker logs -t app` |
| `--details` | Дополнительные атрибуты | `docker logs --details app` |

### Логи в Docker Compose

```bash
# Логи всех сервисов
docker compose logs

# Логи конкретного сервиса
docker compose logs api

# Следить за логами нескольких сервисов
docker compose logs -f api worker

# Последние 50 строк каждого сервиса
docker compose logs --tail 50

# С временными метками
docker compose logs -t api
```

---

## 🔥 Logging drivers: куда отправлять логи

### Что такое logging driver

Logging driver определяет, **куда** Docker отправляет логи контейнера. По умолчанию используется `json-file` -- логи сохраняются в JSON-файлы на хосте.

### Доступные драйверы

| Драйвер | Описание | `docker logs` |
|---------|----------|---------------|
| `json-file` | JSON-файлы на хосте (по умолчанию) | ✅ |
| `local` | Оптимизированный формат с автоматической ротацией | ✅ |
| `journald` | Системный журнал Linux (systemd) | ✅ |
| `syslog` | Syslog-сервер | ❌ |
| `fluentd` | Fluentd-коллектор | ❌ |
| `awslogs` | Amazon CloudWatch Logs | ❌ |
| `gcplogs` | Google Cloud Logging | ❌ |
| `splunk` | Splunk HTTP Event Collector | ❌ |
| `gelf` | Graylog Extended Log Format | ❌ |
| `none` | Логирование отключено | ❌ |

⚠️ **Важно:** При использовании драйверов `syslog`, `fluentd`, `awslogs` и других удалённых -- команда `docker logs` **не работает**! Логи отправляются напрямую в целевую систему.

### Настройка драйвера для контейнера

```bash
# Запустить контейнер с определённым драйвером
docker run --log-driver json-file --log-opt max-size=10m --log-opt max-file=3 myapp

# Отключить логирование для контейнера
docker run --log-driver none myapp
```

```yaml
# docker-compose.yml
services:
  api:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"    # Максимальный размер файла лога
        max-file: "5"      # Максимальное количество файлов
        tag: "{{.Name}}"   # Тег для идентификации

  worker:
    image: myworker
    logging:
      driver: local        # Оптимизированный драйвер
      options:
        max-size: "50m"
        max-file: "3"
```

### Настройка глобального драйвера в daemon.json

```json
// /etc/docker/daemon.json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3",
    "labels": "production_status",
    "env": "os,customer"
  }
}
```

После изменения `daemon.json` нужно перезапустить Docker:

```bash
sudo systemctl restart docker
```

📌 Настройки из `daemon.json` -- глобальные значения по умолчанию. Контейнер может переопределить их через `--log-driver` и `--log-opt`.

### Ротация логов: max-size и max-file

Без ротации логи растут бесконечно и могут заполнить весь диск!

```bash
# ❌ Без ротации: лог-файл растёт без ограничений
docker run myapp
# Через неделю: /var/lib/docker/containers/<id>/<id>-json.log → 50 GB

# ✅ С ротацией: файл не больше 10 МБ, максимум 3 файла
docker run --log-opt max-size=10m --log-opt max-file=3 myapp
# Максимум 30 МБ логов (3 файла × 10 МБ)
```

```yaml
# Обязательно в production!
services:
  api:
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

### Драйвер local

Драйвер `local` -- улучшенная версия `json-file`:
- Использует сжатие (логи занимают меньше места)
- Автоматическая ротация по умолчанию (100 МБ, 5 файлов)
- Более быстрая запись

```yaml
services:
  api:
    logging:
      driver: local
      options:
        max-size: "50m"
        max-file: "3"
```

### Dual logging (Docker 20.10+)

Начиная с Docker 20.10, можно включить `dual logging` -- логи отправляются в удалённый драйвер **и** остаются доступны через `docker logs`:

```json
// /etc/docker/daemon.json
{
  "log-driver": "fluentd",
  "log-opts": {
    "fluentd-address": "localhost:24224"
  },
  "features": {
    "buildkit": true
  }
}
```

---

## 🔥 docker inspect: полная информация о контейнере

### Базовое использование

```bash
# Полная информация (JSON)
docker inspect mycontainer

# Вывод -- огромный JSON со всеми деталями:
# - Состояние контейнера (State)
# - Конфигурация (Config)
# - Сетевые настройки (NetworkSettings)
# - Точки монтирования (Mounts)
# - И многое другое
```

### Формат вывода: Go templates

`--format` позволяет извлечь конкретные поля:

```bash
# IP-адрес контейнера
docker inspect --format='{{.NetworkSettings.IPAddress}}' mycontainer
# 172.17.0.2

# Статус контейнера
docker inspect --format='{{.State.Status}}' mycontainer
# running

# Код выхода
docker inspect --format='{{.State.ExitCode}}' mycontainer
# 0

# Переменные окружения
docker inspect --format='{{json .Config.Env}}' mycontainer
# ["NODE_ENV=production","PORT=3000"]

# Примонтированные тома
docker inspect --format='{{json .Mounts}}' mycontainer | jq .

# Logging driver
docker inspect --format='{{.HostConfig.LogConfig.Type}}' mycontainer
# json-file

# Время запуска
docker inspect --format='{{.State.StartedAt}}' mycontainer
# 2024-01-15T10:30:15.123456789Z

# Порты
docker inspect --format='{{json .NetworkSettings.Ports}}' mycontainer

# Healthcheck status
docker inspect --format='{{json .State.Health}}' mycontainer | jq .

# PID главного процесса
docker inspect --format='{{.State.Pid}}' mycontainer
# 12345

# OOM killed?
docker inspect --format='{{.State.OOMKilled}}' mycontainer
# false
```

### Полезные шаблоны

```bash
# Все контейнеры: имя, статус, IP
docker inspect --format='{{.Name}} → {{.State.Status}} ({{.NetworkSettings.IPAddress}})' $(docker ps -aq)

# Все переменные окружения, по одной на строку
docker inspect --format='{{range .Config.Env}}{{println .}}{{end}}' mycontainer

# Точки монтирования: источник → назначение
docker inspect --format='{{range .Mounts}}{{.Source}} → {{.Destination}}{{println}}{{end}}' mycontainer

# Сети контейнера
docker inspect --format='{{range $net, $config := .NetworkSettings.Networks}}{{$net}}: {{$config.IPAddress}}{{println}}{{end}}' mycontainer
```

### Инспекция других объектов

```bash
# Образ
docker inspect myimage:latest

# Сеть
docker network inspect mynetwork

# Том
docker volume inspect myvolume
```

---

## 🔥 docker stats: мониторинг ресурсов в реальном времени

```bash
# Все запущенные контейнеры (обновляется в реальном времени)
docker stats

# CONTAINER ID  NAME   CPU %  MEM USAGE / LIMIT    MEM %  NET I/O        BLOCK I/O     PIDS
# a1b2c3d4e5f6  api    2.50%  128MiB / 512MiB      25.00% 5.2kB / 3.1kB  0B / 4.1MB    15
# f6e5d4c3b2a1  db     1.20%  256MiB / 1GiB        25.00% 1.1kB / 800B   12MB / 50MB   8

# Конкретные контейнеры
docker stats api db redis

# Одноразовый снимок (без обновления)
docker stats --no-stream

# Своя формат-строка
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
# NAME   CPU %   MEM USAGE / LIMIT
# api    2.50%   128MiB / 512MiB
# db     1.20%   256MiB / 1GiB
```

| Колонка | Описание |
|---------|----------|
| CPU % | Процент использования CPU от лимита |
| MEM USAGE / LIMIT | Текущее / максимальное потребление RAM |
| MEM % | Процент использования RAM |
| NET I/O | Входящий / исходящий сетевой трафик |
| BLOCK I/O | Чтение / запись на диск |
| PIDS | Количество процессов |

---

## 🔥 docker top: процессы внутри контейнера

```bash
# Процессы внутри контейнера (без exec!)
docker top mycontainer

# UID   PID    PPID   C  STIME  TTY  TIME      CMD
# root  12345  12300  0  10:30  ?    00:00:05  node server.js
# root  12346  12345  0  10:30  ?    00:00:01  /usr/bin/node worker.js

# С дополнительными полями (формат ps)
docker top mycontainer -o pid,user,%cpu,%mem,command

# Для Docker Compose
docker compose top
```

`docker top` полезна для быстрой проверки без захода в контейнер (`docker exec`).

---

## 🔥 docker events: события Docker daemon

```bash
# Следить за событиями в реальном времени
docker events

# 2024-01-15T10:30:15.000000000Z container start a1b2c3d4e5f6
# 2024-01-15T10:35:20.000000000Z container die a1b2c3d4e5f6 (exitCode=137)
# 2024-01-15T10:35:21.000000000Z container stop a1b2c3d4e5f6

# Фильтр по типу события
docker events --filter event=die
docker events --filter event=oom

# Фильтр по контейнеру
docker events --filter container=mycontainer

# Фильтр по типу объекта
docker events --filter type=container
docker events --filter type=network
docker events --filter type=volume

# За определённый период
docker events --since 1h --until 30m

# JSON-формат
docker events --format '{{json .}}' --filter event=die
```

Типичные события контейнера:
- `create` → `start` → `die` → `stop` → `destroy`
- `kill` -- контейнер убит сигналом
- `oom` -- Out of Memory
- `health_status` -- изменение статуса healthcheck

---

## 🔥 docker system df: использование диска

```bash
# Общая сводка
docker system df

# TYPE            TOTAL   ACTIVE  SIZE     RECLAIMABLE
# Images          15      5       4.2GB    2.8GB (66%)
# Containers      8       3       150MB    120MB (80%)
# Local Volumes   10      4       1.5GB    800MB (53%)
# Build Cache     20      0       500MB    500MB (100%)

# Подробно по каждому объекту
docker system df -v
```

---

## 🔥 Отладка типичных ошибок

### 1. Контейнер немедленно завершается (Exit Code 0)

```bash
$ docker run -d myapp
$ docker ps -a
CONTAINER ID  STATUS                  NAMES
a1b2c3d4e5f6  Exited (0) 1 sec ago    myapp
```

**Причина:** Главный процесс контейнера завершается. Контейнер живёт, пока работает PID 1.

```bash
# Диагностика
docker logs myapp
docker inspect --format='{{.Config.Cmd}}' myapp

# ❌ Частые ошибки
# CMD запускает скрипт, который завершается
CMD ["bash", "setup.sh"]

# ❌ Процесс уходит в фон
CMD ["nginx"]              # nginx по умолчанию демонизируется

# ✅ Исправление: процесс на переднем плане
CMD ["nginx", "-g", "daemon off;"]
CMD ["node", "server.js"]  # Node.js работает на переднем плане
```

### 2. Контейнер завершается с кодом 1 (ошибка приложения)

```bash
$ docker ps -a
CONTAINER ID  STATUS                  NAMES
a1b2c3d4e5f6  Exited (1) 5 secs ago   api
```

```bash
# Диагностика
docker logs api
# Error: Cannot find module '/app/server.js'
# или
# Error: ECONNREFUSED 127.0.0.1:5432

# Проверить файлы в контейнере
docker run -it myapp sh
ls -la /app/

# Проверить переменные окружения
docker inspect --format='{{json .Config.Env}}' api | jq .
```

### 3. Контейнер завершается с кодом 137 (OOM Killed / SIGKILL)

```bash
$ docker ps -a
CONTAINER ID  STATUS                    NAMES
a1b2c3d4e5f6  Exited (137) 2 mins ago   api
```

Exit code 137 = 128 + 9 (SIGKILL). Две основные причины:

```bash
# Проверить OOM
docker inspect --format='{{.State.OOMKilled}}' api
# true → контейнер убит из-за нехватки памяти

# Проверить лимиты памяти
docker inspect --format='{{.HostConfig.Memory}}' api
# 536870912 (512 МБ)

# Посмотреть пиковое потребление перед крашем
docker stats --no-stream api   # Если контейнер ещё жив

# Решение: увеличить лимит памяти
docker run -m 1g myapp
```

```yaml
# docker-compose.yml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 1G
```

### 4. Конфликт портов

```bash
$ docker run -p 3000:3000 myapp
# Error: Bind for 0.0.0.0:3000 failed: port is already allocated

# Диагностика: кто занимает порт
docker ps --format '{{.Names}}\t{{.Ports}}' | grep 3000
# или на хосте
lsof -i :3000    # macOS/Linux
netstat -tlnp | grep 3000

# Решение: другой порт или остановить занимающий
docker run -p 3001:3000 myapp
```

### 5. Permission denied (файлы и тома)

```bash
$ docker logs api
# Error: EACCES: permission denied, open '/data/config.json'

# Диагностика
docker exec api ls -la /data/
docker exec api id
# uid=1000(node) gid=1000(node)

# Проверить владельца на хосте
ls -la ./data/

# Решение: правильные права
# В Dockerfile
RUN chown -R node:node /data
USER node

# Или при запуске
docker run -u $(id -u):$(id -g) -v ./data:/data myapp
```

### 6. Сетевые проблемы между контейнерами

```bash
$ docker logs api
# Error: getaddrinfo ENOTFOUND db

# Диагностика: контейнеры в одной сети?
docker network inspect mynetwork

# Проверить DNS из контейнера
docker exec api ping db
docker exec api nslookup db

# ❌ Частая ошибка: контейнеры в разных сетях
docker network ls
docker inspect --format='{{json .NetworkSettings.Networks}}' api
docker inspect --format='{{json .NetworkSettings.Networks}}' db

# ✅ Решение: подключить к общей сети
docker network create mynet
docker network connect mynet api
docker network connect mynet db
```

### 7. Образ не найден или ошибка сборки

```bash
# Образ не найден
$ docker run myapp:v2
# Unable to find image 'myapp:v2' locally
# Error: pull access denied

# Ошибка сборки
$ docker build -t myapp .
# Step 5/10: COPY package.json .
# COPY failed: file not found in build context

# Диагностика
docker images | grep myapp
ls -la package.json
cat .dockerignore    # Может исключать нужные файлы!
```

---

## 🔥 Стратегия отладки: пошаговый алгоритм

Когда контейнер не работает, следуйте этому алгоритму:

```
1. docker ps -a               → Статус и exit code
2. docker logs <container>     → Что написало приложение
3. docker inspect <container>  → Конфигурация, сети, env, OOM
4. docker exec -it <c> sh     → Зайти внутрь и проверить
5. docker events --since 1h    → Что произошло на уровне Docker
6. docker stats               → Ресурсы (CPU, RAM, I/O)
7. docker system df            → Место на диске
```

### Пример отладки: API не отвечает

```bash
# Шаг 1: Статус
$ docker ps -a | grep api
a1b2c3d4e5f6  myapp  Exited (137) 5m ago  api

# Шаг 2: Логи
$ docker logs --tail 50 api
[2024-01-15T10:30:00Z] Server started on port 3000
[2024-01-15T10:35:00Z] Processing large request...
# Логи обрываются → возможно OOM

# Шаг 3: Inspect
$ docker inspect --format='{{.State.OOMKilled}}' api
true
$ docker inspect --format='{{.HostConfig.Memory}}' api
268435456    # 256 МБ -- слишком мало

# Шаг 4: Решение -- увеличить память и перезапустить
# Обновить docker-compose.yml:
#   deploy.resources.limits.memory: 1G
$ docker compose up -d api
```

---

## ⚠️ Частые ошибки новичков

### 🐛 1. Не настроена ротация логов

```yaml
# ❌ Логи растут без ограничений
services:
  api:
    image: myapp
    # Нет секции logging!
```

> **Почему это ошибка:** По умолчанию `json-file` драйвер не ограничивает размер. Через неделю-две лог-файл может занять десятки гигабайт и заполнить диск. Сервер перестанет работать.

```yaml
# ✅ Обязательно настройте ротацию
services:
  api:
    image: myapp
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"
```

### 🐛 2. Использование docker logs с удалённым logging driver

```bash
# ❌ docker logs не работает с syslog/fluentd/awslogs
docker run --log-driver syslog myapp
docker logs myapp
# Error: "logs" command is supported only for "json-file" and "journald" logging drivers
```

> **Почему это ошибка:** Удалённые драйверы отправляют логи напрямую в целевую систему. Docker не хранит копию локально (если не включён dual logging).

```bash
# ✅ Используйте json-file/local/journald для доступа через docker logs
# Или включите dual logging в daemon.json
```

### 🐛 3. Приложение пишет логи в файл, а не в STDOUT

```dockerfile
# ❌ Логи в файл -- docker logs пуст
CMD ["myapp", "--logfile=/var/log/app.log"]
```

> **Почему это ошибка:** Docker перехватывает только STDOUT и STDERR. Логи в файл внутри контейнера не видны через `docker logs` и не обрабатываются logging driver.

```dockerfile
# ✅ Перенаправить логи в STDOUT
# Для nginx:
RUN ln -sf /dev/stdout /var/log/nginx/access.log \
    && ln -sf /dev/stderr /var/log/nginx/error.log

# Для приложения: настройте логирование в STDOUT
CMD ["myapp", "--log-to-stdout"]
```

### 🐛 4. Не проверяют exit code контейнера

```bash
# ❌ "Контейнер упал" без анализа причины
docker restart api   # Перезапуск без диагностики
```

> **Почему это ошибка:** Exit code содержит важную информацию: 0 -- нормальное завершение, 1 -- ошибка приложения, 137 -- SIGKILL/OOM, 143 -- SIGTERM, 126 -- не исполняемый, 127 -- команда не найдена.

```bash
# ✅ Сначала диагностика, потом решение
docker inspect --format='{{.State.ExitCode}}' api
docker inspect --format='{{.State.OOMKilled}}' api
docker logs --tail 100 api
# Только после анализа -- решение
```

### 🐛 5. Игнорирование docker system df

```bash
# ❌ "Непонятно, куда делось место на диске"
df -h /
# /dev/sda1  100G  95G  5G  95%
```

> **Почему это ошибка:** Docker накапливает неиспользуемые образы, остановленные контейнеры, осиротевшие тома и build cache. Без периодической очистки они заполняют диск.

```bash
# ✅ Регулярно проверяйте и чистите
docker system df
docker system prune           # Удалить неиспользуемое
docker system prune -a        # Включая все образы без контейнеров
docker volume prune           # Осиротевшие тома
```

---

## 💡 Best practices

### 1. Всегда настраивайте ротацию логов

```yaml
# ✅ Глобально в daemon.json или для каждого сервиса
logging:
  driver: json-file
  options:
    max-size: "10m"
    max-file: "5"
```

### 2. Логируйте в STDOUT/STDERR

```dockerfile
# ✅ Перенаправляйте файловые логи в потоки
RUN ln -sf /dev/stdout /var/log/nginx/access.log
```

### 3. Используйте Go templates для inspect

```bash
# ✅ Извлекайте нужные данные, не парсите JSON вручную
docker inspect --format='{{.State.Status}}' mycontainer
```

### 4. Следуйте алгоритму отладки

```bash
# ✅ logs → inspect → exec → events → stats
# Не перезапускайте контейнер без диагностики
```

### 5. Мониторьте ресурсы в production

```bash
# ✅ Периодически проверяйте потребление
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemPerc}}"
docker system df
```

### 6. Знайте exit codes

```
0   -- Нормальное завершение
1   -- Ошибка приложения
126 -- Файл не исполняемый
127 -- Команда не найдена
137 -- SIGKILL (kill -9 или OOM)
143 -- SIGTERM (graceful shutdown)
```

---

## 📌 Итоги

- ✅ **docker logs** -- основной инструмент чтения логов (-f, --tail, --since, -t)
- ✅ Docker перехватывает только **STDOUT и STDERR**, логи в файлы -- невидимы
- ✅ **Logging drivers**: json-file (по умолчанию), local (оптимизированный), syslog, fluentd, awslogs
- ✅ **Ротация логов** (max-size, max-file) -- обязательна в production
- ✅ **docker inspect** -- полная информация о контейнере, Go templates для извлечения данных
- ✅ **docker stats** -- мониторинг CPU, RAM, I/O в реальном времени
- ✅ **docker top** -- процессы внутри контейнера без exec
- ✅ **docker events** -- события Docker daemon (создание, старт, ошибки, OOM)
- ✅ **docker system df** -- использование диска Docker-объектами
- ✅ **Exit codes**: 0 (ОК), 1 (ошибка), 137 (SIGKILL/OOM), 143 (SIGTERM)
- ✅ **Алгоритм отладки**: ps → logs → inspect → exec → events → stats → system df
- ✅ Всегда **диагностируйте** перед перезапуском контейнера
