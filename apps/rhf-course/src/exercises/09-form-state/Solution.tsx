import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 9.1: Dirty / Touched — Решение
// ============================================

export function Task9_1_Solution() {
  const {
    register,
    formState: { dirtyFields, touchedFields, isDirty },
  } = useForm<{ name: string; email: string }>({
    defaultValues: { name: '', email: '' },
  })

  return (
    <div className="exercise-container">
      <h2>✅ Задание 9.1: Dirty / Touched States</h2>
      <form style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Имя</label>
          <input {...register('name')} />
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            <span>
              Dirty:{' '}
              <span style={{ color: dirtyFields.name ? '#28a745' : '#dc3545' }}>
                {dirtyFields.name ? '✅' : '❌'}
              </span>
            </span>
            <span>
              Touched:{' '}
              <span style={{ color: touchedFields.name ? '#28a745' : '#6c757d' }}>
                {touchedFields.name ? '✅' : '❌'}
              </span>
            </span>
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <input {...register('email')} />
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem', display: 'flex', gap: '1rem' }}>
            <span>
              Dirty:{' '}
              <span style={{ color: dirtyFields.email ? '#28a745' : '#dc3545' }}>
                {dirtyFields.email ? '✅' : '❌'}
              </span>
            </span>
            <span>
              Touched:{' '}
              <span style={{ color: touchedFields.email ? '#28a745' : '#6c757d' }}>
                {touchedFields.email ? '✅' : '❌'}
              </span>
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: isDirty ? '#fff3cd' : '#d4edda',
            borderRadius: '4px',
            fontWeight: 500,
          }}
        >
          Форма изменена:{' '}
          <span style={{ color: isDirty ? '#856404' : '#155724' }}>{isDirty ? 'Да' : 'Нет'}</span>
        </div>
      </form>
    </div>
  )
}

// ============================================
// Задание 9.2: Reset и default values — Решение
// ============================================

const userSchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
  email: z.string().email('Неверный email'),
  role: z.enum(['admin', 'user']),
})

type UserForm = z.infer<typeof userSchema>

export function Task9_2_Solution() {
  const { register, handleSubmit, reset } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: { username: '', email: '', role: 'user' },
  })

  const [lastSubmitted, setLastSubmitted] = useState<UserForm | null>(null)

  const onSubmit = (data: UserForm) => {
    setLastSubmitted(data)
    console.log('Submitted:', data)
  }

  const handleFill = () => {
    reset({ username: 'john_doe', email: 'john@example.com', role: 'admin' })
  }

  const handleReset = () => {
    reset()
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 9.2: Reset и Default Values</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Username</label>
          <input {...register('username')} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select {...register('role')}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button type="submit">Сохранить</button>
          <button
            type="button"
            onClick={handleFill}
            style={{ background: '#17a2b8', color: '#fff', border: 'none' }}
          >
            📝 Заполнить
          </button>
          <button type="button" onClick={handleReset}>
            🗑️ Сбросить
          </button>
        </div>

        {lastSubmitted && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#d4edda',
              borderRadius: '8px',
              border: '1px solid #c3e6cb',
            }}
          >
            <strong>Последняя отправка:</strong>
            <pre style={{ marginTop: '0.5rem', marginBottom: 0 }}>
              {JSON.stringify(lastSubmitted, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  )
}

// ============================================
// Задание 9.3: Программное управление — setValue, setError, trigger — Решение
// ============================================

const programmaticSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Неверный формат email'),
  phone: z.string().min(10, 'Минимум 10 символов'),
  city: z.string().min(1, 'Город обязателен'),
})

type ProgrammaticForm = z.infer<typeof programmaticSchema>

const mockProfile = {
  name: 'Иван Петров',
  email: 'ivan@example.com',
  phone: '+7 999 123 45 67',
  city: 'Москва',
}

