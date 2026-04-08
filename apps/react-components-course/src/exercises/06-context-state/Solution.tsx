import { createContext, useContext, useReducer, useCallback, useRef, useState, useEffect } from 'react'

// ============================================
// Task 6.1 Solution: CartProvider + useReducer
// ============================================

// --- Types ---

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'INCREMENT'; id: string }
  | { type: 'DECREMENT'; id: string }
  | { type: 'CLEAR' }

interface CartState {
  items: CartItem[]
}

// --- Reducer ---

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.item, quantity: 1 }] }
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.id !== action.id) }
    case 'INCREMENT':
      return {
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    case 'DECREMENT':
      return {
        items: state.items
          .map(i => i.id === action.id ? { ...i, quantity: i.quantity - 1 } : i)
          .filter(i => i.quantity > 0),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

// --- Contexts: state и dispatch разделены ---

const CartStateContext = createContext<CartState | null>(null)
const CartDispatchContext = createContext<React.Dispatch<CartAction> | null>(null)

function useCartState(): CartState {
  const ctx = useContext(CartStateContext)
  if (!ctx) throw new Error('useCartState must be inside CartProvider')
  return ctx
}

function useCartDispatch(): React.Dispatch<CartAction> {
  const ctx = useContext(CartDispatchContext)
  if (!ctx) throw new Error('useCartDispatch must be inside CartProvider')
  return ctx
}

// --- Provider ---

function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  return (
    <CartStateContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartStateContext.Provider>
  )
}

// --- Sub-components ---

const CATALOG_ITEMS: Omit<CartItem, 'quantity'>[] = [
  { id: 'p1', name: 'Клавиатура Keychron K2', price: 8990 },
  { id: 'p2', name: 'Мышь Logitech MX Master 3', price: 6490 },
  { id: 'p3', name: 'Монитор LG 27"', price: 34990 },
  { id: 'p4', name: 'Коврик для мыши XL', price: 1290 },
]

// Компонент бейджа: подписан только на CartStateContext
function CartBadge() {
  const { items } = useCartState()
  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <span style={{ fontSize: '1.4rem' }}>🛒</span>
      {totalCount > 0 && (
        <span style={{
          position: 'absolute',
          top: -6,
          right: -8,
          background: '#e53935',
          color: '#fff',
          borderRadius: '50%',
          width: 18,
          height: 18,
          fontSize: '0.7rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}>
          {totalCount}
        </span>
      )}
    </div>
  )
}

// Кнопка добавления: использует и dispatch, и state (для отображения статуса)
function AddToCartButton({ item }: { item: Omit<CartItem, 'quantity'> }) {
  const dispatch = useCartDispatch()
  const { items } = useCartState()
  const inCart = items.some(i => i.id === item.id)

  return (
    <button
      onClick={() => dispatch({ type: 'ADD', item })}
      style={{
        padding: '0.4rem 0.8rem',
        background: inCart ? '#4caf50' : '#1976d2',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        transition: 'background 0.2s',
      }}
    >
      {inCart ? 'Ещё ↑' : '+ В корзину'}
    </button>
  )
}

// Шторка корзины: читает state + использует dispatch для управления
function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items } = useCartState()
  const dispatch = useCartDispatch()

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 320,
      background: '#fff', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
      zIndex: 1000, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Корзина ({items.length})</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#666' }}>✕</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem 1.25rem' }}>
        {items.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', marginTop: '2rem' }}>Корзина пуста</p>
        ) : (
          items.map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{item.name}</div>
                <div style={{ color: '#666', fontSize: '0.8rem' }}>{item.price.toLocaleString('ru-RU')} ₽ × {item.quantity}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                <button onClick={() => dispatch({ type: 'DECREMENT', id: item.id })} style={{ width: 24, height: 24, border: '1px solid #ddd', background: '#f5f5f5', borderRadius: '3px', cursor: 'pointer' }}>−</button>
                <span style={{ width: 20, textAlign: 'center', fontSize: '0.85rem' }}>{item.quantity}</span>
                <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })} style={{ width: 24, height: 24, border: '1px solid #ddd', background: '#f5f5f5', borderRadius: '3px', cursor: 'pointer' }}>+</button>
                <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })} style={{ width: 24, height: 24, border: 'none', background: '#ffebee', color: '#e53935', borderRadius: '3px', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
              </div>
            </div>
          ))
        )}
      </div>

      {items.length > 0 && (
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontWeight: 'bold' }}>
            <span>Итого:</span>
            <span>{total.toLocaleString('ru-RU')} ₽</span>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLEAR' })}
            style={{ width: '100%', padding: '0.6rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
          >
            Оформить заказ
          </button>
        </div>
      )}
    </div>
  )
}

