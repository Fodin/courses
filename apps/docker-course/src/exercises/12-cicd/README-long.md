# Уровень 12: CI/CD с Docker

## Введение

Представьте себе автомобильный завод. На заводе есть конвейер: каждая машина проходит через десятки станций -- от сварки кузова до финальной проверки качества. На каждой станции робот выполняет свою задачу, проверяет результат и передаёт дальше. Если на какой-то станции обнаружен дефект, конвейер останавливается -- бракованная деталь не попадёт в готовый автомобиль.

А теперь представьте завод, где вместо конвейера -- один человек. Он вручную сваривает кузов, вручную красит, вручную вкручивает каждый болт, вручную проверяет качество. Один пропущенный болт -- и колесо отлетает на трассе. Один забытый этап покраски -- и машина ржавеет через месяц.

CI/CD -- это конвейер для вашего кода. Каждый коммит проходит через автоматические станции: сборка, тестирование, проверка безопасности, доставка в production. Человек пишет код, а всё остальное делает автоматика. И если что-то сломалось -- конвейер остановится до того, как баг попадёт к пользователям.

В этом уровне мы подробно разберём:

1. **Зачем нужен CI/CD** -- какие проблемы решает автоматизация и чем опасен ручной деплой
2. **Стадии пайплайна** -- из чего состоит путь от коммита до production
3. **Docker в CI** -- сборка образов, кэширование слоёв, тестирование в контейнерах
4. **GitHub Actions и GitLab CI** -- конфигурация пайплайнов для двух самых популярных платформ
5. **Container Registry** -- где хранить образы и как с ними работать
6. **Стратегии тегирования** -- как правильно версионировать образы
7. **Деплой-стратегии** -- rolling update, blue-green, canary
8. **Production-конфигурация** -- health checks, мониторинг, автоматический rollback
9. **Типичные ошибки** -- что обычно идёт не так и как этого избежать

---

## 1. Зачем нужен CI/CD

### Боль ручного деплоя

Многие команды начинают с ручного процесса. Разработчик собирает образ на своей машине, заходит по SSH на сервер, делает `git pull` и `docker-compose up -d`. Для pet-проекта или хакатона это работает. Но в реальной продакшен-среде такой подход неизбежно приводит к проблемам.

```bash
# Типичный "деплой" в маленькой команде
$ ssh production-server
$ cd /app
$ git pull
$ docker-compose build
$ docker-compose up -d
# "Ну вроде работает..."

# А через час:
# - Продакшен упал, потому что забыли запустить миграции
# - Образ собран с dev-зависимостями
# - Никто не знает, какая версия кода сейчас в проде
# - Откат? Какой откат? git log и молитва
```

Проблема здесь не в конкретных командах, а в человеческом факторе. Даже самый дисциплинированный разработчик рано или поздно забудет один из десяти шагов деплоя. Особенно в пятницу вечером, когда горит хотфикс.

```mermaid
flowchart TD
    subgraph manual["Ручной деплой"]
        D["Разработчик"] --> GP["git push"]
        GP --> SSH["SSH на сервер"]
        SSH --> BUILD["docker build"]

        D --> HF["Человеческий фактор"]
        HF --> E1["Забыл запустить тесты"]
        HF --> E2["Собрал не ту ветку"]
        HF --> E3["Не обновил .env"]
        HF --> E4["Забыл про миграции"]
        HF --> E5["Нет rollback-плана"]

        E1 & E2 & E3 & E4 & E5 --> PROBLEM["ПРОБЛЕМА"]
        BUILD --> DOWNTIME["DOWNTIME"]
    end

    style PROBLEM fill:#f8d7da,stroke:#dc3545
    style DOWNTIME fill:#f8d7da,stroke:#dc3545
    style HF fill:#fff3cd,stroke:#ffc107
    style manual fill:#fff5f5,stroke:#dc3545
```

### Что даёт CI/CD

CI/CD убирает человека из цепочки "код написан -- код в продакшене". Человек пишет код и делает push. Всё остальное происходит автоматически:

```mermaid
flowchart LR
    GP["git push"] --> CI["CI: Build + Lint + Scan"]
    CI --> T["Tests: unit, e2e, integration"]
    T --> PI["Push Image в Registry"]
    PI --> CD["CD: Deploy в production"]

    CI --> R1["Автоматически воспроизводимо"]
    T --> R2["Гарантия качества"]
    PI --> R3["Версионный контроль образов"]
    CD --> R4["Безопасный rollback"]

    style GP fill:#e3f2fd,stroke:#1976d2
    style CI fill:#e8f5e9,stroke:#388e3c
    style T fill:#e8f5e9,stroke:#388e3c
    style PI fill:#e8f5e9,stroke:#388e3c
    style CD fill:#e8f5e9,stroke:#388e3c
    style R1 fill:#f3e5f5,stroke:#7b1fa2
    style R2 fill:#f3e5f5,stroke:#7b1fa2
    style R3 fill:#f3e5f5,stroke:#7b1fa2
    style R4 fill:#f3e5f5,stroke:#7b1fa2
```

Ключевые преимущества:

| Аспект | Ручной деплой | CI/CD |
|--------|---------------|-------|
| Скорость | 20-60 минут на деплой | 5-15 минут от push до production |
| Надёжность | Зависит от человека | Одинаковый результат каждый раз |
| Откат | git revert + пересборка | Переключение на предыдущий образ за секунды |
| Аудит | "Кто вчера деплоил?" | Полная история: кто, когда, какой коммит |
| Масштаб | Один сервер -- ещё ок, три -- уже хаос | 1 или 100 серверов -- одинаковый процесс |

### CI, CD Delivery и CD Deployment -- в чём разница

Эти три аббревиатуры часто путают, но между ними есть принципиальная разница.

**CI (Continuous Integration)** -- автоматическая сборка и тестирование при каждом коммите. Цель -- обнаружить ошибки как можно раньше, пока код ещё "свежий" в голове разработчика. Если тесты упали -- разработчик получает уведомление и исправляет проблему до того, как она попадёт в основную ветку.

**CD (Continuous Delivery)** -- автоматическая доставка протестированного кода до staging-окружения. Код всегда готов к релизу, но последний шаг -- деплой в production -- выполняется вручную, после подтверждения человеком. Это подходит для компаний с регуляторными требованиями или когда деплой требует координации между командами.

**CD (Continuous Deployment)** -- полная автоматизация. Каждый коммит, прошедший все проверки, автоматически деплоится в production. Никакого ручного подтверждения. Это требует высокого уровня зрелости: хорошего покрытия тестами, мониторинга, автоматического rollback.

```mermaid
flowchart LR
    subgraph CI["CI -- Continuous Integration"]
        P["Push"] --> B["Build"]
        B --> T["Test"]
        T --> L["Lint + Scan"]
    end
    subgraph CDel["CD -- Continuous Delivery"]
        SD["Staging Deploy"]
        SD --> MA["Manual Approval"]
        MA --> PD["Production Deploy"]
    end
    subgraph CDep["CD -- Continuous Deployment"]
        AP["Auto Production Deploy -- no approval"]
    end
    CI --> CDel
    CDel --> CDep
```

