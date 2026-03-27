# Уровень 5: Массивы и кортежи

## Зачем валидировать массивы?

Массивы — одна из самых распространённых структур данных: теги, роли, список товаров, координаты. Yup позволяет валидировать как сам массив (длина, обязательность), так и каждый его элемент.

---

## array().of() — базовая валидация массива

### Создание массивной схемы

`yup.array()` создаёт схему массива. Метод `.of()` задаёт схему для каждого элемента:

```typescript
// Array of strings
const tagsSchema = yup.array().of(
  yup.string().required('Tag cannot be empty')
)

await tagsSchema.validate(['react', 'yup'])     // Valid
await tagsSchema.validate(['react', ''])         // Error: element invalid
await tagsSchema.validate('not an array')        // Error: type mismatch
```

### Массив объектов

```typescript
const itemsSchema = yup.array().of(
  yup.object({
    id: yup.number().required(),
    name: yup.string().required(),
    price: yup.number().positive().required(),
  })
)

await itemsSchema.validate([
  { id: 1, name: 'Widget', price: 9.99 },
  { id: 2, name: 'Gadget', price: 24.99 },
])  // Valid
```

### Массив чисел

```typescript
const scoresSchema = yup.array().of(
  yup.number().required().min(0).max(100)
)

await scoresSchema.validate([85, 92, 78])   // Valid
await scoresSchema.validate([85, -5, 78])   // Error: -5 < 0
await scoresSchema.validate([85, 101, 78])  // Error: 101 > 100
```

🔥 **Ключевое:** `.of()` применяет схему к **каждому** элементу массива. Если хотя бы один элемент невалиден — весь массив невалиден.

---

## Ограничения длины: min, max, length

### min(limit, message?)

Минимальное количество элементов:

```typescript
const schema = yup.array()
  .of(yup.string().required())
  .min(1, 'At least one item required')

await schema.validate([])          // Error: 'At least one item required'
await schema.validate(['hello'])   // Valid
```

### max(limit, message?)

Максимальное количество элементов:

```typescript
const schema = yup.array()
  .of(yup.string().required())
  .max(5, 'Maximum 5 items allowed')

await schema.validate(['a', 'b', 'c'])                   // Valid (3)
await schema.validate(['a', 'b', 'c', 'd', 'e', 'f'])   // Error (6 > 5)
```

### length(limit, message?)

Точное количество элементов:

```typescript
const teamSchema = yup.array()
  .of(yup.string().required())
  .length(5, 'Team must have exactly 5 members')

await teamSchema.validate(['a', 'b', 'c', 'd', 'e'])   // Valid
await teamSchema.validate(['a', 'b'])                    // Error (2 !== 5)
```

### Комбинация

```typescript
const rolesSchema = yup.array()
  .of(yup.string().required())
  .required('Roles are required')
  .min(1, 'At least 1 role')
  .max(3, 'Max 3 roles')

await rolesSchema.validate(['admin', 'editor'])  // Valid
await rolesSchema.validate([])                    // Error: min 1
await rolesSchema.validate(['a', 'b', 'c', 'd']) // Error: max 3
```

---

## compact() и ensure()

### compact()

Удаляет «falsy» значения из массива (трансформация):

```typescript
const schema = yup.array().of(yup.string()).compact()

schema.cast(['hello', '', null, 'world', false, undefined])
// Result: ['hello', 'world']
```

### ensure()

Гарантирует, что значение станет массивом:

```typescript
const schema = yup.array().of(yup.number()).ensure()

schema.cast(null)       // []
schema.cast(undefined)  // []
schema.cast(42)         // [42]
schema.cast([1, 2])     // [1, 2]
```

💡 **Подсказка:** `ensure()` полезен когда API может вернуть как одиночное значение, так и массив.

---

## tuple() — фиксированные массивы

### Что такое кортеж?

Кортеж (tuple) — это массив фиксированной длины, где каждый элемент имеет свой тип. В отличие от обычного массива, где все элементы одного типа.

```typescript
import { tuple, string, number } from 'yup'

// [name: string, age: number]
const schema = tuple([
  string().required().label('name'),
  number().required().positive().integer().label('age'),
])

await schema.validate(['Alice', 25])    // Valid: ['Alice', 25]
await schema.validate(['Alice', -1])    // Error: age must be positive
await schema.validate(['Alice'])        // Error: missing age
```

