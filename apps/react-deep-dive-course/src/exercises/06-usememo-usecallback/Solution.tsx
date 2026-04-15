import { useState, useMemo, useCallback, useRef, memo } from 'react'

// ─── Task 6.1 ─────────────────────────────────────────────────────────────────

type Todo = {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

export function Task6_1_Solution() {
  const renderCount = useRef(0)
  renderCount.current += 1

  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Изучить useMemo', done: true },
    { id: 2, text: 'Понять useCallback', done: false },
    { id: 3, text: 'Написать React.memo', done: false },
  ])
  const [filter, setFilter] = useState<Filter>('all')
  const [newTodo, setNewTodo] = useState('')

  // ✅ useMemo: вычисляем прямо во время рендера — один рендер, не два
  const lastComputedAt = useRef(new Date().toLocaleTimeString())
  const visibleTodos = useMemo(() => {
    lastComputedAt.current = new Date().toLocaleTimeString()
    if (filter === 'all') return todos
    if (filter === 'done') return todos.filter(t => t.done)
    return todos.filter(t => !t.done)
  }, [todos, filter])

  function handleAdd() {
    if (!newTodo.trim()) return
    setTodos(prev => [...prev, { id: Date.now(), text: newTodo.trim(), done: false }])
    setNewTodo('')
  }

  function handleToggle(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const filters: Filter[] = ['all', 'active', 'done']
  const filterLabels: Record<Filter, string> = { all: 'Все', active: 'Активные', done: 'Выполненные' }

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: useMemo vs useEffect</h2>

      <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #86efac' }}>
        <strong>Счётчик рендеров:</strong>{' '}
        <span style={{ fontSize: 24, fontWeight: 700, color: '#16a34a' }}>{renderCount.current}</span>
        <span style={{ marginLeft: 8, color: '#15803d', fontSize: 14 }}>
          (при useMemo: +1 на действие, не +2)
        </span>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Новое todo (ввод не пересчитывает список)"
          style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: '6px 14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
        >
          Добавить
        </button>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid #d1d5db',
              background: filter === f ? '#3b82f6' : 'white',
              color: filter === f ? 'white' : '#374151',
              cursor: 'pointer',
            }}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div style={{ marginBottom: 8, fontSize: 12, color: '#6b7280' }}>
        Последний пересчёт visibleTodos: <strong>{lastComputedAt.current}</strong>
        {' '}(не меняется при вводе текста)
      </div>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
        {visibleTodos.map(todo => (
          <li
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            style={{
              padding: '8px 12px',
              marginBottom: 4,
              borderRadius: 6,
              background: todo.done ? '#f0fdf4' : '#f9fafb',
              border: '1px solid #e5e7eb',
              cursor: 'pointer',
              textDecoration: todo.done ? 'line-through' : 'none',
              color: todo.done ? '#9ca3af' : '#111827',
            }}
          >
            {todo.done ? '✅' : '⬜'} {todo.text}
          </li>
        ))}
        {visibleTodos.length === 0 && (
          <li style={{ padding: 12, color: '#9ca3af', textAlign: 'center' }}>Пусто</li>
        )}
      </ul>

      <div style={{ marginTop: 16, padding: '10px 14px', background: '#eff6ff', borderRadius: 8, fontSize: 13, color: '#1d4ed8' }}>
        💡 Без useMemo (useState + useEffect): изменение todos → 2 рендера.<br />
        С useMemo: изменение todos → 1 рендер. Ввод в поле → 1 рендер, visibleTodos не пересчитывается.
      </div>
    </div>
  )
}

// ─── Task 6.2 ─────────────────────────────────────────────────────────────────

type ChildProps = {
  style: React.CSSProperties
  onClick: () => void
  label: string
}

