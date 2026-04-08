// ============================================
// Level 2: Render Props — Подсказки
// Level 2: Render Props — Hints
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      {/* Level 2: Подсказки */}
      {/* Level 2: Hints */}
      <h2>Level 2: Подсказки</h2>

      <section style={{ marginBottom: '32px' }}>
        {/* Задание 2.1 — MouseTracker */}
        {/* Task 2.1 — MouseTracker */}
        <h3>Задание 2.1 — MouseTracker</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* Интерфейс: render: (pos: { x: number; y: number }) => ReactNode */}
          {/* Interface: render: (pos: { x: number; y: number }) => ReactNode */}
          <li>
            <strong>Интерфейс:</strong>{' '}
            <code>{'render: (pos: { x: number; y: number }) => ReactNode'}</code>
          </li>
          {/* Обработчик: onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })} */}
          {/* Handler: onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })} */}
          <li>
            <strong>Обработчик:</strong>{' '}
            <code>{'onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}'}</code>
          </li>
          {/* Tooltip-follower: position: "fixed", left: x, top: y, pointerEvents: "none" */}
          {/* Tooltip-follower: position: "fixed", left: x, top: y, pointerEvents: "none" */}
          <li>
            <strong>Tooltip-follower:</strong>{' '}
            <code>{'position: "fixed", left: x, top: y, pointerEvents: "none"'}</code>
          </li>
          {/* Контейнер: добавьте position: "relative", height: "200px" */}
          {/* Container: add position: "relative", height: "200px" */}
          <li>
            <strong>Контейнер:</strong> добавьте{' '}
            <code>{'position: "relative", height: "200px"'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        {/* Задание 2.2 — Generic DataList */}
        {/* Task 2.2 — Generic DataList */}
        <h3>Задание 2.2 — Generic DataList</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* Дженерик в TSX: function DataList<T,>(...) — запятая устраняет конфликт с JSX */}
          {/* Generic in TSX: function DataList<T,>(...) — the comma resolves the conflict with JSX */}
          <li>
            <strong>Дженерик в TSX:</strong>{' '}
            <code>{'function DataList<T,>(...)'}</code> — запятая устраняет конфликт с JSX
          </li>
          {/* Пустой список: if (data.length === 0) return renderEmpty?.() ?? "Список пуст" */}
          {/* Empty list: if (data.length === 0) return renderEmpty?.() ?? "List is empty" */}
          <li>
            <strong>Пустой список:</strong>{' '}
            <code>{'if (data.length === 0) return renderEmpty?.() ?? "Список пуст"'}</code>
          </li>
          {/* Тип пропса: renderItem: (item: T, index: number) => ReactNode */}
          {/* Prop type: renderItem: (item: T, index: number) => ReactNode */}
          <li>
            <strong>Тип пропса:</strong>{' '}
            <code>{'renderItem: (item: T, index: number) => ReactNode'}</code>
          </li>
          {/* Key в списке: используйте index если у T нет id */}
          {/* Key in list: use index if T has no id */}
          <li>
            <strong>Key в списке:</strong> используйте <code>index</code> если у T нет id
          </li>
        </ul>
      </section>

      <section>
        {/* Задание 2.3 — Toggle */}
        {/* Task 2.3 — Toggle */}
        <h3>Задание 2.3 — Toggle</h3>
        <ul style={{ lineHeight: 2 }}>
          {/* Состояние: const [isOpen, setIsOpen] = useState(defaultOpen ?? false) */}
          {/* State: const [isOpen, setIsOpen] = useState(defaultOpen ?? false) */}
          <li>
            <strong>Состояние:</strong>{' '}
            <code>{'const [isOpen, setIsOpen] = useState(defaultOpen ?? false)'}</code>
          </li>
          {/* toggle: () => setIsOpen(v => !v) */}
          {/* toggle: () => setIsOpen(v => !v) */}
          <li>
            <strong>toggle:</strong>{' '}
            <code>{'() => setIsOpen(v => !v)'}</code>
          </li>
          {/* Модальный оверлей: position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" */}
          {/* Modal overlay: position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)" */}
          <li>
            <strong>Модальный оверлей:</strong>{' '}
            <code>{'position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)"'}</code>
          </li>
          {/* Закрытие по оверлею: onClick на внешний div + e.stopPropagation() на окно */}
          {/* Close on overlay: onClick on outer div + e.stopPropagation() on window */}
          <li>
            <strong>Закрытие по оверлею:</strong> onClick на внешний div + <code>e.stopPropagation()</code> на окно
          </li>
          {/* Независимость: каждый пример — отдельный экземпляр <Toggle> */}
          {/* Independence: each example is a separate <Toggle> instance */}
          <li>
            <strong>Независимость:</strong> каждый пример — отдельный экземпляр <code>{'<Toggle>'}</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
