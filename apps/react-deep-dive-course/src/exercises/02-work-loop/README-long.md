# Уровень 2: Work Loop и приоритеты (подробно)

## Откуда вообще взялся Work Loop

До React 16 рендер работал через обычную рекурсию: `renderComponent` вызывал `renderComponent` для каждого ребёнка, и так до листьев. Стек вызовов JS — это и был "work loop". Проблема: стек нельзя прервать на полпути. Браузер не может вклиниться и нарисовать кадр, пока JavaScript не вернёт управление.

React 16 перенёс "стек" в heap. Каждый Fiber node — это фактически стековый фрейм, сохранённый в объекте. `workInProgress` — указатель на текущий "стековый фрейм". Вместо рекурсии — итеративный цикл `while`. Прерывание? Просто выйди из цикла — `workInProgress` запомнит, где ты остановился.

## performUnitOfWork: разбор по строкам

```ts
function performUnitOfWork(unitOfWork: Fiber): void {
  // alternate — это Fiber из "текущего" дерева (то, что уже отрисовано)
  // unitOfWork — это Fiber из "рабочего" дерева (то, что строим сейчас)
  const current = unitOfWork.alternate

  // beginWork обрабатывает узел и возвращает первого ребёнка
  // (или null, если детей нет)
  const next = beginWork(current, unitOfWork, renderLanes)

  // После обработки — props "подтверждены": pendingProps → memoizedProps
  unitOfWork.memoizedProps = unitOfWork.pendingProps

  if (next === null) {
    // Детей нет — этот узел "готов". Переходим к completeWork.
    completeUnitOfWork(unitOfWork)
  } else {
    // Есть дети — переходим к первому ребёнку
    workInProgress = next
  }
}
```

Заметь: `performUnitOfWork` никогда не "поднимается" сам — это делает `completeUnitOfWork`. И `performUnitOfWork` не вызывает сам себя рекурсивно — `workInProgress` меняется, а цикл в `workLoop` продолжается.

## beginWork: детальный разбор

`beginWork` — это большой switch по `workInProgress.tag`. Для каждого типа узла — свой путь:

```ts
function beginWork(
  current: Fiber | null,
  workInProgress: Fiber,
  renderLanes: Lanes
): Fiber | null {
  // Шаг 1: Bailout-проверка (только если узел уже рендерился ранее)
  if (current !== null) {
    const oldProps = current.memoizedProps
    const newProps = workInProgress.pendingProps

    if (
      oldProps === newProps &&                          // props не изменились
      !hasScheduledUpdateOrContext(current, renderLanes) // нет обновлений
    ) {
      // Bailout: пропускаем этот узел И всё его поддерево
      return bailoutOnAlreadyFinishedWork(current, workInProgress, renderLanes)
    }
  }

  // Шаг 2: обработка по типу узла
  switch (workInProgress.tag) {
    case FunctionComponent:
      return updateFunctionComponent(current, workInProgress, ...)
    case ClassComponent:
      return updateClassComponent(current, workInProgress, ...)
    case HostComponent:
      return updateHostComponent(current, workInProgress, ...)
    case HostRoot:
      return updateHostRoot(current, workInProgress, renderLanes)
    // ... другие типы
  }
}
```

### Что такое bailout

Bailout — это "пропуск" поддерева. Когда React определяет, что узел не изменился, он не рендерит его и не обходит его детей. Именно так работает `React.memo`: обёртка Memo проверяет oldProps === newProps, и если true — bailout.

Но есть нюанс: bailout не означает, что `workInProgress` для детей не создаётся вообще. Если в поддереве есть pending updates (например, `setState` у глубокого ребёнка) — React всё равно спустится, но пропустит неизменённые промежуточные узлы.

### updateFunctionComponent изнутри

