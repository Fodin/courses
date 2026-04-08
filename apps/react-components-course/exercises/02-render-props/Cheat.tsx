// ============================================
// Level 2: Render Props — Подсказки
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Level 2: Подсказки</h2>

      <section style={{ marginBottom: '32px' }}>
        <h3>Задание 2.1 — MouseTracker</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Интерфейс:</strong>{' '}
            <code>{'render: (pos: { x: number; y: number }) => ReactNode'}</code>
          </li>
          <li>
            <strong>Обработчик:</strong>{' '}
            <code>{'onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}'}</code>
          </li>
          <li>
            <strong>Tooltip-follower:</strong>{' '}
            <code>{'position: "fixed", left: x, top: y, pointerEvents: "none"'}</code>
          </li>
          <li>
            <strong>Контейнер:</strong> добавьте{' '}
            <code>{'position: "relative", height: "200px"'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '32px' }}>
        <h3>Задание 2.2 — Generic DataList</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Дженерик в TSX:</strong>{' '}
            <code>{'function DataList<T,>(...)'}</code> — запятая устраняет конфликт с JSX
          </li>
          <li>
            <strong>Пустой список:</strong>{' '}
            <code>{'if (data.length === 0) return renderEmpty?.() ?? "Список пуст"'}</code>
          </li>
          <li>
            <strong>Тип пропса:</strong>{' '}
            <code>{'renderItem: (item: T, index: number) => ReactNode'}</code>
          </li>
          <li>
            <strong>Key в списке:</strong> используйте <code>index</code> если у T нет id
          </li>
        </ul>
      </section>

      <section>
        <h3>Задание 2.3 — Toggle</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <strong>Состояние:</strong>{' '}
            <code>{'const [isOpen, setIsOpen] = useState(defaultOpen ?? false)'}</code>
          </li>
          <li>
            <strong>toggle:</strong>{' '}
            <code>{'() => setIsOpen(v => !v)'}</code>
          </li>
          <li>
            <strong>Модальный оверлей:</strong>{' '}
            <code>{'position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)"'}</code>
          </li>
          <li>
            <strong>Закрытие по оверлею:</strong> onClick на внешний div + <code>e.stopPropagation()</code> на окно
          </li>
          <li>
            <strong>Независимость:</strong> каждый пример — отдельный экземпляр <code>{'<Toggle>'}</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
