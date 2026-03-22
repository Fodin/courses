# Уровень 7: Async — Асинхронные операции в MobX

## 📚 Введение

Асинхронные операции — загрузка данных, отправка форм, вызовы API — неотъемлемая часть любого приложения. Но в MobX с ними есть подвох: **actions синхронны по природе**, а код после `await` выполняется в другом «тике» event loop, теряя контекст action.

В этом уровне мы разберём все подходы MobX к асинхронности: от `runInAction` до `flow`-генераторов, отмену запросов, кэширование и оптимистичные обновления.

---

## ⚡ 1. Проблема: код после `await` теряет контекст action

Когда вы пишете `async`-метод в MobX-сторе, код **до** первого `await` выполняется внутри action (потому что `makeAutoObservable` пометил метод как action). Но код **после** `await` выполняется в следующем микротаске — MobX уже не считает его частью action.

```ts
class UserStore {
  users: User[] = []
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  async fetchUsers() {
    this.isLoading = true // ✅ Внутри action — работает

    const data = await api.getUsers()

    // ❌ Этот код — уже НЕ внутри action!
    // При enforceActions: 'always' будет ошибка:
    // "[MobX] Since strict-mode is enabled, changing observed
    //  observable values without using an action is not allowed"
    this.users = data
    this.isLoading = false
  }
}
```

Даже без `enforceActions: 'always'` это плохо: MobX не может батчить изменения после `await`, и каждое присваивание вызывает отдельный ререндер.

---

## 🔧 2. Решение: `runInAction`

`runInAction` — это одноразовый action без имени. Оберните в него все изменения состояния после `await`:

```ts
import { makeAutoObservable, runInAction } from 'mobx'

class UserStore {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async fetchUsers() {
    this.isLoading = true // ✅ До await — внутри action
    this.error = null

    try {
      const users = await api.getUsers()

      runInAction(() => {
        this.users = users     // ✅ Обёрнуто в runInAction
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.error = (e as Error).message
        this.isLoading = false
      })
    }
  }
}
```

### ⚠️ Важно: каждый `await` создаёт новый разрыв

Если в методе несколько `await`, нужен `runInAction` после **каждого**:

```ts
async fetchAndProcess() {
  this.isLoading = true

  const raw = await api.getRawData()

  runInAction(() => {
    this.rawData = raw
    this.status = 'processing'
  })

  const processed = await processData(raw)

  runInAction(() => {
    this.processedData = processed
    this.isLoading = false
  })
}
```

---

## 🔄 3. Альтернатива: `flow` — генераторы вместо async/await

MobX предлагает `flow` — обёртку над генератором, которая автоматически оборачивает код между `yield` в action-контекст. Не нужно вручную писать `runInAction`:

```ts
import { makeAutoObservable, flow } from 'mobx'

class UserStore {
  users: User[] = []
  isLoading = false
  error: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  // flow вместо async, yield вместо await
  fetchUsers = flow(function* (this: UserStore) {
    this.isLoading = true
    this.error = null
    try {
      this.users = yield api.getUsers() // yield вместо await
      this.isLoading = false
    } catch (e) {
      this.error = (e as Error).message
      this.isLoading = false
    }
  })
}
```

### 🔍 Как работает flow

1. `flow` принимает генератор-функцию (`function*`)
2. Каждый `yield` ждёт промис (как `await`)
3. Код между `yield` выполняется внутри action-контекста
4. `this` привязывается автоматически (arrow function в field declaration)
5. Возвращает `CancellablePromise` — промис, который можно отменить

### Типизация `this` в flow

Поскольку `flow` принимает обычную `function*`, а не arrow function, `this` нужно типизировать явно:

```ts
fetchUsers = flow(function* (this: UserStore) {
  //                          ^^^^^^^^^^^^^^^^
  //                          Явная типизация this
  this.users = yield api.getUsers()
})
```

---

## 🛑 4. Отмена flow — `promise.cancel()`

Одно из главных преимуществ `flow` перед `async/await` — возможность отмены. Вызов `flow` возвращает `CancellablePromise`:

```ts
class SlowDataStore {
  data: string | null = null
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  fetchData = flow(function* (this: SlowDataStore) {
    this.isLoading = true
    try {
      yield new Promise(resolve => setTimeout(resolve, 3000))
      this.data = 'Data loaded at ' + new Date().toLocaleTimeString()
    } finally {
      // finally выполняется и при отмене!
      this.isLoading = false
    }
  })
}
```

### Отмена в React-компоненте

