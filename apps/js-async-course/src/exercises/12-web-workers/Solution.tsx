import { useState, useEffect, useRef, useCallback } from 'react'

// ============================================================
// Shared styles
// ============================================================

const BASE: React.CSSProperties = {
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

const btnStyle = (
  variant: 'primary' | 'danger' | 'success' | 'ghost' = 'primary',
  disabled = false,
): React.CSSProperties => ({
  padding: '0.5rem 1.2rem',
  borderRadius: '6px',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  background: disabled
    ? '#1e293b'
    : variant === 'danger'
      ? '#dc2626'
      : variant === 'success'
        ? '#059669'
        : variant === 'ghost'
          ? '#374151'
          : '#3b82f6',
  color: disabled ? '#475569' : '#fff',
  fontFamily: 'inherit',
  fontSize: '0.85rem',
  transition: 'opacity 0.2s',
  opacity: disabled ? 0.6 : 1,
})

// ============================================================
// Task 12.1 — Web Worker: тяжёлое вычисление
// ============================================================

// Синхронный Фибоначчи — намеренно медленный, экспоненциальная сложность
function fibSync(n: number): number {
  if (n <= 1) return n
  return fibSync(n - 1) + fibSync(n - 2)
}

// Код воркера — будет запущен в отдельном потоке
const WORKER_FIB_CODE = `
self.onmessage = function(e) {
  function fib(n) {
    if (n <= 1) return n
    return fib(n - 1) + fib(n - 2)
  }
  var start = Date.now()
  var result = fib(e.data)
  var elapsed = Date.now() - start
  self.postMessage({ result: result, elapsed: elapsed })
}
`

export function Task12_1_Solution() {
  const [mode, setMode] = useState<'main' | 'worker'>('main')
  const [n, setN] = useState(38)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [spinnerFrame, setSpinnerFrame] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const spinnerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const workerRef = useRef<Worker | null>(null)

  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

  const startSpinner = () => {
    if (spinnerRef.current) clearInterval(spinnerRef.current)
    spinnerRef.current = setInterval(() => {
      setSpinnerFrame((f) => (f + 1) % 10)
    }, 80)
  }

  const stopSpinner = () => {
    if (spinnerRef.current) {
      clearInterval(spinnerRef.current)
      spinnerRef.current = null
    }
  }

  useEffect(() => () => {
    stopSpinner()
    workerRef.current?.terminate()
  }, [])

  const runOnMain = () => {
    setIsRunning(true)
    setResult(null)
    setElapsed(null)
    startSpinner()
    // Даём React один кадр для рендера, затем блокируем поток
    setTimeout(() => {
      const t0 = performance.now()
      const res = fibSync(n)
      const ms = Math.round(performance.now() - t0)
      stopSpinner()
      setResult(`fib(${n}) = ${res}`)
      setElapsed(ms)
      setIsRunning(false)
    }, 16)
  }

  const runOnWorker = () => {
    setIsRunning(true)
    setResult(null)
    setElapsed(null)
    startSpinner()

    const blob = new Blob([WORKER_FIB_CODE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    workerRef.current = worker
    URL.revokeObjectURL(url)

    worker.onmessage = (e: MessageEvent<{ result: number; elapsed: number }>) => {
      stopSpinner()
      setResult(`fib(${n}) = ${e.data.result}`)
      setElapsed(e.data.elapsed)
      setIsRunning(false)
      worker.terminate()
      workerRef.current = null
    }
    worker.onerror = (err) => {
      stopSpinner()
      setResult(`Ошибка: ${err.message}`)
      setIsRunning(false)
    }
    worker.postMessage(n)
  }

  const handleRun = () => (mode === 'main' ? runOnMain() : runOnWorker())

  const handleReset = () => {
    stopSpinner()
    workerRef.current?.terminate()
    workerRef.current = null
    setIsRunning(false)
    setResult(null)
    setElapsed(null)
    setClickCount(0)
    setSpinnerFrame(0)
  }

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 12.1 — Web Worker: тяжёлое вычисление
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button style={tabStyle(mode === 'main')} onClick={() => { setMode('main'); handleReset() }}>
          Main Thread
        </button>
        <button style={tabStyle(mode === 'worker')} onClick={() => { setMode('worker'); handleReset() }}>
          Web Worker
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Info banner */}
        <div style={{
          background: '#0f172a',
          borderLeft: `3px solid ${mode === 'main' ? '#ef4444' : '#10b981'}`,
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#94a3b8',
          lineHeight: 1.6,
        }}>
          {mode === 'main' ? (
            <>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Main Thread режим:</span>{' '}
              fib({n}) блокирует главный поток. Спиннер остановится, кнопка "Кликни меня" не сработает.
            </>
          ) : (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Web Worker режим:</span>{' '}
              fib({n}) выполняется в отдельном потоке. Спиннер крутится, кнопки работают!
            </>
          )}
        </div>

        {/* N slider */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
            N = <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{n}</span>
            <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
              (примерное время: ~{n <= 35 ? '<1' : n <= 38 ? '1-3' : n <= 42 ? '3-15' : '>15'} сек)
            </span>
          </label>
          <input
            type="range" min={30} max={45} value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569' }}>
            <span>30 (быстро)</span>
            <span style={{ color: '#f59e0b' }}>38 (умеренно)</span>
            <span style={{ color: '#ef4444' }}>45 (очень долго)</span>
          </div>
        </div>

        {/* Thread visualization */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {/* Main Thread bar */}
          <div style={{
            flex: 1, minWidth: '120px',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            border: `1px solid ${mode === 'main' && isRunning ? '#ef4444' : '#1e3a5f'}`,
            transition: 'border-color 0.3s',
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem' }}>MAIN THREAD</div>
            <div style={{
              height: '8px', borderRadius: '4px',
              background: mode === 'main' && isRunning
                ? 'linear-gradient(90deg, #ef4444, #f97316)'
                : '#1e293b',
              transition: 'background 0.3s',
              boxShadow: mode === 'main' && isRunning ? '0 0 8px #ef444460' : 'none',
            }} />
            <div style={{ fontSize: '0.72rem', color: mode === 'main' && isRunning ? '#ef4444' : '#475569', marginTop: '0.3rem' }}>
              {mode === 'main' && isRunning ? 'ЗАБЛОКИРОВАН' : 'свободен'}
            </div>
          </div>

          {/* Worker Thread bar */}
          <div style={{
            flex: 1, minWidth: '120px',
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            border: `1px solid ${mode === 'worker' && isRunning ? '#10b981' : '#1e3a5f'}`,
            transition: 'border-color 0.3s',
          }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.4rem' }}>WORKER THREAD</div>
            <div style={{
              height: '8px', borderRadius: '4px',
              background: mode === 'worker' && isRunning
                ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                : '#1e293b',
              transition: 'background 0.3s',
              boxShadow: mode === 'worker' && isRunning ? '0 0 8px #10b98160' : 'none',
            }} />
            <div style={{ fontSize: '0.72rem', color: mode === 'worker' && isRunning ? '#10b981' : '#475569', marginTop: '0.3rem' }}>
              {mode === 'worker' && isRunning ? 'СЧИТАЕТ fib(' + n + ')' : 'не запущен'}
            </div>
          </div>
        </div>

        {/* Spinner + click counter */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem', color: '#60a5fa' }}>
              {isRunning ? spinnerChars[spinnerFrame] : '◉'}
            </span>
            <span style={{ fontSize: '0.82rem', color: isRunning ? '#93c5fd' : '#64748b' }}>
              {isRunning ? (mode === 'main' ? 'UI заморожен...' : 'Воркер считает...') : 'Ожидание'}
            </span>
          </div>
          <button
            onClick={() => setClickCount((c) => c + 1)}
            style={{
              background: '#1e3a5f', border: '1px solid #3b82f6', borderRadius: '8px',
              padding: '0.6rem 1rem', color: '#93c5fd', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: '0.85rem',
            }}
          >
            Кликни меня: {clickCount}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{
            background: '#052e16', border: '1px solid #10b981',
            borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
          }}>
            <span style={{ color: '#10b981', fontWeight: 'bold' }}>Готово: </span>
            <span style={{ color: '#6ee7b7' }}>{result}</span>
            {elapsed !== null && (
              <span style={{ marginLeft: '1rem', color: '#94a3b8', fontSize: '0.82rem' }}>
                ({elapsed} мс)
              </span>
            )}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={btnStyle(mode === 'main' ? 'danger' : 'success', isRunning)}
          >
            {isRunning ? 'Выполняется...' : `Запустить fib(${n})`}
          </button>
          <button onClick={handleReset} style={btnStyle('ghost')}>
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 12.2 — postMessage и Structured Clone
// ============================================================

type DataType = 'object' | 'array' | 'date' | 'map' | 'error' | 'function' | 'dom'

interface TypeInfo {
  label: string
  canClone: boolean
  icon: string
  createValue: () => unknown
  displayValue: (v: unknown) => string
}

const DATA_TYPES: Record<DataType, TypeInfo> = {
  object: {
    label: 'Object',
    canClone: true,
    icon: '{}',
    createValue: () => ({ name: 'Alice', score: 42, nested: { x: 1 } }),
    displayValue: (v) => JSON.stringify(v),
  },
  array: {
    label: 'Array',
    canClone: true,
    icon: '[]',
    createValue: () => [1, 'two', true, null],
    displayValue: (v) => JSON.stringify(v),
  },
  date: {
    label: 'Date',
    canClone: true,
    icon: '📅',
    createValue: () => new Date('2024-01-15'),
    displayValue: (v) => (v as Date).toISOString(),
  },
  map: {
    label: 'Map',
    canClone: true,
    icon: '🗺',
    createValue: () => new Map<string, unknown>([['key1', 'val1'], ['key2', 42]]),
    displayValue: (v) => `Map { ${[...(v as Map<string, unknown>).entries()].map(([k, val]) => `"${k}" => ${JSON.stringify(val)}`).join(', ')} }`,
  },
  error: {
    label: 'Error',
    canClone: true,
    icon: '⚠',
    createValue: () => new Error('Something went wrong'),
    displayValue: (v) => `Error: "${(v as Error).message}"`,
  },
  function: {
    label: 'Function',
    canClone: false,
    icon: 'fn',
    createValue: () => () => 'hello',
    displayValue: () => 'function() { ... }',
  },
  dom: {
    label: 'DOM Node',
    canClone: false,
    icon: '</>',
    createValue: () => null,
    displayValue: () => '<div id="myEl">...</div>',
  },
}

const CLONE_WORKER_CODE = `
self.onmessage = function(e) {
  var data = e.data
  // Изменяем данные внутри Worker
  if (data && typeof data === 'object' && !Array.isArray(data) && data.name !== undefined) {
    data.name = 'MODIFIED_IN_WORKER'
    data.score = 999
  } else if (Array.isArray(data)) {
    data[0] = 'MODIFIED'
  }
  self.postMessage({ received: JSON.stringify(data), modified: true })
}
`

export function Task12_2_Solution() {
  const [selectedType, setSelectedType] = useState<DataType>('object')
  const [log, setLog] = useState<Array<{ dir: 'send' | 'recv' | 'error' | 'info'; text: string }>>([])
  const [originalVal, setOriginalVal] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const addLog = (dir: 'send' | 'recv' | 'error' | 'info', text: string) => {
    setLog((prev) => [...prev, { dir, text }])
  }

  const handleSend = () => {
    const info = DATA_TYPES[selectedType]
    setLog([])
    setOriginalVal(null)

    if (!info.canClone) {
      addLog('error', `DataCloneError: ${info.label} не может быть клонирован через postMessage`)
      addLog('info', 'Функции и DOM-узлы нельзя передать через postMessage — алгоритм Structured Clone их не поддерживает')
      return
    }

    setIsRunning(true)
    const value = info.createValue()
    const displayBefore = info.displayValue(value)
    setOriginalVal(displayBefore)
    addLog('send', `Отправляем в Worker: ${displayBefore}`)

    const blob = new Blob([CLONE_WORKER_CODE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    const worker = new Worker(url)
    URL.revokeObjectURL(url)

    worker.onmessage = (e: MessageEvent<{ received: string; modified: boolean }>) => {
      addLog('recv', `Worker получил копию: ${e.data.received}`)
      if (e.data.modified) {
        addLog('info', `Worker изменил данные... но оригинал НЕ изменился!`)
        addLog('info', `Оригинал: ${displayBefore} (неизменён — это deep clone!)`)
      }
      worker.terminate()
      setIsRunning(false)
    }
    worker.onerror = (err) => {
      addLog('error', `Worker error: ${err.message}`)
      worker.terminate()
      setIsRunning(false)
    }

    worker.postMessage(value)
  }

  const typeEntries = Object.entries(DATA_TYPES) as [DataType, TypeInfo][]

  const logColors: Record<string, string> = {
    send: '#60a5fa',
    recv: '#34d399',
    error: '#f87171',
    info: '#fbbf24',
  }

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 12.2 — postMessage и Structured Clone
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>
        {/* Cloneability table */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            STRUCTURED CLONE ALGORITHM — что можно передать?
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {typeEntries.map(([key, info]) => (
              <button
                key={key}
                onClick={() => { setSelectedType(key); setLog([]); setOriginalVal(null) }}
                style={{
                  padding: '0.4rem 0.8rem',
                  borderRadius: '6px',
                  border: `2px solid ${selectedType === key ? (info.canClone ? '#10b981' : '#ef4444') : '#334155'}`,
                  cursor: 'pointer',
                  background: selectedType === key ? (info.canClone ? '#052e16' : '#450a0a') : '#0f172a',
                  color: selectedType === key ? (info.canClone ? '#34d399' : '#f87171') : '#94a3b8',
                  fontFamily: 'inherit',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', fontWeight: 'bold', opacity: 0.8 }}>{info.icon}</span>
                {info.label}
                <span style={{ color: info.canClone ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>
                  {info.canClone ? '✓' : '✗'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected type info */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderLeft: `3px solid ${DATA_TYPES[selectedType].canClone ? '#10b981' : '#ef4444'}`,
          fontSize: '0.82rem',
          color: '#94a3b8',
        }}>
          {DATA_TYPES[selectedType].canClone ? (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>✓ Клонируется:</span>{' '}
              {DATA_TYPES[selectedType].label} передаётся через postMessage как глубокая копия.
              Изменение в Worker НЕ затронет оригинал в главном потоке.
            </>
          ) : (
            <>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>✗ DataCloneError:</span>{' '}
              {DATA_TYPES[selectedType].label} не поддерживается алгоритмом Structured Clone.
              postMessage выбросит ошибку при попытке передать это значение.
            </>
          )}
        </div>

        {/* Log */}
        <div style={{
          background: '#020617',
          borderRadius: '8px',
          padding: '0.75rem',
          minHeight: '120px',
          marginBottom: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          lineHeight: 1.7,
        }}>
          {log.length === 0 ? (
            <span style={{ color: '#334155' }}>// Лог будет здесь...</span>
          ) : (
            log.map((entry, i) => (
              <div key={i}>
                <span style={{ color: '#475569', userSelect: 'none' }}>[{entry.dir}]</span>{' '}
                <span style={{ color: logColors[entry.dir] }}>{entry.text}</span>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleSend}
            disabled={isRunning}
            style={btnStyle('primary', isRunning)}
          >
            {isRunning ? 'Отправляем...' : `Отправить ${DATA_TYPES[selectedType].label} в Worker`}
          </button>
          <button onClick={() => { setLog([]); setOriginalVal(null) }} style={btnStyle('ghost')}>
            Очистить лог
          </button>
        </div>

        {originalVal && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
            Оригинал в главном потоке: <span style={{ color: '#60a5fa' }}>{originalVal}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Task 12.3 — Transferable Objects
// ============================================================

const TRANSFER_WORKER_CODE = `
self.onmessage = function(e) {
  var buffer = e.data.buffer
  var byteLength = buffer ? buffer.byteLength : 0
  // Имитируем обработку
  var start = Date.now()
  if (buffer) {
    var view = new Uint8Array(buffer)
    // Небольшая фиктивная обработка
    for (var i = 0; i < Math.min(1000, view.length); i++) {
      view[i] = i % 256
    }
  }
  var elapsed = Date.now() - start
  self.postMessage({ byteLength: byteLength, elapsed: elapsed })
}
`

export function Task12_3_Solution() {
  const [mode, setMode] = useState<'clone' | 'transfer'>('clone')
  const [sizeMB, setSizeMB] = useState(10)
  const [isRunning, setIsRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const [originalByteLength, setOriginalByteLength] = useState<number | null>(null)
  const [afterByteLength, setAfterByteLength] = useState<number | null>(null)
  const [elapsed, setElapsed] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)

  const addLog = (text: string) => setLog((prev) => [...prev, text])

  const handleRun = () => {
    setIsRunning(true)
    setLog([])
    setOriginalByteLength(null)
    setAfterByteLength(null)
    setElapsed(null)
    setProgress(0)

    const bytes = sizeMB * 1024 * 1024
    addLog(`Создаём ArrayBuffer размером ${sizeMB} MB (${bytes.toLocaleString()} байт)...`)

    // Небольшая задержка для рендера
    setTimeout(() => {
      try {
        const buffer = new ArrayBuffer(bytes)
        const original = buffer.byteLength
        setOriginalByteLength(original)
        addLog(`ArrayBuffer создан. byteLength = ${original.toLocaleString()}`)

        const blob = new Blob([TRANSFER_WORKER_CODE], { type: 'application/javascript' })
        const url = URL.createObjectURL(blob)
        const worker = new Worker(url)
        URL.revokeObjectURL(url)

        // Имитируем прогресс
        let p = 0
        const progressInterval = setInterval(() => {
          p = Math.min(p + 15, 90)
          setProgress(p)
        }, 50)

        const t0 = performance.now()

        if (mode === 'clone') {
          addLog(`postMessage(buffer) — клонируем ${sizeMB} MB...`)
          worker.postMessage({ buffer })
          // После postMessage без transfer — buffer остаётся доступным
          const afterClone = buffer.byteLength
          setAfterByteLength(afterClone)
          addLog(`После postMessage: buffer.byteLength = ${afterClone.toLocaleString()} (копия создана, оригинал цел)`)
        } else {
          addLog(`postMessage(buffer, [buffer]) — передаём (Transfer) ${sizeMB} MB...`)
          worker.postMessage({ buffer }, [buffer])
          // После transfer — buffer нейтрализован
          const afterTransfer = buffer.byteLength
          setAfterByteLength(afterTransfer)
          addLog(`После transfer: buffer.byteLength = ${afterTransfer} (0!) — буфер передан Worker'у`)
        }

        worker.onmessage = (e: MessageEvent<{ byteLength: number; elapsed: number }>) => {
          clearInterval(progressInterval)
          setProgress(100)
          const ms = Math.round(performance.now() - t0)
          setElapsed(ms)
          addLog(`Worker получил буфер: ${e.data.byteLength.toLocaleString()} байт`)
          addLog(`Итого: ${ms} мс ${mode === 'clone' ? '(включая копирование)' : '(transfer — без копирования!)'}`)
          worker.terminate()
          setIsRunning(false)
        }
        worker.onerror = (err) => {
          clearInterval(progressInterval)
          addLog(`Ошибка: ${err.message}`)
          worker.terminate()
          setIsRunning(false)
        }
      } catch (err) {
        addLog(`Ошибка выделения памяти: ${(err as Error).message}`)
        setIsRunning(false)
      }
    }, 50)
  }

  const handleReset = () => {
    setIsRunning(false)
    setLog([])
    setOriginalByteLength(null)
    setAfterByteLength(null)
    setElapsed(null)
    setProgress(0)
  }

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 12.3 — Transferable Objects
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button style={tabStyle(mode === 'clone')} onClick={() => { setMode('clone'); handleReset() }}>
          Копировать (Clone)
        </button>
        <button style={tabStyle(mode === 'transfer')} onClick={() => { setMode('transfer'); handleReset() }}>
          Передать (Transfer)
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Info */}
        <div style={{
          background: '#0f172a',
          borderLeft: `3px solid ${mode === 'clone' ? '#f59e0b' : '#10b981'}`,
          borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem',
          fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6,
        }}>
          {mode === 'clone' ? (
            <>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Clone режим:</span>{' '}
              postMessage(buffer) создаёт полную копию. Для {sizeMB} MB это займёт ощутимое время.
              Оригинал остаётся доступным после отправки.
            </>
          ) : (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Transfer режим:</span>{' '}
              postMessage(buffer, [buffer]) передаёт владение мгновенно. Buffer у отправителя становится
              пустым (byteLength = 0). Нет копирования — нет задержки!
            </>
          )}
        </div>

        {/* Size slider */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
            Размер: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{sizeMB} MB</span>
          </label>
          <input
            type="range" min={1} max={50} value={sizeMB}
            onChange={(e) => setSizeMB(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569' }}>
            <span>1 MB</span><span>25 MB</span><span>50 MB</span>
          </div>
        </div>

        {/* Memory visualization */}
        {(originalByteLength !== null || afterByteLength !== null) && (
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '140px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.3rem' }}>ГЛАВНЫЙ ПОТОК</div>
              <div style={{
                height: '28px', borderRadius: '4px',
                background: afterByteLength === 0
                  ? '#1e293b'
                  : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                transition: 'background 0.5s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.72rem', color: afterByteLength === 0 ? '#475569' : '#fff' }}>
                  {afterByteLength === 0 ? 'пусто (передан)' : `${sizeMB} MB`}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.2rem' }}>
                byteLength: {afterByteLength?.toLocaleString() ?? '—'}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#475569', fontSize: '1.2rem' }}>
              {mode === 'clone' ? '⇄' : '→'}
            </div>
            <div style={{ flex: 1, minWidth: '140px', background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.3rem' }}>WORKER</div>
              <div style={{
                height: '28px', borderRadius: '4px',
                background: isRunning || elapsed !== null
                  ? 'linear-gradient(90deg, #10b981, #06b6d4)'
                  : '#1e293b',
                transition: 'background 0.5s',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: '0.72rem', color: elapsed !== null ? '#fff' : '#475569' }}>
                  {elapsed !== null ? `${sizeMB} MB` : (isRunning ? 'получает...' : 'ожидает')}
                </span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.2rem' }}>
                {mode === 'clone' ? '(копия)' : '(владелец)'}
              </div>
            </div>
          </div>
        )}

        {/* Progress */}
        {isRunning && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ background: '#0f172a', borderRadius: '4px', height: '8px', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: '4px',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #3b82f6, #10b981)',
                transition: 'width 0.1s',
              }} />
            </div>
          </div>
        )}

        {/* Log */}
        <div style={{
          background: '#020617', borderRadius: '8px', padding: '0.75rem',
          minHeight: '100px', marginBottom: '1rem',
          fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: 1.7,
        }}>
          {log.length === 0 ? (
            <span style={{ color: '#334155' }}>// Нажмите кнопку чтобы начать...</span>
          ) : (
            log.map((line, i) => (
              <div key={i} style={{ color: '#94a3b8' }}>
                <span style={{ color: '#475569' }}>&gt;</span> {line}
              </div>
            ))
          )}
        </div>

        {/* Metrics */}
        {elapsed !== null && (
          <div style={{
            display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap',
          }}>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem', flex: 1, minWidth: '100px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ВРЕМЯ</div>
              <div style={{ fontSize: '1.4rem', color: mode === 'clone' ? '#f59e0b' : '#10b981', fontWeight: 'bold' }}>
                {elapsed} мс
              </div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                {mode === 'clone' ? 'с копированием' : 'без копирования'}
              </div>
            </div>
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem 1rem', flex: 1, minWidth: '100px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ОРИГИНАЛ ПОСЛЕ</div>
              <div style={{ fontSize: '1.4rem', color: afterByteLength === 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                {afterByteLength === 0 ? '0 байт' : `${sizeMB} MB`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>
                {afterByteLength === 0 ? 'передан (detached)' : 'доступен (скопирован)'}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleRun}
            disabled={isRunning}
            style={btnStyle('primary', isRunning)}
          >
            {isRunning ? 'Передаём...' : `${mode === 'clone' ? 'Скопировать' : 'Передать'} ${sizeMB} MB`}
          </button>
          <button onClick={handleReset} style={btnStyle('ghost')}>
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 12.4 — Worker Pool
// ============================================================

interface WorkerTask {
  id: number
  complexity: number // 1-5 — условная сложность
  status: 'pending' | 'running' | 'done'
  workerId?: number
  elapsed?: number
}

interface WorkerSlot {
  id: number
  busy: boolean
  currentTask?: number
}

const POOL_WORKER_CODE = `
self.onmessage = function(e) {
  var taskId = e.data.taskId
  var complexity = e.data.complexity
  // Имитируем CPU-bound работу пропорционально сложности
  var iterations = complexity * 2000000
  var dummy = 0
  for (var i = 0; i < iterations; i++) { dummy += i }
  self.postMessage({ taskId: taskId, dummy: dummy })
}
`

// Создаём 20 задач с разной сложностью
function createTasks(): WorkerTask[] {
  const complexities = [2, 4, 1, 5, 3, 2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2]
  return complexities.map((complexity, i) => ({
    id: i + 1,
    complexity,
    status: 'pending',
  }))
}

export function Task12_4_Solution() {
  const [poolSize, setPoolSize] = useState(4)
  const [tasks, setTasks] = useState<WorkerTask[]>(createTasks())
  const [slots, setSlots] = useState<WorkerSlot[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [totalElapsed, setTotalElapsed] = useState<number | null>(null)
  const [completedCount, setCompletedCount] = useState(0)

  const workersRef = useRef<Worker[]>([])
  const taskQueueRef = useRef<WorkerTask[]>([])
  const startTimeRef = useRef<number>(0)
  const idleWorkersRef = useRef<number[]>([])
  const completedRef = useRef<number>(0)
  const totalTasksRef = useRef<number>(0)

  // Обновить статус задачи
  const updateTask = useCallback((taskId: number, update: Partial<WorkerTask>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...update } : t))
    )
  }, [])

  // Обновить слот воркера
  const updateSlot = useCallback((workerId: number, update: Partial<WorkerSlot>) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === workerId ? { ...s, ...update } : s))
    )
  }, [])

  const dispatchNext = useCallback((workerId: number) => {
    const queue = taskQueueRef.current
    if (queue.length === 0) {
      // Нет задач — воркер простаивает
      idleWorkersRef.current.push(workerId)
      updateSlot(workerId, { busy: false, currentTask: undefined })

      // Все задачи выполнены?
      if (completedRef.current >= totalTasksRef.current) {
        setTotalElapsed(Math.round(performance.now() - startTimeRef.current))
        setIsRunning(false)
      }
      return
    }

    const task = queue.shift()!
    taskQueueRef.current = queue
    const worker = workersRef.current[workerId]

    updateTask(task.id, { status: 'running', workerId })
    updateSlot(workerId, { busy: true, currentTask: task.id })

    const taskStart = performance.now()
    worker.onmessage = (e: MessageEvent<{ taskId: number }>) => {
      const elapsed = Math.round(performance.now() - taskStart)
      completedRef.current++
      setCompletedCount(completedRef.current)
      updateTask(e.data.taskId, { status: 'done', elapsed })
      dispatchNext(workerId)
    }
    worker.postMessage({ taskId: task.id, complexity: task.complexity })
  }, [updateTask, updateSlot])

  const handleStart = () => {
    // Создаём свежие задачи
    const freshTasks = createTasks()
    setTasks(freshTasks)
    setTotalElapsed(null)
    setCompletedCount(0)
    completedRef.current = 0
    totalTasksRef.current = freshTasks.length

    // Очередь задач
    taskQueueRef.current = [...freshTasks]

    // Создаём слоты
    const newSlots: WorkerSlot[] = Array.from({ length: poolSize }, (_, i) => ({
      id: i,
      busy: false,
    }))
    setSlots(newSlots)

    // Создаём воркеры
    workersRef.current.forEach((w) => w.terminate())
    const blob = new Blob([POOL_WORKER_CODE], { type: 'application/javascript' })
    const url = URL.createObjectURL(blob)
    workersRef.current = Array.from({ length: poolSize }, () => new Worker(url))
    URL.revokeObjectURL(url)

    idleWorkersRef.current = Array.from({ length: poolSize }, (_, i) => i)
    startTimeRef.current = performance.now()
    setIsRunning(true)

    // Запускаем задачи на всех воркерах
    const idle = [...idleWorkersRef.current]
    idleWorkersRef.current = []
    idle.forEach((wId) => dispatchNext(wId))
  }

  const handleReset = () => {
    workersRef.current.forEach((w) => w.terminate())
    workersRef.current = []
    setTasks(createTasks())
    setSlots([])
    setIsRunning(false)
    setTotalElapsed(null)
    setCompletedCount(0)
    completedRef.current = 0
    taskQueueRef.current = []
  }

  useEffect(() => () => {
    workersRef.current.forEach((w) => w.terminate())
  }, [])

  const complexityColors = ['', '#10b981', '#84cc16', '#f59e0b', '#ef4444', '#7c3aed']
  const pendingCount = tasks.filter((t) => t.status === 'pending').length
  const runningCount = tasks.filter((t) => t.status === 'running').length
  const doneCount = tasks.filter((t) => t.status === 'done').length

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 12.4 — Worker Pool
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>
        {/* Pool size */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '0.4rem' }}>
            Размер пула: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{poolSize} Worker(ов)</span>
            <span style={{ color: '#475569', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
              (ядер CPU: ~{navigator.hardwareConcurrency ?? 4})
            </span>
          </label>
          <input
            type="range" min={1} max={8} value={poolSize}
            onChange={(e) => setPoolSize(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
            disabled={isRunning}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#475569' }}>
            <span>1 (последовательно)</span>
            <span style={{ color: '#f59e0b' }}>4 (оптимально)</span>
            <span style={{ color: '#ef4444' }}>8 (много)</span>
          </div>
        </div>

        {/* Worker slots */}
        {slots.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              ВОРКЕРЫ ({slots.filter((s) => s.busy).length} активных / {poolSize})
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {slots.map((slot) => {
                const task = slot.currentTask
                  ? tasks.find((t) => t.id === slot.currentTask)
                  : undefined
                return (
                  <div
                    key={slot.id}
                    style={{
                      background: '#0f172a',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      border: `1px solid ${slot.busy ? '#3b82f6' : '#1e293b'}`,
                      minWidth: '100px',
                      transition: 'border-color 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Worker {slot.id + 1}</div>
                    {slot.busy && task ? (
                      <div>
                        <div style={{ color: '#60a5fa', fontSize: '0.8rem', fontWeight: 'bold' }}>
                          Задача #{task.id}
                        </div>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
                          {Array.from({ length: task.complexity }).map((_, ci) => (
                            <div key={ci} style={{
                              width: '8px', height: '8px', borderRadius: '2px',
                              background: complexityColors[task.complexity],
                            }} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: '#334155' }}>простаивает</div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tasks grid */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            ЗАДАЧИ (20 шт.) — цвет = сложность (1=зелёный ... 5=фиолетовый)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  width: '52px',
                  borderRadius: '6px',
                  padding: '0.3rem 0.4rem',
                  background:
                    task.status === 'done'
                      ? '#052e16'
                      : task.status === 'running'
                        ? '#1e3a5f'
                        : '#0f172a',
                  border: `1px solid ${task.status === 'done' ? '#10b981' : task.status === 'running' ? '#3b82f6' : '#1e293b'}`,
                  transition: 'all 0.2s',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>#{task.id}</div>
                <div style={{ display: 'flex', gap: '2px', justifyContent: 'center', margin: '2px 0' }}>
                  {Array.from({ length: task.complexity }).map((_, ci) => (
                    <div key={ci} style={{
                      width: '6px', height: '6px', borderRadius: '1px',
                      background: task.status === 'done'
                        ? '#10b981'
                        : complexityColors[task.complexity],
                      opacity: task.status === 'pending' ? 0.4 : 1,
                    }} />
                  ))}
                </div>
                {task.status === 'done' && task.elapsed !== undefined ? (
                  <div style={{ fontSize: '0.6rem', color: '#34d399' }}>{task.elapsed}мс</div>
                ) : task.status === 'running' ? (
                  <div style={{ fontSize: '0.6rem', color: '#60a5fa' }}>...</div>
                ) : (
                  <div style={{ fontSize: '0.6rem', color: '#334155' }}>ожид.</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'В очереди', value: pendingCount, color: '#94a3b8' },
            { label: 'Выполняется', value: runningCount, color: '#60a5fa' },
            { label: 'Готово', value: doneCount, color: '#34d399' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#0f172a', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1, minWidth: '80px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', color: stat.color, fontWeight: 'bold' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: '#475569' }}>{stat.label}</div>
            </div>
          ))}
          {totalElapsed !== null && (
            <div style={{ background: '#052e16', border: '1px solid #10b981', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1, minWidth: '80px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', color: '#34d399', fontWeight: 'bold' }}>{(totalElapsed / 1000).toFixed(1)}с</div>
              <div style={{ fontSize: '0.72rem', color: '#34d399' }}>Общее время</div>
            </div>
          )}
        </div>

        {/* Insight */}
        {totalElapsed !== null && (
          <div style={{
            background: '#0f172a', borderLeft: '3px solid #8b5cf6',
            borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem',
            fontSize: '0.82rem', color: '#94a3b8',
          }}>
            Пул из {poolSize} воркер{poolSize === 1 ? 'а' : poolSize < 5 ? 'ов' : 'ов'} завершил 20 задач за{' '}
            <span style={{ color: '#a78bfa' }}>{(totalElapsed / 1000).toFixed(1)} сек</span>.
            {poolSize < (navigator.hardwareConcurrency ?? 4) ? (
              <span style={{ color: '#fbbf24' }}> Попробуйте увеличить пул — есть свободные ядра.</span>
            ) : poolSize > (navigator.hardwareConcurrency ?? 4) ? (
              <span style={{ color: '#f87171' }}> Воркеров больше чем ядер — diminishing returns (конкурируют за CPU).</span>
            ) : (
              <span style={{ color: '#34d399' }}> Пул оптимального размера по числу ядер CPU!</span>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleStart}
            disabled={isRunning}
            style={btnStyle('primary', isRunning)}
          >
            {isRunning ? `Выполняется (${completedCount}/20)...` : 'Запустить пул'}
          </button>
          <button onClick={handleReset} style={btnStyle('ghost')} disabled={isRunning}>
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}
