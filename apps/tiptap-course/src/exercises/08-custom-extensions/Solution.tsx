import { useState } from 'react'

import { Extension } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 8.1: Extension.create и addOptions — Решение
// ============================================

interface MaxLengthOptions {
  maxLength: number
}

const MaxLength = Extension.create<MaxLengthOptions>({
  name: 'maxLength',
  addOptions() {
    return { maxLength: 280 }
  },
})

export function Task8_1_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, MaxLength.configure({ maxLength: 100 })],
    content: '<p>Введите текст и следите за лимитом символов.</p>',
    onUpdate: () => forceRender(n => n + 1),
  })

  const maxLengthExt = editor?.extensionManager.extensions.find(ext => ext.name === 'maxLength')
  const maxLength = (maxLengthExt?.options as MaxLengthOptions | undefined)?.maxLength ?? 0
  const currentLength = editor?.getText().length ?? 0

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Extension.create и addOptions</h2>

      <p>Лимит: {maxLength} символов</p>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <p style={{ color: currentLength > maxLength ? '#dc2626' : '#374151', marginTop: '0.5rem' }}>
        {currentLength} / {maxLength}
      </p>
    </div>
  )
}

// ============================================
// Задание 8.2: addStorage — Решение
// ============================================

interface EditStatsStorage {
  updatesCount: number
  totalChars: number
}

declare module '@tiptap/core' {
  interface Storage {
    editStats: EditStatsStorage
  }
}

const EditStats = Extension.create<Record<string, never>, EditStatsStorage>({
  name: 'editStats',
  addStorage() {
    return { updatesCount: 0, totalChars: 0 }
  },
  onUpdate() {
    this.storage.updatesCount += 1
    this.storage.totalChars = this.editor.getText().length
  },
})

export function Task8_2_Solution() {
  const [stats, setStats] = useState<EditStatsStorage>({ updatesCount: 0, totalChars: 0 })

  const editor = useEditor({
    extensions: [StarterKit, EditStats],
    content: '<p>Печатайте, чтобы увидеть статистику редактирования.</p>',
    onUpdate: ({ editor }) => {
      setStats({ ...editor.storage.editStats })
    },
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: addStorage</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <p style={{ marginTop: '0.5rem' }}>
        Изменений: {stats.updatesCount} · Символов сейчас: {stats.totalChars}
      </p>
    </div>
  )
}

// ============================================
// Задание 8.3: addGlobalAttributes — Решение
// ============================================

const IdAttribute = Extension.create({
  name: 'idAttribute',
  addGlobalAttributes() {
    return [
      {
        types: ['heading', 'paragraph'],
        attributes: {
          id: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('id'),
            renderHTML: (attributes: { id?: string | null }) => {
              if (!attributes.id) return {}
              return { id: attributes.id }
            },
          },
        },
      },
    ]
  },
})

export function Task8_3_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, IdAttribute],
    content: '<h2>Заголовок без ID</h2><p>Параграф без ID.</p>',
    onUpdate: () => forceRender(n => n + 1),
  })

  const assignId = () => {
    if (!editor) return
    const type = editor.isActive('heading') ? 'heading' : 'paragraph'
    editor
      .chain()
      .focus()
      .updateAttributes(type, { id: `block-${Date.now()}` })
      .run()
    forceRender(n => n + 1)
  }

  return (
    <div className="exercise-container">
      <h2>✅ Решение: addGlobalAttributes</h2>

      <button type="button" onClick={assignId} style={{ marginBottom: '0.75rem' }}>
        Присвоить ID текущему блоку
      </button>

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
          overflowX: 'auto',
        }}
      >
        {editor?.getHTML()}
      </pre>
    </div>
  )
}
