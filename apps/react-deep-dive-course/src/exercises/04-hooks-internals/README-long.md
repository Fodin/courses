# Уровень 4 (расширенная теория): Хуки изнутри

## Полная структура Hook-объекта

В исходниках React (packages/react-reconciler/src/ReactFiberHooks.js) каждый хук представлен объектом:

```typescript
type Hook = {
  memoizedState: any        // текущее "видимое" состояние хука
  baseState: any            // состояние с которого начинается обработка очереди
  baseQueue: Update | null  // необработанные обновления из прерванного рендера
  queue: UpdateQueue | null // очередь всех обновлений
  next: Hook | null         // следующий хук в linked list
}
```

Для разных хуков `memoizedState` хранит разные данные:
- `useState` / `useReducer` — само значение состояния
- `useEffect` / `useLayoutEffect` — объект `{ create, destroy, deps, next, tag }`
- `useMemo` — `[computedValue, deps]` — кортеж результата и зависимостей
- `useRef` — `{ current: value }` — объект ref
- `useCallback` — `[callback, deps]` — кортеж функции и зависимостей
- `useContext` — само значение контекста

## Как fiber хранит хуки

Каждый fiber-объект имеет поле `memoizedState`. Для функциональных компонентов это указатель на первый Hook-узел связного списка:

```
FiberNode {
  tag: FunctionComponent,
  memoizedState: ──────────────────► Hook {
                                       memoizedState: 42,   ← значение useState
                                       queue: UpdateQueue,
                                       next: ──────────────► Hook {
                                                               memoizedState: {    ← useEffect deps
                                                                 create: fn,
                                                                 deps: [x, y],
                                                               },
                                                               next: ─────────────► Hook {
                                                                                      memoizedState: [result, deps], ← useMemo
                                                                                      next: null
                                                                                    }
                                                             }
                                     }
}
```

💡 Для классовых компонентов `fiber.memoizedState` — это объект состояния (`this.state`). Принципиально другая структура.

## mountState vs updateState: два мира

### mountState (первый рендер)

```typescript
function mountState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  // Создаём новый узел и добавляем в конец списка
  const hook = mountWorkInProgressHook()

  // Инициализация: если передана функция-инициализатор — вызываем её
  if (typeof initialState === 'function') {
    initialState = (initialState as () => S)()
  }

  hook.memoizedState = hook.baseState = initialState

  // Создаём очередь обновлений
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    pending: null,       // ожидающие обновления (circular linked list)
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  }
  hook.queue = queue

  // dispatch — это функция setState, которую возвращает useState
  const dispatch = (queue.dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue))

  return [hook.memoizedState, dispatch]
}
```

Ключевые моменты:
- `mountWorkInProgressHook()` создаёт новый Hook и добавляет его в linked list
- `basicStateReducer` — редьюсер по умолчанию для useState: `(state, action) => typeof action === 'function' ? action(state) : action`
- `dispatch` привязан к конкретному fiber и конкретной queue

### updateState (повторные рендеры)

```typescript
function updateState<S>(initialState: S | (() => S)): [S, Dispatch<SetStateAction<S>>] {
  // updateReducer с basicStateReducer — useState это просто useReducer!
  return updateReducer(basicStateReducer, initialState)
}
```

При update React:
1. Берёт следующий узел из existing linked list (`updateWorkInProgressHook()`)
2. Обрабатывает очередь обновлений (queue.pending)
3. Применяет все накопленные actions к состоянию
4. Возвращает новое `memoizedState`

## useState = useReducer с basicStateReducer

Это не метафора — буквально:

```typescript
// basicStateReducer:
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action
}

// Поэтому:
setState(42)           // action = 42    → basicStateReducer(old, 42) = 42
setState(n => n + 1)   // action = fn    → basicStateReducer(old, fn) = fn(old)
```

Именно это делает functional updater `(prev => prev + 1)` правильным выбором — редьюсер получает актуальное состояние из очереди, а не из замыкания.

## Update Queue: circular linked list обновлений

Когда ты вызываешь `setState`, React не обновляет состояние немедленно. Он создаёт объект Update и добавляет его в очередь:

```typescript
type Update<S, A> = {
  lane: Lane          // приоритет обновления
  revertLane: Lane    // для оптимистичных обновлений
  action: A           // новое значение или функция-updater
  hasEagerState: boolean
  eagerState: S | null
  next: Update<S, A>  // CIRCULAR — последний элемент указывает на первый!
}
```

Очередь `queue.pending` всегда указывает на **последнее** добавленное обновление, а `pending.next` указывает на **первое** (circular list). Это позволяет эффективно добавлять в конец и читать с начала без отдельного tail-pointer.

```
Три setState за одну синхронную задачу:
queue.pending ──► Update3 { action: 30, next: ──► Update1 { action: 10, next: ──► Update2 { ... }
                                                             ▲                              │
                                                             └──────────────────────────────┘
                                                             (circular — Update2.next = Update1)
```

При следующем рендере React "разматывает" circular list слева направо и применяет все actions по порядку.

## Eager state: оптимизация до рендера

Если состояние не изменилось — зачем делать рендер? React умеет это проверить **до** фазы Render:

```typescript
// В dispatchSetState:
const currentState = queue.lastRenderedState
const eagerState = lastRenderedReducer(currentState, action)

if (Object.is(eagerState, currentState)) {
  // Состояние не изменилось — рендер отменяется полностью
  return
}

// Кешируем предвычисленное значение
update.hasEagerState = true
update.eagerState = eagerState
```

Это называется **eager state** — React "жадно" вычисляет новое состояние ещё в фазе dispatch, чтобы избежать ненужного рендера. Срабатывает только если reducer — чистая функция (что для `basicStateReducer` всегда так).

## Closure trap подробно: snapshot behavior