На практике большинство команд используют Continuous Delivery: автоматический деплой на staging, ручное подтверждение для production. Continuous Deployment -- это следующий шаг эволюции, к которому приходят зрелые команды с хорошей инфраструктурой тестирования.

---

## 2. Стадии CI/CD пайплайна для Docker

### Анатомия пайплайна

Пайплайн -- это последовательность стадий, через которые проходит код на пути к production. Каждая стадия выполняет свою задачу и может остановить весь процесс при обнаружении проблемы.

```yaml
# Стадии пайплайна
stages:
  - lint        # Проверка кода и Dockerfile
  - build       # Сборка Docker-образа
  - test        # Запуск тестов внутри контейнера
  - scan        # Сканирование образа на уязвимости
  - push        # Отправка образа в Registry
  - deploy      # Деплой в staging/production
  - verify      # Smoke-тесты после деплоя
```

Разберём каждую стадию подробнее.

**Lint** -- первая и самая быстрая стадия. Проверяет код на стилевые ошибки и Dockerfile на соответствие best practices. Для Dockerfile используется инструмент [hadolint](https://github.com/hadolint/hadolint), который выявляет проблемы вроде использования `latest`-тегов, отсутствия `--no-cache-dir` при `pip install` и других антипаттернов.

```bash
# hadolint анализирует Dockerfile и выдаёт предупреждения
hadolint Dockerfile
# DL3007: Using latest is prone to errors
# DL3013: Pin versions in pip install
# DL3018: Pin versions in apk add
```

**Build** -- сборка Docker-образа. В CI это происходит на "чистой" машине, что гарантирует воспроизводимость. Если образ собирается на машине разработчика, там могут быть локальные файлы, кэши, переменные окружения, которые влияют на результат. CI-машина каждый раз стартует с нуля.

**Test** -- запуск тестов внутри собранного контейнера. Важно: тесты запускаются именно в том контейнере, который поедет в production. Не на локальной машине с другой версией Node.js, не в отдельном окружении -- а в том самом образе.

**Scan** -- сканирование образа на известные уязвимости (CVE). Инструменты вроде Docker Scout, Trivy или Snyk проверяют каждый пакет в образе на наличие известных проблем безопасности.

**Push** -- отправка проверенного образа в Container Registry. Образ получает теги (версию, SHA коммита) и становится доступен для деплоя.

**Deploy** -- собственно деплой: обновление контейнеров в production-окружении на новую версию образа.

**Verify** -- smoke-тесты после деплоя: проверка, что приложение действительно работает в production. Если проверка не прошла -- автоматический откат.

```mermaid
sequenceDiagram
    participant Dev as Разработчик
    participant Git as GitHub / GitLab
    participant CI as CI Runner
    participant Reg as Container Registry
    participant Prod as Production

    Dev->>Git: git push
    Git->>CI: Webhook -- запуск пайплайна
    CI->>CI: Lint -- hadolint, eslint
    CI->>CI: Build -- docker buildx build
    CI->>CI: Test -- docker run tests
    CI->>CI: Scan -- trivy, docker scout
    CI->>Reg: Push -- docker push image:tag
    CI->>Prod: Deploy -- обновление контейнеров
    Prod->>Prod: Health check
    alt Health OK
        Prod-->>CI: Деплой успешен
    else Health FAIL
        Prod->>Prod: Rollback на предыдущую версию
        Prod-->>CI: Деплой откачен
    end
    CI-->>Dev: Уведомление о результате
```

### Принцип "быстрое первым"

Порядок стадий не случаен. Быстрые проверки идут первыми, медленные -- последними. Lint занимает секунды и ловит опечатки. Нет смысла тратить 10 минут на сборку образа, если в коде синтаксическая ошибка.

Этот принцип называется **fast feedback** -- разработчик должен узнать о проблеме как можно быстрее. Если lint упал через 5 секунд, разработчик ещё помнит, что написал. Если e2e-тесты упали через 30 минут -- контекст уже потерян.

---

## 3. Docker в CI: сборка образов

### Особенности сборки в CI-среде

Сборка Docker-образа в CI отличается от локальной сборки несколькими важными аспектами.

Во-первых, CI-раннер обычно стартует с чистого состояния. Это значит, что никакого локального кэша Docker нет -- каждый слой нужно собирать заново или явно подгружать кэш из внешнего источника.

Во-вторых, CI-сборка должна быть детерминированной. Один и тот же коммит должен давать одинаковый результат, независимо от того, на каком раннере он собирается.

В-третьих, в CI удобно добавлять метаданные в образ -- SHA коммита, дату сборки, версию. Это критически важно для отладки: когда production горит, нужно быстро определить, какой именно код работает.

```dockerfile
# Dockerfile для CI-сборки
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем только package-файлы для кэширования зависимостей
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Метаданные для трейсинга -- CI добавит значения при сборке
ARG BUILD_DATE
ARG GIT_SHA
ARG VERSION
LABEL org.opencontainers.image.created=$BUILD_DATE
LABEL org.opencontainers.image.revision=$GIT_SHA
LABEL org.opencontainers.image.version=$VERSION

USER node
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Обратите внимание на `ARG` и `LABEL`. При сборке в CI передаются аргументы:

```bash
docker build \
  --build-arg BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ") \
  --build-arg GIT_SHA=$(git rev-parse --short HEAD) \
  --build-arg VERSION=1.2.3 \
  -t myapp:v1.2.3 .
```

Потом эти метаданные можно прочитать:

```bash
docker inspect myapp:v1.2.3 --format='{{index .Config.Labels "org.opencontainers.image.revision"}}'
# a1b2c3d
```

Это как серийный номер на заводском изделии -- всегда можно отследить, откуда оно взялось.

### Кэширование слоёв в CI

Одна из главных проблем Docker в CI -- потеря кэша между сборками. На локальной машине Docker кэширует каждый слой: если `package.json` не изменился, `npm install` не повторяется. Но CI-раннер каждый раз стартует "с нуля", и весь кэш теряется.

Без кэширования типичная сборка Node.js-приложения занимает 5-10 минут (скачивание базового образа + установка зависимостей + сборка). С кэшированием -- 30-60 секунд, если зависимости не менялись.

```bash
# Без кэширования: каждая сборка скачивает всё заново
# Время: 5-10 минут
docker build -t myapp .

# С кэшированием через registry -- кэш хранится удалённо
# Время: 30-60 секунд (если зависимости не изменились)
docker buildx build \
  --cache-from=type=registry,ref=myregistry.io/myapp:cache \
  --cache-to=type=registry,ref=myregistry.io/myapp:cache,mode=max \
  -t myapp:latest .
```

Для работы с кэшем необходим `docker buildx` -- расширенный билдер, который поддерживает различные бэкенды кэширования.

**Виды кэша:**

| Тип кэша | Где хранится | Shared между раннерами | Лучше всего подходит для |
|-----------|-------------|----------------------|--------------------------|
| `type=local` | Локальная директория | Нет | Self-hosted раннеры с persistent storage |
| `type=registry` | Container Registry | Да | Любая CI-система, универсальный вариант |
| `type=gha` | GitHub Actions Cache | Да (в рамках репозитория) | GitHub Actions |
| `type=s3` | AWS S3 или MinIO | Да | Крупные проекты с большим кэшем |

```bash
# GitHub Actions Cache -- самый простой вариант для GitHub
docker buildx build \
  --cache-from=type=gha \
  --cache-to=type=gha,mode=max \
  -t myapp:latest .

# Registry cache -- универсальный вариант
docker buildx build \
  --cache-from=type=registry,ref=ghcr.io/myorg/myapp:cache \
  --cache-to=type=registry,ref=ghcr.io/myorg/myapp:cache,mode=max \
  -t myapp:latest .

# Локальный кэш -- для self-hosted раннеров
docker buildx build \
  --cache-from=type=local,src=/tmp/.buildx-cache \
  --cache-to=type=local,dest=/tmp/.buildx-cache-new,mode=max \
  -t myapp:latest .
```

Параметр `mode=max` кэширует все промежуточные слои, а не только финальный. Это значительно ускоряет пересборку при изменениях на ранних стадиях Dockerfile. Без `mode=max` кэшируется только финальный stage multi-stage build, и при изменении зависимостей весь builder-stage собирается заново.

### Ротация локального кэша

При использовании `type=local` в CI возникает нюанс: если писать и читать из одной директории, кэш может "протухнуть" или разрастись. Стандартный паттерн -- писать в новую директорию и подменять старую:

```bash
# Сборка с ротацией кэша
docker buildx build \
  --cache-from=type=local,src=/tmp/.buildx-cache \
  --cache-to=type=local,dest=/tmp/.buildx-cache-new,mode=max \
  -t myapp:latest .

# Заменяем старый кэш новым
rm -rf /tmp/.buildx-cache
mv /tmp/.buildx-cache-new /tmp/.buildx-cache
```

---

## 4. GitHub Actions: CI/CD для Docker

### Структура workflow

GitHub Actions -- одна из самых популярных CI/CD платформ, тесно интегрированная с GitHub. Конфигурация пайплайна описывается в YAML-файлах в директории `.github/workflows/`.

Основные концепции:

- **Workflow** -- весь пайплайн, описанный в одном YAML-файле
- **Job** -- группа шагов, выполняющихся на одном раннере
- **Step** -- отдельный шаг внутри job
- **Action** -- переиспользуемый блок (аналог функции)

```mermaid
flowchart TD
    subgraph workflow["Workflow: docker.yml"]
        subgraph j1["Job: lint"]
            s1["Step: checkout"]
            s2["Step: hadolint"]
            s1 --> s2
        end
        subgraph j2["Job: build-and-test"]
            s3["Step: checkout"]
            s4["Step: setup buildx"]
            s5["Step: build image"]
            s6["Step: run tests"]
            s3 --> s4 --> s5 --> s6
        end
        subgraph j3["Job: push"]
            s7["Step: login to GHCR"]
            s8["Step: build and push"]
            s7 --> s8
        end
        subgraph j4["Job: deploy"]
            s9["Step: SSH deploy"]
            s10["Step: health check"]
            s9 --> s10
        end
        j1 --> j2
        j2 --> j3
        j3 --> j4
    end
```

### Базовый workflow

Разберём полный workflow, объясняя каждый блок:

```yaml
# .github/workflows/docker.yml
name: Docker CI/CD

# Когда запускать пайплайн
on:
  push:
    branches: [main, develop]      # На push в main или develop
  pull_request:
    branches: [main]               # На PR в main

# Переменные, доступные всем jobs
env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # === Стадия 1: Lint ===
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint Dockerfile
        uses: hadolint/hadolint-action@v3.1.0
        with:
          dockerfile: Dockerfile

  # === Стадия 2: Build + Test ===
  build-and-test:
    runs-on: ubuntu-latest
    needs: lint                    # Запускается только после lint
    steps:
      - uses: actions/checkout@v4

      # Docker Buildx -- расширенный билдер с кэшированием
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Собираем образ, но не пушим -- только для тестов
      - name: Build test image
        uses: docker/build-push-action@v5
        with:
          context: .
          target: builder          # Используем builder-stage (с dev-зависимостями)
          load: true               # Загрузить в локальный Docker (не push)
          tags: myapp:test
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Тесты запускаются внутри собранного контейнера
      - name: Run tests
        run: |
          docker run --rm myapp:test npm test
          docker run --rm myapp:test npm run test:e2e

  # === Стадия 3: Push в Registry ===
  push:
    runs-on: ubuntu-latest
    needs: build-and-test
    # Пушим только при push (не при PR)
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write              # Разрешение на запись в GHCR
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Авторизация в GitHub Container Registry
      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Автоматическая генерация тегов на основе git-контекста
      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha
            type=ref,event=branch
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      # Сборка и push в одном шаге
      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

Разберём ключевые моменты:

- `needs: lint` -- job `build-and-test` не стартует, пока `lint` не завершится успешно. Это создаёт зависимости между стадиями.
- `if: github.event_name == 'push'` -- job `push` пропускается для pull request-ов. PR только проверяются, но образ не отправляется в registry.
- `permissions` -- минимальные права. Принцип наименьших привилегий: job получает только те права, которые ему нужны.
- `docker/metadata-action` -- автоматически генерирует теги из git-контекста. Push в `main` создаст теги `main` и `sha-a1b2c3d`. Создание тега `v1.2.3` создаст теги `1.2.3`, `1.2`.

### Matrix Builds -- мультиплатформенные образы

Современные приложения часто должны работать на нескольких платформах: `linux/amd64` (обычные серверы) и `linux/arm64` (AWS Graviton, Apple Silicon). Matrix strategy позволяет собирать образы для нескольких комбинаций параллельно:

```yaml
jobs:
  build:
    strategy:
      matrix:
        platform: [linux/amd64, linux/arm64]
        node-version: [18, 20, 22]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # QEMU нужен для эмуляции ARM на x86-раннере
      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: ${{ matrix.platform }}
          build-args: NODE_VERSION=${{ matrix.node-version }}
          tags: myapp:node${{ matrix.node-version }}-${{ matrix.platform }}
```

Matrix `3 x 2` создаёт 6 параллельных jobs. Это значительно быстрее, чем последовательная сборка, но расходует больше раннер-минут.

### Интеграционные тесты с Docker Compose в CI

Для полноценных интеграционных тестов часто нужна инфраструктура: база данных, Redis, очередь сообщений. Docker Compose позволяет поднять всё это прямо в CI:

```yaml
  integration-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Поднимаем все сервисы
      - name: Start services
        run: docker compose -f docker-compose.test.yml up -d

      # Ждём, пока сервисы станут доступны
      - name: Wait for services
        run: |
          timeout 60 bash -c 'until docker compose -f docker-compose.test.yml exec -T db pg_isready; do sleep 2; done'
          timeout 60 bash -c 'until curl -f http://localhost:3000/health; do sleep 2; done'

      # Запускаем тесты
      - name: Run integration tests
        run: docker compose -f docker-compose.test.yml exec -T app npm run test:integration

      # При ошибке -- собираем логи для отладки
      - name: Collect logs on failure
        if: failure()
        run: docker compose -f docker-compose.test.yml logs > docker-logs.txt

      - name: Upload logs
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: docker-logs
          path: docker-logs.txt

      # Гарантированная очистка (даже при ошибке)
      - name: Cleanup
        if: always()
        run: docker compose -f docker-compose.test.yml down -v
```

Обратите внимание на несколько важных деталей:

- `timeout 60 bash -c 'until ...'` -- ожидание с таймаутом. Без таймаута CI-job может зависнуть навсегда, если сервис не стартует.
- `-T` в `docker compose exec -T` -- отключение TTY. В CI нет интерактивного терминала, и без `-T` команда упадёт.
- `if: failure()` -- шаг выполняется только если предыдущие шаги упали. Это позволяет собрать диагностику.
- `if: always()` -- шаг выполняется всегда, даже при ошибке. Cleanup должен быть гарантирован, чтобы не утекали ресурсы.
- `-v` в `docker compose down -v` -- удаляет volumes, чтобы тестовые данные не "протекли" в следующий запуск.

---

## 5. GitLab CI: Docker в пайплайнах

### Структура .gitlab-ci.yml

GitLab CI -- встроенная в GitLab система CI/CD. Она ближе к "всё в одном": registry, CI, CD, мониторинг -- всё внутри GitLab.

Основное отличие от GitHub Actions: в GitLab каждый job запускается внутри Docker-контейнера (image). Это создаёт интересную ситуацию -- чтобы собрать Docker-образ, нужно запустить Docker внутри Docker.

```yaml
# .gitlab-ci.yml
stages:
  - lint
  - build
  - test
  - push
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  DOCKER_TAG: $CI_COMMIT_SHORT_SHA

# Docker-in-Docker (DinD) -- Docker daemon как отдельный сервис
services:
  - docker:24-dind

lint:
  stage: lint
  image: hadolint/hadolint:latest-alpine
  script:
    - hadolint Dockerfile

build:
  stage: build
  image: docker:24
  script:
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    # Сохраняем образ как артефакт для следующих стадий
    - docker save $DOCKER_IMAGE:$DOCKER_TAG > image.tar
  artifacts:
    paths:
      - image.tar
    expire_in: 1 hour

test:
  stage: test
  image: docker:24
  script:
    # Загружаем образ из артефакта
    - docker load < image.tar
    - docker run --rm $DOCKER_IMAGE:$DOCKER_TAG npm test

push:
  stage: push
  image: docker:24
  only:
    - main
    - tags
  script:
    - docker load < image.tar
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
    - |
      if [ -n "$CI_COMMIT_TAG" ]; then
        docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:$CI_COMMIT_TAG
        docker push $DOCKER_IMAGE:$CI_COMMIT_TAG
      fi
```

Ключевые переменные GitLab CI:

| Переменная | Описание | Пример |
|------------|----------|--------|
| `$CI_REGISTRY_IMAGE` | Адрес образа в GitLab Registry | `registry.gitlab.com/mygroup/myapp` |
| `$CI_COMMIT_SHORT_SHA` | Короткий SHA коммита | `a1b2c3d` |
| `$CI_COMMIT_TAG` | Git-тег (если есть) | `v1.2.3` |
| `$CI_REGISTRY_USER` | Пользователь для registry | `gitlab-ci-token` |
| `$CI_REGISTRY_PASSWORD` | Токен для registry | автоматический |

### Docker-in-Docker vs Kaniko

Docker-in-Docker (DinD) -- это запуск Docker daemon внутри Docker-контейнера CI-раннера. Это работает, но требует **привилегированного режима**, что создаёт риски безопасности: контейнер с привилегиями может получить доступ к хост-машине.

**Kaniko** -- альтернатива, которая собирает Docker-образы без Docker daemon. Kaniko работает в user-space и не требует привилегий:

```yaml
build-kaniko:
  stage: build
  image:
    name: gcr.io/kaniko-project/executor:v1.19.2-debug
    entrypoint: [""]
  script:
    - /kaniko/executor
      --context "${CI_PROJECT_DIR}"
      --dockerfile "${CI_PROJECT_DIR}/Dockerfile"
      --destination "${CI_REGISTRY_IMAGE}:${CI_COMMIT_SHORT_SHA}"
      --cache=true
      --cache-repo="${CI_REGISTRY_IMAGE}/cache"
```

Когда использовать что:

| Критерий | Docker-in-Docker | Kaniko |
|----------|-----------------|--------|
| Безопасность | Нужен privileged | Без привилегий |
| Совместимость | Полная поддержка Docker | Большинство Dockerfile |
| Скорость | Быстрее (нативный Docker) | Чуть медленнее |
| Kubernetes | Проблемы с привилегиями | Идеально подходит |
| Сложность | Проще настроить | Больше нюансов |

Рекомендация: если CI работает в Kubernetes (что всё чаще) -- используйте Kaniko. Если на обычных VM-раннерах -- DinD проще и быстрее.

---

## 6. Container Registries -- где хранить образы

### Что такое Container Registry

Container Registry -- это хранилище для Docker-образов. По аналогии: если GitHub -- это хранилище для кода, то Registry -- хранилище для собранных артефактов. Каждый раз, когда CI собирает образ, он отправляется в Registry. А при деплое production-сервер скачивает образ оттуда.

```mermaid
flowchart LR
    CI["CI Runner"] -->|docker push| REG["Container Registry"]
    REG -->|docker pull| PROD["Production Server"]
    REG -->|docker pull| STAG["Staging Server"]
    REG -->|docker pull| DEV["Developer Machine"]

    style REG fill:#e8f5e9,stroke:#388e3c
```

### Обзор популярных реестров

| Registry | Провайдер | Бесплатный план | Лучше всего подходит для |
|----------|----------|-----------------|--------------------------|
| Docker Hub | Docker | 1 приватный репо | Open source, публичные образы |
| GHCR | GitHub | Безлимитно для public | Проекты на GitHub |
| ECR | AWS | 500 MB free tier | Приложения в AWS (ECS/EKS) |
| ACR | Azure | Basic tier | Приложения в Azure (AKS) |
| GCR / Artifact Registry | Google | 500 MB free | Приложения в GCP (GKE) |
| Harbor | Self-hosted | Бесплатно | Полный контроль, on-premise |

Выбор Registry зависит от того, где развёрнут ваш production. Если вы используете AWS -- берите ECR (минимальная задержка при pull из ECS/EKS). Если всё на GitHub -- GHCR. Универсальный вариант -- Docker Hub, но у него есть rate limits для бесплатных аккаунтов.

### Работа с GHCR

GHCR (GitHub Container Registry) -- наиболее удобный выбор для проектов на GitHub. Он тесно интегрирован с GitHub Actions: не нужно создавать отдельные credentials, достаточно `GITHUB_TOKEN`.

```bash
# Авторизация (локально)
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Тегирование и push
docker tag myapp:latest ghcr.io/username/myapp:v1.0.0
docker push ghcr.io/username/myapp:v1.0.0

# Pull
docker pull ghcr.io/username/myapp:v1.0.0
```

В GitHub Actions авторизация ещё проще:

```yaml
- name: Log in to GHCR
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

### Работа с AWS ECR

ECR (Elastic Container Registry) -- managed registry от AWS. Ключевая особенность: токен авторизации действует только 12 часов, после чего нужно получить новый.

```bash
# Авторизация (токен действует 12 часов)
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# Создание репозитория (нужно создать заранее)
aws ecr create-repository --repository-name myapp --region us-east-1

# Push
docker tag myapp:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/myapp:v1.0.0
```

Важная практика -- автоматическая очистка старых образов. Без lifecycle policy Registry будет расти бесконечно, и через год вы обнаружите сотни гигабайт неиспользуемых образов:

```bash
# Lifecycle policy -- автоматическое удаление старых образов
aws ecr put-lifecycle-policy \
  --repository-name myapp \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    }]
  }'
