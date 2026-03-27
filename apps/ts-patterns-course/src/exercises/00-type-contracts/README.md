# 🎯 Уровень 0: Типы как контракты

## 📖 Введение

TypeScript — это не просто «JavaScript с типами». Типы в TS могут служить **контрактами**, которые делают невозможными целые классы ошибок на этапе компиляции.

В этом уровне мы изучим три фундаментальных паттерна, которые превращают систему типов из инструмента документации в активную защиту.

## 🏷️ Branded Types (Брендированные типы)

Обычный `string` не различает email от userId:

```typescript
function sendEmail(email: string) { /* ... */ }
function findUser(id: string) { /* ... */ }

const email = "alice@example.com"
const userId = "usr-42"

// Компилируется без ошибок, но это баг!
sendEmail(userId)
findUser(email)
```

**Branded Types** добавляют «бренд» к типу, делая его уникальным:

```typescript
declare const __brand: unique symbol
type Brand<T, B extends string> = T & { readonly [__brand]: B }

type Email = Brand<string, 'Email'>
type UserId = Brand<string, 'UserId'>

// Теперь нельзя перепутать:
function sendEmail(email: Email) { /* ... */ }
function findUser(id: UserId) { /* ... */ }

// TS Error: string is not assignable to Email
sendEmail(userId)
```

### Как создавать брендированные значения

Через функции-конструкторы с валидацией:

```typescript
function createEmail(value: string): Email {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new Error(`Invalid email: ${value}`)
  }
  return value as Email
}
```

> 💡 **Совет:** `as` используется только внутри функции-конструктора. В остальном коде работайте с `Email`, а не со `string`.

## 🔍 Type Guards (Защитники типов)

Type Guard — это функция, которая сужает тип переменной:

```typescript
interface ErrorResponse {
  status: 'error'
  error: { code: number; message: string }
}

interface SuccessResponse {
  status: 'success'
  data: { id: number; name: string }
}

type ApiResponse = SuccessResponse | ErrorResponse

// Type Guard
function isErrorResponse(resp: ApiResponse): resp is ErrorResponse {
  return resp.status === 'error'
}

function handle(resp: ApiResponse) {
  if (isErrorResponse(resp)) {
    // TypeScript знает: resp — это ErrorResponse
    console.log(resp.error.message)
  } else {
    // TypeScript знает: resp — это SuccessResponse
    console.log(resp.data.name)
  }
}
```

### Встроенные type guards

- ✅ `typeof x === 'string'`
- ✅ `x instanceof Error`
- ✅ `'key' in obj`
- ✅ Пользовательские: `(x): x is Type => boolean`

## 🌿 Discriminated Unions (Размеченные объединения)

Когда у всех вариантов union есть общее поле-дискриминант, TypeScript может автоматически сужать тип:

```typescript
interface ClickEvent {
  type: 'click'
  x: number; y: number
}

interface SubmitEvent {
  type: 'submit'
  formId: string
}

type AppEvent = ClickEvent | SubmitEvent

function handle(event: AppEvent) {
  switch (event.type) {
    case 'click':
      // TS знает: event — это ClickEvent
      console.log(event.x, event.y)
      break
    case 'submit':
      // TS знает: event — это SubmitEvent
      console.log(event.formId)
      break
    default:
      // Exhaustive check — TS ошибка если мы забыли вариант
      const _never: never = event
      return _never
  }
}
```

### 🔥 Exhaustive Check через never

Паттерн `const _: never = value` в `default` гарантирует, что при добавлении нового варианта в union компилятор покажет ошибку, если вы забыли его обработать.

> ⚠️ **Важно:** Exhaustive check — один из самых мощных инструментов TypeScript. Используйте его в каждом `switch` по discriminated union.

## ⚠️ Частые ошибки новичков

### 🐛 1. Забывают `as Type` при создании branded types

❌ **Плохо** — без явного приведения TypeScript не позволит присвоить `string` в `Email`:
```typescript
function createEmail(value: string): Email {
  return value // TS Error!
}
```

✅ **Хорошо** — используйте `as` только внутри конструктора:
```typescript
function createEmail(value: string): Email {
  if (!isValidEmail(value)) throw new Error('Invalid email')
  return value as Email
}
```

### 🐛 2. Type guard без `is`

❌ **Плохо** — функция возвращает `boolean`, а не сужает тип:
```typescript
function isError(resp: ApiResponse) {
  return resp.status === 'error'
}
```

✅ **Хорошо** — предикат `resp is ErrorResponse` включает сужение типа:
```typescript
function isError(resp: ApiResponse): resp is ErrorResponse {
  return resp.status === 'error'
}
```

### 🐛 3. Забывают exhaustive check

❌ **Плохо** — добавление нового варианта в union не вызовет ошибку компиляции:
```typescript
switch (event.type) {
  case 'click': /* ... */ break
  case 'submit': /* ... */ break
  // Нет default — новый вариант не будет замечен
}
```

✅ **Хорошо** — `never` в default поймает пропущенный вариант:
```typescript
switch (event.type) {
  case 'click': /* ... */ break
  case 'submit': /* ... */ break
  default:
    const _never: never = event
    return _never
}
```

### 🐛 4. Мутация branded значений

❌ **Плохо** — branded type не защищает от изменения значения после создания.

✅ **Хорошо** — используйте `readonly` где возможно.

## 📌 Итоги

- ✅ **Branded Types** — делают примитивные типы уникальными, предотвращая путаницу
- ✅ **Type Guards** — сужают типы в условных блоках, давая доступ к нужным полям
- ✅ **Discriminated Unions** — автоматическое сужение типов через поле-дискриминант
- 🔥 **Exhaustive Check** — гарантия обработки всех вариантов на уровне компиляции
- 💡 Эти паттерны — фундамент для всех последующих уровней курса
