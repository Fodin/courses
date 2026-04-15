# Уровень 9: Batching и автоматические оптимизации

## Проблема: лишние рендеры при нескольких setState

Представьте форму входа. При нажатии кнопки "Войти" вы делаете три вещи:

```tsx
function handleLogin() {
  setIsLoading(true)   // setState #1
  setError(null)       // setState #2
  setUser(data)        // setState #3
}
```

Вопрос: сколько раз перерисуется компонент?

Наивный ответ — три раза. Правильный ответ — **один раз**. React "пакетирует" (batches) обновления состояния и применяет их все разом в конце обработчика события. Это и есть batching.

---

## Что такое batching

**Batching** — механизм, при котором React собирает несколько вызовов `setState` в один "пакет" и выполняет единственный рендер вместо нескольких.

```
Без batching:                    С batching:
setA(1) → рендер 1              setA(1) ─┐
setB(2) → рендер 2              setB(2) ─┤ → один рендер
setC(3) → рендер 3              setC(3) ─┘
```

Аналогия: курьер, который не делает три отдельных поездки к соседу — собирает все посылки и едет один раз.

---

## React 17: batching только в event handlers

До React 18 batching работал **только внутри обработчиков React-событий** (onClick, onChange и т.д.):

```tsx
// ✅ React 17: batching работает (синтетический event handler)
function handleClick() {
  setCount(c => c + 1)   // не рендерит
  setFlag(f => !f)        // не рендерит
  // → только здесь один рендер
}

// ❌ React 17: НЕТ batching (setTimeout — вне React event loop)
setTimeout(() => {
  setCount(c => c + 1)   // рендер #1
  setFlag(f => !f)        // рендер #2
}, 1000)

// ❌ React 17: НЕТ batching (Promise.then)
fetchData().then(data => {
  setData(data)           // рендер #1
  setLoading(false)       // рендер #2
})

// ❌ React 17: НЕТ batching (native event listener)
element.addEventListener('click', () => {
  setA(1)   // рендер #1
  setB(2)   // рендер #2
})
```

Хотите batching в React 17 вне обработчиков? Используйте `unstable_batchedUpdates`:

```tsx
import { unstable_batchedUpdates } from 'react-dom'

setTimeout(() => {
  unstable_batchedUpdates(() => {
    setCount(c => c + 1)   // не рендерит
    setFlag(f => !f)        // не рендерит
    // → один рендер
  })
}, 1000)
```

---

## React 18: автоматический batching везде

React 18 убрал это ограничение. Теперь batching работает **в любом контексте**:

```tsx
// ✅ React 18: batching везде

// В event handlers (было и раньше)
function handleClick() {
  setCount(c => c + 1)
  setFlag(f => !f)
  // → один рендер
}

// В setTimeout (НОВОЕ в React 18)
setTimeout(() => {
  setCount(c => c + 1)
  setFlag(f => !f)
  // → один рендер
}, 1000)

// В Promise.then (НОВОЕ в React 18)
fetchData().then(data => {
  setData(data)
  setLoading(false)
  // → один рендер
})

// В native event listeners (НОВОЕ в React 18)
element.addEventListener('click', () => {
  setA(1)
  setB(2)
  // → один рендер
})
```

💡 Автоматический batching — одна из главных причин перейти на `createRoot` (React 18). Без `createRoot` (legacy `ReactDOM.render`) старое поведение сохраняется.

---

## Как batching работает в Fiber

React не выполняет рендер немедленно при вызове `setState`. Вместо этого:

```
setState вызван
    ↓
enqueueUpdate(fiber, update)  → обновление добавляется в очередь на fiber
    ↓
scheduleUpdateOnFiber(fiber)  → планирует рендер (не запускает сразу!)
    ↓
React проверяет: "мы сейчас в batch-контексте?"
    ├─ Да → добавляем в очередь, ждём конца batch
    └─ Нет → запускаем performConcurrentWorkOnRoot
```

Каждый fiber хранит `updateQueue` — кольцевой связный список обновлений. Когда приходит новый `setState`, React добавляет `Update` объект в конец этого списка. Рендер запускается только тогда, когда все синхронные обновления уже поставлены в очередь.

```
fiber.updateQueue = {
  baseState: { count: 0 },
  pending: Update3 → Update1 → Update2 → Update3  // circular
}
```

---

## flushSync: выход из batching

Иногда нужно принудительно запустить рендер **прямо сейчас**, не ожидая конца batch. Для этого есть `flushSync`:

```tsx
import { flushSync } from 'react-dom'

function handleAddMessage(text: string) {
  flushSync(() => {
    setMessages(msgs => [...msgs, text])
    // React выполняет рендер ЗДЕСЬ, синхронно
  })
  // DOM уже обновлён — можно измерить его
  listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
}
```

### Когда нужен flushSync

Главный сценарий — **DOM measurement сразу после state update**:

```tsx
// ❌ Без flushSync: скроллим к DOM, который ещё не обновился
setMessages(msgs => [...msgs, newMsg])
listRef.current?.scrollToBottom()  // новое сообщение ещё не отрисовано!

// ✅ С flushSync: DOM обновлён до scrollToBottom
flushSync(() => {
  setMessages(msgs => [...msgs, newMsg])
})
listRef.current?.scrollToBottom()  // видит новое сообщение
```

---

## ⚠️ Распространённые ошибки новичков

### 1. Ожидать рендер сразу после setState

```tsx
// ❌ Неверное понимание: state обновится "сразу"
setState({ count: 5 })
console.log(state.count)  // всё ещё старое значение!
// setState не изменяет state прямо сейчас — он ставит в очередь
```

```tsx
// ✅ Верно: читаем state в следующем рендере или в useEffect
setState({ count: 5 })
useEffect(() => {
  console.log(state.count)  // 5 — здесь state уже новый
}, [state.count])
```

### 2. Думать, что flushSync — это хорошая практика по умолчанию

```tsx
// ❌ Злоупотребление flushSync — теряем все преимущества batching
function handleClick() {
  flushSync(() => setA(1))   // рендер 1
  flushSync(() => setB(2))   // рендер 2
  flushSync(() => setC(3))   // рендер 3
  // три отдельных рендера вместо одного
}
```

```tsx
// ✅ flushSync только когда нужен DOM сразу после рендера
function handleAddItem() {
  flushSync(() => setItems(prev => [...prev, newItem]))
  inputRef.current?.focus()  // фокус на DOM, который уже содержит новый item
}
```

### 3. Цепочки useEffect вместо batched обновлений

```tsx
// ❌ Effect chain: три отдельных рендера
useEffect(() => { if (a) setB(transform(a)) }, [a])
useEffect(() => { if (b) setC(validate(b)) }, [b])
// Рендер 1: a изменился → запускает эффект
// Рендер 2: b обновился → запускает следующий эффект
// Рендер 3: c обновился

// ✅ Batching: один рендер
function handleUpdate(newA) {
  const newB = transform(newA)
  const newC = validate(newB)
  setA(newA)  // batched
  setB(newB)  // batched
  setC(newC)  // batched → один рендер
}
```

---

## Резюме

| Сценарий | React 17 | React 18 |
|---|---|---|
| Event handler | batching | batching |
| setTimeout | нет batching | batching |
| Promise.then | нет batching | batching |
| Native listener | нет batching | batching |
| flushSync | нет эффекта | sync flush |

📌 React 18 + `createRoot` = автоматический batching везде. Используйте `flushSync` только когда нужно прочитать DOM сразу после обновления.
