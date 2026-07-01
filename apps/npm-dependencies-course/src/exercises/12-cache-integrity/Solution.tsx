// Level 12: Cache, integrity & .npmrc — reference card

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
    label: 'npm cache (cacache)',
    body: 'Content-addressable хранилище в ~/.npm/_cacache. Tarball-архивы адресованы по SHA-512 хэшу — одинаковые пакеты из разных проектов хранятся один раз. npm cache verify — умная очистка, npm cache clean --force — полная.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'integrity (SRI)',
    body: 'Поле в package-lock.json: sha512-<base64>. При установке npm вычисляет хэш tarball и сравнивает. Несовпадение → EINTEGRITY. Защита от подмены пакета в реестре или повреждения кэша.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'EINTEGRITY — решение',
    body: 'Причины: повреждён кэш, ручное редактирование lockfile, подмена пакета. Решение: npm cache clean --force → rm -rf node_modules package-lock.json → npm install.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Офлайн-режимы',
    body: '--offline: только кэш, ошибка при промахе. --prefer-offline: кэш в приоритете, при промахе — реестр. --prefer-online: всегда реестр (по умолчанию). Для CI без интернета: --offline с прогретым кэшем.',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: 'Приоритет .npmrc',
    body: 'CLI флаги > env npm_config_* > .npmrc проекта > ~/.npmrc пользователя > глобальный > встроенные умолчания. Переменная окружения npm_config_registry переопределит .npmrc проекта.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Ключи .npmrc',
    body: 'save-exact=true — точные версии без ^. engine-strict=true — ошибка при несовместимом Node.js. @scope:registry=URL — реестр для конкретного scope. legacy-peer-deps=true — обход конфликтов peer. //registry/:_authToken=${TOKEN} — авторизация.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task12_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 12: Кэш, integrity и .npmrc</h2>
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
