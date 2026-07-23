import { useState } from 'react'

import { Mark, mergeAttributes, Node } from '@tiptap/core'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 9.1: Кастомный Mark: Highlight — Решение
// ============================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    highlight: {
      setHighlight: (color?: string) => ReturnType
      unsetHighlight: () => ReturnType
    }
  }
}

const Highlight = Mark.create({
  name: 'highlight',

  addAttributes() {
    return {
      color: {
        default: '#fff3a3',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-color'),
        renderHTML: (attributes: { color?: string }) => ({
          'data-color': attributes.color,
          style: `background-color: ${attributes.color}`,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'mark' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['mark', mergeAttributes(HTMLAttributes), 0]
  },

  addCommands() {
    return {
      setHighlight:
        (color?: string) =>
        ({ commands }) =>
          commands.setMark(this.name, { color }),
      unsetHighlight:
        () =>
        ({ commands }) =>
          commands.unsetMark(this.name),
    }
  },
})

const HIGHLIGHT_COLORS = ['#fff3a3', '#c4f1c4', '#c4dcf1', '#f1c4dc']

export function Task9_1_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: '<p>Выделите текст и выберите цвет выделения.</p>',
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Кастомный Mark: Highlight</h2>

      <div
        style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}
      >
        {HIGHLIGHT_COLORS.map(color => (
          <button
            key={color}
            type="button"
            onClick={() => editor?.chain().focus().setHighlight(color).run()}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: color,
              border: '1px solid #d1d5db',
              cursor: 'pointer',
            }}
            aria-label={`Выделить цветом ${color}`}
          />
        ))}
        <button type="button" onClick={() => editor?.chain().focus().unsetHighlight().run()}>
          Убрать выделение
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

// ============================================
// Задание 9.2: Кастомный Node: Callout — Решение
// ============================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: () => ReturnType
    }
  }
}

const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',

  parseHTML() {
    return [{ tag: 'div[data-callout]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
  },

  addCommands() {
    return {
      setCallout:
        () =>
        ({ commands }) =>
          commands.wrapIn(this.name),
    }
  },
})

export function Task9_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, Callout],
    content: '<p>Поставьте курсор здесь и вставьте врезку.</p>',
  })

  return (
    <div className="exercise-container callout-demo">
      <h2>✅ Решение: Кастомный Node: Callout</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() => editor?.chain().focus().setCallout().run()}
      >
        Вставить врезку
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .callout-demo [data-callout] {
          border-left: 4px solid #3b82f6;
          background: #eff6ff;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin: 0.75rem 0;
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 9.3: Настраиваемые атрибуты — Решение
// ============================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    typedCallout: {
      setTypedCallout: () => ReturnType
      setCalloutType: (type: 'info' | 'warning' | 'error') => ReturnType
    }
  }
}

const TypedCallout = Node.create({
  name: 'typedCallout',
  group: 'block',
  content: 'block+',

  addAttributes() {
    return {
      type: {
        default: 'info',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-callout-type'),
        renderHTML: (attributes: { type?: string }) => ({
          'data-callout-type': attributes.type,
        }),
      },
    }
  },

  parseHTML() {
    return [{ tag: 'div[data-typed-callout]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-typed-callout': '' }), 0]
  },

  addCommands() {
    return {
      setTypedCallout:
        () =>
        ({ commands }) =>
          commands.wrapIn(this.name),
      setCalloutType:
        (type: 'info' | 'warning' | 'error') =>
        ({ commands }) =>
          commands.updateAttributes(this.name, { type }),
    }
  },
})

export function Task9_3_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, TypedCallout],
    content: '<p>Вставьте врезку и переключайте её тип.</p>',
  })

  return (
    <div className="exercise-container typed-callout-demo">
      <h2>✅ Решение: Настраиваемые атрибуты</h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <button type="button" onClick={() => editor?.chain().focus().setTypedCallout().run()}>
          Вставить врезку
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setCalloutType('info').run()}>
          Info
        </button>
        <button
          type="button"
          onClick={() => editor?.chain().focus().setCalloutType('warning').run()}
        >
          Warning
        </button>
        <button type="button" onClick={() => editor?.chain().focus().setCalloutType('error').run()}>
          Error
        </button>
      </div>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .typed-callout-demo [data-typed-callout] {
          border-left: 4px solid #3b82f6;
          background: #eff6ff;
          padding: 0.75rem 1rem;
          border-radius: 4px;
          margin: 0.75rem 0;
        }
        .typed-callout-demo [data-callout-type="warning"] {
          border-left-color: #f59e0b;
          background: #fffbeb;
        }
        .typed-callout-demo [data-callout-type="error"] {
          border-left-color: #dc2626;
          background: #fef2f2;
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 9.4: Atom/leaf-нода — Решение
// ============================================

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    badge: {
      insertBadge: (label?: string) => ReturnType
    }
  }
}

const Badge = Node.create({
  name: 'badge',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      label: { default: 'NEW' },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-badge]' }]
  },

  renderHTML({ HTMLAttributes, node }) {
    return ['span', mergeAttributes(HTMLAttributes, { 'data-badge': '' }), node.attrs.label]
  },

  addCommands() {
    return {
      insertBadge:
        (label = 'NEW') =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { label } }),
    }
  },
})

export function Task9_4_Solution() {
  const [, forceRender] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, Badge],
    content: '<p>Поставьте курсор в текст и вставьте бейдж.</p>',
    onUpdate: () => forceRender(n => n + 1),
  })

  return (
    <div className="exercise-container badge-demo">
      <h2>✅ Решение: Atom/leaf-нода</h2>

      <button
        type="button"
        style={{ marginBottom: '0.75rem' }}
        onClick={() => editor?.chain().focus().insertBadge('NEW').run()}
      >
        Вставить бейдж
      </button>

      <div style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem' }}>
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .badge-demo [data-badge] {
          display: inline-block;
          background: #3b82f6;
          color: #fff;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 0.1rem 0.5rem;
          border-radius: 999px;
          margin: 0 0.2rem;
        }
      `}</style>
    </div>
  )
}
