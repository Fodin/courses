import { useLanguage } from 'src/hooks'

// ============================================
// Задание 13.1: BubbleMenu при выделении
// Task 13.1: BubbleMenu on Selection
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit,
// BubbleMenu из '@tiptap/react/menus'
// TODO: Import useEditor, EditorContent, StarterKit,
// BubbleMenu from '@tiptap/react/menus'

export function Task13_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.13.1')}</h2>

      {/* TODO: {editor && <BubbleMenu editor={editor}>
          кнопки Bold/Italic/Link с isActive-подсветкой
        </BubbleMenu>} */}
      {/* TODO: Conditional BubbleMenu with Bold/Italic/Link buttons */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
