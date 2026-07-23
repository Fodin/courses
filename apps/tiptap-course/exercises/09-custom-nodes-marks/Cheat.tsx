// ============================================
// Cheat.tsx — Полное решение Level 9: Кастомные Nodes и Marks
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 9 — Кастомные Nodes и Marks</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Общее для всех заданий</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Каждая своя команда требует{' '}
            <code>declare module '@tiptap/core' {'{ interface Commands<ReturnType> {...} }'}</code>{' '}
            — иначе TypeScript не разрешит вызвать её через <code>editor.chain()</code>
          </li>
          <li>
            <code>renderHTML</code> всегда пропускайте через{' '}
            <code>mergeAttributes(HTMLAttributes, {'{...}'})</code>, не собирайте объект атрибутов
            вручную
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>9.1: Highlight mark</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>commands.setMark(this.name, {'{ color }'})</code> /{' '}
            <code>commands.unsetMark(this.name)</code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>9.2–9.3: Callout node</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>group: 'block', content: 'block+'</code> — врезка содержит другие блоки
          </li>
          <li>
            <code>commands.wrapIn(this.name)</code> — оборачивает текущий блок
          </li>
          <li>
            <code>commands.updateAttributes(this.name, {'{ type }'})</code> — меняет атрибут без
            пересоздания ноды
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>9.4: Badge (atom)</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>group: 'inline', inline: true, atom: true</code>
          </li>
          <li>
            <code>{'commands.insertContent({ type: this.name, attrs: { label } })'}</code> — вставка
            узла как содержимого, а не mark
          </li>
        </ul>
      </section>
    </div>
  )
}
