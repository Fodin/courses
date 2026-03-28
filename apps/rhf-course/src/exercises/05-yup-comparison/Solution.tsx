import React from 'react'
import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ============================================
// Задание 5.1: Валидация с Yup — Решение
// ============================================

const registrationYupSchema = yup.object({
  email: yup.string().email('Неверный формат email').required('Обязательно'),
  password: yup.string().min(8, 'Минимум 8 символов').required('Обязательно'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Пароли должны совпадать')
    .required('Обязательно'),
  age: yup.number().min(18, 'Минимум 18 лет').max(120, 'Максимум 120 лет').required('Обязательно'),
})

type RegistrationYupForm = yup.InferType<typeof registrationYupSchema>

export function Task5_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationYupForm>({
    resolver: yupResolver(registrationYupSchema),
  })

  const onSubmit = (data: RegistrationYupForm) => {
    console.log('Registered:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 5.1: Валидация с Yup</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input id="email" type="email" {...register('email')} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Пароль *</label>
          <input id="password" type="password" {...register('password')} />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Подтверждение пароля *</label>
          <input id="confirmPassword" type="password" {...register('confirmPassword')} />
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword.message}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="age">Возраст *</label>
          <input id="age" type="number" {...register('age', { valueAsNumber: true })} />
          {errors.age && <span className="error">{errors.age.message}</span>}
        </div>

        <button type="submit">Зарегистрироваться</button>
      </form>

      <div
        style={{ marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}
      >
        <h3>📊 Сравнение Zod vs Yup:</h3>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            <strong>Zod:</strong> TypeScript-first, функциональный API, быстрее
          </li>
          <li>
            <strong>Yup:</strong> Цепочечный API, больше сообщество, проверен временем
          </li>
        </ul>
      </div>
    </div>
  )
}

// ============================================
// Задание 5.2: Сравнение Zod vs Yup — Решение
// ============================================

export function Task5_2_Solution() {
  return (
    <div className="exercise-container">
      <h2>✅ Задание 5.2: Сравнение Zod vs Yup</h2>

      <div
        style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: '#f8f9fa',
          borderRadius: '8px',
          lineHeight: 1.8,
        }}
      >
        <h3>📊 Мой анализ:</h3>

        <h4 style={{ marginTop: '1.5rem', color: '#646cff' }}>1. Что понравилось в Zod:</h4>
        <ul>
          <li>TypeScript-first подход — отличная типизация из коробки</li>
          <li>Функциональный API — более предсказуемый и композируемый</li>
          <li>Лучшая производительность</li>
          <li>
            Метод <code>.refine()</code> для сложной валидации
          </li>
        </ul>

        <h4 style={{ marginTop: '1.5rem', color: '#646cff' }}>2. Что понравилось в Yup:</h4>
        <ul>
          <li>Цепочечный API — очень выразительный</li>
          <li>Большое сообщество и много примеров</li>
          <li>Проверен временем — используется давно</li>
          <li>
            <code>.oneOf()</code> и <code>.notOneOf()</code> для enum-подобной валидации
          </li>
        </ul>

        <h4 style={{ marginTop: '1.5rem', color: '#646cff' }}>3. Выбор для проекта:</h4>
        <p>
          <strong>Для нового TypeScript проекта:</strong> Zod — лучшая типизация и современный API.
        </p>
        <p>
          <strong>Для JavaScript проекта или с большой кодовой базой:</strong> Yup — стабильный
          выбор с большим сообществом.
        </p>
      </div>
    </div>
  )
}
