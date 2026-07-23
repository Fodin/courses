import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: Проверка can()
// Task 5.2: can() Checks
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>

      {/* TODO: Кнопка Undo — disabled={!editor?.can().undo()},
          onClick вызывает editor?.chain().focus().undo().run() */}
      {/* TODO: Undo button — disabled via can().undo(), onClick calls undo command */}

      {/* TODO: Кнопка Redo — аналогично, через can().redo() и redo() */}
      {/* TODO: Redo button — same pattern with redo() */}

      {/* TODO: Кнопка Bold — disabled={!editor?.can().toggleBold()} */}
      {/* TODO: Bold button — disabled via can().toggleBold() */}

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}
    </div>
  )
}
