import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: Async transitions
// Task 5.2: Async Transitions
// ============================================

// TODO: Импортируйте useTransition и useState из 'react'
// TODO: Import useTransition and useState from 'react'

export function Task5_2() {
  const { t } = useLanguage()

  // TODO: Используйте useTransition для async-функции
  // TODO: Use useTransition with an async function

  // TODO: Загрузите данные внутри startTransition
  // TODO: Load data inside startTransition

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.2</h2>

      {/* TODO: Кнопка загрузки данных с isPending индикатором */}
      {/* TODO: Data loading button with isPending indicator */}
    </div>
  )
}
