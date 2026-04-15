import { useState, useCallback, useRef, useEffect } from 'react'

// ============================================
// Shared styles
// ============================================

const cs: React.CSSProperties = {
  background: '#111827',
  color: '#e5e7eb',
  padding: '1.5rem',
  borderRadius: '12px',
  fontFamily: 'monospace',
  fontSize: '0.88rem',
}

const panel: React.CSSProperties = {
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

const btn = (variant: 'default' | 'active' | 'danger' | 'success' | 'warn' = 'default'): React.CSSProperties => ({
  background:
    variant === 'active' ? '#1e3a5f' :
    variant === 'danger' ? '#4c1d1d' :
    variant === 'success' ? '#14532d' :
    variant === 'warn' ? '#78350f' :
    '#374151',
  color:
    variant === 'active' ? '#93c5fd' :
    variant === 'danger' ? '#fca5a5' :
    variant === 'success' ? '#86efac' :
    variant === 'warn' ? '#fde68a' :
    '#e5e7eb',
  border: `1px solid ${
    variant === 'active' ? '#3b82f6' :
    variant === 'danger' ? '#ef4444' :
    variant === 'success' ? '#22c55e' :
    variant === 'warn' ? '#f59e0b' :
    '#4b5563'
  }`,
  borderRadius: '6px',
  padding: '0.35rem 0.9rem',
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontFamily: 'monospace',
  marginRight: '0.4rem',
  marginBottom: '0.4rem',
})

const sectionTitle: React.CSSProperties = {
  color: '#f9fafb',
  fontWeight: 700,
  fontSize: '0.95rem',
  marginBottom: '0.75rem',
  borderBottom: '1px solid #374151',
  paddingBottom: '0.4rem',
}

const inputStyle = (invalid?: boolean): React.CSSProperties => ({
  background: '#0f172a',
  border: `1px solid ${invalid ? '#ef4444' : '#374151'}`,
  color: '#e5e7eb',
  borderRadius: '4px',
  padding: '0.4rem 0.6rem',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
})

const badge = (color: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'purple'): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background:
    color === 'green' ? '#14532d' :
    color === 'red' ? '#7f1d1d' :
    color === 'yellow' ? '#78350f' :
    color === 'blue' ? '#1e3a5f' :
    color === 'purple' ? '#3b0764' :
    '#1f2937',
  color:
    color === 'green' ? '#86efac' :
    color === 'red' ? '#fca5a5' :
    color === 'yellow' ? '#fde68a' :
    color === 'blue' ? '#93c5fd' :
    color === 'purple' ? '#d8b4fe' :
    '#9ca3af',
})

// ============================================
// Task 13.1: FP-валидация формы
// ============================================

// Either monad
type Left<E> = { tag: 'Left'; value: E }
type Right<A> = { tag: 'Right'; value: A }
type Either<E, A> = Left<E> | Right<A>

function Left<E>(value: E): Left<E> { return { tag: 'Left', value } }
function Right<A>(value: A): Right<A> { return { tag: 'Right', value } }
function isLeft<E, A>(e: Either<E, A>): e is Left<E> { return e.tag === 'Left' }
function isRight<E, A>(e: Either<E, A>): e is Right<A> { return e.tag === 'Right' }

function mapRight<E, A, B>(e: Either<E, A>, f: (a: A) => B): Either<E, B> {
  return isRight(e) ? Right(f(e.value)) : e
}

function flatMap<E, A, B>(e: Either<E, A>, f: (a: A) => Either<E, B>): Either<E, B> {
  return isRight(e) ? f(e.value) : e
}

// Validation (collect all errors)
type Validation<E, A> = Either<E[], A>

function validateAll_<E, A>(validators: Array<Either<E, A>>): Either<E[], unknown> {
  const errors = validators.filter(isLeft).map(e => (e as Left<E>).value)
  return errors.length > 0 ? Left(errors) : Right(null)
}

// Form types
interface FormData {
  name: string
  email: string
  age: string
  password: string
}

interface ValidData {
  name: string
  email: string
  age: number
  password: string
}

// Validators
function validateName(name: string): Either<string, string> {
  if (!name.trim()) return Left('Имя не может быть пустым')
  if (name.trim().length < 2) return Left('Имя должно содержать минимум 2 символа')
  if (name.trim().length > 50) return Left('Имя не должно превышать 50 символов')
  return Right(name.trim())
}

function validateEmail(email: string): Either<string, string> {
  if (!email.includes('@')) return Left('Email должен содержать @')
  if (!email.includes('.')) return Left('Email должен содержать точку')
  return Right(email.trim())
}

function validateAge(ageStr: string): Either<string, number> {
  const age = parseInt(ageStr, 10)
  if (isNaN(age)) return Left('Возраст должен быть числом')
  if (age < 18) return Left('Возраст должен быть не менее 18 лет')
  if (age > 120) return Left('Возраст не должен превышать 120 лет')
  return Right(age)
}

