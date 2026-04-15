import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 5.1 Solution: Promise.all Visualizer
// ============================================

const DARK_BG = '#0f172a'
const PANEL_BG = '#1e293b'
const MUTED = '#94a3b8'
const FONT = "'Fira Code', 'Cascadia Code', monospace"

const LOADER_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
const LOADER_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon']
const LOADER_DURATIONS = [800, 1400, 600, 1100, 900]

interface LoaderState {
  progress: number
  status: 'idle' | 'running' | 'done' | 'error'
  value: string
  error: string
}

function makeLoaderState(): LoaderState {
  return { progress: 0, status: 'idle', value: '', error: '' }
}

function btnStyle(variant: 'primary' | 'danger' | 'neutral', disabled?: boolean): React.CSSProperties {
  const bg = disabled
    ? '#1e293b'
    : variant === 'primary'
    ? '#3b82f6'
    : variant === 'danger'
    ? '#dc2626'
    : '#374151'
  return {
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: bg,
    color: disabled ? '#475569' : '#fff',
    fontFamily: FONT,
    fontSize: '0.82rem',
  }
}

function tagStyle(status: LoaderState['status']): React.CSSProperties {
  const map: Record<string, string> = {
    idle: '#334155',
    running: '#1e3a5f',
    done: '#052e16',
    error: '#450a0a',
  }
  return {
    display: 'inline-block',
    padding: '0.15rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.72rem',
    background: map[status] || '#334155',
    color: status === 'done' ? '#6ee7b7' : status === 'error' ? '#fca5a5' : status === 'running' ? '#93c5fd' : '#94a3b8',
  }
}

