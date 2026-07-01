// Level 10: npm audit & Security — reference card

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
    label: 'npm audit',
    body: 'Читает package-lock.json, сверяет с npm Advisory Database. Выдаёт отчёт по уязвимостям с severity и путём в дереве. Не требует повторной загрузки пакетов.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Уровни severity',
    body: 'critical — RCE, полный захват системы. high — утечка данных, DoS. moderate — умеренный риск. low — теоретическая уязвимость. Приоритет: critical и high первыми.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'npm audit fix vs --force',
    body: 'audit fix: безопасно, только в рамках semver-диапазонов. audit fix --force: обходит semver, может сделать даунгрейд или breaking-обновление. После --force — обязательное тестирование.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Транзитивная уязвимость через overrides',
    body: 'Лучший путь когда audit fix не справляется: добавить overrides в package.json с безопасной версией, npm install, проверить npm audit. Безопаснее --force.',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: '--omit=dev и --audit-level',
    body: '--omit=dev: исключить devDependencies из анализа (не попадают в production). --audit-level=high: CI завершается с ошибкой только при high/critical. --json: машиночитаемый вывод для CI.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'npm audit signatures',
    body: 'Проверяет криптографические подписи пакетов (npm v8.5+). Защита от supply chain атак — подмены пакетов в реестре. Дополняет audit CVE-базы.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task10_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 10: Безопасность и npm audit</h2>
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