```ts
function updateFunctionComponent(current, workInProgress, Component, nextProps, renderLanes) {
  // Подготавливаем контекст хуков для этого компонента
  prepareToReadContext(workInProgress, renderLanes)

  // Вызываем саму функцию компонента — это и есть "рендер"
  const nextChildren = renderWithHooks(
    current, workInProgress, Component, nextProps, undefined, renderLanes
  )

  // Reconciliation: сравниваем результат с предыдущими детьми
  // Создаём/обновляем/помечаем на удаление дочерние Fiber nodes
  reconcileChildren(current, workInProgress, nextChildren, renderLanes)

  return workInProgress.child
}
```

`renderWithHooks` сохраняет `workInProgress` в глобальную переменную `currentlyRenderingFiber` — именно поэтому хуки "знают", к какому компоненту они принадлежат.

## completeWork: строим DOM и effect list

`completeWork` вызывается, когда узел обработан и все его дети тоже обработаны. Для HostComponent (div, span и т.д.) здесь происходит главное:

```ts
function completeWork(current, workInProgress, renderLanes): Fiber | null {
  switch (workInProgress.tag) {
    case HostComponent: {
      if (current !== null && workInProgress.stateNode != null) {
        // Обновление: сравниваем старые и новые пропсы
        // Если есть разница — добавляем в updateQueue список изменений
        updateHostComponent(current, workInProgress, type, newProps, rootContainerInstance)
      } else {
        // Первый рендер: создаём реальный DOM-узел
        const instance = createInstance(type, newProps, ...)
        // Добавляем дочерние DOM-узлы (они уже готовы — снизу вверх)
        appendAllChildren(instance, workInProgress, ...)
        workInProgress.stateNode = instance
      }
      // ...
    }
  }
}
```

### Effect List (до React 18) и subtreeFlags (React 18+)

После `completeWork` React "пузырём" собирает флаги изменений снизу вверх. В старых версиях была отдельная связанная структура `effectList`. В React 18 перешли на `subtreeFlags` — битовые маски, которые хранятся прямо в Fiber node.

```ts
// При completeWork каждый узел "передаёт" свои флаги родителю:
let subtreeFlags = NoFlags
let child = workInProgress.child
while (child !== null) {
  subtreeFlags |= child.subtreeFlags   // флаги всего поддерева ребёнка
  subtreeFlags |= child.flags          // флаги самого ребёнка
  child = child.sibling
}
workInProgress.subtreeFlags |= subtreeFlags
```

Это позволяет Commit фазе быстро пропускать поддеревья без изменений: если `subtreeFlags === NoFlags` — спускаться не нужно.

## completeUnitOfWork: навигация после завершения

```ts
function completeUnitOfWork(unitOfWork: Fiber): void {
  let completedWork: Fiber = unitOfWork

  do {
    const current = completedWork.alternate
    const returnFiber = completedWork.return

    // Вызываем completeWork для текущего узла
    completeWork(current, completedWork, subtreeRenderLanes)

    // Есть sibling? Переходим к нему (он ещё не обработан)
    const siblingFiber = completedWork.sibling
    if (siblingFiber !== null) {
      workInProgress = siblingFiber
      return  // выходим из completeUnitOfWork, возобновляем workLoop
    }

    // Нет sibling — поднимаемся к родителю
    completedWork = returnFiber
    workInProgress = completedWork
  } while (completedWork !== null)

  // Дошли до корня — фаза рендера завершена
  if (workInProgressRootExitStatus === RootInProgress) {
    workInProgressRootExitStatus = RootCompleted
  }
}
```

## Scheduler internals: MessageChannel вместо setTimeout

Почему React использует `MessageChannel` для планирования задач?

```ts
// Плохой вариант (не используется в React):
setTimeout(callback, 0)
// Проблема 1: браузеры ограничивают до ~4ms при вложенности
// Проблема 2: выполняется ПОСЛЕ paint (мы хотим ПЕРЕД)

// Хороший вариант (React Scheduler):
const channel = new MessageChannel()
const port = channel.port2
channel.port1.onmessage = performWorkUntilDeadline
port.postMessage(null)
```

