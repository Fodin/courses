import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react'
import { produce } from 'immer'

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

const btnStyle = (variant: 'default' | 'active' | 'danger' | 'success' = 'default'): React.CSSProperties => ({
  background:
    variant === 'active' ? '#1e3a5f' :
    variant === 'danger' ? '#4c1d1d' :
    variant === 'success' ? '#14532d' :
    '#374151',
  color:
    variant === 'active' ? '#93c5fd' :
    variant === 'danger' ? '#fca5a5' :
    variant === 'success' ? '#86efac' :
    '#e5e7eb',
  border: `1px solid ${
    variant === 'active' ? '#3b82f6' :
    variant === 'danger' ? '#ef4444' :
    variant === 'success' ? '#22c55e' :
    '#4b5563'
  }`,
  borderRadius: '6px',
  padding: '0.35rem 0.9rem',
  cursor: 'pointer',
  fontSize: '0.82rem',
  fontFamily: 'monospace',
  marginRight: '0.4rem',
  marginBottom: '0.4rem',
})

const sectionTitle: React.CSSProperties = {
  color: '#f9fafb',
  fontWeight: 700,
  fontSize: '0.95rem',
  marginBottom: '0.75rem',
  borderBottom: '1px solid #374151',
  paddingBottom: '0.4rem',
}

const inputStyle: React.CSSProperties = {
  background: '#0f172a',
  border: '1px solid #374151',
  color: '#e5e7eb',
  borderRadius: '4px',
  padding: '0.35rem 0.6rem',
  fontFamily: 'monospace',
  fontSize: '0.82rem',
  outline: 'none',
}

const badgeStyle = (color: 'green' | 'red' | 'yellow' | 'blue' | 'gray'): React.CSSProperties => ({
  display: 'inline-block',
  padding: '0.15rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.75rem',
  fontWeight: 600,
  background:
    color === 'green' ? '#14532d' :
    color === 'red' ? '#7f1d1d' :
    color === 'yellow' ? '#78350f' :
    color === 'blue' ? '#1e3a5f' :
    '#1f2937',
  color:
    color === 'green' ? '#86efac' :
    color === 'red' ? '#fca5a5' :
    color === 'yellow' ? '#fde68a' :
    color === 'blue' ? '#93c5fd' :
    '#9ca3af',
})

// ============================================
// Task 12.1: Иммутабельный стейт-менеджмент
// ============================================

interface Todo {
  id: number
  text: string
  done: boolean
}

type TodoAction =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'DELETE_TODO'; id: number }

interface TodoState {
  todos: Todo[]
  nextId: number
}

interface History {
  past: TodoState[]
  present: TodoState
  future: TodoState[]
}

const initialTodoState: TodoState = {
  todos: [
    { id: 1, text: 'Изучить FP', done: true },
    { id: 2, text: 'Применить в React', done: false },
  ],
  nextId: 3,
}

// Pure reducer with Immer produce
const todoReducer = (state: TodoState, action: TodoAction): TodoState =>
  produce(state, draft => {
    switch (action.type) {
      case 'ADD_TODO':
        draft.todos.push({ id: draft.nextId, text: action.text, done: false })
        draft.nextId++
        break
      case 'TOGGLE_TODO': {
        const todo = draft.todos.find(t => t.id === action.id)
        if (todo) todo.done = !todo.done
        break
      }
      case 'DELETE_TODO':
        draft.todos = draft.todos.filter(t => t.id !== action.id)
        break
    }
  })

