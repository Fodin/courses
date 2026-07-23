import { useEffect, useState } from 'react'

import { Node } from '@tiptap/core'
import {
  EditorContent,
  NodeViewContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type NodeViewProps,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 10.1: ReactNodeViewRenderer: базовый NodeView — Решение
// ============================================

function CounterComponent({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const count = node.attrs.count as number

  return (
    <NodeViewWrapper
      className="counter-node"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '0.4rem 0.6rem',
        margin: '0.25rem 0',
      }}
    >
      <button type="button" onClick={() => updateAttributes({ count: count - 1 })}>
        -
      </button>
      <span style={{ minWidth: '1.5rem', textAlign: 'center' }}>{count}</span>
      <button type="button" onClick={() => updateAttributes({ count: count + 1 })}>
        +
      </button>
      <button type="button" onClick={() => deleteNode()} aria-label="Удалить счётчик">
        ×
      </button>
    </NodeViewWrapper>
  )
}

const Counter = Node.create({
  name: 'counter',
  group: 'block',
  atom: true,

  addAttributes() {
    return { count: { default: 0 } }
  },

  parseHTML() {
    return [{ tag: 'div[data-counter]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-counter': '' }]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CounterComponent)
  },
})

export function Task10_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, Counter],
    content: '<p>Вставьте счётчик и увеличивайте/уменьшайте значение.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: ReactNodeViewRenderer</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() => editor?.chain().focus().insertContent({ type: 'counter' }).run()}
      >
        Вставить счётчик
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 10.2: NodeViewContent: редактируемая зона — Решение
// ============================================

function CardComponent() {
  return (
    <NodeViewWrapper
      className="card-node"
      style={{
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        padding: '0.75rem',
        margin: '0.5rem 0',
        background: '#f9fafb',
      }}
    >
      <div
        contentEditable={false}
        style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#374151' }}
      >
        📇 Карточка
      </div>
      <NodeViewContent className="card-body" />
    </NodeViewWrapper>
  )
}

const Card = Node.create({
  name: 'card',
  group: 'block',
  content: 'inline*',

  parseHTML() {
    return [{ tag: 'div[data-card]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-card': '' }, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardComponent)
  },
})

export function Task10_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, Card],
    content: '<p>Вставьте карточку и отредактируйте текст внутри неё.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: NodeViewContent</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertContent({
              type: 'card',
              content: [{ type: 'text', text: 'Текст карточки' }],
            })
            .run()
        }
      >
        Вставить карточку
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 10.3: Интерактивная нода — Решение
// ============================================

function TodoItemComponent({ node, updateAttributes }: NodeViewProps) {
  const checked = Boolean(node.attrs.checked)
  const [justToggled, setJustToggled] = useState(false)

  useEffect(() => {
    if (!justToggled) return
    const timer = setTimeout(() => setJustToggled(false), 400)
    return () => clearTimeout(timer)
  }, [justToggled])

  const toggle = () => {
    updateAttributes({ checked: !checked })
    setJustToggled(true)
  }

  return (
    <NodeViewWrapper
      className="todo-item-node"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.3rem 0.5rem',
        borderRadius: '6px',
        background: justToggled ? '#dbeafe' : 'transparent',
        transition: 'background 0.3s',
      }}
    >
      <input type="checkbox" checked={checked} onChange={toggle} contentEditable={false} />
      <NodeViewContent
        style={{
          textDecoration: checked ? 'line-through' : 'none',
          color: checked ? '#9ca3af' : 'inherit',
        }}
      />
    </NodeViewWrapper>
  )
}

const TodoItem = Node.create({
  name: 'todoItem',
  group: 'block',
  content: 'inline*',

  addAttributes() {
    return { checked: { default: false } }
  },

  parseHTML() {
    return [{ tag: 'div[data-todo-item]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', { ...HTMLAttributes, 'data-todo-item': '' }, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(TodoItemComponent)
  },
})

export function Task10_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, TodoItem],
    content: '<p>Добавьте задачи и отмечайте их выполненными.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Интерактивная нода</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() =>
          editor
            ?.chain()
            .focus()
            .insertContent({ type: 'todoItem', content: [{ type: 'text', text: 'Новая задача' }] })
            .run()
        }
      >
        Добавить задачу
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
