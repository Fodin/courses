# Level 1: Type-Safe Events

## 🎯 Level Goal

Learn to design event-driven architecture where TypeScript guarantees correspondence between event names and their payloads, preventing an entire class of runtime errors.

---

## The Problem: Lost Types in Events

The standard EventEmitter pattern in Node.js and DOM uses strings for event names:

```typescript
// ❌ Node.js EventEmitter — complete type loss
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

// Can subscribe to any string with any handler
emitter.on('user:login', (data) => {
  // data: any — no payload typing
  console.log(data.nmae) // typo, but no error
})

// Can emit anything
emitter.emit('user:logni', { userId: 42 }) // typo in name, but no error
```

Problems:
- Event name is an arbitrary string, typos aren't caught
- Payload is untyped (`any`)
- No connection between event name and data structure
- Refactoring is dangerous: renaming events goes undetected

---

## Solution: Typed Event Emitter

### Step 1: Define the Event Map

```typescript
// Map: event name -> payload type
interface AppEvents {
  'user:login': { userId: string; timestamp: number }
  'user:logout': { userId: string }
  'notification': { message: string; level: 'info' | 'warn' | 'error' }
  'data:sync': { source: string; recordCount: number }
}
```

📌 Each interface key is an event name, and the value is its payload type. TypeScript uses this map for correspondence checking.

### Step 2: Generic EventEmitter

```typescript
type EventHandler<T> = (payload: T) => void

class TypedEventEmitter<TEvents extends Record<string, unknown>> {
  private handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>()

  on<K extends keyof TEvents>(
    event: K,
    handler: EventHandler<TEvents[K]>
  ): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>)
    return () => this.off(event, handler)
  }

  emit<K extends keyof TEvents>(
    event: K,
    payload: TEvents[K]
  ): void {
    this.handlers.get(event)?.forEach((h) => h(payload))
  }

  off<K extends keyof TEvents>(
    event: K,
    handler: EventHandler<TEvents[K]>
  ): void {
    this.handlers.get(event)?.delete(handler as EventHandler<unknown>)
  }
}
```

💡 **Key insight**: the parameter `K extends keyof TEvents` links the event name to its payload. TypeScript automatically infers the `payload` type from `TEvents[K]`.

```typescript
const emitter = new TypedEventEmitter<AppEvents>()

// ✅ TypeScript knows the payload type
emitter.on('user:login', (data) => {
  console.log(data.userId)    // string
  console.log(data.timestamp) // number
})

// ❌ Compile errors
emitter.emit('user:login', { userId: 42 })        // number != string
emitter.emit('user:logni', { userId: 'x' })        // typo in name
emitter.on('notification', (data) => data.userId)   // no userId
```

---

## Event Bus: Centralized Event Bus

Event Bus extends EventEmitter with a middleware pattern and history:

```typescript
type Middleware<TEvents> = <K extends keyof TEvents>(
  event: K,
  payload: TEvents[K],
  next: () => void
) => void

class EventBus<TEvents extends Record<string, unknown>> {
  private middlewares: Middleware<TEvents>[] = []
  private history: Array<{ event: keyof TEvents; payload: unknown }> = []

  use(middleware: Middleware<TEvents>): void {
    this.middlewares.push(middleware)
  }

  publish<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const execute = () => {
      this.history.push({ event, payload })
      // ... notify subscribers
    }

    // Chain middlewares
    const chain = [...this.middlewares]
    const run = (i: number): void => {
      if (i >= chain.length) { execute(); return }
      chain[i](event, payload, () => run(i + 1))
    }
    run(0)
  }
}
```

### Middleware Examples

```typescript
// Logging
bus.use((event, payload, next) => {
  console.log(`[EVENT] ${String(event)}`, payload)
  next()
})

// Validation
bus.use((event, payload, next) => {
  if (event === 'order:created' && (payload as any).total <= 0) {
    throw new Error('Invalid order total')
  }
  next()
})
```

---

## DOM Event Typing

### Custom Events

```typescript
interface CustomEventMap {
  'app:theme-change': { theme: 'light' | 'dark' }
  'app:language-change': { locale: string; direction: 'ltr' | 'rtl' }
}

function dispatchTypedEvent<K extends keyof CustomEventMap>(
  eventName: K,
  detail: CustomEventMap[K]
): void {
  document.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true }))
}

function onTypedEvent<K extends keyof CustomEventMap>(
  eventName: K,
  handler: (detail: CustomEventMap[K]) => void
): () => void {
  const listener = (e: Event) => {
    handler((e as CustomEvent<CustomEventMap[K]>).detail)
  }
  document.addEventListener(eventName, listener)
  return () => document.removeEventListener(eventName, listener)
}
```

