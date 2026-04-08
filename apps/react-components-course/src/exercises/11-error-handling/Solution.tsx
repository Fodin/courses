import React, { useState, useCallback } from 'react'

// ============================================
// Shared: ErrorBoundary class component
// ============================================

interface FallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

interface ErrorBoundaryProps {
  fallback: (props: FallbackProps) => React.ReactNode
  children: React.ReactNode
  onError?: (error: Error, info: React.ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.props.onError?.(error, info)
    console.error('[ErrorBoundary] Caught error:', error.message)
    console.error('[ErrorBoundary] Component stack:', info.componentStack)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({
        error: this.state.error!,
        resetErrorBoundary: this.reset,
      })
    }
    return this.props.children
  }
}

// Shared simple fallback
function SimpleFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ffcdd2',
      borderRadius: '8px',
      background: '#fff5f5',
      minHeight: '80px',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ fontSize: '1.2rem' }}>⚠️</span>
        <strong style={{ color: '#c62828' }}>Виджет недоступен</strong>
      </div>
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        style={{
          alignSelf: 'flex-start',
          padding: '0.35rem 0.9rem',
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.85rem',
        }}
      >
        Восстановить
      </button>
    </div>
  )
}

// ============================================
// Task 11.1 Solution: Basic ErrorBoundary
// ============================================

