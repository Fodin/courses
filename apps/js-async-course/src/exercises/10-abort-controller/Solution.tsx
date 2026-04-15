import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================
// Task 10.1 Solution: Отмена fetch с AbortController
// ============================================

interface LogEntry {
  id: number
  text: string
  color: string
  time: number
}

function delay(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      reject(signal.reason)
    })
  })
}

export function Task10_1_Solution() {
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'aborted' | 'done'>('idle')
  const [log, setLog] = useState<LogEntry[]>([])
  const [signalAborted, setSignalAborted] = useState(false)
  const [signalReason, setSignalReason] = useState<string>('')
  const controllerRef = useRef<AbortController | null>(null)
  const logIdRef = useRef(0)

  const addLog = useCallback((text: string, color: string) => {
    const now = performance.now()
    setLog((prev) => [
      ...prev,
      { id: logIdRef.current++, text, color, time: Math.round(now) % 100000 },
    ])
  }, [])

  const startFetch = async () => {
    const controller = new AbortController()
    controllerRef.current = controller
    const signal = controller.signal

    setProgress(0)
    setStatus('loading')
    setLog([])
    setSignalAborted(false)
    setSignalReason('')

    addLog('fetch() started — загрузка началась', '#60a5fa')

    try {
      // Simulate fetch with progress: 5 steps, each 700ms
      for (const pct of [20, 40, 60, 80, 100]) {
        await delay(700, signal)
        setProgress(pct)
        addLog(`progress ${pct}% — данные получены`, '#34d399')
      }

      addLog('fetch() completed — загрузка завершена', '#a3e635')
      setStatus('done')
      setSignalAborted(false)
      setSignalReason('(нет причины — не отменялся)')
    } catch (err) {
      const isAbort =
        err instanceof DOMException && err.name === 'AbortError'
      if (isAbort) {
        addLog('AbortError caught — запрос отменён', '#f87171')
        setStatus('aborted')
        setSignalAborted(signal.aborted)
        setSignalReason(String(signal.reason))
      }
    }
  }

  const abort = () => {
    if (controllerRef.current) {
      controllerRef.current.abort(new DOMException('Пользователь нажал Отменить', 'AbortError'))
      addLog('controller.abort() вызван — сигнал отправлен', '#fb923c')
    }
  }

  const reset = () => {
    controllerRef.current?.abort()
    controllerRef.current = null
    setProgress(0)
    setStatus('idle')
    setLog([])
    setSignalAborted(false)
    setSignalReason('')
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const progressColor =
    status === 'aborted' ? '#ef4444' : status === 'done' ? '#10b981' : '#3b82f6'

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 10.1 — Отмена fetch с AbortController
      </h2>

      {/* Progress bar */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Прогресс загрузки</span>
          <span style={{ color: progressColor, fontSize: '0.8rem', fontWeight: 'bold' }}>
            {progress}%
          </span>
        </div>
        <div
          style={{
            background: '#1e293b',
            borderRadius: '6px',
            height: '12px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: progressColor,
              borderRadius: '6px',
              transition: 'width 0.3s, background 0.3s',
            }}
          />
        </div>
      </div>

      {/* Signal state */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.5rem',
          fontSize: '0.82rem',
        }}
      >
        <div>
          <span style={{ color: '#64748b' }}>signal.aborted: </span>
          <span style={{ color: signalAborted ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
            {String(signalAborted)}
          </span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>signal.reason: </span>
          <span style={{ color: '#fbbf24' }}>{signalReason || '—'}</span>
        </div>
        <div>
          <span style={{ color: '#64748b' }}>Статус: </span>
          <span
            style={{
              color:
                status === 'aborted'
                  ? '#ef4444'
                  : status === 'done'
                  ? '#10b981'
                  : status === 'loading'
                  ? '#60a5fa'
                  : '#64748b',
              fontWeight: 'bold',
            }}
          >
            {status === 'idle'
              ? 'Ожидание'
              : status === 'loading'
              ? 'Загрузка...'
              : status === 'aborted'
              ? 'Отменено'
              : 'Завершено'}
          </span>
        </div>
      </div>

      {/* Event log */}
      <div
        style={{
          background: '#0a0f1a',
          borderRadius: '8px',
          padding: '0.75rem',
          minHeight: '120px',
          maxHeight: '200px',
          overflowY: 'auto',
          marginBottom: '1rem',
          fontSize: '0.78rem',
          lineHeight: 1.8,
        }}
      >
        {log.length === 0 ? (
          <span style={{ color: '#334155' }}>// лог событий появится здесь</span>
        ) : (
          log.map((entry) => (
            <div key={entry.id}>
              <span style={{ color: '#475569' }}>[{entry.time}ms] </span>
              <span style={{ color: entry.color }}>{entry.text}</span>
            </div>
          ))
        )}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={startFetch}
          disabled={status === 'loading'}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            background: status === 'loading' ? '#1e293b' : '#2563eb',
            color: status === 'loading' ? '#475569' : '#fff',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Загрузить (~3.5с)
        </button>
        <button
          onClick={abort}
          disabled={status !== 'loading'}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            cursor: status !== 'loading' ? 'not-allowed' : 'pointer',
            background: status !== 'loading' ? '#1e293b' : '#dc2626',
            color: status !== 'loading' ? '#475569' : '#fff',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Отменить
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#374151',
            color: '#e5e7eb',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Сброс
        </button>
      </div>

      {/* Tip about signal propagation */}
      <div
        style={{
          marginTop: '1.25rem',
          background: '#1e293b',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          lineHeight: 1.6,
          borderLeft: '3px solid #6366f1',
        }}
      >
        <span style={{ color: '#818cf8', fontWeight: 'bold' }}>Принцип распространения сигнала: </span>
        один <code style={{ color: '#fbbf24' }}>AbortSignal</code> передаётся на все уровни
        цепочки операций (fetch → parse → transform). При вызове{' '}
        <code style={{ color: '#fbbf24' }}>abort()</code> — все операции, слушающие{' '}
        <code style={{ color: '#fbbf24' }}>signal</code>, отменяются одновременно.
        Внутри каждой операции проверяем{' '}
        <code style={{ color: '#fbbf24' }}>signal.aborted</code> или{' '}
        слушаем событие <code style={{ color: '#fbbf24' }}>'abort'</code>.
      </div>
    </div>
  )
}

// ============================================
// Task 10.2 Solution: AbortSignal.timeout и составные сигналы
// ============================================

interface TimerState {
  elapsed: number
  timeout: number
  started: boolean
  winner: 'user' | 'timeout' | null
}

export function Task10_2_Solution() {
  const [timeoutMs, setTimeoutMs] = useState(3000)
  const [serverDelayMs, setServerDelayMs] = useState(2000)
  const [status, setStatus] = useState<'idle' | 'running' | 'done'>('idle')
  const [result, setResult] = useState<string | null>(null)
  const [resultColor, setResultColor] = useState('#10b981')
  const [timer, setTimer] = useState<TimerState>({
    elapsed: 0,
    timeout: 3000,
    started: false,
    winner: null,
  })

  const userControllerRef = useRef<AbortController | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const startOperation = async () => {
    // User abort controller
    const userController = new AbortController()
    userControllerRef.current = userController

    // Combined signal: user abort OR timeout
    const combinedSignal = AbortSignal.any([
      userController.signal,
      AbortSignal.timeout(timeoutMs),
    ])

    setStatus('running')
    setResult(null)
    setTimer({ elapsed: 0, timeout: timeoutMs, started: true, winner: null })
    startTimeRef.current = performance.now()

    // Visual timer
    intervalRef.current = setInterval(() => {
      const elapsed = Math.round(performance.now() - startTimeRef.current)
      setTimer((prev) => ({ ...prev, elapsed }))
    }, 100)

    try {
      // Simulate server response with delay
      await new Promise<void>((resolve, reject) => {
        const timer2 = setTimeout(resolve, serverDelayMs)
        combinedSignal.addEventListener('abort', () => {
          clearTimeout(timer2)
          reject(combinedSignal.reason)
        })
      })

      stopInterval()
      setStatus('done')
      setResult('Операция успешно завершена — сервер ответил вовремя')
      setResultColor('#10b981')
      setTimer((prev) => ({ ...prev, winner: null }))
    } catch (err) {
      stopInterval()
      setStatus('done')

      const isTimeout =
        err instanceof DOMException && err.name === 'TimeoutError'
      const isAbort =
        err instanceof DOMException && err.name === 'AbortError'

      if (isTimeout) {
        setResult(
          `TimeoutError: сработал автоматический таймаут (${timeoutMs}мс). signal.reason = TimeoutError`
        )
        setResultColor('#f59e0b')
        setTimer((prev) => ({ ...prev, winner: 'timeout' }))
      } else if (isAbort) {
        setResult(
          `AbortError: пользователь отменил операцию вручную. signal.reason = AbortError`
        )
        setResultColor('#ef4444')
        setTimer((prev) => ({ ...prev, winner: 'user' }))
      }
    }
  }

  const userAbort = () => {
    userControllerRef.current?.abort(new DOMException('Пользователь нажал Отменить', 'AbortError'))
  }

  const reset = () => {
    userControllerRef.current?.abort()
    stopInterval()
    setStatus('idle')
    setResult(null)
    setTimer({ elapsed: 0, timeout: timeoutMs, started: false, winner: null })
  }

  useEffect(() => {
    return () => stopInterval()
  }, [])

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const remaining = Math.max(0, timeoutMs - timer.elapsed)
  const timeoutPct = Math.min(100, (timer.elapsed / timeoutMs) * 100)

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 10.2 — AbortSignal.timeout и составные сигналы
      </h2>

      {/* Settings */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1rem',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
        }}
      >
        <div>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>
            Таймаут (AbortSignal.timeout):{' '}
            <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{timeoutMs}мс</span>
          </label>
          <input
            type="range"
            min={500}
            max={6000}
            step={500}
            value={timeoutMs}
            onChange={(e) => {
              setTimeoutMs(Number(e.target.value))
              reset()
            }}
            style={{ width: '100%', accentColor: '#f59e0b' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
            <span>500мс</span><span>6000мс</span>
          </div>
        </div>
        <div>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>
            Задержка сервера:{' '}
            <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{serverDelayMs}мс</span>
          </label>
          <input
            type="range"
            min={500}
            max={6000}
            step={500}
            value={serverDelayMs}
            onChange={(e) => {
              setServerDelayMs(Number(e.target.value))
              reset()
            }}
            style={{ width: '100%', accentColor: '#60a5fa' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#475569' }}>
            <span>500мс</span><span>6000мс</span>
          </div>
        </div>
      </div>

      {/* Strategy hint */}
      <div
        style={{
          background: '#1e293b',
          borderRadius: '8px',
          padding: '0.65rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
        }}
      >
        <span style={{ color: '#a78bfa' }}>AbortSignal.any([userSignal, AbortSignal.timeout({timeoutMs})])</span>
        {' — '}
        {serverDelayMs < timeoutMs
          ? <span style={{ color: '#34d399' }}>Сервер ответит раньше таймаута — успех</span>
          : serverDelayMs === timeoutMs
          ? <span style={{ color: '#f59e0b' }}>Граница — результат непредсказуем</span>
          : <span style={{ color: '#f87171' }}>Таймаут сработает раньше — TimeoutError</span>
        }
      </div>

      {/* Dual timers */}
      {timer.started && (
        <div style={{ marginBottom: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {/* Auto timeout */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
              Автотаймаут (AbortSignal.timeout)
              {timer.winner === 'timeout' && (
                <span style={{ marginLeft: '0.5rem', color: '#f59e0b', fontWeight: 'bold' }}>СРАБОТАЛ</span>
              )}
            </div>
            <div
              style={{
                background: '#0f172a',
                borderRadius: '4px',
                height: '8px',
                overflow: 'hidden',
                marginBottom: '0.4rem',
              }}
            >
              <div
                style={{
                  width: `${timeoutPct}%`,
                  height: '100%',
                  background: timer.winner === 'timeout' ? '#f59e0b' : '#6366f1',
                  transition: 'width 0.1s',
                }}
              />
            </div>
            <div style={{ color: '#f59e0b', fontSize: '0.78rem' }}>
              {status === 'running' ? `Осталось: ${remaining}мс` : timer.winner === 'timeout' ? 'Таймаут!' : 'Завершено'}
            </div>
          </div>

          {/* User timer */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
              Пользовательская отмена
              {timer.winner === 'user' && (
                <span style={{ marginLeft: '0.5rem', color: '#ef4444', fontWeight: 'bold' }}>СРАБОТАЛА</span>
              )}
            </div>
            <div style={{ color: '#ef4444', fontSize: '0.78rem', lineHeight: 1.4 }}>
              Нажмите кнопку "Отменить" вручную
              <br />
              <span style={{ color: '#475569' }}>Прошло: {timer.elapsed}мс</span>
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div
          style={{
            background: '#0a0f1a',
            border: `1px solid ${resultColor}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.82rem',
            color: resultColor,
            lineHeight: 1.5,
          }}
        >
          {result}
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button
          onClick={startOperation}
          disabled={status === 'running'}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            cursor: status === 'running' ? 'not-allowed' : 'pointer',
            background: status === 'running' ? '#1e293b' : '#7c3aed',
            color: status === 'running' ? '#475569' : '#fff',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Запустить операцию
        </button>
        <button
          onClick={userAbort}
          disabled={status !== 'running'}
          style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '6px',
            border: 'none',
            cursor: status !== 'running' ? 'not-allowed' : 'pointer',
            background: status !== 'running' ? '#1e293b' : '#dc2626',
            color: status !== 'running' ? '#475569' : '#fff',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Отменить вручную
        </button>
        <button
          onClick={reset}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#374151',
            color: '#e5e7eb',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Сброс
        </button>
      </div>

      {/* Code snippet */}
      <div
        style={{
          marginTop: '1.25rem',
          background: '#0a0f1a',
          borderRadius: '8px',
          padding: '0.75rem',
          fontSize: '0.75rem',
          color: '#cbd5e1',
          lineHeight: 1.7,
        }}
      >
        <pre style={{ margin: 0 }}>
{`const userController = new AbortController()
const combinedSignal = AbortSignal.any([
  userController.signal,
  AbortSignal.timeout(${timeoutMs}),  // автотаймаут
])

fetch('/api/data', { signal: combinedSignal })
  .catch(err => {
    if (err.name === 'TimeoutError') { /* таймаут */ }
    if (err.name === 'AbortError')   { /* пользователь */ }
  })`}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 10.3 Solution: Отмена в React useEffect
// ============================================

interface SearchRequest {
  id: number
  query: string
  startTime: number
  endTime: number | null
  status: 'pending' | 'done' | 'aborted'
  duration: number
}

// Simulated search API
async function simulateSearch(
  query: string,
  signal: AbortSignal
): Promise<string[]> {
  // Random delay 500-2000ms
  const ms = 500 + Math.floor(Math.random() * 1500)
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(t)
      reject(signal.reason)
    })
  })
  if (signal.aborted) throw signal.reason
  return [`${query}_result_1`, `${query}_result_2`, `${query}_result_3`]
}

export function Task10_3_Solution() {
  const [mode, setMode] = useState<'with' | 'without'>('with')
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<string[]>([])
  const [requests, setRequests] = useState<SearchRequest[]>([])
  const [raceWarning, setRaceWarning] = useState(false)

  const controllerRef = useRef<AbortController | null>(null)
  const requestIdRef = useRef(0)
  const startTimeRef = useRef(performance.now())

  // Reset on mode change
  useEffect(() => {
    setQuery('')
    setResults([])
    setRequests([])
    setRaceWarning(false)
    controllerRef.current?.abort()
  }, [mode])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const reqId = ++requestIdRef.current
    const startTime = performance.now() - startTimeRef.current

    if (mode === 'with') {
      // Cancel previous request
      controllerRef.current?.abort()
      const controller = new AbortController()
      controllerRef.current = controller

      const newReq: SearchRequest = {
        id: reqId,
        query,
        startTime,
        endTime: null,
        status: 'pending',
        duration: 0,
      }
      setRequests((prev) => [...prev, newReq])

      simulateSearch(query, controller.signal)
        .then((res) => {
          const end = performance.now() - startTimeRef.current
          setRequests((prev) =>
            prev.map((r) =>
              r.id === reqId
                ? { ...r, endTime: end, status: 'done', duration: Math.round(end - startTime) }
                : r
            )
          )
          setResults(res)
        })
        .catch((err) => {
          const isAbort =
            err instanceof DOMException && err.name === 'AbortError'
          if (isAbort) {
            const end = performance.now() - startTimeRef.current
            setRequests((prev) =>
              prev.map((r) =>
                r.id === reqId
                  ? {
                      ...r,
                      endTime: end,
                      status: 'aborted',
                      duration: Math.round(end - startTime),
                    }
                  : r
              )
            )
          }
        })

      return () => {
        controller.abort()
      }
    } else {
      // Without AbortController — race condition demo
      const newReq: SearchRequest = {
        id: reqId,
        query,
        startTime,
        endTime: null,
        status: 'pending',
        duration: 0,
      }
      setRequests((prev) => [...prev, newReq])

      const abortController = new AbortController()

      simulateSearch(query, abortController.signal)
        .then((res) => {
          const end = performance.now() - startTimeRef.current
          setRequests((prev) =>
            prev.map((r) =>
              r.id === reqId
                ? { ...r, endTime: end, status: 'done', duration: Math.round(end - startTime) }
                : r
            )
          )
          // Race condition: old slow response may overwrite newer results
          setResults(res)
          // Check if this is not the latest request
          if (reqId < requestIdRef.current) {
            setRaceWarning(true)
          }
        })
        .catch(() => {})

      // No cleanup — no abort!
      return undefined
    }
  }, [query, mode])

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? (mode === 'with' ? '#34d399' : '#f87171') : '#64748b',
    borderBottom: active
      ? `2px solid ${mode === 'with' ? '#10b981' : '#ef4444'}`
      : '2px solid transparent',
  })

  const getBarWidth = (req: SearchRequest, total: number) => {
    if (!req.endTime) return 0
    return Math.min(100, (req.duration / total) * 100)
  }
  const maxDuration = Math.max(...requests.map((r) => r.duration), 1)

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 10.3 — Отмена в React useEffect
      </h2>

      {/* Mode toggle */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(mode === 'with')} onClick={() => setMode('with')}>
          С AbortController
        </button>
        <button style={tabStyle(mode === 'without')} onClick={() => setMode('without')}>
          Без AbortController
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {/* Mode explanation */}
        <div
          style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.65rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.78rem',
            color: '#94a3b8',
            lineHeight: 1.6,
            borderLeft: `3px solid ${mode === 'with' ? '#10b981' : '#ef4444'}`,
          }}
        >
          {mode === 'with' ? (
            <>
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>С AbortController: </span>
              Каждое изменение текста отменяет предыдущий запрос. Только последний запрос
              дойдёт до результата. Нет race condition.
              Cleanup-функция useEffect вызывает <code style={{ color: '#fbbf24' }}>controller.abort()</code>.
            </>
          ) : (
            <>
              <span style={{ color: '#f87171', fontWeight: 'bold' }}>Без AbortController: </span>
              Все запросы выполняются до конца. Медленный старый запрос может прийти
              после быстрого нового — и перезаписать результаты. Это race condition!
              Попробуйте быстро набирать текст.
            </>
          )}
        </div>

        {/* Search input */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem' }}>
            Поисковый запрос (каждый символ = новый запрос к API)
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setRaceWarning(false)
              startTimeRef.current = performance.now()
              setRequests([])
            }}
            placeholder="Начните печатать..."
            style={{
              width: '100%',
              padding: '0.6rem 0.75rem',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '6px',
              color: '#e2e8f0',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Race condition warning */}
        {raceWarning && mode === 'without' && (
          <div
            style={{
              background: '#450a0a',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '0.65rem 1rem',
              marginBottom: '1rem',
              fontSize: '0.82rem',
              color: '#fca5a5',
            }}
          >
            Race condition обнаружен! Старый запрос вернулся позже нового и перезаписал результаты.
            Пользователь видит устаревшие данные.
          </div>
        )}

        {/* Results */}
        {results.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
              Текущие результаты поиска:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {results.map((r) => (
                <span
                  key={r}
                  style={{
                    background: '#1e3a5f',
                    border: '1px solid #2563eb',
                    borderRadius: '4px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.78rem',
                    color: '#93c5fd',
                  }}
                >
                  {r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Timeline */}
        {requests.length > 0 && (
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Timeline запросов:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {requests.map((req) => (
                <div key={req.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div
                    style={{
                      minWidth: '60px',
                      fontSize: '0.72rem',
                      color: '#64748b',
                      textAlign: 'right',
                    }}
                  >
                    #{req.id}
                  </div>
                  <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '20px', position: 'relative', overflow: 'hidden' }}>
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        height: '100%',
                        width: req.endTime ? `${getBarWidth(req, maxDuration)}%` : '100%',
                        background:
                          req.status === 'aborted'
                            ? '#374151'
                            : req.status === 'done'
                            ? '#059669'
                            : '#1d4ed8',
                        transition: 'width 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft: '0.4rem',
                      }}
                    >
                      {req.status === 'aborted' && (
                        <span style={{ fontSize: '0.65rem', color: '#9ca3af', textDecoration: 'line-through' }}>
                          "{req.query}"
                        </span>
                      )}
                      {req.status === 'done' && (
                        <span style={{ fontSize: '0.65rem', color: '#d1fae5' }}>
                          "{req.query}" {req.duration}мс
                        </span>
                      )}
                      {req.status === 'pending' && (
                        <span style={{ fontSize: '0.65rem', color: '#93c5fd' }}>
                          "{req.query}" ...
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      minWidth: '60px',
                      fontSize: '0.7rem',
                      color:
                        req.status === 'aborted'
                          ? '#6b7280'
                          : req.status === 'done'
                          ? '#34d399'
                          : '#60a5fa',
                    }}
                  >
                    {req.status === 'aborted' ? 'отменён' : req.status === 'done' ? 'готов' : 'ждёт...'}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.72rem', color: '#475569' }}>
              <span><span style={{ color: '#374151', background: '#374151', display: 'inline-block', width: '12px', height: '8px', borderRadius: '2px', marginRight: '4px', verticalAlign: 'middle' }}></span>отменён</span>
              <span><span style={{ color: '#059669', background: '#059669', display: 'inline-block', width: '12px', height: '8px', borderRadius: '2px', marginRight: '4px', verticalAlign: 'middle' }}></span>успех</span>
              <span><span style={{ color: '#1d4ed8', background: '#1d4ed8', display: 'inline-block', width: '12px', height: '8px', borderRadius: '2px', marginRight: '4px', verticalAlign: 'middle' }}></span>в процессе</span>
            </div>
          </div>
        )}

        {/* Code snippet */}
        <div
          style={{
            marginTop: '1.25rem',
            background: '#0a0f1a',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.72rem',
            color: '#cbd5e1',
            lineHeight: 1.7,
          }}
        >
          <pre style={{ margin: 0 }}>
{mode === 'with'
  ? `useEffect(() => {
  const controller = new AbortController()

  fetch(\`/search?q=\${query}\`, { signal: controller.signal })
    .then(r => r.json())
    .then(setResults)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err)
    })

  return () => controller.abort() // cleanup!
}, [query])`
  : `useEffect(() => {
  // Без cleanup — запросы накапливаются!
  fetch(\`/search?q=\${query}\`)
    .then(r => r.json())
    .then(setResults) // race condition!
}, [query])`}
          </pre>
        </div>
      </div>
    </div>
  )
}
