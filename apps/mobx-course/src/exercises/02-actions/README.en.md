# Level 2: Actions

## What is an Action?

An action is any piece of code that modifies state. In MobX, actions mark methods that modify observables. This helps structure code and optimize performance.

## enforceActions

By default MobX allows changing observables from anywhere. In practice, it's better to enable strict mode:

```ts
import { configure } from 'mobx'

configure({ enforceActions: 'always' })
```

Now any attempt to modify an observable outside an action will throw an error. This makes data flow predictable: state can only change through explicit actions.

Options for `enforceActions`:
- `'never'` — no restrictions (default)
- `'observed'` — requires action only for observables used in reactions
- `'always'` — requires action for any observable changes

## action in makeAutoObservable

When using `makeAutoObservable`, all class methods are automatically marked as `action`:

```ts
class Store {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {  // automatically an action
    this.count += 1
  }
}
```

## runInAction

After `await`, the action context is lost. Code after `await` runs in a different event loop tick, and MobX no longer considers it part of the action.

The solution is `runInAction`:

```ts
import { runInAction } from 'mobx'

class Store {
  data = null
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchData() {
    this.loading = true  // inside action (class method)

    const result = await api.getData()

    // this.data = result — error with enforceActions: 'always'

    runInAction(() => {
      this.data = result   // wrapped in runInAction
      this.loading = false
    })
  }
}
```

`runInAction` is a one-time unnamed action. Use it to update state after async operations.

## action.bound and autoBind

When a method is passed as a callback, `this` is lost:

```ts
const store = new Store()
setTimeout(store.tick, 1000) // this === undefined
```

### Solution 1: action.bound

```ts
class Store {
  value = 0

  constructor() {
    makeObservable(this, {
      value: observable,
      increment: action.bound,
    })
  }

  increment() {
    this.value += 1
  }
}
```

### Solution 2: autoBind

```ts
class Store {
  value = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  increment() {  // this is bound automatically
    this.value += 1
  }
}

const store = new Store()
setTimeout(store.increment, 1000)  // this works
```

## Batching

Inside a single action, all observable changes are batched — components re-render only once after the action completes:

```ts
class Store {
  firstName = ''
  lastName = ''
  age = 0

  constructor() {
    makeAutoObservable(this)
  }

  // Three mutations, but one re-render
  updateAll(first: string, last: string, age: number) {
    this.firstName = first
    this.lastName = last
    this.age = age
  }
}
```

Without an action, each mutation would trigger a separate re-render. With an action — only one re-render after the method exits.

This is one of the key advantages of actions: they automatically group changes.

## Summary

| Concept | Description |
|---------|-------------|
| `action` | Method that modifies observable state |
| `enforceActions` | Strict mode: mutations only through actions |
| `runInAction` | One-time action for code after await |
| `action.bound` | Bind this for use in callbacks |
| `autoBind: true` | Automatic this binding for all actions |
| Batching | All mutations in action = one re-render |
