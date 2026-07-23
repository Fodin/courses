import { useLanguage } from 'src/hooks'

// ============================================
// Задание 11.3: Свой input rule
// Task 11.3: Your Own Input Rule
// ============================================

// TODO: Импортируйте useState, Extension, InputRule из '@tiptap/core',
// useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, InputRule from '@tiptap/core',
// useEditor, EditorContent, StarterKit

// TODO: const SmileyInputRule = Extension.create({
//   name: 'smileyInputRule',
//   addInputRules() { return [
//     new InputRule({
//       find: /:\)$/,
//       handler: ({ state, range }) => {
//         state.tr.replaceWith(range.from, range.to, state.schema.text('🙂'))
//       },
//     }),
//     // TODO: аналогичное правило для :( → 🙁
//     // TODO: similar rule for :( → 🙁
//   ] },
// })
// TODO: Define SmileyInputRule extension (see above)

export function Task11_3() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + SmileyInputRule
  // TODO: Create editor with StarterKit + SmileyInputRule

  return (
    <div className="exercise-container">
      <h2>{t('task.11.3')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
