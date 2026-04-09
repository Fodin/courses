import { useState, useEffect, useRef } from 'react'

// =====================================================
// Task 4.1: Single-SPA Lifecycle Visualizer
// =====================================================

type AppState =
  | 'NOT_LOADED'
  | 'LOADING'
  | 'NOT_BOOTSTRAPPED'
  | 'BOOTSTRAPPING'
  | 'NOT_MOUNTED'
  | 'MOUNTING'
  | 'MOUNTED'
  | 'UNMOUNTING'

interface AppStatus {
  name: string
  state: AppState
  activeWhen: string
  framework: string
  color: string
}

interface LogEntry {
  id: number
  timestamp: number
  app: string
  event: string
  color: string
}

type TimelinePhase = {
  app: string
  phase: string
  startMs: number
  durationMs: number
  color: string
}

const STATE_COLORS: Record<AppState, { bg: string; text: string; border: string }> = {
  NOT_LOADED: { bg: '#f5f5f5', text: '#9e9e9e', border: '#e0e0e0' },
  LOADING: { bg: '#fff8e1', text: '#f57f17', border: '#ffcc02' },
  NOT_BOOTSTRAPPED: { bg: '#e8f5e9', text: '#388e3c', border: '#a5d6a7' },
  BOOTSTRAPPING: { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9' },
  NOT_MOUNTED: { bg: '#f3e5f5', text: '#7b1fa2', border: '#ce93d8' },
  MOUNTING: { bg: '#fff3e0', text: '#e65100', border: '#ffcc80' },
  MOUNTED: { bg: '#e8f5e9', text: '#1b5e20', border: '#4caf50' },
  UNMOUNTING: { bg: '#ffebee', text: '#b71c1c', border: '#ef9a9a' },
}

const STATE_LABELS: Record<AppState, string> = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  NOT_BOOTSTRAPPED: 'NOT_BOOTSTRAPPED',
  BOOTSTRAPPING: 'BOOTSTRAPPING',
  NOT_MOUNTED: 'NOT_MOUNTED',
  MOUNTING: 'MOUNTING',
  MOUNTED: 'MOUNTED',
  UNMOUNTING: 'UNMOUNTING',
}

const ROUTES: { path: string; label: string; apps: string[] }[] = [
  { path: '/', label: 'Главная', apps: ['shell', 'navbar'] },
  { path: '/catalog', label: 'Каталог', apps: ['shell', 'navbar', 'catalog'] },
  { path: '/cart', label: 'Корзина', apps: ['shell', 'navbar', 'cart'] },
  { path: '/profile', label: 'Профиль', apps: ['shell', 'navbar', 'profile'] },
  { path: '/admin', label: 'Админка', apps: ['shell', 'admin'] },
]

const INITIAL_APPS: AppStatus[] = [
  { name: 'shell', state: 'MOUNTED', activeWhen: '/', framework: 'React', color: '#1565c0' },
  { name: 'navbar', state: 'MOUNTED', activeWhen: '/catalog', framework: 'React', color: '#7b1fa2' },
  { name: 'catalog', state: 'NOT_LOADED', activeWhen: '/catalog', framework: 'Vue', color: '#2e7d32' },
  { name: 'cart', state: 'NOT_LOADED', activeWhen: '/cart', framework: 'React', color: '#e65100' },
  { name: 'profile', state: 'NOT_LOADED', activeWhen: '/profile', framework: 'Angular', color: '#880e4f' },
  { name: 'admin', state: 'NOT_LOADED', activeWhen: '/admin', framework: 'Svelte', color: '#bf360c' },
]

let logCounter = 0

function makeLog(app: string, event: string, color: string): LogEntry {
  return { id: logCounter++, timestamp: Date.now(), app, event, color }
}

async function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms))
}

