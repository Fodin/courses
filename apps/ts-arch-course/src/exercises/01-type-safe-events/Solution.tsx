import { useState } from 'react'

// ============================================
// Задание 1.1: Typed Event Emitter — Решение
// ============================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type EventMap = {}

type EventHandler<T> = (payload: T) => void

class TypedEventEmitter<TEvents extends EventMap> {
  private handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>()

  on<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>)

    // Return unsubscribe function
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>)
    }
  }

  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    this.handlers.get(event)?.forEach((handler) => handler(payload))
  }

  off<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    this.handlers.get(event)?.delete(handler as EventHandler<unknown>)
  }

  once<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): void {
    const wrapper: EventHandler<TEvents[K]> = (payload) => {
      handler(payload)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  listenerCount<K extends keyof TEvents>(event: K): number {
    return this.handlers.get(event)?.size ?? 0
  }

  removeAllListeners<K extends keyof TEvents>(event?: K): void {
    if (event) {
      this.handlers.delete(event)
    } else {
      this.handlers.clear()
    }
  }
}

interface AppEvents {
  'user:login': { userId: string; timestamp: number }
  'user:logout': { userId: string }
  'notification': { message: string; level: 'info' | 'warn' | 'error' }
  'data:sync': { source: string; recordCount: number }
}

export function Task1_1_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const emitter = new TypedEventEmitter<AppEvents>()

    log.push('=== Typed Event Emitter ===')
    log.push('')

    // Subscribe to events
    const unsubLogin = emitter.on('user:login', (payload) => {
      log.push(`[LOGIN] User ${payload.userId} at ${new Date(payload.timestamp).toISOString()}`)
    })

    emitter.on('user:logout', (payload) => {
      log.push(`[LOGOUT] User ${payload.userId}`)
    })

    emitter.on('notification', (payload) => {
      log.push(`[${payload.level.toUpperCase()}] ${payload.message}`)
    })

    emitter.on('data:sync', (payload) => {
      log.push(`[SYNC] ${payload.recordCount} records from ${payload.source}`)
    })

    log.push('Listeners registered:')
    log.push(`  user:login: ${emitter.listenerCount('user:login')}`)
    log.push(`  user:logout: ${emitter.listenerCount('user:logout')}`)
    log.push(`  notification: ${emitter.listenerCount('notification')}`)
    log.push(`  data:sync: ${emitter.listenerCount('data:sync')}`)
    log.push('')

    // Emit events
    log.push('Emitting events:')
    emitter.emit('user:login', { userId: 'user-42', timestamp: Date.now() })
    emitter.emit('notification', { message: 'Welcome back!', level: 'info' })
    emitter.emit('data:sync', { source: 'api', recordCount: 150 })
    log.push('')

    // Unsubscribe
    log.push('Unsubscribing from user:login...')
    unsubLogin()
    log.push(`  user:login listeners: ${emitter.listenerCount('user:login')}`)
    log.push('')

    // Emit after unsubscribe
    log.push('Emitting user:login after unsubscribe (no handler):')
    emitter.emit('user:login', { userId: 'user-99', timestamp: Date.now() })
    log.push('  (silence — handler was removed)')
    log.push('')

    // Once
    log.push('Testing once():')
    emitter.once('notification', (payload) => {
      log.push(`  [ONCE] ${payload.message}`)
    })
    emitter.emit('notification', { message: 'First (once handler fires)', level: 'info' })
    emitter.emit('notification', { message: 'Second (once handler gone)', level: 'info' })
    log.push('')

    log.push('Type safety examples:')
    log.push('  emitter.emit("user:login", { userId: 42 })      // Error: number != string')
    log.push('  emitter.emit("unknown:event", {})                // Error: not in AppEvents')
    log.push('  emitter.on("notification", (p) => p.userId)      // Error: no userId on notification')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.1: Typed Event Emitter</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.2: Event Bus — Решение
// ============================================

type Middleware<TEvents extends EventMap> = <K extends keyof TEvents>(
  event: K,
  payload: TEvents[K],
  next: () => void
) => void

class EventBus<TEvents extends EventMap> {
  private handlers = new Map<keyof TEvents, Set<EventHandler<unknown>>>()
  private middlewares: Middleware<TEvents>[] = []
  private history: Array<{ event: keyof TEvents; payload: unknown; timestamp: number }> = []

  use(middleware: Middleware<TEvents>): void {
    this.middlewares.push(middleware)
  }

  subscribe<K extends keyof TEvents>(event: K, handler: EventHandler<TEvents[K]>): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set())
    }
    this.handlers.get(event)!.add(handler as EventHandler<unknown>)
    return () => {
      this.handlers.get(event)?.delete(handler as EventHandler<unknown>)
    }
  }

  publish<K extends keyof TEvents>(event: K, payload: TEvents[K]): void {
    const execute = () => {
      this.history.push({ event, payload, timestamp: Date.now() })
      this.handlers.get(event)?.forEach((handler) => handler(payload))
    }

    // Execute middleware chain
    const chain = [...this.middlewares]
    const runMiddleware = (index: number): void => {
      if (index >= chain.length) {
        execute()
        return
      }
      chain[index](event, payload, () => runMiddleware(index + 1))
    }
    runMiddleware(0)
  }

  getHistory(): Array<{ event: keyof TEvents; payload: unknown; timestamp: number }> {
    return [...this.history]
  }

  clearHistory(): void {
    this.history = []
  }
}

