import { useLanguage } from 'src/hooks'

// ============================================
// Задание 6.2: setContent / insertContent
// Task 6.2: setContent / insertContent
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task6_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.6.2')}</h2>

      {/* TODO: Кнопка "Заменить документ" — editor?.commands.setContent('...') */}
      {/* TODO: "Replace document" button — editor?.commands.setContent('...') */}

      {/* TODO: Кнопка "Вставить шаблон" —
          editor?.chain().focus().insertContent('...').run() */}
      {/* TODO: "Insert template" button — insertContent */}

      {/* TODO: Кнопка "Вставить на позицию 0" —
          editor?.chain().focus().insertContentAt(0, '...').run() */}
      {/* TODO: "Insert at position 0" button — insertContentAt(0, ...) */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
