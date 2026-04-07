// ============================================
// Level 2: Job Lifecycle — Solutions
// ============================================

import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 2.1: Job State Machine
// ============================================

type JobState = 'created' | 'pending' | 'running' | 'success' | 'failed' | 'canceled' | 'skipped' | 'manual'

type EventType = 'queue' | 'start' | 'succeed' | 'fail' | 'cancel' | 'timeout' | 'trigger'

interface StateInfo {
  label: string
  icon: string
  color: string
  bg: string
  border: string
  description: string
}

interface LogEntry {
  time: string
  from: JobState
  to: JobState
  event: string
}

const STATE_INFO: Record<JobState, StateInfo> = {
  created: {
    label: 'Created',
    icon: '📋',
    color: '#555',
    bg: '#f5f5f5',
    border: '#ccc',
    description: 'Джоб создан, условия ещё не проверены',
  },
  pending: {
    label: 'Pending',
    icon: '🕐',
    color: '#6b5c00',
    bg: '#fffde7',
    border: '#f9c917',
    description: 'Джоб ждёт свободного раннера',
  },
  running: {
    label: 'Running',
    icon: '▶️',
    color: '#0d47a1',
    bg: '#e3f2fd',
    border: '#42a5f5',
    description: 'Раннер выполняет скрипт джоба',
  },
  success: {
    label: 'Success',
    icon: '✅',
    color: '#1b5e20',
    bg: '#e8f5e9',
    border: '#66bb6a',
    description: 'Скрипт завершился с exit code 0',
  },
  failed: {
    label: 'Failed',
    icon: '❌',
    color: '#b71c1c',
    bg: '#ffebee',
    border: '#ef5350',
    description: 'Скрипт завершился с ненулевым exit code',
  },
  canceled: {
    label: 'Canceled',
    icon: '🚫',
    color: '#e65100',
    bg: '#fff3e0',
    border: '#ffa726',
    description: 'Джоб отменён пользователем или системой',
  },
  skipped: {
    label: 'Skipped',
    icon: '⏭️',
    color: '#546e7a',
    bg: '#eceff1',
    border: '#90a4ae',
    description: 'Джоб пропущен по условию when',
  },
  manual: {
    label: 'Manual',
    icon: '👆',
    color: '#4a148c',
    bg: '#f3e5f5',
    border: '#ab47bc',
    description: 'Ожидает ручного запуска в UI',
  },
}

// Допустимые переходы: from → { event → to }
const TRANSITIONS: Record<JobState, Partial<Record<EventType, JobState>>> = {
  created: {
    queue: 'pending',
    trigger: 'manual',
    cancel: 'skipped',
  },
  pending: {
    start: 'running',
    cancel: 'canceled',
  },
  running: {
    succeed: 'success',
    fail: 'failed',
    cancel: 'canceled',
    timeout: 'failed',
  },
  success: {},
  failed: {
    queue: 'pending',
  },
  canceled: {},
  skipped: {},
  manual: {
    queue: 'pending',
    cancel: 'canceled',
  },
}

interface EventButton {
  event: EventType
  label: string
  color: string
}

const EVENT_BUTTONS: EventButton[] = [
  { event: 'queue', label: 'Queue', color: '#f9a825' },
  { event: 'start', label: 'Start', color: '#1565c0' },
  { event: 'succeed', label: 'Success', color: '#2e7d32' },
  { event: 'fail', label: 'Fail', color: '#c62828' },
  { event: 'cancel', label: 'Cancel', color: '#e65100' },
  { event: 'timeout', label: 'Timeout', color: '#6a1b9a' },
  { event: 'trigger', label: 'Manual trigger', color: '#4a148c' },
]

