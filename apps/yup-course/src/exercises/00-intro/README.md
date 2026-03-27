# Уровень 0: Введение в Yup

## Что такое Yup?

**Yup** — это библиотека для создания схем валидации данных в JavaScript/TypeScript. Она позволяет декларативно описать структуру и ограничения данных, а затем проверить, соответствуют ли реальные данные этим ограничениям.

### Зачем нужна валидация?

Представьте, что вы получаете данные от пользователя через форму или от API. Без валидации вы не знаете:
- Заполнены ли обязательные поля?
- Правильный ли формат email?
- Число в допустимом диапазоне?
- Нет ли лишних или опасных данных?

**Yup решает эту проблему**, предоставляя выразительный API для описания правил валидации.

### Почему Yup?

| Библиотека | Размер  | API стиль         | TypeScript |
| ---------- | ------- | ------------------ | ---------- |
| **Yup**    | ~15 KB  | Цепочки методов    | Отличный   |
| Zod        | ~13 KB  | Цепочки методов    | Отличный   |
| Joi        | ~150 KB | Цепочки методов    | Средний    |
| io-ts      | ~8 KB   | Функциональный     | Отличный   |

🔥 **Преимущества Yup:**

1. **Интуитивный API** — цепочки методов читаются как естественный язык
2. **Отличная типизация** — `InferType` автоматически выводит TypeScript-типы из схемы
3. **Трансформации** — Yup не только валидирует, но и преобразует данные
4. **Интеграция** — поддержка в React Hook Form, Formik и других библиотеках
5. **Кастомизация** — легко создавать свои правила валидации

---

## Основные концепции

### 1. Схема (Schema)

Схема — это описание того, какими данные **должны быть**. Это набор правил, которым данные должны соответствовать.

```typescript
import * as yup from 'yup'

// Schema describes the expected shape of data
const nameSchema = yup.string().required().min(2)
```

### 2. Валидация (Validation)

Валидация — процесс проверки данных по схеме. Yup предоставляет два основных метода:

```typescript
// validate() — async, throws ValidationError on failure
try {
  const result = await schema.validate(data)
  console.log('Valid:', result)
} catch (err) {
  console.log('Invalid:', err.message)
}

// validateSync() — sync version
try {
  const result = schema.validateSync(data)
  console.log('Valid:', result)
} catch (err) {
  console.log('Invalid:', err.message)
}

// isValid() — returns boolean, never throws
const valid = await schema.isValid(data) // true or false
```

### 3. Приведение типов (Casting)

Yup автоматически пытается привести данные к нужному типу:

```typescript
const numSchema = yup.number()

// Yup casts string "5" to number 5
const result = numSchema.cast('5') // 5 (number)
```

📌 **Важно:** `validate()` сначала приводит тип (`cast`), потом проверяет правила. Если нужно валидировать без приведения, используйте опцию `{ strict: true }`.

---

## Первая схема

### Создание схемы объекта

Самый распространённый случай — валидация объектов с несколькими полями:

```typescript
import * as yup from 'yup'

// Define an object schema
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required('Age is required').positive('Age must be positive'),
  email: yup.string().email('Invalid email').required('Email is required'),
})
```

### Валидация данных

```typescript
// Valid data
const validUser = { name: 'John', age: 25, email: 'john@example.com' }
const result = await userSchema.validate(validUser)
// result: { name: 'John', age: 25, email: 'john@example.com' }

// Invalid data — throws ValidationError
try {
  await userSchema.validate({ name: '', age: -5, email: 'bad' })
} catch (err) {
  console.log(err.message) // first error message
}
```

### Вывод типов с InferType

🔥 **Ключевая фича Yup** — автоматический вывод TypeScript-типов из схемы:

```typescript
// Automatically infer TypeScript type from schema
type User = yup.InferType<typeof userSchema>
// Equivalent to:
// type User = {
//   name: string
//   age: number
//   email: string
// }
```

Это означает, что вам не нужно дублировать типы — схема является единственным источником истины.

---

## Обработка ошибок валидации

### ValidationError

Когда `validate()` обнаруживает ошибку, он выбрасывает `ValidationError` с полезными свойствами:

```typescript
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    err.message   // first error message (or summary)
    err.errors    // string[] — all error messages
    err.inner     // ValidationError[] — per-field errors
    err.path      // string — field path (e.g. 'email')
  }
}
```

### abortEarly: false

По умолчанию Yup останавливается на первой ошибке. Чтобы собрать **все** ошибки, передайте `{ abortEarly: false }`:

```typescript
// ❌ Default: stops at first error
await schema.validate(data)
// throws: "Name is required" (only first error)

// ✅ Collect all errors
await schema.validate(data, { abortEarly: false })
// throws ValidationError with err.inner containing ALL errors
```

### Извлечение ошибок по полям

```typescript
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    // Map errors by field path
    const fieldErrors: Record<string, string> = {}
    for (const error of err.inner) {
      if (error.path) {
        fieldErrors[error.path] = error.message
      }
    }
    // { name: 'Name is required', email: 'Invalid email' }
  }
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Забывают `await` при вызове `validate()`

```typescript
// ❌ Bad: validate returns a Promise!
const result = schema.validate(data)
console.log(result) // Promise { <pending> }

// ✅ Good: always await
const result = await schema.validate(data)
console.log(result) // actual validated data
```

**Почему это проблема:** `validate()` — асинхронный метод. Без `await` вы получите Promise, а не результат. Ошибки валидации не будут пойманы в `try/catch`.

### ❌ Ошибка 2: Не используют `abortEarly: false` для формы

```typescript
// ❌ Bad: user sees errors one by one
try {
  await schema.validate(formData)
} catch (err) {
  showError(err.message) // only first error
}

// ✅ Good: user sees all errors at once
try {
  await schema.validate(formData, { abortEarly: false })
} catch (err) {
  if (err instanceof yup.ValidationError) {
    err.inner.forEach(e => showFieldError(e.path, e.message))
  }
}
```

**Почему это проблема:** В формах пользователь хочет увидеть все ошибки сразу, а не исправлять их по одной.

### ❌ Ошибка 3: Путают `validate()` и `isValid()`

```typescript
// ❌ Bad: trying to get errors from isValid
const valid = await schema.isValid(data)
// valid is just true/false — no error details!

// ✅ Good: use validate() when you need error details
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  // err.inner has all the details
}
```

**Почему это проблема:** `isValid()` возвращает только `boolean`. Если вам нужны сообщения об ошибках — используйте `validate()`.

### ❌ Ошибка 4: Не проверяют тип ошибки

```typescript
// ❌ Bad: assumes all errors are ValidationError
try {
  await schema.validate(data)
} catch (err) {
  console.log(err.errors) // might crash if err is not ValidationError
}

// ✅ Good: check the type first
try {
  await schema.validate(data)
} catch (err) {
  if (err instanceof yup.ValidationError) {
    console.log(err.errors)
  } else {
    throw err // re-throw unexpected errors
  }
}
```

**Почему это проблема:** Внутри `try/catch` может быть не только `ValidationError`, но и любая другая ошибка (например, `TypeError`). Всегда проверяйте тип.

---

## 💡 Best Practices

1. **Используйте `InferType`** — не дублируйте типы вручную
2. **Всегда передавайте сообщения об ошибках** — `required('Name is required')` лучше, чем `required()`
3. **Используйте `abortEarly: false`** для форм — покажите все ошибки сразу
4. **Проверяйте `instanceof yup.ValidationError`** — не все ошибки — ошибки валидации
5. **Храните схемы отдельно** — создавайте схемы в отдельных файлах/константах для переиспользования

---

## 📚 Дополнительные ресурсы

- [Официальная документация Yup](https://github.com/jquense/yup)
- [API Reference](https://github.com/jquense/yup#api)
- [TypeScript интеграция](https://github.com/jquense/yup#typescript-integration)

---

## Что дальше?

В следующем уровне вы изучите:

- Примитивные типы: `string()`, `number()`, `boolean()`, `date()`
- Модификаторы: `required()`, `nullable()`, `optional()`, `default()`
- Приведение типов и strict-режим
