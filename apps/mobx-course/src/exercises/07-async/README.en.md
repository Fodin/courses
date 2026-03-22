# Level 7: Async — Asynchronous Operations in MobX

## Introduction

Asynchronous operations — data fetching, form submissions, API calls — are an integral part of any application. But in MobX there is a catch: **actions are synchronous by nature**, and code after `await` executes in a different "tick" of the event loop, losing the action context.

In this level we will cover all MobX approaches to asynchrony: from `runInAction` to `flow` generators, request cancellation, caching, and optimistic updates.

---

## 1. The Problem: Code After `await` Loses the Action Context

When you write an `async` method in a MobX store, the code **before** the first `await` executes inside an action (because `makeAutoObservable` marked the method as an action). But the code **after** `await` executes in the next microtask — MobX no longer considers it part of the action.

```ts
class UserStore {
  users: User[] = []
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchUsers() {
    this.isLoading = true // ✅ Inside action — works

    const data = await api.getUsers()

    // ❌ This code is NO LONGER inside an action!
    // With enforceActions: 'always' you will get an error:
    // "[MobX] Since strict-mode is enabled, changing observed
    //  observable values without using an action is not allowed"
    this.users = data
    this.isLoading = false
  }
}
```

Even without `enforceActions: 'always'` this is bad: MobX cannot batch changes after `await`, and each assignment triggers a separate re-render.

---

## 2. Solution: `runInAction`

`runInAction` is a one-off unnamed action. Wrap all state changes after `await` in it:

```ts
import { makeAutoObservable, runInAction } from 'mobx'

class UserStore {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchUsers() {
    this.isLoading = true // ✅ Before await — inside action
    this.error = null

    try {
      const users = await api.getUsers()

      runInAction(() => {
        this.users = users     // ✅ Wrapped in runInAction
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message
        this.isLoading = false
      })
    }
  }
}
```

### Important: Each `await` Creates a New Break

If the method has multiple `await` calls, you need `runInAction` after **each one**:

```ts
async fetchAndProcess() {
  this.isLoading = true

  const raw = await api.getRawData()

  runInAction(() => {
    this.rawData = raw
    this.status = 'processing'
  })

  const processed = await processData(raw)

  runInAction(() => {
    this.processedData = processed
    this.isLoading = false
  })
}
```

---

## 3. Alternative: `flow` — Generators Instead of async/await

MobX offers `flow` — a wrapper around a generator that automatically wraps the code between `yield` calls in an action context. No need to manually write `runInAction`:

```ts
import { makeAutoObservable, flow } from 'mobx'

class UserStore {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // flow instead of async, yield instead of await
  fetchUsers = flow(function* (this: UserStore) {
    this.isLoading = true
    this.error = null
    try {
      this.users = yield api.getUsers() // yield instead of await
      this.isLoading = false
    } catch (e) {
      this.error = (e as Error).message
      this.isLoading = false
    }
  })
}
```

### How flow Works

1. `flow` takes a generator function (`function*`)
2. Each `yield` awaits a promise (like `await`)
3. Code between `yield` calls executes inside an action context
4. `this` is bound automatically (arrow function in field declaration)
5. Returns a `CancellablePromise` — a promise that can be cancelled

### Typing `this` in flow

Since `flow` takes a regular `function*`, not an arrow function, `this` needs to be explicitly typed:

```ts
fetchUsers = flow(function* (this: UserStore) {
  //                          ^^^^^^^^^^^^^^^^
  //                          Explicit this typing
  this.users = yield api.getUsers()
})
```

---

## 4. Cancelling flow — `promise.cancel()`

One of the key advantages of `flow` over `async/await` is cancellation support. Calling `flow` returns a `CancellablePromise`:

```ts
class SlowDataStore {
  data: string | null = null
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  fetchData = flow(function* (this: SlowDataStore) {
    this.isLoading = true
    try {
      yield new Promise(resolve => setTimeout(resolve, 3000))
      this.data = 'Data loaded at ' + new Date().toLocaleTimeString()
    } finally {
      // finally executes even on cancellation!
      this.isLoading = false
    }
  })
}
```

### Cancellation in a React Component

