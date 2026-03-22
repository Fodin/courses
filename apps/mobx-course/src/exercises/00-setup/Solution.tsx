import { makeAutoObservable } from 'mobx'
import { observer } from 'mobx-react-lite'

// ============================================
// Task 0.1: First Store — Solution
// ============================================

class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}

export function Task0_1_Solution() {
  const store = new CounterStore()

  store.increment()
  store.increment()
  store.increment()
  store.decrement()

  console.log('count:', store.count) // 2

  return (
    <div className="exercise-container">
      <h2>Task 0.1: First Store (console)</h2>
      <p>Open DevTools (F12) to see the console output.</p>
      <p>
        Final count: <strong>{store.count}</strong>
      </p>
      <pre>
        {`const store = new CounterStore()
store.increment() // 1
store.increment() // 2
store.increment() // 3
store.decrement() // 2
console.log(store.count) // 2`}
      </pre>
    </div>
  )
}

// ============================================
// Task 0.2: Store + React — Solution
// ============================================

const counterStore = new CounterStore()

export const Task0_2_Solution = observer(function Task0_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 0.2: Store + React</h2>
      <p>
        Count: <strong>{counterStore.count}</strong>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={() => counterStore.decrement()}>-1</button>
        <button onClick={() => counterStore.increment()}>+1</button>
      </div>
    </div>
  )
})

// ============================================
// Task 0.3: Multiple Fields — Solution
// ============================================

class ProfileStore {
  name = ''
  age = 0
  bio = ''

  constructor() {
    makeAutoObservable(this)
  }

  setName(value: string) {
    this.name = value
  }

  setAge(value: number) {
    this.age = value
  }

  setBio(value: string) {
    this.bio = value
  }

  get summary() {
    return `${this.name}, ${this.age} years old`
  }
}

const profileStore = new ProfileStore()

export const Task0_3_Solution = observer(function Task0_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 0.3: Multiple Fields</h2>

      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            value={profileStore.name}
            onChange={(e) => profileStore.setName(e.target.value)}
            placeholder="Enter name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={profileStore.age}
            onChange={(e) => profileStore.setAge(Number(e.target.value))}
            placeholder="Enter age"
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={profileStore.bio}
            onChange={(e) => profileStore.setBio(e.target.value)}
            placeholder="Tell about yourself"
            rows={3}
          />
        </div>

        {profileStore.name && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: 'var(--color-bg-secondary, #f5f5f5)',
              borderRadius: '8px',
            }}
          >
            <h3>Profile Preview</h3>
            <p>
              <strong>Summary:</strong> {profileStore.summary}
            </p>
            <p>
              <strong>Bio:</strong> {profileStore.bio || '(empty)'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
})
