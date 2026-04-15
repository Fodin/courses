import { useState, useRef, useEffect } from 'react'

// ============================================
// Task 3.1 Solution: Promise Constructor Visualizer
// ============================================

type PromiseState = 'pending' | 'fulfilled' | 'rejected'

interface LogEntry {
  time: number
  type: 'sync' | 'async' | 'error' | 'info'
  message: string
}

export function Task3_1_Solution() {
  const [promiseState, setPromiseState] = useState<PromiseState>('pending')
  const [inputValue, setInputValue] = useState('42')
  const [settledValue, setSettledValue] = useState<string | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const [isSettled, setIsSettled] = useState(false)
  const [showLock, setShowLock] = useState(false)
  const startTimeRef = useRef(performance.now())

  const addLog = (type: LogEntry['type'], message: string) => {
    const elapsed = Math.round(performance.now() - startTimeRef.current)
    setLog((prev) => [...prev, { time: elapsed, type, message }])
  }

  const handleReset = () => {
    setPromiseState('pending')
    setSettledValue(null)
    setIsSettled(false)
    setShowLock(false)
    setLog([])
    startTimeRef.current = performance.now()
  }

  const handleResolve = () => {
    if (isSettled) {
      setShowLock(true)
      setTimeout(() => setShowLock(false), 1200)
      addLog('error', `resolve("${inputValue}") проигнорирован — промис уже settled`)
      return
    }
    // executor runs synchronously — log it synchronously
    addLog('sync', `executor: resolve("${inputValue}") вызван`)
    setPromiseState('fulfilled')
    setSettledValue(inputValue)
    setIsSettled(true)
    // .then() callback is always async (microtask)
    Promise.resolve().then(() => {
      addLog('async', `.then(value => ...) — колбэк выполнен асинхронно (микротаска)`)
    })
  }

  const handleReject = () => {
    if (isSettled) {
      setShowLock(true)
      setTimeout(() => setShowLock(false), 1200)
      addLog('error', `reject("Ошибка!") проигнорирован — промис уже settled`)
      return
    }
    addLog('sync', `executor: reject(new Error("Ошибка!")) вызван`)
    setPromiseState('rejected')
    setSettledValue('Error: Ошибка!')
    setIsSettled(true)
    Promise.resolve().then(() => {
      addLog('async', `.catch(err => ...) — колбэк выполнен асинхронно (микротаска)`)
    })
  }

  const handleThrow = () => {
    if (isSettled) {
      setShowLock(true)
      setTimeout(() => setShowLock(false), 1200)
      addLog('error', `throw проигнорирован — промис уже settled`)
      return
    }
    addLog('sync', `executor: throw new Error("throw внутри executor") — перехватывается как reject`)
    setPromiseState('rejected')
    setSettledValue('Error: throw внутри executor')
    setIsSettled(true)
    Promise.resolve().then(() => {
      addLog('async', `.catch(err => ...) — колбэк выполнен асинхронно (микротаска)`)
    })
  }

  const stateColor: Record<PromiseState, string> = {
    pending: '#64748b',
    fulfilled: '#10b981',
    rejected: '#ef4444',
  }

  const stateLabel: Record<PromiseState, string> = {
    pending: 'pending (ожидание)',
    fulfilled: 'fulfilled (выполнен)',
    rejected: 'rejected (отклонён)',
  }

  const logColor: Record<LogEntry['type'], string> = {
    sync: '#60a5fa',
    async: '#a78bfa',
    error: '#f87171',
    info: '#94a3b8',
  }

  const logLabel: Record<LogEntry['type'], string> = {
    sync: 'SYNC',
    async: 'ASYNC',
    error: 'IGNORE',
    info: 'INFO',
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const btn = (color: string, disabled?: boolean): React.CSSProperties => ({
    padding: '0.45rem 1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.82rem',
    opacity: disabled ? 0.6 : 1,
  })

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 3.1 — Конструктор Promise
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* State visualizer */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Состояние промиса
          </div>

          {/* Three states */}
          {(['pending', 'fulfilled', 'rejected'] as PromiseState[]).map((s) => (
            <div
              key={s}
              style={{
                background: promiseState === s ? stateColor[s] + '22' : '#1e293b',
                border: `2px solid ${promiseState === s ? stateColor[s] : '#334155'}`,
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s',
              }}
            >
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: promiseState === s ? stateColor[s] : '#334155',
                boxShadow: promiseState === s ? `0 0 10px ${stateColor[s]}` : 'none',
                flexShrink: 0,
                transition: 'all 0.3s',
              }} />
              <div>
                <div style={{ color: promiseState === s ? stateColor[s] : '#475569', fontWeight: promiseState === s ? 'bold' : 'normal', fontSize: '0.85rem' }}>
                  {s}
                </div>
                {s === 'pending' && <div style={{ fontSize: '0.72rem', color: '#475569' }}>промис ждёт результата</div>}
                {s === 'fulfilled' && settledValue && promiseState === 'fulfilled' && (
                  <div style={{ fontSize: '0.72rem', color: '#6ee7b7' }}>значение: "{settledValue}"</div>
                )}
                {s === 'rejected' && settledValue && promiseState === 'rejected' && (
                  <div style={{ fontSize: '0.72rem', color: '#fca5a5' }}>{settledValue}</div>
                )}
              </div>
            </div>
          ))}

          {/* Settled lock */}
          {isSettled && (
            <div style={{
              background: showLock ? '#451a03' : '#1e3a5f22',
              border: `1px solid ${showLock ? '#f59e0b' : '#334155'}`,
              borderRadius: '8px',
              padding: '0.6rem 1rem',
              marginTop: '0.5rem',
              fontSize: '0.78rem',
              color: showLock ? '#fbbf24' : '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
            }}>
              <span style={{ fontSize: '1rem' }}>{showLock ? '🔒' : '🔒'}</span>
              {showLock
                ? 'Промис settled — повторные resolve/reject игнорируются!'
                : 'Промис settled — состояние иммутабельно'}
            </div>
          )}

          {/* Code snippet */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginTop: '1rem', fontSize: '0.78rem', lineHeight: 1.7 }}>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.4rem' }}>КОД</div>
            <pre style={{ margin: 0, color: '#cbd5e1' }}>
{`const p = new Promise((resolve, reject) => {
  // executor выполняется СИНХРОННО
  console.log('executor запущен')
  resolve("${inputValue}") // или reject(err)
})

// .then() — всегда асинхронно (микротаска)
p.then(value => console.log(value))
console.log('после p.then()')
// порядок: 'executor запущен' → 'после p.then()' → value`}
            </pre>
          </div>
        </div>

        {/* Controls */}
        <div style={{ minWidth: '240px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Управление
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
              Значение для resolve:
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                width: '100%',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.4rem 0.6rem',
                color: '#e2e8f0',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
            <button style={btn('#059669')} onClick={handleResolve}>
              resolve("{inputValue}")
            </button>
            <button style={btn('#dc2626')} onClick={handleReject}>
              reject(new Error("Ошибка!"))
            </button>
            <button style={btn('#7c3aed')} onClick={handleThrow}>
              throw внутри executor
            </button>
            <button style={btn('#374151')} onClick={handleReset}>
              Сброс / новый Promise
            </button>
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Лог событий
          </div>
          <div style={{
            background: '#0a0f1a',
            borderRadius: '8px',
            padding: '0.6rem',
            minHeight: '120px',
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '0.75rem',
            lineHeight: 1.6,
          }}>
            {log.length === 0 && (
              <div style={{ color: '#334155', textAlign: 'center', marginTop: '1rem' }}>
                Нажмите кнопку для запуска
              </div>
            )}
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.2rem' }}>
                <span style={{ color: '#475569', minWidth: '40px', textAlign: 'right' }}>
                  +{entry.time}ms
                </span>
                <span style={{
                  background: logColor[entry.type] + '22',
                  color: logColor[entry.type],
                  borderRadius: '3px',
                  padding: '0 0.3rem',
                  minWidth: '46px',
                  textAlign: 'center',
                  fontSize: '0.68rem',
                }}>
                  {logLabel[entry.type]}
                </span>
                <span style={{ color: '#cbd5e1', flex: 1 }}>{entry.message}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', background: '#1e293b', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
            <span style={{ color: '#60a5fa' }}>Ключевое:</span> executor выполняется синхронно,
            колбэки .then()/.catch() — всегда асинхронно через очередь микротасок.
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', background: '#1e293b', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
        <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>Текущее состояние: </span>
        <span style={{ color: stateColor[promiseState], fontWeight: 'bold' }}>
          {stateLabel[promiseState]}
        </span>
        {settledValue && (
          <span style={{ color: '#475569' }}> · значение: <span style={{ color: '#e2e8f0' }}>{settledValue}</span></span>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 3.2 Solution: then/catch/finally Pipeline
// ============================================

type BlockType = 'then' | 'catch' | 'finally'
type BlockStatus = 'idle' | 'active' | 'pass' | 'handled' | 'skipped'

interface PipelineBlock {
  id: number
  type: BlockType
  label: string
  throwHere: boolean
  status: BlockStatus
}

const makeBlocks = (throws: boolean[]): PipelineBlock[] => [
  { id: 0, type: 'then', label: '.then(v => v * 2)', throwHere: throws[0], status: 'idle' },
  { id: 1, type: 'then', label: '.then(v => v + 10)', throwHere: throws[1], status: 'idle' },
  { id: 2, type: 'catch', label: '.catch(err => 0)', throwHere: throws[2], status: 'idle' },
  { id: 3, type: 'then', label: '.then(v => `result: ${v}`)', throwHere: throws[3], status: 'idle' },
  { id: 4, type: 'finally', label: '.finally(() => cleanup())', throwHere: false, status: 'idle' },
]

export function Task3_2_Solution() {
  const [startValue, setStartValue] = useState('5')
  const [throwFlags, setThrowFlags] = useState([false, false, false, false])
  const [blocks, setBlocks] = useState<PipelineBlock[]>(() => makeBlocks([false, false, false, false]))
  const [isRunning, setIsRunning] = useState(false)
  const [finalResult, setFinalResult] = useState<{ value: string; isError: boolean } | null>(null)
  const [currentValue, setCurrentValue] = useState<string | null>(null)
  const [stepLog, setStepLog] = useState<string[]>([])

  const toggleThrow = (idx: number) => {
    const next = throwFlags.map((f, i) => (i === idx ? !f : f))
    setThrowFlags(next)
    setBlocks(makeBlocks(next))
    setFinalResult(null)
    setStepLog([])
    setCurrentValue(null)
  }

  const runPipeline = async () => {
    setIsRunning(true)
    setFinalResult(null)
    setStepLog([])
    const freshBlocks = makeBlocks(throwFlags)
    setBlocks(freshBlocks)

    const logs: string[] = []
    const initial = Number(startValue) || 0
    logs.push(`Старт: Promise.resolve(${initial})`)
    setStepLog([...logs])

    // Simulate pipeline step by step
    let isError = false
    let val: string | number = initial

    for (let i = 0; i < freshBlocks.length; i++) {
      await new Promise((r) => setTimeout(r, 400))
      const block = freshBlocks[i]

      setBlocks((prev) =>
        prev.map((b, bi) => ({
          ...b,
          status: bi < i ? b.status : bi === i ? 'active' : 'idle',
        }))
      )
      setCurrentValue(isError ? `Error` : String(val))

      await new Promise((r) => setTimeout(r, 400))

      if (block.type === 'then') {
        if (isError) {
          // error skips .then()
          freshBlocks[i].status = 'skipped'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'skipped' } : b))
          logs.push(`Блок ${i} (.then) пропущен — значение в ошибке`)
        } else if (block.throwHere) {
          // throw in .then → becomes rejection
          isError = true
          val = 'Error: throw в блоке ' + i
          freshBlocks[i].status = 'handled'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'handled' } : b))
          logs.push(`Блок ${i} (.then) бросил ошибку → переходим в error-путь`)
        } else {
          // normal execution
          if (block.id === 0) val = (Number(val) * 2)
          else if (block.id === 1) val = (Number(val) + 10)
          else if (block.id === 3) val = `result: ${val}`
          freshBlocks[i].status = 'pass'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'pass' } : b))
          logs.push(`Блок ${i} (.then): значение → ${val}`)
        }
      } else if (block.type === 'catch') {
        if (isError) {
          // catch handles the error
          isError = false
          val = block.throwHere ? (() => { isError = true; return 'Error: throw в catch' })() : 0
          freshBlocks[i].status = 'handled'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'handled' } : b))
          logs.push(`Блок ${i} (.catch): поймал ошибку → возвращает ${isError ? 'новую ошибку' : val}`)
        } else {
          freshBlocks[i].status = 'skipped'
          setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'skipped' } : b))
          logs.push(`Блок ${i} (.catch) пропущен — ошибок нет`)
        }
      } else if (block.type === 'finally') {
        freshBlocks[i].status = 'pass'
        setBlocks((prev) => prev.map((b, bi) => bi === i ? { ...b, status: 'pass' } : b))
        logs.push(`Блок ${i} (.finally): выполнен всегда (значение не меняет)`)
      }

      setStepLog([...logs])
    }

    setCurrentValue(null)
    setFinalResult({ value: isError ? String(val) : String(val), isError })
    setIsRunning(false)
  }

  const handleReset = () => {
    setBlocks(makeBlocks(throwFlags))
    setFinalResult(null)
    setStepLog([])
    setCurrentValue(null)
  }

  const blockColor: Record<BlockType, string> = {
    then: '#3b82f6',
    catch: '#ef4444',
    finally: '#f59e0b',
  }

  const statusStyle = (status: BlockStatus, type: BlockType): React.CSSProperties => {
    if (status === 'active') return { background: blockColor[type] + '44', border: `2px solid ${blockColor[type]}`, boxShadow: `0 0 12px ${blockColor[type]}60` }
    if (status === 'pass') return { background: '#052e1644', border: '2px solid #10b981' }
    if (status === 'handled') return { background: '#7c3aed22', border: '2px solid #8b5cf6' }
    if (status === 'skipped') return { background: '#1e293b', border: '2px solid #334155', opacity: 0.5 }
    return { background: '#1e293b', border: '2px solid #334155' }
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 3.2 — then/catch/finally цепочка
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Pipeline */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Конвейер
          </div>

          {/* Start value */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ background: '#1e3a5f', border: '1px solid #3b82f6', borderRadius: '6px', padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#60a5fa' }}>
              Promise.resolve({startValue})
            </div>
            <span style={{ color: '#334155', fontSize: '1.2rem' }}>↓</span>
          </div>

          {blocks.map((block, i) => (
            <div key={block.id}>
              <div style={{
                borderRadius: '8px',
                padding: '0.6rem 0.9rem',
                marginBottom: '0.3rem',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
                ...statusStyle(block.status, block.type),
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                  <span style={{
                    background: blockColor[block.type] + '44',
                    color: blockColor[block.type],
                    borderRadius: '4px',
                    padding: '0.1rem 0.4rem',
                    fontSize: '0.68rem',
                    fontWeight: 'bold',
                    minWidth: '42px',
                    textAlign: 'center',
                  }}>
                    {block.type}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>{block.label}</span>
                </div>
                {block.type !== 'finally' && (
                  <button
                    onClick={() => toggleThrow(i < 4 ? i : 3)}
                    style={{
                      background: block.throwHere ? '#450a0a' : '#1e293b',
                      border: `1px solid ${block.throwHere ? '#ef4444' : '#334155'}`,
                      borderRadius: '4px',
                      padding: '0.15rem 0.4rem',
                      fontSize: '0.65rem',
                      color: block.throwHere ? '#fca5a5' : '#475569',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {block.throwHere ? 'throw ON' : 'throw OFF'}
                  </button>
                )}
                {currentValue !== null && block.status === 'active' && (
                  <span style={{ color: '#fbbf24', fontSize: '0.75rem', animation: 'none' }}>
                    → {currentValue}
                  </span>
                )}
              </div>
              {i < blocks.length - 1 && (
                <div style={{ color: '#334155', textAlign: 'center', fontSize: '0.8rem', lineHeight: 1 }}>↓</div>
              )}
            </div>
          ))}

          {/* Result */}
          {finalResult && (
            <div style={{
              marginTop: '0.75rem',
              background: finalResult.isError ? '#450a0a' : '#052e16',
              border: `1px solid ${finalResult.isError ? '#ef4444' : '#10b981'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.82rem',
            }}>
              <span style={{ color: finalResult.isError ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                {finalResult.isError ? 'Unhandled rejection: ' : 'Результат: '}
              </span>
              <span style={{ color: finalResult.isError ? '#fca5a5' : '#6ee7b7' }}>
                {finalResult.value}
              </span>
            </div>
          )}
        </div>

        {/* Controls + log */}
        <div style={{ minWidth: '220px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Настройки
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.78rem', display: 'block', marginBottom: '0.3rem' }}>
              Начальное значение:
            </label>
            <input
              type="number"
              value={startValue}
              onChange={(e) => setStartValue(e.target.value)}
              style={{
                width: '80px',
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '6px',
                padding: '0.4rem 0.6rem',
                color: '#e2e8f0',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              onClick={runPipeline}
              disabled={isRunning}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                background: isRunning ? '#1e293b' : '#3b82f6',
                color: isRunning ? '#475569' : '#fff',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
              }}
            >
              {isRunning ? 'Запуск...' : 'Запустить'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              style={{
                padding: '0.45rem 0.75rem',
                borderRadius: '6px',
                border: 'none',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                background: '#374151',
                color: '#e5e7eb',
                fontFamily: 'inherit',
                fontSize: '0.82rem',
              }}
            >
              Сброс
            </button>
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Лог шагов
          </div>
          <div style={{
            background: '#0a0f1a',
            borderRadius: '8px',
            padding: '0.6rem',
            minHeight: '100px',
            maxHeight: '220px',
            overflowY: 'auto',
            fontSize: '0.73rem',
            lineHeight: 1.7,
            color: '#94a3b8',
          }}>
            {stepLog.length === 0 && (
              <div style={{ color: '#334155', textAlign: 'center', marginTop: '0.5rem' }}>
                Нажмите "Запустить"
              </div>
            )}
            {stepLog.map((entry, i) => (
              <div key={i}>
                <span style={{ color: '#475569' }}>{i}.</span> {entry}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '0.75rem', background: '#1e293b', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.6 }}>
            <div><span style={{ color: '#3b82f6' }}>■</span> .then — happy path</div>
            <div><span style={{ color: '#ef4444' }}>■</span> .catch — ловит ошибку</div>
            <div><span style={{ color: '#f59e0b' }}>■</span> .finally — всегда</div>
            <div><span style={{ color: '#10b981' }}>■</span> прошёл</div>
            <div><span style={{ color: '#8b5cf6' }}>■</span> обработал ошибку</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 3.3 Solution: Promisification
// ============================================

// Simulated callback-based APIs
function callbackReadFile(
  filename: string,
  cb: (err: Error | null, data: string | null) => void
): void {
  setTimeout(() => {
    if (filename.includes('missing')) {
      cb(new Error(`ENOENT: no such file — ${filename}`), null)
    } else {
      cb(null, `Содержимое файла "${filename}" (42 байта)`)
    }
  }, 600)
}

function callbackFetchUser(
  userId: number,
  cb: (err: Error | null, user: { id: number; name: string } | null) => void
): void {
  setTimeout(() => {
    if (userId <= 0) {
      cb(new Error(`Неверный userId: ${userId}`), null)
    } else {
      cb(null, { id: userId, name: `User_${userId}` })
    }
  }, 800)
}

// Promisified versions
function readFileAsync(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    callbackReadFile(filename, (err, data) => {
      if (err) reject(err)
      else resolve(data!)
    })
  })
}

function fetchUserAsync(userId: number): Promise<{ id: number; name: string }> {
  return new Promise((resolve, reject) => {
    callbackFetchUser(userId, (err, user) => {
      if (err) reject(err)
      else resolve(user!)
    })
  })
}

interface TimelineEntry {
  label: string
  startMs: number
  endMs: number | null
  status: 'running' | 'ok' | 'error'
  result: string
}

export function Task3_3_Solution() {
  const [filename, setFilename] = useState('data.txt')
  const [userId, setUserId] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const [timeline, setTimeline] = useState<TimelineEntry[]>([])
  const [activeTab, setActiveTab] = useState<'pattern' | 'promisify'>('pattern')
  const startRef = useRef(0)

  const updateEntry = (index: number, updates: Partial<TimelineEntry>) => {
    setTimeline((prev) => prev.map((e, i) => (i === index ? { ...e, ...updates } : e)))
  }

  const runDemo = async () => {
    setIsRunning(true)
    startRef.current = performance.now()
    const now = () => Math.round(performance.now() - startRef.current)

    const initialEntries: TimelineEntry[] = [
      { label: `Callback: readFile("${filename}")`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Promise: readFile("${filename}")`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Callback: fetchUser(${userId})`, startMs: 0, endMs: null, status: 'running', result: '' },
      { label: `Promise: fetchUser(${userId})`, startMs: 0, endMs: null, status: 'running', result: '' },
    ]
    setTimeline(initialEntries)

    // Run all 4 in parallel (callback and promise versions of each)
    const p1 = new Promise<void>((res) => {
      callbackReadFile(filename, (err, data) => {
        updateEntry(0, {
          endMs: now(),
          status: err ? 'error' : 'ok',
          result: err ? err.message : (data ?? ''),
        })
        res()
      })
    })

    const p2 = readFileAsync(filename).then(
      (data) => updateEntry(1, { endMs: now(), status: 'ok', result: data }),
      (err: Error) => updateEntry(1, { endMs: now(), status: 'error', result: err.message })
    )

    const p3 = new Promise<void>((res) => {
      callbackFetchUser(userId, (err, user) => {
        updateEntry(2, {
          endMs: now(),
          status: err ? 'error' : 'ok',
          result: err ? err.message : JSON.stringify(user),
        })
        res()
      })
    })

    const p4 = fetchUserAsync(userId).then(
      (user) => updateEntry(3, { endMs: now(), status: 'ok', result: JSON.stringify(user) }),
      (err: Error) => updateEntry(3, { endMs: now(), status: 'error', result: err.message })
    )

    await Promise.all([p1, p2, p3, p4])
    setIsRunning(false)
  }

  const handleReset = () => {
    setTimeline([])
    setIsRunning(false)
  }

  const promisifyPattern = `// Шаблон промисификации
function promisify(fn) {
  return function(...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }
}

// Использование:
const readFileAsync = promisify(callbackReadFile)
readFileAsync('data.txt')
  .then(data => console.log(data))
  .catch(err => console.error(err))`

  const nodePromisifyPattern = `// Node.js util.promisify — встроенный вариант
const { promisify } = require('util')
const fs = require('fs')

// Под капотом — тот же шаблон выше,
// плюс поддержка custom promisify symbol
const readFile = promisify(fs.readFile)

readFile('data.txt', 'utf8')
  .then(content => console.log(content))
  .catch(err => console.error(err))

// Или через fs.promises (современный способ):
import { readFile } from 'fs/promises'
const content = await readFile('data.txt', 'utf8')`

  const cs: React.CSSProperties = {
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
    fontSize: '0.82rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const maxDuration = Math.max(800, ...timeline.map((e) => e.endMs ?? 800))

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 3.3 — Промисификация
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tabStyle(activeTab === 'pattern')} onClick={() => setActiveTab('pattern')}>
          Шаблон промисификации
        </button>
        <button style={tabStyle(activeTab === 'promisify')} onClick={() => setActiveTab('promisify')}>
          util.promisify / fs.promises
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Code pattern tab */}
        {activeTab === 'pattern' && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>CALLBACK API</div>
                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7 }}>{`function readFile(filename, callback) {
  // асинхронная операция...
  setTimeout(() => {
    if (error) callback(err, null)
    else callback(null, data)  // Node.js style
  }, 600)
}

// Использование — "callback hell":
readFile('a.txt', (err, data) => {
  if (err) handleErr(err)
  else readFile('b.txt', (err2, data2) => {
    // ...и так далее
  })
})`}</pre>
                </div>
              </div>
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.4rem' }}>PROMISE WRAPPER</div>
                <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
                  <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7 }}>{promisifyPattern}</pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promisify' && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7 }}>{nodePromisifyPattern}</pre>
            </div>
            <div style={{ marginTop: '0.75rem', background: '#1e3a5f22', border: '1px solid #3b82f6', borderRadius: '6px', padding: '0.6rem 0.9rem', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
              <span style={{ color: '#60a5fa' }}>Под капотом util.promisify:</span> проверяет наличие
              Symbol(nodejs.util.promisify.custom) на функции — если он есть, использует его.
              Иначе применяет стандартный шаблон (err, data) callback-конвенции.
            </div>
          </div>
        )}

        {/* Demo */}
        <div style={{ borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Демонстрация: callback vs promise — одинаковый результат
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                Файл (содержит "missing" → ошибка):
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => { setFilename(e.target.value); handleReset() }}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.82rem', width: '160px' }}
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.75rem', display: 'block', marginBottom: '0.3rem' }}>
                userId (0 или меньше → ошибка):
              </label>
              <input
                type="number"
                value={userId}
                onChange={(e) => { setUserId(Number(e.target.value)); handleReset() }}
                style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#e2e8f0', fontFamily: 'inherit', fontSize: '0.82rem', width: '80px' }}
              />
            </div>
            <button
              onClick={runDemo}
              disabled={isRunning}
              style={{ padding: '0.45rem 1.1rem', borderRadius: '6px', border: 'none', cursor: isRunning ? 'not-allowed' : 'pointer', background: isRunning ? '#1e293b' : '#7c3aed', color: isRunning ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.82rem' }}
            >
              {isRunning ? 'Выполняется...' : 'Запустить'}
            </button>
            <button
              onClick={handleReset}
              style={{ padding: '0.45rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#374151', color: '#e5e7eb', fontFamily: 'inherit', fontSize: '0.82rem' }}
            >
              Сброс
            </button>
          </div>

          {/* Timeline */}
          {timeline.length > 0 && (
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.7rem', marginBottom: '0.75rem' }}>
                TIMELINE (масштаб: 0 — {maxDuration}мс)
              </div>
              {timeline.map((entry, i) => (
                <div key={i} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.25rem' }}>
                    {entry.label}
                  </div>
                  <div style={{ position: 'relative', height: '20px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: entry.endMs !== null ? `${(entry.endMs / maxDuration) * 100}%` : '100%',
                      background: entry.status === 'ok' ? '#10b981' : entry.status === 'error' ? '#ef4444' : '#3b82f6',
                      opacity: entry.status === 'running' ? 0.5 : 1,
                      transition: 'width 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '0.4rem',
                    }}>
                      <span style={{ fontSize: '0.65rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        {entry.status === 'running' ? '...' : `${entry.endMs}мс`}
                      </span>
                    </div>
                  </div>
                  {entry.endMs !== null && (
                    <div style={{ fontSize: '0.68rem', marginTop: '0.2rem', color: entry.status === 'ok' ? '#6ee7b7' : '#fca5a5' }}>
                      {entry.result.length > 60 ? entry.result.slice(0, 60) + '...' : entry.result}
                    </div>
                  )}
                </div>
              ))}
              <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#475569', borderTop: '1px solid #1e293b', paddingTop: '0.5rem' }}>
                Callback и Promise версии дают идентичный результат за одинаковое время.
                Промисификация — просто обёртка, не меняющая поведение.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
