import { useState, useCallback } from 'react'

// ============================================
// Task 2.1 Solution: map / filter / reduce pipeline visualizer
// ============================================

interface Product {
  name: string
  price: number
  category: string
}

const PRODUCTS: Product[] = [
  { name: 'Laptop', price: 1200, category: 'electronics' },
  { name: 'Book: Clean Code', price: 25, category: 'education' },
  { name: 'Headphones', price: 280, category: 'electronics' },
  { name: 'Online Course', price: 49, category: 'education' },
  { name: 'Keyboard', price: 150, category: 'electronics' },
  { name: 'Notebook', price: 8, category: 'office' },
  { name: 'Monitor', price: 450, category: 'electronics' },
  { name: 'Pen Set', price: 12, category: 'office' },
]

export function Task2_1_Solution() {
  const [minPrice, setMinPrice] = useState(50)
  const [discount, setDiscount] = useState(10)

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

  const stageHeaderStyle = (color: string): React.CSSProperties => ({
    color,
    fontWeight: 'bold',
    fontSize: '0.95rem',
    marginBottom: '0.75rem',
    borderBottom: `1px solid ${color}33`,
    paddingBottom: '0.4rem',
  })

  // Stage 1: filter
  const filtered = PRODUCTS.filter(p => p.price >= minPrice)

  // Stage 2: map (apply discount)
  const discountFactor = 1 - discount / 100
  const mapped = filtered.map(p => ({
    ...p,
    originalPrice: p.price,
    price: Math.round(p.price * discountFactor),
  }))

  // Stage 3: reduce (sum)
  const total = mapped.reduce((acc, p) => acc + p.price, 0)

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#3b82f6',
    cursor: 'pointer',
  }

  const labelStyle: React.CSSProperties = {
    color: '#9ca3af',
    fontSize: '0.85rem',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.4rem',
  }

  const tagStyle = (passed: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '0.25rem 0.6rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    margin: '0.2rem',
    background: passed ? '#052e16' : '#1f2937',
    border: `1px solid ${passed ? '#10b981' : '#374151'}`,
    color: passed ? '#6ee7b7' : '#6b7280',
    textDecoration: passed ? 'none' : 'line-through',
    opacity: passed ? 1 : 0.5,
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 2.1 — Pipeline: filter → map → reduce</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Три ползунка управляют параметрами пайплайна. Каждый этап обновляется реактивно.
      </p>

      {/* Controls */}
      <div style={{ ...panelStyle, display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={labelStyle}>
            <span>Мин. цена (filter)</span>
            <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>${minPrice}</span>
          </div>
          <input type="range" min={0} max={1000} step={10} value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={sliderStyle} />
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={labelStyle}>
            <span>Скидка (map)</span>
            <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>{discount}%</span>
          </div>
          <input type="range" min={0} max={50} step={5} value={discount} onChange={e => setDiscount(Number(e.target.value))} style={sliderStyle} />
        </div>
      </div>

      {/* Stage 1: filter */}
      <div style={panelStyle}>
        <div style={stageHeaderStyle('#3b82f6')}>
          Stage 1 — filter(p =&gt; p.price &gt;= {minPrice})
          <span style={{ marginLeft: '1rem', fontWeight: 'normal', fontSize: '0.8rem', color: '#9ca3af' }}>
            прошло {filtered.length} из {PRODUCTS.length}
          </span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem' }}>
          {PRODUCTS.map(p => {
            const passed = p.price >= minPrice
            return (
              <span key={p.name} style={tagStyle(passed)}>
                {p.name} ${p.price}
              </span>
            )
          })}
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#6b7280' }}>
          <code style={{ color: '#93c5fd' }}>PRODUCTS.filter(p =&gt; p.price &gt;= {minPrice})</code>
        </div>
      </div>

      {/* Stage 2: map */}
      <div style={panelStyle}>
        <div style={stageHeaderStyle('#a78bfa')}>
          Stage 2 — map(p =&gt; apply {discount}% discount)
          <span style={{ marginLeft: '1rem', fontWeight: 'normal', fontSize: '0.8rem', color: '#9ca3af' }}>
            {filtered.length} элементов трансформировано
          </span>
        </div>
        {mapped.length === 0 ? (
          <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>Нет элементов после filter</div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {mapped.map(p => (
              <div key={p.name} style={{
                background: '#0d1117',
                border: '1px solid #374151',
                borderRadius: '6px',
                padding: '0.4rem 0.7rem',
                fontSize: '0.8rem',
              }}>
                <div style={{ color: '#e5e7eb' }}>{p.name}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <span style={{ color: '#6b7280', textDecoration: 'line-through' }}>${p.originalPrice}</span>
                  <span style={{ color: '#6ee7b7', fontWeight: 'bold' }}>${p.price}</span>
                  {discount > 0 && (
                    <span style={{ color: '#a78bfa', fontSize: '0.72rem' }}>-{discount}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#6b7280' }}>
          <code style={{ color: '#c4b5fd' }}>.map(p =&gt; {'({ ...p, price: Math.round(p.price * ' + discountFactor.toFixed(2) + ') })'})</code>
        </div>
      </div>

      {/* Stage 3: reduce */}
      <div style={panelStyle}>
        <div style={stageHeaderStyle('#10b981')}>
          Stage 3 — reduce((acc, p) =&gt; acc + p.price, 0)
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981' }}>
            ${total}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#9ca3af', flex: 1 }}>
            {mapped.length === 0 ? (
              'Нет элементов для суммирования'
            ) : (
              <>
                {mapped.map((p, i) => (
                  <span key={p.name}>
                    {i > 0 && <span style={{ color: '#6b7280' }}> + </span>}
                    <span style={{ color: '#a5f3fc' }}>{p.price}</span>
                  </span>
                ))}
                <span style={{ color: '#6b7280' }}> = </span>
                <span style={{ color: '#10b981', fontWeight: 'bold' }}>{total}</span>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#6b7280' }}>
          <code style={{ color: '#6ee7b7' }}>.reduce((acc, p) =&gt; acc + p.price, 0)</code>
        </div>
      </div>

      {/* Summary code */}
      <div style={{ ...panelStyle, marginBottom: 0 }}>
        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '0.4rem' }}>Итоговый пайплайн:</div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.78rem', color: '#e5e7eb', margin: 0, overflowX: 'auto' }}>
{`const total = PRODUCTS
  .filter(p => p.price >= ${minPrice})          // ${filtered.length} items
  .map(p => ({ ...p, price: Math.round(p.price * ${discountFactor.toFixed(2)}) }))   // -${discount}%
  .reduce((acc, p) => acc + p.price, 0)  // = ${total}`}
        </pre>
      </div>
    </div>
  )
}

// ============================================
// Task 2.2 Solution: createValidator HOF
// ============================================

type Rule = {
  id: string
  label: string
  check: (v: string) => boolean
  message: string
}

const ALL_RULES: Rule[] = [
  {
    id: 'minLength',
    label: 'Мин. длина 3',
    check: v => v.length >= 3,
    message: 'Минимум 3 символа',
  },
  {
    id: 'maxLength',
    label: 'Макс. длина 20',
    check: v => v.length <= 20,
    message: 'Максимум 20 символов',
  },
  {
    id: 'noSpaces',
    label: 'Без пробелов',
    check: v => !v.includes(' '),
    message: 'Пробелы не допускаются',
  },
  {
    id: 'hasUpperCase',
    label: 'Есть заглавная',
    check: v => /[A-Z]/.test(v),
    message: 'Нужна хотя бы одна заглавная буква',
  },
  {
    id: 'hasDigit',
    label: 'Есть цифра',
    check: v => /[0-9]/.test(v),
    message: 'Нужна хотя бы одна цифра',
  },
]

// The HOF — accepts rules array, returns validator function
function createValidator(rules: Rule[]): (value: string) => string[] {
  return (value: string) => {
    return rules
      .filter(rule => !rule.check(value))
      .map(rule => rule.message)
  }
}

export function Task2_2_Solution() {
  const [inputValue, setInputValue] = useState('hello')
  const [activeRuleIds, setActiveRuleIds] = useState<Set<string>>(
    new Set(['minLength', 'maxLength', 'noSpaces', 'hasUpperCase', 'hasDigit'])
  )

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

  const toggleRule = (id: string) => {
    setActiveRuleIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const activeRules = ALL_RULES.filter(r => activeRuleIds.has(r.id))
  const validate = useCallback(createValidator(activeRules), [activeRuleIds])
  const errors = validate(inputValue)
  const isValid = errors.length === 0

  const configCode = `const validate = createValidator([
${activeRules.map(r => `  { check: ${r.id}, message: '${r.message}' },`).join('\n')}
])`

  const hofCode = `function createValidator(rules) {
  // Возвращаем новую функцию — это HOF
  return (value) => {
    return rules
      .filter(rule => !rule.check(value))
      .map(rule => rule.message)
  }
}`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 2.2 — createValidator: HOF в действии</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        <code style={{ color: '#a5f3fc' }}>createValidator</code> принимает массив правил и возвращает функцию-валидатор.
        Включайте/выключайте правила и наблюдайте как меняется поведение.
      </p>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Left: controls */}
        <div style={{ flex: 1, minWidth: '260px' }}>

          {/* Rule checkboxes */}
          <div style={panelStyle}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.75rem' }}>Активные правила:</div>
            {ALL_RULES.map(rule => (
              <label
                key={rule.id}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={activeRuleIds.has(rule.id)}
                  onChange={() => toggleRule(rule.id)}
                  style={{ accentColor: '#3b82f6', width: '14px', height: '14px' }}
                />
                <span style={{ fontSize: '0.85rem', color: activeRuleIds.has(rule.id) ? '#e5e7eb' : '#6b7280' }}>
                  {rule.label}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#4b5563', marginLeft: 'auto' }}>
                  {activeRuleIds.has(rule.id)
                    ? (rule.check(inputValue) ? <span style={{ color: '#10b981' }}>OK</span> : <span style={{ color: '#ef4444' }}>fail</span>)
                    : '—'
                  }
                </span>
              </label>
            ))}
          </div>

          {/* Input */}
          <div style={panelStyle}>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Значение для валидации:</div>
            <input
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              style={{
                width: '100%',
                background: '#0d1117',
                border: `1px solid ${isValid ? '#10b981' : '#ef4444'}`,
                borderRadius: '6px',
                padding: '0.5rem 0.75rem',
                color: '#e5e7eb',
                fontSize: '0.9rem',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              placeholder="Введите значение..."
            />
            <div style={{ marginTop: '0.75rem' }}>
              {isValid ? (
                <div style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', background: '#052e16', border: '1px solid #10b981', color: '#6ee7b7', fontSize: '0.85rem' }}>
                  Все проверки пройдены
                </div>
              ) : (
                <div>
                  {errors.map((err, i) => (
                    <div key={i} style={{ padding: '0.3rem 0.6rem', marginBottom: '0.3rem', borderRadius: '4px', background: '#450a0a', border: '1px solid #ef444444', color: '#fca5a5', fontSize: '0.82rem' }}>
                      {err}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: code */}
        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ ...panelStyle, marginBottom: '1rem' }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Реализация HOF:</div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#6ee7b7', margin: 0, overflowX: 'auto' }}>
              {hofCode}
            </pre>
          </div>
          <div style={panelStyle}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Текущая конфигурация:</div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#a5f3fc', margin: 0, overflowX: 'auto' }}>
              {configCode}
            </pre>
          </div>
          <div style={{ ...panelStyle, marginBottom: 0 }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.4rem' }}>Результат вызова:</div>
            <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: isValid ? '#6ee7b7' : '#fca5a5', margin: 0, overflowX: 'auto' }}>
              {`validate('${inputValue}')\n// => ${JSON.stringify(errors, null, 2)}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 2.3 Solution: Closures — counter + rate limiter
// ============================================

// --- createCounter ---
interface Counter {
  increment: () => void
  decrement: () => void
  reset: () => void
  getCount: () => number
}

function createCounter(initial: number): Counter {
  let count = initial   // private state in closure

  return {
    increment: () => { count++ },
    decrement: () => { count-- },
    reset: () => { count = initial },
    getCount: () => count,
  }
}

// --- createRateLimiter ---
interface CallEntry {
  ts: number
  allowed: boolean
}

function createRateLimiter(maxCalls: number, windowMs: number) {
  return function <T>(fn: () => T): { call: () => { result: T | null; allowed: boolean } } {
    const calls: number[] = []  // private state in closure

    return {
      call: () => {
        const now = Date.now()
        // Remove calls outside the window
        while (calls.length > 0 && now - calls[0] > windowMs) {
          calls.shift()
        }
        if (calls.length < maxCalls) {
          calls.push(now)
          return { result: fn(), allowed: true }
        }
        return { result: null, allowed: false }
      },
    }
  }
}

export function Task2_3_Solution() {
  // Counter state — we hold the counts in React state because counter's internal state
  // changes on each call but we need to re-render
  const [counterA, setCounterA] = useState(() => createCounter(0))
  const [counterACount, setCounterACount] = useState(0)
  const [counterB, setCounterB] = useState(() => createCounter(10))
  const [counterBCount, setCounterBCount] = useState(10)

  // Rate limiter state
  const [maxCalls, setMaxCalls] = useState(3)
  const [windowMs, setWindowMs] = useState(2000)
  const [callLog, setCallLog] = useState<CallEntry[]>([])
  const [rateLimiterInstance, setRateLimiterInstance] = useState(() =>
    createRateLimiter(3, 2000)(() => 'API response')
  )

  const resetLimiter = (newMax: number, newWindow: number) => {
    setRateLimiterInstance(createRateLimiter(newMax, newWindow)(() => 'API response'))
    setCallLog([])
  }

  const doApiCall = () => {
    const { allowed } = rateLimiterInstance.call()
    const entry: CallEntry = { ts: Date.now(), allowed }
    setCallLog(prev => [...prev.slice(-19), entry])
  }

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

  const btnStyle = (color: string): React.CSSProperties => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.85rem',
    marginRight: '0.4rem',
  })

  const counterCard = (
    label: string,
    count: number,
    onIncrement: () => void,
    onDecrement: () => void,
    onReset: () => void,
    initial: number
  ) => (
    <div style={{ ...panelStyle, flex: 1, minWidth: '200px', marginBottom: 0 }}>
      <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
        {label} <span style={{ color: '#4b5563' }}>(initial: {initial})</span>
      </div>
      <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#a5f3fc', textAlign: 'center', margin: '0.5rem 0' }}>
        {count}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem' }}>
        <button style={btnStyle('#3b82f6')} onClick={onDecrement}>-</button>
        <button style={btnStyle('#3b82f6')} onClick={onIncrement}>+</button>
        <button style={btnStyle('#374151')} onClick={onReset}>Reset</button>
      </div>
    </div>
  )

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#3b82f6',
    cursor: 'pointer',
  }

  const now = Date.now()
  const recentAllowed = callLog.filter(e => e.allowed && now - e.ts <= windowMs).length

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 2.3 — Замыкания и приватное состояние</h2>

      {/* Section 1: counter */}
      <div style={{ ...panelStyle, marginBottom: '1.5rem' }}>
        <div style={{ fontWeight: 'bold', color: '#a78bfa', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          Пример 1: createCounter — два независимых экземпляра
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {counterCard(
            'counterA = createCounter(0)',
            counterACount,
            () => { counterA.increment(); setCounterACount(counterA.getCount()) },
            () => { counterA.decrement(); setCounterACount(counterA.getCount()) },
            () => { counterA.reset(); setCounterACount(counterA.getCount()) },
            0
          )}
          {counterCard(
            'counterB = createCounter(10)',
            counterBCount,
            () => { counterB.increment(); setCounterBCount(counterB.getCount()) },
            () => { counterB.decrement(); setCounterBCount(counterB.getCount()) },
            () => { counterB.reset(); setCounterBCount(counterB.getCount()) },
            10
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ padding: '0.3rem 0.75rem', borderRadius: '4px', background: '#0d1117', fontSize: '0.78rem', color: '#9ca3af' }}>
            counterA.count и counterB.count хранятся в разных замыканиях — они полностью изолированы
          </div>
        </div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#c4b5fd', margin: '0.75rem 0 0', overflowX: 'auto' }}>
{`function createCounter(initial) {
  let count = initial   // приватная переменная в замыкании

  return {
    increment: () => { count++ },   // обращается к count через замыкание
    decrement: () => { count-- },
    reset:     () => { count = initial },
    getCount:  () => count,
  }
}

const counterA = createCounter(0)   // своё замыкание, свой count
const counterB = createCounter(10)  // другое замыкание, другой count`}
        </pre>
      </div>

      {/* Section 2: rate limiter */}
      <div style={panelStyle}>
        <div style={{ fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
          Пример 2: createRateLimiter — замыкание для защиты API
        </div>

        {/* Settings */}
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
              <span>Макс. вызовов</span>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{maxCalls}</span>
            </div>
            <input
              type="range" min={1} max={10} step={1} value={maxCalls}
              onChange={e => {
                const v = Number(e.target.value)
                setMaxCalls(v)
                resetLimiter(v, windowMs)
              }}
              style={sliderStyle}
            />
          </div>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#9ca3af', marginBottom: '0.3rem' }}>
              <span>Окно (ms)</span>
              <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{windowMs}ms</span>
            </div>
            <input
              type="range" min={1000} max={5000} step={500} value={windowMs}
              onChange={e => {
                const v = Number(e.target.value)
                setWindowMs(v)
                resetLimiter(maxCalls, v)
              }}
              style={sliderStyle}
            />
          </div>
        </div>

        {/* Call button + log */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              style={{ ...btnStyle('#3b82f6'), padding: '0.6rem 1.5rem', fontSize: '0.9rem', marginRight: 0 }}
              onClick={doApiCall}
            >
              API Call
            </button>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'center' }}>
              {recentAllowed}/{maxCalls} в окне {windowMs}ms
            </div>
            <button
              style={{ ...btnStyle('#374151'), padding: '0.3rem 0.8rem', fontSize: '0.78rem', marginRight: 0 }}
              onClick={() => { resetLimiter(maxCalls, windowMs); setCallLog([]) }}
            >
              Сбросить лог
            </button>
          </div>

          {/* Log */}
          <div style={{ flex: 1, minWidth: '200px', maxHeight: '160px', overflowY: 'auto' }}>
            {callLog.length === 0 ? (
              <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>Нажмите "API Call" несколько раз подряд</div>
            ) : (
              [...callLog].reverse().map((entry, i) => (
                <div key={i} style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                  padding: '0.2rem 0',
                  borderBottom: '1px solid #374151',
                  fontSize: '0.8rem',
                }}>
                  <span style={{
                    width: '60px',
                    padding: '0.15rem 0.4rem',
                    borderRadius: '4px',
                    textAlign: 'center',
                    background: entry.allowed ? '#052e16' : '#450a0a',
                    color: entry.allowed ? '#6ee7b7' : '#fca5a5',
                    fontSize: '0.72rem',
                    fontWeight: 'bold',
                  }}>
                    {entry.allowed ? 'PASS' : 'BLOCK'}
                  </span>
                  <span style={{ color: '#6b7280' }}>
                    {new Date(entry.ts).toLocaleTimeString('ru-RU', { hour12: false })}
                    .{String(entry.ts % 1000).padStart(3, '0')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#fde68a', margin: '1rem 0 0', overflowX: 'auto' }}>
{`function createRateLimiter(maxCalls, windowMs) {
  return (fn) => {
    const calls = []  // приватный массив в замыкании

    return {
      call: () => {
        const now = Date.now()
        // Убираем вызовы вышедшие за окно
        while (calls.length > 0 && now - calls[0] > windowMs) {
          calls.shift()
        }
        if (calls.length < maxCalls) {
          calls.push(now)
          return { result: fn(), allowed: true }
        }
        return { result: null, allowed: false }
      },
    }
  }
}

// calls[] живёт в замыкании — снаружи недоступен
const limited = createRateLimiter(${maxCalls}, ${windowMs})(fetchData)`}
        </pre>
      </div>
    </div>
  )
}
