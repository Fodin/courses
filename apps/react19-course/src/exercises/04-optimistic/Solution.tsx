import { useState, useOptimistic, useTransition } from 'react'

// ============================================
// Задание 4.1: Базовый useOptimistic — Решение
// ============================================

async function simulateServerDelay(ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function apiToggleLike(currentlyLiked: boolean): Promise<boolean> {
  await simulateServerDelay(1500)
  return !currentlyLiked
}

export function Task4_1_Solution() {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(42)
  const [optimisticLiked, setOptimisticLiked] = useOptimistic(liked)
  const [optimisticCount, setOptimisticCount] = useOptimistic(likeCount)
  const [isPending, startTransition] = useTransition()

  function handleToggleLike() {
    startTransition(async () => {
      setOptimisticLiked(!liked)
      setOptimisticCount(liked ? likeCount - 1 : likeCount + 1)

      const newLiked = await apiToggleLike(liked)
      setLiked(newLiked)
      setLikeCount(prev => (newLiked ? prev + 1 : prev - 1))
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.1: Базовый useOptimistic</h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '2rem',
          background: '#f5f5f5',
          borderRadius: '12px',
          maxWidth: '400px',
        }}
      >
        <button
          onClick={handleToggleLike}
          disabled={isPending}
          style={{
            fontSize: '2rem',
            background: 'none',
            border: 'none',
            cursor: isPending ? 'wait' : 'pointer',
            transform: optimisticLiked ? 'scale(1.2)' : 'scale(1)',
            transition: 'transform 0.2s',
          }}
        >
          {optimisticLiked ? '\u2764\ufe0f' : '\ud83e\ude76'}
        </button>

        <div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            {optimisticCount}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#888' }}>
            {isPending ? '(Сохранение...)' : (optimisticLiked ? 'Вам нравится' : 'Нажмите, чтобы лайкнуть')}
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 4.2: Оптимистичный список — Решение
// ============================================

interface TodoItem {
  id: string
  text: string
  sending?: boolean
}

async function apiAddTodo(text: string): Promise<TodoItem> {
  await simulateServerDelay(2000)
  return { id: crypto.randomUUID(), text }
}

export function Task4_2_Solution() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: '1', text: 'Изучить React 19' },
    { id: '2', text: 'Попробовать useOptimistic' },
  ])

  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state: TodoItem[], newTodo: TodoItem) => [...state, { ...newTodo, sending: true }]
  )

  const [isPending, startTransition] = useTransition()

  function handleAddTodo(formData: FormData) {
    const text = formData.get('todo') as string
    if (!text.trim()) return

    const tempId = 'temp-' + Date.now()

    startTransition(async () => {
      addOptimisticTodo({ id: tempId, text })
      const savedTodo = await apiAddTodo(text)
      setTodos(prev => [...prev, savedTodo])
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.2: Оптимистичный список</h2>

      <form action={handleAddTodo} style={{ maxWidth: '500px', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            name="todo"
            type="text"
            placeholder="Новая задача..."
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={isPending}>
            Добавить
          </button>
        </div>
      </form>

      <ul style={{ listStyle: 'none', padding: 0, maxWidth: '500px' }}>
        {optimisticTodos.map(todo => (
          <li
            key={todo.id}
            style={{
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              background: todo.sending ? '#fff3e0' : '#f5f5f5',
              borderRadius: '8px',
              opacity: todo.sending ? 0.7 : 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>{todo.text}</span>
            {todo.sending && (
              <span style={{ fontSize: '0.8rem', color: '#f57c00' }}>
                Сохранение...
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// Задание 4.3: Откат при ошибке — Решение
// ============================================

interface Message {
  id: string
  text: string
  status: 'sent' | 'sending' | 'failed'
}

async function apiSendMessage(text: string): Promise<Message> {
  await simulateServerDelay(1500)

  // Имитация ошибки для сообщений содержащих "error"
  if (text.toLowerCase().includes('error')) {
    throw new Error('Сервер недоступен')
  }

  return { id: crypto.randomUUID(), text, status: 'sent' }
}

export function Task4_3_Solution() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Привет! Это первое сообщение.', status: 'sent' },
  ])
  const [error, setError] = useState<string | null>(null)

  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (state: Message[], newMsg: Message) => [...state, newMsg]
  )

  const [isPending, startTransition] = useTransition()

  function handleSend(formData: FormData) {
    const text = formData.get('message') as string
    if (!text.trim()) return

    setError(null)
    const tempId = 'temp-' + Date.now()

    startTransition(async () => {
      addOptimisticMessage({ id: tempId, text, status: 'sending' })

      try {
        const savedMessage = await apiSendMessage(text)
        setMessages(prev => [...prev, savedMessage])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка отправки')
        // Не обновляем реальное состояние — оптимистичное обновление автоматически откатится
      }
    })
  }

  return (
    <div className="exercise-container">
      <h2>Задание 4.3: Откат при ошибке</h2>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        Попробуйте отправить сообщение со словом &quot;error&quot; для имитации ошибки сервера.
      </p>

      <div
        style={{
          maxWidth: '500px',
          border: '1px solid #ddd',
          borderRadius: '12px',
          overflow: 'hidden',
        }}
      >
        {/* Список сообщений */}
        <div style={{ padding: '1rem', minHeight: '200px', background: '#fafafa' }}>
          {optimisticMessages.map(msg => (
            <div
              key={msg.id}
              style={{
                padding: '0.5rem 1rem',
                marginBottom: '0.5rem',
                background: msg.status === 'sending' ? '#e3f2fd' : '#e8f5e9',
                borderRadius: '8px',
                opacity: msg.status === 'sending' ? 0.6 : 1,
              }}
            >
              <span>{msg.text}</span>
              {msg.status === 'sending' && (
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem', color: '#1565c0' }}>
                  (отправка...)
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Форма отправки */}
        <form
          action={handleSend}
          style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem',
            borderTop: '1px solid #ddd',
          }}
        >
          <input
            name="message"
            type="text"
            placeholder="Введите сообщение..."
            required
            style={{ flex: 1 }}
          />
          <button type="submit" disabled={isPending}>
            {isPending ? '...' : 'Отправить'}
          </button>
        </form>
      </div>

      {error && (
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1rem',
            background: '#ffebee',
            borderRadius: '8px',
            color: '#c62828',
            maxWidth: '500px',
          }}
        >
          Ошибка: {error} (сообщение откачено)
        </div>
      )}
    </div>
  )
}
