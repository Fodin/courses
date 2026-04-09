import { useState } from 'react'

// ============================================
// Задание 6.1: Сравнение стратегий версионирования
// ============================================

type VersionStrategy = 'url' | 'header' | 'query'

interface StrategyInfo {
  id: VersionStrategy
  title: string
  badge: string
  color: string
  example: string
  request: string
  pros: string[]
  cons: string[]
  usedBy: { name: string; detail: string }[]
}

const STRATEGIES: StrategyInfo[] = [
  {
    id: 'url',
    title: 'URL versioning',
    badge: '/v1/users',
    color: '#3b82f6',
    example: 'GET /api/v1/users\nGET /api/v2/users',
    request:
      'GET /api/v2/users HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer token',
    pros: [
      'Очевидно и просто — версия видна в URL',
      'Легко тестировать через браузер или curl',
      'Можно кешировать на CDN по пути',
      'Разные версии могут жить на разных серверах',
    ],
    cons: [
      'Загрязняет URL — нарушает принцип "один ресурс — один URL"',
      'При росте версий URL становятся длинными',
      'Клиенты вынуждены обновлять все ссылки',
    ],
    usedBy: [
      { name: 'GitHub REST API', detail: 'api.github.com/v3/' },
      { name: 'Twitter API', detail: 'api.twitter.com/2/' },
      { name: 'Stripe (старый)', detail: 'api.stripe.com/v1/' },
    ],
  },
  {
    id: 'header',
    title: 'Header versioning',
    badge: 'Accept: vnd.v1',
    color: '#8b5cf6',
    example:
      'Accept: application/vnd.api.v1+json\nAccept: application/vnd.api.v2+json',
    request:
      'GET /api/users HTTP/1.1\nHost: api.example.com\nAccept: application/vnd.myapi.v2+json\nAuthorization: Bearer token',
    pros: [
      'Чистые URL — ресурс один, версия в метаданных',
      'Соответствует HTTP-спецификации (Content Negotiation)',
      'Легко поддерживать несколько версий параллельно',
    ],
    cons: [
      'Нельзя открыть в браузере напрямую',
      'Сложнее тестировать без специальных инструментов',
      'Разработчики часто забывают про заголовок',
      'Кеширование сложнее — нужен Vary: Accept',
    ],
    usedBy: [
      { name: 'GitHub (новый)', detail: 'X-GitHub-Api-Version: 2022-11-28' },
      { name: 'Microsoft Graph', detail: 'api-version header' },
      { name: 'PayPal', detail: 'PayPal-Request-Id header' },
    ],
  },
  {
    id: 'query',
    title: 'Query param versioning',
    badge: '?version=1',
    color: '#10b981',
    example: 'GET /api/users?version=1\nGET /api/users?version=2',
    request:
      'GET /api/users?version=2&page=1 HTTP/1.1\nHost: api.example.com\nAuthorization: Bearer token',
    pros: [
      'Компромисс — видно в URL, но не меняет путь',
      'Легко тестировать через браузер',
      'Старые клиенты без параметра получают дефолтную версию',
    ],
    cons: [
      'Версия смешивается с параметрами запроса',
      'Менее очевидно при первом взгляде на URL',
      'Некоторые прокси игнорируют query при кешировании',
    ],
    usedBy: [
      { name: 'AWS APIs', detail: 'Action=...&Version=2012-01-01' },
      { name: 'Google Maps (legacy)', detail: '?v=3.exp' },
      { name: 'Salesforce', detail: '?version=56.0' },
    ],
  },
]

