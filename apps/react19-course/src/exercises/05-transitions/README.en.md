# Level 5: useTransition, Suspense, and useDeferredValue in React 19

## Introduction

React 19 significantly expands concurrent rendering capabilities. Key updates: `startTransition` now accepts **async functions**, `useDeferredValue` gains an `initialValue` parameter, and `Suspense` becomes even more convenient for navigation.

---

## 1. `useTransition` Updates in React 19

### Basic API (unchanged)

```tsx
import { useTransition } from 'react'

const [isPending, startTransition] = useTransition()
```

- **`isPending`** — `true` while the transition is in progress
- **`startTransition`** — a function for wrapping "non-urgent" updates

### Why use useTransition?

Not all state updates are equally important. For example, when switching tabs:
- **Urgent:** show that the button was clicked
- **Non-urgent:** render the content of the new tab

```tsx
function Tabs() {
  const [tab, setTab] = useState('home')
  const [isPending, startTransition] = useTransition()

  function handleTabChange(newTab: string) {
    startTransition(() => {
      setTab(newTab)  // non-urgent update
    })
  }

  return (
    <div>
      <TabBar activeTab={tab} onChange={handleTabChange} />
      <div style={{ opacity: isPending ? 0.6 : 1 }}>
        <TabContent tab={tab} />
      </div>
    </div>
  )
}
```

---

## 2. Async transitions — async functions in `startTransition`

### What's new in React 19

In React 18, `startTransition` accepted **only synchronous functions**. In React 19 you can pass **async functions**:

```tsx
// React 18 — not possible
startTransition(async () => {
  const data = await fetch('/api/data')
  setData(data) // did not work correctly
})

// React 19 — works!
startTransition(async () => {
  const data = await fetchData()
  setData(data)
})
```

### Benefits

- **`isPending`** stays `true` for the entire duration of the async operation
- No separate `useState` needed for the loading state
- Errors are caught by Error Boundaries
- Can be combined with `useOptimistic`

### Full example

```tsx
function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [isPending, startTransition] = useTransition()

  function loadUsers() {
    startTransition(async () => {
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data)
    })
  }

  return (
    <div>
      <button onClick={loadUsers} disabled={isPending}>
        {isPending ? 'Loading...' : 'Load'}
      </button>
      <ul>
        {users.map(u => <li key={u.id}>{u.name}</li>)}
      </ul>
    </div>
  )
}
```

---

## 3. Suspense fallback during navigation

### How Suspense works with navigation

When `React.lazy()` loads a component for the first time, Suspense shows the fallback. When navigating via `useTransition`, the behavior differs:

1. **First load** — the `fallback` is shown
2. **Transition navigation** — the old content stays visible (with `isPending`) while the new one loads

```tsx
const HomePage = lazy(() => import('./HomePage'))
const AboutPage = lazy(() => import('./AboutPage'))

function App() {
  const [page, setPage] = useState('home')
  const [isPending, startTransition] = useTransition()

  function navigate(newPage: string) {
    startTransition(() => {
      setPage(newPage)
    })
  }

  const PageComponent = page === 'home' ? HomePage : AboutPage

  return (
    <div>
      <nav>
        <button onClick={() => navigate('home')}>Home</button>
        <button onClick={() => navigate('about')}>About</button>
      </nav>

      <div style={{ opacity: isPending ? 0.5 : 1 }}>
        <Suspense fallback={<div>Loading page...</div>}>
          <PageComponent />
        </Suspense>
      </div>
    </div>
  )
}
```

### Key points

- The `Suspense fallback` is shown **only on the first load** of a component
- On subsequent navigations, `isPending` from `useTransition` controls the visual state
- The old content remains interactive during the transition

---

## 4. `useDeferredValue` with `initialValue` (new in React 19)

### What's new

In React 19, `useDeferredValue` accepts a **second argument** — an initial value:

```tsx
const deferredValue = useDeferredValue(value, initialValue)
```

### How it works

```tsx
const deferredQuery = useDeferredValue(query, '')
```

1. On the **first render**: `deferredQuery === ''` (initialValue)
2. React **immediately** schedules a re-render with the real `query` value
3. On **subsequent changes**: `deferredQuery` updates with low priority

### Why use `initialValue`?

Without `initialValue`, the first render uses the real value, which can cause a delay with heavy content. With `initialValue`, the first render is instant:

```tsx
// Without initialValue — first render may be slow
const deferredQuery = useDeferredValue(query)

// With initialValue — first render is instant with an empty result
const deferredQuery = useDeferredValue(query, '')
```

### Full example — Search

```tsx
function Search() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query, '')
  const isStale = deferredQuery !== query

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search..."
      />

      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <SearchResults query={deferredQuery} />
      </div>
    </div>
  )
}

// memo matters! Without it the component will re-render on every keystroke
const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  // expensive rendering...
  const results = expensiveSearch(query)
  return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
})
```

### Comparison with debounce

| `debounce`                    | `useDeferredValue`                    |
| ----------------------------- | ------------------------------------- |
| Fixed delay                   | Adaptive (depends on the device)      |
| Works at the event level      | Works at the rendering level          |
| Requires a library (lodash)   | Built into React                      |
| Not interruptible             | Interruptible (concurrent)            |

---

## Summary

| Tool                             | What's new in React 19                              |
| -------------------------------- | --------------------------------------------------- |
| `startTransition(async fn)`      | Support for async functions                         |
| `isPending`                      | Stays true for the entire async operation           |
| `Suspense` + `useTransition`     | Smooth navigation without fallback flickering       |
| `useDeferredValue(val, initial)` | `initialValue` parameter for a fast first render    |
