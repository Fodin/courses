import { makeAutoObservable, configure, runInAction, action } from 'mobx'
import { observer } from 'mobx-react-lite'
import { useRef } from 'react'

// ============================================
// Task 2.1: Основы action — Solution
// ============================================

configure({ enforceActions: 'always' })

class CounterStore {
  count = 0
  history: number[] = []

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.count += 1
    this.history.push(this.count)
  }

  decrement() {
    this.count -= 1
    this.history.push(this.count)
  }

  reset() {
    this.count = 0
    this.history = []
  }
}

const counterStore = new CounterStore()

export const Task2_1_Solution = observer(function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 2.1: action basics</h2>
      <p>Count: <strong>{counterStore.count}</strong></p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => counterStore.increment()}>+1</button>
        <button onClick={() => counterStore.decrement()}>-1</button>
        <button onClick={() => counterStore.reset()}>Reset</button>
      </div>
      <p>History: {counterStore.history.join(', ') || '(empty)'}</p>
    </div>
  )
})

// ============================================
// Task 2.2: runInAction — Solution
// ============================================

interface User {
  id: number
  name: string
  email: string
}

class UserLoaderStore {
  user: User | null = null
  loading = false
  error = ''

  constructor() {
    makeAutoObservable(this)
  }

  async loadUser(id: number) {
    this.loading = true
    this.error = ''

    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const fakeUser: User = {
        id,
        name: `User #${id}`,
        email: `user${id}@example.com`,
      }

      runInAction(() => {
        this.user = fakeUser
        this.loading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = 'Failed to load user'
        this.loading = false
      })
    }
  }
}

const userLoaderStore = new UserLoaderStore()

export const Task2_2_Solution = observer(function Task2_2_Solution() {
  const loadRandom = () => {
    const id = Math.floor(Math.random() * 100) + 1
    userLoaderStore.loadUser(id)
  }

  return (
    <div className="exercise-container">
      <h2>Task 2.2: runInAction</h2>
      <button onClick={loadRandom} disabled={userLoaderStore.loading}>
        {userLoaderStore.loading ? 'Loading...' : 'Load Random User'}
      </button>

      {userLoaderStore.error && (
        <p style={{ color: 'red' }}>{userLoaderStore.error}</p>
      )}

      {userLoaderStore.user && (
        <div style={{ marginTop: '1rem' }}>
          <p>ID: <strong>{userLoaderStore.user.id}</strong></p>
          <p>Name: <strong>{userLoaderStore.user.name}</strong></p>
          <p>Email: <strong>{userLoaderStore.user.email}</strong></p>
        </div>
      )}
    </div>
  )
})

// ============================================
// Task 2.3: Bound actions — Solution
// ============================================

class TimerStore {
  seconds = 0
  running = false
  private intervalId: ReturnType<typeof setInterval> | null = null

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  start() {
    if (this.running) return
    this.running = true
    this.intervalId = setInterval(this.tick, 1000)
  }

  stop() {
    if (!this.running) return
    this.running = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  tick() {
    this.seconds += 1
  }

  reset() {
    this.stop()
    this.seconds = 0
  }

  get formatted() {
    const mins = Math.floor(this.seconds / 60)
    const secs = this.seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
}

const timerStore = new TimerStore()

export const Task2_3_Solution = observer(function Task2_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 2.3: Bound actions</h2>
      <p style={{ fontSize: '2rem', fontFamily: 'monospace' }}>
        {timerStore.formatted}
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={timerStore.start} disabled={timerStore.running}>
          Start
        </button>
        <button onClick={timerStore.stop} disabled={!timerStore.running}>
          Stop
        </button>
        <button onClick={timerStore.reset}>
          Reset
        </button>
      </div>
    </div>
  )
})

// ============================================
// Task 2.4: Батчинг — Solution
// ============================================

class ProfileStore {
  firstName = ''
  lastName = ''
  age = 0

  constructor() {
    makeAutoObservable(this)
  }

  updateProfile(first: string, last: string, age: number) {
    this.firstName = first
    this.lastName = last
    this.age = age
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }
}

const profileStore = new ProfileStore()

export const Task2_4_Solution = observer(function Task2_4_Solution() {
  const renderCount = useRef(0)
  renderCount.current += 1

  const fillProfile = () => {
    profileStore.updateProfile('John', 'Doe', 30)
  }

  const fillAnother = () => {
    profileStore.updateProfile('Jane', 'Smith', 25)
  }

  const clearProfile = () => {
    profileStore.updateProfile('', '', 0)
  }

  return (
    <div className="exercise-container">
      <h2>Task 2.4: Batching</h2>
      <p>
        Render count: <strong>{renderCount.current}</strong>
      </p>
      <p>Name: <strong>{profileStore.fullName || '(empty)'}</strong></p>
      <p>Age: <strong>{profileStore.age || '—'}</strong></p>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
        <button onClick={fillProfile}>John Doe, 30</button>
        <button onClick={fillAnother}>Jane Smith, 25</button>
        <button onClick={clearProfile}>Clear</button>
      </div>

      <p style={{ marginTop: '1rem', fontSize: '0.9em', opacity: 0.7 }}>
        All 3 fields update in one action = one re-render
      </p>
    </div>
  )
})