const ChildComponent = memo(function ChildComponent({ style, onClick, label }: ChildProps) {
  const renderCount = useRef(0)
  renderCount.current += 1

  return (
    <div style={{ ...style, borderRadius: 8, border: '1px solid #d1d5db', padding: 12 }}>
      <div style={{ marginBottom: 8, fontWeight: 600 }}>{label}</div>
      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280' }}>
        Рендеров Child: <strong style={{ color: renderCount.current > 1 ? '#ef4444' : '#16a34a' }}>{renderCount.current}</strong>
        {renderCount.current > 1 && ' ← React.memo не работает!'}
        {renderCount.current === 1 && ' ← React.memo работает!'}
      </div>
      <button
        onClick={onClick}
        style={{ padding: '4px 10px', background: '#8b5cf6', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}
      >
        Action
      </button>
    </div>
  )
})

export function Task6_2_Solution() {
  const parentRenderCount = useRef(0)
  parentRenderCount.current += 1

  const [parentCount, setParentCount] = useState(0)
  const [childActionCount, setChildActionCount] = useState(0)

  // ✅ useMemo: style — стабильная ссылка, не создаётся заново каждый рендер
  const stableStyle = useMemo(() => ({
    background: '#faf5ff',
  }), [])

  // ✅ useCallback: onClick — стабильная ссылка
  const handleChildClick = useCallback(() => {
    setChildActionCount(c => c + 1)
  }, [])

  // ❌ Плохой вариант для сравнения (закомментирован)
  // const unstableStyle = { background: '#faf5ff' }  // новая ссылка каждый рендер!
  // const unstableClick = () => setChildActionCount(c => c + 1)  // новая ссылка!

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Referential Equality Trap</h2>

      <div style={{ marginBottom: 16, padding: '8px 12px', background: '#f0f9ff', borderRadius: 8, border: '1px solid #bae6fd' }}>
        <strong>Parent рендеров:</strong>{' '}
        <span style={{ fontSize: 20, fontWeight: 700, color: '#0369a1' }}>{parentRenderCount.current}</span>
        {'  '}
        <strong>Child action count:</strong>{' '}
        <span style={{ fontSize: 20, fontWeight: 700, color: '#0369a1' }}>{childActionCount}</span>
      </div>

      <button
        onClick={() => setParentCount(c => c + 1)}
        style={{ marginBottom: 16, padding: '8px 16px', background: '#f59e0b', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
      >
        Trigger Parent Re-render (count: {parentCount})
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, color: '#ef4444' }}>❌ Без стабилизации</div>
          <ChildComponent
            style={{ background: '#fef2f2' }}
            onClick={() => setChildActionCount(c => c + 1)}
            label="Inline style + onClick"
          />
          <div style={{ marginTop: 6, fontSize: 12, color: '#ef4444' }}>
            Этот Child рендерится при каждом рендере Parent
          </div>
        </div>

        <div>
          <div style={{ marginBottom: 8, fontWeight: 600, color: '#16a34a' }}>✅ С useMemo + useCallback</div>
          <ChildComponent
            style={stableStyle}
            onClick={handleChildClick}
            label="Stable style + onClick"
          />
          <div style={{ marginTop: 6, fontSize: 12, color: '#16a34a' }}>
            Этот Child не рендерится — React.memo работает!
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, padding: '10px 14px', background: '#f0fdf4', borderRadius: 8, fontSize: 13 }}>
        💡 <strong>Ключевой вывод:</strong> React.memo сравнивает props через shallowEqual → Object.is.
        Объект {'{ }'} !== {'{ }'} и функция () {'=>'} {'{ }'} !== () {'=>'} {'{ }'} при каждом рендере.
        useMemo + useCallback фиксируют ссылку — shallowEqual возвращает true → bail out.
      </div>
    </div>
  )
}

// ─── Task 6.3 ─────────────────────────────────────────────────────────────────

type Item = {
  id: number
  value: number
  active: boolean
}

function generateItems(count: number): Item[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    value: Math.floor(Math.random() * 1000),
    active: Math.random() > 0.5,
  }))
}

