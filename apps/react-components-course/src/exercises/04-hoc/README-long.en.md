# Level 4: Higher-Order Components — Detailed Theory

## Where the idea came from: analogy with decorators

Python and Java have decorators — a way to add behavior to a function or class without changing its code. In JavaScript this is the "higher-order function" pattern:

```js
// Regular function
function greet(name) {
  return `Hello, ${name}!`
}

// Decorator — adds logging
function withLogging(fn) {
  return function(...args) {
    console.log('Called with arguments:', args)
    const result = fn(...args)
    console.log('Result:', result)
    return result
  }
}

const greetWithLogging = withLogging(greet)
greetWithLogging('Alice') // logs and executes
```

HOC in React — the same pattern, but for components:

```tsx
// HOC takes a component → returns an enhanced component
function withLogging<P>(Component: React.ComponentType<P>) {
  return function WithLogging(props: P) {
    console.log(`Render ${Component.name}`, props)
    return <Component {...props} />
  }
}
```

Analogy: HOC is like a spice. You take a dish (component) and add a spice (behavior), without changing the dish's recipe.

## Anatomy of HOC: three parts

```tsx
// PART 1: Factory function (accepts component)
function withLoading<P extends object>(
  Component: React.ComponentType<P>         // WrappedComponent
) {
  // PART 2: Returned component (accepts merged props)
  const WithLoading = ({ isLoading, ...props }: P & { isLoading: boolean }) => {
    // PART 3: Cross-cutting behavior logic
    if (isLoading) {
      return <div style={{ padding: '2rem', textAlign: 'center' }}>⏳ Loading...</div>
    }
    return <Component {...(props as P)} />
  }

  // Mandatory: readable name in DevTools
  WithLoading.displayName = `withLoading(${Component.displayName ?? Component.name})`
  return WithLoading
}
```

## Typing HOCs: step by step

Typing HOCs is one of the hardest areas in TypeScript + React. Let's break it down.

### Step 1: Generic parameter P

```tsx
function withLoading<P extends object>(Component: React.ComponentType<P>)
```

`P extends object` — the constraint says: "P is the wrapped component's props type, and it's an object". Without the constraint, `P` could be `string` or `number`.

### Step 2: Return type of the component

HOC adds new props to existing ones. This is expressed through type intersection:

```tsx
// P — original props
// { isLoading: boolean } — new HOC props
// P & { isLoading: boolean } — wrapping component's props
({ isLoading, ...props }: P & { isLoading: boolean }) => { ... }
```

### Step 3: Destructuring and spread

```tsx
// Extract isLoading (needed by HOC)
// Rest is passed to the original component
const { isLoading, ...rest } = allProps
<Component {...(rest as P)} />
```

The `rest as P` cast is necessary: TypeScript can't always infer that removing `isLoading` from `P & { isLoading: boolean }` yields exactly `P`.

### Full example with type comments

```tsx
// HOC for error handling
interface WithErrorProps {
  error?: Error | null
}

function withError<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P & WithErrorProps> {  // explicit return type
  const WithError = ({ error, ...props }: P & WithErrorProps) => {
    if (error) {
      return (
        <div style={{ color: 'red', padding: '1rem' }}>
          Error: {error.message}
        </div>
      )
    }
    return <Component {...(props as P)} />
  }

  WithError.displayName = `withError(${Component.displayName ?? Component.name})`
  return WithError
}
```

## withAuth: authorization context

`withAuth` is a classic HOC example with React Context. The HOC accesses context itself, freeing the wrapped component from this concern.

```tsx
// Define authorization context
interface AuthContextValue {
  isAuthenticated: boolean
  user: { name: string; role: string } | null
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
})

// HOC: checks authorization, shows stub if not authorized
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  FallbackComponent?: React.ComponentType
) {
  const WithAuth = (props: P) => {
    const { isAuthenticated } = useContext(AuthContext)

    if (!isAuthenticated) {
      return FallbackComponent
        ? <FallbackComponent />
        : <div>Please log in to continue</div>
    }

    return <Component {...props} />
  }

  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name})`
  return WithAuth
}

// Usage
const ProtectedDashboard = withAuth(Dashboard, LoginPage)
```

Note: `withAuth` uses `useContext` — that's fine. HOCs can use hooks because the returned function is a functional component.

## Composing HOCs: the compose function

Multiple HOCs are often used together. Without compose it looks like this:

```tsx
// ❌ Unreadable nesting
const Enhanced = withErrorBoundary(withAuth(withLoading(MyComponent)))
```

Result: on error in `MyComponent`, `ErrorBoundary` fires first, then `Auth`, then `Loading`. The wrapping order matters, and it's easy to get confused with this syntax.

The `compose` function solves this:

```tsx
// Typed compose for arbitrary number of HOCs
type HOC<P> = (Component: React.ComponentType<P>) => React.ComponentType<any>

function compose<P>(...hocs: HOC<any>[]) {
  return (Component: React.ComponentType<P>) =>
    hocs.reduceRight((acc, hoc) => hoc(acc), Component as React.ComponentType<any>)
}

// ✅ Readable: applied bottom-up (withLoading → withAuth → withErrorBoundary)
const Enhanced = compose(
  withErrorBoundary,  // outer layer
  withAuth,           // middle layer
  withLoading         // closest to component
)(MyComponent)
```

Order in `compose`: leftmost HOC is the outermost in the tree. Components are wrapped right to left.

```mermaid
graph LR
  A[withErrorBoundary] -->|wraps| B[withAuth]
  B -->|wraps| C[withLoading]
  C -->|wraps| D[MyComponent]
