import { useEffect, useRef, useState } from 'react'
import { makeAutoObservable, autorun, intercept, observe, runInAction } from 'mobx'
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

// ============================================
// Task 8.3: Serialization — Solution
// ============================================

class SettingsStore {
  theme: 'light' | 'dark' = 'light'
  fontSize = 16
  language = 'en'
  notifications = true

  constructor(storageKey: string) {
    makeAutoObservable(this)
    this.hydrate(storageKey)
    autorun(() => {
      localStorage.setItem(storageKey, JSON.stringify(this.toJSON()))
    })
  }

  toJSON() {
    return {
      theme: this.theme,
      fontSize: this.fontSize,
      language: this.language,
      notifications: this.notifications,
    }
  }

  hydrate(storageKey: string) {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return
    try {
      const data = JSON.parse(raw)
      runInAction(() => {
        if (data.theme) this.theme = data.theme
        if (data.fontSize) this.fontSize = data.fontSize
        if (data.language) this.language = data.language
        if (typeof data.notifications === 'boolean') this.notifications = data.notifications
      })
    } catch { /* ignore */ }
  }

  setTheme(t: 'light' | 'dark') { this.theme = t }
  setFontSize(s: number) { this.fontSize = s }
  setLanguage(l: string) { this.language = l }
  toggleNotifications() { this.notifications = !this.notifications }
}

const settingsStore = new SettingsStore('mobx-course-settings-demo')

export const Task8_3_Solution = observer(function Task8_3_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 8.3: Serialization</h2>
      <p style={{ fontSize: '0.9em', color: '#666' }}>Settings persist in localStorage. Reload page to verify.</p>
      <div style={{ maxWidth: '300px' }}>
        <div className="form-group">
          <label>Theme</label>
          <select value={settingsStore.theme} onChange={e => settingsStore.setTheme(e.target.value as 'light' | 'dark')}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="form-group">
          <label>Font Size: {settingsStore.fontSize}px</label>
          <input type="range" min={12} max={24} value={settingsStore.fontSize} onChange={e => settingsStore.setFontSize(Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Language</label>
          <select value={settingsStore.language} onChange={e => settingsStore.setLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="ru">Russian</option>
            <option value="de">German</option>
          </select>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input type="checkbox" checked={settingsStore.notifications} onChange={() => settingsStore.toggleNotifications()} />
          Notifications
        </label>
        <pre style={{ marginTop: '1rem', fontSize: '0.85em' }}>{JSON.stringify(settingsStore.toJSON(), null, 2)}</pre>
      </div>
    </div>
  )
})

// ============================================
// Task 8.4: Testing Stores — Solution
// ============================================

class CartStoreForTest {
  items: { name: string; price: number; qty: number }[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addItem(name: string, price: number) {
    this.items.push({ name, price, qty: 1 })
  }

  get totalPrice() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }

  get itemCount() {
    return this.items.length
  }

  clear() {
    this.items = []
  }
}

function runTests(): { name: string; passed: boolean; error?: string }[] {
  const results: { name: string; passed: boolean; error?: string }[] = []

  function test(name: string, fn: () => void) {
    try { fn(); results.push({ name, passed: true }) }
    catch (e) { results.push({ name, passed: false, error: (e as Error).message }) }
  }

  function expect(actual: unknown) {
    return {
      toBe(expected: unknown) {
        if (actual !== expected) throw new Error(`Expected ${expected}, got ${actual}`)
      },
    }
  }

  test('starts empty', () => {
    const store = new CartStoreForTest()
    expect(store.itemCount).toBe(0)
    expect(store.totalPrice).toBe(0)
  })

  test('adds items', () => {
    const store = new CartStoreForTest()
    store.addItem('Widget', 10)
    expect(store.itemCount).toBe(1)
    expect(store.totalPrice).toBe(10)
  })

  test('calculates total for multiple items', () => {
    const store = new CartStoreForTest()
    store.addItem('A', 10)
    store.addItem('B', 20)
    expect(store.totalPrice).toBe(30)
  })

  test('clear removes all items', () => {
    const store = new CartStoreForTest()
    store.addItem('A', 10)
    store.clear()
    expect(store.itemCount).toBe(0)
  })

  return results
}

export function Task8_4_Solution() {
  const [results, setResults] = useState<{ name: string; passed: boolean; error?: string }[]>([])

  return (
    <div className="exercise-container">
      <h2>Task 8.4: Testing Stores</h2>
      <button onClick={() => setResults(runTests())}>Run Tests</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: '0.25rem 0', color: r.passed ? 'green' : 'red' }}>
              {r.passed ? 'PASS' : 'FAIL'} {r.name} {r.error && `— ${r.error}`}
            </div>
          ))}
          <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>
            {results.filter(r => r.passed).length}/{results.length} passed
          </p>
        </div>
      )}
    </div>
  )
}

