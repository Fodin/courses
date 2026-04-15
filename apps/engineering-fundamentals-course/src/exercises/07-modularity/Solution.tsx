// Level 7: Modularity — reference card

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
    label: 'ES Modules и инкапсуляция',
    body: 'Каждый файл — отдельный модуль с собственной областью видимости. export делает API публичным, всё остальное — приватным. Barrel-файлы (index.ts) формируют публичный API пакета. Не экспортируй то, что не должно использоваться снаружи.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Пакеты и зависимости',
    body: 'Пакет — единица переиспользования с версионированием. package.json: dependencies (runtime), devDependencies (только разработка), peerDependencies (пользователь устанавливает сам). Семантическое версионирование: MAJOR.MINOR.PATCH.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Пространства имён',
    body: 'Namespace избегает конфликтов имён. В TypeScript: module augmentation, namespace keyword (устарел), или явные префиксы. В монорепо: @scope/package-name. Пространства имён — логическая группировка, не физический файл.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Принципы разбиения на модули',
    body: 'Модуль должен иметь одну причину для изменения. Зависимости направлены от деталей к абстракциям. Циклические зависимости между модулями — признак плохой границы. Stable Dependencies Principle: не зависеть от нестабильного кода.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task7_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 7: Модульность</h2>
      <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>
        Ключевые концепции для запоминания
      </p>

      {CONCEPTS.map(c => (
        <div key={c.label} style={{ ...CARD_STYLE, background: c.bg, borderLeft: `4px solid ${c.accent}` }}>
          <div style={{ ...LABEL_STYLE, color: c.accent }}>{c.label}</div>
          <div>{c.body}</div>
        </div>
      ))}
    </div>
  )
}
