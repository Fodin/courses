# Уровень 0: Setup — Первый стор MobX

## 👋 Введение в MobX

Добро пожаловать в курс по **MobX**! Это библиотека для управления состоянием в JavaScript-приложениях, основанная на принципе **реактивного программирования**. MobX автоматически отслеживает зависимости и обновляет только то, что изменилось.

### Почему MobX?

| Подход              | Бойлерплейт | Ререндеры    | Ментальная модель       |
| ------------------- | ----------- | ------------ | ----------------------- |
| **MobX**            | Минимум     | Гранулярные  | ООП, мутации            |
| Redux Toolkit       | Средний     | Ручные       | Функциональный, иммутабельный |
| Zustand             | Минимум     | Ручные       | Функциональный          |
| React Context       | Минимум     | Все подписчики | Встроенный              |

**Преимущества MobX:**

1. **Минимум бойлерплейта** — не нужно писать редьюсеры, экшен-типы, селекторы
2. **Автоматическое отслеживание** — MobX знает, какие компоненты от каких данных зависят
3. **Гранулярные ререндеры** — обновляется только тот компонент, чьи данные изменились
4. **Мутабельный стиль** — пишете `store.count++` вместо `return { ...state, count: state.count + 1 }`
5. **TypeScript из коробки** — классы и декораторы отлично типизируются

---

## 🏛️ Три столпа MobX

MobX строится на трёх ключевых концепциях:

```
Actions → Observable State → Computed → Side Effects (Reactions)
```

### 1. Observable State (наблюдаемое состояние)

Это данные вашего приложения. MobX отслеживает их изменения:

```ts
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0 // observable

  constructor() {
    makeAutoObservable(this)
  }
}
```

### 2. Actions (действия)

Функции, которые изменяют состояние:

```ts
class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {  // action
    this.count++
  }

  decrement() {  // action
    this.count--
  }
}
```

### 3. Derivations (производные)

**Computed values** — значения, вычисляемые из состояния:

```ts
class CartStore {
  items = []

  constructor() {
    makeAutoObservable(this)
  }

  get totalPrice() {  // computed
    return this.items.reduce((sum, item) => sum + item.price, 0)
  }
}
```

**Reactions** — побочные эффекты при изменении состояния (ререндер React-компонента, запись в localStorage, запрос на сервер).

---

## ⚡ makeAutoObservable

Это самый простой способ сделать класс наблюдаемым. `makeAutoObservable` автоматически определяет:

- **Свойства** → `observable`
- **Геттеры** → `computed`
- **Методы** → `action`
- **Генераторы** → `flow`

```ts
import { makeAutoObservable } from 'mobx'

class TodoStore {
  todos = []
  filter = 'all'

  constructor() {
    makeAutoObservable(this)
    //                 ^^^^
    // Все свойства станут observable,
    // все методы — action,
    // все геттеры — computed
  }

  addTodo(title) {      // action (автоматически)
    this.todos.push({ title, done: false })
  }

  get activeTodos() {   // computed (автоматически)
    return this.todos.filter(t => !t.done)
  }
}
```

---

## 🔗 Подключение к React: observer

Чтобы React-компонент реагировал на изменения MobX-стора, оберните его в `observer` из `mobx-react-lite`:

```tsx
import { observer } from 'mobx-react-lite'

const counterStore = new CounterStore()

const Counter = observer(function Counter() {
  return (
    <div>
      <p>Count: {counterStore.count}</p>
      <button onClick={() => counterStore.increment()}>+1</button>
    </div>
  )
})
```

**Важно:** без `observer` компонент не будет ререндериться при изменении стора!

### Как это работает?

1. `observer` оборачивает компонент и отслеживает, какие observable-свойства были прочитаны во время рендера
2. Когда любое из этих свойств изменяется, компонент автоматически ререндерится
3. Если свойство не было прочитано при рендере, его изменение не вызовет ререндер

---

## 🛠️ Создание стора: пошаговое руководство

### Шаг 1: Определите класс с состоянием

```ts
class CounterStore {
  count = 0
}
```

### Шаг 2: Добавьте `makeAutoObservable` в конструктор

```ts
import { makeAutoObservable } from 'mobx'

class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }
}
```

### Шаг 3: Добавьте методы для изменения состояния

```ts
class CounterStore {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.count++
  }

  decrement() {
    this.count--
  }
}
```

### Шаг 4: Создайте экземпляр и используйте

```ts
const store = new CounterStore()
store.increment()
console.log(store.count) // 1
```

---

## ❌ Частые ошибки новичков

### ❌ Ошибка 1: Забыли вызвать makeAutoObservable

```ts
// ❌ Неправильно — MobX ничего не знает об этом классе
class Store {
  count = 0
  increment() { this.count++ }
}

// ✅ Правильно — вызываем makeAutoObservable в конструкторе
class Store {
  count = 0
  constructor() {
    makeAutoObservable(this)
  }
  increment() { this.count++ }
}
```

**Почему это ошибка:** Без `makeAutoObservable` свойства класса — обычные поля. MobX не отслеживает их изменения, и observer-компоненты не будут ререндериться.

---

### ❌ Ошибка 2: Забыли обернуть компонент в observer

```tsx
// ❌ Неправильно — компонент НЕ будет обновляться
function Counter() {
  return <p>{store.count}</p>
}

// ✅ Правильно — observer подписывает компонент на изменения
const Counter = observer(function Counter() {
  return <p>{store.count}</p>
})
```

**Почему это ошибка:** Без `observer` React не знает, что компонент зависит от observable-данных. Значения отрисуются один раз и больше не обновятся.

---

### ❌ Ошибка 3: Деструктуризация observable-объекта

```tsx
// ❌ Неправильно — значение «заморожено» в момент деструктуризации
const { count } = store
return <p>{count}</p> // НЕ реактивно!

// ✅ Правильно — читать свойство через точку внутри observer
return <p>{store.count}</p> // Реактивно
```

**Почему это ошибка:** Деструктуризация копирует примитивное значение в локальную переменную. MobX отслеживает **обращения к свойствам объекта**, а не локальные переменные.

---

## 📚 Дополнительные ресурсы

- [Официальная документация MobX](https://mobx.js.org/)
- [MobX + React: быстрый старт](https://mobx.js.org/react-integration.html)
- [makeAutoObservable API](https://mobx.js.org/observable-state.html#makeautoobservable)

---

## 🚀 Что дальше?

В следующем уровне вы изучите:

- Разницу между `makeAutoObservable` и `makeObservable`
- Явные аннотации: `observable`, `action`, `computed`
- Типы observable: массивы, Map, Set
- Модификаторы: `observable.ref`, `observable.shallow`
