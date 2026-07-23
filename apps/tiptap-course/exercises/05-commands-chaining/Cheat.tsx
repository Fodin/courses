// ============================================
// Cheat.tsx — Полное решение Level 5: Commands и chaining
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 5 — Commands и chaining</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>5.1: Основы chain()</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Раздельные вызовы: <code>editor?.commands.toggleBold()</code> затем отдельно{' '}
            <code>toggleItalic()</code> — 2 транзакции, onUpdate x2
          </li>
          <li>
            chain: <code>{'editor?.chain().focus().toggleBold().toggleItalic().run()'}</code> — 1
            транзакция, onUpdate x1
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>5.2: can()</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>disabled={'{!editor?.can().undo()}'}</code> — можно и без chain внутри can(),
            достаточно одиночной команды
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>5.3: Своя команда</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>unsetAllMarks()</code> + <code>clearNodes()</code> — очистка форматирования
          </li>
          <li>
            Оборачивайте комбинации в обычные функции <code>(editor: Editor) =&gt; void</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
