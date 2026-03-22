# Level 1: Observable State

## What is Observable?

Observable is data that MobX tracks. When an observable value changes, all dependent computed values and reactions update automatically.

## makeAutoObservable vs makeObservable

### makeAutoObservable

Automatically infers annotation types:
- Properties → `observable`
- Getters → `computed`
- Methods → `action`
- Generators → `flow`

```ts
class Store {
  value = 0

  constructor() {
    makeAutoObservable(this)
  }

  setValue(v: number) {  // automatically action
    this.value = v
  }

  get doubled() {  // automatically computed
    return this.value * 2
  }
}
```

### makeObservable

Requires explicit annotations — full control:

```ts
class Store {
  value = 0

  constructor() {
    makeObservable(this, {
      value: observable,
      setValue: action,
      doubled: computed,
    })
  }

  setValue(v: number) {
    this.value = v
  }

  get doubled() {
    return this.value * 2
  }
}
```

## Observable Types

MobX applies deep observability by default:

### Arrays
```ts
class Store {
  items: string[] = []
  constructor() { makeAutoObservable(this) }
  addItem(item: string) {
    this.items.push(item)  // MobX intercepts push
  }
}
```

### Map and Set
```ts
class Store {
  tags = new Map<string, string>()
  selected = new Set<number>()
  constructor() { makeAutoObservable(this) }
}
```

## observable.ref

Tracks only **reference replacement**, not internal mutations:

```ts
makeObservable(this, {
  data: observable.ref,  // only whole-array replacement
})
```

Use `observable.ref` when data is replaced entirely (e.g., API responses) or for performance optimization.
