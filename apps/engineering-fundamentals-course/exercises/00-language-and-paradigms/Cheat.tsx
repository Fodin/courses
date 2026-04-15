/**
 * Cheat.tsx — полное рабочее решение для уровня 0.
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
    label: 'Синтаксис vs Семантика',
    body: 'Синтаксис — правила написания кода (грамматика). Семантика — что этот код означает и как выполняется. Один и тот же синтаксис в разных языках может иметь разную семантику.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Декларативный vs Императивный',
    body: 'Императивный стиль описывает КАК сделать (шаги). Декларативный описывает ЧТО получить (результат). SQL, React JSX, функциональные цепочки — декларативны. Циклы, мутации — императивны.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Мультипарадигменность',
    body: 'Современные языки (JavaScript, Python, Rust) поддерживают несколько парадигм: ООП, ФП, процедурное программирование. Выбор парадигмы — архитектурное решение, а не ограничение языка.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Первоклассные сущности',
    body: 'Объект является первоклассным, если его можно: передать как аргумент, вернуть из функции, присвоить переменной. В JS функции — первоклассные объекты. Это основа функционального стиля.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task0_1() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 0: Язык, семантика и парадигмы</h2>
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
