# Уровень 2: Actions

## 🎯 Что такое Action?

Action — это любая часть кода, которая изменяет состояние (state). В MobX actions помечают методы, которые модифицируют observable. Это помогает структурировать код и оптимизировать производительность.

## 🔒 enforceActions

По умолчанию MobX разрешает менять observable откуда угодно. Но на практике лучше включить строгий режим:

```ts
import { configure } from 'mobx'

configure({ enforceActions: 'always' })
```

Теперь любая попытка изменить observable вне action вызовет ошибку. Это делает поток данных предсказуемым: состояние может меняться только через явные actions.

Варианты `enforceActions`:
- `'never'` — без ограничений (по умолчанию)
- `'observed'` — требует action только для observable, которые используются в реакциях
- `'always'` — требует action для любых изменений observable

## ⚡ action в makeAutoObservable

При использовании `makeAutoObservable` все методы класса автоматически помечаются как `action`:

```ts
class Store {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {  // автоматически action
    this.count += 1
  }
}
```

## 🔄 runInAction

После `await` контекст action теряется. Код после `await` выполняется в другом «тике» event loop, и MobX уже не считает его частью action.

Решение — `runInAction`:

```ts
import { runInAction } from 'mobx'

class Store {
  data = null
  loading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchData() {
    this.loading = true  // ✅ внутри action (метод класса)

    const result = await api.getData()

    // ❌ this.data = result — ошибка при enforceActions: 'always'

    runInAction(() => {
      this.data = result   // ✅ обёрнуто в runInAction
      this.loading = false
    })
  }
}
```

`runInAction` — это одноразовый action без имени. Используйте его для обновления состояния после асинхронных операций.

## 🔗 action.bound и autoBind

Когда метод передаётся как callback, `this` теряется:

```ts
const store = new Store()
setTimeout(store.tick, 1000) // ❌ this === undefined
```

### Решение 1: action.bound

```ts
class Store {
  value = 0

  constructor() {
    makeObservable(this, {
      value: observable,
      increment: action.bound, // привязка this
    })
  }

  increment() {
    this.value += 1
  }
}
```

### Решение 2: autoBind

```ts
class Store {
  value = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  increment() {  // this привязан автоматически
    this.value += 1
  }
}

const store = new Store()
setTimeout(store.increment, 1000)  // ✅ this работает
```

## 📦 Батчинг (Batching)

Внутри одного action все изменения observable батчатся — компоненты перерисовываются только один раз после завершения action:

```ts
class Store {
  firstName = ''
  lastName = ''
  age = 0

  constructor() {
    makeAutoObservable(this)
  }

  // Три мутации, но один ререндер
  updateAll(first: string, last: string, age: number) {
    this.firstName = first
    this.lastName = last
    this.age = age
  }
}
```

Без action каждая мутация вызвала бы отдельный ререндер. С action — только один ререндер после выхода из метода.

Это одно из ключевых преимуществ actions: они автоматически группируют изменения.

## 📊 Резюме

| Концепция | Описание |
|-----------|----------|
| `action` | Метод, изменяющий observable state |
| `enforceActions` | Строгий режим: мутации только через action |
| `runInAction` | Одноразовый action для кода после await |
| `action.bound` | Привязка this для использования в callback |
| `autoBind: true` | Автоматическая привязка this для всех actions |
| Батчинг | Все мутации в action = один ререндер |

---

## ❌ Частые ошибки новичков

### 1. Изменение state вне action при `enforceActions: 'always'`

```ts
// ❌ Неправильно — мутация вне action
configure({ enforceActions: 'always' })

class Store {
  count = 0
  constructor() { makeAutoObservable(this) }
}

const store = new Store()
store.count = 5 // 💥 MobX выбросит ошибку!
```

```ts
// ✅ Правильно — мутация внутри action
import { runInAction } from 'mobx'

runInAction(() => {
  store.count = 5
})

// Или лучше — через метод стора
store.setCount(5)
```

**Почему это ошибка:** при `enforceActions: 'always'` MobX запрещает изменять observable-свойства вне action. Это сделано намеренно, чтобы все изменения были предсказуемыми и отслеживаемыми.

### 2. Забыли `runInAction` после `await`

```ts
// ❌ Неправильно — код после await уже не внутри action
class Store {
  data = null
  loading = false

  constructor() { makeAutoObservable(this) }

  async fetchData() {
    this.loading = true
    const result = await api.getData()
    this.data = result     // 💥 ошибка при enforceActions: 'always'
    this.loading = false   // 💥 тоже ошибка
  }
}
```

```ts
// ✅ Правильно — обернуть в runInAction
class Store {
  data = null
  loading = false

  constructor() { makeAutoObservable(this) }

  async fetchData() {
    this.loading = true
    const result = await api.getData()
    runInAction(() => {
      this.data = result
      this.loading = false
    })
  }
}
```

**Почему это ошибка:** после `await` выполнение продолжается в другом тике event loop. MobX уже не считает этот код частью оригинального action. Всегда оборачивайте пост-`await` мутации в `runInAction`.

### 3. Стрелочные функции vs методы и потеря `this`

```ts
// ❌ Неправильно — передача метода как callback теряет this
class Store {
  count = 0
  constructor() { makeAutoObservable(this) }

  increment() {
    this.count++
  }
}

const store = new Store()
button.addEventListener('click', store.increment) // this === undefined!
```

```ts
// ✅ Правильно — используйте autoBind
class Store {
  count = 0

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }

  increment() {
    this.count++
  }
}

const store = new Store()
button.addEventListener('click', store.increment) // ✅ this привязан
```

**Почему это ошибка:** когда метод передаётся как callback, контекст `this` теряется. Используйте `autoBind: true` в `makeAutoObservable` или `action.bound` в `makeObservable` для автоматической привязки.

### 4. Несколько мутаций вне action — лишние ререндеры

```ts
// ❌ Неправильно — каждая мутация вызывает отдельный ререндер
function updateProfile(store, data) {
  store.firstName = data.firstName  // ререндер 1
  store.lastName = data.lastName    // ререндер 2
  store.age = data.age              // ререндер 3
}
```

```ts
// ✅ Правильно — один action = один ререндер
class ProfileStore {
  firstName = ''
  lastName = ''
  age = 0

  constructor() { makeAutoObservable(this) }

  updateAll(data) {
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.age = data.age
    // Один ререндер после выхода из action
  }
}
```

**Почему это ошибка:** без action каждое изменение observable вызывает отдельное уведомление подписчиков. Action автоматически батчит все изменения, и ререндер происходит только один раз после завершения метода.

---

## 📚 Дополнительные ресурсы

- [Actions](https://mobx.js.org/actions.html)
- [Asynchronous Actions](https://mobx.js.org/actions.html#asynchronous-actions)
- [runInAction API](https://mobx.js.org/api.html#runinaction)
- [configure: enforceActions](https://mobx.js.org/configuration.html#enforceactions)
