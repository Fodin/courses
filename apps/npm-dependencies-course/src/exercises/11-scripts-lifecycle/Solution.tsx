// Level 11: npm scripts & lifecycle — reference card

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
    label: 'Pre/post хуки',
    body: 'npm автоматически запускает prebuild → build → postbuild. Если pre-хук завершился с ошибкой — основной скрипт и post-хук не запустятся. Рекурсивных хуков нет (нет preprebuild).',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'prepare vs prepublishOnly',
    body: 'prepare: запускается при npm install + npm publish + npm pack. Идеален для компиляции TypeScript перед публикацией. prepublishOnly: только при publish — используйте для запуска тестов и проверок.',
    bg: '#1e3b2f',
    accent: '#4ade80',
  },
  {
    label: 'postinstall и безопасность',
    body: 'postinstall зависимостей выполняет произвольный код с вашими правами при установке пакета. Вектор supply chain атак (event-stream, node-ipc). Защита: npm install --ignore-scripts.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: '--ignore-scripts',
    body: 'Отключает lifecycle-скрипты всех пакетов при установке. Повышает безопасность в CI. Побочный эффект: нативные модули (bcrypt, sharp) не скомпилируются автоматически.',
    bg: '#2d2416',
    accent: '#fbbf24',
  },
  {
    label: 'Переменные npm_package_*',
    body: 'npm экспортирует поля package.json в окружение скриптов: $npm_package_version, $npm_package_name, $npm_package_config_port. Позволяет избежать хардкода версий и параметров.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'npx vs npm exec',
    body: 'npx: ищет в node_modules/.bin → PATH → скачивает временно. npm exec (v7+): явная альтернатива без неявной загрузки. В скриптах node_modules/.bin автоматически в PATH — полный путь не нужен.',
    bg: '#1a2535',
    accent: '#38bdf8',
  },
]

export function Task11_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 11: npm scripts и lifecycle</h2>
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
