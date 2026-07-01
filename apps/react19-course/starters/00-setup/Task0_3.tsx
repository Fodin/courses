import { useLanguage } from 'src/hooks'

// ============================================
// Задание 0.3: Breaking Changes
// Task 0.3: Breaking Changes
// ============================================

// TODO: Создайте интерактивный квиз или таблицу удалённых API в React 19
// TODO: Create an interactive quiz or table of removed APIs in React 19

// TODO: Для каждого удалённого API покажите замену
// TODO: For each removed API show the replacement

export function Task0_3() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 0.3</h2>

      {/* TODO: Создайте таблицу deprecated → replacement */}
      {/* TODO: Create a deprecated → replacement table */}
    </div>
  )
}
