import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const starterKitWithLink = [StarterKit.configure({ link: { openOnClick: false, autolink: true } })]

// ============================================
// Задание 3.1: Bold / Italic / Strike — Решение
// ============================================

const activeBtn = (active: boolean): React.CSSProperties => ({
  padding: '0.4rem 0.8rem',
  background: active ? '#2563eb' : '#f3f4f6',
  color: active ? '#fff' : '#111827',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  cursor: 'pointer',
})

export function Task3_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст и попробуйте кнопки форматирования.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Bold / Italic / Strike</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          disabled={!editor}
          style={activeBtn(!!editor?.isActive('bold'))}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          disabled={!editor}
          style={activeBtn(!!editor?.isActive('italic'))}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          disabled={!editor}
          style={activeBtn(!!editor?.isActive('strike'))}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          S
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 3.2: Inline code — Решение
// ============================================

export function Task3_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Выделите текст и нажмите Code, либо Ctrl+E.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Inline code</h2>

      <button
        type="button"
        disabled={!editor}
        title="Ctrl+E"
        style={{ ...activeBtn(!!editor?.isActive('code')), marginBottom: '0.75rem' }}
        onClick={() => editor?.chain().focus().toggleCode().run()}
      >
        {'</>'}
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 3.3: Link mark — Решение
// ============================================

export function Task3_3_Solution() {
  const editor = useEditor({
    extensions: starterKitWithLink,
    content: '<p>Выделите текст и добавьте ссылку.</p>',
  })

  const handleSetLink = () => {
    const url = window.prompt('URL ссылки')
    if (!url) return
    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  const handleUnsetLink = () => {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run()
  }

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Link mark</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" disabled={!editor} onClick={handleSetLink}>
          Добавить ссылку
        </button>
        {editor?.isActive('link') && (
          <button type="button" onClick={handleUnsetLink}>
            Убрать ссылку
          </button>
        )}
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 3.4: Полная панель инструментов — Решение
// ============================================

interface ToolbarButtonConfig {
  label: string
  isActive: () => boolean
  onClick: () => void
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null

  const buttons: ToolbarButtonConfig[] = [
    {
      label: 'B',
      isActive: () => editor.isActive('bold'),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      label: 'I',
      isActive: () => editor.isActive('italic'),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      label: 'S',
      isActive: () => editor.isActive('strike'),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      label: '</>',
      isActive: () => editor.isActive('code'),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
  ]

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
      {buttons.map(btn => (
        <button
          key={btn.label}
          type="button"
          style={activeBtn(btn.isActive())}
          onClick={btn.onClick}
        >
          {btn.label}
        </button>
      ))}
      <button
        type="button"
        style={activeBtn(editor.isActive('link'))}
        onClick={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
          }
          const url = window.prompt('URL ссылки')
          if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
        }}
      >
        Link
      </button>
    </div>
  )
}

export function Task3_4_Solution() {
  const editor = useEditor({
    extensions: starterKitWithLink,
    content: '<p>Полная панель: bold, italic, strike, code, link.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Полная панель инструментов</h2>
      <Toolbar editor={editor} />
      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
