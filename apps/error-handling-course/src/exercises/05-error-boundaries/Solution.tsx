import { Component, useState, type ErrorInfo, type ReactNode } from 'react'

// ============================================
// Задание 5.1: Базовый Error Boundary — Решение
// ============================================

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class BasicErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary поймал ошибку:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', border: '1px solid #ef5350' }}>
          <h3>Что-то пошло не так</h3>
          <p style={{ fontFamily: 'monospace', color: '#c62828' }}>
            {this.state.error?.message}
          </p>
        </div>
      )
    }
    return this.props.children
  }
}

function BuggyCounter() {
  const [count, setCount] = useState(0)

  if (count === 3) {
    throw new Error('Счётчик достиг 3! Компонент упал.')
  }

  return (
    <div>
      <p>Счётчик: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>+1 (упадёт на 3)</button>
    </div>
  )
}

export function Task5_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.1: Базовый Error Boundary</h2>

      <h3>Без Error Boundary компонент обрушит всё приложение.</h3>
      <h3>С Error Boundary:</h3>
      <BasicErrorBoundary>
        <BuggyCounter />
      </BasicErrorBoundary>
    </div>
  )
}

// ============================================
// Задание 5.2: Fallback UI — Решение
// ============================================

interface FallbackProps {
  error: Error
  errorInfo?: ErrorInfo
}

function ErrorFallback({ error }: FallbackProps) {
  return (
    <div
      style={{
        padding: '2rem',
        background: 'linear-gradient(135deg, #fff3e0, #ffebee)',
        borderRadius: '12px',
        border: '2px solid #ff9800',
        textAlign: 'center',
      }}
    >
      <h2 style={{ color: '#e65100' }}>Упс! Произошла ошибка</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Компонент не смог корректно отрисоваться
      </p>
      <details style={{ textAlign: 'left', marginTop: '1rem' }}>
        <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Подробности</summary>
        <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto', fontSize: '0.85rem' }}>
          {error.message}
          {'\n\n'}
          {error.stack}
        </pre>
      </details>
    </div>
  )
}

class FallbackErrorBoundary extends Component<
  { children: ReactNode; fallback?: (props: FallbackProps) => ReactNode },
  ErrorBoundaryState & { errorInfo: ErrorInfo | null }
> {
  constructor(props: { children: ReactNode; fallback?: (props: FallbackProps) => ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    console.error('Error Boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, errorInfo: this.state.errorInfo ?? undefined })
      }
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}

function BuggyProfile() {
  const data: { user?: { name: string } } = {}
  // Намеренная ошибка
  return <p>Профиль: {data.user!.name}</p>
}

export function Task5_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.2: Fallback UI</h2>

      <h3>Стандартный fallback:</h3>
      <FallbackErrorBoundary>
        <BuggyProfile />
      </FallbackErrorBoundary>

      <h3 style={{ marginTop: '2rem' }}>Кастомный fallback:</h3>
      <FallbackErrorBoundary
        fallback={({ error }) => (
          <div style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px', border: '1px solid #2196f3' }}>
            <p>Профиль временно недоступен.</p>
            <small style={{ color: '#666' }}>Причина: {error.message}</small>
          </div>
        )}
      >
        <BuggyProfile />
      </FallbackErrorBoundary>
    </div>
  )
}

// ============================================
// Задание 5.3: Восстановление после ошибки — Решение
// ============================================

class RecoverableErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState & { resetKey: number }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null, resetKey: 0 }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Recoverable boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, resetKey: this.state.resetKey + 1 })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1.5rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ff9800' }}>
          <h3>Ошибка компонента</h3>
          <p style={{ fontFamily: 'monospace', color: '#e65100' }}>
            {this.state.error?.message}
          </p>
          <button
            onClick={this.handleReset}
            style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Попробовать снова
          </button>
        </div>
      )
    }
    return <div key={this.state.resetKey}>{this.props.children}</div>
  }
}

function RandomFailure() {
  const shouldFail = Math.random() < 0.5
  if (shouldFail) {
    throw new Error('Случайная ошибка рендера (50% шанс)')
  }
  return (
    <div style={{ padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>
      Компонент отрисован успешно!
    </div>
  )
}

export function Task5_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.3: Восстановление после ошибки</h2>
      <p>Компонент падает с 50% вероятностью. Нажмите "Попробовать снова".</p>
      <RecoverableErrorBoundary>
        <RandomFailure />
      </RecoverableErrorBoundary>
    </div>
  )
}

// ============================================
// Задание 5.4: Вложенные Boundaries — Решение
// ============================================

function BuggySidebar(): JSX.Element {
  throw new Error('Sidebar: Ошибка загрузки виджетов')
}

function BuggyContent() {
  const [shouldFail, setShouldFail] = useState(false)
  if (shouldFail) throw new Error('Content: Ошибка рендера контента')
  return (
    <div>
      <p>Основной контент работает нормально</p>
      <button onClick={() => setShouldFail(true)}>Сломать контент</button>
    </div>
  )
}

function SafeHeader() {
  return <h3 style={{ padding: '1rem', background: '#e3f2fd', borderRadius: '8px' }}>Шапка (всегда работает)</h3>
}

export function Task5_4_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 5.4: Вложенные Boundaries</h2>
      <p>Каждая секция изолирована — ошибка в одной не ломает другие.</p>

      <RecoverableErrorBoundary>
        <SafeHeader />
      </RecoverableErrorBoundary>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '1rem', marginTop: '1rem' }}>
        <RecoverableErrorBoundary>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4>Контент</h4>
            <BuggyContent />
          </div>
        </RecoverableErrorBoundary>

        <RecoverableErrorBoundary>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h4>Сайдбар</h4>
            <BuggySidebar />
          </div>
        </RecoverableErrorBoundary>
      </div>
    </div>
  )
}
