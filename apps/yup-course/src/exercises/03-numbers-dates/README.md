# Уровень 3: Числа и даты

## Числовые валидации

Yup предоставляет богатый набор методов для работы с числовыми данными — от простых ограничений диапазона до трансформаций, которые позволяют автоматически приводить числа к нужному формату.

---

## min, max — ограничения диапазона

### min(limit, message?)

Значение должно быть **больше или равно** `limit`:

```typescript
const schema = yup.number().min(0, 'Must be non-negative')

await schema.validate(0)    // Valid: 0
await schema.validate(42)   // Valid: 42
await schema.validate(-1)   // Error: 'Must be non-negative'
```

### max(limit, message?)

Значение должно быть **меньше или равно** `limit`:

```typescript
const schema = yup.number().max(100, 'Max is 100')

await schema.validate(100)  // Valid: 100
await schema.validate(101)  // Error: 'Max is 100'
```

### moreThan и lessThan — строгие сравнения

В отличие от `min`/`max`, эти методы используют **строгое** сравнение (без включения границы):

```typescript
const schema = yup.number()
  .moreThan(0, 'Must be greater than 0')    // > 0, NOT >= 0
  .lessThan(100, 'Must be less than 100')   // < 100, NOT <= 100

await schema.validate(0)    // Error: 'Must be greater than 0'
await schema.validate(1)    // Valid
await schema.validate(99)   // Valid
await schema.validate(100)  // Error: 'Must be less than 100'
```

🔥 **Ключевое:** `min(0)` разрешает ноль, `moreThan(0)` — нет. Выбирайте в зависимости от бизнес-логики.

---

## positive и negative

### positive(message?)

Значение должно быть строго больше нуля:

```typescript
const priceSchema = yup.number().positive('Price must be positive')

await priceSchema.validate(10)   // Valid
await priceSchema.validate(0)    // Error (zero is NOT positive)
await priceSchema.validate(-5)   // Error
```

📌 **Важно:** `positive()` эквивалентен `moreThan(0)`. Ноль не считается положительным числом!

### negative(message?)

Значение должно быть строго меньше нуля:

```typescript
const debtSchema = yup.number().negative('Must be negative')

await debtSchema.validate(-100)  // Valid
await debtSchema.validate(0)     // Error (zero is NOT negative)
await debtSchema.validate(50)    // Error
```

---

## integer и truncate

### integer(message?)

**Валидация**: проверяет, что число целое:

```typescript
const quantitySchema = yup.number().integer('Must be a whole number')

await quantitySchema.validate(5)     // Valid
await quantitySchema.validate(3.14)  // Error: 'Must be a whole number'
await quantitySchema.validate(0)     // Valid
```

### truncate()

**Трансформация**: отбрасывает дробную часть (как `Math.trunc`):

```typescript
const schema = yup.number().truncate()

schema.cast(3.7)   // 3
schema.cast(-2.9)  // -2
schema.cast(5)     // 5 (no change)
```

### round(type?)

**Трансформация**: округляет число. Принимает метод округления:

```typescript
const floorSchema = yup.number().round('floor')
const ceilSchema = yup.number().round('ceil')
const roundSchema = yup.number().round('round')  // default

floorSchema.cast(3.7)   // 3
ceilSchema.cast(3.2)    // 4
roundSchema.cast(3.5)   // 4
roundSchema.cast(3.4)   // 3
```

💡 **Подсказка:** `truncate()` всегда отбрасывает дробную часть (как `Math.trunc`), а `round()` позволяет выбрать стратегию округления.

---

## Валидация дат

### date()

Создаёт схему для дат. По умолчанию парсит ISO-строки и объекты `Date`:

```typescript
const schema = yup.date()

await schema.isValid(new Date())          // true
await schema.isValid('2024-01-15')        // true (ISO string)
await schema.isValid('not a date')        // false
await schema.isValid('2024-13-45')        // false (invalid date)
```

📌 **Важно:** Yup автоматически преобразует строки в объекты `Date` через конструктор `new Date()`. Невалидные даты (Invalid Date) не пройдут проверку.

### min и max для дат

