import { useState } from 'react'

import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 12.1: addKeyboardShortcuts — Решение
// ============================================

const CustomShortcuts = Extension.create({
  name: 'customShortcuts',

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-x': () => this.editor.chain().focus().toggleStrike().run(),
      'Mod-Shift-c': () => this.editor.chain().focus().unsetAllMarks().clearNodes().run(),
    }
  },
})

export function Task12_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, CustomShortcuts],
    content: '<p>Выделите текст и попробуйте свои горячие клавиши.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: addKeyboardShortcuts</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <ul style={{ marginTop: '0.75rem', fontSize: '0.85rem' }}>
        <li>
          <code>Ctrl/Cmd + Shift + X</code> — зачеркнуть текст
        </li>
        <li>
          <code>Ctrl/Cmd + Shift + C</code> — очистить форматирование
        </li>
      </ul>
    </div>
  )
}

// ============================================
// Задание 12.2: addProseMirrorPlugins и decorations — Решение
// ============================================

const highlightTodoKey = new PluginKey('highlightTodo')

const HighlightTodo = Extension.create({
  name: 'highlightTodo',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: highlightTodoKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            state.doc.descendants((node, pos) => {
              if (!node.isText) return
              const regex = /TODO/g
              let match: RegExpExecArray | null
              while ((match = regex.exec(node.text ?? ''))) {
                const from = pos + match.index
                const to = from + match[0].length
                decorations.push(Decoration.inline(from, to, { class: 'todo-highlight' }))
              }
            })
            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})

export function Task12_2_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, HighlightTodo],
    content: '<p>TODO: написать теорию. Затем TODO: собрать задания.</p>',
    onUpdate: () => forceRender(n => n + 1),
  })

  return (
    <div className="exercise-container todo-highlight-demo">
      <h2>✅ Решение: addProseMirrorPlugins и decorations</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <pre
        style={{
          background: '#f3f4f6',
          padding: '0.75rem',
          borderRadius: '6px',
          marginTop: '0.75rem',
          fontSize: '0.8rem',
        }}
      >
        {editor?.getHTML()}
      </pre>

      <style>{`
        .todo-highlight-demo .todo-highlight {
          background: #fef08a;
          font-weight: bold;
          border-radius: 3px;
          padding: 0 2px;
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 12.3: Хоткей + плагин вместе — Решение
// ============================================

const longLineKey = new PluginKey('longLineHighlighter')

interface LongLineHighlighterStorage {
  enabled: boolean
}

declare module '@tiptap/core' {
  interface Storage {
    longLineHighlighter: LongLineHighlighterStorage
  }
}

const LongLineHighlighter = Extension.create({
  name: 'longLineHighlighter',

  addStorage() {
    return { enabled: false }
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-l': () => {
        this.storage.enabled = !this.storage.enabled
        this.editor.view.dispatch(this.editor.state.tr)
        return true
      },
    }
  },

  addProseMirrorPlugins() {
    const extensionStorage = this.storage
    return [
      new Plugin({
        key: longLineKey,
        props: {
          decorations: state => {
            if (!extensionStorage.enabled) return DecorationSet.empty
            const decorations: Decoration[] = []
            state.doc.descendants((node, pos) => {
              if (!node.isTextblock) return
              if ((node.textContent ?? '').length > 80) {
                decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'long-line' }))
              }
            })
            return DecorationSet.create(state.doc, decorations)
          },
        },
      }),
    ]
  },
})

export function Task12_3_Solution() {
  const [enabled, setEnabled] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit, LongLineHighlighter],
    content:
      '<p>Короткий текст.</p><p>Это очень длинный абзац текста, который содержит более восьмидесяти символов и должен подсвечиваться, когда режим включён.</p>',
    onTransaction: ({ editor }) => setEnabled(editor.storage.longLineHighlighter.enabled),
  })

  return (
    <div className="exercise-container long-line-demo">
      <h2>✅ Решение: Хоткей + плагин вместе</h2>

      <p>
        Режим подсветки длинных строк: <strong>{enabled ? 'включён' : 'выключен'}</strong> (
        <code>Ctrl/Cmd + Shift + L</code>)
      </p>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .long-line-demo .long-line {
          background: #fee2e2;
          border-left: 3px solid #dc2626;
          padding-left: 0.5rem;
        }
      `}</style>
    </div>
  )
}
