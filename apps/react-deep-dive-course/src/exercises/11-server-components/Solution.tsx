import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.1: RSC Payload Parser
// ─────────────────────────────────────────────────────────────────────────────

type ImportRow  = { id: string; type: 'I'; chunk: string; name: string }
type JsonRow    = { id: string; type: 'J'; element: Record<string, unknown> }
type StringRow  = { id: string; type: 'S'; token: string }
type PendingRow = { id: string; type: 'P'; placeholder: true }
type UnknownRow = { id: string; type: 'unknown'; raw: string }
type PayloadRow = ImportRow | JsonRow | StringRow | PendingRow | UnknownRow

function parsePayloadLine(line: string): PayloadRow | null {
  const colonIdx = line.indexOf(':')
  if (colonIdx === -1) return null
  const id   = line.slice(0, colonIdx)
  const rest = line.slice(colonIdx + 1)
  if (!rest) return null

  const typeChar = rest[0]
  const data     = rest.slice(1)

  try {
    if (typeChar === 'I') {
      const parsed = JSON.parse(data) as { chunk: string; name: string }
      return { id, type: 'I', chunk: parsed.chunk, name: parsed.name }
    }
    if (typeChar === 'J') {
      const element = JSON.parse(data) as Record<string, unknown>
      return { id, type: 'J', element }
    }
    if (typeChar === 'S') {
      const token = data.replace(/^"/, '').replace(/"$/, '')
      return { id, type: 'S', token }
    }
    if (typeChar === 'P') {
      return { id, type: 'P', placeholder: true }
    }
  } catch {
    // fall through
  }
  return { id, type: 'unknown', raw: line }
}

const SUSPENSE_STYLE: React.CSSProperties = {
  border: '2px dashed #94a3b8',
  borderRadius: 8,
  padding: '8px 12px',
  margin: '4px 0',
  background: '#f8fafc',
}
const SERVER_STYLE: React.CSSProperties = {
  background: '#dbeafe',
  border: '1px solid #93c5fd',
  borderRadius: 6,
  padding: '6px 10px',
  margin: '3px 0',
  fontSize: 13,
}
const CLIENT_STYLE: React.CSSProperties = {
  background: '#fed7aa',
  border: '1px solid #fb923c',
  borderRadius: 6,
  padding: '6px 10px',
  margin: '3px 0',
  fontSize: 13,
}
const PENDING_STYLE: React.CSSProperties = {
  background: '#e2e8f0',
  border: '1px solid #94a3b8',
  borderRadius: 6,
  padding: '6px 10px',
  margin: '3px 0',
  fontSize: 13,
  animation: 'rsc-pulse 1.4s ease-in-out infinite',
}

const DEFAULT_PAYLOAD = `0:S"react.suspense"
1:I{"chunk":"client-abc.js","name":"LikeButton"}
2:I{"chunk":"client-def.js","name":"CommentForm"}
3:J{"type":"div","props":{"className":"page"},"children":["$4","$5"]}
4:J{"type":"header","props":{},"children":"$6"}
5:J{"type":"$0","props":{"fallback":"Loading..."},"children":"$P7"}
6:J{"type":"h1","props":{},"children":"Статья о React"}
7:P
8:J{"type":"div","props":{"className":"comments"},"children":["$9","$L2"]}
9:J{"type":"p","props":{},"children":"Первый комментарий"}`