```tsx
const DataLoader = observer(function DataLoader() {
  const [store] = useState(() => new SlowDataStore())

  useEffect(() => {
    const promise = store.fetchData()

    return () => {
      promise.cancel() // Отмена при размонтировании
    }
  }, [store])

  return <div>{store.isLoading ? 'Loading...' : store.data}</div>
})
```

Когда `promise.cancel()` вызван:
- Генератор прерывается
- Блок `finally` **выполняется** (можно сбросить `isLoading`)
- Промис реджектится с `FLOW_CANCELLED`
- Никаких дальнейших обновлений состояния не происходит

### Ручная отмена пользователем

```tsx
const [flowPromise, setFlowPromise] = useState<{ cancel(): void } | null>(null)

const handleStart = () => {
  const promise = store.fetchData()
  setFlowPromise(promise)
}

const handleCancel = () => {
  flowPromise?.cancel()
}
```

---

## 📦 5. Кэширование и `fetchIfNeeded`

Частый паттерн — не перезагружать данные, если они ещё свежие:

```ts
class CachedUserStore {
  users: User[] = []
  isLoading = false
  lastFetchedAt: number | null = null
  maxAge = 5000 // 5 секунд

  constructor() {
    makeAutoObservable(this)
  }

  get isStale() {
    if (!this.lastFetchedAt) return true
    return Date.now() - this.lastFetchedAt > this.maxAge
  }

  async fetchIfNeeded() {
    if (!this.isStale) {
      console.log('[cache] Data is fresh, skipping fetch')
      return
    }

    this.isLoading = true
    try {
      const users = await api.getUsers()
      runInAction(() => {
        this.users = users
        this.lastFetchedAt = Date.now()
        this.isLoading = false
      })
    } catch (e) {
      runInAction(() => {
        this.isLoading = false
      })
    }
  }

  invalidate() {
    this.lastFetchedAt = null
  }
}
```

### Ключевые элементы паттерна

| Элемент | Назначение |
|---------|-----------|
| `lastFetchedAt` | Метка времени последней загрузки |
| `maxAge` | Максимальный «возраст» кэша в миллисекундах |
| `isStale` (computed) | `true`, если данные устарели или отсутствуют |
| `fetchIfNeeded()` | Загружает только если `isStale === true` |
| `invalidate()` | Принудительно помечает данные как устаревшие |

---

## 🎯 6. Оптимистичные обновления

Оптимистичное обновление — паттерн, при котором UI обновляется **сразу**, не дожидаясь ответа сервера. Если сервер ответит ошибкой, изменение **откатывается**:

```ts
class OptimisticTodoStore {
  todos: Todo[] = [
    { id: '1', title: 'Buy groceries', completed: false },
  ]
  lastError: string | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async toggle(id: string) {
    const todo = this.todos.find(t => t.id === id)
    if (!todo) return

    // 1. Сохраняем предыдущее значение
    const prevState = todo.completed

    // 2. Оптимистично обновляем
    runInAction(() => {
      todo.completed = !todo.completed
      todo.pending = true
      this.lastError = null
    })

    try {
      // 3. Отправляем на сервер
      await api.toggleTodo(id)

      runInAction(() => {
        todo.pending = false
      })
    } catch {
      // 4. Откатываем при ошибке
      runInAction(() => {
        todo.completed = prevState
        todo.pending = false
        this.lastError = `Failed to toggle "${todo.title}" — rolled back`
      })
    }
  }
}
```

### Алгоритм оптимистичного обновления

1. **Сохранить** предыдущее состояние
2. **Применить** изменение немедленно (+ пометить как `pending`)
3. **Отправить** запрос на сервер
4. **При успехе** — снять `pending`
5. **При ошибке** — восстановить старое состояние (rollback)

---

## 📊 Сравнение: `runInAction` vs `flow`

| Критерий | `runInAction` | `flow` |
|----------|--------------|--------|
| Синтаксис | `async/await` + обёртки | `function*` + `yield` |
| Бойлерплейт | Больше (обёртка после каждого `await`) | Меньше (автоматический action-контекст) |
| Отмена | Не поддерживается из коробки | `promise.cancel()` |
| Типизация | Стандартная | Нужна явная типизация `this` |
| Привычность | Знакомый async/await | Генераторы — менее привычны |
| Вложенные промисы | Каждый `await` требует `runInAction` | Каждый `yield` автоматически обёрнут |
| Трекинг в DevTools | Видно как отдельные actions | Видно как единый flow |

### Когда что использовать

- **`runInAction`** — простые запросы с 1-2 `await`, не нужна отмена
- **`flow`** — сложные цепочки запросов, нужна отмена, хотите меньше бойлерплейта

---

## ❌ Частые ошибки новичков

### ❌ Ошибка 1: Забыли `runInAction` после `await`

