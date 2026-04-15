import { useState, useMemo } from 'react'

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

const labelStyle: React.CSSProperties = {
  color: '#9ca3af',
  fontSize: '0.78rem',
  marginBottom: '0.4rem',
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
  width: '100%',
}

// ============================================
// Algebraic structures
// ============================================

interface Semigroup<T> {
  concat: (a: T, b: T) => T
}

interface Monoid<T> extends Semigroup<T> {
  empty: T
}

const Sum: Monoid<number> = {
  concat: (a, b) => a + b,
  empty: 0,
}

const Product: Monoid<number> = {
  concat: (a, b) => a * b,
  empty: 1,
}

const All: Monoid<boolean> = {
  concat: (a, b) => a && b,
  empty: true,
}

const Any: Monoid<boolean> = {
  concat: (a, b) => a || b,
  empty: false,
}

const Min: Monoid<number> = {
  concat: (a, b) => Math.min(a, b),
  empty: Infinity,
}

const Max: Monoid<number> = {
  concat: (a, b) => Math.max(a, b),
  empty: -Infinity,
}

interface FirstSemigroup<T> extends Semigroup<T | null> {
  name: string
}

const First: FirstSemigroup<string> = {
  name: 'First',
  concat: (a, _b) => a,
}

function fold<T>(M: Monoid<T>, xs: T[]): T {
  return xs.reduce(M.concat, M.empty)
}

function foldMap<A, M>(monoid: Monoid<M>, f: (a: A) => M, xs: A[]): M {
  return fold(monoid, xs.map(f))
}

// ============================================
// Task 9.1: Semigroup и Monoid playground
// ============================================

type MonoidKey = 'Sum' | 'Product' | 'All' | 'Any' | 'Min' | 'Max'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyMonoid = Monoid<any>

const MONOIDS: Record<MonoidKey, { monoid: AnyMonoid; label: string; exampleInput: string }> = {
  Sum:     { monoid: Sum,     label: 'Sum (сложение)',        exampleInput: '3, 5, 2' },
  Product: { monoid: Product, label: 'Product (умножение)',   exampleInput: '2, 3, 4' },
  All:     { monoid: All,     label: 'All (логическое AND)',  exampleInput: 'true, false, true' },
  Any:     { monoid: Any,     label: 'Any (логическое OR)',   exampleInput: 'false, false, true' },
  Min:     { monoid: Min,     label: 'Min (минимум)',         exampleInput: '7, 2, 9' },
  Max:     { monoid: Max,     label: 'Max (максимум)',        exampleInput: '7, 2, 9' },
}

function parseValues(input: string, key: MonoidKey): (number | boolean)[] {
  return input.split(',').map(s => {
    const v = s.trim()
    if (key === 'All' || key === 'Any') return v === 'true'
    const n = parseFloat(v)
    return isNaN(n) ? 0 : n
  })
}

