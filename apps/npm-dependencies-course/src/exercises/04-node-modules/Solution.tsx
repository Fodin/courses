// Level 4: node_modules structure — reference card

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
    label: 'Плоская структура (Hoisting)',
    body: 'npm v3+ поднимает зависимости в корень node_modules (hoisting). Вложенность возникает только при конфликте мажорных версий. Это устранило проблему бесконечной вложенности и длинных путей на Windows.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Вложенные копии',
    body: 'Если pkg-A требует lodash@4 и pkg-B требует lodash@3 — в корне окажется lodash@4, а внутри папки pkg-B появится node_modules/lodash@3. Две версии одного пакета сосуществуют.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'node_modules/.bin',
    body: 'Символические ссылки на исполняемые файлы пакетов. npm добавляет .bin в PATH при выполнении npm-скриптов. Поэтому "tsc" в package.json scripts работает без полного пути.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Фантомные зависимости (Phantom deps)',
    body: 'Плоская структура позволяет импортировать транзитивные пакеты без объявления в package.json. Работает сейчас — может сломаться при любом обновлении дерева. Всегда явно указывайте зависимости.',
    bg: '#3b1f1f',
    accent: '#f87171',
  },
  {
    label: 'npm dedupe',
    body: 'Пересматривает дерево и поднимает вложенные копии, если это совместимо с требованиями всех потребителей. Уменьшает объём node_modules. Не помогает при принципиальном конфликте мажорных версий.',
    bg: '#1c2a1c',
    accent: '#86efac',
  },
]

export function Task4_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 4: Устройство node_modules</h2>
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
