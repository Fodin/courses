import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.1: ReactNodeViewRenderer: базовый NodeView
// Task 10.1: ReactNodeViewRenderer: Basic NodeView
// ============================================

// TODO: Импортируйте Node из '@tiptap/core',
// useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps
// из '@tiptap/react', StarterKit
// TODO: Import Node from '@tiptap/core',
// useEditor, EditorContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps
// from '@tiptap/react', StarterKit

// TODO: function CounterComponent({ node, updateAttributes, deleteNode }: NodeViewProps) {
//   const count = node.attrs.count as number
//   return (
//     <NodeViewWrapper>
//       <button onClick={() => updateAttributes({ count: count - 1 })}>-</button>
//       <span>{count}</span>
//       <button onClick={() => updateAttributes({ count: count + 1 })}>+</button>
//       <button onClick={() => deleteNode()}>×</button>
//     </NodeViewWrapper>
//   )
// }
// TODO: Define CounterComponent (see above)

// TODO: const Counter = Node.create({
//   name: 'counter', group: 'block', atom: true,
//   addAttributes() { return { count: { default: 0 } } },
//   parseHTML() { return [{ tag: 'div[data-counter]' }] },
//   renderHTML({ HTMLAttributes }) { return ['div', { ...HTMLAttributes, 'data-counter': '' }] },
//   addNodeView() { return ReactNodeViewRenderer(CounterComponent) },
// })
// TODO: Define Counter node (see above)

export function Task10_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + Counter
  // TODO: Create editor with StarterKit + Counter

  return (
    <div className="exercise-container">
      <h2>{t('task.10.1')}</h2>

      {/* TODO: Кнопка "Вставить счётчик" —
          editor?.chain().focus().insertContent({ type: 'counter' }).run() */}
      {/* TODO: "Insert counter" button */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
