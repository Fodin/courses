// Level 1: Dependency types — reference card
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
    label: 'dependencies',
    body: 'Runtime-зависимости: нужны в продакшне. Устанавливаются всегда. npm install pkg → добавляется сюда по умолчанию. Пример: express, react, axios, lodash.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'devDependencies',
    body: 'Только для разработки: тесты, линтеры, сборщики, TypeScript. npm install -D pkg. Пропускаются при npm install --omit=dev. Не устанавливаются пользователям вашей библиотеки.',
    bg: '#1e3b2f',
    accent: '#34d399',
  },
  {
    label: 'peerDependencies',
    body: 'Для плагинов/расширений: пакет объявляет, что хост должен предоставить эту зависимость. npm v7+ устанавливает автоматически. Конфликт версий → ERESOLVE. Решение: --legacy-peer-deps (рискованно) или обновить пакет.',
    bg: '#3b1f2b',
    accent: '#f472b6',
  },
  {
    label: 'optionalDependencies',
    body: 'Необязательные зависимости: установка не прерывается при ошибке. npm install --save-optional pkg. Код должен проверять наличие через try/catch. Пример: fsevents (только macOS).',
    bg: '#2d1f3b',
    accent: '#a78bfa',
  },
  {
    label: 'bundledDependencies',
    body: 'Массив имён пакетов, включаемых в tarball при npm publish. Редкий случай: офлайн-распространение или закрытый реестр. Имена должны быть в dependencies или devDependencies.',
    bg: '#3b2a1f',
    accent: '#fb923c',
  },
  {
    label: 'engines',
    body: 'Не зависимость, но совместимость: { "node": ">=18.0.0" }. npm проверяет при установке и выдаёт предупреждение (не ошибку). Флаг --engine-strict или engine-strict=true в .npmrc превращает в ошибку.',
    bg: '#1f3b3a',
    accent: '#2dd4bf',
  },
  {
    label: 'ERESOLVE: как решать',
    body: '1. Найти совместимую версию пакета (npm view pkg peerDependencies). 2. --legacy-peer-deps — поведение npm v3-v6, только предупреждение. 3. --force — обходит все проверки (опасно). Правильный путь — вариант 1.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
]

export function Task1_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 1: Виды зависимостей</h2>
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
