import { useState } from 'react'

import { Extension, InputRule, Mark, markPasteRule } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 11.1: Markdown input rules — Решение
// ============================================

const HINTS = [
  { pattern: '## ', result: 'Заголовок H2' },
  { pattern: '**текст**', result: 'Bold' },
  { pattern: '* или - ', result: 'Маркированный список' },
  { pattern: '1. ', result: 'Нумерованный список' },
  { pattern: '> ', result: 'Цитата' },
]

export function Task11_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Печатайте здесь, чтобы опробовать markdown-подобные правила.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Markdown input rules</h2>

      <table style={{ marginBottom: '1rem', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <tbody>
          {HINTS.map(hint => (
            <tr key={hint.pattern}>
              <td style={{ padding: '0.25rem 0.75rem', fontFamily: 'monospace' }}>
                {hint.pattern}
              </td>
              <td style={{ padding: '0.25rem 0.75rem' }}>→ {hint.result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertContent(
              '<h2>Заголовок</h2><p><strong>Жирный текст</strong></p><ul><li>Пункт</li></ul>'
            )
            .run()
        }
      >
        Вставить примеры
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 11.2: Paste rules: автоссылки — Решение
// ============================================

const AutoLink = Mark.create({
  name: 'autoLink',

  addAttributes() {
    return {
      href: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'a[href]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['a', HTMLAttributes, 0]
  },

  addPasteRules() {
    return [
      markPasteRule({
        find: /https?:\/\/[^\s]+/g,
        type: this.type,
        getAttributes: match => ({ href: match[0] }),
      }),
    ]
  },
})

export function Task11_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, AutoLink],
    content: '<p>Вставьте сюда скопированный текст со ссылкой (Ctrl+V).</p>',
  })

  const sampleText = 'Смотрите https://tiptap.dev для примеров'

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Paste rules: автоссылки</h2>

      <div
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}
      >
        <input readOnly value={sampleText} style={{ flex: 1, padding: '0.4rem' }} />
        <button type="button" onClick={() => navigator.clipboard?.writeText(sampleText)}>
          Скопировать
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 11.3: Свой input rule — Решение
// ============================================

const SmileyInputRule = Extension.create({
  name: 'smileyInputRule',

  addInputRules() {
    return [
      new InputRule({
        find: /:\)$/,
        handler: ({ state, range }) => {
          state.tr.replaceWith(range.from, range.to, state.schema.text('🙂'))
        },
      }),
      new InputRule({
        find: /:\($/,
        handler: ({ state, range }) => {
          state.tr.replaceWith(range.from, range.to, state.schema.text('🙁'))
        },
      }),
    ]
  },
})

export function Task11_3_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, SmileyInputRule],
    content: '<p>Напечатайте :) или :( — они превратятся в эмодзи.</p>',
    onUpdate: () => forceRender(n => n + 1),
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Свой input rule</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
