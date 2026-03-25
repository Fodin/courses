import { useState, useRef, type FormEvent } from 'react'

// ============================================
// Задание 6.1: Ошибки валидации — Решение
// ============================================

interface ValidationErrors {
  [field: string]: string[]
}

function validate(data: { name: string; email: string; age: string }): ValidationErrors {
  const errors: ValidationErrors = {}

  if (!data.name.trim()) {
    errors.name = ['Имя обязательно']
  } else if (data.name.length < 2) {
    errors.name = ['Имя должно быть не менее 2 символов']
  }

  if (!data.email.trim()) {
    errors.email = ['Email обязательно']
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = ['Некорректный формат email']
  }

  if (!data.age.trim()) {
    errors.age = ['Возраст обязателен']
  } else {
    const num = parseInt(data.age, 10)
    const ageErrors: string[] = []
    if (isNaN(num)) ageErrors.push('Возраст должен быть числом')
    if (num < 18) ageErrors.push('Минимальный возраст — 18')
    if (num > 120) ageErrors.push('Максимальный возраст — 120')
    if (ageErrors.length) errors.age = ageErrors
  }

  return errors
}

export function Task6_1_Solution() {
  const [formData, setFormData] = useState({ name: '', email: '', age: '' })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const validationErrors = validate(formData)
    setErrors(validationErrors)
    setSubmitted(true)

    if (Object.keys(validationErrors).length === 0) {
      alert('Форма отправлена!')
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (submitted) {
      const newData = { ...formData, [field]: value }
      setErrors(validate(newData))
    }
  }

  const fieldStyle = (field: string) => ({
    borderColor: errors[field] ? '#ef5350' : '#ccc',
    outline: errors[field] ? '2px solid #ef5350' : undefined,
  })

  return (
    <div className="exercise-container">
      <h2>Задание 6.1: Ошибки валидации</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input id="name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} style={fieldStyle('name')} />
          {errors.name?.map((e, i) => <p key={i} style={{ color: '#ef5350', fontSize: '0.85rem', margin: '0.25rem 0' }}>{e}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} style={fieldStyle('email')} />
          {errors.email?.map((e, i) => <p key={i} style={{ color: '#ef5350', fontSize: '0.85rem', margin: '0.25rem 0' }}>{e}</p>)}
        </div>
        <div className="form-group">
          <label htmlFor="age">Возраст</label>
          <input id="age" value={formData.age} onChange={(e) => handleChange('age', e.target.value)} style={fieldStyle('age')} />
          {errors.age?.map((e, i) => <p key={i} style={{ color: '#ef5350', fontSize: '0.85rem', margin: '0.25rem 0' }}>{e}</p>)}
        </div>
        <button type="submit">Отправить</button>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.2: Серверные ошибки — Решение
// ============================================

interface ServerValidationError {
  field: string
  message: string
}

function simulateServerValidation(data: { username: string; email: string }): Promise<{ success: boolean }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const errors: ServerValidationError[] = []
      if (data.username === 'admin') {
        errors.push({ field: 'username', message: 'Имя "admin" уже занято' })
      }
      if (data.email.endsWith('@test.com')) {
        errors.push({ field: 'email', message: 'Домен @test.com запрещён' })
      }
      if (errors.length > 0) {
        reject({ status: 422, errors })
      } else {
        resolve({ success: true })
      }
    }, 500)
  })
}

