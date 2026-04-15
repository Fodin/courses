import { useState, useRef } from 'react'

// ============================================
// Cheat.tsx — Полное решение Level 3: Promise: основы
// Full solution for Level 3: Promise Basics
// ============================================

// -----------------------------------------------
// Task 3.1: Cheat
// -----------------------------------------------

type PromiseState = 'pending' | 'fulfilled' | 'rejected'
type LogEntryType = 'sync' | 'async' | 'error' | 'info'
interface LogEntry { time: number; type: LogEntryType; message: string }

const STATE_COLORS: Record<PromiseState, string> = { pending: '#64748b', fulfilled: '#10b981', rejected: '#ef4444' }
const LOG_COLORS: Record<LogEntryType, string> = { sync: '#60a5fa', async: '#a78bfa', error: '#f87171', info: '#94a3b8' }
const LOG_LABELS: Record<LogEntryType, string> = { sync: 'SYNC', async: 'ASYNC', error: 'IGNORE', info: 'INFO' }

function Task3_1Cheat() {
  const [promiseState, setPromiseState] = useState<PromiseState>('pending')
  const [inputValue, setInputValue] = useState('42')
  const [settledValue, setSettledValue] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const [isSettled, setIsSettled] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const startRef = useRef(performance.now())

  const addLog = (type: LogEntryType, message: string) => {
    const elapsed = Math.round(performance.now() - startRef.current)
    setLog((prev) => [...prev, { time: elapsed, type, message }])
  }

  const settle = (state: PromiseState, value: string, syncMsg: string, asyncMsg: string) => {
    addLog('sync', syncMsg)
    setPromiseState(state)
    setSettledValue(value)
    setIsSettled(true)
    Promise.resolve().then(() => addLog('async', asyncMsg))
  }

  const handleAttempt = (action: () => void) => {
    if (isSettled) {
      setShowLock(true)
      setTimeout(() => setShowLock(false), 1200)
      addLog('error', 'Попытка изменить settled промис — проигнорирована')
    } else {
      action()
    }
  }

  const handleResolve = () => handleAttempt(() =>
    settle('fulfilled', inputValue,
      `executor: resolve("${inputValue}") вызван`,
      '.then(value => ...) — колбэк выполнен асинхронно (микротаска)')
  )
  const handleReject = () => handleAttempt(() =>
    settle('rejected', 'Error: Ошибка!',
      'executor: reject(new Error("Ошибка!")) вызван',
      '.catch(err => ...) — колбэк выполнен асинхронно (микротаска)')
  )
  const handleThrow = () => handleAttempt(() =>
    settle('rejected', 'Error: throw внутри executor',
      'executor: throw new Error("throw внутри executor") — перехватывается как reject',
      '.catch(err => ...) — колбэк выполнен асинхронно (микротаска)')
  )

  const handleReset = () => {
    setPromiseState('pending')
    setSettledValue(null)
    setIsSettled(false)
    setShowLock(false)
    setLog([])
    startRef.current = performance.now()
  }

  const cs: React.CSSProperties = { background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem' }
  const btn = (color: string, disabled?: boolean): React.CSSProperties => ({ padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: disabled ? 'not-allowed' : 'pointer', background: disabled ? '#1e293b' : color, color: disabled ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.82rem', opacity: disabled ? 0.6 : 1 })

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 3.1 — Конструктор Promise</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>СОСТОЯНИЕ ПРОМИСА</div>
          {(['pending', 'fulfilled', 'rejected'] as PromiseState[]).map((s) => (
            <div key={s} style={{ background: promiseState === s ? STATE_COLORS[s] + '22' : '#1e293b', border: `2px solid ${promiseState === s ? STATE_COLORS[s] : '#334155'}`, borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.3s' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: promiseState === s ? STATE_COLORS[s] : '#334155', boxShadow: promiseState === s ? `0 0 10px ${STATE_COLORS[s]}` : 'none', flexShrink: 0, transition: 'all 0.3s' }} />
              <div>
                <div style={{ color: promiseState === s ? STATE_COLORS[s] : '#475569', fontWeight: promiseState === s ? 'bold' : 'normal', fontSize: '0.85rem' }}>{s}</div>
                {settledValue && promiseState === s && s !== 'pending' && (
                  <div style={{ fontSize: '0.72rem', color: s === 'fulfilled' ? '#6ee7b7' : '#fca5a5' }}>{settledValue}</div>
                )}
              </div>
            </div>
          ))}
          {isSettled && (
            <div style={{ background: showLock ? '#451a03' : '#1e293b', border: `1px solid ${showLock ? '#f59e0b' : '#334155'}`, borderRadius: '8px', padding: '0.6rem', marginTop: '0.5rem', fontSize: '0.78rem', color: showLock ? '#fbbf24' : '#475569', display: 'flex', gap: '0.5rem', transition: 'all 0.3s' }}>
              <span>🔒</span>
              {showLock ? 'Промис settled — повторные resolve/reject игнорируются!' : 'Промис settled — состояние иммутабельно'}
            </div>
          )}
        </div>
        <div style={{ minWidth: '240px' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>Значение для resolve:</label>
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.85rem', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button style={btn('#059669')} onClick={handleResolve}>resolve("{inputValue}")</button>
            <button style={btn('#dc2626')} onClick={handleReject}>reject(new Error("Ошибка!"))</button>
            <button style={btn('#7c3aed')} onClick={handleThrow}>throw внутри executor</button>
            <button style={btn('#374151')} onClick={handleReset}>Сброс / новый Promise</button>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ЛОГ СОБЫТИЙ</div>
          <div style={{ background: '#0a0f1a', borderRadius: '8px', padding: '0.6rem', minHeight: '100px', maxHeight: '200px', overflowY: 'auto', fontSize: '0.73rem', lineHeight: 1.6 }}>
            {log.length === 0 && <div style={{ color: '#334155', textAlign: 'center', marginTop: '0.5rem' }}>Нажмите кнопку</div>}
            {log.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ color: '#475569', minWidth: '40px', textAlign: 'right' }}>+{e.time}ms</span>
                <span style={{ background: LOG_COLORS[e.type] + '22', color: LOG_COLORS[e.type], borderRadius: '3px', padding: '0 0.3rem', minWidth: '46px', textAlign: 'center', fontSize: '0.68rem' }}>{LOG_LABELS[e.type]}</span>
                <span style={{ color: '#cbd5e1', flex: 1 }}>{e.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 3.2: Cheat
// -----------------------------------------------

type BlockType2 = 'then' | 'catch' | 'finally'
type BlockStatus2 = 'idle' | 'active' | 'pass' | 'handled' | 'skipped'
interface PBlock { id: number; type: BlockType2; label: string; throwHere: boolean; status: BlockStatus2 }

const BLOCK_COLORS2: Record<BlockType2, string> = { then: '#3b82f6', catch: '#ef4444', finally: '#f59e0b' }

const makeBlocks2 = (throws: boolean[]): PBlock[] => [
  { id: 0, type: 'then', label: '.then(v => v * 2)', throwHere: throws[0], status: 'idle' },
  { id: 1, type: 'then', label: '.then(v => v + 10)', throwHere: throws[1], status: 'idle' },
  { id: 2, type: 'catch', label: '.catch(err => 0)', throwHere: throws[2], status: 'idle' },
  { id: 3, type: 'then', label: '.then(v => `result: ${v}`)', throwHere: throws[3], status: 'idle' },
  { id: 4, type: 'finally', label: '.finally(() => cleanup())', throwHere: false, status: 'idle' },
]

function Task3_2Cheat() {
  const [startValue, setStartValue] = useState('5')
  const [throwFlags, setThrowFlags] = useState([false, false, false, false])
  const [blocks, setBlocks] = useState<PBlock[]>(() => makeBlocks2([false, false, false, false]))
  const [isRunning, setIsRunning] = useState(false)
  const [finalResult, setFinalResult] = useState<{ value: string; isError: boolean } | null>(null)
  const [stepLog, setStepLog] = useState<string[]>([])

  const toggleThrow = (idx: number) => {
    const next = throwFlags.map((f, i) => (i === idx ? !f : f))
    setThrowFlags(next)
    setBlocks(makeBlocks2(next))
    setFinalResult(null)
    setStepLog([])
  }

  const runPipeline = async () => {
    setIsRunning(true)
    setFinalResult(null)
    setStepLog([])
    const fresh = makeBlocks2(throwFlags)
    setBlocks(fresh)

    const logs: string[] = []
    const initial = Number(startValue) || 0
    logs.push(`Старт: Promise.resolve(${initial})`)
    setStepLog([...logs])

    let isError = false
    let val: string | number = initial

    for (let i = 0; i < fresh.length; i++) {
      await new Promise((r) => setTimeout(r, 400))
      setBlocks((prev) => prev.map((b, bi) => ({ ...b, status: bi < i ? b.status : bi === i ? 'active' : 'idle' })))
      await new Promise((r) => setTimeout(r, 400))

      const block = fresh[i]
      if (block.type === 'then') {
        if (isError) {
          fresh[i].status = 'skipped'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'skipped' } : b))
          logs.push(`Блок ${i} (.then) пропущен — значение в ошибке`)
        } else if (block.throwHere) {
          isError = true
          val = `Error: throw в блоке ${i}`
          fresh[i].status = 'handled'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'handled' } : b))
          logs.push(`Блок ${i} (.then) бросил ошибку → error-путь`)
        } else {
          if (block.id === 0) val = Number(val) * 2
          else if (block.id === 1) val = Number(val) + 10
          else if (block.id === 3) val = `result: ${val}`
          fresh[i].status = 'pass'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'pass' } : b))
          logs.push(`Блок ${i} (.then): значение → ${val}`)
        }
      } else if (block.type === 'catch') {
        if (isError) {
          isError = block.throwHere
          val = block.throwHere ? `Error: throw в catch` : 0
          fresh[i].status = 'handled'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'handled' } : b))
          logs.push(`Блок ${i} (.catch): поймал ошибку → ${block.throwHere ? 'новая ошибка' : val}`)
        } else {
          fresh[i].status = 'skipped'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'skipped' } : b))
          logs.push(`Блок ${i} (.catch) пропущен — ошибок нет`)
        }
      } else {
        fresh[i].status = 'pass'
        setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'pass' } : b))
        logs.push(`Блок ${i} (.finally): выполнен всегда`)
      }
      setStepLog([...logs])
    }

    setFinalResult({ value: String(val), isError })
    setIsRunning(false)
  }

  const handleReset = () => { setBlocks(makeBlocks2(throwFlags)); setFinalResult(null); setStepLog([]) }

  const statusStyle2 = (status: BlockStatus2, type: BlockType2): React.CSSProperties => {
    if (status === 'active') return { background: BLOCK_COLORS2[type] + '44', border: `2px solid ${BLOCK_COLORS2[type]}`, boxShadow: `0 0 12px ${BLOCK_COLORS2[type]}60` }
    if (status === 'pass') return { background: '#052e1644', border: '2px solid #10b981' }
    if (status === 'handled') return { background: '#7c3aed22', border: '2px solid #8b5cf6' }
    if (status === 'skipped') return { background: '#1e293b', border: '2px solid #334155', opacity: 0.5 }
    return { background: '#1e293b', border: '2px solid #334155' }
  }

  const cs: React.CSSProperties = { background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem' }

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 3.2 — then/catch/finally цепочка</h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem' }}>Начальное значение:</label>
            <input type="number" value={startValue} onChange={(e) => setStartValue(e.target.value)} style={{ width: '70px', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.85rem' }} />
          </div>
          <div style={{ fontSize: '0.75rem', color: '#3b82f6', marginBottom: '0.4rem' }}>Promise.resolve({startValue})</div>
          {blocks.map((block, i) => (
            <div key={block.id}>
              <div style={{ borderRadius: '8px', padding: '0.6rem 0.9rem', marginBottom: '0.3rem', transition: 'all 0.3s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', ...statusStyle2(block.status, block.type) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <span style={{ background: BLOCK_COLORS2[block.type] + '44', color: BLOCK_COLORS2[block.type], borderRadius: '4px', padding: '0.1rem 0.4rem', fontSize: '0.68rem', fontWeight: 'bold', minWidth: '42px', textAlign: 'center' }}>{block.type}</span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{block.label}</span>
                </div>
                {block.type !== 'finally' && (
                  <button onClick={() => toggleThrow(i < 4 ? i : 3)} style={{ background: block.throwHere ? '#450a0a' : '#1e293b', border: `1px solid ${block.throwHere ? '#ef4444' : '#334155'}`, borderRadius: '4px', padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: block.throwHere ? '#fca5a5' : '#475569', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    {block.throwHere ? 'throw ON' : 'throw OFF'}
                  </button>
                )}
              </div>
              {i < blocks.length - 1 && <div style={{ color: '#334155', textAlign: 'center', fontSize: '0.8rem' }}>↓</div>}
            </div>
          ))}
          {finalResult && (
            <div style={{ marginTop: '0.75rem', background: finalResult.isError ? '#450a0a' : '#052e16', border: `1px solid ${finalResult.isError ? '#ef4444' : '#10b981'}`, borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem' }}>
              <span style={{ color: finalResult.isError ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{finalResult.isError ? 'Unhandled rejection: ' : 'Результат: '}</span>
              <span style={{ color: finalResult.isError ? '#fca5a5' : '#6ee7b7' }}>{finalResult.value}</span>
            </div>
          )}
        </div>
        <div style={{ minWidth: '200px' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button onClick={runPipeline} disabled={isRunning} style={{ padding: '0.45rem 1rem', borderRadius: '6px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer', background: isRunning ? '#1e293b' : '#3b82f6', color: isRunning ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.82rem' }}>{isRunning ? 'Запуск...' : 'Запустить'}</button>
            <button onClick={handleReset} disabled={isRunning} style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#374151', color: '#e5e7eb', fontFamily: 'inherit', fontSize: '0.82rem' }}>Сброс</button>
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>ЛОГ</div>
          <div style={{ background: '#0a0f1a', borderRadius: '8px', padding: '0.6rem', minHeight: '80px', maxHeight: '220px', overflowY: 'auto', fontSize: '0.73rem', lineHeight: 1.7, color: '#94a3b8' }}>
            {stepLog.map((e, i) => <div key={i}><span style={{ color: '#475569' }}>{i}.</span> {e}</div>)}
          </div>
          <div style={{ marginTop: '0.75rem', background: '#1e293b', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.8 }}>
            <div><span style={{ color: '#10b981' }}>■</span> прошёл</div>
            <div><span style={{ color: '#8b5cf6' }}>■</span> обработал ошибку</div>
            <div style={{ opacity: 0.5 }}>░ пропущен</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 3.3: Cheat
// -----------------------------------------------

interface TLEntry { label: string; startMs: number; endMs: number | null; status: 'running' | 'ok' | 'error'; result: string }

function cbReadFile(filename: string, cb: (err: Error | null, data: string | null) => void): void {
  setTimeout(() => {
    if (filename.includes('missing')) cb(new Error(`ENOENT: no such file — ${filename}`), null)
    else cb(null, `Содержимое файла "${filename}" (42 байта)`)
  }, 600)
}

function cbFetchUser(userId: number, cb: (err: Error | null, user: { id: number; name: string } | null) => void): void {
  setTimeout(() => {
    if (userId <= 0) cb(new Error(`Неверный userId: ${userId}`), null)
    else cb(null, { id: userId, name: `User_${userId}` })
  }, 800)
}

function readFileAsync3(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cbReadFile(filename, (err, data) => { if (err) reject(err); else resolve(data!) })
  })
}

function fetchUserAsync3(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve, reject) => {
    cbFetchUser(userId, (err, user) => { if (err) reject(err); else resolve(user!) })
  })
}

function Task3_3Cheat() {
  const [filename, setFilename] = useState('data.txt')
  const [userId, setUserId] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [timeline, setTimeline] = useState<TLEntry[]>([])
  const [activeTab, setActiveTab] = useState<'pattern' | 'promisify'>('pattern')
  const startRef = useRef(0)

  const updateEntry = (index: number, updates: Partial<TLEntry>) => {
    setTimeline((prev) => prev.map((e, i) => (i === index ? { ...e, ...updates } : e)))
  }

  const runDemo = async () => {
    setIsRunning(true)
    startRef.current = performance.now()
    const now = () => Math.round(performance.now() - startRef.current)

    const initial: TLEntry[] = [
      { label: `Callback: readFile("${filename}")`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Promise: readFile("${filename}")`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Callback: fetchUser(${userId})`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Promise: fetchUser(${userId})`, startMs: 0, endMs: null, status: 'running', result: '' },
    ]
    setTimeline(initial)

    const p1 = new Promise<void>((res) => {
      cbReadFile(filename, (err, data) => {
        updateEntry(0, { endMs: now(), status: err ? 'error' : 'ok', result: err ? err.message : (data ?? '') })
        res()
      })
    })
    const p2 = readFileAsync3(filename).then(
      (data) => updateEntry(1, { endMs: now(), status: 'ok', result: data }),
      (err: Error) => updateEntry(1, { endMs: now(), status: 'error', result: err.message })
    )
    const p3 = new Promise<void>((res) => {
      cbFetchUser(userId, (err, user) => {
        updateEntry(2, { endMs: now(), status: err ? 'error' : 'ok', result: err ? err.message : JSON.stringify(user) })
        res()
      })
    })
    const p4 = fetchUserAsync3(userId).then(
      (user) => updateEntry(3, { endMs: now(), status: 'ok', result: JSON.stringify(user) }),
      (err: Error) => updateEntry(3, { endMs: now(), status: 'error', result: err.message })
    )

    await Promise.all([p1, p2, p3, p4])
    setIsRunning(false)
  }

  const cs: React.CSSProperties = { background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem' }
  const tabStyle = (active: boolean): React.CSSProperties => ({ padding: '0.4rem 1rem', borderRadius: '6px 6px 0 0', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.82rem', background: active ? '#1e293b' : '#0f172a', color: active ? '#60a5fa' : '#64748b', borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent' })

  const maxDuration = Math.max(800, ...timeline.map((e) => e.endMs ?? 800))

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>Задание 3.3 — Промисификация</h2>
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button style={tabStyle(activeTab === 'pattern')} onClick={() => setActiveTab('pattern')}>Шаблон промисификации</button>
        <button style={tabStyle(activeTab === 'promisify')} onClick={() => setActiveTab('promisify')}>util.promisify / fs.promises</button>
      </div>
      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {activeTab === 'pattern' && (
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>CALLBACK API</div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}><pre style={{ margin: 0, fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`function readFile(filename, cb) {\n  setTimeout(() => {\n    if (err) cb(error, null)\n    else cb(null, data)\n  }, 600)\n}\n\n// Callback hell:\nreadFile('a.txt', (err, data) => {\n  readFile('b.txt', (err2, data2) => {\n    // ...\n  })\n})`}</pre></div>
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>PROMISIFY PATTERN</div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}><pre style={{ margin: 0, fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`function promisify(fn) {\n  return function(...args) {\n    return new Promise((resolve, reject) => {\n      fn(...args, (err, data) => {\n        if (err) reject(err)\n        else resolve(data)\n      })\n    })\n  }\n}\n\nconst readFileAsync = promisify(readFile)\nawait readFileAsync('a.txt')`}</pre></div>
            </div>
          </div>
        )}
        {activeTab === 'promisify' && (
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
            <pre style={{ margin: 0, fontSize: '0.73rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`const { promisify } = require('util')\nconst fs = require('fs')\n\nconst readFile = promisify(fs.readFile)\nawait readFile('data.txt', 'utf8')\n\n// Современный способ:\nimport { readFile } from 'fs/promises'\nconst content = await readFile('data.txt', 'utf8')`}</pre>
          </div>
        )}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>Файл ("missing" → ошибка):</label>
              <input type="text" value={filename} onChange={(e) => { setFilename(e.target.value); setTimeline([]) }} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.82rem', width: '150px' }} />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>userId (0 → ошибка):</label>
              <input type="number" value={userId} onChange={(e) => { setUserId(Number(e.target.value)); setTimeline([]) }} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.82rem', width: '70px' }} />
            </div>
            <button onClick={runDemo} disabled={isRunning} style={{ padding: '0.45rem 1.1rem', borderRadius: '6px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer', background: isRunning ? '#1e293b' : '#7c3aed', color: isRunning ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.82rem' }}>{isRunning ? 'Выполняется...' : 'Запустить'}</button>
            <button onClick={() => setTimeline([])} style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#374151', color: '#e5e7eb', fontFamily: 'inherit', fontSize: '0.82rem' }}>Сброс</button>
          </div>
          {timeline.length > 0 && (
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              {timeline.map((entry, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem' }}>{entry.label}</div>
                  <div style={{ position: 'relative', height: '20px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: entry.endMs !== null ? `${(entry.endMs / maxDuration) * 100}%` : '100%', background: entry.status === 'ok' ? '#10b981' : entry.status === 'error' ? '#ef4444' : '#3b82f6', opacity: entry.status === 'running' ? 0.5 : 1, transition: 'width 0.3s', display: 'flex', alignItems: 'center', paddingLeft: '0.4rem' }}>
                      <span style={{ fontSize: '0.65rem', color: '#fff' }}>{entry.status === 'running' ? '...' : `${entry.endMs}мс`}</span>
                    </div>
                  </div>
                  {entry.endMs !== null && (
                    <div style={{ fontSize: '0.68rem', marginTop: '0.2rem', color: entry.status === 'ok' ? '#6ee7b7' : '#fca5a5' }}>
                      {entry.result.length > 60 ? entry.result.slice(0, 60) + '...' : entry.result}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Main Cheat component
// -----------------------------------------------

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 3 — Promise: основы</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.1: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>isSettled</strong>: после первого resolve/reject блокируйте повторные вызовы через флаг.
            Не используйте состояние промиса как единственный источник правды — нужен отдельный <code>isSettled: boolean</code>
          </li>
          <li>
            <strong>Асинхронность .then()</strong>: добавляйте ASYNC-лог через <code>Promise.resolve().then(...)</code> —
            это настоящая микротаска, она выполнится после синхронного кода
          </li>
          <li>
            <strong>Временные метки</strong>: <code>performance.now() - startRef.current</code> — сбрасывайте ref при каждом reset
          </li>
          <li>
            <strong>Замок</strong>: <code>showLock=true</code>, через 1200мс <code>showLock=false</code> через setTimeout
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.2: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>makeBlocks(throws)</strong>: создавайте новый массив блоков при каждом toggleThrow —
            это сбрасывает статусы в 'idle'
          </li>
          <li>
            <strong>Анимация</strong>: <code>await new Promise(r =&gt; setTimeout(r, 400))</code> дважды в цикле —
            первый раз для показа 'active', второй для применения результата
          </li>
          <li>
            <strong>Error flow</strong>: флаг <code>isError</code> определяет, проходит ли значение через .then()
            или попадает в .catch(). После catch и return — isError снова false
          </li>
          <li>
            <strong>.finally()</strong>: всегда 'pass', но значение не трогает — он просто выполняется
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 3.3: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Шаблон промисификации</strong>:
            <code>{'new Promise((resolve, reject) => { fn(...args, (err, data) => { err ? reject(err) : resolve(data) }) })'}</code>
          </li>
          <li>
            <strong>updateEntry</strong>: используйте функциональный setState:
            <code>{'setTimeline(prev => prev.map((e, i) => i === index ? {...e, ...updates} : e))'}</code>
          </li>
          <li>
            <strong>Параллельный запуск</strong>: создайте все 4 промиса независимо,
            затем <code>await Promise.all([p1, p2, p3, p4])</code>
          </li>
          <li>
            <strong>maxDuration</strong>: <code>Math.max(800, ...timeline.map(e =&gt; e.endMs ?? 800))</code> —
            для нормализации ширины баров
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Живые компоненты</h3>
        <Task3_1Cheat />
        <div style={{ marginTop: '1.5rem' }} />
        <Task3_2Cheat />
        <div style={{ marginTop: '1.5rem' }} />
        <Task3_3Cheat />
      </section>
    </div>
  )
}
