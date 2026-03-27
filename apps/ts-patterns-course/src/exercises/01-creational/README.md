# 🏗️ Уровень 1: Порождающие паттерны (Creational Patterns)

## 📖 Введение

Порождающие паттерны решают одну из самых частых задач в программировании — **как правильно создавать объекты**. Казалось бы, `new MyClass()` достаточно? На практике — нет.

Представьте: вы пишете систему уведомлений. Сегодня нужен email, завтра — SMS, послезавтра — push-уведомления. Каждый раз менять код, который создаёт уведомления? А если появится Telegram или Slack? Порождающие паттерны помогают создавать объекты **гибко**, **расширяемо** и **типобезопасно**.

## 🏭 Factory Method (Фабричный метод)

### Проблема

Код напрямую создаёт конкретные классы — при добавлении нового типа приходится менять все места создания:

```typescript
// ❌ Плохо — жёсткая привязка к конкретным классам
function notify(type: string, message: string) {
  if (type === 'email') {
    const n = new EmailNotification()
    n.send(message)
  } else if (type === 'sms') {
    const n = new SMSNotification()
    n.send(message)
  }
  // Каждый новый тип — новый if/else
}
```

### Решение

Factory Method выносит создание объектов в отдельную функцию/метод:

```typescript
interface Notification {
  send(message: string): string
  format(message: string): string
}

function createNotification(type: 'email' | 'sms' | 'push'): Notification {
  switch (type) {
    case 'email': return new EmailNotification()
    case 'sms': return new SMSNotification()
    case 'push': return new PushNotification()
  }
}

// Клиентский код не зависит от конкретных классов
const notification = createNotification('email')
notification.send('Hello!')
```

### Как это работает

1. Определяем **общий интерфейс** для всех продуктов
2. Каждый конкретный класс реализует этот интерфейс
3. **Фабричная функция** принимает тип и возвращает нужный экземпляр
4. Клиентский код работает только с интерфейсом

> 💡 **Совет:** В TypeScript фабрика может возвращать `Notification` — и компилятор гарантирует, что все варианты реализуют нужные методы.

## 🎨 Abstract Factory (Абстрактная фабрика)

### Проблема

Нужно создавать **семейства связанных объектов**. Например, UI-компоненты для разных тем — каждая тема определяет свои Button, Input, Card:

```typescript
// ❌ Плохо — смешивание стилей разных тем
const button = isDark ? new DarkButton() : new LightButton()
const input = isDark ? new DarkInput() : new LightInput()
// Легко случайно создать DarkButton + LightInput
```

### Решение

Abstract Factory создаёт **целые семейства** объектов через единый интерфейс:

```typescript
interface UIFactory {
  createButton(label: string): UIComponent
  createInput(placeholder: string): UIComponent
  createCard(title: string, content: string): UIComponent
}

class LightThemeFactory implements UIFactory {
  createButton(label: string) { return new LightButton(label) }
  createInput(placeholder: string) { return new LightInput(placeholder) }
  createCard(title: string, content: string) { return new LightCard(title, content) }
}

// Гарантия: все компоненты из одной темы
function buildUI(factory: UIFactory) {
  const btn = factory.createButton('Submit')
  const input = factory.createInput('Enter name')
  return { btn, input }
}
```

### Отличие от Factory Method

| | Factory Method | Abstract Factory |
|---|---------------|-----------------|
| 🎯 Что создаёт | **Один** объект | **Семейство** объектов |
| 🔧 Структура | Одна фабричная функция | Интерфейс с несколькими методами |
| 📋 Выбор | Тип продукта | Семейство продуктов |

## 🔨 Builder (Строитель)

### Проблема

Объекты с множеством параметров создаются неудобно:

```typescript
// ❌ Плохо — длинный конструктор, непонятный порядок аргументов
const query = new Query('users', ['name', 'email'], 'age > 18', 'name', 'asc', 10, 0)
```

### Решение

Builder позволяет собирать объект **пошагово** через цепочку вызовов:

```typescript
const query = new QueryBuilder()
  .select('name', 'email')
  .from('users')
  .where('age > 18')
  .orderBy('name', 'asc')
  .limit(10)
  .build()
```

### 🔥 Типобезопасный Builder в TypeScript

TypeScript позволяет сделать Builder, который **на уровне типов** контролирует обязательные шаги:

```typescript
class QueryBuilder<HasSelect extends boolean = false, HasFrom extends boolean = false> {
  select(...fields: string[]): QueryBuilder<true, HasFrom> { /* ... */ }
  from(table: string): QueryBuilder<HasSelect, true> { /* ... */ }

  // build() доступен только если select и from вызваны
  build(this: QueryBuilder<true, true>): Query { /* ... */ }
}

// ✅ Компилируется
new QueryBuilder().select('name').from('users').build()

// ❌ TS Error — не вызван from()
new QueryBuilder().select('name').build()
```

