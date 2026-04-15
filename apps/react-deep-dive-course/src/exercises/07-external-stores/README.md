# Уровень 7: Подписки и внешние хранилища

## Проблема: данные, которые живут вне React

React управляет состоянием внутри своего дерева. Но реальный мир полон данных, которые существуют _снаружи_ — в браузере, в сторонних библиотеках, в глобальных синглтонах:

- `window.matchMedia` — изменение медиа-запроса
- `navigator.onLine` — статус сети
- `localStorage` — хранилище между сессиями
- Redux Store, Zustand store — сторонние state-менеджеры
- WebSocket, EventEmitter — потоки событий

Как подписаться на эти данные и синхронизировать их с React?

---

## Ручной подход: useEffect + addEventListener + setState

Первое, что приходит в голову:

```tsx
function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handler = () => setOnline(navigator.onLine)
    window.addEventListener('online', handler)
    window.addEventListener('offline', handler)
    return () => {
      window.removeEventListener('online', handler)
      window.removeEventListener('offline', handler)
    }
  }, [])

  return online
}
```

Это работает. Но у этого подхода есть скрытые проблемы.

### Проблема 1: Boilerplate и ошибки с cleanup

При каждом новом источнике данных нужно заново писать всю связку: инициализация → подписка → отписка. Легко забыть вернуть cleanup, использовать неправильное имя события или потерять начальное значение.

### Проблема 2: Tearing в Concurrent Mode

💡 **Tearing** — это ситуация, когда разные части интерфейса отображают _разные версии_ одного и того же состояния в рамках одного визуального рендера.

```
Компонент A читает store.value → 42
  [ React прерывает рендер... ]
  [ store.value обновляется → 43 ]
Компонент B читает store.value → 43

Итог: A показывает 42, B показывает 43. Intерфейс рассинхронизирован.
```

В режиме Concurrent Mode (React 18+) рендеры могут прерываться и возобновляться. При ручных подписках через `useEffect` React не знает о внешнем store — он не может гарантировать, что все компоненты читают одну и ту же "версию" данных.

---

## useSyncExternalStore

React 18 представил хук специально для этой задачи:

```tsx
import { useSyncExternalStore } from 'react'

const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?)
```

### Три параметра

**`subscribe(callback): () => void`**

Функция подписки. Принимает callback, который нужно вызывать при каждом изменении store. Должна возвращать функцию отписки.

```tsx
const subscribe = (callback: () => void) => {
  window.addEventListener('online', callback)
  window.addEventListener('offline', callback)
  return () => {
    window.removeEventListener('online', callback)
    window.removeEventListener('offline', callback)
  }
}
```

📌 `subscribe` должна быть **стабильной ссылкой** — передавайте её вне компонента или через `useCallback`.

**`getSnapshot(): T`**

Функция чтения текущего состояния. React вызывает её:
- во время рендера (для получения значения)
- после каждого вызова callback (для проверки, изменилось ли значение)

```tsx
const getSnapshot = () => navigator.onLine
```

⚠️ **Критично**: `getSnapshot` должна возвращать **стабильную ссылку** при отсутствии изменений. Если она каждый раз создаёт новый объект — React войдёт в бесконечный цикл перерендеров.

**`getServerSnapshot(): T`** (опционально)

Версия snapshot для SSR. Если не передать, а компонент рендерится на сервере — будет ошибка гидратации.

### Итоговый хук

```tsx
const subscribe = (cb: () => void) => {
  window.addEventListener('online', cb)
  window.addEventListener('offline', cb)
  return () => {
    window.removeEventListener('online', cb)
    window.removeEventListener('offline', cb)
  }
}

const getSnapshot = () => navigator.onLine

function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, () => true)
}
```

---

## Когда использовать useSyncExternalStore

| Ситуация | Решение |
|----------|---------|
| State внутри React-компонента | `useState` / `useReducer` |
| Async данные (fetch) | `useState` + `useEffect` + AbortController |
| Вычисления из React-state | `useMemo` |
| **State, живущий вне React** | **`useSyncExternalStore`** |

🎯 **Правило**: если источник данных существует независимо от жизненного цикла компонента — используй `useSyncExternalStore`.

---

## Проверка стабильности getSnapshot

```tsx
// ❌ Infinite loop: каждый вызов создаёт новый объект
const getSnapshot = () => ({ width: window.innerWidth, height: window.innerHeight })

// ✅ Stable: примитив — всегда стабилен
const getSnapshot = () => window.innerWidth

// ✅ Stable: кэшируем объект, обновляем только при реальном изменении
let cache = { width: window.innerWidth, height: window.innerHeight }
const getSnapshot = () => {
  const next = { width: window.innerWidth, height: window.innerHeight }
  if (next.width === cache.width && next.height === cache.height) return cache
  return (cache = next)
}
```

---

## Итог

`useSyncExternalStore` решает три проблемы одновременно:
1. **Единый контракт** — одинаковый API для любого внешнего store
2. **Защита от tearing** — React синхронизирует рендер с моментальным снимком
3. **Правильный cleanup** — subscribe/unsubscribe управляется React автоматически
