import { useState, useRef, useCallback, useEffect } from 'react'

// ============================================
// Задание 7.1: Справочная карточка (Паттерны надёжности)
// ============================================

export function Task7_1_Solution() {
  const [activeTab, setActiveTab] = useState<'patterns' | 'slo' | 'deploy'>('patterns')

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
      <h2>Паттерны надёжности — справочник</h2>

      {/* Main comparison table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'left' }}>Паттерн</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center' }}>Проблема</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center' }}>Решение</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd', textAlign: 'center' }}>Аналогия</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Circuit Breaker', 'Запросы к мёртвому сервису', 'Разорвать цепь, fallback', 'Автомат в щитке'],
            ['Retry + Backoff', 'Временные сбои', 'Повторить с нарастающей задержкой', 'Перезвонить позже'],
            ['Bulkhead', 'Каскадный отказ', 'Изолировать пулы ресурсов', 'Отсеки подлодки'],
            ['Timeout', 'Зависший запрос', 'Ограничить время ожидания', 'Таймер на микроволновке'],
            ['Fallback', 'Сервис недоступен', 'Запасной вариант (кэш, default)', 'Запасной выход'],
            ['Health Check', 'Не знаем жив ли сервис', 'Liveness + Readiness пробы', 'Пульс пациента'],
          ].map(([pattern, problem, solution, analogy], i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>{pattern}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{problem}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{solution}</td>
              <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', fontStyle: 'italic' }}>{analogy}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '1rem' }}>
        <button style={tabStyle('patterns')} onClick={() => setActiveTab('patterns')}>Паттерны</button>
        <button style={tabStyle('slo')} onClick={() => setActiveTab('slo')}>SLO / Error Budget</button>
        <button style={tabStyle('deploy')} onClick={() => setActiveTab('deploy')}>Стратегии деплоя</button>
      </div>

      {activeTab === 'patterns' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#2e7d32' }}>Circuit Breaker</h4>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
              3 состояния: <strong>Closed</strong> (всё ОК) → <strong>Open</strong> (сервис лежит, fallback) → <strong>Half-Open</strong> (тестовый запрос).
            </p>
            <pre style={{ margin: 0, fontSize: '0.75rem', background: '#fff', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`// threshold: 5 ошибок → Open
// timeout: 30s → Half-Open
const breaker = new CircuitBreaker({
  threshold: 5,
  timeout: 30000
})`}
            </pre>
          </div>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#1565c0' }}>Retry + Exponential Backoff</h4>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
              Формула: <code>delay = base * 2^attempt + jitter</code>. Максимум 3-5 попыток. Retry только idempotent ошибки (timeout, 503).
            </p>
            <pre style={{ margin: 0, fontSize: '0.75rem', background: '#fff', padding: '0.5rem', borderRadius: '4px', overflow: 'auto' }}>
{`// 1s → 2s → 4s → 8s + jitter
await retryWithBackoff(fn, {
  maxRetries: 3,
  baseDelay: 1000
})`}
            </pre>
          </div>
          <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Bulkhead</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Отдельные пулы ресурсов для каждого сервиса. Payments: 30 conn, Notifications: 20 conn, Analytics: 10 conn.
              Если аналитика легла — платежи продолжают работать.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#c62828' }}>Graceful Degradation</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Разделить зависимости на <strong>critical</strong> (без них 404) и <strong>non-critical</strong> (fallback на кэш или пустой ответ).
              Страница товара без рекомендаций лучше, чем 503.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'slo' && (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '1rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>SLO</th>
                <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Downtime / месяц</th>
                <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Downtime / год</th>
                <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Пример</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['99%', '7.3 часа', '3.65 дня', 'Внутренний инструмент'],
                ['99.9%', '43.2 мин', '8.76 часа', 'Типичный SaaS'],
                ['99.99%', '4.32 мин', '52.6 мин', 'Платёжная система'],
                ['99.999%', '25.9 сек', '5.26 мин', 'DNS, критическая инфра'],
              ].map(([slo, monthly, yearly, example], i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold', textAlign: 'center' }}>{slo}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{monthly}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{yearly}</td>
                  <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center', fontStyle: 'italic' }}>{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#e8eaf6', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#283593' }}>SLI → SLO → SLA</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                <strong>SLI</strong> — метрика (latency p99 = 150ms).<br />
                <strong>SLO</strong> — цель команды (p99 {'<'} 200ms).<br />
                <strong>SLA</strong> — контракт с клиентом (99.95% uptime, иначе компенсация).
              </p>
            </div>
            <div style={{ padding: '1rem', background: '#fff8e1', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: '#f57f17' }}>Error Budget & Burn Rate</h4>
              <p style={{ margin: 0, fontSize: '0.85rem' }}>
                <strong>Error budget</strong> = 100% - SLO. При 99.9% = 0.1% ошибок допустимо.<br />
                <strong>Burn rate</strong> = скорость расхода бюджета. Rate 1 = на весь период. Rate 10 = бюджет за 1/10 периода.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'deploy' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#1565c0' }}>Blue-Green</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              2 среды. Blue = текущая, Green = новая. Мгновенное переключение. Rollback = переключить обратно.
              <br /><strong>Минус:</strong> 2x ресурсов.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#e65100' }}>Canary Release</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Постепенно: 5% → 25% → 50% → 100%. Мониторинг на каждом этапе. Если error rate вырос → rollback.
              <br /><strong>Инструменты:</strong> Argo Rollouts, Flagger.
            </p>
          </div>
          <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#7b1fa2' }}>Feature Flags</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Код в проде, но выключен. Включаем для % пользователей. Деплой и релиз — разные вещи.
              <br /><strong>Инструменты:</strong> LaunchDarkly, Unleash.
            </p>
          </div>
        </div>
      )}

      {/* Key principle */}
      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px', border: '1px solid #c8e6c9' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: '#2e7d32' }}>Главный принцип</h4>
        <p style={{ margin: 0, fontSize: '0.9rem' }}>
          Надёжность — это не &laquo;работает без ошибок&raquo;, а &laquo;продолжает работать <strong>несмотря</strong> на ошибки&raquo;.
          Проектируйте системы, которые <strong>ожидают</strong> отказов и <strong>подготовлены</strong> к ним.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Задание 7.2: Circuit Breaker симулятор
// ============================================

type CBState = 'closed' | 'open' | 'half-open'

interface CBLog {
  id: number
  time: string
  type: 'request' | 'state-change'
  success?: boolean
  blocked?: boolean
  message: string
}

export function Task7_2_Solution() {
  const [errorRate, setErrorRate] = useState(50)
  const [threshold, setThreshold] = useState(3)
  const [recoveryTimeout, setRecoveryTimeout] = useState(5)

  const [state, setState] = useState<CBState>('closed')
  const [failureCount, setFailureCount] = useState(0)
  const [totalRequests, setTotalRequests] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const [failureTotal, setFailureTotal] = useState(0)
  const [blockedCount, setBlockedCount] = useState(0)
  const [logs, setLogs] = useState<CBLog[]>([])
  const logIdRef = useRef(0)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [countdown, setCountdown] = useState(0)
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getTimeStr = () => new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const addLog = useCallback((type: CBLog['type'], message: string, success?: boolean, blocked?: boolean) => {
    const id = ++logIdRef.current
    setLogs(prev => [{ id, time: getTimeStr(), type, success, blocked, message }, ...prev].slice(0, 30))
  }, [])

  const transitionTo = useCallback((newState: CBState) => {
    setState(newState)
    const labels: Record<CBState, string> = {
      'closed': 'CLOSED (requests flowing)',
      'open': 'OPEN (requests blocked)',
      'half-open': 'HALF-OPEN (testing...)',
    }
    addLog('state-change', `State: ${labels[newState]}`)
  }, [addLog])

  const startRecoveryTimer = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)

    setCountdown(recoveryTimeout)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    openTimerRef.current = setTimeout(() => {
      transitionTo('half-open')
    }, recoveryTimeout * 1000)
  }, [recoveryTimeout, transitionTo])

  const sendRequest = useCallback(() => {
    setTotalRequests(prev => prev + 1)

    // Open state — block request
    if (state === 'open') {
      setBlockedCount(prev => prev + 1)
      addLog('request', `BLOCKED — Circuit is Open. Wait ${countdown}s for recovery.`, false, true)
      return
    }

    // Simulate request
    const success = Math.random() * 100 >= errorRate

    if (state === 'half-open') {
      if (success) {
        setSuccessCount(prev => prev + 1)
        setFailureCount(0)
        addLog('request', 'SUCCESS (half-open test) — recovering!', true)
        transitionTo('closed')
      } else {
        setFailureTotal(prev => prev + 1)
        addLog('request', 'FAILURE (half-open test) — back to Open', false)
        transitionTo('open')
        startRecoveryTimer()
      }
      return
    }

    // Closed state
    if (success) {
      setSuccessCount(prev => prev + 1)
      setFailureCount(0)
      addLog('request', 'SUCCESS', true)
    } else {
      setFailureTotal(prev => prev + 1)
      const newFailures = failureCount + 1
      setFailureCount(newFailures)
      addLog('request', `FAILURE (${newFailures}/${threshold} to open)`, false)

      if (newFailures >= threshold) {
        transitionTo('open')
        startRecoveryTimer()
      }
    }
  }, [state, errorRate, failureCount, threshold, countdown, addLog, transitionTo, startRecoveryTimer])

  const reset = useCallback(() => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (countdownRef.current) clearInterval(countdownRef.current)
    setState('closed')
    setFailureCount(0)
    setTotalRequests(0)
    setSuccessCount(0)
    setFailureTotal(0)
    setBlockedCount(0)
    setLogs([])
    setCountdown(0)
    logIdRef.current = 0
  }, [])

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (countdownRef.current) clearInterval(countdownRef.current)
    }
  }, [])

  const stateColors: Record<CBState, { bg: string, text: string, border: string }> = {
    'closed': { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7' },
    'open': { bg: '#ffebee', text: '#c62828', border: '#ef9a9a' },
    'half-open': { bg: '#fff8e1', text: '#f57f17', border: '#ffe082' },
  }

  const stateLabels: Record<CBState, string> = {
    'closed': 'CLOSED',
    'open': 'OPEN',
    'half-open': 'HALF-OPEN',
  }

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

  const colors = stateColors[state]

  return (
    <div style={{ padding: '1rem', maxWidth: '800px' }}>
      <h2>Circuit Breaker Simulator</h2>

      {/* State visualization */}
      <div style={{
        padding: '1.5rem',
        background: colors.bg,
        border: `3px solid ${colors.border}`,
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '1rem',
      }}>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.text }}>
          {stateLabels[state]}
        </div>
        <div style={{ fontSize: '0.9rem', color: colors.text, marginTop: '0.3rem' }}>
          {state === 'closed' && `Consecutive failures: ${failureCount} / ${threshold}`}
          {state === 'open' && `Recovery in: ${countdown}s`}
          {state === 'half-open' && 'Waiting for test request...'}
        </div>
      </div>

      {/* Error rate slider */}
      <div style={{ marginBottom: '1rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Service Error Rate: {errorRate}%</strong>
          <span style={{ fontSize: '0.8rem', color: '#777' }}>
            {errorRate === 0 ? 'All requests succeed' : errorRate === 100 ? 'All requests fail' : `${errorRate}% chance of failure`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={errorRate}
          onChange={(e) => setErrorRate(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>
      </div>

      {/* Parameters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <strong>Failure Threshold:</strong>
          <div style={{ marginTop: '0.3rem' }}>
            {[3, 5, 10].map(t => (
              <button key={t} style={btnStyle(threshold === t)} onClick={() => { setThreshold(t); reset() }}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <strong>Recovery Timeout:</strong>
          <div style={{ marginTop: '0.3rem' }}>
            {[5, 10, 30].map(t => (
              <button key={t} style={btnStyle(recoveryTimeout === t)} onClick={() => { setRecoveryTimeout(t); reset() }}>{t}s</button>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={sendRequest}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#1565c0',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
          }}
        >
          Send Request
        </button>
        <button
          onClick={() => { for (let i = 0; i < 10; i++) setTimeout(() => sendRequest(), i * 80) }}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#e65100',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
            fontWeight: 'bold',
          }}
        >
          Burst 10
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#757575',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.95rem',
          }}
        >
          Reset
        </button>
      </div>

      {/* Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total', value: totalRequests, color: '#1565c0', bg: '#e3f2fd' },
          { label: 'Success', value: successCount, color: '#2e7d32', bg: '#e8f5e9' },
          { label: 'Failed', value: failureTotal, color: '#c62828', bg: '#ffebee' },
          { label: 'Blocked', value: blockedCount, color: '#e65100', bg: '#fff3e0' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} style={{ padding: '0.6rem', background: bg, borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 'bold', color }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: '#555' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Event log */}
      <div style={{ padding: '0.8rem', background: '#263238', borderRadius: '8px', maxHeight: '300px', overflowY: 'auto' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
          {logs.length === 0 ? (
            <div style={{ color: '#78909c' }}>Click &quot;Send Request&quot; to start...</div>
          ) : (
            logs.map(log => (
              <div key={log.id} style={{
                color: log.type === 'state-change' ? '#42a5f5'
                  : log.blocked ? '#ff9800'
                  : log.success ? '#66bb6a' : '#ef5350',
                marginBottom: '0.2rem',
                fontWeight: log.type === 'state-change' ? 'bold' : 'normal',
              }}>
                <span style={{ color: '#78909c' }}>[{log.time}]</span>{' '}
                {log.type === 'state-change' ? '>>> ' : ''}{log.message}
              </div>
            ))
          )}
        </div>
      </div>

      {/* How it works */}
      <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff8e1', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #ffe082' }}>
        <strong>Как работает:</strong> запросы проходят через Circuit Breaker. При {threshold} ошибках подряд — переход в Open (запросы блокируются).
        Через {recoveryTimeout}s — переход в Half-Open: один тестовый запрос. Если успех → Closed. Если ошибка → снова Open.
        Попробуйте: поставьте error rate 100%, нажмите несколько раз, дождитесь timeout, смените error rate на 0% и нажмите ещё раз.
      </div>
    </div>
  )
}

// ============================================
// Задание 7.3: SLO / Error Budget калькулятор
// ============================================

type Period = 'day' | 'month' | 'quarter' | 'year'

const PERIOD_MINUTES: Record<Period, number> = {
  day: 24 * 60,
  month: 30 * 24 * 60,
  quarter: 90 * 24 * 60,
  year: 365 * 24 * 60,
}

const PERIOD_LABELS: Record<Period, string> = {
  day: 'День',
  month: 'Месяц (30 дней)',
  quarter: 'Квартал (90 дней)',
  year: 'Год (365 дней)',
}

const SLO_OPTIONS = [99, 99.9, 99.99, 99.999]

function formatDuration(minutes: number): string {
  if (minutes < 1) {
    return `${(minutes * 60).toFixed(1)} сек`
  }
  if (minutes < 60) {
    return `${minutes.toFixed(1)} мин`
  }
  if (minutes < 60 * 24) {
    return `${(minutes / 60).toFixed(2)} часов`
  }
  return `${(minutes / 60 / 24).toFixed(2)} дней`
}

export function Task7_3_Solution() {
  const [slo, setSlo] = useState(99.9)
  const [period, setPeriod] = useState<Period>('month')
  const [rps, setRps] = useState(1000)
  const [currentErrorRate, setCurrentErrorRate] = useState(0.05)

  const totalMinutes = PERIOD_MINUTES[period]
  const errorBudgetPercent = 100 - slo
  const allowedDowntime = totalMinutes * (errorBudgetPercent / 100)
  const totalRequests = rps * totalMinutes * 60
  const errorBudgetRequests = Math.floor(totalRequests * (errorBudgetPercent / 100))
  const burnRate = currentErrorRate / (errorBudgetPercent)
  const timeToExhaust = burnRate > 0 ? totalMinutes / burnRate : Infinity

  const burnColor = burnRate < 1 ? '#2e7d32' : burnRate < 5 ? '#f57f17' : '#c62828'
  const burnBg = burnRate < 1 ? '#e8f5e9' : burnRate < 5 ? '#fff8e1' : '#ffebee'
  const burnLabel = burnRate < 1 ? 'OK — budget lasts the period' : burnRate < 5 ? 'Warning — burning fast' : 'CRITICAL — budget exhausting!'

  const btnStyle = (active: boolean) => ({
    padding: '0.4rem 0.8rem',
    margin: '0 0.2rem',
    border: active ? '2px solid #1565c0' : '1px solid #ccc',
    borderRadius: '4px',
    background: active ? '#e3f2fd' : '#fff',
    cursor: 'pointer' as const,
    fontWeight: active ? 'bold' as const : 'normal' as const,
    fontSize: '0.85rem',
  })

  return (
    <div style={{ padding: '1rem', maxWidth: '850px' }}>
      <h2>SLO / Error Budget Calculator</h2>

      {/* SLO selection */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <strong>SLO:</strong>
          <div style={{ marginTop: '0.3rem' }}>
            {SLO_OPTIONS.map(s => (
              <button key={s} style={btnStyle(slo === s)} onClick={() => setSlo(s)}>{s}%</button>
            ))}
          </div>
        </div>
        <div>
          <strong>Period:</strong>
          <div style={{ marginTop: '0.3rem' }}>
            {(Object.keys(PERIOD_MINUTES) as Period[]).map(p => (
              <button key={p} style={btnStyle(period === p)} onClick={() => setPeriod(p)}>
                {p === 'day' ? 'Day' : p === 'month' ? 'Month' : p === 'quarter' ? 'Quarter' : 'Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem', marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.3rem' }}>Допустимый downtime</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#2e7d32' }}>{formatDuration(allowedDowntime)}</div>
          <div style={{ fontSize: '0.7rem', color: '#777' }}>за {PERIOD_LABELS[period].toLowerCase()}</div>
        </div>
        <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.3rem' }}>Error budget</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1565c0' }}>{errorBudgetPercent}%</div>
          <div style={{ fontSize: '0.7rem', color: '#777' }}>{allowedDowntime.toFixed(1)} мин из {totalMinutes.toLocaleString()}</div>
        </div>
        <div style={{ padding: '1rem', background: '#f3e5f5', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: '#555', marginBottom: '0.3rem' }}>Error budget (запросы)</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#7b1fa2' }}>{errorBudgetRequests.toLocaleString()}</div>
          <div style={{ fontSize: '0.7rem', color: '#777' }}>при {rps.toLocaleString()} RPS</div>
        </div>
      </div>

      {/* RPS input */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Requests per second (RPS): {rps.toLocaleString()}</strong>
          <span style={{ fontSize: '0.8rem', color: '#777' }}>Total requests: {totalRequests.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={10}
          max={100000}
          step={10}
          value={rps}
          onChange={(e) => setRps(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999' }}>
          <span>10</span><span>1K</span><span>10K</span><span>50K</span><span>100K</span>
        </div>
      </div>

      {/* Burn rate */}
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: burnBg, borderRadius: '8px', border: `2px solid ${burnColor}33` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <strong>Current Error Rate: {currentErrorRate}%</strong>
          <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: burnColor }}>{burnLabel}</span>
        </div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={currentErrorRate}
          onChange={(e) => setCurrentErrorRate(Number(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#999', marginBottom: '0.5rem' }}>
          <span>0%</span><span>0.25%</span><span>0.5%</span><span>0.75%</span><span>1%</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '0.5rem' }}>
          <div style={{ padding: '0.6rem', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#555' }}>Burn Rate</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: burnColor }}>{burnRate.toFixed(2)}x</div>
          </div>
          <div style={{ padding: '0.6rem', background: '#fff', borderRadius: '6px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#555' }}>Budget exhausted in</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: burnColor }}>
              {burnRate === 0 ? '∞' : formatDuration(timeToExhaust)}
            </div>
          </div>
        </div>

        {/* Burn rate bar */}
        <div style={{ marginTop: '0.8rem' }}>
          <div style={{ width: '100%', height: '20px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden', position: 'relative' as const }}>
            <div
              style={{
                width: `${Math.min(100, burnRate * 10)}%`,
                height: '100%',
                background: burnColor,
                transition: 'width 0.3s, background 0.3s',
                borderRadius: '4px',
              }}
            />
            {/* Threshold marker at burn rate = 1 */}
            <div style={{
              position: 'absolute' as const,
              left: '10%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#333',
            }} />
          </div>
          <div style={{ display: 'flex', fontSize: '0.7rem', color: '#777', marginTop: '0.2rem' }}>
            <span style={{ flex: 1 }}>0</span>
            <span style={{ position: 'relative' as const, left: '-5%' }}>1x</span>
            <span style={{ flex: 1, textAlign: 'center' as const }}>5x</span>
            <span style={{ textAlign: 'right' as const }}>10x</span>
          </div>
        </div>
      </div>

      {/* Comparison table */}
      <h3>Сравнительная таблица SLO</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>SLO</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Error Budget</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Downtime ({PERIOD_LABELS[period]})</th>
            <th style={{ padding: '0.6rem', border: '1px solid #ddd' }}>Error Requests (при {rps} RPS)</th>
          </tr>
        </thead>
        <tbody>
          {SLO_OPTIONS.map((s, i) => {
            const eb = 100 - s
            const dt = totalMinutes * (eb / 100)
            const er = Math.floor(rps * totalMinutes * 60 * (eb / 100))
            const isActive = s === slo
            return (
              <tr key={s} style={{ background: isActive ? '#e3f2fd' : i % 2 === 0 ? '#fff' : '#fafafa', fontWeight: isActive ? 'bold' : 'normal' }}>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{s}%</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{eb}%</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{formatDuration(dt)}</td>
                <td style={{ padding: '0.5rem', border: '1px solid #ddd', textAlign: 'center' }}>{er.toLocaleString()}</td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff8e1', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #ffe082' }}>
        <strong>Каждая &laquo;девятка&raquo; = 10x сложности.</strong> Переход с 99.9% на 99.99% — это не &laquo;ещё чуть-чуть&raquo;,
        а 10x меньше допустимого downtime. Это требует redundancy, автоматический failover, chaos engineering и значительных инвестиций.
      </div>
    </div>
  )
}

// ============================================
// Задание 7.4: Стратегия надёжности для платёжного сервиса
// ============================================

interface ProviderConfig {
  name: string
  retries: number
  backoff: string
  cbThreshold: number
  cbTimeout: number
  timeout: number
  retryableErrors: string
  fallback: string
}

const CORRECT_CONFIG: Record<string, ProviderConfig> = {
  stripe: {
    name: 'Stripe',
    retries: 3,
    backoff: 'exponential',
    cbThreshold: 5,
    cbTimeout: 30,
    timeout: 3,
    retryableErrors: 'timeout, 503, 502',
    fallback: 'PayPal',
  },
  paypal: {
    name: 'PayPal',
    retries: 2,
    backoff: 'exponential',
    cbThreshold: 3,
    cbTimeout: 60,
    timeout: 5,
    retryableErrors: 'timeout, 503',
    fallback: 'Internal / Queue',
  },
  internal: {
    name: 'Internal',
    retries: 2,
    backoff: 'linear',
    cbThreshold: 5,
    cbTimeout: 15,
    timeout: 1,
    retryableErrors: 'timeout, 503',
    fallback: 'Queue / Reject',
  },
}

interface UserAnswers {
  stripe: Partial<ProviderConfig>
  paypal: Partial<ProviderConfig>
  internal: Partial<ProviderConfig>
}

export function Task7_4_Solution() {
  const [answers, setAnswers] = useState<UserAnswers>({
    stripe: {},
    paypal: {},
    internal: {},
  })
  const [showSolution, setShowSolution] = useState(false)
  const [checked, setChecked] = useState(false)

  const updateAnswer = (provider: keyof UserAnswers, field: string, value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [provider]: { ...prev[provider], [field]: value },
    }))
    setChecked(false)
  }

  const providers: Array<{ key: keyof UserAnswers, name: string, desc: string, color: string, latency: string, uptime: string }> = [
    { key: 'stripe', name: 'Stripe', desc: 'Основной, быстрый', color: '#635bff', latency: 'p99 = 200ms', uptime: '99.99%' },
    { key: 'paypal', name: 'PayPal', desc: 'Резервный, медленнее', color: '#003087', latency: 'p99 = 500ms', uptime: '99.95%' },
    { key: 'internal', name: 'Internal', desc: 'Внутренний, мелкие суммы', color: '#2e7d32', latency: 'p99 = 50ms', uptime: '99.9%' },
  ]

  const selectStyle = {
    padding: '0.3rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem',
    width: '100%',
  }

  const inputStyle = {
    padding: '0.3rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '0.8rem',
    width: '100%',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{ padding: '1rem', maxWidth: '900px' }}>
      <h2>Reliability Strategy: Payment Service</h2>

      <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
        Платёжный сервис зависит от 3 провайдеров. Настройте стратегию надёжности для каждого:
        retry policy, circuit breaker, timeout и fallback.
      </p>

      {/* Provider cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {providers.map(({ name, desc, color, latency, uptime }) => (
          <div key={name} style={{ padding: '0.8rem', background: `${color}11`, borderRadius: '8px', borderLeft: `4px solid ${color}` }}>
            <div style={{ fontWeight: 'bold', color }}>{name}</div>
            <div style={{ fontSize: '0.8rem', color: '#555' }}>{desc}</div>
            <div style={{ fontSize: '0.75rem', color: '#777', marginTop: '0.3rem' }}>{latency} | {uptime}</div>
          </div>
        ))}
      </div>

      {/* Configuration table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', marginBottom: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: '0.5rem', border: '1px solid #ddd', width: '18%' }}>Параметр</th>
            {providers.map(({ name, color }) => (
              <th key={name} style={{ padding: '0.5rem', border: '1px solid #ddd', color, width: '27%' }}>{name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Retries */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>Retries</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].retries ?? ''}
                  onChange={(e) => updateAnswer(key, 'retries', Number(e.target.value))}
                >
                  <option value="">-- select --</option>
                  {[0, 1, 2, 3, 5].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
            ))}
          </tr>
          {/* Backoff */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>Backoff</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].backoff ?? ''}
                  onChange={(e) => updateAnswer(key, 'backoff', e.target.value)}
                >
                  <option value="">-- select --</option>
                  {['none', 'linear', 'exponential'].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
            ))}
          </tr>
          {/* CB Threshold */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>CB Threshold</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].cbThreshold ?? ''}
                  onChange={(e) => updateAnswer(key, 'cbThreshold', Number(e.target.value))}
                >
                  <option value="">-- select --</option>
                  {[3, 5, 10, 20].map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </td>
            ))}
          </tr>
          {/* CB Timeout */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>CB Timeout (s)</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].cbTimeout ?? ''}
                  onChange={(e) => updateAnswer(key, 'cbTimeout', Number(e.target.value))}
                >
                  <option value="">-- select --</option>
                  {[5, 15, 30, 60, 120].map(v => <option key={v} value={v}>{v}s</option>)}
                </select>
              </td>
            ))}
          </tr>
          {/* Timeout */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>Timeout (s)</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].timeout ?? ''}
                  onChange={(e) => updateAnswer(key, 'timeout', Number(e.target.value))}
                >
                  <option value="">-- select --</option>
                  {[0.5, 1, 2, 3, 5, 10].map(v => <option key={v} value={v}>{v}s</option>)}
                </select>
              </td>
            ))}
          </tr>
          {/* Fallback */}
          <tr>
            <td style={{ padding: '0.5rem', border: '1px solid #ddd', fontWeight: 'bold' }}>Fallback</td>
            {providers.map(({ key }) => (
              <td key={key} style={{ padding: '0.4rem', border: '1px solid #ddd' }}>
                <select
                  style={selectStyle}
                  value={answers[key].fallback ?? ''}
                  onChange={(e) => updateAnswer(key, 'fallback', e.target.value)}
                >
                  <option value="">-- select --</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Internal / Queue">Internal / Queue</option>
                  <option value="Queue / Reject">Queue / Reject</option>
                  <option value="Reject">Reject</option>
                </select>
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setChecked(true)}
          style={{
            padding: '0.6rem 1.5rem',
            background: '#1565c0',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '0.9rem',
          }}
        >
          Check Answers
        </button>
        <button
          onClick={() => setShowSolution(!showSolution)}
          style={{
            padding: '0.6rem 1.5rem',
            background: showSolution ? '#e65100' : '#757575',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
        >
          {showSolution ? 'Hide Solution' : 'Show Solution'}
        </button>
      </div>

      {/* Feedback */}
      {checked && (
        <div style={{ marginBottom: '1rem' }}>
          {providers.map(({ key, name }) => {
            const correct = CORRECT_CONFIG[key]
            const user = answers[key]
            const fields = ['retries', 'backoff', 'cbThreshold', 'cbTimeout', 'timeout', 'fallback'] as const
            const correctCount = fields.filter(f => {
              const u = user[f as keyof ProviderConfig]
              const c = correct[f as keyof ProviderConfig]
              return String(u) === String(c)
            }).length
            const total = fields.length
            const pct = Math.round((correctCount / total) * 100)
            const color = pct >= 80 ? '#2e7d32' : pct >= 50 ? '#f57f17' : '#c62828'
            const bg = pct >= 80 ? '#e8f5e9' : pct >= 50 ? '#fff8e1' : '#ffebee'

            return (
              <div key={key} style={{ padding: '0.5rem 0.8rem', background: bg, borderRadius: '6px', marginBottom: '0.3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{name}</span>
                <span style={{ color, fontWeight: 'bold' }}>{correctCount}/{total} ({pct}%)</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Solution */}
      {showSolution && (
        <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ margin: '0 0 0.8rem' }}>Reference Solution</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: '#e0e0e0' }}>
                <th style={{ padding: '0.5rem', border: '1px solid #ccc' }}>Параметр</th>
                {providers.map(({ name, color }) => (
                  <th key={name} style={{ padding: '0.5rem', border: '1px solid #ccc', color }}>{name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Retries', field: 'retries' },
                { label: 'Backoff', field: 'backoff' },
                { label: 'CB Threshold', field: 'cbThreshold' },
                { label: 'CB Timeout', field: 'cbTimeout' },
                { label: 'Timeout', field: 'timeout' },
                { label: 'Retryable Errors', field: 'retryableErrors' },
                { label: 'Fallback', field: 'fallback' },
              ].map(({ label, field }) => (
                <tr key={field}>
                  <td style={{ padding: '0.5rem', border: '1px solid #ccc', fontWeight: 'bold' }}>{label}</td>
                  {providers.map(({ key }) => (
                    <td key={key} style={{ padding: '0.5rem', border: '1px solid #ccc', textAlign: 'center' }}>
                      {String(CORRECT_CONFIG[key][field as keyof ProviderConfig])}
                      {field === 'cbTimeout' || field === 'timeout' ? 's' : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Failover chain */}
          <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 0.5rem' }}>Failover Chain</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
              <span style={{ padding: '0.3rem 0.6rem', background: '#635bff22', borderRadius: '4px', fontWeight: 'bold' }}>Stripe</span>
              <span>→</span>
              <span style={{ padding: '0.3rem 0.6rem', background: '#00308722', borderRadius: '4px', fontWeight: 'bold' }}>PayPal</span>
              <span>→</span>
              <span style={{ padding: '0.3rem 0.6rem', background: '#2e7d3222', borderRadius: '4px', fontWeight: 'bold' }}>Internal</span>
              <span>→</span>
              <span style={{ padding: '0.3rem 0.6rem', background: '#ff980022', borderRadius: '4px', fontWeight: 'bold' }}>Queue</span>
              <span>→</span>
              <span style={{ padding: '0.3rem 0.6rem', background: '#c6282822', borderRadius: '4px', fontWeight: 'bold' }}>Reject</span>
            </div>
          </div>

          {/* Monitoring */}
          <div style={{ marginTop: '1rem', padding: '0.8rem', background: '#fff', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 0.5rem' }}>Monitoring & SLOs</h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '0.3rem', fontWeight: 'bold', width: '30%' }}>SLI</td>
                  <td style={{ padding: '0.3rem' }}>success rate, latency p50/p99, error rate per provider, queue depth</td>
                </tr>
                <tr style={{ background: '#fafafa' }}>
                  <td style={{ padding: '0.3rem', fontWeight: 'bold' }}>SLO</td>
                  <td style={{ padding: '0.3rem' }}>success rate {'>'} 99.95%, latency p99 {'<'} 1s</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.3rem', fontWeight: 'bold' }}>Alert: Warning</td>
                  <td style={{ padding: '0.3rem' }}>burn rate {'>'} 2x (budget exhausted in {'<'} 15 days)</td>
                </tr>
                <tr style={{ background: '#fafafa' }}>
                  <td style={{ padding: '0.3rem', fontWeight: 'bold' }}>Alert: Critical</td>
                  <td style={{ padding: '0.3rem' }}>burn rate {'>'} 5x (budget exhausted in {'<'} 6 days)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision guide */}
      <div style={{ padding: '0.8rem', background: '#fff8e1', borderRadius: '8px', fontSize: '0.85rem', border: '1px solid #ffe082' }}>
        <strong>Принципы конфигурации:</strong>
        <ul style={{ margin: '0.3rem 0 0', paddingLeft: '1.2rem' }}>
          <li>Timeout должен быть больше p99 латency сервиса, но не намного (Stripe p99=200ms → timeout 3s)</li>
          <li>CB timeout для быстрых сервисов — короче (Internal: 15s), для внешних — длиннее (PayPal: 60s)</li>
          <li>Retry только idempotent ошибки: timeout, 502, 503. Никогда 400 (bad request) или 401 (auth)</li>
          <li>Fallback chain: основной → резервный → внутренний → очередь → отказ</li>
        </ul>
      </div>
    </div>
  )
}
