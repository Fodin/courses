# Level 3: Computed Values

## What is Computed?

Computed values are derived from observable state. MobX automatically tracks dependencies and recalculates only when those dependencies change.

```ts
class Store {
  items = []
  constructor() { makeAutoObservable(this) }

  get totalPrice() {  // recalculated only when items change
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }
}
```

## Computed Chains

Computed values can depend on other computed values:

```ts
get subtotal() { return ... }
get tax() { return this.subtotal * 0.2 }      // depends on subtotal
get total() { return this.subtotal + this.tax } // depends on both
```

## Caching

Computed values are **cached** — they only recalculate when dependencies change. Accessing the same computed multiple times without changes returns the cached value.

## comparer.structural

By default, computed uses reference equality (`===`). If your computed returns a new object each time, use `comparer.structural`:

```ts
makeAutoObservable(this, {
  viewport: computed({ equals: comparer.structural }),
})
```

This prevents unnecessary re-renders when the computed value is structurally identical.
