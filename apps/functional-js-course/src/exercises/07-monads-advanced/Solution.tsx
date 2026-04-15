import { useState, useRef, useCallback } from 'react'

// ============================================
// IO<T> — synchronous lazy effect wrapper
// ============================================

class IO<T> {
  constructor(private effect: () => T) {}

  static of<T>(value: T): IO<T> {
    return new IO(() => value)
  }

  map<U>(fn: (value: T) => U): IO<U> {
    return new IO(() => fn(this.effect()))
  }

  flatMap<U>(fn: (value: T) => IO<U>): IO<U> {
    return new IO(() => fn(this.effect()).run())
  }

  run(): T {
    return this.effect()
  }
}

// ============================================
// Task<T> — async lazy effect wrapper
// ============================================

class Task<T> {
  constructor(private fork: () => Promise<T>) {}

  static of<T>(value: T): Task<T> {
    return new Task(() => Promise.resolve(value))
  }

  map<U>(fn: (value: T) => U): Task<U> {
    return new Task(() => this.fork().then(fn))
  }

  flatMap<U>(fn: (value: T) => Task<U>): Task<U> {
    return new Task(() => this.fork().then(v => fn(v).run()))
  }

  run(): Promise<T> {
    return this.fork()
  }

  static parallel<T>(tasks: Task<T>[]): Task<T[]> {
    return new Task(() => Promise.all(tasks.map(t => t.run())))
  }
}

// ============================================
// Either for Task 7.3
// ============================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function Left<L>(value: L): Either<L, never> {
  return { tag: 'Left', value }
}

function Right<R>(value: R): Either<never, R> {
  return { tag: 'Right', value }
}

function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

// Do-notation via generators
function Do<L, R>(gen: () => Generator<Either<L, unknown>, R, unknown>): Either<L, R> {
  const iterator = gen()
  let result = iterator.next()
  while (!result.done) {
    const either = result.value as Either<L, unknown>
    if (either.tag === 'Left') return either as Either<L, R>
    result = iterator.next(either.value)
  }
  return Right(result.value)
}

// ============================================
// Shared styles
// ============================================

const containerStyle: React.CSSProperties = {
  background: '#111827',
  color: '#e5e7eb',
  padding: '1.5rem',
  borderRadius: '12px',
  fontFamily: 'monospace',
  fontSize: '0.88rem',
}

const panelStyle: React.CSSProperties = {
  background: '#1f2937',
  borderRadius: '8px',
  padding: '1rem',
  marginBottom: '1rem',
}

const codeBlock: React.CSSProperties = {
  background: '#0f172a',
  borderRadius: '6px',
  padding: '0.8rem',
  fontSize: '0.78rem',
  color: '#94a3b8',
  whiteSpace: 'pre',
  overflowX: 'auto',
  marginTop: '0.5rem',
  lineHeight: '1.6',
}

const btnStyle = (active?: boolean): React.CSSProperties => ({
  background: active ? '#1e3a5f' : '#374151',
  color: active ? '#93c5fd' : '#e5e7eb',
  border: active ? '1px solid #3b82f6' : '1px solid #4b5563',
  borderRadius: '6px',
  padding: '0.35rem 0.9rem',
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontFamily: 'monospace',
  marginRight: '0.4rem',
})

const labelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '0.78rem',
  marginBottom: '0.4rem',
}

// ============================================
// Task 7.1: IO Monad
// ============================================

interface IOLogEntry {
  step: string
  detail: string
}

