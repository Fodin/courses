# Уровень 9 (расширенный): Batching изнутри

## Update Queue: как Fiber хранит обновления

Каждый fiber-узел содержит поле `updateQueue`. Когда вы вызываете `setState`, React создаёт объект типа `Update` и добавляет его в эту очередь.

```ts
// Упрощённая структура Update объекта (packages/react-reconciler)
type Update<S, A> = {
  lane: Lane           // приоритет обновления
  action: A            // новое состояние или функция (s => s+1)
  next: Update<S, A>   // ссылка на следующий Update
}

type UpdateQueue<S, A> = {
  baseState: S                 // состояние до текущей серии обновлений
  firstBaseUpdate: Update | null
  lastBaseUpdate: Update | null
  shared: {
    pending: Update | null     // КОЛЬЦЕВОЙ список ожидающих обновлений
  }
}
```

Ключевой момент: `shared.pending` — это **кольцевой связный список**. Последний добавленный `Update` указывает на первый. Это позволяет быстро добавлять в конец (O(1)) и читать с начала.

```
После первого setState:
  pending → [Update1] → [Update1]  (сам на себя)

После второго setState:
  pending → [Update2] → [Update1] → [Update2]  (кольцо)
             ↑ новый конец          ↑ начало

После третьего setState:
  pending → [Update3] → [Update1] → [Update2] → [Update3]
```

Когда начинается рендер, React "разворачивает" это кольцо: обрезает хвост, превращая кольцо в линейный список, и обрабатывает обновления по порядку.

---

## enqueueUpdate: добавление обновления в очередь

Функция `enqueueUpdate` вызывается каждый раз, когда вы вызываете `dispatch` (для `useReducer`) или setter из `useState`:

```ts
// Упрощённо — React source: ReactFiberHooks
function dispatchSetState(fiber, queue, action) {
  const update: Update = {
    lane: requestUpdateLane(fiber),
    action,
    next: null,
  }

  // Добавляем в кольцевой список
  const pending = queue.pending
  if (pending === null) {
    update.next = update  // первый элемент — сам на себя
  } else {
    update.next = pending.next  // новый → старый первый
    pending.next = update        // старый последний → новый
  }
  queue.pending = update         // pending указывает на новый последний

  scheduleUpdateOnFiber(fiber, lane)
}
```

---

## scheduleUpdateOnFiber: когда запускать рендер?

`scheduleUpdateOnFiber` — это не "запусти рендер прямо сейчас". Это "запланируй рендер с учётом приоритета и текущего контекста".

```
scheduleUpdateOnFiber(fiber, lane)
         ↓
markUpdateLaneFromFiberToRoot(fiber, lane)
  → идёт по дереву вверх до root, помечает childLanes
         ↓
ensureRootIsScheduled(root)
  → смотрит: есть ли уже запланированная работа с нужным приоритетом?
  → если да: пропускает (работа уже в планировщике)
  → если нет: scheduleCallback(priority, performConcurrentWorkOnRoot)
         ↓
Scheduler.scheduleCallback
  → добавляет задачу в очередь планировщика
  → задача выполнится в конце текущего "макрозадачи" (не сразу!)
```

Именно поэтому три `setState` подряд дают один рендер: все три добавляют `Update` в очередь и вызывают `scheduleUpdateOnFiber`, но `ensureRootIsScheduled` видит, что задача уже запланирована, и не добавляет дубликат. Планировщик запустит один `performConcurrentWorkOnRoot` в конце.

---

## React 17 vs React 18: как изменился batching

### React 17: ExecutionContext

В React 17 batching управлялся через глобальный флаг `executionContext`:

```ts
// React 17 internals (упрощённо)
let executionContext = NoContext  // глобальная переменная!

// При обработке React-события:
executionContext |= EventContext   // включаем batch-режим
try {
  userEventHandler()
} finally {
  executionContext &= ~EventContext  // выключаем
  flushSyncCallbackQueue()          // применяем накопленные обновления
}
```

`setTimeout` и `Promise.then` запускаются **вне** этого блока try/finally. Значит `executionContext === NoContext`. Когда `scheduleUpdateOnFiber` видит `NoContext`, он немедленно запускает синхронный рендер для каждого `setState`.

### React 18: Automatic Batching через Lanes

