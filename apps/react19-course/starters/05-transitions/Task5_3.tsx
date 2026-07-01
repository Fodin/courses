import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.3: Suspense при навигации
// Task 5.3: Suspense with Navigation
// ============================================

// TODO: Импортируйте Suspense, lazy, useTransition, useState из 'react'
// TODO: Import Suspense, lazy, useTransition, useState from 'react'

export function Task5_3() {
  const { t } = useLanguage()

  // TODO: Создайте lazy-loaded компоненты
  // TODO: Create lazy-loaded components

  // TODO: Используйте useTransition для навигации
  // TODO: Use useTransition for navigation

  return (
    <div className="exercise-container">
      <h2>{t('task.title')} 5.3</h2>

      {/* TODO: Навигация с Suspense fallback */}
      {/* TODO: Navigation with Suspense fallback */}
    </div>
  )
}