export function Task6_3_Solution() {
  const [tick, setTick] = useState(0)

  // items создаются один раз
  const items = useMemo(() => generateItems(10_000), [])

  // Вариант 1: без мемоизации — пересчитывается каждый рендер
  const t1start = performance.now()
  const expensiveResult = items
    .filter(i => i.active)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
  const time1 = +(performance.now() - t1start).toFixed(3)

  // Вариант 2: useMemo на дешёвом вычислении (overhead > benefit)
  let time2measured = 0
  const cheapMemo = useMemo(() => {
    const t = performance.now()
    const result = items.length  // O(1) — практически бесплатно
    time2measured = +(performance.now() - t).toFixed(4)
    return result
  }, [items])
  const [time2] = useState(() => time2measured)

  // Вариант 3: useMemo на дорогом вычислении (выгодно)
  let time3measured = 0
  const expensiveMemo = useMemo(() => {
    const t = performance.now()
    const result = items
      .filter(i => i.active)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)
    time3measured = +(performance.now() - t).toFixed(3)
    return result
  }, [items])
  const [time3] = useState(() => time3measured)

  const cardStyle: React.CSSProperties = {
    padding: 14,
    borderRadius: 8,
    border: '1px solid #e5e7eb',
    background: '#fafafa',
  }

  const timeStyle = (ms: number, threshold: number): React.CSSProperties => ({
    fontWeight: 700,
    color: ms > threshold ? '#ef4444' : '#16a34a',
    fontSize: 18,
  })

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Memoization Cost-Benefit</h2>

      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          onClick={() => setTick(t => t + 1)}
          style={{ padding: '8px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Trigger Re-render #{tick}
        </button>
        <span style={{ color: '#6b7280', fontSize: 13 }}>
          Re-render не меняет items — только tick
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ ...cardStyle, borderColor: '#fca5a5' }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#dc2626' }}>
            ❌ Без мемоизации
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            filter + sort(10k) при каждом рендере
          </div>
          <div>
            Время: <span style={timeStyle(time1, 0.5)}>{time1} ms</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Топ-5 значений: {expensiveResult.map(i => i.value).join(', ')}
          </div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#fcd34d' }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#d97706' }}>
            ⚠️ useMemo на дешёвом
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            items.length обёрнут в useMemo
          </div>
          <div>
            Первый рендер: <span style={{ fontWeight: 700 }}>{time2} ms</span>
          </div>
          <div style={{ marginTop: 4 }}>
            Кэш: <span style={{ fontWeight: 700, color: '#16a34a' }}>≈ 0 ms</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Результат: {cheapMemo} items
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#d97706' }}>
            Overhead deps-сравнения &gt; O(1) length
          </div>
        </div>

        <div style={{ ...cardStyle, borderColor: '#86efac' }}>
          <div style={{ fontWeight: 600, marginBottom: 8, color: '#16a34a' }}>
            ✅ useMemo на дорогом
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
            filter + sort обёрнуты в useMemo
          </div>
          <div>
            Первый рендер: <span style={{ fontWeight: 700, color: '#d97706' }}>{time3} ms</span>
          </div>
          <div style={{ marginTop: 4 }}>
            Кэш: <span style={{ fontWeight: 700, color: '#16a34a' }}>≈ 0 ms</span>
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
            Топ-5: {expensiveMemo.map(i => i.value).join(', ')}
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: '#16a34a' }}>
            Saved: ~{time1} ms при каждом re-render
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px', background: '#1e293b', borderRadius: 8, color: '#e2e8f0', fontSize: 13 }}>
        <div style={{ fontWeight: 600, marginBottom: 8, color: '#94a3b8' }}>Вывод:</div>
        <div>📌 useMemo на <strong>дорогом</strong> вычислении: сохраняет ~{time1}ms при каждом рендере → <span style={{ color: '#4ade80' }}>выгодно</span></div>
        <div style={{ marginTop: 4 }}>📌 useMemo на <strong>дешёвом</strong> (length): overhead deps-сравнения &gt; O(1) → <span style={{ color: '#f87171' }}>не нужно</span></div>
        <div style={{ marginTop: 4 }}>📌 Правило: измеряй через performance.now(). Если &lt;0.1ms — не мемоизируй.</div>
      </div>
    </div>
  )
}
