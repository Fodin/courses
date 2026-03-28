import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// ============================================
// Задание 13.1: Submit с loading/error — Решение
// ============================================

const contactSchema = z.object({
  name: z.string().min(1, 'Обязательно'),
  email: z.string().email('Неверный email'),
  message: z.string().min(10, 'Минимум 10 символов'),
})

type ContactForm = z.infer<typeof contactSchema>

export function Task13_1_Solution() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactForm) => {
    setSubmitting(true)
    setError(null)
    try {
      // Имитация API с шансом на ошибку
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.8) {
            reject(new Error('Ошибка сети'))
          } else {
            resolve(data)
          }
        }, 1500)
      })
      setSuccess(true)
      reset()
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка отправки')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="exercise-container">
      <h2>✅ Задание 13.1: Submit с Loading/Error</h2>
      <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: '400px' }}>
        {success && (
          <div
            style={{
              padding: '1rem',
              background: '#d1e7dd',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#0f5132',
            }}
          >
            ✅ Отправлено успешно!
          </div>
        )}

        {error && (
          <div
            style={{
              padding: '1rem',
              background: '#f8d7da',
              borderRadius: '4px',
              marginBottom: '1rem',
              color: '#842029',
            }}
          >
            ❌ {error}
          </div>
        )}

        <div className="form-group">
          <label>Name *</label>
          <input {...register('name')} disabled={submitting} />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input type="email" {...register('email')} disabled={submitting} />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="form-group">
          <label>Message *</label>
          <textarea {...register('message')} rows={4} disabled={submitting} />
          {errors.message && <span className="error">{errors.message.message}</span>}
        </div>

        <button type="submit" disabled={submitting}>
          {submitting ? '⏳ Отправка...' : 'Отправить'}
        </button>
      </form>
    </div>
  )
}

// ============================================
// Задание 13.2: Debounce для автосохранения — Решение
// ============================================

export function Task13_2_Solution() {
  const [saved, setSaved] = useState(false)
  const { register, watch } = useForm<{ content: string }>({
    defaultValues: { content: '' },
  })

  const content = watch('content')

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        console.log('Auto-saved:', content)
        localStorage.setItem('draft-content', content)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [content])

  return (
    <div className="exercise-container">
      <h2>✅ Задание 13.2: Debounce для Автосохранения</h2>
      <form style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label>Контент (автосохранение через 1 сек)</label>
          <textarea
            {...register('content')}
            rows={8}
            style={{ width: '100%' }}
            placeholder="Начните писать..."
          />
        </div>

        {saved && (
          <div style={{ color: '#198754', fontSize: '0.875rem', fontWeight: 500 }}>
            ✓ Сохранено в localStorage
          </div>
        )}

        <p style={{ fontSize: '0.875rem', color: '#6c757d', marginTop: '1rem' }}>
          💡 Откройте консоль разработчика, чтобы увидеть сообщения о сохранении
        </p>
      </form>
    </div>
  )
}
