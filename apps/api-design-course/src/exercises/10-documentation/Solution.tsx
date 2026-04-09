import { useState } from 'react'

// ============================================
// Задание 10.1: Анатомия хорошей документации
// ============================================

interface DocCriteria {
  id: string
  title: string
  category: string
  importance: 'critical' | 'high' | 'medium'
  why: string
  bad: string
  good: string
  checked: boolean
}

const INITIAL_CRITERIA: DocCriteria[] = [
  {
    id: 'getting-started',
    title: 'Getting Started / Быстрый старт',
    category: 'Структура',
    importance: 'critical',
    why: 'Новый разработчик должен получить первый рабочий результат за 5 минут. Если этого нет — он уйдёт к конкуренту.',
    bad: '// Документация начинается прямо с reference\n// без объяснения с чего начать',
    good: '## Quickstart\n1. Установите SDK: npm install stripe\n2. Получите API-ключ в dashboard\n3. Сделайте первый запрос:\n   const charge = await stripe.charges.create({...})',
    checked: false,
  },
  {
    id: 'auth',
    title: 'Аутентификация и авторизация',
    category: 'Безопасность',
    importance: 'critical',
    why: 'Каждый endpoint требует понимания — как передать credentials, какие права нужны, что делать если токен истёк.',
    bad: '// Authorization: Bearer <token>\n// (как получить token — не указано)',
    good: '## Authentication\nAll requests require Bearer token.\n\nGet your token:\nPOST /auth/token\n{ "client_id": "...", "client_secret": "..." }\n\nRefresh: POST /auth/refresh',
    checked: false,
  },
  {
    id: 'endpoint-reference',
    title: 'Полный справочник endpoints',
    category: 'Reference',
    importance: 'critical',
    why: 'Разработчик должен найти любой endpoint, не изучая исходники. Каждый endpoint: метод, путь, параметры, тело, ответ.',
    bad: 'GET /users - returns users\nPOST /users - creates user',
    good: 'POST /users\nCreate a new user.\n\nRequest body:\n  name: string (required) — display name\n  email: string (required) — must be unique\n  role: "admin"|"user" (default: "user")\n\nReturns: User object (201 Created)',
    checked: false,
  },
  {
    id: 'request-examples',
    title: 'Примеры запросов (cURL + SDK)',
    category: 'Примеры',
    importance: 'critical',
    why: 'Разработчики копируют примеры. Пример на cURL работает в любой среде. Примеры на популярных языках ускоряют интеграцию.',
    bad: '// Нет примеров, только описание параметров',
    good: '// cURL:\ncurl -X POST https://api.example.com/users \\\n  -H "Authorization: Bearer tok_xxx" \\\n  -H "Content-Type: application/json" \\\n  -d \'{"name":"Alice","email":"alice@example.com"}\'\n\n// JavaScript:\nconst user = await api.users.create({\n  name: "Alice", email: "alice@example.com"\n})',
    checked: false,
  },
  {
    id: 'response-examples',
    title: 'Примеры ответов с реальными данными',
    category: 'Примеры',
    importance: 'high',
    why: 'Разработчик видит точную структуру JSON и понимает типы полей. Ответ с null значениями особенно важен.',
    bad: 'Returns: User object',
    good: '// 201 Created\n{\n  "id": "usr_1234",\n  "name": "Alice",\n  "email": "alice@example.com",\n  "role": "user",\n  "createdAt": "2024-01-15T10:30:00Z",\n  "updatedAt": "2024-01-15T10:30:00Z"\n}',
    checked: false,
  },
  {
    id: 'errors',
    title: 'Справочник кодов ошибок',
    category: 'Ошибки',
    importance: 'critical',
    why: 'Обработка ошибок — 30% работы при интеграции. Разработчик должен знать: какой код означает что, и как его обработать.',
    bad: '// Returns 400 if invalid\n// Returns 500 on error',
    good: 'Error codes:\n  400 validation_error — invalid field values\n    → Check the "errors" array in response body\n  401 unauthorized — missing/invalid token\n    → Refresh token via POST /auth/refresh\n  429 rate_limit_exceeded — too many requests\n    → Wait X-RateLimit-Reset seconds',
    checked: false,
  },
  {
    id: 'rate-limits',
    title: 'Rate limits и квоты',
    category: 'Ограничения',
    importance: 'high',
    why: 'Приложение, которое не знает про лимиты, упадёт в production. Разработчик должен заранее планировать архитектуру.',
    bad: '// Rate limiting is applied to all endpoints',
    good: 'Rate limits:\n  Free tier: 100 req/min per API key\n  Pro tier: 1000 req/min\n\nHeaders in every response:\n  X-RateLimit-Limit: 100\n  X-RateLimit-Remaining: 87\n  X-RateLimit-Reset: 1705315200',
    checked: false,
  },
  {
    id: 'pagination',
    title: 'Пагинация и фильтрация',
    category: 'Reference',
    importance: 'high',
    why: 'Большинство list-endpoint поддерживают пагинацию. Без документации разработчик не знает о cursor vs offset и получает неполные данные.',
    bad: 'GET /users?page=1&limit=10',
    good: 'Pagination (cursor-based):\nGET /users?cursor=cur_xyz&limit=20\n\nResponse includes:\n  "pagination": {\n    "cursor": "cur_abc",  // for next page\n    "hasMore": true,\n    "total": 1543\n  }',
    checked: false,
  },
  {
    id: 'changelog',
    title: 'Changelog и история версий',
    category: 'Версионирование',
    importance: 'medium',
    why: 'Интегратор должен знать, что изменилось между версиями. Breaking changes без changelog — катастрофа для production.',
    bad: '// No changelog available',
    good: '## Changelog\n### v2.3.0 (2024-01-15)\n- Added: bulk user creation endpoint\n- Changed: /users now returns cursor pagination\n\n### v2.2.0 (2024-01-01)\n⚠️ Breaking: removed deprecated `role_id` field',
    checked: false,
  },
  {
    id: 'sdk',
    title: 'SDK и библиотеки',
    category: 'SDK',
    importance: 'high',
    why: 'Официальные SDK убирают необходимость разбираться с HTTP-деталями. Ссылки на репозитории и примеры ускоряют старт.',
    bad: '// No SDK available. Use REST API directly.',
    good: '## SDKs\n- JavaScript/TypeScript: npm install @company/api\n- Python: pip install company-api\n- Go: go get github.com/company/api-go\n\nAll SDKs are open source:\nhttps://github.com/company/api-sdk-js',
    checked: false,
  },
  {
    id: 'sandbox',
    title: 'Песочница / тестовая среда',
    category: 'Инструменты',
    importance: 'high',
    why: 'Разработчик не должен использовать production для тестирования. Отдельные ключи, отдельный URL, предсказуемые данные.',
    bad: '// Test with your production API key',
    good: '## Sandbox Environment\nBase URL: https://sandbox.api.example.com\n\nTest API keys start with "test_"\nTest credit card: 4242 4242 4242 4242\n\nAll sandbox data is reset daily at 00:00 UTC',
    checked: false,
  },
  {
    id: 'interactive',
    title: 'Интерактивная песочница (Try it out)',
    category: 'Инструменты',
    importance: 'medium',
    why: 'Возможность выполнить запрос прямо в браузере без кода — огромный буст для DX. Разработчик видит живой ответ.',
    bad: '// Documentation is static text only',
    good: '// Swagger UI / Stoplight / Redoc с Try it out\n// Разработчик вводит параметры → видит cURL команду\n// → нажимает Execute → видит реальный ответ API\n// Ключ можно ввести прямо в UI',
    checked: false,
  },
]