```tsx
const DataLoader = observer(function DataLoader() {
  const [store] = useState(() => new SlowDataStore())

  useEffect(() => {
    const promise = store.fetchData()

    return () => {
      promise.cancel() // Cancel on unmount
    }
  }, [store])

  return <div>{store.isLoading ? 'Loading...' : store.data}</div>
})
```

When `promise.cancel()` is called:
- The generator is interrupted
- The `finally` block **executes** (you can reset `isLoading`)
- The promise rejects with `FLOW_CANCELLED`
- No further state updates occur

### Manual Cancellation by the User

```tsx
const [flowPromise, setFlowPromise] = useState<{ cancel(): void } | null>(null)

const handleStart = () => {
  const promise = store.fetchData()
  setFlowPromise(promise)
}

const handleCancel = () => {
  flowPromise?.cancel()
}
```

---

## 5. Caching and `fetchIfNeeded`

A common pattern is to avoid reloading data if it is still fresh:

```ts
class CachedUserStore {
  users: User[] = []
  isLoading = false
  lastFetchedAt: number | null = null
  maxAge = 5000 // 5 seconds

  constructor() {
    makeAutoObservable(this)
  }

  get isStale() {
    if (!this.lastFetchedAt) return true
    return Date.now() - this.lastFetchedAt > this.maxAge
  }

  async fetchIfNeeded() {
    if (!this.isStale) {
      console.log('[cache] Data is fresh, skipping fetch')
      return
    }

    this.isLoading = true
    try {
      const users = await api.getUsers()
      runInAction(() => {
        this.users = users
        this.lastFetchedAt = Date.now()
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  invalidate() {
    this.lastFetchedAt = null
  }
}
```

### Key Elements of the Pattern

| Element | Purpose |
|---------|---------|
| `lastFetchedAt` | Timestamp of the last fetch |
| `maxAge` | Maximum cache age in milliseconds |
| `isStale` (computed) | `true` if data is outdated or missing |
| `fetchIfNeeded()` | Fetches only if `isStale === true` |
| `invalidate()` | Forcibly marks data as outdated |

---

## 6. Optimistic Updates

An optimistic update is a pattern where the UI is updated **immediately**, without waiting for the server response. If the server returns an error, the change is **rolled back**:

```ts
class OptimisticTodoStore {
  todos: Todo[] = [
    { id: '1', title: 'Buy groceries', completed: false },
  ]
  lastError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async toggle(id: string) {
    const todo = this.todos.find(t => t.id === id)
    if (!todo) return

    // 1. Save the previous value
    const prevState = todo.completed

    // 2. Optimistically update
    runInAction(() => {
      todo.completed = !todo.completed
      todo.pending = true
      this.lastError = null
    })

    try {
      // 3. Send to the server
      await api.toggleTodo(id)

      runInAction(() => {
        todo.pending = false
      })
    } catch {
      // 4. Roll back on error
      runInAction(() => {
        todo.completed = prevState
        todo.pending = false
        this.lastError = `Failed to toggle "${todo.title}" — rolled back`
      })
    }
  }
}
```

### Optimistic Update Algorithm

1. **Save** the previous state
2. **Apply** the change immediately (+ mark as `pending`)
3. **Send** the request to the server
4. **On success** — remove the `pending` flag
5. **On error** — restore the old state (rollback)

---

## Comparison: `runInAction` vs `flow`

| Criterion | `runInAction` | `flow` |
|-----------|--------------|--------|
| Syntax | `async/await` + wrappers | `function*` + `yield` |
| Boilerplate | More (wrapper after each `await`) | Less (automatic action context) |
| Cancellation | Not supported out of the box | `promise.cancel()` |
| Typing | Standard | Requires explicit `this` typing |
| Familiarity | Familiar async/await | Generators — less familiar |
| Nested promises | Each `await` requires `runInAction` | Each `yield` is automatically wrapped |
| DevTools tracking | Shown as separate actions | Shown as a single flow |

### When to Use Which

- **`runInAction`** — simple requests with 1-2 `await` calls, no cancellation needed
- **`flow`** — complex request chains, cancellation needed, less boilerplate desired

---

## Common Beginner Mistakes

### Mistake 1: Forgetting `runInAction` After `await`

