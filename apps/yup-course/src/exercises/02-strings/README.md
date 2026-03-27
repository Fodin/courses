# Уровень 2: Строковая валидация

## Встроенные строковые валидации

Yup предоставляет набор готовых методов для валидации распространённых форматов строк. Это избавляет от необходимости писать регулярные выражения вручную для типичных случаев.

---

## email() и url()

### email()

Проверяет, что строка является валидным email-адресом:

```typescript
const emailSchema = yup.string().email('Invalid email format')

await emailSchema.validate('user@example.com')   // Valid
await emailSchema.validate('user@domain')         // Error (no TLD)
await emailSchema.validate('user.name@co.uk')     // Valid
await emailSchema.validate('@example.com')        // Error
await emailSchema.validate('user@')               // Error
```

📌 **Важно:** `email()` использует упрощённую проверку (regex), а не полную спецификацию RFC 5322. Для большинства случаев этого достаточно.

### url()

Проверяет, что строка является валидным URL:

```typescript
const urlSchema = yup.string().url('Invalid URL')

await urlSchema.validate('https://example.com')       // Valid
await urlSchema.validate('http://localhost:3000')      // Valid
await urlSchema.validate('ftp://files.example.com')   // Valid
await urlSchema.validate('example.com')               // Error (no protocol)
await urlSchema.validate('not a url')                 // Error
```

💡 **Подсказка:** `url()` требует протокол (`http://`, `https://`, `ftp://`). Просто `example.com` не пройдёт валидацию.

---

## Ограничения длины: min, max, length

### min(limit, message?)

Минимальная длина строки:

```typescript
const schema = yup.string().min(3, 'At least 3 characters')

await schema.validate('Hi')    // Error: 'At least 3 characters'
await schema.validate('Hey')   // Valid (length 3)
await schema.validate('Hello') // Valid (length 5)
```

### max(limit, message?)

Максимальная длина строки:

```typescript
const schema = yup.string().max(10, 'At most 10 characters')

await schema.validate('Hello')           // Valid
await schema.validate('Hello World!')    // Error: 'At most 10 characters'
```

### length(limit, message?)

Точная длина строки:

```typescript
const pinSchema = yup.string().length(4, 'PIN must be exactly 4 digits')

await pinSchema.validate('1234')  // Valid
await pinSchema.validate('123')   // Error
await pinSchema.validate('12345') // Error
```

🔥 **Ключевое:** Комбинируйте для гибких ограничений:

```typescript
// Username: 3-20 characters
const usernameSchema = yup.string()
  .required('Username is required')
  .min(3, 'Too short')
  .max(20, 'Too long')

// ISO country code: exactly 2 characters
const countrySchema = yup.string()
  .required()
  .length(2, 'Must be 2-letter country code')
  .uppercase()
```

---

## matches() — проверка по регулярному выражению

`matches(regex, message?)` позволяет валидировать строку по произвольному паттерну:

```typescript
// Russian phone number
const phoneSchema = yup.string()
  .required('Phone is required')
  .matches(/^\+7\d{10}$/, 'Phone must be +7XXXXXXXXXX')

await phoneSchema.validate('+79001234567') // Valid
await phoneSchema.validate('89001234567')  // Error
await phoneSchema.validate('+7123')        // Error

// Password with requirements
const passwordSchema = yup.string()
  .required()
  .matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Must contain lowercase, uppercase, and number'
  )

await passwordSchema.validate('Password1')  // Valid
await passwordSchema.validate('password')   // Error (no uppercase, no digit)
```

### Опции matches

`matches()` принимает второй аргумент — объект с опциями:

```typescript
const schema = yup.string().matches(/^[a-z]+$/, {
  message: 'Only lowercase letters',
  excludeEmptyString: true,  // Don't fail on empty string
})

await schema.validate('')     // Valid (empty excluded)
await schema.validate('abc')  // Valid
await schema.validate('ABC')  // Error
```

💡 **Подсказка:** `excludeEmptyString: true` полезна, когда поле необязательное, но если заполнено — должно соответствовать паттерну.

---

## Трансформации: trim, lowercase, uppercase

Yup может не только валидировать, но и **преобразовывать** строки. Трансформации применяются на этапе `cast` (приведения типов).

### trim()

Убирает пробелы в начале и конце:

```typescript
const schema = yup.string().trim()

schema.cast('  hello  ')  // 'hello'
schema.cast('hello')      // 'hello' (no change)
```

### lowercase()

Преобразует в нижний регистр:

```typescript
const schema = yup.string().lowercase()

schema.cast('HELLO')      // 'hello'
schema.cast('Hello World') // 'hello world'
```

