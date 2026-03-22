import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.2: Оптимистичный список
// Task 4.2: Optimistic List
// ============================================

// TODO: Импортируйте useOptimistic из 'react'
// TODO: Import useOptimistic from 'react'

export function Task4_2() {
  const { t } = useLanguage()

  // TODO: Создайте состояние для списка элементов
  // TODO: Create state for item list

  // TODO: Используйте useOptimistic с reducer для массива
  // TODO: Use useOptimistic with a reducer for the array

  // TODO: Создайте async-функцию для добавления элемента
  // TODO: Create an async function for adding an item

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 4.2</h2>

      {/* TODO: Форма добавления и список элементов */}
      {/* TODO: Add form and item list */}
    </div>
  )
}
