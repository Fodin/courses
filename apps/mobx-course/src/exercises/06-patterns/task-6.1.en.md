# Task 6.1: Domain Store

## Goal

Learn to design a domain store that contains only business logic and data without mixing in UI state.

## Requirements

1. Create a `TodoStore` class with `makeAutoObservable`:
   - Observable: `todos: { id: string; title: string; completed: boolean }[]`
2. Add action methods (business logic only):
   - `addTodo(title)` — adds a new todo with a unique `id` and `completed: false`
   - `removeTodo(id)` — removes a todo by `id`
   - `toggleTodo(id)` — toggles `completed` for a todo
3. Add computed getters:
   - `completedCount` — number of completed todos
   - `activeCount` — number of incomplete todos
4. **Do not add** any UI state to the store (no filters, editingId, isFormOpen, etc.)
5. Create a store instance at the module level
6. In the observer component, display:
   - An input field and button to add a todo
   - Statistics: Active / Completed / Total
   - A list of todos with checkboxes and a Delete button

```typescript
class TodoStore {
  todos: { id: string; title: string; completed: boolean }[] = []

  addTodo(title: string): void
  removeTodo(id: string): void
  toggleTodo(id: string): void

  get completedCount(): number
  get activeCount(): number
}
```

## Checklist

- [ ] `TodoStore` contains only business logic (data and operations on it)
- [ ] The store has no UI state (no filter, editingId, isOpen, etc.)
- [ ] `addTodo` generates a unique `id` (e.g., `crypto.randomUUID()`)
- [ ] `completedCount` and `activeCount` are computed getters
- [ ] Component is wrapped in `observer`
- [ ] Statistics update automatically when todos change

## How to verify

1. Add 3 todos — Total shows 3, Active shows 3, Completed shows 0
2. Mark 1 todo — Active: 2, Completed: 1
3. Delete the completed todo — Total: 2, Active: 2, Completed: 0
4. Verify the store contains no fields related to UI