function validatePassword(password: string): Either<string, string> {
  if (password.length < 8) return Left('Пароль должен содержать минимум 8 символов')
  if (!/\d/.test(password)) return Left('Пароль должен содержать хотя бы одну цифру')
  if (!/[A-Z]/.test(password)) return Left('Пароль должен содержать хотя бы одну заглавную букву')
  return Right(password)
}

// Either (fail-fast)
function validateEither(data: FormData): Either<string, ValidData> {
  return flatMap(validateName(data.name), name =>
    flatMap(validateEmail(data.email), email =>
      flatMap(validateAge(data.age), age =>
        mapRight(validatePassword(data.password), password => ({ name, email, age, password }))
      )
    )
  )
}

// Validation (collect all)
function validateCollect(data: FormData): Validation<string, ValidData> {
  const nameR = validateName(data.name)
  const emailR = validateEmail(data.email)
  const ageR = validateAge(data.age)
  const passR = validatePassword(data.password)

  type AnyEither = Either<string, string> | Either<string, number>
  const allResults: AnyEither[] = [nameR, emailR, ageR, passR]
  const errors = allResults.filter((e): e is Left<string> => e.tag === 'Left').map(e => e.value)
  if (errors.length > 0) return Left(errors)

  return Right({
    name: (nameR as Right<string>).value,
    email: (emailR as Right<string>).value,
    age: (ageR as Right<number>).value,
    password: (passR as Right<string>).value,
  })
}

// Field validation state
type FieldState = 'untouched' | 'valid' | 'invalid'

interface FieldStatus {
  state: FieldState
  error: string | null
}

