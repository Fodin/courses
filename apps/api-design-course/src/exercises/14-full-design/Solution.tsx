import { useState } from 'react'

// ============================================
// Task 14.1: Library API Design Wizard
// ============================================

type ResourceItem = { name: string; description: string; type: string }
type EndpointItem = { method: string; path: string; description: string }
type MatrixRow = { resource: string; get: string; post: string; put: string; patch: string; delete: string }
type ExampleItem = { operation: string; success: string; errors: string }
type ModelItem = { name: string; code: string }
type WizardSolution =
  | { title: string; items: ResourceItem[] }
  | { title: string; endpoints: EndpointItem[] }
  | { title: string; matrix: MatrixRow[] }
  | { title: string; examples: ExampleItem[] }
  | { title: string; models: ModelItem[] }
  | { title: string; code: string }
  | { title: string; summary: { endpoints: number; resources: number; methods: string[]; patterns: string[] } }

const WIZARD_STEPS: Array<{
  id: number
  title: string
  description: string
  checklist: string[]
  solution: WizardSolution
}> = [
  {
    id: 1,
    title: 'Определи ресурсы',
    description: 'Что является сущностями вашей системы? Каждый существительный — потенциальный ресурс.',
    checklist: [
      'Выписать все бизнес-объекты: книги, авторы, читатели, бронирования',
      'Определить отношения между ресурсами (один-ко-многим, многие-ко-многим)',
      'Решить, какие ресурсы будут самостоятельными, а какие — вложенными',
      'Убедиться, что каждый ресурс имеет уникальный идентификатор',
    ],
    solution: {
      title: 'Ресурсы библиотеки',
      items: [
        { name: 'books', description: 'Книги — основной ресурс', type: 'root' },
        { name: 'authors', description: 'Авторы книг', type: 'root' },
        { name: 'readers', description: 'Читатели/пользователи', type: 'root' },
        { name: 'reservations', description: 'Бронирования экземпляров', type: 'root' },
        { name: 'books/{id}/copies', description: 'Экземпляры конкретной книги', type: 'nested' },
        { name: 'authors/{id}/books', description: 'Книги конкретного автора', type: 'nested' },
      ],
    },
  },
  {
    id: 2,
    title: 'Спроектируй URL-структуру',
    description: 'URL — это адрес ресурса. Он должен быть читаемым, консистентным и предсказуемым.',
    checklist: [
      'Использовать существительные во множественном числе: /books, /authors',
      'Иерархия через путь: /authors/{id}/books — книги автора',
      'Идентификаторы в пути: /books/{id}',
      'Фильтрация через query-параметры: /books?genre=fiction',
      'Нижний регистр и дефисы: /reading-lists, не /readingLists',
    ],
    solution: {
      title: 'URL-схема библиотеки',
      endpoints: [
        { method: 'GET', path: '/books', description: 'Список книг (с пагинацией и фильтрами)' },
        { method: 'POST', path: '/books', description: 'Добавить книгу' },
        { method: 'GET', path: '/books/{id}', description: 'Получить книгу' },
        { method: 'PUT', path: '/books/{id}', description: 'Обновить книгу целиком' },
        { method: 'PATCH', path: '/books/{id}', description: 'Частично обновить книгу' },
        { method: 'DELETE', path: '/books/{id}', description: 'Удалить книгу' },
        { method: 'GET', path: '/authors/{id}/books', description: 'Книги автора' },
        { method: 'GET', path: '/readers/{id}/reservations', description: 'Бронирования читателя' },
      ],
    },
  },
  {
    id: 3,
    title: 'Выбери HTTP-методы',
    description: 'Каждый метод имеет чёткую семантику. Нарушение семантики — главная ошибка в дизайне API.',
    checklist: [
      'GET — только чтение, без побочных эффектов, кешируемый',
      'POST — создание ресурса или action (не идемпотентный)',
      'PUT — полная замена ресурса (идемпотентный)',
      'PATCH — частичное обновление (осторожно с идемпотентностью)',
      'DELETE — удаление (идемпотентный: второй вызов тоже OK)',
      'Нельзя использовать GET для удаления или POST для получения списков',
    ],
    solution: {
      title: 'Матрица методов библиотеки',
      matrix: [
        { resource: '/books', get: 'Список книг', post: 'Создать книгу', put: '—', patch: '—', delete: '—' },
        { resource: '/books/{id}', get: 'Детали книги', post: '—', put: 'Заменить книгу', patch: 'Обновить поля', delete: 'Удалить книгу' },
        { resource: '/reservations', get: 'Список броней', post: 'Забронировать', put: '—', patch: '—', delete: '—' },
        { resource: '/reservations/{id}', get: 'Детали брони', post: '—', put: '—', patch: 'Изменить даты', delete: 'Отменить бронь' },
      ],
    },
  },
  {
    id: 4,
    title: 'Определи статус-коды',
    description: 'Статус-код — это контракт с клиентом. Он говорит: "вот что случилось и что делать дальше".',
    checklist: [
      '200 OK — успешный GET/PUT/PATCH с телом ответа',
      '201 Created — успешный POST, создан ресурс, Location в заголовке',
      '204 No Content — успешный DELETE или PATCH без тела',
      '400 Bad Request — ошибка в запросе клиента, тело с деталями',
      '401 Unauthorized — нет или неверный токен',
      '403 Forbidden — токен есть, но прав нет',
      '404 Not Found — ресурс не существует',
      '409 Conflict — конфликт состояния (дублирование, неверный статус)',
      '429 Too Many Requests — rate limit',
      '500 Internal Server Error — ошибка сервера, не клиента',
    ],
    solution: {
      title: 'Статус-коды для библиотеки',
      examples: [
        { operation: 'GET /books', success: '200 OK', errors: '400 (неверные параметры)' },
        { operation: 'POST /books', success: '201 Created + Location', errors: '400, 409 (ISBN уже существует)' },
        { operation: 'DELETE /books/{id}', success: '204 No Content', errors: '404, 409 (есть активные брони)' },
        { operation: 'POST /reservations', success: '201 Created', errors: '400, 404 (книга не найдена), 409 (нет доступных экземпляров)' },
        { operation: 'PATCH /reservations/{id}', success: '200 OK', errors: '400, 403, 404, 409 (нельзя изменить завершённую)' },
      ],
    },
  },
  {
    id: 5,
    title: 'Спроектируй request/response',
    description: 'Модели данных — это то, с чем работают клиенты каждый день. Консистентность важнее "красоты".',
    checklist: [
      'camelCase для всех полей JSON',
      'Даты в ISO 8601: "2024-01-15T10:30:00Z"',
      'Идентификаторы как строки (UUID или ULID), не числа',
      'Envelope для списков: { data: [], meta: {} }',
      'Envelope для одиночного ресурса: { data: {...} }',
      'Единый формат ошибок: { error: { code, message, details } }',
      'Не возвращать чувствительные данные (пароли, внутренние ID)',
    ],
    solution: {
      title: 'Модели данных библиотеки',
      models: [
        {
          name: 'Book (ответ)',
          code: `{
  "data": {
    "id": "01HX4K2M9P",
    "isbn": "978-5-17-090800-3",
    "title": "Мастер и Маргарита",
    "authors": [{ "id": "01HX4K2M9Q", "name": "Михаил Булгаков" }],
    "genre": "fiction",
    "publishedAt": "1966-01-01",
    "availableCopies": 3,
    "totalCopies": 5,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-03-20T14:22:00Z"
  }
}`,
        },
        {
          name: 'Ошибка (единый формат)',
          code: `{
  "error": {
    "code": "BOOK_NOT_AVAILABLE",
    "message": "Нет доступных экземпляров книги",
    "details": {
      "bookId": "01HX4K2M9P",
      "availableCopies": 0,
      "nextAvailableAt": "2024-04-01T00:00:00Z"
    }
  }
}`,
        },
      ],
    },
  },
  {
    id: 6,
    title: 'Добавь пагинацию и фильтрацию',
    description: 'Без пагинации список из 100 000 книг убьёт и сервер, и клиента. Без фильтрации — API бесполезен.',
    checklist: [
      'Cursor-based пагинация для лент и real-time данных',
      'Offset-based для данных с фиксированными страницами',
      'Сортировка: ?sort=title&order=asc',
      'Фильтрация: ?genre=fiction&available=true',
      'Полнотекстовый поиск: ?q=булгаков',
      'Мета-информация в ответе: total, page, perPage, hasNext',
      'Разумный default limit (20-50) и максимум (100-200)',
    ],
    solution: {
      title: 'Пагинация и фильтры для /books',
      code: `GET /books?page=2&limit=20&genre=fiction&available=true&sort=title&order=asc

{
  "data": [ ...20 книг... ],
  "meta": {
    "total": 847,
    "page": 2,
    "perPage": 20,
    "totalPages": 43,
    "hasNext": true,
    "hasPrev": true
  },
  "links": {
    "self": "/books?page=2&limit=20",
    "next": "/books?page=3&limit=20",
    "prev": "/books?page=1&limit=20",
    "first": "/books?page=1&limit=20",
    "last": "/books?page=43&limit=20"
  }
}`,
    },
  },
  {
    id: 7,
    title: 'Итоговый summary',
    description: 'API спроектировано. Проверь финальный чеклист перед написанием OpenAPI-спецификации.',
    checklist: [
      'Все ресурсы идентифицированы и имеют понятные имена',
      'URL-структура консистентна (множественное число, нижний регистр)',
      'HTTP-методы соответствуют семантике (GET не изменяет данные)',
      'Статус-коды покрывают все success и error-сценарии',
      'Модели данных консистентны (camelCase, ISO даты, envelope)',
      'Пагинация реализована для всех списочных эндпоинтов',
      'Формат ошибок единый во всём API',
      'Версионирование обдумано (/v1/ в URL или заголовок)',
      'Документация написана или запланирована',
      'Rate limiting настроен и задокументирован',
    ],
    solution: {
      title: 'Итоги проектирования',
      summary: {
        endpoints: 14,
        resources: 4,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        patterns: ['Envelope', 'Cursor pagination', 'Error codes', 'Versioning'],
      },
    },
  },
]

