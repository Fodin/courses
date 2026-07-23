import { useEffect, useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 6.1: HTML vs JSON — Решение
// ============================================

const RICH_CONTENT =
  '<h2>Заголовок</h2><p><strong>Жирный</strong> текст.</p><ul><li>Пункт</li></ul>'

export function Task6_1_Solution() {
  const [mode, setMode] = useState<'html' | 'json'>('html')
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: RICH_CONTENT,
    onUpdate: () => forceRender(n => n + 1),
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: HTML vs JSON</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" disabled={mode === 'html'} onClick={() => setMode('html')}>
          HTML
        </button>
        <button type="button" disabled={mode === 'json'} onClick={() => setMode('json')}>
          JSON
        </button>
      </div>

      <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
        HTML удобен для хранения и SEO, JSON — для точного восстановления документа.
      </p>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <pre
        style={{
          background: '#f3f4f6',
          padding: '0.75rem',
          borderRadius: '6px',
          marginTop: '0.75rem',
          overflowX: 'auto',
          fontSize: '0.8rem',
        }}
      >
        {mode === 'html' ? editor?.getHTML() : JSON.stringify(editor?.getJSON(), null, 2)}
      </pre>
    </div>
  )
}

// ============================================
// Задание 6.2: setContent / insertContent — Решение
// ============================================

export function Task6_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Исходный текст. Поставьте курсор в середину и попробуйте вставку.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: setContent / insertContent</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() =>
            editor?.commands.setContent(
              '<h2>Новый документ</h2><p>Всё старое содержимое удалено.</p>'
            )
          }
        >
          Заменить документ
        </button>
        <button
          type="button"
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .insertContent('<p><strong>Шаблон:</strong> текст вставлен в позицию курсора.</p>')
              .run()
          }
        >
          Вставить шаблон
        </button>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus().insertContentAt(0, '<p>Вставлено в начало!</p>').run()
          }
        >
          Вставить на позицию 0
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 6.3: Контролируемый контент — Решение
// ============================================

function ControlledEditor({
  value,
  onChange,
}: {
  value: string
  onChange: (html: string) => void
}) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    const isSame = editor.getHTML() === value
    if (!isSame) {
      editor.commands.setContent(value, { emitUpdate: false })
    }
  }, [value, editor])

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
      <EditorContent editor={editor} />
    </div>
  )
}

export function Task6_3_Solution() {
  const [value, setValue] = useState('<p>Контролируемый редактор — печатайте свободно.</p>')

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Контролируемый контент</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() => setValue('<p>Содержимое сброшено извне!</p>')}
      >
        Сброс извне
      </button>

      <ControlledEditor value={value} onChange={setValue} />

      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#6b7280' }}>
        Текущее value (React state): {value}
      </p>
    </div>
  )
}
