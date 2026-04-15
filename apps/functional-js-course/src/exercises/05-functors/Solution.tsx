import { useState } from 'react'

// ============================================
// Box — the simplest functor
// ============================================

class Box<T> {
  private constructor(private readonly value: T) {}

  static of<T>(value: T): Box<T> {
    return new Box(value)
  }

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value))
  }

  fold<U>(fn: (value: T) => U): U {
    return fn(this.value)
  }

  inspect(): string {
    const v = this.value
    if (Array.isArray(v)) return `Box([${v.join(', ')}])`
    return `Box(${String(v)})`
  }

  getValue(): T {
    return this.value
  }
}

// ============================================
// Task 5.1 Solution: Box visualizer
// ============================================

type TransformId =
  | 'toUpperCase'
  | 'trim'
  | 'split'
  | 'length'
  | 'double'
  | 'reverse'
  | 'addBang'

interface TransformDef {
  id: TransformId
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (x: any) => any
  describe: string
}

const TRANSFORMS: TransformDef[] = [
  { id: 'toUpperCase', label: 'toUpperCase()', fn: (x: string) => String(x).toUpperCase(), describe: 'x => x.toUpperCase()' },
  { id: 'trim',        label: 'trim()',         fn: (x: string) => String(x).trim(),        describe: 'x => x.trim()' },
  { id: 'split',       label: "split(' ')",     fn: (x: string) => String(x).split(' '),    describe: "x => x.split(' ')" },
  { id: 'length',      label: 'length',         fn: (x: string | unknown[]) => (x as string | unknown[]).length, describe: 'x => x.length' },
  { id: 'double',      label: 'x * 2',          fn: (x: number) => Number(x) * 2,           describe: 'x => x * 2' },
  { id: 'reverse',     label: 'reverse()',      fn: (x: string) => String(x).split('').reverse().join(''), describe: 'x => x.split("").reverse().join("")' },
  { id: 'addBang',     label: 'add "!"',        fn: (x: unknown) => String(x) + '!',        describe: 'x => x + "!"' },
]

interface BoxStep {
  transformId: TransformId
  label: string
  describe: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderValue(v: any): string {
  if (Array.isArray(v)) return `[${v.map(String).join(', ')}]`
  if (typeof v === 'string') return `"${v}"`
  return String(v)
}

export function Task5_1_Solution() {
  const [inputVal, setInputVal] = useState('  hello world  ')
  const [steps, setSteps] = useState<BoxStep[]>([])
  const [folded, setFolded] = useState(false)

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
    padding: '0.3rem 0.7rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    marginRight: '0.4rem',
    marginBottom: '0.4rem',
  }
  const addBtn: React.CSSProperties = {
    ...btnStyle,
    background: '#1e3a5f',
    border: '1px solid #3b82f6',
    color: '#93c5fd',
  }
  const foldBtn: React.CSSProperties = {
    ...btnStyle,
    background: '#1c3a2e',
    border: '1px solid #10b981',
    color: '#6ee7b7',
  }
  const boxRect: React.CSSProperties = {
    display: 'inline-block',
    background: '#1e293b',
    border: '2px solid #6366f1',
    borderRadius: '10px',
    padding: '0.4rem 0.9rem',
    color: '#a5b4fc',
    fontSize: '0.85rem',
    verticalAlign: 'middle',
  }
  const arrow: React.CSSProperties = {
    display: 'inline-block',
    color: '#6b7280',
    margin: '0 0.4rem',
    verticalAlign: 'middle',
    fontSize: '1rem',
  }
  const mapLabel: React.CSSProperties = {
    display: 'inline-block',
    background: '#292524',
    border: '1px solid #78716c',
    borderRadius: '6px',
    padding: '0.2rem 0.5rem',
    color: '#d6d3d1',
    fontSize: '0.75rem',
    verticalAlign: 'middle',
  }

  const addStep = (id: TransformId) => {
    const def = TRANSFORMS.find(t => t.id === id)!
    setSteps(prev => [...prev, { transformId: id, label: def.label, describe: def.describe }])
    setFolded(false)
  }

  const removeStep = (i: number) => {
    setSteps(prev => prev.filter((_, idx) => idx !== i))
    setFolded(false)
  }

