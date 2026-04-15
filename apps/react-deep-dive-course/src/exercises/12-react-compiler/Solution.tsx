import { useState, useCallback, useMemo, useRef, useEffect, memo } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// Task 12.1: Manual vs Compiler
// ─────────────────────────────────────────────────────────────────────────────

type Product = {
  id: string
  name: string
  price: number
  discount: number
}

const SENTINEL = Symbol('cache')
type CacheCell = symbol | unknown

function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price)
}

function getDiscountLabel(discount: number): string {
  if (discount === 0) return 'Без скидки'
  return `Скидка ${discount}%`
}

// --- Manual version (useMemo + useCallback + React.memo)

type CacheStatus = { formattedPrice: 'cached' | 'recalc'; discountLabel: 'cached' | 'recalc'; handler: 'cached' | 'recalc' }

const ManualProductCard = memo(function ManualProductCard({
  product,
  onAddToCart,
  onCacheStatus,
}: {
  product: Product
  onAddToCart: (id: string) => void
  onCacheStatus: (s: CacheStatus) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  const prevPrice = useRef<number | undefined>(undefined)
  const prevDiscount = useRef<number | undefined>(undefined)
  const prevHandler = useRef<((id: string) => void) | undefined>(undefined)

  const priceChanged = prevPrice.current !== product.price
  const discountChanged = prevDiscount.current !== product.discount
  const handlerChanged = prevHandler.current !== onAddToCart

  const formattedPrice = useMemo(() => {
    return formatPrice(product.price)
  }, [product.price])

  const discountLabel = useMemo(() => {
    return getDiscountLabel(product.discount)
  }, [product.discount])

  const handleAddToCart = useCallback(() => {
    onAddToCart(product.id)
  }, [onAddToCart, product.id])

  const status: CacheStatus = {
    formattedPrice: priceChanged ? 'recalc' : 'cached',
    discountLabel: discountChanged ? 'recalc' : 'cached',
    handler: handlerChanged ? 'recalc' : 'cached',
  }

  prevPrice.current = product.price
  prevDiscount.current = product.discount
  prevHandler.current = onAddToCart

  // notify parent once per render (after commit would be ideal, but for demo it's fine)
  const statusRef = useRef<CacheStatus>(status)
  statusRef.current = status
  useMemo(() => { onCacheStatus(statusRef.current) }, [onCacheStatus, product.price, product.discount])

  return (
    <div style={{ border: '1px solid #94a3b8', borderRadius: 8, padding: 16, background: '#f8fafc' }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
        Рендер #{renderCount.current} · React.memo + useMemo + useCallback
      </div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{product.name}</div>
      <div style={{ color: '#0f766e', marginBottom: 2 }}>{formattedPrice}</div>
      <div style={{ color: '#7c3aed', marginBottom: 8, fontSize: 13 }}>{discountLabel}</div>
      <button
        onClick={handleAddToCart}
        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}
      >
        В корзину
      </button>
    </div>
  )
})

// --- Compiled version (useMemoCache pattern via useRef array)

function CompiledProductCard({
  product,
  onAddToCart,
  onCacheStatus,
}: {
  product: Product
  onAddToCart: (id: string) => void
  onCacheStatus: (s: CacheStatus) => void
}) {
  const renderCount = useRef(0)
  renderCount.current++

  // Имитация useMemoCache(8)
  const $ref = useRef<CacheCell[]>(null as unknown as CacheCell[])
  if ($ref.current === null) {
    $ref.current = new Array(8).fill(SENTINEL)
  }
  const $ = $ref.current

  // scope 1: formattedPrice depends on product.price
  let formattedPrice: string
  const priceStatus: 'recalc' | 'cached' = $[0] !== product.price ? 'recalc' : 'cached'
  if ($[0] !== product.price) {
    formattedPrice = formatPrice(product.price)
    $[0] = product.price
    $[1] = formattedPrice
  } else {
    formattedPrice = $[1] as string
  }

  // scope 2: discountLabel depends on product.discount
  let discountLabel: string
  const discountStatus: 'recalc' | 'cached' = $[2] !== product.discount ? 'recalc' : 'cached'
  if ($[2] !== product.discount) {
    discountLabel = getDiscountLabel(product.discount)
    $[2] = product.discount
    $[3] = discountLabel
  } else {
    discountLabel = $[3] as string
  }

  // scope 3: handleAddToCart depends on onAddToCart and product.id
  let handleAddToCart: () => void
  const handlerStatus: 'recalc' | 'cached' = ($[4] !== onAddToCart || $[5] !== product.id) ? 'recalc' : 'cached'
  if ($[4] !== onAddToCart || $[5] !== product.id) {
    handleAddToCart = () => onAddToCart(product.id)
    $[4] = onAddToCart
    $[5] = product.id
    $[6] = handleAddToCart
  } else {
    handleAddToCart = $[6] as () => void
  }

  const cacheStatus: CacheStatus = {
    formattedPrice: priceStatus,
    discountLabel: discountStatus,
    handler: handlerStatus,
  }

  onCacheStatus(cacheStatus)

  return (
    <div style={{ border: '1px solid #a78bfa', borderRadius: 8, padding: 16, background: '#faf5ff' }}>
      <div style={{ fontSize: 11, color: '#64748b', marginBottom: 8 }}>
        Рендер #{renderCount.current} · useMemoCache паттерн (compiler output)
      </div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{product.name}</div>
      <div style={{ color: '#0f766e', marginBottom: 2 }}>{formattedPrice}</div>
      <div style={{ color: '#7c3aed', marginBottom: 8, fontSize: 13 }}>{discountLabel}</div>
      <button
        onClick={handleAddToCart}
        style={{ background: '#8b5cf6', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}
      >
        В корзину
      </button>
    </div>
  )
}

function CachePanel({ status, label }: { status: CacheStatus; label: string }) {
  const items: { key: keyof CacheStatus; name: string }[] = [
    { key: 'formattedPrice', name: 'formattedPrice' },
    { key: 'discountLabel', name: 'discountLabel' },
    { key: 'handler', name: 'handleAddToCart' },
  ]
  return (
    <div style={{ marginTop: 8, padding: '8px 12px', background: '#f1f5f9', borderRadius: 6 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', marginBottom: 4 }}>{label}</div>
      {items.map(({ key, name }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2, fontSize: 12 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: status[key] === 'cached' ? '#22c55e' : '#f97316',
            flexShrink: 0
          }} />
          <span style={{ fontFamily: 'monospace' }}>{name}</span>
          <span style={{ color: status[key] === 'cached' ? '#15803d' : '#c2410c' }}>
            {status[key] === 'cached' ? '← из кэша' : '← пересчитано'}
          </span>
        </div>
      ))}
    </div>
  )
}

export function Task12_1_Solution() {
  const [product, setProduct] = useState<Product>({
    id: 'p1', name: 'React Deep Dive Book', price: 1490, discount: 10,
  })
  const [parentRender, setParentRender] = useState(0)
  const [manualStatus, setManualStatus] = useState<CacheStatus>({
    formattedPrice: 'recalc', discountLabel: 'recalc', handler: 'recalc',
  })
  const [compiledStatus, setCompiledStatus] = useState<CacheStatus>({
    formattedPrice: 'recalc', discountLabel: 'recalc', handler: 'recalc',
  })
  const [cartCount, setCartCount] = useState(0)

  const handleAddToCart = useCallback((_id: string) => {
    setCartCount(c => c + 1)
  }, [])

  const handleSetManualStatus = useCallback((s: CacheStatus) => {
    setManualStatus(s)
  }, [])

  return (
    <div className="exercise-container">
      <h2>Задание 12.1 — Manual vs Compiler</h2>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <button
          onClick={() => setProduct(p => ({ ...p, price: p.price + 100 }))}
          style={{ background: '#0f766e', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}
        >
          +100₽ к цене
        </button>
        <button
          onClick={() => setProduct(p => ({ ...p, discount: (p.discount + 5) % 50 }))}
          style={{ background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}
        >
          Изменить скидку
        </button>
        <button
          onClick={() => setParentRender(n => n + 1)}
          style={{ background: '#64748b', color: '#fff', border: 'none', borderRadius: 6, padding: '7px 14px', cursor: 'pointer' }}
        >
          Форс-рендер родителя #{parentRender}
        </button>
        <div style={{ padding: '7px 14px', background: '#fef3c7', borderRadius: 6, fontSize: 13 }}>
          Корзина: {cartCount} товаров
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6', marginBottom: 6 }}>
            Ручная мемоизация (React.memo + useMemo + useCallback)
          </div>
          <ManualProductCard
            product={product}
            onAddToCart={handleAddToCart}
            onCacheStatus={handleSetManualStatus}
          />
          <CachePanel status={manualStatus} label="Что закэшировано (Manual)" />
        </div>

        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', marginBottom: 6 }}>
            Compiler output (useMemoCache паттерн)
          </div>
          <CompiledProductCard
            product={product}
            onAddToCart={handleAddToCart}
            onCacheStatus={setCompiledStatus}
          />
          <CachePanel status={compiledStatus} label="Что закэшировано (Compiled)" />
        </div>
      </div>

      <div style={{ padding: 12, background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac', fontSize: 13 }}>
        <strong>Ключевое отличие:</strong> React.memo предотвращает рендер компонента целиком.
        useMemoCache позволяет рендеру произойти, но берёт JSX из кэша — счётчик растёт, но DOM не меняется.
        Compiler output точнее: он знает какие именно deps изменились без создания N хуков.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 12.2: Rules of React
// ─────────────────────────────────────────────────────────────────────────────

type RuleViolation = {
  title: string
  violation: string
  fix: string
  fixCode: string
}

const VIOLATIONS: Record<string, RuleViolation> = {
  A: {
    title: 'Мутация props (items.push)',
    violation: 'items.push("extra") мутирует входной массив. Каждый рендер добавляет новый элемент — список растёт бесконечно.',
    fix: 'Создать копию массива перед мутацией.',
    fixCode: `function FixedList({ items }) {
  const list = [...items, 'extra']  // копия, не мутация
  return <ul>{list.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
}`,
  },
  B: {
    title: 'Date.now() как ключ',
    violation: 'Date.now() возвращает новое значение при каждом вызове. Все элементы пересоздаются на каждом рендере.',
    fix: 'Использовать стабильный ключ — индекс или уникальный id.',
    fixCode: `function FixedEvents({ events }) {
  return (
    <ul>
      {events.map((e, idx) => <li key={idx}>{e}</li>)}
    </ul>
  )
}`,
  },
  C: {
    title: 'ref.current в рендере',
    violation: 'ref.current — мутируемое значение. React не знает об его изменениях → UI не обновляется при изменении ref.',
    fix: 'Хранить отображаемое значение в state, обновлять через setState.',
    fixCode: `function FixedCounter() {
  const [count, setCount] = useState(0)
  // Таймер обновляет state, а не ref
  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000)
    return () => clearInterval(id)
  }, [])
  return <div>Счётчик: {count}</div>
}`,
  },
}

function ViolationBadge({ canOptimize }: { canOptimize: boolean }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 4,
      background: canOptimize ? '#dcfce7' : '#fee2e2',
      color: canOptimize ? '#15803d' : '#dc2626',
      marginBottom: 8,
    }}>
      {canOptimize ? '✓ Compiler: оптимизирует' : '✗ Compiler: НЕ оптимизирует'}
    </div>
  )
}

function ComponentCard({
  label, canOptimize, violationKey, renderCount, onForceRender, children,
}: {
  label: string; canOptimize: boolean; violationKey?: string
  renderCount: number; onForceRender: () => void; children: React.ReactNode
}) {
  const [showFix, setShowFix] = useState(false)
  const violation = violationKey ? VIOLATIONS[violationKey] : null

  return (
    <div style={{ border: `2px solid ${canOptimize ? '#86efac' : '#fca5a5'}`, borderRadius: 10, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Компонент {label}</span>
          {violation && <div style={{ fontSize: 12, color: '#64748b' }}>{violation.title}</div>}
        </div>
        <div style={{ fontSize: 11, color: '#64748b' }}>Рендер #{renderCount}</div>
      </div>

      <ViolationBadge canOptimize={canOptimize} />
      {children}

      <button
        onClick={onForceRender}
        style={{ marginTop: 8, fontSize: 12, padding: '4px 10px', cursor: 'pointer', background: '#e2e8f0', border: 'none', borderRadius: 4 }}
      >
        Принудительный рендер
      </button>

      {violation && (
        <div style={{ marginTop: 8, padding: 10, background: '#fef2f2', borderRadius: 6, fontSize: 12 }}>
          <strong>Нарушение:</strong> {violation.violation}
        </div>
      )}

      {!canOptimize && violation && (
        <button
          onClick={() => setShowFix(f => !f)}
          style={{ marginTop: 6, fontSize: 12, padding: '4px 10px', cursor: 'pointer', background: '#dbeafe', border: 'none', borderRadius: 4 }}
        >
          {showFix ? 'Скрыть' : 'Показать'} исправление
        </button>
      )}

      {showFix && violation && (
        <div style={{ marginTop: 8 }}>
          <div style={{ fontSize: 12, color: '#15803d', marginBottom: 4 }}>{violation.fix}</div>
          <pre style={{ background: '#f1f5f9', borderRadius: 6, padding: 10, fontSize: 11, overflow: 'auto', margin: 0 }}>
            {violation.fixCode}
          </pre>
        </div>
      )}

      {canOptimize && (
        <div style={{ marginTop: 8, padding: 8, background: '#f0fdf4', borderRadius: 6, fontSize: 12, color: '#15803d' }}>
          Чистый компонент — компилятор оптимизирует полностью
        </div>
      )}
    </div>
  )
}

export function Task12_2_Solution() {
  const [renderA, setRenderA] = useState(0)
  const [renderB, setRenderB] = useState(0)
  const [renderC, setRenderC] = useState(0)
  const [renderD, setRenderD] = useState(0)

  // Component A: mutation demo (we show the bug visually, not actually mutating)
  const baseItems = ['React', 'TypeScript', 'Vite']
  const [itemsAVersion, setItemsAVersion] = useState(0)
  // Simulating: items.push adds one more item each render
  const mutatedItems = [...baseItems, ...Array.from({ length: itemsAVersion }, (_, i) => `extra-${i + 1}`)]

  // Component B: Date.now() key — we track how many DOM remounts happen
  const [eventsB] = useState(['Клик', 'Ввод', 'Отправка'])
  const [remountCountB, setRemountCountB] = useState(0)

  // Component C: ref.current display
  const counterRef = useRef(0)
  const [refDisplayValue] = useState(0) // stays stale — that's the bug
  const [actualValue, setActualValue] = useState(0)

  // Effect to increment counterRef without triggering re-render
  useEffect(() => {
    const id = setInterval(() => {
      counterRef.current++
      setActualValue(counterRef.current)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  // Component D: pure transform
  const pureValues = [42, 7, 19, 88, 3]

  return (
    <div className="exercise-container">
      <h2>Задание 12.2 — Rules of React</h2>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16 }}>
        Четыре компонента. Некоторые нарушают Rules of React — и compiler их пропустит.
        Найдите нарушителей, поймите почему, изучите исправления.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* Component A */}
        <ComponentCard
          label="А — MutatingList" canOptimize={false} violationKey="A"
          renderCount={renderA} onForceRender={() => { setRenderA(n => n + 1); setItemsAVersion(v => v + 1) }}
        >
          <div style={{ fontSize: 12, marginBottom: 4, color: '#dc2626', fontFamily: 'monospace' }}>
            items.push('extra') в рендере:
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
            {mutatedItems.map((item, idx) => (
              <li key={idx} style={{ color: idx >= baseItems.length ? '#dc2626' : 'inherit' }}>
                {item}{idx >= baseItems.length ? ' ← добавлено мутацией' : ''}
              </li>
            ))}
          </ul>
        </ComponentCard>

        {/* Component B */}
        <ComponentCard
          label="Б — TimestampKey" canOptimize={false} violationKey="B"
          renderCount={renderB} onForceRender={() => { setRenderB(n => n + 1); setRemountCountB(c => c + 1) }}
        >
          <div style={{ fontSize: 12, color: '#dc2626', fontFamily: 'monospace', marginBottom: 4 }}>
            key={'{Date.now()}'} — новый ключ каждый рендер
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>
            Перемонтирований (симуляция): {remountCountB}
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: 13 }}>
            {eventsB.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </ComponentCard>

        {/* Component C */}
        <ComponentCard
          label="В — RefReader" canOptimize={false} violationKey="C"
          renderCount={renderC} onForceRender={() => setRenderC(n => n + 1)}
        >
          <div style={{ fontSize: 12, color: '#dc2626', fontFamily: 'monospace', marginBottom: 4 }}>
            Отображается ref.current:
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#dc2626', marginBottom: 4 }}>
            {refDisplayValue} (устаревшее!)
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>
            Реальное значение ref: {counterRef.current} (не триггерит рендер)
          </div>
          <div style={{ fontSize: 12, color: '#15803d' }}>
            Если использовать useState: {actualValue} (обновляется)
          </div>
        </ComponentCard>

        {/* Component D */}
        <ComponentCard
          label="Г — PureTransform" canOptimize={true}
          renderCount={renderD} onForceRender={() => setRenderD(n => n + 1)}
        >
          <div style={{ fontSize: 13, marginBottom: 4 }}>Входные данные: [{pureValues.join(', ')}]</div>
          <div style={{ fontSize: 13 }}>
            <div>Сумма: <strong>{pureValues.reduce((s, v) => s + v, 0)}</strong></div>
            <div>Максимум: <strong>{Math.max(...pureValues)}</strong></div>
            <div>Минимум: <strong>{Math.min(...pureValues)}</strong></div>
          </div>
        </ComponentCard>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Task 12.3: Compiler Output Analysis
// ─────────────────────────────────────────────────────────────────────────────

type Scope = {
  id: string
  label: string
  deps: string[]
  cacheIndices: string
  description: string
  lines: number[]  // which lines of output this scope covers
}

type ComponentExample = {
  name: string
  original: string
  compiled: string
  scopes: Scope[]
}

const EXAMPLES: ComponentExample[] = [
  {
    name: 'UserProfile',
    original: `function UserProfile({ user, onFollow }) {
  const fullName = user.firstName + ' ' + user.lastName
  const avatar = getAvatarUrl(user.id, 'medium')
  const handleFollow = () => onFollow(user.id)
  return (
    <div>
      <img src={avatar} alt={fullName} />
      <span>{fullName}</span>
      <button onClick={handleFollow}>Подписаться</button>
    </div>
  )
}`,
    compiled: `function UserProfile({ user, onFollow }) {
  const $ = useMemoCache(7)

  let fullName
  if ($[0] !== user.firstName || $[1] !== user.lastName) {
    fullName = user.firstName + ' ' + user.lastName
    $[0] = user.firstName; $[1] = user.lastName; $[2] = fullName
  } else { fullName = $[2] }

  let avatar
  if ($[3] !== user.id) {
    avatar = getAvatarUrl(user.id, 'medium')
    $[3] = user.id; $[4] = avatar
  } else { avatar = $[4] }

  let handleFollow
  if ($[5] !== onFollow || $[3] !== user.id) {
    handleFollow = () => onFollow(user.id)
    $[5] = onFollow; $[6] = handleFollow
  } else { handleFollow = $[6] }

  return (
    <div>
      <img src={avatar} alt={fullName} />
      <span>{fullName}</span>
      <button onClick={handleFollow}>Подписаться</button>
    </div>
  )
}`,
    scopes: [
      { id: 's1', label: 'Scope 1: fullName', deps: ['user.firstName', 'user.lastName'], cacheIndices: '$[0], $[1] (deps) → $[2] (value)', description: 'fullName зависит от обоих частей имени. Компилятор видит оба обращения к user и создаёт два cache slot для deps.', lines: [3, 4, 5, 6] },
      { id: 's2', label: 'Scope 2: avatar', deps: ['user.id'], cacheIndices: '$[3] (dep) → $[4] (value)', description: 'avatar зависит только от user.id. Заметьте: $[3] используется повторно для user.id в scope handleFollow — компилятор переиспользует ячейки.', lines: [8, 9, 10] },
      { id: 's3', label: 'Scope 3: handleFollow', deps: ['onFollow', 'user.id'], cacheIndices: '$[5] (onFollow dep) → $[6] (value), $[3] переиспользуется', description: 'handleFollow зависит от onFollow и user.id. user.id уже в $[3] — не нужен новый slot. onFollow идёт в $[5].', lines: [12, 13, 14, 15] },
    ],
  },
  {
    name: 'FilteredTable',
    original: `function FilteredTable({ rows, filter, onRowClick }) {
  const filtered = rows.filter(r => r.status === filter)
  const total = filtered.length
  return (
    <div>
      <span>Найдено: {total}</span>
      <table>
        {filtered.map(r => (
          <tr key={r.id} onClick={() => onRowClick(r.id)}>
            <td>{r.name}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}`,
    compiled: `function FilteredTable({ rows, filter, onRowClick }) {
  const $ = useMemoCache(5)

  let filtered
  if ($[0] !== rows || $[1] !== filter) {
    filtered = rows.filter(r => r.status === filter)
    $[0] = rows; $[1] = filter; $[2] = filtered
  } else { filtered = $[2] }

  const total = filtered.length  // дешёво — не кэшируется отдельно

  // inline onClick НЕ кэшируется внутри .map() —
  // зависит от r.id из замыкания, новый per item
  let jsx
  if ($[3] !== filtered || $[4] !== onRowClick) {
    jsx = (
      <div>
        <span>Найдено: {total}</span>
        <table>
          {filtered.map(r => (
            <tr key={r.id} onClick={() => onRowClick(r.id)}>
              <td>{r.name}</td>
            </tr>
          ))}
        </table>
      </div>
    )
    $[3] = filtered; $[4] = onRowClick; $[5] = jsx
  } else { jsx = $[5] }

  return jsx
}`,
    scopes: [
      { id: 's1', label: 'Scope 1: filtered', deps: ['rows', 'filter'], cacheIndices: '$[0] (rows dep), $[1] (filter dep) → $[2] (value)', description: 'filtered зависит от rows и filter. Самая дорогая операция — filter() — кэшируется первой.', lines: [3, 4, 5, 6, 7] },
      { id: 's2', label: 'Scope 2: JSX (весь)', deps: ['filtered', 'onRowClick'], cacheIndices: '$[3] (filtered dep), $[4] (onRowClick dep) → $[5] (jsx)', description: 'Весь JSX кэшируется как один scope. inline onClick внутри map не выносится отдельно — это ограничение: при каждом рендере createable, но JSX целиком берётся из кэша.', lines: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
    ],
  },
  {
    name: 'ConditionalWidget',
    original: `function ConditionalWidget({ isAdmin, data, onAction }) {
  const label = isAdmin ? 'Удалить' : 'Просмотреть'
  const handleAction = () => onAction(data.id, isAdmin)
  if (data.hidden) return null
  return (
    <button onClick={handleAction}>{label}</button>
  )
}`,
    compiled: `function ConditionalWidget({ isAdmin, data, onAction }) {
  const $ = useMemoCache(5)

  // label и handleAction вычисляются ДО early return!
  let label
  if ($[0] !== isAdmin) {
    label = isAdmin ? 'Удалить' : 'Просмотреть'
    $[0] = isAdmin; $[1] = label
  } else { label = $[1] }

  let handleAction
  if ($[2] !== onAction || $[3] !== data.id || $[0] !== isAdmin) {
    handleAction = () => onAction(data.id, isAdmin)
    $[2] = onAction; $[3] = data.id; $[4] = handleAction
  } else { handleAction = $[4] }

  // Early return ПОСЛЕ вычисления scopes
  if (data.hidden) return null

  return (
    <button onClick={handleAction}>{label}</button>
  )
}`,
    scopes: [
      { id: 's1', label: 'Scope 1: label', deps: ['isAdmin'], cacheIndices: '$[0] (isAdmin dep) → $[1] (value)', description: 'label зависит только от isAdmin. Ternary разворачивается в явный if-else в HIR.', lines: [4, 5, 6, 7, 8] },
      { id: 's2', label: 'Scope 2: handleAction', deps: ['onAction', 'data.id', 'isAdmin'], cacheIndices: '$[2] (onAction), $[3] (data.id), $[0] реиспользуется → $[4] (value)', description: 'handleAction зависит от трёх значений. isAdmin уже в $[0] — переиспользуется. Важно: вычисляется ДО early return, чтобы кэш был актуален при следующем рендере без hidden.', lines: [10, 11, 12, 13, 14] },
      { id: 's3', label: 'Early return после scopes', deps: ['data.hidden'], cacheIndices: 'не кэшируется (simple boolean check)', description: 'Compiler размещает all scopes ПЕРЕД early return. Иначе при смене hidden false→true→false handleAction был бы stale (старый onAction/data.id в замыкании).', lines: [16, 17] },
    ],
  },
]

type QuizQuestion = {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const QUIZ: QuizQuestion[] = [
  {
    question: 'В UserProfile: какой cache index хранит значение fullName?',
    options: ['$[0]', '$[1]', '$[2]', '$[3]'],
    correct: 2,
    explanation: '$[2] хранит само значение fullName. $[0] и $[1] — это deps (user.firstName и user.lastName). Паттерн: deps идут первыми, value — последним в группе.',
  },
  {
    question: 'В FilteredTable: почему inline onClick в .map() не оптимален?',
    options: [
      'Компилятор не умеет работать с .map()',
      'Каждый элемент получает новую функцию т.к. она зависит от r.id из замыкания',
      'onClick нельзя кэшировать в принципе',
      'filtered меняется при каждом рендере',
    ],
    correct: 1,
    explanation: 'Функция () => onRowClick(r.id) создаётся для каждого r отдельно — её deps включают r.id из замыкания. Весь JSX кэшируется как unit, но внутри map функции пересоздаются.',
  },
  {
    question: 'В ConditionalWidget: зачем компилятор вычисляет handleAction ДО early return?',
    options: [
      'Это ошибка компилятора — вычисление лишнее',
      'Чтобы избежать stale closure при переходе data.hidden: true→false',
      'React требует вызывать хуки до условий',
      'Для улучшения tree-shaking',
    ],
    correct: 1,
    explanation: 'Если вычислять handleAction ПОСЛЕ early return, то при data.hidden=true она не будет обновлена. При следующем рендере с data.hidden=false кэш содержал бы устаревший onAction или data.id — stale closure.',
  },
]

export function Task12_3_Solution() {
  const [activeTab, setActiveTab] = useState(0)
  const [activeScope, setActiveScope] = useState<string | null>(null)
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>([null, null, null])
  const [showQuizResult, setShowQuizResult] = useState(false)

  const example = EXAMPLES[activeTab]

  const correctCount = quizAnswers.filter((a, i) => a === QUIZ[i].correct).length

  return (
    <div className="exercise-container">
      <h2>Задание 12.3 — Compiler Output Analysis</h2>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => { setActiveTab(i); setActiveScope(null) }}
            style={{
              padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 13,
              background: activeTab === i ? '#3b82f6' : '#e2e8f0',
              color: activeTab === i ? '#fff' : '#374151',
              fontWeight: activeTab === i ? 600 : 400,
            }}
          >
            {ex.name}
          </button>
        ))}
      </div>

      {/* Side-by-side diff */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>Оригинал</div>
          <pre style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: 12, fontSize: 11.5, overflow: 'auto', margin: 0, lineHeight: 1.6 }}>
            {example.original}
          </pre>
        </div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6', marginBottom: 4 }}>
            Compiler Output (кликайте на scopes ниже)
          </div>
          <pre style={{ background: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: 8, padding: 12, fontSize: 11.5, overflow: 'auto', margin: 0, lineHeight: 1.6 }}>
            {example.compiled}
          </pre>
        </div>
      </div>

      {/* Scope analysis */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Анализ scope boundaries:</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {example.scopes.map(scope => (
            <div key={scope.id}>
              <button
                onClick={() => setActiveScope(activeScope === scope.id ? null : scope.id)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 6, cursor: 'pointer',
                  border: `2px solid ${activeScope === scope.id ? '#8b5cf6' : '#e2e8f0'}`,
                  background: activeScope === scope.id ? '#faf5ff' : '#fff',
                  fontSize: 13, fontWeight: 500,
                }}
              >
                {scope.label}
                <span style={{ float: 'right', fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>
                  {scope.cacheIndices}
                </span>
              </button>
              {activeScope === scope.id && (
                <div style={{ padding: '10px 14px', background: '#f5f3ff', border: '1px solid #c4b5fd', borderRadius: '0 0 6px 6px', fontSize: 13 }}>
                  <div style={{ marginBottom: 6 }}>
                    <strong>Зависимости: </strong>
                    {scope.deps.map(d => (
                      <code key={d} style={{ background: '#e0e7ff', padding: '1px 5px', borderRadius: 3, marginRight: 4, fontSize: 11 }}>{d}</code>
                    ))}
                  </div>
                  <div style={{ color: '#374151' }}>{scope.description}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quiz */}
      <div style={{ border: '2px solid #e2e8f0', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Тест на понимание</div>
        {QUIZ.map((q, qi) => (
          <div key={qi} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{qi + 1}. {q.question}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {q.options.map((opt, oi) => {
                const selected = quizAnswers[qi] === oi
                const answered = quizAnswers[qi] !== null
                const isCorrect = oi === q.correct
                let bg = '#f8fafc'
                let border = '1px solid #e2e8f0'
                if (answered && selected && isCorrect) { bg = '#dcfce7'; border = '1px solid #86efac' }
                if (answered && selected && !isCorrect) { bg = '#fee2e2'; border = '1px solid #fca5a5' }
                if (answered && !selected && isCorrect) { bg = '#dcfce7'; border = '1px solid #86efac' }
                return (
                  <button
                    key={oi}
                    onClick={() => {
                      if (!answered) {
                        const next = [...quizAnswers]
                        next[qi] = oi
                        setQuizAnswers(next)
                      }
                    }}
                    style={{
                      textAlign: 'left', padding: '7px 12px', borderRadius: 6, cursor: answered ? 'default' : 'pointer',
                      border, background: bg, fontSize: 13,
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
              {quizAnswers[qi] !== null && (
                <div style={{ fontSize: 12, color: '#475569', padding: '6px 10px', background: '#f1f5f9', borderRadius: 6 }}>
                  {q.explanation}
                </div>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowQuizResult(true)}
          style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: 6, padding: '8px 18px', cursor: 'pointer', fontSize: 13 }}
        >
          Посмотреть итог
        </button>

        {showQuizResult && (
          <div style={{ marginTop: 10, padding: 12, background: correctCount === 3 ? '#dcfce7' : '#fef3c7', borderRadius: 8, fontSize: 13 }}>
            <strong>Результат: {correctCount} / 3</strong>
            {correctCount === 3
              ? ' — Отлично! Вы понимаете как compiler строит scope boundaries.'
              : ' — Перечитайте объяснения к неверным ответам и попробуйте ещё раз.'}
          </div>
        )}
      </div>
    </div>
  )
}
