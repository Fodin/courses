import { useState } from 'react'

// ========================================
// Задание 8.1: ENV и .env файлы — Решение
// ========================================

const envSources = [
  {
    key: 'dockerfile',
    label: 'ENV в Dockerfile',
    code: `FROM node:20-alpine

# ENV -- доступна при сборке И при запуске
ENV NODE_ENV=production
ENV APP_PORT=3000
ENV LOG_LEVEL=info

# Использование в последующих инструкциях
WORKDIR /app
EXPOSE $APP_PORT
CMD ["node", "server.js"]`,
    notes: [
      'ENV переменные становятся частью образа',
      'Доступны во всех контейнерах из этого образа',
      'Можно переопределить через -e при запуске',
    ],
  },
  {
    key: 'arg-vs-env',
    label: 'ARG vs ENV',
    code: `# ARG -- только при сборке (docker build)
ARG NODE_VERSION=20
FROM node:\${NODE_VERSION}-alpine

# ARG после FROM нужно переобъявить
ARG BUILD_DATE

# ENV -- при сборке И при запуске
ENV NODE_ENV=production

# Паттерн: передать ARG в ENV
ARG APP_VERSION=1.0.0
ENV APP_VERSION=\${APP_VERSION}

# Сборка с аргументами:
# docker build --build-arg NODE_VERSION=18 \\
#   --build-arg BUILD_DATE=$(date -u +%Y-%m-%d) .`,
    notes: [
      'ARG доступен только при docker build',
      'ENV доступен и при build, и при run',
      'ARG переопределяется через --build-arg',
      'ENV переопределяется через -e / --env',
      'Не храните секреты в ARG -- видны в docker history!',
    ],
  },
  {
    key: 'runtime',
    label: 'Флаг -e при запуске',
    code: `# Одна переменная
docker run -e NODE_ENV=production myapp

# Несколько переменных
docker run \\
  -e NODE_ENV=production \\
  -e DATABASE_URL=postgresql://user:pass@db:5432/myapp \\
  -e REDIS_URL=redis://redis:6379 \\
  myapp

# Передать переменную из хоста (без значения)
export API_KEY=abc123
docker run -e API_KEY myapp
# Контейнер получит API_KEY=abc123 из хоста

# Загрузить из файла
docker run --env-file .env myapp`,
    notes: [
      'Флаг -e переопределяет ENV из Dockerfile',
      'Без значения (-e API_KEY) берёт из хоста',
      '--env-file загружает переменные из файла',
    ],
  },
  {
    key: 'dotenv',
    label: '.env файл',
    code: `# .env -- автоматически загружается Compose
# Комментарии начинаются с #

NODE_ENV=production
APP_PORT=3000

# Значения в кавычках (для пробелов)
APP_NAME="My Docker App"

# Пустое значение
EMPTY_VAR=

# ❌ НЕ поддерживается:
# export VAR=value      -- не работает
# VAR=\${OTHER_VAR}      -- не работает в .env`,
    notes: [
      'Compose автоматически читает .env из директории проекта',
      '.env подставляет ${VAR} в docker-compose.yml',
      'Это НЕ то же самое, что env_file (внутрь контейнера)',
      '.env должен быть в .gitignore!',
    ],
  },
  {
    key: 'substitution',
    label: 'Подстановка в Compose',
    code: `# docker-compose.yml
services:
  api:
    image: myapp:\${TAG}

    environment:
      # Значение по умолчанию
      NODE_ENV: \${NODE_ENV:-production}

      # Ошибка если не задана
      DB_PASSWORD: \${DB_PASSWORD:?DB_PASSWORD is required}

      # Альтернативное значение
      DEBUG: \${DEBUG:+true}

    ports:
      - '\${APP_PORT:-3000}:3000'

    env_file:
      - .env           # Переменные ВНУТРЬ контейнера
      - .env.local     # Локальные переопределения`,
    notes: [
      '${VAR:-default} -- дефолт если не задан или пуст',
      '${VAR:?error} -- ошибка если не задан',
      '${VAR:+alt} -- альтернатива если задан',
      'env_file передаёт переменные внутрь контейнера',
    ],
  },
]

const priorityOrder = [
  { source: 'environment: в compose', priority: 1, example: 'NODE_ENV: production' },
  { source: 'Shell-переменные хоста', priority: 2, example: 'export NODE_ENV=staging' },
  { source: 'env_file: в compose', priority: 3, example: 'env_file: [.env.app]' },
  { source: '.env файл (автозагрузка)', priority: 4, example: '.env в директории проекта' },
  { source: 'ENV в Dockerfile', priority: 5, example: 'ENV NODE_ENV=development' },
]

