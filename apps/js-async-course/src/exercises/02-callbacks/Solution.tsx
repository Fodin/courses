import { useState, useRef, useEffect } from 'react'

// ============================================
// Task 2.1 Solution: Callback Hell Visualizer
// ============================================

type StepStatus = 'idle' | 'running' | 'done' | 'error'

interface PipelineStep {
  id: number
  name: string
  detail: string
  color: string
  delay: number
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, name: 'getUser(userId)',       detail: 'Загружаем профиль пользователя',    color: '#3b82f6', delay: 600 },
  { id: 2, name: 'getPosts(user)',         detail: 'Получаем список постов',            color: '#8b5cf6', delay: 700 },
  { id: 3, name: 'getComments(posts)',     detail: 'Загружаем комментарии к постам',   color: '#ec4899', delay: 800 },
  { id: 4, name: 'filterSpam(comments)',   detail: 'Фильтруем спам-комментарии',       color: '#f59e0b', delay: 500 },
  { id: 5, name: 'sendReport(filtered)',   detail: 'Отправляем отчёт на сервер',       color: '#10b981', delay: 600 },
]

// Simulates an async operation using nested callbacks (error-first pattern)
function simulateCallback(
  step: PipelineStep,
  shouldError: boolean,
  callback: (err: string | null, result: string) => void
): ReturnType<typeof setTimeout> {
  return setTimeout(() => {
    if (shouldError) {
      callback(`Ошибка на шаге ${step.id}: ${step.name} завершился с ошибкой`, '')
    } else {
      callback(null, `Результат шага ${step.id}`)
    }
  }, step.delay)
}

// Callback-hell pipeline — deeply nested error-first callbacks
function runCallbackPipeline(
  errorOnStep: number,
  onStepChange: (stepId: number, status: StepStatus, message: string) => void,
  onDone: (success: boolean) => void
): void {
  const steps = PIPELINE_STEPS

  onStepChange(1, 'running', steps[0].detail)
  simulateCallback(steps[0], errorOnStep === 1, (err1) => {
    if (err1) { onStepChange(1, 'error', err1); onDone(false); return }
    onStepChange(1, 'done', 'Пользователь загружен')

    onStepChange(2, 'running', steps[1].detail)
    simulateCallback(steps[1], errorOnStep === 2, (err2) => {
      if (err2) { onStepChange(2, 'error', err2); onDone(false); return }
      onStepChange(2, 'done', 'Посты получены')

      onStepChange(3, 'running', steps[2].detail)
      simulateCallback(steps[2], errorOnStep === 3, (err3) => {
        if (err3) { onStepChange(3, 'error', err3); onDone(false); return }
        onStepChange(3, 'done', 'Комментарии загружены')

        onStepChange(4, 'running', steps[3].detail)
        simulateCallback(steps[3], errorOnStep === 4, (err4) => {
          if (err4) { onStepChange(4, 'error', err4); onDone(false); return }
          onStepChange(4, 'done', 'Спам отфильтрован')

          onStepChange(5, 'running', steps[4].detail)
          simulateCallback(steps[4], errorOnStep === 5, (err5) => {
            if (err5) { onStepChange(5, 'error', err5); onDone(false); return }
            onStepChange(5, 'done', 'Отчёт отправлен')
            onDone(true)
          })
        })
      })
    })
  })
}