> 🔥 **Ключевое:** Это мощнейший паттерн TypeScript — компилятор не даст вызвать `build()` без обязательных шагов.

## 💎 Singleton (Одиночка)

### Проблема

Некоторые объекты должны существовать в единственном экземпляре: конфигурация, логгер, пул соединений. Множественные экземпляры приводят к рассинхронизации:

```typescript
// ❌ Плохо — два экземпляра конфигурации
const config1 = new ConfigManager()
config1.set('theme', 'dark')

const config2 = new ConfigManager()
console.log(config2.get('theme')) // undefined — другой экземпляр!
```

### Решение

Singleton гарантирует единственный экземпляр:

```typescript
class ConfigManager {
  private static instance: ConfigManager | null = null
  private config = new Map<string, unknown>()

  private constructor() {} // Запрещаем new ConfigManager()

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  get<T>(key: string): T | undefined {
    return this.config.get(key) as T | undefined
  }

  set<T>(key: string, value: T): void {
    this.config.set(key, value)
  }
}

const config1 = ConfigManager.getInstance()
config1.set('theme', 'dark')

const config2 = ConfigManager.getInstance()
console.log(config2.get('theme')) // 'dark' — тот же экземпляр!
```

### Singleton и TypeScript generics

Типизация `get/set` через generics делает Singleton типобезопасным:

```typescript
const manager = ConfigManager.getInstance()
manager.set<number>('maxRetries', 3)
const retries = manager.get<number>('maxRetries') // number | undefined
```

> 📌 **Важно:** В современном фронтенде Singleton часто заменяют модульным паттерном (экспорт одного экземпляра из модуля) или state-менеджерами. Но понимание паттерна важно для бэкенда и инфраструктурного кода.

## ⚠️ Частые ошибки новичков

### 🐛 1. Фабрика без интерфейса

```typescript
// ❌ Плохо — фабрика возвращает конкретный тип
function createNotification(type: string): EmailNotification | SMSNotification {
  // ...
}
```

> ⚠️ **Почему это ошибка:** клиентский код вынужден знать о конкретных классах. При добавлении нового типа нужно менять и фабрику, и тип возвращаемого значения, и весь код, который использует результат.

```typescript
// ✅ Хорошо — фабрика возвращает интерфейс
interface Notification {
  send(message: string): string
}

function createNotification(type: NotificationType): Notification {
  // ...
}
```

### 🐛 2. Builder без иммутабельности промежуточных шагов

```typescript
// ❌ Плохо — мутация одного builder ломает другой
const base = new QueryBuilder().from('users')
const q1 = base.select('name').build()
const q2 = base.select('email').build() // base уже изменён!
```

> ⚠️ **Почему это ошибка:** если Builder мутирует своё состояние, повторное использование промежуточных шагов приводит к неожиданным результатам.

```typescript
// ✅ Хорошо — каждый шаг возвращает новый builder
select(...fields: string[]) {
  const next = this.clone()
  next.fields = fields
  return next
}
```

### 🐛 3. Singleton с публичным конструктором

```typescript
// ❌ Плохо — конструктор открыт
class Config {
  static instance = new Config()
  constructor() {} // Кто угодно может сделать new Config()
}
```

> ⚠️ **Почему это ошибка:** ничто не мешает создать `new Config()`, минуя `getInstance()`. Singleton теряет смысл.

```typescript
// ✅ Хорошо — private constructor
class Config {
  private constructor() {}
  static getInstance() { /* ... */ }
}
```

### 🐛 4. Нетипизированный параметр фабрики

```typescript
// ❌ Плохо — string позволяет любое значение
function create(type: string) { /* ... */ }
create('emial') // Опечатка, но TypeScript молчит
```

> ⚠️ **Почему это ошибка:** строковый тип не защищает от опечаток. Ошибка обнаружится только в рантайме.

```typescript
// ✅ Хорошо — union тип
type NotificationType = 'email' | 'sms' | 'push'
function create(type: NotificationType) { /* ... */ }
create('emial') // TS Error!
```

## 📌 Итоги

- ✅ **Factory Method** — создание объектов одного интерфейса через фабричную функцию
- ✅ **Abstract Factory** — создание семейств связанных объектов
- ✅ **Builder** — пошаговое конструирование сложных объектов с цепочкой вызовов
- ✅ **Singleton** — гарантия единственного экземпляра с глобальной точкой доступа
- 💡 TypeScript усиливает каждый паттерн: интерфейсы, union types, generics, private constructors
- 📌 Фабрики всегда должны возвращать **интерфейс**, а не конкретный класс
