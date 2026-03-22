import { makeAutoObservable, makeObservable, observable, action, computed } from 'mobx'
import { observer } from 'mobx-react-lite'

// ============================================
// Task 1.1: makeAutoObservable — Solution
// ============================================

class TemperatureStore {
  celsius = 0

  constructor() {
    makeAutoObservable(this)
  }

  setCelsius(value: number) {
    this.celsius = value
  }

  get fahrenheit() {
    return this.celsius * 9 / 5 + 32
  }

  get description() {
    if (this.celsius < 0) return 'Freezing'
    if (this.celsius < 15) return 'Cold'
    if (this.celsius < 25) return 'Comfortable'
    return 'Hot'
  }
}

const tempStore = new TemperatureStore()

export const Task1_1_Solution = observer(function Task1_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 1.1: makeAutoObservable</h2>
      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Celsius</label>
          <input
            type="number"
            value={tempStore.celsius}
            onChange={e => tempStore.setCelsius(Number(e.target.value))}
          />
        </div>
        <p>Fahrenheit: <strong>{tempStore.fahrenheit.toFixed(1)}°F</strong></p>
        <p>Description: <strong>{tempStore.description}</strong></p>
      </div>
    </div>
  )
})

// ============================================
// Task 1.2: makeObservable — Solution
// ============================================

class UserStore {
  firstName = ''
  lastName = ''

  constructor() {
    makeObservable(this, {
      firstName: observable,
      lastName: observable,
      setFirstName: action,
      setLastName: action,
      fullName: computed,
      initials: computed,
    })
  }

  setFirstName(value: string) {
    this.firstName = value
  }

  setLastName(value: string) {
    this.lastName = value
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`.trim()
  }

  get initials() {
    const parts = this.fullName.split(' ').filter(Boolean)
    return parts.map(p => p[0].toUpperCase()).join('')
  }
}

const userStore = new UserStore()

export const Task1_2_Solution = observer(function Task1_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 1.2: makeObservable</h2>
      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>First Name</label>
          <input
            value={userStore.firstName}
            onChange={e => userStore.setFirstName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            value={userStore.lastName}
            onChange={e => userStore.setLastName(e.target.value)}
          />
        </div>
        <p>Full name: <strong>{userStore.fullName || '(empty)'}</strong></p>
        <p>Initials: <strong>{userStore.initials || '—'}</strong></p>
      </div>
    </div>
  )
})

// ============================================
// Task 1.3: Observable Types — Solution
// ============================================

class CollectionStore {
  items: string[] = []
  tags = new Map<string, string>()
  selectedIds = new Set<number>()

  constructor() {
    makeAutoObservable(this)
  }

  addItem(item: string) {
    this.items.push(item)
  }

  removeItem(index: number) {
    this.items.splice(index, 1)
  }

  setTag(key: string, value: string) {
    this.tags.set(key, value)
  }

  removeTag(key: string) {
    this.tags.delete(key)
  }

  toggleId(id: number) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id)
    } else {
      this.selectedIds.add(id)
    }
  }

  get summary() {
    return `${this.items.length} items, ${this.tags.size} tags, ${this.selectedIds.size} selected`
  }
}

const collectionStore = new CollectionStore()

export const Task1_3_Solution = observer(function Task1_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 1.3: Observable Types</h2>
      <p>{collectionStore.summary}</p>

      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <div>
          <h3>Array</h3>
          <button onClick={() => collectionStore.addItem(`Item ${collectionStore.items.length + 1}`)}>
            Add Item
          </button>
          <ul>
            {collectionStore.items.map((item, i) => (
              <li key={i}>
                {item}{' '}
                <button onClick={() => collectionStore.removeItem(i)} style={{ padding: '0.2em 0.5em', fontSize: '0.8em' }}>x</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Map</h3>
          <button onClick={() => collectionStore.setTag(`key${collectionStore.tags.size}`, `val${collectionStore.tags.size}`)}>
            Add Tag
          </button>
          <ul>
            {Array.from(collectionStore.tags.entries()).map(([k, v]) => (
              <li key={k}>
                {k}: {v}{' '}
                <button onClick={() => collectionStore.removeTag(k)} style={{ padding: '0.2em 0.5em', fontSize: '0.8em' }}>x</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Set</h3>
          {[1, 2, 3, 4, 5].map(id => (
            <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <input
                type="checkbox"
                checked={collectionStore.selectedIds.has(id)}
                onChange={() => collectionStore.toggleId(id)}
              />
              ID {id}
            </label>
          ))}
        </div>
      </div>
    </div>
  )
})

// ============================================
// Task 1.4: observable.ref & shallow — Solution
// ============================================

interface DataItem {
  id: number
  name: string
  value: number
}

class DataStore {
  // observable.ref: MobX tracks reference changes only, not deep mutations
  items: DataItem[] = []

  constructor() {
    makeObservable(this, {
      items: observable.ref,
      setItems: action,
      sortedItems: computed,
    })
  }

  setItems(newItems: DataItem[]) {
    this.items = newItems
  }

  get sortedItems() {
    return [...this.items].sort((a, b) => a.value - b.value)
  }
}

const dataStore = new DataStore()
dataStore.setItems([
  { id: 1, name: 'Alpha', value: 30 },
  { id: 2, name: 'Beta', value: 10 },
  { id: 3, name: 'Gamma', value: 20 },
])

export const Task1_4_Solution = observer(function Task1_4_Solution() {
  const addRandom = () => {
    const newItem: DataItem = {
      id: Date.now(),
      name: `Item-${Math.random().toString(36).slice(2, 6)}`,
      value: Math.floor(Math.random() * 100),
    }
    // Must replace the whole array (ref tracking)
    dataStore.setItems([...dataStore.items, newItem])
  }

  const removeFirst = () => {
    dataStore.setItems(dataStore.items.slice(1))
  }

  return (
    <div className="exercise-container">
      <h2>Task 1.4: observable.ref</h2>
      <p>Items tracked by reference — must replace array, not mutate.</p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={addRandom}>Add Random</button>
        <button onClick={removeFirst}>Remove First</button>
      </div>

      <h3>Original order:</h3>
      <ul>
        {dataStore.items.map(item => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>

      <h3>Sorted by value:</h3>
      <ul>
        {dataStore.sortedItems.map(item => (
          <li key={item.id}>{item.name}: {item.value}</li>
        ))}
      </ul>
    </div>
  )
})
