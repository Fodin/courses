import { useState } from 'react'

// ============================================
// Задание 2.1: Матрица HTTP-методов
// ============================================

interface HttpMethod {
  name: string
  safe: boolean
  idempotent: boolean
  requestBody: boolean
  responseBody: boolean
  typicalUse: string
  color: string
  textColor: string
}

const httpMethods: HttpMethod[] = [
  {
    name: 'GET',
    safe: true,
    idempotent: true,
    requestBody: false,
    responseBody: true,
    typicalUse: 'Получить ресурс или коллекцию',
    color: '#e8f5e9',
    textColor: '#1b5e20',
  },
  {
    name: 'POST',
    safe: false,
    idempotent: false,
    requestBody: true,
    responseBody: true,
    typicalUse: 'Создать новый ресурс',
    color: '#e3f2fd',
    textColor: '#0d47a1',
  },
  {
    name: 'PUT',
    safe: false,
    idempotent: true,
    requestBody: true,
    responseBody: true,
    typicalUse: 'Заменить ресурс целиком',
    color: '#fff8e1',
    textColor: '#e65100',
  },
  {
    name: 'PATCH',
    safe: false,
    idempotent: false,
    requestBody: true,
    responseBody: true,
    typicalUse: 'Частично обновить ресурс',
    color: '#fce4ec',
    textColor: '#880e4f',
  },
  {
    name: 'DELETE',
    safe: false,
    idempotent: true,
    requestBody: false,
    responseBody: false,
    typicalUse: 'Удалить ресурс',
    color: '#ffebee',
    textColor: '#b71c1c',
  },
  {
    name: 'HEAD',
    safe: true,
    idempotent: true,
    requestBody: false,
    responseBody: false,
    typicalUse: 'Как GET, но без тела ответа',
    color: '#f3e5f5',
    textColor: '#4a148c',
  },
  {
    name: 'OPTIONS',
    safe: true,
    idempotent: true,
    requestBody: false,
    responseBody: true,
    typicalUse: 'Узнать разрешённые методы (CORS preflight)',
    color: '#e0f7fa',
    textColor: '#006064',
  },
]

type FilterMode = 'all' | 'safe' | 'idempotent' | 'safe-idempotent'

const filterLabels: Record<FilterMode, string> = {
  all: 'Все методы',
  safe: 'Только безопасные',
  idempotent: 'Только идемпотентные',
  'safe-idempotent': 'Безопасные + идемпотентные',
}

function YesNo({ value }: { value: boolean }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.15rem 0.5rem',
        borderRadius: '4px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        background: value ? '#e8f5e9' : '#ffebee',
        color: value ? '#2e7d32' : '#b71c1c',
      }}
    >
      {value ? '✅ Да' : '❌ Нет'}
    </span>
  )
}

