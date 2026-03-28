# Уровень 3: Основы Zod

## Введение

Валидация по схемам — это декларативный способ описания правил валидации всей формы в одном месте.
Вместо того чтобы разбрасывать правила по отдельным полям через `register`, вы описываете структуру
данных один раз — и получаете валидацию, типы и автодополнение.

**Почему схемы лучше встроенной валидации?**

| Встроенная валидация            | Валидация по схемам            |
| ------------------------------- | ------------------------------ |
| Правила разбросаны по полям     | Все правила в одном месте      |
| Сложная кросс-полевая валидация | Легкая кросс-полевая валидация |
| Меньше типобезопасности         | Полная типобезопасность        |
| Сложно переиспользовать         | Легко переиспользовать         |

---

## Что такое Zod?

**Zod** — это TypeScript-first библиотека для валидации схем с нулевыми зависимостями. Zod позволяет
описать структуру данных и автоматически вывести из неё TypeScript-тип.

**Установка:**

```bash
npm install zod @hookform/resolvers
```

### Базовый пример

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 1. Создайте схему
const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

// 2. Выведите тип из схемы
type FormData = z.infer<typeof schema>

// 3. Используйте с useForm
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(schema),
})
```

---

## Основные типы Zod

### Строки

```tsx
const schema = z.object({
  // Обязательная строка
  name: z.string(),

  // Email
  email: z.string().email('Неверный email'),

  // URL
  website: z.string().url('Неверный URL'),

  // UUID
  id: z.string().uuid('Неверный UUID'),

  // С длиной
  username: z.string().min(3).max(20),

  // С паттерном
  phone: z.string().regex(/^\+7\d{10}$/, 'Неверный формат'),

  // Опциональная
  bio: z.string().optional(),

  // С дефолтным значением
  role: z.string().default('user'),
})
```

### Числа

```tsx
const schema = z.object({
  // Обязательное число
  age: z.number(),

  // С диапазоном
  rating: z.number().min(1).max(10),

  // Положительное
  price: z.number().positive('Цена должна быть положительной'),

  // Отрицательное
  balance: z.number().negative(),

  // Целое
  count: z.number().int('Должно быть целым числом'),

  // Опциональное
  discount: z.number().optional(),
})
```

### Булевы значения

```tsx
const schema = z.object({
  agree: z.boolean().refine(v => v === true, 'Необходимо согласие'),
  newsletter: z.boolean().optional(),
})
```

### Enum (перечисления)

```tsx
const schema = z.object({
  // Zod enum
  role: z.enum(['admin', 'user', 'guest']),

  // TypeScript enum
  status: z.nativeEnum(Status),
})
```

---

## Объектные схемы

### z.object — вложенные объекты

```tsx
const schema = z.object({
  // Вложенный объект
  address: z.object({
    city: z.string(),
    street: z.string(),
    zip: z.string().regex(/^\d{5}$/, 'Неверный индекс'),
  }),

  // Опциональный объект
  company: z
    .object({
      name: z.string(),
      position: z.string(),
    })
    .optional(),
})
```

### z.infer — вывод типа из схемы

```tsx
const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18),
})

// Тип выводится автоматически:
// { email: string; age: number }
type FormData = z.infer<typeof schema>
```

📌 **Важно:** Всегда используйте `z.infer` вместо ручного описания типа. Это гарантирует, что тип
всегда соответствует схеме.

### Массивы

```tsx
const schema = z.object({
  // Массив строк
  tags: z.array(z.string()),

  // С минимальной длиной
  skills: z.array(z.string()).min(1, 'Выберите хотя бы один навык'),

  // Массив объектов
  contacts: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    })
  ),
})
```

---

## Интеграция с React Hook Form

Для подключения Zod к React Hook Form используется `zodResolver` из пакета `@hookform/resolvers`.

### Полный пример

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Неверный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
        {errors.password && <span className="error">{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={!isValid}>
        Войти
      </button>
    </form>
  )
}
```

