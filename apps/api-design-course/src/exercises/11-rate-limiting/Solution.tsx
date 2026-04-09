import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 11.1: Token Bucket Simulator
// ============================================

export function Task11_1_Solution() {
  const [capacity, setCapacity] = useState(10)
  const [refillRate, setRefillRate] = useState(2) // tokens per second
  const [tokens, setTokens] = useState(10)
  const [log, setLog] = useState<Array<{ time: string; status: 'ok' | 'limited'; remaining: number; resetIn: number }>>([])
  const tokensRef = useRef(10)
  const lastRefillRef = useRef(Date.now())
  const [nextRefill, setNextRefill] = useState(0)

  useEffect(() => {
    tokensRef.current = capacity
    setTokens(capacity)
  }, [capacity])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      const elapsed = (now - lastRefillRef.current) / 1000
      const refilled = elapsed * refillRate
      if (refilled >= 1) {
        const add = Math.floor(refilled)
        tokensRef.current = Math.min(capacity, tokensRef.current + add)
        setTokens(tokensRef.current)
        lastRefillRef.current = now
      }
      const timeToNext = 1 / refillRate - ((now - lastRefillRef.current) / 1000)
      setNextRefill(Math.max(0, timeToNext))
    }, 100)
    return () => clearInterval(interval)
  }, [capacity, refillRate])

  const sendRequest = () => {
    const now = new Date()
    const time = now.toLocaleTimeString('ru-RU', { hour12: false })
    const resetIn = Math.ceil(1 / refillRate)
    if (tokensRef.current >= 1) {
      tokensRef.current -= 1
      setTokens(tokensRef.current)
      setLog(prev => [{ time, status: 'ok', remaining: tokensRef.current, resetIn }, ...prev.slice(0, 9)])
    } else {
      setLog(prev => [{ time, status: 'limited', remaining: 0, resetIn }, ...prev.slice(0, 9)])
    }
  }

  const bucketFill = Math.round((tokens / capacity) * 100)
  const bucketColor = bucketFill > 50 ? '#22c55e' : bucketFill > 20 ? '#f59e0b' : '#ef4444'

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Симулятор Token Bucket</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Визуализация алгоритма ограничения частоты запросов
      </p>

      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Размер ведра (capacity): <span style={{ color: '#6366f1' }}>{capacity} токенов</span>
          </label>
          <input
            type="range" min={3} max={20} value={capacity}
            onChange={e => setCapacity(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            Скорость пополнения: <span style={{ color: '#6366f1' }}>{refillRate} токен/сек</span>
          </label>
          <input
            type="range" min={1} max={5} value={refillRate}
            onChange={e => setRefillRate(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
      </div>

      {/* Bucket visualization + action */}
      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem', marginBottom: '1.5rem', alignItems: 'start' }}>
        {/* Bucket */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.5rem' }}>Состояние ведра</div>
          <div style={{ position: 'relative', width: '120px', height: '160px', margin: '0 auto', border: '3px solid #cbd5e1', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'hidden', background: '#f1f5f9' }}>
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0,
              height: `${bucketFill}%`,
              background: bucketColor,
              transition: 'height 0.3s ease, background 0.3s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {bucketFill > 20 && (
                <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>{tokens}</span>
              )}
            </div>
            {bucketFill <= 20 && (
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontWeight: 700, color: '#64748b' }}>{tokens}</div>
            )}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
            {tokens} / {capacity} токенов
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            +1 через ~{nextRefill.toFixed(1)}с
          </div>
        </div>

        {/* Right side */}
        <div>
          {/* Send button */}
          <button
            onClick={sendRequest}
            style={{
              background: tokens >= 1 ? '#6366f1' : '#e2e8f0',
              color: tokens >= 1 ? 'white' : '#94a3b8',
              border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem',
              fontSize: '1rem', fontWeight: 600, cursor: tokens >= 1 ? 'pointer' : 'not-allowed',
              marginBottom: '1rem', width: '100%'
            }}
          >
            Отправить запрос
          </button>

          {/* Response headers */}
          {log.length > 0 && (
            <div style={{
              background: log[0].status === 'ok' ? '#f0fdf4' : '#fff1f2',
              border: `1px solid ${log[0].status === 'ok' ? '#bbf7d0' : '#fecdd3'}`,
              borderRadius: '8px', padding: '0.75rem'
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: log[0].status === 'ok' ? '#16a34a' : '#dc2626' }}>
                {log[0].status === 'ok' ? '200 OK — Запрос выполнен' : '429 Too Many Requests'}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.8, color: '#1e293b' }}>
                <div><span style={{ color: '#6366f1' }}>X-RateLimit-Limit:</span> {capacity}</div>
                <div><span style={{ color: '#6366f1' }}>X-RateLimit-Remaining:</span> {log[0].remaining}</div>
                <div><span style={{ color: '#6366f1' }}>X-RateLimit-Reset:</span> +{log[0].resetIn}s</div>
                {log[0].status === 'limited' && (
                  <div><span style={{ color: '#dc2626' }}>Retry-After:</span> {log[0].resetIn}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Request log */}
      {log.length > 0 && (
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>История запросов</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {log.map((entry, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.4rem 0.75rem', borderRadius: '6px',
                background: entry.status === 'ok' ? '#f0fdf4' : '#fff1f2',
                fontSize: '0.8rem', fontFamily: 'monospace'
              }}>
                <span style={{ color: '#94a3b8' }}>{entry.time}</span>
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: '4px',
                  background: entry.status === 'ok' ? '#22c55e' : '#ef4444',
                  color: 'white', fontWeight: 600, fontSize: '0.7rem'
                }}>
                  {entry.status === 'ok' ? '200' : '429'}
                </span>
                <span style={{ color: '#64748b' }}>remaining: {entry.remaining}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginTop: '1.5rem', fontSize: '0.85rem' }}>
        <strong>Как работает Token Bucket:</strong> Ведро хранит токены до максимума ({capacity}). Каждый запрос расходует 1 токен.
        Токены пополняются со скоростью {refillRate}/сек. Если токенов нет — запрос отклоняется с 429.
        Алгоритм допускает кратковременные всплески (burst) до capacity запросов подряд.
      </div>
    </div>
  )
}

