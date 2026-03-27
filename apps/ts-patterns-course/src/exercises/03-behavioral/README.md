# ⚙️ Уровень 3: Поведенческие паттерны (Behavioral Patterns)

## 📖 Введение

Поведенческие паттерны определяют **как объекты взаимодействуют друг с другом**. В отличие от порождающих (создание) и структурных (композиция), поведенческие паттерны описывают **алгоритмы и распределение обязанностей** между объектами.

TypeScript делает эти паттерны особенно мощными благодаря строгой типизации: интерфейсы описывают контракт поведения, а дженерики позволяют создавать универсальные решения.

## ♟️ Strategy (Стратегия)

### Проблема

Вы хотите менять алгоритм выполнения задачи без изменения кода, который его использует:

```typescript
// ❌ Плохо: жёстко зашитая логика
function sort(arr: number[], method: string) {
  if (method === 'bubble') { /* ... */ }
  else if (method === 'quick') { /* ... */ }
  else if (method === 'merge') { /* ... */ }
  // Каждый новый алгоритм — новый if
}
```

### Решение

Выделите алгоритм в интерфейс, а конкретные реализации — в отдельные классы:

```typescript
interface SortStrategy<T> {
  sort(data: T[]): T[]
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    const arr = [...data]
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
    }
    return arr
  }
}

// ✅ Контекст использует стратегию через интерфейс
class Sorter<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>) {
    this.strategy = strategy
  }

  sort(data: T[]): T[] {
    return this.strategy.sort(data)
  }
}
```

> 💡 **Совет:** Strategy отлично сочетается с DI — стратегию можно инжектировать через конструктор или конфигурацию.

## 👁️ Observer (Наблюдатель)

### Проблема

Нужно уведомлять несколько объектов об изменениях, не создавая жёсткой связи между ними.

### Решение

Типизированный EventEmitter с поддержкой карты событий:

```typescript
type EventMap = {
  userLogin: { userId: string; timestamp: number }
  error: { message: string; code: number }
}

type Listener<T> = (data: T) => void

class TypedEventEmitter<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, Set<Listener<T[keyof T]>>>()

  on<K extends keyof T>(event: K, listener: Listener<T[K]>): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(listener as Listener<T[keyof T]>)
  }

  emit<K extends keyof T>(event: K, data: T[K]): void {
    this.listeners.get(event)?.forEach(fn => fn(data))
  }
}
```

> 🔥 **Ключевое:** TypeScript гарантирует, что `emit('userLogin', data)` получит именно `{ userId: string; timestamp: number }`, а не произвольный объект.

## 📝 Command (Команда)

### Проблема

Нужно поддержать undo/redo, очередь операций или логирование действий.

### Решение

Инкапсулируйте действие в объект с методами `execute` и `undo`:

```typescript
interface Command {
  execute(): void
  undo(): void
}

class TextEditor {
  private content = ''
  private history: Command[] = []

  executeCommand(command: Command) {
    command.execute()
    this.history.push(command)
  }

  undo() {
    const command = this.history.pop()
    command?.undo()
  }
}
```

> 💡 **Совет:** Каждая команда должна быть самодостаточной для `undo` — сохраняйте предыдущее состояние внутри команды.

## ⛓️ Chain of Responsibility (Цепочка обязанностей)

### Проблема

Запрос должен пройти через несколько обработчиков (авторизация, валидация, логирование), но порядок и набор обработчиков может меняться.

### Решение

Каждый обработчик решает, обработать запрос самостоятельно или передать следующему:

```typescript
interface Handler<T> {
  setNext(handler: Handler<T>): Handler<T>
  handle(request: T): T | null
}

abstract class BaseHandler<T> implements Handler<T> {
  private next: Handler<T> | null = null

  setNext(handler: Handler<T>): Handler<T> {
    this.next = handler
    return handler
  }

  handle(request: T): T | null {
    if (this.next) {
      return this.next.handle(request)
    }
    return request
  }
}
```

> 📌 **Важно:** Всегда определяйте, что происходит, если ни один обработчик не сработал — иначе запрос может «потеряться» в цепочке.

## ⚠️ Частые ошибки новичков

### 🐛 1. Strategy без интерфейса

❌ **Плохо** — передача строки-идентификатора вместо объекта стратегии:
```typescript
function sort(arr: number[], algorithm: 'bubble' | 'quick') {
  // Нарушает Open/Closed Principle
}
```

✅ **Хорошо** — стратегия — это объект с контрактом:
```typescript
function sort<T>(arr: T[], strategy: SortStrategy<T>): T[] {
  return strategy.sort(arr)
}
```

### 🐛 2. Observer с утечкой памяти

❌ **Плохо** — подписка без отписки:
```typescript
emitter.on('event', handler)
// Компонент уничтожен, но handler остаётся в памяти
```

✅ **Хорошо** — всегда предусматривайте `off`:
```typescript
emitter.on('event', handler)
// При уничтожении:
emitter.off('event', handler)
```

> ⚠️ **Важно:** В React это особенно критично — подписка в `useEffect` без отписки в cleanup приводит к утечкам.

### 🐛 3. Command без иммутабельного состояния

❌ **Плохо** — команда хранит ссылку на изменяемый объект:
```typescript
class InsertCommand {
  constructor(private text: string, private editor: Editor) {}
  undo() {
    // Если editor.content изменён другой командой — undo сломан
  }
}
```

✅ **Хорошо** — команда сохраняет снимок состояния для undo:
```typescript
class InsertCommand {
  private previousContent = ''
  execute() {
    this.previousContent = this.editor.getContent()
    // ...
  }
}
```

### 🐛 4. Chain of Responsibility без завершения

❌ **Плохо** — цепочка без конечного обработчика — запрос теряется.

✅ **Хорошо** — всегда определяйте, что происходит, если ни один обработчик не сработал.

## 💡 Best Practices

- ♟️ **Strategy**: используйте дженерики для универсальных стратегий
- 👁️ **Observer**: типизируйте карту событий через `Record<string, unknown>`
- 📝 **Command**: каждая команда должна быть самодостаточной для undo
- ⛓️ **Chain**: обработчики не должны знать о структуре цепочки
- 🔥 **Общее**: интерфейсы + дженерики = типобезопасные поведенческие паттерны
