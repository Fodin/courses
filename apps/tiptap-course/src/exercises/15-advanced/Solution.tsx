import { useState } from 'react'

import { Extension } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

// ============================================
// Задание 15.1: Decorations — Решение
// ============================================

interface SearchPluginState {
  query: string
}

const searchKey = new PluginKey<SearchPluginState>('search')

function searchDecorations(doc: ProseMirrorNode, query: string): DecorationSet {
  if (!query) return DecorationSet.empty
  const decorations: Decoration[] = []
  doc.descendants((node, pos) => {
    if (!node.isText) return
    const text = node.text ?? ''
    let index = 0
    while ((index = text.indexOf(query, index)) !== -1) {
      decorations.push(
        Decoration.inline(pos + index, pos + index + query.length, { class: 'search-match' })
      )
      index += query.length
    }
  })
  return DecorationSet.create(doc, decorations)
}

const SearchHighlight = Extension.create({
  name: 'searchHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin<SearchPluginState>({
        key: searchKey,
        state: {
          init: () => ({ query: '' }),
          apply(tr, prev) {
            const meta = tr.getMeta(searchKey) as SearchPluginState | undefined
            return meta ?? prev
          },
        },
        props: {
          decorations(state) {
            const { query } = searchKey.getState(state) ?? { query: '' }
            return searchDecorations(state.doc, query)
          },
        },
      }),
    ]
  },
})

export function Task15_1_Solution() {
  const [query, setQuery] = useState('')
  const [matchCount, setMatchCount] = useState(0)

  const editor = useEditor({
    extensions: [StarterKit, SearchHighlight],
    content:
      '<p>Tiptap — это headless-редактор. Tiptap построен на ProseMirror. С Tiptap легко работать.</p>',
  })

  const handleSearch = (value: string) => {
    setQuery(value)
    if (!editor) return
    editor.view.dispatch(editor.state.tr.setMeta(searchKey, { query: value }))
    let count = 0
    if (value) {
      editor.state.doc.descendants(node => {
        if (!node.isText) return
        const text = node.text ?? ''
        let index = 0
        while ((index = text.indexOf(value, index)) !== -1) {
          count += 1
          index += value.length
        }
      })
    }
    setMatchCount(count)
  }

  return (
    <div className="exercise-container search-demo">
      <h2>✅ Решение: Decorations</h2>

      <input
        value={query}
        onChange={e => handleSearch(e.target.value)}
        placeholder="Поиск..."
        style={{ marginBottom: '0.75rem', padding: '0.4rem', width: '200px' }}
      />
      <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
        Совпадений: {matchCount}
      </span>

      <div
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '0.5rem',
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .search-demo .search-match {
          background: #fde047;
          border-radius: 2px;
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 15.2: Drag handle — Решение
// ============================================

const dragHandleKey = new PluginKey('dragHandle')

const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: dragHandleKey,
        props: {
          decorations(state) {
            const decorations: Decoration[] = []
            state.doc.forEach((node, offset) => {
              const widget = Decoration.widget(
                offset + 1,
                () => {
                  const handle = document.createElement('span')
                  handle.textContent = '⠿'
                  handle.className = 'drag-handle'
                  handle.draggable = true
                  handle.setAttribute('data-pos', String(offset))
                  handle.addEventListener('dragstart', event => {
                    event.dataTransfer?.setData('text/plain', String(offset))
                  })
                  return handle
                },
                { side: -1 }
              )
              decorations.push(widget)
            })
            return DecorationSet.create(state.doc, decorations)
          },
          handleDOMEvents: {
            dragover(_view, event) {
              event.preventDefault()
              return true
            },
            drop(view, event) {
              event.preventDefault()
              const fromPosStr = event.dataTransfer?.getData('text/plain')
              if (!fromPosStr) return false
              const fromPos = Number(fromPosStr)
              const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
              if (!coords) return false

              const { state, dispatch } = view
              const node = state.doc.nodeAt(fromPos)
              if (!node) return false

              const nodeSize = node.nodeSize
              const tr = state.tr
              const slice = state.doc.slice(fromPos, fromPos + nodeSize)
              tr.delete(fromPos, fromPos + nodeSize)
              const mappedTo = tr.mapping.map(coords.pos)
              tr.insert(mappedTo, slice.content)
              dispatch(tr)
              return true
            },
          },
        },
      }),
    ]
  },
})

export function Task15_2_Solution() {
  const editor = useEditor({
    extensions: [StarterKit, DragHandle],
    content:
      '<p>Первый блок — наведите и перетащите.</p><p>Второй блок текста.</p><p>Третий блок текста для перетаскивания.</p>',
  })

  return (
    <div className="exercise-container drag-handle-demo">
      <h2>✅ Решение: Drag handle</h2>

      <div
        style={{ border: '1px solid #d1d5db', borderRadius: '8px', padding: '1rem 1rem 1rem 2rem' }}
      >
        <EditorContent editor={editor} />
      </div>

      <style>{`
        .drag-handle-demo .drag-handle {
          position: absolute;
          margin-left: -1.5rem;
          cursor: grab;
          color: #9ca3af;
          user-select: none;
        }
      `}</style>
    </div>
  )
}

// ============================================
// Задание 15.3: Программное управление выделением — Решение
// ============================================

interface HeadingEntry {
  pos: number
  text: string
  level: number
}

const TOC_CONTENT = `
  <h1>Введение</h1>
  <p>Немного вступительного текста.</p>
  <h2>Раздел первый</h2>
  <p>Текст первого раздела.</p>
  <h2>Раздел второй</h2>
  <p>Текст второго раздела.</p>
  <h3>Подраздел</h3>
  <p>Текст подраздела.</p>
`

export function Task15_3_Solution() {
  const [headings, setHeadings] = useState<HeadingEntry[]>([])

  const collectHeadings = (editor: NonNullable<ReturnType<typeof useEditor>>) => {
    const list: HeadingEntry[] = []
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'heading') {
        list.push({ pos, text: node.textContent, level: node.attrs.level as number })
      }
    })
    setHeadings(list)
  }

  const editor = useEditor({
    extensions: [StarterKit],
    content: TOC_CONTENT,
    onCreate: ({ editor }) => collectHeadings(editor),
    onUpdate: ({ editor }) => collectHeadings(editor),
  })

  return (
    <div className="exercise-container">
      <h2>✅ Решение: Программное управление выделением</h2>

      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ minWidth: '180px' }}>
          <h3>Оглавление</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {headings.map(h => (
              <li key={h.pos} style={{ marginLeft: (h.level - 1) * 12 }}>
                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#2563eb',
                    cursor: 'pointer',
                  }}
                  onClick={() =>
                    editor?.chain().focus().setTextSelection(h.pos).scrollIntoView().run()
                  }
                >
                  {h.text || '(пусто)'}
                </button>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => editor?.commands.selectAll()}>
            Выделить весь документ
          </button>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: '260px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '1rem',
          }}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