interface OrderEvents {
  'order:created': { orderId: string; items: string[]; total: number }
  'order:paid': { orderId: string; paymentMethod: string }
  'order:shipped': { orderId: string; trackingNumber: string }
  'order:delivered': { orderId: string; deliveredAt: number }
}

export function Task1_2_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    const bus = new EventBus<OrderEvents>()

    log.push('=== Event Bus ===')
    log.push('')

    // Add logging middleware
    bus.use((event, payload, next) => {
      log.push(`  [MW:LOG] Event "${String(event)}" published`)
      log.push(`    payload keys: ${Object.keys(payload as object).join(', ')}`)
      next()
    })

    // Add timing middleware
    bus.use((_event, _payload, next) => {
      const start = performance.now()
      next()
      const duration = (performance.now() - start).toFixed(2)
      log.push(`    [MW:TIME] Processed in ${duration}ms`)
    })

    // Subscribe handlers
    bus.subscribe('order:created', (data) => {
      log.push(`    [HANDLER] New order ${data.orderId}: ${data.items.join(', ')} = $${data.total}`)
    })

    bus.subscribe('order:paid', (data) => {
      log.push(`    [HANDLER] Order ${data.orderId} paid via ${data.paymentMethod}`)
    })

    bus.subscribe('order:shipped', (data) => {
      log.push(`    [HANDLER] Order ${data.orderId} shipped: ${data.trackingNumber}`)
    })

    // Publish events
    log.push('Publishing order lifecycle events:')
    log.push('')

    bus.publish('order:created', {
      orderId: 'ORD-001',
      items: ['Widget A', 'Widget B'],
      total: 49.99,
    })
    log.push('')

    bus.publish('order:paid', {
      orderId: 'ORD-001',
      paymentMethod: 'credit_card',
    })
    log.push('')

    bus.publish('order:shipped', {
      orderId: 'ORD-001',
      trackingNumber: 'TRK-12345',
    })
    log.push('')

    // History
    log.push('Event history:')
    bus.getHistory().forEach((entry, i) => {
      log.push(`  ${i + 1}. ${String(entry.event)} at ${new Date(entry.timestamp).toISOString()}`)
    })
    log.push('')

    log.push('Type safety:')
    log.push('  bus.publish("order:paid", { orderId: "x" })          // Error: missing paymentMethod')
    log.push('  bus.publish("order:unknown", {})                      // Error: not in OrderEvents')
    log.push('  bus.subscribe("order:shipped", (d) => d.total)       // Error: no total on shipped')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.2: Event Bus</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.3: DOM Events Typing — Решение
// ============================================

interface CustomEventMap {
  'app:theme-change': { theme: 'light' | 'dark' }
  'app:language-change': { locale: string; direction: 'ltr' | 'rtl' }
  'app:notification': { id: string; message: string; type: 'success' | 'error' | 'info' }
  'app:modal-open': { modalId: string; data?: Record<string, unknown> }
  'app:modal-close': { modalId: string; result?: unknown }
}

function dispatchTypedEvent<K extends keyof CustomEventMap>(
  eventName: K,
  detail: CustomEventMap[K]
): void {
  const event = new CustomEvent(eventName, { detail, bubbles: true })
  document.dispatchEvent(event)
}

function onTypedEvent<K extends keyof CustomEventMap>(
  eventName: K,
  handler: (detail: CustomEventMap[K]) => void
): () => void {
  const listener = (e: Event) => {
    const customEvent = e as CustomEvent<CustomEventMap[K]>
    handler(customEvent.detail)
  }
  document.addEventListener(eventName, listener)
  return () => document.removeEventListener(eventName, listener)
}

