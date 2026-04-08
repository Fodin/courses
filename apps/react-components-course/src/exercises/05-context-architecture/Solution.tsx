import { createContext, useContext, useState, useMemo, useRef, Component } from 'react'
import type { ReactNode, ComponentType } from 'react'

// ============================================
// Shared: createStrictContext factory
// ============================================

function createStrictContext<T>(displayName: string) {
  const Context = createContext<T | undefined>(undefined)
  Context.displayName = displayName

  function useCtx(): T {
    const value = useContext(Context)
    if (value === undefined) {
      throw new Error(
        `use${displayName} must be called within a ${displayName}Provider.\n` +
        `Wrap the component tree with <${displayName}Provider>.`
      )
    }
    return value
  }

  return [Context, useCtx] as const
}

// ============================================
// Task 5.1 Solution: createStrictContext factory demo
// ============================================

// --- Theme context ---
interface ThemeValue {
  mode: 'light' | 'dark'
  toggleMode: () => void
}

const [ThemeCtx51, useTheme51] = createStrictContext<ThemeValue>('Theme')

function ThemeProvider51({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const value = useMemo<ThemeValue>(
    () => ({ mode, toggleMode: () => setMode(m => m === 'light' ? 'dark' : 'light') }),
    [mode]
  )
  return <ThemeCtx51.Provider value={value}>{children}</ThemeCtx51.Provider>
}

// --- User context ---
interface AppUser {
  name: string
  role: string
}

interface UserValue51 {
  user: AppUser | null
  login: (name: string) => void
  logout: () => void
}

const [UserCtx51, useUser51] = createStrictContext<UserValue51>('User')

function UserProvider51({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const value = useMemo<UserValue51>(
    () => ({
      user,
      login: (name: string) => setUser({ name, role: 'developer' }),
      logout: () => setUser(null),
    }),
    [user]
  )
  return <UserCtx51.Provider value={value}>{children}</UserCtx51.Provider>
}

// --- Demo components ---
function ThemeDemo() {
  const { mode, toggleMode } = useTheme51()
  return (
    <div style={{
      padding: '1rem',
      background: mode === 'light' ? '#fff' : '#1e1e1e',
      color: mode === 'light' ? '#333' : '#e0e0e0',
      borderRadius: '8px',
      border: '1px solid #ddd',
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.25rem' }}>ThemeContext</div>
          <div style={{ fontWeight: 600 }}>
            Текущая тема: <span style={{ color: '#1976d2' }}>{mode === 'light' ? 'Светлая' : 'Тёмная'}</span>
          </div>
        </div>
        <button
          onClick={toggleMode}
          style={{
            padding: '0.5rem 1rem',
            background: mode === 'light' ? '#333' : '#fff',
            color: mode === 'light' ? '#fff' : '#333',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          {mode === 'light' ? '🌙 Тёмная' : '☀️ Светлая'}
        </button>
      </div>
    </div>
  )
}

function UserDemo() {
  const { user, login, logout } = useUser51()
  const [inputName, setInputName] = useState('')

  return (
    <div style={{ padding: '1rem', background: '#f9f9f9', borderRadius: '8px', border: '1px solid #ddd' }}>
      <div style={{ fontSize: '0.75rem', color: '#888', marginBottom: '0.5rem' }}>UserContext</div>
      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>{user.role}</div>
          </div>
          <button
            onClick={logout}
            style={{ padding: '0.4rem 0.8rem', background: '#ef5350', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Выйти
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            value={inputName}
            onChange={e => setInputName(e.target.value)}
            placeholder="Введите имя"
            style={{ flex: 1, padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            onClick={() => { if (inputName.trim()) { login(inputName.trim()); setInputName('') } }}
            disabled={!inputName.trim()}
            style={{ padding: '0.4rem 0.8rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Войти
          </button>
        </div>
      )}
    </div>
  )
}

// --- ErrorBoundary to catch "used outside provider" ---
interface EBState { hasError: boolean; message: string }

class ErrorBoundary extends Component<{ children: ReactNode }, EBState> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, message: '' }
  }
  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, message: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '0.75rem 1rem', background: '#ffebee', border: '1px solid #ef9a9a', borderRadius: '8px', color: '#c62828' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Ошибка: хук вне провайдера</div>
          <code style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap' }}>{this.state.message}</code>
        </div>
      )
    }
    return this.props.children
  }
}

function BadComponent() {
  // This will throw — no provider above
  const { mode } = useTheme51()
  return <div>mode: {mode}</div>
}

function ErrorDemo() {
  const [show, setShow] = useState(false)
  return (
    <div>
      <button
        onClick={() => setShow(true)}
        style={{ padding: '0.5rem 1rem', background: '#ff7043', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
      >
        Вызвать ошибку (хук вне провайдера)
      </button>
      {show && (
        <div style={{ marginTop: '0.75rem' }}>
          <ErrorBoundary>
            <BadComponent />
          </ErrorBoundary>
        </div>
      )}
    </div>
  )
}

export function Task5_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 5.1: createStrictContext фабрика</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Фабрика создаёт типобезопасный контекст + хук с ошибкой вне провайдера. Демо: ThemeContext и UserContext.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <ThemeProvider51>
          <ThemeDemo />
        </ThemeProvider51>

        <UserProvider51>
          <UserDemo />
        </UserProvider51>

        <div style={{ padding: '1rem', background: '#fff3e0', borderRadius: '8px', border: '1px solid #ffe082' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.75rem', color: '#e65100', fontSize: '0.9rem' }}>
            Демонстрация ошибки вне провайдера
          </div>
          <ErrorDemo />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 5.2 Solution: Split AppContext into 4
// ============================================

// --- 4 independent contexts ---

interface UserValue52 {
  user: { name: string; role: string } | null
  setUser: (u: { name: string; role: string } | null) => void
}
const [UserCtx52, useUser52] = createStrictContext<UserValue52>('User52')

function UserProvider52({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ name: string; role: string } | null>({ name: 'Алексей', role: 'Admin' })
  const value = useMemo<UserValue52>(() => ({ user, setUser }), [user])
  return <UserCtx52.Provider value={value}>{children}</UserCtx52.Provider>
}

interface ThemeValue52 {
  mode: 'light' | 'dark'
  setMode: (m: 'light' | 'dark') => void
}
const [ThemeCtx52, useTheme52] = createStrictContext<ThemeValue52>('Theme52')

function ThemeProvider52({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const value = useMemo<ThemeValue52>(() => ({ mode, setMode }), [mode])
  return <ThemeCtx52.Provider value={value}>{children}</ThemeCtx52.Provider>
}

interface LocaleValue {
  locale: 'ru' | 'en'
  setLocale: (l: 'ru' | 'en') => void
}
const [LocaleCtx, useLocale] = createStrictContext<LocaleValue>('Locale')

function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<'ru' | 'en'>('ru')
  const value = useMemo<LocaleValue>(() => ({ locale, setLocale }), [locale])
  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>
}

interface Notification {
  id: string
  text: string
}

interface NotificationsValue {
  notifications: Notification[]
  addNotification: (text: string) => void
  dismissNotification: (id: string) => void
}
const [NotificationsCtx, useNotifications] = createStrictContext<NotificationsValue>('Notifications')

function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', text: 'Добро пожаловать!' },
  ])
  const value = useMemo<NotificationsValue>(() => ({
    notifications,
    addNotification: (text: string) => setNotifications(n => [...n, { id: Date.now().toString(), text }]),
    dismissNotification: (id: string) => setNotifications(n => n.filter(x => x.id !== id)),
  }), [notifications])
  return <NotificationsCtx.Provider value={value}>{children}</NotificationsCtx.Provider>
}

// --- Render counter hook ---
function useRenderCount() {
  const ref = useRef(0)
  ref.current += 1
  return ref.current
}

// --- Widgets ---
const widgetBase: React.CSSProperties = {
  padding: '0.75rem 1rem',
  background: '#fff',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  position: 'relative',
}

const counterBadge: React.CSSProperties = {
  position: 'absolute',
  top: '0.5rem',
  right: '0.5rem',
  fontSize: '0.7rem',
  color: '#bbb',
  background: '#f5f5f5',
  padding: '0.1rem 0.4rem',
  borderRadius: '4px',
}

function UserWidget() {
  const { user, setUser } = useUser52()
  const renders = useRenderCount()
  return (
    <div style={widgetBase}>
      <span style={counterBadge}>Рендеров: {renders}</span>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem', fontWeight: 600 }}>UserContext</div>
      <div style={{ fontWeight: 600 }}>{user?.name ?? '—'}</div>
      <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{user?.role ?? '—'}</div>
      <button
        onClick={() => setUser(user ? null : { name: 'Алексей', role: 'Admin' })}
        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#fafafa' }}
      >
        {user ? 'Выйти' : 'Войти'}
      </button>
    </div>
  )
}

function ThemeWidget() {
  const { mode, setMode } = useTheme52()
  const renders = useRenderCount()
  return (
    <div style={{ ...widgetBase, background: mode === 'dark' ? '#1e1e1e' : '#fff', color: mode === 'dark' ? '#e0e0e0' : '#333' }}>
      <span style={{ ...counterBadge, background: mode === 'dark' ? '#333' : '#f5f5f5', color: mode === 'dark' ? '#888' : '#bbb' }}>
        Рендеров: {renders}
      </span>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem', fontWeight: 600 }}>ThemeContext</div>
      <div style={{ marginBottom: '0.5rem' }}>Тема: <strong>{mode === 'light' ? 'Светлая' : 'Тёмная'}</strong></div>
      <button
        onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: mode === 'dark' ? '#333' : '#fafafa', color: mode === 'dark' ? '#e0e0e0' : '#333' }}
      >
        Сменить тему
      </button>
    </div>
  )
}

function LocaleWidget() {
  const { locale, setLocale } = useLocale()
  const renders = useRenderCount()
  return (
    <div style={widgetBase}>
      <span style={counterBadge}>Рендеров: {renders}</span>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem', fontWeight: 600 }}>LocaleContext</div>
      <div style={{ marginBottom: '0.5rem' }}>Локаль: <strong>{locale.toUpperCase()}</strong></div>
      <button
        onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#fafafa' }}
      >
        {locale === 'ru' ? 'Switch to EN' : 'Переключить на RU'}
      </button>
    </div>
  )
}

function NotificationsWidget() {
  const { notifications, addNotification, dismissNotification } = useNotifications()
  const renders = useRenderCount()
  const msgs = ['Новое сообщение', 'Обновление системы', 'Напоминание', 'Успешная операция']
  const nextMsg = msgs[notifications.length % msgs.length]
  return (
    <div style={widgetBase}>
      <span style={counterBadge}>Рендеров: {renders}</span>
      <div style={{ fontSize: '0.7rem', color: '#888', marginBottom: '0.3rem', fontWeight: 600 }}>NotificationsContext</div>
      <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
        Уведомлений: <strong>{notifications.length}</strong>
      </div>
      {notifications.map(n => (
        <div key={n.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.2rem 0', fontSize: '0.8rem', borderBottom: '1px solid #f5f5f5' }}>
          <span>{n.text}</span>
          <button
            onClick={() => dismissNotification(n.id)}
            style={{ marginLeft: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#e57373', fontSize: '0.75rem' }}
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={() => addNotification(nextMsg)}
        style={{ marginTop: '0.5rem', padding: '0.3rem 0.6rem', fontSize: '0.8rem', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', background: '#e8f5e9', color: '#388e3c' }}
      >
        + Добавить уведомление
      </button>
    </div>
  )
}

export function Task5_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 5.2: Разделение AppContext на 4 контекста</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Нажмите "Добавить уведомление" и наблюдайте: счётчик растёт только у NotificationsWidget.
        При смене темы — только ThemeWidget. Остальные не трогаются.
      </p>

      <UserProvider52>
        <ThemeProvider52>
          <LocaleProvider>
            <NotificationsProvider>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <UserWidget />
                <ThemeWidget />
                <LocaleWidget />
                <NotificationsWidget />
              </div>
            </NotificationsProvider>
          </LocaleProvider>
        </ThemeProvider52>
      </UserProvider52>
    </div>
  )
}

// ============================================
// Task 5.3 Solution: ComposeProviders
// ============================================

type ProviderComponent = ComponentType<{ children: ReactNode }>

interface ComposeProvidersProps {
  providers: ProviderComponent[]
  children: ReactNode
}

function ComposeProviders({ providers, children }: ComposeProvidersProps) {
  return providers.reduceRight(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  ) as React.ReactElement
}

// --- CounterProvider ---
interface CounterValue {
  count: number
  increment: () => void
  decrement: () => void
}

const [CounterCtx, useCounter] = createStrictContext<CounterValue>('Counter')

function CounterProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState(0)
  const value = useMemo<CounterValue>(() => ({
    count,
    increment: () => setCount(c => c + 1),
    decrement: () => setCount(c => c - 1),
  }), [count])
  return <CounterCtx.Provider value={value}>{children}</CounterCtx.Provider>
}

// --- Providers for task 5.3 ---
function UserProvider53({ children }: { children: ReactNode }) {
  const [user] = useState({ name: 'Мария', role: 'Editor' })
  const value = useMemo(() => ({ user }), [user])
  return <UserCtx52.Provider value={{ user, setUser: () => {} }}>{children}</UserCtx52.Provider>
}

function ThemeProvider53({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light')
  const value = useMemo<ThemeValue52>(() => ({ mode, setMode }), [mode])
  return <ThemeCtx52.Provider value={value}>{children}</ThemeCtx52.Provider>
}

// --- MiniApp ---
function MiniApp() {
  const { user } = useUser52()
  const { mode, setMode } = useTheme52()
  const { locale, setLocale } = useLocale()
  const { notifications, addNotification } = useNotifications()
  const { count, increment, decrement } = useCounter()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
        <div style={{ padding: '0.5rem 0.75rem', background: '#e3f2fd', borderRadius: '6px', fontSize: '0.85rem' }}>
          <strong>User:</strong> {user?.name} ({user?.role})
        </div>
        <div style={{ padding: '0.5rem 0.75rem', background: '#f3e5f5', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Theme:</strong> {mode}</span>
          <button
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', border: '1px solid #ce93d8', borderRadius: '4px', cursor: 'pointer', background: '#fff' }}
          >
            Сменить
          </button>
        </div>
        <div style={{ padding: '0.5rem 0.75rem', background: '#e8f5e9', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Locale:</strong> {locale.toUpperCase()}</span>
          <button
            onClick={() => setLocale(locale === 'ru' ? 'en' : 'ru')}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', border: '1px solid #a5d6a7', borderRadius: '4px', cursor: 'pointer', background: '#fff' }}
          >
            Сменить
          </button>
        </div>
        <div style={{ padding: '0.5rem 0.75rem', background: '#fff3e0', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>Уведомлений:</strong> {notifications.length}</span>
          <button
            onClick={() => addNotification('Тест')}
            style={{ fontSize: '0.7rem', padding: '0.2rem 0.4rem', border: '1px solid #ffcc80', borderRadius: '4px', cursor: 'pointer', background: '#fff' }}
          >
            +1
          </button>
        </div>
      </div>
      <div style={{ padding: '0.5rem 0.75rem', background: '#fce4ec', borderRadius: '6px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <strong>Counter:</strong>
        <button onClick={decrement} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #f48fb1', cursor: 'pointer', background: '#fff', fontWeight: 700 }}>−</button>
        <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center' }}>{count}</span>
        <button onClick={increment} style={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #f48fb1', cursor: 'pointer', background: '#fff', fontWeight: 700 }}>+</button>
      </div>
    </div>
  )
}

const allProviders53: ProviderComponent[] = [
  UserProvider53,
  ThemeProvider53,
  LocaleProvider,
  NotificationsProvider,
  CounterProvider,
]

export function Task5_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Решение 5.3: ComposeProviders</h2>
      <p style={{ color: '#666', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Оба варианта рендерят одинаковое приложение. ComposeProviders устраняет pyramid of doom.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#c62828', fontSize: '0.9rem' }}>
            Pyramid of doom
          </div>
          <pre style={{ fontSize: '0.7rem', background: '#fafafa', padding: '0.75rem', borderRadius: '6px', border: '1px solid #eee', overflow: 'auto', marginBottom: '0.75rem', color: '#555' }}>{`<UserProvider>
  <ThemeProvider>
    <LocaleProvider>
      <NotificationsProvider>
        <CounterProvider>
          <MiniApp />
        </CounterProvider>
      </NotificationsProvider>
    </LocaleProvider>
  </ThemeProvider>
</UserProvider>`}</pre>
          <UserProvider53>
            <ThemeProvider53>
              <LocaleProvider>
                <NotificationsProvider>
                  <CounterProvider>
                    <MiniApp />
                  </CounterProvider>
                </NotificationsProvider>
              </LocaleProvider>
            </ThemeProvider53>
          </UserProvider53>
        </div>

        <div>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem', color: '#2e7d32', fontSize: '0.9rem' }}>
            С ComposeProviders
          </div>
          <pre style={{ fontSize: '0.7rem', background: '#fafafa', padding: '0.75rem', borderRadius: '6px', border: '1px solid #eee', overflow: 'auto', marginBottom: '0.75rem', color: '#555' }}>{`<ComposeProviders
  providers={[
    UserProvider,
    ThemeProvider,
    LocaleProvider,
    NotificationsProvider,
    CounterProvider,
  ]}
>
  <MiniApp />
</ComposeProviders>`}</pre>
          <ComposeProviders providers={allProviders53}>
            <MiniApp />
          </ComposeProviders>
        </div>
      </div>
    </div>
  )
}
