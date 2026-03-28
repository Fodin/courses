# Уровень 10: Фокус и доступность

## Введение

Управление фокусом и доступность (accessibility, a11y) -- критически важные аспекты UX форм.
Правильная работа с фокусом помогает пользователю быстро найти и исправить ошибку, а ARIA-атрибуты
делают формы доступными для людей, использующих скринридеры и клавиатурную навигацию.

---

## Управление фокусом: setFocus

### Зачем нужен focus management?

При ошибке валидации пользователь должен сразу понять, где проблема. Автоматический фокус на первом
ошибочном поле значительно улучшает UX.

### setFocus -- программная установка фокуса

RHF предоставляет метод `setFocus` для программной установки фокуса на поле по имени. Это удобнее,
чем работать с DOM напрямую, потому что RHF уже знает о всех зарегистрированных полях.

```tsx
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

function MyForm() {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm()

  // Фокус на первое поле при монтировании
  useEffect(() => {
    setFocus('email')
  }, [setFocus])

  // Фокус на первое поле с ошибкой после неудачного submit
  const onInvalid = (errors) => {
    const firstError = Object.keys(errors)[0]
    if (firstError) setFocus(firstError)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
      <input {...register('email', { required: 'Обязательно' })} />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <input {...register('password', { required: 'Обязательно' })} />
      {errors.password && <span className="error">{errors.password.message}</span>}

      <button type="submit">Отправить</button>
    </form>
  )
}
```

---

## shouldFocusError

RHF имеет встроенную опцию автоматического фокуса на первом ошибочном поле:

```tsx
// По умолчанию включено
const { register } = useForm({
  shouldFocusError: true,
})

// Отключить (если хотите управлять фокусом вручную)
const { register } = useForm({
  shouldFocusError: false,
})
```

> 📌 **Когда отключать:** Если вы используете кастомную логику фокуса (например, скролл к ошибке) или
> поля через `Controller`, где автоматический фокус может не работать.

---

## Опции setFocus

`setFocus` принимает второй аргумент -- объект с опцией `shouldSelect`:

```tsx
// Просто фокус
setFocus('email')

// Фокус + выделение текста в поле
setFocus('email', { shouldSelect: true })
```

> ⚠️ **Важно:** `setFocus` работает только с полями, зарегистрированными через `register`. Для полей
> через `Controller` фокус зависит от реализации компонента.

### Кастомный хук для фокуса на ошибке

```tsx
import { UseFormSetFocus, FieldErrors, FieldValues } from 'react-hook-form'

function useFocusOnError<T extends FieldValues>(
  errors: FieldErrors<T>,
  setFocus: UseFormSetFocus<T>
) {
  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof T
    if (firstError) {
      setFocus(firstError as any)
    }
  }, [errors, setFocus])
}

// Использование
function MyForm() {
  const {
    setFocus,
    formState: { errors },
  } = useForm()
  useFocusOnError(errors, setFocus)
  // ...
}
```

---

## Accessibility (a11y): ARIA-атрибуты

### Основные ARIA-атрибуты для форм

| Атрибут            | Описание                      | Пример                           |
| ------------------ | ----------------------------- | -------------------------------- |
| `aria-label`       | Текстовая метка формы         | `aria-label="Форма входа"`       |
| `aria-invalid`     | Поле невалидно                | `aria-invalid={!!errors.email}`  |
| `aria-describedby` | Связь с описанием ошибки      | `aria-describedby="email-error"` |
| `aria-live`        | Обновления в реальном времени | `aria-live="polite"`             |
| `role="alert"`     | Важное сообщение              | `role="alert"`                   |
| `noValidate`       | Отключить нативную валидацию  | `<form noValidate>`              |

### aria-invalid и aria-describedby

Эти два атрибута работают в паре -- `aria-invalid` сообщает скринридеру, что поле невалидно, а
`aria-describedby` указывает, где искать текст ошибки:

```tsx
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  {...register('email', { required: 'Обязательно' })}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>

{errors.email && (
  <span id="email-error" className="error" role="alert" aria-live="polite">
    {errors.email.message}
  </span>
)}
```

### role="alert" и aria-live