export function Task6_1_Solution() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <CartProvider>
      <div className="exercise-container">
        <h2>Решение 6.1: Корзина с useReducer + раздельными Context</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          CartStateContext и CartDispatchContext разделены. Dispatch стабилен — компоненты,
          использующие только dispatch, не ре-рендерятся при изменении state.
        </p>

        {/* Header с бейджем */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: '#1976d2', borderRadius: '8px', marginBottom: '1rem' }}>
          <span style={{ color: '#fff', fontWeight: 600 }}>Магазин</span>
          <button onClick={() => setDrawerOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <CartBadge />
          </button>
        </div>

        {/* Каталог */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {CATALOG_ITEMS.map(item => (
            <div key={item.id} style={{ padding: '0.75rem', border: '1px solid #eee', borderRadius: '8px', background: '#fafafa' }}>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem', fontSize: '0.9rem' }}>{item.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{item.price.toLocaleString('ru-RU')} ₽</span>
                <AddToCartButton item={item} />
              </div>
            </div>
          ))}
        </div>

        <CartDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      </div>
    </CartProvider>
  )
}

// ============================================
// Task 6.2 Solution: Система нотификаций
// ============================================

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  duration: number
}

interface NotificationContextValue {
  notify: (message: string, type?: Notification['type'], duration?: number) => void
  dismiss: (id: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications must be inside NotificationProvider')
  return ctx
}

function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    const timer = timersRef.current.get(id)
    if (timer !== undefined) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const notify = useCallback((
    message: string,
    type: Notification['type'] = 'info',
    duration = 4000
  ) => {
    const id = `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setNotifications(prev => [...prev, { id, message, type, duration }])

    if (duration > 0) {
      const timer = setTimeout(() => dismiss(id), duration)
      timersRef.current.set(id, timer)
    }
  }, [dismiss])

  // Очистка таймеров при размонтировании
  useEffect(() => {
    const timers = timersRef.current
    return () => { timers.forEach(clearTimeout) }
  }, [])

  return (
    <NotificationContext.Provider value={{ notify, dismiss }}>
      {children}
      <NotificationContainer notifications={notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  )
}

const NOTIF_COLORS: Record<Notification['type'], { bg: string; border: string; icon: string }> = {
  info:    { bg: '#e3f2fd', border: '#1976d2', icon: 'ℹ️' },
  success: { bg: '#e8f5e9', border: '#388e3c', icon: '✅' },
  warning: { bg: '#fff8e1', border: '#f57f17', icon: '⚠️' },
  error:   { bg: '#ffebee', border: '#c62828', icon: '❌' },
}

function NotificationContainer({
  notifications,
  onDismiss,
}: {
  notifications: Notification[]
  onDismiss: (id: string) => void
}) {
  if (notifications.length === 0) return null

  return (
    <div style={{
      position: 'fixed',
      top: 16,
      right: 16,
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      maxWidth: 320,
    }}>
      {notifications.map(n => {
        const style = NOTIF_COLORS[n.type]
        return (
          <div
            key={n.id}
            style={{
              background: style.bg,
              border: `1px solid ${style.border}`,
              borderLeft: `4px solid ${style.border}`,
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            <span>{style.icon}</span>
            <span style={{ flex: 1, fontSize: '0.9rem', lineHeight: 1.4 }}>{n.message}</span>
            <button
              onClick={() => onDismiss(n.id)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '1.1rem', padding: 0, lineHeight: 1, marginLeft: '0.25rem' }}
            >
              ×
            </button>
          </div>
        )
      })}
    </div>
  )
}

// Демо-компонент, использующий useNotifications
function NotificationDemo() {
  const { notify } = useNotifications()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
        Нотификации появляются в правом верхнем углу и исчезают автоматически.
        Постоянная нотификация (duration = 0) закрывается только вручную.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => notify('Данные успешно сохранены!', 'success')}
          style={{ padding: '0.5rem 1rem', background: '#388e3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Успех (4с)
        </button>
        <button
          onClick={() => notify('Есть несохранённые изменения', 'warning')}
          style={{ padding: '0.5rem 1rem', background: '#f57f17', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Предупреждение (4с)
        </button>
        <button
          onClick={() => notify('Ошибка сети. Попробуйте снова.', 'error', 6000)}
          style={{ padding: '0.5rem 1rem', background: '#c62828', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Ошибка (6с)
        </button>
        <button
          onClick={() => notify('Новое обновление доступно', 'info')}
          style={{ padding: '0.5rem 1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Инфо (4с)
        </button>
        <button
          onClick={() => notify('Постоянная нотификация — закройте вручную', 'warning', 0)}
          style={{ padding: '0.5rem 1rem', background: '#555', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Постоянная (∞)
        </button>
      </div>
    </div>
  )
}

export function Task6_2_Solution() {
  return (
    <NotificationProvider>
      <div className="exercise-container">
        <h2>Решение 6.2: Система нотификаций</h2>
        <NotificationDemo />
      </div>
    </NotificationProvider>
  )
}

// ============================================
// Task 6.3 Solution: createStore generic factory
// ============================================

type StoreReducer<S, A> = (state: S, action: A) => S
type Selector<S, R> = (state: S) => R

function createStore<S, A>(
  reducer: StoreReducer<S, A>,
  initialState: S
): {
  Provider: React.FC<{ children: React.ReactNode }>
  useStore: <R>(selector: Selector<S, R>) => R
  useDispatch: () => React.Dispatch<A>
} {
  const StateContext = createContext<S>(initialState)
  const DispatchContext = createContext<React.Dispatch<A>>(() => {})

  const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>
          {children}
        </DispatchContext.Provider>
      </StateContext.Provider>
    )
  }

  // useStore с селектором — компонент ре-рендерится только если результат селектора изменился
  function useStore<R>(selector: Selector<S, R>): R {
    const state = useContext(StateContext)
    return selector(state)
  }

  function useDispatch(): React.Dispatch<A> {
    return useContext(DispatchContext)
  }

  return { Provider, useStore, useDispatch }
}

// --- Todo List demo ---

interface Todo {
  id: string
  text: string
  done: boolean
}

interface TodoState {
  todos: Todo[]
  filter: 'all' | 'active' | 'done'
}

type TodoAction =
  | { type: 'ADD'; text: string }
  | { type: 'TOGGLE'; id: string }
  | { type: 'REMOVE'; id: string }
  | { type: 'SET_FILTER'; filter: TodoState['filter'] }

const initialTodoState: TodoState = {
  todos: [
    { id: '1', text: 'Изучить useReducer', done: true },
    { id: '2', text: 'Разделить State и Dispatch контексты', done: false },
    { id: '3', text: 'Создать generic createStore', done: false },
  ],
  filter: 'all',
}

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now().toString(), text: action.text, done: false }],
      }
    case 'TOGGLE':
      return {
        ...state,
        todos: state.todos.map(t => t.id === action.id ? { ...t, done: !t.done } : t),
      }
    case 'REMOVE':
      return { ...state, todos: state.todos.filter(t => t.id !== action.id) }
    case 'SET_FILTER':
      return { ...state, filter: action.filter }
    default:
      return state
  }
}

const {
  Provider: TodoProvider,
  useStore: useTodoStore,
  useDispatch: useTodoDispatch,
} = createStore(todoReducer, initialTodoState)

// Подписан только на отфильтрованный список через селектор
function TodoList() {
  const visibleTodos = useTodoStore(state => {
    if (state.filter === 'active') return state.todos.filter(t => !t.done)
    if (state.filter === 'done') return state.todos.filter(t => t.done)
    return state.todos
  })
  const dispatch = useTodoDispatch()

  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {visibleTodos.map(todo => (
        <li
          key={todo.id}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid #f0f0f0' }}
        >
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => dispatch({ type: 'TOGGLE', id: todo.id })}
            style={{ cursor: 'pointer' }}
          />
          <span style={{
            flex: 1,
            textDecoration: todo.done ? 'line-through' : 'none',
            color: todo.done ? '#999' : '#333',
          }}>
            {todo.text}
          </span>
          <button
            onClick={() => dispatch({ type: 'REMOVE', id: todo.id })}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e53935', fontSize: '1rem' }}
          >
            ×
          </button>
        </li>
      ))}
      {visibleTodos.length === 0 && (
        <li style={{ color: '#999', padding: '0.75rem 0', textAlign: 'center', fontSize: '0.9rem' }}>
          Нет задач
        </li>
      )}
    </ul>
  )
}

// Подписан только на счётчики — не ре-рендерится при смене filter
function TodoStats() {
  const total = useTodoStore(s => s.todos.length)
  const done = useTodoStore(s => s.todos.filter(t => t.done).length)
  const active = useTodoStore(s => s.todos.filter(t => !t.done).length)

  return (
    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>
      <span>Всего: <strong>{total}</strong></span>
      <span style={{ color: '#388e3c' }}>Готово: <strong>{done}</strong></span>
      <span style={{ color: '#1976d2' }}>Активных: <strong>{active}</strong></span>
    </div>
  )
}

// Подписан только на filter
function TodoFilters() {
  const filter = useTodoStore(s => s.filter)
  const dispatch = useTodoDispatch()

  const filters: Array<{ value: TodoState['filter']; label: string }> = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'done', label: 'Выполненные' },
  ]

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
      {filters.map(f => (
        <button
          key={f.value}
          onClick={() => dispatch({ type: 'SET_FILTER', filter: f.value })}
          style={{
            padding: '0.3rem 0.75rem',
            background: filter === f.value ? '#1976d2' : '#f5f5f5',
            color: filter === f.value ? '#fff' : '#555',
            border: '1px solid',
            borderColor: filter === f.value ? '#1976d2' : '#ddd',
            borderRadius: '20px',
            cursor: 'pointer',
            fontSize: '0.8rem',
          }}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

function TodoAddForm() {
  const [text, setText] = useState('')
  const dispatch = useTodoDispatch()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    dispatch({ type: 'ADD', text: trimmed })
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Новая задача..."
        style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem' }}
      />
      <button
        type="submit"
        disabled={!text.trim()}
        style={{
          padding: '0.5rem 1rem',
          background: text.trim() ? '#1976d2' : '#ccc',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: text.trim() ? 'pointer' : 'default',
        }}
      >
        Добавить
      </button>
    </form>
  )
}

export function Task6_3_Solution() {
  return (
    <TodoProvider>
      <div className="exercise-container">
        <h2>Решение 6.3: createStore — generic фабрика</h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1rem' }}>
          Фабрика <code>createStore&lt;S, A&gt;</code> возвращает <code>[Provider, useStore, useDispatch]</code>.
          Каждый компонент подписывается через селектор и ре-рендерится только при изменении нужного среза.
        </p>

        <div style={{ maxWidth: 420, background: '#fff', border: '1px solid #eee', borderRadius: '10px', padding: '1.25rem' }}>
          <TodoStats />
          <TodoFilters />
          <TodoAddForm />
          <TodoList />
        </div>
      </div>
    </TodoProvider>
  )
}
