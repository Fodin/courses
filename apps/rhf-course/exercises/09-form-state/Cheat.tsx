import { useState } from 'react'
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
