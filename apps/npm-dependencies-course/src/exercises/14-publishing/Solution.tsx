// Level 14: Publishing packages — reference card

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
    label: 'npm publish и scopes',
    body: 'Unscoped-пакеты публичны по умолчанию. Scoped (@scope/name) — restricted по умолчанию. Для публичного scoped-пакета обязательно: npm publish --access public. Иначе 402 Payment Required.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'npm version',
    body: 'npm version patch|minor|major: обновляет package.json + git commit + git tag. 2.3.1 → minor → 2.4.0. Pre-release: npm version prerelease --preid=beta. Без git: --no-git-tag-version.',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: 'dist-tags',
    body: 'latest — используется при npm install по умолчанию. Pre-release всегда публиковать с --tag: npm publish --tag next. Иначе latest переключится на RC и все получат нестабильную версию.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'files vs .npmignore',
    body: 'files — белый список (предпочтительно): "files": ["dist"]. .npmignore — чёрный список (опасно — легко что-то упустить). Всегда включаются: package.json, README*, LICENSE*. Всегда исключается: node_modules.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'npm pack --dry-run',
    body: 'Показывает список файлов, которые попадут в пакет, без создания .tgz. Запускайте перед каждым publish: убедитесь что dist/ есть, src/ нет, секреты не включены.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
  {
    label: 'deprecate vs unpublish',
    body: 'deprecate: пакет остаётся, показывает предупреждение при установке. Предпочтительно. unpublish: физическое удаление, только 72 часа после публикации. Причина ограничения: инцидент left-pad 2016.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
]

export function Task14_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 14: Публикация пакетов</h2>
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
