import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 8.1: useFieldArray — Решение
// ============================================

const emailsSchema = z.object({
  emails: z
    .array(
      z.object({
        value: z.string().email('Неверный email'),
      })
    )
    .min(1, 'Минимум один email'),
})

type EmailsForm = z.infer<typeof emailsSchema>

export function Task8_1_Solution() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailsForm>({
    resolver: zodResolver(emailsSchema),
    defaultValues: { emails: [{ value: '' }] },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'emails' })

  const onSubmit = (data: EmailsForm) => {
    console.log('Emails:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.1: useFieldArray</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}
          >
            <input
              {...register(`emails.${index}.value` as const)}
              placeholder="Email"
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              style={{
                background: '#dc3545',
                color: '#fff',
                border: 'none',
                padding: '0.5rem 0.75rem',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
            {errors.emails?.[index]?.value && (
              <span className="error">{errors.emails[index]?.value?.message}</span>
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() => append({ value: '' })}
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Добавить
          </button>
          <button type="submit">Отправить</button>
        </div>
      </form>
    </div>
  )
}

// ============================================
// Задание 8.2: Условные поля — Решение
// ============================================

type ContactMethod = 'email' | 'phone' | 'telegram'

const conditionalSchema = z
  .object({
    contactMethod: z.enum(['email', 'phone', 'telegram']),
    email: z.string().email('Неверный email').optional(),
    phone: z.string().min(10, 'Минимум 10 цифр').optional(),
    telegram: z.string().min(1, 'Обязательно').optional(),
  })
  .refine(
    data => {
      if (data.contactMethod === 'email') return !!data.email
      if (data.contactMethod === 'phone') return !!data.phone
      return !!data.telegram
    },
    { message: 'Заполните контакт', path: ['email'] }
  )

type ConditionalForm = z.infer<typeof conditionalSchema>

export function Task8_2_Solution() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ConditionalForm>({
    resolver: zodResolver(conditionalSchema),
  })

  const method = watch('contactMethod')

  const onSubmit = (data: ConditionalForm) => {
    console.log('Contact:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.2: Условные поля</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Способ связи *</label>
          <select {...register('contactMethod')}>
            <option value="">Выберите способ</option>
            <option value="email">Email</option>
            <option value="phone">Телефон</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>

        {method === 'email' && (
          <div className="form-group">
            <label>Email *</label>
            <input type="email" {...register('email')} />
            {errors.email && <span className="error">{errors.email.message}</span>}
          </div>
        )}

        {method === 'phone' && (
          <div className="form-group">
            <label>Телефон *</label>
            <input type="tel" {...register('phone')} placeholder="+7 999 123 45 67" />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>
        )}

        {method === 'telegram' && (
          <div className="form-group">
            <label>Telegram *</label>
            <input type="text" {...register('telegram')} placeholder="@username" />
            {errors.telegram && <span className="error">{errors.telegram.message}</span>}
          </div>
        )}

        <button type="submit">Отправить</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 8.3: Зависимые поля — Решение
// ============================================

const citiesByCountry: Record<string, string[]> = {
  ru: ['Москва', 'Санкт-Петербург', 'Казань'],
  us: ['New York', 'Los Angeles', 'Chicago'],
  de: ['Berlin', 'Munich', 'Hamburg'],
}

const dependentSchema = z.object({
  country: z.string().min(1, 'Выберите страну'),
  city: z.string().min(1, 'Выберите город'),
})

type DependentForm = z.infer<typeof dependentSchema>

export function Task8_3_Solution() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DependentForm>({
    resolver: zodResolver(dependentSchema),
  })

  const country = watch('country')
  const cities = country ? citiesByCountry[country] || [] : []

  const onSubmit = (data: DependentForm) => {
    console.log('Address:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.3: Зависимые поля</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label>Страна *</label>
          <select
            {...register('country')}
            onChange={e => {
              setValue('country', e.target.value)
              setValue('city', '')
            }}
          >
            <option value="">Выберите страну</option>
            <option value="ru">Россия</option>
            <option value="us">USA</option>
            <option value="de">Germany</option>
          </select>
          {errors.country && <span className="error">{errors.country.message}</span>}
        </div>

        <div className="form-group">
          <label>Город *</label>
          <select {...register('city')} disabled={!country}>
            <option value="">Выберите город</option>
            {cities.map(city => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <span className="error">{errors.city.message}</span>}
        </div>

        <button type="submit" disabled={!country}>
          Отправить
        </button>
      </form>
    </div>
  )
}

// ============================================
// Задание 8.4: Wizard (multi-step) — Решение
// ============================================

const wizardSchema = z.object({
  name: z.string().min(1, 'Обязательно'),
  email: z.string().email('Неверный email'),
  address: z.string().min(1, 'Обязательно'),
  comments: z.string().optional(),
})

type WizardForm = z.infer<typeof wizardSchema>

export function Task8_4_Solution() {
  const [step, setStep] = useState(1)
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<WizardForm>()

  const onNext = async () => {
    const fields = step === 1 ? ['name' as const, 'email' as const] : ['address' as const]
    const isValid = await trigger(fields)
    if (isValid) setStep(s => s + 1)
  }

  const onPrev = () => setStep(s => s - 1)

  const onSubmit = (data: WizardForm) => {
    console.log('Order:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.4: Wizard (multi-step)</h2>

      <div
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          background: '#f0f0ff',
          borderRadius: '4px',
          display: 'inline-block',
        }}
      >
        Шаг {step} из 3
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label>Имя *</label>
              <input {...register('name')} />
              {errors.name && <span className="error">{errors.name.message}</span>}
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" {...register('email')} />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="form-group">
            <label>Адрес доставки *</label>
            <input {...register('address')} placeholder="Город, улица, дом" />
            {errors.address && <span className="error">{errors.address.message}</span>}
          </div>
        )}

        {step === 3 && (
          <div className="form-group">
            <label>Комментарий к заказу</label>
            <textarea {...register('comments')} rows={4} placeholder="Пожелания к доставке..." />
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {step > 1 && (
            <button type="button" onClick={onPrev}>
              ← Назад
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={onNext}
              style={{ background: '#646cff', color: '#fff', border: 'none' }}
            >
              Далее →
            </button>
          ) : (
            <button type="submit">Оформить заказ</button>
          )}
        </div>
      </form>
    </div>
  )
}

// ============================================
// Задание 8.5: Вложенные Field Arrays — Решение
// ============================================

const courseBuilderSchema = z.object({
  courseTitle: z.string().min(1, 'Название курса обязательно'),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, 'Название модуля обязательно'),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1, 'Название урока обязательно'),
              duration: z.string().min(1, 'Укажите длительность'),
            })
          )
          .min(1, 'Минимум один урок в модуле'),
      })
    )
    .min(1, 'Минимум один модуль'),
})