// Type-safe element event binding
type TypedElementEvents<E extends HTMLElement> = {
  click: { element: E; x: number; y: number }
  focus: { element: E }
  blur: { element: E }
  input: E extends HTMLInputElement ? { element: E; value: string } : never
}

function onElementEvent<
  E extends HTMLElement,
  K extends keyof TypedElementEvents<E>,
>(
  _element: E,
  _event: K,
  _handler: (detail: TypedElementEvents<E>[K]) => void
): () => void {
  // Implementation would attach real DOM listeners
  return () => {}
}

export function Task1_3_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []

    log.push('=== DOM Events Typing ===')
    log.push('')

    // Register listeners
    const cleanups: Array<() => void> = []

    cleanups.push(
      onTypedEvent('app:theme-change', (detail) => {
        log.push(`  [THEME] Changed to: ${detail.theme}`)
      })
    )

    cleanups.push(
      onTypedEvent('app:language-change', (detail) => {
        log.push(`  [LANG] Changed to: ${detail.locale} (${detail.direction})`)
      })
    )

    cleanups.push(
      onTypedEvent('app:notification', (detail) => {
        log.push(`  [NOTIFY:${detail.type}] ${detail.message} (id: ${detail.id})`)
      })
    )

    cleanups.push(
      onTypedEvent('app:modal-open', (detail) => {
        log.push(`  [MODAL] Opened: ${detail.modalId}`)
      })
    )

    log.push('Dispatching custom DOM events:')
    log.push('')

    dispatchTypedEvent('app:theme-change', { theme: 'dark' })
    dispatchTypedEvent('app:language-change', { locale: 'ar', direction: 'rtl' })
    dispatchTypedEvent('app:notification', {
      id: 'n-1',
      message: 'Settings saved successfully',
      type: 'success',
    })
    dispatchTypedEvent('app:modal-open', {
      modalId: 'settings',
      data: { tab: 'appearance' },
    })

    log.push('')
    log.push('Element event typing:')
    log.push('  onElementEvent(inputEl, "input", (d) => d.value)  // string')
    log.push('  onElementEvent(divEl, "input", ...)               // Error: never for div')
    log.push('  onElementEvent(el, "click", (d) => d.x)           // number')
    log.push('')

    log.push('Type safety:')
    log.push('  dispatchTypedEvent("app:theme-change", { theme: "blue" })  // Error: not light|dark')
    log.push('  dispatchTypedEvent("app:unknown", {})                       // Error: not in map')
    log.push('  onTypedEvent("app:notification", (d) => d.theme)           // Error: no theme prop')

    // Cleanup
    cleanups.forEach((fn) => fn())

    // Keep reference to avoid unused
    void onElementEvent

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.3: DOM Events Typing</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 1.4: Event Sourcing Basics — Решение
// ============================================

interface BaseEvent {
  id: string
  timestamp: number
  version: number
}

interface AccountCreated extends BaseEvent {
  type: 'AccountCreated'
  payload: { accountId: string; owner: string; initialBalance: number }
}

interface MoneyDeposited extends BaseEvent {
  type: 'MoneyDeposited'
  payload: { accountId: string; amount: number; source: string }
}

interface MoneyWithdrawn extends BaseEvent {
  type: 'MoneyWithdrawn'
  payload: { accountId: string; amount: number; reason: string }
}

interface AccountClosed extends BaseEvent {
  type: 'AccountClosed'
  payload: { accountId: string; closedBy: string }
}

type AccountEvent = AccountCreated | MoneyDeposited | MoneyWithdrawn | AccountClosed

interface AccountState {
  accountId: string
  owner: string
  balance: number
  status: 'active' | 'closed'
  transactionCount: number
}

type EventReducer<TState, TEvent> = (state: TState, event: TEvent) => TState

const accountReducer: EventReducer<AccountState | null, AccountEvent> = (state, event) => {
  switch (event.type) {
    case 'AccountCreated':
      return {
        accountId: event.payload.accountId,
        owner: event.payload.owner,
        balance: event.payload.initialBalance,
        status: 'active' as const,
        transactionCount: 0,
      }
    case 'MoneyDeposited':
      if (!state) throw new Error('Account not created')
      return {
        ...state,
        balance: state.balance + event.payload.amount,
        transactionCount: state.transactionCount + 1,
      }
    case 'MoneyWithdrawn':
      if (!state) throw new Error('Account not created')
      return {
        ...state,
        balance: state.balance - event.payload.amount,
        transactionCount: state.transactionCount + 1,
      }
    case 'AccountClosed':
      if (!state) throw new Error('Account not created')
      return {
        ...state,
        status: 'closed' as const,
      }
  }
}

