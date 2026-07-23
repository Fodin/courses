// ============================================
// Cheat.tsx — Полное решение Level 11: Input rules и Paste rules
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 11 — Input rules и Paste rules</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>11.1: Markdown input rules</h3>
        <p>
          Все правила уже встроены в StarterKit — задание чисто демонстрационное, extension писать
          не нужно.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>11.2: Paste rules</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>
              {
                'markPasteRule({ find: /https?:\\/\\/[^\\s]+/g, type: this.type, getAttributes: (match) => ({ href: match[0] }) })'
              }
            </code>
          </li>
          <li>
            Используйте имя <code>autoLink</code>, а не <code>link</code>, чтобы не конфликтовать со
            встроенным Link из StarterKit v3
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>11.3: Свой InputRule</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>
              {
                "new InputRule({ find: /:\\)$/, handler: ({ state, range }) => { state.tr.replaceWith(range.from, range.to, state.schema.text('🙂')) } })"
              }
            </code>
          </li>
        </ul>
      </section>
    </div>
  )
}
