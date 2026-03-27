# Уровень 6: Условная валидация

## Зачем нужна условная валидация?

В реальных формах правила валидации часто **зависят от значений других полей**. Например:
- Если тип аккаунта «бизнес» — требуется ИНН
- Если способ доставки «курьер» — обязателен адрес
- Если страна «США» — почтовый индекс должен быть 5 цифр

Yup решает это через метод `.when()`, который позволяет **динамически менять правила** схемы в зависимости от других полей.

---

## when() — базовое использование

### Простейший случай

Метод `.when()` принимает имя поля-зависимости и объект с условиями:

```typescript
import * as yup from 'yup'

const schema = yup.object({
  isBusiness: yup.boolean(),
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.optional(),
  }),
})

// isBusiness = true → companyName required
await schema.validate({ isBusiness: true, companyName: 'Acme' }) // ✅
await schema.validate({ isBusiness: true })                       // ❌ Error

// isBusiness = false → companyName optional
await schema.validate({ isBusiness: false })                      // ✅
```

### Как это работает

1. `when('isBusiness', ...)` — следит за значением поля `isBusiness`
2. `is: true` — условие: когда `isBusiness === true`
3. `then: (schema) => ...` — схема при выполнении условия
4. `otherwise: (schema) => ...` — схема при невыполнении (опционально)

🔥 **Ключевое:** `then` и `otherwise` получают **текущую схему** как аргумент — вы дополняете её, а не создаёте с нуля.

---

## is/then/otherwise — полный синтаксис

### is как функция

`is` может быть не только значением, но и функцией:

```typescript
const schema = yup.object({
  age: yup.number(),
  guardianName: yup.string().when('age', {
    is: (age: number) => age < 18,
    then: (schema) => schema.required('Guardian required for minors'),
    otherwise: (schema) => schema.optional(),
  }),
})
```

### Без otherwise

Если `otherwise` не нужен, можно его опустить:

```typescript
const schema = yup.object({
  hasNewsletter: yup.boolean(),
  email: yup.string().when('hasNewsletter', {
    is: true,
    then: (schema) => schema.required().email('Enter valid email'),
  }),
})
```

### Функциональный синтаксис when()

Для более сложных случаев `when()` принимает функцию:

```typescript
const schema = yup.object({
  paymentMethod: yup.string().oneOf(['card', 'bank', 'cash']),
  cardNumber: yup.string().when('paymentMethod', ([method], schema) => {
    return method === 'card'
      ? schema.required('Card number required').length(16)
      : schema.optional()
  }),
})
```

📌 **Важно:** В функциональном синтаксисе значение зависимого поля приходит **массивом** — `[method]`, даже если поле одно.

---

## when() с несколькими полями

### Зависимость от двух полей

Можно указать массив полей-зависимостей:

```typescript
const schema = yup.object({
  country: yup.string().required(),
  hasState: yup.boolean(),
  state: yup.string().when(['country', 'hasState'], {
    is: (country: string, hasState: boolean) =>
      country === 'US' && hasState === true,
    then: (schema) => schema.required('State required for US'),
    otherwise: (schema) => schema.optional(),
  }),
})
```

### Функциональный синтаксис с несколькими полями

```typescript
const schema = yup.object({
  deliveryType: yup.string().oneOf(['pickup', 'courier', 'post']),
  urgency: yup.string().oneOf(['normal', 'express']),
  address: yup.string().when(
    ['deliveryType', 'urgency'],
    ([delivery, urgency], schema) => {
      if (delivery === 'courier') {
        return schema.required('Address required for courier delivery')
      }
      if (delivery === 'post' && urgency === 'express') {
        return schema.required('Address required for express post')
      }
      return schema.optional()
    }
  ),
})
```

💡 **Подсказка:** Функциональный синтаксис удобнее, когда логика сложнее простого сравнения.

---

## Вложенные условия

### Несколько when() на одном поле

Можно цеплять несколько `.when()` к одному полю:

```typescript
const schema = yup.object({
  accountType: yup.string().oneOf(['personal', 'business']),
  country: yup.string().required(),
  taxId: yup.string()
    .when('accountType', {
      is: 'business',
      then: (schema) => schema.required('Tax ID required for business'),
    })
    .when('country', {
      is: 'US',
      then: (schema) => schema.matches(/^\d{9}$/, 'US Tax ID must be 9 digits'),
    }),
})
```

