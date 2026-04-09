import { useState, useCallback, useRef } from 'react'

// =====================================================
// Task 7.1: Navigation Simulator between MFEs
// =====================================================

type MFEName = 'catalog' | 'cart' | 'profile'

type ShellRoute = {
  path: string
  label: string
  mfe: MFEName | null
}

type MFEInternalRoute = {
  path: string
  label: string
}

type NavLogEntry = {
  id: number
  time: string
  type: 'shell' | 'mfe' | 'conflict' | 'deeplink' | 'error'
  message: string
}

const SHELL_ROUTES: ShellRoute[] = [
  { path: '/', label: 'Home', mfe: null },
  { path: '/catalog', label: 'Catalog', mfe: 'catalog' },
  { path: '/cart', label: 'Cart', mfe: 'cart' },
  { path: '/profile', label: 'Profile', mfe: 'profile' },
]

const MFE_INTERNAL_ROUTES: Record<MFEName, MFEInternalRoute[]> = {
  catalog: [
    { path: '/catalog', label: 'Каталог товаров' },
    { path: '/catalog/search', label: 'Поиск' },
    { path: '/catalog/:id', label: 'Карточка товара' },
  ],
  cart: [
    { path: '/cart', label: 'Корзина' },
    { path: '/cart/checkout', label: 'Оформление заказа' },
    { path: '/cart/confirm', label: 'Подтверждение' },
  ],
  profile: [
    { path: '/profile', label: 'Профиль' },
    { path: '/profile/orders', label: 'Мои заказы' },
    { path: '/profile/settings', label: 'Настройки' },
  ],
}

const MFE_COLORS: Record<MFEName, string> = {
  catalog: '#2196f3',
  cart: '#ff9800',
  profile: '#9c27b0',
}

const DEEP_LINK_EXAMPLES = [
  '/catalog/search',
  '/cart/checkout',
  '/profile/orders',
  '/catalog/42',
]

