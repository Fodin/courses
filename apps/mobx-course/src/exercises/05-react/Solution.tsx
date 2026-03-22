import { createContext, useContext, useState, useRef } from 'react'
import { makeAutoObservable } from 'mobx'
import { observer, useLocalObservable } from 'mobx-react-lite'

// ============================================
// Task 5.1: observer HOC — Solution
// ============================================

class TimerStore {
  seconds = 0
  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor() {
    makeAutoObservable(this)
  }

  start() {
    if (this.intervalId) return
    this.intervalId = setInterval(() => {
      this.tick()
    }, 1000)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  tick() {
    this.seconds++
  }

  reset() {
    this.stop()
    this.seconds = 0
  }

  get formatted() {
    const mins = Math.floor(this.seconds / 60)
    const secs = this.seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

const timerStore = new TimerStore()

export const Task5_1_Solution = observer(function Task5_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 5.1: observer HOC</h2>
      <p style={{ fontSize: '2em', fontFamily: 'monospace' }}>{timerStore.formatted}</p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => timerStore.start()}>Start</button>
        <button onClick={() => timerStore.stop()}>Stop</button>
        <button onClick={() => timerStore.reset()}>Reset</button>
      </div>
    </div>
  )
})

// ============================================
// Task 5.2: useLocalObservable — Solution
// ============================================

export const Task5_2_Solution = observer(function Task5_2_Solution() {
  const form = useLocalObservable(() => ({
    name: '',
    email: '',
    message: '',
    setName(v: string) { this.name = v },
    setEmail(v: string) { this.email = v },
    setMessage(v: string) { this.message = v },
    get isValid() {
      return this.name.length > 0 && this.email.includes('@') && this.message.length >= 10
    },
    get summary() {
      return `${this.name} (${this.email}): ${this.message.slice(0, 30)}...`
    },
  }))

  return (
    <div className="exercise-container">
      <h2>Task 5.2: useLocalObservable</h2>
      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Name</label>
          <input value={form.name} onChange={e => form.setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input value={form.email} onChange={e => form.setEmail(e.target.value)} type="email" />
        </div>
        <div className="form-group">
          <label>Message (min 10 chars)</label>
          <textarea value={form.message} onChange={e => form.setMessage(e.target.value)} rows={3} style={{ width: '100%' }} />
        </div>
        <p>Valid: {form.isValid ? 'Yes' : 'No'}</p>
        {form.isValid && <p>Preview: {form.summary}</p>}
      </div>
    </div>
  )
})

// ============================================
// Task 5.3: Store via Context — Solution
// ============================================

interface Todo {
  id: string
  title: string
  completed: boolean
}

class TodoStore {
  todos: Todo[] = []
  filter: 'all' | 'active' | 'completed' = 'all'

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string) {
    this.todos.push({ id: crypto.randomUUID(), title, completed: false })
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter(t => t.id !== id)
  }

  toggleTodo(id: string) {
    const todo = this.todos.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter = filter
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active': return this.todos.filter(t => !t.completed)
      case 'completed': return this.todos.filter(t => t.completed)
      default: return this.todos
    }
  }

  get activeCount() {
    return this.todos.filter(t => !t.completed).length
  }
}

const TodoContext = createContext<TodoStore | null>(null)

function useTodoStore() {
  const store = useContext(TodoContext)
  if (!store) throw new Error('TodoStore not provided')
  return store
}

const TodoList = observer(function TodoList() {
  const store = useTodoStore()
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {store.filteredTodos.map(todo => (
        <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
          <input type="checkbox" checked={todo.completed} onChange={() => store.toggleTodo(todo.id)} />
          <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#999' : 'inherit' }}>
            {todo.title}
          </span>
          <button onClick={() => store.removeTodo(todo.id)} style={{ padding: '0.2em 0.5em', fontSize: '0.8em' }}>x</button>
        </li>
      ))}
    </ul>
  )
})

const TodoFilters = observer(function TodoFilters() {
  const store = useTodoStore()
  return (
    <div style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0' }}>
      {(['all', 'active', 'completed'] as const).map(f => (
        <button key={f} onClick={() => store.setFilter(f)} style={{ fontWeight: store.filter === f ? 'bold' : 'normal' }}>
          {f} {f === 'active' ? `(${store.activeCount})` : ''}
        </button>
      ))}
    </div>
  )
})

export function Task5_3_Solution() {
  const [store] = useState(() => new TodoStore())
  const [input, setInput] = useState('')

  return (
    <TodoContext.Provider value={store}>
      <div className="exercise-container">
        <h2>Task 5.3: Store via Context</h2>
        <div style={{ maxWidth: '400px' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder="New todo..." style={{ flex: 1 }}
              onKeyDown={e => { if (e.key === 'Enter' && input.trim()) { store.addTodo(input.trim()); setInput('') } }}
            />
            <button onClick={() => { if (input.trim()) { store.addTodo(input.trim()); setInput('') } }}>Add</button>
          </div>
          <TodoFilters />
          <TodoList />
        </div>
      </div>
    </TodoContext.Provider>
  )
}

// ============================================
// Task 5.4: Observer & Children — Solution
// ============================================

class ItemStore {
  items = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    count: 0,
  }))

  constructor() {
    makeAutoObservable(this)
  }

  increment(id: number) {
    const item = this.items.find(i => i.id === id)
    if (item) item.count++
  }
}

const itemStore = new ItemStore()

const ListItem = observer(function ListItem({ item }: { item: { id: number; name: string; count: number } }) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <li style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', borderBottom: '1px solid #eee' }}>
      <span>{item.name}: {item.count}</span>
      <span>
        <button onClick={() => itemStore.increment(item.id)} style={{ padding: '0.1em 0.5em', fontSize: '0.8em' }}>+1</button>
        <small style={{ color: '#999', marginLeft: '0.5rem' }}>renders: {renderCount.current}</small>
      </span>
    </li>
  )
})

export const Task5_4_Solution = observer(function Task5_4_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 5.4: Observer & Children</h2>
      <p>Click +1 on any item. Only that item re-renders (check render count).</p>
      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '400px' }}>
        {itemStore.items.map(item => (
          <ListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  )
})
