// ============================================
// Cheat.tsx — Полное решение Level 4: Nodes
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 4 — Nodes</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>4.1: Заголовки</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{'editor?.chain().focus().toggleHeading({ level }).run()'}</code> — level это
            число 1|2|3, приведение типа через <code>as 1 | 2 | 3</code> при генерации из массива
          </li>
          <li>
            <code>{'editor?.chain().focus().setParagraph().run()'}</code> — возврат к обычному
            тексту
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>4.2: Списки</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Вложенный список в HTML:{' '}
            <code>{'<ul><li>Второй<ul><li>Вложенный</li></ul></li></ul>'}</code>
          </li>
          <li>
            <code>toggleBulletList()</code> / <code>toggleOrderedList()</code> — обе toggle-команды
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>4.3: Blockquote и HorizontalRule</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>toggleBlockquote()</code> — toggle, есть isActive-подсветка
          </li>
          <li>
            <code>setHorizontalRule()</code> — НЕ toggle, кнопка без подсветки активности
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>4.4: CodeBlock</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>toggleCodeBlock()</code> + <code>isActive('codeBlock')</code>
          </li>
          <li>
            Стилизуйте <code>pre</code> внутри контейнера редактора через вложенный CSS-селектор, а
            не инлайн-стили на самой ноде
          </li>
        </ul>
      </section>
    </div>
  )
}
