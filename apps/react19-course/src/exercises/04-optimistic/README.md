# Уровень 4: useOptimistic — оптимистичные обновления

## Введение

Оптимистичные обновления — это паттерн, при котором UI обновляется **мгновенно**, не дожидаясь ответа сервера. Если запрос успешен — данные подтверждаются. Если нет — UI автоматически откатывается к предыдущему состоянию. React 19 предоставляет встроенный хук `useOptimistic` для реализации этого паттерна.

---

## 1. Что такое оптимистичные обновления?

### Проблема

При классическом подходе пользователь нажимает кнопку и ждёт ответ сервера:

```
Клик → Запрос → Ожидание (1-3 сек) → Обновление UI
```

Это создаёт ощущение «тормозящего» интерфейса.

### Оптимистичный подход

```
Клик → Мгновенное обновление UI → Запрос в фоне → Подтверждение или откат
```

Пользователь видит результат сразу, а подтверждение происходит в фоне.

### Примеры из реальной жизни

- **Лайки** в социальных сетях (сердечко загорается мгновенно)
- **Сообщения** в мессенджерах (появляются сразу с пометкой «отправка»)
- **Корзина** в интернет-магазинах (товар добавляется мгновенно)
- **Тудушки** (задача появляется в списке сразу)

---

## 2. `useOptimistic` — API и принцип работы

### Базовый синтаксис

```tsx
import { useOptimistic } from 'react'

const [optimisticState, setOptimistic] = useOptimistic(actualState)
```

- **`actualState`** — реальное состояние (источник истины)
- **`optimisticState`** — оптимистичная версия (может временно отличаться)
- **`setOptimistic`** — функция для установки оптимистичного значения

### С reducer-функцией

```tsx
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (currentState, newItem) => [...currentState, newItem]
)
```

Reducer получает текущее состояние и оптимистичное значение, возвращает новое состояние.

### Как это работает

1. Вызываете `setOptimistic(newValue)` — UI мгновенно обновляется
2. Выполняете async-операцию (запрос к серверу)
3. При успехе обновляете реальное состояние — оптимистичное значение синхронизируется
4. При ошибке НЕ обновляете реальное состояние — оптимистичное значение автоматически откатывается

---

## 3. Паттерн: обновить UI → запрос → откат при ошибке

### Полный пример с лайком

```tsx
import { useState, useOptimistic, useTransition } from 'react'

function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      // 1. Мгновенное обновление UI
      setOptimisticLiked(!liked)

      try {
        // 2. Запрос к серверу
        await fetch(`/api/posts/${postId}/like`, {
          method: liked ? 'DELETE' : 'POST',
        })
        // 3. Подтверждение — обновляем реальное состояние
        setLiked(!liked)
      } catch {
        // 4. Ошибка — реальное состояние не меняется,
        // оптимистичное автоматически откатывается
        console.error('Не удалось обновить лайк')
      }
    })
  }

  return (
    <button onClick={handleToggle} disabled={isPending}>
      {optimisticLiked ? '❤️' : '🤍'}
    </button>
  )
}
```

### Пример с добавлением в список

```tsx
function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, { ...newTodo, sending: true }]
  )
  const [isPending, startTransition] = useTransition()

  function addTodo(formData: FormData) {
    const text = formData.get('text') as string

    startTransition(async () => {
      addOptimistic({ id: 'temp', text, sending: true })
      const saved = await api.createTodo(text)
      setTodos(prev => [...prev, saved])
    })
  }

  return (
    <form action={addTodo}>
      <input name="text" />
      <button type="submit">Добавить</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.text} {todo.sending && '(сохранение...)'}
          </li>
        ))}
      </ul>
    </form>
  )
}
```

---

## 4. Сравнение с ручной реализацией

### Ручная реализация (React 18)

```tsx
function LikeButtonManual() {
  const [liked, setLiked] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    const previousLiked = liked
    setLiked(!liked)        // оптимистичное обновление
    setIsPending(true)

    try {
      await api.toggleLike()
      // успех — состояние уже обновлено
    } catch {
      setLiked(previousLiked) // ручной откат!
    } finally {
      setIsPending(false)
    }
  }

  return <button onClick={handleToggle}>{liked ? '❤️' : '🤍'}</button>
}
```

### С useOptimistic (React 19)

```tsx
function LikeButtonOptimistic() {
  const [liked, setLiked] = useState(false)
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      setOptimisticLiked(!liked)
      await api.toggleLike()
      setLiked(!liked)
      // откат при ошибке — автоматический!
    })
  }

  return <button>{optimisticLiked ? '❤️' : '🤍'}</button>
}
```

### Преимущества `useOptimistic`

| Ручная реализация         | useOptimistic             |
| ------------------------- | ------------------------- |
| Ручной откат через setState | Автоматический откат     |
| Нужен отдельный isPending | isPending через transition |
| Легко забыть сценарий ошибки | Встроенная обработка    |
| Больше boilerplate кода   | Минимум кода              |

---

## Резюме

| Концепция                   | Описание                                     |
| --------------------------- | -------------------------------------------- |
| `useOptimistic(state)`      | Создать оптимистичную версию состояния       |
| `useOptimistic(state, fn)`  | Версия с reducer для сложных обновлений      |
| `setOptimistic(value)`      | Мгновенно обновить UI                        |
| Автоматический откат        | При ошибке UI возвращается к реальному state  |
| `startTransition` + `useOptimistic` | Рекомендуемая комбинация              |
