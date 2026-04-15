import { useState, useMemo, useCallback } from 'react'

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
})

// ============================================
// Task 8.1: Lens
// ============================================

type Lens<S, A> = {
  get: (source: S) => A
  set: (value: A, source: S) => S
}

function lens<S, A>(get: (s: S) => A, set: (a: A, s: S) => S): Lens<S, A> {
  return { get, set }
}

function view<S, A>(l: Lens<S, A>, s: S): A {
  return l.get(s)
}

function lset<S, A>(l: Lens<S, A>, a: A, s: S): S {
  return l.set(a, s)
}

function over<S, A>(l: Lens<S, A>, fn: (a: A) => A, s: S): S {
  return l.set(fn(l.get(s)), s)
}

function composeLens<A, B, C>(outer: Lens<A, B>, inner: Lens<B, C>): Lens<A, C> {
  return {
    get: (s: A) => inner.get(outer.get(s)),
    set: (c: C, s: A) => outer.set(inner.set(c, outer.get(s)), s),
  }
}

interface Manager {
  name: string
  email: string
}

interface Department {
  name: string
  manager: Manager
}

interface Company {
  name: string
  departments: Department[]
}

const initialCompany: Company = {
  name: 'TechCorp',
  departments: [
    {
      name: 'Engineering',
      manager: { name: 'Alice', email: 'alice@tech.com' },
    },
    {
      name: 'Marketing',
      manager: { name: 'Bob', email: 'bob@tech.com' },
    },
  ],
}

// Predefined lenses
const companyNameLens = lens<Company, string>(
  s => s.name,
  (a, s) => ({ ...s, name: a })
)

const departmentLens = (index: number) =>
  lens<Company, Department>(
    s => s.departments[index],
    (a, s) => ({
      ...s,
      departments: s.departments.map((d, i) => (i === index ? a : d)),
    })
  )

const deptNameLens = lens<Department, string>(
  s => s.name,
  (a, s) => ({ ...s, name: a })
)

const managerLens = lens<Department, Manager>(
  s => s.manager,
  (a, s) => ({ ...s, manager: a })
)

const managerNameLens = lens<Manager, string>(
  s => s.name,
  (a, s) => ({ ...s, name: a })
)

const managerEmailLens = lens<Manager, string>(
  s => s.email,
  (a, s) => ({ ...s, email: a })
)

// Composed lenses
const dept0ManagerNameLens = composeLens(composeLens(departmentLens(0), managerLens), managerNameLens)
const dept0ManagerEmailLens = composeLens(composeLens(departmentLens(0), managerLens), managerEmailLens)
const dept1ManagerNameLens = composeLens(composeLens(departmentLens(1), managerLens), managerNameLens)
const dept0DeptNameLens = composeLens(departmentLens(0), deptNameLens)

interface LensOption {
  label: string
  lens: Lens<Company, string>
  description: string
}

const lensOptions: LensOption[] = [
  { label: 'companyName', lens: companyNameLens, description: 'companyNameLens' },
  { label: 'dept[0].name', lens: dept0DeptNameLens, description: 'composeLens(departmentLens(0), deptNameLens)' },
  { label: 'dept[0].manager.name', lens: dept0ManagerNameLens, description: 'composeLens(composeLens(dept(0), managerLens), managerNameLens)' },
  { label: 'dept[0].manager.email', lens: dept0ManagerEmailLens, description: 'composeLens(composeLens(dept(0), managerLens), managerEmailLens)' },
  { label: 'dept[1].manager.name', lens: dept1ManagerNameLens, description: 'composeLens(composeLens(dept(1), managerLens), managerNameLens)' },
]

interface LensOperation {
  lensLabel: string
  lensDesc: string
  oldValue: string
  newValue: string
  mutated: boolean
}