type CourseBuilderForm = z.infer<typeof courseBuilderSchema>

function ModuleLessons({
  moduleIndex,
  control,
  register,
  errors,
}: {
  moduleIndex: number
  control: any
  register: any
  errors: any
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons` as const,
  })

  return (
    <div style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
      <strong style={{ fontSize: '0.85rem', color: '#6c757d' }}>Уроки:</strong>
      {fields.map((lesson, lessonIndex) => (
        <div
          key={lesson.id}
          style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            marginTop: '0.25rem',
          }}
        >
          <input
            {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.title` as const)}
            placeholder="Название урока"
            style={{ flex: 2 }}
          />
          <input
            {...register(`modules.${moduleIndex}.lessons.${lessonIndex}.duration` as const)}
            placeholder="Длительность"
            style={{ flex: 1 }}
          />
          <button
            type="button"
            onClick={() => remove(lessonIndex)}
            style={{
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            ✕
          </button>
        </div>
      ))}
      {errors?.modules?.[moduleIndex]?.lessons?.map?.((lessonErr: any, li: number) => (
        <div key={li}>
          {lessonErr?.title && (
            <span className="error" style={{ fontSize: '0.75rem' }}>
              Урок {li + 1}: {lessonErr.title.message}
            </span>
          )}
        </div>
      ))}
      {errors?.modules?.[moduleIndex]?.lessons?.root && (
        <span className="error" style={{ fontSize: '0.75rem' }}>
          {errors.modules[moduleIndex].lessons.root.message}
        </span>
      )}
      <button
        type="button"
        onClick={() => append({ title: '', duration: '' })}
        style={{
          marginTop: '0.25rem',
          background: '#17a2b8',
          color: '#fff',
          border: 'none',
          padding: '0.25rem 0.75rem',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '0.8rem',
        }}
      >
        + Урок
      </button>
    </div>
  )
}