```typescript
const birthdaySchema = yup.date()
  .required('Date is required')
  .max(new Date(), 'Cannot be in the future')
  .min(new Date('1900-01-01'), 'Too far in the past')

// Birthday must be between 1900-01-01 and today
await birthdaySchema.validate('2000-05-15')   // Valid
await birthdaySchema.validate('2099-01-01')   // Error: future date
await birthdaySchema.validate('1899-12-31')   // Error: too far
```

### Дата в будущем

```typescript
const eventSchema = yup.date()
  .required('Event date is required')
  .min(new Date(), 'Event must be in the future')

await eventSchema.validate('2030-12-25')  // Valid
await eventSchema.validate('2020-01-01')  // Error: in the past
```

---

## Диапазоны дат и yup.ref()

Для кросс-полевой валидации (когда одно поле зависит от другого) используется `yup.ref()`:

```typescript
const dateRangeSchema = yup.object({
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date()
    .required('End date is required')
    .min(yup.ref('startDate'), 'End must be after start'),
})

// Valid: end > start
await dateRangeSchema.validate({
  startDate: '2024-01-01',
  endDate: '2024-12-31',
})

// Error: end < start
await dateRangeSchema.validate({
  startDate: '2024-12-31',
  endDate: '2024-01-01',
})
// Error: 'End must be after start'
```

🔥 **Ключевое:** `yup.ref('fieldName')` создаёт ссылку на значение другого поля в той же объектной схеме. Это основа для перекрёстной валидации.

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Путают positive() и min(0)

```typescript
// ❌ Bad: positive() rejects 0
const schema = yup.number().positive()
await schema.validate(0)  // Error!

// ✅ Good: use min(0) if zero is allowed
const schema = yup.number().min(0, 'Must be >= 0')
await schema.validate(0)  // Valid
```

**Почему это проблема:** `positive()` — это `moreThan(0)`, поэтому ноль не проходит. Если ноль допустим (например, «количество товара»), используйте `min(0)`.

### ❌ Ошибка 2: integer() не трансформирует

```typescript
// ❌ Bad: expecting integer() to round the number
const schema = yup.number().integer()
await schema.validate(3.7)  // Error, NOT 4!

// ✅ Good: use truncate() or round() before integer()
const schema = yup.number().truncate().integer()
schema.cast(3.7)  // 3 (truncated, then passes integer check)
```

**Почему это проблема:** `integer()` — это **валидация**, не трансформация. Она проверяет, но не преобразует. Для преобразования используйте `truncate()` или `round()`.

### ❌ Ошибка 3: Строки вместо чисел

```typescript
// ❌ Bad: passing string to number schema
const schema = yup.number().min(0)
await schema.validate('42')  // Works due to coercion, but risky

// ✅ Good: ensure proper type or use transform
const schema = yup.number()
  .transform((value, original) => {
    return original === '' ? undefined : value
  })
  .required()
```

**Почему это проблема:** Yup приводит строки к числам автоматически, но пустая строка `''` превращается в `NaN`. Обрабатывайте пустые строки через `transform`.

### ❌ Ошибка 4: Динамические даты в min/max

```typescript
// ❌ Bad: date is captured once at schema creation
const schema = yup.date().min(new Date())
// new Date() computed once — stale after a while

// ✅ Good: wrap in a function for lazy evaluation
const schema = yup.date().min(
  yup.ref('$now'),  // pass via context
  'Must be in the future'
)
// or re-create schema when needed
```

**Почему это проблема:** `new Date()` вычисляется один раз при создании схемы. Если схема долгоживущая (например, в компоненте), «текущая дата» устареет.

---

## 💡 Best Practices

1. **`positive()` для цен, `min(0)` для количества** — решайте, допустим ли ноль
2. **`integer()` для валидации, `truncate()`/`round()` для трансформации** — не путайте
3. **Обрабатывайте пустые строки** через `transform` для числовых полей из форм
4. **`yup.ref()` для кросс-полевой валидации** — «конец больше начала»
5. **Используйте `moreThan`/`lessThan` для строгих сравнений** — когда граница недопустима
6. **Кастомные сообщения об ошибках** должны содержать конкретику: `min(18, 'Must be at least 18')`, а не `min(18)`

---

## Что дальше?

В следующем уровне вы изучите:

- Объектные схемы: `object().shape()`
- Вложенные объекты
- Композиция схем: `pick()`, `omit()`, `partial()`
- Строгий режим: `noUnknown()` и `strict()`
