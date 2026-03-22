import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.2: Stylesheet Precedence
// Task 7.2: Stylesheet Precedence
// ============================================

// TODO: Загрузите стили с разным приоритетом
// через <link> с атрибутом precedence
// TODO: Load stylesheets with different priorities
// via <link> with the precedence attribute

export function Task7_2() {
  const { t } = useLanguage()
  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 7.2</h2>

      {/* TODO: Добавьте <link rel="stylesheet" precedence="default"> */}
      {/* TODO: Добавьте <link rel="stylesheet" precedence="high"> */}
      {/* TODO: Покажите результат загрузки стилей */}
    </div>
  )
}
