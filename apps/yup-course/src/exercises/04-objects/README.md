# Уровень 4: Объектные схемы

## Зачем нужны объектные схемы?

В реальных приложениях данные почти всегда приходят в виде объектов — пользовательские профили, формы, API-ответы. Yup позволяет описать структуру объекта и валидировать каждое поле по своим правилам.

---

## object() и shape()

### Базовое создание

`yup.object()` создаёт схему объекта. Поля описываются прямо в конструкторе или через `.shape()`:

```typescript
// Вариант 1: поля в конструкторе
const userSchema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().required().positive().integer(),
  email: yup.string().email('Invalid email'),
})

// Вариант 2: через shape() — эквивалентно
const userSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  age: yup.number().required().positive().integer(),
  email: yup.string().email('Invalid email'),
})
```

### Валидация объекта

```typescript
// Valid object
await userSchema.validate({
  name: 'Alice',
  age: 28,
  email: 'alice@example.com',
})
// Returns: { name: 'Alice', age: 28, email: 'alice@example.com' }

// Invalid: missing required fields
await userSchema.validate({ name: 'Bob' })
// Error: 'age is a required field'
```

### abortEarly: false

По умолчанию Yup останавливается на первой ошибке. Передайте `abortEarly: false` для сбора всех ошибок:

```typescript
try {
  await userSchema.validate({}, { abortEarly: false })
} catch (err) {
  console.log(err.errors)
  // ['Name is required', 'age is a required field']

  console.log(err.inner)
  // Array of ValidationError objects with .path and .message
  err.inner.forEach(e => {
    console.log(`${e.path}: ${e.message}`)
  })
  // 'name: Name is required'
  // 'age: age is a required field'
}
```

🔥 **Ключевое:** `err.inner` содержит массив ошибок с путями к полям — незаменимо для отображения ошибок в формах.

---

## Вложенные объекты

Объекты могут содержать другие объекты:

```typescript
const profileSchema = yup.object({
  user: yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
  }),
  address: yup.object({
    city: yup.string().required('City is required'),
    zipCode: yup.string()
      .required('Zip is required')
      .matches(/^\d{5,6}$/, 'Invalid zip code'),
    country: yup.string().required(),
  }),
})
```

### Пути ошибок во вложенных объектах

При ошибке путь указывает на конкретное поле через точку:

```typescript
try {
  await profileSchema.validate(
    { user: { firstName: '' }, address: {} },
    { abortEarly: false }
  )
} catch (err) {
  err.inner.forEach(e => console.log(e.path))
  // 'user.firstName'
  // 'user.lastName'
  // 'address.city'
  // 'address.zipCode'
  // 'address.country'
}
```

💡 **Подсказка:** Пути вида `user.firstName` позволяют точно указать, в каком поле ошибка — это удобно для интеграции с формами (React Hook Form, Formik).

---

## pick, omit, partial

Yup позволяет создавать новые схемы на основе существующих — без дублирования кода.

### pick(keys)

Создаёт схему только с указанными полями:

```typescript
const fullSchema = yup.object({
  name: yup.string().required(),
  age: yup.number().required(),
  email: yup.string().email().required(),
  phone: yup.string().required(),
})

// Only name and email
const publicSchema = fullSchema.pick(['name', 'email'])

await publicSchema.validate({ name: 'Alice', email: 'a@b.com' })  // Valid
await publicSchema.validate({ name: 'Alice' })  // Error: email required
```

### omit(keys)

Создаёт схему без указанных полей:

```typescript
// Everything except phone
const withoutPhone = fullSchema.omit(['phone'])

await withoutPhone.validate({
  name: 'Alice',
  age: 25,
  email: 'a@b.com',
})  // Valid (phone not required)
```

### partial()

Делает все поля необязательными:

```typescript
const partialSchema = fullSchema.partial()

await partialSchema.validate({})          // Valid (all optional)
await partialSchema.validate({ name: 'Alice' })  // Valid
```

📌 **Важно:** `partial()` снимает `required()` со всех полей, но остальные валидации остаются:

```typescript
const partialSchema = fullSchema.partial()

// email is optional, but if provided must be valid
await partialSchema.validate({ email: 'bad' })  // Error: 'Invalid email'
await partialSchema.validate({ email: 'a@b.com' })  // Valid
```