export function Task5_1_Solution() {
  const [loaders, setLoaders] = useState<LoaderState[]>(Array.from({ length: 5 }, makeLoaderState))
  const [fails, setFails] = useState<boolean[]>([false, false, false, false, false])
  const [result, setResult] = useState<string | null>(null)
  const [resultOk, setResultOk] = useState(true)
  const [running, setRunning] = useState(false)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearInterval)
    timersRef.current = []
  }

  const handleReset = () => {
    clearTimers()
    setLoaders(Array.from({ length: 5 }, makeLoaderState))
    setResult(null)
    setRunning(false)
  }

  const handleRun = () => {
    handleReset()
    setRunning(true)

    const states: LoaderState[] = Array.from({ length: 5 }, makeLoaderState)
    states.forEach((s) => (s.status = 'running'))
    setLoaders([...states])

    const promises: Promise<string>[] = LOADER_DURATIONS.map((duration, i) => {
      return new Promise<string>((resolve, reject) => {
        const startTime = Date.now()
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(100, Math.round((elapsed / duration) * 100))

          setLoaders((prev) => {
            const next = [...prev]
            next[i] = { ...next[i], progress }
            return next
          })

          if (progress >= 100) {
            clearInterval(interval)
            if (fails[i]) {
              setLoaders((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], status: 'error', error: `Ошибка загрузки ${LOADER_NAMES[i]}` }
                return next
              })
              reject(new Error(`Ошибка загрузки ${LOADER_NAMES[i]}`))
            } else {
              setLoaders((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], status: 'done', value: `data_${LOADER_NAMES[i].toLowerCase()}` }
                return next
              })
              resolve(`data_${LOADER_NAMES[i].toLowerCase()}`)
            }
          }
        }, 30)
        timersRef.current.push(interval)
      })
    })

    Promise.all(promises)
      .then((values) => {
        setResult(JSON.stringify(values))
        setResultOk(true)
        setRunning(false)
      })
      .catch((err: Error) => {
        setResult(err.message)
        setResultOk(false)
        // Mark remaining running loaders as error (visual fail-fast)
        setLoaders((prev) =>
          prev.map((l) => (l.status === 'running' ? { ...l, status: 'error', error: 'Отменено (fail-fast)' } : l))
        )
        setRunning(false)
      })
  }

  useEffect(() => () => clearTimers(), [])

  const toggleFail = (i: number) => {
    setFails((prev) => {
      const next = [...prev]
      next[i] = !next[i]
      return next
    })
  }

  return (
    <div
      className="exercise-container"
      style={{ background: DARK_BG, color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: FONT, fontSize: '0.9rem' }}
    >
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 5.1 — Promise.all
      </h2>

      {/* Fail toggles */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.6rem' }}>НАСТРОЙКА СБОЕВ</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {LOADER_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => toggleFail(i)}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                border: `1px solid ${fails[i] ? '#ef4444' : '#334155'}`,
                background: fails[i] ? '#450a0a' : '#0f172a',
                color: fails[i] ? '#fca5a5' : '#64748b',
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '0.78rem',
              }}
            >
              {name}: {fails[i] ? 'СБОЙ' : 'ОК'}
            </button>
          ))}
        </div>
      </div>

      {/* Loaders */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.75rem' }}>ЗАГРУЗКИ (Promise.all)</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {loaders.map((l, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                <span style={{ color: LOADER_COLORS[i] }}>{LOADER_NAMES[i]}</span>
                <span style={tagStyle(l.status)}>
                  {l.status === 'idle' && 'ожидание'}
                  {l.status === 'running' && `${l.progress}%`}
                  {l.status === 'done' && `fulfilled: "${l.value}"`}
                  {l.status === 'error' && `rejected: "${l.error}"`}
                </span>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${l.progress}%`,
                    background: l.status === 'error' ? '#ef4444' : l.status === 'done' ? '#10b981' : LOADER_COLORS[i],
                    borderRadius: '4px',
                    transition: 'width 0.08s linear, background 0.3s',
                  }}
                />
              </div>
              {l.status === 'error' && l.error === 'Отменено (fail-fast)' && (
                <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '0.2rem' }}>
                  Продолжает выполняться внутри — Promise.all не отменяет промисы
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {result !== null && (
        <div
          style={{
            background: resultOk ? '#052e16' : '#450a0a',
            border: `1px solid ${resultOk ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
          }}
        >
          <div style={{ color: resultOk ? '#6ee7b7' : '#fca5a5', fontWeight: 'bold', marginBottom: '0.25rem' }}>
            {resultOk ? 'Promise.all fulfilled:' : 'Promise.all rejected (fail-fast):'}
          </div>
          <code style={{ color: resultOk ? '#a7f3d0' : '#fecaca', wordBreak: 'break-all' }}>{result}</code>
          {!resultOk && (
            <div style={{ marginTop: '0.5rem', color: '#94a3b8', fontSize: '0.78rem' }}>
              Остальные промисы продолжили выполнение — Promise.all не имеет механизма отмены
            </div>
          )}
        </div>
      )}

      {/* Code snippet */}
      <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`// Fail-fast: первый rejected → весь Promise.all rejected
const results = await Promise.all([
  fetch('/api/alpha'),  // если упадёт — всё рухнет
  fetch('/api/beta'),
  fetch('/api/gamma'),
  fetch('/api/delta'),
  fetch('/api/epsilon'),
])
// results = ['data_alpha', 'data_beta', ...]  (если все ОК)`}</pre>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={btnStyle('primary', running)} onClick={handleRun} disabled={running}>
          {running ? 'Выполняется...' : 'Запустить Promise.all'}
        </button>
        <button style={btnStyle('neutral')} onClick={handleReset}>
          Сброс
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 5.2 Solution: Promise.allSettled Visualizer
// ============================================

interface SettledResult {
  status: 'fulfilled' | 'rejected'
  value?: string
  reason?: string
}