function getNow() {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function getMFEForPath(path: string): MFEName | null {
  if (path.startsWith('/catalog')) return 'catalog'
  if (path.startsWith('/cart')) return 'cart'
  if (path.startsWith('/profile')) return 'profile'
  return null
}

export function Task7_1_Solution() {
  const [currentUrl, setCurrentUrl] = useState('/')
  const [activeMFE, setActiveMFE] = useState<MFEName | null>(null)
  const [log, setLog] = useState<NavLogEntry[]>([
    {
      id: 0,
      time: getNow(),
      type: 'shell',
      message: 'Shell: приложение инициализировано, текущий URL = /',
    },
  ])
  const [conflictVisible, setConflictVisible] = useState(false)
  const [deepLinkInput, setDeepLinkInput] = useState('')
  const [showDeepLink, setShowDeepLink] = useState(false)
  const logIdRef = useRef(1)
  const logEndRef = useRef<HTMLDivElement>(null)

  const addLog = useCallback((type: NavLogEntry['type'], message: string) => {
    setLog(prev => [
      ...prev,
      { id: logIdRef.current++, time: getNow(), type, message },
    ])
    setTimeout(() => {
      logEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }, [])

  const navigateShell = useCallback(
    (route: ShellRoute) => {
      setConflictVisible(false)
      const prevMFE = activeMFE
      setCurrentUrl(route.path)
      setActiveMFE(route.mfe)
      addLog('shell', `Shell: navigate to ${route.path}`)
      if (prevMFE && prevMFE !== route.mfe) {
        addLog('mfe', `${prevMFE} MFE: unmounted`)
      }
      if (route.mfe) {
        addLog('mfe', `${route.mfe} MFE: mounted, базовый путь = ${route.path}`)
      }
    },
    [activeMFE, addLog],
  )

  const navigateInternal = useCallback(
    (mfe: MFEName, internalRoute: MFEInternalRoute) => {
      setCurrentUrl(internalRoute.path)
      addLog('mfe', `${mfe} MFE: internal navigate to ${internalRoute.path}`)
    },
    [addLog],
  )

  const simulateConflict = useCallback(() => {
    setConflictVisible(true)
    addLog(
      'conflict',
      'Cart MFE: попытка pushState → /cart/checkout',
    )
    addLog(
      'conflict',
      'Catalog MFE: попытка pushState → /catalog/42 (ОДНОВРЕМЕННО!)',
    )
    addLog(
      'error',
      'КОНФЛИКТ: два MFE вызвали history.pushState одновременно — второй вызов перезаписал первый. Текущий URL: /catalog/42, Cart MFE думает, что он на /cart/checkout',
    )
  }, [addLog])

  const handleDeepLink = useCallback(() => {
    const path = deepLinkInput.trim() || '/catalog/search'
    const mfe = getMFEForPath(path)
    setCurrentUrl(path)
    setActiveMFE(mfe)
    setConflictVisible(false)
    addLog('deeplink', `Deep link: входящий URL = ${path}`)
    if (mfe) {
      const shellRoute = SHELL_ROUTES.find(r => r.mfe === mfe)
      addLog(
        'shell',
        `Shell: распознал MFE = ${mfe}, активирует маршрут ${shellRoute?.path}`,
      )
      addLog('mfe', `${mfe} MFE: mounted с initialPath = ${path}`)
      addLog('mfe', `${mfe} MFE: internal router восстановил состояние для ${path}`)
    } else {
      addLog('shell', 'Shell: путь соответствует Home, MFE не нужен')
    }
    setDeepLinkInput('')
    setShowDeepLink(false)
  }, [deepLinkInput, addLog])

  const logTypeStyle = (type: NavLogEntry['type']): React.CSSProperties => {
    const map: Record<NavLogEntry['type'], string> = {
      shell: '#4caf50',
      mfe: '#2196f3',
      conflict: '#ff9800',
      deeplink: '#9c27b0',
      error: '#f44336',
    }
    return {
      borderLeft: `3px solid ${map[type]}`,
      paddingLeft: 8,
      marginBottom: 4,
      fontSize: 12,
      fontFamily: 'monospace',
      color: '#e0e0e0',
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <h2 style={{ color: '#fff', marginTop: 0 }}>Симулятор навигации между MFE</h2>

      {/* Адресная строка */}
      <div
        style={{
          background: '#1e1e1e',
          border: '2px solid #444',
          borderRadius: 8,
          padding: '10px 16px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span style={{ color: '#888', fontSize: 12 }}>URL</span>
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: 15,
            color: '#7ec8e3',
            flex: 1,
            background: '#111',
            padding: '4px 10px',
            borderRadius: 4,
          }}
        >
          http://app.example.com{currentUrl}
        </span>
        {activeMFE && (
          <span
            style={{
              background: MFE_COLORS[activeMFE],
              color: '#fff',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {activeMFE} MFE активен
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Левая колонка: навигация */}
        <div style={{ flex: '0 0 220px' }}>
          {/* Shell навигация */}
          <div
            style={{
              background: '#1a2e1a',
              border: '1px solid #4caf50',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
            }}
          >
            <div style={{ color: '#4caf50', fontWeight: 700, fontSize: 13, marginBottom: 8 }}>
              Shell (host)
            </div>
            {SHELL_ROUTES.map(route => (
              <button
                key={route.path}
                onClick={() => navigateShell(route)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '6px 10px',
                  marginBottom: 4,
                  background: currentUrl === route.path || (activeMFE === route.mfe && route.mfe) ? '#4caf5033' : '#111',
                  border: '1px solid',
                  borderColor: currentUrl.startsWith(route.path) && route.path !== '/' ? '#4caf50' : '#333',
                  borderRadius: 4,
                  color: '#fff',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 13,
                }}
              >
                {route.label}
                <span style={{ color: '#666', fontSize: 11, marginLeft: 4 }}>{route.path}</span>
              </button>
            ))}
          </div>

          {/* MFE внутренние маршруты */}
          {activeMFE && (
            <div
              style={{
                background: '#111',
                border: `1px solid ${MFE_COLORS[activeMFE]}`,
                borderRadius: 8,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  color: MFE_COLORS[activeMFE],
                  fontWeight: 700,
                  fontSize: 13,
                  marginBottom: 8,
                }}
              >
                {activeMFE} MFE (internal routes)
              </div>
              {MFE_INTERNAL_ROUTES[activeMFE].map(r => (
                <button
                  key={r.path}
                  onClick={() => navigateInternal(activeMFE, r)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '6px 10px',
                    marginBottom: 4,
                    background: currentUrl === r.path ? `${MFE_COLORS[activeMFE]}33` : '#1a1a1a',
                    border: `1px solid ${currentUrl === r.path ? MFE_COLORS[activeMFE] : '#333'}`,
                    borderRadius: 4,
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: '#888', fontFamily: 'monospace' }}>{r.path}</span>
                  <br />
                  <span style={{ fontSize: 11 }}>{r.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Кнопки симуляции */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              onClick={simulateConflict}
              style={{
                padding: '8px 12px',
                background: '#ff9800',
                border: 'none',
                borderRadius: 6,
                color: '#000',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Конфликт!
            </button>
            <button
              onClick={() => setShowDeepLink(v => !v)}
              style={{
                padding: '8px 12px',
                background: '#9c27b0',
                border: 'none',
                borderRadius: 6,
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Deep link
            </button>
          </div>

          {showDeepLink && (
            <div
              style={{
                marginTop: 8,
                background: '#1a1a2e',
                border: '1px solid #9c27b0',
                borderRadius: 6,
                padding: 10,
              }}
            >
              <div style={{ color: '#ce93d8', fontSize: 12, marginBottom: 6 }}>
                Введите URL для deep link:
              </div>
              <input
                value={deepLinkInput}
                onChange={e => setDeepLinkInput(e.target.value)}
                placeholder="/catalog/search"
                style={{
                  width: '100%',
                  padding: '4px 8px',
                  background: '#111',
                  border: '1px solid #555',
                  borderRadius: 4,
                  color: '#fff',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  boxSizing: 'border-box',
                  marginBottom: 6,
                }}
                onKeyDown={e => e.key === 'Enter' && handleDeepLink()}
              />
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
                {DEEP_LINK_EXAMPLES.map(ex => (
                  <button
                    key={ex}
                    onClick={() => setDeepLinkInput(ex)}
                    style={{
                      padding: '2px 6px',
                      background: '#2a1a3a',
                      border: '1px solid #9c27b0',
                      borderRadius: 3,
                      color: '#ce93d8',
                      cursor: 'pointer',
                      fontSize: 10,
                      fontFamily: 'monospace',
                    }}
                  >
                    {ex}
                  </button>
                ))}
              </div>
              <button
                onClick={handleDeepLink}
                style={{
                  width: '100%',
                  padding: '5px',
                  background: '#9c27b0',
                  border: 'none',
                  borderRadius: 4,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Перейти
              </button>
            </div>
          )}
        </div>

        {/* Правая колонка: лог */}
        <div style={{ flex: 1 }}>
          {conflictVisible && (
            <div
              style={{
                background: '#2d1a00',
                border: '2px solid #ff9800',
                borderRadius: 8,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div style={{ color: '#ff9800', fontWeight: 700, marginBottom: 8 }}>
                Конфликт pushState
              </div>
              <p style={{ color: '#ffcc80', fontSize: 13, margin: '0 0 8px' }}>
                Cart MFE и Catalog MFE вызвали <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3 }}>history.pushState()</code> почти одновременно. Второй вызов молча перезаписал первый.
              </p>
              <p style={{ color: '#ffcc80', fontSize: 13, margin: '0 0 4px' }}>
                Результат: URL показывает <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3 }}>/catalog/42</code>, но Cart MFE хранит в памяти состояние для <code style={{ background: '#1a1a1a', padding: '1px 4px', borderRadius: 3 }}>/cart/checkout</code>.
              </p>
              <div style={{ marginTop: 10, color: '#a5d6a7', fontSize: 12 }}>
                Решение: только Shell владеет history API. MFE отправляют события навигации, Shell выполняет pushState.
              </div>
            </div>
          )}

          {/* Легенда */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            {(
              [
                { type: 'shell', label: 'Shell', color: '#4caf50' },
                { type: 'mfe', label: 'MFE lifecycle', color: '#2196f3' },
                { type: 'conflict', label: 'Конфликт', color: '#ff9800' },
                { type: 'deeplink', label: 'Deep link', color: '#9c27b0' },
                { type: 'error', label: 'Ошибка', color: '#f44336' },
              ] as const
            ).map(({ label, color }) => (
              <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#aaa' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                {label}
              </span>
            ))}
          </div>

          {/* Лог */}
          <div
            style={{
              background: '#111',
              border: '1px solid #333',
              borderRadius: 8,
              padding: 12,
              height: 380,
              overflowY: 'auto',
            }}
          >
            {log.map(entry => (
              <div key={entry.id} style={logTypeStyle(entry.type)}>
                <span style={{ color: '#555', marginRight: 8 }}>{entry.time}</span>
                {entry.message}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>

          <button
            onClick={() => setLog([])}
            style={{
              marginTop: 8,
              padding: '4px 12px',
              background: 'transparent',
              border: '1px solid #444',
              borderRadius: 4,
              color: '#888',
              cursor: 'pointer',
              fontSize: 12,
            }}
          >
            Очистить лог
          </button>
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 7.2: Route Table Constructor
// =====================================================

type LoadingStrategy = 'lazy' | 'eager'

type ShellRouteConfig = {
  id: string
  pathPattern: string
  mfeName: string
  strategy: LoadingStrategy
  exact: boolean
}

type InternalRoute = {
  id: string
  relativePath: string
  componentName: string
  isIndex: boolean
}

type MFERouteGroup = {
  mfeName: string
  routes: InternalRoute[]
}

type ValidationError = {
  field: string
  message: string
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

function validateConfig(
  shellRoutes: ShellRouteConfig[],
  mfeGroups: MFERouteGroup[],
): ValidationError[] {
  const errors: ValidationError[] = []

  // Пересечения shell routes
  const shellPaths = shellRoutes.map(r => r.pathPattern)
  const shellDupes = shellPaths.filter((p, i) => shellPaths.indexOf(p) !== i)
  for (const p of [...new Set(shellDupes)]) {
    errors.push({ field: 'shell', message: `Дублирующийся shell маршрут: "${p}"` })
  }

  // Wildcard должен быть последним
  for (let i = 0; i < shellRoutes.length - 1; i++) {
    if (shellRoutes[i].pathPattern === '*' || shellRoutes[i].pathPattern.endsWith('/*')) {
      errors.push({ field: 'shell', message: `Wildcard маршрут "${shellRoutes[i].pathPattern}" должен быть последним` })
    }
  }

  // У каждого MFE хотя бы один маршрут
  for (const group of mfeGroups) {
    if (group.routes.length === 0) {
      errors.push({ field: group.mfeName, message: `MFE "${group.mfeName}" не имеет ни одного внутреннего маршрута` })
    }
  }

  // Relative paths начинаются с /
  for (const group of mfeGroups) {
    for (const route of group.routes) {
      if (route.relativePath && !route.relativePath.startsWith('/')) {
        errors.push({
          field: group.mfeName,
          message: `Маршрут "${route.relativePath}" в MFE "${group.mfeName}" должен начинаться с "/"`,
        })
      }
    }
  }

  // Дубли внутри MFE
  for (const group of mfeGroups) {
    const paths = group.routes.map(r => r.relativePath)
    const dupes = paths.filter((p, i) => p && paths.indexOf(p) !== i)
    for (const p of [...new Set(dupes)]) {
      errors.push({
        field: group.mfeName,
        message: `Дублирующийся маршрут "${p}" в MFE "${group.mfeName}"`,
      })
    }
  }

  return errors
}

function generateJSON(shellRoutes: ShellRouteConfig[], mfeGroups: MFERouteGroup[]): string {
  const config = {
    shell: {
      routes: shellRoutes.map(r => ({
        path: r.pathPattern,
        mfe: r.mfeName,
        strategy: r.strategy,
        exact: r.exact,
      })),
    },
    mfes: Object.fromEntries(
      mfeGroups.map(g => [
        g.mfeName,
        {
          routes: g.routes.map(r => ({
            path: r.relativePath,
            component: r.componentName,
            index: r.isIndex || undefined,
          })),
        },
      ]),
    ),
  }
  return JSON.stringify(config, null, 2)
}

function generateJSX(shellRoutes: ShellRouteConfig[], mfeGroups: MFERouteGroup[]): string {
  if (shellRoutes.length === 0) return '// Добавьте маршруты в конструкторе'

  const mfeLookup = new Map(mfeGroups.map(g => [g.mfeName, g]))

  const lines: string[] = [
    '// React Router v6 конфигурация',
    '',
    'import { createBrowserRouter } from "react-router-dom"',
    '',
    ...shellRoutes.filter(r => r.strategy === 'lazy' && r.mfeName).map(r => {
      const mfeName = r.mfeName
      const capitalized = mfeName.charAt(0).toUpperCase() + mfeName.slice(1)
      return `const ${capitalized}MFE = lazy(() => import("./${mfeName}/${mfeName}-entry"))`
    }),
    '',
    'export const router = createBrowserRouter([',
  ]

  for (const shellRoute of shellRoutes) {
    const group = mfeLookup.get(shellRoute.mfeName)
    const capitalized =
      shellRoute.mfeName.charAt(0).toUpperCase() + shellRoute.mfeName.slice(1)
    const childrenLines: string[] = []

    if (group) {
      for (const ir of group.routes) {
        const relPath = ir.relativePath.replace(/^\//, '')
        if (ir.isIndex) {
          childrenLines.push(`    { index: true, element: <${ir.componentName} /> },`)
        } else {
          childrenLines.push(
            `    { path: "${relPath || '*'}", element: <${ir.componentName} /> },`,
          )
        }
      }
    }

    if (shellRoute.mfeName) {
      const strategyComment = shellRoute.strategy === 'lazy' ? ' /* lazy */' : ' /* eager */'
      lines.push(`  {`)
      lines.push(`    path: "${shellRoute.pathPattern}",${strategyComment}`)
      lines.push(`    element: <Suspense fallback={<Spinner />}><${capitalized}MFE /></Suspense>,`)
      if (childrenLines.length > 0) {
        lines.push(`    children: [`)
        lines.push(...childrenLines)
        lines.push(`    ],`)
      }
      lines.push(`  },`)
    } else {
      lines.push(`  { path: "${shellRoute.pathPattern}", element: <HomePage /> },`)
    }
  }

  lines.push('])')
  return lines.join('\n')
}

const INITIAL_SHELL_ROUTES: ShellRouteConfig[] = [
  { id: genId(), pathPattern: '/', mfeName: '', strategy: 'eager', exact: true },
  { id: genId(), pathPattern: '/catalog/*', mfeName: 'catalog', strategy: 'lazy', exact: false },
  { id: genId(), pathPattern: '/cart/*', mfeName: 'cart', strategy: 'lazy', exact: false },
]

const INITIAL_MFE_GROUPS: MFERouteGroup[] = [
  {
    mfeName: 'catalog',
    routes: [
      { id: genId(), relativePath: '/catalog', componentName: 'CatalogList', isIndex: true },
      { id: genId(), relativePath: '/catalog/search', componentName: 'CatalogSearch', isIndex: false },
      { id: genId(), relativePath: '/catalog/:id', componentName: 'ProductDetail', isIndex: false },
    ],
  },
  {
    mfeName: 'cart',
    routes: [
      { id: genId(), relativePath: '/cart', componentName: 'CartPage', isIndex: true },
      { id: genId(), relativePath: '/cart/checkout', componentName: 'CheckoutPage', isIndex: false },
    ],
  },
]

export function Task7_2_Solution() {
  const [shellRoutes, setShellRoutes] = useState<ShellRouteConfig[]>(INITIAL_SHELL_ROUTES)
  const [mfeGroups, setMFEGroups] = useState<MFERouteGroup[]>(INITIAL_MFE_GROUPS)
  const [previewTab, setPreviewTab] = useState<'json' | 'jsx'>('json')
  const [expandedMFEs, setExpandedMFEs] = useState<Set<string>>(new Set(['catalog', 'cart']))

  // Форма для shell route
  const [newShellPath, setNewShellPath] = useState('')
  const [newShellMFE, setNewShellMFE] = useState('')
  const [newShellStrategy, setNewShellStrategy] = useState<LoadingStrategy>('lazy')
  const [newShellExact, setNewShellExact] = useState(false)

  // Форма для нового MFE
  const [newMFEName, setNewMFEName] = useState('')

  // Форма для internal route
  const [newRouteMFE, setNewRouteMFE] = useState('')
  const [newRoutePath, setNewRoutePath] = useState('')
  const [newRouteComponent, setNewRouteComponent] = useState('')
  const [newRouteIsIndex, setNewRouteIsIndex] = useState(false)

  const errors = validateConfig(shellRoutes, mfeGroups)

  const addShellRoute = () => {
    if (!newShellPath.trim()) return
    setShellRoutes(prev => [
      ...prev,
      {
        id: genId(),
        pathPattern: newShellPath.trim(),
        mfeName: newShellMFE.trim(),
        strategy: newShellStrategy,
        exact: newShellExact,
      },
    ])
    setNewShellPath('')
    setNewShellMFE('')
  }

  const removeShellRoute = (id: string) => {
    setShellRoutes(prev => prev.filter(r => r.id !== id))
  }

  const moveShellRoute = (id: string, dir: 'up' | 'down') => {
    setShellRoutes(prev => {
      const idx = prev.findIndex(r => r.id === id)
      if (idx < 0) return prev
      const next = [...prev]
      const swapIdx = dir === 'up' ? idx - 1 : idx + 1
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
      return next
    })
  }

  const addMFEGroup = () => {
    const name = newMFEName.trim().toLowerCase()
    if (!name || mfeGroups.some(g => g.mfeName === name)) return
    setMFEGroups(prev => [...prev, { mfeName: name, routes: [] }])
    setExpandedMFEs(prev => new Set([...prev, name]))
    setNewMFEName('')
  }

  const removeMFEGroup = (mfeName: string) => {
    setMFEGroups(prev => prev.filter(g => g.mfeName !== mfeName))
  }

  const addInternalRoute = () => {
    if (!newRouteMFE || !newRoutePath.trim() || !newRouteComponent.trim()) return
    setMFEGroups(prev =>
      prev.map(g =>
        g.mfeName === newRouteMFE
          ? {
              ...g,
              routes: [
                ...g.routes,
                {
                  id: genId(),
                  relativePath: newRoutePath.trim(),
                  componentName: newRouteComponent.trim(),
                  isIndex: newRouteIsIndex,
                },
              ],
            }
          : g,
      ),
    )
    setNewRoutePath('')
    setNewRouteComponent('')
    setNewRouteIsIndex(false)
  }

  const removeInternalRoute = (mfeName: string, routeId: string) => {
    setMFEGroups(prev =>
      prev.map(g =>
        g.mfeName === mfeName ? { ...g, routes: g.routes.filter(r => r.id !== routeId) } : g,
      ),
    )
  }

  const toggleExpanded = (mfeName: string) => {
    setExpandedMFEs(prev => {
      const next = new Set(prev)
      if (next.has(mfeName)) next.delete(mfeName)
      else next.add(mfeName)
      return next
    })
  }

  const inputStyle: React.CSSProperties = {
    padding: '5px 8px',
    background: '#1a1a1a',
    border: '1px solid #444',
    borderRadius: 4,
    color: '#fff',
    fontSize: 12,
    fontFamily: 'monospace',
  }

  const btnStyle = (color: string): React.CSSProperties => ({
    padding: '5px 10px',
    background: color,
    border: 'none',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    fontSize: 12,
    fontWeight: 600,
  })

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto', padding: 16 }}>
      <h2 style={{ color: '#fff', marginTop: 0 }}>Конструктор таблицы маршрутов</h2>

      {/* Ошибки валидации */}
      {errors.length > 0 && (
        <div
          style={{
            background: '#2d0a0a',
            border: '1px solid #f44336',
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ color: '#f44336', fontWeight: 700, marginBottom: 6 }}>
            Ошибки валидации ({errors.length})
          </div>
          {errors.map((e, i) => (
            <div key={i} style={{ color: '#ef9a9a', fontSize: 12, marginBottom: 2 }}>
              [{e.field}] {e.message}
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {/* Левая панель: конструктор */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Shell Routes */}
          <div
            style={{
              background: '#111',
              border: '1px solid #4caf50',
              borderRadius: 8,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div style={{ color: '#4caf50', fontWeight: 700, marginBottom: 10 }}>
              Shell Routes
            </div>

            {/* Таблица */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 10 }}>
              <thead>
                <tr style={{ color: '#888', fontSize: 11 }}>
                  <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #333' }}>Path</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #333' }}>MFE</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #333' }}>Strategy</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #333' }}>Exact</th>
                  <th style={{ textAlign: 'left', padding: '4px 8px', borderBottom: '1px solid #333' }}></th>
                </tr>
              </thead>
              <tbody>
                {shellRoutes.map((route, idx) => (
                  <tr key={route.id} style={{ fontSize: 12 }}>
                    <td style={{ padding: '4px 8px', fontFamily: 'monospace', color: '#7ec8e3' }}>
                      {route.pathPattern || <span style={{ color: '#555' }}>—</span>}
                    </td>
                    <td style={{ padding: '4px 8px', color: route.mfeName ? '#ffcc02' : '#555' }}>
                      {route.mfeName || '—'}
                    </td>
                    <td style={{ padding: '4px 8px' }}>
                      <span
                        style={{
                          background: route.strategy === 'lazy' ? '#1a2d4a' : '#1a3a1a',
                          color: route.strategy === 'lazy' ? '#64b5f6' : '#81c784',
                          padding: '2px 6px',
                          borderRadius: 3,
                          fontSize: 11,
                        }}
                      >
                        {route.strategy}
                      </span>
                    </td>
                    <td style={{ padding: '4px 8px', color: route.exact ? '#81c784' : '#888' }}>
                      {route.exact ? 'да' : 'нет'}
                    </td>
                    <td style={{ padding: '4px 8px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button
                          onClick={() => moveShellRoute(route.id, 'up')}
                          disabled={idx === 0}
                          style={{ ...btnStyle('#333'), padding: '2px 6px', opacity: idx === 0 ? 0.3 : 1 }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => moveShellRoute(route.id, 'down')}
                          disabled={idx === shellRoutes.length - 1}
                          style={{ ...btnStyle('#333'), padding: '2px 6px', opacity: idx === shellRoutes.length - 1 ? 0.3 : 1 }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => removeShellRoute(route.id)}
                          style={{ ...btnStyle('#c62828'), padding: '2px 6px' }}
                        >
                          ✕
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Форма добавления shell route */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                value={newShellPath}
                onChange={e => setNewShellPath(e.target.value)}
                placeholder="/path/*"
                style={{ ...inputStyle, width: 120 }}
              />
              <input
                value={newShellMFE}
                onChange={e => setNewShellMFE(e.target.value)}
                placeholder="mfe-name"
                style={{ ...inputStyle, width: 100 }}
              />
              <select
                value={newShellStrategy}
                onChange={e => setNewShellStrategy(e.target.value as LoadingStrategy)}
                style={{ ...inputStyle }}
              >
                <option value="lazy">lazy</option>
                <option value="eager">eager</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#aaa', fontSize: 12, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newShellExact}
                  onChange={e => setNewShellExact(e.target.checked)}
                />
                exact
              </label>
              <button onClick={addShellRoute} style={btnStyle('#4caf50')}>
                + Добавить
              </button>
            </div>
          </div>

          {/* MFE Internal Routes */}
          <div
            style={{
              background: '#111',
              border: '1px solid #2196f3',
              borderRadius: 8,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <div style={{ color: '#2196f3', fontWeight: 700, marginBottom: 10 }}>
              MFE Internal Routes
            </div>

            {mfeGroups.map(group => (
              <div
                key={group.mfeName}
                style={{
                  background: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: 6,
                  marginBottom: 8,
                  overflow: 'hidden',
                }}
              >
                {/* MFE header */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px',
                    background: '#222',
                    cursor: 'pointer',
                    gap: 8,
                  }}
                  onClick={() => toggleExpanded(group.mfeName)}
                >
                  <span style={{ color: '#ffcc02', fontWeight: 700, fontSize: 13 }}>
                    {expandedMFEs.has(group.mfeName) ? '▼' : '▶'} {group.mfeName}
                  </span>
                  <span style={{ color: '#666', fontSize: 11 }}>
                    {group.routes.length} маршрут{group.routes.length === 1 ? '' : group.routes.length < 5 ? 'а' : 'ов'}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); removeMFEGroup(group.mfeName) }}
                    style={{ ...btnStyle('#c62828'), marginLeft: 'auto', padding: '2px 8px', fontSize: 11 }}
                  >
                    Удалить MFE
                  </button>
                </div>

                {expandedMFEs.has(group.mfeName) && (
                  <div style={{ padding: '10px 12px' }}>
                    {group.routes.map(route => (
                      <div
                        key={route.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                          fontSize: 12,
                        }}
                      >
                        <span style={{ fontFamily: 'monospace', color: '#7ec8e3', width: 160 }}>
                          {route.relativePath}
                        </span>
                        <span style={{ color: '#ce93d8' }}>{route.componentName}</span>
                        {route.isIndex && (
                          <span style={{ background: '#1a3a1a', color: '#81c784', padding: '1px 5px', borderRadius: 3, fontSize: 10 }}>
                            index
                          </span>
                        )}
                        <button
                          onClick={() => removeInternalRoute(group.mfeName, route.id)}
                          style={{ ...btnStyle('#555'), padding: '1px 6px', marginLeft: 'auto' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}

                    {/* Форма добавления internal route */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8, paddingTop: 8, borderTop: '1px solid #333' }}>
                      <select
                        value={newRouteMFE}
                        onChange={e => setNewRouteMFE(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="">MFE...</option>
                        {mfeGroups.map(g => (
                          <option key={g.mfeName} value={g.mfeName}>{g.mfeName}</option>
                        ))}
                      </select>
                      <input
                        value={newRoutePath}
                        onChange={e => setNewRoutePath(e.target.value)}
                        placeholder="/path"
                        style={{ ...inputStyle, width: 120 }}
                      />
                      <input
                        value={newRouteComponent}
                        onChange={e => setNewRouteComponent(e.target.value)}
                        placeholder="ComponentName"
                        style={{ ...inputStyle, width: 130 }}
                      />
                      <label style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#aaa', fontSize: 12, cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={newRouteIsIndex}
                          onChange={e => setNewRouteIsIndex(e.target.checked)}
                        />
                        index
                      </label>
                      <button
                        onClick={() => {
                          if (!newRouteMFE) setNewRouteMFE(group.mfeName)
                          addInternalRoute()
                        }}
                        style={btnStyle('#2196f3')}
                      >
                        + Маршрут
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Добавить новый MFE */}
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <input
                value={newMFEName}
                onChange={e => setNewMFEName(e.target.value)}
                placeholder="new-mfe-name"
                style={{ ...inputStyle, flex: 1 }}
                onKeyDown={e => e.key === 'Enter' && addMFEGroup()}
              />
              <button onClick={addMFEGroup} style={btnStyle('#0288d1')}>
                + Добавить MFE
              </button>
            </div>
          </div>
        </div>

        {/* Правая панель: preview */}
        <div style={{ flex: '0 0 380px' }}>
          <div
            style={{
              background: '#111',
              border: '1px solid #555',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {/* Табы */}
            <div style={{ display: 'flex', borderBottom: '1px solid #333' }}>
              {(['json', 'jsx'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setPreviewTab(tab)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: previewTab === tab ? '#222' : 'transparent',
                    border: 'none',
                    borderBottom: previewTab === tab ? '2px solid #2196f3' : '2px solid transparent',
                    color: previewTab === tab ? '#fff' : '#888',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: previewTab === tab ? 700 : 400,
                  }}
                >
                  {tab === 'json' ? 'router.config.json' : 'React Router JSX'}
                </button>
              ))}
            </div>

            {/* Статус валидации */}
            <div
              style={{
                padding: '6px 14px',
                background: errors.length === 0 ? '#0d2b0d' : '#2d0a0a',
                borderBottom: '1px solid #333',
                fontSize: 12,
                color: errors.length === 0 ? '#81c784' : '#ef9a9a',
              }}
            >
              {errors.length === 0 ? '✓ Конфигурация валидна' : `✕ ${errors.length} ошибок`}
            </div>

            <pre
              style={{
                margin: 0,
                padding: 14,
                fontSize: 11,
                fontFamily: 'monospace',
                color: '#a8c8e8',
                overflowX: 'auto',
                overflowY: 'auto',
                maxHeight: 520,
                background: '#0d0d0d',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {previewTab === 'json'
                ? generateJSON(shellRoutes, mfeGroups)
                : generateJSX(shellRoutes, mfeGroups)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
