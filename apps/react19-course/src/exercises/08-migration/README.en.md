# Level 8: Final Migration

## Introduction

This level brings together everything you have learned about React 19. You will audit a React 18 application, carry out a step-by-step migration, and build a final component that uses all of the new APIs.

---

## React 18 → 19 Migration Checklist

### 1. Update dependencies

```bash
npm install react@19 react-dom@19
npm install -D @types/react@19 @types/react-dom@19
```

Additionally:
- `eslint-plugin-react-hooks` → v5+
- `@testing-library/react` → v16+

### 2. Run codemod

```bash
npx codemod@latest react/19/migration-recipe
```

The codemod will automatically fix:
- `ReactDOM.render` → `createRoot`
- String refs → `createRef`
- `defaultProps` → default parameters
- `forwardRef` → ref as prop

### 3. Manual changes

#### Removed APIs (breaking changes)

| API                    | Replacement                  |
|------------------------|------------------------------|
| `defaultProps` (functions) | ES6 default parameters   |
| `propTypes`            | TypeScript                   |
| String refs            | `useRef` / `createRef`       |
| Legacy Context         | `createContext` / `useContext` |
| `ReactDOM.render`      | `createRoot().render()`      |
| `ReactDOM.hydrate`     | `hydrateRoot()`              |
| `ReactDOM.findDOMNode` | `useRef`                     |

#### New APIs (what to adopt)

| API              | What it does                              |
|------------------|-------------------------------------------|
| `use(Promise)`   | Read async data with Suspense             |
| `use(Context)`   | Replaces useContext (can be called conditionally) |
| `useActionState` | Form state + action                       |
| `useFormStatus`  | Form pending status                       |
| `useOptimistic`  | Optimistic updates                        |
| ref as prop      | No forwardRef needed                      |
| ref cleanup      | Return a function from ref callback       |
| `<title>` in JSX | Metadata inside components               |

---

## Migration Strategy

### Approach: Incremental migration

1. **Update dependencies** — make sure the project compiles
2. **Run codemod** — automated fixes
3. **Fix breaking changes** — removed APIs
4. **Migrate forms** — onSubmit → action (optional)
5. **Adopt new APIs** — use(), useOptimistic, etc. (as needed)
6. **Test** — make sure everything works

### What NOT to change right away

- `useContext` → `use(Context)` — still works, migrate gradually
- `Context.Provider` → `Context` — both syntaxes work
- Existing forms — `onSubmit` keeps working

---

## Example: Before and After

### Before (React 18)

```tsx
import React, { forwardRef, useContext, useState, useEffect } from 'react'

const ThemeContext = React.createContext('light')

const Input = forwardRef((props, ref) => {
  const theme = useContext(ThemeContext)
  return <input ref={ref} className={theme} {...props} />
})
Input.defaultProps = { placeholder: 'Enter...' }

function App() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(d => {
      setData(d)
      setLoading(false)
    })
  }, [])

  return (
    <ThemeContext.Provider value="dark">
      {loading ? <p>Loading...</p> : <div>{data}</div>}
    </ThemeContext.Provider>
  )
}
```

### After (React 19)

```tsx
import { use, Suspense, useState } from 'react'
import { createContext } from 'react'

const ThemeContext = createContext('light')

function Input({ ref, placeholder = 'Enter...', ...props }) {
  const theme = use(ThemeContext)
  return <input ref={ref} className={theme} placeholder={placeholder} {...props} />
}

const dataPromise = fetch('/api/data').then(r => r.json())

function DataView() {
  const data = use(dataPromise)
  return <div>{data}</div>
}

function App() {
  return (
    <ThemeContext value="dark">
      <title>Application</title>
      <Suspense fallback={<p>Loading...</p>}>
        <DataView />
      </Suspense>
    </ThemeContext>
  )
}
```

---

## Summary

Migrating to React 19 involves:
1. Updating packages
2. Running codemod
3. Fixing breaking changes
4. Gradually adopting new APIs

There is no need to change everything at once. React 19 is backward-compatible for the vast majority of patterns.
