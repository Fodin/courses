import { useState, useEffect, useMemo, useRef, useSyncExternalStore, useCallback } from 'react'

// ─── Task 7.1 ─────────────────────────────────────────────────────────────────

// V1: ручная подписка через useEffect (антипаттерн — для демонстрации)
function useMediaQueryV1(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  )

  useEffect(() => {
    const mql = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [query])

  return matches
}

// V2: useSyncExternalStore (правильный подход)
function useMediaQueryV2(query: string): boolean {
  // При изменении query пересоздаём subscribe и getSnapshot
  const { subscribe, getSnapshot } = useMemo(() => {
    const mql = typeof window !== 'undefined' ? window.matchMedia(query) : null
    return {
      subscribe: (callback: () => void) => {
        if (!mql) return () => {}
        mql.addEventListener('change', callback)
        return () => mql.removeEventListener('change', callback)
      },
      getSnapshot: () => mql ? mql.matches : false,
    }
  }, [query])

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => false, // SSR: по умолчанию false
  )
}

// Компонент для V1
function MediaQueryV1Demo({ query }: { query: string }) {
  const renderCount = useRef(0)
  renderCount.current += 1
  const matches = useMediaQueryV1(query)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #fca5a5',
      background: '#fff5f5',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#dc2626' }}>
        V1: useEffect + useState (антипаттерн)
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
        Делает лишний рендер при mount. Подвержен tearing в Concurrent Mode.
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: matches ? '#16a34a' : '#9ca3af',
          flexShrink: 0,
        }} />
        <span style={{ fontWeight: 600 }}>
          {query}: <code style={{ background: '#fee2e2', padding: '2px 6px', borderRadius: 4 }}>
            {String(matches)}
          </code>
        </span>
        <span style={{
          marginLeft: 'auto',
          background: '#fef2f2',
          border: '1px solid #fca5a5',
          borderRadius: 6,
          padding: '2px 10px',
          fontSize: 13,
          fontWeight: 600,
          color: '#dc2626',
        }}>
          Рендеров: {renderCount.current}
        </span>
      </div>
    </div>
  )
}

// Компонент для V2
function MediaQueryV2Demo({ query }: { query: string }) {
  const renderCount = useRef(0)
  renderCount.current += 1
  const matches = useMediaQueryV2(query)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #86efac',
      background: '#f0fdf4',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#15803d' }}>
        V2: useSyncExternalStore (правильно)
      </div>
      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>
        Один рендер при mount. Защита от tearing. SSR-safe через getServerSnapshot.
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{
          width: 14, height: 14, borderRadius: '50%',
          background: matches ? '#16a34a' : '#9ca3af',
          flexShrink: 0,
        }} />
        <span style={{ fontWeight: 600 }}>
          {query}: <code style={{ background: '#dcfce7', padding: '2px 6px', borderRadius: 4 }}>
            {String(matches)}
          </code>
        </span>
        <span style={{
          marginLeft: 'auto',
          background: '#f0fdf4',
          border: '1px solid #86efac',
          borderRadius: 6,
          padding: '2px 10px',
          fontSize: 13,
          fontWeight: 600,
          color: '#15803d',
        }}>
          Рендеров: {renderCount.current}
        </span>
      </div>
    </div>
  )
}

export function Task7_1_Solution() {
  const [query, setQuery] = useState('(max-width: 768px)')
  const queries = [
    '(max-width: 768px)',
    '(prefers-color-scheme: dark)',
    '(min-width: 1024px)',
  ]

  return (
    <div className="exercise-container">
      <h2>Задание 7.1: Manual Subscription vs useSyncExternalStore</h2>

      <div style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 8, fontWeight: 600, fontSize: 14 }}>Медиа-запрос:</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {queries.map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                background: query === q ? '#3b82f6' : 'white',
                color: query === q ? 'white' : '#374151',
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'monospace',
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <MediaQueryV1Demo query={query} />
        <MediaQueryV2Demo query={query} />
      </div>

      <div style={{
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 13,
        lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Ключевые отличия:</div>
        <div>
          <span style={{ color: '#f87171' }}>V1 (useEffect)</span>: mount → эффект → setState → +1 рендер.
          Между mount и useEffect есть "зазор", в котором значение может устареть.
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ color: '#4ade80' }}>V2 (useSyncExternalStore)</span>: getSnapshot вызывается
          прямо во время рендера — нет "зазора", нет лишнего рендера, нет tearing.
        </div>
        <div style={{ marginTop: 6 }}>
          Переключайте query — V2 переподписывается мгновенно через useMemo,
          V1 — через следующий useEffect.
        </div>
      </div>
    </div>
  )
}

// ─── Task 7.2 ─────────────────────────────────────────────────────────────────

type Listener = () => void

type Store<T> = {
  getState: () => T
  setState: (next: T | ((prev: T) => T)) => void
  subscribe: (listener: Listener) => () => void
}

