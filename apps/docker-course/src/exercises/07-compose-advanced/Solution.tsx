import { useState } from 'react'

// ========================================
// Задание 7.1: depends_on и healthcheck — Решение
// ========================================

const dependsOnExamples = [
  {
    key: 'simple',
    label: 'Простая форма',
    yaml: `services:
  api:
    build: ./api
    depends_on:
      - db
      - redis
    # Compose запустит db и redis ПЕРЕД api
    # Но НЕ дождётся их готовности!

  db:
    image: postgres:16

  redis:
    image: redis:7-alpine`,
    warning: 'Простая форма НЕ гарантирует, что сервис готов принимать подключения. Контейнер PostgreSQL запускается за 0.5с, но сервер БД инициализируется 5-15с.',
  },
  {
    key: 'condition',
    label: 'С условиями',
    yaml: `services:
  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
        # Ждать, пока healthcheck пройдёт
      redis:
        condition: service_started
        # Достаточно, что контейнер запущен
      migrations:
        condition: service_completed_successfully
        # Ждать успешного завершения (exit 0)

  db:
    image: postgres:16
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 10s

  redis:
    image: redis:7-alpine

  migrations:
    build: ./api
    command: npm run migrate
    depends_on:
      db:
        condition: service_healthy`,
    warning: null,
  },
]

const healthcheckExamples = [
  {
    service: 'PostgreSQL',
    yaml: `healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 5s
  timeout: 3s
  retries: 5
  start_period: 30s`,
  },
  {
    service: 'Redis',
    yaml: `healthcheck:
  test: ['CMD', 'redis-cli', 'ping']
  interval: 5s
  timeout: 3s
  retries: 5`,
  },
  {
    service: 'HTTP (curl)',
    yaml: `healthcheck:
  test: ['CMD-SHELL', 'curl -f http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3
  start_period: 15s`,
  },
  {
    service: 'HTTP (wget)',
    yaml: `healthcheck:
  test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
  interval: 10s
  timeout: 5s
  retries: 3`,
  },
  {
    service: 'MySQL',
    yaml: `healthcheck:
  test: ['CMD', 'mysqladmin', 'ping', '-h', 'localhost']
  interval: 10s
  timeout: 5s
  retries: 3`,
  },
  {
    service: 'MongoDB',
    yaml: `healthcheck:
  test: ['CMD', 'mongosh', '--eval', 'db.adminCommand("ping")']
  interval: 10s
  timeout: 5s
  retries: 3`,
  },
]

const conditions = [
  { condition: 'service_started', desc: 'Контейнер запущен', use: 'Сервисы без healthcheck' },
  { condition: 'service_healthy', desc: 'Healthcheck проходит', use: 'БД, кэш, очереди' },
  { condition: 'service_completed_successfully', desc: 'Завершился с кодом 0', use: 'Миграции, seed, init-скрипты' },
]