```

### Безопасность Registry

Перед отправкой образа в Registry (и тем более перед деплоем в production) образ необходимо проверить на уязвимости. Инструменты сканирования анализируют каждый пакет в образе и сравнивают с базами известных уязвимостей (CVE).

```bash
# Docker Scout -- встроенный в Docker Desktop сканер
docker scout cves myapp:latest

# Trivy -- популярный open-source сканер
trivy image myapp:latest
```

Для дополнительной безопасности можно подписывать образы с помощью cosign. Это гарантирует, что образ не был подменён между сборкой и деплоем:

```bash
# Подпись образа
cosign sign --key cosign.key ghcr.io/username/myapp:v1.0.0

# Верификация подписи при pull
cosign verify --key cosign.pub ghcr.io/username/myapp:v1.0.0
```

---

## 7. Стратегии тегирования образов

### Зачем нужны теги

Тег Docker-образа -- это его версия, его "имя собственное". Когда в production что-то сломалось, первый вопрос -- "какая версия кода сейчас работает?". Без правильного тегирования ответить на этот вопрос невозможно.

Хорошая стратегия тегирования должна обеспечивать три свойства:

1. **Идентификация** -- по тегу можно найти конкретный коммит в репозитории
2. **Воспроизводимость** -- один тег всегда соответствует одному и тому же образу
3. **Порядок** -- теги позволяют определить, какая версия новее

### Основные стратегии

```bash
# 1. Semantic Versioning -- для релизов
myapp:1.0.0          # Полная версия (конкретный релиз)
myapp:1.0             # Major.minor (последний patch)
myapp:1               # Major (последний minor.patch)

