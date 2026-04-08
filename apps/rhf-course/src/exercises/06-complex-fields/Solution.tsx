import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTheme } from '@courses/platform'

// ============================================
// Задание 6.1: Controller — Решение
// ============================================

const categorySchema = z.object({
  name: z.string().min(1, 'Обязательно'),
  category: z.string().min(1, 'Выберите категорию'),
})

type CategoryForm = z.infer<typeof categorySchema>

const categories = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'clothing', label: 'Одежда' },
  { value: 'books', label: 'Книги' },
  { value: 'home', label: 'Дом' },
]

function CustomSelect({ value, onChange, options, placeholder }: any) {
  return (
    <div style={{ position: 'relative' }}>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        style={{ width: '100%', padding: '0.5rem' }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export function Task6_1_Solution() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
  })

  const onSubmit = (data: CategoryForm) => {
    console.log('Category:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 6.1: Controller</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Название товара *</label>
          <input type="text" {...register('name')} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Категория *</label>
          <Controller
            name="category"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <CustomSelect {...field} options={categories} placeholder="Выберите категорию" />
            )}
          />
          {errors.category && <span className="error">{errors.category.message}</span>}
        </div>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.2: Radio и Select — Решение
// ============================================

const profileSchema = z.object({
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Выберите пол' }),
  country: z.string().min(1, 'Выберите страну'),
})

type ProfileForm = z.infer<typeof profileSchema>

export function Task6_2_Solution() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  })

  const onSubmit = (data: ProfileForm) => {
    console.log('Profile:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 6.2: Radio и Select</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Пол *</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="radio" value="male" {...register('gender')} />
              Мужской
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="radio" value="female" {...register('gender')} />
              Женский
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="radio" value="other" {...register('gender')} />
              Другой
            </label>
          </div>
          {errors.gender && <span className="error">{errors.gender.message}</span>}
        </div>

        <div className="form-group">
          <label>Страна *</label>
          <select {...register('country')}>
            <option value="">Выберите страну</option>
            <option value="us">USA</option>
            <option value="ru">Russia</option>
            <option value="de">Germany</option>
            <option value="fr">France</option>
            <option value="uk">UK</option>
          </select>
          {errors.country && <span className="error">{errors.country.message}</span>}
        </div>

        <button type="submit">Сохранить</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.3: Checkbox — Решение
// ============================================

const skillsSchema = z.object({
  agree: z.boolean().refine(v => v, 'Необходимо согласие'),
  skills: z.array(z.string()).min(1, 'Выберите хотя бы один навык'),
})

type SkillsForm = z.infer<typeof skillsSchema>

const allSkills = ['React', 'Vue', 'Angular', 'Svelte']

export function Task6_3_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillsForm>({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  })

  const selectedSkills = watch('skills', [])

  const handleSkillChange = (skill: string, checked: boolean) => {
    if (checked) {
      setValue('skills', [...selectedSkills, skill])
    } else {
      setValue(
        'skills',
        selectedSkills.filter(s => s !== skill)
      )
    }
  }

  const onSubmit = (data: SkillsForm) => {
    console.log('Skills:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 6.3: Checkbox</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Согласие *</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gap: '0.5rem',
              alignItems: 'start',
            }}
          >
            <input
              type="checkbox"
              {...register('agree')}
              style={{ justifySelf: 'start', marginTop: '0.25rem' }}
            />
            <span style={{ cursor: 'pointer' }}>Я согласен с правилами обработки данных *</span>
          </div>
          {errors.agree && <span className="error">{errors.agree.message}</span>}
        </div>

        <div className="form-group">
          <label>Навыки *</label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '20px 1fr',
              gap: '0.5rem 0.5rem',
              alignItems: 'start',
            }}
          >
            {allSkills.map(skill => (
              <React.Fragment key={skill}>
                <input
                  type="checkbox"
                  value={skill}
                  checked={selectedSkills.includes(skill)}
                  onChange={e => handleSkillChange(skill, e.target.checked)}
                  style={{ justifySelf: 'start', marginTop: '0.25rem' }}
                />
                <span style={{ cursor: 'pointer' }}>{skill}</span>
              </React.Fragment>
            ))}
          </div>
          {errors.skills && <span className="error">{errors.skills.message}</span>}
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.5rem',
            background: isDark ? '#21262d' : '#f5f5f5',
            borderRadius: '4px',
            color: isDark ? '#e6edf3' : '#213547',
          }}
        >
          Выбрано: {selectedSkills.join(', ') || 'ничего'}
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Сохранить
        </button>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.4: Маски и форматирование — Решение
// ============================================

const maskedSchema = z.object({
  phone: z
    .string()
    .min(1, 'Телефон обязателен')
    .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, 'Формат: +7 (XXX) XXX-XX-XX'),
  cardNumber: z
    .string()
    .min(1, 'Номер карты обязателен')
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, 'Введите 16 цифр'),
  amount: z
    .string()
    .min(1, 'Сумма обязательна')
    .refine(v => parseFloat(v.replace(/\s/g, '')) > 0, 'Сумма должна быть больше 0'),
})

type MaskedForm = z.infer<typeof maskedSchema>

