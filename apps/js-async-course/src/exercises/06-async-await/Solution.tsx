import { useState, useEffect, useRef } from 'react'

// ============================================================
// Task 6.1 Solution — async/await vs Promise: параллельный вид
// ============================================================

const ASYNC_EXAMPLES = [
  {
    label: 'Простой запрос',
    async: [
      'async function fetchUser(id) {',
      '  const res = await fetch(`/api/users/${id}`)',
      '  const user = await res.json()',
      '  return user',
      '}',
    ],
    promise: [
      'function fetchUser(id) {',
      '  return fetch(`/api/users/${id}`)',
      '    .then(res => res.json())',
      '    .then(user => user)',
      '}',
    ],
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'Вызов функции. async версия — то же самое, что return Promise.' },
      { asyncLine: 1, promiseLine: 1, log: 'await fetch(...) ≡ .then() — функция приостановлена, поток свободен.' },
      { asyncLine: 2, promiseLine: 2, log: 'await res.json() ≡ следующий .then() — распаковываем тело ответа.' },
      { asyncLine: 3, promiseLine: 3, log: 'return user — Promise резолвится со значением user.' },
    ],
  },
  {
    label: 'С обработкой ошибки',
    async: [
      'async function safeFetch(url) {',
      '  try {',
      '    const res = await fetch(url)',
      '    return await res.json()',
      '  } catch (err) {',
      '    console.error(err)',
      '    return null',
      '  }',
      '}',
    ],
    promise: [
      'function safeFetch(url) {',
      '  return fetch(url)',
      '    .then(res => res.json())',
      '    .catch(err => {',
      '      console.error(err)',
      '      return null',
      '    })',
      '}',
      '',
    ],
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'Объявление функции. async делает её автоматически возвращающей Promise.' },
      { asyncLine: 2, promiseLine: 1, log: 'await fetch(url) — запрос ушёл, функция приостановлена (не поток!).' },
      { asyncLine: 3, promiseLine: 2, log: 'Если успех: await res.json() ≡ .then(res => res.json()).' },
      { asyncLine: 4, promiseLine: 3, log: 'Если ошибка: catch (err) ≡ .catch(err => ...). Оба перехватывают reject.' },
      { asyncLine: 6, promiseLine: 5, log: 'return null — промис резолвится с null (не реджектится).' },
    ],
  },
  {
    label: 'Вложенные await',
    async: [
      'async function loadDashboard() {',
      '  const user = await fetchUser()',
      '  const posts = await fetchPosts(user.id)',
      '  const comments = await fetchComments(posts[0].id)',
      '  return { user, posts, comments }',
      '}',
    ],
    promise: [
      'function loadDashboard() {',
      '  return fetchUser()',
      '    .then(user => fetchPosts(user.id)',
      '      .then(posts => fetchComments(posts[0].id)',
      '        .then(comments =>',
      '          ({ user, posts, comments }))))',
      '}',
    ],
    steps: [
      { asyncLine: 0, promiseLine: 0, log: 'async/await делает последовательный код — читается сверху вниз.' },
      { asyncLine: 1, promiseLine: 1, log: 'await fetchUser() — ждём пользователя. Promise: return fetchUser().then(...).' },
      { asyncLine: 2, promiseLine: 2, log: 'await fetchPosts() — ждём посты. Promise: вложенный .then().' },
      { asyncLine: 3, promiseLine: 3, log: 'await fetchComments() — Promise: ещё один уровень вложенности.' },
      { asyncLine: 4, promiseLine: 5, log: 'return {...} — async читается линейно, Promise — "пирамида смерти".' },
    ],
  },
]

