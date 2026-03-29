# 🔥 Level 6: State Machines

## 🎯 Why Type-Safe State Machines Matter

A State Machine is a model that describes a system as a set of states and transitions between them. In real applications, state machines are everywhere: HTTP request lifecycle, document workflow, connection status, payment process.

Without type-safe state machines, classic bugs arise:

```typescript
// ❌ Typical problem: invalid transitions
interface Request {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: Error
}

// Nothing prevents this:
request.status = 'success'  // But data isn't set!
request.status = 'error'    // And error is undefined!
```

TypeScript can make invalid transitions and states **impossible at the type level**.

## 📌 State Transitions: Type-Safe Transitions

### Defining Allowed Transitions

The first step is to describe which transitions are allowed from each state:

```typescript
type AllowedTransitions = {
  idle: ['fetching']
  fetching: ['success', 'error']
  success: ['idle', 'fetching']
  error: ['idle', 'fetching']
}
```

### Typing via Mapped Types

For compile-time checks, you can use a mapped type for the transition map:

```typescript
type TransitionMap = {
  idle: 'fetching'
  fetching: 'success' | 'error'
  success: 'idle' | 'fetching'
  error: 'idle' | 'fetching'
}

function transition<S extends keyof TransitionMap>(
  from: S,
  to: TransitionMap[S]
): TransitionMap[S] {
  return to
}

transition('idle', 'fetching')    // ✅ OK
transition('idle', 'success')     // ❌ Compilation error
```

## 🔥 State Data Association: Different Data Per State

The main problem with the naive approach is that all data is stored in one object with optional fields:

```typescript
// ❌ Problem: data and error exist simultaneously
interface RequestState {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: User[]       // Only exists in success
  error?: string      // Only exists in error
}
```

### Discriminated Union: The Right Approach

```typescript
// ✅ Each state has its own data set
type FetchState<T, E = Error> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly startedAt: number }
  | { readonly status: 'success'; readonly data: T; readonly fetchedAt: number }
  | { readonly status: 'error'; readonly error: E; readonly failedAt: number; readonly retryCount: number }
```

Now TypeScript **narrows the type** when checking `status`:

```typescript
function render(state: FetchState<User[], string>) {
  switch (state.status) {
    case 'idle':
      return 'Ready'
    case 'loading':
      return `Loading since ${state.startedAt}`
    case 'success':
      return `${state.data.length} users loaded`
    case 'error':
      return `Error: ${state.error} (retry #${state.retryCount})`
  }
}
```

### Fold: Exhaustive Handling

```typescript
function foldFetchState<T, E, R>(
  state: FetchState<T, E>,
  handlers: {
    idle: () => R
    loading: (startedAt: number) => R
    success: (data: T, fetchedAt: number) => R
    error: (err: E, retryCount: number) => R
  }
): R { ... }
```

### Map: Data Transformation

```typescript
function mapFetchState<T, U, E>(
  state: FetchState<T, E>,
  fn: (data: T) => U
): FetchState<U, E> {
  if (state.status === 'success') {
    return { status: 'success', data: fn(state.data), fetchedAt: state.fetchedAt }
  }
  return state as unknown as FetchState<U, E>
}
```

## 📌 Hierarchical States: Nested State Machines

Real applications often have hierarchical states. For example, an app can be offline/online/maintenance, and within online there are connection and authentication states:

```typescript
type ConnectionSubState =
  | { readonly status: 'connecting'; readonly attempt: number }
  | { readonly status: 'connected'; readonly connectedAt: number; readonly latency: number }

type AuthSubState =
  | { readonly status: 'anonymous' }
  | { readonly status: 'authenticating'; readonly provider: string }
  | { readonly status: 'authenticated'; readonly userId: string; readonly token: string }
  | { readonly status: 'authError'; readonly reason: string }

type AppState =
  | { readonly phase: 'offline' }
  | { readonly phase: 'online'; readonly connection: ConnectionSubState; readonly auth: AuthSubState }
  | { readonly phase: 'maintenance'; readonly estimatedEnd: number; readonly message: string }
