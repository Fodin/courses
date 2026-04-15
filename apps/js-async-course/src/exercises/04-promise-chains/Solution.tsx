import { useState, useEffect, useRef } from 'react'

// ============================================
// Task 4.1 Solution: Promise Pipeline Visualizer
// ============================================

interface PipelineStage {
  id: number
  name: string
  icon: string
  input: string
  output: string
  color: string
  description: string
}

const STAGES: PipelineStage[] = [
  {
    id: 1,
    name: 'fetchUser',
    icon: '👤',
    input: 'userId: 42',
    output: '{ id: 42, name: "Alice" }',
    color: '#3b82f6',
    description: 'Загружаем пользователя по ID',
  },
  {
    id: 2,
    name: 'getPosts',
    icon: '📝',
    input: '{ id: 42, name: "Alice" }',
    output: '[post1, post2, post3, post4, post5]',
    color: '#8b5cf6',
    description: 'Получаем посты пользователя',
  },
  {
    id: 3,
    name: 'filterRecent',
    icon: '🗓️',
    input: '[post1, post2, post3, post4, post5]',
    output: '[post3, post4, post5]',
    color: '#ec4899',
    description: 'Фильтруем посты за последние 7 дней',
  },
  {
    id: 4,
    name: 'sortByLikes',
    icon: '❤️',
    input: '[post3, post4, post5]',
    output: '[post5(32), post4(18), post3(7)]',
    color: '#f59e0b',
    description: 'Сортируем по количеству лайков',
  },
  {
    id: 5,
    name: 'formatOutput',
    icon: '✨',
    input: '[post5(32), post4(18), post3(7)]',
    output: '"Top posts: post5, post4, post3"',
    color: '#10b981',
    description: 'Форматируем в строку для отображения',
  },
]

const RETURN_MODES = ['value', 'promise'] as const
type ReturnMode = (typeof RETURN_MODES)[number]

