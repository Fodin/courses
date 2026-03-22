import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.4: useDeferredValue initialValue
// Task 5.4: useDeferredValue initialValue
// ============================================

// TODO: Импортируйте useDeferredValue и useState из 'react'
// TODO: Import useDeferredValue and useState from 'react'

export function Task5_4() {
  const { t } = useLanguage()

  // TODO: Создайте состояние для поискового запроса
  // TODO: Create state for search query

  // TODO: Используйте useDeferredValue с initialValue (React 19)
  // TODO: Use useDeferredValue with initialValue (React 19)

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.4</h2>

      {/* TODO: Поле поиска с отложенным значением */}
      {/* TODO: Search input with deferred value */}
    </div>
  )
}
