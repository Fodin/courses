import { makeAutoObservable, autorun, reaction, when } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useEffect, useState, useRef } from 'react'

// ============================================
// Task 4.1: autorun — Theme Store
// ============================================

class ThemeStore {
  theme: 'light' | 'dark' = 'light'

  constructor() {
    makeAutoObservable(this)
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light'
  }

  setTheme(value: 'light' | 'dark') {
    this.theme = value
  }
}

const themeStore = new ThemeStore()

export const Task4_1_Solution = observer(function Task4_1_Solution() {
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    const disposer = autorun(() => {
      const theme = themeStore.theme
      document.body.classList.remove('theme-light', 'theme-dark')
      document.body.classList.add(`theme-${theme}`)
      setLog(prev => [...prev, `[autorun] Applied theme: ${theme}`])
    })

    return () => {
      disposer()
      document.body.classList.remove('theme-light', 'theme-dark')
    }
  }, [])

  return (
    <div className="exercise-container">
      <h3>Theme Store (autorun)</h3>

      <p>
        Current theme: <strong>{themeStore.theme}</strong>
      </p>

      <button onClick={() => themeStore.toggleTheme()}>
        Toggle Theme
      </button>

      <div
        style={{
          marginTop: '16px',
          padding: '12px',
          background: themeStore.theme === 'dark' ? '#333' : '#f5f5f5',
          color: themeStore.theme === 'dark' ? '#fff' : '#333',
          borderRadius: '8px',
          transition: 'all 0.3s',
        }}
      >
        This box reacts to theme changes
      </div>

      <div style={{ marginTop: '12px' }}>
        <strong>Log:</strong>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85em', color: 'gray' }}>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
})

// ============================================
// Task 4.2: reaction — Search Query Store
// ============================================

class SearchStore {
  query = ''
  results: string[] = []

  private allItems = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
    'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon',
    'Mango', 'Nectarine', 'Orange', 'Papaya', 'Quince',
  ]

  constructor() {
    makeAutoObservable(this)
  }

  setQuery(value: string) {
    this.query = value
  }

  search() {
    if (this.query.trim() === '') {
      this.results = []
      return
    }
    this.results = this.allItems.filter(item =>
      item.toLowerCase().includes(this.query.toLowerCase())
    )
  }
}

const searchStore = new SearchStore()