---

## noUnknown и strict

### noUnknown(message?)

Запрещает поля, не описанные в схеме:

```typescript
const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email(),
}).noUnknown('Unknown field: ${unknown}')

// Without noUnknown: extra fields silently ignored
// With noUnknown: extra fields cause error
await schema.validate(
  { name: 'Alice', email: 'a@b.com', extra: 'field' },
  { strict: true }
)
// Error: 'Unknown field: extra'
```

### stripUnknown

Вместо ошибки можно **удалить** неизвестные поля:

```typescript
const schema = yup.object({
  name: yup.string().required(),
}).noUnknown()

const result = await schema.validate(
  { name: 'Alice', extra: 'field' },
  { stripUnknown: true }
)
// result: { name: 'Alice' } — extra removed
```

### strict и noUnknown

`noUnknown()` работает по-разному в зависимости от `strict`:

```typescript
const schema = yup.object({ name: yup.string() }).noUnknown()

// strict: false (default) — unknown fields are stripped before check
await schema.validate({ name: 'A', extra: 1 })
// Valid: { name: 'A' } — extra stripped

// strict: true — no stripping, noUnknown fires
await schema.validate({ name: 'A', extra: 1 }, { strict: true })
// Error: unknown field
```

🔥 **Ключевое:** В нестрогом режиме `noUnknown()` может не сработать, потому что лишние поля удаляются до проверки. Для строгой валидации API передавайте `{ strict: true }`.

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Забывают abortEarly: false

```typescript
// ❌ Bad: only first error shown
try {
  await schema.validate(data)
} catch (err) {
  console.log(err.message) // Only one error
}

// ✅ Good: collect all errors
try {
  await schema.validate(data, { abortEarly: false })
} catch (err) {
  console.log(err.errors) // All errors
  err.inner.forEach(e => {
    console.log(`${e.path}: ${e.message}`)
  })
}
```

**Почему это проблема:** По умолчанию Yup бросает ошибку на первом невалидном поле. Для форм почти всегда нужны все ошибки сразу.

### ❌ Ошибка 2: Дублируют схемы вместо pick/omit

```typescript
// ❌ Bad: copy-paste full schema
const createUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const updateUserSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  // password not needed for update
})

// ✅ Good: derive from base schema
const baseSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().required(),
})

const updateSchema = baseSchema.omit(['password'])
```

**Почему это проблема:** Дублирование приводит к рассинхронизации — измените правило в одном месте, забудете в другом.

### ❌ Ошибка 3: noUnknown без strict

```typescript
// ❌ Bad: noUnknown without strict — unknown fields stripped before check
const schema = yup.object({ name: yup.string() }).noUnknown()
await schema.validate({ name: 'A', hack: true })
// No error! 'hack' was stripped

// ✅ Good: use strict: true with noUnknown
await schema.validate({ name: 'A', hack: true }, { strict: true })
// Error: unknown field
```

**Почему это проблема:** Без `strict: true` Yup сначала удаляет неизвестные поля, а потом проверяет — `noUnknown()` не находит ничего лишнего.

### ❌ Ошибка 4: Не используют err.inner для путей

```typescript
// ❌ Bad: only err.message — no field paths
catch (err) {
  setError(err.message)
}

// ✅ Good: use err.inner for per-field errors
catch (err) {
  const fieldErrors = {}
  err.inner.forEach(e => {
    fieldErrors[e.path] = e.message
  })
  setErrors(fieldErrors)
}
```

**Почему это проблема:** `err.message` содержит только текст первой ошибки. `err.inner` даёт массив ошибок с путями — именно то, что нужно для форм.

---

## 💡 Best Practices

1. **Всегда используйте `abortEarly: false`** для валидации форм
2. **`err.inner`** для маппинга ошибок на поля формы
3. **`pick()`/`omit()`** вместо дублирования схем для create/update
4. **`partial()`** для PATCH-запросов, где все поля опциональны
5. **`noUnknown()` + `strict: true`** для строгой API-валидации
6. **`stripUnknown: true`** когда нужно молча удалить лишние поля (sanitization)

---

## Что дальше?

В следующем уровне вы изучите:

- Массивы: `array().of()`, `min()`, `max()`, `length()`
- Кортежи: `tuple()` для фиксированных массивов
- Валидация элементов массива