export function Task2_1_Solution() {
  const [state, setState] = useState<JobState>('created')
  const [log, setLog] = useState<LogEntry[]>([])

  function canTransition(event: EventType): boolean {
    return event in TRANSITIONS[state]
  }

  function applyEvent(event: EventType) {
    const nextState = TRANSITIONS[state][event]
    if (!nextState) return

    const entry: LogEntry = {
      time: new Date().toLocaleTimeString('ru-RU'),
      from: state,
      to: nextState,
      event,
    }
    setLog(prev => [entry, ...prev])
    setState(nextState)
  }

  function reset() {
    setState('created')
    setLog([])
  }

  const info = STATE_INFO[state]

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 700, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Задание 2.1: State Machine джоба</h2>

      {/* Current state display */}
      <div style={{
        padding: '1.5rem',
        borderRadius: 12,
        border: `2px solid ${info.border}`,
        backgroundColor: info.bg,
        marginBottom: '1.5rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{info.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: info.color, marginBottom: 4 }}>
          {info.label}
        </div>
        <div style={{ color: '#555', fontSize: 14 }}>{info.description}</div>
      </div>

      {/* All states overview */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {(Object.keys(STATE_INFO) as JobState[]).map(s => {
          const si = STATE_INFO[s]
          const isActive = s === state
          return (
            <div key={s} style={{
              padding: '4px 10px',
              borderRadius: 20,
              border: `1.5px solid ${isActive ? si.border : '#ddd'}`,
              backgroundColor: isActive ? si.bg : '#fafafa',
              color: isActive ? si.color : '#999',
              fontSize: 12,
              fontWeight: isActive ? 700 : 400,
              transition: 'all 0.2s',
            }}>
              {si.icon} {si.label}
            </div>
          )
        })}
      </div>

      {/* Event buttons */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>События (переходы):</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EVENT_BUTTONS.map(btn => {
            const enabled = canTransition(btn.event)
            return (
              <button
                key={btn.event}
                onClick={() => applyEvent(btn.event)}
                disabled={!enabled}
                style={{
                  padding: '8px 14px',
                  borderRadius: 8,
                  border: `2px solid ${enabled ? btn.color : '#ddd'}`,
                  backgroundColor: enabled ? btn.color : '#f5f5f5',
                  color: enabled ? '#fff' : '#bbb',
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: enabled ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                {btn.label}
              </button>
            )
          })}
          <button
            onClick={reset}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: '2px solid #90a4ae',
              backgroundColor: '#eceff1',
              color: '#546e7a',
              fontWeight: 600,
              fontSize: 13,
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transition log */}
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '8px 12px', backgroundColor: '#f5f5f5', fontSize: 13, color: '#555', fontWeight: 600 }}>
          Лог переходов {log.length > 0 && `(${log.length})`}
        </div>
        {log.length === 0 ? (
          <div style={{ padding: '12px', color: '#999', fontSize: 13, textAlign: 'center' }}>
            Нажми кнопку события, чтобы начать
          </div>
        ) : (
          <div style={{ maxHeight: 200, overflowY: 'auto' }}>
            {log.map((entry, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 12,
                padding: '6px 12px',
                fontSize: 13,
                backgroundColor: i === 0 ? '#f8f9ff' : 'transparent',
                borderBottom: '1px solid #f0f0f0',
                alignItems: 'center',
              }}>
                <span style={{ color: '#999', fontVariantNumeric: 'tabular-nums', minWidth: 60 }}>{entry.time}</span>
                <span style={{ color: STATE_INFO[entry.from].color, fontWeight: 600 }}>
                  {STATE_INFO[entry.from].icon} {entry.from}
                </span>
                <span style={{ color: '#999' }}>→</span>
                <span style={{ color: STATE_INFO[entry.to].color, fontWeight: 600 }}>
                  {STATE_INFO[entry.to].icon} {entry.to}
                </span>
                <span style={{ color: '#888', fontSize: 11, marginLeft: 'auto' }}>
                  [{entry.event}]
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// Task 2.2: allow_failure and when
// ============================================

type WhenOption = 'on_success' | 'on_failure' | 'always' | 'manual'
type PipelineJobStatus = 'pending' | 'running' | 'success' | 'failed' | 'warning' | 'skipped' | 'manual_wait'

interface PipelineJob {
  id: string
  name: string
  allowFailure: boolean
  when: WhenOption
}

interface PipelineJobState {
  id: string
  status: PipelineJobStatus
  message?: string
}

const INITIAL_JOBS: PipelineJob[] = [
  { id: 'lint', name: '1. lint', allowFailure: false, when: 'on_success' },
  { id: 'test', name: '2. test', allowFailure: false, when: 'on_success' },
  { id: 'coverage', name: '3. coverage', allowFailure: true, when: 'on_success' },
  { id: 'deploy', name: '4. deploy', allowFailure: false, when: 'on_success' },
]

const JOB_STATUS_STYLE: Record<PipelineJobStatus, { bg: string, border: string, color: string, label: string, icon: string }> = {
  pending: { bg: '#f5f5f5', border: '#ccc', color: '#555', label: 'Pending', icon: '🕐' },
  running: { bg: '#e3f2fd', border: '#42a5f5', color: '#0d47a1', label: 'Running', icon: '▶️' },
  success: { bg: '#e8f5e9', border: '#66bb6a', color: '#1b5e20', label: 'Success', icon: '✅' },
  failed: { bg: '#ffebee', border: '#ef5350', color: '#b71c1c', label: 'Failed', icon: '❌' },
  warning: { bg: '#fff8e1', border: '#ffb300', color: '#e65100', label: 'Warning', icon: '⚠️' },
  skipped: { bg: '#eceff1', border: '#90a4ae', color: '#546e7a', label: 'Skipped', icon: '⏭️' },
  manual_wait: { bg: '#f3e5f5', border: '#ab47bc', color: '#4a148c', label: 'Manual', icon: '👆' },
}

function computeJobStatus(
  job: PipelineJob,
  pipelineHasHardFail: boolean,
  pipelineHasAnyFail: boolean,
): PipelineJobStatus {
  if (job.when === 'manual') return 'manual_wait'
  if (job.when === 'always') return 'running'
  if (job.when === 'on_failure') {
    return pipelineHasHardFail ? 'running' : 'skipped'
  }
  // on_success: запускается если нет hard fail
  return pipelineHasHardFail ? 'skipped' : 'running'
}

export function Task2_2_Solution() {
  const [jobs, setJobs] = useState<PipelineJob[]>(INITIAL_JOBS)
  const [jobStates, setJobStates] = useState<PipelineJobState[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentJobIndex, setCurrentJobIndex] = useState(-1)
  const [pipelineFinished, setPipelineFinished] = useState(false)

  function updateJob(id: string, update: Partial<PipelineJob>) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...update } : j))
  }

  function pipelineResult(states: PipelineJobState[]): 'success' | 'failed' | null {
    if (states.length === 0) return null
    const hasFailed = states.some(s => s.status === 'failed')
    return hasFailed ? 'failed' : 'success'
  }

  async function runPipeline() {
    setIsRunning(true)
    setPipelineFinished(false)
    const states: PipelineJobState[] = []
    let hardFail = false
    let anyFail = false

    setJobStates([])
    setCurrentJobIndex(0)

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i]
      setCurrentJobIndex(i)

      // Determine what this job should do
      let resolvedStatus = computeJobStatus(job, hardFail, anyFail)

      // Set initial state for this job
      const initialState: PipelineJobState = { id: job.id, status: resolvedStatus }
      states.push(initialState)
      setJobStates([...states])

      if (resolvedStatus === 'skipped' || resolvedStatus === 'manual_wait') {
        await delay(400)
        continue
      }

      // "running" — wait for user to click success/fail
      await new Promise<void>(resolve => {
        const handler = (e: CustomEvent<{ id: string, result: 'success' | 'failed' }>) => {
          if (e.detail.id !== job.id) return
          window.removeEventListener('jobResult' as any, handler as any)

          const result = e.detail.result
          let finalStatus: PipelineJobStatus

          if (result === 'success') {
            finalStatus = 'success'
          } else {
            // failed
            if (job.allowFailure) {
              finalStatus = 'warning'
              anyFail = true
            } else {
              finalStatus = 'failed'
              hardFail = true
              anyFail = true
            }
          }

          states[i] = { id: job.id, status: finalStatus }
          setJobStates([...states])
          resolve()
        }
        window.addEventListener('jobResult', handler as any)
      })
    }

    setCurrentJobIndex(-1)
    setIsRunning(false)
    setPipelineFinished(true)
    setJobStates([...states])
  }

  function sendJobResult(id: string, result: 'success' | 'failed') {
    window.dispatchEvent(new CustomEvent('jobResult', { detail: { id, result } }))
  }

  function resetPipeline() {
    setJobStates([])
    setIsRunning(false)
    setCurrentJobIndex(-1)
    setPipelineFinished(false)
  }

  const result = pipelineResult(jobStates)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Задание 2.2: allow_failure и when</h2>

      {/* Job configurator */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 8, fontWeight: 600 }}>Конфигурация джобов:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {jobs.map((job, idx) => {
            const st = jobStates.find(s => s.id === job.id)
            const statusStyle = st ? JOB_STATUS_STYLE[st.status] : null
            const isCurrentlyRunning = st?.status === 'running' && isRunning && currentJobIndex === idx

            return (
              <div key={job.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 10,
                border: `2px solid ${statusStyle ? statusStyle.border : '#e0e0e0'}`,
                backgroundColor: statusStyle ? statusStyle.bg : '#fafafa',
                transition: 'all 0.3s',
              }}>
                {/* Job name & status */}
                <div style={{ minWidth: 120 }}>
                  <div style={{ fontWeight: 700, color: statusStyle ? statusStyle.color : '#333', fontSize: 14 }}>
                    {statusStyle ? statusStyle.icon : '📦'} {job.name}
                  </div>
                  {statusStyle && (
                    <div style={{ fontSize: 11, color: statusStyle.color }}>{statusStyle.label}</div>
                  )}
                </div>

                {/* Controls */}
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 1 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#555', cursor: 'pointer' }}>
                    <input
                      type='checkbox'
                      checked={job.allowFailure}
                      onChange={e => updateJob(job.id, { allowFailure: e.target.checked })}
                      disabled={isRunning}
                    />
                    allow_failure
                  </label>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                    <span style={{ color: '#555' }}>when:</span>
                    <select
                      value={job.when}
                      onChange={e => updateJob(job.id, { when: e.target.value as WhenOption })}
                      disabled={isRunning}
                      style={{ fontSize: 12, padding: '2px 4px', borderRadius: 4, border: '1px solid #ccc' }}
                    >
                      <option value='on_success'>on_success</option>
                      <option value='on_failure'>on_failure</option>
                      <option value='always'>always</option>
                      <option value='manual'>manual</option>
                    </select>
                  </div>
                </div>

                {/* Action buttons for running job */}
                {isCurrentlyRunning && (
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => sendJobResult(job.id, 'success')}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none',
                        backgroundColor: '#2e7d32', color: '#fff', fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      ✓ Успех
                    </button>
                    <button
                      onClick={() => sendJobResult(job.id, 'failed')}
                      style={{
                        padding: '4px 10px', borderRadius: 6, border: 'none',
                        backgroundColor: '#c62828', color: '#fff', fontSize: 12, cursor: 'pointer',
                      }}
                    >
                      ✗ Провал
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Pipeline controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'center' }}>
        <button
          onClick={runPipeline}
          disabled={isRunning}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            backgroundColor: isRunning ? '#ccc' : '#1565c0',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunning ? '▶️ Выполняется...' : '▶ Запустить пайплайн'}
        </button>

        {(isRunning || pipelineFinished) && (
          <button
            onClick={resetPipeline}
            style={{
              padding: '10px 16px', borderRadius: 8, border: '2px solid #90a4ae',
              backgroundColor: '#eceff1', color: '#546e7a',
              fontWeight: 600, fontSize: 14, cursor: 'pointer',
            }}
          >
            Reset
          </button>
        )}

        {pipelineFinished && result && (
          <div style={{
            padding: '8px 16px', borderRadius: 8,
            backgroundColor: result === 'success' ? '#e8f5e9' : '#ffebee',
            border: `2px solid ${result === 'success' ? '#66bb6a' : '#ef5350'}`,
            color: result === 'success' ? '#1b5e20' : '#b71c1c',
            fontWeight: 700, fontSize: 14,
          }}>
            {result === 'success' ? '✅ Pipeline SUCCESS' : '❌ Pipeline FAILED'}
          </div>
        )}
      </div>

      {/* Info hint */}
      {isRunning && currentJobIndex >= 0 && jobStates[currentJobIndex]?.status === 'running' && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, backgroundColor: '#e3f2fd',
          border: '1px solid #90caf9', fontSize: 13, color: '#0d47a1',
        }}>
          Джоб <strong>{jobs[currentJobIndex].name}</strong> выполняется. Нажми "Успех" или "Провал" чтобы продолжить.
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 2.3: retry and timeout
// ============================================

