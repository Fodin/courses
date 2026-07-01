import { useState, useCallback } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================================
// Задание 13.2: FP API-клиент
//
// Цель: построить composable API-клиент через каррирование.
// Запросы — данные (объекты), middleware — чистые функции.
// ============================================================

// --- Types ---

interface ApiRequest {
  method: string
  url: string
  headers: Record<string, string>
  body?: unknown
}

type Left<E> = { tag: 'Left'; value: E }
type Right<A> = { tag: 'Right'; value: A }
type Either<E, A> = Left<E> | Right<A>

function Left<E>(value: E): Left<E> { return { tag: 'Left', value } }
function Right<A>(value: A): Right<A> { return { tag: 'Right', value } }
function isLeft<E, A>(e: Either<E, A>): e is Left<E> { return e.tag === 'Left' }

// ============================================================
// TODO 1: Реализуй каррированный request builder
//
// request(method)(url)(headers)(body) → ApiRequest
//
// Пример:
//   const getUsers = request('GET')('/api/users')({})()
//   // → { method: 'GET', url: '/api/users', headers: {}, body: undefined }
//
// Затем определи ярлыки:
//   const get  = request('GET')
//   const post = request('POST')
// ============================================================

const request = (_method: string) => (_url: string) => (_headers: Record<string, string>) => (_body?: unknown): ApiRequest => {
  // TODO: вернуть объект ApiRequest
  return { method: '', url: '', headers: {} } // заглушка
}

const get = request('GET')
const post = request('POST')

// ============================================================
// TODO 2: Реализуй middleware-функции
//
// withAuth(token)(req)  — добавляет заголовок Authorization: Bearer {token}
// withContentType(req)  — добавляет Content-Type: application/json
//
// Обе функции — pure: возвращают НОВЫЙ объект, не мутируют req.
// Используй spread: { ...req, headers: { ...req.headers, ... } }
// ============================================================

const withAuth = (_token: string) => (_req: ApiRequest): ApiRequest => {
  // TODO
  return _req // заглушка
}

const withContentType = (_req: ApiRequest): ApiRequest => {
  // TODO
  return _req // заглушка
}

// ============================================================
// TODO 3: Реализуй mockSend
//
// mockSend(req, scenario) → Promise<Either<string, unknown>>
//
// Задержка 400ms. Сценарии:
//   'server-error' → Left('500 Internal Server Error')
//   'not-found'    → Left('404 Not Found')
//   'success'      → Right(MOCK_DATA[req.url] ?? { ok: true })
// ============================================================

const MOCK_DATA: Record<string, unknown> = {
  '/api/users/1': { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  '/api/products': [{ id: 1, name: 'Ноутбук', price: 89999 }],
  '/api/orders': { id: 101, status: 'created' },
}

async function mockSend(_req: ApiRequest, _scenario: string): Promise<Either<string, unknown>> {
  // TODO: await new Promise(r => setTimeout(r, 400))
  // затем вернуть Left или Right в зависимости от _scenario
  return Left('не реализовано')
}

// ============================================================
// Компонент задания — завершите TODO выше, UI готов
// ============================================================

type Endpoint = 'user' | 'products' | 'order'
type Scenario = 'success' | 'server-error' | 'not-found'

interface PipelineStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  detail: string
}

