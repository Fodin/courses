# Уровень 3: Computed — Вычисляемые значения

## 🤔 Проблема

Представьте корзину покупок. У каждого товара есть цена и количество. Когда пользователь меняет количество, нужно пересчитать итоговую сумму. Можно хранить сумму в отдельном поле и обновлять вручную — но это ненадёжно и чревато рассинхронизацией. Нужен механизм, который **автоматически** вычисляет производные данные.

## 📐 Что такое computed?

`computed` — это значение, которое **автоматически вычисляется** из других observable-значений. Это как формула в Excel: ячейка `C1 = A1 + B1` автоматически обновляется, когда меняется `A1` или `B1`.

```tsx
import { makeAutoObservable } from 'mobx'

class CartStore {
  items = [
    { name: 'Book', price: 10, qty: 2 },
    { name: 'Pen', price: 3, qty: 5 },
  ]

  constructor() {
    makeAutoObservable(this)
  }

  // Это computed — автоматически пересчитывается
  get totalPrice() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.qty, 0
    )
  }
}
```

MobX автоматически распознаёт геттеры (`get`) как `computed`, когда вы используете `makeAutoObservable`.

---

## ⚙️ Как это работает внутри

1. При первом обращении к `totalPrice` MobX **выполняет** геттер и **запоминает**, от каких observable он зависит (`this.items`, каждый `item.price`, каждый `item.qty`)
2. Результат **кешируется** — повторные обращения возвращают кешированное значение без пересчёта
3. Когда одно из зависимых observable изменяется, computed **помечается как устаревший**
4. При следующем обращении к computed он **пересчитывается**

```
items[0].qty = 3     // observable изменился
                      // computed помечен как "dirty"
console.log(totalPrice)  // пересчёт происходит ЗДЕСЬ
console.log(totalPrice)  // кеш — пересчёт НЕ происходит
```

Ключевой принцип: **computed пересчитывается лениво** — только когда к нему обращаются. Если никто не читает `totalPrice`, пересчёта не будет, даже если `items` изменились.

---

## 🔗 Цепочки computed

Computed-значения могут зависеть друг от друга, образуя цепочку:

```tsx
class InvoiceStore {
  items = [{ price: 100, qty: 2 }]
  taxRate = 0.2

  constructor() {
    makeAutoObservable(this)
  }

  get subtotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.qty, 0
    )
  }

  get tax() {
    return this.subtotal * this.taxRate  // зависит от subtotal
  }

  get total() {
    return this.subtotal + this.tax  // зависит от subtotal и tax
  }
}
```

Если изменится `taxRate`, пересчитаются `tax` и `total`, но **не** `subtotal` — он не зависит от `taxRate`.

---

## 💾 Кеширование computed

Одна из главных фишек computed — **кеширование**. Пока зависимости не изменились, вычисление не повторяется.

```tsx
class Store {
  data = [/* 10 000 элементов */]
  filter = ''

  constructor() {
    makeAutoObservable(this)
  }

  get filteredData() {
    console.log('Recalculating!') // логируем пересчёт
    return this.data
      .filter(item => item.name.includes(this.filter))
      .sort((a, b) => a.name.localeCompare(b.name))
  }
}

const store = new Store()
store.filteredData // "Recalculating!" — первый вызов
store.filteredData // тишина — возвращается кеш
store.filteredData // тишина — возвращается кеш
store.filter = 'new' // зависимость изменилась
store.filteredData // "Recalculating!" — пересчёт
```

Это критично для производительности: тяжёлые операции (фильтрация, сортировка, агрегация) выполняются **только когда данные действительно изменились**.

---

## ⚠️ Ловушка: computed возвращает объект

Когда computed возвращает новый объект, даже если все поля совпадают, MobX считает, что значение изменилось (новая ссылка !== старая ссылка):

```tsx
get viewport() {
  // Каждый вызов — НОВЫЙ объект, даже если width/height те же
  return { width: this.screenWidth, height: this.screenHeight }
}
```