// History-aware dispatch
function useUndoableReducer() {
  const [history, setHistory] = useState<History>({
    past: [],
    present: initialTodoState,
    future: [],
  })

  const dispatch = useCallback((action: TodoAction) => {
    setHistory(h => ({
      past: [...h.past, h.present],
      present: todoReducer(h.present, action),
      future: [],
    }))
  }, [])

  const undo = useCallback(() => {
    setHistory(h => {
      if (h.past.length === 0) return h
      const previous = h.past[h.past.length - 1]
      return {
        past: h.past.slice(0, -1),
        present: previous,
        future: [h.present, ...h.future],
      }
    })
  }, [])

  const redo = useCallback(() => {
    setHistory(h => {
      if (h.future.length === 0) return h
      const next = h.future[0]
      return {
        past: [...h.past, h.present],
        present: next,
        future: h.future.slice(1),
      }
    })
  }, [])

  const jumpTo = useCallback((index: number) => {
    setHistory(h => {
      const all = [...h.past, h.present, ...h.future]
      const target = all[index]
      if (!target) return h
      return {
        past: all.slice(0, index),
        present: target,
        future: all.slice(index + 1),
      }
    })
  }, [])

  return { history, dispatch, undo, redo, jumpTo }
}

export function Task12_1_Solution() {
  const { history, dispatch, undo, redo, jumpTo } = useUndoableReducer()
  const [inputText, setInputText] = useState('')
  const state = history.present
  const allStates = [...history.past, state, ...history.future]
  const currentIndex = history.past.length

  const handleAdd = () => {
    const trimmed = inputText.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD_TODO', text: trimmed })
    setInputText('')
  }

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #374151' }}>
        <div style={{ color: '#f9fafb', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Иммутабельный стейт-менеджмент
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>
          Mini-Redux: pure reducer + Immer produce + Undo/Redo через стек состояний
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1rem' }}>
        {/* Left: Todo app */}
        <div>
          <div style={panelStyle}>
            <div style={sectionTitle}>Todo-приложение</div>

            {/* Add todo */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAdd()}
                placeholder="Новое задание..."
              />
              <button style={btnStyle('success')} onClick={handleAdd}>
                Добавить
              </button>
            </div>

            {/* Undo / Redo */}
            <div style={{ marginBottom: '1rem' }}>
              <button
                style={btnStyle(history.past.length > 0 ? 'active' : 'default')}
                onClick={undo}
                disabled={history.past.length === 0}
              >
                Undo
              </button>
              <button
                style={btnStyle(history.future.length > 0 ? 'active' : 'default')}
                onClick={redo}
                disabled={history.future.length === 0}
              >
                Redo
              </button>
              <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                Past: {history.past.length} | Future: {history.future.length}
              </span>
            </div>

            {/* Todo list */}
            {state.todos.length === 0 && (
              <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '0.5rem 0' }}>
                Список пуст
              </div>
            )}
            {state.todos.map(todo => (
              <div
                key={todo.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.45rem 0.6rem',
                  borderRadius: '6px',
                  background: '#111827',
                  marginBottom: '0.4rem',
                  border: '1px solid #374151',
                }}
              >
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => dispatch({ type: 'TOGGLE_TODO', id: todo.id })}
                  style={{ cursor: 'pointer', accentColor: '#3b82f6' }}
                />
                <span
                  style={{
                    flex: 1,
                    textDecoration: todo.done ? 'line-through' : 'none',
                    color: todo.done ? '#6b7280' : '#e5e7eb',
                  }}
                >
                  {todo.text}
                </span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    padding: '0 0.25rem',
                  }}
                  onClick={() => dispatch({ type: 'DELETE_TODO', id: todo.id })}
                  title="Удалить"
                >
                  x
                </button>
              </div>
            ))}
          </div>

          {/* Reducer code */}
          <div style={panelStyle}>
            <div style={sectionTitle}>Reducer с Immer</div>
            <div style={codeBlock}>{`const reducer = (state: State, action: Action): State =>
  produce(state, draft => {
    switch (action.type) {
      case 'ADD_TODO':
        draft.todos.push({ id: draft.nextId++, ... })
        break
      case 'TOGGLE_TODO':
        const todo = draft.todos.find(t => t.id === action.id)
        if (todo) todo.done = !todo.done   // мутация безопасна внутри produce!
        break
    }
  })

// Undo: сохраняем весь state в стеке
const dispatch = (action) => setHistory(h => ({
  past: [...h.past, h.present],
  present: reducer(h.present, action),
  future: [],            // при новом действии future сбрасывается
}))`}</div>
          </div>
        </div>

        {/* Right: History panel */}
        <div>
          <div style={panelStyle}>
            <div style={sectionTitle}>История состояний</div>
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.75rem' }}>
              Кликните на состояние, чтобы перейти к нему
            </div>
            <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
              {allStates.map((s, idx) => {
                const isCurrent = idx === currentIndex
                const isPast = idx < currentIndex
                return (
                  <div
                    key={idx}
                    onClick={() => jumpTo(idx)}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '6px',
                      marginBottom: '0.35rem',
                      cursor: 'pointer',
                      border: `1px solid ${isCurrent ? '#3b82f6' : '#374151'}`,
                      background: isCurrent ? '#1e3a5f' : isPast ? '#111827' : '#1a2a1a',
                      opacity: 1,
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                        #{idx}
                      </span>
                      <span style={badgeStyle(isCurrent ? 'blue' : isPast ? 'gray' : 'green')}>
                        {isCurrent ? 'current' : isPast ? 'past' : 'future'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {s.todos.length} todo{s.todos.length !== 1 ? 's' : ''}
                      {' · '}
                      {s.todos.filter(t => t.done).length} done
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 12.2: Композиция хуков
// ============================================

// Validation rule: string → array of error messages
type ValidationRule = (value: string) => string[]

// pipe for combining validation rules (collect all errors)
function pipeRules(...rules: ValidationRule[]): ValidationRule {
  return (value: string) => rules.flatMap(rule => rule(value))
}

// Individual rules
const checkRequired = (msg: string): ValidationRule =>
  value => value.trim().length === 0 ? [msg] : []

const checkMinLength = (min: number, msg: string): ValidationRule =>
  value => value.trim().length > 0 && value.trim().length < min ? [msg] : []

const checkPattern = (pattern: RegExp, msg: string): ValidationRule =>
  value => value.trim().length > 0 && !pattern.test(value.trim()) ? [msg] : []

// Hook 1: useValidation
function useValidation(rules: ValidationRule[]) {
  const validate = useCallback(
    (value: string) => pipeRules(...rules)(value),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
  const [errors, setErrors] = useState<string[]>([])
  const touch = useCallback((value: string) => {
    setErrors(validate(value))
  }, [validate])
  return { errors, touch, validate }
}

// Hook 2: useDebouncedValue
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// Hook 3: useFilteredList
type FilterFn<T> = (item: T) => boolean

function useFilteredList<T>(items: T[], filters: FilterFn<T>[]): T[] {
  return items.filter(item => filters.every(f => f(item)))
}

// Sample product data
interface Product {
  id: number
  name: string
  category: string
  price: number
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Apple', category: 'Fruits', price: 1.2 },
  { id: 2, name: 'Banana', category: 'Fruits', price: 0.5 },
  { id: 3, name: 'Carrot', category: 'Vegetables', price: 0.8 },
  { id: 4, name: 'Broccoli', category: 'Vegetables', price: 1.5 },
  { id: 5, name: 'Cherry', category: 'Fruits', price: 3.0 },
  { id: 6, name: 'Potato', category: 'Vegetables', price: 0.4 },
  { id: 7, name: 'Orange', category: 'Fruits', price: 0.9 },
  { id: 8, name: 'Spinach', category: 'Vegetables', price: 2.1 },
]

const CATEGORIES = ['All', 'Fruits', 'Vegetables']

// Filter factories (composable)
const byCategory = (cat: string): FilterFn<Product> =>
  item => cat === 'All' || item.category === cat

const byPriceRange = (min: number, max: number): FilterFn<Product> =>
  item => item.price >= min && item.price <= max

const bySearchTerm = (term: string): FilterFn<Product> =>
  item => item.name.toLowerCase().includes(term.toLowerCase())

export function Task12_2_Solution() {
  // Hook 1 state: validation
  const nameValidation = useValidation([
    checkRequired('Обязательное поле'),
    checkMinLength(3, 'Минимум 3 символа'),
    checkPattern(/^[a-zA-Z]+$/, 'Только латинские буквы'),
  ])
  const [nameValue, setNameValue] = useState('')

  // Hook 2 state: debounced search
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebouncedValue(searchTerm, 300)

  // Hook 3 state: filters
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(5)

  const filtered = useFilteredList(PRODUCTS, [
    byCategory(selectedCategory),
    byPriceRange(minPrice, maxPrice),
    bySearchTerm(debouncedSearch),
  ])

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #374151' }}>
        <div style={{ color: '#f9fafb', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Композиция хуков
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>
          useValidation + useDebouncedValue + useFilteredList
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left column */}
        <div>
          {/* Hook 1: Validation */}
          <div style={panelStyle}>
            <div style={sectionTitle}>useValidation — поле "Имя"</div>
            <div style={{ marginBottom: '0.75rem', fontSize: '0.78rem', color: '#6b7280' }}>
              Правила через pipeRules: required → minLength(3) → pattern(/^[a-zA-Z]+$/)
            </div>
            <input
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}
              value={nameValue}
              onChange={e => {
                setNameValue(e.target.value)
                nameValidation.touch(e.target.value)
              }}
              placeholder="Введите имя..."
            />
            {nameValidation.errors.length > 0 ? (
              <div>
                {nameValidation.errors.map((err, i) => (
                  <div
                    key={i}
                    style={{
                      color: '#fca5a5',
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.4rem',
                      background: '#3b0f0f',
                      borderRadius: '4px',
                      marginBottom: '0.2rem',
                    }}
                  >
                    {err}
                  </div>
                ))}
              </div>
            ) : nameValue.length > 0 ? (
              <div style={{ color: '#86efac', fontSize: '0.75rem' }}>Валидно</div>
            ) : null}
            <div style={{ ...codeBlock, marginTop: '0.75rem' }}>{`const validate = pipeRules(
  checkRequired('Обязательное поле'),
  checkMinLength(3, 'Минимум 3 символа'),
  checkPattern(/^[a-zA-Z]+$/, 'Только латиница')
)
// каждое правило: (value) => string[]
// pipeRules собирает ВСЕ ошибки`}</div>
          </div>

          {/* Hook 2: Debounce */}
          <div style={panelStyle}>
            <div style={sectionTitle}>useDebouncedValue (300ms)</div>
            <input
              style={{ ...inputStyle, width: '100%', boxSizing: 'border-box', marginBottom: '0.5rem' }}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Поиск продукта..."
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: '#9ca3af' }}>
                Сейчас: <span style={{ color: '#e5e7eb' }}>{searchTerm || '(пусто)'}</span>
              </span>
              <span style={{ color: '#9ca3af' }}>
                Дебаунс: <span style={{ color: '#93c5fd' }}>{debouncedSearch || '(пусто)'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Hook 3: FilteredList */}
          <div style={panelStyle}>
            <div style={sectionTitle}>useFilteredList — продукты</div>

            {/* Category filter */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>Категория:</div>
              <div>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    style={btnStyle(selectedCategory === cat ? 'active' : 'default')}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>
                Цена: ${minPrice.toFixed(1)} – ${maxPrice.toFixed(1)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={minPrice}
                  onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice))}
                  style={{ flex: 1, accentColor: '#3b82f6' }}
                />
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.1}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice))}
                  style={{ flex: 1, accentColor: '#3b82f6' }}
                />
              </div>
            </div>

            {/* Results */}
            <div style={{ color: '#6b7280', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
              Результат: {filtered.length} / {PRODUCTS.length}
            </div>
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {filtered.map(p => (
                <div
                  key={p.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.3rem 0.5rem',
                    borderRadius: '4px',
                    background: '#111827',
                    marginBottom: '0.25rem',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ color: '#e5e7eb' }}>{p.name}</span>
                  <span style={{ color: '#9ca3af' }}>{p.category}</span>
                  <span style={{ color: '#86efac' }}>${p.price.toFixed(2)}</span>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ color: '#6b7280', fontSize: '0.8rem', padding: '0.5rem 0' }}>
                  Нет результатов
                </div>
              )}
            </div>

            <div style={{ ...codeBlock, marginTop: '0.75rem' }}>{`const filtered = useFilteredList(products, [
  byCategory(selectedCategory),
  byPriceRange(min, max),
  bySearchTerm(debouncedSearch),
])
// filters.every(f => f(item)) — все фильтры AND`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Task 12.3: RemoteData и Match
// ============================================

// ADT: RemoteData
type RemoteData<E, A> =
  | { tag: 'NotAsked' }
  | { tag: 'Loading' }
  | { tag: 'Failure'; error: E }
  | { tag: 'Success'; data: A }

// Constructors
const notAsked = <E, A>(): RemoteData<E, A> => ({ tag: 'NotAsked' })
const loading = <E, A>(): RemoteData<E, A> => ({ tag: 'Loading' })
const failure = <E, A>(error: E): RemoteData<E, A> => ({ tag: 'Failure', error })
const success = <E, A>(data: A): RemoteData<E, A> => ({ tag: 'Success', data })

// Methods
function mapRD<E, A, B>(rd: RemoteData<E, A>, f: (a: A) => B): RemoteData<E, B> {
  if (rd.tag === 'Success') return success(f(rd.data))
  return rd as RemoteData<E, B>
}

function getOrElse<E, A>(rd: RemoteData<E, A>, fallback: A): A {
  if (rd.tag === 'Success') return rd.data
  return fallback
}

// Match component: exhaustive pattern matching
interface MatchProps<E, A> {
  data: RemoteData<E, A>
  notAsked: () => ReactNode
  loading: () => ReactNode
  failure: (e: E) => ReactNode
  success: (a: A) => ReactNode
}

function Match<E, A>({ data, notAsked, loading, failure, success }: MatchProps<E, A>): ReactNode {
  switch (data.tag) {
    case 'NotAsked': return notAsked()
    case 'Loading':  return loading()
    case 'Failure':  return failure(data.error)
    case 'Success':  return success(data.data)
  }
}

// Sample user type
interface User {
  id: number
  name: string
  email: string
}

const MOCK_USERS: User[] = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com' },
  { id: 3, name: 'Carol White', email: 'carol@example.com' },
]

