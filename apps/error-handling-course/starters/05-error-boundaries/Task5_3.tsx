import { Component, useState, type ReactNode, type ErrorInfo } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 5.3: Восстановление после ошибки
// Task 5.3: Error Recovery
// ============================================

// TODO: Создайте RecoverableErrorBoundary с кнопкой "Попробовать снова"
// TODO: Create RecoverableErrorBoundary with "Try again" button
// - handleReset: сбросить hasError, увеличить resetKey
// - render children с key={resetKey}

// TODO: Создайте RandomFailure — компонент, падающий с 50% шансом
// TODO: Create RandomFailure — component that throws with 50% chance

export function Task5_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.5.3')}</h2>
      {/* TODO: RecoverableErrorBoundary с RandomFailure */}
    </div>
  )
}
