# 🔥 Уровень 6: Конечные автоматы (State Machines)

## 🎯 Зачем нужны типобезопасные конечные автоматы

Конечный автомат (State Machine) -- это модель, описывающая систему как набор состояний и переходов между ними. В реальных приложениях автоматы повсюду: жизненный цикл HTTP-запроса, воркфлоу документа, состояние подключения, процесс оплаты.

Без типобезопасных автоматов возникают классические ошибки:

```typescript
// ❌ Типичная проблема: невалидные переходы
interface Request {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: Error
}

// Ничего не мешает сделать это:
request.status = 'success'  // Но data не установлен!
request.status = 'error'    // А error undefined!
```

TypeScript позволяет сделать невалидные переходы и состояния **невозможными на уровне типов**.

## 📌 State Transitions: типобезопасные переходы

### Определение допустимых переходов

Первый шаг -- описать, какие переходы разрешены из каждого состояния:

```typescript
type AllowedTransitions = {
  idle: ['fetching']
  fetching: ['success', 'error']
  success: ['idle', 'fetching']
  error: ['idle', 'fetching']
}
```

Это карта переходов: из `idle` можно перейти только в `fetching`, из `fetching` -- в `success` или `error`, и т.д.

### Реализация автомата

```typescript
type MachineState = keyof AllowedTransitions  // 'idle' | 'fetching' | 'success' | 'error'

class TypedStateMachine {
  private _state: MachineState = 'idle'

  get state(): MachineState {
    return this._state
  }

  transition(to: MachineState): void {
    const allowed = transitions[this._state]
    if (!allowed.includes(to)) {
      throw new Error(
        `Invalid transition: ${this._state} → ${to}. Allowed: [${allowed.join(', ')}]`
      )
    }
    this._state = to
  }
}
```

### Типизация через mapped types

Для compile-time проверок можно использовать mapped type для карты переходов:

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
transition('idle', 'success')     // ❌ Ошибка компиляции
transition('fetching', 'error')   // ✅ OK
transition('fetching', 'idle')    // ❌ Ошибка компиляции
```

## 🔥 State Data Association: разные данные для разных состояний

Главная проблема наивного подхода -- все данные хранятся в одном объекте с опциональными полями:

```typescript
// ❌ Проблема: data и error существуют одновременно
interface RequestState {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: User[]       // Есть только при success
  error?: string      // Есть только при error
  startedAt?: number  // Есть только при loading
}
```

### Discriminated union: правильный подход

```typescript
// ✅ Каждое состояние имеет свой набор данных
type FetchState<T, E = Error> =
  | { readonly status: 'idle' }
  | { readonly status: 'loading'; readonly startedAt: number }
  | { readonly status: 'success'; readonly data: T; readonly fetchedAt: number }
  | { readonly status: 'error'; readonly error: E; readonly failedAt: number; readonly retryCount: number }
```

Теперь TypeScript **сужает тип** при проверке `status`:

```typescript
function render(state: FetchState<User[], string>) {
  switch (state.status) {
    case 'idle':
      // Здесь нет data, error, startedAt — только status
      return 'Ready'

    case 'loading':
      // Здесь есть startedAt, но нет data или error
      return `Loading since ${state.startedAt}`

    case 'success':
      // Здесь есть data и fetchedAt
      return `${state.data.length} users loaded`

    case 'error':
      // Здесь есть error, failedAt, retryCount
      return `Error: ${state.error} (retry #${state.retryCount})`
  }
}
```

### Fold: исчерпывающая обработка

```typescript
function foldFetchState<T, E, R>(
  state: FetchState<T, E>,
  handlers: {
    idle: () => R
    loading: (startedAt: number) => R
    success: (data: T, fetchedAt: number) => R
    error: (err: E, retryCount: number) => R
  }
): R {
  switch (state.status) {
    case 'idle': return handlers.idle()
    case 'loading': return handlers.loading(state.startedAt)
    case 'success': return handlers.success(state.data, state.fetchedAt)
    case 'error': return handlers.error(state.error, state.retryCount)
  }
}
```

### Map: трансформация данных

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

// Трансформация User[] → string[] (список имён)
const namesState = mapFetchState(usersState, (users) => users.map(u => u.name))
```

## 📌 Hierarchical States: вложенные автоматы

Реальные приложения часто имеют иерархические состояния. Например, приложение может быть offline/online/maintenance, а внутри online есть состояния подключения и аутентификации:

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

### Вложенная обработка

