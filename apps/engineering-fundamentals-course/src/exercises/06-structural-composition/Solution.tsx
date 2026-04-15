// Level 6: Structural Composition, Aggregation, Delegation — reference card

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
    label: 'Композиция vs Наследование',
    body: 'Наследование моделирует IS-A: Dog IS-A Animal. Композиция моделирует HAS-A: Car HAS-A Engine. Правило: предпочитай композицию наследованию. Наследование создаёт жёсткую связь; композиция — гибкую замену компонентов.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Агрегация',
    body: 'Объект содержит другой объект, но не владеет им: оба живут независимо. Team содержит Player, но Player существует без Team. Время жизни объектов не связано. Противоположность — Composition (владение): компонент не существует без контейнера.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Делегирование',
    body: 'Объект перекладывает часть ответственности на другой объект. Logger делегирует форматирование Formatter. Это явный контроль поведения без наследования. Паттерн Decorator, Strategy, Proxy — реализуют делегирование.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Миксины и трейты',
    body: 'Механизм добавления поведения без наследования. TypeScript: через intersection types и utility functions. Позволяют "примешивать" поведение к разным классам. Без цепочки прототипов — проще чем множественное наследование.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task6_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 6: Композиция, агрегация, делегирование</h2>
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
