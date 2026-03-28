# Уровень 5: Yup и сравнение библиотек

## Введение

Zod -- не единственная библиотека для валидации схем. **Yup** -- проверенная временем альтернатива с
цепочечным API, которая широко используется в экосистеме React. В этом уровне вы изучите Yup и
научитесь выбирать между Zod и Yup для своих проектов.

---

## Основы Yup

### Что такое Yup?

**Yup** -- это библиотека для валидации схем с цепочечным (chained) API, вдохновлённая библиотекой
Joi для Node.js.

**Установка:**

```bash
npm install yup @hookform/resolvers
```

### Базовый пример

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// 1. Создайте схему
const schema = yup.object({
  email: yup.string().email('Неверный email').required('Обязательно'),
  password: yup.string().min(8, 'Минимум 8 символов').required('Обязательно'),
})

// 2. Выведите тип
type FormData = yup.InferType<typeof schema>

// 3. Используйте с useForm
const { register, handleSubmit } = useForm<FormData>({
  resolver: yupResolver(schema),
})
```

---

## Типы и методы валидации Yup

### Строки

```tsx
const schema = yup.object({
  // Обязательная строка
  name: yup.string().required('Обязательно'),

  // Email
  email: yup.string().email('Неверный email').required('Обязательно'),

  // URL
  website: yup.string().url('Неверный URL'),

  // С длиной
  username: yup.string().min(3).max(20),

  // С паттерном
  phone: yup.string().matches(/^\+7\d{10}$/, 'Неверный формат'),

  // Опциональная
  bio: yup.string(),

  // С дефолтным значением
  role: yup.string().default('user'),

  // Один из значений
  status: yup.string().oneOf(['active', 'inactive']),
})
```

### Числа

```tsx
const schema = yup.object({
  // Обязательное число
  age: yup.number().required('Обязательно'),

  // С диапазоном
  rating: yup.number().min(1).max(10),

  // Положительное
  price: yup.number().positive('Цена должна быть положительной'),

  // Целое
  count: yup.number().integer('Должно быть целым числом'),

  // Опциональное
  discount: yup.number(),
})
```

### Булевы значения

```tsx
const schema = yup.object({
  agree: yup.boolean().oneOf([true], 'Необходимо согласие'),
  newsletter: yup.boolean(),
})
```

### Массивы

```tsx
const schema = yup.object({
  // Массив строк
  tags: yup.array().of(yup.string()),

  // С минимальной длиной
  skills: yup.array().of(yup.string()).min(1, 'Выберите хотя бы один'),

  // Массив объектов
  contacts: yup.array().of(
    yup.object({
      type: yup.string(),
      value: yup.string(),
    })
  ),
})
```

### Объекты

```tsx
const schema = yup.object({
  // Вложенный объект
  address: yup.object({
    city: yup.string().required('Обязательно'),
    street: yup.string().required('Обязательно'),
    zip: yup.string().matches(/^\d{5}$/, 'Неверный индекс'),
  }),

  // Опциональный объект
  company: yup.object({
    name: yup.string(),
    position: yup.string(),
  }),
})
```

---

## Кастомная валидация с `.test()`

Метод `.test()` в Yup -- это аналог `.refine()` в Zod. Он позволяет создавать произвольные проверки:

```tsx
const schema = yup.object({
  // Кросс-полевая валидация через ref
  password: yup.string().required(),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Пароли должны совпадать'),

  // Кастомный синхронный test
  username: yup
    .string()
    .test('no-spaces', 'Не должно содержать пробелов', value => !value?.includes(' ')),

  // Async test
  email: yup.string().test('is-available', 'Email уже занят', async value => {
    if (!value) return true
    const response = await fetch(`/api/check-email?email=${value}`)
    const { available } = await response.json()
    return available
  }),
})
```

### Кастомный test с контекстом

```tsx
const schema = yup.object({
  startDate: yup.string().required(),
  endDate: yup
    .string()
    .required()
    .test('after-start', 'Дата окончания должна быть позже начала', function (value) {
      // this.parent даёт доступ ко всем полям объекта
      const { startDate } = this.parent
      return new Date(value) > new Date(startDate)
    }),
})
```

> 📌 **Важно:** Для доступа к `this.parent` используйте обычную функцию (`function`), а не стрелочную
> (`=>`). Стрелочные функции не имеют собственного `this`.

---

## Сравнение Zod vs Yup

### Сводная таблица

| Критерий                  | Zod                               | Yup                                  |
| ------------------------- | --------------------------------- | ------------------------------------ |
| **Размер**                | ~12 KB                            | ~14 KB                               |
| **TypeScript**            | First-class, отличный вывод типов | Хороший, но иногда требует аннотаций |
| **API**                   | Функциональный, композируемый     | Цепочечный, выразительный            |
| **Производительность**    | Быстрее                           | Медленнее                            |
| **Асинхронная валидация** | Через `refine`                    | Через `test`                         |
| **Сообщество**            | Большое, растущее                 | Очень большое, зрелое                |
| **Документация**          | Отличная                          | Хорошая                              |
| **Обязательность**        | Поля обязательны по умолчанию     | Поля опциональны по умолчанию        |
| **Кросс-полевые ссылки**  | `refine` на уровне объекта        | `yup.ref()` внутри поля              |

### Сравнение синтаксиса

```tsx
// Zod
const zodSchema = z.object({
  email: z.string().email('Неверный email'),
  age: z.number().min(18),
  role: z.enum(['admin', 'user']),
})
type ZodForm = z.infer<typeof zodSchema>

