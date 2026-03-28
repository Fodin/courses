import { useState, useEffect, useRef } from 'react'
import { useForm, useFormState } from 'react-hook-form'
import type { Control } from 'react-hook-form'

// ============================================
// Задание 11.1: Performance — Решение
// ============================================

export function Task11_1_Solution() {
  const [renderCount, setRenderCount] = useState(0)
  const { register, watch } = useForm<{ text: string }>({
    defaultValues: { text: '' },
  })
  const values = watch()
  const prevValue = useRef('')

  // Увеличиваем счётчик только когда пользователь меняет текст
  useEffect(() => {
    if (prevValue.current !== values.text) {
      prevValue.current = values.text
      if (values.text) {
        setRenderCount(c => c + 1)
      }
    }
  }, [values])

  return (
    <div className="exercise-container">
      <h2>✅ Задание 11.1: Performance Оптимизация</h2>
      <form style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Текст (следите за счётчиком рендеров)</label>
          <input {...register('text')} placeholder="Введите текст..." />
        </div>

        <div
          style={{
            padding: '1rem',
            background: '#17a2b8',
            color: '#fff',
            borderRadius: '8px',
            marginTop: '1rem',
            fontWeight: 600,
          }}
        >
          🔄 Рендеров от изменений: {renderCount}
        </div>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Совет: используйте <code>useWatch</code> для подписки на отдельные поля вместо{' '}
          <code>watch()</code> для всех полей
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 11.2: setFocus, resetField, getFieldState — Решение
// ============================================

interface LoginForm {
  username: string
  email: string
  password: string
}

function FieldStatus({ control, name }: { control: Control<LoginForm>; name: keyof LoginForm }) {
  const { dirtyFields, touchedFields } = useFormState({ control })
  return (
    <span style={{ fontSize: '0.75rem', color: '#6c757d' }}>
      {dirtyFields[name] ? ' 📝' : ''}
      {touchedFields[name] ? ' 👆' : ''}
    </span>
  )
}

export function Task11_2_Solution() {
  const {
    register,
    handleSubmit,
    setFocus,
    resetField,
    getFieldState,
    control,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { username: '', email: '', password: '' },
    mode: 'onTouched',
  })

  const renderCount = useRef(0)
  renderCount.current++

  useEffect(() => {
    setFocus('username')
  }, [setFocus])

  const onSubmit = (data: LoginForm) => {
    console.log('Submitted:', data)
  }

  const handleResetEmail = () => {
    resetField('email', { keepTouched: false })
    setFocus('email')
  }

  const handleShowState = (field: keyof LoginForm) => {
    const state = getFieldState(field)
    alert(
      `${field}:\nisDirty: ${state.isDirty}\nisTouched: ${state.isTouched}\nerror: ${state.error?.message ?? 'нет'}`
    )
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 11.2: setFocus, resetField, getFieldState</h2>

      <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
        🔄 Рендеров формы: {renderCount.current}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>
            Username * <FieldStatus control={control} name="username" />
          </label>
          <input
            {...register('username', {
              required: 'Обязательно',
              minLength: { value: 3, message: 'Мин. 3' },
            })}
          />
          {errors.username && <span className="error">{errors.username.message}</span>}
          <button
            type="button"
            onClick={() => handleShowState('username')}
            style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}
          >
            📊 getFieldState
          </button>
        </div>

        <div className="form-group">
          <label>
            Email * <FieldStatus control={control} name="email" />
          </label>
          <input
            {...register('email', {
              required: 'Обязательно',
              pattern: { value: /^\S+@\S+$/, message: 'Неверный email' },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
            <button type="button" onClick={handleResetEmail} style={{ fontSize: '0.75rem' }}>
              🗑️ resetField
            </button>
            <button
              type="button"
              onClick={() => handleShowState('email')}
              style={{ fontSize: '0.75rem' }}
            >
              📊 getFieldState
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>
            Password * <FieldStatus control={control} name="password" />
          </label>
          <input
            type="password"
            {...register('password', {
              required: 'Обязательно',
              minLength: { value: 6, message: 'Мин. 6' },
            })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">Войти</button>
          <button type="button" onClick={() => setFocus('username')}>
            🎯 Фокус на username
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 При загрузке фокус ставится на username через setFocus. Кнопки 📊 показывают
          getFieldState для каждого поля.
        </p>
      </form>
    </div>
  )
}