export function Task9_1_Solution() {
  const [monoidKey, setMonoidKey] = useState<MonoidKey>('Sum')
  const [inputText, setInputText] = useState('3, 5, 2')

  const values = useMemo(() => parseValues(inputText, monoidKey), [inputText, monoidKey])
  const { monoid, label } = MONOIDS[monoidKey]

  // пошаговое применение concat
  const steps = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = monoid as Monoid<any>
    const result: { step: string; acc: number | boolean }[] = []
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let acc = m.empty
    result.push({ step: `empty = ${String(m.empty)}`, acc: acc as number | boolean })
    for (const v of values) {
      const prev = acc
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      acc = m.concat(acc, v)
      result.push({
        step: `concat(${String(prev)}, ${String(v)}) = ${String(acc)}`,
        acc: acc as number | boolean,
      })
    }
    return result
  }, [monoid, values])

  // проверка ассоциативности (для числовых моноидов с ≥3 элементами)
  const assocCheck = useMemo(() => {
    if (values.length < 3) return null
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const m = monoid as Monoid<any>
    const [a, b, c] = values
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const left  = m.concat(m.concat(a, b), c)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const right = m.concat(a, m.concat(b, c))
    return { left: left as number | boolean, right: right as number | boolean, equal: String(left) === String(right) }
  }, [monoid, values])

  const finalResult = steps.length > 0 ? steps[steps.length - 1].acc : null

  function handleMonoidChange(key: MonoidKey) {
    setMonoidKey(key)
    setInputText(MONOIDS[key].exampleInput)
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 1.2rem', color: '#f9fafb', fontSize: '1.1rem' }}>
        Semigroup и Monoid
      </h2>

      <div style={panelStyle}>
        <div style={labelStyle}>Интерфейсы:</div>
        <div style={codeBlock}>{`interface Semigroup<T> { concat: (a: T, b: T) => T }
interface Monoid<T> extends Semigroup<T> { empty: T }

const fold    = <T,>(M: Monoid<T>, xs: T[]): T => xs.reduce(M.concat, M.empty)
const foldMap = <A, M,>(monoid: Monoid<M>, f: (a: A) => M, xs: A[]): M =>
  fold(monoid, xs.map(f))`}</div>
      </div>

      <div style={panelStyle}>
        <div style={labelStyle}>Выберите моноид:</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.8rem' }}>
          {(Object.keys(MONOIDS) as MonoidKey[]).map(key => (
            <button key={key} style={btnStyle(key === monoidKey)} onClick={() => handleMonoidChange(key)}>
              {key}
            </button>
          ))}
        </div>
        <div style={{ color: '#6ee7b7', fontSize: '0.8rem', marginBottom: '0.8rem' }}>
          {label} &nbsp;|&nbsp; empty = {String((monoid as Monoid<number | boolean>).empty)}
        </div>

        <div style={labelStyle}>Введите значения через запятую:</div>
        <input
          style={{ ...inputStyle, marginBottom: '0.8rem' }}
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={MONOIDS[monoidKey].exampleInput}
        />
      </div>

      <div style={panelStyle}>
        <div style={labelStyle}>Пошаговое выполнение fold:</div>
        {steps.map((s, i) => (
          <div key={i} style={{
            padding: '0.3rem 0.6rem',
            borderLeft: `3px solid ${i === 0 ? '#6b7280' : '#3b82f6'}`,
            marginBottom: '0.3rem',
            background: i === steps.length - 1 ? '#1e3a5f' : 'transparent',
            borderRadius: '0 4px 4px 0',
            color: i === steps.length - 1 ? '#93c5fd' : '#e5e7eb',
          }}>
            {i === 0 ? 'acc = ' : ''}{s.step}
          </div>
        ))}
        {finalResult !== null && (
          <div style={{ marginTop: '0.8rem', color: '#6ee7b7', fontSize: '0.95rem' }}>
            Результат: <strong>{String(finalResult)}</strong>
          </div>
        )}
      </div>

      {assocCheck && (
        <div style={panelStyle}>
          <div style={labelStyle}>Проверка ассоциативности (первые 3 элемента):</div>
          <div style={codeBlock}>{`(a ∘ b) ∘ c = ${String(assocCheck.left)}
a ∘ (b ∘ c) = ${String(assocCheck.right)}
Равны: ${assocCheck.equal ? 'да' : 'нет'}`}</div>
          <div style={{
            marginTop: '0.5rem',
            color: assocCheck.equal ? '#6ee7b7' : '#f87171',
            fontSize: '0.82rem',
          }}>
            {assocCheck.equal
              ? 'Закон ассоциативности выполнен — можно параллелизовать fold!'
              : 'Закон нарушен — это не Semigroup'}
          </div>
        </div>
      )}

      <div style={panelStyle}>
        <div style={labelStyle}>First — Semigroup без empty (не Monoid):</div>
        <div style={codeBlock}>{`const First: Semigroup<T | null> = {
  concat: (a, _b) => a  // всегда возвращает первый
}
// empty не существует для произвольного T
// concat('Alice', 'Bob') = 'Alice'
// concat('Alice', First.concat('Bob', 'Carol')) = 'Alice'`}</div>
        <div style={{ marginTop: '0.5rem', color: '#fbbf24', fontSize: '0.8rem' }}>
          First.concat({'"Alice"'}, {'"Bob"'}) = {'"'}{First.concat('Alice', 'Bob')}{'"'}
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 9.2: foldMap для агрегации заказов
// ============================================

type OrderStatus = 'completed' | 'cancelled' | 'pending'

interface Order {
  id: number
  customer: string
  amount: number
  status: OrderStatus
  date: string
}

const INITIAL_ORDERS: Order[] = [
  { id: 1,  customer: 'Алиса',   amount: 4200, status: 'completed',  date: '2024-01-05' },
  { id: 2,  customer: 'Борис',   amount: 1800, status: 'cancelled',  date: '2024-01-07' },
  { id: 3,  customer: 'Вера',    amount: 9500, status: 'completed',  date: '2024-01-10' },
  { id: 4,  customer: 'Геннадий',amount: 3300, status: 'pending',    date: '2024-01-11' },
  { id: 5,  customer: 'Дарья',   amount: 7100, status: 'completed',  date: '2024-01-12' },
  { id: 6,  customer: 'Евгений', amount: 2900, status: 'cancelled',  date: '2024-01-15' },
  { id: 7,  customer: 'Жанна',   amount: 5600, status: 'completed',  date: '2024-01-17' },
  { id: 8,  customer: 'Захар',   amount: 800,  status: 'pending',    date: '2024-01-18' },
  { id: 9,  customer: 'Ирина',   amount: 12000,status: 'completed',  date: '2024-01-20' },
  { id: 10, customer: 'Кирилл', amount: 4700, status: 'cancelled',  date: '2024-01-22' },
  { id: 11, customer: 'Лариса',  amount: 3100, status: 'completed',  date: '2024-01-24' },
  { id: 12, customer: 'Михаил',  amount: 6400, status: 'pending',    date: '2024-01-25' },
]

const STATUS_COLOR: Record<OrderStatus, string> = {
  completed: '#6ee7b7',
  cancelled: '#f87171',
  pending:   '#fbbf24',
}

let nextId = 13

function generateOrder(): Order {
  const customers = ['Наталья', 'Олег', 'Полина', 'Роман', 'Светлана']
  const statuses: OrderStatus[] = ['completed', 'cancelled', 'pending']
  return {
    id: nextId++,
    customer: customers[Math.floor(Math.random() * customers.length)],
    amount: Math.floor(Math.random() * 15000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    date: `2024-02-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
  }
}

export function Task9_2_Solution() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)
  const [filterStatus, setFilterStatus] = useState<Record<OrderStatus, boolean>>({
    completed: true,
    cancelled: true,
    pending:   true,
  })

  const filtered = useMemo(
    () => orders.filter(o => filterStatus[o.status]),
    [orders, filterStatus]
  )

  const completedOrders = useMemo(() => filtered.filter(o => o.status === 'completed'), [filtered])

  const totalRevenue   = useMemo(() => foldMap(Sum, o => o.amount, completedOrders), [completedOrders])
  const hasCancelled   = useMemo(() => foldMap(Any as Monoid<boolean>, o => o.status === 'cancelled', filtered), [filtered])
  const maxAmount      = useMemo(() => foldMap(Max, o => o.amount, filtered), [filtered])
  const minAmount      = useMemo(() => foldMap(Min, o => o.amount, completedOrders.length > 0 ? completedOrders : [{ amount: 0 } as Order]), [completedOrders])
  const completedCount = useMemo(() => foldMap(Sum, o => o.status === 'completed' ? 1 : 0, filtered), [filtered])

  const metrics = [
    {
      label: 'Выручка (completed)',
      monoid: 'Sum',
      value: totalRevenue > 0 ? `${totalRevenue.toLocaleString('ru')} ₽` : '—',
      color: '#6ee7b7',
      code: `foldMap(Sum, o => o.amount,\n  orders.filter(completed))`,
    },
    {
      label: 'Есть отменённые',
      monoid: 'Any',
      value: hasCancelled ? 'да' : 'нет',
      color: hasCancelled ? '#f87171' : '#6ee7b7',
      code: `foldMap(Any, o => o.status === 'cancelled', orders)`,
    },
    {
      label: 'Макс. заказ',
      monoid: 'Max',
      value: filtered.length > 0 ? `${maxAmount.toLocaleString('ru')} ₽` : '—',
      color: '#93c5fd',
      code: `foldMap(Max, o => o.amount, orders)`,
    },
    {
      label: 'Мин. completed',
      monoid: 'Min',
      value: completedOrders.length > 0 ? `${minAmount.toLocaleString('ru')} ₽` : '—',
      color: '#fbbf24',
      code: `foldMap(Min, o => o.amount,\n  orders.filter(completed))`,
    },
    {
      label: 'Кол-во выполненных',
      monoid: 'Sum',
      value: String(completedCount),
      color: '#a78bfa',
      code: `foldMap(Sum,\n  o => o.status === 'completed' ? 1 : 0, orders)`,
    },
  ]

  function toggleStatus(s: OrderStatus) {
    setFilterStatus(prev => ({ ...prev, [s]: !prev[s] }))
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 1.2rem', color: '#f9fafb', fontSize: '1.1rem' }}>
        foldMap для агрегации заказов
      </h2>

      {/* Фильтры */}
      <div style={panelStyle}>
        <div style={labelStyle}>Фильтр по статусу:</div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {(['completed', 'cancelled', 'pending'] as OrderStatus[]).map(s => (
            <button key={s} style={btnStyle(filterStatus[s])} onClick={() => toggleStatus(s)}>
              <span style={{ color: STATUS_COLOR[s] }}>●</span> {s} ({orders.filter(o => o.status === s).length})
            </button>
          ))}
          <button
            style={btnStyle()}
            onClick={() => setOrders(prev => [...prev, generateOrder()])}
          >
            + Добавить заказ
          </button>
        </div>
        <div style={{ marginTop: '0.5rem', color: '#6b7280', fontSize: '0.78rem' }}>
          Показано {filtered.length} из {orders.length} заказов
        </div>
      </div>

      {/* Дашборд метрик */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.7rem', marginBottom: '1rem' }}>
        {metrics.map(m => (
          <div key={m.label} style={{ ...panelStyle, marginBottom: 0, border: `1px solid #374151` }}>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>{m.label}</div>
            <div style={{ color: m.color, fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              {m.value}
            </div>
            <div style={{ background: '#1e40af22', borderRadius: '4px', padding: '0.2rem 0.4rem', fontSize: '0.72rem', color: '#60a5fa' }}>
              {m.monoid}
            </div>
            <div style={{ ...codeBlock, marginTop: '0.4rem', fontSize: '0.68rem', padding: '0.4rem' }}>
              {m.code}
            </div>
          </div>
        ))}
      </div>

      {/* Таблица заказов */}
      <div style={panelStyle}>
        <div style={labelStyle}>Таблица заказов ({filtered.length}):</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ color: '#6b7280', borderBottom: '1px solid #374151' }}>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>Клиент</th>
                <th style={{ padding: '0.4rem', textAlign: 'right' }}>Сумма</th>
                <th style={{ padding: '0.4rem', textAlign: 'center' }}>Статус</th>
                <th style={{ padding: '0.4rem', textAlign: 'left' }}>Дата</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} style={{ borderBottom: '1px solid #1f2937' }}>
                  <td style={{ padding: '0.4rem', color: '#6b7280' }}>#{o.id}</td>
                  <td style={{ padding: '0.4rem' }}>{o.customer}</td>
                  <td style={{ padding: '0.4rem', textAlign: 'right', color: '#e5e7eb' }}>
                    {o.amount.toLocaleString('ru')} ₽
                  </td>
                  <td style={{ padding: '0.4rem', textAlign: 'center' }}>
                    <span style={{ color: STATUS_COLOR[o.status], fontSize: '0.75rem' }}>{o.status}</span>
                  </td>
                  <td style={{ padding: '0.4rem', color: '#9ca3af' }}>{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 9.3: Паттерн интерпретатора (Free-like)
// ============================================

// Используем конкретный тип Program вместо параметризованного StoreOp<A>,
// чтобы избежать рекурсивных сложностей с type-параметром.
type Program =
  | { tag: 'Get';    key: string; next: (value: string | null) => Program }
  | { tag: 'Set';    key: string; value: string; next: Program }
  | { tag: 'Delete'; key: string; next: Program }
  | { tag: 'Return'; value: string }

// Псевдоним для совместимости с описанием курса
type StoreOp<_A = string> = Program

// Интерпретатор 1: выполнение на Map
function runInMemory(op: Program, store: Map<string, string>): { result: string; store: Map<string, string> } {
  if (op.tag === 'Return') {
    return { result: op.value, store: new Map(store) }
  }
  if (op.tag === 'Get') {
    const val = store.get(op.key) ?? null
    return runInMemory(op.next(val), store)
  }
  if (op.tag === 'Set') {
    const newStore = new Map(store)
    newStore.set(op.key, op.value)
    return runInMemory(op.next, newStore)
  }
  // Delete
  const newStore = new Map(store)
  newStore.delete(op.key)
  return runInMemory(op.next, newStore)
}

// Интерпретатор 2: журнал операций (без выполнения)
function runAsLog(op: Program, log: string[] = []): string[] {
  if (op.tag === 'Return') return log
  if (op.tag === 'Get') {
    return runAsLog(op.next(null), [...log, `GET ${op.key}`])
  }
  if (op.tag === 'Set') {
    return runAsLog(op.next, [...log, `SET ${op.key} = ${op.value}`])
  }
  // Delete
  return runAsLog(op.next, [...log, `DELETE ${op.key}`])
}

// Вспомогательные конструкторы
const get = (key: string, next: (v: string | null) => Program): Program =>
  ({ tag: 'Get', key, next })

const set = (key: string, value: string, next: Program): Program =>
  ({ tag: 'Set', key, value, next })

const del = (key: string, next: Program): Program =>
  ({ tag: 'Delete', key, next })

const ret = (value: string): Program =>
  ({ tag: 'Return', value })

// Пример программы
const EXAMPLE_PROGRAM: StoreOp<string> = set('user', 'Alice',
  set('role', 'admin',
    get('user', userVal =>
      set('greeting', `Hello, ${userVal ?? 'guest'}`,
        del('role',
          get('greeting', val =>
            ret(val ?? 'empty')
          )
        )
      )
    )
  )
)

type StepKind = 'Get' | 'Set' | 'Delete'

interface ProgramStep {
  kind: StepKind
  key: string
  value?: string
}

function buildProgram(steps: ProgramStep[]): Program {
  // строим программу в обратном порядке, последний шаг → ret
  let program: Program = ret('done')
  for (let i = steps.length - 1; i >= 0; i--) {
    const s = steps[i]
    if (s.kind === 'Set')         program = set(s.key, s.value ?? '', program)
    else if (s.kind === 'Delete') program = del(s.key, program)
    else if (s.kind === 'Get') {
      const continuation = program
      program = get(s.key, () => continuation)
    }
  }
  return program
}

export function Task9_3_Solution() {
  const [steps, setSteps] = useState<ProgramStep[]>([
    { kind: 'Set', key: 'user', value: 'Alice' },
    { kind: 'Set', key: 'role', value: 'admin' },
    { kind: 'Get', key: 'user' },
    { kind: 'Delete', key: 'role' },
  ])
  const [newKey, setNewKey]     = useState('key')
  const [newValue, setNewValue] = useState('value')
  const [newKind, setNewKind]   = useState<StepKind>('Set')
  const [interpreter, setInterpreter] = useState<'memory' | 'log'>('memory')
  const [useExample, setUseExample]   = useState(false)

  const program: Program = useMemo(
    () => useExample ? EXAMPLE_PROGRAM : buildProgram(steps),
    [steps, useExample]
  )

  const memResult = useMemo(() => {
    try {
      return runInMemory(program, new Map())
    } catch {
      return null
    }
  }, [program])

  const logResult = useMemo(() => {
    try {
      return runAsLog(program)
    } catch {
      return []
    }
  }, [program])

  function addStep() {
    setSteps(prev => [...prev, { kind: newKind, key: newKey, value: newKind === 'Set' ? newValue : undefined }])
  }

  function removeStep(i: number) {
    setSteps(prev => prev.filter((_, idx) => idx !== i))
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ margin: '0 0 1.2rem', color: '#f9fafb', fontSize: '1.1rem' }}>
        Паттерн интерпретатора (Free-like DSL)
      </h2>

      <div style={panelStyle}>
        <div style={labelStyle}>Тип программы (AST):</div>
        <div style={codeBlock}>{`type StoreOp<A> =
  | { tag: 'Get';    key: string; next: (value: string | null) => A }
  | { tag: 'Set';    key: string; value: string; next: A }
  | { tag: 'Delete'; key: string; next: A }
  | { tag: 'Return'; value: A }`}</div>
      </div>

      {/* Выбор режима */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button style={btnStyle(!useExample)} onClick={() => setUseExample(false)}>Свои шаги</button>
        <button style={btnStyle(useExample)} onClick={() => setUseExample(true)}>Пример (user + role + greeting)</button>
      </div>

      {!useExample && (
        <div style={panelStyle}>
          <div style={labelStyle}>Построить программу:</div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '0.5rem' }}>
            <select
              value={newKind}
              onChange={e => setNewKind(e.target.value as StepKind)}
              style={{ ...inputStyle, width: 'auto' }}
            >
              <option value="Set">Set</option>
              <option value="Get">Get</option>
              <option value="Delete">Delete</option>
            </select>
            <input
              style={{ ...inputStyle, width: '100px' }}
              value={newKey}
              onChange={e => setNewKey(e.target.value)}
              placeholder="key"
            />
            {newKind === 'Set' && (
              <input
                style={{ ...inputStyle, width: '100px' }}
                value={newValue}
                onChange={e => setNewValue(e.target.value)}
                placeholder="value"
              />
            )}
            <button style={btnStyle()} onClick={addStep}>+ Добавить шаг</button>
          </div>

          <div style={labelStyle}>Шаги программы:</div>
          {steps.length === 0 && (
            <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Нет шагов</div>
          )}
          {steps.map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.3rem 0.6rem', marginBottom: '0.25rem',
              background: '#0f172a', borderRadius: '4px',
            }}>
              <span style={{ color: s.kind === 'Set' ? '#93c5fd' : s.kind === 'Get' ? '#6ee7b7' : '#f87171', minWidth: '50px' }}>
                {s.kind}
              </span>
              <span style={{ color: '#fbbf24' }}>{s.key}</span>
              {s.value !== undefined && <span style={{ color: '#9ca3af' }}>= {s.value}</span>}
              <button
                style={{ ...btnStyle(), marginLeft: 'auto', padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
                onClick={() => removeStep(i)}
              >
                x
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Выбор интерпретатора */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button style={btnStyle(interpreter === 'memory')} onClick={() => setInterpreter('memory')}>
          In-Memory интерпретатор
        </button>
        <button style={btnStyle(interpreter === 'log')} onClick={() => setInterpreter('log')}>
          Log интерпретатор
        </button>
      </div>

      {interpreter === 'memory' && memResult && (
        <div style={panelStyle}>
          <div style={labelStyle}>In-Memory: состояние хранилища после выполнения</div>
          {memResult.store.size === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Хранилище пусто</div>
          ) : (
            Array.from(memResult.store.entries()).map(([k, v]) => (
              <div key={k} style={{
                display: 'flex', gap: '1rem', padding: '0.3rem 0.6rem',
                background: '#0f172a', borderRadius: '4px', marginBottom: '0.25rem',
              }}>
                <span style={{ color: '#fbbf24', minWidth: '80px' }}>{k}</span>
                <span style={{ color: '#e5e7eb' }}>=</span>
                <span style={{ color: '#6ee7b7' }}>{v}</span>
              </div>
            ))
          )}
          <div style={{ marginTop: '0.6rem', color: '#9ca3af', fontSize: '0.8rem' }}>
            Финальный результат: <span style={{ color: '#93c5fd' }}>{String(memResult.result)}</span>
          </div>
        </div>
      )}

      {interpreter === 'log' && (
        <div style={panelStyle}>
          <div style={labelStyle}>Log: список операций (программа не выполняется)</div>
          {logResult.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>Нет операций</div>
          ) : (
            logResult.map((line, i) => (
              <div key={i} style={{
                padding: '0.3rem 0.6rem', marginBottom: '0.25rem',
                background: '#0f172a', borderRadius: '4px',
                borderLeft: `3px solid ${
                  line.startsWith('SET') ? '#93c5fd' :
                  line.startsWith('GET') ? '#6ee7b7' : '#f87171'
                }`,
                color: '#e5e7eb',
              }}>
                {i + 1}. {line}
              </div>
            ))
          )}
          <div style={{ marginTop: '0.6rem', color: '#fbbf24', fontSize: '0.78rem' }}>
            Одна и та же программа может быть интерпретирована по-разному: выполнена, залогирована, сериализована, протестирована...
          </div>
        </div>
      )}

      <div style={panelStyle}>
        <div style={labelStyle}>Принцип: описание отделено от выполнения</div>
        <div style={codeBlock}>{`// Одна программа — два интерпретатора:
runInMemory(program, new Map())  // выполняет реально
runAsLog(program)                 // возвращает ['SET user = Alice', ...]

// Аналогия: SQL-запрос = AST, движок БД = интерпретатор
// Один и тот же SELECT можно: выполнить, объяснить (EXPLAIN), кешировать`}</div>
      </div>
    </div>
  )
}
