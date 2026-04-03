import { useState, useMemo, useCallback } from 'react'

// ============================================
// Задание 10.1: Справочная карточка — Rate Limiter
// ============================================

export function Task10_1_Solution() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Distributed Rate Limiter — краткая справка</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Алгоритмы</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Fixed Window</strong> — простой, но boundary burst (2x на стыке).
            <br /><br />
            <strong>Sliding Window Counter</strong> — взвешенная сумма двух окон. Точность ~99.7%, O(1) памяти.
            <br /><br />
            <strong>Token Bucket</strong> — контролируемый burst. AWS, Stripe, GitHub.
            <br /><br />
            <strong>Leaky Bucket</strong> — абсолютно ровный поток. Nginx, сетевые шейперы.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Distributed: Redis + Lua</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Проблема</strong>: N серверов → нужен общий счётчик.
            <br /><br />
            <strong>Redis</strong>: in-memory (~1ms), атомарные операции, TTL.
            <br /><br />
            <strong>Race condition</strong>: GET→проверка→INCR — НЕ атомарно!
            <br /><br />
            <strong>Lua script</strong>: check-and-increment атомарно внутри Redis.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>HTTP Integration</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>429 Too Many Requests</strong> — единственный правильный код.
            <br /><br />
            <code>X-RateLimit-Limit: 100</code>
            <br />
            <code>X-RateLimit-Remaining: 26</code>
            <br />
            <code>X-RateLimit-Reset: 1672531260</code>
            <br />
            <code>Retry-After: 37</code>
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Multi-tier Limiting</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Global</strong> → IP-based → User-based → Endpoint
            <br /><br />
            Порядок: от дешёвого (1 ключ Redis) к дорогому (auth + парсинг).
            <br /><br />
            <strong>Fail-open</strong>: Redis упал → пропускаем запросы.
            <br /><br />
            <strong>Мониторинг</strong>: % 429, p99 latency, Redis health.
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Lua Script (Redis)</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <code style={{ display: 'block', whiteSpace: 'pre', fontSize: '0.8rem', background: '#f5f0f7', padding: '0.5rem', borderRadius: '4px' }}>
{`local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = redis.call('GET', key) or 0
if tonumber(current) >= limit then
  return 0
end
redis.call('INCR', key)
return 1`}
            </code>
          </p>
        </div>
        <div style={{ padding: '1rem', background: '#e0f2f1', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Когда какой алгоритм</h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            <strong>Простой API</strong> → Fixed Window (если boundary burst не критичен).
            <br /><br />
            <strong>Production CDN/API</strong> → Sliding Window Counter.
            <br /><br />
            <strong>API с burst (Stripe)</strong> → Token Bucket.
            <br /><br />
            <strong>Traffic shaping (Nginx)</strong> → Leaky Bucket.
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 10.2: Сравнение алгоритмов Rate Limiting
// ============================================

interface AlgorithmState {
  name: string
  accepted: number
  rejected: number
  history: boolean[]
  internalState: Record<string, number>
}

interface SimConfig {
  rateLimit: number
  windowSize: number
  burstSize: number
  batchSize: number
}

const DEFAULT_CONFIG: SimConfig = {
  rateLimit: 10,
  windowSize: 60,
  burstSize: 5,
  batchSize: 5,
}

function createInitialAlgorithms(): AlgorithmState[] {
  return [
    { name: 'Fixed Window', accepted: 0, rejected: 0, history: [], internalState: { windowStart: 0, count: 0 } },
    { name: 'Sliding Window Counter', accepted: 0, rejected: 0, history: [], internalState: { prevCount: 0, currCount: 0, windowStart: 0 } },
    { name: 'Token Bucket', accepted: 0, rejected: 0, history: [], internalState: { tokens: 0, lastRefill: 0 } },
    { name: 'Leaky Bucket', accepted: 0, rejected: 0, history: [], internalState: { queueSize: 0, lastLeak: 0 } },
  ]
}

function simulateFixedWindow(state: AlgorithmState, config: SimConfig, now: number): boolean {
  const windowKey = Math.floor(now / config.windowSize)
  const currentWindowKey = state.internalState.windowStart || 0

  if (windowKey !== currentWindowKey) {
    state.internalState.windowStart = windowKey
    state.internalState.count = 0
  }

  if (state.internalState.count < config.rateLimit) {
    state.internalState.count++
    return true
  }
  return false
}

function simulateSlidingWindow(state: AlgorithmState, config: SimConfig, now: number): boolean {
  const currentWindow = Math.floor(now / config.windowSize)
  const storedWindow = state.internalState.windowStart || 0

  if (currentWindow !== storedWindow) {
    state.internalState.prevCount = state.internalState.currCount || 0
    state.internalState.currCount = 0
    state.internalState.windowStart = currentWindow
  }

  const elapsed = (now % config.windowSize) / config.windowSize
  const prevWeight = 1 - elapsed
  const estimate = (state.internalState.prevCount || 0) * prevWeight + (state.internalState.currCount || 0)

  if (estimate < config.rateLimit) {
    state.internalState.currCount = (state.internalState.currCount || 0) + 1
    return true
  }
  return false
}

function simulateTokenBucket(state: AlgorithmState, config: SimConfig, now: number): boolean {
  const lastRefill = state.internalState.lastRefill || now
  const elapsed = (now - lastRefill) / config.windowSize
  const refillRate = config.rateLimit
  const maxTokens = config.rateLimit + config.burstSize

  let tokens = state.internalState.tokens || 0
  tokens = Math.min(maxTokens, tokens + elapsed * refillRate)
  state.internalState.lastRefill = now

  if (tokens >= 1) {
    state.internalState.tokens = tokens - 1
    return true
  }
  state.internalState.tokens = tokens
  return false
}

function simulateLeakyBucket(state: AlgorithmState, config: SimConfig, now: number): boolean {
  const lastLeak = state.internalState.lastLeak || now
  const elapsed = (now - lastLeak) / config.windowSize
  const leakRate = config.rateLimit

  let queueSize = state.internalState.queueSize || 0
  const leaked = Math.floor(elapsed * leakRate)
  queueSize = Math.max(0, queueSize - leaked)

  if (leaked > 0) {
    state.internalState.lastLeak = now
  }

  if (queueSize < config.rateLimit) {
    state.internalState.queueSize = queueSize + 1
    return true
  }
  state.internalState.queueSize = queueSize
  return false
}

const SIMULATORS = [simulateFixedWindow, simulateSlidingWindow, simulateTokenBucket, simulateLeakyBucket]

const ALGO_COLORS = ['#1565c0', '#2e7d32', '#e65100', '#6a1b9a']

export function Task10_2_Solution() {
  const [config, setConfig] = useState<SimConfig>(DEFAULT_CONFIG)
  const [algorithms, setAlgorithms] = useState<AlgorithmState[]>(createInitialAlgorithms)
  const [tick, setTick] = useState(0)

  const updateConfig = (key: keyof SimConfig, value: string) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num >= 0) {
      setConfig(prev => ({ ...prev, [key]: num }))
    }
  }

  const sendBatch = useCallback(() => {
    setAlgorithms(prev => {
      const next = prev.map((algo, idx) => {
        const copy: AlgorithmState = {
          ...algo,
          internalState: { ...algo.internalState },
          history: [...algo.history],
        }
        for (let i = 0; i < config.batchSize; i++) {
          const now = Date.now() / 1000 + tick * 0.001 + i * 0.001
          const allowed = SIMULATORS[idx](copy, config, now)
          copy.history.push(allowed)
          if (allowed) {
            copy.accepted++
          } else {
            copy.rejected++
          }
        }
        return copy
      })
      return next
    })
    setTick(t => t + 1)
  }, [config, tick])

  const reset = useCallback(() => {
    setAlgorithms(createInitialAlgorithms())
    setTick(0)
  }, [])

  const inputStyle = {
    width: '80px',
    padding: '0.3rem 0.5rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.9rem',
    textAlign: 'right' as const,
  }

  const totalRequests = algorithms[0].accepted + algorithms[0].rejected

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Сравнение алгоритмов Rate Limiting</h2>

      {/* Controls */}
      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            Rate limit:
            <input type="number" value={config.rateLimit} onChange={e => updateConfig('rateLimit', e.target.value)} style={inputStyle} />
            <span style={{ color: '#666' }}>req/window</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            Window:
            <input type="number" value={config.windowSize} onChange={e => updateConfig('windowSize', e.target.value)} style={inputStyle} />
            <span style={{ color: '#666' }}>сек</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            Burst (Token Bucket):
            <input type="number" value={config.burstSize} onChange={e => updateConfig('burstSize', e.target.value)} style={inputStyle} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem' }}>
            Пачка:
            <input type="number" value={config.batchSize} onChange={e => updateConfig('batchSize', e.target.value)} style={inputStyle} />
            <span style={{ color: '#666' }}>req</span>
          </label>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            onClick={sendBatch}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
            }}
          >
            Отправить {config.batchSize} запросов
          </button>
          <button
            onClick={reset}
            style={{
              padding: '0.5rem 1.5rem',
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '0.95rem',
            }}
          >
            Сбросить
          </button>
          {totalRequests > 0 && (
            <span style={{ alignSelf: 'center', color: '#666', fontSize: '0.9rem' }}>
              Всего отправлено: {totalRequests} запросов
            </span>
          )}
        </div>
      </div>

      {/* Algorithm cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {algorithms.map((algo, idx) => {
          const total = algo.accepted + algo.rejected
          const acceptRate = total > 0 ? ((algo.accepted / total) * 100).toFixed(1) : '—'
          const last20 = algo.history.slice(-20)
          return (
            <div
              key={algo.name}
              style={{
                padding: '1rem',
                border: `2px solid ${ALGO_COLORS[idx]}`,
                borderRadius: '8px',
                background: '#fafafa',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem', color: ALGO_COLORS[idx] }}>{algo.name}</h4>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                <span style={{ color: '#2e7d32' }}>Принято: <strong>{algo.accepted}</strong></span>
                <span style={{ color: '#c62828' }}>Отклонено: <strong>{algo.rejected}</strong></span>
                <span style={{ color: '#555' }}>Rate: <strong>{acceptRate}%</strong></span>
              </div>

              {/* Request history visualization */}
              {last20.length > 0 && (
                <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  {last20.map((accepted, i) => (
                    <div
                      key={i}
                      style={{
                        width: '14px',
                        height: '14px',
                        borderRadius: '3px',
                        background: accepted ? '#4caf50' : '#f44336',
                        opacity: 0.9,
                      }}
                      title={accepted ? 'Принят' : 'Отклонён'}
                    />
                  ))}
                </div>
              )}

              {/* Internal state */}
              <div style={{ fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
                {idx === 0 && `window count: ${algo.internalState.count || 0}`}
                {idx === 1 && `prev: ${algo.internalState.prevCount || 0}, curr: ${algo.internalState.currCount || 0}`}
                {idx === 2 && `tokens: ${(algo.internalState.tokens || 0).toFixed(1)}`}
                {idx === 3 && `queue: ${algo.internalState.queueSize || 0}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Comparison bar chart */}
      {totalRequests > 0 && (
        <div style={{ background: '#263238', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div style={{ color: '#78909c', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
            // Сравнение: % принятых запросов
          </div>
          {algorithms.map((algo, idx) => {
            const total = algo.accepted + algo.rejected
            const pct = total > 0 ? (algo.accepted / total) * 100 : 0
            return (
              <div key={algo.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#90a4ae', fontSize: '0.8rem', width: '160px', textAlign: 'right', flexShrink: 0 }}>
                  {algo.name}
                </span>
                <div style={{ flex: 1, background: '#37474f', borderRadius: '4px', height: '22px', overflow: 'hidden', position: 'relative' }}>
                  <div
                    style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: ALGO_COLORS[idx],
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
                <span style={{ color: '#e0e0e0', fontSize: '0.8rem', width: '100px', flexShrink: 0 }}>
                  {algo.accepted}/{total} ({pct.toFixed(0)}%)
                </span>
              </div>
            )
          })}
        </div>
      )}

      {/* Summary table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Алгоритм</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Память</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Burst</th>
              <th style={{ padding: '0.5rem', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Точность</th>
              <th style={{ padding: '0.5rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Используют</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Fixed Window', 'O(1)', '2x на границе', 'Низкая', 'Простые API'],
              ['Sliding Window Counter', 'O(1)', 'Минимальный', '~99.7%', 'Cloudflare, CDN'],
              ['Token Bucket', 'O(1)', 'Контролируемый', 'Высокая', 'AWS, Stripe, GitHub'],
              ['Leaky Bucket', 'O(N)', 'Нет', 'Идеальная', 'Nginx, сетевые шейперы'],
            ].map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', fontWeight: 'bold', color: ALGO_COLORS[i] }}>{row[0]}</td>
                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>{row[1]}</td>
                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>{row[2]}</td>
                <td style={{ padding: '0.4rem 0.5rem', textAlign: 'center', borderBottom: '1px solid #eee' }}>{row[3]}</td>
                <td style={{ padding: '0.4rem 0.5rem', borderBottom: '1px solid #eee', color: '#666' }}>{row[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ============================================
// Задание 10.3: Полный System Design — Rate Limiter
// ============================================

interface DesignSection {
  id: string
  title: string
  content: string
}

const RATE_LIMITER_SECTIONS: DesignSection[] = [
  {
    id: 'requirements',
    title: '1. Requirements',
    content: `Functional:
  - Ограничивать запросы по настраиваемым правилам (N req за M секунд)
  - Поддержка разных ключей: IP, user ID, API key, endpoint
  - Возвращать HTTP 429 с заголовками X-RateLimit-* и Retry-After
  - Dashboard для настройки правил без деплоя (hot config reload)
  - Multi-tier: несколько уровней лимитов одновременно
  - (Опц.) Rate limiting по стоимости запроса (тяжёлые endpoint = 10 «очков»)

Non-Functional:
  - Latency: < 5 мс overhead на каждый запрос
  - Availability: 99.99% (rate limiter не должен быть single point of failure)
  - Consistency: допустима погрешность 1-5% (better to allow than to block)
  - Scale: 100K+ req/sec через rate limiter
  - Fail-open: если Redis недоступен → пропускаем запросы`,
  },
  {
    id: 'algorithm',
    title: '2. Algorithm Choice',
    content: `Выбор: Sliding Window Counter (основной) + Token Bucket (для API с burst)

Sliding Window Counter:
  - Взвешенная сумма: prev_count * (1 - elapsed%) + curr_count
  - O(1) память: два ключа в Redis (prev window + curr window)
  - Точность ~99.7% — достаточно для production
  - Используется в Cloudflare, Kong, большинстве API gateway

Token Bucket (для premium endpoints):
  - Позволяет burst: накопленные токены можно потратить разом
  - Пример: API с rate 100/min и burst 20 → клиент может отправить 20 запросов мгновенно
  - Гладкий rate после burst: ровно 100/min
  - Используется в AWS API Gateway, Stripe, GitHub API

Почему НЕ другие:
  - Fixed Window: boundary burst (2x лимита на стыке) — неприемлемо
  - Sliding Window Log: O(N) память — при лимите 10K req/min хранить 10K timestamps
  - Leaky Bucket: не позволяет burst — слишком строго для API`,
  },
  {
    id: 'architecture',
    title: '3. Architecture',
    content: `Компоненты:
  [Client] → [API Gateway / Nginx] → [Load Balancer] → [API Server ×N]
                  ↓                                         ↓
              IP rate limit                          [Rate Limiter Middleware]
              (Nginx limit_req)                            ↓
                                                     [Redis Cluster]
                                                     (shared counters)
                                                           ↓
                                                     [Rules Service]
                                                     (конфигурация лимитов)

Request Flow:
  1. Client → API Gateway (IP-level rate limit: 1000 req/min)
  2. → Load Balancer → API Server
  3. → Rate Limiter Middleware:
     a. Определяем ключ: rate:{user_id}:{endpoint}:{window}
     b. Redis EVALSHA (Lua script) → check + increment
     c. Если лимит превышен → 429 + headers
     d. Если OK → next() + добавляем X-RateLimit-* headers
  4. → Business Logic → Response

Distributed Setup:
  - Все API-серверы обращаются к одному Redis Cluster
  - Redis Cluster: 3 master + 3 replica (минимум)
  - Шардирование ключей по hash slots (CRC16)
  - Latency: ~1-2 мс на операцию (Redis в той же AZ)`,
  },
  {
    id: 'redis',
    title: '4. Redis Schema & Lua Scripts',
    content: `=== Key Schema ===

  rate:{type}:{id}:{window_number}

  Примеры:
  rate:ip:192.168.1.1:28842717       → IP-based, window #28842717
  rate:user:42:28842717              → user-based, window #28842717
  rate:user:42:POST:/api/upload:28842717  → endpoint-based
  rate:global:28842717               → global limit

  TTL = window_size * 2 (чтобы хранить prev + curr window)

=== Sliding Window Counter — Lua Script ===

  local curr_key = KEYS[1]              -- rate:user:42:28842717
  local prev_key = KEYS[2]              -- rate:user:42:28842716
  local limit = tonumber(ARGV[1])       -- 100
  local window = tonumber(ARGV[2])      -- 60
  local elapsed_pct = tonumber(ARGV[3]) -- 0.37

  local prev = tonumber(redis.call('GET', prev_key) or '0')
  local curr = tonumber(redis.call('GET', curr_key) or '0')
  local estimate = prev * (1 - elapsed_pct) + curr

  if estimate >= limit then
    local ttl = redis.call('TTL', curr_key)
    return {0, math.ceil(limit - estimate), ttl}  -- rejected
  end

  curr = redis.call('INCR', curr_key)
  if curr == 1 then
    redis.call('EXPIRE', curr_key, window * 2)
  end

  local remaining = math.max(0, limit - (prev * (1 - elapsed_pct) + curr))
  return {1, math.ceil(remaining), window}  -- allowed

=== Token Bucket — Lua Script ===

  local key = KEYS[1]                    -- bucket:user:42
  local rate = tonumber(ARGV[1])         -- 100 tokens/window
  local burst = tonumber(ARGV[2])        -- 20 max tokens
  local window = tonumber(ARGV[3])       -- 60 seconds
  local now = tonumber(ARGV[4])          -- current timestamp

  local data = redis.call('HMGET', key, 'tokens', 'last_refill')
  local tokens = tonumber(data[1]) or burst
  local last = tonumber(data[2]) or now

  local elapsed = (now - last) / window
  tokens = math.min(burst, tokens + elapsed * rate)

  if tokens < 1 then
    redis.call('HSET', key, 'tokens', tokens, 'last_refill', now)
    redis.call('EXPIRE', key, window * 2)
    return {0, 0}  -- rejected
  end

  tokens = tokens - 1
  redis.call('HSET', key, 'tokens', tokens, 'last_refill', now)
  redis.call('EXPIRE', key, window * 2)
  return {1, math.floor(tokens)}  -- allowed, remaining`,
  },
  {
    id: 'http',
    title: '5. HTTP Integration',
    content: `=== Middleware (Express/Koa/Fastify) ===

  async function rateLimitMiddleware(req, res, next) {
    const checks = [
      { key: 'global', limit: 50000, window: 1 },
      { key: 'ip:' + req.ip, limit: 1000, window: 60 },
      { key: 'user:' + req.userId, limit: getUserLimit(req.user), window: 60 },
      { key: 'user:' + req.userId + ':' + req.path, limit: 10, window: 60 },
    ]

    for (const check of checks) {
      const [allowed, remaining, resetIn] = await redisEval(luaScript, check)
      if (!allowed) {
        res.set('X-RateLimit-Limit', check.limit)
        res.set('X-RateLimit-Remaining', '0')
        res.set('X-RateLimit-Reset', Date.now()/1000 + resetIn)
        res.set('Retry-After', resetIn)
        return res.status(429).json({
          error: 'rate_limit_exceeded',
          tier: check.key.split(':')[0],
          retry_after: resetIn
        })
      }
    }

    // Последний check определяет headers для успешного ответа
    res.set('X-RateLimit-Limit', lastCheck.limit)
    res.set('X-RateLimit-Remaining', remaining)
    res.set('X-RateLimit-Reset', resetTimestamp)
    next()
  }

=== Тарифные планы ===

  function getUserLimit(user) {
    switch (user.plan) {
      case 'free':       return 60        // 60 req/min
      case 'pro':        return 600       // 600 req/min
      case 'enterprise': return 6000      // 6000 req/min
      default:           return 30        // anonymous
    }
  }

=== Response Examples ===

  // Success (200 OK)
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 73
  X-RateLimit-Reset: 1672531260

  // Rate limited (429)
  Retry-After: 42
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 0
  X-RateLimit-Reset: 1672531260
  { "error": "rate_limit_exceeded", "retry_after": 42 }`,
  },
  {
    id: 'fault',
    title: '6. Fault Tolerance',
    content: `Стратегия: Fail-Open + Local Fallback + Circuit Breaker

1. Fail-Open (основной принцип):
  - Redis недоступен → пропускаем ВСЕ запросы
  - Обоснование: лучше пропустить excess запросы, чем заблокировать всех пользователей
  - Логируем warning для мониторинга

2. Local Fallback (approximate):
  - При потере Redis → in-memory счётчики на каждом сервере
  - Лимит = global_limit / N_servers (примерное разделение)
  - Неточно, но лучше, чем ничего
  - Автоматический switch-back при восстановлении Redis

3. Circuit Breaker (для Redis-клиента):
  - 5 ошибок подряд → circuit OPEN → skip Redis на 10 сек
  - Через 10 сек → HALF-OPEN → пробуем 1 запрос
  - Успех → CLOSED (нормальная работа)
  - Не даём медленному Redis замедлять каждый запрос

4. Redis HA:
  - Redis Sentinel: automatic failover (master → replica за ~5 сек)
  - Redis Cluster: 3 master + 3 replica, шардирование по ключам
  - Multi-AZ: master в AZ-1, replica в AZ-2
  - Потеря данных при failover: ≤ 1 секунда (async replication)
    → допустимо: несколько запросов сверх лимита не критичны

5. Graceful Degradation:
  - Если 429 rate > 30% → возможно, лимиты слишком строгие или DDoS
  - Auto-scaling API серверов не поможет (лимит на Redis)
  - DDoS → block IP на уровне CDN/WAF, не rate limiter`,
  },
  {
    id: 'monitoring',
    title: '7. Monitoring & Alerting',
    content: `=== Ключевые метрики ===

  Rate Limiter:
  - rate_limit.requests_total (by: status=allowed|rejected, tier, plan)
  - rate_limit.rejection_rate (% отклонённых за 1 мин)
  - rate_limit.latency_p99 (overhead rate limiter в мс)
  - rate_limit.top_rejected_users (top 10 по отклонениям)

  Redis:
  - redis.latency_p99 (должно быть < 5 мс)
  - redis.connections_active
  - redis.memory_used_bytes
  - redis.keyspace_hits / misses
  - redis.cluster_state (ok / fail)

=== Алерты ===

  CRITICAL:
  - redis.cluster_state != ok → on-call page
  - rate_limit.latency_p99 > 10ms → деградация всех API

  WARNING:
  - rate_limit.rejection_rate > 10% → возможная атака или слишком строгие лимиты
  - redis.memory_used > 80% → скоро eviction
  - rate_limit.fallback_active = true → работаем без Redis

  INFO:
  - Новый пользователь достиг лимита → уведомление в Slack
  - Plan upgrade suggestion (user consistently hitting limit)

=== Dashboard ===

  1. Overview: total requests, 429 rate, p99 latency
  2. By tier: IP vs User vs Endpoint rejections
  3. By plan: Free vs Pro vs Enterprise usage
  4. Top offenders: users/IPs с наибольшим % отклонений
  5. Redis health: latency, memory, connections, cluster state
  6. Config: текущие правила, история изменений`,
  },
  {
    id: 'scaling',
    title: '8. Scaling & Optimizations',
    content: `=== Redis Scaling ===

  - 100K req/sec → каждый запрос = 1 EVALSHA → 100K Redis ops/sec
  - Один Redis node: ~100K ops/sec → bottleneck при росте
  - Redis Cluster: шардирование по hash(key) → линейный рост
  - 3 шарда → 300K ops/sec
  - Key design: rate:{user_id}:... → один пользователь на одном шарде

=== Optimizations ===

  1. Local Cache (in-memory):
    - Кэшируем "user already rate-limited" на 1 сек
    - Если user уже заблокирован → не ходим в Redis
    - Экономим 30-50% Redis ops при DDoS

  2. Batch Reads:
    - Pipeline: проверяем 4 tier лимита за 1 roundtrip
    - EVALSHA с 4 ключами вместо 4 отдельных вызовов

  3. Async Writes:
    - INCR не блокирует ответ (fire-and-forget)
    - Если INCR потерялся → -1 к точности (допустимо)

  4. Configuration Hot Reload:
    - Rules в Redis Hash: rate_rules:{plan}:{endpoint}
    - Изменение через admin API → мгновенно для всех серверов
    - Нет необходимости в деплое/рестарте

  5. IP Reputation:
    - Known bad IPs → более строгий лимит
    - Known good IPs (партнёры) → более мягкий лимит
    - Список обновляется из threat intelligence feeds

=== Capacity Planning ===

  100K req/sec × 4 tier checks = 400K Redis ops/sec
  Redis Cluster 6 nodes (3 master + 3 replica) → 300K ops/master
  Headroom: 400K / 300K = ~1.3x → нужно 4-6 masters

  Memory: 100M уникальных ключей × ~100 bytes = ~10 GB
  С TTL 120 сек → ключи автоматически очищаются
  Реальная memory: ~2-5 GB (горячие ключи)`,
  },
]

export function Task10_3_Solution() {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set())
  const [expandAll, setExpandAll] = useState(false)

  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (expandAll) {
      setOpenSections(new Set())
    } else {
      setOpenSections(new Set(RATE_LIMITER_SECTIONS.map(s => s.id)))
    }
    setExpandAll(!expandAll)
  }

  const getSectionIcon = (id: string) => {
    switch (id) {
      case 'requirements': return '\u{1F4CB}'
      case 'algorithm': return '\u{2696}\uFE0F'
      case 'architecture': return '\u{1F3D7}\uFE0F'
      case 'redis': return '\u{1F4BE}'
      case 'http': return '\u{1F310}'
      case 'fault': return '\u{1F6E1}\uFE0F'
      case 'monitoring': return '\u{1F4CA}'
      case 'scaling': return '\u{1F4C8}'
      default: return '\u{1F4CC}'
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Полный System Design: Distributed Rate Limiter</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Эталонное решение. Раскройте каждую секцию, чтобы увидеть детали. Сравните со своим дизайном.
      </p>

      <button
        onClick={toggleAll}
        style={{
          padding: '0.4rem 1rem',
          marginBottom: '1rem',
          background: '#f5f5f5',
          border: '1px solid #ddd',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        {expandAll ? 'Свернуть все' : 'Развернуть все'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {RATE_LIMITER_SECTIONS.map(section => {
          const isOpen = openSections.has(section.id)
          return (
            <div key={section.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
              <button
                onClick={() => toggleSection(section.id)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: isOpen ? '#e3f2fd' : '#fafafa',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textAlign: 'left',
                }}
              >
                <span style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block' }}>
                  {'\u25B6'}
                </span>
                <span>{getSectionIcon(section.id)}</span>
                <span>{section.title}</span>
              </button>
              {isOpen && (
                <div style={{
                  padding: '1rem',
                  background: '#fafafa',
                  borderTop: '1px solid #e0e0e0',
                }}>
                  <pre style={{
                    margin: 0,
                    whiteSpace: 'pre-wrap',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    lineHeight: '1.5',
                    color: '#333',
                  }}>
                    {section.content}
                  </pre>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
        <strong>Чеклист интервью:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
          1. Requirements (2 мин) → 2. Algorithm Choice (3 мин) → 3. Architecture (5 мин)
          <br />
          4. Redis Schema & Lua (5 мин) → 5. HTTP Integration (3 мин)
          <br />
          6. Fault Tolerance (5 мин) → 7. Monitoring (3 мин) → 8. Scaling (5 мин)
          <br /><br />
          Итого: ~35 минут. Ключевые отличия от простого rate limiter: distributed coordination через Redis,
          атомарные Lua scripts, fail-open стратегия, multi-tier проверки.
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
        <strong>Ключевые решения:</strong>
        <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>Вопрос</th>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>Решение</th>
                <th style={{ textAlign: 'left', padding: '0.3rem', borderBottom: '1px solid #ddd' }}>Почему</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Алгоритм</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Sliding Window Counter</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>O(1) память, ~99.7% точность, нет boundary burst</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Storage</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Redis Cluster</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>~1ms latency, атомарные Lua, TTL, шардирование</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Атомарность</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Lua script (EVALSHA)</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Условная логика + атомарность (MULTI/EXEC не подходит)</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Fault tolerance</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Fail-open</td>
                <td style={{ padding: '0.3rem', borderBottom: '1px solid #eee' }}>Лучше пропустить лишние запросы, чем заблокировать всех</td>
              </tr>
              <tr>
                <td style={{ padding: '0.3rem' }}>Multi-tier порядок</td>
                <td style={{ padding: '0.3rem' }}>Global → IP → User → Endpoint</td>
                <td style={{ padding: '0.3rem' }}>От дешёвого к дорогому, воронка</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
