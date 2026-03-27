# 🛡️ Уровень 6: Обработка результатов

## 📖 Введение

В большинстве JS/TS проектов ошибки обрабатываются через `try/catch` и `throw`. Но этот подход имеет серьёзный недостаток: **компилятор не знает, может ли функция выбросить исключение**, и если может — какого типа.

```typescript
// Какие ошибки может выбросить fetchUser? TS не знает
function fetchUser(id: string): User {
  // throw new NetworkError(...)
  // throw new NotFoundError(...)
  // throw new ValidationError(...)
}
```

Паттерны **Result**, **Validation** и **Option** решают эту проблему, кодируя возможность ошибки или отсутствия значения **прямо в типе**.

## ✅ Result / Either

Result (также известный как Either) — это тип, который представляет **либо успех, либо ошибку**:

```typescript
type Result<T, E> = Ok<T> | Err<E>

class Ok<T> {
  readonly _tag = 'ok'
  constructor(readonly value: T) {}
}

class Err<E> {
  readonly _tag = 'err'
  constructor(readonly error: E) {}
}
```

### 🎯 Зачем нужен Result

```typescript
// ❌ Плохо: неявная ошибка
function parseAge(input: string): number {
  const n = parseInt(input, 10)
  if (isNaN(n)) throw new Error('Not a number')
  if (n < 0 || n > 150) throw new Error('Out of range')
  return n
}

// ✅ Хорошо: ошибка в типе
function parseAge(input: string): Result<number, string> {
  const n = parseInt(input, 10)
  if (isNaN(n)) return err('Not a number')
  if (n < 0 || n > 150) return err('Out of range')
  return ok(n)
}
```

> 🔥 **Ключевое:** С Result компилятор **заставляет** обработать ошибку. Забыть `try/catch` легко, забыть обработать `Err` — невозможно.

### Операции над Result

```typescript
// map — трансформирует значение внутри Ok
ok(5).map(x => x * 2)         // Ok(10)
err('fail').map(x => x * 2)   // Err('fail')

// flatMap — цепочка операций, каждая может вернуть ошибку
ok('42')
  .flatMap(parseAge)
  .flatMap(validateRange)      // Result<number, string>

// match — обработка обоих случаев
result.match({
  ok: value => `Успех: ${value}`,
  err: error => `Ошибка: ${error}`,
})

// fromThrowable — оборачивает функцию, которая может throw
const safeParse = fromThrowable(JSON.parse)
safeParse('{"a":1}')  // Ok({a: 1})
safeParse('invalid')   // Err(SyntaxError)
```

## 📋 Validation

Validation похож на Result, но с ключевым отличием: при комбинировании он **собирает ВСЕ ошибки**, а не останавливается на первой.

```typescript
// ❌ Result: остановится на первой ошибке
validateName('')
  .flatMap(() => validateEmail('bad'))
  .flatMap(() => validateAge(-1))
// Err('Name is required') — потеряли остальные ошибки

// ✅ Validation: соберёт все
const result = combine({
  name: validateName(''),
  email: validateEmail('bad'),
  age: validateAge(-1),
})
// Err(['Name is required', 'Invalid email', 'Age must be positive'])
```

### Accumulate

```typescript
type Validation<E, A> = Valid<A> | Invalid<E[]>

function combine<T extends Record<string, Validation<E, unknown>>>(
  validations: T
): Validation<E, { [K in keyof T]: /* extracted value */ }>
```

> 💡 **Совет:** Используйте Validation для форм и любых ситуаций, где пользователь должен увидеть **все** ошибки разом, а не по одной.

## 🎭 Option / Maybe

Option представляет **наличие или отсутствие** значения, заменяя `null | undefined`:

```typescript
type Option<T> = Some<T> | None

class Some<T> {
  readonly _tag = 'some'
  constructor(readonly value: T) {}
}

class None {
  readonly _tag = 'none'
}
```

### 🎯 Зачем нужен Option

```typescript
// ❌ Плохо: вложенные проверки на null
const street = user?.address?.street
if (street !== undefined && street !== null) {
  console.log(street.toUpperCase())
}

// ✅ Хорошо: цепочка Option
fromNullable(user)
  .flatMap(u => fromNullable(u.address))
  .flatMap(a => fromNullable(a.street))
  .map(s => s.toUpperCase())
  .getOrElse('Unknown')
```

### Операции

```typescript
some(5).map(x => x * 2)           // Some(10)
none.map(x => x * 2)              // None

some(5).getOrElse(0)               // 5
none.getOrElse(0)                  // 0

some(5).flatMap(x => x > 3 ? some(x) : none)  // Some(5)
some(1).flatMap(x => x > 3 ? some(x) : none)  // None
```

## ⚠️ Частые ошибки новичков

### 🐛 1. Используют Result, но проверяют через `if (result.value)`

```typescript
// ❌ Плохо: теряет типобезопасность
const result = parseAge('abc')
if (result.value) { /* value может быть 0 — falsy! */ }
```

✅ **Хорошо** — проверяйте `_tag`:
```typescript
if (result._tag === 'ok') {
  console.log(result.value)
}
// Или используйте match
result.match({
  ok: v => console.log(v),
  err: e => console.error(e),
})
```

### 🐛 2. Используют flatMap вместо map (или наоборот)

```typescript
// ❌ Плохо: map возвращает Result<Result<...>>
ok(5).map(x => ok(x * 2))  // Ok(Ok(10)) — вложенный Result!
```

✅ **Хорошо** — flatMap разворачивает вложенность:
```typescript
ok(5).flatMap(x => ok(x * 2))  // Ok(10)
```

> 💡 **Совет:** `map` для чистых функций (`T → U`), `flatMap` для Result-функций (`T → Result<U, E>`).

### 🐛 3. Используют Result вместо Validation для форм

```typescript
// ❌ Плохо: пользователь видит ошибки по одной
const result = validateName(name)
  .flatMap(() => validateEmail(email))  // не дойдёт если name невалиден
```

✅ **Хорошо** — показать все ошибки разом:
```typescript
const result = combine({
  name: validateName(name),
  email: validateEmail(email),
})
```

### 🐛 4. Option вместо Result для ожидаемых ошибок

```typescript
// ❌ Плохо: потеряли информацию об ошибке
function findUser(id: string): Option<User> { /* ... */ }
// Не нашли? А почему — не существует, нет прав, ошибка сети?
```

✅ **Хорошо** — Result сохраняет причину:
```typescript
function findUser(id: string): Result<User, 'not_found' | 'forbidden' | 'network_error'>
```

## 💡 Best Practices

- 📌 **Result** — для операций, которые могут **осмысленно завершиться ошибкой**
- 📌 **Validation** — для **валидации форм** и любых ситуаций, где нужно собрать все ошибки
- 📌 **Option** — для **отсутствия значения** без необходимости знать причину
- 💡 Используйте `fromThrowable` для оборачивания legacy-кода с throw
- 🔥 Цепочки `map`/`flatMap` заменяют вложенные `if/else` и `try/catch`
