import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.3: Интерактивная нода
// Task 10.3: Interactive Node
// ============================================

// TODO: Импортируйте useState, useEffect, Node, useEditor, EditorContent,
// NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type NodeViewProps, StarterKit
// TODO: Import useState, useEffect, Node, useEditor, EditorContent,
// NodeViewWrapper, NodeViewContent, ReactNodeViewRenderer, type NodeViewProps, StarterKit

// TODO: function TodoItemComponent({ node, updateAttributes }: NodeViewProps) {
//   const checked = Boolean(node.attrs.checked)
//   // TODO: локальный state justToggled + useEffect со setTimeout для сброса
//   // TODO: local justToggled state + useEffect with setTimeout to reset it
//   const toggle = () => { updateAttributes({ checked: !checked }); /* setJustToggled(true) */ }
//   return (
//     <NodeViewWrapper>
//       <input type="checkbox" checked={checked} onChange={toggle} contentEditable={false} />
//       <NodeViewContent style={{ textDecoration: checked ? 'line-through' : 'none' }} />
//     </NodeViewWrapper>
//   )
// }
// TODO: Define TodoItemComponent (see above, add justToggled state/effect)

// TODO: const TodoItem = Node.create({
//   name: 'todoItem', group: 'block', content: 'inline*',
//   addAttributes() { return { checked: { default: false } } },
//   parseHTML() { return [{ tag: 'div[data-todo-item]' }] },
//   renderHTML({ HTMLAttributes }) { return ['div', { ...HTMLAttributes, 'data-todo-item': '' }, 0] },
//   addNodeView() { return ReactNodeViewRenderer(TodoItemComponent) },
// })
// TODO: Define TodoItem node (see above)

export function Task10_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + TodoItem
  // TODO: Create editor with StarterKit + TodoItem

  return (
    <div className="exercise-container">
      <h2>{t('task.10.3')}</h2>

      {/* TODO: Кнопка "Добавить задачу" — insertContent({ type: 'todoItem',
          content: [{ type: 'text', text: 'Новая задача' }] }) */}
      {/* TODO: "Add task" button with initial text content */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