function createStore<T>(initialState: T): Store<T> {
  let state = initialState
  const listeners = new Set<Listener>()

  return {
    getState: () => state,

    setState: (next) => {
      const nextState = typeof next === 'function'
        ? (next as (prev: T) => T)(state)
        : next
      // Не уведомляем listeners, если state не изменился
      if (Object.is(state, nextState)) return
      state = nextState
      listeners.forEach(l => l())
    },

    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

function useStore<T, S = T>(
  store: Store<T>,
  selector?: (state: T) => S
): S {
  const getSnapshot = useCallback(
    () => selector ? selector(store.getState()) : store.getState() as unknown as S,
    [store, selector]
  )

  return useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getSnapshot,
  )
}

// Глобальный store для счётчика
const counterStore = createStore({ count: 0 })

function CounterSubscriber() {
  const renderCount = useRef(0)
  renderCount.current += 1

  // Selector: только count (примитив — стабильно)
  const count = useStore(counterStore, s => s.count)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #bae6fd',
      background: '#f0f9ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#0369a1' }}>
        Counter (читает count)
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#0284c7', marginBottom: 12 }}>
        {count}
      </div>
      <button
        onClick={() => counterStore.setState(s => ({ count: s.count + 1 }))}
        style={{
          padding: '8px 20px',
          background: '#0284c7',
          color: 'white',
          border: 'none',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Increment
      </button>
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
        Рендеров: <strong style={{ color: '#0369a1' }}>{renderCount.current}</strong>
      </div>
    </div>
  )
}

function DoubleCounterSubscriber() {
  const renderCount = useRef(0)
  renderCount.current += 1

  // Selector: count * 2 — примитив, безопасно
  const doubled = useStore(counterStore, s => s.count * 2)

  return (
    <div style={{
      padding: 14,
      borderRadius: 8,
      border: '2px solid #d8b4fe',
      background: '#faf5ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, color: '#7c3aed' }}>
        DoubleCounter (читает count * 2)
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color: '#7c3aed', marginBottom: 12 }}>
        {doubled}
      </div>
      <div style={{ fontSize: 13, color: '#6b7280' }}>
        Этот компонент не имеет кнопки — он только читает store
      </div>
      <div style={{ marginTop: 10, fontSize: 12, color: '#6b7280' }}>
        Рендеров: <strong style={{ color: '#7c3aed' }}>{renderCount.current}</strong>
      </div>
    </div>
  )
}

export function Task7_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 7.2: Mini Store на useSyncExternalStore</h2>

      <div style={{
        marginBottom: 16,
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        fontSize: 13,
        color: '#475569',
      }}>
        Два независимых компонента подписаны на один глобальный store.
        Каждый использует selector для частичной подписки.
        Нажатие кнопки в Counter обновляет оба компонента одновременно — без tearing.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <CounterSubscriber />
        <DoubleCounterSubscriber />
      </div>

      <div style={{
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 13,
        lineHeight: 1.6,
      }}>
        <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Структура mini store:</div>
        <pre style={{ margin: 0, fontSize: 12, color: '#a5f3fc', overflowX: 'auto' }}>{`createStore({ count: 0 })
  ├── getState()         → { count: N }
  ├── setState(fn)       → обновляет state, уведомляет listeners
  └── subscribe(cb)      → добавляет listener, возвращает unsubscribe

useStore(store, s => s.count)
  └── useSyncExternalStore(
        store.subscribe,        // кто и как подписывается
        () => selector(state),  // что читаем (snapshot)
      )`}</pre>
      </div>
    </div>
  )
}

// ─── Task 7.3 ─────────────────────────────────────────────────────────────────

// --- useOnlineStatus ---

const onlineSubscribe = (callback: () => void) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}

const onlineSnapshot = () => navigator.onLine
const onlineServerSnapshot = () => true

function useOnlineStatus(): boolean {
  return useSyncExternalStore(onlineSubscribe, onlineSnapshot, onlineServerSnapshot)
}

// --- useWindowSize ---

type WindowSize = { width: number, height: number }

// Кэш снаружи компонента — стабильная ссылка
let windowSizeCache: WindowSize = { width: window.innerWidth, height: window.innerHeight }

const windowSizeSubscribe = (callback: () => void) => {
  window.addEventListener('resize', callback)
  return () => window.removeEventListener('resize', callback)
}

const windowSizeSnapshot = (): WindowSize => {
  const w = window.innerWidth
  const h = window.innerHeight
  // Возвращаем кэш, если размеры не изменились → Object.is вернёт true
  if (windowSizeCache.width === w && windowSizeCache.height === h) {
    return windowSizeCache
  }
  windowSizeCache = { width: w, height: h }
  return windowSizeCache
}

const windowSizeServerSnapshot = (): WindowSize => ({ width: 0, height: 0 })

function useWindowSize(): WindowSize {
  return useSyncExternalStore(windowSizeSubscribe, windowSizeSnapshot, windowSizeServerSnapshot)
}

// --- useLocalStorage ---