function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length === 0) return ''
  let result = '+7'
  if (digits.length > 1) result += ' (' + digits.slice(1, 4)
  if (digits.length >= 4) result += ') '
  if (digits.length > 4) result += digits.slice(4, 7)
  if (digits.length > 7) result += '-' + digits.slice(7, 9)
  if (digits.length > 9) result += '-' + digits.slice(9, 11)
  return result
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16)
  const groups = digits.match(/.{1,4}/g)
  return groups ? groups.join(' ') : ''
}

function formatCurrency(value: string): string {
  const cleaned = value.replace(/[^\d.]/g, '')
  const parts = cleaned.split('.')
  const intPart = parts[0] || ''
  const decPart = parts.length > 1 ? '.' + parts[1].slice(0, 2) : ''
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  return formatted + decPart
}

export function Task6_4_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MaskedForm>({
    resolver: zodResolver(maskedSchema),
    defaultValues: { phone: '', cardNumber: '', amount: '' },
  })

  const onSubmit = (data: MaskedForm) => {
    console.log('Masked form:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 6.4: Маски и форматирование</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Телефон *</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={field.value}
                onChange={e => field.onChange(formatPhone(e.target.value))}
                onBlur={field.onBlur}
                placeholder="+7 (___) ___-__-__"
              />
            )}
          />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <div className="form-group">
          <label>Номер карты *</label>
          <Controller
            name="cardNumber"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={field.value}
                onChange={e => field.onChange(formatCardNumber(e.target.value))}
                onBlur={field.onBlur}
                placeholder="0000 0000 0000 0000"
              />
            )}
          />
          {errors.cardNumber && <span className="error">{errors.cardNumber.message}</span>}
        </div>

        <div className="form-group">
          <label>Сумма *</label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <input
                type="text"
                value={field.value}
                onChange={e => field.onChange(formatCurrency(e.target.value))}
                onBlur={field.onBlur}
                placeholder="1 234.56"
              />
            )}
          />
          {errors.amount && <span className="error">{errors.amount.message}</span>}
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: isDark ? '#21262d' : '#f5f5f5',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: isDark ? '#e6edf3' : '#213547',
          }}
        >
          <strong>Подсказка:</strong> Controller перехватывает onChange и форматирует значение перед
          сохранением в форму.
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Оплатить
        </button>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.5: Controller Transform — Решение
// ============================================

const transformSchema = z.object({
  rating: z.number().min(1, 'Поставьте рейтинг'),
  color: z.string().min(1, 'Выберите цвет'),
  notifications: z.boolean(),
})

type TransformForm = z.infer<typeof transformSchema>

function StarRating({
  value,
  onChange,
}: {
  value: number
  onChange: (val: number) => void
}) {
  const [hovered, setHovered] = useState(0)

  return (
    <div style={{ display: 'flex', gap: '0.25rem' }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.75rem',
            cursor: 'pointer',
            color: star <= (hovered || value) ? '#f59e0b' : '#d1d5db',
            padding: '0.125rem',
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
      <span style={{ marginLeft: '0.5rem', alignSelf: 'center', fontSize: '0.875rem' }}>
        {value > 0 ? `${value} из 5` : 'не выбрано'}
      </span>
    </div>
  )
}

function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (val: string) => void
}) {
  const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']

  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      {colors.map(color => (
        <button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: color,
            border: value === color ? '3px solid #fff' : '3px solid transparent',
            boxShadow: value === color ? `0 0 0 2px ${color}` : 'none',
            cursor: 'pointer',
          }}
        />
      ))}
      {value && (
        <span style={{ alignSelf: 'center', fontSize: '0.875rem', marginLeft: '0.5rem' }}>
          {value}
        </span>
      )}
    </div>
  )
}

function ToggleSwitch({
  value,
  onChange,
}: {
  value: boolean
  onChange: (val: boolean) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        width: '50px',
        height: '26px',
        borderRadius: '13px',
        background: value ? '#22c55e' : '#d1d5db',
        border: 'none',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '3px',
          left: value ? '27px' : '3px',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
        }}
      />
    </button>
  )
}

export function Task6_5_Solution() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TransformForm>({
    resolver: zodResolver(transformSchema),
    defaultValues: { rating: 0, color: '', notifications: false },
  })

  const formValues = watch()

  const onSubmit = (data: TransformForm) => {
    console.log('Transform form:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 6.5: Controller Transform</h2>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Рейтинг *</label>
          <Controller
            name="rating"
            control={control}
            render={({ field }) => (
              <StarRating value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.rating && <span className="error">{errors.rating.message}</span>}
        </div>

        <div className="form-group">
          <label>Цвет темы *</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <ColorPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.color && <span className="error">{errors.color.message}</span>}
        </div>

        <div className="form-group">
          <label style={{ marginBottom: '0.5rem', display: 'block' }}>Уведомления</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Controller
              name="notifications"
              control={control}
              render={({ field }) => (
                <ToggleSwitch value={field.value} onChange={field.onChange} />
              )}
            />
            <span style={{ fontSize: '0.875rem' }}>
              {formValues.notifications ? 'Включены' : 'Выключены'}
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: isDark ? '#21262d' : '#f5f5f5',
            borderRadius: '4px',
            fontSize: '0.875rem',
            color: isDark ? '#e6edf3' : '#213547',
          }}
        >
          <strong>Значения формы:</strong>
          <pre style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
            {JSON.stringify(formValues, null, 2)}
          </pre>
        </div>

        <button type="submit" style={{ marginTop: '1rem' }}>
          Сохранить настройки
        </button>
      </form>
    </div>
  )
}