### Вложенные объекты с RHF

Для вложенных объектов используйте точечную нотацию в `register`:

```tsx
const schema = z.object({
  name: z.string().min(1, 'Обязательно'),
  address: z.object({
    city: z.string().min(1, 'Обязательно'),
    zip: z.string().regex(/^\d{5}$/, 'Неверный индекс'),
  }),
})

type FormData = z.infer<typeof schema>

function AddressForm() {
  const { register, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  return (
    <form>
      <input {...register('name')} />
      <input {...register('address.city')} />
      <input {...register('address.zip')} />
      {errors.address?.city && <span>{errors.address.city.message}</span>}
    </form>
  )
}
```

---

## Полная схема регистрации

```tsx
import { z } from 'zod'

const registrationSchema = z
  .object({
    firstName: z.string().min(1, 'Обязательно'),
    lastName: z.string().min(1, 'Обязательно'),
    email: z.string().email('Неверный email'),
    age: z.number().min(18, 'Минимум 18 лет').max(120, 'Максимум 120 лет'),

    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/[A-Z]/, 'Должна быть заглавная буква')
      .regex(/\d/, 'Должна быть цифра'),

    confirmPassword: z.string(),

    address: z.object({
      country: z.string().min(1, 'Обязательно'),
      city: z.string().min(1, 'Обязательно'),
    }),

    skills: z.array(z.string()).min(1, 'Выберите хотя бы один'),
    role: z.enum(['developer', 'designer', 'manager']),
    agree: z.boolean().refine(v => v === true, 'Необходимо согласие'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type RegistrationForm = z.infer<typeof registrationSchema>
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Не импортировали resolver

```tsx
// ❌ Неправильно — забыли импорт
import { z } from 'zod'

const { register } = useForm({ resolver: zodResolver(schema) }) // zodResolver не определён!

// ✅ Правильно — импортируем resolver
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const { register } = useForm({ resolver: zodResolver(schema) })
```

**Почему это ошибка:** Без импорта `zodResolver` из `@hookform/resolvers/zod` схема не будет
подключена к React Hook Form.

---

### ❌ Ошибка 2: Ручное описание типа вместо z.infer

```tsx
// ❌ Неправильно — тип не выведен из схемы
type FormData = {
  email: string
  password: string
}
const schema = z.object({ email: z.string(), password: z.string() })

// ✅ Правильно — используем z.infer
const schema = z.object({
  email: z.string(),
  password: z.string(),
})
type FormData = z.infer<typeof schema>
```

**Почему это ошибка:** Ручное описание типа может рассинхронизироваться со схемой при изменениях.
`z.infer` гарантирует актуальность.

---

### ❌ Ошибка 3: .optional() вместо .nullable()

```tsx
// ❌ Неправильно — undefined не то же самое что null
bio: z.string().optional() // может быть undefined

// ✅ Правильно — если API возвращает null
bio: z.string().nullable() // может быть null
```

**Почему это ошибка:** `optional()` делает поле `string | undefined`, а `nullable()` —
`string | null`. Выбирайте то, что соответствует вашему API.

---

### ❌ Ошибка 4: Минимум 1 элемент в массиве без сообщения

```tsx
// ❌ Неправильно — непонятная ошибка по умолчанию
skills: z.array(z.string()).min(1)

// ✅ Правильно — с понятным сообщением
skills: z.array(z.string()).min(1, 'Выберите хотя бы один навык')
```

**Почему это ошибка:** Пользователь должен понимать, что именно не так с формой. Всегда добавляйте
сообщения к валидационным правилам.

---

## 📚 Дополнительные ресурсы

- [Zod документация](https://zod.dev/)
- [@hookform/resolvers](https://react-hook-form.com/docs/useform/resolver)
- [Zod GitHub](https://github.com/colinhacks/zod)
