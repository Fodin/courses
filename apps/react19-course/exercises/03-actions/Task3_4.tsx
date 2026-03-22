import { useLanguage } from 'src/hooks'

// ============================================
// Задание 3.4: Прогрессивное улучшение
// Task 3.4: Progressive Enhancement
// ============================================

// TODO: Создайте форму, которая работает как с JS, так и без
// TODO: Create a form that works both with and without JS

export function Task3_4() {
  const { t } = useLanguage()

  // TODO: Используйте useActionState для серверного action
  // TODO: Use useActionState for server action

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 3.4</h2>

      {/* TODO: Создайте форму с hidden inputs и action для прогрессивного улучшения */}
      {/* TODO: Create a form with hidden inputs and action for progressive enhancement */}
    </div>
  )
}