export function Task7_1_Solution() {
  const [log, setLog] = useState<IOLogEntry[]>([])
  const [running, setRunning] = useState(false)
  const [runCount, setRunCount] = useState(0)
  const runningRef = useRef(false)

  // Each IO step carries a side-effect label for the demo
  const buildPipeline = () => {
    const readConfig = new IO(() => {
      return { dbHost: 'localhost', port: 5432 }
    })

    const connectDB = (config: { dbHost: string; port: number }) =>
      new IO(() => {
        return { connected: true, host: config.dbHost, port: config.port }
      })

    const queryUsers = (db: { connected: boolean; host: string }) =>
      new IO(() => {
        return [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
        ]
      })

    const formatReport = (users: { id: number; name: string }[]) =>
      new IO(() => {
        return `Report [${new Date().toISOString()}]: ${users.map(u => u.name).join(', ')}`
      })

    return readConfig
      .flatMap(connectDB)
      .flatMap(queryUsers)
      .flatMap(formatReport)
  }

  const handleRun = useCallback(async () => {
    if (runningRef.current) return
    runningRef.current = true
    setRunning(true)
    setLog([])

    const steps: IOLogEntry[] = [
      { step: 'readConfig()', detail: '{ dbHost: "localhost", port: 5432 }' },
      { step: 'connectDB(config)', detail: '{ connected: true, host: "localhost" }' },
      { step: 'queryUsers(db)', detail: '[{ id:1, name:"Alice" }, { id:2, name:"Bob" }]' },
      { step: 'formatReport(users)', detail: '' },
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise<void>(r => setTimeout(r, 500))
      const entry = { ...steps[i] }
      if (i === steps.length - 1) {
        const result = buildPipeline().run()
        entry.detail = result
      }
      setLog(prev => [...prev, entry])
    }

    setRunCount(c => c + 1)
    setRunning(false)
    runningRef.current = false
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stepColors = ['#93c5fd', '#6ee7b7', '#fcd34d', '#f9a8d4']

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>IO-монада: ленивые эффекты</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={labelStyle}>Ключевая идея</div>
        <div style={{ color: '#d1d5db', lineHeight: '1.7' }}>
          IO&lt;T&gt; — обёртка над функцией <code style={{ color: '#fcd34d' }}>{'() => T'}</code>.
          Пока не вызван <code style={{ color: '#6ee7b7' }}>run()</code>, никаких эффектов не происходит.
          Можно строить сколько угодно длинные цепочки — они остаются "рецептом".
        </div>
        <div style={codeBlock}>{`class IO<T> {
  constructor(private effect: () => T) {}

  static of<T>(value: T): IO<T>           // поднять значение в IO
  map<U>(fn: (value: T) => U): IO<U>       // трансформировать без запуска
  flatMap<U>(fn: (value: T) => IO<U>): IO<U>  // цепочка IO-шагов
  run(): T                                 // ТОЛЬКО здесь происходят эффекты
}`}</div>
      </div>

      {/* Pipeline construction */}
      <div style={panelStyle}>
        <div style={labelStyle}>Построение пайплайна (ничего не выполняется)</div>
        <div style={codeBlock}>{`const pipeline =
  readConfig()              // IO<Config>
    .flatMap(connectDB)     // IO<Connection>
    .flatMap(queryUsers)    // IO<User[]>
    .flatMap(formatReport)  // IO<string>

// Побочных эффектов: 0. Ничего не выполнено.`}</div>
        <div style={{
          background: '#1a2e1a',
          border: '1px solid #16a34a',
          borderRadius: '6px',
          padding: '0.5rem 0.8rem',
          color: '#6ee7b7',
          fontSize: '0.78rem',
          marginTop: '0.5rem',
        }}>
          {runCount === 0
            ? 'Побочных эффектов: 0. Ничего не выполнено.'
            : `Выполнено! (запусков: ${runCount})`}
        </div>
      </div>

      {/* Run section */}
      <div style={panelStyle}>
        <div style={labelStyle}>Выполнение через run()</div>
        <div style={{ marginBottom: '0.7rem' }}>
          <button style={btnStyle()} onClick={handleRun} disabled={running}>
            {running ? 'Выполняется...' : `pipeline.run()${runCount > 0 ? ' (снова)' : ''}`}
          </button>
          {runCount > 0 && (
            <span style={{ color: '#9ca3af', fontSize: '0.78rem' }}>
              IO можно запускать многократно — каждый раз эффекты выполняются заново
            </span>
          )}
        </div>

        {/* Log */}
        {log.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {log.map((entry, i) => (
              <div key={i} style={{
                background: '#0f172a',
                borderRadius: '6px',
                padding: '0.5rem 0.8rem',
                borderLeft: `3px solid ${stepColors[i % stepColors.length]}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '1rem',
              }}>
                <span style={{ color: stepColors[i % stepColors.length], minWidth: '160px' }}>
                  {entry.step}
                </span>
                <span style={{ color: '#e5e7eb', wordBreak: 'break-all', fontSize: '0.75rem' }}>
                  {entry.detail}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Laws reminder */}
      <div style={{ ...panelStyle, marginBottom: 0 }}>
        <div style={labelStyle}>Почему IO, а не просто функция?</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ color: '#f87171', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Без IO</div>
            <div style={codeBlock}>{`// Выполняется сразу при вызове
const result = connectDB(config)
// Нет контроля — когда? сколько раз?`}</div>
          </div>
          <div>
            <div style={{ color: '#6ee7b7', fontSize: '0.78rem', marginBottom: '0.3rem' }}>С IO</div>
            <div style={codeBlock}>{`// Только описание — ничего не происходит
const io = new IO(() => connectDB(config))
// Запускаем явно, один раз, когда нужно
io.run()`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.2: Task (async IO)
// ============================================

interface TaskProgress {
  name: string
  durationMs: number
  startTime: number
  endTime: number | null
  result: string
}

export function Task7_2_Solution() {
  const [mode, setMode] = useState<'sequential' | 'parallel'>('sequential')
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState<TaskProgress[]>([])
  const [totalMs, setTotalMs] = useState<number | null>(null)
  const [result, setResult] = useState<string[] | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const [now, setNow] = useState(Date.now())

  const TASKS_DEF = [
    { name: 'fetchUsers', durationMs: 800, result: '[Alice, Bob, Carol]' },
    { name: 'fetchProducts', durationMs: 500, result: '[Widget, Gadget]' },
    { name: 'fetchOrders', durationMs: 1200, result: '[#1001, #1002, #1003]' },
  ]

  const startAnimation = useCallback((startTs: number) => {
    const tick = () => {
      setNow(Date.now() - startTs)
      animFrameRef.current = requestAnimationFrame(tick)
    }
    animFrameRef.current = requestAnimationFrame(tick)
  }, [])

  const stopAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }, [])

  const runSequential = useCallback(async () => {
    setRunning(true)
    setProgress([])
    setResult(null)
    setTotalMs(null)

    const startTs = Date.now()
    startAnimation(0)

    const prog: TaskProgress[] = TASKS_DEF.map(t => ({
      name: t.name,
      durationMs: t.durationMs,
      startTime: 0,
      endTime: null,
      result: t.result,
    }))

    const results: string[] = []
    let cursor = 0

    for (let i = 0; i < TASKS_DEF.map(t => t).length; i++) {
      const def = TASKS_DEF[i]
      prog[i] = { ...prog[i], startTime: cursor }
      setProgress([...prog])
      startAnimation(startTs - cursor)

      await new Promise<void>(r => setTimeout(r, def.durationMs))

      cursor += def.durationMs
      prog[i] = { ...prog[i], endTime: cursor }
      setProgress([...prog])
      results.push(def.result)
    }

    stopAnimation()
    setNow(cursor)
    setTotalMs(cursor)
    setResult(results)
    setRunning(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAnimation, stopAnimation])

  const runParallel = useCallback(async () => {
    setRunning(true)
    setProgress([])
    setResult(null)
    setTotalMs(null)

    const startTs = Date.now()
    startAnimation(0)

    const prog: TaskProgress[] = TASKS_DEF.map(t => ({
      name: t.name,
      durationMs: t.durationMs,
      startTime: 0,
      endTime: null,
      result: t.result,
    }))
    setProgress([...prog])

    const promises = TASKS_DEF.map((def, i) =>
      new Promise<string>(r => setTimeout(() => {
        prog[i] = { ...prog[i], endTime: def.durationMs }
        setProgress([...prog])
        r(def.result)
      }, def.durationMs))
    )

    const results = await Promise.all(promises)
    const elapsed = Date.now() - startTs

    stopAnimation()
    setNow(elapsed)
    setTotalMs(elapsed)
    setResult(results)
    setRunning(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startAnimation, stopAnimation])

  const maxDuration = 2600
  const barColors = ['#93c5fd', '#6ee7b7', '#fcd34d']

  const getBarStyle = (p: TaskProgress, index: number): { left: string; width: string } => {
    const total = mode === 'sequential'
      ? TASKS_DEF.reduce((s, t) => s + t.durationMs, 0)
      : maxDuration

    const elapsed = running ? now : (totalMs ?? 0)
    const start = p.startTime
    const end = p.endTime !== null ? p.endTime : Math.min(elapsed, start + p.durationMs)
    const w = Math.max(0, end - start)

    return {
      left: `${(start / total) * 100}%`,
      width: `${(w / total) * 100}%`,
    }
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Task: асинхронная IO-монада</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ color: '#f87171', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Promise (eager)</div>
            <div style={codeBlock}>{`// Запускается сразу при создании!
const p = fetch('/api/users')

// Нельзя повторить без нового вызова
// Нельзя отложить`}</div>
          </div>
          <div>
            <div style={{ color: '#6ee7b7', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Task (lazy)</div>
            <div style={codeBlock}>{`// Ничего не происходит при создании
const t = new Task(() => fetch('/api/users'))

// Запускаем явно
t.run()     // Promise<Response>
t.run()     // снова — новый запрос`}</div>
          </div>
        </div>
      </div>

      {/* Mode switcher */}
      <div style={panelStyle}>
        <div style={labelStyle}>Режим выполнения</div>
        <div style={{ marginBottom: '1rem' }}>
          <button style={btnStyle(mode === 'sequential')} onClick={() => { setMode('sequential'); setProgress([]); setResult(null); setTotalMs(null) }}>
            Sequential (flatMap)
          </button>
          <button style={btnStyle(mode === 'parallel')} onClick={() => { setMode('parallel'); setProgress([]); setResult(null); setTotalMs(null) }}>
            Parallel (Task.parallel)
          </button>
        </div>

        <div style={codeBlock}>{mode === 'sequential'
          ? `// Sequential: flatMap цепочка
fetchUsers
  .flatMap(users => fetchProducts
    .flatMap(products => fetchOrders
      .map(orders => [users, products, orders])))
  .run()
// Время: 800 + 500 + 1200 = ~2500ms`
          : `// Parallel: все Task запускаются одновременно
Task.parallel([fetchUsers, fetchProducts, fetchOrders])
  .run()
// Время: max(800, 500, 1200) = ~1200ms`
        }</div>

        <button
          style={{ ...btnStyle(), marginTop: '0.7rem', background: running ? '#374151' : '#1e3a5f', color: running ? '#6b7280' : '#93c5fd', border: '1px solid #3b82f6' }}
          onClick={mode === 'sequential' ? runSequential : runParallel}
          disabled={running}
        >
          {running ? 'Выполняется...' : 'Запустить'}
        </button>
      </div>

      {/* Timeline */}
      {(progress.length > 0 || result !== null) && (
        <div style={panelStyle}>
          <div style={labelStyle}>Таймлайн выполнения</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {TASKS_DEF.map((def, i) => {
              const p = progress[i]
              const barInfo = p ? getBarStyle(p, i) : { left: '0%', width: '0%' }
              return (
                <div key={def.name} style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                  <div style={{ color: barColors[i], minWidth: '110px', fontSize: '0.78rem' }}>{def.name}</div>
                  <div style={{ flex: 1, background: '#0f172a', borderRadius: '4px', height: '22px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: barInfo.left,
                      width: barInfo.width,
                      height: '100%',
                      background: barColors[i],
                      opacity: 0.7,
                      borderRadius: '3px',
                      transition: 'width 0.05s linear',
                    }} />
                  </div>
                  <div style={{ color: '#9ca3af', minWidth: '55px', fontSize: '0.75rem', textAlign: 'right' }}>
                    {def.durationMs}ms
                  </div>
                </div>
              )
            })}
          </div>

          {totalMs !== null && (
            <div style={{ marginTop: '0.8rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{
                background: '#0d2a1f',
                border: '1px solid #10b981',
                borderRadius: '6px',
                padding: '0.4rem 0.8rem',
                color: '#6ee7b7',
                fontSize: '0.82rem',
              }}>
                Общее время: ~{totalMs}ms
                {mode === 'parallel' && (
                  <span style={{ color: '#9ca3af', marginLeft: '0.5rem' }}>
                    (sequential был бы ~2500ms)
                  </span>
                )}
              </div>
            </div>
          )}

          {result !== null && (
            <div style={{ marginTop: '0.7rem' }}>
              <div style={labelStyle}>Результат</div>
              {result.map((r, i) => (
                <div key={i} style={{ color: barColors[i], fontSize: '0.78rem' }}>
                  {TASKS_DEF[i].name}: {r}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Laws */}
      <div style={{ ...panelStyle, marginBottom: 0 }}>
        <div style={labelStyle}>API Task</div>
        <div style={codeBlock}>{`Task.of(value)                    // Task<T> из значения
task.map(fn)                      // трансформация результата
task.flatMap(fn)                  // последовательная цепочка
task.run()                        // Promise<T> — запуск
Task.parallel([t1, t2, t3])       // параллельное выполнение → Task<T[]>`}</div>
      </div>
    </div>
  )
}

// ============================================
// Task 7.3: Do-notation via generators
// ============================================

interface ConfigInput {
  host: string
  port: string
  dbName: string
  timeout: string
}

function parseHost(host: string): Either<string, string> {
  if (!host.trim()) return Left('host не может быть пустым')
  if (!/^[\w.-]+$/.test(host.trim())) return Left('host содержит недопустимые символы')
  return Right(host.trim())
}

function parsePort(port: string): Either<string, number> {
  const n = parseInt(port, 10)
  if (isNaN(n)) return Left(`port "${port}" не является числом`)
  if (n < 1 || n > 65535) return Left(`port ${n} вне допустимого диапазона (1-65535)`)
  return Right(n)
}

function parseDbName(name: string): Either<string, string> {
  if (!name.trim()) return Left('dbName не может быть пустым')
  if (!/^[a-z_][a-z0-9_]*$/i.test(name.trim())) return Left('dbName должен быть валидным идентификатором')
  return Right(name.trim())
}

function parseTimeout(timeout: string): Either<string, number> {
  const n = parseInt(timeout, 10)
  if (isNaN(n) || n <= 0) return Left(`timeout "${timeout}" должен быть положительным числом`)
  if (n > 30000) return Left('timeout не может превышать 30000ms')
  return Right(n)
}

interface ParsedConfig {
  host: string
  port: number
  dbName: string
  timeout: number
  connectionString: string
}

// flatMap approach
function parseConfigFlatMap(input: ConfigInput): Either<string, ParsedConfig> {
  return eitherFlatMap(parseHost(input.host), host =>
    eitherFlatMap(parsePort(input.port), port =>
      eitherFlatMap(parseDbName(input.dbName), dbName =>
        eitherFlatMap(parseTimeout(input.timeout), timeout =>
          Right({
            host,
            port,
            dbName,
            timeout,
            connectionString: `postgres://${host}:${port}/${dbName}?timeout=${timeout}`,
          })
        )
      )
    )
  )
}

// Do-notation approach
function parseConfigDo(input: ConfigInput): Either<string, ParsedConfig> {
  return Do(function* () {
    const host = (yield parseHost(input.host)) as string
    const port = (yield parsePort(input.port)) as number
    const dbName = (yield parseDbName(input.dbName)) as string
    const timeout = (yield parseTimeout(input.timeout)) as number
    return {
      host,
      port,
      dbName,
      timeout,
      connectionString: `postgres://${host}:${port}/${dbName}?timeout=${timeout}`,
    }
  })
}

function renderEitherResult(e: Either<string, ParsedConfig>): { ok: boolean; text: string } {
  if (e.tag === 'Left') return { ok: false, text: `Left("${e.value}")` }
  return {
    ok: true,
    text: `Right({
  host: "${e.value.host}",
  port: ${e.value.port},
  dbName: "${e.value.dbName}",
  timeout: ${e.value.timeout},
  connectionString: "${e.value.connectionString}"
})`,
  }
}

export function Task7_3_Solution() {
  const [input, setInput] = useState<ConfigInput>({
    host: 'localhost',
    port: '5432',
    dbName: 'mydb',
    timeout: '3000',
  })
  const [executed, setExecuted] = useState(false)

  const flatMapResult = executed ? parseConfigFlatMap(input) : null
  const doResult = executed ? parseConfigDo(input) : null

  const inputStyle: React.CSSProperties = {
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    padding: '0.3rem 0.5rem',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    width: '100%',
  }

  const resultBox = (res: Either<string, ParsedConfig> | null): React.CSSProperties => ({
    background: res === null ? '#0f172a' : res.tag === 'Right' ? '#0d2a1f' : '#2d1515',
    border: `1px solid ${res === null ? '#374151' : res.tag === 'Right' ? '#10b981' : '#ef4444'}`,
    borderRadius: '6px',
    padding: '0.7rem',
    whiteSpace: 'pre',
    fontSize: '0.75rem',
    color: res === null ? '#4b5563' : res.tag === 'Right' ? '#6ee7b7' : '#f87171',
    minHeight: '80px',
    marginTop: '0.5rem',
    overflowX: 'auto',
  })

  const flatMapResultStr = flatMapResult ? renderEitherResult(flatMapResult) : null
  const doResultStr = doResult ? renderEitherResult(doResult) : null
  const identical = flatMapResultStr && doResultStr && flatMapResultStr.text === doResultStr.text

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Do-нотация через генераторы</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={labelStyle}>Зачем Do-нотация?</div>
        <div style={{ color: '#d1d5db', lineHeight: '1.7', marginBottom: '0.5rem' }}>
          При длинных flatMap-цепочках код уходит вправо ("callback hell"). Do-нотация через генераторы
          позволяет писать монадические вычисления в <em>линейном</em> стиле — почти как императивный код,
          но с сохранением всей логики Either.
        </div>
        <div style={codeBlock}>{`function Do<L, R>(gen: () => Generator<Either<L, any>, R, any>): Either<L, R> {
  const iterator = gen()
  let result = iterator.next()
  while (!result.done) {
    const either = result.value
    if (either.tag === 'Left') return either  // short-circuit
    result = iterator.next(either.value)      // unwrap Right, продолжаем
  }
  return Right(result.value)
}`}</div>
      </div>

      {/* Config inputs */}
      <div style={panelStyle}>
        <div style={labelStyle}>Параметры конфига</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem', marginBottom: '0.7rem' }}>
          {(['host', 'port', 'dbName', 'timeout'] as const).map(key => (
            <div key={key}>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.2rem' }}>{key}</div>
              <input
                style={inputStyle}
                value={input[key]}
                onChange={e => { setInput(prev => ({ ...prev, [key]: e.target.value })); setExecuted(false) }}
              />
            </div>
          ))}
        </div>
        <button style={{ ...btnStyle(true), marginTop: '0.3rem' }} onClick={() => setExecuted(true)}>
          Выполнить оба подхода
        </button>
        <button style={{ ...btnStyle(), marginLeft: '0.5rem' }} onClick={() => {
          setInput({ host: '', port: '99999', dbName: '123invalid', timeout: '-1' })
          setExecuted(false)
        }}>
          Невалидные данные
        </button>
        <button style={{ ...btnStyle(), marginLeft: '0.5rem' }} onClick={() => {
          setInput({ host: 'localhost', port: '5432', dbName: 'mydb', timeout: '3000' })
          setExecuted(false)
        }}>
          Сбросить
        </button>
      </div>

      {/* Two columns comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={panelStyle}>
          <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '0.4rem' }}>flatMap цепочка</div>
          <div style={codeBlock}>{`parseConfigFlatMap(input):

eitherFlatMap(parseHost(host), host =>
  eitherFlatMap(parsePort(port), port =>
    eitherFlatMap(parseDbName(dbName), dbName =>
      eitherFlatMap(parseTimeout(timeout), timeout =>
        Right({ host, port, dbName, timeout,
          connectionString: \`...\`
        })
      )
    )
  )
)`}</div>
          <div style={resultBox(flatMapResult)}>
            {flatMapResultStr ? flatMapResultStr.text : 'Нажмите "Выполнить"...'}
          </div>
        </div>

        <div style={panelStyle}>
          <div style={{ color: '#6ee7b7', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Do-нотация</div>
          <div style={codeBlock}>{`parseConfigDo(input):

Do(function* () {
  const host    = yield parseHost(host)
  const port    = yield parsePort(port)
  const dbName  = yield parseDbName(dbName)
  const timeout = yield parseTimeout(timeout)
  return { host, port, dbName, timeout,
    connectionString: \`...\`
  }
})`}</div>
          <div style={resultBox(doResult)}>
            {doResultStr ? doResultStr.text : 'Нажмите "Выполнить"...'}
          </div>
        </div>
      </div>

      {/* Diff / identical indicator */}
      {executed && flatMapResult && doResult && (
        <div style={{
          ...panelStyle,
          marginBottom: 0,
          background: identical ? '#0d2a1f' : '#2d1515',
          border: `1px solid ${identical ? '#10b981' : '#ef4444'}`,
        }}>
          {identical ? (
            <span style={{ color: '#6ee7b7' }}>
              Результаты идентичны. Do-нотация — это синтаксический сахар над flatMap, семантика одинакова.
            </span>
          ) : (
            <span style={{ color: '#f87171' }}>
              Результаты различаются — это баг в реализации Do.
            </span>
          )}
        </div>
      )}
    </div>
  )
}