export function Task4_1_Solution() {
  const [currentPath, setCurrentPath] = useState('/')
  const [apps, setApps] = useState<AppStatus[]>(INITIAL_APPS)
  const [logs, setLogs] = useState<LogEntry[]>([
    makeLog('shell', 'bootstrap started', '#1565c0'),
    makeLog('shell', 'bootstrap complete', '#1565c0'),
    makeLog('shell', 'mount started', '#1565c0'),
    makeLog('shell', 'mounted', '#1565c0'),
    makeLog('navbar', 'bootstrap started', '#7b1fa2'),
    makeLog('navbar', 'bootstrap complete', '#7b1fa2'),
    makeLog('navbar', 'mount started', '#7b1fa2'),
    makeLog('navbar', 'mounted', '#7b1fa2'),
  ])
  const [timeline, setTimeline] = useState<TimelinePhase[]>([])
  const [navigating, setNavigating] = useState(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  function addLog(app: string, event: string, color: string) {
    setLogs(prev => [...prev.slice(-40), makeLog(app, event, color)])
  }

  function updateAppState(name: string, state: AppState) {
    setApps(prev => prev.map(a => a.name === name ? { ...a, state } : a))
  }

  async function navigate(route: typeof ROUTES[0]) {
    if (navigating || route.path === currentPath) return
    setNavigating(true)

    const startTime = Date.now()
    const newTimeline: TimelinePhase[] = []

    // Find apps to unmount (currently MOUNTED but not in new route)
    const appsToUnmount = apps.filter(a =>
      a.state === 'MOUNTED' && !route.apps.includes(a.name)
    )

    // Find apps to mount (in new route but not currently MOUNTED)
    const appsToMount = apps.filter(a =>
      route.apps.includes(a.name) && a.state !== 'MOUNTED'
    )

    // Step 1: Unmount current apps
    for (const app of appsToUnmount) {
      const t0 = Date.now() - startTime
      updateAppState(app.name, 'UNMOUNTING')
      addLog(app.name, 'unmount started', app.color)
      await sleep(400)
      updateAppState(app.name, 'NOT_MOUNTED')
      addLog(app.name, 'unmounted', app.color)
      newTimeline.push({ app: app.name, phase: 'unmount', startMs: t0, durationMs: Date.now() - startTime - t0, color: '#ef9a9a' })
    }

    setCurrentPath(route.path)

    // Step 2: Load, bootstrap, mount new apps
    for (const app of appsToMount) {
      const appObj = apps.find(a => a.name === app.name)!
      let t0 = Date.now() - startTime

      if (app.state === 'NOT_LOADED') {
        updateAppState(app.name, 'LOADING')
        addLog(app.name, 'loading started', appObj.color)
        await sleep(300)
        updateAppState(app.name, 'NOT_BOOTSTRAPPED')
        addLog(app.name, 'loaded', appObj.color)
        newTimeline.push({ app: app.name, phase: 'load', startMs: t0, durationMs: 300, color: '#ffcc80' })
        t0 = Date.now() - startTime
      }

      if (app.state === 'NOT_LOADED' || app.state === 'NOT_BOOTSTRAPPED') {
        updateAppState(app.name, 'BOOTSTRAPPING')
        addLog(app.name, 'bootstrap started', appObj.color)
        await sleep(250)
        updateAppState(app.name, 'NOT_MOUNTED')
        addLog(app.name, 'bootstrap complete', appObj.color)
        newTimeline.push({ app: app.name, phase: 'bootstrap', startMs: t0, durationMs: 250, color: '#90caf9' })
        t0 = Date.now() - startTime
      }

      updateAppState(app.name, 'MOUNTING')
      addLog(app.name, 'mount started', appObj.color)
      await sleep(200)
      updateAppState(app.name, 'MOUNTED')
      addLog(app.name, 'mounted', appObj.color)
      newTimeline.push({ app: app.name, phase: 'mount', startMs: t0, durationMs: 200, color: '#a5d6a7' })
    }

    setTimeline(newTimeline)
    setNavigating(false)
  }

  const totalDuration = timeline.reduce((max, t) => Math.max(max, t.startMs + t.durationMs), 1)

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 820 }}>
      <h3 style={{ marginTop: 0, fontSize: 18, color: '#1a1a2e' }}>
        Визуализатор lifecycle Single-SPA
      </h3>

      {/* Navigation */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 8 }}>НАВИГАЦИЯ (симуляция)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {ROUTES.map(route => (
            <button
              key={route.path}
              onClick={() => navigate(route)}
              disabled={navigating || route.path === currentPath}
              style={{
                padding: '7px 14px',
                borderRadius: 6,
                border: `2px solid ${route.path === currentPath ? '#1976d2' : '#ddd'}`,
                background: route.path === currentPath ? '#e3f2fd' : navigating ? '#f5f5f5' : '#fff',
                color: route.path === currentPath ? '#1565c0' : navigating ? '#bbb' : '#444',
                cursor: navigating || route.path === currentPath ? 'default' : 'pointer',
                fontSize: 13,
                fontWeight: route.path === currentPath ? 700 : 400,
                transition: 'all 0.2s',
              }}
            >
              {route.label}
              <span style={{ fontSize: 10, color: '#999', marginLeft: 4 }}>{route.path}</span>
            </button>
          ))}
        </div>
        {navigating && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#1976d2', fontWeight: 600 }}>
            Выполняется переход... Single-SPA оркестрирует lifecycle
          </div>
        )}
      </div>

      {/* App states grid */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 8 }}>СОСТОЯНИЯ ПРИЛОЖЕНИЙ</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {apps.map(app => {
            const colors = STATE_COLORS[app.state]
            return (
              <div
                key={app.name}
                style={{
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: 8,
                  padding: '10px 12px',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: app.color }}>
                    {app.name}
                  </span>
                  <span style={{
                    fontSize: 10,
                    background: '#f5f5f5',
                    border: '1px solid #e0e0e0',
                    borderRadius: 4,
                    padding: '1px 5px',
                    color: '#666',
                  }}>
                    {app.framework}
                  </span>
                </div>
                <div style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: colors.text,
                  fontFamily: 'monospace',
                  padding: '2px 0',
                }}>
                  {STATE_LABELS[app.state]}
                </div>
                <div style={{ fontSize: 10, color: '#999', marginTop: 2 }}>
                  activeWhen: {app.activeWhen}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 8 }}>
            ВРЕМЕННАЯ ШКАЛА ПОСЛЕДНЕГО ПЕРЕХОДА (мс)
          </div>
          <div style={{ background: '#fafafa', border: '1px solid #e0e0e0', borderRadius: 8, padding: '12px 14px' }}>
            {timeline.map((phase, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ width: 80, fontSize: 11, color: '#666', textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ fontWeight: 600, color: '#444' }}>{phase.app}</span>
                </div>
                <div style={{ flex: 1, position: 'relative', height: 20 }}>
                  <div style={{
                    position: 'absolute',
                    left: `${(phase.startMs / totalDuration) * 100}%`,
                    width: `${Math.max((phase.durationMs / totalDuration) * 100, 4)}%`,
                    height: '100%',
                    background: phase.color,
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#333',
                    transition: 'all 0.3s',
                  }}>
                    {phase.phase}
                  </div>
                </div>
                <div style={{ width: 50, fontSize: 10, color: '#999', flexShrink: 0 }}>
                  {phase.durationMs}мс
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event log */}
      <div>
        <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 8 }}>
          ЛОГ СОБЫТИЙ
        </div>
        <div style={{
          background: '#1a1a2e',
          borderRadius: 8,
          padding: '10px 14px',
          maxHeight: 160,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 12,
        }}>
          {logs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: 8, marginBottom: 3 }}>
              <span style={{ color: '#666', flexShrink: 0 }}>
                {new Date(log.timestamp).toISOString().substr(11, 8)}
              </span>
              <span style={{ color: log.color, fontWeight: 600, minWidth: 60 }}>{log.app}</span>
              <span style={{ color: '#e0e0e0' }}>{log.event}</span>
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  )
}

