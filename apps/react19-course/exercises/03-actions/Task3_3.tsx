import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.3: useFormStatus
// Task 3.3: useFormStatus
// ============================================

// TODO: Импортируйте useFormStatus из 'react-dom'
// TODO: Import useFormStatus from 'react-dom'

export function Task3_3() {
  const { t } = useLanguage()

  // TODO: Создайте async action
  // TODO: Create an async action

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.3</h2>

      {/* TODO: Создайте форму с компонентом SubmitButton, использующим useFormStatus */}
      {/* TODO: Create a form with a SubmitButton component that uses useFormStatus */}
    </div>
  )
}

// TODO: Создайте компонент SubmitButton, использующий useFormStatus
// TODO: Create a SubmitButton component that uses useFormStatus
