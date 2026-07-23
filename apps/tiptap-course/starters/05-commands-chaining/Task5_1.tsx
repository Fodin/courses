import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: Основы chain()
// Task 5.1: chain() Basics
// ============================================

// TODO: Импортируйте useState, useEditor, EditorContent, StarterKit
// TODO: Import useState, useEditor, EditorContent, StarterKit

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Заведите state updateCount (число), увеличивайте в onUpdate
  // TODO: Create updateCount state (number), increment it in onUpdate

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>

      {/* TODO: Кнопка "Раздельные вызовы" — editor?.commands.toggleBold() затем
          editor?.commands.toggleItalic() (два раздельных вызова) */}
      {/* TODO: "Separate calls" button — two separate editor.commands calls */}

      {/* TODO: Кнопка "Через chain()" —
          editor?.chain().focus().toggleBold().toggleItalic().run() */}
      {/* TODO: "Via chain()" button — one chained call */}

      {/* TODO: Кнопка "Сбросить счётчик" */}
      {/* TODO: "Reset counter" button */}

      {/* TODO: Отрендерите EditorContent и выведите updateCount */}
      {/* TODO: Render EditorContent and output updateCount */}
    </div>
  )
}