// Yup
const yupSchema = yup.object({
  email: yup.string().email('Неверный email').required(),
  age: yup.number().min(18).required(),
  role: yup.string().oneOf(['admin', 'user']).required(),
})
type YupForm = yup.InferType<typeof yupSchema>
```

### Когда выбирать Zod?

- ✅ Новый TypeScript проект
- ✅ Важна типобезопасность (лучший type inference)
- ✅ Нужна лучшая производительность
- ✅ Предпочитаете функциональный API
- ✅ Нужны `discriminatedUnion`, `transform`, `pipe`

### Когда выбирать Yup?

- ✅ JavaScript проект (без TypeScript)
- ✅ Уже используете Yup в проекте
- ✅ Любите цепочечный API
- ✅ Нужно много готовых примеров в интернете
- ✅ Миграция с Formik (Yup -- его стандартный валидатор)
- ✅ Привычный `yup.ref()` для кросс-полевых ссылок

---

## Интеграция Yup с React Hook Form

### Полный пример

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object({
  firstName: yup.string().required('Имя обязательно'),
  lastName: yup.string().required('Фамилия обязательна'),
  email: yup.string().email('Неверный email').required('Email обязателен'),
  age: yup
    .number()
    .typeError('Должно быть числом')
    .min(18, 'Минимум 18 лет')
    .max(120, 'Максимум 120 лет')
    .required('Возраст обязателен'),
  password: yup
    .string()
    .min(8, 'Минимум 8 символов')
    .required('Пароль обязателен'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли не совпадают')
    .required('Подтвердите пароль'),
})

type FormData = yup.InferType<typeof schema>

export function YupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('firstName')} placeholder="Имя" />
        {errors.firstName && <span className="error">{errors.firstName.message}</span>}
      </div>

      <div>
        <input {...register('lastName')} placeholder="Фамилия" />
        {errors.lastName && <span className="error">{errors.lastName.message}</span>}
      </div>

      <div>
        <input type="email" {...register('email')} placeholder="Email" />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <input type="number" {...register('age')} placeholder="Возраст" />
        {errors.age && <span className="error">{errors.age.message}</span>}
      </div>

      <div>
        <input type="password" {...register('password')} placeholder="Пароль" />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <div>
        <input type="password" {...register('confirmPassword')} placeholder="Подтвердите пароль" />
        {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Зарегистрироваться
      </button>
    </form>
  )
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Забыли .required() в Yup

```tsx
// ❌ Неправильно -- поле необязательно (по умолчанию в Yup!)
email: yup.string().email('Неверный email')

// ✅ Правильно -- добавляем .required()
email: yup.string().email('Неверный email').required('Email обязателен')
```

**Почему это ошибка:** В отличие от Zod, где поля обязательны по умолчанию, в Yup поля по умолчанию
**опциональны**. Без `.required()` пустая строка пройдёт валидацию.

---

### ❌ Ошибка 2: Стрелочная функция в .test() с this

```tsx
// ❌ Неправильно -- стрелочная функция не имеет this
endDate: yup.string().test('after-start', 'Слишком рано', (value) => {
  const { startDate } = this.parent // ERROR: this === undefined
  return new Date(value) > new Date(startDate)
})

// ✅ Правильно -- обычная функция для доступа к this
endDate: yup.string().test('after-start', 'Слишком рано', function(value) {
  const { startDate } = this.parent
  return new Date(value) > new Date(startDate)
})
```

**Почему это ошибка:** `this.parent` доступен только в обычных функциях. Стрелочные функции
наследуют `this` из внешнего контекста, где `parent` не определён.

---

### ❌ Ошибка 3: yupResolver вместо zodResolver (и наоборот)

```tsx
// ❌ Неправильно -- перепутали resolver
import { zodResolver } from '@hookform/resolvers/zod'
import * as yup from 'yup'

const schema = yup.object({ ... })
useForm({ resolver: zodResolver(schema) }) // TypeError!

// ✅ Правильно -- используем yupResolver для Yup-схемы
import { yupResolver } from '@hookform/resolvers/yup'

useForm({ resolver: yupResolver(schema) })
```

**Почему это ошибка:** Каждая библиотека валидации требует свой resolver. `zodResolver` работает
только с Zod-схемами, `yupResolver` -- только с Yup-схемами.

---

### ❌ Ошибка 4: .typeError() не добавлен для числовых полей

```tsx
// ❌ Неправильно -- непонятная ошибка "NaN is not a number"
age: yup.number().min(18).required()

// ✅ Правильно -- с понятным сообщением
age: yup.number().typeError('Должно быть числом').min(18).required()
```

**Почему это ошибка:** Когда HTML input возвращает пустую строку, Yup пытается привести её к числу и
получает NaN. Без `.typeError()` сообщение об ошибке будет техническим и непонятным пользователю.

---

## 📚 Дополнительные ресурсы

- [Yup документация](https://github.com/jquense/yup)
- [Yup API Reference](https://github.com/jquense/yup#api)
- [@hookform/resolvers](https://react-hook-form.com/docs/useform/resolver)
- [Zod документация](https://zod.dev/)
