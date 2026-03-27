# 🔮 Уровень 8: Продвинутые TS паттерны

## 📖 Введение

На предыдущих уровнях мы использовали TypeScript для типизации классических паттернов. Теперь мы пойдём дальше: **система типов TypeScript сама становится инструментом проектирования**. Conditional types, phantom types, mapped types и type-level вычисления позволяют переносить бизнес-логику на уровень компиляции — ошибки отлавливаются ещё до запуска программы.

Эти паттерны особенно полезны в API-дизайне: builder, который не даёт собрать невалидный объект, данные, которые нельзя случайно использовать без валидации, стейт-машины с типобезопасными переходами.

## 🔨 Type-safe Builder

### Проблема

Классический Builder позволяет пропустить обязательные поля — ошибка обнаруживается только в runtime:

```typescript
// ❌ Плохо: ошибка только в runtime
const config = new ConfigBuilder()
  .setPort(3000)
  // Забыли .setHost() — обязательное поле!
  .build() // Runtime error или невалидный объект
```

### Решение

Используем conditional types и аккумулятор типов, чтобы метод `build()` был доступен **только** когда все обязательные поля установлены:

```typescript
type RequiredKeys = 'host' | 'port'

// Аккумулятор отслеживает, какие поля уже заданы
type Builder<Set extends string> = {
  setHost(host: string): Builder<Set | 'host'>
  setPort(port: number): Builder<Set | 'port'>
  // build() доступен только когда Set содержит все RequiredKeys
  build: RequiredKeys extends Set ? () => Config : never
}
```

> 🔥 **Ключевое:** `build` имеет тип `never`, пока не заданы все обязательные поля. TypeScript не позволит вызвать `never`.

### Как это работает

1. `Builder<never>` — начальное состояние, ничего не задано
2. `setHost()` возвращает `Builder<'host'>` — host задан
3. `setPort()` на `Builder<'host'>` возвращает `Builder<'host' | 'port'>`
4. Теперь `RequiredKeys extends 'host' | 'port'` — true, `build()` доступен

> 💡 **Совет:** Этот паттерн идеален для конфигураций, ORM query builders и API-клиентов — везде, где есть обязательные шаги.

## 👻 Phantom Types (Фантомные типы)

### Проблема

В runtime строка — это строка. Но «сырой ввод пользователя», «валидированный email» и «зашифрованные данные» — это совершенно разные вещи:

```typescript
// ❌ Плохо: ничто не мешает отправить невалидированные данные
function sendEmail(email: string) { /* ... */ }
sendEmail(rawUserInput) // Компилируется без ошибок!
```

### Решение

Phantom types (branded types) добавляют «невидимую метку» к типу, не меняя runtime-представление:

```typescript
// Маркеры — пустые интерфейсы, существуют только на уровне типов
interface Validated { readonly _validated: unique symbol }
interface Sanitized { readonly _sanitized: unique symbol }

// Branded type = базовый тип + фантомная метка
type BrandedString<Brand> = string & { readonly __brand: Brand }

type RawInput = string
type ValidatedInput = BrandedString<Validated>
type SanitizedInput = BrandedString<Sanitized & Validated>

// ✅ Только валидированный ввод можно санитизировать
function sanitize(input: ValidatedInput): SanitizedInput {
  return input.replace(/<[^>]*>/g, '') as SanitizedInput
}
```

> 📌 **Важно:** `as` используется только в «пограничных» функциях (validate, sanitize). Весь остальной код работает с branded types без приведений.

### Композиция маркеров

Фантомные типы можно комбинировать через пересечение (intersection):

```typescript
type Encrypted = BrandedString<{ encrypted: true }>
type EncryptedAndValidated = BrandedString<Validated & { encrypted: true }>
```

Это позволяет строить пайплайны обработки данных, где каждый шаг гарантирован на уровне типов.

## 🤖 Type-level State Machine

### Проблема

Стейт-машина с runtime-проверками переходов:

```typescript
// ❌ Плохо: невалидный переход обнаруживается только в runtime
class Document {
  publish() {
    if (this.state !== 'review') {
      throw new Error('Can only publish from review state')
    }
  }
}
```

### Решение

Кодируем допустимые переходы в системе типов:

```typescript
// Состояния — типы-маркеры
interface Draft { readonly _state: 'draft' }
interface Review { readonly _state: 'review' }
interface Published { readonly _state: 'published' }

// Документ параметризован текущим состоянием
class Document<S> {
  // Переход Draft → Review
  submitForReview(this: Document<Draft>): Document<Review> { /* ... */ }
  // Переход Review → Published
  publish(this: Document<Review>): Document<Published> { /* ... */ }
  // Переход Review → Draft
  requestChanges(this: Document<Review>): Document<Draft> { /* ... */ }
}
```

> 🔥 **Ключевое:** TypeScript использует параметр `this` для ограничения вызова метода. `publish()` можно вызвать **только** на `Document<Review>`.