export function Task2_1_Solution() {
  const [filter, setFilter] = useState<FilterMode>('all')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = httpMethods.filter((m) => {
    if (filter === 'safe') return m.safe
    if (filter === 'idempotent') return m.idempotent
    if (filter === 'safe-idempotent') return m.safe && m.idempotent
    return true
  })

  const selectedMethod = httpMethods.find((m) => m.name === selected) ?? null

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Матрица HTTP-методов</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Изучите свойства каждого HTTP-метода. Используйте фильтры для сравнения групп.
        Нажмите на строку — увидите подробности.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {(Object.keys(filterLabels) as FilterMode[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.35rem 0.75rem',
              border: '2px solid',
              borderColor: filter === f ? '#1565c0' : '#ccc',
              borderRadius: '20px',
              background: filter === f ? '#1565c0' : 'white',
              color: filter === f ? 'white' : '#555',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: filter === f ? 'bold' : 'normal',
            }}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderRadius: '4px 0 0 0' }}>Метод</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Безопасный</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Идемпотентный</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Тело запроса</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>Тело ответа</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', borderRadius: '0 4px 0 0' }}>
                Типичное использование
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.name}
                onClick={() => setSelected(selected === m.name ? null : m.name)}
                style={{
                  background: selected === m.name ? m.color : 'white',
                  borderBottom: '1px solid #f0f0f0',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                <td style={{ padding: '0.6rem 0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      background: m.color,
                      color: m.textColor,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      fontFamily: 'monospace',
                      fontSize: '0.9rem',
                    }}
                  >
                    {m.name}
                  </span>
                </td>
                <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                  <YesNo value={m.safe} />
                </td>
                <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                  <YesNo value={m.idempotent} />
                </td>
                <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                  <YesNo value={m.requestBody} />
                </td>
                <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                  <YesNo value={m.responseBody} />
                </td>
                <td style={{ padding: '0.6rem 0.75rem', color: '#444' }}>{m.typicalUse}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selectedMethod && (
        <div
          style={{
            background: selectedMethod.color,
            border: `2px solid ${selectedMethod.textColor}33`,
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ margin: '0 0 0.75rem 0', color: selectedMethod.textColor }}>
            {selectedMethod.name} — подробнее
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div>
              <strong>Безопасный</strong> — {selectedMethod.safe
                ? 'не меняет состояние сервера, можно кэшировать и повторять без последствий'
                : 'изменяет состояние сервера, имеет побочные эффекты'}
            </div>
            <div>
              <strong>Идемпотентный</strong> — {selectedMethod.idempotent
                ? 'повторный вызов с теми же данными даёт тот же результат'
                : 'повторный вызов может создать новый ресурс или изменить состояние иначе'}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div
        style={{
          background: '#f5f5f5',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.82rem',
          lineHeight: '1.6',
          color: '#555',
        }}
      >
        <strong>Пояснения:</strong> «Безопасный» — не изменяет состояние сервера.
        «Идемпотентный» — одинаковый результат при повторных вызовах.
        Нажмите на строку, чтобы увидеть детальное описание свойств.
      </div>
    </div>
  )
}

// ============================================
// Задание 2.2: Подбери метод для сценария
// ============================================

interface MethodScenario {
  id: number
  description: string
  context: string
  correctMethod: string
  explanation: string
}

const methodScenarios: MethodScenario[] = [
  {
    id: 1,
    description: 'Создать нового пользователя',
    context: 'Пользователь заполнил форму регистрации. Сервер должен создать новую запись и вернуть созданный объект.',
    correctMethod: 'POST',
    explanation:
      'POST используется для создания ресурса. Новый ID назначает сервер — поэтому запрос идёт на коллекцию /users, а не на конкретный ресурс.',
  },
  {
    id: 2,
    description: 'Получить профиль пользователя',
    context: 'Фронтенд загружает страницу профиля пользователя с ID = 42.',
    correctMethod: 'GET',
    explanation:
      'GET — единственный метод для чтения ресурса. Безопасный и идемпотентный: не меняет данные, браузер может кэшировать ответ.',
  },
  {
    id: 3,
    description: 'Обновить email пользователя',
    context: 'Пользователь изменил только поле email в настройках. Остальные данные профиля не трогаем.',
    correctMethod: 'PATCH',
    explanation:
      'PATCH — для частичного обновления. Отправляем только изменившиеся поля: { "email": "new@example.com" }. PUT здесь избыточен — он заменил бы весь объект.',
  },
  {
    id: 4,
    description: 'Заменить настройки уведомлений целиком',
    context:
      'Пользователь настроил все параметры уведомлений в форме. Нужно целиком заменить объект настроек на сервере.',
    correctMethod: 'PUT',
    explanation:
      'PUT заменяет ресурс полностью. Если у пользователя были поля, которых нет в запросе, — они сбросятся. Это именно то поведение, которое нужно для "заменить настройки".',
  },
  {
    id: 5,
    description: 'Удалить комментарий',
    context: 'Пользователь нажал «Удалить» под своим комментарием с ID = 15.',
    correctMethod: 'DELETE',
    explanation:
      'DELETE — семантически правильный метод для удаления. Идемпотентен: повторный DELETE /comments/15 не создаст ошибки (ресурс уже отсутствует).',
  },
  {
    id: 6,
    description: 'Получить список всех задач',
    context: 'Страница задач запрашивает список с фильтром по статусу: только активные задачи.',
    correctMethod: 'GET',
    explanation:
      'GET с query params: GET /tasks?status=active. Фильтрация — это параметр запроса, а не изменение данных. Метод остаётся GET.',
  },
  {
    id: 7,
    description: 'Узнать, существует ли файл (без скачивания)',
    context: 'Нужно проверить наличие файла на сервере и получить его метаданные (размер, тип), но не загружать сам контент.',
    correctMethod: 'HEAD',
    explanation:
      'HEAD возвращает те же заголовки, что и GET, но без тела ответа. Идеален для проверки существования ресурса и получения метаданных с минимальным трафиком.',
  },
  {
    id: 8,
    description: 'Узнать, какие методы разрешены для endpoint',
    context: 'CORS preflight-запрос браузера перед отправкой POST с кастомными заголовками.',
    correctMethod: 'OPTIONS',
    explanation:
      'OPTIONS браузер отправляет автоматически как preflight перед "небезопасными" CORS-запросами. Сервер отвечает заголовком Allow: GET, POST, DELETE.',
  },
  {
    id: 9,
    description: 'Частично обновить задачу (изменить только приоритет)',
    context: 'Пользователь перетащил задачу в колонку "Высокий приоритет". Меняем только поле priority.',
    correctMethod: 'PATCH',
    explanation:
      'PATCH отправляет только изменившиеся поля: { "priority": "high" }. Эффективнее PUT, т.к. не нужно передавать весь объект задачи.',
  },
  {
    id: 10,
    description: 'Создать или полностью заменить документ с известным ID',
    context:
      'Клиент сам генерирует UUID для нового документа и хочет либо создать его, либо полностью заменить существующий.',
    correctMethod: 'PUT',
    explanation:
      'PUT на конкретный ресурс (/documents/uuid) создаёт его, если не существует, или заменяет целиком. Это upsert-поведение — отличие от POST, где ID назначает сервер.',
  },
]

const allMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS']

const methodColors: Record<string, { bg: string; color: string }> = {
  GET: { bg: '#e8f5e9', color: '#1b5e20' },
  POST: { bg: '#e3f2fd', color: '#0d47a1' },
  PUT: { bg: '#fff8e1', color: '#e65100' },
  PATCH: { bg: '#fce4ec', color: '#880e4f' },
  DELETE: { bg: '#ffebee', color: '#b71c1c' },
  HEAD: { bg: '#f3e5f5', color: '#4a148c' },
  OPTIONS: { bg: '#e0f7fa', color: '#006064' },
}

export function Task2_2_Solution() {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [score, setScore] = useState<number | null>(null)

  const select = (id: number, method: string) => {
    setAnswers((prev) => ({ ...prev, [id]: method }))
    setChecked((prev) => ({ ...prev, [id]: false }))
    setScore(null)
  }

  const checkOne = (id: number) => {
    setChecked((prev) => ({ ...prev, [id]: true }))
  }

  const checkAll = () => {
    const allChecked: Record<number, boolean> = {}
    methodScenarios.forEach((s) => { allChecked[s.id] = true })
    setChecked(allChecked)
    const correct = methodScenarios.filter((s) => answers[s.id] === s.correctMethod).length
    setScore(correct)
  }

  const reset = () => {
    setAnswers({})
    setChecked({})
    setScore(null)
  }

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Подбери метод для сценария</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Для каждого практического сценария выберите подходящий HTTP-метод, затем проверьте ответ.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
        {methodScenarios.map((scenario) => {
          const chosen = answers[scenario.id]
          const isChecked = checked[scenario.id]
          const isCorrect = chosen === scenario.correctMethod
          const colors = chosen ? (methodColors[chosen] ?? { bg: '#f5f5f5', color: '#333' }) : null

          return (
            <div
              key={scenario.id}
              style={{
                border: `1px solid ${isChecked ? (isCorrect ? '#a5d6a7' : '#ef9a9a') : '#e0e0e0'}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              {/* Scenario header */}
              <div style={{ padding: '0.75rem 1rem', background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  #{scenario.id} {scenario.description}
                </div>
                <div style={{ color: '#666', fontSize: '0.85rem' }}>{scenario.context}</div>
              </div>

              {/* Method selector */}
              <div style={{ padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.8rem', color: '#888', flexShrink: 0 }}>Метод:</span>
                {allMethods.map((m) => {
                  const mc = methodColors[m]
                  const isSelected = chosen === m
                  return (
                    <button
                      key={m}
                      onClick={() => select(scenario.id, m)}
                      style={{
                        padding: '0.2rem 0.55rem',
                        border: `2px solid ${isSelected ? mc.color : '#ddd'}`,
                        borderRadius: '4px',
                        background: isSelected ? mc.bg : 'white',
                        color: isSelected ? mc.color : '#666',
                        cursor: 'pointer',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                      }}
                    >
                      {m}
                    </button>
                  )
                })}

                {chosen && !isChecked && (
                  <button
                    onClick={() => checkOne(scenario.id)}
                    style={{
                      marginLeft: 'auto',
                      padding: '0.25rem 0.75rem',
                      background: '#1565c0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                    }}
                  >
                    Проверить
                  </button>
                )}

                {isChecked && colors && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      display: 'inline-block',
                      padding: '0.2rem 0.6rem',
                      background: colors.bg,
                      color: colors.color,
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontWeight: 'bold',
                      fontSize: '0.85rem',
                    }}
                  >
                    {chosen}
                  </span>
                )}
              </div>

              {/* Result */}
              {isChecked && (
                <div
                  style={{
                    padding: '0.6rem 1rem',
                    background: isCorrect ? '#f1f8e9' : '#fff8f8',
                    borderTop: '1px solid #f0f0f0',
                    fontSize: '0.85rem',
                  }}
                >
                  {isCorrect ? (
                    <span style={{ color: '#2e7d32' }}>
                      ✅ Верно! {scenario.explanation}
                    </span>
                  ) : (
                    <div>
                      <div style={{ color: '#c62828', marginBottom: '0.3rem' }}>
                        ❌ Не совсем. Правильный ответ:{' '}
                        <span
                          style={{
                            background: methodColors[scenario.correctMethod]?.bg,
                            color: methodColors[scenario.correctMethod]?.color,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '3px',
                            fontFamily: 'monospace',
                            fontWeight: 'bold',
                          }}
                        >
                          {scenario.correctMethod}
                        </span>
                      </div>
                      <span style={{ color: '#555' }}>{scenario.explanation}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={checkAll}
          style={{
            padding: '0.5rem 1.25rem',
            background: '#1565c0',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Проверить все
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            background: '#f5f5f5',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          Сбросить
        </button>

        {score !== null && (
          <div
            style={{
              padding: '0.4rem 0.9rem',
              background: score >= 8 ? '#e8f5e9' : score >= 5 ? '#fff8e1' : '#ffebee',
              border: `1px solid ${score >= 8 ? '#a5d6a7' : score >= 5 ? '#ffe082' : '#ef9a9a'}`,
              borderRadius: '6px',
              fontWeight: 'bold',
              color: score >= 8 ? '#2e7d32' : score >= 5 ? '#e65100' : '#c62828',
            }}
          >
            Результат: {score} / {methodScenarios.length}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 2.3: CRUD endpoints для ресурса "tasks"
// ============================================

interface CrudEndpoint {
  method: string
  url: string
  description: string
  requestExample: string | null
  responseExample: string
  statusCode: number
}

const tasksApi: CrudEndpoint[] = [
  {
    method: 'GET',
    url: '/api/tasks',
    description: 'Получить список задач (с фильтрацией и пагинацией)',
    requestExample: null,
    responseExample: `[
  { "id": 1, "title": "Купить молоко", "status": "active", "priority": "low" },
  { "id": 2, "title": "Написать отчёт", "status": "active", "priority": "high" }
]`,
    statusCode: 200,
  },
  {
    method: 'POST',
    url: '/api/tasks',
    description: 'Создать новую задачу',
    requestExample: `{
  "title": "Позвонить клиенту",
  "priority": "high",
  "dueDate": "2024-12-31"
}`,
    responseExample: `{
  "id": 42,
  "title": "Позвонить клиенту",
  "status": "active",
  "priority": "high",
  "dueDate": "2024-12-31",
  "createdAt": "2024-11-15T10:30:00Z"
}`,
    statusCode: 201,
  },
  {
    method: 'GET',
    url: '/api/tasks/:id',
    description: 'Получить задачу по ID',
    requestExample: null,
    responseExample: `{
  "id": 42,
  "title": "Позвонить клиенту",
  "status": "active",
  "priority": "high",
  "dueDate": "2024-12-31",
  "createdAt": "2024-11-15T10:30:00Z"
}`,
    statusCode: 200,
  },
  {
    method: 'PUT',
    url: '/api/tasks/:id',
    description: 'Заменить задачу целиком',
    requestExample: `{
  "title": "Позвонить клиенту — СРОЧНО",
  "priority": "urgent",
  "dueDate": "2024-11-20",
  "status": "active"
}`,
    responseExample: `{
  "id": 42,
  "title": "Позвонить клиенту — СРОЧНО",
  "priority": "urgent",
  "dueDate": "2024-11-20",
  "status": "active",
  "createdAt": "2024-11-15T10:30:00Z"
}`,
    statusCode: 200,
  },
  {
    method: 'PATCH',
    url: '/api/tasks/:id',
    description: 'Частично обновить задачу (например, изменить статус)',
    requestExample: `{
  "status": "completed"
}`,
    responseExample: `{
  "id": 42,
  "title": "Позвонить клиенту — СРОЧНО",
  "status": "completed",
  "priority": "urgent",
  "dueDate": "2024-11-20",
  "completedAt": "2024-11-18T14:22:00Z"
}`,
    statusCode: 200,
  },
  {
    method: 'DELETE',
    url: '/api/tasks/:id',
    description: 'Удалить задачу',
    requestExample: null,
    responseExample: '(пустое тело)',
    statusCode: 204,
  },
]

const queryExamples = [
  { param: '?status=active', description: 'Только активные задачи' },
  { param: '?priority=high', description: 'Только высокоприоритетные' },
  { param: '?page=2&limit=20', description: 'Пагинация: страница 2, по 20 задач' },
  { param: '?sort=dueDate&order=asc', description: 'Сортировка по дате (ранние первыми)' },
  { param: '?q=отчёт', description: 'Полнотекстовый поиск по заголовку' },
]

export function Task2_3_Solution() {
  const [openRow, setOpenRow] = useState<number | null>(null)
  const [showQuery, setShowQuery] = useState(false)

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>CRUD endpoints: ресурс tasks</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Эталонный набор REST endpoints для ресурса «задачи» в task-менеджере. Нажмите на строку,
        чтобы увидеть примеры запроса и ответа.
      </p>

      {/* Main table */}
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#263238', color: 'white' }}>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', width: '90px' }}>Метод</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left', width: '200px' }}>URL</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Описание</th>
              <th style={{ padding: '0.6rem 0.75rem', textAlign: 'center', width: '100px' }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {tasksApi.map((ep, i) => {
              const colors = methodColors[ep.method] ?? { bg: '#f5f5f5', color: '#333' }
              const isOpen = openRow === i

              return (
                <>
                  <tr
                    key={i}
                    onClick={() => setOpenRow(isOpen ? null : i)}
                    style={{
                      background: isOpen ? '#f8f9fa' : 'white',
                      borderBottom: '1px solid #f0f0f0',
                      cursor: 'pointer',
                    }}
                  >
                    <td style={{ padding: '0.6rem 0.75rem' }}>
                      <span
                        style={{
                          background: colors.bg,
                          color: colors.color,
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 'bold',
                          fontFamily: 'monospace',
                          fontSize: '0.82rem',
                        }}
                      >
                        {ep.method}
                      </span>
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', fontFamily: 'monospace', color: '#1565c0', fontSize: '0.85rem' }}>
                      {ep.url}
                    </td>
                    <td style={{ padding: '0.6rem 0.75rem', color: '#444' }}>{ep.description}</td>
                    <td style={{ padding: '0.6rem', textAlign: 'center' }}>
                      <span
                        style={{
                          background: ep.statusCode < 300 ? '#e8f5e9' : '#fff8e1',
                          color: ep.statusCode < 300 ? '#2e7d32' : '#e65100',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '4px',
                          fontFamily: 'monospace',
                          fontWeight: 'bold',
                          fontSize: '0.82rem',
                        }}
                      >
                        {ep.statusCode}
                      </span>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr key={`${i}-detail`} style={{ background: '#fafafa' }}>
                      <td colSpan={4} style={{ padding: '0.75rem 1rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: ep.requestExample ? '1fr 1fr' : '1fr', gap: '1rem' }}>
                          {ep.requestExample && (
                            <div>
                              <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.35rem', fontWeight: 'bold' }}>
                                Тело запроса:
                              </div>
                              <pre
                                style={{
                                  background: '#263238',
                                  color: '#80cbc4',
                                  padding: '0.6rem',
                                  borderRadius: '6px',
                                  fontSize: '0.78rem',
                                  margin: 0,
                                  overflowX: 'auto',
                                }}
                              >
                                {ep.requestExample}
                              </pre>
                            </div>
                          )}
                          <div>
                            <div style={{ fontSize: '0.78rem', color: '#888', marginBottom: '0.35rem', fontWeight: 'bold' }}>
                              Тело ответа ({ep.statusCode}):
                            </div>
                            <pre
                              style={{
                                background: '#263238',
                                color: '#a5d6a7',
                                padding: '0.6rem',
                                borderRadius: '6px',
                                fontSize: '0.78rem',
                                margin: 0,
                                overflowX: 'auto',
                              }}
                            >
                              {ep.responseExample}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Query params section */}
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          onClick={() => setShowQuery((v) => !v)}
          style={{
            padding: '0.45rem 1rem',
            background: '#f5f5f5',
            color: '#555',
            border: '1px solid #ccc',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {showQuery ? '▲ Скрыть query params для GET /api/tasks' : '▼ Показать query params для GET /api/tasks'}
        </button>

        {showQuery && (
          <div
            style={{
              marginTop: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                    Query param
                  </th>
                  <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>
                    Описание
                  </th>
                </tr>
              </thead>
              <tbody>
                {queryExamples.map((q, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '0.45rem 0.75rem', fontFamily: 'monospace', color: '#1565c0', fontSize: '0.82rem' }}>
                      {q.param}
                    </td>
                    <td style={{ padding: '0.45rem 0.75rem', color: '#444' }}>{q.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Self-check */}
      <div
        style={{
          background: '#e8f5e9',
          border: '1px solid #a5d6a7',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.85rem',
        }}
      >
        <strong>Проверь себя:</strong>
        <ol style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', lineHeight: '1.9' }}>
          <li>Почему POST /api/tasks возвращает 201, а GET /api/tasks — 200?</li>
          <li>Чем отличаются PUT и PATCH в контексте задачи? Когда уместен каждый?</li>
          <li>Почему DELETE /api/tasks/:id возвращает 204 (без тела)?</li>
          <li>Как изменится URL, если нужно получить задачи конкретного пользователя?</li>
        </ol>
      </div>
    </div>
  )
}