```ts
// ❌ Неправильно — изменение состояния вне action
async fetchUsers() {
  this.isLoading = true
  const users = await api.getUsers()
  this.users = users       // ❌ Вне action!
  this.isLoading = false   // ❌ Вне action!
}

// ✅ Правильно — оборачиваем в runInAction
async fetchUsers() {
  this.isLoading = true
  const users = await api.getUsers()
  runInAction(() => {
    this.users = users
    this.isLoading = false
  })
}
```

**Почему это ошибка:** После `await` контекст action теряется. При `enforceActions: 'always'` будет ошибка, а без него — потеря батчинга (лишние ререндеры).

---

### ❌ Ошибка 2: Используют `await` вместо `yield` внутри `flow`

```ts
// ❌ Неправильно — await внутри flow-генератора
fetchUsers = flow(function* (this: UserStore) {
  this.users = await api.getUsers() // ❌ await вместо yield
})

// ✅ Правильно — yield вместо await
fetchUsers = flow(function* (this: UserStore) {
  this.users = yield api.getUsers() // ✅ yield
})
```

**Почему это ошибка:** `flow` работает через механизм генераторов. `await` внутри генератора не перехватывается MobX — контекст action теряется так же, как и без `flow`.

---

### ❌ Ошибка 3: Не обрабатывают `finally` при отмене flow

```ts
// ❌ Неправильно — isLoading застревает в true при отмене
fetchData = flow(function* (this: Store) {
  this.isLoading = true
  try {
    this.data = yield api.getData()
    this.isLoading = false // Не выполнится при cancel!
  } catch (e) {
    this.isLoading = false
  }
})

// ✅ Правильно — сброс isLoading в finally
fetchData = flow(function* (this: Store) {
  this.isLoading = true
  try {
    this.data = yield api.getData()
  } finally {
    this.isLoading = false // Выполнится всегда, даже при cancel
  }
})
```

**Почему это ошибка:** При вызове `promise.cancel()` генератор прерывается. Код в `try` после `yield` не выполнится, но `finally` выполнится **всегда**. Если не сбросить `isLoading` в `finally`, UI застрянет в состоянии загрузки.

---

### ❌ Ошибка 4: Не сохраняют предыдущее состояние при оптимистичном обновлении

```ts
// ❌ Неправильно — нечего откатывать при ошибке
async toggle(id: string) {
  const todo = this.todos.find(t => t.id === id)
  if (!todo) return

  runInAction(() => {
    todo.completed = !todo.completed
  })

  try {
    await api.toggleTodo(id)
  } catch {
    // Как откатить? Предыдущее значение потеряно!
    runInAction(() => {
      todo.completed = !todo.completed // Угадываем... ненадёжно
    })
  }
}

// ✅ Правильно — сохраняем prevState
async toggle(id: string) {
  const todo = this.todos.find(t => t.id === id)
  if (!todo) return

  const prevState = todo.completed // Сохраняем!

  runInAction(() => {
    todo.completed = !todo.completed
  })

  try {
    await api.toggleTodo(id)
  } catch {
    runInAction(() => {
      todo.completed = prevState // Точное восстановление
    })
  }
}
```

**Почему это ошибка:** Двойная инверсия (`!todo.completed` в catch) работает только для булевых полей. Для строк, чисел или объектов это не сработает. Всегда сохраняйте snapshot предыдущего состояния.

---

### ❌ Ошибка 5: Не очищают flow при размонтировании компонента

```tsx
// ❌ Неправильно — утечка: flow продолжает работать после unmount
const Component = observer(function Component() {
  const [store] = useState(() => new DataStore())

  useEffect(() => {
    store.fetchData() // Не отменяется при unmount!
  }, [store])

  return <div>{store.data}</div>
})

// ✅ Правильно — cleanup с cancel
const Component = observer(function Component() {
  const [store] = useState(() => new DataStore())

  useEffect(() => {
    const promise = store.fetchData()
    return () => promise.cancel() // Отмена при unmount
  }, [store])

  return <div>{store.data}</div>
})
```

**Почему это ошибка:** Без отмены flow продолжает выполняться после размонтирования компонента. Это может привести к обновлению состояния «мёртвого» стора, лишним запросам и утечкам памяти.

---

## 📚 Дополнительные ресурсы

- [MobX: Asynchronous actions](https://mobx.js.org/actions.html#asynchronous-actions)
- [MobX: Using flow instead of async/await](https://mobx.js.org/actions.html#using-flow-instead-of-async--await)
- [MobX: flowResult](https://mobx.js.org/actions.html#flowresult)
- [MDN: Generators and Iterators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