```ts
// ❌ Wrong — state change outside of action
async fetchUsers() {
  this.isLoading = true
  const users = await api.getUsers()
  this.users = users       // ❌ Outside action!
  this.isLoading = false   // ❌ Outside action!
}

// ✅ Correct — wrapped in runInAction
async fetchUsers() {
  this.isLoading = true
  const users = await api.getUsers()
  runInAction(() => {
    this.users = users
    this.isLoading = false
  })
}
```

**Why this is a mistake:** After `await` the action context is lost. With `enforceActions: 'always'` you will get an error, and without it you lose batching (extra re-renders).

---

### Mistake 2: Using `await` Instead of `yield` Inside `flow`

```ts
// ❌ Wrong — await inside a flow generator
fetchUsers = flow(function* (this: UserStore) {
  this.users = await api.getUsers() // ❌ await instead of yield
})

// ✅ Correct — yield instead of await
fetchUsers = flow(function* (this: UserStore) {
  this.users = yield api.getUsers() // ✅ yield
})
```

**Why this is a mistake:** `flow` works through the generator mechanism. `await` inside a generator is not intercepted by MobX — the action context is lost just like without `flow`.

---

### Mistake 3: Not Handling `finally` on flow Cancellation

```ts
// ❌ Wrong — isLoading gets stuck at true on cancellation
fetchData = flow(function* (this: Store) {
  this.isLoading = true
  try {
    this.data = yield api.getData()
    this.isLoading = false // Won't execute on cancel!
  } catch (e) {
    this.isLoading = false
  }
})

// ✅ Correct — reset isLoading in finally
fetchData = flow(function* (this: Store) {
  this.isLoading = true
  try {
    this.data = yield api.getData()
  } finally {
    this.isLoading = false // Always executes, even on cancel
  }
})
```

**Why this is a mistake:** When `promise.cancel()` is called, the generator is interrupted. Code in `try` after `yield` will not execute, but `finally` **always** executes. If you don't reset `isLoading` in `finally`, the UI will be stuck in the loading state.

---

### Mistake 4: Not Saving Previous State for Optimistic Updates

```ts
// ❌ Wrong — nothing to roll back to on error
async toggle(id: string) {
  const todo = this.todos.find(t => t.id === id)
  if (!todo) return

  runInAction(() => {
    todo.completed = !todo.completed
  })

  try {
    await api.toggleTodo(id)
  } catch {
    // How to roll back? The previous value is lost!
    runInAction(() => {
      todo.completed = !todo.completed // Guessing... unreliable
    })
  }
}

// ✅ Correct — save prevState
async toggle(id: string) {
  const todo = this.todos.find(t => t.id === id)
  if (!todo) return

  const prevState = todo.completed // Save it!

  runInAction(() => {
    todo.completed = !todo.completed
  })

  try {
    await api.toggleTodo(id)
  } catch {
    runInAction(() => {
      todo.completed = prevState // Exact restoration
    })
  }
}
```

**Why this is a mistake:** Double inversion (`!todo.completed` in catch) only works for boolean fields. For strings, numbers, or objects it won't work. Always save a snapshot of the previous state.

---

### Mistake 5: Not Cleaning Up flow on Component Unmount

```tsx
// ❌ Wrong — leak: flow keeps running after unmount
const Component = observer(function Component() {
  const [store] = useState(() => new DataStore())

  useEffect(() => {
    store.fetchData() // Not cancelled on unmount!
  }, [store])

  return <div>{store.data}</div>
})

// ✅ Correct — cleanup with cancel
const Component = observer(function Component() {
  const [store] = useState(() => new DataStore())

  useEffect(() => {
    const promise = store.fetchData()
    return () => promise.cancel() // Cancel on unmount
  }, [store])

  return <div>{store.data}</div>
})
```

**Why this is a mistake:** Without cancellation, the flow continues executing after the component unmounts. This can lead to state updates on a "dead" store, unnecessary requests, and memory leaks.

---

## Additional Resources

- [MobX: Asynchronous actions](https://mobx.js.org/actions.html#asynchronous-actions)
- [MobX: Using flow instead of async/await](https://mobx.js.org/actions.html#using-flow-instead-of-async--await)
- [MobX: flowResult](https://mobx.js.org/actions.html#flowresult)
- [MDN: Generators and Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
