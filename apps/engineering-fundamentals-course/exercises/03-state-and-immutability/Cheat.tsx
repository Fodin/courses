/**
 * Cheat.tsx — полное рабочее решение для уровня 3.
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
    label: 'Иммутабельность',
    body: 'Неизменяемые данные: вместо изменения — создание новой версии. Преимущества: предсказуемость, безопасность в конкурентной среде, простота отладки. В JS: Object.freeze(), spread-операторы, библиотеки Immer/Immutable.js.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Скрытое состояние',
    body: 'Глобальные переменные, синглтоны, замыкания с мутацией — это скрытое состояние. Оно делает функции непредсказуемыми: вызов с одними аргументами может давать разные результаты. Чистые функции не имеют скрытого состояния.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Идемпотентность',
    body: 'Операция идемпотентна, если повторное применение не меняет результат: f(f(x)) = f(x). HTTP PUT и DELETE — идемпотентны. POST — нет. Идемпотентные операции безопасны при повторных попытках (retry).',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Управление состоянием',
    body: 'Принципы: минимизировать область видимости состояния, делать переходы явными, хранить одну версию правды (single source of truth). Паттерны: FSM (конечный автомат), CQRS, Event Sourcing — для сложных доменов.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task3_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 3: Состояние, мутабельность, идемпотентность</h2>
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
