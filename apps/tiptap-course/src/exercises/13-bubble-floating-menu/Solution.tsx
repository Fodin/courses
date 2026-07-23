import { EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit'

const menuButtonStyle: React.CSSProperties = {
  background: '#1f2937',
  color: '#fff',
  border: 'none',
  padding: '0.3rem 0.6rem',
  cursor: 'pointer',
  fontSize: '0.8rem',
}

// ============================================
// Задание 13.1: BubbleMenu при выделении — Решение
// ============================================

export function Task13_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите этот текст мышкой, чтобы увидеть всплывающую панель.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: BubbleMenu при выделении</h2>

      {editor && (
        <BubbleMenu
          editor={editor}
          style={{
            display: 'flex',
            background: '#1f2937',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          <button
            type="button"
            style={{ ...menuButtonStyle, fontWeight: editor.isActive('bold') ? 'bold' : 'normal' }}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            B
          </button>
          <button
            type="button"
            style={{
              ...menuButtonStyle,
              fontStyle: editor.isActive('italic') ? 'italic' : 'normal',
            }}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            I
          </button>
          <button
            type="button"
            style={menuButtonStyle}
            onClick={() => {
              const url = window.prompt('URL ссылки')
              if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }}
          >
            Link
          </button>
        </BubbleMenu>
      )}

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 13.2: FloatingMenu на пустой строке — Решение
// ============================================

export function Task13_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Заполненный параграф.</p><p>Ещё один параграф с текстом.</p><p></p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: FloatingMenu на пустой строке</h2>

      {editor && (
        <FloatingMenu
          editor={editor}
          style={{
            display: 'flex',
            gap: '0.3rem',
            background: '#f3f4f6',
            padding: '0.3rem',
            borderRadius: '6px',
          }}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          >
            H2
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
            Список
          </button>
          <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            Цитата
          </button>
        </FloatingMenu>
      )}

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 13.3: shouldShow: кастомная логика — Решение
// ============================================

export function Task13_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content:
      '<h2>Заголовок для выделения</h2><p>Обычный параграф — выделение здесь не покажет меню.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: shouldShow</h2>

      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ editor, state }) => {
            const { from, to } = state.selection
            const hasSelection = from !== to
            return hasSelection && editor.isActive('heading')
          }}
          style={{
            display: 'flex',
            background: '#1f2937',
            borderRadius: '6px',
            overflow: 'hidden',
          }}
        >
          {[1, 2, 3].map(level => (
            <button
              key={level}
              type="button"
              style={menuButtonStyle}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: level as 1 | 2 | 3 })
                  .run()
              }
            >
              H{level}
            </button>
          ))}
        </BubbleMenu>
      )}

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
