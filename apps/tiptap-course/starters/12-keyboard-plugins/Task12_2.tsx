import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.2: addProseMirrorPlugins и decorations
// Task 12.2: addProseMirrorPlugins and Decorations
// ============================================

// TODO: Импортируйте useState, Extension из '@tiptap/core',
// Plugin, PluginKey из '@tiptap/pm/state', Decoration, DecorationSet из '@tiptap/pm/view',
// useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, Plugin, PluginKey, Decoration, DecorationSet,
// useEditor, EditorContent, StarterKit

// TODO: const HighlightTodo = Extension.create({
//   name: 'highlightTodo',
//   addProseMirrorPlugins() {
//     return [new Plugin({
//       key: new PluginKey('highlightTodo'),
//       props: {
//         decorations(state) {
//           const decorations = []
//           state.doc.descendants((node, pos) => {
//             if (!node.isText) return
//             const regex = /TODO/g
//             let match
//             while ((match = regex.exec(node.text ?? ''))) {
//               const from = pos + match.index
//               const to = from + match[0].length
//               decorations.push(Decoration.inline(from, to, { class: 'todo-highlight' }))
//             }
//           })
//           return DecorationSet.create(state.doc, decorations)
//         },
//       },
//     })]
//   },
// })
// TODO: Define HighlightTodo extension (see above)

export function Task12_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + HighlightTodo, используйте onUpdate
  // для триггера перерендера (декорации сами пересчитаются, но нужно для getHTML() снизу)
  // TODO: Create editor with StarterKit + HighlightTodo, trigger re-render on onUpdate

  return (
    <div className="exercise-container">
      <h2>{t('task.12.2')}</h2>

      {/* TODO: Отрендерите EditorContent, стилизуйте .todo-highlight (жёлтый фон) */}
      {/* TODO: Render EditorContent, style .todo-highlight (yellow background) */}

      {/* TODO: Выведите editor?.getHTML() под редактором для проверки */}
      {/* TODO: Output editor?.getHTML() below the editor for verification */}
    </div>
  )
}
