import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: useTransition + isPending
// Task 5.1: useTransition + isPending
// ============================================

// TODO: Импортируйте useTransition из 'react'
// TODO: Import useTransition from 'react'

export function Task5_1() {
  const { t } = useLanguage()

  // TODO: Используйте useTransition
  // TODO: Use useTransition

  // TODO: Создайте состояние для активной вкладки
  // TODO: Create state for active tab

  // TODO: Создайте функцию переключения вкладки через startTransition
  // TODO: Create a tab switching function via startTransition

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.1</h2>

      {/* TODO: Вкладки с отложенным рендерингом тяжёлого контента */}
      {/* TODO: Tabs with deferred rendering of heavy content */}
    </div>
  )
}