function SolutionContent({ solution, stepId, methodColor }: { solution: WizardSolution; stepId: number; methodColor: Record<string, string> }) {
  if ('items' in solution) {
    const s = solution as { title: string; items: ResourceItem[] }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem', fontWeight: 600 }}>{s.title}</p>
        {s.items.map((item, idx) => (
          <div key={idx} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0.4rem 0.6rem', marginBottom: '0.3rem',
            background: item.type === 'root' ? '#fff' : '#fef9c3',
            border: '1px solid #fde68a', borderRadius: '6px', fontSize: '0.8rem',
          }}>
            <code style={{ color: '#7c3aed' }}>{item.name}</code>
            <span style={{ color: '#64748b', fontSize: '0.75rem' }}>{item.description}</span>
          </div>
        ))}
      </div>
    )
  }
  if ('endpoints' in solution) {
    const s = solution as { title: string; endpoints: EndpointItem[] }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem', fontWeight: 600 }}>{s.title}</p>
        {s.endpoints.map((ep, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{
              padding: '0.15rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700,
              background: methodColor[ep.method] || '#64748b', color: '#fff', minWidth: '50px', textAlign: 'center',
            }}>{ep.method}</span>
            <code style={{ fontSize: '0.78rem', color: '#7c3aed' }}>{ep.path}</code>
            <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{ep.description}</span>
          </div>
        ))}
      </div>
    )
  }
  if ('matrix' in solution) {
    const s = solution as { title: string; matrix: MatrixRow[] }
    return (
      <div style={{ overflowX: 'auto' }}>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.5rem', fontWeight: 600 }}>{s.title}</p>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.72rem' }}>
          <thead>
            <tr style={{ background: '#fde68a' }}>
              <th style={{ padding: '0.3rem', textAlign: 'left', border: '1px solid #f59e0b' }}>Ресурс</th>
              {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
                <th key={m} style={{ padding: '0.3rem', border: '1px solid #f59e0b', color: methodColor[m] }}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {s.matrix.map((row, idx) => (
              <tr key={idx} style={{ background: idx % 2 === 0 ? '#fff' : '#fefce8' }}>
                <td style={{ padding: '0.3rem', border: '1px solid #fde68a', fontFamily: 'monospace' }}>{row.resource}</td>
                {[row.get, row.post, row.put, row.patch, row.delete].map((cell, ci) => (
                  <td key={ci} style={{ padding: '0.3rem', border: '1px solid #fde68a', color: cell === '—' ? '#cbd5e1' : '#374151', textAlign: 'center' }}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  if ('examples' in solution) {
    const s = solution as { title: string; examples: ExampleItem[] }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem', fontWeight: 600 }}>{s.title}</p>
        {s.examples.map((ex, idx) => (
          <div key={idx} style={{ padding: '0.5rem', background: '#fff', border: '1px solid #fde68a', borderRadius: '6px', marginBottom: '0.4rem', fontSize: '0.78rem' }}>
            <code style={{ color: '#7c3aed', display: 'block', marginBottom: '0.2rem' }}>{ex.operation}</code>
            <span style={{ color: '#22c55e' }}>✓ {ex.success}</span>
            <span style={{ color: '#64748b', marginLeft: '0.75rem' }}>✗ {ex.errors}</span>
          </div>
        ))}
      </div>
    )
  }
  if ('models' in solution) {
    const s = solution as { title: string; models: ModelItem[] }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem', fontWeight: 600 }}>{s.title}</p>
        {s.models.map((model, idx) => (
          <div key={idx} style={{ marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: '0.3rem' }}>{model.name}</p>
            <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.68rem', overflowX: 'auto', margin: 0 }}>
              {model.code}
            </pre>
          </div>
        ))}
      </div>
    )
  }
  if ('code' in solution) {
    const s = solution as { title: string; code: string }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.5rem', fontWeight: 600 }}>{s.title}</p>
        <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.68rem', overflowX: 'auto', margin: 0 }}>
          {s.code}
        </pre>
      </div>
    )
  }
  if (stepId === 7 && 'summary' in solution) {
    const s = solution as { title: string; summary: { endpoints: number; resources: number; methods: string[]; patterns: string[] } }
    return (
      <div>
        <p style={{ fontSize: '0.82rem', color: '#78350f', marginBottom: '0.75rem', fontWeight: 600 }}>Итоги проектирования</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          {[
            { label: 'Эндпоинтов', value: String(s.summary.endpoints) },
            { label: 'Ресурсов', value: String(s.summary.resources) },
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '0.75rem', background: '#fff', border: '1px solid #fde68a', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#6366f1' }}>{item.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {s.summary.patterns.map((p, idx) => (
            <span key={idx} style={{ padding: '0.2rem 0.5rem', background: '#ede9fe', color: '#6366f1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>{p}</span>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function Task14_1_Solution() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedChecks, setCompletedChecks] = useState<Record<string, boolean>>({})
  const [showSolution, setShowSolution] = useState(false)

  const step = WIZARD_STEPS[currentStep]
  const stepKey = (itemIdx: number) => `${step.id}-${itemIdx}`

  const toggleCheck = (idx: number) => {
    const key = stepKey(idx)
    setCompletedChecks(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const checkedCount = step.checklist.filter((_, idx) => completedChecks[stepKey(idx)]).length
  const allChecked = checkedCount === step.checklist.length

  const goNext = () => {
    setCurrentStep(s => Math.min(s + 1, WIZARD_STEPS.length - 1))
    setShowSolution(false)
  }
  const goPrev = () => {
    setCurrentStep(s => Math.max(s - 1, 0))
    setShowSolution(false)
  }

  const methodColor: Record<string, string> = {
    GET: '#3b82f6', POST: '#22c55e', PUT: '#f59e0b', PATCH: '#8b5cf6', DELETE: '#ef4444',
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор API: Библиотека</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Пошаговый процесс проектирования REST API от ресурсов до пагинации
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          {WIZARD_STEPS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => { setCurrentStep(idx); setShowSolution(false) }}
              style={{
                width: `${100 / WIZARD_STEPS.length - 1}%`,
                padding: '0.4rem 0.2rem',
                borderRadius: '6px',
                border: '2px solid',
                borderColor: idx === currentStep ? '#6366f1' : idx < currentStep ? '#a5b4fc' : '#e2e8f0',
                background: idx === currentStep ? '#6366f1' : idx < currentStep ? '#ede9fe' : '#f8fafc',
                color: idx === currentStep ? '#fff' : idx < currentStep ? '#6366f1' : '#94a3b8',
                fontSize: '0.72rem',
                fontWeight: idx === currentStep ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {s.id}. {s.title.split(' ').slice(0, 2).join(' ')}
            </button>
          ))}
        </div>
        <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
          <div style={{
            height: '100%',
            borderRadius: '2px',
            background: '#6366f1',
            width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%`,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Step content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Left: checklist */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#1e293b' }}>
            Шаг {step.id}: {step.title}
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '1rem', lineHeight: 1.5 }}>
            {step.description}
          </p>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>
              <span>Чеклист</span>
              <span style={{ color: allChecked ? '#22c55e' : '#6366f1' }}>{checkedCount}/{step.checklist.length}</span>
            </div>
            {step.checklist.map((item, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={!!completedChecks[stepKey(idx)]}
                  onChange={() => toggleCheck(idx)}
                  style={{ marginTop: '3px', accentColor: '#6366f1', flexShrink: 0 }}
                />
                <span style={{
                  fontSize: '0.82rem',
                  color: completedChecks[stepKey(idx)] ? '#94a3b8' : '#374151',
                  textDecoration: completedChecks[stepKey(idx)] ? 'line-through' : 'none',
                  lineHeight: 1.4,
                }}>
                  {item}
                </span>
              </label>
            ))}
          </div>

          {allChecked && (
            <div style={{ padding: '0.6rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', fontSize: '0.82rem', color: '#16a34a', textAlign: 'center' }}>
              Шаг выполнен! Посмотри решение
            </div>
          )}
        </div>

        {/* Right: solution */}
        <div style={{ background: '#fefce8', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#92400e' }}>Эталонное решение</h3>
            <button
              onClick={() => setShowSolution(!showSolution)}
              style={{
                padding: '0.3rem 0.75rem',
                border: 'none',
                borderRadius: '6px',
                background: showSolution ? '#fde68a' : '#f59e0b',
                color: '#92400e',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {showSolution ? 'Скрыть' : 'Показать'}
            </button>
          </div>

          {showSolution && (
            <SolutionContent solution={step.solution} stepId={step.id} methodColor={methodColor} />
          )}

          {!showSolution && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#a3a3a3' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
              <p style={{ fontSize: '0.85rem' }}>Нажми «Показать» чтобы увидеть эталонный ответ</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
        <button
          onClick={goPrev}
          disabled={currentStep === 0}
          style={{
            padding: '0.6rem 1.25rem', border: '1px solid #e2e8f0', borderRadius: '8px',
            background: currentStep === 0 ? '#f1f5f9' : '#fff', color: currentStep === 0 ? '#94a3b8' : '#374151',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer', fontWeight: 500,
          }}
        >
          Назад
        </button>
        <span style={{ fontSize: '0.85rem', color: '#64748b', alignSelf: 'center' }}>
          Шаг {currentStep + 1} из {WIZARD_STEPS.length}
        </span>
        <button
          onClick={goNext}
          disabled={currentStep === WIZARD_STEPS.length - 1}
          style={{
            padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px',
            background: currentStep === WIZARD_STEPS.length - 1 ? '#f1f5f9' : '#6366f1',
            color: currentStep === WIZARD_STEPS.length - 1 ? '#94a3b8' : '#fff',
            cursor: currentStep === WIZARD_STEPS.length - 1 ? 'not-allowed' : 'pointer', fontWeight: 600,
          }}
        >
          Следующий шаг
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 14.2: API Review — найди проблемы
// ============================================

type Problem = {
  id: number
  category: string
  found: boolean
  fixed: boolean
}

const BAD_API_SPEC = `# Bad API Spec — Shop API v0.1
# Попробуй найти все проблемы до того, как смотреть подсказки

GET  /getProducts          # Вернуть список товаров
GET  /getProductById?id=5  # Получить товар
POST /createProduct        # Создать товар
POST /updateProduct        # Обновить товар
POST /deleteProduct?id=5   # Удалить товар
GET  /deleteProduct?id=5   # Тоже удаляет (для удобства)

GET  /Products             # Ещё один список (дублирует)
GET  /product_list         # И ещё один (другой стиль)

POST /search               # Поиск товаров
GET  /filter               # Фильтрация

# Пример успешного ответа на GET /getProductById?id=5:
{
  "status": "ok",           # Статус HTTP = 200, даже если товар не найден
  "error": false,
  "ProductID": 5,           # PascalCase вместо camelCase
  "product_name": "Кофе",   # snake_case, не camelCase
  "Price": "100 руб",       # Строка вместо числа
  "createdat": "01.01.2024" # Не ISO 8601
}

# Пример "ошибки": товар не найден
HTTP 200 OK
{
  "status": "not_found",
  "error": true,
  "message": "не найдено"
  # Нет машинного кода ошибки
  # Нет деталей
}

# GET /getProducts — нет пагинации
# Возвращает все 50 000 товаров сразу

# Нет версионирования URL (v1, v2 и т.д.)
# Нет документации по rate limiting`

const PROBLEMS: Array<{
  id: number
  category: string
  title: string
  description: string
  bad: string
  good: string
}> = [
  {
    id: 1,
    category: 'URL Design',
    title: 'Глаголы в URL',
    description: 'URL должен обозначать ресурс (существительное), а не действие. Действие определяется HTTP-методом.',
    bad: 'GET /getProducts\nPOST /createProduct\nPOST /deleteProduct',
    good: 'GET /products\nPOST /products\nDELETE /products/{id}',
  },
  {
    id: 2,
    category: 'URL Design',
    title: 'Непоследовательный регистр URL',
    description: 'В одном API одновременно используются camelCase, PascalCase и snake_case в URL. Нужен единый стандарт — нижний регистр с дефисами.',
    bad: '/getProductById\n/Products\n/product_list',
    good: '/products\n/products/{id}\n/products/featured-list',
  },
  {
    id: 3,
    category: 'HTTP Methods',
    title: 'POST для удаления',
    description: 'DELETE — семантически правильный метод. POST /deleteProduct нарушает REST-конвенции и делает API непредсказуемым.',
    bad: 'POST /deleteProduct?id=5',
    good: 'DELETE /products/{id}',
  },
  {
    id: 4,
    category: 'HTTP Methods',
    title: 'GET изменяет данные',
    description: 'GET должен быть безопасным и идемпотентным. Если GET /deleteProduct?id=5 удаляет — это катастрофа: браузерные prefetch, логгеры, краулеры уничтожат данные.',
    bad: 'GET /deleteProduct?id=5  # удаляет!',
    good: 'DELETE /products/{id}',
  },
  {
    id: 5,
    category: 'HTTP Methods',
    title: 'POST для частичного обновления',
    description: 'POST /updateProduct нарушает идемпотентность. Для обновления используй PUT (полная замена) или PATCH (частичное обновление).',
    bad: 'POST /updateProduct',
    good: 'PUT /products/{id}    # полная замена\nPATCH /products/{id}  # частичное',
  },
  {
    id: 6,
    category: 'Status Codes',
    title: '200 OK на ошибки',
    description: 'HTTP 200 с { "status": "not_found" } — худшая практика API. Клиент видит 200 и не знает, что ошибка. Нельзя использовать HTTP-статус как "конверт" для своего статуса.',
    bad: 'HTTP 200 OK\n{ "status": "not_found", "error": true }',
    good: 'HTTP 404 Not Found\n{ "error": { "code": "PRODUCT_NOT_FOUND", "message": "..." } }',
  },
  {
    id: 7,
    category: 'Data Model',
    title: 'Непоследовательное именование полей',
    description: 'ProductID (PascalCase), product_name (snake_case), createdat (нижний регистр) в одном ответе — хаос. Нужен единый стандарт: camelCase для JSON API.',
    bad: '"ProductID": 5\n"product_name": "Кофе"\n"createdat": "..."',
    good: '"id": "5"\n"name": "Кофе"\n"createdAt": "2024-01-01T..."',
  },
  {
    id: 8,
    category: 'Data Model',
    title: 'Цена как строка',
    description: '"Price": "100 руб" — нельзя сортировать, фильтровать, суммировать. Числовые данные должны быть числами. Валюту храни отдельно.',
    bad: '"Price": "100 руб"',
    good: '"price": 100.00\n"currency": "RUB"',
  },
  {
    id: 9,
    category: 'Data Model',
    title: 'Дата не в ISO 8601',
    description: '"01.01.2024" — неоднозначный формат (день/месяц или месяц/день?). Используй ISO 8601: "2024-01-01T00:00:00Z". Клиенты в любой стране распарсят правильно.',
    bad: '"createdat": "01.01.2024"',
    good: '"createdAt": "2024-01-01T00:00:00Z"',
  },
  {
    id: 10,
    category: 'Pagination',
    title: 'Нет пагинации',
    description: 'GET /getProducts без пагинации вернёт все 50 000 товаров. Это убьёт сервер (память, CPU) и клиент (парсинг гигантского JSON). Всегда ограничивай списки.',
    bad: 'GET /getProducts\n# Возвращает все 50 000 товаров',
    good: 'GET /products?page=1&limit=20\n# max limit = 100',
  },
  {
    id: 11,
    category: 'Search/Filter',
    title: 'POST для поиска',
    description: 'POST /search не кешируется, URL нельзя скопировать. Поиск — это GET с query-параметрами. Исключение: сложные поисковые запросы (тогда POST с документацией).',
    bad: 'POST /search\nPOST /filter',
    good: 'GET /products?q=кофе&category=drinks',
  },
  {
    id: 12,
    category: 'Versioning',
    title: 'Нет версионирования',
    description: 'Без версии API нельзя делать breaking changes. Как только API публичный — добавляй /v1/. Иначе любое изменение сломает существующих клиентов.',
    bad: 'GET /products',
    good: 'GET /v1/products',
  },
  {
    id: 13,
    category: 'Errors',
    title: 'Нет машинного кода ошибки',
    description: '{ "message": "не найдено" } — нечитаемо машиной. Клиент не может обработать ошибку программно. Нужен code: "PRODUCT_NOT_FOUND" — строка, не число.',
    bad: '{ "error": true, "message": "не найдено" }',
    good: '{ "error": { "code": "PRODUCT_NOT_FOUND",\n  "message": "Товар не найден" } }',
  },
  {
    id: 14,
    category: 'Rate Limiting',
    title: 'Нет документации по rate limiting',
    description: 'Даже если rate limiting есть — если он не задокументирован, клиент не знает, как себя вести при 429. Нужны заголовки X-RateLimit-* и документация.',
    bad: '# нет упоминания лимитов',
    good: 'X-RateLimit-Limit: 1000\nX-RateLimit-Remaining: 950\nX-RateLimit-Reset: 1735689600',
  },
  {
    id: 15,
    category: 'URL Design',
    title: 'Дублирование эндпоинтов',
    description: '/getProducts, /Products, /product_list — три URL для одного ресурса. Дублирование убивает предсказуемость API. Один ресурс — один URL.',
    bad: 'GET /getProducts\nGET /Products\nGET /product_list',
    good: 'GET /v1/products',
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'URL Design': '#6366f1',
  'HTTP Methods': '#22c55e',
  'Status Codes': '#ef4444',
  'Data Model': '#f59e0b',
  'Pagination': '#8b5cf6',
  'Search/Filter': '#06b6d4',
  'Versioning': '#ec4899',
  'Errors': '#dc2626',
  'Rate Limiting': '#0ea5e9',
}

export function Task14_2_Solution() {
  const [problems, setProblems] = useState<Problem[]>(
    PROBLEMS.map(p => ({ id: p.id, category: p.category, found: false, fixed: false }))
  )
  const [showSpec, setShowSpec] = useState(true)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const toggleFound = (id: number) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, found: !p.found } : p))
  }
  const toggleFixed = (id: number) => {
    setProblems(prev => prev.map(p => p.id === id ? { ...p, fixed: !p.fixed } : p))
  }

  const foundCount = problems.filter(p => p.found).length
  const fixedCount = problems.filter(p => p.fixed).length
  const categories = Array.from(new Set(PROBLEMS.map(p => p.category)))

  const filteredProblems = activeCategory
    ? PROBLEMS.filter(p => p.category === activeCategory)
    : PROBLEMS

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>API Review: найди 15 проблем</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Перед тобой реальная (плохая) спецификация Shop API. Найди все проблемы — отмечай найденные,
        смотри исправления.
      </p>

      {/* Score */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Найдено проблем', value: foundCount, total: PROBLEMS.length, color: '#6366f1' },
          { label: 'Изучено исправлений', value: fixedCount, total: PROBLEMS.length, color: '#22c55e' },
          { label: 'Прогресс Review', value: Math.round((foundCount + fixedCount) / (PROBLEMS.length * 2) * 100), total: 100, color: '#f59e0b', isPercent: true },
        ].map((item, idx) => (
          <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: item.color }}>
              {item.value}{item.isPercent ? '%' : `/${item.total}`}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{item.label}</div>
            <div style={{ marginTop: '0.5rem', height: '4px', background: '#e2e8f0', borderRadius: '2px' }}>
              <div style={{ height: '100%', borderRadius: '2px', background: item.color, width: `${(item.value / item.total) * 100}%`, transition: 'width 0.3s' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Spec toggle */}
      <button
        onClick={() => setShowSpec(!showSpec)}
        style={{ marginBottom: '1rem', padding: '0.5rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
      >
        {showSpec ? 'Скрыть спецификацию' : 'Показать спецификацию'}
      </button>

      {showSpec && (
        <pre style={{
          background: '#0f172a', color: '#94a3b8', padding: '1.25rem', borderRadius: '10px',
          fontSize: '0.73rem', overflowX: 'auto', marginBottom: '1.5rem', lineHeight: 1.6,
        }}>
          {BAD_API_SPEC}
        </pre>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{
            padding: '0.25rem 0.65rem', borderRadius: '20px', border: '1px solid', fontSize: '0.78rem',
            borderColor: activeCategory === null ? '#6366f1' : '#e2e8f0',
            background: activeCategory === null ? '#ede9fe' : '#fff',
            color: activeCategory === null ? '#6366f1' : '#64748b',
            cursor: 'pointer', fontWeight: activeCategory === null ? 600 : 400,
          }}
        >
          Все ({PROBLEMS.length})
        </button>
        {categories.map(cat => {
          const count = PROBLEMS.filter(p => p.category === cat).length
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              style={{
                padding: '0.25rem 0.65rem', borderRadius: '20px', border: '1px solid', fontSize: '0.78rem',
                borderColor: activeCategory === cat ? CATEGORY_COLORS[cat] : '#e2e8f0',
                background: activeCategory === cat ? `${CATEGORY_COLORS[cat]}20` : '#fff',
                color: activeCategory === cat ? CATEGORY_COLORS[cat] : '#64748b',
                cursor: 'pointer', fontWeight: activeCategory === cat ? 600 : 400,
              }}
            >
              {cat} ({count})
            </button>
          )
        })}
      </div>

      {/* Problems list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filteredProblems.map(problem => {
          const state = problems.find(p => p.id === problem.id)!
          return (
            <div
              key={problem.id}
              style={{
                border: '1px solid',
                borderColor: state.found ? '#bbf7d0' : '#e2e8f0',
                borderRadius: '10px',
                background: state.found ? '#f0fdf4' : '#fff',
                overflow: 'hidden',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem' }}>
                <input
                  type="checkbox"
                  checked={state.found}
                  onChange={() => toggleFound(problem.id)}
                  style={{ accentColor: '#22c55e', width: '16px', height: '16px', flexShrink: 0 }}
                />
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600,
                  background: `${CATEGORY_COLORS[problem.category]}20`, color: CATEGORY_COLORS[problem.category],
                }}>
                  {problem.category}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b', flex: 1 }}>
                  #{problem.id} {problem.title}
                </span>
                <button
                  onClick={() => toggleFixed(problem.id)}
                  style={{
                    padding: '0.25rem 0.65rem', border: 'none', borderRadius: '6px', fontSize: '0.75rem',
                    background: state.fixed ? '#dcfce7' : '#f1f5f9',
                    color: state.fixed ? '#16a34a' : '#64748b',
                    cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  {state.fixed ? 'Скрыть решение' : 'Показать исправление'}
                </button>
              </div>

              {state.fixed && (
                <div style={{ borderTop: '1px solid #e2e8f0', padding: '1rem' }}>
                  <p style={{ fontSize: '0.85rem', color: '#374151', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    {problem.description}
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', marginBottom: '0.3rem' }}>Было (плохо)</p>
                      <pre style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '0.6rem', fontSize: '0.73rem', color: '#dc2626', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {problem.bad}
                      </pre>
                    </div>
                    <div>
                      <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginBottom: '0.3rem' }}>Стало (хорошо)</p>
                      <pre style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.6rem', fontSize: '0.73rem', color: '#16a34a', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {problem.good}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {foundCount === PROBLEMS.length && fixedCount === PROBLEMS.length && (
        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <p style={{ fontWeight: 700, color: '#16a34a', fontSize: '1.1rem', marginBottom: '0.25rem' }}>Отличный API Review!</p>
          <p style={{ color: '#4ade80', fontSize: '0.85rem' }}>Ты нашёл и изучил все 15 проблем. Теперь твой код-ревью API будет на уровне.</p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 14.3: E-commerce API Reference Design
// ============================================

type EcomResource = {
  name: string
  emoji: string
  endpoints: Array<{
    method: string
    path: string
    status: string
    request?: string
    response: string
    notes?: string
  }>
}

const ECOMMERCE_API: EcomResource[] = [
  {
    name: 'Products',
    emoji: '📦',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/products',
        status: '200',
        response: `{
  "data": [
    {
      "id": "prod_01HX",
      "sku": "COFFEE-ARABICA-500",
      "name": "Арабика Эфиопия",
      "price": { "amount": 850.00, "currency": "RUB" },
      "stock": 42,
      "categoryId": "cat_01HX",
      "images": [{ "url": "...", "alt": "Кофе" }],
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "meta": { "total": 1240, "page": 1, "perPage": 20 }
}`,
        notes: '?page=1&limit=20&category=coffee&q=арабика&sort=price&order=asc',
      },
      {
        method: 'POST',
        path: '/v1/products',
        status: '201',
        request: `{
  "sku": "COFFEE-ARABICA-500",
  "name": "Арабика Эфиопия",
  "price": { "amount": 850.00, "currency": "RUB" },
  "categoryId": "cat_01HX",
  "stock": 100
}`,
        response: `{
  "data": { "id": "prod_01HX", ...все поля... }
}
# Location: /v1/products/prod_01HX`,
        notes: 'Errors: 400 (validation), 409 (SKU conflict)',
      },
      {
        method: 'GET',
        path: '/v1/products/{id}',
        status: '200',
        response: `{
  "data": {
    "id": "prod_01HX",
    "sku": "COFFEE-ARABICA-500",
    "name": "Арабика Эфиопия",
    "description": "...",
    "price": { "amount": 850.00, "currency": "RUB" },
    "stock": 42,
    "category": { "id": "cat_01HX", "name": "Кофе" },
    "reviews": { "count": 127, "avgRating": 4.7 }
  }
}`,
        notes: 'Errors: 404 (not found)',
      },
      {
        method: 'PATCH',
        path: '/v1/products/{id}',
        status: '200',
        request: `{ "price": { "amount": 790.00, "currency": "RUB" } }`,
        response: `{ "data": { ...обновлённые поля... } }`,
        notes: 'Errors: 400, 403 (not owner), 404',
      },
    ],
  },
  {
    name: 'Cart',
    emoji: '🛒',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/cart',
        status: '200',
        response: `{
  "data": {
    "id": "cart_01HX",
    "items": [
      {
        "id": "item_01HX",
        "product": { "id": "prod_01HX", "name": "Арабика", "price": {...} },
        "quantity": 2,
        "subtotal": { "amount": 1700.00, "currency": "RUB" }
      }
    ],
    "total": { "amount": 1700.00, "currency": "RUB" },
    "itemCount": 2
  }
}`,
        notes: 'Корзина привязана к сессии/пользователю',
      },
      {
        method: 'POST',
        path: '/v1/cart/items',
        status: '201',
        request: `{
  "productId": "prod_01HX",
  "quantity": 2
}`,
        response: `{
  "data": {
    "id": "item_01HX",
    "productId": "prod_01HX",
    "quantity": 2,
    "addedAt": "2024-03-01T12:00:00Z"
  }
}`,
        notes: 'Errors: 400, 404 (product), 409 (out of stock)',
      },
      {
        method: 'PATCH',
        path: '/v1/cart/items/{itemId}',
        status: '200',
        request: `{ "quantity": 3 }`,
        response: `{ "data": { "id": "item_01HX", "quantity": 3, "subtotal": {...} } }`,
        notes: 'quantity=0 эквивалентно DELETE',
      },
      {
        method: 'DELETE',
        path: '/v1/cart/items/{itemId}',
        status: '204',
        response: '# Нет тела ответа',
        notes: 'Errors: 404',
      },
    ],
  },
  {
    name: 'Orders',
    emoji: '📋',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/orders',
        status: '201',
        request: `{
  "cartId": "cart_01HX",
  "shippingAddressId": "addr_01HX",
  "paymentMethodId": "pm_01HX"
}`,
        response: `{
  "data": {
    "id": "ord_01HX",
    "status": "pending_payment",
    "items": [...],
    "total": { "amount": 1700.00, "currency": "RUB" },
    "createdAt": "2024-03-01T12:05:00Z"
  }
}
# Location: /v1/orders/ord_01HX`,
        notes: 'Errors: 400, 409 (cart empty, stock changed)',
      },
      {
        method: 'GET',
        path: '/v1/orders',
        status: '200',
        response: `{
  "data": [
    {
      "id": "ord_01HX",
      "status": "delivered",
      "total": { "amount": 1700.00, "currency": "RUB" },
      "createdAt": "2024-03-01T12:05:00Z"
    }
  ],
  "meta": { "total": 14, "page": 1, "perPage": 20 }
}`,
        notes: '?status=delivered&page=1&limit=20',
      },
      {
        method: 'GET',
        path: '/v1/orders/{id}',
        status: '200',
        response: `{
  "data": {
    "id": "ord_01HX",
    "status": "shipped",
    "items": [{ "product": {...}, "quantity": 2 }],
    "shipping": {
      "address": {...},
      "trackingNumber": "RU123456789",
      "estimatedDelivery": "2024-03-05"
    },
    "timeline": [
      { "status": "pending_payment", "at": "2024-03-01T12:05:00Z" },
      { "status": "paid", "at": "2024-03-01T12:06:00Z" },
      { "status": "shipped", "at": "2024-03-02T09:00:00Z" }
    ]
  }
}`,
      },
      {
        method: 'POST',
        path: '/v1/orders/{id}/cancel',
        status: '200',
        request: `{ "reason": "changed_mind" }`,
        response: `{ "data": { "id": "ord_01HX", "status": "cancelled" } }`,
        notes: 'Action endpoint для смены статуса. Errors: 409 (уже отправлен)',
      },
    ],
  },
  {
    name: 'Users',
    emoji: '👤',
    endpoints: [
      {
        method: 'POST',
        path: '/v1/auth/register',
        status: '201',
        request: `{
  "email": "user@example.com",
  "password": "...",
  "name": "Иван Петров"
}`,
        response: `{
  "data": {
    "id": "user_01HX",
    "email": "user@example.com",
    "name": "Иван Петров",
    "createdAt": "2024-03-01T10:00:00Z"
  },
  "meta": { "accessToken": "eyJ..." }
}`,
        notes: 'Errors: 400, 409 (email taken)',
      },
      {
        method: 'POST',
        path: '/v1/auth/login',
        status: '200',
        request: `{
  "email": "user@example.com",
  "password": "..."
}`,
        response: `{
  "data": {
    "accessToken": "eyJ...",
    "refreshToken": "...",
    "expiresIn": 3600
  }
}`,
        notes: 'Rate limit: 5 попыток/мин с IP',
      },
      {
        method: 'GET',
        path: '/v1/users/me',
        status: '200',
        response: `{
  "data": {
    "id": "user_01HX",
    "email": "user@example.com",
    "name": "Иван Петров",
    "addresses": [...],
    "preferences": { "currency": "RUB", "language": "ru" }
  }
}`,
        notes: 'Errors: 401',
      },
    ],
  },
  {
    name: 'Reviews',
    emoji: '⭐',
    endpoints: [
      {
        method: 'GET',
        path: '/v1/products/{id}/reviews',
        status: '200',
        response: `{
  "data": [
    {
      "id": "rev_01HX",
      "rating": 5,
      "title": "Отличный кофе",
      "body": "Очень ароматный, рекомендую",
      "author": { "id": "user_01HX", "name": "Иван П." },
      "verified": true,
      "createdAt": "2024-02-10T15:00:00Z"
    }
  ],
  "meta": {
    "total": 127,
    "avgRating": 4.7,
    "distribution": { "5": 80, "4": 30, "3": 10, "2": 5, "1": 2 }
  }
}`,
        notes: '?page=1&limit=20&sort=rating&order=desc',
      },
      {
        method: 'POST',
        path: '/v1/products/{id}/reviews',
        status: '201',
        request: `{
  "rating": 5,
  "title": "Отличный кофе",
  "body": "Очень ароматный, рекомендую",
  "orderId": "ord_01HX"
}`,
        response: `{ "data": { "id": "rev_01HX", "rating": 5, ... } }`,
        notes: 'Errors: 400, 401, 409 (уже оставил отзыв), 422 (не покупал)',
      },
    ],
  },
]

const METHOD_COLORS: Record<string, string> = {
  GET: '#3b82f6', POST: '#22c55e', PUT: '#f59e0b', PATCH: '#8b5cf6', DELETE: '#ef4444',
}
const STATUS_COLORS: Record<string, string> = {
  '200': '#22c55e', '201': '#22c55e', '204': '#22c55e',
  '400': '#f59e0b', '401': '#ef4444', '403': '#ef4444', '404': '#f59e0b', '409': '#f59e0b',
}

export function Task14_3_Solution() {
  const [activeResource, setActiveResource] = useState(0)
  const [activeEndpoint, setActiveEndpoint] = useState(0)
  const [showRequest, setShowRequest] = useState(true)

  const resource = ECOMMERCE_API[activeResource]
  const endpoint = resource.endpoints[activeEndpoint]

  const handleResourceChange = (idx: number) => {
    setActiveResource(idx)
    setActiveEndpoint(0)
    setShowRequest(true)
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '960px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Эталонный E-commerce API</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Полный дизайн REST API для интернет-магазина: Products, Cart, Orders, Users, Reviews.
        Изучи каждый endpoint — это эталон для финального задания.
      </p>

      {/* Resource tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {ECOMMERCE_API.map((res, idx) => (
          <button
            key={res.name}
            onClick={() => handleResourceChange(idx)}
            style={{
              padding: '0.5rem 1rem',
              border: '2px solid',
              borderColor: idx === activeResource ? '#6366f1' : '#e2e8f0',
              borderRadius: '8px',
              background: idx === activeResource ? '#ede9fe' : '#fff',
              color: idx === activeResource ? '#6366f1' : '#64748b',
              cursor: 'pointer',
              fontWeight: idx === activeResource ? 700 : 500,
              fontSize: '0.85rem',
            }}
          >
            {res.emoji} {res.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Endpoint list */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#f1f5f9', borderBottom: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>
            {resource.emoji} {resource.name} API
          </div>
          {resource.endpoints.map((ep, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveEndpoint(idx); setShowRequest(true) }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 0.75rem',
                border: 'none',
                borderBottom: '1px solid #f1f5f9',
                background: idx === activeEndpoint ? '#ede9fe' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                padding: '0.1rem 0.35rem', borderRadius: '3px', fontSize: '0.65rem', fontWeight: 700,
                background: METHOD_COLORS[ep.method], color: '#fff', minWidth: '40px', textAlign: 'center',
              }}>
                {ep.method}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#374151', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ep.path.replace('/v1', '')}
              </span>
            </button>
          ))}
        </div>

        {/* Endpoint detail */}
        <div>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem 1rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
            <span style={{
              padding: '0.3rem 0.7rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
              background: METHOD_COLORS[endpoint.method], color: '#fff',
            }}>
              {endpoint.method}
            </span>
            <code style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{endpoint.path}</code>
            <span style={{
              marginLeft: 'auto', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
              background: `${STATUS_COLORS[endpoint.status]}20`, color: STATUS_COLORS[endpoint.status],
            }}>
              {endpoint.status}
            </span>
          </div>

          {endpoint.notes && (
            <div style={{ padding: '0.6rem 0.9rem', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8rem', color: '#1d4ed8' }}>
              💡 {endpoint.notes}
            </div>
          )}

          {/* Toggle request/response */}
          {endpoint.request && (
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
              <button
                onClick={() => setShowRequest(true)}
                style={{
                  padding: '0.35rem 0.9rem', borderRadius: '6px', border: 'none', fontSize: '0.8rem', fontWeight: 600,
                  background: showRequest ? '#1e293b' : '#f1f5f9',
                  color: showRequest ? '#e2e8f0' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                Request Body
              </button>
              <button
                onClick={() => setShowRequest(false)}
                style={{
                  padding: '0.35rem 0.9rem', borderRadius: '6px', border: 'none', fontSize: '0.8rem', fontWeight: 600,
                  background: !showRequest ? '#1e293b' : '#f1f5f9',
                  color: !showRequest ? '#e2e8f0' : '#64748b',
                  cursor: 'pointer',
                }}
              >
                Response
              </button>
            </div>
          )}

          <pre style={{
            background: '#0f172a', color: '#e2e8f0', padding: '1.25rem', borderRadius: '10px',
            fontSize: '0.73rem', overflowX: 'auto', lineHeight: 1.7, margin: 0,
          }}>
            {endpoint.request && showRequest ? endpoint.request : endpoint.response}
          </pre>

          {/* Quick summary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
            {[
              { label: 'Метод', value: endpoint.method, color: METHOD_COLORS[endpoint.method] },
              { label: 'Успех', value: endpoint.status, color: STATUS_COLORS[endpoint.status] },
              { label: 'Auth', value: endpoint.path.includes('login') || endpoint.path.includes('register') ? 'Нет' : 'Bearer JWT', color: '#6366f1' },
            ].map((item, idx) => (
              <div key={idx} style={{ padding: '0.5rem 0.75rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: item.color }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cross-cutting concerns summary */}
      <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: '#fefce8', border: '1px solid #fde68a', borderRadius: '12px' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '0.95rem', color: '#92400e' }}>Сквозные аспекты всего API</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          {[
            {
              title: 'Версионирование',
              items: ['Все пути начинаются с /v1/', 'Breaking changes → /v2/', 'Deprecated с Sunset заголовком'],
            },
            {
              title: 'Error Format',
              items: ['{ "error": { code, message, details } }', 'code — строка: PRODUCT_NOT_FOUND', 'HTTP статус = смысл ошибки'],
            },
            {
              title: 'Аутентификация',
              items: ['Bearer JWT в Authorization', 'Публичные: GET /products', 'Приватные: cart, orders, reviews'],
            },
            {
              title: 'Пагинация',
              items: ['?page=1&limit=20 (max 100)', 'meta.total, meta.hasNext', 'links.next, links.prev'],
            },
            {
              title: 'Rate Limiting',
              items: ['Анон: 100 req/мин', 'Авториз: 1000 req/мин', '/auth/login: 5 попыток/мин'],
            },
            {
              title: 'Даты и форматы',
              items: ['Даты: ISO 8601 (UTC)', 'Деньги: { amount, currency }', 'ID: ULID строка (не число)'],
            },
          ].map((block, idx) => (
            <div key={idx} style={{ background: '#fff', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.75rem' }}>
              <p style={{ fontWeight: 700, fontSize: '0.82rem', color: '#92400e', marginBottom: '0.4rem' }}>{block.title}</p>
              {block.items.map((item, i) => (
                <p key={i} style={{ fontSize: '0.75rem', color: '#374151', marginBottom: '0.2rem', lineHeight: 1.4 }}>• {item}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
