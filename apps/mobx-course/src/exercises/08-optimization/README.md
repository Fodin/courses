# Уровень 8: Оптимизация — Гранулярный Observer, intercept, observe

## 📚 Введение

В предыдущих уровнях вы изучили основы MobX: observable, action, computed, reaction и паттерны организации сторов. Теперь пришло время перейти к **оптимизации производительности** — техникам, которые отличают учебные примеры от production-приложений.

В этом уровне вы научитесь:

- Оптимизировать рендеринг больших списков с помощью **гранулярного observer**
- Перехватывать изменения **до** их применения с `intercept`
- Наблюдать за изменениями **после** их применения с `observe`

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

## ⚠️ Частые ошибки новичков

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

## 📚 Дополнительные ресурсы

- [MobX — Optimizing React component rendering](https://mobx.js.org/react-optimizations.html)
- [MobX — intercept & observe](https://mobx.js.org/intercept-and-observe.html)
