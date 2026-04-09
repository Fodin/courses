import { useState } from 'react'

// ============================================
// Задание 0.1: Хороший vs плохой API
// ============================================

interface ApiPair {
  id: number
  category: string
  bad: {
    label: string
    code: string
  }
  good: {
    label: string
    code: string
  }
  explanation: string
  problemsInBad: string[]
}

const apiPairs: ApiPair[] = [
  {
    id: 1,
    category: 'URL-дизайн',
    bad: {
      label: 'Плохой endpoint',
      code: `POST /api/do_stuff?action=getUsers&type=all
POST /api/do_stuff?action=createUser
POST /api/do_stuff?action=deleteUser&id=5`,
    },
    good: {
      label: 'Хороший endpoint',
      code: `GET    /api/users
POST   /api/users
DELETE /api/users/5`,
    },
    explanation:
      'Хороший REST API использует существительные (ресурсы) в URL и HTTP-методы для выражения действий. Один универсальный "do_stuff" endpoint — антипаттерн: он игнорирует HTTP-семантику, не поддаётся кэшированию и нечитаем.',
    problemsInBad: [
      'Игнорируются HTTP-методы (всё через POST)',
      'Глагол в URL ("do_stuff") — нарушение REST',
      'Тип действия в query-параметре — нечитаемо',
      'Нет кэширования (GET-запросы кэшируются браузером и CDN)',
    ],
  },
  {
    id: 2,
    category: 'Формат ответа',
    bad: {
      label: 'Плохой response',
      code: `// Успех
{ "status": 1, "data": [...], "err": null }

// Ошибка
{ "status": 0, "data": null, "err": "user not found" }

// Другой endpoint: другой формат ошибки
{ "ok": false, "message": "Forbidden", "code": 403 }`,
    },
    good: {
      label: 'Хороший response',
      code: `// Успех: HTTP 200
{ "users": [...], "total": 42 }

// Ошибка: HTTP 404
{
  "type": "https://api.example.com/errors/not-found",
  "title": "User not found",
  "status": 404,
  "detail": "No user with id=5 exists"
}`,
    },
    explanation:
      'Консистентный формат ошибок (RFC 7807 Problem Details) и правильные HTTP-коды позволяют клиенту однотипно обрабатывать все ошибки. Смешивать бизнес-статус ("status": 0/1) с HTTP-кодом — путаница, которая бьёт по всем потребителям API.',
    problemsInBad: [
      'HTTP 200 при ошибке — обманывает клиента и мониторинг',
      'Разные форматы ошибок на разных endpoints',
      'Числовой "status" 0/1 дублирует HTTP-коды',
      'Строковые ошибки без структуры — нельзя надёжно парсить',
    ],
  },
  {
    id: 3,
    category: 'Именование полей',
    bad: {
      label: 'Плохое именование',
      code: `{
  "UserId": 5,
  "user_name": "john",
  "UserEmail": "john@example.com",
  "created_at_timestamp": 1712345678,
  "is_active_flag": true,
  "addr": "Moscow"
}`,
    },
    good: {
      label: 'Хорошее именование',
      code: `{
  "id": 5,
  "name": "john",
  "email": "john@example.com",
  "createdAt": "2024-04-06T10:21:18Z",
  "isActive": true,
  "address": "Moscow"
}`,
    },
    explanation:
      'camelCase — стандарт для JSON API (snake_case — для Python/Ruby). Даты в ISO 8601 (не Unix timestamp) читаемы и timezone-aware. Суффиксы _flag, _timestamp — шум: тип и так понятен из значения.',
    problemsInBad: [
      'Смешаны camelCase, PascalCase и snake_case — нет единого стиля',
      'Unix timestamp вместо ISO 8601 — нечитаемо без конвертации',
      'Суффиксы _flag, _timestamp — избыточны',
      'Сокращение "addr" вместо "address" — неочевидно',
    ],
  },
]

