import { useState, useCallback } from 'react'
import * as O from 'fp-ts/Option'
import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'
import * as N from 'fp-ts/number'
import { pipe, flow } from 'fp-ts/function'

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

const inputStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #374151',
  borderRadius: '6px',
  padding: '0.35rem 0.7rem',
  color: '#e5e7eb',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  width: '120px',
}

const labelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '0.78rem',
  marginBottom: '0.4rem',
}

const badgeStyle = (color: string): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background: color === 'green'
    ? '#14532d'
    : color === 'red'
      ? '#7f1d1d'
      : color === 'yellow'
        ? '#78350f'
        : '#1e3a5f',
  color: color === 'green'
    ? '#86efac'
    : color === 'red'
      ? '#fca5a5'
      : color === 'yellow'
        ? '#fde68a'
        : '#93c5fd',
})

// ============================================
// Manual Maybe/Either (for comparison in Task 10.1)
// ============================================

type ManualMaybe<T> = { tag: 'Some'; value: T } | { tag: 'None' }

function manualFromNullable<T>(v: T | null | undefined): ManualMaybe<T> {
  return v == null ? { tag: 'None' } : { tag: 'Some', value: v }
}

function manualFlatMap<T, U>(m: ManualMaybe<T>, fn: (v: T) => ManualMaybe<U>): ManualMaybe<U> {
  return m.tag === 'Some' ? fn(m.value) : { tag: 'None' }
}

function manualMap<T, U>(m: ManualMaybe<T>, fn: (v: T) => U): ManualMaybe<U> {
  return m.tag === 'Some' ? { tag: 'Some', value: fn(m.value) } : { tag: 'None' }
}

function manualGetOrElse<T>(m: ManualMaybe<T>, fallback: T): T {
  return m.tag === 'Some' ? m.value : fallback
}

function manualToString<T>(m: ManualMaybe<T>): string {
  return m.tag === 'Some' ? `Some(${JSON.stringify(m.value)})` : 'None'
}

type ManualEither<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function manualRight<R>(v: R): ManualEither<never, R> {
  return { tag: 'Right', value: v }
}

function manualLeft<L>(v: L): ManualEither<L, never> {
  return { tag: 'Left', value: v }
}

function manualEitherFlatMap<L, R, R2>(
  e: ManualEither<L, R>,
  fn: (v: R) => ManualEither<L, R2>,
): ManualEither<L, R2> {
  return e.tag === 'Right' ? fn(e.value) : e
}

function manualEitherMap<L, R, R2>(
  e: ManualEither<L, R>,
  fn: (v: R) => R2,
): ManualEither<L, R2> {
  return e.tag === 'Right' ? manualRight(fn(e.value)) : e
}

function manualEitherToString<L, R>(e: ManualEither<L, R>): string {
  return e.tag === 'Right'
    ? `Right(${JSON.stringify(e.value)})`
    : `Left(${JSON.stringify(e.value)})`
}

// ============================================
// Task 10.1: Option и Either
// ============================================

interface User {
  id: number
  name: string
  email?: string
}

const USERS: Record<number, User> = {
  1: { id: 1, name: 'Alice', email: 'alice@example.com' },
  2: { id: 2, name: 'Bob' },
  3: { id: 3, name: 'Carol', email: 'carol@example.com' },
}

