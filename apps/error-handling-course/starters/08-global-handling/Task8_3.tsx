import { useState, useCallback, createContext, useContext, type ReactNode } from 'react'
import { useLanguage } from 'src/hooks'

// ============================================
// Задание 8.3: React Error Context
// Task 8.3: React Error Context
// ============================================

// TODO: Создайте ErrorContext, ErrorProvider, useErrorContext
// TODO: Create ErrorContext, ErrorProvider, useErrorContext

// TODO: Создайте ErrorDisplay — показывает ошибки с кнопкой закрытия
// TODO: Create ErrorDisplay — shows errors with close button

export function Task8_3() {
  const { t } = useLanguage()

  return (
    <div className="exercise-container">
      <h2>{t('task.8.3')}</h2>
      {/* TODO: ErrorProvider > ErrorDisplay + DemoComponent */}
    </div>
  )
}
