# Уровень 1: Примитивные типы

## Базовые типы Yup

Yup предоставляет схемы для всех основных типов данных JavaScript. Каждая схема знает, как валидировать и преобразовывать значения соответствующего типа.

### Типы схем

| Метод           | Валидирует       | Cast по умолчанию         |
| --------------- | ---------------- | ------------------------- |
| `yup.string()`  | строки           | `String(value)`           |
| `yup.number()`  | числа            | `Number(value)` / `parseFloat` |
| `yup.boolean()` | булевы значения  | Truthy/falsy преобразование |
| `yup.date()`    | даты             | `new Date(value)`         |

---

## string()

Схема для строковых значений. Yup автоматически приводит значения к строке (кроме `null` и `undefined`).

```typescript
import * as yup from 'yup'

const nameSchema = yup.string()
  .required('Name is required')
  .min(2, 'Name too short')
  .max(50, 'Name too long')

await nameSchema.validate('John') // 'John'
await nameSchema.validate('')     // Error: 'Name is required'
await nameSchema.validate('J')    // Error: 'Name too short'
```

🔥 **Ключевое:** `string()` автоматически приводит значения к строке:

```typescript
const schema = yup.string()
schema.cast(123)    // '123'
schema.cast(true)   // 'true'
schema.cast(null)   // null (not cast)
```

---

## number()

Схема для числовых значений. Yup пытается преобразовать строки в числа.

```typescript
const ageSchema = yup.number()
  .required('Age is required')
  .positive('Must be positive')
  .integer('Must be integer')
  .min(18, 'Must be 18+')
  .max(120, 'Invalid age')

await ageSchema.validate(25)    // 25
await ageSchema.validate('25')  // 25 (cast from string!)
await ageSchema.validate(-5)    // Error: 'Must be positive'
await ageSchema.validate(17.5)  // Error: 'Must be integer'
```

📌 **Важно:** `number()` парсит строки! `'42'` становится `42`. Это удобно для данных из форм, где все значения приходят как строки.

```typescript
const schema = yup.number()
schema.cast('3.14')   // 3.14
schema.cast('')       // NaN (then fails validation)
schema.cast('abc')    // NaN (then fails validation)
```

---

## boolean()

Схема для булевых значений.

```typescript
const termsSchema = yup.boolean()
  .required('Must accept terms')
  .isTrue('You must check this box')

await termsSchema.validate(true)   // true
await termsSchema.validate(false)  // Error: 'You must check this box'
```

💡 **Подсказка:** `isTrue()` и `isFalse()` — полезны для чекбоксов:

```typescript
// "Accept terms" checkbox
const acceptSchema = yup.boolean().isTrue('Please accept the terms')

// "Don't send notifications" checkbox
const optOutSchema = yup.boolean().isFalse('Cannot opt out of critical notifications')
```

---

## date()

Схема для дат. Yup преобразует строки в объекты `Date`.

```typescript
const dateSchema = yup.date()
  .required('Date is required')
  .min(new Date('2020-01-01'), 'Date must be after 2020')
  .max(new Date(), 'Date cannot be in the future')

await dateSchema.validate(new Date())        // valid
await dateSchema.validate('2024-06-15')      // Date object (cast from string)
await dateSchema.validate('1999-01-01')      // Error: 'Date must be after 2020'
```

📌 **Важно:** ISO-строки автоматически парсятся:

```typescript
const schema = yup.date()
schema.cast('2024-01-15')                  // Date object
schema.cast('2024-01-15T10:30:00.000Z')    // Date object
schema.cast('not a date')                  // Invalid Date
```

---

## Модификаторы: required, nullable, optional

Эти методы контролируют, какие "пустые" значения допустимы.

### required()

Значение **должно быть задано** и не может быть `undefined`, `null` или пустой строкой:

```typescript
const schema = yup.string().required('Required!')

await schema.validate('hello')   // 'hello'
await schema.validate(undefined) // Error
await schema.validate(null)      // Error
await schema.validate('')        // Error (empty string fails too!)
```

### nullable()

Разрешает `null` как допустимое значение:

```typescript
const schema = yup.string().nullable()

await schema.validate('hello')   // 'hello'
await schema.validate(null)      // null (valid!)
await schema.validate(undefined) // undefined (valid by default)
```

### optional()

Разрешает `undefined` как допустимое значение (это поведение по умолчанию):

```typescript
const schema = yup.string().optional()

await schema.validate('hello')   // 'hello'
await schema.validate(undefined) // undefined (valid)
```