export const Task4_2_Solution = observer(function Task4_2_Solution() {
  const [log, setLog] = useState<string[]>([])

  useEffect(() => {
    const disposer = reaction(
      () => searchStore.query,
      (query, previousQuery) => {
        setLog(prev => [
          ...prev,
          `[reaction] Query changed: "${previousQuery}" → "${query}"`,
        ])
        searchStore.search()
      }
    )

    return () => disposer()
  }, [])

  return (
    <div className="exercise-container">
      <h3>Search (reaction)</h3>

      <input
        type="text"
        value={searchStore.query}
        onChange={e => searchStore.setQuery(e.target.value)}
        placeholder="Search fruits..."
        style={{ padding: '8px', width: '100%', maxWidth: '300px' }}
      />

      <p style={{ color: 'gray', fontSize: '0.85em' }}>
        reaction does NOT fire on initialization — only on changes
      </p>

      {searchStore.results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {searchStore.results.map(item => (
            <li
              key={item}
              style={{
                padding: '4px 8px',
                borderBottom: '1px solid #eee',
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: '12px' }}>
        <strong>Log:</strong>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85em', color: 'gray' }}>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
})

// ============================================
// Task 4.3: when — Loading Store
// ============================================

class LoadingStore {
  isLoaded = false
  data: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  startLoading() {
    this.isLoaded = false
    this.data = null

    setTimeout(() => {
      this.data = 'Data loaded successfully!'
      this.isLoaded = true
    }, 2000)
  }

  reset() {
    this.isLoaded = false
    this.data = null
  }
}

const loadingStore = new LoadingStore()

export const Task4_3_Solution = observer(function Task4_3_Solution() {
  const [log, setLog] = useState<string[]>([])
  const [awaitResult, setAwaitResult] = useState<string | null>(null)

  useEffect(() => {
    const disposer = when(
      () => loadingStore.isLoaded,
      () => {
        setLog(prev => [
          ...prev,
          `[when] Data loaded (one-time): ${loadingStore.data}`,
        ])
      }
    )

    return () => disposer()
  }, [])

  const handleAwaitWhen = async () => {
    setAwaitResult(null)
    setLog(prev => [...prev, '[await when] Waiting for isLoaded...'])
    loadingStore.startLoading()

    await when(() => loadingStore.isLoaded)

    setAwaitResult(loadingStore.data)
    setLog(prev => [...prev, `[await when] Resolved: ${loadingStore.data}`])
  }

  return (
    <div className="exercise-container">
      <h3>Loading (when)</h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button onClick={() => loadingStore.startLoading()}>
          Start Loading (when callback)
        </button>
        <button onClick={handleAwaitWhen}>
          Start Loading (await when)
        </button>
        <button onClick={() => loadingStore.reset()}>
          Reset
        </button>
      </div>

      <p>
        Status:{' '}
        <strong>
          {loadingStore.isLoaded ? 'Loaded' : 'Not loaded'}
        </strong>
      </p>

      {loadingStore.data && (
        <div
          style={{
            padding: '12px',
            background: 'var(--color-success-bg, #e8f5e9)',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        >
          {loadingStore.data}
        </div>
      )}

      {awaitResult && (
        <div
          style={{
            padding: '12px',
            background: 'var(--color-info-bg, #e3f2fd)',
            borderRadius: '8px',
            marginBottom: '12px',
          }}
        >
          await when result: {awaitResult}
        </div>
      )}

      <div style={{ marginTop: '12px' }}>
        <strong>Log:</strong>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85em', color: 'gray' }}>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
})

// ============================================
// Task 4.4: Cleaning up reactions — Memory Leak Fix
// ============================================

class TimerStore {
  seconds = 0
  isRunning = false

  constructor() {
    makeAutoObservable(this)
  }

  start() {
    this.isRunning = true
  }

  stop() {
    this.isRunning = false
  }

  tick() {
    this.seconds++
  }

  reset() {
    this.seconds = 0
    this.isRunning = false
  }
}

const timerStore = new TimerStore()

export const Task4_4_Solution = observer(function Task4_4_Solution() {
  const [log, setLog] = useState<string[]>([])
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    // autorun that watches isRunning and manages interval
    const disposer = autorun(() => {
      if (timerStore.isRunning) {
        setLog(prev => [...prev, '[autorun] Timer started'])
        intervalRef.current = setInterval(() => {
          timerStore.tick()
        }, 1000)
      } else {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
          setLog(prev => [...prev, '[autorun] Timer stopped'])
        }
      }
    })

    // reaction that logs every 5 seconds
    const disposer2 = reaction(
      () => timerStore.seconds,
      (seconds) => {
        if (seconds > 0 && seconds % 5 === 0) {
          setLog(prev => [...prev, `[reaction] ${seconds} seconds elapsed`])
        }
      }
    )

    // IMPORTANT: dispose all reactions on unmount to prevent memory leaks
    return () => {
      disposer()
      disposer2()
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="exercise-container">
      <h3>Timer (Cleanup Reactions)</h3>

      <p>
        Seconds: <strong style={{ fontSize: '1.5em' }}>{timerStore.seconds}</strong>
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => timerStore.start()}
          disabled={timerStore.isRunning}
        >
          Start
        </button>
        <button
          onClick={() => timerStore.stop()}
          disabled={!timerStore.isRunning}
        >
          Stop
        </button>
        <button onClick={() => timerStore.reset()}>
          Reset
        </button>
      </div>

      <div
        style={{
          padding: '12px',
          background: 'var(--color-warning-bg, #fff3e0)',
          borderRadius: '8px',
          marginBottom: '12px',
          fontSize: '0.9em',
        }}
      >
        <strong>Key point:</strong> All disposers are called in useEffect cleanup.
        Without this, reactions would keep running after component unmount — a memory leak!
      </div>

      <div style={{ marginTop: '12px' }}>
        <strong>Log:</strong>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '0.85em', color: 'gray' }}>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  )
})
