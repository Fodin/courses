// Level 15: pnpm — reference card

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
    label: 'Content-addressable store',
    body: 'Глобальное хранилище (~/.local/share/pnpm/store) идентифицирует файлы по хешу содержимого. Каждый уникальный файл хранится один раз для всех проектов на машине.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Hard links — экономия диска',
    body: 'Вместо копирования файлов pnpm создаёт hard links из глобального store в node_modules. 10 проектов с одинаковой версией React занимают столько же места, сколько один.',
    bg: '#1a3a2a',
    accent: '#4ade80',
  },
  {
    label: 'Структура node_modules',
    body: 'В корне node_modules — симлинки только на ПРЯМЫЕ зависимости проекта. Транзитивные зависимости спрятаны в node_modules/.pnpm/ и не видны из корневого кода.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Нет фантомных зависимостей',
    body: 'Phantom dependency — импорт пакета, не указанного в package.json. npm допускает это через подъём зависимостей. pnpm блокирует: require("debug") падает с MODULE_NOT_FOUND, если debug не в package.json.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'pnpm-lock.yaml',
    body: 'Файл блокировки pnpm. Содержит specifier (диапазон из package.json), разрешённую версию и SHA-512 хеш каждого пакета. Для CI: pnpm install --frozen-lockfile.',
    bg: '#1e293b',
    accent: '#a78bfa',
  },
  {
    label: 'pnpm.overrides',
    body: 'Принудительная замена версии транзитивной зависимости. Синтаксис "express>debug" заменяет debug только в зависимостях express. Аналог npm overrides, но с более точным синтаксисом.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task15_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 15: pnpm — устройство и отличия</h2>
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
