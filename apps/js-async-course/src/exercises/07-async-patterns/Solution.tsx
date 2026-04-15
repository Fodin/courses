import { useState, useRef, useEffect, useCallback } from 'react'

// ============================================
// Task 7.1 Solution: Retry с exponential backoff
// ============================================

interface RetryAttempt {
  index: number
  status: 'pending' | 'error' | 'success' | 'waiting'
  delay: number
  timestamp: number
}

function simulateUnstableApi(errorRate: number): Promise<string> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() * 100 < errorRate) {
        reject(new Error('Network error'))
      } else {
        resolve('OK: данные получены')
      }
    }, 150 + Math.random() * 150)
  })
}

async function retryWithBackoff(
  fn: () => Promise<string>,
  maxRetries: number,
  baseDelay: number,
  backoffFactor: number,
  jitter: boolean,
  onAttempt: (attempt: RetryAttempt) => void
): Promise<string> {
  for (let i = 0; i <= maxRetries; i++) {
    const attempt: RetryAttempt = {
      index: i,
      status: 'pending',
      delay: 0,
      timestamp: Date.now(),
    }
    onAttempt({ ...attempt, status: 'pending' })

    try {
      const result = await fn()
      onAttempt({ ...attempt, status: 'success', timestamp: Date.now() })
      return result
    } catch {
      if (i === maxRetries) {
        onAttempt({ ...attempt, status: 'error', timestamp: Date.now() })
        throw new Error(`Все ${maxRetries + 1} попыток провалились`)
      }

      onAttempt({ ...attempt, status: 'error', timestamp: Date.now() })

      let delay = baseDelay * Math.pow(backoffFactor, i)
      if (jitter) {
        delay = delay * (0.5 + Math.random() * 0.5)
      }
      delay = Math.round(delay)

      const waitAttempt: RetryAttempt = {
        index: i,
        status: 'waiting',
        delay,
        timestamp: Date.now(),
      }
      onAttempt(waitAttempt)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw new Error('Unreachable')
}

export function Task7_1_Solution() {
  const [errorRate, setErrorRate] = useState(70)
  const [maxRetries, setMaxRetries] = useState(4)
  const [baseDelay, setBaseDelay] = useState(300)
  const [backoffFactor, setBackoffFactor] = useState(2)
  const [jitter, setJitter] = useState(false)
  const [attempts, setAttempts] = useState<RetryAttempt[]>([])
  const [running, setRunning] = useState(false)
  const [finalResult, setFinalResult] = useState<string | null>(null)

  const handleRun = async () => {
    setRunning(true)
    setAttempts([])
    setFinalResult(null)

    const log: RetryAttempt[] = []

    try {
      const result = await retryWithBackoff(
        () => simulateUnstableApi(errorRate),
        maxRetries,
        baseDelay,
        backoffFactor,
        jitter,
        (a) => {
          log.push(a)
          setAttempts([...log])
        }
      )
      setFinalResult(`Успех: ${result}`)
    } catch (e: unknown) {
      setFinalResult(`Провал: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setRunning(false)
    }
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const sliderLabelStyle: React.CSSProperties = {
    color: '#94a3b8',
    fontSize: '0.82rem',
    display: 'block',
    marginBottom: '0.3rem',
  }

  const getAttemptColor = (status: RetryAttempt['status']) => {
    if (status === 'success') return '#10b981'
    if (status === 'error') return '#ef4444'
    if (status === 'waiting') return '#f59e0b'
    return '#64748b'
  }

  const getAttemptBg = (status: RetryAttempt['status']) => {
    if (status === 'success') return '#052e16'
    if (status === 'error') return '#450a0a'
    if (status === 'waiting') return '#451a03'
    return '#1e293b'
  }

  const uniqueAttempts = attempts.reduce<RetryAttempt[]>((acc, cur) => {
    const last = acc[acc.length - 1]
    if (!last || last.index !== cur.index || last.status !== cur.status) {
      acc.push(cur)
    }
    return acc
  }, [])

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 7.1 — Retry с exponential backoff
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Settings */}
        <div style={{ minWidth: '220px', flex: '0 0 220px' }}>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
              НАСТРОЙКИ
            </div>

            <label style={sliderLabelStyle}>
              Вероятность ошибки: <span style={{ color: '#f87171', fontWeight: 'bold' }}>{errorRate}%</span>
            </label>
            <input type="range" min={0} max={100} value={errorRate}
              onChange={(e) => setErrorRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#ef4444', marginBottom: '0.75rem' }} />

            <label style={sliderLabelStyle}>
              Max попыток: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{maxRetries}</span>
            </label>
            <input type="range" min={1} max={10} value={maxRetries}
              onChange={(e) => setMaxRetries(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#3b82f6', marginBottom: '0.75rem' }} />

            <label style={sliderLabelStyle}>
              Base delay: <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{baseDelay}ms</span>
            </label>
            <input type="range" min={100} max={2000} step={100} value={baseDelay}
              onChange={(e) => setBaseDelay(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#8b5cf6', marginBottom: '0.75rem' }} />

            <label style={sliderLabelStyle}>
              Backoff factor: <span style={{ color: '#34d399', fontWeight: 'bold' }}>{backoffFactor.toFixed(1)}</span>
            </label>
            <input type="range" min={15} max={30} step={1} value={backoffFactor * 10}
              onChange={(e) => setBackoffFactor(Number(e.target.value) / 10)}
              style={{ width: '100%', accentColor: '#10b981', marginBottom: '0.75rem' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="jitter" checked={jitter}
                onChange={(e) => setJitter(e.target.checked)}
                style={{ accentColor: '#f59e0b', width: '16px', height: '16px' }} />
              <label htmlFor="jitter" style={{ color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}>
                Jitter (±50%)
              </label>
            </div>
          </div>

          {/* Expected delays */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              ЗАДЕРЖКИ ПО ПЛАНУ
            </div>
            {Array.from({ length: maxRetries }).map((_, i) => {
              const d = Math.round(baseDelay * Math.pow(backoffFactor, i))
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#64748b', marginBottom: '0.2rem' }}>
                  <span>попытка {i + 2}</span>
                  <span style={{ color: '#f59e0b' }}>+{d}ms{jitter ? ' ±50%' : ''}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Timeline */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', minHeight: '280px' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
              TIMELINE ПОПЫТОК
            </div>

            {uniqueAttempts.length === 0 && !running && (
              <div style={{ color: '#475569', fontSize: '0.82rem', textAlign: 'center', paddingTop: '3rem' }}>
                Нажмите "Запустить" для начала
              </div>
            )}

            {uniqueAttempts.map((attempt, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem',
                background: getAttemptBg(attempt.status),
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                borderLeft: `3px solid ${getAttemptColor(attempt.status)}`,
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: getAttemptColor(attempt.status),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.7rem', fontWeight: 'bold', color: '#fff',
                  flexShrink: 0,
                }}>
                  {attempt.status === 'waiting' ? '⏳' : attempt.index + 1}
                </div>
                <div style={{ fontSize: '0.8rem' }}>
                  {attempt.status === 'pending' && <span style={{ color: '#94a3b8' }}>Попытка {attempt.index + 1}...</span>}
                  {attempt.status === 'success' && <span style={{ color: '#10b981', fontWeight: 'bold' }}>Попытка {attempt.index + 1}: Успех</span>}
                  {attempt.status === 'error' && <span style={{ color: '#ef4444' }}>Попытка {attempt.index + 1}: Ошибка</span>}
                  {attempt.status === 'waiting' && (
                    <span style={{ color: '#f59e0b' }}>
                      Ожидание {attempt.delay}ms перед следующей попыткой...
                    </span>
                  )}
                </div>
              </div>
            ))}

            {finalResult && (
              <div style={{
                marginTop: '0.75rem',
                padding: '0.75rem',
                borderRadius: '6px',
                background: finalResult.startsWith('Успех') ? '#052e16' : '#450a0a',
                border: `1px solid ${finalResult.startsWith('Успех') ? '#10b981' : '#ef4444'}`,
                color: finalResult.startsWith('Успех') ? '#34d399' : '#f87171',
                fontSize: '0.85rem',
                fontWeight: 'bold',
              }}>
                {finalResult}
              </div>
            )}
          </div>

          <button
            onClick={handleRun}
            disabled={running}
            style={{
              marginTop: '0.75rem',
              padding: '0.6rem 1.5rem',
              borderRadius: '6px',
              border: 'none',
              cursor: running ? 'not-allowed' : 'pointer',
              background: running ? '#1e293b' : '#3b82f6',
              color: running ? '#475569' : '#fff',
              fontFamily: 'inherit',
              fontSize: '0.85rem',
              width: '100%',
            }}
          >
            {running ? 'Выполняется...' : 'Запустить'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.2 Solution: Async Pool
// ============================================

interface PoolTask {
  id: number
  duration: number
  status: 'queued' | 'running' | 'done'
  slot: number
  startTime: number
  endTime: number
}

async function asyncPool<T>(
  concurrency: number,
  tasks: (() => Promise<T>)[],
  onUpdate: (id: number, status: 'running' | 'done', slot: number) => void
): Promise<T[]> {
  const results: T[] = []
  let idx = 0
  const slots = Array<boolean>(concurrency).fill(false)

  async function runNext(slot: number): Promise<void> {
    while (idx < tasks.length) {
      const taskIdx = idx++
      onUpdate(taskIdx, 'running', slot)
      const result = await tasks[taskIdx]()
      results[taskIdx] = result
      onUpdate(taskIdx, 'done', slot)
    }
    slots[slot] = false
  }

  const workers = Array.from({ length: concurrency }, (_, i) => {
    slots[i] = true
    return runNext(i)
  })

  await Promise.all(workers)
  return results
}

export function Task7_2_Solution() {
  const [concurrency, setConcurrency] = useState(3)
  const [tasks, setTasks] = useState<PoolTask[]>([])
  const [running, setRunning] = useState(false)
  const [totalTime, setTotalTime] = useState<number | null>(null)
  const startRef = useRef<number>(0)

  const TASK_COUNT = 12
  const taskDurations = [400, 800, 600, 1200, 300, 900, 500, 700, 1000, 400, 600, 800]

  const handleRun = async () => {
    setRunning(true)
    setTotalTime(null)
    startRef.current = Date.now()

    const initialTasks: PoolTask[] = taskDurations.map((duration, i) => ({
      id: i,
      duration,
      status: 'queued',
      slot: -1,
      startTime: 0,
      endTime: 0,
    }))
    setTasks(initialTasks)

    const tasksList = taskDurations.map((duration, i) => () =>
      new Promise<void>((resolve) => setTimeout(() => resolve(), duration))
        .then(() => i)
    )

    await asyncPool(
      concurrency,
      tasksList,
      (id, status, slot) => {
        setTasks((prev) => prev.map((t) => {
          if (t.id !== id) return t
          if (status === 'running') {
            return { ...t, status: 'running', slot, startTime: Date.now() }
          }
          return { ...t, status: 'done', endTime: Date.now() }
        }))
      }
    )

    setTotalTime(Date.now() - startRef.current)
    setRunning(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const slotColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981',
    '#06b6d4', '#f97316', '#a78bfa', '#34d399', '#fb7185']

  const getTaskStyle = (task: PoolTask): React.CSSProperties => ({
    padding: '0.35rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.72rem',
    fontWeight: 'bold',
    background: task.status === 'done' ? '#052e16'
      : task.status === 'running' ? slotColors[task.slot % slotColors.length] + '33'
      : '#1e293b',
    border: `1px solid ${
      task.status === 'done' ? '#10b981'
      : task.status === 'running' ? slotColors[task.slot % slotColors.length]
      : '#334155'
    }`,
    color: task.status === 'done' ? '#34d399'
      : task.status === 'running' ? slotColors[task.slot % slotColors.length]
      : '#475569',
    transition: 'all 0.2s',
    minWidth: '56px',
    textAlign: 'center' as const,
  })

  const sequentialTime = taskDurations.reduce((a, b) => a + b, 0)

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 7.2 — Async Pool (лимит конкурентности)
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
          Конкурентность N: <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '1.1rem' }}>{concurrency}</span>
        </label>
        <input type="range" min={1} max={TASK_COUNT} value={concurrency}
          onChange={(e) => setConcurrency(Number(e.target.value))}
          style={{ width: '300px', accentColor: '#3b82f6' }} />
        <div style={{ display: 'flex', gap: '2rem', marginTop: '0.25rem', fontSize: '0.72rem', color: '#475569' }}>
          <span>N=1 (последовательно)</span>
          <span>N={TASK_COUNT} (всё сразу)</span>
        </div>
      </div>

      {/* Slots */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
          СЛОТЫ ВЫПОЛНЕНИЯ (N={concurrency})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {Array.from({ length: Math.min(concurrency, 10) }).map((_, slot) => {
            const slotTasks = tasks.filter((t) => t.slot === slot)
            return (
              <div key={slot} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: slotColors[slot % slotColors.length],
                  flexShrink: 0, fontSize: '0.65rem', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold',
                }}>
                  {slot + 1}
                </div>
                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                  {slotTasks.length === 0 && (
                    <span style={{ color: '#334155', fontSize: '0.75rem' }}>— свободен</span>
                  )}
                  {slotTasks.map((t) => (
                    <div key={t.id} style={getTaskStyle(t)}>
                      T{t.id + 1} {t.duration}ms
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Queue */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          ВСЕ ЗАДАЧИ ({TASK_COUNT})
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
          {tasks.length === 0
            ? taskDurations.map((d, i) => (
              <div key={i} style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#1e293b', border: '1px solid #334155', fontSize: '0.72rem', color: '#475569' }}>
                T{i + 1} {d}ms
              </div>
            ))
            : tasks.map((t) => (
              <div key={t.id} style={getTaskStyle(t)}>
                T{t.id + 1} {t.duration}ms
              </div>
            ))
          }
        </div>
      </div>

      {/* Stats */}
      {totalTime !== null && (
        <div style={{ background: '#0c1a2e', border: '1px solid #1e40af', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Фактическое время: </span>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{totalTime}ms</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Последовательно: </span>
              <span style={{ color: '#f87171' }}>{sequentialTime}ms</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Ускорение: </span>
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>{(sequentialTime / totalTime).toFixed(1)}x</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleRun}
        disabled={running}
        style={{
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          border: 'none',
          cursor: running ? 'not-allowed' : 'pointer',
          background: running ? '#1e293b' : '#3b82f6',
          color: running ? '#475569' : '#fff',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
        }}
      >
        {running ? `Выполняется (N=${concurrency})...` : `Запустить с N=${concurrency}`}
      </button>
    </div>
  )
}

// ============================================
// Task 7.3 Solution: Debounce и Throttle async
// ============================================

interface CallEvent {
  id: number
  time: number
  type: 'press' | 'call'
}

function useDebounce<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  return useCallback((...args: T) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => fn(...args), delay)
  }, [fn, delay])
}

function useThrottle<T extends unknown[]>(fn: (...args: T) => void, delay: number) {
  const lastRef = useRef<number>(0)
  return useCallback((...args: T) => {
    const now = Date.now()
    if (now - lastRef.current >= delay) {
      lastRef.current = now
      fn(...args)
    }
  }, [fn, delay])
}

export function Task7_3_Solution() {
  const [mode, setMode] = useState<'debounce' | 'throttle'>('debounce')
  const [inputValue, setInputValue] = useState('')
  const [events, setEvents] = useState<CallEvent[]>([])
  const [pressCount, setPressCount] = useState(0)
  const [callCount, setCallCount] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const eventIdRef = useRef(0)

  const resetAll = () => {
    setEvents([])
    setPressCount(0)
    setCallCount(0)
    startTimeRef.current = Date.now()
    eventIdRef.current = 0
    setInputValue('')
  }

  const addEvent = useCallback((type: 'press' | 'call') => {
    const ev: CallEvent = {
      id: eventIdRef.current++,
      time: Date.now() - startTimeRef.current,
      type,
    }
    setEvents((prev) => [...prev.slice(-40), ev])
    if (type === 'press') setPressCount((c) => c + 1)
    if (type === 'call') setCallCount((c) => c + 1)
  }, [])

  const simulateSearch = useCallback((value: string) => {
    if (value.length > 0) addEvent('call')
  }, [addEvent])

  const debouncedSearch = useDebounce(simulateSearch, 300)
  const throttledSearch = useThrottle(simulateSearch, 500)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    addEvent('press')
    if (mode === 'debounce') debouncedSearch(val)
    else throttledSearch(val)
  }

  useEffect(() => {
    resetAll()
  }, [mode])

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
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const TIMELINE_WIDTH = 500
  const TIMELINE_MS = 3000

  const getEventX = (time: number) => Math.min((time / TIMELINE_MS) * TIMELINE_WIDTH, TIMELINE_WIDTH - 4)

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 7.3 — Debounce и Throttle async
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(mode === 'debounce')} onClick={() => setMode('debounce')}>
          Debounce (300ms)
        </button>
        <button style={tabStyle(mode === 'throttle')} onClick={() => setMode('throttle')}>
          Throttle (500ms)
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        <div style={{
          background: '#0f172a',
          borderRadius: '6px',
          padding: '0.5rem 0.75rem',
          marginBottom: '1rem',
          fontSize: '0.8rem',
          color: '#94a3b8',
          borderLeft: `3px solid ${mode === 'debounce' ? '#3b82f6' : '#f59e0b'}`,
        }}>
          {mode === 'debounce'
            ? 'Debounce: запрос отправляется только если пользователь не печатал 300ms. Пишите быстро — запрос откладывается.'
            : 'Throttle: запрос отправляется не чаще одного раза в 500ms. Пишите быстро — запросы идут равномерно.'}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={`Введите поисковый запрос... (${mode})`}
          style={{
            width: '100%',
            padding: '0.6rem 0.75rem',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#0f172a',
            color: '#e2e8f0',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Stats */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
            <span style={{ color: '#64748b' }}>Нажатий: </span>
            <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>{pressCount}</span>
          </div>
          <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
            <span style={{ color: '#64748b' }}>Запросов: </span>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>{callCount}</span>
          </div>
          {pressCount > 0 && (
            <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.5rem 0.75rem' }}>
              <span style={{ color: '#64748b' }}>Экономия: </span>
              <span style={{ color: '#34d399', fontWeight: 'bold' }}>
                {Math.round((1 - callCount / Math.max(pressCount, 1)) * 100)}%
              </span>
            </div>
          )}
        </div>

        {/* Timeline */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            TIMELINE (последние {TIMELINE_MS / 1000}с)
          </div>
          <div style={{ position: 'relative', height: '60px', overflowX: 'hidden' }}>
            {/* Timeline axis */}
            <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, height: '1px', background: '#1e293b' }} />

            {events.map((ev) => (
              <div
                key={ev.id}
                style={{
                  position: 'absolute',
                  bottom: ev.type === 'press' ? '8px' : '22px',
                  left: `${getEventX(ev.time)}px`,
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: ev.type === 'press' ? '#64748b' : '#10b981',
                  transform: 'translateX(-50%)',
                  transition: 'left 0.1s',
                }}
                title={`${ev.type} at ${ev.time}ms`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', fontSize: '0.72rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#64748b' }} />
              <span style={{ color: '#64748b' }}>нажатие</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ color: '#64748b' }}>запрос</span>
            </div>
          </div>
        </div>

        <button
          onClick={resetAll}
          style={{
            marginTop: '0.75rem',
            padding: '0.4rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#374151',
            color: '#e5e7eb',
            fontFamily: 'inherit',
            fontSize: '0.82rem',
          }}
        >
          Сбросить
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 7.4 Solution: Async Mutex
// ============================================

class AsyncMutex {
  private queue: Array<() => void> = []
  private locked = false

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true
      return
    }
    return new Promise<void>((resolve) => {
      this.queue.push(resolve)
    })
  }

  release(): void {
    if (this.queue.length > 0) {
      const next = this.queue.shift()!
      next()
    } else {
      this.locked = false
    }
  }

  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire()
    try {
      return await fn()
    } finally {
      this.release()
    }
  }
}

interface MutexLogEntry {
  process: 'A' | 'B'
  action: string
  counter: number
  conflict: boolean
  time: number
}

export function Task7_4_Solution() {
  const [useMutex, setUseMutex] = useState(false)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<MutexLogEntry[]>([])
  const [finalCounter, setFinalCounter] = useState<number | null>(null)

  const handleRun = async () => {
    setRunning(true)
    setLog([])
    setFinalCounter(null)

    let counter = 0
    const entries: MutexLogEntry[] = []
    const startTime = Date.now()
    const mutex = new AsyncMutex()

    const addEntry = (process: 'A' | 'B', action: string, currentCounter: number, conflict = false) => {
      entries.push({ process, action, counter: currentCounter, conflict, time: Date.now() - startTime })
      setLog([...entries])
    }

    const runProcess = async (name: 'A' | 'B', iterations: number) => {
      for (let i = 0; i < iterations; i++) {
        if (useMutex) {
          await mutex.withLock(async () => {
            const read = counter
            addEntry(name, `read: ${read}`, read)
            await new Promise((r) => setTimeout(r, 20 + Math.random() * 30))
            counter = read + 1
            addEntry(name, `write: ${counter}`, counter)
          })
        } else {
          const read = counter
          addEntry(name, `read: ${read}`, read)
          await new Promise((r) => setTimeout(r, 20 + Math.random() * 30))
          const expected = read + 1
          const conflict = counter !== read
          counter = read + 1
          addEntry(name, `write: ${counter}${conflict ? ' (КОНФЛИКТ!)' : ''}`, counter, conflict)
        }
      }
    }

    await Promise.all([
      runProcess('A', 5),
      runProcess('B', 5),
    ])

    setFinalCounter(counter)
    setRunning(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const conflicts = log.filter((e) => e.conflict).length

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 7.4 — Async Mutex
      </h2>

      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.82rem',
        color: '#94a3b8',
        borderLeft: `3px solid ${useMutex ? '#10b981' : '#ef4444'}`,
      }}>
        {useMutex
          ? 'Mutex: процессы A и B поочерёдно захватывают блокировку. Гонки нет — счётчик всегда будет 10.'
          : 'Без mutex: оба процесса читают, ждут, пишут — результат непредсказуем (race condition!).'}
      </div>

      {/* Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <span style={{ color: useMutex ? '#475569' : '#ef4444', fontSize: '0.85rem' }}>Без Mutex</span>
        <div
          onClick={() => !running && setUseMutex((v) => !v)}
          style={{
            width: '48px', height: '24px', borderRadius: '12px', cursor: running ? 'not-allowed' : 'pointer',
            background: useMutex ? '#10b981' : '#ef4444',
            position: 'relative', transition: 'background 0.2s',
          }}
        >
          <div style={{
            position: 'absolute', top: '2px',
            left: useMutex ? '26px' : '2px',
            width: '20px', height: '20px',
            borderRadius: '50%', background: '#fff',
            transition: 'left 0.2s',
          }} />
        </div>
        <span style={{ color: useMutex ? '#10b981' : '#475569', fontSize: '0.85rem' }}>С Mutex</span>
      </div>

      {/* Code snippet */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          {useMutex
            ? `await mutex.withLock(async () => {
  const read = counter        // безопасно
  await delay(25)             // другой процесс ждёт
  counter = read + 1          // гонки нет
})`
            : `const read = counter            // A читает 0
await delay(25)               // B тоже читает 0!
counter = read + 1            // A пишет 1
// B пишет 1 вместо 2 — потеря обновления!`}
        </pre>
      </div>

      {/* Log */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
          ЛОГ ОПЕРАЦИЙ {log.length > 0 && `(конфликтов: ${conflicts})`}
        </div>
        {log.length === 0 && (
          <div style={{ color: '#475569', fontSize: '0.8rem' }}>Запустите симуляцию...</div>
        )}
        {log.map((entry, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: '0.5rem',
            fontSize: '0.78rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            background: entry.conflict ? '#450a0a' : 'transparent',
            borderLeft: `3px solid ${entry.process === 'A' ? '#3b82f6' : '#8b5cf6'}`,
            marginBottom: '0.2rem',
          }}>
            <span style={{ color: '#475569', minWidth: '40px' }}>{entry.time}ms</span>
            <span style={{
              color: entry.process === 'A' ? '#60a5fa' : '#a78bfa',
              fontWeight: 'bold', minWidth: '16px',
            }}>
              {entry.process}
            </span>
            <span style={{ color: entry.conflict ? '#f87171' : '#94a3b8' }}>
              {entry.action}
            </span>
          </div>
        ))}
      </div>

      {finalCounter !== null && (
        <div style={{
          background: finalCounter === 10 ? '#052e16' : '#450a0a',
          border: `1px solid ${finalCounter === 10 ? '#10b981' : '#ef4444'}`,
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.85rem',
        }}>
          <span style={{ color: finalCounter === 10 ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
            Итог: counter = {finalCounter} (ожидалось 10)
          </span>
          <span style={{ color: '#64748b', marginLeft: '1rem' }}>
            {finalCounter === 10 ? 'Корректно!' : `Потеряно ${10 - finalCounter} обновлений из-за гонки`}
          </span>
        </div>
      )}

      <button
        onClick={handleRun}
        disabled={running}
        style={{
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          border: 'none',
          cursor: running ? 'not-allowed' : 'pointer',
          background: running ? '#1e293b' : useMutex ? '#059669' : '#dc2626',
          color: running ? '#475569' : '#fff',
          fontFamily: 'inherit',
          fontSize: '0.85rem',
        }}
      >
        {running ? 'Выполняется...' : `Запустить (${useMutex ? 'с Mutex' : 'без Mutex'})`}
      </button>
    </div>
  )
}

// ============================================
// Task 7.5 Solution: Circuit Breaker
// ============================================

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'
type ApiMode = 'stable' | 'unstable' | 'down'

interface CircuitBreakerConfig {
  failureThreshold: number
  resetTimeout: number
}

interface CBLogEntry {
  time: number
  message: string
  type: 'success' | 'error' | 'open' | 'half_open' | 'close' | 'rejected'
}

export function Task7_5_Solution() {
  const [apiMode, setApiMode] = useState<ApiMode>('stable')
  const [cbState, setCbState] = useState<CircuitState>('CLOSED')
  const [failureCount, setFailureCount] = useState(0)
  const [config, setConfig] = useState<CircuitBreakerConfig>({
    failureThreshold: 3,
    resetTimeout: 3000,
  })
  const [cbLog, setCbLog] = useState<CBLogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [requestCount, setRequestCount] = useState(0)

  const stateRef = useRef<CircuitState>('CLOSED')
  const failuresRef = useRef(0)
  const openTimeRef = useRef<number>(0)

  const addLog = useCallback((message: string, type: CBLogEntry['type']) => {
    const entry: CBLogEntry = { time: Date.now(), message, type }
    setCbLog((prev) => [...prev.slice(-20), entry])
  }, [])

  const callApi = useCallback(async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (apiMode === 'stable') resolve('OK')
        else if (apiMode === 'down') reject(new Error('Service down'))
        else if (Math.random() < 0.7) reject(new Error('Flaky error'))
        else resolve('OK')
      }, 200 + Math.random() * 100)
    })
  }, [apiMode])

  const makeRequest = useCallback(async () => {
    setRequestCount((c) => c + 1)

    if (stateRef.current === 'OPEN') {
      const now = Date.now()
      const elapsed = now - openTimeRef.current
      if (elapsed < config.resetTimeout) {
        addLog(`Запрос отклонён (OPEN, осталось ${Math.round((config.resetTimeout - elapsed) / 1000)}с)`, 'rejected')
        return
      } else {
        stateRef.current = 'HALF_OPEN'
        setCbState('HALF_OPEN')
        addLog('Переход в HALF_OPEN — пробный запрос', 'half_open')
      }
    }

    try {
      const result = await callApi()
      if (stateRef.current === 'HALF_OPEN') {
        stateRef.current = 'CLOSED'
        failuresRef.current = 0
        setCbState('CLOSED')
        setFailureCount(0)
        addLog(`Успех в HALF_OPEN — автомат закрыт (CLOSED)`, 'close')
      } else {
        failuresRef.current = 0
        setFailureCount(0)
        addLog(`Запрос успешен: ${result}`, 'success')
      }
    } catch (e: unknown) {
      failuresRef.current += 1
      setFailureCount(failuresRef.current)
      const msg = e instanceof Error ? e.message : String(e)

      if (failuresRef.current >= config.failureThreshold || stateRef.current === 'HALF_OPEN') {
        stateRef.current = 'OPEN'
        openTimeRef.current = Date.now()
        setCbState('OPEN')
        addLog(`Ошибка #${failuresRef.current}: ${msg} — автомат ОТКРЫТ (OPEN)`, 'open')
      } else {
        addLog(`Ошибка #${failuresRef.current}/${config.failureThreshold}: ${msg}`, 'error')
      }
    }
  }, [callApi, config, addLog])

  const handleAutoTest = async () => {
    setRunning(true)
    for (let i = 0; i < 10; i++) {
      await makeRequest()
      await new Promise((r) => setTimeout(r, 400))
    }
    setRunning(false)
  }

  const handleReset = () => {
    stateRef.current = 'CLOSED'
    failuresRef.current = 0
    setCbState('CLOSED')
    setFailureCount(0)
    setCbLog([])
    setRequestCount(0)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const stateColor: Record<CircuitState, string> = {
    CLOSED: '#10b981',
    OPEN: '#ef4444',
    HALF_OPEN: '#f59e0b',
  }

  const stateLabel: Record<CircuitState, string> = {
    CLOSED: 'CLOSED (работает)',
    OPEN: 'OPEN (заблокирован)',
    HALF_OPEN: 'HALF-OPEN (проверка)',
  }

  const logColor: Record<CBLogEntry['type'], string> = {
    success: '#10b981',
    error: '#f87171',
    open: '#ef4444',
    half_open: '#f59e0b',
    close: '#34d399',
    rejected: '#64748b',
  }

  const apiModeStyle = (m: ApiMode): React.CSSProperties => ({
    padding: '0.4rem 0.75rem',
    borderRadius: '6px',
    border: `1px solid ${apiMode === m ? '#3b82f6' : '#334155'}`,
    cursor: 'pointer',
    background: apiMode === m ? '#1e3a5f' : '#1e293b',
    color: apiMode === m ? '#60a5fa' : '#64748b',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 7.5 — Circuit Breaker
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left: controls */}
        <div style={{ minWidth: '220px', flex: '0 0 220px' }}>
          {/* State indicator */}
          <div style={{
            background: stateColor[cbState] + '22',
            border: `2px solid ${stateColor[cbState]}`,
            borderRadius: '8px',
            padding: '1rem',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem' }}>СОСТОЯНИЕ</div>
            <div style={{ color: stateColor[cbState], fontWeight: 'bold', fontSize: '1rem' }}>
              {stateLabel[cbState]}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Ошибок подряд: {failureCount}/{config.failureThreshold}
            </div>
          </div>

          {/* API mode */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>РЕЖИМ API</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <button style={apiModeStyle('stable')} onClick={() => setApiMode('stable')}>
                Стабильный (0% ошибок)
              </button>
              <button style={apiModeStyle('unstable')} onClick={() => setApiMode('unstable')}>
                Нестабильный (70%)
              </button>
              <button style={apiModeStyle('down')} onClick={() => setApiMode('down')}>
                Упал (100% ошибок)
              </button>
            </div>
          </div>

          {/* Config */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>НАСТРОЙКИ</div>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
              Порог ошибок: <span style={{ color: '#f87171', fontWeight: 'bold' }}>{config.failureThreshold}</span>
            </label>
            <input type="range" min={1} max={10} value={config.failureThreshold}
              onChange={(e) => setConfig((c) => ({ ...c, failureThreshold: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#ef4444', marginBottom: '0.75rem' }} />
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
              Reset timeout: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{config.resetTimeout / 1000}с</span>
            </label>
            <input type="range" min={1000} max={10000} step={1000} value={config.resetTimeout}
              onChange={(e) => setConfig((c) => ({ ...c, resetTimeout: Number(e.target.value) }))}
              style={{ width: '100%', accentColor: '#f59e0b' }} />
          </div>

          {/* Stats */}
          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Всего запросов: {requestCount}
          </div>
        </div>

        {/* Right: log + actions */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          {/* State machine diagram */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
              АВТОМАТ СОСТОЯНИЙ
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              {(['CLOSED', 'OPEN', 'HALF_OPEN'] as CircuitState[]).map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '6px',
                    border: `2px solid ${cbState === s ? stateColor[s] : '#334155'}`,
                    background: cbState === s ? stateColor[s] + '22' : '#0f172a',
                    color: cbState === s ? stateColor[s] : '#475569',
                    fontWeight: cbState === s ? 'bold' : 'normal',
                    fontSize: '0.7rem',
                    transition: 'all 0.2s',
                  }}>
                    {s === 'HALF_OPEN' ? 'HALF-OPEN' : s}
                  </div>
                  {i < 2 && <span style={{ color: '#334155' }}>→</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Log */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ЛОГ СОБЫТИЙ</div>
            {cbLog.length === 0 && (
              <div style={{ color: '#475569', fontSize: '0.8rem' }}>Нажмите кнопку запроса...</div>
            )}
            {cbLog.map((entry, i) => (
              <div key={i} style={{
                fontSize: '0.78rem',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                borderLeft: `3px solid ${logColor[entry.type]}`,
                marginBottom: '0.2rem',
                background: '#0f172a',
              }}>
                <span style={{ color: logColor[entry.type] }}>{entry.message}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={makeRequest}
              disabled={running}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: running ? 'not-allowed' : 'pointer',
                background: '#3b82f6',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
              }}
            >
              Один запрос
            </button>
            <button
              onClick={handleAutoTest}
              disabled={running}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: running ? 'not-allowed' : 'pointer',
                background: running ? '#1e293b' : '#7c3aed',
                color: running ? '#475569' : '#fff',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
              }}
            >
              {running ? 'Тест...' : '10 запросов (авто)'}
            </button>
            <button
              onClick={handleReset}
              disabled={running}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: '#374151',
                color: '#e5e7eb',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
              }}
            >
              Сброс
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