export function Task9_3_Solution() {
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    trigger,
    formState: { errors },
  } = useForm<ProgrammaticForm>({
    resolver: zodResolver(programmaticSchema),
    defaultValues: { name: '', email: '', phone: '', city: '' },
  })

  const [serverResponse, setServerResponse] = useState<string | null>(null)

  const handleFillFromProfile = () => {
    setValue('name', mockProfile.name, { shouldDirty: true })
    setValue('email', mockProfile.email, { shouldDirty: true })
    setValue('phone', mockProfile.phone, { shouldDirty: true })
    setValue('city', mockProfile.city, { shouldDirty: true })
  }

  const handleValidateEmail = async () => {
    const isValid = await trigger('email')
    if (isValid) {
      setServerResponse('Email прошёл валидацию')
    }
  }

  const handleValidateAll = async () => {
    await trigger()
  }

  const onSubmit = async (data: ProgrammaticForm) => {
    // Имитация серверной ошибки
    if (data.email === 'taken@example.com') {
      setError('email', {
        type: 'server',
        message: 'Этот email уже зарегистрирован',
      })
      setServerResponse('Ошибка сервера: email занят')
      return
    }
    setServerResponse(`Данные отправлены: ${JSON.stringify(data)}`)
    console.log('Submitted:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 9.3: setValue, setError, trigger</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '450px' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={handleFillFromProfile}
            style={{
              background: '#17a2b8',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            📝 Заполнить из профиля
          </button>
          <button
            type="button"
            onClick={handleValidateEmail}
            style={{
              background: '#ffc107',
              color: '#212529',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✓ Проверить email
          </button>
          <button
            type="button"
            onClick={handleValidateAll}
            style={{
              background: '#6f42c1',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✓ Проверить всё
          </button>
        </div>

        <div className="form-group">
          <label>Имя *</label>
          <input {...register('name')} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
          <small style={{ color: '#6c757d', display: 'block', marginTop: '0.25rem' }}>
            Попробуйте taken@example.com для серверной ошибки
          </small>
        </div>

        <div className="form-group">
          <label>Телефон *</label>
          <input {...register('phone')} placeholder="+7 999 123 45 67" />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label>Город *</label>
          <input {...register('city')} />
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>

        <button type="submit">Отправить</button>

        {serverResponse && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: serverResponse.includes('Ошибка') ? '#f8d7da' : '#d4edda',
              borderRadius: '8px',
              border: `1px solid ${serverResponse.includes('Ошибка') ? '#f5c6cb' : '#c3e6cb'}`,
            }}
          >
            {serverResponse}
          </div>
        )}
      </form>
    </div>
  )
}

// ============================================
// Задание 9.4: Отправка только изменённых полей — Решение
// ============================================

const profileSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  email: z.string().email('Неверный email'),
  bio: z.string().optional(),
  city: z.string().min(1, 'Город обязателен'),
})

type ProfileForm = z.infer<typeof profileSchema>

const savedProfile: ProfileForm = {
  firstName: 'Анна',
  lastName: 'Сидорова',
  email: 'anna@example.com',
  bio: 'Frontend-разработчик',
  city: 'Санкт-Петербург',
}

export function Task9_4_Solution() {
  const {
    register,
    handleSubmit,
    formState: { dirtyFields, isDirty, errors },
    watch,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: savedProfile,
  })

  const [submitResult, setSubmitResult] = useState<{
    dirtyOnly: Partial<ProfileForm>
    fullData: ProfileForm
  } | null>(null)

  const currentValues = watch()

  const dirtyData = useMemo(() => {
    const result: Partial<ProfileForm> = {}
    for (const key of Object.keys(dirtyFields) as (keyof ProfileForm)[]) {
      if (dirtyFields[key]) {
        result[key] = currentValues[key]
      }
    }
    return result
  }, [dirtyFields, currentValues])

  const onSubmit = (data: ProfileForm) => {
    const changedFields: Partial<ProfileForm> = {}
    for (const key of Object.keys(dirtyFields) as (keyof ProfileForm)[]) {
      if (dirtyFields[key]) {
        changedFields[key] = data[key]
      }
    }

    setSubmitResult({ dirtyOnly: changedFields, fullData: data })
    console.log('PATCH (только изменённые):', changedFields)
    console.log('PUT (все данные):', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 9.4: Отправка только изменённых полей</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>
            Имя *{' '}
            {dirtyFields.firstName && (
              <span style={{ color: '#ffc107', fontSize: '0.75rem' }}>● изменено</span>
            )}
          </label>
          <input {...register('firstName')} />
          {errors.firstName && <span className="error">{errors.firstName.message}</span>}
        </div>

        <div className="form-group">
          <label>
            Фамилия *{' '}
            {dirtyFields.lastName && (
              <span style={{ color: '#ffc107', fontSize: '0.75rem' }}>● изменено</span>
            )}
          </label>
          <input {...register('lastName')} />
          {errors.lastName && <span className="error">{errors.lastName.message}</span>}
        </div>

        <div className="form-group">
          <label>
            Email *{' '}
            {dirtyFields.email && (
              <span style={{ color: '#ffc107', fontSize: '0.75rem' }}>● изменено</span>
            )}
          </label>
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>
            О себе{' '}
            {dirtyFields.bio && (
              <span style={{ color: '#ffc107', fontSize: '0.75rem' }}>● изменено</span>
            )}
          </label>
          <textarea {...register('bio')} rows={3} />
        </div>

        <div className="form-group">
          <label>
            Город *{' '}
            {dirtyFields.city && (
              <span style={{ color: '#ffc107', fontSize: '0.75rem' }}>● изменено</span>
            )}
          </label>
          <input {...register('city')} />
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>

        <div
          style={{
            padding: '0.75rem',
            background: isDirty ? '#fff3cd' : '#d4edda',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          <strong>Состояние формы:</strong> {isDirty ? 'Есть изменения' : 'Без изменений'}
          {isDirty && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Изменённые поля (PATCH):</strong>
              <pre style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>
                {JSON.stringify(dirtyData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <button type="submit" disabled={!isDirty}>
          Сохранить изменения
        </button>

        {submitResult && (
          <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.75rem',
                background: '#d4edda',
                borderRadius: '8px',
                border: '1px solid #c3e6cb',
              }}
            >
              <strong>PATCH (dirty only):</strong>
              <pre style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem' }}>
                {JSON.stringify(submitResult.dirtyOnly, null, 2)}
              </pre>
            </div>
            <div
              style={{
                flex: 1,
                minWidth: '200px',
                padding: '0.75rem',
                background: '#cce5ff',
                borderRadius: '8px',
                border: '1px solid #b8daff',
              }}
            >
              <strong>PUT (all data):</strong>
              <pre style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem' }}>
                {JSON.stringify(submitResult.fullData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
