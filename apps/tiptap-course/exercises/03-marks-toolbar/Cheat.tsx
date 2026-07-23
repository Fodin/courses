// ============================================
// Cheat.tsx — Полное решение Level 3: Marks и Toolbar
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 3 — Marks и Toolbar</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>3.1–3.2: toggle-команды и isActive</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>editor?.chain().focus().toggleBold().run()</code> — toggle, а не set/unset
          </li>
          <li>
            <code>editor?.isActive('bold')</code> — читайте прямо в JSX при каждом рендере, это не
            кешируемое значение
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>3.3: Link mark</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Link входит в StarterKit (v3):{' '}
            <code>{'StarterKit.configure({ link: { openOnClick: false, autolink: true } })'}</code>
          </li>
          <li>
            <code>
              {"editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()"}
            </code>
          </li>
          <li>
            Кнопку "Убрать ссылку" показывайте условно:{' '}
            <code>{"editor?.isActive('link') && <button>...</button>"}</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>3.4: Toolbar компонент</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Массив <code>{'{ label, isActive, onClick }[]'}</code> + <code>.map()</code> — никакого
            копипаста JSX
          </li>
          <li>
            Ранний <code>{'if (!editor) return null'}</code> в начале компонента Toolbar
          </li>
        </ul>
      </section>
    </div>
  )
}
