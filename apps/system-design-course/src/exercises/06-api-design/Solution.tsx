import { useState, useRef } from 'react'

// ============================================
// Задание 6.1: Справочная карточка (API Design)
// ============================================

export function Task6_1_Solution() {
  const [activeTab, setActiveTab] = useState<'rest' | 'graphql' | 'grpc'>('rest')

  const tabStyle = (tab: string) => ({
    padding: '0.5rem 1rem',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #1565c0' : '3px solid transparent',
    background: 'transparent',
    cursor: 'pointer' as const,
    fontWeight: activeTab === tab ? 'bold' as const : 'normal' as const,
    fontSize: '0.95rem',
    color: activeTab === tab ? '#1565c0' : '#555',
  })

  return (
    <div style={{ padding: '1rem', maxWidth: '850px' }}>
      <h2>REST vs GraphQL vs gRPC — сравнение</h2>

      {/* Comparison table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'left' }}>Характеристика</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center', background: '#e3f2fd' }}>REST</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center', background: '#f3e5f5' }}>GraphQL</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center', background: '#e8f5e9' }}>gRPC</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Формат данных', 'JSON (текст)', 'JSON (текст)', 'Protobuf (бинарный)'],
            ['Протокол', 'HTTP/1.1', 'HTTP/1.1', 'HTTP/2'],
            ['Контракт', 'OpenAPI / Swagger', 'Schema (SDL)', '.proto файл'],
            ['Типизация', 'Слабая', 'Строгая (schema)', 'Строгая (protobuf)'],
            ['Overfetching', 'Частая проблема', 'Нет (клиент выбирает)', 'Нет (фиксированный msg)'],
            ['Streaming', 'SSE / WebSocket', 'Subscriptions', 'Встроенный (4 типа)'],
            ['Browser', 'Нативная поддержка', 'Нативная поддержка', 'Нужен gRPC-Web'],
            ['Кривая обучения', 'Низкая', 'Средняя', 'Высокая'],
          ].map(([label, rest, graphql, grpc], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>{label}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{rest}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{graphql}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{grpc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <button style={tabStyle('rest')} onClick={() => setActiveTab('rest')}>REST</button>
        <button style={tabStyle('graphql')} onClick={() => setActiveTab('graphql')}>GraphQL</button>
        <button style={tabStyle('grpc')} onClick={() => setActiveTab('grpc')}>gRPC</button>
      </div>

      {activeTab === 'rest' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#1565c0' }}>Когда использовать</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>Публичные API для внешних разработчиков</li>
              <li>Простые CRUD-операции</li>
              <li>Когда важна простота и universality</li>
              <li>Микросервисы с простой моделью данных</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#1565c0' }}>Пример</h4>
            <pre style={{ margin: 0, fontSize: '0.8rem', background: '#fff', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`GET /api/v1/users/42
Authorization: Bearer <token>

200 OK
{
  "id": 42,
  "name": "Ivan",
  "email": "ivan@example.com"
}`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'graphql' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#7b1fa2' }}>Когда использовать</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>Разные клиенты (mobile, web, admin)</li>
              <li>Сложные связи между данными</li>
              <li>Один экран = данные из 5+ источников</li>
              <li>Быстрая итерация без версионирования</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#7b1fa2' }}>Пример</h4>
            <pre style={{ margin: 0, fontSize: '0.8rem', background: '#fff', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`POST /graphql
{
  user(id: "42") {
    name
    posts(limit: 5) {
      title
      comments { text }
    }
  }
}`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'grpc' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#2e7d32' }}>Когда использовать</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem' }}>
              <li>Межсервисная коммуникация (low-latency)</li>
              <li>Streaming данных (server/client/bidirectional)</li>
              <li>Строгий контракт между командами</li>
              <li>Полиглотные системы (Go, Java, Python)</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#2e7d32' }}>Пример (.proto)</h4>
            <pre style={{ margin: 0, fontSize: '0.8rem', background: '#fff', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`service UserService {
  rpc GetUser(GetUserReq)
    returns (User);
  rpc ListUsers(ListReq)
    returns (stream User);
}

message User {
  string id = 1;
  string name = 2;
}`}
            </pre>
          </div>
        </div>
      )}

      {/* Key recommendations */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Комбинированный подход (реальный мир)</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          <strong>Public API:</strong> REST (простота, документация, кэширование).{' '}
          <strong>Mobile/Web BFF:</strong> GraphQL (гибкость запросов).{' '}
          <strong>Микросервисы:</strong> gRPC (скорость, streaming, строгий контракт).
        </p>
      </div>
    </div>
  )
}

// ============================================
// Задание 6.2: Rate Limiter симулятор
// ============================================

type RateLimitAlgorithm = 'token-bucket' | 'fixed-window' | 'sliding-window'

interface RequestLog {
  id: number
  time: string
  allowed: boolean
  algorithm: string
  detail: string
}

export function Task6_2_Solution() {
  const [algorithm, setAlgorithm] = useState<RateLimitAlgorithm>('token-bucket')
  const [rate, setRate] = useState(5)
  const [burst, setBurst] = useState(10)
  const [windowSec, setWindowSec] = useState(5)

  // Token Bucket state
  const [tokens, setTokens] = useState(10)
  const lastRefillRef = useRef(Date.now())

  // Fixed Window state
  const [fwCount, setFwCount] = useState(0)
  const fwStartRef = useRef(Date.now())

  // Sliding Window state
  const swRequestsRef = useRef<number[]>([])

  // Counters
  const [totalRequests, setTotalRequests] = useState(0)
  const [allowedCount, setAllowedCount] = useState(0)
  const [rejectedCount, setRejectedCount] = useState(0)
  const [logs, setLogs] = useState<RequestLog[]>([])
  const logIdRef = useRef(0)

  const addLog = (allowed: boolean, detail: string) => {
    const id = ++logIdRef.current
    const time = new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 2,
    } as Intl.DateTimeFormatOptions)
    setLogs(prev => [{ id, time, allowed, algorithm, detail }, ...prev].slice(0, 20))
  }

  const tryTokenBucket = (): boolean => {
    const now = Date.now()
    const elapsed = (now - lastRefillRef.current) / 1000
    const newTokens = Math.min(burst, tokens + elapsed * rate)
    lastRefillRef.current = now

    if (newTokens >= 1) {
      const afterUse = newTokens - 1
      setTokens(afterUse)
      addLog(true, `Tokens: ${afterUse.toFixed(1)}/${burst}`)
      return true
    }
    setTokens(newTokens)
    addLog(false, `No tokens (${newTokens.toFixed(1)}/${burst})`)
    return false
  }

  const tryFixedWindow = (): boolean => {
    const now = Date.now()
    const maxInWindow = rate * windowSec

    if (now - fwStartRef.current >= windowSec * 1000) {
      fwStartRef.current = now
      setFwCount(1)
      addLog(true, `New window. Count: 1/${maxInWindow}`)
      return true
    }

    if (fwCount < maxInWindow) {
      const newCount = fwCount + 1
      setFwCount(newCount)
      addLog(true, `Count: ${newCount}/${maxInWindow}`)
      return true
    }

    addLog(false, `Window full (${fwCount}/${maxInWindow})`)
    return false
  }

  const trySlidingWindow = (): boolean => {
    const now = Date.now()
    const windowMs = windowSec * 1000
    const maxInWindow = rate * windowSec

    swRequestsRef.current = swRequestsRef.current.filter(t => now - t < windowMs)

    if (swRequestsRef.current.length < maxInWindow) {
      swRequestsRef.current.push(now)
      addLog(true, `Count: ${swRequestsRef.current.length}/${maxInWindow} in window`)
      return true
    }

    addLog(false, `Window full (${swRequestsRef.current.length}/${maxInWindow})`)
    return false
  }

  const sendRequest = () => {
    setTotalRequests(prev => prev + 1)
    let allowed = false

    if (algorithm === 'token-bucket') allowed = tryTokenBucket()
    else if (algorithm === 'fixed-window') allowed = tryFixedWindow()
    else allowed = trySlidingWindow()

    if (allowed) setAllowedCount(prev => prev + 1)
    else setRejectedCount(prev => prev + 1)
  }

  const sendBurst = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => sendRequest(), i * 30)
    }
  }

  const reset = () => {
    setTokens(burst)
    lastRefillRef.current = Date.now()
    setFwCount(0)
    fwStartRef.current = Date.now()
    swRequestsRef.current = []
    setTotalRequests(0)
    setAllowedCount(0)
    setRejectedCount(0)
    setLogs([])
    logIdRef.current = 0
  }

  const algoDescriptions: Record<RateLimitAlgorithm, string> = {
    'token-bucket': `Tokens: ${tokens.toFixed(1)} / ${burst}. Rate: ${rate} tokens/sec.`,
    'fixed-window': `Count: ${fwCount} / ${rate * windowSec}. Window: ${windowSec}s.`,
    'sliding-window': `Count: ${swRequestsRef.current.filter(t => Date.now() - t < windowSec * 1000).length} / ${rate * windowSec}. Window: ${windowSec}s.`,
  }

  const getStatePercent = (): number => {
    if (algorithm === 'token-bucket') return (tokens / burst) * 100
    if (algorithm === 'fixed-window') return (1 - fwCount / (rate * windowSec)) * 100
    const active = swRequestsRef.current.filter(t => Date.now() - t < windowSec * 1000).length
    return (1 - active / (rate * windowSec)) * 100
  }

  const statePercent = Math.max(0, Math.min(100, getStatePercent()))

  const btnStyle = (active: boolean) => ({
    padding: '0.3rem 0.7rem',
    margin: '0 0.2rem',
    border: active ? '2px solid #1565c0' : '1px solid #ccc',
    borderRadius: '4px',
    background: active ? '#e3f2fd' : '#fff',
    cursor: 'pointer' as const,
    fontWeight: active ? 'bold' as const : 'normal' as const,
    fontSize: '0.85rem',
  })

  const algoBtnStyle = (algo: RateLimitAlgorithm) => ({
    padding: '0.5rem 1rem',
    margin: '0 0.3rem',
    border: algorithm === algo ? '2px solid #1565c0' : '1px solid #ccc',
    borderRadius: '6px',
    background: algorithm === algo ? '#1565c0' : '#fff',
    color: algorithm === algo ? '#fff' : '#333',
    cursor: 'pointer' as const,
    fontWeight: 'bold' as const,
    fontSize: '0.85rem',
  })

  return (
    <div style={{ padding: '1rem', maxWidth: '800px' }}>
      <h2>Rate Limiter Simulator</h2>

      {/* Algorithm selection */}
      <div style={{ marginBottom: '1rem' }}>
        <strong>Algorithm:</strong>
        <div style={{ marginTop: '0.3rem' }}>
          <button style={algoBtnStyle('token-bucket')} onClick={() => { setAlgorithm('token-bucket'); reset() }}>Token Bucket</button>
          <button style={algoBtnStyle('fixed-window')} onClick={() => { setAlgorithm('fixed-window'); reset() }}>Fixed Window</button>
          <button style={algoBtnStyle('sliding-window')} onClick={() => { setAlgorithm('sliding-window'); reset() }}>Sliding Window</button>
        </div>
      </div>

      {/* Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <strong>Rate (req/sec):</strong>
          <div style={{ marginTop: '0.3rem' }}>
            {[1, 2, 5, 10].map(r => (
              <button key={r} style={btnStyle(rate === r)} onClick={() => { setRate(r); reset() }}>{r}</button>
            ))}
          </div>
        </div>
        {algorithm === 'token-bucket' && (
          <div>
            <strong>Burst (max tokens):</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[5, 10, 20, 50].map(b => (
                <button key={b} style={btnStyle(burst === b)} onClick={() => { setBurst(b); reset() }}>{b}</button>
              ))}
            </div>
          </div>
        )}
        {algorithm !== 'token-bucket' && (
          <div>
            <strong>Window (sec):</strong>
            <div style={{ marginTop: '0.3rem' }}>
              {[2, 5, 10, 30].map(w => (
                <button key={w} style={btnStyle(windowSec === w)} onClick={() => { setWindowSec(w); reset() }}>{w}</button>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button
            onClick={sendRequest}
            style={{
              padding: '0.5rem 1.2rem',
              background: '#2e7d32',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Send Request
          </button>
          <button
            onClick={sendBurst}
            style={{
              padding: '0.5rem 1.2rem',
              background: '#e65100',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
            }}
          >
            Burst 10
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.2rem',
              background: '#757575',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* State visualization */}
      <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>{algorithm === 'token-bucket' ? 'Available Tokens' : 'Remaining Capacity'}</strong>
          <span style={{ fontSize: '0.85rem', color: '#555' }}>{algoDescriptions[algorithm]}</span>
        </div>
        <div style={{ width: '100%', height: '30px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${statePercent}%`,
              height: '100%',
              background: statePercent > 50 ? '#2e7d32' : statePercent > 20 ? '#e65100' : '#c62828',
              transition: 'width 0.2s, background 0.2s',
              borderRadius: '4px',
            }}
          />
        </div>
      </div>

      {/* Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ padding: '0.8rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1565c0' }}>{totalRequests}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Total</div>
        </div>
        <div style={{ padding: '0.8rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>{allowedCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Allowed</div>
        </div>
        <div style={{ padding: '0.8rem', background: '#fce4ec', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#c62828' }}>{rejectedCount}</div>
          <div style={{ fontSize: '0.8rem', color: '#555' }}>Rejected (429)</div>
        </div>
      </div>

      {/* Request log */}
      <div style={{ padding: '0.8rem', background: '#263238', borderRadius: '8px', maxHeight: '280px', overflowY: 'auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {logs.length === 0 ? (
            <div style={{ color: '#78909c' }}>Click &quot;Send Request&quot; or &quot;Burst 10&quot; to start...</div>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{ color: log.allowed ? '#66bb6a' : '#ef5350', marginBottom: '0.2rem' }}>
                <span style={{ color: '#78909c' }}>[{log.time}]</span>{' '}
                <span style={{ fontWeight: 'bold' }}>{log.allowed ? '200 OK' : '429 REJECTED'}</span>{' '}
                {log.detail}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Algorithm description */}
      <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff8e1', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #ffe082' }}>
        {algorithm === 'token-bucket' && (
          <p style={{ margin: 0 }}>
            <strong>Token Bucket:</strong> Токены добавляются с постоянной скоростью (rate). Каждый запрос забирает 1 токен.
            Максимум токенов = burst. Позволяет контролируемые всплески: если копить токены — можно отправить burst запросов разом.
          </p>
        )}
        {algorithm === 'fixed-window' && (
          <p style={{ margin: 0 }}>
            <strong>Fixed Window:</strong> Фиксированные интервалы (window). Счётчик сбрасывается в начале каждого окна.
            Проблема: на границе двух окон можно отправить 2x лимита (100 в конце окна 1 + 100 в начале окна 2).
          </p>
        )}
        {algorithm === 'sliding-window' && (
          <p style={{ margin: 0 }}>
            <strong>Sliding Window:</strong> Считает запросы в скользящем окне длиной window секунд. Точнее Fixed Window — нет проблемы
            с границей окон. Но требует O(N) памяти (хранит timestamp каждого запроса).
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Проектирование REST API
// ============================================

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  description: string
  auth: boolean
  pagination: 'cursor' | 'offset' | 'none'
  status: string
}

interface Resource {
  name: string
  color: string
  endpoints: Endpoint[]
}

const API_RESOURCES: Resource[] = [
  {
    name: 'Users',
    color: '#1565c0',
    endpoints: [
      { method: 'GET', path: '/api/v1/users', description: 'Список пользователей (с поиском по name)', auth: false, pagination: 'cursor', status: '200' },
      { method: 'GET', path: '/api/v1/users/:id', description: 'Профиль пользователя', auth: false, pagination: 'none', status: '200' },
      { method: 'POST', path: '/api/v1/users', description: 'Регистрация нового пользователя', auth: false, pagination: 'none', status: '201' },
      { method: 'PATCH', path: '/api/v1/users/:id', description: 'Обновление профиля (частичное)', auth: true, pagination: 'none', status: '200' },
      { method: 'DELETE', path: '/api/v1/users/:id', description: 'Удаление аккаунта', auth: true, pagination: 'none', status: '204' },
      { method: 'GET', path: '/api/v1/users/:id/posts', description: 'Посты пользователя', auth: false, pagination: 'cursor', status: '200' },
    ],
  },
  {
    name: 'Posts',
    color: '#2e7d32',
    endpoints: [
      { method: 'GET', path: '/api/v1/posts', description: 'Лента постов (?tag=X&author=Y&sort=date)', auth: false, pagination: 'cursor', status: '200' },
      { method: 'GET', path: '/api/v1/posts/:id', description: 'Один пост с метаданными', auth: false, pagination: 'none', status: '200' },
      { method: 'POST', path: '/api/v1/posts', description: 'Создание поста', auth: true, pagination: 'none', status: '201' },
      { method: 'PATCH', path: '/api/v1/posts/:id', description: 'Обновление поста (title, content, tags)', auth: true, pagination: 'none', status: '200' },
      { method: 'DELETE', path: '/api/v1/posts/:id', description: 'Удаление поста', auth: true, pagination: 'none', status: '204' },
      { method: 'GET', path: '/api/v1/posts/:id/comments', description: 'Комментарии к посту', auth: false, pagination: 'cursor', status: '200' },
    ],
  },
  {
    name: 'Comments',
    color: '#e65100',
    endpoints: [
      { method: 'GET', path: '/api/v1/comments', description: 'Все комментарии (?post_id=X&author_id=Y)', auth: false, pagination: 'cursor', status: '200' },
      { method: 'GET', path: '/api/v1/comments/:id', description: 'Один комментарий', auth: false, pagination: 'none', status: '200' },
      { method: 'POST', path: '/api/v1/posts/:id/comments', description: 'Добавление комментария к посту', auth: true, pagination: 'none', status: '201' },
      { method: 'PATCH', path: '/api/v1/comments/:id', description: 'Редактирование комментария', auth: true, pagination: 'none', status: '200' },
      { method: 'DELETE', path: '/api/v1/comments/:id', description: 'Удаление комментария', auth: true, pagination: 'none', status: '204' },
    ],
  },
  {
    name: 'Tags',
    color: '#6a1b9a',
    endpoints: [
      { method: 'GET', path: '/api/v1/tags', description: 'Все теги (с количеством постов)', auth: false, pagination: 'offset', status: '200' },
      { method: 'GET', path: '/api/v1/tags/:slug', description: 'Тег по slug с популярными постами', auth: false, pagination: 'none', status: '200' },
      { method: 'POST', path: '/api/v1/tags', description: 'Создание тега (admin)', auth: true, pagination: 'none', status: '201' },
      { method: 'PATCH', path: '/api/v1/tags/:slug', description: 'Обновление тега', auth: true, pagination: 'none', status: '200' },
      { method: 'DELETE', path: '/api/v1/tags/:slug', description: 'Удаление тега', auth: true, pagination: 'none', status: '204' },
    ],
  },
]

const methodColors: Record<string, string> = {
  GET: '#2e7d32',
  POST: '#1565c0',
  PATCH: '#e65100',
  DELETE: '#c62828',
}

export function Task6_3_Solution() {
  const [selectedResource, setSelectedResource] = useState(0)
  const [showAll, setShowAll] = useState(false)

  const resource = API_RESOURCES[selectedResource]

  const renderEndpointRow = (ep: Endpoint, i: number) => (
    <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
        <span style={{
          padding: '0.15rem 0.5rem',
          background: methodColors[ep.method],
          color: '#fff',
          borderRadius: '3px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          fontFamily: 'monospace',
        }}>
          {ep.method}
        </span>
      </td>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd' }}>
        <code style={{ fontSize: '0.8rem' }}>{ep.path}</code>
      </td>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontSize: '0.85rem' }}>{ep.description}</td>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>
        {ep.auth ? (
          <span style={{ padding: '0.1rem 0.4rem', background: '#fff3e0', borderRadius: '3px', fontSize: '0.75rem' }}>Auth</span>
        ) : (
          <span style={{ padding: '0.1rem 0.4rem', background: '#e8f5e9', borderRadius: '3px', fontSize: '0.75rem' }}>Public</span>
        )}
      </td>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', fontSize: '0.8rem' }}>
        {ep.pagination !== 'none' && (
          <span style={{
            padding: '0.1rem 0.4rem',
            background: ep.pagination === 'cursor' ? '#e3f2fd' : '#f3e5f5',
            borderRadius: '3px',
            fontSize: '0.75rem',
          }}>
            {ep.pagination}
          </span>
        )}
      </td>
      <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>
        <code style={{ fontSize: '0.8rem' }}>{ep.status}</code>
      </td>
    </tr>
  )

  return (
    <div style={{ padding: '1rem', maxWidth: '900px' }}>
      <h2>REST API Design: Blog Platform</h2>

      {/* Resource tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {API_RESOURCES.map((r, i) => (
          <button
            key={r.name}
            onClick={() => { setSelectedResource(i); setShowAll(false) }}
            style={{
              padding: '0.5rem 1rem',
              border: selectedResource === i && !showAll ? `2px solid ${r.color}` : '1px solid #ddd',
              borderRadius: '6px',
              background: selectedResource === i && !showAll ? r.color : '#fff',
              color: selectedResource === i && !showAll ? '#fff' : '#333',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.85rem',
            }}
          >
            {r.name} ({r.endpoints.length})
          </button>
        ))}
        <button
          onClick={() => setShowAll(true)}
          style={{
            padding: '0.5rem 1rem',
            border: showAll ? '2px solid #333' : '1px solid #ddd',
            borderRadius: '6px',
            background: showAll ? '#333' : '#fff',
            color: showAll ? '#fff' : '#333',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.85rem',
          }}
        >
          All ({API_RESOURCES.reduce((s, r) => s + r.endpoints.length, 0)})
        </button>
      </div>

      {/* Endpoints table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left', width: '70px' }}>Method</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Path</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'left' }}>Description</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', width: '60px' }}>Auth</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', width: '80px' }}>Pagination</th>
              <th style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', width: '60px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {showAll
              ? API_RESOURCES.flatMap((r, ri) =>
                  r.endpoints.map((ep, ei) => renderEndpointRow(ep, ri * 100 + ei))
                )
              : resource.endpoints.map((ep, i) => renderEndpointRow(ep, i))
            }
          </tbody>
        </table>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
        {['GET', 'POST', 'PATCH', 'DELETE'].map(method => {
          const endpoints = showAll
            ? API_RESOURCES.flatMap(r => r.endpoints)
            : resource.endpoints
          const count = endpoints.filter(e => e.method === method).length
          return (
            <div key={method} style={{
              padding: '0.5rem',
              background: '#f5f5f5',
              borderRadius: '6px',
              textAlign: 'center',
              borderLeft: `4px solid ${methodColors[method]}`,
            }}>
              <div style={{ fontWeight: 'bold', color: methodColors[method], fontSize: '1.2rem' }}>{count}</div>
              <div style={{ fontSize: '0.8rem' }}>{method}</div>
            </div>
          )
        })}
      </div>

      {/* Design principles */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#2e7d32' }}>Принципы дизайна</h4>
        <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem' }}>
          <li><strong>Существительные в URL</strong> — /posts, не /getPosts</li>
          <li><strong>Cursor-пагинация</strong> — для лент (posts, comments). Offset — для справочников (tags)</li>
          <li><strong>Версионирование</strong> — /api/v1/ в URL path</li>
          <li><strong>Auth на мутациях</strong> — GET public, POST/PATCH/DELETE требуют токен</li>
          <li><strong>Вложенные ресурсы</strong> — /posts/:id/comments (создание привязано к посту)</li>
          <li><strong>Правильные статус-коды</strong> — 201 (created), 204 (deleted), 200 (ok)</li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// Задание 6.4: API Gateway и BFF
// ============================================

type ClientType = 'mobile' | 'web' | 'admin'

interface BFFConfig {
  name: string
  color: string
  icon: string
  description: string
  rateLimit: string
  services: string[]
  exampleEndpoint: string
  exampleResponse: string
  optimizations: string[]
}

const BFF_CONFIGS: Record<ClientType, BFFConfig> = {
  mobile: {
    name: 'BFF Mobile',
    color: '#1565c0',
    icon: 'M',
    description: 'Компактные данные, оптимизация под мобильную сеть. Минимум полей, маленькие картинки, агрегация нескольких API-вызовов в один.',
    rateLimit: '100 req/min',
    services: ['User Service', 'Product Service', 'Order Service'],
    exampleEndpoint: 'GET /mobile/feed',
    exampleResponse: `{
  "user": { "name": "Ivan", "avatar_sm": "url" },
  "products": [
    { "id": 1, "title": "...", "price": 990, "thumb": "64x64" }
  ],
  "cart_count": 3
}`,
    optimizations: [
      'Маленькие картинки (thumbnail 64x64)',
      'Минимум полей (id, title, price)',
      'Один запрос вместо 3 (user + products + cart)',
      'Кэширование на 60 секунд (мобильная сеть)',
    ],
  },
  web: {
    name: 'BFF Web',
    color: '#2e7d32',
    icon: 'W',
    description: 'Полные данные для rich UI. Несколько параллельных вызовов к микросервисам, агрегация в один ответ.',
    rateLimit: '200 req/min',
    services: ['User Service', 'Product Service', 'Order Service', 'Notification Service'],
    exampleEndpoint: 'GET /web/dashboard',
    exampleResponse: `{
  "user": { "name": "Ivan", "email": "...", "avatar": "url", "stats": {...} },
  "products": [
    { "id": 1, "title": "...", "price": 990, "images": [...], "reviews": 42 }
  ],
  "orders": [{ "id": 1, "status": "shipped", "tracking": "..." }],
  "notifications": [{ "type": "promo", "text": "..." }]
}`,
    optimizations: [
      'Полные данные с картинками и отзывами',
      'Параллельные вызовы (Promise.all)',
      'Notifications и orders в одном запросе',
      'SSE для real-time обновлений',
    ],
  },
  admin: {
    name: 'BFF Admin',
    color: '#6a1b9a',
    icon: 'A',
    description: 'Все данные + метрики, отчёты, batch-операции. Доступ к Analytics Service и внутренним операциям.',
    rateLimit: '50 req/min',
    services: ['User Service', 'Product Service', 'Order Service', 'Payment Service', 'Analytics Service'],
    exampleEndpoint: 'GET /admin/overview',
    exampleResponse: `{
  "metrics": { "dau": 15420, "revenue_today": 2340000, "orders_today": 567 },
  "top_products": [{ "id": 1, "title": "...", "sales": 234, "revenue": 231660 }],
  "recent_orders": [{ "id": 1, "user": "...", "total": 5990, "status": "..." }],
  "alerts": [{ "type": "payment_failures", "count": 12, "severity": "warning" }]
}`,
    optimizations: [
      'Доступ ко ВСЕМ 5 микросервисам',
      'Метрики и аналитика в реальном времени',
      'Batch-операции (массовое обновление цен)',
      'Расширенные фильтры и экспорт данных',
    ],
  },
}

const MICROSERVICES = [
  { name: 'User Service', color: '#1565c0', description: 'Профили, авторизация, роли' },
  { name: 'Product Service', color: '#2e7d32', description: 'Каталог, поиск, категории' },
  { name: 'Order Service', color: '#e65100', description: 'Заказы, корзина, статусы' },
  { name: 'Payment Service', color: '#c62828', description: 'Платежи, возвраты, баланс' },
  { name: 'Analytics Service', color: '#6a1b9a', description: 'Метрики, отчёты, DAU' },
]

export function Task6_4_Solution() {
  const [selectedClient, setSelectedClient] = useState<ClientType>('mobile')

  const bff = BFF_CONFIGS[selectedClient]

  const clientBtnStyle = (client: ClientType) => ({
    padding: '0.8rem 1.2rem',
    border: selectedClient === client ? `2px solid ${BFF_CONFIGS[client].color}` : '1px solid #ddd',
    borderRadius: '8px',
    background: selectedClient === client ? BFF_CONFIGS[client].color : '#fff',
    color: selectedClient === client ? '#fff' : '#333',
    cursor: 'pointer' as const,
    fontWeight: 'bold' as const,
    fontSize: '0.9rem',
    minWidth: '140px',
    textAlign: 'center' as const,
  })

  return (
    <div style={{ padding: '1rem', maxWidth: '900px' }}>
      <h2>API Gateway + BFF Architecture</h2>

      {/* Client selection */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        <button style={clientBtnStyle('mobile')} onClick={() => setSelectedClient('mobile')}>
          Mobile App
        </button>
        <button style={clientBtnStyle('web')} onClick={() => setSelectedClient('web')}>
          Web App
        </button>
        <button style={clientBtnStyle('admin')} onClick={() => setSelectedClient('admin')}>
          Admin Panel
        </button>
      </div>

      {/* Architecture diagram */}
      <div style={{ padding: '1.5rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1.5rem' }}>
        {/* Client */}
        <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: bff.color,
            color: '#fff',
            borderRadius: '8px',
            fontWeight: 'bold',
          }}>
            {bff.icon === 'M' ? 'Mobile App' : bff.icon === 'W' ? 'Web App' : 'Admin Panel'}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#999', margin: '0.3rem 0' }}>|</div>

        {/* BFF */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.6rem 1.5rem',
            background: '#fff',
            border: `2px solid ${bff.color}`,
            borderRadius: '8px',
            fontWeight: 'bold',
            color: bff.color,
          }}>
            {bff.name}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '0.2rem' }}>
            Rate limit: {bff.rateLimit}
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#999', margin: '0.3rem 0' }}>|</div>

        {/* API Gateway */}
        <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.6rem 2rem',
            background: '#fff3e0',
            border: '2px solid #e65100',
            borderRadius: '8px',
            fontWeight: 'bold',
            color: '#e65100',
          }}>
            API Gateway (Auth, Rate Limit, Logging, Routing)
          </div>
        </div>

        <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#999', margin: '0.3rem 0' }}>|</div>

        {/* Microservices */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {MICROSERVICES.map(svc => {
            const isUsed = bff.services.includes(svc.name)
            return (
              <div
                key={svc.name}
                style={{
                  padding: '0.5rem 0.8rem',
                  background: isUsed ? svc.color : '#e0e0e0',
                  color: isUsed ? '#fff' : '#999',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  opacity: isUsed ? 1 : 0.4,
                  transition: 'all 0.3s',
                }}
              >
                {svc.name}
              </div>
            )
          })}
        </div>
      </div>

      {/* BFF Details */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: bff.color }}>{bff.name}</h4>
          <p style={{ margin: '0 0 0.8rem', fontSize: '0.85rem' }}>{bff.description}</p>

          <div style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            Оптимизации
          </div>
          <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem' }}>
            {bff.optimizations.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>

        <div style={{ padding: '1rem', background: '#263238', borderRadius: '8px' }}>
          <div style={{ color: '#78909c', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
            {bff.exampleEndpoint}
          </div>
          <pre style={{
            color: '#e0e0e0',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
            margin: 0,
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
          }}>
            {bff.exampleResponse}
          </pre>
        </div>
      </div>

      {/* Services used */}
      <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem' }}>Микросервисы, используемые {bff.name}</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {MICROSERVICES.map(svc => {
            const isUsed = bff.services.includes(svc.name)
            return (
              <div
                key={svc.name}
                style={{
                  padding: '0.5rem 0.8rem',
                  background: isUsed ? '#fff' : '#f5f5f5',
                  border: isUsed ? `2px solid ${svc.color}` : '1px solid #ddd',
                  borderRadius: '6px',
                  opacity: isUsed ? 1 : 0.4,
                }}
              >
                <div style={{
                  fontWeight: 'bold',
                  fontSize: '0.85rem',
                  color: isUsed ? svc.color : '#999',
                }}>
                  {svc.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#777' }}>{svc.description}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* API Gateway cross-cutting concerns */}
      <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>API Gateway: Cross-Cutting Concerns</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {[
            { label: 'Authentication', detail: 'JWT verification на каждый запрос. Token refresh.' },
            { label: 'Rate Limiting', detail: `Mobile: 100/min, Web: 200/min, Admin: 50/min` },
            { label: 'Logging', detail: 'Request/response logging, correlation IDs, tracing.' },
            { label: 'Routing', detail: 'Направляет /mobile/* → BFF Mobile, /web/* → BFF Web.' },
          ].map(concern => (
            <div key={concern.label} style={{ padding: '0.5rem', background: '#fff', borderRadius: '4px', fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 'bold', color: '#e65100', marginBottom: '0.2rem' }}>{concern.label}</div>
              <div style={{ color: '#555' }}>{concern.detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