export function Task13_2() {
  const { t } = useLanguage()
  const [endpoint, setEndpoint] = useState<Endpoint>('user')
  const [scenario, setScenario] = useState<Scenario>('success')
  const [steps, setSteps] = useState<PipelineStep[]>([])
  const [running, setRunning] = useState(false)

  const updateStep = (arr: PipelineStep[], idx: number, upd: Partial<PipelineStep>): PipelineStep[] => {
    const next = [...arr]
    next[idx] = { ...next[idx], ...upd }
    return next
  }

  const run = useCallback(async () => {
    setRunning(true)
    const token = 'token123'
    const urlMap: Record<Endpoint, string> = {
      user: '/api/users/1',
      products: '/api/products',
      order: '/api/orders',
    }
    const url = urlMap[endpoint]

    const built = endpoint === 'order'
      ? withContentType(withAuth(token)(post(url)({})({})))
      : withAuth(token)(get(url)({})(undefined))

    const initial: PipelineStep[] = [
      { name: '1. Build request', status: 'pending', detail: '' },
      { name: '2. Send', status: 'pending', detail: '' },
      { name: '3. Parse result', status: 'pending', detail: '' },
    ]
    setSteps(initial)

    let cur = updateStep(initial, 0, { status: 'running', detail: '' })
    setSteps([...cur])
    await new Promise(r => setTimeout(r, 300))
    cur = updateStep(cur, 0, {
      status: 'success',
      detail: `${built.method} ${built.url}\n${JSON.stringify(built.headers, null, 2)}`,
    })
    setSteps([...cur])

    cur = updateStep(cur, 1, { status: 'running', detail: 'Отправка...' })
    setSteps([...cur])
    const result = await mockSend(built, scenario)
    if (isLeft(result)) {
      cur = updateStep(cur, 1, { status: 'error', detail: result.value })
      setSteps([...cur])
      setRunning(false)
      return
    }
    cur = updateStep(cur, 1, { status: 'success', detail: '200 OK' })
    setSteps([...cur])

    cur = updateStep(cur, 2, { status: 'running', detail: '' })
    setSteps([...cur])
    await new Promise(r => setTimeout(r, 200))
    cur = updateStep(cur, 2, { status: 'success', detail: JSON.stringify(result.value, null, 2) })
    setSteps([...cur])
    setRunning(false)
  }, [endpoint, scenario])

  const stepColor = (s: string) =>
    s === 'success' ? '#22c55e' : s === 'error' ? '#ef4444' : s === 'running' ? '#f59e0b' : '#374151'

  const selectStyle: React.CSSProperties = {
    background: '#0f172a', border: '1px solid #374151', color: '#e5e7eb',
    borderRadius: '4px', padding: '0.35rem 0.6rem',
    fontFamily: 'monospace', fontSize: '0.82rem',
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.13.2')}</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '0.25rem' }}>Endpoint</div>
          <select value={endpoint} onChange={e => setEndpoint(e.target.value as Endpoint)} style={selectStyle}>
            <option value="user">GET /api/users/1</option>
            <option value="products">GET /api/products</option>
            <option value="order">POST /api/orders</option>
          </select>
        </div>
        <div>
          <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '0.25rem' }}>Сценарий</div>
          <select value={scenario} onChange={e => setScenario(e.target.value as Scenario)} style={selectStyle}>
            <option value="success">Успешный</option>
            <option value="server-error">Ошибка сервера</option>
            <option value="not-found">404 Not Found</option>
          </select>
        </div>
        <button
          onClick={run} disabled={running}
          style={{
            background: running ? '#374151' : '#14532d',
            color: running ? '#9ca3af' : '#86efac',
            border: `1px solid ${running ? '#4b5563' : '#22c55e'}`,
            borderRadius: '6px', padding: '0.35rem 0.9rem',
            cursor: running ? 'not-allowed' : 'pointer',
            fontSize: '0.82rem', fontFamily: 'monospace',
          }}
        >
          {running ? 'Выполняется...' : 'Отправить'}
        </button>
      </div>

      {steps.length > 0 && (
        <div style={{ background: '#1f2937', borderRadius: '8px', padding: '1rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{
                width: '10px', height: '10px', borderRadius: '50%',
                background: stepColor(step.status), marginTop: '4px', flexShrink: 0,
              }} />
              <div style={{ flex: 1, padding: '0.4rem 0.7rem', borderRadius: '6px', background: '#0f172a', border: `1px solid ${stepColor(step.status)}40` }}>
                <div style={{ color: stepColor(step.status), fontWeight: 600, fontSize: '0.82rem' }}>{step.name}</div>
                {step.detail && (
                  <pre style={{ color: '#9ca3af', fontSize: '0.75rem', margin: '0.3rem 0 0', whiteSpace: 'pre-wrap' }}>
                    {step.detail}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ color: '#6b7280', fontSize: '0.82rem', marginTop: '1rem' }}>
        Ожидается: request(method)(url)(headers)(body) — каррированная сборка.
        withAuth/withContentType — pure middleware без мутаций.
      </p>
    </div>
  )
}
