import { useState, useEffect, useRef } from 'react'
import {
  useForm,
  useFormState,
  FormProvider,
  useFormContext,
  Controller,
  Control,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 14.1: Интеграция с UI-библиотекой — Решение
// ============================================

// Кастомный TextField компонент
function TextField({ label, error, ...props }: any) {
  return (
    <div className="form-group">
      {label && <label htmlFor={props.id}>{label}</label>}
      <input
        style={{
          borderColor: error ? '#dc3545' : '#ddd',
          width: '100%',
        }}
        {...props}
      />
      {error && <span className="error">{error}</span>}
    </div>
  )
}

// Кастомный Button компонент
function Button({ children, loading, ...props }: any) {
  return (
    <button
      {...props}
      disabled={loading}
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'not-allowed' : 'pointer',
      }}
    >
      {loading ? '⏳' : children}
    </button>
  )
}

const uiSchema = z.object({
  name: z.string().min(1, 'Обязательно'),
  email: z.string().email('Неверный email'),
})

type UIForm = z.infer<typeof uiSchema>

export function Task14_1_Solution() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UIForm>({
    resolver: zodResolver(uiSchema),
  })

  const onSubmit = async (data: UIForm) => {
    await new Promise(r => setTimeout(r, 1000))
    console.log('Submitted:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.1: Интеграция с UI-библиотекой</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} id="name" label="Name" error={errors.name?.message} />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              id="email"
              type="email"
              label="Email"
              error={errors.email?.message}
            />
          )}
        />

        <Button type="submit" loading={isSubmitting}>
          Отправить
        </Button>
      </form>
    </div>
  )
}

// ============================================
// Задание 14.2: Кастомные хуки — Решение
// ============================================

function useFormPersist<T extends Record<string, any>>(name: string, defaultValues?: T) {
  const [stored, setStored] = useState<T>(() => {
    const saved = localStorage.getItem(`form-${name}`)
    return saved ? JSON.parse(saved) : defaultValues
  })

  const save = (values: T) => {
    localStorage.setItem(`form-${name}`, JSON.stringify(values))
    setStored(values)
  }

  const clear = () => {
    localStorage.removeItem(`form-${name}`)
    setStored(defaultValues || ({} as T))
  }

  return { stored, save, clear }
}

const persistSchema = z.object({
  title: z.string().min(1, 'Обязательно'),
  content: z.string().min(1, 'Обязательно'),
})

type PersistForm = z.infer<typeof persistSchema>

export function Task14_2_Solution() {
  const { stored, save, clear } = useFormPersist<PersistForm>('article', {
    title: '',
    content: '',
  })

  const { register, handleSubmit, reset, watch } = useForm<PersistForm>({
    resolver: zodResolver(persistSchema),
    defaultValues: stored,
  })

  const values = watch()

  useEffect(() => {
    save(values)
  }, [values])

  const onSubmit = (data: PersistForm) => {
    console.log('Submitted:', data)
    clear()
    reset({ title: '', content: '' })
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.2: Кастомные Хуки (useFormPersist)</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Title</label>
          <input {...register('title')} />
        </div>

        <div className="form-group">
          <label>Content</label>
          <textarea {...register('content')} rows={5} style={{ width: '100%' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit">Сохранить</button>
          <button
            type="button"
            onClick={clear}
            style={{ background: '#dc3545', color: '#fff', border: 'none' }}
          >
            Очистить localStorage
          </button>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Данные сохраняются в localStorage при каждом изменении. Перезагрузите страницу!
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 14.3: FormContext — Решение
// ============================================

function PersonalStep() {
  const { register } = useFormContext()
  return (
    <>
      <div className="form-group">
        <label>First Name</label>
        <input {...register('firstName')} />
      </div>
      <div className="form-group">
        <label>Last Name</label>
        <input {...register('lastName')} />
      </div>
    </>
  )
}

function ContactStep() {
  const { register } = useFormContext()
  return (
    <>
      <div className="form-group">
        <label>Email</label>
        <input type="email" {...register('email')} />
      </div>
      <div className="form-group">
        <label>Phone</label>
        <input type="tel" {...register('phone')} />
      </div>
    </>
  )
}

export function Task14_3_Solution() {
  const [step, setStep] = useState(1)
  const methods = useForm({
    defaultValues: { firstName: '', lastName: '', email: '', phone: '' },
  })

  const onSubmit = (data: any) => {
    console.log('Submitted:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.3: FormContext (разделение форм)</h2>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                background: step === 1 ? '#646cff' : '#ffffff',
                color: step === 1 ? '#fff' : '#213547',
                border: step === 1 ? '2px solid #646cff' : '1px solid #ddd',
              }}
            >
              Личные
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                background: step === 2 ? '#646cff' : '#ffffff',
                color: step === 2 ? '#fff' : '#213547',
                border: step === 2 ? '2px solid #646cff' : '1px solid #ddd',
              }}
            >
              Контакты
            </button>
          </div>

          {step === 1 ? <PersonalStep /> : <ContactStep />}

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)}>
                ← Назад
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                style={{ background: '#646cff', color: '#fff', border: 'none' }}
              >
                Далее →
              </button>
            ) : (
              <button type="submit">Отправить</button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  )
}

