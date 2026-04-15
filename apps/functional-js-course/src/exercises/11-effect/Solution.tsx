import { useState, useCallback, useRef } from 'react'
import { Effect, Context, Layer } from 'effect'

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
  marginBottom: '0.4rem',
})

const labelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '0.78rem',
  marginBottom: '0.4rem',
}

const badgeStyle = (color: 'green' | 'red' | 'yellow' | 'blue'): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: color === 'green' ? '#14532d' : color === 'red' ? '#7f1d1d' : color === 'yellow' ? '#78350f' : '#1e3a5f',
  color: color === 'green' ? '#86efac' : color === 'red' ? '#fca5a5' : color === 'yellow' ? '#fde68a' : '#93c5fd',
})

const sectionTitle: React.CSSProperties = {
  color: '#f9fafb',
  fontWeight: 700,
  fontSize: '0.95rem',
  marginBottom: '0.75rem',
  borderBottom: '1px solid #374151',
  paddingBottom: '0.4rem',
}

const logEntryStyle = (type: 'effect' | 'info' | 'error' | 'ok'): React.CSSProperties => ({
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  marginBottom: '0.2rem',
  fontSize: '0.78rem',
  background: type === 'effect' ? '#1e3a1e' : type === 'error' ? '#3b0f0f' : type === 'ok' ? '#1a3a2e' : '#1e2a3a',
  color: type === 'effect' ? '#86efac' : type === 'error' ? '#fca5a5' : type === 'ok' ? '#6ee7b7' : '#93c5fd',
  fontFamily: 'monospace',
})

// ============================================
// Task 11.1: Effect — основы (lazy vs eager)
// ============================================

