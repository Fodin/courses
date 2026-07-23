import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.1: Инспектор схемы
// Task 7.1: Schema Inspector
// ============================================

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task7_1() {
  const { t } = useLanguage()

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  // TODO: Получите nodeEntries = Object.entries(editor?.schema.nodes ?? {})
  // и markEntries = Object.entries(editor?.schema.marks ?? {})
  // TODO: Get nodeEntries and markEntries from editor.schema

  return (
    <div className="exercise-container">
      <h2>{t('task.7.1')}</h2>

      {/* TODO: Отрендерите EditorContent */}
      {/* TODO: Render EditorContent */}

      {/* TODO: Выведите список nodes (имя, spec.content, spec.group) и список marks */}
      {/* TODO: Output nodes list (name, spec.content, spec.group) and marks list */}
    </div>
  )
}