  // Build chain
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chain: Array<{ box: string; mapDesc?: string; value: any }> = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = inputVal
  chain.push({ box: `Box(${renderValue(current)})`, value: current })
  for (const step of steps) {
    const def = TRANSFORMS.find(t => t.id === step.transformId)!
    const next = def.fn(current)
    chain.push({ box: `Box(${renderValue(next)})`, mapDesc: step.describe, value: next })
    current = next
  }

  const finalValue = current
  const codeLines: string[] = [
    `Box.of(${renderValue(inputVal)})`,
    ...steps.map(s => `  .map(${s.describe})`),
    `  .fold(x => x)`,
  ]

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#c4b5fd', marginTop: 0 }}>Box: простейший функтор</h2>

      {/* Input */}
      <div style={panelStyle}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.4rem' }}>Начальное значение</div>
        <input
          value={inputVal}
          onChange={e => { setInputVal(e.target.value); setSteps([]); setFolded(false) }}
          style={{
            background: '#111827',
            color: '#e5e7eb',
            border: '1px solid #4b5563',
            borderRadius: '6px',
            padding: '0.4rem 0.7rem',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            width: '280px',
          }}
        />
      </div>

      {/* Transform palette */}
      <div style={panelStyle}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.6rem' }}>Добавить шаг .map()</div>
        {TRANSFORMS.map(t => (
          <button key={t.id} style={addBtn} onClick={() => addStep(t.id)}>{t.label}</button>
        ))}
      </div>

      {/* Chain visualization */}
      <div style={{ ...panelStyle, overflowX: 'auto' }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.8rem' }}>Цепочка преобразований</div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.3rem', minWidth: 'max-content' }}>
          {chain.map((node, idx) => (
            <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              {idx > 0 && (
                <>
                  <span style={arrow}>→</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                    <span style={mapLabel}>.map({chain[idx].mapDesc})</span>
                    <button
                      onClick={() => removeStep(idx - 1)}
                      style={{ ...btnStyle, padding: '0.1rem 0.4rem', marginRight: 0, marginBottom: 0, color: '#f87171', borderColor: '#7f1d1d' }}
                    >x</button>
                  </span>
                  <span style={arrow}>→</span>
                </>
              )}
              <span style={{ ...boxRect, borderColor: folded && idx === chain.length - 1 ? '#10b981' : '#6366f1' }}>
                {node.box}
              </span>
            </span>
          ))}
          {folded && (
            <>
              <span style={arrow}>→</span>
              <span style={mapLabel}>.fold(x =&gt; x)</span>
              <span style={arrow}>→</span>
              <span style={{
                display: 'inline-block',
                background: '#14532d',
                border: '2px solid #10b981',
                borderRadius: '10px',
                padding: '0.4rem 0.9rem',
                color: '#6ee7b7',
                fontSize: '0.85rem',
              }}>{renderValue(finalValue)}</span>
            </>
          )}
        </div>
        {steps.length > 0 && !folded && (
          <button style={{ ...foldBtn, marginTop: '0.8rem' }} onClick={() => setFolded(true)}>
            .fold(x =&gt; x) — извлечь значение
          </button>
        )}
      </div>

      {/* Code view */}
      <div style={panelStyle}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.4rem' }}>Эквивалентный код</div>
        <pre style={{ margin: 0, color: '#d1fae5', fontSize: '0.82rem', lineHeight: 1.6 }}>
          {codeLines.join('\n')}
          {folded ? `\n// => ${renderValue(finalValue)}` : ''}
        </pre>
      </div>

      {/* Box implementation */}
      <details style={{ ...panelStyle, cursor: 'pointer' }}>
        <summary style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Реализация Box</summary>
        <pre style={{ margin: '0.6rem 0 0', color: '#fde68a', fontSize: '0.78rem', lineHeight: 1.6 }}>{`class Box {
  constructor(value) { this._value = value }
  static of(value) { return new Box(value) }
  map(fn) { return new Box(fn(this._value)) }
  fold(fn) { return fn(this._value) }
  inspect() { return \`Box(\${this._value})\` }
}`}</pre>
      </details>
    </div>
  )
}