⚠️ **Внимание:** Каждый `.when()` **дополняет** схему. Если `accountType = 'business'` и `country = 'US'`, то `taxId` будет одновременно `required` И должен соответствовать формату 9 цифр.

### when() внутри вложенных объектов

```typescript
const schema = yup.object({
  shipping: yup.object({
    method: yup.string().oneOf(['standard', 'express']),
    trackingNumber: yup.string().when('method', {
      is: 'express',
      then: (schema) => schema.required('Tracking required for express'),
    }),
  }),
})
```

📌 **Важно:** `when()` по умолчанию ищет поле **на том же уровне** объекта. Для обращения к полям из родительского объекта используйте `$`-контекст (уровень 8).

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Забывают, что then/otherwise получают схему

```typescript
// ❌ Bad: creating schema from scratch
const schema = yup.object({
  hasBio: yup.boolean(),
  bio: yup.string().min(10).when('hasBio', {
    is: true,
    then: () => yup.string().required(), // lost min(10)!
  }),
})

// ✅ Good: extending the passed schema
const schema = yup.object({
  hasBio: yup.boolean(),
  bio: yup.string().min(10).when('hasBio', {
    is: true,
    then: (schema) => schema.required(), // keeps min(10)
  }),
})
```

**Почему это проблема:** `then` получает текущую схему с уже настроенными правилами. Если создать новую схему, все предыдущие правила (min, max, matches и т.д.) будут потеряны.

### ❌ Ошибка 2: Не указывают поле в shape объекта

```typescript
// ❌ Bad: isBusiness not in schema
const schema = yup.object({
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required(),
  }),
})
// when() won't work — isBusiness not tracked

// ✅ Good: include the dependency field
const schema = yup.object({
  isBusiness: yup.boolean().required(),
  companyName: yup.string().when('isBusiness', {
    is: true,
    then: (schema) => schema.required(),
  }),
})
```

**Почему это проблема:** `when()` может ссылаться только на поля, объявленные в том же объекте. Если поле не в shape — условие никогда не сработает.

### ❌ Ошибка 3: Забывают деструктуризацию массива в функциональном синтаксисе

```typescript
// ❌ Bad: value is an array, not the field value
const schema = yup.object({
  role: yup.string(),
  permissions: yup.array().when('role', (role, schema) => {
    // role is ARRAY [roleValue], not string!
    return role === 'admin' ? schema.min(1) : schema
  }),
})

// ✅ Good: destructure the array
const schema = yup.object({
  role: yup.string(),
  permissions: yup.array().when('role', ([role], schema) => {
    return role === 'admin' ? schema.min(1) : schema
  }),
})
```

**Почему это проблема:** В функциональном синтаксисе `when()` зависимые значения приходят **массивом**. Без деструктуризации вы сравниваете массив вместо значения.

### ❌ Ошибка 4: Циклические зависимости

```typescript
// ❌ Bad: circular dependency
const schema = yup.object({
  a: yup.string().when('b', {
    is: 'x',
    then: (s) => s.required(),
  }),
  b: yup.string().when('a', {
    is: 'y',
    then: (s) => s.required(),
  }),
})
// Error: Cyclic dependency

// ✅ Good: use one-directional dependency or $context
```

**Почему это проблема:** Yup не может разрешить взаимные зависимости. Используйте контекст (`$`) для одного из полей или пересмотрите архитектуру схемы.

---

## 💡 Best Practices

1. **Всегда используйте параметр schema в then/otherwise** — не создавайте новую схему, дополняйте текущую
2. **Функциональный синтаксис для сложной логики** — `is` как функция или полностью функциональный `when()`
3. **Деструктуризация в функциональном синтаксисе** — `([value], schema)`, не `(value, schema)`
4. **Все зависимости должны быть в shape** — иначе `when()` не увидит поле
5. **Избегайте циклических зависимостей** — A зависит от B, B зависит от A = ошибка
6. **Одно условие на один аспект** — несколько `.when()` лучше одного гигантского

---

## Что дальше?

В следующем уровне вы изучите:

- Кастомные валидаторы: `test()` с синхронной и асинхронной логикой
- Трансформации: `transform()` для предобработки данных
- Расширение Yup: `addMethod()` для переиспользуемых правил
