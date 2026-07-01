import { useState, useCallback, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Task 8.1: Diagnose unnecessary renders in a chat app
// Задание 8.1: Диагностика лишних рендеров в чат-приложении
// ============================================
//
// Here's a chat app: MessageList, MessageInput, OnlineUsers.
// Right now, every keystroke re-renders ALL three components.
//
// Перед тобой чат-приложение: MessageList, MessageInput, OnlineUsers.
// Сейчас при вводе каждого символа ре-рендерятся ВСЕ три компонента.
//
// Task:
// 1. Add render counters (useRef + counter in JSX) to all three components
// 2. Verify the problem is real — observe the counters
// 3. Move inputText state into MessageInput (state down)
// 4. Wrap MessageList and OnlineUsers in React.memo
// 5. Stabilize onSend via useCallback in the parent
// 6. Verify that typing only re-renders MessageInput
//
// Задача:
// 1. Добавь render counters (useRef + счётчик в JSX) во все три компонента
// 2. Убедись что проблема реальна — понаблюдай за счётчиками
// 3. Перенеси state inputText в MessageInput (state down)
// 4. Оберни MessageList и OnlineUsers в React.memo
// 5. Стабилизируй onSend через useCallback в родителе
// 6. Убедись что при вводе текста ре-рендерится только MessageInput

interface Message {
  id: string
  author: string
  text: string
  time: string
}

interface OnlineUser {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away'
}

const INITIAL_MESSAGES: Message[] = [
  { id: '1', author: 'Анна', text: 'Привет всем! Как дела?', time: '14:01' },
  { id: '2', author: 'Борис', text: 'Отлично, работаем над проектом!', time: '14:03' },
  { id: '3', author: 'Виктор', text: 'Кто смотрел последний доклад по React 19?', time: '14:05' },
]

const ONLINE_USERS: OnlineUser[] = [
  { id: 'u1', name: 'Анна', avatar: 'А', status: 'online' },
  { id: 'u2', name: 'Борис', avatar: 'Б', status: 'online' },
  { id: 'u3', name: 'Виктор', avatar: 'В', status: 'away' },
]

// TODO: Add render counter (useRef) and display it in UI
// TODO: Добавь render counter (useRef) и отобрази его в UI
// TODO: Wrap in React.memo
// TODO: Оберни в React.memo
function MessageList({ messages }: { messages: Message[] }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {/* TODO: Add render counter badge */}
      {/* TODO: Добавь render counter badge */}
      {messages.map(msg => (
        <div key={msg.id} style={{ padding: '0.5rem', background: '#f5f5f5', borderRadius: '8px' }}>
          <strong>{msg.author}</strong> <span style={{ color: '#999', fontSize: '0.8rem' }}>{msg.time}</span>
          <div style={{ marginTop: '2px' }}>{msg.text}</div>
        </div>
      ))}
    </div>
  )
}

// TODO: Add render counter (useRef) and display it in UI
// TODO: Добавь render counter (useRef) и отобрази его в UI
// TODO: Move inputText and setState INSIDE this component (state down)
// TODO: Перенеси inputText и setState ВНУТРЬ этого компонента (state down)
// TODO: Wrap in React.memo
// TODO: Оберни в React.memo
// TODO: Accept only onSend: (text: string) => void
// TODO: Принимай только onSend: (text: string) => void
function MessageInput({
  inputText,
  onInputChange,
  onSend,
}: {
  inputText: string
  onInputChange: (text: string) => void
  onSend: () => void
}) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ padding: '0.75rem', borderTop: '1px solid #eee' }}>
      {/* TODO: Add render counter badge */}
      {/* TODO: Добавь render counter badge */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          value={inputText}
          onChange={e => onInputChange(e.target.value)}
          placeholder="Введите сообщение..."
          style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}
        />
        <button onClick={onSend} style={{ padding: '0.5rem 1rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
          Отправить
        </button>
      </div>
    </div>
  )
}

// TODO: Add render counter (useRef) and display it in UI
// TODO: Добавь render counter (useRef) и отобрази его в UI
// TODO: Wrap in React.memo
// TODO: Оберни в React.memo
function OnlineUsers({ users }: { users: OnlineUser[] }) {
  // const renderCount = useRef(0)
  // renderCount.current++

  return (
    <div style={{ width: 150, borderLeft: '1px solid #eee', padding: '0.75rem' }}>
      {/* TODO: Add render counter badge */}
      {/* TODO: Добавь render counter badge */}
      <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.5rem' }}>Онлайн</div>
      {users.map(user => (
        <div key={user.id} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem', fontSize: '0.85rem' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: user.status === 'online' ? '#4caf50' : '#ff9800', display: 'inline-block' }} />
          {user.name}
        </div>
      ))}
    </div>
  )
}

export function Task8_1() {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

  // TODO: Remove inputText and handleInputChange from parent — move into MessageInput
  // TODO: Удали inputText и handleInputChange из родителя — перенеси в MessageInput
  const [inputText, setInputText] = useState('')

  // TODO: Wrap in useCallback
  // TODO: Обернуть в useCallback
  const handleSend = () => {
    if (!inputText.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
    setMessages(prev => [...prev, { id: `msg-${Date.now()}`, author: 'Вы', text: inputText.trim(), time }])
    setInputText('')
  }

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 8.1 — Chat: render diagnosis</h2>
      <p style={{ color: '#888', fontStyle: 'italic', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
        Right now all components re-render on typing. Add counters, find the problem, fix it.
      </p>

      <div style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden', height: 400, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0.5rem 0.75rem', background: '#1976d2', color: '#fff', fontWeight: 600 }}>
          React Chat
        </div>
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <MessageList messages={messages} />
          <OnlineUsers users={ONLINE_USERS} />
        </div>
        {/* TODO: pass only onSend after refactoring */}
        {/* TODO: передай только onSend после рефакторинга */}
        <MessageInput
          inputText={inputText}
          onInputChange={setInputText}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

// So TypeScript doesn't complain about unused imports before implementation
// Чтобы TypeScript не ругался на неиспользуемые импорты до реализации
void useState
void useCallback
void useRef
