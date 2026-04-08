import { useState, useEffect, useContext, createContext, useMemo, type ReactNode } from 'react'
import React from 'react'

// ============================================
// Shared: Spinner
// ============================================

function Spinner({ label = 'Загрузка...' }: { label?: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '0.75rem',
      padding: '1.5rem', color: '#64748b', fontSize: '0.95rem',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        <circle cx="12" cy="12" r="10" stroke="#e2e8f0" strokeWidth="3" fill="none" />
        <path d="M12 2a10 10 0 0 1 10 10" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      {label}
    </div>
  )
}

// ============================================
// Task 4.1 Solution: withLoading HOC
// ============================================

// Generic HOC: принимает компонент с пропсами P,
// возвращает компонент с P + { isLoading: boolean }
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
    if (isLoading) return <Spinner />
    return <Component {...(props as P)} />
  }
  WithLoading.displayName = `withLoading(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithLoading
}

// Компоненты для демонстрации

interface UserCardProps {
  name: string
  role: string
  avatar: string
}

function UserCard({ name, role, avatar }: UserCardProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1rem',
      padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0',
    }}>
      <img src={avatar} alt={name} style={{ width: 48, height: 48, borderRadius: '50%' }} />
      <div>
        <div style={{ fontWeight: 600, color: '#1e293b' }}>{name}</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{role}</div>
      </div>
    </div>
  )
}

interface ProductListProps {
  products: Array<{ id: string; name: string; price: number }>
}

function ProductList({ products }: ProductListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {products.map(p => (
        <div key={p.id} style={{
          display: 'flex', justifyContent: 'space-between',
          padding: '0.6rem 0.75rem', background: '#f8fafc',
          borderRadius: '6px', border: '1px solid #e2e8f0',
          fontSize: '0.9rem',
        }}>
          <span style={{ color: '#1e293b' }}>{p.name}</span>
          <span style={{ fontWeight: 600, color: '#3b82f6' }}>{p.price.toLocaleString('ru-RU')} ₽</span>
        </div>
      ))}
    </div>
  )
}

// Оборачиваем оба компонента — HOC создаётся вне рендера!
const UserCardWithLoading = withLoading(UserCard)
const ProductListWithLoading = withLoading(ProductList)

const MOCK_PRODUCTS = [
  { id: '1', name: 'Keychron K2', price: 8990 },
  { id: '2', name: 'Logitech MX Master 3', price: 6490 },
  { id: '3', name: 'Samsung T7 SSD 1TB', price: 9990 },
]

export function Task4_1_Solution() {
  const [loadingUser, setLoadingUser] = useState(false)
  const [loadingProducts, setLoadingProducts] = useState(false)

  const simulateLoad = (setter: (v: boolean) => void) => {
    setter(true)
    setTimeout(() => setter(false), 1500)
  }

  return (
    <div className="exercise-container">
      <h2>Решение 4.1: withLoading HOC</h2>
      <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        HOC <code>withLoading&lt;P&gt;</code> добавляет спиннер к любому компоненту. Типизация через generics сохраняет пропсы оригинала.
      </p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* UserCard с withLoading */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <code style={{ fontSize: '0.8rem', color: '#7c3aed' }}>withLoading(UserCard)</code>
            <button
              onClick={() => simulateLoad(setLoadingUser)}
              disabled={loadingUser}
              style={{
                padding: '0.3rem 0.75rem', fontSize: '0.8rem',
                background: loadingUser ? '#f1f5f9' : '#3b82f6', color: loadingUser ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: '4px', cursor: loadingUser ? 'default' : 'pointer',
              }}
            >
              {loadingUser ? 'Загрузка...' : 'Симулировать загрузку'}
            </button>
          </div>
          <UserCardWithLoading
            isLoading={loadingUser}
            name="Екатерина Смирнова"
            role="Senior Frontend Developer"
            avatar="https://placehold.co/48x48/e8eaf6/3f51b5?text=ES"
          />
        </div>

        {/* ProductList с withLoading */}
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <code style={{ fontSize: '0.8rem', color: '#7c3aed' }}>withLoading(ProductList)</code>
            <button
              onClick={() => simulateLoad(setLoadingProducts)}
              disabled={loadingProducts}
              style={{
                padding: '0.3rem 0.75rem', fontSize: '0.8rem',
                background: loadingProducts ? '#f1f5f9' : '#3b82f6', color: loadingProducts ? '#94a3b8' : '#fff',
                border: 'none', borderRadius: '4px', cursor: loadingProducts ? 'default' : 'pointer',
              }}
            >
              {loadingProducts ? 'Загрузка...' : 'Симулировать загрузку'}
            </button>
          </div>
          <ProductListWithLoading
            isLoading={loadingProducts}
            products={MOCK_PRODUCTS}
          />
        </div>
      </div>

      <div style={{ marginTop: '1.25rem', padding: '0.75rem 1rem', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.85rem', color: '#166534' }}>
        <strong>displayName в DevTools:</strong>{' '}
        <code>{UserCardWithLoading.displayName}</code> и <code>{ProductListWithLoading.displayName}</code>
      </div>
    </div>
  )
}

// ============================================
// Task 4.2 Solution: withAuth HOC + AuthContext
// ============================================

interface AuthUser {
  name: string
  role: 'admin' | 'user'
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (role: 'admin' | 'user') => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
})

function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: user !== null,
    user,
    login: (role) => setUser({ name: role === 'admin' ? 'Администратор' : 'Пользователь', role }),
    logout: () => setUser(null),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Заглушка для неавторизованных
function LoginPrompt() {
  const { login } = useContext(AuthContext)
  return (
    <div style={{
      padding: '1.5rem', textAlign: 'center', background: '#fefce8',
      border: '1px dashed #fbbf24', borderRadius: '8px', color: '#92400e',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔒</div>
      <div style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Необходима авторизация</div>
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => login('user')}
          style={{ padding: '0.4rem 0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Войти как user
        </button>
        <button
          onClick={() => login('admin')}
          style={{ padding: '0.4rem 0.75rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          Войти как admin
        </button>
      </div>
    </div>
  )
}

// Заглушка для недостаточных прав
function AccessDenied() {
  return (
    <div style={{
      padding: '1.5rem', textAlign: 'center', background: '#fef2f2',
      border: '1px dashed #fca5a5', borderRadius: '8px', color: '#991b1b',
    }}>
      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⛔</div>
      <div style={{ fontWeight: 600 }}>Доступ запрещён</div>
      <div style={{ fontSize: '0.85rem', marginTop: '0.25rem', color: '#b91c1c' }}>Недостаточно прав</div>
    </div>
  )
}

interface WithAuthOptions {
  requiredRole?: 'admin' | 'user'
}

function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const WithAuth = (props: P) => {
    const { isAuthenticated, user } = useContext(AuthContext)

    if (!isAuthenticated) return <LoginPrompt />

    if (options.requiredRole && user?.role !== options.requiredRole) {
      return <AccessDenied />
    }

    return <Component {...props} />
  }
  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithAuth
}

// Защищённые компоненты

function Dashboard() {
  const { user, logout } = useContext(AuthContext)
  return (
    <div style={{ padding: '1rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
      <div style={{ fontWeight: 600, color: '#166534', marginBottom: '0.5rem' }}>📊 Dashboard</div>
      <div style={{ fontSize: '0.9rem', color: '#15803d' }}>Добро пожаловать, {user?.name}!</div>
      <div style={{ fontSize: '0.8rem', color: '#4ade80', marginTop: '0.25rem' }}>Роль: {user?.role}</div>
      <button
        onClick={logout}
        style={{ marginTop: '0.75rem', padding: '0.3rem 0.75rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
      >
        Выйти
      </button>
    </div>
  )
}

function AdminPanel() {
  return (
    <div style={{ padding: '1rem', background: '#faf5ff', borderRadius: '8px', border: '1px solid #e9d5ff' }}>
      <div style={{ fontWeight: 600, color: '#6b21a8', marginBottom: '0.5rem' }}>⚙️ Admin Panel</div>
      <div style={{ fontSize: '0.9rem', color: '#7c3aed' }}>Управление системой доступно только администраторам</div>
    </div>
  )
}

const ProtectedDashboard = withAuth(Dashboard)
const ProtectedAdminPanel = withAuth(AdminPanel, { requiredRole: 'admin' })

export function Task4_2_Solution() {
  return (
    <AuthProvider>
      <div className="exercise-container">
        <h2>Решение 4.2: withAuth HOC</h2>
        <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
          HOC читает <code>AuthContext</code>. <code>Dashboard</code> — любой авторизованный. <code>AdminPanel</code> — только admin.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              withAuth(Dashboard)
            </div>
            <ProtectedDashboard />
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.5rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              withAuth(AdminPanel, &#123; requiredRole: 'admin' &#125;)
            </div>
            <ProtectedAdminPanel />
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}

// ============================================
// Task 4.3 Solution: compose HOC
// ============================================

// Generic compose: применяет HOC справа налево
function compose<P>(
  ...hocs: Array<(c: React.ComponentType<any>) => React.ComponentType<any>>
) {
  return (Component: React.ComponentType<P>): React.ComponentType<any> =>
    hocs.reduceRight(
      (acc, hoc) => hoc(acc),
      Component as React.ComponentType<any>
    )
}

// ErrorBoundary — требует классового компонента
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          padding: '1rem', background: '#fef2f2', border: '1px solid #fca5a5',
          borderRadius: '8px', color: '#dc2626',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Что-то пошло не так</div>
          <code style={{ fontSize: '0.8rem' }}>{this.state.error?.message}</code>
        </div>
      )
    }
    return this.props.children
  }
}

function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundaryClass fallback={fallback}>
      <Component {...props} />
    </ErrorBoundaryClass>
  )
  WithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithErrorBoundary
}

// Компонент для демонстрации compose

interface ReportProps {
  title: string
  shouldThrow?: boolean
}

function ReportComponent({ title, shouldThrow }: ReportProps) {
  const { user } = useContext(AuthContext)

  if (shouldThrow) {
    throw new Error(`Ошибка в компоненте "${title}"`)
  }

  return (
    <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
      <div style={{ fontWeight: 600, color: '#1d4ed8', marginBottom: '0.5rem' }}>📋 {title}</div>
      <div style={{ fontSize: '0.9rem', color: '#3b82f6' }}>
        Данные отчёта загружены. Пользователь: {user?.name} ({user?.role})
      </div>
    </div>
  )
}

// Применяем compose: withErrorBoundary → withAuth → withLoading → ReportComponent
const EnhancedReport = compose<ReportProps & { isLoading: boolean }>(
  withErrorBoundary,
  withAuth,
  withLoading
)(ReportComponent)

export function Task4_3_Solution() {
  const [isLoading, setIsLoading] = useState(false)
  const [shouldThrow, setShouldThrow] = useState(false)

  const simulateLoad = () => {
    setIsLoading(true)
    setShouldThrow(false)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <AuthProvider>
      <div className="exercise-container">
        <h2>Решение 4.3: Композиция HOC через compose</h2>
        <p style={{ color: '#64748b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          <code>compose(withErrorBoundary, withAuth, withLoading)(ReportComponent)</code>
        </p>

        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '6px', fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>Порядок оборачивания (снаружи → внутри):</div>
          <code style={{ color: '#7c3aed' }}>
            withErrorBoundary → withAuth → withLoading → ReportComponent
          </code>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <AuthContextButtons />
          <button
            onClick={simulateLoad}
            disabled={isLoading}
            style={{
              padding: '0.4rem 0.85rem', fontSize: '0.85rem',
              background: isLoading ? '#f1f5f9' : '#3b82f6', color: isLoading ? '#94a3b8' : '#fff',
              border: 'none', borderRadius: '4px', cursor: isLoading ? 'default' : 'pointer',
            }}
          >
            {isLoading ? '⏳ Загрузка...' : 'Симулировать загрузку'}
          </button>
          <button
            onClick={() => setShouldThrow(v => !v)}
            style={{
              padding: '0.4rem 0.85rem', fontSize: '0.85rem',
              background: shouldThrow ? '#fef2f2' : '#fff1f2',
              color: shouldThrow ? '#dc2626' : '#e11d48',
              border: `1px solid ${shouldThrow ? '#fca5a5' : '#fda4af'}`,
              borderRadius: '4px', cursor: 'pointer',
            }}
          >
            {shouldThrow ? '🔧 Исправить' : '💥 Сломать компонент'}
          </button>
        </div>

        <EnhancedReport
          title="Отчёт за Q1 2025"
          isLoading={isLoading}
          shouldThrow={shouldThrow}
        />
      </div>
    </AuthProvider>
  )
}

// Вспомогательные кнопки авторизации для Task4_3
function AuthContextButtons() {
  const { isAuthenticated, user, login, logout } = useContext(AuthContext)
  if (isAuthenticated) {
    return (
      <button
        onClick={logout}
        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Выйти ({user?.role})
      </button>
    )
  }
  return (
    <>
      <button
        onClick={() => login('user')}
        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Войти как user
      </button>
      <button
        onClick={() => login('admin')}
        style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Войти как admin
      </button>
    </>
  )
}

// ============================================
// Task 4.4 Solution: withWindowSize → useWindowSize
// ============================================

// ---- HOC-версия ----

interface WithWindowSizeProps {
  windowWidth: number
  windowHeight: number
}

function withWindowSize<P extends object>(Component: React.ComponentType<P & WithWindowSizeProps>) {
  const WithWindowSize = (props: P) => {
    const [size, setSize] = useState({
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    })

    useEffect(() => {
      const handleResize = () =>
        setSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <Component {...props} windowWidth={size.width} windowHeight={size.height} />
  }
  WithWindowSize.displayName = `withWindowSize(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithWindowSize
}

