import { useState, useRef, useCallback, useEffect } from 'react'

// ============================================
// Task 14.1 Solution: File Uploader
// Async pool + AbortController + retry + Promise combinators
// ============================================

type FileStatus = 'pending' | 'uploading' | 'retrying' | 'completed' | 'cancelled' | 'failed'

interface SimFile {
  id: string
  name: string
  size: number
  status: FileStatus
  progress: number
  retries: number
  abortController?: AbortController
}

const FILE_NAMES = [
  'photo_vacation.jpg',
  'report_q4.pdf',
  'backup_2024.zip',
  'presentation.pptx',
  'video_intro.mp4',
  'data_export.csv',
  'logo_hires.png',
  'contract_signed.pdf',
  'music_track.mp3',
  'source_code.tar.gz',
]

function generateFiles(count: number): SimFile[] {
  const shuffled = [...FILE_NAMES].sort(() => Math.random() - 0.5).slice(0, count)
  return shuffled.map((name, i) => ({
    id: `file-${Date.now()}-${i}`,
    name,
    size: Math.floor(Math.random() * 9000 + 1000),
    status: 'pending' as FileStatus,
    progress: 0,
    retries: 0,
  }))
}

async function simulateUpload(
  file: SimFile,
  signal: AbortSignal,
  onProgress: (p: number) => void
): Promise<void> {
  const steps = 20
  const stepDelay = file.size / 80

  for (let i = 1; i <= steps; i++) {
    if (signal.aborted) {
      throw new DOMException('Upload cancelled', 'AbortError')
    }
    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, stepDelay)
      signal.addEventListener('abort', () => {
        clearTimeout(t)
        reject(new DOMException('Upload cancelled', 'AbortError'))
      }, { once: true })
    })
    onProgress(Math.round((i / steps) * 100))
  }

  // ~20% chance of failure (for retry demo)
  if (Math.random() < 0.2) {
    throw new Error('Network error: connection reset')
  }
}

async function uploadWithRetry(
  file: SimFile,
  signal: AbortSignal,
  onProgress: (p: number) => void,
  onStatusChange: (status: FileStatus) => void,
  maxRetries = 3
): Promise<void> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (signal.aborted) throw new DOMException('Cancelled', 'AbortError')

    if (attempt > 0) {
      onStatusChange('retrying')
      // Exponential backoff: 500ms, 1000ms, 2000ms
      await new Promise<void>((resolve, reject) => {
        const delay = 500 * Math.pow(2, attempt - 1)
        const t = setTimeout(resolve, delay)
        signal.addEventListener('abort', () => {
          clearTimeout(t)
          reject(new DOMException('Cancelled', 'AbortError'))
        }, { once: true })
      })
    } else {
      onStatusChange('uploading')
    }

    try {
      await simulateUpload(file, signal, onProgress)
      return // success
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') throw err
      if (attempt === maxRetries) throw err
      // retry
    }
  }
}

async function asyncPool<T>(
  limit: number,
  items: T[],
  task: (item: T, index: number) => Promise<void>
): Promise<void> {
  const executing = new Set<Promise<void>>()
  for (let i = 0; i < items.length; i++) {
    const p = task(items[i], i).finally(() => executing.delete(p))
    executing.add(p)
    if (executing.size >= limit) {
      await Promise.race(executing)
    }
  }
  await Promise.all(executing)
}

