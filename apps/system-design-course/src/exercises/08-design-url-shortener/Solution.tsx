import { useState } from 'react'

// ============================================
// Задание 8.1: Справочная карточка — URL Shortener
// ============================================

export function Task8_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>URL Shortener — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Алгоритмы генерации</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Hash + Collision Check</strong> — MD5/SHA256 от URL, берём 7 символов. Один URL = один код, но нужна проверка коллизий.
            <br /><br />
            <strong>Counter-Based</strong> — атомарный счётчик (Redis INCR) → base62. Нет коллизий, но предсказуемые URL.
            <br /><br />
            <strong>Pre-Generated</strong> — KGS заранее генерирует коды в пул. Быстро, нет конфликтов.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Base62 Encoding</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Алфавит: <code>a-z A-Z 0-9</code> = 62 символа
            <br /><br />
            <strong>7 символов</strong> → 62<sup>7</sup> = 3.5 трлн комбинаций
            <br /><br />
            При 1M ссылок/день → хватит на ~9500 лет
            <br /><br />
            <strong>6 символов</strong> → 56.8 млрд (тоже достаточно для большинства)
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>301 vs 302 Redirect</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>301 Permanent</strong> — браузер кэширует, повторные клики не доходят до сервера. Быстро, но теряем аналитику.
            <br /><br />
            <strong>302 Temporary</strong> — браузер каждый раз спрашивает сервер. Медленнее, но точная аналитика.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Capacity Estimation</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>1M URL/день</strong> → 12 write QPS
            <br />
            <strong>Read:Write = 100:1</strong> → 1200 read QPS
            <br />
            <strong>Peak</strong> → ~3600 read QPS
            <br />
            <strong>5 лет</strong> → 1.8 млрд записей, ~900 GB
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Кэширование</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Система <strong>read-heavy</strong> (100:1) → кэш критически важен.
            <br /><br />
            <strong>80/20 правило</strong>: 20% ссылок = 80% трафика. Кэшируем горячие ссылки в Redis.
            <br /><br />
            TTL кэша: 24 часа. Hit ratio: 95%+.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Аналитика</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Асинхронная</strong> — не блокировать redirect!
            <br /><br />
            Kafka → отдельный pipeline → click_events таблица.
            <br /><br />
            Данные: IP, User-Agent, Referer, timestamp, geo.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 8.2: Архитектурный конструктор
// ============================================

interface ArchComponent {
  id: string
  name: string
  description: string
  required: boolean
  category: 'core' | 'scaling' | 'optional'
}

const ALL_COMPONENTS: ArchComponent[] = [
  { id: 'client', name: 'Client (Browser/App)', description: 'Браузер или мобильное приложение пользователя', required: true, category: 'core' },
  { id: 'lb', name: 'Load Balancer', description: 'Распределяет запросы между API-серверами', required: true, category: 'scaling' },
  { id: 'api', name: 'API Server', description: 'Обрабатывает HTTP-запросы (создание ссылки, redirect)', required: true, category: 'core' },
  { id: 'cache', name: 'Cache (Redis)', description: 'Кэш горячих ссылок для быстрого redirect', required: true, category: 'core' },
  { id: 'db', name: 'Database (SQL)', description: 'Хранит маппинг shortCode → longUrl', required: true, category: 'core' },
  { id: 'kgs', name: 'Key Generation Service', description: 'Генерирует уникальные короткие коды', required: true, category: 'core' },
  { id: 'analytics', name: 'Analytics Service', description: 'Считает клики, собирает статистику переходов', required: false, category: 'optional' },
  { id: 'cdn', name: 'CDN', description: 'Раздаёт статику (фронтенд-интерфейс)', required: false, category: 'optional' },
  { id: 'kafka', name: 'Message Queue (Kafka)', description: 'Асинхронная обработка событий (клики, аналитика)', required: false, category: 'optional' },
  { id: 'elastic', name: 'Full-Text Search (Elasticsearch)', description: 'Полнотекстовый поиск по URL', required: false, category: 'optional' },
]

const REQUIRED_IDS = ALL_COMPONENTS.filter(c => c.required).map(c => c.id)

