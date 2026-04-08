// ============================================
// Level 4: HOC — Подсказки
// Level 4: HOC — Hints
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      {/* Подсказки — Level 4: Higher-Order Components */}
      {/* Hints — Level 4: Higher-Order Components */}
      <h2>Подсказки — Level 4: Higher-Order Components</h2>

      {/* ---- 4.1: withLoading ---- */}
      {/* ---- 4.1: withLoading ---- */}
      <section style={{ marginBottom: '2rem' }}>
        {/* 4.1 — withLoading HOC */}
        {/* 4.1 — withLoading HOC */}
        <h3 style={{ color: '#7c3aed', borderBottom: '2px solid #e9d5ff', paddingBottom: '0.5rem' }}>
          4.1 — withLoading HOC
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          {/* Структура HOC: */}
          {/* HOC structure: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Структура HOC:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`function withLoading<P extends object>(
  Component: React.ComponentType<P>
) {
  // Возвращаемый компонент принимает P + { isLoading }
  // The returned component accepts P + { isLoading }
  const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
    if (isLoading) return <Spinner />
    // props as P — TypeScript нужна подсказка
    // props as P — TypeScript needs a hint
    return <Component {...(props as P)} />
  }
  // Формат: withLoading(ComponentName)
  // Format: withLoading(ComponentName)
  WithLoading.displayName = \`withLoading(\${
    Component.displayName ?? Component.name ?? 'Component'
  })\`
  return WithLoading
}`}
          </pre>
        </div>

        <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '6px', fontSize: '0.85rem', color: '#991b1b' }}>
          {/* Частая ошибка: HOC нужно вызывать ВНЕ рендера: */}
          {/* Common mistake: HOC must be called OUTSIDE render: */}
          <strong>Частая ошибка:</strong> HOC нужно вызывать ВНЕ рендера:
          <pre style={{ marginTop: '0.5rem', background: '#1e293b', color: '#fca5a5', padding: '0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
{`// ❌ Каждый рендер Parent создаёт новый тип — React делает remount!
// ❌ Every Parent render creates a new type — React does remount!
function Parent() {
  const Enhanced = withLoading(MyComponent)
  return <Enhanced isLoading={loading} />
}

// ✅ Создаём один раз на уровне модуля
// ✅ Create once at module level
const Enhanced = withLoading(MyComponent)
function Parent() {
  return <Enhanced isLoading={loading} />
}`}
          </pre>
        </div>
      </section>

      {/* ---- 4.2: withAuth ---- */}
      {/* ---- 4.2: withAuth ---- */}
      <section style={{ marginBottom: '2rem' }}>
        {/* 4.2 — withAuth + AuthContext */}
        {/* 4.2 — withAuth + AuthContext */}
        <h3 style={{ color: '#0284c7', borderBottom: '2px solid #bae6fd', paddingBottom: '0.5rem' }}>
          4.2 — withAuth + AuthContext
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          {/* AuthProvider с useMemo: */}
          {/* AuthProvider with useMemo: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>AuthProvider с useMemo:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // useMemo предотвращает лишние ре-рендеры
  // useMemo prevents unnecessary re-renders
  const value = useMemo(() => ({
    isAuthenticated: user !== null,
    user,
    login: (role) => setUser({ name: role === 'admin' ? 'Администратор' : 'Пользователь', role }),
    logout: () => setUser(null),
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}`}
          </pre>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {/* HOC читает контекст внутри компонента: */}
          {/* HOC reads context inside the component: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>HOC читает контекст внутри компонента:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`function withAuth(Component, options = {}) {
  const WithAuth = (props) => {
    // useContext — ВНУТРИ возвращаемого компонента!
    // useContext — INSIDE the returned component!
    const { isAuthenticated, user } = useContext(AuthContext)

    if (!isAuthenticated) return <LoginPrompt />
    if (options.requiredRole && user?.role !== options.requiredRole) {
      return <AccessDenied />
    }
    return <Component {...props} />
  }
  WithAuth.displayName = \`withAuth(\${Component.name})\`
  return WithAuth
}`}
          </pre>
        </div>
      </section>

      {/* ---- 4.3: compose ---- */}
      {/* ---- 4.3: compose ---- */}
      <section style={{ marginBottom: '2rem' }}>
        {/* 4.3 — compose + ErrorBoundary */}
        {/* 4.3 — compose + ErrorBoundary */}
        <h3 style={{ color: '#059669', borderBottom: '2px solid #a7f3d0', paddingBottom: '0.5rem' }}>
          4.3 — compose + ErrorBoundary
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          {/* Реализация compose через reduceRight: */}
          {/* compose implementation via reduceRight: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Реализация compose через reduceRight:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`// compose(f, g, h)(x) = f(g(h(x))) — применяется справа налево
// compose(f, g, h)(x) = f(g(h(x))) — applied right to left
function compose(...hocs) {
  return (Component) =>
    hocs.reduceRight(
      (acc, hoc) => hoc(acc),
      Component
    )
}

// Применение:
// Usage:
const Enhanced = compose(
  withErrorBoundary,  // внешний слой (первый обрабатывает ошибки)
                      // outer layer (handles errors first)
  withAuth,           // средний слой (проверяет авторизацию)
                      // middle layer (checks authorization)
  withLoading         // ближайший к компоненту (показывает спиннер)
                      // closest to component (shows spinner)
)(ReportComponent)`}
          </pre>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          {/* Минимальный ErrorBoundary: */}
          {/* Minimal ErrorBoundary: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Минимальный ErrorBoundary:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`class ErrorBoundaryClass extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ color: 'red' }}>
          Ошибка: {this.state.error?.message}
        </div>
      )
    }
    return this.props.children
  }
}`}
          </pre>
        </div>
      </section>

      {/* ---- 4.4: useWindowSize ---- */}
      {/* ---- 4.4: useWindowSize ---- */}
      <section>
        {/* 4.4 — useWindowSize хук */}
        {/* 4.4 — useWindowSize hook */}
        <h3 style={{ color: '#d97706', borderBottom: '2px solid #fde68a', paddingBottom: '0.5rem' }}>
          4.4 — useWindowSize хук
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          {/* Хук — минимальная реализация: */}
          {/* Hook — minimal implementation: */}
          <div style={{ fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>Хук — минимальная реализация:</div>
          <pre style={{ background: '#1e293b', color: '#e2e8f0', padding: '1rem', borderRadius: '6px', fontSize: '0.8rem', overflowX: 'auto' }}>
{`function useWindowSize() {
  const [size, setSize] = useState({
    // SSR-совместимо: проверяем typeof window
    // SSR-compatible: check typeof window
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })

    window.addEventListener('resize', handleResize)
    // Cleanup — обязательно!
    // Cleanup — required!
    return () => window.removeEventListener('resize', handleResize)
  }, []) // пустой массив — подписка только при монтировании
         // empty array — subscribe only on mount

  return size
}

// Использование:
// Usage:
function MyComponent() {
  const { width, height } = useWindowSize()
  const isMobile = width < 640
  // ...
}`}
          </pre>
        </div>

        <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '6px', fontSize: '0.85rem', color: '#166534' }}>
          {/* Сравнение: хук не создаёт лишний слой в дереве компонентов. */}
          {/* Comparison: the hook does not create an extra layer in the component tree. */}
          <strong>Сравнение:</strong> хук не создаёт лишний слой в дереве компонентов.
          {/* В React DevTools вы увидите только ваш компонент, а в разделе Hooks — useWindowSize. */}
          {/* In React DevTools you will see only your component, and in the Hooks section — useWindowSize. */}
          В React DevTools вы увидите только ваш компонент, а в разделе Hooks — <code>useWindowSize</code>.
        </div>
      </section>
    </div>
  )
}
