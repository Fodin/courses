// ============================================
// Cheat.tsx — Полное решение Level 10: NodeView в React
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 10 — NodeView в React</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>10.1: ReactNodeViewRenderer</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>addNodeView() {'{ return ReactNodeViewRenderer(Component) }'}</code>
          </li>
          <li>
            <code>NodeViewWrapper</code> — обязательный корневой элемент компонента
          </li>
          <li>
            Изменяйте атрибуты только через <code>updateAttributes(...)</code>, никогда не мутируйте{' '}
            <code>node.attrs</code> напрямую
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>10.2: NodeViewContent</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Статичная часть (заголовок) — обычный div с <code>contentEditable={'{false}'}</code>
          </li>
          <li>
            Редактируемая часть — <code>{'<NodeViewContent />'}</code>, требует{' '}
            <code>content: 'inline*'</code> в схеме ноды
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>10.3: Интерактивная нода</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Локальный <code>useState</code> для кратковременного визуального эффекта — не хранится в
            документе, это чисто UI-состояние
          </li>
          <li>
            <code>
              {
                'useEffect(() => { if (!justToggled) return; const t = setTimeout(() => setJustToggled(false), 400); return () => clearTimeout(t) }, [justToggled])'
              }
            </code>
          </li>
        </ul>
      </section>
    </div>
  )
}
