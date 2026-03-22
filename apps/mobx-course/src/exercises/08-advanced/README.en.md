# Level 8: Advanced Techniques — Optimization, Interception, Serialization, Testing

## Introduction

In the previous levels, you learned the fundamentals of MobX: observable, action, computed, reaction, and store organization patterns. Now it is time to move on to **advanced techniques** that distinguish tutorial examples from production applications.

In this level you will learn how to:

- Optimize rendering of large lists using **granular observer**
- Intercept changes **before** they are applied with `intercept`
- Observe changes **after** they are applied with `observe`
- Serialize and restore store state
- Test MobX stores as plain classes
- Combine all concepts in a final project

---

## Part 1: Granular Observer — Rendering Optimization

### The problem: the entire list re-renders

When you wrap a list component in `observer`, **any** change to any item will cause the **entire** list to re-render:

```tsx
// The entire list re-renders when a single item changes
const ItemList = observer(function ItemList() {
  return (
    <ul>
      {store.items.map(item => (
        <li key={item.id}>
          {item.name}: {item.value}
          <button onClick={() => store.increment(item.id)}>+1</button>
        </li>
      ))}
    </ul>
  )
})
```

With 100 items, that means 100 unnecessary re-renders when clicking a single button.

### Solution: extract each item into a separate observer component

```tsx
const Item = observer(function Item({ item }: { item: ItemType }) {
  return (
    <li>
      {item.name}: {item.value}
      <button onClick={() => store.increment(item.id)}>+1</button>
    </li>
  )
})

const ItemList = observer(function ItemList() {
  return (
    <ul>
      {store.items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  )
})
```

Now when a button is clicked, **only** the single `Item` re-renders, not the entire list. The parent `ItemList` only re-renders when items are added or removed.

### How to track re-renders

Use `useRef` to count renders:

```tsx
const Item = observer(function Item({ item }: { item: ItemType }) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <li>
      {item.name} (renders: {renderCount.current})
    </li>
  )
})
```

---

## Part 2: intercept — Intercepting Changes Before They Are Applied

### What is intercept

`intercept` allows you to intercept a change to an observable property **before** it is applied. You can:

- **Modify** the value (e.g., normalize it)
- **Block** the change (return `null`)
- **Pass through** without changes (return `change`)

### Syntax

```tsx
import { intercept } from 'mobx'

const disposer = intercept(target, propertyName, handler)
```

### Example: age validation

```tsx
class AgeStore {
  age = 25

  constructor() {
    makeAutoObservable(this)

    intercept(this, 'age', change => {
      if (change.type !== 'update') return change
      const newVal = change.newValue as number

      // Block values outside the range
      if (newVal < 0 || newVal > 150) {
        console.log(`Blocked: ${newVal} is out of range`)
        return null // null = cancel the change
      }

      return change // pass the change through
    })
  }

  setAge(value: number) {
    this.age = value
  }
}
```

### Example: string normalization

```tsx
intercept(store, 'email', change => {
  if (change.type === 'update') {
    change.newValue = (change.newValue as string).trim().toLowerCase()
  }
  return change
})
```

### Important: intercept returns a disposer

```tsx
const stop = intercept(store, 'age', handler)

// Later, when interception is no longer needed:
stop()
```

---

## Part 3: observe — Observing Changes After They Are Applied

### What is observe

`observe` fires **after** a value has changed. It is used for:

- Logging changes
- Auditing
- Sending analytics
- Synchronizing with external systems

### Syntax

```tsx
import { observe } from 'mobx'

const disposer = observe(target, propertyName, handler)
```

### Example: logging

```tsx
observe(store, 'age', change => {
  console.log(`age: ${change.oldValue} -> ${change.newValue}`)
})
```

### Difference: observe vs reaction/autorun

`observe` works **synchronously** — the callback is invoked immediately after the change, without batching or scheduling. This makes `observe` suitable for auditing, but not for side effects that themselves modify observables.

