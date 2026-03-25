# 🔥 Уровень 3: TypeScript паттерны обработки ошибок

## 🎯 Введение

TypeScript даёт мощные инструменты для типобезопасной обработки ошибок. Вместо того чтобы полагаться на `try/catch` и `unknown`, можно сделать ошибки частью системы типов.

## 🔥 Result тип (Either паттерн)

💡 **Идея**: функция возвращает либо успешный результат, либо ошибку — и это выражено в типе.

```typescript
type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E }
```

### Вспомогательные функции

```typescript
function ok<T>(value: T): Result<T, never> {
  return { ok: true, value }
}

function err<E>(error: E): Result<never, E> {
  return { ok: false, error }
}
```

### Использование

```typescript
function safeDivide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Деление на ноль')
  return ok(a / b)
}

const result = safeDivide(10, 0)
if (result.ok) {
  console.log(result.value) // TypeScript знает, что это number
} else {
  console.log(result.error) // TypeScript знает, что это string
}
```

### ✅ Преимущества перед throw

| `throw` | `Result` |
|---------|----------|
| ❌ Ошибка не видна в типе функции | ✅ Ошибка — часть сигнатуры |
| ❌ `catch` получает `unknown` | ✅ Тип ошибки известен |
| ❌ Легко забыть обработать | ✅ Компилятор напомнит |
| ❌ Прерывает поток выполнения | ✅ Явное ветвление |

## 🔥 Discriminated Unions для состояний

Особенно полезно для состояний загрузки в React:

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }
```

### Использование в компоненте

```typescript
function UserProfile() {
  const [state, setState] = useState<AsyncState<User>>({ status: 'idle' })

  // TypeScript гарантирует: data доступна только при success
  if (state.status === 'success') {
    return <div>{state.data.name}</div>
  }
  if (state.status === 'error') {
    return <div>Ошибка: {state.error}</div>
  }
  // ...
}
```

## 🔥 Type-safe коды ошибок

```typescript
type ErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'NETWORK'

interface TypedError<C extends ErrorCode> {
  code: C
  message: string
}

// Специализированные типы с дополнительными полями
type ValidationErr = TypedError<'VALIDATION'> & {
  details: { field: string; constraint: string }
}

type NotFoundErr = TypedError<'NOT_FOUND'> & {
  details: { resource: string; id: string }
}

type AppError = ValidationErr | NotFoundErr | TypedError<'UNAUTHORIZED'> | TypedError<'NETWORK'>
```

### Обработка с сужением типов

```typescript
function handleError(error: AppError): string {
  switch (error.code) {
    case 'VALIDATION':
      // TypeScript знает, что error.details.field существует
      return `Поле "${error.details.field}": ${error.details.constraint}`
    case 'NOT_FOUND':
      return `${error.details.resource} не найден`
    case 'UNAUTHORIZED':
      return 'Войдите в аккаунт'
    case 'NETWORK':
      return 'Проблемы с сетью'
  }
}
```

## 🔥 Exhaustive Handling с never

📌 Паттерн `assertNever` гарантирует, что вы обработали все варианты union type:

```typescript
function assertNever(value: never): never {
  throw new Error(`Необработанный случай: ${JSON.stringify(value)}`)
}

type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      return assertNever(shape) // Ошибка компиляции, если пропущен вариант
  }
}
```

💡 Если добавить новый `kind: 'triangle'` в `Shape`, TypeScript сразу покажет ошибку в `assertNever` — забыть обработку невозможно.

## Комбинирование паттернов

```typescript
type FetchResult<T> = Result<T, AppError>

async function fetchUser(id: string): Promise<FetchResult<User>> {
  try {
    const response = await fetch(`/api/users/${id}`)
    if (response.status === 404) {
      return err({ code: 'NOT_FOUND', message: 'User not found', details: { resource: 'User', id } })
    }
    if (response.status === 401) {
      return err({ code: 'UNAUTHORIZED', message: 'Not authorized' })
    }
    const data = await response.json()
    return ok(data)
  } catch {
    return err({ code: 'NETWORK', message: 'Network error' })
  }
}

// Использование
const result = await fetchUser('123')
if (result.ok) {
  renderUser(result.value)
} else {
  showError(handleError(result.error))
}
```

## ⚠️ Частые ошибки новичков

### ❌ Использование `any` вместо `Result` для обработки ошибок

```typescript
// ❌ Плохо: тип ошибки теряется
function parseConfig(raw: string): any {
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const config = parseConfig('bad json')
config.host // 💥 Runtime crash! null.host — TypeError
```

> Почему это ошибка: вызывающий код не знает, что функция может вернуть `null`. Нет никакого принуждения от компилятора проверить результат — ошибка всплывёт только в рантайме.

```typescript
// ✅ Хорошо: Result делает ошибку явной
function parseConfig(raw: string): Result<Config, string> {
  try {
    return ok(JSON.parse(raw))
  } catch {
    return err('Invalid JSON')
  }
}

const result = parseConfig('bad json')
if (!result.ok) {
  // Компилятор заставляет обработать ошибку
  console.error(result.error)
}
```

### ❌ Забытый `default` кейс без `assertNever`

```typescript
// ❌ Плохо: нет exhaustive check
type Status = 'active' | 'inactive' | 'banned'

function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Активен'
    case 'inactive': return 'Неактивен'
    // 'banned' забыт — функция вернёт undefined!
  }
}
```

> Почему это ошибка: если добавить новый вариант в union (например, `'banned'`), TypeScript **не** предупредит, что `switch` не покрывает все случаи. Функция молча вернёт `undefined`, что приведёт к непредсказуемому поведению в UI.

```typescript
// ✅ Хорошо: assertNever гарантирует полную обработку
function getLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Активен'
    case 'inactive': return 'Неактивен'
    case 'banned': return 'Заблокирован'
    default: return assertNever(status)
  }
}
```

### ❌ Прямой доступ к `data` без проверки `status`

```typescript
// ❌ Плохо: обращение к data без проверки статуса
const state: AsyncState<User> = await getUser()
console.log(state.data.name) // 💥 Property 'data' does not exist on type '{ status: "loading" }'
```

> Почему это ошибка: TypeScript не позволит обратиться к `data`, если вы не сузили тип через проверку `status`. Но если использовать `as any` или неправильные type assertions, ошибка проявится в рантайме — `undefined.name` вызовет TypeError.

```typescript
// ✅ Хорошо: сужение типа через проверку status
if (state.status === 'success') {
  console.log(state.data.name) // TypeScript знает, что data существует
}
```

## 📌 Итоги

- ✅ `Result<T, E>` делает ошибки явной частью типа функции
- ✅ Discriminated unions моделируют состояния загрузки с гарантиями типов
- ✅ Типизированные коды ошибок позволяют обрабатывать каждый тип по-разному
- ✅ `assertNever` гарантирует exhaustive handling всех вариантов
- ✅ Эти паттерны уменьшают количество рантайм-ошибок за счёт проверок на этапе компиляции