// =====================================================
// Task 4.2: Root Config Builder
// =====================================================

type Framework = 'React' | 'Vue' | 'Angular' | 'Svelte' | 'Vanilla'

interface AppConfig {
  id: string
  name: string
  framework: Framework
  activeWhen: string
  moduleSystem: 'import' | 'SystemJS'
}

function generateRootConfig(appConfigs: AppConfig[]): string {
  if (appConfigs.length === 0) return '// Добавьте хотя бы одно приложение'

  const registerCalls = appConfigs
    .map(app => {
      const loadFn = app.moduleSystem === 'SystemJS'
        ? `() => System.import('@company/${app.name}')`
        : `() => import('@company/${app.name}')`

      let activeWhenValue: string
      if (app.activeWhen === '/') {
        activeWhenValue = `location => location.pathname === '/'`
      } else {
        activeWhenValue = `'${app.activeWhen}'`
      }

      return `  registerApplication({
    name: '@company/${app.name}',
    app: ${loadFn},
    activeWhen: ${activeWhenValue},
  })`
    })
    .join(',\n\n')

  const imports = appConfigs[0].moduleSystem === 'SystemJS'
    ? `import { registerApplication, start } from 'single-spa'`
    : `import { registerApplication, start } from 'single-spa'`

  return `// root-config.js — Single-SPA Root Config
// Generated ${new Date().toISOString().split('T')[0]}

${imports}

// Register each micro-frontend application
${registerCalls}

// Start the single-spa orchestrator
start({
  urlRerouteOnly: true, // prevent popstate on every navigation
})`
}