### Conditional Typing for Elements

```typescript
type TypedElementEvents<E extends HTMLElement> = {
  click: { element: E; x: number; y: number }
  input: E extends HTMLInputElement
    ? { element: E; value: string }
    : never  // input event available only for input elements
}
```

---

## Event Sourcing: Type-Safe Event Store

Event Sourcing stores change history as a sequence of immutable events:

```typescript
interface BaseEvent {
  id: string
  timestamp: number
  version: number
}

interface AccountCreated extends BaseEvent {
  type: 'AccountCreated'
  payload: { accountId: string; owner: string; initialBalance: number }
}

// Discriminated union of all events
type AccountEvent = AccountCreated | MoneyDeposited | MoneyWithdrawn | AccountClosed
```

### Reducer for State Reconstruction

```typescript
type EventReducer<TState, TEvent> = (state: TState, event: TEvent) => TState

const accountReducer: EventReducer<AccountState | null, AccountEvent> = (state, event) => {
  switch (event.type) {
    case 'AccountCreated':
      return { /* ... initial state from event.payload */ }
    case 'MoneyDeposited':
      return { ...state!, balance: state!.balance + event.payload.amount }
    // ... exhaustive matching
  }
}
```

### EventStore with Type Filtering

```typescript
class EventStore<TEvent extends { type: string }> {
  getByType<K extends TEvent['type']>(
    type: K
  ): Extract<TEvent, { type: K }>[] {
    // Extract narrows the union to a specific variant
    return this.events.filter(
      (e): e is Extract<TEvent, { type: K }> => e.type === type
    )
  }

  replay<TState>(reducer: EventReducer<TState, TEvent>, initial: TState): TState {
    return this.events.reduce(reducer, initial)
  }

  // Time-travel: restore state at a point in time
  replayUntil<TState>(
    reducer: EventReducer<TState, TEvent>,
    initial: TState,
    until: number
  ): TState {
    return this.events
      .filter((e) => (e as any).timestamp <= until)
      .reduce(reducer, initial)
  }
}
```

---

## ⚠️ Common Beginner Mistakes

### Mistake 1: String Literals Instead of Event Map

```typescript
// ❌ Strings — no checking
class BadEmitter {
  on(event: string, handler: Function) { /* ... */ }
  emit(event: string, data: any) { /* ... */ }
}

// ✅ Event map — full checking
class GoodEmitter<T extends Record<string, unknown>> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void) { /* ... */ }
  emit<K extends keyof T>(event: K, data: T[K]) { /* ... */ }
}
```

### Mistake 2: Memory Leaks — Forgotten Subscriptions

```typescript
// ❌ Subscribe without unsubscribe
emitter.on('data:update', handler)
// Component unmounted, but handler still fires

// ✅ Return unsubscribe function and use in cleanup
const unsubscribe = emitter.on('data:update', handler)
// On unmount:
unsubscribe()
```

### Mistake 3: Mutating Payload in Handler

```typescript
// ❌ Mutating shared object
emitter.on('notification', (data) => {
  data.message = data.message.toUpperCase() // Mutation!
})

// ✅ Readonly payload
type EventHandler<T> = (payload: Readonly<T>) => void
```

### Mistake 4: Missing Exhaustive Matching in Reducer

```typescript
// ❌ Forgot to handle new event type
const reducer = (state: State, event: AccountEvent) => {
  switch (event.type) {
    case 'AccountCreated': return /* ... */
    case 'MoneyDeposited': return /* ... */
    // MoneyWithdrawn and AccountClosed forgotten!
    default: return state
  }
}

// ✅ Exhaustive check
default: {
  const _exhaustive: never = event
  return state
}
```

---

## 🔥 Best Practices

1. **Event map as single source of truth** — all events described in one interface
2. **Return unsubscribe** — `on()` method always returns an unsubscribe function
3. **Immutable payloads** — use `Readonly<T>` to prevent mutations
4. **Middleware for cross-cutting concerns** — logging, metrics, validation
5. **Exhaustive matching** in reducers — `never` check in `default` branch
6. **Event versioning** — `version` field in base event interface
7. **Namespace convention** — `domain:action` (`user:login`, `order:created`)
