# Task 6.2: UI Store

## Goal

Learn to separate state into a domain store (business data) and a UI store (interface state), linking them through the constructor.

## Requirements

1. Create a `TodoDomainStore` class with `makeAutoObservable`:
   - Observable: `todos[]`
   - Actions: `addTodo`, `removeTodo`, `toggleTodo`
   - Computed: `completedCount`, `activeCount`
2. Create a `TodoUIStore` class with `makeAutoObservable`:
   - Accepts `domainStore: TodoDomainStore` via constructor
   - Observable fields:
     - `filter: 'all' | 'active' | 'completed'` (default `'all'`)
     - `editingId: string | null` (default `null`)
     - `isAddFormOpen: boolean` (default `false`)
   - Actions: `setFilter(filter)`, `setEditingId(id)`, `toggleAddForm()`
   - Computed: `filteredTodos` — filters `domainStore.todos` by the current filter
3. Create both stores at the module level, passing `domainStore` to the `UIStore` constructor
4. In the observer component:
   - A "+ Add Todo" / "Cancel" button to toggle the add form (`isAddFormOpen`)
   - Filter buttons (all / active / completed) with the current filter highlighted
   - Todo list from `uiStore.filteredTodos`
   - Highlight the editing todo (`editingId`)
   - Statistics: display filtered count / total

```typescript
class TodoUIStore {
  filter: 'all' | 'active' | 'completed' = 'all'
  editingId: string | null = null
  isAddFormOpen = false

  constructor(private domainStore: TodoDomainStore)

  get filteredTodos(): Todo[]
}
```

## Checklist

- [ ] `TodoDomainStore` contains only business logic
- [ ] `TodoUIStore` contains only UI state
- [ ] `TodoUIStore` receives `domainStore` via constructor
- [ ] `filteredTodos` in UIStore filters data from domainStore
- [ ] `toggleAddForm` button shows/hides the add form
- [ ] Filters switch and affect the displayed list
- [ ] `editingId` highlights the selected todo

## How to verify

1. Click "+ Add Todo" — an input form appears, the button changes to "Cancel"
2. Add a todo — the form closes, the todo appears in the list
3. Switch filters — the list updates, statistics below show "Showing: X / Y"
4. Click Edit on a todo — the row is highlighted with a background color
5. Verify that business operations (toggle, delete) go through domainStore, and UI operations (filter, editingId) go through uiStore
