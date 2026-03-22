# Level 0: Setup — First MobX Store

## Introduction to MobX

Welcome to the **MobX** course! MobX is a state management library for JavaScript applications based on **reactive programming** principles. MobX automatically tracks dependencies and updates only what has changed.

### Why MobX?

| Approach            | Boilerplate | Rerenders    | Mental Model             |
| ------------------- | ----------- | ------------ | ------------------------ |
| **MobX**            | Minimal     | Granular     | OOP, mutations           |
| Redux Toolkit       | Medium      | Manual       | Functional, immutable    |
| Zustand             | Minimal     | Manual       | Functional               |
| React Context       | Minimal     | All subscribers | Built-in                |

**MobX Advantages:**

1. **Minimal boilerplate** — no need for reducers, action types, selectors
2. **Automatic tracking** — MobX knows which components depend on which data
3. **Granular rerenders** — only the component whose data changed will update
4. **Mutable style** — write `store.count++` instead of `return { ...state, count: state.count + 1 }`
5. **TypeScript out of the box** — classes and decorators are well-typed

---

## Three Pillars of MobX

MobX is built on three key concepts:

```
Actions → Observable State → Computed → Side Effects (Reactions)
```

### 1. Observable State

This is your application data. MobX tracks changes to it:

```ts
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0 // observable

  constructor() {
    makeAutoObservable(this)
  }
}
```

### 2. Actions

Functions that modify state:

```ts
class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {  // action
    this.count++
  }

  decrement() {  // action
    this.count--
  }
}
```

### 3. Derivations

**Computed values** — values derived from state:

```ts
class CartStore {
  items = []

  constructor() {
    makeAutoObservable(this)
  }

  get totalPrice() {  // computed
    return this.items.reduce((sum, item) => sum + item.price, 0)
  }
}
```

**Reactions** — side effects triggered by state changes (React component rerender, localStorage write, server request).

---

## makeAutoObservable

The simplest way to make a class observable. `makeAutoObservable` automatically infers:

- **Properties** → `observable`
- **Getters** → `computed`
- **Methods** → `action`
- **Generators** → `flow`

```ts
import { makeAutoObservable } from 'mobx'

class TodoStore {
  todos = []
  filter = 'all'

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title) {      // action (automatic)
    this.todos.push({ title, done: false })
  }

  get activeTodos() {   // computed (automatic)
    return this.todos.filter(t => !t.done)
  }
}
```

---

## Connecting to React: observer

To make a React component react to MobX store changes, wrap it with `observer` from `mobx-react-lite`:

```tsx
import { observer } from 'mobx-react-lite'

const counterStore = new CounterStore()

const Counter = observer(function Counter() {
  return (
    <div>
      <p>Count: {counterStore.count}</p>
      <button onClick={() => counterStore.increment()}>+1</button>
    </div>
  )
})
```

**Important:** without `observer`, the component will NOT rerender when the store changes!

### How Does It Work?

1. `observer` wraps the component and tracks which observable properties were read during render
2. When any of those properties change, the component automatically rerenders
3. If a property was not read during render, its change will not trigger a rerender

---

## Creating a Store: Step-by-Step Guide

### Step 1: Define a class with state

```ts
class CounterStore {
  count = 0
}
```

### Step 2: Add `makeAutoObservable` to the constructor

```ts
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }
}
```

### Step 3: Add methods to modify state

```ts
class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
```

### Step 4: Create an instance and use it

```ts
const store = new CounterStore()
store.increment()
console.log(store.count) // 1
```

---

## Common Beginner Mistakes

### Forgetting to call makeAutoObservable

```ts
class Store {
  count = 0
  increment() { this.count++ }
}
// MobX knows nothing about this class!
// observer components will not react to changes
```

### Forgetting to wrap the component in observer

```tsx
// Component will NOT update:
function Counter() {
  return <p>{store.count}</p>
}

// Component WILL update:
const Counter = observer(function Counter() {
  return <p>{store.count}</p>
})
```

### Destructuring an observable object

```tsx
// Tracking is lost:
const { count } = store
return <p>{count}</p> // NOT reactive!

// Correct:
return <p>{store.count}</p> // Reactive
```

---

## Additional Resources

- [Official MobX Documentation](https://mobx.js.org/)
- [MobX + React: Quick Start](https://mobx.js.org/react-integration.html)
- [makeAutoObservable API](https://mobx.js.org/observable-state.html#makeautoobservable)

---

## What's Next?

In the next level you will learn:

- The difference between `makeAutoObservable` and `makeObservable`
- Explicit annotations: `observable`, `action`, `computed`
- Observable types: arrays, Map, Set
- Modifiers: `observable.ref`, `observable.shallow`
