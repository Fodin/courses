import { useState, useCallback, createContext, useContext, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 7.3: React Error Context
// Task 7.3: React Error Context
// ============================================

// TODO: Создайте ErrorContext, ErrorProvider, useErrorContext
// TODO: Create ErrorContext, ErrorProvider, useErrorContext

// TODO: Создайте ErrorDisplay — показывает ошибки с кнопкой закрытия
// TODO: Create ErrorDisplay — shows errors with close button

export function Task7_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.7.3')}</h2>
      {/* TODO: ErrorProvider > ErrorDisplay + DemoComponent */}
    </div>
  )
}