### uppercase()

Преобразует в верхний регистр:

```typescript
const schema = yup.string().uppercase()

schema.cast('hello')       // 'HELLO'
schema.cast('Hello World') // 'HELLO WORLD'
```

### Комбинация трансформаций

```typescript
const emailSchema = yup.string()
  .trim()
  .lowercase()
  .email('Invalid email')
  .required('Email is required')

// User enters: '  USER@EXAMPLE.COM  '
const result = await emailSchema.validate('  USER@EXAMPLE.COM  ')
// result: 'user@example.com' (trimmed + lowercased + validated)
```

📌 **Важно:** Трансформации применяются **перед** валидацией. Поэтому `trim().min(3)` сначала обрежет пробелы, а потом проверит длину:

```typescript
const schema = yup.string().trim().min(3)

await schema.validate('  ab  ')
// After trim: 'ab' (length 2) → Error: min 3
```

---

## Strict mode и трансформации

В strict-режиме трансформации **не применяются**, а значение проверяется как есть:

```typescript
const schema = yup.string().lowercase()

// Normal mode: transforms then validates
await schema.validate('HELLO')                    // 'hello' (transformed)

// Strict mode: no transforms, fails if not already lowercase
await schema.validate('HELLO', { strict: true })  // Error!
await schema.validate('hello', { strict: true })  // 'hello' (already lowercase)
```

🔥 **Ключевое:** Используйте `strict: true` когда хотите **проверить**, что значение уже в нужном формате, а не **преобразовать** его.

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Используют matches() для email и url

```typescript
// ❌ Bad: reinventing the wheel
const emailSchema = yup.string().matches(
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  'Invalid email'
)

// ✅ Good: use built-in method
const emailSchema = yup.string().email('Invalid email')
```

**Почему это проблема:** Встроенные методы `email()` и `url()` уже содержат проверенные паттерны. Свой regex легко написать неправильно.

### ❌ Ошибка 2: Забывают, что trim() — трансформация, а не валидация

```typescript
// ❌ Bad: expecting trim() to fail on spaces
const schema = yup.string().trim().required()
await schema.validate('   ')
// Result: '' after trim → Error from required() (empty string)
// But NOT an error from trim() itself!

// ✅ Good: trim() transforms, required() validates
// If you want to reject spaces, use matches:
const strictSchema = yup.string().matches(/^\S.*\S$/, 'No leading/trailing spaces')
```

**Почему это проблема:** `trim()` убирает пробелы, но не вызывает ошибку. Если нужно **запретить** пробелы — используйте `matches()` или `strict: true`.

### ❌ Ошибка 3: Неправильный порядок: трансформация после валидации

```typescript
// ❌ Bad: min() checked before trim() in this mental model
// (actually Yup applies ALL transforms first, then ALL validations)
const schema = yup.string().min(3).trim()

// BUT this is fine in Yup — transforms always run before validations
// Just be aware that order of trim() in chain doesn't matter for execution
```

**Почему это проблема:** В Yup трансформации всегда выполняются до валидаций, независимо от порядка в цепочке. Но для читаемости лучше писать трансформации первыми:

```typescript
// ✅ Good: transforms first, then validations
yup.string().trim().lowercase().min(3).max(50).required()
```

### ❌ Ошибка 4: url() без протокола

```typescript
// ❌ Bad: user enters domain without protocol
await urlSchema.validate('example.com') // Error!

// ✅ Good: tell users to include protocol, or transform:
const schema = yup.string()
  .transform((value) => {
    if (value && !value.startsWith('http')) {
      return `https://${value}`
    }
    return value
  })
  .url('Invalid URL')
```

**Почему это проблема:** `url()` требует протокол. Если пользователи часто вводят домены без `https://`, добавьте трансформацию.

---

## 💡 Best Practices

1. **Используйте встроенные методы** (`email()`, `url()`) вместо кастомных regex
2. **Комбинируйте трансформации** — `trim().lowercase()` для email-полей
3. **Пишите трансформации первыми** в цепочке для читаемости
4. **Используйте `excludeEmptyString`** в `matches()` для необязательных полей
5. **strict-режим** для проверки без преобразования (API-валидация)
6. **Всегда указывайте кастомные сообщения** — `min(3, 'Too short')` лучше стандартного

---

## Что дальше?

В следующем уровне вы изучите:

- Числовые валидации: `min()`, `max()`, `positive()`, `negative()`, `integer()`
- Валидации дат: `min()`, `max()`, диапазоны
- Числовые трансформации: `round()`, `truncate()`
