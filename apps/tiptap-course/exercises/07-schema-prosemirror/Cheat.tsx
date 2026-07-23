// ============================================
// Cheat.tsx — Полное решение Level 7: Schema ProseMirror
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 7 — Schema ProseMirror</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>7.1: Инспектор схемы</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>Object.entries(editor.schema.nodes)</code> — пары <code>[name, NodeType]</code>, у
            каждого <code>NodeType.spec</code> содержит <code>content</code>/<code>group</code>/
            <code>marks</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>7.2: Content-выражения</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            У <code>codeBlock</code> в StarterKit: <code>{"content: 'text*', marks: ''"}</code> —
            поэтому <code>can().toggleBold()</code> вернёт <code>false</code> внутри него
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>7.3: Группы</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{"nodeEntries.filter(([, type]) => type.spec.group === 'block')"}</code>
          </li>
          <li>
            <code>doc</code> и <code>text</code> не имеют <code>group</code> — попадают в "Прочие"
          </li>
        </ul>
      </section>
    </div>
  )
}
