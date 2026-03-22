import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.1: form action
// Task 3.1: Form Action
// ============================================

// TODO: Создайте async-функцию для обработки формы
// TODO: Create an async function for form handling

export function Task3_1() {
  const { t } = useLanguage()

  // TODO: Создайте async action-функцию, принимающую FormData
  // TODO: Create an async action function that accepts FormData

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.1</h2>

      {/* TODO: Создайте форму с action={asyncFunction} */}
      {/* TODO: Create a form with action={asyncFunction} */}
    </div>
  )
}
