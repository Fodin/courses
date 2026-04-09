import { useState } from 'react'

// ============================================
// Задание 7.1: Анатомия OpenAPI-документа
// ============================================

type SectionId = 'openapi' | 'info' | 'servers' | 'paths' | 'components'

interface SectionInfo {
  id: SectionId
  title: string
  required: boolean
  color: string
  icon: string
  description: string
  details: string
  example: string
}

const OPENAPI_SECTIONS: SectionInfo[] = [
  {
    id: 'openapi',
    title: 'openapi',
    required: true,
    color: '#6366f1',
    icon: '🔖',
    description: 'Версия спецификации OpenAPI',
    details:
      'Обязательное поле. Указывает, какая версия OpenAPI используется для описания этого документа. ' +
      'Текущая стабильная версия — 3.0.3. Версия 3.1 добавила полную совместимость с JSON Schema.',
    example: 'openapi: "3.0.3"',
  },
  {
    id: 'info',
    title: 'info',
    required: true,
    color: '#0ea5e9',
    icon: '📋',
    description: 'Метаданные API: название, версия, описание',
    details:
      'Обязательная секция. Содержит человекочитаемую информацию об API: ' +
      'title (название), version (версия API, не путать с версией OpenAPI), description (описание), ' +
      'contact (контакты команды), license (лицензия).',
    example: `info:
  title: Todo API
  version: "1.0.0"
  description: API для управления задачами
  contact:
    name: API Team
    email: api@example.com`,
  },
  {
    id: 'servers',
    title: 'servers',
    required: false,
    color: '#10b981',
    icon: '🌐',
    description: 'Список серверов, на которых доступен API',
    details:
      'Необязательная секция. Перечисляет серверы, где задеплоен API. ' +
      'Если опустить — по умолчанию считается, что API доступен на том же хосте, ' +
      'где находится документ. Поддерживает переменные (variables) для шаблонизации URL.',
    example: `servers:
  - url: https://api.example.com/v1
    description: Production
  - url: https://staging-api.example.com/v1
    description: Staging
  - url: http://localhost:3000/v1
    description: Local dev`,
  },
  {
    id: 'paths',
    title: 'paths',
    required: true,
    color: '#f59e0b',
    icon: '🛣️',
    description: 'Все endpoints API и их операции',
    details:
      'Обязательная секция. Ключ — путь endpoint (/users, /users/{id}), ' +
      'значение — объект с операциями по HTTP-методам (get, post, put, delete, patch). ' +
      'Каждая операция описывает: parameters, requestBody, responses, summary, tags.',
    example: `paths:
  /tasks:
    get:
      summary: Список задач
      responses:
        "200":
          description: Успешный ответ
  /tasks/{id}:
    get:
      summary: Получить задачу
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string`,
  },
  {
    id: 'components',
    title: 'components',
    required: false,
    color: '#ec4899',
    icon: '🧩',
    description: 'Переиспользуемые схемы, параметры, ответы',
    details:
      'Необязательная секция. Хранит переиспользуемые объекты, на которые можно ссылаться ' +
      'через $ref. Подсекции: schemas (модели данных), responses (стандартные ответы), ' +
      'parameters (переиспользуемые параметры), requestBodies, headers, securitySchemes.',
    example: `components:
  schemas:
    Task:
      type: object
      required: [id, title]
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
        completed:
          type: boolean
          default: false
  responses:
    NotFound:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"`,
  },
]

