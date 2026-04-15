import { useState, useEffect, useRef, useCallback } from 'react'

// ─── Task 2.1: Упрощённый Work Loop ──────────────────────────────────────────

type WorkNode = {
  id: string
  name: string
  child: WorkNode | null
  sibling: WorkNode | null
  return: WorkNode | null
}

function buildWorkTree(): WorkNode {
  const app: WorkNode = { id: 'app', name: 'App', child: null, sibling: null, return: null }
  const header: WorkNode = { id: 'header', name: 'Header', child: null, sibling: null, return: app }
  const main: WorkNode = { id: 'main', name: 'Main', child: null, sibling: null, return: app }
  const article: WorkNode = { id: 'article', name: 'Article', child: null, sibling: null, return: main }
  const aside: WorkNode = { id: 'aside', name: 'Aside', child: null, sibling: null, return: main }
  const footer: WorkNode = { id: 'footer', name: 'Footer', child: null, sibling: null, return: app }

  app.child = header
  header.sibling = main
  main.sibling = footer
  main.child = article
  article.sibling = aside

  return app
}

type LoopStep = {
  type: 'begin' | 'complete'
  nodeId: string
  nodeName: string
}

function buildSteps(root: WorkNode): LoopStep[] {
  const steps: LoopStep[] = []

  function dfs(node: WorkNode): void {
    steps.push({ type: 'begin', nodeId: node.id, nodeName: node.name })
    if (node.child) dfs(node.child)
    steps.push({ type: 'complete', nodeId: node.id, nodeName: node.name })
    if (node.sibling) dfs(node.sibling)
  }

  dfs(root)
  return steps
}

function WorkNodeCard({
  node,
  currentId,
  begunIds,
  completedIds,
}: {
  node: WorkNode
  currentId: string | null
  begunIds: Set<string>
  completedIds: Set<string>
}) {
  const isCurrent = node.id === currentId
  const isComplete = completedIds.has(node.id)
  const isBegun = begunIds.has(node.id) && !isComplete

  let bg = '#1f2937'
  let border = '2px solid transparent'
  let opacity = 1
  if (isCurrent) { bg = '#1e3a5f'; border = '2px solid #3b82f6' }
  else if (isComplete) { bg = '#0f2a1e'; border = '2px solid #10b98144'; opacity = 0.6 }
  else if (isBegun) { bg = '#2d1b4e'; border = '2px solid #8b5cf644' }

  const phase = isCurrent
    ? (isComplete ? 'completeWork' : 'beginWork')
    : isComplete ? 'done' : 'pending'

  const phaseColor: Record<string, string> = {
    beginWork: '#60a5fa',
    completeWork: '#34d399',
    done: '#6b7280',
    pending: '#4b5563',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
      <div>
        <div
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border,
            background: bg,
            opacity,
            minWidth: '130px',
            transition: 'all 0.2s',
          }}
        >
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e5e7eb', marginBottom: '4px' }}>
            {node.name}
          </div>
          <div style={{ fontSize: '11px', color: phaseColor[phase] }}>{phase}</div>
          {isCurrent && (
            <div style={{ fontSize: '10px', color: '#60a5fa', marginTop: '2px' }}>&#8592; workInProgress</div>
          )}
        </div>
        {node.child && (
          <div style={{ marginLeft: '20px', marginTop: '6px', borderLeft: '2px dashed #374151', paddingLeft: '10px' }}>
            <div style={{ fontSize: '10px', color: '#4b5563', marginBottom: '4px' }}>child ↓</div>
            <WorkNodeCard node={node.child} currentId={currentId} begunIds={begunIds} completedIds={completedIds} />
          </div>
        )}
      </div>
      {node.sibling && (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <div style={{ fontSize: '18px', color: '#4b5563', paddingTop: '10px' }}>→</div>
          <div>
            <div style={{ fontSize: '10px', color: '#4b5563', marginBottom: '4px' }}>sibling</div>
            <WorkNodeCard node={node.sibling} currentId={currentId} begunIds={begunIds} completedIds={completedIds} />
          </div>
        </div>
      )}
    </div>
  )
}

const ROOT_NODE = buildWorkTree()
const ALL_STEPS = buildSteps(ROOT_NODE)

