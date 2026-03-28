import { useState } from 'react'

// ========================================
// Задание 6.1: Структура docker-compose.yml — Решение
// ========================================

const yamlSections = [
  {
    key: 'services',
    label: 'services',
    required: true,
    desc: 'Определение контейнеров (сервисов) приложения',
    example: `services:
  web:
    image: nginx:alpine
    ports:
      - '80:80'
  api:
    build: ./api
    ports:
      - '3000:3000'
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret`,
  },
  {
    key: 'volumes',
    label: 'volumes',
    required: false,
    desc: 'Именованные тома для хранения данных',
    example: `volumes:
  pgdata:              # Пустое значение -- Docker создаст том
    driver: local      # Драйвер (по умолчанию local)
  redis-data:
    external: true     # Том уже существует (не создавать)`,
  },
  {
    key: 'networks',
    label: 'networks',
    required: false,
    desc: 'Пользовательские сети (по умолчанию Compose создаёт одну автоматически)',
    example: `networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16`,
  },
]

const fullExample = `# docker-compose.yml -- полный пример
services:
  web:
    image: nginx:alpine
    ports:
      - '80:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - frontend

  api:
    build: ./api
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:secret@db:5432/myapp
    depends_on:
      - db
    networks:
      - frontend
      - backend

  db:
    image: postgres:16
    volumes:
      - pgdata:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: secret
    networks:
      - backend

networks:
  frontend:
  backend:

volumes:
  pgdata:`