export function Task11_1_Solution() {
  // --- Promise column state ---
  const [promiseLog, setPromiseLog] = useState<string[]>([])
  const [promiseResult, setPromiseResult] = useState<string | null>(null)
  const promiseRef = useRef<Promise<number> | null>(null)

  // --- Effect column state ---
  const [effectLog, setEffectLog] = useState<string[]>([])
  const [effectResult, setEffectResult] = useState<string | null>(null)
  const effectRef = useRef<Effect.Effect<number, never, never> | null>(null)

  // --- Chain demo state ---
  const [chainInput, setChainInput] = useState(5)
  const [chainResult, setChainResult] = useState<string | null>(null)

  // ---- Promise side ----
  const createPromise = useCallback(() => {
    setPromiseLog(['[CREATE] new Promise(resolve => {...})'])
    setPromiseResult(null)
    promiseRef.current = new Promise<number>(resolve => {
      // Side effect happens immediately on creation
      setPromiseLog(prev => [...prev, '[SIDE EFFECT] console.log("SIDE EFFECT!") — выполнился сразу!'])
      resolve(42)
    })
    setPromiseLog(prev => [...prev, '[CREATED] Promise создан — побочный эффект уже случился'])
  }, [])

  const runPromise = useCallback(() => {
    if (!promiseRef.current) {
      setPromiseLog(['Сначала нажмите "Создать"'])
      return
    }
    promiseRef.current.then(val => {
      setPromiseResult(`${val}`)
      setPromiseLog(prev => [...prev, `[.then()] Результат: ${val}`])
    })
  }, [])

  // ---- Effect side ----
  const createEffect = useCallback(() => {
    setEffectLog(['[CREATE] Effect.sync(() => {...})'])
    setEffectResult(null)
    // Nothing executes here — Effect is just a description
    effectRef.current = Effect.sync(() => {
      return 42
    })
    setEffectLog(prev => [...prev, '[CREATED] Effect создан — побочный эффект НЕ случился', '[LAZY] Лог пуст — Effect ждёт запуска'])
  }, [])

  const runEffect = useCallback(() => {
    if (!effectRef.current) {
      setEffectLog(['Сначала нажмите "Создать"'])
      return
    }
    setEffectLog(prev => [...prev, '[runSync] Запускаем Effect...', '[SIDE EFFECT] console.log("SIDE EFFECT!") — только сейчас!'])
    const val = Effect.runSync(effectRef.current)
    setEffectResult(`${val}`)
    setEffectLog(prev => [...prev, `[RESULT] Результат: ${val}`])
  }, [])

  // ---- Chain demo ----
  const runChain = useCallback(() => {
    const program = Effect.succeed(chainInput).pipe(
      Effect.map((n) => n * 2),
      Effect.flatMap((n) => Effect.succeed(n + 1)),
      Effect.map((n) => `Result: ${n}`)
    )
    const result = Effect.runSync(program)
    setChainResult(result)
  }, [chainInput])

  return (
    <div style={containerStyle}>
      <div style={sectionTitle}>Effect: основы — lazy vs eager</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {/* Promise column */}
        <div style={panelStyle}>
          <div style={{ ...labelStyle, fontSize: '0.85rem', color: '#fde68a', marginBottom: '0.6rem' }}>
            Promise (eager)
          </div>
          <div style={codeBlock}>{`const p = new Promise(resolve => {
  console.log('SIDE EFFECT!')
  resolve(42)
})
// ^ побочный эффект уже случился!`}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button style={btnStyle()} onClick={createPromise}>Создать Promise</button>
            <button style={btnStyle()} onClick={runPromise}>Запустить .then()</button>
          </div>
          {promiseResult !== null && (
            <div style={{ marginTop: '0.5rem' }}>
              <span style={badgeStyle('green')}>Результат: {promiseResult}</span>
            </div>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            {promiseLog.length === 0
              ? <div style={logEntryStyle('info')}>Лог пуст</div>
              : promiseLog.map((entry, i) => (
                <div key={i} style={logEntryStyle(entry.includes('SIDE EFFECT') ? 'effect' : entry.includes('Результат') ? 'ok' : 'info')}>
                  {entry}
                </div>
              ))}
          </div>
        </div>

        {/* Effect column */}
        <div style={panelStyle}>
          <div style={{ ...labelStyle, fontSize: '0.85rem', color: '#86efac', marginBottom: '0.6rem' }}>
            Effect (lazy)
          </div>
          <div style={codeBlock}>{`const e = Effect.sync(() => {
  console.log('SIDE EFFECT!')
  return 42
})
// ^ ничего не случилось!`}</div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <button style={btnStyle()} onClick={createEffect}>Создать Effect</button>
            <button style={btnStyle()} onClick={runEffect}>runSync</button>
          </div>
          {effectResult !== null && (
            <div style={{ marginTop: '0.5rem' }}>
              <span style={badgeStyle('green')}>Результат: {effectResult}</span>
            </div>
          )}
          <div style={{ marginTop: '0.75rem' }}>
            {effectLog.length === 0
              ? <div style={logEntryStyle('info')}>Лог пуст</div>
              : effectLog.map((entry, i) => (
                <div key={i} style={logEntryStyle(entry.includes('SIDE EFFECT') ? 'effect' : entry.includes('Результат') ? 'ok' : entry.includes('ждёт') ? 'info' : 'info')}>
                  {entry}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Chain demo */}
      <div style={panelStyle}>
        <div style={{ ...labelStyle, fontSize: '0.85rem', color: '#c4b5fd', marginBottom: '0.6rem' }}>
          Цепочка операций с pipe
        </div>
        <div style={codeBlock}>{`const program = Effect.succeed(${chainInput}).pipe(
  Effect.map(n => n * 2),          // ${chainInput} * 2 = ${chainInput * 2}
  Effect.flatMap(n => Effect.succeed(n + 1)), // ${chainInput * 2} + 1 = ${chainInput * 2 + 1}
  Effect.map(n => \`Result: \${n}\`)  // "Result: ${chainInput * 2 + 1}"
)`}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <div style={labelStyle}>Начальное число</div>
            <input
              type="range"
              min={1}
              max={20}
              value={chainInput}
              onChange={e => { setChainInput(Number(e.target.value)); setChainResult(null) }}
              style={{ width: '140px', accentColor: '#6366f1' }}
            />
            <span style={{ marginLeft: '0.5rem', color: '#c4b5fd' }}>{chainInput}</span>
          </div>
          <button style={btnStyle()} onClick={runChain}>Effect.runSync</button>
          {chainResult !== null && <span style={badgeStyle('green')}>{chainResult}</span>}
        </div>
      </div>

      <div style={{ ...panelStyle, background: '#1a2035', borderLeft: '3px solid #6366f1' }}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.4rem' }}>Ключевая идея</div>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
          <strong style={{ color: '#e5e7eb' }}>Effect — это описание программы, не её выполнение.</strong>
          {' '}Promise запускает код сразу при создании (eager). Effect — это ленивое (lazy) значение:
          оно хранит <em>инструкцию</em> что делать, но ничего не запускает до явного вызова
          <code style={{ color: '#93c5fd' }}> runSync</code> / <code style={{ color: '#93c5fd' }}>runPromise</code>.
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 11.2: Effect — типизированные ошибки
// ============================================

// Typed error classes
class NetworkError {
  readonly _tag = 'NetworkError'
  constructor(readonly url: string) {}
}
class ValidationError {
  readonly _tag = 'ValidationError'
  constructor(readonly field: string, readonly message: string) {}
}
class AuthError {
  readonly _tag = 'AuthError'
  constructor(readonly reason: string) {}
}

type AppError = NetworkError | ValidationError | AuthError

interface AuthUser { id: number; name: string; token: string }
interface RawData { payload: string; userId: number }
interface ValidData { result: string; userId: number }

// Step implementations
function authenticate(token: string, fail: boolean): Effect.Effect<AuthUser, AuthError> {
  if (fail) return Effect.fail(new AuthError('Invalid token: ' + token))
  return Effect.succeed({ id: 1, name: 'Alice', token })
}

function fetchData(url: string, fail: boolean): Effect.Effect<RawData, NetworkError> {
  if (fail) return Effect.fail(new NetworkError(url))
  return Effect.succeed({ payload: 'raw-data', userId: 1 })
}

function validate(data: RawData, fail: boolean): Effect.Effect<ValidData, ValidationError> {
  if (fail) return Effect.fail(new ValidationError('payload', 'Too short'))
  return Effect.succeed({ result: data.payload.toUpperCase(), userId: data.userId })
}

type StepStatus = 'pending' | 'ok' | 'error' | 'skipped' | 'recovered'

interface PipelineResult {
  steps: { name: string; status: StepStatus; detail: string; type: string }[]
  finalError: AppError | null
  finalValue: string | null
  errorType: string
}

function runPipeline(
  failAuth: boolean,
  failFetch: boolean,
  failValidate: boolean,
  withCatch: boolean,
): PipelineResult {
  const steps: PipelineResult['steps'] = []
  let finalError: AppError | null = null
  let finalValue: string | null = null
  let errorType = ''

  // Step 1: auth
  const authEffect = authenticate('token-abc', failAuth)
  let authResult: AuthUser | null = null
  try {
    authResult = Effect.runSync(authEffect)
    steps.push({ name: 'authenticate()', status: 'ok', detail: `User: ${authResult.name}`, type: 'Effect<User, AuthError>' })
  } catch (e: unknown) {
    const err = (e as { cause?: AppError }).cause ?? e as AppError
    if (withCatch && err instanceof AuthError) {
      steps.push({ name: 'authenticate()', status: 'recovered', detail: `AuthError recovered: guest user`, type: 'Effect<User, never> [caught AuthError]' })
      authResult = { id: 0, name: 'Guest', token: '' }
    } else {
      steps.push({ name: 'authenticate()', status: 'error', detail: `AuthError: ${(err as AuthError).reason ?? String(err)}`, type: 'Effect<never, AuthError>' })
      finalError = err as AuthError
      errorType = 'AuthError'
      return { steps, finalError, finalValue, errorType }
    }
  }

  // Step 2: fetch
  const fetchEffect = fetchData('/api/data', failFetch)
  let fetchResult: RawData | null = null
  try {
    fetchResult = Effect.runSync(fetchEffect)
    steps.push({ name: 'fetchData()', status: 'ok', detail: `payload: "${fetchResult.payload}"`, type: 'Effect<Data, NetworkError>' })
  } catch (e: unknown) {
    const err = (e as { cause?: AppError }).cause ?? e as AppError
    if (withCatch && err instanceof NetworkError) {
      steps.push({ name: 'fetchData()', status: 'recovered', detail: `NetworkError recovered: fallback data`, type: 'Effect<Data, never> [caught NetworkError]' })
      fetchResult = { payload: 'fallback', userId: authResult.id }
    } else {
      steps.push({ name: 'fetchData()', status: 'error', detail: `NetworkError: ${(err as NetworkError).url ?? String(err)}`, type: 'Effect<never, NetworkError>' })
      finalError = err as NetworkError
      errorType = 'NetworkError'
      return { steps, finalError, finalValue, errorType }
    }
  }

  // Step 3: validate
  const validateEffect = validate(fetchResult, failValidate)
  try {
    const validResult = Effect.runSync(validateEffect)
    steps.push({ name: 'validate()', status: 'ok', detail: `result: "${validResult.result}"`, type: 'Effect<ValidData, ValidationError>' })
    finalValue = validResult.result
  } catch (e: unknown) {
    const err = (e as { cause?: AppError }).cause ?? e as AppError
    if (withCatch && err instanceof ValidationError) {
      steps.push({ name: 'validate()', status: 'recovered', detail: `ValidationError recovered: default value`, type: 'Effect<ValidData, never> [caught ValidationError]' })
      finalValue = 'DEFAULT'
    } else {
      steps.push({ name: 'validate()', status: 'error', detail: `ValidationError: ${(err as ValidationError).message ?? String(err)}`, type: 'Effect<never, ValidationError>' })
      finalError = err as ValidationError
      errorType = 'ValidationError'
      return { steps, finalError, finalValue, errorType }
    }
  }

  return { steps, finalError, finalValue, errorType }
}

export function Task11_2_Solution() {
  const [failAuth, setFailAuth] = useState(false)
  const [failFetch, setFailFetch] = useState(false)
  const [failValidate, setFailValidate] = useState(false)
  const [withCatch, setWithCatch] = useState(false)
  const [result, setResult] = useState<PipelineResult | null>(null)

  const run = useCallback(() => {
    setResult(runPipeline(failAuth, failFetch, failValidate, withCatch))
  }, [failAuth, failFetch, failValidate, withCatch])

  const stepColor = (s: StepStatus): 'green' | 'red' | 'yellow' | 'blue' => {
    if (s === 'ok') return 'green'
    if (s === 'error') return 'red'
    if (s === 'recovered') return 'yellow'
    return 'blue'
  }

  return (
    <div style={containerStyle}>
      <div style={sectionTitle}>Effect: типизированные ошибки</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Controls */}
        <div style={panelStyle}>
          <div style={{ ...labelStyle, marginBottom: '0.7rem' }}>Настройка шагов</div>
          <div style={codeBlock}>{`// Typed errors
class NetworkError { _tag = 'NetworkError' }
class ValidationError { _tag = 'ValidationError' }
class AuthError { _tag = 'AuthError' }

// Pipeline
authenticate(token)    // Effect<User,  AuthError>
  .flatMap(fetchData)  // Effect<Data,  NetworkError>
  .flatMap(validate)   // Effect<Valid, ValidationError>`}</div>

          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Step 1: authenticate() упадёт', val: failAuth, set: setFailAuth },
              { label: 'Step 2: fetchData() упадёт', val: failFetch, set: setFailFetch },
              { label: 'Step 3: validate() упадёт', val: failValidate, set: setFailValidate },
            ].map(({ label, val, set }) => (
              <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: val ? '#fca5a5' : '#9ca3af' }}>
                <input type="checkbox" checked={val} onChange={e => { set(e.target.checked); setResult(null) }} />
                {label}
              </label>
            ))}
          </div>

          <div style={{ marginTop: '1rem', borderTop: '1px solid #374151', paddingTop: '0.75rem' }}>
            <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Режим обработки</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button style={btnStyle(!withCatch)} onClick={() => { setWithCatch(false); setResult(null) }}>Без обработки</button>
              <button style={btnStyle(withCatch)} onClick={() => { setWithCatch(true); setResult(null) }}>С catchTag</button>
            </div>
          </div>

          <button style={{ ...btnStyle(), marginTop: '0.75rem', background: '#1e3a5f', color: '#93c5fd', border: '1px solid #3b82f6' }} onClick={run}>
            Запустить pipeline
          </button>
        </div>

        {/* Results */}
        <div style={panelStyle}>
          <div style={{ ...labelStyle, marginBottom: '0.7rem' }}>Результат выполнения</div>
          {result === null ? (
            <div style={{ color: '#4b5563', fontSize: '0.82rem' }}>Нажмите "Запустить pipeline"</div>
          ) : (
            <>
              {result.steps.map((step, i) => (
                <div key={i} style={{ marginBottom: '0.6rem', borderLeft: `3px solid ${step.status === 'ok' ? '#16a34a' : step.status === 'recovered' ? '#ca8a04' : step.status === 'error' ? '#dc2626' : '#2563eb'}`, paddingLeft: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#f9fafb', fontWeight: 600 }}>{i + 1}. {step.name}</span>
                    <span style={badgeStyle(stepColor(step.status))}>
                      {step.status === 'ok' ? 'OK' : step.status === 'recovered' ? 'RECOVERED' : step.status === 'error' ? 'ERROR' : 'SKIPPED'}
                    </span>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.77rem', marginTop: '0.2rem' }}>{step.detail}</div>
                  <div style={{ color: '#4b5563', fontSize: '0.73rem', marginTop: '0.15rem' }}>{step.type}</div>
                </div>
              ))}

              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #374151' }}>
                {result.finalValue !== null ? (
                  <div style={logEntryStyle('ok')}>Успех: "{result.finalValue}"</div>
                ) : result.finalError !== null ? (
                  <div style={logEntryStyle('error')}>
                    Pipeline упал: {result.errorType}
                    {result.finalError instanceof NetworkError && ` (url: ${result.finalError.url})`}
                    {result.finalError instanceof ValidationError && ` (field: ${result.finalError.field})`}
                    {result.finalError instanceof AuthError && ` (reason: ${result.finalError.reason})`}
                  </div>
                ) : null}
              </div>

              {withCatch && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: '#9ca3af' }}>
                  <div style={{ color: '#fde68a', marginBottom: '0.3rem' }}>catchTag в действии:</div>
                  <div style={codeBlock}>{`Effect.catchTag('NetworkError', e =>
  Effect.succeed(fallbackData))

Effect.catchTag('AuthError', e =>
  Effect.succeed(guestUser))`}</div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ ...panelStyle, background: '#1a2035', borderLeft: '3px solid #6366f1', marginTop: '0.5rem' }}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.4rem' }}>Effect&lt;Success, Error, Requirements&gt;</div>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
          Три параметра типа: что вернёт, что может сломаться, что требует из окружения.
          <code style={{ color: '#93c5fd' }}> catchTag</code> перехватывает конкретный тег — TypeScript сужает тип ошибки.
          После <code style={{ color: '#93c5fd' }}>catchTag('NetworkError', ...)</code> тип ошибки уже не содержит NetworkError.
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 11.3: Effect — Layer и DI
// ============================================

// Service definitions
class UserRepo extends Context.Tag('UserRepo')<
  UserRepo,
  {
    findById: (id: number) => Effect.Effect<{ id: number; name: string } | null>
    listAll: () => Effect.Effect<Array<{ id: number; name: string }>>
  }
>() {}

class AppLogger extends Context.Tag('AppLogger')<
  AppLogger,
  {
    log: (msg: string) => Effect.Effect<void>
  }
>() {}

class NotFoundError {
  readonly _tag = 'NotFoundError'
  constructor(readonly id: number) {}
}

// In-memory DB
const IN_MEMORY_USERS = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Carol' },
]

// Dev layers
const InMemoryUserRepo = Layer.succeed(UserRepo, {
  findById: (id) => Effect.succeed(IN_MEMORY_USERS.find(u => u.id === id) ?? null),
  listAll: () => Effect.succeed(IN_MEMORY_USERS),
})

// Mock layers (for testing)
const MockUserRepo = Layer.succeed(UserRepo, {
  findById: (id) => id === 99
    ? Effect.succeed(null)
    : Effect.succeed({ id, name: `MockUser#${id}` }),
  listAll: () => Effect.succeed([{ id: 42, name: 'MockUser#42' }]),
})

// Dev logger: collects logs
function makeDevLogger(collector: (msg: string) => void) {
  return Layer.succeed(AppLogger, {
    log: (msg) => Effect.sync(() => collector(msg)),
  })
}

// Silent logger
const SilentLogger = Layer.succeed(AppLogger, {
  log: (_msg) => Effect.succeed(undefined),
})

// Business logic program — does NOT know about implementations
function makeProgram(userId: number) {
  return Effect.gen(function* () {
    const repo = yield* UserRepo
    const logger = yield* AppLogger
    yield* logger.log(`Поиск пользователя #${userId}...`)
    const user = yield* repo.findById(userId)
    if (!user) {
      yield* logger.log(`Пользователь #${userId} не найден`)
      return yield* Effect.fail(new NotFoundError(userId))
    }
    yield* logger.log(`Найден: ${user.name}`)
    return user
  })
}

export function Task11_3_Solution() {
  const [env, setEnv] = useState<'dev' | 'test'>('dev')
  const [userId, setUserId] = useState('1')
  const [logs, setLogs] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ran, setRan] = useState(false)

  const run = useCallback(() => {
    const id = parseInt(userId) || 0
    const collectedLogs: string[] = []

    const program = makeProgram(id)

    let layer: Layer.Layer<UserRepo | AppLogger>

    if (env === 'dev') {
      const devLogger = makeDevLogger(msg => collectedLogs.push(`[DEV LOG] ${msg}`))
      layer = Layer.merge(InMemoryUserRepo, devLogger)
    } else {
      layer = Layer.merge(MockUserRepo, SilentLogger)
      collectedLogs.push('[TEST] Используется MockUserRepo + SilentLogger')
      collectedLogs.push('[TEST] Логи не выводятся в тестовом окружении')
    }

    const runnable = Effect.provide(program, layer)

    Effect.runPromise(runnable).then(
      user => {
        setLogs(collectedLogs)
        setResult(`{ id: ${user.id}, name: "${user.name}" }`)
        setError(null)
        setRan(true)
      },
      err => {
        const cause = err?.cause ?? err
        setLogs(collectedLogs)
        setResult(null)
        setError(cause instanceof NotFoundError
          ? `NotFoundError: пользователь #${cause.id} не найден`
          : String(cause))
        setRan(true)
      }
    )
  }, [env, userId])

  return (
    <div style={containerStyle}>
      <div style={sectionTitle}>Effect: Layer и Dependency Injection</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left: code + controls */}
        <div>
          <div style={panelStyle}>
            <div style={{ ...labelStyle, fontSize: '0.82rem', color: '#c4b5fd', marginBottom: '0.5rem' }}>Сервисы (Context.Tag)</div>
            <div style={codeBlock}>{`class UserRepo extends Context.Tag('UserRepo')<
  UserRepo, {
    findById: (id: number) =>
      Effect.Effect<User | null>
    listAll: () =>
      Effect.Effect<User[]>
  }
>() {}

class AppLogger extends Context.Tag('AppLogger')<
  AppLogger, {
    log: (msg: string) =>
      Effect.Effect<void>
  }
>() {}`}</div>
          </div>

          <div style={panelStyle}>
            <div style={{ ...labelStyle, fontSize: '0.82rem', color: '#86efac', marginBottom: '0.5rem' }}>Бизнес-логика (не знает реализации)</div>
            <div style={codeBlock}>{`const program = Effect.gen(function* () {
  const repo   = yield* UserRepo    // <- DI
  const logger = yield* AppLogger   // <- DI
  yield* logger.log('Поиск...')
  const user = yield* repo.findById(userId)
  if (!user) yield* Effect.fail(
    new NotFoundError(userId))
  yield* logger.log('Найден: ' + user.name)
  return user
})`}</div>
          </div>

          <div style={panelStyle}>
            <div style={{ ...labelStyle, fontSize: '0.82rem', marginBottom: '0.6rem' }}>Окружение</div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <button style={btnStyle(env === 'dev')} onClick={() => { setEnv('dev'); setRan(false) }}>Dev</button>
              <button style={btnStyle(env === 'test')} onClick={() => { setEnv('test'); setRan(false) }}>Test</button>
            </div>
            <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '0.75rem' }}>
              {env === 'dev'
                ? 'InMemoryUserRepo + ConsoleLogger (пишет логи)'
                : 'MockUserRepo + SilentLogger (логи заглушены)'}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={labelStyle}>userId</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['1', '2', '3', '99'].map(id => (
                  <button key={id} style={btnStyle(userId === id)} onClick={() => { setUserId(id); setRan(false) }}>
                    {id === '99' ? '99 (не найден)' : `#${id}`}
                  </button>
                ))}
              </div>
            </div>
            <button style={{ ...btnStyle(), background: '#1e3a5f', color: '#93c5fd', border: '1px solid #3b82f6' }} onClick={run}>
              Effect.runPromise
            </button>
          </div>
        </div>

        {/* Right: dependency graph + result */}
        <div>
          {/* Dependency graph */}
          <div style={panelStyle}>
            <div style={{ ...labelStyle, fontSize: '0.82rem', marginBottom: '0.6rem' }}>Граф зависимостей</div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '0.5rem' }}>
              <div style={{ background: '#1e3a5f', border: '2px solid #3b82f6', borderRadius: '8px', padding: '0.4rem 1.2rem', color: '#93c5fd', fontWeight: 700 }}>
                program
              </div>
              <div style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', color: '#4b5563', fontSize: '1.1rem' }}>↙  ↘</div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#1a2a1a', border: '2px solid #16a34a', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#86efac', marginBottom: '0.3rem' }}>
                    UserRepo
                  </div>
                  <div style={{ fontSize: '0.73rem', color: env === 'dev' ? '#86efac' : '#fde68a' }}>
                    {env === 'dev' ? 'InMemoryUserRepo' : 'MockUserRepo'}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#1a1a2a', border: '2px solid #7c3aed', borderRadius: '8px', padding: '0.4rem 0.8rem', color: '#c4b5fd', marginBottom: '0.3rem' }}>
                    AppLogger
                  </div>
                  <div style={{ fontSize: '0.73rem', color: env === 'dev' ? '#86efac' : '#fde68a' }}>
                    {env === 'dev' ? 'ConsoleLogger' : 'SilentLogger'}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#4b5563', marginTop: '0.3rem' }}>
                Layer.merge(UserRepo, AppLogger)
              </div>
            </div>
          </div>

          {/* Layer code */}
          <div style={panelStyle}>
            <div style={{ ...labelStyle, fontSize: '0.82rem', marginBottom: '0.5rem', color: env === 'dev' ? '#86efac' : '#fde68a' }}>
              {env === 'dev' ? 'Dev Layer' : 'Test Layer'}
            </div>
            <div style={codeBlock}>{env === 'dev'
              ? `const InMemoryUserRepo = Layer.succeed(
  UserRepo, {
    findById: id => Effect.succeed(
      users.find(u => u.id === id) ?? null
    )
  }
)
const ConsoleLogger = Layer.succeed(
  AppLogger, {
    log: msg => Effect.sync(
      () => console.log(msg)
    )
  }
)`
              : `const MockUserRepo = Layer.succeed(
  UserRepo, {
    findById: id => Effect.succeed(
      { id, name: 'MockUser#' + id }
    )
  }
)
const SilentLogger = Layer.succeed(
  AppLogger, {
    log: _ => Effect.succeed(undefined)
  }
)`
            }</div>
          </div>

          {/* Result */}
          {ran && (
            <div style={panelStyle}>
              <div style={{ ...labelStyle, marginBottom: '0.5rem' }}>Результат</div>
              {result !== null
                ? <div style={logEntryStyle('ok')}>Успех: {result}</div>
                : <div style={logEntryStyle('error')}>{error}</div>}
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ ...labelStyle, marginBottom: '0.3rem' }}>Лог выполнения</div>
                {logs.length === 0
                  ? <div style={{ color: '#4b5563', fontSize: '0.78rem' }}>(логи заглушены)</div>
                  : logs.map((line, i) => (
                    <div key={i} style={logEntryStyle(line.includes('TEST') ? 'info' : 'effect')}>
                      {line}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ ...panelStyle, background: '#1a2035', borderLeft: '3px solid #6366f1' }}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.4rem' }}>Аналогия: Effect = чертёж</div>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', lineHeight: '1.6' }}>
          <strong style={{ color: '#e5e7eb' }}>program</strong> — чертёж здания (не зависит от поставщиков).
          {' '}<strong style={{ color: '#e5e7eb' }}>Layer</strong> — поставщик материалов (Dev vs Test).
          {' '}<strong style={{ color: '#e5e7eb' }}>Effect.runPromise</strong> — само строительство.
          Меняешь Layer — меняется поведение без единого изменения в бизнес-логике.
        </div>
      </div>
    </div>
  )
}
