# Level 8: Optimization — Granular Observer, intercept, observe

## Introduction

In the previous levels, you learned the fundamentals of MobX: observable, action, computed, reaction, and store organization patterns. Now it is time to move on to **performance optimization** — techniques that distinguish tutorial examples from production applications.

In this level you will learn how to:

- Optimize rendering of large lists using **granular observer**
- Intercept changes **before** they are applied with `intercept`
- Observe changes **after** they are applied with `observe`

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

## Additional Resources

- [MobX — Optimizing React component rendering](https://mobx.js.org/react-optimizations.html)
- [MobX — intercept & observe](https://mobx.js.org/intercept-and-observe.html)
