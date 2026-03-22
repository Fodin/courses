import { useState, useActionState } from 'react'
import { useFormStatus } from 'react-dom'

// ============================================
// Задание 3.1: form action — Решение
// ============================================

async function simulateServerDelay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function Task3_1_Solution() {
  const [result, setResult] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const message = formData.get('message') as string

    await simulateServerDelay(1000)

    setResult(`Получено: ${name} (${email}) — "${message}"`)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.1: form action</h2>

      <form action={handleSubmit} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>

        <div className="form-group">
          <label htmlFor="message">Сообщение</label>
          <textarea id="message" name="message" rows={3} required style={{ width: '100%' }} />
        </div>

        <button type="submit">Отправить</button>
      </form>

      {result && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          <strong>Результат:</strong> {result}
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 3.2: useActionState — Решение
// ============================================

interface FormState {
  error: string | null
  success: boolean
  data: { username: string; email: string } | null
}

const initialFormState: FormState = {
  error: null,
  success: false,
  data: null,
}

async function submitAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const username = formData.get('username') as string
  const email = formData.get('email') as string

  await simulateServerDelay(1000)

  if (!username || username.length < 3) {
    return { error: 'Имя пользователя должно быть не менее 3 символов', success: false, data: null }
  }

  if (!email || !email.includes('@')) {
    return { error: 'Введите корректный email', success: false, data: null }
  }

  return {
    error: null,
    success: true,
    data: { username, email },
  }
}

export function Task3_2_Solution() {
  const [state, formAction, isPending] = useActionState(submitAction, initialFormState)

  return (
    <div className="exercise-container">
      <h2>Задание 3.2: useActionState</h2>

      <form action={formAction} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label htmlFor="username">Имя пользователя (мин. 3 символа)</label>
          <input id="username" name="username" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required />
        </div>

        <button type="submit" disabled={isPending}>
          {isPending ? 'Отправка...' : 'Зарегистрироваться'}
        </button>
      </form>

      {state.error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            color: '#c62828',
          }}
        >
          {state.error}
        </div>
      )}

      {state.success && state.data && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            color: '#2e7d32',
          }}
        >
          Пользователь <strong>{state.data.username}</strong> ({state.data.email}) зарегистрирован!
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 3.3: useFormStatus — Решение
// ============================================

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        opacity: pending ? 0.7 : 1,
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Отправка...' : 'Отправить отзыв'}
    </button>
  )
}

function FormStatusInfo() {
  const { pending, data, method } = useFormStatus()

  if (!pending) return null

  return (
    <div
      style={{
        marginTop: '1rem',
        padding: '0.75rem',
        background: '#fff3e0',
        borderRadius: '8px',
        fontSize: '0.9rem',
      }}
    >
      <strong>Отправка формы...</strong>
      <br />
      Метод: {method || 'N/A'}
      <br />
      Данные: {data ? (data.get('review') as string)?.slice(0, 30) + '...' : 'N/A'}
    </div>
  )
}

export function Task3_3_Solution() {
  const [submitted, setSubmitted] = useState(false)

  async function handleReview(formData: FormData) {
    const review = formData.get('review') as string
    const rating = formData.get('rating') as string

    await simulateServerDelay(2000)

    console.log('Review submitted:', { review, rating })
    setSubmitted(true)
  }

  return (
    <div className="exercise-container">
      <h2>Задание 3.3: useFormStatus</h2>

      <form action={handleReview} style={{ maxWidth: '500px' }}>
        <div className="form-group">
          <label htmlFor="rating">Оценка</label>
          <select id="rating" name="rating" required>
            <option value="">Выберите оценку</option>
            <option value="5">5 — Отлично</option>
            <option value="4">4 — Хорошо</option>
            <option value="3">3 — Нормально</option>
            <option value="2">2 — Плохо</option>
            <option value="1">1 — Ужасно</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="review">Отзыв</label>
          <textarea
            id="review"
            name="review"
            rows={4}
            required
            style={{ width: '100%' }}
            placeholder="Напишите ваш отзыв..."
          />
        </div>

        <SubmitButton />
        <FormStatusInfo />
      </form>

      {submitted && (
        <div
          style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
          }}
        >
          Спасибо за отзыв!
        </div>
      )}
    </div>
  )
}

// ============================================
// Задание 3.4: Прогрессивное улучшение — Решение
// ============================================

interface NewsletterState {
  error: string | null
  success: boolean
  email: string | null
}

const initialNewsletterState: NewsletterState = {
  error: null,
  success: false,
  email: null,
}

async function subscribeAction(
  prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const source = formData.get('source') as string

  await simulateServerDelay(1500)

  if (!email || !email.includes('@')) {
    return { error: 'Введите корректный email', success: false, email: null }
  }

  console.log('Newsletter subscription:', { email, name, source })

  return {
    error: null,
    success: true,
    email,
  }
}

function SubscribeButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Подписка...' : 'Подписаться'}
    </button>
  )
}

export function Task3_4_Solution() {
  const [state, formAction, isPending] = useActionState(subscribeAction, initialNewsletterState)

  return (
    <div className="exercise-container">
      <h2>Задание 3.4: Прогрессивное улучшение</h2>
      <p style={{ color: '#666', marginBottom: '1rem' }}>
        Эта форма работает и без JavaScript благодаря нативным HTML-атрибутам.
      </p>

      <form action={formAction} method="post" style={{ maxWidth: '500px' }}>
        {/* Hidden input для дополнительных данных */}
        <input type="hidden" name="source" value="website-footer" />

        <div className="form-group">
          <label htmlFor="name">Имя</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Ваше имя"
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            autoComplete="email"
          />
        </div>

        <SubscribeButton />
      </form>

      {state.error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '8px',
            color: '#c62828',
          }}
        >
          {state.error}
        </div>
      )}

      {state.success && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#e8f5e9',
            borderRadius: '8px',
            color: '#2e7d32',
          }}
        >
          <strong>{state.email}</strong> подписан на рассылку!
        </div>
      )}

      {isPending && (
        <div style={{ marginTop: '0.5rem', color: '#666', fontStyle: 'italic' }}>
          Обработка подписки...
        </div>
      )}
    </div>
  )
}
