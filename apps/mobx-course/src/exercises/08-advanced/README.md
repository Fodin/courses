# Уровень 8: Продвинутые техники — Оптимизация, Перехват, Сериализация, Тестирование

## 📚 Введение

В предыдущих уровнях вы изучили основы MobX: observable, action, computed, reaction и паттерны организации сторов. Теперь пришло время перейти к **продвинутым техникам**, которые отличают учебные примеры от production-приложений.

В этом уровне вы научитесь:

- Оптимизировать рендеринг больших списков с помощью **гранулярного observer**
- Перехватывать изменения **до** их применения с `intercept`
- Наблюдать за изменениями **после** их применения с `observe`
- Сериализовать и восстанавливать состояние сторов
- Тестировать MobX-сторы как обычные классы
- Комбинировать все концепции в финальном проекте

---

## ⚡ Часть 1: Гранулярный Observer — оптимизация рендеринга

### Проблема: весь список ререндерится

Когда вы оборачиваете компонент списка в `observer`, **любое** изменение любого элемента вызовет ререндер **всего** списка:

```tsx
// Весь список ререндерится при изменении одного элемента
const ItemList = observer(function ItemList() {
  return (
    <ul>
      {store.items.map(item => (
        <li key={item.id}>
          {item.name}: {item.value}
          <button onClick={() => store.increment(item.id)}>+1</button>
        </li>
      ))}
    </ul>
  )
})
```

При 100 элементах — это 100 ненужных ререндеров при клике на одну кнопку.

### Решение: выносим элемент в отдельный observer-компонент

```tsx
const Item = observer(function Item({ item }: { item: ItemType }) {
  return (
    <li>
      {item.name}: {item.value}
      <button onClick={() => store.increment(item.id)}>+1</button>
    </li>
  )
})

const ItemList = observer(function ItemList() {
  return (
    <ul>
      {store.items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </ul>
  )
})
```

Теперь при клике на кнопку ререндерится **только** один `Item`, а не весь список. Родительский `ItemList` ререндерится только при добавлении/удалении элементов.

### Как отследить ререндеры

Используйте `useRef` для подсчёта рендеров:

```tsx
const Item = observer(function Item({ item }: { item: ItemType }) {
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <li>
      {item.name} (renders: {renderCount.current})
    </li>
  )
})
```

---

## 🔍 Часть 2: intercept — перехват изменений до применения

### Что такое intercept

`intercept` позволяет перехватить изменение observable-свойства **до** того, как оно будет применено. Можно:

- **Модифицировать** значение (например, нормализовать)
- **Заблокировать** изменение (вернуть `null`)
- **Пропустить** без изменений (вернуть `change`)

### Синтаксис

```tsx
import { intercept } from 'mobx'

const disposer = intercept(target, propertyName, handler)
```

### Пример: валидация возраста

```tsx
class AgeStore {
  age = 25

  constructor() {
    makeAutoObservable(this)

    intercept(this, 'age', change => {
      if (change.type !== 'update') return change
      const newVal = change.newValue as number

      // Блокируем значения вне диапазона
      if (newVal < 0 || newVal > 150) {
        console.log(`Blocked: ${newVal} is out of range`)
        return null // null = отменить изменение
      }

      return change // пропустить изменение
    })
  }

  setAge(value: number) {
    this.age = value
  }
}
```

### Пример: нормализация строки

```tsx
intercept(store, 'email', change => {
  if (change.type === 'update') {
    change.newValue = (change.newValue as string).trim().toLowerCase()
  }
  return change
})
```

### Важно: intercept возвращает disposer

```tsx
const stop = intercept(store, 'age', handler)

// Позже, когда перехват больше не нужен:
stop()
```

---

## 🔍 Часть 3: observe — наблюдение за изменениями после применения

### Что такое observe

`observe` срабатывает **после** того, как значение изменилось. Используется для:

- Логирования изменений
- Аудита
- Отправки аналитики
- Синхронизации с внешними системами

### Синтаксис

```tsx
import { observe } from 'mobx'

const disposer = observe(target, propertyName, handler)
```

### Пример: логирование

```tsx
observe(store, 'age', change => {
  console.log(`age: ${change.oldValue} -> ${change.newValue}`)
})
```

### Разница: observe vs reaction/autorun

`observe` работает **синхронно** — callback вызывается сразу после изменения, без батчинга и планирования. Это делает `observe` подходящим для аудита, но не для побочных эффектов, которые сами меняют observable.

---

## ⚖️ Сравнение: intercept vs observe

| Характеристика | `intercept` | `observe` |
|---|---|---|
| Когда срабатывает | **До** применения изменения | **После** применения изменения |
| Может отменить изменение | Да (вернуть `null`) | Нет |
| Может модифицировать значение | Да | Нет |
| Доступ к старому значению | Нет | Да (`change.oldValue`) |
| Типичное применение | Валидация, нормализация | Логирование, аудит |
| Синхронный | Да | Да |
| Работает с батчингом | Нет (до батча) | Нет (после каждого изменения) |

