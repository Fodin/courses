import { useState } from 'react'

// ============================================
// Задание 1.1: URL-конструктор
// ============================================

interface Scenario {
  id: number
  description: string
  method: string
  pathParts: string[]
  queryParams: string
  hint: string
}

const scenarios: Scenario[] = [
  {
    id: 1,
    description: 'Получить список всех пользователей',
    method: 'GET',
    pathParts: ['users'],
    queryParams: '',
    hint: 'Коллекция ресурсов — существительное во множественном числе.',
  },
  {
    id: 2,
    description: 'Получить конкретного пользователя по ID = 42',
    method: 'GET',
    pathParts: ['users', '42'],
    queryParams: '',
    hint: 'Отдельный ресурс — базовая коллекция + идентификатор.',
  },
  {
    id: 3,
    description: 'Получить все заказы пользователя с ID = 7',
    method: 'GET',
    pathParts: ['users', '7', 'orders'],
    queryParams: '',
    hint: 'Вложенный ресурс: сначала владелец, затем коллекция.',
  },
  {
    id: 4,
    description: 'Найти товары в категории "electronics" дешевле 5000',
    method: 'GET',
    pathParts: ['products'],
    queryParams: '?category=electronics&maxPrice=5000',
    hint: 'Фильтрация — это query params, а не path.',
  },
  {
    id: 5,
    description: 'Создать новый пост в блоге',
    method: 'POST',
    pathParts: ['posts'],
    queryParams: '',
    hint: 'Создание — POST на коллекцию.',
  },
  {
    id: 6,
    description: 'Удалить комментарий с ID = 15 у поста с ID = 3',
    method: 'DELETE',
    pathParts: ['posts', '3', 'comments', '15'],
    queryParams: '',
    hint: 'Вложенность может быть многоуровневой.',
  },
]

interface BuilderState {
  method: string
  parts: string[]
  query: string
}

