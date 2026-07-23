import { useState } from 'react'

// ============================================
// Задание 10.1: Сегменты слайса — интерактивная карточка
// ============================================

interface Segment {
  id: string
  title: string
  what: string
  putHere: string[]
  notHere: string[]
  example: string
}

const SEGMENTS: Segment[] = [
  {
    id: 'ui',
    title: 'ui',
    what: 'Визуальные компоненты слайса. Рендерят DOM, ничего не знают про HTTP.',
    putHere: ['UserCard.tsx', 'UserAvatar.tsx', 'локальные CSS-модули'],
    notHere: ['fetch-запросы', 'бизнес-правила и валидация', 'прямая работа со стором минуя model'],
    example: 'export function UserCard({ user }: { user: User }) { ... }',
  },
  {
    id: 'model',
    title: 'model',
    what: 'Бизнес-логика: типы, стор (состояние), схемы валидации, селекторы.',
    putHere: [
      'types.ts (interface User)',
      'store.ts (Zustand/Redux slice)',
      'селекторы, схемы валидации',
    ],
    notHere: ['JSX-компоненты', 'HTTP-клиент и запросы'],
    example: 'export interface User { id: string; name: string }',
  },
  {
    id: 'api',
    title: 'api',
    what: 'Запросы к бэкенду и маппинг DTO → модель домена.',
    putHere: ['getUser.ts, updateUser.ts', 'user.dto.ts + функция toUser(dto)'],
    notHere: [
      'UI-компоненты',
      'стор и бизнес-состояние',
      'сырой DTO, утекающий наружу без маппинга',
    ],
    example: 'export async function getUser(id: string): Promise<User> { ... }',
  },
  {
    id: 'lib',
    title: 'lib',
    what: 'Вспомогательные утилиты, специфичные именно для этого слайса.',
    putHere: ['formatUserName.ts', 'локальные хуки слайса'],
    notHere: ['код, нужный другим слайсам (это уже shared/lib)', 'бизнес-состояние'],
    example: 'export function formatUserName(user: User): string { ... }',
  },
  {
    id: 'config',
    title: 'config',
    what: 'Константы и конфигурация, имеющие смысл только внутри слайса.',
    putHere: ['MAX_USERNAME_LENGTH', 'DEFAULT_AVATAR_URL'],
    notHere: ['секреты', 'общесистемные настройки приложения'],
    example: 'export const MAX_USERNAME_LENGTH = 32',
  },
]

export function Task10_1_Solution() {
  const [active, setActive] = useState<string>('model')
  const segment = SEGMENTS.find(s => s.id === active)!

  return (
    <div className="exercise-container">
      <h2>Сегменты слайса entities/user</h2>
      <p style={{ color: 'var(--clr-text-muted)' }}>
        Кликните по сегменту, чтобы увидеть, что в него кладут, а что — нет. Все сегменты — часть
        одного слайса <code>entities/user</code>, слой и предметная область у них общие, различается
        только техническое назначение.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: 560 }}>
        {SEGMENTS.map(s => (
          <button
            key={s.id}
            onClick={() => setActive(s.id)}
            style={{
              textAlign: 'left',
              padding: '10px 14px',
              borderRadius: 6,
              border: '1px solid var(--clr-border)',
              cursor: 'pointer',
              fontWeight: s.id === active ? 700 : 500,
              background: s.id === active ? 'rgba(59,130,246,0.15)' : 'var(--clr-bg-secondary)',
              color: 'var(--clr-text)',
            }}
          >
            entities/user/{s.title}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 16,
          borderRadius: 8,
          border: '1px solid var(--clr-border)',
          background: 'var(--clr-bg-secondary)',
          maxWidth: 560,
        }}
      >
        <h3 style={{ marginTop: 0 }}>{segment.title}</h3>
        <p>{segment.what}</p>

        <p style={{ fontSize: 14, marginBottom: 4 }}>
          <strong>✅ Кладём сюда:</strong>
        </p>
        <ul style={{ fontSize: 14, marginTop: 0 }}>
          {segment.putHere.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p style={{ fontSize: 14, marginBottom: 4 }}>
          <strong>❌ Сюда не кладём:</strong>
        </p>
        <ul style={{ fontSize: 14, marginTop: 0 }}>
          {segment.notHere.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p style={{ fontSize: 13, color: 'var(--clr-text-muted)' }}>
          <strong>Пример:</strong> <code>{segment.example}</code>
        </p>
      </div>

      <p style={{ marginTop: 16, fontSize: 14 }}>
        📌 Не все сегменты обязательны сразу. Маленький слайс может обойтись без <code>api</code>{' '}
        или без <code>lib</code>/<code>config</code> — заводите сегмент, когда появляется первый
        файл этого рода.
      </p>
    </div>
  )
}
