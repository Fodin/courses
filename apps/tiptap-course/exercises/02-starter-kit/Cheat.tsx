// ============================================
// Cheat.tsx — Полное решение Level 2: StarterKit и встроенные extensions
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 2 — StarterKit и встроенные extensions</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.1: Обзор StarterKit</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>editor?.extensionManager.extensions.map(ext =&gt; ext.name) ?? []</code> — полный
            развёрнутый список
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 2.2: Отключение extensions</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Выносите массивы extensions за пределы компонента — не пересоздавайте на каждый рендер
          </li>
          <li>
            <code>key={'{mode}'}</code> на компоненте-обёртке с <code>useEditor</code> заставляет
            React полностью размонтировать/смонтировать редактор при смене режима
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Задание 2.3: Точечная конфигурация</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{'StarterKit.configure({ heading: { levels: [1, 2] } })'}</code> — вложенный
            объект опций
          </li>
          <li>
            <code>editor?.isActive('heading', {'{ level: 1 }'})</code> — проверка активности с
            конкретным атрибутом
          </li>
        </ul>
      </section>
    </div>
  )
}