```

## HOC vs Hooks: detailed comparison

Modern React handles most HOC tasks through hooks. But each approach has its niche.

### Example: tracking window size

```tsx
// ❌ HOC approach — verbose, hard to test
interface WithWindowSizeProps {
  windowWidth: number
  windowHeight: number
}

function withWindowSize<P>(Component: React.ComponentType<P & WithWindowSizeProps>) {
  const WithWindowSize = (props: P) => {
    const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight })

    useEffect(() => {
      const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    return <Component {...props} windowWidth={size.width} windowHeight={size.height} />
  }
  WithWindowSize.displayName = `withWindowSize(${Component.name})`
  return WithWindowSize
}

// Usage — need to create a new component
const MyComponentWithSize = withWindowSize(MyComponent)
```

```tsx
// ✅ Hook approach — concise, reusable, testable
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return size
}

// Usage — directly in the component
function MyComponent() {
  const { width, height } = useWindowSize()
  // ...
}
```

### Table: when to choose what

| Task | HOC | Hook |
|---|---|---|
| Conditional rendering (not authorized → show login) | ✅ Appropriate | Possible, but needs early return |
| Wrapping in DOM element (ErrorBoundary) | ✅ Required | ❌ Not possible |
| Logic with state (fetch, resize) | ❌ Excessive | ✅ Better |
| Context data to props | Was relevant before hooks | ✅ `useContext` directly |
| Class component compatibility | ✅ | ❌ |

## Common mistakes

### ❌ HOC created inside render

```tsx
// ❌ CRITICAL ERROR — new component type on every render
function Parent() {
  // withLoading creates a new function on every Parent render
  // React thinks it's a new component and unmounts/remounts
  const EnhancedList = withLoading(ItemList)
  return <EnhancedList isLoading={loading} items={items} />
}
```

```tsx
// ✅ Correct — create once outside component
const EnhancedList = withLoading(ItemList)

function Parent() {
  return <EnhancedList isLoading={loading} items={items} />
}
```

Why this is critical: creating HOC inside render makes every parent render cause React to treat `EnhancedList` as a new component type. This leads to full tree unmounting and remounting — state is lost, effects fire.

### ❌ Not all props are passed

```tsx
// ❌ Bad — original component props are lost
function withLoading(Component) {
  return function({ isLoading }) {  // other props not destructured!
    if (isLoading) return <Spinner />
    return <Component />  // empty component without props!
  }
}
```

```tsx
// ✅ Good — spread passes all props
function withLoading<P extends object>(Component: React.ComponentType<P>) {
  return function({ isLoading, ...props }: P & { isLoading: boolean }) {
    if (isLoading) return <Spinner />
    return <Component {...(props as P)} />
  }
}
```

### ❌ No displayName

```tsx
// ❌ In DevTools: <Unknown> <Unknown> <Unknown>
function withAuth(Component) {
  return (props) => {
    // ...
  }
}

// ✅ In DevTools: withAuth(Dashboard) → withLoading(Dashboard)
function withAuth(Component) {
  const WithAuth = (props) => { /* ... */ }
  WithAuth.displayName = `withAuth(${Component.displayName ?? Component.name ?? 'Component'})`
  return WithAuth
}
```

### ❌ Ignoring ref (if needed)

```tsx
// ❌ ref is not forwarded — component won't receive ref
const EnhancedInput = withSomething(Input)
<EnhancedInput ref={inputRef} />  // ref points to HOC wrapper, not <input>

// ✅ Use forwardRef if ref matters
function withSomething<P extends object>(Component: React.ComponentType<P>) {
  const WithSomething = React.forwardRef<HTMLInputElement, P>((props, ref) => {
    return <Component {...props} ref={ref} />
  })
  WithSomething.displayName = `withSomething(${Component.name})`
  return WithSomething
}
```

## Practice: withErrorBoundary

Error Boundaries in React can only be implemented via class components. HOC is the ideal way to wrap a class `ErrorBoundary` into a convenient decorator:

```tsx
// Class-based ErrorBoundary (unavoidable)
class ErrorBoundaryClass extends React.Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ color: 'red' }}>Something went wrong: {this.state.error?.message}</div>
      )
    }
    return this.props.children
  }
}

// HOC wrapper — makes it convenient
function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const WithErrorBoundary = (props: P) => (
    <ErrorBoundaryClass fallback={fallback}>
      <Component {...props} />
    </ErrorBoundaryClass>
  )
  WithErrorBoundary.displayName = `withErrorBoundary(${Component.displayName ?? Component.name})`
  return WithErrorBoundary
}
```

## Summary: place of HOC in modern React

HOC is a mature pattern that solved many tasks before hooks appeared. Today its use is narrowing, but not disappearing:

**HOC remains relevant for:**
- `withErrorBoundary` — ErrorBoundary requires a class component
- Libraries (Redux `connect`, React Router `withRouter`)
- Conditional rendering with fallback (`withAuth`)

**Hooks are better for:**
- Any logic with `useState`, `useEffect`, `useContext`
- Reusable logic without changing rendering

Knowing HOC is necessary: you'll encounter it in any mature React project.