---

## 💾 Часть 4: Сериализация — toJSON / hydrate

### Зачем нужна сериализация

MobX-сторы — это классы с internal-состоянием. Чтобы сохранить состояние в localStorage, отправить на сервер или восстановить при загрузке — нужна сериализация.

### Паттерн toJSON + hydrate

```tsx
class SettingsStore {
  theme: 'light' | 'dark' = 'light'
  fontSize = 16
  language = 'en'

  constructor() {
    makeAutoObservable(this)
  }

  // Сериализация: стор -> plain object
  toJSON() {
    return {
      theme: this.theme,
      fontSize: this.fontSize,
      language: this.language,
    }
  }

  // Гидратация: plain object -> стор
  hydrate(data: Partial<ReturnType<typeof this.toJSON>>) {
    if (data.theme) this.theme = data.theme
    if (data.fontSize) this.fontSize = data.fontSize
    if (data.language) this.language = data.language
  }
}
```

### Автосохранение через autorun

```tsx
const STORAGE_KEY = 'app-settings'

const store = new SettingsStore()

// Загрузка при старте
const saved = localStorage.getItem(STORAGE_KEY)
if (saved) {
  try {
    store.hydrate(JSON.parse(saved))
  } catch {
    /* ignore corrupted data */
  }
}

// Автосохранение при каждом изменении
autorun(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store.toJSON()))
})
```

`autorun` автоматически отслеживает все observable, использованные в `toJSON()`, и сохраняет при любом изменении.

### Безопасная гидратация

Всегда оборачивайте `JSON.parse` в `try/catch` — данные в localStorage могут быть повреждены:

```tsx
hydrate(storageKey: string) {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return

  try {
    const data = JSON.parse(raw)
    runInAction(() => {
      if (data.theme) this.theme = data.theme
      if (typeof data.fontSize === 'number') this.fontSize = data.fontSize
    })
  } catch {
    // Повреждённые данные — игнорируем
  }
}
```

---

## 🧪 Часть 5: Тестирование MobX-сторов

### Главное преимущество: сторы — обычные классы

MobX-сторы не зависят от React. Их можно тестировать как обычные JavaScript-классы без рендеринга компонентов.

```tsx
// Стор
class CartStore {
  items: { name: string; price: number; qty: number }[] = []

  constructor() {
    makeAutoObservable(this)
  }

  addItem(name: string, price: number) {
    this.items.push({ name, price, qty: 1 })
  }

  get totalPrice() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  }

  clear() {
    this.items = []
  }
}

// Тесты
test('starts empty', () => {
  const store = new CartStore()
  expect(store.items.length).toBe(0)
  expect(store.totalPrice).toBe(0)
})

test('adds item and calculates total', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  store.addItem('Gadget', 20)
  expect(store.totalPrice).toBe(30)
})

test('clear removes all items', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  store.clear()
  expect(store.items.length).toBe(0)
  expect(store.totalPrice).toBe(0)
})
```

### Что тестировать

1. **Actions** — вызываете метод, проверяете состояние
2. **Computed** — создаёте состояние, проверяете вычисленное значение
3. **Реакции** — `autorun` / `reaction` с mock-функцией
4. **Граничные случаи** — пустой стор, дубликаты, невалидные данные

### Тестирование реакций

```tsx
test('autorun tracks changes', () => {
  const store = new CartStore()
  const totals: number[] = []

  autorun(() => {
    totals.push(store.totalPrice)
  })

  store.addItem('A', 10)
  store.addItem('B', 20)

  expect(totals).toEqual([0, 10, 30])
})
```

---

## 🎯 Часть 6: Комплексный паттерн — Kanban Board

Канбан-доска — отличный пример, объединяющий все концепции MobX:

- **observable** — колонки и карточки
- **action** — addCard, removeCard, moveCard
- **computed** — totalCards
- **observer** — гранулярный рендеринг каждой колонки

```tsx
interface Card {
  id: string
  title: string
}

interface Column {
  id: string
  title: string
  cards: Card[]
}

class KanbanStore {
  columns: Column[] = [
    { id: 'todo', title: 'Todo', cards: [] },
    { id: 'progress', title: 'In Progress', cards: [] },
    { id: 'done', title: 'Done', cards: [] },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  addCard(columnId: string, title: string) {
    const col = this.columns.find(c => c.id === columnId)
    if (col) col.cards.push({ id: crypto.randomUUID(), title })
  }

  removeCard(columnId: string, cardId: string) {
    const col = this.columns.find(c => c.id === columnId)
    if (col) col.cards = col.cards.filter(c => c.id !== cardId)
  }

  moveCard(cardId: string, fromColId: string, toColId: string) {
    const from = this.columns.find(c => c.id === fromColId)
    const to = this.columns.find(c => c.id === toColId)
    if (!from || !to) return

    const idx = from.cards.findIndex(c => c.id === cardId)
    if (idx === -1) return

    const [card] = from.cards.splice(idx, 1)
    to.cards.push(card)
  }

  get totalCards() {
    return this.columns.reduce((sum, col) => sum + col.cards.length, 0)
  }
}
```

