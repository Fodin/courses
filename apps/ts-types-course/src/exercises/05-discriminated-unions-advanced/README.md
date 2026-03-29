# 🔥 Уровень 5: Продвинутые размеченные объединения

## 🎯 Введение

Размеченные объединения (discriminated unions) — один из фундаментальных паттернов TypeScript. На базовом уровне вы уже знакомы с ними: объединение типов с общим полем-дискриминантом. Но на этом уровне мы углубимся в **продвинутые** техники: exhaustive checking, полиморфные dispatch-таблицы и моделирование сложных доменов через алгебраические типы данных.

Эти паттерны пришли из функционального программирования (Haskell, OCaml, Rust) и являются основой для построения предсказуемых, типобезопасных систем.

## 🔥 Exhaustive Switches через never

### Проблема неполного switch

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    // ⚠️ Забыли rectangle — TypeScript НЕ выдаст ошибку!
  }
  return 0 // Тихий баг
}
```

Когда в union добавляется новый вариант, компилятор не предупредит о пропущенных case. Решение — **exhaustive checking**.

### Паттерн assertNever

```typescript
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2
    case 'rectangle':
      return shape.width * shape.height
    default:
      // ✅ Если все варианты обработаны, shape имеет тип never
      // Если добавить новый вариант — здесь будет ошибка компиляции
      return assertNever(shape)
  }
}
```

### Как работает сужение до never

TypeScript последовательно **сужает** (narrows) тип в каждой ветке:

```typescript
function process(shape: Shape) {
  // shape: Shape (circle | rectangle | triangle)

  if (shape.kind === 'circle') {
    // shape: { kind: 'circle'; radius: number }
    return
  }

  // shape: rectangle | triangle

  if (shape.kind === 'rectangle') {
    // shape: { kind: 'rectangle'; width: number; height: number }
    return
  }

  // shape: triangle

  if (shape.kind === 'triangle') {
    // shape: { kind: 'triangle'; ... }
    return
  }

  // shape: never — все варианты исчерпаны
  assertNever(shape)
}
```

### Exhaustive Record

Альтернативный подход — использование `Record` с `Shape['kind']` как ключами:

```typescript
type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle'; base: number; height: number }

// ✅ Если добавить новый kind — TypeScript потребует добавить обработчик
const descriptions: Record<Shape['kind'], string> = {
  circle: 'A round shape',
  rectangle: 'A four-sided shape with right angles',
  triangle: 'A three-sided polygon',
}
```

📌 `Record<Shape['kind'], Handler>` автоматически требует обработку каждого варианта.

## 🔥 Полиморфные обработчики (Dispatch Tables)

### Типизированные события

```typescript
type AppEvent =
  | { type: 'USER_LOGIN'; payload: { userId: string; timestamp: number } }
  | { type: 'USER_LOGOUT'; payload: { userId: string } }
  | { type: 'PAGE_VIEW'; payload: { url: string; referrer: string } }
  | { type: 'PURCHASE'; payload: { productId: string; amount: number } }
```

### Извлечение payload по типу

```typescript
type EventPayload<T extends AppEvent['type']> =
  Extract<AppEvent, { type: T }>['payload']

// EventPayload<'USER_LOGIN'> = { userId: string; timestamp: number }
// EventPayload<'PURCHASE'> = { productId: string; amount: number }
```

`Extract<Union, Shape>` извлекает из объединения только те варианты, которые совместимы с `Shape`.

### Типобезопасная dispatch-таблица

```typescript
type EventHandlers = {
  [K in AppEvent['type']]: (payload: EventPayload<K>) => void
}

const handlers: EventHandlers = {
  USER_LOGIN: (payload) => {
    // payload автоматически типизирован как { userId: string; timestamp: number }
    console.log(`User ${payload.userId} logged in`)
  },
  USER_LOGOUT: (payload) => {
    console.log(`User ${payload.userId} logged out`)
  },
  PAGE_VIEW: (payload) => {
    console.log(`Viewed ${payload.url}`)
  },
  PURCHASE: (payload) => {
    console.log(`Purchase: $${payload.amount}`)
  },
}
```

### Типобезопасный dispatch

```typescript
function dispatch<T extends AppEvent['type']>(
  type: T,
  payload: EventPayload<T>
): void {
  const handler = handlers[type] as (payload: EventPayload<T>) => void
  handler(payload)
}

// ✅ TypeScript проверяет соответствие типа и payload
dispatch('USER_LOGIN', { userId: 'u-42', timestamp: Date.now() })

// ❌ Ошибка: payload не соответствует USER_LOGIN
// dispatch('USER_LOGIN', { url: '/home' })
```

### Паттерн Visitor

```typescript
type ASTNode =
  | { type: 'literal'; value: number }
  | { type: 'binary'; op: '+' | '-' | '*'; left: ASTNode; right: ASTNode }
  | { type: 'unary'; op: '-'; operand: ASTNode }

