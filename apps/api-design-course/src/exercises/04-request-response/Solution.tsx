import { useState } from 'react'

// ============================================
// Task 4.1: JSON Response Transformer
// ============================================

interface BadExample {
  id: number
  title: string
  category: string
  bad: string
  good: string
  problems: string[]
  fixes: string[]
}

const badExamples: BadExample[] = [
  {
    id: 1,
    title: 'Смешение camelCase и snake_case',
    category: 'Именование полей',
    bad: `{
  "userId": 42,
  "user_name": "ivan",
  "UserEmail": "ivan@example.com",
  "created_at": "2024-01-15",
  "isActive": true,
  "phone_number": "+7 999 123-45-67"
}`,
    good: `{
  "id": 42,
  "name": "ivan",
  "email": "ivan@example.com",
  "createdAt": "2024-01-15T00:00:00Z",
  "isActive": true,
  "phone": "+7 999 123-45-67"
}`,
    problems: [
      'camelCase, snake_case и PascalCase смешаны в одном объекте',
      'userId вместо просто id — избыточный префикс',
      'created_at — дата без времени и таймзоны',
      'phone_number — snake_case среди camelCase полей',
    ],
    fixes: [
      'Единый стиль: camelCase для JS/TS клиентов',
      'Поле id не требует префикса внутри объекта пользователя',
      'ISO 8601 для дат: 2024-01-15T00:00:00Z',
      'phone вместо phone_number — согласованный camelCase',
    ],
  },
  {
    id: 2,
    title: 'Отсутствие метаданных пагинации',
    category: 'Коллекции',
    bad: `{
  "users": [
    { "id": 1, "name": "Иван" },
    { "id": 2, "name": "Мария" },
    { "id": 3, "name": "Пётр" }
  ]
}`,
    good: `{
  "data": [
    { "id": 1, "name": "Иван" },
    { "id": 2, "name": "Мария" },
    { "id": 3, "name": "Пётр" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "perPage": 3,
    "totalPages": 50
  }
}`,
    problems: [
      'Клиент не знает, сколько всего записей в базе',
      'Нет информации о текущей странице и размере',
      'Невозможно построить пагинатор в UI',
      'При изменении данных клиент не может синхронизироваться',
    ],
    fixes: [
      'Поле meta с total, page, perPage, totalPages',
      'Данные перемещены в поле data — явное разделение',
      'Теперь UI знает: страница 1 из 50, 150 записей всего',
      'Cursor-based: добавьте nextCursor вместо page для бесконечного скролла',
    ],
  },
  {
    id: 3,
    title: 'Избыточная вложенность',
    category: 'Структура',
    bad: `{
  "response": {
    "payload": {
      "user": {
        "data": {
          "id": 42,
          "name": "Иван"
        }
      }
    }
  }
}`,
    good: `{
  "id": 42,
  "name": "Иван"
}`,
    problems: [
      'Клиент пишет response.payload.user.data.id — абсурдно',
      'Каждый слой не несёт смысловой нагрузки',
      'Это типичная «матрёшка» — антипаттерн wrapper hell',
      'Усложняет TypeScript-типизацию и deserialization',
    ],
    fixes: [
      'Плоская структура для одиночного ресурса',
      'Клиент пишет user.id — просто и понятно',
      'Envelope нужен только для коллекций или когда реально нужны meta/errors',
      'Принцип: минимальная вложенность без потери смысла',
    ],
  },
  {
    id: 4,
    title: 'Непоследовательный формат ошибок',
    category: 'Ошибки',
    bad: `// Endpoint A возвращает:
{
  "error": "User not found"
}

// Endpoint B возвращает:
{
  "status": false,
  "message": "Validation error",
  "fields": { "email": "Invalid" }
}

// Endpoint C возвращает:
{
  "code": 1042,
  "desc": "Forbidden"
}`,
    good: `// Все endpoints — единый формат RFC 7807:
{
  "type": "https://api.example.com/errors/not-found",
  "title": "User Not Found",
  "status": 404,
  "detail": "No user with id=42 exists.",
  "instance": "/api/users/42"
}

// Ошибка валидации:
{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation Failed",
  "status": 422,
  "errors": [
    { "field": "email", "message": "Некорректный формат email" }
  ]
}`,
    problems: [
      'Три endpoint — три разных структуры ошибок',
      'Клиент не может написать единый обработчик ошибок',
      'Строковые сообщения без типа — нельзя надёжно парсить',
      'Поле desc вместо detail, message вместо title — хаос',
    ],
    fixes: [
      'RFC 7807 Problem Details — единый стандарт для всех ошибок',
      'type — машиночитаемый URI типа ошибки',
      'title — стабильное человекочитаемое название',
      'detail — конкретика для этого запроса, instance — URL',
    ],
  },
  {
    id: 5,
    title: 'Unix timestamp вместо ISO 8601',
    category: 'Форматы данных',
    bad: `{
  "id": 1,
  "name": "Заказ #1",
  "createdAt": 1712345678,
  "updatedAt": 1712345999,
  "expiresAt": 1714937678
}`,
    good: `{
  "id": 1,
  "name": "Заказ #1",
  "createdAt": "2024-04-05T14:34:38Z",
  "updatedAt": "2024-04-05T14:39:59Z",
  "expiresAt": "2024-05-05T14:34:38Z"
}`,
    problems: [
      'Разработчик не может прочитать дату без конвертера',
      'Нет информации о таймзоне — UTC? Локальное время?',
      '1712345678 — что это? Секунды? Миллисекунды?',
      'JavaScript Date требует миллисекунды, Python — секунды: баги',
    ],
    fixes: [
      'ISO 8601 с суффиксом Z (UTC): 2024-04-05T14:34:38Z',
      'Человекочитаемо без дополнительных инструментов',
      'Явная таймзона исключает путаницу',
      'Все языки и библиотеки парсят ISO 8601 нативно',
    ],
  },
  {
    id: 6,
    title: 'Boolean в виде строки или числа',
    category: 'Типы данных',
    bad: `{
  "userId": 42,
  "isActive": "true",
  "isVerified": 1,
  "isPremium": "yes",
  "isDeleted": "0"
}`,
    good: `{
  "id": 42,
  "isActive": true,
  "isVerified": true,
  "isPremium": false,
  "isDeleted": false
}`,
    problems: [
      '"true" — строка, а не булево. if (isActive) сработает даже для "false"!',
      '1/0 — числа, не boolean. Клиент не знает: это счётчик или флаг?',
      '"yes"/"no" — нестандартно, требует особой обработки',
      '"0" — строка, всегда truthy в JavaScript',
    ],
    fixes: [
      'Используйте настоящие JSON boolean: true / false',
      'JSON имеет нативный тип boolean — используйте его',
      'Никаких строковых и числовых эмуляций булевых значений',
      'TypeScript автоматически получит правильный тип boolean',
    ],
  },
]

