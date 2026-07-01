// Level 13: Workspaces & monorepo — reference card

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
    label: 'Поле workspaces',
    body: 'В корневом package.json: "workspaces": ["packages/*", "apps/web"]. Поддерживаются глобы и конкретные пути. Всегда добавляйте "private": true в корень, чтобы случайно не опубликовать монорепо.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Симлинки и hoisting',
    body: 'npm install из корня: общие зависимости → корневой node_modules (hoisting). Локальные пакеты → симлинки node_modules/@scope/pkg → ../../packages/pkg. Изменения в исходниках видны мгновенно.',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: 'Флаги -w и --workspaces',
    body: 'npm install lodash -w @acme/ui — установить в конкретный воркспейс. npm run test --workspaces — во все. npm run build --workspaces --if-present — пропустить воркспейсы без скрипта build.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Единый lockfile',
    body: 'Один package-lock.json в корне для всего монорепо. npm ci из корня устанавливает всё атомарно. npm audit проверяет безопасность всех воркспейсов одной командой.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
  {
    label: 'Межпакетные зависимости',
    body: '"@acme/ui": "*" в dependencies — npm найдёт локальный воркспейс и создаст симлинк вместо скачивания из реестра. * означает «любая версия / локальная». workspace:* — явный синтаксис (npm v9+).',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Фантомные зависимости',
    body: 'Пакет доступен через hoisting из корня, но не указан в dependencies воркспейса. Сейчас работает — сломается при удалении из другого воркспейса. При публикации — broken package для пользователей. Решение: явно добавить в зависимости.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
]

export function Task13_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 13: Workspaces и монорепо</h2>
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
