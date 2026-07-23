import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: Inline code
// Task 3.2: Inline Code
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.3.2')}</h2>

      {/* TODO: Кнопка Code, вызывающая editor?.chain().focus().toggleCode().run() */}
      {/* подсвечивается через editor?.isActive('code'), title="Ctrl+E" */}
      {/* TODO: Code button calling toggleCode(), highlighted via isActive('code') */}

      {/* TODO: Отрендерите EditorContent, стилизуйте <code> моноширинным шрифтом */}
      {/* TODO: Render EditorContent, style <code> with monospace font */}
    </div>
  )
}
