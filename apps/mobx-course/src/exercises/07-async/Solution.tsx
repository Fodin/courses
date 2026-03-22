import { useEffect, useState } from 'react'
import { makeAutoObservable, runInAction, flow } from 'mobx'
import { observer } from 'mobx-react-lite'

// Mock API
interface User {
  id: string
  name: string
  email: string
}

const mockApi = {
  fetchUsers: (): Promise<User[]> =>
    new Promise(resolve =>
      setTimeout(() => resolve([
        { id: '1', name: 'Alice', email: 'alice@example.com' },
        { id: '2', name: 'Bob', email: 'bob@example.com' },
        { id: '3', name: 'Charlie', email: 'charlie@example.com' },
      ]), 1000)
    ),
  toggleTodo: (id: string): Promise<void> =>
    new Promise((resolve, reject) =>
      setTimeout(() => (Math.random() > 0.3 ? resolve() : reject(new Error('Server error'))), 500)
    ),
}

// ============================================
// Task 7.1: Async + runInAction — Solution
// ============================================

class UserStoreAsync {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchUsers() {
    this.isLoading = true
    this.error = null
    try {
      const users = await mockApi.fetchUsers()
      runInAction(() => {
        this.users = users
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message
        this.isLoading = false
      })
    }
  }
}

const userStoreAsync = new UserStoreAsync()

export const Task7_1_Solution = observer(function Task7_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 7.1: Async + runInAction</h2>
      <button onClick={() => userStoreAsync.fetchUsers()} disabled={userStoreAsync.isLoading}>
        {userStoreAsync.isLoading ? 'Loading...' : 'Fetch Users'}
      </button>
      {userStoreAsync.error && <p style={{ color: 'red' }}>{userStoreAsync.error}</p>}
      <ul>
        {userStoreAsync.users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 7.2: flow generators — Solution
// ============================================

class UserStoreFlow {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  fetchUsers = flow(function* (this: UserStoreFlow) {
    this.isLoading = true
    this.error = null
    try {
      this.users = yield mockApi.fetchUsers()
      this.isLoading = false
    } catch (e) {
      this.error = (e as Error).message
      this.isLoading = false
    }
  })
}

const userStoreFlow = new UserStoreFlow()

export const Task7_2_Solution = observer(function Task7_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 7.2: flow generators</h2>
      <button onClick={() => userStoreFlow.fetchUsers()} disabled={userStoreFlow.isLoading}>
        {userStoreFlow.isLoading ? 'Loading...' : 'Fetch Users (flow)'}
      </button>
      {userStoreFlow.error && <p style={{ color: 'red' }}>{userStoreFlow.error}</p>}
      <ul>
        {userStoreFlow.users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 7.3: Cancelling flow — Solution
// ============================================

class SlowDataStore {
  data: string | null = null
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  fetchData = flow(function* (this: SlowDataStore) {
    this.isLoading = true
    try {
      yield new Promise(resolve => setTimeout(resolve, 3000))
      this.data = 'Data loaded at ' + new Date().toLocaleTimeString()
    } finally {
      this.isLoading = false
    }
  })
}

export const Task7_3_Solution = observer(function Task7_3_Solution() {
  const [store] = useState(() => new SlowDataStore())
  const [flowPromise, setFlowPromise] = useState<{ cancel(): void } | null>(null)

  useEffect(() => {
    const promise = store.fetchData()
    setFlowPromise(promise)
    return () => {
      promise.cancel()
    }
  }, [store])

  return (
    <div className="exercise-container">
      <h2>Task 7.3: Cancelling flow</h2>
      {store.isLoading && <p>Loading (3 sec)... <button onClick={() => flowPromise?.cancel()}>Cancel</button></p>}
      {store.data && <p>{store.data}</p>}
      {!store.isLoading && !store.data && <p>Cancelled or not started</p>}
      <button onClick={() => setFlowPromise(store.fetchData())} disabled={store.isLoading}>
        Reload
      </button>
    </div>
  )
})

// ============================================
// Task 7.4: Loading & Cache — Solution
// ============================================

class CachedUserStore {
  users: User[] = []
  isLoading = false
  lastFetchedAt: number | null = null
  maxAge = 5000

  constructor() {
    makeAutoObservable(this)
  }

  get isStale() {
    if (!this.lastFetchedAt) return true
    return Date.now() - this.lastFetchedAt > this.maxAge
  }

  async fetchIfNeeded() {
    if (!this.isStale) {
      console.log('[cache] Data is fresh, skipping fetch')
      return
    }
    this.isLoading = true
    try {
      const users = await mockApi.fetchUsers()
      runInAction(() => {
        this.users = users
        this.lastFetchedAt = Date.now()
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => { this.isLoading = false })
    }
  }

  invalidate() {
    this.lastFetchedAt = null
  }
}

const cachedStore = new CachedUserStore()

export const Task7_4_Solution = observer(function Task7_4_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 7.4: Loading & Cache</h2>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => cachedStore.fetchIfNeeded()} disabled={cachedStore.isLoading}>
          {cachedStore.isLoading ? 'Loading...' : 'Fetch if needed'}
        </button>
        <button onClick={() => cachedStore.invalidate()}>Invalidate cache</button>
      </div>
      <p>Stale: {cachedStore.isStale ? 'Yes' : `No (${Math.round((cachedStore.maxAge - (Date.now() - (cachedStore.lastFetchedAt || 0))) / 1000)}s left)`}</p>
      <ul>
        {cachedStore.users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  )
})

// ============================================
// Task 7.5: Optimistic Updates — Solution
// ============================================

interface OptTodo {
  id: string
  title: string
  completed: boolean
  pending?: boolean
}

class OptimisticTodoStore {
  todos: OptTodo[] = [
    { id: '1', title: 'Buy groceries', completed: false },
    { id: '2', title: 'Write code', completed: true },
    { id: '3', title: 'Read docs', completed: false },
  ]
  lastError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async toggle(id: string) {
    const todo = this.todos.find(t => t.id === id)
    if (!todo) return

    const prevState = todo.completed
    runInAction(() => {
      todo.completed = !todo.completed
      todo.pending = true
      this.lastError = null
    })

    try {
      await mockApi.toggleTodo(id)
      runInAction(() => { todo.pending = false })
    } catch {
      runInAction(() => {
        todo.completed = prevState
        todo.pending = false
        this.lastError = `Failed to toggle "${todo.title}" — rolled back`
      })
    }
  }
}

const optStore = new OptimisticTodoStore()

export const Task7_5_Solution = observer(function Task7_5_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 7.5: Optimistic Updates</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>Toggle has ~30% chance of server error (with rollback)</p>
      {optStore.lastError && <p style={{ color: 'red' }}>{optStore.lastError}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {optStore.todos.map(todo => (
          <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', opacity: todo.pending ? 0.5 : 1 }}>
            <input type="checkbox" checked={todo.completed} onChange={() => optStore.toggle(todo.id)} disabled={todo.pending} />
            <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.title}</span>
            {todo.pending && <small>(saving...)</small>}
          </li>
        ))}
      </ul>
    </div>
  )
})
