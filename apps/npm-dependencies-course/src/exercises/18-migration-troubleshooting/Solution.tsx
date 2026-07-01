// Level 18: Migration & Troubleshooting — reference card

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
    label: 'Миграция npm → pnpm',
    body: 'rm -rf node_modules && rm package-lock.json → pnpm import (создаёт pnpm-lock.yaml) → pnpm install → проверить phantom deps → обновить CI на pnpm install --frozen-lockfile.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'ERESOLVE — конфликт peer-deps',
    body: 'Читать сверху вниз: «Found» (что установлено) vs «Could not resolve» (что требует конфликтующий пакет). Варианты: обновить пакеты, понизить конфликтующий, использовать --legacy-peer-deps. Не --force.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'EINTEGRITY — битый кэш',
    body: 'SHA-512 в lockfile не совпадает с файлом. Решение: npm cache clean --force, затем npm install. Не удалять поле integrity вручную из lockfile.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'EBADENGINE — версия Node.js',
    body: 'Пакет требует другую версию Node.js через поле engines. Решение: nvm install <версия> && nvm use <версия>. Зафиксировать в .nvmrc.',
    bg: '#1a3a2a',
    accent: '#4ade80',
  },
  {
    label: 'Дрейф версий — профилактика',
    body: 'Lockfile в git (не в .gitignore), npm ci в CI (не npm install), .nvmrc с версией Node.js, поле engines в package.json. Все четыре меры вместе.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'npm ls / npm explain',
    body: 'npm ls --depth=0 — прямые зависимости. npm ls lodash — кто использует lodash. npm explain lodash — откуда взялась зависимость в дереве (аналог: pnpm why, yarn why).',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task18_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 18: Миграция и устранение неполадок</h2>
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