`MessageChannel.onmessage` выполняется как **macrotask**, но с несколькими преимуществами:
- Нет минимального таймаута (в отличие от `setTimeout`)
- Браузер выполняет его в конце текущего event loop тика, до следующего paint
- Работает в Web Workers и Node.js (где нет `requestAnimationFrame`)

### Временные метки и дедлайн

```ts
let startTime: number
let deadline: number
const FRAME_YIELD_MS = 5  // дефолтный временной слот

function performWorkUntilDeadline() {
  startTime = getCurrentTime()
  deadline = startTime + FRAME_YIELD_MS

  try {
    const hasMoreWork = scheduledCallback(true, startTime)
    if (hasMoreWork) {
      // Есть ещё работа — планируем следующий тик
      port.postMessage(null)
    }
  } finally {
    scheduledCallback = null
  }
}

function shouldYield(): boolean {
  return getCurrentTime() >= deadline
}
```

### Две очереди Scheduler

Scheduler хранит задачи в двух **min-heap** очередях:

- **taskQueue**: задачи, время которых уже наступило, отсортированные по `expirationTime`
- **timerQueue**: задачи с `delay`, отсортированные по `startTime`

При каждом тике Scheduler перекладывает созревшие задачи из `timerQueue` в `taskQueue` и берёт из `taskQueue` задачу с минимальным `expirationTime`.

## Lane-модель: битовые маски приоритетов

Lanes — это не просто числа. Это **битовые маски**, которые можно комбинировать:

```ts
// Реальные значения из React исходников
export const SyncLane: Lane = 0b0000000000000000000000000000001  // 1
export const InputContinuousLane: Lane = 0b0000000000000000000000000000100  // 4
export const DefaultLane: Lane = 0b0000000000000000000000000010000  // 16
export const TransitionLane1: Lane = 0b0000000000000000000000001000000  // 64
export const IdleLane: Lane = 0b0100000000000000000000000000000  // очень большой

// Группа всех Transition lanes (их 16 штук, round-robin):
export const TransitionLanes: Lanes = 0b0000000001111111111111111000000
```

### Операции над lanes

```ts
// Объединить lanes (у нас есть ОБА приоритета)
function mergeLanes(a: Lanes, b: Lanes): Lanes {
  return a | b
}

// Проверить пересечение (есть ли lane из b в a?)
function includesSomeLane(a: Lanes, b: Lanes): boolean {
  return (a & b) !== 0
}

// Убрать lane из набора
function removeLanes(set: Lanes, subset: Lanes): Lanes {
  return set & ~subset
}

// Получить самый приоритетный lane (наименьший бит)
function getHighestPriorityLane(lanes: Lanes): Lane {
  return lanes & -lanes  // трюк с двоичным дополнением
}
```

### От Lane к приоритету Scheduler

React переводит Lane в приоритет Scheduler:

```ts
function lanesToEventPriority(lanes: Lanes): EventPriority {
  const lane = getHighestPriorityLane(lanes)
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority   // SyncLane → ImmediatePriority
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority  // InputContinuousLane → UserBlockingPriority
  }
  if (includesSomeLane(lanes, NonIdleLanes)) {
    return DefaultEventPriority     // DefaultLane → NormalPriority
  }
  return IdleEventPriority          // IdleLane → IdlePriority
}
```

## Expiration Time и защита от голодания

**Голодание (starvation)** — это когда низкоприоритетная задача никогда не выполняется, потому что высокоприоритетные задачи постоянно вытесняют её.

React защищается от этого через **expiration time**: каждая задача получает дедлайн (текущее время + таймаут приоритета). Если задача "просрочилась" — она "повышается" до синхронного приоритета.

