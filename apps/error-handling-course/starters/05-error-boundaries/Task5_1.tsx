import { Component, useState, type ReactNode, type ErrorInfo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.1: Базовый Error Boundary
// Task 5.1: Basic Error Boundary
// ============================================

// TODO: Создайте интерфейс ErrorBoundaryState { hasError, error }
// TODO: Create interface ErrorBoundaryState { hasError, error }

// TODO: Создайте class BasicErrorBoundary extends Component
// TODO: Create class BasicErrorBoundary extends Component
// - getDerivedStateFromError(error) — установить hasError: true
// - componentDidCatch(error, errorInfo) — console.error
// - render() — если hasError, показать fallback

// TODO: Создайте BuggyCounter — падает при count === 3
// TODO: Create BuggyCounter — throws when count === 3

export function Task5_1() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.1')}</h2>
      {/* TODO: Оберните BuggyCounter в BasicErrorBoundary */}
    </div>
  )
}