# 2. Git SHA -- для точной идентификации коммита
myapp:sha-a1b2c3d    # Первые 7 символов SHA коммита
myapp:main-a1b2c3d   # Ветка + SHA

# 3. Branch name -- для dev/staging окружений
myapp:main            # Последняя сборка из main
myapp:develop         # Последняя сборка из develop
myapp:feature-auth    # Feature branch

# 4. Timestamp -- для хронологической сортировки
myapp:20240315-143022 # Дата и время сборки
myapp:main-20240315   # Ветка + дата

# 5. Build number -- для CI
myapp:build-1234      # Номер сборки в CI
```

На практике лучше комбинировать несколько стратегий. Например, один и тот же образ может иметь теги `v1.2.3`, `sha-a1b2c3d` и `main`. Semver -- для людей ("задеплой версию 1.2.3"), SHA -- для точной идентификации ("этот образ собран из коммита a1b2c3d"), branch -- для автоматики ("staging всегда берёт тег develop").

### Почему `latest` -- плохая практика в production

```bash
# НИКОГДА не используйте latest в production!
docker pull myapp:latest

# Проблемы:
# 1. Какая версия кода? -- Неизвестно
# 2. Откат? -- Невозможно (latest уже перезаписан)
# 3. Воспроизводимость? -- Нет (завтра latest будет другим)
# 4. Кэширование? -- Непредсказуемое