export function Task2_1_Solution() {
  const [statuses, setStatuses] = useState<Record<number, StepStatus>>({})
  const [messages, setMessages] = useState<Record<number, string>>({})
  const [timeline, setTimeline] = useState<Array<{ time: number; text: string; color: string }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [finished, setFinished] = useState<boolean | null>(null)
  const [errorOnStep, setErrorOnStep] = useState(0) // 0 = no error
  const [showMissedIfWarning, setShowMissedIfWarning] = useState(false)
  const startTimeRef = useRef<number>(0)
  const timelineRef = useRef<typeof timeline>([])

  const addTimeline = (text: string, color: string) => {
    const elapsed = Math.round(performance.now() - startTimeRef.current)
    const entry = { time: elapsed, text, color }
    timelineRef.current = [...timelineRef.current, entry]
    setTimeline([...timelineRef.current])
  }

  const handleRun = () => {
    setStatuses({})
    setMessages({})
    setTimeline([])
    timelineRef.current = []
    setFinished(null)
    setShowMissedIfWarning(false)
    setIsRunning(true)
    startTimeRef.current = performance.now()

    runCallbackPipeline(
      errorOnStep,
      (stepId, status, message) => {
        setStatuses((prev) => ({ ...prev, [stepId]: status }))
        setMessages((prev) => ({ ...prev, [stepId]: message }))
        const step = PIPELINE_STEPS[stepId - 1]
        addTimeline(`[${status === 'running' ? 'START' : status === 'done' ? 'DONE ' : 'ERROR'}] Шаг ${stepId}: ${message}`, step.color)

        // Show "missed if(err)" warning when there's an error and we didn't check it
        if (status === 'error' && errorOnStep > 0) {
          setTimeout(() => setShowMissedIfWarning(true), 200)
        }
      },
      (success) => {
        setIsRunning(false)
        setFinished(success)
        addTimeline(success ? 'PIPELINE ЗАВЕРШЁН УСПЕШНО' : 'PIPELINE ПРЕРВАН ПО ОШИБКЕ', success ? '#10b981' : '#ef4444')
      }
    )
  }

  const handleReset = () => {
    setStatuses({})
    setMessages({})
    setTimeline([])
    timelineRef.current = []
    setFinished(null)
    setIsRunning(false)
    setShowMissedIfWarning(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const getStatusIcon = (status: StepStatus | undefined) => {
    if (!status || status === 'idle') return '○'
    if (status === 'running') return '●'
    if (status === 'done') return '✓'
    return '✗'
  }

  const getStatusColor = (status: StepStatus | undefined) => {
    if (!status || status === 'idle') return '#475569'
    if (status === 'running') return '#60a5fa'
    if (status === 'done') return '#10b981'
    return '#ef4444'
  }

  // Code snippet showing callback hell structure
  const callbackHellCode = `getUser(userId, (err, user) => {        // уровень 1
  if (err) return handleError(err)
  getPosts(user, (err, posts) => {     // уровень 2
    if (err) return handleError(err)
    getComments(posts, (err, cmts) => { // уровень 3
      if (err) return handleError(err)
      filterSpam(cmts, (err, clean) => { // уровень 4
        if (err) return handleError(err)
        sendReport(clean, (err) => {    // уровень 5
          if (err) return handleError(err)
          console.log('done!')
        })
      })
    })
  })
})`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 2.1 — Callback Hell Визуализатор
      </h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left: pyramid + controls */}
        <div style={{ flex: '0 0 auto', minWidth: '260px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            ПИРАМИДА CALLBACK HELL
          </div>

          {/* Pyramid visualization */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            {PIPELINE_STEPS.map((step, index) => {
              const status = statuses[step.id]
              const isActive = status === 'running' || status === 'done' || status === 'error'
              const indent = index * 14
              return (
                <div
                  key={step.id}
                  style={{
                    marginLeft: `${indent}px`,
                    marginBottom: '0.4rem',
                    background: isActive ? `${step.color}18` : '#0f172a',
                    border: `1px solid ${isActive ? step.color : '#1e293b'}`,
                    borderRadius: '6px',
                    padding: '0.5rem 0.75rem',
                    transition: 'all 0.3s',
                    boxShadow: status === 'running' ? `0 0 10px ${step.color}50` : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: getStatusColor(status), fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {getStatusIcon(status)}
                    </span>
                    <span style={{ color: isActive ? step.color : '#475569', fontSize: '0.82rem', fontWeight: status === 'running' ? 'bold' : 'normal' }}>
                      {step.name}
                    </span>
                  </div>
                  {messages[step.id] && (
                    <div style={{
                      fontSize: '0.72rem',
                      color: status === 'error' ? '#fca5a5' : '#64748b',
                      marginTop: '0.25rem',
                      marginLeft: '1.25rem',
                    }}>
                      {messages[step.id]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Error trigger controls */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
              СБОЙ НА ШАГЕ (0 = без ошибок)
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => { setErrorOnStep(n); handleReset() }}
                  style={{
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '0.8rem',
                    background: errorOnStep === n ? (n === 0 ? '#059669' : '#dc2626') : '#0f172a',
                    color: errorOnStep === n ? '#fff' : '#64748b',
                    fontWeight: errorOnStep === n ? 'bold' : 'normal',
                    transition: 'all 0.2s',
                  }}
                >
                  {n === 0 ? 'OK' : `#${n}`}
                </button>
              ))}
            </div>
          </div>

          {/* Result */}
          {finished !== null && (
            <div style={{
              background: finished ? '#052e16' : '#450a0a',
              border: `1px solid ${finished ? '#10b981' : '#ef4444'}`,
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: finished ? '#6ee7b7' : '#fca5a5',
              marginBottom: '1rem',
            }}>
              {finished
                ? 'Все 5 шагов выполнены. Отчёт отправлен.'
                : `Pipeline прерван. Шаги после ошибки не выполняются.`}
            </div>
          )}

          {/* Missed if(err) warning */}
          {showMissedIfWarning && (
            <div style={{
              background: '#431407',
              border: '1px solid #f59e0b',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.78rem',
              color: '#fcd34d',
              marginBottom: '1rem',
              lineHeight: 1.5,
            }}>
              Проблема: без `if (err) return` следующий колбэк вызвался бы с undefined
              и продолжал бы выполнение цепочки даже при ошибке!
            </div>
          )}

          {/* Controls */}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleRun}
              disabled={isRunning}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                border: 'none',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                background: isRunning ? '#1e293b' : '#3b82f6',
                color: isRunning ? '#475569' : '#fff',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
              }}
            >
              {isRunning ? 'Выполняется...' : 'Запустить'}
            </button>
            <button
              onClick={handleReset}
              disabled={isRunning}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                background: '#374151',
                color: '#e5e7eb',
                fontFamily: 'inherit',
                fontSize: '0.85rem',
              }}
            >
              Сброс
            </button>
          </div>
        </div>

        {/* Right: code + timeline */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Code panel */}
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            КОД (error-first callbacks)
          </div>
          <div style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '0.75rem',
            marginBottom: '1rem',
            overflowX: 'auto',
          }}>
            <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre' }}>
              {callbackHellCode.split('\n').map((line, i) => {
                const stepMatch = line.match(/уровень (\d+)/)
                const stepNum = stepMatch ? parseInt(stepMatch[1]) : null
                const status = stepNum ? statuses[stepNum] : null
                const step = stepNum ? PIPELINE_STEPS[stepNum - 1] : null
                const isHighlighted = status === 'running' || status === 'done' || status === 'error'
                return (
                  <div
                    key={i}
                    style={{
                      background: isHighlighted && step ? `${step.color}18` : 'transparent',
                      borderLeft: isHighlighted && step ? `2px solid ${step.color}` : '2px solid transparent',
                      paddingLeft: '0.4rem',
                      transition: 'background 0.3s',
                    }}
                  >
                    {line}
                  </div>
                )
              })}
            </pre>
          </div>

          {/* Timeline */}
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            TIMELINE ВЫПОЛНЕНИЯ
          </div>
          <div style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '0.75rem',
            minHeight: '120px',
            maxHeight: '220px',
            overflowY: 'auto',
          }}>
            {timeline.length === 0 && (
              <div style={{ color: '#475569', fontSize: '0.8rem' }}>
                Нажмите "Запустить" для запуска pipeline
              </div>
            )}
            {timeline.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#475569', minWidth: '52px', textAlign: 'right' }}>
                  +{entry.time}ms
                </span>
                <span style={{ color: entry.color }}>{entry.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.2 Solution: Callbacks vs Promises
// ============================================

// Simulated async functions that return Promises
function getUserPromise(): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve('user:Alice'), 500))
}
function getPostsPromise(user: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`posts:[3 posts of ${user}]`), 600))
}
function getCommentsPromise(posts: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`comments:[10 cmts for ${posts}]`), 700))
}
function filterSpamPromise(comments: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`clean:[7 clean cmts from ${comments.slice(0, 20)}...]`), 400))
}
function sendReportPromise(filtered: string): Promise<string> {
  return new Promise((resolve) => setTimeout(() => resolve(`report:sent (${filtered.length} chars)`), 500))
}