function validateApps(appConfigs: AppConfig[]): Record<string, string[]> {
  const errors: Record<string, string[]> = {}

  const names = appConfigs.map(a => a.name)
  const routes = appConfigs.map(a => a.activeWhen)

  appConfigs.forEach(app => {
    const errs: string[] = []

    if (!app.name.trim()) {
      errs.push('Имя не может быть пустым')
    } else if (!/^[a-z][a-z0-9-]*$/.test(app.name)) {
      errs.push('Только строчные буквы, цифры и дефис')
    } else if (names.filter(n => n === app.name).length > 1) {
      errs.push('Имя должно быть уникальным')
    }

    if (!app.activeWhen.trim()) {
      errs.push('activeWhen не может быть пустым')
    } else if (!app.activeWhen.startsWith('/')) {
      errs.push('Должен начинаться с /')
    } else {
      // Check for exact duplicates
      if (routes.filter(r => r === app.activeWhen).length > 1) {
        errs.push('Пересечение маршрутов с другим приложением')
      }
    }

    if (errs.length > 0) errors[app.id] = errs
  })

  return errors
}

function newAppConfig(): AppConfig {
  return {
    id: Math.random().toString(36).slice(2),
    name: '',
    framework: 'React',
    activeWhen: '/',
    moduleSystem: 'SystemJS',
  }
}

const FRAMEWORK_COLORS: Record<Framework, string> = {
  React: '#61dafb',
  Vue: '#42b883',
  Angular: '#dd0031',
  Svelte: '#ff3e00',
  Vanilla: '#f0db4f',
}