export function Task6_1_Solution() {
  const [tab, setTab] = useState<'sections' | 'full' | 'version'>('sections')
  const [activeSection, setActiveSection] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Структура docker-compose.yml</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {([
          { key: 'sections' as const, label: 'Секции файла' },
          { key: 'full' as const, label: 'Полный пример' },
          { key: 'version' as const, label: 'version (deprecated)' },
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

      {tab === 'sections' && (
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {yamlSections.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setActiveSection(i)}
                style={{
                  padding: '0.4rem 0.8rem',
                  background: activeSection === i ? '#1565c0' : '#f8f9fa',
                  color: activeSection === i ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                <code>{s.label}</code>
                {s.required && <span style={{ color: activeSection === i ? '#ffcdd2' : '#d32f2f', marginLeft: '0.3rem', fontSize: '0.75rem' }}>*</span>}
              </button>
            ))}
          </div>
          <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #1976d2' }}>
            <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
              {yamlSections[activeSection].desc}
              {yamlSections[activeSection].required
                ? <span style={{ marginLeft: '0.5rem', color: '#d32f2f', fontWeight: 'bold' }}>(обязательная)</span>
                : <span style={{ marginLeft: '0.5rem', color: '#666' }}>(опциональная)</span>
              }
            </div>
            <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, overflowX: 'auto' }}>
              {yamlSections[activeSection].example}
            </pre>
          </div>
        </div>
      )}

      {tab === 'full' && (
        <div>
          <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 0.75rem 0' }}>
            Типичный docker-compose.yml для веб-приложения с API и базой данных:
          </p>
          <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4', overflowX: 'auto' }}>
            {fullExample}
          </pre>
          <div style={{ marginTop: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <div style={{ padding: '0.5rem', background: '#e3f2fd', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>3</strong> сервиса
            </div>
            <div style={{ padding: '0.5rem', background: '#e8f5e9', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>2</strong> сети
            </div>
            <div style={{ padding: '0.5rem', background: '#fff3e0', borderRadius: '6px', textAlign: 'center', fontSize: '0.8rem' }}>
              <strong>1</strong> том
            </div>
          </div>
        </div>
      )}

      {tab === 'version' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
              <strong style={{ color: '#c62828' }}>❌ Устаревший формат</strong>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0' }}>
{`version: '3.8'

services:
  web:
    image: nginx`}
              </pre>
              <small style={{ color: '#888' }}>version игнорируется в Compose V2</small>
            </div>
            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
              <strong style={{ color: '#2e7d32' }}>✅ Современный формат</strong>
              <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0' }}>
{`services:
  web:
    image: nginx`}
              </pre>
              <small style={{ color: '#888' }}>Compose V2 определяет формат автоматически</small>
            </div>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem' }}>
            <strong>Почему version устарел:</strong> Docker Compose V2 (встроенный плагин) автоматически определяет совместимость. Ключ version больше не влияет на поведение и может быть удалён из файла.
          </div>
        </div>
      )}
    </div>
  )
}

// ========================================
// Задание 6.2: services, image, build — Решение
// ========================================

const serviceExamples = [
  {
    key: 'image',
    label: 'image (готовый образ)',
    yaml: `services:
  # Образ из Docker Hub
  db:
    image: postgres:16

  # Образ с конкретным тегом Alpine
  redis:
    image: redis:7-alpine

  # Образ из приватного реестра
  api:
    image: registry.company.com/api:v2.1.0

  # Образ с digest
  nginx:
    image: nginx@sha256:abc123...`,
    desc: 'Использование готовых образов из Docker Hub или приватного реестра',
  },
  {
    key: 'build-simple',
    label: 'build (простая сборка)',
    yaml: `services:
  api:
    build: ./api
    # Эквивалент:
    # docker build ./api

  web:
    build: ./frontend
    # Ищет Dockerfile в папке ./frontend`,
    desc: 'Сборка образа из Dockerfile в указанной директории',
  },
  {
    key: 'build-advanced',
    label: 'build (расширенная)',
    yaml: `services:
  api:
    build:
      context: ./api          # Контекст сборки
      dockerfile: Dockerfile.prod  # Имя Dockerfile
      args:                   # Build arguments
        NODE_ENV: production
        API_URL: http://api:3000
      target: production      # Multi-stage target
      cache_from:
        - my-api:latest`,
    desc: 'Расширенная конфигурация: контекст, аргументы, target для multi-stage',
  },
  {
    key: 'image-build',
    label: 'image + build',
    yaml: `services:
  api:
    build: ./api
    image: my-api:latest
    # Собирает образ из ./api
    # и тегирует его как my-api:latest
    # Полезно для push в реестр:
    # docker compose push api`,
    desc: 'Комбинация: сборка + присвоение тега для push',
  },
  {
    key: 'container-name',
    label: 'container_name',
    yaml: `services:
  db:
    image: postgres:16
    container_name: myapp-database
    # По умолчанию: <project>-db-1
    # С container_name: myapp-database

# ⚠️ container_name запрещает масштабирование:
# docker compose up --scale db=2
# ERROR: container name "myapp-database" is
# already in use`,
    desc: 'Фиксированное имя контейнера (не рекомендуется для production)',
  },
]

export function Task6_2_Solution() {
  const [active, setActive] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Services: image, build, container_name</h3>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {serviceExamples.map((ex, i) => (
          <button
            key={ex.key}
            onClick={() => setActive(i)}
            style={{
              padding: '0.4rem 0.75rem',
              background: active === i ? '#2e7d32' : '#f8f9fa',
              color: active === i ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            {ex.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px', borderLeft: '3px solid #2e7d32' }}>
        <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '0.5rem' }}>{serviceExamples[active].desc}</div>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
          {serviceExamples[active].yaml}
        </pre>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Опция</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', border: '1px solid #ddd' }}>Когда использовать</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', border: '1px solid #ddd' }}>Пример</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>image</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Готовый образ (БД, Redis, Nginx)</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}><code>postgres:16</code></td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>build</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Ваш код с Dockerfile</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}><code>./api</code></td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>build + image</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Сборка + тегирование для push</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}><code>my-api:latest</code></td>
            </tr>
            <tr>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}><code>container_name</code></td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>Фиксированное имя (только dev)</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}><code>myapp-db</code></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Совет:</strong> Для инфраструктурных сервисов (БД, кэш, очереди) используйте <code>image</code>. Для своего кода -- <code>build</code>. Всегда указывайте конкретный тег образа.
      </div>
    </div>
  )
}

// ========================================
// Задание 6.3: ports, volumes, environment — Решение
// ========================================

const configSections = [
  {
    key: 'ports',
    label: 'ports',
    yaml: `services:
  web:
    image: nginx
    ports:
      # Короткий синтаксис
      - '8080:80'             # hostPort:containerPort
      - '127.0.0.1:8080:80'  # Только localhost
      - '443:443'             # HTTPS

  api:
    build: ./api
    ports:
      # Длинный синтаксис
      - target: 3000
        published: 3000
        protocol: tcp
        host_ip: 127.0.0.1

    expose:
      - '3000'
      # expose НЕ публикует на хосте
      # Только для внутренней связи`,
    notes: [
      'Всегда оборачивайте в кавычки: \'80:80\'',
      'ports -- публикует на хосте, expose -- только внутри сети',
      '127.0.0.1 ограничивает доступ только localhost',
    ],
  },
  {
    key: 'volumes',
    label: 'volumes',
    yaml: `services:
  db:
    image: postgres:16
    volumes:
      # Именованный том (данные сохраняются)
      - pgdata:/var/lib/postgresql/data

  api:
    build: ./api
    volumes:
      # Bind mount (монтирование с хоста)
      - ./src:/app/src
      # Read-only bind mount
      - ./config.json:/app/config.json:ro
      # Анонимный том (исключить из bind mount)
      - /app/node_modules

# Объявление именованных томов (обязательно!)
volumes:
  pgdata:`,
    notes: [
      './path -- bind mount (начинается с точки)',
      'name:/path -- именованный том (без точки)',
      'Именованные тома нужно объявить в корневой секции volumes',
      ':ro -- монтирование только для чтения',
    ],
  },
  {
    key: 'environment',
    label: 'environment',
    yaml: `services:
  api:
    build: ./api
    # Inline-переменные
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:\${DB_PASSWORD}@db:5432/myapp
      REDIS_URL: redis://redis:6379

  db:
    image: postgres:16
    # Переменные из файла
    env_file:
      - .env
      - .env.local    # Переопределения

  web:
    image: nginx
    environment:
      # Переменная с значением по умолчанию
      - API_URL=\${API_URL:-http://api:3000}`,
    notes: [
      'environment -- inline, env_file -- из файла',
      '${VAR:-default} -- значение по умолчанию',
      '.env рядом с docker-compose.yml загружается автоматически',
      'Не коммитьте .env с секретами в Git!',
    ],
  },
]

export function Task6_3_Solution() {
  const [active, setActive] = useState(0)

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Ports, Volumes, Environment</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {configSections.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(i)}
            style={{
              padding: '0.5rem 1rem',
              background: active === i ? '#e65100' : '#f5f5f5',
              color: active === i ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            <code>{s.label}</code>
          </button>
        ))}
      </div>

      <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', lineHeight: '1.4', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
        {configSections[active].yaml}
      </pre>

      <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {configSections[active].notes.map((note, i) => (
          <div key={i} style={{ padding: '0.5rem 0.75rem', background: i === 0 ? '#fff3e0' : '#f8f9fa', borderRadius: '6px', fontSize: '0.85rem', borderLeft: '3px solid #e65100' }}>
            {note}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <div style={{ padding: '0.75rem', background: '#e3f2fd', borderRadius: '8px', fontSize: '0.85rem' }}>
          <strong>Полный пример:</strong> веб-приложение с БД
        </div>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '0 0 6px 6px', fontSize: '0.8rem', margin: 0, overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
{`services:
  api:
    build: ./api
    ports:
      - '3000:3000'
    volumes:
      - ./api/src:/app/src
    environment:
      DATABASE_URL: postgresql://postgres:\${DB_PASS}@db:5432/app
    env_file:
      - .env

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    env_file:
      - ./db/.env

volumes:
  pgdata:`}
        </pre>
      </div>
    </div>
  )
}

// ========================================
// Задание 6.4: docker compose up/down/logs — Решение
// ========================================

const commandGroups = [
  {
    key: 'lifecycle',
    label: 'Жизненный цикл',
    commands: [
      { cmd: 'docker compose up -d', output: '[+] Running 4/4\n ✔ Network myapp_default  Created\n ✔ Container myapp-db-1   Started\n ✔ Container myapp-redis-1 Started\n ✔ Container myapp-api-1  Started', desc: 'Запуск всех сервисов в фоне' },
      { cmd: 'docker compose up -d --build', output: '[+] Building 2/2\n ✔ api  Built\n ✔ web  Built\n[+] Running 4/4\n ✔ Container myapp-db-1   Running\n ✔ Container myapp-api-1  Started\n ✔ Container myapp-web-1  Started', desc: 'Пересборка образов + запуск' },
      { cmd: 'docker compose down', output: '[+] Running 4/4\n ✔ Container myapp-api-1  Removed\n ✔ Container myapp-redis-1 Removed\n ✔ Container myapp-db-1   Removed\n ✔ Network myapp_default  Removed', desc: 'Остановка + удаление контейнеров и сетей' },
      { cmd: 'docker compose down -v', output: '[+] Running 5/5\n ✔ Container myapp-api-1  Removed\n ✔ Container myapp-db-1   Removed\n ✔ Volume myapp_pgdata    Removed\n ✔ Network myapp_default  Removed', desc: '⚠️ Также удаляет тома (данные!)' },
    ],
  },
  {
    key: 'logs',
    label: 'Логи',
    commands: [
      { cmd: 'docker compose logs', output: 'api-1  | Server started on port 3000\ndb-1   | database system is ready\nredis-1| Ready to accept connections', desc: 'Логи всех сервисов' },
      { cmd: 'docker compose logs -f api', output: 'api-1  | Server started on port 3000\napi-1  | GET /api/users 200 12ms\napi-1  | POST /api/auth 201 45ms\n...following...', desc: 'Следить за логами сервиса' },
      { cmd: 'docker compose logs --tail 20 -t', output: '2024-01-15T10:30:01Z api-1 | GET /health 200\n2024-01-15T10:30:05Z api-1 | GET /api/users 200\n...last 20 lines with timestamps...', desc: 'Последние 20 строк с временем' },
    ],
  },
  {
    key: 'status',
    label: 'Статус и управление',
    commands: [
      { cmd: 'docker compose ps', output: 'NAME            SERVICE  STATUS   PORTS\nmyapp-api-1     api      running  0.0.0.0:3000->3000/tcp\nmyapp-db-1      db       running  5432/tcp\nmyapp-redis-1   redis    running  6379/tcp', desc: 'Статус всех сервисов' },
      { cmd: 'docker compose exec api sh', output: '/app $ ls\npackage.json  src  node_modules\n/app $ exit', desc: 'Выполнить команду в контейнере' },
      { cmd: 'docker compose restart api', output: '[+] Restarting 1/1\n ✔ Container myapp-api-1  Started', desc: 'Перезапуск сервиса' },
      { cmd: 'docker compose build --no-cache api', output: '[+] Building 1/1\n => [api] docker build ./api\n => DONE', desc: 'Пересборка без кэша' },
    ],
  },
]

export function Task6_4_Solution() {
  const [group, setGroup] = useState(0)
  const [activeCmd, setActiveCmd] = useState(0)

  const currentGroup = commandGroups[group]
  const currentCmd = currentGroup.commands[Math.min(activeCmd, currentGroup.commands.length - 1)]

  const handleGroupChange = (i: number) => {
    setGroup(i)
    setActiveCmd(0)
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h3>Docker Compose: команды</h3>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {commandGroups.map((g, i) => (
          <button
            key={g.key}
            onClick={() => handleGroupChange(i)}
            style={{
              padding: '0.5rem 1rem',
              background: group === i ? '#7b1fa2' : '#f5f5f5',
              color: group === i ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '1rem' }}>
        {currentGroup.commands.map((c, i) => (
          <button
            key={i}
            onClick={() => setActiveCmd(i)}
            style={{
              padding: '0.4rem 0.75rem',
              background: (Math.min(activeCmd, currentGroup.commands.length - 1)) === i ? '#7b1fa2' : '#f8f9fa',
              color: (Math.min(activeCmd, currentGroup.commands.length - 1)) === i ? 'white' : '#333',
              border: '1px solid #eee',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '0.85rem',
            }}
          >
            <code>{c.desc}</code>
          </button>
        ))}
      </div>

      <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>
          {`$ ${currentCmd.cmd}`}
        </pre>
        <pre style={{ background: '#263238', color: '#ce93d8', padding: '0.75rem', borderRadius: '4px', fontSize: '0.8rem', margin: 0, whiteSpace: 'pre-wrap' }}>
          {currentCmd.output}
        </pre>
      </div>

      <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <div style={{ padding: '0.75rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <strong style={{ fontSize: '0.85rem' }}>stop vs down</strong>
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            <code>stop</code> -- останавливает, сохраняет контейнеры<br />
            <code>down</code> -- удаляет контейнеры и сети
          </div>
        </div>
        <div style={{ padding: '0.75rem', background: '#fce4ec', borderRadius: '8px' }}>
          <strong style={{ fontSize: '0.85rem' }}>⚠️ down -v</strong>
          <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
            Удаляет <strong>тома</strong> с данными!<br />
            БД будет потеряна безвозвратно.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#fff3e0', borderRadius: '8px', fontSize: '0.85rem' }}>
        <strong>Типичный рабочий цикл:</strong>
        <pre style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem', margin: '0.5rem 0 0 0', whiteSpace: 'pre-wrap' }}>
{`docker compose up -d          # Запустить
docker compose logs -f api     # Смотреть логи
# ... работаем, меняем код ...
docker compose up -d --build   # Пересобрать и перезапустить
docker compose down            # Закончили работу`}
        </pre>
      </div>
    </div>
  )
}
