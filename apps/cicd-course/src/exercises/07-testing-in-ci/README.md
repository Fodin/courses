# Уровень 7: Testing in CI

## Зачем тестировать в CI вообще?

Представь, что каждый разработчик в команде делает 10 коммитов в день. В команде 5 человек — это 50 коммитов. Без автоматических тестов каждый из этих 50 коммитов — потенциальная бомба замедленного действия. Тесты в CI — это автоматический контроль качества, который работает 24/7, не устаёт и не забывает запустить проверки.

Но просто "запускать тесты в CI" недостаточно. Неправильно организованные тесты делают пайплайн медленным, ненадёжным, и разработчики начинают их игнорировать. Цель этого уровня — научиться строить тестирование в CI правильно.

---

## Пирамида тестов

Пирамида тестов — это фундаментальная концепция, которая описывает, **сколько тестов каждого типа** должно быть в проекте и **как они соотносятся по скорости и стоимости**.

```
         /\
        /E2E\          мало, медленные, дорогие
       /------\
      /Integ-  \       средне, умеренные
     /ration    \
    /------------\
   /  Unit Tests  \    много, быстрые, дешёвые
  /--------------\
```

📌 Логика пирамиды:

- **Unit-тесты** (основание) — тестируют отдельные функции/классы в изоляции. Работают за миллисекунды, не требуют внешних зависимостей. Их должно быть 70-80% от всех тестов.
- **Интеграционные тесты** (середина) — проверяют взаимодействие компонентов: API + база данных, сервис + очередь сообщений. Требуют запущенных зависимостей, работают секунды.
- **E2E-тесты** (вершина) — имитируют реального пользователя в реальном браузере. Минуты выполнения, высокая стоимость, нестабильность (flaky tests). Их должно быть мало.

### Пирамида в пайплайне GitLab CI

Пирамида тестов должна отражаться в структуре пайплайна. Быстрые unit-тесты — раньше, медленные E2E — позже или на отдельном триггере:

```yaml
stages:
  - lint          # секунды — синтаксис и стиль
  - unit-test     # секунды → минуты
  - integration   # минуты (нужны services)
  - e2e           # минуты (нужен браузер)
  - deploy

# Быстрая проверка — запускается первой
lint:
  stage: lint
  image: node:20-alpine
  script:
    - npm run lint
    - npm run typecheck

# Unit-тесты — быстро, без зависимостей
unit-tests:
  stage: unit-test
  image: node:20-alpine
  script:
    - npm ci
    - npm run test:unit -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      junit: reports/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

# Интеграционные тесты — нужна БД
integration-tests:
  stage: integration
  image: node:20-alpine
  services:
    - postgres:15-alpine
    - redis:7-alpine
  variables:
    DATABASE_URL: 'postgresql://test:test@postgres/testdb'
    REDIS_URL: 'redis://redis:6379'
  script:
    - npm ci
    - npm run test:integration

# E2E — только на main или по расписанию
e2e-tests:
  stage: e2e
  image: mcr.microsoft.com/playwright:v1.44.0-jammy
  script:
    - npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - playwright-report/
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
```

```mermaid
graph LR
    A[Lint\n~30 сек] --> B[Unit Tests\n~2 мин]
    B --> C[Integration\n~5 мин]
    C --> D[E2E\n~15 мин]
    D --> E[Deploy]
```

💡 Ключевой принцип: если что-то пошло не так, хочется узнать об этом **как можно раньше**. Поэтому быстрые дешёвые тесты — в начале пайплайна. Падение на lint экономит время, которое ушло бы на запуск E2E.

---

## Services — внешние зависимости в CI

Одна из самых частых проблем при написании интеграционных тестов в CI: **как запустить PostgreSQL, Redis, MongoDB рядом с твоим джобом?**

GitLab CI решает это элегантно через **services** — дополнительные Docker-контейнеры, которые запускаются параллельно с основным контейнером джоба и доступны по сетевому имени.

### Как работают services

```mermaid
graph LR
    A[Job Container\nnode:20-alpine] -- localhost:5432 --> B[PostgreSQL\nservice container]
    A -- localhost:6379 --> C[Redis\nservice container]
    A -- localhost:27017 --> D[MongoDB\nservice container]
```

