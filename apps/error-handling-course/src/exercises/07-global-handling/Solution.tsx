import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from 'react'

// ============================================
// Задание 7.1: window.onerror — Решение
// ============================================

export function Task7_1_Solution() {
  const [events, setEvents] = useState<string[]>([])

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setEvents((prev) => [
        ...prev,
        `[onerror] ${event.message} (${event.filename}:${event.lineno})`,
      ])
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      setEvents((prev) => [
        ...prev,
        `[unhandledrejection] ${event.reason instanceof Error ? event.reason.message : event.reason}`,
      ])
      event.preventDefault()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const triggerError = () => {
    setTimeout(() => {
      throw new Error('Ошибка в setTimeout (глобальная)')
    }, 0)
  }

  const triggerRejection = () => {
    Promise.reject(new Error('Необработанный промис'))
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: window.onerror</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={triggerError}>Глобальная ошибка</button>
        <button onClick={triggerRejection}>Unhandled rejection</button>
        <button onClick={() => setEvents([])}>Очистить</button>
      </div>

      {events.length > 0 && (
        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
          <h4>Перехваченные события:</h4>
          {events.map((e, i) => (
            <p key={i} style={{ fontFamily: 'monospace', margin: '0.25rem 0', fontSize: '0.85rem' }}>{e}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.2: Сервис логирования — Решение
// ============================================

interface LogEntry {
  level: 'error' | 'warn' | 'info'
  message: string
  timestamp: Date
  context?: Record<string, unknown>
  stack?: string
}

class ErrorLogger {
  private logs: LogEntry[] = []
  private listeners: ((logs: LogEntry[]) => void)[] = []

  error(message: string, error?: Error, context?: Record<string, unknown>) {
    this.addLog({ level: 'error', message, timestamp: new Date(), context, stack: error?.stack })
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.addLog({ level: 'warn', message, timestamp: new Date(), context })
  }

  info(message: string, context?: Record<string, unknown>) {
    this.addLog({ level: 'info', message, timestamp: new Date(), context })
  }

  private addLog(entry: LogEntry) {
    this.logs = [...this.logs, entry]
    this.listeners.forEach((fn) => fn(this.logs))
  }

  subscribe(fn: (logs: LogEntry[]) => void) {
    this.listeners.push(fn)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn)
    }
  }

  getLogs() {
    return this.logs
  }

  clear() {
    this.logs = []
    this.listeners.forEach((fn) => fn(this.logs))
  }
}

const logger = new ErrorLogger()

export function Task7_2_Solution() {
  const [logs, setLogs] = useState<LogEntry[]>([])

  useEffect(() => {
    return logger.subscribe(setLogs)
  }, [])

  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Сервис логирования</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => logger.error('Ошибка загрузки', new Error('fetch failed'), { url: '/api/users' })}>
          Log error
        </button>
        <button onClick={() => logger.warn('Медленный запрос', { duration: '3.5s' })}>
          Log warn
        </button>
        <button onClick={() => logger.info('Пользователь вошёл', { userId: '123' })}>
          Log info
        </button>
        <button onClick={() => logger.clear()}>Очистить</button>
      </div>

      {logs.length > 0 && (
        <div style={{ maxHeight: '300px', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Level</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Message</th>
                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Context</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i} style={{ background: log.level === 'error' ? '#ffebee' : log.level === 'warn' ? '#fff3e0' : '#f5f5f5' }}>
                  <td style={{ padding: '0.5rem' }}>{log.level === 'error' ? '🔴' : log.level === 'warn' ? '🟡' : '🔵'} {log.level}</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{log.timestamp.toLocaleTimeString()}</td>
                  <td style={{ padding: '0.5rem' }}>{log.message}</td>
                  <td style={{ padding: '0.5rem', fontFamily: 'monospace' }}>{log.context ? JSON.stringify(log.context) : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 7.3: React Error Context — Решение
// ============================================

interface ErrorContextValue {
  errors: Array<{ id: number; message: string; severity: 'error' | 'warning' }>
  addError: (message: string, severity?: 'error' | 'warning') => void
  removeError: (id: number) => void
  clearErrors: () => void
}

const ErrorContext = createContext<ErrorContextValue | null>(null)

let errorId = 0

function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<ErrorContextValue['errors']>([])

  const addError = useCallback((message: string, severity: 'error' | 'warning' = 'error') => {
    const id = ++errorId
    setErrors((prev) => [...prev, { id, message, severity }])
    if (severity === 'warning') {
      setTimeout(() => setErrors((prev) => prev.filter((e) => e.id !== id)), 5000)
    }
  }, [])

  const removeError = useCallback((id: number) => {
    setErrors((prev) => prev.filter((e) => e.id !== id))
  }, [])

  const clearErrors = useCallback(() => setErrors([]), [])

  return (
    <ErrorContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </ErrorContext.Provider>
  )
}

function useErrorContext() {
  const ctx = useContext(ErrorContext)
  if (!ctx) throw new Error('useErrorContext must be used within ErrorProvider')
  return ctx
}

function ErrorDisplay() {
  const { errors, removeError, clearErrors } = useErrorContext()

  if (errors.length === 0) return null

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, marginBottom: '1rem' }}>
      {errors.map((e) => (
        <div
          key={e.id}
          role="alert"
          style={{
            padding: '0.75rem 1rem',
            background: e.severity === 'error' ? '#ffebee' : '#fff3e0',
            border: `1px solid ${e.severity === 'error' ? '#ef5350' : '#ff9800'}`,
            borderRadius: '4px',
            marginBottom: '0.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span>{e.severity === 'error' ? '🔴' : '🟡'} {e.message}</span>
          <button onClick={() => removeError(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      {errors.length > 1 && <button onClick={clearErrors} style={{ marginTop: '0.5rem' }}>Очистить все</button>}
    </div>
  )
}

function DemoComponent() {
  const { addError } = useErrorContext()

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <button onClick={() => addError('Не удалось сохранить данные')}>Ошибка</button>
      <button onClick={() => addError('Соединение нестабильно', 'warning')}>Предупреждение</button>
      <button onClick={() => addError('Сессия истекает через 5 минут', 'warning')}>Warning (auto-dismiss)</button>
    </div>
  )
}

export function Task7_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 7.3: React Error Context</h2>
      <ErrorProvider>
        <ErrorDisplay />
        <DemoComponent />
      </ErrorProvider>
    </div>
  )
}

// ============================================
// Задание 7.4: Мониторинг ошибок — Решение
// ============================================

interface ErrorReport {
  message: string
  stack?: string
  componentStack?: string
  url: string
  timestamp: Date
  userAgent: string
  extra?: Record<string, unknown>
}

class ErrorMonitor {
  private reports: ErrorReport[] = []
  private listeners: ((reports: ErrorReport[]) => void)[] = []

  report(error: Error, extra?: Record<string, unknown>) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      timestamp: new Date(),
      userAgent: navigator.userAgent.substring(0, 50),
      extra,
    }
    this.reports = [...this.reports, report]
    // В реальном приложении: отправить на сервер
    console.log('[ErrorMonitor] Report:', report)
    this.listeners.forEach((fn) => fn(this.reports))
  }

  subscribe(fn: (reports: ErrorReport[]) => void) {
    this.listeners.push(fn)
    return () => { this.listeners = this.listeners.filter((l) => l !== fn) }
  }

  getReports() { return this.reports }
  clear() { this.reports = []; this.listeners.forEach((fn) => fn([])) }
}

const monitor = new ErrorMonitor()

export function Task7_4_Solution() {
  const [reports, setReports] = useState<ErrorReport[]>([])

  useEffect(() => {
    return monitor.subscribe(setReports)
  }, [])

  const simulateErrors = () => {
    try {
      JSON.parse('{invalid}')
    } catch (e) {
      if (e instanceof Error) monitor.report(e, { source: 'JSON.parse' })
    }

    monitor.report(new Error('API timeout'), { endpoint: '/api/users', timeout: 5000 })
    monitor.report(new Error('Render failed'), { component: 'UserProfile', props: { id: 42 } })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 7.4: Мониторинг ошибок</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={simulateErrors}>Симулировать ошибки</button>
        <button onClick={() => monitor.clear()}>Очистить</button>
      </div>

      {reports.length > 0 && (
        <div>
          <h4>Отчёты ({reports.length}):</h4>
          {reports.map((r, i) => (
            <div key={i} style={{ padding: '0.75rem', background: '#ffebee', borderRadius: '4px', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
              <strong>{r.message}</strong>
              <p style={{ margin: '0.25rem 0', color: '#666' }}>{r.timestamp.toLocaleTimeString()} | {r.url}</p>
              {r.extra && <pre style={{ margin: '0.25rem 0', fontSize: '0.8rem' }}>{JSON.stringify(r.extra, null, 2)}</pre>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
