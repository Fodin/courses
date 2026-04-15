/**
 * Cheat.tsx — полное рабочее решение для уровня 5.
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
    label: 'Параметрический полиморфизм',
    body: 'Код работает с любым типом через дженерики. function identity<T>(x: T): T — одна реализация для всех типов. Тип подставляется на этапе компиляции. Нет потери информации о типе, нет накладных расходов в runtime.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Подтиповой полиморфизм',
    body: 'Объект подтипа используется там, где ожидается супертип. Принцип Лисков (LSP): подтип не должен нарушать контракт супертипа. Переопределение методов с усилением постусловий или ослаблением предусловий — нарушение LSP.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Ad-hoc полиморфизм (перегрузка)',
    body: 'Разные реализации функции для разных типов. TypeScript: перегрузки через overload signatures. Реализуется через type classes в Haskell/Rust (traits). В JS — через проверку типов в runtime.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Статическая vs Динамическая диспетчеризация',
    body: 'Статическая: вызываемый метод определяется на этапе компиляции (перегрузка, дженерики). Динамическая: определяется в runtime по фактическому типу объекта (virtual methods, vtable). Динамическая гибче, но медленнее.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task5_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 5: Полиморфизм и диспетчеризация</h2>
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