React 18 переключился на другой механизм. Теперь batching не зависит от "ты внутри React event handler или нет". Вместо этого React использует **задачи планировщика** (Scheduler tasks):

```
Scheduler запускает задачу (таск) → обрабатывается ВЕСЬ синхронный код
                                      в рамках этого таска как один batch
```

`setTimeout(() => { setA(1); setB(2) })` выполняется как **одна задача** планировщика. React обрабатывает оба setState в рамках одного `performConcurrentWorkOnRoot`.

Диаграмма:

```
React 17:

Event Handler  ──[batch]──► рендер
setTimeout     ──setA──► рендер  ──setB──► рендер  (2 рендера!)
Promise.then   ──setA──► рендер  ──setB──► рендер  (2 рендера!)


React 18:

Event Handler  ──[batch]──► рендер
setTimeout     ──[batch]──► рендер  (1 рендер)
Promise.then   ──[batch]──► рендер  (1 рендер)
```

---

## ReactDOM.render vs createRoot: почему важно

`ReactDOM.render` (legacy API) намеренно оставлен в "React 17-совместимом режиме":

```tsx
// Legacy: React 17 behaviour, без automatic batching
ReactDOM.render(<App />, document.getElementById('root'))

// React 18: automatic batching включён
const root = ReactDOM.createRoot(document.getElementById('root')!)
root.render(<App />)
```

Это сознательное решение для обратной совместимости. Если ваше приложение использует `ReactDOM.render` и после апгрейда React до v18 поведение batching не изменилось — именно поэтому. Нужно мигрировать на `createRoot`.

---

## flushSync: как работает изнутри

`flushSync` — это "аварийный выход" из батчинга. Он форсирует синхронный рендер немедленно:

```ts
// Упрощённая суть flushSync
function flushSync<R>(fn: () => R): R {
  // Помечаем: текущее обновление — SyncLane (наивысший приоритет)
  // Выполняем fn() — все setState внутри получают SyncLane
  const result = fn()
  // Немедленно запускаем performSyncWorkOnRoot
  // DOM обновлён синхронно до возврата из flushSync
  return result
}
```

Практически: React назначает `SyncLane` всем обновлениям внутри `flushSync`, затем немедленно вызывает `performSyncWorkOnRoot`. Весь Fiber-рендер выполняется до возврата управления из `flushSync`.

### Сравнение: обычный setState vs flushSync

```
Обычный setState (React 18):

[JS task] → setState → enqueueUpdate → scheduleCallback → [конец task]
                                                                ↓
                                            [новая задача]: performConcurrentWorkOnRoot
                                                                ↓
                                                          рендер (async)


flushSync:

[JS task] → flushSync(() => setState) → performSyncWorkOnRoot
                                              ↓ (синхронно, в той же задаче!)
                                         рендер → commit → DOM обновлён
                                              ↓
                           возврат из flushSync — DOM уже содержит новые данные
```

---

## Batching в разных контекстах: пошаговый разбор

Создадим счётчик рендеров и проследим, как React ведёт себя в разных ситуациях.

### Сценарий 1: event handler

```tsx
const renderCount = useRef(0)
renderCount.current++

function handleClick() {
  setA(prev => prev + 1)
  setB(prev => prev + 1)
  setC(prev => prev + 1)
}
// renderCount после нажатия: +1 (был N, стал N+1)
```

**Почему**: React 18 упаковывает все три setState в один batch. Один вызов `performConcurrentWorkOnRoot`. Один рендер.

### Сценарий 2: setTimeout (React 18)

```tsx
function handleClickAsync() {
  setTimeout(() => {
    setA(prev => prev + 1)
    setB(prev => prev + 1)
    setC(prev => prev + 1)
  }, 0)
}
// renderCount после нажатия: +1 (тоже один рендер!)
```

**Почему**: В React 18 Scheduler обрабатывает весь колбэк setTimeout как одну задачу. Все три setState → один batch → один рендер.

### Сценарий 3: flushSync — намеренный выход

```tsx
function handleClickSync() {
  flushSync(() => {
    setA(prev => prev + 1)
  })
  // DOM уже обновлён здесь (рендер 1 уже произошёл)
  flushSync(() => {
    setB(prev => prev + 1)
  })
  // DOM обновлён снова (рендер 2)
  setC(prev => prev + 1)
  // Будет batched с остальными pending (рендер 3 — в конце task)
}
// renderCount: +3
```

---

