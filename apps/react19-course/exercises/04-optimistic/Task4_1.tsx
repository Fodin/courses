import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.1: Базовый useOptimistic
// Task 4.1: Basic useOptimistic
// ============================================

// TODO: Импортируйте useOptimistic из 'react'
// TODO: Import useOptimistic from 'react'

export function Task4_1() {
  const { t } = useLanguage()

  // TODO: Создайте состояние liked (useState)
  // TODO: Create liked state (useState)

  // TODO: Используйте useOptimistic для оптимистичного обновления
  // TODO: Use useOptimistic for optimistic update

  // TODO: Создайте async-функцию для toggle лайка
  // TODO: Create an async function for like toggle

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.1</h2>

      {/* TODO: Кнопка лайка с мгновенным отображением */}
      {/* TODO: Like button with instant display */}
    </div>
  )
}
