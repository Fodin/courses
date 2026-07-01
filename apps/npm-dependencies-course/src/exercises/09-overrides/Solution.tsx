// Level 9: overrides — reference card

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

const CODE_STYLE: React.CSSProperties = {
  fontFamily: 'monospace',
  background: 'rgba(0,0,0,0.3)',
  borderRadius: '4px',
  padding: '8px 12px',
  display: 'block',
  marginTop: '8px',
  fontSize: '12px',
  whiteSpace: 'pre',
  overflowX: 'auto',
}

const CONCEPTS = [
  {
    label: 'Простая замена (глобально)',
    body: 'Заменяет пакет во всём дереве зависимостей.',
    code: '{\n  "overrides": {\n    "nth-check": "^2.0.1"\n  }\n}',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Вложенный (scoped) override',
    body: 'Заменяет bar@1.5.0 только в контексте зависимостей foo.',
    code: '{\n  "overrides": {\n    "foo": {\n      "bar": "1.5.0"\n    }\n  }\n}',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: 'Ключ "." — замена самого пакета',
    body: 'Принудительно заменяет foo на версию 2.0.0.',
    code: '{\n  "overrides": {\n    "foo": {\n      ".": "2.0.0"\n    }\n  }\n}',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Ссылка $name — из dependencies',
    body: 'Все вхождения react в дереве получат ту же версию, что в dependencies.',
    code: '{\n  "dependencies": { "react": "^18.2.0" },\n  "overrides": { "react": "$react" }\n}',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Ограничения overrides',
    body: 'Работает только из корневого package.json. В опубликованных зависимостях — игнорируется. Доступно с npm v8.3+.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'Аналоги в других менеджерах',
    body: 'yarn v1: "resolutions" с glob-путями (**/pkg). pnpm: "pnpm": { "overrides": {...} }. Семантика одинакова, синтаксис путей отличается.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task9_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 9: overrides</h2>
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
          {'code' in c && c.code && <code style={CODE_STYLE}>{c.code}</code>}
        </div>
      ))}
    </div>
  )
}
