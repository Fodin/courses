import { useRef } from 'react'
import { makeAutoObservable, intercept, observe } from 'mobx'
import { observer } from 'mobx-react-lite'

// ============================================
// Task 8.1: Granular Observer — Solution
// ============================================

class BigListStore {
  items = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    name: `Item ${i + 1}`,
    value: Math.floor(Math.random() * 100),
  }))

  constructor() {
    makeAutoObservable(this)
  }

  incrementValue(id: number) {
    const item = this.items.find(i => i.id === id)
    if (item) item.value++
  }

  get total() {
    return this.items.reduce((sum, i) => sum + i.value, 0)
  }
}

const bigListStore = new BigListStore()

const BigListItem = observer(function BigListItem({ item }: { item: { id: number; name: string; value: number } }) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <tr>
      <td style={{ padding: '2px 8px' }}>{item.name}</td>
      <td style={{ padding: '2px 8px', textAlign: 'right' }}>{item.value}</td>
      <td style={{ padding: '2px 8px' }}>
        <button onClick={() => bigListStore.incrementValue(item.id)} style={{ padding: '0 6px', fontSize: '0.8em' }}>+1</button>
      </td>
      <td style={{ padding: '2px 8px', color: '#999', fontSize: '0.8em' }}>{renderCount.current}</td>
    </tr>
  )
})

export const Task8_1_Solution = observer(function Task8_1_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 8.1: Granular Observer</h2>
      <p>Total: {bigListStore.total} | Only clicked item re-renders</p>
      <div style={{ maxHeight: '300px', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '4px 8px' }}>Name</th>
              <th style={{ textAlign: 'right', padding: '4px 8px' }}>Value</th>
              <th style={{ padding: '4px 8px' }}></th>
              <th style={{ padding: '4px 8px', fontSize: '0.8em' }}>Renders</th>
            </tr>
          </thead>
          <tbody>
            {bigListStore.items.map(item => (
              <BigListItem key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})

// ============================================
// Task 8.2: intercept & observe — Solution
// ============================================

class AgeStore {
  age = 25
  log: string[] = []

  constructor() {
    makeAutoObservable(this)

    intercept(this, 'age', change => {
      if (change.type !== 'update') return change
      const newVal = change.newValue as number
      if (newVal < 0 || newVal > 150) {
        this.log.push(`[intercept] Blocked: ${newVal} (out of range 0-150)`)
        return null
      }
      return change
    })

    observe(this, 'age', change => {
      this.log.push(`[observe] age: ${change.oldValue} -> ${change.newValue}`)
    })
  }

  setAge(value: number) {
    this.age = value
  }

  clearLog() {
    this.log = []
  }
}

const ageStore = new AgeStore()

export const Task8_2_Solution = observer(function Task8_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 8.2: intercept & observe</h2>
      <div style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Age (0-150):</label>
          <input type="number" value={ageStore.age} onChange={e => ageStore.setAge(Number(e.target.value))} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button onClick={() => ageStore.setAge(-5)}>Set -5 (blocked)</button>
          <button onClick={() => ageStore.setAge(200)}>Set 200 (blocked)</button>
          <button onClick={() => ageStore.clearLog()}>Clear log</button>
        </div>
        <div style={{ background: '#1a1a2e', color: '#0f0', padding: '0.5rem', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.85em', maxHeight: '150px', overflow: 'auto' }}>
          {ageStore.log.map((entry, i) => <div key={i}>{entry}</div>)}
          {ageStore.log.length === 0 && <div style={{ color: '#666' }}>Log empty</div>}
        </div>
      </div>
    </div>
  )
})
