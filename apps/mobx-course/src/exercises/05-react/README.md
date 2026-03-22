# Уровень 5: React Integration

## 👁️ observer HOC

`observer` — это HOC (Higher-Order Component) из `mobx-react-lite`, который делает React-компонент реактивным. Без `observer` компонент не будет обновляться при изменении observable данных.

```tsx
import { observer } from 'mobx-react-lite'
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0
  constructor() { makeAutoObservable(this) }
  increment() { this.count++ }
}

const store = new CounterStore()

// Без observer — компонент "заморожен", не реагирует на изменения
function BrokenCounter() {
  return <span>{store.count}</span>
}

// С observer — ререндер при каждом изменении store.count
const WorkingCounter = observer(function WorkingCounter() {
  return <span>{store.count}</span>
})
```

### Как работает observer?

1. Оборачивает render-функцию компонента в `autorun`-подобный трекинг
2. Запоминает, какие observable были прочитаны во время рендера
3. Когда любое из них меняется — вызывает ререндер компонента

## 🏠 useLocalObservable

Хук `useLocalObservable` создает локальный MobX стор, привязанный к жизненному циклу компонента:

```tsx
import { observer, useLocalObservable } from 'mobx-react-lite'

const Form = observer(function Form() {
  const state = useLocalObservable(() => ({
    name: '',
    email: '',
    setName(v: string) { state.name = v },
    setEmail(v: string) { state.email = v },
    get isValid() {
      return state.name.length > 0 && state.email.includes('@')
    },
  }))

  return (
    <div>
      <input value={state.name} onChange={e => state.setName(e.target.value)} />
      <input value={state.email} onChange={e => state.setEmail(e.target.value)} />
      <p>Valid: {state.isValid ? 'Yes' : 'No'}</p>
    </div>
  )
})
```

### Когда использовать useLocalObservable?

- Когда состояние нужно только внутри одного компонента
- Когда есть несколько связанных полей с computed-значениями
- Как замена множественным `useState` + `useMemo`

## 🌐 Стор через Context

Для передачи стора через дерево компонентов используйте React Context:

```tsx
import { createContext, useContext } from 'react'

class TodoStore {
  todos: { id: number; text: string; done: boolean }[] = []
  constructor() { makeAutoObservable(this) }
  addTodo(text: string) { /* ... */ }
  toggleTodo(id: number) { /* ... */ }
}

const StoreContext = createContext<TodoStore | null>(null)

function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('Store not found')
  return store
}

// Провайдер в корне
function App() {
  const store = useMemo(() => new TodoStore(), [])
  return (
    <StoreContext.Provider value={store}>
      <TodoList />
    </StoreContext.Provider>
  )
}

// Дочерний компонент получает стор через хук
const TodoList = observer(function TodoList() {
  const store = useStore()
  return <ul>{store.todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
})
```

## ⚡ Гранулярность observer

Ключевой принцип MobX + React: **оборачивайте в observer каждый компонент, который читает observable данные**. Это минимизирует ререндеры.

```tsx
// Плохо: весь список ререндерится при изменении одного элемента
const List = observer(function List({ items }) {
  return <ul>{items.map(item => <li key={item.id}>{item.name}</li>)}</ul>
})

// Хорошо: только измененный элемент ререндерится
const List = observer(function List({ items }) {
  return <ul>{items.map(item => <ListItem key={item.id} item={item} />)}</ul>
})

const ListItem = observer(function ListItem({ item }) {
  return <li>{item.name}</li>
})
```

### Правила

1. **Каждый компонент, читающий observable — оборачивайте в observer**
2. **Дробите на мелкие observer-компоненты** для точечных ререндеров
3. **Не деструктуризируйте observable объекты** в родительском компоненте — передавайте объект целиком

## 📊 Резюме

