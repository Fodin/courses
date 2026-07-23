import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.1: HTML vs JSON
// Task 6.1: HTML vs JSON
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

export function Task6_1() {
  const { t } = useLanguage()

  // TODO: Заведите state mode: 'html' | 'json'
  // TODO: Create mode state: 'html' | 'json'

  // TODO: Создайте editor с богатым контентом (заголовок, bold, список),
  // используйте onUpdate чтобы триггерить перерендер (например forceRender state)
  // TODO: Create editor with rich content, use onUpdate to trigger re-render

  return (
    <div className="exercise-container">
      <h2>{t('task.6.1')}</h2>

      {/* TODO: Кнопки переключения HTML/JSON */}
      {/* TODO: HTML/JSON toggle buttons */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите editor?.getHTML() или JSON.stringify(editor?.getJSON(), null, 2)
          в зависимости от mode */}
      {/* TODO: Output getHTML() or stringified getJSON() depending on mode */}
    </div>
  )
}