// ============================================
// Task 11.2: Exponential Backoff with Jitter
// ============================================

interface RetryAttempt {
  attempt: number
  delay: number
  jitteredDelay: number
  status: '429' | 'ok' | 'pending'
}

function calcDelay(attempt: number, base: number, max: number): number {
  return Math.min(max, base * Math.pow(2, attempt - 1))
}

function addJitter(delay: number): number {
  return delay * (0.5 + Math.random() * 0.5)
}

export function Task11_2_Solution() {
  const [baseDelay, setBaseDelay] = useState(1000)
  const [maxDelay, setMaxDelay] = useState(32000)
  const [maxRetries, setMaxRetries] = useState(5)
  const [jitter, setJitter] = useState(true)
  const [attempts, setAttempts] = useState<RetryAttempt[]>([])
  const [running, setRunning] = useState(false)
  const [successAt, setSuccessAt] = useState(4) // succeed on this attempt

  const buildAttempts = (): RetryAttempt[] => {
    const result: RetryAttempt[] = []
    for (let i = 1; i <= maxRetries + 1; i++) {
      const delay = i === 1 ? 0 : calcDelay(i - 1, baseDelay, maxDelay)
      const jitteredDelay = jitter && i > 1 ? addJitter(delay) : delay
      result.push({
        attempt: i,
        delay,
        jitteredDelay,
        status: i === successAt ? 'ok' : i < successAt ? '429' : 'pending',
      })
      if (i === successAt) break
    }
    return result
  }

  const simulate = () => {
    setRunning(true)
    setAttempts([])
    const builtAttempts = buildAttempts()
    builtAttempts.forEach((a, i) => {
      const cumulativeDelay = builtAttempts.slice(0, i).reduce((acc, x) => acc + x.jitteredDelay, 0)
      setTimeout(() => {
        setAttempts(prev => [...prev, a])
        if (i === builtAttempts.length - 1) setRunning(false)
      }, Math.min(cumulativeDelay / 20 + i * 200, 3000 + i * 400))
    })
  }

  const previewAttempts = buildAttempts()
  const totalTimeNoJitter = previewAttempts.reduce((acc, a) => acc + a.delay, 0)
  const totalTimeJitter = previewAttempts.reduce((acc, a) => acc + a.jitteredDelay, 0)

  const msToLabel = (ms: number) => {
    if (ms === 0) return '0мс'
    if (ms < 1000) return `${Math.round(ms)}мс`
    return `${(ms / 1000).toFixed(1)}с`
  }

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Конструктор Retry-стратегии</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Exponential backoff с jitter — правильная реакция клиента на 429
      </p>

      {/* Settings */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Base delay: <span style={{ color: '#6366f1' }}>{msToLabel(baseDelay)}</span>
          </label>
          <input type="range" min={100} max={5000} step={100} value={baseDelay}
            onChange={e => setBaseDelay(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Max delay: <span style={{ color: '#6366f1' }}>{msToLabel(maxDelay)}</span>
          </label>
          <input type="range" min={1000} max={60000} step={1000} value={maxDelay}
            onChange={e => setMaxDelay(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.85rem' }}>
            Max retries: <span style={{ color: '#6366f1' }}>{maxRetries}</span>
          </label>
          <input type="range" min={1} max={8} value={maxRetries}
            onChange={e => setMaxRetries(Number(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <label style={{ fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" checked={jitter} onChange={e => setJitter(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            Jitter (случайность) {jitter ? '✓ вкл' : '✗ выкл'}
          </label>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Добавляет случайный сдвиг ×0.5–1.0 к задержке
          </div>
        </div>
      </div>

      {/* Succeed on attempt */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>Успех на попытке:</span>
        {[2, 3, 4, 5].map(n => (
          <button key={n} onClick={() => setSuccessAt(n)}
            style={{
              padding: '0.25rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
              background: successAt === n ? '#6366f1' : '#e2e8f0',
              color: successAt === n ? 'white' : '#475569',
              fontWeight: 600, fontSize: '0.8rem'
            }}>
            #{n}
          </button>
        ))}
      </div>

      {/* Timeline preview */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.75rem', color: '#475569' }}>
          Timeline попыток (превью)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {previewAttempts.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: a.status === 'ok' ? '#22c55e' : '#ef4444', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                {a.attempt}
              </div>
              {a.delay > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <div style={{
                    height: '8px', borderRadius: '4px', background: jitter ? '#f59e0b' : '#6366f1',
                    width: `${Math.max(20, Math.min(200, a.jitteredDelay / maxDelay * 200))}px`,
                    transition: 'width 0.3s'
                  }} />
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569' }}>
                    {msToLabel(Math.round(a.jitteredDelay))}
                    {jitter && a.delay !== a.jitteredDelay && (
                      <span style={{ color: '#94a3b8' }}> (без jitter: {msToLabel(a.delay)})</span>
                    )}
                  </span>
                </div>
              )}
              <span style={{
                marginLeft: 'auto', padding: '0.15rem 0.5rem', borderRadius: '4px',
                background: a.status === 'ok' ? '#22c55e' : '#ef4444',
                color: 'white', fontWeight: 600, fontSize: '0.75rem'
              }}>
                {a.status === 'ok' ? '200 OK' : '429'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: '#dc2626' }}>Без jitter</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Все клиенты ждут одинаково</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.5rem', color: '#1e293b' }}>
            Суммарно: {msToLabel(totalTimeNoJitter)}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem' }}>
            Thundering herd: все атакуют одновременно
          </div>
        </div>
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem' }}>
          <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem', color: '#16a34a' }}>С jitter</div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Клиенты рассредоточены во времени</div>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '0.5rem', color: '#1e293b' }}>
            Суммарно: ~{msToLabel(Math.round(totalTimeJitter))}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#22c55e', marginTop: '0.25rem' }}>
            Нагрузка распределена равномерно
          </div>
        </div>
      </div>

      {/* Simulate button + animated log */}
      <button onClick={simulate} disabled={running}
        style={{
          background: running ? '#e2e8f0' : '#6366f1', color: running ? '#94a3b8' : 'white',
          border: 'none', borderRadius: '8px', padding: '0.75rem 1.5rem',
          fontSize: '0.95rem', fontWeight: 600, cursor: running ? 'not-allowed' : 'pointer',
          marginBottom: '1rem', width: '100%'
        }}>
        {running ? 'Симуляция...' : 'Запустить симуляцию'}
      </button>

      {attempts.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 2 }}>
            {attempts.map((a, i) => (
              <div key={i} style={{ color: a.status === 'ok' ? '#86efac' : '#fca5a5' }}>
                {'>'} Попытка {a.attempt}:
                {a.delay > 0 && ` (ждали ${msToLabel(Math.round(a.jitteredDelay))})`}
                {' '}→ {a.status === 'ok' ? '200 OK — успех!' : '429 Too Many Requests'}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginTop: '1rem', fontSize: '0.85rem' }}>
        <strong>Формула:</strong> delay = min(maxDelay, baseDelay × 2^(attempt-1))
        {jitter && <span> × random(0.5, 1.0)</span>}
        <br />
        <strong>Почему jitter важен:</strong> без него все клиенты повторят запрос одновременно — thundering herd problem.
      </div>
    </div>
  )
}

// ============================================
// Task 11.3: Rate Limiting Design Scenarios
// ============================================

interface Scenario {
  id: string
  title: string
  description: string
  icon: string
  solution: {
    algorithm: string
    limits: string[]
    headers: string[]
    keyType: string
    extras: string[]
  }
}

const SCENARIOS: Scenario[] = [
  {
    id: 'public-api',
    title: 'Публичный API для разработчиков',
    description: 'SaaS-продукт. Три тарифа: Free (бесплатный), Pro ($49/мес), Enterprise ($499/мес). API используют внешние разработчики для интеграции.',
    icon: '🌐',
    solution: {
      algorithm: 'Token Bucket',
      limits: [
        'Free: 100 запросов/час, 1000/день',
        'Pro: 10 000 запросов/час, 100 000/день',
        'Enterprise: 100 000 запросов/час, без дневного лимита',
      ],
      headers: [
        'X-RateLimit-Limit: 10000',
        'X-RateLimit-Remaining: 9854',
        'X-RateLimit-Reset: 1735689600',
        'X-RateLimit-Plan: pro',
      ],
      keyType: 'API Key (из Authorization: Bearer)',
      extras: [
        'Token Bucket допускает краткий burst — удобно при старте сессии',
        'Разные ведра для разных методов (GET щедрее, POST строже)',
        '429 + Retry-After + ссылка на апгрейд тарифа',
        'Webhooks при приближении к лимиту (80%)',
      ],
    },
  },
  {
    id: 'internal-api',
    title: 'Внутренний API между микросервисами',
    description: 'Backend-to-backend взаимодействие. 8 микросервисов, 3 из них — тяжелые потребители. Нужна защита от каскадных отказов.',
    icon: '⚙️',
    solution: {
      algorithm: 'Sliding Window Counter',
      limits: [
        'Стандартный сервис: 5000 запросов/мин',
        'Тяжёлый потребитель: 20 000 запросов/мин',
        'Burst: до 2× на 10 секунд',
      ],
      headers: [
        'X-RateLimit-Limit: 5000',
        'X-RateLimit-Remaining: 4231',
        'X-RateLimit-Window: 60',
      ],
      keyType: 'Service ID (из заголовка X-Service-ID)',
      extras: [
        'Sliding window точнее fixed window — нет спайка на границе',
        'Circuit breaker поверх rate limit — при 50% ошибок размыкаем',
        'Shared Redis для согласованности между репликами',
        'Мониторинг: алерт при достижении 70% лимита',
      ],
    },
  },
  {
    id: 'bff-mobile',
    title: 'BFF для мобильного приложения',
    description: 'Backend for Frontend для iOS/Android. 2 млн активных пользователей. Нужно защититься от злоупотреблений и обеспечить fair use.',
    icon: '📱',
    solution: {
      algorithm: 'Sliding Window Log (для чувствительных эндпоинтов) + Token Bucket (основной поток)',
      limits: [
        'Общий лимит: 300 запросов/мин на пользователя',
        'Аутентификация (POST /auth): 5 попыток/мин на IP',
        'Поиск: 30 запросов/мин на пользователя',
        'Загрузка файлов: 10 запросов/мин на пользователя',
      ],
      headers: [
        'X-RateLimit-Limit: 300',
        'X-RateLimit-Remaining: 287',
        'X-RateLimit-Reset: 1735689660',
      ],
      keyType: 'User ID для аутентифицированных + IP для анонимных',
      extras: [
        'Разные лимиты по типу операции (read vs write)',
        'IP-блокировка при брутфорсе /auth',
        'Graceful degradation: при перегрузке отдавать кэш',
        'Заголовки на каждый ответ — клиент может адаптировать polling',
      ],
    },
  },
]

export function Task11_3_Solution() {
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})

  const active = SCENARIOS.find(s => s.id === activeScenario)

  return (
    <div className="exercise-container" style={{ padding: '1.5rem', maxWidth: '900px' }}>
      <h2 style={{ marginBottom: '0.25rem' }}>Проектирование Rate Limiting</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Три реальных сценария — выберите алгоритм, лимиты и стратегию коммуникации
      </p>

      {/* Scenario cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {SCENARIOS.map(s => (
          <div key={s.id}
            onClick={() => setActiveScenario(activeScenario === s.id ? null : s.id)}
            style={{
              border: `2px solid ${activeScenario === s.id ? '#6366f1' : '#e2e8f0'}`,
              borderRadius: '10px', padding: '1rem', cursor: 'pointer',
              background: activeScenario === s.id ? '#f5f3ff' : 'white',
              transition: 'all 0.2s'
            }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{s.icon}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{s.title}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>{s.description}</div>
          </div>
        ))}
      </div>

      {active && (
        <div>
          {/* User's answer textarea */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Ваше решение для сценария «{active.title}»:
            </label>
            <textarea
              value={userAnswers[active.id] || ''}
              onChange={e => setUserAnswers(prev => ({ ...prev, [active.id]: e.target.value }))}
              placeholder="Опишите: алгоритм rate limiting, лимиты для разных уровней, ключ идентификации, HTTP-заголовки ответа, дополнительные механизмы защиты..."
              rows={5}
              style={{
                width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.9rem',
                resize: 'vertical', boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={() => setRevealed(prev => ({ ...prev, [active.id]: true }))}
            style={{
              background: '#6366f1', color: 'white', border: 'none',
              borderRadius: '8px', padding: '0.6rem 1.25rem',
              fontWeight: 600, cursor: 'pointer', marginBottom: '1rem'
            }}>
            Показать эталонное решение
          </button>

          {revealed[active.id] && (
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
              {/* Algorithm */}
              <div style={{ background: '#f5f3ff', padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0' }}>
                <span style={{ fontWeight: 700, color: '#6366f1' }}>Алгоритм: </span>
                <span style={{ fontWeight: 600 }}>{active.solution.algorithm}</span>
              </div>

              <div style={{ padding: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Limits */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Лимиты</div>
                  {active.solution.limits.map((l, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.35rem', fontSize: '0.85rem' }}>
                      <span style={{ color: '#6366f1', flexShrink: 0 }}>•</span>
                      <span>{l}</span>
                    </div>
                  ))}
                </div>

                {/* Headers */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>HTTP-заголовки</div>
                  <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.6rem 0.75rem' }}>
                    {active.solution.headers.map((h, i) => (
                      <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#93c5fd', lineHeight: 1.7 }}>{h}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '0 1rem 1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Key type */}
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '0.6rem 0.75rem' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#16a34a', marginBottom: '0.25rem' }}>Ключ идентификации</div>
                  <div style={{ fontSize: '0.85rem' }}>{active.solution.keyType}</div>
                </div>

                {/* Extras */}
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem', color: '#475569' }}>Дополнительно</div>
                  {active.solution.extras.map((e, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.3rem', fontSize: '0.8rem' }}>
                      <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                      <span style={{ color: '#475569' }}>{e}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!activeScenario && (
        <div style={{ background: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>
          Выберите сценарий выше, чтобы начать проектирование
        </div>
      )}
    </div>
  )
}
