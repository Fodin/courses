# Level 6: Store Patterns — Organizing Stores

## Why Do We Need Patterns?

As applications grow, a single store becomes a "god object" — a massive class that knows everything about everything. Store organization patterns solve this by separating concerns.

---

## 1. Domain Store

A **Domain Store** contains business logic and domain data. It knows nothing about the UI: it doesn't hold filter state, open modals, or selected tabs.

```tsx
class TodoStore {
  todos: Todo[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string) {
    this.todos.push({ id: crypto.randomUUID(), title, completed: false })
  }

  removeTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id)
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  get completedCount() {
    return this.todos.filter((t) => t.completed).length
  }

  get activeCount() {
    return this.todos.filter((t) => !t.completed).length
  }
}
```

**Key rule:** A Domain Store operates in terms of the domain (todo, user, order), not UI terms (selectedTab, isModalOpen).

---

## 2. UI Store

A **UI Store** holds interface state that doesn't belong to business data:

- Which filter is selected
- Which item is being edited
- Whether the add form is open

```tsx
class TodoUIStore {
  filter: 'all' | 'active' | 'completed' = 'all'
  editingId: string | null = null
  isAddFormOpen = false

  constructor(private domainStore: TodoStore) {
    makeAutoObservable(this)
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter = filter
  }

  get filteredTodos() {
    switch (this.filter) {
      case 'active':
        return this.domainStore.todos.filter((t) => !t.completed)
      case 'completed':
        return this.domainStore.todos.filter((t) => t.completed)
      default:
        return this.domainStore.todos
    }
  }
}
```

A UI Store may reference a Domain Store (for computed properties like `filteredTodos`), but a Domain Store **never** references a UI Store.

---

## 3. Root Store

When there are many stores, they need a way to communicate. A **Root Store** is a central object that creates all stores and passes itself to each of them.

```tsx
class RootStore {
  todoStore: TodoStore
  uiStore: TodoUIStore

  constructor() {
    this.todoStore = new TodoStore()
    this.uiStore = new TodoUIStore(this)
  }
}
```

Each child store receives `root` in its constructor and can access any other store via `this.root.someStore`:

```tsx
class TodoUIStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  get filteredTodos() {
    return this.root.todoStore.todos.filter(/* ... */)
  }
}
```

**Benefits:**
- Stores don't import each other directly — no circular dependencies
- Easy to create an isolated instance for tests: `new RootStore()`
- Single initialization point

---

## 4. Store with Models

Instead of storing plain objects in an array, a store can hold **class instances** with their own observable, action, and computed properties:

```tsx
class Todo {
  id: string
  title: string
  completed = false
  deadline: Date | null

  constructor(title: string, deadline?: Date) {
    this.id = crypto.randomUUID()
    this.title = title
    this.deadline = deadline ?? null
    makeAutoObservable(this)
  }

  toggle() {
    this.completed = !this.completed
  }

  get isOverdue() {
    if (!this.deadline || this.completed) return false
    return new Date() > this.deadline
  }
}
```

A collection store manages the array of models:

```tsx
class TodoStore {
  todos: Todo[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addTodo(title: string, deadline?: Date) {
    this.todos.push(new Todo(title, deadline))
  }

  get overdueCount() {
    return this.todos.filter((t) => t.isOverdue).length
  }
}
```

**When to use models:**
- An entity has its own behavior (`todo.toggle()`, `user.updateName()`)
- You need computed properties at the individual item level (`todo.isOverdue`)
- The entity is complex, with nested data

**When plain objects are enough:**
- The entity is just data without behavior
- All operations are performed in the collection store

---

## Common Mistakes

### UI logic in Domain Store

```tsx
// BAD: domain store knows about UI
class TodoStore {
  filter = 'all'      // this is UI state
  isModalOpen = false  // this is UI state
  todos: Todo[] = []
}

// GOOD: separate concerns
class TodoStore {
  todos: Todo[] = []
}

class TodoUIStore {
  filter = 'all'
  isModalOpen = false
}
```

### Circular dependencies without Root Store

```tsx
// BAD: direct imports create circular dependencies
import { uiStore } from './UIStore'

class TodoStore {
  doSomething() {
    uiStore.notify() // tight coupling
  }
}

// GOOD: communicate through root
class TodoStore {
  constructor(private root: RootStore) {}

  doSomething() {
    this.root.uiStore.notify()
  }
}
```

---

## Best Practices

1. **One store — one responsibility.** Domain Store for data, UI Store for interface
2. **Root Store for communication.** Don't import stores directly into each other
3. **Models for complex entities.** If an object has behavior — make it a class
4. **Computed for derived data.** `filteredTodos`, `completedCount` — always computed
5. **Multiple UI stores are fine.** `TodoUIStore`, `SettingsUIStore` — one per module