// ============================================
// Task 5.2 Solution: Functor Laws checker
// ============================================

// Good functor: Box
// Bad functor: breaks identity law by appending '!'
class BadFunctor<T> {
  constructor(readonly _value: T) {}
  static of<T>(v: T) { return new BadFunctor(v) }
  map<U>(fn: (x: T) => U): BadFunctor<string> {
    return new BadFunctor(String(fn(this._value)) + '!')
  }
  inspect() { return `BadFunctor(${String(this._value)})` }
}

type FunctorName = 'Box' | 'Array' | 'BadFunctor'

interface FnOption {
  id: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fn: (x: any) => any
}

const FN_OPTIONS: FnOption[] = [
  { id: 'addOne',    label: 'x + 1',          fn: (x: number) => x + 1 },
  { id: 'double',    label: 'x * 2',          fn: (x: number) => x * 2 },
  { id: 'toString',  label: 'String(x)',       fn: (x: unknown) => String(x) },
  { id: 'toUpper',   label: 'x.toUpperCase()', fn: (x: unknown) => String(x).toUpperCase() },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepEqual(a: any, b: any): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeInspect(name: FunctorName, v: any): string {
  if (name === 'Box') {
    const b = Box.of(v)
    return b.inspect()
  }
  if (name === 'Array') return JSON.stringify([v])
  if (name === 'BadFunctor') return new BadFunctor(v)._value !== undefined ? BadFunctor.of(v).inspect() : '?'
  return String(v)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function applyMap(name: FunctorName, value: any, fn: (x: any) => any): any {
  if (name === 'Box') return Box.of(value).map(fn).getValue()
  if (name === 'Array') return [value].map(fn)
  if (name === 'BadFunctor') return BadFunctor.of(value).map(fn)._value
  return fn(value)
}

export function Task5_2_Solution() {
  const [functorName, setFunctorName] = useState<FunctorName>('Box')
  const [fId, setFId] = useState('addOne')
  const [gId, setGId] = useState('double')
  const [seedVal, setSeedVal] = useState('5')

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
  const selectStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.3rem 0.5rem',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    marginLeft: '0.5rem',
  }
  const lawRow: React.CSSProperties = {
    background: '#1a2332',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '0.8rem',
  }

  const fOpt = FN_OPTIONS.find(o => o.id === fId)!
  const gOpt = FN_OPTIONS.find(o => o.id === gId)!
  const seed = isNaN(Number(seedVal)) ? 5 : Number(seedVal)

  // Law 1: identity  F.map(x => x) === F
  const law1Left = applyMap(functorName, seed, x => x)
  const law1Right = seed
  const law1Pass = deepEqual(law1Left, law1Right)

  // Law 2: composition  F.map(f).map(g) === F.map(x => g(f(x)))
  const law2Left = applyMap(functorName, applyMap(functorName, seed, fOpt.fn), gOpt.fn)
  const law2Right = applyMap(functorName, seed, x => gOpt.fn(fOpt.fn(x)))
  const law2Pass = deepEqual(law2Left, law2Right)

  const okStyle: React.CSSProperties = { color: '#6ee7b7', fontWeight: 600 }
  const failStyle: React.CSSProperties = { color: '#f87171', fontWeight: 600 }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#c4b5fd', marginTop: 0 }}>Законы функторов</h2>

      {/* Controls */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem', alignItems: 'center' }}>
          <label>
            Функтор:
            <select style={selectStyle} value={functorName} onChange={e => setFunctorName(e.target.value as FunctorName)}>
              <option value="Box">Box (правильный)</option>
              <option value="Array">Array (правильный)</option>
              <option value="BadFunctor">BadFunctor (сломанный)</option>
            </select>
          </label>
          <label>
            Начальное значение:
            <input
              style={{ ...selectStyle, width: '60px' }}
              value={seedVal}
              onChange={e => setSeedVal(e.target.value)}
            />
          </label>
          <label>
            f =
            <select style={selectStyle} value={fId} onChange={e => setFId(e.target.value)}>
              {FN_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
          <label>
            g =
            <select style={selectStyle} value={gId} onChange={e => setGId(e.target.value)}>
              {FN_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </label>
        </div>
        {functorName === 'BadFunctor' && (
          <div style={{ marginTop: '0.8rem', padding: '0.6rem', background: '#2d1b1b', borderRadius: '6px', fontSize: '0.78rem', color: '#fca5a5' }}>
            BadFunctor намеренно сломан: map(fn) возвращает BadFunctor(fn(value) + "!") — добавляет восклицательный знак к каждому результату.
          </div>
        )}
      </div>

      {/* Law 1: Identity */}
      <div style={lawRow}>
        <div style={{ fontSize: '0.9rem', color: '#c4b5fd', marginBottom: '0.6rem' }}>
          Закон 1 — Идентичность (Identity)
        </div>
        <pre style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.6rem' }}>
          {`F.map(x => x)  ===  F\n(применение identity-функции не меняет функтор)`}
        </pre>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ background: '#111827', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>Левая часть: {makeInspect(functorName, seed)}.map(x =&gt; x)</div>
            <span style={{ color: '#fde68a' }}>{JSON.stringify(law1Left)}</span>
          </div>
          <div style={{ background: '#111827', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>Правая часть: {makeInspect(functorName, seed)} (без изменений)</div>
            <span style={{ color: '#fde68a' }}>{JSON.stringify(law1Right)}</span>
          </div>
        </div>
        <div style={{ marginTop: '0.6rem' }}>
          {law1Pass
            ? <span style={okStyle}>Закон выполняется</span>
            : <span style={failStyle}>Закон нарушен — map(x =&gt; x) изменил значение!</span>}
        </div>
      </div>

      {/* Law 2: Composition */}
      <div style={lawRow}>
        <div style={{ fontSize: '0.9rem', color: '#c4b5fd', marginBottom: '0.6rem' }}>
          Закон 2 — Композиция (Composition)
        </div>
        <pre style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.6rem' }}>
          {`F.map(f).map(g)  ===  F.map(x => g(f(x)))\n(два map = один map с g∘f)`}
        </pre>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ background: '#111827', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>
              Левая: F.map({fOpt.label}).map({gOpt.label})
            </div>
            <span style={{ color: '#fde68a' }}>{JSON.stringify(law2Left)}</span>
          </div>
          <div style={{ background: '#111827', borderRadius: '6px', padding: '0.6rem 0.9rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.3rem' }}>
              Правая: F.map(x =&gt; {gOpt.label.replace('x', `(${fOpt.label.replace('x', 'x')})`)})
            </div>
            <span style={{ color: '#fde68a' }}>{JSON.stringify(law2Right)}</span>
          </div>
        </div>
        <div style={{ marginTop: '0.6rem' }}>
          {law2Pass
            ? <span style={okStyle}>Закон выполняется</span>
            : <span style={failStyle}>Закон нарушен — два .map() дают другой результат, чем один!</span>}
        </div>
      </div>

      {/* Summary */}
      <div style={{ ...panelStyle, borderLeft: `3px solid ${(law1Pass && law2Pass) ? '#10b981' : '#ef4444'}` }}>
        <span style={(law1Pass && law2Pass) ? okStyle : failStyle}>
          {(law1Pass && law2Pass)
            ? `${functorName} является корректным функтором — оба закона выполняются.`
            : `${functorName} НЕ является функтором — законы нарушены.`}
        </span>
      </div>
    </div>
  )
}

// ============================================
// Task 5.3 Solution: Practical functors
// ============================================

// --- Lazy functor ---
class Lazy<T> {
  private constructor(private readonly thunk: () => T) {}

  static of<T>(thunk: () => T): Lazy<T> {
    return new Lazy(thunk)
  }

  map<U>(fn: (value: T) => U): Lazy<U> {
    return new Lazy(() => fn(this.thunk()))
  }

  run(): T {
    return this.thunk()
  }
}

// --- Validated functor ---
interface ValidatedData<T> {
  isValid: boolean
  value: T
  errors: string[]
}

class Validated<T> {
  private constructor(readonly data: ValidatedData<T>) {}

  static of<T>(value: T): Validated<T> {
    return new Validated({ isValid: true, value, errors: [] })
  }

  static invalid<T>(value: T, errors: string[]): Validated<T> {
    return new Validated({ isValid: false, value, errors })
  }

  map<U>(fn: (value: T) => U): Validated<U> {
    if (!this.data.isValid) {
      return new Validated<U>({ isValid: false, value: fn(this.data.value), errors: this.data.errors })
    }
    return new Validated<U>({ isValid: true, value: fn(this.data.value), errors: [] })
  }

  validate(predicate: (v: T) => boolean, errorMsg: string): Validated<T> {
    if (!this.data.isValid) return this
    if (!predicate(this.data.value)) {
      return new Validated<T>({ isValid: false, value: this.data.value, errors: [errorMsg] })
    }
    return this
  }
}

// --- EventMapper functor ---
interface EventPayload {
  type: string
  x: number
  y: number
  timestamp: number
  [key: string]: unknown
}

class EventMapper<T> {
  private constructor(readonly payload: T) {}

  static of<T>(payload: T): EventMapper<T> {
    return new EventMapper(payload)
  }

  map<U>(fn: (payload: T) => U): EventMapper<U> {
    return new EventMapper(fn(this.payload))
  }
}

export function Task5_3_Solution() {
  // Lazy state
  const [lazyRan, setLazyRan] = useState(false)
  const [lazyResult, setLazyResult] = useState<string>('')

  // Validated state
  const [emailInput, setEmailInput] = useState('  User@Example.COM  ')
  const [validationRan, setValidationRan] = useState(false)

  // EventMapper state
  const [events, setEvents] = useState<Array<{ raw: EventPayload; mapped: { x: number; y: number; norm: number } }>>([])

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
    padding: '0.35rem 0.8rem',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontFamily: 'monospace',
    marginRight: '0.5rem',
  }
  const headingStyle: React.CSSProperties = {
    color: '#c4b5fd',
    fontSize: '1rem',
    margin: '0 0 0.7rem',
  }
  const labelStyle: React.CSSProperties = {
    fontSize: '0.72rem',
    color: '#6b7280',
    marginBottom: '0.3rem',
  }

  // --- Lazy demo ---
  const runLazy = () => {
    const lazy = Lazy.of(() => 'raw data from "server"')
      .map(s => s.toUpperCase())
      .map(s => s.replace(/"/g, '').trim())
      .map(s => `[PROCESSED] ${s}`)
    setLazyResult(lazy.run())
    setLazyRan(true)
  }

  // --- Validated demo ---
  const runValidation = () => setValidationRan(true)

  const getValidationResult = () => {
    return Validated.of(emailInput)
      .map(s => s.trim())
      .validate(s => s.length > 0, 'Email не может быть пустым')
      .validate(s => s.includes('@'), 'Email должен содержать @')
      .validate(s => s.includes('.'), 'Email должен содержать точку')
      .map(s => s.toLowerCase())
  }

  // --- EventMapper demo ---
  const generateEvent = () => {
    const raw: EventPayload = {
      type: 'click',
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 600),
      timestamp: Date.now(),
    }
    const result = EventMapper.of(raw)
      .map(e => ({ ...e, x: e.x - 400, y: e.y - 300 }))   // center coords
      .map(e => ({ x: e.x, y: e.y, norm: Math.sqrt(e.x * e.x + e.y * e.y) | 0 }))
    setEvents(prev => [{ raw, mapped: result.payload }, ...prev.slice(0, 4)])
  }

  const vResult = validationRan ? getValidationResult() : null

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#c4b5fd', marginTop: 0 }}>Практические функторы</h2>

      {/* Lazy */}
      <div style={panelStyle}>
        <h3 style={headingStyle}>1. Lazy — отложенные вычисления</h3>
        <pre style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.7rem', lineHeight: 1.6 }}>
{`const lazy = Lazy.of(() => 'raw data from "server"')
  .map(s => s.toUpperCase())
  .map(s => s.replace(/"/g, '').trim())
  .map(s => \`[PROCESSED] \${s}\`)
// Ничего не выполнено — только построена цепочка!
lazy.run()  // => выполняется здесь`}
        </pre>
        {!lazyRan
          ? <div style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '0.6rem' }}>Вычисление отложено — run() ещё не вызван</div>
          : <div style={{ color: '#6ee7b7', fontSize: '0.88rem', marginBottom: '0.6rem' }}>Результат: {lazyResult}</div>}
        <button style={btnStyle} onClick={runLazy}>lazy.run()</button>
        {lazyRan && <button style={{ ...btnStyle, color: '#9ca3af' }} onClick={() => setLazyRan(false)}>Сбросить</button>}
      </div>

      {/* Validated */}
      <div style={panelStyle}>
        <h3 style={headingStyle}>2. Validated — функтор-валидатор</h3>
        <pre style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.7rem', lineHeight: 1.6 }}>
{`Validated.of(input)
  .map(s => s.trim())         // map только если isValid
  .validate(s => s.includes('@'), 'нет @')
  .validate(s => s.includes('.'), 'нет .')
  .map(s => s.toLowerCase())  // если невалидно — map пропускается`}
        </pre>
        <div style={{ marginBottom: '0.6rem' }}>
          <div style={labelStyle}>Email для проверки</div>
          <input
            value={emailInput}
            onChange={e => { setEmailInput(e.target.value); setValidationRan(false) }}
            style={{
              background: '#111827',
              color: '#e5e7eb',
              border: '1px solid #4b5563',
              borderRadius: '6px',
              padding: '0.35rem 0.6rem',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              width: '260px',
            }}
          />
        </div>
        <button style={btnStyle} onClick={runValidation}>Валидировать</button>
        {vResult && (
          <div style={{
            marginTop: '0.7rem',
            padding: '0.6rem 0.9rem',
            background: '#111827',
            borderRadius: '6px',
            borderLeft: `3px solid ${vResult.data.isValid ? '#10b981' : '#ef4444'}`,
          }}>
            <div style={{ fontSize: '0.8rem' }}>
              <span style={{ color: vResult.data.isValid ? '#6ee7b7' : '#f87171' }}>
                {vResult.data.isValid ? 'Валидно' : 'Невалидно'}
              </span>
            </div>
            {vResult.data.isValid && (
              <div style={{ color: '#d1fae5', fontSize: '0.82rem', marginTop: '0.3rem' }}>
                Результат: "{String(vResult.data.value)}"
              </div>
            )}
            {!vResult.data.isValid && vResult.data.errors.map((e, i) => (
              <div key={i} style={{ color: '#fca5a5', fontSize: '0.78rem', marginTop: '0.2rem' }}>{e}</div>
            ))}
          </div>
        )}
      </div>

      {/* EventMapper */}
      <div style={panelStyle}>
        <h3 style={headingStyle}>3. EventMapper — трансформация событий</h3>
        <pre style={{ fontSize: '0.78rem', color: '#9ca3af', margin: '0 0 0.7rem', lineHeight: 1.6 }}>
{`EventMapper.of({ type: 'click', x, y, timestamp })
  .map(e => ({ ...e, x: e.x - 400, y: e.y - 300 }))  // центрировать
  .map(e => ({ x: e.x, y: e.y, norm: sqrt(x²+y²) })) // нормализовать`}
        </pre>
        <button style={{ ...btnStyle, border: '1px solid #6366f1', color: '#a5b4fc' }} onClick={generateEvent}>
          Сгенерировать событие
        </button>
        {events.length > 0 && (
          <div style={{ marginTop: '0.7rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
              <thead>
                <tr style={{ color: '#6b7280', borderBottom: '1px solid #374151' }}>
                  <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>Исходный x</th>
                  <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>Исходный y</th>
                  <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>После map: x</th>
                  <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>После map: y</th>
                  <th style={{ textAlign: 'left', padding: '0.3rem 0.5rem' }}>norm</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #1f2937', color: i === 0 ? '#fde68a' : '#d1d5db' }}>
                    <td style={{ padding: '0.3rem 0.5rem' }}>{ev.raw.x}</td>
                    <td style={{ padding: '0.3rem 0.5rem' }}>{ev.raw.y}</td>
                    <td style={{ padding: '0.3rem 0.5rem' }}>{ev.mapped.x}</td>
                    <td style={{ padding: '0.3rem 0.5rem' }}>{ev.mapped.y}</td>
                    <td style={{ padding: '0.3rem 0.5rem' }}>{ev.mapped.norm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
