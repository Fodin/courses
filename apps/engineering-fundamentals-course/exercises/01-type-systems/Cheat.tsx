/**
 * Cheat.tsx — полное рабочее решение для уровня 1.
 * Используй только для сверки, после того как попробовал сам.
 */

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
    label: 'Номинальная vs Структурная типизация',
    body: 'Номинальная: тип определяется именем (Java, C#). Структурная: тип определяется формой/полями (TypeScript). В TypeScript два типа совместимы, если у них одинаковая структура — независимо от имён.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Вариантность (Variance)',
    body: 'Ковариантность: A ≤ B → F<A> ≤ F<B> (читаем позиции). Контравариантность: A ≤ B → F<B> ≤ F<A> (пишем позиции). Инвариантность: никакой подстановки. Понимание вариантности критично для безопасного полиморфизма.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Дженерики и ограничения',
    body: 'Дженерики — параметрический полиморфизм. <T extends Serializable> ограничивает T теми типами, которые реализуют интерфейс. Без ограничений T — полностью абстрактный, с ним — конкретизированный.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Утиная типизация',
    body: 'Если объект имеет все нужные методы/поля — он подходит, независимо от его декларированного типа. Используется в динамических языках (Python, JavaScript) и TypeScript (через structural typing).',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task1_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 1: Система типов и дженерики</h2>
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