function RowNode({ row }: { row: PayloadRow }) {
  if (row.type === 'S') {
    return (
      <div style={SUSPENSE_STYLE} title={`${row.id}:S"${row.token}"`}>
        <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
          Suspense token: {row.token}
        </span>
      </div>
    )
  }
  if (row.type === 'I') {
    return (
      <div style={CLIENT_STYLE} title={`${row.id}:I{...}`}>
        <strong style={{ color: '#c2410c' }}>Client</strong>{' '}
        <code style={{ fontSize: 12 }}>{row.name}</code>
        <span style={{ color: '#9a3412', marginLeft: 8, fontSize: 11 }}>{row.chunk}</span>
      </div>
    )
  }
  if (row.type === 'J') {
    const el = row.element
    const typeName = String(el.type ?? '?')
    const isSuspenseRef = typeName.startsWith('$0') || typeName === '$0'
    if (isSuspenseRef) {
      return (
        <div style={SUSPENSE_STYLE} title={`${row.id}:J{...}`}>
          <span style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
            Suspense boundary (ref $0)
          </span>
        </div>
      )
    }
    const props = el.props as Record<string, unknown> | undefined
    return (
      <div style={SERVER_STYLE} title={`${row.id}:J{...}`}>
        <strong style={{ color: '#1d4ed8' }}>Server</strong>{' '}
        <code style={{ fontSize: 12 }}>&lt;{typeName}&gt;</code>
        {props?.className ? (
          <span style={{ color: '#1e40af', marginLeft: 8, fontSize: 11 }}>
            .{String(props.className)}
          </span>
        ) : null}
      </div>
    )
  }
  if (row.type === 'P') {
    return (
      <div style={PENDING_STYLE} title={`${row.id}:P`}>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#475569' }}>
          Pending chunk (Suspense placeholder)
        </span>
      </div>
    )
  }
  return (
    <div style={{ ...SERVER_STYLE, background: '#fef9c3', borderColor: '#fde047', fontSize: 12 }}>
      <code>{(row as UnknownRow).raw}</code>
    </div>
  )
}

