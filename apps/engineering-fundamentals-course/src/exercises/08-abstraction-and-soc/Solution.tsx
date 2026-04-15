// Level 8: Abstraction and Separation of Concerns — reference card

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
    label: 'Уровни абстракции',
    body: 'Каждый уровень кода должен работать на одном уровне абстракции. Функция не должна одновременно делать высокоуровневую логику и низкоуровневые детали. Single Level of Abstraction Principle (SLAP): смешение уровней делает код нечитаемым.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Separation of Concerns (SoC)',
    body: 'Каждая часть системы отвечает за один аспект. UI отдельно от бизнес-логики, логика отдельно от хранения данных. Нарушение SoC: компонент React, который делает fetch, обрабатывает данные и рендерит — три ответственности в одном месте.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Слоёная архитектура',
    body: 'Presentation → Application → Domain → Infrastructure. Каждый слой знает только о нижележащем. Domain не знает о базе данных. Application не знает о HTTP. Зависимости только вниз — или через интерфейсы (DIP).',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Утечка абстракции',
    body: 'Абстракция протекает, когда детали реализации просачиваются через интерфейс. Пример: метод getUsers() возвращает SQL-объект вместо доменной модели. Признак: изменение реализации заставляет менять всех клиентов.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task8_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 8: Абстракция и разделение ответственности</h2>
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
