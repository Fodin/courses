# Task 6.4: Store with Models

## Goal

Learn to create models (entity classes) with their own observable, computed, and actions instead of using plain objects.

## Requirements

1. Create a `Todo` model class with `makeAutoObservable(this)` in the constructor:
   - Fields: `id: string`, `title: string`, `completed: boolean`, `createdAt: Date`, `deadline: Date | null`
   - Constructor accepts `title` and optional `deadline`
   - Action: `toggle()` — toggles `completed`
   - Computed `isOverdue` — `true` if `deadline` is set, the task is not completed, and the current date is past the deadline
   - Computed `status` — returns `'completed'`, `'overdue'`, or `'active'`
2. Create a `TodoModelStore` class with `makeAutoObservable`:
   - Observable: `todos: Todo[]`
   - Action `addTodo(title, deadline?)` — creates a `new Todo(...)` instance and adds it to the array
   - Action `removeTodo(id)` — removes a todo by `id`
   - Computed: `completedCount`, `overdueCount`
3. In the observer component:
   - Input field for title and date picker (deadline)
   - Statistics: Total / Completed / Overdue
   - Todo list where each todo is a separate observer component `TodoItem`
   - Color-coded status indication: active (blue), overdue (red), completed (green)

```typescript
class Todo {
  id: string
  title: string
  completed = false
  createdAt: Date
  deadline: Date | null

  constructor(title: string, deadline?: Date)

  toggle(): void
  get isOverdue(): boolean
  get status(): 'completed' | 'overdue' | 'active'
}

class TodoModelStore {
  todos: Todo[] = []

  addTodo(title: string, deadline?: Date): void
  removeTodo(id: string): void
  get completedCount(): number
  get overdueCount(): number
}
```

## Checklist

- [ ] `Todo` — class with `makeAutoObservable` in constructor
- [ ] `Todo.toggle()` toggles `completed`
- [ ] `Todo.isOverdue` correctly determines if overdue
- [ ] `Todo.status` returns one of three values: `completed`, `overdue`, `active`
- [ ] `TodoModelStore` works with `Todo` instances (not plain objects)
- [ ] `TodoItem` — separate observer component for each todo
- [ ] Color-coded status indication displays correctly

## How to verify

1. Add a todo without a deadline — status `active` (blue)
2. Add a todo with a deadline in the past — status `overdue` (red), Overdue counter increases
3. Mark the overdue todo — status changes to `completed` (green), Overdue decreases
4. Delete a todo — it disappears from the list, counters update
5. Verify that `toggle()` is called on the todo object itself, not through the store