## Batching vs Effect Chains: сравнение подходов

Это продолжение темы из уровня 8 (антипаттерн "effect chain"), но теперь с фокусом на производительность рендеров.

### Effect Chain: каскадные рендеры

```tsx
const [a, setA] = useState(0)
const [b, setB] = useState(0)
const [c, setC] = useState(0)

// ❌ Три отдельных рендера
useEffect(() => {
  setB(a * 2)
}, [a])

useEffect(() => {
  setC(b + 1)
}, [b])

// Когда меняется a:
// Рендер 1: a изменился → эффект запускает setB
// Рендер 2: b изменился → эффект запускает setC
// Рендер 3: c изменился
```

```
Временная шкала Effect Chain:

──[рендер1: a=1]──[commit]──[эффект:setB]──[рендер2:b=2]──[commit]──[эффект:setC]──[рендер3:c=3]──[commit]──
   ~16ms                                      ~16ms                                    ~16ms
                             (суммарно 48ms+ и три закрашивания экрана)
```

### Batching: один рендер

```tsx
// ✅ Один рендер
function handleChange(newA: number) {
  const newB = newA * 2
  const newC = newB + 1
  setA(newA)
  setB(newB)
  setC(newC)
}

// Рендер 1: a, b, c обновились одновременно
```

```
Временная шкала Batching:

──[рендер1: a=1, b=2, c=3]──[commit]──
   ~16ms
   (один рендер, один paint)
```

📌 **Правило**: если вы можете вычислить производные значения синхронно — вычисляйте и обновляйте всё в одном обработчике. Effect chains — это для побочных эффектов (fetch, subscription), не для derived state.

---

## Реальный кейс: чат с автоскроллом

Классическая задача: добавить сообщение и сразу проскроллить вниз.

```tsx
function ChatWindow() {
  const [messages, setMessages] = useState<string[]>([])
  const listRef = useRef<HTMLDivElement>(null)

  // ❌ Неправильно: скролл происходит ДО рендера нового сообщения
  function addMessageWrong(text: string) {
    setMessages(prev => [...prev, text])
    // В момент вызова scrollHeight не включает новое сообщение
    // потому что рендер ещё не произошёл (он async)
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }

  // ✅ Правильно: flushSync форсирует рендер, потом скроллим
  function addMessageCorrect(text: string) {
    flushSync(() => {
      setMessages(prev => [...prev, text])
    })
    // Рендер уже произошёл синхронно → scrollHeight включает новое сообщение
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }
}
```

---

## ⚠️ Распространённые ошибки (продвинутый уровень)

### 1. flushSync внутри lifecycle/render

```tsx
// ❌ flushSync нельзя вызывать внутри рендера или useLayoutEffect
function Component() {
  flushSync(() => setX(1))  // React выбросит ошибку
  return <div />
}

// ✅ flushSync только в event handlers или нативных коллбэках
function handleClick() {
  flushSync(() => setX(1))  // OK
}
```

### 2. unstable_batchedUpdates в React 18

```tsx
// ❌ Использовать unstable_batchedUpdates — это legacy API
import { unstable_batchedUpdates } from 'react-dom'
unstable_batchedUpdates(() => { setA(1); setB(2) })

// ✅ В React 18 с createRoot это уже встроено — просто вызывайте setState
setA(1)
setB(2)  // автоматически batched
```

### 3. Думать, что batching = всегда хорошо

```tsx
// Бывают случаи, когда нужны промежуточные рендеры:
// - Показать индикатор загрузки ПЕРЕД тяжёлым обновлением
// - Анимировать переход между состояниями

// ✅ startTransition (React 18) — для этого случая
import { startTransition } from 'react'

setLoadingIndicator(true)   // срочное: рендерим немедленно
startTransition(() => {
  setHeavyData(data)        // несрочное: React может прерваться
})
```

---

## Итог: когда что использовать

```
Несколько setState в одном handler?
  → Ничего не делай. React 18 + createRoot батчит автоматически.

Нужно прочитать DOM сразу после setState?
  → flushSync(() => setState(...))
  → После flushSync читаем DOM

Несколько setState в разных эффектах (cascade)?
  → Переосмысли архитектуру: можно ли вычислить всё синхронно?
  → Если нет — это побочные эффекты, так и должно быть

Нужно показать промежуточное состояние?
  → startTransition (уровень 10)
```
