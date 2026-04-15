import { useState } from 'react'

// ============================================
// Maybe<T> implementation
// ============================================

type Maybe<T> = { tag: 'Some'; value: T } | { tag: 'None' }

function Some<T>(value: T): Maybe<T> {
  return { tag: 'Some', value }
}

const None: Maybe<never> = { tag: 'None' }

function maybeMap<T, U>(m: Maybe<T>, fn: (v: T) => U): Maybe<U> {
  return m.tag === 'Some' ? Some(fn(m.value)) : None
}

function maybeFlatMap<T, U>(m: Maybe<T>, fn: (v: T) => Maybe<U>): Maybe<U> {
  return m.tag === 'Some' ? fn(m.value) : None
}

function getOrElse<T>(m: Maybe<T>, fallback: T): T {
  return m.tag === 'Some' ? m.value : fallback
}

function fromNullable<T>(v: T | null | undefined): Maybe<T> {
  return v == null ? None : Some(v)
}

function maybeToString<T>(m: Maybe<T>): string {
  return m.tag === 'Some' ? `Some(${JSON.stringify(m.value)})` : 'None'
}

// ============================================
// Either<L, R> implementation
// ============================================

type Either<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function Left<L>(value: L): Either<L, never> {
  return { tag: 'Left', value }
}

function Right<R>(value: R): Either<never, R> {
  return { tag: 'Right', value }
}

function eitherMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => R2): Either<L, R2> {
  return e.tag === 'Right' ? Right(fn(e.value)) : e
}

function eitherFlatMap<L, R, R2>(e: Either<L, R>, fn: (v: R) => Either<L, R2>): Either<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

function match<L, R, T>(e: Either<L, R>, onLeft: (v: L) => T, onRight: (v: R) => T): T {
  return e.tag === 'Left' ? onLeft(e.value) : onRight(e.value)
}

// ============================================
// Task 6.1 Solution: Maybe / Option
// ============================================

interface Address {
  city?: string
  zip?: string
}

interface Subscription {
  plan?: string
  renewsAt?: string
}

interface UserProfile {
  name: string
  address?: Address
  subscription?: Subscription
}

const PRESET_USERS: { label: string; user: UserProfile }[] = [
  {
    label: 'Полные данные',
    user: {
      name: 'Анна',
      address: { city: 'Москва', zip: '101000' },
      subscription: { plan: 'Pro', renewsAt: '2026-12-01' },
    },
  },
  {
    label: 'Без индекса и плана',
    user: {
      name: 'Борис',
      address: { city: 'Тверь' },
      subscription: {},
    },
  },
  {
    label: 'Без адреса',
    user: {
      name: 'Вера',
      subscription: { plan: 'Basic' },
    },
  },
]

function getCityImperative(user: UserProfile): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (user.address) {
    if (user.address.city) {
      return user.address.city
    }
  }
  return 'N/A'
}

function getZipImperative(user: UserProfile): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (user.address) {
    if (user.address.zip) {
      return user.address.zip
    }
  }
  return 'N/A'
}

function getPlanImperative(user: UserProfile): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (user.subscription) {
    if (user.subscription.plan) {
      return user.subscription.plan
    }
  }
  return 'N/A'
}

function getCityMaybe(user: UserProfile): string {
  return getOrElse(
    maybeFlatMap(fromNullable(user.address), a => fromNullable(a.city)),
    'N/A'
  )
}

function getZipMaybe(user: UserProfile): string {
  return getOrElse(
    maybeFlatMap(fromNullable(user.address), a => fromNullable(a.zip)),
    'N/A'
  )
}

function getPlanMaybe(user: UserProfile): string {
  return getOrElse(
    maybeFlatMap(
      maybeFlatMap(fromNullable(user.subscription), s => Some(s)),
      s => fromNullable(s.plan)
    ),
    'N/A'
  )
}