📌 Services и джоб находятся в одной Docker-сети. Контейнер сервиса доступен по имени образа (без тега и слешей). Например, `postgres:15-alpine` → хост `postgres`.

### Базовая конфигурация

```yaml
integration-tests:
  stage: test
  image: node:20-alpine

  services:
    - postgres:15-alpine          # доступен как 'postgres'
    - redis:7-alpine              # доступен как 'redis'

  variables:
    # PostgreSQL принимает эти переменные для инициализации
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    POSTGRES_HOST_AUTH_METHOD: trust

    # Переменные для приложения
    DATABASE_URL: 'postgresql://test:test@postgres:5432/testdb'
    REDIS_URL: 'redis://redis:6379'

  script:
    - npm ci
    - npm run test:integration
```

### Кастомное имя хоста для service

По умолчанию хост = имя образа без тега. Но если нужно другое имя — используй `alias`:

```yaml
services:
  - name: postgres:15-alpine
    alias: database          # теперь доступен как 'database', не 'postgres'

  - name: redis:7-alpine
    alias: cache             # доступен как 'cache'

variables:
  DATABASE_URL: 'postgresql://test:test@database:5432/testdb'
  REDIS_URL: 'redis://cache:6379'
```

### Ожидание готовности service

Частая ошибка: тесты запускаются раньше, чем PostgreSQL успел стартовать. Решения:

```yaml
script:
  # Вариант 1: wait-for-it.sh — ждём порт
  - apt-get update && apt-get install -y wait-for-it
  - wait-for-it postgres:5432 --timeout=60 -- echo "PostgreSQL ready"
  - npm run test:integration

  # Вариант 2: pg_isready (если есть клиент postgres)
  - until pg_isready -h postgres -U test; do sleep 1; done
  - npm run test:integration

  # Вариант 3: retry в коде теста (лучший подход)
  # В beforeAll() делаем несколько попыток подключения
```

### Services в GitHub Actions

Для сравнения — аналог в GitHub Actions:

```yaml
# GitHub Actions
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_USER: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - run: npm test
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
```

📌 Ключевое отличие: в GitHub Actions services пробрасывают порт на `localhost`, в GitLab CI — доступны по сетевому имени без проброса портов.

---

## Coverage и JUnit отчёты

Просто запустить тесты и видеть "passed/failed" — только половина дела. GitLab CI умеет парсить результаты тестов и покрытие кода, показывая их прямо в интерфейсе Merge Request.

### JUnit XML отчёты

JUnit XML — стандартный формат результатов тестов, который понимают GitLab, GitHub, Jenkins и другие CI системы.

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    # Jest с JUnit репортером
    - npx jest --reporters=default --reporters=jest-junit
  artifacts:
    when: always       # сохраняем даже если тесты упали!
    reports:
      junit: reports/junit.xml
    expire_in: 1 week
  variables:
    JEST_JUNIT_OUTPUT_DIR: reports
    JEST_JUNIT_OUTPUT_NAME: junit.xml
```

После этого в каждом MR появляется вкладка **Tests**, где видно:
- Сколько тестов прошло / упало / пропущено
- Какие конкретно тесты упали (с именами и сообщениями об ошибках)
- Сравнение с предыдущим запуском

### Coverage: две стратегии

**Стратегия 1 — Coverage через regex** (простой подход):

GitLab умеет парсить coverage из stdout тестов с помощью регулярного выражения:

```yaml
unit-tests:
  stage: test
  script:
    - npm run test -- --coverage
  # Regex для Jest coverage output
  coverage: '/All files[^|]*\|[^|]*\|\s*(\d+\.?\d*)/'
  # Или проще, для большинства форматов:
  # coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
```

GitLab отобразит badge с процентом покрытия в README и в MR.

**Стратегия 2 — Cobertura XML** (полный отчёт с diff):

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  script:
    - npm ci
    - npx jest --coverage --coverageReporters=cobertura --coverageReporters=text
  coverage: '/All files[^|]*\|[^|]*\|\s*(\d+\.?\d*)/'
  artifacts:
    when: always
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week
```

С Cobertura в MR появляется детальный diff: какие строки покрыты, какие нет, сколько добавленных строк покрыто новыми тестами.

### Python: pytest + coverage