### Паттерн допустимых переходов

```typescript
// Карта переходов на уровне типов
type Transitions = {
  Draft: 'Review'
  Review: 'Published' | 'Draft'
  Published: never // конечное состояние
}

// Conditional type для проверки перехода
type CanTransition<From extends string, To extends string> =
  From extends keyof Transitions
    ? To extends Transitions[From]
      ? true
      : false
    : false
```

> 💡 **Совет:** Этот подход используется в реальных проектах: workflow-движки, платёжные системы, CI/CD пайплайны.

## ⚡ Effect Pattern

### Проблема

Функции с побочными эффектами трудно тестировать, комбинировать и обрабатывать ошибки:

```typescript
// ❌ Плохо: побочные эффекты, неявные зависимости, смешанные ошибки
async function processOrder(orderId: string) {
  const db = getDatabase() // откуда зависимость?
  const order = await db.find(orderId) // какая ошибка?
  await sendEmail(order.email) // ещё одна зависимость
}
```

### Решение

`Effect<R, E, A>` — ленивое вычисление, явно описывающее:
- 📦 `R` — требуемые зависимости (контекст)
- ❌ `E` — возможные ошибки
- ✅ `A` — результат при успехе

```typescript
type Effect<R, E, A> = {
  _R: R  // Requirements (dependencies)
  _E: E  // Error channel
  _A: A  // Success value
  run: (context: R) => { success: true; value: A } | { success: false; error: E }
}
```

> 💡 **Совет:** Это упрощённая версия концепций из библиотек Effect-TS и ZIO. Мы реализуем основную идею: описание вычисления отдельно от его исполнения.

### Композиция эффектов

```typescript
// flatMap: цепочка зависимых вычислений
function flatMap<R, E, A, R2, E2, B>(
  effect: Effect<R, E, A>,
  f: (a: A) => Effect<R2, E2, B>
): Effect<R & R2, E | E2, B>

// TypeScript автоматически объединяет зависимости (R & R2)
// и ошибки (E | E2) — это type-level вычисление
```

> 🔥 **Ключевое:** TypeScript на уровне типов отслеживает, какие зависимости нужны и какие ошибки возможны — без единой строки runtime-кода для этого.

## ⚠️ Частые ошибки новичков

### 🐛 1. Builder без type-level аккумулятора

❌ **Плохо** — Builder возвращает тот же тип, `build()` всегда доступен:
```typescript
class Builder {
  setHost(host: string): Builder { return this }
  setPort(port: number): Builder { return this }
  build(): Config { /* ... */ } // Можно вызвать без setHost!
}
```

✅ **Хорошо** — каждый setter изменяет тип Builder:
```typescript
class Builder<Set extends string> {
  setHost(host: string): Builder<Set | 'host'> { /* ... */ }
  build: RequiredKeys extends Set ? () => Config : never
}
```

### 🐛 2. Phantom types с мутабельным приведением

❌ **Плохо** — `as` разбросан по всему коду:
```typescript
const data = userInput as ValidatedInput // Обход валидации!
sendToDatabase(data) // Компилируется, но данные невалидны
```

✅ **Хорошо** — `as` только внутри функций-конструкторов:
```typescript
function validate(input: string): ValidatedInput | null {
  return isValid(input) ? (input as ValidatedInput) : null
}
// В остальном коде — только ValidatedInput, без as
```

### 🐛 3. State Machine без ограничения this

❌ **Плохо** — методы доступны в любом состоянии:
```typescript
class Document<S> {
  publish(): Document<Published> { /* ... */ }
}
const draft = new Document<Draft>()
draft.publish() // Компилируется! Нет проверки состояния
```

✅ **Хорошо** — параметр `this` ограничивает вызов:
```typescript
class Document<S> {
  publish(this: Document<Review>): Document<Published> { /* ... */ }
}
const draft = new Document<Draft>()
draft.publish() // ❌ Ошибка компиляции!
```

### 🐛 4. Effect без типизации ошибок

❌ **Плохо** — все ошибки `unknown`:
```typescript
type Effect<A> = { run: () => Promise<A> }
// Какие ошибки может выбросить? Неизвестно
```

✅ **Хорошо** — ошибки явно описаны в типе:
```typescript
type Effect<R, E, A> = {
  run: (ctx: R) => Result<E, A>
}
// E = DatabaseError | NetworkError — точно знаем, что может пойти не так
```

## 💡 Best Practices

- 🔨 **Builder**: используйте union type аккумулятор для отслеживания установленных полей
- 👻 **Phantom Types**: минимизируйте количество `as` — только в «пограничных» функциях
- 🤖 **State Machine**: описывайте карту переходов как тип, а не runtime-проверки
- ⚡ **Effect**: разделяйте описание вычисления и его интерпретацию
- 🔥 **Общее**: если правило можно выразить на уровне типов — выражайте на уровне типов
