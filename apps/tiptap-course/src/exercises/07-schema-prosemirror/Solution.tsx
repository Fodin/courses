import { useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 7.1: Инспектор схемы — Решение
// ============================================

export function Task7_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Схема редактора описывает все допустимые узлы и marks.</p>',
  })

  const nodeEntries = editor ? Object.entries(editor.schema.nodes) : []
  const markEntries = editor ? Object.entries(editor.schema.marks) : []

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Инспектор схемы</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3>Nodes ({nodeEntries.length})</h3>
          <ul style={{ fontSize: '0.85rem' }}>
            {nodeEntries.map(([name, type]) => (
              <li key={name}>
                <code>{name}</code>
                {type.spec.content && (
                  <>
                    {' '}
                    — content: <code>{type.spec.content}</code>
                  </>
                )}
                {type.spec.group && (
                  <>
                    {' '}
                    · group: <code>{type.spec.group}</code>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '260px' }}>
          <h3>Marks ({markEntries.length})</h3>
          <ul style={{ fontSize: '0.85rem' }}>
            {markEntries.map(([name]) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Задание 7.2: Content-выражения — Решение
// ============================================

const BLOCKQUOTE_CONTENT = `
  <blockquote>
    <p>Первый параграф цитаты.</p>
    <p>Второй параграф той же цитаты.</p>
  </blockquote>
`

export function Task7_2_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit],
    content: BLOCKQUOTE_CONTENT,
    onSelectionUpdate: () => forceRender(n => n + 1),
    onUpdate: () => forceRender(n => n + 1),
  })

  const boldAvailable = editor?.can().toggleBold() ?? false

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Content-выражения</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() =>
            editor?.chain().focus('end').insertContent('<p>Новый параграф в конце.</p>').run()
          }
        >
          Добавить параграф в конец документа
        </button>
        <button type="button" onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
          Переключить Code Block
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <p style={{ marginTop: '0.75rem' }}>
        Bold {boldAvailable ? 'доступен' : 'недоступен'} в текущей позиции курсора (
        <code>editor.can().toggleBold()</code> = <strong>{String(boldAvailable)}</strong>)
      </p>
    </div>
  )
}

// ============================================
// Задание 7.3: Группы inline и block — Решение
// ============================================

export function Task7_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Текст для демонстрации группировки узлов схемы.</p>',
  })

  const nodeEntries = editor ? Object.entries(editor.schema.nodes) : []
  const blockNodes = nodeEntries.filter(([, type]) => type.spec.group === 'block')
  const inlineNodes = nodeEntries.filter(([, type]) => type.spec.group === 'inline')
  const otherNodes = nodeEntries.filter(
    ([, type]) => type.spec.group !== 'block' && type.spec.group !== 'inline'
  )

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Группы inline и block</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3>Block-ноды</h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Занимают всю ширину, идут одна за другой сверху вниз.
          </p>
          <ul>
            {blockNodes.map(([name]) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3>Inline-ноды</h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Существуют только внутри блочных узлов, текут внутри строки.
          </p>
          <ul>
            {inlineNodes.map(([name]) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3>Прочие</h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>
            Без явной группы — корень документа и базовый текстовый узел.
          </p>
          <ul>
            {otherNodes.map(([name]) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
