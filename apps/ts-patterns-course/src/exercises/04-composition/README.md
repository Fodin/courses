# 🧩 Уровень 4: Паттерны композиции

## 📖 Введение

Композиция — один из фундаментальных принципов функционального и объектно-ориентированного программирования. Вместо наследования мы **собираем сложное поведение из простых частей**.

В этом уровне мы реализуем три мощных паттерна: **Pipe/Compose** для цепочек преобразований, **Middleware** для обработки запросов и **Plugin System** для расширяемых архитектур.

## 🔗 Pipe и Compose

### Проблема

Код часто содержит вложенные вызовы функций, которые читаются справа налево:

```typescript
// ❌ Нечитаемо — нужно читать изнутри наружу
const result = toUpperCase(trim(addPrefix(removeSpaces(input), '> ')))
```

### Решение: pipe()

`pipe` передаёт результат одной функции в следующую **слева направо**:

```typescript
// ✅ Читается как последовательность шагов
const process = pipe(
  removeSpaces,
  (s: string) => addPrefix(s, '> '),
  trim,
  toUpperCase
)
const result = process(input)
```

### Реализация

```typescript
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
function pipe<A, B, C, D>(
  fn1: (a: A) => B, fn2: (b: B) => C, fn3: (c: C) => D
): (a: A) => D

// Реализация с any для runtime, типобезопасность — через перегрузки
function pipe(...fns: Array<(arg: unknown) => unknown>) {
  return (input: unknown) => fns.reduce((acc, fn) => fn(acc), input)
}
```

### compose() — обратный порядок

`compose` работает **справа налево**, как математическая композиция f(g(x)):

```typescript
const format = compose(toUpperCase, trim, addPrefix)
// Эквивалентно: toUpperCase(trim(addPrefix(x)))
```

> 💡 **Совет:** Используйте `pipe` когда описываете поток данных, `compose` когда строите функцию из других функций.

## 🚇 Middleware

### Проблема

HTTP-обработка включает множество сквозных задач: аутентификация, логирование, CORS, валидация. Размещать всё в одной функции — путь к хаосу:

```typescript
// ❌ Монолитный обработчик
function handleRequest(req: Request): Response {
  // Логирование...
  // CORS...
  // Аутентификация...
  // Валидация...
  // Бизнес-логика...
  // Опять логирование...
}
```

### Решение: Middleware Pipeline

Каждый middleware делает одну задачу и передаёт управление следующему через `next()`:

```typescript
type Middleware = (
  request: Request,
  next: (req: Request) => Response
) => Response

const loggingMiddleware: Middleware = (req, next) => {
  console.log(`→ ${req.method} ${req.url}`)
  const response = next(req)
  console.log(`← ${response.status}`)
  return response
}

const authMiddleware: Middleware = (req, next) => {
  if (!req.headers.authorization) {
    return { status: 401, body: 'Unauthorized' }
  }
  return next(req)
}
```

### Как собрать pipeline

```typescript
function createPipeline(
  ...middlewares: Middleware[]
): (req: Request, handler: (req: Request) => Response) => Response {
  return (req, handler) => {
    const chain = middlewares.reduceRight(
      (next, mw) => (r: Request) => mw(r, next),
      handler
    )
    return chain(req)
  }
}
```

> 📌 **Важно:** `reduceRight` — потому что middleware оборачивают друг друга снаружи внутрь, но выполняются в прямом порядке.

## 🧩 Plugin System

### Проблема

Монолитное приложение трудно расширять. Каждая новая фича требует изменения ядра:

```typescript
// ❌ Каждая фича — изменение класса App
class App {
  init() {
    this.setupLogging()    // Хардкод
    this.setupAnalytics()  // Хардкод
    this.setupI18n()       // Хардкод
  }
}
```

### Решение: Plugin Architecture

Ядро предоставляет хуки жизненного цикла, плагины подключаются без изменения ядра:

```typescript
interface Plugin<TConfig = unknown> {
  name: string
  config?: TConfig
  onInit?(): void
  onDestroy?(): void
}

class PluginManager {
  private plugins = new Map<string, Plugin>()

  install<T>(plugin: Plugin<T>): void {
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin "${plugin.name}" already installed`)
    }
    this.plugins.set(plugin.name, plugin)
    plugin.onInit?.()
  }

  uninstall(name: string): void {
    const plugin = this.plugins.get(name)
    if (plugin) {
      plugin.onDestroy?.()
      this.plugins.delete(name)
    }
  }
}
```

### Типобезопасная конфигурация

```typescript
interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error'
  prefix: string
}

const loggerPlugin: Plugin<LoggerConfig> = {
  name: 'logger',
  config: { level: 'info', prefix: '[APP]' },
  onInit() {
    console.log(`${this.config!.prefix} Logger initialized at ${this.config!.level} level`)
  },
  onDestroy() {
    console.log(`${this.config!.prefix} Logger destroyed`)
  }
}
```

> 🔥 **Ключевое:** Плагины делают приложение расширяемым без изменения ядра — соблюдая Open/Closed Principle.

## ⚠️ Частые ошибки новичков

### 🐛 1. Потеря типобезопасности в pipe

```typescript
// ❌ Используют any[] для аргументов pipe
function pipe(...fns: any[]): any {
  return (x: any) => fns.reduce((v, f) => f(v), x)
}
```

✅ **Хорошо** — перегрузки сохраняют типы на каждом шаге:
```typescript
function pipe<A, B>(fn1: (a: A) => B): (a: A) => B
function pipe<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
```

### 🐛 2. Забывают вызвать next() в middleware

```typescript
// ❌ Middleware «проглатывает» запрос — цепочка прерывается
const badMiddleware: Middleware = (req, next) => {
  console.log('logging...')
  // Забыли return next(req)!
  return { status: 200, body: '' }
}
```

✅ **Хорошо** — всегда передавайте управление дальше (если не нужно прервать):
```typescript
const goodMiddleware: Middleware = (req, next) => {
  console.log('logging...')
  return next(req)
}
```

### 🐛 3. Не проверяют дублирование плагинов

```typescript
// ❌ Повторная установка перезаписывает плагин без очистки
install(plugin: Plugin) {
  this.plugins.set(plugin.name, plugin) // Старый onDestroy не вызван!
}
```

✅ **Хорошо** — проверка + ошибка или автоматическое удаление старого:
```typescript
install(plugin: Plugin) {
  if (this.plugins.has(plugin.name)) {
    throw new Error(`Plugin "${plugin.name}" already installed`)
  }
  this.plugins.set(plugin.name, plugin)
  plugin.onInit?.()
}
```

### 🐛 4. Мутируют request в middleware

```typescript
// ❌ Мутация оригинального объекта — побочные эффекты
const authMiddleware: Middleware = (req, next) => {
  req.headers.user = 'admin' // Мутация!
  return next(req)
}
```

✅ **Хорошо** — создайте новый объект:
```typescript
const authMiddleware: Middleware = (req, next) => {
  const enrichedReq = {
    ...req,
    headers: { ...req.headers, user: 'admin' }
  }
  return next(enrichedReq)
}
```

## 💡 Best Practices

1. 🔗 **pipe для данных, compose для функций** — используйте `pipe` когда описываете поток данных, `compose` когда строите функцию из других функций
2. 🚇 **Middleware — single responsibility** — каждый middleware решает ровно одну задачу
3. 🧩 **Плагины — самодостаточны** — плагин не должен зависеть от порядка установки других плагинов
4. 🔒 **Иммутабельность** — не мутируйте объекты, проходящие через pipeline, создавайте новые
5. 🛡️ **Типобезопасность** — используйте перегрузки и дженерики вместо `any`