class EventStore<TEvent extends { type: string; id: string; timestamp: number }> {
  private events: TEvent[] = []

  append(event: TEvent): void {
    this.events.push(event)
  }

  getAll(): TEvent[] {
    return [...this.events]
  }

  getByType<K extends TEvent['type']>(type: K): Extract<TEvent, { type: K }>[] {
    return this.events.filter((e): e is Extract<TEvent, { type: K }> => e.type === type)
  }

  replay<TState>(reducer: EventReducer<TState, TEvent>, initial: TState): TState {
    return this.events.reduce(reducer, initial)
  }

  replayUntil<TState>(
    reducer: EventReducer<TState, TEvent>,
    initial: TState,
    until: number
  ): TState {
    return this.events
      .filter((e) => e.timestamp <= until)
      .reduce(reducer, initial)
  }
}

let eventCounter = 0
function createEvent<T extends AccountEvent['type']>(
  type: T,
  payload: Extract<AccountEvent, { type: T }>['payload']
): Extract<AccountEvent, { type: T }> {
  eventCounter++
  return {
    id: `evt-${eventCounter}`,
    type,
    timestamp: Date.now() + eventCounter * 1000,
    version: 1,
    payload,
  } as Extract<AccountEvent, { type: T }>
}

export function Task1_4_Solution() {
  const [results, setResults] = useState<string[]>([])

  const runExample = () => {
    const log: string[] = []
    eventCounter = 0
    const store = new EventStore<AccountEvent>()

    log.push('=== Event Sourcing Basics ===')
    log.push('')

    // Create events
    const events: AccountEvent[] = [
      createEvent('AccountCreated', { accountId: 'ACC-001', owner: 'Alice', initialBalance: 1000 }),
      createEvent('MoneyDeposited', { accountId: 'ACC-001', amount: 500, source: 'salary' }),
      createEvent('MoneyWithdrawn', { accountId: 'ACC-001', amount: 200, reason: 'groceries' }),
      createEvent('MoneyDeposited', { accountId: 'ACC-001', amount: 300, source: 'freelance' }),
      createEvent('MoneyWithdrawn', { accountId: 'ACC-001', amount: 150, reason: 'utilities' }),
    ]

    // Append events
    events.forEach((event) => store.append(event))

    log.push('Events appended to store:')
    store.getAll().forEach((event, i) => {
      log.push(`  ${i + 1}. [${event.type}] ${JSON.stringify(event.payload)}`)
    })
    log.push('')

    // Replay all events
    const currentState = store.replay(accountReducer, null)
    log.push('Current state (full replay):')
    if (currentState) {
      log.push(`  Account: ${currentState.accountId}`)
      log.push(`  Owner: ${currentState.owner}`)
      log.push(`  Balance: $${currentState.balance}`)
      log.push(`  Status: ${currentState.status}`)
      log.push(`  Transactions: ${currentState.transactionCount}`)
    }
    log.push('')

    // Filter by type
    const deposits = store.getByType('MoneyDeposited')
    log.push('Deposits only (getByType):')
    deposits.forEach((d) => {
      log.push(`  $${d.payload.amount} from ${d.payload.source}`)
    })
    log.push('')

    // Time-travel: replay until event 3
    const thirdEventTime = events[2].timestamp
    const pastState = store.replayUntil(accountReducer, null, thirdEventTime)
    log.push('Time-travel (first 3 events):')
    if (pastState) {
      log.push(`  Balance: $${pastState.balance} (was $${currentState?.balance} at end)`)
      log.push(`  Transactions: ${pastState.transactionCount}`)
    }
    log.push('')

    // Close account
    store.append(createEvent('AccountClosed', { accountId: 'ACC-001', closedBy: 'Alice' }))
    const finalState = store.replay(accountReducer, null)
    log.push('After closing account:')
    log.push(`  Status: ${finalState?.status}`)
    log.push(`  Final balance: $${finalState?.balance}`)
    log.push('')

    log.push('Type safety:')
    log.push('  store.getByType("MoneyDeposited") -> MoneyDeposited[]  (narrowed!)')
    log.push('  createEvent("AccountCreated", { amount: 5 })           // Error: wrong payload')

    setResults(log)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 1.4: Event Sourcing Basics</h2>
      <button onClick={runExample}>Запустить</button>
      {results.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Результаты:</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {results.map((r, i) => (
              <li key={i} style={{ padding: '0.25rem 0', fontFamily: 'monospace', whiteSpace: 'pre' }}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
