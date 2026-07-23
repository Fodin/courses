import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.4: Atom/leaf-нода
// Task 9.4: Atom/Leaf Node
// ============================================

// TODO: Импортируйте useState, Node, mergeAttributes, useEditor, EditorContent, StarterKit
// TODO: Import useState, Node, mergeAttributes, useEditor, EditorContent, StarterKit

// TODO: declare module '@tiptap/core' { interface Commands<ReturnType> {
//   badge: { insertBadge: (label?: string) => ReturnType }
// } }
// TODO: Declare module augmentation for Commands (see above)

// TODO: const Badge = Node.create({
//   name: 'badge', group: 'inline', inline: true, atom: true,
//   addAttributes() { return { label: { default: 'NEW' } } },
//   parseHTML() { return [{ tag: 'span[data-badge]' }] },
//   renderHTML({ HTMLAttributes, node }) {
//     return ['span', mergeAttributes(HTMLAttributes, { 'data-badge': '' }), node.attrs.label]
//   },
//   addCommands() { return {
//     insertBadge: (label = 'NEW') => ({ commands }) =>
//       commands.insertContent({ type: this.name, attrs: { label } }),
//   } },
// })
// TODO: Define Badge node (see above)

export function Task9_4() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + Badge
  // TODO: Create editor with StarterKit + Badge

  return (
    <div className="exercise-container">
      <h2>{t('task.9.4')}</h2>

      {/* TODO: Кнопка "Вставить бейдж" — editor?.chain().focus().insertBadge('NEW').run() */}
      {/* TODO: "Insert badge" button — insertBadge('NEW') */}

      {/* TODO: Отрендерите EditorContent, стилизуйте [data-badge] как маленькую таблетку */}
      {/* TODO: Render EditorContent, style [data-badge] as a small pill */}
    </div>
  )
}