export function Task6_1_Solution() {
  const [exampleIdx, setExampleIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const example = ASYNC_EXAMPLES[exampleIdx]
  const step = example.steps[stepIdx]

  const handleNext = () => {
    if (stepIdx < example.steps.length - 1) {
      const nextStep = example.steps[stepIdx + 1]
      setStepIdx(stepIdx + 1)
      setLog((prev) => [...prev, nextStep.log])
    }
  }

  const handleReset = (idx?: number) => {
    const newIdx = idx ?? exampleIdx
    setExampleIdx(newIdx)
    setStepIdx(0)
    setLog([ASYNC_EXAMPLES[newIdx].steps[0].log])
  }

  useEffect(() => {
    setLog([example.steps[0].log])
    setStepIdx(0)
  }, [exampleIdx])

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const tab = (active: boolean): React.CSSProperties => ({
    padding: '0.35rem 0.9rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    background: active ? '#1e293b' : '#0f172a',
    color: active ? '#60a5fa' : '#64748b',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const btn = (disabled: boolean, color = '#3b82f6'): React.CSSProperties => ({
    padding: '0.45rem 1.1rem',
    borderRadius: '6px',
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    background: disabled ? '#1e293b' : color,
    color: disabled ? '#475569' : '#fff',
    fontFamily: 'inherit',
    fontSize: '0.82rem',
  })

  const renderCode = (lines: string[], activeLine: number, accent: string) => (
    <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', flex: 1, minWidth: 0 }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            gap: '0.6rem',
            background: activeLine === i ? `${accent}22` : 'transparent',
            borderLeft: activeLine === i ? `3px solid ${accent}` : '3px solid transparent',
            paddingLeft: '0.4rem',
            borderRadius: '2px',
            transition: 'background 0.25s',
            lineHeight: 1.65,
          }}
        >
          <span style={{ color: '#475569', minWidth: '1.2rem', textAlign: 'right', userSelect: 'none', fontSize: '0.75rem' }}>
            {i + 1}
          </span>
          <span style={{ color: '#cbd5e1', whiteSpace: 'pre' }}>{line}</span>
        </div>
      ))}
    </div>
  )

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 6.1 — async/await vs Promise
      </h2>

      {/* Example picker */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        {ASYNC_EXAMPLES.map((ex, i) => (
          <button key={i} style={tab(exampleIdx === i)} onClick={() => handleReset(i)}>
            {ex.label}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Labels */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
          <div style={{ flex: 1, color: '#34d399', fontSize: '0.75rem', fontWeight: 'bold' }}>async/await</div>
          <div style={{ flex: 1, color: '#f59e0b', fontSize: '0.75rem', fontWeight: 'bold' }}>Promise-цепочка</div>
        </div>

        {/* Side-by-side code */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          {renderCode(example.async, step.asyncLine, '#34d399')}
          {renderCode(example.promise, step.promiseLine, '#f59e0b')}
        </div>

        {/* Execution log */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          minHeight: '90px',
          fontSize: '0.8rem',
          lineHeight: 1.6,
          marginBottom: '1rem',
        }}>
          <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.4rem' }}>ЛОГ ВЫПОЛНЕНИЯ</div>
          {log.map((entry, i) => (
            <div key={i} style={{ color: i === log.length - 1 ? '#93c5fd' : '#475569' }}>
              <span style={{ color: i === log.length - 1 ? '#3b82f6' : '#334155' }}>{'>'} </span>
              {entry}
            </div>
          ))}
        </div>

        {/* Key insight */}
        <div style={{
          background: '#0c1a30',
          border: '1px solid #1d4ed8',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: '#93c5fd',
          marginBottom: '1rem',
          lineHeight: 1.55,
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Ключевой факт: </span>
          await приостанавливает <em>функцию</em>, но не поток. Пока функция "ждёт" промис —
          Event Loop продолжает обрабатывать другие задачи.
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            style={btn(stepIdx >= example.steps.length - 1)}
            disabled={stepIdx >= example.steps.length - 1}
            onClick={handleNext}
          >
            Шаг вперёд →
          </button>
          <button style={btn(false, '#374151')} onClick={() => handleReset()}>
            Сброс
          </button>
          <span style={{ color: '#475569', fontSize: '0.78rem' }}>
            {stepIdx + 1} / {example.steps.length}
          </span>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 6.2 Solution — Обработка ошибок: 3 стратегии
// ============================================================

type ErrorStrategy = 'tryCatch' | 'dotCatch' | 'goStyle'

function simulateFetch(shouldFail: boolean): Promise<{ data: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Network Error: 503 Service Unavailable'))
      } else {
        resolve({ data: 'Данные успешно получены!' })
      }
    }, 600)
  })
}

// Go-style wrapper
async function to<T>(promise: Promise<T>): Promise<[Error | null, T | null]> {
  try {
    const result = await promise
    return [null, result]
  } catch (err) {
    return [err instanceof Error ? err : new Error(String(err)), null]
  }
}

const STRATEGIES: Record<ErrorStrategy, { label: string; color: string; code: string; pros: string[]; cons: string[] }> = {
  tryCatch: {
    label: 'try/catch',
    color: '#3b82f6',
    code: `async function loadData() {
  try {
    const result = await fetchData()
    console.log(result.data)
    return result
  } catch (err) {
    console.error('Ошибка:', err.message)
    return null
  }
}`,
    pros: ['Привычный синхронный стиль', 'Один блок catch для всех await', 'Читается как обычный try/catch'],
    cons: ['Весь код внутри try — риск перехватить "чужую" ошибку', 'Вложенность при нескольких try/catch'],
  },
  dotCatch: {
    label: '.catch() на вызове',
    color: '#f59e0b',
    code: `async function loadData() {
  const result = await fetchData()
    .catch(err => {
      console.error('Ошибка:', err.message)
      return null  // fallback-значение
    })

  if (!result) return  // проверяем fallback
  console.log(result.data)
}`,
    pros: ['Обработка ошибки рядом с источником', 'Не нужен try/catch блок', 'Удобно для fallback-значений'],
    cons: ['result может быть null — нужна проверка', 'Менее очевидно для новичков'],
  },
  goStyle: {
    label: 'Go-style [err, data]',
    color: '#10b981',
    code: `// Вспомогательная функция:
async function to(promise) {
  try { return [null, await promise] }
  catch (err) { return [err, null] }
}

async function loadData() {
  const [err, result] = await to(fetchData())
  if (err) {
    console.error('Ошибка:', err.message)
    return null
  }
  console.log(result.data)
}`,
    pros: ['Явная проверка ошибки сразу после вызова', 'Нет вложенности', 'Знакомо Go/Rust разработчикам'],
    cons: ['Требует вспомогательную функцию to()', 'Непривычно для JS-разработчиков'],
  },
}

type ErrorStep = 'idle' | 'loading' | 'success' | 'error'

export function Task6_2_Solution() {
  const [strategy, setStrategy] = useState<ErrorStrategy>('tryCatch')
  const [shouldFail, setShouldFail] = useState(false)
  const [stepState, setStepState] = useState<ErrorStep>('idle')
  const [logLines, setLogLines] = useState<Array<{ text: string; color: string }>>([])

  const addLog = (text: string, color = '#93c5fd') =>
    setLogLines((prev) => [...prev, { text, color }])

  const runDemo = async () => {
    setStepState('loading')
    setLogLines([])

    addLog('> Вызов fetchData()...', '#64748b')

    if (strategy === 'tryCatch') {
      try {
        const result = await simulateFetch(shouldFail)
        addLog(`> result = ${JSON.stringify(result)}`, '#34d399')
        setStepState('success')
      } catch (err) {
        addLog(`> catch: ${(err as Error).message}`, '#f87171')
        addLog('> return null', '#f59e0b')
        setStepState('error')
      }
    } else if (strategy === 'dotCatch') {
      const result = await simulateFetch(shouldFail).catch((err: Error) => {
        addLog(`> .catch: ${err.message}`, '#f87171')
        addLog('> fallback: null', '#f59e0b')
        return null
      })
      if (!result) {
        addLog('> if (!result) return — выходим', '#f59e0b')
        setStepState('error')
      } else {
        addLog(`> result = ${JSON.stringify(result)}`, '#34d399')
        setStepState('success')
      }
    } else {
      const [err, result] = await to(simulateFetch(shouldFail))
      if (err) {
        addLog(`> [err, null] = [${err.message}, null]`, '#f87171')
        addLog('> if (err) return null', '#f59e0b')
        setStepState('error')
      } else {
        addLog(`> [null, result] = [null, ${JSON.stringify(result)}]`, '#34d399')
        setStepState('success')
      }
    }
  }

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const stratColor = STRATEGIES[strategy].color

  const tab = (s: ErrorStrategy): React.CSSProperties => ({
    padding: '0.35rem 0.9rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    background: strategy === s ? '#1e293b' : '#0f172a',
    color: strategy === s ? STRATEGIES[s].color : '#64748b',
    borderBottom: strategy === s ? `2px solid ${STRATEGIES[s].color}` : '2px solid transparent',
  })

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 6.2 — Обработка ошибок
      </h2>

      {/* Strategy tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        {(Object.keys(STRATEGIES) as ErrorStrategy[]).map((s) => (
          <button key={s} style={tab(s)} onClick={() => { setStrategy(s); setStepState('idle'); setLogLines([]) }}>
            {STRATEGIES[s].label}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Code */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', borderLeft: `3px solid ${stratColor}` }}>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.65 }}>
            {STRATEGIES[strategy].code}
          </pre>
        </div>

        {/* Pros / Cons */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, background: '#052e16', border: '1px solid #166534', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.78rem' }}>
            <div style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '0.35rem' }}>Плюсы</div>
            {STRATEGIES[strategy].pros.map((p, i) => (
              <div key={i} style={{ color: '#86efac', lineHeight: 1.5 }}>+ {p}</div>
            ))}
          </div>
          <div style={{ flex: 1, background: '#2d1a10', border: '1px solid #7c2d12', borderRadius: '8px', padding: '0.6rem 0.9rem', fontSize: '0.78rem' }}>
            <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '0.35rem' }}>Минусы</div>
            {STRATEGIES[strategy].cons.map((c, i) => (
              <div key={i} style={{ color: '#fdba74', lineHeight: 1.5 }}>- {c}</div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={runDemo}
            disabled={stepState === 'loading'}
            style={{
              padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
              cursor: stepState === 'loading' ? 'not-allowed' : 'pointer',
              background: stepState === 'loading' ? '#1e293b' : stratColor,
              color: stepState === 'loading' ? '#475569' : '#fff',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            {stepState === 'loading' ? 'Запрос...' : 'Запустить'}
          </button>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
            <input
              type="checkbox"
              checked={shouldFail}
              onChange={(e) => { setShouldFail(e.target.checked); setStepState('idle'); setLogLines([]) }}
              style={{ accentColor: '#ef4444' }}
            />
            Симулировать ошибку
          </label>

          {/* Status badge */}
          {stepState !== 'idle' && stepState !== 'loading' && (
            <div style={{
              padding: '0.3rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              background: stepState === 'success' ? '#052e16' : '#450a0a',
              color: stepState === 'success' ? '#4ade80' : '#f87171',
              border: `1px solid ${stepState === 'success' ? '#166534' : '#991b1b'}`,
            }}>
              {stepState === 'success' ? 'Успех' : 'Ошибка перехвачена'}
            </div>
          )}
        </div>

        {/* Log */}
        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.75rem', minHeight: '80px', fontSize: '0.8rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.4rem' }}>ВЫВОД</div>
          {logLines.length === 0
            ? <div style={{ color: '#334155' }}>Нажмите "Запустить" для демонстрации</div>
            : logLines.map((l, i) => (
              <div key={i} style={{ color: l.color, lineHeight: 1.55 }}>{l.text}</div>
            ))
          }
          {stepState === 'loading' && (
            <div style={{ color: '#475569', fontStyle: 'italic' }}>Ожидание ответа...</div>
          )}
        </div>

        {/* Comparison table */}
        <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr>
                {['Подход', 'Читаемость', 'Гранулярность', 'Доп. зависимость'].map((h) => (
                  <th key={h} style={{ padding: '0.5rem 0.6rem', background: '#0f172a', color: '#64748b', textAlign: 'left', borderBottom: '1px solid #1e293b' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'try/catch', read: '★★★★★', gran: 'Весь блок', dep: 'Нет' },
                { name: '.catch()', read: '★★★★☆', gran: 'Один вызов', dep: 'Нет' },
                { name: 'Go-style', read: '★★★☆☆', gran: 'Один вызов', dep: 'to() хелпер' },
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : '#0f172a22' }}>
                  <td style={{ padding: '0.45rem 0.6rem', color: '#e2e8f0', borderBottom: '1px solid #1e293b20' }}>{row.name}</td>
                  <td style={{ padding: '0.45rem 0.6rem', color: '#f59e0b', borderBottom: '1px solid #1e293b20' }}>{row.read}</td>
                  <td style={{ padding: '0.45rem 0.6rem', color: '#94a3b8', borderBottom: '1px solid #1e293b20' }}>{row.gran}</td>
                  <td style={{ padding: '0.45rem 0.6rem', color: '#94a3b8', borderBottom: '1px solid #1e293b20' }}>{row.dep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 6.3 Solution — Sequential vs Parallel
// ============================================================

interface Task63Item {
  name: string
  duration: number
  color: string
}

const TASKS_63: Task63Item[] = [
  { name: 'fetchUser', duration: 1000, color: '#3b82f6' },
  { name: 'fetchPosts', duration: 1500, color: '#8b5cf6' },
  { name: 'fetchComments', duration: 800, color: '#ec4899' },
]

interface BarState {
  progress: number   // 0..100
  done: boolean
  startedAt: number  // ms relative to run start
}

type RunMode = 'sequential' | 'parallel'

function useFakeTimer(
  mode: RunMode | null,
  onDone: (totalMs: number) => void
): { bars: BarState[]; elapsed: number; running: boolean; start: () => void; reset: () => void } {
  const [bars, setBars] = useState<BarState[]>(
    TASKS_63.map(() => ({ progress: 0, done: false, startedAt: 0 }))
  )
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const reset = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    setBars(TASKS_63.map(() => ({ progress: 0, done: false, startedAt: 0 })))
    setElapsed(0)
    setRunning(false)
  }

  const start = () => {
    reset()
    setRunning(true)
    const now = performance.now()
    startTimeRef.current = now

    const totalSequential = TASKS_63.reduce((s, t) => s + t.duration, 0)
    const totalParallel = Math.max(...TASKS_63.map((t) => t.duration))
    const totalTime = mode === 'sequential' ? totalSequential : totalParallel

    // In sequential mode: task i starts after sum of previous durations
    const startOffsets = mode === 'sequential'
      ? TASKS_63.map((_, i) => TASKS_63.slice(0, i).reduce((s, t) => s + t.duration, 0))
      : TASKS_63.map(() => 0)

    function tick() {
      const el = performance.now() - startTimeRef.current
      setElapsed(Math.round(el))

      setBars(
        TASKS_63.map((task, i) => {
          const localEl = el - startOffsets[i]
          const progress = Math.min(100, localEl < 0 ? 0 : (localEl / task.duration) * 100)
          return {
            progress,
            done: progress >= 100,
            startedAt: startOffsets[i],
          }
        })
      )

      if (el < totalTime) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setRunning(false)
        onDone(Math.round(el))
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  return { bars, elapsed, running, start, reset }
}

export function Task6_3_Solution() {
  const [activeMode, setActiveMode] = useState<RunMode>('sequential')
  const [totalTime, setTotalTime] = useState<number | null>(null)

  const { bars, elapsed, running, start, reset } = useFakeTimer(activeMode, (ms) => setTotalTime(ms))

  const handleReset = () => { reset(); setTotalTime(null) }
  const handleSwitch = (m: RunMode) => { setActiveMode(m); reset(); setTotalTime(null) }

  const sequentialTotal = TASKS_63.reduce((s, t) => s + t.duration, 0)
  const parallelTotal = Math.max(...TASKS_63.map((t) => t.duration))

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  const tab = (m: RunMode): React.CSSProperties => ({
    padding: '0.35rem 0.9rem',
    borderRadius: '6px 6px 0 0',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'inherit',
    fontSize: '0.8rem',
    background: activeMode === m ? '#1e293b' : '#0f172a',
    color: activeMode === m ? '#60a5fa' : '#64748b',
    borderBottom: activeMode === m ? '2px solid #3b82f6' : '2px solid transparent',
  })

  const codeSeq = `// Последовательный await — медленно!
const user     = await fetchUser()     // 1000ms
const posts    = await fetchPosts()    // 1500ms
const comments = await fetchComments() //  800ms
// Итого: 1000 + 1500 + 800 = 3300ms`

  const codePar = `// Promise.all — все запросы параллельно!
const [user, posts, comments] = await Promise.all([
  fetchUser(),     // 1000ms |
  fetchPosts(),    // 1500ms | одновременно
  fetchComments(), //  800ms |
])
// Итого: max(1000, 1500, 800) = 1500ms`

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 6.3 — Sequential vs Parallel
      </h2>

      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0' }}>
        <button style={tab('sequential')} onClick={() => handleSwitch('sequential')}>Последовательно (await)</button>
        <button style={tab('parallel')} onClick={() => handleSwitch('parallel')}>Параллельно (Promise.all)</button>
      </div>

      <div style={{ background: '#1e293b', borderRadius: '0 8px 8px 8px', padding: '1.25rem' }}>
        {/* Code */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          borderLeft: `3px solid ${activeMode === 'sequential' ? '#ef4444' : '#10b981'}`,
        }}>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {activeMode === 'sequential' ? codeSeq : codePar}
          </pre>
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ color: '#64748b', fontSize: '0.7rem', marginBottom: '0.6rem' }}>
            TIMELINE (ось времени: {activeMode === 'sequential' ? `0–${sequentialTotal}ms` : `0–${parallelTotal}ms`})
          </div>
          {TASKS_63.map((task, i) => (
            <div key={i} style={{ marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
                <span style={{ color: task.color }}>{task.name}</span>
                <span style={{ color: bars[i].done ? '#4ade80' : '#64748b' }}>
                  {bars[i].done ? `${task.duration}ms` : bars[i].progress > 0 ? `${Math.round(bars[i].progress)}%` : `${task.duration}ms`}
                </span>
              </div>
              {/* Track */}
              <div style={{ position: 'relative', height: '20px', background: '#0f172a', borderRadius: '4px', overflow: 'hidden' }}>
                {/* Offset gap for sequential */}
                {activeMode === 'sequential' && bars[i].startedAt > 0 && (
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    width: `${(bars[i].startedAt / sequentialTotal) * 100}%`,
                    height: '100%',
                    background: 'transparent',
                  }} />
                )}
                {/* Progress bar */}
                <div style={{
                  position: 'absolute',
                  left: activeMode === 'sequential' ? `${(bars[i].startedAt / sequentialTotal) * 100}%` : '0',
                  width: activeMode === 'sequential'
                    ? `${(bars[i].progress / 100) * (task.duration / sequentialTotal) * 100}%`
                    : `${bars[i].progress}%`,
                  height: '100%',
                  background: task.color,
                  borderRadius: '4px',
                  transition: 'width 0.03s linear',
                  opacity: bars[i].done ? 1 : 0.8,
                }} />
                {bars[i].done && (
                  <div style={{
                    position: 'absolute',
                    right: '6px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '0.65rem',
                    color: '#fff',
                    fontWeight: 'bold',
                  }}>
                    ✓
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Elapsed + total */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          {running && (
            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b' }}>Прошло: </span>
              <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>{elapsed}ms</span>
            </div>
          )}
          {totalTime !== null && (
            <div style={{
              background: activeMode === 'sequential' ? '#450a0a' : '#052e16',
              border: `1px solid ${activeMode === 'sequential' ? '#ef4444' : '#10b981'}`,
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              fontSize: '0.85rem',
            }}>
              <span style={{ color: '#94a3b8' }}>Итого: </span>
              <span style={{ color: activeMode === 'sequential' ? '#f87171' : '#4ade80', fontWeight: 'bold' }}>
                {totalTime}ms
              </span>
              <span style={{ color: '#475569', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                {activeMode === 'sequential'
                  ? `(${sequentialTotal}ms теория)`
                  : `(${parallelTotal}ms теория — в ${Math.round(sequentialTotal / parallelTotal * 10) / 10}x быстрее!)`}
              </span>
            </div>
          )}
        </div>

        {/* Speedup callout */}
        <div style={{
          background: '#0c1a30',
          border: '1px solid #1d4ed8',
          borderRadius: '8px',
          padding: '0.6rem 0.9rem',
          fontSize: '0.78rem',
          color: '#93c5fd',
          marginBottom: '1rem',
          lineHeight: 1.5,
        }}>
          Последовательный await: <strong style={{ color: '#f87171' }}>{sequentialTotal}ms</strong>
          {'  →  '}
          Promise.all: <strong style={{ color: '#4ade80' }}>{parallelTotal}ms</strong>
          {'  ('}ускорение в <strong>{Math.round(sequentialTotal / parallelTotal * 10) / 10}x</strong>{')'}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={start}
            disabled={running}
            style={{
              padding: '0.5rem 1.2rem', borderRadius: '6px', border: 'none',
              cursor: running ? 'not-allowed' : 'pointer',
              background: running ? '#1e293b' : (activeMode === 'sequential' ? '#dc2626' : '#059669'),
              color: running ? '#475569' : '#fff',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            {running ? 'Запущено...' : 'Запустить'}
          </button>
          <button
            onClick={handleReset}
            style={{
              padding: '0.5rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer', background: '#374151', color: '#e5e7eb',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            Сброс
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// Task 6.4 Solution — Антипаттерны async/await
// ============================================================

interface AntiPattern {
  title: string
  subtitle: string
  bad: string
  good: string
  explanation: string
  badLabel: string
  goodLabel: string
}

const ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'await в forEach',
    subtitle: 'forEach не ждёт промисы',
    bad: `// Не работает как ожидается!
const ids = [1, 2, 3]
ids.forEach(async (id) => {
  const user = await fetchUser(id)
  console.log(user) // порядок непредсказуем
})
// forEach не ждёт async-коллбэков!
// Все запросы уходят одновременно
console.log('done') // печатается ДО результатов`,
    good: `// Последовательно — for...of
for (const id of ids) {
  const user = await fetchUser(id)
  console.log(user) // гарантированный порядок
}

// Или параллельно — Promise.all + map
const users = await Promise.all(
  ids.map(id => fetchUser(id))
)
console.log('done') // после всех запросов`,
    explanation: 'forEach передаёт async-функцию как коллбэк, но не ждёт возвращённый промис. Цикл завершается немедленно. Используйте for...of для последовательного выполнения или Promise.all для параллельного.',
    badLabel: 'forEach + async: не ждёт',
    goodLabel: 'for...of или Promise.all',
  },
  {
    title: 'Забытый await',
    subtitle: 'Промис вместо значения',
    bad: `async function checkUser() {
  const user = fetchUser() // забыли await!
  //    ^^^^ Promise {<pending>}

  if (user) {
    // ВСЕГДА true — Promise — truthy объект
    console.log('Пользователь найден')
  }

  console.log(user.name) // undefined!
}`,
    good: `async function checkUser() {
  const user = await fetchUser() // ожидаем!
  //            ^^^^^ { id: 1, name: 'Alice' }

  if (user) {
    // Теперь это реальный объект
    console.log('Пользователь найден')
  }

  console.log(user.name) // 'Alice'
}`,
    explanation: 'Без await вы получаете объект Promise, а не его значение. Promise всегда truthy — условие if (user) будет true, даже если запрос упал. TypeScript поможет поймать это, если типизировать возвращаемое значение.',
    badLabel: 'Promise вместо значения',
    goodLabel: 'await распаковывает промис',
  },
  {
    title: 'Последовательный await вместо параллельного',
    subtitle: 'Самая частая ошибка производительности',
    bad: `// Суммируем время всех запросов: МЕДЛЕННО
async function loadPage() {
  const user     = await fetchUser()     // 300ms
  const settings = await fetchSettings() // 200ms
  const feed     = await fetchFeed()     // 400ms
  // Итого: 300 + 200 + 400 = 900ms
}`,
    good: `// Все независимые запросы — параллельно: БЫСТРО
async function loadPage() {
  const [user, settings, feed] = await Promise.all([
    fetchUser(),     // 300ms |
    fetchSettings(), // 200ms | одновременно
    fetchFeed(),     // 400ms |
  ])
  // Итого: max(300, 200, 400) = 400ms
}`,
    explanation: 'Если запросы не зависят друг от друга — запускайте их параллельно через Promise.all. Это в разы быстрее. Последовательный await оправдан только когда следующий запрос использует результат предыдущего.',
    badLabel: '900ms суммарно',
    goodLabel: '400ms — только max()',
  },
  {
    title: 'Unnecessary async',
    subtitle: 'Лишний async без await',
    bad: `// Функция не нужна async — нет await
async function add(a: number, b: number) {
  return a + b
}
// Оборачивает синхронный результат в Promise
// Вызывающий код ОБЯЗАН await или .then()
const result = add(1, 2)
// result = Promise<number>, не number!`,
    good: `// Убираем async — функция синхронная
function add(a: number, b: number) {
  return a + b
}
const result = add(1, 2) // number = 3

// async нужен только если есть await внутри:
async function fetchAndProcess(id: number) {
  const data = await fetchData(id)
  return processSync(data) // return в async = Promise
}`,
    explanation: 'async без await создаёт бессмысленный промис. Это усложняет вызов (нужен await) и скрывает синхронную природу функции. Добавляйте async только когда внутри есть хотя бы один await.',
    badLabel: 'Лишняя асинхронность',
    goodLabel: 'Синхронная когда возможно',
  },
  {
    title: 'Проглатывание ошибок',
    subtitle: 'Пустой catch молча скрывает баги',
    bad: `async function saveData(data: unknown) {
  try {
    await database.save(data)
  } catch (err) {
    // Пустой catch — ошибка проглочена
    // Никто не узнает что что-то сломалось
  }
}

// Пользователь думает что сохранение прошло
// На самом деле — нет`,
    good: `async function saveData(data: unknown) {
  try {
    await database.save(data)
    return { success: true }
  } catch (err) {
    // Минимум — логировать ошибку
    console.error('[saveData] failed:', err)
    // Сообщить вызывающему коду
    return { success: false, error: err }
    // Или: throw err — если caller должен знать
  }
}`,
    explanation: 'Пустой catch — это "тихая смерть" вашего кода. Ошибки должны логироваться минимум. В большинстве случаев — либо сообщите вызывающему (return { error }), либо пробросьте выше (throw err).',
    badLabel: 'Ошибка исчезает незаметно',
    goodLabel: 'Ошибка логируется и обрабатывается',
  },
]

export function Task6_4_Solution() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [showGood, setShowGood] = useState(false)

  const pattern = ANTIPATTERNS[activeIdx]

  const cs: React.CSSProperties = {
    background: '#0f172a',
    color: '#e2e8f0',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: "'Fira Code', 'Cascadia Code', monospace",
    fontSize: '0.9rem',
  }

  return (
    <div className="exercise-container" style={cs}>
      <h2 style={{ marginTop: 0, color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        Задание 6.4 — Антипаттерны async/await
      </h2>

      {/* Pattern navigation */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {ANTIPATTERNS.map((p, i) => (
          <button
            key={i}
            onClick={() => { setActiveIdx(i); setShowGood(false) }}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              background: activeIdx === i ? '#7c3aed' : '#1e293b',
              color: activeIdx === i ? '#fff' : '#94a3b8',
            }}
          >
            {i + 1}. {p.title}
          </button>
        ))}
      </div>

      <div style={{ background: '#1e293b', borderRadius: '8px', padding: '1.25rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '1rem', color: '#c4b5fd', fontWeight: 'bold', fontFamily: 'system-ui', marginBottom: '0.25rem' }}>
            {pattern.title}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{pattern.subtitle}</div>
        </div>

        {/* Toggle buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            onClick={() => setShowGood(false)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem',
              background: !showGood ? '#450a0a' : '#1e293b',
              color: !showGood ? '#f87171' : '#64748b',
              borderBottom: !showGood ? '2px solid #ef4444' : '2px solid transparent',
            }}
          >
            Плохо (до)
          </button>
          <button
            onClick={() => setShowGood(true)}
            style={{
              padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem',
              background: showGood ? '#052e16' : '#1e293b',
              color: showGood ? '#4ade80' : '#64748b',
              borderBottom: showGood ? '2px solid #10b981' : '2px solid transparent',
            }}
          >
            Хорошо (после)
          </button>
        </div>

        {/* Code block */}
        <div style={{
          background: '#0f172a',
          borderRadius: '8px',
          padding: '0.85rem',
          marginBottom: '0.75rem',
          borderLeft: `3px solid ${showGood ? '#10b981' : '#ef4444'}`,
          transition: 'border-color 0.2s',
        }}>
          <div style={{
            fontSize: '0.7rem',
            marginBottom: '0.4rem',
            color: showGood ? '#4ade80' : '#f87171',
            fontWeight: 'bold',
          }}>
            {showGood ? `✓ ${pattern.goodLabel}` : `✗ ${pattern.badLabel}`}
          </div>
          <pre style={{ margin: 0, fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
            {showGood ? pattern.good : pattern.bad}
          </pre>
        </div>

        {/* Explanation */}
        <div style={{
          background: '#0c1a30',
          border: '1px solid #1e3a5f',
          borderRadius: '8px',
          padding: '0.75rem 1rem',
          fontSize: '0.8rem',
          color: '#93c5fd',
          lineHeight: 1.6,
          marginBottom: '1rem',
        }}>
          <span style={{ color: '#60a5fa', fontWeight: 'bold' }}>Почему: </span>
          {pattern.explanation}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={() => { setActiveIdx((i) => Math.max(0, i - 1)); setShowGood(false) }}
            disabled={activeIdx === 0}
            style={{
              padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
              cursor: activeIdx === 0 ? 'not-allowed' : 'pointer',
              background: activeIdx === 0 ? '#0f172a' : '#1e293b',
              color: activeIdx === 0 ? '#334155' : '#94a3b8',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            ← Предыдущий
          </button>

          <span style={{ color: '#475569', fontSize: '0.78rem' }}>
            {activeIdx + 1} / {ANTIPATTERNS.length}
          </span>

          <button
            onClick={() => { setActiveIdx((i) => Math.min(ANTIPATTERNS.length - 1, i + 1)); setShowGood(false) }}
            disabled={activeIdx === ANTIPATTERNS.length - 1}
            style={{
              padding: '0.4rem 1rem', borderRadius: '6px', border: 'none',
              cursor: activeIdx === ANTIPATTERNS.length - 1 ? 'not-allowed' : 'pointer',
              background: activeIdx === ANTIPATTERNS.length - 1 ? '#0f172a' : '#1e293b',
              color: activeIdx === ANTIPATTERNS.length - 1 ? '#334155' : '#94a3b8',
              fontFamily: 'inherit', fontSize: '0.82rem',
            }}
          >
            Следующий →
          </button>
        </div>
      </div>
    </div>
  )
}