export function Task13_1_Solution() {
  const [mode, setMode] = useState<'failfast' | 'collect'>('failfast')
  const [form, setForm] = useState<FormData>({ name: '', email: '', age: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState<Either<string | string[], ValidData> | null>(null)

  const handleSubmit = () => {
    setSubmitted(true)
    if (mode === 'failfast') {
      setResult(validateEither(form))
    } else {
      setResult(validateCollect(form))
    }
  }

  const handleReset = () => {
    setForm({ name: '', email: '', age: '', password: '' })
    setSubmitted(false)
    setResult(null)
  }

  // Compute per-field status for fail-fast mode
  const getFieldStatusFailFast = (field: keyof FormData): FieldStatus => {
    if (!submitted) return { state: 'untouched', error: null }
    const validators: Record<keyof FormData, (v: string) => Either<string, unknown>> = {
      name: validateName,
      email: validateEmail,
      age: validateAge,
      password: validatePassword,
    }
    const fields: Array<keyof FormData> = ['name', 'email', 'age', 'password']
    for (const f of fields) {
      const r = validators[f](form[f])
      if (isLeft(r)) {
        if (f === field) return { state: 'invalid', error: r.value }
        // subsequent fields are untouched (not reached)
        if (fields.indexOf(f) < fields.indexOf(field)) continue
        return { state: 'untouched', error: null }
      }
      if (f === field) return { state: 'valid', error: null }
    }
    return { state: 'valid', error: null }
  }

  // Compute per-field status for collect mode
  const getFieldStatusCollect = (field: keyof FormData): FieldStatus => {
    if (!submitted) return { state: 'untouched', error: null }
    const validators: Record<keyof FormData, (v: string) => Either<string, unknown>> = {
      name: validateName,
      email: validateEmail,
      age: validateAge,
      password: validatePassword,
    }
    const r = validators[field](form[field])
    if (isLeft(r)) return { state: 'invalid', error: r.value }
    return { state: 'valid', error: null }
  }

  const getFieldStatus = mode === 'failfast' ? getFieldStatusFailFast : getFieldStatusCollect

  // Count errors
  type AnyResult = Either<string, string> | Either<string, number>
  const totalErrors = submitted ? 4 - ([
    validateName(form.name), validateEmail(form.email),
    validateAge(form.age), validatePassword(form.password)
  ] as AnyResult[]).filter((e): e is Right<string> | Right<number> => e.tag === 'Right').length : 0

  const shownErrors = submitted && result
    ? isLeft(result)
      ? mode === 'failfast' ? 1 : (result.value as string[]).length
      : 0
    : 0

  const borderColor = (s: FieldState) =>
    s === 'valid' ? '#22c55e' : s === 'invalid' ? '#ef4444' : '#374151'

  const labelColor = (s: FieldState) =>
    s === 'valid' ? '#86efac' : s === 'invalid' ? '#fca5a5' : '#9ca3af'

  const fields: Array<{ key: keyof FormData; label: string; placeholder: string; type?: string }> = [
    { key: 'name', label: 'Имя', placeholder: 'Иван Иванов' },
    { key: 'email', label: 'Email', placeholder: 'user@example.com' },
    { key: 'age', label: 'Возраст', placeholder: '25' },
    { key: 'password', label: 'Пароль', placeholder: 'Secret1Pass', type: 'password' },
  ]

  return (
    <div style={cs}>
      <h2 style={{ color: '#f9fafb', marginTop: 0 }}>13.1 — FP-валидация формы</h2>

      {/* Mode switcher */}
      <div style={{ ...panel, display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ color: '#9ca3af' }}>Стратегия:</span>
        <button style={btn(mode === 'failfast' ? 'active' : 'default')} onClick={() => { setMode('failfast'); handleReset() }}>
          Either (fail-fast)
        </button>
        <button style={btn(mode === 'collect' ? 'active' : 'default')} onClick={() => { setMode('collect'); handleReset() }}>
          Validation (collect all)
        </button>
      </div>

      {/* Theory snippet */}
      <div style={panel}>
        <div style={sectionTitle}>
          {mode === 'failfast' ? 'Either — цепочка прерывается на первой ошибке' : 'Validation — собирает все ошибки'}
        </div>
        <div style={codeBlock}>
          {mode === 'failfast'
            ? `const validateEither = (data) =>
  flatMap(validateName(data.name), name =>
    flatMap(validateEmail(data.email), email =>
      flatMap(validateAge(data.age), age =>
        map(validatePassword(data.password), pass =>
          ({ name, email, age, password: pass })
        )
      )
    )
  )
// При первой ошибке — Left(error), остальное не проверяется`
            : `type Validation<E, A> = Either<E[], A>

const validateCollect = (data) => {
  const results = [
    validateName(data.name),
    validateEmail(data.email),
    validateAge(data.age),
    validatePassword(data.password),
  ]
  const errors = results.filter(isLeft).map(e => e.value)
  if (errors.length > 0) return Left(errors)  // ВСЕ ошибки
  return Right({ /* собрать значения */ })
}`}
        </div>
      </div>

      {/* Form */}
      <div style={panel}>
        <div style={sectionTitle}>Форма регистрации</div>
        {fields.map(f => {
          const fs = getFieldStatus(f.key)
          return (
            <div key={f.key} style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', color: labelColor(fs.state), marginBottom: '0.25rem', fontSize: '0.82rem' }}>
                {f.label}
                {fs.state === 'valid' && <span style={{ marginLeft: '0.4rem', color: '#22c55e' }}>✓</span>}
                {fs.state === 'invalid' && <span style={{ marginLeft: '0.4rem', color: '#ef4444' }}>✗</span>}
                {fs.state === 'untouched' && submitted && mode === 'failfast' && (
                  <span style={{ marginLeft: '0.4rem', color: '#6b7280', fontSize: '0.75rem' }}>(не проверено)</span>
                )}
              </label>
              <input
                type={f.type ?? 'text'}
                value={form[f.key]}
                onChange={e => { setForm(prev => ({ ...prev, [f.key]: e.target.value })); setSubmitted(false); setResult(null) }}
                placeholder={f.placeholder}
                style={{ ...inputStyle(), border: `1px solid ${borderColor(fs.state)}` }}
              />
              {fs.error && (
                <div style={{ color: '#fca5a5', fontSize: '0.75rem', marginTop: '0.2rem' }}>{fs.error}</div>
              )}
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <button style={btn('success')} onClick={handleSubmit}>Отправить</button>
          <button style={btn('default')} onClick={handleReset}>Сбросить</button>
        </div>
      </div>

      {/* Result */}
      {submitted && result && (
        <div style={{ ...panel, border: `1px solid ${isLeft(result) ? '#ef4444' : '#22c55e'}` }}>
          <div style={sectionTitle}>Результат</div>

          {/* Error counter */}
          {totalErrors > 0 && (
            <div style={{ marginBottom: '0.75rem', color: '#9ca3af', fontSize: '0.82rem' }}>
              Показано ошибок: <span style={{ color: '#fca5a5', fontWeight: 700 }}>{shownErrors}</span> из{' '}
              <span style={{ color: '#f9fafb', fontWeight: 700 }}>{totalErrors}</span>
              {mode === 'failfast' && totalErrors > 1 && (
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>(fail-fast: остановились на первой)</span>
              )}
              {mode === 'collect' && (
                <span style={{ color: '#6b7280', marginLeft: '0.5rem' }}>(collect all: все ошибки сразу)</span>
              )}
            </div>
          )}

          {isLeft(result) ? (
            <div>
              <div style={{ ...badge('red'), marginBottom: '0.5rem' }}>Ошибка валидации</div>
              {mode === 'failfast' ? (
                <div style={{ color: '#fca5a5', marginTop: '0.5rem' }}>
                  {result.value as string}
                </div>
              ) : (
                <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', color: '#fca5a5' }}>
                  {(result.value as string[]).map((e, i) => (
                    <li key={i} style={{ marginBottom: '0.2rem' }}>{e}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div>
              <div style={{ ...badge('green'), marginBottom: '0.5rem' }}>Успех</div>
              <div style={codeBlock}>{JSON.stringify(result.value, null, 2)}</div>
            </div>
          )}
        </div>
      )}

      <div style={{ color: '#4b5563', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        Either (fail-fast) — monadic flatMap chain. Validation (collect all) — applicative, независимые проверки.
      </div>
    </div>
  )
}

// ============================================
// Task 13.2: FP API-клиент
// ============================================

// Types
interface User { id: number; name: string; email: string; role: string }
interface Product { id: number; name: string; price: number; category: string }
interface Order { id: number; userId: number; product: string; total: number; status: string }

type ApiResponse = User | Product[] | Order

// Mock data
const MOCK_USERS: Record<number, User> = {
  1: { id: 1, name: 'Алиса Смирнова', email: 'alice@example.com', role: 'admin' },
  2: { id: 2, name: 'Борис Иванов', email: 'boris@example.com', role: 'user' },
  3: { id: 3, name: 'Карина Ли', email: 'karina@example.com', role: 'user' },
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Ноутбук Pro', price: 89999, category: 'electronics' },
  { id: 2, name: 'Механическая клавиатура', price: 12500, category: 'peripherals' },
  { id: 3, name: 'Монитор 4K', price: 54000, category: 'electronics' },
]

// Composable request builder
interface Request {
  method: string
  url: string
  headers: Record<string, string>
  body?: unknown
}

const request = (method: string) => (url: string) => (headers: Record<string, string>) => (body?: unknown): Request =>
  ({ method, url, headers, body })

const get = request('GET')
const post = request('POST')

const withAuth = (token: string) => (req: Request): Request => ({
  ...req,
  headers: { ...req.headers, Authorization: `Bearer ${token}` },
})

const withContentType = (req: Request): Request => ({
  ...req,
  headers: { ...req.headers, 'Content-Type': 'application/json' },
})

// Pipeline step result
interface PipelineStep {
  name: string
  status: 'pending' | 'running' | 'success' | 'error'
  detail: string
}

type Scenario = 'success' | 'invalid-json' | 'server-error' | 'validation-error'
type Endpoint = 'user-1' | 'user-999' | 'products' | 'order'

const ENDPOINTS: Record<Endpoint, { label: string; method: string; url: string }> = {
  'user-1': { label: 'GET /api/users/1', method: 'GET', url: '/api/users/1' },
  'user-999': { label: 'GET /api/users/999', method: 'GET', url: '/api/users/999' },
  'products': { label: 'GET /api/products', method: 'GET', url: '/api/products' },
  'order': { label: 'POST /api/orders', method: 'POST', url: '/api/orders' },
}

// Mock fetch
async function mockFetch(req: Request, scenario: Scenario): Promise<Either<string, unknown>> {
  await new Promise(r => setTimeout(r, 400))

  if (scenario === 'server-error') return Left('500 Internal Server Error')
  if (scenario === 'invalid-json') return Left('SyntaxError: Unexpected token in JSON')

  if (req.url === '/api/users/1') {
    if (scenario === 'validation-error') return Right({ id: 1, name: 42, role: null }) // bad data
    return Right(MOCK_USERS[1])
  }
  if (req.url === '/api/users/999') return Left('404 Not Found')
  if (req.url === '/api/products') return Right(MOCK_PRODUCTS)
  if (req.url === '/api/orders') {
    return Right({ id: 101, userId: 1, product: 'Ноутбук Pro', total: 89999, status: 'created' })
  }
  return Left('404 Not Found')
}

// Validate shape
function validateUser(data: unknown): Either<string, User> {
  const d = data as Record<string, unknown>
  if (typeof d.id !== 'number') return Left('Ошибка валидации: id должен быть числом')
  if (typeof d.name !== 'string') return Left('Ошибка валидации: name должен быть строкой')
  if (typeof d.email !== 'string') return Left('Ошибка валидации: email должен быть строкой')
  return Right(data as User)
}

function formatUser(u: User): string {
  return `${u.name} <${u.email}> [${u.role}]`
}

export function Task13_2_Solution() {
  const [endpoint, setEndpoint] = useState<Endpoint>('user-1')
  const [scenario, setScenario] = useState<Scenario>('success')
  const [steps, setSteps] = useState<PipelineStep[]>([])
  const [running, setRunning] = useState(false)
  const [finalResult, setFinalResult] = useState<string | null>(null)

  const updateStep = (idx: number, update: Partial<PipelineStep>, allSteps: PipelineStep[]): PipelineStep[] => {
    const next = [...allSteps]
    next[idx] = { ...next[idx], ...update }
    return next
  }

  const run = useCallback(async () => {
    setRunning(true)
    setFinalResult(null)

    const ep = ENDPOINTS[endpoint]
    const token = 'eyJhbGciOiJIUzI1NiJ9.dXNlcl8x.abc'

    // Build request
    const builtRequest =
      ep.method === 'POST'
        ? withContentType(withAuth(token)(post(ep.url)({})({})))
        : withAuth(token)(get(ep.url)({})(undefined))

    const initialSteps: PipelineStep[] = [
      { name: '1. Build request', status: 'pending', detail: '' },
      { name: '2. Send', status: 'pending', detail: '' },
      { name: '3. Parse JSON', status: 'pending', detail: '' },
      { name: '4. Validate', status: 'pending', detail: '' },
      { name: '5. Transform', status: 'pending', detail: '' },
    ]
    setSteps(initialSteps)

    // Step 1
    let current = [...initialSteps]
    current = updateStep(0, { status: 'running', detail: '' }, current)
    setSteps([...current])
    await new Promise(r => setTimeout(r, 300))
    current = updateStep(0, {
      status: 'success',
      detail: `${builtRequest.method} ${builtRequest.url}\nAuthorization: Bearer ${token.slice(0, 20)}...`,
    }, current)
    setSteps([...current])

    // Step 2
    current = updateStep(1, { status: 'running', detail: 'Отправка...' }, current)
    setSteps([...current])
    const fetchResult = await mockFetch(builtRequest, scenario)
    if (isLeft(fetchResult)) {
      current = updateStep(1, { status: 'error', detail: fetchResult.value }, current)
      setSteps([...current])
      setFinalResult(`Ошибка: ${fetchResult.value}`)
      setRunning(false)
      return
    }
    current = updateStep(1, { status: 'success', detail: '200 OK' }, current)
    setSteps([...current])

    // Step 3 (parse)
    current = updateStep(2, { status: 'running', detail: '' }, current)
    setSteps([...current])
    await new Promise(r => setTimeout(r, 200))
    if (scenario === 'invalid-json') {
      current = updateStep(2, { status: 'error', detail: 'SyntaxError: не валидный JSON' }, current)
      setSteps([...current])
      setFinalResult('Ошибка: невалидный JSON')
      setRunning(false)
      return
    }
    const rawJson = JSON.stringify(fetchResult.value, null, 2)
    current = updateStep(2, {
      status: 'success',
      detail: rawJson.length > 200 ? rawJson.slice(0, 200) + '...' : rawJson,
    }, current)
    setSteps([...current])

    // Step 4 (validate)
    current = updateStep(3, { status: 'running', detail: '' }, current)
    setSteps([...current])
    await new Promise(r => setTimeout(r, 200))

    // Only validate for user endpoints
    let validatedData: unknown = fetchResult.value
    if (endpoint === 'user-1') {
      const valResult = validateUser(fetchResult.value)
      if (isLeft(valResult)) {
        current = updateStep(3, { status: 'error', detail: valResult.value }, current)
        setSteps([...current])
        setFinalResult(`Ошибка валидации: ${valResult.value}`)
        setRunning(false)
        return
      }
      validatedData = valResult.value
    }
    current = updateStep(3, { status: 'success', detail: 'Схема корректна' }, current)
    setSteps([...current])

    // Step 5 (transform)
    current = updateStep(4, { status: 'running', detail: '' }, current)
    setSteps([...current])
    await new Promise(r => setTimeout(r, 200))

    let transformed: string
    if (endpoint === 'user-1') {
      transformed = formatUser(validatedData as User)
    } else {
      transformed = JSON.stringify(validatedData, null, 2)
    }
    current = updateStep(4, { status: 'success', detail: transformed }, current)
    setSteps([...current])
    setFinalResult(transformed)
    setRunning(false)
  }, [endpoint, scenario])

  const stepColor = (s: PipelineStep['status']) =>
    s === 'success' ? '#22c55e' : s === 'error' ? '#ef4444' : s === 'running' ? '#f59e0b' : '#374151'

  const stepBg = (s: PipelineStep['status']) =>
    s === 'success' ? '#14532d' : s === 'error' ? '#4c1d1d' : s === 'running' ? '#78350f' : '#1f2937'

  return (
    <div style={cs}>
      <h2 style={{ color: '#f9fafb', marginTop: 0 }}>13.2 — FP API-клиент</h2>

      {/* Builder code */}
      <div style={panel}>
        <div style={sectionTitle}>Composable request builder</div>
        <div style={codeBlock}>{`const request = (method) => (url) => (headers) => (body) =>
  ({ method, url, headers, body })

const get  = request('GET')
const post = request('POST')

const withAuth = (token) => (req) => ({
  ...req,
  headers: { ...req.headers, Authorization: 'Bearer ' + token }
})

// Сборка запроса через pipe:
const req = withAuth(token)(get('/api/users/1')({})(undefined))`}</div>
      </div>

      {/* Controls */}
      <div style={{ ...panel, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Endpoint</div>
          <select
            value={endpoint}
            onChange={e => setEndpoint(e.target.value as Endpoint)}
            style={{ ...inputStyle(), width: 'auto', padding: '0.35rem 0.6rem' }}
          >
            {Object.entries(ENDPOINTS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginBottom: '0.3rem' }}>Сценарий</div>
          <select
            value={scenario}
            onChange={e => setScenario(e.target.value as Scenario)}
            style={{ ...inputStyle(), width: 'auto', padding: '0.35rem 0.6rem' }}
          >
            <option value="success">Успешный</option>
            <option value="invalid-json">Невалидный JSON</option>
            <option value="server-error">Ошибка сервера</option>
            <option value="validation-error">Ошибка валидации</option>
          </select>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button style={btn(running ? 'warn' : 'success')} onClick={run} disabled={running}>
            {running ? 'Выполняется...' : 'Отправить'}
          </button>
        </div>
      </div>

      {/* Pipeline visualization */}
      {steps.length > 0 && (
        <div style={panel}>
          <div style={sectionTitle}>Pipeline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '10px',
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: stepColor(step.status),
                  marginTop: '4px',
                  flexShrink: 0,
                  boxShadow: step.status === 'running' ? `0 0 6px ${stepColor(step.status)}` : 'none',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    padding: '0.4rem 0.7rem',
                    borderRadius: '6px',
                    background: stepBg(step.status),
                    border: `1px solid ${stepColor(step.status)}40`,
                  }}>
                    <div style={{ color: stepColor(step.status), fontWeight: 600, fontSize: '0.82rem' }}>
                      {step.name}
                    </div>
                    {step.detail && (
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.3rem', whiteSpace: 'pre-wrap' }}>
                        {step.detail}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final result */}
      {finalResult && (
        <div style={{ ...panel, border: `1px solid ${steps.every(s => s.status === 'success') ? '#22c55e' : '#ef4444'}` }}>
          <div style={sectionTitle}>Финальный результат</div>
          <div style={codeBlock}>{finalResult}</div>
        </div>
      )}

      <div style={{ color: '#4b5563', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        Каррирование: request(method)(url)(headers)(body). withAuth/withContentType — pure middleware.
      </div>
    </div>
  )
}

// ============================================
// Task 13.3: Event processing pipeline
// ============================================

type EventType = 'click' | 'purchase' | 'pageview'

interface RawEvent {
  id: string
  type: EventType
  userId: string
  timestamp: number
  data: Record<string, unknown>
}

interface EnrichedEvent extends RawEvent {
  sessionId: string
  region: string
  processed: boolean
}

interface StageStats {
  received: number
  passed: number
  rejected: number
}

interface PipelineStats {
  enrich: StageStats
  validate: StageStats
  route: StageStats
  aggregate: StageStats
}

interface AggregatedData {
  totalEvents: number
  validEvents: number
  clicks: number
  purchases: number
  pageviews: number
  totalRevenue: number
  uniqueUsers: Set<string>
}

// Pipeline stages (pure functions)
const enrich = (event: RawEvent): EnrichedEvent => ({
  ...event,
  sessionId: `sess_${event.userId}_${Math.floor(event.timestamp / 60000)}`,
  region: ['RU', 'EU', 'US'][parseInt(event.userId, 10) % 3],
  processed: true,
})

const validateEvent = (event: EnrichedEvent): Either<string, EnrichedEvent> => {
  if (!event.id) return Left('missing id')
  if (!event.userId) return Left('missing userId')
  if (!event.timestamp) return Left('missing timestamp')
  if (event.type === 'purchase' && typeof event.data.amount !== 'number') {
    return Left('purchase missing amount')
  }
  return Right(event)
}

const routeEvent = (event: EnrichedEvent): { channel: string; event: EnrichedEvent } => {
  const channel =
    event.type === 'click' ? 'analytics' :
    event.type === 'purchase' ? 'billing' :
    'metrics'
  return { channel, event }
}

const REGIONS = ['RU', 'EU', 'US']
const USER_NAMES = ['alice', 'boris', 'carol', 'david', 'elena', 'fedor', 'galina', 'hector']

function generateEvent(index: number): RawEvent {
  const types: EventType[] = ['click', 'purchase', 'pageview', 'click', 'pageview']
  const type = types[index % types.length]
  const userId = USER_NAMES[index % USER_NAMES.length]
  const isInvalid = index % 13 === 0 // ~7% invalid

  return {
    id: isInvalid ? '' : `evt_${Date.now()}_${index}`,
    type,
    userId,
    timestamp: Date.now() - Math.random() * 60000,
    data: type === 'purchase'
      ? (isInvalid ? { product: 'item' } : { product: `Product ${index % 5}`, amount: Math.floor(Math.random() * 10000) + 100 })
      : { page: `/page/${index % 10}` },
  }
}

export function Task13_3_Solution() {
  const [events, setEvents] = useState<RawEvent[]>([])
  const [stats, setStats] = useState<PipelineStats>({
    enrich: { received: 0, passed: 0, rejected: 0 },
    validate: { received: 0, passed: 0, rejected: 0 },
    route: { received: 0, passed: 0, rejected: 0 },
    aggregate: { received: 0, passed: 0, rejected: 0 },
  })
  const [aggregated, setAggregated] = useState<AggregatedData>({
    totalEvents: 0,
    validEvents: 0,
    clicks: 0,
    purchases: 0,
    pageviews: 0,
    totalRevenue: 0,
    uniqueUsers: new Set(),
  })
  const [animating, setAnimating] = useState(false)
  const [activeStage, setActiveStage] = useState<string | null>(null)
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const processEvents = useCallback((newEvents: RawEvent[]) => {
    setAnimating(true)
    const stages = ['enrich', 'validate', 'route', 'aggregate']
    let si = 0

    const tick = () => {
      if (si >= stages.length) {
        setActiveStage(null)
        setAnimating(false)
        return
      }
      setActiveStage(stages[si])
      si++
      animRef.current = setTimeout(tick, 400)
    }
    tick()

    // Process all events through pipeline
    setStats(prev => {
      const next = { ...prev }

      let enrichedCount = 0
      let validCount = 0
      let invalidCount = 0

      const enriched: EnrichedEvent[] = []
      for (const ev of newEvents) {
        next.enrich.received++
        const e = enrich(ev)
        enriched.push(e)
        enrichedCount++
        next.enrich.passed++
      }
      next.enrich.rejected += 0

      const validated: EnrichedEvent[] = []
      for (const ev of enriched) {
        next.validate.received++
        const r = validateEvent(ev)
        if (isRight(r)) {
          validated.push(r.value)
          validCount++
          next.validate.passed++
        } else {
          invalidCount++
          next.validate.rejected++
        }
      }

      const routed: Array<{ channel: string; event: EnrichedEvent }> = []
      for (const ev of validated) {
        next.route.received++
        routed.push(routeEvent(ev))
        next.route.passed++
      }

      for (const { event } of routed) {
        next.aggregate.received++
        next.aggregate.passed++
      }

      setAggregated(prev => {
        const newUsers = new Set(prev.uniqueUsers)
        let revenue = prev.totalRevenue
        let clicks = prev.clicks
        let purchases = prev.purchases
        let pageviews = prev.pageviews

        for (const { event } of routed) {
          newUsers.add(event.userId)
          if (event.type === 'click') clicks++
          if (event.type === 'purchase') {
            purchases++
            revenue += (event.data.amount as number) || 0
          }
          if (event.type === 'pageview') pageviews++
        }

        return {
          totalEvents: prev.totalEvents + newEvents.length,
          validEvents: prev.validEvents + validCount,
          clicks,
          purchases,
          pageviews,
          totalRevenue: revenue,
          uniqueUsers: newUsers,
        }
      })

      return next
    })
  }, [])

  const generate = useCallback((count: number) => {
    const newEvents = Array.from({ length: count }, (_, i) => generateEvent(events.length + i))
    setEvents(prev => [...prev, ...newEvents])
    processEvents(newEvents)
  }, [events.length, processEvents])

  useEffect(() => {
    return () => { if (animRef.current) clearTimeout(animRef.current) }
  }, [])

  const reset = () => {
    setEvents([])
    setStats({
      enrich: { received: 0, passed: 0, rejected: 0 },
      validate: { received: 0, passed: 0, rejected: 0 },
      route: { received: 0, passed: 0, rejected: 0 },
      aggregate: { received: 0, passed: 0, rejected: 0 },
    })
    setAggregated({
      totalEvents: 0, validEvents: 0, clicks: 0, purchases: 0,
      pageviews: 0, totalRevenue: 0, uniqueUsers: new Set(),
    })
    setActiveStage(null)
    setAnimating(false)
  }

  const stageConfig: Array<{ key: string; label: string; color: string; desc: string }> = [
    { key: 'enrich', label: 'Enrich', color: '#3b82f6', desc: 'sessionId, region' },
    { key: 'validate', label: 'Validate', color: '#a855f7', desc: 'обяз. поля' },
    { key: 'route', label: 'Route', color: '#f59e0b', desc: 'channel' },
    { key: 'aggregate', label: 'Aggregate', color: '#22c55e', desc: 'count/sum' },
  ]

  const validPct = aggregated.totalEvents > 0
    ? Math.round((aggregated.validEvents / aggregated.totalEvents) * 100)
    : 0

  return (
    <div style={cs}>
      <h2 style={{ color: '#f9fafb', marginTop: 0 }}>13.3 — Event processing pipeline</h2>

      {/* Pipeline code */}
      <div style={panel}>
        <div style={sectionTitle}>Pipeline этапов</div>
        <div style={codeBlock}>{`const pipeline = (rawEvent: RawEvent) =>
  pipe(
    enrich,          // RawEvent → EnrichedEvent
    validateEvent,   // EnrichedEvent → Either<string, EnrichedEvent>
    flatMap(route),  // EnrichedEvent → { channel, event }
    map(aggregate),  // { channel, event } → AggregatedData
  )(rawEvent)`}</div>
      </div>

      {/* Controls */}
      <div style={{ ...panel, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#9ca3af' }}>Генерировать:</span>
        {[10, 50, 100].map(n => (
          <button key={n} style={btn(animating ? 'default' : 'active')} onClick={() => !animating && generate(n)}>
            {n} событий
          </button>
        ))}
        <button style={btn('danger')} onClick={reset}>Сбросить</button>
      </div>

      {/* Pipeline visualization */}
      <div style={panel}>
        <div style={sectionTitle}>Этапы обработки</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          {stageConfig.map((stage, i) => {
            const s = stats[stage.key as keyof PipelineStats]
            const isActive = activeStage === stage.key
            return (
              <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '130px' }}>
                <div style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: isActive ? `${stage.color}20` : '#0f172a',
                  border: `2px solid ${isActive ? stage.color : '#374151'}`,
                  transition: 'all 0.3s',
                  boxShadow: isActive ? `0 0 12px ${stage.color}40` : 'none',
                }}>
                  <div style={{ color: stage.color, fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem' }}>
                    {stage.label}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.72rem', marginBottom: '0.4rem' }}>{stage.desc}</div>
                  <div style={{ fontSize: '0.75rem' }}>
                    <span style={{ color: '#93c5fd' }}>+{s.passed} </span>
                    {s.rejected > 0 && <span style={{ color: '#fca5a5' }}>-{s.rejected}</span>}
                  </div>
                </div>
                {i < stageConfig.length - 1 && (
                  <div style={{ color: '#374151', fontSize: '1.2rem', flexShrink: 0 }}>→</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dashboard */}
      {aggregated.totalEvents > 0 && (
        <div style={panel}>
          <div style={sectionTitle}>Dashboard</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
            {[
              { label: 'Всего событий', value: aggregated.totalEvents, color: '#93c5fd' },
              { label: `Валидных (${validPct}%)`, value: aggregated.validEvents, color: '#86efac' },
              { label: 'Clicks', value: aggregated.clicks, color: '#a5f3fc' },
              { label: 'Purchases', value: aggregated.purchases, color: '#fde68a' },
              { label: 'Pageviews', value: aggregated.pageviews, color: '#c4b5fd' },
              { label: 'Уникальных юзеров', value: aggregated.uniqueUsers.size, color: '#f9a8d4' },
            ].map(m => (
              <div key={m.label} style={{ background: '#0f172a', borderRadius: '6px', padding: '0.6rem 0.8rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem', marginBottom: '0.2rem' }}>{m.label}</div>
                <div style={{ color: m.color, fontSize: '1.3rem', fontWeight: 700 }}>{m.value}</div>
              </div>
            ))}
          </div>
          {aggregated.purchases > 0 && (
            <div style={{ marginTop: '0.75rem', background: '#0f172a', borderRadius: '6px', padding: '0.6rem 0.8rem' }}>
              <div style={{ color: '#6b7280', fontSize: '0.72rem', marginBottom: '0.2rem' }}>Total revenue (purchases)</div>
              <div style={{ color: '#fde68a', fontSize: '1.3rem', fontWeight: 700 }}>
                {aggregated.totalRevenue.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          )}
          {aggregated.uniqueUsers.size > 0 && (
            <div style={{ marginTop: '0.75rem', color: '#6b7280', fontSize: '0.78rem' }}>
              Avg events/user: {(aggregated.validEvents / aggregated.uniqueUsers.size).toFixed(1)}
            </div>
          )}
        </div>
      )}

      <div style={{ color: '#4b5563', fontSize: '0.78rem', marginTop: '0.5rem' }}>
        Каждый этап — pure функция. Enrich добавляет данные, Validate отфильтровывает, Route распределяет, Aggregate считает.
      </div>
    </div>
  )
}