export function Task8_2_Solution() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [checked, setChecked] = useState(false)

  const toggle = (id: string) => {
    setChecked(false)
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const missingRequired = REQUIRED_IDS.filter(id => !selected.has(id))
  const extraOptional = [...selected].filter(id => {
    const comp = ALL_COMPONENTS.find(c => c.id === id)
    return comp && !comp.required
  })
  const isComplete = missingRequired.length === 0

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'core': return '#e3f2fd'
      case 'scaling': return '#e8f5e9'
      case 'optional': return '#fff3e0'
      default: return '#f5f5f5'
    }
  }

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'core': return 'Ядро'
      case 'scaling': return 'Масштабирование'
      case 'optional': return 'Опционально'
      default: return ''
    }
  }

  const buildArchText = () => {
    const lines: string[] = []
    lines.push('=== Архитектура URL Shortener ===')
    lines.push('')

    if (selected.has('client')) lines.push('[Client]')
    if (selected.has('cdn')) lines.push('  |→ [CDN] (статика)')
    if (selected.has('lb')) lines.push('  |→ [Load Balancer]')
    if (selected.has('api')) lines.push('     |→ [API Server] (stateless, N инстансов)')
    if (selected.has('kgs')) lines.push('        |→ [Key Generation Service]')
    if (selected.has('cache')) lines.push('        |→ [Redis Cache] (горячие ссылки)')
    if (selected.has('db')) lines.push('        |→ [Database] (url_mappings)')
    if (selected.has('kafka')) lines.push('        |→ [Kafka] (события кликов)')
    if (selected.has('analytics')) lines.push('           |→ [Analytics Service]')
    if (selected.has('elastic')) lines.push('        |→ [Elasticsearch] (поиск)')

    return lines.join('\n')
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Архитектурный конструктор: URL Shortener</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Отметьте компоненты, необходимые для работающего URL Shortener. Затем нажмите «Проверить».
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
        {ALL_COMPONENTS.map(comp => (
          <label
            key={comp.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              padding: '0.75rem',
              background: getCategoryColor(comp.category),
              borderRadius: '8px',
              cursor: 'pointer',
              border: checked
                ? selected.has(comp.id)
                  ? comp.required
                    ? '2px solid #4caf50'
                    : '2px solid #ff9800'
                  : comp.required
                    ? '2px solid #f44336'
                    : '2px solid transparent'
                : '2px solid transparent',
            }}
          >
            <input
              type="checkbox"
              checked={selected.has(comp.id)}
              onChange={() => toggle(comp.id)}
              style={{ marginTop: '2px' }}
            />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                {comp.name}
                <span style={{
                  fontSize: '0.7rem',
                  marginLeft: '0.5rem',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  background: 'rgba(0,0,0,0.1)',
                }}>
                  {getCategoryLabel(comp.category)}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#555' }}>{comp.description}</div>
            </div>
          </label>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setChecked(true)}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Проверить
        </button>
        <button
          onClick={() => { setSelected(new Set()); setChecked(false) }}
          style={{
            padding: '0.5rem 1.5rem',
            background: '#757575',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>
      </div>

      {checked && (
        <div style={{ marginBottom: '1rem' }}>
          {isComplete ? (
            <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #4caf50' }}>
              <strong style={{ color: '#2e7d32' }}>Все критические компоненты на месте!</strong>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                Выбрано {selected.size} из {ALL_COMPONENTS.length} компонентов.
                {extraOptional.length > 0 && (
                  <> Опциональные: {extraOptional.map(id => ALL_COMPONENTS.find(c => c.id === id)?.name).join(', ')}.</>
                )}
              </p>
            </div>
          ) : (
            <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', border: '1px solid #f44336' }}>
              <strong style={{ color: '#c62828' }}>Не хватает критических компонентов:</strong>
              <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem' }}>
                {missingRequired.map(id => {
                  const comp = ALL_COMPONENTS.find(c => c.id === id)
                  return (
                    <li key={id} style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      <strong>{comp?.name}</strong> — {comp?.description}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {selected.size > 0 && (
        <div style={{ padding: '1rem', background: '#263238', color: '#e0e0e0', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem' }}>
          <div style={{ color: '#78909c', marginBottom: '0.5rem' }}>// Текстовая схема архитектуры</div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{buildArchText()}</pre>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 8.3: Полный System Design — URL Shortener
// ============================================

interface DesignSection {
  id: string
  title: string
  content: string
}

const DESIGN_SECTIONS: DesignSection[] = [
  {
    id: 'requirements',
    title: '1. Requirements',
    content: `Functional:
  - Создание короткой ссылки по длинному URL
  - Redirect по короткой ссылке на оригинальный URL
  - Custom alias (опционально)
  - Link expiration (TTL)
  - Аналитика (количество кликов)

Non-Functional:
  - Высокая доступность (99.9%+)
  - Низкая задержка redirect (< 100 мс)
  - Масштаб: 100M+ ссылок, 10K+ redirect/сек
  - Read-heavy: соотношение чтение:запись = 100:1
  - Данные не теряются (durability)`,
  },
  {
    id: 'capacity',
    title: '2. Capacity Estimation',
    content: `Исходные данные:
  - 1M новых URL/день
  - Read:Write = 100:1
  - Хранение 5 лет

QPS:
  - Write: 1M / 86400 ≈ 12 QPS
  - Read: 12 × 100 = 1200 QPS (средний)
  - Peak Read: 1200 × 3 = 3600 QPS

Storage (5 лет):
  - Всего записей: 1M × 365 × 5 = 1.8 млрд
  - Средний размер записи: ~500 байт
  - Итого: 1.8B × 500 = ~900 GB

Short Code:
  - Base62, 7 символов → 62^7 = 3.5 трлн комбинаций
  - При 1M/день хватит на ~9500 лет

Cache:
  - 20% горячих ссылок × 500 байт × 1.8B × 0.2 = ~180 GB Redis
  - Или кэшируем только последние 24ч: 100M × 500 = ~50 GB`,
  },
  {
    id: 'api',
    title: '3. API Design',
    content: `POST /api/shorten
  Body: { longUrl, customAlias?, expiresAt? }
  Response: { shortUrl, shortCode, expiresAt }
  Auth: optional (анонимные ссылки разрешены)

GET /:shortCode
  Response: 302 Redirect → Location: longUrl
  (или 301, если аналитика не нужна)
  Если ссылка не найдена: 404
  Если ссылка протухла: 410 Gone

DELETE /api/urls/:shortCode
  Auth: required (только владелец)
  Response: 204 No Content

GET /api/urls/:shortCode/stats
  Auth: required
  Response: { totalClicks, clicksByDay, topCountries, topDevices }`,
  },
  {
    id: 'datamodel',
    title: '4. Data Model',
    content: `Таблица url_mappings:
  - short_code VARCHAR(7) PRIMARY KEY
  - long_url TEXT NOT NULL
  - user_id VARCHAR(36) (nullable, FK)
  - created_at TIMESTAMP
  - expires_at TIMESTAMP (nullable)
  - click_count BIGINT DEFAULT 0

Таблица click_events:
  - id UUID PRIMARY KEY
  - short_code VARCHAR(7) (FK, indexed)
  - clicked_at TIMESTAMP (indexed)
  - ip VARCHAR(45)
  - user_agent TEXT
  - referer TEXT
  - country VARCHAR(2)

Индексы:
  - url_mappings: PRIMARY KEY (short_code)
  - url_mappings: INDEX (expires_at) WHERE expires_at IS NOT NULL
  - click_events: INDEX (short_code, clicked_at)

Выбор SQL (PostgreSQL):
  - ACID для маппингов (один shortCode = один longUrl)
  - Индексы для быстрого lookup по short_code
  - Шардирование по short_code (consistent hashing)`,
  },
  {
    id: 'algorithm',
    title: '5. Algorithm (Key Generation)',
    content: `Рекомендация: Counter-Based + Range Allocation

Как работает:
  1. ZooKeeper/etcd выделяет диапазоны каждому серверу
     Server A: [1 .. 1_000_000]
     Server B: [1_000_001 .. 2_000_000]
  2. Сервер берёт следующее число из своего диапазона (in-memory, без сети)
  3. Конвертирует в base62: 1000000 → "eUNE"
  4. Когда диапазон заканчивается → запрашивает новый у ZooKeeper

Плюсы:
  - Нет коллизий (гарантированная уникальность)
  - Нет сетевых вызовов на каждый URL (только при выделении диапазона)
  - Горизонтально масштабируется

Минусы:
  - Предсказуемые URL (можно подобрать)
  - При перезапуске сервера — потеря части диапазона

Альтернатива: Pre-Generated Keys
  - KGS заранее генерирует случайные коды в таблицу unused_keys
  - Сервер атомарно забирает код: DELETE FROM unused_keys LIMIT 1 RETURNING code
  - Непредсказуемые URL, но нужен отдельный сервис`,
  },
  {
    id: 'architecture',
    title: '6. Architecture',
    content: `Компоненты:
  [Client] → [Load Balancer] → [API Server ×N]
                                  ├→ [Redis Cache]
                                  ├→ [PostgreSQL] (sharded)
                                  ├→ [Key Range / ZooKeeper]
                                  └→ [Kafka] → [Analytics Worker] → [ClickHouse]

Write Path (создание):
  1. Client → POST /api/shorten { longUrl }
  2. LB → API Server
  3. API Server берёт следующий ID из своего диапазона
  4. Конвертирует в base62 → shortCode
  5. Сохраняет в PostgreSQL: INSERT INTO url_mappings
  6. Кладёт в Redis Cache: SET url:shortCode longUrl
  7. Возвращает: { shortUrl: "short.ly/abc123" }

Read Path (redirect):
  1. Client → GET /abc123
  2. LB → API Server
  3. Redis GET url:abc123
     - HIT → 302 Redirect
     - MISS → PostgreSQL SELECT → Redis SET → 302 Redirect
  4. Асинхронно: Kafka produce(click_event)

Отказоустойчивость:
  - API Server упал → LB перенаправляет на другие
  - Redis недоступен → fallback на PostgreSQL (медленнее)
  - PostgreSQL replica down → переключение на standby`,
  },
  {
    id: 'scaling',
    title: '7. Scaling & Optimizations',
    content: `API Servers:
  - Stateless → горизонтальное масштабирование
  - Auto-scaling по CPU/QPS
  - За Load Balancer (Round Robin или Least Connections)

Database:
  - Шардирование по hash(short_code) % N
  - Read replicas для аналитических запросов
  - Partitioning по created_at для архивных данных

Cache (Redis):
  - Redis Cluster (автоматический шардинг)
  - ~50-180 GB для горячих ссылок
  - TTL = 24 часа, LRU eviction
  - Ожидаемый hit ratio: 95%+

Analytics:
  - Kafka для буферизации click events
  - ClickHouse для агрегации (быстрые аналитические запросы)
  - Batch processing: агрегация за час/день

Link Expiration:
  - Cron job каждые 5 минут: DELETE WHERE expires_at < NOW()
  - Lazy check при redirect: если протухла → 410 Gone
  - Инвалидация кэша при cleanup

Geo-distribution:
  - DNS-based routing → ближайший дата-центр
  - Multi-region PostgreSQL (CockroachDB / Spanner)
  - Redis в каждом регионе`,
  },
]

export function Task8_3_Solution() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [expandAll, setExpandAll] = useState(false)

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (expandAll) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(DESIGN_SECTIONS.map(s => s.id)))
    }
    setExpandAll(!expandAll)
  }

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'requirements': return '📋'
      case 'capacity': return '🧮'
      case 'api': return '🔌'
      case 'datamodel': return '💾'
      case 'algorithm': return '🔑'
      case 'architecture': return '🏗️'
      case 'scaling': return '📈'
      default: return '📌'
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный System Design: URL Shortener</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Эталонное решение. Раскройте каждую секцию, чтобы увидеть детали. Сравните со своим дизайном.
      </p>

      <button
        onClick={toggleAll}
        style={{
          padding: '0.4rem 1rem',
          marginBottom: '1rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {expandAll ? 'Свернуть все' : 'Развернуть все'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {DESIGN_SECTIONS.map(section => {
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isOpen ? '#e3f2fd' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>
                  ▶
                </span>
                <span>{getSectionIcon(section.id)}</span>
                <span>{section.title}</span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '1rem',
                  background: '#fafafa',
                  borderTop: '1px solid #e0e0e0',
                }}>
                  <pre style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: '#333',
                  }}>
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Чеклист интервью:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          1. Requirements (2 мин) → 2. Capacity Estimation (3 мин) → 3. API Design (3 мин)
          <br />
          4. Data Model (3 мин) → 5. Algorithm (5 мин) → 6. Architecture (5 мин)
          <br />
          7. Scaling (5 мин) → 8. Вопросы интервьюера (5-10 мин)
          <br /><br />
          Итого: ~30-35 минут. Оставьте время на вопросы!
        </div>
      </div>
    </div>
  )
}
