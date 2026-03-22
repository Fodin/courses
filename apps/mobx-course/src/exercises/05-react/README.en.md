# Level 5: React Integration

## observer HOC

`observer` is a HOC (Higher-Order Component) from `mobx-react-lite` that makes a React component reactive. Without `observer`, the component won't re-render when observable data changes.

```tsx
import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0
  constructor() { makeAutoObservable(this) }
  increment() { this.count++ }
}

const store = new CounterStore()

// Without observer — component is "frozen", doesn't react to changes
function BrokenCounter() {
  return <span>{store.count}</span>
}

// With observer — re-renders on every store.count change
const WorkingCounter = observer(function WorkingCounter() {
  return <span>{store.count}</span>
})
```

### How does observer work?

1. Wraps the component's render function in an `autorun`-like tracking
2. Records which observables were read during render
3. When any of them change — triggers a re-render

## useLocalObservable

The `useLocalObservable` hook creates a local MobX store tied to the component's lifecycle:

```tsx
import { observer, useLocalObservable } from 'mobx-react-lite'

const Form = observer(function Form() {
  const state = useLocalObservable(() => ({
    name: '',
    email: '',
    setName(v: string) { state.name = v },
    setEmail(v: string) { state.email = v },
    get isValid() {
      return state.name.length > 0 && state.email.includes('@')
    },
  }))

  return (
    <div>
      <input value={state.name} onChange={e => state.setName(e.target.value)} />
      <input value={state.email} onChange={e => state.setEmail(e.target.value)} />
      <p>Valid: {state.isValid ? 'Yes' : 'No'}</p>
    </div>
  )
})
```

### When to use useLocalObservable?

- When state is needed only within a single component
- When there are multiple related fields with computed values
- As a replacement for multiple `useState` + `useMemo`

## Store via Context

To pass a store through the component tree, use React Context:

```tsx
import { createContext, useContext } from 'react'

const StoreContext = createContext<TodoStore | null>(null)

function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('Store not found')
  return store
}
```

## Observer Granularity

Key principle of MobX + React: **wrap every component that reads observable data in observer**. This minimizes re-renders.

```tsx
// Bad: entire list re-renders when one item changes
const List = observer(function List({ items }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
})

// Good: only the changed item re-renders
const List = observer(function List({ items }) {
  return <ul>{items.map(item => <ListItem key={item.id} item={item} />)}</ul>
})

const ListItem = observer(function ListItem({ item }) {
  return <li>{item.name}</li>
})
```

### Rules

1. **Wrap every component reading observables in observer**
2. **Split into small observer components** for precise re-renders
3. **Don't destructure observable objects** in the parent — pass the object itself

## Summary

| Concept | When to use |
|---------|-------------|
| `observer` | Always when a component reads observables |
| `useLocalObservable` | Local state with computed values inside a component |
| Context + `useStore` | Passing store through the component tree |
| Granular observer | Optimizing re-renders in lists |
