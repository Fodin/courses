import { useEffect, useState } from 'react'

import { EditorContent, useEditor, type JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 1.1: HTML и JSON вывод — Решение
// ============================================

const INITIAL_CONTENT = '<p>Отредактируйте этот текст и посмотрите на HTML/JSON ниже.</p>'

export function Task1_1_Solution() {
  const [html, setHtml] = useState('')
  const [json, setJson] = useState<JSONContent | null>(null)

  const editor = useEditor({
    extensions: [StarterKit],
    content: INITIAL_CONTENT,
    onCreate: ({ editor }) => {
      setHtml(editor.getHTML())
      setJson(editor.getJSON())
    },
    onUpdate: ({ editor }) => {
      setHtml(editor.getHTML())
      setJson(editor.getJSON())
    },
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: HTML и JSON вывод</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3>HTML</h3>
          <pre
            style={{
              background: '#f3f4f6',
              padding: '0.75rem',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '0.8rem',
            }}
          >
            {html}
          </pre>
        </div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3>JSON</h3>
          <pre
            style={{
              background: '#f3f4f6',
              padding: '0.75rem',
              borderRadius: '6px',
              overflowX: 'auto',
              fontSize: '0.8rem',
            }}
          >
            {JSON.stringify(json, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 1.2: Editable toggle — Решение
// ============================================

export function Task1_2_Solution() {
  const [isEditable, setIsEditable] = useState(true)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Переключите режим кнопкой выше и попробуйте отредактировать текст.</p>',
  })

  useEffect(() => {
    editor?.setEditable(isEditable)
  }, [editor, isEditable])

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Editable toggle</h2>

      <button
        type="button"
        onClick={() => setIsEditable(v => !v)}
        style={{ marginBottom: '0.75rem', padding: '0.4rem 0.8rem' }}
      >
        Режим: {isEditable ? 'Редактирование' : 'Просмотр'}
      </button>

      <div
        style={{
          border: `2px solid ${isEditable ? '#22c55e' : '#9ca3af'}`,
          borderRadius: '8px',
          padding: '1rem',
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 1.3: Счётчик символов — Решение
// ============================================

const MAX_CHARS = 280

export function Task1_3_Solution() {
  const [charCount, setCharCount] = useState(0)
  const [wordCount, setWordCount] = useState(0)

  const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Начните печатать, чтобы увидеть счётчик символов и слов.</p>',
    onCreate: ({ editor }) => {
      const text = editor.getText()
      setCharCount(text.length)
      setWordCount(countWords(text))
    },
    onUpdate: ({ editor }) => {
      const text = editor.getText()
      setCharCount(text.length)
      setWordCount(countWords(text))
    },
  })

  const ratio = charCount / MAX_CHARS
  const color = ratio > 1 ? '#dc2626' : ratio > 0.9 ? '#f59e0b' : '#374151'

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Счётчик символов</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <div style={{ marginTop: '0.75rem', color, fontWeight: 600 }}>
        {charCount} / {MAX_CHARS} символов · {wordCount} слов
      </div>
    </div>
  )
}