const IMPORTANCE_COLORS = {
  critical: { bg: '#fee2e2', color: '#dc2626', label: 'Критично' },
  high: { bg: '#fef3c7', color: '#d97706', label: 'Важно' },
  medium: { bg: '#f0fdf4', color: '#16a34a', label: 'Полезно' },
}

export function Task10_1_Solution() {
  const [criteria, setCriteria] = useState<DocCriteria[]>(INITIAL_CRITERIA)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>('Все')

  const checked = criteria.filter((c) => c.checked).length
  const total = criteria.length
  const progress = Math.round((checked / total) * 100)

  const categories = ['Все', ...Array.from(new Set(criteria.map((c) => c.category)))]
  const filtered =
    filterCategory === 'Все' ? criteria : criteria.filter((c) => c.category === filterCategory)

  const toggle = (id: string) => {
    setCriteria((prev) => prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)))
  }

  const active = criteria.find((c) => c.id === activeId)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия хорошей документации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        12 критериев, которые отличают выдающуюся документацию от посредственной
      </p>

      {/* Progress bar */}
      <div
        style={{
          background: '#f1f5f9',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '0.5rem',
            fontSize: '0.85rem',
          }}
        >
          <span style={{ fontWeight: 600 }}>Чеклист документации</span>
          <span style={{ color: progress === 100 ? '#16a34a' : '#64748b' }}>
            {checked} / {total} критериев ({progress}%)
          </span>
        </div>
        <div style={{ background: '#e2e8f0', borderRadius: '4px', height: '8px' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: '4px',
              background: progress === 100 ? '#16a34a' : '#6366f1',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        {progress === 100 && (
          <p
            style={{ color: '#16a34a', fontSize: '0.85rem', marginTop: '0.5rem', marginBottom: 0 }}
          >
            Отличная документация — все критерии выполнены!
          </p>
        )}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              background: filterCategory === cat ? '#6366f1' : '#e2e8f0',
              color: filterCategory === cat ? 'white' : '#475569',
              fontWeight: filterCategory === cat ? 600 : 400,
              transition: 'all 0.2s',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Criteria list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map((c) => {
          const imp = IMPORTANCE_COLORS[c.importance]
          const isActive = activeId === c.id
          return (
            <div
              key={c.id}
              style={{
                border: `1px solid ${isActive ? '#6366f1' : '#e2e8f0'}`,
                borderRadius: '8px',
                overflow: 'hidden',
                transition: 'border-color 0.2s',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  background: c.checked ? '#f0fdf4' : 'white',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveId(isActive ? null : c.id)}
              >
                <input
                  type="checkbox"
                  checked={c.checked}
                  onChange={() => toggle(c.id)}
                  onClick={(e) => e.stopPropagation()}
                  style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                />
                <span
                  style={{
                    flex: 1,
                    fontWeight: 500,
                    textDecoration: c.checked ? 'line-through' : 'none',
                    color: c.checked ? '#94a3b8' : '#1e293b',
                    fontSize: '0.9rem',
                  }}
                >
                  {c.title}
                </span>
                <span
                  style={{
                    background: imp.bg,
                    color: imp.color,
                    fontSize: '0.7rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {imp.label}
                </span>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem', flexShrink: 0 }}>
                  {isActive ? '▲' : '▼'}
                </span>
              </div>

              {isActive && (
                <div style={{ padding: '1rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                  <p
                    style={{
                      background: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      borderRadius: '6px',
                      padding: '0.75rem',
                      fontSize: '0.85rem',
                      marginBottom: '1rem',
                      color: '#1e40af',
                    }}
                  >
                    Почему важно: {c.why}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#dc2626',
                          marginBottom: '0.4rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Плохо
                      </div>
                      <pre
                        style={{
                          background: '#1e293b',
                          color: '#fca5a5',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {c.bad}
                      </pre>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: '#16a34a',
                          marginBottom: '0.4rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        Хорошо
                      </div>
                      <pre
                        style={{
                          background: '#1e293b',
                          color: '#86efac',
                          padding: '0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {c.good}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {active === undefined && filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
          Нет критериев в этой категории
        </p>
      )}
    </div>
  )
}

// ============================================
// Задание 10.2: Сравнение инструментов
// ============================================

interface Tool {
  id: string
  name: string
  tagline: string
  color: string
  pros: string[]
  cons: string[]
  whenToUse: string
  config: string
  configLabel: string
  uiDescription: string
  uiFeatures: string[]
}

const TOOLS: Tool[] = [
  {
    id: 'swagger',
    name: 'Swagger UI',
    tagline: 'Интерактивная песочница из OpenAPI',
    color: '#85ea2d',
    pros: [
      'Try it out прямо в браузере',
      'Автогенерация из OpenAPI без настройки',
      'Бесплатно, open source',
      'Интеграция с любым бекендом',
      'Встроенная поддержка auth (Bearer, OAuth2)',
    ],
    cons: [
      'Устаревший дизайн (2013-era)',
      'Плохо читается как статическая документация',
      'Нет поддержки нескольких версий из коробки',
      'Ограниченная кастомизация стилей',
    ],
    whenToUse:
      'Внутренняя документация для команды, API с активными экспериментами, backend-to-backend интеграции, MVP-проекты',
    config: `// Express.js + swagger-ui-express
import swaggerUi from 'swagger-ui-express'
import swaggerDoc from './openapi.json'

app.use('/api-docs', swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, {
    swaggerOptions: {
      persistAuthorization: true,
      defaultModelsExpandDepth: 2,
    },
    customCss: '.swagger-ui .topbar { display: none }',
  })
)

// Теперь открой: http://localhost:3000/api-docs`,
    configLabel: 'Express.js setup',
    uiDescription: 'Классический тёмно-зелёный интерфейс с кнопкой "Try it out"',
    uiFeatures: [
      'Аккордеон по группам (tags)',
      'Форма для ввода параметров',
      'Execute — живой запрос к API',
      'Отображение curl команды',
      'Schema inspector для моделей',
    ],
  },
  {
    id: 'redoc',
    name: 'Redoc',
    tagline: 'Красивая трёхколоночная документация',
    color: '#6366f1',
    pros: [
      'Профессиональный дизайн из коробки',
      'Трёхколонный layout (nav / описание / код)',
      'Отличная типографика и читаемость',
      'Быстрая загрузка (SSG поддержка)',
      'Хорошая поддержка OpenAPI 3.1',
    ],
    cons: [
      'Нет Try it out в бесплатной версии',
      'Меньше интерактивности',
      'Try it out — только в платном Redocly',
      'Сложнее кастомизировать структуру',
    ],
    whenToUse:
      'Публичный developer portal, документация для внешних разработчиков, когда важен визуальный бренд',
    config: `<!-- Standalone HTML — просто откройте в браузере -->
<!DOCTYPE html>
<html>
  <head>
    <title>API Docs</title>
  </head>
  <body>
    <redoc spec-url="./openapi.yaml"></redoc>
    <script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script>
  </body>
</html>

# Или через CLI:
npx @redocly/cli build-docs openapi.yaml
# Генерирует index.html — готово для деплоя`,
    configLabel: 'HTML + CLI',
    uiDescription: 'Трёхколоночный layout: навигация / описание / примеры кода',
    uiFeatures: [
      'Фиксированная навигация слева',
      'Центр: описание endpoints',
      'Правая панель: примеры запросов/ответов',
      'Поиск по всей документации',
      'Dark mode из коробки',
    ],
  },
  {
    id: 'stoplight',
    name: 'Stoplight',
    tagline: 'Полная платформа: дизайн + документация + моки',
    color: '#f59e0b',
    pros: [
      'Design-first подход с визуальным редактором',
      'Встроенный mock-сервер',
      'Совместная работа в команде',
      'Linting и валидация OpenAPI',
      'Интеграция с GitHub/GitLab',
    ],
    cons: [
      'Платная платформа (free tier ограничен)',
      'Vendor lock-in',
      'Избыточно для небольших проектов',
      'Требует обучения команды',
    ],
    whenToUse:
      'Enterprise API platform, крупная команда с несколькими API, компания строит developer ecosystem',
    config: `# Установка Stoplight CLI
npm install -g @stoplight/spectral-cli

# Валидация OpenAPI-спецификации
spectral lint openapi.yaml

# Публикация на Stoplight Platform
# 1. Создайте проект на stoplight.io
# 2. Подключите Git-репозиторий
# 3. Stoplight автоматически обнаружит
#    openapi.yaml и опубликует документацию

# Mock-сервер (локально):
npx @stoplight/prism-cli mock openapi.yaml
# → http://127.0.0.1:4010`,
    configLabel: 'CLI + Platform',
    uiDescription: 'Полноценная платформа с редактором, preview и collaboration',
    uiFeatures: [
      'Визуальный редактор схем (без YAML)',
      'Try it out с поддержкой OAuth',
      'Автоматический mock-сервер',
      'Публикация на custom domain',
      'Style Guide и линтинг',
    ],
  },
]

type CompareMode = 'cards' | 'table'

export function Task10_2_Solution() {
  const [activeTool, setActiveTool] = useState<string>('swagger')
  const [mode, setMode] = useState<CompareMode>('cards')
  const [showConfig, setShowConfig] = useState<Record<string, boolean>>({})

  const tool = TOOLS.find((t) => t.id === activeTool)!
  const toggleConfig = (id: string) =>
    setShowConfig((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Сравнение инструментов документации</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Swagger UI, Redoc и Stoplight — три подхода к документированию API
      </p>

      {/* Mode toggle */}
      <div
        style={{
          display: 'inline-flex',
          background: '#f1f5f9',
          borderRadius: '8px',
          padding: '3px',
          marginBottom: '1.5rem',
        }}
      >
        {(['cards', 'table'] as CompareMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: '0.4rem 1rem',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              background: mode === m ? 'white' : 'transparent',
              color: mode === m ? '#1e293b' : '#64748b',
              fontWeight: mode === m ? 600 : 400,
              boxShadow: mode === m ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {m === 'cards' ? 'Карточки' : 'Сравнение'}
          </button>
        ))}
      </div>

      {mode === 'cards' && (
        <>
          {/* Tool tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {TOOLS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                style={{
                  padding: '0.5rem 1.25rem',
                  border: `2px solid ${activeTool === t.id ? t.color : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  background: activeTool === t.id ? t.color : 'white',
                  color: activeTool === t.id ? '#1e293b' : '#475569',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s',
                }}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Tool card */}
          <div
            style={{
              border: `2px solid ${tool.color}`,
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: tool.color,
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{tool.name}</h3>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', opacity: 0.8 }}>
                  {tool.tagline}
                </p>
              </div>
            </div>

            <div style={{ padding: '1.25rem', background: 'white' }}>
              {/* UI description */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{ fontWeight: 600, fontSize: '0.85rem', color: '#475569', marginBottom: '0.5rem' }}
                >
                  Интерфейс
                </div>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>{tool.uiDescription}</p>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#475569' }}>
                  {tool.uiFeatures.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#16a34a', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Плюсы
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                    {tool.pros.map((p) => (
                      <li key={p} style={{ marginBottom: '0.25rem' }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    Минусы
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                    {tool.cons.map((c) => (
                      <li key={c} style={{ marginBottom: '0.25rem' }}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                style={{
                  background: '#fffbeb',
                  border: '1px solid #fde68a',
                  borderRadius: '6px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <strong>Когда использовать:</strong> {tool.whenToUse}
              </div>

              <button
                onClick={() => toggleConfig(tool.id)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  background: 'white',
                  fontSize: '0.85rem',
                  color: '#475569',
                }}
              >
                {showConfig[tool.id] ? 'Скрыть' : 'Показать'} пример настройки ({tool.configLabel})
              </button>

              {showConfig[tool.id] && (
                <pre
                  style={{
                    background: '#0f172a',
                    color: '#e2e8f0',
                    padding: '1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    overflow: 'auto',
                    marginTop: '0.75rem',
                    marginBottom: 0,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {tool.config}
                </pre>
              )}
            </div>
          </div>
        </>
      )}

      {mode === 'table' && (
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.85rem',
            }}
          >
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', textAlign: 'left', background: '#f1f5f9', border: '1px solid #e2e8f0', width: '20%' }}>
                  Критерий
                </th>
                {TOOLS.map((t) => (
                  <th
                    key={t.id}
                    style={{
                      padding: '0.75rem',
                      textAlign: 'center',
                      background: t.color,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Try it out', values: ['Да (бесплатно)', 'Платно (Redocly)', 'Да (платно)'] },
                { label: 'Mock-сервер', values: ['Нет', 'Нет', 'Да'] },
                { label: 'Дизайн', values: ['Базовый', 'Отличный', 'Отличный'] },
                { label: 'Open Source', values: ['Да', 'Да', 'Частично'] },
                { label: 'Self-host', values: ['Да', 'Да', 'Ограниченно'] },
                { label: 'Совместная работа', values: ['Нет', 'Нет', 'Да'] },
                { label: 'Design-first', values: ['Нет', 'Нет', 'Да'] },
                { label: 'Сложность настройки', values: ['Низкая', 'Очень низкая', 'Высокая'] },
                { label: 'Цена', values: ['Бесплатно', 'Бесплатно*', 'От $49/мес'] },
              ].map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td
                    style={{
                      padding: '0.6rem 0.75rem',
                      border: '1px solid #e2e8f0',
                      fontWeight: 500,
                      color: '#374151',
                    }}
                  >
                    {row.label}
                  </td>
                  {row.values.map((val, j) => (
                    <td
                      key={j}
                      style={{
                        padding: '0.6rem 0.75rem',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        color: '#475569',
                      }}
                    >
                      {val}
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

// ============================================
// Задание 10.3: Оценка документации
// ============================================

interface ApiEvaluation {
  api: string
  url: string
  color: string
  tagline: string
  scores: Record<string, number>
  comments: Record<string, string>
}

const CRITERIA_KEYS = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'auth', label: 'Аутентификация' },
  { id: 'reference', label: 'Reference' },
  { id: 'examples', label: 'Примеры кода' },
  { id: 'errors', label: 'Коды ошибок' },
  { id: 'interactive', label: 'Интерактивность' },
  { id: 'sdk', label: 'SDK / библиотеки' },
  { id: 'sandbox', label: 'Sandbox / тестовая среда' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'search', label: 'Поиск по документации' },
]

const EVALUATIONS: ApiEvaluation[] = [
  {
    api: 'Stripe',
    url: 'https://stripe.com/docs/api',
    color: '#635bff',
    tagline: 'Золотой стандарт документации API',
    scores: {
      'getting-started': 10,
      auth: 10,
      reference: 10,
      examples: 10,
      errors: 10,
      interactive: 9,
      sdk: 10,
      sandbox: 10,
      changelog: 9,
      search: 10,
    },
    comments: {
      'getting-started': 'Quickstart за 5 минут, видео, пошаговые гайды по каждому сценарию',
      auth: 'Подробный раздел про ключи, ротацию, IP-allowlisting и webhook-подписи',
      reference: 'Каждый endpoint: все параметры, expand, filters, события',
      examples: 'Примеры на 8 языках с переключателем прямо в документации',
      errors: 'Полный список кодов ошибок с причинами и способами устранения',
      interactive: 'Логи реальных запросов в Dashboard, встроенный API Explorer',
      sdk: 'Официальные SDK: JS, Python, Ruby, PHP, Go, Java, .NET — все open source',
      sandbox: 'Отдельные test-ключи, тестовые карты, webhook-тестирование',
      changelog: 'Детальный changelog с датами и breaking changes',
      search: 'Поиск по всей документации мгновенный, включая примеры кода',
    },
  },
  {
    api: 'GitHub',
    url: 'https://docs.github.com/en/rest',
    color: '#24292f',
    tagline: 'Подробно, но немного перегружено',
    scores: {
      'getting-started': 8,
      auth: 9,
      reference: 9,
      examples: 8,
      errors: 7,
      interactive: 6,
      sdk: 9,
      sandbox: 5,
      changelog: 7,
      search: 8,
    },
    comments: {
      'getting-started': 'Хорошие quickstart гайды, но много разных вариантов аутентификации путает',
      auth: 'Подробно: PAT, GitHub Apps, OAuth Apps — все варианты с примерами',
      reference: 'Полный reference, но навигация между REST и GraphQL может запутать',
      examples: 'Примеры есть, но не всегда с реальными данными, в основном curl',
      errors: 'Основные коды описаны, но нет полного списка с кастомными error типами',
      interactive: 'Нет Try it out в документации, нужно использовать внешние инструменты',
      sdk: 'Octokit — отличный официальный SDK для JS и Ruby, другие — community',
      sandbox: 'Нет отдельной sandbox-среды, можно создать тестовую организацию',
      changelog: 'Breaking changes объявляются через blog и deprecation notices',
      search: 'Поиск работает, но иногда выдаёт устаревшие разделы',
    },
  },
  {
    api: 'Twitter/X',
    url: 'https://developer.x.com/en/docs',
    color: '#1da1f2',
    tagline: 'Хорошая документация с нюансами',
    scores: {
      'getting-started': 6,
      auth: 7,
      reference: 8,
      examples: 6,
      errors: 8,
      interactive: 5,
      sdk: 6,
      sandbox: 4,
      changelog: 5,
      search: 7,
    },
    comments: {
      'getting-started': 'Quickstart есть, но процесс получения доступа сложный и медленный',
      auth: 'OAuth 2.0 и 1.0a — описаны хорошо, но необходимость двух версий запутывает',
      reference: 'Reference полный, хорошо структурированный по эндпоинтам',
      examples: 'Примеры есть, но меньше языков чем у Stripe, часто только curl',
      errors: 'Список кодов ошибок с описаниями, включая Twitter-специфичные коды',
      interactive: 'Нет встроенного Try it out, есть API Explorer отдельно',
      sdk: 'Официальные клиенты: JS, Python — но не все активно поддерживаются',
      sandbox: 'Free tier сильно ограничен, sandbox недоступен на базовом тарифе',
      changelog: 'Changelog менее регулярный, breaking changes иногда без warning',
      search: 'Поиск работает, но не всегда находит актуальные материалы',
    },
  },
]

const SCORE_COLOR = (score: number) => {
  if (score >= 9) return '#16a34a'
  if (score >= 7) return '#d97706'
  if (score >= 5) return '#dc2626'
  return '#991b1b'
}

export function Task10_3_Solution() {
  const [activeApi, setActiveApi] = useState<string>('Stripe')
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  const evaluation = EVALUATIONS.find((e) => e.api === activeApi)!
  const totalScore = Math.round(
    Object.values(evaluation.scores).reduce((a, b) => a + b, 0) / CRITERIA_KEYS.length,
  )

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '1000px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Оценка реальных API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Применяем критерии из задания 10.1 к реальным публичным API — Stripe, GitHub, Twitter/X
      </p>

      {/* API selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {EVALUATIONS.map((e) => (
          <button
            key={e.api}
            onClick={() => {
              setActiveApi(e.api)
              setExpandedCriterion(null)
            }}
            style={{
              padding: '0.6rem 1.25rem',
              border: `2px solid ${activeApi === e.api ? e.color : '#e2e8f0'}`,
              borderRadius: '8px',
              cursor: 'pointer',
              background: activeApi === e.api ? e.color : 'white',
              color: activeApi === e.api ? 'white' : '#475569',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
            }}
          >
            {e.api}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div
        style={{
          background: '#f8fafc',
          border: `2px solid ${evaluation.color}`,
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              color: SCORE_COLOR(totalScore),
              lineHeight: 1,
            }}
          >
            {totalScore}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            из 10
          </div>
        </div>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
            {evaluation.api} API
          </div>
          <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
            {evaluation.tagline}
          </div>
          <a
            href={evaluation.url}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: '0.8rem', color: evaluation.color }}
          >
            {evaluation.url}
          </a>
        </div>
      </div>

      {/* Scores grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1rem',
        }}
      >
        {CRITERIA_KEYS.map((criterion) => {
          const score = evaluation.scores[criterion.id]
          const isExpanded = expandedCriterion === criterion.id
          return (
            <div
              key={criterion.id}
              onClick={() => setExpandedCriterion(isExpanded ? null : criterion.id)}
              style={{
                background: isExpanded ? '#f0f9ff' : 'white',
                border: `1px solid ${isExpanded ? '#7dd3fc' : '#e2e8f0'}`,
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 500, color: '#374151' }}>
                  {criterion.label}
                </span>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    color: SCORE_COLOR(score),
                  }}
                >
                  {score}
                </span>
              </div>
              <div style={{ background: '#e2e8f0', borderRadius: '3px', height: '4px', marginTop: '0.5rem' }}>
                <div
                  style={{
                    width: `${score * 10}%`,
                    height: '100%',
                    borderRadius: '3px',
                    background: SCORE_COLOR(score),
                    transition: 'width 0.3s',
                  }}
                />
              </div>
              {isExpanded && (
                <p
                  style={{
                    margin: '0.5rem 0 0',
                    fontSize: '0.78rem',
                    color: '#475569',
                    lineHeight: 1.5,
                  }}
                >
                  {evaluation.comments[criterion.id]}
                </p>
              )}
            </div>
          )
        })}
      </div>

      {/* Comparison overview */}
      <button
        onClick={() => setShowAll(!showAll)}
        style={{
          padding: '0.5rem 1rem',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          cursor: 'pointer',
          background: 'white',
          fontSize: '0.85rem',
          color: '#475569',
          marginBottom: showAll ? '1rem' : 0,
        }}
      >
        {showAll ? 'Скрыть' : 'Показать'} сравнение всех трёх API
      </button>

      {showAll && (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                  Критерий
                </th>
                {EVALUATIONS.map((e) => (
                  <th
                    key={e.api}
                    style={{
                      padding: '0.6rem 0.75rem',
                      textAlign: 'center',
                      background: e.color,
                      color: 'white',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {e.api}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CRITERIA_KEYS.map((criterion, i) => (
                <tr key={criterion.id} style={{ background: i % 2 === 0 ? 'white' : '#f8fafc' }}>
                  <td style={{ padding: '0.5rem 0.75rem', border: '1px solid #e2e8f0', fontWeight: 500 }}>
                    {criterion.label}
                  </td>
                  {EVALUATIONS.map((e) => {
                    const score = e.scores[criterion.id]
                    return (
                      <td
                        key={e.api}
                        style={{
                          padding: '0.5rem 0.75rem',
                          border: '1px solid #e2e8f0',
                          textAlign: 'center',
                          fontWeight: 700,
                          color: SCORE_COLOR(score),
                        }}
                      >
                        {score}
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr style={{ background: '#f1f5f9', fontWeight: 700 }}>
                <td style={{ padding: '0.6rem 0.75rem', border: '1px solid #e2e8f0' }}>Итого</td>
                {EVALUATIONS.map((e) => {
                  const avg = Math.round(
                    Object.values(e.scores).reduce((a, b) => a + b, 0) / CRITERIA_KEYS.length,
                  )
                  return (
                    <td
                      key={e.api}
                      style={{
                        padding: '0.6rem 0.75rem',
                        border: '1px solid #e2e8f0',
                        textAlign: 'center',
                        fontSize: '1rem',
                        color: SCORE_COLOR(avg),
                      }}
                    >
                      {avg}/10
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
