// Level 16: Yarn Classic, Berry, PnP — reference card

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
    label: 'Yarn Classic (v1)',
    body: 'Плоский node_modules (как npm), параллельные загрузки, yarn.lock. Поле resolutions для форсирования версий транзитивных зависимостей. Допускает фантомные зависимости.',
    bg: '#1e2d1e',
    accent: '#4ade80',
  },
  {
    label: "Plug'n'Play (PnP)",
    body: 'Нет node_modules. .pnp.cjs патчит require() и перенаправляет резолюцию к .yarn/cache/ (zip-архивы пакетов). Строгая изоляция: фантомные зависимости невозможны.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Zero-installs',
    body: '.yarn/cache/ (zip-архивы) коммитится в git. После git clone — мгновенный старт без yarn install и без интернет-соединения. Увеличивает размер репозитория.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'nodeLinker: node-modules',
    body: 'Опция в .yarnrc.yml для возврата к классическому node_modules в Yarn Berry. Нужна для совместимости с инструментами, не поддерживающими PnP.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'resolutions (Yarn)',
    body: 'Принудительная замена версии транзитивной зависимости. Синтаксис: **/@types/react заменяет везде в дереве. Аналог npm overrides и pnpm.overrides.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'yarn dlx',
    body: 'Скачивает пакет во временную среду, запускает и удаляет. Аналог npx (npm) и pnpm dlx. Пример: yarn dlx create-react-app my-app.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task16_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 16: Yarn — Classic, Berry, PnP</h2>
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
