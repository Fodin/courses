# Уровень 1: Типобезопасные события

## 🎯 Цель уровня

Научиться проектировать event-driven архитектуру, в которой TypeScript гарантирует соответствие между именами событий и их payload-ами, предотвращая целый класс рантайм-ошибок.

---

## Проблема: потеря типов в событиях

Стандартный паттерн EventEmitter в Node.js и DOM использует строки для имён событий:

```typescript
// ❌ Node.js EventEmitter — полная потеря типов
import { EventEmitter } from 'events'

const emitter = new EventEmitter()

// Можно подписаться на любую строку с любым хендлером
emitter.on('user:login', (data) => {
  // data: any — нет типизации payload
  console.log(data.nmae) // опечатка, но ошибки нет
})

// Можно отправить что угодно
emitter.emit('user:logni', { userId: 42 }) // опечатка в имени, но ошибки нет
```

Проблемы:
- Имя события — произвольная строка, опечатки не ловятся
- Payload не типизирован (`any`)
- Нет связи между именем события и структурой данных
- Рефакторинг опасен: переименование события не обнаруживается

---

## Решение: Typed Event Emitter

### Шаг 1: Определение карты событий

```typescript
// Карта: имя события -> тип payload
interface AppEvents {
  'user:login': { userId: string; timestamp: number }
  'user:logout': { userId: string }
  'notification': { message: string; level: 'info' | 'warn' | 'error' }
  'data:sync': { source: string; recordCount: number }
}
```

📌 Каждый ключ интерфейса — это имя события, а значение — тип его payload. TypeScript использует эту карту для проверки соответствия.

### Шаг 2: Generic EventEmitter

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

💡 **Ключевой момент**: параметр `K extends keyof TEvents` связывает имя события с его payload. TypeScript автоматически выводит тип `payload` из `TEvents[K]`.

```typescript
const emitter = new TypedEventEmitter<AppEvents>()

// ✅ TypeScript знает тип payload
emitter.on('user:login', (data) => {
  console.log(data.userId)    // string
  console.log(data.timestamp) // number
})

// ❌ Ошибки компиляции
emitter.emit('user:login', { userId: 42 })        // number != string
emitter.emit('user:logni', { userId: 'x' })        // опечатка в имени
emitter.on('notification', (data) => data.userId)   // нет userId
```

---

## Event Bus: централизованная шина событий

Event Bus расширяет EventEmitter middleware-паттерном и историей:

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

### Middleware примеры

```typescript
// Логирование
bus.use((event, payload, next) => {
  console.log(`[EVENT] ${String(event)}`, payload)
  next()
})

// Валидация
bus.use((event, payload, next) => {
  if (event === 'order:created' && (payload as any).total <= 0) {
    throw new Error('Invalid order total')
  }
  next()
})

// Метрики
bus.use((event, _payload, next) => {
  const start = performance.now()
  next()
  metrics.record(String(event), performance.now() - start)
})
```

---

## Типизация DOM-событий

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

### Условная типизация для элементов

```typescript
type TypedElementEvents<E extends HTMLElement> = {
  click: { element: E; x: number; y: number }
  input: E extends HTMLInputElement
    ? { element: E; value: string }
    : never  // input event доступен только для input-элементов
}
```

---

## Event Sourcing: типобезопасное хранилище событий

Event Sourcing хранит историю изменений как последовательность неизменяемых событий:

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

interface MoneyDeposited extends BaseEvent {
  type: 'MoneyDeposited'
  payload: { accountId: string; amount: number; source: string }
}

// Discriminated union всех событий
type AccountEvent = AccountCreated | MoneyDeposited | MoneyWithdrawn | AccountClosed
```

### Reducer для восстановления состояния

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

### EventStore с фильтрацией по типу

```typescript
class EventStore<TEvent extends { type: string }> {
  getByType<K extends TEvent['type']>(
    type: K
  ): Extract<TEvent, { type: K }>[] {
    // Extract сужает union до конкретного варианта
    return this.events.filter(
      (e): e is Extract<TEvent, { type: K }> => e.type === type
    )
  }

  replay<TState>(
    reducer: EventReducer<TState, TEvent>,
    initial: TState
  ): TState {
    return this.events.reduce(reducer, initial)
  }

  // Time-travel: восстановление состояния на момент времени
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

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Строковые литералы вместо event map

```typescript
// ❌ Строки — нет проверки
class BadEmitter {
  on(event: string, handler: Function) { /* ... */ }
  emit(event: string, data: any) { /* ... */ }
}

// ✅ Event map — полная проверка
class GoodEmitter<T extends Record<string, unknown>> {
  on<K extends keyof T>(event: K, handler: (data: T[K]) => void) { /* ... */ }
  emit<K extends keyof T>(event: K, data: T[K]) { /* ... */ }
}
```

### Ошибка 2: Утечка памяти — забытые подписки

```typescript
// ❌ Подписка без отписки
emitter.on('data:update', handler)
// Компонент размонтирован, но handler всё ещё вызывается

// ✅ Возврат функции отписки и использование в cleanup
const unsubscribe = emitter.on('data:update', handler)
// При размонтировании:
unsubscribe()
```

### Ошибка 3: Мутация payload в обработчике

```typescript
// ❌ Мутация общего объекта
emitter.on('notification', (data) => {
  data.message = data.message.toUpperCase() // Мутация!
})

// ✅ Readonly payload
type EventHandler<T> = (payload: Readonly<T>) => void
```

### Ошибка 4: Отсутствие exhaustive matching в reducer

```typescript
// ❌ Забыли обработать новый тип события
const reducer = (state: State, event: AccountEvent) => {
  switch (event.type) {
    case 'AccountCreated': return /* ... */
    case 'MoneyDeposited': return /* ... */
    // MoneyWithdrawn и AccountClosed забыты!
    default: return state
  }
}

// ✅ Exhaustive check
const reducer = (state: State, event: AccountEvent) => {
  switch (event.type) {
    case 'AccountCreated': return /* ... */
    case 'MoneyDeposited': return /* ... */
    case 'MoneyWithdrawn': return /* ... */
    case 'AccountClosed': return /* ... */
    default: {
      const _exhaustive: never = event
      return state
    }
  }
}
```

---

## 🔥 Лучшие практики

1. **Event map как единый источник правды** — все события описаны в одном интерфейсе
2. **Возврат unsubscribe** — метод `on()` всегда возвращает функцию отписки
3. **Иммутабельные payload** — используйте `Readonly<T>` для предотвращения мутаций
4. **Middleware для cross-cutting concerns** — логирование, метрики, валидация
5. **Exhaustive matching** в reducers — `never` проверка в `default` ветке
6. **Event versioning** — поле `version` в базовом интерфейсе событий
7. **Namespace-конвенция** — `domain:action` (`user:login`, `order:created`)
