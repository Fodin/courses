import { useState, useRef, useCallback, useEffect } from 'react'

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
  opacity: disabled ? 0.6 : 1,
})

// ============================================================
// Task 13.1 — Race Condition визуализатор
// ============================================================

// Worker без Atomics: читает значение, ждёт немного, пишет read+1
// Это демонстрирует классический race condition
const WORKER_RACE_NO_ATOMICS = `
self.onmessage = function(e) {
  var sab = e.data.sab
  var id = e.data.id
  var iterations = e.data.iterations
  var arr = new Int32Array(sab)
  var ops = []

  for (var i = 0; i < iterations; i++) {
    // Read
    var val = arr[0]
    ops.push({ type: 'read', id: id, val: val, iter: i })

    // Симулируем небольшую задержку (busy wait, не setTimeout, так как Worker)
    var start = Date.now()
    while (Date.now() - start < 1) {}

    // Write val+1 (другой Worker мог уже написать своё значение!)
    arr[0] = val + 1
    ops.push({ type: 'write', id: id, val: val + 1, iter: i })
  }

  self.postMessage({ type: 'done', id: id, ops: ops })
}
`

// Worker с Atomics: атомарно инкрементирует
const WORKER_RACE_WITH_ATOMICS = `
self.onmessage = function(e) {
  var sab = e.data.sab
  var id = e.data.id
  var iterations = e.data.iterations
  var arr = new Int32Array(sab)
  var ops = []

  for (var i = 0; i < iterations; i++) {
    var oldVal = Atomics.add(arr, 0, 1)
    ops.push({ type: 'atomic_add', id: id, oldVal: oldVal, newVal: oldVal + 1, iter: i })
  }

  self.postMessage({ type: 'done', id: id, ops: ops })
}
`

interface RaceOp {
  type: string
  id: number
  val?: number
  oldVal?: number
  newVal?: number
  iter: number
}

interface RunResult {
  finalValue: number
  ops: RaceOp[]
  workerDone: number
}

