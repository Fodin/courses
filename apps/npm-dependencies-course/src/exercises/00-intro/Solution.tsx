// Level 0: Introduction — package managers reference card
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
    label: 'npm registry',
    body: 'registry.npmjs.org — HTTP-сервис с JSON-API. Хранит метаданные всех пакетов (версии, зависимости) и tarball-архивы. npm CLI обращается к нему при каждой установке. Можно заменить корпоративным реестром через npm config set registry.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Что такое пакет',
    body: 'Пакет = директория с package.json, упакованная в .tgz. package.json содержит name, version, main/exports, dependencies. npm publish загружает tarball в реестр. npm install скачивает и распаковывает его в node_modules.',
    bg: '#1e3b2f',
    accent: '#34d399',
  },
  {
    label: 'Локальная vs глобальная установка',
    body: 'Локальная (npm install pkg) → ./node_modules, версия фиксируется в package.json. Глобальная (npm install -g pkg) → системный каталог, пакет доступен как команда в терминале. Современная альтернатива глобальной: npx или devDependencies + scripts.',
    bg: '#3b1f2b',
    accent: '#f472b6',
  },
  {
    label: 'Транзитивные зависимости',
    body: 'Зависимости зависимостей. Если ваш проект зависит от A, а A зависит от B и C — B и C транзитивные. npm устанавливает весь граф автоматически. npm ls --all показывает полное дерево.',
    bg: '#2d1f3b',
    accent: '#a78bfa',
  },
  {
    label: 'npm CLI vs npm registry',
    body: 'npm CLI — локальная утилита (npm --version → 10.x). npm registry — облачный сервис (registry.npmjs.org). CLI можно использовать с другим реестром. Реестром можно пользоваться через другой CLI (pnpm, yarn).',
    bg: '#3b2a1f',
    accent: '#fb923c',
  },
  {
    label: 'Экосистема: npm, pnpm, yarn',
    body: "Все три работают с тем же npm-реестром. npm — стандарт, поставляется с Node.js. pnpm — hardlinks + строгая изоляция, экономит место. yarn — альтернативный CLI, режим Plug'n'Play. Lockfile-форматы разные: package-lock.json / pnpm-lock.yaml / yarn.lock.",
    bg: '#1f3b3a',
    accent: '#2dd4bf',
  },
]

export function Task0_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 0: Введение — менеджеры пакетов</h2>
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
