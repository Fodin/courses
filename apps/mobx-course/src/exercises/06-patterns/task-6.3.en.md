# Task 6.3: Root Store

## Goal

Learn to create a Root Store that combines all child stores and serves as a single initialization point.

## Requirements

1. Create a `TodoDomainStore63` class with `makeAutoObservable`:
   - Observable: `todos[]`
   - Actions: `addTodo`, `removeTodo`, `toggleTodo`
   - Computed: `completedCount`, `activeCount`
2. Create a `TodoUIStore63` class with `makeAutoObservable`:
   - Accepts `root: RootStore63` via constructor (not a separate domainStore, but the entire root)
   - Observable: `filter: 'all' | 'active' | 'completed'`, `editingId: string | null`
   - Actions: `setFilter(filter)`
   - Computed: `filteredTodos` — filters `this.root.todoStore.todos` by the current filter
3. Create a `RootStore63` class:
   - Creates `todoStore: TodoDomainStore63` and `uiStore: TodoUIStore63` in the constructor
   - Passes `this` (itself) to the `TodoUIStore63` constructor
4. Create a single `RootStore63` instance at the module level
5. In the observer component:
   - Destructure `rootStore` into `todoStore` and `uiStore`
   - Input field + Add button
   - Filter buttons with counts in parentheses (all, active, completed)
   - Todo list with checkboxes and Delete button

```typescript
class RootStore63 {
  todoStore: TodoDomainStore63
  uiStore: TodoUIStore63

  constructor() {
    this.todoStore = new TodoDomainStore63()
    this.uiStore = new TodoUIStore63(this) // pass root
  }
}
```

## Checklist

- [ ] `RootStore63` creates both stores in the constructor
- [ ] `TodoUIStore63` receives `root` (not a separate domainStore)
- [ ] `TodoUIStore63` accesses data via `this.root.todoStore`
- [ ] Single initialization point — `new RootStore63()`
- [ ] Filter buttons show counts in parentheses
- [ ] Filtering and CRUD operations work correctly

## How to verify

1. Add several todos — they appear in the list
2. Click active — only incomplete todos are shown, with counts in parentheses
3. Mark a todo — it disappears from the active filter, counters update
4. Switch to completed — completed todos are displayed
5. Verify that `TodoUIStore63` gets data through `root.todoStore`, not directly
