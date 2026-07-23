import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Cheat.tsx — Полное решение Level 0: Введение и setup
// Full solution for Level 0: Introduction & Setup
// ============================================

function Task0_1Cheat() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `<h2>Привет, Tiptap!</h2><p>Это мой первый редактор.</p>`,
  })

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
      <EditorContent editor={editor} />
    </div>
  )
}

function Task0_2Cheat() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст и нажмите на кнопку тулбара.</p>',
  })

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
      </div>
      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export function Cheat() {
  return (
    <div className="exercise-container">
      <h2>Подсказки: Level 0 — Введение и setup</h2>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 0.1: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>{"const editor = useEditor({ extensions: [StarterKit], content: '...' })"}</code>
          </li>
          <li>
            <code>editor</code> в первый рендер равен <code>null</code> — но{' '}
            <code>EditorContent</code> умеет принимать <code>null</code>, поэтому можно рендерить
            его сразу
          </li>
          <li>
            <code>content</code> — обычная HTML-строка, Tiptap распарсит её в дерево узлов
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ color: '#2563eb' }}>Задание 0.2: Ключевые идеи</h3>
        <ul style={{ lineHeight: 2 }}>
          <li>
            <code>editor?.chain().focus().toggleBold().run()</code> — опциональная цепочка, потому
            что <code>editor</code> может быть <code>null</code>
          </li>
          <li>
            <code>disabled={'{!editor}'}</code> на кнопках — защита от клика до готовности редактора
          </li>
          <li>
            <code>.focus()</code> в цепочке возвращает фокус в contenteditable после клика по кнопке
          </li>
        </ul>
      </section>

      <section>
        <h3 style={{ color: '#2563eb' }}>Живые компоненты</h3>
        <Task0_1Cheat />
        <div style={{ marginTop: '1.5rem' }} />
        <Task0_2Cheat />
      </section>
    </div>
  )
}
