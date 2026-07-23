import { useLanguage } from 'src/hooks'

// ============================================
// Задание 10.2: NodeViewContent: редактируемая зона
// Task 10.2: NodeViewContent: Editable Zone
// ============================================

// TODO: Импортируйте Node, useEditor, EditorContent, NodeViewWrapper,
// NodeViewContent, ReactNodeViewRenderer, StarterKit
// TODO: Import Node, useEditor, EditorContent, NodeViewWrapper,
// NodeViewContent, ReactNodeViewRenderer, StarterKit

// TODO: function CardComponent() {
//   return (
//     <NodeViewWrapper>
//       <div contentEditable={false}>📇 Карточка</div>
//       <NodeViewContent />
//     </NodeViewWrapper>
//   )
// }
// TODO: Define CardComponent (see above)

// TODO: const Card = Node.create({
//   name: 'card', group: 'block', content: 'inline*',
//   parseHTML() { return [{ tag: 'div[data-card]' }] },
//   renderHTML({ HTMLAttributes }) { return ['div', { ...HTMLAttributes, 'data-card': '' }, 0] },
//   addNodeView() { return ReactNodeViewRenderer(CardComponent) },
// })
// TODO: Define Card node (see above)

export function Task10_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + Card
  // TODO: Create editor with StarterKit + Card

  return (
    <div className="exercise-container">
      <h2>{t('task.10.2')}</h2>

      {/* TODO: Кнопка "Вставить карточку" — insertContent({ type: 'card',
          content: [{ type: 'text', text: 'Текст карточки' }] }) */}
      {/* TODO: "Insert card" button with initial text content */}

      {/* TODO: Отрендерите EditorContent, стилизуйте карточку через CSS */}
      {/* TODO: Render EditorContent, style card via CSS */}
    </div>
  )
}
