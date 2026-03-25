import { useState } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 4.4: Вложенные Boundaries
// Task 4.4: Nested Boundaries
// ============================================

// TODO: Используйте RecoverableErrorBoundary из задания 4.3
// TODO: Use RecoverableErrorBoundary from task 4.3

// TODO: Создайте макет с Header, Content, Sidebar
// TODO: Create layout with Header, Content, Sidebar
// - Sidebar: падает сразу
// - Content: падает по кнопке
// - Header: всегда работает

export function Task4_4() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.4.4')}</h2>
      {/* TODO: Каждая секция в своём Error Boundary */}
    </div>
  )
}