// ============================================
// Задание 14.4: localStorage Persistence — Решение
// ============================================

const draftSchema = z.object({
  subject: z.string().min(1, 'Обязательно'),
  body: z.string().min(1, 'Обязательно'),
})

type DraftForm = z.infer<typeof draftSchema>

export function Task14_4_Solution() {
  const { register, handleSubmit, reset, watch } = useForm<DraftForm>({
    resolver: zodResolver(draftSchema),
    defaultValues: () => {
      const saved = localStorage.getItem('email-draft')
      return saved ? JSON.parse(saved) : { subject: '', body: '' }
    },
  })

  const values = watch()

  useEffect(() => {
    localStorage.setItem('email-draft', JSON.stringify(values))
  }, [values])

  const onSubmit = (data: DraftForm) => {
    console.log('Sent:', data)
    localStorage.removeItem('email-draft')
    reset({ subject: '', body: '' })
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.4: localStorage Persistence</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Subject</label>
          <input {...register('subject')} />
        </div>

        <div className="form-group">
          <label>Body</label>
          <textarea {...register('body')} rows={8} style={{ width: '100%' }} />
        </div>

        <button type="submit">Отправить</button>

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Черновик автоматически сохраняется. Перезагрузите страницу!
        </p>
      </form>
    </div>
  )
}

// ============================================
// Задание 14.5: Финальный проект — Решение
// ============================================

const finalSchema = z
  .object({
    // Step 1: Account
    email: z.string().email('Неверный email'),
    password: z.string().min(8, 'Минимум 8 символов'),
    confirm: z.string(),
    // Step 2: Profile
    firstName: z.string().min(1, 'Обязательно'),
    lastName: z.string().min(1, 'Обязательно'),
    avatar: z.instanceof(FileList).optional(),
    // Step 3: Settings
    newsletter: z.boolean().optional(),
    notifications: z.boolean().optional(),
  })
  .refine(data => data.password === data.confirm, {
    message: 'Пароли не совпадают',
    path: ['confirm'],
  })

type FinalForm = z.infer<typeof finalSchema>