```

### Reducer for Hierarchical States

```typescript
type AppAction =
  | { type: 'GO_ONLINE' }
  | { type: 'CONNECTED'; latency: number }
  | { type: 'LOGIN_SUCCESS'; userId: string; token: string }

function reduceAppState(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'GO_ONLINE':
      return {
        phase: 'online',
        connection: { status: 'connecting', attempt: 1 },
        auth: { status: 'anonymous' },
      }

    case 'CONNECTED':
      if (state.phase !== 'online') return state
      return {
        ...state,
        connection: { status: 'connected', connectedAt: Date.now(), latency: action.latency },
      }
    // ...
  }
}
```

📌 **Key technique:** checking `state.phase !== 'online'` before accessing `connection`/`auth` -- TypeScript narrows the type and allows access to nested fields.

## 🔥 State Narrowing: Pattern Matching on States

### Type Guards for States

```typescript
function isInState<S extends DocumentState['status']>(
  state: DocumentState,
  status: S
): state is Extract<DocumentState, { status: S }> {
  return state.status === status
}

if (isInState(doc, 'published')) {
  console.log(doc.url)  // TypeScript knows url exists
}
```

### Transition Functions with Typed Inputs

```typescript
// Accepts ONLY draft
function submitForReview(
  state: Extract<DocumentState, { status: 'draft' }>,
  reviewer: string
): Extract<DocumentState, { status: 'review' }> { ... }

// Accepts ONLY review
function approve(
  state: Extract<DocumentState, { status: 'review' }>
): Extract<DocumentState, { status: 'approved' }> { ... }
```

Now it's impossible to call `approve` on a document in `draft` status -- TypeScript won't allow it:

```typescript
approve(draftDoc)  // ❌ Error: draft is incompatible with review
```

### Exhaustive Match for States

```typescript
function matchDocumentState<R>(
  state: DocumentState,
  handlers: {
    draft: (s: Extract<DocumentState, { status: 'draft' }>) => R
    review: (s: Extract<DocumentState, { status: 'review' }>) => R
    approved: (s: Extract<DocumentState, { status: 'approved' }>) => R
    published: (s: Extract<DocumentState, { status: 'published' }>) => R
    archived: (s: Extract<DocumentState, { status: 'archived' }>) => R
  }
): R { ... }
```

## ⚠️ Common Beginner Mistakes

### Mistake 1: Shared Object Instead of Discriminated Union

```typescript
// ❌ All data in one object with optional fields
interface State {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: Error
}

// ✅ Discriminated union with data for each state
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error }
```

### Mistake 2: Strings Instead of Typed States

```typescript
// ❌ State as string — no protection from typos
function transition(current: string, next: string) { ... }
transition('idle', 'loadng')  // Typo not detected

// ✅ Union type constrains allowed values
type State = 'idle' | 'loading' | 'success' | 'error'
```

### Mistake 3: Accessing Data Without State Check

```typescript
// ❌ Unsafe access
function getItems(state: FetchState<Item[]>) {
  return state.data  // Error: data doesn't exist in idle/loading/error
}

// ✅ Check state before access
function getItems(state: FetchState<Item[]>): Item[] | null {
  if (state.status === 'success') {
    return state.data  // TypeScript knows data exists
  }
  return null
}
```

### Mistake 4: Missing Nested State Handling

```typescript
// ❌ Forgot to check phase before accessing connection
function getLatency(state: AppState): number {
  return state.connection.latency  // Error: connection doesn't exist in offline
}

// ✅ Check the hierarchy
if (state.phase === 'online' && state.connection.status === 'connected') {
  return state.connection.latency  // Safe
}
```

## 💡 Best Practices

1. **Discriminated union for states** -- each state has its own data set, no optional fields
2. **Mapped type for transition maps** -- compile-time verification of allowed transitions
3. **Extract for narrowing** -- `Extract<State, { status: S }>` extracts a specific state from the union
4. **Transition functions accept specific states** -- `approve(review)` instead of `approve(anyState)`
5. **Hierarchy for complex machines** -- nested discriminated unions instead of flat lists
6. **readonly for all fields** -- state should not mutate, only be replaced with new
7. **fold for exhaustive handling** -- guarantees processing of all possible states