export function Task7_1_Solution() {
  const [tab, setTab] = useState<'depends_on' | 'healthcheck' | 'conditions'>('depends_on')
  const [depExample, setDepExample] = useState(0)
  const [hcExample, setHcExample] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>depends_on и healthcheck</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'depends_on' as const, label: 'depends_on' },
          { key: 'healthcheck' as const, label: 'healthcheck' },
          { key: 'conditions' as const, label: 'Условия' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t.key ? '#1976d2' : '#f5f5f5',
              color: tab === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'depends_on' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {dependsOnExamples.map((ex, i) => (
              <button
                key={ex.key}
                onClick={() => setDepExample(i)}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: depExample === i ? '#1565c0' : '#f8f9fa',
                  color: depExample === i ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {ex.label}
              </button>
            ))}
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {dependsOnExamples[depExample].yaml}
          </pre>
          {dependsOnExamples[depExample].warning && (
            <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem', borderLeft: '3px solid #e65100' }}>
              <strong>&#9888;&#65039;</strong> {dependsOnExamples[depExample].warning}
            </div>
          )}
        </div>
      )}

      {tab === 'healthcheck' && (
        <div>
          <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {healthcheckExamples.map((ex, i) => (
              <button
                key={ex.service}
                onClick={() => setHcExample(i)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: hcExample === i ? '#2e7d32' : '#f8f9fa',
                  color: hcExample === i ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                }}
              >
                {ex.service}
              </button>
            ))}
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {healthcheckExamples[hcExample].yaml}
          </pre>
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Параметры healthcheck:</strong>
            <ul style={{ margin: '0.25rem 0 0 0', paddingLeft: '1.2rem' }}>
              <li><code>interval</code> -- интервал между проверками</li>
              <li><code>timeout</code> -- таймаут одной проверки</li>
              <li><code>retries</code> -- неудачных попыток до unhealthy</li>
              <li><code>start_period</code> -- время на запуск (провалы не считаются)</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'conditions' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Условие</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Что означает</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Когда использовать</th>
              </tr>
            </thead>
            <tbody>
              {conditions.map(c => (
                <tr key={c.condition}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>{c.condition}</code></td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{c.desc}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{c.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <strong>Порядок запуска стека:</strong>
            <pre style={{ background: '#1e1e1e', color: '#ce93d8', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>
{`1. db стартует          [starting]
2. db healthcheck OK    [healthy]
3. migrations запускается
4. migrations завершается (exit 0)
5. api стартует
6. api healthcheck OK   [healthy]
7. web стартует`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 7.2: Web + DB + Cache — Решение
// ========================================

const stackYaml = `services:
  # ---- Инфраструктура ----
  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_DB: \${DB_NAME:-myapp}
      POSTGRES_USER: \${DB_USER:-postgres}
      POSTGRES_PASSWORD: \${DB_PASSWORD:?required}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U \${DB_USER:-postgres}']
      interval: 5s
      timeout: 3s
      retries: 5
      start_period: 30s
    ports:
      - '127.0.0.1:5432:5432'
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data
    command: >-
      redis-server --appendonly yes
      --maxmemory 256mb
      --maxmemory-policy allkeys-lru
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 5s
      timeout: 3s
      retries: 5
    restart: unless-stopped

  # ---- Миграции (одноразовый сервис) ----
  migrations:
    build:
      context: ./api
      target: migrations
    environment:
      DATABASE_URL: >-
        postgresql://\${DB_USER:-postgres}:\${DB_PASSWORD}@db:5432/\${DB_NAME:-myapp}
    depends_on:
      db:
        condition: service_healthy
    restart: 'no'

  # ---- Backend ----
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production
      DATABASE_URL: >-
        postgresql://\${DB_USER:-postgres}:\${DB_PASSWORD}@db:5432/\${DB_NAME:-myapp}
      REDIS_URL: redis://redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrations:
        condition: service_completed_successfully
    healthcheck:
      test: ['CMD-SHELL', 'wget --spider -q http://localhost:3000/health || exit 1']
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s
    restart: unless-stopped

  # ---- Frontend ----
  web:
    build: ./frontend
    ports:
      - '80:80'
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped

volumes:
  pgdata:
  redis-data:`

const services = [
  { name: 'db', type: 'PostgreSQL', role: 'База данных', port: '5432', healthcheck: 'pg_isready', color: '#336791' },
  { name: 'redis', type: 'Redis', role: 'Кэш / сессии', port: '6379', healthcheck: 'redis-cli ping', color: '#DC382D' },
  { name: 'migrations', type: 'Node.js', role: 'Миграции БД', port: '--', healthcheck: 'exit 0', color: '#8BC34A' },
  { name: 'api', type: 'Node.js', role: 'REST API', port: '3000', healthcheck: 'wget /health', color: '#689F38' },
  { name: 'web', type: 'Nginx', role: 'Frontend (SPA)', port: '80', healthcheck: '--', color: '#009688' },
]

const startupOrder = [
  { step: 1, service: 'db + redis', event: 'Стартуют параллельно' },
  { step: 2, service: 'db + redis', event: 'Healthcheck проходит (healthy)' },
  { step: 3, service: 'migrations', event: 'Запускается, выполняет миграции' },
  { step: 4, service: 'migrations', event: 'Завершается успешно (exit 0)' },
  { step: 5, service: 'api', event: 'Стартует, подключается к db и redis' },
  { step: 6, service: 'api', event: 'Healthcheck проходит (healthy)' },
  { step: 7, service: 'web', event: 'Стартует, проксирует к api' },
]

export function Task7_2_Solution() {
  const [tab, setTab] = useState<'yaml' | 'services' | 'order'>('yaml')

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Web + DB + Cache: полный стек</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'yaml' as const, label: 'docker-compose.yml' },
          { key: 'services' as const, label: 'Сервисы' },
          { key: 'order' as const, label: 'Порядок запуска' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t.key ? '#2e7d32' : '#f5f5f5',
              color: tab === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'yaml' && (
        <div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '500px', overflowY: 'auto' }}>
            {stackYaml}
          </pre>
          <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>5</strong> сервисов
            </div>
            <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>2</strong> тома
            </div>
            <div style={{ padding: '0.5rem', background: '#fff3e0', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>4</strong> healthcheck
            </div>
          </div>
        </div>
      )}

      {tab === 'services' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Сервис</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Образ</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Роль</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>Порт</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Healthcheck</th>
              </tr>
            </thead>
            <tbody>
              {services.map(s => (
                <tr key={s.name}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: s.color, marginRight: '0.4rem' }} />
                    <code>{s.name}</code>
                  </td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{s.type}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{s.role}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}><code>{s.port}</code></td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.8rem' }}><code>{s.healthcheck}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Паттерн:</strong> инфраструктура (db, redis) &#8594; миграции &#8594; backend (api) &#8594; frontend (web). Каждый слой зависит от предыдущего через <code>depends_on</code> с <code>condition</code>.
          </div>
        </div>
      )}

      {tab === 'order' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {startupOrder.map(s => (
              <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', background: s.step <= 2 ? '#e3f2fd' : s.step <= 4 ? '#e8f5e9' : s.step <= 6 ? '#fff3e0' : '#f3e5f5', borderRadius: '6px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: '#333', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', flexShrink: 0 }}>
                  {s.step}
                </span>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>{s.service}</strong>
                  <span style={{ color: '#666', marginLeft: '0.5rem' }}>{s.event}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Ключевой момент:</strong> <code>service_completed_successfully</code> для миграций гарантирует, что схема БД обновлена <em>до</em> старта API. Без этого API может упасть при обращении к несуществующим таблицам.
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 7.3: profiles и override — Решение
// ========================================

const profilesYaml = `services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    # Нет profiles -- запускается ВСЕГДА

  db:
    image: postgres:16
    # Нет profiles -- запускается ВСЕГДА

  adminer:
    image: adminer
    ports:
      - '8080:8080'
    profiles:
      - debug           # Только с --profile debug

  mailhog:
    image: mailhog/mailhog
    ports:
      - '8025:8025'
    profiles:
      - debug           # Только с --profile debug

  test-runner:
    build: ./tests
    profiles:
      - test            # Только с --profile test

  prometheus:
    image: prom/prometheus
    profiles:
      - monitoring      # Только с --profile monitoring

  grafana:
    image: grafana/grafana
    profiles:
      - monitoring      # Тот же профиль`

const profileCommands = [
  { cmd: 'docker compose up -d', result: 'api, db', desc: 'Без профилей -- только основные' },
  { cmd: 'docker compose --profile debug up -d', result: 'api, db, adminer, mailhog', desc: 'С профилем debug' },
  { cmd: 'docker compose --profile test up -d', result: 'api, db, test-runner', desc: 'С профилем test' },
  { cmd: 'docker compose --profile debug --profile monitoring up -d', result: 'api, db, adminer, mailhog, prometheus, grafana', desc: 'Несколько профилей' },
  { cmd: 'COMPOSE_PROFILES=debug docker compose up -d', result: 'api, db, adminer, mailhog', desc: 'Через переменную окружения' },
]

const overrideBase = `# docker-compose.yml (основной, в Git)
services:
  api:
    build:
      context: ./api
      target: production
    ports:
      - '3000:3000'
    environment:
      NODE_ENV: production

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: \${DB_PASSWORD}

volumes:
  pgdata:`

const overrideDev = `# docker-compose.override.yml (для dev, в .gitignore)
services:
  api:
    build:
      target: development
    volumes:
      - ./api/src:/app/src
    environment:
      NODE_ENV: development
      DEBUG: 'true'
    ports:
      - '9229:9229'

  db:
    ports:
      - '5432:5432'
    environment:
      POSTGRES_PASSWORD: dev-password`

const overrideResult = `# Результат слияния
services:
  api:
    build:
      context: ./api            # из base
      target: development       # переопределён
    ports:
      - '3000:3000'             # из base
      - '9229:9229'             # добавлен (списки конкатенируются!)
    volumes:
      - ./api/src:/app/src      # добавлен
    environment:
      NODE_ENV: development     # переопределён
      DEBUG: 'true'             # добавлен

  db:
    image: postgres:16-alpine   # из base
    volumes:
      - pgdata:/var/lib/...     # из base
    ports:
      - '5432:5432'             # добавлен
    environment:
      POSTGRES_PASSWORD: dev-password  # переопределён`

const mergeRules = [
  { type: 'Скаляры (image, target, command)', behavior: 'Переопределяются' },
  { type: 'Маппинги (environment, labels)', behavior: 'Мержатся (override перезаписывает ключи)' },
  { type: 'Списки (ports, volumes, expose)', behavior: 'Конкатенируются (добавляются)' },
  { type: 'command, entrypoint', behavior: 'Переопределяются полностью' },
]

export function Task7_3_Solution() {
  const [tab, setTab] = useState<'profiles' | 'override' | 'rules'>('profiles')
  const [overrideView, setOverrideView] = useState<'base' | 'dev' | 'result'>('base')

  return (
    <div style={{ padding: '1rem' }}>
      <h3>profiles и override</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'profiles' as const, label: 'profiles' },
          { key: 'override' as const, label: 'override' },
          { key: 'rules' as const, label: 'Правила слияния' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t.key ? '#e65100' : '#f5f5f5',
              color: tab === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'profiles' && (
        <div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '350px', overflowY: 'auto' }}>
            {profilesYaml}
          </pre>
          <div style={{ marginTop: '1rem' }}>
            <strong style={{ fontSize: '0.85rem' }}>Какие сервисы запустятся:</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
              {profileCommands.map((p, i) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', background: '#f8f9fa', borderRadius: '6px', borderLeft: '3px solid #e65100', fontSize: '0.8rem' }}>
                  <code style={{ display: 'block', color: '#555' }}>{p.cmd}</code>
                  <span style={{ color: '#2e7d32', fontWeight: 'bold' }}>{p.result}</span>
                  <span style={{ color: '#888', marginLeft: '0.5rem' }}>-- {p.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'override' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {([
              { key: 'base' as const, label: 'docker-compose.yml' },
              { key: 'dev' as const, label: 'override.yml' },
              { key: 'result' as const, label: 'Результат' },
            ]).map(t => (
              <button
                key={t.key}
                onClick={() => setOverrideView(t.key)}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: overrideView === t.key ? '#bf360c' : '#f8f9fa',
                  color: overrideView === t.key ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
            {overrideView === 'base' ? overrideBase : overrideView === 'dev' ? overrideDev : overrideResult}
          </pre>
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem' }}>
            {overrideView === 'base' && 'Базовая конфигурация -- коммитится в Git, используется как основа для всех окружений.'}
            {overrideView === 'dev' && 'Override для разработки -- добавляется в .gitignore. Compose подхватывает автоматически.'}
            {overrideView === 'result' && 'Итог: скаляры (target) переопределены, маппинги (environment) смержены, списки (ports) конкатенированы.'}
          </div>
        </div>
      )}

      {tab === 'rules' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Тип поля</th>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Поведение при слиянии</th>
              </tr>
            </thead>
            <tbody>
              {mergeRules.map(r => (
                <tr key={r.type}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>{r.type}</code></td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{r.behavior}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem', padding: '1rem', background: '#fce4ec', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>&#9888;&#65039; Внимание с ports:</strong> списки конкатенируются, а не заменяются. Не дублируйте порты в override-файле -- получите ошибку <code>port is already allocated</code>.
          </div>
          <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Production:</strong> при <code>-f</code> override НЕ подхватывается:
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0 0 0' }}>
              {`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 7.4: Compose Watch — Решение
// ========================================

const watchActions = [
  {
    action: 'sync',
    desc: 'Копирует файлы в контейнер',
    when: 'Исходный код (hot reload)',
    yaml: `- action: sync
  path: ./api/src
  target: /app/src
  ignore:
    - '**/*.test.ts'
    - '**/__tests__/**'`,
    details: 'Файлы копируются без перезапуска контейнера. Идеально для hot-reload серверов (nodemon, vite dev).',
  },
  {
    action: 'rebuild',
    desc: 'Пересобирает образ + recreate',
    when: 'Зависимости (package.json, go.mod)',
    yaml: `- action: rebuild
  path: ./api/package.json

- action: rebuild
  path: ./api/package-lock.json`,
    details: 'Выполняет docker compose build + recreate контейнера. Нужен для изменений, которые требуют пересборки образа.',
  },
  {
    action: 'sync+restart',
    desc: 'Копирует файлы + перезапуск',
    when: 'Конфигурация (.env, config.json)',
    yaml: `- action: sync+restart
  path: ./api/.env
  target: /app/.env

- action: sync+restart
  path: ./api/config.json
  target: /app/config.json`,
    details: 'Файлы копируются, затем контейнер перезапускается. Для файлов, которые читаются только при старте.',
  },
]

const fullWatchYaml = `services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    develop:
      watch:
        # Исходный код -- sync (hot reload)
        - action: sync
          path: ./api/src
          target: /app/src
          ignore:
            - '**/*.test.ts'
            - '**/__tests__/**'

        # Зависимости -- rebuild
        - action: rebuild
          path: ./api/package.json
        - action: rebuild
          path: ./api/package-lock.json

        # Конфигурация -- sync + restart
        - action: sync+restart
          path: ./api/.env
          target: /app/.env

  frontend:
    build: ./frontend
    ports:
      - '5173:5173'
    develop:
      watch:
        - action: sync
          path: ./frontend/src
          target: /app/src

        - action: rebuild
          path: ./frontend/package.json

        - action: sync+restart
          path: ./frontend/vite.config.ts
          target: /app/vite.config.ts`

const watchVsBind = [
  { feature: 'node_modules', bind: 'Нужен анонимный том', watch: 'Нет проблем' },
  { feature: 'macOS perf', bind: 'Медленно (FUSE)', watch: 'Быстро (копирование)' },
  { feature: 'Фильтрация', bind: 'Нет (всё монтируется)', watch: 'ignore-паттерны' },
  { feature: 'Пересборка', bind: 'Вручную', watch: 'Автоматически (rebuild)' },
  { feature: 'Настройка', bind: 'Просто', watch: 'Нужен блок develop.watch' },
]

export function Task7_4_Solution() {
  const [tab, setTab] = useState<'actions' | 'full' | 'compare'>('actions')
  const [activeAction, setActiveAction] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Compose Watch</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'actions' as const, label: 'Действия watch' },
          { key: 'full' as const, label: 'Полный пример' },
          { key: 'compare' as const, label: 'Watch vs Bind Mount' },
        ]).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.5rem 1rem',
              background: tab === t.key ? '#7b1fa2' : '#f5f5f5',
              color: tab === t.key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'actions' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {watchActions.map((a, i) => (
              <button
                key={a.action}
                onClick={() => setActiveAction(i)}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: activeAction === i ? '#6a1b9a' : '#f8f9fa',
                  color: activeAction === i ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <code>{a.action}</code>
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #7b1fa2' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>{watchActions[activeAction].desc}</strong>
              <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.85rem' }}>| {watchActions[activeAction].when}</span>
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {watchActions[activeAction].yaml}
            </pre>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#555' }}>
              {watchActions[activeAction].details}
            </div>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3e5f5', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Запуск:</strong> <code>docker compose watch</code> -- отслеживает изменения файлов и выполняет указанные действия автоматически.
          </div>
        </div>
      )}

      {tab === 'full' && (
        <div>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.75rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap', maxHeight: '450px', overflowY: 'auto' }}>
            {fullWatchYaml}
          </pre>
          <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.8rem' }}>
              <strong>api:</strong> 4 правила watch (src &#8594; sync, package.json &#8594; rebuild, .env &#8594; sync+restart)
            </div>
            <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.8rem' }}>
              <strong>frontend:</strong> 3 правила watch (src &#8594; sync, package.json &#8594; rebuild, vite.config &#8594; sync+restart)
            </div>
          </div>
        </div>
      )}

      {tab === 'compare' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Аспект</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>Bind Mount</th>
                <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>Compose Watch</th>
              </tr>
            </thead>
            <tbody>
              {watchVsBind.map(r => (
                <tr key={r.feature}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>{r.feature}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', background: '#fce4ec' }}>{r.bind}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', background: '#e8f5e9' }}>{r.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.85rem' }}>Bind Mount</strong>
                <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>
{`volumes:
  - ./api:/app
  - /app/node_modules`}
                </pre>
              </div>
              <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
                <strong style={{ fontSize: '0.85rem' }}>Compose Watch</strong>
                <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.75rem', margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>
{`develop:
  watch:
    - action: sync
      path: ./api/src
      target: /app/src`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
