import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 12.1: Async валидация — Решение
// ============================================

const asyncSchema = z.object({
  email: z.string().email('Неверный формат'),
  username: z.string().min(3, 'Минимум 3 символа'),
})

type AsyncForm = z.infer<typeof asyncSchema>

// Имитация проверки на сервере
const checkUsername = async (username: string): Promise<boolean> => {
  await new Promise(r => setTimeout(r, 500))
  return !['admin', 'user', 'test'].includes(username.toLowerCase())
}

export function Task12_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<AsyncForm>({
    resolver: zodResolver(asyncSchema),
    mode: 'onChange',
  })

  const [checking, setChecking] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)

  const validateUsername = useCallback(
    async (value: string) => {
      if (!value || value.length < 3) return true
      setChecking(true)
      const isAvailable = await checkUsername(value)
      setAvailable(isAvailable)
      setChecking(false)
      if (!isAvailable) {
        setError('username', { type: 'manual', message: 'Имя занято' })
        return false
      }
      clearErrors('username')
      return true
    },
    [setError, clearErrors]
  )

  const onSubmit = (data: AsyncForm) => {
    console.log('Submitted:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 12.1: Async Валидация</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Username *</label>
          <input
            {...register('username')}
            onBlur={e => validateUsername(e.target.value)}
            placeholder="Введите username"
          />
          {checking && (
            <span style={{ color: '#0d6efd', fontSize: '0.875rem' }}> ⏳ Проверка...</span>
          )}
          {available === true && (
            <span style={{ color: '#198754', fontSize: '0.875rem' }}> ✅ Доступно</span>
          )}
          {available === false && (
            <span style={{ color: '#dc3545', fontSize: '0.875rem' }}> ❌ Занято</span>
          )}
          {errors.username && <span className="error">{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <button type="submit">Отправить</button>

        <p style={{ fontSize: '0.75rem', color: '#6c757d', marginTop: '1rem' }}>
          Попробуйте: admin, user, test (заняты) или любое другое (свободно)
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 12.2: Загрузка данных — Решение
// ============================================

const userEditSchema = z.object({
  name: z.string().min(1, 'Обязательно'),
  email: z.string().email('Неверный email'),
  bio: z.string().optional(),
})

type UserEditForm = z.infer<typeof userEditSchema>

const mockFetchUser = async (_id: number): Promise<UserEditForm> => {
  await new Promise(r => setTimeout(r, 800))
  return { name: 'John Doe', email: 'john@example.com', bio: 'Developer' }
}

export function Task12_2_Solution() {
  const [loading, setLoading] = useState(true)
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<UserEditForm>({
    resolver: zodResolver(userEditSchema),
  })

  useEffect(() => {
    mockFetchUser(1).then(data => {
      reset(data)
      setLoading(false)
    })
  }, [reset])

  const onSubmit = (data: UserEditForm) => {
    console.log('Updated:', data)
  }

  if (loading) {
    return (
      <div className="exercise-container">
        <h2>✅ Задание 12.2: Загрузка Данных</h2>
        <div style={{ padding: '2rem', textAlign: 'center', color: '#6c757d' }}>
          ⏳ Загрузка данных...
        </div>
      </div>
    )
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 12.2: Загрузка Данных (Edit Mode)</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Name</label>
          <input {...register('name')} />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register('email')} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea {...register('bio')} rows={3} />
        </div>

        <button type="submit" disabled={!isDirty} style={{ opacity: isDirty ? 1 : 0.6 }}>
          Сохранить {isDirty && '*'}
        </button>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Кнопка активна только при изменении данных
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 12.3: Async defaultValues и isLoading — Решение
// ============================================

interface UserProfileForm {
  name: string
  email: string
  bio: string
}

const fetchUser = async (): Promise<UserProfileForm> => {
  await new Promise(r => setTimeout(r, 1500))
  return { name: 'John Doe', email: 'john@example.com', bio: 'Разработчик' }
}

export function Task12_3_Solution() {
  const [externalUser, setExternalUser] = useState<UserProfileForm | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<UserProfileForm>({
    defaultValues: fetchUser,
    values: externalUser ?? undefined,
  })

  const onSubmit = (data: UserProfileForm) => {
    console.log('Updated:', data)
  }

  const handleRefresh = async () => {
    const user = await fetchUser()
    setExternalUser({ ...user, name: 'Jane Doe (обновлено)' })
  }

  if (isLoading) {
    return (
      <div className="exercise-container">
        <h2>✅ Задание 12.3: Async defaultValues</h2>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <div style={{ color: '#6c757d' }}>Загрузка данных пользователя...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 12.3: Async defaultValues</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Имя *</label>
          <input {...register('name', { required: 'Обязательно' })} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            {...register('email', {
              required: 'Обязательно',
              pattern: { value: /^\S+@\S+$/, message: 'Неверный email' },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>О себе *</label>
          <textarea
            {...register('bio', { required: 'Обязательно' })}
            rows={4}
            style={{ width: '100%' }}
          />
          {errors.bio && <span className="error">{errors.bio.message}</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">Сохранить</button>
          <button
            type="button"
            onClick={handleRefresh}
            style={{ background: '#17a2b8', color: '#fff', border: 'none' }}
          >
            🔄 Обновить данные
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Данные загружены через async defaultValues. Кнопка «Обновить» использует values для
          синхронизации.
        </p>
      </form>
    </div>
  )
}
