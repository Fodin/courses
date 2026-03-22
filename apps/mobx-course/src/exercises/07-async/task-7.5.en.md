# Task 7.5: Optimistic Updates

## Goal

Implement the optimistic update pattern — update the UI immediately and roll back on server error.

## Requirements

Create an `OptimisticTodoStore` store with a todo list and a toggle method:

1. Declare observable fields:
   - `todos: OptTodo[]` — todo list (3 initial items)
   - `lastError: string | null` — last error message
2. Implement `async toggle(id: string)`:
   - Find the todo by `id`
   - **Save** the previous `completed` value in a `prevState` variable
   - **Optimistically** update: toggle `completed`, set `pending = true`, clear `lastError`
   - **Send** a request to the server (`mockApi.toggleTodo`)
   - **On success** — set `pending = false`
   - **On error** — roll back `completed = prevState`, clear `pending`, write the error to `lastError`
   - All changes after `await` are wrapped in `runInAction`
3. In the component:
   - Display checkboxes with todos
   - Todos with `pending = true` are semi-transparent and disabled
   - Show error message on failure

```typescript
interface OptTodo {
  id: string
  title: string
  completed: boolean
  pending?: boolean
}
```

## Checklist

- [ ] `OptimisticTodoStore` with `makeAutoObservable`
- [ ] `toggle` saves `prevState` before changing
- [ ] UI updates instantly (before server response)
- [ ] On error, `completed` rolls back to `prevState`
- [ ] `pending` is correctly set and cleared
- [ ] Error message is displayed in the UI
- [ ] All post-await mutations are wrapped in `runInAction`

## How to verify

1. Click a checkbox — it toggles instantly, becomes semi-transparent (pending)
2. After ~0.5 seconds, pending clears
3. Since the mock API has a 30% error chance, repeat clicks:
   - On success — the checkbox stays in the new state
   - On error — the checkbox rolls back, a "rolled back" message appears
4. Repeat several times to see both scenarios
