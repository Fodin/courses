import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.3: Настраиваемые атрибуты
// Task 9.3: Configurable Attributes
// ============================================

// TODO: Импортируйте Node, mergeAttributes, useEditor, EditorContent, StarterKit
// TODO: Import Node, mergeAttributes, useEditor, EditorContent, StarterKit

// TODO: declare module '@tiptap/core' { interface Commands<ReturnType> {
//   typedCallout: {
//     setTypedCallout: () => ReturnType
//     setCalloutType: (type: 'info' | 'warning' | 'error') => ReturnType
//   }
// } }
// TODO: Declare module augmentation for Commands (see above)

// TODO: const TypedCallout = Node.create({
//   name: 'typedCallout', group: 'block', content: 'block+',
//   addAttributes() { return { type: { default: 'info', parseHTML: ..., renderHTML: ... } } },
//   parseHTML() { return [{ tag: 'div[data-typed-callout]' }] },
//   renderHTML({ HTMLAttributes }) {
//     return ['div', mergeAttributes(HTMLAttributes, { 'data-typed-callout': '' }), 0]
//   },
//   addCommands() { return {
//     setTypedCallout: () => ({ commands }) => commands.wrapIn(this.name),
//     setCalloutType: (type) => ({ commands }) => commands.updateAttributes(this.name, { type }),
//   } },
// })
// TODO: Define TypedCallout node (see above)

export function Task9_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + TypedCallout
  // TODO: Create editor with StarterKit + TypedCallout

  return (
    <div className="exercise-container">
      <h2>{t('task.9.3')}</h2>

      {/* TODO: Кнопки "Вставить врезку", "Info", "Warning", "Error" */}
      {/* TODO: "Insert callout", "Info", "Warning", "Error" buttons */}

      {/* TODO: Отрендерите EditorContent, стилизуйте типы через
          [data-callout-type="warning"/"error"] в CSS */}
      {/* TODO: Render EditorContent, style types via CSS attribute selectors */}
    </div>
  )
}
