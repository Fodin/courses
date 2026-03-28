import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ============================================
// Задание 3.1: Базовая валидация с Zod — Решение
// ============================================

const registrationSchema = z
  .object({
    email: z.string().email('Неверный формат email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirmPassword: z.string(),
    age: z.number().min(18, 'Минимум 18 лет').max(120, 'Максимум 120 лет'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  })

type RegistrationForm = z.infer<typeof registrationSchema>

export function Task3_1_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = (data: RegistrationForm) => {
    console.log('Registered:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 3.1: Базовая валидация с Zod</h2>

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
    </div>
  )
}

// ============================================
// Задание 3.2: Сложные схемы — Решение
// ============================================

const contactSchema = z.object({
  type: z.enum(['email', 'phone', 'telegram']),
  value: z.string().min(1, 'Обязательно'),
})

const profileSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, 'Обязательно'),
    lastName: z.string().min(1, 'Обязательно'),
    age: z.number().min(18, 'Минимум 18 лет'),
  }),
  contacts: z.array(contactSchema).min(1, 'Минимум один контакт'),
  skills: z.array(z.string()).min(1, 'Минимум один навык'),
  role: z.enum(['developer', 'designer', 'manager']),
  bio: z.string().max(500, 'Максимум 500 символов').optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export function Task3_2_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      contacts: [{ type: 'email', value: '' }],
      skills: [''],
    },
  })

  const onSubmit = (data: ProfileForm) => {
    console.log('Profile:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 3.2: Сложные схемы</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        <fieldset
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #333',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <legend style={{ padding: '0 0.5rem', color: '#646cff' }}>Личная информация</legend>

          <div className="form-group">
            <label>Имя *</label>
            <input type="text" {...register('personalInfo.firstName')} />
            {errors.personalInfo?.firstName && (
              <span className="error">{errors.personalInfo.firstName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Фамилия *</label>
            <input type="text" {...register('personalInfo.lastName')} />
            {errors.personalInfo?.lastName && (
              <span className="error">{errors.personalInfo.lastName.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Возраст *</label>
            <input type="number" {...register('personalInfo.age', { valueAsNumber: true })} />
            {errors.personalInfo?.age && (
              <span className="error">{errors.personalInfo.age.message}</span>
            )}
          </div>
        </fieldset>

        <fieldset
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #333',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <legend style={{ padding: '0 0.5rem', color: '#646cff' }}>Контакты</legend>

          <div className="form-group">
            <label>Тип контакта *</label>
            <select {...register('contacts.0.type')}>
              <option value="email">Email</option>
              <option value="phone">Телефон</option>
              <option value="telegram">Telegram</option>
            </select>
          </div>

          <div className="form-group">
            <label>Значение *</label>
            <input type="text" {...register('contacts.0.value')} />
            {errors.contacts?.[0]?.value && (
              <span className="error">{errors.contacts[0].value.message}</span>
            )}
          </div>
        </fieldset>

        <fieldset
          style={{
            marginBottom: '1.5rem',
            border: '1px solid #333',
            padding: '1rem',
            borderRadius: '8px',
          }}
        >
          <legend style={{ padding: '0 0.5rem', color: '#646cff' }}>Навыки</legend>

          <div className="form-group">
            <label>Навык *</label>
            <input
              type="text"
              {...register('skills.0')}
              placeholder="Например: React, TypeScript"
            />
            {errors.skills?.[0] && <span className="error">{errors.skills[0]?.message}</span>}
          </div>
        </fieldset>

        <div className="form-group">
          <label>Роль *</label>
          <select {...register('role')}>
            <option value="developer">Разработчик</option>
            <option value="designer">Дизайнер</option>
            <option value="manager">Менеджер</option>
          </select>
          {errors.role && <span className="error">{errors.role.message}</span>}
        </div>

        <div className="form-group">
          <label>О себе</label>
          <textarea
            {...register('bio')}
            rows={4}
            style={{ width: '100%' }}
            placeholder="Расскажите о себе..."
          />
          {errors.bio && <span className="error">{errors.bio.message}</span>}
        </div>

        <button type="submit">Сохранить профиль</button>
      </form>
    </div>
  )
}
