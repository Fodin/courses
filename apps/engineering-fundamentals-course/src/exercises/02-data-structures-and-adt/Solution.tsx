// Level 2: Data Structures and ADT — reference card

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
    label: 'Sum Type (Тип-сумма)',
    body: 'Значение одного из нескольких вариантов. TypeScript: type Result<T> = { ok: true; value: T } | { ok: false; error: string }. Количество возможных значений — сумма вариантов. Моделирует ИЛИ.',
    bg: '#1e3a5f',
    accent: '#60a5fa',
  },
  {
    label: 'Product Type (Тип-произведение)',
    body: 'Значение содержит все поля одновременно. TypeScript: type Point = { x: number; y: number }. Количество возможных значений — произведение вариантов каждого поля. Моделирует И. Кортежи и объекты — product types.',
    bg: '#1a3a2a',
    accent: '#34d399',
  },
  {
    label: 'Паттерн-матчинг',
    body: 'Исчерпывающий разбор вариантов sum type. В TypeScript — через switch по дискриминантному полю или if с type guards. Компилятор проверяет полноту: если забыть ветку — ошибка типов.',
    bg: '#3b1f5e',
    accent: '#a78bfa',
  },
  {
    label: 'Выбор структуры данных',
    body: 'Map: O(1) поиск по ключу. Set: уникальность, O(1) проверка. Array: порядок, O(n) поиск. Linked List: O(1) вставка в начало. Стек/очередь: LIFO/FIFO доступ. Дерево: иерархия, O(log n) при балансировке.',
    bg: '#3d2a0a',
    accent: '#f59e0b',
  },
]

export function Task2_1_Solution() {
  return (
    <div className="exercise-container">
      <h2 style={{ marginBottom: '4px' }}>Уровень 2: Структуры данных и ADT</h2>
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
