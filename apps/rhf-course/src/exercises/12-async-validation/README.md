# Уровень 12: Async валидация и загрузка данных

## Введение

Реальные формы часто требуют взаимодействия с сервером: проверить, не занято ли имя пользователя,
загрузить данные для редактирования, обработать ошибки загрузки. В этом уровне вы научитесь
реализовывать async валидацию полей и загружать данные в формы разными способами.

---

## Async валидация полей

### Базовая async валидация через validate

```tsx
import { useForm } from 'react-hook-form'

const validateUsername = async (value: string) => {
  // Имитация запроса к серверу
  await new Promise(resolve => setTimeout(resolve, 500))

  const takenUsernames = ['admin', 'user', 'test']
  if (takenUsernames.includes(value.toLowerCase())) {
    return 'Имя пользователя занято'
  }

  return true
}

function RegistrationForm() {
  const { register, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('username', {
          required: 'Обязательно',
          validate: validateUsername,
        })}
      />
      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}
```

### Async валидация с onBlur и индикатором

```tsx
function AsyncValidationForm() {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()

  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)

  const validateUsername = async (value: string) => {
    if (!value || value.length < 3) return

    setChecking(true)

    try {
      const response = await fetch(`/api/check-username?username=${value}`)
      const { available } = await response.json()

      setAvailable(available)

      if (!available) {
        setError('username', {
          type: 'manual',
          message: 'Имя пользователя занято',
        })
      } else {
        clearErrors('username')
      }
    } catch (error) {
      setError('username', { type: 'manual', message: 'Ошибка проверки' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <form>
      <input {...register('username')} onBlur={e => validateUsername(e.target.value)} />

      {checking && <span>⏳ Проверка...</span>}
      {available === true && <span>✅ Доступно</span>}
      {available === false && <span>❌ Занято</span>}

      {errors.username && <span className="error">{errors.username.message}</span>}
    </form>
  )
}
```

---

## Async валидация с Zod

```tsx
import { z } from 'zod'

const schema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
})

// Async валидация через refine
const schemaWithAsync = schema.refine(
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

// Использование
const { register, handleSubmit } = useForm({
  resolver: zodResolver(schemaWithAsync),
  mode: 'onChange',
})
```

---

## Загрузка данных (Edit Mode)

### async defaultValues и isLoading

React Hook Form позволяет передавать в `defaultValues` **асинхронную функцию**. Это избавляет от
необходимости вручную управлять состоянием загрузки и вызывать `reset`:

```tsx
function EditForm() {
  const {
    register,
    handleSubmit,
    formState: { isLoading, isDirty },
  } = useForm({
    defaultValues: async () => {
      const response = await fetch('/api/user/1')
      return response.json()
    },
  })

  // isLoading === true пока async defaultValues не разрешится
  if (isLoading) return <div>Загрузка данных...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />

      <button type="submit" disabled={!isDirty}>
        Сохранить {isDirty && '*'}
      </button>
    </form>
  )
}
```

> 📌 **`isLoading`** -- свойство `formState`, которое равно `true` только когда `defaultValues`
> является async функцией и данные ещё загружаются. Это **не** `isSubmitting` -- `isLoading`
> относится только к начальной загрузке значений формы.

---

### values для синхронизации с внешним состоянием

Если данные формы приходят из внешнего источника (SWR, React Query, Redux), используйте опцию
`values`. Форма будет автоматически обновляться при изменении `values`:

```tsx
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

function EditForm() {
  const { data, isLoading: isDataLoading } = useSWR('/api/user/1', fetcher)

  const {
    register,
    handleSubmit,
    formState: { isDirty },
  } = useForm({
    values: data, // Форма обновится при изменении data
  })

  if (isDataLoading) return <div>Загрузка...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />

      <button type="submit" disabled={!isDirty}>
        Сохранить {isDirty && '*'}
      </button>
    </form>
  )
}
```

> **Разница между `values` и async `defaultValues`:**
> - `defaultValues` (async) -- загружает данные **один раз** при инициализации формы
> - `values` -- **синхронизирует** форму с внешним состоянием. Каждый раз когда `values` меняется,
>   форма обновляется (аналогично вызову `reset(values)`)

---

### Загрузка данных через reset (классический подход)

```tsx
function EditForm() {
  const { register, handleSubmit, reset, formState: { isDirty } } = useForm()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/user/1')
      .then(res => res.json())
      .then(data => {
        reset(data)
        setLoading(false)
      })
  }, [reset])

  if (loading) return <div>Загрузка...</div>

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <input {...register('email')} />
      <button type="submit" disabled={!isDirty}>Сохранить</button>
    </form>
  )
}
```

---

## Обработка ошибок при загрузке

```tsx
function EditFormWithErrorHandling() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await fetch('/api/user/1')
        if (!response.ok) throw new Error('Не удалось загрузить данные')

        const data = await response.json()
        reset(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [reset])

  if (loading) return <div>⏳ Загрузка...</div>
  if (error) return <div style={{ color: 'red' }}>❌ {error}</div>

  return <form onSubmit={handleSubmit(onSubmit)}>{/* поля формы */}</form>
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Async валидация без индикатора

```tsx
// ❌ Неправильно -- пользователь ждёт без обратной связи
validate: async (value) => {
  const response = await fetch(`/api/check?username=${value}`)
  return response.json()
}

// ✅ Правильно -- показываем статус
const [checking, setChecking] = useState(false)
// + индикатор в JSX
{checking && <span>⏳ Проверка...</span>}
```

**Почему это ошибка:** Пользователь не понимает, что происходит во время проверки. Нужен визуальный
индикатор (спиннер, текст).

---

### ❌ Ошибка 2: reset после загрузки без обработки ошибок

```tsx
// ❌ Неправильно -- ошибка загрузки игнорируется
useEffect(() => {
  fetch('/api/user/1')
    .then(res => res.json())
    .then(reset)
}, [reset])

// ✅ Правильно -- обработка ошибок
useEffect(() => {
  fetch('/api/user/1')
    .then(res => {
      if (!res.ok) throw new Error('Не удалось загрузить')
      return res.json()
    })
    .then(reset)
    .catch(err => setLoadError(err.message))
}, [reset])
```

**Почему это ошибка:** Если загрузка не удастся, форма останется пустой без объяснения причины.
Пользователь не поймёт, что произошло.

---

### ❌ Ошибка 3: isLoading при обычных defaultValues

```tsx
// ❌ Неправильно -- isLoading не будет true
const { formState: { isLoading } } = useForm({
  defaultValues: { name: '', email: '' }, // Обычный объект, не async
})
// isLoading всегда false!

// ✅ Правильно -- isLoading работает только с async defaultValues
const { formState: { isLoading } } = useForm({
  defaultValues: async () => {
    const res = await fetch('/api/user/1')
    return res.json()
  },
})
```

**Почему это ошибка:** `isLoading` предназначен только для async `defaultValues`. С обычным объектом
он всегда будет `false`.

---

## 📚 Дополнительные ресурсы

- [Async defaultValues](https://react-hook-form.com/docs/useform#defaultValues)
- [values опция](https://react-hook-form.com/docs/useform#values)
- [formState: isLoading](https://react-hook-form.com/docs/useform/formstate#isLoading)
- [setError документация](https://react-hook-form.com/docs/useform/seterror)