---

## Comparison: intercept vs observe

| Characteristic | `intercept` | `observe` |
|---|---|---|
| When it fires | **Before** the change is applied | **After** the change is applied |
| Can cancel a change | Yes (return `null`) | No |
| Can modify the value | Yes | No |
| Access to old value | No | Yes (`change.oldValue`) |
| Typical use case | Validation, normalization | Logging, auditing |
| Synchronous | Yes | Yes |
| Works with batching | No (before batch) | No (after each change) |

---

## Part 4: Serialization — toJSON / hydrate

### Why serialization is needed

MobX stores are classes with internal state. To save state to localStorage, send it to a server, or restore it on load, you need serialization.

### The toJSON + hydrate pattern

```tsx
class SettingsStore {
  theme: 'light' | 'dark' = 'light'
  fontSize = 16
  language = 'en'

  constructor() {
    makeAutoObservable(this)
  }

  // Serialization: store -> plain object
  toJSON() {
    return {
      theme: this.theme,
      fontSize: this.fontSize,
      language: this.language,
    }
  }

  // Hydration: plain object -> store
  hydrate(data: Partial<ReturnType<typeof this.toJSON>>) {
    if (data.theme) this.theme = data.theme
    if (data.fontSize) this.fontSize = data.fontSize
    if (data.language) this.language = data.language
  }
}
```

### Auto-saving with autorun

```tsx
const STORAGE_KEY = 'app-settings'

const store = new SettingsStore()

// Load on startup
const saved = localStorage.getItem(STORAGE_KEY)
if (saved) {
  try {
    store.hydrate(JSON.parse(saved))
  } catch {
    /* ignore corrupted data */
  }
}

// Auto-save on every change
autorun(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.toJSON()))
})
```

`autorun` automatically tracks all observables used in `toJSON()` and saves whenever any of them change.

### Safe hydration

Always wrap `JSON.parse` in `try/catch` — data in localStorage may be corrupted:

```tsx
hydrate(storageKey: string) {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return

  try {
    const data = JSON.parse(raw)
    runInAction(() => {
      if (data.theme) this.theme = data.theme
      if (typeof data.fontSize === 'number') this.fontSize = data.fontSize
    })
  } catch {
    // Corrupted data — ignore
  }
}
```

---

## Part 5: Testing MobX Stores

### The key advantage: stores are plain classes

MobX stores do not depend on React. You can test them as plain JavaScript classes without rendering components.

```tsx
// Store
class CartStore {
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

  clear() {
    this.items = []
  }
}

// Tests
test('starts empty', () => {
  const store = new CartStore()
  expect(store.items.length).toBe(0)
  expect(store.totalPrice).toBe(0)
})

test('adds item and calculates total', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  store.addItem('Gadget', 20)
  expect(store.totalPrice).toBe(30)
})

test('clear removes all items', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  store.clear()
  expect(store.items.length).toBe(0)
  expect(store.totalPrice).toBe(0)
})
```

### What to test

1. **Actions** — call the method, verify the state
2. **Computed** — set up state, verify the computed value
3. **Reactions** — `autorun` / `reaction` with a mock function
4. **Edge cases** — empty store, duplicates, invalid data

### Testing reactions

```tsx
test('autorun tracks changes', () => {
  const store = new CartStore()
  const totals: number[] = []

  autorun(() => {
    totals.push(store.totalPrice)
  })

  store.addItem('A', 10)
  store.addItem('B', 20)

  expect(totals).toEqual([0, 10, 30])
})
```

---

## Part 6: Comprehensive Pattern — Kanban Board

A Kanban board is an excellent example that combines all MobX concepts:

- **observable** — columns and cards
- **action** — addCard, removeCard, moveCard
- **computed** — totalCards
- **observer** — granular rendering of each column

