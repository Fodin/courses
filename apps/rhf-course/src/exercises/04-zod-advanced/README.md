# Уровень 4: Продвинутый Zod

## Введение

После изучения базовых типов Zod пора перейти к продвинутым возможностям. В этом уровне вы научитесь
создавать кастомную валидацию, работать с условными полями и преобразовывать данные прямо в схеме.

---

## Кастомная валидация с `refine`

### Одиночное refine

`refine` позволяет добавить произвольную проверку, которую нельзя выразить встроенными методами:

```tsx
const schema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'], // К какому полю привязать ошибку
  })
```

### Несколько refine

```tsx
const schema = z
  .object({
    currentPassword: z.string(),
    newPassword: z.string(),
  })
  .refine(data => data.newPassword !== data.currentPassword, {
    message: 'Новый пароль должен отличаться',
    path: ['newPassword'],
  })
  .refine(data => data.newPassword.length >= 8, {
    message: 'Минимум 8 символов',
    path: ['newPassword'],
  })
```

### Async refine

```tsx
const schema = z
  .object({
    username: z.string(),
  })
  .refine(
    async data => {
      const response = await fetch(`/api/check-username?username=${data.username}`)
      const { available } = await response.json()
      return available
    },
    {
      message: 'Имя пользователя занято',
      path: ['username'],
    }
  )
```

---

## Продвинутая валидация с `superRefine`

`superRefine` -- более мощная альтернатива `refine`. Она позволяет добавлять **несколько ошибок** за
один проход и даёт полный контроль через объект `ctx`:

```tsx
const schema = z
  .object({
    password: z.string(),
    confirm: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Минимум 8 символов',
        path: ['password'],
      })
    }

    if (!/[A-Z]/.test(data.password)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Нужна хотя бы одна заглавная буква',
        path: ['password'],
      })
    }

    if (data.password !== data.confirm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Пароли не совпадают',
        path: ['confirm'],
      })
    }
  })
```

### Когда `superRefine` лучше `refine`?

| `refine`                                 | `superRefine`                               |
| ---------------------------------------- | ------------------------------------------- |
| Одна проверка -- одна ошибка             | Несколько ошибок за один вызов              |
| Возвращает `boolean`                     | Вызывает `ctx.addIssue()` для каждой ошибки |
| Удобен для простых проверок              | Удобен для сложной логики с ветвлениями     |
| Цепочка `.refine().refine()` -- медленнее | Один `.superRefine()` -- быстрее            |

### Пример: проверка уникальности нескольких полей

```tsx
const schema = z
  .object({
    email: z.string().email(),
    username: z.string().min(3),
  })
  .superRefine(async (data, ctx) => {
    const [emailTaken, usernameTaken] = await Promise.all([
      checkEmail(data.email),
      checkUsername(data.username),
    ])

    if (emailTaken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Email уже занят',
        path: ['email'],
      })
    }

    if (usernameTaken) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Имя пользователя уже занято',
        path: ['username'],
      })
    }
  })
```

---

## `discriminatedUnion` -- условные поля

`discriminatedUnion` идеально подходит для форм, где набор полей зависит от выбранного значения
(дискриминатора). Zod автоматически определяет, какую ветку схемы использовать:

```tsx
const contactSchema = z.discriminatedUnion('contactMethod', [
  z.object({
    contactMethod: z.literal('email'),
    email: z.string().email('Неверный email'),
  }),
  z.object({
    contactMethod: z.literal('phone'),
    phone: z.string().min(10, 'Минимум 10 цифр'),
  }),
  z.object({
    contactMethod: z.literal('telegram'),
    telegramUsername: z.string().min(1, 'Обязательно'),
  }),
])

type ContactForm = z.infer<typeof contactSchema>
// ContactForm =
//   | { contactMethod: 'email'; email: string }
//   | { contactMethod: 'phone'; phone: string }
//   | { contactMethod: 'telegram'; telegramUsername: string }
```

### Использование с React Hook Form

```tsx
function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const method = watch('contactMethod')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select {...register('contactMethod')}>
        <option value="email">Email</option>
        <option value="phone">Телефон</option>
        <option value="telegram">Telegram</option>
      </select>

      {method === 'email' && <input {...register('email')} placeholder="Email" />}
      {method === 'phone' && <input {...register('phone')} placeholder="Телефон" />}
      {method === 'telegram' && <input {...register('telegramUsername')} placeholder="@username" />}

      <button type="submit">Отправить</button>
    </form>
  )
}
```

### Почему `discriminatedUnion`, а не `union`?

- `discriminatedUnion` **быстрее** -- Zod сразу знает, какую ветку проверять, по значению
  дискриминатора
- `union` перебирает все варианты и собирает ошибки из каждого -- это медленнее и даёт менее понятные
  сообщения об ошибках
- `discriminatedUnion` требует, чтобы дискриминатор был `z.literal()` -- это явно и предсказуемо

---

## `transform` и `pipe` -- преобразование данных

### `transform` -- преобразование после валидации

`transform` позволяет изменить значение **после** успешной валидации. Это полезно для нормализации
данных перед отправкой:

```tsx
const schema = z.object({
  // Trim пробелов
  name: z
    .string()
    .min(1, 'Обязательно')
    .transform(val => val.trim()),

  // String -> Number
  age: z.string().transform(val => Number(val)),

  // Нормализация email
  email: z
    .string()
    .email('Неверный email')
    .transform(val => val.toLowerCase().trim()),

  // Преобразование даты
  birthDate: z.string().transform(val => new Date(val)),
})

// Input type:  { name: string, age: string, email: string, birthDate: string }
// Output type: { name: string, age: number, email: string, birthDate: Date }
type FormInput = z.input<typeof schema> // тип ДО transform
type FormOutput = z.output<typeof schema> // тип ПОСЛЕ transform (= z.infer)
```

