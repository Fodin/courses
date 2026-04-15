import { useState, useRef } from 'react'
import { useLanguage } from 'src/hooks'

// Список пользователей для переключения
const USERS = [
  { id: 'alice',   name: 'Alice',   role: 'Frontend Engineer' },
  { id: 'bob',     name: 'Bob',     role: 'Backend Engineer' },
  { id: 'charlie', name: 'Charlie', role: 'DevOps' },
]

// V1: Антипаттерн — сброс state через setState при смене пропса
// TODO: Реализовать ProfileEditorV1
// - State: name (string), bio (string)
// - Сброс state при смене userId: когда userId меняется — setName(''), setBio('')
//   (для упрощения можно использовать ref для отслеживания предыдущего userId)
// - Счётчик рендеров через useRef (renderCount.current++)
// - Отображать: название "V1: setState сброс", счётчик рендеров, поля name и bio
function ProfileEditorV1({ userId }: { userId: string }) {
  const renderCount = useRef(0)
  renderCount.current++

  const user = USERS.find(u => u.id === userId)!
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  // TODO: добавить ref для предыдущего userId
  // const prevUserIdRef = useRef(userId)

  // TODO: если prevUserIdRef.current !== userId → сбросить name и bio через setState
  // (это не лучший паттерн, но именно его мы демонстрируем)

  return (
    <div
      style={{
        padding: '16px',
        background: '#1a2233',
        borderRadius: '8px',
        border: '2px solid #7f1d1d',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#fca5a5', fontWeight: 600, fontSize: '13px' }}>
          V1: setState сброс (антипаттерн)
        </span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
          Рендеров: <strong style={{ color: '#f87171' }}>{renderCount.current}</strong>
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        {user.name} ({user.role})
      </div>
      <input
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '8px',
          padding: '6px 10px',
          background: '#0f172a',
          border: '1px solid #374151',
          borderRadius: '4px',
          color: '#e5e7eb',
          fontSize: '13px',
          boxSizing: 'border-box',
        }}
        placeholder="Имя..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        style={{
          display: 'block',
          width: '100%',
          padding: '6px 10px',
          background: '#0f172a',
          border: '1px solid #374151',
          borderRadius: '4px',
          color: '#e5e7eb',
          fontSize: '13px',
          resize: 'vertical',
          minHeight: '60px',
          boxSizing: 'border-box',
        }}
        placeholder="Биография..."
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
    </div>
  )
}

// V2: Правильный паттерн — key для полного пересоздания
// TODO: Реализовать ProfileEditorV2
// - Тот же state: name и bio
// - НЕТ никакого useEffect или логики сброса
// - Счётчик рендеров
// - Компонент сам по себе "чистый" — всю магию делает key в родителе
function ProfileEditorV2({ userId }: { userId: string }) {
  const renderCount = useRef(0)
  renderCount.current++

  const user = USERS.find(u => u.id === userId)!
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')

  return (
    <div
      style={{
        padding: '16px',
        background: '#1a2233',
        borderRadius: '8px',
        border: '2px solid #065f46',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ color: '#6ee7b7', fontWeight: 600, fontSize: '13px' }}>
          V2: key={'{userId}'} (правильный)
        </span>
        <span style={{ color: '#9ca3af', fontSize: '12px' }}>
          Рендеров: <strong style={{ color: '#34d399' }}>{renderCount.current}</strong>
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
        {user.name} ({user.role})
      </div>
      <input
        style={{
          display: 'block',
          width: '100%',
          marginBottom: '8px',
          padding: '6px 10px',
          background: '#0f172a',
          border: '1px solid #374151',
          borderRadius: '4px',
          color: '#e5e7eb',
          fontSize: '13px',
          boxSizing: 'border-box',
        }}
        placeholder="Имя..."
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <textarea
        style={{
          display: 'block',
          width: '100%',
          padding: '6px 10px',
          background: '#0f172a',
          border: '1px solid #374151',
          borderRadius: '4px',
          color: '#e5e7eb',
          fontSize: '13px',
          resize: 'vertical',
          minHeight: '60px',
          boxSizing: 'border-box',
        }}
        placeholder="Биография..."
        value={bio}
        onChange={e => setBio(e.target.value)}
      />
    </div>
  )
}

export function Task3_3() {
  const { t } = useLanguage()

  const [userId, setUserId] = useState('alice')

  // TODO: сделать так, чтобы ProfileEditorV2 пересоздавался при смене userId
  // Подсказка: передай key={userId} компоненту ProfileEditorV2

  return (
    <div className="exercise-container">
      <h2>{t('task.3.3')}</h2>

      {/* Переключатель пользователей */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {USERS.map(user => (
          <button
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{
              padding: '8px 20px',
              borderRadius: '6px',
              border: 'none',
              background: userId === user.id ? '#3b82f6' : '#374151',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: userId === user.id ? 700 : 400,
            }}
          >
            {user.name}
          </button>
        ))}
      </div>

      <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px', lineHeight: 1.6 }}>
        Введи текст в поля, затем переключи пользователя. Наблюдай за счётчиком рендеров.
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* V1 без key — state сбрасывается через setState */}
        <ProfileEditorV1 userId={userId} />

        {/* TODO: добавить key={userId} к ProfileEditorV2 */}
        <ProfileEditorV2 userId={userId} />
      </div>

      <div
        style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#1e3a5f',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#93c5fd',
          lineHeight: 1.7,
        }}
      >
        Задача: добавь key={'{userId}'} к ProfileEditorV2 в JSX выше.
        Реализуй логику сброса в ProfileEditorV1 через ref + setState.
        Сравни количество рендеров при переключении пользователей.
      </div>
    </div>
  )
}