export function Task14_5_Solution() {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState<FinalForm | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FinalForm>({
    resolver: zodResolver(finalSchema),
    mode: 'onChange',
  })

  const onNext = async () => {
    const fields =
      step === 1
        ? (['email', 'password', 'confirm'] as const)
        : step === 2
          ? (['firstName', 'lastName'] as const)
          : []
    const valid = await trigger(fields)
    if (valid) setStep(s => s + 1)
  }

  const onPrev = () => setStep(s => s - 1)

  const onSubmit = (data: FinalForm) => {
    setSubmitted(data)
    console.log('Registered:', data)
  }

  const avatar = watch('avatar')

  useEffect(() => {
    if (avatar?.[0]) {
      const url = URL.createObjectURL(avatar[0])
      setAvatarPreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [avatar])

  if (submitted) {
    return (
      <div className="exercise-container">
        <h2>🎉 Регистрация завершена!</h2>
        <div
          style={{
            padding: '1.5rem',
            background: '#d1e7dd',
            borderRadius: '8px',
            marginTop: '1rem',
          }}
        >
          <h3>Данные формы:</h3>
          <pre style={{ marginTop: '1rem', overflow: 'auto' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
        <button
          onClick={() => {
            setSubmitted(null)
            setStep(1)
          }}
          style={{ marginTop: '1rem' }}
        >
          Начать заново
        </button>
      </div>
    )
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.5: Финальный Проект — Регистрация</h2>

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

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '450px' }}>
        {step === 1 && (
          <>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" {...register('email')} />
              {errors.email && <span className="error">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password *</label>
              <input type="password" {...register('password')} />
              {errors.password && <span className="error">{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" {...register('confirm')} />
              {errors.confirm && <span className="error">{errors.confirm.message}</span>}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group">
              <label>First Name *</label>
              <input {...register('firstName')} />
              {errors.firstName && <span className="error">{errors.firstName.message}</span>}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input {...register('lastName')} />
              {errors.lastName && <span className="error">{errors.lastName.message}</span>}
            </div>

            <div className="form-group">
              <label>Avatar</label>
              <input
                type="file"
                accept="image/*"
                {...register('avatar')}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setAvatarPreview(URL.createObjectURL(file))
                  }
                }}
              />
              {avatarPreview && (
                <img
                  src={avatarPreview}
                  alt="Preview"
                  style={{ maxWidth: '150px', marginTop: '0.5rem', borderRadius: '8px' }}
                />
              )}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" {...register('newsletter')} />
                Подписаться на рассылку
              </label>
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={watch('notifications')}
                  onChange={e => setValue('notifications', e.target.checked)}
                />
                Уведомления
              </label>
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
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
            <button type="submit">Завершить регистрацию</button>
          )}
        </div>
      </form>
    </div>
  )
}

// ============================================
// Задание 14.6: useFormState и тестирование — Решение
// ============================================

interface LoginTestForm {
  email: string
  password: string
}

function SubmitButton({ control }: { control: Control<LoginTestForm> }) {
  const { isSubmitting, isValid } = useFormState({ control })
  const renderCount = useRef(0)
  renderCount.current++

  return (
    <div>
      <button type="submit" disabled={!isValid || isSubmitting}>
        {isSubmitting ? 'Отправка...' : 'Войти'}
      </button>
      <small style={{ display: 'block', marginTop: '0.5rem', color: '#6c757d' }}>
        SubmitButton renders: {renderCount.current}
      </small>
    </div>
  )
}

export function Task14_6_Solution() {
  const renderCount = useRef(0)
  renderCount.current++

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginTestForm>({
    defaultValues: { email: '', password: '' },
    mode: 'onChange',
  })

  const onSubmit = async (data: LoginTestForm) => {
    await new Promise(r => setTimeout(r, 1000))
    console.log('Login:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.6: useFormState и тестирование</h2>

      <div style={{ fontSize: '0.875rem', color: '#6c757d', marginBottom: '1rem' }}>
        🔄 Рендеров формы: {renderCount.current}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="login-email">Email *</label>
          <input
            id="login-email"
            type="email"
            {...register('email', {
              required: 'Обязательно',
              pattern: { value: /^\S+@\S+$/, message: 'Неверный email' },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Пароль *</label>
          <input
            id="login-password"
            type="password"
            {...register('password', {
              required: 'Обязательно',
              minLength: { value: 6, message: 'Минимум 6 символов' },
            })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <SubmitButton control={control} />
      </form>

      <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
        💡 SubmitButton использует useFormState и ререндерится только при изменении
        isValid/isSubmitting, а не при каждом вводе текста.
      </p>
    </div>
  )
}

// ============================================
// Задание 14.7: Формы в модальных окнах — Решение
// ============================================

interface Contact {
  name: string
  email: string
  phone: string
}

const contactSchema = z.object({
  name: z.string().min(1, 'Имя обязательно'),
  email: z.string().email('Неверный email'),
  phone: z.string().min(5, 'Минимум 5 символов'),
})

type ContactForm = z.infer<typeof contactSchema>

function ContactModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (contact: Contact) => void
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', phone: '' },
  })

  const onSubmit = (data: ContactForm) => {
    onAdd(data)
    reset()
    onClose()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!open) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          padding: '1.5rem',
          width: '100%',
          maxWidth: '420px',
          color: '#213547',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ marginTop: 0 }}>Добавить контакт</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
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

          <div className="form-group">
            <label>Телефон *</label>
            <input type="tel" {...register('phone')} />
            {errors.phone && <span className="error">{errors.phone.message}</span>}
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button type="submit">Добавить</button>
            <button
              type="button"
              onClick={handleClose}
              style={{ background: '#6c757d', color: '#fff', border: 'none' }}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function Task14_7_Solution() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  const handleAdd = (contact: Contact) => {
    setContacts(prev => [...prev, contact])
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.7: Формы в модальных окнах</h2>

      <div style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0 }}>Контакты ({contacts.length})</h3>
          <button onClick={() => setModalOpen(true)}>+ Добавить</button>
        </div>

        {contacts.length === 0 ? (
          <p style={{ color: '#6c757d' }}>Список пуст. Нажмите "Добавить" для создания контакта.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                <th style={{ padding: '0.5rem' }}>Имя</th>
                <th style={{ padding: '0.5rem' }}>Email</th>
                <th style={{ padding: '0.5rem' }}>Телефон</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '0.5rem' }}>{c.name}</td>
                  <td style={{ padding: '0.5rem' }}>{c.email}</td>
                  <td style={{ padding: '0.5rem' }}>{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 useForm создаётся внутри модального окна — при закрытии состояние формы полностью сбрасывается.
        </p>
      </div>

      <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} onAdd={handleAdd} />
    </div>
  )
}

