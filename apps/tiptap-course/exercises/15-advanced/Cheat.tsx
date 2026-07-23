// ============================================
// Cheat.tsx — Полное решение Level 15: Продвинутое
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 15 — Продвинутое</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>15.1: Decorations поверх поиска</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{'tr.getMeta(searchKey)'}</code> внутри <code>apply</code>, диспатч через{' '}
            <code>{'editor.view.dispatch(editor.state.tr.setMeta(searchKey, { query }))'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>15.2: Drag handle</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>Decoration.widget(pos, createDOM, {'{ side: -1 }'})</code> — для самого хендла
          </li>
          <li>
            <code>props.handleDOMEvents.drop</code> — переместить содержимое через{' '}
            <code>tr.delete</code> + <code>tr.insert</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>15.3: Оглавление</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>
              {
                "editor.state.doc.descendants((node, pos) => { if (node.type.name === 'heading') {...} })"
              }
            </code>
          </li>
          <li>
            <code>{'editor.chain().focus().setTextSelection(pos).scrollIntoView().run()'}</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