### Комбинации

```typescript
// Required and nullable — must be present, null is OK
yup.string().nullable().required()
// undefined -> Error, null -> Error (!), '' -> Error, 'hi' -> OK

// Optional and nullable — most permissive
yup.string().nullable().optional()
// undefined -> OK, null -> OK, '' -> OK, 'hi' -> OK
```

⚠️ **Внимание:** `nullable().required()` — `null` все равно вызывает ошибку! `required()` проверяет, что значение "не пустое", а `null` считается пустым. `nullable()` влияет на приведение типов.

---

## default() и defined()

### default()

Задаёт значение по умолчанию для `undefined`:

```typescript
const schema = yup.string().default('Guest')

schema.cast(undefined)  // 'Guest'
schema.cast('John')     // 'John'
schema.cast(null)       // null (default doesn't replace null!)
```

📌 **Важно:** `default()` заменяет только `undefined`, не `null`. Для замены `null` используйте `nullable().default()`:

```typescript
const schema = yup.string().nullable().default('Guest')

schema.cast(undefined) // 'Guest'
schema.cast(null)      // 'Guest' (now replaces null too!)
```

Для динамических значений передайте функцию:

```typescript
const schema = yup.date().default(() => new Date()) // current date
```

### defined()

Запрещает `undefined` (но разрешает `null`):

```typescript
const schema = yup.string().defined('Must be defined')

await schema.validate('hello')    // 'hello'
await schema.validate(undefined)  // Error: 'Must be defined'
await schema.validate(null)       // null (valid!)
```

💡 **Разница:** `required()` запрещает `undefined`, `null` и `''`. `defined()` запрещает только `undefined`.

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Путают cast и validate

```typescript
// ❌ Bad: cast doesn't validate, it only transforms
const schema = yup.number().min(18)
schema.cast('5')  // 5 (no error! cast doesn't check min)

// ✅ Good: use validate to check constraints
await schema.validate('5') // Error: 'must be >= 18'
```

**Почему это проблема:** `cast()` только преобразует значение, но не проверяет правила валидации. Используйте `validate()` для проверки.

### ❌ Ошибка 2: Ожидают, что number() отклонит строки

```typescript
// ❌ Bad: expecting string '42' to fail
const schema = yup.number()
await schema.validate('42') // 42 (valid! Yup casts it)

// ✅ Good: use strict mode if you want only actual numbers
await schema.validate('42', { strict: true }) // Error!
```

**Почему это проблема:** Yup по умолчанию приводит типы. Это удобно для форм, но может скрыть ошибки типов. Используйте `strict: true`, если приведение не нужно.

### ❌ Ошибка 3: Думают, что nullable() делает поле необязательным

```typescript
// ❌ Bad: thinking nullable alone makes it optional
const schema = yup.string().nullable().required()
await schema.validate(null) // Error! required() rejects null

// ✅ Good: understand that nullable affects type, not requirement
// nullable() allows null in the TYPE, required() checks for non-empty VALUE
```

**Почему это проблема:** `nullable()` расширяет допустимый тип (добавляет `| null`), но не отменяет `required()`.

### ❌ Ошибка 4: Ожидают, что default() работает при validate

```typescript
// ❌ Bad: default only works with cast, not validate
const schema = yup.string().required().default('Guest')
await schema.validate(undefined) // Error! required fires before default

// ✅ Good: default works with cast()
schema.cast(undefined) // 'Guest'

// Or use it without required:
const schema2 = yup.string().default('Guest')
await schema2.validate(undefined) // 'Guest'
```

**Почему это проблема:** `default()` применяется на этапе `cast`, а `required()` проверяется на этапе `validate`. Если `required()` стоит, он отклонит `undefined` до того, как `default()` успеет сработать при некоторых конфигурациях.

---

## 💡 Best Practices

1. **Всегда указывайте сообщения об ошибках** — `required('Field is required')` понятнее, чем стандартное сообщение
2. **Используйте strict-режим** для API-данных, где приведение типов не нужно
3. **Помните о cast** — Yup сначала приводит тип, потом валидирует
4. **nullable vs optional** — `nullable` для `null`, `optional` для `undefined`
5. **default() для значений** по умолчанию в формах, `defined()` для строгой проверки на `undefined`

---

## Что дальше?

В следующем уровне вы изучите:

- Строковые валидации: `email()`, `url()`, `matches()`
- Ограничения длины: `min()`, `max()`, `length()`
- Трансформации строк: `trim()`, `lowercase()`, `uppercase()`