export function Task14_1_Solution() {
  const [files, setFiles] = useState<SimFile[]>([])
  const [concurrency, setConcurrency] = useState(2)
  const [isUploading, setIsUploading] = useState(false)
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const globalAbortRef = useRef<AbortController | null>(null)

  const updateFile = useCallback((id: string, patch: Partial<SimFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...patch } : f))
  }, [])

  const addFiles = () => {
    const count = Math.floor(Math.random() * 6) + 5
    const newFiles = generateFiles(count)
    setFiles(prev => [...prev, ...newFiles])
  }

  const cancelFile = (id: string) => {
    const ctrl = abortControllersRef.current.get(id)
    if (ctrl) ctrl.abort()
  }

  const cancelAll = () => {
    globalAbortRef.current?.abort()
    abortControllersRef.current.forEach(ctrl => ctrl.abort())
  }

  const startUpload = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'failed')
    if (pendingFiles.length === 0) return

    setIsUploading(true)
    const globalCtrl = new AbortController()
    globalAbortRef.current = globalCtrl

    await asyncPool(concurrency, pendingFiles, async (file) => {
      if (globalCtrl.signal.aborted) return

      const ctrl = new AbortController()
      abortControllersRef.current.set(file.id, ctrl)

      // Link global abort to this file's abort
      globalCtrl.signal.addEventListener('abort', () => ctrl.abort(), { once: true })

      try {
        await uploadWithRetry(
          file,
          ctrl.signal,
          (progress) => updateFile(file.id, { progress }),
          (status) => updateFile(file.id, { status }),
        )
        updateFile(file.id, { status: 'completed', progress: 100 })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          updateFile(file.id, { status: 'cancelled', progress: 0 })
        } else {
          updateFile(file.id, { status: 'failed', progress: 0 })
        }
      } finally {
        abortControllersRef.current.delete(file.id)
      }
    })

    setIsUploading(false)
  }

  const clearAll = () => {
    if (isUploading) cancelAll()
    setFiles([])
  }

  const completed = files.filter(f => f.status === 'completed').length
  const total = files.length

  const statusColor: Record<FileStatus, string> = {
    pending: '#64748b',
    uploading: '#3b82f6',
    retrying: '#f59e0b',
    completed: '#10b981',
    cancelled: '#6b7280',
    failed: '#ef4444',
  }

  const statusLabel: Record<FileStatus, string> = {
    pending: 'ожидание',
    uploading: 'загрузка',
    retrying: 'повтор',
    completed: 'готово',
    cancelled: 'отменён',
    failed: 'ошибка',
  }

  const s = {
    container: {
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '1.5rem',
      borderRadius: '12px',
      fontFamily: "'Fira Code', monospace",
      fontSize: '0.9rem',
    } as React.CSSProperties,
    card: {
      background: '#1e293b',
      borderRadius: '8px',
      padding: '0.75rem 1rem',
      marginBottom: '0.5rem',
    } as React.CSSProperties,
    btn: (color: string, disabled?: boolean): React.CSSProperties => ({
      padding: '0.45rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#1e293b' : color,
      color: disabled ? '#475569' : '#fff',
      fontFamily: 'inherit',
      fontSize: '0.82rem',
    }),
  }

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 14.1 — Загрузчик файлов
      </h2>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.6rem 1rem', flex: 1, minWidth: '200px' }}>
          <label style={{ color: '#94a3b8', fontSize: '0.8rem', display: 'block', marginBottom: '0.3rem' }}>
            Конкурентность: <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{concurrency}</span>
          </label>
          <input
            type="range" min={1} max={5} value={concurrency}
            onChange={e => setConcurrency(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#3b82f6' }}
            disabled={isUploading}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button style={s.btn('#6366f1', isUploading)} onClick={addFiles} disabled={isUploading}>
            + Добавить файлы
          </button>
          <button
            style={s.btn('#059669', isUploading || files.filter(f => f.status === 'pending' || f.status === 'failed').length === 0)}
            onClick={startUpload}
            disabled={isUploading || files.filter(f => f.status === 'pending' || f.status === 'failed').length === 0}
          >
            {isUploading ? 'Загрузка...' : 'Начать загрузку'}
          </button>
          <button style={s.btn('#dc2626', !isUploading)} onClick={cancelAll} disabled={!isUploading}>
            Отменить все
          </button>
          <button style={s.btn('#374151')} onClick={clearAll}>
            Очистить
          </button>
        </div>
      </div>

      {/* Summary */}
      {total > 0 && (
        <div style={{ ...s.card, marginBottom: '1rem', borderLeft: '3px solid #3b82f6' }}>
          <span style={{ color: '#60a5fa' }}>Прогресс: </span>
          <span style={{ color: '#f8fafc', fontWeight: 'bold' }}>{completed} из {total}</span>
          <span style={{ color: '#64748b' }}> файлов загружено</span>
          {isUploading && (
            <span style={{ marginLeft: '1rem', color: '#f59e0b', fontSize: '0.78rem' }}>
              конкурентность: {concurrency} одновременных
            </span>
          )}
        </div>
      )}

      {/* File list */}
      <div style={{ maxHeight: '360px', overflowY: 'auto', paddingRight: '4px' }}>
        {files.length === 0 ? (
          <div style={{ color: '#475569', textAlign: 'center', padding: '2rem', fontSize: '0.85rem' }}>
            Нажмите "+ Добавить файлы" чтобы добавить симулированные файлы
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
                  <span style={{ color: '#94a3b8', fontSize: '0.78rem', flexShrink: 0 }}>
                    {file.name.split('.').pop()?.toUpperCase()}
                  </span>
                  <span style={{ color: '#e2e8f0', fontSize: '0.82rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {file.name}
                  </span>
                  <span style={{ color: '#475569', fontSize: '0.72rem', flexShrink: 0 }}>
                    {(file.size / 1000).toFixed(1)} MB
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  <span style={{
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    fontSize: '0.7rem',
                    background: statusColor[file.status] + '20',
                    color: statusColor[file.status],
                    fontWeight: 'bold',
                  }}>
                    {statusLabel[file.status]}
                    {file.status === 'retrying' && ` (попытка ${file.retries + 1})`}
                  </span>
                  {(file.status === 'uploading' || file.status === 'retrying') && (
                    <button
                      style={{ ...s.btn('#374151'), padding: '0.15rem 0.5rem', fontSize: '0.7rem' }}
                      onClick={() => cancelFile(file.id)}
                    >
                      Отменить
                    </button>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ background: '#0f172a', borderRadius: '999px', height: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${file.progress}%`,
                  background: statusColor[file.status],
                  transition: 'width 0.1s ease',
                  borderRadius: '999px',
                }} />
              </div>
              {file.progress > 0 && file.status !== 'completed' && (
                <div style={{ color: '#475569', fontSize: '0.7rem', marginTop: '0.25rem', textAlign: 'right' }}>
                  {file.progress}%
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem', fontSize: '0.72rem' }}>
        {(Object.entries(statusLabel) as [FileStatus, string][]).map(([key, label]) => (
          <span key={key} style={{ color: statusColor[key] }}>
            ● {label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Task 14.2 Solution: Async State Machine
// async/await + AbortController + retry + generators
// ============================================

type OrderState =
  | 'idle'
  | 'loading'
  | 'confirmation'
  | 'payment'
  | 'processing'
  | 'done'
  | 'error'

interface Transition {
  from: OrderState
  to: OrderState
  timestamp: number
  duration: number
  attempt?: number
}

const STATE_LABELS: Record<OrderState, string> = {
  idle: 'Ожидание',
  loading: 'Загрузка данных',
  confirmation: 'Подтверждение',
  payment: 'Оплата',
  processing: 'Обработка',
  done: 'Выполнено',
  error: 'Ошибка',
}

const STATE_COLORS: Record<OrderState, string> = {
  idle: '#64748b',
  loading: '#3b82f6',
  confirmation: '#8b5cf6',
  payment: '#f59e0b',
  processing: '#6366f1',
  done: '#10b981',
  error: '#ef4444',
}

const PIPELINE: Exclude<OrderState, 'idle' | 'done' | 'error'>[] = [
  'loading',
  'confirmation',
  'payment',
  'processing',
]

const STEP_DELAYS: Record<string, number> = {
  loading: 1200,
  confirmation: 800,
  payment: 1500,
  processing: 1000,
}

// Failure probability per step (for retry demo)
const STEP_FAIL_PROB: Record<string, number> = {
  loading: 0.15,
  confirmation: 0.1,
  payment: 0.2,
  processing: 0.1,
}

async function runStep(
  step: string,
  signal: AbortSignal,
  attempt: number
): Promise<void> {
  const delay = STEP_DELAYS[step] ?? 1000
  await new Promise<void>((resolve, reject) => {
    const t = setTimeout(() => {
      if (Math.random() < (STEP_FAIL_PROB[step] ?? 0)) {
        reject(new Error(`${step} failed (attempt ${attempt + 1})`))
      } else {
        resolve()
      }
    }, delay)
    signal.addEventListener('abort', () => {
      clearTimeout(t)
      reject(new DOMException('Cancelled', 'AbortError'))
    }, { once: true })
  })
}

export function Task14_2_Solution() {
  const [currentState, setCurrentState] = useState<OrderState>('idle')
  const [transitions, setTransitions] = useState<Transition[]>([])
  const [completedSteps, setCompletedSteps] = useState<Set<OrderState>>(new Set())
  const abortRef = useRef<AbortController | null>(null)
  const stepStartRef = useRef<number>(0)

  const addTransition = (from: OrderState, to: OrderState, attempt?: number) => {
    const duration = Date.now() - stepStartRef.current
    setTransitions(prev => [
      ...prev,
      { from, to, timestamp: Date.now(), duration, attempt },
    ])
    stepStartRef.current = Date.now()
  }

  const startOrder = async () => {
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setTransitions([])
    setCompletedSteps(new Set())
    stepStartRef.current = Date.now()

    let prev: OrderState = 'idle'
    setCurrentState('loading')
    addTransition('idle', 'loading')

    for (const step of PIPELINE) {
      let succeeded = false
      for (let attempt = 0; attempt < 3; attempt++) {
        if (ctrl.signal.aborted) return
        try {
          await runStep(step, ctrl.signal, attempt)
          succeeded = true
          break
        } catch (err) {
          if (err instanceof DOMException && err.name === 'AbortError') return
          if (attempt < 2) {
            // retry
            const retryState = step
            setCurrentState(retryState)
            addTransition(prev, retryState, attempt)
          } else {
            setCurrentState('error')
            addTransition(prev, 'error')
            return
          }
        }
      }

      if (!succeeded) return

      const nextIndex = PIPELINE.indexOf(step)
      const nextStep = PIPELINE[nextIndex + 1] ?? 'done'
      setCurrentState(nextStep as OrderState)
      addTransition(step as OrderState, nextStep as OrderState)
      setCompletedSteps(prev => new Set([...prev, step as OrderState]))
      prev = step as OrderState
    }

    setCurrentState('done')
    setCompletedSteps(prev => new Set([...prev, 'processing' as OrderState]))
  }

  const cancelOrder = () => {
    abortRef.current?.abort()
    setCurrentState('idle')
    setTransitions([])
    setCompletedSteps(new Set())
  }

  const s = {
    container: {
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '1.5rem',
      borderRadius: '12px',
      fontFamily: "'Fira Code', monospace",
      fontSize: '0.9rem',
    } as React.CSSProperties,
    btn: (color: string, disabled?: boolean): React.CSSProperties => ({
      padding: '0.5rem 1.2rem',
      borderRadius: '6px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#1e293b' : color,
      color: disabled ? '#475569' : '#fff',
      fontFamily: 'inherit',
      fontSize: '0.85rem',
    }),
  }

  const allStates: OrderState[] = ['idle', ...PIPELINE, 'done']
  const isActive = currentState !== 'idle' && currentState !== 'done' && currentState !== 'error'

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 14.2 — Async State Machine
      </h2>

      {/* State diagram */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.75rem' }}>PIPELINE СОСТОЯНИЙ</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', flexWrap: 'wrap' }}>
          {allStates.map((state, idx) => {
            const isCurrentState = currentState === state
            const isDone = completedSteps.has(state)
            const isError = currentState === 'error'
            return (
              <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  background: isCurrentState
                    ? STATE_COLORS[state] + '30'
                    : isDone
                    ? '#052e16'
                    : '#0f172a',
                  border: `2px solid ${isCurrentState ? STATE_COLORS[state] : isDone ? '#10b981' : '#1e3a5f'}`,
                  color: isCurrentState ? STATE_COLORS[state] : isDone ? '#10b981' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: isCurrentState ? 'bold' : 'normal',
                  transition: 'all 0.3s',
                  boxShadow: isCurrentState ? `0 0 12px ${STATE_COLORS[state]}40` : 'none',
                  whiteSpace: 'nowrap',
                }}>
                  {isCurrentState && '▶ '}{STATE_LABELS[state]}
                  {isDone && ' ✓'}
                </div>
                {idx < allStates.length - 1 && (
                  <div style={{
                    color: '#334155',
                    fontSize: '1rem',
                    padding: '0 0.25rem',
                    flexShrink: 0,
                  }}>→</div>
                )}
              </div>
            )
          })}
          {currentState === 'error' && (
            <div style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              background: '#450a0a',
              border: '2px solid #ef4444',
              color: '#ef4444',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              marginLeft: '0.5rem',
            }}>
              ✕ Ошибка
            </div>
          )}
        </div>
      </div>

      {/* Current status card */}
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1rem',
        borderLeft: `4px solid ${STATE_COLORS[currentState]}`,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        {isActive && (
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            border: `2px solid ${STATE_COLORS[currentState]}`,
            borderTopColor: 'transparent',
            animation: 'spin 0.8s linear infinite',
            flexShrink: 0,
          }} />
        )}
        <div>
          <div style={{ color: STATE_COLORS[currentState], fontWeight: 'bold', fontSize: '1rem' }}>
            {STATE_LABELS[currentState]}
          </div>
          <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: '0.2rem' }}>
            {currentState === 'idle' && 'Нажмите "Оформить заказ" для начала'}
            {currentState === 'done' && 'Заказ успешно оформлен! Поздравляем.'}
            {currentState === 'error' && 'Превышено число попыток. Попробуйте снова.'}
            {isActive && `Выполняется... (автоматический retry до 2 раз при ошибке)`}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          style={s.btn('#059669', isActive)}
          onClick={startOrder}
          disabled={isActive}
        >
          Оформить заказ
        </button>
        <button
          style={s.btn('#dc2626', !isActive)}
          onClick={cancelOrder}
          disabled={!isActive}
        >
          Отменить
        </button>
      </div>

      {/* Transition log */}
      {transitions.length > 0 && (
        <div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>ЛОГ ПЕРЕХОДОВ</div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
            {transitions.map((tr, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: '0.5rem',
                alignItems: 'center',
                fontSize: '0.78rem',
                padding: '0.2rem 0',
                borderBottom: i < transitions.length - 1 ? '1px solid #0f172a' : 'none',
              }}>
                <span style={{ color: '#475569', fontSize: '0.7rem', minWidth: '70px' }}>
                  {new Date(tr.timestamp).toLocaleTimeString('ru', { hour12: false })}
                </span>
                <span style={{ color: STATE_COLORS[tr.from] }}>{STATE_LABELS[tr.from]}</span>
                <span style={{ color: '#334155' }}>→</span>
                <span style={{ color: STATE_COLORS[tr.to] }}>{STATE_LABELS[tr.to]}</span>
                <span style={{ color: '#475569', marginLeft: 'auto', fontSize: '0.7rem' }}>
                  {tr.duration}ms
                  {tr.attempt != null && tr.attempt > 0 && (
                    <span style={{ color: '#f59e0b', marginLeft: '0.35rem' }}>
                      (retry #{tr.attempt})
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// ============================================
// Task 14.3 Solution: Real-time Dashboard
// async generators + Web Workers + rAF + AbortController
// ============================================

interface Metric {
  cpu: number
  memory: number
  rps: number
  timestamp: number
}

interface AggregatedMetric {
  current: number
  min: number
  max: number
  avg: number
  history: number[]
}

interface DashboardStats {
  cpu: AggregatedMetric
  memory: AggregatedMetric
  rps: AggregatedMetric
}

function emptyAgg(): AggregatedMetric {
  return { current: 0, min: 100, max: 0, avg: 0, history: [] }
}

// Web Worker code for metric aggregation
const WORKER_CODE = `
self.onmessage = function(e) {
  var metrics = e.data.metrics
  var key = e.data.key

  var values = metrics.map(function(m) { return m[key] })
  var min = Math.min.apply(null, values)
  var max = Math.max.apply(null, values)
  var avg = values.reduce(function(a, b) { return a + b }, 0) / values.length

  self.postMessage({
    key: key,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    avg: Math.round(avg * 10) / 10,
    history: values.slice(-60)
  })
}
`

function createWorker(): Worker {
  const blob = new Blob([WORKER_CODE], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)
  URL.revokeObjectURL(url)
  return worker
}

// Async generator producing metric snapshots every 200ms
async function* metricStream(signal: AbortSignal): AsyncGenerator<Metric> {
  let cpu = 40 + Math.random() * 20
  let memory = 50 + Math.random() * 15
  let rps = 80 + Math.random() * 40

  while (!signal.aborted) {
    // Smooth random walk
    cpu = Math.max(5, Math.min(95, cpu + (Math.random() - 0.5) * 8))
    memory = Math.max(20, Math.min(90, memory + (Math.random() - 0.5) * 4))
    rps = Math.max(10, Math.min(200, rps + (Math.random() - 0.5) * 20))

    yield {
      cpu: Math.round(cpu * 10) / 10,
      memory: Math.round(memory * 10) / 10,
      rps: Math.round(rps * 10) / 10,
      timestamp: Date.now(),
    }

    await new Promise<void>((resolve, reject) => {
      const t = setTimeout(resolve, 200)
      signal.addEventListener('abort', () => { clearTimeout(t); reject() }, { once: true })
    })
  }
}

function SparklineSVG({ history, color, label, current, min, max, avg }: {
  history: number[]
  color: string
  label: string
  current: number
  min: number
  max: number
  avg: number
}) {
  const width = 200
  const height = 50
  const maxVal = Math.max(...history, 1)
  const minVal = Math.min(...history, 0)
  const range = maxVal - minVal || 1

  const points = history.slice(-60).map((v, i, arr) => {
    const x = (i / Math.max(arr.length - 1, 1)) * width
    const y = height - ((v - minVal) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', flex: '1 1 180px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>{label}</span>
        <span style={{ color, fontWeight: 'bold', fontSize: '1.1rem' }}>{current}</span>
      </div>
      <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
        {history.length > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        {/* Avg line */}
        {history.length > 1 && (
          <line
            x1={0}
            y1={height - ((avg - minVal) / range) * height}
            x2={width}
            y2={height - ((avg - minVal) / range) * height}
            stroke={color + '40'}
            strokeWidth="1"
            strokeDasharray="3,3"
          />
        )}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#475569', marginTop: '0.25rem' }}>
        <span>min: <span style={{ color: '#6ee7b7' }}>{min}</span></span>
        <span>avg: <span style={{ color: '#fbbf24' }}>{avg}</span></span>
        <span>max: <span style={{ color: '#f87171' }}>{max}</span></span>
      </div>
    </div>
  )
}

export function Task14_3_Solution() {
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    cpu: emptyAgg(),
    memory: emptyAgg(),
    rps: emptyAgg(),
  })
  const [fps, setFps] = useState(0)
  const [frameCount, setFrameCount] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const workerRef = useRef<Worker | null>(null)
  const rafRef = useRef<number>(0)
  const pendingMetricsRef = useRef<Metric[]>([])
  const pausedRef = useRef(false)
  const fpsCounterRef = useRef({ frames: 0, lastTime: performance.now() })
  const statsRef = useRef<DashboardStats>({
    cpu: emptyAgg(),
    memory: emptyAgg(),
    rps: emptyAgg(),
  })

  // rAF loop: apply pending metrics to display
  const rafLoop = useCallback(() => {
    // FPS measurement
    const now = performance.now()
    fpsCounterRef.current.frames++
    if (now - fpsCounterRef.current.lastTime >= 1000) {
      setFps(fpsCounterRef.current.frames)
      fpsCounterRef.current = { frames: 0, lastTime: now }
    }

    // Apply pending data from worker
    if (pendingMetricsRef.current.length > 0 && !pausedRef.current) {
      const latest = pendingMetricsRef.current.splice(0)
      const last = latest[latest.length - 1]
      if (last) {
        const prev = statsRef.current
        const updateMetric = (prev: AggregatedMetric, value: number): AggregatedMetric => ({
          current: value,
          min: Math.min(prev.min, value),
          max: Math.max(prev.max, value),
          avg: prev.avg * 0.9 + value * 0.1,
          history: [...prev.history.slice(-29), value],
        })
        statsRef.current = {
          cpu: updateMetric(prev.cpu, last.cpu),
          memory: updateMetric(prev.memory, last.memory),
          rps: updateMetric(prev.rps, last.rps),
        }
      }
      setStats({ ...statsRef.current })
      setFrameCount(c => c + latest.length)
    }

    rafRef.current = requestAnimationFrame(rafLoop)
  }, [])

  const start = useCallback(() => {
    if (abortRef.current) return

    const ctrl = new AbortController()
    abortRef.current = ctrl
    pausedRef.current = false
    setIsRunning(true)
    setIsPaused(false)
    setFrameCount(0)
    statsRef.current = { cpu: emptyAgg(), memory: emptyAgg(), rps: emptyAgg() }

    // Create worker
    const worker = createWorker()
    workerRef.current = worker

    worker.onmessage = (e: MessageEvent) => {
      const { key, min, max, avg, history } = e.data as {
        key: keyof DashboardStats
        min: number
        max: number
        avg: number
        history: number[]
      }
      statsRef.current = {
        ...statsRef.current,
        [key]: {
          ...statsRef.current[key],
          min,
          max,
          avg,
          history,
        },
      }
    }

    // Start rAF loop
    fpsCounterRef.current = { frames: 0, lastTime: performance.now() }
    rafRef.current = requestAnimationFrame(rafLoop)

    // Async generator pipeline
    ;(async () => {
      try {
        for await (const metric of metricStream(ctrl.signal)) {
          if (pausedRef.current) continue

          // Update current values immediately
          statsRef.current = {
            cpu: { ...statsRef.current.cpu, current: metric.cpu },
            memory: { ...statsRef.current.memory, current: metric.memory },
            rps: { ...statsRef.current.rps, current: metric.rps },
          }

          pendingMetricsRef.current.push(metric)

          // Send batch to worker for aggregation (every 5 metrics)
          if (pendingMetricsRef.current.length % 5 === 0) {
            const batch = pendingMetricsRef.current.slice(-30)
            worker.postMessage({ metrics: batch, key: 'cpu' })
            worker.postMessage({ metrics: batch, key: 'memory' })
            worker.postMessage({ metrics: batch, key: 'rps' })
          }

          setStats({ ...statsRef.current })
        }
      } catch {
        // aborted
      }
    })()
  }, [rafLoop])

  const pause = () => {
    pausedRef.current = !pausedRef.current
    setIsPaused(p => !p)
  }

  const stop = useCallback(() => {
    abortRef.current?.abort()
    abortRef.current = null
    workerRef.current?.terminate()
    workerRef.current = null
    cancelAnimationFrame(rafRef.current)
    pendingMetricsRef.current = []
    pausedRef.current = false
    setIsRunning(false)
    setIsPaused(false)
  }, [])

  useEffect(() => {
    return () => stop()
  }, [stop])

  const s = {
    container: {
      background: '#0f172a',
      color: '#e2e8f0',
      padding: '1.5rem',
      borderRadius: '12px',
      fontFamily: "'Fira Code', monospace",
      fontSize: '0.9rem',
    } as React.CSSProperties,
    btn: (color: string, disabled?: boolean): React.CSSProperties => ({
      padding: '0.45rem 1rem',
      borderRadius: '6px',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? '#1e293b' : color,
      color: disabled ? '#475569' : '#fff',
      fontFamily: 'inherit',
      fontSize: '0.82rem',
    }),
  }

  return (
    <div className="exercise-container" style={s.container}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 14.3 — Real-time Dashboard
      </h2>

      {/* Architecture hint */}
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.75rem',
        color: '#64748b',
        borderLeft: '3px solid #6366f1',
      }}>
        <span style={{ color: '#818cf8' }}>Pipeline: </span>
        async generator (200ms) → main thread → Web Worker (aggregation) → rAF → SVG sparklines
      </div>

      {/* Controls + FPS */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button style={s.btn('#059669', isRunning)} onClick={start} disabled={isRunning}>
          Старт
        </button>
        <button style={s.btn('#f59e0b', !isRunning)} onClick={pause} disabled={!isRunning}>
          {isPaused ? 'Продолжить' : 'Пауза'}
        </button>
        <button style={s.btn('#dc2626', !isRunning)} onClick={stop} disabled={!isRunning}>
          Стоп
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isRunning && (
            <div style={{
              background: fps >= 55 ? '#052e16' : fps >= 30 ? '#422006' : '#450a0a',
              border: `1px solid ${fps >= 55 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444'}`,
              borderRadius: '6px',
              padding: '0.3rem 0.75rem',
              fontSize: '0.78rem',
            }}>
              <span style={{ color: '#64748b' }}>FPS: </span>
              <span style={{
                color: fps >= 55 ? '#10b981' : fps >= 30 ? '#f59e0b' : '#ef4444',
                fontWeight: 'bold',
              }}>{fps}</span>
            </div>
          )}
          {frameCount > 0 && (
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>
              {frameCount} метрик
            </span>
          )}
        </div>
      </div>

      {/* Status indicator */}
      {isRunning && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem',
          fontSize: '0.78rem',
          color: isPaused ? '#f59e0b' : '#10b981',
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isPaused ? '#f59e0b' : '#10b981',
            boxShadow: isPaused ? '0 0 6px #f59e0b' : '0 0 6px #10b981',
            animation: isPaused ? 'none' : 'pulse 1s ease-in-out infinite',
          }} />
          {isPaused ? 'Поток данных приостановлен' : 'Поток данных активен · 200ms интервал'}
        </div>
      )}

      {/* Sparkline charts */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <SparklineSVG
          label="CPU %"
          color="#3b82f6"
          current={stats.cpu.current}
          min={stats.cpu.min}
          max={stats.cpu.max}
          avg={stats.cpu.avg}
          history={stats.cpu.history}
        />
        <SparklineSVG
          label="Memory %"
          color="#8b5cf6"
          current={stats.memory.current}
          min={stats.memory.min}
          max={stats.memory.max}
          avg={stats.memory.avg}
          history={stats.memory.history}
        />
        <SparklineSVG
          label="Req/s"
          color="#f59e0b"
          current={stats.rps.current}
          min={stats.rps.min}
          max={stats.rps.max}
          avg={stats.rps.avg}
          history={stats.rps.history}
        />
      </div>

      {!isRunning && (
        <div style={{ color: '#334155', textAlign: 'center', padding: '1.5rem', fontSize: '0.82rem' }}>
          Нажмите "Старт" чтобы запустить поток метрик
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  )
}