```ts
// Таймауты для каждого приоритета (Scheduler)
const IMMEDIATE_PRIORITY_TIMEOUT = -1           // немедленно
const USER_BLOCKING_PRIORITY_TIMEOUT = 250      // 250ms
const NORMAL_PRIORITY_TIMEOUT = 5000            // 5 секунд
const LOW_PRIORITY_TIMEOUT = 10000              // 10 секунд
const IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt // никогда не истекает

// Задача получает expirationTime:
const expirationTime = startTime + timeout
// Если currentTime > expirationTime — задача "голодает" и форсируется
```

## Сравнение с requestAnimationFrame и requestIdleCallback

| Механизм | Когда выполняется | Гарантии | Используется в React |
|---|---|---|---|
| `requestAnimationFrame` | Перед каждым paint, ~16ms | Гарантирован кадр | Нет (нестабильно в фоне) |
| `requestIdleCallback` | В "пустое" время кадра | Нет жёстких гарантий | Нет (не везде доступен) |
| `MessageChannel` | Macrotask, до paint | Нет минимального таймаута | Да (основной механизм) |
| `setTimeout(fn, 0)` | Macrotask, после 4ms задержки | Минимум 4ms | Нет (слишком медленно) |

React Scheduler — это по сути ручная реализация `requestIdleCallback` с лучшим контролем и кроссплатформенностью.

## ⚠️ Частые заблуждения

❌ **"Concurrent Mode = параллельный рендеринг"**

```jsx
// Ожидание: два компонента рендерятся одновременно на разных CPU
// Реальность: JavaScript однопоточный

// Concurrent Mode — это про ПРЕРЫВАЕМОСТЬ, а не параллельность
```

Почему это проблема: разработчики думают, что Concurrent Mode ускоряет рендер за счёт параллелизма. На самом деле он улучшает отзывчивость за счёт прерываемости.

✅ Concurrent Mode = рендер можно прервать, приостановить и возобновить. На одном потоке, но кусками.

---

❌ **"shouldYield() проверяет загрузку CPU"**

```ts
// Неверно:
function shouldYield() {
  return cpuLoad > 80  // так НЕ работает
}

// Верно:
function shouldYield() {
  return getCurrentTime() >= deadline  // просто время
}
```

Почему это важно: разработчики думают, что React "умно" определяет нагрузку. На самом деле — это просто таймер. 5ms прошло — отдай управление.

✅ `shouldYield()` — это таймер, а не датчик нагрузки.

---

❌ **"Lane с меньшим числовым значением = более высокий приоритет"**

```ts
// Неверно интуитивно:
SyncLane = 1        // меньше = выше? Да, в этом случае
IdleLane = очень большое  // больше = ниже? Да, в этом случае

// НО это не "числовое сравнение", а битовые маски
// getHighestPriorityLane использует (lanes & -lanes) — самый правый бит
```

Почему это проблема: разработчики сравнивают lanes как числа (`lane1 < lane2`), хотя надо использовать битовые операции.

✅ Для сравнения приоритетов используй `isHigherEventPriority()` или `getHighestPriorityLane()`, а не `<` / `>`.

---

❌ **"После прерывания React начинает рендер заново"**

```ts
// Упрощённо неверно:
// Прервали → выбросили workInProgress → начали с корня

// Верно:
// Прервали → workInProgress указывает на последний обработанный узел
// Возобновили → продолжаем с того же места
```

Почему это важно: разработчики избегают Concurrent Mode, думая, что прерывания "дорогие". На самом деле возобновление — это просто `while (workInProgress !== null)` с уже заполненной переменной.

✅ Прерывание = выйти из цикла. Возобновление = войти в тот же цикл с той же переменной.

---

❌ **"startTransition делает обновление медленным"**

```tsx
// Неверное понимание:
startTransition(() => {
  setItems(newItems)  // "это будет выполнено медленно"
})

// Верное понимание:
// Это говорит React: "это обновление можно прервать и отложить"
// Если нет конкурирующих задач — выполнится сразу
// Если есть клик/ввод — будет отложено в пользу них
```

✅ `startTransition` = "это можно прервать", а не "это будет медленным".