type Visitor<R> = {
  [K in ASTNode['type']]: (node: Extract<ASTNode, { type: K }>) => R
}

function visit<R>(node: ASTNode, visitor: Visitor<R>): R {
  return (visitor[node.type] as (node: ASTNode) => R)(node)
}

const evaluator: Visitor<number> = {
  literal: (node) => node.value,
  binary: (node) => {
    const left = visit(node.left, evaluator)
    const right = visit(node.right, evaluator)
    switch (node.op) {
      case '+': return left + right
      case '-': return left - right
      case '*': return left * right
    }
  },
  unary: (node) => -visit(node.operand, evaluator),
}
```

## 🔥 Алгебраические типы данных (ADT)

Алгебраические типы данных — это способ моделирования данных через **сумму** (tagged unions) и **произведение** (кортежи/объекты) типов. Эта концепция пришла из функционального программирования.

### Option (Maybe) тип

Вместо `null` / `undefined` — явный тип, кодирующий наличие или отсутствие значения:

```typescript
type Option<T> =
  | { tag: 'some'; value: T }
  | { tag: 'none' }

function some<T>(value: T): Option<T> {
  return { tag: 'some', value }
}

function none<T>(): Option<T> {
  return { tag: 'none' }
}
```

Операции над Option:

```typescript
function map<T, U>(opt: Option<T>, fn: (val: T) => U): Option<U> {
  return opt.tag === 'some' ? some(fn(opt.value)) : none()
}

function flatMap<T, U>(opt: Option<T>, fn: (val: T) => Option<U>): Option<U> {
  return opt.tag === 'some' ? fn(opt.value) : none()
}

function unwrapOr<T>(opt: Option<T>, defaultValue: T): T {
  return opt.tag === 'some' ? opt.value : defaultValue
}

// Использование
function findUser(id: string): Option<{ name: string }> {
  if (id === '1') return some({ name: 'Alice' })
  return none()
}

const userName = unwrapOr(
  map(findUser('1'), (u) => u.name),
  'Unknown'
)
// 'Alice'
```

### Result (Either) тип

Вместо `throw` — явный тип для успеха или ошибки:

```typescript
type Result<T, E> =
  | { tag: 'ok'; value: T }
  | { tag: 'err'; error: E }

function ok<T, E>(value: T): Result<T, E> {
  return { tag: 'ok', value }
}

function err<T, E>(error: E): Result<T, E> {
  return { tag: 'err', error }
}

function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (val: T) => U
): Result<U, E> {
  return result.tag === 'ok' ? ok(fn(result.value)) : result
}
```

Практический пример:

```typescript
type ValidationError =
  | { code: 'REQUIRED'; field: string }
  | { code: 'TOO_SHORT'; field: string; minLength: number }
  | { code: 'INVALID_EMAIL'; field: string }

function validateEmail(email: string): Result<string, ValidationError> {
  if (!email) return err({ code: 'REQUIRED', field: 'email' })
  if (!email.includes('@')) return err({ code: 'INVALID_EMAIL', field: 'email' })
  return ok(email)
}
```

### Рекурсивные ADT — дерево выражений

```typescript
type Expr =
  | { tag: 'num'; value: number }
  | { tag: 'add'; left: Expr; right: Expr }
  | { tag: 'mul'; left: Expr; right: Expr }
  | { tag: 'neg'; operand: Expr }

function evaluate(expr: Expr): number {
  switch (expr.tag) {
    case 'num': return expr.value
    case 'add': return evaluate(expr.left) + evaluate(expr.right)
    case 'mul': return evaluate(expr.left) * evaluate(expr.right)
    case 'neg': return -evaluate(expr.operand)
  }
}

// (2 + 3) * (-4) = -20
const expr: Expr = {
  tag: 'mul',
  left: { tag: 'add', left: { tag: 'num', value: 2 }, right: { tag: 'num', value: 3 } },
  right: { tag: 'neg', operand: { tag: 'num', value: 4 } },
}
```

### Связанный список как ADT

```typescript
type List<T> =
  | { tag: 'cons'; head: T; tail: List<T> }
  | { tag: 'nil' }

function cons<T>(head: T, tail: List<T>): List<T> {
  return { tag: 'cons', head, tail }
}

const nil: List<never> = { tag: 'nil' }

function toArray<T>(list: List<T>): T[] {
  if (list.tag === 'nil') return []
  return [list.head, ...toArray(list.tail)]
}