```yaml
test-python:
  stage: test
  image: python:3.12-slim
  script:
    - pip install pytest pytest-cov pytest-junit
    - pytest
        --junitxml=reports/junit.xml
        --cov=src
        --cov-report=term
        --cov-report=xml:coverage/coverage.xml
  coverage: '/TOTAL\s+\d+\s+\d+\s+(\d+)%/'
  artifacts:
    when: always
    reports:
      junit: reports/junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/coverage.xml
```

### Пороговые значения покрытия

Хочешь, чтобы пайплайн падал при недостаточном покрытии? Это делается на уровне тест-фреймворка:

```yaml
script:
  # Jest — минимальный порог через конфиг
  - npx jest --coverage --coverageThreshold='{"global":{"lines":80}}'

  # Python — через pytest-cov
  - pytest --cov=src --cov-fail-under=80
```

```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

---

## Параллельный запуск тестов

Когда тестов много, последовательный запуск занимает слишком много времени. GitLab CI предоставляет несколько способов распараллелить тесты.

### keyword `parallel`

Самый простой способ — ключевое слово `parallel`. GitLab запустит N одинаковых джобов, передав каждому переменные `CI_NODE_INDEX` и `CI_NODE_TOTAL`:

```yaml
unit-tests:
  stage: test
  image: node:20-alpine
  parallel: 4           # запустить 4 копии этого джоба
  script:
    - npm ci
    # Тест-фреймворк сам делит тесты по CI_NODE_INDEX / CI_NODE_TOTAL
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
  artifacts:
    when: always
    reports:
      junit: junit-$CI_NODE_INDEX.xml
```

```mermaid
graph LR
    A[Push] --> B[unit-tests 1/4\nтесты 1-25]
    A --> C[unit-tests 2/4\nтесты 26-50]
    A --> D[unit-tests 3/4\nтесты 51-75]
    A --> E[unit-tests 4/4\nтесты 76-100]
    B --> F[Результат]
    C --> F
    D --> F
    E --> F
```

📌 Важно: при `parallel: 4` и 8-минутном тест-сьюте каждый шард выполняется ~2 минуты. Общее время пайплайна — 2 минуты вместо 8. Но нужно 4 раннера для одновременного выполнения.

### Разбивка по матрице

Если нужно тестировать разные конфигурации (версии Node, браузеры, БД), используй `parallel:matrix`:

```yaml
test-matrix:
  stage: test
  image: node:${NODE_VERSION}-alpine
  parallel:
    matrix:
      - NODE_VERSION: ['18', '20', '22']
        DATABASE: ['sqlite', 'postgres']
  services:
    - name: postgres:15-alpine
      alias: postgres
  script:
    - echo "Testing Node $NODE_VERSION with $DATABASE"
    - npm ci
    - DATABASE=$DATABASE npm test
```

Это создаст 6 джобов: `test-matrix: [18, sqlite]`, `test-matrix: [18, postgres]`, и т.д.

### Разбивка вручную через переменные

Для полного контроля — ручное разделение тестов по файлам или меткам:

```yaml
# Запуск конкретных групп тестов
test-auth:
  stage: test
  script:
    - npm test -- --testPathPattern="auth|user|session"

test-payments:
  stage: test
  script:
    - npm test -- --testPathPattern="payment|billing|invoice"

test-api:
  stage: test
  script:
    - npm test -- --testPathPattern="api|rest|graphql"
```

### Объединение JUnit-отчётов при параллельных тестах

При `parallel: N` каждый шард создаёт свой XML-файл. GitLab умеет принимать несколько файлов:

```yaml
unit-tests:
  parallel: 4
  script:
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
        --reporters=jest-junit
  variables:
    JEST_JUNIT_OUTPUT_NAME: junit-$CI_NODE_INDEX.xml
  artifacts:
    when: always
    reports:
      junit:
        - junit-1.xml
        - junit-2.xml
        - junit-3.xml
        - junit-4.xml
```

Или через glob-паттерн:

```yaml
artifacts:
  reports:
    junit: "junit-*.xml"
