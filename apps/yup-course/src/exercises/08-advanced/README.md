# Уровень 8: Продвинутые техники

## Обзор

Этот финальный уровень охватывает продвинутые возможности Yup:
- `ref()` — ссылки на другие поля для кросс-валидации
- `lazy()` — динамические и рекурсивные схемы
- `InferType` — выведение TypeScript-типов из схем
- Финальный проект — комплексная система валидации

---

## ref() — ссылки на другие поля

### Базовое использование

`yup.ref('field')` создаёт ссылку на значение другого поля в той же схеме:

```typescript
import * as yup from 'yup'

const schema = yup.object({
  password: yup.string().required().min(8),
  confirmPassword: yup.string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),
})

await schema.validate({
  password: 'MyPass123',
  confirmPassword: 'MyPass123',
})  // ✅ Valid

await schema.validate({
  password: 'MyPass123',
  confirmPassword: 'Different',
})  // ❌ Error: 'Passwords must match'
```

### ref в числовых сравнениях

```typescript
const rangeSchema = yup.object({
  minPrice: yup.number().required().min(0),
  maxPrice: yup.number()
    .required()
    .moreThan(yup.ref('minPrice'), 'Max must be greater than min'),
})

const dateSchema = yup.object({
  startDate: yup.date().required(),
  endDate: yup.date()
    .required()
    .min(yup.ref('startDate'), 'End date must be after start date'),
})
```

### Контекст ($prefix)

Ссылки с `$` обращаются к **контексту**, а не к полям схемы:

```typescript
const schema = yup.object({
  discount: yup.number()
    .max(yup.ref('$maxDiscount'), 'Discount exceeds maximum allowed'),
})

await schema.validate(
  { discount: 50 },
  { context: { maxDiscount: 100 } }
)  // ✅ Valid

await schema.validate(
  { discount: 150 },
  { context: { maxDiscount: 100 } }
)  // ❌ Error: 'Discount exceeds maximum allowed'
```

🔥 **Ключевое:** Контекст (`$`) позволяет передать внешние данные в валидацию, не включая их в саму схему. Это решает проблему циклических зависимостей.

---

## lazy() — динамические и рекурсивные схемы

### Зачем нужен lazy

`yup.lazy()` создаёт схему **на лету**, основываясь на значении:

```typescript
import { lazy, string, number, object } from 'yup'

// Schema depends on actual value type
const flexibleSchema = lazy((value) => {
  if (typeof value === 'number') {
    return number().min(0).max(100)
  }
  return string().required()
})

await flexibleSchema.validate(42)       // ✅ number, valid
await flexibleSchema.validate('hello')  // ✅ string, valid
await flexibleSchema.validate(-1)       // ❌ number, min 0
```

### Рекурсивные схемы

Главная сила `lazy()` — рекурсия. Например, дерево комментариев:

```typescript
interface TreeNode {
  id: number
  label: string
  children: TreeNode[]
}

const nodeSchema: yup.ObjectSchema<TreeNode> = yup.object({
  id: yup.number().required(),
  label: yup.string().required(),
  children: yup.array().of(
    yup.lazy(() => nodeSchema.default(undefined)) as yup.Schema<TreeNode>
  ).default([]),
})

await nodeSchema.validate({
  id: 1,
  label: 'Root',
  children: [
    {
      id: 2,
      label: 'Child',
      children: [
        { id: 3, label: 'Grandchild', children: [] },
      ],
    },
  ],
})  // ✅ Valid
```

📌 **Важно:** При рекурсии обязательно используйте `.default(undefined)` внутри `lazy()`, иначе Yup попадёт в бесконечный цикл при попытке определить дефолтное значение.

### lazy() по значению поля

```typescript
const dynamicSchema = yup.object({
  type: yup.string().oneOf(['text', 'number', 'email']).required(),
  value: yup.lazy((_value, { parent }) => {
    switch (parent.type) {
      case 'number':
        return yup.number().required()
      case 'email':
        return yup.string().email().required()
      default:
        return yup.string().required()
    }
  }),
})
```

💡 **Подсказка:** Второй аргумент `lazy()` содержит `{ parent, path, value }` — можно обращаться к соседним полям.

---

## InferType — TypeScript-типы из схем

### Базовое использование

`InferType` выводит TypeScript-тип из Yup-схемы:

```typescript
import { object, string, number, InferType } from 'yup'

const userSchema = object({
  name: string().required(),
  age: number().required().positive(),
  email: string().email().optional(),
  role: string().oneOf(['admin', 'user'] as const).required(),
})

type User = InferType<typeof userSchema>
// type User = {
//   name: string
//   age: number
//   email?: string | undefined
//   role: 'admin' | 'user'
// }
```

