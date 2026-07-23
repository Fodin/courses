// ============================================
// Cheat.tsx — Полное решение Level 12: Keyboard shortcuts и ProseMirror-плагины
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 12 — Keyboard shortcuts и ProseMirror-плагины</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>12.1: addKeyboardShortcuts</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Ключ объекта — строка шортката, значение — функция без аргументов, возвращающая boolean
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>12.2: decorations</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>Plugin</code>/<code>PluginKey</code> — из <code>@tiptap/pm/state</code>
          </li>
          <li>
            <code>Decoration</code>/<code>DecorationSet</code> — из <code>@tiptap/pm/view</code>
          </li>
          <li>
            <code>state.doc.descendants((node, pos) =&gt; {'{...}'})</code> для обхода документа
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>12.3: Хоткей + плагин</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Изменение <code>this.storage.enabled</code> само по себе не триггерит пересчёт
            decorations — нужна пустая транзакция:{' '}
            <code>this.editor.view.dispatch(this.editor.state.tr)</code>
          </li>
          <li>
            Не забудьте module augmentation для <code>Storage</code>, иначе TS не разрешит
            читать/писать в него
          </li>
        </ul>
      </section>
    </div>
  )
}