// Spinner component
function Spinner() {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    const id = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 400)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#93c5fd', padding: '0.5rem 0' }}>
      <div
        style={{
          width: '14px',
          height: '14px',
          border: '2px solid #374151',
          borderTop: '2px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      Загрузка{dots}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}

export function Task12_3_Solution() {
  const [rdState, setRdState] = useState<RemoteData<string, User[]>>(notAsked())
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  const handleLoad = () => {
    clearTimer()
    setRdState(loading())
    timerRef.current = setTimeout(() => {
      setRdState(success(MOCK_USERS))
    }, 1500)
  }

  const handleError = () => {
    clearTimer()
    setRdState(loading())
    timerRef.current = setTimeout(() => {
      setRdState(failure('Ошибка сети: сервер не ответил за 5 секунд'))
    }, 1500)
  }

  const handleReset = () => {
    clearTimer()
    setRdState(notAsked())
  }

  // Derived with map
  const userCount = getOrElse(mapRD(rdState, users => users.length), 0)

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #374151' }}>
        <div style={{ color: '#f9fafb', fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          RemoteData и Match
        </div>
        <div style={{ color: '#6b7280', fontSize: '0.78rem' }}>
          ADT для состояний загрузки + exhaustive pattern matching
        </div>
      </div>

      {/* Buttons */}
      <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        <button style={btnStyle()} onClick={handleReset}>Не загружено</button>
        <button style={btnStyle('success')} onClick={handleLoad}>Загрузить</button>
        <button style={btnStyle('danger')} onClick={handleError}>Симулировать ошибку</button>
        <span style={{ ...badgeStyle('blue'), alignSelf: 'center', marginLeft: '0.5rem' }}>
          {rdState.tag}
        </span>
        {rdState.tag === 'Success' && (
          <span style={{ ...badgeStyle('green'), alignSelf: 'center' }}>
            {userCount} пользователей
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Left: if/else approach */}
        <div style={panelStyle}>
          <div style={sectionTitle}>if/else подход</div>
          <div style={{ ...codeBlock, marginBottom: '0.75rem' }}>{`// Типичный код без ADT:
let content
if (state === 'loading') {
  content = <Spinner />
} else if (state === 'error') {
  content = <Error msg={error} />
} else if (state === 'success') {
  content = <UserList users={users} />
} else {
  content = <Placeholder />
}
// Проблемы:
// - нет гарантии exhaustive
// - state и data — отдельные переменные
// - легко забыть состояние`}</div>
          <div style={{ padding: '0.5rem', background: '#111827', borderRadius: '6px' }}>
            {rdState.tag === 'NotAsked' && (
              <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                (NotAsked) Нажмите "Загрузить"
              </div>
            )}
            {rdState.tag === 'Loading' && <Spinner />}
            {rdState.tag === 'Failure' && (
              <div style={{ color: '#fca5a5', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                Ошибка: {(rdState as { tag: 'Failure'; error: string }).error}
              </div>
            )}
            {rdState.tag === 'Success' && (
              <div>
                {(rdState as { tag: 'Success'; data: User[] }).data.map(u => (
                  <div key={u.id} style={{ fontSize: '0.8rem', padding: '0.25rem 0', color: '#e5e7eb' }}>
                    {u.name} — {u.email}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Match component */}
        <div style={panelStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ ...sectionTitle, marginBottom: 0 }}>Match компонент</div>
            <span style={badgeStyle('green')}>exhaustive</span>
          </div>
          <div style={{ ...codeBlock, marginBottom: '0.75rem' }}>{`// ADT + Match — чисто и безопасно:
<Match
  data={rd}
  notAsked={() => <Placeholder />}
  loading={() => <Spinner />}
  failure={e => <Error msg={e} />}
  success={users => <UserList users={users} />}
/>
// Плюсы:
// + TypeScript заставит покрыть все случаи
// + state и data — одна переменная
// + невозможно пропустить состояние`}</div>
          <div style={{ padding: '0.5rem', background: '#111827', borderRadius: '6px' }}>
            <Match
              data={rdState}
              notAsked={() => (
                <div style={{ color: '#6b7280', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                  Нажмите "Загрузить"
                </div>
              )}
              loading={() => <Spinner />}
              failure={e => (
                <div style={{ color: '#fca5a5', fontSize: '0.82rem', padding: '0.25rem 0' }}>
                  Ошибка: {e}
                </div>
              )}
              success={users => (
                <div>
                  {users.map(u => (
                    <div key={u.id} style={{ fontSize: '0.8rem', padding: '0.25rem 0', color: '#e5e7eb' }}>
                      {u.name} — {u.email}
                    </div>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* RemoteData methods demo */}
      <div style={{ ...panelStyle, marginTop: '1rem' }}>
        <div style={sectionTitle}>Методы RemoteData</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>map</div>
            <div style={{ ...codeBlock, marginTop: 0 }}>{`mapRD(rd, users => users.length)
// Success([...]) → Success(3)
// Loading → Loading
// Failure(e) → Failure(e)`}</div>
          </div>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>getOrElse</div>
            <div style={{ ...codeBlock, marginTop: 0 }}>{`getOrElse(rd, 0)
// Success(3) → 3
// Loading → 0
// Failure → 0
// NotAsked → 0`}</div>
          </div>
          <div>
            <div style={{ color: '#9ca3af', fontSize: '0.75rem', marginBottom: '0.3rem' }}>текущий результат</div>
            <div style={{ ...codeBlock, marginTop: 0 }}>{`mapRD(rdState, u => u.length)
// → ${rdState.tag === 'Success' ? `Success(${userCount})` : rdState.tag}

getOrElse(mapped, 0)
// → ${userCount}`}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
