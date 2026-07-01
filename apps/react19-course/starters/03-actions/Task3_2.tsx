import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.2: useActionState
// Task 3.2: useActionState
// ============================================

// TODO: Импортируйте useActionState из 'react'
// TODO: Import useActionState from 'react'

// TODO: Определите тип состояния формы
// TODO: Define form state type

export function Task3_2() {
  const { t } = useLanguage()

  // TODO: Создайте action-функцию с валидацией
  // TODO: Create an action function with validation

  // TODO: Используйте useActionState(submitAction, initialState)
  // TODO: Use useActionState(submitAction, initialState)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.2</h2>

      {/* TODO: Создайте форму с валидацией через useActionState */}
      {/* TODO: Create a form with validation via useActionState */}
    </div>
  )
}