export function Task7_1_Solution() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)

  const active = OPENAPI_SECTIONS.find(s => s.id === activeSection)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Анатомия OpenAPI-документа</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Кликните на секцию, чтобы узнать подробнее о её роли в спецификации.
      </p>

      {/* Схема структуры документа */}
      <div
        style={{
          border: '2px solid #e2e8f0',
          borderRadius: '12px',
          overflow: 'hidden',
          marginBottom: '1.5rem',
          fontFamily: 'monospace',
        }}
      >
        {/* Заголовок */}
        <div
          style={{
            background: '#1e293b',
            color: '#94a3b8',
            padding: '0.5rem 1rem',
            fontSize: '0.8rem',
          }}
        >
          openapi-spec.yaml
        </div>

        {/* Секции */}
        {OPENAPI_SECTIONS.map(section => (
          <div
            key={section.id}
            onClick={() =>
              setActiveSection(prev => (prev === section.id ? null : section.id))
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0.75rem 1rem',
              cursor: 'pointer',
              borderLeft: `4px solid ${activeSection === section.id ? section.color : 'transparent'}`,
              background:
                activeSection === section.id
                  ? `${section.color}10`
                  : 'white',
              borderBottom: '1px solid #f1f5f9',
              transition: 'all 0.15s',
              gap: '0.75rem',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{section.icon}</span>
            <span
              style={{
                fontWeight: 600,
                color: activeSection === section.id ? section.color : '#1e293b',
                minWidth: '110px',
                fontSize: '0.95rem',
              }}
            >
              {section.title}:
            </span>
            <span style={{ color: '#64748b', fontSize: '0.85rem', flex: 1 }}>
              {section.description}
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: '99px',
                background: section.required ? '#fef2f2' : '#f0fdf4',
                color: section.required ? '#dc2626' : '#16a34a',
                fontFamily: 'sans-serif',
                fontWeight: 600,
              }}
            >
              {section.required ? 'обязательно' : 'опционально'}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              {activeSection === section.id ? '▲' : '▼'}
            </span>
          </div>
        ))}
      </div>

      {/* Детали выбранной секции */}
      {active && (
        <div
          style={{
            border: `2px solid ${active.color}`,
            borderRadius: '12px',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            style={{
              background: active.color,
              color: 'white',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>{active.icon}</span>
            <span style={{ fontWeight: 700 }}>{active.title}</span>
          </div>
          <div style={{ padding: '1rem', background: 'white' }}>
            <p style={{ margin: '0 0 1rem', color: '#374151', lineHeight: 1.6 }}>
              {active.details}
            </p>
            <div
              style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.85rem',
                color: '#e2e8f0',
                whiteSpace: 'pre',
                overflowX: 'auto',
              }}
            >
              {active.example}
            </div>
          </div>
        </div>
      )}

      {!active && (
        <div
          style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#94a3b8',
            background: '#f8fafc',
            borderRadius: '12px',
            border: '2px dashed #e2e8f0',
          }}
        >
          👆 Нажмите на любую секцию выше, чтобы увидеть детали и пример
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.2: Конструктор OpenAPI-пути
// ============================================

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type BuildStep = 'method' | 'parameters' | 'requestBody' | 'responses'

interface ScenarioConfig {
  id: string
  label: string
  path: string
  method: HttpMethod
  hasPathParam: boolean
  hasQueryParam: boolean
  hasRequestBody: boolean
  summary: string
  pathParamName?: string
  queryParamName?: string
  queryParamDesc?: string
  bodySchema?: string
  responseSchema?: string
}

const SCENARIOS: ScenarioConfig[] = [
  {
    id: 'get-users',
    label: 'GET /users',
    path: '/users',
    method: 'GET',
    hasPathParam: false,
    hasQueryParam: true,
    hasRequestBody: false,
    summary: 'Получить список пользователей',
    queryParamName: 'limit',
    queryParamDesc: 'Максимальное кол-во записей',
    responseSchema: `type: array
              items:
                $ref: "#/components/schemas/User"`,
  },
  {
    id: 'post-users',
    label: 'POST /users',
    path: '/users',
    method: 'POST',
    hasPathParam: false,
    hasQueryParam: false,
    hasRequestBody: true,
    summary: 'Создать нового пользователя',
    bodySchema: `type: object
              required: [name, email]
              properties:
                name:
                  type: string
                email:
                  type: string
                  format: email`,
    responseSchema: `$ref: "#/components/schemas/User"`,
  },
  {
    id: 'get-user-by-id',
    label: 'GET /users/{id}',
    path: '/users/{id}',
    method: 'GET',
    hasPathParam: true,
    hasQueryParam: false,
    hasRequestBody: false,
    summary: 'Получить пользователя по ID',
    pathParamName: 'id',
    responseSchema: `$ref: "#/components/schemas/User"`,
  },
]

const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: '#10b981',
  POST: '#3b82f6',
  PUT: '#f59e0b',
  DELETE: '#ef4444',
}

const STEPS: { id: BuildStep; label: string }[] = [
  { id: 'method', label: '1. Метод и путь' },
  { id: 'parameters', label: '2. Параметры' },
  { id: 'requestBody', label: '3. Тело запроса' },
  { id: 'responses', label: '4. Ответы' },
]

function buildYaml(scenario: ScenarioConfig, upToStep: BuildStep): string {
  const stepOrder: BuildStep[] = ['method', 'parameters', 'requestBody', 'responses']
  const currentIdx = stepOrder.indexOf(upToStep)

  const lines: string[] = []
  lines.push(`paths:`)
  lines.push(`  ${scenario.path}:`)
  lines.push(`    ${scenario.method.toLowerCase()}:`)
  lines.push(`      summary: ${scenario.summary}`)

  if (currentIdx >= 1) {
    const params: string[] = []
    if (scenario.hasPathParam && scenario.pathParamName) {
      params.push(
        `        - name: ${scenario.pathParamName}\n` +
        `          in: path\n` +
        `          required: true\n` +
        `          schema:\n` +
        `            type: string\n` +
        `            format: uuid`
      )
    }
    if (scenario.hasQueryParam && scenario.queryParamName) {
      params.push(
        `        - name: ${scenario.queryParamName}\n` +
        `          in: query\n` +
        `          required: false\n` +
        `          description: ${scenario.queryParamDesc}\n` +
        `          schema:\n` +
        `            type: integer\n` +
        `            default: 20`
      )
    }
    if (params.length > 0) {
      lines.push(`      parameters:`)
      lines.push(...params)
    } else if (!scenario.hasPathParam && !scenario.hasQueryParam) {
      lines.push(`      # параметры не требуются`)
    }
  }

  if (currentIdx >= 2) {
    if (scenario.hasRequestBody && scenario.bodySchema) {
      lines.push(`      requestBody:`)
      lines.push(`        required: true`)
      lines.push(`        content:`)
      lines.push(`          application/json:`)
      lines.push(`            schema:`)
      lines.push(`              ${scenario.bodySchema}`)
    } else {
      lines.push(`      # тело запроса не требуется (${scenario.method})`)
    }
  }

  if (currentIdx >= 3) {
    lines.push(`      responses:`)
    const successCode = scenario.method === 'POST' ? '"201"' : '"200"'
    lines.push(`        ${successCode}:`)
    lines.push(`          description: Успешный ответ`)
    if (scenario.responseSchema) {
      lines.push(`          content:`)
      lines.push(`            application/json:`)
      lines.push(`              schema:`)
      lines.push(`                ${scenario.responseSchema}`)
    }
    lines.push(`        "400":`)
    lines.push(`          description: Неверный запрос`)
    lines.push(`          content:`)
    lines.push(`            application/json:`)
    lines.push(`              schema:`)
    lines.push(`                $ref: "#/components/schemas/Error"`)
    if (scenario.hasPathParam) {
      lines.push(`        "404":`)
      lines.push(`          description: Ресурс не найден`)
      lines.push(`          content:`)
      lines.push(`            application/json:`)
      lines.push(`              schema:`)
      lines.push(`                $ref: "#/components/schemas/Error"`)
    }
  }

  return lines.join('\n')
}

export function Task7_2_Solution() {
  const [scenarioId, setScenarioId] = useState('get-users')
  const [step, setStep] = useState<BuildStep>('method')

  const scenario = SCENARIOS.find(s => s.id === scenarioId)!
  const stepOrder: BuildStep[] = ['method', 'parameters', 'requestBody', 'responses']
  const currentStepIdx = stepOrder.indexOf(step)

  const handleScenarioChange = (id: string) => {
    setScenarioId(id)
    setStep('method')
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор OpenAPI-пути</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Выберите сценарий и проходите шаги — YAML будет строиться на ваших глазах.
      </p>

      {/* Выбор сценария */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {SCENARIOS.map(s => (
          <button
            key={s.id}
            onClick={() => handleScenarioChange(s.id)}
            style={{
              padding: '0.4rem 0.9rem',
              borderRadius: '6px',
              border: `2px solid ${scenarioId === s.id ? METHOD_COLORS[s.method] : '#e2e8f0'}`,
              background: scenarioId === s.id ? METHOD_COLORS[s.method] : 'white',
              color: scenarioId === s.id ? 'white' : '#374151',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'all 0.15s',
            }}
          >
            <span
              style={{
                background: scenarioId === s.id ? 'rgba(255,255,255,0.25)' : METHOD_COLORS[s.method],
                color: scenarioId === s.id ? 'white' : 'white',
                padding: '1px 5px',
                borderRadius: '4px',
                marginRight: '0.4rem',
                fontSize: '0.75rem',
              }}
            >
              {s.method}
            </span>
            {s.path}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1rem' }}>
        {/* Шаги */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {STEPS.map((s, idx) => {
            const isDone = idx < currentStepIdx
            const isCurrent = s.id === step
            return (
              <button
                key={s.id}
                onClick={() => setStep(s.id)}
                style={{
                  padding: '0.6rem 0.75rem',
                  borderRadius: '8px',
                  border: `2px solid ${isCurrent ? METHOD_COLORS[scenario.method] : isDone ? '#d1fae5' : '#e2e8f0'}`,
                  background: isCurrent
                    ? `${METHOD_COLORS[scenario.method]}15`
                    : isDone
                    ? '#f0fdf4'
                    : '#fafafa',
                  color: isCurrent ? METHOD_COLORS[scenario.method] : isDone ? '#16a34a' : '#64748b',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  fontWeight: isCurrent ? 700 : 400,
                  transition: 'all 0.15s',
                }}
              >
                {isDone ? '✅ ' : isCurrent ? '▶ ' : '○ '}
                {s.label}
              </button>
            )
          })}

          {/* Кнопки навигации */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <button
              onClick={() => setStep(stepOrder[Math.max(0, currentStepIdx - 1)])}
              disabled={currentStepIdx === 0}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                background: 'white',
                cursor: currentStepIdx === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStepIdx === 0 ? 0.4 : 1,
                fontSize: '0.8rem',
              }}
            >
              ← Назад
            </button>
            <button
              onClick={() =>
                setStep(stepOrder[Math.min(stepOrder.length - 1, currentStepIdx + 1)])
              }
              disabled={currentStepIdx === stepOrder.length - 1}
              style={{
                flex: 1,
                padding: '0.4rem',
                borderRadius: '6px',
                border: 'none',
                background: METHOD_COLORS[scenario.method],
                color: 'white',
                cursor:
                  currentStepIdx === stepOrder.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentStepIdx === stepOrder.length - 1 ? 0.5 : 1,
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              Далее →
            </button>
          </div>
        </div>

        {/* YAML preview */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '10px',
            padding: '1rem',
            fontFamily: 'monospace',
            fontSize: '0.82rem',
            color: '#e2e8f0',
            whiteSpace: 'pre',
            overflowX: 'auto',
            lineHeight: 1.6,
            minHeight: '300px',
          }}
        >
          {buildYaml(scenario, step)}
        </div>
      </div>

      {/* Подсказка по текущему шагу */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#fefce8',
          border: '1px solid #fde047',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#713f12',
        }}
      >
        {step === 'method' &&
          '💡 Первое в описании endpoint — HTTP-метод и путь. Путь — ключ в объекте paths, метод — ключ внутри.'}
        {step === 'parameters' &&
          '💡 Parameters описывают всё, что не в теле запроса: path-параметры ({id}), query (?limit=20), header и cookie. Для каждого — name, in, schema.'}
        {step === 'requestBody' &&
          '💡 requestBody используется только для POST/PUT/PATCH. content описывает media type (обычно application/json), schema — структуру данных.'}
        {step === 'responses' &&
          '💡 Описывайте все возможные коды ответа. Для каждого — description и content. Не забывайте про ошибки (400, 404, 500).'}
      </div>
    </div>
  )
}

// ============================================
// Задание 7.3: Полная спецификация Todo API
// ============================================

const TODO_SPEC = `openapi: "3.0.3"

# ── Метаданные API ───────────────────────────────────
info:
  title: Todo API
  version: "1.0.0"
  description: |
    Простой API для управления списком задач.
    Поддерживает CRUD-операции для задач (tasks).

# ── Серверы ──────────────────────────────────────────
servers:
  - url: https://api.todo-app.example.com/v1
    description: Production
  - url: http://localhost:3000/v1
    description: Local development

# ── Endpoints ────────────────────────────────────────
paths:
  /tasks:
    get:
      summary: Список задач
      tags: [Tasks]
      parameters:
        - name: completed
          in: query
          description: Фильтр по статусу выполнения
          required: false
          schema:
            type: boolean
        - name: limit
          in: query
          description: Количество записей на странице
          required: false
          schema:
            type: integer
            default: 20
            minimum: 1
            maximum: 100
      responses:
        "200":
          description: Список задач
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: "#/components/schemas/Task"
                  total:
                    type: integer

    post:
      summary: Создать задачу
      tags: [Tasks]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TaskInput"
      responses:
        "201":
          description: Задача создана
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
        "400":
          $ref: "#/components/responses/BadRequest"

  /tasks/{id}:
    parameters:
      # ── Переиспользуемый path-параметр ───────────
      - name: id
        in: path
        required: true
        description: Уникальный идентификатор задачи
        schema:
          type: string
          format: uuid

    get:
      summary: Получить задачу
      tags: [Tasks]
      responses:
        "200":
          description: Задача найдена
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
        "404":
          $ref: "#/components/responses/NotFound"

    put:
      summary: Обновить задачу
      tags: [Tasks]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TaskInput"
      responses:
        "200":
          description: Задача обновлена
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/Task"
        "400":
          $ref: "#/components/responses/BadRequest"
        "404":
          $ref: "#/components/responses/NotFound"

    delete:
      summary: Удалить задачу
      tags: [Tasks]
      responses:
        "204":
          description: Задача удалена (тело ответа пустое)
        "404":
          $ref: "#/components/responses/NotFound"

# ── Переиспользуемые компоненты ───────────────────────
components:
  schemas:
    # Полная модель задачи (возвращается сервером)
    Task:
      type: object
      required: [id, title, completed, createdAt]
      properties:
        id:
          type: string
          format: uuid
          example: "550e8400-e29b-41d4-a716-446655440000"
        title:
          type: string
          minLength: 1
          maxLength: 255
          example: "Написать тесты"
        completed:
          type: boolean
          default: false
        createdAt:
          type: string
          format: date-time
          example: "2024-01-15T10:30:00Z"

    # Входные данные (от клиента)
    TaskInput:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 255
        completed:
          type: boolean
          default: false

    # Стандартная ошибка
    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
          example: "VALIDATION_ERROR"
        message:
          type: string
          example: "Поле title обязательно"

  # Стандартные ответы для переиспользования
  responses:
    NotFound:
      description: Ресурс не найден
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"
    BadRequest:
      description: Неверный запрос
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/Error"`

type SpecView = 'full' | 'paths' | 'components'

export function Task7_3_Solution() {
  const [view, setView] = useState<SpecView>('full')
  const [copied, setCopied] = useState(false)

  const getSpecPart = (): string => {
    if (view === 'paths') {
      const start = TODO_SPEC.indexOf('paths:')
      const end = TODO_SPEC.indexOf('# ── Переиспользуемые компоненты')
      return TODO_SPEC.slice(start, end).trim()
    }
    if (view === 'components') {
      const start = TODO_SPEC.indexOf('components:')
      return TODO_SPEC.slice(start).trim()
    }
    return TODO_SPEC
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(TODO_SPEC).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const views: { id: SpecView; label: string; color: string }[] = [
    { id: 'full', label: 'Полная спецификация', color: '#6366f1' },
    { id: 'paths', label: 'Только paths', color: '#f59e0b' },
    { id: 'components', label: 'Только components', color: '#ec4899' },
  ]

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Полная спецификация: Todo API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Эталонная OpenAPI-спецификация для CRUD-API. Комментарии объясняют каждую секцию.
      </p>

      {/* Статистика */}
      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}
      >
        {[
          { label: 'Endpoints', value: '2 пути, 5 операций', color: '#3b82f6' },
          { label: 'Schemas', value: 'Task, TaskInput, Error', color: '#10b981' },
          { label: 'Reusable responses', value: 'NotFound, BadRequest', color: '#f59e0b' },
          { label: 'OpenAPI', value: '3.0.3', color: '#6366f1' },
        ].map(stat => (
          <div
            key={stat.label}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              border: `1px solid ${stat.color}30`,
              background: `${stat.color}10`,
            }}
          >
            <div style={{ fontSize: '0.7rem', color: stat.color, fontWeight: 700 }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Переключатели вида */}
      <div
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}
      >
        {views.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              padding: '0.35rem 0.8rem',
              borderRadius: '6px',
              border: `2px solid ${view === v.id ? v.color : '#e2e8f0'}`,
              background: view === v.id ? v.color : 'white',
              color: view === v.id ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: view === v.id ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {v.label}
          </button>
        ))}
        <button
          onClick={handleCopy}
          style={{
            marginLeft: 'auto',
            padding: '0.35rem 0.8rem',
            borderRadius: '6px',
            border: '1px solid #e2e8f0',
            background: copied ? '#f0fdf4' : 'white',
            color: copied ? '#16a34a' : '#374151',
            cursor: 'pointer',
            fontSize: '0.8rem',
            transition: 'all 0.15s',
          }}
        >
          {copied ? '✅ Скопировано' : '📋 Копировать'}
        </button>
      </div>

      {/* Код */}
      <div
        style={{
          background: '#0f172a',
          borderRadius: '10px',
          padding: '1.25rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: '#e2e8f0',
          whiteSpace: 'pre',
          overflowX: 'auto',
          lineHeight: 1.65,
          maxHeight: '600px',
          overflowY: 'auto',
        }}
      >
        {getSpecPart()}
      </div>

      {/* Совет */}
      <div
        style={{
          marginTop: '1rem',
          padding: '0.75rem 1rem',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#0c4a6e',
        }}
      >
        💡 Вставьте эту спецификацию в{' '}
        <strong>
          <a
            href="https://editor.swagger.io"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#0284c7' }}
          >
            editor.swagger.io
          </a>
        </strong>{' '}
        — вы увидите интерактивную документацию и сможете попробовать запросы прямо в браузере.
      </div>
    </div>
  )
}