export function Task2_1_Solution() {
  const [stepIndex, setStepIndex] = useState(-1)
  const [isAuto, setIsAuto] = useState(false)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const begunIds = new Set<string>()
  const completedIds = new Set<string>()
  let currentId: string | null = null

  for (let i = 0; i <= stepIndex; i++) {
    const s = ALL_STEPS[i]
    if (s.type === 'begin') begunIds.add(s.nodeId)
    else completedIds.add(s.nodeId)
  }
  if (stepIndex >= 0 && stepIndex < ALL_STEPS.length) {
    currentId = ALL_STEPS[stepIndex].nodeId
  }

  const logEntries = ALL_STEPS.slice(0, stepIndex + 1).slice(-8).map(s =>
    s.type === 'begin' ? `→ beginWork(${s.nodeName})` : `✓ completeWork(${s.nodeName})`
  )

  const isDone = stepIndex >= ALL_STEPS.length - 1

  const doStep = useCallback(() => {
    setStepIndex(i => Math.min(i + 1, ALL_STEPS.length - 1))
  }, [])

  const reset = useCallback(() => {
    setStepIndex(-1)
    setIsAuto(false)
    if (autoRef.current) clearInterval(autoRef.current)
  }, [])

  useEffect(() => {
    if (isAuto && !isDone) {
      autoRef.current = setInterval(() => {
        setStepIndex(i => {
          const next = i + 1
          if (next >= ALL_STEPS.length - 1) setIsAuto(false)
          return Math.min(next, ALL_STEPS.length - 1)
        })
      }, 600)
    } else {
      if (autoRef.current) clearInterval(autoRef.current)
    }
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [isAuto, isDone])

  return (
    <div className="exercise-container">
      <h2>Задание 2.1: Упрощённый Work Loop</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={doStep}
          disabled={isDone || isAuto}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            background: isDone || isAuto ? '#374151' : '#3b82f6',
            color: isDone || isAuto ? '#6b7280' : '#fff',
            cursor: isDone || isAuto ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Step →
        </button>
        <button
          onClick={() => setIsAuto(v => !v)}
          disabled={isDone}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: 'none',
            background: isAuto ? '#7c3aed' : '#1f2937',
            color: isDone ? '#6b7280' : '#e5e7eb',
            cursor: isDone ? 'not-allowed' : 'pointer',
            fontSize: '13px',
          }}
        >
          {isAuto ? 'Стоп' : 'Auto ▶'}
        </button>
        <button
          onClick={reset}
          style={{
            padding: '8px 18px',
            borderRadius: '6px',
            border: '1px solid #374151',
            background: 'transparent',
            color: '#9ca3af',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Reset
        </button>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>
          {isDone ? '✓ Завершено' : stepIndex < 0 ? 'Нажми Step или Auto' : `Шаг ${stepIndex + 1} / ${ALL_STEPS.length}`}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 2, minWidth: '320px', overflowX: 'auto' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px' }}>Fiber-дерево</div>
          <WorkNodeCard node={ROOT_NODE} currentId={currentId} begunIds={begunIds} completedIds={completedIds} />
        </div>
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>Лог Work Loop</div>
          <div style={{ background: '#0d1117', borderRadius: '6px', padding: '12px', minHeight: '200px', fontFamily: 'monospace', fontSize: '12px' }}>
            {logEntries.length === 0 && (
              <div style={{ color: '#374151' }}>Шаги появятся здесь...</div>
            )}
            {logEntries.map((entry, i) => (
              <div
                key={i}
                style={{
                  color: entry.startsWith('→') ? '#60a5fa' : '#34d399',
                  marginBottom: '4px',
                  fontWeight: i === logEntries.length - 1 ? 700 : 400,
                }}
              >
                {entry}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '11px', color: '#4b5563', lineHeight: 1.8 }}>
            <div><span style={{ color: '#60a5fa' }}>→</span> beginWork — вход в узел</div>
            <div><span style={{ color: '#34d399' }}>✓</span> completeWork — выход из узла</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Task 2.2: Priority Queue ─────────────────────────────────────────────────

type Priority = 'Sync' | 'UserBlocking' | 'Normal' | 'Idle'

const TIMEOUTS: Record<Priority, number> = {
  Sync: -1,
  UserBlocking: 250,
  Normal: 5000,
  Idle: Infinity,
}

const PRIORITY_COLORS: Record<Priority, string> = {
  Sync: '#ef4444',
  UserBlocking: '#f97316',
  Normal: '#3b82f6',
  Idle: '#6b7280',
}

type Task22 = {
  id: string
  label: string
  priority: Priority
  createdAt: number
  expirationTime: number
}

type LogEntry22 = {
  id: string
  label: string
  priority: Priority
  processedAt: number
}

let taskCounter = 0

export function Task2_2_Solution() {
  const [queue, setQueue] = useState<Task22[]>([])
  const [log, setLog] = useState<LogEntry22[]>([])
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(id)
  }, [])

  const processById = useCallback((taskId: string, label: string, priority: Priority) => {
    setQueue(q => q.filter(t => t.id !== taskId))
    setLog(l => [
      { id: taskId, label, priority, processedAt: Date.now() },
      ...l,
    ].slice(0, 10))
  }, [])

  const addTask = useCallback((priority: Priority) => {
    taskCounter++
    const label = `${priority} #${taskCounter}`
    const createdAt = Date.now()
    const timeout = TIMEOUTS[priority]
    const expirationTime = timeout === Infinity ? Infinity : createdAt + Math.max(0, timeout)

    if (priority === 'Sync') {
      taskCounter++
      const syncId = `sync-${taskCounter}`
      setLog(l => [{ id: syncId, label, priority, processedAt: Date.now() }, ...l].slice(0, 10))
      return
    }

    const taskId = `task-${taskCounter}`
    const task: Task22 = { id: taskId, label, priority, createdAt, expirationTime }

    setQueue(q => [...q, task].sort((a, b) => a.expirationTime - b.expirationTime))

    setTimeout(() => {
      processById(taskId, label, priority)
    }, Math.max(0, timeout))
  }, [processById])

  const formatTimeLeft = (expirationTime: number): string => {
    if (expirationTime === Infinity) return 'без дедлайна'
    const diff = expirationTime - now
    if (diff <= 0) return 'просрочена'
    if (diff < 1000) return `${diff}ms`
    return `${(diff / 1000).toFixed(1)}s`
  }

  const PRIORITIES: Priority[] = ['Sync', 'UserBlocking', 'Normal', 'Idle']

  return (
    <div className="exercise-container">
      <h2>Задание 2.2: Priority Queue (Планировщик)</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
        {PRIORITIES.map(p => (
          <button
            key={p}
            onClick={() => addTask(p)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              background: PRIORITY_COLORS[p],
              color: '#fff',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            + {p}
          </button>
        ))}
        <button
          onClick={() => { setQueue([]); setLog([]) }}
          style={{
            padding: '8px 14px',
            borderRadius: '6px',
            border: '1px solid #374151',
            background: 'transparent',
            color: '#6b7280',
            cursor: 'pointer',
            fontSize: '12px',
            marginLeft: 'auto',
          }}
        >
          Очистить
        </button>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            Очередь ({queue.length} задач)
          </div>
          {queue.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#374151', fontSize: '13px', background: '#111827', borderRadius: '6px' }}>
              Очередь пуста
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {queue.map((task, i) => {
                const color = PRIORITY_COLORS[task.priority]
                const isOverdue = task.expirationTime !== Infinity && task.expirationTime < now
                return (
                  <div
                    key={task.id}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      background: '#1f2937',
                      border: `1px solid ${color}44`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{ fontSize: '11px', color: '#4b5563', minWidth: '18px' }}>#{i + 1}</div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#e5e7eb' }}>{task.label}</div>
                      <div style={{ fontSize: '11px', color: isOverdue ? '#ef4444' : '#6b7280', marginTop: '2px' }}>
                        {formatTimeLeft(task.expirationTime)}
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '3px', background: `${color}22`, color }}>
                      {task.priority}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
            Лог обработанных ({log.length})
          </div>
          {log.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#374151', fontSize: '13px', background: '#111827', borderRadius: '6px' }}>
              Пока ничего не обработано
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {log.map(entry => {
                const color = PRIORITY_COLORS[entry.priority]
                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: '#0d1117',
                      border: `1px solid ${color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    <span style={{ color: '#34d399' }}>✓</span>
                    <span style={{ color: '#e5e7eb', flex: 1 }}>{entry.label}</span>
                    <span style={{ color: '#4b5563', fontSize: '11px' }}>
                      {new Date(entry.processedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '16px', padding: '12px', background: '#111827', borderRadius: '6px', fontSize: '12px', color: '#6b7280', lineHeight: 1.7 }}>
        <strong style={{ color: '#9ca3af' }}>Как это работает: </strong>
        Sync обрабатывается мгновенно (не попадает в очередь).
        Остальные ждут в очереди, отсортированной по expirationTime.
        Через setTimeout с таймаутом приоритета — задача обрабатывается.
      </div>
    </div>
  )
}

// ─── Task 2.3: Time Slicing Demo ──────────────────────────────────────────────

type RenderMode = 'sync' | 'chunked'

type RenderResult = {
  mode: RenderMode
  time: number
  frameDrops: number
  minFps: number
}

const TOTAL_ITEMS = 10000
const CHUNK_SIZE = 100

function expensiveLabel(i: number): string {
  return `Item #${i.toString().padStart(5, '0')}: ${'■'.repeat(30)}`
}

export function Task2_3_Solution() {
  const [items, setItems] = useState<string[]>([])
  const [isRendering, setIsRendering] = useState(false)
  const [currentMode, setCurrentMode] = useState<RenderMode | null>(null)
  const [progress, setProgress] = useState(0)
  const [fps, setFps] = useState<number | null>(null)
  const [results, setResults] = useState<RenderResult[]>([])

  const rafRef = useRef<number | null>(null)
  const frameDropsRef = useRef(0)
  const minFpsRef = useRef(Infinity)
  const lastTimeRef = useRef(0)
  const startTimeRef = useRef(0)
  const isMeasuringRef = useRef(false)

  const startMeasuring = useCallback(() => {
    frameDropsRef.current = 0
    minFpsRef.current = Infinity
    lastTimeRef.current = performance.now()
    startTimeRef.current = performance.now()
    isMeasuringRef.current = true

    function measureFrame(time: number) {
      if (!isMeasuringRef.current) return
      const elapsed = time - lastTimeRef.current
      if (elapsed > 1) {
        const currentFps = Math.round(1000 / elapsed)
        if (elapsed > 33) frameDropsRef.current++
        if (currentFps > 0 && currentFps < minFpsRef.current) minFpsRef.current = currentFps
        setFps(currentFps)
      }
      lastTimeRef.current = time
      rafRef.current = requestAnimationFrame(measureFrame)
    }
    rafRef.current = requestAnimationFrame(measureFrame)
  }, [])

  const stopMeasuring = useCallback((): { time: number; frameDrops: number; minFps: number } => {
    isMeasuringRef.current = false
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    return {
      time: Math.round(performance.now() - startTimeRef.current),
      frameDrops: frameDropsRef.current,
      minFps: minFpsRef.current === Infinity ? 60 : minFpsRef.current,
    }
  }, [])

  const runSync = useCallback(() => {
    if (isRendering) return
    setIsRendering(true)
    setCurrentMode('sync')
    setItems([])
    setProgress(0)
    setFps(null)

    startMeasuring()

    setTimeout(() => {
      const all = Array.from({ length: TOTAL_ITEMS }, (_, i) => expensiveLabel(i))
      setItems(all)
      setProgress(TOTAL_ITEMS)

      requestAnimationFrame(() => {
        const stats = stopMeasuring()
        setResults(r => [...r.filter(x => x.mode !== 'sync'), { mode: 'sync', ...stats }])
        setIsRendering(false)
        setFps(null)
      })
    }, 100)
  }, [isRendering, startMeasuring, stopMeasuring])

  const runChunked = useCallback(() => {
    if (isRendering) return
    setIsRendering(true)
    setCurrentMode('chunked')
    setItems([])
    setProgress(0)
    setFps(null)

    startMeasuring()

    let rendered = 0

    function renderNextChunk() {
      const chunk: string[] = []
      const end = Math.min(rendered + CHUNK_SIZE, TOTAL_ITEMS)
      for (let i = rendered; i < end; i++) {
        chunk.push(expensiveLabel(i))
      }
      rendered = end
      setItems(prev => [...prev, ...chunk])
      setProgress(rendered)

      if (rendered < TOTAL_ITEMS) {
        setTimeout(renderNextChunk, 0)
      } else {
        requestAnimationFrame(() => {
          const stats = stopMeasuring()
          setResults(r => [...r.filter(x => x.mode !== 'chunked'), { mode: 'chunked', ...stats }])
          setIsRendering(false)
          setFps(null)
        })
      }
    }

    setTimeout(renderNextChunk, 100)
  }, [isRendering, startMeasuring, stopMeasuring])

  const syncResult = results.find(r => r.mode === 'sync')
  const chunkedResult = results.find(r => r.mode === 'chunked')

  return (
    <div className="exercise-container">
      <h2>Задание 2.3: Time Slicing Demo</h2>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          onClick={runSync}
          disabled={isRendering}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: isRendering ? '#374151' : '#ef4444',
            color: isRendering ? '#6b7280' : '#fff',
            cursor: isRendering ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Синхронный рендер
        </button>
        <button
          onClick={runChunked}
          disabled={isRendering}
          style={{
            padding: '10px 20px',
            borderRadius: '6px',
            border: 'none',
            background: isRendering ? '#374151' : '#10b981',
            color: isRendering ? '#6b7280' : '#fff',
            cursor: isRendering ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          Chunked рендер
        </button>

        {isRendering && (
          <div style={{ fontSize: '13px', display: 'flex', gap: '16px' }}>
            <span style={{ color: '#9ca3af' }}>
              Режим: <strong style={{ color: currentMode === 'sync' ? '#ef4444' : '#10b981' }}>
                {currentMode}
              </strong>
            </span>
            {fps !== null && (
              <span style={{ color: fps < 30 ? '#ef4444' : '#34d399' }}>
                FPS: {fps}
              </span>
            )}
          </div>
        )}
      </div>

      {isRendering && currentMode === 'chunked' && (
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
            <span>Прогресс</span>
            <span>{progress} / {TOTAL_ITEMS}</span>
          </div>
          <div style={{ height: '6px', background: '#1f2937', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(progress / TOTAL_ITEMS) * 100}%`,
                background: '#10b981',
                borderRadius: '3px',
                transition: 'width 0.1s',
              }}
            />
          </div>
        </div>
      )}

      {(syncResult || chunkedResult) && (
        <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { result: syncResult, label: 'Синхронный', color: '#ef4444' },
            { result: chunkedResult, label: 'Chunked', color: '#10b981' },
          ].map(({ result, label, color }) =>
            result ? (
              <div
                key={label}
                style={{
                  flex: 1,
                  minWidth: '180px',
                  padding: '14px',
                  borderRadius: '8px',
                  background: '#1f2937',
                  border: `1px solid ${color}44`,
                }}
              >
                <div style={{ fontSize: '12px', color, marginBottom: '10px', fontWeight: 700 }}>{label}</div>
                {(
                  [
                    ['Время рендера', `${result.time}ms`],
                    ['Frame drops', `${result.frameDrops}`],
                    ['Min FPS', `${result.minFps}`],
                  ] as [string, string][]
                ).map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span style={{ color: '#6b7280' }}>{k}</span>
                    <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      )}

      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px' }}>
        Список ({items.length} / {TOTAL_ITEMS} элементов)
      </div>
      <div
        style={{
          height: '200px',
          overflowY: 'auto',
          background: '#0d1117',
          borderRadius: '6px',
          padding: '8px',
          fontFamily: 'monospace',
          fontSize: '11px',
        }}
      >
        {items.slice(0, 200).map((item, i) => (
          <div key={i} style={{ color: '#4b5563', lineHeight: 1.6 }}>{item}</div>
        ))}
        {items.length > 200 && (
          <div style={{ color: '#374151', fontStyle: 'italic' }}>...и ещё {items.length - 200} элементов</div>
        )}
      </div>

      <div style={{ marginTop: '12px', padding: '10px 14px', background: '#111827', borderRadius: '6px', fontSize: '12px', color: '#6b7280', lineHeight: 1.7 }}>
        <strong style={{ color: '#9ca3af' }}>Что наблюдать: </strong>
        При синхронном рендере браузер "замораживается" — не может нарисовать кадр, пока JS не завершит цикл.
        При chunked — каждый setTimeout освобождает поток, браузер успевает отрисовать кадры.
      </div>
    </div>
  )
}
