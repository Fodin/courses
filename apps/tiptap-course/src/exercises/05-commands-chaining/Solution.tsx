import { useState } from 'react'

import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 5.1: Основы chain() — Решение
// ============================================

export function Task5_1_Solution() {
  const [updateCount, setUpdateCount] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст и сравните раздельные вызовы и chain().</p>',
    onUpdate: () => setUpdateCount(c => c + 1),
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Основы chain()</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() => {
            editor?.commands.toggleBold()
            editor?.commands.toggleItalic()
          }}
        >
          Раздельные вызовы
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleBold().toggleItalic().run()}
        >
          Через chain()
        </button>
        <button type="button" onClick={() => setUpdateCount(0)}>
          Сбросить счётчик
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <p style={{ marginTop: '0.5rem' }}>
        Срабатываний onUpdate: <strong>{updateCount}</strong>
      </p>
    </div>
  )
}

// ============================================
// Задание 5.2: Проверка can() — Решение
// ============================================

export function Task5_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Начните печатать, чтобы проверить Undo/Redo.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Проверка can()</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          type="button"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
        >
          Redo
        </button>
        <button
          type="button"
          disabled={!editor?.can().toggleBold()}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 5.3: Своя простая команда — Решение
// ============================================

function clearFormatting(editor: Editor) {
  editor.chain().focus().unsetAllMarks().clearNodes().run()
}

function applyHighlightHeading(editor: Editor) {
  editor.chain().focus().toggleHeading({ level: 2 }).toggleBold().run()
}

const RICH_CONTENT = `
  <h3>Заголовок</h3>
  <p><strong>Жирный</strong> и <em>курсивный</em> текст.</p>
  <ul><li>Пункт списка</li></ul>
`

export function Task5_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: RICH_CONTENT,
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Своя простая команда</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" onClick={() => editor && clearFormatting(editor)}>
          Очистить форматирование
        </button>
        <button type="button" onClick={() => editor && applyHighlightHeading(editor)}>
          Заголовок + Bold
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
