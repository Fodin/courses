import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: Bold / Italic / Strike
// Task 3.1: Bold / Italic / Strike
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.3.1')}</h2>

      {/* TODO: Три кнопки Bold/Italic/Strike, каждая вызывает toggleX()
          и подсвечивается через editor?.isActive('...') */}
      {/* TODO: Three buttons Bold/Italic/Strike, each calling toggleX()
          and highlighted via editor?.isActive('...') */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
