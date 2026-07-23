import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const btnStyle = (active: boolean): React.CSSProperties => ({
  padding: '0.4rem 0.8rem',
  background: active ? '#2563eb' : '#f3f4f6',
  color: active ? '#fff' : '#111827',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
})

// ============================================
// Задание 4.1: Заголовки — Решение
// ============================================

export function Task4_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit.configure({ heading: { levels: [1, 2, 3] } })],
    content: '<p>Поставьте курсор здесь и выберите уровень заголовка.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Заголовки</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        {[1, 2, 3].map(level => (
          <button
            key={level}
            type="button"
            style={btnStyle(!!editor?.isActive('heading', { level }))}
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: level as 1 | 2 | 3 })
                .run()
            }
          >
            H{level}
          </button>
        ))}
        <button type="button" onClick={() => editor?.chain().focus().setParagraph().run()}>
          Параграф
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 4.2: Списки — Решение
// ============================================

const LIST_CONTENT = `
  <ul>
    <li>Первый пункт</li>
    <li>
      Второй пункт
      <ul><li>Вложенный подпункт</li></ul>
    </li>
    <li>Третий пункт</li>
  </ul>
`

export function Task4_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: LIST_CONTENT,
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Списки</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          style={btnStyle(!!editor?.isActive('bulletList'))}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          Маркированный список
        </button>
        <button
          type="button"
          style={btnStyle(!!editor?.isActive('orderedList'))}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          Нумерованный список
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
        Tab — увеличить отступ, Shift+Tab — уменьшить
      </p>
    </div>
  )
}

// ============================================
// Задание 4.3: Blockquote и HorizontalRule — Решение
// ============================================

export function Task4_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст для цитаты, либо вставьте разделитель.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Blockquote и HorizontalRule</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          style={btnStyle(!!editor?.isActive('blockquote'))}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          Цитата
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
          Разделитель
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 4.4: CodeBlock — Решение
// ============================================

const CODE_CONTENT = `<pre><code>function hello() {\n  console.log('Hello, Tiptap!')\n}</code></pre><p>Текст после блока кода.</p>`

export function Task4_4_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: CODE_CONTENT,
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: CodeBlock</h2>

      <button
        type="button"
        style={{ ...btnStyle(!!editor?.isActive('codeBlock')), marginBottom: '0.75rem' }}
        onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
      >
        Code Block
      </button>

      <div
        style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}
        className="tiptap-codeblock-demo"
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .tiptap-codeblock-demo pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 0.75rem;
          border-radius: 6px;
          font-family: 'Fira Code', monospace;
          font-size: 0.85rem;
          overflow-x: auto;
        }
      `}</style>
    </div>
  )
}
