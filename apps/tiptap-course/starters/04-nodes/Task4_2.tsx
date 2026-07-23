import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.2: Списки
// Task 4.2: Lists
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

// TODO: Заведите content со вложенным маркированным списком (список внутри li)
// TODO: Define content with a nested bullet list (list inside a li)

export function Task4_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit и вашим content
  // TODO: Create editor via useEditor with StarterKit and your content

  return (
    <div className="exercise-container">
      <h2>{t('task.4.2')}</h2>

      {/* TODO: Кнопки "Маркированный список"/"Нумерованный список",
          toggleBulletList()/toggleOrderedList(), подсветка через isActive */}
      {/* TODO: Bullet/ordered list toggle buttons with isActive highlight */}

      {/* TODO: Отрендерите EditorContent + подсказку про Tab/Shift+Tab */}
      {/* TODO: Render EditorContent + Tab/Shift+Tab hint */}
    </div>
  )
}