const myList = cons(1, cons(2, cons(3, nil)))
toArray(myList) // [1, 2, 3]
```

## 🔥 Продвинутые паттерны

### Дискриминанты по нескольким полям

```typescript
type APIResponse =
  | { status: 'success'; code: 200; data: unknown }
  | { status: 'success'; code: 201; data: unknown; location: string }
  | { status: 'error'; code: 400; errors: string[] }
  | { status: 'error'; code: 500; message: string }

function handleResponse(response: APIResponse) {
  if (response.status === 'success') {
    if (response.code === 201) {
      // TypeScript знает, что у response есть location
      console.log(response.location)
    }
  }
}
```

### Branded discriminants

```typescript
type Success<T> = { readonly _tag: 'Success'; value: T }
type Failure<E> = { readonly _tag: 'Failure'; error: E }
type IO<T, E> = Success<T> | Failure<E>

// readonly _tag предотвращает случайное изменение дискриминанта
```

### Mapped discriminated unions

```typescript
type ActionMap = {
  increment: { amount: number }
  decrement: { amount: number }
  reset: Record<string, never>
  setName: { name: string }
}

type Action = {
  [K in keyof ActionMap]: { type: K } & ActionMap[K]
}[keyof ActionMap]

// Результат:
// | { type: 'increment'; amount: number }
// | { type: 'decrement'; amount: number }
// | { type: 'reset' }
// | { type: 'setName'; name: string }
```

💡 Этот паттерн позволяет определять действия в одном месте и автоматически генерировать union.

## ⚠️ Частые ошибки начинающих

### Ошибка 1: Дискриминант не литеральный тип

```typescript
// ❌ string — слишком широкий тип, сужение не работает
type Bad =
  | { type: string; data: number }
  | { type: string; message: string }

// ✅ Литеральные строковые типы как дискриминанты
type Good =
  | { type: 'data'; data: number }
  | { type: 'error'; message: string }
```

### Ошибка 2: Забыть default с assertNever

```typescript
// ❌ Без default + assertNever добавление нового варианта не вызовет ошибку
function process(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return 'circle'
    case 'rectangle': return 'rect'
    // Добавили triangle в union, но тут нет ошибки!
  }
}

// ✅ С assertNever — ошибка компиляции при добавлении нового варианта
function process(shape: Shape) {
  switch (shape.kind) {
    case 'circle': return 'circle'
    case 'rectangle': return 'rect'
    default: return assertNever(shape) // Ошибка: triangle не обработан
  }
}
```

### Ошибка 3: Мутирование дискриминанта

```typescript
// ❌ Изменение дискриминанта ломает типобезопасность
const event: AppEvent = { type: 'USER_LOGIN', payload: { userId: '1', timestamp: 0 } }
// event.type = 'PURCHASE' — payload больше не соответствует типу!

// ✅ Используйте readonly для дискриминантов
type SafeEvent =
  | { readonly type: 'USER_LOGIN'; payload: { userId: string } }
  | { readonly type: 'USER_LOGOUT'; payload: { userId: string } }
```

### Ошибка 4: Использование if вместо switch без сужения

```typescript
// ❌ TypeScript не сужает тип без проверки дискриминанта
function bad(event: AppEvent) {
  if (event.type === 'USER_LOGIN' || event.type === 'PURCHASE') {
    // event: USER_LOGIN | PURCHASE — payload по-прежнему union!
    // event.payload.userId — ошибка, у PURCHASE нет userId
  }
}

// ✅ Проверяйте каждый вариант отдельно
function good(event: AppEvent) {
  if (event.type === 'USER_LOGIN') {
    event.payload.userId // ✅ работает
  }
}
```

## 💡 Best practices

1. **Всегда используйте `assertNever` в default**: это гарантирует exhaustive checking при добавлении новых вариантов

2. **Используйте `readonly` для дискриминантов**: предотвращает случайную мутацию

3. **Предпочитайте ADT вместо наследования**: `Option<T>`, `Result<T, E>` вместо `null` и `throw`

4. **Используйте `Extract` для извлечения вариантов**: `Extract<Union, { type: T }>` безопаснее ручного дублирования типов

5. **Определяйте dispatch-таблицы через mapped types**: `Record<Union['type'], Handler>` гарантирует полноту

6. **Используйте один дискриминант на union**: несколько дискриминантов усложняют сужение типов

## 📌 Резюме

| Паттерн | Когда использовать |
|---------|--------------------|
| `assertNever` | Гарантия обработки всех вариантов в switch |
| Dispatch table | Маппинг вариантов union на обработчики |
| `Extract<U, Shape>` | Извлечение конкретного варианта из union |
| `Option<T>` | Замена null/undefined |
| `Result<T, E>` | Замена throw/try-catch |
| Рекурсивные ADT | Деревья, выражения, связанные списки |
| Mapped discriminated unions | Автоматическая генерация union из map-объекта |
