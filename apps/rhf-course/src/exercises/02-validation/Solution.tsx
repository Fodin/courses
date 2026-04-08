import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

// ============================================
// Задание 2.1: Built-in валидация — Решение
// ============================================

interface RegistrationForm {
  username: string
  email: string
  age: number
  password: string
}

export function Task2_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>()

  const onSubmit = (data: RegistrationForm) => {
    console.log('Registered:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 2.1: Built-in валидация</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="username">Username *</label>
          <input
            id="username"
            type="text"
            {...register('username', {
              required: 'Username обязателен',
              minLength: { value: 3, message: 'Минимум 3 символа' },
              maxLength: { value: 20, message: 'Максимум 20 символов' },
            })}
          />
          {errors.username && <span className="error">{errors.username.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email обязателен',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            id="age"
            type="number"
            {...register('age', {
              required: 'Возраст обязателен',
              min: { value: 18, message: 'Минимум 18 лет' },
              max: { value: 120, message: 'Максимум 120 лет' },
              valueAsNumber: true,
            })}
          />
          {errors.age && <span className="error">{errors.age.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              minLength: { value: 6, message: 'Минимум 6 символов' },
            })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <button type="submit">Зарегистрироваться</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 2.2: Pattern валидация — Решение
// ============================================

interface PatternForm {
  phone: string
  website: string
  hexColor: string
  slug: string
}

const patterns = {
  phone: /^\+7\s?\(?\d{3}\)?\s?\d{3}-?\d{2}-?\d{2}$/,
  url: /^https?:\/\/.+\..+$/,
  hex: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
}

export function Task2_2_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatternForm>()

  const onSubmit = (data: PatternForm) => {
    console.log('Patterns:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 2.2: Pattern валидация</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="phone">Телефон (+7 XXX XXX-XX-XX) *</label>
          <input
            id="phone"
            type="text"
            {...register('phone', {
              required: 'Телефон обязателен',
              pattern: {
                value: patterns.phone,
                message: 'Формат: +7 XXX XXX-XX-XX',
              },
            })}
            placeholder="+7 999 123-45-67"
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="website">Сайт (https://...) *</label>
          <input
            id="website"
            type="text"
            {...register('website', {
              required: 'Сайт обязателен',
              pattern: {
                value: patterns.url,
                message: 'Должен начинаться с http:// или https://',
              },
            })}
            placeholder="https://example.com"
          />
          {errors.website && <span className="error">{errors.website.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="hexColor">HEX цвет *</label>
          <input
            id="hexColor"
            type="text"
            {...register('hexColor', {
              required: 'Цвет обязателен',
              pattern: {
                value: patterns.hex,
                message: 'Формат: #FFF или #FFFFFF',
              },
            })}
            placeholder="#3498db"
          />
          {errors.hexColor && <span className="error">{errors.hexColor.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="slug">Slug *</label>
          <input
            id="slug"
            type="text"
            {...register('slug', {
              required: 'Slug обязателен',
              pattern: {
                value: patterns.slug,
                message: 'Только латиница, цифры и дефисы',
              },
            })}
            placeholder="my-awesome-page"
          />
          {errors.slug && <span className="error">{errors.slug.message}</span>}
        </div>

        <button type="submit">Проверить</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 2.3: Custom валидация — Решение
// ============================================

interface PasswordForm {
  password: string
}

export function Task2_3_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordForm>()

  const onSubmit = (data: PasswordForm) => {
    console.log('Password valid:', data.password)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 2.3: Custom валидация пароля</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Пароль обязателен',
              validate: {
                minLength: v => v.length >= 8 || 'Минимум 8 символов',
                uppercase: v => /[A-Z]/.test(v) || 'Должна быть заглавная буква',
                number: v => /\d/.test(v) || 'Должна быть цифра',
                special: v => /[!@#$%^&*]/.test(v) || 'Должен быть специальный символ',
              },
            })}
          />
          {errors.password && (
            <div style={{ color: '#ff6b6b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {typeof errors.password.message === 'string'
                ? errors.password.message
                : 'Ошибка валидации'}
            </div>
          )}
        </div>

        <button type="submit">Проверить пароль</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 2.4: Cross-field валидация — Решение
// ============================================

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  email: string
}

export function Task2_4_Solution() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>()

  const newPassword = watch('newPassword')
  const currentPassword = watch('currentPassword')

  const onSubmit = (data: ChangePasswordForm) => {
    console.log('Change password:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 2.4: Cross-field валидация</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="currentPassword">Текущий пароль *</label>
          <input
            id="currentPassword"
            type="password"
            {...register('currentPassword', {
              required: 'Обязательно',
              minLength: { value: 6, message: 'Минимум 6 символов' },
            })}
          />
          {errors.currentPassword && (
            <span className="error">{errors.currentPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">Новый пароль *</label>
          <input
            id="newPassword"
            type="password"
            {...register('newPassword', {
              required: 'Обязательно',
              minLength: { value: 8, message: 'Минимум 8 символов' },
            })}
          />
          {errors.newPassword && <span className="error">{errors.newPassword.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля *</label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword', {
              required: 'Обязательно',
              validate: {
                match: v => v === newPassword || 'Пароли не совпадают',
                different: v => v !== currentPassword || 'Новый пароль должен отличаться',
              },
            })}
          />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email для уведомления *</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Обязательно',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Неверный формат email',
              },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <button type="submit">Сменить пароль</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 2.5: Режимы валидации — Решение
// ============================================

type ValidationMode = 'onSubmit' | 'onBlur' | 'onChange' | 'onTouched' | 'all'

interface ModeForm {
  username: string
  email: string
}

function ValidationModeForm({ mode }: { mode: ValidationMode }) {
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isSubmitted },
    reset,
  } = useForm<ModeForm>({ mode })

  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (data: ModeForm) => {
    setSubmitted(true)
    console.log(`[${mode}] Submitted:`, data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
      <div className="form-group">
        <label htmlFor={`username-${mode}`}>Username *</label>
        <input
          id={`username-${mode}`}
          type="text"
          {...register('username', {
            required: 'Username обязателен',
            minLength: { value: 3, message: 'Минимум 3 символа' },
          })}
          placeholder="Введите username"
        />
        {errors.username && <span className="error">{errors.username.message}</span>}
      </div>

      <div className="form-group">
        <label htmlFor={`email-${mode}`}>Email *</label>
        <input
          id={`email-${mode}`}
          type="text"
          {...register('email', {
            required: 'Email обязателен',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Неверный формат email',
            },
          })}
          placeholder="Введите email"
        />
        {errors.email && <span className="error">{errors.email.message}</span>}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit">Отправить</button>
        <button
          type="button"
          onClick={() => {
            reset()
            setSubmitted(false)
          }}
        >
          Сбросить
        </button>
      </div>

      {submitted && (
        <p style={{ color: '#22c55e', marginTop: '0.5rem' }}>Форма отправлена!</p>
      )}
    </form>
  )
}

export function Task2_5_Solution() {
  const [activeMode, setActiveMode] = useState<ValidationMode>('onSubmit')

  const modes: { value: ValidationMode; label: string; description: string }[] = [
    {
      value: 'onSubmit',
      label: 'onSubmit',
      description: 'Валидация срабатывает только при отправке формы (по умолчанию)',
    },
    {
      value: 'onBlur',
      label: 'onBlur',
      description: 'Валидация срабатывает при потере фокуса (blur), далее при каждом изменении',
    },
    {
      value: 'onChange',
      label: 'onChange',
      description: 'Валидация срабатывает при каждом изменении значения поля',
    },
    {
      value: 'onTouched',
      label: 'onTouched',
      description: 'Валидация при первом blur, затем при каждом изменении',
    },
    {
      value: 'all',
      label: 'all',
      description: 'Валидация при blur И при onChange одновременно',
    },
  ]

  return (
    <div className="exercise-container">
      <h2>✅ Задание 2.5: Режимы валидации</h2>

      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ marginBottom: '0.75rem' }}>Выберите режим валидации:</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {modes.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setActiveMode(m.value)}
              style={{
                padding: '0.5rem 1rem',
                border: '2px solid',
                borderColor: activeMode === m.value ? '#3b82f6' : '#6b7280',
                borderRadius: '6px',
                background: activeMode === m.value ? '#3b82f6' : 'transparent',
                color: activeMode === m.value ? '#fff' : 'inherit',
                cursor: 'pointer',
                fontWeight: activeMode === m.value ? 600 : 400,
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div
        style={{
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '6px',
          background: '#f0f9ff',
          border: '1px solid #bae6fd',
          color: '#0c4a6e',
        }}
      >
        <strong>Режим: {activeMode}</strong>
        <p style={{ margin: '0.25rem 0 0' }}>
          {modes.find(m => m.value === activeMode)?.description}
        </p>
      </div>

      <ValidationModeForm key={activeMode} mode={activeMode} />
    </div>
  )
}
