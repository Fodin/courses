import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 10.1: Focus management — Решение
// ============================================

const focusSchema = z
  .object({
    email: z.string().email('Неверный email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirm: z.string(),
  })
  .refine(data => data.password === data.confirm, {
    message: 'Пароли не совпадают',
    path: ['confirm'],
  })

type FocusForm = z.infer<typeof focusSchema>

export function Task10_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FocusForm>({
    resolver: zodResolver(focusSchema),
  })

  const onSubmit = (data: FocusForm) => {
    console.log('Submitted:', data)
  }

  useEffect(() => {
    const firstError = Object.keys(errors)[0] as keyof FocusForm
    if (firstError) {
      const element = document.getElementById(firstError)
      element?.focus()
    }
  }, [errors])

  return (
    <div className="exercise-container">
      <h2>✅ Задание 10.1: Focus Management</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirm">Подтверждение пароля</label>
          <input id="confirm" type="password" {...register('confirm')} />
          {errors.confirm && <span className="error">{errors.confirm.message}</span>}
        </div>

        <button type="submit">Отправить</button>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 При ошибке фокус автоматически переходит к первому полю с ошибкой
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 10.2: Accessibility (ARIA) — Решение
// ============================================

const a11ySchema = z.object({
  username: z.string().min(3, 'Минимум 3 символа'),
  email: z.string().email('Неверный email'),
})

type A11yForm = z.infer<typeof a11ySchema>

export function Task10_2_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<A11yForm>({
    resolver: zodResolver(a11ySchema),
  })

  const onSubmit = (data: A11yForm) => {
    console.log('Submitted:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 10.2: Accessibility (ARIA)</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ maxWidth: '400px' }}
        aria-label="Форма регистрации"
        noValidate
      >
        {isSubmitted && Object.keys(errors).length > 0 && (
          <div
            role="alert"
            style={{
              padding: '1rem',
              background: '#f8d7da',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#721c24',
            }}
          >
            <strong>Имеются ошибки в форме</strong>
          </div>
        )}

        <div className="form-group">
          <label htmlFor="a11y-username">Username</label>
          <input
            id="a11y-username"
            type="text"
            {...register('username')}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username && (
            <span id="username-error" className="error" role="alert">
              {errors.username.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="a11y-email">Email</label>
          <input
            id="a11y-email"
            type="email"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error" role="alert">
              {errors.email.message}
            </span>
          )}
        </div>

        <button type="submit">Отправить</button>
      </form>
    </div>
  )
}