```tsx
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
    { id: 'todo', title: 'Todo', cards: [] },
    { id: 'progress', title: 'In Progress', cards: [] },
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

    const idx = from.cards.findIndex(c => c.id === cardId)
    if (idx === -1) return

    const [card] = from.cards.splice(idx, 1)
    to.cards.push(card)
  }

  get totalCards() {
    return this.columns.reduce((sum, col) => sum + col.cards.length, 0)
  }
}
```

Each column is a separate observer component, which ensures granular rendering.

---

## Common Beginner Mistakes

### Mistake 1: Rendering a list without granular observer

```tsx
// Wrong — the entire list re-renders when a single item changes
const List = observer(function List() {
  return (
    <ul>
      {store.items.map(item => (
        <li key={item.id}>
          {item.name}: {item.value}
        </li>
      ))}
    </ul>
  )
})

// Correct — each item is a separate observer
const ListItem = observer(function ListItem({ item }: { item: Item }) {
  return (
    <li>
      {item.name}: {item.value}
    </li>
  )
})

const List = observer(function List() {
  return (
    <ul>
      {store.items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  )
})
```

**Why this is a mistake:** Without granular observer, MobX cannot track which specific item changed and re-renders the entire list component. With 100+ items, this becomes a serious performance problem.

---

### Mistake 2: Mutating state inside intercept

```tsx
// Wrong — modifying an observable inside intercept
intercept(store, 'age', change => {
  store.log.push('changed!') // mutating another observable!
  return change
})

// Correct — intercept only validates/modifies the change
intercept(store, 'age', change => {
  if (change.newValue < 0) return null
  return change
})

// Use observe for logging
observe(store, 'age', change => {
  store.log.push(`${change.oldValue} -> ${change.newValue}`)
})
```

**Why this is a mistake:** `intercept` is called **before** the change is applied. Mutating other observables inside `intercept` can lead to unpredictable update ordering and infinite loops.

---

### Mistake 3: Missing try/catch when hydrating from localStorage

```tsx
// Wrong — the app crashes on corrupted data
hydrate() {
  const raw = localStorage.getItem('settings')
  const data = JSON.parse(raw!) // crash if data is corrupted
  this.theme = data.theme
}

// Correct — safe hydration
hydrate() {
  const raw = localStorage.getItem('settings')
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    runInAction(() => {
      if (data.theme) this.theme = data.theme
    })
  } catch {
    // Corrupted data — ignore
  }
}
```

**Why this is a mistake:** Data in localStorage can be corrupted, deleted, or in an outdated format. Without `try/catch`, the app will crash on load.

---

### Mistake 4: toJSON includes computed properties

```tsx
// Wrong — saving a computed that is calculated automatically
toJSON() {
  return {
    items: this.items,
    totalPrice: this.totalPrice, // this is computed!
  }
}

// Correct — save only source data
toJSON() {
  return {
    items: this.items,
  }
}
```

**Why this is a mistake:** Computed properties are derived from other observables automatically. Saving them is data duplication that can lead to desynchronization during hydration.

---

### Mistake 5: Testing stores through React components

```tsx
// Wrong — rendering a component to verify store logic
test('adds item', () => {
  render(<CartComponent />)
  fireEvent.click(screen.getByText('Add'))
  expect(screen.getByText('Total: 10')).toBeInTheDocument()
})

// Correct — test the store directly
test('adds item', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  expect(store.totalPrice).toBe(10)
})
```

**Why this is a mistake:** MobX stores are plain classes. Testing through React component rendering is slower, more complex, and tests not only the store but also the component, the MobX-React integration, and the DOM.

---

## Additional Resources

- [MobX — Optimizing React component rendering](https://mobx.js.org/react-optimizations.html)
- [MobX — intercept & observe](https://mobx.js.org/intercept-and-observe.html)
- [MobX — Defining data stores](https://mobx.js.org/defining-data-stores.html)
- [MobX — Custom reactions (autorun, reaction, when)](https://mobx.js.org/reactions.html)
- [MobX Best Practices](https://mobx.js.org/the-gist-of-mobx.html)