// ============================================
// Task 8.5: Final Project — Kanban Board — Solution
// ============================================

interface Card {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

class KanbanStore {
  columns: Column[] = [
    { id: 'todo', title: 'Todo', cards: [{ id: '1', title: 'Learn MobX' }, { id: '2', title: 'Build app' }] },
    { id: 'progress', title: 'In Progress', cards: [{ id: '3', title: 'Read docs' }] },
    { id: 'done', title: 'Done', cards: [] },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  addCard(columnId: string, title: string) {
    const col = this.columns.find(c => c.id === columnId)
    if (col) col.cards.push({ id: crypto.randomUUID(), title })
  }

  removeCard(columnId: string, cardId: string) {
    const col = this.columns.find(c => c.id === columnId)
    if (col) col.cards = col.cards.filter(c => c.id !== cardId)
  }

  moveCard(cardId: string, fromColId: string, toColId: string) {
    const from = this.columns.find(c => c.id === fromColId)
    const to = this.columns.find(c => c.id === toColId)
    if (!from || !to) return
    const cardIdx = from.cards.findIndex(c => c.id === cardId)
    if (cardIdx === -1) return
    const [card] = from.cards.splice(cardIdx, 1)
    to.cards.push(card)
  }

  get totalCards() {
    return this.columns.reduce((sum, col) => sum + col.cards.length, 0)
  }
}

const kanbanStore = new KanbanStore()

const KanbanColumn = observer(function KanbanColumn({ column }: { column: Column }) {
  const [newTitle, setNewTitle] = useState('')
  const otherCols = kanbanStore.columns.filter(c => c.id !== column.id)

  return (
    <div style={{ flex: 1, background: 'var(--clr-bg-secondary, #f5f5f5)', borderRadius: '8px', padding: '0.75rem', minWidth: '200px' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1em' }}>{column.title} ({column.cards.length})</h3>
      {column.cards.map(card => (
        <div key={card.id} style={{ background: 'var(--clr-bg, #fff)', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem', border: '1px solid var(--clr-border, #ddd)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{card.title}</span>
            <button onClick={() => kanbanStore.removeCard(column.id, card.id)} style={{ padding: '0 4px', fontSize: '0.8em' }}>x</button>
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
            {otherCols.map(col => (
              <button key={col.id} onClick={() => kanbanStore.moveCard(card.id, column.id, col.id)} style={{ padding: '0 6px', fontSize: '0.7em' }}>
                → {col.title}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New card..." style={{ flex: 1, padding: '0.25rem', fontSize: '0.85em' }}
          onKeyDown={e => { if (e.key === 'Enter' && newTitle.trim()) { kanbanStore.addCard(column.id, newTitle.trim()); setNewTitle('') } }}
        />
        <button onClick={() => { if (newTitle.trim()) { kanbanStore.addCard(column.id, newTitle.trim()); setNewTitle('') } }} style={{ padding: '0.25rem 0.5rem', fontSize: '0.85em' }}>+</button>
      </div>
    </div>
  )
})

export const Task8_5_Solution = observer(function Task8_5_Solution() {
  return (
    <div className="exercise-container">
      <h2>Task 8.5: Kanban Board</h2>
      <p>Total cards: {kanbanStore.totalCards}</p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {kanbanStore.columns.map(col => (
          <KanbanColumn key={col.id} column={col} />
        ))}
      </div>
    </div>
  )
})
