import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 0.1: Первый редактор — Решение
// ============================================

export function Task0_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: `
      <h2>Привет, Tiptap!</h2>
      <p>Это мой первый редактор. Попробуйте отредактировать этот текст.</p>
      <p>Выделите слово и нажмите <strong>Ctrl+B</strong> — оно станет жирным.</p>
    `,
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Первый редактор</h2>
      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '150px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 0.2: Мини-тулбар — Решение
// ============================================

export function Task0_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст и нажмите на кнопку тулбара выше.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Мини-тулбар</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          style={{ fontWeight: 'bold', padding: '0.4rem 0.8rem' }}
        >
          B
        </button>
        <button
          type="button"
          disabled={!editor}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          style={{ fontStyle: 'italic', padding: '0.4rem 0.8rem' }}
        >
          I
        </button>
      </div>

      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          minHeight: '150px',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
