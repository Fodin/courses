import { Component, type ReactNode, type ErrorInfo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.2: Fallback UI
// Task 5.2: Fallback UI
// ============================================

// TODO: Создайте ErrorFallback компонент с красивым UI и <details> для стека
// TODO: Create ErrorFallback component with nice UI and <details> for stack

// TODO: Создайте FallbackErrorBoundary с пропом fallback?: (props) => ReactNode
// TODO: Create FallbackErrorBoundary with prop fallback?: (props) => ReactNode

export function Task5_2() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.2')}</h2>
      {/* TODO: Покажите стандартный и кастомный fallback */}
    </div>
  )
}
