import { useState } from 'react'

// ============================================
// Task 3.1 Solution: Manual currying visualizer
// ============================================

// Generic curry implementation — works with any arity
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function curry(fn: (...args: any[]) => any) {
  const arity = fn.length

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function curried(...args: any[]): any {
    if (args.length >= arity) {
      return fn(...args)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (...moreArgs: any[]) => curried(...args, ...moreArgs)
  }
}

interface LogEntry {
  call: string
  result: string
  isFunction: boolean
}

export function Task3_1_Solution() {
  const [a, setA] = useState('1')
  const [b, setB] = useState('2')
  const [c, setC] = useState('3')
  const [log, setLog] = useState<LogEntry[]>([])

  const na = Number(a) || 0
  const nb = Number(b) || 0
  const nc = Number(c) || 0

  const add3 = curry((x: number, y: number, z: number) => x + y + z)

  const addEntry = (entries: LogEntry[]) => {
    setLog(prev => [...prev.slice(-14), ...entries])
  }

  const runDemo = (label: string, entries: LogEntry[]) => {
    addEntry([
      { call: `--- ${label} ---`, result: '', isFunction: false },
      ...entries,
    ])
  }

  const demo1 = () => {
    runDemo(`add3(${na})(${nb})(${nc})`, [
      { call: `add3(${na})`, result: 'function', isFunction: true },
      { call: `add3(${na})(${nb})`, result: 'function', isFunction: true },
      { call: `add3(${na})(${nb})(${nc})`, result: String(na + nb + nc), isFunction: false },
    ])
  }

  const demo2 = () => {
    runDemo(`add3(${na}, ${nb})(${nc})`, [
      { call: `add3(${na}, ${nb})`, result: 'function', isFunction: true },
      { call: `add3(${na}, ${nb})(${nc})`, result: String(na + nb + nc), isFunction: false },
    ])
  }

  const demo3 = () => {
    runDemo(`add3(${na})(${nb}, ${nc})`, [
      { call: `add3(${na})`, result: 'function', isFunction: true },
      { call: `add3(${na})(${nb}, ${nc})`, result: String(na + nb + nc), isFunction: false },
    ])
  }

  const demo4 = () => {
    runDemo(`add3(${na}, ${nb}, ${nc})`, [
      { call: `add3(${na}, ${nb}, ${nc})`, result: String(na + nb + nc), isFunction: false },
    ])
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

  const btnStyle: React.CSSProperties = {
    background: '#374151',
    color: '#e5e7eb',
    border: '1px solid #4b5563',
    borderRadius: '6px',
    padding: '0.4rem 0.9rem',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontFamily: 'monospace',
    transition: 'background 0.15s',
  }

  const inputStyle: React.CSSProperties = {
    width: '60px',
    background: '#0d1117',
    border: '1px solid #374151',
    borderRadius: '6px',
    padding: '0.35rem 0.5rem',
    color: '#a5f3fc',
    fontSize: '0.9rem',
    textAlign: 'center',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 3.1 — Ручное каррирование</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Функция <code style={{ color: '#a5f3fc' }}>curry</code> превращает{' '}
        <code style={{ color: '#fde68a' }}>f(a, b, c)</code> в функцию, которую можно вызывать
        как <code style={{ color: '#6ee7b7' }}>f(a)(b)(c)</code>, <code style={{ color: '#6ee7b7' }}>f(a, b)(c)</code>,
        или <code style={{ color: '#6ee7b7' }}>f(a, b, c)</code>.
      </p>

      {/* Implementation */}
      <div style={panelStyle}>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Реализация:</div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#c4b5fd', margin: 0, overflowX: 'auto' }}>
{`function curry(fn) {
  const arity = fn.length  // количество аргументов

  return function curried(...args) {
    if (args.length >= arity) {
      return fn(...args)      // все аргументы — вызываем
    }
    // Не все аргументы — возвращаем функцию, ждущую остальных
    return (...more) => curried(...args, ...more)
  }
}

const add3 = curry((a, b, c) => a + b + c)
// add3.length === 3 (арность)`}
        </pre>
      </div>

      {/* Controls */}
      <div style={{ ...panelStyle, display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>
          <code style={{ color: '#fde68a' }}>add3</code> с аргументами:
        </span>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
          a = <input type="number" value={a} onChange={e => setA(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
          b = <input type="number" value={b} onChange={e => setB(e.target.value)} style={inputStyle} />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#9ca3af', fontSize: '0.85rem' }}>
          c = <input type="number" value={c} onChange={e => setC(e.target.value)} style={inputStyle} />
        </label>
      </div>

      {/* Call buttons */}
      <div style={{ ...panelStyle, display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: '0.82rem', marginRight: '0.25rem' }}>Способы вызова:</span>
        <button style={btnStyle} onClick={demo1}>add3({na})({nb})({nc})</button>
        <button style={btnStyle} onClick={demo2}>add3({na}, {nb})({nc})</button>
        <button style={btnStyle} onClick={demo3}>add3({na})({nb}, {nc})</button>
        <button style={btnStyle} onClick={demo4}>add3({na}, {nb}, {nc})</button>
        <button
          style={{ ...btnStyle, marginLeft: 'auto', color: '#6b7280', borderColor: '#374151' }}
          onClick={() => setLog([])}
        >
          Очистить
        </button>
      </div>

      {/* Log */}
      <div style={{ ...panelStyle, marginBottom: 0, minHeight: '120px' }}>
        <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Лог выполнения:</div>
        {log.length === 0 ? (
          <div style={{ color: '#4b5563', fontSize: '0.82rem' }}>Нажмите кнопку выше, чтобы увидеть шаги каррирования</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {log.map((entry, i) => {
              if (entry.result === '') {
                return (
                  <div key={i} style={{ color: '#4b5563', fontSize: '0.75rem', marginTop: i > 0 ? '0.4rem' : 0 }}>
                    {entry.call}
                  </div>
                )
              }
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <code style={{ color: '#a5f3fc', flex: 1 }}>{entry.call}</code>
                  <span style={{ color: '#4b5563' }}>=&gt;</span>
                  <span style={{
                    color: entry.isFunction ? '#f59e0b' : '#6ee7b7',
                    background: entry.isFunction ? '#1c1405' : '#0d2618',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    border: `1px solid ${entry.isFunction ? '#f59e0b33' : '#10b98133'}`,
                  }}>
                    {entry.isFunction ? 'function (ждёт аргументов)' : entry.result}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Concept note */}
      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.8rem', color: '#9ca3af' }}>
        Ключевая идея: каррированная функция возвращает <span style={{ color: '#f59e0b' }}>новую функцию</span> до тех пор, пока не получит
        все <span style={{ color: '#a5f3fc' }}>3 аргумента</span>. Тогда она вычисляет и возвращает <span style={{ color: '#6ee7b7' }}>результат</span>.
      </div>
    </div>
  )
}

// ============================================
// Task 3.2 Solution: Partial application
// ============================================

function partial<T extends unknown[], R>(
  fn: (...args: T) => R,
  ...presetArgs: Partial<T>
): (...remainingArgs: unknown[]) => R {
  return (...remainingArgs: unknown[]) => fn(...([...presetArgs, ...remainingArgs] as T))
}

// Demo functions
function multiply(a: number, b: number): number {
  return a * b
}

function greet(greeting: string, name: string): string {
  return `${greeting}, ${name}!`
}

function formatDate(locale: string, date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'Неверная дата'
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

// Pre-applied variants
const double = partial(multiply, 2)
const addTax = partial(multiply, 1.2)
const greetUser = partial(greet, 'Привет')
const formatRuDate = partial(formatDate, 'ru-RU')

interface DemoCard {
  id: string
  title: string
  sourceCode: string
  partialCode: string
  presetLabel: string
  inputPlaceholder: string
  inputType: string
  compute: (input: string) => string
  defaultInput: string
  unit?: string
}

const DEMOS: DemoCard[] = [
  {
    id: 'double',
    title: 'double = partial(multiply, 2)',
    sourceCode: 'multiply(a, b) => a * b',
    partialCode: 'const double = partial(multiply, 2)',
    presetLabel: 'Фиксируем a = 2',
    inputPlaceholder: 'Число',
    inputType: 'number',
    defaultInput: '5',
    compute: (v) => String(double(Number(v) || 0)),
  },
  {
    id: 'tax',
    title: 'addTax = partial(multiply, 1.2)',
    sourceCode: 'multiply(a, b) => a * b',
    partialCode: 'const addTax = partial(multiply, 1.2)',
    presetLabel: 'Фиксируем a = 1.2',
    inputPlaceholder: 'Цена (руб.)',
    inputType: 'number',
    defaultInput: '1000',
    unit: '₽',
    compute: (v) => String(Math.round((addTax(Number(v) || 0) as number) * 100) / 100),
  },
  {
    id: 'greet',
    title: 'greetUser = partial(greet, "Привет")',
    sourceCode: 'greet(greeting, name) => `${greeting}, ${name}!`',
    partialCode: 'const greetUser = partial(greet, "Привет")',
    presetLabel: 'Фиксируем greeting = "Привет"',
    inputPlaceholder: 'Имя',
    inputType: 'text',
    defaultInput: 'Алексей',
    compute: (v) => String(greetUser(v || 'Мир')),
  },
  {
    id: 'date',
    title: 'formatRuDate = partial(formatDate, "ru-RU")',
    sourceCode: 'formatDate(locale, date) => date.toLocaleDateString(locale)',
    partialCode: 'const formatRuDate = partial(formatDate, "ru-RU")',
    presetLabel: 'Фиксируем locale = "ru-RU"',
    inputPlaceholder: 'YYYY-MM-DD',
    inputType: 'text',
    defaultInput: '2024-03-15',
    compute: (v) => String(formatRuDate(v)),
  },
]

export function Task3_2_Solution() {
  const [inputs, setInputs] = useState<Record<string, string>>(
    Object.fromEntries(DEMOS.map(d => [d.id, d.defaultInput]))
  )
  const [mode, setMode] = useState<'partial' | 'curry'>('partial')

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

  const setInput = (id: string, value: string) => {
    setInputs(prev => ({ ...prev, [id]: value }))
  }

  const partialImpl = `function partial(fn, ...presetArgs) {
  return (...remainingArgs) => fn(...presetArgs, ...remainingArgs)
}`

  const curryImpl = `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args)
    return (...more) => curried(...args, ...more)
  }
}

// С curry нужно применять по одному аргументу:
const double   = curry(multiply)(2)      // фиксирует 2
const addTax   = curry(multiply)(1.2)    // фиксирует 1.2`

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 3.2 — Частичное применение</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
        <code style={{ color: '#a5f3fc' }}>partial(fn, ...presetArgs)</code> фиксирует первые аргументы, возвращая функцию
        которая ждёт оставшиеся.
      </p>

      {/* Toggle partial vs curry */}
      <div style={{ ...panelStyle, marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setMode('partial')}
            style={{
              padding: '0.35rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: mode === 'partial' ? '#3b82f6' : '#374151',
              color: '#fff',
            }}
          >
            partial
          </button>
          <button
            onClick={() => setMode('curry')}
            style={{
              padding: '0.35rem 1rem',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              background: mode === 'curry' ? '#a78bfa' : '#374151',
              color: '#fff',
            }}
          >
            curry
          </button>
        </div>
        <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: mode === 'partial' ? '#93c5fd' : '#c4b5fd', margin: 0, overflowX: 'auto' }}>
          {mode === 'partial' ? partialImpl : curryImpl}
        </pre>
        {mode === 'curry' && (
          <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#9ca3af', borderTop: '1px solid #374151', paddingTop: '0.6rem' }}>
            Отличие: <span style={{ color: '#a78bfa' }}>curry</span> разрешает аргументы по одному через цепочку вызовов.{' '}
            <span style={{ color: '#3b82f6' }}>partial</span> фиксирует сразу N первых аргументов.
            Результат одинаков, подход разный.
          </div>
        )}
      </div>

      {/* Demo cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
        {DEMOS.map(demo => {
          const input = inputs[demo.id]
          const result = demo.compute(input)
          return (
            <div key={demo.id} style={{ ...panelStyle, marginBottom: 0 }}>
              <div style={{ color: '#a5f3fc', fontSize: '0.82rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {demo.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', marginBottom: '0.4rem' }}>
                исходная: <code style={{ color: '#9ca3af' }}>{demo.sourceCode}</code>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#f59e0b', marginBottom: '0.75rem' }}>
                {demo.presetLabel}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <input
                  type={demo.inputType}
                  value={input}
                  onChange={e => setInput(demo.id, e.target.value)}
                  placeholder={demo.inputPlaceholder}
                  style={{
                    flex: 1,
                    background: '#0d1117',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    padding: '0.35rem 0.6rem',
                    color: '#e5e7eb',
                    fontSize: '0.85rem',
                  }}
                />
                {demo.unit && <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>{demo.unit}</span>}
              </div>
              <div style={{ background: '#0d1117', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}>
                <span style={{ color: '#6b7280' }}>
                  {demo.id === 'double' && `double(${input})`}
                  {demo.id === 'tax' && `addTax(${input})`}
                  {demo.id === 'greet' && `greetUser("${input}")`}
                  {demo.id === 'date' && `formatRuDate("${input}")`}
                </span>
                <span style={{ color: '#4b5563' }}> =&gt; </span>
                <span style={{ color: '#6ee7b7', fontWeight: 'bold' }}>{result}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* partial implementation note */}
      <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.78rem', color: '#9ca3af' }}>
        <code style={{ color: '#a5f3fc' }}>partial</code> — это просто{' '}
        <code style={{ color: '#fde68a' }}>bind</code> без привязки к <code style={{ color: '#fde68a' }}>this</code>.
        Разница: <code>fn.bind(null, arg1)</code> vs <code>partial(fn, arg1)</code> — оба дают частично применённую функцию.
      </div>
    </div>
  )
}

// ============================================
// Task 3.3 Solution: Point-free pipeline
// ============================================

// Curried utility functions
function prop<T, K extends keyof T>(key: K): (obj: T) => T[K] {
  return (obj: T) => obj[key]
}

function filterBy<T>(pred: (item: T) => boolean): (arr: T[]) => T[] {
  return (arr: T[]) => arr.filter(pred)
}

function mapWith<T, R>(fn: (item: T) => R): (arr: T[]) => R[] {
  return (arr: T[]) => arr.map(fn)
}

function sortByStr(arr: string[]): string[] {
  return [...arr].sort((a, b) => a.localeCompare(b, 'ru'))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pipe(...fns: Array<(arg: any) => any>): (arg: any) => any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: any) => fns.reduce((acc, fn) => fn(acc), value)
}

interface User {
  name: string
  age: number
  active: boolean
  city: string
}

const USERS: User[] = [
  { name: 'Екатерина', age: 28, active: true,  city: 'Москва'       },
  { name: 'Дмитрий',   age: 35, active: false, city: 'Санкт-Петербург' },
  { name: 'Алексей',   age: 22, active: true,  city: 'Москва'       },
  { name: 'Мария',     age: 31, active: true,  city: 'Казань'       },
  { name: 'Сергей',    age: 45, active: false, city: 'Новосибирск'  },
  { name: 'Анна',      age: 27, active: true,  city: 'Москва'       },
  { name: 'Иван',      age: 33, active: true,  city: 'Екатеринбург' },
  { name: 'Ольга',     age: 24, active: false, city: 'Казань'       },
]

export function Task3_3_Solution() {
  const [displayMode, setDisplayMode] = useState<'verbose' | 'pointfree'>('verbose')

  // Verbose style
  const verboseResult = USERS
    .filter(u => u.active)
    .map(u => u.name)
    .sort((a, b) => a.localeCompare(b, 'ru'))

  // Point-free style
  const pointFreeResult: string[] = pipe(
    filterBy(prop<User, 'active'>('active')),
    mapWith(prop<User, 'name'>('name')),
    sortByStr,
  )(USERS)

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

  const verboseCode = `// Verbose: именованные аргументы везде
const result = users
  .filter(u => u.active)        // u — явная переменная
  .map(u => u.name)             // u — явная переменная
  .sort((a, b) => a.localeCompare(b, 'ru'))`

  const pointFreeCode = `// Point-free: функции без упоминания аргументов
const result = pipe(
  filterBy(prop('active')),     // нет переменной u
  mapWith(prop('name')),        // нет переменной u
  sortByStr,                    // нет переменных a, b
)(users)

// Утилиты:
// prop('active') => (obj) => obj.active
// filterBy(pred) => (arr) => arr.filter(pred)
// mapWith(fn)    => (arr) => arr.map(fn)`

  const utilsCode = `// Каррированные утилиты
const prop   = key => obj => obj[key]
const filterBy = pred => arr => arr.filter(pred)
const mapWith  = fn   => arr => arr.map(fn)

// pipe — применяет функции слева направо
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x)`

  const result = displayMode === 'verbose' ? verboseResult : pointFreeResult
  const activeCount = USERS.filter(u => u.active).length

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ marginTop: 0, color: '#f9fafb' }}>Задание 3.3 — Point-free конвейер</h2>
      <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '1rem' }}>
        Point-free стиль — функции описывают преобразования без упоминания данных которые обрабатывают.
        Каррированные утилиты делают это возможным.
      </p>

      {/* Mode toggle */}
      <div style={{ ...panelStyle, display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ color: '#6b7280', fontSize: '0.82rem' }}>Стиль кода:</span>
        <button
          onClick={() => setDisplayMode('verbose')}
          style={{
            padding: '0.35rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: displayMode === 'verbose' ? '#3b82f6' : '#374151',
            color: '#fff',
          }}
        >
          Verbose
        </button>
        <button
          onClick={() => setDisplayMode('pointfree')}
          style={{
            padding: '0.35rem 1rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            background: displayMode === 'pointfree' ? '#10b981' : '#374151',
            color: '#fff',
          }}
        >
          Point-free
        </button>
        <span style={{ color: '#6b7280', fontSize: '0.78rem', marginLeft: '0.5rem' }}>
          Оба дают одинаковый результат
        </span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Code panel */}
        <div style={{ flex: 2, minWidth: '300px' }}>
          <div style={panelStyle}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
              {displayMode === 'verbose' ? 'Verbose стиль:' : 'Point-free стиль:'}
            </div>
            <pre style={{
              background: '#0d1117',
              borderRadius: '6px',
              padding: '0.75rem',
              fontSize: '0.75rem',
              color: displayMode === 'verbose' ? '#93c5fd' : '#6ee7b7',
              margin: 0,
              overflowX: 'auto',
            }}>
              {displayMode === 'verbose' ? verboseCode : pointFreeCode}
            </pre>
          </div>

          {displayMode === 'pointfree' && (
            <div style={panelStyle}>
              <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.5rem' }}>Определения утилит:</div>
              <pre style={{ background: '#0d1117', borderRadius: '6px', padding: '0.75rem', fontSize: '0.75rem', color: '#fde68a', margin: 0, overflowX: 'auto' }}>
                {utilsCode}
              </pre>
            </div>
          )}
        </div>

        {/* Result panel */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={panelStyle}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
              Данные: {USERS.length} пользователей
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {USERS.map(u => (
                <div key={u.name} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  fontSize: '0.78rem',
                  opacity: u.active ? 1 : 0.4,
                }}>
                  <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: u.active ? '#10b981' : '#6b7280',
                    flexShrink: 0,
                  }} />
                  <span style={{ color: u.active ? '#e5e7eb' : '#6b7280' }}>{u.name}</span>
                  <span style={{ color: '#4b5563', marginLeft: 'auto' }}>{u.city}</span>
                </div>
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#6b7280', borderTop: '1px solid #374151', paddingTop: '0.5rem' }}>
              {activeCount} активных из {USERS.length}
            </div>
          </div>

          <div style={{ ...panelStyle, marginBottom: 0 }}>
            <div style={{ color: '#9ca3af', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
              Результат (active + sorted):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {result.map((name, i) => (
                <div key={name} style={{
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  background: '#0d1117',
                  fontSize: '0.82rem',
                }}>
                  <span style={{ color: '#4b5563', width: '18px', textAlign: 'right', flexShrink: 0 }}>{i + 1}.</span>
                  <span style={{ color: '#6ee7b7' }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comparison note */}
      <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', borderRadius: '6px', background: '#0d1117', border: '1px solid #374151', fontSize: '0.78rem', color: '#9ca3af' }}>
        Point-free читается как описание трансформации: «взять активных, взять имена, отсортировать».
        Verbose читается как алгоритм: «для каждого u проверить u.active, для каждого u вернуть u.name».
        Выбор зависит от контекста — point-free хорош для коротких конвейеров данных.
      </div>
    </div>
  )
}