// ============================================
// Задание 14.8: Remote Form Submit — Решение
// ============================================

const remoteSchema = z.object({
  title: z.string().min(1, 'Заголовок обязателен'),
  description: z.string().min(10, 'Минимум 10 символов'),
  priority: z.enum(['low', 'medium', 'high'], { required_error: 'Выберите приоритет' }),
})

type RemoteForm = z.infer<typeof remoteSchema>

const REMOTE_FORM_ID = 'remote-task-form'

export function Task14_8_Solution() {
  const [result, setResult] = useState<RemoteForm | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RemoteForm>({
    resolver: zodResolver(remoteSchema),
    defaultValues: { title: '', description: '', priority: undefined },
  })

  const onSubmit = async (data: RemoteForm) => {
    await new Promise(r => setTimeout(r, 800))
    setResult(data)
    console.log('Task created:', data)
  }

  const handleExternalSubmit = () => {
    handleSubmit(onSubmit)()
  }

  const handleExternalReset = () => {
    reset()
    setResult(null)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.8: Remote Form Submit</h2>

      <div style={{ maxWidth: '500px' }}>
        {/* Тулбар с кнопками ВЫНЕСЕН за пределы формы */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            background: '#f0f0ff',
            borderRadius: '8px 8px 0 0',
            borderBottom: '2px solid #646cff',
          }}
        >
          {/* Способ 1: кнопка с form= атрибутом */}
          <button
            type="submit"
            form={REMOTE_FORM_ID}
            disabled={isSubmitting}
            style={{ background: '#646cff', color: '#fff', border: 'none' }}
          >
            {isSubmitting ? '⏳ Сохранение...' : '💾 Сохранить (form=id)'}
          </button>

          {/* Способ 2: handleSubmit вызывается напрямую */}
          <button
            type="button"
            onClick={handleExternalSubmit}
            disabled={isSubmitting}
            style={{ background: '#198754', color: '#fff', border: 'none' }}
          >
            📤 Отправить (onClick)
          </button>

          {/* Сброс формы извне */}
          <button
            type="button"
            onClick={handleExternalReset}
            disabled={!isDirty && !result}
            style={{ background: '#dc3545', color: '#fff', border: 'none' }}
          >
            🗑 Сброс
          </button>
        </div>

        {/* Тело формы */}
        <form
          id={REMOTE_FORM_ID}
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          style={{
            padding: '1rem',
            border: '1px solid #ddd',
            borderTop: 'none',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <div className="form-group">
            <label>Заголовок *</label>
            <input {...register('title')} />
            {errors.title && <span className="error">{errors.title.message}</span>}
          </div>

          <div className="form-group">
            <label>Описание *</label>
            <textarea {...register('description')} rows={4} style={{ width: '100%' }} />
            {errors.description && <span className="error">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Приоритет *</label>
            <select {...register('priority')}>
              <option value="">-- Выберите --</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
            {errors.priority && <span className="error">{errors.priority.message}</span>}
          </div>
        </form>

        {result && (
          <div
            style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#d1e7dd',
              borderRadius: '8px',
            }}
          >
            <strong>Создана задача:</strong>
            <pre style={{ marginTop: '0.5rem' }}>{JSON.stringify(result, null, 2)}</pre>
          </div>
        )}

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Кнопки находятся ВНЕ тега &lt;form&gt;. Первая использует атрибут form=&quot;id&quot;,
          вторая вызывает handleSubmit() напрямую через onClick.
        </p>
      </div>
    </div>
  )
}

// ============================================
// Задание 14.9: Вложенные формы и поля — Решение
// ============================================

const companySchema = z.object({
  company: z.string().min(1, 'Название компании обязательно'),
  address: z.object({
    country: z.string().min(1, 'Выберите страну'),
    city: z.string().min(1, 'Город обязателен'),
    street: z.string().min(1, 'Улица обязательна'),
    zip: z.string().min(4, 'Минимум 4 символа'),
  }),
  contacts: z.object({
    primary: z.object({
      name: z.string().min(1, 'Имя обязательно'),
      email: z.string().email('Неверный email'),
    }),
    billing: z.object({
      name: z.string().min(1, 'Имя обязательно'),
      email: z.string().email('Неверный email'),
    }),
  }),
})

