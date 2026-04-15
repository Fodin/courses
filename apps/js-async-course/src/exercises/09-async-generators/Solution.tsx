import { useState, useRef, useEffect, useCallback } from 'react'

// ============================================
// Task 9.1 Solution: Async Pagination
// ============================================

// Simulated API: each page returns 5 items with a delay
interface PageItem {
  id: number
  title: string
  value: number
}

interface PageResponse {
  items: PageItem[]
  page: number
  totalPages: number
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchPage(page: number): Promise<PageResponse> {
  await delay(600)
  const items: PageItem[] = Array.from({ length: 5 }, (_, i) => ({
    id: (page - 1) * 5 + i + 1,
    title: `Элемент #${(page - 1) * 5 + i + 1}`,
    value: Math.floor(Math.random() * 1000),
  }))
  return { items, page, totalPages: 6 }
}

// Async generator that lazily fetches pages one by one
async function* fetchAllPages(): AsyncGenerator<PageResponse> {
  let page = 1
  while (true) {
    const response = await fetchPage(page)
    yield response
    if (page >= response.totalPages) break
    page++
  }
}

export function Task9_1_Solution() {
  const [items, setItems] = useState<PageItem[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(6)
  const [requestCount, setRequestCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // We hold the generator instance in a ref so it persists across renders
  const genRef = useRef<AsyncGenerator<PageResponse> | null>(null)

  const handleStart = useCallback(async () => {
    // Reset state
    setItems([])
    setCurrentPage(0)
    setRequestCount(0)
    setDone(false)
    genRef.current = fetchAllPages()
  }, [])

  const handleLoadNext = useCallback(async () => {
    if (!genRef.current || loading || done) return
    setLoading(true)
    const result = await genRef.current.next()
    setLoading(false)
    if (result.done) {
      setDone(true)
      return
    }
    const { items: newItems, page, totalPages: total } = result.value
    setItems((prev) => [...prev, ...newItems])
    setCurrentPage(page)
    setTotalPages(total)
    setRequestCount((c) => c + 1)
    if (page >= total) setDone(true)
  }, [loading, done])

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const btnStyle = (disabled?: boolean, color = '#3b82f6'): React.CSSProperties => ({
    padding: '0.5rem 1.2rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.85rem',
  })

  const initialized = genRef.current !== null

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 9.1 — Async пагинация
      </h2>

      {/* Code snippet */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
        <pre style={{ margin: 0 }}>
{`async function* fetchAllPages() {
  let page = 1
  while (true) {
    const response = await fetchPage(page)  // HTTP-запрос
    yield response                           // ленивая отдача
    if (page >= response.totalPages) break
    page++
  }
}

// for-await-of потребляет страницы по одной
for await (const page of fetchAllPages()) {
  render(page.items)  // новый запрос только когда нужно
}`}
        </pre>
      </div>

      {/* Status bar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
          <span style={{ color: '#64748b' }}>Страница: </span>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>
            {currentPage > 0 ? `${currentPage} из ${totalPages}` : '—'}
          </span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
          <span style={{ color: '#64748b' }}>HTTP-запросы: </span>
          <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{requestCount}</span>
          <span style={{ color: '#64748b', marginLeft: '0.4rem', fontSize: '0.72rem' }}>
            (ленивые — только по требованию)
          </span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.82rem' }}>
          <span style={{ color: '#64748b' }}>Элементов: </span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{items.length}</span>
        </div>
      </div>

      {/* Progress bar */}
      {initialized && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ background: '#1e293b', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${totalPages > 0 ? (currentPage / totalPages) * 100 : 0}%`,
              background: done ? '#10b981' : '#3b82f6',
              borderRadius: '4px',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
            {done ? 'Все данные загружены' : loading ? 'Загружается...' : 'Готов к следующей порции'}
          </div>
        </div>
      )}

      {/* Items grid */}
      {items.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: '0.5rem',
          marginBottom: '1rem',
          maxHeight: '240px',
          overflowY: 'auto',
        }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: '#1e293b',
              borderRadius: '6px',
              padding: '0.5rem 0.75rem',
              fontSize: '0.78rem',
              borderLeft: '3px solid #3b82f6',
            }}>
              <div style={{ color: '#60a5fa', fontWeight: 'bold' }}>{item.title}</div>
              <div style={{ color: '#94a3b8' }}>val: {item.value}</div>
            </div>
          ))}
        </div>
      )}

      {done && (
        <div style={{
          background: '#052e16',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#6ee7b7',
        }}>
          Генератор завершён (done: true). Все {items.length} элементов получены за {requestCount} HTTP-запроса.
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button style={btnStyle(false, '#7c3aed')} onClick={handleStart}>
          {initialized ? 'Перезапустить' : 'Создать генератор'}
        </button>
        <button
          style={btnStyle(!initialized || loading || done)}
          onClick={handleLoadNext}
          disabled={!initialized || loading || done}
        >
          {loading ? 'Загружается...' : 'Загрузить следующую порцию'}
        </button>
      </div>

      {!initialized && (
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
          Нажмите "Создать генератор" — запросов пока нет. Каждое нажатие "Загрузить" делает ровно один HTTP-запрос.
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 9.2 Solution: Pipeline of Async Generators
// ============================================

// Three-stage async pipeline: source → filter → map
// source: emits numbers 1..20 with delay
// filter: keeps even numbers only
// map: doubles the value

interface PipelineItem {
  id: number
  rawValue: number
  filteredIn: boolean    // passed the filter?
  mappedValue: number    // after map
  stage: 'source' | 'filter' | 'output' | 'rejected'
}

async function* source(count: number, delayMs: number): AsyncGenerator<number> {
  for (let i = 1; i <= count; i++) {
    await delay(delayMs)
    yield i
  }
}

async function* filterEven(upstream: AsyncGenerator<number>): AsyncGenerator<number> {
  for await (const value of upstream) {
    if (value % 2 === 0) yield value
  }
}

async function* mapDouble(upstream: AsyncGenerator<number>): AsyncGenerator<number> {
  for await (const value of upstream) {
    yield value * 2
  }
}

export function Task9_2_Solution() {
  const [items, setItems] = useState<PipelineItem[]>([])
  const [running, setRunning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [done, setDone] = useState(false)
  const pausedRef = useRef(false)
  const stopRef = useRef(false)

  const waitIfPaused = async () => {
    while (pausedRef.current) {
      await delay(100)
      if (stopRef.current) break
    }
  }

  const handleStart = useCallback(async () => {
    setItems([])
    setRunning(true)
    setDone(false)
    setPaused(false)
    pausedRef.current = false
    stopRef.current = false

    // We run the pipeline manually step by step to animate it
    const src = source(20, 400)
    const filtered = filterEven(src)
    const mapped = mapDouble(filtered)

    // Because we need to show each item passing through stages,
    // we simulate the pipeline by consuming source directly and tracking stages
    const srcInner = source(20, 400)

    for await (const rawVal of srcInner) {
      if (stopRef.current) break
      await waitIfPaused()

      const filteredIn = rawVal % 2 === 0
      const mappedValue = rawVal * 2

      const item: PipelineItem = {
        id: rawVal,
        rawValue: rawVal,
        filteredIn,
        mappedValue,
        stage: 'source',
      }

      setItems((prev) => [...prev, item])

      await delay(200)
      await waitIfPaused()
      if (stopRef.current) break

      // Move to filter stage
      setItems((prev) =>
        prev.map((it) =>
          it.id === rawVal
            ? { ...it, stage: filteredIn ? 'filter' : 'rejected' }
            : it
        )
      )

      await delay(200)
      await waitIfPaused()
      if (stopRef.current) break

      if (filteredIn) {
        // Move to output stage
        setItems((prev) =>
          prev.map((it) =>
            it.id === rawVal ? { ...it, stage: 'output' } : it
          )
        )
        await delay(150)
        await waitIfPaused()
      }

      if (stopRef.current) break
    }

    // consume the mapped pipeline to completion (it's separate)
    if (!stopRef.current) {
      for await (const _ of mapped) {
        // already rendered above
        if (stopRef.current) break
      }
    }

    setRunning(false)
    if (!stopRef.current) setDone(true)
  }, [])

  const handlePause = () => {
    if (!running) return
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
  }

  const handleStop = () => {
    stopRef.current = true
    pausedRef.current = false
    setRunning(false)
    setPaused(false)
    setDone(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const stageColors = {
    source: '#3b82f6',
    filter: '#f59e0b',
    output: '#10b981',
    rejected: '#ef4444',
  }

  const stageLabels = {
    source: 'source',
    filter: 'filter',
    output: 'output',
    rejected: 'rejected',
  }

  const outputItems = items.filter((it) => it.stage === 'output')
  const rejectedCount = items.filter((it) => it.stage === 'rejected').length

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 9.2 — Pipeline из async-генераторов
      </h2>

      {/* Pipeline diagram */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        flexWrap: 'wrap',
      }}>
        {['source (1..20)', 'filter (чётные)', 'map (x2)', 'результат'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              background: [stageColors.source, stageColors.filter, stageColors.output, '#7c3aed'][i],
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              fontSize: '0.78rem',
              color: '#fff',
              fontWeight: 'bold',
            }}>
              {label}
            </div>
            {i < 3 && <span style={{ color: '#475569' }}>→</span>}
          </div>
        ))}
      </div>

      {/* Code snippet */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
        <pre style={{ margin: 0 }}>
{`async function* source(n) { for (let i=1; i<=n; i++) { await delay(400); yield i } }
async function* filterEven(up) { for await (const v of up) if (v%2===0) yield v }
async function* mapDouble(up) { for await (const v of up) yield v*2 }

// Компоновка:
const pipeline = mapDouble(filterEven(source(20)))`}
        </pre>
      </div>

      {/* Items flow visualization */}
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.75rem',
        marginBottom: '1rem',
        minHeight: '120px',
        maxHeight: '200px',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.5rem' }}>
          ПОТОК ЭЛЕМЕНТОВ
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {items.map((item) => (
            <div key={item.id} style={{
              background: stageColors[item.stage],
              borderRadius: '4px',
              padding: '0.2rem 0.45rem',
              fontSize: '0.72rem',
              color: '#fff',
              opacity: item.stage === 'rejected' ? 0.4 : 1,
              transition: 'background 0.3s, opacity 0.3s',
              textDecoration: item.stage === 'rejected' ? 'line-through' : 'none',
            }}>
              {item.stage === 'output' ? item.mappedValue : item.rawValue}
              <span style={{ fontSize: '0.6rem', marginLeft: '0.2rem', opacity: 0.7 }}>
                [{stageLabels[item.stage]}]
              </span>
            </div>
          ))}
          {items.length === 0 && (
            <span style={{ color: '#475569', fontSize: '0.82rem' }}>
              Нажмите "Запустить"...
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Принято: </span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{outputItems.length}</span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Отфильтровано: </span>
          <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{rejectedCount}</span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Результат: </span>
          <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>
            [{outputItems.map((it) => it.mappedValue).join(', ')}]
          </span>
        </div>
      </div>

      {paused && (
        <div style={{
          background: '#1c1917',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#fbbf24',
        }}>
          Пауза — backpressure: генератор ждёт, новые элементы не производятся
        </div>
      )}

      {done && (
        <div style={{
          background: '#052e16',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#6ee7b7',
        }}>
          Pipeline завершён. Из 20 исходных чисел {outputItems.length} прошли фильтр, результат: [{outputItems.map((it) => it.mappedValue).join(', ')}]
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleStart}
          disabled={running}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: running ? 'not-allowed' : 'pointer',
            background: running ? '#1e293b' : '#059669',
            color: running ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          {running ? 'Выполняется...' : 'Запустить'}
        </button>
        <button
          onClick={handlePause}
          disabled={!running}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: !running ? 'not-allowed' : 'pointer',
            background: !running ? '#1e293b' : paused ? '#d97706' : '#f59e0b',
            color: !running ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          {paused ? 'Продолжить' : 'Пауза'}
        </button>
        <button
          onClick={handleStop}
          disabled={!running}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: !running ? 'not-allowed' : 'pointer',
            background: !running ? '#1e293b' : '#dc2626',
            color: !running ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          Стоп
        </button>
      </div>
    </div>
  )
}

// ============================================
// Task 9.3 Solution: Real-time Event Stream
// ============================================

interface StockEvent {
  id: number
  symbol: string
  price: number
  change: number  // % change
  timestamp: string
}

const SYMBOLS = ['AAPL', 'GOOG', 'MSFT', 'AMZN', 'TSLA']
const BASE_PRICES: Record<string, number> = {
  AAPL: 185, GOOG: 140, MSFT: 420, AMZN: 185, TSLA: 175,
}

function generateTick(id: number): StockEvent {
  const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  const base = BASE_PRICES[symbol]
  const change = (Math.random() - 0.48) * 4  // slight upward bias
  const price = +(base + change).toFixed(2)
  const pct = +((change / base) * 100).toFixed(2)
  const now = new Date()
  return {
    id,
    symbol,
    price,
    change: pct,
    timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`,
  }
}

export function Task9_3_Solution() {
  const [events, setEvents] = useState<StockEvent[]>([])
  const [chartData, setChartData] = useState<number[]>([])
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'stopped'>('idle')
  const [processedCount, setProcessedCount] = useState(0)
  const [skippedCount, setSkippedCount] = useState(0)

  const statusRef = useRef<'idle' | 'running' | 'paused' | 'stopped'>('idle')
  const counterRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const queueRef = useRef<StockEvent[]>([])
  const processingRef = useRef(false)

  // The async generator consumes from a queue (backpressure simulation)
  const processQueue = useCallback(async () => {
    if (processingRef.current) return
    processingRef.current = true

    while (statusRef.current !== 'stopped') {
      if (statusRef.current === 'paused') {
        await delay(100)
        continue
      }

      if (queueRef.current.length === 0) {
        await delay(50)
        continue
      }

      const event = queueRef.current.shift()!
      setEvents((prev) => [event, ...prev].slice(0, 30))
      setChartData((prev) => {
        const updated = [...prev, event.price].slice(-20)
        return updated
      })
      setProcessedCount((c) => c + 1)

      await delay(200) // processing time — creates backpressure
    }

    processingRef.current = false
  }, [])

  const handleStart = useCallback(() => {
    counterRef.current = 0
    queueRef.current = []
    setEvents([])
    setChartData([])
    setProcessedCount(0)
    setSkippedCount(0)
    statusRef.current = 'running'
    setStatus('running')

    // Producer: generates events at 300ms interval (faster than consumer at 200ms = backpressure)
    intervalRef.current = setInterval(() => {
      if (statusRef.current === 'stopped') {
        clearInterval(intervalRef.current!)
        return
      }
      if (statusRef.current === 'paused') {
        setSkippedCount((c) => c + 1)
        return
      }
      counterRef.current++
      const event = generateTick(counterRef.current)
      queueRef.current.push(event)
    }, 300)

    processQueue()
  }, [processQueue])

  const handlePause = useCallback(() => {
    if (statusRef.current === 'running') {
      statusRef.current = 'paused'
      setStatus('paused')
    } else if (statusRef.current === 'paused') {
      statusRef.current = 'running'
      setStatus('running')
    }
  }, [])

  const handleStop = useCallback(() => {
    statusRef.current = 'stopped'
    setStatus('stopped')
    if (intervalRef.current) clearInterval(intervalRef.current)
    queueRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      statusRef.current = 'stopped'
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  // Mini sparkline chart
  const renderChart = () => {
    if (chartData.length < 2) return null
    const min = Math.min(...chartData)
    const max = Math.max(...chartData)
    const range = max - min || 1
    const W = 300, H = 60

    const points = chartData.map((v, i) => {
      const x = (i / (chartData.length - 1)) * W
      const y = H - ((v - min) / range) * H
      return `${x},${y}`
    }).join(' ')

    const lastVal = chartData[chartData.length - 1]
    const prevVal = chartData[chartData.length - 2]
    const color = lastVal >= prevVal ? '#10b981' : '#ef4444'

    return (
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '60px', display: 'block' }}>
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {chartData.map((v, i) => {
          const x = (i / (chartData.length - 1)) * W
          const y = H - ((v - min) / range) * H
          return i === chartData.length - 1 ? (
            <circle key={i} cx={x} cy={y} r="3" fill={color} />
          ) : null
        })}
      </svg>
    )
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const statusColors = {
    idle: '#64748b',
    running: '#10b981',
    paused: '#f59e0b',
    stopped: '#ef4444',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 9.3 — Real-time event stream
      </h2>

      {/* Code snippet */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.6 }}>
        <pre style={{ margin: 0 }}>
{`async function* stockStream(signal) {
  while (!signal.aborted) {
    await delay(300)
    yield generateTick()  // новый тик котировки
  }
}

// for-await-of потребляет поток:
for await (const tick of stockStream(signal)) {
  await processAndRender(tick)  // backpressure: producer ждёт consumer
  // break или signal.abort() — вызывает generator.return()
}`}
        </pre>
      </div>

      {/* Status + counters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Статус: </span>
          <span style={{ color: statusColors[status], fontWeight: 'bold' }}>
            {status === 'idle' ? 'Ожидание' : status === 'running' ? 'Работает' : status === 'paused' ? 'Пауза' : 'Остановлен'}
          </span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Обработано: </span>
          <span style={{ color: '#10b981', fontWeight: 'bold' }}>{processedCount}</span>
        </div>
        <div style={{ background: '#1e293b', borderRadius: '6px', padding: '0.4rem 0.8rem' }}>
          <span style={{ color: '#64748b' }}>Пропущено (пауза): </span>
          <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{skippedCount}</span>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.35rem' }}>
            ПОСЛЕДНИЕ 20 ЗНАЧЕНИЙ (цены)
          </div>
          {renderChart()}
        </div>
      )}

      {/* Event ticker */}
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.5rem',
        marginBottom: '1rem',
        maxHeight: '200px',
        overflowY: 'auto',
      }}>
        <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: '0.35rem', padding: '0 0.25rem' }}>
          ЛЕНТА СОБЫТИЙ (последние 30)
        </div>
        {events.length === 0 && (
          <div style={{ color: '#475569', fontSize: '0.82rem', padding: '0.5rem' }}>
            Нажмите "Старт"...
          </div>
        )}
        {events.map((ev) => (
          <div key={ev.id} style={{
            display: 'flex',
            gap: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.78rem',
            alignItems: 'center',
            borderBottom: '1px solid #0f172a',
          }}>
            <span style={{ color: '#94a3b8', minWidth: '50px' }}>{ev.timestamp}</span>
            <span style={{ color: '#60a5fa', fontWeight: 'bold', minWidth: '45px' }}>{ev.symbol}</span>
            <span style={{ color: '#e2e8f0', minWidth: '65px' }}>${ev.price}</span>
            <span style={{
              color: ev.change >= 0 ? '#10b981' : '#ef4444',
              fontWeight: 'bold',
            }}>
              {ev.change >= 0 ? '+' : ''}{ev.change}%
            </span>
          </div>
        ))}
      </div>

      {status === 'paused' && (
        <div style={{
          background: '#1c1917',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '0.6rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#fbbf24',
        }}>
          Пауза: генератор приостановлен. Новые события от источника не обрабатываются (backpressure).
          Входящие тики пропускаются — очередь не растёт бесконечно.
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleStart}
          disabled={status === 'running' || status === 'paused'}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: (status === 'running' || status === 'paused') ? 'not-allowed' : 'pointer',
            background: (status === 'running' || status === 'paused') ? '#1e293b' : '#059669',
            color: (status === 'running' || status === 'paused') ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          Старт
        </button>
        <button
          onClick={handlePause}
          disabled={status === 'idle' || status === 'stopped'}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: (status === 'idle' || status === 'stopped') ? 'not-allowed' : 'pointer',
            background: (status === 'idle' || status === 'stopped') ? '#1e293b' : status === 'paused' ? '#d97706' : '#f59e0b',
            color: (status === 'idle' || status === 'stopped') ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          {status === 'paused' ? 'Продолжить' : 'Пауза'}
        </button>
        <button
          onClick={handleStop}
          disabled={status === 'idle' || status === 'stopped'}
          style={{
            padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
            cursor: (status === 'idle' || status === 'stopped') ? 'not-allowed' : 'pointer',
            background: (status === 'idle' || status === 'stopped') ? '#1e293b' : '#dc2626',
            color: (status === 'idle' || status === 'stopped') ? '#475569' : '#fff',
            fontFamily: 'inherit', fontSize: '0.85rem',
          }}
        >
          Стоп
        </button>
      </div>
    </div>
  )
}