type RetryWhen = 'runner_system_failure' | 'script_failure' | 'stuck_or_timeout_failure' | 'api_failure'

interface RetryConfig {
  max: number
  when: RetryWhen[]
}

interface AttemptRecord {
  attempt: number
  result: 'success' | 'failed'
  errorType: RetryWhen | null
  retried: boolean
  durationMs: number
}

const RETRY_WHEN_OPTIONS: { value: RetryWhen, label: string, description: string }[] = [
  { value: 'runner_system_failure', label: 'runner_system_failure', description: 'Системная ошибка раннера' },
  { value: 'script_failure', label: 'script_failure', description: 'Скрипт завершился с ошибкой' },
  { value: 'stuck_or_timeout_failure', label: 'stuck_or_timeout_failure', description: 'Завис или истёк таймаут' },
  { value: 'api_failure', label: 'api_failure', description: 'Ошибка GitLab API' },
]

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function Task2_3_Solution() {
  const [retryMax, setRetryMax] = useState(2)
  const [retryWhen, setRetryWhen] = useState<RetryWhen[]>(['runner_system_failure', 'script_failure'])
  const [timeoutSec, setTimeoutSec] = useState(10)
  const [successProb, setSuccessProb] = useState(60)

  const [isRunning, setIsRunning] = useState(false)
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])
  const [currentAttempt, setCurrentAttempt] = useState(0)
  const [progress, setProgress] = useState(0)
  const [finalResult, setFinalResult] = useState<'success' | 'failed' | null>(null)
  const [totalRetries, setTotalRetries] = useState(0)

  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cancelledRef = useRef(false)

  function toggleRetryWhen(value: RetryWhen) {
    setRetryWhen(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function pickRandomErrorType(): RetryWhen {
    const all: RetryWhen[] = ['runner_system_failure', 'script_failure', 'stuck_or_timeout_failure', 'api_failure']
    return all[Math.floor(Math.random() * all.length)]
  }

  function shouldRetry(errorType: RetryWhen): boolean {
    return retryWhen.includes(errorType)
  }

  async function runSimulation() {
    cancelledRef.current = false
    setIsRunning(true)
    setAttempts([])
    setFinalResult(null)
    setTotalRetries(0)

    const stepMs = 80
    const totalMs = timeoutSec * 1000
    const steps = totalMs / stepMs

    let retriesUsed = 0
    const maxAttempts = retryMax + 1
    const recordedAttempts: AttemptRecord[] = []

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (cancelledRef.current) break

      setCurrentAttempt(attempt)
      setProgress(0)

      const startTime = Date.now()

      // Animate progress
      let stepCount = 0
      await new Promise<void>(resolve => {
        progressRef.current = setInterval(() => {
          stepCount++
          const pct = Math.min((stepCount / steps) * 100, 100)
          setProgress(pct)
          if (stepCount >= steps || cancelledRef.current) {
            clearInterval(progressRef.current!)
            resolve()
          }
        }, stepMs)
      })

      if (cancelledRef.current) break

      const elapsed = Date.now() - startTime
      const isSuccess = Math.random() * 100 < successProb
      const errorType = isSuccess ? null : pickRandomErrorType()
      const canRetry = !isSuccess && errorType !== null && shouldRetry(errorType) && attempt < maxAttempts

      const record: AttemptRecord = {
        attempt,
        result: isSuccess ? 'success' : 'failed',
        errorType,
        retried: canRetry,
        durationMs: elapsed,
      }
      recordedAttempts.push(record)
      setAttempts([...recordedAttempts])

      if (isSuccess) {
        setFinalResult('success')
        break
      }

      if (!canRetry) {
        setFinalResult('failed')
        break
      }

      retriesUsed++
      setTotalRetries(retriesUsed)
      await delay(400)
    }

    setIsRunning(false)
    setCurrentAttempt(0)
    setProgress(0)
  }

  function resetSimulation() {
    cancelledRef.current = true
    if (progressRef.current) clearInterval(progressRef.current)
    setIsRunning(false)
    setAttempts([])
    setFinalResult(null)
    setTotalRetries(0)
    setCurrentAttempt(0)
    setProgress(0)
  }

  // Generate YAML preview
  const yamlPreview = `flaky-job:
  script:
    - ./run-tests.sh
  timeout: ${timeoutSec} seconds
  retry:
    max: ${retryMax}${retryWhen.length > 0 ? `
    when:
${retryWhen.map(w => `      - ${w}`).join('\n')}` : ''}`

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 760, margin: '0 auto', padding: '1.5rem' }}>
      <h2 style={{ marginTop: 0, color: '#1a1a2e' }}>Задание 2.3: retry и timeout</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Left: configurator */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10 }}>Конфигурация</div>

          {/* retry.max */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#555', marginBottom: 4 }}>
              retry.max: <strong>{retryMax}</strong>
              <span style={{ color: '#999' }}> (итого попыток: {retryMax + 1})</span>
            </label>
            <input
              type='range'
              min={0}
              max={5}
              value={retryMax}
              onChange={e => setRetryMax(Number(e.target.value))}
              disabled={isRunning}
              style={{ width: '100%' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#999' }}>
              <span>0</span><span>5</span>
            </div>
          </div>

          {/* retry.when */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>retry.when:</div>
            {RETRY_WHEN_OPTIONS.map(opt => (
              <label key={opt.value} style={{
                display: 'flex', alignItems: 'flex-start', gap: 6,
                fontSize: 12, color: '#333', marginBottom: 4, cursor: 'pointer',
              }}>
                <input
                  type='checkbox'
                  checked={retryWhen.includes(opt.value)}
                  onChange={() => toggleRetryWhen(opt.value)}
                  disabled={isRunning}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <div style={{ fontFamily: 'monospace', fontSize: 11 }}>{opt.label}</div>
                  <div style={{ color: '#888', fontSize: 11 }}>{opt.description}</div>
                </div>
              </label>
            ))}
          </div>

          {/* timeout */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 12, color: '#555', marginBottom: 4 }}>
              timeout: <strong>{timeoutSec}s</strong>
            </label>
            <input
              type='range'
              min={3}
              max={20}
              value={timeoutSec}
              onChange={e => setTimeoutSec(Number(e.target.value))}
              disabled={isRunning}
              style={{ width: '100%' }}
            />
          </div>

          {/* success probability */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#555', marginBottom: 4 }}>
              Вероятность успеха: <strong>{successProb}%</strong>
            </label>
            <input
              type='range'
              min={0}
              max={100}
              value={successProb}
              onChange={e => setSuccessProb(Number(e.target.value))}
              disabled={isRunning}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        {/* Right: YAML preview */}
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10 }}>YAML-конфиг</div>
          <pre style={{
            backgroundColor: '#1e1e2e',
            color: '#cdd6f4',
            padding: '12px',
            borderRadius: 8,
            fontSize: 12,
            lineHeight: 1.6,
            margin: 0,
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {yamlPreview}
          </pre>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem', alignItems: 'center' }}>
        <button
          onClick={runSimulation}
          disabled={isRunning}
          style={{
            padding: '10px 20px', borderRadius: 8, border: 'none',
            backgroundColor: isRunning ? '#ccc' : '#1565c0',
            color: '#fff', fontWeight: 700, fontSize: 14,
            cursor: isRunning ? 'not-allowed' : 'pointer',
          }}
        >
          {isRunning ? '▶️ Симуляция...' : '▶ Запустить симуляцию'}
        </button>
        <button
          onClick={resetSimulation}
          style={{
            padding: '10px 16px', borderRadius: 8, border: '2px solid #90a4ae',
            backgroundColor: '#eceff1', color: '#546e7a',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}
        >
          Reset
        </button>

        {finalResult && (
          <div style={{
            padding: '8px 16px', borderRadius: 8,
            backgroundColor: finalResult === 'success' ? '#e8f5e9' : '#ffebee',
            border: `2px solid ${finalResult === 'success' ? '#66bb6a' : '#ef5350'}`,
            color: finalResult === 'success' ? '#1b5e20' : '#b71c1c',
            fontWeight: 700, fontSize: 14,
          }}>
            {finalResult === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
          </div>
        )}
      </div>

      {/* Progress bar (current attempt) */}
      {isRunning && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 4 }}>
            Попытка {currentAttempt} / {retryMax + 1} — выполнение...
          </div>
          <div style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#1565c0',
              borderRadius: 5,
              transition: 'width 0.08s linear',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999', marginTop: 2 }}>
            <span>0s</span>
            <span>{timeoutSec}s (timeout)</span>
          </div>
        </div>
      )}

      {/* Attempt log */}
      {attempts.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 8 }}>
            История попыток
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {attempts.map(rec => (
              <div key={rec.attempt} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                borderRadius: 8,
                border: `1.5px solid ${rec.result === 'success' ? '#66bb6a' : rec.retried ? '#ffb300' : '#ef5350'}`,
                backgroundColor: rec.result === 'success' ? '#e8f5e9' : rec.retried ? '#fff8e1' : '#ffebee',
              }}>
                <span style={{ fontWeight: 700, fontSize: 13, minWidth: 80, color: '#555' }}>
                  Попытка {rec.attempt}
                </span>
                <span style={{
                  fontWeight: 700, fontSize: 13,
                  color: rec.result === 'success' ? '#1b5e20' : '#b71c1c',
                }}>
                  {rec.result === 'success' ? '✅ SUCCESS' : '❌ FAILED'}
                </span>
                {rec.errorType && (
                  <span style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                    [{rec.errorType}]
                  </span>
                )}
                {rec.retried && (
                  <span style={{ fontSize: 11, color: '#e65100', fontWeight: 600 }}>
                    → retry
                  </span>
                )}
                {!rec.retried && rec.result === 'failed' && (
                  <span style={{ fontSize: 11, color: '#b71c1c', fontWeight: 600 }}>
                    → no retry (тип ошибки не в retry.when)
                  </span>
                )}
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#999' }}>
                  {(rec.durationMs / 1000).toFixed(1)}s
                </span>
              </div>
            ))}
          </div>

          {/* Statistics */}
          {finalResult && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              backgroundColor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              display: 'flex',
              gap: 24,
              fontSize: 13,
            }}>
              <span><strong>Попыток:</strong> {attempts.length}</span>
              <span><strong>Retry:</strong> {totalRetries}</span>
              <span>
                <strong>Итог:</strong>{' '}
                <span style={{ color: finalResult === 'success' ? '#1b5e20' : '#b71c1c', fontWeight: 700 }}>
                  {finalResult === 'success' ? 'SUCCESS' : `FAILED после ${attempts.length} попыток`}
                </span>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
