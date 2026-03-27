# Уровень 7: Кастомные правила и трансформации

## Зачем нужны кастомные правила?

Встроенных валидаторов Yup (required, min, max, matches...) хватает для большинства случаев. Но иногда нужна **своя логика**:
- Проверка ИНН по контрольной сумме
- Валидация через внешний API (уникальность email)
- Нормализация данных перед валидацией (trim пробелов, форматирование телефона)
- Переиспользуемые правила для всего проекта

Yup предлагает три инструмента: `test()`, `transform()` и `addMethod()`.

---

## test() — кастомная валидация

### Базовый синтаксис

`.test(name, message, validator)` добавляет кастомный валидатор:

```typescript
import * as yup from 'yup'

const schema = yup.string().test(
  'no-spaces',                              // name — уникальное имя теста
  'Must not contain spaces',                // message — сообщение об ошибке
  (value) => value == null || !value.includes(' ')  // validator — функция
)

await schema.validate('hello')        // ✅ Valid
await schema.validate('hello world')  // ❌ Error: 'Must not contain spaces'
```

### Validator function

Функция-валидатор должна вернуть:
- `true` — валидация пройдена
- `false` — ошибка (используется сообщение из параметра)
- `ValidationError` — кастомная ошибка (через `createError`)

```typescript
const passwordSchema = yup.string().test(
  'strong-password',
  'Password must contain uppercase, lowercase, and digit',
  (value) => {
    if (!value) return true // let required() handle empty
    return /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)
  }
)
```

📌 **Важно:** Если значение `null` или `undefined`, обычно возвращайте `true` — пусть `required()` обрабатывает обязательность. Иначе вы получите двойные ошибки.

### Async тесты

`test()` поддерживает асинхронные валидаторы — можно проверять через API:

```typescript
const emailSchema = yup.string().email().test(
  'unique-email',
  'This email is already registered',
  async (value) => {
    if (!value) return true
    // Simulate API call
    const response = await fetch(`/api/check-email?email=${value}`)
    const { available } = await response.json()
    return available
  }
)

// Must use validateAsync for async tests
await emailSchema.validate('test@example.com')
```

🔥 **Ключевое:** Если хотя бы один `test()` в схеме асинхронный, **вся** валидация должна быть через `await schema.validate()` (не `validateSync`).

### createError для кастомных сообщений

Внутри теста можно создать ошибку с динамическим сообщением:

```typescript
const ageSchema = yup.number().test(
  'valid-age',
  'Invalid age',
  function (value) {
    if (!value) return true
    if (value < 0) {
      return this.createError({ message: `Age cannot be negative: ${value}` })
    }
    if (value > 150) {
      return this.createError({ message: `Age ${value} seems unrealistic` })
    }
    return true
  }
)
```

⚠️ **Внимание:** Для доступа к `this.createError()` используйте **обычную функцию** (`function`), не стрелочную (`=>`).

---

## transform() — трансформация данных

### Как работает transform

`.transform()` изменяет данные **перед** валидацией:

```typescript
const schema = yup.string()
  .transform((value) => value?.trim().toLowerCase())
  .email('Enter valid email')

schema.cast('  HELLO@EXAMPLE.COM  ')  // 'hello@example.com'
await schema.validate('  HELLO@EXAMPLE.COM  ')  // ✅ Valid: 'hello@example.com'
```

### Порядок: transform → validate

```typescript
const phoneSchema = yup.string()
  .transform((value) => {
    if (!value) return value
    // Remove non-digit characters
    return value.replace(/\D/g, '')
  })
  .matches(/^\d{10,11}$/, 'Phone must be 10-11 digits')

phoneSchema.cast('+7 (999) 123-45-67')  // '79991234567'
await phoneSchema.validate('+7 (999) 123-45-67')  // ✅ Valid
```

### Параметры transform

Transform получает два аргумента: текущее значение и оригинальное:

```typescript
const schema = yup.number()
  .transform((value, originalValue) => {
    // originalValue — то, что пришло на вход (до приведения типов)
    if (typeof originalValue === 'string' && originalValue.includes(',')) {
      // Replace comma with dot for European notation
      return parseFloat(originalValue.replace(',', '.'))
    }
    return value
  })

schema.cast('3,14')  // 3.14
```

💡 **Подсказка:** `transform()` полезен для нормализации данных из форм, где пользователь может ввести данные в неожиданном формате.

---

## addMethod() — расширение Yup

### Зачем нужен addMethod

Если один и тот же `test()` или `transform()` используется в нескольких схемах — вынесите его в метод:

```typescript
import { addMethod, string } from 'yup'

// TypeScript: extend the interface
declare module 'yup' {
  interface StringSchema {
    phone(message?: string): this
  }
}

// Add the method
addMethod(string, 'phone', function (message = 'Invalid phone number') {
  return this
    .transform((value) => value?.replace(/\D/g, ''))
    .test('phone', message, (value) => !value || /^\d{10,11}$/.test(value))
})

// Use it like a built-in method!
const schema = yup.string().phone().required()
await schema.validate('+7 (999) 123-45-67')  // ✅ Valid
```

### addMethod с параметрами

```typescript
declare module 'yup' {
  interface StringSchema {
    noWords(words: string[], message?: string): this
  }
}

addMethod(string, 'noWords', function (words: string[], message?: string) {
  return this.test(
    'no-words',
    message || `Must not contain: ${words.join(', ')}`,
    (value) => {
      if (!value) return true
      const lower = value.toLowerCase()
      return !words.some((word) => lower.includes(word.toLowerCase()))
    }
  )
})

const schema = yup.string().noWords(['spam', 'test'])
await schema.validate('Hello world')      // ✅
await schema.validate('This is a test')   // ❌ 'Must not contain: spam, test'
```