```

---

## Стратегии запуска тестов

Не всегда нужно запускать весь тест-сьют на каждый коммит. Грамотные стратегии экономят ресурсы и время.

### Условный запуск E2E

```yaml
e2e-tests:
  stage: e2e
  script:
    - npx playwright test
  rules:
    # Запускать на main и release ветках
    - if: '$CI_COMMIT_BRANCH =~ /^(main|master|release\/.*)$/'
    # Запускать по расписанию (ночные прогоны)
    - if: '$CI_PIPELINE_SOURCE == "schedule"'
    # Запускать при явном указании в коммите
    - if: '$CI_COMMIT_MESSAGE =~ /\[run-e2e\]/'
    # Пропускать для документации
    - if: '$CI_COMMIT_BRANCH'
      changes:
        - '**/*.md'
        - 'docs/**/*'
      when: never
    # Во всех остальных случаях — пропустить
    - when: never
```

### Тесты только при изменении связанных файлов

```yaml
test-frontend:
  stage: test
  script:
    - cd frontend && npm test
  rules:
    - changes:
        - 'frontend/**/*'
        - 'shared/**/*'
      when: always
    - when: never

test-backend:
  stage: test
  script:
    - cd backend && npm test
  rules:
    - changes:
        - 'backend/**/*'
        - 'shared/**/*'
      when: always
    - when: never
```

---

## Частые ошибки новичков

⚠️ **Ошибка 1: Тесты падают из-за того, что сервис не успел стартовать**

❌ Проблема:
```yaml
services:
  - postgres:15
script:
  - npm run test:integration  # падает: connection refused
```

✅ Решение:
```yaml
services:
  - postgres:15
variables:
  POSTGRES_HOST_AUTH_METHOD: trust
script:
  - apt-get install -y postgresql-client
  - until pg_isready -h postgres; do sleep 1; done
  - npm run test:integration
```

---

⚠️ **Ошибка 2: JUnit артефакты сохраняются только при успехе**

❌ Проблема:
```yaml
artifacts:
  reports:
    junit: reports/junit.xml
  # when не указан → on_success по умолчанию
  # Если тесты упали — JUnit-файл не сохранится, MR не покажет детали
```

✅ Решение:
```yaml
artifacts:
  when: always    # сохранять ВСЕГДА — особенно при падении!
  reports:
    junit: reports/junit.xml
```

---

⚠️ **Ошибка 3: Адрес сервиса указан неправильно**

❌ Проблема:
```yaml
services:
  - postgres:15-alpine
variables:
  DATABASE_URL: 'postgresql://test:test@localhost:5432/testdb'
  # localhost не работает! Нужно имя образа без тега
```

✅ Решение:
```yaml
variables:
  DATABASE_URL: 'postgresql://test:test@postgres:5432/testdb'
  # Или используй alias:
  # DATABASE_URL: 'postgresql://test:test@db:5432/testdb'
```

---

⚠️ **Ошибка 4: parallel без шардинга**

❌ Проблема:
```yaml
unit-tests:
  parallel: 4
  script:
    - npm test   # запускает ВСЕ тесты в каждом из 4 джобов!
```

✅ Решение:
```yaml
unit-tests:
  parallel: 4
  script:
    - npx jest --shard=$CI_NODE_INDEX/$CI_NODE_TOTAL
    # или для pytest:
    # - pytest --splits=$CI_NODE_TOTAL --group=$CI_NODE_INDEX
```

---

⚠️ **Ошибка 5: E2E на каждом коммите**

❌ Проблема: E2E-тесты запускаются при каждом пуше в любую ветку. 15 минут ожидания для правки опечатки.

✅ Решение: ограничь запуск E2E правилами — только main, только по расписанию, только при явном запросе через метку в коммите или MR.

---

⚠️ **Ошибка 6: Не указывать coverage regex**

❌ Проблема:
```yaml
unit-tests:
  script:
    - npm test -- --coverage
  # coverage не указан → GitLab не знает о покрытии
```

✅ Решение:
```yaml
unit-tests:
  script:
    - npm test -- --coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
```

---

## Итог

Правильно организованное тестирование в CI — это не просто "запустить тесты". Это:

1. **Структура**: пирамида тестов в структуре stages — быстрые первыми
2. **Services**: PostgreSQL, Redis и другие зависимости прямо в джобе
3. **Видимость**: JUnit + Coverage показывают результаты прямо в MR
4. **Скорость**: `parallel` разбивает тест-сьют на шарды
5. **Экономия**: E2E только там, где нужно

Хорошо настроенное тестирование в CI экономит часы разработки в неделю и даёт уверенность при деплое.
