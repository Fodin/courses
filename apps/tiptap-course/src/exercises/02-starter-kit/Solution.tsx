import { useState } from 'react'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 2.1: Обзор StarterKit — Решение
// ============================================

const OVERVIEW_CONTENT = `
  <h1>Заголовок H1</h1>
  <p>Параграф с <strong>bold</strong>, <em>italic</em>, <s>strike</s> и <code>inline code</code>.</p>
  <ul><li>Пункт списка 1</li><li>Пункт списка 2</li></ul>
  <ol><li>Первый</li><li>Второй</li></ol>
  <blockquote><p>Цитата из StarterKit</p></blockquote>
  <pre><code>const x = 42</code></pre>
  <hr />
  <p>Текст после разделителя.</p>
`

export function Task2_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: OVERVIEW_CONTENT,
  })

  const extensionNames = editor?.extensionManager.extensions.map(ext => ext.name) ?? []

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Обзор StarterKit</h2>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <h3 style={{ marginTop: '1rem' }}>Активные extensions ({extensionNames.length})</h3>
      <ul>
        {extensionNames.map(name => (
          <li key={name}>
            <code>{name}</code>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ============================================
// Задание 2.2: Отключение extensions — Решение
// ============================================

const fullExtensions = [StarterKit]
const minimalExtensions = [
  StarterKit.configure({
    heading: false,
    bulletList: false,
    orderedList: false,
    blockquote: false,
    codeBlock: false,
    horizontalRule: false,
  }),
]

function ModeEditor({ mode }: { mode: 'full' | 'minimal' }) {
  const editor = useEditor({
    extensions: mode === 'full' ? fullExtensions : minimalExtensions,
    content: '<h2>Заголовок (если доступен)</h2><p>Обычный параграф.</p>',
  })

  return (
    <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
      <EditorContent editor={editor} />
    </div>
  )
}

export function Task2_2_Solution() {
  const [mode, setMode] = useState<'full' | 'minimal'>('full')

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Отключение extensions</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" disabled={mode === 'full'} onClick={() => setMode('full')}>
          Full
        </button>
        <button type="button" disabled={mode === 'minimal'} onClick={() => setMode('minimal')}>
          Minimal
        </button>
      </div>

      <ModeEditor key={mode} mode={mode} />
    </div>
  )
}

// ============================================
// Задание 2.3: Точечная конфигурация — Решение
// ============================================

const pointConfigExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2] },
    bulletList: { HTMLAttributes: { class: 'my-bullet-list' } },
    undoRedo: { depth: 50 },
  }),
]

export function Task2_3_Solution() {
  const editor = useEditor({
    extensions: pointConfigExtensions,
    content: '<p>Настройте заголовки кнопками ниже.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Точечная конфигурация</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
          style={{ fontWeight: editor?.isActive('heading', { level: 1 }) ? 'bold' : 'normal' }}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          style={{ fontWeight: editor?.isActive('heading', { level: 2 }) ? 'bold' : 'normal' }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Уровень 3 не разрешён конфигурацией"
        >
          H3 (недоступен)
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