export function Task10_1_Solution() {
  const [userId, setUserId] = useState('1')
  const [numInput, setNumInput] = useState('42')

  // Option comparison
  const manualOptionResult = (() => {
    const id = parseInt(userId)
    const m = manualFromNullable(USERS[id])
    const mapped = manualFlatMap(m, u => manualFromNullable(u.email))
    const upper = manualMap(mapped, e => e.toUpperCase())
    return {
      result: manualGetOrElse(upper, 'N/A'),
      steps: [
        { label: 'fromNullable(users[id])', value: manualToString(m) },
        { label: '.flatMap(u => fromNullable(u.email))', value: manualToString(mapped) },
        { label: '.map(e => e.toUpperCase())', value: manualToString(upper) },
        { label: '.getOrElse("N/A")', value: manualGetOrElse(upper, 'N/A') },
      ],
    }
  })()

  const fptsOptionResult = (() => {
    const id = parseInt(userId)
    const step1 = O.fromNullable(USERS[id])
    const step2 = pipe(step1, O.flatMap(u => O.fromNullable(u.email)))
    const step3 = pipe(step2, O.map(e => e.toUpperCase()))
    const step4 = pipe(step3, O.getOrElse(() => 'N/A'))
    return {
      result: step4,
      steps: [
        { label: 'O.fromNullable(users[id])', value: O.isNone(step1) ? 'None' : `Some(${JSON.stringify((step1 as O.Some<User>).value.name)})` },
        { label: 'O.flatMap(u => O.fromNullable(u.email))', value: O.isNone(step2) ? 'None' : `Some(${JSON.stringify((step2 as O.Some<string>).value)})` },
        { label: 'O.map(e => e.toUpperCase())', value: O.isNone(step3) ? 'None' : `Some(${JSON.stringify((step3 as O.Some<string>).value)})` },
        { label: 'O.getOrElse(() => "N/A")', value: step4 },
      ],
    }
  })()

  // Either comparison
  const parsePositive = (s: string): ManualEither<string, number> => {
    const n = parseFloat(s)
    if (isNaN(n)) return manualLeft('Не число')
    if (n <= 0) return manualLeft('Должно быть > 0')
    return manualRight(n)
  }

  const manualEitherResult = (() => {
    const step1 = parsePositive(numInput)
    const step2 = manualEitherFlatMap(step1, n =>
      n > 1000 ? manualLeft('Слишком большое') : manualRight(n),
    )
    const step3 = manualEitherMap(step2, n => Math.sqrt(n).toFixed(4))
    return {
      final: manualEitherToString(step3),
      isRight: step3.tag === 'Right',
      steps: [
        { label: 'parsePositive(input)', value: manualEitherToString(step1) },
        { label: '.flatMap(n => n > 1000 ? Left : Right(n))', value: manualEitherToString(step2) },
        { label: '.map(n => sqrt(n).toFixed(4))', value: manualEitherToString(step3) },
      ],
    }
  })()

  const fptsEitherResult = (() => {
    const parsePos = (s: string): E.Either<string, number> => {
      const n = parseFloat(s)
      if (isNaN(n)) return E.left('Не число')
      if (n <= 0) return E.left('Должно быть > 0')
      return E.right(n)
    }
    const step1 = parsePos(numInput)
    const step2 = pipe(
      step1,
      E.flatMap(n => n > 1000 ? E.left('Слишком большое') : E.right(n)),
    )
    const step3 = pipe(step2, E.map(n => Math.sqrt(n).toFixed(4)))
    const toStr = (e: E.Either<string, string | number>) =>
      E.isLeft(e)
        ? `Left(${JSON.stringify(e.left)})`
        : `Right(${JSON.stringify(e.right)})`
    return {
      final: toStr(step3),
      isRight: E.isRight(step3),
      steps: [
        { label: 'parsePos(input)', value: toStr(step1) },
        { label: 'E.flatMap(n => n > 1000 ? E.left : E.right)', value: toStr(step2) },
        { label: 'E.map(n => sqrt(n).toFixed(4))', value: toStr(step3) },
      ],
    }
  })()

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#f9fafb', marginBottom: '0.3rem' }}>fp-ts: Option и Either</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.2rem' }}>
        Сравнение ручных реализаций из Level 6 с настоящими fp-ts типами
      </p>

      {/* Option comparison */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, color: '#f3f4f6' }}>Option: поиск email пользователя</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={labelStyle}>userId:</span>
            <input
              style={inputStyle}
              value={userId}
              onChange={e => setUserId(e.target.value)}
              placeholder="1, 2, 3, 99..."
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ ...labelStyle, color: '#f87171', marginBottom: '0.6rem', fontWeight: 600 }}>
              Ручная реализация (Level 6)
            </div>
            {manualOptionResult.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.4rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{s.label}</div>
                <div style={{ color: '#fde68a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {String(s.value)}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.7rem', background: '#1a1a2e', borderRadius: '6px' }}>
              Результат: <span style={{ color: '#4ade80' }}>{manualOptionResult.result}</span>
            </div>
          </div>
          <div>
            <div style={{ ...labelStyle, color: '#34d399', marginBottom: '0.6rem', fontWeight: 600 }}>
              fp-ts (реальная библиотека)
            </div>
            {fptsOptionResult.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.4rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{s.label}</div>
                <div style={{ color: '#fde68a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {String(s.value)}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.6rem', padding: '0.4rem 0.7rem', background: '#1a1a2e', borderRadius: '6px' }}>
              Результат: <span style={{ color: '#4ade80' }}>{fptsOptionResult.result}</span>
            </div>
          </div>
        </div>
        <div style={codeBlock}>{`// Ручная
fromNullable(users[id])
  .flatMap(u => fromNullable(u.email))
  .map(e => e.toUpperCase())
  .getOrElse('N/A')

// fp-ts
pipe(
  O.fromNullable(users[id]),
  O.flatMap(u => O.fromNullable(u.email)),
  O.map(e => e.toUpperCase()),
  O.getOrElse(() => 'N/A')  // <-- thunk, не значение!
)`}
        </div>
        <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: '#1e3a5f', borderRadius: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: '#93c5fd', fontWeight: 600 }}>Ключевые отличия fp-ts:</span>
          <ul style={{ margin: '0.4rem 0 0 1rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            <li><code>getOrElse(() =&gt; 'N/A')</code> — принимает thunk (функцию), а не значение</li>
            <li><code>flatMap</code> — в fp-ts v2.15+ вместо <code>chain</code></li>
            <li>Всё через <code>pipe</code> — функции не прибиты к объекту</li>
          </ul>
        </div>
      </div>

      {/* Either comparison */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <h3 style={{ margin: 0, color: '#f3f4f6' }}>Either: валидация числа</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={labelStyle}>число:</span>
            <input
              style={inputStyle}
              value={numInput}
              onChange={e => setNumInput(e.target.value)}
              placeholder="42, -1, abc..."
            />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={{ ...labelStyle, color: '#f87171', marginBottom: '0.6rem', fontWeight: 600 }}>
              Ручная реализация
            </div>
            {manualEitherResult.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.4rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{s.label}</div>
                <div style={{ color: '#fde68a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {s.value}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.6rem' }}>
              <span style={badgeStyle(manualEitherResult.isRight ? 'green' : 'red')}>
                {manualEitherResult.final}
              </span>
            </div>
          </div>
          <div>
            <div style={{ ...labelStyle, color: '#34d399', marginBottom: '0.6rem', fontWeight: 600 }}>
              fp-ts
            </div>
            {fptsEitherResult.steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.4rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{s.label}</div>
                <div style={{ color: '#fde68a', fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {s.value}
                </div>
              </div>
            ))}
            <div style={{ marginTop: '0.6rem' }}>
              <span style={badgeStyle(fptsEitherResult.isRight ? 'green' : 'red')}>
                {fptsEitherResult.final}
              </span>
            </div>
          </div>
        </div>
        <div style={codeBlock}>{`// fp-ts Either: parseFloat → NaN-проверка → > 0 → sqrt
pipe(
  parsePos(input),                            // Either<string, number>
  E.flatMap(n =>
    n > 1000 ? E.left('Слишком большое') : E.right(n)
  ),                                          // Either<string, number>
  E.map(n => Math.sqrt(n).toFixed(4))         // Either<string, string>
)`}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 10.2: pipe и flow
// ============================================

const NAMES = ['Alice', 'Bob', 'Carol', 'Dan', 'Eve', 'Frank', 'Al', 'Ed']

type Mode = 'pipe' | 'flow' | 'native'

const CODE_EXAMPLES: Record<Mode, string> = {
  pipe: `import { pipe } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'

// pipe: данные идут первым аргументом
const result = pipe(
  names,
  A.filter(name => name.length > 3),
  A.map(S.toUpperCase),
  A.sort(S.Ord),
  names => names.join(', ')
)`,
  flow: `import { flow } from 'fp-ts/function'
import * as A from 'fp-ts/Array'
import * as S from 'fp-ts/string'

// flow: point-free — данные передаются отдельно
const processNames = flow(
  A.filter<string>(name => name.length > 3),
  A.map(S.toUpperCase),
  A.sort(S.Ord),
  (names: string[]) => names.join(', ')
)

const result = processNames(names)`,
  native: `// Нативный JS для сравнения
const result = names
  .filter(name => name.length > 3)
  .map(name => name.toUpperCase())
  .sort()
  .join(', ')`,
}

const DIFFERENCE_CODE = `// pipe: трансформация значения шаг за шагом
const a = pipe(
  O.some(5),
  O.map(x => x * 2),      // Some(10)
  O.flatMap(x =>           // Some(20) — flatMap нужен когда fn возвращает Option
    x > 100 ? O.none : O.some(x * 2)
  )
)

// ОШИБКА: fn1, fn2 возвращают Option — нужен flatMap, не map!
// pipe(O.some(5), O.map(toOpt), O.map(double))  // Option<Option<number>>!

// flow: создаёт функцию, не выполняет трансформацию
const double = flow(
  (x: number) => x * 2,
  (x: number) => x.toString()
)
double(5) // '10'`

export function Task10_2_Solution() {
  const [mode, setMode] = useState<Mode>('pipe')

  const pipeResult = pipe(
    NAMES,
    A.filter(name => name.length > 3),
    A.map(S.toUpperCase),
    A.sort(S.Ord),
    names => names.join(', '),
  )

  const processNames = flow(
    A.filter<string>(name => name.length > 3),
    A.map(S.toUpperCase),
    A.sort(S.Ord),
    (names: string[]) => names.join(', '),
  )
  const flowResult = processNames(NAMES)

  const nativeResult = NAMES
    .filter(name => name.length > 3)
    .map(name => name.toUpperCase())
    .sort()
    .join(', ')

  const resultMap: Record<Mode, string> = {
    pipe: pipeResult,
    flow: flowResult,
    native: nativeResult,
  }

  const steps = [
    { label: 'filter(length > 3)', value: NAMES.filter(n => n.length > 3) },
    { label: 'map(toUpperCase)', value: NAMES.filter(n => n.length > 3).map(n => n.toUpperCase()) },
    { label: 'sort(S.Ord)', value: NAMES.filter(n => n.length > 3).map(n => n.toUpperCase()).sort() },
    { label: 'join(", ")', value: NAMES.filter(n => n.length > 3).map(n => n.toUpperCase()).sort().join(', ') },
  ]

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#f9fafb', marginBottom: '0.3rem' }}>fp-ts: pipe и flow</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.2rem' }}>
        Два подхода к composable data processing
      </p>

      <div style={panelStyle}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={labelStyle}>Режим: </span>
          {(['pipe', 'flow', 'native'] as Mode[]).map(m => (
            <button key={m} style={btnStyle(mode === m)} onClick={() => setMode(m)}>{m}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <div style={labelStyle}>Входные данные</div>
            <div style={{ color: '#fde68a', marginBottom: '1rem' }}>
              [{NAMES.map(n => `"${n}"`).join(', ')}]
            </div>
            <div style={labelStyle}>Шаги pipeline</div>
            {steps.map((s, i) => (
              <div key={i} style={{ marginBottom: '0.5rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>{i + 1}. {s.label}</div>
                <div style={{ color: '#86efac', fontSize: '0.8rem' }}>
                  {Array.isArray(s.value)
                    ? `[${(s.value as string[]).map(v => `"${v}"`).join(', ')}]`
                    : `"${s.value}"`}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={labelStyle}>Код ({mode})</div>
            <div style={codeBlock}>{CODE_EXAMPLES[mode]}</div>
            <div style={{ marginTop: '0.8rem', padding: '0.5rem 0.8rem', background: '#14532d', borderRadius: '6px' }}>
              <span style={{ color: '#86efac' }}>Результат: "{resultMap[mode]}"</span>
            </div>
            <div style={{ marginTop: '0.4rem', color: '#6b7280', fontSize: '0.72rem' }}>
              {mode === 'pipe' && 'pipe: данные первый аргумент, трансформации цепочкой'}
              {mode === 'flow' && 'flow: создаёт функцию, данные передаются позже'}
              {mode === 'native' && 'native: метод-chaining, данные привязаны к объекту'}
            </div>
          </div>
        </div>
      </div>

      <div style={{ ...panelStyle, borderLeft: '3px solid #f87171' }}>
        <h3 style={{ margin: '0 0 0.6rem', color: '#fca5a5', fontSize: '0.9rem' }}>
          Типовая ошибка: map vs flatMap с Option
        </h3>
        <div style={codeBlock}>{DIFFERENCE_CODE}</div>
        <div style={{ marginTop: '0.6rem', color: '#9ca3af', fontSize: '0.8rem', lineHeight: '1.6' }}>
          Правило: если функция в <code style={{ color: '#93c5fd' }}>map</code> возвращает{' '}
          <code style={{ color: '#93c5fd' }}>Option/Either</code> — нужен <code style={{ color: '#86efac' }}>flatMap</code>.
          Иначе получаете <code style={{ color: '#f87171' }}>Option&lt;Option&lt;T&gt;&gt;</code>.
        </div>
      </div>

      <div style={panelStyle}>
        <h3 style={{ margin: '0 0 0.6rem', color: '#f3f4f6', fontSize: '0.9rem' }}>
          Когда использовать pipe vs flow?
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.82rem' }}>
          <div>
            <div style={{ color: '#93c5fd', fontWeight: 600, marginBottom: '0.4rem' }}>pipe — data first</div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#9ca3af', lineHeight: '1.8' }}>
              <li>Есть конкретное значение прямо сейчас</li>
              <li>Разовая трансформация в теле функции</li>
              <li>Лучше читается как "возьми X, сделай Y, Z"</li>
            </ul>
          </div>
          <div>
            <div style={{ color: '#34d399', fontWeight: 600, marginBottom: '0.4rem' }}>flow — point-free</div>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#9ca3af', lineHeight: '1.8' }}>
              <li>Нужно переиспользуемая функция-трансформация</li>
              <li>Передаёте как аргумент в другую функцию</li>
              <li>Комбинирование независимых частей pipeline</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 10.3: TaskEither
// ============================================

interface TEUser { id: string; name: string; token: string }
interface TEProfile { userId: string; role: string; plan: string }
interface TEPermission { resource: string; access: 'read' | 'write' | 'admin' }

type AuthError = { type: 'AuthError'; message: string }
type NetworkError = { type: 'NetworkError'; message: string }
type ForbiddenError = { type: 'ForbiddenError'; message: string }
type AppError = AuthError | NetworkError | ForbiddenError

interface LogEntry { ts: string; step: string; status: 'ok' | 'error' | 'running'; message: string }
type StepStatus = 'pending' | 'running' | 'ok' | 'error' | 'skipped'

function makeTE_authenticate(fail: boolean): TE.TaskEither<AuthError, TEUser> {
  return () => new Promise(resolve => {
    setTimeout(() => {
      if (fail) {
        resolve(E.left({ type: 'AuthError', message: 'Invalid token: access denied' }))
      } else {
        resolve(E.right({ id: 'user-42', name: 'Alice', token: 'tok-abc' }))
      }
    }, 400)
  })
}

function makeTE_fetchProfile(fail: boolean): (user: TEUser) => TE.TaskEither<NetworkError, TEProfile> {
  return (user) => () => new Promise(resolve => {
    setTimeout(() => {
      if (fail) {
        resolve(E.left({ type: 'NetworkError', message: `Timeout fetching profile for ${user.id}` }))
      } else {
        resolve(E.right({ userId: user.id, role: 'admin', plan: 'pro' }))
      }
    }, 400)
  })
}

function makeTE_checkPermissions(fail: boolean): (profile: TEProfile, resource: string) => TE.TaskEither<ForbiddenError, TEPermission> {
  return (profile, resource) => () => new Promise(resolve => {
    setTimeout(() => {
      if (fail) {
        resolve(E.left({ type: 'ForbiddenError', message: `Role "${profile.role}" cannot access "${resource}"` }))
      } else {
        resolve(E.right({ resource, access: 'admin' }))
      }
    }, 400)
  })
}

const TE_PIPELINE_CODE = `import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

const workflow = pipe(
  authenticate(token),                        // TE<AuthError, User>
  TE.flatMap(user => fetchProfile(user.id)),  // TE<NetworkError, Profile>
  TE.flatMap(profile =>
    checkPermissions(profile, resource)       // TE<ForbiddenError, Permission>
  )
)

// Запуск:
const result = await workflow()
// result: Either<AuthError | NetworkError | ForbiddenError, Permission>`

export function Task10_3_Solution() {
  const [authFail, setAuthFail] = useState(false)
  const [networkFail, setNetworkFail] = useState(false)
  const [forbiddenFail, setForbiddenFail] = useState(false)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<LogEntry[]>([])
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({
    auth: 'pending',
    profile: 'pending',
    permissions: 'pending',
    success: 'pending',
  })
  const [finalResult, setFinalResult] = useState<string | null>(null)
  const [finalOk, setFinalOk] = useState<boolean | null>(null)

  const nowStr = () => new Date().toISOString().slice(11, 23)

  const addLog = useCallback((entry: LogEntry, prevLog: LogEntry[]) => {
    return [...prevLog, entry]
  }, [])

  const run = async () => {
    if (running) return
    setRunning(true)
    setLog([])
    setFinalResult(null)
    setFinalOk(null)
    setStepStatuses({ auth: 'pending', profile: 'pending', permissions: 'pending', success: 'pending' })

    const currentLog: LogEntry[] = []

    const pushLog = (entry: LogEntry) => {
      currentLog.push(entry)
      setLog([...currentLog])
    }

    // Step 1: auth
    setStepStatuses(s => ({ ...s, auth: 'running' }))
    pushLog({ ts: nowStr(), step: 'authenticate', status: 'running', message: 'Проверяем токен...' })

    const authResult = await makeTE_authenticate(authFail)()

    if (E.isLeft(authResult)) {
      const err = authResult.left
      setStepStatuses(s => ({ ...s, auth: 'error', profile: 'skipped', permissions: 'skipped', success: 'skipped' }))
      pushLog({ ts: nowStr(), step: 'authenticate', status: 'error', message: `${err.type}: ${err.message}` })
      setFinalResult(`Ошибка авторизации: ${err.message}`)
      setFinalOk(false)
      setRunning(false)
      return
    }

    const user = authResult.right
    setStepStatuses(s => ({ ...s, auth: 'ok', profile: 'running' }))
    pushLog({ ts: nowStr(), step: 'authenticate', status: 'ok', message: `OK — user: ${user.name} (${user.id})` })

    // Step 2: profile
    pushLog({ ts: nowStr(), step: 'fetchProfile', status: 'running', message: `Загружаем профиль для ${user.id}...` })

    const profileResult = await makeTE_fetchProfile(networkFail)(user)()

    if (E.isLeft(profileResult)) {
      const err = profileResult.left
      setStepStatuses(s => ({ ...s, profile: 'error', permissions: 'skipped', success: 'skipped' }))
      pushLog({ ts: nowStr(), step: 'fetchProfile', status: 'error', message: `${err.type}: ${err.message}` })
      setFinalResult(`Ошибка сети: ${err.message}`)
      setFinalOk(false)
      setRunning(false)
      return
    }

    const profile = profileResult.right
    setStepStatuses(s => ({ ...s, profile: 'ok', permissions: 'running' }))
    pushLog({ ts: nowStr(), step: 'fetchProfile', status: 'ok', message: `OK — role: ${profile.role}, plan: ${profile.plan}` })

    // Step 3: permissions
    pushLog({ ts: nowStr(), step: 'checkPermissions', status: 'running', message: 'Проверяем права доступа...' })

    const permResult = await makeTE_checkPermissions(forbiddenFail)(profile, '/api/admin')()

    if (E.isLeft(permResult)) {
      const err = permResult.left
      setStepStatuses(s => ({ ...s, permissions: 'error', success: 'skipped' }))
      pushLog({ ts: nowStr(), step: 'checkPermissions', status: 'error', message: `${err.type}: ${err.message}` })
      setFinalResult(`Доступ запрещён: ${err.message}`)
      setFinalOk(false)
      setRunning(false)
      return
    }

    const perm = permResult.right
    setStepStatuses(s => ({ ...s, permissions: 'ok', success: 'ok' }))
    pushLog({ ts: nowStr(), step: 'checkPermissions', status: 'ok', message: `OK — access: ${perm.access} to ${perm.resource}` })
    pushLog({ ts: nowStr(), step: 'success', status: 'ok', message: 'Workflow завершён успешно' })
    setFinalResult(`Доступ получен: ${perm.access} к ${perm.resource}`)
    setFinalOk(true)
    setRunning(false)
  }

  const STEPS = [
    { key: 'auth', label: 'authenticate()', sublabel: 'TE<AuthError, User>' },
    { key: 'profile', label: 'fetchProfile()', sublabel: 'TE<NetworkError, Profile>' },
    { key: 'permissions', label: 'checkPermissions()', sublabel: 'TE<ForbiddenError, Permission>' },
    { key: 'success', label: 'Success', sublabel: 'Permission' },
  ]

  const stepBg = (status: StepStatus) => {
    if (status === 'ok') return '#14532d'
    if (status === 'error') return '#7f1d1d'
    if (status === 'running') return '#78350f'
    if (status === 'skipped') return '#1f2937'
    return '#1f2937'
  }

  const stepColor = (status: StepStatus) => {
    if (status === 'ok') return '#86efac'
    if (status === 'error') return '#fca5a5'
    if (status === 'running') return '#fde68a'
    if (status === 'skipped') return '#4b5563'
    return '#6b7280'
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#f9fafb', marginBottom: '0.3rem' }}>fp-ts: TaskEither</h2>
      <p style={{ color: '#6b7280', marginBottom: '1.2rem' }}>
        Async workflow с типизированными ошибками на каждом шаге
      </p>

      {/* Controls */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.82rem' }}>Точки отказа:</span>
          {[
            { label: 'Auth fails', value: authFail, set: setAuthFail },
            { label: 'Network fails', value: networkFail, set: setNetworkFail },
            { label: 'Forbidden', value: forbiddenFail, set: setForbiddenFail },
          ].map(({ label, value, set }) => (
            <label key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: value ? '#f87171' : '#9ca3af', fontSize: '0.82rem' }}>
              <input
                type="checkbox"
                checked={value}
                onChange={e => set(e.target.checked)}
                style={{ accentColor: '#f87171' }}
              />
              {label}
            </label>
          ))}
          <button
            style={{
              ...btnStyle(),
              background: running ? '#1f2937' : '#1e3a5f',
              color: running ? '#6b7280' : '#93c5fd',
              cursor: running ? 'not-allowed' : 'pointer',
            }}
            onClick={run}
            disabled={running}
          >
            {running ? 'Выполняется...' : 'Выполнить'}
          </button>
        </div>

        {/* Step visualization */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {STEPS.map((step, i) => (
            <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                background: stepBg(stepStatuses[step.key]),
                border: `1px solid ${stepColor(stepStatuses[step.key])}`,
                borderRadius: '8px',
                padding: '0.5rem 0.8rem',
                minWidth: '110px',
                textAlign: 'center',
              }}>
                <div style={{ color: stepColor(stepStatuses[step.key]), fontWeight: 600, fontSize: '0.8rem' }}>
                  {step.label}
                </div>
                <div style={{ color: '#4b5563', fontSize: '0.68rem' }}>{step.sublabel}</div>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ color: '#374151', fontSize: '1.2rem' }}>→</div>
              )}
            </div>
          ))}
        </div>

        {finalResult !== null && (
          <div style={{
            padding: '0.5rem 0.8rem',
            background: finalOk ? '#14532d' : '#7f1d1d',
            borderRadius: '6px',
            color: finalOk ? '#86efac' : '#fca5a5',
            fontSize: '0.85rem',
            marginBottom: '0.8rem',
          }}>
            {finalOk ? 'Успех: ' : 'Ошибка: '}{finalResult}
          </div>
        )}

        {/* Execution log */}
        {log.length > 0 && (
          <div style={{ background: '#0f172a', borderRadius: '6px', padding: '0.6rem', maxHeight: '160px', overflowY: 'auto' }}>
            {log.map((entry, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.2rem', fontSize: '0.76rem' }}>
                <span style={{ color: '#4b5563', flexShrink: 0 }}>{entry.ts}</span>
                <span style={{ color: '#6b7280', flexShrink: 0 }}>[{entry.step}]</span>
                <span style={{
                  color: entry.status === 'ok' ? '#86efac' : entry.status === 'error' ? '#fca5a5' : '#fde68a',
                }}>
                  {entry.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pipeline code */}
      <div style={panelStyle}>
        <div style={labelStyle}>Pipeline код</div>
        <div style={codeBlock}>{TE_PIPELINE_CODE}</div>
        <div style={{ marginTop: '0.8rem', padding: '0.6rem 0.8rem', background: '#1e3a5f', borderRadius: '6px', fontSize: '0.8rem' }}>
          <span style={{ color: '#93c5fd', fontWeight: 600 }}>Ключевые свойства TaskEither:</span>
          <ul style={{ margin: '0.4rem 0 0 1rem', color: '#cbd5e1', lineHeight: '1.7' }}>
            <li><code>TaskEither&lt;E, A&gt;</code> = <code>() =&gt; Promise&lt;Either&lt;E, A&gt;&gt;</code> — ленивый async</li>
            <li>При ошибке вся цепочка <code>flatMap</code> прерывается — short-circuit</li>
            <li>Каждый шаг имеет свой тип ошибки — полная типобезопасность</li>
            <li><code>TE.flatMap</code> для async-шагов, <code>TE.map</code> для синхронных преобразований</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
