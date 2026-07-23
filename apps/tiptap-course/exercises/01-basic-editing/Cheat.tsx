// ============================================
// Cheat.tsx — Полное решение Level 1: Базовое редактирование
// Full solution for Level 1: Basic Editing
// ============================================

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 1 — Базовое редактирование</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.1: HTML и JSON вывод</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            И <code>onCreate</code>, и <code>onUpdate</code> должны заполнять state —{' '}
            <code>onCreate</code> нужен, чтобы значения были видны сразу, а не только после первого
            изменения
          </li>
          <li>
            Тип для JSON-состояния — <code>JSONContent | null</code> из <code>@tiptap/react</code>
          </li>
          <li>
            <code>{'JSON.stringify(json, null, 2)'}</code> — форматирует JSON с отступами для
            читаемости
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 1.2: Editable toggle</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>editable</code> в опциях <code>useEditor</code> влияет только на начальное
            состояние — переключать нужно через <code>editor.setEditable(value)</code>
          </li>
          <li>
            Вызывайте <code>setEditable</code> внутри{' '}
            <code>
              {'useEffect(() => { editor?.setEditable(isEditable) }, [editor, isEditable])'}
            </code>
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Задание 1.3: Счётчик символов</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>editor.getText().length</code> — количество символов без учёта HTML-тегов
          </li>
          <li>
            <code>{'text.split(/\\s+/).filter(Boolean).length'}</code> — подсчёт слов, устойчивый к
            двойным пробелам
          </li>
          <li>
            Цвет: <code>{"ratio > 1 ? 'red' : ratio > 0.9 ? 'orange' : 'normal'"}</code>, где{' '}
            <code>ratio = charCount / MAX_CHARS</code>
          </li>
        </ul>
      </section>
    </div>
  )
}