### addMethod для numbers

```typescript
declare module 'yup' {
  interface NumberSchema {
    even(message?: string): this
  }
}

addMethod(yup.number, 'even', function (message = 'Must be even') {
  return this.test('even', message, (value) => value == null || value % 2 === 0)
})

const schema = yup.number().even().positive()
await schema.validate(4)   // ✅
await schema.validate(3)   // ❌ 'Must be even'
```

📌 **Важно:** `addMethod` регистрируется **глобально** — после вызова метод доступен во всех схемах этого типа. Вызывайте `addMethod` при инициализации приложения.

---

## Цепочки трансформаций

### Несколько transform + test

Трансформации и тесты выполняются **в порядке объявления**:

```typescript
const usernameSchema = yup.string()
  .transform((value) => value?.trim())                   // 1. trim
  .transform((value) => value?.toLowerCase())             // 2. lowercase
  .test('no-spaces', 'No spaces allowed',
    (value) => !value || !value.includes(' '))             // 3. test
  .min(3, 'At least 3 characters')                        // 4. built-in
  .max(20, 'At most 20 characters')                       // 5. built-in
  .matches(/^[a-z0-9_]+$/, 'Only letters, digits, _')     // 6. built-in

usernameSchema.cast('  Hello_World  ')  // 'hello_world'
await usernameSchema.validate('  Hello_World  ')  // ✅ Valid: 'hello_world'
```

### Трансформация объектов

```typescript
const formSchema = yup.object({
  email: yup.string()
    .transform((v) => v?.trim().toLowerCase())
    .email()
    .required(),
  phone: yup.string()
    .transform((v) => v?.replace(/\D/g, ''))
    .matches(/^\d{10,11}$/, 'Invalid phone')
    .required(),
  name: yup.string()
    .transform((v) => v?.trim().replace(/\s+/g, ' '))  // normalize spaces
    .required()
    .min(2),
})

const result = formSchema.cast({
  email: '  USER@EXAMPLE.COM  ',
  phone: '+7 (999) 123-45-67',
  name: '  John    Doe  ',
})
// { email: 'user@example.com', phone: '79991234567', name: 'John Doe' }
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Стрелочная функция с this.createError

```typescript
// ❌ Bad: arrow function loses 'this' context
const schema = yup.string().test('custom', 'Error', (value) => {
  return this.createError({ message: 'custom' })  // this is undefined!
})

// ✅ Good: use regular function
const schema = yup.string().test('custom', 'Error', function (value) {
  return this.createError({ message: `${value} is invalid` })
})
```

**Почему это проблема:** `this` в стрелочной функции указывает на внешний контекст, а не на контекст теста Yup. Используйте `function` для доступа к `this.createError()`, `this.path`, `this.parent`.

### ❌ Ошибка 2: Валидация пустого значения в test без учёта required

```typescript
// ❌ Bad: test fails on undefined, conflicting with optional()
const schema = yup.string().test(
  'is-valid',
  'Invalid format',
  (value) => /^[A-Z]+$/.test(value!)  // crashes on undefined!
)

// ✅ Good: handle null/undefined in test
const schema = yup.string().test(
  'is-valid',
  'Invalid format',
  (value) => !value || /^[A-Z]+$/.test(value)
)
```

**Почему это проблема:** `test()` вызывается для ЛЮБОГО значения, включая undefined. Всегда проверяйте `!value` перед основной логикой.

### ❌ Ошибка 3: Transform после test — тест получает нетрансформированные данные

```typescript
// ❌ Bad: test runs BEFORE transform
const schema = yup.string()
  .test('no-spaces', 'No spaces', (v) => !v?.includes(' '))
  .transform((v) => v?.trim())  // trim happens AFTER test!

// ✅ Good: transform BEFORE test
const schema = yup.string()
  .transform((v) => v?.trim())
  .test('no-spaces', 'No spaces', (v) => !v?.includes(' '))
```

**Почему это проблема:** Yup выполняет цепочку слева направо. Если transform после test, то тест получит сырые данные. Ставьте `transform()` перед `test()`.

### ❌ Ошибка 4: addMethod не расширяет TypeScript-интерфейс

```typescript
// ❌ Bad: TypeScript error — 'phone' does not exist
addMethod(string, 'phone', function () { ... })
const schema = yup.string().phone()  // TS Error!

// ✅ Good: declare module extension
declare module 'yup' {
  interface StringSchema {
    phone(message?: string): this
  }
}
addMethod(string, 'phone', function (message?: string) { ... })
const schema = yup.string().phone()  // ✅ No TS error
```

**Почему это проблема:** TypeScript не знает о методах, добавленных через `addMethod`. Нужно расширить интерфейс через `declare module`.

---

## 💡 Best Practices

1. **`test()` для валидации, `transform()` для преобразования** — не смешивайте
2. **Обрабатывайте null/undefined в test** — пусть `required()` отвечает за обязательность
3. **transform() перед test()** — тест должен получать нормализованные данные
4. **addMethod() для переиспользуемых правил** — не дублируйте test/transform
5. **Обычная function для this.createError** — стрелочные функции теряют контекст
6. **Async test — только с await validate** — `validateSync` не поддерживает async

---

## Что дальше?

В следующем уровне вы изучите:

- `ref()` — ссылки на другие поля (подтверждение пароля)
- `lazy()` — динамические и рекурсивные схемы
- `InferType` — вывод TypeScript-типов из схем
- Финальный проект — комплексная система валидации