export function Task6_2_Solution() {
  const [formData, setFormData] = useState({ username: '', email: '' })
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setServerErrors({})
    setLoading(true)
    setSuccess(false)

    try {
      await simulateServerValidation(formData)
      setSuccess(true)
    } catch (error: unknown) {
      const err = error as { status: number; errors: ServerValidationError[] }
      if (err.status === 422) {
        const mapped: Record<string, string> = {}
        for (const e of err.errors) {
          mapped[e.field] = e.message
        }
        setServerErrors(mapped)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.2: Серверные ошибки</h2>
      <p style={{ color: '#666' }}>Попробуйте: username="admin" или email с @test.com</p>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input id="username" value={formData.username} onChange={(e) => setFormData((p) => ({ ...p, username: e.target.value }))} />
          {serverErrors.username && <p style={{ color: '#ef5350', fontSize: '0.85rem' }}>{serverErrors.username}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="s-email">Email</label>
          <input id="s-email" type="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
          {serverErrors.email && <p style={{ color: '#ef5350', fontSize: '0.85rem' }}>{serverErrors.email}</p>}
        </div>
        <button type="submit" disabled={loading}>{loading ? 'Проверка...' : 'Отправить'}</button>
      </form>
      {success && <div style={{ marginTop: '1rem', padding: '1rem', background: '#e8f5e9', borderRadius: '8px' }}>Регистрация успешна!</div>}
    </div>
  )
}

// ============================================
// Задание 6.3: Отображение ошибок — Решение
// ============================================

export function Task6_3_Solution() {
  const [errors, setErrors] = useState<string[]>([])
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const showInlineError = () => {
    setFieldErrors({ email: 'Введите корректный email' })
    setErrors([])
  }

  const showSummary = () => {
    setErrors(['Имя обязательно', 'Email некорректен', 'Пароль слишком короткий'])
    setFieldErrors({})
  }

  const showToast = () => {
    setErrors(['Не удалось сохранить. Попробуйте позже.'])
    setTimeout(() => setErrors([]), 3000)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.3: Отображение ошибок</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={showInlineError}>Inline ошибка</button>
        <button onClick={showSummary}>Сводка ошибок</button>
        <button onClick={showToast}>Toast-уведомление</button>
      </div>

      {/* Сводка ошибок */}
      {errors.length > 0 && (
        <div role="alert" style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', border: '1px solid #ef5350', marginBottom: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem' }}>Исправьте ошибки:</h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {/* Форма с inline ошибками */}
      <form style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="demo-email">Email</label>
          <input id="demo-email" type="email" aria-invalid={!!fieldErrors.email} aria-describedby={fieldErrors.email ? 'email-error' : undefined} style={{ borderColor: fieldErrors.email ? '#ef5350' : '#ccc' }} />
          {fieldErrors.email && <p id="email-error" role="alert" style={{ color: '#ef5350', fontSize: '0.85rem' }}>{fieldErrors.email}</p>}
        </div>
      </form>
    </div>
  )
}

// ============================================
// Задание 6.4: Доступность ошибок — Решение
// ============================================

export function Task6_4_Solution() {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const firstErrorRef = useRef<HTMLInputElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const data = new FormData(e.target as HTMLFormElement)
    const errors: Record<string, string> = {}

    if (!data.get('a11y-name')) errors['a11y-name'] = 'Имя обязательно'
    if (!data.get('a11y-email')) errors['a11y-email'] = 'Email обязателен'

    setFormErrors(errors)
    setSubmitted(true)

    // Фокус на первое ошибочное поле
    if (errors['a11y-name']) {
      nameRef.current?.focus()
    } else if (errors['a11y-email']) {
      emailRef.current?.focus()
    }
  }

  return (
    <div className="exercise-container">
      <h2>Задание 6.4: Доступность ошибок</h2>

      {submitted && Object.keys(formErrors).length > 0 && (
        <div role="alert" aria-live="assertive" style={{ padding: '1rem', background: '#ffebee', borderRadius: '8px', marginBottom: '1rem' }}>
          <h4>Исправьте {Object.keys(formErrors).length} ошибок:</h4>
          <ul>
            {Object.entries(formErrors).map(([field, msg]) => (
              <li key={field}>
                <a href={`#${field}`} onClick={() => (field === 'a11y-name' ? nameRef : emailRef).current?.focus()}>
                  {msg}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: '400px' }}>
        <div className="form-group">
          <label htmlFor="a11y-name">
            Имя <span aria-hidden="true" style={{ color: 'red' }}>*</span>
            <span className="sr-only">(обязательно)</span>
          </label>
          <input
            ref={nameRef}
            id="a11y-name"
            name="a11y-name"
            aria-required="true"
            aria-invalid={!!formErrors['a11y-name']}
            aria-describedby={formErrors['a11y-name'] ? 'name-err' : undefined}
          />
          {formErrors['a11y-name'] && (
            <p id="name-err" role="alert" style={{ color: '#ef5350', fontSize: '0.85rem' }}>
              {formErrors['a11y-name']}
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="a11y-email">
            Email <span aria-hidden="true" style={{ color: 'red' }}>*</span>
            <span className="sr-only">(обязательно)</span>
          </label>
          <input
            ref={emailRef}
            id="a11y-email"
            name="a11y-email"
            type="email"
            aria-required="true"
            aria-invalid={!!formErrors['a11y-email']}
            aria-describedby={formErrors['a11y-email'] ? 'email-err' : undefined}
          />
          {formErrors['a11y-email'] && (
            <p id="email-err" role="alert" style={{ color: '#ef5350', fontSize: '0.85rem' }}>
              {formErrors['a11y-email']}
            </p>
          )}
        </div>

        <button type="submit">Отправить</button>
      </form>
    </div>
  )
}
