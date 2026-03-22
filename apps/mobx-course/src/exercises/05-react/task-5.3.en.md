# Task 5.3: Store via Context

## Goal

Learn to pass a MobX store through React Context and use a custom hook to access it from child observer components.

## Requirements

1. Create a `TodoStore` class with `makeAutoObservable`:
   - Observable: `todos: Todo[]`, `filter: 'all' | 'active' | 'completed'`
   - Actions: `addTodo(title)`, `removeTodo(id)`, `toggleTodo(id)`, `setFilter(filter)`
   - Computed: `filteredTodos` (list of todos by current filter), `activeCount` (number of incomplete todos)
2. Create `TodoContext` via `createContext<TodoStore | null>(null)`
3. Create a custom hook `useTodoStore()`:
   - Gets the store from context
   - Throws an error if the store is not provided
4. Create a **separate** observer component `TodoList`:
   - Uses `useTodoStore()` to get the store
   - Displays `filteredTodos` with checkboxes and a delete button
5. Create a **separate** observer component `TodoFilters`:
   - Uses `useTodoStore()` to get the store
   - Displays filter buttons (all, active, completed)
   - The active button shows `activeCount` in parentheses
6. In the root component:
   - Create a store instance via `useState(() => new TodoStore())`
   - Wrap child components in `TodoContext.Provider`
   - Add an input field and button for creating new todos

```typescript
interface Todo {
  id: string
  title: string
  completed: boolean
}
```

## Checklist

- [ ] `TodoStore` created with `makeAutoObservable`
- [ ] `TodoContext` created and `Provider` used in the root component
- [ ] Custom hook `useTodoStore()` throws an error when provider is missing
- [ ] `TodoList` — separate observer component using `useTodoStore()`
- [ ] `TodoFilters` — separate observer component using `useTodoStore()`
- [ ] Filtering works: all/active/completed
- [ ] `activeCount` displayed next to the active button

## How to verify

1. Add several todos — they appear in the list
2. Mark some todos as completed — `activeCount` updates
3. Click the active filter — only incomplete todos remain
4. Click completed — only completed todos remain
5. Click all — all todos are displayed
6. Delete a todo — it disappears from the list