export function Task8_1_Solution() {
  const [company, setCompany] = useState<Company>(initialCompany)
  const [selectedLensIdx, setSelectedLensIdx] = useState(0)
  const [newValue, setNewValue] = useState('')
  const [lastOp, setLastOp] = useState<LensOperation | null>(null)
  const [history, setHistory] = useState<LensOperation[]>([])

  const selectedOption = lensOptions[selectedLensIdx]
  const currentValue = view(selectedOption.lens, company)

  const handleSet = useCallback(() => {
    if (!newValue.trim()) return
    const oldCompany = company
    const updated = lset(selectedOption.lens, newValue.trim(), company)
    const op: LensOperation = {
      lensLabel: selectedOption.label,
      lensDesc: selectedOption.description,
      oldValue: view(selectedOption.lens, oldCompany),
      newValue: newValue.trim(),
      mutated: oldCompany === updated,
    }
    setCompany(updated)
    setLastOp(op)
    setHistory(h => [op, ...h.slice(0, 4)])
    setNewValue('')
  }, [company, newValue, selectedOption])

  const handleOver = useCallback(() => {
    const fn = (s: string) => s.toUpperCase()
    const oldCompany = company
    const updated = over(selectedOption.lens, fn, company)
    const op: LensOperation = {
      lensLabel: selectedOption.label,
      lensDesc: selectedOption.description,
      oldValue: view(selectedOption.lens, oldCompany),
      newValue: view(selectedOption.lens, updated),
      mutated: oldCompany === updated,
    }
    setCompany(updated)
    setLastOp(op)
    setHistory(h => [op, ...h.slice(0, 4)])
  }, [company, selectedOption])

  const renderCompanyTree = (c: Company) => (
    <div style={{ fontSize: '0.78rem', lineHeight: '1.8' }}>
      <div>
        <span style={{ color: '#9ca3af' }}>name: </span>
        <span style={{ color: '#fcd34d' }}>{c.name}</span>
      </div>
      <div style={{ color: '#9ca3af' }}>departments: [</div>
      {c.departments.map((d, i) => (
        <div key={i} style={{ marginLeft: '1rem' }}>
          <div>
            <span style={{ color: '#9ca3af' }}>  [{i}].name: </span>
            <span style={{ color: '#86efac' }}>{d.name}</span>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>  [{i}].manager.name: </span>
            <span style={{ color: '#93c5fd' }}>{d.manager.name}</span>
          </div>
          <div>
            <span style={{ color: '#9ca3af' }}>  [{i}].manager.email: </span>
            <span style={{ color: '#c4b5fd' }}>{d.manager.email}</span>
          </div>
        </div>
      ))}
      <div style={{ color: '#9ca3af' }}>]</div>
    </div>
  )

  const inputStyle: React.CSSProperties = {
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '4px',
    color: '#e5e7eb',
    padding: '0.3rem 0.5rem',
    fontFamily: 'monospace',
    fontSize: '0.82rem',
    width: '220px',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Lens: иммутабельный фокус на вложенных данных</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={labelStyle}>Ключевая идея</div>
        <div style={{ color: '#d1d5db', lineHeight: '1.7', marginBottom: '0.5rem' }}>
          Lens — пара функций get/set, которая "фокусируется" на одном поле структуры.
          Линзы можно компоновать: <code style={{ color: '#fcd34d' }}>composeLens(outer, inner)</code> даёт линзу на вложенное поле без мутаций.
        </div>
        <div style={codeBlock}>{`type Lens<S, A> = {
  get: (source: S) => A
  set: (value: A, source: S) => S  // возвращает НОВЫЙ S, не мутирует
}

// Примитивы:
view(lens, s)           // прочитать значение
lset(lens, value, s)    // задать новое значение (иммутабельно)
over(lens, fn, s)       // применить функцию к значению

// Композиция:
const composed = composeLens(outerLens, innerLens)
// get: s => inner.get(outer.get(s))
// set: (c, s) => outer.set(inner.set(c, outer.get(s)), s)`}</div>
      </div>

      {/* State tree */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div style={panelStyle}>
          <div style={labelStyle}>Текущее состояние</div>
          {renderCompanyTree(company)}
        </div>
        <div style={panelStyle}>
          <div style={labelStyle}>Исходное состояние (не изменено)</div>
          {renderCompanyTree(initialCompany)}
          <div style={{
            marginTop: '0.7rem',
            padding: '0.4rem 0.6rem',
            background: company === initialCompany ? '#0d2a1f' : '#1e3a5f',
            border: `1px solid ${company === initialCompany ? '#10b981' : '#3b82f6'}`,
            borderRadius: '6px',
            color: company === initialCompany ? '#6ee7b7' : '#93c5fd',
            fontSize: '0.75rem',
          }}>
            {company === initialCompany
              ? 'Идентичны по ссылке (не применялись операции)'
              : 'Новая ссылка — initialCompany не мутирован'}
          </div>
        </div>
      </div>

      {/* Lens editor */}
      <div style={panelStyle}>
        <div style={labelStyle}>Редактор через Lens</div>
        <div style={{ marginBottom: '0.7rem' }}>
          <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>Выберите линзу:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.7rem' }}>
            {lensOptions.map((opt, i) => (
              <button key={opt.label} style={btnStyle(i === selectedLensIdx)} onClick={() => setSelectedLensIdx(i)}>
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ ...codeBlock, marginTop: 0, marginBottom: '0.6rem' }}>
            {selectedOption.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>Текущее значение: </span>
            <span style={{ color: '#fcd34d' }}>{currentValue}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            style={inputStyle}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            placeholder="Новое значение..."
            onKeyDown={e => e.key === 'Enter' && handleSet()}
          />
          <button style={{ ...btnStyle(true), background: '#1e3a5f' }} onClick={handleSet}>
            set(lens, value, company)
          </button>
          <button style={btnStyle()} onClick={handleOver}>
            over(lens, toUpperCase)
          </button>
          <button style={{ ...btnStyle(), marginLeft: '0.5rem' }} onClick={() => {
            setCompany(initialCompany)
            setLastOp(null)
            setHistory([])
          }}>
            Сбросить
          </button>
        </div>
      </div>

      {/* Last operation */}
      {lastOp && (
        <div style={panelStyle}>
          <div style={labelStyle}>Последняя операция</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div>
              <div style={{ color: '#9ca3af' }}>Линза</div>
              <div style={{ color: '#93c5fd' }}>{lastOp.lensLabel}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Старое значение</div>
              <div style={{ color: '#f87171' }}>{lastOp.oldValue}</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af' }}>Новое значение</div>
              <div style={{ color: '#6ee7b7' }}>{lastOp.newValue}</div>
            </div>
          </div>
          <div style={{
            marginTop: '0.5rem',
            padding: '0.3rem 0.6rem',
            background: lastOp.mutated ? '#2d1515' : '#0d2a1f',
            border: `1px solid ${lastOp.mutated ? '#ef4444' : '#10b981'}`,
            borderRadius: '6px',
            color: lastOp.mutated ? '#f87171' : '#6ee7b7',
            fontSize: '0.75rem',
          }}>
            {lastOp.mutated
              ? 'Мутация обнаружена (set вернул тот же объект)'
              : 'Иммутабельно: set вернул новый объект, initialCompany не изменён'}
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={labelStyle}>История операций</div>
          {history.map((op, i) => (
            <div key={i} style={{
              display: 'flex',
              gap: '1rem',
              fontSize: '0.75rem',
              padding: '0.3rem 0',
              borderBottom: i < history.length - 1 ? '1px solid #374151' : 'none',
            }}>
              <span style={{ color: '#9ca3af', minWidth: '20px' }}>{i + 1}.</span>
              <span style={{ color: '#93c5fd', minWidth: '180px' }}>{op.lensLabel}</span>
              <span style={{ color: '#f87171' }}>{op.oldValue}</span>
              <span style={{ color: '#9ca3af' }}>→</span>
              <span style={{ color: '#6ee7b7' }}>{op.newValue}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.2: Transducers
// ============================================

type Reducer<A, B> = (acc: A, item: B) => A
type Transducer<A, B> = <R>(reducer: Reducer<R, B>) => Reducer<R, A>

function mapping<A, B>(fn: (a: A) => B): Transducer<A, B> {
  return function<R>(reducer: Reducer<R, B>): Reducer<R, A> {
    return (acc: R, item: A) => reducer(acc, fn(item))
  }
}

function filtering<A>(pred: (a: A) => boolean): Transducer<A, A> {
  return function<R>(reducer: Reducer<R, A>): Reducer<R, A> {
    return (acc: R, item: A) => pred(item) ? reducer(acc, item) : acc
  }
}

function taking<A>(n: number): Transducer<A, A> {
  return function<R>(reducer: Reducer<R, A>): Reducer<R, A> {
    let count = 0
    return (acc: R, item: A) => {
      if (count >= n) return acc
      count++
      return reducer(acc, item)
    }
  }
}

function composeTransducers<A, B, C>(t1: Transducer<A, B>, t2: Transducer<B, C>): Transducer<A, C> {
  return function<R>(reducer: Reducer<R, C>): Reducer<R, A> {
    return t1(t2(reducer))
  }
}

function transduce<A, B, R>(xf: Transducer<A, B>, reducer: Reducer<R, B>, init: R, arr: A[]): R {
  const xfReducer = xf(reducer)
  let acc = init
  for (const item of arr) {
    acc = xfReducer(acc, item)
  }
  return acc
}

interface Product {
  id: number
  name: string
  price: number
  category: string
}

const CATEGORIES = ['Electronics', 'Books', 'Clothing', 'Food', 'Sports']

function generateProducts(n: number): Product[] {
  const products: Product[] = []
  for (let i = 0; i < n; i++) {
    products.push({
      id: i + 1,
      name: `Product ${i + 1}`,
      price: Math.round((10 + (i * 37) % 990) * 100) / 100,
      category: CATEGORIES[i % CATEGORIES.length],
    })
  }
  return products
}

interface BenchResult {
  intermediateArrays: number
  iterations: number
  timeMs: number
  results: Product[]
}

export function Task8_2_Solution() {
  const [minPrice, setMinPrice] = useState(300)
  const [discount, setDiscount] = useState(10)
  const [limitN, setLimitN] = useState(10)
  const [chainResult, setChainResult] = useState<BenchResult | null>(null)
  const [transducerResult, setTransducerResult] = useState<BenchResult | null>(null)

  const products = useMemo(() => generateProducts(1000), [])

  const runChain = useCallback(() => {
    const t0 = performance.now()
    let filterIter = 0
    let mapIter = 0
    let sliceIter = 0

    const filtered = products.filter(p => {
      filterIter++
      return p.price >= minPrice
    })

    const mapped = filtered.map(p => {
      mapIter++
      return { ...p, price: Math.round(p.price * (1 - discount / 100) * 100) / 100 }
    })

    const sliced = mapped.slice(0, limitN)
    sliceIter = sliced.length

    const t1 = performance.now()

    setChainResult({
      intermediateArrays: 2,
      iterations: filterIter + mapIter + sliceIter,
      timeMs: Math.round((t1 - t0) * 1000) / 1000,
      results: sliced,
    })
  }, [products, minPrice, discount, limitN])

  const runTransducer = useCallback(() => {
    const t0 = performance.now()
    let iterCount = 0

    const xf = composeTransducers(
      composeTransducers(
        filtering<Product>(p => { iterCount++; return p.price >= minPrice }),
        mapping<Product, Product>(p => ({ ...p, price: Math.round(p.price * (1 - discount / 100) * 100) / 100 }))
      ),
      taking<Product>(limitN)
    )

    const results = transduce(xf, (acc: Product[], item: Product) => [...acc, item], [], products)
    const t1 = performance.now()

    setTransducerResult({
      intermediateArrays: 0,
      iterations: iterCount,
      timeMs: Math.round((t1 - t0) * 1000) / 1000,
      results,
    })
  }, [products, minPrice, discount, limitN])

  const runBoth = useCallback(() => {
    runChain()
    runTransducer()
  }, [runChain, runTransducer])

  const sliderStyle: React.CSSProperties = {
    width: '100%',
    accentColor: '#3b82f6',
  }

  const badgeStyle = (good: boolean): React.CSSProperties => ({
    display: 'inline-block',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    background: good ? '#0d2a1f' : '#2d2000',
    border: `1px solid ${good ? '#10b981' : '#d97706'}`,
    color: good ? '#6ee7b7' : '#fcd34d',
  })

  const renderStats = (res: BenchResult | null, label: string, isGood: boolean) => (
    <div style={panelStyle}>
      <div style={{ color: isGood ? '#6ee7b7' : '#fcd34d', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
        {label}
      </div>
      {res ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.7rem' }}>
            <div>
              <div style={labelStyle}>Промежуточных массивов</div>
              <div style={badgeStyle(res.intermediateArrays === 0)}>
                {res.intermediateArrays}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Итераций</div>
              <div style={badgeStyle(isGood)}>
                {res.iterations}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Время (мс)</div>
              <div style={badgeStyle(isGood)}>
                {res.timeMs.toFixed(3)}ms
              </div>
            </div>
          </div>
          <div style={labelStyle}>Первые {Math.min(5, res.results.length)} результатов:</div>
          {res.results.slice(0, 5).map(p => (
            <div key={p.id} style={{ fontSize: '0.75rem', color: '#d1d5db', padding: '0.1rem 0' }}>
              {p.name} — {p.price} ({p.category})
            </div>
          ))}
        </>
      ) : (
        <div style={{ color: '#4b5563', fontSize: '0.78rem' }}>Нажмите "Запустить"</div>
      )}
    </div>
  )

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>Transducers: компонуемые трансформации без промежуточных массивов</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={labelStyle}>Ключевая идея</div>
        <div style={{ color: '#d1d5db', lineHeight: '1.7', marginBottom: '0.5rem' }}>
          Transducer — трансформация над редьюсером. При компоновке нескольких transducer'ов
          получается один проход по данным: нет промежуточных массивов, нет лишних аллокаций.
        </div>
        <div style={codeBlock}>{`type Reducer<A, B> = (acc: A, item: B) => A
type Transducer<A, B> = <R>(reducer: Reducer<R, B>) => Reducer<R, A>

// Примитивы
const mapping = fn => reducer => (acc, item) => reducer(acc, fn(item))
const filtering = pred => reducer => (acc, item) => pred(item) ? reducer(acc, item) : acc
const taking = n => reducer => { let count = 0; return (acc, item) => count++ < n ? reducer(acc, item) : acc }

// Композиция transducer'ов — слева направо (в отличие от compose функций)
const xf = composeTransducers(
  composeTransducers(filtering(p => p.price >= minPrice), mapping(applyDiscount)),
  taking(10)
)

// Один проход: никаких промежуточных массивов
transduce(xf, (acc, item) => [...acc, item], [], products)`}</div>
      </div>

      {/* Controls */}
      <div style={panelStyle}>
        <div style={labelStyle}>Настройки</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '0.7rem' }}>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              Мин. цена: {minPrice}
            </div>
            <input type="range" min={0} max={900} value={minPrice}
              onChange={e => setMinPrice(Number(e.target.value))} style={sliderStyle} />
          </div>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              Скидка: {discount}%
            </div>
            <input type="range" min={0} max={50} value={discount}
              onChange={e => setDiscount(Number(e.target.value))} style={sliderStyle} />
          </div>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
              Лимит (take): {limitN}
            </div>
            <input type="range" min={1} max={50} value={limitN}
              onChange={e => setLimitN(Number(e.target.value))} style={sliderStyle} />
          </div>
        </div>
        <button style={{ ...btnStyle(true), background: '#1e3a5f' }} onClick={runBoth}>
          Запустить оба
        </button>
        <button style={btnStyle()} onClick={runChain}>Только chain</button>
        <button style={btnStyle()} onClick={runTransducer}>Только transducer</button>
      </div>

      {/* Results comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {renderStats(chainResult, 'Цепочка массивов: filter → map → slice', false)}
        {renderStats(transducerResult, 'Transducer: один проход', true)}
      </div>

      {/* Code comparison */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: 0 }}>
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={{ color: '#fcd34d', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Цепочка (3 массива)</div>
          <div style={codeBlock}>{`products
  .filter(p => p.price >= ${minPrice})   // новый массив
  .map(applyDiscount)                   // ещё массив
  .slice(0, ${limitN})                    // ещё массив`}</div>
        </div>
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={{ color: '#6ee7b7', fontSize: '0.78rem', marginBottom: '0.4rem' }}>Transducer (0 массивов)</div>
          <div style={codeBlock}>{`transduce(
  composeTransducers(
    composeTransducers(
      filtering(p => p.price >= ${minPrice}),
      mapping(applyDiscount)
    ),
    taking(${limitN})
  ),
  (acc, item) => [...acc, item],
  [],
  products
)`}</div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 8.3: FP Data Pipeline
// ============================================

type EitherPipe<L, R> = { tag: 'Left'; value: L } | { tag: 'Right'; value: R }

function pipeRight<L, R>(value: R): EitherPipe<L, R> {
  return { tag: 'Right', value }
}

function pipeLeft<L, R>(value: L): EitherPipe<L, R> {
  return { tag: 'Left', value }
}

function pipeChain<L, A, B>(e: EitherPipe<L, A>, fn: (v: A) => EitherPipe<L, B>): EitherPipe<L, B> {
  return e.tag === 'Right' ? fn(e.value) : e
}

interface RawEvent {
  timestamp: string
  type: string
  userId: string
  amount?: string
  category?: string
}

interface ValidEvent {
  timestamp: string
  type: string
  userId: string
  amount: number
  category: string
}

interface EnrichedEvent extends ValidEvent {
  date: Date
  dayOfWeek: string
  isWeekend: boolean
}

interface GroupedEvents {
  [category: string]: EnrichedEvent[]
}

interface AggregatedResult {
  category: string
  count: number
  totalAmount: number
  avgAmount: number
}

interface FormattedResult {
  category: string
  count: string
  totalAmount: string
  avgAmount: string
}

// Pipeline stages
function parseJSON(input: string): EitherPipe<string, RawEvent[]> {
  try {
    const data = JSON.parse(input)
    if (!Array.isArray(data)) return pipeLeft('Ожидается массив событий')
    return pipeRight(data as RawEvent[])
  } catch {
    return pipeLeft('Ошибка парсинга JSON: невалидный формат')
  }
}

function validateEvents(events: RawEvent[]): EitherPipe<string, ValidEvent[]> {
  const valid: ValidEvent[] = []
  const skipped: string[] = []

  for (const e of events) {
    if (!e.timestamp || !e.type || !e.userId) {
      skipped.push(`Пропущен: ${JSON.stringify(e)}`)
      continue
    }
    const amount = parseFloat(e.amount ?? '0')
    if (isNaN(amount)) {
      skipped.push(`Невалидная сумма у userId=${e.userId}`)
      continue
    }
    valid.push({
      timestamp: e.timestamp,
      type: e.type,
      userId: e.userId,
      amount,
      category: e.category ?? 'Uncategorized',
    })
  }

  if (valid.length === 0) return pipeLeft(`Нет валидных событий. Пропущено: ${skipped.join('; ')}`)
  return pipeRight(valid)
}

const DAYS_RU = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

function enrichEvents(events: ValidEvent[]): EitherPipe<string, EnrichedEvent[]> {
  try {
    const enriched = events.map(e => {
      const date = new Date(e.timestamp)
      const dow = date.getDay()
      return {
        ...e,
        date,
        dayOfWeek: DAYS_RU[dow],
        isWeekend: dow === 0 || dow === 6,
      }
    })
    return pipeRight(enriched)
  } catch {
    return pipeLeft('Ошибка обогащения данных: невалидные даты')
  }
}

function groupByCategory(events: EnrichedEvent[]): EitherPipe<string, GroupedEvents> {
  const grouped: GroupedEvents = {}
  for (const e of events) {
    if (!grouped[e.category]) grouped[e.category] = []
    grouped[e.category].push(e)
  }
  return pipeRight(grouped)
}

function aggregateGroups(groups: GroupedEvents): EitherPipe<string, AggregatedResult[]> {
  const results: AggregatedResult[] = Object.entries(groups).map(([category, events]) => {
    const totalAmount = events.reduce((s, e) => s + e.amount, 0)
    return {
      category,
      count: events.length,
      totalAmount: Math.round(totalAmount * 100) / 100,
      avgAmount: Math.round((totalAmount / events.length) * 100) / 100,
    }
  })
  results.sort((a, b) => b.totalAmount - a.totalAmount)
  return pipeRight(results)
}

function formatResults(results: AggregatedResult[]): EitherPipe<string, FormattedResult[]> {
  return pipeRight(results.map(r => ({
    category: r.category,
    count: `${r.count} событий`,
    totalAmount: `${r.totalAmount.toLocaleString('ru-RU')} ₽`,
    avgAmount: `${r.avgAmount.toLocaleString('ru-RU')} ₽`,
  })))
}

const EXAMPLE_JSON = JSON.stringify([
  { timestamp: '2024-01-15T10:00:00Z', type: 'purchase', userId: 'u1', amount: '1200', category: 'Electronics' },
  { timestamp: '2024-01-16T14:30:00Z', type: 'purchase', userId: 'u2', amount: '350', category: 'Books' },
  { timestamp: '2024-01-20T09:00:00Z', type: 'purchase', userId: 'u1', amount: '2800', category: 'Electronics' },
  { timestamp: '2024-01-21T11:00:00Z', type: 'purchase', userId: 'u3', amount: '180', category: 'Books' },
  { timestamp: '2024-01-22T16:00:00Z', type: 'purchase', userId: 'u2', amount: '950', category: 'Clothing' },
  { timestamp: '2024-01-13T12:00:00Z', type: 'purchase', userId: 'u4', amount: '3200', category: 'Electronics' },
  { timestamp: '2024-01-14T08:00:00Z', type: 'purchase', userId: 'u1', amount: '75', category: 'Books' },
  { timestamp: '2024-01-15T17:00:00Z', type: 'refund', userId: 'u3', amount: '350', category: 'Clothing' },
  { timestamp: '2024-01-19T10:30:00Z', type: 'purchase', userId: 'u5', category: 'Food' },
  { timestamp: '2024-01-20T15:00:00Z', type: 'purchase', userId: 'u2', amount: 'NaN', category: 'Electronics' },
], null, 2)

interface PipelineStageResult {
  name: string
  fnName: string
  inputSummary: string
  outputSummary: string
  status: 'ok' | 'error' | 'skipped'
  errorMsg?: string
}

export function Task8_3_Solution() {
  const [jsonInput, setJsonInput] = useState('')
  const [stages, setStages] = useState<PipelineStageResult[]>([])
  const [finalResults, setFinalResults] = useState<FormattedResult[] | null>(null)
  const [ran, setRan] = useState(false)

  const runPipeline = useCallback((input: string) => {
    const results: PipelineStageResult[] = []

    // Stage 1: parse
    const parsed = parseJSON(input)
    results.push({
      name: '1. Парсинг',
      fnName: 'parseJSON(input)',
      inputSummary: `Строка ${input.length} символов`,
      outputSummary: parsed.tag === 'Right' ? `${parsed.value.length} событий` : '',
      status: parsed.tag === 'Right' ? 'ok' : 'error',
      errorMsg: parsed.tag === 'Left' ? parsed.value : undefined,
    })

    // Stage 2: validate
    const validated = pipeChain(parsed, validateEvents)
    const rawCount = parsed.tag === 'Right' ? parsed.value.length : 0
    const validCount = validated.tag === 'Right' ? validated.value.length : 0
    results.push({
      name: '2. Валидация',
      fnName: 'validateEvents(events)',
      inputSummary: parsed.tag === 'Right' ? `${rawCount} событий` : '—',
      outputSummary: validated.tag === 'Right' ? `${validCount} валидных (пропущено: ${rawCount - validCount})` : '',
      status: parsed.tag === 'Left' ? 'skipped' : validated.tag === 'Right' ? 'ok' : 'error',
      errorMsg: validated.tag === 'Left' && parsed.tag === 'Right' ? validated.value : undefined,
    })

    // Stage 3: enrich
    const enriched = pipeChain(validated, enrichEvents)
    results.push({
      name: '3. Обогащение',
      fnName: 'enrichEvents(events)',
      inputSummary: validated.tag === 'Right' ? `${validCount} событий` : '—',
      outputSummary: enriched.tag === 'Right' ? `+ dayOfWeek, isWeekend` : '',
      status: validated.tag === 'Left' ? 'skipped' : enriched.tag === 'Right' ? 'ok' : 'error',
      errorMsg: enriched.tag === 'Left' && validated.tag === 'Right' ? enriched.value : undefined,
    })

    // Stage 4: group
    const grouped = pipeChain(enriched, groupByCategory)
    const groupCount = grouped.tag === 'Right' ? Object.keys(grouped.value).length : 0
    results.push({
      name: '4. Группировка',
      fnName: 'groupByCategory(events)',
      inputSummary: enriched.tag === 'Right' ? `${enriched.value.length} событий` : '—',
      outputSummary: grouped.tag === 'Right' ? `${groupCount} категорий` : '',
      status: enriched.tag === 'Left' ? 'skipped' : grouped.tag === 'Right' ? 'ok' : 'error',
      errorMsg: grouped.tag === 'Left' && enriched.tag === 'Right' ? grouped.value : undefined,
    })

    // Stage 5: aggregate
    const aggregated = pipeChain(grouped, aggregateGroups)
    results.push({
      name: '5. Агрегация',
      fnName: 'aggregateGroups(groups)',
      inputSummary: grouped.tag === 'Right' ? `${groupCount} категорий` : '—',
      outputSummary: aggregated.tag === 'Right' ? `count, totalAmount, avgAmount` : '',
      status: grouped.tag === 'Left' ? 'skipped' : aggregated.tag === 'Right' ? 'ok' : 'error',
      errorMsg: aggregated.tag === 'Left' && grouped.tag === 'Right' ? aggregated.value : undefined,
    })

    // Stage 6: format
    const formatted = pipeChain(aggregated, formatResults)
    results.push({
      name: '6. Форматирование',
      fnName: 'formatResults(results)',
      inputSummary: aggregated.tag === 'Right' ? `${aggregated.value.length} записей` : '—',
      outputSummary: formatted.tag === 'Right' ? 'готово к отображению' : '',
      status: aggregated.tag === 'Left' ? 'skipped' : formatted.tag === 'Right' ? 'ok' : 'error',
      errorMsg: formatted.tag === 'Left' && aggregated.tag === 'Right' ? formatted.value : undefined,
    })

    setStages(results)
    setFinalResults(formatted.tag === 'Right' ? formatted.value : null)
    setRan(true)
  }, [])

  const statusColor = (s: 'ok' | 'error' | 'skipped') => {
    if (s === 'ok') return '#6ee7b7'
    if (s === 'error') return '#f87171'
    return '#4b5563'
  }

  const statusBg = (s: 'ok' | 'error' | 'skipped') => {
    if (s === 'ok') return '#0d2a1f'
    if (s === 'error') return '#2d1515'
    return '#1f2937'
  }

  const taStyle: React.CSSProperties = {
    width: '100%',
    background: '#0f172a',
    border: '1px solid #374151',
    borderRadius: '6px',
    color: '#94a3b8',
    padding: '0.6rem',
    fontFamily: 'monospace',
    fontSize: '0.72rem',
    minHeight: '120px',
    resize: 'vertical',
    boxSizing: 'border-box',
  }

  return (
    <div className="exercise-container" style={containerStyle}>
      <h2 style={{ color: '#a5b4fc', marginTop: 0 }}>FP Data Pipeline: цепочка чистых функций</h2>

      {/* Concept */}
      <div style={panelStyle}>
        <div style={labelStyle}>Архитектура пайплайна</div>
        <div style={{ color: '#d1d5db', lineHeight: '1.7', marginBottom: '0.5rem' }}>
          Каждый этап — чистая функция, возвращающая Either. Ошибка на любом этапе прерывает цепочку
          (railway-oriented programming). Следующие этапы получают уже проверенные данные.
        </div>
        <div style={codeBlock}>{`const result =
  parseJSON(input)
    .chain(validateEvents)   // Left = пропускаем
    .chain(enrichEvents)     // Left = пропускаем
    .chain(groupByCategory)  // Left = пропускаем
    .chain(aggregateGroups)  // Left = пропускаем
    .chain(formatResults)    // Left | Right<FormattedResult[]>`}</div>
      </div>

      {/* Input */}
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <div style={labelStyle}>JSON с событиями</div>
          <button style={btnStyle()} onClick={() => setJsonInput(EXAMPLE_JSON)}>
            Загрузить пример
          </button>
        </div>
        <textarea
          style={taStyle}
          value={jsonInput}
          onChange={e => setJsonInput(e.target.value)}
          placeholder='[{"timestamp": "2024-01-15T10:00:00Z", "type": "purchase", ...}]'
          spellCheck={false}
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
          <button
            style={{ ...btnStyle(true), background: '#1e3a5f' }}
            onClick={() => runPipeline(jsonInput)}
            disabled={!jsonInput.trim()}
          >
            Запустить пайплайн
          </button>
          <button style={btnStyle()} onClick={() => {
            setJsonInput('[{"type":"purchase","userId":"u1","amount":"100"}]')
          }}>
            Нет timestamp
          </button>
          <button style={btnStyle()} onClick={() => {
            setJsonInput('не JSON вообще')
          }}>
            Невалидный JSON
          </button>
          {ran && (
            <button style={btnStyle()} onClick={() => { setStages([]); setFinalResults(null); setRan(false) }}>
              Сбросить
            </button>
          )}
        </div>
      </div>

      {/* Pipeline stages */}
      {stages.length > 0 && (
        <div style={panelStyle}>
          <div style={labelStyle}>Этапы пайплайна</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {stages.map((stage, i) => (
              <div key={i} style={{
                background: statusBg(stage.status),
                border: `1px solid ${statusColor(stage.status)}`,
                borderRadius: '6px',
                padding: '0.6rem 0.8rem',
                display: 'grid',
                gridTemplateColumns: '180px 1fr 1fr',
                gap: '0.5rem',
                alignItems: 'center',
                opacity: stage.status === 'skipped' ? 0.5 : 1,
              }}>
                <div>
                  <div style={{ color: statusColor(stage.status), fontSize: '0.78rem', fontWeight: 'bold' }}>
                    {stage.name}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: '0.72rem' }}>
                    {stage.fnName}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>Вход</div>
                  <div style={{ color: '#d1d5db', fontSize: '0.75rem' }}>{stage.inputSummary}</div>
                </div>
                <div>
                  <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                    {stage.status === 'error' ? 'Ошибка' : stage.status === 'skipped' ? 'Пропущен' : 'Выход'}
                  </div>
                  <div style={{ color: statusColor(stage.status), fontSize: '0.75rem' }}>
                    {stage.errorMsg ?? stage.outputSummary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Final table */}
      {finalResults && finalResults.length > 0 && (
        <div style={{ ...panelStyle, marginBottom: 0 }}>
          <div style={labelStyle}>Итоговая таблица агрегатов</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #374151' }}>
                {['Категория', 'Событий', 'Сумма', 'Среднее'].map(h => (
                  <th key={h} style={{ padding: '0.4rem 0.6rem', color: '#9ca3af', textAlign: 'left', fontWeight: 'normal' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {finalResults.map((r, i) => (
                <tr key={r.category} style={{ borderBottom: i < finalResults.length - 1 ? '1px solid #1f2937' : 'none' }}>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#93c5fd' }}>{r.category}</td>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#e5e7eb' }}>{r.count}</td>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#6ee7b7' }}>{r.totalAmount}</td>
                  <td style={{ padding: '0.4rem 0.6rem', color: '#fcd34d' }}>{r.avgAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