export function Task6_1_Solution() {
  const [active, setActive] = useState<VersionStrategy>('url')
  const [expanded, setExpanded] = useState<'pros' | 'cons' | 'used' | null>('pros')

  const strategy = STRATEGIES.find(s => s.id === active)!

  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    maxWidth: '860px',
    fontFamily: 'system-ui, sans-serif',
  }

  const tabBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  }

  const tabStyle = (id: VersionStrategy): React.CSSProperties => ({
    flex: 1,
    padding: '0.75rem 1rem',
    border: `2px solid ${active === id ? STRATEGIES.find(s => s.id === id)!.color : '#e2e8f0'}`,
    borderRadius: '8px',
    background: active === id ? STRATEGIES.find(s => s.id === id)!.color : '#fff',
    color: active === id ? '#fff' : '#374151',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    transition: 'all 0.2s',
    textAlign: 'center',
  })

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    border: `2px solid ${strategy.color}`,
    borderRadius: '12px',
    overflow: 'hidden',
  }

  const headerStyle: React.CSSProperties = {
    background: strategy.color,
    color: '#fff',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const codeStyle: React.CSSProperties = {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '1rem 1.5rem',
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    whiteSpace: 'pre',
    lineHeight: 1.6,
    borderBottom: '1px solid #334155',
  }

  const accordionHeaderStyle = (open: boolean): React.CSSProperties => ({
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '0.875rem',
    display: 'flex',
    justifyContent: 'space-between',
    background: open ? '#f8fafc' : '#fff',
    borderBottom: '1px solid #e2e8f0',
    userSelect: 'none',
  })

  const listStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem 1rem',
    margin: 0,
    listStyle: 'none',
    borderBottom: '1px solid #e2e8f0',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginBottom: '0.5rem' }}>Стратегии версионирования API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Выберите стратегию, чтобы увидеть пример запроса, плюсы, минусы и кто её использует.
      </p>

      <div style={tabBarStyle}>
        {STRATEGIES.map(s => (
          <button key={s.id} style={tabStyle(s.id)} onClick={() => setActive(s.id)}>
            <div style={{ fontSize: '0.75rem', fontWeight: 400, marginBottom: '2px', opacity: 0.9 }}>
              {s.title}
            </div>
            <code style={{ fontSize: '0.8rem' }}>{s.badge}</code>
          </button>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{strategy.title}</span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>Пример HTTP-запроса</span>
        </div>

        <div style={codeStyle}>{strategy.request}</div>

        {/* Pros */}
        <div>
          <div
            style={accordionHeaderStyle(expanded === 'pros')}
            onClick={() => setExpanded(expanded === 'pros' ? null : 'pros')}
          >
            <span>✅ Преимущества</span>
            <span>{expanded === 'pros' ? '▲' : '▼'}</span>
          </div>
          {expanded === 'pros' && (
            <ul style={listStyle}>
              {strategy.pros.map((p, i) => (
                <li key={i} style={{ padding: '0.3rem 0', color: '#166534', fontSize: '0.875rem' }}>
                  + {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Cons */}
        <div>
          <div
            style={accordionHeaderStyle(expanded === 'cons')}
            onClick={() => setExpanded(expanded === 'cons' ? null : 'cons')}
          >
            <span>❌ Недостатки</span>
            <span>{expanded === 'cons' ? '▲' : '▼'}</span>
          </div>
          {expanded === 'cons' && (
            <ul style={listStyle}>
              {strategy.cons.map((c, i) => (
                <li key={i} style={{ padding: '0.3rem 0', color: '#7f1d1d', fontSize: '0.875rem' }}>
                  - {c}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Used by */}
        <div>
          <div
            style={accordionHeaderStyle(expanded === 'used')}
            onClick={() => setExpanded(expanded === 'used' ? null : 'used')}
          >
            <span>🏢 Кто использует</span>
            <span>{expanded === 'used' ? '▲' : '▼'}</span>
          </div>
          {expanded === 'used' && (
            <ul style={{ ...listStyle, borderBottom: 'none' }}>
              {strategy.usedBy.map((u, i) => (
                <li
                  key={i}
                  style={{
                    padding: '0.4rem 0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '0.875rem',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{u.name}</span>
                  <code style={{ color: '#64748b', fontSize: '0.8rem' }}>{u.detail}</code>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#713f12',
        }}
      >
        💡 Совет: нет единственно правильной стратегии. URL versioning проще для публичных API,
        Header versioning чище с точки зрения REST, Query — хороший компромисс для внутренних
        сервисов.
      </div>
    </div>
  )
}

// ============================================
// Задание 6.2: Timeline миграции API-версии
// ============================================

interface TimelineEvent {
  id: string
  label: string
  description: string
  header?: string
  headerValue?: string
  color: string
  icon: string
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'v2-release',
    label: 'Релиз v2',
    description: 'Выпускаем новую версию API. Обе версии работают параллельно.',
    header: 'X-API-Version',
    headerValue: '2.0',
    color: '#10b981',
    icon: '🚀',
  },
  {
    id: 'deprecation',
    label: 'Deprecation Notice',
    description:
      'Объявляем об устаревании v1. Все ответы v1 начинают содержать заголовок Deprecation.',
    header: 'Deprecation',
    headerValue: 'Tue, 01 Jan 2025 00:00:00 GMT',
    color: '#f59e0b',
    icon: '⚠️',
  },
  {
    id: 'sunset',
    label: 'Sunset Date',
    description:
      'Устанавливаем дату отключения. Заголовок Sunset предупреждает клиентов о дате окончания поддержки.',
    header: 'Sunset',
    headerValue: 'Tue, 01 Jul 2025 00:00:00 GMT',
    color: '#f97316',
    icon: '🌅',
  },
  {
    id: 'migration-guide',
    label: 'Migration Guide',
    description:
      'Публикуем руководство по миграции. Заголовок Link указывает на документацию.',
    header: 'Link',
    headerValue: '<https://api.example.com/migration>; rel="successor-version"',
    color: '#3b82f6',
    icon: '📖',
  },
  {
    id: 'removal',
    label: 'Удаление v1',
    description:
      'v1 отключён. Запросы к /v1/ возвращают 410 Gone. Миграция завершена.',
    header: undefined,
    headerValue: 'HTTP/1.1 410 Gone',
    color: '#ef4444',
    icon: '🗑️',
  },
]

export function Task6_2_Solution() {
  const [activeStep, setActiveStep] = useState(0)
  const [showHeaders, setShowHeaders] = useState(true)

  const event = TIMELINE_EVENTS[activeStep]

  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    maxWidth: '860px',
    fontFamily: 'system-ui, sans-serif',
  }

  const timelineStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '2rem',
    position: 'relative',
  }

  const lineStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    right: '20px',
    height: '2px',
    background: '#e2e8f0',
    zIndex: 0,
  }

  const progressStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    width: `${(activeStep / (TIMELINE_EVENTS.length - 1)) * (100 - (40 / 860) * 100)}%`,
    height: '2px',
    background: event.color,
    zIndex: 1,
    transition: 'width 0.4s ease, background 0.4s ease',
  }

  const stepStyle = (i: number): React.CSSProperties => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    zIndex: 2,
    cursor: 'pointer',
  })

  const dotStyle = (i: number): React.CSSProperties => ({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: i <= activeStep ? TIMELINE_EVENTS[i].color : '#e2e8f0',
    border: `3px solid ${i === activeStep ? TIMELINE_EVENTS[i].color : '#fff'}`,
    boxShadow: i === activeStep ? `0 0 0 3px ${TIMELINE_EVENTS[i].color}40` : 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
  })

  const labelStyle = (i: number): React.CSSProperties => ({
    fontSize: '0.7rem',
    fontWeight: i === activeStep ? 700 : 400,
    color: i === activeStep ? TIMELINE_EVENTS[i].color : '#94a3b8',
    textAlign: 'center',
    lineHeight: 1.3,
    maxWidth: '70px',
  })

  const infoCardStyle: React.CSSProperties = {
    border: `2px solid ${event.color}`,
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '1rem',
  }

  const infoHeaderStyle: React.CSSProperties = {
    background: event.color,
    color: '#fff',
    padding: '0.75rem 1.5rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  }

  const codeBlockStyle: React.CSSProperties = {
    background: '#1e293b',
    color: '#e2e8f0',
    padding: '1rem 1.5rem',
    fontFamily: 'monospace',
    fontSize: '0.85rem',
    lineHeight: 1.6,
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginBottom: '0.5rem' }}>Timeline миграции API-версии</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Пройдите путь от релиза v2 до удаления v1. Нажимайте на шаги или используйте кнопки.
      </p>

      {/* Timeline */}
      <div style={timelineStyle}>
        <div style={lineStyle} />
        <div style={progressStyle} />
        {TIMELINE_EVENTS.map((e, i) => (
          <div key={e.id} style={stepStyle(i)} onClick={() => setActiveStep(i)}>
            <div style={dotStyle(i)}>{i <= activeStep ? e.icon : '○'}</div>
            <div style={labelStyle(i)}>{e.label}</div>
          </div>
        ))}
      </div>

      {/* Info card */}
      <div style={infoCardStyle}>
        <div style={infoHeaderStyle}>
          <span>{event.icon}</span>
          <span>Шаг {activeStep + 1}: {event.label}</span>
        </div>
        <div style={{ padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>{event.description}</p>
        </div>
        {event.headerValue && (
          <div>
            <div
              style={{
                padding: '0.5rem 1.5rem',
                background: '#f1f5f9',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>
                HTTP-заголовок ответа
              </span>
              <button
                onClick={() => setShowHeaders(h => !h)}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '4px',
                  background: '#fff',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                {showHeaders ? 'Скрыть' : 'Показать'}
              </button>
            </div>
            {showHeaders && (
              <div style={codeBlockStyle}>
                {event.header ? (
                  <>
                    <span style={{ color: '#93c5fd' }}>{event.header}</span>
                    <span style={{ color: '#94a3b8' }}>: </span>
                    <span style={{ color: '#86efac' }}>{event.headerValue}</span>
                  </>
                ) : (
                  <span style={{ color: '#f87171' }}>{event.headerValue}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* RFC note */}
      <div
        style={{
          padding: '0.75rem 1rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          fontSize: '0.8rem',
          color: '#1e40af',
          marginBottom: '1rem',
        }}
      >
        📌 Заголовки <code>Deprecation</code> и <code>Sunset</code> стандартизированы в{' '}
        <strong>RFC 8594</strong>. Заголовок <code>Link</code> с <code>rel="successor-version"</code>{' '}
        указывает на новую версию.
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={() => setActiveStep(s => Math.max(0, s - 1))}
          disabled={activeStep === 0}
          style={{
            padding: '0.6rem 1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#fff',
            cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
            opacity: activeStep === 0 ? 0.4 : 1,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          ← Назад
        </button>
        <button
          onClick={() => setActiveStep(s => Math.min(TIMELINE_EVENTS.length - 1, s + 1))}
          disabled={activeStep === TIMELINE_EVENTS.length - 1}
          style={{
            padding: '0.6rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: event.color,
            color: '#fff',
            cursor: activeStep === TIMELINE_EVENTS.length - 1 ? 'not-allowed' : 'pointer',
            opacity: activeStep === TIMELINE_EVENTS.length - 1 ? 0.4 : 1,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Вперёд →
        </button>
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Выбор стратегии версионирования
// ============================================

interface Scenario {
  id: string
  title: string
  description: string
  tags: string[]
  options: {
    id: VersionStrategy
    label: string
  }[]
  correct: VersionStrategy
  rationale: string
  warning?: string
}

const SCENARIOS: Scenario[] = [
  {
    id: 'public-api',
    title: 'Публичный API с тысячами клиентов',
    description:
      'Вы разрабатываете публичный API для маркетплейса. У вас уже 5 000 зарегистрированных разработчиков. Интеграции написаны на разных языках — Python, JS, Java, PHP. Нужно выпустить v2 с breaking changes.',
    tags: ['Публичный API', '5000+ клиентов', 'Разные SDK'],
    options: [
      { id: 'url', label: 'URL versioning (/v2/)' },
      { id: 'header', label: 'Header versioning (Accept: vnd.v2)' },
      { id: 'query', label: 'Query param (?version=2)' },
    ],
    correct: 'url',
    rationale:
      'URL versioning — лучший выбор для публичного API. Версия очевидна в URL, легко тестировать без специальных инструментов, работает из любого HTTP-клиента. Разные языки не требуют особой настройки заголовков.',
    warning:
      'Header versioning технически чище, но при 5000+ клиентов простота важнее элегантности.',
  },
  {
    id: 'internal-microservice',
    title: 'Внутренний микросервис',
    description:
      'Вы пишете API для внутреннего сервиса нотификаций. Его потребляют только 3 других микросервиса вашей команды. Все они написаны на TypeScript и используют общий API-клиент.',
    tags: ['Внутренний', '3 клиента', 'Один язык'],
    options: [
      { id: 'url', label: 'URL versioning (/v2/)' },
      { id: 'header', label: 'Header versioning' },
      { id: 'query', label: 'Query param (?version=2)' },
    ],
    correct: 'header',
    rationale:
      'Для внутреннего сервиса с известными клиентами Header versioning — правильный выбор. Можно обновить общий API-клиент в одном месте. URL остаётся чистым. Тестировать можно через Postman/curl с заголовком.',
  },
  {
    id: 'mobile-app',
    title: 'Мобильное приложение',
    description:
      'У вас мобильное приложение (iOS + Android). Пользователи медленно обновляются — часть сидит на версии 2-летней давности. Нужно поддерживать несколько версий API долгое время.',
    tags: ['iOS/Android', 'Медленные обновления', 'Долгая поддержка'],
    options: [
      { id: 'url', label: 'URL versioning (/v2/)' },
      { id: 'header', label: 'Header versioning' },
      { id: 'query', label: 'Query param (?version=2)' },
    ],
    correct: 'url',
    rationale:
      'Для мобильных приложений URL versioning наиболее надёжен. Версия захардкожена в мобильном клиенте и хорошо видна в логах. Легко понять, какую версию использует старая сборка приложения при разборе инцидентов.',
  },
  {
    id: 'saas-platform',
    title: 'SaaS-платформа с тарифными планами',
    description:
      'Вы строите SaaS. Клиенты на разных тарифах могут иметь доступ к разным версиям API. Некоторые корпоративные клиенты хотят оставаться на стабильной версии. Нужна гибкость.',
    tags: ['SaaS', 'Тарифные планы', 'Корпоративные клиенты'],
    options: [
      { id: 'url', label: 'URL versioning (/v2/)' },
      { id: 'header', label: 'Header versioning' },
      { id: 'query', label: 'Query param (?version=2)' },
    ],
    correct: 'header',
    rationale:
      'Для SaaS с тарифами Header versioning даёт максимальную гибкость. Версию можно устанавливать в API-ключе или на уровне аккаунта. URL остаётся одним, но версия может меняться через заголовок в зависимости от тарифа клиента.',
    warning:
      'Stripe реализует это через заголовок Stripe-Version или через дату версии в настройках аккаунта.',
  },
]

export function Task6_3_Solution() {
  const [currentScenario, setCurrentScenario] = useState(0)
  const [selected, setSelected] = useState<Record<string, VersionStrategy>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const scenario = SCENARIOS[currentScenario]
  const userChoice = selected[scenario.id]
  const isRevealed = revealed[scenario.id]
  const isCorrect = userChoice === scenario.correct

  const containerStyle: React.CSSProperties = {
    padding: '1.5rem',
    maxWidth: '860px',
    fontFamily: 'system-ui, sans-serif',
  }

  const progressStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1.5rem',
  }

  const dotStyle = (i: number): React.CSSProperties => ({
    flex: 1,
    height: '4px',
    borderRadius: '2px',
    background:
      revealed[SCENARIOS[i].id]
        ? selected[SCENARIOS[i].id] === SCENARIOS[i].correct
          ? '#10b981'
          : '#ef4444'
        : i === currentScenario
          ? '#3b82f6'
          : '#e2e8f0',
  })

  const optionStyle = (id: VersionStrategy): React.CSSProperties => {
    let bg = '#fff'
    let border = '2px solid #e2e8f0'
    let color = '#374151'
    if (userChoice === id) {
      if (isRevealed) {
        if (id === scenario.correct) {
          bg = '#f0fdf4'
          border = '2px solid #10b981'
          color = '#166534'
        } else {
          bg = '#fef2f2'
          border = '2px solid #ef4444'
          color = '#7f1d1d'
        }
      } else {
        bg = '#eff6ff'
        border = '2px solid #3b82f6'
        color = '#1e40af'
      }
    } else if (isRevealed && id === scenario.correct) {
      bg = '#f0fdf4'
      border = '2px solid #10b981'
      color = '#166534'
    }
    return {
      padding: '0.75rem 1.25rem',
      border,
      borderRadius: '8px',
      background: bg,
      color,
      cursor: isRevealed ? 'default' : 'pointer',
      fontWeight: userChoice === id ? 600 : 400,
      fontSize: '0.9rem',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }
  }

  function handleSelect(id: VersionStrategy) {
    if (isRevealed) return
    setSelected(s => ({ ...s, [scenario.id]: id }))
  }

  function handleReveal() {
    if (!userChoice) return
    setRevealed(r => ({ ...r, [scenario.id]: true }))
  }

  const allAnswered = Object.keys(revealed).length === SCENARIOS.length
  const score = SCENARIOS.filter(s => selected[s.id] === s.correct).length

  return (
    <div className="exercise-container" style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <h2 style={{ margin: 0 }}>Выбор стратегии версионирования</h2>
        {allAnswered && (
          <div
            style={{
              padding: '0.4rem 1rem',
              background: score === SCENARIOS.length ? '#10b981' : '#f59e0b',
              color: '#fff',
              borderRadius: '20px',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            {score}/{SCENARIOS.length} верно
          </div>
        )}
      </div>
      <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Для каждого сценария выберите наиболее подходящую стратегию версионирования.
      </p>

      {/* Progress dots */}
      <div style={progressStyle}>
        {SCENARIOS.map((_, i) => (
          <div
            key={i}
            style={{ ...dotStyle(i), cursor: 'pointer' }}
            onClick={() => setCurrentScenario(i)}
          />
        ))}
      </div>

      {/* Scenario card */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        <div
          style={{
            background: '#f8fafc',
            padding: '1rem 1.5rem',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            {scenario.tags.map(tag => (
              <span
                key={tag}
                style={{
                  padding: '0.2rem 0.6rem',
                  background: '#e0e7ff',
                  color: '#3730a3',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>
            Сценарий {currentScenario + 1}: {scenario.title}
          </h3>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.875rem', lineHeight: 1.6 }}>
            {scenario.description}
          </p>
        </div>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {scenario.options.map(opt => (
            <button key={opt.id} style={optionStyle(opt.id)} onClick={() => handleSelect(opt.id)}>
              {isRevealed ? (
                opt.id === scenario.correct ? '✅' : userChoice === opt.id ? '❌' : '○'
              ) : userChoice === opt.id ? '●' : '○'}
              {opt.label}
            </button>
          ))}
        </div>

        {!isRevealed && (
          <div style={{ padding: '0 1.5rem 1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleReveal}
              disabled={!userChoice}
              style={{
                padding: '0.6rem 1.5rem',
                border: 'none',
                borderRadius: '8px',
                background: userChoice ? '#3b82f6' : '#e2e8f0',
                color: userChoice ? '#fff' : '#94a3b8',
                cursor: userChoice ? 'pointer' : 'not-allowed',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              Проверить
            </button>
          </div>
        )}

        {isRevealed && (
          <div
            style={{
              margin: '0 1.5rem 1.5rem',
              padding: '1rem',
              background: isCorrect ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${isCorrect ? '#86efac' : '#fca5a5'}`,
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: '0.5rem',
                color: isCorrect ? '#166534' : '#7f1d1d',
              }}
            >
              {isCorrect ? '✅ Правильно!' : '❌ Не совсем верно'}
            </div>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', color: '#374151', lineHeight: 1.6 }}>
              {scenario.rationale}
            </p>
            {scenario.warning && (
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#92400e', fontStyle: 'italic' }}>
                ⚠️ {scenario.warning}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between' }}>
        <button
          onClick={() => setCurrentScenario(s => Math.max(0, s - 1))}
          disabled={currentScenario === 0}
          style={{
            padding: '0.6rem 1.5rem',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#fff',
            cursor: currentScenario === 0 ? 'not-allowed' : 'pointer',
            opacity: currentScenario === 0 ? 0.4 : 1,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          ← Назад
        </button>
        <button
          onClick={() => setCurrentScenario(s => Math.min(SCENARIOS.length - 1, s + 1))}
          disabled={currentScenario === SCENARIOS.length - 1}
          style={{
            padding: '0.6rem 1.5rem',
            border: 'none',
            borderRadius: '8px',
            background: '#3b82f6',
            color: '#fff',
            cursor: currentScenario === SCENARIOS.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentScenario === SCENARIOS.length - 1 ? 0.4 : 1,
            fontWeight: 600,
            fontSize: '0.875rem',
          }}
        >
          Следующий →
        </button>
      </div>
    </div>
  )
}
