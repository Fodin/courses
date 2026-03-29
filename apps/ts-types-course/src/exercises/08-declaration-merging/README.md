# 🔥 Уровень 8: Declaration Merging

## 🎯 Введение

Declaration merging (слияние объявлений) — уникальная возможность TypeScript, позволяющая **расширять существующие типы** из нескольких мест. Это ключевой механизм для расширения сторонних библиотек, работы с глобальными типами и создания plugin-систем.

В отличие от большинства языков, где тип определяется один раз, TypeScript разрешает **несколько объявлений с одним именем**, которые затем сливаются в одно определение.

## 🔥 Interface Merging

### Базовое слияние

Несколько объявлений одного интерфейса автоматически объединяются:

```typescript
interface User {
  id: number
  name: string
}

interface User {
  email: string
  role: string
}

// Результат слияния — единый интерфейс:
// interface User {
//   id: number
//   name: string
//   email: string
//   role: string
// }

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin'
}
```

### Правила слияния свойств

```typescript
interface Config {
  debug: boolean
  version: string
}

interface Config {
  version: string   // ✅ OK — тип совпадает
  timeout: number   // ✅ OK — новое свойство
  // debug: string  // ❌ Error — конфликт типов!
}
```

📌 **Правило**: свойства с одинаковыми именами **должны иметь одинаковый тип**. TypeScript не позволяет переопределять тип существующего свойства.

### Слияние методов — перегрузки

```typescript
interface Logger {
  log(message: string): void
}

interface Logger {
  log(message: string, level: number): void
  warn(message: string): void
}

// Результат: log имеет две перегрузки
// Порядок: сначала перегрузки из позднего объявления
```

### Порядок перегрузок при слиянии

Правила приоритета перегрузок:

1. Внутри одного блока — сохраняется исходный порядок
2. Более поздние блоки имеют **более высокий приоритет**
3. **Исключение**: перегрузки со **строковым литералом** в параметрах всегда поднимаются наверх

```typescript
interface Processor {
  process(input: string): string       // 3-й приоритет
  process(input: number): number       // 4-й приоритет
}

interface Processor {
  process(input: 'special'): boolean   // 1-й приоритет (string literal!)
  process(input: boolean): void        // 2-й приоритет
}
```

### Слияние generic интерфейсов

```typescript
interface Container<T> {
  value: T
  getValue(): T
}

interface Container<T> {
  setValue(newValue: T): void
  isEmpty(): boolean
}

// Оба объявления должны иметь одинаковые generic параметры
const box: Container<string> = {
  value: 'hello',
  getValue() { return this.value },
  setValue(v) { this.value = v },
  isEmpty() { return this.value === '' }
}
```

## 🔥 Module Augmentation

### Расширение сторонних модулей

`declare module` позволяет добавить типы к существующему модулю:

```typescript
// В файле express-augmentation.d.ts или .ts:
import { Request } from 'express'

declare module 'express' {
  interface Request {
    user?: {
      id: string
      role: string
    }
  }
}

// Теперь в коде:
// app.get('/profile', (req, res) => {
//   req.user?.id  // ✅ TypeScript знает о user
// })
```

### Расширение встроенных типов

```typescript
// Добавляем метод ко всем массивам
declare global {
  interface Array<T> {
    unique(): T[]
  }
}

// Реализация
Array.prototype.unique = function<T>(this: T[]): T[] {
  return [...new Set(this)]
}

// Использование
[1, 2, 2, 3].unique() // [1, 2, 3]
```

### Паттерн: Plugin System

```typescript
// Базовый тип
interface PluginRegistry {
  core: { version: string }
}

// Plugin A (в своём файле)
declare module './plugins' {
  interface PluginRegistry {
    auth: { login(user: string): boolean }
  }
}

// Plugin B (в своём файле)
declare module './plugins' {
  interface PluginRegistry {
    analytics: { track(event: string): void }
  }
}

// Итоговый тип содержит все плагины
type AllPlugins = PluginRegistry
// { core: ..., auth: ..., analytics: ... }
```

### Ограничения module augmentation

1. Нельзя добавлять **новые top-level экспорты** — только расширять существующие интерфейсы/namespace
2. Augmenting файл **должен быть модулем** (содержать `import` или `export`)
3. Augmentation должен ссылаться на конкретный модуль по имени

```typescript
// ❌ Не работает — нельзя добавить новый export
declare module 'express' {
  export function newHelper(): void // Error
}

// ✅ Работает — расширяем существующий interface
declare module 'express' {
  interface Request {
    customField: string
  }
}
```

## 🔥 Ambient Declarations

### declare keyword

`declare` сообщает TypeScript о типах, которые существуют в runtime, но определены вне TypeScript:

```typescript
// Глобальные переменные, инжектированные bundler-ом
declare const __VERSION__: string
declare const __DEV__: boolean
declare const process: {
  env: Record<string, string | undefined>
}

// Глобальные функции
declare function require(path: string): unknown
declare function setTimeout(cb: () => void, ms: number): number
```

