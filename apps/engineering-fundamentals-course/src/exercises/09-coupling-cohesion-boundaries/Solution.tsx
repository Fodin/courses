// Level 9: Coupling, Cohesion and Boundaries — reference card

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
    label: 'Coupling (Связанность)',
    body: 'Степень зависимости модулей друг от друга. Слабая связанность (low coupling) — цель. Виды: data coupling (передача данных), stamp coupling (передача структуры), control coupling (передача флагов управления), common coupling (общее состояние). Последние — хуже.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Cohesion (Сцепленность)',
    body: 'Степень, в которой элементы модуля связаны по смыслу. Высокая сцепленность (high cohesion) — цель. Functional cohesion: всё служит одной задаче. Coincidental cohesion: элементы объединены случайно. Цель: high cohesion + low coupling.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Закон Деметры',
    body: 'Не разговаривай с незнакомцами. Метод объекта должен вызывать только: методы самого объекта, методы переданных аргументов, методы созданных объектов, методы прямых полей. Цепочки вызовов a.b.c.d() нарушают закон Деметры.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Архитектурные границы',
    body: 'Граница — место, где один модуль взаимодействует с другим через чётко определённый интерфейс. Пересечение границы всегда через абстракцию. Примеры границ: HTTP API, очередь сообщений, интерфейс репозитория. Границы замедляют разработку, но снижают связанность.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task9_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 9: Связанность, сцепленность и границы</h2>
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
