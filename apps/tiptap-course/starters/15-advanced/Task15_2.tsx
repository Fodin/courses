import { useLanguage } from 'src/hooks'

// ============================================
// Задание 15.2: Drag handle
// Task 15.2: Drag Handle
// ============================================

// TODO: Импортируйте Extension, Plugin, PluginKey, Decoration, DecorationSet,
// useEditor, EditorContent, StarterKit
// TODO: Import Extension, Plugin, PluginKey, Decoration, DecorationSet,
// useEditor, EditorContent, StarterKit

// TODO: const DragHandle = Extension.create({
//   name: 'dragHandle',
//   addProseMirrorPlugins() {
//     return [new Plugin({
//       key: new PluginKey('dragHandle'),
//       props: {
//         decorations(state) {
//           // TODO: для каждого top-level узла state.doc.forEach((node, offset) => {...})
//           // создайте Decoration.widget(offset + 1, () => { ...создать <span> ручку... }, { side: -1 })
//         },
//         handleDOMEvents: {
//           dragover(_view, event) { event.preventDefault(); return true },
//           drop(view, event) {
//             // TODO: считать fromPos из dataTransfer, вычислить toPos через view.posAtCoords,
//             // переместить содержимое узла через tr.delete + tr.insert
//           },
//         },
//       },
//     })]
//   },
// })
// TODO: Define DragHandle extension (see above)

export function Task15_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + DragHandle, с несколькими параграфами
  // TODO: Create editor with StarterKit + DragHandle, several paragraphs

  return (
    <div className="exercise-container">
      <h2>{t('task.15.2')}</h2>

      {/* TODO: Отрендерите EditorContent, стилизуйте .drag-handle */}
      {/* TODO: Render EditorContent, style .drag-handle */}
    </div>
  )
}
