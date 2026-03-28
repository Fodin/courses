# Уровень 9: Интеграция — Сериализация, Тестирование, Финальный проект

## 📚 Введение

Вы изучили основы MobX и техники оптимизации. Теперь пришло время научиться **интегрировать MobX в реальные приложения**: сохранять состояние между сессиями, тестировать сторы и комбинировать все концепции в полноценном проекте.

В этом уровне вы научитесь:

- Сериализовать и восстанавливать состояние сторов (toJSON / hydrate)
- Тестировать MobX-сторы как обычные классы
- Комбинировать все концепции в финальном проекте — канбан-доске

---

## 💾 Часть 1: Сериализация — toJSON / hydrate

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

## 🧪 Часть 2: Тестирование MobX-сторов

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

## 🎯 Часть 3: Комплексный паттерн — Kanban Board

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

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Забыт try/catch при гидратации из localStorage

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

### ❌ Ошибка 2: toJSON включает computed-свойства

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

### ❌ Ошибка 3: Тестирование стора через React-компоненты

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

- [MobX — Defining data stores](https://mobx.js.org/defining-data-stores.html)
- [MobX — Custom reactions (autorun, reaction, when)](https://mobx.js.org/reactions.html)
- [MobX Best Practices](https://mobx.js.org/the-gist-of-mobx.html)
