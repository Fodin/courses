# 🔥 Уровень 7: Формы и пользовательский ввод

## Введение

Формы — основной способ взаимодействия пользователя с приложением. Ошибки ввода неизбежны, и их правильное отображение определяет качество UX.

🎯 **Цель уровня:** научиться валидировать формы, маппить серверные ошибки на поля и делать формы доступными.

## 🔥 Клиентская валидация

### Функция валидации

```typescript
interface ValidationErrors {
  [field: string]: string[]
}

function validate(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.name.trim()) {
    errors.name = ['Имя обязательно']
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ['Некорректный email']
  }

  return errors
}
```

### Когда валидировать

| Момент | Паттерн | Когда использовать |
|--------|---------|-------------------|
| При submit | Проверять все поля разом | Простые формы |
| При blur | Проверять поле при потере фокуса | Сложные формы |
| При change (после submit) | Убирать ошибки при исправлении | 🎯 Лучший UX |

## 🔥 Серверные ошибки

Сервер может вернуть ошибки валидации, которые клиент не может проверить:

```typescript
interface ServerError {
  field: string
  message: string
}

async function submitForm(data: FormData) {
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })

    if (response.status === 422) {
      const { errors } = await response.json() as { errors: ServerError[] }
      // Маппинг серверных ошибок на поля формы
      const mapped: Record<string, string> = {}
      for (const err of errors) {
        mapped[err.field] = err.message
      }
      setServerErrors(mapped)
      return
    }

    if (!response.ok) {
      throw new Error('Ошибка сервера')
    }
  } catch (error) {
    // Сетевая ошибка
    setGlobalError('Нет соединения с сервером')
  }
}
```

## Паттерны отображения ошибок

### 1. Inline — под полем

```jsx
<input aria-invalid={!!error} />
{error && <span className="error">{error}</span>}
```

### 2. Сводка — над формой

```jsx
{errors.length > 0 && (
  <div role="alert">
    <h4>Исправьте ошибки:</h4>
    <ul>
      {errors.map(e => <li key={e.field}>{e.message}</li>)}
    </ul>
  </div>
)}
```

### 3. Toast/уведомление

Для серверных ошибок, не связанных с конкретным полем.

💡 **Подсказка:** комбинируйте inline-ошибки и сводку — inline показывают что не так, а сводка помогает быстро увидеть общую картину.

## ♿ Доступность (a11y)

### Обязательные атрибуты

```jsx
<label htmlFor="email">
  Email <span aria-hidden="true">*</span>
  <span className="sr-only">(обязательно)</span>
</label>
<input
  id="email"
  aria-required="true"
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert">
    {error}
  </p>
)}
```

### 🎯 Фокус на ошибке

При submit фокусируйте первое ошибочное поле:

```typescript
const handleSubmit = (e: FormEvent) => {
  e.preventDefault()
  const errors = validate(formData)

  if (Object.keys(errors).length > 0) {
    // Фокус на первое ошибочное поле
    const firstErrorField = Object.keys(errors)[0]
    document.getElementById(firstErrorField)?.focus()
  }
}
```

### aria-live для динамических ошибок

```jsx
<div aria-live="polite" aria-atomic="true">
  {error && <p role="alert">{error}</p>}
</div>
```

## ⚠️ Частые ошибки новичков

### 1. ❌ Валидация только при submit, без обратной связи при исправлении

```typescript
// ❌ Плохо — ошибки показываются только при submit
const handleSubmit = () => {
  const errors = validate(data)
  setErrors(errors)
}
```

Пользователь исправляет поле, но ошибка не исчезает до следующего submit. Это сбивает с толку — непонятно, исправлена ли проблема.

```typescript
// ✅ Хорошо — убираем ошибку при изменении поля
const handleChange = (field: string, value: string) => {
  setData(prev => ({ ...prev, [field]: value }))
  // Убираем ошибку для изменённого поля
  if (errors[field]) {
    setErrors(prev => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }
}
```

### 2. ❌ Показ серверных ошибок без привязки к полям

```typescript
// ❌ Плохо — все ошибки сервера в одном alert
catch (error) {
  setError('Произошла ошибка')
}
```

Пользователь не понимает, какое именно поле заполнено неверно. Он вынужден угадывать или перепроверять всю форму.

```typescript
// ✅ Хорошо — маппим серверные ошибки на конкретные поля
if (response.status === 422) {
  const { errors } = await response.json()
  const mapped: Record<string, string> = {}
  for (const err of errors) {
    mapped[err.field] = err.message
  }
  setFieldErrors(mapped)
}
```

### 3. ❌ Отсутствие `aria-invalid` и `aria-describedby`

```jsx
// ❌ Плохо — скринридер не знает об ошибке
<input />
{error && <span className="error">{error}</span>}
```

Пользователи скринридеров не узнают, что поле содержит ошибку. Визуально ошибка видна, но программно — нет. Это нарушает WCAG.

```jsx
// ✅ Хорошо — скринридер объявит ошибку
<input
  aria-invalid={!!error}
  aria-describedby={error ? 'email-error' : undefined}
/>
{error && (
  <p id="email-error" role="alert">{error}</p>
)}
```

### 4. ❌ Сброс серверных ошибок при повторном submit

```typescript
// ❌ Плохо — серверные ошибки не очищаются перед новым запросом
const handleSubmit = async () => {
  const clientErrors = validate(data)
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors)
    return
  }
  await submitToServer(data)
}
```

Если пользователь исправил данные и отправил форму повторно, старые серверные ошибки остаются на экране вместе с ответом нового запроса. Это запутывает.

```typescript
// ✅ Хорошо — очищаем серверные ошибки перед новой отправкой
const handleSubmit = async () => {
  setServerErrors({}) // Сброс перед отправкой
  const clientErrors = validate(data)
  if (Object.keys(clientErrors).length > 0) {
    setErrors(clientErrors)
    return
  }
  await submitToServer(data)
}
```

## 📌 Итоги

- ✅ Валидируйте при submit, убирайте ошибки при change
- ✅ Маппируйте серверные ошибки на поля формы
- ✅ Используйте `aria-invalid`, `aria-describedby`, `role="alert"`
- ✅ Фокусируйте первое ошибочное поле при submit
- ✅ Комбинируйте inline и сводку для лучшего UX
- ✅ Очищайте серверные ошибки перед повторной отправкой