export function Task6_1_Solution() {
  const [presetIdx, setPresetIdx] = useState(0)
  const { user } = PRESET_USERS[presetIdx]

  const container: React.CSSProperties = {
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
  const row: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  }
  const col: React.CSSProperties = {
    background: '#1f2937',
    borderRadius: '8px',
    padding: '1rem',
  }
  const btnStyle = (active: boolean): React.CSSProperties => ({
    background: active ? '#1e3a5f' : '#374151',
    color: active ? '#93c5fd' : '#e5e7eb',
    border: active ? '1px solid #3b82f6' : '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.3rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    marginRight: '0.5rem',
  })
  const codeBlock: React.CSSProperties = {
    background: '#0f172a',
    borderRadius: '6px',
    padding: '0.7rem',
    fontSize: '0.78rem',
    color: '#94a3b8',
    marginTop: '0.6rem',
    whiteSpace: 'pre',
    overflowX: 'auto',
  }
  const resultVal: React.CSSProperties = {
    color: '#6ee7b7',
    background: '#0d2a1f',
    border: '1px solid #10b981',
    borderRadius: '4px',
    padding: '0.25rem 0.5rem',
    display: 'inline-block',
    marginTop: '0.4rem',
  }
  const warning: React.CSSProperties = {
    background: '#2d1b00',
    border: '1px solid #78350f',
    borderRadius: '6px',
    padding: '0.5rem 0.8rem',
    color: '#fbbf24',
    fontSize: '0.78rem',
    marginTop: '0.6rem',
  }

  const cityImp = getCityImperative(user)
  const zipImp = getZipImperative(user)
  const planImp = getPlanImperative(user)

  const cityM = getCityMaybe(user)
  const zipM = getZipMaybe(user)
  const planM = getPlanMaybe(user)

  const missingChecks: string[] = []
  if (!user.address) missingChecks.push('address.zip не проверен — TypeError если address = undefined')
  if (user.address && !user.address.zip) missingChecks.push('zip не проверен — вернулось undefined молча')
  if (user.subscription && !user.subscription.plan) missingChecks.push('plan не проверен — вернулось undefined молча')

  return (
    <div className="exercise-container" style={container}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Maybe / Option: безопасные цепочки</h2>

      {/* User selector */}
      <div style={panel}>
        <div style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.8rem' }}>Выберите профиль пользователя:</div>
        <div>
          {PRESET_USERS.map((p, i) => (
            <button key={i} style={btnStyle(i === presetIdx)} onClick={() => setPresetIdx(i)}>
              {p.label}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '0.7rem', color: '#9ca3af', fontSize: '0.78rem' }}>
          Данные: <span style={{ color: '#e5e7eb' }}>{JSON.stringify(user)}</span>
        </div>
      </div>

      {/* Comparison */}
      <div style={row}>
        {/* Imperative */}
        <div style={col}>
          <div style={{ color: '#f87171', fontWeight: 600, marginBottom: '0.5rem' }}>Традиционный if/null</div>
          <div style={codeBlock}>{`function getCity(user) {
  if (user.address) {
    if (user.address.city) {
      return user.address.city
    }
  }
  return 'N/A'
}`}</div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#9ca3af' }}>Результаты:</div>
          <div style={{ marginTop: '0.3rem' }}>
            <div>city: <span style={resultVal}>{cityImp}</span></div>
            <div style={{ marginTop: '0.3rem' }}>zip: <span style={resultVal}>{zipImp}</span></div>
            <div style={{ marginTop: '0.3rem' }}>plan: <span style={resultVal}>{planImp}</span></div>
          </div>
          {missingChecks.length > 0 && (
            <div style={warning}>
              <div style={{ fontWeight: 600, marginBottom: '0.3rem' }}>Потенциальные проблемы:</div>
              {missingChecks.map((w, i) => (
                <div key={i}>• {w}</div>
              ))}
            </div>
          )}
        </div>

        {/* Maybe */}
        <div style={col}>
          <div style={{ color: '#6ee7b7', fontWeight: 600, marginBottom: '0.5rem' }}>Maybe chain</div>
          <div style={codeBlock}>{`function getCity(user) {
  return getOrElse(
    flatMap(
      fromNullable(user.address),
      a => fromNullable(a.city)
    ),
    'N/A'
  )
}`}</div>
          <div style={{ marginTop: '0.8rem', fontSize: '0.8rem', color: '#9ca3af' }}>Результаты:</div>
          <div style={{ marginTop: '0.3rem' }}>
            <div>city: <span style={resultVal}>{cityM}</span></div>
            <div style={{ marginTop: '0.3rem' }}>zip: <span style={resultVal}>{zipM}</span></div>
            <div style={{ marginTop: '0.3rem' }}>plan: <span style={resultVal}>{planM}</span></div>
          </div>
          <div style={{ ...warning, background: '#0d2a1f', border: '1px solid #10b981', color: '#6ee7b7', marginTop: '0.6rem' }}>
            Каждый null/undefined автоматически превращается в None — никакого TypeError
          </div>
        </div>
      </div>

      {/* Maybe internals */}
      <div style={panel}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.5rem' }}>Шаги Maybe-цепочки (city)</div>
        {[
          { label: 'fromNullable(user.address)', result: maybeToString(fromNullable(user.address)) },
          {
            label: 'flatMap(a => fromNullable(a.city))',
            result: maybeToString(maybeFlatMap(fromNullable(user.address), a => fromNullable(a.city))),
          },
          {
            label: 'getOrElse("N/A")',
            result: getOrElse(maybeFlatMap(fromNullable(user.address), a => fromNullable(a.city)), 'N/A'),
          },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ color: '#9ca3af', minWidth: '1.5rem' }}>{i + 1}.</span>
            <span style={{ color: '#a5b4fc', flex: 1 }}>{step.label}</span>
            <span style={{
              color: String(step.result).startsWith('None') ? '#f87171' : '#6ee7b7',
              background: '#0f172a',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
              fontSize: '0.78rem',
            }}>{String(step.result)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Task 6.2 Solution: Either / Result
// ============================================

interface RegisterUser {
  name: string
  email: string
  age: string
}

function validateName(name: string): Either<string, string> {
  if (!name.trim()) return Left('Имя не может быть пустым')
  if (name.trim().length < 2) return Left('Имя должно содержать минимум 2 символа')
  return Right(name.trim())
}

function validateEmail(email: string): Either<string, string> {
  if (!email.trim()) return Left('Email не может быть пустым')
  if (!email.includes('@')) return Left('Email должен содержать символ @')
  if (!email.includes('.')) return Left('Email должен содержать точку')
  return Right(email.trim())
}

function validateAge(ageStr: string): Either<string, number> {
  const n = Number(ageStr)
  if (!ageStr.trim()) return Left('Возраст не может быть пустым')
  if (isNaN(n)) return Left('Возраст должен быть числом')
  if (n < 18) return Left('Минимальный возраст — 18 лет')
  if (n > 120) return Left('Возраст не может превышать 120')
  return Right(n)
}

function createUser(name: string, email: string, age: number): Either<string, { name: string; email: string; age: number }> {
  return Right({ name, email, age })
}

type FieldStatus = { ok: boolean; message: string }

export function Task6_2_Solution() {
  const [form, setForm] = useState<RegisterUser>({ name: '', email: '', age: '' })

  const nameResult = validateName(form.name)
  const emailResult = validateEmail(form.email)
  const ageResult = validateAge(form.age)

  const pipelineResult: Either<string, { name: string; email: string; age: number }> =
    eitherFlatMap(
      eitherFlatMap(
        eitherFlatMap(
          nameResult,
          name => eitherFlatMap(emailResult, email => Right({ name, email }))
        ),
        ({ name, email }) => eitherMap(ageResult, age => ({ name, email, age }))
      ),
      ({ name, email, age }) => createUser(name, email, age)
    )

  const getStatus = <T,>(e: Either<string, T>): FieldStatus =>
    e.tag === 'Right'
      ? { ok: true, message: 'OK' }
      : { ok: false, message: e.value }

  const nameStatus = form.name ? getStatus(nameResult) : null
  const emailStatus = form.email ? getStatus(emailResult) : null
  const ageStatus = form.age ? getStatus(ageResult) : null

  const container: React.CSSProperties = {
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
  const inputStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.4rem 0.7rem',
    fontFamily: 'monospace',
    fontSize: '0.88rem',
    width: '240px',
  }
  const fieldRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    marginBottom: '0.8rem',
  }
  const label: React.CSSProperties = {
    color: '#9ca3af',
    minWidth: '80px',
    fontSize: '0.82rem',
  }

  const statusBadge = (s: FieldStatus | null): React.ReactNode => {
    if (!s) return null
    return (
      <span style={{
        color: s.ok ? '#6ee7b7' : '#f87171',
        background: s.ok ? '#0d2a1f' : '#2d1515',
        border: `1px solid ${s.ok ? '#10b981' : '#ef4444'}`,
        borderRadius: '4px',
        padding: '0.2rem 0.5rem',
        fontSize: '0.78rem',
      }}>
        {s.ok ? 'Right' : `Left("${s.message}")`}
      </span>
    )
  }

  // Railway steps
  const steps: { label: string; result: Either<string, unknown>; fn: string }[] = [
    { label: 'validateName', result: form.name ? nameResult : Left('не заполнено'), fn: 'name => Either<string, string>' },
    { label: 'validateEmail', result: form.email ? emailResult : Left('не заполнено'), fn: 'email => Either<string, string>' },
    { label: 'validateAge', result: form.age ? ageResult : Left('не заполнено'), fn: 'age => Either<string, number>' },
    { label: 'createUser', result: pipelineResult, fn: '(n,e,a) => Either<string, User>' },
  ]

  const firstFailIdx = steps.findIndex(s => s.result.tag === 'Left')

  return (
    <div className="exercise-container" style={container}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Either / Result: типизированные ошибки</h2>

      {/* Form */}
      <div style={panel}>
        <div style={{ color: '#9ca3af', marginBottom: '0.7rem', fontSize: '0.8rem' }}>Форма регистрации</div>
        <div style={fieldRow}>
          <span style={label}>Имя</span>
          <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Иван" />
          {statusBadge(nameStatus)}
        </div>
        <div style={fieldRow}>
          <span style={label}>Email</span>
          <input style={inputStyle} value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="ivan@example.com" />
          {statusBadge(emailStatus)}
        </div>
        <div style={fieldRow}>
          <span style={label}>Возраст</span>
          <input style={inputStyle} value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} placeholder="25" />
          {statusBadge(ageStatus)}
        </div>
      </div>

      {/* Railway diagram */}
      <div style={panel}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.8rem' }}>Railway-oriented pipeline</div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0', overflowX: 'auto' }}>
          {steps.map((step, i) => {
            const isGrey = firstFailIdx >= 0 && i > firstFailIdx
            const isOk = step.result.tag === 'Right'
            const isFail = step.result.tag === 'Left'
            const boxColor = isGrey ? '#374151' : isOk ? '#0d2a1f' : '#2d1515'
            const borderColor = isGrey ? '#4b5563' : isOk ? '#10b981' : '#ef4444'
            const textColor = isGrey ? '#6b7280' : isOk ? '#6ee7b7' : '#f87171'

            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  background: boxColor,
                  border: `2px solid ${borderColor}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.7rem',
                  minWidth: '130px',
                  fontSize: '0.78rem',
                }}>
                  <div style={{ color: textColor, fontWeight: 600 }}>{step.label}</div>
                  <div style={{ color: '#6b7280', marginTop: '0.2rem', fontSize: '0.72rem' }}>{step.fn}</div>
                  {!isGrey && (
                    <div style={{ marginTop: '0.3rem', color: isOk ? '#6ee7b7' : '#f87171', fontSize: '0.72rem' }}>
                      {isOk ? 'Right' : `Left`}
                    </div>
                  )}
                  {isGrey && (
                    <div style={{ marginTop: '0.3rem', color: '#6b7280', fontSize: '0.72rem' }}>не выполнялся</div>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    color: isGrey || (firstFailIdx >= 0 && i >= firstFailIdx) ? '#6b7280' : '#10b981',
                    margin: '0 0.3rem',
                    fontSize: '1.2rem',
                  }}>
                    {firstFailIdx === i ? '✕' : '→'}
                  </div>
                )}
              </div>
            )
          })}
        </div>
        {/* Failure track annotation */}
        {firstFailIdx >= 0 && (
          <div style={{
            marginTop: '0.8rem',
            background: '#2d1515',
            border: '1px solid #ef4444',
            borderRadius: '6px',
            padding: '0.5rem 0.8rem',
            color: '#f87171',
            fontSize: '0.8rem',
          }}>
            Failure track: {match(steps[firstFailIdx].result as Either<string, unknown>, v => `Left("${v}")`, () => '')}
          </div>
        )}
        {pipelineResult.tag === 'Right' && (
          <div style={{
            marginTop: '0.8rem',
            background: '#0d2a1f',
            border: '1px solid #10b981',
            borderRadius: '6px',
            padding: '0.5rem 0.8rem',
            color: '#6ee7b7',
            fontSize: '0.8rem',
          }}>
            Success: {JSON.stringify(pipelineResult.value)}
          </div>
        )}
      </div>

      {/* Code */}
      <div style={panel}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.5rem' }}>Validation pipeline</div>
        <pre style={{
          background: '#0f172a',
          borderRadius: '6px',
          padding: '0.8rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          overflowX: 'auto',
          margin: 0,
        }}>{`const result = flatMap(validateName(name), validName =>
  flatMap(validateEmail(email), validEmail =>
    map(validateAge(age), validAge =>
      createUser(validName, validEmail, validAge)
    )
  )
)
// tag === 'Left'  → ошибка с сообщением
// tag === 'Right' → { name, email, age }`}</pre>
      </div>
    </div>
  )
}

// ============================================
// Task 6.3 Solution: Комбинирование монад
// ============================================

interface DbUser {
  id: number
  name: string
  subscriptionId?: number
}

interface DbSubscription {
  id: number
  plan: string
  status: 'active' | 'expired'
}

const MOCK_USERS: DbUser[] = [
  { id: 1, name: 'Алиса', subscriptionId: 101 },
  { id: 2, name: 'Борис' },
  { id: 3, name: 'Галина', subscriptionId: 102 },
]

const MOCK_SUBSCRIPTIONS: DbSubscription[] = [
  { id: 101, plan: 'Pro', status: 'active' },
  { id: 102, plan: 'Basic', status: 'expired' },
]

function parseUserId(input: string): Either<string, number> {
  const n = parseInt(input, 10)
  if (!input.trim()) return Left('Введите ID пользователя')
  if (isNaN(n) || String(n) !== input.trim()) return Left(`"${input}" не является числом`)
  if (n <= 0) return Left('ID должен быть положительным числом')
  return Right(n)
}

function findUser(id: number): Maybe<DbUser> {
  return fromNullable(MOCK_USERS.find(u => u.id === id))
}

function maybeToEither<T>(m: Maybe<T>, error: string): Either<string, T> {
  return m.tag === 'Some' ? Right(m.value) : Left(error)
}

function getSubscription(user: DbUser): Maybe<DbSubscription> {
  if (user.subscriptionId == null) return None
  return fromNullable(MOCK_SUBSCRIPTIONS.find(s => s.id === user.subscriptionId))
}

function formatPlan(sub: DbSubscription): string {
  return `${sub.plan} (${sub.status === 'active' ? 'активна' : 'истекла'})`
}

type StepState =
  | { status: 'pending' }
  | { status: 'ok'; value: string }
  | { status: 'fail'; error: string }
  | { status: 'skipped' }

interface PipelineSteps {
  parse: StepState
  findUser: StepState
  getSub: StepState
  format: StepState
}

function runPipeline(input: string): PipelineSteps {
  const parseResult = parseUserId(input)
  if (parseResult.tag === 'Left') {
    return {
      parse: { status: 'fail', error: parseResult.value },
      findUser: { status: 'skipped' },
      getSub: { status: 'skipped' },
      format: { status: 'skipped' },
    }
  }
  const id = parseResult.value
  const userMaybe = findUser(id)
  const userResult = maybeToEither(userMaybe, `Пользователь с id=${id} не найден`)

  if (userResult.tag === 'Left') {
    return {
      parse: { status: 'ok', value: `Right(${id})` },
      findUser: { status: 'fail', error: userResult.value },
      getSub: { status: 'skipped' },
      format: { status: 'skipped' },
    }
  }
  const user = userResult.value
  const subMaybe = getSubscription(user)
  const subResult = maybeToEither(subMaybe, `У пользователя "${user.name}" нет подписки`)

  if (subResult.tag === 'Left') {
    return {
      parse: { status: 'ok', value: `Right(${id})` },
      findUser: { status: 'ok', value: `Some(${JSON.stringify(user)})` },
      getSub: { status: 'fail', error: subResult.value },
      format: { status: 'skipped' },
    }
  }
  const formatted = formatPlan(subResult.value)
  return {
    parse: { status: 'ok', value: `Right(${id})` },
    findUser: { status: 'ok', value: `Some(${JSON.stringify(user)})` },
    getSub: { status: 'ok', value: `Some(${JSON.stringify(subResult.value)})` },
    format: { status: 'ok', value: formatted },
  }
}

export function Task6_3_Solution() {
  const [input, setInput] = useState('')

  const container: React.CSSProperties = {
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
  const inputStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.4rem 0.7rem',
    fontFamily: 'monospace',
    fontSize: '0.9rem',
    width: '200px',
  }
  const presetBtn: React.CSSProperties = {
    background: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.25rem 0.6rem',
    cursor: 'pointer',
    fontSize: '0.78rem',
    fontFamily: 'monospace',
    marginRight: '0.4rem',
  }

  const steps = input ? runPipeline(input) : null

  const STEP_DEFS: { key: keyof PipelineSteps; title: string; inputLabel: string; outputType: string }[] = [
    { key: 'parse', title: 'parseUserId', inputLabel: 'string', outputType: 'Either<string, number>' },
    { key: 'findUser', title: 'findUser', inputLabel: 'number', outputType: 'Maybe<User>' },
    { key: 'getSub', title: 'getSubscription', inputLabel: 'User', outputType: 'Maybe<Subscription>' },
    { key: 'format', title: 'formatPlan', inputLabel: 'Subscription', outputType: 'string' },
  ]

  const getStepColor = (s: StepState | undefined): string => {
    if (!s) return '#374151'
    if (s.status === 'ok') return '#0d2a1f'
    if (s.status === 'fail') return '#2d1515'
    return '#1c2233'
  }
  const getStepBorder = (s: StepState | undefined): string => {
    if (!s) return '#4b5563'
    if (s.status === 'ok') return '#10b981'
    if (s.status === 'fail') return '#ef4444'
    return '#374151'
  }
  const getStepText = (s: StepState | undefined): string => {
    if (!s) return ''
    if (s.status === 'ok') return s.value
    if (s.status === 'fail') return `Error: ${s.error}`
    if (s.status === 'skipped') return 'пропущен'
    return ''
  }
  const getStepTextColor = (s: StepState | undefined): string => {
    if (!s) return '#6b7280'
    if (s.status === 'ok') return '#6ee7b7'
    if (s.status === 'fail') return '#f87171'
    return '#6b7280'
  }

  return (
    <div className="exercise-container" style={container}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Комбинирование Maybe и Either</h2>

      {/* Input */}
      <div style={panel}>
        <div style={{ color: '#9ca3af', marginBottom: '0.5rem', fontSize: '0.8rem' }}>ID пользователя:</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          <input
            style={inputStyle}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Введите ID..."
          />
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {[
              { val: 'abc', label: '"abc" → parse error' },
              { val: '999', label: '"999" → not found' },
              { val: '2', label: '"2" → no sub' },
              { val: '1', label: '"1" → success' },
              { val: '3', label: '"3" → expired' },
            ].map(p => (
              <button key={p.val} style={presetBtn} onClick={() => setInput(p.val)}>
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline visualization */}
      <div style={panel}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.8rem' }}>Pipeline</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {STEP_DEFS.map((def, i) => {
            const stepState = steps ? steps[def.key] : undefined
            return (
              <div key={def.key} style={{ display: 'flex', alignItems: 'stretch', gap: '0.6rem' }}>
                {/* Step number */}
                <div style={{
                  color: '#6b7280',
                  minWidth: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                }}>
                  {i + 1}.
                </div>

                {/* Box */}
                <div style={{
                  background: steps ? getStepColor(stepState) : '#1f2937',
                  border: `2px solid ${steps ? getStepBorder(stepState) : '#374151'}`,
                  borderRadius: '8px',
                  padding: '0.5rem 0.8rem',
                  flex: 1,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#a5b4fc', fontWeight: 600 }}>{def.title}</span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>{def.inputLabel} → {def.outputType}</span>
                  </div>
                  {steps && stepState && (
                    <div style={{ marginTop: '0.3rem', color: getStepTextColor(stepState), fontSize: '0.78rem' }}>
                      {getStepText(stepState)}
                    </div>
                  )}
                  {!steps && (
                    <div style={{ marginTop: '0.3rem', color: '#4b5563', fontSize: '0.75rem' }}>
                      ожидание ввода...
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Mock DB */}
      <div style={panel}>
        <div style={{ color: '#9ca3af', fontWeight: 600, marginBottom: '0.5rem', fontSize: '0.8rem' }}>Mock DB</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.3rem' }}>Users</div>
            {MOCK_USERS.map(u => (
              <div key={u.id} style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
                id={u.id} {u.name}{u.subscriptionId ? ` (sub: ${u.subscriptionId})` : ' (без подписки)'}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.3rem' }}>Subscriptions</div>
            {MOCK_SUBSCRIPTIONS.map(s => (
              <div key={s.id} style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.2rem' }}>
                id={s.id} {s.plan} / {s.status}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Conversion helper */}
      <div style={panel}>
        <div style={{ color: '#c4b5fd', fontWeight: 600, marginBottom: '0.5rem' }}>maybeToEither — конвертация</div>
        <pre style={{
          background: '#0f172a',
          borderRadius: '6px',
          padding: '0.8rem',
          fontSize: '0.78rem',
          color: '#94a3b8',
          overflowX: 'auto',
          margin: 0,
        }}>{`function maybeToEither<T>(m: Maybe<T>, error: string): Either<string, T> {
  return m.tag === 'Some' ? Right(m.value) : Left(error)
}

// Maybe<User> → Either<string, User>
const userResult = maybeToEither(
  findUser(id),
  \`Пользователь id=\${id} не найден\`
)`}</pre>
      </div>
    </div>
  )
}
