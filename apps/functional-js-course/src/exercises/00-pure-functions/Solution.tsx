import { useState } from 'react'

// ============================================
// Task 0.1 Solution: Pure vs Impure Function
// ============================================

// Pure function: same input always yields same output, no side effects
function calculateTotal(items: Array<{ price: number; qty: number }>): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0)
}

// Impure version: reads and mutates external state
let globalDiscount = 0

function calculateTotalImpure(items: Array<{ price: number; qty: number }>): number {
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0)
  globalDiscount += 5 // mutation of external state
  return total - globalDiscount
}

const DEMO_ITEMS = [
  { price: 100, qty: 2 },
  { price: 50, qty: 3 },
]

export function Task0_1_Solution() {
  const [pureResults, setPureResults] = useState<number[]>([])
  const [impureResults, setImpureResults] = useState<number[]>([])
  const [ran, setRan] = useState(false)

  const runBoth = () => {
    globalDiscount = 0
    const pure: number[] = []
    const impure: number[] = []
    for (let i = 0; i < 5; i++) {
      pure.push(calculateTotal(DEMO_ITEMS))
      impure.push(calculateTotalImpure(DEMO_ITEMS))
    }
    setPureResults(pure)
    setImpureResults(impure)
    setRan(true)
  }

  const allSame = (arr: number[]) => arr.every((v) => v === arr[0])

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
    flex: 1,
  }

  const btnStyle: React.CSSProperties = {
    background: '#3b82f6',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.6rem 1.4rem',
    cursor: 'pointer',
    fontSize: '0.95rem',
    marginBottom: '1rem',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 0.1 — Чистая vs нечистая функция</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {/* Pure panel */}
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#10b981', fontSize: '1rem' }}>
            Чистая функция
          </h3>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#a5f3fc', overflowX: 'auto' }}>
{`function calculateTotal(items) {
  return items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  )
}`}
          </pre>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0.5rem 0 0' }}>
            Только аргументы, никакого внешнего состояния
          </p>
        </div>

        {/* Impure panel */}
        <div style={panelStyle}>
          <h3 style={{ margin: '0 0 0.5rem', color: '#ef4444', fontSize: '1rem' }}>
            Нечистая функция
          </h3>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.8rem', color: '#fca5a5', overflowX: 'auto' }}>
{`let globalDiscount = 0

function calculateTotalImpure(items) {
  const total = items.reduce(...)
  globalDiscount += 5 // мутация!
  return total - globalDiscount
}`}
          </pre>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0.5rem 0 0' }}>
            Читает и мутирует globalDiscount
          </p>
        </div>
      </div>

      <button style={btnStyle} onClick={runBoth}>
        Запустить 5 раз с одними и теми же данными
      </button>

      {ran && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ ...panelStyle, flex: 1 }}>
            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Результаты чистой функции
            </div>
            {pureResults.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#10b981' }}>&#10003;</span>
                <span style={{ color: '#e5e7eb' }}>
                  Запуск {i + 1}: {v}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: allSame(pureResults) ? '#10b981' : '#ef4444' }}>
              {allSame(pureResults) ? 'Все результаты одинаковые — предсказуемо' : 'Результаты разные'}
            </div>
          </div>

          <div style={{ ...panelStyle, flex: 1 }}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>
              Результаты нечистой функции
            </div>
            {impureResults.map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span style={{ color: '#ef4444' }}>&#10007;</span>
                <span style={{ color: '#e5e7eb' }}>
                  Запуск {i + 1}: {v}
                </span>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: allSame(impureResults) ? '#10b981' : '#ef4444' }}>
              {allSame(impureResults) ? 'Все результаты одинаковые' : 'Результаты разные — непредсказуемо'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 0.2 Solution: Side Effect Detector
// ============================================

interface CardDef {
  id: number
  code: string
  isPure: boolean
  explanation: string
}

const CARDS: CardDef[] = [
  {
    id: 1,
    code: '(x) => x * 2',
    isPure: true,
    explanation: 'Только математика над аргументом — никаких эффектов, всегда одинаковый результат.',
  },
  {
    id: 2,
    code: '(x) => { arr.push(x); return x }',
    isPure: false,
    explanation: 'Мутирует внешний массив arr — это побочный эффект.',
  },
  {
    id: 3,
    code: '() => Math.random()',
    isPure: false,
    explanation: 'Каждый вызов возвращает разное число — недетерминированность.',
  },
  {
    id: 4,
    code: '(x) => console.log(x)',
    isPure: false,
    explanation: 'Запись в консоль — это наблюдаемый побочный эффект.',
  },
  {
    id: 5,
    code: '(a, b) => a + b',
    isPure: true,
    explanation: 'Чистая арифметика: одни аргументы — один результат, всегда.',
  },
  {
    id: 6,
    code: '() => new Date().getTime()',
    isPure: false,
    explanation: 'Зависит от текущего времени — результат меняется при каждом вызове.',
  },
  {
    id: 7,
    code: '(obj) => ({ ...obj, done: true })',
    isPure: true,
    explanation: 'Создаёт новый объект через spread — оригинал не тронут, результат предсказуем.',
  },
  {
    id: 8,
    code: '(arr) => arr.sort()',
    isPure: false,
    explanation: 'Array.sort мутирует входной массив на месте — это побочный эффект.',
  },
]

export function Task0_2_Solution() {
  const [guesses, setGuesses] = useState<Record<number, boolean>>({})
  const [checked, setChecked] = useState(false)

  const toggle = (id: number) => {
    if (checked) return
    setGuesses((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const check = () => setChecked(true)
  const reset = () => {
    setGuesses({})
    setChecked(false)
  }

  const containerStyle: React.CSSProperties = {
    background: '#111827',
    color: '#e5e7eb',
    padding: '1.5rem',
    borderRadius: '12px',
    fontFamily: 'monospace',
  }

  const btnStyle = (variant: 'primary' | 'secondary'): React.CSSProperties => ({
    background: variant === 'primary' ? '#3b82f6' : '#374151',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1.2rem',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginRight: '0.5rem',
  })

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 0.2 — Детектор побочных эффектов</h2>
      <p style={{ color: '#9ca3af', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Кликните на карточку, чтобы переключить метку Pure / Impure, затем нажмите "Проверить".
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
        {CARDS.map((card) => {
          const userSaysPure = guesses[card.id] ?? true
          const isCorrect = userSaysPure === card.isPure

          let borderColor = '#374151'
          if (checked) {
            borderColor = isCorrect ? '#10b981' : '#ef4444'
          } else if (card.id in guesses) {
            borderColor = '#3b82f6'
          }

          return (
            <div
              key={card.id}
              onClick={() => toggle(card.id)}
              style={{
                background: '#1f2937',
                border: `2px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '0.75rem',
                cursor: checked ? 'default' : 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <code style={{ fontSize: '0.85rem', color: '#a5f3fc', display: 'block', marginBottom: '0.5rem' }}>
                {card.code}
              </code>
              <div style={{
                display: 'inline-block',
                padding: '0.2rem 0.6rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                background: userSaysPure ? '#065f46' : '#7f1d1d',
                color: userSaysPure ? '#10b981' : '#ef4444',
              }}>
                {userSaysPure ? 'Pure' : 'Impure'}
              </div>
              {checked && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: isCorrect ? '#6ee7b7' : '#fca5a5', lineHeight: 1.4 }}>
                  {isCorrect ? 'Верно! ' : 'Неверно. '}{card.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!checked ? (
        <button style={btnStyle('primary')} onClick={check}>Проверить</button>
      ) : (
        <>
          <div style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}>
            <span style={{ color: '#10b981' }}>
              Правильно: {CARDS.filter((c) => (guesses[c.id] ?? true) === c.isPure).length}
            </span>
            {' / '}
            <span style={{ color: '#9ca3af' }}>{CARDS.length}</span>
          </div>
          <button style={btnStyle('secondary')} onClick={reset}>Попробовать снова</button>
        </>
      )}
    </div>
  )
}

// ============================================
// Task 0.3 Solution: Refactoring to Purity
// ============================================

interface Order {
  id: string
  items: Array<{ name: string; price: number }>
  status: string
}

interface ProcessedOrder {
  id: string
  items: Array<{ name: string; price: number }>
  status: string
  total: number
  processedAt: number
}

// Impure version: mutates input, uses Date.now(), writes to console
function processOrderImpure(order: Order): Order {
  const mutable = order as unknown as Record<string, unknown>
  mutable['total'] = order.items.reduce((s, i) => s + i.price, 0) // mutation
  mutable['processedAt'] = Date.now() // mutation + non-determinism
  console.log(`[processOrderImpure] processed order ${order.id}`) // side effect
  mutable['status'] = 'processed'
  return order
}

// Pure version: all dependencies injected, returns new object
function processOrderPure(
  order: Order,
  now: number,
  logger: (msg: string) => void,
): ProcessedOrder {
  const total = order.items.reduce((s, i) => s + i.price, 0)
  logger(`[processOrderPure] processed order ${order.id}`)
  return {
    ...order,
    total,
    processedAt: now,
    status: 'processed',
  }
}

const SAMPLE_ORDER: Order = {
  id: 'ORD-001',
  items: [
    { name: 'Книга по FP', price: 800 },
    { name: 'Курс TypeScript', price: 1200 },
  ],
  status: 'pending',
}

export function Task0_3_Solution() {
  const [sideEffectLog, setSideEffectLog] = useState<string[]>([])
  const [impureResult, setImpureResult] = useState<Order | null>(null)
  const [pureResult, setPureResult] = useState<ProcessedOrder | null>(null)
  const [originalMutated, setOriginalMutated] = useState<boolean | null>(null)
  const [ran, setRan] = useState(false)

  const run = () => {
    // Run impure
    const orderForImpure: Order = JSON.parse(JSON.stringify(SAMPLE_ORDER))
    const consoleLog: string[] = []
    const originalConsoleLog = console.log
    console.log = (...args: unknown[]) => {
      consoleLog.push(args.join(' '))
      originalConsoleLog(...args)
    }
    const impureOut = processOrderImpure(orderForImpure)
    console.log = originalConsoleLog
    setSideEffectLog(consoleLog)

    // Check if original was mutated (it was — same reference)
    setOriginalMutated(impureOut === orderForImpure)
    setImpureResult(impureOut)

    // Run pure
    const pureLog: string[] = []
    const orderForPure: Order = JSON.parse(JSON.stringify(SAMPLE_ORDER))
    const pureOut = processOrderPure(orderForPure, 1712880000000, (msg) => pureLog.push(msg))
    setPureResult(pureOut)
    setRan(true)
  }

  const reset = () => {
    setSideEffectLog([])
    setImpureResult(null)
    setPureResult(null)
    setOriginalMutated(null)
    setRan(false)
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
    flex: 1,
    minWidth: '220px',
  }

  const checkRow = (label: string, bad: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
      <span style={{ color: bad ? '#ef4444' : '#10b981', fontSize: '1rem' }}>{bad ? '✗' : '✓'}</span>
      <span style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>{label}</span>
    </div>
  )

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 0.3 — Рефакторинг к чистоте</h2>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={panelStyle}>
          <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Нечистая версия
          </div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#fca5a5', overflowX: 'auto', margin: 0 }}>
{`function processOrderImpure(order) {
  order.total = items.reduce(...) // мутация
  order.processedAt = Date.now() // недетерм.
  console.log('processed ' + order.id) // эффект
  order.status = 'processed'
  return order
}`}
          </pre>
        </div>

        <div style={panelStyle}>
          <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Чистая версия
          </div>
          <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#a5f3fc', overflowX: 'auto', margin: 0 }}>
{`function processOrderPure(
  order,   // данные
  now,     // инъекция времени
  logger   // инъекция эффекта
) {
  const total = items.reduce(...)
  logger('processed ' + order.id)
  return { ...order, total, processedAt: now }
}`}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={run}
          style={{
            background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px',
            padding: '0.6rem 1.4rem', cursor: 'pointer', fontSize: '0.95rem', marginRight: '0.5rem',
          }}
        >
          Запустить
        </button>
        {ran && (
          <button
            onClick={reset}
            style={{
              background: '#374151', color: '#fff', border: 'none', borderRadius: '6px',
              padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.95rem',
            }}
          >
            Сброс
          </button>
        )}
      </div>

      {ran && (
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={panelStyle}>
            <div style={{ color: '#ef4444', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Нечистая: анализ
            </div>
            {checkRow('Оригинал не мутирован', originalMutated === true)}
            {checkRow('Результат детерминирован', false)}
            {checkRow('Нет побочных эффектов', sideEffectLog.length > 0)}
            {sideEffectLog.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Лог побочных эффектов:</div>
                {sideEffectLog.map((line, i) => (
                  <div key={i} style={{ fontSize: '0.78rem', color: '#fbbf24', background: '#0d1117', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                    {line}
                  </div>
                ))}
              </div>
            )}
            {impureResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Результат (мутированный объект):</div>
                <pre style={{ background: '#0d1117', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', color: '#fca5a5', margin: 0 }}>
                  {JSON.stringify(impureResult, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div style={panelStyle}>
            <div style={{ color: '#10b981', fontWeight: 'bold', marginBottom: '0.75rem' }}>
              Чистая: анализ
            </div>
            {checkRow('Оригинал не мутирован', false)}
            {checkRow('Результат детерминирован', false)}
            {checkRow('Нет побочных эффектов', false)}
            {pureResult && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.78rem', color: '#9ca3af', marginBottom: '0.25rem' }}>Новый объект (оригинал не тронут):</div>
                <pre style={{ background: '#0d1117', padding: '0.4rem', borderRadius: '4px', fontSize: '0.75rem', color: '#a5f3fc', margin: 0 }}>
                  {JSON.stringify(pureResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