### Координаты

```typescript
const coordinatesSchema = yup.tuple([
  yup.number().required().min(-90).max(90),    // latitude
  yup.number().required().min(-180).max(180),  // longitude
])

await coordinatesSchema.validate([55.7558, 37.6173])   // Valid (Moscow)
await coordinatesSchema.validate([91, 0])               // Error: lat > 90
```

### Кортеж со смешанными типами

```typescript
const entrySchema = yup.tuple([
  yup.string().required(),                              // name
  yup.number().required().positive(),                    // value
  yup.string().oneOf(['active', 'inactive']).required(), // status
])

await entrySchema.validate(['Widget', 42, 'active'])    // Valid
await entrySchema.validate(['Widget', 42, 'unknown'])   // Error: invalid status
```

📌 **Важно:** Кортежи не имеют трансформации по умолчанию. Yup не приводит типы элементов автоматически, как делает `array()`.

### label() для понятных ошибок

```typescript
const schema = yup.tuple([
  yup.string().required().label('name'),
  yup.number().required().label('age'),
])

await schema.validate([undefined, undefined])
// Error: 'name is a required field'
// Without label: '[0] is a required field'
```

🔥 **Ключевое:** Используйте `.label()` для элементов кортежа — без него ошибки будут содержать индексы вместо понятных имён.

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: array() без of() не проверяет элементы

```typescript
// ❌ Bad: no element validation
const schema = yup.array()
await schema.validate([1, 'two', null, {}])  // Valid! No element checks

// ✅ Good: always specify element schema
const schema = yup.array().of(yup.number().required())
await schema.validate([1, 'two', null])  // Error
```

**Почему это проблема:** Без `.of()` Yup проверяет только, что значение является массивом, но не валидирует содержимое.

### ❌ Ошибка 2: Путают required() для массива и его элементов

```typescript
// ❌ Bad: required on array, but elements can be empty strings
const schema = yup.array()
  .of(yup.string())  // element not required!
  .required()         // array itself required

await schema.validate(['', ''])  // Valid! Elements are empty strings

// ✅ Good: required on both
const schema = yup.array()
  .of(yup.string().required('Element required'))
  .required('Array required')
  .min(1, 'At least one')
```

**Почему это проблема:** `required()` на массиве проверяет, что массив существует (не null/undefined), но не что элементы непустые. Добавляйте `required()` и на `.of()`.

### ❌ Ошибка 3: Используют array вместо tuple для фиксированных структур

```typescript
// ❌ Bad: array doesn't enforce position types
const schema = yup.array().of(yup.mixed())
await schema.validate([42, 'hello'])  // Valid, but no type safety

// ✅ Good: tuple for fixed-length typed arrays
const schema = yup.tuple([
  yup.number().required(),
  yup.string().required(),
])
```

**Почему это проблема:** `array().of()` применяет одну и ту же схему ко всем элементам. Если элементы разнотипные — используйте `tuple()`.

### ❌ Ошибка 4: Забывают min(1) для «непустого массива»

```typescript
// ❌ Bad: required() alone allows empty array
const schema = yup.array().of(yup.string()).required()
await schema.validate([])  // Valid! Empty array is not null

// ✅ Good: add min(1) to reject empty arrays
const schema = yup.array().of(yup.string()).required().min(1, 'Cannot be empty')
await schema.validate([])  // Error: 'Cannot be empty'
```

**Почему это проблема:** Пустой массив `[]` — это не null и не undefined, поэтому `required()` его пропускает. Для запрета пустого массива используйте `.min(1)`.

---

## 💡 Best Practices

1. **Всегда указывайте `.of()`** — массив без схемы элементов бесполезен
2. **`min(1)` для «не пустого массива»** — `required()` недостаточно
3. **`tuple()` для фиксированных структур** — координаты, пары key-value
4. **`.label()` для элементов tuple** — понятные сообщения вместо индексов
5. **`compact()` перед валидацией** — очистить массив от пустых значений
6. **`ensure()` для опциональных массивов** — гарантирует массив даже из null

---

## Что дальше?

В следующем уровне вы изучите:

- Условная валидация: `when()` с `is/then/otherwise`
- Зависимые поля: валидация на основе значения другого поля
- Сложные условия: несколько зависимостей и вложенные условия
