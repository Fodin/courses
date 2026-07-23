import { useLanguage } from 'src/hooks'

// ============================================
// Задание 12.1: addKeyboardShortcuts
// Task 12.1: addKeyboardShortcuts
// ============================================

// TODO: Импортируйте Extension из '@tiptap/core', useEditor, EditorContent, StarterKit
// TODO: Import Extension from '@tiptap/core', useEditor, EditorContent, StarterKit

// TODO: const CustomShortcuts = Extension.create({
//   name: 'customShortcuts',
//   addKeyboardShortcuts() {
//     return {
//       'Mod-Shift-x': () => this.editor.chain().focus().toggleStrike().run(),
//       'Mod-Shift-c': () => this.editor.chain().focus().unsetAllMarks().clearNodes().run(),
//     }
//   },
// })
// TODO: Define CustomShortcuts extension (see above)

export function Task12_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + CustomShortcuts
  // TODO: Create editor with StarterKit + CustomShortcuts

  return (
    <div className="exercise-container">
      <h2>{t('task.12.1')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Список шорткатов (Ctrl/Cmd+Shift+X, Ctrl/Cmd+Shift+C) */}
      {/* TODO: Shortcuts list */}
    </div>
  )
}
