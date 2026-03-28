# Level 4: useOptimistic — Optimistic Updates

## Introduction

Optimistic updates are a pattern where the UI is updated **instantly**, without waiting for a server response. If the request succeeds — the data is confirmed. If it fails — the UI automatically rolls back to the previous state. React 19 provides the built-in `useOptimistic` hook to implement this pattern.

---

## 1. What Are Optimistic Updates?

### The Problem

With the classic approach, the user clicks a button and waits for the server response:

```
Click → Request → Waiting (1–3 sec) → UI update
```

This creates the feeling of a "sluggish" interface.

### The Optimistic Approach

```
Click → Instant UI update → Background request → Confirmation or rollback
```

The user sees the result immediately, while confirmation happens in the background.

### Real-World Examples

- **Likes** in social networks (the heart lights up instantly)
- **Messages** in messengers (appear immediately with a "sending" indicator)
- **Shopping cart** (item is added instantly)
- **To-do lists** (task appears in the list right away)

---

## 2. `useOptimistic` — API and How It Works

### Basic Syntax

```tsx
import { useOptimistic } from 'react'

const [optimisticState, setOptimistic] = useOptimistic(actualState)
```

- **`actualState`** — the real state (source of truth)
- **`optimisticState`** — the optimistic version (may temporarily differ)
- **`setOptimistic`** — function to set the optimistic value

### With a Reducer Function

```tsx
const [optimisticItems, addOptimisticItem] = useOptimistic(
  items,
  (currentState, newItem) => [...currentState, newItem]
)
```

The reducer receives the current state and the optimistic value, and returns the new state.

### How It Works

1. You call `setOptimistic(newValue)` — the UI updates instantly
2. You perform an async operation (server request)
3. On success, you update the real state — the optimistic value syncs up
4. On error, you do NOT update the real state — the optimistic value rolls back automatically

---

## 3. Pattern: Update UI → Request → Rollback on Error

### Full Like Button Example

```tsx
import { useState, useOptimistic, useTransition } from 'react'

function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false)
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked)
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      // 1. Instant UI update
      setOptimisticLiked(!liked)

      try {
        // 2. Server request
        await fetch(`/api/posts/${postId}/like`, {
          method: liked ? 'DELETE' : 'POST',
        })
        // 3. Confirmed — update real state
        setLiked(!liked)
      } catch {
        // 4. Error — real state unchanged,
        // optimistic value rolls back automatically
        console.error('Failed to update like')
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

### Adding to a List Example

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
      <button type="submit">Add</button>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id} style={{ opacity: todo.sending ? 0.5 : 1 }}>
            {todo.text} {todo.sending && '(saving...)'}
          </li>
        ))}
      </ul>
    </form>
  )
}
```

---

## 4. Comparison with Manual Implementation

### Manual Implementation (React 18)

```tsx
function LikeButtonManual() {
  const [liked, setLiked] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleToggle() {
    const previousLiked = liked
    setLiked(!liked)        // optimistic update
    setIsPending(true)

    try {
      await api.toggleLike()
      // success — state already updated
    } catch {
      setLiked(previousLiked) // manual rollback!
    } finally {
      setIsPending(false)
    }
  }

  return <button onClick={handleToggle}>{liked ? '❤️' : '🤍'}</button>
}
```

### With useOptimistic (React 19)

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
      // rollback on error — automatic!
    })
  }

  return <button>{optimisticLiked ? '❤️' : '🤍'}</button>
}
```

### Benefits of `useOptimistic`

| Manual implementation        | useOptimistic                  |
| ---------------------------- | ------------------------------ |
| Manual rollback via setState | Automatic rollback             |
| Separate isPending needed    | isPending via transition       |
| Easy to miss error scenarios | Built-in error handling        |
| More boilerplate code        | Minimal code                   |

---

## Summary

| Concept                             | Description                                      |
| ----------------------------------- | ------------------------------------------------ |
| `useOptimistic(state)`              | Create an optimistic version of state            |
| `useOptimistic(state, fn)`          | Reducer version for complex updates              |
| `setOptimistic(value)`              | Instantly update the UI                          |
| Automatic rollback                  | On error, UI reverts to the real state           |
| `startTransition` + `useOptimistic` | Recommended combination                          |
