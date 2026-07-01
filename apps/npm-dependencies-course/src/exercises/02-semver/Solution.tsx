// Level 2: Semver — reference card
import React from 'react'

const CARD_STYLE: React.CSSProperties = {
  padding: '16px 20px',
  borderRadius: '8px',
  marginBottom: '12px',
  lineHeight: 1.6,
  fontSize: '14px',
  color: '#e5e7eb',
}

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  marginBottom: '6px',
}

const CONCEPTS = [
  {
    label: 'MAJOR.MINOR.PATCH',
    body: 'PATCH: исправление бага, совместимо. MINOR: новые функции, совместимо. MAJOR: breaking changes, несовместимо. Автор обязан следовать этим правилам — это доверительный контракт с пользователями.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: '^ (caret) — главный оператор',
    body: '^1.2.3 → >=1.2.3 <2.0.0 (MINOR+PATCH). ЛОВУШКА: ^0.2.3 → >=0.2.3 <0.3.0 (только PATCH для 0.x). ^0.0.3 → =0.0.3 (точная). Для нестабильных пакетов (0.x) caret консервативнее.',
    bg: '#1e3b2f',
    accent: '#34d399',
  },
  {
    label: '~ (tilde) — только патчи',
    body: '~1.2.3 → >=1.2.3 <1.3.0. Фиксирует MAJOR и MINOR. Консервативнее ^. Используй для критически важных зависимостей или когда даже MINOR может сломать.',
    bg: '#3b1f2b',
    accent: '#f472b6',
  },
  {
    label: 'Pre-release теги',
    body: '1.0.0-alpha, 1.0.0-beta.1, 1.0.0-rc.1. НЕ попадают в обычные диапазоны даже если числово подходят. Установить можно только явно: npm install pkg@1.0.0-beta.1. Порядок: alpha < beta < rc < release.',
    bg: '#2d1f3b',
    accent: '#a78bfa',
  },
  {
    label: 'npm outdated: Current / Wanted / Latest',
    body: 'Current — установлено (из lockfile). Wanted — максимум в рамках вашего диапазона (npm update поставит его). Latest — последняя stable (требует ручного обновления диапазона в package.json).',
    bg: '#3b2a1f',
    accent: '#fb923c',
  },
  {
    label: 'Проверка диапазонов',
    body: 'npx semver 1.5.0 -r "^1.0.0" — проверить версию. npm view pkg versions --json — список версий в реестре. npm view pkg@"^1.0.0" version — что выберет npm. Используй перед спорными диапазонами.',
    bg: '#1f3b3a',
    accent: '#2dd4bf',
  },
  {
    label: 'Поддержка нескольких MAJOR',
    body: '"react": "^17.0.0 || ^18.0.0" — стандартный паттерн для библиотек, совместимых с несколькими поколениями. Каждый диапазон независим. Никогда не используй "*" в продакшне — это разрешает любой MAJOR.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
]

export function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 2: Семантическое версионирование</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Ключевые концепции для запоминания
      </p>
      {CONCEPTS.map(c => (
        <div
          key={c.label}
          style={{ ...CARD_STYLE, background: c.bg, borderLeft: `4px solid ${c.accent}` }}
        >
          <div style={{ ...LABEL_STYLE, color: c.accent }}>{c.label}</div>
          <div>{c.body}</div>
        </div>
      ))}
    </div>
  )
}
