# 🔥 Level 4: Error Boundaries in React

## 🎯 Introduction

In React, an error in one component can crash the entire tree. Error Boundary — a special component that catches render errors in its children and shows fallback UI instead of a white screen.

## ✅ What Error Boundaries Catch

- ✅ Errors in lifecycle methods
- ✅ Errors in `render()`
- ✅ Errors in constructors of child components

## ❌ What Error Boundaries Don't Catch

- ❌ Errors in event handlers (`onClick`, `onChange`)
- ❌ Asynchronous code (`setTimeout`, `fetch`)
- ❌ Server-side rendering (SSR)
- ❌ Errors in the Error Boundary itself

## 🔥 Creating Error Boundary

📌 Error Boundary — is a **class** component with `getDerivedStateFromError` and/or `componentDidCatch`:

```typescript
interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  // Called when an error occurs — updates state
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  // Called after an error — for logging
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error:', error)
    console.error('Component:', errorInfo.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong</h2>
    }
    return this.props.children
  }
}
```

### Usage

```jsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 💡 Fallback UI

Instead of plain text, you can show an informative UI:

```typescript
interface FallbackProps {
  error: Error
  resetError: () => void
}

class ErrorBoundary extends Component<
  { children: ReactNode; fallback: (props: FallbackProps) => ReactNode },
  ErrorBoundaryState
> {
  // ...

  render() {
    if (this.state.hasError && this.state.error) {
      return this.props.fallback({
        error: this.state.error,
        resetError: () => this.setState({ hasError: false, error: null }),
      })
    }
    return this.props.children
  }
}

// Usage
<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <h2>Error: {error.message}</h2>
      <button onClick={resetError}>Try again</button>
    </div>
  )}
>
  <UserProfile />
</ErrorBoundary>
```

## 🔥 Recovery After Error

💡 Key technique — state reset via `key`:

```typescript
class RecoverableErrorBoundary extends Component<Props, State> {
  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      resetKey: this.state.resetKey + 1,
    })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={this.handleReset} />
    }
    // key forces React to recreate the tree
    return <div key={this.state.resetKey}>{this.props.children}</div>
  }
}
```

## 🔥 Nested Error Boundaries

You can isolate different parts of the application:

```jsx
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashPage />}>
      {/* Global boundary — last line of defense */}

      <Header />

      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>

      <ErrorBoundary fallback={<ContentFallback />}>
        <MainContent />
      </ErrorBoundary>

      <Footer />
    </ErrorBoundary>
  )
}
```

💡 If `Sidebar` crashes — `MainContent` keeps working. If `MainContent` crashes — `Header` and `Footer` remain.

### 🎯 Placement Strategy

| Level | What It Protects | Fallback |
|---------|-------------|----------|
| 🔴 App Root | Everything | "App crashed, reload" |
| 🟡 Page/Route | Page Content | "Page unavailable" |
| 🟢 Widget/Section | Single Block | "Section unavailable" |

## Handling Errors in Event Handlers

⚠️ Error Boundaries **don't** catch errors from `onClick` etc. Use regular `try/catch` for them:

```typescript
function SubmitButton() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      doSomethingRisky()
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      }
    }
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return <button onClick={handleClick}>Submit</button>
}
```

## React 19 and Error Boundaries

📌 In React 19 appeared support for Error Boundaries for functional components, but classovый approach remains primary.

## ⚠️ Common Beginner Mistakes

### ❌ One Error Boundary for the Entire Application

```jsx
// ❌ Bad: one boundary for the whole App
function App() {
  return (
    <ErrorBoundary>
      <Header />
      <Sidebar />
      <MainContent />
      <Footer />
    </ErrorBoundary>
  )
}
```

> Why this is an error: if `Sidebar` crashes, the user loses **all** UI — header, content, footer. Instead of a local problem, the user sees a global crash.

```jsx
// ✅ Good: granular boundaries isolate errors
function App() {
  return (
    <ErrorBoundary fallback={<AppCrashPage />}>
      <Header />
      <ErrorBoundary fallback={<SidebarFallback />}>
        <Sidebar />
      </ErrorBoundary>
      <ErrorBoundary fallback={<ContentFallback />}>
        <MainContent />
      </ErrorBoundary>
      <Footer />
    </ErrorBoundary>
  )
}
```

### ❌ Expecting Error Boundary to Catch `onClick` Errors

```typescript
// ❌ Bad: Error Boundary will NOT catch this error
function DeleteButton() {
  const handleClick = () => {
    throw new Error('Something went wrong') // 💥 Uncaught Error!
  }
  return <button onClick={handleClick}>Delete</button>
}
```

> Why this is an error: Error Boundary intercepts only **render** errors (in `render()`, hooks, lifecycle). Errors in event handlers pass by — they're called asynchronously, outside React's render stack. Result — unhandled error and potential crash.

```typescript
// ✅ Good: event handler wrapped in try/catch
function DeleteButton() {
  const [error, setError] = useState<Error | null>(null)

  const handleClick = () => {
    try {
      doSomethingRisky()
    } catch (e) {
      if (e instanceof Error) setError(e)
    }
  }

  if (error) return <div>Error: {error.message}</div>
  return <button onClick={handleClick}>Delete</button>
}
```

### ❌ No Recovery Button in Fallback UI

```jsx
// ❌ Bad: dead end — user can't do anything
<ErrorBoundary
  fallback={<p>Loading error</p>}
>
  <Dashboard />
</ErrorBoundary>
```

> Why this is an error: the user sees an error message but can't do anything — only reload the entire page. This is poor UX: many errors are temporary and resolve with a retry.

```jsx
// ✅ Good: fallback with recovery option
<ErrorBoundary
  fallback={({ error, resetError }) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={resetError}>Try again</button>
    </div>
  )}
>
  <Dashboard />
</ErrorBoundary>
```

## 📌 Summary

- ✅ Error Boundary catches render errors in child components
- ✅ Implemented as a class component with `getDerivedStateFromError`
- ✅ `componentDidCatch` — for logging
- ✅ Fallback UI — instead of white screen
- 💡 `key` trick — for recovery after error
- 💡 Nested boundaries — isolation of app parts
- ⚠️ Event handlers handled via regular `try/catch`
