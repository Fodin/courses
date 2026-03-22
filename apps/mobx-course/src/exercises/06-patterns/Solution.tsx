import { makeAutoObservable, computed } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'

// ============================================
// Task 6.1: Domain Store — Solution
// ============================================

class TodoStore {
  todos: { id: string; title: string; completed: boolean }[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string) {
    this.todos.push({
      id: crypto.randomUUID(),
      title,
      completed: false,
    })
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id)
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length
  }

  get activeCount() {
    return this.todos.filter((t) => !t.completed).length
  }
}

const todoStore = new TodoStore()

export const Task6_1_Solution = observer(function Task6_1_Solution() {
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (title.trim()) {
      todoStore.addTodo(title.trim())
      setTitle('')
    }
  }

  return (
    <div className="exercise-container">
      <h2>Task 6.1: Domain Store</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New todo..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <span>Active: {todoStore.activeCount}</span>
        {' | '}
        <span>Completed: {todoStore.completedCount}</span>
        {' | '}
        <span>Total: {todoStore.todos.length}</span>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todoStore.todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => todoStore.toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                flex: 1,
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => todoStore.removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 6.2: UI Store — Solution
// ============================================

type FilterType = 'all' | 'active' | 'completed'

class TodoDomainStore {
  todos: { id: string; title: string; completed: boolean }[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string) {
    this.todos.push({
      id: crypto.randomUUID(),
      title,
      completed: false,
    })
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id)
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length
  }

  get activeCount() {
    return this.todos.filter((t) => !t.completed).length
  }
}

class TodoUIStore {
  filter: FilterType = 'all'
  editingId: string | null = null
  isAddFormOpen = false

  constructor(private domainStore: TodoDomainStore) {
    makeAutoObservable(this)
  }

  setFilter(filter: FilterType) {
    this.filter = filter
  }

  setEditingId(id: string | null) {
    this.editingId = id
  }

  toggleAddForm() {
    this.isAddFormOpen = !this.isAddFormOpen
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.domainStore.todos.filter((t) => !t.completed)
      case 'completed':
        return this.domainStore.todos.filter((t) => t.completed)
      default:
        return this.domainStore.todos
    }
  }
}

const domainStore62 = new TodoDomainStore()
const uiStore62 = new TodoUIStore(domainStore62)

export const Task6_2_Solution = observer(function Task6_2_Solution() {
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    if (title.trim()) {
      domainStore62.addTodo(title.trim())
      setTitle('')
      uiStore62.isAddFormOpen = false
    }
  }

  return (
    <div className="exercise-container">
      <h2>Task 6.2: UI Store</h2>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => uiStore62.toggleAddForm()}>
          {uiStore62.isAddFormOpen ? 'Cancel' : '+ Add Todo'}
        </button>
      </div>

      {uiStore62.isAddFormOpen && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="New todo..."
            autoFocus
          />
          <button onClick={handleAdd}>Save</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => uiStore62.setFilter(f)}
            style={{
              fontWeight: uiStore62.filter === f ? 'bold' : 'normal',
              textDecoration: uiStore62.filter === f ? 'underline' : 'none',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {uiStore62.filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
              background:
                uiStore62.editingId === todo.id
                  ? 'var(--color-bg-secondary, #f0f0f0)'
                  : 'transparent',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => domainStore62.toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                flex: 1,
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => uiStore62.setEditingId(todo.id)}>Edit</button>
            <button onClick={() => domainStore62.removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p style={{ color: 'gray', fontSize: '0.85rem' }}>
        Showing: {uiStore62.filteredTodos.length} / {domainStore62.todos.length}
      </p>
    </div>
  )
})

// ============================================
// Task 6.3: Root Store — Solution
// ============================================

class TodoDomainStore63 {
  todos: { id: string; title: string; completed: boolean }[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string) {
    this.todos.push({ id: crypto.randomUUID(), title, completed: false })
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id)
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length
  }

  get activeCount() {
    return this.todos.filter((t) => !t.completed).length
  }
}

class TodoUIStore63 {
  filter: FilterType = 'all'
  editingId: string | null = null

  constructor(private root: RootStore63) {
    makeAutoObservable(this)
  }

  setFilter(filter: FilterType) {
    this.filter = filter
  }

