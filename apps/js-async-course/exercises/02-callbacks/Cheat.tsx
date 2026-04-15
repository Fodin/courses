import { useState, useRef } from 'react'

// ============================================
// Cheat.tsx — Полное решение Level 2: Callbacks
// Full solution for Level 2: Callbacks
// ============================================

// -----------------------------------------------
// Task 2.1: Callback Hell Visualizer
// -----------------------------------------------

type StepStatus = 'idle' | 'running' | 'done' | 'error'

interface PipelineStep {
  id: number
  name: string
  detail: string
  color: string
  delay: number
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, name: 'getUser(userId)',      detail: 'Загружаем профиль пользователя', color: '#3b82f6', delay: 600 },
  { id: 2, name: 'getPosts(user)',        detail: 'Получаем список постов',         color: '#8b5cf6', delay: 700 },
  { id: 3, name: 'getComments(posts)',    detail: 'Загружаем комментарии к постам', color: '#ec4899', delay: 800 },
  { id: 4, name: 'filterSpam(comments)', detail: 'Фильтруем спам-комментарии',     color: '#f59e0b', delay: 500 },
  { id: 5, name: 'sendReport(filtered)', detail: 'Отправляем отчёт на сервер',     color: '#10b981', delay: 600 },
]

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

function runCallbackPipeline(
  errorOnStep: number,
  onStepChange: (stepId: number, status: StepStatus, message: string) => void,
  onDone: (success: boolean) => void
): void {
  const s = PIPELINE_STEPS

  onStepChange(1, 'running', s[0].detail)
  simulateCallback(s[0], errorOnStep === 1, (err1) => {
    if (err1) { onStepChange(1, 'error', err1); onDone(false); return }
    onStepChange(1, 'done', 'Пользователь загружен')

    onStepChange(2, 'running', s[1].detail)
    simulateCallback(s[1], errorOnStep === 2, (err2) => {
      if (err2) { onStepChange(2, 'error', err2); onDone(false); return }
      onStepChange(2, 'done', 'Посты получены')

      onStepChange(3, 'running', s[2].detail)
      simulateCallback(s[2], errorOnStep === 3, (err3) => {
        if (err3) { onStepChange(3, 'error', err3); onDone(false); return }
        onStepChange(3, 'done', 'Комментарии загружены')

        onStepChange(4, 'running', s[3].detail)
        simulateCallback(s[3], errorOnStep === 4, (err4) => {
          if (err4) { onStepChange(4, 'error', err4); onDone(false); return }
          onStepChange(4, 'done', 'Спам отфильтрован')

          onStepChange(5, 'running', s[4].detail)
          simulateCallback(s[4], errorOnStep === 5, (err5) => {
            if (err5) { onStepChange(5, 'error', err5); onDone(false); return }
            onStepChange(5, 'done', 'Отчёт отправлен')
            onDone(true)
          })
        })
      })
    })
  })
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

function Task2_1Cheat() {
  const [statuses, setStatuses] = useState<Record<number, StepStatus>>({})
  const [messages, setMessages] = useState<Record<number, string>>({})
  const [timeline, setTimeline] = useState<Array<{ time: number; text: string; color: string }>>([])
  const [isRunning, setIsRunning] = useState(false)
  const [finished, setFinished] = useState<boolean | null>(null)
  const [errorOnStep, setErrorOnStep] = useState(0)
  const [showWarning, setShowWarning] = useState(false)
  const startRef = useRef<number>(0)
  const tlRef = useRef<typeof timeline>([])

  const addTL = (text: string, color: string) => {
    const e = { time: Math.round(performance.now() - startRef.current), text, color }
    tlRef.current = [...tlRef.current, e]
    setTimeline([...tlRef.current])
  }

  const handleRun = () => {
    setStatuses({}); setMessages({}); setTimeline([]); tlRef.current = []
    setFinished(null); setShowWarning(false); setIsRunning(true)
    startRef.current = performance.now()

    runCallbackPipeline(
      errorOnStep,
      (stepId, status, message) => {
        setStatuses((p) => ({ ...p, [stepId]: status }))
        setMessages((p) => ({ ...p, [stepId]: message }))
        const step = PIPELINE_STEPS[stepId - 1]
        const tag = status === 'running' ? 'START' : status === 'done' ? 'DONE ' : 'ERROR'
        addTL(`[${tag}] Шаг ${stepId}: ${message}`, step.color)
        if (status === 'error') setTimeout(() => setShowWarning(true), 200)
      },
      (success) => {
        setIsRunning(false); setFinished(success)
        addTL(success ? 'PIPELINE ЗАВЕРШЁН УСПЕШНО' : 'PIPELINE ПРЕРВАН ПО ОШИБКЕ', success ? '#10b981' : '#ef4444')
      }
    )
  }

  const handleReset = () => {
    setStatuses({}); setMessages({}); setTimeline([]); tlRef.current = []
    setFinished(null); setIsRunning(false); setShowWarning(false)
  }

  const cs: React.CSSProperties = {
    background: '#0f172a', color: '#e2e8f0', padding: '1.5rem',
    borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem',
  }
  const btn = (disabled?: boolean, bg?: string): React.CSSProperties => ({
    padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : (bg ?? '#3b82f6'),
    color: disabled ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.85rem',
  })

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
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui' }}>
        Задание 2.1 — Callback Hell Визуализатор
      </h2>
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Left: pyramid */}
        <div style={{ flex: '0 0 auto', minWidth: '260px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>ПИРАМИДА CALLBACK HELL</div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' }}>
            {PIPELINE_STEPS.map((step, index) => {
              const status = statuses[step.id]
              const isActive = status === 'running' || status === 'done' || status === 'error'
              return (
                <div key={step.id} style={{
                  marginLeft: `${index * 14}px`, marginBottom: '0.4rem',
                  background: isActive ? `${step.color}18` : '#0f172a',
                  border: `1px solid ${isActive ? step.color : '#1e293b'}`,
                  borderRadius: '6px', padding: '0.5rem 0.75rem', transition: 'all 0.3s',
                  boxShadow: status === 'running' ? `0 0 10px ${step.color}50` : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: getStatusColor(status), fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {getStatusIcon(status)}
                    </span>
                    <span style={{ color: isActive ? step.color : '#475569', fontSize: '0.82rem', fontWeight: status === 'running' ? 'bold' : 'normal' }}>
                      {step.name}
                    </span>
                  </div>
                  {messages[step.id] && (
                    <div style={{ fontSize: '0.72rem', color: status === 'error' ? '#fca5a5' : '#64748b', marginTop: '0.25rem', marginLeft: '1.25rem' }}>
                      {messages[step.id]}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Error toggles */}
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>СБОЙ НА ШАГЕ</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => { setErrorOnStep(n); handleReset() }}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '4px', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', background: errorOnStep === n ? (n === 0 ? '#059669' : '#dc2626') : '#0f172a', color: errorOnStep === n ? '#fff' : '#64748b', fontWeight: errorOnStep === n ? 'bold' : 'normal' }}>
                  {n === 0 ? 'OK' : `#${n}`}
                </button>
              ))}
            </div>
          </div>

          {finished !== null && (
            <div style={{ background: finished ? '#052e16' : '#450a0a', border: `1px solid ${finished ? '#10b981' : '#ef4444'}`, borderRadius: '8px', padding: '0.75rem', fontSize: '0.82rem', color: finished ? '#6ee7b7' : '#fca5a5', marginBottom: '1rem' }}>
              {finished ? 'Все 5 шагов выполнены. Отчёт отправлен.' : 'Pipeline прерван. Шаги после ошибки не выполняются.'}
            </div>
          )}

          {showWarning && (
            <div style={{ background: '#431407', border: '1px solid #f59e0b', borderRadius: '8px', padding: '0.75rem', fontSize: '0.78rem', color: '#fcd34d', marginBottom: '1rem', lineHeight: 1.5 }}>
              Без `if (err) return` следующий колбэк вызвался бы с undefined!
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button style={btn(isRunning)} onClick={handleRun} disabled={isRunning}>
              {isRunning ? 'Выполняется...' : 'Запустить'}
            </button>
            <button style={btn(isRunning, '#374151')} onClick={handleReset} disabled={isRunning}>Сброс</button>
          </div>
        </div>

        {/* Right: code + timeline */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>КОД (error-first callbacks)</div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', overflowX: 'auto' }}>
            <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7, whiteSpace: 'pre' }}>
              {callbackHellCode.split('\n').map((line, i) => {
                const m = line.match(/уровень (\d+)/)
                const sn = m ? parseInt(m[1]) : null
                const st = sn ? statuses[sn] : null
                const step = sn ? PIPELINE_STEPS[sn - 1] : null
                const hi = st === 'running' || st === 'done' || st === 'error'
                return (
                  <div key={i} style={{ background: hi && step ? `${step.color}18` : 'transparent', borderLeft: hi && step ? `2px solid ${step.color}` : '2px solid transparent', paddingLeft: '0.4rem', transition: 'background 0.3s' }}>
                    {line}
                  </div>
                )
              })}
            </pre>
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.78rem', marginBottom: '0.5rem' }}>TIMELINE ВЫПОЛНЕНИЯ</div>
          <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', minHeight: '120px', maxHeight: '220px', overflowY: 'auto' }}>
            {timeline.length === 0 && <div style={{ color: '#475569', fontSize: '0.8rem' }}>Нажмите "Запустить" для запуска pipeline</div>}
            {timeline.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.25rem', fontSize: '0.75rem' }}>
                <span style={{ color: '#475569', minWidth: '52px', textAlign: 'right' }}>+{e.time}ms</span>
                <span style={{ color: e.color }}>{e.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------
// Task 2.2: Callbacks vs Promises
// -----------------------------------------------

type SideStatus = 'idle' | 'running' | 'done'

const CB_STEPS_CHEAT = [
  { label: 'getUser()',      color: '#3b82f6' },
  { label: 'getPosts()',     color: '#8b5cf6' },
  { label: 'getComments()', color: '#ec4899' },
  { label: 'filterSpam()',  color: '#f59e0b' },
  { label: 'sendReport()',  color: '#10b981' },
]

function getUserP(): Promise<string> {
  return new Promise((res) => setTimeout(() => res('user:Alice'), 500))
}
function getPostsP(u: string): Promise<string> {
  return new Promise((res) => setTimeout(() => res(`posts:[3 posts of ${u}]`), 600))
}
function getCommentsP(p: string): Promise<string> {
  return new Promise((res) => setTimeout(() => res(`comments:[10 cmts for ${p}]`), 700))
}
function filterSpamP(c: string): Promise<string> {
  return new Promise((res) => setTimeout(() => res(`clean:[7 clean from ${c.slice(0, 15)}...]`), 400))
}
function sendReportP(f: string): Promise<string> {
  return new Promise((res) => setTimeout(() => res(`report:sent`), 500))
}

function Task2_2Cheat() {
  const [cbStatus, setCbStatus] = useState<SideStatus>('idle')
  const [promStatus, setPromStatus] = useState<SideStatus>('idle')
  const [cbLogs, setCbLogs] = useState<Array<{ step: number; label: string; time: number; color: string }>>([])
  const [promLogs, setPromLogs] = useState<Array<{ step: number; label: string; time: number; color: string }>>([])
  const [cbStep, setCbStep] = useState(0)
  const [promStep, setPromStep] = useState(0)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)

  const handleRun = () => {
    setCbStatus('running'); setPromStatus('running')
    setCbLogs([]); setPromLogs([]); setCbStep(0); setPromStep(0); setFinished(false)

    let cbDone = false, promDone = false
    const check = () => { if (cbDone && promDone) setFinished(true) }

    // Callback side
    const cbStart = performance.now()
    const addCb = (i: number) => {
      const t = Math.round(performance.now() - cbStart)
      setCbLogs((p) => [...p, { step: i, label: CB_STEPS_CHEAT[i].label, time: t, color: CB_STEPS_CHEAT[i].color }])
      setCbStep(i + 1)
    }
    setTimeout(() => { addCb(0)
      setTimeout(() => { addCb(1)
        setTimeout(() => { addCb(2)
          setTimeout(() => { addCb(3)
            setTimeout(() => { addCb(4); setCbStatus('done'); cbDone = true; check() }, 500)
          }, 400)
        }, 700)
      }, 600)
    }, 500)

    // Promise side
    const pStart = performance.now()
    const addProm = (i: number) => {
      const t = Math.round(performance.now() - pStart)
      setPromLogs((p) => [...p, { step: i, label: CB_STEPS_CHEAT[i].label, time: t, color: CB_STEPS_CHEAT[i].color }])
      setPromStep(i + 1)
    }
    getUserP()
      .then((u) => { addProm(0); return getPostsP(u) })
      .then((p) => { addProm(1); return getCommentsP(p) })
      .then((c) => { addProm(2); return filterSpamP(c) })
      .then((f) => { addProm(3); return sendReportP(f) })
      .then(() => { addProm(4); setPromStatus('done'); promDone = true; check() })
  }

  const handleReset = () => {
    setCbStatus('idle'); setPromStatus('running')
    setCbLogs([]); setPromLogs([]); setCbStep(0); setPromStep(0)
    setHoveredStep(null); setFinished(false)
    setPromStatus('idle')
  }

  const cs: React.CSSProperties = { background: '#0f172a', color: '#e2e8f0', padding: '1.5rem', borderRadius: '12px', fontFamily: "'Fira Code', monospace", fontSize: '0.9rem' }

  const callbackLines = [
    { text: "getUser(userId, (err, user) => {",     step: 0 },
    { text: "  if (err) return onError(err)",        step: 0 },
    { text: "  getPosts(user, (err, posts) => {",    step: 1 },
    { text: "    if (err) return onError(err)",      step: 1 },
    { text: "    getComments(posts, (err, cmts) => {", step: 2 },
    { text: "      if (err) return onError(err)",    step: 2 },
    { text: "      filterSpam(cmts, (err, clean) => {", step: 3 },
    { text: "        if (err) return onError(err)",  step: 3 },
    { text: "        sendReport(clean, (err) => {",  step: 4 },
    { text: "          if (err) return onError(err)", step: 4 },
    { text: "          console.log('done!')",        step: 4 },
    { text: "        })",                            step: 4 },
    { text: "      })",                              step: 3 },
    { text: "    })",                                step: 2 },
    { text: "  })",                                  step: 1 },
    { text: "})",                                    step: 0 },
  ]

  const promiseLines = [
    { text: "getUser(userId)",                        step: 0 },
    { text: "  .then(user => getPosts(user))",        step: 1 },
    { text: "  .then(posts => getComments(posts))",   step: 2 },
    { text: "  .then(cmts => filterSpam(cmts))",      step: 3 },
    { text: "  .then(clean => sendReport(clean))",    step: 4 },
    { text: "  .then(() => console.log('done!'))",    step: 4 },
    { text: "  .catch(err => onError(err))",          step: -1 },
  ]

  const metrics = [
    { label: 'Вложенность',      cb: '5 уровней',               prom: '0 уровней' },
    { label: 'Строк кода',       cb: '~15',                     prom: '~7' },
    { label: 'Обработка ошибок', cb: 'if(err) в каждом уровне', prom: 'один .catch()' },
    { label: 'Читаемость',       cb: 'Пирамида',                prom: 'Плоская цепочка' },
  ]

  const renderCodeCol = (
    lines: { text: string; step: number }[],
    currentStep: number,
    label: string,
    labelColor: string
  ) => (
    <div style={{ flex: 1, minWidth: '260px' }}>
      <div style={{ color: labelColor, fontSize: '0.78rem', marginBottom: '0.4rem', fontWeight: 'bold' }}>{label}</div>
      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.75rem', overflowX: 'auto' }}>
        {lines.map((line, i) => {
          const si = line.step
          const isHovered = hoveredStep === si && si >= 0
          const isActive = si >= 0 && si < currentStep
          const step = si >= 0 ? CB_STEPS_CHEAT[si] : null
          return (
            <div key={i}
              onMouseEnter={() => si >= 0 && setHoveredStep(si)}
              onMouseLeave={() => setHoveredStep(null)}
              style={{
                fontSize: '0.75rem', lineHeight: 1.8, cursor: 'default', whiteSpace: 'pre',
                color: si === -1 ? '#94a3b8' : isActive && step ? step.color : isHovered && step ? `${step.color}cc` : '#64748b',
                background: isHovered && step ? `${step.color}15` : 'transparent',
                borderLeft: isHovered && step ? `2px solid ${step.color}` : '2px solid transparent',
                paddingLeft: '0.3rem', transition: 'all 0.15s',
              }}
            >
              {line.text}
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui' }}>
        Задание 2.2 — Callbacks vs Promises
      </h2>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '0.6rem 1rem', marginBottom: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>
        Наведите на строку кода — подсветится соответствующий шаг в обеих колонках
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {renderCodeCol(callbackLines, cbStep, 'CALLBACK HELL (вложенность: 5)', '#ef4444')}
        {renderCodeCol(promiseLines, promStep, 'PROMISE CHAIN (плоская)', '#10b981')}
      </div>

      {/* Progress bars */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[
          { label: 'Callbacks', logs: cbLogs, color: '#ef4444' },
          { label: 'Promises',  logs: promLogs, color: '#10b981' },
        ].map(({ label, logs, color }) => (
          <div key={label} style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ fontSize: '0.78rem', color, marginBottom: '0.3rem' }}>{label}: {logs.length}/5 шагов</div>
            <div style={{ display: 'flex', gap: '0.3rem' }}>
              {CB_STEPS_CHEAT.map((step, i) => (
                <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i < logs.length ? step.color : '#1e293b', transition: 'background 0.3s', boxShadow: i < logs.length ? `0 0 6px ${step.color}60` : 'none' }} />
              ))}
            </div>
            {logs.length > 0 && (
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                Последний шаг: +{logs[logs.length - 1]?.time ?? 0}ms
              </div>
            )}
          </div>
        ))}
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

      {finished && (
        <div style={{ background: '#052e16', border: '1px solid #10b981', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#6ee7b7' }}>
          Оба варианта завершены с одинаковым результатом. Promise-цепочка — никакой пирамиды.
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          onClick={handleRun}
          disabled={cbStatus === 'running' || promStatus === 'running'}
          style={{ padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none', cursor: (cbStatus === 'running' || promStatus === 'running') ? 'not-allowed' : 'pointer', background: (cbStatus === 'running' || promStatus === 'running') ? '#1e293b' : '#3b82f6', color: (cbStatus === 'running' || promStatus === 'running') ? '#475569' : '#fff', fontFamily: 'inherit', fontSize: '0.85rem' }}
        >
          {(cbStatus === 'running' || promStatus === 'running') ? 'Выполняется...' : 'Запустить оба'}
        </button>
        <button onClick={handleReset} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: '#374151', color: '#e5e7eb', fontFamily: 'inherit', fontSize: '0.85rem' }}>Сброс</button>
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
      <h2>Подсказки: Level 2 — Callbacks</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.1: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Вложенность обязательна</strong>: следующий шаг запускается строго внутри
            колбэка предыдущего — именно это создаёт "пирамиду"
          </li>
          <li>
            <strong>Error-first сигнатура</strong>: всегда <code>(err, result)</code>.
            Если <code>err !== null</code> — вызвать <code>onDone(false)</code> и <code>return</code>
          </li>
          <li>
            <strong>simulateCallback</strong>: <code>setTimeout(() =&gt; {'{'} shouldError ? cb(errMsg, '') : cb(null, result) {'}'}, step.delay)</code>
          </li>
          <li>
            <strong>Timeline</strong>: используйте <code>performance.now() - startRef.current</code> для метки времени
          </li>
          <li>
            <strong>Пирамида CSS</strong>: <code>marginLeft: index * 14 + 'px'</code> на каждом шаге
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.2: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Callback-сторона</strong>: вложенные <code>setTimeout</code> — каждый
            следующий внутри предыдущего колбэка, с задержками 500/600/700/400/500ms
          </li>
          <li>
            <strong>Promise-сторона</strong>: <code>getUser().then(getPosts).then(getComments)...</code>
            — плоская цепочка, каждый <code>.then()</code> возвращает следующий промис
          </li>
          <li>
            <strong>Hover-подсветка</strong>: <code>{'onMouseEnter={() => setHoveredStep(line.step)}'}</code>,
            применять ко всем строкам с одинаковым номером шага в обеих колонках
          </li>
          <li>
            <strong>Параллельный запуск</strong>: обе стороны стартуют в одном <code>handleRun()</code>
            без <code>await</code> между ними
          </li>
          <li>
            <strong>Синхронизация завершения</strong>: флаги <code>cbDone</code> и <code>promDone</code>
            в замыкании, <code>setFinished(true)</code> когда оба true
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Живые компоненты</h3>
        <Task2_1Cheat />
        <div style={{ marginTop: '1.5rem' }} />
        <Task2_2Cheat />
      </section>
    </div>
  )
}