| Концепция | Когда использовать |
|-----------|-------------------|
| `observer` | Всегда, когда компонент читает observable |
| `useLocalObservable` | Локальное состояние с computed внутри компонента |
| Context + `useStore` | Передача стора через дерево компонентов |
| Гранулярный observer | Оптимизация ререндеров в списках |

---

## ❌ Частые ошибки новичков

### 1. Забыли обернуть компонент в `observer`

```tsx
// ❌ Неправильно — компонент не реагирует на изменения стора
function Counter() {
  return <span>{store.count}</span>
}
```

```tsx
// ✅ Правильно — observer подписывает компонент на observable
const Counter = observer(function Counter() {
  return <span>{store.count}</span>
})
```

**Почему это ошибка:** без `observer` компонент не знает о MobX. Он отрендерится один раз с начальным значением и больше никогда не обновится, даже если `store.count` изменится сотню раз.

### 2. Деструктуризация observable вне render-функции observer

```tsx
// ❌ Неправильно — значение «заморожено» в момент деструктуризации
const Counter = observer(function Counter() {
  const { count, name } = store // примитивы теряют реактивность
  return (
    <div>
      <span>{count}</span>
      <span>{name}</span>
    </div>
  )
})
```

```tsx
// ✅ Правильно — обращаемся к store напрямую
const Counter = observer(function Counter() {
  return (
    <div>
      <span>{store.count}</span>
      <span>{store.name}</span>
    </div>
  )
})
```

**Почему это ошибка:** при деструктуризации примитивных значений (`number`, `string`, `boolean`) теряется связь с observable-свойством. MobX отслеживает обращения к свойствам объекта (`store.count`), а не переменные, в которые значение скопировано.

### 3. Создание экземпляра стора вне компонента — общее состояние между инстансами

```tsx
// ❌ Неправильно — один стор на все рендеры компонента
const formStore = new FormStore()

function FormPage() {
  // formStore общий для ВСЕХ рендеров FormPage
  // при навигации туда-обратно данные формы не сбрасываются
  return <Form store={formStore} />
}
```

```tsx
// ✅ Правильно — стор создаётся через useMemo и привязан к жизненному циклу
function FormPage() {
  const formStore = useMemo(() => new FormStore(), [])
  return <Form store={formStore} />
}

// Или через useLocalObservable
const FormPage = observer(function FormPage() {
  const formStore = useLocalObservable(() => new FormStore())
  return <Form store={formStore} />
})
```

**Почему это ошибка:** глобальный экземпляр стора разделяется между всеми использованиями компонента. При навигации данные не сбрасываются, а в тестах — протекают между тест-кейсами.

### 4. `useLocalObservable` с внешними зависимостями, которые не observable

```tsx
// ❌ Неправильно — props.initialCount не отслеживается MobX
const Counter = observer(function Counter({ initialCount }) {
  const state = useLocalObservable(() => ({
    count: initialCount, // значение зафиксировано при создании!
    increment() { state.count++ },
  }))
  return <span>{state.count}</span>
})
```

```tsx
// ✅ Правильно — используйте useEffect для синхронизации с пропсами
const Counter = observer(function Counter({ initialCount }) {
  const state = useLocalObservable(() => ({
    count: initialCount,
    setCount(v: number) { state.count = v },
    increment() { state.count++ },
  }))

  useEffect(() => {
    state.setCount(initialCount)
  }, [initialCount])

  return <span>{state.count}</span>
})
```

**Почему это ошибка:** `useLocalObservable` создаёт стор один раз при маунте. Если `initialCount` изменится в пропсах, стор об этом не узнает — значение уже скопировано. Нужно явно синхронизировать через `useEffect`.

---

## 📚 Дополнительные ресурсы

- [React Integration](https://mobx.js.org/react-integration.html)
- [observer HOC](https://mobx.js.org/react-integration.html#observer-component)
- [useLocalObservable](https://mobx.js.org/react-integration.html#uselocalobservable-hook)
- [React Optimizations](https://mobx.js.org/react-optimizations.html)