export function Task4_1_Solution() {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = [...new Set(badExamples.map(e => e.category))]

  const filtered = activeCategory
    ? badExamples.filter(e => e.category === activeCategory)
    : badExamples

  const toggleExpand = (id: number) => {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Трансформатор JSON-ответов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Найдите проблему в каждом ответе и нажмите «Показать исправление», чтобы увидеть правильный вариант с объяснением.
      </p>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '0.375rem 0.875rem',
            borderRadius: '1rem',
            border: '1px solid #d1d5db',
            background: activeCategory === null ? '#1e40af' : 'white',
            color: activeCategory === null ? 'white' : '#374151',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Все
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(prev => (prev === cat ? null : cat))}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '1rem',
              border: '1px solid #d1d5db',
              background: activeCategory === cat ? '#1e40af' : 'white',
              color: activeCategory === cat ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Examples */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map(example => {
          const isExpanded = expandedId === example.id
          return (
            <div
              key={example.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.75rem',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '1rem 1.25rem',
                  background: '#fef2f2',
                  borderBottom: '1px solid #fecaca',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {example.category}
                  </span>
                  <h3 style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#111827' }}>
                    ❌ {example.title}
                  </h3>
                </div>
                <button
                  onClick={() => toggleExpand(example.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: isExpanded ? '#6b7280' : '#1e40af',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isExpanded ? 'Скрыть' : 'Показать исправление'}
                </button>
              </div>

              {/* Bad example */}
              <div style={{ padding: '1rem 1.25rem', background: '#fff' }}>
                <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>
                  ПЛОХОЙ ВАРИАНТ
                </p>
                <pre
                  style={{
                    background: '#1f2937',
                    color: '#f87171',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    overflow: 'auto',
                    fontSize: '0.8rem',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {example.bad}
                </pre>

                {/* Problems list */}
                <ul style={{ margin: '0.75rem 0 0', padding: '0 0 0 1.25rem' }}>
                  {example.problems.map((p, i) => (
                    <li key={i} style={{ fontSize: '0.875rem', color: '#dc2626', marginBottom: '0.25rem' }}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Fixed example */}
              {isExpanded && (
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    background: '#f0fdf4',
                    borderTop: '1px solid #bbf7d0',
                  }}
                >
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                    ИСПРАВЛЕННЫЙ ВАРИАНТ
                  </p>
                  <pre
                    style={{
                      background: '#1f2937',
                      color: '#86efac',
                      padding: '1rem',
                      borderRadius: '0.5rem',
                      overflow: 'auto',
                      fontSize: '0.8rem',
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {example.good}
                  </pre>
                  <ul style={{ margin: '0.75rem 0 0', padding: '0 0 0 1.25rem' }}>
                    {example.fixes.map((f, i) => (
                      <li key={i} style={{ fontSize: '0.875rem', color: '#16a34a', marginBottom: '0.25rem' }}>
                        ✅ {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Task 4.2: Envelope vs Flat responses
// ============================================

type ResponseStyle = 'envelope' | 'flat'

interface Scenario {
  id: string
  label: string
  envelope: string
  flat: string
  envelopeComment: string
  flatComment: string
}

const scenarios: Scenario[] = [
  {
    id: 'collection',
    label: 'Коллекция ресурсов',
    envelope: `// GET /api/products?page=1&perPage=3
// HTTP 200 OK
{
  "data": [
    { "id": 1, "name": "Ноутбук", "price": 89990 },
    { "id": 2, "name": "Мышь", "price": 2990 },
    { "id": 3, "name": "Клавиатура", "price": 5490 }
  ],
  "meta": {
    "total": 247,
    "page": 1,
    "perPage": 3,
    "totalPages": 83
  }
}`,
    flat: `// GET /api/products?page=1&perPage=3
// HTTP 200 OK
[
  { "id": 1, "name": "Ноутбук", "price": 89990 },
  { "id": 2, "name": "Мышь", "price": 2990 },
  { "id": 3, "name": "Клавиатура", "price": 5490 }
]

// Метаданные пагинации — в HTTP-заголовках:
// X-Total-Count: 247
// X-Page: 1
// X-Per-Page: 3
// Link: <...?page=2>; rel="next"`,
    envelopeComment:
      'Envelope оправдан: данные + пагинация в одном JSON-объекте. Клиент парсит одно тело ответа. Удобно для GraphQL-подобных клиентов и когда нужно добавить поле links с HATEOAS.',
    flatComment:
      'Flat + заголовки — чище, ближе к REST-идеалу. Массив напрямую. Но клиент обязан читать заголовки — сложнее в некоторых клиентских библиотеках.',
  },
  {
    id: 'single',
    label: 'Одиночный ресурс',
    envelope: `// GET /api/products/42
// HTTP 200 OK
{
  "data": {
    "id": 42,
    "name": "Ноутбук Pro",
    "price": 89990,
    "category": "Электроника",
    "inStock": true
  }
}`,
    flat: `// GET /api/products/42
// HTTP 200 OK
{
  "id": 42,
  "name": "Ноутбук Pro",
  "price": 89990,
  "category": "Электроника",
  "inStock": true
}`,
    envelopeComment:
      'Envelope для одиночного ресурса — спорно. Клиент пишет product.data.id вместо product.id. Оправдано только если нужна консистентность с коллекцией или дополнительные поля на уровне ответа.',
    flatComment:
      'Flat — предпочтительно для одиночного ресурса. Прямой доступ к полям: product.id, product.name. Меньше уровней вложенности — проще типизация в TypeScript.',
  },
  {
    id: 'error',
    label: 'Ошибка',
    envelope: `// GET /api/products/999
// HTTP 404 Not Found
{
  "error": {
    "type": "https://api.example.com/errors/not-found",
    "title": "Product Not Found",
    "status": 404,
    "detail": "No product with id=999 exists."
  }
}`,
    flat: `// GET /api/products/999
// HTTP 404 Not Found
{
  "type": "https://api.example.com/errors/not-found",
  "title": "Product Not Found",
  "status": 404,
  "detail": "No product with id=999 exists."
}`,
    envelopeComment:
      'Обёртка error: {...} добавляет один уровень. Удобно если API всегда возвращает { data } или { error } — клиент легко определяет тип ответа.',
    flatComment:
      'RFC 7807 Problem Details — уже стандартизированный flat-формат. Content-Type: application/problem+json отличает ошибку от успеха без обёртки.',
  },
  {
    id: 'create',
    label: 'Создание ресурса (POST)',
    envelope: `// POST /api/products
// HTTP 201 Created
// Location: /api/products/43
{
  "data": {
    "id": 43,
    "name": "Новый товар",
    "price": 4990,
    "createdAt": "2024-04-05T12:00:00Z"
  },
  "meta": {
    "message": "Товар успешно создан"
  }
}`,
    flat: `// POST /api/products
// HTTP 201 Created
// Location: /api/products/43
{
  "id": 43,
  "name": "Новый товар",
  "price": 4990,
  "createdAt": "2024-04-05T12:00:00Z"
}`,
    envelopeComment:
      'Envelope с meta.message — избыточно. HTTP 201 уже говорит "создано". Дополнительные сообщения в meta оправданы только для асинхронных операций (202 Accepted + jobId).',
    flatComment:
      'Flat — оптимально. Созданный объект напрямую. Клиент получил ID, может обновить UI. Location-заголовок указывает на новый ресурс.',
  },
]

const envelopePros = [
  'Единая структура для всех ответов',
  'Легко добавить meta-поля (links, warnings)',
  'Клиент всегда знает: данные в .data',
  'Удобно для GraphQL-подобных обёрток',
]

const envelopeCons = [
  'Лишний уровень вложенности для одиночных ресурсов',
  'product.data.id вместо product.id',
  'Избыточно для простых CRUD-операций',
]

const flatPros = [
  'Прямой доступ к полям: product.id',
  'Проще TypeScript-типизация',
  'Ближе к REST-идеалу',
  'RFC 7807 для ошибок уже flat',
]

const flatCons = [
  'Метаданные пагинации нужно класть в заголовки',
  'Сложнее добавить мета без изменения контракта',
  'Нет единого места для links/warnings',
]

export function Task4_2_Solution() {
  const [style, setStyle] = useState<ResponseStyle>('flat')
  const [activeScenario, setActiveScenario] = useState<string>('collection')

  const scenario = scenarios.find(s => s.id === activeScenario)!

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '920px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Envelope vs Flat: сравнение подходов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Переключайте тумблер и смотрите, как выглядит один и тот же ответ в разных стилях. Плюсы и минусы каждого подхода — внизу.
      </p>

      {/* Toggle */}
      <div
        style={{
          display: 'inline-flex',
          background: '#f3f4f6',
          borderRadius: '0.75rem',
          padding: '0.25rem',
          marginBottom: '1.5rem',
        }}
      >
        {(['envelope', 'flat'] as ResponseStyle[]).map(s => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: style === s ? (s === 'envelope' ? '#7c3aed' : '#1e40af') : 'transparent',
              color: style === s ? 'white' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.15s',
            }}
          >
            {s === 'envelope' ? '📦 Envelope' : '📄 Flat'}
          </button>
        ))}
      </div>

      {/* Scenario tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        {scenarios.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveScenario(s.id)}
            style={{
              padding: '0.375rem 0.875rem',
              borderRadius: '1rem',
              border: `1px solid ${activeScenario === s.id ? (style === 'envelope' ? '#7c3aed' : '#1e40af') : '#d1d5db'}`,
              background: activeScenario === s.id ? (style === 'envelope' ? '#ede9fe' : '#dbeafe') : 'white',
              color: activeScenario === s.id ? (style === 'envelope' ? '#7c3aed' : '#1e40af') : '#374151',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeScenario === s.id ? 600 : 400,
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Code example */}
      <div
        style={{
          border: `2px solid ${style === 'envelope' ? '#c4b5fd' : '#93c5fd'}`,
          borderRadius: '0.75rem',
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            padding: '0.75rem 1rem',
            background: style === 'envelope' ? '#ede9fe' : '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontWeight: 600, color: style === 'envelope' ? '#7c3aed' : '#1e40af' }}>
            {style === 'envelope' ? '📦 Envelope-стиль' : '📄 Flat-стиль'}
          </span>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>— {scenario.label}</span>
        </div>
        <pre
          style={{
            background: '#1f2937',
            color: '#e5e7eb',
            padding: '1.25rem',
            margin: 0,
            overflow: 'auto',
            fontSize: '0.82rem',
            lineHeight: 1.6,
          }}
        >
          {style === 'envelope' ? scenario.envelope : scenario.flat}
        </pre>
        <div
          style={{
            padding: '0.875rem 1rem',
            background: style === 'envelope' ? '#f5f3ff' : '#eff6ff',
            borderTop: `1px solid ${style === 'envelope' ? '#c4b5fd' : '#93c5fd'}`,
          }}
        >
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.5 }}>
            💡 {style === 'envelope' ? scenario.envelopeComment : scenario.flatComment}
          </p>
        </div>
      </div>

      {/* Pros/Cons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Envelope */}
        <div
          style={{
            border: '1px solid #c4b5fd',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            opacity: style === 'envelope' ? 1 : 0.6,
            transition: 'opacity 0.2s',
          }}
        >
          <div style={{ padding: '0.75rem 1rem', background: '#ede9fe' }}>
            <strong style={{ color: '#7c3aed' }}>📦 Envelope</strong>
          </div>
          <div style={{ padding: '0.875rem 1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>
              Плюсы
            </p>
            <ul style={{ margin: '0 0 1rem', padding: '0 0 0 1.1rem' }}>
              {envelopePros.map((p, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.25rem' }}>
                  {p}
                </li>
              ))}
            </ul>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>
              Минусы
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 1.1rem' }}>
              {envelopeCons.map((c, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.25rem' }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Flat */}
        <div
          style={{
            border: '1px solid #93c5fd',
            borderRadius: '0.75rem',
            overflow: 'hidden',
            opacity: style === 'flat' ? 1 : 0.6,
            transition: 'opacity 0.2s',
          }}
        >
          <div style={{ padding: '0.75rem 1rem', background: '#dbeafe' }}>
            <strong style={{ color: '#1e40af' }}>📄 Flat</strong>
          </div>
          <div style={{ padding: '0.875rem 1rem' }}>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#16a34a' }}>
              Плюсы
            </p>
            <ul style={{ margin: '0 0 1rem', padding: '0 0 0 1.1rem' }}>
              {flatPros.map((p, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.25rem' }}>
                  {p}
                </li>
              ))}
            </ul>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626' }}>
              Минусы
            </p>
            <ul style={{ margin: 0, padding: '0 0 0 1.1rem' }}>
              {flatCons.map((c, i) => (
                <li key={i} style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.25rem' }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: '1rem',
          padding: '0.875rem 1rem',
          background: '#fffbeb',
          border: '1px solid #fcd34d',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          color: '#92400e',
        }}
      >
        ⚠️ Главное правило: выберите один стиль и придерживайтесь его <strong>для всего API</strong>. Смешивать envelope и flat в одном API — хуже любого из подходов.
      </div>
    </div>
  )
}

// ============================================
// Task 4.3: Request/Response Design Reference
// ============================================

interface Operation {
  id: string
  label: string
  method: string
  path: string
  requestHeaders: string
  requestBody: string | null
  responseStatus: number
  responseHeaders: string
  responseBody: string
  notes: string[]
}

const operations: Operation[] = [
  {
    id: 'list',
    label: 'Список товаров',
    method: 'GET',
    path: '/api/v1/products?page=1&perPage=20&category=electronics&sort=price&order=asc',
    requestHeaders: `Accept: application/json
Authorization: Bearer <token>`,
    requestBody: null,
    responseStatus: 200,
    responseHeaders: `Content-Type: application/json
Cache-Control: public, max-age=60`,
    responseBody: `{
  "data": [
    {
      "id": 1,
      "name": "Ноутбук Pro 15",
      "slug": "noutbuk-pro-15",
      "price": 89990,
      "currency": "RUB",
      "category": "electronics",
      "inStock": true,
      "imageUrl": "https://cdn.example.com/products/1.jpg",
      "createdAt": "2024-01-10T08:00:00Z",
      "updatedAt": "2024-03-20T14:30:00Z"
    }
  ],
  "meta": {
    "total": 247,
    "page": 1,
    "perPage": 20,
    "totalPages": 13,
    "filters": {
      "category": "electronics"
    }
  }
}`,
    notes: [
      'GET — идемпотентный, кэшируемый. Cache-Control разрешает кэш на 60 секунд',
      'Фильтры, сортировка, пагинация — в query-параметрах',
      'Массив данных всегда в поле data, метаданные — в meta',
      'Ответ не включает полное описание товара — только summary для списка',
    ],
  },
  {
    id: 'get-one',
    label: 'Получить товар',
    method: 'GET',
    path: '/api/v1/products/42',
    requestHeaders: `Accept: application/json
Authorization: Bearer <token>`,
    requestBody: null,
    responseStatus: 200,
    responseHeaders: `Content-Type: application/json
ETag: "abc123def456"
Cache-Control: private, max-age=300`,
    responseBody: `{
  "id": 42,
  "name": "Ноутбук Pro 15",
  "slug": "noutbuk-pro-15",
  "description": "Мощный ноутбук для разработчиков...",
  "price": 89990,
  "currency": "RUB",
  "category": {
    "id": 3,
    "name": "Электроника",
    "slug": "electronics"
  },
  "attributes": [
    { "name": "RAM", "value": "16GB" },
    { "name": "SSD", "value": "512GB" }
  ],
  "images": [
    { "url": "https://cdn.example.com/products/42-1.jpg", "isPrimary": true },
    { "url": "https://cdn.example.com/products/42-2.jpg", "isPrimary": false }
  ],
  "inStock": true,
  "stockCount": 5,
  "createdAt": "2024-01-10T08:00:00Z",
  "updatedAt": "2024-03-20T14:30:00Z"
}`,
    notes: [
      'Одиночный ресурс — flat-структура без обёртки data (нет пагинации)',
      'Полный объект с вложенными связями: category, attributes, images',
      'ETag для условных запросов (If-None-Match → 304 Not Modified)',
      'stockCount только в детальном виде — не нужен в листинге',
    ],
  },
  {
    id: 'create',
    label: 'Создать товар',
    method: 'POST',
    path: '/api/v1/products',
    requestHeaders: `Content-Type: application/json
Accept: application/json
Authorization: Bearer <token>`,
    requestBody: `{
  "name": "Новый ноутбук",
  "description": "Описание нового ноутбука",
  "price": 75990,
  "currency": "RUB",
  "categoryId": 3,
  "attributes": [
    { "name": "RAM", "value": "8GB" }
  ],
  "inStock": true,
  "stockCount": 10
}`,
    responseStatus: 201,
    responseHeaders: `Content-Type: application/json
Location: /api/v1/products/43`,
    responseBody: `{
  "id": 43,
  "name": "Новый ноутбук",
  "slug": "novyy-noutbuk",
  "description": "Описание нового ноутбука",
  "price": 75990,
  "currency": "RUB",
  "categoryId": 3,
  "attributes": [
    { "name": "RAM", "value": "8GB" }
  ],
  "inStock": true,
  "stockCount": 10,
  "createdAt": "2024-04-05T12:00:00Z",
  "updatedAt": "2024-04-05T12:00:00Z"
}`,
    notes: [
      'POST возвращает 201 Created + Location с URL нового ресурса',
      'Тело ответа — полный созданный объект. Клиент не делает лишний GET',
      'Сервер добавляет id, slug, createdAt, updatedAt — клиент их не передаёт',
      'Запрос не содержит id — сервер генерирует его сам',
    ],
  },
  {
    id: 'patch',
    label: 'Частичное обновление',
    method: 'PATCH',
    path: '/api/v1/products/43',
    requestHeaders: `Content-Type: application/merge-patch+json
Accept: application/json
Authorization: Bearer <token>`,
    requestBody: `{
  "price": 69990,
  "inStock": false
}`,
    responseStatus: 200,
    responseHeaders: `Content-Type: application/json`,
    responseBody: `{
  "id": 43,
  "name": "Новый ноутбук",
  "slug": "novyy-noutbuk",
  "price": 69990,
  "currency": "RUB",
  "inStock": false,
  "stockCount": 0,
  "updatedAt": "2024-04-05T15:30:00Z"
}`,
    notes: [
      'PATCH — только изменённые поля. Не нужно передавать весь объект',
      'Content-Type: application/merge-patch+json (RFC 7396) — стандарт для PATCH',
      'null в поле = "удалить значение". Отсутствие поля = "не трогать"',
      'Ответ: обновлённый объект целиком. updatedAt изменился',
    ],
  },
  {
    id: 'delete',
    label: 'Удалить товар',
    method: 'DELETE',
    path: '/api/v1/products/43',
    requestHeaders: `Authorization: Bearer <token>`,
    requestBody: null,
    responseStatus: 204,
    responseHeaders: ``,
    responseBody: `(пустое тело — 204 No Content)`,
    notes: [
      'DELETE возвращает 204 No Content — тело ответа отсутствует',
      'Повторный DELETE того же ресурса → 404 Not Found (он уже удалён)',
      'Если нужна "мягкая" (soft) удалка — используйте PATCH isDeleted: true',
      'Никакого { "success": true } — 204 уже означает успех',
    ],
  },
]

const methodColors: Record<string, { bg: string; color: string }> = {
  GET: { bg: '#dbeafe', color: '#1e40af' },
  POST: { bg: '#dcfce7', color: '#166534' },
  PATCH: { bg: '#fef3c7', color: '#92400e' },
  PUT: { bg: '#ffedd5', color: '#c2410c' },
  DELETE: { bg: '#fee2e2', color: '#991b1b' },
}

const statusColors: Record<number, { bg: string; color: string }> = {
  200: { bg: '#dcfce7', color: '#166534' },
  201: { bg: '#d1fae5', color: '#065f46' },
  204: { bg: '#e0f2fe', color: '#0369a1' },
}

export function Task4_3_Solution() {
  const [activeOp, setActiveOp] = useState<string>('list')
  const [showRequest, setShowRequest] = useState(true)

  const op = operations.find(o => o.id === activeOp)!
  const methodColor = methodColors[op.method] ?? { bg: '#f3f4f6', color: '#374151' }
  const statusColor = statusColors[op.responseStatus] ?? { bg: '#fee2e2', color: '#991b1b' }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '940px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Эталонный request/response для ресурса «Товар»</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Полный набор операций CRUD с правильными заголовками, телами запросов и ответов. Используйте как шаблон при проектировании своего API.
      </p>

      {/* Operation tabs */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {operations.map(o => {
          const mc = methodColors[o.method] ?? { bg: '#f3f4f6', color: '#374151' }
          const isActive = activeOp === o.id
          return (
            <button
              key={o.id}
              onClick={() => setActiveOp(o.id)}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '0.5rem',
                border: `1px solid ${isActive ? mc.color : '#d1d5db'}`,
                background: isActive ? mc.bg : 'white',
                color: isActive ? mc.color : '#374151',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
              }}
            >
              <span
                style={{
                  padding: '0.1rem 0.4rem',
                  borderRadius: '0.25rem',
                  background: mc.bg,
                  color: mc.color,
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  border: `1px solid ${mc.color}`,
                }}
              >
                {o.method}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>

      {/* URL */}
      <div
        style={{
          padding: '0.625rem 1rem',
          background: '#1f2937',
          borderRadius: '0.5rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          overflow: 'auto',
        }}
      >
        <span
          style={{
            padding: '0.2rem 0.5rem',
            borderRadius: '0.25rem',
            background: methodColor.bg,
            color: methodColor.color,
            fontSize: '0.8rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {op.method}
        </span>
        <code style={{ color: '#e5e7eb', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{op.path}</code>
      </div>

      {/* Request / Response toggle */}
      <div
        style={{
          display: 'inline-flex',
          background: '#f3f4f6',
          borderRadius: '0.625rem',
          padding: '0.2rem',
          marginBottom: '1rem',
        }}
      >
        {[true, false].map(isReq => (
          <button
            key={String(isReq)}
            onClick={() => setShowRequest(isReq)}
            style={{
              padding: '0.4rem 1.1rem',
              borderRadius: '0.4rem',
              border: 'none',
              background: showRequest === isReq ? 'white' : 'transparent',
              color: showRequest === isReq ? '#111827' : '#6b7280',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: showRequest === isReq ? 600 : 400,
              boxShadow: showRequest === isReq ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            {isReq ? '→ Запрос' : '← Ответ'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          overflow: 'hidden',
          marginBottom: '1rem',
        }}
      >
        {showRequest ? (
          <>
            <div style={{ padding: '0.75rem 1rem', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Заголовки запроса</strong>
            </div>
            <pre
              style={{
                background: '#1f2937',
                color: '#93c5fd',
                padding: '1rem',
                margin: 0,
                fontSize: '0.82rem',
                lineHeight: 1.6,
                overflow: 'auto',
              }}
            >
              {op.requestHeaders}
            </pre>

            {op.requestBody !== null && (
              <>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Тело запроса (JSON)</strong>
                </div>
                <pre
                  style={{
                    background: '#1f2937',
                    color: '#e5e7eb',
                    padding: '1rem',
                    margin: 0,
                    fontSize: '0.82rem',
                    lineHeight: 1.6,
                    overflow: 'auto',
                  }}
                >
                  {op.requestBody}
                </pre>
              </>
            )}

            {op.requestBody === null && (
              <div
                style={{
                  padding: '0.875rem 1rem',
                  background: '#f9fafb',
                  borderTop: '1px solid #e5e7eb',
                  color: '#6b7280',
                  fontSize: '0.875rem',
                }}
              >
                Тело запроса отсутствует ({op.method} не передаёт body)
              </div>
            )}
          </>
        ) : (
          <>
            <div
              style={{
                padding: '0.75rem 1rem',
                background: statusColor.bg,
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '0.375rem',
                  background: statusColor.color,
                  color: 'white',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                {op.responseStatus}
              </span>
              <strong style={{ fontSize: '0.875rem', color: statusColor.color }}>Заголовки ответа</strong>
            </div>
            <pre
              style={{
                background: '#1f2937',
                color: '#86efac',
                padding: '1rem',
                margin: 0,
                fontSize: '0.82rem',
                lineHeight: 1.6,
                overflow: 'auto',
                minHeight: op.responseHeaders ? undefined : '3rem',
              }}
            >
              {op.responseHeaders || '(нет дополнительных заголовков)'}
            </pre>

            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#f9fafb',
                borderTop: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <strong style={{ fontSize: '0.875rem', color: '#374151' }}>Тело ответа</strong>
            </div>
            <pre
              style={{
                background: '#1f2937',
                color: '#e5e7eb',
                padding: '1rem',
                margin: 0,
                fontSize: '0.82rem',
                lineHeight: 1.6,
                overflow: 'auto',
              }}
            >
              {op.responseBody}
            </pre>
          </>
        )}
      </div>

      {/* Notes */}
      <div
        style={{
          padding: '1rem',
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '0.75rem',
        }}
      >
        <p style={{ margin: '0 0 0.625rem', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
          КЛЮЧЕВЫЕ РЕШЕНИЯ
        </p>
        <ul style={{ margin: 0, padding: '0 0 0 1.25rem' }}>
          {op.notes.map((note, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: '#334155', marginBottom: '0.375rem', lineHeight: 1.5 }}>
              {note}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