const methodOptions = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export function Task1_1_Solution() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [builder, setBuilder] = useState<BuilderState>({ method: 'GET', parts: [], query: '' })
  const [checked, setChecked] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const scenario = scenarios[scenarioIndex]

  const correctUrl =
    '/api/' +
    scenario.pathParts.join('/') +
    scenario.queryParams

  const builtUrl =
    builder.parts.length > 0
      ? '/api/' + builder.parts.join('/') + (builder.query ? `?${builder.query}` : '')
      : '/api/...'

  const isCorrect =
    builder.method === scenario.method &&
    builder.parts.join('/') === scenario.pathParts.join('/') &&
    (builder.query === '' || '?' + builder.query === scenario.queryParams) &&
    ('?' + builder.query === scenario.queryParams || (scenario.queryParams === '' && builder.query === ''))

  const handleCheck = () => setChecked(true)

  const handleNext = () => {
    setScenarioIndex((i) => (i + 1) % scenarios.length)
    setBuilder({ method: 'GET', parts: [], query: '' })
    setChecked(false)
    setShowHint(false)
  }

  const addPart = (part: string) => {
    if (part.trim()) {
      setBuilder((b) => ({ ...b, parts: [...b.parts, part.trim()] }))
      setChecked(false)
    }
  }

  const removeLast = () => {
    setBuilder((b) => ({ ...b, parts: b.parts.slice(0, -1) }))
    setChecked(false)
  }

  const resourceSuggestions = ['users', 'products', 'orders', 'posts', 'comments', 'tags', 'authors']
  const idSuggestions = ['1', '3', '7', '15', '42']

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>URL-конструктор</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Соберите корректный REST endpoint для каждого сценария, выбирая компоненты по шагам.
      </p>

      {/* Scenario card */}
      <div
        style={{
          background: '#e8f4f8',
          border: '1px solid #b3d9e8',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.25rem' }}>
          Сценарий {scenarioIndex + 1} из {scenarios.length}
        </div>
        <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{scenario.description}</div>
      </div>

      {/* Method selector */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>1. Выберите HTTP-метод</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {methodOptions.map((m) => (
            <button
              key={m}
              onClick={() => { setBuilder((b) => ({ ...b, method: m })); setChecked(false) }}
              style={{
                padding: '0.4rem 0.8rem',
                border: '2px solid',
                borderColor: builder.method === m ? '#1565c0' : '#ccc',
                borderRadius: '6px',
                background: builder.method === m ? '#1565c0' : 'white',
                color: builder.method === m ? 'white' : '#333',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '0.85rem',
              }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Path builder */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
          2. Добавьте сегменты пути
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', alignSelf: 'center' }}>Ресурсы:</span>
          {resourceSuggestions.map((r) => (
            <button
              key={r}
              onClick={() => addPart(r)}
              style={{
                padding: '0.3rem 0.6rem',
                border: '1px solid #90a4ae',
                borderRadius: '4px',
                background: '#f5f5f5',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {r}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#888', alignSelf: 'center' }}>ID:</span>
          {idSuggestions.map((id) => (
            <button
              key={id}
              onClick={() => addPart(id)}
              style={{
                padding: '0.3rem 0.6rem',
                border: '1px solid #a5d6a7',
                borderRadius: '4px',
                background: '#f1f8e9',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              {id}
            </button>
          ))}
          <button
            onClick={removeLast}
            disabled={builder.parts.length === 0}
            style={{
              padding: '0.3rem 0.6rem',
              border: '1px solid #ef9a9a',
              borderRadius: '4px',
              background: '#fff5f5',
              cursor: builder.parts.length === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
              opacity: builder.parts.length === 0 ? 0.5 : 1,
            }}
          >
            ← удалить
          </button>
        </div>
      </div>

      {/* Query params */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>
          3. Query params (опционально, без знака ?)
        </div>
        <input
          value={builder.query}
          onChange={(e) => { setBuilder((b) => ({ ...b, query: e.target.value })); setChecked(false) }}
          placeholder="category=electronics&maxPrice=5000"
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '0.4rem 0.6rem',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontFamily: 'monospace',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Built URL preview */}
      <div
        style={{
          background: '#263238',
          color: '#80cbc4',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          marginBottom: '1rem',
        }}
      >
        <span style={{ color: '#ffcc02', marginRight: '0.75rem' }}>{builder.method}</span>
        {builtUrl}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={handleCheck}
          style={{
            padding: '0.5rem 1rem',
            background: '#1565c0',
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
          onClick={() => setShowHint((h) => !h)}
          style={{
            padding: '0.5rem 1rem',
            background: '#f5f5f5',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          {showHint ? 'Скрыть подсказку' : 'Подсказка'}
        </button>
        <button
          onClick={handleNext}
          style={{
            padding: '0.5rem 1rem',
            background: '#263238',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Следующий →
        </button>
      </div>

      {showHint && (
        <div
          style={{
            background: '#fff8e1',
            border: '1px solid #ffe082',
            borderRadius: '6px',
            padding: '0.75rem',
            marginBottom: '1rem',
            fontSize: '0.9rem',
          }}
        >
          💡 {scenario.hint}
        </div>
      )}

      {checked && (
        <div
          style={{
            background: isCorrect ? '#e8f5e9' : '#ffebee',
            border: `1px solid ${isCorrect ? '#a5d6a7' : '#ef9a9a'}`,
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            fontSize: '0.9rem',
          }}
        >
          {isCorrect ? (
            <span style={{ color: '#2e7d32' }}>✅ Верно! Отличный REST endpoint.</span>
          ) : (
            <div>
              <div style={{ color: '#c62828', marginBottom: '0.5rem' }}>❌ Не совсем. Правильный вариант:</div>
              <code
                style={{
                  display: 'block',
                  background: '#263238',
                  color: '#80cbc4',
                  padding: '0.5rem',
                  borderRadius: '4px',
                }}
              >
                {scenario.method} {correctUrl}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.2: Исправь ошибки в URL
// ============================================

interface BadUrl {
  id: number
  bad: string
  method: string
  fix: string
  fixMethod: string
  errorType: string
  explanation: string
}

const badUrls: BadUrl[] = [
  {
    id: 1,
    bad: '/api/getUsers',
    method: 'GET',
    fix: '/api/users',
    fixMethod: 'GET',
    errorType: 'Глагол в URL',
    explanation: 'URL описывает ресурс (существительное), а не действие. Действие — это HTTP-метод. GET /users — достаточно.',
  },
  {
    id: 2,
    bad: '/api/users/deleteUser/5',
    method: 'GET',
    fix: '/api/users/5',
    fixMethod: 'DELETE',
    errorType: 'Глагол в пути + неверный метод',
    explanation: 'Удаление выражается методом DELETE, а не глаголом в пути. "deleteUser" — лишнее и нарушает REST.',
  },
  {
    id: 3,
    bad: '/api/UserProfile',
    method: 'GET',
    fix: '/api/user-profiles',
    fixMethod: 'GET',
    errorType: 'PascalCase + единственное число',
    explanation: 'URL должны быть в lowercase. Для многословных ресурсов — дефисы. Коллекции — во множественном числе.',
  },
  {
    id: 4,
    bad: '/api/users?id=42&action=ban',
    method: 'POST',
    fix: '/api/users/42/ban',
    fixMethod: 'POST',
    explanation: 'Действия над ресурсом можно оформить как вложенный endpoint. "action=ban" в query — это RPC-стиль, не REST.',
    errorType: 'Действие в query params',
  },
  {
    id: 5,
    bad: '/api/get_product_list',
    method: 'GET',
    fix: '/api/products',
    fixMethod: 'GET',
    errorType: 'snake_case + глагол',
    explanation: 'В URL нет места ни snake_case (используйте kebab-case), ни глаголам. GET /products — чисто и ясно.',
  },
  {
    id: 6,
    bad: '/api/orders/create',
    method: 'GET',
    fix: '/api/orders',
    fixMethod: 'POST',
    errorType: 'Глагол "create" + неверный метод',
    explanation: 'Создание ресурса — POST на коллекцию. Суффикс /create и GET-метод для создания — двойная ошибка.',
  },
  {
    id: 7,
    bad: '/api/users/123/getOrders',
    method: 'GET',
    fix: '/api/users/123/orders',
    fixMethod: 'GET',
    errorType: 'Глагол в вложенном ресурсе',
    explanation: 'Вложенный ресурс — тоже существительное. "getOrders" → "orders". Метод GET уже говорит об операции.',
  },
  {
    id: 8,
    bad: '/api/blogPosts',
    method: 'GET',
    fix: '/api/blog-posts',
    fixMethod: 'GET',
    errorType: 'camelCase в URL',
    explanation: 'URL нечувствительны к регистру, но договорённость — lowercase с дефисами (kebab-case). blogPosts → blog-posts.',
  },
  {
    id: 9,
    bad: '/api/user',
    method: 'GET',
    fix: '/api/users',
    fixMethod: 'GET',
    errorType: 'Единственное число для коллекции',
    explanation: 'Коллекции — во множественном числе. /user — двусмысленно: это один пользователь или список?',
  },
  {
    id: 10,
    bad: '/api/products/search?q=phone',
    method: 'GET',
    fix: '/api/products?q=phone',
    fixMethod: 'GET',
    errorType: 'Глагол "search" в пути',
    explanation: 'Поиск — это фильтрация коллекции через query params, не отдельный endpoint. /search — исключение только для сложных поисков.',
  },
]

export function Task1_2_Solution() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const revealAll = () => setRevealed(new Set(badUrls.map((u) => u.id)))

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Исправь ошибки в URL</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Найдите проблему в каждом URL и попробуйте сформулировать исправление. Потом нажмите «Показать ответ».
      </p>

      <button
        onClick={revealAll}
        style={{
          marginBottom: '1.5rem',
          padding: '0.5rem 1rem',
          background: '#263238',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        Показать все ответы
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {badUrls.map((item) => {
          const isRevealed = revealed.has(item.id)
          return (
            <div
              key={item.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 1rem',
                  background: '#ffebee',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ color: '#b71c1c', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    #{item.id}
                  </span>
                  <code
                    style={{
                      background: '#c62828',
                      color: 'white',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                    }}
                  >
                    {item.method} {item.bad}
                  </code>
                  <span
                    style={{
                      background: '#fff3e0',
                      color: '#e65100',
                      border: '1px solid #ffcc02',
                      borderRadius: '4px',
                      padding: '0.15rem 0.5rem',
                      fontSize: '0.75rem',
                    }}
                  >
                    {item.errorType}
                  </span>
                </div>
                <button
                  onClick={() => toggle(item.id)}
                  style={{
                    padding: '0.3rem 0.7rem',
                    background: '#263238',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                  }}
                >
                  {isRevealed ? 'Скрыть' : 'Показать ответ'}
                </button>
              </div>

              {isRevealed && (
                <div style={{ padding: '0.75rem 1rem', background: '#f9f9f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#2e7d32', fontSize: '0.85rem', fontWeight: 'bold' }}>✅ Исправлено:</span>
                    <code
                      style={{
                        background: '#1b5e20',
                        color: '#a5d6a7',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                      }}
                    >
                      {item.fixMethod} {item.fix}
                    </code>
                  </div>
                  <p style={{ margin: 0, color: '#444', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {item.explanation}
                  </p>
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
// Задание 1.3: URL-схема блог-платформы
// ============================================

interface Endpoint {
  method: string
  url: string
  description: string
  notes?: string
}

interface ResourceGroup {
  resource: string
  emoji: string
  endpoints: Endpoint[]
}

const blogApiSchema: ResourceGroup[] = [
  {
    resource: 'Пользователи',
    emoji: '👤',
    endpoints: [
      { method: 'GET', url: '/api/users', description: 'Список всех пользователей' },
      { method: 'POST', url: '/api/users', description: 'Регистрация нового пользователя' },
      { method: 'GET', url: '/api/users/:id', description: 'Профиль пользователя' },
      { method: 'PATCH', url: '/api/users/:id', description: 'Обновить профиль (частично)' },
      { method: 'DELETE', url: '/api/users/:id', description: 'Удалить аккаунт' },
    ],
  },
  {
    resource: 'Посты',
    emoji: '📝',
    endpoints: [
      { method: 'GET', url: '/api/posts', description: 'Лента постов (с пагинацией)', notes: '?page=1&limit=20' },
      { method: 'POST', url: '/api/posts', description: 'Создать пост' },
      { method: 'GET', url: '/api/posts/:id', description: 'Получить пост' },
      { method: 'PUT', url: '/api/posts/:id', description: 'Заменить пост целиком' },
      { method: 'PATCH', url: '/api/posts/:id', description: 'Обновить поля поста' },
      { method: 'DELETE', url: '/api/posts/:id', description: 'Удалить пост' },
      { method: 'GET', url: '/api/users/:id/posts', description: 'Посты конкретного автора' },
      { method: 'POST', url: '/api/posts/:id/publish', description: 'Опубликовать пост (действие)', notes: 'RPC-исключение' },
    ],
  },
  {
    resource: 'Комментарии',
    emoji: '💬',
    endpoints: [
      { method: 'GET', url: '/api/posts/:id/comments', description: 'Комментарии к посту' },
      { method: 'POST', url: '/api/posts/:id/comments', description: 'Добавить комментарий' },
      { method: 'PATCH', url: '/api/posts/:postId/comments/:commentId', description: 'Редактировать комментарий' },
      { method: 'DELETE', url: '/api/posts/:postId/comments/:commentId', description: 'Удалить комментарий' },
    ],
  },
  {
    resource: 'Теги',
    emoji: '🏷️',
    endpoints: [
      { method: 'GET', url: '/api/tags', description: 'Все теги' },
      { method: 'GET', url: '/api/tags/:slug/posts', description: 'Посты с данным тегом' },
      { method: 'GET', url: '/api/posts?tag=javascript', description: 'Альтернатива: фильтр через query', notes: 'Плоский вариант' },
    ],
  },
]

const methodColors: Record<string, { bg: string; color: string }> = {
  GET: { bg: '#e8f5e9', color: '#2e7d32' },
  POST: { bg: '#e3f2fd', color: '#1565c0' },
  PUT: { bg: '#fff8e1', color: '#f57f17' },
  PATCH: { bg: '#fce4ec', color: '#880e4f' },
  DELETE: { bg: '#ffebee', color: '#b71c1c' },
}

export function Task1_3_Solution() {
  const [activeGroup, setActiveGroup] = useState<string | null>(null)

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>URL-схема блог-платформы</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Эталонная схема REST endpoints для блога. Изучите паттерны: коллекции, вложенность, действия.
        Нажмите на группу ресурсов, чтобы раскрыть её.
      </p>

      {/* Design principles */}
      <div
        style={{
          background: '#f3e5f5',
          border: '1px solid #ce93d8',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          lineHeight: '1.6',
        }}
      >
        <strong>Принципы схемы:</strong>
        <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem' }}>
          <li>Существительные во множественном числе: <code>/posts</code>, не <code>/post</code></li>
          <li>Вложенность для зависимых ресурсов: <code>/posts/:id/comments</code></li>
          <li>Query params для фильтров и пагинации: <code>?page=1&limit=20</code></li>
          <li>RPC-исключения для действий: <code>/posts/:id/publish</code></li>
          <li>Kebab-case в многословных ресурсах: <code>/blog-posts</code></li>
        </ul>
      </div>

      {blogApiSchema.map((group) => {
        const isOpen = activeGroup === group.resource
        return (
          <div
            key={group.resource}
            style={{
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              marginBottom: '0.75rem',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setActiveGroup(isOpen ? null : group.resource)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: isOpen ? '#263238' : '#f5f5f5',
                color: isOpen ? 'white' : '#333',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '0.95rem',
                fontWeight: 'bold',
              }}
            >
              <span>
                {group.emoji} {group.resource}
                <span style={{ fontWeight: 'normal', fontSize: '0.8rem', marginLeft: '0.5rem', opacity: 0.7 }}>
                  ({group.endpoints.length} endpoints)
                </span>
              </span>
              <span>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div style={{ padding: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#fafafa' }}>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0', width: '80px' }}>Метод</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>URL</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0' }}>Описание</th>
                      <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #e0e0e0', width: '120px' }}>Заметка</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.endpoints.map((ep, i) => {
                      const colors = methodColors[ep.method] ?? { bg: '#f5f5f5', color: '#333' }
                      return (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <td style={{ padding: '0.5rem' }}>
                            <span
                              style={{
                                background: colors.bg,
                                color: colors.color,
                                padding: '0.2rem 0.5rem',
                                borderRadius: '4px',
                                fontWeight: 'bold',
                                fontSize: '0.78rem',
                                fontFamily: 'monospace',
                              }}
                            >
                              {ep.method}
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem', fontFamily: 'monospace', color: '#1565c0' }}>
                            {ep.url}
                          </td>
                          <td style={{ padding: '0.5rem', color: '#444' }}>{ep.description}</td>
                          <td style={{ padding: '0.5rem', color: '#888', fontSize: '0.78rem' }}>
                            {ep.notes ?? '—'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}

      {/* Self-check questions */}
      <div
        style={{
          background: '#e8f5e9',
          border: '1px solid #a5d6a7',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginTop: '1rem',
          fontSize: '0.85rem',
        }}
      >
        <strong>Проверь себя:</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', lineHeight: '1.8' }}>
          <li>Почему <code>/api/posts/:id/publish</code> — нормально, а <code>/api/posts/create</code> — нет?</li>
          <li>Чем отличаются <code>/api/tags/:slug/posts</code> и <code>/api/posts?tag=javascript</code>? Когда использовать каждый?</li>
          <li>Зачем для обновления поста есть и PUT, и PATCH?</li>
        </ol>
      </div>
    </div>
  )
}