# latest можно использовать только для:
# - Локальной разработки
# - Quick start в README проекта
```

Аналогия: представьте, что в аптеке все лекарства лежат в одинаковых белых коробках с надписью "последнее". Вы не знаете, что внутри, не можете сравнить с прошлым, не можете откатить назначение. Тег `latest` -- это та самая белая коробка.

### Автоматическое тегирование в GitHub Actions

`docker/metadata-action` -- действие, которое автоматически генерирует теги на основе git-контекста:

```yaml
- name: Docker meta
  id: meta
  uses: docker/metadata-action@v5
  with:
    images: ghcr.io/username/myapp
    tags: |
      # На push в main: main, sha-abc1234
      type=ref,event=branch
      type=sha

      # На создание тега v1.2.3: 1.2.3, 1.2, 1, latest
      type=semver,pattern={{version}}
      type=semver,pattern={{major}}.{{minor}}
      type=semver,pattern={{major}}

      # На PR: pr-42
      type=ref,event=pr

      # Всегда: дата сборки
      type=raw,value={{date 'YYYYMMDD-HHmmss'}}
```

Это действие анализирует git-контекст (ветку, тег, PR) и генерирует соответствующие Docker-теги. При push коммита в `main` образ получит теги `main` и `sha-abc1234`. При создании git-тега `v1.2.3` -- теги `1.2.3`, `1.2`, `1` и `latest`.

### Иммутабельность тегов

Хорошая практика -- никогда не перезаписывать существующие semver-теги. Если тег `v1.2.3` уже существует, нельзя собрать новый образ с тем же тегом. Это нарушает воспроизводимость: вчера `v1.2.3` был одним образом, а сегодня -- другим.

Некоторые Registry поддерживают immutable tags на уровне конфигурации:

```bash
# AWS ECR -- включение immutable tags
aws ecr put-image-tag-mutability \
  --repository-name myapp \
  --image-tag-mutability IMMUTABLE
```

Branch-теги (`main`, `develop`) по определению мутабельны -- они всегда указывают на последнюю сборку ветки. А semver-теги (`v1.2.3`) должны быть иммутабельны.

---

## 8. Тестирование с Docker в CI

### docker-compose.test.yml

Для интеграционных тестов создаётся отдельный Compose-файл с тестовой инфраструктурой:

```yaml
# docker-compose.test.yml
services:
  app:
    build:
      context: .
      target: builder
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@db:5432/testdb
      - REDIS_URL=redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: testdb
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U test"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
```

Здесь `depends_on` с `condition: service_healthy` гарантирует, что приложение не стартует, пока база данных и Redis не будут готовы принимать подключения. Без health checks приложение может запуститься до готовности БД и упасть при первом запросе.

### Паттерн Testcontainers

Testcontainers -- это библиотека, которая позволяет поднимать Docker-контейнеры прямо из тестового кода. Вместо отдельного `docker-compose.test.yml` инфраструктура создаётся программно:

```typescript
// Пример: тест с реальной базой данных
import { PostgreSqlContainer } from '@testcontainers/postgresql'

