import { useLanguage } from 'src/hooks'

// ============================================
// Задание 1.2: Editable toggle
// Task 1.2: Editable Toggle
// ============================================

// TODO: Импортируйте useState, useEffect из 'react'
// TODO: Import useState, useEffect from 'react'

// TODO: Импортируйте useEditor, EditorContent, StarterKit
// TODO: Import useEditor, EditorContent, StarterKit

export function Task1_2() {
  const { t } = useLanguage()

  // TODO: Заведите state isEditable (boolean, изначально true)
  // TODO: Create isEditable state (boolean, initially true)

  // TODO: Создайте editor через useEditor с StarterKit
  // TODO: Create editor via useEditor with StarterKit

  // TODO: В useEffect по изменению isEditable вызывайте editor?.setEditable(isEditable)
  // TODO: In useEffect on isEditable change call editor?.setEditable(isEditable)

  return (
    <div className="exercise-container">
      <h2>{t('task.1.2')}</h2>

      {/* TODO: Кнопка переключения isEditable с текстом "Режим: Редактирование"/"Режим: Просмотр" */}
      {/* TODO: Toggle button with text "Mode: Editing"/"Mode: View" */}

      {/* TODO: Контейнер с EditorContent, рамка меняет цвет в зависимости от isEditable */}
      {/* TODO: Container with EditorContent, border color depends on isEditable */}
    </div>
  )
}