function StatsWidget() {
  const [broken, setBroken] = useState(false)

  if (broken) throw new Error('StatsWidget: не удалось загрузить статистику')

  return (
    <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <strong>📊 Статистика</strong>
        <button
          onClick={() => setBroken(true)}
          style={{ padding: '0.25rem 0.6rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Сломать
        </button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        {[{ label: 'Пользователи', value: '12 450' }, { label: 'Заказы', value: '3 821' }, { label: 'Выручка', value: '₽ 842k' }, { label: 'Конверсия', value: '3.2%' }].map(s => (
          <div key={s.label} style={{ background: '#fff', padding: '0.5rem', borderRadius: '4px', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#2e7d32' }}>{s.value}</div>
            <div style={{ fontSize: '0.75rem', color: '#666' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChartWidget() {
  const [broken, setBroken] = useState(false)

  if (broken) throw new Error('ChartWidget: данные графика повреждены')

  return (
    <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <strong>📈 График продаж</strong>
        <button
          onClick={() => setBroken(true)}
          style={{ padding: '0.25rem 0.6rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Сломать
        </button>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px', padding: '0 0.5rem' }}>
        {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h}%`, background: '#1976d2', borderRadius: '2px 2px 0 0', opacity: 0.8 }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#888', marginTop: '0.25rem', padding: '0 0.5rem' }}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => <span key={d}>{d}</span>)}
      </div>
    </div>
  )
}

function ActivityWidget() {
  const [broken, setBroken] = useState(false)

  if (broken) throw new Error('ActivityWidget: сервис активности недоступен')

  const activities = [
    { user: 'Алексей К.', action: 'оформил заказ #1042', time: '2 мин назад' },
    { user: 'Марина П.', action: 'зарегистрировалась', time: '8 мин назад' },
    { user: 'Дмитрий В.', action: 'оставил отзыв', time: '15 мин назад' },
  ]

  return (
    <div style={{ padding: '1rem', background: '#fce4ec', borderRadius: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <strong>🔔 Активность</strong>
        <button
          onClick={() => setBroken(true)}
          style={{ padding: '0.25rem 0.6rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
        >
          Сломать
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {activities.map((a, i) => (
          <div key={i} style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span><strong>{a.user}</strong> {a.action}</span>
            <span style={{ color: '#888', whiteSpace: 'nowrap' }}>{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Task11_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>11.1 — Базовый ErrorBoundary</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        Каждый виджет обёрнут в отдельный <code>ErrorBoundary</code>. Нажмите «Сломать» в любом — остальные продолжат работать.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
        <div>
          <ErrorBoundary fallback={(props) => <SimpleFallback {...props} />}>
            <StatsWidget />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary fallback={(props) => <SimpleFallback {...props} />}>
            <ChartWidget />
          </ErrorBoundary>
        </div>
        <div>
          <ErrorBoundary fallback={(props) => <SimpleFallback {...props} />}>
            <ActivityWidget />
          </ErrorBoundary>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#555' }}>
        💡 <strong>Как это работает:</strong> каждый <code>ErrorBoundary</code> перехватывает ошибки только в своём поддереве. Падение одного виджета не затрагивает соседей.
      </div>
    </div>
  )
}

// ============================================
// Task 11.2 Solution: Granular boundaries + retry
// ============================================

interface RetryFallbackProps extends FallbackProps {
  maxRetries: number
  widgetName: string
}

function RetryFallback({ error, resetErrorBoundary, maxRetries, widgetName }: RetryFallbackProps) {
  const [retries, setRetries] = useState(0)
  const exhausted = retries >= maxRetries

  const handleRetry = () => {
    setRetries(r => r + 1)
    resetErrorBoundary()
  }

  return (
    <div style={{
      padding: '1rem',
      border: '1px solid #ffcdd2',
      borderRadius: '8px',
      background: '#fff5f5',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>⚠️</span>
        <strong style={{ color: '#c62828' }}>{widgetName}</strong>
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#555' }}>{error.message}</p>
      {!exhausted ? (
        <>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Попытка {retries} из {maxRetries}</p>
          <button
            onClick={handleRetry}
            style={{ alignSelf: 'flex-start', padding: '0.3rem 0.8rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Повторить
          </button>
        </>
      ) : (
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#b71c1c', fontWeight: 500 }}>
          Виджет недоступен. Обратитесь в поддержку.
        </p>
      )}
    </div>
  )
}

function makeWidget(name: string, icon: string, bgColor: string, content: React.ReactNode) {
  return function Widget() {
    const [broken, setBroken] = useState(false)

    if (broken) throw new Error(`${name}: сервис временно недоступен`)

    return (
      <div style={{ padding: '1rem', background: bgColor, borderRadius: '8px', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <strong>{icon} {name}</strong>
          <button
            onClick={() => setBroken(true)}
            style={{ padding: '0.25rem 0.6rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Сломать
          </button>
        </div>
        {content}
      </div>
    )
  }
}

const WeatherWidget = makeWidget('Погода', '🌤️', '#e8f5e9', (
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem' }}>+18°C</div>
    <div style={{ color: '#555', fontSize: '0.85rem' }}>Москва, облачно</div>
  </div>
))

const NewsWidget = makeWidget('Новости', '📰', '#e3f2fd', (
  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' }}>
    {['React 19 вышел в стабильный релиз', 'TypeScript 5.5: новые возможности', 'Node.js 22 — что нового'].map(title => (
      <div key={title} style={{ fontSize: '0.82rem', padding: '0.3rem 0', borderBottom: '1px solid #bbdefb' }}>{title}</div>
    ))}
  </div>
))

const StockWidget = makeWidget('Акции', '📉', '#fff8e1', (
  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' }}>
    {[{ sym: 'AAPL', val: '182.50', chg: '+1.2%', up: true }, { sym: 'GOOGL', val: '141.20', chg: '-0.5%', up: false }, { sym: 'MSFT', val: '378.90', chg: '+0.8%', up: true }].map(s => (
      <div key={s.sym} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
        <span><strong>{s.sym}</strong></span>
        <span>{s.val}</span>
        <span style={{ color: s.up ? '#2e7d32' : '#c62828' }}>{s.chg}</span>
      </div>
    ))}
  </div>
))

const CalendarWidget = makeWidget('Календарь', '📅', '#fce4ec', (
  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '0.4rem' }}>
    {[{ time: '10:00', event: 'Стендап команды' }, { time: '14:00', event: 'Ревью PR #245' }, { time: '16:30', event: 'Встреча с заказчиком' }].map(e => (
      <div key={e.time} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.82rem' }}>
        <span style={{ color: '#888', minWidth: '40px' }}>{e.time}</span>
        <span>{e.event}</span>
      </div>
    ))}
  </div>
))

export function Task11_2_Solution() {
  const [globalKey, setGlobalKey] = useState(0)

  const widgets = [
    { name: 'Погода', Component: WeatherWidget },
    { name: 'Новости', Component: NewsWidget },
    { name: 'Акции', Component: StockWidget },
    { name: 'Календарь', Component: CalendarWidget },
  ]

  return (
    <div className="exercise-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0 }}>11.2 — Гранулярные boundaries + Retry</h2>
        <button
          onClick={() => setGlobalKey(k => k + 1)}
          style={{ padding: '0.4rem 1rem', background: '#43a047', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Перезагрузить все
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {widgets.map(({ name, Component }) => (
          <ErrorBoundary
            key={`${name}-${globalKey}`}
            fallback={(props) => (
              <RetryFallback {...props} maxRetries={3} widgetName={name} />
            )}
          >
            <Component />
          </ErrorBoundary>
        ))}
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#f3f4f6', borderRadius: '6px', fontSize: '0.85rem', color: '#555' }}>
        💡 «Перезагрузить все» меняет <code>key</code> на каждом boundary — React пересоздаёт их вместе со счётчиками попыток.
      </div>
    </div>
  )
}

// ============================================
// Task 11.3 Solution: useErrorHandler for async errors
// ============================================

function useErrorHandler() {
  const [, setState] = useState<null>(null)

  return useCallback((error: Error) => {
    // Функция-обновитель вызывается React в фазе reconciliation.
    // Ошибка, брошенная здесь, попадает в фазу рендеринга
    // и перехватывается ближайшим Error Boundary.
    setState(() => {
      throw error
    })
  }, [])
}

function AsyncDataWidget() {
  const handleError = useErrorHandler()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<string | null>(null)
  const [mode, setMode] = useState<'success' | 'error'>('success')

  const loadData = async () => {
    setLoading(true)
    setData(null)

    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 1200))

      if (mode === 'error') {
        throw new Error('AsyncDataWidget: сервер вернул 500 Internal Server Error')
      }

      setData('Данные успешно загружены: { users: 142, active: 98, revenue: "₽312k" }')
    } catch (err) {
      if (mode === 'error') {
        handleError(err instanceof Error ? err : new Error(String(err)))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
      <strong style={{ display: 'block', marginBottom: '0.75rem' }}>📡 Async Data Widget</strong>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' as const }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <input
            type="radio"
            name="mode"
            checked={mode === 'success'}
            onChange={() => setMode('success')}
          />
          Режим: успех
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <input
            type="radio"
            name="mode"
            checked={mode === 'error'}
            onChange={() => setMode('error')}
          />
          Режим: ошибка
        </label>
        <button
          onClick={loadData}
          disabled={loading}
          style={{ padding: '0.35rem 0.8rem', background: loading ? '#aaa' : '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', cursor: loading ? 'default' : 'pointer', fontSize: '0.85rem' }}
        >
          {loading ? 'Загрузка...' : 'Загрузить данные'}
        </button>
      </div>

      {data && (
        <div style={{ padding: '0.5rem', background: '#fff', borderRadius: '4px', fontSize: '0.82rem', fontFamily: 'monospace', color: '#333' }}>
          {data}
        </div>
      )}
      {!data && !loading && (
        <div style={{ color: '#888', fontSize: '0.85rem' }}>Нажмите кнопку для загрузки</div>
      )}
    </div>
  )
}

function EventErrorWidget() {
  const handleError = useErrorHandler()

  return (
    <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>
      <strong style={{ display: 'block', marginBottom: '0.75rem' }}>🖱️ Event Error Widget</strong>
      <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 0.75rem' }}>
        Ошибка из обработчика <code>onClick</code> пробрасывается в boundary через <code>useErrorHandler</code>
      </p>
      <button
        onClick={() => handleError(new Error('EventErrorWidget: ошибка в обработчике события onClick'))}
        style={{ padding: '0.35rem 0.9rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        Выполнить действие (вызовет ошибку)
      </button>
    </div>
  )
}

function HowItWorksNote() {
  return (
    <div style={{ padding: '1rem', background: '#fff8e1', borderRadius: '8px', border: '1px solid #ffe082' }}>
      <strong style={{ display: 'block', marginBottom: '0.5rem' }}>💡 Как работает useErrorHandler?</strong>
      <p style={{ fontSize: '0.85rem', color: '#555', margin: '0 0 0.5rem', lineHeight: 1.6 }}>
        Функция-обновитель <code>setState(updater)</code> вызывается React во время фазы reconciliation — то есть в фазе рендеринга. Если эта функция бросает исключение, React воспринимает его как ошибку рендеринга и передаёт в ближайший Error Boundary.
      </p>
      <pre style={{ fontSize: '0.8rem', background: '#fff', padding: '0.75rem', borderRadius: '4px', overflow: 'auto', margin: 0 }}>
{`function useErrorHandler() {
  const [, setState] = useState(null)
  return (error: Error) => {
    setState(() => { throw error }) // <- магия здесь
  }
}`}
      </pre>
    </div>
  )
}

export function Task11_3_Solution() {
  const [asyncKey, setAsyncKey] = useState(0)
  const [eventKey, setEventKey] = useState(0)

  return (
    <div className="exercise-container">
      <h2>11.3 — useErrorHandler для async-ошибок</h2>
      <p style={{ color: '#555', marginBottom: '1rem' }}>
        <code>useErrorHandler</code> позволяет пробрасывать async-ошибки и ошибки из event-хендлеров в ближайший Error Boundary.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <ErrorBoundary
          key={asyncKey}
          fallback={({ error, resetErrorBoundary }) => (
            <SimpleFallback
              error={error}
              resetErrorBoundary={() => { resetErrorBoundary(); setAsyncKey(k => k + 1) }}
            />
          )}
        >
          <AsyncDataWidget />
        </ErrorBoundary>

        <ErrorBoundary
          key={eventKey}
          fallback={({ error, resetErrorBoundary }) => (
            <SimpleFallback
              error={error}
              resetErrorBoundary={() => { resetErrorBoundary(); setEventKey(k => k + 1) }}
            />
          )}
        >
          <EventErrorWidget />
        </ErrorBoundary>
      </div>

      <HowItWorksNote />
    </div>
  )
}