describe('User Repository', () => {
  let container: StartedPostgreSqlContainer

  beforeAll(async () => {
    // Поднимаем реальный PostgreSQL в Docker
    container = await new PostgreSqlContainer()
      .withDatabase('testdb')
      .start()
    // Подключаемся к реальной БД
    await connectDB(container.getConnectionUri())
    await runMigrations()
  })

  afterAll(async () => {
    await container.stop()
  })

  it('should create user', async () => {
    const user = await createUser({ name: 'Alice' })
    expect(user.id).toBeDefined()
  })
})
```

Преимущество Testcontainers: каждый тестовый suite получает свою изолированную инфраструктуру. Тесты не влияют друг на друга, не нужно чистить данные между запусками. Минус -- каждый suite тратит время на запуск контейнеров (обычно 5-15 секунд на контейнер).

---

## 9. Деплой-стратегии

### Зачем нужны стратегии деплоя

Самый простой способ обновить приложение -- остановить старую версию и запустить новую. Проблема: между остановкой и запуском пройдёт время (от секунд до минут), и в это время приложение недоступно. Для блога с тремя читателями это не проблема. Для интернет-магазина с тысячами заказов в минуту -- катастрофа.

Стратегии деплоя решают задачу: как обновить приложение без простоя (zero-downtime deployment) и с возможностью быстрого отката при проблемах.

### Rolling Update

Rolling Update -- постепенная замена старых контейнеров новыми. Вместо остановки всех контейнеров одновременно, обновляется один контейнер за раз. В любой момент времени часть контейнеров работает на старой версии, часть -- на новой.

Аналогия: замена колёс на движущемся поезде. Вы не можете остановить поезд, поэтому меняете колёса по одному вагону, пока поезд продолжает ехать.

```mermaid
flowchart LR
    subgraph t0["t=0: Все на v1"]
        A1["Реплика 1: v1"]
        A2["Реплика 2: v1"]
        A3["Реплика 3: v1"]
    end
    subgraph t1["t=1: Обновляем первую"]
        B1["Реплика 1: v2 ✓"]
        B2["Реплика 2: v1"]
        B3["Реплика 3: v1"]
    end
    subgraph t2["t=2: Обновляем вторую"]
        C1["Реплика 1: v2 ✓"]
        C2["Реплика 2: v2 ✓"]
        C3["Реплика 3: v1"]
    end
    subgraph t3["t=3: Все на v2"]
        D1["Реплика 1: v2 ✓"]
        D2["Реплика 2: v2 ✓"]
        D3["Реплика 3: v2 ✓"]
    end

    style t0 fill:transparent,stroke:#888
    style t1 fill:transparent,stroke:#888
    style t2 fill:transparent,stroke:#888
    style t3 fill:transparent,stroke:#888
```

Конфигурация для Docker Swarm:

```yaml
# Docker Swarm rolling update
deploy:
  replicas: 3
  update_config:
    parallelism: 1        # Обновляем по одному контейнеру
    delay: 30s            # Пауза между обновлениями
    failure_action: rollback
    monitor: 60s          # Мониторим 60 секунд после каждого обновления
    order: start-first    # Сначала запустить новый, потом остановить старый
  rollback_config:
    parallelism: 0        # Откатить все сразу
    order: start-first
```

Ключевой параметр -- `order: start-first`. Он означает: сначала запустить новый контейнер и дождаться его готовности, и только потом остановить старый. Это гарантирует, что в любой момент времени работает достаточное количество реплик.

`failure_action: rollback` автоматически откатывает обновление, если новый контейнер не проходит health check в течение `monitor` секунд.

### Blue-Green Deployment

Blue-Green -- два полностью идентичных окружения. "Синее" (Blue) -- текущий production. "Зелёное" (Green) -- новая версия, которая разворачивается параллельно.

Аналогия: представьте два одинаковых ресторана рядом. Синий ресторан работает, посетители сидят внутри. Зелёный ресторан подготовлен и ждёт. В момент переключения вы просто меняете вывеску: теперь зелёный -- основной, а синий стоит в резерве для быстрого отката.

```mermaid
flowchart LR
    LB["Load Balancer"]
    LB -->|"100% трафика"| Blue["Blue v1<br>Port 8080<br>текущий production"]
    LB -.->|"тестируется"| Green["Green v2<br>Port 8081<br>новая версия"]

    style Blue fill:#bbdefb,stroke:#1976d2
    style Green fill:#c8e6c9,stroke:#388e3c
```

После проверки Green-окружения переключаем трафик:

```mermaid
flowchart LR
    LB["Load Balancer"]
    Blue["Blue v1<br>быстрый rollback"] -.->|"standby"| LB
    LB -->|"100% трафика"| Green["Green v2<br>новый production"]

    style Blue fill:#bbdefb,stroke:#1976d2
    style Green fill:#c8e6c9,stroke:#388e3c
```

```yaml
# docker-compose.blue-green.yml
services:
  blue:
    image: myapp:${BLUE_VERSION:-v1.0.0}
    ports:
      - "8080:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  green:
    image: myapp:${GREEN_VERSION:-v1.1.0}
    ports:
      - "8081:3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - blue
      - green
```

Преимущество Blue-Green: мгновенный откат. Если Green-версия сломалась -- достаточно переключить nginx обратно на Blue. Недостаток: нужно вдвое больше ресурсов, потому что оба окружения работают одновременно.

### Canary Deployment

Canary (канареечный деплой) -- направляем малую долю трафика на новую версию и следим за метриками. Если всё хорошо -- постепенно увеличиваем долю. Если что-то не так -- откатываем.

Название пришло из угольных шахт: шахтёры брали с собой канарейку -- она более чувствительна к токсичным газам и погибала раньше, предупреждая людей об опасности. Canary-версия -- ваша "канарейка": она получает малую долю реального трафика и первой "ломается", если в новой версии есть проблемы.

```mermaid
flowchart LR
    LB["Load Balancer"]
    LB -->|"90% трафика"| Stable["Stable v1"]
    LB -->|"10% трафика"| Canary["Canary v2"]

    Canary --> Monitor{"Метрики OK?"}
    Monitor -->|"Да"| Scale["10% -> 30% -> 50% -> 100%"]
    Monitor -->|"Нет"| Rollback["10% -> 0%"]

    style Stable fill:#d4edda,stroke:#28a745
    style Canary fill:#fff3cd,stroke:#ffc107
    style Scale fill:#d4edda,stroke:#28a745
    style Rollback fill:#f8d7da,stroke:#dc3545
```

Конфигурация nginx для canary:

```nginx
# nginx.conf -- weighted upstream
upstream backend {
    server app-stable:3000 weight=9;  # 90% трафика
    server app-canary:3000 weight=1;  # 10% трафика
}

server {
    listen 80;
    location / {
        proxy_pass http://backend;
    }
}
```

### Сравнение стратегий

| Стратегия | Downtime | Скорость отката | Ресурсы | Сложность | Когда использовать |
|-----------|---------|-----------------|---------|-----------|-------------------|
| Rolling Update | Нет | Секунды-минуты | 1x + запас | Низкая | По умолчанию, большинство сервисов |
| Blue-Green | Нет | Мгновенный | 2x | Средняя | Критичные сервисы, базы данных |
| Canary | Нет | Мгновенный | 1x + малая доля | Высокая | Высоконагруженные сервисы, A/B тестирование |

---

## 10. Docker в Production

### Production docker-compose.yml

Production-конфигурация отличается от development рядом важных параметров: лимиты ресурсов, health checks, секреты, сетевая изоляция, политика перезапуска.

```yaml
# docker-compose.prod.yml
services:
  app:
    image: ghcr.io/myorg/myapp:${APP_VERSION}
    deploy:
      replicas: 3
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
        window: 120s
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    environment:
      - NODE_ENV=production
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - frontend
      - backend

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      app:
        condition: service_healthy
    networks:
      - frontend

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - backend