export function Task4_2_Solution() {
  const [appConfigs, setAppConfigs] = useState<AppConfig[]>([
    { id: 'a1', name: 'shell', framework: 'React', activeWhen: '/', moduleSystem: 'SystemJS' },
    { id: 'a2', name: 'catalog', framework: 'Vue', activeWhen: '/catalog', moduleSystem: 'SystemJS' },
    { id: 'a3', name: 'cart', framework: 'React', activeWhen: '/cart', moduleSystem: 'SystemJS' },
  ])
  const [showCode, setShowCode] = useState(true)

  const errors = validateApps(appConfigs)
  const isValid = Object.keys(errors).length === 0

  function updateApp(id: string, patch: Partial<AppConfig>) {
    setAppConfigs(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a))
  }

  function removeApp(id: string) {
    setAppConfigs(prev => prev.filter(a => a.id !== id))
  }

  function addApp() {
    setAppConfigs(prev => [...prev, newAppConfig()])
  }

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    padding: '5px 8px',
    border: `1px solid ${hasError ? '#f44336' : '#ddd'}`,
    borderRadius: 4,
    fontSize: 12,
    fontFamily: 'monospace',
    width: '100%',
    boxSizing: 'border-box',
    background: hasError ? '#fff5f5' : '#fff',
  })

  const selectStyle: React.CSSProperties = {
    padding: '5px 8px',
    border: '1px solid #ddd',
    borderRadius: 4,
    fontSize: 12,
    width: '100%',
    background: '#fff',
  }

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 860 }}>
      <h3 style={{ marginTop: 0, fontSize: 18, color: '#1a1a2e' }}>
        Конструктор root config Single-SPA
      </h3>

      {/* App list */}
      <div style={{ marginBottom: 12 }}>
        {appConfigs.map(app => {
          const appErrors = errors[app.id] || []
          return (
            <div
              key={app.id}
              style={{
                background: '#fafafa',
                border: `1px solid ${appErrors.length > 0 ? '#f44336' : '#e0e0e0'}`,
                borderRadius: 8,
                padding: '12px 14px',
                marginBottom: 8,
              }}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                {/* Framework badge */}
                <div style={{
                  width: 8,
                  background: FRAMEWORK_COLORS[app.framework],
                  borderRadius: 4,
                  flexShrink: 0,
                  alignSelf: 'stretch',
                  minHeight: 40,
                }} />

                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>Имя</div>
                    <input
                      style={inputStyle(appErrors.some(e => e.includes('Имя')))}
                      value={app.name}
                      onChange={e => updateApp(app.id, { name: e.target.value })}
                      placeholder="catalog-app"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>Framework</div>
                    <select
                      style={selectStyle}
                      value={app.framework}
                      onChange={e => updateApp(app.id, { framework: e.target.value as Framework })}
                    >
                      {(['React', 'Vue', 'Angular', 'Svelte', 'Vanilla'] as Framework[]).map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>activeWhen</div>
                    <input
                      style={inputStyle(appErrors.some(e => e.includes('маршрут') || e.includes('activeWhen') || e.includes('/')))}
                      value={app.activeWhen}
                      onChange={e => updateApp(app.id, { activeWhen: e.target.value })}
                      placeholder="/catalog"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#888', fontWeight: 600, marginBottom: 3, textTransform: 'uppercase' }}>Загрузчик</div>
                    <select
                      style={selectStyle}
                      value={app.moduleSystem}
                      onChange={e => updateApp(app.id, { moduleSystem: e.target.value as 'import' | 'SystemJS' })}
                    >
                      <option value="SystemJS">System.import()</option>
                      <option value="import">import()</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => removeApp(app.id)}
                  style={{
                    padding: '4px 10px',
                    background: '#ffebee',
                    color: '#c62828',
                    border: '1px solid #ef9a9a',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontSize: 12,
                    flexShrink: 0,
                    alignSelf: 'center',
                  }}
                >
                  удалить
                </button>
              </div>

              {appErrors.length > 0 && (
                <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {appErrors.map((err, i) => (
                    <span key={i} style={{
                      fontSize: 11,
                      color: '#c62828',
                      background: '#ffebee',
                      padding: '2px 8px',
                      borderRadius: 10,
                    }}>
                      {err}
                    </span>
                  ))}
                </div>
              )}

              {/* Generated load function preview */}
              <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'monospace', color: '#666' }}>
                app: {app.moduleSystem === 'SystemJS'
                  ? `() => System.import('@company/${app.name || 'app-name'}')`
                  : `() => import('@company/${app.name || 'app-name'}')`}
              </div>
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={addApp}
          style={{
            padding: '7px 16px',
            background: '#e8f5e9',
            color: '#2e7d32',
            border: '1px solid #a5d6a7',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          + Добавить приложение
        </button>
        <button
          onClick={() => setShowCode(v => !v)}
          style={{
            padding: '7px 16px',
            background: '#e3f2fd',
            color: '#1565c0',
            border: '1px solid #90caf9',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {showCode ? 'Скрыть код' : 'Показать код'}
        </button>
        {!isValid && (
          <span style={{ fontSize: 12, color: '#f44336', fontWeight: 600 }}>
            Исправьте ошибки конфигурации
          </span>
        )}
        {isValid && appConfigs.length > 0 && (
          <span style={{ fontSize: 12, color: '#2e7d32', fontWeight: 600 }}>
            {appConfigs.length} приложений — root config готов
          </span>
        )}
      </div>

      {/* Code preview */}
      {showCode && (
        <div>
          <div style={{ fontSize: 12, color: '#666', marginBottom: 6, fontWeight: 600 }}>
            СГЕНЕРИРОВАННЫЙ root-config.js
          </div>
          <div style={{
            background: '#1a1a2e',
            borderRadius: 8,
            padding: '14px 16px',
            fontFamily: 'monospace',
            fontSize: 12,
            color: '#e0e0e0',
            overflowX: 'auto',
            lineHeight: 1.6,
          }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', opacity: isValid ? 1 : 0.5 }}>
              {generateRootConfig(appConfigs)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// Task 4.3: Module Federation vs Single-SPA Decision Matrix
// =====================================================

interface Criterion {
  id: string
  label: string
  description: string
  options: { value: string; label: string; mfScore: number; sspaScore: number; comboScore: number }[]
  selected: string
}

const INITIAL_CRITERIA: Criterion[] = [
  {
    id: 'code-sharing',
    label: 'Runtime code sharing',
    description: 'Нужно ли переиспользовать компоненты или библиотеки между MFE в runtime?',
    options: [
      { value: 'no', label: 'Нет, каждый MFE самодостаточен', mfScore: 0, sspaScore: 3, comboScore: 1 },
      { value: 'partial', label: 'Частично (общий дизайн-система)', mfScore: 2, sspaScore: 1, comboScore: 3 },
      { value: 'yes', label: 'Да, много общего кода', mfScore: 3, sspaScore: 0, comboScore: 3 },
    ],
    selected: 'partial',
  },
  {
    id: 'frameworks',
    label: 'Количество фреймворков',
    description: 'Сколько разных JS-фреймворков используют команды?',
    options: [
      { value: 'one', label: 'Один фреймворк', mfScore: 3, sspaScore: 1, comboScore: 2 },
      { value: 'two-three', label: '2-3 фреймворка', mfScore: 1, sspaScore: 3, comboScore: 3 },
      { value: 'many', label: 'Много (legacy + новые)', mfScore: 0, sspaScore: 3, comboScore: 2 },
    ],
    selected: 'one',
  },
  {
    id: 'isolation',
    label: 'Строгая изоляция',
    description: 'Критична ли полная JS/CSS изоляция между приложениями?',
    options: [
      { value: 'no', label: 'Нет, команды доверяют друг другу', mfScore: 3, sspaScore: 2, comboScore: 2 },
      { value: 'partial', label: 'Частично', mfScore: 2, sspaScore: 2, comboScore: 2 },
      { value: 'yes', label: 'Да, полная изоляция обязательна', mfScore: 1, sspaScore: 1, comboScore: 1 },
    ],
    selected: 'no',
  },
  {
    id: 'team-size',
    label: 'Размер команды',
    description: 'Сколько разработчиков работает над системой?',
    options: [
      { value: 'small', label: '1-3 человека', mfScore: 2, sspaScore: 1, comboScore: 0 },
      { value: 'medium', label: '3-10 человек', mfScore: 3, sspaScore: 2, comboScore: 2 },
      { value: 'large', label: '10+ человек / несколько команд', mfScore: 2, sspaScore: 3, comboScore: 3 },
    ],
    selected: 'medium',
  },
  {
    id: 'independent-deploy',
    label: 'Независимый деплой',
    description: 'Насколько важна возможность деплоить каждый MFE независимо?',
    options: [
      { value: 'no', label: 'Не критично, деплоим вместе', mfScore: 2, sspaScore: 1, comboScore: 1 },
      { value: 'important', label: 'Желательно', mfScore: 2, sspaScore: 2, comboScore: 2 },
      { value: 'critical', label: 'Критично, разные CI/CD пайплайны', mfScore: 2, sspaScore: 3, comboScore: 3 },
    ],
    selected: 'important',
  },
  {
    id: 'legacy',
    label: 'Legacy-код',
    description: 'Есть ли legacy-приложения (jQuery, AngularJS, Backbone), которые нужно интегрировать?',
    options: [
      { value: 'no', label: 'Нет, всё на современных фреймворках', mfScore: 3, sspaScore: 1, comboScore: 2 },
      { value: 'some', label: 'Немного (одно-два старых приложения)', mfScore: 1, sspaScore: 2, comboScore: 3 },
      { value: 'lots', label: 'Много legacy, нужна постепенная миграция', mfScore: 0, sspaScore: 3, comboScore: 2 },
    ],
    selected: 'no',
  },
  {
    id: 'routing',
    label: 'Единый роутинг',
    description: 'Нужен ли централизованный роутинг с контролем над всеми маршрутами?',
    options: [
      { value: 'no', label: 'Нет, каждый MFE управляет своими роутами', mfScore: 2, sspaScore: 1, comboScore: 2 },
      { value: 'partial', label: 'Верхний уровень централизован', mfScore: 2, sspaScore: 2, comboScore: 3 },
      { value: 'yes', label: 'Да, полный контроль над всем URL-пространством', mfScore: 1, sspaScore: 3, comboScore: 2 },
    ],
    selected: 'partial',
  },
  {
    id: 'infra-budget',
    label: 'Инфраструктурный бюджет',
    description: 'Сколько ресурсов готовы вложить в инфраструктуру и инструментарий?',
    options: [
      { value: 'low', label: 'Минимальный — простые решения', mfScore: 2, sspaScore: 1, comboScore: 0 },
      { value: 'medium', label: 'Средний — можем настроить CI/CD, мониторинг', mfScore: 2, sspaScore: 2, comboScore: 2 },
      { value: 'high', label: 'Высокий — Platform Engineering команда', mfScore: 2, sspaScore: 2, comboScore: 3 },
    ],
    selected: 'medium',
  },
]

function calcScores(criteria: Criterion[]): { mf: number; sspa: number; combo: number; max: number } {
  let mf = 0, sspa = 0, combo = 0
  criteria.forEach(c => {
    const opt = c.options.find(o => o.value === c.selected)
    if (opt) {
      mf += opt.mfScore
      sspa += opt.sspaScore
      combo += opt.comboScore
    }
  })
  const max = criteria.length * 3
  return { mf, sspa, combo, max }
}

function getRecommendation(scores: ReturnType<typeof calcScores>): {
  primary: string
  reason: string
  tradeoffs: string[]
} {
  const { mf, sspa, combo } = scores
  const winner = mf >= sspa && mf >= combo ? 'mf'
    : sspa >= mf && sspa >= combo ? 'sspa'
    : 'combo'

  if (winner === 'mf') {
    return {
      primary: 'Module Federation',
      reason: 'Ваш проект ориентирован на единый стек с активным переиспользованием кода. Module Federation даст максимальную эффективность через shared библиотеки и минимальный bundle-дублирования.',
      tradeoffs: [
        'Привязка к webpack/vite-плагину — сложнее менять сборщик',
        'Версионные конфликты shared зависимостей требуют дисциплины',
        'Не лучший выбор при необходимости интеграции legacy-кода',
      ],
    }
  }

  if (winner === 'sspa') {
    return {
      primary: 'Single-SPA',
      reason: 'Ваш проект требует оркестрации независимых приложений, возможно с разными фреймворками или legacy-кодом. Single-SPA — фреймворк-агностичный оркестратор, идеален для этого сценария.',
      tradeoffs: [
        'Нет встроенного механизма переиспользования кода — нужен SystemJS или другой подход',
        'Кривая обучения: lifecycle API, root config, activity functions',
        'Большее количество шаблонного кода для каждого нового MFE',
      ],
    }
  }

  return {
    primary: 'Комбинация: Single-SPA + Module Federation',
    reason: 'Оптимальный выбор для зрелых MFE-архитектур: Single-SPA оркестрирует независимые приложения, Module Federation обеспечивает code sharing внутри связанных команд.',
    tradeoffs: [
      'Максимальная сложность — оба инструмента в связке',
      'Нужна Platform Engineering команда для поддержки инфраструктуры',
      'Зато покрывает все сценарии: независимость, переиспользование, legacy-интеграция',
    ],
  }
}

function RadarBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{label}</span>
        <span style={{ fontSize: 13, color: '#666' }}>{value}/{max}</span>
      </div>
      <div style={{ background: '#e0e0e0', borderRadius: 6, height: 10, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color,
          borderRadius: 6,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

export function Task4_3_Solution() {
  const [criteria, setCriteria] = useState<Criterion[]>(INITIAL_CRITERIA)

  function updateCriterion(id: string, value: string) {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, selected: value } : c))
  }

  const scores = calcScores(criteria)
  const maxPerTool = scores.max
  const rec = getRecommendation(scores)

  const toolScores = [
    { label: 'Module Federation', value: scores.mf, max: maxPerTool, color: '#1976d2' },
    { label: 'Single-SPA', value: scores.sspa, max: maxPerTool, color: '#7b1fa2' },
    { label: 'Комбинация обоих', value: scores.combo, max: maxPerTool, color: '#2e7d32' },
  ].sort((a, b) => b.value - a.value)

  return (
    <div className="exercise-container" style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 820 }}>
      <h3 style={{ marginTop: 0, fontSize: 18, color: '#1a1a2e' }}>
        Decision Matrix: Module Federation vs Single-SPA
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Criteria */}
        <div>
          <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 10 }}>
            КРИТЕРИИ ПРОЕКТА
          </div>
          {criteria.map(c => (
            <div
              key={c.id}
              style={{
                background: '#fafafa',
                border: '1px solid #e0e0e0',
                borderRadius: 8,
                padding: '10px 12px',
                marginBottom: 8,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a2e', marginBottom: 2 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 8 }}>
                {c.description}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {c.options.map(opt => (
                  <label
                    key={opt.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      padding: '4px 8px',
                      borderRadius: 4,
                      background: c.selected === opt.value ? '#e3f2fd' : 'transparent',
                      border: `1px solid ${c.selected === opt.value ? '#90caf9' : 'transparent'}`,
                      fontSize: 12,
                    }}
                  >
                    <input
                      type="radio"
                      name={c.id}
                      value={opt.value}
                      checked={c.selected === opt.value}
                      onChange={() => updateCriterion(c.id, opt.value)}
                      style={{ accentColor: '#1976d2' }}
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Results panel */}
        <div>
          <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 10 }}>
            РЕЗУЛЬТАТ АНАЛИЗА
          </div>

          {/* Score bars */}
          <div style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 12, color: '#888', marginBottom: 10, fontWeight: 600 }}>
              СРАВНЕНИЕ ПО БАЛЛАМ (из {maxPerTool})
            </div>
            {toolScores.map(ts => (
              <RadarBar key={ts.label} {...ts} />
            ))}
          </div>

          {/* Recommendation */}
          <div style={{
            background: '#e8f5e9',
            border: '2px solid #4caf50',
            borderRadius: 8,
            padding: '14px 16px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 4 }}>
              РЕКОМЕНДАЦИЯ
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1b5e20', marginBottom: 8 }}>
              {rec.primary}
            </div>
            <div style={{ fontSize: 12, color: '#2e7d32', lineHeight: 1.5, marginBottom: 10 }}>
              {rec.reason}
            </div>
            <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 6 }}>
              НА ЧТО ОБРАТИТЬ ВНИМАНИЕ:
            </div>
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {rec.tradeoffs.map((t, i) => (
                <li key={i} style={{ fontSize: 11, color: '#555', marginBottom: 3, lineHeight: 1.4 }}>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Key differences reference */}
          <div style={{
            background: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 11, color: '#666', fontWeight: 600, marginBottom: 8 }}>
              КЛЮЧЕВЫЕ ОТЛИЧИЯ
            </div>
            {[
              { aspect: 'Цель', mf: 'Code sharing', sspa: 'Оркестрация' },
              { aspect: 'Связь', mf: 'Compile-time + runtime', sspa: 'Runtime только' },
              { aspect: 'Фреймворки', mf: 'Один/несколько', sspa: 'Любые' },
              { aspect: 'Конфиг', mf: 'vite.config / webpack', sspa: 'root-config.js' },
              { aspect: 'Legacy', mf: 'Сложно', sspa: 'Легко' },
            ].map(row => (
              <div key={row.aspect} style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: 6, marginBottom: 4, fontSize: 11 }}>
                <span style={{ color: '#999', fontWeight: 600 }}>{row.aspect}</span>
                <span style={{ color: '#1565c0', background: '#e3f2fd', padding: '1px 6px', borderRadius: 3 }}>{row.mf}</span>
                <span style={{ color: '#7b1fa2', background: '#f3e5f5', padding: '1px 6px', borderRadius: 3 }}>{row.sspa}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
