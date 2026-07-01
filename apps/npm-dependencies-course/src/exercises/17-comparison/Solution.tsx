// Level 17: npm vs pnpm vs Yarn — comparison reference card

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
    label: 'Phantom dependencies',
    body: 'npm и Yarn Classic — допускают (плоский node_modules). pnpm и Yarn Berry PnP — блокируют. require() на незадекларированный пакет работает в npm и падает в pnpm.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'Дисковое пространство',
    body: 'npm / Yarn Classic: копии в каждый node_modules. pnpm: hard links из глобального store — один экземпляр для всех проектов. Yarn Berry PnP: zip-архивы в .yarn/cache/.',
    bg: '#1a3a2a',
    accent: '#4ade80',
  },
  {
    label: 'Lockfiles',
    body: 'npm → package-lock.json (JSON). pnpm → pnpm-lock.yaml (YAML). Yarn → yarn.lock (собственный формат). Нельзя смешивать несколько lockfile в одном проекте.',
    bg: '#1e293b',
    accent: '#60a5fa',
  },
  {
    label: 'Форсирование версий',
    body: 'npm: "overrides" в package.json. pnpm: "pnpm.overrides" (поддерживает "express>debug"). Yarn: "resolutions" (поддерживает "**/lodash"). Задача одна — синтаксис разный.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'CI-установка (строго из lockfile)',
    body: 'npm: npm ci. pnpm: pnpm install --frozen-lockfile. Yarn Berry: yarn install --immutable. Yarn Classic: yarn install --frozen-lockfile.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Когда что выбирать',
    body: 'npm — легаси, максимальная совместимость. pnpm — монорепо, экономия диска, много проектов. Yarn Berry — zero-installs в CI, полный контроль зависимостей.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task17_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 17: npm vs pnpm vs Yarn — сравнение</h2>
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
