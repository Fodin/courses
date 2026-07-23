// ============================================
// Cheat.tsx — Полное решение Level 8: Кастомные Extensions
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 8 — Кастомные Extensions</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>8.1: Extension.create и addOptions</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>
              {
                "Extension.create<MaxLengthOptions>({ name: 'maxLength', addOptions() { return { maxLength: 280 } } })"
              }
            </code>
          </li>
          <li>
            Чтение опций снаружи:{' '}
            <code>
              {"editor?.extensionManager.extensions.find(e => e.name === 'maxLength')?.options"}
            </code>
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>8.2: addStorage</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Обязательно добавьте{' '}
            <code>declare module '@tiptap/core' {'{ interface Storage {...} }'}</code> — иначе
            TypeScript не будет знать про ваш ключ в <code>editor.storage</code>
          </li>
          <li>
            Внутри extension: <code>this.storage.updatesCount += 1</code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>8.3: addGlobalAttributes</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{"types: ['heading', 'paragraph']"}</code> — один атрибут для двух разных нод
          </li>
          <li>
            Определяйте активный тип блока перед <code>updateAttributes</code>:{' '}
            <code>{"editor.isActive('heading') ? 'heading' : 'paragraph'"}</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
