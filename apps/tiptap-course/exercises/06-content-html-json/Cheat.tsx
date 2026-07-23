// ============================================
// Cheat.tsx — Полное решение Level 6: Работа с контентом
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 6 — Работа с контентом</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>6.1: HTML vs JSON</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Триггерите перерендер компонента в <code>onUpdate</code>, чтобы <code>getHTML()</code>/
            <code>getJSON()</code> вызывались заново при каждом изменении
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>6.2: setContent / insertContent</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>setContent(html)</code> — полная замена
          </li>
          <li>
            <code>insertContent(html)</code> — в текущую позицию курсора
          </li>
          <li>
            <code>insertContentAt(0, html)</code> — в явную позицию, независимо от курсора
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>6.3: Контролируемый контент</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            Ключевая защита от цикла:{' '}
            <code>
              {
                'if (editor.getHTML() !== value) editor.commands.setContent(value, { emitUpdate: false })'
              }
            </code>
          </li>
          <li>Без этой проверки — курсор будет сбрасываться на каждый введённый символ</li>
        </ul>
      </section>
    </div>
  )
}
