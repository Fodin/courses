# Level 2: The use() Hook

## Introduction

React 19 introduces a new API — `use()`. This is **not a hook** in the traditional sense: it can be called inside conditionals, loops, and after an early return. It works with two types of values: **Promise** and **Context**.

---

## use(Promise) — Reading Async Data

### How It Works

```tsx
import { use, Suspense } from 'react'

// The promise is created OUTSIDE the component (or cached)
const dataPromise = fetch('/api/users').then(r => r.json())

function UserList() {
  const users = use(dataPromise)  // "suspends" the component
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>
}

// Must be wrapped in Suspense!
function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <UserList />
    </Suspense>
  )
}
```

### Important Rules

1. **Do not create the promise inside a render** — this will cause an infinite loop
2. **The promise must be stable** — cache it or create it outside the component
3. **Suspense is required** — without it React will throw an error

### Comparison with useEffect

| Approach | Boilerplate | Loading state | Error handling |
|----------|-------------|---------------|----------------|
| `useEffect` + `useState` | A lot (3 states) | Manual | Manual |
| `use(Promise)` | Minimal | Suspense | ErrorBoundary |

---

## use(Context) — Replacing useContext

```tsx
import { use, createContext } from 'react'

const ThemeContext = createContext('light')

function ThemedButton() {
  const theme = use(ThemeContext)
  return <button className={theme}>Button</button>
}
```

### What's New in React 19

The context provider syntax has been simplified:

```tsx
// React 18
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// React 19
<ThemeContext value="dark">
  <App />
</ThemeContext>
```

---

## Conditional use() Calls

The main advantage of `use()` over hooks — it can be called conditionally:

```tsx
function UserGreeting({ isLoggedIn }) {
  if (isLoggedIn) {
    // ✅ This works!
    const user = use(UserContext)
    return <p>Hello, {user.name}!</p>
  }
  return <p>Please log in</p>
}
```

With `useContext` this code is **impossible** — hooks cannot be called conditionally.

### When This Is Useful

- A component that renders different UI depending on state
- Conditional data loading
- Early return before reading context

---

## Pattern: Suspense + use + ErrorBoundary

The complete pattern for handling async data:

```tsx
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Spinner />}>
    <DataComponent />
  </Suspense>
</ErrorBoundary>
```

### How It Works

1. The component calls `use(promise)`
2. React "suspends" the component → the Suspense fallback is shown
3. When the promise resolves → the component renders with data
4. If the promise rejects → the ErrorBoundary catches the error

### ErrorBoundary

```tsx
class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return <p>Error: {this.state.error.message}</p>
    }
    return this.props.children
  }
}
```

---

## Summary

| API | Accepts | When to use |
|-----|---------|-------------|
| `use(Promise)` | Promise | Reading async data with Suspense |
| `use(Context)` | Context | Replacing useContext, especially conditionally |

The key difference from hooks: `use()` can be called inside conditionals and loops.
