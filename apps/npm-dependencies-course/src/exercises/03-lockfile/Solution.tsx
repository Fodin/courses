// Level 3: package-lock.json — reference card
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
    label: 'Зачем lockfile',
    body: 'package.json содержит диапазоны (^1.2.3) — они могут разрешиться в разные версии. package-lock.json фиксирует точные версии всего дерева (включая транзитивные), URL tarball и SHA-512 хеш. Это гарантирует одинаковые установки везде.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'lockfileVersion: 1, 2, 3',
    body: 'v1 (npm v5–v6): только секция dependencies. v2 (npm v7–v8): packages + dependencies (обратная совместимость). v3 (npm v9+): только packages. Актуальный — v3. npm v9+ читает все три формата.',
    bg: '#1e3b2f',
    accent: '#34d399',
  },
  {
    label: 'integrity — защита от подмены',
    body: 'SHA-512 хеш tarball-архива. npm проверяет при каждой установке. Если tarball подменён в реестре — установка прерывается с ошибкой. Это ключевая защита от supply chain атак.',
    bg: '#3b1f2b',
    accent: '#f472b6',
  },
  {
    label: 'npm install vs npm ci',
    body: 'install: создаёт/обновляет lockfile, инкрементальный. ci: требует lockfile, удаляет node_modules, никогда не изменяет lock, падает при рассинхроне. Правило: в CI всегда npm ci.',
    bg: '#2d1f3b',
    accent: '#a78bfa',
  },
  {
    label: 'Рассинхрон lockfile',
    body: 'Если package.json изменён без npm install — lockfile устарел. npm ci обнаружит это и выдаст ошибку: "can only install packages when in sync". Решение: npm install локально + коммит обновлённого lockfile.',
    bg: '#3b2a1f',
    accent: '#fb923c',
  },
  {
    label: 'Когда коммитить lockfile',
    body: 'Приложения: всегда коммитить. Публикуемые библиотеки: обычно не коммитить (npm игнорирует lockfile вложенных пакетов). npm-shrinkwrap.json — исключение для CLI-пакетов, включается в tarball.',
    bg: '#1f3b3a',
    accent: '#2dd4bf',
  },
]

export function Task3_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 3: package-lock.json</h2>
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