export function Task8_5_Solution() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseBuilderForm>({
    resolver: zodResolver(courseBuilderSchema),
    defaultValues: {
      courseTitle: '',
      modules: [{ title: '', lessons: [{ title: '', duration: '' }] }],
    },
  })

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({ control, name: 'modules' })

  const [submitted, setSubmitted] = useState<CourseBuilderForm | null>(null)

  const onSubmit = (data: CourseBuilderForm) => {
    setSubmitted(data)
    console.log('Course:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.5: Вложенные Field Arrays</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Название курса *</label>
          <input {...register('courseTitle')} placeholder="Мой курс" />
          {errors.courseTitle && <span className="error">{errors.courseTitle.message}</span>}
        </div>

        {moduleFields.map((module, moduleIndex) => (
          <div
            key={module.id}
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1rem',
              background: '#f8f9fa',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <strong>Модуль {moduleIndex + 1}</strong>
              <input
                {...register(`modules.${moduleIndex}.title` as const)}
                placeholder="Название модуля"
                style={{ flex: 1 }}
              />
              <button
                type="button"
                onClick={() => removeModule(moduleIndex)}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
            {errors.modules?.[moduleIndex]?.title && (
              <span className="error">{errors.modules[moduleIndex]?.title?.message}</span>
            )}

            <ModuleLessons
              moduleIndex={moduleIndex}
              control={control}
              register={register}
              errors={errors}
            />
          </div>
        ))}

        {errors.modules?.root && (
          <span className="error">{errors.modules.root.message}</span>
        )}

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            onClick={() =>
              appendModule({ title: '', lessons: [{ title: '', duration: '' }] })
            }
            style={{
              background: '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            + Модуль
          </button>
          <button type="submit">Сохранить курс</button>
        </div>

        {submitted && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#d4edda',
              borderRadius: '8px',
              border: '1px solid #c3e6cb',
            }}
          >
            <strong>Результат:</strong>
            <pre style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem' }}>
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  )
}

// ============================================
// Задание 8.6: Field Array с валидацией и контролем — Решение
// ============================================

const teamSchema = z.object({
  teamName: z.string().min(1, 'Название команды обязательно'),
  members: z
    .array(
      z.object({
        name: z.string().min(1, 'Имя обязательно'),
        role: z.enum(['developer', 'designer', 'manager', 'qa'], {
          errorMap: () => ({ message: 'Выберите роль' }),
        }),
      })
    )
    .min(2, 'Минимум 2 участника')
    .max(5, 'Максимум 5 участников'),
})

type TeamForm = z.infer<typeof teamSchema>

export function Task8_6_Solution() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamForm>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      teamName: '',
      members: [
        { name: '', role: 'developer' },
        { name: '', role: 'developer' },
      ],
    },
  })

  const { fields, append, remove, move, swap, insert } = useFieldArray({
    control,
    name: 'members',
  })

  const [submitted, setSubmitted] = useState<TeamForm | null>(null)

  const onSubmit = (data: TeamForm) => {
    setSubmitted(data)
    console.log('Team:', data)
  }

  const roleLabels: Record<string, string> = {
    developer: 'Разработчик',
    designer: 'Дизайнер',
    manager: 'Менеджер',
    qa: 'Тестировщик',
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 8.6: Field Array с валидацией и контролем</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '600px' }}>
        <div className="form-group">
          <label>Название команды *</label>
          <input {...register('teamName')} placeholder="Dream Team" />
          {errors.teamName && <span className="error">{errors.teamName.message}</span>}
        </div>

        <div
          style={{
            padding: '0.5rem 0.75rem',
            background: fields.length < 2 ? '#f8d7da' : fields.length >= 5 ? '#fff3cd' : '#d4edda',
            borderRadius: '4px',
            marginBottom: '1rem',
            fontSize: '0.85rem',
          }}
        >
          Участники: {fields.length} / 5 (минимум 2)
        </div>

        {errors.members?.root && (
          <span className="error" style={{ display: 'block', marginBottom: '0.5rem' }}>
            {errors.members.root.message}
          </span>
        )}

        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '0.75rem',
              marginBottom: '0.5rem',
              background: '#f8f9fa',
            }}
          >
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 600, minWidth: '1.5rem' }}>#{index + 1}</span>
              <input
                {...register(`members.${index}.name` as const)}
                placeholder="Имя"
                style={{ flex: 2 }}
              />
              <select {...register(`members.${index}.role` as const)} style={{ flex: 1 }}>
                <option value="">Роль</option>
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => remove(index)}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>
            {errors.members?.[index]?.name && (
              <span className="error" style={{ fontSize: '0.75rem' }}>
                {errors.members[index]?.name?.message}
              </span>
            )}
            {errors.members?.[index]?.role && (
              <span className="error" style={{ fontSize: '0.75rem' }}>
                {errors.members[index]?.role?.message}
              </span>
            )}
            <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
              <button
                type="button"
                onClick={() => index > 0 && move(index, index - 1)}
                disabled={index === 0}
                style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
              >
                ↑ Вверх
              </button>
              <button
                type="button"
                onClick={() => index < fields.length - 1 && move(index, index + 1)}
                disabled={index === fields.length - 1}
                style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
              >
                ↓ Вниз
              </button>
              {index < fields.length - 1 && (
                <button
                  type="button"
                  onClick={() => swap(index, index + 1)}
                  style={{ fontSize: '0.75rem', padding: '0.15rem 0.4rem' }}
                >
                  ⇅ Swap с #{index + 2}
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <button
            type="button"
            onClick={() => fields.length < 5 && append({ name: '', role: 'developer' })}
            disabled={fields.length >= 5}
            style={{
              background: fields.length >= 5 ? '#6c757d' : '#28a745',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: fields.length >= 5 ? 'not-allowed' : 'pointer',
            }}
          >
            + Добавить в конец
          </button>
          <button
            type="button"
            onClick={() =>
              fields.length < 5 && insert(0, { name: '', role: 'developer' })
            }
            disabled={fields.length >= 5}
            style={{
              background: fields.length >= 5 ? '#6c757d' : '#17a2b8',
              color: '#fff',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              cursor: fields.length >= 5 ? 'not-allowed' : 'pointer',
            }}
          >
            + Вставить в начало
          </button>
          <button type="submit">Сохранить команду</button>
        </div>

        {submitted && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#d4edda',
              borderRadius: '8px',
              border: '1px solid #c3e6cb',
            }}
          >
            <strong>Результат:</strong>
            <pre style={{ marginTop: '0.5rem', marginBottom: 0, fontSize: '0.8rem' }}>
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  )
}