function createWorkerFromCode(code: string): Worker {
  const blob = new Blob([code], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const w = new Worker(url)
  URL.revokeObjectURL(url)
  return w
}

export function Task13_1_Solution() {
  const [useAtomics, setUseAtomics] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [runs, setRuns] = useState<RunResult[]>([])
  const [logs, setLogs] = useState<string[]>([])
  const workersRef = useRef<Worker[]>([])

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-49), msg])
  }, [])

  const cleanup = useCallback(() => {
    workersRef.current.forEach(w => w.terminate())
    workersRef.current = []
  }, [])

  useEffect(() => () => cleanup(), [cleanup])

  const runOnce = useCallback((
    atomics: boolean,
    onDone: (result: RunResult) => void
  ) => {
    const sab = new SharedArrayBuffer(4)
    const arr = new Int32Array(sab)
    arr[0] = 0

    const ITERATIONS = 50
    const results: { id: number; ops: RaceOp[] }[] = []
    let doneCount = 0

    const code = atomics ? WORKER_RACE_WITH_ATOMICS : WORKER_RACE_NO_ATOMICS
    const workers = [createWorkerFromCode(code), createWorkerFromCode(code)]
    workersRef.current = workers

    workers.forEach((w, i) => {
      w.onmessage = (e) => {
        results.push({ id: i, ops: e.data.ops as RaceOp[] })
        doneCount++
        w.terminate()

        if (doneCount === 2) {
          const finalValue = arr[0]
          const allOps = [...results[0].ops, ...results[1].ops]
            .sort((a, b) => a.iter - b.iter || a.id - b.id)
          onDone({ finalValue, ops: allOps, workerDone: doneCount })
        }
      }
      w.onerror = (e) => addLog(`Worker ${i} error: ${e.message}`)
      w.postMessage({ sab, id: i, iterations: ITERATIONS })
    })
  }, [addLog])

  const runExperiment = useCallback(async () => {
    setIsRunning(true)
    setRuns([])
    setLogs([])
    cleanup()

    const totalRuns = 5
    const newRuns: RunResult[] = []

    for (let r = 0; r < totalRuns; r++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          runOnce(useAtomics, (result) => {
            newRuns.push(result)
            const expected = 100 // 2 workers * 50 iterations
            const ok = result.finalValue === expected
            addLog(
              `Запуск ${r + 1}: результат = ${result.finalValue} ` +
              `(ожидалось ${expected}) ${ok ? '✓' : '✗ RACE CONDITION!'}`
            )
            setRuns([...newRuns])
            resolve()
          })
        }, r * 200)
      })
    }

    setIsRunning(false)
  }, [useAtomics, runOnce, addLog, cleanup])

  const expected = 100
  const allCorrect = runs.length > 0 && runs.every(r => r.finalValue === expected)
  const hasConflict = runs.some(r => r.finalValue !== expected)

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 13.1 — Race Condition визуализатор
      </h2>

      {/* Mode switch */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button
          style={tabStyle(!useAtomics)}
          onClick={() => { setUseAtomics(false); setRuns([]); setLogs([]) }}
        >
          Без Atomics (race condition)
        </button>
        <button
          style={tabStyle(useAtomics)}
          onClick={() => { setUseAtomics(true); setRuns([]); setLogs([]) }}
        >
          С Atomics (безопасно)
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {/* Explanation */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderLeft: `3px solid ${useAtomics ? '#10b981' : '#ef4444'}`,
          fontSize: '0.83rem',
          color: '#94a3b8',
          lineHeight: 1.6,
        }}>
          {useAtomics ? (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Atomics.add:</span>{' '}
              Операция чтение+инкремент+запись выполняется атомарно — как единое неделимое действие.
              Второй Worker не может вклиниться между чтением и записью. Результат всегда = 100.
            </>
          ) : (
            <>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Race Condition:</span>{' '}
              Два Worker'а читают одно значение, оба прибавляют 1 и пишут — но только одно из двух
              прибавлений "выигрывает". Итого меньше 100. Каждый запуск даёт разный результат.
            </>
          )}
        </div>

        {/* Code snippet */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {useAtomics
              ? `// Worker A и B — атомарный инкремент\nAtomics.add(arr, 0, 1)  // read + add + write — неделимо`
              : `// Worker A:\nvar val = arr[0]   // read: 5\n// ... Worker B тоже читает 5 ...\narr[0] = val + 1   // write: 6  ← потеряли инкремент от B!`}
          </pre>
        </div>

        {/* Results table */}
        {runs.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              РЕЗУЛЬТАТЫ (2 воркера × 50 итераций = ожидаем 100)
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {runs.map((r, i) => {
                const ok = r.finalValue === expected
                return (
                  <div
                    key={i}
                    style={{
                      background: ok ? '#052e16' : '#450a0a',
                      border: `1px solid ${ok ? '#10b981' : '#ef4444'}`,
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      minWidth: '100px',
                      textAlign: 'center',
                    }}
                  >
                    <div style={{ color: '#64748b', fontSize: '0.72rem' }}>Запуск {i + 1}</div>
                    <div style={{
                      color: ok ? '#6ee7b7' : '#fca5a5',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                    }}>
                      {r.finalValue}
                    </div>
                    <div style={{ color: ok ? '#10b981' : '#ef4444', fontSize: '0.72rem' }}>
                      {ok ? '✓ OK' : '✗ КОНФЛИКТ'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Summary */}
        {runs.length === 5 && (
          <div style={{
            background: allCorrect ? '#052e16' : '#1c1917',
            border: `1px solid ${allCorrect ? '#10b981' : '#f59e0b'}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            {allCorrect ? (
              <span style={{ color: '#6ee7b7' }}>
                Atomics гарантирует корректность: все 5 запусков дали результат 100.
              </span>
            ) : hasConflict ? (
              <span style={{ color: '#fbbf24' }}>
                Race condition в действии: результаты отличаются от 100 — потоки "перезаписали" работу друг друга.
              </span>
            ) : null}
          </div>
        )}

        {/* Log */}
        {logs.length > 0 && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            maxHeight: '140px',
            overflowY: 'auto',
            fontSize: '0.78rem',
          }}>
            <div style={{ color: '#475569', marginBottom: '0.4rem' }}>ЛОГ</div>
            {logs.map((l, i) => (
              <div key={i} style={{
                color: l.includes('RACE') ? '#fca5a5' : '#6ee7b7',
                lineHeight: 1.5,
              }}>
                {l}
              </div>
            ))}
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            style={btnStyle(useAtomics ? 'success' : 'danger', isRunning)}
            onClick={runExperiment}
            disabled={isRunning}
          >
            {isRunning ? 'Выполняется...' : 'Запустить 5 экспериментов'}
          </button>
          <button
            style={btnStyle('ghost')}
            onClick={() => { setRuns([]); setLogs([]) }}
          >
            Очистить
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 13.2 — Atomics API стенд
// ============================================================

// Worker который периодически обновляет ячейки в фоне
const WORKER_BACKGROUND_UPDATER = `
self.onmessage = function(e) {
  var sab = e.data.sab
  var arr = new Int32Array(sab)
  var running = true

  self.onmessage = function(e2) {
    if (e2.data === 'stop') running = false
  }

  function tick() {
    if (!running) return
    // Фоновый воркер атомарно добавляет 1 к ячейке 7 каждые ~200мс
    Atomics.add(arr, 7, 1)
    self.postMessage({ type: 'tick', val: Atomics.load(arr, 7) })
    setTimeout(tick, 200)
  }

  tick()
}
`

type AtomicOp = 'store' | 'load' | 'add' | 'sub' | 'and' | 'or' | 'xor' | 'compareExchange'

interface OpResult {
  op: AtomicOp
  index: number
  value: number
  oldValue: number
  newValue: number
  success?: boolean
}

export function Task13_2_Solution() {
  const [cells, setCells] = useState<number[]>(Array(8).fill(0))
  const [selectedOp, setSelectedOp] = useState<AtomicOp>('store')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [opValue, setOpValue] = useState(1)
  const [expectedValue, setExpectedValue] = useState(0)
  const [lastResult, setLastResult] = useState<OpResult | null>(null)
  const [changedCells, setChangedCells] = useState<Set<number>>(new Set())
  const [bgLog, setBgLog] = useState<string[]>([])

  const sabRef = useRef<SharedArrayBuffer | null>(null)
  const arrRef = useRef<Int32Array | null>(null)
  const bgWorkerRef = useRef<Worker | null>(null)

  // Initialize SAB
  useEffect(() => {
    const sab = new SharedArrayBuffer(8 * 4) // 8 Int32 cells
    sabRef.current = sab
    arrRef.current = new Int32Array(sab)

    // Start background worker
    const w = createWorkerFromCode(WORKER_BACKGROUND_UPDATER)
    bgWorkerRef.current = w
    w.onmessage = (e) => {
      if (e.data.type === 'tick') {
        const arr = arrRef.current!
        const snapshot = Array.from({ length: 8 }, (_, i) => arr[i])
        setCells(snapshot)
        setChangedCells(prev => {
          const next = new Set(prev)
          next.add(7)
          return next
        })
        setTimeout(() => setChangedCells(prev => {
          const next = new Set(prev)
          next.delete(7)
          return next
        }), 300)
        setBgLog(prev => [...prev.slice(-9), `Worker: ячейка[7] = ${e.data.val}`])
      }
    }
    w.postMessage({ sab })

    return () => {
      w.postMessage('stop')
      w.terminate()
    }
  }, [])

  const executeOp = useCallback(() => {
    const arr = arrRef.current
    if (!arr) return

    const idx = selectedIndex
    let oldValue = 0
    let newValue = 0
    let success: boolean | undefined

    switch (selectedOp) {
      case 'store':
        oldValue = arr[idx]
        Atomics.store(arr, idx, opValue)
        newValue = opValue
        break
      case 'load':
        oldValue = Atomics.load(arr, idx)
        newValue = oldValue
        break
      case 'add':
        oldValue = Atomics.add(arr, idx, opValue)
        newValue = oldValue + opValue
        break
      case 'sub':
        oldValue = Atomics.sub(arr, idx, opValue)
        newValue = oldValue - opValue
        break
      case 'and':
        oldValue = Atomics.and(arr, idx, opValue)
        newValue = oldValue & opValue
        break
      case 'or':
        oldValue = Atomics.or(arr, idx, opValue)
        newValue = oldValue | opValue
        break
      case 'xor':
        oldValue = Atomics.xor(arr, idx, opValue)
        newValue = oldValue ^ opValue
        break
      case 'compareExchange': {
        const exchanged = Atomics.compareExchange(arr, idx, expectedValue, opValue)
        oldValue = exchanged
        success = exchanged === expectedValue
        newValue = success ? opValue : exchanged
        break
      }
    }

    setLastResult({ op: selectedOp, index: idx, value: opValue, oldValue, newValue, success })

    // Update display
    const snapshot = Array.from({ length: 8 }, (_, i) => arr[i])
    setCells(snapshot)
    setChangedCells(prev => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
    setTimeout(() => setChangedCells(prev => {
      const next = new Set(prev)
      next.delete(idx)
      return next
    }), 500)
  }, [selectedOp, selectedIndex, opValue, expectedValue])

  const OPS: AtomicOp[] = ['store', 'load', 'add', 'sub', 'and', 'or', 'xor', 'compareExchange']

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 13.2 — Atomics API стенд
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>

        {/* Memory cells visualization */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            SHARED MEMORY: Int32Array[8] (ячейка 7 изменяется фоновым Worker'ом)
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {cells.map((val, i) => {
              const isChanged = changedCells.has(i)
              const isSelected = selectedIndex === i
              return (
                <div
                  key={i}
                  onClick={() => setSelectedIndex(i)}
                  style={{
                    width: '70px',
                    background: isChanged
                      ? '#1e3a5f'
                      : isSelected
                        ? '#1e3a2f'
                        : '#0f172a',
                    border: `2px solid ${isChanged ? '#60a5fa' : isSelected ? '#10b981' : '#334155'}`,
                    borderRadius: '8px',
                    padding: '0.5rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                  }}
                >
                  <div style={{ color: '#475569', fontSize: '0.68rem' }}>
                    [{i}]{i === 7 ? ' BG' : ''}
                  </div>
                  <div style={{
                    color: isChanged ? '#60a5fa' : '#e2e8f0',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    transition: 'color 0.3s',
                  }}>
                    {val}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Operation controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.4rem' }}>ОПЕРАЦИЯ</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
              {OPS.map(op => (
                <button
                  key={op}
                  onClick={() => setSelectedOp(op)}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.78rem',
                    background: selectedOp === op ? '#3b82f6' : '#1e293b',
                    color: selectedOp === op ? '#fff' : '#94a3b8',
                  }}
                >
                  {op}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
              ЯЧЕЙКА [{selectedIndex}]  |  ЗНАЧЕНИЕ
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                value={opValue}
                onChange={e => setOpValue(Number(e.target.value))}
                style={{
                  width: '80px',
                  background: '#0f172a',
                  border: '1px solid #334155',
                  borderRadius: '4px',
                  color: '#e2e8f0',
                  padding: '0.3rem 0.5rem',
                  fontFamily: 'inherit',
                  fontSize: '0.85rem',
                }}
              />
              {selectedOp === 'compareExchange' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <span style={{ color: '#64748b', fontSize: '0.78rem' }}>expected:</span>
                  <input
                    type="number"
                    value={expectedValue}
                    onChange={e => setExpectedValue(Number(e.target.value))}
                    style={{
                      width: '70px',
                      background: '#0f172a',
                      border: '1px solid #334155',
                      borderRadius: '4px',
                      color: '#e2e8f0',
                      padding: '0.3rem 0.5rem',
                      fontFamily: 'inherit',
                      fontSize: '0.85rem',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Execute button */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', alignItems: 'center' }}>
          <button style={btnStyle()} onClick={executeOp}>
            Выполнить Atomics.{selectedOp}(arr, {selectedIndex}, {opValue}
            {selectedOp === 'compareExchange' ? `, ${expectedValue})` : ')'}
          </button>
        </div>

        {/* Last result */}
        {lastResult && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            <div style={{ color: '#475569', fontSize: '0.75rem', marginBottom: '0.4rem' }}>РЕЗУЛЬТАТ ОПЕРАЦИИ</div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <span>
                <span style={{ color: '#64748b' }}>операция: </span>
                <span style={{ color: '#60a5fa' }}>Atomics.{lastResult.op}</span>
              </span>
              <span>
                <span style={{ color: '#64748b' }}>ячейка: </span>
                <span style={{ color: '#e2e8f0' }}>[{lastResult.index}]</span>
              </span>
              <span>
                <span style={{ color: '#64748b' }}>было: </span>
                <span style={{ color: '#f59e0b' }}>{lastResult.oldValue}</span>
              </span>
              <span>
                <span style={{ color: '#64748b' }}>стало: </span>
                <span style={{ color: '#10b981' }}>{lastResult.newValue}</span>
              </span>
              {lastResult.success !== undefined && (
                <span>
                  <span style={{ color: '#64748b' }}>обмен: </span>
                  <span style={{ color: lastResult.success ? '#10b981' : '#ef4444' }}>
                    {lastResult.success ? 'успешно' : 'отказано (expected не совпало)'}
                  </span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Background worker log */}
        {bgLog.length > 0 && (
          <div style={{
            background: '#0f172a',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.78rem',
            maxHeight: '100px',
            overflowY: 'auto',
          }}>
            <div style={{ color: '#475569', marginBottom: '0.3rem' }}>ФОН: Worker обновляет ячейку[7]</div>
            {bgLog.map((l, i) => (
              <div key={i} style={{ color: '#6366f1', lineHeight: 1.5 }}>{l}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================================
// Task 13.3 — Atomics.waitAsync / notify (Producer-Consumer)
// ============================================================

// Producer Worker: пишет данные в буфер, уведомляет consumer через Atomics.notify
const WORKER_PRODUCER = `
self.onmessage = function(e) {
  var sab = e.data.sab
  var flagBuf = e.data.flagBuf
  var arr = new Int32Array(sab)       // 4 data slots
  var flag = new Int32Array(flagBuf)  // [0] = ready flag, [1] = iteration

  var ITERATIONS = e.data.iterations

  function produce(i) {
    if (i >= ITERATIONS) {
      self.postMessage({ type: 'done' })
      return
    }

    // Записываем данные в буфер
    arr[0] = i * 10
    arr[1] = i * 10 + 1
    arr[2] = i * 10 + 2
    arr[3] = i * 10 + 3

    Atomics.store(flag, 1, i)      // iteration number
    Atomics.store(flag, 0, 1)      // mark as ready
    Atomics.notify(flag, 0, 1)     // wake 1 waiter

    self.postMessage({
      type: 'produced',
      iteration: i,
      data: [arr[0], arr[1], arr[2], arr[3]]
    })

    // Следующий элемент через 300мс
    setTimeout(function() { produce(i + 1) }, 300)
  }

  // Небольшая задержка перед стартом
  setTimeout(function() { produce(0) }, 100)
}
`

// Consumer Worker: ждёт уведомления через waitAsync, читает данные
const WORKER_CONSUMER = `
self.onmessage = function(e) {
  var sab = e.data.sab
  var flagBuf = e.data.flagBuf
  var arr = new Int32Array(sab)
  var flag = new Int32Array(flagBuf)

  var ITERATIONS = e.data.iterations
  var consumed = 0

  function waitForData() {
    if (consumed >= ITERATIONS) {
      self.postMessage({ type: 'done' })
      return
    }

    // waitAsync — non-blocking wait (для main thread и воркеров)
    var result = Atomics.waitAsync(flag, 0, 0)  // wait while flag[0] === 0
    if (result.value === 'not-equal') {
      // Флаг уже установлен — читаем сразу
      consumeData()
    } else {
      result.value.then(function(outcome) {
        if (outcome === 'ok') consumeData()
        else waitForData() // timeout или другой случай
      })
    }
  }

  function consumeData() {
    var data = [arr[0], arr[1], arr[2], arr[3]]
    var iter = Atomics.load(flag, 1)

    // Обнуляем флаг — готовы к следующей записи
    Atomics.store(flag, 0, 0)

    self.postMessage({
      type: 'consumed',
      iteration: iter,
      data: data
    })

    consumed++
    waitForData()
  }

  waitForData()
}
`

interface ProdConsEvent {
  side: 'producer' | 'consumer'
  text: string
  iteration?: number
  data?: number[]
}

export function Task13_3_Solution() {
  const [isRunning, setIsRunning] = useState(false)
  const [events, setEvents] = useState<ProdConsEvent[]>([])
  const [buffer, setBuffer] = useState<number[]>([0, 0, 0, 0])
  const [producedCount, setProducedCount] = useState(0)
  const [consumedCount, setConsumedCount] = useState(0)
  const [bufferHighlight, setBufferHighlight] = useState<'none' | 'write' | 'read'>('none')

  const prodRef = useRef<Worker | null>(null)
  const consRef = useRef<Worker | null>(null)

  useEffect(() => () => {
    prodRef.current?.terminate()
    consRef.current?.terminate()
  }, [])

  const runDemo = useCallback(() => {
    if (isRunning) return

    prodRef.current?.terminate()
    consRef.current?.terminate()

    setIsRunning(true)
    setEvents([])
    setBuffer([0, 0, 0, 0])
    setProducedCount(0)
    setConsumedCount(0)
    setBufferHighlight('none')

    const ITERATIONS = 6
    const sab = new SharedArrayBuffer(4 * 4)        // 4 Int32 data slots
    const flagBuf = new SharedArrayBuffer(2 * 4)    // [ready_flag, iteration]

    let prodDone = false
    let consDone = false

    const addEvent = (side: 'producer' | 'consumer', text: string, extra?: Partial<ProdConsEvent>) => {
      setEvents(prev => [...prev, { side, text, ...extra }])
    }

    const producer = createWorkerFromCode(WORKER_PRODUCER)
    prodRef.current = producer
    producer.onmessage = (e) => {
      if (e.data.type === 'produced') {
        setBuffer(e.data.data)
        setBufferHighlight('write')
        setTimeout(() => setBufferHighlight('none'), 250)
        setProducedCount(c => c + 1)
        addEvent('producer',
          `[${e.data.iteration}] Записал: [${e.data.data.join(', ')}] → notify()`,
          { iteration: e.data.iteration, data: e.data.data }
        )
      } else if (e.data.type === 'done') {
        prodDone = true
        addEvent('producer', 'Producer завершён')
        if (prodDone && consDone) setIsRunning(false)
      }
    }

    const consumer = createWorkerFromCode(WORKER_CONSUMER)
    consRef.current = consumer
    consumer.onmessage = (e) => {
      if (e.data.type === 'consumed') {
        setBufferHighlight('read')
        setTimeout(() => setBufferHighlight('none'), 250)
        setConsumedCount(c => c + 1)
        addEvent('consumer',
          `[${e.data.iteration}] Прочитал: [${e.data.data.join(', ')}] → flag=0`,
          { iteration: e.data.iteration, data: e.data.data }
        )
      } else if (e.data.type === 'done') {
        consDone = true
        addEvent('consumer', 'Consumer завершён')
        if (prodDone && consDone) setIsRunning(false)
      }
    }

    producer.postMessage({ sab, flagBuf, iterations: ITERATIONS })
    consumer.postMessage({ sab, flagBuf, iterations: ITERATIONS })
  }, [isRunning])

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 13.3 — Atomics.waitAsync / notify
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>

        {/* Layout */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>

          {/* Producer column */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.75rem',
              border: '1px solid #1d4ed8',
            }}>
              <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                PRODUCER
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.5 }}>
                1. Пишет данные<br />
                2. Atomics.store(flag, 1)<br />
                3. Atomics.notify(flag)
              </div>
              <div style={{
                marginTop: '0.5rem',
                color: '#3b82f6',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}>
                {producedCount} / 6
              </div>
            </div>
          </div>

          {/* Buffer column */}
          <div style={{ flex: 1, minWidth: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', textAlign: 'center', marginBottom: '0.3rem' }}>
              БУФЕР (4 слота)
            </div>
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.75rem',
              border: `2px solid ${
                bufferHighlight === 'write' ? '#3b82f6'
                : bufferHighlight === 'read' ? '#10b981'
                : '#1e293b'
              }`,
              transition: 'border-color 0.3s',
              textAlign: 'center',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap',
              }}>
                {buffer.map((v, i) => (
                  <div key={i} style={{
                    background: bufferHighlight !== 'none' ? '#1e3a5f' : '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    padding: '0.3rem 0.5rem',
                    color: bufferHighlight === 'write' ? '#60a5fa' : bufferHighlight === 'read' ? '#6ee7b7' : '#94a3b8',
                    transition: 'all 0.3s',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                  }}>
                    {v}
                  </div>
                ))}
              </div>
              <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                {bufferHighlight === 'write' ? 'Producer пишет...'
                  : bufferHighlight === 'read' ? 'Consumer читает...'
                  : 'ожидание'}
              </div>
            </div>
          </div>

          {/* Consumer column */}
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.75rem',
              border: '1px solid #065f46',
            }}>
              <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                CONSUMER
              </div>
              <div style={{ color: '#64748b', fontSize: '0.75rem', lineHeight: 1.5 }}>
                1. Atomics.waitAsync(flag, 0)<br />
                2. Ждёт notify...<br />
                3. Читает данные
              </div>
              <div style={{
                marginTop: '0.5rem',
                color: '#10b981',
                fontWeight: 'bold',
                fontSize: '1.2rem',
              }}>
                {consumedCount} / 6
              </div>
            </div>
          </div>
        </div>

        {/* Event log */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          maxHeight: '200px',
          overflowY: 'auto',
          fontSize: '0.78rem',
        }}>
          <div style={{ color: '#475569', marginBottom: '0.4rem' }}>ЛОГ СОБЫТИЙ</div>
          {events.length === 0 && (
            <div style={{ color: '#334155' }}>Нажмите "Запустить" для начала демонстрации</div>
          )}
          {events.map((ev, i) => (
            <div key={i} style={{
              color: ev.side === 'producer' ? '#60a5fa' : '#6ee7b7',
              lineHeight: 1.6,
              paddingLeft: ev.side === 'consumer' ? '2rem' : '0',
            }}>
              {ev.side === 'producer' ? '→' : '←'} {ev.text}
            </div>
          ))}
        </div>

        {/* Code snippet */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>
{`// Consumer Worker (non-blocking wait):
var result = Atomics.waitAsync(flag, 0, 0)  // wait while flag[0] === 0
result.value.then(outcome => {
  if (outcome === 'ok') consumeData()
})

// Producer Worker:
Atomics.store(flag, 0, 1)   // set flag
Atomics.notify(flag, 0, 1)  // wake 1 waiter`}
          </pre>
        </div>

        <button
          style={btnStyle('primary', isRunning)}
          onClick={runDemo}
          disabled={isRunning}
        >
          {isRunning ? 'Выполняется...' : 'Запустить демонстрацию'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// Task 13.4 — Mutex на Atomics
// ============================================================

const WORKER_MUTEX = `
self.onmessage = function(e) {
  var lockBuf = e.data.lockBuf
  var counterBuf = e.data.counterBuf
  var id = e.data.id
  var iterations = e.data.iterations
  var useMutex = e.data.useMutex

  var lock = new Int32Array(lockBuf)
  var counter = new Int32Array(counterBuf)

  var UNLOCKED = 0
  var LOCKED = 1

  function acquireLock() {
    // Spinlock: пробуем взять лок через compareExchange
    while (Atomics.compareExchange(lock, 0, UNLOCKED, LOCKED) !== UNLOCKED) {
      // Busy wait — крутимся пока не получим лок
    }
  }

  function releaseLock() {
    Atomics.store(lock, 0, UNLOCKED)
    Atomics.notify(lock, 0, 1)
  }

  var timeline = []
  var start = Date.now()

  for (var i = 0; i < iterations; i++) {
    var t0 = Date.now() - start

    if (useMutex) acquireLock()

    var lockStart = Date.now() - start

    // Critical section: читаем + инкрементируем
    var val = counter[0]
    // Tiny busy-wait to increase race probability
    var s = Date.now()
    while (Date.now() - s < 2) {}
    counter[0] = val + 1

    var lockEnd = Date.now() - start

    if (useMutex) releaseLock()

    timeline.push({ iter: i, waitStart: t0, lockStart: lockStart, lockEnd: lockEnd })
  }

  self.postMessage({ type: 'done', id: id, timeline: timeline, finalVal: counter[0] })
}
`

interface TimelineSegment {
  workerId: number
  iter: number
  waitStart: number
  lockStart: number
  lockEnd: number
}

export function Task13_4_Solution() {
  const [useMutex, setUseMutex] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [timeline, setTimeline] = useState<TimelineSegment[]>([])
  const [finalValue, setFinalValue] = useState<number | null>(null)
  const [logs, setLogs] = useState<string[]>([])
  const workers = useRef<Worker[]>([])

  useEffect(() => () => workers.current.forEach(w => w.terminate()), [])

  const runDemo = useCallback(() => {
    workers.current.forEach(w => w.terminate())
    workers.current = []
    setIsRunning(true)
    setTimeline([])
    setFinalValue(null)
    setLogs([])

    const ITERATIONS = 8
    const lockBuf = new SharedArrayBuffer(4)
    const counterBuf = new SharedArrayBuffer(4)
    const lockArr = new Int32Array(lockBuf)
    lockArr[0] = 0  // UNLOCKED

    const results: { id: number; segs: TimelineSegment[] }[] = []
    let doneCount = 0

    const addLog = (msg: string) => setLogs(prev => [...prev, msg])

    for (let id = 0; id < 2; id++) {
      const w = createWorkerFromCode(WORKER_MUTEX)
      workers.current.push(w)

      w.onmessage = (e) => {
        if (e.data.type === 'done') {
          const segs: TimelineSegment[] = (e.data.timeline as { iter: number; waitStart: number; lockStart: number; lockEnd: number }[]).map(t => ({
            workerId: e.data.id,
            iter: t.iter,
            waitStart: t.waitStart,
            lockStart: t.lockStart,
            lockEnd: t.lockEnd,
          }))
          results.push({ id: e.data.id, segs })
          doneCount++
          addLog(`Worker ${e.data.id} завершён, counter = ${e.data.finalVal}`)

          if (doneCount === 2) {
            const all = results.flatMap(r => r.segs)
            setTimeline(all)
            const counter = new Int32Array(counterBuf)
            setFinalValue(counter[0])
            setIsRunning(false)
          }
        }
      }
      w.onerror = (e) => addLog(`Worker ${id} error: ${e.message}`)
      w.postMessage({ lockBuf, counterBuf, id, iterations: ITERATIONS, useMutex })
    }
  }, [useMutex])

  // Build timeline visualization
  const maxTime = timeline.length > 0 ? Math.max(...timeline.map(s => s.lockEnd)) : 100
  const expected = 16 // 2 workers * 8 iterations
  const isCorrect = finalValue === expected

  const colors = ['#3b82f6', '#f59e0b']

  // Detect overlaps (only meaningful without mutex)
  const overlaps: [TimelineSegment, TimelineSegment][] = []
  if (!useMutex) {
    const segs0 = timeline.filter(s => s.workerId === 0)
    const segs1 = timeline.filter(s => s.workerId === 1)
    for (const a of segs0) {
      for (const b of segs1) {
        if (a.lockStart < b.lockEnd && b.lockStart < a.lockEnd) {
          overlaps.push([a, b])
        }
      }
    }
  }

  return (
    <div className="exercise-container" style={BASE}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 13.4 — Mutex на Atomics
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: 0 }}>
        <button style={tabStyle(useMutex)} onClick={() => { setUseMutex(true); setTimeline([]); setFinalValue(null) }}>
          С Mutex (безопасно)
        </button>
        <button style={tabStyle(!useMutex)} onClick={() => { setUseMutex(false); setTimeline([]); setFinalValue(null) }}>
          Без Mutex (race condition)
        </button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>

        {/* Explanation */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          borderLeft: `3px solid ${useMutex ? '#10b981' : '#ef4444'}`,
          fontSize: '0.83rem',
          color: '#94a3b8',
          lineHeight: 1.6,
        }}>
          {useMutex ? (
            <>
              <span style={{ color: '#10b981', fontWeight: 'bold' }}>Mutex via Atomics.compareExchange:</span>{' '}
              Worker берёт замок (CAS: UNLOCKED → LOCKED). Критическая секция защищена — только один поток
              за раз. Результат всегда корректный.
            </>
          ) : (
            <>
              <span style={{ color: '#ef4444', fontWeight: 'bold' }}>Без защиты:</span>{' '}
              Оба Worker'а могут одновременно войти в критическую секцию. Потерянные обновления.
              Результат счётчика меньше {expected}.
            </>
          )}
        </div>

        {/* Code */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.6 }}>
{`// Spinlock — acquire
while (Atomics.compareExchange(lock, 0, UNLOCKED, LOCKED) !== UNLOCKED) {}

// Critical section
counter[0] = counter[0] + 1  // safe!

// Release
Atomics.store(lock, 0, UNLOCKED)
Atomics.notify(lock, 0, 1)`}
          </pre>
        </div>

        {/* Timeline */}
        {timeline.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              TIMELINE (горизонтальные полосы = критическая секция)
              {!useMutex && overlaps.length > 0 && (
                <span style={{ color: '#ef4444', marginLeft: '1rem' }}>
                  {overlaps.length} пересечений (race conditions)
                </span>
              )}
            </div>
            {[0, 1].map(wid => {
              const wSegs = timeline.filter(s => s.workerId === wid)
              return (
                <div key={wid} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ color: colors[wid], fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                    Worker {wid}
                  </div>
                  <div style={{ position: 'relative', height: '28px', background: '#0f172a', borderRadius: '4px' }}>
                    {wSegs.map((seg, i) => {
                      const leftPct = (seg.lockStart / maxTime) * 100
                      const widthPct = ((seg.lockEnd - seg.lockStart) / maxTime) * 100
                      const isOverlap = !useMutex && overlaps.some(
                        ([a, b]) => (a === seg || b === seg)
                      )
                      return (
                        <div
                          key={i}
                          title={`iter ${seg.iter}: ${seg.lockStart}ms – ${seg.lockEnd}ms`}
                          style={{
                            position: 'absolute',
                            left: `${leftPct}%`,
                            width: `${Math.max(widthPct, 1)}%`,
                            top: '3px',
                            height: '22px',
                            background: isOverlap ? '#ef4444' : colors[wid],
                            borderRadius: '3px',
                            opacity: 0.85,
                          }}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
            {/* Time axis */}
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '0.68rem', marginTop: '0.2rem' }}>
              <span>0ms</span>
              <span>{Math.round(maxTime / 2)}ms</span>
              <span>{maxTime}ms</span>
            </div>
          </div>
        )}

        {/* Result */}
        {finalValue !== null && (
          <div style={{
            background: isCorrect ? '#052e16' : '#450a0a',
            border: `1px solid ${isCorrect ? '#10b981' : '#ef4444'}`,
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}>
            <span style={{ color: isCorrect ? '#6ee7b7' : '#fca5a5' }}>
              Итоговый счётчик: {finalValue} (ожидалось {expected})
              {isCorrect ? ' — Mutex работает!' : ' — потеряно обновлений!'}
            </span>
          </div>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', fontSize: '0.78rem' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ color: '#94a3b8', lineHeight: 1.5 }}>{l}</div>
            ))}
          </div>
        )}

        <button
          style={btnStyle(useMutex ? 'success' : 'danger', isRunning)}
          onClick={runDemo}
          disabled={isRunning}
        >
          {isRunning ? 'Выполняется...' : 'Запустить эксперимент'}
        </button>
      </div>
    </div>
  )
}
