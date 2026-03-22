import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.3: Откат при ошибке
// Task 4.3: Rollback on Error
// ============================================

// TODO: Импортируйте useOptimistic из 'react'
// TODO: Import useOptimistic from 'react'

export function Task4_3() {
  const { t } = useLanguage()

  // TODO: Создайте состояние и оптимистичную версию
  // TODO: Create state and optimistic version

  // TODO: Реализуйте action с try/catch для отката
  // TODO: Implement action with try/catch for rollback

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.3</h2>

      {/* TODO: UI с оптимистичным обновлением и откатом при ошибке */}
      {/* TODO: UI with optimistic update and rollback on error */}
    </div>
  )
}
