// Level 5: dependency resolution algorithm — reference card

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
    label: 'maxSatisfying — выбор версии',
    body: 'Для каждого диапазона (^1.2.3, ~2.0.0) npm вызывает semver.maxSatisfying — выбирает наибольшую версию, удовлетворяющую диапазону. Без lockfile результат зависит от состояния реестра в момент запуска.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'idealTree → reify',
    body: 'Arborist (npm v7+) строит idealTree — желаемое состояние node_modules. Затем сравнивает с actualTree и делает reify: применяет минимальный diff. Инкрементально, без пересоздания всего дерева.',
    bg: '#1a3a2e',
    accent: '#34d399',
  },
  {
    label: 'Транзитивные зависимости',
    body: 'Ваш проект зависит от A → A зависит от B → B зависит от C. B и C — транзитивные зависимости. npm рекурсивно разворачивает весь граф. Одна прямая зависимость может добавить десятки транзитивных пакетов.',
    bg: '#2d1f3d',
    accent: '#a78bfa',
  },
  {
    label: 'Детерминизм через lockfile',
    body: 'package-lock.json хранит точные версии всего дерева. npm ci строго следует lockfile и никогда его не обновляет. npm install может обновить lockfile. В CI/CD всегда используйте npm ci.',
    bg: '#3b2a0f',
    accent: '#fbbf24',
  },
  {
    label: 'Две версии одного пакета',
    body: 'При конфликте мажоров обе версии сосуществуют. Node.js разрешает require() обходом директорий вверх — каждый пакет найдёт ближайшую версию по дереву папок. Это корректное поведение, не баг.',
    bg: '#1c2a1c',
    accent: '#86efac',
  },
]

export function Task5_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 5: Алгоритм разрешения зависимостей</h2>
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
