# Уровень 13: Отправка и автосохранение

## Введение

Отправка формы с обработкой loading/error состояний и автосохранение черновиков -- ключевые паттерны
для production-форм. В этом уровне вы научитесь корректно обрабатывать submit, показывать
уведомления об успехе/ошибке и реализовывать debounce-автосохранение.

---

## Submit с loading/error состояниями

### Использование isSubmitting из formState

React Hook Form предоставляет `isSubmitting` через `formState`. Если `onSubmit` возвращает Promise,
RHF автоматически управляет этим состоянием:

```tsx
function SubmitForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm()

  const onSubmit = async (data: any) => {
    // isSubmitting автоматически true пока Promise не завершится
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} disabled={isSubmitting} />
      <input {...register('email')} disabled={isSubmitting} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '⏳ Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}
```

### Обработка ошибок submit через setError

```tsx
function SubmitWithErrorHandling() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()

        // Серверные ошибки для конкретных полей
        if (errorData.field) {
          setError(errorData.field, { message: errorData.message })
        } else {
          // Общая ошибка формы
          setError('root', { message: errorData.message || 'Ошибка отправки' })
        }
      }
    } catch (err) {
      setError('root', { message: 'Ошибка сети. Попробуйте позже.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {errors.root && (
        <div role="alert" style={{ color: 'red', marginBottom: '1rem' }}>
          ❌ {errors.root.message}
        </div>
      )}

      <input {...register('name')} />
      {errors.name && <span className="error">{errors.name.message}</span>}

      <input {...register('email')} />
      {errors.email && <span className="error">{errors.email.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '⏳ Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}
```

---

## Уведомления при успехе

```tsx
function SubmitWithNotification() {
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (data: any) => {
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      setSuccess(true)
      reset()

      // Скрыть уведомление через 3 секунды
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError('root', {
        message: err instanceof Error ? err.message : 'Ошибка отправки',
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {success && (
        <div
          role="status"
          aria-live="polite"
          style={{
            padding: '1rem',
            background: '#d1e7dd',
            color: '#0f5132',
            marginBottom: '1rem',
            borderRadius: '4px',
          }}
        >
          ✅ Отправлено успешно!
        </div>
      )}

      {errors.root && (
        <div
          role="alert"
          style={{
            padding: '1rem',
            background: '#f8d7da',
            color: '#842029',
            marginBottom: '1rem',
            borderRadius: '4px',
          }}
        >
          ❌ {errors.root.message}
        </div>
      )}

      <input {...register('name')} disabled={isSubmitting} />
      <input {...register('email')} disabled={isSubmitting} />

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '⏳ Отправка...' : 'Отправить'}
      </button>
    </form>
  )
}
```

---

## Debounce для автосохранения

### Базовый debounce

```tsx
function AutoSaveForm() {
  const { register, watch } = useForm()
  const values = watch()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('Auto-saved:', values)
      localStorage.setItem('draft', JSON.stringify(values))
      setSaved(true)

      setTimeout(() => setSaved(false), 2000)
    }, 1000) // Debounce 1 секунда

    return () => clearTimeout(timer) // Cleanup обязателен!
  }, [values])

  return (
    <form>
      <textarea {...register('content')} />
      {saved && <div style={{ color: 'green' }}>✓ Сохранено</div>}
    </form>
  )
}
```

---

## useDebounce хук

```tsx
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

// Использование для поиска
function SearchForm() {
  const { register, watch } = useForm()
  const searchQuery = watch('query')
  const debouncedQuery = useDebounce(searchQuery, 500)

  useEffect(() => {
    if (debouncedQuery) {
      console.log('Searching for:', debouncedQuery)
    }
  }, [debouncedQuery])

  return (
    <form>
      <input {...register('query')} placeholder="Поиск..." />
    </form>
  )
}
```

---

## Индикатор статуса автосохранения

```tsx
function DraftForm() {
  const { register, watch } = useForm()
  const values = watch()
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setStatus('saving')

      try {
        await fetch('/api/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        setStatus('saved')

        setTimeout(() => setStatus('idle'), 2000)
      } catch (error) {
        setStatus('error')
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [values])

  return (
    <form>
      <textarea {...register('content')} />

      <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {status === 'saving' && '⏳ Сохранение...'}
        {status === 'saved' && '✓ Сохранено'}
        {status === 'error' && '❌ Ошибка сохранения'}
      </div>
    </form>
  )
}
```

---

## ⚠️ Частые ошибки новичков

### ❌ Ошибка 1: Нет обработки loading

```tsx
// ❌ Неправильно -- кнопка активна во время отправки
<button type="submit">Отправить</button>

// ✅ Правильно -- показываем состояние
const { formState: { isSubmitting } } = useForm()
<button type="submit" disabled={isSubmitting}>
  {isSubmitting ? '⏳ Отправка...' : 'Отправить'}
</button>
```

**Почему это ошибка:** Пользователь может отправить форму несколько раз, если не видно состояние
загрузки и кнопка не заблокирована.

---

### ❌ Ошибка 2: Debounce без cleanup

```tsx
// ❌ Неправильно -- утечка памяти
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Search:', values)
  }, 500)
  // нет cleanup!
})

// ✅ Правильно -- очистка таймера
useEffect(() => {
  const timer = setTimeout(() => {
    console.log('Search:', values)
  }, 500)
  return () => clearTimeout(timer)
}, [values])
```

**Почему это ошибка:** Без очистки таймера при каждом изменении создаётся новый таймер, старые не
отменяются -- это приводит к утечкам памяти и множественным запросам.

---

### ❌ Ошибка 3: Нет обработки ошибок API

```tsx
// ❌ Неправильно -- ошибка игнорируется
const onSubmit = async (data) => {
  await fetch('/api/submit', { body: JSON.stringify(data) })
}

// ✅ Правильно -- try/catch с setError
const onSubmit = async (data) => {
  try {
    const res = await fetch('/api/submit', { body: JSON.stringify(data) })
    if (!res.ok) throw new Error('Ошибка сервера')
  } catch (err) {
    setError('root', { message: 'Ошибка сети. Попробуйте позже.' })
  }
}
```

**Почему это ошибка:** Сеть может отказать, сервер может вернуть ошибку. Пользователь должен увидеть
понятное сообщение, а не просто зависшую кнопку.

---

### ❌ Ошибка 4: Множественные submit без блокировки

```tsx
// ❌ Неправильно -- форма отправляется повторно при быстром клике
const onSubmit = async (data) => {
  await saveData(data) // Может выполниться несколько раз!
}

// ✅ Правильно -- используем isSubmitting для блокировки
<button type="submit" disabled={isSubmitting}>
  Отправить
</button>
// handleSubmit НЕ вызовет onSubmit повторно, пока предыдущий Promise не завершится
```

**Почему это ошибка:** `handleSubmit` в RHF автоматически блокирует повторный вызов, если `onSubmit`
возвращает Promise. Но визуально кнопка должна быть заблокирована через `disabled`, иначе
пользователь не понимает, что отправка идёт.

---

## 📚 Дополнительные ресурсы

- [handleSubmit документация](https://react-hook-form.com/docs/useform/handlesubmit)
- [setError документация](https://react-hook-form.com/docs/useform/seterror)
- [formState: isSubmitting](https://react-hook-form.com/docs/useform/formstate)
- [errors.root](https://react-hook-form.com/docs/useform/formstate#root)
