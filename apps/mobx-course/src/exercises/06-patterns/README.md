# Уровень 6: Store Patterns — Паттерны организации сторов

## 🤔 Зачем нужны паттерны?

Когда приложение растёт, один стор превращается в «божественный объект» — огромный класс, который знает всё обо всём. Паттерны организации сторов решают эту проблему, разделяя ответственность.

---

## 🏗️ 1. Domain Store

**Domain Store** содержит бизнес-логику и данные предметной области. Он ничего не знает о UI: не хранит состояние фильтров, открытых модалок или выбранных вкладок.

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

**Ключевое правило:** Domain Store оперирует терминами предметной области (todo, user, order), а не терминами UI (selectedTab, isModalOpen).

---

## 🎨 2. UI Store

**UI Store** хранит состояние интерфейса, которое не относится к бизнес-данным:

- Какой фильтр выбран
- Какой элемент редактируется
- Открыта ли форма добавления

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

UI Store может ссылаться на Domain Store (для computed-свойств вроде `filteredTodos`), но Domain Store **никогда** не ссылается на UI Store.

---

## 🌳 3. Root Store

Когда сторов становится много, возникает вопрос: как они узнают друг о друге? **Root Store** — центральный объект, который создаёт все сторы и передаёт себя каждому из них.

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

Каждый дочерний стор получает `root` в конструкторе и может обращаться к любому другому стору через `this.root.someStore`:

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

**Преимущества:**
- Сторы не импортируют друг друга напрямую — нет циклических зависимостей
- Легко создать изолированный экземпляр для тестов: `new RootStore()`
- Единая точка инициализации

---

## 📋 4. Store с моделями

Вместо хранения plain-объектов в массиве стор может хранить **инстансы классов** с собственными observable, action и computed:

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

Стор-коллекция управляет массивом моделей:

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

**Когда использовать модели:**
- У сущности есть собственное поведение (`todo.toggle()`, `user.updateName()`)
- Нужны computed-свойства на уровне отдельного элемента (`todo.isOverdue`)
- Сущность сложная, с вложенными данными

**Когда plain-объектов достаточно:**
- Сущность — просто данные без поведения
- Все операции выполняются в сторе-коллекции

---

## ⚠️ Типичные ошибки

### UI-логика в Domain Store

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

### Циклические зависимости без Root Store

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

### Забывают makeAutoObservable в модели

```tsx
// BAD: model is not observable
class Todo {
  completed = false
  constructor(public title: string) {
    // forgot makeAutoObservable!
  }
  toggle() { this.completed = !this.completed }
}

// GOOD
class Todo {
  completed = false
  constructor(public title: string) {
    makeAutoObservable(this)
  }
}
```

---

## 💡 Best Practices

1. **Один стор — одна ответственность.** Domain Store для данных, UI Store для интерфейса
2. **Root Store для связи.** Не импортируйте сторы напрямую друг в друга
3. **Модели для сложных сущностей.** Если у объекта есть поведение — сделайте класс
4. **Computed для производных данных.** `filteredTodos`, `completedCount` — всегда computed
5. **Не бойтесь нескольких UI сторов.** `TodoUIStore`, `SettingsUIStore` — каждый для своего модуля

---

## ❌ Частые ошибки новичков

### 1. Циклические зависимости между сторами

```ts
// ❌ Неправильно — прямые импорты создают циклическую зависимость
// todoStore.ts
import { uiStore } from './uiStore'

class TodoStore {
  complete(id: string) {
    this.todos.find(t => t.id === id)!.completed = true
    uiStore.showNotification('Done!') // жёсткая связь
  }
}

export const todoStore = new TodoStore()
```

```ts
// ✅ Правильно — общение через Root Store
class TodoStore {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  complete(id: string) {
    this.todos.find(t => t.id === id)!.completed = true
    this.root.uiStore.showNotification('Done!')
  }
}
```

**Почему это ошибка:** прямые импорты между сторами создают циклические зависимости (`A` импортирует `B`, `B` импортирует `A`), что приводит к `undefined` в момент инициализации. Root Store решает эту проблему, выступая посредником.

### 2. Смешивание UI-состояния и доменных данных в одном сторе

```ts
// ❌ Неправильно — один стор для всего
class TodoStore {
  todos: Todo[] = []
  filter = 'all'          // UI state
  isModalOpen = false      // UI state
  editingId: string | null = null  // UI state

  constructor() { makeAutoObservable(this) }
}
```

```ts
// ✅ Правильно — разделение ответственности
class TodoStore {
  todos: Todo[] = []
  constructor() { makeAutoObservable(this) }

  addTodo(title: string) { /* ... */ }
  removeTodo(id: string) { /* ... */ }
}

class TodoUIStore {
  filter = 'all'
  isModalOpen = false
  editingId: string | null = null

  constructor(private todoStore: TodoStore) {
    makeAutoObservable(this)
  }

  get filteredTodos() {
    // computed использует данные из domain store
    return this.todoStore.todos.filter(/* ... */)
  }
}
```

**Почему это ошибка:** смешивание UI и доменной логики делает стор сложным для тестирования и переиспользования. Domain Store должен работать без UI, а UI Store — управлять только представлением.

### 3. Вычисление производных данных в render вместо computed

```tsx
// ❌ Неправильно — фильтрация в каждом ререндере
const TodoList = observer(function TodoList() {
  // Пересчитывается при КАЖДОМ ререндере, даже если todos не менялись
  const activeTodos = store.todos.filter(t => !t.completed)
  const completedCount = store.todos.filter(t => t.completed).length

  return <div>{activeTodos.map(/* ... */)}</div>
})
```

```ts
// ✅ Правильно — computed с кешированием
class TodoStore {
  todos: Todo[] = []

  constructor() { makeAutoObservable(this) }

  get activeTodos() {
    return this.todos.filter(t => !t.completed)
  }

  get completedCount() {
    return this.todos.filter(t => t.completed).length
  }
}
```

**Почему это ошибка:** вычисление в render выполняется при каждом ререндере компонента. Computed-значения кешируются и пересчитываются только при изменении зависимостей. Для больших списков разница в производительности может быть значительной.

### 4. Хранение производных данных как observable вместо computed

```ts
// ❌ Неправильно — дублирование данных, риск рассинхронизации
class CartStore {
  items: CartItem[] = []
  totalPrice = 0  // observable, который нужно обновлять вручную

  constructor() { makeAutoObservable(this) }

  addItem(item: CartItem) {
    this.items.push(item)
    this.totalPrice = this.items.reduce(
      (sum, i) => sum + i.price * i.qty, 0
    )
  }

  // Если забыть обновить totalPrice в removeItem — баг!
}
```

```ts
// ✅ Правильно — computed всегда актуален
class CartStore {
  items: CartItem[] = []

  constructor() { makeAutoObservable(this) }

  addItem(item: CartItem) {
    this.items.push(item)
  }

  get totalPrice() {
    return this.items.reduce(
      (sum, i) => sum + i.price * i.qty, 0
    )
  }
}
```

**Почему это ошибка:** хранение производных данных как observable требует ручной синхронизации при каждом изменении. Это источник багов: достаточно забыть обновить `totalPrice` в одном методе, и данные рассинхронизируются. Computed-значения всегда вычисляются автоматически и гарантированно актуальны.

---

## 📚 Дополнительные ресурсы

- [Defining Data Stores](https://mobx.js.org/defining-data-stores.html)
- [Best Practices](https://mobx.js.org/best-practices.html)
- [MobX + React: Architecture](https://mobx.js.org/react-integration.html)
- [Observable State](https://mobx.js.org/observable-state.html)