volumes:
  pgdata:
    driver: local

secrets:
  db_password:
    file: ./secrets/db_password.txt

networks:
  frontend:
  backend:
    internal: true  # Нет доступа к интернету
```

Разберём ключевые элементы:

**Лимиты ресурсов.** `limits` -- жёсткий потолок. Контейнер не сможет использовать больше 1 CPU и 512 MB RAM. `reservations` -- гарантированный минимум. Docker зарезервирует эти ресурсы для контейнера. Без лимитов один "прожорливый" контейнер может съесть всю память хоста и повалить остальные сервисы.

**Restart policy.** `on-failure` с `max_attempts: 3` -- контейнер перезапустится при падении, но не более 3 раз за 120-секундное окно (`window`). Это предотвращает бесконечный цикл перезапуска: если контейнер падает 3 раза подряд, значит проблема серьёзная и нужно вмешательство человека.

**Health check.** `start_period: 40s` -- первые 40 секунд после старта health check-ошибки не считаются. Это время на инициализацию приложения (запуск сервера, подключение к БД, прогрев кэша).

**Logging.** `max-size: "10m"` и `max-file: "3"` -- ротация логов. Без этих настроек логи будут расти бесконечно и заполнят диск. 3 файла по 10 MB = максимум 30 MB логов на контейнер.

**Сети.** `backend: internal: true` -- сеть без доступа к интернету. База данных не должна "ходить" наружу. Nginx находится и в `frontend`, и в `backend` нет -- он проксирует трафик к `app`, а `app` находится в обеих сетях.

**Секреты.** `POSTGRES_PASSWORD_FILE` вместо `POSTGRES_PASSWORD` -- пароль читается из файла, а не передаётся через переменную окружения. Переменные окружения видны через `docker inspect`, а секреты хранятся в зашифрованном виде.

### Health Checks -- подробно

Health check -- это механизм, по которому Docker (и оркестратор) определяет, жив ли контейнер и готов ли он принимать трафик. Без health checks оркестратор не может отличить "работающий" контейнер от "зависшего".

```dockerfile
# В Dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

Эндпоинт `/health` в приложении должен проверять не только сам процесс, но и зависимости:

```typescript
// Эндпоинт /health
app.get('/health', async (req, res) => {
  const checks = {
    uptime: process.uptime(),
    timestamp: Date.now(),
    database: 'unknown',
    redis: 'unknown',
  }

  try {
    await db.query('SELECT 1')
    checks.database = 'healthy'
  } catch (e) {
    checks.database = 'unhealthy'
  }

  try {
    await redis.ping()
    checks.redis = 'healthy'
  } catch (e) {
    checks.redis = 'unhealthy'
  }

  const isHealthy = checks.database === 'healthy' && checks.redis === 'healthy'
  res.status(isHealthy ? 200 : 503).json(checks)
})
```

Три типа проверок:

| Тип | Вопрос | Реакция на провал | Пример |
|-----|--------|-------------------|--------|
| **Liveness** | Жив ли процесс? | Перезапуск контейнера | Процесс завис в бесконечном цикле |
| **Readiness** | Готов ли принимать трафик? | Убрать из балансировки | Приложение загружает кэш в память |
| **Startup** | Завершилась ли инициализация? | Не проверять liveness/readiness | Миграции БД, прогрев кэша |

В Docker Compose доступен только один health check (аналог liveness). Для полноценного разделения на liveness/readiness/startup нужен Kubernetes.

### Docker Swarm -- встроенный оркестратор

Docker Swarm -- оркестратор, встроенный прямо в Docker. Он проще Kubernetes, но достаточен для многих production-сценариев:

```bash
# Инициализация Swarm
docker swarm init

# Деплой стека из Compose-файла
docker stack deploy -c docker-compose.prod.yml myapp

# Масштабирование сервиса
docker service scale myapp_app=5

# Обновление образа (rolling update автоматически)
docker service update --image ghcr.io/myorg/myapp:v2.0.0 myapp_app

# Откат к предыдущей версии
docker service update --rollback myapp_app

# Мониторинг
docker service ls              # Список сервисов
docker service ps myapp_app    # Состояние реплик
docker service logs myapp_app  # Логи сервиса
```

Swarm подходит, когда:
- Вам нужен простой оркестратор без кривой обучения Kubernetes
- 1-10 серверов
- Нет потребности в авто-скейлинге, сервис-мешах, кастомных операторах

Kubernetes стоит выбирать, когда:
- Десятки-сотни серверов
- Нужны сложные стратегии деплоя (canary с автоматическим анализом метрик)
- Микросервисная архитектура с сотнями сервисов

---

## 11. Мониторинг контейнеров в Production

### Docker Stats -- быстрый мониторинг

Для быстрой оценки состояния контейнеров есть встроенная команда:

```bash
docker stats

# CONTAINER   CPU %   MEM USAGE / LIMIT   NET I/O       BLOCK I/O
# app-1       2.5%    150MiB / 512MiB     1.2MB / 500kB  0B / 4kB
# app-2       1.8%    145MiB / 512MiB     1.1MB / 480kB  0B / 3kB
# db          5.2%    256MiB / 1GiB       800kB / 2.1MB  4MB / 12MB
```

Но `docker stats` -- это мгновенный снимок. Для полноценного мониторинга с историей, алертами и дашбордами нужен стек мониторинга.

### Prometheus + Grafana + cAdvisor

Стандартный стек мониторинга для Docker:

- **cAdvisor** -- собирает метрики контейнеров (CPU, память, сеть, I/O)
- **Prometheus** -- хранит метрики и выполняет запросы
- **Grafana** -- визуализация (дашборды, графики, алерты)
- **node-exporter** -- метрики хост-машины

```mermaid
flowchart LR
    APP["App Containers"] --> CAD["cAdvisor"]
    HOST["Host OS"] --> NE["Node Exporter"]
    CAD --> PROM["Prometheus"]
    NE --> PROM
    PROM --> GRAF["Grafana"]
    GRAF --> ALERT["Alertmanager"]

    style PROM fill:#e8f5e9,stroke:#388e3c
    style GRAF fill:#fff3cd,stroke:#ffc107
```

```yaml
# docker-compose.monitoring.yml
services:
  prometheus:
    image: prom/prometheus:latest
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana:latest
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    ports:
      - "8080:8080"

  node-exporter:
    image: prom/node-exporter:latest
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'

volumes:
  prometheus_data:
  grafana_data:
```

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'app'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/metrics'
```

---

## 12. Автоматический Rollback

### Скрипт деплоя с rollback

Автоматический rollback -- это последняя линия обороны. Если после деплоя health check не проходит, система автоматически возвращается к предыдущей версии:

```bash
#!/bin/bash
# deploy.sh
set -e

NEW_VERSION=$1
OLD_VERSION=$(docker inspect --format='{{.Config.Image}}' myapp_app 2>/dev/null || echo "none")

echo "Deploying $NEW_VERSION (current: $OLD_VERSION)"

# Pull новый образ
docker pull $NEW_VERSION

# Обновляем сервис
docker service update --image $NEW_VERSION myapp_app

# Ждём стабилизации
echo "Waiting for service to stabilize..."
sleep 30