Каждая колонка — отдельный observer-компонент, что обеспечивает гранулярный рендеринг.

---

## ❌ Частые ошибки новичков

### ❌ Ошибка 1: Рендеринг списка без гранулярного observer

```tsx
// ❌ Неправильно — весь список ререндерится при изменении одного элемента
const List = observer(function List() {
  return (
    <ul>
      {store.items.map(item => (
        <li key={item.id}>
          {item.name}: {item.value}
        </li>
      ))}
    </ul>
  )
})

// ✅ Правильно — каждый элемент в отдельном observer
const ListItem = observer(function ListItem({ item }: { item: Item }) {
  return (
    <li>
      {item.name}: {item.value}
    </li>
  )
})

const List = observer(function List() {
  return (
    <ul>
      {store.items.map(item => (
        <ListItem key={item.id} item={item} />
      ))}
    </ul>
  )
})
```

**Почему это ошибка:** Без гранулярного observer MobX не может отследить, какой именно элемент изменился, и ререндерит весь компонент списка. При 100+ элементах это серьёзная проблема производительности.

---

### ❌ Ошибка 2: Мутация состояния внутри intercept

```tsx
// ❌ Неправильно — изменение observable внутри intercept
intercept(store, 'age', change => {
  store.log.push('changed!') // мутация другого observable!
  return change
})

// ✅ Правильно — intercept только валидирует/модифицирует change
intercept(store, 'age', change => {
  if (change.newValue < 0) return null
  return change
})

// Для логирования используйте observe
observe(store, 'age', change => {
  store.log.push(`${change.oldValue} -> ${change.newValue}`)
})
```

**Почему это ошибка:** `intercept` вызывается **до** применения изменения. Мутация других observable внутри `intercept` может привести к непредсказуемому порядку обновлений и бесконечным циклам.

---

### ❌ Ошибка 3: Забыт try/catch при гидратации из localStorage

```tsx
// ❌ Неправильно — приложение падает при повреждённых данных
hydrate() {
  const raw = localStorage.getItem('settings')
  const data = JSON.parse(raw!) // crash если данные повреждены
  this.theme = data.theme
}

// ✅ Правильно — безопасная гидратация
hydrate() {
  const raw = localStorage.getItem('settings')
  if (!raw) return
  try {
    const data = JSON.parse(raw)
    runInAction(() => {
      if (data.theme) this.theme = data.theme
    })
  } catch {
    // Повреждённые данные — игнорируем
  }
}
```

**Почему это ошибка:** Данные в localStorage могут быть повреждены, удалены или иметь устаревший формат. Без `try/catch` приложение упадёт при загрузке.

---

### ❌ Ошибка 4: toJSON включает computed-свойства

```tsx
// ❌ Неправильно — сохраняем computed, которое вычисляется автоматически
toJSON() {
  return {
    items: this.items,
    totalPrice: this.totalPrice, // это computed!
  }
}

// ✅ Правильно — сохраняем только source-данные
toJSON() {
  return {
    items: this.items,
  }
}
```

**Почему это ошибка:** Computed-свойства вычисляются из других observable автоматически. Сохранять их — это дублирование данных, которое может привести к рассинхронизации при гидратации.

---

### ❌ Ошибка 5: Тестирование стора через React-компоненты

```tsx
// ❌ Неправильно — рендерим компонент для проверки логики стора
test('adds item', () => {
  render(<CartComponent />)
  fireEvent.click(screen.getByText('Add'))
  expect(screen.getByText('Total: 10')).toBeInTheDocument()
})

// ✅ Правильно — тестируем стор напрямую
test('adds item', () => {
  const store = new CartStore()
  store.addItem('Widget', 10)
  expect(store.totalPrice).toBe(10)
})
```

**Почему это ошибка:** MobX-сторы — это обычные классы. Тестирование через рендер React-компонентов медленнее, сложнее и тестирует не только стор, но и компонент, MobX-React интеграцию и DOM.

---

## 📚 Дополнительные ресурсы

- [MobX — Optimizing React component rendering](https://mobx.js.org/react-optimizations.html)
- [MobX — intercept & observe](https://mobx.js.org/intercept-and-observe.html)
- [MobX — Defining data stores](https://mobx.js.org/defining-data-stores.html)
- [MobX — Custom reactions (autorun, reaction, when)](https://mobx.js.org/reactions.html)
- [MobX Best Practices](https://mobx.js.org/the-gist-of-mobx.html)
