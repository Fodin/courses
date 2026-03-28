# ⚙️ Level 3: Behavioral Patterns

## 📖 Introduction

Behavioral patterns define **how objects interact with each other**. Unlike creational (creation) and structural (composition) patterns, behavioral patterns describe **algorithms and the distribution of responsibilities** among objects.

TypeScript makes these patterns especially powerful through strict typing: interfaces describe behavioral contracts, and generics allow creating universal solutions.

## ♟️ Strategy

### Problem

You want to change the algorithm for performing a task without modifying the code that uses it:

```typescript
// ❌ Bad: hardcoded logic
function sort(arr: number[], method: string) {
  if (method === 'bubble') { /* ... */ }
  else if (method === 'quick') { /* ... */ }
  else if (method === 'merge') { /* ... */ }
  // Every new algorithm — a new if
}
```

### Solution

Extract the algorithm into an interface, and concrete implementations into separate classes:

```typescript
interface SortStrategy<T> {
  sort(data: T[]): T[]
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    const arr = [...data]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

// ✅ Context uses the strategy through the interface
class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>) {
    this.strategy = strategy
  }

  sort(data: T[]): T[] {
    return this.strategy.sort(data)
  }
}
```

> 💡 **Tip:** Strategy pairs well with DI — the strategy can be injected via the constructor or configuration.

## 👁️ Observer

### Problem

You need to notify multiple objects about changes without creating tight coupling between them.

### Solution

A typed EventEmitter with support for an event map:

```typescript
type EventMap = {
  userLogin: { userId: string; timestamp: number }
  error: { message: string; code: number }
}

type Listener<T> = (data: T) => void

class TypedEventEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Set<Listener<T[keyof T]>>>()

  on<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as Listener<T[keyof T]>)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach(fn => fn(data))
  }
}
```

> 🔥 **Key insight:** TypeScript guarantees that `emit('userLogin', data)` receives exactly `{ userId: string; timestamp: number }`, not an arbitrary object.

## 📝 Command

### Problem

You need to support undo/redo, an operation queue, or action logging.

### Solution

Encapsulate an action in an object with `execute` and `undo` methods:

```typescript
interface Command {
  execute(): void
  undo(): void
}

class TextEditor {
  private content = ''
  private history: Command[] = []

  executeCommand(command: Command) {
    command.execute()
    this.history.push(command)
  }

  undo() {
    const command = this.history.pop()
    command?.undo()
  }
}
```

> 💡 **Tip:** Each command should be self-contained for `undo` — save the previous state inside the command.

## ⛓️ Chain of Responsibility

### Problem

A request must pass through multiple handlers (authorization, validation, logging), but the order and set of handlers may vary.

### Solution

Each handler decides whether to process the request itself or pass it to the next one:

```typescript
interface Handler<T> {
  setNext(handler: Handler<T>): Handler<T>
  handle(request: T): T | null
}

abstract class BaseHandler<T> implements Handler<T> {
  private next: Handler<T> | null = null

  setNext(handler: Handler<T>): Handler<T> {
    this.next = handler
    return handler
  }

  handle(request: T): T | null {
    if (this.next) {
      return this.next.handle(request)
    }
    return request
  }
}
```

> 📌 **Important:** Always define what happens if no handler fires — otherwise the request may get "lost" in the chain.

## ⚠️ Common Beginner Mistakes

### 🐛 1. Strategy without an interface

❌ **Bad** — passing a string identifier instead of a strategy object:
```typescript
function sort(arr: number[], algorithm: 'bubble' | 'quick') {
  // Violates the Open/Closed Principle
}
```

✅ **Good** — a strategy is an object with a contract:
```typescript
function sort<T>(arr: T[], strategy: SortStrategy<T>): T[] {
  return strategy.sort(arr)
}
```

### 🐛 2. Observer with a memory leak

❌ **Bad** — subscribing without unsubscribing:
```typescript
emitter.on('event', handler)
// Component is destroyed, but handler remains in memory
```

✅ **Good** — always provide `off`:
```typescript
emitter.on('event', handler)
// On destruction:
emitter.off('event', handler)
```

> ⚠️ **Important:** In React this is especially critical — subscribing in `useEffect` without unsubscribing in the cleanup function causes memory leaks.

### 🐛 3. Command without immutable state

❌ **Bad** — command holds a reference to a mutable object:
```typescript
class InsertCommand {
  constructor(private text: string, private editor: Editor) {}
  undo() {
    // If editor.content was changed by another command — undo is broken
  }
}
```

✅ **Good** — command saves a state snapshot for undo:
```typescript
class InsertCommand {
  private previousContent = ''
  execute() {
    this.previousContent = this.editor.getContent()
    // ...
  }
}
```

### 🐛 4. Chain of Responsibility without a terminating handler

❌ **Bad** — a chain without a final handler — the request gets lost.

✅ **Good** — always define what happens if no handler fires.

## 💡 Best Practices

- ♟️ **Strategy**: use generics for universal strategies
- 👁️ **Observer**: type the event map via `Record<string, unknown>`
- 📝 **Command**: each command should be self-contained for undo
- ⛓️ **Chain**: handlers should not know about the chain's structure
- 🔥 **General**: interfaces + generics = type-safe behavioral patterns