export function Task0_1_Solution() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggle = (id: number) =>
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const revealAll = () => setRevealed(new Set(apiPairs.map((p) => p.id)))

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Хороший vs плохой API</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Изучите каждую пару примеров. Попробуйте самостоятельно найти проблемы в «плохом» варианте,
        а потом нажмите «Показать разбор».
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
        Показать все разборы
      </button>

      {apiPairs.map((pair) => {
        const isRevealed = revealed.has(pair.id)
        return (
          <div
            key={pair.id}
            style={{
              marginBottom: '1.5rem',
              border: '1px solid #e0e0e0',
              borderRadius: '10px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#263238',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 'bold',
              }}
            >
              #{pair.id} — {pair.category}
            </div>

            {/* Code comparison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Bad */}
              <div style={{ borderRight: '1px solid #e0e0e0' }}>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#ffebee',
                    color: '#c62828',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                  }}
                >
                  ❌ {pair.bad.label}
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '1rem',
                    background: '#fff8f8',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    minHeight: '120px',
                  }}
                >
                  {pair.bad.code}
                </pre>
              </div>

              {/* Good */}
              <div>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#e8f5e9',
                    color: '#2e7d32',
                    fontWeight: 'bold',
                    fontSize: '0.85rem',
                  }}
                >
                  ✅ {pair.good.label}
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '1rem',
                    background: '#f8fff8',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    minHeight: '120px',
                  }}
                >
                  {pair.good.code}
                </pre>
              </div>
            </div>

            {/* Reveal button */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderTop: '1px solid #e0e0e0',
                background: '#fafafa',
              }}
            >
              <button
                onClick={() => toggle(pair.id)}
                style={{
                  padding: '0.4rem 0.9rem',
                  background: isRevealed ? '#e0e0e0' : 'white',
                  border: '1px solid #1976d2',
                  color: '#1976d2',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                }}
              >
                {isRevealed ? 'Скрыть разбор' : 'Показать разбор'}
              </button>
            </div>

            {/* Explanation */}
            {isRevealed && (
              <div
                style={{
                  padding: '1rem',
                  borderTop: '1px solid #e0e0e0',
                  background: '#fffde7',
                }}
              >
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {pair.explanation}
                </p>
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>Проблемы в плохом варианте:</strong>
                  <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem' }}>
                    {pair.problemsInBad.map((p, i) => (
                      <li key={i} style={{ marginBottom: '0.25rem', color: '#b71c1c' }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================
// Задание 0.2: Richardson Maturity Model
// ============================================

interface RmmLevel {
  level: number
  name: string
  color: string
  badge: string
  description: string
  example: {
    scenario: string
    request: string
    response: string
  }
  characteristics: string[]
}

const rmmLevels: RmmLevel[] = [
  {
    level: 0,
    name: 'Болото XML / RPC over HTTP',
    color: '#b71c1c',
    badge: '0',
    description:
      'HTTP используется только как транспорт. Все запросы идут на один endpoint, действие описывается в теле. Принципы REST игнорируются полностью.',
    example: {
      scenario: 'Получить список заказов пользователя',
      request: `POST /api
Content-Type: application/json

{
  "action": "getOrders",
  "userId": 42
}`,
      response: `HTTP/1.1 200 OK

{
  "result": "ok",
  "orders": [...]
}`,
    },
    characteristics: [
      'Один endpoint для всех операций',
      'Метод всегда POST (или даже GET с телом)',
      'Действие описывается в теле запроса',
      'Нет использования HTTP-методов по назначению',
    ],
  },
  {
    level: 1,
    name: 'Ресурсы',
    color: '#e65100',
    badge: '1',
    description:
      'Появляются отдельные URL для разных ресурсов. Но HTTP-методы по-прежнему не используются: всё идёт через POST.',
    example: {
      scenario: 'Получить заказ #5',
      request: `POST /orders
Content-Type: application/json

{
  "action": "get",
  "orderId": 5
}`,
      response: `HTTP/1.1 200 OK

{
  "id": 5,
  "status": "pending",
  "total": 1500
}`,
    },
    characteristics: [
      'Разные URL для разных ресурсов (/orders, /users)',
      'Всё ещё только POST для любых действий',
      'Нет использования HTTP-семантики',
      'Уже лучше Level 0, но половина пути',
    ],
  },
  {
    level: 2,
    name: 'HTTP-глаголы',
    color: '#1565c0',
    badge: '2',
    description:
      'Используются правильные HTTP-методы: GET для чтения, POST для создания, PUT/PATCH для обновления, DELETE для удаления. Правильные статус-коды.',
    example: {
      scenario: 'Получить заказ #5',
      request: `GET /orders/5
Accept: application/json`,
      response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 5,
  "status": "pending",
  "total": 1500
}`,
    },
    characteristics: [
      'GET для чтения (безопасный, кэшируемый)',
      'POST для создания → 201 Created + Location',
      'PUT/PATCH для обновления',
      'DELETE для удаления → 204 No Content',
      'Правильные статус-коды (404, 400, 201...)',
    ],
  },
  {
    level: 3,
    name: 'Гипермедиа (HATEOAS)',
    color: '#1b5e20',
    badge: '3',
    description:
      'Ответы содержат ссылки на связанные ресурсы и доступные действия. Клиент "открывает" API через ответы, не зная URL заранее. Вершина модели Ричардсона.',
    example: {
      scenario: 'Получить заказ #5',
      request: `GET /orders/5
Accept: application/json`,
      response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": 5,
  "status": "pending",
  "total": 1500,
  "_links": {
    "self": { "href": "/orders/5" },
    "cancel": { "href": "/orders/5/cancel", "method": "POST" },
    "payment": { "href": "/orders/5/payment" },
    "customer": { "href": "/users/42" }
  }
}`,
    },
    characteristics: [
      'Ответ содержит ссылки (_links, _embedded)',
      'Клиент узнаёт доступные действия из ответа',
      'Слабое связывание: URL могут меняться',
      'Самодокументируемый API',
      'На практике редко нужен для внутренних API',
    ],
  },
]

interface QuizItem {
  code: string
  answer: number
  hint: string
}

const quizItems: QuizItem[] = [
  {
    code: `POST /do
{ "action": "deleteProduct", "id": 7 }`,
    answer: 0,
    hint: 'Один endpoint + действие в теле + только POST',
  },
  {
    code: `DELETE /products/7
→ 204 No Content`,
    answer: 2,
    hint: 'HTTP-метод по назначению + правильный статус-код',
  },
  {
    code: `POST /products
{ "action": "create", "name": "Laptop" }`,
    answer: 1,
    hint: 'Отдельный resource URL, но действие в теле, не GET',
  },
  {
    code: `GET /products/7

{
  "id": 7,
  "name": "Laptop",
  "_links": {
    "self": { "href": "/products/7" },
    "buy": { "href": "/cart/add", "method": "POST" }
  }
}`,
    answer: 3,
    hint: 'Есть ресурс, правильный метод + гипермедиа ссылки',
  },
]

export function Task0_2_Solution() {
  const [activeLevel, setActiveLevel] = useState<number>(2)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({
    0: null,
    1: null,
    2: null,
    3: null,
  })

  const handleQuizAnswer = (questionIdx: number, levelChoice: number) => {
    setQuizAnswers((prev) => ({ ...prev, [questionIdx]: levelChoice }))
  }

  const correctCount = Object.entries(quizAnswers).filter(
    ([idx, ans]) => ans === quizItems[Number(idx)].answer
  ).length

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Richardson Maturity Model: 4 уровня зрелости REST</h2>

      {/* Level selector */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {rmmLevels.map((lvl) => (
          <button
            key={lvl.level}
            onClick={() => setActiveLevel(lvl.level)}
            style={{
              padding: '0.6rem 1.2rem',
              border: `2px solid ${activeLevel === lvl.level ? lvl.color : '#e0e0e0'}`,
              background: activeLevel === lvl.level ? lvl.color : 'white',
              color: activeLevel === lvl.level ? 'white' : '#333',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              transition: 'all 0.15s',
            }}
          >
            Level {lvl.level}
          </button>
        ))}
      </div>

      {/* Active level details */}
      {rmmLevels.map((lvl) => {
        if (lvl.level !== activeLevel) return null
        return (
          <div
            key={lvl.level}
            style={{
              border: `2px solid ${lvl.color}`,
              borderRadius: '10px',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                padding: '1rem',
                background: lvl.color,
                color: 'white',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                Level {lvl.level}: {lvl.name}
              </h3>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem', opacity: 0.9 }}>
                {lvl.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {/* Example */}
              <div style={{ borderRight: '1px solid #e0e0e0' }}>
                <div
                  style={{
                    padding: '0.5rem 1rem',
                    background: '#f5f5f5',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: '#555',
                  }}
                >
                  Сценарий: {lvl.example.scenario}
                </div>
                <div style={{ padding: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#888',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Запрос
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.75rem',
                        background: '#263238',
                        color: '#e0e0e0',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        overflowX: 'auto',
                      }}
                    >
                      {lvl.example.request}
                    </pre>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#888',
                        marginBottom: '0.25rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      Ответ
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.75rem',
                        background: '#e8f5e9',
                        color: '#1b5e20',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        overflowX: 'auto',
                      }}
                    >
                      {lvl.example.response}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Characteristics */}
              <div style={{ padding: '1rem' }}>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: '#888',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Характеристики
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                  {lvl.characteristics.map((c, i) => (
                    <li
                      key={i}
                      style={{ marginBottom: '0.4rem', fontSize: '0.85rem', lineHeight: 1.5 }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )
      })}

      {/* Quiz */}
      <div
        style={{
          padding: '1rem',
          background: '#f3f4f6',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
        }}
      >
        <h3 style={{ margin: '0 0 0.25rem' }}>
          Проверьте себя: определите уровень RMM
        </h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#666' }}>
          Правильных ответов: {correctCount} из {quizItems.length}
        </p>

        {quizItems.map((item, idx) => {
          const chosen = quizAnswers[idx]
          const isAnswered = chosen !== null
          const isCorrect = chosen === item.answer

          return (
            <div
              key={idx}
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '8px',
                border: `1px solid ${isAnswered ? (isCorrect ? '#4caf50' : '#f44336') : '#e0e0e0'}`,
              }}
            >
              <pre
                style={{
                  margin: '0 0 0.75rem',
                  padding: '0.75rem',
                  background: '#263238',
                  color: '#e0e0e0',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  overflowX: 'auto',
                }}
              >
                {item.code}
              </pre>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                {[0, 1, 2, 3].map((lvl) => {
                  const isChosen = chosen === lvl
                  const isThisCorrect = item.answer === lvl
                  let bg = 'white'
                  let borderColor = '#e0e0e0'
                  let textColor = '#333'
                  if (isAnswered) {
                    if (isThisCorrect) {
                      bg = '#e8f5e9'
                      borderColor = '#4caf50'
                      textColor = '#2e7d32'
                    } else if (isChosen && !isCorrect) {
                      bg = '#ffebee'
                      borderColor = '#f44336'
                      textColor = '#c62828'
                    }
                  } else if (isChosen) {
                    bg = '#e3f2fd'
                    borderColor = '#1976d2'
                    textColor = '#1565c0'
                  }
                  return (
                    <button
                      key={lvl}
                      onClick={() => !isAnswered && handleQuizAnswer(idx, lvl)}
                      disabled={isAnswered}
                      style={{
                        padding: '0.4rem 0.9rem',
                        border: `2px solid ${borderColor}`,
                        background: bg,
                        color: textColor,
                        borderRadius: '6px',
                        cursor: isAnswered ? 'default' : 'pointer',
                        fontWeight: isThisCorrect && isAnswered ? 'bold' : 'normal',
                        fontSize: '0.85rem',
                      }}
                    >
                      Level {lvl}
                    </button>
                  )
                })}
              </div>
              {isAnswered && (
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.82rem',
                    color: isCorrect ? '#2e7d32' : '#c62828',
                  }}
                >
                  {isCorrect ? '✅' : '❌'} {item.hint}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// Задание 0.3: Анализ API (GitHub API)
// ============================================

interface Criterion {
  id: string
  name: string
  weight: number
  description: string
  githubScore: number
  githubComment: string
  goodExample: string
  badExample?: string
}

const criteria: Criterion[] = [
  {
    id: 'consistency',
    name: 'Консистентность',
    weight: 20,
    description: 'Единый стиль URL, именования полей, формата ошибок по всему API.',
    githubScore: 9,
    githubComment:
      'GitHub API образцово консистентен: всегда snake_case, единый формат ошибки {message, errors[]}, предсказуемые паттерны URL.',
    goodExample: `// Всегда snake_case
{ "created_at": "2024-01-01", "full_name": "user/repo" }

// Единый формат ошибки везде
{ "message": "Not Found", "documentation_url": "..." }`,
  },
  {
    id: 'predictability',
    name: 'Предсказуемость',
    weight: 20,
    description: 'Зная одну часть API, разработчик может угадать структуру другой.',
    githubScore: 9,
    githubComment:
      'GET /repos/{owner}/{repo} → GET /repos/{owner}/{repo}/issues → GET /repos/{owner}/{repo}/pulls. Вложенная структура логична и предсказуема.',
    goodExample: `GET /repos/{owner}/{repo}
GET /repos/{owner}/{repo}/issues
GET /repos/{owner}/{repo}/issues/{number}
GET /repos/{owner}/{repo}/issues/{number}/comments`,
  },
  {
    id: 'http_semantics',
    name: 'HTTP-семантика',
    weight: 15,
    description: 'Правильное использование методов и статус-кодов.',
    githubScore: 9,
    githubComment:
      'GET для чтения, POST для создания, PATCH для частичного обновления, DELETE → 204. Статус-коды точные: 201 при создании, 304 при кэше, 422 при валидации.',
    goodExample: `POST /repos/{owner}/{repo}/issues → 201 Created
PATCH /repos/{owner}/{repo}/issues/{number} → 200 OK
DELETE /gists/{gist_id} → 204 No Content
GET /repos/{owner}/{repo} (If-None-Match) → 304 Not Modified`,
  },
  {
    id: 'documentation',
    name: 'Документация',
    weight: 15,
    description: 'Актуальная, полная, с примерами и SDK.',
    githubScore: 10,
    githubComment:
      'docs.github.com — эталон: интерактивные примеры, описание каждого поля, changelog, официальные SDK (Octokit) для JS, Ruby, .NET, Go.',
    goodExample: `// Официальный SDK — Octokit
import { Octokit } from '@octokit/rest'
const octokit = new Octokit({ auth: 'token' })

const { data } = await octokit.issues.listForRepo({
  owner: 'facebook',
  repo: 'react',
  state: 'open',
})`,
  },
  {
    id: 'versioning',
    name: 'Версионирование',
    weight: 10,
    description: 'Стабильность API, возможность вводить изменения без breaking changes.',
    githubScore: 7,
    githubComment:
      'GitHub использует Accept header для версий (application/vnd.github+json). Переход на GraphQL API v4 решил многие проблемы v3. Минус: REST v3 долго не получал новых фич.',
    goodExample: `// Версия через Accept header (best practice)
Accept: application/vnd.github+json
X-GitHub-Api-Version: 2022-11-28`,
    badExample: `// Старый подход: нет явного версионирования
Accept: application/vnd.github.v3+json`,
  },
  {
    id: 'pagination',
    name: 'Пагинация',
    weight: 10,
    description: 'Удобный и консистентный способ итерации по большим коллекциям.',
    githubScore: 7,
    githubComment:
      'Cursor-based пагинация через Link header (RFC 5988) — правильный подход. Но максимум 100 элементов за раз, а без GraphQL нет вложенных запросов.',
    goodExample: `GET /repos/{owner}/{repo}/issues?per_page=30&page=2

// В ответе:
Link: <...?page=3>; rel="next",
      <...?page=10>; rel="last"`,
  },
  {
    id: 'rate_limiting',
    name: 'Rate Limiting',
    weight: 10,
    description: 'Понятные лимиты, информация об остатке, retry-стратегия.',
    githubScore: 8,
    githubComment:
      'Заголовки X-RateLimit-* в каждом ответе, 429 при превышении, документированные лимиты по категориям. Очень прозрачно.',
    goodExample: `// Заголовки ответа
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4987
X-RateLimit-Reset: 1714003200
X-RateLimit-Resource: core`,
  },
]

export function Task0_3_Solution() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const [selfCheckDone, setSelfCheckDone] = useState(false)

  const toggleExpand = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const expandAll = () => setExpanded(new Set(criteria.map((c) => c.id)))

  const totalScore = criteria.reduce((sum, c) => sum + (c.githubScore * c.weight) / 10, 0)
  const maxScore = criteria.reduce((sum, c) => sum + c.weight, 0)
  const scorePercent = Math.round((totalScore / maxScore) * 100)

  const getScoreColor = (score: number) => {
    if (score >= 9) return '#2e7d32'
    if (score >= 7) return '#f57c00'
    return '#c62828'
  }

  return (
    <div className="exercise-container" style={{ padding: '1rem' }}>
      <h2>Анализ API: разбор GitHub REST API</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem' }}>
        Посмотрим на GitHub API глазами API-дизайнера. Оцениваем по 7 критериям, каждый — по
        10-балльной шкале с весом.
      </p>

      {/* Summary card */}
      <div
        style={{
          padding: '1rem 1.5rem',
          background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)',
          color: 'white',
          borderRadius: '10px',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8, marginBottom: '0.25rem' }}>
            Итоговая оценка GitHub REST API
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
            {scorePercent}
            <span style={{ fontSize: '1rem', opacity: 0.7 }}>/100</span>
          </div>
          <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>Weighted score</div>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Критериев', value: criteria.length },
            { label: 'Отлично (9-10)', value: criteria.filter((c) => c.githubScore >= 9).length },
            { label: 'Хорошо (7-8)', value: criteria.filter((c) => c.githubScore >= 7 && c.githubScore < 9).length },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.7 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={expandAll}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem 1rem',
          background: 'white',
          border: '1px solid #1976d2',
          color: '#1976d2',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        Развернуть все критерии
      </button>

      {/* Criteria */}
      {criteria.map((c) => {
        const isExpanded = expanded.has(c.id)
        const scoreColor = getScoreColor(c.githubScore)

        return (
          <div
            key={c.id}
            style={{
              marginBottom: '0.75rem',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                background: '#fafafa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
              onClick={() => toggleExpand(c.id)}
            >
              {/* Score badge */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '8px',
                  background: scoreColor,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  flexShrink: 0,
                }}
              >
                {c.githubScore}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>
                  {c.name}{' '}
                  <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal' }}>
                    (вес {c.weight}%)
                  </span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#666', marginTop: '0.1rem' }}>
                  {c.description}
                </div>
              </div>

              <div style={{ fontSize: '1.2rem', color: '#999', flexShrink: 0 }}>
                {isExpanded ? '▲' : '▼'}
              </div>
            </div>

            {isExpanded && (
              <div style={{ padding: '1rem', borderTop: '1px solid #e0e0e0' }}>
                <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {c.githubComment}
                </p>

                <div style={{ marginBottom: c.badExample ? '0.75rem' : 0 }}>
                  <div
                    style={{
                      fontSize: '0.75rem',
                      color: '#2e7d32',
                      fontWeight: 'bold',
                      marginBottom: '0.25rem',
                    }}
                  >
                    ✅ Пример из GitHub API
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      padding: '0.75rem',
                      background: '#e8f5e9',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      lineHeight: 1.5,
                      overflowX: 'auto',
                    }}
                  >
                    {c.goodExample}
                  </pre>
                </div>

                {c.badExample && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#c62828',
                        fontWeight: 'bold',
                        marginBottom: '0.25rem',
                      }}
                    >
                      ⚠️ Старый/худший вариант
                    </div>
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.75rem',
                        background: '#ffebee',
                        borderRadius: '6px',
                        fontSize: '0.78rem',
                        lineHeight: 1.5,
                        overflowX: 'auto',
                      }}
                    >
                      {c.badExample}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Self-check */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#e3f2fd',
          borderRadius: '10px',
          border: '1px solid #1976d2',
        }}
      >
        <h3 style={{ margin: '0 0 1rem', color: '#1565c0' }}>
          Self-check: проанализируйте API самостоятельно
        </h3>
        <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Выберите любой публичный API (Stripe, Twitter/X, Telegram, OpenWeatherMap) и оцените его
          по тем же 7 критериям. Запишите оценки и комментарии.
        </p>
        <ul style={{ margin: '0 0 1rem', paddingLeft: '1.25rem', fontSize: '0.85rem', lineHeight: 1.8 }}>
          {criteria.map((c) => (
            <li key={c.id}>
              <strong>{c.name}</strong> (вес {c.weight}%): оценка ___/10 — ...
            </li>
          ))}
        </ul>
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#555' }}>
          Итоговая оценка: ___/100 · Что понравилось больше всего? · Что бы вы улучшили?
        </p>
        <button
          onClick={() => setSelfCheckDone(true)}
          style={{
            padding: '0.5rem 1.2rem',
            background: selfCheckDone ? '#4caf50' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          {selfCheckDone ? '✅ Отмечено как выполнено' : 'Отметить как выполнено'}
        </button>
      </div>
    </div>
  )
}
