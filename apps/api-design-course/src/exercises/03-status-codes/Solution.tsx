import { useState } from 'react'

// ============================================
// Task 3.1: Status Code Reference
// ============================================

interface StatusCode {
  code: number
  name: string
  description: string
  whenToUse: string
  example: string
  group: number
}

const statusCodes: StatusCode[] = [
  // 1xx
  {
    code: 100,
    name: 'Continue',
    description: 'Сервер получил заголовки запроса и клиент может продолжать отправку тела.',
    whenToUse: 'При загрузке больших файлов с заголовком Expect: 100-continue.',
    example: 'Клиент проверяет, принимает ли сервер большой файл перед отправкой.',
    group: 1,
  },
  {
    code: 101,
    name: 'Switching Protocols',
    description: 'Сервер согласен переключить протокол (например, HTTP → WebSocket).',
    whenToUse: 'При установке WebSocket-соединения через Upgrade: websocket.',
    example: 'GET /chat → Upgrade: websocket → 101 Switching Protocols.',
    group: 1,
  },
  // 2xx
  {
    code: 200,
    name: 'OK',
    description: 'Запрос успешно выполнен. Тело ответа содержит запрошенные данные.',
    whenToUse: 'GET-запросы, успешные PUT/PATCH/POST без создания нового ресурса.',
    example: 'GET /users/42 → 200 OK + { "id": 42, "name": "Иван" }',
    group: 2,
  },
  {
    code: 201,
    name: 'Created',
    description: 'Ресурс успешно создан. В заголовке Location — URL нового ресурса.',
    whenToUse: 'После успешного POST-запроса на создание ресурса.',
    example: 'POST /users → 201 Created + Location: /users/42',
    group: 2,
  },
  {
    code: 204,
    name: 'No Content',
    description: 'Запрос выполнен успешно. Тело ответа отсутствует.',
    whenToUse: 'DELETE-запросы, PUT/PATCH когда не нужно возвращать обновлённый ресурс.',
    example: 'DELETE /users/42 → 204 No Content (тело пустое)',
    group: 2,
  },
  {
    code: 206,
    name: 'Partial Content',
    description: 'Сервер возвращает только часть ресурса по запросу Range.',
    whenToUse: 'При стриминге видео, возобновляемых загрузках файлов.',
    example: 'GET /video.mp4 Range: bytes=0-1023 → 206 + первые 1024 байта',
    group: 2,
  },
  // 3xx
  {
    code: 301,
    name: 'Moved Permanently',
    description: 'Ресурс перемещён навсегда на новый URL (в заголовке Location).',
    whenToUse: 'При постоянном переименовании endpoint или переезде домена.',
    example: '/api/v1/users → 301 → /api/v2/users (клиент обновляет закладки)',
    group: 3,
  },
  {
    code: 302,
    name: 'Found',
    description: 'Ресурс временно доступен по другому URL.',
    whenToUse: 'Временные редиректы, OAuth-авторизация.',
    example: 'Редирект на страницу входа при незалогиненном пользователе.',
    group: 3,
  },
  {
    code: 304,
    name: 'Not Modified',
    description: 'Ресурс не изменился с момента последнего запроса. Использовать кэш.',
    whenToUse: 'При условных запросах с If-None-Match или If-Modified-Since.',
    example: 'GET /logo.png + If-None-Match: "abc123" → 304 (берём из кэша)',
    group: 3,
  },
  // 4xx
  {
    code: 400,
    name: 'Bad Request',
    description: 'Запрос некорректен: неверный синтаксис, невалидные данные.',
    whenToUse: 'Когда клиент отправил явно некорректный запрос (сломанный JSON, неверный тип).',
    example: 'POST /users с телом "not a json{" → 400 Bad Request',
    group: 4,
  },
  {
    code: 401,
    name: 'Unauthorized',
    description: 'Требуется аутентификация. Клиент не идентифицирован.',
    whenToUse: 'Когда запрос без токена или с невалидным токеном к защищённому ресурсу.',
    example: 'GET /profile без Authorization → 401 (нет токена или токен устарел)',
    group: 4,
  },
  {
    code: 403,
    name: 'Forbidden',
    description: 'Доступ запрещён. Клиент аутентифицирован, но не имеет прав.',
    whenToUse: 'Когда пользователь авторизован, но пытается получить чужие данные или сделать недоступное действие.',
    example: 'GET /admin/users (user — обычный пользователь, не admin) → 403',
    group: 4,
  },
  {
    code: 404,
    name: 'Not Found',
    description: 'Ресурс не найден. Может означать, что ресурс никогда не существовал или был удалён.',
    whenToUse: 'Когда запрошенный ресурс отсутствует в системе.',
    example: 'GET /users/99999 → 404 (пользователя с таким ID нет)',
    group: 4,
  },
  {
    code: 405,
    name: 'Method Not Allowed',
    description: 'HTTP-метод не поддерживается для данного endpoint.',
    whenToUse: 'Когда пытаются, например, DELETE /users (коллекцию нельзя удалять целиком).',
    example: 'DELETE /users → 405 (разрешены только GET, POST)',
    group: 4,
  },
  {
    code: 409,
    name: 'Conflict',
    description: 'Конфликт с текущим состоянием ресурса.',
    whenToUse: 'Попытка создать дублирующий ресурс, конфликт версий при оптимистичной блокировке.',
    example: 'POST /users { "email": "test@example.com" } → 409 (email уже занят)',
    group: 4,
  },
  {
    code: 410,
    name: 'Gone',
    description: 'Ресурс удалён и больше не будет доступен.',
    whenToUse: 'Когда нужно явно сообщить, что ресурс существовал, но был удалён навсегда.',
    example: 'GET /users/deleted-user → 410 Gone (не 404, а именно удалён)',
    group: 4,
  },
  {
    code: 422,
    name: 'Unprocessable Entity',
    description: 'Запрос синтаксически корректен, но содержит семантические ошибки.',
    whenToUse: 'Ошибки валидации полей: невалидный email, пароль слишком короткий и т.д.',
    example: 'POST /users { "email": "not-an-email" } → 422 + список ошибок валидации',
    group: 4,
  },
  {
    code: 429,
    name: 'Too Many Requests',
    description: 'Клиент превысил лимит запросов (rate limit).',
    whenToUse: 'При превышении rate limit. Ответ должен содержать Retry-After заголовок.',
    example: 'Более 100 запросов в минуту → 429 + Retry-After: 60',
    group: 4,
  },
  // 5xx
  {
    code: 500,
    name: 'Internal Server Error',
    description: 'Неожиданная ошибка на сервере. Запрос корректен, но сервер не смог его обработать.',
    whenToUse: 'Непредвиденные исключения, падение зависимостей, баги в бизнес-логике.',
    example: 'Неперехваченное исключение в обработчике → 500 Internal Server Error',
    group: 5,
  },
  {
    code: 502,
    name: 'Bad Gateway',
    description: 'Шлюз получил недействительный ответ от вышестоящего сервера.',
    whenToUse: 'Nginx/Load Balancer не смог получить ответ от backend-сервиса.',
    example: 'API Gateway → Backend упал → 502 Bad Gateway клиенту',
    group: 5,
  },
  {
    code: 503,
    name: 'Service Unavailable',
    description: 'Сервер временно недоступен: перегружен или на обслуживании.',
    whenToUse: 'При деплое, плановых работах. Ответ должен содержать Retry-After.',
    example: 'Сервис на обслуживании → 503 + Retry-After: 3600',
    group: 5,
  },
  {
    code: 504,
    name: 'Gateway Timeout',
    description: 'Шлюз не получил ответ от вышестоящего сервера вовремя.',
    whenToUse: 'Долгая обработка запроса backend-сервисом, истёк таймаут.',
    example: 'Запрос к медленной БД завис → Nginx даёт 504 после 30 сек',
    group: 5,
  },
]