```tsx
function AccessibleForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm()

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Форма регистрации" noValidate>
      {/* Общее сообщение об ошибках */}
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive" style={{ color: '#dc3545' }}>
          Пожалуйста, исправьте ошибки в форме
        </div>
      )}

      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email', { required: 'Обязательно' })}
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? 'email-error' : undefined}
      />
      {errors.email && (
        <span id="email-error" className="error" role="alert" aria-live="polite">
          {errors.email.message}
        </span>
      )}

      <button type="submit">Отправить</button>
    </form>
  )
}
```

> 💡 **Совет:** Используйте `aria-live="assertive"` для критических ошибок (общее сообщение) и
> `aria-live="polite"` для ошибок отдельных полей.

---

## Навигация с клавиатуры

### Переход по полям через Enter

```tsx
<input
  {...register('name')}
  onKeyDown={(e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      document.getElementById('email')?.focus()
    }
  }}
/>
<input id="email" {...register('email')} />
```

### Полный пример доступной формы

```tsx
function AccessibleRegistrationForm() {
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitted, isSubmitSuccessful },
  } = useForm({
    shouldFocusError: true,
  })

  useEffect(() => {
    setFocus('name')
  }, [setFocus])

  return (
    <form onSubmit={handleSubmit(onSubmit)} aria-label="Форма регистрации" noValidate>
      {isSubmitted && Object.keys(errors).length > 0 && (
        <div role="alert" aria-live="assertive">
          Пожалуйста, исправьте {Object.keys(errors).length} ошибок
        </div>
      )}

      {isSubmitSuccessful && (
        <div role="status" aria-live="polite">
          Регистрация успешна!
        </div>
      )}

      <div>
        <label htmlFor="name">Имя</label>
        <input
          id="name"
          {...register('name', { required: 'Имя обязательно' })}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <span id="name-error" role="alert">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', { required: 'Email обязателен' })}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <span id="email-error" role="alert">{errors.email.message}</span>
        )}
      </div>

      <button type="submit">Зарегистрироваться</button>
    </form>
  )
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Работа с фокусом через DOM вместо setFocus

```tsx
// ❌ Неправильно -- обращение к DOM напрямую
useEffect(() => {
  const firstError = Object.keys(errors)[0]
  if (firstError) {
    document.getElementById(firstError)?.focus()
  }
}, [errors])

// ✅ Правильно -- использовать setFocus из RHF
const { setFocus } = useForm()
const onInvalid = (errors) => {
  const firstError = Object.keys(errors)[0]
  if (firstError) setFocus(firstError)
}
```

**Почему это ошибка:** `setFocus` уже знает о всех зарегистрированных полях и не требует привязки к
`id`. Кроме того, `shouldFocusError: true` (включён по умолчанию) автоматически фокусирует первое
ошибочное поле при submit.

---

### ❌ Ошибка 2: Отсутствие aria-invalid

```tsx
// ❌ Неправильно -- скринридер не знает об ошибке
<input {...register('email')} />
{errors.email && <span>{errors.email.message}</span>}

// ✅ Правильно -- с aria-invalid и aria-describedby
<input
  {...register('email')}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert">{errors.email.message}</span>
)}
```

**Почему это ошибка:** Без `aria-invalid` скринридер не сообщит пользователю, что поле содержит
ошибку. Без `aria-describedby` он не прочитает текст ошибки.

---

### ❌ Ошибка 3: noValidate забыли

```tsx
// ❌ Неправильно -- нативная и RHF валидация конфликтуют
<form onSubmit={handleSubmit(onSubmit)}>
  <input type="email" {...register('email')} />
</form>

// ✅ Правильно -- отключаем нативную валидацию
<form onSubmit={handleSubmit(onSubmit)} noValidate>
  <input type="email" {...register('email')} />
</form>
```

**Почему это ошибка:** Без `noValidate` браузер покажет свои встроенные сообщения об ошибках, которые
будут конфликтовать с кастомными ошибками RHF и могут быть не на нужном языке.

---

## 📚 Дополнительные ресурсы

- [setFocus документация](https://react-hook-form.com/docs/useform/setfocus)
- [ARIA для форм](https://www.w3.org/WAI/tutorials/forms/)
- [MDN: ARIA attributes](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [shouldFocusError](https://react-hook-form.com/docs/useform#shouldFocusError)
