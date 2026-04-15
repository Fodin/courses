import { useState, useRef } from 'react'

// ============================================
// Shared implementations
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pipe(...fns: Array<(x: any) => any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any) => fns.reduce((acc, fn) => fn(acc), value)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function compose(...fns: Array<(x: any) => any>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any) => fns.reduceRight((acc, fn) => fn(acc), value)
}

// ============================================
// Task 4.1 Solution: pipe/compose visualizer
// ============================================

type StringFn = { id: string; label: string; fn: (s: string) => string }

const STRING_FNS: StringFn[] = [
  { id: 'trim',       label: 'trim',          fn: (s) => s.trim() },
  { id: 'toLower',    label: 'toLower',        fn: (s) => s.toLowerCase() },
  { id: 'toUpper',    label: 'toUpper',        fn: (s) => s.toUpperCase() },
  { id: 'capitalize', label: 'capitalize',     fn: (s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() },
  { id: 'addExclaim', label: 'addExclaim(!)',  fn: (s) => s + '!' },
  { id: 'getLength',  label: 'getLength',      fn: (s) => String(s.length) },
  { id: 'double',     label: 'double(x2)',     fn: (s) => s.repeat(2) },
  { id: 'addPrefix',  label: 'addPrefix(>)',   fn: (s) => '> ' + s },
]

interface StepResult {
  fnLabel: string
  output: string
}

export function Task4_1_Solution() {
  const [input, setInput] = useState('  Hello World  ')
  const [pipeline, setPipeline] = useState<string[]>([])
  const [mode, setMode] = useState<'pipe' | 'compose'>('pipe')
  const [steps, setSteps] = useState<StepResult[]>([])
  const [ran, setRan] = useState(false)

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  }

  const btnStyle: React.CSSProperties = {
    background: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.35rem 0.75rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
  }

  const addToPipeline = (id: string) => {
    setPipeline(prev => [...prev, id])
    setRan(false)
  }

  const removeStep = (index: number) => {
    setPipeline(prev => prev.filter((_, i) => i !== index))
    setRan(false)
  }

  const run = () => {
    const orderedIds = mode === 'pipe' ? pipeline : [...pipeline].reverse()
    const fns = orderedIds.map(id => STRING_FNS.find(f => f.id === id)!.fn)
    const labels = orderedIds.map(id => STRING_FNS.find(f => f.id === id)!.label)

    const results: StepResult[] = []
    let current = input
    fns.forEach((fn, i) => {
      current = fn(current)
      results.push({ fnLabel: labels[i], output: current })
    })
    setSteps(results)
    setRan(true)
  }

  const pipelineLabels = pipeline.map(id => STRING_FNS.find(f => f.id === id)!.label)
  const displayOrder = mode === 'pipe' ? pipelineLabels : [...pipelineLabels].reverse()

  const codeStr = pipeline.length === 0
    ? '(функции не добавлены)'
    : mode === 'pipe'
      ? `pipe(\n  ${pipelineLabels.join(',\n  ')}\n)("${input.slice(0, 20)}${input.length > 20 ? '...' : ''}")`
      : `compose(\n  ${[...pipelineLabels].reverse().join(',\n  ')}\n)("${input.slice(0, 20)}${input.length > 20 ? '...' : ''}")`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 4.1 — Реализация pipe и compose</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Выбирайте функции из палитры и стройте пайплайн. Переключатель меняет порядок выполнения.
      </p>

      {/* Mode toggle */}
      <div style={{ ...panelStyle, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>Режим:</span>
        {(['pipe', 'compose'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setRan(false) }}
            style={{
              ...btnStyle,
              background: mode === m ? (m === 'pipe' ? '#3b82f6' : '#8b5cf6') : '#374151',
              borderColor: mode === m ? 'transparent' : '#4b5563',
              color: '#fff',
            }}
          >
            {m}
          </button>
        ))}
        <span style={{ color: '#4b5563', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
          {mode === 'pipe'
            ? 'слева направо: первая добавленная — первая выполненная'
            : 'справа налево: последняя добавленная — первая выполненная'}
        </span>
      </div>

      {/* Implementations */}
      <div style={{ ...panelStyle, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {[
          { label: 'pipe', color: '#93c5fd', code: `const pipe = (...fns) => x =>\n  fns.reduce((acc, fn) => fn(acc), x)` },
          { label: 'compose', color: '#c4b5fd', code: `const compose = (...fns) => x =>\n  fns.reduceRight((acc, fn) => fn(acc), x)` },
        ].map(({ label, color, code }) => (
          <div key={label}>
            <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '0.4rem' }}>{label}:</div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color, margin: 0, overflowX: 'auto' }}>
              {code}
            </pre>
          </div>
        ))}
      </div>

      {/* Palette */}
      <div style={{ ...panelStyle }}>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.6rem' }}>Палитра функций (кликните чтобы добавить):</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {STRING_FNS.map(fn => (
            <button
              key={fn.id}
              onClick={() => addToPipeline(fn.id)}
              style={{ ...btnStyle, background: '#1e3a5f', borderColor: '#3b82f6', color: '#93c5fd' }}
            >
              {fn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pipeline builder */}
      <div style={{ ...panelStyle }}>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
          Пайплайн {mode === 'pipe' ? '(слева направо)' : '(последняя добавленная выполняется первой):'}
        </div>
        {pipeline.length === 0 ? (
          <div style={{ color: '#4b5563', fontSize: '0.82rem' }}>Пайплайн пуст. Добавьте функции из палитры.</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', alignItems: 'center' }}>
            {displayOrder.map((label, i) => {
              const origIndex = mode === 'pipe' ? i : pipeline.length - 1 - i
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  {i > 0 && <span style={{ color: '#4b5563' }}>→</span>}
                  <div style={{
                    background: '#0d2618',
                    border: '1px solid #10b98133',
                    borderRadius: '6px',
                    padding: '0.3rem 0.6rem',
                    fontSize: '0.8rem',
                    color: '#6ee7b7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}>
                    <span>{label}</span>
                    <button
                      onClick={() => removeStep(origIndex)}
                      style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', padding: 0, fontSize: '0.75rem' }}
                    >
                      x
                    </button>
                  </div>
                </div>
              )
            })}
            <button
              onClick={() => { setPipeline([]); setRan(false) }}
              style={{ ...btnStyle, marginLeft: 'auto', color: '#6b7280' }}
            >
              Очистить
            </button>
          </div>
        )}
      </div>

      {/* Input + Run */}
      <div style={{ ...panelStyle, display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ color: '#9ca3af', fontSize: '0.85rem', flex: 1, minWidth: '200px' }}>
          Входная строка:
          <input
            value={input}
            onChange={e => { setInput(e.target.value); setRan(false) }}
            style={{
              display: 'block',
              marginTop: '0.35rem',
              width: '100%',
              background: '#0d1117',
              border: '1px solid #374151',
              borderRadius: '6px',
              padding: '0.4rem 0.6rem',
              color: '#fde68a',
              fontSize: '0.9rem',
              fontFamily: 'monospace',
            }}
          />
        </label>
        <button
          onClick={run}
          disabled={pipeline.length === 0}
          style={{
            ...btnStyle,
            background: pipeline.length === 0 ? '#1f2937' : '#10b981',
            color: pipeline.length === 0 ? '#4b5563' : '#fff',
            borderColor: 'transparent',
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            alignSelf: 'flex-end',
          }}
        >
          Выполнить
        </button>
      </div>

      {/* Code preview */}
      <div style={panelStyle}>
        <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Сгенерированный код:</div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.75rem', color: mode === 'pipe' ? '#93c5fd' : '#c4b5fd', margin: 0, overflowX: 'auto' }}>
          {codeStr}
        </pre>
      </div>

      {/* Step-by-step results */}
      {ran && (
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Пошаговое выполнение:</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.35rem 0.6rem', color: '#6b7280', fontWeight: 'normal', borderBottom: '1px solid #374151', width: '30px' }}>#</th>
                <th style={{ textAlign: 'left', padding: '0.35rem 0.6rem', color: '#6b7280', fontWeight: 'normal', borderBottom: '1px solid #374151' }}>Функция</th>
                <th style={{ textAlign: 'left', padding: '0.35rem 0.6rem', color: '#6b7280', fontWeight: 'normal', borderBottom: '1px solid #374151' }}>Результат</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '0.35rem 0.6rem', color: '#4b5563' }}>0</td>
                <td style={{ padding: '0.35rem 0.6rem', color: '#6b7280' }}>(ввод)</td>
                <td style={{ padding: '0.35rem 0.6rem' }}>
                  <code style={{ color: '#fde68a', background: '#1c1405', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                    "{input}"
                  </code>
                </td>
              </tr>
              {steps.map((step, i) => (
                <tr key={i} style={{ background: i === steps.length - 1 ? '#0d2618' : 'transparent' }}>
                  <td style={{ padding: '0.35rem 0.6rem', color: '#4b5563' }}>{i + 1}</td>
                  <td style={{ padding: '0.35rem 0.6rem', color: '#a5f3fc' }}>{step.fnLabel}</td>
                  <td style={{ padding: '0.35rem 0.6rem' }}>
                    <code style={{
                      color: i === steps.length - 1 ? '#6ee7b7' : '#e5e7eb',
                      background: i === steps.length - 1 ? '#0a1f14' : '#0d1117',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                    }}>
                      "{step.output}"
                    </code>
                    {i === steps.length - 1 && (
                      <span style={{ color: '#10b981', fontSize: '0.75rem', marginLeft: '0.5rem' }}>итог</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.78rem', color: '#9ca3af' }}>
        <strong style={{ color: '#e5e7eb' }}>Ключевое отличие:</strong>{' '}
        <code style={{ color: '#93c5fd' }}>pipe(f, g, h)(x)</code> = <code style={{ color: '#6ee7b7' }}>h(g(f(x)))</code> — левый читается как «сначала f, потом g, потом h».{' '}
        <code style={{ color: '#c4b5fd' }}>compose(f, g, h)(x)</code> = <code style={{ color: '#6ee7b7' }}>f(g(h(x)))</code> — правый: «сначала h, потом g, потом f».
      </div>
    </div>
  )
}

// ============================================
// Task 4.2 Solution: Async pipe
// ============================================

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asyncPipe(...fns: Array<(x: any) => Promise<any>>) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (value: any) => {
    let acc = value
    for (const fn of fns) {
      acc = await fn(acc)
    }
    return acc
  }
}

interface UserData {
  id: string
  name: string
  email: string
  role: string
}

interface EnrichedProfile extends UserData {
  avatar: string
  bio: string
}

interface ValidatedData extends EnrichedProfile {
  accessGranted: boolean
}

interface FormattedResponse {
  display: string
  badge: string
  summary: string
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchUser(id: string): Promise<UserData> {
  await delay(500)
  const users: Record<string, UserData> = {
    '1': { id: '1', name: 'Алексей Петров',   email: 'alexey@example.com', role: 'admin'  },
    '2': { id: '2', name: 'Мария Иванова',    email: 'maria@example.com',  role: 'user'   },
    '3': { id: '3', name: 'Сергей Кузнецов',  email: 'sergey@example.com', role: 'guest'  },
  }
  const user = users[id]
  if (!user) throw new Error(`Пользователь с id=${id} не найден`)
  return user
}

async function enrichProfile(user: UserData): Promise<EnrichedProfile> {
  await delay(300)
  return {
    ...user,
    avatar: `https://avatars.example.com/${user.id}`,
    bio: `${user.role === 'admin' ? 'Администратор' : 'Участник'} системы. Email: ${user.email}`,
  }
}

async function validateAccess(profile: EnrichedProfile): Promise<ValidatedData> {
  await delay(200)
  if (profile.role === 'guest') throw new Error(`Доступ запрещён: роль "${profile.role}" не имеет прав`)
  return { ...profile, accessGranted: true }
}

async function formatResponse(data: ValidatedData): Promise<FormattedResponse> {
  return {
    display: data.name,
    badge: data.role === 'admin' ? 'Admin' : 'User',
    summary: data.bio,
  }
}

interface StepState {
  label: string
  duration: number
  status: 'idle' | 'running' | 'done' | 'error'
  result?: string
}

const PIPELINE_STEPS: { label: string; duration: number }[] = [
  { label: 'fetchUser',        duration: 500 },
  { label: 'enrichProfile',    duration: 300 },
  { label: 'validateAccess',   duration: 200 },
  { label: 'formatResponse',   duration: 0   },
]

export function Task4_2_Solution() {
  const [userId, setUserId] = useState('1')
  const [failAt, setFailAt] = useState<number>(-1)
  const [steps, setSteps] = useState<StepState[]>(PIPELINE_STEPS.map(s => ({ ...s, status: 'idle' })))
  const [finalResult, setFinalResult] = useState<FormattedResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [running, setRunning] = useState(false)
  const runIdRef = useRef(0)

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  }

  const runPipeline = async () => {
    const runId = ++runIdRef.current
    setRunning(true)
    setFinalResult(null)
    setError(null)
    setSteps(PIPELINE_STEPS.map(s => ({ ...s, status: 'idle' })))

    // Build pipeline with optional failure injection
    const makeFetchUser = (id: string) => async (_ignored: unknown) => {
      if (failAt === 0) throw new Error('Симуляция ошибки: fetchUser упал')
      return fetchUser(id)
    }

    const makeEnrich = () => async (user: UserData) => {
      if (failAt === 1) throw new Error('Симуляция ошибки: enrichProfile упал')
      return enrichProfile(user)
    }

    const makeValidate = () => async (profile: EnrichedProfile) => {
      if (failAt === 2) throw new Error('Симуляция ошибки: validateAccess упал')
      return validateAccess(profile)
    }

    const pipeline = asyncPipe(
      makeFetchUser(userId),
      makeEnrich(),
      makeValidate(),
      formatResponse,
    )

    // Manually animate steps by replaying with known delays
    const stepFns = [
      async () => { if (failAt === 0) throw new Error('Симуляция ошибки: fetchUser упал'); return fetchUser(userId) },
      async (user: UserData) => { if (failAt === 1) throw new Error('Симуляция ошибки: enrichProfile упал'); return enrichProfile(user) },
      async (profile: EnrichedProfile) => { if (failAt === 2) throw new Error('Симуляция ошибки: validateAccess упал'); return validateAccess(profile) },
      async (data: ValidatedData) => formatResponse(data),
    ]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let acc: any = null
    try {
      for (let i = 0; i < stepFns.length; i++) {
        if (runIdRef.current !== runId) return
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'running' } : s))
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        acc = await (stepFns[i] as (x: any) => Promise<any>)(acc)
        if (runIdRef.current !== runId) return
        const resultStr = typeof acc === 'object' ? JSON.stringify(acc, null, 0).slice(0, 60) + (JSON.stringify(acc).length > 60 ? '…' : '') : String(acc)
        setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, status: 'done', result: resultStr } : s))
      }
      setFinalResult(acc as FormattedResponse)
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      setError(msg)
      setSteps(prev => {
        const running = prev.findIndex(s => s.status === 'running')
        return prev.map((s, idx) => idx === running ? { ...s, status: 'error' } : s)
      })
    } finally {
      if (runIdRef.current === runId) setRunning(false)
    }
  }

  void runPipeline

  const btnStyle: React.CSSProperties = {
    background: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontFamily: 'monospace',
  }

  const statusColor = (s: StepState['status']) =>
    s === 'done' ? '#10b981' : s === 'running' ? '#f59e0b' : s === 'error' ? '#ef4444' : '#4b5563'

  const asyncPipeCode = `async function asyncPipe(...fns) {
  return async (value) => {
    let acc = value
    for (const fn of fns) {
      acc = await fn(acc)  // ждём каждый шаг
    }
    return acc
  }
}

const pipeline = asyncPipe(
  fetchUser,
  enrichProfile,
  validateAccess,
  formatResponse,
)`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 4.2 — Асинхронный pipe</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <code style={{ color: '#a5f3fc' }}>asyncPipe</code> — pipe для функций, возвращающих Promise.
        Каждый шаг ждёт предыдущий через <code style={{ color: '#fde68a' }}>await</code>.
      </p>

      {/* Implementation */}
      <div style={panelStyle}>
        <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Реализация asyncPipe:</div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#93c5fd', margin: 0, overflowX: 'auto' }}>
          {asyncPipeCode}
        </pre>
      </div>

      {/* Controls */}
      <div style={{ ...panelStyle, display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <label style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          User ID (1–3):
          <select
            value={userId}
            onChange={e => setUserId(e.target.value)}
            style={{ display: 'block', marginTop: '0.3rem', background: '#0d1117', border: '1px solid #374151', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#fde68a', fontSize: '0.85rem', fontFamily: 'monospace' }}
          >
            <option value="1">1 — Алексей (admin)</option>
            <option value="2">2 — Мария (user)</option>
            <option value="3">3 — Сергей (guest, validateAccess упадёт)</option>
            <option value="99">99 — несуществующий (fetchUser упадёт)</option>
          </select>
        </label>
        <label style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          Точка отказа (симуляция):
          <select
            value={failAt}
            onChange={e => setFailAt(Number(e.target.value))}
            style={{ display: 'block', marginTop: '0.3rem', background: '#0d1117', border: '1px solid #374151', borderRadius: '6px', padding: '0.4rem 0.6rem', color: '#f87171', fontSize: '0.85rem', fontFamily: 'monospace' }}
          >
            <option value={-1}>Без ошибок</option>
            <option value={0}>Ошибка в fetchUser</option>
            <option value={1}>Ошибка в enrichProfile</option>
            <option value={2}>Ошибка в validateAccess</option>
          </select>
        </label>
        <button
          onClick={runPipeline}
          disabled={running}
          style={{ ...btnStyle, background: running ? '#374151' : '#10b981', borderColor: 'transparent', color: '#fff', padding: '0.5rem 1.25rem' }}
        >
          {running ? 'Выполняется...' : 'Запустить'}
        </button>
      </div>

      {/* Timeline */}
      <div style={panelStyle}>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Таймлайн пайплайна:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {/* Step number */}
              <div style={{ width: '20px', textAlign: 'right', color: '#4b5563', fontSize: '0.75rem', flexShrink: 0 }}>
                {i + 1}
              </div>
              {/* Label */}
              <div style={{ width: '150px', flexShrink: 0 }}>
                <code style={{ color: statusColor(step.status), fontSize: '0.82rem' }}>{step.label}</code>
              </div>
              {/* Duration bar */}
              <div style={{
                height: '20px',
                width: step.duration > 0 ? `${step.duration / 6}px` : '20px',
                background: step.status === 'running'
                  ? '#92400e'
                  : step.status === 'done'
                    ? '#065f46'
                    : step.status === 'error'
                      ? '#7f1d1d'
                      : '#1f2937',
                borderRadius: '4px',
                border: `1px solid ${statusColor(step.status)}33`,
                transition: 'background 0.3s',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: '6px',
              }}>
                {step.duration > 0 && (
                  <span style={{ color: '#6b7280', fontSize: '0.65rem' }}>{step.duration}ms</span>
                )}
              </div>
              {/* Status indicator */}
              <div style={{ fontSize: '0.75rem' }}>
                {step.status === 'running' && <span style={{ color: '#f59e0b' }}>выполняется...</span>}
                {step.status === 'done' && <span style={{ color: '#6b7280', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{step.result}</span>}
                {step.status === 'error' && <span style={{ color: '#ef4444' }}>ошибка</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Result or error */}
      {finalResult && !error && (
        <div style={{ ...panelStyle, marginBottom: 0, border: '1px solid #10b98133', background: '#0d2618' }}>
          <div style={{ color: '#10b981', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Результат:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
            <div><span style={{ color: '#6b7280' }}>Имя: </span><span style={{ color: '#e5e7eb' }}>{finalResult.display}</span></div>
            <div><span style={{ color: '#6b7280' }}>Роль: </span><span style={{ color: '#a5f3fc' }}>{finalResult.badge}</span></div>
            <div><span style={{ color: '#6b7280' }}>Bio: </span><span style={{ color: '#9ca3af' }}>{finalResult.summary}</span></div>
          </div>
        </div>
      )}
      {error && (
        <div style={{ ...panelStyle, marginBottom: 0, border: '1px solid #ef444433', background: '#1c0a0a' }}>
          <div style={{ color: '#ef4444', fontSize: '0.82rem', marginBottom: '0.35rem' }}>Пайплайн прерван:</div>
          <code style={{ color: '#fca5a5', fontSize: '0.8rem' }}>{error}</code>
        </div>
      )}

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.78rem', color: '#9ca3af' }}>
        asyncPipe последовательно применяет async-функции. При ошибке в любом шаге цепочка прерывается
        и <code style={{ color: '#fde68a' }}>Promise</code> реджектится — это поведение можно поймать через <code style={{ color: '#fde68a' }}>try/catch</code>.
      </div>
    </div>
  )
}

// ============================================
// Task 4.3 Solution: Builder via pipe
// ============================================

interface AppConfig {
  db?: { type: string; host: string; port: number }
  server?: { port: number }
  logging?: { level: string; format: string }
  cors?: { origins: string[]; methods: string[] }
  auth?: { strategy: string; secret: string }
}

type ConfigStep = (cfg: AppConfig) => AppConfig

function withDatabase(type: string): ConfigStep {
  return (cfg) => ({
    ...cfg,
    db: {
      type,
      host: type === 'sqlite' ? ':memory:' : 'localhost',
      port: type === 'postgres' ? 5432 : type === 'mysql' ? 3306 : 0,
    },
  })
}

function withPort(port: number): ConfigStep {
  return (cfg) => ({ ...cfg, server: { port } })
}

function withLogging(level: string): ConfigStep {
  return (cfg) => ({ ...cfg, logging: { level, format: level === 'debug' ? 'pretty' : 'json' } })
}

function withCors(originsStr: string): ConfigStep {
  return (cfg) => ({
    ...cfg,
    cors: {
      origins: originsStr.split(',').map(s => s.trim()).filter(Boolean),
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  })
}

function withAuth(strategy: string): ConfigStep {
  return (cfg) => ({
    ...cfg,
    auth: {
      strategy,
      secret: strategy === 'jwt' ? 'super-secret-jwt-key' : 'session-secret',
    },
  })
}

interface BuilderStep {
  id: string
  label: string
  enabled: boolean
  param: string
  paramType: 'text' | 'number' | 'select'
  options?: string[]
  defaultParam: string
  build: (param: string) => ConfigStep
  color: string
}

export function Task4_3_Solution() {
  const [builderSteps, setBuilderSteps] = useState<BuilderStep[]>([
    { id: 'db',      label: 'withDatabase',  enabled: true,  param: 'postgres', paramType: 'select', options: ['postgres', 'mysql', 'sqlite'], defaultParam: 'postgres', build: withDatabase, color: '#3b82f6' },
    { id: 'port',    label: 'withPort',      enabled: true,  param: '3000',     paramType: 'number', defaultParam: '3000',    build: (p) => withPort(Number(p)),    color: '#10b981' },
    { id: 'logging', label: 'withLogging',   enabled: true,  param: 'info',     paramType: 'select', options: ['debug', 'info', 'warn', 'error'], defaultParam: 'info', build: withLogging, color: '#f59e0b' },
    { id: 'cors',    label: 'withCors',      enabled: false, param: 'http://localhost:3000', paramType: 'text', defaultParam: 'http://localhost:3000', build: withCors, color: '#8b5cf6' },
    { id: 'auth',    label: 'withAuth',      enabled: false, param: 'jwt',      paramType: 'select', options: ['jwt', 'session', 'oauth'], defaultParam: 'jwt', build: withAuth, color: '#ef4444' },
  ])

  const [highlightedStep, setHighlightedStep] = useState<number | null>(null)

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const panelStyle: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
  }

  const toggleStep = (id: string) => {
    setBuilderSteps(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  const updateParam = (id: string, param: string) => {
    setBuilderSteps(prev => prev.map(s => s.id === id ? { ...s, param } : s))
  }

  const enabledSteps = builderSteps.filter(s => s.enabled)

  // Build config step by step
  const intermediateConfigs: AppConfig[] = [{}]
  let current: AppConfig = {}
  for (const step of enabledSteps) {
    current = step.build(step.param)(current)
    intermediateConfigs.push({ ...current })
  }
  const finalConfig = current

  const displayedConfig = highlightedStep !== null && highlightedStep < intermediateConfigs.length
    ? intermediateConfigs[highlightedStep + 1]
    : finalConfig

  const generatedCode = `const config = pipe(\n${enabledSteps.map(s => `  ${s.label}(${JSON.stringify(s.param)}),`).join('\n')}\n)({})`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 4.3 — Builder через pipe</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Каждый шаг-функция принимает конфиг и возвращает расширенный конфиг. Pipe собирает их в цепочку.
        Наведите на шаг чтобы увидеть промежуточное состояние.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Steps panel */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ ...panelStyle }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.75rem' }}>Шаги конфигурации:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {builderSteps.map((step, i) => (
                <div
                  key={step.id}
                  style={{
                    background: step.enabled ? '#0d1117' : '#111827',
                    border: `1px solid ${step.enabled ? step.color + '44' : '#374151'}`,
                    borderRadius: '8px',
                    padding: '0.6rem 0.75rem',
                    opacity: step.enabled ? 1 : 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={() => step.enabled ? setHighlightedStep(enabledSteps.findIndex(s => s.id === step.id)) : null}
                  onMouseLeave={() => setHighlightedStep(null)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: step.enabled ? '0.4rem' : 0 }}>
                    <input
                      type="checkbox"
                      checked={step.enabled}
                      onChange={() => toggleStep(step.id)}
                      style={{ cursor: 'pointer', accentColor: step.color }}
                    />
                    <code style={{ color: step.color, fontSize: '0.85rem', fontWeight: 'bold' }}>{step.label}</code>
                    {step.enabled && (
                      <span style={{ color: '#4b5563', fontSize: '0.72rem', marginLeft: 'auto' }}>шаг {enabledSteps.findIndex(s => s.id === step.id) + 1}</span>
                    )}
                  </div>
                  {step.enabled && (
                    <div style={{ paddingLeft: '1.5rem' }}>
                      {step.paramType === 'select' ? (
                        <select
                          value={step.param}
                          onChange={e => updateParam(step.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{ background: '#1f2937', border: `1px solid ${step.color}44`, borderRadius: '4px', padding: '0.25rem 0.5rem', color: '#e5e7eb', fontSize: '0.8rem', fontFamily: 'monospace' }}
                        >
                          {step.options!.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input
                          type={step.paramType}
                          value={step.param}
                          onChange={e => updateParam(step.id, e.target.value)}
                          onClick={e => e.stopPropagation()}
                          style={{ background: '#1f2937', border: `1px solid ${step.color}44`, borderRadius: '4px', padding: '0.25rem 0.5rem', color: '#e5e7eb', fontSize: '0.8rem', fontFamily: 'monospace', width: '160px' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Generated code */}
          <div style={panelStyle}>
            <div style={{ color: '#6b7280', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Сгенерированный код:</div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.6rem', fontSize: '0.72rem', color: '#93c5fd', margin: 0, overflowX: 'auto' }}>
              {enabledSteps.length > 0 ? generatedCode : 'pipe()({})\n// конфиг пуст'}
            </pre>
          </div>
        </div>

        {/* Config preview */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ ...panelStyle, minHeight: '200px' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              {highlightedStep !== null
                ? `После шага ${highlightedStep + 1}: ${enabledSteps[highlightedStep]?.label}`
                : 'Итоговый конфиг:'}
            </div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#6ee7b7', margin: 0, overflowX: 'auto', minHeight: '140px' }}>
              {JSON.stringify(displayedConfig, null, 2)}
            </pre>
          </div>

          {/* Step-by-step visualization */}
          <div style={{ ...panelStyle, marginBottom: 0 }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.6rem' }}>Накопление конфига:</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem' }}>
                <span style={{ color: '#4b5563', width: '60px' }}>{}  →</span>
                <span style={{ color: '#6b7280' }}>пустой объект</span>
              </div>
              {enabledSteps.map((step, i) => {
                const added = Object.keys(intermediateConfigs[i + 1]).filter(k => !Object.keys(intermediateConfigs[i]).includes(k))
                return (
                  <div
                    key={step.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.78rem',
                      background: highlightedStep === i ? '#1a1a2e' : 'transparent',
                      borderRadius: '4px',
                      padding: '0.2rem 0.3rem',
                      cursor: 'default',
                    }}
                    onMouseEnter={() => setHighlightedStep(i)}
                    onMouseLeave={() => setHighlightedStep(null)}
                  >
                    <span style={{ color: step.color, width: '110px', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.label}</span>
                    <span style={{ color: '#4b5563' }}>+</span>
                    {added.map(k => (
                      <span key={k} style={{ background: step.color + '22', color: step.color, padding: '0.1rem 0.4rem', borderRadius: '3px', fontSize: '0.72rem' }}>
                        {k}
                      </span>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.78rem', color: '#9ca3af' }}>
        Builder через pipe — альтернатива паттерну Builder/Fluent API. Каждая функция-шаг —
        чистая функция без мутаций. Конфиг неизменяем между шагами: каждый шаг создаёт новый объект через spread.
      </div>
    </div>
  )
}
