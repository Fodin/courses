# Уровень 1: Observable State

## 🔍 Что такое Observable?

Observable — это данные, которые MobX отслеживает. Когда observable значение изменяется, все зависимые computed значения и реакции автоматически обновляются.

## ⚙️ makeAutoObservable vs makeObservable

### makeAutoObservable

Автоматически определяет типы аннотаций:
- Свойства → `observable`
- Геттеры → `computed`
- Методы → `action`
- Генераторы → `flow`

```ts
class Store {
  value = 0

  constructor() {
    makeAutoObservable(this)
  }

  setValue(v: number) {  // автоматически action
    this.value = v
  }

  get doubled() {  // автоматически computed
    return this.value * 2
  }
}
```

### makeObservable

Требует явных аннотаций — полный контроль:

```ts
class Store {
  value = 0

  constructor() {
    makeObservable(this, {
      value: observable,
      setValue: action,
      doubled: computed,
    })
  }

  setValue(v: number) {
    this.value = v
  }

  get doubled() {
    return this.value * 2
  }
}
```

## 📦 Типы observable

MobX делает глубокое отслеживание (deep observability) по умолчанию:

### Массивы

```ts
class Store {
  items: string[] = []

  constructor() { makeAutoObservable(this) }

  addItem(item: string) {
    this.items.push(item)  // MobX перехватывает push
  }
}
```

### Map и Set

```ts
class Store {
  tags = new Map<string, string>()
  selected = new Set<number>()

  constructor() { makeAutoObservable(this) }

  setTag(key: string, value: string) {
    this.tags.set(key, value)  // отслеживается
  }

  toggleSelected(id: number) {
    if (this.selected.has(id)) {
      this.selected.delete(id)
    } else {
      this.selected.add(id)
    }
  }
}
```

## 🔧 observable.ref и observable.shallow

Иногда глубокое отслеживание не нужно:

### observable.ref

Отслеживает только **замену ссылки**, не мутации внутри:

```ts
class Store {
  data: BigObject[] = []

  constructor() {
    makeObservable(this, {
      data: observable.ref,  // только замена массива целиком
      setData: action,
    })
  }

  setData(newData: BigObject[]) {
    this.data = newData  // ✅ — новая ссылка
  }

  // ❌ this.data.push(...) — не будет отслежено!
}
```

### Когда использовать ref?

- Большие массивы, которые заменяются целиком (например, ответ API)
- Объекты, которые не нужно отслеживать вглубь
- Оптимизация производительности

## 📊 Резюме

| Подход | Когда использовать |
|--------|-------------------|
| `makeAutoObservable` | По умолчанию, для большинства сторов |
| `makeObservable` | Когда нужен полный контроль над аннотациями |
| `observable` (deep) | Для данных с вложенными объектами |
| `observable.ref` | Для данных, заменяемых целиком |

---

## ❌ Частые ошибки новичков

### 1. Забыли `makeAutoObservable` в конструкторе

```ts
// ❌ Неправильно
class Store {
  count = 0

  increment() {
    this.count++
  }
}
// MobX ничего не знает об этом классе — observer не будет реагировать
```

```ts
// ✅ Правильно
class Store {
  count = 0

  constructor() {
    makeAutoObservable(this)
  }

  increment() {
    this.count++
  }
}
```

**Почему это ошибка:** без вызова `makeAutoObservable` (или `makeObservable`) свойства класса остаются обычными полями. MobX не отслеживает их изменения, и observer-компоненты не будут ререндериться.

### 2. Замена observable-массива вместо мутации

```ts
// ❌ Неправильно — создаёт новый массив, теряя ссылку
class Store {
  items: string[] = []

  constructor() { makeAutoObservable(this) }

  addItem(item: string) {
    this.items = [...this.items, item]
  }
}
```

```ts
// ✅ Правильно — мутируем observable-массив напрямую
class Store {
  items: string[] = []

  constructor() { makeAutoObservable(this) }

  addItem(item: string) {
    this.items.push(item)
  }
}
```

**Почему это ошибка:** замена `this.items = [...]` работает, но создаёт новый массив каждый раз. MobX-массивы поддерживают мутирующие методы (`push`, `splice`, `pop`), которые эффективнее и позволяют MobX точнее отслеживать изменения. Замена массива целиком вызывает ререндер всех подписчиков, даже если изменился только один элемент.

### 3. Использование `observable.ref`, когда нужно глубокое отслеживание

```ts
// ❌ Неправильно — мутации вложенных объектов не отслеживаются
class Store {
  constructor() {
    makeObservable(this, {
      users: observable.ref,
    })
  }

  users = [{ name: 'Alice', active: true }]

  toggleUser(index: number) {
    this.users[index].active = !this.users[index].active // не сработает!
  }
}
```

```ts
// ✅ Правильно — используйте обычный observable для вложенных данных
class Store {
  users = [{ name: 'Alice', active: true }]

  constructor() { makeAutoObservable(this) }

  toggleUser(index: number) {
    this.users[index].active = !this.users[index].active // ✅ отслеживается
  }
}
```

**Почему это ошибка:** `observable.ref` отслеживает только замену ссылки (`this.users = newArray`), но не мутации внутри массива или объектов. Используйте `ref` только когда данные заменяются целиком (например, ответ API).

### 4. Ожидание, что поля класса станут observable без декоратора

```ts
// ❌ Неправильно — поле добавлено после makeAutoObservable
class Store {
  constructor() {
    makeAutoObservable(this)
    this.extraField = 'value' // не будет observable!
  }
}
```

```ts
// ✅ Правильно — все поля объявлены до makeAutoObservable
class Store {
  extraField = 'default'

  constructor() {
    makeAutoObservable(this)
    this.extraField = 'value' // ✅ поле уже зарегистрировано
  }
}
```

**Почему это ошибка:** `makeAutoObservable` регистрирует только те свойства, которые уже существуют на объекте в момент вызова. Свойства, добавленные позже, не будут отслеживаться.

---

## 📚 Дополнительные ресурсы

- [Observable State](https://mobx.js.org/observable-state.html)
- [makeAutoObservable API](https://mobx.js.org/observable-state.html#makeautoobservable)
- [makeObservable API](https://mobx.js.org/observable-state.html#makeobservable)
- [Observable Collections](https://mobx.js.org/api.html#observablemap)