Каждый рендер функционального компонента — это отдельный вызов функции. Каждый вызов создаёт своё собственное замыкание:

```tsx
function Counter() {
  const [count, setCount] = useState(0) // render #1: count = 0
                                         // render #2: count = 1
                                         // render #3: count = 2

  useEffect(() => {
    // Этот эффект запускается после render #1
    // count в этом замыкании = 0 (snapshot render #1)
    const id = setInterval(() => {
      console.log(count) // Всегда 0 — это snapshot первого рендера!
      setCount(count + 1) // 0 + 1 = 1, всегда
    }, 1000)
    return () => clearInterval(id)
  }, []) // [] = эффект запускается один раз, замыкание не обновляется
}
```

Это не баг React — это фича. Замыкание даёт **snapshot**: значение состояния на момент рендера. Это делает рендеры предсказуемыми и pure. Баг возникает, когда ты хочешь "живое" значение из долгоживущего callback.

### Три способа решить closure trap

**1. Functional updater** (самый простой, если нужно только предыдущее значение):
```tsx
setCount(prev => prev + 1) // React передаёт актуальное значение сам
```

**2. useRef** (если нужно читать значение, не вызывая рендер):
```tsx
const countRef = useRef(count)
countRef.current = count // обновляем ref при каждом рендере

useEffect(() => {
  const id = setInterval(() => {
    console.log(countRef.current) // всегда актуальное значение
    setCount(countRef.current + 1)
  }, 1000)
  return () => clearInterval(id)
}, [])
```

**3. Добавить зависимость и пересоздавать эффект** (если зависимость нужна явно):
```tsx
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1) // теперь count свежий
  }, 1000)
  return () => clearInterval(id)
}, [count]) // эффект пересоздаётся при каждом изменении count
// ⚠️ Но setInterval будет сбрасываться! Не всегда подходит.
```

## Computed during render: антипаттерн YMNAE

"You Might Not Await Effect" — не заставляй React делать лишнюю работу через эффект, если можно вычислить результат во время рендера.

```tsx
// ❌ Антипаттерн: useState + useEffect для derived value
function UserCard({ firstName, lastName }) {
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName) // лишний рендер после каждого изменения
  }, [firstName, lastName])

  return <div>{fullName}</div>
}
```

Что здесь происходит:
1. firstName меняется → рендер #1 (fullName ещё пустой/старый)
2. После рендера #1 срабатывает useEffect
3. useEffect вызывает setFullName → рендер #2 (теперь fullName правильный)

Два рендера вместо одного. Временное мигание старого значения. Зря потраченная память и CPU.

```tsx
// ✅ Computed during render
function UserCard({ firstName, lastName }) {
  const fullName = firstName + ' ' + lastName // вычисляется в рендере #1

  return <div>{fullName}</div>
}
```

Один рендер. Нет состояния. Нет эффекта. Всегда актуальное значение.

### Когда нужен useMemo вместо просто const

```tsx
// Если вычисление дорогое:
const sortedList = useMemo(
  () => hugeArray.sort((a, b) => a.value - b.value),
  [hugeArray]
)

// Если просто конкатенация строк — useMemo лишний:
const fullName = firstName + ' ' + lastName // const достаточно
```

💡 Правило: `useMemo` оправдан только если профилировщик показывает, что вычисление реально медленное. Для простых выражений — просто `const`.

## Правила хуков через призму internals

Теперь ты знаешь, почему правила хуков именно такие:

| Правило | Причина |
|---|---|
| Только на верхнем уровне | Linked list проходится по порядку — любое ветвление сдвигает индексы |
| Только в React-функциях | `ReactCurrentDispatcher.current` установлен только во время рендера компонента |
| Не в циклах | Количество узлов должно быть постоянным между рендерами |
| Не после return | React не будет читать хуки после выхода из функции |

## Dispatcher меняется в зависимости от контекста

React устанавливает разные dispatchers в зависимости от текущей операции:

```typescript
HooksDispatcherOnMount      // первый рендер компонента
HooksDispatcherOnUpdate     // обновление компонента
HooksDispatcherOnRerender   // рендер вызванный из рендера
HooksDispatcherOnMountInDEV // dev-версии с дополнительными проверками
ContextOnlyDispatcher       // вне рендера — выбросит ошибку
```

Именно `ContextOnlyDispatcher` объясняет ошибку "Invalid hook call" — если ты вызываешь хук вне компонента, React переключается на dispatcher, который при любом вызове хука выбрасывает исключение.

## ⚠️ Частые ошибки на продвинутом уровне

❌ **useMemo для дешёвых вычислений**

```tsx
// Micro-optimization, которая только замедляет:
const doubled = useMemo(() => count * 2, [count])
```

Почему плохо: `useMemo` сам по себе имеет overhead — создание замыкания, хранение deps, сравнение. Для `count * 2` этот overhead > стоимость вычисления.

✅ `const doubled = count * 2` — просто константа.

---

❌ **Читать state сразу после setState**

```tsx
setCount(count + 1)
console.log(count) // ❌ Всё ещё старое значение!
```

Почему: `setState` не мутирует переменную — она только добавляет Update в очередь. Новое значение появится в следующем рендере (новом замыкании).

✅ Используй functional updater или читай состояние в следующем рендере.

---

❌ **Инициализировать useState результатом функции без lazy initializer**

```tsx
// ❌ Функция вызывается при каждом рендере, но результат используется только при mount:
const [data, setData] = useState(expensiveComputation())

// ✅ Lazy initializer — вызывается только один раз при mount:
const [data, setData] = useState(() => expensiveComputation())
```

🔥 Ключевое: если в `useState` передать функцию — React вызовет её только при первом рендере (mountState). При повторных рендерах (updateState) `initialState` игнорируется полностью.