### Optional, nullable и default

```typescript
const schema = object({
  required: string().required(),           // string
  optional: string().optional(),           // string | undefined
  nullable: string().nullable().required(), // string | null
  withDefault: string().default('hello'),  // string (always has value)
  defined: string().defined(),             // string (not undefined)
})

type Result = InferType<typeof schema>
// {
//   required: string
//   optional?: string | undefined
//   nullable: string | null
//   withDefault: string
//   defined: string
// }
```

### ObjectSchema для проверки совместимости

Можно привязать схему к существующему интерфейсу:

```typescript
import { ObjectSchema, object, string, number } from 'yup'

interface Product {
  name: string
  price: number
  sku: string
}

// TypeScript проверит, что схема соответствует интерфейсу
const productSchema: ObjectSchema<Product> = object({
  name: string().required(),
  price: number().required().positive(),
  sku: string().required(),
})
```

🔥 **Ключевое:** `ObjectSchema<T>` гарантирует, что ваша схема соответствует интерфейсу `T`. Если вы забудете поле или укажете неправильный тип — TypeScript покажет ошибку.

### Generic-функции со схемами

```typescript
async function validateData<T>(
  schema: yup.Schema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: string[] }> {
  try {
    const validated = await schema.validate(data, { abortEarly: false })
    return { success: true, data: validated }
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return { success: false, errors: err.errors }
    }
    throw err
  }
}

const result = await validateData(userSchema, unknownData)
if (result.success) {
  console.log(result.data.name)  // TypeScript knows it's User
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: ref к несуществующему полю

```typescript
// ❌ Bad: 'password' not in this schema
const confirmSchema = yup.string()
  .oneOf([yup.ref('password')], 'Must match')  // ref won't resolve!

// ✅ Good: ref works within the same object schema
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Must match'),
})
```

**Почему это проблема:** `ref()` разрешается относительно ближайшего родительского `object()`. Вне object — ссылка не найдёт поле.

### ❌ Ошибка 2: lazy без default для рекурсии

```typescript
// ❌ Bad: infinite loop when resolving defaults
const nodeSchema = yup.object({
  children: yup.array().of(
    yup.lazy(() => nodeSchema)  // infinite recursion!
  ),
})

// ✅ Good: add .default(undefined)
const nodeSchema = yup.object({
  children: yup.array().of(
    yup.lazy(() => nodeSchema.default(undefined))
  ).default([]),
})
```

**Почему это проблема:** Yup пытается вычислить дефолтное значение рекурсивно. Без `.default(undefined)` это бесконечный цикл.

### ❌ Ошибка 3: InferType с non-const oneOf

```typescript
// ❌ Bad: type is just 'string'
const schema = yup.string().oneOf(['admin', 'user'])
type Role = InferType<typeof schema>  // string | undefined

// ✅ Good: use 'as const' for literal types
const schema = yup.string().oneOf(['admin', 'user'] as const)
type Role = InferType<typeof schema>  // 'admin' | 'user' | undefined
```

**Почему это проблема:** Без `as const` TypeScript расширяет литеральные типы до `string`. С `as const` — сохраняет точные значения.

### ❌ Ошибка 4: Путают ref и when для кросс-валидации

```typescript
// ❌ Not ideal: when for simple comparison
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string().when('password', ([password], schema) =>
    schema.test('match', 'Must match', (v) => v === password)
  ),
})

// ✅ Better: ref for simple field references
const schema = yup.object({
  password: yup.string().required(),
  confirm: yup.string()
    .oneOf([yup.ref('password')], 'Must match'),
})
```

**Почему это проблема:** `ref()` проще и читаемее для простых сравнений. `when()` — для условной логики (разные правила в зависимости от значения).

---

## 💡 Best Practices

1. **`ref()` для сравнений между полями** — пароль/подтверждение, min/max, даты
2. **Контекст `$` для внешних данных** — конфигурация, роли пользователя, feature flags
3. **`lazy()` для рекурсии** — деревья, вложенные комментарии, произвольная глубина
4. **`InferType` вместо ручных интерфейсов** — DRY: одна схема = один тип
5. **`as const` с `oneOf`** — для получения литеральных типов
6. **`ObjectSchema<T>` для проверки совместимости** — гарантия соответствия схемы интерфейсу

---

## Финальный проект

В последнем задании этого уровня вы создадите **комплексную систему валидации** регистрации пользователя, объединив все изученные техники:
- Примитивы, строки, числа, даты
- Объекты и массивы
- Условная валидация (when)
- Кастомные правила (test, transform)
- Ссылки (ref) и типы (InferType)
