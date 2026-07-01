// Level 8: Error Resolution — reference card

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
    label: 'ERESOLVE',
    body: 'Конфликт peer-зависимостей. Читать блок сверху вниз: «While resolving» → «Found» (что установлено) → «Could not resolve» (что требует конфликтующий пакет). Возник в npm v7 из-за строгой валидации peerDeps.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'E404 / ETARGET',
    body: 'E404 — пакет не существует в реестре (опечатка, приватный scope без .npmrc). ETARGET — версия не существует. Проверить: npm view <pkg> versions --json',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'EACCES / EPERM',
    body: "Нет прав на запись. НЕ использовать sudo. Решение: npm config set prefix '~/.npm-global' и добавить ~/npm-global/bin в PATH.",
    bg: '#1e2d1e',
    accent: '#4ade80',
  },
  {
    label: 'EINTEGRITY',
    body: 'SHA-512 скачанного архива не совпадает с lockfile. Решение: npm cache clean --force, затем повторить установку.',
    bg: '#1e293b',
    accent: '#60a5fa',
  },
  {
    label: 'ELIFECYCLE',
    body: 'Lifecycle-скрипт пакета (preinstall/install/postinstall) завершился с ошибкой. Запустить с --loglevel verbose для полного вывода.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: '--legacy-peer-deps vs --force',
    body: '--legacy-peer-deps: игнорирует peer-конфликты (как npm v6), безопасен если фактически совместимо. --force: обходит всё, опасен, может создать несовместимое дерево и runtime-ошибки.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task8_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 8: Разрешение ошибок установки</h2>
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