export function Task11_1_Solution() {
  const [payloadText, setPayloadText]   = useState(DEFAULT_PAYLOAD)
  const [parsedRows, setParsedRows]     = useState<PayloadRow[]>([])
  const [visibleCount, setVisibleCount] = useState(0)
  const [isParsed, setIsParsed]         = useState(false)

  const handleParse = useCallback(() => {
    const lines = payloadText.split('\n').filter(l => l.trim())
    const rows  = lines.map(parsePayloadLine).filter((r): r is PayloadRow => r !== null)
    setParsedRows(rows)
    setVisibleCount(0)
    setIsParsed(true)
  }, [payloadText])

  const handleNext  = () => setVisibleCount(c => Math.min(c + 1, parsedRows.length))
  const handleReset = () => { setVisibleCount(0); setIsParsed(false) }

  const visible = parsedRows.slice(0, visibleCount)

  return (
    <div className="exercise-container">
      <style>{`
        @keyframes rsc-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
      <h2>Задание 11.1: RSC Payload Parser</h2>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {/* Left: editor */}
        <div style={{ flex: '1 1 300px' }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>RSC Payload (редактируемый):</p>
          <textarea
            value={payloadText}
            onChange={e => { setPayloadText(e.target.value); setIsParsed(false) }}
            style={{
              width: '100%', height: 200, fontFamily: 'monospace', fontSize: 12,
              padding: 10, borderRadius: 6, border: '1px solid #cbd5e1',
              resize: 'vertical', boxSizing: 'border-box',
            }}
          />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button
              onClick={handleParse}
              style={{ padding: '6px 14px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Парсить
            </button>
            {isParsed && (
              <>
                <button
                  onClick={handleNext}
                  disabled={visibleCount >= parsedRows.length}
                  style={{ padding: '6px 14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  Следующий чанк
                </button>
                <button
                  onClick={handleReset}
                  style={{ padding: '6px 14px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
                >
                  Сброс
                </button>
              </>
            )}
          </div>
          {isParsed && (
            <p style={{ marginTop: 8, fontSize: 13, color: '#64748b' }}>
              Получено {visibleCount}/{parsedRows.length} чанков
            </p>
          )}
        </div>

        {/* Right: tree */}
        <div style={{ flex: '1 1 280px' }}>
          <p style={{ fontWeight: 600, marginBottom: 6 }}>Визуальное дерево:</p>
          {!isParsed && (
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, color: '#94a3b8', fontSize: 13 }}>
              Нажмите "Парсить" чтобы разобрать payload
            </div>
          )}
          {isParsed && visible.length === 0 && (
            <div style={{ padding: 16, background: '#f8fafc', borderRadius: 8, color: '#94a3b8', fontSize: 13 }}>
              Нажмите "Следующий чанк" для пошагового разбора
            </div>
          )}
          {visible.map(row => <RowNode key={row.id} row={row} />)}
        </div>
      </div>

      {/* Legend */}
      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ ...SERVER_STYLE, margin: 0, fontSize: 12 }}>Server element (J)</span>
        <span style={{ ...CLIENT_STYLE, margin: 0, fontSize: 12 }}>Client component (I)</span>
        <span style={{ ...SUSPENSE_STYLE, padding: '4px 10px', margin: 0, fontSize: 12 }}>Suspense boundary (S/$0)</span>
        <span style={{ ...PENDING_STYLE, margin: 0, fontSize: 12, animation: 'none', opacity: 0.7 }}>Pending chunk (P)</span>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.2: Streaming Simulator
// ─────────────────────────────────────────────────────────────────────────────

type SectionStatus = 'idle' | 'waiting' | 'loading' | 'ready'

interface Section {
  id: string
  label: string
  delay: number
  color: string
}

const SECTIONS: Section[] = [
  { id: 'header',   label: 'Header',   delay: 0,    color: '#3b82f6' },
  { id: 'hero',     label: 'Hero',     delay: 800,  color: '#8b5cf6' },
  { id: 'content',  label: 'Content',  delay: 1800, color: '#10b981' },
  { id: 'comments', label: 'Comments', delay: 3200, color: '#f59e0b' },
]

interface LogEntry { time: number; text: string }

export function Task11_2_Solution() {
  const [statuses,  setStatuses]  = useState<Record<string, SectionStatus>>(() =>
    Object.fromEntries(SECTIONS.map(s => [s.id, 'idle' as SectionStatus]))
  )
  const [running,   setRunning]   = useState(false)
  const [done,      setDone]      = useState(false)
  const [log,       setLog]       = useState<LogEntry[]>([])
  const timersRef   = useRef<ReturnType<typeof setTimeout>[]>([])
  const startRef    = useRef<number>(0)

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }

  const addLog = (startTime: number, text: string) => {
    const elapsed = Date.now() - startTime
    setLog(prev => [...prev, { time: elapsed, text }])
  }

  const startStreaming = () => {
    clearTimers()
    setDone(false)
    setLog([])
    setStatuses(Object.fromEntries(SECTIONS.map(s => [s.id, 'waiting' as SectionStatus])))
    setRunning(true)
    const startTime = Date.now()
    startRef.current = startTime

    SECTIONS.forEach(section => {
      const t1 = setTimeout(() => {
        setStatuses(prev => ({ ...prev, [section.id]: 'loading' }))
        addLog(startTime, `chunk: ${section.label} (получен)`)
      }, section.delay)

      const t2 = setTimeout(() => {
        setStatuses(prev => ({ ...prev, [section.id]: 'ready' }))
      }, section.delay + 400)

      timersRef.current.push(t1, t2)
    })

    const lastDelay = Math.max(...SECTIONS.map(s => s.delay)) + 400
    const tDone = setTimeout(() => {
      setRunning(false)
      setDone(true)
      addLog(startTime, 'Streaming завершён')
    }, lastDelay + 50)
    timersRef.current.push(tDone)
  }

  const handleReplay = () => startStreaming()
  const handleReset  = () => {
    clearTimers()
    setRunning(false)
    setDone(false)
    setLog([])
    setStatuses(Object.fromEntries(SECTIONS.map(s => [s.id, 'idle' as SectionStatus])))
  }

  useEffect(() => () => clearTimers(), [])

  const readyCount = SECTIONS.filter(s => statuses[s.id] === 'ready').length
  const progress   = Math.round((readyCount / SECTIONS.length) * 100)

  return (
    <div className="exercise-container">
      <style>{`
        @keyframes shimmer {
          0%   { background-position: -400px 0; }
          100% { background-position:  400px 0; }
        }
      `}</style>
      <h2>Задание 11.2: Streaming Simulator</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={startStreaming}
          disabled={running}
          style={{ padding: '8px 16px', background: running ? '#94a3b8' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: running ? 'not-allowed' : 'pointer' }}
        >
          Запустить streaming
        </button>
        {done && (
          <button
            onClick={handleReplay}
            style={{ padding: '8px 16px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
          >
            ↺ Повторить
          </button>
        )}
        <button
          onClick={handleReset}
          style={{ padding: '8px 16px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Сброс
        </button>
      </div>

      {/* Progress bar */}
      {running || done ? (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
            <span style={{ fontFamily: 'monospace', color: '#64748b' }}>Transfer-Encoding: chunked</span>
            <span>Получено {readyCount}/{SECTIONS.length} чанков</span>
          </div>
          <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`, background: '#3b82f6',
              borderRadius: 4, transition: 'width 400ms ease',
            }} />
          </div>
        </div>
      ) : null}

      {/* Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {SECTIONS.map(section => {
          const status = statuses[section.id]
          const isWaiting = status === 'waiting'
          const isLoading = status === 'loading'
          const isReady   = status === 'ready'

          return (
            <div key={section.id} style={{
              borderRadius: 10,
              padding: 16,
              minHeight: 80,
              background: isReady
                ? section.color
                : isLoading
                  ? 'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)'
                  : '#f1f5f9',
              backgroundSize: isLoading ? '400px 100%' : undefined,
              animation: isLoading ? 'shimmer 1.2s infinite linear' : undefined,
              border: `2px solid ${isReady ? section.color : '#cbd5e1'}`,
              transition: 'background 300ms ease, border-color 300ms ease',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}>
              <span style={{ fontWeight: 700, color: isReady ? '#fff' : '#94a3b8', fontSize: 15 }}>
                {section.label}
              </span>
              <span style={{ fontSize: 12, color: isReady ? '#fff' : '#94a3b8' }}>
                {isReady    ? `Готов (delay ${section.delay}ms)`
                 : isLoading ? 'Получен чанк...'
                 : isWaiting ? 'Ожидание...'
                 : 'Idle'}
              </span>
            </div>
          )
        })}
      </div>

      {/* Log */}
      {log.length > 0 && (
        <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, maxHeight: 140, overflowY: 'auto' }}>
          {log.map((entry, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <span style={{ color: '#38bdf8' }}>[{entry.time}ms]</span>{' '}
              <span style={{ color: '#86efac' }}>→ {entry.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 11.3: Selective Hydration
// ─────────────────────────────────────────────────────────────────────────────

type HydrationStatus = 'static' | 'hydrating' | 'hydrated'
type HydrationMode = 'standard' | 'selective'

interface HydrationSection {
  id: string
  label: string
  baseCost: number
  color: string
}

const HYDRATION_SECTIONS: HydrationSection[] = [
  { id: 'header',   label: 'Header',   baseCost: 1200, color: '#3b82f6' },
  { id: 'sidebar',  label: 'Sidebar',  baseCost: 800,  color: '#8b5cf6' },
  { id: 'content',  label: 'Content',  baseCost: 2000, color: '#10b981' },
  { id: 'comments', label: 'Comments', baseCost: 1500, color: '#f59e0b' },
]

interface SectionState {
  status: HydrationStatus
  isPriority: boolean
  progress: number  // 0-100
}

interface HydrationLogEntry { time: number; text: string }

export function Task11_3_Solution() {
  const [sectionStates, setSectionStates] = useState<Record<string, SectionState>>(() =>
    Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, { status: 'static' as HydrationStatus, isPriority: false, progress: 0 }]))
  )
  const [mode,    setMode]    = useState<HydrationMode>('standard')
  const [running, setRunning] = useState(false)
  const [hlog,    setHLog]    = useState<HydrationLogEntry[]>([])

  // Ref-based state for reading inside closures without stale captures
  const statusMapRef   = useRef<Record<string, HydrationStatus>>({})
  const timersRef      = useRef<ReturnType<typeof setTimeout>[]>([])
  const intervalsRef   = useRef<ReturnType<typeof setInterval>[]>([])
  const startRef       = useRef<number>(0)
  const priorityQueueRef = useRef<string[]>([])
  const activeRef      = useRef<string | null>(null)

  const clearAll = () => {
    timersRef.current.forEach(clearTimeout)
    intervalsRef.current.forEach(clearInterval)
    timersRef.current = []
    intervalsRef.current = []
    activeRef.current = null
    priorityQueueRef.current = []
  }

  const setStatus = (id: string, status: HydrationStatus) => {
    statusMapRef.current[id] = status
  }

  const addLog = (text: string) => {
    const elapsed = Date.now() - startRef.current
    setHLog(prev => [...prev, { time: elapsed, text }])
  }

  const hydrateSection = (
    id: string,
    cost: number,
    isPriority: boolean,
    onDone: () => void
  ) => {
    activeRef.current = id
    setStatus(id, 'hydrating')
    const startProgress = Date.now()
    setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], status: 'hydrating', isPriority, progress: 0 } }))

    const iv = setInterval(() => {
      const elapsed = Date.now() - startProgress
      const pct = Math.min(Math.round((elapsed / cost) * 100), 99)
      setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], progress: pct } }))
    }, 50)
    intervalsRef.current.push(iv)

    const t = setTimeout(() => {
      clearInterval(iv)
      intervalsRef.current = intervalsRef.current.filter(i => i !== iv)
      activeRef.current = null
      setStatus(id, 'hydrated')
      setSectionStates(prev => ({ ...prev, [id]: { ...prev[id], status: 'hydrated', progress: 100 } }))
      addLog(`${id} гидрирован ✓${isPriority ? ' [Приоритетный]' : ''}`)
      onDone()
    }, cost)
    timersRef.current.push(t)
  }

  const runStandard = () => {
    clearAll()
    setRunning(true)
    setHLog([])
    startRef.current = Date.now()
    statusMapRef.current = Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, 'static' as HydrationStatus]))
    setSectionStates(Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, { status: 'static', isPriority: false, progress: 0 }])))

    let idx = 0
    const next = () => {
      if (idx >= HYDRATION_SECTIONS.length) { setRunning(false); return }
      const section = HYDRATION_SECTIONS[idx++]
      addLog(`Гидрация ${section.label} начата (стандартная)`)
      hydrateSection(section.id, section.baseCost, false, next)
    }
    next()
  }

  const runSelective = () => {
    clearAll()
    setRunning(true)
    setHLog([])
    startRef.current = Date.now()
    statusMapRef.current = Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, 'static' as HydrationStatus]))
    setSectionStates(Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, { status: 'static', isPriority: false, progress: 0 }])))
    priorityQueueRef.current = []

    const bgQueue = [...HYDRATION_SECTIONS]
    let bgIdx = 0

    const hydrateNext = () => {
      // Priority queue takes precedence
      const priorityId = priorityQueueRef.current.shift()
      if (priorityId) {
        // Skip if already hydrated by another priority run
        if (statusMapRef.current[priorityId] === 'hydrated') { hydrateNext(); return }
        const sec = HYDRATION_SECTIONS.find(s => s.id === priorityId)!
        addLog(`${sec.label} гидрируется (приоритетная, ${Math.round(sec.baseCost * 0.3)}ms)`)
        hydrateSection(priorityId, Math.round(sec.baseCost * 0.3), true, hydrateNext)
        return
      }

      // Background queue: skip already hydrated sections
      while (bgIdx < bgQueue.length) {
        const sec = bgQueue[bgIdx++]
        if (statusMapRef.current[sec.id] === 'hydrated') continue
        addLog(`Гидрация ${sec.label} начата (стандартная)`)
        hydrateSection(sec.id, sec.baseCost, false, hydrateNext)
        return
      }

      setRunning(false)
      addLog('Selective hydration завершена')
    }

    hydrateNext()
  }

  const handlePriorityClick = (id: string) => {
    if (!running) return
    if (statusMapRef.current[id] === 'hydrated') return
    if (statusMapRef.current[id] === 'hydrating' && activeRef.current === id) return
    if (priorityQueueRef.current.includes(id)) return

    addLog(`Клик на ${id} → приоритет!`)
    priorityQueueRef.current.unshift(id)
  }

  const handleReset = () => {
    clearAll()
    setRunning(false)
    setHLog([])
    statusMapRef.current = Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, 'static' as HydrationStatus]))
    setSectionStates(Object.fromEntries(HYDRATION_SECTIONS.map(s => [s.id, { status: 'static', isPriority: false, progress: 0 }])))
  }

  useEffect(() => () => clearAll(), [])

  return (
    <div className="exercise-container">
      <style>{`
        @keyframes sel-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
          50%       { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
        }
      `}</style>
      <h2>Задание 11.3: Selective Hydration</h2>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <button
          onClick={() => { setMode('standard'); runStandard() }}
          disabled={running}
          style={{ padding: '8px 14px', background: running ? '#94a3b8' : '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, cursor: running ? 'not-allowed' : 'pointer', fontSize: 13 }}
        >
          Стандартная гидрация
        </button>
        <button
          onClick={() => { setMode('selective'); runSelective() }}
          disabled={running}
          style={{ padding: '8px 14px', background: running ? '#94a3b8' : '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, cursor: running ? 'not-allowed' : 'pointer', fontSize: 13 }}
        >
          Selective Hydration
        </button>
        <button
          onClick={handleReset}
          style={{ padding: '8px 14px', background: '#6b7280', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}
        >
          Reset
        </button>
      </div>

      {mode === 'selective' && running && (
        <div style={{ padding: '8px 12px', background: '#fef9c3', borderRadius: 6, marginBottom: 12, fontSize: 13 }}>
          Кликните на серую секцию чтобы приоритизировать её гидрацию
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
        {HYDRATION_SECTIONS.map(section => {
          const st = sectionStates[section.id]
          const isHydrating = st.status === 'hydrating'
          const isHydrated  = st.status === 'hydrated'
          const isClickable = mode === 'selective' && running && st.status === 'static'

          return (
            <div
              key={section.id}
              onClick={() => isClickable && handlePriorityClick(section.id)}
              style={{
                borderRadius: 10,
                padding: 16,
                minHeight: 90,
                background: isHydrated
                  ? `${section.color}22`
                  : '#f8fafc',
                border: `2px solid ${
                  isHydrated  ? section.color
                  : isHydrating ? '#3b82f6'
                  : '#e2e8f0'
                }`,
                animation: isHydrating ? 'sel-pulse 1.2s ease-in-out infinite' : undefined,
                cursor: isClickable ? 'pointer' : 'default',
                transition: 'border-color 300ms, background 300ms',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: isHydrated ? section.color : '#94a3b8' }}>
                  {section.label}
                </span>
                {st.isPriority && (
                  <span style={{ fontSize: 10, background: '#fde68a', color: '#92400e', borderRadius: 4, padding: '2px 6px', fontWeight: 700 }}>
                    Приоритетный
                  </span>
                )}
              </div>

              <span style={{ fontSize: 12, color: isHydrated ? '#374151' : '#94a3b8' }}>
                {isHydrated  ? 'Интерактивный! Нажми меня'
                 : isHydrating ? 'Гидрация...'
                 : isClickable ? 'Нажмите для приоритета'
                 : 'Не гидрирован'}
              </span>

              {isHydrating && (
                <div style={{ marginTop: 8, height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${st.progress}%`, background: '#3b82f6', transition: 'width 50ms linear', borderRadius: 2 }} />
                </div>
              )}

              {isHydrated && (
                <button
                  style={{ marginTop: 8, padding: '4px 10px', background: section.color, color: '#fff', border: 'none', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}
                  onClick={e => { e.stopPropagation(); alert(`${section.label} интерактивен!`) }}
                >
                  Нажать
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Log */}
      {hlog.length > 0 && (
        <div style={{ background: '#0f172a', borderRadius: 8, padding: 12, maxHeight: 160, overflowY: 'auto' }}>
          <div style={{ fontSize: 11, color: '#475569', marginBottom: 6, fontFamily: 'monospace' }}>
            Лог событий гидрации:
          </div>
          {hlog.map((entry, i) => (
            <div key={i} style={{ fontFamily: 'monospace', fontSize: 12, color: '#94a3b8', lineHeight: 1.6 }}>
              <span style={{ color: '#38bdf8' }}>[{entry.time}ms]</span>{' '}
              <span style={{ color: entry.text.includes('Приоритетный') ? '#fde68a' : '#86efac' }}>
                {entry.text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
