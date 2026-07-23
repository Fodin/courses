import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.3: Хоткей + плагин вместе
// Task 12.3: Shortcut + Plugin Together
// ============================================

// TODO: Импортируйте useState, Extension, Plugin, PluginKey, Decoration, DecorationSet,
// useEditor, EditorContent, StarterKit
// TODO: Import useState, Extension, Plugin, PluginKey, Decoration, DecorationSet,
// useEditor, EditorContent, StarterKit

// TODO: interface LongLineHighlighterStorage { enabled: boolean }
// TODO: declare module '@tiptap/core' { interface Storage { longLineHighlighter: LongLineHighlighterStorage } }
// TODO: Define storage type + module augmentation (see above)

// TODO: const LongLineHighlighter = Extension.create({
//   name: 'longLineHighlighter',
//   addStorage() { return { enabled: false } },
//   addKeyboardShortcuts() {
//     return { 'Mod-Shift-l': () => {
//       this.storage.enabled = !this.storage.enabled
//       this.editor.view.dispatch(this.editor.state.tr)
//       return true
//     } }
//   },
//   addProseMirrorPlugins() {
//     const extensionStorage = this.storage
//     return [new Plugin({
//       key: new PluginKey('longLineHighlighter'),
//       props: { decorations: (state) => {
//         if (!extensionStorage.enabled) return DecorationSet.empty
//         const decorations = []
//         state.doc.descendants((node, pos) => {
//           if (!node.isTextblock) return
//           if ((node.textContent ?? '').length > 80) {
//             decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: 'long-line' }))
//           }
//         })
//         return DecorationSet.create(state.doc, decorations)
//       } },
//     })]
//   },
// })
// TODO: Define LongLineHighlighter extension (see above)

export function Task12_3() {
  const { t } = useLanguage()

  // TODO: Заведите state enabled (boolean)
  // TODO: Create enabled state (boolean)

  // TODO: Создайте editor со StarterKit + LongLineHighlighter,
  // синхронизируйте enabled через onTransaction
  // TODO: Create editor, sync enabled state via onTransaction

  return (
    <div className="exercise-container">
      <h2>{t('task.12.3')}</h2>

      {/* TODO: Выведите текущее состояние enabled + подсказку про Ctrl/Cmd+Shift+L */}
      {/* TODO: Output current enabled state + Ctrl/Cmd+Shift+L hint */}

      {/* TODO: Отрендерите EditorContent, стилизуйте .long-line */}
      {/* TODO: Render EditorContent, style .long-line */}
    </div>
  )
}