export function Task5_2_Solution() {
  const [loaders, setLoaders] = useState<LoaderState[]>(Array.from({ length: 5 }, makeLoaderState))
  const [fails, setFails] = useState<boolean[]>([false, true, false, false, true])
  const [results, setResults] = useState<SettledResult[] | null>(null)
  const [running, setRunning] = useState(false)
  const [allComparison, setAllComparison] = useState<string | null>(null)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearInterval)
    timersRef.current = []
  }

  const handleReset = () => {
    clearTimers()
    setLoaders(Array.from({ length: 5 }, makeLoaderState))
    setResults(null)
    setAllComparison(null)
    setRunning(false)
  }

  const handleRun = () => {
    handleReset()
    setRunning(true)

    const states: LoaderState[] = Array.from({ length: 5 }, makeLoaderState)
    states.forEach((s) => (s.status = 'running'))
    setLoaders([...states])

    const promises: Promise<string>[] = LOADER_DURATIONS.map((duration, i) => {
      return new Promise<string>((resolve, reject) => {
        const startTime = Date.now()
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(100, Math.round((elapsed / duration) * 100))

          setLoaders((prev) => {
            const next = [...prev]
            next[i] = { ...next[i], progress }
            return next
          })

          if (progress >= 100) {
            clearInterval(interval)
            if (fails[i]) {
              setLoaders((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], status: 'error', error: `Ошибка ${LOADER_NAMES[i]}` }
                return next
              })
              reject(new Error(`Ошибка ${LOADER_NAMES[i]}`))
            } else {
              setLoaders((prev) => {
                const next = [...prev]
                next[i] = { ...next[i], status: 'done', value: `data_${LOADER_NAMES[i].toLowerCase()}` }
                return next
              })
              resolve(`data_${LOADER_NAMES[i].toLowerCase()}`)
            }
          }
        }, 30)
        timersRef.current.push(interval)
      })
    })

    // Find first failing index for comparison
    const firstFailIdx = fails.findIndex((f) => f)

    Promise.allSettled(promises).then((settled) => {
      const mapped: SettledResult[] = settled.map((r) =>
        r.status === 'fulfilled'
          ? { status: 'fulfilled', value: r.value }
          : { status: 'rejected', reason: (r.reason as Error).message }
      )
      setResults(mapped)
      if (firstFailIdx !== -1) {
        setAllComparison(
          `Если бы это был Promise.all — он упал бы на шаге ${firstFailIdx + 1} (${LOADER_NAMES[firstFailIdx]}) и не дождался остальных`
        )
      } else {
        setAllComparison('Все промисы выполнились успешно — в этом случае Promise.all и allSettled дают одинаковый результат')
      }
      setRunning(false)
    })
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <div
      className="exercise-container"
      style={{ background: DARK_BG, color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: FONT, fontSize: '0.9rem' }}
    >
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 5.2 — Promise.allSettled
      </h2>

      {/* Fail toggles */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.6rem' }}>НАСТРОЙКА СБОЕВ</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {LOADER_NAMES.map((name, i) => (
            <button
              key={i}
              onClick={() => setFails((prev) => { const next = [...prev]; next[i] = !next[i]; return next })}
              style={{
                padding: '0.3rem 0.75rem',
                borderRadius: '6px',
                border: `1px solid ${fails[i] ? '#ef4444' : '#334155'}`,
                background: fails[i] ? '#450a0a' : '#0f172a',
                color: fails[i] ? '#fca5a5' : '#64748b',
                cursor: 'pointer',
                fontFamily: FONT,
                fontSize: '0.78rem',
              }}
            >
              {name}: {fails[i] ? 'СБОЙ' : 'ОК'}
            </button>
          ))}
        </div>
      </div>

      {/* Loaders */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.75rem' }}>
          ЗАГРУЗКИ (allSettled ждёт ВСЕХ — независимо от результата)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {loaders.map((l, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.78rem' }}>
                <span style={{ color: LOADER_COLORS[i] }}>{LOADER_NAMES[i]}</span>
                <span style={tagStyle(l.status)}>
                  {l.status === 'idle' && 'ожидание'}
                  {l.status === 'running' && `${l.progress}%`}
                  {l.status === 'done' && `fulfilled: "${l.value}"`}
                  {l.status === 'error' && `rejected: "${l.error}"`}
                </span>
              </div>
              <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${l.progress}%`,
                    background: l.status === 'error' ? '#ef4444' : l.status === 'done' ? '#10b981' : LOADER_COLORS[i],
                    borderRadius: '4px',
                    transition: 'width 0.08s linear, background 0.3s',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Results table */}
      {results && (
        <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.75rem' }}>РЕЗУЛЬТАТЫ (allSettled всегда fulfilled)</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Источник', 'status', 'value / reason'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '0.4rem 0.5rem', color: MUTED, borderBottom: '1px solid #334155' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((r, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.4rem 0.5rem', color: LOADER_COLORS[i] }}>{LOADER_NAMES[i]}</td>
                  <td style={{ padding: '0.4rem 0.5rem' }}>
                    <span style={tagStyle(r.status === 'fulfilled' ? 'done' : 'error')}>{r.status}</span>
                  </td>
                  <td style={{ padding: '0.4rem 0.5rem', color: r.status === 'fulfilled' ? '#6ee7b7' : '#fca5a5', wordBreak: 'break-all' }}>
                    {r.status === 'fulfilled' ? r.value : r.reason}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {allComparison && (
            <div style={{ marginTop: '0.75rem', padding: '0.6rem', background: '#0f172a', borderRadius: '6px', fontSize: '0.78rem', color: '#fbbf24', borderLeft: '3px solid #f59e0b' }}>
              Сравнение с Promise.all: {allComparison}
            </div>
          )}
        </div>
      )}

      {/* Code snippet */}
      <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`// allSettled всегда ждёт всех и никогда не rejected
const results = await Promise.allSettled([p1, p2, p3])
// results[0] = { status: 'fulfilled', value: 'data' }
// results[1] = { status: 'rejected', reason: Error(...) }

results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value)
  else console.error(r.reason)
})`}</pre>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={btnStyle('primary', running)} onClick={handleRun} disabled={running}>
          {running ? 'Выполняется...' : 'Запустить Promise.allSettled'}
        </button>
        <button style={btnStyle('neutral')} onClick={handleReset}>
          Сброс
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 5.3 Solution: Promise.race Visualizer
// ============================================

interface Runner {
  name: string
  color: string
  delay: number
  outcome: 'success' | 'fail'
}

const RUNNER_COLORS = ['#3b82f6', '#ec4899', '#f59e0b']

export function Task5_3_Solution() {
  const [tab, setTab] = useState<'race' | 'timeout'>('race')
  const [runners, setRunners] = useState<Runner[]>([
    { name: 'Бегун А', color: RUNNER_COLORS[0], delay: 1200, outcome: 'success' },
    { name: 'Бегун B', color: RUNNER_COLORS[1], delay: 800, outcome: 'success' },
    { name: 'Бегун C', color: RUNNER_COLORS[2], delay: 1600, outcome: 'success' },
  ])
  const [progresses, setProgresses] = useState([0, 0, 0])
  const [statuses, setStatuses] = useState<('idle' | 'running' | 'done' | 'error')[]>(['idle', 'idle', 'idle'])
  const [winner, setWinner] = useState<{ index: number; outcome: 'success' | 'fail' } | null>(null)
  const [running, setRunning] = useState(false)

  // Timeout tab state
  const [fetchDelay, setFetchDelay] = useState(3000)
  const [timeoutMs, setTimeoutMs] = useState(2000)
  const [timeoutResult, setTimeoutResult] = useState<string | null>(null)
  const [timeoutRunning, setTimeoutRunning] = useState(false)
  const [timeoutProgress, setTimeoutProgress] = useState(0)
  const [fetchProgress, setFetchProgress] = useState(0)

  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearInterval)
    timersRef.current = []
  }

  const handleReset = () => {
    clearTimers()
    setProgresses([0, 0, 0])
    setStatuses(['idle', 'idle', 'idle'])
    setWinner(null)
    setRunning(false)
  }

  const handleRun = () => {
    handleReset()
    setRunning(true)
    setStatuses(['running', 'running', 'running'])

    let resolved = false

    const promises = runners.map((runner, i) => {
      return new Promise<{ index: number; outcome: 'success' | 'fail' }>((resolve, reject) => {
        const startTime = Date.now()
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(100, Math.round((elapsed / runner.delay) * 100))

          setProgresses((prev) => {
            const next = [...prev]
            next[i] = progress
            return next
          })

          if (progress >= 100) {
            clearInterval(interval)
            setStatuses((prev) => {
              const next = [...prev] as typeof statuses
              next[i] = runner.outcome === 'success' ? 'done' : 'error'
              return next
            })
            if (runner.outcome === 'success') {
              resolve({ index: i, outcome: 'success' })
            } else {
              reject({ index: i, outcome: 'fail' })
            }
          }
        }, 30)
        timersRef.current.push(interval)
      })
    })

    Promise.race(promises)
      .then((result) => {
        if (!resolved) {
          resolved = true
          setWinner(result)
          setRunning(false)
        }
      })
      .catch((result: { index: number; outcome: 'success' | 'fail' }) => {
        if (!resolved) {
          resolved = true
          setWinner(result)
          setRunning(false)
        }
      })
  }

  // Timeout demo
  const handleTimeoutRun = () => {
    clearTimers()
    setTimeoutResult(null)
    setTimeoutRunning(true)
    setTimeoutProgress(0)
    setFetchProgress(0)

    const startTime = Date.now()

    const fetchInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setFetchProgress(Math.min(100, Math.round((elapsed / fetchDelay) * 100)))
      if (elapsed >= fetchDelay) clearInterval(fetchInterval)
    }, 30)
    timersRef.current.push(fetchInterval)

    const timeoutInterval = setInterval(() => {
      const elapsed = Date.now() - startTime
      setTimeoutProgress(Math.min(100, Math.round((elapsed / timeoutMs) * 100)))
      if (elapsed >= timeoutMs) clearInterval(timeoutInterval)
    }, 30)
    timersRef.current.push(timeoutInterval)

    const fetchPromise = new Promise<string>((resolve) => setTimeout(() => resolve('Ответ сервера'), fetchDelay))
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timeout: запрос превысил лимит')), timeoutMs)
    )

    Promise.race([fetchPromise, timeoutPromise])
      .then((value) => {
        setTimeoutResult(`Победил fetch: "${value}"`)
        setTimeoutRunning(false)
      })
      .catch((err: Error) => {
        setTimeoutResult(`Победил таймаут: ${err.message}`)
        setTimeoutRunning(false)
      })
  }

  useEffect(() => () => clearTimers(), [])

  const tabBtn = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: FONT,
    fontSize: '0.82rem',
    background: active ? PANEL_BG : DARK_BG,
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  return (
    <div
      className="exercise-container"
      style={{ background: DARK_BG, color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: FONT, fontSize: '0.9rem' }}
    >
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 5.3 — Promise.race
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button style={tabBtn(tab === 'race')} onClick={() => { setTab('race'); handleReset() }}>
          Гонка бегунов
        </button>
        <button style={tabBtn(tab === 'timeout')} onClick={() => { setTab('timeout'); clearTimers(); setTimeoutResult(null); setTimeoutRunning(false) }}>
          Паттерн: Timeout
        </button>
      </div>

      <div style={{ background: PANEL_BG, borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {tab === 'race' && (
          <>
            {/* Runner controls */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.6rem' }}>НАСТРОЙКА БЕГУНОВ</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {runners.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ color: r.color, minWidth: '80px', fontSize: '0.82rem' }}>{r.name}</span>
                    <label style={{ color: MUTED, fontSize: '0.78rem' }}>
                      Задержка:
                      <input
                        type="range"
                        min={300}
                        max={3000}
                        step={100}
                        value={r.delay}
                        onChange={(e) => setRunners((prev) => { const next = [...prev]; next[i] = { ...next[i], delay: Number(e.target.value) }; return next })}
                        style={{ marginLeft: '0.5rem', accentColor: r.color }}
                      />
                      <span style={{ color: r.color, marginLeft: '0.4rem' }}>{r.delay}мс</span>
                    </label>
                    <button
                      onClick={() => setRunners((prev) => { const next = [...prev]; next[i] = { ...next[i], outcome: next[i].outcome === 'success' ? 'fail' : 'success' }; return next })}
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        border: `1px solid ${r.outcome === 'fail' ? '#ef4444' : '#334155'}`,
                        background: r.outcome === 'fail' ? '#450a0a' : '#0f172a',
                        color: r.outcome === 'fail' ? '#fca5a5' : '#64748b',
                        cursor: 'pointer',
                        fontFamily: FONT,
                        fontSize: '0.72rem',
                      }}
                    >
                      {r.outcome === 'fail' ? 'FAIL' : 'OK'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Race track */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.5rem' }}>ТРЕК (первый финиш = результат race)</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {runners.map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: r.color, minWidth: '72px', fontSize: '0.78rem' }}>{r.name}</span>
                    <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '20px', overflow: 'hidden', position: 'relative' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${progresses[i]}%`,
                          background: statuses[i] === 'error' ? '#ef4444' : statuses[i] === 'done' ? '#10b981' : r.color,
                          borderRadius: '4px',
                          transition: 'width 0.08s linear, background 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'flex-end',
                          paddingRight: '0.3rem',
                        }}
                      >
                        {progresses[i] > 15 && (
                          <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>
                            {progresses[i]}%
                          </span>
                        )}
                      </div>
                    </div>
                    {winner?.index === i && (
                      <span style={{ color: winner.outcome === 'success' ? '#10b981' : '#ef4444', fontSize: '0.78rem', fontWeight: 'bold' }}>
                        {winner.outcome === 'success' ? 'ПОБЕДИТЕЛЬ' : 'ПЕРВЫЙ REJECTED'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {winner && (
              <div
                style={{
                  background: winner.outcome === 'success' ? '#052e16' : '#450a0a',
                  border: `1px solid ${winner.outcome === 'success' ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: winner.outcome === 'success' ? '#6ee7b7' : '#fca5a5',
                }}
              >
                Promise.race {winner.outcome === 'success' ? 'fulfilled' : 'rejected'} — победил{' '}
                <strong>{runners[winner.index].name}</strong> ({runners[winner.index].delay}мс).{' '}
                Остальные продолжают, но их результат игнорируется.
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={btnStyle('primary', running)} onClick={handleRun} disabled={running}>
                {running ? 'Гонка идёт...' : 'Старт!'}
              </button>
              <button style={btnStyle('neutral')} onClick={handleReset}>
                Сброс
              </button>
            </div>
          </>
        )}

        {tab === 'timeout' && (
          <>
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.6rem' }}>НАСТРОЙКА</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: MUTED, fontSize: '0.82rem' }}>
                  Задержка fetch:
                  <input
                    type="range" min={500} max={5000} step={100} value={fetchDelay}
                    onChange={(e) => setFetchDelay(Number(e.target.value))}
                    style={{ marginLeft: '0.75rem', accentColor: '#3b82f6' }}
                  />
                  <span style={{ color: '#60a5fa', marginLeft: '0.4rem' }}>{fetchDelay}мс</span>
                </label>
                <label style={{ color: MUTED, fontSize: '0.82rem' }}>
                  Таймаут:
                  <input
                    type="range" min={500} max={5000} step={100} value={timeoutMs}
                    onChange={(e) => setTimeoutMs(Number(e.target.value))}
                    style={{ marginLeft: '0.75rem', accentColor: '#ef4444' }}
                  />
                  <span style={{ color: '#f87171', marginLeft: '0.4rem' }}>{timeoutMs}мс</span>
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '1rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ color: '#3b82f6', minWidth: '90px' }}>fetch (синий)</span>
                <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${fetchProgress}%`, background: '#3b82f6', transition: 'width 0.08s linear' }} />
                </div>
                <span style={{ color: '#60a5fa' }}>{fetchProgress}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: '#ef4444', minWidth: '90px' }}>timeout (красный)</span>
                <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '10px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${timeoutProgress}%`, background: '#ef4444', transition: 'width 0.08s linear' }} />
                </div>
                <span style={{ color: '#f87171' }}>{timeoutProgress}%</span>
              </div>
              <div style={{ marginTop: '0.4rem', color: MUTED }}>
                {fetchDelay < timeoutMs
                  ? `Fetch быстрее таймаута на ${timeoutMs - fetchDelay}мс — ответ придёт`
                  : `Таймаут наступит раньше на ${fetchDelay - timeoutMs}мс — timeout победит`}
              </div>
            </div>

            {timeoutResult && (
              <div
                style={{
                  background: timeoutResult.startsWith('Победил fetch') ? '#052e16' : '#450a0a',
                  border: `1px solid ${timeoutResult.startsWith('Победил fetch') ? '#10b981' : '#ef4444'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: timeoutResult.startsWith('Победил fetch') ? '#6ee7b7' : '#fca5a5',
                }}
              >
                {timeoutResult}
              </div>
            )}

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
              <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`function withTimeout(promise, ms) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Timeout')), ms)
  )
  return Promise.race([promise, timeout])
}

// Использование:
const data = await withTimeout(fetch('/api/data'), ${timeoutMs})`}</pre>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button style={btnStyle('primary', timeoutRunning)} onClick={handleTimeoutRun} disabled={timeoutRunning}>
                {timeoutRunning ? 'Гонка идёт...' : 'Запустить race([fetch, timeout])'}
              </button>
              <button style={btnStyle('neutral')} onClick={() => { clearTimers(); setTimeoutResult(null); setTimeoutRunning(false); setTimeoutProgress(0); setFetchProgress(0) }}>
                Сброс
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 5.4 Solution: Promise.any Visualizer
// ============================================

interface Server {
  name: string
  color: string
  delay: number
  online: boolean
}

const SERVER_COLORS = ['#3b82f6', '#8b5cf6', '#10b981']

export function Task5_4_Solution() {
  const [servers, setServers] = useState<Server[]>([
    { name: 'CDN Primary', color: SERVER_COLORS[0], delay: 1200, online: true },
    { name: 'CDN Secondary', color: SERVER_COLORS[1], delay: 800, online: true },
    { name: 'CDN Tertiary', color: SERVER_COLORS[2], delay: 600, online: true },
  ])
  const [progresses, setProgresses] = useState([0, 0, 0])
  const [statuses, setStatuses] = useState<('idle' | 'running' | 'done' | 'error')[]>(['idle', 'idle', 'idle'])
  const [result, setResult] = useState<{ type: 'fulfilled'; winner: number; value: string } | { type: 'aggregate'; errors: string[] } | null>(null)
  const [running, setRunning] = useState(false)
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  const clearTimers = () => {
    timersRef.current.forEach(clearInterval)
    timersRef.current = []
  }

  const handleReset = () => {
    clearTimers()
    setProgresses([0, 0, 0])
    setStatuses(['idle', 'idle', 'idle'])
    setResult(null)
    setRunning(false)
  }

  const handleRun = () => {
    handleReset()
    setRunning(true)
    setStatuses(['running', 'running', 'running'])

    const errors: string[] = []

    const promises = servers.map((server, i) => {
      return new Promise<{ winner: number; value: string }>((resolve, reject) => {
        const startTime = Date.now()
        const interval = setInterval(() => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(100, Math.round((elapsed / server.delay) * 100))

          setProgresses((prev) => {
            const next = [...prev]
            next[i] = progress
            return next
          })

          if (progress >= 100) {
            clearInterval(interval)
            if (!server.online) {
              setStatuses((prev) => {
                const next = [...prev] as typeof statuses
                next[i] = 'error'
                return next
              })
              errors.push(`${server.name}: offline`)
              reject(new Error(`${server.name}: offline`))
            } else {
              setStatuses((prev) => {
                const next = [...prev] as typeof statuses
                next[i] = 'done'
                return next
              })
              resolve({ winner: i, value: `asset.js from ${server.name}` })
            }
          }
        }, 30)
        timersRef.current.push(interval)
      })
    })

    Promise.any<{ winner: number; value: string }>(promises)
      .then((res) => {
        setResult({ type: 'fulfilled', winner: res.winner, value: res.value })
        setRunning(false)
      })
      .catch(() => {
        setResult({ type: 'aggregate', errors })
        setRunning(false)
      })
  }

  useEffect(() => () => clearTimers(), [])

  const allOffline = servers.every((s) => !s.online)

  return (
    <div
      className="exercise-container"
      style={{ background: DARK_BG, color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: FONT, fontSize: '0.9rem' }}
    >
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 5.4 — Promise.any
      </h2>

      {/* Server controls */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.6rem' }}>НАСТРОЙКА CDN-СЕРВЕРОВ</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {servers.map((srv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ color: srv.color, minWidth: '110px', fontSize: '0.82rem' }}>{srv.name}</span>
              <label style={{ color: MUTED, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                Задержка:
                <input
                  type="range" min={300} max={3000} step={100} value={srv.delay}
                  onChange={(e) => setServers((prev) => { const next = [...prev]; next[i] = { ...next[i], delay: Number(e.target.value) }; return next })}
                  style={{ accentColor: srv.color }}
                />
                <span style={{ color: srv.color }}>{srv.delay}мс</span>
              </label>
              <button
                onClick={() => setServers((prev) => { const next = [...prev]; next[i] = { ...next[i], online: !next[i].online }; return next })}
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  border: `1px solid ${srv.online ? '#10b981' : '#ef4444'}`,
                  background: srv.online ? '#052e16' : '#450a0a',
                  color: srv.online ? '#6ee7b7' : '#fca5a5',
                  cursor: 'pointer',
                  fontFamily: FONT,
                  fontSize: '0.72rem',
                }}
              >
                {srv.online ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>
          ))}
        </div>
        {allOffline && (
          <div style={{ marginTop: '0.5rem', color: '#fbbf24', fontSize: '0.78rem' }}>
            Все серверы offline — будет AggregateError
          </div>
        )}
      </div>

      {/* Server tracks */}
      <div style={{ background: PANEL_BG, borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.5rem' }}>
          ПЕРВЫЙ FULFILLED победит (rejected — игнорируются, если есть хоть один fulfilled)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {servers.map((srv, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color: srv.color, minWidth: '110px', fontSize: '0.78rem' }}>{srv.name}</span>
              <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '20px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progresses[i]}%`,
                    background: statuses[i] === 'error' ? '#374151' : statuses[i] === 'done' ? '#10b981' : srv.color,
                    borderRadius: '4px',
                    transition: 'width 0.08s linear, background 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '0.3rem',
                  }}
                >
                  {progresses[i] > 15 && <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)' }}>{progresses[i]}%</span>}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', minWidth: '50px', textAlign: 'right' }}>
                {statuses[i] === 'error' && <span style={{ color: '#ef4444' }}>OFFLINE</span>}
                {result?.type === 'fulfilled' && result.winner === i && <span style={{ color: '#10b981', fontWeight: 'bold' }}>ПОБЕДА</span>}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          style={{
            background: result.type === 'fulfilled' ? '#052e16' : '#450a0a',
            border: `1px solid ${result.type === 'fulfilled' ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
          }}
        >
          {result.type === 'fulfilled' ? (
            <>
              <div style={{ color: '#6ee7b7', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                Promise.any fulfilled:
              </div>
              <code style={{ color: '#a7f3d0' }}>"{result.value}"</code>
              <div style={{ marginTop: '0.4rem', color: MUTED, fontSize: '0.78rem' }}>
                Остальные серверы проигнорированы — нашли первый рабочий.
              </div>
            </>
          ) : (
            <>
              <div style={{ color: '#fca5a5', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                AggregateError (все серверы offline):
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                errors[] = [{result.errors.map((e, i) => <span key={i} style={{ color: '#fca5a5' }}>"{e}"{i < result.errors.length - 1 ? ', ' : ''}</span>)}]
              </div>
              <div style={{ marginTop: '0.4rem', color: '#fbbf24', fontSize: '0.78rem' }}>
                AggregateError — ES2021, содержит массив errors[] с причиной каждого rejected
              </div>
            </>
          )}
        </div>
      )}

      {/* Comparison: race vs any */}
      <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
        <div style={{ color: MUTED, fontSize: '0.78rem', marginBottom: '0.5rem' }}>Promise.race vs Promise.any:</div>
        <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`// race — первый результат (fulfilled ИЛИ rejected)
Promise.race([offlineServer, slowServer])
// → rejected немедленно, если offlineServer быстрее

// any — первый FULFILLED (rejected игнорируются)
Promise.any([offlineServer, slowServer])
// → ждёт slowServer, игнорирует offlineServer`}</pre>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button style={btnStyle('primary', running)} onClick={handleRun} disabled={running}>
          {running ? 'Выполняется...' : 'Запустить Promise.any'}
        </button>
        <button style={btnStyle('neutral')} onClick={handleReset}>
          Сброс
        </button>
      </div>
    </div>
  )
}