# Проверяем health
HEALTHY=$(curl -sf http://localhost/health | jq -r '.database' 2>/dev/null)

if [ "$HEALTHY" != "healthy" ]; then
  echo "Health check failed! Rolling back to $OLD_VERSION"
  docker service update --rollback myapp_app
  exit 1
fi

echo "Deploy successful!"
```

### Деплой с rollback в GitHub Actions

```yaml
  deploy:
    runs-on: ubuntu-latest
    needs: push
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            export APP_VERSION=${{ github.sha }}
            cd /app
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
            sleep 30
            if ! curl -sf http://localhost/health; then
              echo "Health check failed, rolling back"
              export APP_VERSION=${{ github.event.before }}
              docker compose -f docker-compose.prod.yml up -d
              exit 1
            fi
```

`github.event.before` -- SHA предыдущего коммита. Если health check не прошёл, деплоится предыдущая версия. Это работает, потому что предыдущий образ уже есть в Registry.

---

## Частые ошибки начинающих

### Ошибка 1: Использование `latest` в CI/CD

Это, пожалуй, самая распространённая ошибка. Разработчик пишет `myapp:latest` в deployment-конфигурации и через месяц не может ответить на вопрос "какая версия работает в production?".

❌ **Неправильно:**

```yaml
# Какая версия задеплоена? Никто не знает
docker pull myapp:latest
docker service update --image myapp:latest myapp_app
```

✅ **Правильно:**

```yaml
# Точная версия -- воспроизводимый деплой
docker pull myapp:v1.2.3
docker service update --image myapp:v1.2.3 myapp_app
```

### Ошибка 2: Секреты в CI-конфигурации

Хранение секретов в коде -- прямой путь к утечке. CI-конфигурация (`.github/workflows/*.yml`, `.gitlab-ci.yml`) -- это код, он хранится в репозитории и виден всем, у кого есть доступ.

❌ **Неправильно:**

```yaml
# НИКОГДА не храните секреты в коде!
env:
  DOCKER_PASSWORD: my-secret-password
  AWS_SECRET_KEY: AKIAIOSFODNN7EXAMPLE
```

✅ **Правильно:**

```yaml
# Используйте CI secrets -- зашифрованные переменные
env:
  DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
  AWS_SECRET_KEY: ${{ secrets.AWS_SECRET_KEY }}
```

Секреты задаются в настройках репозитория (Settings -> Secrets) и никогда не попадают в git-историю.

### Ошибка 3: Нет health checks

Без health checks CI/CD не знает, успешен ли деплой. Контейнер может запуститься, но приложение внутри -- упасть при инициализации. Без health check оркестратор считает контейнер "здоровым" и продолжает деплой.

❌ **Неправильно:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    # Нет healthcheck -- деплоим и надеемся на лучшее
```

✅ **Правильно:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

### Ошибка 4: Нет стратегии отката

Деплой без плана отката -- это прыжок без парашюта. Рано или поздно что-то пойдёт не так, и вопрос не "если", а "когда".

❌ **Неправильно:**

```bash
# "Деплой" без плана B
docker-compose up -d
# Упало? git revert, пересобираем (20 минут downtime)
```

✅ **Правильно:**

```bash
# Запоминаем текущую версию перед обновлением
OLD_IMAGE=$(docker inspect --format='{{.Config.Image}}' app)
docker service update --image myapp:v2.0.0 myapp_app

# Автоматический rollback при ошибке
if ! curl -sf http://localhost/health; then
  docker service update --image $OLD_IMAGE myapp_app
fi
```

### Ошибка 5: Сборка без кэширования

Каждая сборка без кэша -- это 5-15 минут потерянного времени. При 20 push-ах в день это 100-300 минут = до 5 часов ожидания CI в день для команды.

❌ **Неправильно:**

```yaml
# Каждая сборка 10+ минут
steps:
  - run: docker build -t myapp .
```

✅ **Правильно:**

```yaml
# 30-60 секунд с кэшированием
steps:
  - uses: docker/build-push-action@v5
    with:
      cache-from: type=gha
      cache-to: type=gha,mode=max
```

### Ошибка 6: Нет лимитов ресурсов

Без лимитов один контейнер с утечкой памяти может съесть всю RAM хоста. OOM Killer убьёт случайный процесс -- может быть, вашу базу данных.

❌ **Неправильно:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    # Без лимитов -- OOM killer убьёт случайный процесс
```

✅ **Правильно:**

```yaml
services:
  app:
    image: myapp:v1.0.0
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 128M
```

---

## Лучшие практики

### CI/CD

1. **Immutable images** -- никогда не модифицируйте образ после сборки. Образ, прошедший тесты, идёт в production без изменений.
2. **One image, many environments** -- один и тот же образ для dev, staging и production. Отличия только в конфигурации (переменные окружения, секреты).
3. **Fast feedback** -- быстрые проверки (lint, unit-тесты) первыми, медленные (e2e, сканирование) -- позже.
4. **Branch protection** -- main/master защищены, merge только через PR с обязательным прохождением CI.
5. **Automated rollback** -- всегда имейте автоматический план отката.

### Тегирование

1. **Semver для релизов** -- `v1.2.3` для production, понятно людям.
2. **SHA для трейсинга** -- `sha-abc1234` для однозначной привязки к коммиту.
3. **Никогда `latest` в production** -- только конкретные, иммутабельные версии.
4. **Immutable tags** -- semver-теги нельзя перезаписывать.

### Production

1. **Health checks обязательны** -- без них невозможен автоматический rollback и корректный rolling update.
2. **Лимиты ресурсов** -- CPU и memory limits для каждого контейнера без исключений.
3. **Логирование** -- централизованные логи с ротацией, не полагайтесь только на stdout.
4. **Секреты** -- Docker secrets, Vault или cloud-провайдерные хранилища. Никогда переменные окружения с паролями в docker-compose.yml.
5. **Мониторинг** -- Prometheus + Grafana или аналоги. Без мониторинга вы узнаёте о проблемах от пользователей.
6. **Backup** -- автоматические бэкапы данных (volumes) с проверкой восстановления.

---

## Шпаргалка

```bash
# === CI/CD ===
# Сборка с кэшированием и push
docker buildx build \
  --cache-from=type=gha --cache-to=type=gha,mode=max \
  --push -t ghcr.io/user/app:v1.0.0 .

# Мультиплатформенная сборка
docker buildx build --platform linux/amd64,linux/arm64 \
  --push -t ghcr.io/user/app:v1.0.0 .

# === Registry ===
# GHCR авторизация
echo $TOKEN | docker login ghcr.io -u USER --password-stdin

# ECR авторизация
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_URL

# Сканирование образа
docker scout cves myapp:latest
trivy image myapp:latest

# === Деплой (Docker Swarm) ===
docker stack deploy -c docker-compose.prod.yml myapp
docker service update --image app:v2.0.0 myapp_app
docker service update --rollback myapp_app
docker service scale myapp_app=5

# Rolling update с параметрами
docker service update \
  --update-parallelism 1 \
  --update-delay 30s \
  --update-failure-action rollback \
  myapp_app

# === Мониторинг ===
docker stats
docker service ls
docker service ps myapp_app
docker service logs -f myapp_app
```