function createLocalStorageStore(key: string, defaultValue: string) {
  // Внутренний список listeners для синхронизации в рамках одной вкладки
  const listeners = new Set<() => void>()

  const subscribe = (callback: () => void) => {
    // Подписка на изменения из других вкладок
    const storageHandler = (e: StorageEvent) => {
      if (e.key === key) callback()
    }
    window.addEventListener('storage', storageHandler)
    listeners.add(callback)
    return () => {
      window.removeEventListener('storage', storageHandler)
      listeners.delete(callback)
    }
  }

  const getSnapshot = () => localStorage.getItem(key) ?? defaultValue

  const getServerSnapshot = () => defaultValue

  const setValue = (value: string) => {
    localStorage.setItem(key, value)
    // Уведомляем всех подписчиков в текущей вкладке
    // (событие 'storage' срабатывает только в ДРУГИХ вкладках)
    listeners.forEach(l => l())
  }

  return { subscribe, getSnapshot, getServerSnapshot, setValue }
}

function useLocalStorage(key: string, defaultValue: string): [string, (v: string) => void] {
  const store = useMemo(
    () => createLocalStorageStore(key, defaultValue),
    [key, defaultValue]
  )

  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)

  return [value, store.setValue]
}

// --- Dashboard ---

function OnlineStatusWidget() {
  const online = useOnlineStatus()

  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      border: `2px solid ${online ? '#86efac' : '#fca5a5'}`,
      background: online ? '#f0fdf4' : '#fff5f5',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: '#374151' }}>
        Статус сети
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: online ? '#22c55e' : '#ef4444',
          boxShadow: online
            ? '0 0 0 4px rgba(34,197,94,0.2)'
            : '0 0 0 4px rgba(239,68,68,0.2)',
          transition: 'all 0.3s ease',
        }} />
        <span style={{
          fontWeight: 700,
          fontSize: 18,
          color: online ? '#15803d' : '#dc2626',
        }}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Переключите в DevTools → Network → Offline
      </div>
    </div>
  )
}

function WindowSizeWidget() {
  const { width, height } = useWindowSize()
  const isMobile = width > 0 && width < 768

  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      border: '2px solid #bae6fd',
      background: '#f0f9ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: '#374151' }}>
        Размер окна
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7' }}>{width}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>ширина</div>
        </div>
        <div style={{ fontSize: 24, color: '#93c5fd', alignSelf: 'center' }}>×</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7' }}>{height}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>высота</div>
        </div>
      </div>
      <div style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: 20,
        background: isMobile ? '#fef3c7' : '#dbeafe',
        color: isMobile ? '#92400e' : '#1d4ed8',
        fontSize: 12,
        fontWeight: 600,
      }}>
        {isMobile ? 'Mobile' : 'Desktop'}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Измените размер окна браузера
      </div>
    </div>
  )
}

function LocalStorageWidget() {
  const [value, setValue] = useLocalStorage('dashboard-note', 'Привет, мир!')
  const [input, setInput] = useState(value)

  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      border: '2px solid #d8b4fe',
      background: '#faf5ff',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: '#374151' }}>
        LocalStorage (key: "dashboard-note")
      </div>
      <div style={{
        marginBottom: 10,
        padding: '8px 12px',
        background: 'white',
        borderRadius: 6,
        border: '1px solid #e5e7eb',
        fontSize: 14,
        color: '#7c3aed',
        fontWeight: 600,
        minHeight: 36,
      }}>
        {value}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите новое значение..."
          style={{
            flex: 1,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #d1d5db',
            fontSize: 14,
          }}
        />
        <button
          onClick={() => setValue(input)}
          style={{
            padding: '6px 14px',
            background: '#7c3aed',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Сохранить
        </button>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Откройте эту страницу в двух вкладках — изменения синхронизируются
      </div>
    </div>
  )
}

export function Task7_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Задание 7.3: Browser API Store Dashboard</h2>

      <div style={{
        marginBottom: 16,
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 8,
        border: '1px solid #e2e8f0',
        fontSize: 13,
        color: '#475569',
      }}>
        Три хука через useSyncExternalStore: каждый подключает отдельный Browser API к React.
        Все SSR-safe, все без лишних рендеров при mount.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <OnlineStatusWidget />
        <WindowSizeWidget />
      </div>

      <LocalStorageWidget />

      <div style={{
        marginTop: 16,
        padding: '12px 16px',
        background: '#1e293b',
        borderRadius: 8,
        color: '#e2e8f0',
        fontSize: 13,
        lineHeight: 1.7,
      }}>
        <div style={{ fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Паттерны в каждом хуке:</div>
        <div>
          <span style={{ color: '#a5f3fc' }}>useOnlineStatus</span> — примитив (boolean), subscribe/snapshot снаружи компонента
        </div>
        <div>
          <span style={{ color: '#a5f3fc' }}>useWindowSize</span> — объект с кэшем: возвращает старую ссылку если размеры не изменились
        </div>
        <div>
          <span style={{ color: '#a5f3fc' }}>useLocalStorage</span> — ручное уведомление listeners при setValue (событие 'storage' не работает в текущей вкладке)
        </div>
      </div>
    </div>
  )
}