Это приводит к лишним ререндерам в observer-компонентах.

### Решение: `comparer.structural`

```tsx
import { makeAutoObservable, computed, comparer } from 'mobx'

class LayoutStore {
  screenWidth = 1024
  screenHeight = 768

  constructor() {
    makeAutoObservable(this, {
      viewport: computed({ equals: comparer.structural }),
    })
  }

  get viewport() {
    return { width: this.screenWidth, height: this.screenHeight }
  }
}
```

Теперь MobX сравнивает результат **по содержимому**, а не по ссылке. Если `width` и `height` не изменились — computed не уведомляет подписчиков.

### Встроенные comparers

| Comparer | Описание |
|---|---|
| `comparer.default` | `===` (строгое равенство, по умолчанию) |
| `comparer.structural` | Глубокое сравнение по значению |
| `comparer.shallow` | Поверхностное сравнение (первый уровень) |
| Кастомная функция | `(a, b) => boolean` — ваша логика |

---

## keepAlive

По умолчанию, когда computed не наблюдается ни одним observer/reaction, его кеш **сбрасывается**. При следующем обращении вычисление произойдёт заново.

Если computed дорогой и вы хотите сохранить кеш даже без подписчиков:

```tsx
import { makeAutoObservable, computed } from 'mobx'

class Store {
  constructor() {
    makeAutoObservable(this, {
      expensiveResult: computed({ keepAlive: true }),
    })
  }

  get expensiveResult() {
    // тяжёлые вычисления...
  }
}
```

**Внимание:** `keepAlive: true` может привести к утечкам памяти, если стор живёт долго, а computed держит ссылки на большие структуры данных.

---

## ❌ Частые ошибки новичков

### ❌ Ошибка 1: Побочные эффекты в computed

```tsx
// ❌ Неправильно — computed должен быть чистой функцией
get total() {
  localStorage.setItem('lastTotal', String(this.subtotal))
  return this.subtotal + this.tax
}

// ✅ Правильно — побочные эффекты в reaction
autorun(() => {
  localStorage.setItem('lastTotal', String(store.total))
})
```

**Почему это ошибка:** Computed может пересчитываться в непредсказуемые моменты. Побочные эффекты в нём приводят к трудноотлавливаемым багам. Для побочных эффектов используйте `autorun`, `reaction` или `when`.

---

### ❌ Ошибка 2: Computed без observer

```tsx
// ❌ Неправильно — компонент НЕ обновляется
function Cart() {
  return <div>Total: {store.totalPrice}</div>
}

// ✅ Правильно — observer подписывает компонент на computed
const Cart = observer(function Cart() {
  return <div>Total: {store.totalPrice}</div>
})
```

**Почему это ошибка:** Без `observer` React не знает о зависимости от computed-значения. Данные отрисуются один раз и не обновятся при изменении.

---

### ❌ Ошибка 3: Деструктуризация computed вне observer

```tsx
// ❌ Неправильно — значение «заморожено» в момент деструктуризации
const { total } = store  // total = 100 (примитив, не отслеживается)

// ✅ Правильно — обращаться к computed внутри observer
const Cart = observer(() => <div>{store.total}</div>)
```

**Почему это ошибка:** Деструктуризация копирует текущее значение в локальную переменную. MobX не может отследить обращение к локальной переменной — только к свойствам наблюдаемого объекта.

---

## ✅ Best Practices

1. **Используйте computed для любых производных данных** — не храните то, что можно вычислить
2. **Делайте computed чистыми функциями** — никаких побочных эффектов
3. **Используйте `comparer.structural`** для computed, возвращающих объекты/массивы, если структурное равенство важно
4. **Не злоупотребляйте `keepAlive`** — используйте только для действительно дорогих вычислений

---

## 📚 Дополнительные ресурсы

- [MobX Computed](https://mobx.js.org/computeds.html)
- [MobX Computed Options](https://mobx.js.org/computeds.html#options-)