  get filteredTodos() {
    const todos = this.root.todoStore.todos
    switch (this.filter) {
      case 'active':
        return todos.filter((t) => !t.completed)
      case 'completed':
        return todos.filter((t) => t.completed)
      default:
        return todos
    }
  }
}

class RootStore63 {
  todoStore: TodoDomainStore63
  uiStore: TodoUIStore63

  constructor() {
    this.todoStore = new TodoDomainStore63()
    this.uiStore = new TodoUIStore63(this)
  }
}

const rootStore63 = new RootStore63()

export const Task6_3_Solution = observer(function Task6_3_Solution() {
  const [title, setTitle] = useState('')
  const { todoStore: ts, uiStore: ui } = rootStore63

  const handleAdd = () => {
    if (title.trim()) {
      ts.addTodo(title.trim())
      setTitle('')
    }
  }

  return (
    <div className="exercise-container">
      <h2>Task 6.3: Root Store</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New todo..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => ui.setFilter(f)}
            style={{
              fontWeight: ui.filter === f ? 'bold' : 'normal',
            }}
          >
            {f} {f === 'active' && `(${ts.activeCount})`}
            {f === 'completed' && `(${ts.completedCount})`}
            {f === 'all' && `(${ts.todos.length})`}
          </button>
        ))}
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {ui.filteredTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 0',
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => ts.toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
                flex: 1,
              }}
            >
              {todo.title}
            </span>
            <button onClick={() => ts.removeTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 6.4: Store with Models — Solution
// ============================================

class Todo {
  id: string
  title: string
  completed = false
  createdAt: Date
  deadline: Date | null

  constructor(title: string, deadline?: Date) {
    this.id = crypto.randomUUID()
    this.title = title
    this.createdAt = new Date()
    this.deadline = deadline ?? null
    makeAutoObservable(this)
  }

  toggle() {
    this.completed = !this.completed
  }

  get isOverdue() {
    if (!this.deadline || this.completed) return false
    return new Date() > this.deadline
  }

  get status(): 'completed' | 'overdue' | 'active' {
    if (this.completed) return 'completed'
    if (this.isOverdue) return 'overdue'
    return 'active'
  }
}

class TodoModelStore {
  todos: Todo[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string, deadline?: Date) {
    this.todos.push(new Todo(title, deadline))
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id)
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length
  }

  get overdueCount() {
    return this.todos.filter((t) => t.isOverdue).length
  }
}

const todoModelStore = new TodoModelStore()

const statusColors: Record<string, string> = {
  completed: '#4caf50',
  overdue: '#f44336',
  active: '#2196f3',
}

export const Task6_4_Solution = observer(function Task6_4_Solution() {
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')

  const handleAdd = () => {
    if (title.trim()) {
      todoModelStore.addTodo(
        title.trim(),
        deadline ? new Date(deadline) : undefined,
      )
      setTitle('')
      setDeadline('')
    }
  }

  return (
    <div className="exercise-container">
      <h2>Task 6.4: Store with Models</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Todo title..."
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <p>
        Total: {todoModelStore.todos.length} | Completed: {todoModelStore.completedCount} | Overdue: {todoModelStore.overdueCount}
      </p>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todoModelStore.todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} onRemove={() => todoModelStore.removeTodo(todo.id)} />
        ))}
      </ul>
    </div>
  )
})

const TodoItem = observer(function TodoItem({
  todo,
  onRemove,
}: {
  todo: Todo
  onRemove: () => void
}) {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        borderLeft: `3px solid ${statusColors[todo.status]}`,
        marginBottom: '0.25rem',
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => todo.toggle()}
      />
      <span
        style={{
          textDecoration: todo.completed ? 'line-through' : 'none',
          flex: 1,
        }}
      >
        {todo.title}
      </span>
      <span
        style={{
          fontSize: '0.75rem',
          color: statusColors[todo.status],
          textTransform: 'uppercase',
        }}
      >
        {todo.status}
      </span>
      {todo.deadline && (
        <span style={{ fontSize: '0.75rem', color: 'gray' }}>
          {todo.deadline.toLocaleDateString()}
        </span>
      )}
      <button onClick={onRemove}>Delete</button>
    </li>
  )
})
