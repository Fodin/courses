import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.2: Кастомный Node: Callout
// Task 9.2: Custom Node: Callout
// ============================================

// TODO: Импортируйте Node, mergeAttributes из '@tiptap/core',
// useEditor, EditorContent, StarterKit
// TODO: Import Node, mergeAttributes from '@tiptap/core',
// useEditor, EditorContent, StarterKit

// TODO: declare module '@tiptap/core' { interface Commands<ReturnType> {
//   callout: { setCallout: () => ReturnType }
// } }
// TODO: Declare module augmentation for Commands (see above)

// TODO: const Callout = Node.create({
//   name: 'callout', group: 'block', content: 'block+',
//   parseHTML() { return [{ tag: 'div[data-callout]' }] },
//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, { 'data-callout': '' }), 0]
//   },
//   addCommands() { return {
//     setCallout: () => ({ commands }) => commands.wrapIn(this.name),
//   } },
// })
// TODO: Define Callout node (see above)

export function Task9_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + Callout
  // TODO: Create editor with StarterKit + Callout

  return (
    <div className="exercise-container">
      <h2>{t('task.9.2')}</h2>

      {/* TODO: Кнопка "Вставить врезку" — editor?.chain().focus().setCallout().run() */}
      {/* TODO: "Insert callout" button — setCallout() */}

      {/* TODO: Отрендерите EditorContent, стилизуйте [data-callout] через CSS */}
      {/* TODO: Render EditorContent, style [data-callout] via CSS */}
    </div>
  )
}