export function Task8_1_Solution() {
  const [activeSource, setActiveSource] = useState('dockerfile')
  const [showPriority, setShowPriority] = useState(false)

  const current = envSources.find((s) => s.key === activeSource)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 8.1: ENV и .env файлы</h3>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {envSources.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveSource(s.key)}
            style={{
              padding: '0.4rem 0.8rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeSource === s.key ? '#0070f3' : '#fff',
              color: activeSource === s.key ? '#fff' : '#333',
              fontSize: '0.85rem',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {current && (
        <div style={{ marginBottom: '1.5rem' }}>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              overflow: 'auto',
              fontSize: '0.85rem',
              lineHeight: '1.5',
            }}
          >
            {current.code}
          </pre>

          <div style={{ marginTop: '0.75rem' }}>
            <strong>Ключевые моменты:</strong>
            <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem' }}>
              {current.notes.map((note, i) => (
                <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.9rem' }}>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setShowPriority(!showPriority)}
          style={{
            padding: '0.5rem 1rem',
            border: '1px solid #e2e2e2',
            borderRadius: '4px',
            cursor: 'pointer',
            backgroundColor: showPriority ? '#f0f7ff' : '#f9f9f9',
            fontSize: '0.9rem',
          }}
        >
          {showPriority ? 'Скрыть' : 'Показать'} приоритет переменных
        </button>
      </div>

      {showPriority && (
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.85rem',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#f0f0f0' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>#</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Источник</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Пример</th>
            </tr>
          </thead>
          <tbody>
            {priorityOrder.map((p) => (
              <tr key={p.priority}>
                <td
                  style={{
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: p.priority <= 2 ? '#d32f2f' : '#666',
                  }}
                >
                  {p.priority}
                </td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{p.source}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {p.example}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          border: '1px solid #ffc107',
          fontSize: '0.85rem',
        }}
      >
        <strong>Подстановка переменных:</strong>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.5rem' }}>
          <code style={{ backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
            {'${VAR:-default}'} -- дефолт
          </code>
          <code style={{ backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
            {'${VAR:?error}'} -- обязательная
          </code>
          <code style={{ backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
            {'${VAR:+alt}'} -- альтернатива
          </code>
          <code style={{ backgroundColor: '#f5f5f5', padding: '0.25rem 0.5rem', borderRadius: '3px' }}>
            {'${VAR}'} -- просто значение
          </code>
        </div>
      </div>
    </div>
  )
}

// ========================================
// Задание 8.2: Secrets и configs — Решение
// ========================================

type SecretTab = 'problem' | 'secrets' | 'configs' | 'comparison'

const secretExamples = [
  {
    key: 'compose',
    label: 'Secrets в Compose',
    yaml: `services:
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      # _FILE суффикс -- образ читает пароль из файла
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password

  api:
    build: ./api
    secrets:
      - db_password
      - jwt_secret

# Определение секретов
secrets:
  db_password:
    file: ./secrets/db_password.txt    # Из файла
  jwt_secret:
    environment: JWT_SECRET            # Из переменной хоста`,
  },
  {
    key: 'reading',
    label: 'Чтение в приложении',
    yaml: `// Node.js -- чтение секрета
const fs = require('fs')

function getSecret(name) {
  const secretPath = \`/run/secrets/\${name}\`
  try {
    return fs.readFileSync(secretPath, 'utf8').trim()
  } catch {
    // Fallback на переменную окружения (для dev)
    return process.env[name.toUpperCase()]
  }
}

const dbPassword = getSecret('db_password')
const jwtSecret = getSecret('jwt_secret')`,
  },
  {
    key: 'creating',
    label: 'Создание файлов',
    yaml: `# Создание файлов секретов (без переноса строки!)
echo -n "super_secret_123" > secrets/db_password.txt
echo -n "my-jwt-secret-key" > secrets/jwt_secret.txt

# Структура директории
secrets/              # В .gitignore!
  db_password.txt
  jwt_secret.txt
  database_url.txt

# .gitignore
secrets/
.env
.env.*
!.env.example`,
  },
]

const configExamples = [
  {
    key: 'nginx',
    label: 'Nginx config',
    yaml: `services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
    configs:
      - source: nginx_conf
        target: /etc/nginx/nginx.conf

configs:
  nginx_conf:
    file: ./config/nginx.conf`,
  },
  {
    key: 'prometheus',
    label: 'Prometheus config',
    yaml: `services:
  prometheus:
    image: prom/prometheus
    configs:
      - source: prom_config
        target: /etc/prometheus/prometheus.yml
    ports:
      - '9090:9090'

configs:
  prom_config:
    file: ./config/prometheus.yml`,
  },
]

export function Task8_2_Solution() {
  const [activeTab, setActiveTab] = useState<SecretTab>('problem')
  const [activeSecret, setActiveSecret] = useState('compose')
  const [activeConfig, setActiveConfig] = useState('nginx')

  const tabs: { key: SecretTab; label: string }[] = [
    { key: 'problem', label: 'Проблема' },
    { key: 'secrets', label: 'Secrets' },
    { key: 'configs', label: 'Configs' },
    { key: 'comparison', label: 'Сравнение' },
  ]

  const currentSecret = secretExamples.find((s) => s.key === activeSecret)
  const currentConfig = configExamples.find((c) => c.key === activeConfig)

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 8.2: Secrets и configs</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: activeTab === t.key ? '#0070f3' : '#fff',
              color: activeTab === t.key ? '#fff' : '#333',
              fontSize: '0.9rem',
              fontWeight: activeTab === t.key ? 'bold' : 'normal',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'problem' && (
        <div>
          <h4 style={{ color: '#d32f2f', marginBottom: '0.75rem' }}>Почему переменные окружения небезопасны для секретов</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              {
                cmd: 'docker inspect mycontainer --format=\'{{json .Config.Env}}\'',
                desc: 'Секреты видны через docker inspect',
              },
              {
                cmd: 'docker exec mycontainer cat /proc/1/environ',
                desc: 'Секреты видны через /proc',
              },
              {
                cmd: 'console.log("Config:", process.env)',
                desc: 'Секреты могут попасть в логи',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #ffcdd2',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontWeight: 'bold', color: '#d32f2f', marginBottom: '0.25rem' }}>
                  {item.desc}
                </div>
                <code
                  style={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '3px',
                    fontSize: '0.8rem',
                  }}
                >
                  {item.cmd}
                </code>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '6px',
              fontSize: '0.9rem',
            }}
          >
            <strong>Решение:</strong> Docker Secrets передают данные через файлы (<code>/run/secrets/</code>),
            которые не видны через inspect и не попадают в логи.
          </div>
        </div>
      )}

      {activeTab === 'secrets' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {secretExamples.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSecret(s.key)}
                style={{
                  padding: '0.35rem 0.7rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeSecret === s.key ? '#e3f2fd' : '#f9f9f9',
                  fontSize: '0.85rem',
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
          {currentSecret && (
            <pre
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.82rem',
                lineHeight: '1.5',
              }}
            >
              {currentSecret.yaml}
            </pre>
          )}
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#f0f7ff',
              borderRadius: '6px',
              border: '1px solid #bbdefb',
              fontSize: '0.85rem',
            }}
          >
            <strong>Образы с поддержкой _FILE:</strong> postgres, mysql, mariadb, mongo -- читают пароль из файла автоматически
            (например, <code>POSTGRES_PASSWORD_FILE=/run/secrets/db_password</code>).
          </div>
        </div>
      )}

      {activeTab === 'configs' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {configExamples.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveConfig(c.key)}
                style={{
                  padding: '0.35rem 0.7rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeConfig === c.key ? '#e3f2fd' : '#f9f9f9',
                  fontSize: '0.85rem',
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
          {currentConfig && (
            <pre
              style={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '1rem',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '0.82rem',
                lineHeight: '1.5',
              }}
            >
              {currentConfig.yaml}
            </pre>
          )}
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#fff8e1',
              borderRadius: '6px',
              border: '1px solid #ffe082',
              fontSize: '0.85rem',
            }}
          >
            <strong>Configs vs bind mount:</strong> configs иммутабельны (не меняются после создания).
            Для разработки удобнее bind mount, для production -- configs.
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Критерий</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>environment</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Secrets</th>
                <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Configs</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Назначение', 'Любые настройки', 'Пароли, ключи, токены', 'Конфиг-файлы (nginx, etc.)'],
                ['Хранение', 'Переменные окружения', 'Файл /run/secrets/', 'Файл (настраиваемый путь)'],
                ['Видимость', 'docker inspect, /proc', 'Только внутри контейнера', 'Только внутри контейнера'],
                ['Шифрование (Swarm)', 'Нет', 'Да', 'Нет'],
                ['Изменяемость', 'При пересоздании', 'Иммутабельны', 'Иммутабельны'],
                ['Поддержка образов', 'Все', 'Нужна _FILE поддержка', 'Все (монтируется как файл)'],
                ['Когда использовать', 'Dev, некритичные', 'Production, секреты', 'Production, конфиги'],
              ].map((row, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  {row.map((cell, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        fontWeight: j === 0 ? 'bold' : 'normal',
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 8.3: Шаблоны конфигурации — Решение
// ========================================

type EnvType = 'dev' | 'staging' | 'prod'

const envConfigs: Record<EnvType, { label: string; color: string; compose: string; envFile: string; runCmd: string }> = {
  dev: {
    label: 'Development',
    color: '#4caf50',
    compose: `# docker-compose.override.yml (автоматически мержится)
services:
  db:
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: dev-password

  api:
    build:
      target: development
    ports:
      - '3000:3000'
      - '9229:9229'              # Debug-порт
    volumes:
      - ./api/src:/app/src       # Hot reload
    environment:
      DB_PASSWORD: dev-password
      LOG_LEVEL: debug
      DEBUG: 'true'`,
    envFile: `# .env (не в Git!)
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=dev-password
APP_PORT=3000
NODE_ENV=development
LOG_LEVEL=debug`,
    runCmd: `# Development (по умолчанию)
docker compose up -d
# Использует docker-compose.yml + docker-compose.override.yml + .env`,
  },
  staging: {
    label: 'Staging',
    color: '#ff9800',
    compose: `# docker-compose.staging.yml
services:
  db:
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD:?Set DB_PASSWORD}
    deploy:
      resources:
        limits:
          memory: 512M

  api:
    build:
      target: production
    ports:
      - '3000:3000'
    environment:
      DB_PASSWORD: \${DB_PASSWORD}
      LOG_LEVEL: info
      SENTRY_DSN: \${SENTRY_DSN:-}
    restart: unless-stopped`,
    envFile: `# .env.staging (CI/CD)
DB_NAME=myapp_staging
DB_USER=postgres
DB_PASSWORD=staging-password-from-ci
NODE_ENV=staging
LOG_LEVEL=info
SENTRY_DSN=https://xxx@sentry.io/staging`,
    runCmd: `# Staging
docker compose -f docker-compose.yml \\
  -f docker-compose.staging.yml \\
  --env-file .env.staging up -d`,
  },
  prod: {
    label: 'Production',
    color: '#f44336',
    compose: `# docker-compose.prod.yml
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
    file: ./secrets/jwt_secret.txt`,
    envFile: `# .env.prod (CI/CD, не в Git!)
DB_NAME=myapp_prod
DB_USER=postgres
NODE_ENV=production
LOG_LEVEL=warn
# Секреты через Docker Secrets, не через env!`,
    runCmd: `# Production
docker compose -f docker-compose.yml \\
  -f docker-compose.prod.yml \\
  --env-file .env.prod up -d`,
  },
}

const projectStructure = `project/
  docker-compose.yml            # Базовая конфигурация (в Git)
  docker-compose.override.yml   # Dev-настройки (в .gitignore)
  docker-compose.prod.yml       # Production (в Git)
  docker-compose.staging.yml    # Staging (в Git)

  .env                          # Dev-переменные (в .gitignore)
  .env.example                  # Шаблон для команды (в Git)
  .env.staging                  # Staging (CI/CD)
  .env.prod                     # Production (CI/CD)

  secrets/                      # Секреты (в .gitignore!)
    db_password.txt
    jwt_secret.txt`

const baseCompose = `# docker-compose.yml -- общая база для всех окружений
services:
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: \${DB_NAME:-myapp}
      POSTGRES_USER: \${DB_USER:-postgres}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER:-postgres}']
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
      NODE_ENV: \${NODE_ENV:-development}
      DB_HOST: db
      DB_NAME: \${DB_NAME:-myapp}
      DB_USER: \${DB_USER:-postgres}

volumes:
  pgdata:`

const yamlAnchors = `# YAML-якоря для DRY
x-common-env: &common-env
  NODE_ENV: \${NODE_ENV:-production}
  LOG_LEVEL: \${LOG_LEVEL:-info}
  TZ: UTC

x-db-env: &db-env
  DB_HOST: db
  DB_NAME: \${DB_NAME:-myapp}
  DB_USER: \${DB_USER:-postgres}
  DB_PASSWORD: \${DB_PASSWORD:?Set DB_PASSWORD}

services:
  api:
    environment:
      <<: *common-env
      <<: *db-env
      PORT: 3000

  worker:
    environment:
      <<: *common-env
      <<: *db-env
      QUEUE_NAME: default`

export function Task8_3_Solution() {
  const [activeEnv, setActiveEnv] = useState<EnvType>('dev')
  const [showView, setShowView] = useState<'structure' | 'base' | 'env' | 'anchors'>('structure')

  const currentEnvConfig = envConfigs[activeEnv]

  return (
    <div style={{ padding: '1rem', fontFamily: 'system-ui, sans-serif' }}>
      <h3 style={{ marginBottom: '1rem' }}>Задание 8.3: Шаблоны конфигурации</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(
          [
            { key: 'structure', label: 'Структура проекта' },
            { key: 'base', label: 'Базовый compose' },
            { key: 'env', label: 'Окружения' },
            { key: 'anchors', label: 'YAML-якоря' },
          ] as const
        ).map((v) => (
          <button
            key={v.key}
            onClick={() => setShowView(v.key)}
            style={{
              padding: '0.5rem 1rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: showView === v.key ? '#0070f3' : '#fff',
              color: showView === v.key ? '#fff' : '#333',
              fontSize: '0.9rem',
              fontWeight: showView === v.key ? 'bold' : 'normal',
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {showView === 'structure' && (
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Структура файлов</h4>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
              lineHeight: '1.6',
            }}
          >
            {projectStructure}
          </pre>
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: '#e8f5e9',
              border: '1px solid #a5d6a7',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            <strong>Принципы 12-factor app:</strong>
            <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem', marginBottom: 0 }}>
              <li>Конфигурация -- в переменных окружения, не в коде</li>
              <li>Один образ для всех окружений</li>
              <li>Секреты никогда не хардкодятся</li>
              <li>.env.example -- шаблон в Git для онбординга</li>
            </ul>
          </div>
        </div>
      )}

      {showView === 'base' && (
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>Базовый docker-compose.yml</h4>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              lineHeight: '1.5',
              overflow: 'auto',
            }}
          >
            {baseCompose}
          </pre>
          <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
            Базовый файл содержит общую конфигурацию. Переменные используют <code>{'${VAR:-default}'}</code> для безопасных дефолтов.
          </p>
        </div>
      )}

      {showView === 'env' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {(Object.entries(envConfigs) as [EnvType, typeof envConfigs.dev][]).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActiveEnv(key)}
                style={{
                  padding: '0.4rem 0.8rem',
                  border: `2px solid ${cfg.color}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  backgroundColor: activeEnv === key ? cfg.color : '#fff',
                  color: activeEnv === key ? '#fff' : cfg.color,
                  fontSize: '0.85rem',
                  fontWeight: 'bold',
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: currentEnvConfig.color }}>Compose override</h5>
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  lineHeight: '1.4',
                  overflow: 'auto',
                  maxHeight: '300px',
                }}
              >
                {currentEnvConfig.compose}
              </pre>
            </div>
            <div>
              <h5 style={{ margin: '0 0 0.5rem', color: currentEnvConfig.color }}>.env файл</h5>
              <pre
                style={{
                  backgroundColor: '#1e1e1e',
                  color: '#d4d4d4',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  lineHeight: '1.4',
                  overflow: 'auto',
                }}
              >
                {currentEnvConfig.envFile}
              </pre>
            </div>
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '6px',
              borderLeft: `4px solid ${currentEnvConfig.color}`,
            }}
          >
            <strong>Команда запуска:</strong>
            <pre
              style={{
                margin: '0.5rem 0 0',
                fontSize: '0.82rem',
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                padding: '0.5rem',
                borderRadius: '4px',
              }}
            >
              {currentEnvConfig.runCmd}
            </pre>
          </div>
        </div>
      )}

      {showView === 'anchors' && (
        <div>
          <h4 style={{ marginBottom: '0.5rem' }}>YAML-якоря для DRY-конфигурации</h4>
          <pre
            style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '1rem',
              borderRadius: '6px',
              fontSize: '0.82rem',
              lineHeight: '1.5',
              overflow: 'auto',
            }}
          >
            {yamlAnchors}
          </pre>
          <div style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
            <strong>Как работают якоря:</strong>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.25rem' }}>
              <li><code>&amp;name</code> -- определяет якорь (сохраняет блок)</li>
              <li><code>*name</code> -- ссылается на якорь (вставляет блок)</li>
              <li><code>{'<<: *name'}</code> -- мержит якорь в текущий маппинг</li>
              <li><code>x-</code> префикс -- расширения Compose (игнорируются при запуске)</li>
            </ul>
          </div>
        </div>
      )}

      <div
        style={{
          marginTop: '1.5rem',
          padding: '0.75rem',
          backgroundColor: '#fff3cd',
          borderRadius: '6px',
          border: '1px solid #ffc107',
          fontSize: '0.85rem',
        }}
      >
        <strong>docker compose config</strong> -- показывает итоговую конфигурацию с подставленными переменными.
        Всегда проверяйте перед запуском!
      </div>
    </div>
  )
}