```typescript
function describeAppState(state: AppState): string {
  switch (state.phase) {
    case 'offline':
      return 'App is offline'

    case 'maintenance':
      return `Maintenance: ${state.message}`

    case 'online': {
      // TypeScript знает, что здесь есть connection и auth
      const connStatus = state.connection.status === 'connected'
        ? `connected (${state.connection.latency}ms)`
        : `connecting (attempt #${state.connection.attempt})`

      const authStatus = state.auth.status === 'authenticated'
        ? `user: ${state.auth.userId}`
        : state.auth.status

      return `Online [${connStatus}] [${authStatus}]`
    }
  }
}
```

### Reducer для иерархических состояний

```typescript
type AppAction =
  | { type: 'GO_ONLINE' }
  | { type: 'GO_OFFLINE' }
  | { type: 'CONNECTED'; latency: number }
  | { type: 'LOGIN'; provider: string }
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

    // ... другие экшены
  }
}
```

📌 **Ключевой приём:** проверка `state.phase !== 'online'` перед доступом к `connection`/`auth` -- TypeScript сужает тип и разрешает доступ к вложенным полям.

## 🔥 State Narrowing: паттерн-матчинг по состояниям

### Type Guards для состояний

```typescript
function isInState<S extends DocumentState['status']>(
  state: DocumentState,
  status: S
): state is Extract<DocumentState, { status: S }> {
  return state.status === status
}

// Использование
if (isInState(doc, 'published')) {
  console.log(doc.url)  // TypeScript знает, что url существует
}
```

### Функции-переходы с типизированными входами

```typescript
// Принимает ТОЛЬКО draft
function submitForReview(
  state: Extract<DocumentState, { status: 'draft' }>,
  reviewer: string
): Extract<DocumentState, { status: 'review' }> {
  return {
    status: 'review',
    content: state.content,
    author: state.author,
    reviewer,
    comments: [],
  }
}

// Принимает ТОЛЬКО review
function approve(
  state: Extract<DocumentState, { status: 'review' }>
): Extract<DocumentState, { status: 'approved' }> {
  return {
    status: 'approved',
    content: state.content,
    author: state.author,
    approvedBy: state.reviewer,
    approvedAt: Date.now(),
  }
}
```

Теперь невозможно вызвать `approve` на документе в статусе `draft` -- TypeScript не позволит:

```typescript
approve(draftDoc)  // ❌ Ошибка: draft несовместим с review
```

### Exhaustive match для состояний

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

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Общий объект вместо discriminated union

```typescript
// ❌ Все данные в одном объекте с опциональными полями
interface State {
  status: 'idle' | 'loading' | 'success' | 'error'
  data?: unknown
  error?: Error
}
// state.data может быть undefined даже при status === 'success'

// ✅ Discriminated union с данными для каждого состояния
type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error }
```

### Ошибка 2: Строки вместо типизированных состояний

```typescript
// ❌ Состояние как строка — нет защиты от опечаток
function transition(current: string, next: string) { ... }
transition('idle', 'loadng')  // Опечатка не обнаружена

// ✅ Union type ограничивает допустимые значения
type State = 'idle' | 'loading' | 'success' | 'error'
function transition(current: State, next: State) { ... }
transition('idle', 'loadng')  // ❌ Ошибка компиляции
```

### Ошибка 3: Доступ к данным без проверки состояния

```typescript
// ❌ Небезопасный доступ
function getItems(state: FetchState<Item[]>) {
  return state.data  // Ошибка: data не существует в idle/loading/error
}

// ✅ Проверка состояния перед доступом
function getItems(state: FetchState<Item[]>): Item[] | null {
  if (state.status === 'success') {
    return state.data  // TypeScript знает, что data существует
  }
  return null
}
```

### Ошибка 4: Отсутствие обработки вложенных состояний

```typescript
// ❌ Забыли проверить phase перед доступом к connection
function getLatency(state: AppState): number {
  return state.connection.latency  // Ошибка: connection не существует в offline

  // ✅ Правильно: проверяем иерархию
  if (state.phase === 'online' && state.connection.status === 'connected') {
    return state.connection.latency  // Безопасно
  }
  return -1
}
```

## 💡 Best Practices

1. **Discriminated union для состояний** -- каждое состояние имеет свой набор данных, никаких опциональных полей
2. **Mapped type для карты переходов** -- compile-time проверка допустимых переходов
3. **Extract для сужения** -- `Extract<State, { status: S }>` извлекает конкретное состояние из union
4. **Функции-переходы принимают конкретное состояние** -- `approve(review)` вместо `approve(anyState)`
5. **Иерархия для сложных автоматов** -- вложенные discriminated unions вместо плоского списка
6. **readonly для всех полей** -- состояние не должно мутировать, только заменяться новым
7. **fold для исчерпывающей обработки** -- гарантирует обработку всех возможных состояний