type CompanyForm = z.infer<typeof companySchema>

// Подформа адреса — получает prefix и использует useFormContext
function AddressSubForm({ prefix }: { prefix: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyForm>()

  const getError = (field: string) => {
    const parts = `${prefix}.${field}`.split('.')
    let err: any = errors
    for (const p of parts) {
      err = err?.[p]
    }
    return err?.message as string | undefined
  }

  return (
    <fieldset
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>Адрес</legend>

      <div className="form-group">
        <label>Страна *</label>
        <select {...register(`${prefix}.country` as any)}>
          <option value="">Выберите страну</option>
          <option value="ru">Россия</option>
          <option value="us">США</option>
          <option value="de">Германия</option>
        </select>
        {getError('country') && <span className="error">{getError('country')}</span>}
      </div>

      <div className="form-group">
        <label>Город *</label>
        <input {...register(`${prefix}.city` as any)} />
        {getError('city') && <span className="error">{getError('city')}</span>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem' }}>
        <div className="form-group">
          <label>Улица *</label>
          <input {...register(`${prefix}.street` as any)} />
          {getError('street') && <span className="error">{getError('street')}</span>}
        </div>
        <div className="form-group">
          <label>Индекс *</label>
          <input {...register(`${prefix}.zip` as any)} />
          {getError('zip') && <span className="error">{getError('zip')}</span>}
        </div>
      </div>
    </fieldset>
  )
}

// Подформа контакта — переиспользуемый компонент
function ContactSubForm({ prefix, title }: { prefix: string; title: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyForm>()

  const getError = (field: string) => {
    const parts = `${prefix}.${field}`.split('.')
    let err: any = errors
    for (const p of parts) {
      err = err?.[p]
    }
    return err?.message as string | undefined
  }

  return (
    <fieldset
      style={{
        border: '1px solid #ddd',
        borderRadius: '6px',
        padding: '1rem',
        marginBottom: '1rem',
      }}
    >
      <legend style={{ fontWeight: 600, padding: '0 0.5rem' }}>{title}</legend>

      <div className="form-group">
        <label>Имя *</label>
        <input {...register(`${prefix}.name` as any)} />
        {getError('name') && <span className="error">{getError('name')}</span>}
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input type="email" {...register(`${prefix}.email` as any)} />
        {getError('email') && <span className="error">{getError('email')}</span>}
      </div>
    </fieldset>
  )
}

export function Task14_9_Solution() {
  const [submitted, setSubmitted] = useState<CompanyForm | null>(null)
  const [copyBilling, setCopyBilling] = useState(false)

  const methods = useForm<CompanyForm>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: '',
      address: { country: '', city: '', street: '', zip: '' },
      contacts: {
        primary: { name: '', email: '' },
        billing: { name: '', email: '' },
      },
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = methods

  // Копирование primary → billing
  const primaryName = watch('contacts.primary.name')
  const primaryEmail = watch('contacts.primary.email')

  useEffect(() => {
    if (copyBilling) {
      setValue('contacts.billing.name', primaryName)
      setValue('contacts.billing.email', primaryEmail)
    }
  }, [copyBilling, primaryName, primaryEmail, setValue])

  const onSubmit = (data: CompanyForm) => {
    setSubmitted(data)
    console.log('Company:', data)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 14.9: Вложенные формы и поля</h2>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '500px' }}>
          <div className="form-group">
            <label>Название компании *</label>
            <input {...register('company')} />
            {errors.company && <span className="error">{errors.company.message}</span>}
          </div>

          <AddressSubForm prefix="address" />

          <ContactSubForm prefix="contacts.primary" title="Основной контакт" />

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={copyBilling}
              onChange={e => setCopyBilling(e.target.checked)}
            />
            Использовать данные основного контакта для биллинга
          </label>

          <ContactSubForm prefix="contacts.billing" title="Контакт для биллинга" />

          <button type="submit">Сохранить компанию</button>
        </form>
      </FormProvider>

      {submitted && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#d1e7dd',
            borderRadius: '8px',
            maxWidth: '500px',
          }}
        >
          <strong>Данные формы (вложенная структура):</strong>
          <pre style={{ marginTop: '0.5rem', overflow: 'auto', fontSize: '0.8rem' }}>
            {JSON.stringify(submitted, null, 2)}
          </pre>
        </div>
      )}

      <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem', maxWidth: '500px' }}>
        💡 Поля регистрируются через точечную нотацию (address.city, contacts.primary.email).
        Подформы — обычные компоненты, получающие prefix и используя useFormContext.
      </p>
    </div>
  )
}