type SideStatus = 'idle' | 'running' | 'done'

interface SideLog {
  step: number
  label: string
  time: number
  color: string
}

const CB_STEPS = [
  { label: 'getUser()', color: '#3b82f6' },
  { label: 'getPosts()', color: '#8b5cf6' },
  { label: 'getComments()', color: '#ec4899' },
  { label: 'filterSpam()', color: '#f59e0b' },
  { label: 'sendReport()', color: '#10b981' },
]

export function Task2_2_Solution() {
  const [cbStatus, setCbStatus] = useState<SideStatus>('idle')
  const [promStatus, setPromStatus] = useState<SideStatus>('idle')
  const [cbLogs, setCbLogs] = useState<SideLog[]>([])
  const [promLogs, setPromLogs] = useState<SideLog[]>([])
  const [cbStep, setCbStep] = useState(0)
  const [promStep, setPromStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const startRef = useRef(0)

  const handleRun = () => {
    setCbStatus('running')
    setPromStatus('running')
    setCbLogs([])
    setPromLogs([])
    setCbStep(0)
    setPromStep(0)
    setFinished(false)
    startRef.current = performance.now()

    let cbDone = false
    let promDone = false
    const checkBoth = () => {
      if (cbDone && promDone) setFinished(true)
    }

    // ---- Callback side ----
    const cbStart = performance.now()
    const addCbLog = (step: number) => {
      const elapsed = Math.round(performance.now() - cbStart)
      setCbLogs((prev) => [...prev, { step, label: CB_STEPS[step].label, time: elapsed, color: CB_STEPS[step].color }])
      setCbStep(step + 1)
    }

    // Nested callback hell — 5 levels deep
    setTimeout(() => {
      addCbLog(0)
      setTimeout(() => {
        addCbLog(1)
        setTimeout(() => {
          addCbLog(2)
          setTimeout(() => {
            addCbLog(3)
            setTimeout(() => {
              addCbLog(4)
              setCbStatus('done')
              cbDone = true
              checkBoth()
            }, 500)
          }, 400)
        }, 700)
      }, 600)
    }, 500)

    // ---- Promise side ----
    const promStart = performance.now()
    const addPromLog = (step: number) => {
      const elapsed = Math.round(performance.now() - promStart)
      setPromLogs((prev) => [...prev, { step, label: CB_STEPS[step].label, time: elapsed, color: CB_STEPS[step].color }])
      setPromStep(step + 1)
    }

    getUserPromise()
      .then((user) => { addPromLog(0); return getPostsPromise(user) })
      .then((posts) => { addPromLog(1); return getCommentsPromise(posts) })
      .then((comments) => { addPromLog(2); return filterSpamPromise(comments) })
      .then((filtered) => { addPromLog(3); return sendReportPromise(filtered) })
      .then(() => {
        addPromLog(4)
        setPromStatus('done')
        promDone = true
        checkBoth()
      })
  }

  const handleReset = () => {
    setCbStatus('idle')
    setPromStatus('idle')
    setCbLogs([])
    setPromLogs([])
    setCbStep(0)
    setPromStep(0)
    setHoveredStep(null)
    setFinished(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const metrics = [
    { label: 'Вложенность', cb: '5 уровней', prom: '0 уровней' },
    { label: 'Строк кода', cb: '~15', prom: '~7' },
    { label: 'Обработка ошибок', cb: 'if(err) в каждом уровне', prom: 'один .catch()' },
    { label: 'Читаемость', cb: 'Пирамида', prom: 'Плоская цепочка' },
  ]

  // Callback code lines (nested structure)
  const callbackLines = [
    { text: "getUser(userId, (err, user) => {", step: 0 },
    { text: "  if (err) return onError(err)", step: 0 },
    { text: "  getPosts(user, (err, posts) => {", step: 1 },
    { text: "    if (err) return onError(err)", step: 1 },
    { text: "    getComments(posts, (err, cmts) => {", step: 2 },
    { text: "      if (err) return onError(err)", step: 2 },
    { text: "      filterSpam(cmts, (err, clean) => {", step: 3 },
    { text: "        if (err) return onError(err)", step: 3 },
    { text: "        sendReport(clean, (err) => {", step: 4 },
    { text: "          if (err) return onError(err)", step: 4 },
    { text: "          console.log('done!')", step: 4 },
    { text: "        })", step: 4 },
    { text: "      })", step: 3 },
    { text: "    })", step: 2 },
    { text: "  })", step: 1 },
    { text: "})", step: 0 },
  ]

  // Promise chain lines (flat)
  const promiseLines = [
    { text: "getUser(userId)", step: 0 },
    { text: "  .then(user => getPosts(user))", step: 1 },
    { text: "  .then(posts => getComments(posts))", step: 2 },
    { text: "  .then(cmts => filterSpam(cmts))", step: 3 },
    { text: "  .then(clean => sendReport(clean))", step: 4 },
    { text: "  .then(() => console.log('done!'))", step: 4 },
    { text: "  .catch(err => onError(err))", step: -1 },
  ]

  const isStepActive = (step: number, currentStep: number) => step < currentStep

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 2.2 — Callbacks vs Promises
      </h2>

      {/* Hint */}
      <div style={{
        background: '#1e293b',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        marginBottom: '1rem',
        fontSize: '0.8rem',
        color: '#94a3b8',
      }}>
        Наведите на строку кода — увидите соответствие между callback-уровнями и .then()-шагами
      </div>

      {/* Two-column code comparison */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {/* Callback Hell */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ color: '#ef4444', fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>
            CALLBACK HELL (вложенность: 5)
          </div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', overflowX: 'auto' }}>
            {callbackLines.map((line, i) => {
              const stepIndex = line.step
              const isHovered = hoveredStep === stepIndex
              const isActive = stepIndex >= 0 && isStepActive(stepIndex, cbStep)
              const step = stepIndex >= 0 ? CB_STEPS[stepIndex] : null
              return (
                <div
                  key={i}
                  onMouseEnter={() => stepIndex >= 0 && setHoveredStep(stepIndex)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    fontSize: '0.75rem',
                    lineHeight: 1.8,
                    color: isActive && step ? step.color : (isHovered && step ? `${step.color}cc` : '#64748b'),
                    background: isHovered && step ? `${step.color}15` : 'transparent',
                    borderLeft: isHovered && step ? `2px solid ${step.color}` : '2px solid transparent',
                    paddingLeft: '0.3rem',
                    cursor: 'default',
                    transition: 'all 0.15s',
                    whiteSpace: 'pre',
                  }}
                >
                  {line.text}
                </div>
              )
            })}
          </div>
        </div>

        {/* Promise Chain */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ color: '#10b981', fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>
            PROMISE CHAIN (плоская)
          </div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', overflowX: 'auto' }}>
            {promiseLines.map((line, i) => {
              const stepIndex = line.step
              const isHovered = hoveredStep === stepIndex && stepIndex >= 0
              const isActive = stepIndex >= 0 && isStepActive(stepIndex, promStep)
              const step = stepIndex >= 0 ? CB_STEPS[stepIndex] : null
              return (
                <div
                  key={i}
                  onMouseEnter={() => stepIndex >= 0 && setHoveredStep(stepIndex)}
                  onMouseLeave={() => setHoveredStep(null)}
                  style={{
                    fontSize: '0.75rem',
                    lineHeight: 1.8,
                    color: stepIndex === -1
                      ? '#94a3b8'
                      : isActive && step
                      ? step.color
                      : isHovered && step
                      ? `${step.color}cc`
                      : '#64748b',
                    background: isHovered && step ? `${step.color}15` : 'transparent',
                    borderLeft: isHovered && step ? `2px solid ${step.color}` : '2px solid transparent',
                    paddingLeft: '0.3rem',
                    cursor: 'default',
                    transition: 'all 0.15s',
                    whiteSpace: 'pre',
                  }}
                >
                  {line.text}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {['Callbacks', 'Promises'].map((label, sideIdx) => {
          const logs = sideIdx === 0 ? cbLogs : promLogs
          const status = sideIdx === 0 ? cbStatus : promStatus
          return (
            <div key={label} style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ fontSize: '0.78rem', color: sideIdx === 0 ? '#ef4444' : '#10b981', marginBottom: '0.3rem' }}>
                {label}: {logs.length}/5 шагов
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {CB_STEPS.map((step, i) => {
                  const done = i < logs.length
                  return (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: '6px',
                        borderRadius: '3px',
                        background: done ? step.color : '#1e293b',
                        transition: 'background 0.3s',
                        boxShadow: done ? `0 0 6px ${step.color}60` : 'none',
                      }}
                    />
                  )
                })}
              </div>
              {status === 'done' && (
                <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                  Последний шаг: +{logs[logs.length - 1]?.time ?? 0}ms
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Metrics table */}
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>СРАВНЕНИЕ</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', color: '#64748b', padding: '0.25rem 0.5rem', fontWeight: 'normal' }}>Метрика</th>
              <th style={{ textAlign: 'left', color: '#ef4444', padding: '0.25rem 0.5rem', fontWeight: 'normal' }}>Callbacks</th>
              <th style={{ textAlign: 'left', color: '#10b981', padding: '0.25rem 0.5rem', fontWeight: 'normal' }}>Promises</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row, i) => (
              <tr key={i} style={{ borderTop: '1px solid #0f172a' }}>
                <td style={{ padding: '0.3rem 0.5rem', color: '#94a3b8' }}>{row.label}</td>
                <td style={{ padding: '0.3rem 0.5rem', color: '#fca5a5' }}>{row.cb}</td>
                <td style={{ padding: '0.3rem 0.5rem', color: '#6ee7b7' }}>{row.prom}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Success message */}
      {finished && (
        <div style={{
          background: '#052e16',
          border: '1px solid #10b981',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          marginBottom: '1rem',
          fontSize: '0.82rem',
          color: '#6ee7b7',
        }}>
          Оба варианта завершены с одинаковым результатом. Promise-цепочка читается как плоский список шагов — никакой пирамиды.
        </div>
      )}

      {/* Controls */}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleRun}
          disabled={cbStatus === 'running' || promStatus === 'running'}
          style={{
            padding: '0.5rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            cursor: (cbStatus === 'running' || promStatus === 'running') ? 'not-allowed' : 'pointer',
            background: (cbStatus === 'running' || promStatus === 'running') ? '#1e293b' : '#3b82f6',
            color: (cbStatus === 'running' || promStatus === 'running') ? '#475569' : '#fff',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          {(cbStatus === 'running' || promStatus === 'running') ? 'Выполняется...' : 'Запустить оба'}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            background: '#374151',
            color: '#e5e7eb',
            fontFamily: 'inherit',
            fontSize: '0.85rem',
          }}
        >
          Сброс
        </button>
      </div>
    </div>
  )
}
