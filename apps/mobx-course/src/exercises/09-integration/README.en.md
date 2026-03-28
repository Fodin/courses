# Level 9: Integration — Serialization, Testing, Final Project

## Introduction

You have learned the fundamentals of MobX and optimization techniques. Now it is time to learn how to **integrate MobX into real applications**: persist state between sessions, test stores, and combine all concepts in a full project.

In this level you will learn how to:

- Serialize and restore store state (toJSON / hydrate)
- Test MobX stores as plain classes
- Combine all concepts in a final project — a kanban board

---

## Part 1: Serialization — toJSON / hydrate

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

## Part 2: Testing MobX Stores

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

## Part 3: Comprehensive Pattern — Kanban Board

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

### Mistake 1: Missing try/catch when hydrating from localStorage

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

### Mistake 2: toJSON includes computed properties

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

### Mistake 3: Testing stores through React components

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

- [MobX — Defining data stores](https://mobx.js.org/defining-data-stores.html)
- [MobX — Custom reactions (autorun, reaction, when)](https://mobx.js.org/reactions.html)
- [MobX Best Practices](https://mobx.js.org/the-gist-of-mobx.html)