function ResponsiveLayoutInner({ windowWidth, windowHeight }: WithWindowSizeProps) {
  const breakpoint = windowWidth < 640 ? 'mobile' : windowWidth < 1024 ? 'tablet' : 'desktop'
  const breakpointColor: Record<string, string> = {
    mobile: '#fef9c3',
    tablet: '#e0f2fe',
    desktop: '#f0fdf4',
  }
  const breakpointBorder: Record<string, string> = {
    mobile: '#fbbf24',
    tablet: '#38bdf8',
    desktop: '#4ade80',
  }

  return (
    <div style={{
      padding: '1rem', background: breakpointColor[breakpoint],
      border: `1px solid ${breakpointBorder[breakpoint]}`,
      borderRadius: '8px',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
        HOC-версия: withWindowSize
      </div>
      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
        Размер: <code>{windowWidth} × {windowHeight}</code>
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
        Брейкпоинт:{' '}
        <span style={{ fontWeight: 600, color: breakpoint === 'mobile' ? '#d97706' : breakpoint === 'tablet' ? '#0284c7' : '#16a34a' }}>
          {breakpoint === 'mobile' ? '📱 mobile (<640px)' : breakpoint === 'tablet' ? '💻 tablet (640-1024px)' : '🖥️ desktop (>1024px)'}
        </span>
      </div>
    </div>
  )
}

const ResponsiveLayoutHOC = withWindowSize(ResponsiveLayoutInner)

// ---- Хук-версия ----

function useWindowSize() {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

function ResponsiveLayoutHook() {
  const { width, height } = useWindowSize()
  const breakpoint = width < 640 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
  const breakpointColor: Record<string, string> = {
    mobile: '#fef9c3',
    tablet: '#e0f2fe',
    desktop: '#f0fdf4',
  }
  const breakpointBorder: Record<string, string> = {
    mobile: '#fbbf24',
    tablet: '#38bdf8',
    desktop: '#4ade80',
  }

  return (
    <div style={{
      padding: '1rem', background: breakpointColor[breakpoint],
      border: `1px solid ${breakpointBorder[breakpoint]}`,
      borderRadius: '8px',
    }}>
      <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#1e293b' }}>
        Хук-версия: useWindowSize
      </div>
      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
        Размер: <code>{width} × {height}</code>
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
        Брейкпоинт:{' '}
        <span style={{ fontWeight: 600, color: breakpoint === 'mobile' ? '#d97706' : breakpoint === 'tablet' ? '#0284c7' : '#16a34a' }}>
          {breakpoint === 'mobile' ? '📱 mobile (<640px)' : breakpoint === 'tablet' ? '💻 tablet (640-1024px)' : '🖥️ desktop (>1024px)'}
        </span>
      </div>
    </div>
  )
}

const COMPARISON = [
  { label: 'Строк кода', hoc: '~15 (+ новый компонент)', hook: '~10 (используется напрямую)' },
  { label: 'Слой в DevTools', hoc: 'withWindowSize(Component)', hook: 'Нет лишнего слоя' },
  { label: 'Тестирование', hoc: 'Нужно мокать props', hook: 'Мокаем window напрямую' },
  { label: 'Переиспользование', hoc: 'Только через новый компонент', hook: 'Вызов в любом компоненте' },
  { label: 'Передача данных', hoc: 'Через props (windowWidth)', hook: 'Через return (деструктуризация)' },
]

export function Task4_4_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 4.4: withWindowSize HOC → useWindowSize хук</h2>
      <p style={{ color: '#64748b', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
        Оба варианта функционально идентичны. Измените размер окна — значения обновятся одновременно.
      </p>

      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <ResponsiveLayoutHOC />
        </div>
        <div style={{ flex: 1, minWidth: 260 }}>
          <ResponsiveLayoutHook />
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <div style={{ fontWeight: 600, color: '#1e293b', marginBottom: '0.75rem', fontSize: '0.9rem' }}>
          Сравнение подходов
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>Критерий</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#7c3aed', fontWeight: 600 }}>HOC</th>
              <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', color: '#0284c7', fontWeight: 600 }}>Хук</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.5rem 0.75rem', color: '#475569', fontWeight: 500 }}>{row.label}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#7c3aed' }}>{row.hoc}</td>
                <td style={{ padding: '0.5rem 0.75rem', color: '#0284c7' }}>{row.hook}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic' }}>
          Вывод: для логики без изменения рендера — хук предпочтительнее. HOC оправдан при условном рендере (withAuth, withLoading) или ErrorBoundary.
        </div>
      </div>
    </div>
  )
}