const groupConfig: Record<number, { label: string; color: string; bg: string; border: string }> = {
  1: { label: '1xx Информационные', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  2: { label: '2xx Успех', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  3: { label: '3xx Редиректы', color: '#ca8a04', bg: '#fefce8', border: '#fde047' },
  4: { label: '4xx Ошибки клиента', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  5: { label: '5xx Ошибки сервера', color: '#9333ea', bg: '#fdf4ff', border: '#e9d5ff' },
}

export function Task3_1_Solution() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [expandedCode, setExpandedCode] = useState<number | null>(null)

  const filtered = statusCodes.filter(sc => {
    const matchesGroup = selectedGroup === null || sc.group === selectedGroup
    const query = search.toLowerCase()
    const matchesSearch =
      !query ||
      String(sc.code).includes(query) ||
      sc.name.toLowerCase().includes(query) ||
      sc.description.toLowerCase().includes(query)
    return matchesGroup && matchesSearch
  })

  const groups = [1, 2, 3, 4, 5]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Справочник статус-кодов HTTP</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Нажмите на карточку — узнайте, когда использовать код и пример из реальной жизни.
      </p>

      {/* Фильтры по группам */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setSelectedGroup(null)}
          style={{
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            border: `2px solid ${selectedGroup === null ? '#374151' : '#d1d5db'}`,
            background: selectedGroup === null ? '#374151' : '#fff',
            color: selectedGroup === null ? '#fff' : '#374151',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.85rem',
          }}
        >
          Все
        </button>
        {groups.map(g => {
          const cfg = groupConfig[g]
          const active = selectedGroup === g
          return (
            <button
              key={g}
              onClick={() => setSelectedGroup(active ? null : g)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                border: `2px solid ${active ? cfg.color : cfg.border}`,
                background: active ? cfg.color : cfg.bg,
                color: active ? '#fff' : cfg.color,
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
              }}
            >
              {cfg.label}
            </button>
          )
        })}
      </div>

      {/* Поиск */}
      <input
        type="text"
        placeholder="Найти по коду или названию..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          boxSizing: 'border-box',
          outline: 'none',
        }}
      />

      {/* Список кодов */}
      {groups.map(g => {
        const groupItems = filtered.filter(sc => sc.group === g)
        if (groupItems.length === 0) return null
        const cfg = groupConfig[g]
        return (
          <div key={g} style={{ marginBottom: '1.5rem' }}>
            <h3
              style={{
                color: cfg.color,
                fontSize: '0.95rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.75rem',
                borderBottom: `2px solid ${cfg.border}`,
                paddingBottom: '0.4rem',
              }}
            >
              {cfg.label}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {groupItems.map(sc => {
                const isOpen = expandedCode === sc.code
                return (
                  <div
                    key={sc.code}
                    onClick={() => setExpandedCode(isOpen ? null : sc.code)}
                    style={{
                      border: `1px solid ${isOpen ? cfg.color : cfg.border}`,
                      borderRadius: '8px',
                      background: cfg.bg,
                      cursor: 'pointer',
                      overflow: 'hidden',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '1.1rem',
                          color: cfg.color,
                          minWidth: '3rem',
                          fontFamily: 'monospace',
                        }}
                      >
                        {sc.code}
                      </span>
                      <span style={{ fontWeight: 600, color: '#1f2937' }}>{sc.name}</span>
                      <span
                        style={{
                          color: '#6b7280',
                          fontSize: '0.88rem',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: isOpen ? 'normal' : 'nowrap',
                        }}
                      >
                        {sc.description}
                      </span>
                      <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
                        {isOpen ? '▲' : '▼'}
                      </span>
                    </div>
                    {isOpen && (
                      <div
                        style={{
                          padding: '0 1rem 1rem',
                          borderTop: `1px solid ${cfg.border}`,
                          paddingTop: '0.75rem',
                        }}
                      >
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span
                            style={{
                              fontWeight: 600,
                              color: cfg.color,
                              fontSize: '0.85rem',
                              textTransform: 'uppercase',
                            }}
                          >
                            Когда использовать:
                          </span>
                          <p style={{ margin: '0.25rem 0 0', color: '#374151', fontSize: '0.9rem' }}>
                            {sc.whenToUse}
                          </p>
                        </div>
                        <div>
                          <span
                            style={{
                              fontWeight: 600,
                              color: cfg.color,
                              fontSize: '0.85rem',
                              textTransform: 'uppercase',
                            }}
                          >
                            Пример:
                          </span>
                          <p
                            style={{
                              margin: '0.25rem 0 0',
                              color: '#374151',
                              fontSize: '0.88rem',
                              fontFamily: 'monospace',
                              background: '#f9fafb',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                            }}
                          >
                            {sc.example}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}

      {filtered.length === 0 && (
        <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>
          Ничего не найдено. Попробуйте другой запрос.
        </p>
      )}
    </div>
  )
}

// ============================================
// Task 3.2: Error Response Builder (RFC 7807)
// ============================================

interface ErrorScenario {
  id: string
  label: string
  description: string
  template: {
    type: string
    title: string
    status: number
    detail: string
    instance: string
    errors?: Array<{ field: string; message: string }>
  }
}

const errorScenarios: ErrorScenario[] = [
  {
    id: 'validation',
    label: 'Ошибка валидации',
    description: 'Клиент прислал невалидные данные формы',
    template: {
      type: 'https://api.example.com/errors/validation-failed',
      title: 'Validation Failed',
      status: 422,
      detail: 'One or more fields did not pass validation.',
      instance: '/api/users',
      errors: [
        { field: 'email', message: 'Must be a valid email address' },
        { field: 'password', message: 'Must be at least 8 characters' },
      ],
    },
  },
  {
    id: 'not-found',
    label: 'Ресурс не найден',
    description: 'Запрошенный ресурс отсутствует',
    template: {
      type: 'https://api.example.com/errors/not-found',
      title: 'Resource Not Found',
      status: 404,
      detail: 'No user with id=42 was found in the system.',
      instance: '/api/users/42',
    },
  },
  {
    id: 'conflict',
    label: 'Конфликт данных',
    description: 'Попытка создать дублирующую запись',
    template: {
      type: 'https://api.example.com/errors/conflict',
      title: 'Resource Conflict',
      status: 409,
      detail: 'A user with email "john@example.com" already exists.',
      instance: '/api/users',
    },
  },
  {
    id: 'rate-limit',
    label: 'Rate Limit превышен',
    description: 'Клиент отправил слишком много запросов',
    template: {
      type: 'https://api.example.com/errors/rate-limit-exceeded',
      title: 'Too Many Requests',
      status: 429,
      detail: 'You have exceeded the limit of 100 requests per minute. Please retry after 60 seconds.',
      instance: '/api/users',
    },
  },
  {
    id: 'forbidden',
    label: 'Доступ запрещён',
    description: 'Пользователь авторизован, но нет прав',
    template: {
      type: 'https://api.example.com/errors/forbidden',
      title: 'Forbidden',
      status: 403,
      detail: 'You do not have permission to delete other users\' resources.',
      instance: '/api/users/99/posts/1',
    },
  },
]

interface ErrorFields {
  type: string
  title: string
  status: number
  detail: string
  instance: string
}

export function Task3_2_Solution() {
  const [selectedScenario, setSelectedScenario] = useState<string>(errorScenarios[0].id)
  const [fields, setFields] = useState<ErrorFields>({
    type: errorScenarios[0].template.type,
    title: errorScenarios[0].template.title,
    status: errorScenarios[0].template.status,
    detail: errorScenarios[0].template.detail,
    instance: errorScenarios[0].template.instance,
  })
  const [showErrors, setShowErrors] = useState(false)

  const scenario = errorScenarios.find(s => s.id === selectedScenario)!

  const handleScenarioChange = (id: string) => {
    const s = errorScenarios.find(sc => sc.id === id)!
    setSelectedScenario(id)
    setFields({
      type: s.template.type,
      title: s.template.title,
      status: s.template.status,
      detail: s.template.detail,
      instance: s.template.instance,
    })
    setShowErrors(false)
  }

  const getStatusColor = (status: number) => {
    if (status < 300) return '#16a34a'
    if (status < 400) return '#ca8a04'
    if (status < 500) return '#dc2626'
    return '#9333ea'
  }

  const resultJson: Record<string, unknown> = {
    type: fields.type,
    title: fields.title,
    status: fields.status,
    detail: fields.detail,
    instance: fields.instance,
  }

  if (showErrors && scenario.template.errors) {
    resultJson['errors'] = scenario.template.errors
  }

  const jsonString = JSON.stringify(resultJson, null, 2)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '860px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Конструктор ошибок по RFC 7807</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Выберите сценарий, настройте поля и получите готовый error response в формате Problem Details.
      </p>

      {/* Выбор сценария */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
          Сценарий ошибки:
        </label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {errorScenarios.map(s => (
            <button
              key={s.id}
              onClick={() => handleScenarioChange(s.id)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: `2px solid ${selectedScenario === s.id ? getStatusColor(s.template.status) : '#e5e7eb'}`,
                background: selectedScenario === s.id ? getStatusColor(s.template.status) : '#fff',
                color: selectedScenario === s.id ? '#fff' : '#374151',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '0.85rem',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p style={{ color: '#6b7280', fontSize: '0.88rem', marginTop: '0.5rem' }}>
          {scenario.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Редактор полей */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#374151' }}>
            Поля RFC 7807:
          </h3>

          {[
            {
              key: 'type' as const,
              label: 'type',
              hint: 'URI, идентифицирующий тип ошибки',
              type: 'text',
            },
            {
              key: 'title' as const,
              label: 'title',
              hint: 'Краткое человекочитаемое описание',
              type: 'text',
            },
            {
              key: 'status' as const,
              label: 'status',
              hint: 'HTTP-статус код',
              type: 'number',
            },
            {
              key: 'detail' as const,
              label: 'detail',
              hint: 'Подробное объяснение конкретной ошибки',
              type: 'textarea',
            },
            {
              key: 'instance' as const,
              label: 'instance',
              hint: 'URI конкретного вхождения проблемы',
              type: 'text',
            },
          ].map(({ key, label, hint, type }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: 'monospace',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  color: '#4f46e5',
                  marginBottom: '0.2rem',
                }}
              >
                {label}
              </label>
              <span style={{ display: 'block', fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
                {hint}
              </span>
              {type === 'textarea' ? (
                <textarea
                  value={String(fields[key])}
                  onChange={e => setFields(prev => ({ ...prev, [key]: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              ) : (
                <input
                  type={type}
                  value={String(fields[key])}
                  onChange={e =>
                    setFields(prev => ({
                      ...prev,
                      [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                    }))
                  }
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.85rem',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>
          ))}

          {scenario.template.errors && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <input
                type="checkbox"
                checked={showErrors}
                onChange={e => setShowErrors(e.target.checked)}
              />
              <span style={{ fontSize: '0.88rem' }}>
                Добавить массив <code style={{ color: '#4f46e5' }}>errors</code> (ошибки по полям)
              </span>
            </label>
          )}
        </div>

        {/* Результирующий JSON */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: '#374151' }}>
            Результат:
          </h3>
          <div
            style={{
              background: '#1e1e2e',
              borderRadius: '8px',
              padding: '1rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              color: '#cdd6f4',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              minHeight: '200px',
            }}
          >
            {jsonString}
          </div>

          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#f0fdf4',
              borderRadius: '8px',
              border: '1px solid #bbf7d0',
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: '0.85rem',
                color: '#166534',
                fontWeight: 600,
              }}
            >
              Content-Type:
            </p>
            <code style={{ fontSize: '0.82rem', color: '#15803d' }}>
              application/problem+json
            </code>
          </div>

          <div
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              background: '#fef2f2',
              borderRadius: '8px',
              border: '1px solid #fecaca',
            }}
          >
            <p style={{ margin: 0, fontSize: '0.82rem', color: '#dc2626', fontWeight: 600 }}>
              HTTP {fields.status}
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#991b1b' }}>
              {fields.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 3.3: Status Code Self-Check
// ============================================

interface Scenario {
  id: number
  situation: string
  hint: string
  correctCode: number
  correctName: string
  explanation: string
  wrongCodes: Array<{ code: number; name: string; why: string }>
}

const scenarios: Scenario[] = [
  {
    id: 1,
    situation: 'POST /orders — заказ успешно создан, в базе появилась новая запись',
    hint: 'Ресурс только что появился. Что отличает "создали" от "выполнили"?',
    correctCode: 201,
    correctName: 'Created',
    explanation:
      '201 Created сигнализирует, что ресурс был создан. Ответ должен содержать заголовок Location с URL нового заказа.',
    wrongCodes: [
      {
        code: 200,
        name: 'OK',
        why: '200 означает "успешно выполнено", но не акцентирует создание. Клиент не знает, нужно ли ему обновить Location.',
      },
      {
        code: 204,
        name: 'No Content',
        why: '204 говорит "успешно, но нечего возвращать". При создании нужно вернуть новый объект и его URL.',
      },
    ],
  },
  {
    id: 2,
    situation: 'DELETE /tasks/42 — задача успешно удалена, ответ без тела',
    hint: 'Операция выполнена, но возвращать нечего.',
    correctCode: 204,
    correctName: 'No Content',
    explanation:
      '204 No Content — стандарт для DELETE и других операций, где нет смысла возвращать тело. Клиент знает: успешно.',
    wrongCodes: [
      {
        code: 200,
        name: 'OK',
        why: '200 с пустым телом технически работает, но 204 семантически чище — явно говорит "контента нет".',
      },
      {
        code: 202,
        name: 'Accepted',
        why: '202 означает "принято к обработке", то есть удаление ещё не произошло. Это не наш случай.',
      },
    ],
  },
  {
    id: 3,
    situation: 'GET /profile — запрос без заголовка Authorization к защищённому ресурсу',
    hint: 'Сервер не знает, кто вы. Вы вообще представились?',
    correctCode: 401,
    correctName: 'Unauthorized',
    explanation:
      '401 Unauthorized (точнее — Unauthenticated): клиент не аутентифицирован. Ответ должен содержать WWW-Authenticate заголовок.',
    wrongCodes: [
      {
        code: 403,
        name: 'Forbidden',
        why: '403 — пользователь известен системе, но ему запрещено. 401 — сервер не знает, кто это вообще.',
      },
      {
        code: 404,
        name: 'Not Found',
        why: '404 в этом контексте — security через obscurity. Иногда используется намеренно, но правильно — 401.',
      },
    ],
  },
  {
    id: 4,
    situation: 'GET /admin/reports — пользователь авторизован, но роль "user", не "admin"',
    hint: 'Мы знаем, кто вы. Но сюда вам нельзя.',
    correctCode: 403,
    correctName: 'Forbidden',
    explanation:
      '403 Forbidden: сервер знает личность клиента, но отказывает в доступе. Аутентифицирован, но не авторизован.',
    wrongCodes: [
      {
        code: 401,
        name: 'Unauthorized',
        why: '401 означает "не знаем, кто вы". Но пользователь уже залогинен — проблема в правах, а не в идентификации.',
      },
      {
        code: 404,
        name: 'Not Found',
        why: 'Иногда возвращают 404, чтобы скрыть существование ресурса. Но 403 честнее и правильнее в большинстве случаев.',
      },
    ],
  },
  {
    id: 5,
    situation: 'GET /users/99999 — пользователя с таким ID нет в базе',
    hint: 'Искали — не нашли.',
    correctCode: 404,
    correctName: 'Not Found',
    explanation:
      '404 Not Found — ресурс не существует. Важно: не "неверный запрос", а именно "нет такого объекта".',
    wrongCodes: [
      {
        code: 400,
        name: 'Bad Request',
        why: '400 — клиент отправил некорректный запрос. Но /users/99999 — синтаксически правильный запрос, просто ресурса нет.',
      },
      {
        code: 204,
        name: 'No Content',
        why: '204 означает "успешно, но пусто". Отсутствие ресурса — это не успех. Клиент должен знать: ресурса нет.',
      },
    ],
  },
  {
    id: 6,
    situation: 'POST /users — email "test@example.com" уже зарегистрирован в системе',
    hint: 'Данные корректны, но создать нельзя — такой уже есть.',
    correctCode: 409,
    correctName: 'Conflict',
    explanation:
      '409 Conflict — конфликт с текущим состоянием ресурса. Данные валидны, но создание нарушило бы уникальность.',
    wrongCodes: [
      {
        code: 400,
        name: 'Bad Request',
        why: '400 — неверный формат данных. Email валиден, просто уже занят. Это конфликт бизнес-логики, а не ошибка синтаксиса.',
      },
      {
        code: 422,
        name: 'Unprocessable Entity',
        why: '422 — семантическая ошибка в данных. Дублирование — это конфликт состояния, а не невалидное значение.',
      },
    ],
  },
  {
    id: 7,
    situation: 'POST /users — поле email содержит "not-an-email", password содержит "123"',
    hint: 'Синтаксис JSON правильный, но значения не соответствуют правилам.',
    correctCode: 422,
    correctName: 'Unprocessable Entity',
    explanation:
      '422 Unprocessable Entity — запрос синтаксически корректен, но данные не проходят бизнес-валидацию. Нужно вернуть список ошибок по полям.',
    wrongCodes: [
      {
        code: 400,
        name: 'Bad Request',
        why: '400 — "сломанный" запрос (невалидный JSON, неверный тип). 422 — правильный JSON с невалидными значениями.',
      },
      {
        code: 409,
        name: 'Conflict',
        why: '409 — конфликт с существующими данными. Здесь проблема в самих значениях, а не в дублировании.',
      },
    ],
  },
  {
    id: 8,
    situation: 'Сервер упал из-за необработанного исключения в коде',
    hint: 'Запрос правильный, но что-то пошло не так на сервере.',
    correctCode: 500,
    correctName: 'Internal Server Error',
    explanation:
      '500 Internal Server Error — непредвиденная ошибка на стороне сервера. Клиент не виноват. Нужно логировать и алертить команду.',
    wrongCodes: [
      {
        code: 400,
        name: 'Bad Request',
        why: '400 — это вина клиента. Если сервер упал из-за своего бага — это 5xx, не 4xx.',
      },
      {
        code: 503,
        name: 'Service Unavailable',
        why: '503 — сервис временно недоступен (например, на обслуживании). 500 — сервер работает, но упал при обработке.',
      },
    ],
  },
  {
    id: 9,
    situation: 'Клиент отправил 150 запросов за минуту при лимите 100/мин',
    hint: 'Запрос корректен, но их слишком много.',
    correctCode: 429,
    correctName: 'Too Many Requests',
    explanation:
      '429 Too Many Requests — rate limit превышен. Ответ должен содержать Retry-After, чтобы клиент знал, когда повторить.',
    wrongCodes: [
      {
        code: 403,
        name: 'Forbidden',
        why: '403 — постоянный запрет по правам. 429 — временное ограничение по частоте. Это принципиально разные смыслы.',
      },
      {
        code: 503,
        name: 'Service Unavailable',
        why: '503 — сервер перегружен/на обслуживании. 429 — именно rate limit конкретного клиента.',
      },
    ],
  },
  {
    id: 10,
    situation: 'API Gateway не получил ответ от backend-сервиса за 30 секунд',
    hint: 'Вышестоящий сервис ответил, но ждал слишком долго.',
    correctCode: 504,
    correctName: 'Gateway Timeout',
    explanation:
      '504 Gateway Timeout — шлюз не дождался ответа от upstream-сервиса. Отличается от 503 (сервис недоступен) и 500 (ошибка в самом сервисе).',
    wrongCodes: [
      {
        code: 500,
        name: 'Internal Server Error',
        why: '500 — ошибка внутри самого сервиса. 504 — проблема с взаимодействием между сервисами (timeout).',
      },
      {
        code: 502,
        name: 'Bad Gateway',
        why: '502 — шлюз получил невалидный ответ. 504 — шлюз вообще не получил ответ (timeout).',
      },
    ],
  },
]

type UserAnswer = {
  selected: number | null
  revealed: boolean
}

export function Task3_3_Solution() {
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>(
    Object.fromEntries(scenarios.map(s => [s.id, { selected: null, revealed: false }]))
  )
  const [currentScenario, setCurrentScenario] = useState(0)

  const scenario = scenarios[currentScenario]
  const answer = answers[scenario.id]

  const allCodes = [scenario.correctCode, ...scenario.wrongCodes.map(w => w.code)].sort(
    () => Math.random() - 0.5
  )

  // Stable options order per scenario
  const optionOrders: Record<number, number[]> = Object.fromEntries(
    scenarios.map(s => [
      s.id,
      [...[s.correctCode, ...s.wrongCodes.map(w => w.code)]].sort((a, b) => a - b),
    ])
  )

  const orderedCodes = optionOrders[scenario.id]

  const isCorrect = answer.selected === scenario.correctCode

  const score = scenarios.filter(s => answers[s.id].selected === s.correctCode).length
  const answered = scenarios.filter(s => answers[s.id].selected !== null).length

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '760px' }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Угадай статус-код</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Выберите правильный HTTP-статус для каждого сценария. Объяснение появится после ответа.
      </p>

      {/* Прогресс */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '0.75rem 1rem',
          background: '#f9fafb',
          borderRadius: '8px',
        }}
      >
        <span style={{ fontWeight: 600, color: '#374151' }}>
          {score}/{scenarios.length}
        </span>
        <div style={{ flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
          <div
            style={{
              width: `${(answered / scenarios.length) * 100}%`,
              height: '100%',
              background: '#6366f1',
              borderRadius: '4px',
              transition: 'width 0.3s',
            }}
          />
        </div>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          {answered}/{scenarios.length} отвечено
        </span>
      </div>

      {/* Навигация по сценариям */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
        {scenarios.map((s, idx) => {
          const a = answers[s.id]
          const done = a.selected !== null
          const correct = a.selected === s.correctCode
          return (
            <button
              key={s.id}
              onClick={() => setCurrentScenario(idx)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: `2px solid ${currentScenario === idx ? '#6366f1' : done ? (correct ? '#16a34a' : '#dc2626') : '#d1d5db'}`,
                background: currentScenario === idx ? '#6366f1' : done ? (correct ? '#f0fdf4' : '#fef2f2') : '#fff',
                color: currentScenario === idx ? '#fff' : done ? (correct ? '#16a34a' : '#dc2626') : '#374151',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      {/* Карточка сценария */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#6366f1',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}
        >
          Сценарий {scenario.id} из {scenarios.length}
        </div>
        <p style={{ fontSize: '1rem', color: '#1e293b', fontWeight: 500, marginBottom: '0.75rem' }}>
          {scenario.situation}
        </p>
        <p style={{ fontSize: '0.875rem', color: '#64748b', fontStyle: 'italic', margin: 0 }}>
          💡 {scenario.hint}
        </p>
      </div>

      {/* Варианты ответов */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {orderedCodes.map(code => {
          const isSelected = answer.selected === code
          const isThisCorrect = code === scenario.correctCode
          const wrongInfo = scenario.wrongCodes.find(w => w.code === code)

          let borderColor = '#e5e7eb'
          let bg = '#fff'
          let textColor = '#374151'

          if (answer.revealed) {
            if (isThisCorrect) {
              borderColor = '#16a34a'
              bg = '#f0fdf4'
              textColor = '#166534'
            } else if (isSelected) {
              borderColor = '#dc2626'
              bg = '#fef2f2'
              textColor = '#991b1b'
            }
          } else if (isSelected) {
            borderColor = '#6366f1'
            bg = '#eef2ff'
            textColor = '#4338ca'
          }

          return (
            <div key={code}>
              <button
                onClick={() => {
                  if (!answer.revealed) {
                    setAnswers(prev => ({
                      ...prev,
                      [scenario.id]: { selected: code, revealed: true },
                    }))
                  }
                }}
                disabled={answer.revealed}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  border: `2px solid ${borderColor}`,
                  background: bg,
                  color: textColor,
                  cursor: answer.revealed ? 'default' : 'pointer',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  transition: 'all 0.15s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '1rem',
                    minWidth: '3rem',
                  }}
                >
                  {code}
                </span>
                <span>
                  {statusCodes.find(sc => sc.code === code)?.name || ''}
                </span>
                {answer.revealed && isThisCorrect && (
                  <span style={{ marginLeft: 'auto' }}>✅</span>
                )}
                {answer.revealed && isSelected && !isThisCorrect && (
                  <span style={{ marginLeft: 'auto' }}>❌</span>
                )}
              </button>
              {answer.revealed && wrongInfo && (
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#fef9f0',
                    border: '1px solid #fde68a',
                    borderTop: 'none',
                    borderRadius: '0 0 6px 6px',
                    fontSize: '0.82rem',
                    color: '#92400e',
                  }}
                >
                  Почему не {code}: {wrongInfo.why}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Объяснение правильного ответа */}
      {answer.revealed && (
        <div
          style={{
            padding: '1rem',
            background: isCorrect ? '#f0fdf4' : '#fef2f2',
            border: `1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}`,
            borderRadius: '8px',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              margin: '0 0 0.5rem',
              fontWeight: 600,
              color: isCorrect ? '#166534' : '#991b1b',
            }}
          >
            {isCorrect ? '✅ Верно!' : `❌ Неверно. Правильный ответ: ${scenario.correctCode} ${scenario.correctName}`}
          </p>
          <p style={{ margin: 0, color: '#374151', fontSize: '0.9rem' }}>
            {scenario.explanation}
          </p>
        </div>
      )}

      {/* Кнопки навигации */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={() => setCurrentScenario(prev => Math.max(0, prev - 1))}
          disabled={currentScenario === 0}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: currentScenario === 0 ? 'not-allowed' : 'pointer',
            color: currentScenario === 0 ? '#9ca3af' : '#374151',
          }}
        >
          ← Назад
        </button>
        <button
          onClick={() =>
            setCurrentScenario(prev => Math.min(scenarios.length - 1, prev + 1))
          }
          disabled={currentScenario === scenarios.length - 1}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: '1px solid #6366f1',
            background: currentScenario === scenarios.length - 1 ? '#e5e7eb' : '#6366f1',
            color: currentScenario === scenarios.length - 1 ? '#9ca3af' : '#fff',
            cursor: currentScenario === scenarios.length - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Вперёд →
        </button>
        <button
          onClick={() => {
            setAnswers(
              Object.fromEntries(scenarios.map(s => [s.id, { selected: null, revealed: false }]))
            )
            setCurrentScenario(0)
          }}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: '#fff',
            cursor: 'pointer',
            color: '#374151',
            marginLeft: 'auto',
          }}
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}
