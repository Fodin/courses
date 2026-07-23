// ============================================
// Cheat.tsx — Полное решение Level 13: BubbleMenu и FloatingMenu
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 13 — BubbleMenu и FloatingMenu</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Общее</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Импорт: <code>import {'{ BubbleMenu, FloatingMenu }'} from '@tiptap/react/menus'</code>{' '}
            — НЕ из <code>@tiptap/react</code>
          </li>
          <li>
            Всегда <code>{'{editor && <BubbleMenu editor={editor}>...</BubbleMenu>}'}</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>13.1–13.2</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            BubbleMenu — при выделении, FloatingMenu — на пустой строке (поведение по умолчанию)
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>13.3: shouldShow</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>
              {
                "shouldShow={({ editor, state }) => { const { from, to } = state.selection; return from !== to && editor.isActive('heading') }}"
              }
            </code>
          </li>
        </ul>
      </section>
    </div>
  )
}