### .d.ts файлы

Файлы с расширением `.d.ts` содержат **только объявления типов**, без реализации:

```typescript
// types/api.d.ts
declare namespace API {
  interface User {
    id: number
    name: string
    email: string
  }

  interface Response<T> {
    data: T
    status: number
    error?: string
  }

  function fetchUser(id: number): Promise<Response<User>>
}
```

### Namespace Merging

Namespace-ы с одним именем автоматически сливаются:

```typescript
namespace MathUtils {
  export function add(a: number, b: number): number {
    return a + b
  }
}

namespace MathUtils {
  export function multiply(a: number, b: number): number {
    return a * b
  }
  export const PI = 3.14159
}

// MathUtils содержит add, multiply, PI
MathUtils.add(2, 3)     // 5
MathUtils.multiply(4, 5) // 20
MathUtils.PI             // 3.14159
```

### Enum + Namespace Merging

Namespace может расширять enum статическими методами:

```typescript
enum Color {
  Red = 'RED',
  Green = 'GREEN',
  Blue = 'BLUE'
}

namespace Color {
  export function fromHex(hex: string): Color {
    const map: Record<string, Color> = {
      '#FF0000': Color.Red,
      '#00FF00': Color.Green,
      '#0000FF': Color.Blue
    }
    return map[hex] ?? Color.Red
  }
}

Color.fromHex('#00FF00') // Color.Green
```

### Class + Namespace Merging

Namespace может добавить статические свойства и вложенные типы к классу:

```typescript
class Validator {
  validate(input: string): boolean {
    return input.length > 0
  }
}

namespace Validator {
  export interface Options {
    strict: boolean
    maxLength: number
  }

  export const defaults: Options = {
    strict: false,
    maxLength: 255
  }

  export function create(options?: Partial<Options>): Validator {
    return new Validator()
  }
}

// Validator — и класс, и namespace
const v = Validator.create({ strict: true })
const opts: Validator.Options = Validator.defaults
```

### Global Augmentation

Для добавления типов в глобальную область видимости из модуля:

```typescript
// Файл должен быть модулем (иметь import/export)
export {}

declare global {
  interface Window {
    analytics: {
      track(event: string): void
      identify(userId: string): void
    }
  }

  var __APP_VERSION__: string

  // Расширение существующих глобальных интерфейсов
  interface ObjectConstructor {
    keys<T extends object>(obj: T): Array<keyof T>
  }
}
```

### Triple-Slash Directives

Специальные комментарии для управления подключением типов:

```typescript
/// <reference path="./globals.d.ts" />   // подключить файл
/// <reference types="node" />             // подключить @types/node
/// <reference lib="es2022" />             // подключить lib.es2022
```

## 🔥 Таблица совместимости слияний

| Объявление 1 | Объявление 2 | Сливаются? |
|-------------|-------------|------------|
| Interface | Interface | ✅ Да |
| Namespace | Namespace | ✅ Да |
| Class | Namespace | ✅ Да |
| Enum | Namespace | ✅ Да |
| Function | Namespace | ✅ Да |
| Class | Class | ❌ Нет |
| Type Alias | Type Alias | ❌ Нет |
| Enum | Enum | ❌ Нет |

📌 **Важно**: `type` aliases никогда не сливаются. Это одна из причин предпочтения `interface` перед `type`, когда нужна расширяемость.

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Конфликт типов при слиянии

```typescript
// ❌ Типы свойств при слиянии должны совпадать
interface Config {
  port: number
}

interface Config {
  port: string // Error: Subsequent property declarations
               // must have the same type
}

// ✅ Используйте union type в первом объявлении
interface Config {
  port: number | string
}
```

### Ошибка 2: Забыли export в declare global

```typescript
// ❌ Без export файл не является модулем
declare global {
  interface Window {
    myApp: unknown
  }
}

// ✅ Добавьте export чтобы сделать файл модулем
export {}

declare global {
  interface Window {
    myApp: unknown
  }
}
```

### Ошибка 3: Попытка слить type aliases

```typescript
// ❌ Type aliases не сливаются!
type Config = { debug: boolean }
type Config = { timeout: number } // Error: Duplicate identifier

// ✅ Используйте interface для слияния
interface Config { debug: boolean }
interface Config { timeout: number } // OK
```

### Ошибка 4: Module augmentation в non-module файле

```typescript
// ❌ Файл без import/export — глобальный скрипт
declare module 'express' {
  interface Request { user?: unknown }
}

// ✅ Сделайте файл модулем
import 'express'

declare module 'express' {
  interface Request { user?: unknown }
}
```

## 📌 Итоги

Declaration merging — мощный инструмент для:
- **Расширения сторонних библиотек** без fork-а
- **Plugin-систем** с типобезопасным registry
- **Ambient declarations** для описания внешнего кода
- **Namespace merging** для организации кода

💡 Используйте `interface` вместо `type` когда нужна расширяемость через merging. Помните, что `declare module` требует файл-модуль, а свойства при слиянии должны совпадать по типу.