export function Task4_1_Solution() {
  const [activeStage, setActiveStage] = useState<number>(-1)
  const [running, setRunning] = useState(false)
  const [returnMode, setReturnMode] = useState<ReturnMode>('value')
  const [modeStage] = useState(2) // stage index that switches behaviour (0-indexed)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const runPipeline = () => {
    if (running) return
    setRunning(true)
    setActiveStage(-1)

    STAGES.forEach((_, i) => {
      timerRef.current = setTimeout(() => {
        setActiveStage(i)
        if (i === STAGES.length - 1) {
          setTimeout(() => {
            setRunning(false)
          }, 700)
        }
      }, (i + 1) * 700)
    })
  }

  const reset = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setActiveStage(-1)
    setRunning(false)
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const btnStyle = (disabled?: boolean, color?: string): React.CSSProperties => ({
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : (color ?? '#3b82f6'),
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.82rem',
  })

  const codeSnippet = returnMode === 'value'
    ? `fetchUser(42)
  .then(user => getPosts(user))       // return Promise
  .then(posts => filterRecent(posts)) // return Promise
  .then(recent => sortByLikes(recent))
  .then(sorted => formatOutput(sorted))`
    : `fetchUser(42)
  .then(user => getPosts(user))
  .then(posts => filterRecent(posts))
  // вот здесь — return value вместо Promise:
  .then(recent => recent.sort(...))   // ✅ тот же результат!
  .then(sorted => formatOutput(sorted))`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 4.1 — Promise Pipeline: цепочка трансформаций
      </h2>

      {/* Return mode toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Шаг {modeStage + 1} (.then) возвращает:</span>
        {RETURN_MODES.map(m => (
          <button
            key={m}
            style={{
              padding: '0.3rem 0.9rem',
              borderRadius: '20px',
              border: `1px solid ${returnMode === m ? '#3b82f6' : '#334155'}`,
              cursor: 'pointer',
              background: returnMode === m ? '#1d4ed8' : '#1e293b',
              color: returnMode === m ? '#fff' : '#94a3b8',
              fontFamily: 'inherit',
              fontSize: '0.78rem',
            }}
            onClick={() => { setReturnMode(m); reset() }}
          >
            {m === 'value' ? 'return Promise (обычно)' : 'return value (тот же эффект)'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Pipeline stages */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.6rem' }}>
            КОНВЕЙЕР (запускается сверху вниз)
          </div>
          {STAGES.map((stage, i) => {
            const isActive = activeStage === i
            const isDone = activeStage > i
            const isMode = i === modeStage
            return (
              <div key={stage.id}>
                <div style={{
                  background: isActive ? `${stage.color}22` : isDone ? '#1e293b' : '#0f172a',
                  border: `1px solid ${isActive ? stage.color : isDone ? '#334155' : '#1e293b'}`,
                  borderRadius: '8px',
                  padding: '0.75rem',
                  transition: 'all 0.35s',
                  opacity: activeStage === -1 ? 0.7 : (isDone || isActive ? 1 : 0.35),
                  position: 'relative',
                }}>
                  {isMode && (
                    <div style={{
                      position: 'absolute',
                      top: '-1px',
                      right: '0.5rem',
                      background: '#7c3aed',
                      color: '#e9d5ff',
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '0 0 4px 4px',
                    }}>
                      {returnMode === 'value' ? 'return Promise' : 'return value'}
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '1rem' }}>{stage.icon}</span>
                    <span style={{ color: stage.color, fontWeight: 'bold', fontSize: '0.85rem' }}>
                      .then({stage.name})
                    </span>
                    {isDone && <span style={{ color: '#10b981', fontSize: '0.75rem', marginLeft: 'auto' }}>✓ выполнен</span>}
                    {isActive && <span style={{ color: stage.color, fontSize: '0.75rem', marginLeft: 'auto' }}>⟳ сейчас</span>}
                  </div>
                  {(isActive || isDone) && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem' }}>
                      <span style={{ color: '#475569' }}>вход: </span>
                      <span style={{ color: '#94a3b8' }}>{stage.input}</span>
                    </div>
                  )}
                  {(isActive || isDone) && (
                    <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.15rem' }}>
                      <span style={{ color: '#475569' }}>выход: </span>
                      <span style={{ color: '#6ee7b7' }}>{stage.output}</span>
                    </div>
                  )}
                </div>
                {/* Arrow connector */}
                {i < STAGES.length - 1 && (
                  <div style={{
                    textAlign: 'center',
                    color: isDone ? '#3b82f6' : '#1e293b',
                    fontSize: '1.2rem',
                    margin: '0.1rem 0',
                    transition: 'color 0.4s',
                  }}>
                    ↓
                  </div>
                )}
              </div>
            )
          })}

          {activeStage === STAGES.length - 1 && !running && (
            <div style={{
              background: '#052e16',
              border: '1px solid #10b981',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              marginTop: '0.5rem',
              fontSize: '0.82rem',
              color: '#6ee7b7',
            }}>
              Результат: "Top posts: post5, post4, post3"
            </div>
          )}
        </div>

        {/* Code panel + explanation */}
        <div style={{ minWidth: '260px', flex: 1 }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.6rem' }}>КОД</div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '0.75rem' }}>
            <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>
              {codeSnippet}
            </pre>
          </div>

          <div style={{
            background: '#1e293b',
            borderRadius: '8px',
            padding: '0.75rem',
            fontSize: '0.78rem',
            lineHeight: 1.6,
            color: '#94a3b8',
          }}>
            <div style={{ color: '#f8fafc', fontWeight: 'bold', marginBottom: '0.4rem' }}>
              Ключевое правило .then():
            </div>
            <div style={{ marginBottom: '0.35rem' }}>
              Каждый <span style={{ color: '#60a5fa' }}>.then()</span> создаёт{' '}
              <span style={{ color: '#f59e0b' }}>новый промис</span>.
            </div>
            <div style={{ marginBottom: '0.35rem' }}>
              Если коллбэк возвращает <span style={{ color: '#10b981' }}>обычное значение</span> —
              оно автоматически оборачивается в <code>Promise.resolve(value)</code>.
            </div>
            <div>
              Если возвращает <span style={{ color: '#8b5cf6' }}>Promise</span> —
              следующий <code>.then()</code> ждёт его разрешения.
            </div>
            <div style={{ marginTop: '0.6rem', color: '#10b981', fontWeight: 'bold' }}>
              Результат одинаков в обоих случаях!
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button style={btnStyle(running)} onClick={runPipeline} disabled={running}>
              {running ? 'Выполняется...' : 'Запустить конвейер'}
            </button>
            <button style={btnStyle(false, '#374151')} onClick={reset}>
              Сброс
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 4.2 Solution: Error Propagation & Recovery
// ============================================

type TrackState = 'idle' | 'fulfilled' | 'rejected' | 'skipped' | 'caught' | 'recovered'

interface ChainStep {
  id: number
  label: string
  type: 'then' | 'catch'
}

const CHAIN_STEPS: ChainStep[] = [
  { id: 1, label: '.then(step1)', type: 'then' },
  { id: 2, label: '.then(step2)', type: 'then' },
  { id: 3, label: '.then(step3)', type: 'then' },
  { id: 4, label: '.then(step4)', type: 'then' },
  { id: 5, label: '.then(step5)', type: 'then' },
  { id: 6, label: '.catch(err)', type: 'catch' },
]

function computeStates(
  brokenAt: number | null,
  recoveryEnabled: boolean
): TrackState[] {
  // brokenAt is 1-indexed step number (1..5), null = no error
  const states: TrackState[] = CHAIN_STEPS.map(() => 'idle')

  if (brokenAt === null) {
    // happy path
    CHAIN_STEPS.forEach((s, i) => {
      states[i] = s.type === 'then' ? 'fulfilled' : 'idle'
    })
    return states
  }

  CHAIN_STEPS.forEach((step, i) => {
    const stepNum = i + 1 // 1-indexed
    if (step.type === 'then') {
      if (stepNum < brokenAt) {
        states[i] = 'fulfilled'
      } else if (stepNum === brokenAt) {
        states[i] = 'rejected'
      } else {
        states[i] = 'skipped' // error flying past
      }
    } else {
      // catch
      states[i] = recoveryEnabled ? 'recovered' : 'caught'
    }
  })

  return states
}

const STATE_COLORS: Record<TrackState, string> = {
  idle: '#1e293b',
  fulfilled: '#052e16',
  rejected: '#450a0a',
  skipped: '#1e1e2e',
  caught: '#451a03',
  recovered: '#052e16',
}

const STATE_BORDER: Record<TrackState, string> = {
  idle: '#334155',
  fulfilled: '#10b981',
  rejected: '#ef4444',
  skipped: '#334155',
  caught: '#f59e0b',
  recovered: '#10b981',
}

const STATE_LABEL: Record<TrackState, string> = {
  idle: '',
  fulfilled: '✓ fulfilled',
  rejected: '✗ throw Error',
  skipped: '— пропущен (ошибка летит)',
  caught: '⚠ caught — цепочка стоп',
  recovered: '↩ recovered → продолжает',
}

export function Task4_2_Solution() {
  const [brokenAt, setBrokenAt] = useState<number | null>(null)
  const [recoveryEnabled, setRecoveryEnabled] = useState(false)
  const [afterCatchState, setAfterCatchState] = useState<TrackState>('idle')

  const states = computeStates(brokenAt, recoveryEnabled)

  useEffect(() => {
    if (brokenAt !== null && recoveryEnabled) {
      setAfterCatchState('fulfilled')
    } else {
      setAfterCatchState('idle')
    }
  }, [brokenAt, recoveryEnabled])

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const toggleStyle = (active: boolean, color: string): React.CSSProperties => ({
    padding: '0.3rem 0.8rem',
    borderRadius: '20px',
    border: `1px solid ${active ? color : '#334155'}`,
    cursor: 'pointer',
    background: active ? `${color}33` : '#1e293b',
    color: active ? color : '#64748b',
    fontFamily: 'inherit',
    fontSize: '0.75rem',
    transition: 'all 0.2s',
  })

  const codeSnippet = brokenAt === null
    ? `Promise.resolve('данные')
  .then(step1)    // ✓
  .then(step2)    // ✓
  .then(step3)    // ✓
  .then(step4)    // ✓
  .then(step5)    // ✓
  .catch(handleError) // не вызывается`
    : `Promise.resolve('данные')
  .then(step1)    // ${brokenAt > 1 ? '✓' : '✗ throw Error!'}
  .then(step2)    // ${brokenAt > 2 ? '✓' : brokenAt === 2 ? '✗ throw Error!' : '— пропущен'}
  .then(step3)    // ${brokenAt > 3 ? '✓' : brokenAt === 3 ? '✗ throw Error!' : '— пропущен'}
  .then(step4)    // ${brokenAt > 4 ? '✓' : brokenAt === 4 ? '✗ throw Error!' : '— пропущен'}
  .then(step5)    // ${brokenAt === 5 ? '✗ throw Error!' : brokenAt !== null && brokenAt < 5 ? '— пропущен' : '✓'}
  .catch(err => ${recoveryEnabled ? "{ return 'восстановились' }" : "handleError(err)"})${recoveryEnabled ? '\n  .then(afterCatch) // ✓ цепочка продолжается!' : ''}`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 4.2 — Распространение ошибок и восстановление
      </h2>

      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        {/* Controls */}
        <div style={{ minWidth: '200px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            СЛОМАТЬ НА ШАГЕ:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            <button
              style={toggleStyle(brokenAt === null, '#10b981')}
              onClick={() => setBrokenAt(null)}
            >
              Нет ошибки
            </button>
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                style={toggleStyle(brokenAt === n, '#ef4444')}
                onClick={() => setBrokenAt(n)}
              >
                Шаг {n}
              </button>
            ))}
          </div>

          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            РЕЖИМ .CATCH():
          </div>
          <button
            style={toggleStyle(recoveryEnabled, '#f59e0b')}
            onClick={() => setRecoveryEnabled(v => !v)}
          >
            {recoveryEnabled ? 'Recovery: ВКЛ' : 'Recovery: ВЫКЛ'}
          </button>

          <div style={{
            marginTop: '1rem',
            background: '#1e293b',
            borderRadius: '8px',
            padding: '0.7rem',
            fontSize: '0.75rem',
            lineHeight: 1.6,
            color: '#94a3b8',
          }}>
            {brokenAt === null ? (
              <>
                <span style={{ color: '#10b981' }}>Нет ошибки:</span> все .then() выполняются
                по зелёной дорожке. .catch() молчит.
              </>
            ) : recoveryEnabled ? (
              <>
                <span style={{ color: '#f59e0b' }}>Recovery вкл:</span> ошибка поймана, .catch()
                возвращает значение → следующий .then() получает его и цепочка продолжается!
              </>
            ) : (
              <>
                <span style={{ color: '#ef4444' }}>Ошибка на шаге {brokenAt}:</span> все
                последующие .then() пропускаются. Ошибка "летит" к .catch().
              </>
            )}
          </div>
        </div>

        {/* Chain visualization */}
        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
            ЦЕПОЧКА
          </div>
          {CHAIN_STEPS.map((step, i) => {
            const state = states[i]
            return (
              <div key={step.id}>
                <div style={{
                  background: STATE_COLORS[state],
                  border: `1px solid ${STATE_BORDER[state]}`,
                  borderRadius: '8px',
                  padding: '0.6rem 0.9rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.3s',
                }}>
                  <span style={{
                    color: step.type === 'catch' ? '#fbbf24' : '#60a5fa',
                    fontWeight: 'bold',
                    fontSize: '0.82rem',
                  }}>
                    {step.label}
                  </span>
                  {state !== 'idle' && (
                    <span style={{ fontSize: '0.7rem', color: STATE_BORDER[state] }}>
                      {STATE_LABEL[state]}
                    </span>
                  )}
                </div>
                {/* Connector */}
                {i < CHAIN_STEPS.length - 1 && (
                  <div style={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    margin: '0.05rem 0',
                    color: state === 'fulfilled' ? '#10b981'
                      : state === 'rejected' || state === 'skipped' ? '#ef4444'
                      : '#334155',
                    transition: 'color 0.3s',
                  }}>
                    {state === 'rejected' || state === 'skipped' ? '↓' : '↓'}
                  </div>
                )}
              </div>
            )
          })}

          {/* After catch */}
          {recoveryEnabled && (
            <>
              <div style={{ textAlign: 'center', fontSize: '1.1rem', margin: '0.05rem 0', color: '#10b981' }}>
                ↓
              </div>
              <div style={{
                background: STATE_COLORS.fulfilled,
                border: `1px solid ${STATE_BORDER.fulfilled}`,
                borderRadius: '8px',
                padding: '0.6rem 0.9rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                transition: 'all 0.3s',
                opacity: afterCatchState === 'fulfilled' ? 1 : 0.3,
              }}>
                <span style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '0.82rem' }}>
                  .then(afterCatch)
                </span>
                <span style={{ fontSize: '0.7rem', color: '#10b981' }}>
                  {afterCatchState === 'fulfilled' ? '✓ цепочка продолжается' : ''}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Code panel */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginBottom: '0.5rem' }}>КОД</div>
          <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
            <pre style={{ margin: 0, fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.7 }}>
              {codeSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 4.3 Solution: Microtasks Visualizer
// ============================================

interface QueueItem {
  id: string
  label: string
  type: 'microtask' | 'macrotask' | 'sync'
  color: string
}

interface ExecStep {
  description: string
  stackItems: string[]
  microtasks: QueueItem[]
  macrotasks: QueueItem[]
  output: string[]
  highlight: number // line index in code (0-indexed)
}

const CODE_LINES_4_3 = [
  "console.log('A')                    // синхронный",
  "Promise.resolve().then(() => {",
  "  console.log('B')                  // микротаск 1",
  "}).then(() => {",
  "  console.log('C')                  // микротаск 2",
  "})",
  "setTimeout(() => {",
  "  console.log('D')                  // макротаск",
  "}, 0)",
  "console.log('E')                    // синхронный",
]

const EXEC_STEPS: ExecStep[] = [
  {
    description: 'Начало: Call Stack и очереди пусты.',
    stackItems: [],
    microtasks: [],
    macrotasks: [],
    output: [],
    highlight: -1,
  },
  {
    description: 'Синхронно: console.log("A") → выводит "A" и сразу возвращается.',
    stackItems: ['console.log("A")'],
    microtasks: [],
    macrotasks: [],
    output: ['A'],
    highlight: 0,
  },
  {
    description: 'Promise.resolve() уже fulfilled. .then(колбэк1) регистрирует колбэк в Microtask Queue.',
    stackItems: ['Promise.resolve().then(...)'],
    microtasks: [{ id: 'm1', label: 'колбэк1 (→ "B")', type: 'microtask', color: '#8b5cf6' }],
    macrotasks: [],
    output: ['A'],
    highlight: 1,
  },
  {
    description: 'setTimeout(fn, 0) регистрирует fn в Macrotask Queue (очередь задач).',
    stackItems: ['setTimeout(fn, 0)'],
    microtasks: [{ id: 'm1', label: 'колбэк1 (→ "B")', type: 'microtask', color: '#8b5cf6' }],
    macrotasks: [{ id: 't1', label: 'setTimeout cb (→ "D")', type: 'macrotask', color: '#f59e0b' }],
    output: ['A'],
    highlight: 6,
  },
  {
    description: 'Синхронно: console.log("E") → выводит "E". Call Stack теперь пуст.',
    stackItems: ['console.log("E")'],
    microtasks: [{ id: 'm1', label: 'колбэк1 (→ "B")', type: 'microtask', color: '#8b5cf6' }],
    macrotasks: [{ id: 't1', label: 'setTimeout cb (→ "D")', type: 'macrotask', color: '#f59e0b' }],
    output: ['A', 'E'],
    highlight: 9,
  },
  {
    description: 'Call Stack пуст → Event Loop берёт ВСЕ микротаски. Выполняется колбэк1 → "B". Он создаёт ещё один .then() → новый микротаск.',
    stackItems: ['колбэк1()'],
    microtasks: [{ id: 'm2', label: 'колбэк2 (→ "C")', type: 'microtask', color: '#ec4899' }],
    macrotasks: [{ id: 't1', label: 'setTimeout cb (→ "D")', type: 'macrotask', color: '#f59e0b' }],
    output: ['A', 'E', 'B'],
    highlight: 2,
  },
  {
    description: 'Microtask Queue ещё не пуст → выполняем колбэк2 → "C".',
    stackItems: ['колбэк2()'],
    microtasks: [],
    macrotasks: [{ id: 't1', label: 'setTimeout cb (→ "D")', type: 'macrotask', color: '#f59e0b' }],
    output: ['A', 'E', 'B', 'C'],
    highlight: 4,
  },
  {
    description: 'Microtask Queue пуст. Только теперь Event Loop берёт макротаск из setTimeout → "D".',
    stackItems: ['setTimeout cb()'],
    microtasks: [],
    macrotasks: [],
    output: ['A', 'E', 'B', 'C', 'D'],
    highlight: 7,
  },
  {
    description: 'Всё выполнено. Порядок: A → E → B → C → D.',
    stackItems: [],
    microtasks: [],
    macrotasks: [],
    output: ['A', 'E', 'B', 'C', 'D'],
    highlight: -1,
  },
]

export function Task4_3_Solution() {
  const [stepIndex, setStepIndex] = useState(0)
  const [showStarvation, setShowStarvation] = useState(false)
  const [starvationRunning, setStarvationRunning] = useState(false)
  const [macroCount, setMacroCount] = useState(0)
  const [microCount, setMicroCount] = useState(0)
  const starvRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const currentStep = EXEC_STEPS[stepIndex]

  const containerStyle: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const btnStyle = (disabled?: boolean, color?: string): React.CSSProperties => ({
    padding: '0.4rem 1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : (color ?? '#3b82f6'),
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
  })

  const startStarvation = () => {
    setStarvationRunning(true)
    setMacroCount(0)
    setMicroCount(0)
    // Simulate microtask starvation: microtasks keep growing, macrotask never runs
    let micro = 0
    let macro = 0
    starvRef.current = setInterval(() => {
      micro += 10
      // macrotask gets stuck — only increments rarely to show it's blocked
      if (micro % 50 === 0) macro += 1
      setMicroCount(micro)
      setMacroCount(macro)
    }, 100)
    // Stop after 3s
    setTimeout(() => {
      if (starvRef.current) clearInterval(starvRef.current)
      setStarvationRunning(false)
    }, 3000)
  }

  useEffect(() => {
    return () => {
      if (starvRef.current) clearInterval(starvRef.current)
    }
  }, [])

  const queueItemStyle = (item: QueueItem): React.CSSProperties => ({
    background: `${item.color}22`,
    border: `1px solid ${item.color}`,
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    fontSize: '0.72rem',
    color: item.color,
    marginBottom: '0.2rem',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 4.3 — Микротаски промисов и Event Loop
      </h2>

      {/* Tab toggle */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        {(['main', 'starvation'] as const).map(tab => (
          <button
            key={tab}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.82rem',
              background: (tab === 'main') === !showStarvation ? '#1e293b' : '#0f172a',
              color: (tab === 'main') === !showStarvation ? '#60a5fa' : '#64748b',
              borderBottom: (tab === 'main') === !showStarvation ? '2px solid #3b82f6' : '2px solid transparent',
            }}
            onClick={() => setShowStarvation(tab === 'starvation')}
          >
            {tab === 'main' ? 'Пошаговое выполнение' : 'Starvation (бесконечные микротаски)'}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {!showStarvation ? (
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {/* Code panel */}
            <div style={{ flex: 1, minWidth: '240px' }}>
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.5rem' }}>КОД</div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem' }}>
                {CODE_LINES_4_3.map((line, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      gap: '0.5rem',
                      background: currentStep.highlight === i ? 'rgba(59,130,246,0.15)' : 'transparent',
                      borderLeft: currentStep.highlight === i ? '3px solid #3b82f6' : '3px solid transparent',
                      paddingLeft: '0.4rem',
                      borderRadius: '2px',
                      transition: 'background 0.2s',
                    }}
                  >
                    <span style={{ color: '#475569', minWidth: '1.2rem', fontSize: '0.7rem', alignSelf: 'center' }}>
                      {i + 1}
                    </span>
                    <span style={{ color: '#cbd5e1', fontSize: '0.73rem', lineHeight: 1.6 }}>{line}</span>
                  </div>
                ))}
              </div>

              {/* Output */}
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginTop: '0.75rem', marginBottom: '0.35rem' }}>
                ВЫВОД В КОНСОЛЬ
              </div>
              <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.6rem 0.75rem', minHeight: '40px' }}>
                {currentStep.output.length === 0 ? (
                  <span style={{ color: '#475569', fontSize: '0.75rem' }}>(пусто)</span>
                ) : (
                  <span style={{ color: '#10b981', fontSize: '0.82rem', letterSpacing: '0.08em' }}>
                    {currentStep.output.join(', ')}
                  </span>
                )}
              </div>
            </div>

            {/* Queues */}
            <div style={{ minWidth: '180px' }}>
              {/* Call Stack */}
              <div style={{ color: '#94a3b8', fontSize: '0.72rem', marginBottom: '0.35rem' }}>CALL STACK</div>
              <div style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.6rem',
                minHeight: '50px',
                marginBottom: '0.75rem',
              }}>
                {currentStep.stackItems.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '0.72rem', textAlign: 'center' }}>(пустой)</div>
                ) : (
                  currentStep.stackItems.map((item, i) => (
                    <div key={i} style={{
                      background: '#1d4ed8',
                      borderRadius: '4px',
                      padding: '0.3rem 0.5rem',
                      fontSize: '0.72rem',
                      color: '#bfdbfe',
                      marginBottom: '0.2rem',
                    }}>
                      {item}
                    </div>
                  ))
                )}
              </div>

              {/* Microtask Queue */}
              <div style={{ color: '#a78bfa', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                MICROTASK QUEUE (приоритет выше)
              </div>
              <div style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.6rem',
                minHeight: '50px',
                marginBottom: '0.75rem',
                border: '1px solid #4c1d95',
              }}>
                {currentStep.microtasks.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '0.72rem', textAlign: 'center' }}>(пусто)</div>
                ) : (
                  currentStep.microtasks.map(item => (
                    <div key={item.id} style={queueItemStyle(item)}>{item.label}</div>
                  ))
                )}
              </div>

              {/* Macrotask Queue */}
              <div style={{ color: '#fbbf24', fontSize: '0.72rem', marginBottom: '0.35rem' }}>
                MACROTASK QUEUE (setTimeout, etc.)
              </div>
              <div style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.6rem',
                minHeight: '50px',
                border: '1px solid #78350f',
              }}>
                {currentStep.macrotasks.length === 0 ? (
                  <div style={{ color: '#475569', fontSize: '0.72rem', textAlign: 'center' }}>(пусто)</div>
                ) : (
                  currentStep.macrotasks.map(item => (
                    <div key={item.id} style={queueItemStyle(item)}>{item.label}</div>
                  ))
                )}
              </div>
            </div>

            {/* Description */}
            <div style={{ flex: '0 0 100%' }}>
              <div style={{
                background: '#0f172a',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.82rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                minHeight: '48px',
              }}>
                <span style={{ color: '#60a5fa' }}>Шаг {stepIndex}/{EXEC_STEPS.length - 1}: </span>
                {currentStep.description}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <button
                  style={btnStyle(stepIndex >= EXEC_STEPS.length - 1)}
                  onClick={() => setStepIndex(s => Math.min(s + 1, EXEC_STEPS.length - 1))}
                  disabled={stepIndex >= EXEC_STEPS.length - 1}
                >
                  Шаг вперёд →
                </button>
                <button
                  style={btnStyle(stepIndex === 0, '#374151')}
                  onClick={() => setStepIndex(0)}
                  disabled={stepIndex === 0}
                >
                  Сброс
                </button>
                <span style={{ color: '#475569', fontSize: '0.75rem', alignSelf: 'center' }}>
                  {stepIndex}/{EXEC_STEPS.length - 1}
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Starvation demo */
          <div>
            <div style={{
              background: '#0f172a',
              borderRadius: '8px',
              padding: '0.85rem',
              marginBottom: '1rem',
            }}>
              <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7 }}>
{`// Starvation: рекурсивные микротаски блокируют макротаски
function recursive() {
  Promise.resolve().then(recursive) // ← бесконечно!
}

recursive()

setTimeout(() => {
  console.log('Я никогда не выполнюсь!')
}, 0)`}
              </pre>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <div style={{
                flex: 1,
                background: '#2e1065',
                border: '1px solid #7c3aed',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
              }}>
                <div style={{ color: '#a78bfa', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  MICROTASK QUEUE
                </div>
                <div style={{ color: '#7c3aed', fontSize: '2rem', fontWeight: 'bold' }}>
                  {starvationRunning ? `${microCount}+` : '∞'}
                </div>
                <div style={{ color: '#6d28d9', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                  микротасков в очереди
                </div>
              </div>
              <div style={{
                flex: 1,
                background: '#451a03',
                border: '1px solid #b45309',
                borderRadius: '8px',
                padding: '1rem',
                textAlign: 'center',
                opacity: 0.6,
              }}>
                <div style={{ color: '#fbbf24', fontSize: '0.72rem', marginBottom: '0.3rem' }}>
                  MACROTASK (setTimeout)
                </div>
                <div style={{ color: '#d97706', fontSize: '2rem', fontWeight: 'bold' }}>
                  {macroCount}
                </div>
                <div style={{ color: '#b45309', fontSize: '0.7rem', marginTop: '0.25rem' }}>
                  выполнений (почти никогда)
                </div>
              </div>
            </div>

            <div style={{
              background: '#450a0a',
              border: '1px solid #ef4444',
              borderRadius: '8px',
              padding: '0.75rem',
              fontSize: '0.82rem',
              color: '#fca5a5',
              lineHeight: 1.6,
              marginBottom: '1rem',
            }}>
              <strong style={{ color: '#ef4444' }}>Starvation (голодание):</strong> пока Microtask Queue не пуст —
              Event Loop не переходит к макротаскам. Бесконечные рекурсивные промисы
              полностью блокируют setTimeout, setInterval и рендеринг браузера.
            </div>

            <button
              style={btnStyle(starvationRunning, '#7c3aed')}
              onClick={startStarvation}
              disabled={starvationRunning}
            >
              {starvationRunning ? 'Симулируется...' : 'Симулировать starvation (3 сек)'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
