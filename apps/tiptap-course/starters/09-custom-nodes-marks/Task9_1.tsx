import { useLanguage } from 'src/hooks'

// ============================================
// Задание 9.1: Кастомный Mark: Highlight
// Task 9.1: Custom Mark: Highlight
// ============================================

// TODO: Импортируйте Mark, mergeAttributes из '@tiptap/core',
// useEditor, EditorContent, StarterKit
// TODO: Import Mark, mergeAttributes from '@tiptap/core',
// useEditor, EditorContent, StarterKit

// TODO: declare module '@tiptap/core' { interface Commands<ReturnType> {
//   highlight: { setHighlight: (color?: string) => ReturnType; unsetHighlight: () => ReturnType }
// } }
// TODO: Declare module augmentation for Commands (see above)

// TODO: const Highlight = Mark.create({
//   name: 'highlight',
//   addAttributes() { return { color: { default: '#fff3a3', parseHTML: ..., renderHTML: ... } } },
//   parseHTML() { return [{ tag: 'mark' }] },
//   renderHTML({ HTMLAttributes }) { return ['mark', mergeAttributes(HTMLAttributes), 0] },
//   addCommands() { return {
//     setHighlight: (color) => ({ commands }) => commands.setMark(this.name, { color }),
//     unsetHighlight: () => ({ commands }) => commands.unsetMark(this.name),
//   } },
// })
// TODO: Define Highlight mark (see above)

// TODO: const HIGHLIGHT_COLORS = ['#fff3a3', '#c4f1c4', '#c4dcf1', '#f1c4dc']
// TODO: Define HIGHLIGHT_COLORS palette

export function Task9_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor со StarterKit + Highlight
  // TODO: Create editor with StarterKit + Highlight

  return (
    <div className="exercise-container">
      <h2>{t('task.9.1')}</h2>

      {/* TODO: Кнопки-кружки палитры цветов, каждая вызывает
          editor?.chain().focus().setHighlight(color).run() */}
      {/* TODO: Color palette circle buttons calling setHighlight(color) */}

      {/* TODO: Кнопка "Убрать выделение" — unsetHighlight() */}
      {/* TODO: "Remove highlight" button — unsetHighlight() */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