📌 **Важно:** После `transform` тип меняется. Используйте `z.input<typeof schema>` для типа входных
данных и `z.infer<typeof schema>` (или `z.output`) для типа результата.

### `pipe` -- цепочка валидации и преобразования

`pipe` позволяет передать результат одной схемы в другую. Это полезно, когда нужно сначала
преобразовать значение, а затем валидировать преобразованный результат:

```tsx
const schema = z.object({
  // String из input -> преобразуем в number -> валидируем как number
  age: z
    .string()
    .transform(val => Number(val))
    .pipe(z.number().min(18, 'Минимум 18 лет').max(120, 'Максимум 120 лет')),

  // String -> Number -> проверка на положительность
  price: z
    .string()
    .transform(val => parseFloat(val))
    .pipe(z.number().positive('Цена должна быть положительной')),
})
```

### `transform` vs `pipe`

| `transform`                        | `pipe`                                               |
| ---------------------------------- | ---------------------------------------------------- |
| Преобразует значение               | Передаёт результат в другую схему                    |
| Нет валидации после преобразования | Валидация преобразованного значения                  |
| `.transform(v => Number(v))`       | `.transform(v => Number(v)).pipe(z.number().min(1))` |

### Практический пример: форма с ценами

```tsx
const productSchema = z.object({
  title: z
    .string()
    .min(1, 'Обязательно')
    .transform(val => val.trim()),

  price: z
    .string()
    .transform(val => parseFloat(val.replace(',', '.')))
    .pipe(z.number({ message: 'Должно быть числом' }).positive('Цена должна быть положительной')),

  quantity: z
    .string()
    .transform(val => parseInt(val, 10))
    .pipe(
      z
        .number({ message: 'Должно быть числом' })
        .int('Должно быть целым числом')
        .min(1, 'Минимум 1')
    ),
})
```

---

## Межполевая валидация

Межполевая (кросс-полевая) валидация -- это проверки, которые зависят от значений нескольких полей
одновременно. В Zod для этого используются `refine` и `superRefine` на уровне объекта:

```tsx
const schema = z
  .object({
    startDate: z.string().min(1, 'Обязательно'),
    endDate: z.string().min(1, 'Обязательно'),
    minAge: z.number().min(0),
    maxAge: z.number().min(0),
  })
  .refine(data => new Date(data.endDate) > new Date(data.startDate), {
    message: 'Дата окончания должна быть позже даты начала',
    path: ['endDate'],
  })
  .refine(data => data.maxAge > data.minAge, {
    message: 'Максимальный возраст должен быть больше минимального',
    path: ['maxAge'],
  })
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: .refine() без path

```tsx
// ❌ Неправильно -- ошибка не привязана к полю
.refine((data) => data.password === data.confirm, {
  message: 'Пароли не совпадают'
})

// ✅ Правильно -- указываем path
.refine((data) => data.password === data.confirm, {
  message: 'Пароли не совпадают',
  path: ['confirm']
})
```

**Почему это ошибка:** Без `path` ошибка попадёт в `errors.root`, а не в `errors.confirm`. Поле не
подсветится, и пользователь не поймёт, где проблема.

---

### ❌ Ошибка 2: Цепочка refine вместо superRefine

```tsx
// ❌ Неоптимально -- три отдельных прохода
schema
  .refine(data => data.password.length >= 8, { ... })
  .refine(data => /[A-Z]/.test(data.password), { ... })
  .refine(data => data.password !== data.username, { ... })

// ✅ Лучше -- один проход с superRefine
schema.superRefine((data, ctx) => {
  if (data.password.length < 8) ctx.addIssue({ ... })
  if (!/[A-Z]/.test(data.password)) ctx.addIssue({ ... })
  if (data.password === data.username) ctx.addIssue({ ... })
})
```

**Почему это ошибка:** Цепочка `refine` выполняет каждую проверку в отдельном проходе, и если первая
не пройдёт, остальные не выполнятся. `superRefine` проверяет всё за один раз.

---

### ❌ Ошибка 3: transform без pipe для валидации результата

```tsx
// ❌ Неправильно -- NaN пройдёт валидацию
age: z.string().transform(val => Number(val))

// ✅ Правильно -- валидируем преобразованное значение
age: z.string()
  .transform(val => Number(val))
  .pipe(z.number().min(18).max(120))
```

**Почему это ошибка:** `transform` не валидирует результат. Если пользователь введёт "abc",
`Number("abc")` вернёт `NaN`, и это значение будет принято без ошибки.

---

### ❌ Ошибка 4: z.infer вместо z.input при transform

```tsx
const schema = z.object({
  age: z.string().transform(val => Number(val)),
})

// ❌ Неправильно -- z.infer даёт тип ПОСЛЕ transform: { age: number }
// Но форма работает с входными данными, где age -- это string
const { register } = useForm<z.infer<typeof schema>>()

// ✅ Правильно -- z.input даёт тип ДО transform: { age: string }
const { register } = useForm<z.input<typeof schema>>({
  resolver: zodResolver(schema),
})
```

**Почему это ошибка:** При использовании `transform` входной и выходной типы различаются. Форма
работает с входными данными, поэтому для `useForm` нужен `z.input`.

---

## 📚 Дополнительные ресурсы

- [Zod: refine](https://zod.dev/?id=refine)
- [Zod: superRefine](https://zod.dev/?id=superrefine)
- [Zod: discriminatedUnion](https://zod.dev/?id=discriminated-unions)
- [Zod: transform](https://zod.dev/?id=transform)
- [Zod: pipe](https://zod.dev/?id=pipe)
