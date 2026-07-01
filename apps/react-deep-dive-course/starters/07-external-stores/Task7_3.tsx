import { useState, useMemo, useSyncExternalStore } from 'react'
import { useLanguage } from 'src/hooks'

// Task 7.3: Browser API Store
//
// Implement three hooks via useSyncExternalStore:
//   1. useOnlineStatus()     → boolean (navigator.onLine)
//   2. useWindowSize()       → { width: number, height: number }
//   3. useLocalStorage(key)  → [value: string, setValue: (v: string) => void]
//
// Assemble them into a BrowserApiDashboard component.

// ─── 1. useOnlineStatus ──────────────────────────────────────────────────────

// TODO: define subscribe, getSnapshot, getServerSnapshot OUTSIDE the component
// (stable references — no useCallback needed)
//
// subscribe: listen to 'online' and 'offline' events on window
// getSnapshot: () => navigator.onLine
// getServerSnapshot: () => true  (assume online on server)

// const onlineSubscribe = ...
// const onlineSnapshot = ...
// const onlineServerSnapshot = ...

function useOnlineStatus(): boolean {
  // TODO: return useSyncExternalStore(onlineSubscribe, onlineSnapshot, onlineServerSnapshot)
  return true
}

// ─── 2. useWindowSize ───────────────────────────────────────────────────────

type WindowSize = { width: number, height: number }

// TODO: cache the window size object OUTSIDE the component
// This is critical: getSnapshot must return the SAME reference
// if width and height haven't changed (otherwise → infinite loop!)
//
// let windowSizeCache: WindowSize = { width: window.innerWidth, height: window.innerHeight }
//
// const windowSizeSubscribe = (callback: () => void) => { ... }
//
// const windowSizeSnapshot = (): WindowSize => {
//   Check if width/height changed → if not, return windowSizeCache
//   If changed → update cache and return new object
// }
//
// const windowSizeServerSnapshot = (): WindowSize => ({ width: 0, height: 0 })

function useWindowSize(): WindowSize {
  // TODO: return useSyncExternalStore(windowSizeSubscribe, windowSizeSnapshot, windowSizeServerSnapshot)
  return { width: 0, height: 0 }
}

// ─── 3. useLocalStorage ─────────────────────────────────────────────────────

// TODO: implement createLocalStorageStore(key, defaultValue)
// It should return { subscribe, getSnapshot, getServerSnapshot, setValue }
//
// Key insight: the 'storage' event fires in OTHER tabs, not the current one.
// So setValue must also manually notify listeners in the current tab.
//
// subscribe(callback):
//   - window.addEventListener('storage', handler) where handler checks e.key === key
//   - add callback to an internal Set<() => void>
//   - return cleanup (remove event listener, delete from Set)
//
// getSnapshot: () => localStorage.getItem(key) ?? defaultValue
//
// getServerSnapshot: () => defaultValue
//
// setValue(value):
//   - localStorage.setItem(key, value)
//   - notify all listeners in the Set (current tab sync)

function useLocalStorage(key: string, defaultValue: string): [string, (v: string) => void] {
  // TODO: use useMemo to create the store for the given key
  // const store = useMemo(() => createLocalStorageStore(key, defaultValue), [key, defaultValue])
  //
  // const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot)
  // return [value, store.setValue]

  return [defaultValue, (_v: string) => {}]
}

// ─── Dashboard Components ────────────────────────────────────────────────────

function OnlineStatusWidget() {
  const online = useOnlineStatus()

  return (
    <div style={{
      padding: 16,
      borderRadius: 10,
      border: `2px solid ${online ? '#86efac' : '#fca5a5'}`,
      background: online ? '#f0fdf4' : '#fff5f5',
    }}>
      <div style={{ fontWeight: 700, marginBottom: 10, color: '#374151' }}>
        Статус сети
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: online ? '#22c55e' : '#ef4444',
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
        DevTools → Network → Offline
      </div>
    </div>
  )
}

function WindowSizeWidget() {
  const { width, height } = useWindowSize()

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
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7' }}>{width}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>ширина</div>
        </div>
        <div style={{ fontSize: 22, color: '#93c5fd', alignSelf: 'center' }}>×</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#0284c7' }}>{height}</div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>высота</div>
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
        Измени размер окна браузера
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
          placeholder="Введи новое значение..."
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
        Открой страницу в двух вкладках — изменения синхронизируются
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function Task7_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>

      <div style={{
        marginBottom: 16,
        padding: '10px 14px',
        background: '#fffbeb',
        borderRadius: 8,
        border: '1px solid #fcd34d',
        fontSize: 13,
        color: '#92400e',
      }}>
        Реализуй три хука через useSyncExternalStore и собери дашборд.
        Каждый хук решает отдельную задачу — изучи комментарии выше.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <OnlineStatusWidget />
        <WindowSizeWidget />
      </div>

      <LocalStorageWidget />

      {/* TODO: самопроверка:
          1. DevTools → Network → Offline — статус меняется без задержки
          2. Изменяй размер окна — числа обновляются в реальном времени
          3. Открой две вкладки, измени значение в одной — в другой обновится
          4. useWindowSize не вызывает бесконечный цикл (кэш реализован)
      */}
    </div>
  )
}
